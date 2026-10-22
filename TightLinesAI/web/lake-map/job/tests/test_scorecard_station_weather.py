import json
import sys
from datetime import datetime, timezone
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard_station_weather as weather


def test_hourly_aggregation_uses_vector_direction_and_max_gust():
    rows = [
        {"station_id": "s1", "network": "ndbc", "time": datetime(2024, 7, 1, 0, 5, tzinfo=timezone.utc),
         "speed": 10.0, "direction": 350.0, "gust": 14.0, "air": 60.0},
        {"station_id": "s1", "network": "ndbc", "time": datetime(2024, 7, 1, 0, 35, tzinfo=timezone.utc),
         "speed": 14.0, "direction": 10.0, "gust": 18.0, "air": 64.0},
    ]
    result = weather.aggregate(rows)[0]
    assert result["wind_speed_mph"] == 12.0
    assert result["wind_gust_mph"] == 18.0
    assert result["air_temperature_f"] == 62.0
    assert min(result["wind_from_degrees"], 360 - result["wind_from_degrees"]) < 1e-9
    assert result["coverage_qc_flags"] == []


class FakeS3:
    def __init__(self):
        self.objects = {}

    def upload_file(self, filename, bucket, key, ExtraArgs=None):
        self.objects[key] = open(filename, "rb").read()

    def put_object(self, Bucket, Key, Body, **kwargs):
        self.objects[Key] = Body

    def head_object(self, Bucket, Key):
        assert Key in self.objects
        return {"ContentLength": len(self.objects[Key])}


def test_write_station_creates_manifest_and_done_marker(tmp_path, monkeypatch):
    monkeypatch.setattr(weather.store, "bucket", lambda: "private-test")
    s3 = FakeS3()
    rows = [{"station_id": "external:45001", "observation_hour": "2024-07-01T00:00:00Z",
             "observation_source": "ndbc", "wind_speed_mph": 5.0,
             "wind_from_degrees": 180.0, "wind_gust_mph": 8.0,
             "air_temperature_f": 60.0, "coverage_qc_flags": [], "sample_count": 1,
             "methodology_version": weather.METHODOLOGY}]
    key, marker_key = weather.write_station(
        rows, "external:45001", datetime(2024, 7, 1, tzinfo=timezone.utc),
        datetime(2024, 7, 31, 23, 59, tzinfo=timezone.utc), tmp_path, s3,
    )
    assert key in s3.objects
    marker = json.loads(s3.objects[marker_key])
    assert marker["rowCount"] == 1
    assert marker["fragmentKey"] == key
    assert marker["methodologyVersion"] == weather.METHODOLOGY
