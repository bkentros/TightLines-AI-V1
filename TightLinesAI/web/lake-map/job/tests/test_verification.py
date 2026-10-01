"""Deterministic forecast-verification tests; no network or R2 access."""
import sys
import unittest
from datetime import date
from pathlib import Path

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
        "run": "run-1", "cycle": cycle,
        "sites": {"glos:2": {
            "glosDatasetId": 2, "externalId": "45013", "lat": 43.098, "lon": -87.8496,
            "body": "lake-michigan", "modelDistanceKm": 0.2, "hours": [value] * 121,
        }},
    }


class VerificationTest(unittest.TestCase):
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
        strict = daily["metrics"]["overall"]["strict"]
        context = daily["metrics"]["overall"]["context"]
        self.assertEqual(strict["matches"], 1)
        self.assertEqual(context["matches"], 1)
        self.assertAlmostEqual(strict["biasC"], 1.111, places=3)
        self.assertAlmostEqual(context["biasC"], -1.111, places=3)
        self.assertEqual(daily["metrics"]["byLead"]["strict"]["24"]["matches"], 1)

    def test_cumulative_report_never_approves_a_correction(self):
        pairs = list(verify.pairs_for(verify.unique_observations([{"stations": [station()]}]), [forecast()]))
        daily = {"formatVersion": 1, **verify.summarize(pairs, date(2026, 10, 2))}
        report = verify.cumulative_report([daily], "2026-10-03T07:30:00Z")
        self.assertFalse(report["correctionApproved"])
        self.assertEqual(report["status"], "collecting")
        self.assertTrue(report["protocol"]["holdoutRequiredBeforeCorrection"])


if __name__ == "__main__":
    unittest.main()
