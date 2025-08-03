import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserModule } from '../typeorm/entities/UserModule';
import { Module } from '../typeorm/entities/Module';
import { RpcException } from '@nestjs/microservices';
import { v4 as uuidv4 } from 'uuid';
import { InstituteModule } from '../typeorm/entities/InstituteModule';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(UserModule)
    private readonly userModulesRepo: Repository<UserModule>,

    @InjectRepository(InstituteModule)
    private readonly instituteModulesRepo: Repository<InstituteModule>,

    @InjectRepository(Module)
    private readonly modulesRepo: Repository<Module>,
  ) {}

  async getUserModules(userId: string) {
    return await this.userModulesRepo.find({
      where: { user: { id: userId } },
      relations: ['module', 'module.parent'],
    });
  }

  async syncUserModules(userId: string, moduleIds: string[]) {
    await this.validateModulesExist(moduleIds);

    await this.userModulesRepo.delete({ user: { id: userId } });

    const modules = await this.getModulesByIds(moduleIds);

    const userModules = modules.map((module) => {
      const userModule = new UserModule();
      userModule.id = uuidv4();
      userModule.user = { id: userId } as any;
      userModule.module = module;
      return userModule;
    });

    await this.userModulesRepo.save(userModules);

    return { success: true };
  }

  async syncInstituteModules(instituteId: string, moduleIds: string[]) {
    await this.ensureNoUsersWithRemovedModules(instituteId, moduleIds);
    await this.validateModulesExist(moduleIds);

    await this.instituteModulesRepo.delete({ institute: { id: instituteId } });

    const modules = await this.getModulesByIds(moduleIds);

    const instituteModules = modules.map((module) => {
      const im = new InstituteModule();
      im.id = uuidv4();
      im.institute = { id: instituteId } as any;
      im.module = module;
      return im;
    });

    await this.instituteModulesRepo.save(instituteModules);

    return { success: true };
  }

  private async validateModulesExist(moduleIds: string[]): Promise<void> {
    const foundModules = await this.modulesRepo.find({
      where: { id: In(moduleIds) },
    });

    if (foundModules.length !== moduleIds.length) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: 'Uno o más módulos no existen.',
      });
    }
  }

  private async getModulesByIds(moduleIds: string[]): Promise<Module[]> {
    return this.modulesRepo.find({
      where: { id: In(moduleIds) },
    });
  }

  private async ensureNoUsersWithRemovedModules(
    instituteId: string,
    newModuleIds: string[],
  ): Promise<void> {
    const currentModules = await this.instituteModulesRepo.find({
      where: { institute: { id: instituteId } },
      relations: ['module'],
    });

    const currentModuleIds = currentModules.map((im) => im.module.id);
    const removedModuleIds = currentModuleIds.filter(
      (id) => !newModuleIds.includes(id),
    );

    if (!removedModuleIds.length) return;

    const usersWithRestrictedModules = await this.userModulesRepo
      .createQueryBuilder('userModule')
      .leftJoin('userModule.user', 'user')
      .where('user.institute_id = :instituteId', { instituteId })
      .andWhere('userModule.module_id IN (:...removedModuleIds)', {
        removedModuleIds,
      })
      .getCount();

    if (usersWithRestrictedModules > 0) {
      throw new RpcException({
        statusCode: HttpStatus.CONFLICT,
        message:
          'Algunos usuarios tienen módulos que estás intentando deshabilitar.',
      });
    }
  }

  async getModules() {
    return await this.modulesRepo.find({
      where: { isMainModule: true },
      relations: ['children'],
    });
  }

  async getModulesByUserId(userId: string) {
    return  await this.userModulesRepo.find({
      where: { user: { id: userId } },
      relations: ['module', 'module.parent'],
    });
  }

  async getModulesByInstituteId(instituteId: string) {
    return  await this.instituteModulesRepo.find({
      where: { institute: { id: instituteId } },
      relations: ['module', 'module.parent'],
    });
  }
}
