import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomHttpExceptionFilter } from './filters/exception.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CustomHttpExceptionFilter());
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => console.log(`Running on PORT ${PORT}`));
}

bootstrap();
