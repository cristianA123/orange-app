import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './typeorm/entities/User';
import { Incident } from './typeorm/entities/Incident';
import { Institute } from './typeorm/entities/Institute';
import { IncidentFile } from './typeorm/entities/IncidentFile';
import { InstituteModule } from './typeorm/entities/InstituteModule';
import { Module } from './typeorm/entities/Module';
import { UserModule } from './typeorm/entities/UserModule';
import { Department } from './typeorm/entities/Department';
import { Province } from './typeorm/entities/Province';
import { District } from './typeorm/entities/District';
import { Origin } from './typeorm/entities/Origin';
import { BloodType } from './typeorm/entities/BloodType';
import { EducationLevel } from './typeorm/entities/EducationLevel';
import { EmergencyContactType } from './typeorm/entities/EmergencyContactType';
import { LicenseA } from './typeorm/entities/LicenseA';
import { LicenseB } from './typeorm/entities/LicenseB';
import { MaritalStatus } from './typeorm/entities/MaritalStatus';
import { Nationality } from './typeorm/entities/Nationality';
import { PensionSystem } from './typeorm/entities/PensionSystem';
import { People } from './typeorm/entities/People';
import { Child } from './typeorm/entities/Child';
import { Cargo } from './typeorm/entities/Cargo';
import { Camera } from './typeorm/entities/Camera';
import { Contract } from './typeorm/entities/Contract';
import { ContractType } from './typeorm/entities/ContractType';
import { Area } from './typeorm/entities/Area';
import { ContractFile } from './typeorm/entities/ContractFile';

export const databaseConfig = {
  type: process.env.DB_TYPE as any,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export const keyDatabase: DataSourceOptions = {
  ...databaseConfig,
  // host: process.env.DB_HOST,
  // host: 'localhost',
  entities: [
    User,
    Institute,
    Module,
    InstituteModule,
    UserModule,
    Incident,
    IncidentFile,
    Department,
    Province,
    District,
    Origin,
    BloodType,
    EducationLevel,
    EmergencyContactType,
    LicenseA,
    LicenseB,
    MaritalStatus,
    Nationality,
    PensionSystem,
    Cargo,
    Camera,
    People,
    Child,
    Contract,
    ContractType,
    Area,
    ContractFile,
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

export const AppDataSource = new DataSource(keyDatabase);
