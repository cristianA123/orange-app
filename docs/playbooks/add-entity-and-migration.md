# Playbook: agregar una entidad y su migración

**Caso:** necesitas una tabla nueva `incident_comments` con FK a `incidents` y a `users`.

Hay 3 partes:

1. Crear el archivo de la entidad en el **gateway** (fuente de verdad).
2. Copiarla a cada **microservicio** que la vaya a usar.
3. **Generar + correr** la migración desde el gateway.

---

## 1. Crear la entidad en el gateway

`http-api-gateway/src/typeorm/entities/IncidentComment.ts`:

```ts
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Incident } from './Incident';
import { User } from './User';

@Entity('incident_comments')
export class IncidentComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Incident)
  @JoinColumn({ name: 'incident_id' })
  incident: Incident;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 500 })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
```

Convenciones: ver [`conventions/entities.md`](../conventions/entities.md).

## 2. Registrar la entidad en los archivos del gateway

### `src/data-source.ts`

```ts
import { IncidentComment } from './typeorm/entities/IncidentComment';

export const keyDatabase: DataSourceOptions = {
  ...databaseConfig,
  host: process.env.DB_HOST,
  entities: [
    User,
    // ... las demás,
    IncidentComment,          // ← agregar
  ],
  migrations: [__dirname + '/migrations/*.ts'],
  synchronize: false,
};
```

El gateway **no** instancia TypeOrmModule (no tiene DB directa), así que no hay que tocar `app.module.ts` del gateway. La entidad está en `data-source.ts` solo para que la CLI de migraciones la vea.

## 3. Copiarla al/los microservicio(s) que la van a usar

Ej. `incident-microservice` la va a usar:

### `incident-microservice/src/typeorm/entities/IncidentComment.ts`

Copia **el mismo archivo** (misma entidad). Si en el micro no se necesita la relación completa con `User`, puedes simplificar los `ManyToOne`, pero el nombre de tabla y columnas DEBE coincidir.

### `incident-microservice/src/data-source.ts`

Agregar `IncidentComment` al array `entities`.

### `incident-microservice/src/app.module.ts`

Agregar `IncidentComment` al array `entities` dentro de `TypeOrmModule.forRoot({ entities: [...] })`.

### Para usarla en un service

En el módulo del dominio (ej. `incident.module.ts`) agregar:

```ts
TypeOrmModule.forFeature([Incident, IncidentComment])
```

Y en el service:

```ts
constructor(
  @InjectRepository(IncidentComment)
  private commentRepository: Repository<IncidentComment>,
) {}
```

## 4. Generar la migración (desde el gateway)

```bash
cd http-api-gateway
npm run migration:generate ./src/migrations/AddIncidentComments
```

TypeORM compara entidades vs. DB real y genera `src/migrations/<timestamp>-AddIncidentComments.ts` con los `CREATE TABLE` y `ALTER TABLE`.

**Revísala manualmente antes de correrla.** Ejemplo de lo que debería generar (tomado de `1763839426901-add-table-contact.ts`):

```ts
await queryRunner.query(`CREATE TABLE \`incident_comments\` (
  \`id\` varchar(36) NOT NULL,
  \`message\` varchar(500) NOT NULL,
  \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  \`deletedAt\` datetime(6) NULL,
  \`incident_id\` varchar(36) NULL,
  \`user_id\` varchar(36) NULL,
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB`);
await queryRunner.query(`ALTER TABLE \`incident_comments\`
  ADD CONSTRAINT \`FK_xxx\` FOREIGN KEY (\`incident_id\`) REFERENCES \`incidents\`(\`id\`) ...`);
```

## 5. Correrla

Ver [`run-migrations.md`](./run-migrations.md) para detalles (conexión a MySQL, errores comunes).

```bash
cd http-api-gateway
npm run migration:run
```

## Gotchas

- **Si te olvidas de agregar la entidad al `data-source.ts` del gateway**, la migración se genera **vacía** o con un diff incompleto.
- **Si otros micros tienen entidades que referencian la nueva** (por FK o relación), copiá la nueva ahí también — si no, al levantarse el micro se rompe por entidad faltante o relación inconsistente.
- **Nombres de columnas:** TypeORM por defecto respeta `name: 'xxx_id'` en `@JoinColumn`. Si no pones `@JoinColumn`, infiere el nombre y la migración puede generar algo distinto a lo esperado — siempre explicita.
- **Cambios en columnas existentes:** TypeORM a veces genera `DROP COLUMN` + `ADD COLUMN` en vez de `ALTER COLUMN` (destruye datos). Revisa la migración antes de correrla en QA/prod.
- **Nunca edites una migración ya corrida en QA/prod.** Crea una nueva.
