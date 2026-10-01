#!/bin/bash
# Phase 4, step 1c (runs on the Mac once): rivers and harbor lakes along the shoreline.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
LM="$(cd "$HERE/.." && pwd)"
mkdir -p "$HERE/sources" "$LM/out"
exec > >(tee "$LM/out/fetch-water.log") 2>&1
echo "== Rivers and harbor lakes — $(date)"
"$LM/.venv/bin/python" "$HERE/fetch_ofm_water.py" "$HERE/sources"
echo "== finished — $(date)"
echo "Tell Claude it's done."
