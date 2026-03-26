import type { EngineContext, VariableState } from "../contracts/mod.ts";
import { clampEngineScore, pieceLinear } from "../score/engineScoreMath.ts";

/**
 * Cloud-cover / light — tapered piecewise ramps (freshwater penalizes bright sun;
 * coastal neutralizes 0–69% per marine norms).
 *
 * Macro `label` stays stable for tips/timing; `detail` carries % and mixed sub-hint.
 */
export function normalizeLight(
  cloudPct: number | null | undefined,
  context: EngineContext,
): VariableState | null {
  if (cloudPct == null || Number.isNaN(cloudPct)) return null;
  const c = Math.max(0, Math.min(100, cloudPct));

  const freshwater = context !== "coastal";

  let score: number;
  if (freshwater) {
    if (c <= 25) {
      score = pieceLinear(c, 0, 25, -1.15, -0.72);
    } else if (c <= 69) {
      score = pieceLinear(c, 25, 69, -0.72, 0.72);
    } else if (c <= 85) {
      score = pieceLinear(c, 69, 85, 0.72, 1.35);
    } else {
      score = pieceLinear(c, 85, 100, 1.35, 2);
    }
  } else if (c <= 69) {
    score = 0;
  } else if (c <= 85) {
    // ~70% remains a clear low-light helper on the coast (legacy +1 tier center)
    score = pieceLinear(c, 69, 85, 0.92, 1.35);
  } else {
    score = pieceLinear(c, 85, 100, 1.35, 2);
  }

  score = clampEngineScore(score);

  let label: "glare" | "bright" | "mixed" | "low_light" | "heavy_overcast";
  if (c < 10) label = "glare";
  else if (c <= 25) label = "bright";
  else if (c <= 69) label = "mixed";
  else if (c <= 85) label = "low_light";
  else label = "heavy_overcast";

  let mixedHint = "";
  if (label === "mixed") {
    if (c < 40) mixedHint = "mixed_thin_cloud";
    else if (c < 55) mixedHint = "mixed_mid_cloud";
    else mixedHint = "mixed_heavy_cloud";
  }

  const rounded = Math.round(c);
  const detail = mixedHint
    ? `${rounded}% cloud — ${mixedHint}`
    : `${rounded}% cloud`;

  return { label, score, detail };
}
