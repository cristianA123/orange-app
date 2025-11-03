import { IsOptional, IsString } from 'class-validator';

// src/incident/dtos/upload-files.dto.ts
export class UploadFilesDto {
  @IsString()
  @IsOptional()
  description?: string;

  files: Array<{
    fileBuffer: Buffer;
    originalName: string;
    mimeType: string;
    size: number;
  }>;
}
