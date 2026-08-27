import {
  assert,
  assertEquals,
  assertMatch,
  assertNotMatch,
} from "jsr:@std/assert";
import {
  BIG_MANISTEE_BROWN_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_BROWN_REVIEW_RIVER_PROFILE,
  BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  resolveRunStage,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
  scoreFishInRiver,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";

const run = BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE;

Deno.test("Big Manistee migratory Brown Trout validates and remains owner-review only", () => {
  assertEquals(
    BIG_MANISTEE_BROWN_REVIEW_RIVER_PROFILE.foundation?.targetSpecies,
    ["lake_run_brown_trout"],
  );
  const result = validateRunProfile(run, BIG_MANISTEE_RIVER_PROFILE);
  assertEquals(
    result.valid,
    true,
    result.issues.map((issue) => issue.message).join("\n"),
  );
  assertEquals(result.publicVisible, false);
  assertEquals(run.publicAudit.isEnabled, false);
  assertEquals(BIG_MANISTEE_BROWN_CONFIGURATION_DOCUMENT.runs, [run]);
  assert(
    RIVER_RUN_DRAFT_RUN_PROFILES.some((item) => item.runId === run.runId),
  );
  assert(
    !RIVER_RUN_RUN_PROFILES.some((item) => item.runId === run.runId),
    "hidden Brown Trout run leaked into the public catalog",
  );

  const issues = validateConfigurationRevision({
    configKey: "big_manistee_brown",
    revision: 1,
    status: "draft",
    document: BIG_MANISTEE_BROWN_CONFIGURATION_DOCUMENT,
    evidenceNotes:
      "Hidden Big Manistee migratory-Brown owner-review candidate.",
  });
  assert(
    issues.every((issue) => issue.severity !== "error"),
    issues.map((issue) => issue.message).join("\n"),
  );
});

Deno.test("Big Manistee Brown timing and sectional 5/10 ceiling remain exact", () => {
  assertEquals(run.runType, "fall_repeat_spawn");
  assertEquals(run.movementEngineId, "fall_repeat_spawner_cooling");
  assertEquals(run.historicalPresence.maximum, 5);
  assertEquals(run.historicalPresence.distributionScope, "sectional");
  assertEquals(run.runWindow, {
    preRunStart: "08-15",
    stagingStart: "08-25",
    start: "09-05",
    beginningEnd: "09-15",
    buildingEstablishedStart: "09-16",
    buildingBroadStart: "09-23",
    peakStart: "09-25",
    peak: "10-01",
    peakEnd: "10-15",
    taperingEnd: "10-31",
    end: "11-30",
    lateEnd: "12-01",
    postRunLateCopyEnd: "12-15",
  });

  const peak = scoreFishInRiver(run, "2026-10-01");
  assertEquals(peak.score, 50);
  assertEquals(peak.riverCeiling, 50);
  assertEquals(peak.historicalRunStrength, "moderate");
});

Deno.test("Big Manistee Brown Activity uses measured Wellston temperature without salmon lifecycle penalties", () => {
  assertEquals(run.activity?.dataMode, "observed_river");
  assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, [
    "big_manistee_wellston_temperature",
  ]);
  assertEquals(run.activity?.temperature, {
    coldF: 38,
    preferredMinF: 44,
    preferredMaxF: 58,
    warmF: 64,
    barrierF: 70,
  });
  assertEquals(run.activity?.stageResponseAdjustment, undefined);
  assertEquals(run.activity?.caps.lateRun, 100);
  assertEquals(run.activity?.caps.ending, 100);

  const common = {
    rules: run.activity!,
    requestDate: "2026-10-01",
    targetDate: "2026-10-01",
    staging: false,
    waterTempF: 52,
    temperatureTrend: "cooling" as const,
    gaugeFreshness: "fresh" as const,
    weatherFreshness: "fresh" as const,
    flowBand: "ideal" as const,
    currentHydraulicValue: 1650,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable" as const,
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `2026-10-01T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 75,
      shortwave_w_m2: hour >= 8 && hour <= 18 ? 150 : 0,
      clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 600 : 0,
      precipitation_in: 0,
    })),
  };
  const peak = scoreActivity({ ...common, runStage: "peak" });
  const tapering = scoreActivity({ ...common, runStage: "tapering" });
  const ending = scoreActivity({ ...common, runStage: "ending" });
  assertEquals(tapering.blocks, peak.blocks);
  assertEquals(ending.blocks, peak.blocks);
  assertEquals(
    peak.reasonCodes.includes("activity_late_biology_cap"),
    false,
  );
});

Deno.test("Big Manistee Brown completion preserves repeat-spawner uncertainty", () => {
  const stage = resolveRunStage(run, "2027-01-16");
  const presence = scoreFishInRiver(run, "2027-01-16");
  assertEquals(stage.label, "Fall migration complete");
  assertEquals(presence.label, "Fall migration complete");
  assertMatch(
    JSON.stringify({ stage, presence }),
    /remain.*or return lakeward/i,
  );
  assertNotMatch(
    JSON.stringify({ stage, presence }),
    /die|dead|mortality|all (?:fish|browns).*left/i,
  );
  assertNotMatch(JSON.stringify({ stage, presence }), /above Tippy/i);
});
