import { Module } from '@nestjs/common';
import { InstituteController } from './institute.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [InstituteController],
  providers: [],
})
export class InstituteModule {}
