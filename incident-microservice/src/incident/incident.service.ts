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
import { incidentSubTypes, incidentTypes } from 'src/constants';
import { updateIncidentStatusDTO } from './dto/update-incident-status.dto';
import { ReportService } from './report.service';
import { S3Service } from './file.service';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Institute)
    private instituteRepository: Repository<Institute>,
    @InjectRepository(Incident)
    private incidentRepository: Repository<Incident>,
    private readonly reportService: ReportService,
    private readonly s3Service: S3Service,
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

    // cuando se modifique de estado 1 a 2, agregar la fecha de inicio
    if (currentStatus == IncidentStatus.OPEN && newStatusValue === 2) {
      existIncident.attentionDate = new Date();
    }
    // cuando se modifique de estado 2 a 3 o a otro estado, agregar la fecha de finalización
    if (currentStatus == IncidentStatus.IN_PROGRESS && newStatusValue !== 2) {
      existIncident.closingDate = new Date();
    }

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
      attentionDate: existIncident.attentionDate ?? existIncident.attentionDate,
      closingDate: existIncident.closingDate ?? existIncident.closingDate,
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

  async getReportIncidents(
    instituteId: string,
    from?: string,
    to?: string,
    status?: string,
    isRelevant?: boolean,
    limit = 10,
    page = 1,
  ) {
    const query = this.incidentRepository
      .createQueryBuilder('incident')
      .where('incident.institute_id = :instituteId', { instituteId });

    if (from && to) {
      query.andWhere('incident.created_at BETWEEN :from AND :to', { from, to });
    } else if (from) {
      query.andWhere('incident.created_at >= :from', { from });
    } else if (to) {
      query.andWhere('incident.created_at <= :to', { to });
    }

    if (status) {
      query.andWhere('incident.status = :status', { status });
    }

    if (typeof isRelevant === 'boolean') {
      query.andWhere('incident.isRelevant = :isRelevant', { isRelevant });
    }

    query
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('incident.created_at', 'DESC');

    const [rows, total] = await query.getManyAndCount();

    return {
      total,
      limit,
      page,
      data: rows,
    };
  }

  // async uploadIncidentFile(payload: any) {
  //   const { buffer, filename, mimetype } = payload;
  //   const s3 = new S3({
  //     region: process.env.AWS_REGION,
  //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  //   });

  //   const params = {
  //     Bucket: process.env.AWS_S3_BUCKET,
  //     Key: filename,
  //     Body: buffer,
  //     ContentType: mimetype,
  //   };

  //   const result = await s3.upload(params).promise();
  //   return result.Location;
  // }

  async uploadIncidentFile(payload: any) {
    return this.s3Service.uploadFile(payload);
  }
}
