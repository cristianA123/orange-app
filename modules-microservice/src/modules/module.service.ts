import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModule } from '../typeorm/entities/UserModule';
import { Repository } from 'typeorm';

@Injectable()
export class ModuleService {
  constructor(
    @InjectRepository(UserModule)
    private readonly modulesUsersRepository: Repository<UserModule>,
  ) {}

  async getUserModules(userId: string) {
    return await this.modulesUsersRepository.find({
      where: { user: { id: userId } },
      relations: ['module'],
    });
  }
}
