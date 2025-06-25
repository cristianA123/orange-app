import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './typeorm/entities/Payment';
import { User } from './typeorm/entities/User';
import { databaseConfig } from './data-source';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig,
      host: 'mysql_db',
      entities: [User, Payment],
      synchronize: false,
      migrations: [__dirname + '/migrations/*.ts'],
    }),
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
