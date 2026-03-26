import type { EngineContext, VariableState } from "../contracts/mod.ts";
import { clampEngineScore, pieceLinear } from "../score/engineScoreMath.ts";

function windLabel(
  mph: number,
): "calm" | "light" | "moderate" | "strong" | "extreme" {
  if (mph <= 3) return "calm";
  if (mph <= 7) return "light";
  if (mph <= 15) return "moderate";
  if (mph <= 24) return "strong";
  return "extreme";
}

function scoreAtMph(mph: number, context: EngineContext): number {
  const coastal = context === "coastal";

  if (coastal) {
    if (mph <= 3) return 2;
    if (mph <= 7) return pieceLinear(mph, 3, 7, 2, 1);
    if (mph <= 15) return 1;
    if (mph <= 24) return pieceLinear(mph, 15, 24, 1, 0);
    if (mph <= 26) return 0;
    if (mph <= 35) return pieceLinear(mph, 26, 35, 0, -1);
    return pieceLinear(mph, 35, 48, -1, -2);
  }

  if (context === "freshwater_lake_pond") {
    if (mph <= 3) return 2;
    if (mph <= 7) return pieceLinear(mph, 3, 7, 2, 1);
    if (mph <= 15) return pieceLinear(mph, 7, 15, 1, 0);
    if (mph <= 24) return pieceLinear(mph, 15, 24, 0, -1);
    return pieceLinear(mph, 24, 40, -1, -2);
  }

  // river
  if (mph <= 3) return 2;
  if (mph <= 7) return pieceLinear(mph, 3, 7, 2, 0);
  if (mph <= 15) return 0;
  if (mph <= 24) return pieceLinear(mph, 15, 24, 0, -1);
  return pieceLinear(mph, 24, 40, -1, -2);
}

export function normalizeWind(
  windMph: number | null | undefined,
  context: EngineContext,
): VariableState | null {
  if (windMph == null || Number.isNaN(windMph) || windMph < 0) return null;
  const label = windLabel(windMph);
  const score = clampEngineScore(scoreAtMph(windMph, context));
  return { label, score, detail: `${Math.round(windMph)} mph` };
}
