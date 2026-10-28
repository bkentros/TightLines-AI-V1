import sys
import unittest
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(JOB))

import satellite_field_stream as satellite


class SatelliteFieldStreamTests(unittest.TestCase):
    def test_points_are_open_water_evenly_spread_and_green_bay_is_represented(self):
        root = JOB.parent
        points = satellite.build_points(
            "lake-michigan", root / "static/geo.json", JOB / "research/stations_v1.csv",
        )
        self.assertEqual(300, len(points))
        self.assertEqual(300, len({item["point_id"] for item in points}))
        self.assertGreaterEqual(sum(item["green_bay"] for item in points), 50)
        self.assertTrue(all(item["shore_distance_km"] >= 3 for item in points))
        self.assertEqual({0, 1}, {item["input_parity"] for item in points})

    def test_marker_key_is_deterministic_and_private(self):
        from datetime import date
        key = satellite.marker_key("lake-erie", date(2023, 5, 1), date(2026, 10, 27))
        self.assertEqual(
            "private/scorecard/v1/satellite/v2/_done/lake=lake-erie/2023-05-01_2026-10-27.json",
            key,
        )


if __name__ == "__main__":
    unittest.main()
