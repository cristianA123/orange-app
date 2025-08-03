import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Incident, Institute, User } from 'src/typeorm/entities';
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
      status: 1,
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

  findAll() {
    return `This action returns all incident`;
  }

  findOne(id: number) {
    return `This action returns a #${id} incident`;
  }

  update(id: string, updateIncidentDto: UpdateIncidentDto) {
    console.log(updateIncidentDto);
    return `This action updates a #${id} incident`;
  }

  remove(id: number) {
    return `This action removes a #${id} incident`;
  }
}
