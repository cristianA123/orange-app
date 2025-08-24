import { PartialType } from '@nestjs/mapped-types';
import { CreateIncidentDto } from './create-incident.dto';

export class updateIncidentStatusDTO extends PartialType(CreateIncidentDto) {
  id: string;
}
