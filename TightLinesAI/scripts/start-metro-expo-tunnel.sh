#!/usr/bin/env bash
# Expo-managed tunnel (ngrok) — works when LAN/AP isolation blocks phone → Mac :8081.
# Connect once (QR or Recently opened after first success); leave this process running while you dev.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

lsof -tiTCP:8081 -sTCP:LISTEN 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

unset EXPO_PACKAGER_PROXY_URL || true
unset REACT_NATIVE_PACKAGER_HOSTNAME || true

export CI=0
export RCT_METRO_PORT="${RCT_METRO_PORT:-8081}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Expo / ngrok tunnel (can fail with \"session closed\" — use npm run dev:live instead)"
echo "  Log in to Expo if prompted (first time only)."
echo ""
echo "  1) When Metro shows a QR code, scan it ONCE with the Camera app."
echo "  2) Leave this terminal open all day — that keeps the server live."
echo "  3) After the first load, reopen the dev client and use"
echo "     Recently opened — no new QR each time until you stop Metro."
echo ""
echo "  Supabase/recommender still use the cloud; only JS comes from here."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [[ "${EXPO_START_CLEAR:-}" == "1" ]]; then
  exec npx expo start --dev-client --tunnel --clear --port "${RCT_METRO_PORT}"
fi
exec npx expo start --dev-client --tunnel --port "${RCT_METRO_PORT}"
