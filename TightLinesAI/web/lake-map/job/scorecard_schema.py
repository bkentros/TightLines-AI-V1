"""Production-table constraint mirror for scorecard preflight validation.

This module performs no I/O.  It deliberately mirrors the checks in migration
20261006150000 so a locally generated batch can be rejected before an R2 write
or Supabase request.  Tests compare the enum sets below with the migration.
"""
from __future__ import annotations

import math
import re
from datetime import datetime


CONSTRAINED_TEXT_VALUES = {
    "station_class": frozenset({"offshore_buoy", "nearshore_buoy", "harbor", "connecting_water"}),
    "source": frozenset({"live_archive", "backfill", "synthetic"}),
    "depth_method": frozenset({"surface_layer", "interpolated_3d", "pending_3d"}),
    "pair_status": frozenset({"paired", "pending_3d", "uncovered"}),
    "sample_method": frozenset({
        "frozen_verification_site", "saved_surface_grid", "interpolated_3d", "pending_3d", "uncovered",
    }),
}


def _number(value):
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def _time(value):
    if not isinstance(value, str) or not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def validate_record(record):
    """Return stable constraint codes for a projected row; empty means valid."""
    errors = []

    for field, values in CONSTRAINED_TEXT_VALUES.items():
        if record.get(field) not in values:
            errors.append(f"{field}:allowed_set")

    for field, low, high, nullable in (
        ("station_lat", 40, 51, True), ("station_lon", -94, -74, True),
        ("sensor_depth_m", 0, 1000, False), ("model_depth_m", 0, 1000, False),
        ("observation_offset_minutes", -30, 30, False), ("lead_hours", 0, 120, False),
        ("lower_model_hour", 0, 120, False), ("upper_model_hour", 0, 120, False),
        ("time_interpolation_fraction", 0, 1, False),
        ("observed_temperature_f", -20, 150, False), ("model_temperature_f", -20, 150, True),
        ("model_lat", 40, 51, True), ("model_lon", -94, -74, True),
        ("model_distance_km", 0, 6, True), ("wind_speed_mph", 0, 250, True),
        ("wind_from_degrees", 0, 360, True), ("wind_offset_minutes", 0, 90, True),
    ):
        value = record.get(field)
        if value is None and nullable:
            continue
        if not _number(value) or not low <= value <= high:
            errors.append(f"{field}:range")

    for field, low, high in (
        ("station_id", 1, 160), ("sensor_key", 1, 320), ("run_id", 1, 160),
        ("model_version", 1, 160), ("evidence_key", 1, 500),
    ):
        value = record.get(field)
        if not isinstance(value, str) or not low <= len(value) <= high:
            errors.append(f"{field}:length")

    for field in ("observation_source", "waterbody", "source_quality", "methodology_version"):
        if not isinstance(record.get(field), str):
            errors.append(f"{field}:not_null")
    for field in ("depth_assumed", "strict_quality"):
        if not isinstance(record.get(field), bool):
            errors.append(f"{field}:boolean")
    if not isinstance(record.get("quality_flags"), list) or not all(
        isinstance(flag, str) for flag in record.get("quality_flags", [])
    ):
        errors.append("quality_flags:text_array")
    if not isinstance(record.get("evidence_sha256"), str) or not re.fullmatch(
        r"[0-9a-f]{64}", record.get("evidence_sha256", "")
    ):
        errors.append("evidence_sha256:format")

    observation_time = _time(record.get("observation_time"))
    valid_time = _time(record.get("valid_time"))
    cycle = _time(record.get("model_cycle"))
    for field in ("observation_time", "valid_time", "model_cycle"):
        if _time(record.get(field)) is None:
            errors.append(f"{field}:timestamp")
    for field in ("first_collected_at", "model_issued_at", "wind_observed_at"):
        if record.get(field) is not None and _time(record.get(field)) is None:
            errors.append(f"{field}:timestamp")
    if observation_time and valid_time and observation_time != valid_time:
        errors.append("valid_time:observation_time")
    if observation_time and cycle and _number(record.get("lead_hours")):
        actual_lead = (observation_time - cycle).total_seconds() / 3600
        if abs(actual_lead - record["lead_hours"]) >= 0.0001:
            errors.append("lead_hours:model_cycle")

    lower = record.get("lower_model_hour")
    upper = record.get("upper_model_hour")
    fraction = record.get("time_interpolation_fraction")
    if _number(lower) and _number(upper):
        if upper < lower or upper - lower > 1:
            errors.append("model_hours:bracket")
        if not ((lower == upper and fraction == 0) or upper == lower + 1):
            errors.append("time_interpolation_fraction:bracket")

    status = record.get("pair_status")
    method = record.get("depth_method")
    model_temp = record.get("model_temperature_f")
    if not ((status == "paired" and model_temp is not None and method != "pending_3d") or
            (status in {"pending_3d", "uncovered"} and model_temp is None)):
        errors.append("pair_status:model_temperature")
    sensor_depth = record.get("sensor_depth_m")
    model_depth = record.get("model_depth_m")
    if _number(sensor_depth) and _number(model_depth):
        if not ((sensor_depth <= 1.5 and method == "surface_layer" and model_depth == 0) or
                (sensor_depth > 1.5 and method in {"interpolated_3d", "pending_3d"} and
                 model_depth == sensor_depth)):
            errors.append("depth_method:sensor_depth")
    return sorted(set(errors))


def validate_records(records):
    """Return aggregate diagnostics without including row data."""
    violations = {}
    invalid_rows = 0
    for record in records:
        row_errors = validate_record(record)
        if row_errors:
            invalid_rows += 1
            for error in row_errors:
                violations[error] = violations.get(error, 0) + 1
    return {"recordCount": len(records), "invalidRows": invalid_rows,
            "violations": dict(sorted(violations.items()))}
