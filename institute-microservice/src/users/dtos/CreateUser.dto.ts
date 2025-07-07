import { UserRole, UserStatus } from 'src/typeorm/entities/User';

export class CreateUserDto {
  id: string;
  institute_id: string;
  name: string;
  email: string;
  password: string;
  identifier: string;
  status: UserStatus;
  rol: UserRole;
}
