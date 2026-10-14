"""Build the versioned PierCast point feed from the successful LMHOFS surface build."""
from __future__ import annotations

import json
import math
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np

from .config import DOMAIN, HOURS, TEMP
from .ofs import NODD_DISTRIBUTION, THREDDS_DISTRIBUTION

POINTS_PATH = Path(__file__).resolve().parents[1] / "piercast-points.json"
POINTER_KEY = "runs/piercast/latest.json"
CITY_COUNT = 32


class PierCastPointIntegrityError(RuntimeError):
    """The surface build cannot produce a complete, coherent PierCast feed."""


def iso(value: datetime) -> str:
    return value.astimezone(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def load_points(path=POINTS_PATH):
    payload = json.loads(Path(path).read_text())
    points = payload.get("points") if isinstance(payload, dict) else None
    if payload.get("formatVersion") != 1 or payload.get("model") != "LMHOFS":
        raise PierCastPointIntegrityError("PierCast point configuration has an unsupported format")
    if not isinstance(points, list) or len(points) != CITY_COUNT:
        raise PierCastPointIntegrityError(f"PierCast point configuration must contain {CITY_COUNT} cities")
    if len({point.get("cityId") for point in points}) != CITY_COUNT:
        raise PierCastPointIntegrityError("PierCast point configuration contains duplicate cities")
    for point in points:
        row, column = point.get("gridRow"), point.get("gridColumn")
        if not isinstance(row, int) or not 0 <= row < 478:
            raise PierCastPointIntegrityError(f"{point.get('cityId')} has an invalid LMHOFS row")
        if not isinstance(column, int) or not 0 <= column < 837:
            raise PierCastPointIntegrityError(f"{point.get('cityId')} has an invalid LMHOFS column")
        if abs(float(point.get("latitude")) - (41.6 + 0.01 * row)) > 1e-9:
            raise PierCastPointIntegrityError(f"{point.get('cityId')} latitude does not match its LMHOFS row")
        if abs(float(point.get("longitude")) - (-88.06 + 0.01 * column)) > 1e-9:
            raise PierCastPointIntegrityError(f"{point.get('cityId')} longitude does not match its LMHOFS column")
    return payload


def _thredds_positions(model, points):
    if tuple(model.shape or ()) != (478, 837):
        raise PierCastPointIntegrityError(f"unexpected LMHOFS regular-grid shape {model.shape}")
    positions = {}
    flat = np.asarray(model.flat)
    for point in points:
        original = point["gridRow"] * model.shape[1] + point["gridColumn"]
        position = int(np.searchsorted(flat, original))
        if position >= len(flat) or int(flat[position]) != original:
            raise PierCastPointIntegrityError(
                f"{point['cityId']} reviewed LMHOFS cell is not water in this cycle"
            )
        positions[point["cityId"]] = position
    return positions


def _map_cell(point):
    column = round((point["longitude"] - DOMAIN["west"]) / TEMP.res)
    row = round((DOMAIN["north"] - point["latitude"]) / TEMP.res)
    expected_lon = DOMAIN["west"] + column * TEMP.res
    expected_lat = DOMAIN["north"] - row * TEMP.res
    if abs(expected_lon - point["longitude"]) > 1e-9 or abs(expected_lat - point["latitude"]) > 1e-9:
        raise PierCastPointIntegrityError(f"{point['cityId']} does not align to the map grid")
    return row, column


def extract_point_feed(sources, cycle, points_payload=None):
    """Extract all 32 x 121 values from the one coherent surface source.

    THREDDS values use the exact row/column lookup performed by lmhofs.ts.
    NODD's native unstructured values are interpolated once to that same exact
    reviewed regular-grid coordinate using the surface build's LMHOFS regridder.
    """
    config = points_payload or load_points()
    points = config["points"]
    matches = [source for source in sources if source["model"]["id"] == "LMHOFS"]
    if len(matches) != 1:
        raise PierCastPointIntegrityError("surface build did not contain exactly one LMHOFS source")
    source = matches[0]
    model = source["lm"]
    if set(source.get("hours", {})) != set(range(HOURS)):
        raise PierCastPointIntegrityError("LMHOFS surface build is missing forecast hours")

    timelines = {point["cityId"]: [] for point in points}
    if model.distribution == THREDDS_DISTRIBUTION:
        positions = _thredds_positions(model, points)
        for hour in range(HOURS):
            values = source["hours"][hour]
            for point in points:
                value = float(values[positions[point["cityId"]]])
                timelines[point["cityId"]].append(value)
        sample_method = "exact_lmhofs_regular_grid_cell"
        distribution = "thredds"
    elif model.distribution == NODD_DISTRIBUTION:
        cells = {point["cityId"]: _map_cell(point) for point in points}
        for hour in range(HOURS):
            grid = source["rg"].apply(source["hours"][hour])
            for point in points:
                row, column = cells[point["cityId"]]
                timelines[point["cityId"]].append(float(grid[row, column]))
        sample_method = "nodd_interpolated_to_exact_lmhofs_regular_grid_cell"
        distribution = "nodd"
    else:
        raise PierCastPointIntegrityError(f"unsupported LMHOFS distribution {model.distribution}")

    output_points = []
    for point in points:
        samples = []
        for hour, value in enumerate(timelines[point["cityId"]]):
            if not math.isfinite(value) or not -2 <= value <= 40:
                raise PierCastPointIntegrityError(
                    f"{point['cityId']} f{hour:03d} has invalid surface temperature {value}"
                )
            samples.append({
                "forecastHour": hour,
                "validAt": iso(cycle + timedelta(hours=hour)),
                "temperatureC": round(value, 6),
            })
        output_points.append({**point, "samples": samples})

    return {
        "formatVersion": 1,
        "productId": config["productId"],
        "units": "C",
        "cycle": iso(cycle),
        "source": distribution,
        "sourceDistribution": model.distribution,
        "sampleMethod": sample_method,
        "cityCount": len(output_points),
        "forecastHours": HOURS,
        "points": output_points,
    }


def versioned_payload(feed, run, generated_at):
    payload = {**feed, "run": run, "generatedAt": iso(generated_at)}
    validate_payload(payload)
    return payload


def pointer(payload):
    return {
        "formatVersion": payload["formatVersion"],
        "run": payload["run"],
        "cycle": payload["cycle"],
        "generatedAt": payload["generatedAt"],
        "source": payload["source"],
        "units": payload["units"],
        "base": f"runs/{payload['run']}/",
        "object": "piercast-points.json",
        "cityCount": payload["cityCount"],
        "forecastHours": payload["forecastHours"],
    }


def validate_payload(payload):
    points = payload.get("points") if isinstance(payload, dict) else None
    if payload.get("formatVersion") != 1 or not isinstance(points, list) or len(points) != CITY_COUNT:
        raise PierCastPointIntegrityError("PierCast point feed is incomplete")
    if (payload.get("productId") != "NOAA_NOS_LMHOFS_REGULARGRID" or
            payload.get("units") != "C" or payload.get("forecastHours") != HOURS or
            payload.get("source") not in {"thredds", "nodd"}):
        raise PierCastPointIntegrityError("PierCast point feed metadata is invalid")
    for point in points:
        samples = point.get("samples")
        if not isinstance(samples, list) or len(samples) != HOURS:
            raise PierCastPointIntegrityError(f"{point.get('cityId')} point feed is incomplete")
        if [sample.get("forecastHour") for sample in samples] != list(range(HOURS)):
            raise PierCastPointIntegrityError(f"{point.get('cityId')} point feed hours are not 0–120")
        if any(not math.isfinite(float(sample.get("temperatureC", math.nan))) for sample in samples):
            raise PierCastPointIntegrityError(f"{point.get('cityId')} point feed contains non-finite data")
    return True
