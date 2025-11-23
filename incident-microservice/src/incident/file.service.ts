import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import {
  FileStatus,
  FileType,
  Incident,
  IncidentFile,
} from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { successResponse } from 'src/common/response/response.util';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class S3Service {
  private readonly s3: S3;
  private readonly configService: ConfigService;

  constructor(
    configService: ConfigService,
    @InjectRepository(IncidentFile)
    private incidentFilesRepository: Repository<IncidentFile>,
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
  ) {
    this.configService = configService;
    this.s3 = new S3({
      region: this.configService.get('s3.region'),
      credentials: {
        accessKeyId: this.configService.get('s3.accessKeyId'),
        secretAccessKey: this.configService.get('s3.secretAccessKey'),
      },
    });
  }

  // funcion para subir archivos
  async uploadFile(payload: any) {
    const { buffer, filename, mimetype, id, instituteId } = payload;

    // Convertir de Base64 a Buffer
    const fileBuffer = Buffer.from(buffer, 'base64');

    const newFileNameUuid = `${randomUUID()}-${filename}`;
    const s3Key = instituteId
      ? `media/${instituteId}/${newFileNameUuid}`
      : newFileNameUuid;

    const params = {
      Bucket: this.configService.get('s3.bucket'),
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimetype,
    };

    try {
      const result = await this.s3.upload(params).promise();
      console.log('result');
      console.log(result);
      console.log('result');
      const incident = await this.incidentRepository.findOne({
        where: { id },
      });
      const incidentFile = this.incidentFilesRepository.create({
        fileName: newFileNameUuid,
        id: randomUUID(),
        url: result.Location,
        file_type: FileType.IMAGE,
        size: fileBuffer.length,
        mime_type: mimetype,
        incident: incident,
      });

      const savedIncidentFile =
        await this.incidentFilesRepository.save(incidentFile);
      return successResponse(savedIncidentFile, 'Archivo guardado');
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  // 🔹 NUEVO MÉTODO: Generar URL pre-firmada
  async generatePresignedUrl(payload: any) {
    const { filename, mimetype, id, instituteId } = payload;

    const newFileNameUuid = `${randomUUID()}-${filename}`;
    const s3Key = instituteId
      ? `media/${instituteId}/${newFileNameUuid}`
      : newFileNameUuid;

    const params = {
      Bucket: this.configService.get('s3.bucket'),
      Key: s3Key,
      Expires: 3600, // 1 hora en segundos
      ContentType: mimetype,
    };

    const signedUrl = await this.s3.getSignedUrlPromise('putObject', params);

    // Guardar metadata ANTES de la subida
    const incident = await this.incidentRepository.findOne({
      where: { id },
    });

    if (!incident) {
      throw new RpcException({
        message: `No se encontró la incidencia con ID: ${id}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const incidentFile = this.incidentFilesRepository.create({
      fileName: newFileNameUuid,
      id: randomUUID(),
      url: `https://${params.Bucket}.s3.${this.configService.get(
        's3.region',
      )}.amazonaws.com/${s3Key}`,
      file_type: this.getFileType(mimetype),
      size: 0, // Se actualizará después con confirmUpload
      mime_type: mimetype,
      incident: incident,
      status: FileStatus.PENDING, // NUEVO CAMPO
    });

    const savedIncidentFile =
      await this.incidentFilesRepository.save(incidentFile);

    return successResponse(
      {
        signedUrl,
        fileId: savedIncidentFile.id,
        key: s3Key,
        requiredHeaders: {
          // 👈 INFORMAR al frontend los headers requeridos
          'Content-Type': mimetype,
        },
      },
      'URL pre-firmada generada',
    );
  }

  // 🔹 NUEVO MÉTODO: Confirmar subida exitosa
  async confirmUpload(payload: any) {
    const { fileId, fileSize } = payload;

    // buscar la incidencia por fileId
    const incidentFile = await this.incidentFilesRepository.findOne({
      where: { id: fileId },
    });

    if (!incidentFile) {
      throw new RpcException({
        message: `No se encontró el archivo con ID: ${fileId}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    // Actualizar metadata con el tamaño confirmado
    await this.incidentFilesRepository.update(fileId, {
      size: fileSize,
      status: FileStatus.COMPLETED,
    });

    return successResponse(null, 'Archivo subido y confirmado exitosamente');
  }

  // 🔹 MÉTODO AUXILIAR: Determinar tipo de archivo
  public getFileType(mimetype: string): FileType {
    if (mimetype.startsWith('video/')) return FileType.VIDEO;
    if (mimetype.startsWith('image/')) return FileType.IMAGE;
    if (mimetype.startsWith('application/pdf')) return FileType.PDF;
    return FileType.OTHER;
  }
}
