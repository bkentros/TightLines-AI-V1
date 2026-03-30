import type { EngineContext, VariableState } from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
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
  if (context === "coastal_flats_estuary") {
    if (mph <= 2) return 0;
    if (mph <= 5) return pieceLinear(mph, 2, 5, 0, 0.6);
    if (mph <= 10) return pieceLinear(mph, 5, 10, 0.6, 0.9);
    if (mph <= 14) return pieceLinear(mph, 10, 14, 0.9, 0.35);
    if (mph <= 18) return pieceLinear(mph, 14, 18, 0.35, -0.45);
    if (mph <= 24) return pieceLinear(mph, 18, 24, -0.45, -1.2);
    return pieceLinear(mph, 24, 35, -1.2, -2);
  }

  const coastal = isCoastalFamilyContext(context);
  if (coastal) {
    if (mph <= 2) return 0.1;
    if (mph <= 5) return pieceLinear(mph, 2, 5, 0.1, 0.8);
    if (mph <= 10) return pieceLinear(mph, 5, 10, 0.8, 1.2);
    if (mph <= 15) return pieceLinear(mph, 10, 15, 1.2, 0.8);
    if (mph <= 20) return pieceLinear(mph, 15, 20, 0.8, 0.1);
    if (mph <= 25) return pieceLinear(mph, 20, 25, 0.1, -0.6);
    if (mph <= 32) return pieceLinear(mph, 25, 32, -0.6, -1.3);
    return pieceLinear(mph, 32, 45, -1.3, -2);
  }

  if (context === "freshwater_lake_pond") {
    if (mph <= 2) return 0.1;
    if (mph <= 5) return pieceLinear(mph, 2, 5, 0.1, 0.6);
    if (mph <= 10) return pieceLinear(mph, 5, 10, 0.6, 1);
    if (mph <= 15) return pieceLinear(mph, 10, 15, 1, 0.4);
    if (mph <= 20) return pieceLinear(mph, 15, 20, 0.4, -0.2);
    if (mph <= 26) return pieceLinear(mph, 20, 26, -0.2, -0.95);
    return pieceLinear(mph, 26, 38, -0.95, -2);
  }

  // river
  if (mph <= 4) return 0;
  if (mph <= 10) return pieceLinear(mph, 4, 10, 0, 0.15);
  if (mph <= 15) return pieceLinear(mph, 10, 15, 0.15, 0);
  if (mph <= 22) return pieceLinear(mph, 15, 22, 0, -0.7);
  return pieceLinear(mph, 22, 35, -0.7, -2);
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
