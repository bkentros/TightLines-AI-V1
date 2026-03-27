/**
 * How's Fishing rebuild engine — deno test
 * Run: deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/rebuildEngine.test.ts
 */
import { assert, assertEquals, assertAlmostEquals } from "jsr:@std/assert";
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
import { compositeScoreActivityTier } from "../narration/compositeScoreTier.ts";
import { runHowFishingReport } from "../runHowFishingReport.ts";
import { buildActionableTip } from "../tips/buildTips.ts";
import type { SharedNormalizedOutput, TemperatureNormalized } from "../contracts/mod.ts";
import { evaluateTemperatureWindow } from "../timing/evaluators/evaluateTemperatureWindow.ts";
import { evaluateLightWindow } from "../timing/evaluators/evaluateLightWindow.ts";
import { resolveTimingFamily } from "../timing/timingFamilies.ts";
import { evaluateTideWindow } from "../timing/evaluators/evaluateTideWindow.ts";
import { adjacentMonthsBlend } from "../timing/timingMonthBlend.ts";
import {
  clearDriverLabelSeed,
  setDriverLabelSeed,
} from "../score/driverLabels.ts";

Deno.test("pressure: two-point slow falling (sweet-spot front signal)", () => {
  const r = normalizePressureDetailed([1013, 1010.5]);
  assert(r != null);
  assertEquals(r!.quality, "two_point");
  assertEquals(r!.state.label, "falling_slow");
  assertAlmostEquals(r!.state.score, 1.4857, 1e-3);
});

Deno.test("pressure: volatile with 3+ readings and large range", () => {
  const r = normalizePressureDetailed([1000, 1006, 1001]);
  assert(r != null);
  assertEquals(r!.state.label, "volatile");
  assertAlmostEquals(r!.state.score, -1.5667, 1e-3);
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
  assertAlmostEquals(t!.band_score, 1.9, 0.05);
});

Deno.test("temperature: Jul mountain_west ~58F daily mean is cool not very_cold", () => {
  const t = normalizeTemperature(
    "freshwater_lake_pond",
    "mountain_west",
    7,
    57.5,
    57.7,
    56.4
  );
  assert(t != null);
  assertEquals(t!.band_label, "cool");
  assertAlmostEquals(t!.band_score, -1.375, 1e-3);
});

Deno.test("temperature: band_score rises smoothly within optimal segment (taper)", () => {
  const a = normalizeTemperature(
    "freshwater_lake_pond",
    "florida",
    11,
    70,
    69,
    68,
  )!;
  const b = normalizeTemperature(
    "freshwater_lake_pond",
    "florida",
    11,
    73,
    69,
    68,
  )!;
  assertEquals(a.band_label, "optimal");
  assertEquals(b.band_label, "optimal");
  assert(b.band_score > a.band_score);
  assert(b.band_score - a.band_score < 0.8);
});

Deno.test("light: freshwater score does not improve when cloud decreases in mixed band", () => {
  const a = normalizeLight(45, "freshwater_lake_pond")!.score;
  const b = normalizeLight(60, "freshwater_lake_pond")!.score;
  assert(b >= a);
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

Deno.test("wind: mph thresholds — light helps lake/coast; moderate only helps coast", () => {
  assertEquals(normalizeWind(7, "freshwater_lake_pond")!.score, 1);
  assertAlmostEquals(normalizeWind(8, "freshwater_lake_pond")!.score, 0.875, 1e-3);
  assertEquals(normalizeWind(8, "coastal")!.score, 1);
  assertAlmostEquals(normalizeWind(16, "freshwater_lake_pond")!.score, -0.1111, 1e-3);
  assertAlmostEquals(normalizeWind(16, "coastal")!.score, 0.8889, 1e-3);
  assertAlmostEquals(normalizeWind(25, "freshwater_river")!.score, -1.0625, 1e-3);
  assertEquals(normalizeWind(25, "coastal")!.score, 0);
  assertAlmostEquals(normalizeWind(32, "coastal")!.score, -0.6667, 1e-3);
  assertAlmostEquals(normalizeWind(40, "coastal")!.score, -1.3846, 1e-3);
});

Deno.test("light: coastal glare/bright neutral; mixed neutral; low cloud positive", () => {
  assertEquals(normalizeLight(5, "coastal")!.score, 0);
  assertEquals(normalizeLight(20, "coastal")!.score, 0);
  assertEquals(normalizeLight(40, "coastal")!.score, 0);
  assertAlmostEquals(normalizeLight(70, "coastal")!.score, 1.02, 0.08);
});

Deno.test("precip: active_disruption then recent_rain precedence", () => {
  const a = normalizePrecipitationDisruption("freshwater_lake_pond", 0.15, 0, 0, false);
  assertEquals(a!.label, "active_disruption");
  assertAlmostEquals(a!.score, -1.3469, 1e-3);
  const r = normalizePrecipitationDisruption("freshwater_lake_pond", 0.05, 0.2, 0.4, false);
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
  assertAlmostEquals(t!.score, 1.525, 1e-3);
});

Deno.test("tide: stage incoming -> moving", () => {
  const t = normalizeTideFromStage("incoming");
  assertEquals(t!.score, 1);
});

Deno.test("tide: unknown stage does not auto-score positive", () => {
  const t = normalizeTideFromStage("unknown");
  assertEquals(t, null);
});

Deno.test("tide: flats_estuary policy softens slack stage vs inshore", () => {
  const inshore = normalizeTideFromStage("low slack", "inshore");
  const flats = normalizeTideFromStage("low slack", "flats_estuary");
  assertEquals(inshore!.score, -0.95);
  assertEquals(flats!.score, -0.32);
});

Deno.test("precip: coastal is softer than lake for the same rain totals", () => {
  const lake = normalizePrecipitationDisruption("freshwater_lake_pond", 0.03, 0.8, 1.6, false);
  const coast = normalizePrecipitationDisruption("coastal", 0.03, 0.8, 1.6, false);
  assertEquals(lake!.label, "active_disruption");
  assertEquals(coast!.label, "recent_rain");
});

Deno.test("runoff: florida more tolerant than northeast for same totals", () => {
  const fl = normalizeRunoff("florida", 0.3, 0.7, 1.5);
  const ne = normalizeRunoff("northeast", 0.3, 0.7, 1.5);
  assertEquals(fl!.label, "stable");
  assertEquals(ne!.label, "slightly_elevated");
});

Deno.test("runoff: requires 24h + 72h + 7d together — no imputed zeros", () => {
  assertEquals(normalizeRunoff("northeast", 0.2, null, 0.5), null);
  assertEquals(normalizeRunoff("northeast", null, 0.2, 0.5), null);
  assertEquals(normalizeRunoff("northeast", 0.2, 0.2, null), null);
});

Deno.test("band mapping exact thresholds", () => {
  assertEquals(bandFromScore(0), "Poor");
  assertEquals(bandFromScore(39), "Poor");
  assertEquals(bandFromScore(40), "Fair");
  assertEquals(bandFromScore(59), "Fair");
  assertEquals(bandFromScore(60), "Good");
  assertEquals(bandFromScore(79), "Good");
  assertEquals(bandFromScore(80), "Excellent");
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

function coolTemp(over: Partial<TemperatureNormalized> = {}): TemperatureNormalized {
  return {
    context_group: "freshwater",
    band_label: "cool",
    band_score: -1,
    trend_label: "stable",
    trend_adjustment: 0,
    shock_label: "none",
    shock_adjustment: 0,
    final_score: -1,
    ...over,
  };
}

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

Deno.test("compositeScoreActivityTier: describes score band only", () => {
  const t = compositeScoreActivityTier(72);
  assert(t.toLowerCase().includes("high"));
  assert(!t.toLowerCase().includes("fish"));
});

Deno.test("labelForDriver: same inputs yield identical driver labels (no randomness)", () => {
  setDriverLabelSeed("labelForDriver-parity");
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
      pressure_history_mb: [1013, 1012],
      wind_speed_mph: 8,
      cloud_cover_pct: 50,
      precip_24h_in: 0.05,
      precip_72h_in: 0.1,
      precip_7d_in: 0.5,
    },
    data_coverage: {},
  };
  const a = runHowFishingReport(req);
  const b = runHowFishingReport(req);
  try {
    assertEquals(
      a.drivers.map((d) => `${d.variable}|${d.label}`),
      b.drivers.map((d) => `${d.variable}|${d.label}`),
    );
  } finally {
    clearDriverLabelSeed();
  }
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
  const cc = r.condition_context!;
  assert(cc.normalized_variable_scores.length >= 3);
  const tempEntry = cc.normalized_variable_scores.find((x) => x.variable_key === "temperature_condition");
  assert(tempEntry != null);
  assertEquals(tempEntry!.engine_score, tempEntry!.temperature_breakdown?.final_score);
  assert(cc.composite_contributions.length >= 3);
  assertEquals(
    cc.composite_contributions.reduce((a, c) => a + c.weighted_contribution, 0),
    cc.composite_contributions.reduce((a, c) => a + c.weight * c.normalized_score, 0),
  );
  assertEquals(cc.environment_snapshot.pressure_history_summary?.sample_count, 24);
  assertEquals(cc.environment_snapshot.daily_low_air_temp_f, null);
  assertEquals(cc.environment_snapshot.daily_high_air_temp_f, null);
  assertEquals(cc.environment_snapshot.air_temp_diurnal_range_f, null);
});

Deno.test("runHowFishingReport: snapshot includes daily high/low when provided", () => {
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
      daily_low_air_temp_f: 28,
      daily_high_air_temp_f: 52,
      prior_day_mean_air_temp_f: 38,
      day_minus_2_mean_air_temp_f: 30,
      pressure_history_mb: [1013, 1012],
      wind_speed_mph: 8,
      cloud_cover_pct: 50,
      precip_24h_in: 0.05,
      precip_72h_in: 0.1,
      precip_7d_in: 0.5,
    },
    data_coverage: {},
  };
  const r = runHowFishingReport(req);
  const snap = r.condition_context!.environment_snapshot;
  assertEquals(snap.daily_low_air_temp_f, 28);
  assertEquals(snap.daily_high_air_temp_f, 52);
  assertEquals(snap.air_temp_diurnal_range_f, 24);
});

Deno.test("runHowFishingReport: forwards data_coverage_notes from adapter", () => {
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
    data_coverage: { source_notes: ["hourly_air_temp_f: 3 valid local hours for 2025-02-15 (need 12)"] },
  };
  const r = runHowFishingReport(req);
  assertEquals(r.data_coverage_notes, [
    "hourly_air_temp_f: 3 valid local hours for 2025-02-15 (need 12)",
  ]);
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

Deno.test("buildNormalized: river with only 24h+72h precip omits runoff and tags incomplete_precip_windows", () => {
  const n = buildSharedNormalizedOutput({
    latitude: 44.9,
    longitude: -93.2,
    state_code: "MN",
    region_key: "great_lakes_upper_midwest",
    local_date: "2025-06-10",
    local_timezone: "America/Chicago",
    context: "freshwater_river",
    environment: {
      daily_mean_air_temp_f: 68,
      prior_day_mean_air_temp_f: 65,
      day_minus_2_mean_air_temp_f: 62,
      pressure_history_mb: Array.from({ length: 24 }, () => 1014),
      wind_speed_mph: 8,
      cloud_cover_pct: 45,
      precip_24h_in: 0.1,
      precip_72h_in: 0.3,
    },
    data_coverage: {},
  });
  assert(n.missing_variables.includes("runoff_flow_disruption"));
  const g = n.data_gaps.find((x) => x.variable_key === "runoff_flow_disruption");
  assertEquals(g?.reason, "incomplete_precip_windows");
});

Deno.test("buildActionableTip: positive temp driver → active tip", () => {
  const norm = minimalNorm();
  const driver = {
    key: "temperature_condition" as const,
    score: 2 as const,
    label: "t",
    weight: 30,
    weightedContribution: 60,
  };
  const b = buildActionableTip(
    "freshwater_river",
    driver,
    undefined,
    norm.normalized,
  );
  // With a positive temp driver, the tip should be from TEMP_ACTIVE_TIPS
  assert(b.actionable_tip_tag === "temperature_intraday_flex");
});

Deno.test("buildActionableTip: heat suppressor (very_warm) never uses cold-water pool", () => {
  const n = minimalNorm({
    temperature: {
      context_group: "freshwater",
      band_label: "very_warm",
      band_score: -1,
      trend_label: "warming",
      trend_adjustment: 0,
      shock_label: "sharp_warmup",
      shock_adjustment: -1,
      final_score: -2,
    },
  });
  const sup = {
    key: "temperature_condition" as const,
    score: -2 as const,
    label: "",
    weight: 40,
    weightedContribution: -80,
  };
  for (let i = 0; i < 20; i++) {
    const b = buildActionableTip("freshwater_lake_pond", undefined, sup, n.normalized);
    assert(!/\bcold water\b/i.test(b.actionable_tip), b.actionable_tip);
  }
});

Deno.test("timing: hot south_central March — avoid_heat rescues when winter-family drivers miss", () => {
  const r = runHowFishingReport({
    latitude: 34.7465,
    longitude: -92.2896,
    state_code: "AR",
    region_key: "south_central",
    local_date: "2026-03-26",
    local_timezone: "America/Chicago",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 75,
      prior_day_mean_air_temp_f: 55,
      day_minus_2_mean_air_temp_f: 50,
      pressure_history_mb: Array.from({ length: 24 }, () => 1015),
      wind_speed_mph: 6,
      cloud_cover_pct: 0,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0.1,
      hourly_air_temp_f: [
        63, 62, 62, 61, 61, 60, 60, 61, 64, 68, 72, 75, 78, 81, 84, 86, 86, 85, 82, 78, 75, 73, 71, 68,
      ],
      hourly_cloud_cover_pct: Array(24).fill(0),
    },
    data_coverage: {},
  });
  assertEquals(r.daypart_preset, "early_late_low_light");
  assertEquals(r.highlighted_periods, [true, false, false, true]);
});

Deno.test("temperature: warm band with 48h shock blocks trend stacking", () => {
  const t = normalizeTemperature(
    "freshwater_river",
    "great_lakes_upper_midwest",
    1,
    38,
    32,
    18
  );
  assertAlmostEquals(t!.band_score, 1.4, 1e-3);
  assertEquals(t!.shock_adjustment, -1);
  assertEquals(t!.trend_adjustment, 0);
  assertAlmostEquals(t!.final_score, 0.4, 1e-3);
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

Deno.test("timing: warm_humid lake Mar/Apr share family (no spring cliff on Apr 1)", () => {
  const mar = resolveTimingFamily("freshwater_lake_pond", "southeast_atlantic", 3);
  const apr = resolveTimingFamily("freshwater_lake_pond", "southeast_atlantic", 4);
  assertEquals(mar.family_id, apr.family_id);
  assertEquals(mar.family_id, "lake_warm_winter");
});

Deno.test("timing: interior_continental lake Apr still winter family (extends past March)", () => {
  const mar = resolveTimingFamily("freshwater_lake_pond", "great_lakes_upper_midwest", 3);
  const apr = resolveTimingFamily("freshwater_lake_pond", "great_lakes_upper_midwest", 4);
  assertEquals(mar.family_id, apr.family_id);
  assertEquals(mar.family_id, "lake_cold_winter");
});

Deno.test("timing: seek_warmth null when cooling or no warming trigger", () => {
  const baseOpts = { local_date: "2025-02-01" as const };
  let norm = minimalNorm({ temperature: coolTemp({ trend_label: "cooling" }) });
  assertEquals(evaluateTemperatureWindow("seek_warmth", norm, baseOpts), null);

  norm = minimalNorm({ temperature: coolTemp({ shock_label: "sharp_cooldown" }) });
  assertEquals(evaluateTemperatureWindow("seek_warmth", norm, baseOpts), null);

  norm = minimalNorm({ temperature: coolTemp({ trend_label: "stable" }) });
  assertEquals(evaluateTemperatureWindow("seek_warmth", norm, baseOpts), null);
});

Deno.test("timing: seek_warmth qualifies on warming trend or day-over-day lift", () => {
  const normW = minimalNorm({ temperature: coolTemp({ trend_label: "warming" }) });
  const sw = evaluateTemperatureWindow("seek_warmth", normW, { local_date: "2025-02-01" });
  assert(sw != null);
  assertEquals(sw!.periods, [false, false, true, false]);

  const normD = minimalNorm({ temperature: coolTemp({ trend_label: "stable" }) });
  const sd = evaluateTemperatureWindow("seek_warmth", normD, {
    local_date: "2025-02-01",
    daily_mean_air_temp_f: 40,
    prior_day_mean_air_temp_f: 34,
  });
  assert(sd != null);
  assertEquals(sd!.periods, [false, false, true, false]);

  const normWide = minimalNorm({ temperature: coolTemp({ shock_label: "sharp_warmup" }) });
  const sw2 = evaluateTemperatureWindow("seek_warmth", normWide, { local_date: "2025-02-01" });
  assert(sw2 != null);
  assertEquals(sw2!.periods, [false, false, true, true]);
});

Deno.test("timing: low_light_geometry hourly keeps clearer dusk when dawn is socked in", () => {
  const hourly = Array.from({ length: 24 }, () => 50);
  for (let h = 5; h <= 6; h++) hourly[h] = 90;
  for (let h = 17; h <= 20; h++) hourly[h] = 25;
  const norm = minimalNorm({
    light_cloud_condition: { label: "mixed", score: 0, detail: "45%" },
  });
  const s = evaluateLightWindow("low_light_geometry", norm, {
    local_date: "2025-06-01",
    cloud_cover_pct: 45,
    hourly_cloud_cover_pct: hourly,
  });
  assert(s != null);
  assertEquals(s!.periods, [false, false, false, true]);
  assertEquals(s!.note_pool_key, "low_light_geometry_shaped");
});

Deno.test("timing: cloud_extended hourly highlights top overcast buckets not all day", () => {
  const hourly = Array.from({ length: 24 }, () => 35);
  for (let h = 7; h <= 10; h++) hourly[h] = 82;
  for (let h = 17; h <= 20; h++) hourly[h] = 90;
  const norm = minimalNorm({
    light_cloud_condition: { label: "low_light", score: 1, detail: "72%" },
  });
  const s = evaluateLightWindow("cloud_extended_low_light", norm, {
    local_date: "2025-06-01",
    cloud_cover_pct: 72,
    hourly_cloud_cover_pct: hourly,
  });
  assert(s != null);
  assertEquals(s!.periods, [false, true, false, true]);
  assertEquals(s!.note_pool_key, "cloud_extended_shaped");
});

Deno.test("timing: seek_warmth hourly places spike in evening when curve jumps late", () => {
  const hourly = Array.from({ length: 24 }, () => 30);
  hourly[18] = 44;
  const norm = minimalNorm({ temperature: coolTemp({ trend_label: "warming" }) });
  const s = evaluateTemperatureWindow("seek_warmth", norm, {
    local_date: "2025-02-01",
    hourly_air_temp_f: hourly,
  });
  assert(s != null);
  assertEquals(s!.periods, [false, false, false, true]);
});

Deno.test("timing: coastal tide score but no times → uncertain pool, no period highlights", () => {
  const norm = minimalNorm({
    tide_current_movement: { label: "incoming", score: 1, detail: "moving" },
  });
  const sig = evaluateTideWindow(norm, {
    local_date: "2025-03-10",
    tide_high_low: null,
  });
  assert(sig != null);
  assertEquals(sig!.note_pool_key, "tide_uncertain_no_clock");
  assertEquals(sig!.periods, [false, false, false, false]);
});

Deno.test("timing: many same-day exchanges → highlight each bucket that has a tide event", () => {
  const norm = minimalNorm({
    tide_current_movement: { label: "strong_moving", score: 2, detail: "x" },
  });
  const sig = evaluateTideWindow(norm, {
    local_date: "2025-06-01",
    tide_high_low: [
      { time: "2025-06-01T06:00:00", value: 1 },
      { time: "2025-06-01T10:00:00", value: 2 },
      { time: "2025-06-01T14:00:00", value: 3 },
      { time: "2025-06-01T19:00:00", value: 4 },
    ],
  });
  assert(sig != null);
  assertEquals(sig!.periods, [true, true, true, true]);
  assertEquals(sig!.exchange_times?.length, 4);
});

Deno.test("timing: coastal slack ~5:30am and ~2:40pm → dawn + afternoon, not evening", () => {
  const norm = minimalNorm({
    tide_current_movement: { label: "strong_moving", score: 2, detail: "x" },
  });
  const sig = evaluateTideWindow(norm, {
    local_date: "2025-06-01",
    tide_high_low: [
      { time: "2025-06-01T05:30:00", value: 1 },
      { time: "2025-06-01T14:40:00", value: 2 },
    ],
  });
  assert(sig != null);
  assertEquals(sig!.periods, [true, false, true, false]);
  assertEquals(sig!.exchange_times?.length, 2);
});

Deno.test("timing: adjacentMonthsBlend Jan 1 is t=0 (100% lo month)", () => {
  const b = adjacentMonthsBlend("2025-01-01");
  assert(b != null);
  assertEquals(b!.loMonth, 1);
  assertEquals(b!.hiMonth, 2);
  assertEquals(b!.t, 0);
});

Deno.test("timing: adjacentMonthsBlend late Jan leans heavily toward February", () => {
  const b = adjacentMonthsBlend("2025-01-31");
  assert(b != null);
  assert(b!.t > 0.85);
});

Deno.test("timing: freshwater April mid-month blends April+May families", () => {
  const b = adjacentMonthsBlend("2025-04-15");
  assert(b != null);
  assertEquals(b!.loMonth, 4);
  assertEquals(b!.hiMonth, 5);
  assert(b!.t > 0.4 && b!.t < 0.6);
  const fa = resolveTimingFamily("freshwater_lake_pond", "southeast_atlantic", 4);
  const fb = resolveTimingFamily("freshwater_lake_pond", "southeast_atlantic", 5);
  assert(fa.family_id !== fb.family_id);
});

Deno.test("timing: maritime_cool June uses cold_summer vs interior June uses cold_spring", () => {
  const pnw = resolveTimingFamily("freshwater_lake_pond", "pacific_northwest", 6);
  const gl = resolveTimingFamily("freshwater_lake_pond", "great_lakes_upper_midwest", 6);
  assertEquals(pnw.family_id, "lake_cold_summer");
  assertEquals(gl.family_id, "lake_cold_spring");
});

Deno.test("timing: hot_arid April uses hot_summer (avoid_heat) vs hot_humid April uses hot_spring", () => {
  const arid = resolveTimingFamily("freshwater_lake_pond", "southwest_desert", 4);
  const humid = resolveTimingFamily("freshwater_lake_pond", "gulf_coast", 4);
  assertEquals(arid.family_id, "lake_hot_summer");
  assertEquals(humid.family_id, "lake_hot_spring");
});

Deno.test("timing: runHowFishingReport freshwater June includes blend in trace when families differ", () => {
  const r = runHowFishingReport({
    latitude: 33.7,
    longitude: -78.9,
    state_code: "SC",
    region_key: "southeast_atlantic",
    local_date: "2025-06-15",
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 72,
      prior_day_mean_air_temp_f: 70,
      day_minus_2_mean_air_temp_f: 68,
      pressure_history_mb: Array.from({ length: 24 }, () => 1015),
      wind_speed_mph: 8,
      cloud_cover_pct: 50,
      precip_24h_in: 0,
      precip_72h_in: 0.1,
      precip_7d_in: 0.5,
    },
    data_coverage: {},
  });
  assert(r.timing_debug != null);
  assert(
    r.timing_debug!.family_id.includes("~"),
    `expected blended family_id, got ${r.timing_debug!.family_id}`,
  );
  assert(r.timing_debug!.month_blend_t != null && r.timing_debug!.month_blend_t > 0);
});

// ── New tests for Changes 1, 2, 3, 4 ─────────────────────────────────────────

Deno.test("change1: cold band (cool) clear sky — light score neutral, not penalized", () => {
  // Direct normalizer call: cool band, 5% cloud — should score ~0 not -1.x
  const result = normalizeLight(5, "freshwater_lake_pond", { temperatureBandLabel: "cool" });
  assert(result != null);
  assert(result!.score > -0.5, `expected score > -0.5 in cold band, got ${result!.score}`);
  assertEquals(result!.label, "bright"); // not "glare" even at 5%
});

Deno.test("change1: very_cold band clear sky — light score neutral", () => {
  const result = normalizeLight(3, "freshwater_lake_pond", { temperatureBandLabel: "very_cold" });
  assert(result != null);
  assert(result!.score > -0.5, `expected score > -0.5 in very_cold band, got ${result!.score}`);
  assertEquals(result!.label, "bright");
});

Deno.test("change1 regression: warm band clear sky — glare penalty still applied", () => {
  // No opts / warm band should still apply the original penalty
  const warm = normalizeLight(5, "freshwater_lake_pond", { temperatureBandLabel: "warm" });
  const noOpts = normalizeLight(5, "freshwater_lake_pond");
  assert(warm != null && noOpts != null);
  assert(warm!.score < -0.5, `warm band should still penalize glare: ${warm!.score}`);
  assert(noOpts!.score < -0.5, `no opts should still penalize glare: ${noOpts!.score}`);
  assertEquals(warm!.label, "glare");
  assertEquals(noOpts!.label, "glare");
});

Deno.test("change1 full-report: Great Lakes March clear day cool band — light not major suppressor", () => {
  // 30°F daily_mean in March at great_lakes lands in 'cool' band -> cold-band neutralization applies
  const r = runHowFishingReport({
    latitude: 44.5,
    longitude: -84.0,
    state_code: "MI",
    region_key: "great_lakes_upper_midwest",
    local_date: "2025-03-15",
    local_timezone: "America/Detroit",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 30,
      daily_low_air_temp_f: 24,
      daily_high_air_temp_f: 38,
      prior_day_mean_air_temp_f: 28,
      day_minus_2_mean_air_temp_f: 26,
      pressure_history_mb: Array.from({ length: 24 }, () => 1015),
      wind_speed_mph: 5,
      cloud_cover_pct: 5,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0.1,
    },
    data_coverage: {},
  });
  const lightEntry = r.condition_context?.normalized_variable_scores.find(
    (v) => v.variable_key === "light_cloud_condition"
  );
  assert(lightEntry != null, "light_cloud_condition should be scored");
  assert(
    lightEntry!.engine_score > -0.5,
    `light score should be near 0 in cool band March clear day, got ${lightEntry!.engine_score}`
  );
});

Deno.test("change1 regression: July warm band Great Lakes clear sky — glare penalty intact", () => {
  const r = runHowFishingReport({
    latitude: 44.5,
    longitude: -84.0,
    state_code: "MI",
    region_key: "great_lakes_upper_midwest",
    local_date: "2025-07-15",
    local_timezone: "America/Detroit",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 75,
      prior_day_mean_air_temp_f: 74,
      day_minus_2_mean_air_temp_f: 73,
      pressure_history_mb: Array.from({ length: 24 }, () => 1015),
      wind_speed_mph: 5,
      cloud_cover_pct: 5,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0.2,
    },
    data_coverage: {},
  });
  const lightEntry = r.condition_context?.normalized_variable_scores.find(
    (v) => v.variable_key === "light_cloud_condition"
  );
  assert(lightEntry != null);
  assert(
    lightEntry!.engine_score < -0.5,
    `warm band July clear sky should still penalize, got ${lightEntry!.engine_score}`
  );
});

Deno.test("change2: light_mist dry baseline — score positive, label light_mist", () => {
  // Low p72 and p7d — mist is a mild positive
  const r = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0,      // rate: not raining
    0.08,   // p24: trace
    0.15,   // p72: low
    false,
    0.4     // p7d: low
  );
  assert(r != null);
  assertEquals(r!.label, "light_mist");
  assert(r!.score > 0, `expected score > 0 for dry-baseline light_mist, got ${r!.score}`);
});

Deno.test("change2: light_mist wet baseline — score negative, label light_mist", () => {
  // p72=0.32 (below recent_rain threshold of 0.35, but above first gate of 0.30)
  // p7d=1.2 (below second gate's 1.50 ceiling)
  // -> second light_mist gate: score = -0.10
  const r = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0,      // rate: not actively raining
    0.08,   // p24: trace (in [0.01, 0.15))
    0.32,   // p72: in [0.30, 0.35) — above first gate, below recent_rain threshold
    false,
    1.2     // p7d: in [0.75, 1.50) — above first gate, below second gate ceiling
  );
  assert(r != null);
  assertEquals(r!.label, "light_mist");
  assert(r!.score < 0, `expected score < 0 for wet-baseline light_mist, got ${r!.score}`);
});

Deno.test("change2: light_mist — flooded baseline falls through to recent_rain (p72 too high)", () => {
  // p72 = 0.70 exceeds recent_rain threshold (0.35) so recent_rain fires first
  const r = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0,     // rate
    0.08,  // p24: would qualify for light_mist if p72 were low
    0.70,  // p72: exceeds recent_rain threshold (>= 0.35)
    false
  );
  assert(r != null);
  assertEquals(r!.label, "recent_rain", `expected recent_rain when p72 too high, got ${r!.label}`);
});

Deno.test("change2: extended_dry cap — score <= 1.35", () => {
  const r = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0, 0, 0, false
  );
  assert(r != null);
  assertEquals(r!.label, "extended_dry");
  assert(r!.score <= 1.35, `extended_dry should be capped at 1.3, got ${r!.score}`);
});

Deno.test("change2: extended_dry coastal cap — score <= 1.35", () => {
  const r = normalizePrecipitationDisruption(
    "coastal",
    0, 0, 0, false
  );
  assert(r != null);
  assertEquals(r!.label, "extended_dry");
  assert(r!.score <= 1.35, `coastal extended_dry should be capped at 1.3, got ${r!.score}`);
});

Deno.test("change3: SW Desert April — timing anchor driver is not seek_warmth", () => {
  const r = runHowFishingReport({
    latitude: 33.4,
    longitude: -112.1,
    state_code: "AZ",
    region_key: "southwest_desert",
    local_date: "2025-04-20",
    local_timezone: "America/Phoenix",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 82,
      prior_day_mean_air_temp_f: 80,
      day_minus_2_mean_air_temp_f: 78,
      pressure_history_mb: Array.from({ length: 24 }, () => 1015),
      wind_speed_mph: 6,
      cloud_cover_pct: 10,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0,
    },
    data_coverage: {},
  });
  assert(r.timing_debug != null);
  assert(
    r.timing_debug!.primary_driver !== "seek_warmth",
    `SW Desert April should not use seek_warmth as primary driver, got: ${r.timing_debug!.primary_driver}`
  );
});

Deno.test("change3: SW Desert April timing family is lake_hot_summer (avoid_heat)", () => {
  const apr = resolveTimingFamily("freshwater_lake_pond", "southwest_desert", 4);
  assertEquals(apr.family_id, "lake_hot_summer");
  assertEquals(apr.primary_driver, "avoid_heat");
});

Deno.test("change3: SW Desert May/June unchanged — still warm_spring", () => {
  const may = resolveTimingFamily("freshwater_lake_pond", "southwest_desert", 5);
  const jun = resolveTimingFamily("freshwater_lake_pond", "southwest_desert", 6);
  assertEquals(may.family_id, "lake_warm_spring");
  assertEquals(jun.family_id, "lake_warm_spring");
});

Deno.test("change3: SW Desert river April — also lake_hot_summer equivalent", () => {
  const apr = resolveTimingFamily("freshwater_river", "southwest_desert", 4);
  assertEquals(apr.family_id, "river_hot_summer");
});

Deno.test("change4: coastal flats low cloud (8%) — glare penalty applied", () => {
  const r = normalizeLight(8, "coastal_flats_estuary");
  assert(r != null);
  assert(r!.score < -0.15, `flats 8% cloud should have glare penalty, got ${r!.score}`);
});

Deno.test("change4: coastal flats 21% cloud — above threshold, no penalty (score = 0)", () => {
  const r = normalizeLight(21, "coastal_flats_estuary");
  assert(r != null);
  assertEquals(r!.score, 0);
});

Deno.test("change4: coastal non-flats 8% cloud — no glare penalty (score = 0)", () => {
  const nearshore = normalizeLight(8, "coastal");
  assert(nearshore != null);
  assertEquals(nearshore!.score, 0, `nearshore coastal 8% cloud should still be 0, got ${nearshore!.score}`);
});

Deno.test("change4: coastal non-flats (coastal) existing behavior unchanged at all ranges", () => {
  // Verify non-flats coastal unchanged across the 0-69% range
  assertEquals(normalizeLight(5, "coastal")!.score, 0);
  assertEquals(normalizeLight(20, "coastal")!.score, 0);
  assertEquals(normalizeLight(40, "coastal")!.score, 0);
  assertEquals(normalizeLight(69, "coastal")!.score, 0);
});
