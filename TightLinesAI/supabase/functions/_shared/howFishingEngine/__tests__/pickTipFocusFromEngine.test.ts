import { assert } from "jsr:@std/assert";
import { laneWeightsFromReport, pickTipFocusFromEngine } from "../narration/pickTipFocusFromEngine.ts";
import type { HowsFishingReport } from "../contracts/report.ts";
import type { LlmNormalizedVariableScore } from "../contracts/report.ts";
import { mulberry32Rng } from "../../howFishingPolish/mod.ts";

function stubReport(
  scores: LlmNormalizedVariableScore[],
  score = 62,
): HowsFishingReport {
  return {
    context: "freshwater_lake_pond",
    display_context_label: "Freshwater Lake/Pond",
    location: {
      latitude: 40,
      longitude: -74,
      state_code: "NJ",
      region_key: "northeast",
      timezone: "America/New_York",
      local_date: "2024-06-15",
    },
    score,
    band: "Good",
    summary_line: "",
    drivers: [],
    suppressors: [],
    actionable_tip: "",
    actionable_tip_tag: "general_flexibility",
    daypart_preset: null,
    reliability: "high",
    condition_context: {
      temperature_band: "optimal",
      temperature_trend: "steady",
      temperature_shock: "none",
      region_key: "northeast",
      available_variables: [],
      missing_variables: [],
      temperature_metabolic_context: "neutral",
      avoid_midday_for_heat: false,
      highlighted_dayparts_for_narration: ["morning", "afternoon"],
      normalized_variable_scores: scores,
      composite_contributions: [],
      environment_snapshot: {
        current_air_temp_f: 72,
        daily_mean_air_temp_f: 72,
        prior_day_mean_air_temp_f: null,
        day_minus_2_mean_air_temp_f: null,
        pressure_mb: 1013,
        wind_speed_mph: 8,
        cloud_cover_pct: 40,
        precip_24h_in: 0,
        precip_72h_in: 0,
        precip_7d_in: 0,
        active_precip_now: false,
        precip_rate_now_in_per_hr: 0,
        tide_movement_state: null,
        tide_station_id: null,
        current_speed_knots_max: null,
        sunrise_local: "05:30",
        sunset_local: "20:30",
        solunar_peak_count: 0,
        hourly_air_temp_sample_count: 24,
        hourly_cloud_cover_sample_count: 24,
        pressure_history_summary: null,
        tide_high_low_event_count: null,
        sky_narration_contract: null,
      },
    },
  } as unknown as HowsFishingReport;
}

Deno.test("laneWeights: bright light boosts offering_size_profile over flat baseline", () => {
  const bright = stubReport([
    { variable_key: "light_cloud_condition", engine_score: -1.2, engine_label: "bright" },
    { variable_key: "pressure_regime", engine_score: 0, engine_label: "stable_neutral" },
    { variable_key: "wind_condition", engine_score: 0, engine_label: "moderate" },
  ]);
  const neutral = stubReport([
    { variable_key: "light_cloud_condition", engine_score: 0.2, engine_label: "mixed" },
    { variable_key: "pressure_regime", engine_score: 0, engine_label: "stable_neutral" },
    { variable_key: "wind_condition", engine_score: 0, engine_label: "moderate" },
  ]);
  const wb = laneWeightsFromReport(bright);
  const wn = laneWeightsFromReport(neutral);
  assert(
    (wb.get("offering_size_profile") ?? 0) > (wn.get("offering_size_profile") ?? 0),
    "bright light should weight size/profile higher than neutral light",
  );
});

Deno.test("laneWeights: strong wind boosts finesse_vs_power", () => {
  const windy = stubReport([
    { variable_key: "wind_condition", engine_score: -1.6, engine_label: "strong" },
    { variable_key: "light_cloud_condition", engine_score: 0, engine_label: "mixed" },
  ]);
  const w = laneWeightsFromReport(windy);
  assert(
    (w.get("finesse_vs_power") ?? 0) > (w.get("retrieval_method") ?? 0),
    "strong wind should favor finesse_vs_power over retrieval_method",
  );
});

Deno.test("pickTipFocusFromEngine: fixed rng is deterministic", () => {
  const report = stubReport([
    { variable_key: "light_cloud_condition", engine_score: -1.2, engine_label: "bright" },
    { variable_key: "pressure_regime", engine_score: 0, engine_label: "stable_neutral" },
  ]);
  const a = pickTipFocusFromEngine(report, mulberry32Rng(99_001));
  const b = pickTipFocusFromEngine(report, mulberry32Rng(99_001));
  assert(a.lane === b.lane && a.instruction === b.instruction);
});
