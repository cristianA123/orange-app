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
import { CreateIncidentDto } from './dtos/createIncident.dto';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/erros/error-handler';
import { UpdateIncidentDTO } from './dtos/updateIncident.dto';

@Controller()
export class IncidentController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('/incident')
  @HttpCode(HttpStatus.OK)
  async createIncident(@Body() createIncidentDto: CreateIncidentDto) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'CREATE_INCIDENT' }, createIncidentDto),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/institute/:id/incident')
  @HttpCode(HttpStatus.OK)
  async findAllIncidentByInstituteId(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_INCIDENT' }, id),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/incident/:id')
  async getIncidentById(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_INCIDENT_BY_ID' }, id),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Patch('/incident/:id')
  async update(
    @Param('id') id: string,
    @Payload() updateIncidentDTO: UpdateIncidentDTO,
  ) {
    try {
      console.log(1);
      console.log(updateIncidentDTO);
      console.log(1);
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'UPDATE_INCIDENT' },
          { ...updateIncidentDTO, id },
        ),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Delete('/incident/:id')
  async remove(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'DELETE_INCIDENT' }, id),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }
}
