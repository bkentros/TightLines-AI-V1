import type {
  BehaviorProfile,
  FlowBand,
  GaugeFreshness,
  PrimitiveDisplay,
  RawFlowTrendSignal,
  RawRainSignal,
  RawTemperatureTrendSignal,
  RiverRunReasonCode,
  TemperatureSourceType,
} from "../types.ts";
import {
  type FavorabilityResult,
  resolveFavorability,
} from "../metrics/favorability.ts";

export type PushScoreInput = {
  behaviorProfile: BehaviorProfile;
  gaugeFreshness: GaugeFreshness;
  rainSignal: RawRainSignal;
  flowSignal: RawFlowTrendSignal;
  temperatureSignal: RawTemperatureTrendSignal;
  temperatureSourceType: TemperatureSourceType;
  flowBand?: FlowBand;
  measuredWaterTooWarm?: boolean;
  rainReasonCodes?: RiverRunReasonCode[];
  flowReasonCodes?: RiverRunReasonCode[];
  temperatureReasonCodes?: RiverRunReasonCode[];
};

export type PushScoreResult = PrimitiveDisplay & {
  favorability?: FavorabilityResult;
};

export function scorePush(input: PushScoreInput): PushScoreResult {
  if (
    input.gaugeFreshness === "missing" ||
    input.gaugeFreshness === "older_than_24h"
  ) {
    return {
      score: null,
      label: "Unavailable",
      ...pushCopy("Unavailable"),
      reasonCodes: [gaugeReasonCode(input.gaugeFreshness)],
    };
  }

  const favorability = resolveFavorability(input);
  let score = baseScore(favorability.favorabilityLevel);
  const reasonCodes = new Set<RiverRunReasonCode>([
    gaugeReasonCode(input.gaugeFreshness),
    ...(input.rainReasonCodes ?? []),
    ...(input.flowReasonCodes ?? []),
    ...(input.temperatureReasonCodes ?? []),
    ...favorability.reasonCodes,
  ]);

  if (input.flowBand === "normal_fishable" || input.flowBand === "ideal") {
    score += 5;
  }
  if (input.flowBand === "very_high") score -= 10;
  if (input.flowBand === "blown_out") score -= 15;
  if (input.gaugeFreshness === "stale") {
    score -= 10;
    score = Math.min(score, 55);
  }
  if (input.measuredWaterTooWarm) {
    score = Math.min(score, 50);
    reasonCodes.add("temperature_too_warm_cap");
  }

  const finalScore = Math.min(100, Math.max(0, Math.round(score)));
  return {
    score: finalScore,
    label: pushLabel(finalScore),
    ...pushCopy(pushLabel(finalScore)),
    reasonCodes: [...reasonCodes],
    favorability,
  };
}

function baseScore(level: FavorabilityResult["favorabilityLevel"]): number {
  switch (level) {
    case "very_unfavorable":
      return 10;
    case "unfavorable":
      return 25;
    case "neutral":
      return 45;
    case "favorable":
      return 68;
    case "very_favorable":
      return 86;
  }
}

function pushLabel(score: number): string {
  if (score <= 24) return "Weak";
  if (score <= 49) return "Limited";
  if (score <= 69) return "Possible";
  if (score <= 84) return "Strong";
  return "Very strong";
}

function pushCopy(
  label: PrimitiveDisplay["label"],
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  switch (label) {
    case "Weak":
      return {
        headline: "Current movement signal is weak.",
        detail:
          "Recent rain, river trend, temperature trend, and freshness do not show much movement signal.",
        tip:
          "Compare this current movement-signal read with the other primitives separately.",
      };
    case "Limited":
      return {
        headline: "Current movement signal is limited.",
        detail:
          "The current inputs show some movement context, but not a strong signal.",
        tip:
          "Compare this current movement-signal read with the other primitives separately.",
      };
    case "Possible":
      return {
        headline: "Current movement signal is possible.",
        detail:
          "The current inputs are mixed enough to support a moderate movement signal.",
        tip:
          "Compare this current movement-signal read with the other primitives separately.",
      };
    case "Strong":
      return {
        headline: "Current movement signal is strong.",
        detail:
          "Recent rain, river trend, temperature trend, and freshness support a stronger movement signal.",
        tip:
          "Compare this current movement-signal read with the other primitives separately.",
      };
    case "Very strong":
      return {
        headline: "Current movement signal is very strong.",
        detail: "The current inputs line up for a very strong movement signal.",
        tip:
          "Compare this current movement-signal read with the other primitives separately.",
      };
    case "Unavailable":
      return {
        headline: "Push is unavailable without a current gauge read.",
        detail:
          "A usable gauge read is required to describe the current movement signal.",
        tip: "Check again after the next condition refresh.",
      };
    default:
      return {
        headline: "Current movement signal is available.",
        detail: "Current inputs describe movement signal only.",
        tip: "Use other primitives for separate River Run dimensions.",
      };
  }
}

function gaugeReasonCode(freshness: GaugeFreshness): RiverRunReasonCode {
  switch (freshness) {
    case "fresh":
      return "gauge_fresh";
    case "stale":
      return "gauge_stale";
    case "missing":
      return "gauge_missing";
    case "older_than_24h":
      return "gauge_older_than_24h";
  }
}
