# Playbook: agregar un módulo nuevo en el gateway

**Caso:** vas a exponer un dominio nuevo en el gateway (por ejemplo "notifications") que redirecta todo a un microservicio existente o a uno nuevo. Esto es solo el "shell" del módulo — los endpoints concretos los agregas con [`add-endpoint.md`](./add-endpoint.md).

---

## 1. Crear la carpeta y archivos

```
http-api-gateway/src/modules/notifications/
├── notifications.controller.ts
├── notifications.module.ts
└── dtos/
```

### `notifications.module.ts`

```ts
import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NatsClientModule } from 'src/nats-client/nats-client.module';

@Module({
  imports: [NatsClientModule],
  controllers: [NotificationsController],
  providers: [],
})
export class NotificationsModule {}
```

Estructura: idéntica a `src/modules/users/users.module.ts`. **No agregues providers**: el gateway solo reenvía.

### `notifications.controller.ts` (esqueleto)

```ts
import { Controller, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('/notifications')
export class NotificationsController {
  constructor(@Inject('NATS_SERVICE') private natsClient: ClientProxy) {}

  // endpoints aquí — ver playbook add-endpoint.md
}
```

Nota: el prefijo global `/api` ya está puesto en `main.ts`, así que este controller quedará en `/api/notifications/...`.

## 2. Registrarlo en `AppModule`

`http-api-gateway/src/app.module.ts`:

```ts
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    NatsClientModule,
    UsersModule,
    AuthModule,
    ModuleModule,
    InstituteModule,
    DashboardModule,
    CameraModule,
    IncidentModule,
    PeopleManagementModule,
    NotificationsModule,              // ← agregar
  ],
  providers: [{ provide: APP_GUARD, useClass: NatsAuthGuard }],
})
export class AppModule {}
```

## 3. Decidir qué micro los atiende

Dos opciones:

- **Micro existente:** si el dominio es afín a alguno (ej. `incident-microservice`), ese micro agrega los `@MessagePattern` nuevos. No tienes que crear un micro nuevo.
- **Micro nuevo:** ver [`add-microservice.md`](./add-microservice.md).

## 4. Agregar endpoints

Ir a [`add-endpoint.md`](./add-endpoint.md) por cada endpoint concreto.
