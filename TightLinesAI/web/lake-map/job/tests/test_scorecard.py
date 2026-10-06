"""Private scorecard depth/time projection tests; no network/database access."""
from datetime import datetime, timezone
import json
import re
import sys
import unittest
from pathlib import Path

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

import scorecard  # noqa: E402
import scorecard_pairing as pairing  # noqa: E402
import scorecard_schema  # noqa: E402


def observation(depth=1.0, observed="2026-10-06T12:30:00Z"):
    return {
        "identity": "glos:2", "name": "Test buoy", "type": "moored_buoy",
        "body": "lake-michigan", "lat": 43.1, "lon": -87.8,
        "source": "GLOS Seagull", "parameterId": 7, "waterDepthM": depth,
        "depthKey": "unknown" if depth is None else f"{depth:.2f}m",
        "observed": datetime.fromisoformat(observed.replace("Z", "+00:00")),
        "waterF": 60, "waterQuality": "good", "qualityFlags": [],
        "firstCollected": datetime(2026, 10, 6, 12, 35, tzinfo=timezone.utc),
    }


def forecast():
    values = [float(hour + 40) for hour in range(121)]
    return {
        "run": "run-1", "cycle": "2026-10-06T06:00:00Z",
        "issuedAt": "2026-10-06T09:00:00Z",
        "sites": {"glos:2": {"hours": values, "body": "lake-michigan",
                               "modelLat": 43.1, "modelLon": -87.8,
                               "modelDistanceKm": .2, "shoreDistanceKm": 5}},
    }


class LocationSampler:
    def location(self, _observation):
        return {"modelLat": 43.1, "modelLon": -87.8, "modelDistanceKm": .2,
                "shoreDistanceKm": 5}


class ScorecardTest(unittest.TestCase):
    def test_shallow_routes_surface_and_interpolates_hourly_time(self):
        pair = pairing.pair_observation(observation(1), forecast(), LocationSampler())
        self.assertEqual(pair["depthMethod"], "surface_layer")
        self.assertEqual(pair["modelDepthM"], 0)
        self.assertEqual(pair["forecastF"], 46.5)
        self.assertEqual(pair["leadHour"], 6.5)
        self.assertEqual(pair["timeInterpolationFraction"], .5)
        self.assertEqual(pair["validTime"], pair["observed"])
        self.assertEqual(pair["observationSource"], "GLOS Seagull")

    def test_deep_routes_3d_and_reuses_profile_interpolator(self):
        def profiles(_forecast, _observation, hour):
            return {"levelsM": [0, 1, 2, 4], "temperatureC": [10 + hour, 9 + hour, 8 + hour, 6 + hour],
                    "bottomM": 20}
        depth_sampler = pairing.ProfileDepthSampler(profiles)
        pair = pairing.pair_observation(observation(3), forecast(), LocationSampler(), depth_sampler)
        self.assertEqual(pair["depthMethod"], "interpolated_3d")
        self.assertEqual(pair["pairStatus"], "paired")
        # depth interpolation gives 13C at h6 and 14C at h7, then time interpolation gives 13.5C.
        self.assertAlmostEqual(pair["forecastF"], 56.3, places=1)

    def test_deep_without_3d_is_pending_never_surface(self):
        pair = pairing.pair_observation(observation(3), forecast(), LocationSampler())
        self.assertEqual(pair["pairStatus"], "pending_3d")
        self.assertEqual(pair["depthMethod"], "pending_3d")
        self.assertIsNone(pair["forecastF"])
        self.assertEqual(pair["modelDepthM"], 3)

    def test_unknown_depth_uses_documented_default_and_marks_assumed(self):
        pair = pairing.pair_observation(observation(None), forecast(), LocationSampler())
        self.assertEqual(pair["sensorDepthM"], 1)
        self.assertTrue(pair["depthAssumed"])
        self.assertEqual(pair["depthMethod"], "surface_layer")

    def test_ndbc_station_inherits_reviewed_lake_and_buoy_type(self):
        reading = observation(None)
        reading.update({
            "identity": "external:45006", "externalId": "45006",
            "name": "West Lake Superior - 30 NM NE of Ontonagon, MI",
            "source": "NOAA NDBC", "body": None, "type": None,
        })
        run = forecast()
        run["sites"] = {
            "glos:45006": {
                "externalId": "45006", "name": "West Lake Superior buoy",
                "body": "lake-superior", "type": "moored_buoy",
                "lat": reading["lat"], "lon": reading["lon"],
                "hours": [50.0] * 121, "modelLat": reading["lat"],
                "modelLon": reading["lon"], "modelDistanceKm": 0.2,
                "shoreDistanceKm": 30,
            },
        }
        pair = pairing.pair_observation(reading, run)
        self.assertEqual(pair["body"], "lake-superior")
        self.assertEqual(pair["stationType"], "offshore_buoy")
        self.assertEqual(pair["modelVersion"], "LSOFS:COMF-3.6:2024-09-09")
        self.assertTrue(pair["depthAssumed"])
        self.assertEqual(pair["sensorDepthM"], 1)

    def test_uncovered_station_is_countable_not_fabricated(self):
        pair = pairing.pair_observation(observation(1), forecast())
        # Frozen site remains valid when present; remove it to represent no exact-water coverage.
        no_site = forecast()
        no_site["sites"] = {}
        pair = pairing.pair_observation(observation(1), no_site)
        self.assertEqual(pair["pairStatus"], "uncovered")
        self.assertIsNone(pair["forecastF"])

    def test_unknown_lake_never_uses_a_combined_grid_value(self):
        reading = observation(1)
        reading.update({"identity": "external:unknown", "externalId": "unknown", "body": None})
        run = forecast()
        run["sites"] = {}

        class CombinedGridSampler(LocationSampler):
            def sample(self, *_args):
                return {"value": 54.0}

        pair = pairing.pair_observation(reading, run, CombinedGridSampler())
        self.assertEqual(pair["pairStatus"], "uncovered")
        self.assertEqual(pair["sampleMethod"], "uncovered")
        self.assertIsNone(pair["forecastF"])
        self.assertEqual(pair["modelVersion"], "GLOFS-uncovered:COMF-3.6:2024-09-09")

    def test_every_emitted_enum_value_matches_production_migration_allowed_sets(self):
        migration = (JOB.parent.parent.parent / "supabase" / "migrations" /
                     "20261006150000_create_lake_map_temperature_scorecard.sql").read_text()
        migration_values = {}
        for field in scorecard_schema.CONSTRAINED_TEXT_VALUES:
            match = re.search(rf"{field} in \(([^)]+)\)", migration)
            self.assertIsNotNone(match, field)
            migration_values[field] = frozenset(re.findall(r"'([^']+)'", match.group(1)))
        self.assertEqual(migration_values, scorecard_schema.CONSTRAINED_TEXT_VALUES)

        emitted = {}
        for source in (pairing.EMITTED_CONSTRAINED_VALUES, scorecard.EMITTED_CONSTRAINED_VALUES):
            for field, values in source.items():
                emitted[field] = emitted.get(field, frozenset()) | values
        self.assertEqual(set(emitted), set(migration_values))
        for field, values in emitted.items():
            self.assertLessEqual(values, migration_values[field], field)

    def test_schema_preflight_covers_cross_column_and_range_constraints(self):
        pair = pairing.pair_observation(observation(1), forecast(), LocationSampler())
        record = scorecard.records_from_evidence(
            {"methodologyVersion": "test-v2", "primaryPairs": [pair]},
            "validation/evidence.json", "a" * 64,
        )[0]
        self.assertEqual(scorecard_schema.validate_record(record), [])
        record["sample_method"] = "future_method"
        record["model_distance_km"] = 6.1
        record["valid_time"] = "2026-10-06T12:31:00Z"
        errors = scorecard_schema.validate_record(record)
        self.assertIn("sample_method:allowed_set", errors)
        self.assertIn("model_distance_km:range", errors)
        self.assertIn("valid_time:observation_time", errors)

    def test_projection_keeps_nullable_pending_depth_model_and_version(self):
        pair = pairing.pair_observation(observation(3), forecast(), LocationSampler())
        evidence = {"methodologyVersion": "test-v2", "primaryPairs": [pair]}
        record = scorecard.records_from_evidence(evidence, "validation/evidence.json", "a" * 64)[0]
        self.assertEqual(record["lead_hours"], 6.5)
        self.assertEqual(record["sensor_depth_m"], 3)
        self.assertEqual(record["model_depth_m"], 3)
        self.assertEqual(record["depth_method"], "pending_3d")
        self.assertIsNone(record["model_temperature_f"])
        self.assertEqual(record["model_version"], "LMHOFS:COMF-3.6:2024-09-09")

    def test_kill_switch_prevents_any_request_and_fail_open(self):
        evidence = {"methodologyVersion": "test-v2", "primaryPairs": [
            pairing.pair_observation(observation(1), forecast(), LocationSampler())]}
        def should_not_open(*_args, **_kwargs):
            raise AssertionError("network called while disabled")
        result = scorecard.sync_evidence(evidence, "key", "b" * 64, environment={}, opener=should_not_open)
        self.assertEqual(result["status"], "disabled")
        environment = {"LAKE_MAP_SCORECARD_ENABLED": "true", "SUPABASE_URL": "https://example.supabase.co",
                       "LAKE_MAP_SCORECARD_INTERNAL_KEY": "long-internal-test-key"}
        degraded = scorecard.sync_evidence(
            evidence, "key", "c" * 64, environment=environment,
            opener=lambda *_a, **_k: (_ for _ in ()).throw(OSError("private detail")))
        self.assertEqual(degraded["status"], "degraded")

    def test_schema_preflight_rejects_invalid_batch_before_network(self):
        pair = pairing.pair_observation(observation(1), forecast(), LocationSampler())
        pair["sampleMethod"] = "not_in_production_schema"
        evidence = {"methodologyVersion": "test-v2", "primaryPairs": [pair]}
        environment = {
            "LAKE_MAP_SCORECARD_ENABLED": "true",
            "SUPABASE_URL": "https://example.supabase.co",
            "LAKE_MAP_SCORECARD_INTERNAL_KEY": "long-internal-test-key",
        }

        def should_not_open(*_args, **_kwargs):
            raise AssertionError("network called for invalid scorecard batch")

        result = scorecard.sync_evidence(
            evidence, "validation/evidence.json", "d" * 64,
            environment=environment, opener=should_not_open,
        )
        self.assertEqual(result["status"], "invalid")
        self.assertEqual(result["invalidRows"], 1)
        self.assertEqual(result["violations"], {"sample_method:allowed_set": 1})


if __name__ == "__main__":
    unittest.main()
