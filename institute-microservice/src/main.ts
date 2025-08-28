import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  console.log('Institute Microservice is Running!');
  const natsHost = process.env.NATS_HOST;

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
