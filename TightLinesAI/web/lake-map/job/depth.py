#!/usr/bin/env python3
"""Build 3-hourly NOAA water-temperature frames below the surface.

The surface run is already public before this job starts. This producer reads
that immutable run pointer, builds a separate ``runs/tdepth-*`` tree, and
writes ``runs/tdepth/latest.json`` last. Any failure therefore leaves both the
surface forecast and the previous complete depth forecast untouched.
"""
from __future__ import annotations

import argparse
import errno
import http.client
import json
import os
import re
import socket
import sys
import time
import urllib.error
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np

sys.path.insert(0, str(Path(__file__).resolve().parent))
from build import C_TO_F, ENV_KEYS, Log, TemperatureIntegrityError, iso, load_env_file, load_observation_sites  # noqa: E402
from lakemap import depth as depth_math, ofs, store  # noqa: E402
from lakemap.config import (DEPTH_STEP_HOURS, DOMAIN, EXTEND_CELLS, FORMAT_VERSION, GEO_PATH, OFS_MODELS,  # noqa: E402
                            PAGE_CAPABILITIES_KEY, TEMP, TEMP16, TEMP_DEPTHS_FT)
from lakemap.encode import scalar_png  # noqa: E402
from lakemap.regrid import combine, target_mask, water_mask  # noqa: E402

DEPTH_POINTER_KEY = "runs/tdepth/latest.json"
MIN_DEPTH_COVERAGE = 0.97
DEPTH_SOURCES = {
    "thredds": "NOAA GLOFS regular-grid fixed z-levels (THREDDS)",
    "nodd": "NOAA GLOFS native sigma layers (NODD AWS)",
}
PRODUCTION_BUCKET = "piercast-lake-map"
DEPTH_REQUEST_ATTEMPTS = 4
DEPTH_RETRY_BASE_SECONDS = 1.0


class DepthSourceFailure(RuntimeError):
    """One coherent NOAA distribution could not produce a complete run."""

    def __init__(self, distribution, detail):
        self.distribution = distribution
        super().__init__(f"{distribution} source failed: {detail}")


def capabilities_allow_depth(caps) -> bool:
    return isinstance(caps, dict) and isinstance(caps.get("features"), list) and "tempDepth" in caps["features"]


def choose_depth_grid(requested: str, caps, log):
    if requested == "u8":
        return TEMP
    encodings = caps.get("frameEncodings") if isinstance(caps, dict) else None
    if requested == "rgb16" and not (isinstance(encodings, list) and "rgb16" in encodings):
        raise TemperatureIntegrityError("requested rgb16 but the staged page does not declare support")
    if requested == "rgb16" or (requested == "auto" and isinstance(encodings, list) and "rgb16" in encodings):
        log("Depth frames: 0.05 °F rgb16")
        return TEMP16
    log("Depth frames: 0.2 °F u8 fallback")
    return TEMP


def parse_depths(value: str | None) -> tuple[int, ...]:
    depths = TEMP_DEPTHS_FT if value is None else tuple(int(part.strip()) for part in value.split(",") if part.strip())
    if not depths or len(set(depths)) != len(depths) or tuple(sorted(depths)) != depths:
        raise ValueError("depths must be a non-empty, unique, increasing comma-separated list")
    unsupported = [depth for depth in depths if depth not in TEMP_DEPTHS_FT]
    if unsupported:
        raise ValueError(f"unsupported depth(s): {unsupported}; launch depths: {TEMP_DEPTHS_FT}")
    return depths


def validate_surface_latest(latest) -> tuple[str, datetime, dict]:
    if not isinstance(latest, dict):
        raise TemperatureIntegrityError("surface latest.json is missing")
    run = latest.get("run")
    base = latest.get("base")
    if not isinstance(run, str) or not re.fullmatch(r"[A-Za-z0-9._-]+", run) or base != f"runs/{run}/":
        raise TemperatureIntegrityError("surface latest.json has an unsafe run/base")
    try:
        cycle = datetime.fromisoformat(str(latest["cycle"]).replace("Z", "+00:00")).astimezone(timezone.utc)
    except (KeyError, ValueError) as err:
        raise TemperatureIntegrityError("surface latest.json has an invalid cycle") from err
    inputs = latest.get("inputs", {}).get("temp")
    required = {model["id"] for model in OFS_MODELS}
    if not isinstance(inputs, dict) or set(inputs) != required:
        raise TemperatureIntegrityError("surface latest.json does not name all NOAA model cycles")
    cycles = {}
    for model_id, value in inputs.items():
        try:
            parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00")).astimezone(timezone.utc)
        except ValueError as err:
            raise TemperatureIntegrityError(f"surface cycle for {model_id} is invalid") from err
        cycles[model_id] = parsed
    if set(cycles.values()) != {cycle}:
        raise TemperatureIntegrityError("surface run mixes NOAA model cycles")
    return run, cycle, cycles


def depth_run_name(surface_run: str, distribution="thredds") -> str:
    """Immutable producer run; source suffix prevents forced staging collisions."""
    if distribution not in DEPTH_SOURCES:
        raise ValueError(f"unsupported depth distribution {distribution!r}")
    return f"tdepth-{surface_run}-{distribution}"


def depth_manifest(surface_run, cycle, generated_at, depth_ft, grid, frames, distribution="thredds"):
    return {
        "formatVersion": FORMAT_VERSION,
        "sample": False,
        "run": surface_run,
        "cycle": iso(cycle),
        "generatedAt": iso(generated_at),
        "domain": DOMAIN,
        "grids": {"temp": grid.manifest()},
        "frames": frames,
        "depth": None,
        "events": None,
        "depthFt": depth_ft,
        "depthM": round(float(depth_math.feet_to_m(depth_ft)), 4),
        "source": DEPTH_SOURCES[distribution],
        "sourceDistribution": distribution,
        "stepHours": DEPTH_STEP_HOURS,
        "note": "Modeled by NOAA. Temperatures below the surface are estimates.",
    }


def depth_pointer(surface_run, cycle, generated_at, depths_ft, grid, distribution="thredds"):
    return {
        "formatVersion": FORMAT_VERSION,
        "run": surface_run,
        "cycle": iso(cycle),
        "base": f"runs/{depth_run_name(surface_run, distribution)}/",
        "depthsFt": list(depths_ft),
        "stepHours": DEPTH_STEP_HOURS,
        "encoding": grid.encoding,
        "sourceDistribution": distribution,
        "generatedAt": iso(generated_at),
    }


def validate_depth_coverage(values, expected, context):
    expected = np.asarray(expected, bool)
    count = int(expected.sum())
    if count <= 0:
        raise TemperatureIntegrityError(f"{context} has no expected deep-water cells")
    coverage = float(np.isfinite(np.asarray(values)[expected]).sum()) / count
    if coverage < MIN_DEPTH_COVERAGE:
        raise TemperatureIntegrityError(
            f"{context} coverage {coverage:.1%} is below {MIN_DEPTH_COVERAGE:.0%}"
        )
    return coverage


def validate_uniform_depth_distribution(sources, distribution):
    actual = {source["lm"].distribution for source in sources}
    expected = {
        "thredds": ofs.THREDDS_DISTRIBUTION,
        "nodd": ofs.NODD_DISTRIBUTION,
    }[distribution]
    if actual != {expected}:
        raise TemperatureIntegrityError(f"mixed depth sources are refused: {sorted(actual)}")


def is_transient_download_error(err):
    """Only retry transport failures that can plausibly succeed unchanged."""
    seen = set()
    current = err
    while current is not None and id(current) not in seen:
        seen.add(id(current))
        if isinstance(current, (http.client.IncompleteRead, http.client.RemoteDisconnected,
                                ConnectionResetError, ConnectionAbortedError, BrokenPipeError,
                                TimeoutError, socket.timeout, urllib.error.URLError)):
            return True
        if isinstance(current, urllib.error.HTTPError) and (current.code == 429 or current.code >= 500):
            return True
        if isinstance(current, ofs.net.HttpError) and (current.status == 429 or current.status >= 500):
            return True
        if isinstance(current, OSError) and current.errno in {
            errno.ECONNABORTED, errno.ECONNRESET, errno.ETIMEDOUT, errno.EPIPE,
        }:
            return True
        current = current.__cause__ or current.__context__
    return False


def fetch_depth_with_retry(source, hour, depths_ft, distribution, log,
                           attempts=DEPTH_REQUEST_ATTEMPTS,
                           base_delay=DEPTH_RETRY_BASE_SECONDS, sleep=time.sleep):
    """Fetch one model/hour request with bounded, logged exponential backoff."""
    model_id = source["model"]["id"]
    for attempt in range(1, attempts + 1):
        try:
            # Own the retries here so every backoff is visible in the job log.
            return source["lm"].depth_temperatures_c(
                hour, depths_ft, request_retries=1
            )
        except Exception as err:
            if not is_transient_download_error(err) or attempt == attempts:
                raise DepthSourceFailure(
                    distribution,
                    f"{model_id} f{hour:03d} after {attempt} attempt(s): {ofs.net.redact(err)}",
                ) from err
            delay = base_delay * (2 ** (attempt - 1))
            log(
                f"Retrying {distribution} {model_id} f{hour:03d} after "
                f"{type(err).__name__}: attempt {attempt + 1}/{attempts} in {delay:g} s"
            )
            sleep(delay)


def validate_depth_run_distribution(run_dir: Path, pointer: dict):
    """Refuse upload unless every artifact names the pointer's one source."""
    distribution = pointer.get("sourceDistribution")
    if distribution not in DEPTH_SOURCES:
        raise TemperatureIntegrityError("depth pointer has no valid source distribution")
    records = [json.loads((run_dir / "verification.json").read_text()),
               json.loads((run_dir / "timing.json").read_text())]
    records.extend(
        json.loads(path.read_text())
        for path in sorted(run_dir.glob("d[0-9][0-9][0-9]/manifest.json"))
    )
    actual = {record.get("sourceDistribution") for record in records}
    if actual != {distribution}:
        raise TemperatureIntegrityError(
            f"mixed depth output is refused: pointer={distribution}, artifacts={sorted(map(str, actual))}"
        )


def _sample_frame(frame, site, radius=4):
    col = int(round((site["lon"] - DOMAIN["west"]) / TEMP.res))
    row = int(round((DOMAIN["north"] - site["lat"]) / TEMP.res))
    x0, x1 = max(0, col - radius), min(TEMP.width, col + radius + 1)
    y0, y1 = max(0, row - radius), min(TEMP.height, row + radius + 1)
    if x0 >= x1 or y0 >= y1:
        return None
    ys, xs = np.nonzero(np.isfinite(frame[y0:y1, x0:x1]))
    if not len(ys):
        return None
    distances = (ys + y0 - row) ** 2 + (xs + x0 - col) ** 2
    index = int(np.argmin(distances))
    return round(float(frame[y0 + int(ys[index]), x0 + int(xs[index])]), 2)


def upload_depth_run(s3, run_dir: Path, pointer: dict):
    """Upload immutable data first and the mutable pointer strictly last."""
    validate_depth_run_distribution(run_dir, pointer)
    started = time.monotonic()
    base = pointer["base"]
    depth_dirs = sorted(path for path in run_dir.glob("d[0-9][0-9][0-9]") if path.is_dir())
    for directory in depth_dirs:
        for path in sorted((directory / "temp").glob("*.png")):
            store.put(s3, base + path.relative_to(run_dir).as_posix(), path.read_bytes(), store.IMMUTABLE)
    for directory in depth_dirs:
        path = directory / "manifest.json"
        store.put(s3, base + path.relative_to(run_dir).as_posix(), path.read_bytes(), store.IMMUTABLE)
    path = run_dir / "verification.json"
    store.put(s3, base + path.name, path.read_bytes(), store.IMMUTABLE)
    upload_seconds = time.monotonic() - started
    timing_path = run_dir / "timing.json"
    timing = json.loads(timing_path.read_text())
    timing["uploadSeconds"] = round(upload_seconds, 1)
    timing_path.write_text(json.dumps(timing, separators=(",", ":")))
    store.put(s3, base + timing_path.name, timing_path.read_bytes(), store.IMMUTABLE)
    store.put(s3, DEPTH_POINTER_KEY, json.dumps(pointer, separators=(",", ":")).encode(), store.SHORT)
    return upload_seconds


def build_depth_run(surface_run, cycle, cycles, depths_ft, grid, out, log, workers=4,
                    distribution="thredds"):
    hours = list(range(0, 121, DEPTH_STEP_HOURS))
    water = water_mask(TEMP, GEO_PATH)
    targets = target_mask(water, EXTEND_CELLS)
    try:
        sources = ofs.prepare_regridders(cycles, TEMP, targets, water, log, distribution=distribution)
    except Exception as err:
        raise DepthSourceFailure(distribution, f"model setup: {ofs.net.redact(err)}") from err
    if len(sources) != len(OFS_MODELS):
        raise TemperatureIntegrityError("not every NOAA lake model could be prepared")
    validate_uniform_depth_distribution(sources, distribution)

    depths_m = depth_math.feet_to_m(depths_ft)
    for source in sources:
        source["expectedNative"] = [depth_math.expected_cells(source["lm"].depth_m, z) for z in depths_m]
        source["expectedGrid"] = []
        source["coverageMin"] = [1.0] * len(depths_ft)
        for expected in source["expectedNative"]:
            mapped = source["rg"].apply(np.where(expected, 1.0, np.nan).astype(np.float32))
            source["expectedGrid"].append(np.isfinite(mapped) & water)

    run_dir = Path(out) / "runs" / depth_run_name(surface_run, distribution)
    for depth_ft in depths_ft:
        (run_dir / f"d{depth_ft:03d}" / "temp").mkdir(parents=True, exist_ok=True)

    sites = load_observation_sites()
    verification_sites = {
        site["key"]: {
            **{key: value for key, value in site.items() if key != "key"},
            "hours": {str(depth_ft): [] for depth_ft in depths_ft},
        }
        for site in sites
    }
    manifest_frames = {depth_ft: [] for depth_ft in depths_ft}
    sizes = {depth_ft: [] for depth_ft in depths_ft}
    download_bytes = 0
    download_seconds = 0.0
    encode_seconds = 0.0

    def fetch(source, hour):
        values, byte_count = fetch_depth_with_retry(
            source, hour, depths_ft, distribution, log
        )
        return source, values, byte_count

    for frame_number, hour in enumerate(hours, 1):
        started = time.monotonic()
        with ThreadPoolExecutor(min(workers, len(sources))) as pool:
            fetched = list(pool.map(lambda source: fetch(source, hour), sources))
        download_seconds += time.monotonic() - started
        download_bytes += sum(item[2] for item in fetched)
        depth_grids = [[] for _ in depths_ft]
        depth_qualities = [[] for _ in depths_ft]
        try:
            for source, values, _ in fetched:
                if values.shape != (len(depths_ft), len(source["lm"].lat)):
                    raise TemperatureIntegrityError(
                        f"{source['model']['id']} f{hour:03d} returned an unsafe depth shape"
                    )
                for index, depth_ft in enumerate(depths_ft):
                    expected_native = source["expectedNative"][index]
                    context = f"{source['model']['id']} f{hour:03d} {depth_ft} ft source"
                    native_coverage = validate_depth_coverage(values[index], expected_native, context)
                    mapped = source["rg"].apply(C_TO_F(values[index]))
                    expected_grid = source["expectedGrid"][index]
                    context = f"{source['model']['id']} f{hour:03d} {depth_ft} ft map"
                    grid_coverage = validate_depth_coverage(mapped, expected_grid, context)
                    source["coverageMin"][index] = min(
                        source["coverageMin"][index], native_coverage, grid_coverage
                    )
                    depth_grids[index].append(mapped)
                    depth_qualities[index].append(source["q"])
        except TemperatureIntegrityError as err:
            raise DepthSourceFailure(distribution, err) from err

        encode_started = time.monotonic()
        for index, depth_ft in enumerate(depths_ft):
            frame = combine(depth_grids[index], depth_qualities[index])
            frame = depth_math.extend_onto_land(frame, water, EXTEND_CELLS)
            frame[~targets] = np.nan
            name = f"{hour:03d}.png"
            blob = scalar_png(frame, grid)
            (run_dir / f"d{depth_ft:03d}" / "temp" / name).write_bytes(blob)
            sizes[depth_ft].append(len(blob))
            manifest_frames[depth_ft].append({"hour": hour, "validTime": iso(cycle + timedelta(hours=hour)),
                                               "temp": f"temp/{name}"})
            for site in sites:
                verification_sites[site["key"]]["hours"][str(depth_ft)].append(_sample_frame(frame, site))
        encode_seconds += time.monotonic() - encode_started
        log(f"Depth f{hour:03d}: {frame_number}/{len(hours)} complete")

    generated_at = datetime.now(timezone.utc)
    for depth_ft in depths_ft:
        manifest = depth_manifest(surface_run, cycle, generated_at, depth_ft, grid,
                                  manifest_frames[depth_ft], distribution)
        (run_dir / f"d{depth_ft:03d}" / "manifest.json").write_text(json.dumps(manifest, separators=(",", ":")))
    verification = {
        "formatVersion": 1,
        "purpose": "validation-only",
        "correctionApproved": False,
        "run": surface_run,
        "cycle": iso(cycle),
        "generatedAt": iso(generated_at),
        "unit": "F",
        "depthsFt": list(depths_ft),
        "stepHours": DEPTH_STEP_HOURS,
        "sourceDistribution": distribution,
        "sites": verification_sites,
    }
    (run_dir / "verification.json").write_text(json.dumps(verification, separators=(",", ":")))
    frame_sizes = {
        str(depth_ft): {"frames": len(values), "largestBytes": max(values), "totalBytes": sum(values)}
        for depth_ft, values in sizes.items()
    }
    timing = {
        "downloadSeconds": round(download_seconds, 1),
        "downloadBytes": download_bytes,
        "encodeSeconds": round(encode_seconds, 1),
        "frameSizes": frame_sizes,
        "sourceDistribution": distribution,
    }
    (run_dir / "timing.json").write_text(json.dumps(timing, separators=(",", ":")))
    pointer = depth_pointer(surface_run, cycle, generated_at, depths_ft, grid, distribution)
    pointer_path = Path(out) / DEPTH_POINTER_KEY
    pointer_path.parent.mkdir(parents=True, exist_ok=True)
    pointer_path.write_text(json.dumps(pointer, separators=(",", ":")))
    for source in sources:
        summary = ", ".join(f"{depth_ft} ft {source['coverageMin'][index]:.1%}"
                            for index, depth_ft in enumerate(depths_ft))
        log(f"{source['model']['id']} minimum depth coverage: {summary}")
    log(f"NOAA depth download: {download_bytes / 1024 / 1024:.1f} MiB in {download_seconds:.1f} s")
    log(f"Depth frame sizes: {frame_sizes}")
    return run_dir, pointer, timing


def build_depth_with_fallback(surface_run, cycle, cycles, depths_ft, grid, out, log,
                              workers=4, distribution="thredds"):
    """Build from one coherent source, then restart wholly on the alternate."""
    try:
        result = build_depth_run(
            surface_run, cycle, cycles, depths_ft, grid, out, log, workers, distribution
        )
        return (*result, distribution)
    except DepthSourceFailure as first:
        alternate = "nodd" if distribution == "thredds" else "thredds"
        log(f"{first}; discarding that local build before considering {alternate}")
        try:
            selected = ofs.select_depth_distribution(cycles, requested=alternate)
        except Exception as err:
            raise DepthSourceFailure(
                distribution,
                f"fallback {alternate} is not complete and validated: {ofs.net.redact(err)}",
            ) from err
        if selected != alternate:
            raise DepthSourceFailure(distribution, f"fallback selected unexpected source {selected}")
        log(f"Rebuilding ALL depth frames from validated {alternate}; sources will not be mixed")
        try:
            result = build_depth_run(
                surface_run, cycle, cycles, depths_ft, grid, out, log, workers, alternate
            )
            return (*result, alternate)
        except DepthSourceFailure as second:
            raise DepthSourceFailure(
                alternate, f"both coherent sources failed ({first}; {second})"
            ) from second


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="out-depth")
    parser.add_argument("--upload", action="store_true")
    parser.add_argument("--force", action="store_true", help="override feature/duplicate gates on non-production staging only")
    parser.add_argument("--env-file", help="read R2 credentials from this .env file")
    parser.add_argument("--depths", help="comma-separated reviewed depths; default is the shipped 10,20,30,40,50")
    parser.add_argument("--temp-encoding", choices=("auto", "u8", "rgb16"), default="auto")
    parser.add_argument("--source", choices=("auto", "thredds", "nodd"), default="auto",
                        help="one source for all four models; forcing a source is staging-only")
    parser.add_argument("--workers", type=int, default=4, help="parallel lake-model downloads per forecast hour")
    args = parser.parse_args(argv)
    log = Log()
    try:
        depths_ft = parse_depths(args.depths)
    except ValueError as err:
        parser.error(str(err))
    if args.env_file:
        load_env_file(Path(args.env_file), log)
    if not args.upload:
        log("Depth job requires --upload so it can bind to an existing surface run and capabilities file.")
        return 2
    if not all(os.environ.get(key) for key in ENV_KEYS[:3]):
        log("R2 credentials are missing — refusing to run.")
        return 2
    if args.force and store.bucket() == PRODUCTION_BUCKET:
        log("--force is staging-only and is refused for the production bucket.")
        return 2
    if args.source != "auto" and store.bucket() == PRODUCTION_BUCKET:
        log("--source is staging-only and is refused for the production bucket.")
        return 2

    s3 = store.client()
    caps = store.read_json(s3, PAGE_CAPABILITIES_KEY)
    if not capabilities_allow_depth(caps) and not args.force:
        log("Temp at depth is absent from page capabilities — exiting before any NOAA fetch.")
        return 0
    try:
        grid = choose_depth_grid(args.temp_encoding, caps, log)
        surface_latest = store.read_latest(s3)
        surface_run, cycle, cycles = validate_surface_latest(surface_latest)
        distribution = ofs.select_depth_distribution(cycles, requested=args.source)
        log(f"Depth source for all four models: {DEPTH_SOURCES[distribution]}")
    except (TemperatureIntegrityError, ofs.DepthDataUnavailable) as err:
        log(f"Depth preflight failed ({err}) — previous depth pointer is unchanged.")
        return 2
    previous = store.read_json(s3, DEPTH_POINTER_KEY)
    if (not args.force and isinstance(previous, dict) and previous.get("run") == surface_run
            and previous.get("depthsFt") == list(depths_ft) and previous.get("encoding") == grid.encoding
            and previous.get("sourceDistribution") == distribution):
        log(f"Depth data for surface run {surface_run} already exists — skipping.")
        return 0

    try:
        run_dir, pointer, _timing, used_distribution = build_depth_with_fallback(
            surface_run, cycle, cycles, depths_ft, grid,
            Path(args.out), log, args.workers, distribution
        )
        if used_distribution != distribution:
            log(f"Depth fallback completed from {DEPTH_SOURCES[used_distribution]}")
        upload_seconds = upload_depth_run(s3, run_dir, pointer)
        log(f"Uploaded complete depth run and wrote {DEPTH_POINTER_KEY} last in {upload_seconds:.1f} s")
    except Exception as err:
        log(f"Depth job failed ({err}) — surface and previous depth pointers are unchanged.")
        return 2
    log(f"Done in {time.time() - log.t0:.0f} s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
