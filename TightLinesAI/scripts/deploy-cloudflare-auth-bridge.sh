#!/usr/bin/env bash
# Deploy static/auth bridge to Cloudflare Pages (no working "Create token" UI needed).
#
# Auth — pick ONE:
#
# A) API token (preferred if you can create one elsewhere):
#      export CLOUDFLARE_API_TOKEN='...'
#
# B) Global API Key (Profile → API Keys → Global API Key → View).
#    Treat like a password; unset after deploy. Pair with your Cloudflare login email:
#      export CLOUDFLARE_EMAIL='finfindr@hotmail.com'
#      export CLOUDFLARE_API_KEY='...'
#
# Optional: export CLOUDFLARE_PAGES_PROJECT_NAME=my-auth-site
#
# Run from repo root:
#   bash scripts/deploy-cloudflare-auth-bridge.sh
#
# Then: Workers & Pages → project → Custom domains → Supabase redirect + .env.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SITE_DIR="$ROOT/static/cloudflare-pages-auth-bridge"
PROJECT_NAME="${CLOUDFLARE_PAGES_PROJECT_NAME:-finfindr-auth}"

has_token=false
has_global=false
[[ -n "${CLOUDFLARE_API_TOKEN:-}" ]] && has_token=true
[[ -n "${CLOUDFLARE_EMAIL:-}" && -n "${CLOUDFLARE_API_KEY:-}" ]] && has_global=true

if [[ "$has_token" != true && "$has_global" != true ]]; then
  echo "Set either:"
  echo "  export CLOUDFLARE_API_TOKEN='...'"
  echo "or (Global API Key from My Profile → API Keys):"
  echo "  export CLOUDFLARE_EMAIL='your-cloudflare-login-email'"
  echo "  export CLOUDFLARE_API_KEY='...'"
  exit 1
fi

if [[ ! -f "$SITE_DIR/auth/confirm/index.html" ]]; then
  echo "Error: missing $SITE_DIR/auth/confirm/index.html"
  exit 1
fi

cd "$SITE_DIR"
npx wrangler@3 pages project create "$PROJECT_NAME" 2>/dev/null || true
npx wrangler@3 pages deploy . --project-name="$PROJECT_NAME"
echo ""
echo "Deployed. Open Workers & Pages → $PROJECT_NAME → copy *.pages.dev URL and test /auth/confirm/"
echo "Then add custom domain, Supabase redirect URL, and EXPO_PUBLIC_AUTH_EMAIL_REDIRECT."
