import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SendIncidentEmailDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

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

  @IsBoolean()
  @Type(() => Boolean)
  isRelevant: boolean;

  @IsOptional()
  @IsString()
  officerName?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  senderName?: string;
}
