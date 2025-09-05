import { Controller } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UsersService } from './users.service';
import { UpdateUserDTO } from './dtos/UpdateUser.dto';

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
}
