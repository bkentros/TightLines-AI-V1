#!/usr/bin/env bash
# One-time setup of the Live Lake Map gatekeeper (runs on the Mac, from anywhere):
#   1. creates the shared pass secret in TightLinesAI/.env (never printed)
#   2. deploys the Worker at map.finfindr.app (Cloudflare login opens in the browser if needed)
#   3. gives the secret to the Worker and to Supabase (PIER_CAST_MAP_PASS_SECRET)
# Safe to re-run: an existing secret is reused.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../.." && pwd)"   # TightLinesAI
ENV_FILE="$ROOT/.env"

touch "$ENV_FILE"
if ! grep -q '^PIER_CAST_MAP_PASS_SECRET=' "$ENV_FILE"; then
  printf '\nPIER_CAST_MAP_PASS_SECRET=%s\n' "$(openssl rand -hex 32)" >> "$ENV_FILE"
  echo "Created the map pass secret in .env"
else
  echo "Using the existing map pass secret from .env"
fi
SECRET="$(grep '^PIER_CAST_MAP_PASS_SECRET=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"

cd "$HERE"
npx --yes wrangler@4 whoami >/dev/null 2>&1 || npx --yes wrangler@4 login
npx --yes wrangler@4 deploy
printf '%s' "$SECRET" | npx --yes wrangler@4 secret put MAP_PASS_SECRET

cd "$ROOT"
TMP="$(mktemp)"; trap 'rm -f "$TMP"' EXIT
printf 'PIER_CAST_MAP_PASS_SECRET=%s\n' "$SECRET" > "$TMP"
npx --yes supabase secrets set --env-file "$TMP"
echo "Done. The map is now served (with a pass only) at https://map.finfindr.app"
