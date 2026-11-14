import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { CustomHttpExceptionFilter } from './filters/exception.filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // CORS por entorno:
  //  - dev: refleja cualquier origen (compatible con credentials) para no
  //    tener que reconfigurar cada vez que un dev usa otro puerto, sube el
  //    front a Vercel/Netlify, o expone con un túnel distinto.
  //  - prod/qa: solo orígenes explícitos de CORS_ORIGINS + patrones de
  //    túneles conocidos.
  // Ver docs/conventions/auth.md y docs/playbooks/share-via-tunnel.md
  const isDev = configService.get<string>('server.environment') === 'development';
  const explicitOrigins = configService.get<string[]>('cors.origins') ?? [];
  const tunnelPatterns: RegExp[] = [
    /\.ngrok-free\.app$/,
    /\.ngrok\.app$/,
    /\.trycloudflare\.com$/,
    /\.loca\.lt$/,
  ];

  app.enableCors({
    origin: (origin, cb) => {
      // Requests sin header Origin (curl, Bruno, apps nativas) pasan.
      if (!origin) return cb(null, true);

      if (isDev) {
        // Dev: refleja el origin → permite credentials con cualquier frontend.
        return cb(null, true);
      }

      const allowed =
        explicitOrigins.includes(origin) ||
        tunnelPatterns.some((rx) => rx.test(origin));

      // No lanzamos error: dejamos que NestJS omita el header allow-origin
      // y que el browser bloquee naturalmente (no queremos response 500).
      cb(null, allowed);
    },
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
