#!/usr/bin/env bash
# Prints which pre-build smoke mode your .env matches (no secrets).
set -euo pipefail
cd "$(dirname "$0")/.."
ENV_FILE=".env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌ Missing .env — copy from .env.example"
  exit 1
fi

has() { grep -qE "^[[:space:]]*${1}=" "$ENV_FILE" 2>/dev/null; }
val_set() {
  local line
  line=$(grep -E "^[[:space:]]*${1}=" "$ENV_FILE" | tail -1 | cut -d= -f2- | tr -d ' "'\''')
  [[ -n "$line" ]]
}

echo "=== FinFindr pre-build env check ==="
echo ""

for key in EXPO_PUBLIC_SUPABASE_URL EXPO_PUBLIC_SUPABASE_ANON_KEY EXPO_PUBLIC_REVENUECAT_IOS_API_KEY EXPO_PUBLIC_AUTH_EMAIL_REDIRECT; do
  if val_set "$key"; then
    echo "✓ $key is set"
  else
    echo "⚠ $key is missing or empty"
  fi
done

echo ""
if val_set EXPO_PUBLIC_POSTHOG_API_KEY; then
  echo "Mode: posthog-enabled (Pass B — verify events in PostHog dashboard)"
else
  echo "Mode: store-like (Pass A — matches EAS production; analytics off)"
fi

echo ""
echo "Next: npm run start:dev-client"
echo "Guide: docs/PREBUILD_IOS_SMOKE_TEST.md"
