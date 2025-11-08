import {
  Controller,
  Inject,
  Post,
  Body,
  Get,
  Param,
  HttpCode,
  HttpStatus,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/erros/error-handler';
import { IUser } from 'src/common/interfaces';
import { CreatePeopleDto } from './dtos/createPeople.dto';
import { UserDecorator } from '../auth/decorators';
import { UpdatePeopleDTO } from './dtos/updateIncident.dto';

@Controller('/people')
export class PeopleManagementController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('/')
  @HttpCode(HttpStatus.OK)
  async createPeople(
    @UserDecorator() user: IUser,
    @Body() createPeopleDto: CreatePeopleDto,
  ) {
    try {
      console.log('eee');
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'CREATE_PEOPLE' },
          {
            ...createPeopleDto,
            userId: user.id,
            instituteId: user.instituteId,
          },
        ),
      );

      console.log('sss');

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/institute-people')
  @HttpCode(HttpStatus.OK)
  async findAllPeopleByInstituteId(@UserDecorator() user: IUser) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_PEOPLE' }, user.instituteId),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/institute-people/summary')
  @HttpCode(HttpStatus.OK)
  async findAllPeopleByInstituteIdToSummary(
    @UserDecorator() user: IUser,
    @Query('source') source: string,
  ) {
    try {
      console.log('eee');
      console.log(source);
      console.log('eee');
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'GET_PEOPLE_SUMMARY' },
          {
            instituteId: user.instituteId,
            source,
          },
        ),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/form-data')
  async getPeopleFormData() {
    try {
      console.log('eee');
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_PEOPLE_FORM_DATA' }, {}),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/provinces/:departmentId')
  async getProvincesByDepartment(@Param('departmentId') departmentId: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'GET_PROVINCES_BY_DEPARTMENT' },
          departmentId,
        ),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/districts/:provinceId')
  async getDistrictsByProvince(@Param('provinceId') provinceId: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_DISTRICTS_BY_PROVINCE' }, provinceId),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/:id')
  async getPeopleById(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_PEOPLE_BY_ID' }, id),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Patch('/:id')
  async update(
    @Param('id') id: string,
    @UserDecorator() user: IUser,
    @Payload() updatePeopleDTO: UpdatePeopleDTO,
  ) {
    try {
      console.log('modificar');
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'UPDATE_PEOPLE' },
          {
            ...updatePeopleDTO,
            id,
            userId: user.id,
            instituteId: user.instituteId,
          },
        ),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Delete('/people/:id')
  async remove(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'DELETE_PEOPLE' }, id),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }
}
