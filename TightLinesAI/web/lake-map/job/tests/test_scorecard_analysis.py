from datetime import datetime, timezone
import sys
import unittest
from pathlib import Path

JOB = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(JOB))
import scorecard_analysis as analysis  # noqa: E402


def row(month, miss=1.0, station="s1", depth=1.0, lead=0, year=2025):
    return {"station_id": station, "sensor_depth_m": depth,
            "model_version": "LMHOFS:COMF-3.6:2024-09-16",
            "observation_time": datetime(year, month, 15, tzinfo=timezone.utc).isoformat(),
            "lead_hours": lead, "pair_status": "paired", "miss_c": miss, "quality_flags": []}


class AnalysisTest(unittest.TestCase):
    def test_groups_by_depth_month_lead_and_version(self):
        summary, _ = analysis.summarize([row(6, 1), row(6, -3), row(7, 2, depth=3, lead=24)])
        surface = next(item for item in summary if item["depth_band"] == "surface")
        deep = next(item for item in summary if item["depth_band"] != "surface")
        self.assertEqual(surface["sample_count"], 2)
        self.assertEqual(surface["mean_miss_c"], -1)
        self.assertEqual(surface["typical_miss_c"], 2)
        self.assertEqual(deep["depth_band"], "depth_to_10ft")

    def test_qc_and_pending_are_excluded_not_fabricated(self):
        bad = row(6, 50)
        bad["quality_flags"] = ["spike"]
        pending = row(6, 1)
        pending.update(pair_status="pending_3d", miss_c=None)
        summary, coverage = analysis.summarize([bad, pending])
        self.assertEqual(summary, [])
        self.assertEqual(sum(item["count"] for item in coverage), 2)

    def test_candidate_shrinks_and_fades_with_lead(self):
        training = [row(month, 2, year=year) for year in (2024, 2025) for month in (5, 6, 7) for _ in range(30)]
        now = analysis.candidate_bias(training, row(6, lead=0, year=2026))
        later = analysis.candidate_bias(training, row(6, lead=120, year=2026))
        self.assertGreater(now, later)
        self.assertGreater(later, 0)
        self.assertLess(now, 2)

    def test_candidate_learns_lead_fade_from_forecast_rows(self):
        training = []
        for year in (2024, 2025):
            for month in (5, 6, 7):
                training += [row(month, 2, lead=0, year=year) for _ in range(30)]
                training += [row(month, 1, lead=120, year=year) for _ in range(30)]
        target = row(6, lead=120, year=2026)
        learned = analysis.learned_lead_fade(training, target)
        self.assertGreater(learned, 0.4)
        self.assertLess(learned, 0.55)
        summary = analysis.lead_fade_summary(training)
        lead = next(item for item in summary if item["lead_hours"] == 120)
        self.assertEqual(lead["lead_0_samples"], 180)
        self.assertEqual(lead["lead_samples"], 180)

    def test_leave_one_season_out_compares_against_plain_noaa(self):
        rows = [row(month, 1.5, year=year) for year in (2024, 2025, 2026)
                for month in (5, 6, 7, 8, 9)]
        result = analysis.leave_one_season_out(rows)
        self.assertTrue(result)
        self.assertTrue(all(item["candidate_mae_c"] < item["noaa_mae_c"] for item in result))

    def test_correction_analysis_excludes_older_model_versions(self):
        current = [row(month, 1.5, year=year) for year in (2025, 2026)
                   for month in (5, 6, 7, 8, 9)]
        legacy = [row(month, 20, year=2024) for month in (5, 6, 7, 8)]
        for item in legacy:
            item["model_version"] = "LMHOFS:pre-COMF-3.6"
        result = analysis.leave_one_season_out(current + legacy)
        self.assertTrue(result)
        self.assertTrue(all(item["noaa_mae_c"] < 5 for item in result))

    def test_wind_associated_rises_and_drops_are_separate_from_normal(self):
        values = []
        for hour, temperature in ((0, 65), (6, 55), (12, 66), (18, 65)):
            item = row(6)
            item.update({
                "sensor_key": "surface", "observation_time": datetime(2025, 6, 15, hour,
                                                                         tzinfo=timezone.utc).isoformat(),
                "observed_temperature_f": temperature, "wind_speed_mph": 15,
                "wind_from_degrees": 270,
            })
            values.append(item)
        labels = analysis.condition_labels(values)
        conditions = [analysis.condition_for(item, labels) for item in values]
        self.assertEqual(conditions, ["normal", "wind_associated_upwelling",
                                      "wind_associated_downwelling", "normal"])
        summary, _ = analysis.summarize(values)
        self.assertEqual({item["condition"] for item in summary}, {
            "normal", "wind_associated_upwelling", "wind_associated_downwelling",
        })


if __name__ == "__main__":
    unittest.main()
