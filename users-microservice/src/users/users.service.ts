import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { v4 as uuidv4 } from 'uuid';
import { RpcException } from '@nestjs/microservices';
import { Institute, User, UserStatus } from 'src/typeorm/entities';
import * as bcrypt from 'bcrypt';
import {
  errorResponse,
  successResponse,
} from 'src/common/response/response.util';
import { NotFoundRpcException } from '../exceptions/not-found.rpc-exception';
import { UpdateUserDTO } from './dtos/UpdateUser.dto';

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

    if (createUserDto.documentNumber) {
      const existingUserWtihDNI = await this.usersRepository.findOne({
        where: { documentNumber: createUserDto.documentNumber },
      });

      if (existingUserWtihDNI) {
        throw new RpcException({
          message: `El documento de identidad ${createUserDto.documentNumber} ya está en uso`,
          status: HttpStatus.CONFLICT,
        });
      }
    }

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

    if (user) {
      delete user.password;
    }

    if (!user) {
      throw new RpcException({
        message: `No se puedo crear usuario`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return successResponse(user, 'Usuario creado exitosamente');
  }

  async getUserById(userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      return errorResponse('Usuario no encontrado');
    }

    //delete password
    delete user.password;

    return successResponse(user, 'Usuario encontrado');
  }

  async findAll() {
    const users = await this.usersRepository.find();

    // delete password
    users.forEach((user) => {
      delete user.password;
    });

    return successResponse(users);
  }

  async findByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email: email },
    });
  }

  async validateUserById(userId: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) throw NotFoundRpcException();
    return true;
  }

  async update(id: string, updateInstituteDto: UpdateUserDTO) {
    const user = await this.usersRepository.findOne({
      where: { id: id.toString() },
    });
    if (!user) {
      throw new RpcException({
        message: `No se pudo actualizar usuario`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    if (updateInstituteDto.institute_id) {
      const institute = await this.instituteRepository.findOne({
        where: { id: updateInstituteDto.institute_id },
      });
      if (!institute) {
        throw new RpcException({
          message: `No se pudo actualizar usuario, Instituto no existe.`,
          status: HttpStatus.BAD_REQUEST,
        });
      }
    }

    if (updateInstituteDto.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateInstituteDto.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new RpcException({
          message: `El correo ${updateInstituteDto.email} ya está en uso`,
          status: HttpStatus.CONFLICT,
        });
      }
    }

    if (updateInstituteDto.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        updateInstituteDto.password,
        salt,
      );
      updateInstituteDto.password = hashedPassword;
    }

    await this.usersRepository.update(
      { id: id.toString() },
      { ...updateInstituteDto },
    );

    const updatedUser = await this.usersRepository.findOne({
      where: { id: id.toString() },
    });

    // Eliminar el campo password del usuario antes de retornar
    if (updatedUser) {
      delete updatedUser.password;

      return successResponse(updatedUser, 'Usuario actualizado exitosamente');
    }

    throw new RpcException({
      message: `Error al obtener el usuario actualizado`,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  async remove(id: string) {
    const institute = await this.usersRepository.update(
      { id: id.toString() },
      { status: UserStatus.DELETED, deletedAt: new Date() },
    );

    return successResponse(institute);
  }
}
