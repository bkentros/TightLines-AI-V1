import { getMovementEngineDefinition } from "./movementEngines.ts";
import { PERE_MARQUETTE_RIVER_PROFILE } from "./rivers.ts";
import { PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE } from "./runs.ts";
import type {
  AuditedRiverRunProfile,
  RiverProfile,
  RiverRunConfigurationDocument,
} from "../types.ts";

export const PERE_MARQUETTE_CONFIGURATION_DOCUMENT:
  RiverRunConfigurationDocument = {
    schemaVersion: "river-run-config-v1",
    configVersion: "2026-08-02.1",
    movementEngineVersion: getMovementEngineDefinition("fall_cooling").version,
    river: PERE_MARQUETTE_RIVER_PROFILE,
    runs: [PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE],
  };

/**
 * Creates an unpublished river/run document without relaxing validation.
 * Callers must supply researched river and run data; unsupported movement
 * engines remain invalid until their code implementation is shipped.
 */
export function createRiverRunConfigurationDocument(input: {
  configVersion: string;
  river: RiverProfile;
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
    runs: input.runs,
  };
}
