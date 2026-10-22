import sys
import unittest
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard_addon_backfill as addon  # noqa: E402


class ScorecardAddonBackfillTest(unittest.TestCase):
    def test_surface_native_node_is_reported_as_field_node(self):
        pairs = [{
            "pairStatus": "paired", "sampleMethod": "interpolated_3d",
            "sensorDepthM": 1.0, "depthMethod": "interpolated_3d",
        }, {
            "pairStatus": "paired", "sampleMethod": "station_file",
            "sensorDepthM": 3.0, "depthMethod": "interpolated_3d",
        }]
        self.assertEqual(addon.normalize_surface_field_methods(pairs), 1)
        self.assertEqual(pairs[0]["sampleMethod"], "field_node")
        self.assertEqual(pairs[0]["depthMethod"], "surface_layer")
        self.assertEqual(pairs[1]["sampleMethod"], "station_file")


if __name__ == "__main__":
    unittest.main()
