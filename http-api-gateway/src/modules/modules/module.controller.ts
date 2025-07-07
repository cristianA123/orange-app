import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ModuleResponse } from './mapper/module.mapper';
import { NatsAuthGuard } from '../auth/guards/auth.guards';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { SyncModuleDto } from './dtos/sync.dto';
import { handleRpcError } from 'src/common/erros/error-handler';

@Controller('modules')
export class ModuleController {
  constructor(
    @Inject('NATS_SERVICE')
    private readonly natsClient: ClientProxy,
  ) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getModules() {
    try {
      const modules = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_MODULES' }, {}),
      );

      return {
        success: true,
        data: modules,
      };
    } catch (err) {
      handleRpcError(err);
    }
  }

  @UseGuards(NatsAuthGuard)
  @Get('/me')
  @HttpCode(HttpStatus.OK)
  async getModulesUser(@Req() req: RequestWithUser) {
    try {
      const userId = req.user.id;

      const modules = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_USER_MODULES' }, { userId }),
      );

      return ModuleResponse(modules);
    } catch (err) {
      handleRpcError(err);
    }
  }

  @UseGuards(NatsAuthGuard)
  @Post('/associate')
  @HttpCode(HttpStatus.ACCEPTED)
  async syncModules(@Body() dto: SyncModuleDto) {
    try {
      const { userId, modulesIds } = dto;

      await lastValueFrom(
        this.natsClient.send({ cmd: 'VALIDATE_USER_BY_ID' }, { userId }),
      );

      await lastValueFrom(
        this.natsClient.send(
          { cmd: 'SYNC_USER_MODULES' },
          { userId, modulesIds },
        ),
      );

      return {
        success: true,
      };
    } catch (err) {
      handleRpcError(err);
    }
  }
}
