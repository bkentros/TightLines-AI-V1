import importlib.util
import os
import sys
import tempfile
import unittest
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch

import numpy as np

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

spec = importlib.util.spec_from_file_location("depth_job", JOB / "depth.py")
depth_job = importlib.util.module_from_spec(spec)
spec.loader.exec_module(depth_job)

from lakemap import ofs  # noqa: E402
from lakemap.config import OFS_MODELS, TEMP, TEMP16  # noqa: E402
from lakemap.dap import encode_dods  # noqa: E402

CYCLE = datetime(2026, 10, 2, 12, tzinfo=timezone.utc)


def latest():
    run = "20261002T12Z-10021430"
    cycle = "2026-10-02T12:00:00Z"
    return {"run": run, "base": f"runs/{run}/", "cycle": cycle,
            "inputs": {"temp": {model["id"]: cycle for model in OFS_MODELS}}}


class ConfigurationTest(unittest.TestCase):
    def test_only_reviewed_launch_depths_ship(self):
        self.assertEqual(depth_job.parse_depths(None), (10, 20, 30, 40, 50))
        self.assertEqual(depth_job.parse_depths("10,50"), (10, 50))
        with self.assertRaises(ValueError):
            depth_job.parse_depths("10,50,75,100,150")
        with self.assertRaises(ValueError):
            depth_job.parse_depths("10,60")
        with self.assertRaises(ValueError):
            depth_job.parse_depths("20,10")

    def test_capability_gate_and_u8_fallback(self):
        quiet = lambda *_: None
        self.assertFalse(depth_job.capabilities_allow_depth(None))
        self.assertFalse(depth_job.capabilities_allow_depth({"features": []}))
        caps = {"features": ["tempDepth"], "frameEncodings": ["u8"]}
        self.assertTrue(depth_job.capabilities_allow_depth(caps))
        self.assertIs(depth_job.choose_depth_grid("auto", caps, quiet), TEMP)
        self.assertIs(depth_job.choose_depth_grid("auto", {**caps, "frameEncodings": ["u8", "rgb16"]}, quiet), TEMP16)
        with self.assertRaises(depth_job.TemperatureIntegrityError):
            depth_job.choose_depth_grid("rgb16", caps, quiet)

    def test_surface_pointer_requires_one_coherent_cycle(self):
        run, cycle, cycles = depth_job.validate_surface_latest(latest())
        self.assertEqual(run, latest()["run"])
        self.assertEqual(cycle, CYCLE)
        self.assertEqual(set(cycles.values()), {CYCLE})
        bad = latest(); bad["base"] = "../production/"
        with self.assertRaises(depth_job.TemperatureIntegrityError):
            depth_job.validate_surface_latest(bad)
        mixed = latest(); mixed["inputs"]["temp"]["LSOFS"] = "2026-10-02T06:00:00Z"
        with self.assertRaises(depth_job.TemperatureIntegrityError):
            depth_job.validate_surface_latest(mixed)

    def test_manifest_has_optional_old_page_safe_fields(self):
        frames = [{"hour": 0, "validTime": "2026-10-02T12:00:00Z", "temp": "temp/000.png"}]
        manifest = depth_job.depth_manifest("surface", CYCLE, CYCLE, 30, TEMP16, frames)
        self.assertIsNone(manifest["depth"])
        self.assertIsNone(manifest["events"])
        self.assertEqual(manifest["depthFt"], 30)
        self.assertEqual(manifest["stepHours"], 3)
        self.assertEqual(manifest["grids"]["temp"]["encoding"], "rgb16")
        self.assertIn("estimates", manifest["note"])

    def test_pointer_publishes_only_five_launch_depths(self):
        pointer = depth_job.depth_pointer("surface", CYCLE, CYCLE, depth_job.parse_depths(None), TEMP16)
        self.assertEqual(pointer["depthsFt"], [10, 20, 30, 40, 50])
        self.assertEqual(pointer["base"], "runs/tdepth-surface/")
        self.assertEqual(pointer["encoding"], "rgb16")


class OfsDepthSlabTest(unittest.TestCase):
    def test_fetches_only_levels_needed_for_launch_depths(self):
        levels = np.array([0, 1, 2, 4, 6, 8, 10, 12, 15, 20, 25], np.float32)
        slab = np.arange(8 * 2 * 2, dtype=np.float32).reshape(1, 8, 2, 2) / 10 + 5
        responses = [encode_dods({"Depth": levels}), encode_dods({"temp": slab})]
        lm = ofs.LakeModel.__new__(ofs.LakeModel)
        lm.model = {"id": "TEST", "prefix": "test"}
        lm.cycle = CYCLE
        lm.shape = (2, 2)
        lm.flat = np.arange(4)
        lm.depth_m = np.full(4, 100.0)
        lm._aws = False
        lm._depth_levels_m = None
        with patch.object(ofs.net, "fetch", side_effect=responses) as fetch:
            values, byte_count = lm.depth_temperatures_c(0, (10, 20, 30, 40, 50))
        self.assertEqual(values.shape, (5, 4))
        self.assertGreater(byte_count, 0)
        self.assertIn("%5B2:1:9%5D", fetch.call_args_list[1].args[0])

    def test_nodd_native_source_fails_closed_for_depth(self):
        lm = ofs.LakeModel.__new__(ofs.LakeModel)
        lm.model = {"id": "LMHOFS", "prefix": "lmofs"}
        lm.cycle = CYCLE
        lm._aws = True
        lm.distribution = "NOAA_NODD_AWS"
        with self.assertRaisesRegex(ofs.DepthDataUnavailable, "NOAA_NODD_AWS"):
            lm.depth_temperatures_c(0, (10, 20, 30, 40, 50))


class PublicationSafetyTest(unittest.TestCase):
    def test_coverage_integrity_rejects_empty_and_low_coverage(self):
        expected = np.ones(100, bool)
        self.assertEqual(depth_job.validate_depth_coverage(np.ones(100), expected, "test"), 1.0)
        low = np.ones(100); low[:4] = np.nan
        with self.assertRaises(depth_job.TemperatureIntegrityError):
            depth_job.validate_depth_coverage(low, expected, "test")
        with self.assertRaises(depth_job.TemperatureIntegrityError):
            depth_job.validate_depth_coverage(np.ones(2), np.zeros(2, bool), "test")

    def test_upload_order_writes_pointer_last(self):
        with tempfile.TemporaryDirectory() as temp:
            run = Path(temp)
            for depth in (10, 20):
                folder = run / f"d{depth:03d}"
                (folder / "temp").mkdir(parents=True)
                (folder / "temp" / "000.png").write_bytes(b"png")
                (folder / "manifest.json").write_text("{}")
            (run / "verification.json").write_text("{}")
            (run / "timing.json").write_text("{}")
            pointer = {"base": "runs/tdepth-surface/", "run": "surface"}
            with patch.object(depth_job.store, "put") as put:
                depth_job.upload_depth_run(object(), run, pointer)
            timing = (run / "timing.json").read_text()
        keys = [call.args[1] for call in put.call_args_list]
        self.assertEqual(keys[-1], depth_job.DEPTH_POINTER_KEY)
        self.assertTrue(all(key.endswith(".png") for key in keys[:2]))
        self.assertLess(max(i for i, key in enumerate(keys) if key.endswith("manifest.json")),
                        keys.index("runs/tdepth-surface/verification.json"))
        self.assertIn("uploadSeconds", timing)

    def test_upload_failure_never_reaches_the_pointer(self):
        with tempfile.TemporaryDirectory() as temp:
            run = Path(temp)
            folder = run / "d010"
            (folder / "temp").mkdir(parents=True)
            (folder / "temp" / "000.png").write_bytes(b"png")
            (folder / "manifest.json").write_text("{}")
            (run / "verification.json").write_text("{}")
            (run / "timing.json").write_text("{}")
            pointer = {"base": "runs/tdepth-surface/", "run": "surface"}
            with patch.object(depth_job.store, "put", side_effect=RuntimeError("upload failed")) as put:
                with self.assertRaises(RuntimeError):
                    depth_job.upload_depth_run(object(), run, pointer)
        self.assertNotIn(depth_job.DEPTH_POINTER_KEY, [call.args[1] for call in put.call_args_list])

    def test_capability_gate_exits_before_noaa(self):
        env = {"R2_ACCOUNT_ID": "account", "R2_ACCESS_KEY_ID": "key", "R2_SECRET_ACCESS_KEY": "secret",
               "R2_BUCKET": "piercast-lake-map-staging"}
        with patch.dict(os.environ, env, clear=True), patch.object(depth_job.store, "client", return_value=object()), \
             patch.object(depth_job.store, "read_json", return_value={"features": []}), \
             patch.object(depth_job.store, "read_latest") as latest_read, \
             patch.object(depth_job.ofs, "prepare_regridders") as prepare:
            self.assertEqual(depth_job.main(["--upload"]), 0)
        latest_read.assert_not_called()
        prepare.assert_not_called()

    def test_force_is_refused_for_production(self):
        env = {"R2_ACCOUNT_ID": "account", "R2_ACCESS_KEY_ID": "key", "R2_SECRET_ACCESS_KEY": "secret",
               "R2_BUCKET": "piercast-lake-map"}
        with patch.dict(os.environ, env, clear=True), patch.object(depth_job.store, "client") as client:
            self.assertEqual(depth_job.main(["--upload", "--force"]), 2)
        client.assert_not_called()


if __name__ == "__main__":
    unittest.main()
