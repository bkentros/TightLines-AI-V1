import type { EngineContext, VariableState } from "../contracts/mod.ts";

/**
 * Wind tiers — now includes "calm" (≤3 mph) at the top end so the full
 * [-2, +2] score range is reachable. Previously "light" was the best tier
 * (+1), creating a scoring ceiling that prevented 10.0 scores.
 *
 * calm  ≤ 3 mph  — dead calm, glass water, zero wind drift on presentations
 * light ≤ 7 mph  — ideal for most fishing, easy casting
 * moderate ≤ 15  — manageable; coastal benefits from the chop / moving bait
 * strong ≤ 24    — suppressive across all contexts
 * extreme > 24   — severely limiting
 */
function windLabel(
  mph: number,
): "calm" | "light" | "moderate" | "strong" | "extreme" {
  if (mph <= 3) return "calm";
  if (mph <= 7) return "light";
  if (mph <= 15) return "moderate";
  if (mph <= 24) return "strong";
  return "extreme";
}

export function normalizeWind(
  windMph: number | null | undefined,
  context: EngineContext,
): VariableState | null {
  if (windMph == null || Number.isNaN(windMph) || windMph < 0) return null;
  const label = windLabel(windMph);
  const lake = context === "freshwater_lake_pond";
  const river = context === "freshwater_river";
  const coastal = context === "coastal";

  let score: -2 | -1 | 0 | 1 | 2;

  if (label === "calm") {
    // Dead calm is excellent everywhere.
    // Lake/pond: glassy water, fish actively feeding near surface.
    // River: zero line drift, precise presentations, stealth on approach.
    // Coastal: dead flat water is elite for sight-fishing; tide still moves water.
    score = 2;
  } else if (label === "light") {
    // Light wind is positive for lake and coastal; neutral for river
    // (current matters more than wind for river fishing).
    score = lake ? 1 : coastal ? 1 : 0;
  } else if (label === "moderate") {
    // Coastal: moderate wind churns bait and creates feeding lanes — still positive.
    // Lake/pond and river: workable but not a help.
    score = coastal ? 1 : 0;
  } else if (label === "strong") {
    score = -1;
  } else {
    // extreme
    score = -2;
  }

  return { label, score, detail: `${Math.round(windMph)} mph` };
}
