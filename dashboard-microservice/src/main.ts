import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as process from 'process';

async function bootstrap() {
    console.log('Dashboard Microservice is Running!');
    const natsHost = process.env.NATS_HOST || 'localhost';
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
        options: {
            servers: [natsHost],
        },
    },
  );
  await app.listen();
}
bootstrap();
