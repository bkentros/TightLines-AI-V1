#!/usr/bin/env python3
"""Read-only LMHOFS/OSM audit of connected east-shore inland lakes."""
from __future__ import annotations

import json
import math
import re
import urllib.parse
import urllib.request
from pathlib import Path

import numpy as np

LAKES = {
    "Muskegon Lake": "Muskegon Lake, Michigan",
    "White Lake": "White Lake, Muskegon County, Michigan",
    "Pere Marquette Lake": "Pere Marquette Lake, Michigan",
    "Manistee Lake": "Manistee Lake, Michigan",
    "Portage Lake": "Portage Lake, Onekama, Michigan",
    "Betsie Lake": "Betsie Lake, Michigan",
    "Lake Charlevoix": "Lake Charlevoix, Michigan",
    "Lake Macatawa": "Lake Macatawa, Michigan",
    "Spring Lake": "Spring Lake, Ottawa County, Michigan",
    "Pentwater Lake": "Pentwater Lake, Michigan",
    "Mona Lake": "Mona Lake, Michigan",
    "Arcadia Lake": "Arcadia Lake, Michigan",
    "Bear Lake": "Bear Lake, Manistee County, Michigan",
}
CACHE = Path("/tmp/finfindr-hybrid-phase1/inland")
UA = "FinFindr-inland-grid-audit/1.0 (+https://finfindr.app)"


def get(url, path):
    if path.exists(): return path.read_bytes()
    request = urllib.request.Request(url, headers={"user-agent": UA})
    with urllib.request.urlopen(request, timeout=180) as response: body = response.read()
    path.parent.mkdir(parents=True, exist_ok=True); path.write_bytes(body); return body


def rings(geometry):
    coordinates = geometry["coordinates"]
    if geometry["type"] == "Polygon": return coordinates
    return [ring for polygon in coordinates for ring in polygon]


def inside(x, y, ring):
    hit = False
    for index, (x1, y1) in enumerate(ring):
        x2, y2 = ring[index - 1]
        if (y1 > y) != (y2 > y) and x < (x2 - x1) * (y - y1) / (y2 - y1) + x1: hit = not hit
    return hit


def contains(geometry, lon, lat):
    rs = rings(geometry)
    return any(inside(lon, lat, ring) for ring in rs)


def tile(lon, lat, zoom=12):
    n = 2 ** zoom
    return int((lon + 180) / 360 * n), int((1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n)


class UnionFind:
    def __init__(self, n): self.p = np.arange(n, dtype=np.int32)
    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]; x = int(self.p[x])
        return x
    def union(self, a, b):
        a, b = self.find(a), self.find(b)
        if a != b: self.p[b] = a


def main():
    CACHE.mkdir(parents=True, exist_ok=True)
    geometries = {}
    for name, query in LAKES.items():
        url = "https://nominatim.openstreetmap.org/search?" + urllib.parse.urlencode(
            {"q": query, "format": "jsonv2", "polygon_geojson": 1, "limit": 1})
        result = json.loads(get(url, CACHE / f"osm-{re.sub('[^a-z]+','-',name.lower()).strip('-')}.json"))
        if result and result[0].get("geojson"):
            geometries[name] = (result[0]["geojson"], float(result[0]["lon"]), float(result[0]["lat"]))
    grid = np.load("/tmp/finfindr-hybrid-phase1/model/grid-lmhofs.npz")
    lat, lon = np.asarray(grid["lat"]), np.asarray(grid["lon"])
    nv_url = ("https://www.ncei.noaa.gov/thredds/dodsC/model-lmhofs-files/2024/07/"
              "nos.lmhofs.fields.n006.20240715.t00z.nc.ascii?nv%5B0:1:2%5D%5B0:1:171376%5D")
    text = get(nv_url, CACHE / "lmhofs-nv.txt").decode("utf-8", "replace")
    rows = []
    for line in text.splitlines():
        if re.match(r"^\[[012]\],", line): rows.append([int(value) - 1 for value in line.split(",")[1:]])
    uf = UnionFind(len(lat))
    if len(rows) == 3:
        for a, b, c in zip(*rows): uf.union(a, b); uf.union(b, c)
    main_index = int(np.argmin((lat - 43.5) ** 2 + (lon + 87.0) ** 2))
    main_component = uf.find(main_index)
    tiles = {tuple(item) for item in json.loads(Path("TightLinesAI/web/lake-map/static-build/ofm-shore-tiles-z12.json").read_text())}
    glos = json.loads(Path("/tmp/glos-datasets.geojson").read_text())
    output = {}
    for name, (geometry, center_lon, center_lat) in geometries.items():
        coords = np.concatenate([np.asarray(ring, dtype=float) for ring in rings(geometry)])
        xmin, ymin = coords.min(axis=0); xmax, ymax = coords.max(axis=0)
        candidates = np.flatnonzero((lon >= xmin) & (lon <= xmax) & (lat >= ymin) & (lat <= ymax))
        indices = [int(index) for index in candidates if contains(geometry, float(lon[index]), float(lat[index]))]
        gauges = []
        for feature in glos.get("features", []):
            point = feature.get("geometry") or {}; props = feature.get("properties", {})
            if point.get("type") != "Point" or not contains(geometry, *point["coordinates"][:2]): continue
            if any(item.get("standard_name") == "sea_water_temperature" for item in props.get("parameters", [])):
                gauges.append(str(props.get("obs_dataset_id")))
        output[name] = {"nodes": len(indices),
                        "connected": bool(indices and any(uf.find(index) == main_component for index in indices)),
                        "mapRenders": tile(center_lon, center_lat) in tiles, "glosGauges": gauges}
    Path("/tmp/finfindr-hybrid-phase1/inland-lakes.json").write_text(json.dumps(output, indent=2, sort_keys=True)+"\n")
    print(json.dumps(output, sort_keys=True))


if __name__ == "__main__": main()
