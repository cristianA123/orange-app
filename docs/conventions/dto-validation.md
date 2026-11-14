# Convención: DTOs y validación

## ValidationPipe global

En `http-api-gateway/src/main.ts`:

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

Implicaciones:

- **`whitelist`**: propiedades no declaradas en el DTO se eliminan del body.
- **`forbidNonWhitelisted`**: si llega una propiedad extra → **HTTP 400** automático. El cliente NO puede mandar campos "de más".
- **`transform`**: convierte tipos automáticamente (ej. `"123"` → `123` si el DTO dice `number`). Úsalo con `@Type(() => X)` en nested/arrays.

## Patrón DTO

Usamos `class-validator` + `class-transformer`. Ejemplo real (`CreateUserDto`):

```ts
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { UserRole, UserStatus } from 'src/typeorm/entities/User';

export class CreateUserDto {
  @IsUUID()
  @IsNotEmpty()
  institute_id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;

  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus;

  @IsEnum(UserRole)
  @IsNotEmpty()
  rol: UserRole;

  @IsString()
  @IsOptional()
  lastName: string;
}
```

Convenciones observadas:

- **Un decorador por línea**. Primero el tipo (`@IsString`, `@IsUUID`, `@IsEmail`, `@IsEnum`), luego `@IsNotEmpty` o `@IsOptional`.
- **Campos opcionales** usan `@IsOptional()`, no `?` en TS solamente.
- **Enums** se importan desde la entidad TypeORM (`src/typeorm/entities/User`).
- **IDs foráneos** van como `UUID` (`@IsUUID()`) y conservan `snake_case` si así se llaman en la columna (`institute_id`, `people_id`).

## DTOs en gateway vs. microservicio

**Los DTOs se duplican** (igual que las entidades):

- `http-api-gateway/src/modules/<dominio>/dtos/CreateXxx.dto.ts`
- `<micro>/src/<dominio>/dtos/CreateXxx.dto.ts`

El del gateway es el que valida el request HTTP. El del micro suele ser idéntico (o un subset) y existe para que el micro pueda tipar el `@Payload()`. **Cuando cambias uno, revisa si hay que cambiar el otro.**

## Update DTOs

Usa `@IsOptional()` en todos los campos; no uses `PartialType` todavía — el código actual los declara "a mano", mantén ese estilo para no mezclar patrones.

```ts
export class UpdateIncidentDTO {
  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(IncidentStatus)
  @IsOptional()
  status?: IncidentStatus;
}
```
