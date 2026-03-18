/**
 * How's Fishing rebuild engine — deno test
 * Run: deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/rebuildEngine.test.ts
 */
import { assert, assertEquals } from "jsr:@std/assert";
import { normalizePressureDetailed } from "../normalize/normalizePressure.ts";
import { normalizeTemperature } from "../normalize/normalizeTemperature.ts";
import { normalizeWind } from "../normalize/normalizeWind.ts";
import { normalizeLight } from "../normalize/normalizeLight.ts";
import { normalizePrecipitationDisruption } from "../normalize/normalizePrecip.ts";
import { normalizeRunoff } from "../normalize/normalizeRunoff.ts";
import {
  normalizeTideCurrentMovement,
  normalizeTideFromStage,
} from "../normalize/normalizeTide.ts";
import { bandFromScore, scoreDay } from "../score/scoreDay.ts";
import { computeActiveWeights } from "../score/reweight.ts";
import { buildSharedNormalizedOutput } from "../normalize/buildNormalized.ts";
import { runHowFishingReport } from "../runHowFishingReport.ts";
import { buildTipAndDaypart } from "../tips/buildTips.ts";
import type { SharedNormalizedOutput } from "../contracts/mod.ts";

Deno.test("pressure: two-point falling", () => {
  const r = normalizePressureDetailed([1013, 1010.5]);
  assert(r != null);
  assertEquals(r!.quality, "two_point");
  assertEquals(r!.state.label, "falling");
  assertEquals(r!.state.score, -1);
});

Deno.test("pressure: volatile with 3+ readings and large range", () => {
  const r = normalizePressureDetailed([1000, 1006, 1001]);
  assert(r != null);
  assertEquals(r!.state.label, "volatile");
  assertEquals(r!.state.score, -2);
});

Deno.test("temperature: Feb great_lakes_upper_midwest river 45F in warm band +2", () => {
  const t = normalizeTemperature(
    "freshwater_river",
    "great_lakes_upper_midwest",
    2,
    45,
    40,
    38
  );
  assert(t != null);
  assertEquals(t!.band_label, "warm");
  assertEquals(t!.band_score, 2);
});

Deno.test("temperature: shock from 10F day-over-day swing", () => {
  const t = normalizeTemperature(
    "freshwater_lake_pond",
    "northeast",
    5,
    70,
    58,
    57
  );
  assert(t != null);
  assertEquals(t!.shock_label, "sharp_warmup");
  assertEquals(t!.shock_adjustment, -1);
});

Deno.test("wind: mph thresholds and lake moderate +1", () => {
  assertEquals(normalizeWind(7, "freshwater_lake_pond")!.score, 0);
  assertEquals(normalizeWind(8, "freshwater_lake_pond")!.score, 1);
  assertEquals(normalizeWind(16, "freshwater_lake_pond")!.score, -1);
  assertEquals(normalizeWind(25, "freshwater_river")!.score, -2);
});

Deno.test("light: coastal bright 0 score", () => {
  assertEquals(normalizeLight(20, "coastal")!.score, 0);
  assertEquals(normalizeLight(70, "coastal")!.score, 1);
});

Deno.test("precip: active_disruption then recent_rain precedence", () => {
  const a = normalizePrecipitationDisruption(0.15, 0, 0, false);
  assertEquals(a!.label, "active_disruption");
  assertEquals(a!.score, -2);
  const r = normalizePrecipitationDisruption(0.05, 0.2, 0.4, false);
  assertEquals(r!.label, "recent_rain");
});

Deno.test("runoff: mountain_west low sensitivity vs gulf high", () => {
  const low = normalizeRunoff("mountain_west", 0.1, 0.2, 0.5);
  assertEquals(low!.label, "stable");
  const high = normalizeRunoff("gulf_coast", 1.0, 2.0, 5.0);
  assertEquals(high!.label, "blown_out");
});

Deno.test("tide: current knots strong_moving", () => {
  const t = normalizeTideCurrentMovement({ current_speed_knots_max: 2.0 });
  assertEquals(t!.label, "strong_moving");
  assertEquals(t!.score, 2);
});

Deno.test("tide: stage incoming -> moving", () => {
  const t = normalizeTideFromStage("incoming");
  assertEquals(t!.score, 1);
});

Deno.test("band mapping exact thresholds", () => {
  assertEquals(bandFromScore(0), "Poor");
  assertEquals(bandFromScore(39), "Poor");
  assertEquals(bandFromScore(40), "Fair");
  assertEquals(bandFromScore(57), "Fair");
  assertEquals(bandFromScore(58), "Good");
  assertEquals(bandFromScore(74), "Good");
  assertEquals(bandFromScore(75), "Excellent");
});

Deno.test("reweight: missing one variable redistributes to 100", () => {
  const available = new Set([
    "temperature_condition",
    "pressure_regime",
    "wind_condition",
    "light_cloud_condition",
  ]);
  const w = computeActiveWeights(
    "freshwater_lake_pond",
    "northeast",
    "2025-06-15",
    available
  );
  const sum = w.reduce((a, x) => a + x.finalWeight, 0);
  assert(Math.abs(sum - 100) < 0.01);
  assertEquals(w.length, 4);
});

function minimalNorm(
  overrides: Partial<SharedNormalizedOutput["normalized"]> = {}
): SharedNormalizedOutput {
  return {
    location: {
      latitude: 45,
      longitude: -93,
      state_code: "MN",
      region_key: "great_lakes_upper_midwest",
      local_date: "2025-02-10",
      local_timezone: "America/Chicago",
    },
    context: "freshwater_river",
    normalized: {
      temperature: {
        context_group: "freshwater",
        band_label: "warm",
        band_score: 2,
        trend_label: "stable",
        trend_adjustment: 0,
        shock_label: "none",
        shock_adjustment: 0,
        final_score: 2,
      },
      pressure_regime: { label: "stable_neutral", score: 0 },
      wind_condition: { label: "light", score: 0 },
      light_cloud_condition: { label: "mixed", score: 0 },
      runoff_flow_disruption: { label: "stable", score: 1 },
      ...overrides,
    },
    available_variables: [
      "temperature_condition",
      "pressure_regime",
      "wind_condition",
      "light_cloud_condition",
      "runoff_flow_disruption",
    ],
    missing_variables: [],
    data_gaps: [],
    reliability: "high",
  };
}

Deno.test("scoreDay: drivers from positive contributions only", () => {
  const s = scoreDay(minimalNorm());
  assert(s.drivers.length >= 1);
  assert(s.drivers.every((d) => d.weightedContribution > 0));
  assert(s.suppressors.every((x) => x.weightedContribution < 0));
  assert(s.score >= 0 && s.score <= 100);
});

Deno.test("runHowFishingReport: contract fields", () => {
  const req = {
    latitude: 44.9,
    longitude: -93.2,
    state_code: "MN",
    region_key: "great_lakes_upper_midwest" as const,
    local_date: "2025-02-15",
    local_timezone: "America/Chicago",
    context: "freshwater_river" as const,
    environment: {
      daily_mean_air_temp_f: 44,
      prior_day_mean_air_temp_f: 38,
      day_minus_2_mean_air_temp_f: 30,
      pressure_history_mb: Array.from({ length: 24 }, (_, i) => 1013 + Math.sin(i / 4) * 0.3),
      wind_speed_mph: 8,
      cloud_cover_pct: 50,
      precip_24h_in: 0.05,
      precip_72h_in: 0.1,
      precip_7d_in: 0.5,
    },
    data_coverage: {},
  };
  const r = runHowFishingReport(req);
  assertEquals(typeof r.score, "number");
  assert(["Poor", "Fair", "Good", "Excellent"].includes(r.band));
  assert(r.drivers.length <= 2);
  assert(r.suppressors.length <= 2);
  assert(r.actionable_tip.length > 0);
  assert(r.daypart_preset != null);
});

Deno.test("buildNormalized: <3 variables -> low reliability", () => {
  const req = {
    latitude: 40,
    longitude: -74,
    state_code: "NY",
    region_key: "northeast" as const,
    local_date: "2025-07-01",
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond" as const,
    environment: {
      wind_speed_mph: 10,
      cloud_cover_pct: 40,
    },
    data_coverage: {},
  };
  const n = buildSharedNormalizedOutput(req);
  assert(n.available_variables.length < 3);
  assertEquals(n.reliability, "low");
});

Deno.test("buildTipAndDaypart: cold-season positive temp driver", () => {
  const norm = minimalNorm();
  const driver = {
    key: "temperature_condition" as const,
    score: 2 as const,
    label: "t",
    weight: 30,
    weightedContribution: 60,
  };
  const b = buildTipAndDaypart(
    "freshwater_river",
    driver,
    undefined,
    norm.normalized,
    "high",
    { local_date: "2025-02-10" }
  );
  assert(b.actionable_tip.includes("warmer part of the day"));
});

Deno.test("temperature: at ±2 band, trend nudge not applied (table dominates)", () => {
  const t = normalizeTemperature(
    "freshwater_river",
    "great_lakes_upper_midwest",
    1,
    38,
    32,
    18
  );
  assertEquals(Math.abs(t!.band_score), 2);
  assertEquals(t!.trend_adjustment, 0);
  assertEquals(t!.final_score, t!.band_score + t!.shock_adjustment);
});

Deno.test("temperature: shock blocks stacking with trend", () => {
  const t = normalizeTemperature(
    "freshwater_lake_pond",
    "northeast",
    4,
    55,
    42,
    41
  );
  assertEquals(t!.shock_adjustment, -1);
  assertEquals(t!.trend_adjustment, 0);
});

/** Golden: warm Feb Michigan river — favorable temp band */
Deno.test("golden: Feb Michigan river warm day yields Good+ outlook", () => {
  const r = runHowFishingReport({
    latitude: 45.2,
    longitude: -85.5,
    state_code: "MI",
    region_key: "great_lakes_upper_midwest",
    local_date: "2025-02-18",
    local_timezone: "America/Detroit",
    context: "freshwater_river",
    environment: {
      daily_mean_air_temp_f: 46,
      prior_day_mean_air_temp_f: 36,
      day_minus_2_mean_air_temp_f: 28,
      pressure_history_mb: Array.from({ length: 24 }, () => 1015),
      wind_speed_mph: 6,
      cloud_cover_pct: 60,
      precip_24h_in: 0,
      precip_72h_in: 0.05,
      precip_7d_in: 0.3,
    },
    data_coverage: {},
  });
  assert(
    r.band === "Good" || r.band === "Excellent" || r.band === "Fair",
    `expected upper-mid band, got ${r.band}`
  );
  assert(r.score >= 45);
});

/** Golden: July Florida lake — hot bright suppresses */
Deno.test("golden: July Florida lake hot sunny trends Fair or below", () => {
  const r = runHowFishingReport({
    latitude: 27.9,
    longitude: -82.5,
    state_code: "FL",
    region_key: "florida",
    local_date: "2025-07-20",
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 94,
      prior_day_mean_air_temp_f: 93,
      day_minus_2_mean_air_temp_f: 92,
      pressure_history_mb: Array.from({ length: 24 }, () => 1018),
      wind_speed_mph: 5,
      cloud_cover_pct: 5,
      precip_24h_in: 0,
      precip_72h_in: 0,
    },
    data_coverage: {},
  });
  assert(r.score < 72, "hot bright lake should not score Excellent");
  assert(
    r.suppressors.some((s) => s.variable === "light_cloud_condition") ||
      r.suppressors.some((s) => s.variable === "temperature_condition")
  );
});

/** Golden: spring Midwest river after rain — runoff suppressor */
Deno.test("golden: April midwest_interior river heavy rain — runoff negative", () => {
  const r = runHowFishingReport({
    latitude: 41.5,
    longitude: -93.6,
    state_code: "IA",
    region_key: "midwest_interior",
    local_date: "2025-04-22",
    local_timezone: "America/Chicago",
    context: "freshwater_river",
    environment: {
      daily_mean_air_temp_f: 58,
      prior_day_mean_air_temp_f: 55,
      day_minus_2_mean_air_temp_f: 52,
      pressure_history_mb: Array.from({ length: 24 }, () => 1012),
      wind_speed_mph: 10,
      cloud_cover_pct: 90,
      precip_24h_in: 0.8,
      precip_72h_in: 2.0,
      precip_7d_in: 3.5,
    },
    data_coverage: {},
  });
  assert(
    r.suppressors.some((s) => s.variable === "runoff_flow_disruption"),
    "runoff should surface as suppressor"
  );
});

/** Coastal with only slack stage — still produces report, tide scored slack */
Deno.test("golden: coastal weak tide data uses stage fallback", () => {
  const r = runHowFishingReport({
    latitude: 30.2,
    longitude: -81.4,
    state_code: "FL",
    region_key: "florida",
    local_date: "2025-03-10",
    local_timezone: "America/New_York",
    context: "coastal",
    environment: {
      daily_mean_air_temp_f: 72,
      prior_day_mean_air_temp_f: 70,
      day_minus_2_mean_air_temp_f: 68,
      pressure_history_mb: Array.from({ length: 24 }, () => 1016),
      wind_speed_mph: 12,
      cloud_cover_pct: 40,
      precip_24h_in: 0,
      precip_72h_in: 0,
      tide_movement_state: "low slack",
    },
    data_coverage: {},
  });
  assertEquals(r.context, "coastal");
  assert(r.reliability === "medium" || r.reliability === "high");
});

Deno.test("golden: coastal missing precip still scores (reweight)", () => {
  const n = buildSharedNormalizedOutput({
    latitude: 29.0,
    longitude: -95.0,
    state_code: "TX",
    region_key: "gulf_coast",
    local_date: "2025-05-01",
    local_timezone: "America/Chicago",
    context: "coastal",
    environment: {
      daily_mean_air_temp_f: 78,
      prior_day_mean_air_temp_f: 76,
      day_minus_2_mean_air_temp_f: 74,
      pressure_history_mb: Array.from({ length: 24 }, () => 1014),
      wind_speed_mph: 14,
      cloud_cover_pct: 30,
      tide_movement_state: "incoming",
    },
    data_coverage: {},
  });
  assert(!n.available_variables.includes("precipitation_disruption"));
  const s = scoreDay(n);
  assert(s.score >= 0 && s.score <= 100);
});
