import tempfile
import unittest
import io
from pathlib import Path
from unittest import mock

import pyarrow.parquet as pq

import sys

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard_store  # noqa: E402


def record():
    return {
        "station_id": "station-1", "sensor_key": "sensor-1", "station_name": "Station",
        "station_class": "nearshore_buoy", "source": "backfill", "observation_source": "test",
        "waterbody": "lake-michigan", "station_lat": 43.0, "station_lon": -86.0,
        "sensor_depth_m": 1.0, "model_depth_m": 0.0, "depth_method": "surface_layer",
        "depth_assumed": False, "observation_time": "2026-10-01T12:00:00Z",
        "observation_offset_minutes": 0.0, "model_cycle": "2026-10-01T06:00:00Z",
        "valid_time": "2026-10-01T12:00:00Z", "lead_hours": 6.0,
        "lower_model_hour": 6, "upper_model_hour": 6, "time_interpolation_fraction": 0.0,
        "run_id": "run", "model_version": "LMHOFS:test", "pair_status": "paired",
        "observed_temperature_f": 60.0, "model_temperature_f": 58.0,
        "sample_method": "saved_surface_grid", "source_quality": "good", "quality_flags": [],
        "strict_quality": True, "evidence_key": "test/evidence.json",
        "evidence_sha256": "a" * 64, "methodology_version": "test-v1",
    }


class ScorecardStoreTest(unittest.TestCase):
    def test_fragment_is_private_content_addressed_and_round_trips(self):
        with tempfile.TemporaryDirectory() as temporary:
            environment = {"SCORECARD_STORE_DIR": temporary}
            manifest = scorecard_store.write_fragment(
                [record()], "backfill", "2026-10-01", "b" * 64, environment=environment,
            )
            self.assertTrue(manifest["key"].startswith("private/scorecard/v1/"))
            self.assertEqual(manifest["rowCount"], 1)
            path = Path(temporary) / manifest["key"]
            row = pq.read_table(path).to_pylist()[0]
            self.assertAlmostEqual(row["miss_f"], 2.0)
            self.assertAlmostEqual(row["miss_c"], 2.0 * 5 / 9)
            self.assertEqual(scorecard_store.read_rows(Path(temporary)), [row])

    def test_map_worker_allowlist_cannot_serve_private_prefix(self):
        worker = (JOB.parent / "gate" / "worker.js").read_text()
        allowlist = worker.split("const ALLOWED =", 1)[1].split(";", 1)[0]
        self.assertNotIn("private", allowlist)

    def test_done_marker_is_deterministic_and_verified(self):
        s3 = mock.Mock()
        bodies = {}

        def put_object(**kwargs):
            bodies[kwargs["Key"]] = kwargs["Body"]

        def get_object(**kwargs):
            return {"Body": io.BytesIO(bodies[kwargs["Key"]])}

        s3.put_object.side_effect = put_object
        s3.get_object.side_effect = get_object
        manifest = {
            "stream": "backfill", "date": "2023-11-20", "rowCount": 7,
            "evidenceSha256": "a" * 64,
            "key": "private/scorecard/v1/samples/stream=backfill/date=2023-11-20/abc.parquet",
        }
        marker = scorecard_store.write_done_marker(
            manifest, "method-v1", "code-v1", s3,
            environment={"R2_BUCKET": "private-test"},
        )
        key = "private/scorecard/v1/samples/stream=backfill/_done/date=2023-11-20.json"
        self.assertEqual(marker["fragmentKey"], manifest["key"])
        self.assertEqual(marker["manifestKey"], manifest["key"].replace(
            ".parquet", ".manifest.json"))
        self.assertEqual(marker["rowCount"], 7)
        self.assertEqual(marker["digest"], "a" * 64)
        s3.put_object.assert_called_once()
        s3.get_object.assert_called_once_with(Bucket="private-test", Key=key)

    def test_v2_fragment_and_marker_are_distinct_and_versioned(self):
        s3 = mock.Mock()
        bodies = {}
        s3.put_object.side_effect = lambda **kwargs: bodies.__setitem__(kwargs["Key"], kwargs["Body"])
        s3.get_object.side_effect = lambda **kwargs: {"Body": io.BytesIO(bodies[kwargs["Key"]])}
        with tempfile.TemporaryDirectory() as temporary:
            manifest = scorecard_store.write_fragment(
                [record()], "backfill", "2026-10-01", "c" * 64,
                environment={"SCORECARD_STORE_DIR": temporary},
                methodology_version="public-scorecard-backfill-v2", code_version="d" * 40,
            )
        self.assertIn("/methodology=v2/", manifest["key"])
        self.assertEqual(manifest["methodologyVersion"], "public-scorecard-backfill-v2")
        self.assertEqual(manifest["codeVersion"], "d" * 40)
        scorecard_store.write_done_marker(
            manifest, "public-scorecard-backfill-v2", "d" * 40, s3,
            environment={"R2_BUCKET": "private-test"},
        )
        self.assertIn(
            "private/scorecard/v1/samples/stream=backfill/_done/v2/date=2026-10-01.json",
            bodies,
        )

    def test_research_stream_paths_are_distinct(self):
        digest = "e" * 64
        self.assertEqual(
            scorecard_store.fragment_key("backfill_leads", "2026-10-01", digest),
            "private/scorecard/v1/samples/stream=backfill_leads/version=leads_v1/"
            "date=2026-10-01/eeeeeeeeeeeeeeeeeeeeeeee.parquet",
        )
        self.assertEqual(
            scorecard_store.done_marker_key("backfill_leads", "2026-10-01"),
            "private/scorecard/v1/samples/stream=backfill_leads/_done/leads_v1/"
            "date=2026-10-01.json",
        )


if __name__ == "__main__":
    unittest.main()
