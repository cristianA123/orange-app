import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  subType: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  officerId: string;

  @IsNumber({ maxDecimalPlaces: 6 })
  @Type(() => Number)
  @IsNotEmpty()
  locationLat: number;

  @IsNumber({ maxDecimalPlaces: 6 })
  @Type(() => Number)
  @IsNotEmpty()
  locationLng: number;

  @IsString()
  @IsNotEmpty()
  formType: string;

  @IsOptional()
  @IsString()
  officerName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  senderName?: string;

  @IsOptional()
  @IsString()
  cameraNumber?: string;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  attentionDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  closingDate?: Date;

  @IsBoolean()
  @Type(() => Boolean)
  isRelevant: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  status?: number;

  @IsString()
  @IsNotEmpty()
  @IsUUID()
  peopleId: string;
}
