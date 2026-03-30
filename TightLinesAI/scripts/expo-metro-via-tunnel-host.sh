#!/usr/bin/env bash
# Start Metro so the dev client loads bundles through your tunnel hostname.
#
# 1) In another terminal, start a tunnel to port 8081, e.g.:
#    npx localtunnel --port 8081
#    # or (after: ngrok config add-authtoken <token>)
#    ngrok http 8081
#
# 2) Copy ONLY the hostname (no https://), e.g. nice-pears-wear.loca.lt
#
# 3) From TightLinesAI/:
#    TUNNEL_HOST=nice-pears-wear.loca.lt npm run start:dev-client:with-tunnel-host
#
# 4) On iPhone: use the QR code from this terminal, or Developer menu →
#    "Enter URL manually" and paste the exp:// or https:// URL THIS terminal prints
#    after Metro starts (not the raw tunnel homepage).

set -euo pipefail
if [[ -z "${TUNNEL_HOST:-}" ]]; then
  echo "Error: set TUNNEL_HOST to your tunnel hostname (no scheme), e.g."
  echo "  TUNNEL_HOST=abc123.ngrok-free.app npm run start:dev-client:with-tunnel-host"
  exit 1
fi

export CI=0
export REACT_NATIVE_PACKAGER_HOSTNAME="${TUNNEL_HOST}"
# See start-metro-localtunnel.sh — tunnel HTTPS is on 443, not public :8081.
export EXPO_PACKAGER_PROXY_URL="https://${TUNNEL_HOST}"
export RCT_METRO_PORT="${RCT_METRO_PORT:-8081}"

exec npx expo start --dev-client --port "${RCT_METRO_PORT}"
