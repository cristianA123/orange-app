import { IsString, IsUUID, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class CreateContractDto {
  @IsString()
  @IsUUID()
  peopleId: string;

  @IsString()
  @IsUUID()
  contractTypeId: string;

  @IsString()
  @IsUUID()
  areaId: string;

  @IsString()
  @IsUUID()
  cargoId: string;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsOptional()
  @IsString()
  @IsUUID()
  cvFileId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  tdrFileId?: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  contractFileId?: string;

  @IsOptional()
  @IsString()
  workedTime?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
