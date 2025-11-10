import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
  async getIncidents(@Req() req: RequestWithUser) {
    const instituteId = req.user.instituteId;
    try {
      const response = await lastValueFrom(
          this.natsClient.send({ cmd: 'GET_HEAT_MAP' }, { instituteId }),
      );

      return successResponse(response);
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }
}
