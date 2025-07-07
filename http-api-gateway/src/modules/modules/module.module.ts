import { Module } from '@nestjs/common';
import { NatsClientModule } from 'src/nats-client/nats-client.module';
import { ModuleController } from './module.controller';

@Module({
  imports: [NatsClientModule],
  controllers: [ModuleController],
  providers: [],
})
export class ModuleModule {}
