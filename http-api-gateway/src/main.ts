import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomHttpExceptionFilter } from './filters/exception.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('cors.origins'),
    methods: 'GET, POST, PUT, DELETE, PATCH',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-token'],
    credentials: true,
  });

  app.setGlobalPrefix('/api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new CustomHttpExceptionFilter());
  const PORT = configService.get<number>('server.port');
  await app.listen(PORT, () => console.log(`Running on PORT ${PORT}`));
}

bootstrap();
