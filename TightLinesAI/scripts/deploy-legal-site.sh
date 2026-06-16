#!/usr/bin/env bash
# Deploy legal-site (finfindr.app) to Cloudflare Pages.
#
# Auth — pick ONE:
#   export CLOUDFLARE_API_TOKEN='...'
# or:
#   export CLOUDFLARE_EMAIL='your-cloudflare-login-email'
#   export CLOUDFLARE_API_KEY='...'
#
# Run from repo root:
#   bash TightLinesAI/scripts/deploy-legal-site.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
SITE_DIR="$ROOT/legal-site"
PROJECT_NAME="${CLOUDFLARE_PAGES_PROJECT_NAME:-finfindr-auth}"

has_token=false
has_global=false
[[ -n "${CLOUDFLARE_API_TOKEN:-}" ]] && has_token=true
[[ -n "${CLOUDFLARE_EMAIL:-}" && -n "${CLOUDFLARE_API_KEY:-}" ]] && has_global=true

if [[ "$has_token" != true && "$has_global" != true ]]; then
  echo "Set CLOUDFLARE_API_TOKEN or CLOUDFLARE_EMAIL + CLOUDFLARE_API_KEY, then re-run."
  exit 1
fi

cd "$SITE_DIR"
npx wrangler@3 pages deploy . --project-name="$PROJECT_NAME" --branch=main
echo ""
echo "Deployed $SITE_DIR → Cloudflare Pages project: $PROJECT_NAME"
echo "Test: https://finfindr.app/download (should 302 to App Store)"
echo "Test: https://finfindr.app/get (TikTok-safe link-in-bio page, 200 OK)"
echo "Test: https://finfindr.app/app (should 302 to App Store)"
echo "Test: https://finfindr.app/c/launch-test-creator (creator landing; needs SUPABASE_ANON_KEY in CF Pages env)"
echo "Test: https://finfindr.app/creators/ (creator portal; same SUPABASE_ANON_KEY + Supabase auth redirect URL)"
echo ""
echo "Supabase Auth → URL Configuration: add https://finfindr.app/creators/ and https://finfindr.app/creators/auth/callback/ to Redirect URLs"
echo "Cloudflare Pages env (required for /c/{slug} and /creators): SUPABASE_ANON_KEY = same as EXPO_PUBLIC_SUPABASE_ANON_KEY"
