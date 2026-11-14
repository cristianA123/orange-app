# Convención: manejo de errores

## Dos lados, dos contratos

- **Dentro de un microservicio:** siempre `RpcException` (NestJS lo serializa por NATS).
- **Dentro del gateway:** siempre `HttpException` (NestJS lo traduce a status code HTTP).

El puente entre ambos es `handleRpcError`.

## Microservicio: `RpcException`

Usa `new RpcException({ message, status })` directamente, o uno de los helpers en `src/exceptions/`.

```ts
import { RpcException } from '@nestjs/microservices';
import { HttpStatus } from '@nestjs/common';

throw new RpcException({
  message: `El correo ${email} ya está en uso`,
  status: HttpStatus.CONFLICT,
});
```

**Clave del status:** el código legacy usa `status` pero `handleRpcError` también lee `statusCode` y `code`. Para código nuevo usa **`status`** (es lo más común en el repo).

### Helpers reutilizables

En cada micro, patrón `src/exceptions/*.rpc-exception.ts`:

```ts
// not-found.rpc-exception.ts
export function NotFoundRpcException() {
  return new RpcException({
    statusCode: HttpStatus.NOT_FOUND,
    message: 'Usuario no encontrado',
  });
}
```

Úsalo así: `throw NotFoundRpcException();`. Cuando el mensaje sea muy específico, inline con `new RpcException(...)` está bien.

## Gateway: `handleRpcError`

En `http-api-gateway/src/common/erros/error-handler.ts`. **Todo controller del gateway** envuelve el `send(...)` en try/catch y llama a `handleRpcError(error)` en el catch:

```ts
try {
  const response = await lastValueFrom(
    this.natsClient.send({ cmd: 'CREATE_INCIDENT' }, payload),
  );
  return response;
} catch (error) {
  console.error(error);
  handleRpcError(error);  // nunca retorna: throw ...
}
```

Mapea:

| Status / code del `RpcException` | HttpException resultante           |
| -------------------------------- | ---------------------------------- |
| `400`, `422`                     | `BadRequestException`              |
| `401`                            | `UnauthorizedException`            |
| `403`                            | `ForbiddenException`               |
| `404`                            | `NotFoundException`                |
| `408`, `504`                     | `GatewayTimeoutException`          |
| `409`                            | `ConflictException`                |
| `500`                            | `InternalServerErrorException`    |
| `502`, `503`                     | `ServiceUnavailableException`     |
| otro                             | `InternalServerErrorException`    |

También detecta errores de DB (P2002, 11000) y errores de validación (`error.errors`).

## Reglas

1. **Nunca** dejes un `natsClient.send(...)` sin try/catch + `handleRpcError`.
2. **Nunca** lances `HttpException` dentro de un microservicio.
3. **Nunca** lances `RpcException` dentro del gateway.
4. El `console.error(error)` dentro del catch del gateway es el patrón actual — déjalo (ayuda a debuggear logs de Docker).
5. Si un service del micro quiere "fallar suave" (no excepción), retorna `errorResponse('mensaje')` en vez de tirar.
