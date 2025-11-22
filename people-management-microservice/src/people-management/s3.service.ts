import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import {
  ContractFile,
  ContractFileType,
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
    @InjectRepository(ContractFile)
    private contractFilesRepository: Repository<ContractFile>,
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

  async uploadFile(payload: any) {
    const { buffer, filename, mimetype, fileType, size, extension } = payload;

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

      const contractFile = this.contractFilesRepository.create({
        fileName: newFileNameUudi,
        url: result.Location,
        mimeType: mimetype,
        size: size || fileBuffer.length,
        extension: extension || filename.split('.').pop(),
        fileType: fileType || ContractFileType.OTHER,
      });

      const savedContractFile = await this.contractFilesRepository.save(contractFile);
      return successResponse(savedContractFile, 'Archivo guardado');
    } catch (error) {
      throw new Error(`Failed to upload file to S3: ${error.message}`);
    }
  }

  async generatePresignedUrl(payload: any) {
    const { filename, mimetype, fileType, size, extension } = payload;

    const newFileNameUudi = `${randomUUID()}-${filename}`;

    const params = {
      Bucket: this.configService.get('s3.bucket'),
      Key: newFileNameUudi,
      Expires: 3600,
      ContentType: mimetype,
    };

    const signedUrl = await this.s3.getSignedUrlPromise('putObject', params);

    const contractFile = this.contractFilesRepository.create({
      fileName: newFileNameUudi,
      url: `https://${params.Bucket}.s3.${this.configService.get(
        's3.region',
      )}.amazonaws.com/${newFileNameUudi}`,
      mimeType: mimetype,
      size: size || 0,
      extension: extension || filename.split('.').pop(),
      fileType: fileType || ContractFileType.OTHER,
    });

    const savedContractFile = await this.contractFilesRepository.save(contractFile);

    return successResponse(
      {
        signedUrl,
        fileId: savedContractFile.id,
        key: newFileNameUudi,
        requiredHeaders: {
          'Content-Type': mimetype,
        },
      },
      'URL pre-firmada generada',
    );
  }

  async confirmUpload(payload: any) {
    const { fileId, fileSize } = payload;

    const contractFile = await this.contractFilesRepository.findOne({
      where: { id: fileId },
    });

    if (!contractFile) {
      throw new RpcException({
        message: `No se encontró el archivo con ID: ${fileId}`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    await this.contractFilesRepository.update(fileId, {
      size: fileSize,
    });

    return successResponse(null, 'Archivo subido y confirmado exitosamente');
  }
}
