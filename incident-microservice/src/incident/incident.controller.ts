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

  @MessagePattern('findOneIncident')
  findOne(@Payload() id: number) {
    return this.incidentService.findOne(id);
  }

  @MessagePattern('updateIncident')
  update(@Payload() updateIncidentDto: UpdateIncidentDto) {
    return this.incidentService.update(updateIncidentDto.id, updateIncidentDto);
  }

  @MessagePattern('removeIncident')
  remove(@Payload() id: number) {
    return this.incidentService.remove(id);
  }
}
