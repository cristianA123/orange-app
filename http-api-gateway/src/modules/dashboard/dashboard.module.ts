import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
    imports: [NatsClientModule],
    controllers: [DashboardController],
    providers: [],
})
export class DashboardModule {}
