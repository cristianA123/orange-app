import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateInstituteDto } from './dto/create-institute.dto';
import { UpdateInstituteDto } from './dto/update-institute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Institute, InstituteStatus, User } from 'src/typeorm/entities';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { successResponse } from 'src/common/response/response.util';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class InstituteService {
  constructor(
    @InjectRepository(Institute)
    private instituteRepository: Repository<Institute>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createInstituteDto: CreateInstituteDto) {
    // validar que ruc no este en uso
    const instituteWithRuc = await this.instituteRepository.findOne({
      where: { ruc: createInstituteDto.ruc },
    });
    if (instituteWithRuc) {
      throw new RpcException({
        message: `No se puedo crear instituto, el ruc ${createInstituteDto.ruc} ya esta en uso`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const institute = await this.instituteRepository.save({
      ...createInstituteDto,
      id: uuidv4(),
      status: InstituteStatus.ACTIVE,
    });

    return successResponse(institute);
  }

  async findAll() {
    const institute = await this.instituteRepository.find();

    return successResponse(institute);
  }

  async findOne(id: string) {
    const institute = await this.instituteRepository.findOne({
      where: { id },
    });

    return successResponse(institute);
  }

  async findUsersByInstituteId(id: string) {
    const users = await this.userRepository.find({
      where: { institute_id: id },
    });

    // eliminar el campo password de cada usuario
    users.forEach((user) => {
      delete user.password;
    });

    return successResponse(users || []);
  }

  async update(id: number, updateInstituteDto: UpdateInstituteDto) {
    const institute = await this.instituteRepository.findOne({
      where: { id: id.toString() },
    });

    if (!institute) {
      throw new RpcException({
        message: `No se pudo actualizar instituto`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    await this.instituteRepository.update(
      { id: id.toString() },
      { ...updateInstituteDto, id: id.toString() },
    );

    const updatedInstitute = await this.instituteRepository.findOne({
      where: { id: id.toString() },
    });

    if (!updatedInstitute) {
      throw new RpcException({
        message: `No se pudo obtener el instituto actualizado`,
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }

    return successResponse(
      updatedInstitute,
      'Instituto actualizado exitosamente',
    );
  }

  async remove(id: string) {
    const institute = await this.instituteRepository.update(
      { id: id.toString() },
      { status: InstituteStatus.DELETED, deletedAt: new Date() },
    );

    return successResponse(institute);
  }

  async validateInstituteById(id: string) {
    const institute = await this.instituteRepository.findOne({
      where: { id },
    });

    if (!institute) {
      throw new RpcException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Instituto inválido.',
      });
    }

    return { success: true };
  }
}
