import type { EngineContext, VariableState } from "../contracts/mod.ts";

/**
 * Cloud-cover / light condition normalizer.
 *
 * Five tiers so the full [-2, +2] score range is reachable in all contexts.
 * Previously max was +1 ("low_light") and the minimum for coastal was 0 —
 * both ceilings that prevented 10.0 scores and compressed the coastal floor.
 *
 * Tier       Cloud %    Freshwater   Coastal
 * glare       < 10 %       -2          -1   (harsh glare, fish deep/spooky)
 * bright     10–25 %       -1          -1   (sunny, fish seek cover)
 * mixed      26–69 %        0           0   (neutral)
 * low_light  70–85 %       +1          +1   (ideal feeding light)
 * heavy_overcast > 85 %   +2          +2   (peak feeding conditions, low light)
 */
export function normalizeLight(
  cloudPct: number | null | undefined,
  context: EngineContext,
): VariableState | null {
  if (cloudPct == null || Number.isNaN(cloudPct)) return null;
  const c = Math.max(0, Math.min(100, cloudPct));

  let label: "glare" | "bright" | "mixed" | "low_light" | "heavy_overcast";
  if (c < 10) label = "glare";
  else if (c <= 25) label = "bright";
  else if (c <= 69) label = "mixed";
  else if (c <= 85) label = "low_light";
  else label = "heavy_overcast";

  const freshwater = context !== "coastal";

  let score: -2 | -1 | 0 | 1 | 2;
  if (label === "glare") {
    // Bright glare is most punishing for freshwater (fish go deep or stop feeding).
    // Coastal fish are somewhat less affected — still negative but only -1.
    score = freshwater ? -2 : -1;
  } else if (label === "bright") {
    score = -1;
  } else if (label === "mixed") {
    score = 0;
  } else if (label === "low_light") {
    score = 1;
  } else {
    // heavy_overcast — genuinely the best light tier for feeding activity
    score = 2;
  }

  return { label, score, detail: `${Math.round(c)}% cloud` };
}
