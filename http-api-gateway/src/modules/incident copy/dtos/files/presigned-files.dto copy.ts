import { IsNumber, IsString, IsUUID } from 'class-validator';

export class ConfirmFilesDto {
  @IsString()
  @IsUUID()
  fileId: string;

  @IsNumber()
  fileSize: number;
}
