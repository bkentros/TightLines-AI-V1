"""Deterministic tests for the validation-only Seagull benchmark adapter."""
import sys
import unittest
from pathlib import Path

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

from lakemap import seagull  # noqa: E402


class SeagullBenchmarkTest(unittest.TestCase):
    def test_summary_contract_keeps_ordered_celsius_values(self):
        parsed = seagull.parse_summary({
            "timestamps": ["2026-10-01T13:00:00", "2026-10-01T14:00:00Z"],
            "water_temperature": [
                {"min": 10, "mean": 11, "max": 12},
                {"min": 10.5, "mean": 11.5, "max": 12.5},
            ],
            "nearby_models": ["ww3", "lmhofs", "lmhofs"],
        })
        self.assertEqual(parsed["models"], ["lmhofs", "ww3"])
        self.assertEqual(parsed["hours"][0]["validTime"], "2026-10-01T13:00:00Z")
        self.assertEqual(parsed["hours"][1]["meanC"], 11.5)

    def test_summary_rejects_unit_or_schema_drift(self):
        with self.assertRaisesRegex(ValueError, "Celsius contract"):
            seagull.parse_summary({
                "timestamps": ["2026-10-01T13:00:00Z"],
                "water_temperature": [{"min": 280, "mean": 281, "max": 282}],
            })

        with self.assertRaisesRegex(ValueError, "unordered"):
            seagull.parse_summary({
                "timestamps": ["2026-10-01T13:00:00Z", "2026-10-01T13:00:00Z"],
                "water_temperature": [
                    {"min": 10, "mean": 11, "max": 12},
                    {"min": 10, "mean": 11, "max": 12},
                ],
            })


if __name__ == "__main__":
    unittest.main()
