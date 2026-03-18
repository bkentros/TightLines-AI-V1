/**
 * Scored variable keys by context — ENGINE_REBUILD_MASTER_PLAN § Final scored variables
 */

import type { EngineContext } from "./context.ts";

export type ScoredVariableKey =
  | "temperature_condition"
  | "pressure_regime"
  | "wind_condition"
  | "light_cloud_condition"
  | "precipitation_disruption"
  | "runoff_flow_disruption"
  | "tide_current_movement";

export const SCORED_VARIABLE_KEYS_BY_CONTEXT: Record<
  EngineContext,
  readonly ScoredVariableKey[]
> = {
  freshwater_lake_pond: [
    "temperature_condition",
    "pressure_regime",
    "wind_condition",
    "light_cloud_condition",
    "precipitation_disruption",
  ],
  freshwater_river: [
    "temperature_condition",
    "pressure_regime",
    "wind_condition",
    "light_cloud_condition",
    "runoff_flow_disruption",
  ],
  coastal: [
    "temperature_condition",
    "pressure_regime",
    "wind_condition",
    "light_cloud_condition",
    "tide_current_movement",
    "precipitation_disruption",
  ],
};

export function isScoredVariableKey(x: string): x is ScoredVariableKey {
  const all: ScoredVariableKey[] = [
    "temperature_condition",
    "pressure_regime",
    "wind_condition",
    "light_cloud_condition",
    "precipitation_disruption",
    "runoff_flow_disruption",
    "tide_current_movement",
  ];
  return (all as string[]).includes(x);
}
