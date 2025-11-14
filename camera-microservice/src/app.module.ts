import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './data-source';
import { InstituteModule } from './typeorm/entities/InstituteModule';
import { UserModule } from './typeorm/entities/UserModule';
import { Incident } from './typeorm/entities/Incident';
import { IncidentFile } from './typeorm/entities/IncidentFile';
import { Module as ModuleTypeOrm } from './typeorm/entities/Module';
import { CameraModule } from './modules/camera.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import {Institute} from "./typeorm/entities/Institute";
import {User} from "./typeorm/entities/User";
import {Camera} from "./typeorm/entities/Camera";
import {People} from "./typeorm/entities/People";
import {Department} from "./typeorm/entities/Department";
import {Province} from "./typeorm/entities/Province";
import {Nationality} from "./typeorm/entities/Nationality";
import {MaritalStatus} from "./typeorm/entities/MaritalStatus";
import {District} from "./typeorm/entities/District";
import {Origin} from "./typeorm/entities/Origin";
import {PensionSystem} from "./typeorm/entities/PensionSystem";
import {LicenseA} from "./typeorm/entities/LicenseA";
import {LicenseB} from "./typeorm/entities/LicenseB";
import {EducationLevel} from "./typeorm/entities/EducationLevel";
import {BloodType} from "./typeorm/entities/BloodType";
import {EmergencyContactType} from "./typeorm/entities/EmergencyContactType";
import {Child} from "./typeorm/entities/Child";
import {Cargo} from "./typeorm/entities/Cargo";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      ...databaseConfig,
      entities: [
        User,
        Institute,
        ModuleTypeOrm,
        InstituteModule,
        UserModule,
        Incident,
        IncidentFile,
        People,
        Department,
        Province,
        District,
        Camera,
        Nationality,
        MaritalStatus,
        Origin,
        PensionSystem,
        LicenseA,
        LicenseB,
        EducationLevel,
        BloodType,
        EmergencyContactType,
        Child,
        Cargo,
      ],
      synchronize: false,
      migrations: [__dirname + '/migrations/*.ts'],
    }),
    CameraModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
