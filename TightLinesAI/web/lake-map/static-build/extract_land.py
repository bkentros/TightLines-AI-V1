"""Cuts the worldwide OSM land polygons down to the Great Lakes map area and gzips the result."""
import gzip
import shutil
import sys
from pathlib import Path

import shapefile  # pyshp

BOX = (-93.0, 40.8, -75.2, 49.6)  # west, south, east, north (map area + margin)
src, out = Path(sys.argv[1]), Path(sys.argv[2])
shp = next(src.rglob("land_polygons.shp"))
r = shapefile.Reader(str(shp))
w = shapefile.Writer(str(out / "land_greatlakes"), shapeType=shapefile.POLYGON)
w.field("id", "N", 10)
n = pts = 0
for i, s in enumerate(r.iterShapes(bbox=BOX)):
    b = s.bbox
    if b[2] < BOX[0] or b[0] > BOX[2] or b[3] < BOX[1] or b[1] > BOX[3]:
        continue
    w.shape(s); w.record(i); n += 1; pts += len(s.points)
w.close()
for ext in ("shp", "shx", "dbf"):
    p = out / f"land_greatlakes.{ext}"
    with open(p, "rb") as a, gzip.open(f"{p}.gz", "wb", 6) as b:
        shutil.copyfileobj(a, b)
    p.unlink()
print(f"land polygons kept: {n:,} ({pts:,} points)")
