import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './modules/auth/auth.module';
import { ModuleModule } from './modules/modules/module.module';
import { InstituteModule } from './modules/institute/institute.module';

@Module({
  imports: [
    UsersModule,
    PaymentsModule,
    AuthModule,
    ModuleModule,
    InstituteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
