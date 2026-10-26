import sys
import unittest
from datetime import date, datetime, timezone
from pathlib import Path
from unittest import mock

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard_hourly_backfill as hourly  # noqa: E402


class HourlyBackfillTest(unittest.TestCase):
    def test_variable_mapping_supports_netcdf3_and_hdf5(self):
        netcdf = mock.Mock()
        netcdf.variables = {"temp": "classic"}
        hdf5 = {"temp": "hdf5"}
        self.assertEqual(hourly.NowcastCache._variables(netcdf)["temp"], "classic")
        self.assertEqual(hourly.NowcastCache._variables(hdf5)["temp"], "hdf5")

    def test_hour_means_round_and_count_without_crossing_day(self):
        base = {"identity": "station:x", "waterDepthM": 1.0, "waterF": 50.0,
                "waterQuality": "provider_qc", "qualityFlags": [], "source": "NOAA NDBC",
                "observed": datetime(2024, 7, 15, 0, 10, tzinfo=timezone.utc),
                "firstCollected": datetime(2024, 7, 15, 0, 10, tzinfo=timezone.utc),
                "depthKey": "1.00m", "body": "lake-michigan", "type": "buoy"}
        rows = [
            base,
            {**base, "observed": datetime(2024, 7, 15, 0, 20, tzinfo=timezone.utc), "waterF": 52.0},
            {**base, "observed": datetime(2024, 7, 15, 23, 45, tzinfo=timezone.utc)},
        ]
        result = hourly.hour_mean_rows(rows, date(2024, 7, 15))
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["observation_time"], "2024-07-15T00:00:00Z")
        self.assertEqual(result[0]["observed_temperature_f"], 51.0)
        self.assertEqual(result[0]["obs_count_in_hour"], 2)

    def test_pair_falls_back_to_field_node(self):
        row = {"observation_time": "2024-07-15T12:00:00Z", "waterbody": "lake-michigan",
               "station_lat": 43.0, "station_lon": -86.0}
        sampler = mock.Mock()
        sampler.station_value.return_value = None
        sampler.field_value.return_value = (20.0, datetime(2024, 7, 15, 12, tzinfo=timezone.utc),
                                             "nodd", 43.0, -86.0, 1.0, 6)
        result = hourly.pair_hours([row], sampler)[0]
        self.assertEqual(result["sample_method"], "field_node")
        self.assertEqual(result["model_source"], "nodd")
        self.assertEqual(result["lead_hours"], 0.0)
        self.assertEqual(result["nowcast_hour"], 6)

    def test_pair_skips_observation_without_coordinates(self):
        row = {"observation_time": "2026-09-01T12:00:00Z", "waterbody": "lake-superior",
               "station_lat": None, "station_lon": None}
        sampler = mock.Mock()
        self.assertEqual(hourly.pair_hours([row], sampler), [])
        sampler.station_value.assert_not_called()
        sampler.field_value.assert_not_called()


if __name__ == "__main__":
    unittest.main()
