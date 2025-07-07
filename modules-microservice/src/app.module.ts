import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './data-source';
import { Institute, User } from './typeorm/entities';
import { InstituteModule } from './typeorm/entities/InstituteModule';
import { UserModule } from './typeorm/entities/UserModule';
import { Incident } from './typeorm/entities/Incident';
import { IncidentFile } from './typeorm/entities/IncidentFile';
import { Module as ModuleTypeOrm } from './typeorm/entities/Module';
import { ModuleModule } from './modules/module.module';

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
    ModuleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
