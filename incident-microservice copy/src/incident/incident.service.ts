import { Injectable } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Incident } from 'src/typeorm/entities';
// import { Repository } from 'typeorm';

@Injectable()
export class IncidentService {
  constructor(
    // @InjectRepository(Incident)
    // private incidentRepository: Repository<Incident>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {
    console.log('✅ IncidentService inicializado');
  }

  create(createIncidentDto: CreateIncidentDto) {
    // validar que el userId este registra en la base de datos

    console.log(createIncidentDto);
    return 'This action adds a new incident';
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
