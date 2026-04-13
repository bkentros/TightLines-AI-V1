#!/usr/bin/env bash
# Metro + localtunnel → public https URL for dev client (any Wi‑Fi).
# localtunnel/loca.lt is free but flaky (503 “tunnel unavailable”, drops on reload).
# Prefer: npm run start:dev-client:tunnel:cf (Cloudflare) or :tunnel:expo (Expo).
# Custom dev clients need exp+<slug>://expo-development-client/?url=... (see banner).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# Keep one clean Metro on 8081 so the dev client URL stays stable.
lsof -tiTCP:8081 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1
# A second terminal often leaves an old localtunnel running; two tunnels break loading.
pkill -f "localtunnel --port 8081" 2>/dev/null || true
pkill -f "npx.*localtunnel.*8081" 2>/dev/null || true
sleep 1

# Cursor/CI often sets CI=true and breaks watch mode; empty CI breaks Expo’s env parser.
export CI=0

LT_LOG="${TMPDIR:-/tmp}/tightlines-lt-$$.log"
rm -f "$LT_LOG"
npx --yes localtunnel --port 8081 >"$LT_LOG" 2>&1 &
LT_PID=$!
cleanup() { kill "$LT_PID" 2>/dev/null || true; rm -f "$LT_LOG"; }
trap cleanup EXIT

HOST=""
for _ in $(seq 1 90); do
  if grep -q "your url is:" "$LT_LOG" 2>/dev/null; then
    HOST=$(grep "your url is:" "$LT_LOG" | head -1 | sed 's/.*https:\/\///' | tr -d '\r' | tr -d ' ')
    break
  fi
  sleep 1
done

if [[ -z "${HOST:-}" ]]; then
  echo "Timed out waiting for localtunnel URL. Log:"
  cat "$LT_LOG" || true
  exit 1
fi

HTTPS_URL="https://${HOST}"
# Metro still listens on 8081 locally; the tunnel is HTTPS on 443. Without this,
# the dev client requests https://tunnel:8081/... which nothing serves publicly.
export EXPO_PACKAGER_PROXY_URL="$HTTPS_URL"

# Same shape as expo-dev-client getDefaultScheme + @expo/cli constructDevClientUrl
DEV_CLIENT_URL="$(HOST="$HOST" node -e "
const slug = require('./app.json').expo.slug;
const s = String(slug).replace(/[^A-Za-z0-9+\\-.]/g, '').toLowerCase();
const scheme = 'exp+' + s;
const manifest = 'https://' + process.env.HOST + ':443';
process.stdout.write(scheme + '://expo-development-client/?url=' + encodeURIComponent(manifest));
")"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Away from home — tunnel (localtunnel). Same Wi‑Fi? Use instead:"
echo "    npm run start:dev-client:same-wifi"
echo ""
echo "  Preferred: when Metro finishes starting, scan the QR code printed"
echo "  in this terminal with the iPhone Camera — opens the dev client with"
echo "  the bundle URL embedded (no manual paste)."
echo ""
echo "  HTTPS (Safari / tunnel check if connection fails):  $HTTPS_URL"
echo "  If loca.lt shows a warning, open that link once and click Continue."
echo ""
echo "  Fallback — Enter URL manually (copy full line):"
echo "    ${DEV_CLIENT_URL}"
echo ""
echo "  Expo Go only (not the custom dev client):"
echo "    exp://${HOST}:443"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

export REACT_NATIVE_PACKAGER_HOSTNAME="$HOST"
export RCT_METRO_PORT="${RCT_METRO_PORT:-8081}"
if [[ "${EXPO_START_CLEAR:-}" == "1" ]]; then
  exec npx expo start --dev-client --clear --port "${RCT_METRO_PORT}"
fi
exec npx expo start --dev-client --port "${RCT_METRO_PORT}"
