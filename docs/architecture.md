# Arquitectura

## Visión general

Monorepo de microservicios NestJS. Un único **gateway HTTP** (`http-api-gateway`) expone la API pública bajo `/api` y N **microservicios de negocio** se comunican con él y entre sí vía **NATS** (`nats://nats:4222`).

```
                    ┌────────────────────┐
  Cliente ────HTTP──►│  http-api-gateway  │
                    │    (puerto 3000)   │
                    │  prefix: /api      │
                    └─────────┬──────────┘
                              │ NATS send({cmd}, payload)
                              ▼
                    ┌────────────────────┐
                    │        NATS        │
                    └─────────┬──────────┘
                              │
      ┌────────────┬──────────┼──────────┬────────────┬──────────┐
      ▼            ▼          ▼          ▼            ▼          ▼
   users-        auth      incident   institute    modules    people-
   micro         (dentro   micro      micro        micro      management
                 de users)                                    micro
                                                              + dashboard
                                                              + camera
      │                                                            │
      └─────────────────── MySQL (compartido) ─────────────────────┘
```

## Servicios

| Servicio                          | Responsabilidad                                                                                  |
| --------------------------------- | ------------------------------------------------------------------------------------------------ |
| `http-api-gateway`                | Único entrypoint HTTP. No tiene lógica de negocio: reenvía por NATS. Expone `/api/*`.            |
| `users-microservice`              | Usuarios + **auth** (login, refresh, `VERIFY_TOKEN`). JWT firmado con `JWT_SECRET`.             |
| `incident-microservice`           | Incidentes, archivos (AWS S3), generación de PDF (pdfmake), emails SMTP + plantillas Handlebars. |
| `camera-microservice`             | Cámaras y mapa de calor.                                                                         |
| `institute-microservice`          | Institutos (tenants) y su configuración.                                                         |
| `modules-microservice`            | Permisos / módulos por instituto y por usuario.                                                  |
| `people-management-microservice`  | Personas, contratos, archivos de contrato (S3), ubigeo (departamentos/provincias/distritos).     |
| `dashboard-microservice`          | KPIs, reportes y agregados para el dashboard.                                                    |

Dependencias compartidas:
- **MySQL** (container `mysql_db`, puerto 3306). Todos los micros apuntan a la misma base `nestjs_db`.
- **NATS** (container `nats`, puerto 4222). Bus único.

## Flujo de un request REST → microservicio

Ejemplo: `POST /api/incident`.

1. **Cliente → gateway**. CORS validado con `CORS_ORIGINS`. `ValidationPipe` global valida el body contra el DTO (`whitelist`, `forbidNonWhitelisted`, `transform`).
2. **`NatsAuthGuard` (global)** — `http-api-gateway/src/common/guards/auth.guards.ts`:
   - Si el handler tiene `@Public()`, lo salta.
   - Si no, extrae `Bearer` del header `Authorization`.
   - Hace `natsClient.send('VERIFY_TOKEN', token)` al `users-microservice`.
   - Inyecta `request.user: IUser` y `request.token` (nuevo access token).
3. **Controller del gateway** — ej. `src/modules/incident/incident.controller.ts`:
   - Lee `@UserDecorator() user` → `IUser`.
   - Inyecta `userId` / `instituteId` al payload antes de reenviar.
   - `lastValueFrom(this.natsClient.send({ cmd: 'CREATE_INCIDENT' }, payload))`.
4. **Microservicio** — `@MessagePattern({ cmd: 'CREATE_INCIDENT' })` en el controller del micro recibe el payload y llama al service.
5. **Service** — hace la operación TypeORM. Si algo falla, lanza `RpcException({ message, status })`.
6. **Respuesta de retorno**:
   - OK: `successResponse(data, 'mensaje')` → `{ success: true, message, data }`.
   - Error: el `RpcException` viaja de vuelta al gateway → `handleRpcError(error)` en el catch del controller del gateway lo mapea a `BadRequest/Unauthorized/NotFound/Conflict/...`.
7. **`CustomHttpExceptionFilter` (global)** — serializa toda `HttpException` como `{ message, success: false }`.

## Puntos clave de integración

- **Los `cmd` NATS son contrato entre gateway y micro.** Para agregar/mover/renombrar uno hay que tocar los dos lados. Ver [`conventions/naming.md`](./conventions/naming.md) y [`playbooks/add-endpoint.md`](./playbooks/add-endpoint.md).
- **Multi-tenancy por `instituteId`.** El JWT trae `instituteId`; el gateway lo pasa al payload NATS; los services del micro filtran por él. Ver [`conventions/auth.md`](./conventions/auth.md).
- **Entidades TypeORM duplicadas por servicio.** Cada microservicio tiene su copia en `src/typeorm/entities/` y la lista en `src/data-source.ts`. Ver [`conventions/entities.md`](./conventions/entities.md).
- **Migraciones centralizadas en el gateway.** `http-api-gateway/src/migrations/` es la fuente de verdad del schema. Ver [`playbooks/run-migrations.md`](./playbooks/run-migrations.md).
