import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './typeorm/entities/User';
import { Institute } from './typeorm/entities/Institute';
import { InstituteModule } from './typeorm/entities/InstituteModule';
import { UserModule } from './typeorm/entities/UserModule';
import { Incident } from './typeorm/entities/Incident';
import { IncidentFile } from './typeorm/entities/IncidentFile';
import { Module } from './typeorm/entities/Module';

export const databaseConfig = {
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export const keyDatabase: DataSourceOptions = {
  ...databaseConfig,
  entities: [
    User,
    Institute,
    Module,
    InstituteModule,
    UserModule,
    Incident,
    IncidentFile,
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

export const AppDataSource = new DataSource(keyDatabase);
