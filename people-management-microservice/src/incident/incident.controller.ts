import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { IncidentService } from './incident.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Controller()
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @MessagePattern({ cmd: 'CREATE_INCIDENT2' })
  async create(@Payload() createIncidentDto: CreateIncidentDto) {
    return this.incidentService.create(createIncidentDto);
  }

  @MessagePattern({ cmd: 'GET_INCIDENT2' })
  findAll(@Payload() id: string) {
    return this.incidentService.findAllIncidentByInstituteId(id);
  }

  @MessagePattern({ cmd: 'GET_INCIDENT_BY_ID2' })
  getIncidentById(@Payload() id: string) {
    return this.incidentService.getIncidentById(id);
  }

  @MessagePattern({ cmd: 'UPDATE_INCIDENT2' })
  update(@Payload() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentService.update(updateIncidentDto.id, updateIncidentDto);
  }

  @MessagePattern({ cmd: 'DELETE_INCIDENT2' })
  remove(@Payload() id: string) {
    return this.incidentService.remove(id);
  }
}
