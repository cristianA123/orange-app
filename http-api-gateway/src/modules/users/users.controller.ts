import {
  Controller,
  Inject,
  Post,
  Body,
  Get,
  Param,
  // HttpException,
  HttpCode,
  HttpStatus,
  Patch,
  Delete,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/erros/error-handler';
import { UpdateUserDTO } from './dtos/updateUser.dto';

@Controller('/user')
export class UsersController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);

    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'createUser' }, createUserDto),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findOne() {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'GET_USERS' }, {}),
    );

    console.log(1);

    return response;
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_USER' }, { userId: id }),
      );
      // if (user) return user;
      // else throw new HttpException('User Not Found', 404);
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Payload() updateUserDto: UpdateUserDTO,
  ) {
    try {
      console.log(1);
      console.log(updateUserDto);
      console.log(1);
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'UPDATE_USER' }, { ...updateUserDto, id }),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'DELETE_USER' }, id),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }
}
