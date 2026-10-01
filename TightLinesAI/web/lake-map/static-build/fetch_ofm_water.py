"""Downloads the OpenFreeMap (OpenStreetMap) vector tiles along the Great Lakes
shoreline once, so the tile build can add rivers and harbor lakes (Pere Marquette
Lake, White Lake, Muskegon Lake, the St. Marys / Detroit / St. Clair rivers …).
Output: sources/ofm-shore-z12.tar.gz"""
import io
import json
import sys
import tarfile
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

UA = {"User-Agent": "PierCast-LakeMap/1.0 (FinFindr fishing app; one-time shoreline build)"}
here = Path(__file__).resolve().parent
out = Path(sys.argv[1])
tiles = json.loads((here / "ofm-shore-tiles-z12.json").read_text())


def get(url):
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=60) as r:
                return r.read()
        except Exception as e:
            if attempt == 3:
                raise
            time.sleep(2 ** attempt)


tj = json.loads(get("https://tiles.openfreemap.org/planet"))
template = tj["tiles"][0]
print(f"{len(tiles)} tiles from {template.split('{')[0]}…", flush=True)
done = {}


def one(xy):
    x, y = xy
    try:
        done[(x, y)] = get(template.replace("{z}", "12").replace("{x}", str(x)).replace("{y}", str(y)))
    except Exception as e:
        print(f"  tile {x},{y} failed: {e}")


t0 = time.time()
with ThreadPoolExecutor(8) as pool:
    for i, _ in enumerate(pool.map(one, tiles)):
        if i % 250 == 0:
            print(f"  {i}/{len(tiles)}", flush=True)
buf = out / "ofm-shore-z12.tar.gz"
with tarfile.open(buf, "w:gz") as t:
    for (x, y), data in done.items():
        info = tarfile.TarInfo(f"12-{x}-{y}.pbf"); info.size = len(data)
        t.addfile(info, io.BytesIO(data))
print(f"{len(done)}/{len(tiles)} tiles, {buf.stat().st_size / 1e6:.1f} MB in {time.time() - t0:.0f} s")
