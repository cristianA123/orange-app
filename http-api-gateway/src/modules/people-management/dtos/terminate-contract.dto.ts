import { IsString, IsUUID, IsDateString, IsOptional } from 'class-validator';

export class TerminateContractDto {
  @IsString()
  @IsUUID()
  contractId: string;

  @IsDateString()
  endDate: Date;

  @IsString()
  reasonForTermination: string;

  @IsOptional()
  @IsString()
  workedTime?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  terminationDocFileId?: string;
}
