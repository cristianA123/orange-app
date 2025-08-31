import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident, Institute, User } from 'src/typeorm/entities';
import {ReportService} from "./report.service";

@Module({
  imports: [TypeOrmModule.forFeature([Incident, User, Institute])],
  controllers: [IncidentController],
  providers: [IncidentService, ReportService],
  exports: [IncidentService],
})
export class IncidentModule {}
