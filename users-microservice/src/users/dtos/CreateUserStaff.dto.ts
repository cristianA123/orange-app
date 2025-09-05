import { UserRole, UserStatus } from 'src/typeorm/entities/User';

export class CreateUserStaffDTO {
  id: string;
  institute_id: string;
  name: string;
  email: string;
  password: string;
  status: UserStatus;
  rol: UserRole;

  lastName: string;
  documentType: string;
  documentNumber: string;
  jobLevel: string;
  area: string;
  areaGroup: string;
  entryDate: Date;
  contractType: string;

  gender: string;
}
