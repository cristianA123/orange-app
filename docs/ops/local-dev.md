# Ops: desarrollo local

## Primera vez

```bash
# 1. Crear .env en la raíz (si no existe) — pide uno a tu compañero.
cp .env.dev .env   # si hay plantilla, si no, créalo desde env-vars.md

# 2. (Opcional) crear .env local para incident si vas a tocar ese micro
cp .env incident-microservice/.env

# 3. Build + up
docker compose up --build
```

Esto levanta: `mysql_db`, `nats`, `http-api-gateway`, y todos los microservicios. La primera vez tarda — está construyendo imágenes.

**Importante:** la primera vez las migraciones **no se corren automáticamente**. Ver [`playbooks/run-migrations.md`](../playbooks/run-migrations.md).

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
