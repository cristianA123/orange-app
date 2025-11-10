import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserModule } from '../typeorm/entities/UserModule';
import {Incident} from "../typeorm/entities/Incident";

@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
  ) {}

  async getHeatMapByCamera(instituteId: string) {
    return this.incidentRepository
        .createQueryBuilder('incident')
        .select('incident.cameraNumber', 'cameraNumber')
        .addSelect('incident.locationLat', 'lat')
        .addSelect('incident.locationLng', 'lng')
        .addSelect('COUNT(*)', 'total')
        .where('incident.institute_id = :instituteId', { instituteId })
        .groupBy('incident.cameraNumber')
        .getRawMany();
  }
}
