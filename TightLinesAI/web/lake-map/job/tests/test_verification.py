"""Deterministic forecast-verification tests; no network or R2 access."""
import io
import json
import os
import sys
import tempfile
import unittest
from datetime import date
from pathlib import Path
from unittest.mock import patch

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

import verify  # noqa: E402


def station(**changes):
    value = {
        "id": "GLOS-2", "externalId": "45013", "glosDatasetId": 2,
        "lat": 43.098, "lon": -87.8496, "body": "lake-michigan",
        "waterTime": "2026-10-02T12:00:00Z", "waterF": 60.0,
        "waterDepthM": 1.0, "waterSurface": False, "waterQuality": "good",
    }
    value.update(changes)
    return value


def forecast(cycle="2026-10-01T12:00:00Z", value=62.0):
    return {
        "run": "run-1", "cycle": cycle, "issuedAt": "2026-10-01T15:30:00Z",
        "sites": {"glos:2": {
            "glosDatasetId": 2, "externalId": "45013", "lat": 43.098, "lon": -87.8496,
            "body": "lake-michigan", "modelDistanceKm": 0.2, "hours": [value] * 121,
        }},
    }


class VerificationTest(unittest.TestCase):
    def test_optional_benchmark_is_joined_from_its_bounded_validation_key(self):
        class S3:
            def get_object(self, **kwargs):
                self.key = kwargs["Key"]
                return {"Body": io.BytesIO(json.dumps({"capturedAt": "2026-10-01T16:00:00Z", "sites": {}}).encode())}

        s3 = S3()
        forecasts = [{"run": "run-1", "benchmarkRefs": {
            "seagullModelSummaryV1": "validation/benchmarks/seagull/v1/run-1.json",
        }}]
        verify.hydrate_benchmarks(s3, forecasts)
        self.assertEqual(s3.key, "validation/benchmarks/seagull/v1/run-1.json")
        self.assertEqual(forecasts[0]["benchmarks"]["seagullModelSummaryV1"]["sites"], {})

    def test_env_loader_accepts_colon_and_smart_quotes_without_overwriting_process_values(self):
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / ".env"
            path.write_text("R2_ACCOUNT_ID: ‘account’\nR2_ACCESS_KEY_ID=existing-file\nR2_SECRET_ACCESS_KEY: secret\n")
            with patch.dict(os.environ, {"R2_ACCESS_KEY_ID": "process-value"}, clear=True):
                verify.load_env_file(path)
                self.assertEqual(os.environ["R2_ACCOUNT_ID"], "account")
                self.assertEqual(os.environ["R2_ACCESS_KEY_ID"], "process-value")
                self.assertEqual(os.environ["R2_SECRET_ACCESS_KEY"], "secret")

    def test_snapshots_deduplicate_an_unchanged_sensor_reading(self):
        snapshots = [{"stations": [station()]}, {"stations": [station()]}]
        observations = verify.unique_observations(snapshots)
        self.assertEqual(len(observations), 1)
        self.assertEqual(observations[0]["identity"], "glos:2")

    def test_merged_marker_keeps_primary_and_profile_source_identities_separate(self):
        merged = station(
            waterIdentity="coops:9087031", coopsStationId="9087031", glosDatasetId=2,
            waterQuality="provider_qc", waterDepthM=None,
            profile=[{"identity": "glos:2", "source": "GLOS Seagull", "waterF": 61.0,
                      "time": "2026-10-02T12:00:00Z", "depthM": 1.0, "surface": False, "quality": "good"}],
        )
        observations = verify.unique_observations([{"stations": [merged]}])
        self.assertEqual({item["identity"] for item in observations}, {"coops:9087031", "glos:2"})
        strict = {item["identity"]: verify.is_strict(item) for item in observations}
        self.assertFalse(strict["coops:9087031"])
        self.assertTrue(strict["glos:2"])

    def test_pairs_use_as_issued_lead_and_strict_quality_contract(self):
        observations = verify.unique_observations([{"stations": [station()]}])
        pairs = list(verify.pairs_for(observations, [forecast()]))
        self.assertEqual(len(pairs), 1)
        self.assertEqual(pairs[0]["leadHour"], 24)
        self.assertTrue(pairs[0]["strict"])
        self.assertAlmostEqual(pairs[0]["errorC"], 2 * 5 / 9)

        not_evaluated = verify.unique_observations([{"stations": [station(waterQuality="not_evaluated")]}])
        self.assertFalse(next(verify.pairs_for(not_evaluated, [forecast()]))["strict"])
        unknown_depth = verify.unique_observations([{"stations": [station(waterDepthM=None, waterSurface=False)]}])
        self.assertFalse(next(verify.pairs_for(unknown_depth, [forecast()]))["strict"])

    def test_summary_reports_bias_rmse_tail_and_separates_context(self):
        observations = verify.unique_observations([{"stations": [
            station(waterF=60.0),
            station(id="GLOS-3", glosDatasetId=3, externalId="45029", lat=42.9, lon=-86.27,
                    waterF=64.0, waterQuality="not_evaluated"),
        ]}])
        model = forecast()
        model["sites"]["glos:3"] = {
            "glosDatasetId": 3, "externalId": "45029", "lat": 42.9, "lon": -86.27,
            "body": "lake-michigan", "hours": [62.0] * 121,
        }
        daily = verify.summarize(list(verify.pairs_for(observations, [model])), date(2026, 10, 2))
        strict = daily["metrics"]["primary"]["modelCycle"]["overall"]["strict"]
        context = daily["metrics"]["primary"]["modelCycle"]["overall"]["context"]
        self.assertEqual(strict["matches"], 1)
        self.assertEqual(context["matches"], 1)
        self.assertAlmostEqual(strict["biasC"], 1.111, places=3)
        self.assertAlmostEqual(context["biasC"], -1.111, places=3)
        self.assertEqual(daily["metrics"]["primary"]["modelCycle"]["byLead"]["strict"]["24"]["matches"], 1)

    def test_one_nearest_reading_per_sensor_depth_and_forecast_hour(self):
        readings = verify.unique_observations([{"stations": [
            station(waterTime="2026-10-02T11:40:00Z", waterF=59.0),
            station(waterTime="2026-10-02T12:10:00Z", waterF=60.0),
        ]}])
        pairs = list(verify.pairs_for(readings, [forecast()]))
        self.assertEqual(len(pairs), 1)
        self.assertEqual(pairs[0]["observed"], "2026-10-02T12:10:00Z")

    def test_product_score_excludes_prepublication_hours_and_persistence_never_looks_ahead(self):
        model = forecast(cycle="2026-10-01T12:00:00Z", value=62.0)
        truth = verify.unique_observations([{"stations": [station(
            waterTime="2026-10-01T16:00:00Z", waterF=60.0,
        )]}])
        history = verify.unique_observations([{"stations": [
            station(waterTime="2026-10-01T15:00:00Z", waterF=58.0),
            station(waterTime="2026-10-01T15:45:00Z", waterF=80.0),
            station(waterTime="2026-10-01T16:00:00Z", waterF=60.0),
        ]}])
        pairs = list(verify.pairs_for(truth, [model]))
        verify.attach_persistence(pairs, history)
        self.assertTrue(pairs[0]["productEligible"])
        self.assertEqual(pairs[0]["persistenceF"], 58.0)
        self.assertEqual(pairs[0]["persistenceObservedAt"], "2026-10-01T15:00:00Z")

        before = verify.unique_observations([{"stations": [station(
            waterTime="2026-10-01T15:00:00Z", waterF=60.0,
        )]}])
        self.assertFalse(next(verify.pairs_for(before, [model]))["productEligible"])

    def test_seagull_context_pair_uses_same_strict_observation_and_time(self):
        model = forecast(value=62.0)
        model["pierSites"] = {"grand_haven_mi": {
            "name": "Grand Haven", "lat": 43.0569, "lon": -86.2558, "hours": [62.0] * 121,
        }}
        model["benchmarks"] = {"seagullModelSummaryV1": {
            "capturedAt": "2026-10-01T15:31:00Z",
            "comparisonClass": "context-only-spatial-support-differs",
            "sites": {"grand_haven_mi": {"hours": [
                {"validTime": "2026-10-02T12:00:00Z", "minC": 15.0, "meanC": 16.0, "maxC": 17.0},
            ]}},
        }}
        observations = verify.unique_observations([{"stations": [station(
            lat=43.06, lon=-86.26, waterTime="2026-10-02T12:05:00Z",
        )]}])
        pairs = verify.head_to_head_pairs(observations, [model])
        self.assertEqual(len(pairs), 1)
        self.assertEqual(pairs[0]["pier"], "grand_haven_mi")
        self.assertEqual(pairs[0]["seagullMeanC"], 16.0)
        self.assertEqual(pairs[0]["comparisonClass"], "context-only-spatial-support-differs")
        self.assertTrue(pairs[0]["strict"])

    def test_cumulative_report_never_approves_a_correction(self):
        pairs = list(verify.pairs_for(verify.unique_observations([{"stations": [station()]}]), [forecast()]))
        daily = {"formatVersion": 1, **verify.summarize(pairs, date(2026, 10, 2))}
        report = verify.cumulative_report([daily], "2026-10-03T07:30:00Z")
        self.assertFalse(report["correctionApproved"])
        self.assertEqual(report["status"], "collecting")
        self.assertTrue(report["protocol"]["holdoutRequiredBeforeCorrection"])
        self.assertIn("productScore", report["protocol"])

    def test_first_partial_collector_day_warns_but_later_gap_is_an_error(self):
        empty = verify.summarize([], date(2026, 10, 1))
        first = {**empty, "collection": {
            "targetSnapshots": 8, "forecastRuns": 1, "strictPrimaryPairs": 0,
            "archiveStartDate": "2026-10-01", "sourceHealth": {},
        }}
        first_report = verify.cumulative_report([first], "2026-10-02T07:25:00Z")
        self.assertEqual(first_report["pipelineHealth"]["status"], "warning")
        self.assertEqual(first_report["pipelineHealth"]["warnings"][0]["kind"], "collector-startup-partial-day")

        later = {**verify.summarize([], date(2026, 10, 2)), "collection": {
            "targetSnapshots": 8, "forecastRuns": 1, "strictPrimaryPairs": 0,
            "archiveStartDate": "2026-10-01", "sourceHealth": {},
        }}
        later_report = verify.cumulative_report([first, later], "2026-10-03T07:25:00Z")
        self.assertEqual(later_report["pipelineHealth"]["status"], "error")


if __name__ == "__main__":
    unittest.main()
