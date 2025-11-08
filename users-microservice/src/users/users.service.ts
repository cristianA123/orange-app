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
import { CreateUserStaffDTO } from './dtos/CreateUserStaff.dto';
import { UpdateUserStaffDTO } from './dtos/UpdateUserStaff.dto';
import { ChangePasswordDto } from './dtos/ChangePassword.dto';

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
    const user = await this.usersRepository.findOne({
      where: { email: email },
      relations: ['institute'],
    });
    if (!user) {
      throw new RpcException({
        message: `No se encontro usuario con ese correo`,
        status: HttpStatus.BAD_REQUEST,
      });
    }
    //limpiar algunos cmapos de institute si existe
    if (user.institute) {
      delete user.institute.createdAt;
      delete user.institute.updatedAt;
      delete user.institute.deletedAt;
    }

    return user;
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
        message: `No se encontro usuario con ese ID para actualizar`,
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

    if (updateInstituteDto.documentNumber) {
      const existingUser = await this.usersRepository.findOne({
        where: { documentNumber: updateInstituteDto.documentNumber },
      });
      if (existingUser && existingUser.id !== id) {
        throw new RpcException({
          message: `El documento ${updateInstituteDto.documentNumber} ya está en uso`,
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
  async getUserByInstituteId(instituteId: string) {
    const users = await this.usersRepository.find({
      where: { institute_id: instituteId },
    });

    users.forEach((user) => {
      delete user.password;
    });

    return successResponse(users);
  }

  async getUsersSecurityByInstituteId(instituteId: string) {
    const users = await this.usersRepository.find({
      where: { institute_id: instituteId, area: 'security' },
    });

    users.forEach((user) => {
      delete user.password;
    });

    return successResponse(users);
  }

  async createUserStaff(createUserStaffDTO: CreateUserStaffDTO) {
    const user = await this.usersRepository.findOne({
      where: { email: createUserStaffDTO.email },
    });

    if (user) {
      throw new RpcException({
        message: `El correo ${createUserStaffDTO.email} ya está en uso`,
        status: HttpStatus.CONFLICT,
      });
    }

    const existingUser = await this.usersRepository.findOne({
      where: { documentNumber: createUserStaffDTO.documentNumber },
    });
    if (existingUser) {
      throw new RpcException({
        message: `El documento ${createUserStaffDTO.documentNumber} ya está en uso`,
        status: HttpStatus.CONFLICT,
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserStaffDTO.password, salt);
    createUserStaffDTO.password = hashedPassword;

    const newUser = this.usersRepository.create({
      id: uuidv4(),
      ...createUserStaffDTO,
    });

    const userCreated = await this.usersRepository.save(newUser);

    if (userCreated) {
      delete userCreated.password;
    }

    if (!userCreated) {
      throw new RpcException({
        message: `No se puedo crear usuario`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return successResponse(userCreated, 'Usuario creado exitosamente');
  }
  async updateUserStaff(updateUserStaffDTO: UpdateUserStaffDTO) {
    const user = await this.usersRepository.findOne({
      where: { id: updateUserStaffDTO.id },
    });

    if (!user) {
      throw new RpcException({
        message: `No se encontro usuario con ese ID para actualizar`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    if (updateUserStaffDTO.email) {
      const existingUser = await this.usersRepository.findOne({
        where: { email: updateUserStaffDTO.email },
      });
      if (existingUser && existingUser.id !== updateUserStaffDTO.id) {
        throw new RpcException({
          message: `El correo ${updateUserStaffDTO.email} ya está en uso`,
          status: HttpStatus.CONFLICT,
        });
      }
    }

    if (updateUserStaffDTO.documentNumber) {
      const existingUser = await this.usersRepository.findOne({
        where: { documentNumber: updateUserStaffDTO.documentNumber },
      });
      if (existingUser && existingUser.id !== updateUserStaffDTO.id) {
        throw new RpcException({
          message: `El documento ${updateUserStaffDTO.documentNumber} ya está en uso`,
          status: HttpStatus.CONFLICT,
        });
      }
    }

    if (updateUserStaffDTO.password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(
        updateUserStaffDTO.password,
        salt,
      );
      updateUserStaffDTO.password = hashedPassword;
    }

    await this.usersRepository.update(
      { id: updateUserStaffDTO.id },
      { ...updateUserStaffDTO },
    );

    const updatedUser = await this.usersRepository.findOne({
      where: { id: updateUserStaffDTO.id },
    });

    if (updatedUser) {
      delete updatedUser.password;

      return successResponse(updatedUser, 'Usuario actualizado exitosamente');
    }

    throw new RpcException({
      message: `Error al obtener el usuario actualizado`,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  async findUserIdNameDni(instituteId: string) {
    const users = await this.usersRepository.find({
      where: { institute_id: instituteId },
      select: ['id', 'name', 'documentNumber'],
    });

    return successResponse(users);
  }
  async changePassword(changePasswordDTO: ChangePasswordDto, userId: string) {
    console.log('Iniciando cambio de contraseña para usuario ID:', userId);
    console.log('Datos recibidos:', JSON.stringify(changePasswordDTO));

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new RpcException({
        message: `No se encontro usuario con ese ID para actualizar`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const isPasswordValid = await bcrypt.compare(
      changePasswordDTO.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      console.log('Validación de contraseña fallida');
      throw new RpcException({
        message: `La contraseña actual es incorrecta`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(
      changePasswordDTO.newPassword,
      salt,
    );

    await this.usersRepository.update(
      { id: userId },
      { password: hashedPassword },
    );

    return successResponse('Contraseña actualizada exitosamente');
  }
}
