import {
  assert,
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "jsr:@std/assert";
import {
  GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
  MILWAUKEE_CONFIGURATION_DOCUMENT,
  MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
  MILWAUKEE_FALL_CHINOOK_RUN_PROFILE,
  MILWAUKEE_FALL_COHO_RUN_PROFILE,
  MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE,
  MILWAUKEE_RIVER_PROFILE,
  resolveRunStage,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
  scoreFishability,
  scoreFishInRiver,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

const runs = [
  MILWAUKEE_FALL_CHINOOK_RUN_PROFILE,
  MILWAUKEE_FALL_COHO_RUN_PROFILE,
  MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE,
  MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
];

Deno.test("Milwaukee four-species foundation validates and remains hidden", () => {
  const riverResult = validateRiverProfile(MILWAUKEE_RIVER_PROFILE);
  assertEquals(
    riverResult.valid,
    true,
    riverResult.issues.map((issue) => issue.message).join("\n"),
  );
  assertEquals(MILWAUKEE_RIVER_PROFILE.foundation?.targetSpecies, [
    "chinook_salmon",
    "coho_salmon",
    "steelhead",
    "lake_run_brown_trout",
  ]);
  assertEquals(
    RIVER_RUN_DRAFT_RUN_PROFILES.filter((run) => run.riverId === "milwaukee")
      .length,
    4,
  );

  for (const run of runs) {
    const result = validateRunProfile(run, MILWAUKEE_RIVER_PROFILE);
    assertEquals(
      result.valid,
      true,
      `${run.runId}: ${result.issues.map((issue) => issue.message).join("\n")}`,
    );
    assertEquals(result.publicVisible, false, run.runId);
    assertEquals(run.publicAudit.isEnabled, false, run.runId);
    assertEquals(run.primitiveCapabilities.migrationStage.status, "available");
    assertEquals(run.primitiveCapabilities.fishInRiver.status, "available");
    assertEquals(
      run.primitiveCapabilities.fishability.status,
      "available",
    );
    assertEquals(run.primitiveCapabilities.activity.status, "available");
    assert(run.activity, `${run.runId} Activity rules missing`);
    assert(
      !RIVER_RUN_RUN_PROFILES.some((publicRun) =>
        publicRun.runId === run.runId
      ),
      `${run.runId} leaked into the public registry`,
    );
  }

  const issues = validateConfigurationRevision({
    configKey: "milwaukee",
    revision: 1,
    status: "draft",
    document: MILWAUKEE_CONFIGURATION_DOCUMENT,
    evidenceNotes: "Milwaukee Gate 4 hidden truth/copy candidate.",
  });
  assert(
    issues.every((issue) => issue.severity !== "error"),
    issues.map((issue) => issue.message).join("\n"),
  );
});

Deno.test("Milwaukee ceilings, calendars, and endpoints match the approved portfolio", () => {
  assertEquals(
    runs.map((run) => [run.species, run.historicalPresence.maximum]),
    [
      ["chinook_salmon", 8],
      ["coho_salmon", 7],
      ["steelhead", 7],
      ["lake_run_brown_trout", 9],
    ],
  );
  assertEquals(MILWAUKEE_FALL_CHINOOK_RUN_PROFILE.runWindow.peak, "10-08");
  assertEquals(MILWAUKEE_FALL_COHO_RUN_PROFILE.runWindow.peak, "10-20");
  assertEquals(MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE.runWindow.peak, "10-08");
  assertEquals(
    scoreFishInRiver(MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE, "2026-10-08").score,
    70,
  );
  assertEquals(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE.runWindow.peak,
    "11-25",
  );
  assertEquals(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE.historicalPresence
      .distributionScope,
    "concentrated",
  );
  assertMatch(
    MILWAUKEE_RIVER_PROFILE.foundation?.upstreamTerminus ?? "",
    /Bridge Street Dam.*all four supported runs/i,
  );
});

Deno.test("Milwaukee Stage copy leads with restrictions and keeps Brown Trout lower-river weighted", () => {
  const chinook = resolveRunStage(
    MILWAUKEE_FALL_CHINOOK_RUN_PROFILE,
    "2026-10-08",
  );
  assertMatch(chinook.whereToStart ?? "", /^Restrictions first:/);
  assertMatch(chinook.whereToStart ?? "", /Kletzsch.*refuge/i);
  assertMatch(chinook.whereToStart ?? "", /night-fishing restriction/i);
  assertMatch(chinook.whereToStart ?? "", /Urban Greenway/i);
  assertMatch(chinook.detail, /Bridge Street Dam/i);

  const brown = resolveRunStage(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
    "2026-11-25",
  );
  assertMatch(brown.whereToStart ?? "", /Harbor & Downtown|Urban Greenway/i);
  assertMatch(brown.whereToStart ?? "", /North Shore/i);
  assertMatch(brown.detail, /concentrated toward the lower river/i);
  assertMatch(brown.detail, /Bridge Street Dam/i);
});

Deno.test("lake-run Brown Trout use repeat-spawner lifecycle and nonterminal copy", () => {
  assertEquals(
    GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE.movementEngineId,
    "fall_repeat_spawner_cooling",
  );
  assertEquals(
    GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE.semelparous,
    false,
  );
  assertEquals(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE.runType,
    "fall_repeat_spawn",
  );
  assertEquals(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE.activity?.profile,
    "brown_trout_fall_reaction",
  );
  assertEquals(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE.activity?.dataMode,
    "observed_river",
  );
  assertEquals(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE.activity?.inputReach
      ?.hydraulicSourceIds,
    ["milwaukee_estabrook_usgs"],
  );
  assertEquals(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE.primitiveCapabilities.fishability
      .status,
    "available",
  );
  assertEquals(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE.fishabilityBands,
    MILWAUKEE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
  );

  const endingPresence = scoreFishInRiver(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
    "2027-01-10",
  );
  assertMatch(endingPresence.detail, /Brown Trout are repeat spawners/i);
  assertMatch(endingPresence.detail, /hold in the river or return lakeward/i);

  const completeStage = resolveRunStage(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
    "2027-01-16",
  );
  const completePresence = scoreFishInRiver(
    MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
    "2027-01-16",
  );
  assertEquals(completeStage.label, "Fall migration complete");
  assertEquals(completePresence.score, null);
  assertMatch(completePresence.detail, /remain.*or return lakeward/i);
  assertNotMatch(completePresence.detail, /die|dead/i);
});

Deno.test("Milwaukee Activity profiles cannot cross species lifecycle boundaries", () => {
  for (const run of runs) {
    const wrongProfile = run.species === "chinook_salmon"
      ? "steelhead_feeding" as const
      : "chinook_fall_reaction" as const;
    const result = validateRunProfile(
      { ...run, activity: { ...run.activity!, profile: wrongProfile } },
      MILWAUKEE_RIVER_PROFILE,
    );
    assertEquals(result.valid, false, run.runId);
    assert(
      result.issues.some((issue) => issue.field === "activity.profile"),
      run.runId,
    );
  }
});

Deno.test("Milwaukee Brown Activity uses Estabrook measurements without terminal claims", () => {
  const run = MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE;
  const result = scoreActivity({
    rules: run.activity!,
    requestDate: "2026-11-25",
    targetDate: "2026-11-25",
    runStage: "peak",
    staging: false,
    waterTempF: 50,
    temperatureTrend: "neutral",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 359,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `2026-11-25T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 85,
      shortwave_w_m2: hour >= 8 && hour < 17 ? 100 : 0,
      clear_sky_shortwave_w_m2: hour >= 8 && hour < 17 ? 450 : 0,
      precipitation_in: 0,
    })),
  });
  assertEquals(result.confidence, "Full");
  assert(result.score !== null);
  assertMatch(result.detail, /Urban Greenway near Estabrook Park/i);
  assertMatch(result.detail, /does not directly measure Harbor & Downtown/i);
  assertNotMatch(
    JSON.stringify(result),
    /mortality|dying|spent/i,
  );
});

Deno.test("Milwaukee Chinook keeps the audited warm ceiling and barrier", () => {
  const run = MILWAUKEE_FALL_CHINOOK_RUN_PROFILE;
  const scoreAt = (waterTempF: number) =>
    scoreActivity({
      rules: run.activity!,
      requestDate: "2026-09-24",
      targetDate: "2026-09-24",
      runStage: "peak",
      staging: false,
      waterTempF,
      temperatureTrend: "neutral",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      currentHydraulicValue: 359,
      fishabilityBands: run.fishabilityBands,
      flowSignal: "stable",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `2026-09-24T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 85,
        shortwave_w_m2: hour >= 8 && hour < 19 ? 100 : 0,
        clear_sky_shortwave_w_m2: hour >= 8 && hour < 19 ? 450 : 0,
        precipitation_in: 0,
      })),
    }).score;

  assertEquals(run.activity?.caps.warmWaterMaximum, 43);
  assert((scoreAt(68) ?? 100) <= 43);
  assertEquals(scoreAt(72), 24);
});

Deno.test("Milwaukee Fishability is post-removal and Estabrook-reach scoped", () => {
  const bands = MILWAUKEE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands!;
  assertEquals(bands.tooLow.max, 170);
  assertEquals(bands.ideal, { min: 237, max: 594 });
  assertEquals(bands.blownOut.min, 1520);
  const display = scoreFishability({
    rules: bands,
    gaugeFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    currentHydraulicValue: 359,
  });
  assertMatch(display.detail, /Estabrook Park/i);
  assertMatch(display.detail, /does not describe Milwaukee Harbor/i);
  assertMatch(display.detail, /North Shore above Kletzsch/i);
});

Deno.test("Milwaukee Steelhead fall completion preserves overwintering truth", () => {
  const stage = resolveRunStage(
    MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE,
    "2026-12-16",
  );
  const presence = scoreFishInRiver(
    MILWAUKEE_FALL_STEELHEAD_RUN_PROFILE,
    "2026-12-16",
  );
  assertEquals(stage.label, "Fall entry complete");
  assertMatch(stage.tip, /may remain through winter/i);
  assertEquals(presence.score, null);
  assertMatch(presence.detail, /may remain in the river/i);
});
