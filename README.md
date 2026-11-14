# Orange Microservices

Backend de microservicios NestJS con NATS + MySQL. Documentación completa en [`docs/`](./docs/README.md) y [`CLAUDE.md`](./CLAUDE.md).

## Quickstart (un solo comando)

**Requisito**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo.

### macOS / Linux

```bash
./scripts/setup.sh
```

### Windows

Doble clic en **`scripts\setup.bat`**, o desde cmd/PowerShell:

```powershell
.\scripts\setup.bat
```

---

Cualquiera de los dos scripts hace lo mismo:

1. Copia los `.env.dev` → `.env`.
2. Levanta todos los containers (`docker compose up -d --build`).
3. Corre migraciones (crea schema).
4. Corre seed de dev (3 institutos, 7 usuarios, módulos).

Al terminar imprime las credenciales y la URL.

## Credenciales de dev

Password único: **`password123`**

| Email                            | Rol        | Instituto     |
| -------------------------------- | ---------- | ------------- |
| `superadmin@orange.dev`          | SUPERADMIN | Lima Centro   |
| `admin.lima@orange.dev`          | USER       | Lima Centro   |
| `operador.lima@orange.dev`       | EMPLOYEE   | Lima Centro   |
| `seguridad.lima@orange.dev`      | EMPLOYEE   | Lima Centro   |
| `inactivo.lima@orange.dev`       | USER       | Lima Centro (status INACTIVE) |
| `admin.miraflores@orange.dev`    | USER       | Miraflores    |
| `operador.miraflores@orange.dev` | EMPLOYEE   | Miraflores    |

## URL

- **Base**: `http://localhost:3000/api`
- **Login**: `POST /api/auth/login` con `{ email, password }`

## Colección Bruno

Incluida en `bruno/` — 62+ requests autocompletados. Ver [`docs/reference/api-doc.md`](./docs/reference/api-doc.md).

## Scripts útiles

| Comando                           | Qué hace                                             |
| --------------------------------- | ---------------------------------------------------- |
| `./scripts/setup.sh` (mac/linux)  | Setup inicial completo (envs + up + migrate + seed). |
| `scripts\setup.bat` (windows)     | Equivalente del setup para Windows.                  |
| `./scripts/share-tunnel.sh`       | Expone el gateway por HTTPS vía ngrok.              |
| `docker compose up -d`            | Levantar sin rebuild.                                |
| `docker compose down`             | Apagar.                                              |
| `docker compose down -v`          | Apagar **y borrar datos**.                           |
| `docker compose logs -f`          | Ver logs en vivo.                                    |

## Documentación

- **Guía rápida**: [`CLAUDE.md`](./CLAUDE.md).
- **Arquitectura, convenciones, playbooks**: [`docs/`](./docs/README.md).
- **Compartir API con otro dev vía túnel**: [`docs/playbooks/share-via-tunnel.md`](./docs/playbooks/share-via-tunnel.md).
