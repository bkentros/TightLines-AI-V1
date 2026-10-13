import sys
import unittest
from pathlib import Path

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

import delivery  # noqa: E402


class DeliveryTest(unittest.TestCase):
    def test_pointer_cache_policy_accepts_only_short_revalidation_or_no_store(self):
        self.assertTrue(delivery.pointer_cache_is_safe("private, max-age=60, must-revalidate"))
        self.assertTrue(delivery.pointer_cache_is_safe("no-store"))
        self.assertFalse(delivery.pointer_cache_is_safe("public, max-age=120"))
        self.assertFalse(delivery.pointer_cache_is_safe("public, max-age=31536000, immutable"))
        self.assertFalse(delivery.pointer_cache_is_safe(None))

    def test_pop_is_read_from_cf_ray_without_exposing_query_data(self):
        self.assertEqual(delivery.pop_from_ray("a49f98a6ecd76089-ORD"), "ORD")
        self.assertEqual(delivery.pop_from_ray(None), "unknown")


if __name__ == "__main__":
    unittest.main()
