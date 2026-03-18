import type { EngineContext, VariableState } from "../contracts/mod.ts";

function windLabel(mph: number): "light" | "moderate" | "strong" | "extreme" {
  if (mph <= 7) return "light";
  if (mph <= 15) return "moderate";
  if (mph <= 24) return "strong";
  return "extreme";
}

export function normalizeWind(
  windMph: number | null | undefined,
  context: EngineContext
): VariableState | null {
  if (windMph == null || Number.isNaN(windMph) || windMph < 0) return null;
  const label = windLabel(windMph);
  const lake = context === "freshwater_lake_pond";
  const river = context === "freshwater_river";
  const coastal = context === "coastal";

  let score: -2 | -1 | 0 | 1 | 2;
  if (label === "light") score = 0;
  else if (label === "moderate") score = lake || coastal ? 1 : 0;
  else if (label === "strong") score = -1;
  else score = -2;

  return { label, score, detail: `${Math.round(windMph)} mph` };
}
