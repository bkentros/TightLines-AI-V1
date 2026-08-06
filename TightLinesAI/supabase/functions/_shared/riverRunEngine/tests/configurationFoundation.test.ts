import { assert, assertEquals } from "jsr:@std/assert";
import {
  createRiverRunConfigurationDocument,
  PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  RIVER_RUN_SPECIES_BIOLOGY_PROFILES,
  validateConfigurationRevision,
  validateRunProfile,
} from "../index.ts";

Deno.test("PM configuration document binds both implemented fall movement branches", () => {
  assertEquals(
    PERE_MARQUETTE_CONFIGURATION_DOCUMENT.movementEngineVersion,
    "fall-cooling-v2+fall-entry-cooling-v1",
  );
  assertEquals(
    PERE_MARQUETTE_CONFIGURATION_DOCUMENT.configVersion,
    "2026-08-07.12",
  );
});

Deno.test("reserved spring engine fails closed until it is implemented", () => {
  const run = {
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    runId: "test_spring",
    season: "spring" as const,
    runType: "spring_spawn" as const,
    movementEngineId: "spring_warming" as const,
  };
  const result = validateRunProfile(run, PERE_MARQUETTE_RIVER_PROFILE);
  assertEquals(result.valid, false);
  assert(
    result.issues.some((item) =>
      item.code === "config_movement_engine_unavailable"
    ),
  );
});

Deno.test("future river documents use the same schema without engine exceptions", () => {
  const river = {
    ...PERE_MARQUETTE_RIVER_PROFILE,
    riverId: "future_river",
    displayName: "Future River",
  };
  const run = {
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    riverId: river.riverId,
    runId: "future_river_fall_chinook",
  };
  const document = createRiverRunConfigurationDocument({
    configVersion: "future-draft-v1",
    river,
    biologyProfiles: RIVER_RUN_SPECIES_BIOLOGY_PROFILES,
    runs: [run],
  });
  assertEquals(document.schemaVersion, "river-run-config-v1");
  assertEquals(document.movementEngineVersion, "fall-cooling-v2");
  assertEquals(validateRunProfile(run, river).valid, true);
});

Deno.test("configuration revisions validate researched source references and evidence", () => {
  const issues = validateConfigurationRevision({
    configKey: "pere_marquette",
    revision: 1,
    status: "draft",
    document: PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
    evidenceNotes:
      "Initial reusable PM Fall Chinook configuration with audited sources.",
  });
  assertEquals(issues, []);

  const brokenDocument = {
    ...PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
    runs: [{
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
      waterTemperature: {
        ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.waterTemperature,
        sourcePriority: ["missing_source"],
      },
    }],
  };
  const broken = validateConfigurationRevision({
    configKey: "pere_marquette",
    revision: 2,
    status: "draft",
    document: brokenDocument,
    evidenceNotes: "Broken fixture.",
  });
  assert(
    broken.some((item) => item.code === "config_source_reference_missing"),
  );
});

Deno.test("Push configuration cannot publish permissive safety caps", () => {
  const result = validateRunProfile({
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    push: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push,
      caps: {
        ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.push.caps,
        unknownTrend: 70,
        staleGauge: 80,
        tooWarm: 90,
      },
    },
  }, PERE_MARQUETTE_RIVER_PROFILE);

  assertEquals(result.valid, false);
  assert(
    result.issues.some((item) => item.field === "push.caps"),
  );
});

Deno.test("Fishability fails closed without an audited absolute band block", () => {
  const run = {
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  } as Record<string, unknown>;
  delete run.fishabilityBands;
  const result = validateRunProfile(
    run as unknown as typeof PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    PERE_MARQUETTE_RIVER_PROFILE,
  );

  assertEquals(result.valid, false);
  assert(
    result.issues.some((item) => item.field === "fishabilityBands"),
  );
});

Deno.test("Fishability rejects disordered thresholds, permissive caps, and thin calibration", () => {
  const result = validateRunProfile({
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    fishabilityBands: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands,
      ideal: { min: 900, max: 700 },
      caps: {
        ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.fishabilityBands.caps,
        blownOut: 25,
      },
    },
    baselineCoverage: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.baselineCoverage!,
      minimumHistoryYears: 4,
    },
  }, PERE_MARQUETTE_RIVER_PROFILE);

  assertEquals(result.valid, false);
  assert(
    result.issues.some((item) => item.field === "fishabilityBands"),
  );
  assert(
    result.issues.some((item) => item.field === "fishabilityBands.caps"),
  );
  assert(
    result.issues.some((item) =>
      item.field === "baselineCoverage.minimumHistoryYears"
    ),
  );
});
