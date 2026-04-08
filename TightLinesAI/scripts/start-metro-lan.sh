#!/usr/bin/env bash
# Fast path: phone + Mac on same Wi‑Fi, no tunnel.
# Requires a dev build that includes NSLocalNetworkUsageDescription (see app.json).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

IFACE=$(route -n get default 2>/dev/null | awk '/interface:/{print $2}')
IFACE="${IFACE:-en0}"
LAN_IP=$(ipconfig getifaddr "$IFACE" 2>/dev/null || true)
if [[ -z "${LAN_IP:-}" ]]; then
  LAN_IP=$(ipconfig getifaddr en0 2>/dev/null || true)
fi
if [[ -z "${LAN_IP:-}" ]]; then
  echo "Could not read a LAN IP. Connect this Mac to Wi‑Fi and try again."
  exit 1
fi

lsof -tiTCP:8081 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

export CI=0
export REACT_NATIVE_PACKAGER_HOSTNAME="$LAN_IP"
unset EXPO_PACKAGER_PROXY_URL || true

PORT="${RCT_METRO_PORT:-8081}"
MANIFEST="http://${LAN_IP}:${PORT}"
DEV_CLIENT_URL="$(node -e "
const slug = require('./app.json').expo.slug;
const s = String(slug).replace(/[^A-Za-z0-9+\\-.]/g, '').toLowerCase();
const scheme = 'exp+' + s;
const manifest = process.argv[1];
process.stdout.write(scheme + '://expo-development-client/?url=' + encodeURIComponent(manifest));
" "$MANIFEST")"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  LAN Metro (same Wi‑Fi — no tunnel, fast images/reloads)"
echo "  Interface: ${IFACE}  IP: ${LAN_IP}  Port: ${PORT}"
echo ""
echo "  iPhone: Settings → TightLines AI → Local Network → On"
echo "  (Rebuild dev client once after NSLocalNetworkUsageDescription was added.)"
echo ""
echo "  TightLines dev client — Enter URL manually (copy full line):"
echo "    ${DEV_CLIENT_URL}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

export RCT_METRO_PORT="${PORT}"
if [[ "${EXPO_START_CLEAR:-}" == "1" ]]; then
  exec npx expo start --dev-client --host lan --clear --port "${RCT_METRO_PORT}"
fi
exec npx expo start --dev-client --host lan --port "${RCT_METRO_PORT}"
