import { IsString } from 'class-validator';

export class PresignedFilesDto {
  @IsString()
  filename: string;

  @IsString()
  mimetype: string;
}
