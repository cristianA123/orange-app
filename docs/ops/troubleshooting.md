# Ops: troubleshooting

Catálogo de errores recurrentes con causa raíz y fix.

## Request HTTP

### El request se cuelga ~30s y da timeout

**Causa:** mandaste un `cmd` NATS que no tiene `@MessagePattern` del otro lado. NATS lo publica, nadie lo responde, el gateway espera hasta su timeout.

**Fix:**

- Grep por el `cmd` en todos los micros: `grep -r "'MI_CMD'" --include="*.ts" .`
- Debe aparecer en el controller del gateway (como `send({cmd})`) **y** en el controller del micro (como `@MessagePattern`).
- Verifica que el micro esté corriendo (`docker compose ps`).

### HTTP 400 "property X should not exist"

**Causa:** mandaste un campo en el body que no está en el DTO. El `ValidationPipe` global está con `forbidNonWhitelisted: true`.

**Fix:** elimina el campo del request **o** agrégalo al DTO con `@IsOptional()` + validador correspondiente.

### HTTP 401 "Token not found"

**Causa:** falta el header `Authorization: Bearer <token>`.

**Fix:** adjúntalo. Si el endpoint debería ser público, agrégale `@Public()` al handler en el gateway.

### HTTP 401 "Invalid or expired token"

**Causa:** el token expiró (access vive 2d, refresh 7d) o fue firmado con otro `JWT_SECRET`.

**Fix:** re-loguear (`POST /api/auth/login`) o rotar con refresh (`POST /api/auth/refresh`).

### HTTP 500 "User not found in request (AuthGuard)"

**Causa:** el handler del gateway usa `@UserDecorator()` pero el guard no corrió (por `@Public()` en la clase o el método).

**Fix:** quita `@Public()` o quita `@UserDecorator()`.

### HTTP 500 sin stack trace claro

**Causa:** un `RpcException` sin `status` definido llegó a `handleRpcError` que no lo pudo mapear.

**Fix:** en el micro, asegúrate de que `new RpcException({ message, status: HttpStatus.XXX })` siempre incluya `status`.

## Base de datos / migraciones

### `npm run migration:run` → "Access denied for user ..."

**Causa:** password incorrecta. Hay un **hardcode** en `http-api-gateway/src/data-source.ts` (`password: '#!123456!#'`) que ignora el `.env`.

**Fix:** edita temporalmente el hardcode en `data-source.ts`, corre la migración, y revierte antes de commitear.

### Migración se genera vacía

**Causa:** la entidad nueva no está en el array `entities` de `data-source.ts`.

**Fix:** agrégala. Ver [`playbooks/add-entity-and-migration.md`](../playbooks/add-entity-and-migration.md).

### Un micro arranca y se cae con "RepositoryNotFoundError"

**Causa:** usas `@InjectRepository(Xxx)` en un service, pero el módulo no lo registró con `TypeOrmModule.forFeature([Xxx])` **o** la entidad no está en `app.module.ts` → `TypeOrmModule.forRoot({ entities: [...] })`.

**Fix:**

1. Registrar la entidad en `app.module.ts` → `entities`.
2. Registrar en el `*.module.ts` del dominio: `TypeOrmModule.forFeature([Xxx])`.

### "Cannot find entity X" al generar migración

**Causa:** la entidad existe en el gateway pero no en los micros que la usan (o viceversa), y una relación `@ManyToOne(() => Xxx)` no resuelve.

**Fix:** revisar que la entidad y todas sus relaciones existan en **ese** servicio.

## Docker

### "Port already allocated"

**Causa:** otra cosa (o un `docker compose up` previo que no bajó) ocupa el puerto.

**Fix:**

```bash
docker compose down
lsof -i :3000   # o el puerto que choca
```

### Cambios en código no se reflejan

- En **dev**: debería recompilar solo (hay watch). Si no, ver logs del servicio — a veces un error de TS detiene el watch sin matar el container.
- Rebuild forzado: `docker compose up --build <servicio>`.
- Si tocaste `package.json`, **siempre** rebuild.

### NATS no conecta — "connect ECONNREFUSED"

**Causa:** `NATS_HOST` incorrecto, o el container `nats` no arrancó.

**Fix:**

- En Docker, `NATS_HOST=nats://nats:4222` (hostname del container).
- Fuera de Docker, `NATS_HOST=nats://localhost:4222`.

## Email (incident-microservice)

### SMTP 535 "Username and Password not accepted"

**Causa:** Gmail requiere **app password**, no la contraseña real; además 2FA activado.

**Fix:** genera un app password en tu cuenta Google y mete el string con espacios **entre comillas** en `.env`:

```
MAIL_PASSWORD="xxxx yyyy zzzz wwww"
```

## S3 (incident, people-management)

### "The AWS Access Key Id you provided does not exist"

**Causa:** credencial incorrecta o typo.

**Fix:** regenerar la access key en IAM, actualizar el `.env`, reiniciar el container.
