# Playbook: compartir el gateway local vía túnel

**Caso:** tu amigo/colega quiere pegarle a tu API desde su computadora, pero el gateway solo está corriendo en tu `localhost:3000`. Un túnel reverse-proxy expone tu puerto como una URL HTTPS pública temporal.

Usamos **ngrok** (ya instalado en este repo como herramienta estándar). Otras alternativas: cloudflared, localtunnel.

---

## Setup inicial (una sola vez)

### 1. Verifica que tienes ngrok actualizado

```bash
ngrok version   # debe ser >= 3.29
# Si está desactualizado:
brew upgrade ngrok
```

### 2. Authtoken (lo haces una sola vez por máquina)

```bash
ngrok config check
# Si dice "configuration file not found" o similar:
ngrok config add-authtoken <tu-token-de-ngrok.com>
```

El authtoken lo obtienes en [dashboard.ngrok.com](https://dashboard.ngrok.com) → **Your Authtoken**.

### 3. (Opcional pero recomendado) Static Domain gratuito

ngrok free tier te deja **1 dominio fijo**. Si lo configuras:
- La URL **no cambia nunca** entre reinicios.
- No tienes que avisarle a tu amigo cada vez.

Setup:
1. [dashboard.ngrok.com](https://dashboard.ngrok.com) → **Domains** → **Create Domain**.
2. Te genera algo tipo `cristian-orange.ngrok-free.app`.
3. Guarda ese dominio — lo usarás al arrancar el túnel.

Sin Static Domain, la URL es dinámica (`abc-123.ngrok-free.app`) y cambia cada vez que corres el comando.

---

## Flujo normal: arrancar el túnel

### Con el script helper (recomendado)

```bash
# URL dinámica (más simple, cambia cada vez)
scripts/share-tunnel.sh

# URL fija (si registraste Static Domain)
scripts/share-tunnel.sh cristian-orange.ngrok-free.app
```

El script:
- Mata túneles ngrok previos.
- Verifica que `localhost:3000` esté vivo.
- Arranca ngrok en background.
- Imprime URL + bloque listo para pegar en Bruno + credenciales de dev.
- Copia el `baseUrl` al portapapeles (macOS).

### A mano (si no quieres el script)

```bash
# Con URL dinámica
ngrok http 3000

# Con Static Domain
ngrok http --domain=cristian-orange.ngrok-free.app 3000
```

ngrok muestra la URL en la primera línea (`Forwarding ... -> http://localhost:3000`). Dashboard de requests en vivo: [http://localhost:4040](http://localhost:4040).

---

## Para un amigo con frontend (Browser → CORS)

**En dev (`NODE_ENV=development` en tu `.env`), CORS acepta cualquier origen.** No tienes que configurar nada.

Esto significa que tu amigo puede trabajar desde donde quiera **sin que tú toques configuración**:

| Dónde vive el frontend del amigo        | ¿Funciona en dev? |
| --------------------------------------- | :---------------: |
| Su `localhost:5173` (Vite)              | ✅                |
| Su `localhost:3001` (otro puerto)       | ✅                |
| Su IP de red local                      | ✅                |
| `*.vercel.app`                          | ✅                |
| `*.netlify.app`                         | ✅                |
| `*.github.io`                           | ✅                |
| Su propio túnel ngrok/cloudflared       | ✅                |
| Cualquier otro dominio                  | ✅                |

Detalle técnico en [`conventions/auth.md`](../conventions/auth.md) — en dev, el gateway refleja el `Origin` del request de vuelta como `Access-Control-Allow-Origin`, lo cual es compatible con `credentials: true`.

**En prod/QA** la política es estricta: solo lo que esté en `CORS_ORIGINS` + los túneles conocidos. Si el amigo va a probar contra QA, agrega su dominio a `CORS_ORIGINS` del entorno correspondiente.

## Qué le pasas a tu amigo

### 1. Acceso a la colección Bruno

Dale acceso al repo (preferido) o manda la carpeta `bruno/` como zip.

### 2. Un environment propio en su Bruno

Que cree un archivo nuevo `bruno/environments/Shared.bru` con:

```
vars {
  baseUrl: https://<lo-que-te-dio-ngrok>/api
  token:
  refreshToken:
  instituteId: 11111111-1111-1111-1111-111111110001
  userId: 22222222-2222-2222-2222-222222220001
}
```

El `baseUrl` es lo único específico que cambia. **No committees el `Shared.bru` con URL temporal** — déjalo en `.gitignore` o súbelo solo si tienes Static Domain.

### 3. Credenciales

Usuarios del seed (todos con password `password123`):

| Email                           | Rol        | Instituto     |
| ------------------------------- | ---------- | ------------- |
| `superadmin@orange.dev`         | SUPERADMIN | Lima Centro   |
| `admin.lima@orange.dev`         | USER       | Lima Centro   |
| `operador.lima@orange.dev`      | EMPLOYEE   | Lima Centro   |
| `admin.miraflores@orange.dev`   | USER       | Miraflores    |

Tu amigo abre Bruno, elige environment **Shared**, corre **Auth/Login** → el `script:post-response` guarda su token, resto de requests funcionan igual que en Local.

---

## Cuando la URL expire o se cae

### Con Static Domain
No expira. Si el túnel se cae (reinicio de la máquina, cerraste la terminal), basta con rearrancarlo:

```bash
scripts/share-tunnel.sh cristian-orange.ngrok-free.app
```

**La URL es la misma**. Tu amigo no cambia nada.

### Con URL dinámica

1. Rearranca:
   ```bash
   scripts/share-tunnel.sh
   ```
2. Copia la nueva `baseUrl` (ya está en el portapapeles).
3. Avísale a tu amigo. Él edita su `Shared.bru` → `baseUrl: https://NUEVO.ngrok-free.app/api`.

Para automatizar el aviso, dos ideas:

- **Gist público** con la URL actual. Script que hace `gh gist edit <id> <<< $BASE_URL`.
- **Canal de Slack/Discord**: webhook que postea la URL.

Si cambias el túnel muchas veces por día, invierte 2 minutos en Static Domain. Vale la pena.

---

## Apagar el túnel

```bash
# Si lo lanzaste con el script
kill $(pgrep -f "ngrok http")

# O desde la terminal donde corriste ngrok a mano: Ctrl+C
```

El dashboard en `localhost:4040` se cierra automáticamente.

---

## ⚠️ Seguridad

Mientras el túnel esté abierto, **cualquiera con esa URL puede llegar a tu API**. Consideraciones:

1. **`POST /api/user` es Public** (registro) — alguien podría crear usuarios con la URL. Avisa a tu amigo antes.
2. **`GET /api/incident/:id/pdf` es Public** — leería PDFs si adivina el ID.
3. **Credenciales del seed están en el repo** — si alguien con acceso al repo obtiene la URL, se autentica.
4. **ngrok dashboard (localhost:4040)** muestra TODOS los requests que pasan — útil para debug pero expone info sensible a quien esté frente a tu pantalla.

**Recomendaciones**:
- Apaga el túnel cuando termines la sesión (no lo dejes toda la noche).
- Para compartir con alguien externo al equipo, **no** uses las credenciales de dev — crea un usuario ad-hoc.
- Si vas a dejar el túnel corriendo por tiempo largo, considera agregar [ngrok IP Restrictions](https://ngrok.com/docs/traffic-policy/actions/restrict-ips/) o Basic Auth con `--basic-auth`.

---

## Troubleshooting

### "ERR_NGROK_121 agent version too old"

Tu ngrok está desactualizado:
```bash
brew upgrade ngrok
```

### "ngrok no publicó URL"

El script espera 30s. Si falla, revisa `/tmp/ngrok-share.log`. Causas comunes:
- Authtoken inválido o no configurado.
- Internet sin salida.
- Static Domain no te pertenece (si usaste `scripts/share-tunnel.sh <domain>`).

### "El amigo ve una página interstitial de ngrok"

Solo pasa con browsers, no con Bruno/curl. Si realmente aparece en Bruno, agrega el header `ngrok-skip-browser-warning: true` en el request.

### "HTTP 502 Bad Gateway desde el túnel"

Significa que ngrok conectó pero `localhost:3000` no responde. Verifica que `docker compose up` está corriendo y que el gateway está vivo.
