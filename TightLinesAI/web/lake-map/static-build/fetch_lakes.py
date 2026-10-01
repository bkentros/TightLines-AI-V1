"""Downloads the Great Lakes' full OpenStreetMap outlines, one lake at a time:
Nominatim finds each lake's relation id, then the main OSM API returns the
relation with all its ways and nodes (…/relation/<id>/full).
Output: sources/osm-<lake>.xml.gz"""
import gzip
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

UA = {"User-Agent": "PierCast-LakeMap/1.0 (FinFindr fishing app; one-time shoreline build)"}
LAKES = ["Lake Superior", "Lake Michigan", "Lake Huron", "Lake Erie", "Lake Ontario", "Lake Saint Clair"]
out = Path(sys.argv[1])


def get(url, timeout=600):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout) as r:
        return r.read()


ok = 0
for name in LAKES:
    slug = name.lower().replace(" ", "-")
    dest = out / f"osm-{slug}.xml.gz"
    if dest.exists() and dest.stat().st_size > 10000:
        print(f"{name}: already here"); ok += 1; continue
    try:
        q = urllib.parse.urlencode({"q": name, "format": "json", "limit": 10, "countrycodes": "us,ca"})
        hits = json.loads(get(f"https://nominatim.openstreetmap.org/search?{q}", 60))
        rel = next((h for h in hits if h.get("osm_type") == "relation" and h.get("class") in ("natural", "water")
                    and h.get("type") in ("water", "lake")), None)
        if not rel:
            print(f"{name}: no lake relation found ({[(h.get('osm_type'), h.get('class'), h.get('type')) for h in hits][:5]})")
            continue
        print(f"{name}: relation {rel['osm_id']} — downloading…", flush=True)
        t0 = time.time()
        xml = get(f"https://api.openstreetmap.org/api/0.6/relation/{rel['osm_id']}/full", 900)
        dest.write_bytes(gzip.compress(xml, 6))
        print(f"{name}: {len(xml) / 1e6:.1f} MB in {time.time() - t0:.0f} s"); ok += 1
    except Exception as e:  # keep going with the other lakes
        print(f"{name}: FAILED ({e})")
    time.sleep(1.5)
print(f"{ok}/{len(LAKES)} lakes downloaded")
