import { databaseConfig } from './data-source';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { Institute } from './typeorm/entities/Institute';
import { InstituteModule } from './typeorm/entities/InstituteModule';
import { UserModule } from './typeorm/entities/UserModule';
import { Incident } from './typeorm/entities/Incident';
import { IncidentFile } from './typeorm/entities/IncidentFile';
import { Module as ModuleTypeOrm } from './typeorm/entities/Module';
import { InstituteModule as InstituteModule2 } from './institute/institute.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...databaseConfig,
      host: 'mysql_db',
      entities: [
        User,
        Institute,
        ModuleTypeOrm,
        InstituteModule,
        UserModule,
        Incident,
        IncidentFile,
      ],
      synchronize: false,
      migrations: [__dirname + '/migrations/*.ts'],
    }),
    UsersModule,
    InstituteModule2,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
