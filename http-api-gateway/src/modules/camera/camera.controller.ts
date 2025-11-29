import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject, Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { handleRpcError } from 'src/common/erros/error-handler';
import { lastValueFrom } from 'rxjs';
import {RequestWithUser} from "../modules/interfaces/request-with-user.interface";
import { successResponse } from 'src/common/response/response.util';

@Controller('camera')
export class CameraController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Get('/maps')
  @HttpCode(HttpStatus.OK)
  async getHeatMap(
      @Req() req: RequestWithUser,
      @Query('from') from?: string,
      @Query('to') to?: string
  ) {
    const instituteId = req.user.instituteId;

    try {
      const response = await lastValueFrom(
          this.natsClient.send(
              { cmd: 'GET_HEAT_MAP' },
              { instituteId, from, to }
          )
      );

      return successResponse(response);
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/incidents')
  @HttpCode(HttpStatus.OK)
  async getIncidents(
      @Req() req: RequestWithUser,
      @Query('from') from?: string,
      @Query('to') to?: string
  ) {
    const instituteId = req.user.instituteId;

    try {
      const response = await lastValueFrom(
          this.natsClient.send(
              { cmd: 'GET_INCIDENTS' },
              { instituteId, from, to },
          )
      );

      return successResponse(response);
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getCameras(@Req() req: RequestWithUser) {
    const instituteId = req.user.instituteId;

    try {
      const response = await lastValueFrom(
          this.natsClient.send(
              { cmd: 'GET_CAMERAS_BY_INSTITUTE' },
              { instituteId },
          ),
      );

      return successResponse(response);
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }
}
