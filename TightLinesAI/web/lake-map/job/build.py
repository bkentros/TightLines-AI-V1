#!/usr/bin/env python3
"""PierCast Live Lake Map data job.

Builds one complete run of map frames (frame format v1) from:
  - NOAA lake models LSOFS, LMHOFS, LEOFS, LOOFS (water temperature, depth)
  - NOAA GLWU (wave height)
  - Open-Meteo (wind over the lakes) and NOAA GFS (wind for the wider map area)
then detects cold-water surges / warm-water pushes at every pier with the
shared rule in src/engine/signals.js, and optionally uploads to Cloudflare R2.

  python job/build.py --out /tmp/lakemap            # build only
  python job/build.py --out /tmp/lakemap --upload   # build and publish
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lakemap import gfs, net, ofs, store, waves, wind  # noqa: E402
from lakemap.config import (DEPTH, DOMAIN, EXTEND_CELLS, FORMAT_VERSION, GEO_PATH, GEO_VERSION,  # noqa: E402
                            HOURS, OFS_MODELS, PIERS_PATH, SIGNALS_EVENTS_SCRIPT, TEMP, WAVES, WIND)
from lakemap.encode import scalar_png, wind_png  # noqa: E402
from lakemap.regrid import Regridder, combine, fill_nearest, target_mask, water_mask  # noqa: E402

C_TO_F = lambda c: c * 9 / 5 + 32  # noqa: E731
M_TO_FT = 3.28084


class Log:
    def __init__(self):
        self.t0 = time.time()
        self.steps = {}

    def __call__(self, msg):
        print(f"[{time.time() - self.t0:6.1f}s] {msg}", flush=True)

    def mark(self, name):
        self.steps[name] = round(time.time() - self.t0, 1)


def iso(t: datetime) -> str:
    return t.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def build_temperature(cycles, t0, log, workers):
    """Hourly water temperature (°F) on the 0.02° grid, plus depth (ft)."""
    water = water_mask(TEMP, GEO_PATH)
    targets = target_mask(water, EXTEND_CELLS)
    sources = []
    for m in OFS_MODELS:
        cyc = cycles.get(m["id"])
        if cyc is None:
            log(f"{m['id']}: no published cycle — its lakes are left empty")
            continue
        lm = ofs.LakeModel(m, cyc)
        rg = Regridder(lm.lon, lm.lat, TEMP, targets, radius=0.3, max_edge=4 * max(lm.spacing, 0.005))
        offset = int(round((t0 - cyc).total_seconds() / 3600))
        sources.append({"model": m, "lm": lm, "rg": rg, "offset": offset, "q": rg.quality_grid()})
        log(f"{m['id']}: cycle {iso(cyc)} (+{offset} h), {len(lm.lat):,} water points")

    def fetch(src):
        need = [h + src["offset"] for h in range(HOURS) if h + src["offset"] <= 120]
        src["hours"] = ofs.fetch_all_hours(src["lm"], need, workers=workers)
        log(f"{src['model']['id']}: {len(src['hours'])}/{len(need)} hours downloaded")
    with ThreadPoolExecutor(len(sources) or 1) as pool:
        list(pool.map(fetch, sources))

    frames = []
    for h in range(HOURS):
        grids, quals = [], []
        for src in sources:
            vals = src["hours"].get(h + src["offset"])
            if vals is None:
                continue
            grids.append(src["rg"].apply(C_TO_F(vals)))
            quals.append(src["q"])
        g = combine(grids, quals) if grids else np.full((TEMP.height, TEMP.width), np.nan, np.float32)
        g = fill_nearest(g, targets, EXTEND_CELLS)
        g[~targets] = np.nan
        frames.append(g)

    depth = None
    if sources:
        dg = [s["rg"].apply(s["lm"].depth_m * M_TO_FT) for s in sources]
        depth = fill_nearest(combine(dg, [s["q"] for s in sources]), targets, EXTEND_CELLS)
        depth[~targets] = np.nan
    info = [{"model": s["model"]["id"], "lakes": s["model"]["lakes"], "cycle": iso(s["lm"].cycle),
             "hoursBehind": s["offset"], "hoursReceived": len(s["hours"])} for s in sources]
    return frames, depth, info


def build_waves(t0, now, log):
    water = water_mask(WAVES, GEO_PATH)
    targets = target_mask(water, 3)
    cycle, data = waves.fetch_latest(now)
    if cycle is None:
        log("GLWU: no run found — wave frames left empty")
        return [np.full((WAVES.height, WAVES.width), np.nan, np.float32)] * HOURS, None
    lat, lon, hours = waves.decode(data)
    rg = Regridder(lon, lat, WAVES, targets, radius=0.15, max_edge=0.1)
    times = sorted(hours)
    frames = []
    for h in range(HOURS):
        valid = t0 + timedelta(hours=h)
        best = min(times, key=lambda t: abs((t - valid).total_seconds()))
        if abs((best - valid).total_seconds()) > 3 * 3600:
            frames.append(np.full((WAVES.height, WAVES.width), np.nan, np.float32))
            continue
        g = fill_nearest(rg.apply(hours[best]), targets, 3)
        g[~targets] = np.nan
        frames.append(g)
    log(f"GLWU: cycle {iso(cycle)}, {len(times)} hours, {len(lat):,} water points")
    return frames, {"model": "GLWU", "cycle": iso(cycle), "hours": len(times)}


def sample_piers(frames, piers):
    """Hourly °F at each pier: nearest modeled water value within ~5 km."""
    out = {}
    for p in piers:
        i = int(round((p["lon"] - DOMAIN["west"]) / TEMP.res))
        j = int(round((DOMAIN["north"] - p["lat"]) / TEMP.res))
        series = []
        for g in frames:
            win = g[max(0, j - 3): j + 4, max(0, i - 3): i + 4]
            ys, xs = np.nonzero(np.isfinite(win))
            if len(ys):
                k = np.argmin((ys - min(3, j)) ** 2 + (xs - min(3, i)) ** 2)
                series.append(round(float(win[ys[k], xs[k]]), 2))
            else:
                series.append(None)
        out[p["id"]] = series
    return out


ENV_KEYS = ("R2_ACCOUNT_ID", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_BUCKET", "OPEN_METEO_API_KEY")


def load_env_file(path: Path, log):
    """Reads KEY=value lines (tolerates `export`, spaces and quotes). Never prints values."""
    if not path.exists():
        log(f"{path.name}: not found")
        return
    raw = path.read_bytes()
    if raw.lstrip().startswith(b"{\\rtf"):
        log(f"{path.name} was saved as rich text by TextEdit. Re-save it as plain text (Format > Make Plain Text).")
        return
    for line in raw.decode("utf-8", "replace").splitlines():
        line = line.strip().lstrip("\ufeff")
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[7:].strip()
        m = re.match(r"^[\"'\u201c\u201d\u2018\u2019]?([A-Za-z_][A-Za-z0-9_]*)[\"'\u201c\u201d\u2018\u2019]?\s*[=:]\s*(.*)$", line)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip().strip("\u201c\u201d\u2018\u2019").strip()  # KEY=value or KEY: value
        if len(val) >= 2 and val[0] == val[-1] and val[0] in "\"'":
            val = val[1:-1]
        if key in ENV_KEYS and val and not os.environ.get(key):
            os.environ[key] = val
    for key in ENV_KEYS[:3] + ENV_KEYS[4:]:
        log(f"{key}: {'found' if os.environ.get(key) else 'missing'}")
    # If an R2 key is missing, show how the file's R2 lines look, with every value masked.
    if not all(os.environ.get(k) for k in ENV_KEYS[:3]):
        text = raw.decode("utf-8", "replace").splitlines()
        hits = [(i, l) for i, l in enumerate(text, 1) if "R2" in l.upper()]
        log(f"{path} has {len(text)} lines; lines mentioning R2: {len(hits) or 'none'}")
        for i, l in hits:
            # show only the name part and the separator; never any part of a value
            m = re.match(r"^\W*([A-Za-z_][A-Za-z0-9_]*)\W*?\s*([=:])?", l)
            name = m.group(1) if m else "?"
            sep = (m.group(2) if m else None) or "no = or :"
            log(f"  line {i}: name {name!r}, separator {sep!r}, value {len(l)} chars total (hidden)")


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default="out")
    ap.add_argument("--upload", action="store_true")
    ap.add_argument("--force", action="store_true", help="rebuild even if the inputs have not changed")
    ap.add_argument("--now", help="pretend it is this UTC time (ISO), for replays")
    ap.add_argument("--workers", type=int, default=4, help="parallel downloads per lake model")
    ap.add_argument("--env-file", help="read R2_* and OPEN_METEO_API_KEY from this .env file")
    args = ap.parse_args(argv)
    log = Log()
    if args.env_file:
        load_env_file(Path(args.env_file), log)
    if args.upload and not all(os.environ.get(k) for k in ENV_KEYS[:3]):
        log("R2 keys missing — building locally without uploading.")
        args.upload = False
    now = datetime.fromisoformat(args.now.replace("Z", "+00:00")) if args.now else datetime.now(timezone.utc)
    api_key = os.environ.get("OPEN_METEO_API_KEY") or None

    with ThreadPoolExecutor(4) as pool:
        found = dict(zip([m["id"] for m in OFS_MODELS], pool.map(lambda m: ofs.discover(m, now), OFS_MODELS)))
    cycles = {k: v for k, v in found.items() if v is not None}
    if not cycles:
        log("No NOAA lake model cycle is published yet — keeping the last good run.")
        return 2
    t0 = max(cycles.values())
    inputs = {k: iso(v) for k, v in sorted(cycles.items())}
    log(f"Run start time {iso(t0)}; models {inputs}")
    log.mark("discover")

    s3 = None
    if args.upload:
        s3 = store.client()
        latest = store.read_latest(s3)
        if latest and latest.get("inputs", {}).get("temp") == inputs and not args.force:
            age = (now - datetime.fromisoformat(latest["generatedAt"].replace("Z", "+00:00"))).total_seconds() / 3600
            if age < 6:
                log(f"Nothing new since run {latest['run']} ({age:.1f} h ago) — skipping.")
                return 0

    frames, depth, temp_info = build_temperature(cycles, t0, log, args.workers)
    log.mark("temperature")
    wave_frames, wave_info = build_waves(t0, now, log)
    log.mark("waves")
    u_lake, v_lake, calls = wind.fetch(t0, HOURS, api_key)
    log(f"Open-Meteo: {calls:,} locations ({'paid' if api_key else 'free'} endpoint)")
    try:
        u_wide, v_wide, wide_info = gfs.fetch(t0, HOURS, log)
    except Exception as err:  # never lose a run over the surrounding wind
        log(f"GFS wind unavailable ({net.redact(err)}) — extending the lake-area wind outward instead")
        u_wide = v_wide = wide_info = None
    u, v = gfs.merge(u_lake, v_lake, u_wide, v_wide)
    log.mark("wind")

    run_id = f"{t0:%Y%m%dT%H}Z-{now:%m%d%H%M}"
    out = Path(args.out)
    run_dir = out / "runs" / run_id
    for sub in ("temp", "wind", "waves"):
        (run_dir / sub).mkdir(parents=True, exist_ok=True)
    manifest_frames, sizes = [], {"temp": [], "wind": [], "waves": []}
    for h in range(HOURS):
        name = f"{h:03d}.png"
        blobs = {"temp": scalar_png(frames[h], TEMP), "wind": wind_png(u[h], v[h], WIND),
                 "waves": scalar_png(wave_frames[h], WAVES)}
        for k, b in blobs.items():
            (run_dir / k / name).write_bytes(b)
            sizes[k].append(len(b))
        manifest_frames.append({"hour": h, "validTime": iso(t0 + timedelta(hours=h)),
                                "temp": f"temp/{name}", "wind": f"wind/{name}", "waves": f"waves/{name}"})
    if depth is not None:
        (run_dir / "depth.png").write_bytes(scalar_png(depth / 1.0, DEPTH))
    log.mark("encode")

    piers = json.loads(PIERS_PATH.read_text())
    series = sample_piers(frames, piers)
    (run_dir / "series.json").write_text(json.dumps({"start": iso(t0), "unit": "F", "piers": series}))
    subprocess.run(["node", str(SIGNALS_EVENTS_SCRIPT), str(run_dir / "series.json"), str(run_dir / "events.json")], check=True)
    events = json.loads((run_dir / "events.json").read_text())
    log(f"Events: {len(events['events'])} ({', '.join(e['cityId'] + ' ' + e['kind'] for e in events['events']) or 'none'})")
    log.mark("events")

    manifest = {
        "formatVersion": FORMAT_VERSION, "sample": False, "run": run_id,
        "cycle": iso(t0), "generatedAt": iso(now), "domain": DOMAIN,
        "grids": {g.name: g.manifest() for g in (TEMP, WIND, WAVES, DEPTH)},
        "frames": manifest_frames, "depth": "depth.png" if depth is not None else None, "events": "events.json",
        "geo": f"../../static/geo-{GEO_VERSION}.json",
        "sources": {"temp": temp_info, "waves": wave_info,
                    "wind": {"source": "Open-Meteo best_match", "start": iso(t0), "locations": calls,
                             "surroundings": wide_info}},
    }
    (run_dir / "manifest.json").write_text(json.dumps(manifest, separators=(",", ":")))
    latest = {"formatVersion": FORMAT_VERSION, "run": run_id, "base": f"runs/{run_id}/", "cycle": iso(t0),
              "generatedAt": iso(now), "inputs": {"temp": inputs, "waves": wave_info and wave_info["cycle"]}}
    (out / "latest.json").write_text(json.dumps(latest))

    kb = {k: (round(max(v) / 1024, 1), round(sum(v) / 1024 / 1024, 2)) for k, v in sizes.items()}
    log(f"Frame sizes (largest KB, total MB): {kb}")

    if s3 is not None:
        store.ensure_static(s3, GEO_PATH, f"static/geo-{GEO_VERSION}.json")
        store.upload_run(s3, run_dir, run_id, latest)
        log(f"Uploaded run {run_id} and pointed latest.json at it")
        log.mark("upload")
    (run_dir / "timing.json").write_text(json.dumps(log.steps))
    log(f"Done in {time.time() - log.t0:.0f} s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
