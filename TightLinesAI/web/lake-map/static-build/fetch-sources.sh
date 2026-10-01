#!/bin/bash
# Phase 4, step 1 (runs on the Mac once): download the shoreline and depth sources.
#   - OpenStreetMap land polygons (every harbor, breakwall and island), cut to the Great Lakes
#   - NOAA NCEI bathymetry grids for all five lakes (+ Lake St. Clair inside the Erie grid)
# Output: web/lake-map/static-build/sources/  (about 100–300 MB; big temporary files are deleted)
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
LM="$(cd "$HERE/.." && pwd)"
SRC="$HERE/sources"; TMP="$HERE/tmp"
mkdir -p "$SRC" "$TMP" "$LM/out"
LOG="$LM/out/fetch-sources.log"
exec > >(tee "$LOG") 2>&1
echo "== Phase 4 sources — $(date)"
PY="$LM/.venv/bin/python"
[ -x "$PY" ] || { echo "Run job/first-run.sh once first (it sets up Python)."; exit 1; }
"$PY" -m pip install -q pyshp && echo "pyshp: ok"

echo "== NOAA bathymetry"
for lake in superior michigan huron erie ontario; do
  f="$SRC/${lake}_lld.geotiff.tar.gz"
  if [ -s "$f" ]; then echo "$lake: already here"; continue; fi
  curl -fL --retry 3 -o "$f" "https://www.ngdc.noaa.gov/mgg/greatlakes/$lake/data/geotiff/${lake}_lld.geotiff.tar.gz" \
    && echo "$lake: $(du -h "$f" | cut -f1)" || echo "$lake: FAILED"
done

echo "== OpenStreetMap land polygons (about 900 MB download, a few minutes)"
ZIP="$TMP/land-polygons-split-4326.zip"
if [ ! -s "$SRC/land_greatlakes.shp.gz" ]; then
  [ -s "$ZIP" ] || curl -fL --retry 3 -o "$ZIP" "https://osmdata.openstreetmap.de/download/land-polygons-split-4326.zip" || { echo "land download FAILED"; exit 1; }
  echo "downloaded $(du -h "$ZIP" | cut -f1)"
  unzip -o -q "$ZIP" -d "$TMP" && echo "unzipped"
  "$PY" "$HERE/extract_land.py" "$TMP" "$SRC" || { echo "extract FAILED"; exit 1; }
  rm -rf "$TMP" && echo "temporary files removed"
else
  echo "land: already here"
fi
ls -lh "$SRC"
echo "== finished — $(date)"
echo "Tell Claude it's done."
