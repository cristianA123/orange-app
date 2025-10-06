import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident, IncidentFile, Institute, User } from 'src/typeorm/entities';
import { ReportService } from './report.service';
import { S3Service } from './file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident, User, Institute, IncidentFile]),
  ],
  controllers: [IncidentController],
  providers: [IncidentService, ReportService, S3Service],
  exports: [IncidentService],
})
export class IncidentModule {}
