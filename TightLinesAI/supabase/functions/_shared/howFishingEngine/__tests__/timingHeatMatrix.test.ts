/**
 * Cross-product smoke tests: every region × selected months must obey
 * heat-stress timing invariants (no midday highlight when avoid_heat applies).
 *
 * Run: deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/timingHeatMatrix.test.ts
 */
import { assertEquals } from "jsr:@std/assert";
import { CANONICAL_REGION_KEYS } from "../contracts/region.ts";
import { runHowFishingReport } from "../runHowFishingReport.ts";

function pad2(m: number): string {
  return m < 10 ? `0${m}` : `${m}`;
}

const HOT_SPIKE_ENV = {
  pressure_history_mb: Array.from({ length: 24 }, () => 1015),
  wind_speed_mph: 6,
  cloud_cover_pct: 0,
  precip_24h_in: 0,
  precip_72h_in: 0,
  precip_7d_in: 0.1,
  daily_mean_air_temp_f: 76,
  prior_day_mean_air_temp_f: 52,
  day_minus_2_mean_air_temp_f: 48,
  hourly_air_temp_f: [
    55, 54, 53, 52, 52, 51, 51, 52, 58, 64, 70, 74, 78, 82, 85, 87, 88, 86, 82, 76, 72, 68, 62, 58,
  ],
  hourly_cloud_cover_pct: Array(24).fill(0),
};

const FRESHWATER_CONTEXTS = ["freshwater_lake_pond", "freshwater_river"] as const;

Deno.test("matrix: all regions × 12 months × freshwater contexts — heat flag never pairs with afternoon highlight", () => {
  for (const region of CANONICAL_REGION_KEYS) {
    for (let month = 1; month <= 12; month++) {
      for (const ctx of FRESHWATER_CONTEXTS) {
        const r = runHowFishingReport({
          latitude: 36,
          longitude: -86,
          state_code: "TN",
          region_key: region,
          local_date: `2026-${pad2(month)}-18`,
          local_timezone: "America/Chicago",
          context: ctx,
          environment: { ...HOT_SPIKE_ENV },
          data_coverage: {},
        });
        if (r.reliability === "low") continue;
        if (r.condition_context?.avoid_midday_for_heat) {
          assertEquals(
            r.highlighted_periods?.[2],
            false,
            `afternoon off when avoid_midday_for_heat (${region} ${ctx} month=${month})`,
          );
        }
      }
    }
  }
});
