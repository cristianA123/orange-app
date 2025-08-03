import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { CreateInstituteDto } from './dtos/create-institute.dto';
import { handleRpcError } from 'src/common/erros/error-handler';
import { lastValueFrom } from 'rxjs';
import { UpdateInstituteDto } from './dtos/update-institute.dto';

@Controller('institute')
export class InstituteController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async create(@Payload() createInstituteDto: CreateInstituteDto) {
    try {
      // return { hola: 1, createInstituteDto };
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'CREATE_INSTITUTE' }, createInstituteDto),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'GET_INSTITUTES' }, {}),
    );

    return response;
  }

  @Get('/:id/users')
  @HttpCode(HttpStatus.OK)
  async findUsersByInstituteId(@Param('id') id: string) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'GET_INSTITUTE_USERS' }, id),
    );

    console.log(1);

    return response;
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const response = await lastValueFrom(
      this.natsClient.send({ cmd: 'GET_INSTITUTE' }, id),
    );

    return response;
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @Payload() updateInstituteDto: UpdateInstituteDto,
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
