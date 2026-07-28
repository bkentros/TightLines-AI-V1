import { assert, assertEquals } from "jsr:@std/assert";
import {
  type FishabilityScoreInput,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  type PushScoreInput,
  resolveActiveRunWindow,
  resolveFlowTrendSignal,
  resolveRainSignal,
  resolveRunStage,
  resolveTemperatureTrendSignal,
  type RiverRunProfile,
  scoreFishability,
  scoreFishInRiver,
  scorePush,
} from "../index.ts";

const pmRun = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;

function runWith(overrides: Partial<RiverRunProfile>): RiverRunProfile {
  return {
    ...pmRun,
    ...overrides,
    runWindow: {
      ...pmRun.runWindow,
      ...overrides.runWindow,
    },
  };
}

function pushWith(
  overrides: Partial<PushScoreInput> = {},
): ReturnType<typeof scorePush> {
  return scorePush({
    movementEngineId: "fall_cooling",
    rules: pmRun.push,
    gaugeFreshness: "fresh",
    flowSignal: "stable",
    currentHydraulicValue: 550,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    rainSignal: "light_rain",
    temperatureSignal: "neutral",
    temperatureSourceType: "same_gauge",
    waterTempF: 60,
    trackingState: "active",
    trackingStartDate: "2026-08-15",
    trackingEndDate: "2026-10-20",
    ...overrides,
  });
}

function fishabilityWith(
  overrides: Partial<FishabilityScoreInput> = {},
): ReturnType<typeof scoreFishability> {
  return scoreFishability({
    rules: pmRun.fishabilityBands,
    gaugeFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    currentHydraulicValue: 600,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    ...overrides,
  });
}

Deno.test("Run Stage scenarios cover pre-run through post-run", () => {
  assertEquals(resolveRunStage(pmRun, "2026-08-10").stage, "pre_run");
  assertEquals(resolveRunStage(pmRun, "2026-08-22").stage, "beginning");
  assertEquals(resolveRunStage(pmRun, "2026-08-25").stage, "building");
  assertEquals(resolveRunStage(pmRun, "2026-09-10").stage, "building");
  assertEquals(resolveRunStage(pmRun, "2026-09-20").stage, "peak");
  assertEquals(resolveRunStage(pmRun, "2026-10-01").stage, "tapering");
  assertEquals(resolveRunStage(pmRun, "2026-10-15").stage, "ending");
  assertEquals(resolveRunStage(pmRun, "2026-11-05").stage, "post_run");
});

Deno.test("cross-year run window selects active year around snapshot date", () => {
  const winterRun = runWith({
    runWindow: {
      stagingStart: "12-01",
      start: "12-15",
      peak: "01-10",
      end: "02-15",
      lateEnd: "03-01",
      peakWindowDays: 5,
    },
  });

  const window = resolveActiveRunWindow(winterRun, "2027-01-05");

  assertEquals(window.startDate, "2026-12-15");
  assertEquals(window.peakDate, "2027-01-10");
  assertEquals(window.endDate, "2027-02-15");
});

Deno.test("Fish In River stays zero before the river start and follows the river-specific cap", () => {
  const staging = scoreFishInRiver(pmRun, "2026-08-10");
  const beginning = scoreFishInRiver(pmRun, "2026-08-15");
  const peakSignature = scoreFishInRiver(pmRun, "2026-09-20");
  const cappedPeak = scoreFishInRiver(
    runWith({
      historicalPresence: {
        ...pmRun.historicalPresence,
        maximum: 6,
      },
    }),
    "2026-09-20",
  );
  const postRun = scoreFishInRiver(pmRun, "2026-11-10");

  assertEquals(staging.score, 0);
  assertEquals(beginning.score, 1);
  assertEquals(peakSignature.score, 10);
  assertEquals(peakSignature.maximum, 10);
  assertEquals(cappedPeak.score, 6);
  assertEquals(cappedPeak.maximum, 6);
  assertEquals(postRun.score, 0);
});

Deno.test("rain missing and dry remain distinct inputs", () => {
  const missingRain = resolveRainSignal({
    rain48hIn: null,
    rain72hIn: null,
  });
  const dryRain = resolveRainSignal({ rain48hIn: 0.02, rain72hIn: 0.04 });
  assertEquals(missingRain.rawSignal, "missing_rain_data");
  assertEquals(dryRain.rawSignal, "dry");
});

Deno.test("PM flow events require both absolute and relative rise thresholds", () => {
  const percentageOnly = resolveFlowTrendSignal({
    currentValue: 105,
    value24hAgo: 90,
    rising24hAbsolute: pmRun.push.hydraulic.rising24h.absolute,
    rising24hPercent: pmRun.push.hydraulic.rising24h.percent,
    meaningfulRise24hAbsolute: pmRun.push.hydraulic.meaningfulRise24h.absolute,
    meaningfulRise24hPercent: pmRun.push.hydraulic.meaningfulRise24h.percent,
    sharpRise24hAbsolute: pmRun.push.hydraulic.sharpRise24h.absolute,
    sharpRise24hPercent: pmRun.push.hydraulic.sharpRise24h.percent,
  });
  const meaningful = resolveFlowTrendSignal({
    currentValue: 695,
    value24hAgo: 640,
    rising24hAbsolute: pmRun.push.hydraulic.rising24h.absolute,
    rising24hPercent: pmRun.push.hydraulic.rising24h.percent,
    meaningfulRise24hAbsolute: pmRun.push.hydraulic.meaningfulRise24h.absolute,
    meaningfulRise24hPercent: pmRun.push.hydraulic.meaningfulRise24h.percent,
    sharpRise24hAbsolute: pmRun.push.hydraulic.sharpRise24h.absolute,
    sharpRise24hPercent: pmRun.push.hydraulic.sharpRise24h.percent,
  });

  assertEquals(percentageOnly.rawSignal, "rising");
  assertEquals(meaningful.rawSignal, "meaningful_rise");
  assertEquals(meaningful.absoluteChange24h, 55);
});

Deno.test("sharp Scottville response plus supportive cooling produces Very strong Push", () => {
  const result = pushWith({
    rainSignal: "heavy_rain",
    flowSignal: "sharp_rise",
    currentHydraulicValue: 700,
    hydraulicAbsoluteChange24h: 90,
    hydraulicPercentChange24h: 14,
    temperatureSignal: "strong_cooling",
  });

  assertEquals(result.score, 90);
  assertEquals(result.label, "Very strong");
  assertEquals(result.components?.hydraulicBase, 80);
  assertEquals(result.components?.temperatureModifier, 10);
});

Deno.test("Push copy uses configured gauge and suitability labels", () => {
  const result = pushWith({
    rules: {
      ...pmRun.push,
      hydraulic: {
        ...pmRun.push.hydraulic,
        sourceLabel: "Future River Gauge",
      },
      temperature: {
        ...pmRun.push.temperature,
        suitabilityLabel: "adult fall Coho migration",
      },
    },
    flowSignal: "meaningful_rise",
    hydraulicAbsoluteChange24h: 50,
    hydraulicPercentChange24h: 8,
  });

  assert(result.detail.includes("Future River Gauge"));
  assert(result.detail.includes("adult fall Coho migration"));
  assertEquals(/Scottville|Chinook/.test(result.detail), false);
});

Deno.test("upstream temperature fallback cannot create positive cooling credit", () => {
  const result = pushWith({
    flowSignal: "sharp_rise",
    hydraulicAbsoluteChange24h: 90,
    hydraulicPercentChange24h: 14,
    temperatureSignal: "strong_cooling",
    temperaturePositiveSignalCap:
      pmRun.waterTemperature.upstreamFallbackPositiveSignalCap,
  });

  assertEquals(result.components?.temperatureModifier, 0);
  assertEquals(result.score, 80);
  assertEquals(result.label, "Strong");
  assert(result.detail.includes("upstream fallback"));
  assert(result.detail.includes("adds no positive credit"));
});

Deno.test("fall cooling does not award Strong before a measured gauge response", () => {
  const result = pushWith({
    rainSignal: "heavy_rain",
    flowSignal: "stable",
    temperatureSignal: "strong_cooling",
  });
  assert(typeof result.score === "number" && result.score <= 69);
  assertEquals(result.label, "Possible");
});

Deno.test("measured gauge response absorbs rain credit", () => {
  const result = pushWith({
    rainSignal: "heavy_rain",
    flowSignal: "meaningful_rise",
    currentHydraulicValue: 700,
    hydraulicAbsoluteChange24h: 50,
    hydraulicPercentChange24h: 8,
  });
  assertEquals(result.components?.rainModifier, 0);
  assertEquals(result.components?.rainRole, "absorbed_by_gauge");
  assert(result.reasonCodes.includes("push_rain_absorbed_by_gauge"));
});

Deno.test("severe-high fall river caps Push below Strong despite rain and cooling", () => {
  const result = pushWith({
    rainSignal: "heavy_rain",
    flowSignal: "sharp_rise",
    currentHydraulicValue: 1200,
    hydraulicAbsoluteChange24h: 150,
    hydraulicPercentChange24h: 15,
    temperatureSignal: "strong_cooling",
  });
  assert(typeof result.score === "number" && result.score <= 49);
  assertEquals(result.label, "No clear push");
  assert(result.reasonCodes.includes("push_severe_high_flow_cap"));
});

Deno.test("missing measured water temperature makes Push unavailable", () => {
  const missing = pushWith({
    rainSignal: "missing_rain_data",
    flowSignal: "meaningful_rise",
    temperatureSignal: "neutral_missing",
    temperatureSourceType: "unavailable",
    waterTempF: null,
  });
  assertEquals(missing.score, null);
  assertEquals(missing.label, "Unavailable");
  assert(missing.reasonCodes.includes("temperature_unavailable"));
});

Deno.test("fall cooling warm dry falling produces Weak Push", () => {
  const result = pushWith({
    rainSignal: "dry",
    flowSignal: "falling",
    temperatureSignal: "strong_warming",
    waterTempF: 69,
  });

  assertEquals(result.score, 0);
  assertEquals(result.label, "Weak");
  assert(result.tip.includes("can enter from the lake at any point"));
  assert(result.tip.includes("more commonly associated with cooling"));
  assert(result.tip.includes("cannot confirm or rule out movement"));
});

Deno.test("stale gauge caps Push at 55", () => {
  const result = pushWith({
    gaugeFreshness: "stale",
    rainSignal: "heavy_rain",
    flowSignal: "sharp_rise",
    temperatureSignal: "strong_cooling",
  });

  assertEquals(result.score, 55);
  assert(result.reasonCodes.includes("gauge_stale"));
});

Deno.test("missing gauge makes Push unavailable", () => {
  const result = pushWith({
    gaugeFreshness: "missing",
    rainSignal: "heavy_rain",
    flowSignal: "meaningful_rise",
    temperatureSignal: "strong_cooling",
  });

  assertEquals(result.score, null);
  assertEquals(result.label, "Unavailable");
  assert(result.reasonCodes.includes("gauge_missing"));
  assert(result.tip.includes("cannot confirm or rule out movement"));
});

Deno.test("warm migration barrier caps Push below Possible", () => {
  const result = pushWith({
    flowSignal: "sharp_rise",
    currentHydraulicValue: 700,
    waterTempF: 70,
    temperatureSignal: "strong_cooling",
  });
  assertEquals(result.score, 49);
  assertEquals(result.label, "No clear push");
  assert(result.reasonCodes.includes("push_temperature_barrier_cap"));
});

Deno.test("cool-water plateau prevents continued cooling credit", () => {
  const result = pushWith({
    flowSignal: "meaningful_rise",
    currentHydraulicValue: 700,
    waterTempF: 48,
    temperatureSignal: "strong_cooling",
  });
  assertEquals(result.components?.temperatureModifier, 0);
  assert(result.reasonCodes.includes("push_temperature_cool_plateau"));
});

Deno.test("unknown flow trend fails conservatively", () => {
  const unknown = pushWith({
    flowSignal: "unknown",
    hydraulicAbsoluteChange24h: null,
    hydraulicPercentChange24h: null,
    rainSignal: "heavy_rain",
    temperatureSignal: "strong_cooling",
  });
  assertEquals(unknown.score, 49);
  assert(unknown.reasonCodes.includes("push_unknown_trend_cap"));
});

Deno.test("Push tracking follows the configured run start and end", () => {
  const before = pushWith({ trackingState: "not_started" });
  const after = pushWith({ trackingState: "complete" });

  assertEquals(before.score, null);
  assertEquals(before.label, "Tracking not started");
  assert(before.headline.includes("August 15, 2026"));
  assert(before.reasonCodes.includes("push_tracking_not_started"));
  assertEquals(after.score, null);
  assertEquals(after.label, "Tracking complete");
  assert(after.detail.includes("October 20, 2026"));
  assert(after.reasonCodes.includes("push_tracking_complete"));
});

Deno.test("ideal stable fishability is Excellent", () => {
  const result = fishabilityWith();

  assertEquals(result.score, 93);
  assertEquals(result.label, "Excellent");
  assertEquals(result.rulesVersion, "pm-scottville-fishability-v1");
  assert(result.detail.includes("Scottville is 600 cfs"));
  assert(result.detail.includes("matched 24-hour comparison"));
});

Deno.test("Fishability shared scoring copy uses the configured source identity", () => {
  const result = fishabilityWith({
    rules: {
      ...pmRun.fishabilityBands,
      sourceLabel: "Future River Main Gauge",
    },
  });
  const copy = `${result.headline} ${result.detail} ${result.tip}`;

  assert(copy.includes("Future River Main Gauge"));
  assertEquals(copy.includes("Scottville"), false);
  assertEquals(copy.includes("Pere Marquette"), false);
  assertEquals(copy.includes("Chinook"), false);
});

Deno.test("blown out fishability cap applies", () => {
  const result = fishabilityWith({
    flowBand: "blown_out",
    flowSignal: "sharp_rise",
    currentHydraulicValue: 1_700,
    hydraulicAbsoluteChange24h: 300,
    hydraulicPercentChange24h: 21.4,
  });

  assertEquals(result.score, 0);
  assertEquals(result.label, "Poor");
  assert(result.reasonCodes.includes("fishability_blown_out_cap"));
  assert(result.reasonCodes.includes("fishability_sharp_rise_high_cap"));
});

Deno.test("very low fishability cap applies", () => {
  const result = fishabilityWith({
    flowBand: "very_low",
    flowSignal: "stable",
    currentHydraulicValue: 350,
  });

  assertEquals(result.score, 40);
  assertEquals(result.label, "Tough");
  assert(result.reasonCodes.includes("fishability_very_low_cap"));
});

Deno.test("sharp rise into high water is conservatively capped", () => {
  const result = fishabilityWith({
    flowBand: "high_fishable",
    flowSignal: "sharp_rise",
    currentHydraulicValue: 900,
    hydraulicAbsoluteChange24h: 120,
    hydraulicPercentChange24h: 15.4,
  });

  assertEquals(result.score, 40);
  assertEquals(result.label, "Tough");
  assert(result.reasonCodes.includes("fishability_sharp_rise_high_cap"));
});

Deno.test("stale gauge and unknown trend cap Fishability", () => {
  const stale = fishabilityWith({ gaugeFreshness: "stale" });
  const unknown = fishabilityWith({
    flowSignal: "unknown",
    hydraulicAbsoluteChange24h: null,
    hydraulicPercentChange24h: null,
  });

  assertEquals(stale.score, 55);
  assert(stale.reasonCodes.includes("fishability_stale_gauge_cap"));
  assertEquals(unknown.score, 69);
  assert(unknown.reasonCodes.includes("fishability_unknown_trend_cap"));
});

Deno.test("missing gauge makes Fishability unavailable", () => {
  const result = fishabilityWith({
    gaugeFreshness: "missing",
    currentHydraulicValue: null,
  });

  assertEquals(result.score, null);
  assertEquals(result.label, "Unavailable");
  assert(result.reasonCodes.includes("gauge_missing"));
});

Deno.test("neutral observed temperature is not marked temperature_neutral_missing", () => {
  const result = resolveTemperatureTrendSignal({
    sourceType: "same_gauge",
    delta72hF: 0.5,
    delta24hF: 0.2,
    hasEnoughValues: true,
  });

  assertEquals(result.rawSignal, "neutral");
  assert(result.reasonCodes.includes("temperature_measured"));
  assertEquals(
    result.reasonCodes.includes("temperature_neutral_missing"),
    false,
  );
});
