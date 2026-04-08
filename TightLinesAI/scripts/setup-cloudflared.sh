#!/usr/bin/env bash
# Download cloudflared into .tools/ (no Homebrew / Go compile).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TOOLS="$ROOT/.tools"
mkdir -p "$TOOLS"
ARCH=$(uname -m)
case "$ARCH" in
  arm64) PKG="cloudflared-darwin-arm64.tgz" ;;
  x86_64) PKG="cloudflared-darwin-amd64.tgz" ;;
  *) echo "Unsupported arch: $ARCH"; exit 1 ;;
esac
URL="https://github.com/cloudflare/cloudflared/releases/latest/download/${PKG}"
echo "Downloading ${URL} ..."
curl -fsSL "$URL" -o "${TOOLS}/cloudflared.tgz"
tar -xzf "${TOOLS}/cloudflared.tgz" -C "$TOOLS" cloudflared
rm -f "${TOOLS}/cloudflared.tgz"
chmod +x "$TOOLS/cloudflared"
echo "Installed: $TOOLS/cloudflared"
"$TOOLS/cloudflared" --version
