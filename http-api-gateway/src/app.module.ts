import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';
import { InstituteModule } from './modules/institute/institute.module';

@Module({
  imports: [UsersModule, PaymentsModule, AuthModule, InstituteModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
