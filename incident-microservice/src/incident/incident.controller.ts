import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Controller()
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @MessagePattern({ cmd: 'CREATE_INCIDENT' })
  async create(@Payload() createIncidentDto: CreateIncidentDto) {
    return this.incidentService.create(createIncidentDto);
  }

  @MessagePattern({ cmd: 'GET_INCIDENT' })
  findAll(@Payload() id: string) {
    return this.incidentService.findAllIncidentByInstituteId(id);
  }

  @MessagePattern({ cmd: 'GET_INCIDENT_BY_ID' })
  getIncidentById(@Payload() id: string) {
    return this.incidentService.getIncidentById(id);
  }

  @MessagePattern({ cmd: 'GET_INCIDENT_PDF_BY_ID' })
  getIncidentPdfById(@Payload() id: string) {
    return this.incidentService.getIncidentPdfById(id);
  }

  @MessagePattern({ cmd: 'GET_REPORTS_INCIDENT' })
  getReportIncidents(
    @Payload()
    payload: {
      instituteId: string;
      from?: string;
      to?: string;
      status?: string;
      isRelevant?: boolean;
      limit?: number;
      page?: number;
    },
  ) {
    const { instituteId, from, to, status, isRelevant, limit, page } = payload;
    return this.incidentService.getReportIncidents(
      instituteId,
      from,
      to,
      status,
      isRelevant,
      limit,
      page,
    );
  }

  @MessagePattern({ cmd: 'UPDATE_INCIDENT' })
  update(@Payload() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentService.update(updateIncidentDto.id, updateIncidentDto);
  }

  @MessagePattern({ cmd: 'DELETE_INCIDENT' })
  remove(@Payload() id: string) {
    return this.incidentService.remove(id);
  }

  @MessagePattern({ cmd: 'GET_INCIDENT_TYPE' })
  getIncidentType() {
    return this.incidentService.getIncidentType();
  }

  @MessagePattern({ cmd: 'GET_INCIDENT_SUB_TYPE' })
  getIncidentSubType(@Payload() id: number) {
    return this.incidentService.getIncidentSubType(id);
  }

  @MessagePattern({ cmd: 'UPDATE_INCIDENT_STATUS' })
  updateStatus(@Payload() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentService.updateStatus(
      updateIncidentDto.id,
      updateIncidentDto,
    );
  }

  // @MessagePattern({ cmd: 'UPLOAD_INCIDENT_FILE' })
  // uploadIncidentFile(@Payload() payload: any) {
  //   return this.incidentService.uploadIncidentFile(payload);
  // }

  @MessagePattern({ cmd: 'GENERATE_PRESIGNED_URL' })
  generatePresignedUrl(@Payload() payload: any) {
    return this.incidentService.generatePresignedUrl(payload);
  }

  @MessagePattern({ cmd: 'CONFIRM_UPLOAD' })
  confirmUpload(@Payload() payload: any) {
    return this.incidentService.confirmUpload(payload);
  }

  // // Mantener el existente por si acaso para archivos pequeños
  // @MessagePattern({ cmd: 'UPLOAD_INCIDENT_FILE' })
  // uploadIncidentFile(@Payload() payload: any) {
  //   return this.incidentService.uploadIncidentFile(payload);
  // }
}
