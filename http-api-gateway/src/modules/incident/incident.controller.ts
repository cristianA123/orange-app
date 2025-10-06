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
  Res,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { CreateIncidentDto } from './dtos/createIncident.dto';
import { lastValueFrom } from 'rxjs';
import { handleRpcError } from 'src/common/erros/error-handler';
import { UpdateIncidentDTO } from './dtos/updateIncident.dto';
import { UpdateIncidentStatusDTO } from './dtos/updateIncidentStatus.dto';
import { Response } from 'express';
import { Public, UserDecorator } from 'src/common/decorators';
import { IUser } from 'src/common/interfaces';
import { GetReportIncidentDto } from './dtos/getReportIncident.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PresignedFilesDto } from './dtos/files/presigned-files.dto';
import { ConfirmFilesDto } from './dtos/files/presigned-files.dto copy';

@Controller()
export class IncidentController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  @Post('/incident')
  @HttpCode(HttpStatus.OK)
  async createIncident(
    @UserDecorator() user: IUser,
    @Body() createIncidentDto: CreateIncidentDto,
  ) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'CREATE_INCIDENT' },
          {
            ...createIncidentDto,
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

  @Get('/institute-incidents')
  @HttpCode(HttpStatus.OK)
  async findAllIncidentByInstituteId(@UserDecorator() user: IUser) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_INCIDENT' }, user.instituteId),
      );

      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/incident-type')
  async getIncidentType() {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_INCIDENT_TYPE' }, {}),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/incident-type/:id')
  async getIncidentSubType(@Param('id') id: number) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_INCIDENT_SUB_TYPE' }, id),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Get('/incident/report')
  async getReportIncidents(
    @Query() query: GetReportIncidentDto,
    @UserDecorator() user: IUser,
  ) {
    try {
      const data = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'GET_REPORTS_INCIDENT' },
          { ...query, instituteId: user.instituteId },
        ),
      );

      return data;
    } catch (error) {
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

  @Get('/incident/:id/pdf')
  @Public()
  async getIncidentPdfById(@Param('id') id: string, @Res() res: Response) {
    try {
      const base64 = await lastValueFrom(
        this.natsClient.send({ cmd: 'GET_INCIDENT_PDF_BY_ID' }, id),
      );

      const pdfBuffer = Buffer.from(base64, 'base64');

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `inline; filename="reporte-${id}.pdf"`,
      );
      res.end(pdfBuffer);
    } catch (error) {
      handleRpcError(error);
    }
  }

  @Patch('/incident/:id')
  async update(
    @Param('id') id: string,
    @UserDecorator() user: IUser,
    @Payload() updateIncidentDTO: UpdateIncidentDTO,
  ) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'UPDATE_INCIDENT' },
          {
            ...updateIncidentDTO,
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

  @Patch('/incident/status/:id')
  async updateStatus(
    @Param('id') id: string,
    @Payload() updateIncidentStatusDTO: UpdateIncidentStatusDTO,
  ) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'UPDATE_INCIDENT_STATUS' },
          { ...updateIncidentStatusDTO, id },
        ),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Post('/incident/:id/upload')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  async uploadIncidentFile(@UploadedFile() file: any, @Param('id') id: string) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'UPLOAD_INCIDENT_FILE' },
          {
            buffer: file.buffer.toString('base64'), // Convertir a Base64 para que pueda ser serializado
            filename: file.originalname,
            mimetype: file.mimetype,
            id,
          },
        ),
      );
      return response;
    } catch (error) {
      console.log('fallo');
      console.error(error);
      handleRpcError(error);
    }
  }

  @Post('/incident/:id/presigned-url')
  @HttpCode(HttpStatus.OK)
  async generatePresignedUrl(
    @Body() presignedFilesDto: PresignedFilesDto,
    @Param('id') id: string,
  ) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'GENERATE_PRESIGNED_URL' },
          {
            filename: presignedFilesDto.filename,
            mimetype: presignedFilesDto.mimetype,
            id,
          },
        ),
      );
      return response;
    } catch (error) {
      console.error(error);
      handleRpcError(error);
    }
  }

  @Post('/incident/confirm-upload')
  @HttpCode(HttpStatus.OK)
  async confirmUpload(@Body() confirmFilesDto: ConfirmFilesDto) {
    try {
      const response = await lastValueFrom(
        this.natsClient.send(
          { cmd: 'CONFIRM_UPLOAD' },
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
