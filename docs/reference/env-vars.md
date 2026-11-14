# Referencia: variables de entorno

Fuentes:

- `.env` en la raíz — montado en casi todos los containers.
- `incident-microservice/.env` — **local al servicio** en dev (ver `docker-compose.yml`).

## Comunes (todos los servicios)

| Variable      | Default dev            | Descripción                              |
| ------------- | ---------------------- | ---------------------------------------- |
| `NATS_HOST`   | `nats://nats:4222`     | URL del broker NATS.                     |
| `DB_TYPE`     | `mysql`                | Driver TypeORM.                          |
| `DB_HOST`     | `mysql_db`             | Hostname del MySQL.                      |
| `DB_PORT`     | `3306`                 | Puerto MySQL.                            |
| `DB_USERNAME` | `testuser`             | Usuario MySQL.                           |
| `DB_PASSWORD` | `testuser123`          | Password MySQL (en `.env`).              |
| `DB_DATABASE` | `nestjs_db`            | Nombre de la base.                       |

> ⚠️ `http-api-gateway/src/data-source.ts` tiene `password: '#!123456!#'` **hardcodeada** (para el CLI de migraciones). No lee de `.env` para el password. Ver [`playbooks/run-migrations.md`](../playbooks/run-migrations.md).

## Solo gateway

| Variable        | Default dev                                       | Descripción                               |
| --------------- | ------------------------------------------------- | ----------------------------------------- |
| `PORT`          | `3000`                                            | Puerto HTTP del gateway (prefix `/api`).  |
| `CORS_ORIGINS`  | `http://localhost:3000,http://localhost:5173`     | Lista separada por comas.                 |
| `NODE_ENV`      | `development`                                     | Solo se loggea; no cambia comportamiento. |

## Auth (users-microservice y gateway)

| Variable      | Default dev | Descripción                                        |
| ------------- | ----------- | -------------------------------------------------- |
| `JWT_SECRET`  | `123456`    | Firma JWT (access + refresh). **Cambiar en prod.** |

## S3 (incident, people-management)

| Variable                | Descripción                           |
| ----------------------- | ------------------------------------- |
| `AWS_REGION`            | Región del bucket.                    |
| `AWS_S3_BUCKET`         | Nombre del bucket.                    |
| `AWS_ACCESS_KEY_ID`     | Credencial.                           |
| `AWS_SECRET_ACCESS_KEY` | Credencial.                           |

## Email (solo incident-microservice)

| Variable        | Default dev        | Descripción                           |
| --------------- | ------------------ | ------------------------------------- |
| `MAIL_HOST`     | `smtp.gmail.com`   | SMTP host.                            |
| `MAIL_PORT`     | `587`              | SMTP port.                            |
| `MAIL_USER`     | —                  | Usuario SMTP (full email).            |
| `MAIL_PASSWORD` | —                  | App password (Gmail requiere 2FA).    |
| `MAIL_FROM`     | —                  | Dirección "From".                     |

## Resumen: qué servicio lee qué

| Servicio                          | Comunes | PORT/CORS | JWT | S3 | Mail |
| --------------------------------- | :-----: | :-------: | :-: | :-: | :--: |
| `http-api-gateway`                |   ✅    |    ✅     |  ✅ |    |      |
| `users-microservice`              |   ✅    |           |  ✅ |    |      |
| `institute-microservice`          |   ✅    |           |     |    |      |
| `modules-microservice`            |   ✅    |           |     |    |      |
| `camera-microservice`             |   ✅    |           |     |    |      |
| `incident-microservice`           |   ✅    |           |     | ✅ |  ✅  |
| `people-management-microservice`  |   ✅    |           |     | ✅ |      |
| `dashboard-microservice`          |   ✅    |           |     |    |      |

## Cómo agregar una nueva variable

1. Agrégala al `.env` (o al `.env` del micro específico si es local).
2. Si va a leerse desde TypeScript, ponla en `src/config/configuration.ts` del servicio que la usa, con fallback razonable.
3. Léela con `configService.get('key')`.
4. Agregarla al bloque `environment:` del servicio en `docker-compose.yml` **y** `docker-compose.prod.yml`.
5. Documéntala acá.
