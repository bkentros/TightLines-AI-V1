#!/usr/bin/env python3
"""Phase 4, step 3 (runs on the Mac): uploads the static map layers and the
phone prototype to the Cloudflare bucket.

  static/lakes-v2.pmtiles, static/depth-v1.pmtiles   (shoreline, contours, depth)
  map/… (the map page the app opens through the gatekeeper at map.finfindr.app)

Large files arrive from Claude in 19 MB parts (name.pmtiles.part000 …); they
are joined here before upload. Keys come from ../../../.env like the data job.
"""
import mimetypes
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LM = HERE.parent
sys.path.insert(0, str(LM / "job"))
from build import Log, load_env_file  # noqa: E402
from lakemap import store  # noqa: E402

log = Log()
load_env_file(LM.parent.parent / ".env", log)
if not all(os.environ.get(k) for k in ("R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY")):
    sys.exit("R2 keys missing in .env")
s3 = store.client()

dist = HERE / "dist"
for first in sorted(dist.glob("*.part000")):
    name = first.name[: -len(".part000")]
    parts = sorted(dist.glob(name + ".part*"))
    with open(dist / name, "wb") as out:
        for p in parts:
            out.write(p.read_bytes())
    for p in parts:
        p.unlink()
    log(f"joined {name} from {len(parts)} parts")

def same_as_remote(path, key):
    try:
        return s3.head_object(Bucket=store.bucket(), Key=key)["ContentLength"] == path.stat().st_size
    except Exception:
        return False


for f in sorted(dist.glob("*.pmtiles")):
    if same_as_remote(f, f"static/{f.name}"):
        log(f"static/{f.name} already up to date")
        continue
    s3.upload_file(str(f), store.bucket(), f"static/{f.name}",
                   ExtraArgs={"ContentType": "application/vnd.pmtiles", "CacheControl": "public, max-age=3600"})
    log(f"uploaded static/{f.name} ({f.stat().st_size / 1e6:.1f} MB)")

# The built map page (npm run build:page → copied into static-build/proto/) goes to map/,
# which the gatekeeper (gate/worker.js, map.finfindr.app) serves to pass holders only.
proto = HERE / "proto"
for prefix in ("map",):
    for f in sorted(p for p in proto.rglob("*") if p.is_file()):
        key = f"{prefix}/" + f.relative_to(proto).as_posix()
        kind = mimetypes.guess_type(f.name)[0] or "application/octet-stream"
        if f.suffix == ".js":
            kind = "text/javascript"
        # the page itself must refresh quickly; the MapLibre files never change between builds
        cache = "public, max-age=60" if f.name in ("index.html", "app.js") else "public, max-age=86400"
        s3.upload_file(str(f), store.bucket(), key, ExtraArgs={"ContentType": kind, "CacheControl": cache})
        log(f"uploaded {key}")
log("done — for a phone-browser test link run: python3 static-build/test_pass.py")
