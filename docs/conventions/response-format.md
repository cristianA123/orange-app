# Convención: formato de respuestas

## Éxito — `successResponse`

En cada microservicio hay `src/common/response/response.util.ts`:

```ts
export function successResponse<T>(data: T, message = 'Operación exitosa') {
  return { success: true, message, data };
}

export function errorResponse(message = 'Ocurrió un error', data: any = null) {
  return { success: false, message, data };
}
```

**Regla:** todos los services de microservicios retornan `successResponse(...)` o `errorResponse(...)`. **No devuelvan la entidad raw**.

Ejemplo (`users.service.ts`):

```ts
return successResponse(user, 'Usuario creado exitosamente');
```

El gateway reenvía este objeto tal cual al cliente → el cliente siempre ve:

```json
{ "success": true, "message": "...", "data": { ... } }
```

## Errores — dos caminos

### Error "esperable" dentro del service del micro

`throw new RpcException({ message, status })` — ver [`error-handling.md`](./error-handling.md).

El gateway lo mapea a `HttpException`, el `CustomHttpExceptionFilter` global lo serializa como:

```json
{ "message": "El correo X ya está en uso", "success": false }
```

### Error inesperado

`handleRpcError` cae en `InternalServerErrorException`, misma forma de respuesta pero con status 500.

## Exception filter global

`http-api-gateway/src/filters/exception.filters.ts`:

```ts
@Catch(HttpException)
export class CustomHttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const res = exception.getResponse();
    const message =
      typeof res === 'object' && res['message'] ? res['message'] : res;
    response.status(status).json({ message, success: false });
  }
}
```

**No agregues campos a este formato sin coordinar con el frontend** — todo el UI espera `message` y `success`.

## Qué NO hacer

- ❌ Retornar objetos crudos sin wrap (`return user`) desde el service del micro.
- ❌ Usar `throw new HttpException(...)` dentro de un microservicio (viaja mal por NATS). Usa `RpcException`.
- ❌ Agregar `statusCode` o `error` al JSON de respuesta si no están ya — rompería contratos con el cliente.
