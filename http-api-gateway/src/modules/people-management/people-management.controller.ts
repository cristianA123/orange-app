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
  Req,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/erros/error-handler';
import { IUser } from 'src/common/interfaces';
import { CreatePeopleDto } from './dtos/createPeople.dto';
import { UserDecorator } from '../auth/decorators';
import { UpdatePeopleDTO } from './dtos/updateIncident.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { PresignedFilesDto } from './dtos/presigned-files.dto';
import { ConfirmFilesDto } from './dtos/confirm-files.dto';
import { CreateContractDto } from './dtos/create-contract.dto';
import { TerminateContractDto } from './dtos/terminate-contract.dto';

@Controller('/people')
export class PeopleManagementController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) { }

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

  @Get('/security')
  @HttpCode(HttpStatus.OK)
  async findAllPeopleSecurityByInstituteId(@UserDecorator() user: IUser) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'GET_PEOPLE_SECURITY' },
          {
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

  @Delete('/:id')
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

  @Get('/contract/:id')
  @HttpCode(HttpStatus.OK)
  async getContractById(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_CONTRACT_BY_ID' }, id),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/:id/contracts')
  @HttpCode(HttpStatus.OK)
  async getContractsByPeople(@Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_CONTRACTS_BY_PEOPLE' }, id),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Post('/contract')
  @HttpCode(HttpStatus.OK)
  async createContract(@Body() createContractDto: CreateContractDto) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'CREATE_CONTRACT' }, createContractDto),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Post('/contract/terminate')
  @HttpCode(HttpStatus.OK)
  async terminateContract(@Body() terminateContractDto: TerminateContractDto) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'TERMINATE_CONTRACT' },
          terminateContractDto,
        ),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Post('/contract/reentry')
  @HttpCode(HttpStatus.OK)
  async reentryContract(@Body() createContractDto: CreateContractDto) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'REENTRY_CONTRACT' }, createContractDto),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Post('/contract/upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadContractFile(@UploadedFile() file: any) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'UPLOAD_CONTRACT_FILE' },
          {
            buffer: file.buffer.toString('base64'),
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            extension: file.originalname.split('.').pop(),
          },
        ),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Post('/contract/presigned-url')
  @HttpCode(HttpStatus.OK)
  async generatePresignedUrlContract(
    @Body() presignedFilesDto: PresignedFilesDto,
    @Req() req: any,
  ) {
    try {
      const instituteId = req.user?.instituteId;

      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'GENERATE_PRESIGNED_URL_CONTRACT' },
          {
            filename: presignedFilesDto.filename,
            mimetype: presignedFilesDto.mimetype,
            extension: presignedFilesDto.filename.split('.').pop(),
            instituteId,
          },
        ),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Post('/contract/confirm-upload')
  @HttpCode(HttpStatus.OK)
  async confirmUploadContract(@Body() confirmFilesDto: ConfirmFilesDto) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'CONFIRM_UPLOAD_CONTRACT' },
          {
            fileId: confirmFilesDto.fileId,
            fileSize: confirmFilesDto.fileSize,
          },
        ),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }
}
