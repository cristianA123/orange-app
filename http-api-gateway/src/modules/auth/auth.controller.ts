import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { LoginUserDto } from './dtos/LoginUser.dto';
import { RefreshTokenDto } from './dtos/RefreshToken.dto';
import { AuthResponse } from './mapper/auth.mapper';
import { handleRpcError } from '../../exceptions/handle-rpc-error.util';
import { Token } from './decorators/token.decorator';
import { UserDecorator } from './decorators/user.decorator';
import { NatsAuthGuard } from './guards/auth.guards';

@Controller('auth')
export class AuthController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'AUTH_LOGIN' }, loginUserDto),
      );
      return AuthResponse(response);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() dto: RefreshTokenDto) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'AUTH_REFRESH' }, dto),
      );
      return AuthResponse(response);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @UseGuards(NatsAuthGuard)
  @Get('verify')
  async verifyToken(
    @UserDecorator()
    user: {
      id: string;
      name: string;
      email: string;
    },
    @Token() token: string,
  ) {
    return { user, token };
  }
}
