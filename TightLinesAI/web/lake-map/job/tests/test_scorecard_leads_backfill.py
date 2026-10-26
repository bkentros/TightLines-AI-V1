import unittest
from datetime import datetime, timezone
from pathlib import Path
import sys
import tempfile
from unittest import mock

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

    def test_nodd_fallback_uses_public_archive(self):
        cycle = datetime(2024, 7, 15, 6, tzinfo=timezone.utc)
        with tempfile.TemporaryDirectory() as root:
            cache = leads.FileCache(Path(root))
            response = unittest.mock.MagicMock()
            response.__enter__.return_value.read.return_value = b"CDF-test"
            ncei_error = leads.urllib.error.HTTPError("redacted", 404, "missing", {}, None)
            with unittest.mock.patch.object(leads.urllib.request, "urlopen", side_effect=[ncei_error, response]):
                body, source = cache.station_file("lmhofs", cycle)
        self.assertEqual(body, b"CDF-test")
        self.assertEqual(source, "nodd")

    def test_build_day_reports_failed_cycle_category(self):
        observed = "2024-07-15T12:00:00Z"
        row = {"observation_time": observed, "waterbody": "lake-michigan"}
        cache = mock.Mock()
        cache.station_file.side_effect = RuntimeError("unavailable")
        with mock.patch.object(leads, "TARGET_LEADS", (6,)):
            records, counts, errors = leads.build_day([row], cache)
        self.assertEqual(records, [])
        self.assertEqual(counts, {})
        self.assertEqual(sum(errors.values()), 1)
        self.assertIn("RuntimeError", next(iter(errors)))

    def test_build_day_treats_confirmed_archive_gap_as_missing(self):
        observed = "2024-09-09T12:00:00Z"
        row = {"observation_time": observed, "waterbody": "lake-michigan"}
        cache = mock.Mock()
        cache.station_file.side_effect = leads.ArchiveMissing("absent")
        with mock.patch.object(leads, "TARGET_LEADS", (6,)):
            records, counts, errors = leads.build_day([row], cache)
        self.assertEqual(records, [])
        self.assertEqual(counts, {})
        self.assertEqual(errors, {})


if __name__ == "__main__":
    unittest.main()
