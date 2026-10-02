"""PierCast production health check: decisions only (no network)."""
import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import health  # noqa: E402

NOW = datetime(2026, 10, 2, 13, 0, tzinfo=timezone.utc)
FRESH_MAP = {"run": "r", "generatedAt": "2026-10-02T09:30:00Z"}
FRESH_OBS = {"scheduledFor": "2026-10-02T12:45:00Z"}
FRESH_PC = '{"generatedAt":"2026-10-02T12:59:00Z","sourceIssuedAt":"2026-10-02T06:00:00Z","cities":[]}'


class HealthTest(unittest.TestCase):
    def test_all_fresh_is_healthy(self):
        self.assertEqual(health.evaluate(NOW, 200, FRESH_PC, FRESH_MAP, FRESH_OBS), [])

    def test_piercast_down_fails(self):
        problems = health.evaluate(NOW, 503, "", FRESH_MAP, FRESH_OBS)
        self.assertEqual(len(problems), 1)
        self.assertIn("HTTP 503", problems[0])

    def test_fallback_cycle_fails_so_the_owner_hears_about_it(self):
        old = FRESH_PC.replace("2026-10-02T06:00:00Z", "2026-10-01T18:00:00Z")  # 19 h
        problems = health.evaluate(NOW, 200, old, FRESH_MAP, FRESH_OBS)
        self.assertEqual(len(problems), 1)
        self.assertIn("fallback", problems[0])

    def test_stale_map_and_observations_fail(self):
        problems = health.evaluate(NOW, 200, FRESH_PC, {"run": "r", "generatedAt": "2026-10-01T20:00:00Z"},
                                   {"scheduledFor": "2026-10-02T11:30:00Z"})
        self.assertEqual(len(problems), 2)

    def test_missing_inputs_fail(self):
        problems = health.evaluate(NOW, 200, '{"cities":[]}', None, None)
        self.assertEqual(len(problems), 3)


if __name__ == "__main__":
    unittest.main()
