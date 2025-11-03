import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// import { v4 as uuidv4 } from 'uuid';
import { randomUUID } from 'crypto';
import {
  Incident,
  IncidentStatus,
  Institute,
  User,
} from 'src/typeorm/entities';
import { successResponse } from 'src/common/response/response.util';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Institute)
    private instituteRepository: Repository<Institute>,
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
    // private readonly reportService: ReportService,
    // private readonly s3Service: S3Service,
  ) {
    console.log('✅ IncidentService inicializado');
  }

  async create(createIncidentDto: CreateIncidentDto) {
    const existUser = await this.usersRepository.findOneBy({
      id: createIncidentDto.userId,
    });

    if (!existUser) {
      throw new RpcException({
        message: `No existe el usuario`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    const existInstitute = await this.instituteRepository.findOneBy({
      id: createIncidentDto.instituteId,
    });
    if (!existInstitute) {
      throw new RpcException({
        message: `No existe el instituto`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const existOfficer = await this.usersRepository.findOneBy({
      id: createIncidentDto.officerId,
    });
    if (!existOfficer) {
      throw new RpcException({
        message: `No existe el oficial`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const incident = this.incidentRepository.create({
      id: randomUUID(),
      // id: uuidv4(),randomUUID()
      ...createIncidentDto,

      status: IncidentStatus.OPEN,
      user: existUser,
      officer: existOfficer,
      institute: existInstitute,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const newIncident = await this.incidentRepository.save(incident);

    if (!newIncident) {
      throw new RpcException({
        message: `No se puedo crear usuario`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    delete newIncident.user;
    delete newIncident.institute;
    delete newIncident.officer;

    return successResponse(newIncident, 'Incidencia creado exitosamente');
  }

  async findAllIncidentByInstituteId(id: string) {
    console.log(id);
    const existInstitute = await this.instituteRepository.findOneBy({
      id,
    });
    if (!existInstitute) {
      throw new RpcException({
        message: `No existe el instituto`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const incidents = await this.incidentRepository.find({
      where: {
        institute: {
          id,
        },
      },
    });

    if (!incidents) {
      throw new RpcException({
        message: `No se encontraron incidentes`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return successResponse(incidents, 'Incidentes encontrados');
  }

  async getIncidentById(id: string) {
    // quiero agregar los datos del officer y solo sus id y name y documentType y documentNumber
    const incident = await this.incidentRepository.findOne({
      where: {
        id,
      },
      relations: ['officer'],
    });
    if (!incident) {
      throw new RpcException({
        message: `No se encontraron incidentes`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    delete incident.officer.password;
    delete incident.officer.rol;
    delete incident.officer.institute_id;
    delete incident.officer.email;
    delete incident.officer.createdAt;
    delete incident.officer.updatedAt;
    delete incident.officer.deletedAt;
    delete incident.officer.status;
    return successResponse(incident, 'Incidente encontrado');
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto) {
    const existUser = await this.usersRepository.findOneBy({
      id: updateIncidentDto.userId,
    });

    if (!existUser) {
      throw new RpcException({
        message: `No existe el usuario`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    const existInstitute = await this.instituteRepository.findOneBy({
      id: updateIncidentDto.instituteId,
    });
    if (!existInstitute) {
      throw new RpcException({
        message: `No existe el instituto`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    let existOfficer = null;
    if (updateIncidentDto.officerId) {
      existOfficer = await this.usersRepository.findOneBy({
        id: updateIncidentDto.officerId,
      });
      console.log(existOfficer);
      if (!existOfficer) {
        throw new RpcException({
          message: `No existe el oficial`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    delete updateIncidentDto.userId;
    delete updateIncidentDto.instituteId;
    delete updateIncidentDto.officerId;

    const incident = await this.incidentRepository.update(id, {
      ...updateIncidentDto,
      user: existUser,
      institute: existInstitute,
      officer: existOfficer ? existOfficer : null,
      status: updateIncidentDto.status as unknown as IncidentStatus,
    });
    if (!incident) {
      throw new RpcException({
        message: `No se encontraron incidentes`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const incidentUpdated = await this.incidentRepository.findOneBy({
      id,
    });

    delete incidentUpdated.user;
    delete incidentUpdated.institute;
    delete incidentUpdated.officer;

    return successResponse(incidentUpdated, 'Incidente actualizado');
  }

  async remove(id: string) {
    const incident = await this.incidentRepository.update(id, {
      status: IncidentStatus.DELETED,
      deletedAt: new Date(),
    });
    if (!incident) {
      throw new RpcException({
        message: `No se encontraron incidentes`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return successResponse(incident, 'Incidente eliminado');
  }
}
