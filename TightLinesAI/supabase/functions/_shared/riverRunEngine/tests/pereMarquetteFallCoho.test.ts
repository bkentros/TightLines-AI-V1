import { assert, assertEquals } from "jsr:@std/assert";
import {
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  listVisibleRiverRuns,
  PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveConditionsSuggestCheckpoints,
  resolveRunOpportunityCopyContext,
  resolveRunStage,
  scoreFishInRiver,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_COHO_RUN_PROFILE;

Deno.test("PM Fall Coho is a valid public run capped at 6", () => {
  const result = validateRunProfile(run, PERE_MARQUETTE_RIVER_PROFILE);

  assertEquals(result.valid, true);
  assertEquals(result.publicVisible, true);
  assertEquals(run.historicalPresence.maximum, 6);
  assertEquals(resolveRunOpportunityCopyContext(run.historicalPresence), {
    strength: "moderate",
    distributionScope: "broad",
  });
  assertEquals(run.publicAudit?.auditVersion, "pm-fall-coho-acceptance-v1");
  assertEquals(result.issues, []);
});

Deno.test("PM document binds Coho and Chinook to explicit shared biology", () => {
  assertEquals(
    run.biologyProfileId,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE.biologyProfileId,
  );
  assertEquals(run.species, GREAT_LAKES_COHO_BIOLOGY_PROFILE.species);
  assertEquals(
    run.movementEngineId,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE.movementEngineId,
  );
  assertEquals(
    run.push.temperature,
    {
      suitabilityLabel: "adult fall Coho migration",
      ...GREAT_LAKES_COHO_BIOLOGY_PROFILE.adultMigrationTemperature,
    },
  );
  assertEquals(
    validateConfigurationRevision({
      configKey: "pere_marquette",
      revision: 2,
      status: "draft",
      document: PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
      evidenceNotes: "PM Coho build-pass configuration.",
    }),
    [],
  );
});

Deno.test("PM Fall Coho reuses river hydraulics and not species timing", () => {
  assertEquals(
    run.push.hydraulic,
    PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.hydraulic,
  );
  assertEquals(
    run.push.rain,
    PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.rain,
  );
  assertEquals(
    run.push.caps,
    PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.caps,
  );
  const {
    evidenceNotes: _cohoEvidence,
    sourceNotes: _cohoSources,
    ...cohoBands
  } = run.fishabilityBands;
  const {
    evidenceNotes: _chinookEvidence,
    sourceNotes: _chinookSources,
    ...chinookBands
  } = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands;
  assertEquals(cohoBands, chinookBands);
  assert(run.fishabilityBands.evidenceNotes.includes("Coho acceptance replay"));
  assertEquals(
    run.waterTemperature,
    PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.waterTemperature,
  );
  assert(
    run.runWindow.start !==
      PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.runWindow.start,
  );
  assert(
    run.conditionsSuggest.baselineVersion !==
      PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.conditionsSuggest.baselineVersion,
  );
});

Deno.test("PM Fall Coho stage boundaries cover September through December", () => {
  const expected = [
    ["2026-08-14", "Offseason"],
    ["2026-08-15", "Before migration"],
    ["2026-09-01", "Beginning"],
    ["2026-09-21", "Building"],
    ["2026-10-10", "Peak"],
    ["2026-11-06", "Tapering"],
    ["2026-11-21", "Ending"],
    ["2026-12-01", "After migration"],
    ["2027-01-02", "After migration"],
    ["2027-01-03", "Offseason"],
  ] as const;

  for (const [localDate, label] of expected) {
    assertEquals(resolveRunStage(run, localDate).label, label, localDate);
  }
});

Deno.test("PM Fall Coho presence follows its 60-point river ceiling", () => {
  const expected = [
    ["2026-08-14", 0, "Offseason"],
    ["2026-08-15", 0, "Not expected yet"],
    ["2026-09-01", 6, "Low presence"],
    ["2026-09-15", 12, "Low presence"],
    ["2026-10-01", 30, "Moderate presence"],
    ["2026-10-20", 60, "Peak presence"],
    ["2026-11-05", 54, "Peak presence"],
    ["2026-11-20", 36, "Moderate presence"],
    ["2026-11-30", 24, "Limited presence"],
    ["2026-12-15", 12, "Low presence"],
    ["2026-12-27", 5, "Low presence"],
    ["2026-12-31", 0, "Migration complete"],
    ["2027-01-03", 0, "Offseason"],
  ] as const;

  for (const [localDate, score, label] of expected) {
    const result = scoreFishInRiver(run, localDate);
    assertEquals(result.riverCeiling, 60, localDate);
    assertEquals(result.score, score, localDate);
    assertEquals(result.label, label, localDate);
  }
});

Deno.test("PM Fall Coho Migration Timing has five dedicated checkpoints", () => {
  assertEquals(
    resolveConditionsSuggestCheckpoints(run, "2026-10-20").map((item) => [
      item.checkpointId,
      item.checkpointDate,
      item.cutoffDate,
      item.observationStartDate,
    ]),
    [
      ["river_start", "2026-09-01", "2026-08-31", "2026-08-25"],
      ["building_start", "2026-09-21", "2026-09-20", "2026-08-25"],
      ["building_established", "2026-10-01", "2026-09-30", "2026-08-25"],
      ["peak_start", "2026-10-10", "2026-10-09", "2026-08-25"],
      ["peak_complete", "2026-10-26", "2026-10-25", "2026-08-25"],
    ],
  );
});

Deno.test("production catalog exposes accepted Coho", () => {
  const catalog = listVisibleRiverRuns(
    [PERE_MARQUETTE_RIVER_PROFILE],
    PERE_MARQUETTE_CONFIGURATION_DOCUMENT.runs,
  );
  assertEquals(catalog[0].rivers[0].runs.map((item) => item.runId), [
    "pere_marquette_fall_chinook",
    "pere_marquette_fall_coho",
    "pere_marquette_fall_steelhead",
  ]);
});
