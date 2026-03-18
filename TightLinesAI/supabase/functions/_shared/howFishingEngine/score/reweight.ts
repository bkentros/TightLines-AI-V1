import type { EngineContext, ScoredVariableKey } from "../contracts/mod.ts";
import { BASE_WEIGHTS } from "../config/baseWeights.ts";
import { getMonthModifiers } from "../config/monthModifiers.ts";
import { getRegionModifiers } from "../config/regionModifiers.ts";
import { applyFinalWeightClamp } from "../config/modifierCaps.ts";
import type { RegionKey } from "../contracts/mod.ts";

export type WeightedVariable = {
  key: ScoredVariableKey;
  base: number;
  finalWeight: number;
};

export function activeKeysForContext(ctx: EngineContext): ScoredVariableKey[] {
  if (ctx === "freshwater_lake_pond") {
    return [
      "temperature_condition",
      "pressure_regime",
      "wind_condition",
      "light_cloud_condition",
      "precipitation_disruption",
    ];
  }
  if (ctx === "freshwater_river") {
    return [
      "temperature_condition",
      "pressure_regime",
      "wind_condition",
      "light_cloud_condition",
      "runoff_flow_disruption",
    ];
  }
  return [
    "tide_current_movement",
    "wind_condition",
    "pressure_regime",
    "light_cloud_condition",
    "temperature_condition",
    "precipitation_disruption",
  ];
}

export function computeActiveWeights(
  context: EngineContext,
  region: RegionKey,
  localDate: string,
  availableKeys: Set<string>
): WeightedVariable[] {
  const month = parseInt(localDate.slice(5, 7), 10) || 1;
  const keys = activeKeysForContext(context).filter((k) => availableKeys.has(k));
  const baseMap = BASE_WEIGHTS[context]!;
  const monthMod = getMonthModifiers(context, month);
  const regionMod = getRegionModifiers(context, region);

  const raw: WeightedVariable[] = keys.map((key) => {
    const base = baseMap[key] ?? 0;
    const fw = applyFinalWeightClamp(
      base,
      monthMod[key] ?? 0,
      regionMod[key] ?? 0
    );
    return { key, base, finalWeight: fw };
  });

  const sum = raw.reduce((a, x) => a + x.finalWeight, 0);
  if (sum <= 0) return [];
  return raw.map((x) => ({
    ...x,
    finalWeight: (x.finalWeight / sum) * 100,
  }));
}
