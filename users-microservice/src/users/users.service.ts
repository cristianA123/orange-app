import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { RpcException } from '@nestjs/microservices';
import { Institute, User } from 'src/typeorm/entities';
import * as bcrypt from 'bcrypt';
import { successResponse } from 'src/common/response/response.util';
import { NotFoundRpcException } from '../exceptions/not-found.rpc-exception';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    @InjectRepository(Institute)
    private instituteRepository: Repository<Institute>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new RpcException({
        message: `El correo ${createUserDto.email} ya está en uso`,
        status: HttpStatus.CONFLICT,
      });
    }

    const existingInstitution = await this.instituteRepository.findOne({
      where: { id: createUserDto.institute_id },
    });
    if (!existingInstitution) {
      throw new RpcException({
        message: `El instituto con id ${createUserDto.institute_id} no existe`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      id: uuidv4(),
      ...createUserDto,
      password: hashedPassword,
    });
    const user = await this.usersRepository.save(newUser);
    if (!user) {
      throw new RpcException({
        message: `No se puedo crear usuario`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return successResponse(user, 'Usuario creado exitosamente');
  }

  getUserById(userId: string) {
    return this.usersRepository.findOne({
      where: { id: userId },
    });
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async validateUserById(userId: string): Promise<boolean> {
    const user = await this.getUserById(userId);
    if (!user) throw NotFoundRpcException();
    return true;
  }
}
