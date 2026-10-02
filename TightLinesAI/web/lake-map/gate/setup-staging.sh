#!/usr/bin/env bash
# Deploy only the isolated workers.dev staging gatekeeper. This never changes
# or reuses the production Worker secret, custom domain, Supabase, or bucket.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../.." && pwd)"
ENV_FILE="$ROOT/.env"

if ! grep -q '^PIER_CAST_MAP_STAGING_PASS_SECRET=' "$ENV_FILE"; then
  printf '\nPIER_CAST_MAP_STAGING_PASS_SECRET=%s\n' "$(openssl rand -hex 32)" >> "$ENV_FILE"
  echo "Created a staging-only map pass secret in .env"
fi
SECRET="$(grep '^PIER_CAST_MAP_STAGING_PASS_SECRET=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"

cd "$HERE"
npx --yes wrangler@4 deploy --config wrangler.staging.toml
printf '%s' "$SECRET" | npx --yes wrangler@4 secret put MAP_PASS_SECRET --config wrangler.staging.toml
echo "Staging gatekeeper deployed; production was not changed."
