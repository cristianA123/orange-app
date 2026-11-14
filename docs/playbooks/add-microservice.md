# Playbook: crear un microservicio nuevo

**Caso:** vas a crear `notifications-microservice`. Es raro — primero valida que no quepa en uno existente.

Plantilla base: copia la estructura de `users-microservice` que es la más minimal.

---

## 1. Scaffolding

```bash
cp -R users-microservice notifications-microservice
cd notifications-microservice
```

Luego:

- Renombra el contenido: `grep -rl "users-microservice" src/ | xargs sed -i '' 's/users-microservice/notifications-microservice/g'` (en macOS; sin `''` en Linux).
- Edita `package.json`: cambia `"name"` a `"notifications-microservice"`.
- Borra `src/users/`, `src/auth/`, `src/migrations/` (si no aplican).
- Mantén: `src/main.ts`, `src/app.module.ts`, `src/data-source.ts`, `src/config/`, `src/common/`, `src/exceptions/`, `src/typeorm/`.

## 2. Ajustar `main.ts`

Debe quedar **idéntico** al patrón NATS (ver `users-microservice/src/main.ts`):

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  console.log('Notifications Microservice is Running!');
  const natsHost = process.env.NATS_HOST;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    { transport: Transport.NATS, options: { servers: [natsHost] } },
  );
  await app.listen();
}
bootstrap();
```

**Un microservicio no escucha HTTP** — no uses `NestFactory.create`.

## 3. `app.module.ts`

Mismo patrón que los otros: `ConfigModule.forRoot({ isGlobal: true, load: [configuration] })` + `TypeOrmModule.forRoot({ ...databaseConfig, entities: [...], synchronize: false, migrations: [...] })` + tus módulos de dominio.

## 4. `data-source.ts`

Copia el patrón. Solo incluye las entidades que **este** micro va a tocar.

## 5. Crear el módulo de dominio

```
src/notifications/
├── notifications.controller.ts    # @MessagePattern
├── notifications.module.ts
├── notifications.service.ts
└── dtos/
```

### Controller del micro

```ts
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';

@Controller()
export class NotificationsMicroserviceController {
  constructor(private readonly service: NotificationsService) {}

  @MessagePattern({ cmd: 'SEND_NOTIFICATION' })
  async send(@Payload() payload: SendNotificationDto) {
    return this.service.send(payload);
  }
}
```

### Service

- Repositorios con `@InjectRepository(Entity)`.
- Errores: `RpcException` (NO `HttpException`). Ver [`conventions/error-handling.md`](../conventions/error-handling.md).
- Respuestas: `successResponse(data, msg)`. Ver [`conventions/response-format.md`](../conventions/response-format.md).

## 6. Dockerfiles

Copia los dos de un micro existente (`users-microservice/Dockerfile` y `Dockerfile.prod`). Cambia solo las rutas:

En `Dockerfile.prod`:

```dockerfile
COPY ./notifications-microservice/package*.json ./   # ← nombre del directorio
...
COPY ./notifications-microservice/ .
```

## 7. Registrarlo en `docker-compose.yml` y `docker-compose.prod.yml`

Agrega un bloque siguiendo el patrón existente:

```yaml
notifications_microservice:
  build: ./notifications-microservice
  volumes:
    - ./notifications-microservice/src:/usr/src/app/src
    - ./.env:/usr/src/app/.env
  command: npm run start:dev
  environment:
    - NATS_HOST=${NATS_HOST}
    - DB_TYPE=${DB_TYPE}
    - DB_HOST=${DB_HOST}
    - DB_PORT=${DB_PORT}
    - DB_USERNAME=${DB_USERNAME}
    - DB_PASSWORD=${DB_PASSWORD}
    - DB_DATABASE=${DB_DATABASE}
  depends_on:
    - nats
    - mysql_db
```

Y en `docker-compose.prod.yml` (con `Dockerfile.prod` y **sin** volume de src):

```yaml
notifications_microservice:
  build:
    context: .
    dockerfile: ./notifications-microservice/Dockerfile.prod
  image: notifications_microservice-prod
  volumes:
    - ./.env:/usr/src/app/.env
  environment:
    - NATS_HOST=${NATS_HOST:-nats://nats:4222}
    # ... (iguales con defaults)
  depends_on:
    - nats
```

## 8. Agregar el módulo en el gateway

Ver [`add-module-in-gateway.md`](./add-module-in-gateway.md).

## 9. Probar

```bash
docker compose up --build notifications_microservice
```

Deberías ver `Notifications Microservice is Running!` en los logs. Luego usa un endpoint del gateway para verificar que el `send({cmd})` llega.
