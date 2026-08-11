import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  listVisibleRiverRuns,
  MUSKEGON_CONFIGURATION_DOCUMENT,
  MUSKEGON_FALL_CHINOOK_RUN_PROFILE as chinook,
  MUSKEGON_FALL_COHO_RUN_PROFILE as coho,
  MUSKEGON_FALL_STEELHEAD_RUN_PROFILE as steelhead,
  MUSKEGON_RIVER_PROFILE as river,
  resolveFlowBand,
  resolveRunStage,
  scoreActivity,
  scoreFishInRiver,
  scorePush,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";

Deno.test("Muskegon configuration is valid and all three researched runs are visible", () => {
  assertEquals(
    validateConfigurationRevision({
      configKey: "muskegon",
      revision: 1,
      status: "draft",
      document: MUSKEGON_CONFIGURATION_DOCUMENT,
      evidenceNotes: "Muskegon research and owner-audit build.",
    }),
    [],
  );
  for (const run of [chinook, coho, steelhead]) {
    assertEquals(validateRunProfile(run, river).publicVisible, true);
  }
  assertEquals(
    listVisibleRiverRuns([river], [chinook, coho, steelhead])[0].rivers[0].runs
      .length,
    3,
  );
  assertEquals([
    chinook.historicalPresence.maximum,
    coho.historicalPresence.maximum,
    steelhead.historicalPresence.maximum,
  ], [9, 3, 9]);
});

Deno.test("Croton is a hard boundary and copy never leaks another river geography", () => {
  for (const run of [chinook, coho, steelhead]) {
    for (
      const date of [
        "2026-08-10",
        "2026-09-15",
        "2026-10-01",
        "2026-11-15",
        "2026-12-23",
      ]
    ) {
      const copy = JSON.stringify(resolveRunStage(run, date));
      assertEquals(
        /Tippy|Wellston|High Bridge|Bear Creek|M-55|Scottville|Walhalla|Pere Marquette|Homestead/i
          .test(copy),
        false,
        `${run.runId} ${date}`,
      );
      assertEquals(/above Croton/i.test(copy), false, `${run.runId} ${date}`);
    }
  }
  assertMatch(river.foundation!.upstreamTerminus, /hard upstream barrier/i);
  assertMatch(
    resolveRunStage(chinook, "2026-08-10").whereToStart ?? "",
    /Muskegon Lake/i,
  );
  assertMatch(
    resolveRunStage(chinook, "2026-09-15").whereToStart ?? "",
    /Upper river \(Newaygo–Croton Dam\).*Croton Dam area/i,
  );
});

Deno.test("Muskegon Fish In River interpolates daily, hits exact peaks, and closes fall entry", () => {
  assert(
    scoreFishInRiver(chinook, "2026-09-10").score !==
      scoreFishInRiver(chinook, "2026-09-11").score,
  );
  assertEquals(scoreFishInRiver(chinook, "2026-10-01").score, 90);
  assertEquals(scoreFishInRiver(coho, "2026-10-25").score, 30);
  assertEquals(scoreFishInRiver(steelhead, "2026-11-15").score, 90);
  assertEquals(scoreFishInRiver(steelhead, "2026-12-22").score, 80);
  assertEquals(scoreFishInRiver(steelhead, "2026-12-23").score, null);
  assertEquals(
    resolveRunStage(steelhead, "2026-12-23").label,
    "Fall entry complete",
  );
});

Deno.test("Muskegon flow bands honor every Croton boundary", () => {
  const expected: Array<[number, string]> = [
    [899, "very_low"],
    [900, "low"],
    [1199, "low"],
    [1200, "ideal"],
    [2000, "ideal"],
    [2001, "high_fishable"],
    [3000, "high_fishable"],
    [3001, "very_high"],
    [4999, "very_high"],
    [5000, "blown_out"],
  ];
  for (const [value, band] of expected) {
    assertEquals(
      resolveFlowBand({
        metric: "flow_cfs",
        value,
        fishabilityBands: chinook.fishabilityBands,
      })?.band,
      band,
      String(value),
    );
  }
});

Deno.test("Muskegon Push requires gauge response, fails closed, and keeps Steelhead cold holding", () => {
  const base = {
    movementEngineId: chinook.movementEngineId,
    rules: chinook.push,
    gaugeFreshness: "fresh" as const,
    currentHydraulicValue: 1500,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    rainSignal: "heavy_rain" as const,
    temperatureSignal: "cooling" as const,
    temperatureSourceType: "same_gauge" as const,
    waterTempF: 55,
    trackingState: "active" as const,
    trackingStartDate: "2026-08-20",
    trackingEndDate: "2026-11-05",
    localDate: "2026-09-20",
  };
  const rainOnly = scorePush({ ...base, flowSignal: "stable" });
  assert(!["Strong", "Very strong"].includes(rainOnly.label));
  assertEquals(
    scorePush({ ...base, flowSignal: "unknown", gaugeFreshness: "missing" })
      .label,
    "Unavailable",
  );
  assertEquals(
    scorePush({ ...base, flowSignal: "meaningful_rise", waterTempF: null })
      .label,
    "Unavailable",
  );
  const cold = scorePush({
    ...base,
    movementEngineId: steelhead.movementEngineId,
    rules: steelhead.push,
    flowSignal: "meaningful_rise",
    hydraulicAbsoluteChange24h: 160,
    hydraulicPercentChange24h: 11,
    waterTempF: 38,
  });
  assert((cold.score ?? 100) <= 49);
  assertEquals(cold.components?.temperatureState, "cold_holding");
});

Deno.test("Muskegon Chinook Activity is independently calibrated to the Croton tailwater", () => {
  assertEquals(chinook.activity?.version, "muskegon-fall-chinook-activity-v2");
  assertEquals(chinook.activity?.weights, {
    light: .55,
    waterTemperature: .2,
    riverBehavior: .15,
    weather: .1,
  });
  assertEquals(chinook.activity?.temperature, {
    coldF: 43,
    preferredMinF: 48,
    preferredMaxF: 62,
    warmF: 68,
    barrierF: 72,
  });
  assertEquals(chinook.activity?.caps.lifecycleRamp, {
    peakEnd: "10-12",
    taperingEnd: "10-25",
    endingEnd: "11-05",
  });

  const result = activityAt("2026-10-01", "peak");
  assertEquals(result.blocks.length, 4);
  assertMatch(result.detail, /Croton flow and temperature represent only/i);
  assertMatch(result.detail, /near the dam/i);
  assertEquals(
    /Tippy|Wellston|Scottville|Pere Marquette/i.test(result.detail),
    false,
  );
});

Deno.test("Muskegon Steelhead Activity is temperature-led and has no salmon lifecycle penalty", () => {
  assertEquals(steelhead.primitiveCapabilities.activity, {
    status: "available",
  });
  assertEquals(
    steelhead.activity?.version,
    "muskegon-fall-steelhead-activity-v1",
  );
  assertEquals(steelhead.activity?.profile, "steelhead_feeding");
  assertEquals(steelhead.activity?.weights, {
    light: .25,
    waterTemperature: .5,
    riverBehavior: .15,
    weather: .1,
  });
  assertEquals(steelhead.activity?.temperature, {
    coldF: 39,
    preferredMinF: 44,
    preferredMaxF: 56,
    warmF: 64,
    barrierF: 68,
  });
  assertEquals(steelhead.activity?.caps.lateRun, 100);
  assertEquals(steelhead.activity?.caps.ending, 100);
  assertEquals(steelhead.activity?.caps.taperingPenalty, undefined);
  assertEquals(steelhead.activity?.caps.lifecycleRamp, undefined);

  const stages = ["peak", "tapering", "ending", "post_run"] as const;
  const scores = stages.map((stage) =>
    steelheadActivityAt("2026-12-20", stage).blocks.map((block) => block.score)
  );
  for (const score of scores.slice(1)) assertEquals(score, scores[0]);
  const copy = JSON.stringify(steelheadActivityAt("2026-12-20", "ending"));
  assertEquals(/spent|dying|deteriorat|mortality/i.test(copy), false);
  assertMatch(copy, /Croton-area Steelhead responsiveness/i);
  assertEquals(/winter holding|winter read|winter outlook/i.test(copy), false);
  assertEquals(/Tippy|Wellston|Pere Marquette/i.test(copy), false);
});

Deno.test("Muskegon Coho Activity is species-specific and scoped to Croton", () => {
  assertEquals(coho.primitiveCapabilities.activity, { status: "available" });
  assertEquals(coho.activity?.version, "muskegon-fall-coho-activity-v1");
  assertEquals(coho.activity?.profile, "coho_fall_reaction");
  assertEquals(coho.activity?.weights, {
    light: 0.5,
    waterTemperature: 0.25,
    riverBehavior: 0.15,
    weather: 0.1,
  });
  assertEquals(coho.activity?.temperature, {
    coldF: 40,
    preferredMinF: 45,
    preferredMaxF: 60,
    warmF: 64,
    barrierF: 68,
  });
  assertEquals(coho.activity?.caps.lifecycleRamp, {
    peakEnd: "11-05",
    taperingEnd: "11-15",
    endingEnd: "11-30",
  });
  const result = cohoActivityAt("2026-10-25", "peak");
  assertMatch(result.detail, /Croton flow and temperature represent only/i);
  assertEquals(/Tippy|Wellston|Pere Marquette/i.test(result.detail), false);
});

Deno.test("Muskegon Coho Activity lowers its floor and ceiling through the back half", () => {
  const peak = cohoActivityAt("2026-11-05", "peak");
  const taperStart = cohoActivityAt("2026-11-06", "tapering");
  const taperEnd = cohoActivityAt("2026-11-15", "tapering");
  const endingStart = cohoActivityAt("2026-11-16", "ending");
  const endingEnd = cohoActivityAt("2026-11-30", "ending");
  const tail = cohoActivityAt("2026-12-07", "post_run");
  const first = (value: ReturnType<typeof cohoActivityAt>) =>
    value.blocks[0].score;

  assert(first(peak) - first(taperStart) <= 2);
  assertEquals(first(peak) - first(taperEnd), 15);
  assert(first(taperEnd) - first(endingStart) <= 5);
  assert(first(endingEnd) < first(endingStart));
  assert(first(endingEnd) <= 42);
  assert(first(tail) <= 42);
  assertMatch(tail.detail, /Late-run Coho condition varies widely/i);
});

Deno.test("Muskegon Chinook Activity fades its floor and ceiling continuously across the back half", () => {
  const peak = activityAt("2026-10-12", "peak");
  const taperStart = activityAt("2026-10-13", "tapering");
  const taperEnd = activityAt("2026-10-25", "tapering");
  const endingStart = activityAt("2026-10-26", "ending");
  const endingEnd = activityAt("2026-11-05", "ending");
  const tail = activityAt("2026-11-12", "post_run");
  const first = (value: ReturnType<typeof activityAt>) => value.blocks[0].score;

  assert(first(peak) - first(taperStart) <= 2);
  assertEquals(first(peak) - first(taperEnd), 15);
  assert(first(taperEnd) - first(endingStart) <= 5);
  assert(first(endingEnd) < first(endingStart));
  assert(first(endingEnd) <= 46);
  assert(first(tail) <= 46);
  assertMatch(tail.detail, /Late-run Chinook condition varies widely/i);
});

function activityAt(
  date: string,
  runStage: "peak" | "tapering" | "ending" | "post_run",
) {
  return scoreActivity({
    rules: chinook.activity!,
    requestDate: date,
    targetDate: date,
    runStage,
    staging: false,
    waterTempF: 56,
    temperatureTrend: "neutral",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 1500,
    fishabilityBands: chinook.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 75,
      shortwave_w_m2: hour >= 8 && hour <= 18 ? 180 : 30,
      clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 650 : 120,
      precipitation_in: 0,
    })),
    copyStrategy: "muskegon_croton_tailwater",
  });
}

function cohoActivityAt(
  date: string,
  runStage: "peak" | "tapering" | "ending" | "post_run",
) {
  return scoreActivity({
    rules: coho.activity!,
    requestDate: date,
    targetDate: date,
    runStage,
    staging: false,
    waterTempF: 52,
    temperatureTrend: "neutral",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 1500,
    fishabilityBands: coho.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 75,
      shortwave_w_m2: hour >= 8 && hour <= 18 ? 180 : 30,
      clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 650 : 120,
      precipitation_in: 0,
    })),
    copyStrategy: "muskegon_croton_tailwater",
  });
}

function steelheadActivityAt(
  date: string,
  runStage: "peak" | "tapering" | "ending" | "post_run",
) {
  return scoreActivity({
    rules: steelhead.activity!,
    requestDate: date,
    targetDate: date,
    runStage,
    staging: false,
    waterTempF: 50,
    temperatureTrend: "neutral",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 1500,
    fishabilityBands: steelhead.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 75,
      shortwave_w_m2: hour >= 8 && hour <= 18 ? 180 : 30,
      clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 650 : 120,
      precipitation_in: 0,
    })),
    copyStrategy: "muskegon_croton_tailwater",
  });
}
