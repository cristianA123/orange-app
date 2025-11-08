import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsInt,
} from 'class-validator';

export class ChildDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsBoolean()
  differentAbility?: boolean;

  @IsOptional()
  @IsBoolean()
  conadis?: boolean;

  @IsOptional()
  @IsString()
  document?: string;

  @IsOptional()
  @IsInt()
  age?: number;
}
