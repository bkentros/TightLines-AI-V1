import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  addDays,
  BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  listVisibleRiverRuns,
  resolveFlowBand,
  resolveRunStage,
  scoreActivity,
  scoreFishability,
  scoreFishInRiver,
  scorePush,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";

const run = BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE;

Deno.test("Big Manistee Fall Chinook is valid and selectable for owner audit", () => {
  const result = validateRunProfile(run, BIG_MANISTEE_RIVER_PROFILE);
  assertEquals(result.valid, true);
  assertEquals(result.publicVisible, true);
  assertEquals(run.publicAudit.isEnabled, true);

  const catalog = listVisibleRiverRuns(
    [BIG_MANISTEE_RIVER_PROFILE],
    [run],
  );
  assertEquals(catalog[0]?.rivers[0]?.riverId, "big_manistee");
  assertEquals(
    catalog[0]?.rivers[0]?.runs[0]?.runId,
    "big_manistee_fall_chinook",
  );
});

Deno.test("Big Manistee Chinook Activity is enabled with independent tailwater calibration", () => {
  assertEquals(run.primitiveCapabilities.activity, { status: "available" });
  assertEquals(run.activity?.version, "big-manistee-fall-chinook-activity-v4");
  assertEquals(run.activity?.weights, {
    light: 0.55,
    waterTemperature: 0.2,
    riverBehavior: 0.15,
    weather: 0.1,
  });
  assertEquals(run.activity?.temperature, {
    coldF: 43,
    preferredMinF: 48,
    preferredMaxF: 62,
    warmF: 68,
    barrierF: 72,
  });

  const date = "2026-09-30";
  const result = scoreActivity({
    rules: run.activity!,
    requestDate: date,
    targetDate: date,
    runStage: "peak",
    staging: false,
    waterTempF: 58,
    temperatureTrend: "cooling",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 1650,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 80,
      shortwave_w_m2: hour >= 8 && hour <= 18 ? 140 : 0,
      clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 600 : 0,
      precipitation_in: 0,
    })),
  });
  assertEquals(result.blocks.length, 4);
  assertMatch(result.detail, /Wellston\/Tippy tailwater/i);
  assertMatch(result.detail, /farther downstream/i);
  assertEquals(/Scottville|Pere Marquette/i.test(result.detail), false);
});

Deno.test("Big Manistee Chinook Activity limits early warm-water reads to the measured reach", () => {
  const scoreForStage = (
    stage: "pre_run" | "beginning" | "building" | "peak",
  ) =>
    scoreActivity({
      rules: run.activity!,
      requestDate: "2026-08-20",
      targetDate: "2026-08-20",
      runStage: stage,
      staging: stage === "pre_run",
      waterTempF: 70,
      temperatureTrend: "neutral",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      currentHydraulicValue: 1650,
      fishabilityBands: run.fishabilityBands,
      flowSignal: "stable",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `2026-08-20T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 50,
        shortwave_w_m2: hour >= 8 && hour <= 18 ? 200 : 0,
        clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 600 : 0,
        precipitation_in: 0,
      })),
    });
  for (const stage of ["pre_run", "beginning", "building"] as const) {
    const result = scoreForStage(stage);
    assertMatch(result.detail, /independently verify cooler water/i);
    assertMatch(result.detail, /responsiveness there may be higher/i);
  }
  assertEquals(
    /independently verify cooler water/i.test(scoreForStage("peak").detail),
    false,
  );
});

Deno.test("Big Manistee lifecycle ramps the floor and penalty without stage-boundary cliffs", () => {
  const date = "2026-10-20";
  const common = {
    rules: run.activity!,
    requestDate: date,
    targetDate: date,
    staging: false,
    waterTempF: 55,
    temperatureTrend: "neutral" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    currentHydraulicValue: 1650,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable" as const,
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `${date}T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 75,
      shortwave_w_m2: hour >= 8 && hour <= 18 ? 180 : 30,
      clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 650 : 120,
      precipitation_in: 0,
    })),
  };
  const peak = scoreActivity({ ...common, runStage: "peak" });
  const tapering = scoreActivity({ ...common, runStage: "tapering" });
  assertEquals(
    tapering.blocks.map((block, index) =>
      peak.blocks[index].score - block.score
    ),
    [15, 15, 15, 15],
  );

  const endingLow = scoreActivity({
    ...common,
    requestDate: "2026-10-31",
    targetDate: "2026-10-31",
    runStage: "ending",
    waterTempF: 72,
    flowBand: "blown_out",
    currentHydraulicValue: 3600,
    hourlyWeather: common.hourlyWeather.map((hour) => ({
      ...hour,
      time_local: hour.time_local.replace(date, "2026-10-31"),
    })),
  });
  assert(endingLow.blocks.every((block) => block.score < 20));
  assertEquals(
    endingLow.reasonCodes.includes("activity_late_biology_cap"),
    true,
  );

  const scoreFor = (
    targetDate: string,
    runStage: "peak" | "tapering" | "ending",
  ) =>
    scoreActivity({
      ...common,
      requestDate: targetDate,
      targetDate,
      runStage,
      hourlyWeather: common.hourlyWeather.map((hour) => ({
        ...hour,
        time_local: hour.time_local.replace(date, targetDate),
      })),
    }).blocks[0].score;
  const boundaryScores = [
    scoreFor("2026-10-10", "peak"),
    scoreFor("2026-10-11", "tapering"),
    scoreFor("2026-10-20", "tapering"),
    scoreFor("2026-10-21", "ending"),
    scoreFor("2026-10-31", "ending"),
  ];
  assert(boundaryScores[0] - boundaryScores[1] <= 2);
  assert(boundaryScores[2] - boundaryScores[3] <= 4);
  assertEquals(boundaryScores[0] - boundaryScores[2], 15);
  assert(boundaryScores[4] < boundaryScores[3]);
});

Deno.test("Big Manistee configuration revision binds its river-specific biology", () => {
  const issues = validateConfigurationRevision({
    configKey: "big_manistee",
    revision: 1,
    status: "published",
    document: BIG_MANISTEE_CONFIGURATION_DOCUMENT,
    evidenceNotes:
      "Big Manistee Fall Chinook owner-audit implementation build.",
  });
  assertEquals(issues, []);
  assertEquals(
    BIG_MANISTEE_CONFIGURATION_DOCUMENT.runs.map((item) => item.runId),
    [
      "big_manistee_fall_chinook",
      "big_manistee_fall_coho",
      "big_manistee_fall_steelhead",
      "big_manistee_fall_brown_trout",
    ],
  );
  assertEquals(
    BIG_MANISTEE_CONFIGURATION_DOCUMENT.biologyProfiles.find((profile) =>
      profile.biologyProfileId === "big_manistee_chinook_v1"
    )?.adultMigrationTemperature,
    {
      coldHoldingF: 43,
      supportiveMinF: 45,
      preferredMinF: 50,
      supportiveMaxF: 64,
      tooWarmF: 68,
      migrationBarrierF: 72,
    },
  );
});

Deno.test("Big Manistee calendar and presence curve are independent of PM dates", () => {
  assertEquals(run.runWindow.start, "08-15");
  assertEquals(run.runWindow.peak, "09-30");
  assertEquals(run.runWindow.end, "10-31");
  assertEquals(run.runWindow.lateEnd, "11-10");
  const expected = new Map([
    ["2026-08-15", 8],
    ["2026-08-20", 14],
    ["2026-08-25", 20],
    ["2026-09-01", 30],
    ["2026-09-10", 55],
    ["2026-09-30", 100],
    ["2026-10-10", 95],
    ["2026-10-31", 38],
    ["2026-11-10", 0],
  ]);
  for (const [localDate, expectedScore] of expected) {
    assertEquals(scoreFishInRiver(run, localDate).score, expectedScore);
  }
});

Deno.test("Big Manistee stage copy uses the approved sections and never borrows PM geography", () => {
  const staging = resolveRunStage(run, "2026-08-01");
  assertMatch(staging.whereToStart ?? "", /Manistee Lake/i);
  assertMatch(staging.whereToStart ?? "", /Lower river \(M-55–Bear Creek\)/i);

  const beginning = resolveRunStage(run, "2026-08-15");
  assertMatch(beginning.whereToStart ?? "", /Lower river/i);
  assertMatch(beginning.whereToStart ?? "", /Middle river/i);

  const peak = resolveRunStage(run, "2026-09-30");
  assertEquals(peak.stage, "peak");
  assertMatch(
    peak.whereToStart ?? "",
    /Upper river \(High Bridge–Tippy Dam\)/i,
  );
  assertMatch(peak.whereToStart ?? "", /Tippy Dam area/i);

  for (
    const localDate of [
      "2026-08-01",
      "2026-08-15",
      "2026-09-10",
      "2026-09-30",
      "2026-10-20",
      "2026-11-01",
    ]
  ) {
    const display = resolveRunStage(run, localDate);
    const copy = [
      display.headline,
      display.whereToStart,
      display.detail,
      display.tip,
    ].join(" ");
    assertEquals(
      /Scottville|Walhalla|Baldwin|Pere Marquette/i.test(copy),
      false,
    );
  }
});

Deno.test("Big Manistee stage copy changes across every researched Chinook subphase", () => {
  const dates = [
    "2026-08-15",
    "2026-08-22",
    "2026-09-01",
    "2026-09-10",
    "2026-09-20",
    "2026-09-30",
    "2026-10-06",
    "2026-10-11",
    "2026-10-16",
    "2026-10-21",
    "2026-10-27",
    "2026-11-01",
  ];
  const copyStates = dates.map((date) => {
    const state = resolveRunStage(run, date);
    return [state.headline, state.whereToStart, state.detail, state.tip].join(
      "|",
    );
  });
  assertEquals(new Set(copyStates).size, copyStates.length);
  assertMatch(
    resolveRunStage(run, "2026-08-22").whereToStart ?? "",
    /Bear Creek/i,
  );
  assertMatch(
    resolveRunStage(run, "2026-09-20").headline,
    /approaching their strongest/i,
  );
  assertMatch(resolveRunStage(run, "2026-10-06").detail, /later mix/i);
  assertMatch(resolveRunStage(run, "2026-10-27").headline, /residual/i);
});

Deno.test("Big Manistee bands and Push use the larger regulated-tailwater scale", () => {
  assertEquals(
    resolveFlowBand({
      metric: "flow_cfs",
      value: 1050,
      fishabilityBands: run.fishabilityBands,
    })?.band,
    "very_low",
  );
  assertEquals(
    resolveFlowBand({
      metric: "flow_cfs",
      value: 1650,
      fishabilityBands: run.fishabilityBands,
    })?.band,
    "ideal",
  );
  assertEquals(
    resolveFlowBand({
      metric: "flow_cfs",
      value: 2800,
      fishabilityBands: run.fishabilityBands,
    })?.band,
    "very_high",
  );

  assertEquals(run.push.model, "direct_event_state");
  assertEquals(run.push.directEvent?.temperature, "trigger_and_constraint");
  assertEquals(run.push.directEvent?.persistenceHours, 48);
  assertEquals(run.push.hydraulic.meaningfulRise24h, {
    absolute: 100,
    percent: 7,
  });
  assertEquals(run.push.temperature.migrationBarrierF, 72);
});

Deno.test("Big Manistee Chinook lifecycle replay has complete river-specific copy", () => {
  const stages = new Set<string>();
  for (
    let localDate = "2026-07-01";
    localDate <= "2026-11-12";
    localDate = addDays(localDate, 1)
  ) {
    const display = resolveRunStage(run, localDate);
    stages.add(display.stage);
    const copy = [
      display.label,
      display.headline,
      display.whereToStart,
      display.detail,
      display.tip,
    ].join(" ");
    assert(copy.trim().length > 0);
    assertEquals(
      /Scottville|Walhalla|Baldwin|Pere Marquette/i.test(copy),
      false,
    );
  }
  assertEquals(
    [...stages],
    [
      "pre_run",
      "beginning",
      "building",
      "peak",
      "tapering",
      "ending",
      "post_run",
    ],
  );
});

Deno.test("Big Manistee flow boundaries remain deterministic at every configured edge", () => {
  const expectedBands: Array<[number, string]> = [
    [1099, "very_low"],
    [1100, "low"],
    [1399, "low"],
    [1400, "ideal"],
    [1750, "ideal"],
    [1751, "high_fishable"],
    [2500, "high_fishable"],
    [2501, "very_high"],
    [3499, "very_high"],
    [3500, "blown_out"],
  ];
  for (const [value, expectedBand] of expectedBands) {
    assertEquals(
      resolveFlowBand({
        metric: "flow_cfs",
        value,
        fishabilityBands: run.fishabilityBands,
      })?.band,
      expectedBand,
    );
  }

  const ideal = scoreFishability({
    rules: run.fishabilityBands,
    gaugeFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    currentHydraulicValue: 1650,
    copyStrategy: "big_manistee_tailwater",
  });
  assertEquals(ideal.score, 93);
  assertEquals(
    ideal.rulesVersion,
    "big-manistee-tailwater-fishability-v2-core-ideal",
  );
  assertMatch(
    ideal.detail,
    /Gauge Read compares flow with date history; Fishability uses reach-specific presentation bands\./,
  );

  const upperWater = scoreFishability({
    rules: run.fishabilityBands,
    gaugeFreshness: "fresh",
    flowBand: "high_fishable",
    flowSignal: "stable",
    currentHydraulicValue: 1800,
    copyStrategy: "big_manistee_tailwater",
  });
  assertEquals(upperWater.score, 73);
  assertEquals(upperWater.label, "Good");
  assertMatch(upperWater.headline, /remains fishable/);

  const blownOut = scoreFishability({
    rules: run.fishabilityBands,
    gaugeFreshness: "fresh",
    flowBand: "blown_out",
    flowSignal: "stable",
    currentHydraulicValue: 3600,
  });
  assertEquals(blownOut.score, 20);
  assertEquals(run.fishabilityBands.caps.blownOut, 24);
});
