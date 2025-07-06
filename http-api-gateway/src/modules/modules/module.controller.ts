import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ModuleResponse } from './mapper/module.mapper';
import { NatsAuthGuard } from '../auth/guards/auth.guards';
import { RequestWithUser } from './interfaces/request-with-user.interface';

@Controller('modules')
export class ModuleController {
  constructor(
    @Inject('NATS_SERVICE')
    private readonly natsClient: ClientProxy,
  ) {}

  @UseGuards(NatsAuthGuard)
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getModules(@Req() req: RequestWithUser) {
    const userId = req.user.id;

    const modules = await lastValueFrom(
      this.natsClient.send({ cmd: 'GET_USER_MODULES' }, { userId }),
    );

    return ModuleResponse(modules);
  }
}
