#!/usr/bin/env bash
# setup.sh — bootstrap completo del backend local.
#
# Uso:   ./scripts/setup.sh
#
# Deja todo listo para usar en 1 comando:
# - Copia .env.dev -> .env en los scopes correspondientes.
# - Levanta containers (docker compose up -d).
# - Espera MySQL + gateway.
# - Corre migraciones + seed.
# - Imprime credenciales y URL para empezar a pegarle a la API.
#
# Idempotente: puedes correrlo varias veces, no rompe nada.

set -euo pipefail

# ----- colores / helpers ------------------------------------------------------
if [[ -t 1 ]]; then
  G=$'\033[0;32m'; Y=$'\033[0;33m'; R=$'\033[0;31m'; B=$'\033[0;34m'; N=$'\033[0m'
else
  G=''; Y=''; R=''; B=''; N=''
fi

step()  { echo "${B}==>${N} $*"; }
ok()    { echo "${G}✓${N} $*"; }
warn()  { echo "${Y}⚠${N}  $*"; }
die()   { echo "${R}✗${N} $*" >&2; exit 1; }

# Siempre correr desde la raíz del repo
cd "$(dirname "$0")/.."

# ----- 1) pre-flight ----------------------------------------------------------
step "Verificando dependencias"

command -v docker >/dev/null 2>&1 || die "Docker no instalado. Instala Docker Desktop: https://www.docker.com/products/docker-desktop/"
docker compose version >/dev/null 2>&1 || die "Docker Compose v2 no disponible. Actualiza Docker Desktop."
docker info >/dev/null 2>&1 || die "Docker no está corriendo. Abre Docker Desktop."
ok "Docker + Compose listos"

# ----- 2) .env files ----------------------------------------------------------
step "Preparando archivos .env"

copy_env() {
  local src=$1 dst=$2
  if [[ -f "$dst" ]]; then
    ok "$dst ya existe (no se sobrescribe)"
  elif [[ -f "$src" ]]; then
    cp "$src" "$dst"
    ok "$dst creado desde $src"
  else
    warn "$src no existe, se omite $dst"
  fi
}

copy_env .env.dev .env
copy_env http-api-gateway/.env.dev http-api-gateway/.env
copy_env users-microservice/.env.dev users-microservice/.env
copy_env incident-microservice/.env.dev incident-microservice/.env
copy_env people-management-microservice/.env.dev people-management-microservice/.env

# ----- 3) levantar containers -------------------------------------------------
step "Levantando containers (docker compose up -d --build)"
docker compose up -d --build

# ----- 4) esperar a mysql -----------------------------------------------------
step "Esperando MySQL"
tries=0
until docker compose exec -T mysql_db mysqladmin ping -utestuser -ptestuser123 --silent 2>/dev/null; do
  tries=$((tries + 1))
  if (( tries > 60 )); then
    die "MySQL no respondió en 60s. Revisa 'docker compose logs mysql_db'."
  fi
  sleep 1
done
ok "MySQL listo"

# ----- 5) esperar al gateway --------------------------------------------------
step "Esperando al gateway (puerto 3000)"
tries=0
until curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/user 2>/dev/null | grep -qE "^(2|4)"; do
  tries=$((tries + 1))
  if (( tries > 60 )); then
    die "Gateway no respondió en 60s. Revisa 'docker compose logs api_gateway'."
  fi
  sleep 1
done
ok "Gateway respondiendo"

# ----- 6) migraciones ---------------------------------------------------------
step "Corriendo migraciones"
if docker compose exec -T api_gateway npm run migration:run 2>&1 | tail -3 | grep -qE "No migrations are pending|Migration .* has been executed"; then
  ok "Migraciones aplicadas"
else
  # Reintentar porque algunos logs normales matchean distinto
  docker compose exec -T api_gateway npm run migration:run 2>&1 | tail -5
  warn "Revisa el output de migraciones arriba"
fi

# ----- 7) seed ----------------------------------------------------------------
step "Corriendo seed de dev"
# El script seed:dev puede no estar aún en el package.json del container
# (si no se rebuildeó después del cambio). Fallback a ts-node directo.
if ! docker compose exec -T api_gateway npm run seed:dev 2>/dev/null; then
  docker compose exec -T api_gateway sh -c "./node_modules/.bin/ts-node -r tsconfig-paths/register ./src/seeds/seed-dev.ts"
fi
ok "Seed aplicado"

# ----- 8) resumen -------------------------------------------------------------
cat <<EOF

${G}================================================================${N}
 ✓ Backend listo
${G}================================================================${N}

  ${B}Base URL:${N}   http://localhost:3000/api

  ${B}Login (todos con password: ${G}password123${N}${B}):${N}
    ${G}superadmin@orange.dev${N}         SUPERADMIN  (recomendado)
    admin.lima@orange.dev          USER
    operador.lima@orange.dev       EMPLOYEE
    seguridad.lima@orange.dev      EMPLOYEE
    admin.miraflores@orange.dev    USER        (otro tenant)
    operador.miraflores@orange.dev EMPLOYEE    (otro tenant)

  ${B}Siguientes pasos:${N}

    Probar login:
      ${Y}curl -X POST http://localhost:3000/api/auth/login \\
           -H 'Content-Type: application/json' \\
           -d '{"email":"superadmin@orange.dev","password":"password123"}'${N}

    Ver logs en vivo:
      ${Y}docker compose logs -f${N}

    Apagar todo:
      ${Y}docker compose down${N}

${G}================================================================${N}
EOF
