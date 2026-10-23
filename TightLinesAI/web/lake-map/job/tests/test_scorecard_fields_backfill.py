import sys
import unittest
from unittest import mock
from datetime import datetime, timezone
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard_fields_backfill as fields  # noqa: E402
import scorecard_schema  # noqa: E402


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
            "station_id": "test:1", "sensor_key": "test:1:surface",
            "station_class": "nearshore_buoy", "source": "backfill",
            "observation_source": "test", "source_quality": "verified",
            "observed_temperature_f": 67.0, "depth_assumed": False,
            "strict_quality": False, "quality_flags": ["station_suspect_day"],
        }
        sampler = mock.Mock()
        sampler.locate.return_value = (7, 43.01, -86.01, 1.2)
        sampler.value_with_source.side_effect = [(20.0, "ncei"), (21.0, "nodd")]
        recovered, attempted = fields.recover([row], sampler)
        self.assertEqual(attempted, 1)
        self.assertEqual(len(recovered), 1)
        self.assertEqual(recovered[0]["sample_method"], "field_node")
        self.assertEqual(recovered[0]["pair_status"], "paired")
        self.assertAlmostEqual(recovered[0]["model_temperature_f"], 68.3)
        self.assertEqual(recovered[0]["valid_time"], row["observation_time"])
        self.assertEqual(recovered[0]["model_cycle"], row["observation_time"])
        self.assertEqual(recovered[0]["lead_hours"], 0.0)
        self.assertEqual(recovered[0]["quality_flags"], ["station_suspect_day"])
        self.assertFalse(recovered[0]["strict_quality"])
        self.assertEqual(recovered[0]["model_source"], "nodd")
        projected = {**recovered[0], "sample_method": "saved_surface_grid",
                     "evidence_key": "source", "evidence_sha256": "0" * 64}
        self.assertEqual(scorecard_schema.validate_record(projected), [])

    def test_nodd_key_uses_historical_and_current_layouts(self):
        old = datetime(2024, 7, 15, 6, tzinfo=timezone.utc)
        new = datetime(2025, 7, 15, 6, tzinfo=timezone.utc)
        self.assertIn("lmhofs/netcdf/202407/", fields.ArchivedFieldSampler.nodd_key("lmhofs", old, 3))
        self.assertIn("lmhofs/netcdf/2025/07/15/", fields.ArchivedFieldSampler.nodd_key("lmhofs", new, 3))


if __name__ == "__main__":
    unittest.main()
