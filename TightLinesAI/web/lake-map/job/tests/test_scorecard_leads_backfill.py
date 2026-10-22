import unittest
from datetime import datetime, timezone
from pathlib import Path
import sys

JOB = Path(__file__).resolve().parents[1]
if str(JOB) not in sys.path:
    sys.path.insert(0, str(JOB))

import scorecard_leads_backfill as leads  # noqa: E402


class ScorecardLeadsBackfillTest(unittest.TestCase):
    def test_target_cycle_uses_six_hour_cycle_and_matching_lead(self):
        observed = datetime(2024, 7, 15, 12, 5, tzinfo=timezone.utc)
        cycle = leads.target_cycle(observed, 24)
        self.assertEqual(cycle, datetime(2024, 7, 14, 12, tzinfo=timezone.utc))
        self.assertLess(abs((observed - cycle).total_seconds() / 3600 - 24), 3)

    def test_target_cycle_never_uses_cycle_after_observation_day(self):
        observed = datetime(2024, 7, 15, 23, 58, tzinfo=timezone.utc)
        for target in leads.TARGET_LEADS:
            cycle = leads.target_cycle(observed, target)
            self.assertIsNotNone(cycle)
            self.assertLessEqual(cycle.date(), observed.date())


if __name__ == "__main__":
    unittest.main()
