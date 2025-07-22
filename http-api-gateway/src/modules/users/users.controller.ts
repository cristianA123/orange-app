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

@Controller('/users')
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

  @Get(':id')
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

  // @Get('/:id')
  // @HttpCode(HttpStatus.OK)
  // async findOne(@Param('id') id: string) {
  //   const response = await lastValueFrom(
  //     this.natsClient.send({ cmd: 'GET_INSTITUTE' }, id),
  //   );

  //   return response;
  // }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Payload() updateInstituteDto: UpdateUserDTO,
  ) {
    console.log(id);
    console.log(updateInstituteDto);
    const response = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'UPDATE_INSTITUTE' },
        { ...updateInstituteDto, id },
      ),
    );

    return response;
  }

  @Delete('/:id')
  async remove(@Param('id') id: string) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'DELETE_INSTITUTE' }, id),
    );

    return response;
  }
}
