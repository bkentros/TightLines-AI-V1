#!/usr/bin/env bash
# Deploy only the isolated workers.dev staging gatekeeper. For owner dev-build
# testing it uses the production pass-verification secret, but its sole R2
# binding remains the staging bucket and it has no production route or cron.
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../.." && pwd)"
ENV_FILE="$ROOT/.env"

SECRET="$(grep '^PIER_CAST_MAP_PASS_SECRET=' "$ENV_FILE" | tail -1 | cut -d= -f2-)"
if [ -z "$SECRET" ]; then
  echo "PIER_CAST_MAP_PASS_SECRET is missing from .env" >&2
  exit 2
fi

cd "$HERE"
npx --yes wrangler@4 deploy --config wrangler.staging.toml
printf '%s' "$SECRET" | npx --yes wrangler@4 secret put MAP_PASS_SECRET --config wrangler.staging.toml
echo "Staging gatekeeper deployed with shared pass verification; production was not changed."
