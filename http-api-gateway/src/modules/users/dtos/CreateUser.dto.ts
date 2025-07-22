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

export class CreateUserDto {
  @IsUUID()
  @IsNotEmpty()
  institute_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  identifier: string;

  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;

  @IsEnum(UserRole)
  @IsNotEmpty()
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
