/**
 * Shared normalized output — ENGINE_REBUILD_MASTER_PLAN § Shared normalized output contract
 */

import type { EngineContext } from "./context.ts";
import type { RegionKey } from "./region.ts";
import type { ScoredVariableKey } from "./variables.ts";
import type { TemperatureNormalized, VariableState } from "./variableState.ts";

export type ReliabilityTierNormalized = "high" | "medium" | "low";

/** Why a scored variable was omitted from the active set */
export type VariableDataGapReason =
  | "absent"
  | "insufficient_history"
  | "not_applicable_context"
  /** River: runoff needs 24h + 72h + 7d precip totals together — partial fields are not imputed */
  | "incomplete_precip_windows";

export type VariableDataGap = {
  variable_key: ScoredVariableKey;
  reason: VariableDataGapReason;
};

export type SharedNormalizedOutput = {
  location: {
    latitude: number;
    longitude: number;
    state_code: string | null;
    region_key: RegionKey;
    local_date: string;
    local_timezone: string;
  };
  context: EngineContext;
  normalized: {
    temperature?: TemperatureNormalized;
    pressure_regime?: VariableState;
    wind_condition?: VariableState;
    light_cloud_condition?: VariableState;
    precipitation_disruption?: VariableState;
    runoff_flow_disruption?: VariableState;
    tide_current_movement?: VariableState;
  };
  /** Variable keys that contributed to scoring */
  available_variables: string[];
  /** Expected-for-context variables not available */
  missing_variables: string[];
  /** Structured gaps for narration / debugging */
  data_gaps: VariableDataGap[];
  reliability: ReliabilityTierNormalized;
};
