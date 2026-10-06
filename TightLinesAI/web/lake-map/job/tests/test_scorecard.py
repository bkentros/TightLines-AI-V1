"""Private scorecard depth/time projection tests; no network/database access."""
from datetime import datetime, timezone
import json
import re
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

import scorecard  # noqa: E402
import scorecard_pairing as pairing  # noqa: E402
import scorecard_schema  # noqa: E402
import scorecard_job  # noqa: E402


def observation(depth=1.0, observed="2026-10-06T12:30:00Z"):
    return {
        "identity": "glos:2", "name": "Test buoy", "type": "moored_buoy",
        "body": "lake-michigan", "lat": 43.1, "lon": -87.8,
        "source": "GLOS Seagull", "parameterId": 7, "waterDepthM": depth,
        "depthKey": "unknown" if depth is None else f"{depth:.2f}m",
        "observed": datetime.fromisoformat(observed.replace("Z", "+00:00")),
        "waterF": 60, "waterQuality": "good", "qualityFlags": [],
        "firstCollected": datetime(2026, 10, 6, 12, 35, tzinfo=timezone.utc),
    }


def forecast():
    values = [float(hour + 40) for hour in range(121)]
    return {
        "run": "run-1", "cycle": "2026-10-06T06:00:00Z",
        "issuedAt": "2026-10-06T09:00:00Z",
        "sites": {"glos:2": {"hours": values, "body": "lake-michigan",
                               "modelLat": 43.1, "modelLon": -87.8,
                               "modelDistanceKm": .2, "shoreDistanceKm": 5}},
    }


class LocationSampler:
    def location(self, _observation):
        return {"modelLat": 43.1, "modelLon": -87.8, "modelDistanceKm": .2,
                "shoreDistanceKm": 5}


class Response:
    def __init__(self, status=200, payload=None):
        self.status = status
        self.payload = payload or {}

    def __enter__(self):
        return self

    def __exit__(self, *_args):
        return False

    def read(self):
        return json.dumps(self.payload).encode()


def evidence_with_pairs(count):
    template = pairing.pair_observation(observation(1), forecast(), LocationSampler())
    pairs = []
    for index in range(count):
        pair = dict(template)
        pair["station"] = f"station-{index:04d}"
        pair["stationName"] = f"Station {index:04d}"
        pairs.append(pair)
    return {"methodologyVersion": "test-v2", "primaryPairs": pairs}


SYNC_ENVIRONMENT = {
    "LAKE_MAP_SCORECARD_ENABLED": "true",
    "SUPABASE_URL": "https://example.supabase.co",
    "LAKE_MAP_SCORECARD_INTERNAL_KEY": "long-internal-test-key",
}


class ScorecardTest(unittest.TestCase):
    def test_validation_workflow_owns_scorecard_checks_and_replays(self):
        validation_workflow = JOB.parents[3] / ".github/workflows/lake-map-validation.yml"
        validation_mirror = JOB / "lake-map-validation.workflow.yml"
        validation_text = validation_workflow.read_text()
        self.assertEqual(validation_text, validation_mirror.read_text())
        self.assertIn('cron: "25 7 * * *"', validation_text)
        self.assertIn("python job/verify.py --upload", validation_text)
        self.assertIn("--fail-on-pipeline-error", validation_text)
        self.assertNotIn("OPEN_METEO_API_KEY", validation_text)
        self.assertIn("scorecard_preflight_only", validation_text)
        self.assertIn("scorecard_replay_only", validation_text)
        self.assertIn("scorecard_expected_records", validation_text)
        self.assertIn('--expected-records "$EXPECTED_RECORDS"', validation_text)
        self.assertIn(
            "if: inputs.scorecard_preflight_only != true && inputs.scorecard_replay_only != true",
            validation_text,
        )
        scorecard_job = validation_text.split("\n  scorecard:\n", 1)[1]
        self.assertIn(
            "TightLinesAI/supabase/migrations/20261006150000_create_lake_map_temperature_scorecard.sql",
            scorecard_job,
        )
        self.assertIn(
            'python job/scorecard_job.py --preflight-start "$PREFLIGHT_START" --preflight-end "$PREFLIGHT_END"',
            validation_text,
        )
        preflight_step = validation_text.split(
            "- name: Read-only production archive schema preflight", 1
        )[1].split("- name:", 1)[0]
        self.assertNotIn("--upload", preflight_step)
        self.assertNotIn("--sync", preflight_step)

    def test_range_preflight_reports_only_aggregate_constraint_results(self):
        original_collect = scorecard_job.collect
        calls = []
        try:
            def fake_collect(_s3, target):
                calls.append(target.isoformat())
                pair = pairing.pair_observation(observation(1, f"{target}T12:30:00Z"), {
                    **forecast(), "cycle": f"{target}T06:00:00Z",
                    "issuedAt": f"{target}T09:00:00Z",
                }, LocationSampler())
                return {
                    "methodologyVersion": "test-v2", "primaryPairs": [pair],
                    "coverage": {"stations": 1, "pairedCount": 1, "pending3dCount": 0,
                                 "uncoveredCount": 0},
                }
            scorecard_job.collect = fake_collect
            from io import StringIO
            summary = StringIO()
            result = scorecard_job.preflight_range(
                object(), datetime(2026, 10, 1).date(), datetime(2026, 10, 2).date(), summary,
            )
        finally:
            scorecard_job.collect = original_collect
        self.assertEqual(calls, ["2026-10-01", "2026-10-02"])
        self.assertEqual(result, {"dates": 2, "records": 2, "invalid_rows": 0, "violations": {}})
        self.assertIn("| 2026-10-01 | 1 | 1 | 1 | 0 | 0 | 0 |", summary.getvalue())

    def test_shallow_routes_surface_and_interpolates_hourly_time(self):
        pair = pairing.pair_observation(observation(1), forecast(), LocationSampler())
        self.assertEqual(pair["depthMethod"], "surface_layer")
        self.assertEqual(pair["modelDepthM"], 0)
        self.assertEqual(pair["forecastF"], 46.5)
        self.assertEqual(pair["leadHour"], 6.5)
        self.assertEqual(pair["timeInterpolationFraction"], .5)
        self.assertEqual(pair["validTime"], pair["observed"])
        self.assertEqual(pair["observationSource"], "GLOS Seagull")

    def test_deep_routes_3d_and_reuses_profile_interpolator(self):
        def profiles(_forecast, _observation, hour):
            return {"levelsM": [0, 1, 2, 4], "temperatureC": [10 + hour, 9 + hour, 8 + hour, 6 + hour],
                    "bottomM": 20}
        depth_sampler = pairing.ProfileDepthSampler(profiles)
        pair = pairing.pair_observation(observation(3), forecast(), LocationSampler(), depth_sampler)
        self.assertEqual(pair["depthMethod"], "interpolated_3d")
        self.assertEqual(pair["pairStatus"], "paired")
        # depth interpolation gives 13C at h6 and 14C at h7, then time interpolation gives 13.5C.
        self.assertAlmostEqual(pair["forecastF"], 56.3, places=1)

    def test_deep_without_3d_is_pending_never_surface(self):
        pair = pairing.pair_observation(observation(3), forecast(), LocationSampler())
        self.assertEqual(pair["pairStatus"], "pending_3d")
        self.assertEqual(pair["depthMethod"], "pending_3d")
        self.assertIsNone(pair["forecastF"])
        self.assertEqual(pair["modelDepthM"], 3)

    def test_unknown_depth_uses_documented_default_and_marks_assumed(self):
        pair = pairing.pair_observation(observation(None), forecast(), LocationSampler())
        self.assertEqual(pair["sensorDepthM"], 1)
        self.assertTrue(pair["depthAssumed"])
        self.assertEqual(pair["depthMethod"], "surface_layer")

    def test_ndbc_station_inherits_reviewed_lake_and_buoy_type(self):
        reading = observation(None)
        reading.update({
            "identity": "external:45006", "externalId": "45006",
            "name": "West Lake Superior - 30 NM NE of Ontonagon, MI",
            "source": "NOAA NDBC", "body": None, "type": None,
        })
        run = forecast()
        run["sites"] = {
            "glos:45006": {
                "externalId": "45006", "name": "West Lake Superior buoy",
                "body": "lake-superior", "type": "moored_buoy",
                "lat": reading["lat"], "lon": reading["lon"],
                "hours": [50.0] * 121, "modelLat": reading["lat"],
                "modelLon": reading["lon"], "modelDistanceKm": 0.2,
                "shoreDistanceKm": 30,
            },
        }
        pair = pairing.pair_observation(reading, run)
        self.assertEqual(pair["body"], "lake-superior")
        self.assertEqual(pair["stationType"], "offshore_buoy")
        self.assertEqual(pair["modelVersion"], "LSOFS:COMF-3.6:2024-09-09")
        self.assertTrue(pair["depthAssumed"])
        self.assertEqual(pair["sensorDepthM"], 1)

    def test_uncovered_station_is_countable_not_fabricated(self):
        pair = pairing.pair_observation(observation(1), forecast())
        # Frozen site remains valid when present; remove it to represent no exact-water coverage.
        no_site = forecast()
        no_site["sites"] = {}
        pair = pairing.pair_observation(observation(1), no_site)
        self.assertEqual(pair["pairStatus"], "uncovered")
        self.assertIsNone(pair["forecastF"])

    def test_unknown_lake_never_uses_a_combined_grid_value(self):
        reading = observation(1)
        reading.update({"identity": "external:unknown", "externalId": "unknown", "body": None})
        run = forecast()
        run["sites"] = {}

        class CombinedGridSampler(LocationSampler):
            def sample(self, *_args):
                return {"value": 54.0}

        pair = pairing.pair_observation(reading, run, CombinedGridSampler())
        self.assertEqual(pair["pairStatus"], "uncovered")
        self.assertEqual(pair["sampleMethod"], "uncovered")
        self.assertIsNone(pair["forecastF"])
        self.assertEqual(pair["modelVersion"], "GLOFS-uncovered:COMF-3.6:2024-09-09")

    def test_every_emitted_enum_value_matches_production_migration_allowed_sets(self):
        migration = (JOB.parent.parent.parent / "supabase" / "migrations" /
                     "20261006150000_create_lake_map_temperature_scorecard.sql").read_text()
        migration_values = {}
        for field in scorecard_schema.CONSTRAINED_TEXT_VALUES:
            match = re.search(rf"{field} in \(([^)]+)\)", migration)
            self.assertIsNotNone(match, field)
            migration_values[field] = frozenset(re.findall(r"'([^']+)'", match.group(1)))
        self.assertEqual(migration_values, scorecard_schema.CONSTRAINED_TEXT_VALUES)

        emitted = {}
        for source in (pairing.EMITTED_CONSTRAINED_VALUES, scorecard.EMITTED_CONSTRAINED_VALUES):
            for field, values in source.items():
                emitted[field] = emitted.get(field, frozenset()) | values
        self.assertEqual(set(emitted), set(migration_values))
        for field, values in emitted.items():
            self.assertLessEqual(values, migration_values[field], field)

    def test_schema_preflight_covers_cross_column_and_range_constraints(self):
        pair = pairing.pair_observation(observation(1), forecast(), LocationSampler())
        record = scorecard.records_from_evidence(
            {"methodologyVersion": "test-v2", "primaryPairs": [pair]},
            "validation/evidence.json", "a" * 64,
        )[0]
        self.assertEqual(scorecard_schema.validate_record(record), [])
        record["sample_method"] = "future_method"
        record["model_distance_km"] = 6.1
        record["valid_time"] = "2026-10-06T12:31:00Z"
        errors = scorecard_schema.validate_record(record)
        self.assertIn("sample_method:allowed_set", errors)
        self.assertIn("model_distance_km:range", errors)
        self.assertIn("valid_time:observation_time", errors)

    def test_projection_keeps_nullable_pending_depth_model_and_version(self):
        pair = pairing.pair_observation(observation(3), forecast(), LocationSampler())
        evidence = {"methodologyVersion": "test-v2", "primaryPairs": [pair]}
        record = scorecard.records_from_evidence(evidence, "validation/evidence.json", "a" * 64)[0]
        self.assertEqual(record["lead_hours"], 6.5)
        self.assertEqual(record["sensor_depth_m"], 3)
        self.assertEqual(record["model_depth_m"], 3)
        self.assertEqual(record["depth_method"], "pending_3d")
        self.assertIsNone(record["model_temperature_f"])
        self.assertEqual(record["model_version"], "LMHOFS:COMF-3.6:2024-09-09")

    def test_kill_switch_prevents_any_request_and_fail_open(self):
        evidence = {"methodologyVersion": "test-v2", "primaryPairs": [
            pairing.pair_observation(observation(1), forecast(), LocationSampler())]}
        def should_not_open(*_args, **_kwargs):
            raise AssertionError("network called while disabled")
        result = scorecard.sync_evidence(evidence, "key", "b" * 64, environment={}, opener=should_not_open)
        self.assertEqual(result["status"], "disabled")
        degraded = scorecard.sync_evidence(
            evidence, "key", "c" * 64, environment=SYNC_ENVIRONMENT,
            opener=lambda *_a, **_k: (_ for _ in ()).throw(OSError("private detail")),
            sleeper=lambda _seconds: None, jitter=lambda: 0,
        )
        self.assertEqual(degraded["status"], "degraded")
        self.assertEqual(degraded["failureCategory"], "network")
        self.assertEqual(degraded["batchIndex"], 0)
        self.assertEqual(degraded["attempts"], 4)

    def test_batch_retries_timeout_and_5xx_then_commits_without_failing(self):
        actions = [
            TimeoutError("detail must stay private"),
            Response(503),
            Response(200, {"status": "committed", "recordCount": 1}),
        ]
        delays = []
        states = []

        def opener(*_args, **_kwargs):
            action = actions.pop(0)
            if isinstance(action, Exception):
                raise action
            return action

        result = scorecard.sync_evidence(
            evidence_with_pairs(1), "key", "e" * 64,
            environment=SYNC_ENVIRONMENT, opener=opener,
            sleeper=delays.append, jitter=lambda: 0,
            progress_callback=states.append,
        )
        self.assertEqual(result["status"], "committed")
        self.assertEqual(result["recordCount"], 1)
        self.assertEqual(result["retryCount"], 2)
        self.assertEqual(delays, [1.0, 2.0])
        self.assertEqual(states[-1]["status"], "committed")

    def test_batch_stops_after_four_sanitized_attempts(self):
        result = scorecard.sync_evidence(
            evidence_with_pairs(1), "key", "f" * 64,
            environment=SYNC_ENVIRONMENT, opener=lambda *_a, **_k: Response(429),
            sleeper=lambda _seconds: None, jitter=lambda: 0,
        )
        self.assertEqual(result["status"], "degraded")
        self.assertEqual(result["recordCount"], 0)
        self.assertEqual(result["failureCategory"], "4xx")
        self.assertEqual(result["batchIndex"], 0)
        self.assertEqual(result["attempts"], 4)

    def test_resume_starts_at_first_unconfirmed_batch_and_counts_confirmed_rows(self):
        sent = []

        def opener(request, **_kwargs):
            batch = json.loads(request.data)["records"]
            sent.append(batch)
            return Response(200, {"status": "committed", "recordCount": len(batch)})

        result = scorecard.sync_evidence(
            evidence_with_pairs(501), "key", "1" * 64,
            environment=SYNC_ENVIRONMENT, opener=opener, resume_batch=1,
            sleeper=lambda _seconds: None, jitter=lambda: 0,
        )
        self.assertEqual(len(sent), 1)
        self.assertEqual(len(sent[0]), 1)
        self.assertEqual(result["status"], "committed")
        self.assertEqual(result["recordCount"], 501)
        self.assertEqual(result["resumedBatch"], 1)

    def test_private_r2_checkpoint_resumes_only_an_identical_record_set(self):
        records = scorecard.records_from_evidence(evidence_with_pairs(501), "key", "2" * 64)
        record_set = scorecard_job._record_set_digest(records)
        checkpoint = {
            "recordSetSha256": record_set, "candidateCount": 501, "nextBatch": 1,
        }
        with patch.object(scorecard_job.store, "read_json", return_value=checkpoint):
            self.assertEqual(scorecard_job._resume_batch(object(), "private-key", record_set, 501), 1)
            self.assertEqual(scorecard_job._resume_batch(object(), "private-key", "different", 501), 0)

        writes = []
        writer = scorecard_job._progress_writer(
            object(), "validation/scorecard/replay-progress/v1/2026-10-03.json",
            datetime(2026, 10, 3).date(), record_set, 501,
        )
        with patch.object(scorecard_job.store, "put", side_effect=lambda *_args: writes.append(_args)):
            writer({"status": "degraded", "nextBatch": 1, "confirmedRecords": 500,
                    "batchIndex": 1, "failureCategory": "timeout", "attempts": 4})
        payload = json.loads(writes[0][2])
        self.assertEqual(payload["failureCategory"], "timeout")
        self.assertEqual(payload["batchIndex"], 1)
        self.assertNotIn("error", payload)

    def test_expected_count_mismatch_stops_before_r2_or_supabase_writes(self):
        evidence = evidence_with_pairs(1)
        evidence["coverage"] = {
            "stations": 1, "frozenVerificationPairs": 1,
            "savedSurfaceGridPairs": 0,
        }
        environment = {
            **SYNC_ENVIRONMENT,
            "R2_ACCOUNT_ID": "account",
            "R2_ACCESS_KEY_ID": "access",
            "R2_SECRET_ACCESS_KEY": "secret",
        }
        with (
            patch.dict(scorecard_job.os.environ, environment, clear=True),
            patch.object(scorecard_job.store, "client", return_value=object()),
            patch.object(scorecard_job, "collect", return_value=evidence),
            patch.object(scorecard_job.store, "put") as put,
            patch.object(scorecard_job.scorecard, "sync_evidence") as sync,
        ):
            result = scorecard_job.main([
                "--date", "2026-10-03", "--upload", "--sync",
                "--expected-records", "2",
            ])
        self.assertEqual(result, 2)
        put.assert_not_called()
        sync.assert_not_called()

    def test_schema_preflight_rejects_invalid_batch_before_network(self):
        pair = pairing.pair_observation(observation(1), forecast(), LocationSampler())
        pair["sampleMethod"] = "not_in_production_schema"
        evidence = {"methodologyVersion": "test-v2", "primaryPairs": [pair]}
        environment = {
            "LAKE_MAP_SCORECARD_ENABLED": "true",
            "SUPABASE_URL": "https://example.supabase.co",
            "LAKE_MAP_SCORECARD_INTERNAL_KEY": "long-internal-test-key",
        }

        def should_not_open(*_args, **_kwargs):
            raise AssertionError("network called for invalid scorecard batch")

        result = scorecard.sync_evidence(
            evidence, "validation/evidence.json", "d" * 64,
            environment=environment, opener=should_not_open,
        )
        self.assertEqual(result["status"], "invalid")
        self.assertEqual(result["invalidRows"], 1)
        self.assertEqual(result["violations"], {"sample_method:allowed_set": 1})


if __name__ == "__main__":
    unittest.main()
