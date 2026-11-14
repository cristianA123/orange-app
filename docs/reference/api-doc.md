# Referencia: API doc (Bruno)

La colección de API vive en `bruno/` dentro del repo. Cada endpoint del gateway tiene un archivo `.bru` versionado en git — los diffs en PR muestran claramente qué request cambió.

## Instalar Bruno

- macOS: `brew install --cask bruno` o [usebruno.com/downloads](https://www.usebruno.com/downloads).
- Linux: `.deb`/`.rpm`/`.AppImage` desde el mismo sitio.
- Windows: instalador desde el mismo sitio.
- Alternativa CLI: `npm i -g @usebruno/cli` (útil para CI).

## Abrir la colección

1. Bruno → **Open Collection** → selecciona `bruno/`.
2. En el selector de environment (arriba a la derecha), elige **Local** (default).

## Flujo normal

1. Ejecuta **Auth → Login** con tu email/password.
   - El script `post-response` guarda `token`, `refreshToken`, `instituteId`, `userId` en el environment.
   - Todos los demás requests leen `{{token}}` del header `Authorization: Bearer`.
2. Ejecuta cualquier otro endpoint. Si el token expira, corre **Auth → Refresh** (usa `{{refreshToken}}` y rota ambos).

## Estructura

```
bruno/
├── bruno.json                 # config de la colección
├── collection.bru             # ⭐ auth heredada + script pre-request
├── environments/
│   ├── Local.bru              # baseUrl + IDs fijos del seed
│   └── QA.bru                 # baseUrl de QA
├── Auth/
├── Users/
├── Incident/
├── Institute/
├── Modules/
├── People-management/
├── Dashboard/
└── Camera/
```

Las carpetas coinciden con los módulos del gateway (`http-api-gateway/src/modules/`).

## Auth — convención oficial

**Único patrón válido** para requests autenticados: bearer explícito en cada `.bru` con la variable `{{token}}`.

```
<method> {
  url: ...
  auth: bearer
}

auth:bearer {
  token: {{token}}
}
```

El `{{token}}` lo guarda automáticamente el `script:post-response` de `Auth/Login` (y lo rota `Auth/Refresh`). No tienes que copiarlo a mano.

**Endpoints públicos** (login, refresh, PDF, create user) usan `auth: none`.

### Por qué no `auth: inherit`

Probamos herencia desde `collection.bru`. Según versión de Bruno no se aplica al request y el server responde `401 "Token not found"`. El patrón explícito funciona siempre y es trivial de buscar en PRs (`grep "auth:bearer"`).

### Checklist al crear un `.bru`

- [ ] ¿Es público en el gateway (`@Public()`)? → `auth: none`, sin bloque `auth:bearer`.
- [ ] ¿Es autenticado? → `auth: bearer` + bloque `auth:bearer { token: {{token}} }`.
- [ ] **Nunca** uses `auth: inherit` ni declares header `Authorization` a mano.

## Variables de environment

| Var             | Guardada por              | Uso                                                |
| --------------- | ------------------------- | -------------------------------------------------- |
| `baseUrl`       | manual en `Local.bru`     | Base de todos los requests.                        |
| `token`         | **auto** por Login/Refresh | Header `Authorization: Bearer {{token}}`.          |
| `refreshToken`  | **auto** por Login/Refresh | Body de `Auth → Refresh`.                          |
| `instituteId`   | **auto** por Login        | Útil para probar endpoints con `:id` de instituto. |
| `userId`        | **auto** por Login        | Útil para probar endpoints con `:id` de user.      |

`token` y `refreshToken` están marcados como `vars:secret` → no se guardan en el environment file.

## Agregar un endpoint nuevo

Cuando agregas un endpoint al gateway (ver [`playbooks/add-endpoint.md`](../playbooks/add-endpoint.md)), agrega el `.bru` correspondiente a `bruno/<Dominio>/`:

```
meta {
  name: Nombre legible
  type: http
  seq: <número incremental dentro de la carpeta>
}

post {
  url: {{baseUrl}}/path/to/endpoint
  body: json
  auth: bearer
}

auth:bearer {
  token: {{token}}
}

body:json {
  {
    "campo": "valor"
  }
}

docs {
  Qué hace el endpoint, qué retorna, qué errores puede dar.
}
```

Para un endpoint público (sin token), omite el bloque `auth:bearer`:

```
post {
  url: {{baseUrl}}/path/publico
  body: json
  auth: none
}
```

Commitealo con el mismo PR del endpoint.

## Correr en CI

Bruno CLI (`@usebruno/cli`) permite correr la colección contra un entorno:

```bash
bru run bruno --env Local --output results.json
```

Útil para smoke tests post-deploy. Aún no está integrado — es trabajo futuro si lo quieren.

## Convenciones

- **Un dominio = una carpeta.** No mezclar.
- **Nombres de requests en inglés** (`Create`, `Update`, `List by Institute`). Mantiene corto.
- **Path params** van en `params:path` para que Bruno los renderice como variables.
- **Query params** en `params:query` con los valores por defecto vacíos para que el caller elija.
- **Headers de auth**: usar `auth: bearer` + bloque `auth:bearer { token: {{token}} }` en cada request autenticado. Para públicos, `auth: none`. No usar headers manuales.
- **Response contract**: incluir ejemplos de `Response 200` y errores comunes en el bloque `docs` cuando el shape no sea obvio.

## Troubleshooting

- **"baseUrl is not defined"** → no seleccionaste environment. Arriba a la derecha, elige **Local**.
- **401 en todo** → no ejecutaste Login, o `token` expiró. Corre Login o Refresh.
- **Request cae con timeout** → el microservicio que atiende el `cmd` no está arriba. Ver [`ops/troubleshooting.md`](../ops/troubleshooting.md).
