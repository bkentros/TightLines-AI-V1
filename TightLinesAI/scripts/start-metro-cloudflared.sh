#!/usr/bin/env bash
# Metro + Cloudflare Quick Tunnel (trycloudflare.com).
# Usually faster and far more stable than localtunnel/loca.lt (fewer 503s on reload).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

CLOUDFLARED=""
if command -v cloudflared >/dev/null 2>&1; then
  CLOUDFLARED="cloudflared"
elif [[ -x "$ROOT/.tools/cloudflared" ]]; then
  CLOUDFLARED="$ROOT/.tools/cloudflared"
else
  echo "cloudflared not found. From TightLinesAI/ run:  npm run setup:cloudflared"
  echo "Or: brew install cloudflared"
  exit 1
fi

lsof -tiTCP:8081 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

export CI=0

PORT="${RCT_METRO_PORT:-8081}"
CF_LOG="${TMPDIR:-/tmp}/tightlines-cf-$$.log"
rm -f "$CF_LOG"
"$CLOUDFLARED" tunnel --url "http://127.0.0.1:${PORT}" >"$CF_LOG" 2>&1 &
CF_PID=$!
cleanup() { kill "$CF_PID" 2>/dev/null || true; rm -f "$CF_LOG"; }
trap cleanup EXIT

HOST=""
for _ in $(seq 1 120); do
  URL_LINE=$(grep -oE 'https://[a-zA-Z0-9.-]+\.trycloudflare\.com' "$CF_LOG" 2>/dev/null | head -1 || true)
  if [[ -n "${URL_LINE:-}" ]]; then
    HOST="${URL_LINE#https://}"
    HOST="${HOST%%/*}"
    break
  fi
  sleep 1
done

if [[ -z "${HOST:-}" ]]; then
  echo "Timed out waiting for trycloudflare.com URL. Log:"
  cat "$CF_LOG" || true
  exit 1
fi

HTTPS_URL="https://${HOST}"
export EXPO_PACKAGER_PROXY_URL="$HTTPS_URL"

DEV_CLIENT_URL="$(HOST="$HOST" node -e "
const slug = require('./app.json').expo.slug;
const s = String(slug).replace(/[^A-Za-z0-9+\\-.]/g, '').toLowerCase();
const scheme = 'exp+' + s;
const manifest = 'https://' + process.env.HOST + ':443';
process.stdout.write(scheme + '://expo-development-client/?url=' + encodeURIComponent(manifest));
")"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Cloudflare Quick Tunnel (reload-friendly; no loca.lt 503s)"
echo "  HTTPS check:  $HTTPS_URL"
echo ""
echo "  TightLines dev client — Enter URL manually (copy full line):"
echo "    ${DEV_CLIENT_URL}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

export REACT_NATIVE_PACKAGER_HOSTNAME="$HOST"
export RCT_METRO_PORT="${PORT}"
if [[ "${EXPO_START_CLEAR:-}" == "1" ]]; then
  exec npx expo start --dev-client --clear --port "${RCT_METRO_PORT}"
fi
exec npx expo start --dev-client --port "${RCT_METRO_PORT}"
