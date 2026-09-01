import { getMovementEngineDefinition } from "./movementEngines.ts";
import { withSeasonalZonePlans } from "./seasonalZonePlans.ts";
import { BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE } from "./onboarding/bigManisteeBrown.ts";
import {
  BOIS_BRULE_CONFIGURATION_DOCUMENT,
  GRAND_CONFIGURATION_DOCUMENT,
  MILWAUKEE_CONFIGURATION_DOCUMENT,
  PLATTE_CONFIGURATION_DOCUMENT,
  ROOT_CONFIGURATION_DOCUMENT,
  SHEBOYGAN_CONFIGURATION_DOCUMENT,
  WHITE_CONFIGURATION_DOCUMENT,
} from "./onboarding/index.ts";
import {
  BETSIE_RIVER_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  MUSKEGON_RIVER_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  ST_JOSEPH_RIVER_PROFILE,
} from "./rivers.ts";
import {
  BETSIE_FALL_CHINOOK_RUN_PROFILE,
  BETSIE_FALL_COHO_RUN_PROFILE,
  BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_FALL_COHO_RUN_PROFILE,
  BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
  MUSKEGON_FALL_CHINOOK_RUN_PROFILE,
  MUSKEGON_FALL_COHO_RUN_PROFILE,
  MUSKEGON_FALL_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
  ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE,
  ST_JOSEPH_FALL_COHO_RUN_PROFILE,
  ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE,
} from "./runs.ts";
import {
  BIG_MANISTEE_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  MUSKEGON_CHINOOK_BIOLOGY_PROFILE,
  RIVER_RUN_SPECIES_BIOLOGY_PROFILES,
  ST_JOSEPH_CHINOOK_BIOLOGY_PROFILE,
} from "./speciesBiology.ts";
import type {
  AuditedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
  SpeciesBiologyProfile,
} from "../types.ts";

export const PERE_MARQUETTE_CONFIGURATION_DOCUMENT:
  RiverRunConfigurationDocument = {
    schemaVersion: "river-run-config-v1",
    configVersion:
      "2026-08-27-pm-fishability-reconciliation.17+seasonal-zone-v1",
    movementEngineVersion: [
      getMovementEngineDefinition("fall_cooling").version,
      getMovementEngineDefinition("fall_entry_cooling").version,
    ].join("+"),
    river: PERE_MARQUETTE_RIVER_PROFILE,
    biologyProfiles: RIVER_RUN_SPECIES_BIOLOGY_PROFILES,
    runs: [
      PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
      PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
      PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
    ],
  };

export const BETSIE_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion:
    "2026-08-27-betsie-fishability-source-audit.2+seasonal-zone-v1",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
  ].join("+"),
  river: BETSIE_RIVER_PROFILE,
  biologyProfiles: [
    GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  ],
  runs: [
    BETSIE_FALL_CHINOOK_RUN_PROFILE,
    BETSIE_FALL_COHO_RUN_PROFILE,
    BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  ],
};

/** Big Manistee four-species owner-audit release. */
export const BIG_MANISTEE_CONFIGURATION_DOCUMENT:
  RiverRunConfigurationDocument = {
    schemaVersion: "river-run-config-v1",
    configVersion: "2026-08-29-big-manistee-brown-release.3+seasonal-zone-v1",
    movementEngineVersion: [
      getMovementEngineDefinition("fall_cooling").version,
      getMovementEngineDefinition("fall_entry_cooling").version,
      getMovementEngineDefinition("fall_repeat_spawner_cooling").version,
    ].join("+"),
    river: BIG_MANISTEE_RIVER_PROFILE,
    biologyProfiles: [
      BIG_MANISTEE_CHINOOK_BIOLOGY_PROFILE,
      GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
      GREAT_LAKES_COHO_BIOLOGY_PROFILE,
      GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
      GREAT_LAKES_LAKE_RUN_BROWN_TROUT_BIOLOGY_PROFILE,
    ],
    runs: [
      BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
      BIG_MANISTEE_FALL_COHO_RUN_PROFILE,
      BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
      BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE,
    ],
  };

export const MUSKEGON_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion:
    "2026-08-27-muskegon-fishability-reconciliation.2+seasonal-zone-v1",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
  ].join("+"),
  river: MUSKEGON_RIVER_PROFILE,
  biologyProfiles: [
    MUSKEGON_CHINOOK_BIOLOGY_PROFILE,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  ],
  runs: [
    MUSKEGON_FALL_CHINOOK_RUN_PROFILE,
    MUSKEGON_FALL_COHO_RUN_PROFILE,
    MUSKEGON_FALL_STEELHEAD_RUN_PROFILE,
  ],
};

export const ST_JOSEPH_CONFIGURATION_DOCUMENT: RiverRunConfigurationDocument = {
  schemaVersion: "river-run-config-v1",
  configVersion: "2026-08-31-st-joseph-fish-counts.4+seasonal-zone-v1",
  movementEngineVersion: [
    getMovementEngineDefinition("fall_cooling").version,
    getMovementEngineDefinition("fall_entry_cooling").version,
  ].join("+"),
  river: ST_JOSEPH_RIVER_PROFILE,
  biologyProfiles: [
    ST_JOSEPH_CHINOOK_BIOLOGY_PROFILE,
    GREAT_LAKES_COHO_BIOLOGY_PROFILE,
    GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  ],
  runs: [
    ST_JOSEPH_FALL_CHINOOK_RUN_PROFILE,
    ST_JOSEPH_FALL_COHO_RUN_PROFILE,
    ST_JOSEPH_FALL_STEELHEAD_RUN_PROFILE,
  ],
};

export const RIVER_RUN_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = [
    PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
    BETSIE_CONFIGURATION_DOCUMENT,
    BIG_MANISTEE_CONFIGURATION_DOCUMENT,
    MUSKEGON_CONFIGURATION_DOCUMENT,
    ST_JOSEPH_CONFIGURATION_DOCUMENT,
    GRAND_CONFIGURATION_DOCUMENT,
    PLATTE_CONFIGURATION_DOCUMENT,
    WHITE_CONFIGURATION_DOCUMENT,
    MILWAUKEE_CONFIGURATION_DOCUMENT,
    SHEBOYGAN_CONFIGURATION_DOCUMENT,
    ROOT_CONFIGURATION_DOCUMENT,
    BOIS_BRULE_CONFIGURATION_DOCUMENT,
  ].map((document) => ({
    ...document,
    runs: withSeasonalZonePlans(document.runs),
  }));

export function staticConfigurationVersionForRun(runId: string): string {
  return RIVER_RUN_CONFIGURATION_DOCUMENTS.find((document) =>
    document.runs.some((run) => run.runId === runId)
  )?.configVersion ?? PERE_MARQUETTE_CONFIGURATION_DOCUMENT.configVersion;
}

/**
 * Creates an unpublished river/run document without relaxing validation.
 * Callers must supply researched river and run data; unsupported movement
 * engines remain invalid until their code implementation is shipped.
 */
export function createRiverRunConfigurationDocument(input: {
  configVersion: string;
  river: RiverProfile;
  biologyProfiles: SpeciesBiologyProfile[];
  runs: AuditedRiverRunProfile[];
}): RiverRunConfigurationDocument {
  const engineVersions = [
    ...new Set(
      input.runs.map((run) =>
        getMovementEngineDefinition(run.movementEngineId).version
      ),
    ),
  ];
  return {
    schemaVersion: "river-run-config-v1",
    configVersion: input.configVersion,
    movementEngineVersion: engineVersions.join("+"),
    river: input.river,
    biologyProfiles: input.biologyProfiles,
    runs: input.runs,
  };
}
