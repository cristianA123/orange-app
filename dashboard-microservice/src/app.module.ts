import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './data-source';
import { Institute, User } from './typeorm/entities';
import { InstituteModule } from './typeorm/entities/InstituteModule';
import { UserModule } from './typeorm/entities/UserModule';
import { Incident } from './typeorm/entities/Incident';
import { IncidentFile } from './typeorm/entities/IncidentFile';
import { Module as ModuleTypeOrm } from './typeorm/entities/Module';
import { DashboardModule } from './dashboard/dashboard.module';
import configuration from "./confi/configuration";
import { ConfigModule } from '@nestjs/config';

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
            ],
            synchronize: false,
            migrations: [__dirname + '/migrations/*.ts'],
        }),
        DashboardModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
