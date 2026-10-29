"""Pure safety and methodology tests for the private hybrid shadow runner."""
import os
import sys
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))

import hybrid_shadow as shadow  # noqa: E402


class HybridShadowTest(unittest.TestCase):
    def test_metadata_keeps_multi_sensor_depth_catalog_value(self):
        rows = [{"station_id":"glos:74", "lat":"44.0", "lon":"-87.0",
                 "sensor_depth_m":"0.00;0.50;1.00", "alternate_station_ids":"45000"}]
        metadata, aliases = shadow.metadata_index(rows)
        self.assertEqual(metadata["glos:74"]["sensor_depth_m"], "0.00;0.50;1.00")
        self.assertEqual(metadata["glos:74"]["lat"], 44.)
        self.assertEqual(aliases["45000"], "glos:74")

    def test_workflow_is_private_isolated_and_bounded(self):
        workflow = (JOB.parents[3] / ".github/workflows/hybrid-shadow.yml").read_text()
        self.assertIn('cron: "37 * * * *"', workflow)
        self.assertIn('cron: "52 7 * * *"', workflow)
        self.assertEqual(workflow.count("timeout-minutes: 20"), 2)
        self.assertIn("permissions:\n  contents: read", workflow)
        self.assertIn("secrets.R2_BUCKET", workflow)
        self.assertIn('test "$SHADOW_R2_BUCKET" != "piercast-lake-map"', workflow)
        for forbidden in ("supabase", "upload-artifact", "lake-map-data.yml", "piercast-health"):
            self.assertNotIn(forbidden, workflow.lower())

    def test_write_guard_accepts_only_shadow_v1(self):
        shadow.ShadowStore.guard("shadow/v1/map-a5/2026/10/29/12.manifest.json")
        for key in ("latest.json", "runs/x", "shadow/v2/x", "shadow/v1/../latest.json"):
            with self.assertRaises(RuntimeError):
                shadow.ShadowStore.guard(key)

    def test_live_bucket_can_never_be_shadow_output(self):
        with self.assertRaises(RuntimeError):
            shadow.ShadowStore(object(), shadow.LIVE_BUCKET)

    def test_archive_discovery_uses_bounded_daily_prefixes(self):
        class Paginator:
            def paginate(self, **kwargs):
                prefix = kwargs["Prefix"]
                stamp = prefix.replace("observations/v1/", "").replace("/", "")
                return [{"Contents": [{"Key":f"{prefix}{stamp}T000007Z.json"}]}]
        class S3:
            def get_paginator(self, _name): return Paginator()
        start = datetime(2026, 10, 1, 12, 45, tzinfo=timezone.utc)
        end = start + timedelta(days=1)
        keys = shadow.observation_archive_keys(S3(), start, end)
        self.assertEqual(keys, [
            "observations/v1/2026/10/01/20261001T000007Z.json",
            "observations/v1/2026/10/02/20261002T000007Z.json",
        ])

    def test_station_suspect_rule_marks_adjacent_days_only_for_that_station(self):
        base = datetime(2026, 7, 10, 12, tzinfo=timezone.utc)
        metadata = {
            "a": {"station_id":"a", "station_class":"nearshore_buoy", "waterbody":"lake-michigan", "lat":43., "lon":-86.},
            "b": {"station_id":"b", "station_class":"nearshore_buoy", "waterbody":"lake-michigan", "lat":43.1, "lon":-86.},
        }
        rows = []
        for station in metadata:
            for offset in (-24, 0, 24):
                rows.append({"station_id":station, "time":base+timedelta(hours=offset), "water_f":60., "air_f":None,
                             "flags":set(), "lake":"lake-michigan", "class":"nearshore_buoy", "lat":metadata[station]["lat"], "lon":metadata[station]["lon"]})
        rows[1]["flags"].add("range")
        shadow.apply_causal_qc(rows, metadata)
        self.assertTrue(all("station_suspect_day" in row["flags"] for row in rows if row["station_id"] == "a"))
        self.assertTrue(all("station_suspect_day" not in row["flags"] for row in rows if row["station_id"] == "b"))

    def test_anchor_fade_uses_frozen_tau(self):
        params = {"v4":{"taus":{"nearshore_buoy|jul-aug":{"tau":24}}}}
        target = {"lake":"lake-michigan"}
        self.assertAlmostEqual(shadow.fade(8., 24, "anchor", target, params, 24), 8 / __import__("math").e)

    def test_scorecard_metrics(self):
        rows = [{"observed_f":60., "noaa_f":65., "candidate_f":61., "lake":"lake-michigan", "station_class":"harbor", "distance_band":"0-10"}]
        result = shadow.aggregate_scores(rows)["overall"]
        self.assertEqual(result["n"], 1)
        self.assertEqual(result["noaaMae"], 5.)
        self.assertEqual(result["candidateMae"], 1.)
        self.assertEqual(result["betterGt1"], 1.)

    def test_point_forecast_is_relative_to_shadow_issue_hour(self):
        cycle = datetime(2026, 7, 15, 0, tzinfo=timezone.utc)
        issued = cycle + timedelta(hours=5)
        forecast = {"_cycle": cycle, "sites": {"g": {"hours": list(range(121))}}, "pierSites": {}}
        metadata = {"g": {"station_id":"g", "station_class":"harbor", "waterbody":"lake-michigan",
                          "lat":43., "lon":-86., "alternate_station_ids":""}}
        states = {"g": {"correction":2., "slow":2., "ramp":1.}}
        params = {"v2":{"params":{"lake-michigan":{}}},
                  "v4":{"taus":{"harbor|jul-aug":{"tau":24}}}, "piers": {}}
        rows = shadow.point_rows(forecast, states, metadata, params, "point", issued)
        self.assertEqual(rows[0]["lead_hours"], 0)
        self.assertEqual(rows[0]["model_lead_hours"], 5)
        self.assertEqual(rows[0]["noaa_f"], 5.)
        self.assertEqual(rows[0]["valid_time"], "2026-07-15T05:00:00Z")

    def test_scorecard_includes_core_lead_breakdown(self):
        rows = [{"observed_f":60., "noaa_f":65., "candidate_f":61., "lake":"lake-michigan",
                 "station_class":"harbor", "distance_band":"0-10", "lead_hours":lead} for lead in (0, 24)]
        result = shadow.aggregate_scores(rows)
        self.assertEqual(set(result["byLead"]), {"0", "24"})


if __name__ == "__main__":
    unittest.main()
