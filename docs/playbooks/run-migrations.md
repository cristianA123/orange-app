# Playbook: correr migraciones

**Fuente de verdad:** `http-api-gateway/src/migrations/`. Todos los cambios de schema se generan y se corren desde ahí.

(Nota histórica: `users-microservice/src/migrations/` tiene una migración vieja `1750888760906-InitSchema.ts` del arranque del proyecto. No se usa en flujo nuevo. **No generes migraciones fuera del gateway**.)

---

## Antes de correr

Revisa estas dos cosas en `http-api-gateway/src/data-source.ts`:

- `password: '#!123456!#'` está **hardcodeado** (sí, feo). Si tu MySQL local usa otra, cambialo temporalmente (y **no** lo commitees).
- La `host` lee de `DB_HOST`. En la línea comentada hay `// host: 'localhost'` — útil si corres el CLI fuera del container.

## Generar una migración

**Pre-requisito:** ya actualizaste la entidad y la tienes registrada en `data-source.ts`. Ver [`add-entity-and-migration.md`](./add-entity-and-migration.md).

```bash
cd http-api-gateway
npm run migration:generate ./src/migrations/NombreDescriptivo
```

Esto corre:

```bash
ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js \
  migration:generate -d ./src/data-source.ts ./src/migrations/NombreDescriptivo
```

TypeORM:

1. Lee las entidades del `data-source.ts`.
2. Se conecta a MySQL con las creds de `.env`.
3. Compara schema actual vs. entidades y genera el diff.
4. Crea `src/migrations/<timestamp>-NombreDescriptivo.ts`.

**Revísala manualmente** antes de correrla. Cosas a buscar:

- ¿Hay `DROP COLUMN` / `DROP TABLE` inesperado? (destruye datos)
- ¿Los `enum` tienen los valores correctos en MySQL?
- ¿Los FK referencian las tablas correctas?

## Correr migraciones pendientes

```bash
cd http-api-gateway
npm run migration:run
```

TypeORM corre en orden de timestamp todo lo que no esté en `migrations` (tabla meta de TypeORM).

## Correr contra un entorno específico

Edita `.env` (o pasa vars inline):

```bash
DB_HOST=my-qa-host.amazonaws.com \
DB_USERNAME=qa_user \
npm run migration:run
```

Recuerda que `password` está hardcodeada en `data-source.ts` — cámbiala en el archivo si el entorno usa otra (y revierte antes de commitear).

## Crear migración manual (sin diff)

Para seeds o cambios que TypeORM no detecta:

```bash
npm run migration:create ./src/migrations/SeedContractTypes
```

Genera un archivo vacío. Escribe los `queryRunner.query(...)` a mano.

## Deshacer

TypeORM tiene `migration:revert`. **No hay script para eso** en `package.json` — si lo necesitas, crealo o corre directo:

```bash
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js \
  migration:revert -d ./src/data-source.ts
```

Deshace la **última** migración corrida. Para revertir varias, corre varias veces.

## Errores comunes

- **"Error during migration run: connect ECONNREFUSED"** — MySQL no está arriba. Levanta con `docker compose up mysql_db` o apunta `DB_HOST` al host correcto.
- **"Access denied for user ..."** — password incorrecta. Revisa el hardcode en `data-source.ts` y `.env`.
- **Migración generada vacía** — olvidaste agregar la entidad nueva al array `entities` en `data-source.ts`.
- **"Table 'nestjs_db.xxx' already exists"** — alguien corrió la migración fuera de banda, o la migración de init se corrió dos veces. Verifica la tabla `migrations` en MySQL.
- **"Query runner already released"** — ts-node timeout. Reintenta.
