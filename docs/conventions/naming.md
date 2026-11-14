# Convención: nombres

## `cmd` NATS

**Regla para nuevos `cmd`: SCREAMING_SNAKE_CASE, verbo + sustantivo.**

```ts
{ cmd: 'CREATE_INCIDENT' }
{ cmd: 'GET_PEOPLE_BY_ID' }
{ cmd: 'UPDATE_INCIDENT_STATUS' }
```

Verbos usados en el código:
- `CREATE_`, `GET_`, `UPDATE_`, `DELETE_`
- `VALIDATE_` (checks sin side-effects: `VALIDATE_USER_BY_ID`)
- `SYNC_` (reemplazar lista completa: `SYNC_USER_MODULES`)
- `SEND_` (acción con side-effect externo: `SEND_INCIDENT_EMAIL`)
- `GENERATE_`, `CONFIRM_`, `UPLOAD_` (archivos: `GENERATE_PRESIGNED_URL`)
- `AUTH_` prefijo para auth: `AUTH_LOGIN`, `AUTH_REFRESH`

**Legacy:** existe `createUser` (camelCase) en `users-microservice`. **No agregues más en camelCase**; cuando toque tocar ese código, está OK migrarlo a `CREATE_USER`, pero no es obligatorio en PRs no relacionadas.

Catálogo completo: [`reference/nats-commands.md`](../reference/nats-commands.md).

## Archivos y carpetas

Módulos del gateway: `http-api-gateway/src/modules/<dominio>/`

```
modules/<dominio>/
  <dominio>.controller.ts
  <dominio>.module.ts
  dtos/
    CreateXxx.dto.ts        # PascalCase + ".dto.ts"
    UpdateXxx.dto.ts
```

Microservicio típico: `src/<dominio>/`

```
<dominio>/
  <dominio>.controller.ts    # @MessagePattern
  <dominio>.module.ts
  <dominio>.service.ts       # lógica + TypeORM
  dtos/
    CreateXxx.dto.ts
```

**Entidades TypeORM:** `src/typeorm/entities/<Nombre>.ts` — PascalCase, singular (`User.ts`, `Incident.ts`). El decorador `@Entity('nombres_tabla')` usa snake_case plural.

**Migraciones:** TypeORM CLI las crea con timestamp: `<timestamp>-<descripcion>.ts`. Clase con el mismo nombre + timestamp al final (`AddTableContact1763839426901`). No las renombres.

## Clases

- **Controller del gateway:** `XxxController` (no `XxxApiController` ni similar).
- **Controller del micro:** `XxxMicroserviceController` en algunos casos (users, auth), `XxxController` en otros (incident, people). **Para código nuevo usa `XxxMicroserviceController`** si es un micro, para distinguirlo del del gateway.
- **Service:** `XxxService`.
- **Module:** `XxxModule`.
- **DTO:** `CreateXxxDto` o `CreateXxxDTO` (hay ambos; preferir `Dto` nuevo, igual que NestJS CLI).

## Decoradores y propiedades

- JSON de payloads NATS: **snake_case** para IDs persistidos (`institute_id`, `people_id`, `contract_type_id`) por compat con los nombres de columna en DB, pero **camelCase** para el resto (`userId`, `instituteId`, `createdAt`). Hay inconsistencia histórica; cuando agregues un campo nuevo, sigue el estilo que ya tiene el DTO.
- Enums en PascalCase (`UserRole`, `UserStatus`), valores en SCREAMING_SNAKE (`ACTIVE`, `INACTIVE`, `REENTRY`).

## Archivos `.bru` (colección Bruno)

- **Un archivo por endpoint**, dentro de `bruno/<Dominio>/`. Nombre legible en inglés sin prefijo de verbo HTTP: `Create.bru`, `Update.bru`, `List by Institute.bru`, `Change Password.bru`.
- `meta.seq` define el orden en Bruno — número incremental dentro de la carpeta.
- Agregar/actualizar el `.bru` es parte de agregar/actualizar el endpoint (ver [`../playbooks/add-endpoint.md`](../playbooks/add-endpoint.md)).

### Auth — convención oficial

**Todos los requests autenticados** usan **bearer explícito** con `{{token}}`:

```
<method> {
  url: {{baseUrl}}/path
  auth: bearer
}

auth:bearer {
  token: {{token}}
}
```

**Nunca** usar `auth: inherit` (su comportamiento varía entre versiones de Bruno). **Nunca** declarar header `Authorization` a mano.

Para endpoints `@Public()`, usar `auth: none` y omitir el bloque `auth:bearer`.

El `{{token}}` se actualiza automáticamente al correr `Auth/Login` (y `Auth/Refresh`) — el usuario del `.bru` nunca lo copia a mano.
