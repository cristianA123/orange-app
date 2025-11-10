import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CameraMicroserviceController } from './camera.controller';
import { CameraService } from './camera.service';
import { UserModule } from '../typeorm/entities/UserModule';
import { Incident } from '../typeorm/entities/Incident';
import { InstituteModule } from '../typeorm/entities/InstituteModule';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModule, Incident, InstituteModule]),
  ],
  controllers: [CameraMicroserviceController],
  providers: [CameraService],
})
export class CameraModule {}
