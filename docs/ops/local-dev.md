# Ops: desarrollo local

## Primera vez — opción 1 (recomendada): un solo comando

**macOS / Linux**:

```bash
./scripts/setup.sh
```

**Windows** (doble clic o desde cmd/PowerShell):

```powershell
.\scripts\setup.bat
```

Ambos hacen lo mismo: copian `.env.dev` → `.env`, levantan containers, corren migraciones, corren seed. Dejan el backend listo con los 7 usuarios de dev.

Ver [`../../scripts/`](../../scripts/) y [`manage-seeds.md`](../playbooks/manage-seeds.md) para detalle.

## Primera vez — opción 2 (paso a paso manual)

```bash
# Comunes (DB, NATS)
cp .env.dev .env

# Específicas por servicio
cp http-api-gateway/.env.dev http-api-gateway/.env
cp users-microservice/.env.dev users-microservice/.env
cp incident-microservice/.env.dev incident-microservice/.env
cp people-management-microservice/.env.dev people-management-microservice/.env

# Build + up
docker compose up --build
```

Esto levanta: `mysql_db`, `nats`, `http-api-gateway`, y todos los microservicios. La primera vez tarda — está construyendo imágenes.

**Esquema de `.env`:** el `.env` raíz tiene las vars comunes (DB, NATS). Cada microservicio con necesidades propias (gateway, users, incident, people-management) tiene su propio `.env` con sus vars específicas (puertos, JWT, AWS, mail). `docker-compose.yml` carga los dos con `env_file: [./.env, ./<servicio>/.env]`. Detalle completo en [`../reference/env-vars.md`](../reference/env-vars.md).

**`.env.dev` vs `.env.qa`:**

- `.env.dev` — plantilla para desarrollo local con Docker (apunta a `mysql_db`, puertos locales).
- `.env.qa` — plantilla para apuntar al RDS/S3/SMTP de QA. Solo úsalo si QA está vivo.
- `.env` — es una **copia** de `.env.dev` o `.env.qa`. Es el que lee docker-compose.

**Importante:** la primera vez tienes que correr **migraciones + seed** a mano:

```bash
docker compose exec api_gateway npm run migration:run
docker compose exec api_gateway npm run seed:dev
```

- `migration:run` → crea el schema (ver [`playbooks/run-migrations.md`](../playbooks/run-migrations.md)).
- `seed:dev` → inserta 3 institutos, 7 usuarios, 8 módulos con sus asignaciones y UUIDs fijos (ver [`playbooks/manage-seeds.md`](../playbooks/manage-seeds.md)).

Después de esto puedes loguear en Bruno con `superadmin@orange.dev` / `password123`.

## Flujo normal

```bash
docker compose up
```

Los micros corren con `npm run start:dev` (nest watch). Como los volúmenes montan `./<servicio>/src` → el container, **cambios en código se recompilan en caliente** sin rebuild.

Rebuild solo cuando:

- Cambia `package.json` (nuevas dependencias).
- Cambia el `Dockerfile`.
- Agregas un microservicio nuevo.

```bash
docker compose up --build <servicio>
```

## Detener

```bash
docker compose down            # para containers, mantiene volumes
docker compose down -v         # también borra volúmenes (datos de MySQL)
```

## Ver logs

```bash
docker compose logs -f <servicio>
docker compose logs -f api_gateway users_microservice
```

## Shell dentro de un container

```bash
docker compose exec api_gateway sh
```

Útil para correr migraciones sin instalar deps locales:

```bash
docker compose exec api_gateway npm run migration:run
```

## Conectarse a MySQL

Desde el host:

```bash
mysql -h 127.0.0.1 -P 3306 -u testuser -ptestuser123 nestjs_db
```

(Usuario y pass tomados del `docker-compose.yml`.)

## Probar el gateway

Health check rápido (si está autenticado):

```bash
curl http://localhost:3000/api/user -H "Authorization: Bearer <TOKEN>"
```

Sin token obtienes `401 Unauthorized`.

## Nuevas dependencias npm

```bash
cd <servicio>
npm install <paquete>
# docker compose up --build <servicio>  # para que use la nueva imagen
```

**Alternativa en caliente:** entra al container y corre `npm install` ahí — pero se pierde al reconstruir. Mejor commit del `package.json` + rebuild.

## Puertos ocupados

- `3000`: gateway (configurable con `PORT` en `.env`).
- `3306`: MySQL.
- `4222`: NATS.

Si alguno choca, detén lo que estés usando o cambia `PORT` en `.env` (solo aplica al gateway; el resto son del `docker-compose.yml`).
