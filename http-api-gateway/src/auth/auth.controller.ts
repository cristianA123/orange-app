import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginUserDto } from './dtos/LoginUser.dto';

@Controller('auth')
export class AuthController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    return await lastValueFrom(
      this.natsClient.send({ cmd: 'auth_login' }, loginUserDto),
    );
  }
}
