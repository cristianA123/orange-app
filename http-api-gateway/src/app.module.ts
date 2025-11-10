import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ModuleModule } from './modules/modules/module.module';
import { InstituteModule } from './modules/institute/institute.module';
import { IncidentModule } from './modules/incident/incident.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import configuration from './config/configuration';
import { NatsAuthGuard } from './common/guards/auth.guards';
import { APP_GUARD } from '@nestjs/core';
import { NatsClientModule } from './nats-client/nats-client.module';
import { PeopleManagementModule } from './modules/people-management/people-management.module';
import {CameraModule} from "./modules/camera/camera.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration], // carga el archivo configuration.ts
    }),
    NatsClientModule,
    UsersModule,
    AuthModule,
    ModuleModule,
    InstituteModule,
    DashboardModule,
    CameraModule,
    IncidentModule,
    PeopleManagementModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: NatsAuthGuard, // Guardia global
    },
  ],
})
export class AppModule {}
