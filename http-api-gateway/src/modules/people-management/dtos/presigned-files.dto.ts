import { IsString, IsEnum } from 'class-validator';

export enum ContractFileType {
  CV = 'CV',
  TDR = 'TDR',
  CONTRACT = 'CONTRACT',
  TERMINATION = 'TERMINATION',
  OTHER = 'OTHER',
}

export class PresignedFilesDto {
  @IsString()
  filename: string;

  @IsString()
  mimetype: string;

  @IsEnum(ContractFileType)
  fileType: ContractFileType;
}
