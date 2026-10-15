import http.client
import gzip
import json
import sys
import unittest
from pathlib import Path

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

from lakemap import net, source_health  # noqa: E402


class CircuitBreakerTest(unittest.TestCase):
    def test_state_is_a_private_small_r2_object(self):
        class RecordingS3:
            def put_object(self, **kwargs):
                self.call = kwargs

        s3 = RecordingS3()
        source_health.save(s3, source_health.initial_state())
        self.assertEqual(s3.call["Key"], source_health.STATE_KEY)
        self.assertEqual(s3.call["CacheControl"], "private, no-store")
        body = gzip.decompress(s3.call["Body"])
        self.assertLess(len(body), 2048)
        self.assertEqual(json.loads(body)["circuit"], "open")

    def test_failure_opens_circuit_and_next_cycle_starts_on_nodd(self):
        state = source_health.initial_state()
        state["circuit"] = "closed"
        state["lastFailureType"] = "none"
        state = source_health.record_thredds_result(
            state, "2026-10-14T06:00:00Z", "http_5xx", kind="build"
        )
        self.assertTrue(source_health.is_open(state))
        source, reason = source_health.choose_source(state, "2026-10-14T12:00:00Z")
        self.assertEqual(source, "nodd")
        self.assertIn("http_5xx", reason)

    def test_two_consecutive_healthy_cycle_probes_close_circuit(self):
        state = source_health.initial_state()
        state = source_health.record_thredds_result(
            state, "2026-10-14T12:00:00Z", "success", kind="probe"
        )
        self.assertTrue(source_health.is_open(state))
        self.assertEqual(state["consecutiveHealthyProbes"], 1)
        state = source_health.record_thredds_result(
            state, "2026-10-14T18:00:00Z", "success", kind="probe"
        )
        self.assertFalse(source_health.is_open(state))
        self.assertEqual(
            source_health.choose_source(state, "2026-10-15T00:00:00Z")[0],
            "thredds",
        )

    def test_failed_probe_resets_recovery_streak(self):
        state = source_health.record_thredds_result(
            source_health.initial_state(), "2026-10-14T12:00:00Z", "success", kind="probe"
        )
        state = source_health.record_thredds_result(
            state, "2026-10-14T18:00:00Z", "timeout", kind="probe"
        )
        self.assertTrue(source_health.is_open(state))
        self.assertEqual(state["consecutiveHealthyProbes"], 0)
        self.assertEqual(state["lastFailureType"], "timeout")

    def test_repeated_probe_of_same_cycle_counts_once(self):
        state = source_health.record_thredds_result(
            source_health.initial_state(), "2026-10-14T12:00:00Z", "success", kind="probe"
        )
        state = source_health.record_thredds_result(
            state, "2026-10-14T12:00:00Z", "success", kind="probe"
        )
        self.assertTrue(source_health.is_open(state))
        self.assertEqual(state["consecutiveHealthyProbes"], 1)

    def test_depth_follows_the_surface_cycle_source(self):
        state = source_health.record_source(
            source_health.initial_state(), "2026-10-14T12:00:00Z",
            "surface", "nodd", "circuit open",
        )
        source, reason = source_health.source_for_depth(state, "2026-10-14T12:00:00Z")
        self.assertEqual(source, "nodd")
        self.assertIn("surface cycle decision", reason)

    def test_failure_types_are_stable_and_do_not_expose_urls(self):
        self.assertEqual(source_health.classify_failure(net.HttpError(404, "https://noaa.test/a")), "http_404")
        self.assertEqual(source_health.classify_failure(net.HttpError(503, "https://noaa.test/a")), "http_5xx")
        self.assertEqual(
            source_health.classify_failure(http.client.IncompleteRead(b"partial", 20)),
            "incomplete_read",
        )
        self.assertEqual(source_health.classify_failure(ConnectionResetError()), "connection_reset")
        self.assertEqual(source_health.classify_failure(TimeoutError()), "timeout")


if __name__ == "__main__":
    unittest.main()
