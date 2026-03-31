#!/usr/bin/env bash
# Metro + ngrok → stable https URL (needs ngrok account: ngrok config add-authtoken …).
# Run from TightLinesAI/: npm run start:dev-client:ngrok
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export CI=0

if [[ -x "$HOME/.local/bin/ngrok" ]]; then
  export PATH="$HOME/.local/bin:$PATH"
fi

if ! command -v ngrok >/dev/null 2>&1; then
  echo "ngrok is not installed."
  echo "  Download the current macOS binary from https://ngrok.com/downloads"
  echo "  Then place it at: $HOME/.local/bin/ngrok"
  echo "  Then run: ngrok config add-authtoken <token>"
  exit 1
fi

NGROK_VERSION="$(ngrok version 2>/dev/null | awk '{print $3}')"
NGROK_MAJOR="${NGROK_VERSION%%.*}"
if [[ -n "$NGROK_MAJOR" ]] && [[ "$NGROK_MAJOR" =~ ^[0-9]+$ ]] && (( NGROK_MAJOR < 3 )); then
  echo "ngrok version $NGROK_VERSION is too old."
  echo "  Download the current macOS binary from https://ngrok.com/downloads"
  echo "  Then place it at: $HOME/.local/bin/ngrok"
  echo "  Then rerun this same npm script."
  exit 1
fi

pkill -f "localtunnel --port 8081" 2>/dev/null || true
lsof -tiTCP:8081 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

ngrok http 8081 --log=stdout >"${TMPDIR:-/tmp}/tightlines-ngrok-$$.log" 2>&1 &
NG_PID=$!
cleanup() { kill "$NG_PID" 2>/dev/null || true; }
trap cleanup EXIT

PUBLIC=""
for _ in $(seq 1 60); do
  if curl -sf "http://127.0.0.1:4040/api/tunnels" >/dev/null 2>&1; then
    PUBLIC=$(curl -sf "http://127.0.0.1:4040/api/tunnels" | node -e "
      const d = JSON.parse(require('fs').readFileSync(0,'utf8'));
      const t = (d.tunnels || []).find(x => x.proto === 'https');
      console.log(t ? t.public_url : '');
    ")
    if [[ -n "$PUBLIC" ]]; then break; fi
  fi
  sleep 1
done

if [[ -z "$PUBLIC" ]]; then
  echo "ngrok did not expose an https URL in time. Is port 4040 free? Log:"
  tail -20 "${TMPDIR:-/tmp}/tightlines-ngrok-$$.log" || true
  exit 1
fi

HOST="${PUBLIC#https://}"
HOST="${HOST#http://}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  HTTPS:     $PUBLIC"
echo "  Dev URL:   try exp://${HOST}:443  then  exp://${HOST}:80"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

export EXPO_PACKAGER_PROXY_URL="$PUBLIC"
export REACT_NATIVE_PACKAGER_HOSTNAME="$HOST"
export RCT_METRO_PORT="${RCT_METRO_PORT:-8081}"
exec npx expo start --dev-client --port "${RCT_METRO_PORT}"
