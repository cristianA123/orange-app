import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEmail,
  MinLength,
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
}
