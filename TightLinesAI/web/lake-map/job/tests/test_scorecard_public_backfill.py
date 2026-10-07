import sys
import unittest
from datetime import date, datetime, timezone
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard
import scorecard_public_backfill as backfill
import scorecard_schema


class FakeSampler:
    def __init__(self, available=True):
        self.available = available

    def locate(self, _model, _cycle, _observation):
        return {
            "node": 7, "modelLat": 43.0, "modelLon": -86.0,
            "modelDistanceKm": 0.4, "bottomM": 20.0,
            "levelsM": [0.5 + value for value in range(20)],
        }

    def profiles(self, _model, _cycle, _hour, nodes):
        return {node: [20.0 - value * 0.25 for value in range(20)] for node in nodes} if self.available else {}


def observation(depth, parameter):
    observed = datetime(2026, 10, 1, tzinfo=timezone.utc)
    return backfill._observation(
        "glos:49", "Muskegon Buoy", "GLOS Seagull", "lake-michigan", "moored_buoy",
        43.179, -86.361, observed, 62.0, depth, parameter, "good",
    )


class PublicBackfillTest(unittest.TestCase):
    def test_catalog_json_parser(self):
        text = 'export const A={"1":{"name":"x"}};\nexport const B={"2":{"name":"y"}};\n'
        self.assertEqual(backfill._json_export(text, "A", "B")["1"]["name"], "x")
        self.assertEqual(backfill._json_export(text, "B")["2"]["name"], "y")

    def test_nearest_observation_uses_half_hour_guard(self):
        row = observation(1.0, 1)
        self.assertEqual(backfill.nearest_observations([row], row["observed"]), [row])
        self.assertEqual(backfill.nearest_observations([row], row["observed"].replace(hour=1)), [])

    def test_surface_and_deep_rows_validate(self):
        pairs = backfill.build_pairs(date(2026, 10, 1), [observation(1.0, 1), observation(5.0, 2)], FakeSampler())
        self.assertEqual(len(pairs), 2)
        by_depth = {pair["sensorDepthM"]: pair for pair in pairs}
        self.assertEqual(by_depth[1.0]["depthMethod"], "surface_layer")
        self.assertEqual(by_depth[5.0]["depthMethod"], "interpolated_3d")
        self.assertTrue(all(pair["pairStatus"] == "paired" for pair in pairs))
        records = scorecard.records_from_evidence(
            {"methodologyVersion": "public-scorecard-backfill-v1", "primaryPairs": pairs},
            "public-backfill/v1/2026-10-01.json", "0" * 64,
        )
        self.assertEqual(scorecard_schema.validate_records(records)["invalidRows"], 0)

    def test_missing_deep_field_stays_pending(self):
        pairs = backfill.build_pairs(date(2026, 10, 1), [observation(5.0, 2)], FakeSampler(False))
        self.assertEqual(pairs[0]["pairStatus"], "pending_3d")
        self.assertIsNone(pairs[0]["forecastF"])

    def test_nonfinite_position_is_uncovered_without_fabricated_coordinates(self):
        row = observation(1.0, 1)
        row["lat"] = None
        row["lon"] = None
        row["qualityFlags"] = ["invalid_position"]
        pairs = backfill.build_pairs(date(2026, 10, 1), [row], FakeSampler())
        self.assertEqual(len(pairs), 1)
        pair = pairs[0]
        self.assertEqual(pair["pairStatus"], "uncovered")
        self.assertEqual(pair["sampleMethod"], "uncovered")
        self.assertIsNone(pair["forecastF"])
        self.assertIsNone(pair["stationLat"])
        self.assertIsNone(pair["stationLon"])
        self.assertIsNone(pair["modelLat"])
        self.assertIsNone(pair["modelLon"])
        self.assertIn("invalid_position", pair["qualityFlags"])
        records = scorecard.records_from_evidence(
            {"methodologyVersion": "public-scorecard-backfill-v1", "primaryPairs": pairs},
            "public-backfill/v1/2026-10-01.json", "0" * 64,
        )
        self.assertEqual(scorecard_schema.validate_records(records)["invalidRows"], 0)

    def test_observation_normalizes_nonfinite_coordinates_to_null(self):
        row = backfill._observation(
            "glos:bad", "Bad Position", "GLOS Seagull", "lake-michigan", "moored_buoy",
            float("nan"), float("inf"), datetime(2026, 10, 1, tzinfo=timezone.utc),
            62.0, 1.0, 1, "good",
        )
        self.assertIsNone(row["lat"])
        self.assertIsNone(row["lon"])
        self.assertEqual(row["qualityFlags"], ["invalid_position"])

    def test_quarantine_summary_counts_rows_without_dumping_source_values(self):
        records = [{"quality_flags": ["invalid_position"]}, {"quality_flags": []}]
        self.assertEqual(backfill.quarantine_summary(records, {"impossible_temperature": 1}), {
            "count": 2, "total": 3, "fraction": 2 / 3,
            "reasons": {"impossible_temperature": 1, "invalid_position": 1},
        })

    def test_deep_nonfinite_position_is_uncovered_not_surface_paired(self):
        row = observation(5.0, 2)
        row.update({"lat": None, "lon": None, "qualityFlags": ["invalid_position"]})
        pair = backfill.build_pairs(date(2026, 10, 1), [row], FakeSampler())[0]
        self.assertEqual(pair["pairStatus"], "uncovered")
        self.assertEqual(pair["depthMethod"], "pending_3d")
        self.assertEqual(pair["sampleMethod"], "uncovered")
        self.assertIsNone(pair["forecastF"])

    def test_source_quarantine_is_sanitized_and_day_bounded(self):
        ledger = backfill.SourceQuarantine()
        ledger.add("invalid_timestamp")
        ledger.add("impossible_temperature", datetime(2026, 8, 22, 12, tzinfo=timezone.utc))
        self.assertEqual(ledger.day("2026-08-22"), {"impossible_temperature": 1})
        self.assertEqual(dict(ledger.overall), {"invalid_timestamp": 1, "impossible_temperature": 1})


if __name__ == "__main__":
    unittest.main()
