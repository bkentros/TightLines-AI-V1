"""PierCast point-feed extraction contracts."""
import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

from lakemap import ofs, piercast  # noqa: E402

CYCLE = datetime(2026, 10, 14, 12, tzinfo=timezone.utc)


class PointFeedTest(unittest.TestCase):
    def test_checked_in_points_match_the_32_city_lmhofs_grid_contract(self):
        config = piercast.load_points()
        self.assertEqual(len(config["points"]), 32)
        self.assertEqual(len({point["cityId"] for point in config["points"]}), 32)
        self.assertEqual(config["grid"], {
            "south": 41.6, "west": -88.06, "rows": 478, "columns": 837,
            "resolution": 0.01,
        })

    def test_thredds_uses_each_exact_reviewed_row_and_column(self):
        config = piercast.load_points()
        flat = np.array([
            point["gridRow"] * 837 + point["gridColumn"]
            for point in config["points"]
        ], dtype=np.int64)
        order = np.argsort(flat)
        flat = flat[order]
        position_by_original = {int(original): index for index, original in enumerate(flat)}
        hours = {}
        for hour in range(121):
            values = np.empty(32, np.float32)
            for point in config["points"]:
                original = point["gridRow"] * 837 + point["gridColumn"]
                values[position_by_original[original]] = 4 + point["gridRow"] / 1000 + hour / 10000
            hours[hour] = values
        model = type("Model", (), {
            "shape": (478, 837), "flat": flat,
            "distribution": ofs.THREDDS_DISTRIBUTION,
        })()
        source = {"model": {"id": "LMHOFS"}, "lm": model, "hours": hours}
        feed = piercast.extract_point_feed([source], CYCLE, config)
        self.assertEqual(feed["sampleMethod"], "exact_lmhofs_regular_grid_cell")
        for point, output in zip(config["points"], feed["points"]):
            self.assertEqual(output["cityId"], point["cityId"])
            self.assertAlmostEqual(
                output["samples"][37]["temperatureC"],
                4 + point["gridRow"] / 1000 + 37 / 10000,
                places=5,
            )

    def test_payload_is_complete_and_pointer_names_the_same_run(self):
        config = piercast.load_points()
        feed = {
            "formatVersion": 1,
            "productId": config["productId"],
            "units": "C",
            "cycle": "2026-10-14T12:00:00Z",
            "source": "nodd",
            "sourceDistribution": ofs.NODD_DISTRIBUTION,
            "sampleMethod": "nodd_interpolated_to_exact_lmhofs_regular_grid_cell",
            "cityCount": 32,
            "forecastHours": 121,
            "points": [{
                **point,
                "samples": [{
                    "forecastHour": hour,
                    "validAt": f"2026-10-{14 + (12 + hour) // 24:02d}T{(12 + hour) % 24:02d}:00:00Z",
                    "temperatureC": 12.5,
                } for hour in range(121)],
            } for point in config["points"]],
        }
        payload = piercast.versioned_payload(
            feed, "20261014T12Z-10141700", datetime(2026, 10, 14, 17, tzinfo=timezone.utc)
        )
        self.assertTrue(piercast.validate_payload(payload))
        pointer = piercast.pointer(payload)
        self.assertEqual(pointer["run"], payload["run"])
        self.assertEqual(pointer["cycle"], payload["cycle"])
        self.assertEqual(pointer["base"], f"runs/{payload['run']}/")
        self.assertEqual(pointer["object"], "piercast-points.json")
        self.assertEqual(pointer["units"], "C")

    def test_incomplete_or_non_finite_feed_fails_closed(self):
        with self.assertRaises(piercast.PierCastPointIntegrityError):
            piercast.validate_payload({"formatVersion": 1, "points": []})


if __name__ == "__main__":
    unittest.main()
