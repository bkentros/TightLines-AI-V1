/**
 * How's Fishing rebuild engine — deno test
 * Run: deno test --allow-read supabase/functions/_shared/howFishingEngine/__tests__/rebuildEngine.test.ts
 */
import { assert, assertAlmostEquals, assertEquals } from "jsr:@std/assert";
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
import {
  runHowFishingReport,
  runHowFishingScoreOnly,
} from "../runHowFishingReport.ts";
import { buildActionableTip } from "../tips/buildTips.ts";
import { buildThermalAirPlain } from "../narration/thermalAirPlain.ts";
import type {
  SharedNormalizedOutput,
  TemperatureNormalized,
} from "../contracts/mod.ts";
import { evaluateTemperatureWindow } from "../timing/evaluators/evaluateTemperatureWindow.ts";
import {
  evaluateLightWindow,
  evaluatePreferredLightWindow,
} from "../timing/evaluators/evaluateLightWindow.ts";
import { resolveTimingFamily } from "../timing/timingFamilies.ts";
import { evaluateTideWindow } from "../timing/evaluators/evaluateTideWindow.ts";
import {
  clearDriverLabelSeed,
  setDriverLabelSeed,
} from "../score/driverLabels.ts";

Deno.test("pressure: two-point slow falling (sweet-spot front signal)", () => {
  const r = normalizePressureDetailed([1013, 1010.5]);
  assert(r != null);
  assertEquals(r!.quality, "two_point");
  assertEquals(r!.state.label, "falling_slow");
  assertAlmostEquals(r!.state.score, 0.99, 1e-3);
});

Deno.test("pressure: volatile with 3+ readings and large range", () => {
  const r = normalizePressureDetailed([1000, 1006, 1001]);
  assert(r != null);
  assertEquals(r!.state.label, "volatile");
  assertAlmostEquals(r!.state.score, -1.5667, 1e-3);
});

Deno.test("pressure: earlier swings can downgrade to recently_stabilizing when the latest readings flatten out", () => {
  const r = normalizePressureDetailed([
    1010,
    1016,
    1011,
    1015,
    1014.8,
    1014.9,
    1015,
    1015.1,
  ]);
  assert(r != null);
  assertEquals(r!.state.label, "recently_stabilizing");
  assertAlmostEquals(r!.state.score, 0.25, 1e-3);
});

Deno.test("temperature: Feb great_lakes_upper_midwest river 45F in warm band +2", () => {
  const t = normalizeTemperature(
    "freshwater_river",
    "great_lakes_upper_midwest",
    2,
    45,
    40,
    38,
  );
  assert(t != null);
  assertEquals(t!.band_label, "warm");
  assertAlmostEquals(t!.band_score, 1.7, 1e-3);
});

Deno.test("temperature: Jul mountain_west ~58F daily mean is cool not very_cold", () => {
  const t = normalizeTemperature(
    "freshwater_lake_pond",
    "mountain_west",
    7,
    57.5,
    57.7,
    56.4,
  );
  assert(t != null);
  assertEquals(t!.band_label, "cool");
  assertAlmostEquals(t!.band_score, -1.4643, 1e-3);
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
  assertAlmostEquals(a.band_score, 0.2, 1e-3);
  assertAlmostEquals(b.band_score, 1.1, 1e-3);
  assert(b.band_score > a.band_score);
  assert(b.band_score - a.band_score < 1.0);
});

Deno.test("temperature: low-end optimal segment is labeled near_optimal when still thermally negative", () => {
  const t = normalizeTemperature(
    "freshwater_lake_pond",
    "south_central",
    4,
    60.3,
    56.4,
    60.05,
  )!;
  assertEquals(t.band_label, "near_optimal");
  assertAlmostEquals(t.band_score, -0.9357, 1e-3);
});

Deno.test("temperature: coastal path uses measured water temp when available", () => {
  const t = normalizeTemperature(
    "coastal",
    "florida",
    1,
    52,
    51,
    50,
    {
      measuredWaterTempF: 71,
      measuredWaterTemp24hAgoF: 69,
      measuredWaterTemp72hAgoF: 65,
    },
  );
  assert(t != null);
  assertEquals(t!.measurement_source, "coastal_water_temp");
  assertEquals(t!.measurement_value_f, 71);
  assertEquals(t!.trend_label, "warming");
});

Deno.test("temperature: measured coastal water temp uses water table, not coastal air table", () => {
  const t = normalizeTemperature(
    "coastal",
    "pacific_northwest",
    5,
    48,
    48,
    48,
    {
      measuredWaterTempF: 56,
      measuredWaterTemp24hAgoF: 56,
      measuredWaterTemp72hAgoF: 56,
    },
  );
  assert(t != null);
  assertEquals(t!.measurement_source, "coastal_water_temp");
  assertEquals(t!.measurement_value_f, 56);
  assertEquals(t!.band_score, 2);
  assertEquals(t!.trend_label, "stable");
  assertEquals(t!.shock_label, "none");
  assertEquals(t!.final_score, 1.85);
});

Deno.test("temperature: Gulf measured-water Oct/Nov 74F continuity", () => {
  const gulfMappedRegions = [
    "gulf_coast",
    "south_central",
    "mountain_west",
    "southwest_desert",
    "southwest_high_desert",
  ] as const;

  for (const region of gulfMappedRegions) {
    const oct = normalizeTemperature(
      "coastal",
      region,
      10,
      74,
      74,
      74,
      {
        measuredWaterTempF: 74,
        measuredWaterTemp24hAgoF: 74,
        measuredWaterTemp72hAgoF: 74,
      },
    );
    const nov = normalizeTemperature(
      "coastal",
      region,
      11,
      74,
      74,
      74,
      {
        measuredWaterTempF: 74,
        measuredWaterTemp24hAgoF: 74,
        measuredWaterTemp72hAgoF: 74,
      },
    );
    assert(oct != null && nov != null);
    assertEquals(oct.measurement_source, "coastal_water_temp");
    assertEquals(nov.measurement_source, "coastal_water_temp");
    assertAlmostEquals(oct.band_score, nov.band_score, 1e-6);
    assertAlmostEquals(oct.final_score, nov.final_score, 1e-6);
  }
});

Deno.test("temperature: coastal without measured water keeps coastal air table fallback", () => {
  const t = normalizeTemperature(
    "coastal",
    "pacific_northwest",
    5,
    56,
    56,
    56,
  );
  assert(t != null);
  assertEquals(t!.measurement_source, "air_daily_mean");
  assertEquals(t!.measurement_value_f, 56);
  assertAlmostEquals(t!.band_score, -1.2, 1e-6);
  assertEquals(t!.trend_label, "stable");
  assertEquals(t!.shock_label, "none");
  assertAlmostEquals(t!.final_score, -1.08, 1e-6);
});

Deno.test("temperature: coastal air fallback covers readiness cold edge without measured water", () => {
  const t = normalizeTemperature(
    "coastal",
    "southeast_atlantic",
    5,
    72,
    72,
    71,
  );
  assert(t != null);
  assertEquals(t!.measurement_source, "air_daily_mean");
  assertEquals(t!.band_label, "cool");
  assertEquals(t!.trend_label, "stable");
  assertEquals(t!.shock_label, "none");
  assertAlmostEquals(t!.final_score, -1.08, 1e-6);
});

Deno.test("temperature: coastal favorable warming uses capped V2 trend component", () => {
  const t = normalizeTemperature(
    "coastal",
    "northeast",
    7,
    77.1,
    73.8,
    70.8,
  );
  assert(t != null);
  assertEquals(t!.trend_label, "warming");
  assertAlmostEquals(t!.trend_adjustment, 0.7, 1e-3);
  assertAlmostEquals(t!.final_score, 2, 1e-3);
});

Deno.test("temperature: V2.1-lite stable favorable history gives only +0.05 stability effect", () => {
  const stable = normalizeTemperature(
    "freshwater_lake_pond",
    "great_lakes_upper_midwest",
    5,
    68,
    68,
    68,
  );
  const missing = normalizeTemperature(
    "freshwater_lake_pond",
    "great_lakes_upper_midwest",
    5,
    68,
    null,
    null,
  );
  assert(stable != null);
  assert(missing != null);
  assert(stable!.band_score >= 1);
  assertAlmostEquals(stable!.final_score - missing!.final_score, 0.05, 1e-3);
});

Deno.test("temperature: V2.1-lite stable neutral gets no stability bonus", () => {
  const stable = normalizeTemperature(
    "freshwater_lake_pond",
    "northeast",
    4,
    55,
    55,
    55,
  )!;
  const missing = normalizeTemperature(
    "freshwater_lake_pond",
    "northeast",
    4,
    55,
    null,
    null,
  )!;
  assertAlmostEquals(stable.band_score, 0.75, 1e-3);
  assertAlmostEquals(stable.final_score, missing.final_score, 1e-6);
});

Deno.test("temperature: V2.1-lite stable bad hot and cold get no stability rescue", () => {
  const hotStable = normalizeTemperature(
    "freshwater_lake_pond",
    "florida",
    8,
    100,
    100,
    100,
  )!;
  const hotMissing = normalizeTemperature(
    "freshwater_lake_pond",
    "florida",
    8,
    100,
    null,
    null,
  )!;
  const coldStable = normalizeTemperature(
    "freshwater_lake_pond",
    "northeast",
    1,
    28,
    28,
    28,
  )!;
  const coldMissing = normalizeTemperature(
    "freshwater_lake_pond",
    "northeast",
    1,
    28,
    null,
    null,
  )!;
  assert(hotStable.band_score < -0.75);
  assert(coldStable.band_score < -0.75);
  assertAlmostEquals(hotStable.final_score, hotMissing.final_score, 1e-6);
  assertAlmostEquals(coldStable.final_score, coldMissing.final_score, 1e-6);
});

Deno.test("temperature: V2.1-lite shock toward better temp softens to -0.90", () => {
  const t = normalizeTemperature(
    "freshwater_lake_pond",
    "northeast",
    5,
    70,
    55,
    49,
  )!;
  assertEquals(t.shock_label, "sharp_warmup");
  assertEquals(t.shock_adjustment, -1);
  assertEquals(t.trend_adjustment, 0);
  assertAlmostEquals(t.final_score, 0.16, 1e-3);
});

Deno.test("temperature: V2.1-lite shock into worse heat or cold keeps full penalty", () => {
  const heat = normalizeTemperature(
    "freshwater_lake_pond",
    "florida",
    6,
    100,
    80,
    76,
  )!;
  const cold = normalizeTemperature(
    "freshwater_lake_pond",
    "northeast",
    2,
    30,
    62,
    68,
  )!;
  assertEquals(heat.shock_label, "sharp_warmup");
  assertEquals(cold.shock_label, "sharp_cooldown");
  assertEquals(heat.shock_adjustment, -1);
  assertEquals(cold.shock_adjustment, -1);
  assertEquals(heat.trend_adjustment, 0);
  assertEquals(cold.trend_adjustment, 0);
  assertAlmostEquals(heat.final_score, -2, 1e-6);
  assertAlmostEquals(cold.final_score, -2, 1e-6);
});

Deno.test("temperature: favorable warming toward seasonal window is not penalized", () => {
  const t = normalizeTemperature(
    "freshwater_lake_pond",
    "great_lakes_upper_midwest",
    4,
    56,
    50,
    45,
  );
  assert(t != null);
  assertEquals(t!.trend_label, "warming");
  assertEquals(t!.shock_label, "none");
  assert(t!.trend_adjustment >= 0);
  assert(t!.final_score > 0);
});

Deno.test("temperature: warming deeper into heat is not rewarded", () => {
  const t = normalizeTemperature(
    "freshwater_lake_pond",
    "florida",
    8,
    96,
    95,
    94,
  );
  assert(t != null);
  assertEquals(t!.band_label, "very_warm");
  assertEquals(t!.shock_label, "none");
  assert(t!.trend_adjustment <= 0);
  assert(t!.final_score < 0);
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
    57,
  );
  assert(t != null);
  assertEquals(t!.shock_label, "sharp_warmup");
  assertEquals(t!.shock_adjustment, -1);
});

Deno.test("wind: V2 preserves light and useful-breeze scoring while penalizing high wind", () => {
  assertEquals(normalizeWind(null, "freshwater_lake_pond"), null);
  assertEquals(normalizeWind(-1, "freshwater_lake_pond"), null);
  assertAlmostEquals(
    normalizeWind(7, "freshwater_lake_pond")!.score,
    0.76,
    1e-3,
  );
  assertAlmostEquals(
    normalizeWind(8, "freshwater_lake_pond")!.score,
    0.84,
    1e-3,
  );
  assertAlmostEquals(normalizeWind(8, "coastal")!.score, 1.04, 1e-3);
  assertAlmostEquals(
    normalizeWind(10, "coastal_flats_estuary")!.score,
    0.9,
    1e-3,
  );
  assertAlmostEquals(normalizeWind(12, "coastal")!.score, 1.04, 1e-3);
  assertAlmostEquals(
    normalizeWind(16, "freshwater_lake_pond")!.score,
    0.2737,
    1e-3,
  );
  assertAlmostEquals(
    normalizeWind(18, "freshwater_lake_pond")!.score,
    0.0211,
    1e-3,
  );
  assertAlmostEquals(
    normalizeWind(18, "freshwater_river")!.score,
    -0.3111,
    1e-3,
  );
  assertAlmostEquals(
    normalizeWind(18, "coastal_flats_estuary")!.score,
    -0.45,
    1e-3,
  );
  assertAlmostEquals(normalizeWind(18, "coastal")!.score, 0.38, 1e-3);
  assertAlmostEquals(
    normalizeWind(25, "freshwater_river")!.score,
    -1.05,
    1e-3,
  );
  assertAlmostEquals(normalizeWind(25, "coastal")!.score, -0.6, 1e-3);
  assertAlmostEquals(normalizeWind(32, "coastal")!.score, -1.3, 1e-3);
  assertAlmostEquals(normalizeWind(40, "coastal")!.score, -2, 1e-3);
});

Deno.test("wind: high-wind overlay thresholds are continuous", () => {
  const cases = [
    ["freshwater_lake_pond", 15],
    ["freshwater_river", 16],
    ["coastal", 16],
    ["coastal_flats_estuary", 13],
  ] as const;

  for (const [context, threshold] of cases) {
    const before = normalizeWind(threshold - 0.01, context)!.score;
    const after = normalizeWind(threshold + 0.01, context)!.score;
    assert(
      Math.abs(after - before) < 0.01,
      `${context} wind threshold jump ${before} -> ${after}`,
    );
  }
});

Deno.test("light: coastal glare/bright neutral; mixed neutral; low cloud positive", () => {
  assertEquals(normalizeLight(5, "coastal")!.score, 0);
  assertEquals(normalizeLight(20, "coastal")!.score, 0);
  assertEquals(normalizeLight(40, "coastal")!.score, 0);
  assertAlmostEquals(normalizeLight(70, "coastal")!.score, 0.32, 1e-3);
});

Deno.test("precip: light active rain is mild; heavy active rain remains strongly negative", () => {
  const light = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0.02,
    0.08,
    0.15,
    true,
    0.40,
  );
  assert(light != null);
  assertEquals(light.label, "recent_rain");
  assert(
    Math.abs(light.score) <= 0.25,
    `expected light active rain to stay mild, got ${light.score}`,
  );

  const a = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0.15,
    1.0,
    2.0,
    true,
    4.0,
  );
  assertEquals(a!.label, "active_disruption");
  assert(
    a!.score <= -1,
    `expected heavy active rain to remain strongly negative, got ${a!.score}`,
  );

  const r = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0.05,
    0.2,
    0.4,
    false,
  );
  assertEquals(r!.label, "recent_rain");
});

Deno.test("precip: long wet week with low 24h is not dry_stable positive", () => {
  const wet = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0,
    0,
    0.30,
    false,
    4.0,
  );
  assert(wet != null);
  assertEquals(wet.label, "recent_rain");
  assert(
    wet.score <= 0,
    `expected wet baseline to be neutral or negative, got ${wet.score}`,
  );
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
  assertAlmostEquals(t!.score, 1.6, 1e-3);
});

Deno.test("tide V2: inshore slack/soft/too-hard current score-only curve", () => {
  const slack = normalizeTideCurrentMovement(
    { current_speed_knots_max: 0.12 },
    "inshore",
  );
  const barelyMoving = normalizeTideCurrentMovement({
    current_speed_knots_max: 0.55,
  }, "inshore");
  const soft = normalizeTideCurrentMovement(
    { current_speed_knots_max: 0.65 },
    "inshore",
  );
  const strong = normalizeTideCurrentMovement(
    { current_speed_knots_max: 2.0 },
    "inshore",
  );
  const tooHard = normalizeTideCurrentMovement(
    { current_speed_knots_max: 3.2 },
    "inshore",
  );

  assert(
    slack != null && barelyMoving != null && soft != null && strong != null &&
      tooHard != null,
  );
  assertEquals(slack.label, "slack");
  assert(
    slack.score <= -0.7,
    `expected inshore slack negative, got ${slack.score}`,
  );
  assert(
    barelyMoving.score >= -0.65 && barelyMoving.score <= -0.55,
    `expected barely moving inshore current to taper continuously from slack, got ${barelyMoving.score}`,
  );
  assert(
    soft.score >= -0.45 && soft.score <= -0.35,
    `expected soft inshore current to stay on the continuous moving ramp, got ${soft.score}`,
  );
  assert(
    strong.score >= 1.2,
    `expected strong inshore current positive, got ${strong.score}`,
  );
  assert(
    tooHard.score <= -0.25,
    `expected too-hard inshore current negative, got ${tooHard.score}`,
  );
});

Deno.test("tide: stage incoming -> moving", () => {
  const t = normalizeTideFromStage("incoming");
  assertEquals(t!.score, 0.7);
});

Deno.test("tide: high-low exchange range can score strong movement without hourly tide heights", () => {
  const t = normalizeTideCurrentMovement({
    tide_high_low: [
      { time: "2024-07-13 01:26", value: 4.249 },
      { time: "2024-07-13 07:38", value: 0.934 },
      { time: "2024-07-13 14:11", value: 4.584 },
      { time: "2024-07-13 20:19", value: 1.465 },
    ],
    stage: "incoming",
  }, "inshore");
  assert(t != null);
  assertEquals(t.label, "strong_moving");
  assert(
    t.score >= 1.1,
    `expected exchange-range tide score >= 1.1, got ${t.score}`,
  );
});

Deno.test("tide: unknown stage does not auto-score positive", () => {
  const t = normalizeTideFromStage("unknown");
  assertEquals(t, null);
});

Deno.test("tide: flats_estuary policy softens slack stage vs inshore", () => {
  const inshore = normalizeTideFromStage("low slack", "inshore");
  const flats = normalizeTideFromStage("low slack", "flats_estuary");
  assertEquals(inshore!.score, -0.85);
  assertEquals(flats!.score, -0.2);
});

Deno.test("tide: flats avoids a false penalty just above slack but turns negative when flow gets too hard", () => {
  const nearSlack = normalizeTideCurrentMovement({
    current_speed_knots_max: 0.4,
  }, "flats_estuary");
  const gentleMove = normalizeTideCurrentMovement({
    current_speed_knots_max: 0.6,
  }, "flats_estuary");
  const tooHard = normalizeTideCurrentMovement(
    { current_speed_knots_max: 2.5 },
    "flats_estuary",
  );
  assert(nearSlack != null && gentleMove != null && tooHard != null);
  assert(
    nearSlack.score > -0.1,
    `expected near-slack flats score near neutral, got ${nearSlack.score}`,
  );
  assert(
    gentleMove.score > 0,
    `expected gentle flats movement to help, got ${gentleMove.score}`,
  );
  assert(
    tooHard.score < 0,
    `expected hard flats current to be negative, got ${tooHard.score}`,
  );
});

Deno.test("tide V2: flats current curve is helpful at soft flow and cautionary at strong flow", () => {
  const slack = normalizeTideCurrentMovement(
    { current_speed_knots_max: 0.12 },
    "flats_estuary",
  );
  const soft = normalizeTideCurrentMovement(
    { current_speed_knots_max: 0.55 },
    "flats_estuary",
  );
  const optimal = normalizeTideCurrentMovement({
    current_speed_knots_max: 1.25,
  }, "flats_estuary");
  const strong = normalizeTideCurrentMovement(
    { current_speed_knots_max: 2.0 },
    "flats_estuary",
  );
  const tooHard = normalizeTideCurrentMovement(
    { current_speed_knots_max: 2.4 },
    "flats_estuary",
  );

  assert(
    slack != null && soft != null && optimal != null && strong != null &&
      tooHard != null,
  );
  assert(
    slack.score > -0.3 && slack.score <= 0,
    `expected flats slack mild, got ${slack.score}`,
  );
  assert(
    soft.score >= 0.1,
    `expected soft flats current helpful, got ${soft.score}`,
  );
  assert(
    optimal.score >= 1,
    `expected optimal flats current positive, got ${optimal.score}`,
  );
  assert(
    strong.score <= -0.3,
    `expected 2.0 kt flats current cautionary, got ${strong.score}`,
  );
  assert(
    tooHard.score <= -0.5,
    `expected too-hard flats current negative, got ${tooHard.score}`,
  );
});

Deno.test("tide: flats exchange range stays positive enough to matter on strong moving days", () => {
  const t = normalizeTideCurrentMovement({
    tide_high_low: [
      { time: "2024-03-16 01:17", value: 3.783 },
      { time: "2024-03-16 07:54", value: 0.346 },
      { time: "2024-03-16 13:34", value: 2.635 },
      { time: "2024-03-16 19:42", value: 0.025 },
    ],
    stage: "incoming",
  }, "flats_estuary");
  assert(t != null);
  assertEquals(t.label, "strong_moving");
  assert(
    t.score >= 0.85,
    `expected flats exchange-range tide score >= 0.85, got ${t.score}`,
  );
});

Deno.test("tide V2: measured current wins over conflicting stage and hourly data", () => {
  const t = normalizeTideCurrentMovement({
    current_speed_knots_max: 0.65,
    tide_height_hourly_ft: [0.1, 1.3, 2.5, 3.7, 4.9, 3.6],
    stage: "slack",
  }, "inshore");

  assert(t != null);
  assertEquals(t.label, "moving");
  assertAlmostEquals(t.score, -0.4214, 1e-4);
});

Deno.test("tide V2: current-speed segment endpoints are continuous", () => {
  const cases = [
    ["inshore", [0.5, 1.2, 2.0, 2.6]],
    ["flats_estuary", [0.5, 1.0, 1.6, 2.0]],
  ] as const;

  for (const [policy, thresholds] of cases) {
    for (const threshold of thresholds) {
      const before = normalizeTideCurrentMovement(
        { current_speed_knots_max: threshold - 0.001 },
        policy,
      )!.score;
      const after = normalizeTideCurrentMovement(
        { current_speed_knots_max: threshold + 0.001 },
        policy,
      )!.score;
      assert(
        Math.abs(after - before) < 0.01,
        `${policy} current threshold ${threshold} jump ${before} -> ${after}`,
      );
    }
  }
});

Deno.test("tide V2: missing tide remains missing and lowers coastal reliability", () => {
  const norm = buildSharedNormalizedOutput({
    latitude: 27.9,
    longitude: -82.5,
    state_code: "FL",
    region_key: "florida",
    local_date: "2026-06-15",
    local_timezone: "America/New_York",
    context: "coastal",
    environment: {
      daily_mean_air_temp_f: 76,
      prior_day_mean_air_temp_f: 76,
      day_minus_2_mean_air_temp_f: 76,
      pressure_history_mb: Array.from(
        { length: 24 },
        (_, index) => 1014 + index * 0.005,
      ),
      wind_speed_mph: 8,
      cloud_cover_pct: 55,
      precip_rate_now_in_per_hr: 0,
      active_precip_now: false,
      precip_24h_in: 0.02,
      precip_72h_in: 0.05,
      precip_7d_in: 0.10,
      tide_movement_state: "unknown",
    },
    data_coverage: { source_notes: [] },
  });

  assertEquals(norm.normalized.tide_current_movement, undefined);
  assert(norm.missing_variables.includes("tide_current_movement"));
  assert(norm.reliability !== "high");
});

Deno.test("precip: coastal is softer than lake for the same rain totals", () => {
  const lake = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0.03,
    0.8,
    1.6,
    false,
  );
  const coast = normalizePrecipitationDisruption(
    "coastal",
    0.03,
    0.8,
    1.6,
    false,
  );
  assertEquals(lake!.label, "active_disruption");
  assertEquals(coast!.label, "recent_rain");
});

Deno.test("precip: flats_estuary scores the same coastal rain signal instead of dropping it as missing", () => {
  const flats = normalizePrecipitationDisruption(
    "coastal_flats_estuary",
    0.03,
    0.8,
    1.6,
    false,
  );
  assert(flats != null);
  assertEquals(flats.label, "recent_rain");
});

Deno.test("precip: coastal/flats missing p24 or p72 without active/rate returns null", () => {
  assertEquals(
    normalizePrecipitationDisruption(
      "coastal",
      null,
      null,
      0.50,
      false,
      1.0,
    ),
    null,
  );
  assertEquals(
    normalizePrecipitationDisruption(
      "coastal_flats_estuary",
      null,
      0.10,
      null,
      false,
      1.0,
    ),
    null,
  );
});

Deno.test("runoff: florida more tolerant than northeast for same totals", () => {
  const fl = normalizeRunoff("florida", 0.3, 0.7, 1.5);
  const ne = normalizeRunoff("northeast", 0.3, 0.7, 1.5);
  assertEquals(fl!.label, "stable");
  assertEquals(ne!.label, "slightly_elevated");
  assert(
    fl!.score > ne!.score,
    `expected Florida to remain more tolerant, got FL ${fl!.score}, NE ${
      ne!.score
    }`,
  );
});

Deno.test("runoff: requires 24h + 72h + 7d together — no imputed zeros", () => {
  assertEquals(normalizeRunoff("northeast", 0.2, null, 0.5), null);
  assertEquals(normalizeRunoff("northeast", null, 0.2, 0.5), null);
  assertEquals(normalizeRunoff("northeast", 0.2, 0.2, null), null);
});

Deno.test("runoff: stable light active windows remain stable and modest", () => {
  const state = normalizeRunoff("northeast", 0.08, 0.15, 0.40);
  assert(state != null);
  assertEquals(state.label, "stable");
  assert(
    state.score > 0 && state.score <= 0.35,
    `expected stable light windows to stay modest, got ${state.score}`,
  );
});

Deno.test("runoff: saturated baseline is blown_out and strongly negative", () => {
  const state = normalizeRunoff("northeast", 0.20, 2.20, 6.0, 5);
  assert(state != null);
  assertEquals(state.label, "blown_out");
  assert(
    state.score <= -1,
    `expected saturated baseline strongly negative, got ${state.score}`,
  );
});

Deno.test("runoff: month-aware PNW spring wet scenario reflects snowmelt risk", () => {
  const neutralSeason = normalizeRunoff("pacific_northwest", 0.35, 0.70, 1.20);
  const spring = normalizeRunoff("pacific_northwest", 0.35, 0.70, 1.20, 5);
  assert(neutralSeason != null && spring != null);
  assertEquals(spring.label, "elevated");
  assert(
    spring.score < neutralSeason.score && spring.score <= -0.5,
    `expected spring runoff to be more disruptive, neutral ${neutralSeason.score}, spring ${spring.score}`,
  );
});

Deno.test("band mapping exact thresholds", () => {
  assertEquals(bandFromScore(0), "Tough");
  assertEquals(bandFromScore(34), "Tough");
  assertEquals(bandFromScore(35), "Poor");
  assertEquals(bandFromScore(49), "Poor");
  assertEquals(bandFromScore(50), "Fair");
  assertEquals(bandFromScore(64), "Fair");
  assertEquals(bandFromScore(65), "Good");
  assertEquals(bandFromScore(79), "Good");
  assertEquals(bandFromScore(80), "Prime");
  assertEquals(bandFromScore(100), "Prime");
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
    available,
  );
  const sum = w.reduce((a, x) => a + x.finalWeight, 0);
  assert(Math.abs(sum - 100) < 0.01);
  assertEquals(w.length, 4);
});

Deno.test("reweight: flats modifiers diverge from inshore coastal for the same Florida spring date", () => {
  const available = new Set([
    "tide_current_movement",
    "wind_condition",
    "pressure_regime",
    "light_cloud_condition",
    "temperature_condition",
    "precipitation_disruption",
  ]);
  const coastal = computeActiveWeights(
    "coastal",
    "florida",
    "2025-04-15",
    available,
  );
  const flats = computeActiveWeights(
    "coastal_flats_estuary",
    "florida",
    "2025-04-15",
    available,
  );

  const byKey = (arr: typeof coastal, key: string) =>
    arr.find((x) => x.key === key)?.finalWeight ?? 0;
  assert(byKey(flats, "wind_condition") > byKey(coastal, "wind_condition"));
  assert(
    byKey(flats, "light_cloud_condition") >
      byKey(coastal, "light_cloud_condition"),
  );
  assert(
    byKey(flats, "temperature_condition") >
      byKey(coastal, "temperature_condition"),
  );
  assert(
    byKey(flats, "tide_current_movement") <
      byKey(coastal, "tide_current_movement"),
  );
});

function coolTemp(
  over: Partial<TemperatureNormalized> = {},
): TemperatureNormalized {
  return {
    context_group: "freshwater",
    measurement_source: "air_daily_mean",
    measurement_value_f: 50,
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
  overrides: Partial<SharedNormalizedOutput["normalized"]> = {},
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
        measurement_source: "air_daily_mean",
        measurement_value_f: 45,
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

function rainPolicyNorm(
  overrides: Partial<SharedNormalizedOutput["normalized"]> = {},
): SharedNormalizedOutput {
  return {
    location: {
      latitude: 29.76,
      longitude: -95.37,
      state_code: "TX",
      region_key: "gulf_coast",
      local_date: "2026-06-15",
      local_timezone: "America/Chicago",
    },
    context: "coastal",
    normalized: {
      temperature: {
        context_group: "coastal",
        measurement_source: "air_daily_mean",
        measurement_value_f: 78,
        band_label: "optimal",
        band_score: 2,
        trend_label: "stable",
        trend_adjustment: 0,
        shock_label: "none",
        shock_adjustment: 0,
        final_score: 2,
      },
      pressure_regime: { label: "falling_slow", score: 1.5 },
      wind_condition: { label: "moderate", score: 1.2 },
      light_cloud_condition: { label: "low_light", score: 1.1 },
      tide_current_movement: { label: "moderate_moving", score: 2 },
      precipitation_disruption: { label: "dry_stable", score: 0.3 },
      ...overrides,
    },
    available_variables: [
      "temperature_condition",
      "pressure_regime",
      "wind_condition",
      "light_cloud_condition",
      "tide_current_movement",
      "precipitation_disruption",
    ],
    missing_variables: [],
    data_gaps: [],
    reliability: "high",
  };
}

function highFreshwaterEliteNorm(
  overrides: Partial<SharedNormalizedOutput> = {},
): SharedNormalizedOutput {
  return {
    location: {
      latitude: 45,
      longitude: -93,
      state_code: "MN",
      region_key: "great_lakes_upper_midwest",
      local_date: "2026-06-15",
      local_timezone: "America/Chicago",
    },
    context: "freshwater_lake_pond",
    normalized: {
      temperature: {
        context_group: "freshwater",
        measurement_source: "air_daily_mean",
        measurement_value_f: 70,
        band_label: "optimal",
        band_score: 2,
        trend_label: "stable",
        trend_adjustment: 0,
        shock_label: "none",
        shock_adjustment: 0,
        final_score: 2,
      },
      pressure_regime: { label: "falling_slow", score: 2 },
      wind_condition: { label: "moderate", score: 2 },
      light_cloud_condition: { label: "heavy_overcast", score: 2 },
      precipitation_disruption: { label: "dry_stable", score: 1.35 },
    },
    available_variables: [
      "temperature_condition",
      "pressure_regime",
      "wind_condition",
      "light_cloud_condition",
      "precipitation_disruption",
    ],
    missing_variables: [],
    data_gaps: [],
    reliability: "high",
    ...overrides,
  };
}

Deno.test("scoreDay: drivers from positive contributions only", () => {
  const s = scoreDay(minimalNorm());
  assert(s.drivers.length >= 1);
  assert(s.drivers.every((d) => d.weightedContribution > 0));
  assert(s.suppressors.every((x) => x.weightedContribution < 0));
  assert(s.score >= 0 && s.score <= 100);
});

Deno.test("scoreDay: tiny negatives do not surface as limiting factors", () => {
  const s = scoreDay(minimalNorm({
    temperature: {
      context_group: "freshwater",
      measurement_source: "air_daily_mean",
      measurement_value_f: 52,
      band_label: "optimal",
      band_score: 1.2,
      trend_label: "stable",
      trend_adjustment: 0,
      shock_label: "none",
      shock_adjustment: 0,
      final_score: 1.2,
    },
    runoff_flow_disruption: { label: "slightly_elevated", score: -0.12 },
  }));
  assertEquals(s.suppressors.length, 0);
});

Deno.test("scoreDay: tiny positives do not surface as helping factors", () => {
  const s = scoreDay(minimalNorm({
    temperature: {
      context_group: "freshwater",
      measurement_source: "air_daily_mean",
      measurement_value_f: 62,
      band_label: "optimal",
      band_score: 0.3,
      trend_label: "stable",
      trend_adjustment: 0,
      shock_label: "none",
      shock_adjustment: 0,
      final_score: 0.3,
    },
    runoff_flow_disruption: { label: "stable", score: 0.2 },
  }));
  assertEquals(s.drivers.length, 0);
});

Deno.test("scoreDay: mild coastal rain does not surface as a limiting factor", () => {
  const s = scoreDay({
    location: {
      latitude: 29.76,
      longitude: -95.37,
      state_code: "TX",
      region_key: "gulf_coast",
      local_date: "2026-03-30",
      local_timezone: "America/Chicago",
    },
    context: "coastal",
    normalized: {
      temperature: {
        context_group: "coastal",
        measurement_source: "air_daily_mean",
        measurement_value_f: 71,
        band_label: "optimal",
        band_score: 1.1,
        trend_label: "stable",
        trend_adjustment: 0,
        shock_label: "none",
        shock_adjustment: 0,
        final_score: 1.1,
      },
      pressure_regime: { label: "stable_neutral", score: 0.1 },
      wind_condition: { label: "light", score: 0.9 },
      light_cloud_condition: { label: "mixed", score: 0.15 },
      tide_current_movement: { label: "moderate_moving", score: 1.4 },
      precipitation_disruption: { label: "recent_rain", score: -0.4 },
    },
    available_variables: [
      "temperature_condition",
      "pressure_regime",
      "wind_condition",
      "light_cloud_condition",
      "tide_current_movement",
      "precipitation_disruption",
    ],
    missing_variables: [],
    data_gaps: [],
    reliability: "high",
  });
  assertEquals(s.suppressors.length, 0);
});

Deno.test("scoreDay: meaningful coastal rain still surfaces as a limiting factor", () => {
  const s = scoreDay({
    location: {
      latitude: 29.76,
      longitude: -95.37,
      state_code: "TX",
      region_key: "gulf_coast",
      local_date: "2026-03-30",
      local_timezone: "America/Chicago",
    },
    context: "coastal",
    normalized: {
      temperature: {
        context_group: "coastal",
        measurement_source: "air_daily_mean",
        measurement_value_f: 71,
        band_label: "optimal",
        band_score: 0.4,
        trend_label: "stable",
        trend_adjustment: 0,
        shock_label: "none",
        shock_adjustment: 0,
        final_score: 0.4,
      },
      pressure_regime: { label: "stable_neutral", score: 0.1 },
      wind_condition: { label: "light", score: 0.3 },
      light_cloud_condition: { label: "mixed", score: 0.1 },
      tide_current_movement: { label: "moderate_moving", score: 0.8 },
      precipitation_disruption: { label: "active_disruption", score: -2 },
    },
    available_variables: [
      "temperature_condition",
      "pressure_regime",
      "wind_condition",
      "light_cloud_condition",
      "tide_current_movement",
      "precipitation_disruption",
    ],
    missing_variables: [],
    data_gaps: [],
    reliability: "high",
  });
  assertEquals(s.suppressors[0]?.key, "precipitation_disruption");
});

Deno.test("scoreDay policy: active disruption caps final score and recomputes band", () => {
  const s = scoreDay(rainPolicyNorm({
    precipitation_disruption: { label: "active_disruption", score: -2 },
  }));
  assertEquals(s.score, 55);
  assertEquals(s.band, "Fair");
  assertEquals(s.suppressors[0]?.key, "precipitation_disruption");
});

Deno.test("scoreDay policy: wet recent rain caps final score at 65", () => {
  const s = scoreDay(rainPolicyNorm({
    precipitation_disruption: { label: "recent_rain", score: -0.45 },
  }));
  assertEquals(s.score, 65);
  assertEquals(s.band, "Good");
});

Deno.test("scoreDay policy: precip cap tapers numerically between active and recent rain", () => {
  const active = scoreDay(rainPolicyNorm({
    precipitation_disruption: { label: "active_disruption", score: -1.1 },
  }));
  const middle = scoreDay(rainPolicyNorm({
    precipitation_disruption: { label: "active_disruption", score: -0.775 },
  }));
  const recent = scoreDay(rainPolicyNorm({
    precipitation_disruption: { label: "recent_rain", score: -0.45 },
  }));

  assertEquals(active.score, 55);
  assertEquals(middle.score, 60);
  assertEquals(recent.score, 65);
});

Deno.test("scoreDay policy: recent rain above wet threshold is not capped", () => {
  const s = scoreDay(rainPolicyNorm({
    precipitation_disruption: { label: "recent_rain", score: -0.44 },
  }));
  assert(s.score > 65);
});

Deno.test("scoreDay policy: major suppressor caps high scores at 69", () => {
  const s = scoreDay(rainPolicyNorm({
    wind_condition: { label: "extreme", score: -2 },
    precipitation_disruption: { label: "dry_stable", score: 0.4 },
  }));
  assertEquals(s.score, 69);
  assertEquals(s.band, "Good");
  assert(s.suppressors.some((x) => x.weightedContribution <= -10));
});

Deno.test("scoreDay policy: no major suppressor means no suppressor ceiling", () => {
  const s = scoreDay(rainPolicyNorm({
    wind_condition: { label: "moderate", score: -0.2 },
    precipitation_disruption: { label: "dry_stable", score: 0.4 },
  }));
  assert(s.score > 69);
  assert(!s.suppressors.some((x) => x.weightedContribution <= -10));
});

Deno.test("scoreDay policy: final score cap preserves contribution surfaces", () => {
  const s = scoreDay(rainPolicyNorm({
    precipitation_disruption: { label: "active_disruption", score: -2 },
  }));
  assertEquals(s.score, 55);
  assert(
    s.contributions.some((x) =>
      x.key === "precipitation_disruption" && x.score === -2
    ),
  );
  assertEquals(s.drivers.map((x) => x.key), [
    "tide_current_movement",
    "temperature_condition",
  ]);
  assertEquals(s.suppressors.map((x) => x.key), [
    "precipitation_disruption",
  ]);
});

Deno.test("scoreDay policy: score-only and report paths stay consistent", () => {
  const req = {
    latitude: 29.76,
    longitude: -95.37,
    state_code: "TX",
    region_key: "gulf_coast" as const,
    local_date: "2026-06-15",
    local_timezone: "America/Chicago",
    context: "coastal" as const,
    environment: {
      daily_mean_air_temp_f: 80,
      prior_day_mean_air_temp_f: 79,
      day_minus_2_mean_air_temp_f: 78,
      pressure_mb: 1010,
      pressure_history_mb: [1018, 1014, 1010],
      wind_speed_mph: 10,
      cloud_cover_pct: 92,
      precip_rate_now_in_per_hr: 0.15,
      active_precip_now: true,
      precip_24h_in: 1,
      precip_72h_in: 2,
      precip_7d_in: 4,
      tide_movement_state: "outgoing",
      current_speed_knots_max: 1.4,
      tide_high_low: [
        { time: "2026-06-15T05:00:00", value: 0.2, type: "L" },
        { time: "2026-06-15T11:00:00", value: 2.8, type: "H" },
      ],
    },
    data_coverage: { source_notes: [] },
  };
  const report = runHowFishingReport(req);
  assertEquals(runHowFishingScoreOnly(req), report.score);
  assert(report.score <= 55);
});

Deno.test("scoreDay policy: data-quality caps apply after freshwater elite gate", () => {
  const complete = scoreDay(highFreshwaterEliteNorm());
  const missing = scoreDay(highFreshwaterEliteNorm({
    missing_variables: ["precipitation_disruption"],
  }));
  const lowReliability = scoreDay(highFreshwaterEliteNorm({
    reliability: "medium",
  }));

  assert(complete.score >= 95);
  assertEquals(missing.score, 64);
  assertEquals(lowReliability.score, 72);
});

Deno.test("scoreDay policy: freshwater elite gate is not applied to non-freshwater rows", () => {
  const base = highFreshwaterEliteNorm();
  const coastal = scoreDay({
    ...base,
    context: "coastal",
    location: {
      latitude: 29.76,
      longitude: -95.37,
      state_code: "TX",
      region_key: "gulf_coast",
      local_date: "2026-06-15",
      local_timezone: "America/Chicago",
    },
    normalized: {
      ...base.normalized,
      tide_current_movement: { label: "strong_moving", score: 2 },
    },
    available_variables: [
      "temperature_condition",
      "pressure_regime",
      "wind_condition",
      "light_cloud_condition",
      "tide_current_movement",
      "precipitation_disruption",
    ],
  });

  assertEquals(coastal.score, 100);
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
      pressure_history_mb: Array.from(
        { length: 24 },
        (_, i) => 1013 + Math.sin(i / 4) * 0.3,
      ),
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
  assert(["Tough", "Poor", "Fair", "Good", "Prime"].includes(r.band));
  assert(r.drivers.length <= 2);
  assert(r.suppressors.length <= 2);
  assert(r.actionable_tip.length > 0);
  assert(r.daypart_preset != null);
  const cc = r.condition_context!;
  assert(cc.normalized_variable_scores.length >= 3);
  const tempEntry = cc.normalized_variable_scores.find((x) =>
    x.variable_key === "temperature_condition"
  );
  assert(tempEntry != null);
  assertEquals(
    tempEntry!.engine_score,
    tempEntry!.temperature_breakdown?.final_score,
  );
  assert(cc.composite_contributions.length >= 3);
  assertEquals(
    cc.composite_contributions.reduce((a, c) => a + c.weighted_contribution, 0),
    cc.composite_contributions.reduce(
      (a, c) => a + c.weight * c.normalized_score,
      0,
    ),
  );
  assertEquals(
    cc.environment_snapshot.pressure_history_summary?.sample_count,
    24,
  );
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
      pressure_history_mb: Array.from(
        { length: 24 },
        (_, i) => 1013 + Math.sin(i / 4) * 0.3,
      ),
      wind_speed_mph: 8,
      cloud_cover_pct: 50,
      precip_24h_in: 0.05,
      precip_72h_in: 0.1,
      precip_7d_in: 0.5,
    },
    data_coverage: {
      source_notes: [
        "hourly_air_temp_f: 3 valid local hours for 2025-02-15 (need 12)",
      ],
    },
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
  const g = n.data_gaps.find((x) =>
    x.variable_key === "runoff_flow_disruption"
  );
  assertEquals(g?.reason, "incomplete_precip_windows");
});

Deno.test("buildNormalized: coastal-family air-temp scoring downgrades reliability one step", () => {
  const n = buildSharedNormalizedOutput({
    latitude: 25.2,
    longitude: -80.9,
    state_code: "FL",
    region_key: "florida",
    local_date: "2025-04-15",
    local_timezone: "America/New_York",
    context: "coastal_flats_estuary",
    environment: {
      daily_mean_air_temp_f: 78,
      prior_day_mean_air_temp_f: 77,
      day_minus_2_mean_air_temp_f: 76,
      pressure_history_mb: Array.from({ length: 24 }, () => 1014.8),
      wind_speed_mph: 16,
      cloud_cover_pct: 20,
      current_speed_knots_max: 1.7,
    },
    data_coverage: {},
  });
  assertEquals(n.normalized.temperature?.measurement_source, "air_daily_mean");
  assertEquals(n.reliability, "medium");
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
    "seed:positive-temp",
  );
  // With a positive temp driver, the tip should be from TEMP_ACTIVE_TIPS
  assert(b.actionable_tip_tag === "strategy_push_windows");
});

Deno.test("buildActionableTip: temperature suppressor avoids heat/cold wording", () => {
  const n = minimalNorm({
    temperature: {
      context_group: "freshwater",
      measurement_source: "air_daily_mean",
      measurement_value_f: 84,
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
    const b = buildActionableTip(
      "freshwater_lake_pond",
      undefined,
      sup,
      n.normalized,
      `seed:${i}`,
    );
    assert(
      !/\b(heat|hot|cold|warm|cool)\b/i.test(b.actionable_tip),
      b.actionable_tip,
    );
  }
});

Deno.test("buildActionableTip: near-optimal temperature suppressor stays generic", () => {
  const n = minimalNorm({
    temperature: {
      context_group: "freshwater",
      measurement_source: "air_daily_mean",
      measurement_value_f: 60,
      band_label: "near_optimal",
      band_score: -0.5,
      trend_label: "stable",
      trend_adjustment: 0,
      shock_label: "none",
      shock_adjustment: 0,
      final_score: -0.5,
    },
  });
  const sup = {
    key: "temperature_condition" as const,
    score: -0.5 as const,
    label: "",
    weight: 32,
    weightedContribution: -16,
  };
  const tip = buildActionableTip(
    "freshwater_lake_pond",
    undefined,
    sup,
    n.normalized,
    "seed:optimal-edge",
  );
  assertEquals(
    /\b(heat|hot|cold|warm|cool)\b/i.test(tip.actionable_tip),
    false,
    tip.actionable_tip,
  );
});

Deno.test("thermalAirPlain: near-optimal negative temp stays honest about edge-of-window conditions", () => {
  const line = buildThermalAirPlain(
    {
      context_group: "freshwater",
      measurement_source: "air_daily_mean",
      measurement_value_f: 60,
      band_label: "near_optimal",
      band_score: -0.5,
      trend_label: "stable",
      trend_adjustment: 0,
      shock_label: "none",
      shock_adjustment: 0,
      final_score: -0.5,
    },
    60,
    null,
  );
  assertEquals(line.includes("right in the seasonal range"), false);
  assert(line.includes("edge of the better window"));
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
        63,
        62,
        62,
        61,
        61,
        60,
        60,
        61,
        64,
        68,
        72,
        75,
        78,
        81,
        84,
        86,
        86,
        85,
        82,
        78,
        75,
        73,
        71,
        68,
      ],
      hourly_cloud_cover_pct: Array(24).fill(0),
    },
    data_coverage: {},
  });
  assertEquals(r.timing_debug?.anchor_driver, "avoid_heat");
  assertEquals(r.daypart_preset, "early_late_low_light");
  assertEquals(r.highlighted_periods?.[2], false);
});

Deno.test("timing: cold/warming freshwater priority anchors on seek_warmth", () => {
  const r = runHowFishingReport({
    latitude: 42.3,
    longitude: -71.1,
    state_code: "MA",
    region_key: "northeast",
    local_date: "2026-01-12",
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 25,
      prior_day_mean_air_temp_f: 18,
      day_minus_2_mean_air_temp_f: 14,
      pressure_history_mb: [1018, 1016, 1014, 1012],
      wind_speed_mph: 5,
      cloud_cover_pct: 35,
      precip_24h_in: 0,
      precip_72h_in: 0.02,
      precip_7d_in: 0.08,
      hourly_air_temp_f: Array.from({ length: 24 }, (_, h) => 16 + h * 0.7),
      hourly_cloud_cover_pct: Array(24).fill(35),
    },
    data_coverage: {},
  });
  assertEquals(r.timing_debug?.anchor_driver, "seek_warmth");
  assertEquals(r.timing_debug?.fallback_used, false);
  assert(!r.highlighted_periods?.[0]);
});

Deno.test("timing: mountain_alpine winter low-edge near-optimal warming anchors on seek_warmth", () => {
  const r = runHowFishingReport({
    latitude: 39.7,
    longitude: -105,
    state_code: "CO",
    region_key: "mountain_alpine",
    local_date: "2026-02-11",
    local_timezone: "America/Denver",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 18.15,
      prior_day_mean_air_temp_f: 12.15,
      day_minus_2_mean_air_temp_f: 8.15,
      pressure_history_mb: [1018, 1016, 1014, 1012.5, 1011.5, 1010.5],
      wind_speed_mph: 5,
      cloud_cover_pct: 35,
      precip_24h_in: 0,
      precip_72h_in: 0.02,
      precip_7d_in: 0.08,
      hourly_air_temp_f: Array.from(
        { length: 24 },
        (_, h) => 10.15 + h * 0.65,
      ),
      hourly_cloud_cover_pct: Array(24).fill(35),
    },
    data_coverage: {},
  });
  assertEquals(r.timing_debug?.anchor_driver, "seek_warmth");
  assertEquals(r.timing_debug?.fallback_used, false);
  assertEquals(r.highlighted_periods?.[0], false);
  assertEquals(r.highlighted_periods?.[2] || r.highlighted_periods?.[3], true);
});

Deno.test("timing: alaska winter low-edge near-optimal warming river anchors on seek_warmth", () => {
  const r = runHowFishingReport({
    latitude: 61.2,
    longitude: -149.9,
    state_code: "AK",
    region_key: "alaska",
    local_date: "2026-01-11",
    local_timezone: "America/Anchorage",
    context: "freshwater_river",
    environment: {
      daily_mean_air_temp_f: 18.15,
      prior_day_mean_air_temp_f: 12.15,
      day_minus_2_mean_air_temp_f: 8.15,
      pressure_history_mb: [1018, 1016, 1014, 1012.5, 1011.5, 1010.5],
      wind_speed_mph: 5,
      cloud_cover_pct: 35,
      precip_24h_in: 0,
      precip_72h_in: 0.02,
      precip_7d_in: 0.08,
      hourly_air_temp_f: Array.from(
        { length: 24 },
        (_, h) => 10.15 + h * 0.65,
      ),
      hourly_cloud_cover_pct: Array(24).fill(35),
    },
    data_coverage: {},
  });
  assertEquals(r.timing_debug?.anchor_driver, "seek_warmth");
  assertEquals(r.timing_debug?.fallback_used, false);
  assertEquals(r.highlighted_periods?.[0], false);
  assertEquals(r.highlighted_periods?.[2] || r.highlighted_periods?.[3], true);
});

Deno.test("timing: low-edge near-optimal stable winter cold does not fake seek_warmth", () => {
  const r = runHowFishingReport({
    latitude: 39.7,
    longitude: -105,
    state_code: "CO",
    region_key: "mountain_alpine",
    local_date: "2026-02-11",
    local_timezone: "America/Denver",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 18.15,
      prior_day_mean_air_temp_f: 18.15,
      day_minus_2_mean_air_temp_f: 18.15,
      pressure_history_mb: [1018, 1018, 1018, 1018],
      wind_speed_mph: 5,
      cloud_cover_pct: 35,
      precip_24h_in: 0,
      precip_72h_in: 0.02,
      precip_7d_in: 0.08,
      hourly_air_temp_f: Array.from(
        { length: 24 },
        (_, h) => 10.15 + h * 0.2,
      ),
      hourly_cloud_cover_pct: Array(24).fill(35),
    },
    data_coverage: {},
  });
  assert(r.timing_debug?.anchor_driver !== "seek_warmth");
});

Deno.test("timing: broad cloud_all_day light does not become production priority anchor", () => {
  const r = runHowFishingReport({
    latitude: 42.3,
    longitude: -71.1,
    state_code: "MA",
    region_key: "northeast",
    local_date: "2026-01-12",
    local_timezone: "America/New_York",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 44,
      prior_day_mean_air_temp_f: 44,
      day_minus_2_mean_air_temp_f: 44,
      pressure_history_mb: [1015, 1015.1, 1015, 1015.1],
      wind_speed_mph: 8,
      cloud_cover_pct: 95,
      precip_24h_in: 0,
      precip_72h_in: 0.02,
      precip_7d_in: 0.08,
      hourly_air_temp_f: Array(24).fill(44),
      hourly_cloud_cover_pct: Array(24).fill(95),
    },
    data_coverage: {},
  });
  assertEquals(r.timing_debug?.anchor_driver, "neutral_fallback");
  assertEquals(r.timing_debug?.fallback_used, true);
  assertEquals(r.highlighted_periods, [false, false, true, false]);
});

Deno.test("timing: low overall reliability no longer suppresses coastal timing when tide exchanges are present", () => {
  const r = runHowFishingReport({
    latitude: 29.26,
    longitude: -94.98,
    state_code: "TX",
    region_key: "gulf_coast",
    local_date: "2026-05-10",
    local_timezone: "America/Chicago",
    context: "coastal",
    environment: {
      daily_mean_air_temp_f: 78,
      prior_day_mean_air_temp_f: 76,
      day_minus_2_mean_air_temp_f: 74,
      pressure_history_mb: [1012, 1011.5, 1011, 1010.5],
      wind_speed_mph: 14,
      cloud_cover_pct: 35,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0.15,
      tide_high_low: [
        { time: "2026-05-10T05:40:00", value: 1.2, type: "H" },
        { time: "2026-05-10T14:32:00", value: 0.1, type: "L" },
      ],
      current_speed_knots_max: 1.2,
      sunrise_local: "06:23",
      sunset_local: "19:57",
    },
    data_coverage: {},
  });
  assertEquals(r.reliability, "low");
  assertEquals(r.timing_debug?.anchor_driver, "tide_exchange_window");
  assertEquals(r.highlighted_periods, [true, false, true, false]);
});

Deno.test("timing: tide-without-clock falls back to the combo bias window", () => {
  const r = runHowFishingReport({
    latitude: 29.26,
    longitude: -94.98,
    state_code: "TX",
    region_key: "gulf_coast",
    local_date: "2026-07-20",
    local_timezone: "America/Chicago",
    context: "coastal",
    environment: {
      daily_mean_air_temp_f: 82,
      prior_day_mean_air_temp_f: 80,
      day_minus_2_mean_air_temp_f: 79,
      pressure_history_mb: [1013, 1014, 1014.5, 1015],
      wind_speed_mph: 12,
      cloud_cover_pct: 8,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0.1,
      current_speed_knots_max: 1.5,
      tide_movement_state: "incoming",
      sunrise_local: "06:35",
      sunset_local: "20:01",
    },
    data_coverage: {},
  });
  assertEquals(r.reliability, "low");
  assertEquals(r.timing_debug?.anchor_driver, "neutral_fallback");
  assertEquals(r.timing_debug?.primary_driver, "tide_exchange_window");
  assertEquals(r.highlighted_periods, [true, false, false, true]);
  assert(
    r.daypart_note != null &&
      /Early and late|Dawn and evening|Low-light edges/i.test(r.daypart_note),
  );
});

Deno.test("timing: coastal real tide stays anchor even when heat qualifies", () => {
  const r = runHowFishingReport({
    latitude: 29.26,
    longitude: -94.98,
    state_code: "TX",
    region_key: "gulf_coast",
    local_date: "2026-07-20",
    local_timezone: "America/Chicago",
    context: "coastal",
    environment: {
      daily_mean_air_temp_f: 92,
      prior_day_mean_air_temp_f: 91,
      day_minus_2_mean_air_temp_f: 90,
      measured_water_temp_f: 92,
      measured_water_temp_24h_ago_f: 91,
      measured_water_temp_72h_ago_f: 90,
      pressure_history_mb: [1014, 1013, 1012, 1011],
      wind_speed_mph: 10,
      cloud_cover_pct: 5,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0.1,
      tide_high_low: [
        { time: "2026-07-20T12:10:00", value: 0.2, type: "L" },
        { time: "2026-07-20T14:30:00", value: 2.8, type: "H" },
      ],
      current_speed_knots_max: 1.2,
      hourly_air_temp_f: Array.from(
        { length: 24 },
        (_, h) => h < 8 ? 82 : h < 18 ? 95 : 85,
      ),
      hourly_cloud_cover_pct: Array(24).fill(5),
    },
    data_coverage: {},
  });
  assertEquals(r.timing_debug?.anchor_driver, "tide_exchange_window");
  assertEquals(r.timing_debug?.fallback_used, false);
  assert(
    /heat caution/i.test(r.timing_debug?.selection_reason ?? ""),
    r.timing_debug?.selection_reason,
  );
});

Deno.test("timing: winter flats moving tide chooses tide instead of warmth fallback", () => {
  const r = runHowFishingReport({
    latitude: 42.3,
    longitude: -71.1,
    state_code: "MA",
    region_key: "northeast",
    local_date: "2026-01-12",
    local_timezone: "America/New_York",
    context: "coastal_flats_estuary",
    environment: {
      daily_mean_air_temp_f: 42,
      prior_day_mean_air_temp_f: 42,
      day_minus_2_mean_air_temp_f: 42,
      measured_water_temp_f: 42,
      measured_water_temp_24h_ago_f: 42,
      measured_water_temp_72h_ago_f: 42,
      pressure_history_mb: [1015, 1014.5, 1014, 1013.5],
      wind_speed_mph: 8,
      cloud_cover_pct: 45,
      precip_24h_in: 0,
      precip_72h_in: 0.02,
      precip_7d_in: 0.08,
      tide_high_low: [
        { time: "2026-01-12T06:10:00", value: 0.2, type: "L" },
        { time: "2026-01-12T12:40:00", value: 3.1, type: "H" },
      ],
      current_speed_knots_max: 1.1,
    },
    data_coverage: {},
  });
  assertEquals(r.timing_debug?.anchor_driver, "tide_exchange_window");
  assertEquals(r.timing_debug?.primary_driver, "seek_warmth");
  assertEquals(r.timing_debug?.secondary_driver, "tide_exchange_window");
  assertEquals(r.timing_debug?.secondary_qualified, true);
  assertEquals(r.timing_debug?.secondary_role, "anchor");
  assertEquals(r.timing_debug?.fallback_used, false);
});

Deno.test("timing: missing tide events never invent tide timing", () => {
  const r = runHowFishingReport({
    latitude: 29.26,
    longitude: -94.98,
    state_code: "TX",
    region_key: "gulf_coast",
    local_date: "2026-07-20",
    local_timezone: "America/Chicago",
    context: "coastal",
    environment: {
      daily_mean_air_temp_f: 82,
      prior_day_mean_air_temp_f: 80,
      day_minus_2_mean_air_temp_f: 79,
      pressure_history_mb: [1013, 1014, 1014.5, 1015],
      wind_speed_mph: 12,
      cloud_cover_pct: 8,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0.1,
      current_speed_knots_max: 1.5,
      tide_movement_state: "incoming",
      sunrise_local: "06:35",
      sunset_local: "20:01",
    },
    data_coverage: {},
  });
  assertEquals(r.timing_debug?.primary_driver, "tide_exchange_window");
  assert(r.timing_debug?.anchor_driver !== "tide_exchange_window");
});

Deno.test("timing: solunar does not influence timing selection", () => {
  const r = runHowFishingReport({
    latitude: 29.26,
    longitude: -94.98,
    state_code: "TX",
    region_key: "gulf_coast",
    local_date: "2026-05-10",
    local_timezone: "America/Chicago",
    context: "coastal",
    environment: {
      daily_mean_air_temp_f: 78,
      prior_day_mean_air_temp_f: 77,
      day_minus_2_mean_air_temp_f: 76,
      pressure_history_mb: Array.from({ length: 24 }, () => 1013),
      wind_speed_mph: 12,
      cloud_cover_pct: 92,
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0.05,
      solunar_peak_local: ["06:10", "18:35"],
      sunrise_local: "06:23",
      sunset_local: "19:57",
    },
    data_coverage: {},
  });
  assertEquals(r.timing_debug?.anchor_driver, "neutral_fallback");
  assertEquals(r.highlighted_periods, [false, true, false, true]);
  assertEquals(r.timing_strength, "fair_default");
});

Deno.test("temperature: warm band with 48h shock blocks trend stacking", () => {
  const t = normalizeTemperature(
    "freshwater_river",
    "great_lakes_upper_midwest",
    1,
    38,
    32,
    18,
  );
  assertAlmostEquals(t!.band_score, 1.2, 1e-3);
  assertEquals(t!.shock_adjustment, -1);
  assertEquals(t!.trend_adjustment, 0);
  assertAlmostEquals(t!.final_score, -0.02, 1e-3);
});

Deno.test("temperature: shock blocks stacking with trend", () => {
  const t = normalizeTemperature(
    "freshwater_lake_pond",
    "northeast",
    4,
    55,
    42,
    41,
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
    r.band === "Good" || r.band === "Prime" || r.band === "Fair",
    `expected upper-mid band, got ${r.band}`,
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
      r.suppressors.some((s) => s.variable === "temperature_condition"),
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
    "runoff should surface as suppressor",
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

Deno.test("timing: warm_humid lake shifts from winter warmth to spring light between March and April", () => {
  const mar = resolveTimingFamily(
    "freshwater_lake_pond",
    "southeast_atlantic",
    3,
  );
  const apr = resolveTimingFamily(
    "freshwater_lake_pond",
    "southeast_atlantic",
    4,
  );
  assertEquals(mar.family_id, "lake_warm_winter");
  assertEquals(mar.anchor_driver, "seek_warmth");
  assertEquals(apr.family_id, "lake_warm_spring");
  assertEquals(apr.anchor_driver, "light_window");
});

Deno.test("timing: interior_continental lake moves from spring warmth into summer light by June", () => {
  const may = resolveTimingFamily(
    "freshwater_lake_pond",
    "great_lakes_upper_midwest",
    5,
  );
  const jun = resolveTimingFamily(
    "freshwater_lake_pond",
    "great_lakes_upper_midwest",
    6,
  );
  assertEquals(may.family_id, "lake_cold_spring");
  assertEquals(may.anchor_driver, "seek_warmth");
  assertEquals(jun.family_id, "lake_cold_summer");
  assertEquals(jun.anchor_driver, "light_window");
});

Deno.test("timing: seek_warmth null when cooling or no warming trigger", () => {
  const baseOpts = { local_date: "2025-02-01" as const };
  let norm = minimalNorm({ temperature: coolTemp({ trend_label: "cooling" }) });
  assertEquals(evaluateTemperatureWindow("seek_warmth", norm, baseOpts), null);

  norm = minimalNorm({
    temperature: coolTemp({ shock_label: "sharp_cooldown" }),
  });
  assertEquals(evaluateTemperatureWindow("seek_warmth", norm, baseOpts), null);

  norm = minimalNorm({ temperature: coolTemp({ trend_label: "stable" }) });
  assertEquals(evaluateTemperatureWindow("seek_warmth", norm, baseOpts), null);
});

Deno.test("timing: seek_warmth qualifies on warming trend or day-over-day lift", () => {
  const normW = minimalNorm({
    temperature: coolTemp({ trend_label: "warming" }),
  });
  const sw = evaluateTemperatureWindow("seek_warmth", normW, {
    local_date: "2025-02-01",
  });
  assert(sw != null);
  assertEquals(sw!.periods, [false, false, true, false]);

  const normD = minimalNorm({
    temperature: coolTemp({ trend_label: "stable" }),
  });
  const sd = evaluateTemperatureWindow("seek_warmth", normD, {
    local_date: "2025-02-01",
    daily_mean_air_temp_f: 40,
    prior_day_mean_air_temp_f: 34,
  });
  assert(sd != null);
  assertEquals(sd!.periods, [false, false, true, false]);

  const normWide = minimalNorm({
    temperature: coolTemp({ shock_label: "sharp_warmup" }),
  });
  const sw2 = evaluateTemperatureWindow("seek_warmth", normWide, {
    local_date: "2025-02-01",
  });
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

Deno.test("timing: flat heavy overcast hourly stays broad instead of collapsing to early tied buckets", () => {
  const hourly = Array.from({ length: 24 }, () => 95);
  const norm = minimalNorm({
    light_cloud_condition: { label: "low_light", score: 2, detail: "95%" },
  });
  const s = evaluatePreferredLightWindow(norm, {
    local_date: "2025-06-01",
    cloud_cover_pct: 95,
    hourly_cloud_cover_pct: hourly,
  });
  assert(s != null);
  assertEquals(s!.periods, [true, true, true, true]);
  assertEquals(s!.note_pool_key, "cloud_all_day");
});

Deno.test("timing: daily heavy overcast can own an all-day light window", () => {
  const norm = minimalNorm({
    light_cloud_condition: { label: "low_light", score: 2, detail: "88%" },
  });
  const s = evaluatePreferredLightWindow(norm, {
    local_date: "2025-06-01",
    cloud_cover_pct: 88,
  });
  assert(s != null);
  assertEquals(s!.periods, [true, true, true, true]);
  assertEquals(s!.note_pool_key, "cloud_all_day");
});

Deno.test("timing: seek_warmth hourly places spike in evening when curve jumps late", () => {
  const hourly = Array.from({ length: 24 }, () => 30);
  hourly[18] = 44;
  const norm = minimalNorm({
    temperature: coolTemp({ trend_label: "warming" }),
  });
  const s = evaluateTemperatureWindow("seek_warmth", norm, {
    local_date: "2025-02-01",
    hourly_air_temp_f: hourly,
  });
  assert(s != null);
  assertEquals(s!.periods, [false, false, false, true]);
});

Deno.test("timing: stable very-cold dawn window uses a dawn-aligned note pool", () => {
  const hourly = [
    43,
    41,
    39,
    37,
    34,
    30,
    27,
    24,
    22,
    21,
    20,
    19,
    18,
    18,
    18,
    19,
    20,
    21,
    22,
    23,
    25,
    28,
    33,
    38,
  ];
  const norm = minimalNorm({
    temperature: coolTemp({
      band_label: "very_cold",
      band_score: -2,
      final_score: -2,
      trend_label: "stable",
      shock_label: "none",
    }),
  });
  const s = evaluateTemperatureWindow("seek_warmth", norm, {
    local_date: "2025-02-15",
    hourly_air_temp_f: hourly,
  });
  assert(s != null);
  assertEquals(s!.periods, [true, false, false, false]);
  assertEquals(s!.note_pool_key, "fallback_dawn_morning");
});

Deno.test("timing: seek_warmth hourly prefers the warmest late-day bucket over an early warming slope", () => {
  const hourly = [
    46,
    45,
    44,
    43,
    43,
    45,
    48,
    53,
    58,
    62,
    66,
    69,
    71,
    73,
    75,
    76,
    75,
    73,
    69,
    64,
    59,
    55,
    52,
    49,
  ];
  const norm = minimalNorm({
    temperature: coolTemp({ trend_label: "warming" }),
  });
  const s = evaluateTemperatureWindow("seek_warmth", norm, {
    local_date: "2025-02-01",
    hourly_air_temp_f: hourly,
  });
  assert(s != null);
  assertEquals(s!.periods, [false, false, true, false]);
});

Deno.test("timing: seek_warmth widens into evening when late-day plateau stays warm", () => {
  const hourly = [
    36,
    35,
    34,
    33,
    33,
    35,
    38,
    43,
    49,
    54,
    59,
    63,
    66,
    68,
    70,
    71,
    70,
    69,
    68,
    67,
    65,
    61,
    56,
    50,
  ];
  const norm = minimalNorm({
    temperature: coolTemp({ trend_label: "warming" }),
  });
  const s = evaluateTemperatureWindow("seek_warmth", norm, {
    local_date: "2025-02-01",
    hourly_air_temp_f: hourly,
  });
  assert(s != null);
  assertEquals(s!.periods, [false, false, true, true]);
  assertEquals(s!.note_pool_key, "warmth_plateau_window");
});

Deno.test("timing: avoid_heat widens into dawn and morning when cool relief lasts", () => {
  const hourly = [
    80,
    79,
    78,
    77,
    76,
    75,
    75,
    76,
    77,
    78,
    79,
    84,
    89,
    92,
    94,
    95,
    94,
    90,
    87,
    85,
    83,
    82,
    81,
    80,
  ];
  const norm = minimalNorm({
    temperature: {
      ...coolTemp(),
      band_label: "very_warm",
      band_score: -1.2,
      final_score: -1.2,
      trend_label: "stable",
      shock_label: "none",
    },
  });
  const s = evaluateTemperatureWindow("avoid_heat", norm, {
    local_date: "2025-07-01",
    cloud_cover_pct: 10,
    hourly_air_temp_f: hourly,
  });
  assert(s != null);
  assertEquals(s!.periods, [true, true, false, false]);
  assertEquals(s!.note_pool_key, "coolest_window");
});

Deno.test("timing: coastal tide score but no times -> no tide window returned", () => {
  const norm = minimalNorm({
    tide_current_movement: { label: "incoming", score: 1, detail: "moving" },
  });
  const sig = evaluateTideWindow(norm, {
    local_date: "2025-03-10",
    tide_high_low: null,
  });
  assertEquals(sig, null);
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

Deno.test("timing: maritime_cool June uses cold_summer profile", () => {
  const pnw = resolveTimingFamily(
    "freshwater_lake_pond",
    "pacific_northwest",
    6,
  );
  assertEquals(pnw.family_id, "lake_cold_summer");
  assertEquals(pnw.anchor_driver, "light_window");
});

Deno.test("timing: hot_arid April uses hot_summer (avoid_heat) vs hot_humid April uses hot_spring", () => {
  const arid = resolveTimingFamily(
    "freshwater_lake_pond",
    "southwest_desert",
    4,
  );
  const humid = resolveTimingFamily("freshwater_lake_pond", "gulf_coast", 4);
  assertEquals(arid.family_id, "lake_hot_summer");
  assertEquals(arid.anchor_driver, "avoid_heat");
  assertEquals(humid.family_id, "lake_hot_spring");
  assertEquals(humid.anchor_driver, "light_window");
});

Deno.test("timing: runHowFishingReport freshwater June resolves a single explicit monthly profile", () => {
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
  assertEquals(r.timing_debug!.family_id, "lake_warm_summer");
  assertEquals(r.timing_debug!.month_blend_t, undefined);
});

// ── New tests for Changes 1, 2, 3, 4 ─────────────────────────────────────────

Deno.test("change1: cold band (cool) clear sky — light score neutral, not penalized", () => {
  // Direct normalizer call: cool band, 5% cloud — should score ~0 not -1.x
  const result = normalizeLight(5, "freshwater_lake_pond", {
    temperatureBandLabel: "cool",
  });
  assert(result != null);
  assert(
    result!.score > -0.5,
    `expected score > -0.5 in cold band, got ${result!.score}`,
  );
  assertEquals(result!.label, "bright"); // not "glare" even at 5%
});

Deno.test("change1: very_cold band clear sky — light score neutral", () => {
  const result = normalizeLight(3, "freshwater_lake_pond", {
    temperatureBandLabel: "very_cold",
  });
  assert(result != null);
  assert(
    result!.score > -0.5,
    `expected score > -0.5 in very_cold band, got ${result!.score}`,
  );
  assertEquals(result!.label, "bright");
});

Deno.test("change1 regression: warm band clear sky — glare penalty still applied", () => {
  // No opts / warm band should still apply the original penalty
  const warm = normalizeLight(5, "freshwater_lake_pond", {
    temperatureBandLabel: "warm",
  });
  const noOpts = normalizeLight(5, "freshwater_lake_pond");
  assert(warm != null && noOpts != null);
  assert(
    warm!.score < -0.5,
    `warm band should still penalize glare: ${warm!.score}`,
  );
  assert(
    noOpts!.score < -0.5,
    `no opts should still penalize glare: ${noOpts!.score}`,
  );
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
    (v) => v.variable_key === "light_cloud_condition",
  );
  assert(lightEntry != null, "light_cloud_condition should be scored");
  assert(
    lightEntry!.engine_score > -0.5,
    `light score should be near 0 in cool band March clear day, got ${
      lightEntry!.engine_score
    }`,
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
    (v) => v.variable_key === "light_cloud_condition",
  );
  assert(lightEntry != null);
  assert(
    lightEntry!.engine_score < -0.5,
    `warm band July clear sky should still penalize, got ${
      lightEntry!.engine_score
    }`,
  );
});

Deno.test("change2: light_mist dry baseline — score positive, label light_mist", () => {
  // Low p72 and p7d — mist is a mild positive
  const r = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0, // rate: not raining
    0.02, // p24: trace
    0.05, // p72: low
    false,
    0.1, // p7d: low
  );
  assert(r != null);
  assertEquals(r!.label, "light_mist");
  assert(
    r!.score > 0,
    `expected score > 0 for dry-baseline light_mist, got ${r!.score}`,
  );
});

Deno.test("change2: light_mist wet baseline — score negative, label light_mist", () => {
  // p72=0.32 (below recent_rain threshold of 0.35, but above first gate of 0.30)
  // p7d=1.2 (below second gate's 1.50 ceiling)
  // -> second light_mist gate: score = -0.10
  const r = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0, // rate: not actively raining
    0.08, // p24: trace (in [0.01, 0.15))
    0.32, // p72: in [0.30, 0.35) — above first gate, below recent_rain threshold
    false,
    1.2, // p7d: in [0.75, 1.50) — above first gate, below second gate ceiling
  );
  assert(r != null);
  assertEquals(r!.label, "light_mist");
  assert(
    r!.score < 0,
    `expected score < 0 for wet-baseline light_mist, got ${r!.score}`,
  );
});

Deno.test("change2: light_mist — flooded baseline falls through to recent_rain (p72 too high)", () => {
  // p72 = 0.70 exceeds recent_rain threshold (0.35) so recent_rain fires first
  const r = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0, // rate
    0.08, // p24: would qualify for light_mist if p72 were low
    0.70, // p72: exceeds recent_rain threshold (>= 0.35)
    false,
  );
  assert(r != null);
  assertEquals(
    r!.label,
    "recent_rain",
    `expected recent_rain when p72 too high, got ${r!.label}`,
  );
});

Deno.test("change2: extended_dry cap — score <= 1.35", () => {
  const r = normalizePrecipitationDisruption(
    "freshwater_lake_pond",
    0,
    0,
    0,
    false,
    0,
  );
  assert(r != null);
  assertEquals(r!.label, "extended_dry");
  assert(
    r!.score <= 0.1,
    `extended_dry should now be a small positive, got ${r!.score}`,
  );
});

Deno.test("change2: extended_dry coastal cap — score <= 1.35", () => {
  const r = normalizePrecipitationDisruption(
    "coastal",
    0,
    0,
    0,
    false,
    0,
  );
  assert(r != null);
  assertEquals(r!.label, "extended_dry");
  assert(
    r!.score <= 0.1,
    `coastal extended_dry should now be a small positive, got ${r!.score}`,
  );
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
    `SW Desert April should not use seek_warmth as primary driver, got: ${
      r.timing_debug!.primary_driver
    }`,
  );
});

Deno.test("change3: SW Desert April timing family is lake_hot_summer (avoid_heat)", () => {
  const apr = resolveTimingFamily(
    "freshwater_lake_pond",
    "southwest_desert",
    4,
  );
  assertEquals(apr.family_id, "lake_hot_summer");
  assertEquals(apr.anchor_driver, "avoid_heat");
});

Deno.test("change3: SW Desert May/June stay on hot-summer timing", () => {
  const may = resolveTimingFamily(
    "freshwater_lake_pond",
    "southwest_desert",
    5,
  );
  const jun = resolveTimingFamily(
    "freshwater_lake_pond",
    "southwest_desert",
    6,
  );
  assertEquals(may.family_id, "lake_hot_summer");
  assertEquals(jun.family_id, "lake_hot_summer");
});

Deno.test("change3: SW Desert river April — also lake_hot_summer equivalent", () => {
  const apr = resolveTimingFamily("freshwater_river", "southwest_desert", 4);
  assertEquals(apr.family_id, "river_hot_summer");
});

Deno.test("change4: coastal flats low cloud (8%) — glare penalty applied", () => {
  const r = normalizeLight(8, "coastal_flats_estuary");
  assert(r != null);
  assert(
    r!.score < -0.15,
    `flats 8% cloud should have glare penalty, got ${r!.score}`,
  );
});

Deno.test("change4: coastal flats 21% cloud — above threshold, no penalty (score = 0)", () => {
  const r = normalizeLight(21, "coastal_flats_estuary");
  assert(r != null);
  assertEquals(r!.score, 0);
});

Deno.test("change4: coastal non-flats 8% cloud — no glare penalty (score = 0)", () => {
  const nearshore = normalizeLight(8, "coastal");
  assert(nearshore != null);
  assertEquals(
    nearshore!.score,
    0,
    `nearshore coastal 8% cloud should still be 0, got ${nearshore!.score}`,
  );
});

Deno.test("change4: coastal non-flats (coastal) existing behavior unchanged at all ranges", () => {
  // Verify non-flats coastal unchanged across the 0-69% range
  assertEquals(normalizeLight(5, "coastal")!.score, 0);
  assertEquals(normalizeLight(20, "coastal")!.score, 0);
  assertEquals(normalizeLight(40, "coastal")!.score, 0);
  assertAlmostEquals(normalizeLight(69, "coastal")!.score, 0.304, 1e-3);
});

Deno.test("light V2: freshwater heavy overcast calm remains modestly helpful", () => {
  const freshwater = normalizeLight(95, "freshwater_lake_pond", {
    temperatureBandLabel: "warm",
    windMph: 2,
  });
  assert(freshwater != null);
  assertEquals(freshwater.label, "heavy_overcast");
  assertEquals(freshwater.detail, "95% cloud");
  assertAlmostEquals(freshwater.score, 0.78, 1e-3);
});

Deno.test("light V2: freshwater heavy overcast strong wind is capped", () => {
  const freshwater = normalizeLight(95, "freshwater_lake_pond", {
    temperatureBandLabel: "warm",
    windMph: 22,
  });
  assert(freshwater != null);
  assertEquals(freshwater.label, "heavy_overcast");
  assertEquals(freshwater.detail, "95% cloud");
  assertAlmostEquals(freshwater.score, 0.4667, 1e-3);
});

Deno.test("light V2: missing wind heavy overcast uses non-strong-wind cap", () => {
  const freshwater = normalizeLight(95, "freshwater_lake_pond", {
    temperatureBandLabel: "warm",
    windMph: null,
  });
  assert(freshwater != null);
  assertAlmostEquals(freshwater.score, 0.78, 1e-3);
});

Deno.test("light V2: coastal heavy overcast strong wind is capped", () => {
  const coastal = normalizeLight(95, "coastal", { windMph: 22 });
  assert(coastal != null);
  assertEquals(coastal.label, "heavy_overcast");
  assertEquals(coastal.detail, "95% cloud");
  assertAlmostEquals(coastal.score, 0.4, 1e-3);
});

Deno.test("change4: heavy overcast helps but no longer maxes the light variable by itself", () => {
  const freshwater = normalizeLight(95, "freshwater_lake_pond", {
    temperatureBandLabel: "warm",
  });
  const coastal = normalizeLight(95, "coastal");
  assert(freshwater != null && coastal != null);
  assert(
    freshwater.score < 0.9,
    `freshwater heavy overcast should stay below hard-max, got ${freshwater.score}`,
  );
  assert(
    coastal.score < 0.8,
    `coastal heavy overcast should stay below hard-max, got ${coastal.score}`,
  );
});

Deno.test("light V2: buildNormalized passes wind into heavy-overcast light scoring", () => {
  const norm = buildSharedNormalizedOutput({
    latitude: 40,
    longitude: -86,
    state_code: "IN",
    region_key: "midwest_interior",
    local_date: "2026-07-15",
    local_timezone: "America/Indiana/Indianapolis",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 74,
      prior_day_mean_air_temp_f: 74,
      day_minus_2_mean_air_temp_f: 74,
      pressure_history_mb: Array.from({ length: 24 }, () => 1014),
      wind_speed_mph: 22,
      cloud_cover_pct: 95,
      precip_24h_in: 0.02,
      precip_72h_in: 0.05,
      precip_7d_in: 0.1,
    },
    data_coverage: {},
  });
  assertAlmostEquals(
    norm.normalized.light_cloud_condition!.score,
    0.4667,
    1e-3,
  );
});

Deno.test("runoff: ultra-clear proxy is positive but no longer treated as a perfect +2 daymaker", () => {
  const ne = normalizeRunoff("northeast", 0, 0, 0);
  const fl = normalizeRunoff("florida", 0, 0, 0);
  assert(ne != null && fl != null);
  assertEquals(ne.label, "perfect_clear");
  assertEquals(fl.label, "perfect_clear");
  assert(
    ne.score > 0 && ne.score <= 0.55,
    `northeast perfect_clear should be positive but modest, got ${ne.score}`,
  );
  assert(
    fl.score > 0 && fl.score <= 0.55,
    `florida perfect_clear should be positive but modest, got ${fl.score}`,
  );
});

// ── Fix 1: very_cold day seek_warmth — cloud_extended must not add dawn periods ─

Deno.test("fix1: timing: very_cold day seek_warmth — cloud_extended must not add dawn periods on 22°F day", () => {
  const r = runHowFishingReport({
    latitude: 43.9,
    longitude: -85.1,
    state_code: "MI",
    region_key: "great_lakes_upper_midwest",
    local_date: "2026-03-15",
    local_timezone: "America/Detroit",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 27,
      daily_low_air_temp_f: 22,
      daily_high_air_temp_f: 33,
      prior_day_mean_air_temp_f: 25,
      day_minus_2_mean_air_temp_f: 24,
      pressure_history_mb: Array.from({ length: 24 }, () => 1013),
      wind_speed_mph: 5,
      cloud_cover_pct: 88, // heavy overcast — cloud_extended will try to fire
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0,
    },
    data_coverage: {},
  });
  // On a 22-33°F day, dawn (5-7AM = coldest point) must NOT be highlighted
  // seek_warmth should dominate, pointing to midday/afternoon
  const periods = r.highlighted_periods ?? [false, false, false, false];
  // Dawn (index 0) should be false — seek_warmth never recommends coldest moment
  assertEquals(periods[0], false, "Dawn must not be highlighted on a 22°F day");
  // At least afternoon or morning should be recommended (warmest window)
  const hasWarmPeriod = periods[2] === true || periods[1] === true;
  assertEquals(
    hasWarmPeriod,
    true,
    "Midday or morning should be the recommended window on a cold day",
  );
});

// ── Fix 4: shared size anchor — overcast day, lake/pond and river run without crash ─

Deno.test("fix4: tip consistency — overcast lake/pond day runs without crash and score is non-zero", () => {
  const r = runHowFishingReport({
    latitude: 43.9,
    longitude: -85.1,
    state_code: "MI",
    region_key: "great_lakes_upper_midwest",
    local_date: "2026-03-15",
    local_timezone: "America/Detroit",
    context: "freshwater_lake_pond",
    environment: {
      daily_mean_air_temp_f: 52,
      prior_day_mean_air_temp_f: 50,
      day_minus_2_mean_air_temp_f: 48,
      pressure_history_mb: Array.from({ length: 24 }, () => 1013),
      wind_speed_mph: 6,
      cloud_cover_pct: 90, // heavy overcast — size anchor should bump offering_size_profile
      precip_24h_in: 0,
      precip_72h_in: 0,
      precip_7d_in: 0,
    },
    data_coverage: {},
  });
  assert(
    r.score > 0,
    `lake/pond overcast report score should be > 0, got ${r.score}`,
  );
  assert(r.actionable_tip.length > 0, "actionable_tip must not be empty");
});

Deno.test("fix4: tip consistency — overcast river day runs without crash and score is non-zero", () => {
  const r = runHowFishingReport({
    latitude: 43.9,
    longitude: -85.1,
    state_code: "MI",
    region_key: "great_lakes_upper_midwest",
    local_date: "2026-03-15",
    local_timezone: "America/Detroit",
    context: "freshwater_river",
    environment: {
      daily_mean_air_temp_f: 52,
      prior_day_mean_air_temp_f: 50,
      day_minus_2_mean_air_temp_f: 48,
      pressure_history_mb: Array.from({ length: 24 }, () => 1013),
      wind_speed_mph: 6,
      cloud_cover_pct: 90, // heavy overcast — size anchor should bump offering_size_profile
      precip_24h_in: 0.05,
      precip_72h_in: 0.1,
      precip_7d_in: 0.2,
    },
    data_coverage: {},
  });
  assert(
    r.score > 0,
    `river overcast report score should be > 0, got ${r.score}`,
  );
  assert(r.actionable_tip.length > 0, "actionable_tip must not be empty");
});
