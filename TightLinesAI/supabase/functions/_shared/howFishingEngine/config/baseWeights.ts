import type { EngineContext, ScoredVariableKey } from "../contracts/mod.ts";

export const BASE_WEIGHTS: Record<
  EngineContext,
  Partial<Record<ScoredVariableKey, number>>
> = {
  freshwater_lake_pond: {
    temperature_condition: 30,
    pressure_regime: 20,
    wind_condition: 18,
    light_cloud_condition: 18,
    precipitation_disruption: 14,
  },
  freshwater_river: {
    temperature_condition: 25,
    pressure_regime: 15,
    wind_condition: 14,
    light_cloud_condition: 14,
    runoff_flow_disruption: 32,
  },
  coastal: {
    tide_current_movement: 30,
    wind_condition: 24,
    pressure_regime: 12,
    light_cloud_condition: 12,
    temperature_condition: 16,
    precipitation_disruption: 6,
  },
};
