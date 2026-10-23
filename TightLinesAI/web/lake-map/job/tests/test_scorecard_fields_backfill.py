import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard_fields_backfill as fields  # noqa: E402


class ScorecardFieldsBackfillTest(unittest.TestCase):
    def test_nowcast_request_uses_matching_hour_and_enclosing_cycle(self):
        valid, cycle, slot = fields.nowcast_request("2024-07-15T03:10:00Z")
        self.assertEqual(valid, datetime(2024, 7, 15, 3, tzinfo=timezone.utc))
        self.assertEqual(cycle, datetime(2024, 7, 15, 6, tzinfo=timezone.utc))
        self.assertEqual(slot, 3)
        valid, cycle, slot = fields.nowcast_request("2024-07-15T23:50:00Z")
        self.assertEqual(valid, datetime(2024, 7, 16, 0, tzinfo=timezone.utc))
        self.assertEqual(cycle, valid)
        self.assertEqual(slot, 6)

    def test_recover_marks_surface_field_node_and_preserves_quality(self):
        row = {
            "pair_status": "uncovered", "sensor_depth_m": 1.0,
            "station_lat": 43.0, "station_lon": -86.0,
            "waterbody": "lake-michigan", "observation_time": "2024-07-15T03:10:00Z",
            "strict_quality": False, "quality_flags": ["station_suspect_day"],
        }
        sampler = unittest.mock.Mock()
        sampler.locate.return_value = (7, 43.01, -86.01, 1.2)
        sampler.value.return_value = 20.0
        recovered, attempted = fields.recover([row], sampler)
        self.assertEqual(attempted, 1)
        self.assertEqual(len(recovered), 1)
        self.assertEqual(recovered[0]["sample_method"], "field_node")
        self.assertEqual(recovered[0]["pair_status"], "paired")
        self.assertEqual(recovered[0]["quality_flags"], ["station_suspect_day"])
        self.assertFalse(recovered[0]["strict_quality"])


if __name__ == "__main__":
    unittest.main()
