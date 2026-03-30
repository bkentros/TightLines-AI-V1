#!/usr/bin/env bash
# Metro + localtunnel → public https URL for dev client (any Wi‑Fi).
# Paste an exp:// URL below into the dev client (Enter URL manually).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

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

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  HTTPS (Safari / tunnel check):  $HTTPS_URL"
echo "  If loca.lt shows a warning, open that link once and click Continue."
echo ""
echo "  Dev client — try Enter URL manually, in this order:"
echo "    exp://${HOST}:443"
echo "    exp://${HOST}:80"
echo "  (Expo Go / dev client negotiate TLS on 443 for https tunnels.)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

export REACT_NATIVE_PACKAGER_HOSTNAME="$HOST"
export RCT_METRO_PORT="${RCT_METRO_PORT:-8081}"
exec npx expo start --dev-client --port "${RCT_METRO_PORT}"
