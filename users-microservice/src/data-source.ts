import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './typeorm/entities/User';
import { Payment } from './typeorm/entities/Payment';

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
  entities: [User, Payment],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};

export const AppDataSource = new DataSource(keyDatabase);
