#!/bin/bash
# First real run of the Live Lake Map data job on this Mac.
# Sets up a private Python environment, runs the tests, builds one run from live
# NOAA / Open-Meteo data, and uploads it to Cloudflare R2 if the R2 keys are in .env.
# Everything is logged to web/lake-map/out/first-run.log (API keys are never printed).
set -uo pipefail
LM="$(cd "$(dirname "$0")/.." && pwd)"
ROOT="$(cd "$LM/../.." && pwd)"
mkdir -p "$LM/out"
LOG="$LM/out/first-run.log"
exec > >(tee "$LOG") 2>&1
echo "== Live Lake Map first run — $(date)"

# 1. GitHub workflow file into place (my tools can't write inside .github)
mkdir -p "$ROOT/.github/workflows"
cp "$LM/job/lake-map-data.workflow.yml" "$ROOT/.github/workflows/lake-map-data.yml" && echo "workflow file: ok"

# 2. Python 3.10+ in its own environment
PY=""
for c in python3.13 python3.12 python3.11 python3.10 /opt/homebrew/bin/python3 python3; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c 'import sys; sys.exit(0 if sys.version_info >= (3, 9) else 1)'; then PY="$c"; break; fi
done
[ -z "$PY" ] && { echo "No Python 3.9+ found. Install it from https://www.python.org/downloads/ and run this again."; exit 1; }
echo "python: $($PY --version)"
if [ ! -x "$LM/.venv/bin/python" ]; then "$PY" -m venv "$LM/.venv" || exit 1; fi
"$LM/.venv/bin/python" -m pip install -q --upgrade pip
"$LM/.venv/bin/python" -m pip install -q -r "$LM/job/requirements.txt" || { echo "pip install failed"; exit 1; }
echo "packages: ok"
command -v node >/dev/null || { echo "Node.js not found"; exit 1; }
echo "node: $(node --version)"

# 3. Keys: read from .env by the job itself (values are never printed)

# 4. Tests
cd "$LM"
"$LM/.venv/bin/python" -m unittest discover -s job/tests 2>&1 | tail -3
node --test test/*.test.mjs job/*.test.mjs 2>&1 | grep -E "^# (pass|fail)"

# 5. Build from live data (uploads only if the three R2 keys are found in .env)
echo "== build"
time "$LM/.venv/bin/python" job/build.py --out "$LM/out" --env-file "$ROOT/.env" --upload --force
echo "== finished with exit code $? — $(date)"
echo "You can close this window. Tell Claude it's done."
