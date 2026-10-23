import sys
import unittest
from pathlib import Path

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard_addon_override as override  # noqa: E402


class ScorecardAddonOverrideTest(unittest.TestCase):
    def test_override_is_narrow_and_quality_only(self):
        item = override.manifest("abc123", "2026-10-23T00:00:00Z")
        self.assertEqual(item["predicate"], {
            "station_id": "external:45209", "sample_method": "field_node",
        })
        self.assertEqual(item["set"], {"strict_quality": False})
        self.assertEqual(item["addQualityFlags"], ["sampler_unvalidated"])
        self.assertNotIn("delete", item)


if __name__ == "__main__":
    unittest.main()
