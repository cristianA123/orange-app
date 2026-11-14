# Ops: deploy

## Build de producción

```bash
docker compose -f docker-compose.prod.yml up --build -d
```

Diferencias vs. dev:

- Usa `Dockerfile.prod` (multi-stage, imagen `node:18-alpine`, corre como user `nodejs`).
- No monta `src` como volumen — el código se copia en el build.
- Corre `node dist/main.js`, no `npm run start:dev`.
- Variables de entorno tienen defaults en el compose (`${NATS_HOST:-nats://nats:4222}`).

## Antes de deployar

- [ ] Correr migraciones nuevas en el entorno target. Ver [`playbooks/run-migrations.md`](../playbooks/run-migrations.md).
- [ ] Verificar que las vars sensibles (`JWT_SECRET`, AWS, MAIL) estén seteadas en el `.env` del entorno. Ver [`reference/env-vars.md`](../reference/env-vars.md).
- [ ] `JWT_SECRET` **no puede** ser `123456` en prod.
- [ ] `MAIL_PASSWORD` entre comillas si contiene espacios (`"xxxx xxxx xxxx xxxx"` para Gmail app passwords).

## Rebuild de un solo servicio

```bash
docker compose -f docker-compose.prod.yml up --build -d api_gateway
```

## Logs en prod

```bash
docker compose -f docker-compose.prod.yml logs -f --tail=200 <servicio>
```

## Rollback

No hay sistema de rollback automático. Opciones:

- `git checkout <sha-anterior>` y `docker compose -f docker-compose.prod.yml up --build -d`.
- Si tienes las imágenes etiquetadas en un registry, retaguearlas y relevantar.

## Nota sobre `docker-compose.prod.yml`

- `api_gateway`, `users`, `institute`, `modules`, `incident`, `people-management`, `dashboard` → corren desde `Dockerfile.prod` propio.
- `camera_microservice` todavía corre con `Dockerfile` (dev) y `npm run start:dev` en el compose prod. **Esto es tech debt**. Si tocas este servicio, migrar a `Dockerfile.prod`.
- No hay `mysql_db` en el compose prod — se asume MySQL externo (AWS RDS u otro). `DB_HOST` apunta a él.
