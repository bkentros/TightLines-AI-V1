import type { EngineContext, VariableState } from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import { clampEngineScore, pieceLinear } from "../score/engineScoreMath.ts";

/** Every `label` value `normalizeLight` can emit today (see assignments below). */
export const LIGHT_LABELS = [
  "glare",
  "bright",
  "mixed",
  "low_light",
  "heavy_overcast",
] as const;

export type LightLabel = (typeof LIGHT_LABELS)[number];

export function isLightLabel(value: unknown): value is LightLabel {
  return typeof value === "string" &&
    (LIGHT_LABELS as readonly string[]).includes(value);
}

export type LightVariableState = VariableState & { label: LightLabel };

/**
 * Cloud-cover / light — tapered piecewise ramps (freshwater penalizes bright sun;
 * coastal neutralizes 0–69% per marine norms).
 *
 * Macro `label` stays stable for tips/timing; `detail` carries % and mixed sub-hint.
 *
 * opts.temperatureBandLabel: when "very_cold" or "cool", bright/clear sky on freshwater
 * is scored neutral (0) rather than negative — cold-water fish are not harmed by sun.
 */
export function normalizeLight(
  cloudPct: number | null | undefined,
  context: EngineContext,
  opts?: { temperatureBandLabel?: string },
): LightVariableState | null {
  if (cloudPct == null || Number.isNaN(cloudPct)) return null;
  const c = Math.max(0, Math.min(100, cloudPct));

  const freshwater = !isCoastalFamilyContext(context);
  const isFlats = context === "coastal_flats_estuary";

  const inColdBand =
    opts?.temperatureBandLabel === "very_cold" ||
    opts?.temperatureBandLabel === "cool";

  let score: number;
  if (freshwater) {
    if (c <= 25) {
      if (inColdBand) {
        // Cold-band neutralization: clear sky is not a glare suppressor in cold water
        score = 0;
      } else {
        score = pieceLinear(c, 0, 25, -1.0, -0.55);
      }
    } else if (c <= 69) {
      score = pieceLinear(c, 25, 69, -0.55, 0.55);
    } else if (c <= 85) {
      score = pieceLinear(c, 69, 85, 0.55, 0.95);
    } else {
      score = pieceLinear(c, 85, 100, 0.95, 1.15);
    }
  } else if (c <= 50) {
    if (isFlats && c <= 20) {
      // Flats-specific glare penalty: shallow clear water makes sun visibility a real issue
      score = pieceLinear(c, 0, 20, -0.35, -0.15);
    } else {
      score = 0;
    }
  } else if (c <= 75) {
    score = pieceLinear(c, 50, 75, 0, 0.4);
  } else if (c <= 90) {
    score = pieceLinear(c, 75, 90, 0.4, 0.9);
  } else {
    score = pieceLinear(c, 90, 100, 0.9, 1.05);
  }

  score = clampEngineScore(score);

  let label: "glare" | "bright" | "mixed" | "low_light" | "heavy_overcast";
  // In cold band, suppress "glare" label even at very low cloud cover — no penalty word
  if (c < 10) label = (freshwater && inColdBand) ? "bright" : "glare";
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

  return { label, score, detail } satisfies LightVariableState;
}
