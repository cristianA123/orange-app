import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserModule } from '../typeorm/entities/UserModule';
import { Module } from '../typeorm/entities/Module';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(UserModule)
    private readonly userModulesRepo: Repository<UserModule>,

    @InjectRepository(Module)
    private readonly modulesRepo: Repository<Module>,
  ) {}

  async getUserModules(userId: string) {
    return await this.userModulesRepo.find({
      where: { user: { id: userId } },
      relations: ['module', 'module.parent'],
    });
  }

  async syncUserModules(userId: string, modulesIds: string[]) {
    await this.userModulesRepo.delete({ user: { id: userId } });

    const modules = await this.modulesRepo.find({
      where: { id: In(modulesIds) },
    });

    if (modules.length != modulesIds.length) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'One or more modules were not found.',
      });
    }

    const userModules: UserModule[] = [];
    for (const module of modules) {
      const userModule = new UserModule();
      userModule.id = uuidv4();
      userModule.user = { id: userId } as any;
      userModule.module = module;
      userModules.push(userModule);
    }

    await this.userModulesRepo.save(userModules);

    return {
      success: true,
      message: 'Modules successfully synchronized',
    };
  }

  async getModules() {
    return await this.modulesRepo.find({
      where: { isMainModule: true },
      relations: ['children'],
    });
  }
}
