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
  id: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  instituteId: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  subtype: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber({ maxDecimalPlaces: 6 })
  @Type(() => Number)
  @IsNotEmpty()
  location_lat: number;

  @IsNumber({ maxDecimalPlaces: 6 })
  @Type(() => Number)
  @IsNotEmpty()
  location_lng: number;

  @IsString()
  @IsNotEmpty()
  form_type: string;

  @IsOptional()
  @IsString()
  officer_name?: string;

  @IsOptional()
  @IsString()
  phone_number?: string;

  @IsOptional()
  @IsString()
  sender_name?: string;

  @IsOptional()
  @IsString()
  camera_number?: string;

  @IsOptional()
  @IsString()
  document_number?: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  attention_date?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  closing_date?: Date;

  @IsBoolean()
  @Type(() => Boolean)
  is_relevant: boolean;

  @IsNumber()
  @Type(() => Number)
  status: number;
}
