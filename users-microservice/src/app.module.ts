import { databaseConfig } from './data-source';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { Payment } from './typeorm/entities/Payment';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig,
      host: 'mysql_db',
      entities: [User, Payment],
      synchronize: false,
      migrations: [__dirname + '/migrations/*.ts'],
    }),
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
