# Convención: autenticación y multi-tenancy

## Resumen

- Login y emisión de JWT: `users-microservice/src/auth/`.
- Validación de tokens en cada request: `NatsAuthGuard` global en el gateway.
- Acceso al usuario autenticado en controllers: `@UserDecorator() user: IUser`.
- Endpoints públicos (sin token): `@Public()`.
- Multi-tenancy: el gateway inyecta `instituteId` al payload NATS.

## JWT

- Firmado con `JWT_SECRET` (var de entorno — fallback `'123456'` **solo para dev**).
- Payload: `{ sub: userId, email, instituteId }`.
- Access token: `2d`. Refresh token: `7d`.
- Emitido por `AUTH_LOGIN` y `AUTH_REFRESH`.

## Guard global — `NatsAuthGuard`

`http-api-gateway/src/common/guards/auth.guards.ts`, registrado en `AppModule`:

```ts
providers: [{ provide: APP_GUARD, useClass: NatsAuthGuard }]
```

Flujo en cada request:

1. Si el handler (o la clase) tiene `@Public()` → pasa sin validar.
2. Extrae `Bearer <token>` del header `Authorization`.
3. Hace `natsClient.send('VERIFY_TOKEN', token)` al users-microservice.
4. El micro valida firma + expiración → devuelve `{ user, token }`.
5. Guard inyecta `request.user` y `request.token` (nuevo access, refresh suave).
6. Si falla → `handleRpcError` → `UnauthorizedException`.

## `IUser` y `@UserDecorator`

Interfaz compartida — `http-api-gateway/src/common/interfaces/user.interface.ts`:

```ts
export interface IUser {
  id: string;
  email: string;
  instituteId: string;
  name?: string;
  rol?: string;
}
```

Decorator — `src/common/decorators/user.decorator.ts`:

```ts
@Post('/incident')
async createIncident(@UserDecorator() user: IUser, @Body() dto: CreateIncidentDto) {
  // user.id, user.instituteId, user.rol disponibles acá
}
```

Si `request.user` no está → `InternalServerErrorException` (significa que el guard no corrió, usualmente porque pusiste `@Public()` sin querer).

## Endpoints públicos — `@Public()`

`http-api-gateway/src/common/decorators/public.decorator.ts`:

```ts
import { Public } from 'src/common/decorators';

@Public()
@Post('/auth/login')
async login(@Body() dto: LoginDto) { ... }
```

Úsalo en: login, refresh, webhooks externos, health checks. **Nunca** en endpoints que leen o escriben datos de un instituto.

## Multi-tenancy por `instituteId`

Cada request autenticado trae `user.instituteId` del JWT. **El gateway lo inyecta al payload NATS**; el micro NO debe confiar en `instituteId` que venga en el body.

Patrón correcto en el controller del gateway:

```ts
@Post('/incident')
async createIncident(
  @UserDecorator() user: IUser,
  @Body() createIncidentDto: CreateIncidentDto,
) {
  try {
    const response = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'CREATE_INCIDENT' },
        {
          ...createIncidentDto,
          userId: user.id,
          instituteId: user.instituteId,  // ← del token, no del body
        },
      ),
    );
    return response;
  } catch (error) {
    console.error(error);
    handleRpcError(error);
  }
}
```

**En el micro:** filtra todas las queries por `instituteId`:

```ts
this.incidentRepository.find({ where: { instituteId } });
```

## Checklist cuando agregas un endpoint

- [ ] ¿Es público? → `@Public()`. Si no, el guard corre automático, no hagas nada.
- [ ] ¿Opera sobre datos de un instituto? → recibe `user: IUser` con `@UserDecorator()`.
- [ ] ¿Pasas `instituteId` al micro? → siempre desde `user.instituteId`, nunca del body.
- [ ] ¿El service del micro filtra por `instituteId` en TypeORM? → obligatorio.
