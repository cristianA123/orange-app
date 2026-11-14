# setup.ps1 — bootstrap completo del backend local (Windows).
#
# Uso:
#   .\scripts\setup.ps1
#   o doble clic en scripts\setup.bat (recomendado, evita restricciones de policy)
#
# Hace exactamente lo mismo que scripts/setup.sh en macOS/Linux:
#   - Copia .env.dev -> .env en los scopes correspondientes.
#   - Levanta containers (docker compose up -d).
#   - Espera MySQL + gateway.
#   - Corre migraciones + seed.
#   - Imprime credenciales y URL para empezar.
#
# Idempotente: puedes correrlo varias veces, no rompe nada.

$ErrorActionPreference = 'Stop'

# ----- helpers ----------------------------------------------------------------
function Write-Step($msg)  { Write-Host "==> $msg" -ForegroundColor Blue }
function Write-Ok($msg)    { Write-Host "✓ $msg"   -ForegroundColor Green }
function Write-Warn($msg)  { Write-Host "⚠ $msg"   -ForegroundColor Yellow }
function Write-Die($msg)   { Write-Host "✗ $msg"   -ForegroundColor Red; exit 1 }

# Siempre correr desde la raíz del repo
Set-Location (Split-Path -Parent $PSScriptRoot)

# ----- 1) pre-flight ----------------------------------------------------------
Write-Step 'Verificando dependencias'

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  Write-Die 'Docker no instalado. Instala Docker Desktop: https://www.docker.com/products/docker-desktop/'
}

try { docker compose version > $null 2>&1 } catch {}
if ($LASTEXITCODE -ne 0) {
  Write-Die 'Docker Compose v2 no disponible. Actualiza Docker Desktop.'
}

try { docker info > $null 2>&1 } catch {}
if ($LASTEXITCODE -ne 0) {
  Write-Die 'Docker no está corriendo. Abre Docker Desktop y espera que arranque.'
}

Write-Ok 'Docker + Compose listos'

# ----- 2) .env files ----------------------------------------------------------
Write-Step 'Preparando archivos .env'

function Copy-Env($src, $dst) {
  if (Test-Path $dst) {
    Write-Ok "$dst ya existe (no se sobrescribe)"
  }
  elseif (Test-Path $src) {
    Copy-Item $src $dst
    Write-Ok "$dst creado desde $src"
  }
  else {
    Write-Warn "$src no existe, se omite $dst"
  }
}

Copy-Env '.env.dev' '.env'
Copy-Env 'http-api-gateway\.env.dev' 'http-api-gateway\.env'
Copy-Env 'users-microservice\.env.dev' 'users-microservice\.env'
Copy-Env 'incident-microservice\.env.dev' 'incident-microservice\.env'
Copy-Env 'people-management-microservice\.env.dev' 'people-management-microservice\.env'

# ----- 3) levantar containers -------------------------------------------------
Write-Step 'Levantando containers (docker compose up -d --build)'
docker compose up -d --build
if ($LASTEXITCODE -ne 0) { Write-Die 'docker compose up falló' }

# ----- 4) esperar a mysql -----------------------------------------------------
Write-Step 'Esperando MySQL'
$tries = 0
while ($true) {
  $ok = $false
  try {
    docker compose exec -T mysql_db mysqladmin ping -utestuser -ptestuser123 --silent 2>$null | Out-Null
    if ($LASTEXITCODE -eq 0) { $ok = $true }
  } catch {}
  if ($ok) { break }
  $tries++
  if ($tries -gt 60) { Write-Die "MySQL no respondió en 60s. Revisa 'docker compose logs mysql_db'." }
  Start-Sleep -Seconds 1
}
Write-Ok 'MySQL listo'

# ----- 5) esperar al gateway --------------------------------------------------
Write-Step 'Esperando al gateway (puerto 3000)'
$tries = 0
while ($true) {
  try {
    $resp = Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:3000/api/user' -TimeoutSec 3 -ErrorAction Stop
    if ($resp.StatusCode -ge 200 -and $resp.StatusCode -lt 500) { break }
  } catch {
    # 4xx son OK para nuestro check (significa que el gateway responde)
    if ($_.Exception.Response -and [int]$_.Exception.Response.StatusCode -ge 400 -and [int]$_.Exception.Response.StatusCode -lt 500) {
      break
    }
  }
  $tries++
  if ($tries -gt 60) { Write-Die "Gateway no respondió en 60s. Revisa 'docker compose logs api_gateway'." }
  Start-Sleep -Seconds 1
}
Write-Ok 'Gateway respondiendo'

# ----- 6) migraciones ---------------------------------------------------------
Write-Step 'Corriendo migraciones'
docker compose exec -T api_gateway npm run migration:run
if ($LASTEXITCODE -ne 0) { Write-Warn 'Migraciones: revisa el output arriba' }
else { Write-Ok 'Migraciones aplicadas' }

# ----- 7) seed ----------------------------------------------------------------
Write-Step 'Corriendo seed de dev'
docker compose exec -T api_gateway npm run seed:dev 2>$null
if ($LASTEXITCODE -ne 0) {
  # Fallback: si npm run seed:dev no existe (imagen vieja), llamar ts-node directo
  docker compose exec -T api_gateway sh -c "./node_modules/.bin/ts-node -r tsconfig-paths/register ./src/seeds/seed-dev.ts"
}
if ($LASTEXITCODE -ne 0) { Write-Die 'Seed falló' }
Write-Ok 'Seed aplicado'

# ----- 8) resumen -------------------------------------------------------------
Write-Host ''
Write-Host '================================================================' -ForegroundColor Green
Write-Host ' ✓ Backend listo' -ForegroundColor Green
Write-Host '================================================================' -ForegroundColor Green
Write-Host ''
Write-Host '  Base URL:   ' -NoNewline; Write-Host 'http://localhost:3000/api' -ForegroundColor Blue
Write-Host ''
Write-Host '  Login (todos con password: ' -NoNewline
Write-Host 'password123' -NoNewline -ForegroundColor Green
Write-Host '):'
Write-Host '    superadmin@orange.dev         ' -NoNewline
Write-Host 'SUPERADMIN  (recomendado)' -ForegroundColor Green
Write-Host '    admin.lima@orange.dev          USER'
Write-Host '    operador.lima@orange.dev       EMPLOYEE'
Write-Host '    seguridad.lima@orange.dev      EMPLOYEE'
Write-Host '    admin.miraflores@orange.dev    USER        (otro tenant)'
Write-Host '    operador.miraflores@orange.dev EMPLOYEE    (otro tenant)'
Write-Host ''
Write-Host '  Siguientes pasos:'
Write-Host ''
Write-Host '    Probar login:'
Write-Host '      curl.exe -X POST http://localhost:3000/api/auth/login ``' -ForegroundColor Yellow
Write-Host '           -H "Content-Type: application/json" ``' -ForegroundColor Yellow
Write-Host '           -d ''{\"email\":\"superadmin@orange.dev\",\"password\":\"password123\"}''' -ForegroundColor Yellow
Write-Host ''
Write-Host '    Ver logs en vivo:'
Write-Host '      docker compose logs -f' -ForegroundColor Yellow
Write-Host ''
Write-Host '    Apagar todo:'
Write-Host '      docker compose down' -ForegroundColor Yellow
Write-Host ''
Write-Host '================================================================' -ForegroundColor Green
