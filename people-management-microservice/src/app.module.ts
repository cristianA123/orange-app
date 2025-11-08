import { ConfigModule } from '@nestjs/config';
import { databaseConfig } from './data-source';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { Institute } from './typeorm/entities/Institute';
import { InstituteModule } from './typeorm/entities/InstituteModule';
import { UserModule } from './typeorm/entities/UserModule';
import { Incident } from './typeorm/entities/Incident';
import { IncidentFile } from './typeorm/entities/IncidentFile';
import { Module as ModuleTypeOrm } from './typeorm/entities/Module';
// import { PeopleManagementModule } from './people-management/people-management.module';
import configuration from './config/configuration';
import { People } from './typeorm/entities/People';
import { PeopleManagementModule } from './people-management/people-management.module';
import { Department } from './typeorm/entities/Department';
import { Province } from './typeorm/entities/Province';
import { District } from './typeorm/entities/District';
import { Nationality } from './typeorm/entities/Nationality';
import { MaritalStatus } from './typeorm/entities/MaritalStatus';
import { Origin } from './typeorm/entities/Origin';
import { PensionSystem } from './typeorm/entities/PensionSystem';
import { LicenseA } from './typeorm/entities/LicenseA';
import { LicenseB } from './typeorm/entities/LicenseB';
import { EducationLevel } from './typeorm/entities/EducationLevel';
import { BloodType } from './typeorm/entities/BloodType';
import { EmergencyContactType } from './typeorm/entities/EmergencyContactType';
import { Child } from './typeorm/entities/Child';
import { Cargo } from './typeorm/entities/Cargo';

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
    PeopleManagementModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
