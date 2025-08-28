import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './typeorm/entities/User';
import { Incident } from './typeorm/entities/Incident';
import { Institute } from './typeorm/entities/Institute';
import { IncidentFile } from './typeorm/entities/IncidentFile';
import { InstituteModule } from './typeorm/entities/InstituteModule';
import { Module } from './typeorm/entities/Module';
import { UserModule } from './typeorm/entities/UserModule';

export const databaseConfig = {
  type: process.env.DB_TYPE as any,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

export const keyDatabase: DataSourceOptions = {
  ...databaseConfig,
  host: process.env.DB_HOST,
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
