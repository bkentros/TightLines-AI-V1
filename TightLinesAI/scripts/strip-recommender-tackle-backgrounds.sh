#!/usr/bin/env bash
# Delegates to strip-recommender-rgba.py (rembg Python API — no CLI / gradio needed).
#
# Recommender preload PNGs → RGBA in place (see script header in .py for paths).
#
# One-time venv (macOS system Python avoids broken Homebrew 3.14 builds):
#   cd TightLinesAI && /usr/bin/python3 -m venv .venv-rembg && . .venv-rembg/bin/activate \
#     && pip install rembg onnxruntime
#
# From TightLinesAI/: npm run postgen:recommender-tackle-alpha
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PY="$ROOT/.venv-rembg/bin/python"
if [[ -x "$PY" ]]; then
  exec "$PY" "$ROOT/scripts/strip-recommender-rgba.py"
fi
exec python3 "$ROOT/scripts/strip-recommender-rgba.py"
