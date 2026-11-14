# Referencia: variables de entorno

El proyecto usa un **esquema por scope**: las vars comunes a varios servicios viven en el `.env` raíz, las específicas de cada servicio en su propio `.env`. `docker-compose` carga ambos con `env_file: [./.env, ./<servicio>/.env]`.

## Archivos del repo

### Raíz

| Archivo         | Tracking | Rol                                                                    |
| --------------- | -------- | ---------------------------------------------------------------------- |
| `.env.example`  | ✅ git   | Plantilla pública (vars comunes, sin valores sensibles).               |
| `.env.dev`      | ignored  | Plantilla local para dev (apunta a containers de compose).             |
| `.env.qa`       | ignored  | Plantilla local para apuntar a QA.                                     |
| `.env`          | ignored  | **El que lee docker-compose.** Copia de `.env.dev` o `.env.qa`.        |

**Contenido raíz (vars comunes a todos los micros):**

| Var            | Default dev            | Descripción                              |
| -------------- | ---------------------- | ---------------------------------------- |
| `DB_TYPE`      | `mysql`                | Driver TypeORM.                          |
| `DB_HOST`      | `mysql_db`             | Hostname MySQL.                          |
| `DB_PORT`      | `3306`                 | Puerto MySQL.                            |
| `DB_USERNAME`  | `testuser`             | Usuario MySQL.                           |
| `DB_PASSWORD`  | `testuser123`          | Password MySQL.                          |
| `DB_DATABASE`  | `nestjs_db`            | Nombre de la base.                       |
| `NATS_HOST`    | `nats://nats:4222`     | URL del broker NATS.                     |
| `NODE_ENV`     | `development`          | Modo Node.                               |

### Por microservicio

| Servicio                          | `.env` propio | Vars específicas                                                    |
| --------------------------------- | :-----------: | ------------------------------------------------------------------- |
| `http-api-gateway`                | ✅            | `PORT`, `CORS_ORIGINS`, `JWT_SECRET`, + `DB_*` (CLI de migraciones) |
| `users-microservice`              | ✅            | `JWT_SECRET` (debe coincidir con gateway)                           |
| `incident-microservice`           | ✅            | `AWS_*`, `MAIL_*`                                                   |
| `people-management-microservice`  | ✅            | `AWS_*`                                                             |
| `institute-microservice`          | —             | (hereda todo del raíz)                                              |
| `modules-microservice`            | —             | (hereda todo del raíz)                                              |
| `dashboard-microservice`          | —             | (hereda todo del raíz)                                              |
| `camera-microservice`             | —             | (hereda todo del raíz)                                              |

Cada servicio con `.env` propio también tiene:
- `.env.example` → en git, plantilla pública.
- `.env.dev` → ignored, plantilla local para dev.
- `.env` → ignored, el que levanta el container.

## Cómo funciona el merge en docker-compose

```yaml
users_microservice:
  env_file:
    - ./.env                       # vars comunes (DB_*, NATS_HOST, NODE_ENV)
    - ./users-microservice/.env    # vars específicas (JWT_SECRET)
```

Docker Compose carga los archivos **en orden**. Si una var aparece en los dos, **gana el último**.

### Caso especial del gateway

```yaml
api_gateway:
  env_file:
    - ./http-api-gateway/.env      # tiene DB_HOST=localhost (para CLI de migraciones desde host)
    - ./.env                       # tiene DB_HOST=mysql_db (para runtime del container)
```

El orden está **invertido** a propósito: así el `.env` raíz pisa `DB_HOST` para el container, pero el `.env` del gateway mantiene `DB_HOST=localhost` para cuando corras `npm run migration:run` desde la terminal del host (donde `mysql_db` no es resolvible pero `localhost:3306` sí, porque el puerto está publicado).

## Primera vez: activar los `.env`

```bash
# En la raíz
cp .env.dev .env

# En cada servicio con vars propias
cp http-api-gateway/.env.dev http-api-gateway/.env
cp users-microservice/.env.dev users-microservice/.env
cp incident-microservice/.env.dev incident-microservice/.env
cp people-management-microservice/.env.dev people-management-microservice/.env
```

## Resumen: qué servicio lee qué

| Servicio                          | Comunes (raíz) | PORT/CORS | JWT | S3 | Mail |
| --------------------------------- | :------------: | :-------: | :-: | :-: | :--: |
| `http-api-gateway`                |       ✅       |     ✅    |  ✅ |    |      |
| `users-microservice`              |       ✅       |           |  ✅ |    |      |
| `institute-microservice`          |       ✅       |           |     |    |      |
| `modules-microservice`            |       ✅       |           |     |    |      |
| `camera-microservice`             |       ✅       |           |     |    |      |
| `incident-microservice`           |       ✅       |           |     | ✅ |  ✅  |
| `people-management-microservice`  |       ✅       |           |     | ✅ |      |
| `dashboard-microservice`          |       ✅       |           |     |    |      |

## Cómo agregar una variable nueva

1. **¿La usan todos (o la mayoría de) los micros?** → `.env.dev` raíz.
2. **¿La usa un solo micro?** → `<servicio>/.env.dev` (crear el servicio-nivel si no tiene).
3. **¿La usan 2-3 micros?** → preferir el `.env` raíz si no hay riesgo (ej. `JWT_SECRET` queda en gateway + users pero son los únicos; vive en ambos `.env` de servicio para que sea explícito).
4. Actualizar el `.env.example` correspondiente (va a git).
5. Si no existía antes, agregar `env_file:` del servicio en `docker-compose.yml` y `docker-compose.prod.yml`.
6. Si solo la usa el servicio dentro de sus hooks de boot, `process.env.MI_VAR` la ve directamente (ConfigModule.forRoot lee `process.env`).
7. Documentarla en este archivo.

## `ConfigModule` y `dotenv/config`

- Todos los micros usan `ConfigModule.forRoot({ isGlobal: true, load: [configuration] })` **sin `envFilePath`**. Nest lee `process.env` → las vars que docker-compose inyecta via `env_file:` están disponibles sin más.
- `http-api-gateway/src/data-source.ts` **sí** usa `import 'dotenv/config'` como primera línea. Esto es para que la CLI de migraciones corrida **fuera de Docker** cargue `http-api-gateway/.env`. Dentro del container no afecta (process.env ya tiene todo).
