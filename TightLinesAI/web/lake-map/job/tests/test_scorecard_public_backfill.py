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


if __name__ == "__main__":
    unittest.main()
