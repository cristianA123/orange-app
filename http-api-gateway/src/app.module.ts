import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UsersModule, PaymentsModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
