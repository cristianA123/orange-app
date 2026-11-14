# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Este archivo es intencionalmente corto. **El detalle vive en [`docs/`](./docs/README.md).** Lee los docs según la tarea; no asumas conocimiento no documentado.

## Qué es este repo

Monorepo de microservicios NestJS. Un gateway HTTP (`http-api-gateway`, puerto 3000, prefix `/api`) + N microservicios de negocio comunicados por **NATS**. MySQL compartida. Más detalle: [`docs/architecture.md`](./docs/architecture.md) y [`docs/reference/services-map.md`](./docs/reference/services-map.md).

## Regla de oro antes de cambiar código

**Busca el playbook antes de improvisar.** El código ya tiene convenciones consistentes; mantenerlas evita romper el patrón NATS gateway↔micro.

**Si tocas endpoints, actualiza Bruno en el mismo PR.** Crear un endpoint nuevo → nuevo `.bru` en `bruno/<Dominio>/`. Modificar uno existente (DTO, path, status) → actualizar su `.bru`. Un endpoint sin su `.bru` actualizado se considera incompleto. Guía completa en [`docs/reference/api-doc.md`](./docs/reference/api-doc.md).

**Patrón de auth en `.bru` — único válido:** `auth: bearer` + bloque `auth:bearer { token: {{token}} }` en cada request autenticado. `auth: none` para Public. **Prohibido** `auth: inherit`.

| Tarea                                      | Ir a                                                                  |
| ------------------------------------------ | --------------------------------------------------------------------- |
| Agregar un endpoint REST                   | [`docs/playbooks/add-endpoint.md`](./docs/playbooks/add-endpoint.md)   |
| Agregar una entidad TypeORM o migración    | [`docs/playbooks/add-entity-and-migration.md`](./docs/playbooks/add-entity-and-migration.md) |
| Agregar un módulo HTTP nuevo en el gateway | [`docs/playbooks/add-module-in-gateway.md`](./docs/playbooks/add-module-in-gateway.md) |
| Crear un microservicio nuevo               | [`docs/playbooks/add-microservice.md`](./docs/playbooks/add-microservice.md) |
| Correr migraciones                         | [`docs/playbooks/run-migrations.md`](./docs/playbooks/run-migrations.md) |
| Gestionar seeds de dev                     | [`docs/playbooks/manage-seeds.md`](./docs/playbooks/manage-seeds.md)     |
| Compartir API local con otra persona       | [`docs/playbooks/share-via-tunnel.md`](./docs/playbooks/share-via-tunnel.md) + `scripts/share-tunnel.sh` |
| Levantar / detener local                   | [`docs/ops/local-dev.md`](./docs/ops/local-dev.md)                     |
| Deployar prod                              | [`docs/ops/deploy.md`](./docs/ops/deploy.md)                           |
| Error extraño                              | [`docs/ops/troubleshooting.md`](./docs/ops/troubleshooting.md)         |
| Probar un endpoint / documentar la API     | [`docs/reference/api-doc.md`](./docs/reference/api-doc.md) (colección Bruno en `bruno/`) |

## Convenciones críticas (no romper)

Resumidas acá. **Si vas a escribir código, lee la versión completa en los links.**

- **`cmd` NATS = contrato gateway↔micro.** Agregar/renombrar uno = tocar ambos lados. Convención: `SCREAMING_SNAKE_CASE`. → [`docs/conventions/naming.md`](./docs/conventions/naming.md), catálogo en [`docs/reference/nats-commands.md`](./docs/reference/nats-commands.md).
- **Auth global** con `NatsAuthGuard`. Usar `@Public()` para saltarlo, `@UserDecorator()` para leer el usuario. `instituteId` siempre del token, nunca del body. → [`docs/conventions/auth.md`](./docs/conventions/auth.md).
- **Errores**: en micro `throw new RpcException({ message, status })`. En gateway, `try { ... } catch (e) { handleRpcError(e) }`. **Nunca** `HttpException` en un micro. → [`docs/conventions/error-handling.md`](./docs/conventions/error-handling.md).
- **Respuestas**: `successResponse(data, msg)` y `errorResponse(msg)` desde el service del micro. El filter global formatea como `{ message, success }`. → [`docs/conventions/response-format.md`](./docs/conventions/response-format.md).
- **DTOs** con `class-validator`. `ValidationPipe` global tiene `forbidNonWhitelisted: true` — cualquier campo extra = 400. → [`docs/conventions/dto-validation.md`](./docs/conventions/dto-validation.md).
- **Entidades TypeORM duplicadas** entre micros. Al cambiar una, sincronizar todas las copias y los `data-source.ts` + `app.module.ts`. → [`docs/conventions/entities.md`](./docs/conventions/entities.md).
- **Migraciones centralizadas en `http-api-gateway/src/migrations/`** (fuente de verdad del schema). → [`docs/playbooks/run-migrations.md`](./docs/playbooks/run-migrations.md).

## Comandos esenciales

Los scripts npm son estándar NestJS y son iguales en cada carpeta de servicio (`npm run start:dev`, `npm run build`, `npm test`, `npm run lint`). Detalles y variantes en [`docs/ops/local-dev.md`](./docs/ops/local-dev.md).

```bash
# Setup completo en un comando: envs + containers + migraciones + seed
./scripts/setup.sh         # macOS / Linux
# .\scripts\setup.bat      # Windows (equivalente)

# (Opcional) si prefieres ir manual:
cp .env.dev .env
cp http-api-gateway/.env.dev http-api-gateway/.env
cp users-microservice/.env.dev users-microservice/.env
cp incident-microservice/.env.dev incident-microservice/.env
cp people-management-microservice/.env.dev people-management-microservice/.env

docker compose up --build
docker compose exec api_gateway npm run migration:run
docker compose exec api_gateway npm run seed:dev

# Prod
docker compose -f docker-compose.prod.yml up --build -d

# Migraciones (desde http-api-gateway/)
npm run migration:generate ./src/migrations/NombreMigracion
npm run migration:run
```

Las vars están **separadas por scope**: raíz tiene las comunes (DB, NATS), cada micro con necesidades propias tiene su `.env` con las específicas (JWT en gateway+users, AWS/Mail en incident, AWS en people-management). `docker-compose` carga ambos con `env_file: [./.env, ./<servicio>/.env]`. Detalle completo en [`docs/reference/env-vars.md`](./docs/reference/env-vars.md).

## Idioma

Código, mensajes de error, commits y comentarios suelen estar en español; respetar al editar.
