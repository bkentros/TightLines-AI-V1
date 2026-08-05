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
  assertEquals(resolveRunStage(pmRun, "2026-06-30").stage, "post_run");
  assertEquals(resolveRunStage(pmRun, "2026-07-01").stage, "pre_run");
  assertEquals(resolveRunStage(pmRun, "2026-07-27").stagingContext, false);
  assertEquals(resolveRunStage(pmRun, "2026-07-28").stagingContext, true);
  assertEquals(resolveRunStage(pmRun, "2026-08-10").stage, "pre_run");
  assertEquals(resolveRunStage(pmRun, "2026-08-22").stage, "beginning");
  assertEquals(resolveRunStage(pmRun, "2026-08-25").stage, "building");
  assertEquals(resolveRunStage(pmRun, "2026-09-10").stage, "building");
  assertEquals(resolveRunStage(pmRun, "2026-09-20").stage, "peak");
  assertEquals(resolveRunStage(pmRun, "2026-09-30").stage, "peak");
  assertEquals(resolveRunStage(pmRun, "2026-10-01").stage, "tapering");
  assertEquals(resolveRunStage(pmRun, "2026-10-18").stage, "tapering");
  assertEquals(resolveRunStage(pmRun, "2026-10-19").stage, "ending");
  assertEquals(resolveRunStage(pmRun, "2026-10-27").stage, "ending");
  assertEquals(resolveRunStage(pmRun, "2026-10-28").stage, "post_run");
  assertEquals(resolveRunStage(pmRun, "2026-11-05").stage, "post_run");
});

Deno.test("Run Stage uses distinct early and established Building guidance", () => {
  const early = resolveRunStage(pmRun, "2026-08-31");
  const established = resolveRunStage(pmRun, "2026-09-01");

  assertEquals(early.stage, "building");
  assertEquals(established.stage, "building");
  assert(early.detail.includes("beginning to spread upstream"));
  assert(established.detail.includes("travel well upstream"));
  assert(established.tip.includes("middle-river holding water"));
  assert(established.tip.includes("work upstream"));
});

Deno.test("staging guidance allows rare early river fish without claiming a run", () => {
  const staging = resolveRunStage(pmRun, "2026-08-01");

  assertEquals(staging.stage, "pre_run");
  assertEquals(staging.stagingContext, true);
  assert(staging.headline.includes("a few early fish could be in the river"));
  assert(
    staging.detail.includes("dependable river numbers have not developed"),
  );
});

Deno.test("After-migration copy separates the late tail from the offseason", () => {
  const lateTail = resolveRunStage(pmRun, "2026-10-28");
  const lastLateCopyDay = resolveRunStage(pmRun, "2026-11-10");
  const offseason = resolveRunStage(pmRun, "2026-11-11");

  assertEquals(lateTail.stage, "post_run");
  assertEquals(lastLateCopyDay.stage, "post_run");
  assertEquals(offseason.stage, "post_run");
  assertEquals(lateTail.label, "After migration");
  assertEquals(lastLateCopyDay.label, "After migration");
  assertEquals(offseason.label, "Offseason");
  assert(lateTail.detail.includes("A few fish may remain"));
  assert(lastLateCopyDay.detail.includes("A few fish may remain"));
  assert(offseason.headline.includes("outside their river migration season"));
  assertEquals(offseason.detail.includes("A few fish may remain"), false);
});

Deno.test("cross-year run window selects active year around snapshot date", () => {
  const winterRun = runWith({
    runWindow: {
      preRunStart: "11-15",
      stagingStart: "12-01",
      start: "12-15",
      beginningEnd: "12-20",
      buildingEstablishedStart: "12-27",
      peakStart: "01-05",
      peak: "01-10",
      peakEnd: "01-15",
      taperingEnd: "02-05",
      end: "02-15",
      lateEnd: "03-01",
      postRunLateCopyEnd: "03-10",
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
  assertEquals(beginning.score, 10);
  assertEquals(peakSignature.score, 100);
  assertEquals(peakSignature.maximum, 100);
  assertEquals(peakSignature.riverCeiling, 100);
  assertEquals(cappedPeak.score, 60);
  assertEquals(cappedPeak.maximum, 100);
  assertEquals(cappedPeak.riverCeiling, 60);
  assertEquals(postRun.score, 0);
});

Deno.test("PM Fish In River keeps a post-peak shoulder and later October tail", () => {
  const upperBuilding = scoreFishInRiver(pmRun, "2026-09-14");
  const entersPeakPresence = scoreFishInRiver(pmRun, "2026-09-17");
  const justBeyondPeak = scoreFishInRiver(pmRun, "2026-09-24");
  const aboveSecondFallingThreshold = scoreFishInRiver(
    pmRun,
    "2026-10-01",
  );
  const belowSecondFallingThreshold = scoreFishInRiver(
    pmRun,
    "2026-10-02",
  );
  const october8 = scoreFishInRiver(pmRun, "2026-10-08");
  const october15 = scoreFishInRiver(pmRun, "2026-10-15");
  const october23 = scoreFishInRiver(pmRun, "2026-10-23");
  const november3 = scoreFishInRiver(pmRun, "2026-11-03");
  const november7 = scoreFishInRiver(pmRun, "2026-11-07");
  const november8 = scoreFishInRiver(pmRun, "2026-11-08");

  assertEquals(upperBuilding.score, 81);
  assertEquals(upperBuilding.label, "High presence");
  assertEquals(upperBuilding.curveDirection, "rising");
  assertEquals(entersPeakPresence.score, 91);
  assertEquals(entersPeakPresence.label, "Peak presence");
  assertEquals(entersPeakPresence.curveDirection, "rising");
  assertEquals(justBeyondPeak.score, 98);
  assertEquals(justBeyondPeak.curveDirection, "falling");
  assert(
    justBeyondPeak.headline.includes("may be just beyond its usual peak"),
  );
  assertEquals(
    /begun to decline|has just passed/i.test(
      `${justBeyondPeak.headline} ${justBeyondPeak.detail}`,
    ),
    false,
  );
  assertEquals(aboveSecondFallingThreshold.score, 92);
  assertEquals(aboveSecondFallingThreshold.label, "Peak presence");
  assert(
    aboveSecondFallingThreshold.headline.includes(
      "near their strongest in-river presence",
    ),
  );
  assertEquals(belowSecondFallingThreshold.score, 89);
  assertEquals(belowSecondFallingThreshold.label, "High presence");
  assert(
    belowSecondFallingThreshold.headline.includes(
      "strong Chinook salmon presence across much of the river",
    ),
  );
  assert(
    belowSecondFallingThreshold.headline.includes(
      "usual peak window may be easing",
    ),
  );
  assert(belowSecondFallingThreshold.tip.startsWith("Plan around fish"));
  assertEquals(october8.score, 73);
  assertEquals(october15.score, 53);
  assertEquals(october23.score, 31);
  assertEquals(october23.label, "Limited presence");
  assert(october23.tip.startsWith("Treat this as a lower-odds"));
  assertEquals(november3.score, 9);
  assertEquals(november7.score, 2);
  assertEquals(november8.score, 0);
  assertEquals(
    pmRun.historicalPresence.curveVersion,
    "pm-fall-chinook-presence-v2",
  );

  const cappedRun = runWith({
    historicalPresence: {
      ...pmRun.historicalPresence,
      maximum: 6,
    },
  });
  const cappedBelowThreshold = scoreFishInRiver(cappedRun, "2026-10-02");
  assertEquals(cappedBelowThreshold.score, 54);
  assertEquals(cappedBelowThreshold.riverCeiling, 60);
  assertEquals(cappedBelowThreshold.label, "High presence");
  assert(
    cappedBelowThreshold.headline.includes(
      "usual peak window may be easing",
    ),
  );
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

Deno.test("Push copy does not expose internal source or suitability labels", () => {
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

  assert(result.detail.includes("river has made a clear rise"));
  assertEquals(result.detail.includes("Future River Gauge"), false);
  assertEquals(result.detail.includes("adult fall Coho migration"), false);
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
  assert(result.detail.includes("farther upstream"));
  assert(result.detail.includes("not treated as proof"));
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

Deno.test("measured gauge response also neutralizes a dry-rain penalty", () => {
  const result = pushWith({
    rainSignal: "dry",
    flowSignal: "meaningful_rise",
    currentHydraulicValue: 700,
    hydraulicAbsoluteChange24h: 50,
    hydraulicPercentChange24h: 8,
  });

  assertEquals(result.components?.rainModifier, 0);
  assertEquals(result.components?.rainRole, "absorbed_by_gauge");
  assertEquals(result.score, 70);
  assertEquals(result.label, "Strong");
  assert(result.reasonCodes.includes("push_rain_absorbed_by_gauge"));
  assert(result.detail.includes("rainfall adds no separate weight"));
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
  assert(result.tip.includes("Do not build the day around new arrivals"));
  assert(result.tip.includes("established holding water"));
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
  assert(result.tip.includes("do not chase recent rain as proof"));
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

Deno.test("Push temperature boundaries distinguish favorable from warm-side water", () => {
  const cases = [
    { waterTempF: 50.9, state: "cool_plateau" },
    { waterTempF: 51, state: "supportive" },
    { waterTempF: 63, state: "supportive" },
    { waterTempF: 63.1, state: "transitional_warm" },
    { waterTempF: 68, state: "transitional_warm" },
    { waterTempF: 68.1, state: "too_warm" },
    { waterTempF: 70, state: "migration_barrier" },
  ] as const;

  for (const testCase of cases) {
    const result = pushWith({ waterTempF: testCase.waterTempF });
    assertEquals(
      result.components?.temperatureState,
      testCase.state,
      `${testCase.waterTempF}F`,
    );
  }

  const favorableCooling = pushWith({
    waterTempF: 62,
    temperatureSignal: "strong_cooling",
  });
  const warmSideCooling = pushWith({
    waterTempF: 64,
    temperatureSignal: "strong_cooling",
  });
  const warmSideSteady = pushWith({
    waterTempF: 64,
    temperatureSignal: "neutral",
  });

  assertEquals(favorableCooling.components?.temperatureModifier, 10);
  assertEquals(warmSideCooling.components?.temperatureModifier, 8);
  assertEquals(warmSideSteady.components?.temperatureModifier, -3);
  assert(warmSideSteady.detail.includes("on the warm side"));
  assertEquals(warmSideSteady.detail.includes("ideal"), false);
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

Deno.test("Push tracking uses useful seasonal copy without exposing dates", () => {
  const offseason = pushWith({ trackingState: "offseason" });
  const before = pushWith({ trackingState: "not_started" });
  const after = pushWith({ trackingState: "complete" });

  assertEquals(offseason.score, null);
  assertEquals(offseason.label, "Offseason");
  assert(offseason.reasonCodes.includes("push_tracking_offseason"));
  assertEquals(before.score, null);
  assertEquals(before.label, "Waiting for migration");
  assert(before.headline.includes("have not started entering the river"));
  assertEquals(before.headline.includes("August 15, 2026"), false);
  assert(before.reasonCodes.includes("push_tracking_not_started"));
  assertEquals(after.score, null);
  assertEquals(after.label, "Migration complete");
  assert(after.detail.includes("no longer provide a dependable read"));
  assertEquals(after.detail.includes("October 20, 2026"), false);
  assert(after.reasonCodes.includes("push_tracking_complete"));
});

Deno.test("ideal stable fishability is Excellent", () => {
  const result = fishabilityWith();

  assertEquals(result.score, 93);
  assertEquals(result.label, "Excellent");
  assertEquals(result.rulesVersion, "pm-scottville-fishability-v2");
  assert(result.headline.includes("excellent range"));
  assert(result.tip.includes("primary travel lane"));
  assert(result.tip.includes("head through the inside seam and tail"));
  assertEquals(
    /Scottville|600 cfs|same time yesterday/i.test(result.detail),
    false,
  );
});

Deno.test("stable 480 cfs Scottville flow is Fishable, not Good", () => {
  const result = fishabilityWith({
    flowBand: "low",
    flowSignal: "stable",
    currentHydraulicValue: 480,
  });

  assertEquals(result.score, 60);
  assertEquals(result.label, "Fishable");
  assertEquals(result.rulesVersion, "pm-scottville-fishability-v2");
});

Deno.test("Fishability copy remains river-neutral and hides source identity", () => {
  const result = fishabilityWith({
    rules: {
      ...pmRun.fishabilityBands,
      sourceLabel: "Future River Main Gauge",
    },
  });
  const copy = `${result.headline} ${result.detail} ${result.tip}`;

  assertEquals(copy.includes("Future River Main Gauge"), false);
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
  assert(result.tip.includes("Choose a lower-water day"));
  assert(result.tip.includes("If you fish now"));
  assert(result.tip.includes("protected banks"));
  assertEquals(/postpone/i.test(result.tip), false);
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
