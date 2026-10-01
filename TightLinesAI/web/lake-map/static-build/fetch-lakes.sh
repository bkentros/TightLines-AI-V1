#!/bin/bash
# Phase 4, step 1b (runs on the Mac once): the Great Lakes' full OpenStreetMap outlines
# (every island, harbor, channel and breakwall), one lake at a time from the main OSM API.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
LM="$(cd "$HERE/.." && pwd)"
mkdir -p "$HERE/sources" "$LM/out"
exec > >(tee "$LM/out/fetch-lakes.log") 2>&1
echo "== Great Lakes outlines — $(date)"
"$LM/.venv/bin/python" "$HERE/fetch_lakes.py" "$HERE/sources"
ls -lh "$HERE/sources"
echo "== finished — $(date)"
echo "Tell Claude it's done."
