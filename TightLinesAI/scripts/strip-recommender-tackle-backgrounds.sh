#!/usr/bin/env bash
# Strip solid / soft backgrounds from recommender tackle PNGs using rembg (local ML).
# Install: pip install rembg  (or: pipx install rembg)
# Usage from TightLinesAI/: bash scripts/strip-recommender-tackle-backgrounds.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
if ! command -v rembg >/dev/null 2>&1; then
  echo "rembg not found. Install with: pip install rembg"
  echo "Then ensure rembg is on PATH (or use: python3 -m rembg)."
  exit 1
fi
strip_dir () {
  local dir="$1"
  [[ -d "$dir" ]] || return 0
  local tmp
  for f in "$dir"/*.png; do
    [[ -e "$f" ]] || continue
    tmp="${f%.png}.rgba-tmp.png"
    rembg i "$f" "$tmp"
    mv "$tmp" "$f"
    echo "stripped: $f"
  done
}
strip_dir "$ROOT/assets/images/lures"
strip_dir "$ROOT/assets/images/flies"
echo "Done. PNGs in lures/ and flies/ replaced with RGBA versions."
