"""Depth-, time-, and water-cell-safe pairing for the private scorecard."""
from __future__ import annotations

import math
from datetime import timedelta

from lakemap.depth import profile_at

import verify

SURFACE_MAX_DEPTH_M = 1.5
MAX_LEAD_HOURS = 120.0

# Conservative type defaults used only when providers omit sensor depth.  Each
# assumption is stored; it must never be mistaken for station metadata.
DEFAULT_DEPTH_M = {
    "offshore_buoy": 1.0,
    "nearshore_buoy": 1.0,
    "harbor": 1.0,
    "connecting_water": 1.0,
}

CONNECTING_WORDS = (
    "river", "canal", "channel", "strait", "st. clair", "st clair",
    "detroit", "st. marys", "st marys", "niagara",
)

MODEL_BY_BODY = {
    "lake-superior": "LSOFS",
    "superior": "LSOFS",
    "lake-michigan": "LMHOFS",
    "michigan": "LMHOFS",
    "lake-huron": "LMHOFS",
    "huron": "LMHOFS",
    "lake-erie": "LEOFS",
    "erie": "LEOFS",
    "lake-ontario": "LOOFS",
    "ontario": "LOOFS",
}
CURRENT_MODEL_VERSION = "COMF-3.6:2024-09-16"

# Exhaustive enum values this module can emit.  The schema-contract test checks
# these against the production migration instead of relying on a hand-reviewed
# example row.
EMITTED_CONSTRAINED_VALUES = {
    "station_class": frozenset(DEFAULT_DEPTH_M),
    "depth_method": frozenset({"surface_layer", "interpolated_3d", "pending_3d"}),
    "pair_status": frozenset({"paired", "pending_3d", "uncovered"}),
    "sample_method": frozenset({
        "frozen_verification_site", "saved_surface_grid", "interpolated_3d", "station_file",
        "pending_3d", "uncovered",
    }),
}


def station_class(observation, shore_distance_km=None):
    text = " ".join(str(observation.get(key) or "").lower()
                    for key in ("name", "body", "type"))
    if any(word in text for word in CONNECTING_WORDS):
        return "connecting_water"
    kind = str(observation.get("type") or "").lower()
    name = str(observation.get("name") or "").lower()
    if "buoy" in kind or "buoy" in name:
        return "offshore_buoy" if shore_distance_km is not None and shore_distance_km >= 10 else "nearshore_buoy"
    return "harbor"


def sensor_depth(observation, classification):
    raw = observation.get("waterDepthM")
    if isinstance(raw, (int, float)) and math.isfinite(raw) and raw >= 0:
        return float(raw), False
    return DEFAULT_DEPTH_M[classification], True


def model_version(observation, forecast):
    body = str(observation.get("body") or "").lower()
    model = MODEL_BY_BODY.get(body, "GLOFS-uncovered")
    versions = forecast.get("modelVersions")
    if isinstance(versions, dict) and isinstance(versions.get(model), str):
        return versions[model]
    # Explicit, stable tag. Historical tooling replaces this with the effective
    # version from its date-ranged registry before rows are committed.
    return f"{model}:{CURRENT_MODEL_VERSION}"


def station_metadata(observation, site):
    """Fill provider omissions from the reviewed model-site catalog.

    NDBC's live feed does not carry a lake name and occasionally omits a
    useful platform type.  ``find_site`` has already made an exact identity or
    reviewed-position match, so its metadata is the authoritative fallback.
    Observation values always win when the provider supplied them.
    """
    resolved = dict(observation)
    if isinstance(site, dict):
        for key in ("body", "type", "name"):
            if not resolved.get(key) and site.get(key):
                resolved[key] = site[key]
    return resolved


def _linear(left, right, fraction):
    if not all(isinstance(value, (int, float)) and math.isfinite(value) for value in (left, right)):
        return None
    return float(left) + (float(right) - float(left)) * fraction


def _time_bracket(cycle, observed):
    lead = (observed - cycle).total_seconds() / 3600
    if lead < 0 or lead > MAX_LEAD_HOURS:
        return None
    lower = int(math.floor(lead))
    upper = min(int(math.ceil(lead)), int(MAX_LEAD_HOURS))
    fraction = lead - lower if upper != lower else 0.0
    return lead, lower, upper, fraction


def _location(frame_sampler, observation):
    if frame_sampler is None:
        return None
    try:
        location = frame_sampler.location(observation)
    except Exception:
        return None
    if not isinstance(location, dict) or location.get("modelDistanceKm", math.inf) > verify.MAX_MODEL_CELL_DISTANCE_KM:
        return None
    return location


def _base_pair(observation, forecast, cycle, issued_at, bracket, location, classification, depth_m, assumed):
    lead, lower, upper, fraction = bracket
    wind_offset = observation.get("windOffsetHours")
    wind_valid = isinstance(wind_offset, (int, float)) and wind_offset <= verify.QC_STALE_HOURS
    return {
        "run": forecast.get("run") or "unknown", "cycle": verify.iso(cycle),
        "issuedAt": verify.iso(issued_at) if issued_at else None,
        "validTime": verify.iso(observation["observed"]), "leadHour": round(lead, 6),
        "lowerHour": lower, "upperHour": upper, "timeInterpolationFraction": round(fraction, 6),
        "station": observation["identity"], "stationName": observation.get("name"),
        "stationLat": observation.get("lat"), "stationLon": observation.get("lon"),
        "body": observation.get("body") or "unknown",
        "observationSource": observation.get("source") or "unknown",
        "quality": observation.get("waterQuality") or "unknown",
        "parameterId": observation.get("parameterId"), "depthKey": observation["depthKey"],
        "sensorDepthM": round(depth_m, 4), "depthAssumed": assumed,
        "observed": verify.iso(observation["observed"]), "observedF": round(observation["waterF"], 3),
        "observationOffsetMinutes": 0.0,
        "stationType": classification, "rawStationType": observation.get("type"),
        "modelVersion": model_version(observation, forecast),
        "modelLat": location.get("modelLat") if location else None,
        "modelLon": location.get("modelLon") if location else None,
        "modelDistanceKm": location.get("modelDistanceKm") if location else None,
        "firstCollectedAt": verify.iso(observation["firstCollected"]) if observation.get("firstCollected") else None,
        "qualityFlags": sorted(set(observation.get("qualityFlags", []))),
        "windMph": observation.get("windMph") if wind_valid else None,
        "windFrom": observation.get("windFrom") if wind_valid else None,
        "windObservedAt": verify.iso(observation["windObserved"]) if wind_valid else None,
        "windOffsetMinutes": round(wind_offset * 60, 2) if wind_valid else None,
    }


def pair_observation(observation, forecast, frame_sampler=None, depth_sampler=None):
    cycle = verify.parse_time(forecast.get("cycle"))
    issued_at = verify.parse_time(forecast.get("issuedAt"))
    sites = forecast.get("sites")
    if cycle is None or not isinstance(sites, dict):
        return None
    bracket = _time_bracket(cycle, observation["observed"])
    if bracket is None:
        return None
    site = verify.find_site(observation, sites)
    observation = station_metadata(observation, site)
    location = _location(frame_sampler, observation)
    if location is None and site and site.get("modelDistanceKm", math.inf) <= verify.MAX_MODEL_CELL_DISTANCE_KM:
        location = {key: site.get(key) for key in ("modelLat", "modelLon", "modelDistanceKm", "shoreDistanceKm")}
    classification = station_class(observation, (location or {}).get("shoreDistanceKm"))
    depth_m, assumed = sensor_depth(observation, classification)
    pair = _base_pair(observation, forecast, cycle, issued_at, bracket, location, classification, depth_m, assumed)
    if pair["modelVersion"].startswith("GLOFS-uncovered:"):
        pair.update({"pairStatus": "uncovered", "depthMethod": "surface_layer" if depth_m <= SURFACE_MAX_DEPTH_M else "pending_3d",
                     "modelDepthM": 0.0 if depth_m <= SURFACE_MAX_DEPTH_M else depth_m,
                     "forecastF": None, "sampleMethod": "uncovered"})
        return pair
    if location is None:
        pair.update({"pairStatus": "uncovered", "depthMethod": "surface_layer" if depth_m <= SURFACE_MAX_DEPTH_M else "pending_3d",
                     "modelDepthM": 0.0 if depth_m <= SURFACE_MAX_DEPTH_M else depth_m,
                     "forecastF": None, "sampleMethod": "uncovered"})
        return pair

    lead, lower, upper, fraction = bracket
    if depth_m > SURFACE_MAX_DEPTH_M:
        sampled = None
        if depth_sampler is not None:
            try:
                sampled = depth_sampler.sample(forecast, observation, depth_m, lower, upper, fraction, location)
            except Exception:
                sampled = None
        if sampled is None or not isinstance(sampled.get("value"), (int, float)) or not math.isfinite(sampled["value"]):
            pair.update({"pairStatus": "pending_3d", "depthMethod": "pending_3d", "modelDepthM": depth_m,
                         "forecastF": None, "sampleMethod": "pending_3d"})
        else:
            pair.update({"pairStatus": "paired", "depthMethod": "interpolated_3d", "modelDepthM": depth_m,
                         "forecastF": round(float(sampled["value"]), 3),
                         "sampleMethod": "interpolated_3d"})
        return pair

    values = site.get("hours") if site else None
    model_f = None
    method = "frozen_verification_site"
    if isinstance(values, list) and len(values) > upper:
        model_f = _linear(values[lower], values[upper], fraction)
    elif frame_sampler is not None:
        try:
            a = frame_sampler.sample(forecast, observation, lower)
            b = a if upper == lower else frame_sampler.sample(forecast, observation, upper)
            model_f = _linear(a["value"], b["value"], fraction) if a and b else None
            method = "saved_surface_grid"
        except Exception:
            model_f = None
    if model_f is None:
        pair.update({"pairStatus": "uncovered", "depthMethod": "surface_layer", "modelDepthM": 0.0,
                     "forecastF": None, "sampleMethod": "uncovered"})
    else:
        pair.update({"pairStatus": "paired", "depthMethod": "surface_layer", "modelDepthM": 0.0,
                     "forecastF": round(model_f, 3), "sampleMethod": method})
    return pair


def pairs_for(observations, forecasts, frame_sampler=None, depth_sampler=None):
    for forecast in forecasts:
        for observation in observations:
            pair = pair_observation(observation, forecast, frame_sampler, depth_sampler)
            if pair is not None:
                yield pair


class ProfileDepthSampler:
    """Small adapter used by tests/backfills with already-fetched 3-D profiles."""

    def __init__(self, provider):
        self.provider = provider

    def sample(self, forecast, observation, depth_m, lower, upper, fraction, _location):
        first = self.provider(forecast, observation, lower)
        second = first if upper == lower else self.provider(forecast, observation, upper)
        if not first or not second:
            return None
        a = profile_at(first["temperatureC"], first["levelsM"], first.get("bottomM", math.nan), depth_m)
        b = profile_at(second["temperatureC"], second["levelsM"], second.get("bottomM", math.nan), depth_m)
        value_c = _linear(a, b, fraction)
        if value_c is None:
            return None
        return {"value": value_c * 9 / 5 + 32, "sampleMethod": "interpolated_3d"}
