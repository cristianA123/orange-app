import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ModuleModule } from './modules/modules/module.module';
import { InstituteModule } from './modules/institute/institute.module';
import { IncidentModule } from './modules/incident/incident.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration], // carga el archivo configuration.ts
    }),
    UsersModule,
    AuthModule,
    ModuleModule,
    InstituteModule,
    IncidentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
