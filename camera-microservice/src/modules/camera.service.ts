import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserModule } from '../typeorm/entities/UserModule';
import {Incident} from "../typeorm/entities/Incident";
import {Camera} from "../typeorm/entities/Camera";


@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Camera)
    private cameraRepository: Repository<Camera>,
  ) {}

  async getHeatMapByCamera(instituteId: string, from?: string, to?: string) {
    const qb = this.cameraRepository
      .createQueryBuilder('camera')
      .innerJoin(
          'camera.incidents',
          'incident',
          'incident.status = :status',
          { status: 3 }
      )
      .select([
        'camera.latitude AS lat',
        'camera.longitude AS lng',
        'camera.camera_number AS cameraNumber',
        'COUNT(incident.id) AS total',
      ])
      .where('camera.institute_id = :instituteId', { instituteId });

    if (from && to) {
      qb.andWhere('incident.closingDate BETWEEN :from AND :to', { from, to });
    }

    return qb
      .groupBy('camera.latitude')
      .addGroupBy('camera.longitude')
      .addGroupBy('camera.camera_number')
      .getRawMany();
  }
}
