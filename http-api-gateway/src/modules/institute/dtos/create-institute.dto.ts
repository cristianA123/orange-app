import { IsString, IsEnum } from 'class-validator';
import { InstituteStatus } from 'src/typeorm/entities/Institute';

export class CreateInstituteDto {
  @IsString()
  name: string;

  @IsString()
  img: string;

  @IsString()
  address: string;

  @IsEnum(InstituteStatus)
  status: InstituteStatus;
}
