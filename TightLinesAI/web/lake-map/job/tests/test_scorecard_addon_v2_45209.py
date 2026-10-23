import sys
import unittest
from unittest import mock
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard_addon_v2_45209 as addon_v2  # noqa: E402


class AddonV245209Test(unittest.TestCase):
    def test_fixed_field_pair_is_exact_time_lead_zero(self):
        pair = {"station": "external:45209", "pairStatus": "uncovered",
                "observed": "2024-07-15T03:10:00Z", "validTime": "2024-07-15T03:10:00Z",
                "body": "lake-huron", "stationLat": 43.129, "stationLon": -82.391,
                "sensorDepthM": 1.0}
        sampler = mock.Mock()
        sampler.locate.return_value = (9, 43.13, -82.39, 0.2)
        sampler.value_with_source.side_effect = [(20.0, "ncei"), (21.0, "nodd")]
        result = addon_v2.fix_pair(pair, sampler)
        self.assertEqual(result["cycle"], pair["observed"])
        self.assertEqual(result["validTime"], pair["observed"])
        self.assertEqual(result["leadHour"], 0.0)
        self.assertEqual(result["sampleMethod"], "field_node")
        self.assertEqual(result["modelSource"], "nodd")
        self.assertAlmostEqual(result["forecastF"], 68.3)

    def test_v2_marker_is_distinct_from_v1(self):
        key = addon_v2.marker_key("2024-07-15")
        self.assertIn("/_done/addon_v2/", key)
        self.assertNotIn("/_done/addon_v1/", key)

    def test_existing_station_file_pair_is_preserved(self):
        pair = {"station": "external:45209", "pairStatus": "paired",
                "sampleMethod": "station_file", "sensorDepthM": 1.0}
        self.assertEqual(addon_v2.fix_pair(pair, mock.Mock()), pair)


if __name__ == "__main__":
    unittest.main()
