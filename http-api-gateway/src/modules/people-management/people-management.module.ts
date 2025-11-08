import { Module } from '@nestjs/common';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { PeopleManagementController } from './people-management.controller';

@Module({
  imports: [NatsClientModule],
  controllers: [PeopleManagementController],
  providers: [],
})
export class PeopleManagementModule {}
