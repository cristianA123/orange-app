import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { FileType, Incident, IncidentFile } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { successResponse } from 'src/common/response/response.util';

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
    const { buffer, filename, mimetype, id } = payload;

    // Convertir de Base64 a Buffer
    const fileBuffer = Buffer.from(buffer, 'base64');

    const newFileNameUudi = `${randomUUID()}-${filename}`;

    const params = {
      Bucket: this.configService.get('s3.bucket'),
      Key: newFileNameUudi,
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
        fileName: newFileNameUudi,
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

  async getSignedUrl(fileName: string, contentType: string): Promise<string> {
    const params = {
      Bucket: this.configService.get('s3.bucket'),
      Key: `${Date.now()}-${fileName}`,
      Expires: 60, // válido por 60 segundos
      ContentType: contentType,
    };

    try {
      const signedUrl = await this.s3.getSignedUrlPromise('putObject', params);
      return signedUrl;
    } catch (error) {
      throw new Error(`Failed to generate signed URL: ${error.message}`);
    }
  }
}
