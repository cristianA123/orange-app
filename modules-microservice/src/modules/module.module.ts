import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleMicroserviceController } from './module.controller';
import { ModuleService } from './module.service';
import { UserModule } from '../typeorm/entities/UserModule';
import { Module as ModuleModel } from '../typeorm/entities/Module';
import { InstituteModule } from '../typeorm/entities/InstituteModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModule, ModuleModel, InstituteModule]),
  ],
  controllers: [ModuleMicroserviceController],
  providers: [ModuleService],
})
export class ModuleModule {}
