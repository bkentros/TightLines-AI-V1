import type { EngineContext } from "../contracts/mod.ts";
import { isCoastalFamilyContext } from "../contracts/context.ts";
import {
  type LightVariableState,
  normalizeLight,
} from "../normalize/normalizeLight.ts";
import { clampEngineScore, pieceLinear } from "../score/engineScoreMath.ts";

export type LightV2Profile =
  | "production_control"
  | "score_only_soft_overcast"
  | "score_only_cold_clear_neutral"
  | "score_only_heavy_overcast_cap"
  | "score_only_combined"
  | "label_or_mode_cleanup_diagnostic";

export type LightV2Options = {
  temperatureBandLabel?: string;
  windMph?: number | null;
};

function labelAndDetail(
  cloudPct: number,
  context: EngineContext,
  temperatureBandLabel?: string,
): Pick<LightVariableState, "label" | "detail"> {
  const production = normalizeLight(cloudPct, context, {
    temperatureBandLabel,
  });
  return {
    label: production?.label ?? "mixed",
    detail: production?.detail ?? `${Math.round(cloudPct)}% cloud`,
  };
}

function isColdOrCool(label: string | undefined): boolean {
  return label === "very_cold" || label === "cool";
}

function isWarmOrHot(label: string | undefined): boolean {
  return label === "warm" || label === "very_warm";
}

function isStrongWind(windMph: number | null | undefined): boolean {
  return windMph != null && Number.isFinite(windMph) && windMph >= 18;
}

function baseTunedScore(
  cloudPct: number,
  context: EngineContext,
  profile: LightV2Profile,
  opts: LightV2Options,
): number {
  const c = Math.max(0, Math.min(100, cloudPct));
  const freshwater = !isCoastalFamilyContext(context);
  const isFlats = context === "coastal_flats_estuary";
  const coldOrCool = isColdOrCool(opts.temperatureBandLabel);
  const warmOrHot = isWarmOrHot(opts.temperatureBandLabel);
  const strongWind = isStrongWind(opts.windMph);

  if (freshwater) {
    if (c <= 25) {
      if (coldOrCool) return 0;
      if (
        profile === "score_only_cold_clear_neutral" ||
        profile === "score_only_combined"
      ) {
        if (warmOrHot) return pieceLinear(c, 0, 25, -0.65, -0.35);
        return pieceLinear(c, 0, 25, -0.35, -0.10);
      }
      return pieceLinear(c, 0, 25, -1.0, -0.55);
    }
    if (c <= 69) {
      if (
        profile === "score_only_soft_overcast" ||
        profile === "score_only_combined"
      ) {
        return pieceLinear(c, 25, 69, -0.25, 0.30);
      }
      return pieceLinear(c, 25, 69, -0.55, 0.55);
    }
    if (c <= 85) {
      if (
        profile === "score_only_soft_overcast" ||
        profile === "score_only_combined"
      ) {
        return pieceLinear(c, 69, 85, 0.30, 0.70);
      }
      return pieceLinear(c, 69, 85, 0.55, 0.95);
    }
    const capProfile = profile === "score_only_heavy_overcast_cap" ||
      profile === "score_only_combined";
    const high = capProfile ? (strongWind ? 0.35 : 0.82) : 1.15;
    const low = capProfile ? 0.70 : 0.95;
    return pieceLinear(c, 85, 100, low, high);
  }

  if (c <= 50) {
    if (isFlats && c <= 20) {
      return pieceLinear(c, 0, 20, -0.35, -0.15);
    }
    return 0;
  }
  if (c <= 75) {
    if (
      profile === "score_only_soft_overcast" ||
      profile === "score_only_combined"
    ) {
      return pieceLinear(c, 50, 75, 0, 0.25);
    }
    return pieceLinear(c, 50, 75, 0, 0.4);
  }
  if (c <= 90) {
    if (
      profile === "score_only_soft_overcast" ||
      profile === "score_only_combined"
    ) {
      return pieceLinear(c, 75, 90, 0.25, 0.60);
    }
    return pieceLinear(c, 75, 90, 0.4, 0.9);
  }
  const capProfile = profile === "score_only_heavy_overcast_cap" ||
    profile === "score_only_combined";
  const high = capProfile ? (strongWind ? 0.20 : 0.68) : 1.05;
  const low = capProfile ? 0.60 : 0.9;
  return pieceLinear(c, 90, 100, low, high);
}

export function normalizeLightV2(
  cloudPct: number | null | undefined,
  context: EngineContext,
  profile: LightV2Profile,
  opts: LightV2Options = {},
): LightVariableState | null {
  if (profile === "production_control") {
    return normalizeLight(cloudPct, context, {
      temperatureBandLabel: opts.temperatureBandLabel,
    });
  }
  if (cloudPct == null || Number.isNaN(cloudPct)) return null;

  const c = Math.max(0, Math.min(100, cloudPct));
  const { label, detail } = labelAndDetail(
    c,
    context,
    opts.temperatureBandLabel,
  );
  const score = clampEngineScore(baseTunedScore(c, context, profile, opts));
  return { label, score, detail };
}
