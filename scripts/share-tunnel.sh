#!/usr/bin/env bash
# share-tunnel.sh — abre un túnel público con ngrok hacia el gateway (localhost:3000)
# y imprime la URL + bloque listo para pegar en Bruno.
#
# Uso:
#   scripts/share-tunnel.sh               # URL dinámica (cambia cada vez)
#   scripts/share-tunnel.sh <domain>      # URL fija (ngrok Static Domain ya registrado)
#
# Ver docs/playbooks/share-via-tunnel.md para detalles.

set -euo pipefail

PORT="${PORT:-3000}"
DOMAIN="${1:-}"

# Chequeos previos
command -v ngrok >/dev/null 2>&1 || {
  echo "✗ ngrok no instalado. brew install ngrok" >&2
  exit 1
}

if ! curl -sf "http://localhost:${PORT}/api/user" -o /dev/null -w "%{http_code}" | grep -qE "^(2|4)"; then
  echo "⚠️  http://localhost:${PORT} no responde. ¿Está corriendo 'docker compose up'?"
  exit 1
fi

# Matar túneles previos
pkill -f "ngrok http" 2>/dev/null || true
sleep 1

# Lanzar
if [[ -n "$DOMAIN" ]]; then
  echo "→ Arrancando túnel con dominio fijo: $DOMAIN"
  ngrok http --domain="$DOMAIN" "$PORT" --log=stdout > /tmp/ngrok-share.log 2>&1 &
else
  echo "→ Arrancando túnel con URL temporal"
  ngrok http "$PORT" --log=stdout > /tmp/ngrok-share.log 2>&1 &
fi

TUNNEL_PID=$!

# Esperar a que publique la URL
echo "→ Esperando a ngrok..."
for _ in {1..30}; do
  if curl -s http://localhost:4040/api/tunnels 2>/dev/null | grep -q "public_url"; then
    break
  fi
  sleep 1
done

URL=$(curl -s http://localhost:4040/api/tunnels | python3 -c "
import sys, json
tunnels = json.load(sys.stdin).get('tunnels', [])
https = [t for t in tunnels if t.get('proto') == 'https']
print((https or tunnels)[0]['public_url'])
" 2>/dev/null || true)

if [[ -z "$URL" ]]; then
  echo "✗ ngrok no publicó URL. Revisa /tmp/ngrok-share.log"
  kill "$TUNNEL_PID" 2>/dev/null || true
  exit 1
fi

BASE_URL="${URL}/api"

cat <<EOF

================================================================
 ✓ Túnel listo
================================================================

  URL pública:  $URL
  baseUrl:      $BASE_URL
  PID:          $TUNNEL_PID
  Dashboard:    http://localhost:4040    (requests en vivo)

----------------------------------------------------------------
 Bruno — crea un environment "Shared" con esto:
----------------------------------------------------------------

vars {
  baseUrl: $BASE_URL
  token:
  refreshToken:
  instituteId: 11111111-1111-1111-1111-111111110001
  userId: 22222222-2222-2222-2222-222222220001
}

----------------------------------------------------------------
 Credenciales de dev (todas con password: password123):
----------------------------------------------------------------

  superadmin@orange.dev          SUPERADMIN  (recomendado)
  admin.lima@orange.dev          USER
  operador.lima@orange.dev       EMPLOYEE
  admin.miraflores@orange.dev    USER        (otro tenant)

================================================================
 Para apagar:  kill $TUNNEL_PID
================================================================
EOF

# Copiar la URL al portapapeles en macOS
if command -v pbcopy >/dev/null 2>&1; then
  printf "%s" "$BASE_URL" | pbcopy
  echo " 📋 baseUrl copiado al portapapeles"
fi
