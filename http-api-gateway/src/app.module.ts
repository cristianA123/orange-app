import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ModuleModule } from './modules/modules/module.module';
import { InstituteModule } from './modules/institute/institute.module';
import { IncidentModule } from './modules/incident/incident.module';

@Module({
  imports: [
    UsersModule,
    IncidentModule,
    AuthModule,
    ModuleModule,
    InstituteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
