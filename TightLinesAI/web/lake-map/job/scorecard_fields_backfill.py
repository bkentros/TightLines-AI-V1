#!/usr/bin/env python3
"""Recover private v2 uncovered surface rows from archived FVCOM fields."""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import re
import subprocess
import time
import urllib.error
import urllib.request
from collections import Counter
from concurrent.futures import ThreadPoolExecutor
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq
from botocore.exceptions import ClientError

import scorecard_addon_backfill as addon
import scorecard_public_backfill as public
import scorecard_store
from lakemap import store

UTC = timezone.utc
STREAM = "backfill_fields"
METHODOLOGY = "public-scorecard-fields-v1"
USER_AGENT = "FinFindr-scorecard-fields/1.0 (+https://finfindr.app)"


def revision() -> str:
    value = os.environ.get("GITHUB_SHA")
    if value:
        return value
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "HEAD"], text=True, stderr=subprocess.DEVNULL,
        ).strip()
    except Exception:
        return "unknown"


def marker_exists(s3, bucket: str, day_text: str) -> bool:
    key = scorecard_store.done_marker_key(STREAM, day_text, METHODOLOGY)
    try:
        s3.head_object(Bucket=bucket, Key=key)
        return True
    except ClientError as error:
        if error.response.get("ResponseMetadata", {}).get("HTTPStatusCode") == 404:
            return False
        raise


def source_marker(day_text: str) -> str:
    return scorecard_store.done_marker_key(
        "backfill", day_text, public.METHODOLOGY_VERSION,
    )


def read_source_rows(s3, bucket: str, day_text: str) -> tuple[list[dict], dict]:
    marker = json.loads(
        s3.get_object(Bucket=bucket, Key=source_marker(day_text))["Body"].read()
    )
    body = s3.get_object(Bucket=bucket, Key=marker["fragmentKey"])["Body"].read()
    return pq.read_table(pa.BufferReader(body)).to_pylist(), marker


def nowcast_request(observation_time: str) -> tuple[datetime, datetime, int]:
    """Return nearest valid hour, enclosing six-hour cycle, and n001..n006 slot."""
    observed = public.parse_time(observation_time)
    valid = (observed + timedelta(minutes=30)).replace(minute=0, second=0, microsecond=0)
    delta = (6 - valid.hour % 6) % 6
    cycle = valid + timedelta(hours=delta)
    slot = 6 - delta
    return valid, cycle, slot


class ArchivedFieldSampler:
    def __init__(self, cache: Path):
        self.cache = cache
        self.cache.mkdir(parents=True, exist_ok=True)
        self.geometry = public.PublicModelSampler(cache / "geometry")
        self.values: dict[tuple, float | None] = {}
        self.value_sources: dict[tuple, str | None] = {}
        self.fetch_errors = 0
        self.failure_counts = Counter()
        self.archive_missing = 0
        self.missing_counts = Counter()
        self.ncei_file_states = {}

    @staticmethod
    def filename(model: str, cycle: datetime, slot: int) -> str:
        product = f"fields.n{slot:03d}"
        if cycle >= public.CURRENT_MODEL_START:
            return f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.{product}.nc"
        return f"nos.{model}.{product}.{cycle:%Y%m%d}.t{cycle:%H}z.nc"

    def locate(self, model: str, cycle: datetime, lat: float, lon: float):
        grid = self.geometry.grid(model, cycle, "native")
        if grid is None:
            return None
        query = (lat, lon * math.cos(math.radians(lat)))
        _, position = grid["tree"].query(query)
        node = int(grid["indices"][int(position)])
        model_lat, model_lon = float(grid["lat"][node]), float(grid["lon"][node])
        distance = public.verify.distance_km(
            {"lat": lat, "lon": lon}, {"lat": model_lat, "lon": model_lon},
        )
        if distance > public.verify.MAX_MODEL_CELL_DISTANCE_KM:
            return None
        return node, model_lat, model_lon, distance

    @staticmethod
    def nodd_key(model: str, cycle: datetime, slot: int) -> str:
        directory = cycle.strftime("%Y/%m/%d") if cycle.year >= 2025 else cycle.strftime("%Y%m")
        return (f"{model}/netcdf/{directory}/"
                f"{model}.t{cycle:%H}z.{cycle:%Y%m%d}.fields.n{slot:03d}.nc")

    def _nodd_value(self, model: str, cycle: datetime, slot: int, node: int):
        key = self.nodd_key(model, cycle, slot)
        if not self.geometry.fs.exists(f"noaa-nos-ofs-pds/{key}"):
            return None, "not_found"
        stream, dataset = self.geometry._open(key)
        if dataset is None:
            return None, "open_error"
        try:
            result = float(self.geometry._variable(dataset, "temp")[0, 0, node])
            return (result, "ok") if math.isfinite(result) else (None, "invalid_value")
        except Exception as error:
            return None, type(error).__name__
        finally:
            dataset.close(); stream.close()

    def _ncei_file_exists(self, model: str, cycle: datetime, slot: int):
        """Return True/False for a conclusive HEAD, or None for a HEAD failure."""
        cache_key = (model, cycle, slot)
        if cache_key in self.ncei_file_states:
            return self.ncei_file_states[cache_key]
        root = public.NCEI_ROOTS[model]
        url = (f"https://www.ncei.noaa.gov/thredds/fileServer/{root}/{cycle:%Y/%m}/"
               f"{self.filename(model, cycle, slot)}")
        try:
            request = urllib.request.Request(url, method="HEAD", headers={"user-agent": USER_AGENT})
            with urllib.request.urlopen(request, timeout=45):
                result = True
        except urllib.error.HTTPError as error:
            result = False if error.code == 404 else None
        except Exception:
            result = None
        self.ncei_file_states[cache_key] = result
        return result

    def value_with_source(self, request: tuple[str, datetime, int, int]):
        if request in self.values:
            return self.values[request], self.value_sources.get(request)
        model, cycle, slot, node = request
        cache_file = self.cache / "values" / model / f"{cycle:%Y%m%d%H}-n{slot:03d}-{node}.json"
        if cache_file.exists():
            try:
                payload = json.loads(cache_file.read_text())
                result, source = float(payload["value"]), str(payload["source"])
                self.values[request] = result
                self.value_sources[request] = source
                return result, source
            except (ValueError, TypeError, KeyError, json.JSONDecodeError):
                pass
        root = public.NCEI_ROOTS[model]
        name = self.filename(model, cycle, slot)
        constraint = f"temp[0:1:0][0:1:0][{node}:1:{node}]"
        url = (f"https://www.ncei.noaa.gov/thredds/dodsC/{root}/{cycle:%Y/%m}/"
               f"{name}.ascii?{constraint}")
        result = None
        source = None
        failed = False
        ncei_category = "no_value"
        for attempt in range(3):
            try:
                request_object = urllib.request.Request(url, headers={"user-agent": USER_AGENT})
                with urllib.request.urlopen(request_object, timeout=90) as response:
                    text = response.read().decode("utf-8", "replace")
                found = re.findall(
                    r"\]\s*,\s*(-?[0-9]+(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?)", text,
                )
                if found:
                    result = float(found[-1])
                    source = "ncei"
                    ncei_category = "ok"
                    break
                failed = True
                ncei_category = "parse_empty"
            except urllib.error.HTTPError as error:
                failed = True
                ncei_category = f"http_{error.code}"
                if 400 <= error.code < 500:
                    break
            except Exception as error:
                failed = True
                ncei_category = type(error).__name__
            if attempt < 2:
                time.sleep(attempt + 1)
        if result is None:
            result, nodd_category = self._nodd_value(model, cycle, slot, node)
            source = "nodd" if result is not None else None
        else:
            nodd_category = "not_needed"
        if result is None and failed:
            key = (f"{model}:{cycle:%Y-%m-%dT%H}:n{slot:03d}:"
                   f"ncei={ncei_category}:nodd={nodd_category}")
            # NCEI's OPeNDAP endpoint returns HTTP 500 for files that are not
            # present in its catalog. A conclusive fileServer 404 together
            # with a missing NODD object is a real archive gap, not a fetch
            # failure. Any ambiguous or existing-file failure remains fatal.
            if nodd_category == "not_found" and self._ncei_file_exists(model, cycle, slot) is False:
                self.archive_missing += 1
                self.missing_counts[key] += 1
            else:
                self.fetch_errors += 1
                self.failure_counts[key] += 1
        if result is not None:
            cache_file.parent.mkdir(parents=True, exist_ok=True)
            cache_file.write_text(json.dumps({"source": source, "value": result}, sort_keys=True) + "\n")
        self.values[request] = result
        self.value_sources[request] = source
        return result, source

    def value(self, request: tuple[str, datetime, int, int]) -> float | None:
        return self.value_with_source(request)[0]


def field_bracket(observation_time: str):
    """Return archived field requests bracketing the exact observation time."""
    observed = public.parse_time(observation_time)
    lower = observed.replace(minute=0, second=0, microsecond=0)
    upper = lower if observed == lower else lower + timedelta(hours=1)
    lower_valid, lower_cycle, lower_slot = nowcast_request(public.iso(lower))
    upper_valid, upper_cycle, upper_slot = nowcast_request(public.iso(upper))
    fraction = (observed - lower).total_seconds() / 3600
    return observed, (lower_valid, lower_cycle, lower_slot), (
        upper_valid, upper_cycle, upper_slot), fraction


def candidates(rows: list[dict], sampler: ArchivedFieldSampler):
    output = []
    for row in rows:
        if row.get("pair_status") != "uncovered":
            continue
        depth = row.get("sensor_depth_m")
        lat, lon = row.get("station_lat"), row.get("station_lon")
        model = public.MODELS.get(row.get("waterbody"))
        if not (isinstance(depth, (int, float)) and depth <= 1.5 and model and
                isinstance(lat, (int, float)) and math.isfinite(lat) and
                isinstance(lon, (int, float)) and math.isfinite(lon)):
            continue
        observed, lower, upper, fraction = field_bracket(row["observation_time"])
        location = sampler.locate(model, lower[1], float(lat), float(lon))
        if location is None:
            continue
        node, model_lat, model_lon, distance = location
        output.append((row, model, observed, lower, upper, fraction, node,
                       model_lat, model_lon, distance))
    return output


def recover(rows: list[dict], sampler: ArchivedFieldSampler) -> tuple[list[dict], int]:
    selected = candidates(rows, sampler)
    requests = []
    for _, model, _, lower, upper, _, node, *_ in selected:
        requests.append((model, lower[1], lower[2], node))
        requests.append((model, upper[1], upper[2], node))
    unique_requests = list(dict.fromkeys(requests))
    with ThreadPoolExecutor(max_workers=8) as executor:
        sampled = list(executor.map(sampler.value_with_source, unique_requests))
    lookup = dict(zip(unique_requests, sampled))
    values = [lookup[request] for request in requests]
    recovered = []
    for index, item in enumerate(selected):
        (lower_c, lower_source), (upper_c, upper_source) = values[index * 2:index * 2 + 2]
        if (lower_c is None or upper_c is None or not math.isfinite(lower_c)
                or not math.isfinite(upper_c)):
            continue
        row, model, observed, lower, upper, fraction, _, model_lat, model_lon, distance = item
        value_c = lower_c + (upper_c - lower_c) * fraction
        if not math.isfinite(value_c) or not -2 <= value_c <= 40:
            continue
        logical_cycle = observed
        archive_cycle = max(lower[1], upper[1])
        result = dict(row)
        result.update({
            # This research stream represents a lead-zero estimate at the
            # observation instant. run_id preserves the physical archives
            # used to interpolate that estimate.
            "model_cycle": public.iso(logical_cycle),
            "model_issued_at": public.iso(archive_cycle),
            "valid_time": public.iso(observed),
            "lead_hours": 0.0,
            "lower_model_hour": 0,
            "upper_model_hour": 0,
            "time_interpolation_fraction": 0.0,
            "run_id": (f"field-nowcast/{model}/"
                       f"{lower[1]:%Y%m%d%H}n{lower[2]:03d}-"
                       f"{upper[1]:%Y%m%d%H}n{upper[2]:03d}"),
            "model_version": (public.CURRENT_MODEL_VERSION
                              if archive_cycle >= public.CURRENT_MODEL_START else public.LEGACY_MODEL_VERSION),
            "pair_status": "paired",
            "model_temperature_f": value_c * 1.8 + 32,
            "model_depth_m": 0.0,
            "depth_method": "surface_layer",
            "model_lat": model_lat,
            "model_lon": model_lon,
            "model_distance_km": distance,
            "sample_method": "field_node",
            "observation_offset_minutes": 0.0,
            "methodology_version": METHODOLOGY,
            "model_source": "nodd" if "nodd" in {lower_source, upper_source} else "ncei",
        })
        recovered.append(result)
    return recovered, len(selected)


def validate(records: list[dict]) -> dict:
    return addon.validate_research_records(records)


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--start", required=True, type=date.fromisoformat)
    parser.add_argument("--end", required=True, type=date.fromisoformat)
    parser.add_argument("--cache", type=Path, default=Path(os.environ.get(
        "SCORECARD_FIELDS_CACHE", "/tmp/finfindr-scorecard-fields")))
    parser.add_argument("--store", action="store_true")
    parser.add_argument("--skip-existing-r2", action="store_true")
    args = parser.parse_args(argv)
    if args.end < args.start:
        parser.error("end precedes start")
    bucket = store.bucket()
    if bucket in {"", "piercast-lake-map"}:
        raise SystemExit("refusing unset or production map bucket")
    s3 = store.client()
    sampler = ArchivedFieldSampler(args.cache)
    code_version = revision()
    day = args.start
    total = attempted = unavailable = 0
    while day <= args.end:
        day_text = day.isoformat()
        if args.skip_existing_r2 and marker_exists(s3, bucket, day_text):
            print(f"Fields day={day_text} status=r2_skip")
            day += timedelta(days=1)
            continue
        rows, source = read_source_rows(s3, bucket, day_text)
        before_errors = sampler.fetch_errors
        before_missing = sampler.archive_missing
        records, candidates_count = recover(rows, sampler)
        day_errors = sampler.fetch_errors - before_errors
        day_missing = sampler.archive_missing - before_missing
        if day_errors:
            print("Fields day=" + day_text + " status=paused reason=source_fetch_error errors="
                  + str(day_errors) + " categories=" + json.dumps(
                      dict(sampler.failure_counts.most_common(10)), sort_keys=True))
            return 5
        validation = validate(records)
        if validation["invalidRows"]:
            print(f"Fields day={day_text} status=invalid count={validation['invalidRows']}")
            return 2
        evidence = {
            "methodologyVersion": METHODOLOGY,
            "sourceFragment": source["fragmentKey"],
            "records": records,
        }
        digest = hashlib.sha256(json.dumps(
            evidence, separators=(",", ":"), sort_keys=True, default=str,
        ).encode()).hexdigest()
        for record in records:
            record["evidence_key"] = source["fragmentKey"]
            record["evidence_sha256"] = digest
        if args.store:
            manifest = scorecard_store.write_fragment(
                records, STREAM, day_text, digest, s3=s3, environment=os.environ,
                methodology_version=METHODOLOGY, code_version=code_version,
            )
            scorecard_store.write_done_marker(
                manifest, METHODOLOGY, code_version, s3, os.environ,
            )
        total += len(records)
        attempted += candidates_count
        unavailable += day_missing
        print(f"Fields day={day_text} status=stored candidates={candidates_count} "
              f"recovered={len(records)} archive_missing={day_missing} errors=0")
        day += timedelta(days=1)
    print(json.dumps({"status": "complete", "candidates": attempted, "recovered": total,
                      "archiveMissing": unavailable, "errors": sampler.fetch_errors}, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
