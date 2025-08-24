import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEmail,
  MinLength,
  IsOptional,
} from 'class-validator';
import { UserRole, UserStatus } from 'src/typeorm/entities/User';

export class UpdateUserDTO {
  @IsUUID()
  @IsNotEmpty()
  @IsOptional()
  institute_id: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  identifier: string;

  @IsEnum(UserStatus)
  @IsNotEmpty()
  @IsOptional()
  status: UserStatus;

  @IsEnum(UserRole)
  @IsNotEmpty()
  @IsOptional()
  rol: UserRole;

  @IsString()
  @IsOptional()
  lastName: string;
  @IsString()
  @IsOptional()
  documentType: string;
  @IsString()
  @IsOptional()
  documentNumber: string;

  @IsString()
  @IsOptional()
  jobLevel: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  area: string;
  @IsString()
  @IsOptional()
  areaGroup: string;
  @IsString()
  @IsOptional()
  entryDate: Date;
  @IsString()
  @IsOptional()
  contractType: string;
}
