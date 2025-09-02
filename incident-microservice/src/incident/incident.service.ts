import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  Incident,
  IncidentStatus,
  Institute,
  User,
} from 'src/typeorm/entities';
import { successResponse } from 'src/common/response/response.util';
import { RpcException } from '@nestjs/microservices';
import { incidentSubTypes, incidentTypes } from 'src/constants';
import { updateIncidentStatusDTO } from './dto/update-incident-status.dto';
import {ReportService} from "./report.service";

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Institute)
    private instituteRepository: Repository<Institute>,
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
    private readonly reportService: ReportService,
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

    const incident = this.incidentRepository.create({
      id: uuidv4(),
      ...createIncidentDto,
      status: IncidentStatus.OPEN,
      user: existUser,
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
    const incident = await this.incidentRepository.findOneBy({
      id,
    });
    if (!incident) {
      throw new RpcException({
        message: `No se encontraron incidentes`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    return successResponse(incident, 'Incidente encontrado');
  }

  async getIncidentPdfById(id: string): Promise<Buffer> {
    const incident = await this.incidentRepository.findOne({
          where: { id },
          relations: ['user', 'institute'],
    });
    if (!incident) {
        throw new RpcException({
            message: `No se encontraron incidentes`,
            status: HttpStatus.BAD_REQUEST,
        });
    }

    return this.reportService.generateIncidentPdf(incident);
  }

  async update(id: string, updateIncidentDto: UpdateIncidentDto) {
    console.log('holis');
    console.log(id);
    console.log('holis');

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

    console.log('se llego aqui');

    delete updateIncidentDto.userId;
    delete updateIncidentDto.instituteId;

    const incident = await this.incidentRepository.update(id, {
      ...updateIncidentDto,
      user: existUser,
      institute: existInstitute,
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

  async getIncidentType() {
    const type = incidentTypes;
    return successResponse(type, 'Tipos de incidentes encontrados');
  }

  async getIncidentSubType(id: number) {
    const subType = incidentSubTypes[id - 1];
    return successResponse(subType, 'Subtipos de incidentes encontrados');
  }

  async updateStatus(
    id: string,
    updateIncidentStatusDTO: updateIncidentStatusDTO,
  ) {
    const existIncident = await this.incidentRepository.findOneBy({ id });
    if (!existIncident) {
      throw new RpcException({
        message: `No existe el incidente`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const currentStatus = existIncident.status;
    const newStatusValue = updateIncidentStatusDTO.status;

    if (currentStatus === IncidentStatus.OPEN) {
      // Solo permite pasar de OPEN (1) a IN_PROGRESS (2)
      if (newStatusValue !== 2) {
        throw new RpcException({
          message: `Solo se permite cambiar de OPEN a IN_PROGRESS`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } else if (currentStatus === IncidentStatus.IN_PROGRESS) {
      // Permite cambiar a ATTENDED (3), CLOSED (4) o CANCELED (5)
      if (![3, 4, 5].includes(newStatusValue)) {
        throw new RpcException({
          message: `Estado inválido para transición desde IN_PROGRESS`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    } else {
      // No permite cambios desde otros estados
      throw new RpcException({
        message: `No se puede modificar el estado actual`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    // Mapear el valor numérico al enum
    const statusMap = {
      1: IncidentStatus.OPEN,
      2: IncidentStatus.IN_PROGRESS,
      3: IncidentStatus.ATTENDED,
      4: IncidentStatus.CLOSED,
      5: IncidentStatus.CANCELED,
    };

    const incident = await this.incidentRepository.update(id, {
      status: statusMap[newStatusValue],
    });

    if (!incident) {
      throw new RpcException({
        message: `Error al actualizar el incidente`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const incidentUpdated = await this.incidentRepository.findOneBy({ id });
    return successResponse(incidentUpdated, 'Incidente actualizado');
  }
}
