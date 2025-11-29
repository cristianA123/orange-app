import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {Camera} from "../typeorm/entities/Camera";
import {Incident} from "../typeorm/entities/Incident";


@Injectable()
export class CameraService {
  constructor(
    @InjectRepository(Camera)
    private cameraRepository: Repository<Camera>,

    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
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


  async getIncidents(instituteId: string, from?: string, to?: string) {
    const qb = this.incidentRepository
        .createQueryBuilder('incident')
        .select([
          'incident.id AS id',
          'incident.locationLat AS lat',
          'incident.locationLng AS lng',
        ])
        .where('incident.institute_id = :instituteId', { instituteId })
        .andWhere('incident.status = :status', { status: 3 });

    if (from && to) {
      qb.andWhere('incident.closingDate BETWEEN :from AND :to', { from, to });
    }

    return qb.getRawMany();
  }

  async getCamerasByInstituteId(instituteId: string): Promise<any[]> {
    return this.cameraRepository
        .createQueryBuilder('camera')
        .select([
          'camera.id as id',
          'camera.latitude AS lat',
          'camera.longitude AS lng',
          'camera.camera_number AS cameraNumber',
        ])
        .where('camera.institute_id = :instituteId', { instituteId })
        .orderBy('camera.camera_number', 'ASC')
        .getRawMany();
  }
}
