#!/usr/bin/env python3
"""Phase 4, step 3 (runs on the Mac): uploads the static map layers and the
phone prototype to the Cloudflare bucket.

  static/lakes-v2.pmtiles, static/depth-v1.pmtiles   (shoreline, contours, depth)
  map/… (the map page the app opens through the gatekeeper at map.finfindr.app)

Large files arrive from Claude in 19 MB parts (name.pmtiles.part000 …); they
are joined here before upload. Keys come from ../../../.env like the data job.
"""
import json
import mimetypes
import os
import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
LM = HERE.parent
sys.path.insert(0, str(LM / "job"))
from build import Log, load_env_file  # noqa: E402
from lakemap import store  # noqa: E402
from lakemap.config import PAGE_CAPABILITIES_KEY, PAGE_FEATURES  # noqa: E402

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

# Phones keep map tiles for good (an on-phone store keyed by STATIC_REV, plus a
# one-year browser cache), so a rebuilt .pmtiles must ship with a new STATIC_REV.
STATIC_REV = re.search(r"STATIC_REV = '([^']+)'", (LM / "src/engine/staticLayers.js").read_text()).group(1)
YEAR = "public, max-age=31536000, immutable"


def remote(key):
    try:
        return s3.head_object(Bucket=store.bucket(), Key=key)
    except Exception:
        return None


for f in sorted(dist.glob("*.pmtiles")):
    key = f"static/{f.name}"
    head = remote(key)
    if head and head["ContentLength"] == f.stat().st_size:
        if head.get("CacheControl") != YEAR or head.get("Metadata", {}).get("rev") != STATIC_REV:
            # same file, older cache settings: rewrite its headers in place (no re-upload)
            s3.copy_object(Bucket=store.bucket(), Key=key, CopySource={"Bucket": store.bucket(), "Key": key},
                           MetadataDirective="REPLACE", ContentType="application/vnd.pmtiles",
                           CacheControl=YEAR, Metadata={"rev": STATIC_REV})
            log(f"{key} unchanged; cache headers updated (rev {STATIC_REV})")
        else:
            log(f"{key} already up to date")
        continue
    if head and head.get("Metadata", {}).get("rev") == STATIC_REV:
        sys.exit(f"{key} changed but STATIC_REV is still '{STATIC_REV}'. Bump STATIC_REV in "
                 "src/engine/staticLayers.js, rebuild the page (npm run build:page) and publish again.")
    s3.upload_file(str(f), store.bucket(), key,
                   ExtraArgs={"ContentType": "application/vnd.pmtiles", "CacheControl": YEAR, "Metadata": {"rev": STATIC_REV}})
    log(f"uploaded {key} ({f.stat().st_size / 1e6:.1f} MB, rev {STATIC_REV})")

# The built map page (npm run build:page → copied into static-build/proto/) goes to map/,
# which the gatekeeper (gate/worker.js, map.finfindr.app) serves to pass holders only.
proto = HERE / "proto"
for prefix in ("map",):
    for f in sorted(p for p in proto.rglob("*") if p.is_file()):
        key = f"{prefix}/" + f.relative_to(proto).as_posix()
        kind = mimetypes.guess_type(f.name)[0] or "application/octet-stream"
        if f.suffix == ".js":
            kind = "text/javascript"
        # index.html is opened with a fresh pass each time; the scripts it loads carry a
        # content hash (?v=…, added by build.mjs), so they can be kept for a year
        cache = "public, max-age=60" if f.name == "index.html" else YEAR
        s3.upload_file(str(f), store.bucket(), key, ExtraArgs={"ContentType": kind, "CacheControl": cache})
        log(f"uploaded {key}")

# Only after the page is live: tell the data job which frame encodings this page
# decodes (src/engine/frames.js FRAME_ENCODINGS). The job reads this before every
# run and never publishes a format the live page cannot read.
encodings = re.search(r"FRAME_ENCODINGS = \[([^\]]*)\]", (LM / "src/engine/frames.js").read_text())
caps = {"frameEncodings": re.findall(r"'([\w-]+)'", encodings.group(1)) if encodings else ["u8"],
        "features": list(PAGE_FEATURES)}
if not (proto / "app.js").exists():
    sys.exit("static-build/proto/app.js missing — build the page and copy dist/* into proto/ first")
store.put(s3, PAGE_CAPABILITIES_KEY, json.dumps(caps).encode(), "no-store")
log(f"uploaded {PAGE_CAPABILITIES_KEY} {caps}")
log("done — for a phone-browser test link run: python3 static-build/test_pass.py")
