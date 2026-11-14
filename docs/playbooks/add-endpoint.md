# Playbook: agregar un endpoint nuevo

**Caso:** quieres exponer `POST /api/incident/comments` que crea un comentario asociado a un incidente.

Un endpoint toca **dos repos** (gateway + microservicio). Si se te olvida uno, el request llega al gateway y se queda esperando sin handler NATS.

Checklist resumido (los detalles vienen abajo):

- [ ] (1) Gateway: DTO en `http-api-gateway/src/modules/incident/dtos/`.
- [ ] (2) Gateway: handler en `incident.controller.ts` con `@UserDecorator` + `send({ cmd: 'CREATE_INCIDENT_COMMENT' }, payload)`.
- [ ] (3) Micro: DTO espejo en `incident-microservice/src/incident/dto/`.
- [ ] (4) Micro: `@MessagePattern({ cmd: 'CREATE_INCIDENT_COMMENT' })` en `incident.controller.ts`.
- [ ] (5) Micro: método en el service.
- [ ] (6) Probar con Bruno (`bruno/Incident/`). Ver [`reference/api-doc.md`](../reference/api-doc.md).
- [ ] (7) Agregar el `.bru` a la colección (`bruno/<Dominio>/`) en el mismo PR.

---

## 1. DTO en el gateway

`http-api-gateway/src/modules/incident/dtos/createIncidentComment.dto.ts`:

```ts
import { IsNotEmpty, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateIncidentCommentDto {
  @IsUUID()
  @IsNotEmpty()
  incident_id: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  message: string;
}
```

Reglas: ver [`conventions/dto-validation.md`](../conventions/dto-validation.md).

## 2. Handler en el controller del gateway

`http-api-gateway/src/modules/incident/incident.controller.ts`:

```ts
import { CreateIncidentCommentDto } from './dtos/createIncidentComment.dto';
import { UserDecorator } from 'src/common/decorators';
import { IUser } from 'src/common/interfaces';

@Post('/incident/comments')
@HttpCode(HttpStatus.OK)
async createComment(
  @UserDecorator() user: IUser,
  @Body() dto: CreateIncidentCommentDto,
) {
  try {
    const response = await lastValueFrom(
      this.natsClient.send(
        { cmd: 'CREATE_INCIDENT_COMMENT' },
        {
          ...dto,
          userId: user.id,
          instituteId: user.instituteId,   // ← multi-tenancy
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

Notas:

- **Nombre del `cmd`:** SCREAMING_SNAKE, prefijo del dominio (`CREATE_INCIDENT_COMMENT`). Ver [`conventions/naming.md`](../conventions/naming.md).
- **No pongas `@Public()`** si opera sobre datos de un instituto. Ver [`conventions/auth.md`](../conventions/auth.md).
- **`instituteId` siempre del token**, nunca del body.
- **try/catch obligatorio** con `handleRpcError`. Ver [`conventions/error-handling.md`](../conventions/error-handling.md).

## 3. DTO espejo en el microservicio

`incident-microservice/src/incident/dto/createIncidentComment.dto.ts` — misma shape que el del gateway, más los campos que el gateway inyecta:

```ts
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateIncidentCommentDto {
  @IsUUID() @IsNotEmpty() incident_id: string;
  @IsString() @IsNotEmpty() message: string;
  @IsUUID() @IsNotEmpty() userId: string;
  @IsUUID() @IsNotEmpty() instituteId: string;
}
```

El micro no tiene ValidationPipe global (solo el gateway), pero tipar el `@Payload()` ayuda a leer el código.

## 4. `@MessagePattern` en el controller del micro

`incident-microservice/src/incident/incident.controller.ts`:

```ts
@MessagePattern({ cmd: 'CREATE_INCIDENT_COMMENT' })
async createComment(@Payload() payload: CreateIncidentCommentDto) {
  return this.incidentService.createComment(payload);
}
```

## 5. Método en el service

`incident-microservice/src/incident/incident.service.ts`:

```ts
async createComment(payload: CreateIncidentCommentDto) {
  const incident = await this.incidentRepository.findOne({
    where: { id: payload.incident_id, instituteId: payload.instituteId },
  });

  if (!incident) {
    throw new RpcException({
      message: 'Incidente no encontrado',
      status: HttpStatus.NOT_FOUND,
    });
  }

  const comment = this.commentRepository.create({
    id: uuidv4(),
    incidentId: payload.incident_id,
    userId: payload.userId,
    message: payload.message,
  });

  const saved = await this.commentRepository.save(comment);
  return successResponse(saved, 'Comentario creado');
}
```

Reglas clave:

- **Filtra por `instituteId`** en la query del incidente (multi-tenancy).
- **`RpcException`** para errores, nunca `HttpException`.
- **`successResponse(data, msg)`** para el OK. Ver [`conventions/response-format.md`](../conventions/response-format.md).
- **Genera UUID con `uuidv4()`** (hay `import { v4 as uuidv4 } from 'uuid'` en los services existentes).

## 6. Probar

Con los containers corriendo (`docker compose up`):

```bash
# Login para obtener token (si no tienes uno)
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"x@y.com","password":"..."}'

# Llamar el endpoint
curl -X POST http://localhost:3000/api/incident/comments \
  -H "Authorization: Bearer <TOKEN>" \
  -H 'Content-Type: application/json' \
  -d '{"incident_id":"...","message":"primera prueba"}'
```

Esperado:

```json
{ "success": true, "message": "Comentario creado", "data": { ... } }
```

## 7. Registrar el endpoint en Bruno (obligatorio)

**Todo endpoint nuevo tiene su `.bru` en `bruno/<Dominio>/` dentro del mismo PR.** Esto mantiene la colección sincronizada con el código y el próximo dev (o agente) ve el shape real del body y la respuesta sin leer el controller.

Para el ejemplo, crear `bruno/Incident/Create Comment.bru`:

```
meta {
  name: Create Comment
  type: http
  seq: 15
}

post {
  url: {{baseUrl}}/incident/comments
  body: json
  auth: bearer
}

auth:bearer {
  token: {{token}}
}

body:json {
  {
    "incident_id": "incident-uuid",
    "message": "Comentario de prueba"
  }
}

docs {
  Crea un comentario asociado a un incidente. El gateway inyecta `userId` e `instituteId` del token.

  ## Response 200
  ```json
  { "success": true, "message": "Comentario creado", "data": { ... } }
  ```

  ## Errores
  - 404: incidente no encontrado
  - 400: validación del body
}
```

**Reglas de la colección:**

- **Un archivo por endpoint.** Nombre legible en inglés (`Create`, `Update`, `List by Institute`).
- **`seq`**: siguiente número libre dentro de la carpeta (ordena la vista en Bruno).
- **Auth**: `auth: bearer` + bloque `auth:bearer { token: {{token}} }` para autenticados; `auth: none` solo si tiene `@Public()`.
- **Path params**: declararlos en `params:path`. Usa las vars del environment (`{{instituteId}}`, `{{userId}}`) cuando aplique.
- **Query params**: en `params:query` con valor vacío por defecto.
- **`docs`**: describe qué hace, un ejemplo de response, y los códigos de error específicos.

Ver guía completa de Bruno en [`../reference/api-doc.md`](../reference/api-doc.md).

## Si modificas un endpoint existente

Cuando cambies el DTO, el path o el status code de un endpoint que ya existe, **también actualiza su `.bru`**:

| Cambio en el código                | Qué actualizar en el `.bru`                           |
| ---------------------------------- | ------------------------------------------------------ |
| Nuevo campo en el DTO              | Agregar al `body:json`.                                |
| Campo removido o renombrado        | Quitar/renombrar en el `body:json`.                    |
| Path cambió                        | `url:` del bloque de método.                           |
| Nuevo path param                   | Agregar a `params:path`.                               |
| `@Public()` agregado o removido    | `auth:` del bloque de método.                          |
| Nuevo tipo de error                | Agregar al bloque `docs`.                              |
| Cambia el shape de la response     | Actualizar el ejemplo de `Response 200` en `docs`.     |

**Regla:** si el revisor del PR tiene que preguntar "¿y cómo se llama a esto ahora?", el `.bru` no se actualizó.

## Errores típicos al hacer este flujo

Ver [`ops/troubleshooting.md`](../ops/troubleshooting.md) también.

- **Request se cuelga 30s y timeout:** no existe `@MessagePattern` en ningún micro para ese `cmd`. Revisa que esté escrito idéntico en los dos lados.
- **HTTP 400 "property X should not exist":** el body tiene campos que el DTO no declara. Revisa el DTO del gateway.
- **HTTP 401 "Token not found":** olvidaste el header o pusiste `@Public()` sin querer en el controller.
- **HTTP 500 "User not found in request":** el handler tiene `@UserDecorator()` pero el guard no corrió (típicamente por `@Public()`).
