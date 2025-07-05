import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomHttpExceptionFilter } from './filters/exception.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
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
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => console.log(`Running on PORT ${PORT}`));
}

bootstrap();
