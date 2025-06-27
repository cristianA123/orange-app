import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './typeorm/entities/User';
import { Incident } from './typeorm/entities/Incident';
import { Institute } from './typeorm/entities/Institute';
import { IncidentFile } from './typeorm/entities/IncidentFile';
import { InstituteModule } from './typeorm/entities/InstituteModule';
import { Module } from './typeorm/entities/Module';
import { UserModule } from './typeorm/entities/UserModule';

export const databaseConfig = {
  type: 'mysql' as const,
  port: 3306,
  username: 'testuser',
  password: 'testuser123',
  database: 'nestjs_db',
};

export const keyDatabase: DataSourceOptions = {
  ...databaseConfig,
  host: 'localhost',
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
