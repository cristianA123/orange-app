import { Module } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Incident, User } from 'src/typeorm/entities';
// import { IncidentImp } from './incident.imp';

@Module({
  imports: [TypeOrmModule.forFeature([Incident, User])],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService],
})
export class IncidentModule {}
