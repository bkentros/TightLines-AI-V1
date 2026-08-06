import { getMovementEngineDefinition } from "./movementEngines.ts";
import {
  BETSIE_RIVER_PROFILE,
  BIG_MANISTEE_RIVER_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
} from "./rivers.ts";
import {
  BETSIE_FALL_CHINOOK_RUN_PROFILE,
  BETSIE_FALL_COHO_RUN_PROFILE,
  BETSIE_FALL_STEELHEAD_RUN_PROFILE,
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
  BIG_MANISTEE_FALL_COHO_RUN_PROFILE,
  BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_FALL_COHO_RUN_PROFILE,
  PERE_MARQUETTE_FALL_STEELHEAD_RUN_PROFILE,
} from "./runs.ts";
import {
  BIG_MANISTEE_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
  GREAT_LAKES_COHO_BIOLOGY_PROFILE,
  GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
  RIVER_RUN_SPECIES_BIOLOGY_PROFILES,
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
    configVersion: "2026-08-05.8",
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
  configVersion: "2026-08-05-betsie.6",
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

/** Big Manistee Chinook, Coho, and fall Steelhead owner-audit release. */
export const BIG_MANISTEE_CONFIGURATION_DOCUMENT:
  RiverRunConfigurationDocument = {
    schemaVersion: "river-run-config-v1",
    configVersion: "2026-08-06-big-manistee-fall-steelhead.2",
    movementEngineVersion: [
      getMovementEngineDefinition("fall_cooling").version,
      getMovementEngineDefinition("fall_entry_cooling").version,
    ].join("+"),
    river: BIG_MANISTEE_RIVER_PROFILE,
    biologyProfiles: [
      BIG_MANISTEE_CHINOOK_BIOLOGY_PROFILE,
      GREAT_LAKES_CHINOOK_BIOLOGY_PROFILE,
      GREAT_LAKES_COHO_BIOLOGY_PROFILE,
      GREAT_LAKES_STEELHEAD_FALL_ENTRY_BIOLOGY_PROFILE,
    ],
    runs: [
      BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE,
      BIG_MANISTEE_FALL_COHO_RUN_PROFILE,
      BIG_MANISTEE_FALL_STEELHEAD_RUN_PROFILE,
    ],
  };

export const RIVER_RUN_CONFIGURATION_DOCUMENTS:
  RiverRunConfigurationDocument[] = [
    PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
    BETSIE_CONFIGURATION_DOCUMENT,
    BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  ];

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
