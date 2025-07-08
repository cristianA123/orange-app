import { IsString, IsNotEmpty } from 'class-validator';

export class CreateInstituteDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  img: string;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  ruc: string;

  // @IsEnum(InstituteStatus)
  // status: InstituteStatus;
}
