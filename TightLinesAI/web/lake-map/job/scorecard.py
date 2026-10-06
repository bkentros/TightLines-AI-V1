#!/usr/bin/env python3
"""Private, fail-open sink for lake-model/observation pair evidence.

The daily validator remains the source of truth. This module only projects its
immutable evidence into a queryable Supabase table. The environment kill switch
must be exactly ``true`` and every network/database failure is returned as a
sanitized status instead of escaping into the validation or map-data workflows.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import re
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

import scorecard_schema

MAX_BATCH = 500
SYNC_TIMEOUT_SECONDS = 20
SCORECARD_ENV = (
    "LAKE_MAP_SCORECARD_ENABLED",
    "SUPABASE_URL",
    "LAKE_MAP_SCORECARD_INTERNAL_KEY",
)
EMITTED_CONSTRAINED_VALUES = {
    "source": frozenset({"live_archive", "backfill", "synthetic"}),
}


def _finite(value):
    return isinstance(value, (int, float)) and math.isfinite(value)


def _sensor_key(pair):
    parameter = pair.get("parameterId")
    suffix = f"parameter:{parameter}" if parameter is not None else f"depth:{pair.get('depthKey') or 'unknown'}"
    provider = pair.get("observationSource") or pair.get("source") or "unknown"
    return f"{pair.get('station')}|{suffix}|{provider}"


def record_from_pair(pair, evidence_key, evidence_sha256, methodology_version):
    """Return one bounded relational record, or None for incomplete evidence."""
    required_text = ("run", "cycle", "validTime", "station", "observed")
    if any(not isinstance(pair.get(key), str) or not pair[key] for key in required_text):
        return None
    if not all(_finite(pair.get(key)) for key in ("leadHour", "observedF", "sensorDepthM", "modelDepthM")):
        return None
    model_f = pair.get("forecastF")
    if model_f is not None and not _finite(model_f):
        return None
    flags = sorted({str(flag) for flag in pair.get("qualityFlags", [])
                    if isinstance(flag, str) and re.fullmatch(r"[a-z0-9_]{1,40}", flag)})
    return {
        "station_id": pair["station"],
        "sensor_key": _sensor_key(pair),
        "station_name": pair.get("stationName"),
        "station_class": pair.get("stationType") or "harbor",
        "raw_station_type": pair.get("rawStationType"),
        "source": pair.get("recordSource") or "live_archive",
        "observation_source": pair.get("observationSource") or pair.get("source") or "unknown",
        "waterbody": pair.get("body") or "unknown",
        "station_lat": pair.get("stationLat"),
        "station_lon": pair.get("stationLon"),
        "sensor_depth_m": pair.get("sensorDepthM"),
        "model_depth_m": pair.get("modelDepthM"),
        "depth_method": pair.get("depthMethod"),
        "depth_assumed": pair.get("depthAssumed") is True,
        "parameter_id": str(pair["parameterId"]) if pair.get("parameterId") is not None else None,
        "observation_time": pair["observed"],
        "observation_offset_minutes": pair.get("observationOffsetMinutes"),
        "first_collected_at": pair.get("firstCollectedAt"),
        "model_cycle": pair["cycle"],
        "model_issued_at": pair.get("issuedAt"),
        "valid_time": pair["validTime"],
        "lead_hours": round(float(pair["leadHour"]), 6),
        "lower_model_hour": int(pair.get("lowerHour", math.floor(float(pair["leadHour"])))),
        "upper_model_hour": int(pair.get("upperHour", math.ceil(float(pair["leadHour"])))),
        "time_interpolation_fraction": float(pair.get("timeInterpolationFraction", 0)),
        "run_id": pair["run"],
        "model_version": pair.get("modelVersion") or "unknown",
        "pair_status": pair.get("pairStatus") or "paired",
        "observed_temperature_f": round(float(pair["observedF"]), 3),
        "model_temperature_f": round(float(model_f), 3) if model_f is not None else None,
        "model_lat": pair.get("modelLat"),
        "model_lon": pair.get("modelLon"),
        "model_distance_km": pair.get("modelDistanceKm"),
        "sample_method": pair.get("sampleMethod") or "uncovered",
        "wind_speed_mph": pair.get("windMph"),
        "wind_from_degrees": pair.get("windFrom"),
        "wind_observed_at": pair.get("windObservedAt"),
        "wind_offset_minutes": pair.get("windOffsetMinutes"),
        "source_quality": pair.get("quality") or "unknown",
        "quality_flags": flags,
        "strict_quality": pair.get("strict") is True,
        "evidence_key": evidence_key,
        "evidence_sha256": evidence_sha256,
        "methodology_version": methodology_version,
    }


def records_from_evidence(evidence, evidence_key="dry-run", evidence_sha256="0" * 64):
    methodology = evidence.get("methodologyVersion") or "unknown"
    records = [record_from_pair(pair, evidence_key, evidence_sha256, methodology)
               for pair in evidence.get("primaryPairs", []) if isinstance(pair, dict)]
    return [record for record in records if record is not None]


def _enabled(environment):
    return str(environment.get("LAKE_MAP_SCORECARD_ENABLED", "")).strip().lower() == "true"


def sync_evidence(evidence, evidence_key, evidence_sha256, environment=None, opener=None):
    """Best-effort upload. This function deliberately never raises."""
    environment = os.environ if environment is None else environment
    records = records_from_evidence(evidence, evidence_key, evidence_sha256)
    preflight = scorecard_schema.validate_records(records)
    if preflight["invalidRows"]:
        return {"status": "invalid", "recordCount": 0, "candidateCount": len(records),
                "invalidRows": preflight["invalidRows"], "violations": preflight["violations"]}
    if not _enabled(environment):
        return {"status": "disabled", "recordCount": 0, "candidateCount": len(records)}
    base_url = str(environment.get("SUPABASE_URL") or "").rstrip("/")
    secret = str(environment.get("LAKE_MAP_SCORECARD_INTERNAL_KEY") or "")
    if not base_url.startswith("https://") or len(secret) < 16:
        return {"status": "misconfigured", "recordCount": 0, "candidateCount": len(records)}
    open_url = opener or urllib.request.urlopen
    committed = 0
    try:
        for start in range(0, len(records), MAX_BATCH):
            batch = records[start:start + MAX_BATCH]
            request = urllib.request.Request(
                f"{base_url}/functions/v1/lake-map-scorecard-ingest",
                data=json.dumps({"records": batch}, separators=(",", ":")).encode(),
                method="POST",
                headers={"content-type": "application/json", "x-lake-map-scorecard-key": secret},
            )
            with open_url(request, timeout=SYNC_TIMEOUT_SECONDS) as response:
                if response.status != 200:
                    return {"status": "degraded", "recordCount": committed, "candidateCount": len(records)}
                result = json.loads(response.read())
                if result.get("status") != "committed":
                    return {"status": "degraded", "recordCount": committed, "candidateCount": len(records)}
                committed += int(result.get("recordCount", 0))
        return {"status": "committed", "recordCount": committed, "candidateCount": len(records)}
    except (OSError, ValueError, TypeError, urllib.error.URLError, urllib.error.HTTPError):
        return {"status": "degraded", "recordCount": committed, "candidateCount": len(records)}
    except Exception:
        return {"status": "degraded", "recordCount": committed, "candidateCount": len(records)}


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("evidence", type=Path)
    parser.add_argument("--sync", action="store_true")
    args = parser.parse_args(argv)
    evidence = json.loads(args.evidence.read_text())
    body = json.dumps(evidence, separators=(",", ":"), sort_keys=True).encode()
    import hashlib
    digest = hashlib.sha256(body).hexdigest()
    if args.sync:
        result = sync_evidence(evidence, f"local/{args.evidence.name}", digest)
    else:
        records = records_from_evidence(evidence, f"local/{args.evidence.name}", digest)
        preflight = scorecard_schema.validate_records(records)
        leads = sorted({record["lead_hours"] for record in records})
        result = {"status": "dry_run", "recordCount": len(records), "leadHours": leads,
                  "stations": len({record["station_id"] for record in records}),
                  "invalidRows": preflight["invalidRows"], "violations": preflight["violations"],
                  "generatedAt": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")}
    print(json.dumps(result, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
