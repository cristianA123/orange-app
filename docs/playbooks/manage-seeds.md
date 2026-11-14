# Playbook: gestionar seeds de desarrollo

Los datos de desarrollo (institutos, usuarios, módulos y sus asignaciones) viven en `http-api-gateway/src/seeds/`, **no en migraciones**. Esto permite:

- UUIDs **fijos** y deterministas (los environments de Bruno los referencian como `{{superAdminId}}`, `{{limaCentroId}}`, etc.).
- Datos **idempotentes** (`ON DUPLICATE KEY UPDATE` + reset de asignaciones).
- Separar schema (migraciones) de data (seeds).

---

## Primera vez (o cuando reseteas la DB)

```bash
# Dentro del container
docker compose exec api_gateway npm run seed:dev
```

Output esperado:

```
→ Conectando a DB...
→ Seeding institutes
  institutes: 3 upserted
→ Seeding users
  users: 7 upserted (password: "password123")
→ Seeding modules + assignments
  modules: 8 upserted, 2 institute assignments, 6 user assignments
✓ Seed completado
```

El script es seguro: puedes correrlo múltiples veces sin romper nada. Actualiza institutos/usuarios/módulos y reemplaza completamente las asignaciones.

## Estructura

```
http-api-gateway/src/seeds/
├── seed-dev.ts            # entry point (lo que corre npm run seed:dev)
├── constants.ts           # UUIDs fijos + DEV_PASSWORD
├── institutes.seed.ts     # 3 institutos (Lima Centro, Miraflores, San Isidro)
├── users.seed.ts          # 7 usuarios cubriendo roles y status
└── modules.seed.ts        # 8 módulos jerárquicos + asignaciones
```

## Dataset por defecto

### Institutos

| ID (slug)      | Nombre                         | Status   | Notas                        |
| -------------- | ------------------------------ | -------- | ---------------------------- |
| `limaCentro`   | Municipalidad de Lima Centro   | ACTIVE   | tenant principal             |
| `miraflores`   | Municipalidad de Miraflores    | ACTIVE   | para probar multi-tenancy    |
| `sanIsidro`    | Municipalidad de San Isidro    | PENDING  | para probar flujo activación |

### Usuarios (password único: `password123`)

| Email                            | Rol          | Instituto       | Status    | Módulos asignados       |
| -------------------------------- | ------------ | --------------- | --------- | ----------------------- |
| `superadmin@orange.dev`          | SUPERADMIN   | Lima Centro     | ACTIVE    | todos                   |
| `admin.lima@orange.dev`          | USER         | Lima Centro     | ACTIVE    | todos                   |
| `operador.lima@orange.dev`       | EMPLOYEE     | Lima Centro     | ACTIVE    | security + hijos clave  |
| `seguridad.lima@orange.dev`      | EMPLOYEE     | Lima Centro     | ACTIVE    | security + incidents    |
| `inactivo.lima@orange.dev`       | USER         | Lima Centro     | INACTIVE  | ninguno                 |
| `admin.miraflores@orange.dev`    | USER         | Miraflores      | ACTIVE    | todos los de su tenant  |
| `operador.miraflores@orange.dev` | EMPLOYEE     | Miraflores      | ACTIVE    | security + incidents    |

### Módulos

- **Padres**: SERENAZGO - CCO, TRANSPORTE, FISCALIZACION, RIESGO.
- **Hijos de SERENAZGO**: REPORTES DE INCIDENCIAS, MAPA DE CALOR, BASE DE DATOS - CAPTURADOS, ESTADISTICAS GRAFICAS.

## UUIDs fijos — convención

El primer carácter del primer segmento identifica el tipo:

- `1xxxxxxx-...` → instituto
- `2xxxxxxx-...` → usuario
- `3xxxxxxx-...` → módulo

Los nombres simbólicos están en [`constants.ts`](../../http-api-gateway/src/seeds/constants.ts) y se usan en los `.bru` del environment Local.

## Resetear la DB desde cero

```bash
# 1. Baja containers + borra volúmenes (⚠️ esto borra TODA la data)
docker compose down -v

# 2. Vuelve a levantar
docker compose up -d

# 3. Corre migraciones
docker compose exec api_gateway npm run migration:run

# 4. Pobla con seeds
docker compose exec api_gateway npm run seed:dev
```

Después de esto la DB queda **exactamente igual** que en cualquier otro dev del equipo que haga el mismo flujo — mismos UUIDs, mismas asignaciones.

## Agregar/modificar datos del seed

### Agregar un instituto

1. Agregar el UUID a `src/seeds/constants.ts` → `DEV_INSTITUTE_IDS`.
2. Agregar la entrada en el array `INSTITUTES` de `institutes.seed.ts`.
3. (Opcional) asignarle módulos en `modules.seed.ts` → `INSTITUTE_MODULE_ASSIGNMENTS`.
4. Agregarlo al environment `bruno/environments/Local.bru`.
5. Re-correr `npm run seed:dev`.

### Agregar un usuario

Mismo patrón:
1. UUID en `constants.ts` → `DEV_USER_IDS`.
2. Entrada en `users.seed.ts` → `USERS`.
3. Asignarle módulos en `modules.seed.ts` → `USER_MODULE_ASSIGNMENTS`.
4. `Local.bru`.
5. Re-correr seed.

### Cambiar permisos de un rol/usuario

Solo editar `modules.seed.ts` → `USER_MODULE_ASSIGNMENTS` o `INSTITUTE_MODULE_ASSIGNMENTS`. El seed hace `DELETE + INSERT` de las asignaciones de cada entidad tocada, así que los cambios se reflejan sin manualidad.

## Nuevo tipo de seed (ej. seed-demo)

Si quieres un set más grande para demos o uno mínimo para CI:

1. Duplica `seed-dev.ts` como `seed-demo.ts` (o `seed-minimal.ts`).
2. Importa de las mismas `*.seed.ts` o crea variantes.
3. Registra en `package.json` → `"seed:demo": "ts-node ... ./src/seeds/seed-demo.ts"`.

## ¿Por qué no es una migración?

Antes el seed inicial vivía en `1751151835063-AddInitialInstituteAndUser` y `1751778547376-AddInitialModules`. Ambas fueron convertidas a no-op (ver comentarios en los archivos):

- **UUIDs no reproducibles**: usaban `uuidv4()` en runtime → cada entorno tenía IDs distintos → Bruno/tests tenían que capturar IDs manualmente.
- **No idempotentes**: solo corrían una vez. Para cambiar datos había que escribir otra migración, no actualizar el dataset.
- **Mezclaba schema con data**: dificulta recrear data sin re-correr schema.

Los catálogos (nacionalidades, estados civiles, cargos, contract_types, areas) siguen viviendo en migraciones (`InsertData`, `InsertCargosData`, `SeedContractTypesAndAreas`) porque son **datos maestros del dominio**, no data de desarrollo.
