#!/usr/bin/env python3
"""One-time, read-only production scorecard export to local and private R2 Parquet."""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import os
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import unquote, urlparse

import pyarrow as pa
import pyarrow.json as pajson
import pyarrow.parquet as pq

from lakemap import store
import scorecard_store
import verify


COPY_SQL = """copy (
  select row_to_json(s)::text
  from (
    select * from public.lake_map_temperature_scorecard_samples
    order by station_id, sensor_key, observation_time, model_cycle
  ) s
) to stdout with (format csv)"""


def pg_environment(database_url: str) -> dict:
    parsed = urlparse(database_url)
    if parsed.scheme not in {"postgres", "postgresql"} or not parsed.hostname:
        raise ValueError("V1_DATABASE_URL is not a PostgreSQL URL")
    result = dict(os.environ)
    result.update({
        "PGHOST": parsed.hostname,
        "PGPORT": str(parsed.port or 5432),
        "PGDATABASE": unquote(parsed.path.lstrip("/")),
        "PGUSER": unquote(parsed.username or ""),
        "PGPASSWORD": unquote(parsed.password or ""),
        "PGSSLMODE": "require",
        "PGOPTIONS": "-c default_transaction_read_only=on -c statement_timeout=15min",
    })
    return result


def psql_binary() -> str:
    found = shutil.which("psql")
    bundled = "/Applications/Postgres.app/Contents/Versions/latest/bin/psql"
    return found or bundled


def load_database_url(path: Path) -> None:
    if os.environ.get("V1_DATABASE_URL"):
        return
    for raw in path.read_text(errors="replace").splitlines():
        if not raw.strip() or raw.lstrip().startswith("#") or "=" not in raw:
            continue
        key, value = raw.split("=", 1)
        if key.strip() != "V1_DATABASE_URL":
            continue
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        if value:
            os.environ["V1_DATABASE_URL"] = value
        return


def export_ndjson(path: Path, environment: dict) -> tuple[int, str]:
    process = subprocess.Popen(
        [psql_binary(), "-X", "-q", "--set", "ON_ERROR_STOP=1", "-c", COPY_SQL],
        stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True, encoding="utf-8",
        env=environment,
    )
    count = 0
    digest = hashlib.sha256()
    assert process.stdout is not None
    with path.open("wb") as output:
        for cells in csv.reader(process.stdout):
            if len(cells) != 1:
                process.kill()
                raise RuntimeError("unexpected PostgreSQL export shape")
            body = cells[0].encode() + b"\n"
            output.write(body)
            digest.update(body)
            count += 1
    stderr = process.stderr.read() if process.stderr is not None else ""
    if process.wait() != 0:
        raise RuntimeError("PostgreSQL export failed: " + stderr.strip()[:500])
    return count, digest.hexdigest()


def exact_count(environment: dict) -> int:
    result = subprocess.run(
        [psql_binary(), "-X", "-qAt", "--set", "ON_ERROR_STOP=1", "-c",
         "set statement_timeout='5min'; select count(*) from public.lake_map_temperature_scorecard_samples"],
        capture_output=True, text=True, encoding="utf-8", env=environment, check=True,
    )
    return int(result.stdout.strip())


def logical_table_sha256(table: pa.Table) -> str:
    digest = hashlib.sha256()
    for row in table.to_pylist():
        digest.update(json.dumps(row, separators=(",", ":"), sort_keys=True).encode())
        digest.update(b"\n")
    return digest.hexdigest()


def ndjson_to_verified_parquet(ndjson: Path, parquet: Path) -> tuple[int, str]:
    read_options = pajson.ReadOptions(block_size=8 * 1024 * 1024, use_threads=True)
    parse_options = pajson.ParseOptions(explicit_schema=scorecard_store.SCORECARD_SCHEMA)
    rows = 0
    writer = None
    batches = []
    for batch in pajson.open_json(ndjson, read_options=read_options, parse_options=parse_options):
        if writer is None:
            writer = pq.ParquetWriter(parquet, batch.schema, compression="zstd", version="2.6",
                                      write_statistics=True)
        table = pa.Table.from_batches([batch])
        writer.write_table(table, row_group_size=batch.num_rows)
        batches.append((batch.num_rows, logical_table_sha256(table)))
        rows += batch.num_rows
    if writer is None:
        raise RuntimeError("production scorecard export was empty")
    writer.close()

    parquet_file = pq.ParquetFile(parquet)
    if parquet_file.num_row_groups != len(batches):
        raise RuntimeError("Parquet row-group count differs from source batches")
    canonical = hashlib.sha256()
    for index, (expected_rows, expected_sha) in enumerate(batches):
        table = parquet_file.read_row_group(index)
        if table.num_rows != expected_rows:
            raise RuntimeError("Parquet row-group row count differs from source")
        readback_sha = logical_table_sha256(table)
        if readback_sha != expected_sha:
            raise RuntimeError(f"Parquet logical checksum differs at row group {index}")
        canonical.update(expected_rows.to_bytes(8, "big"))
        canonical.update(bytes.fromhex(expected_sha))
    return rows, canonical.hexdigest()


def main(argv=None) -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--env-file", type=Path, required=True)
    parser.add_argument("--local-root", type=Path)
    parser.add_argument("--upload", action="store_true")
    args = parser.parse_args(argv)
    verify.load_env_file(args.env_file)
    load_database_url(args.env_file)
    database_url = os.environ.get("V1_DATABASE_URL", "")
    if not database_url:
        raise SystemExit("V1_DATABASE_URL is required")
    if args.local_root:
        os.environ["SCORECARD_STORE_DIR"] = str(args.local_root)
    root = scorecard_store.local_root()
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    relative = Path(scorecard_store.PRIVATE_PREFIX) / "exports" / stamp
    target_dir = root / relative
    target_dir.mkdir(parents=True, exist_ok=False)
    parquet = target_dir / "samples.parquet"
    pg_env = pg_environment(database_url)

    with tempfile.TemporaryDirectory(prefix="scorecard-export-") as temporary:
        ndjson = Path(temporary) / "source.ndjson"
        exported_rows, ndjson_sha = export_ndjson(ndjson, pg_env)
        parquet_rows, canonical_sha = ndjson_to_verified_parquet(ndjson, parquet)
    database_rows = exact_count(pg_env)
    if database_rows != exported_rows or parquet_rows != exported_rows:
        raise RuntimeError(
            f"row-count mismatch database={database_rows} export={exported_rows} parquet={parquet_rows}"
        )
    parquet_sha = scorecard_store.sha256_file(parquet)
    key = relative.joinpath("samples.parquet").as_posix()
    r2_verified = False
    if args.upload:
        s3 = store.client()
        s3.upload_file(
            str(parquet), store.bucket(), key,
            ExtraArgs={
                "ContentType": "application/vnd.apache.parquet",
                "CacheControl": "private, no-store",
                "Metadata": {"sha256": parquet_sha, "rows": str(parquet_rows)},
            },
        )
        with tempfile.TemporaryDirectory(prefix="scorecard-r2-verify-") as temporary:
            downloaded = Path(temporary) / "samples.parquet"
            s3.download_file(store.bucket(), key, str(downloaded))
            r2_verified = scorecard_store.sha256_file(downloaded) == parquet_sha
        if not r2_verified:
            raise RuntimeError("downloaded R2 Parquet checksum differs from local copy")
    manifest = {
        "formatVersion": 1,
        "source": "production-postgres-export",
        "sourceTable": "public.lake_map_temperature_scorecard_samples",
        "exportedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        "rowCount": parquet_rows,
        "sourceNdjsonSha256": ndjson_sha,
        "canonicalArrowSha256": canonical_sha,
        "parquetSha256": parquet_sha,
        "parquetBytes": parquet.stat().st_size,
        "r2Key": key if args.upload else None,
        "r2DownloadVerified": r2_verified,
    }
    manifest_path = target_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    if args.upload:
        s3.put_object(
            Bucket=store.bucket(), Key=relative.joinpath("manifest.json").as_posix(),
            Body=json.dumps(manifest, separators=(",", ":"), sort_keys=True).encode(),
            ContentType="application/json", CacheControl="private, no-store",
        )
    print(json.dumps(manifest, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
