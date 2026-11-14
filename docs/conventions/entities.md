# Convención: entidades TypeORM

## Por qué están duplicadas

Cada microservicio tiene su propia carpeta `src/typeorm/entities/` con copias de las entidades que necesita. Esto es **intencional** (los micros no comparten código TS entre sí) pero **frágil**: cambiar una entidad puede requerir sincronizar varios directorios.

```
http-api-gateway/src/typeorm/entities/      ← tiene todas (para migraciones)
users-microservice/src/typeorm/entities/    ← User, Institute, InstituteModule, UserModule, Incident, IncidentFile, Module
incident-microservice/src/typeorm/entities/ ← las que toca incidentes
...
```

## Registro doble

Cada entidad se registra **dos veces** por microservicio:

1. **`src/data-source.ts`** — array `entities` que usa la CLI de TypeORM (migraciones) y runtime.
2. **`src/app.module.ts`** — `TypeOrmModule.forRoot({ entities: [...] })` para el runtime del micro.

Deben coincidir. Ver [`playbooks/add-entity-and-migration.md`](../playbooks/add-entity-and-migration.md).

## Patrón de entidad

Mira `http-api-gateway/src/typeorm/entities/Contract.ts` como referencia:

```ts
import {
  Column, CreateDateColumn, DeleteDateColumn, Entity,
  JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';
import { People } from './People';
// ...

@Entity('contracts')                        // snake_case plural
export class Contract {
  @PrimaryGeneratedColumn('uuid')           // ← UUID por defecto
  id: string;

  @ManyToOne(() => People, (people) => people.contracts)
  @JoinColumn({ name: 'people_id' })        // ← FK en snake_case
  people: People;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ nullable: true })
  workedTime: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()                        // ← auditoría estándar
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

Convenciones:

- **Nombre de tabla:** snake_case plural (`contracts`, `contract_files`, `incident_files`).
- **PK:** UUID (`@PrimaryGeneratedColumn('uuid')`), excepto tablas catálogo pequeñas (`contract_types`, `areas`) que usan `int AUTO_INCREMENT`.
- **FK:** `@JoinColumn({ name: 'xxx_id' })` en snake_case.
- **Auditoría:** siempre `@CreateDateColumn createdAt`, `@UpdateDateColumn updatedAt`, `@DeleteDateColumn deletedAt` (soft delete).
- **Enums:** declaradas junto a la entidad (ej. `UserRole`, `UserStatus` en `User.ts`), MySQL `enum` con valores en SCREAMING_SNAKE.

## `synchronize: false` siempre

El schema cambia por migraciones, nunca por autosync. No cambies esto.

## Al renombrar/mover una entidad

1. Renómbrala en todos los `typeorm/entities/` de los micros que la tengan.
2. Actualiza los `data-source.ts` y `app.module.ts` de esos micros.
3. Genera una migración desde el gateway (ver [`run-migrations.md`](../playbooks/run-migrations.md)).
4. Grep por el nombre viejo en el repo entero — probablemente hay DTOs o services que la importan.
