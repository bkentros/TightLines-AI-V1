import type { EngineContext, ScoredVariableKey } from "../contracts/mod.ts";

export const BASE_WEIGHTS: Record<
  EngineContext,
  Partial<Record<ScoredVariableKey, number>>
> = {
  freshwater_lake_pond: {
    temperature_condition: 30,
    pressure_regime: 25,
    wind_condition: 18,
    light_cloud_condition: 17,
    precipitation_disruption: 10,
  },
  freshwater_river: {
    temperature_condition: 24,
    pressure_regime: 20,
    wind_condition: 12,
    light_cloud_condition: 14,
    runoff_flow_disruption: 30,
  },
  coastal: {
    tide_current_movement: 28,
    wind_condition: 22,
    pressure_regime: 16,
    light_cloud_condition: 12,
    temperature_condition: 14,
    precipitation_disruption: 8,
  },
};
