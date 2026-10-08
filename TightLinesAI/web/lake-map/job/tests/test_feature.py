import importlib.util
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

JOB = Path(__file__).resolve().parent.parent
MAP = JOB.parent
sys.path.insert(0, str(JOB))

spec = importlib.util.spec_from_file_location("feature", MAP / "static-build" / "feature.py")
feature = importlib.util.module_from_spec(spec)
spec.loader.exec_module(feature)


class FeatureFlagTest(unittest.TestCase):
    def test_production_requires_an_explicit_override(self):
        env = {"R2_ACCOUNT_ID": "account", "R2_ACCESS_KEY_ID": "key", "R2_SECRET_ACCESS_KEY": "secret",
               "R2_BUCKET": "piercast-lake-map"}
        with patch.dict(os.environ, env, clear=True), patch.object(feature.store, "client") as client:
            self.assertEqual(feature.main(["tempDepth", "off"]), 2)
        client.assert_not_called()

    def test_staging_preserves_other_flags_and_uses_short_cache(self):
        env = {"R2_ACCOUNT_ID": "account", "R2_ACCESS_KEY_ID": "key", "R2_SECRET_ACCESS_KEY": "secret",
               "R2_BUCKET": "piercast-lake-map-staging"}
        with patch.dict(os.environ, env, clear=True), patch.object(feature.store, "client", return_value=object()), \
             patch.object(feature.store, "read_json", return_value={"other": "on"}), \
             patch.object(feature.store, "put") as put:
            self.assertEqual(feature.main(["tempDepth", "on"]), 0)
        self.assertEqual(put.call_args.args[1], "map/features.json")
        self.assertEqual(put.call_args.args[3], "public, max-age=30")
        self.assertIn(b'"other":"on"', put.call_args.args[2])
        self.assertIn(b'"tempDepth":"on"', put.call_args.args[2])


if __name__ == "__main__":
    unittest.main()
