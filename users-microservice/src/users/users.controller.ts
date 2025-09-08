import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/UpdateUser.dto';
import { CreateUserStaffDTO } from './dtos/CreateUserStaff.dto';
import { UpdateUserStaffDTO } from './dtos/UpdateUserStaff.dto';
import { ChangePasswordDto } from './dtos/ChangePassword.dto';

@Controller()
export class UsersMicroserviceController {
  constructor(private usersService: UsersService) {}
  @MessagePattern({ cmd: 'createUser' })
  async createUser(@Payload() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @MessagePattern({ cmd: 'GET_USERS' })
  getUsers() {
    return this.usersService.findAll();
  }

  @MessagePattern({ cmd: 'GET_USER' })
  getUserById(@Payload() data) {
    const { userId } = data;
    return this.usersService.getUserById(userId);
  }

  @EventPattern('paymentCreated')
  paymentCreated(@Payload() data: any) {
    console.log('pago');
    console.log(data);
    console.log('pago');
  }

  @MessagePattern({ cmd: 'VALIDATE_USER_BY_ID' })
  async validateUserById(@Payload() data: { userId: string }) {
    return this.usersService.validateUserById(data.userId);
  }

  @MessagePattern({ cmd: 'UPDATE_USER' })
  update(@Payload() updateUserDTO: UpdateUserDTO) {
    return this.usersService.update(updateUserDTO.id, updateUserDTO);
  }

  @MessagePattern({ cmd: 'DELETE_USER' })
  remove(@Payload() id: string) {
    return this.usersService.remove(id);
  }
  @MessagePattern({ cmd: 'GET_USER_BY_INSTITUTE_ID' })
  getUserByInstituteId(@Payload() payload: { instituteId: string }) {
    return this.usersService.getUserByInstituteId(payload.instituteId);
  }
  @MessagePattern({ cmd: 'GET_USER_SECURITY_BY_INSTITUTE_ID' })
  getUsersSecurityByInstituteId(@Payload() payload: { instituteId: string }) {
    return this.usersService.getUsersSecurityByInstituteId(payload.instituteId);
  }
  @MessagePattern({ cmd: 'CREATE_USER_STAFF' })
  createUserStaff(@Payload() createUserStaffDTO: CreateUserStaffDTO) {
    return this.usersService.createUserStaff(createUserStaffDTO);
  }
  @MessagePattern({ cmd: 'UPDATE_USER_STAFF' })
  updateUserStaff(@Payload() updateUserStaffDTO: UpdateUserStaffDTO) {
    return this.usersService.updateUserStaff(updateUserStaffDTO);
  }
  @MessagePattern({ cmd: 'FIND_USER_ID_NAME_DNI' })
  findUserIdNameDni(@Payload() payload: { instituteId: string }) {
    return this.usersService.findUserIdNameDni(payload.instituteId);
  }

  @MessagePattern({ cmd: 'CHANGE_PASSWORD' })
  changePassword(
    @Payload()
    payload: {
      user_id: string;
      changePasswordDTO: ChangePasswordDto;
    },
  ) {
    console.log(payload);
    return this.usersService.changePassword(
      payload.changePasswordDTO,
      payload.user_id,
    );
  }
}
