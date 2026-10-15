"""No-upload post-merge lake-map canary contracts."""
import json
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

import canary  # noqa: E402


def write_complete_run(out: Path, run_id="run-1", cycle="2026-10-15T12:00:00Z"):
    run = out / "runs" / run_id
    for layer in ("temp", "wind", "waves"):
        (run / layer).mkdir(parents=True, exist_ok=True)
    frames = []
    for hour in range(121):
        name = f"{hour:03d}.png"
        for layer in ("temp", "wind", "waves"):
            (run / layer / name).write_bytes(b"frame")
        frames.append({"hour": hour, **{layer: f"{layer}/{name}" for layer in ("temp", "wind", "waves")}})
    (run / "manifest.json").write_text(json.dumps({"run": run_id, "frames": frames}))
    points = [{
        "cityId": f"city-{index}",
        "samples": [{"forecastHour": hour, "temperatureC": 10.0} for hour in range(121)],
    } for index in range(32)]
    (run / "piercast-points.json").write_text(json.dumps({
        "formatVersion": 1, "productId": "NOAA_NOS_LMHOFS_REGULARGRID", "units": "C",
        "forecastHours": 121, "source": "nodd", "run": run_id, "cycle": cycle, "points": points,
    }))
    (out / "latest.json").write_text(json.dumps({
        "run": run_id, "base": f"runs/{run_id}/", "cycle": cycle,
    }))


class CanaryTest(unittest.TestCase):
    def test_incomplete_current_window_falls_back_to_a_complete_prior_cycle(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            calls = []

            def fake_build(argv):
                calls.append(argv)
                out = Path(argv[argv.index("--out") + 1])
                if len(calls) == 2:
                    write_complete_run(out)
                return 0

            with patch.object(canary.build, "main", side_effect=fake_build):
                result = canary.run(root, datetime(2026, 10, 15, 15, tzinfo=timezone.utc))
            self.assertEqual(result["cycle"], "2026-10-15T12:00:00Z")
            self.assertEqual(len(calls), 2)
            self.assertIn("2026-10-15T09:00:00Z", calls[1])
            self.assertNotIn("--upload", calls[0] + calls[1])

    def test_artifact_validation_rejects_incomplete_frame_schema(self):
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp)
            write_complete_run(out)
            manifest = out / "runs/run-1/manifest.json"
            payload = json.loads(manifest.read_text())
            payload["frames"].pop()
            manifest.write_text(json.dumps(payload))
            with self.assertRaisesRegex(ValueError, "manifest is incomplete"):
                canary.validate_artifacts(out)


if __name__ == "__main__":
    unittest.main()
