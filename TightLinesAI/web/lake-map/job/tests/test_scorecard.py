"""Private scorecard projection tests; no network or database access."""
import io
import json
import sys
import unittest
from pathlib import Path

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

import scorecard  # noqa: E402


def evidence():
    return {
        "methodologyVersion": "test-v1",
        "primaryPairs": [{
            "run": "run-1", "cycle": "2026-10-06T06:00:00Z",
            "issuedAt": "2026-10-06T09:00:00Z", "validTime": "2026-10-06T12:00:00Z",
            "leadHour": 6, "station": "glos:2", "stationName": "Test buoy",
            "stationType": "nearshore_buoy", "rawStationType": "moored_buoy",
            "stationLat": 43.1, "stationLon": -87.8, "source": "GLOS Seagull",
            "body": "lake-michigan", "parameterId": 7, "depthM": 1,
            "depthKey": "1.00m", "observed": "2026-10-06T12:05:00Z",
            "observationOffsetMinutes": 5,
            "observedF": 60, "forecastF": 58, "modelLat": 43.1, "modelLon": -87.8,
            "modelDistanceKm": 0.2, "sampleMethod": "frozen_verification_site",
            "windMph": 11, "windFrom": 250, "windObservedAt": "2026-10-06T12:00:00Z",
            "windOffsetMinutes": 5, "quality": "good", "qualityFlags": [], "strict": True,
        }],
    }


class Response:
    status = 200

    def __enter__(self):
        return self

    def __exit__(self, *_):
        return False

    def read(self):
        return json.dumps({"status": "committed", "recordCount": 1}).encode()


class ScorecardTest(unittest.TestCase):
    def test_projection_has_requested_sign_lead_depth_wind_and_evidence(self):
        record = scorecard.records_from_evidence(evidence(), "validation/evidence.json", "a" * 64)[0]
        self.assertEqual(record["lead_hours"], 6)
        self.assertEqual(record["sensor_depth_m"], 1)
        self.assertEqual(record["wind_speed_mph"], 11)
        self.assertEqual(record["model_distance_km"], 0.2)
        self.assertEqual(record["observation_offset_minutes"], 5)
        self.assertEqual(record["evidence_sha256"], "a" * 64)
        self.assertEqual(record["observed_temperature_f"] - record["model_temperature_f"], 2)

    def test_kill_switch_prevents_any_request(self):
        def should_not_open(*_args, **_kwargs):
            raise AssertionError("network called while disabled")

        result = scorecard.sync_evidence(evidence(), "key", "b" * 64, environment={}, opener=should_not_open)
        self.assertEqual(result["status"], "disabled")

    def test_sync_is_committed_or_fail_open(self):
        environment = {
            "LAKE_MAP_SCORECARD_ENABLED": "true",
            "SUPABASE_URL": "https://example.supabase.co",
            "LAKE_MAP_SCORECARD_INTERNAL_KEY": "long-internal-test-key",
        }
        committed = scorecard.sync_evidence(
            evidence(), "key", "c" * 64, environment=environment,
            opener=lambda *_args, **_kwargs: Response(),
        )
        self.assertEqual(committed, {"status": "committed", "recordCount": 1, "candidateCount": 1})
        degraded = scorecard.sync_evidence(
            evidence(), "key", "c" * 64, environment=environment,
            opener=lambda *_args, **_kwargs: (_ for _ in ()).throw(OSError("private detail")),
        )
        self.assertEqual(degraded["status"], "degraded")


if __name__ == "__main__":
    unittest.main()
