import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleMicroserviceController } from './module.controller';
import { ModuleService } from './module.service';
import { UserModule } from '../typeorm/entities/UserModule';

@Module({
  imports: [TypeOrmModule.forFeature([UserModule])],
  controllers: [ModuleMicroserviceController],
  providers: [ModuleService],
})
export class ModuleModule {}
