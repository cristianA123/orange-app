import { Module } from '@nestjs/common';
import { CameraController } from './camera.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [CameraController],
  providers: [],
})
export class CameraModule {}
