import type { WaterClarity } from "../contracts/input.ts";
import type { ResolvedColorThemeV3 } from "./contracts.ts";

export const LIGHT_BUCKETS_V3 = [
  "bright_glare",
  "mixed",
  "low_light_overcast",
] as const;

export type LightBucketV3 = (typeof LIGHT_BUCKETS_V3)[number];

export type ResolvedColorDecisionV3 = {
  color_theme: ResolvedColorThemeV3;
  water_clarity: WaterClarity;
  light_bucket: LightBucketV3;
  reason_code:
    | "clear_bright_natural"
    | "clear_mixed_natural"
    | "clear_low_dark"
    | "stained_bright_dark"
    | "stained_mixed_dark"
    | "stained_low_bright"
    | "dirty_bright_dark"
    | "dirty_mixed_bright"
    | "dirty_low_bright";
};

const COLOR_MATRIX: Record<WaterClarity, Record<LightBucketV3, ResolvedColorDecisionV3["reason_code"]>> = {
  clear: {
    bright_glare: "clear_bright_natural",
    mixed: "clear_mixed_natural",
    low_light_overcast: "clear_low_dark",
  },
  stained: {
    bright_glare: "stained_bright_dark",
    mixed: "stained_mixed_dark",
    low_light_overcast: "stained_low_bright",
  },
  dirty: {
    bright_glare: "dirty_bright_dark",
    mixed: "dirty_mixed_bright",
    low_light_overcast: "dirty_low_bright",
  },
};

function colorThemeFromReasonCode(
  reasonCode: ResolvedColorDecisionV3["reason_code"],
): ResolvedColorThemeV3 {
  if (reasonCode.endsWith("_natural")) return "natural";
  if (reasonCode.endsWith("_dark")) return "dark";
  return "bright";
}

export function normalizeLightBucketV3(lightLabel: string | null): LightBucketV3 {
  switch (lightLabel) {
    case "bright":
    case "glare":
      return "bright_glare";
    case "low_light":
    case "heavy_overcast":
      return "low_light_overcast";
    case "mixed":
    case "mixed_sky":
    default:
      return "mixed";
  }
}

export function resolveColorDecisionV3(
  water_clarity: WaterClarity,
  light_bucket: LightBucketV3,
): ResolvedColorDecisionV3 {
  const reason_code = COLOR_MATRIX[water_clarity][light_bucket];
  return {
    color_theme: colorThemeFromReasonCode(reason_code),
    water_clarity,
    light_bucket,
    reason_code,
  };
}
