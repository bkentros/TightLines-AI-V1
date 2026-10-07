"""Private local/R2 Parquet store for scorecard research rows.

The store is deliberately independent of Supabase. Objects live below a
prefix that the map gatekeeper never serves, and every R2 write is mirrored to
the workstation first. Files are immutable and content addressed so a retry
cannot overwrite earlier evidence.
"""
from __future__ import annotations

import hashlib
import json
import os
from datetime import datetime, timezone
from pathlib import Path

import pyarrow as pa
import pyarrow.parquet as pq

PRIVATE_PREFIX = "private/scorecard/v1"
DEFAULT_LOCAL_ROOT = Path.cwd() / ".scorecard-store"

STRING_FIELDS = {
    "station_id", "sensor_key", "station_name", "station_class", "raw_station_type",
    "source", "observation_source", "waterbody", "depth_method", "parameter_id", "observation_time",
    "first_collected_at", "model_cycle", "model_issued_at", "valid_time", "run_id",
    "model_version", "pair_status", "sample_method", "wind_observed_at", "source_quality",
    "evidence_key", "evidence_sha256", "methodology_version", "created_at", "updated_at",
}
FLOAT_FIELDS = {
    "station_lat", "station_lon", "sensor_depth_m", "model_depth_m",
    "observation_offset_minutes", "lead_hours", "time_interpolation_fraction",
    "observed_temperature_f", "model_temperature_f", "miss_f", "miss_c", "model_lat",
    "model_lon", "model_distance_km", "wind_speed_mph", "wind_from_degrees",
    "wind_offset_minutes",
}
INT_FIELDS = {"lower_model_hour", "upper_model_hour"}
BOOL_FIELDS = {"depth_assumed", "strict_quality"}


def schema() -> pa.Schema:
    fields = []
    ordered = [
        "station_id", "sensor_key", "station_name", "station_class", "raw_station_type", "source",
        "observation_source", "waterbody", "station_lat", "station_lon", "sensor_depth_m",
        "model_depth_m", "depth_method", "depth_assumed", "parameter_id", "observation_time",
        "observation_offset_minutes", "first_collected_at", "model_cycle", "model_issued_at",
        "valid_time", "lead_hours", "lower_model_hour", "upper_model_hour",
        "time_interpolation_fraction", "run_id", "model_version", "pair_status",
        "observed_temperature_f", "model_temperature_f", "miss_f", "miss_c", "model_lat",
        "model_lon", "model_distance_km", "sample_method", "wind_speed_mph",
        "wind_from_degrees", "wind_observed_at", "wind_offset_minutes", "source_quality",
        "quality_flags", "strict_quality", "evidence_key", "evidence_sha256",
        "methodology_version", "created_at", "updated_at",
    ]
    for name in ordered:
        if name in STRING_FIELDS:
            kind = pa.string()
        elif name in FLOAT_FIELDS:
            kind = pa.float64()
        elif name in INT_FIELDS:
            kind = pa.int16()
        elif name in BOOL_FIELDS:
            kind = pa.bool_()
        elif name == "quality_flags":
            kind = pa.list_(pa.string())
        else:  # pragma: no cover - guarded by the fixed schema above
            raise AssertionError(f"untyped scorecard field: {name}")
        fields.append(pa.field(name, kind))
    return pa.schema(fields)


SCORECARD_SCHEMA = schema()


def local_root(environment=None) -> Path:
    environment = os.environ if environment is None else environment
    return Path(environment.get("SCORECARD_STORE_DIR") or DEFAULT_LOCAL_ROOT)


def _iso_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def normalized_record(record: dict) -> dict:
    row = {name: record.get(name) for name in SCORECARD_SCHEMA.names}
    observed = row.get("observed_temperature_f")
    model = row.get("model_temperature_f")
    if observed is not None and model is not None:
        row["miss_f"] = float(observed) - float(model)
        row["miss_c"] = row["miss_f"] * 5.0 / 9.0
    else:
        row["miss_f"] = None
        row["miss_c"] = None
    row["quality_flags"] = sorted(set(row.get("quality_flags") or []))
    return row


def records_table(records: list[dict]) -> pa.Table:
    return pa.Table.from_pylist([normalized_record(record) for record in records], schema=SCORECARD_SCHEMA)


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(block)
    return digest.hexdigest()


def fragment_key(stream: str, day: str, digest: str) -> str:
    if stream not in {"live", "backfill"}:
        raise ValueError("scorecard stream must be live or backfill")
    return f"{PRIVATE_PREFIX}/samples/stream={stream}/date={day}/{digest[:24]}.parquet"


def write_fragment(records: list[dict], stream: str, day: str, evidence_sha256: str,
                   s3=None, environment=None) -> dict:
    """Write one immutable local Parquet fragment and optionally mirror it to R2."""
    root = local_root(environment)
    key = fragment_key(stream, day, evidence_sha256)
    path = root / key
    path.parent.mkdir(parents=True, exist_ok=True)
    table = records_table(records)
    if not path.exists():
        temporary = path.with_suffix(".parquet.tmp")
        pq.write_table(table, temporary, compression="zstd", version="2.6", write_statistics=True)
        temporary.replace(path)
    readback = pq.read_table(path)
    if not readback.equals(table):
        raise RuntimeError("local Parquet readback differs from candidate scorecard rows")
    file_sha256 = sha256_file(path)
    if s3 is not None:
        from lakemap import store
        s3.upload_file(
            str(path), store.bucket(), key,
            ExtraArgs={
                "ContentType": "application/vnd.apache.parquet",
                "CacheControl": "private, no-store",
                "Metadata": {"sha256": file_sha256, "rows": str(table.num_rows)},
            },
        )
        head = s3.head_object(Bucket=store.bucket(), Key=key)
        if (head.get("Metadata", {}).get("sha256") != file_sha256 or
                int(head.get("Metadata", {}).get("rows", "-1")) != table.num_rows):
            raise RuntimeError("R2 scorecard fragment metadata verification failed")
    manifest = {
        "formatVersion": 1,
        "stream": stream,
        "date": day,
        "rowCount": table.num_rows,
        "evidenceSha256": evidence_sha256,
        "parquetSha256": file_sha256,
        "key": key,
        "writtenAt": _iso_now(),
    }
    sidecar = path.with_suffix(".manifest.json")
    sidecar.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    if s3 is not None:
        from lakemap import store
        s3.put_object(
            Bucket=store.bucket(), Key=key.removesuffix(".parquet") + ".manifest.json",
            Body=json.dumps(manifest, separators=(",", ":"), sort_keys=True).encode(),
            ContentType="application/json", CacheControl="private, no-store",
        )
    return manifest


def parquet_paths(path: Path) -> list[Path]:
    if path.is_file():
        return [path]
    return sorted(item for item in path.rglob("*.parquet") if item.is_file())


def read_rows(path: Path) -> list[dict]:
    """Read and identity-dedupe rows only from the local Parquet store."""
    rows = {}
    identity = ("station_id", "sensor_key", "observation_time", "model_cycle")
    for parquet in parquet_paths(path):
        for row in pq.read_table(parquet).to_pylist():
            rows[tuple(row.get(key) for key in identity)] = row
    return list(rows.values())
