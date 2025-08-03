import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { ModuleResponse } from './mapper/module.mapper';
import { NatsAuthGuard } from '../auth/guards/auth.guards';
import { RequestWithUser } from './interfaces/request-with-user.interface';
import { SyncModuleInstituteDto, SyncModuleUserDto } from './dtos/sync.dto';
import { handleRpcError } from '../../common/erros/error-handler';

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

  @Get('/user/:id')
  @HttpCode(HttpStatus.OK)
  async getModulesByUserId(@Param('id') id: string) {
    try {
      const modules = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_MODULES_BY_USER' }, id),
      );

      return ModuleResponse(modules);
    } catch (err) {
      handleRpcError(err);
    }
  }

  @Get('/institute/:id')
  @HttpCode(HttpStatus.OK)
  async getModulesByInstituteId(@Param('id') id: string) {
    try {
      const modules = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_MODULES_BY_INSTITUTE' }, id),
      );

      return ModuleResponse(modules);
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
  @Post('/associate/user')
  @HttpCode(HttpStatus.ACCEPTED)
  async syncModulesForUser(@Body() dto: SyncModuleUserDto) {
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

  @UseGuards(NatsAuthGuard)
  @Post('/associate/institute')
  @HttpCode(HttpStatus.ACCEPTED)
  async syncModulesForInstitute(@Body() dto: SyncModuleInstituteDto) {
    try {
      const { instituteId, modulesIds } = dto;

      await lastValueFrom(
        this.natsClient.send({ cmd: 'VALIDATE_INSTITUTE_BY_ID' }, instituteId),
      );

      await lastValueFrom(
        this.natsClient.send(
          { cmd: 'SYNC_INSTITUTE_MODULES' },
          { instituteId, modulesIds },
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
