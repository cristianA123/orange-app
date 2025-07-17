// import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateInstituteDto } from './create-institute.dto';

export class UpdateInstituteDto extends CreateInstituteDto {
  id: number;
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  img: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  address: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  ruc: string;
}
