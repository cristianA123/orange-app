import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  IsNumber,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateIncidentDTO {
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  type: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  subType: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  address: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  officerId?: string;

  @IsNumber({ maxDecimalPlaces: 6 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  locationLat: number;

  @IsNumber({ maxDecimalPlaces: 6 })
  @Type(() => Number)
  @IsNotEmpty()
  @IsOptional()
  locationLng: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  formType: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  officerName?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  senderName?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  cameraNumber?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  documentNumber?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  attentionDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @IsOptional()
  closingDate?: Date;

  @IsBoolean()
  @Type(() => Boolean)
  @IsOptional()
  isRelevant: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  status?: number;

  @IsString()
  @IsUUID()
  @IsOptional()
  peopleId: string;
}
