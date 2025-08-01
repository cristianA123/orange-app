import { InstituteStatus } from 'src/typeorm/entities';

export class CreateInstituteDto {
  name: string;

  img: string;

  address: string;

  ruc: string;

  status: InstituteStatus;
}
