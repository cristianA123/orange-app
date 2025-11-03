import { Module } from '@nestjs/common';
import { IncidentController } from './incident.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [IncidentController],
  providers: [],
})
export class IncidentModule {}
