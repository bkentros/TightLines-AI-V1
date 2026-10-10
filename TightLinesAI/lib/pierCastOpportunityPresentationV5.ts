/**
 * Candidate PierCast v5 presentation rules.
 *
 * Scores remain an internal ranking input. The UI receives a word label and
 * must not render an `x/10` value. This module is intentionally separate from
 * v4 so existing app contracts remain unchanged.
 */

export type PierCastOpportunityLabelV5 = "Prime" | "Good" | "Fair" | "Poor";

export type PierCastSeasonTimingLabelV5 =
  | "Peak season"
  | "In season"
  | "Approaching peak"
  | "Past peak"
  | "Off season";

export type PierCastSeasonTrendV5 = "building" | "steady" | "fading";

/** Matches the existing internal opportunity rubric while using UI language. */
export function pierCastOpportunityLabelV5(
  internalScore: number,
): PierCastOpportunityLabelV5 | null {
  if (
    !Number.isFinite(internalScore) || internalScore < 1 || internalScore > 10
  ) {
    return null;
  }
  if (internalScore > 8) return "Prime";
  if (internalScore > 6) return "Good";
  if (internalScore > 4) return "Fair";
  return "Poor";
}

/**
 * Converts seasonal state to concrete timing language. "Shoulder" is not a
 * permitted output because it does not tell an angler whether a season is
 * arriving or leaving.
 */
export function pierCastSeasonTimingLabelV5(input: {
  availability: number;
  trend: PierCastSeasonTrendV5;
  regulationOpen: boolean;
  accessOpen: boolean;
}): PierCastSeasonTimingLabelV5 | null {
  const { availability, trend, regulationOpen, accessOpen } = input;
  if (!Number.isFinite(availability) || availability < 0 || availability > 1) {
    return null;
  }
  if (!regulationOpen || !accessOpen || availability < 0.05) {
    return "Off season";
  }
  if (availability >= 0.85) return "Peak season";
  if (trend === "building") return "Approaching peak";
  if (trend === "fading") return "Past peak";
  return "In season";
}

/** Angler-facing projection: deliberately contains no numeric score field. */
export function pierCastOpportunityPresentationV5(input: {
  internalScore: number;
  availability: number;
  trend: PierCastSeasonTrendV5;
  regulationOpen: boolean;
  accessOpen: boolean;
}): Readonly<{
  label: PierCastOpportunityLabelV5 | null;
  timing: PierCastSeasonTimingLabelV5 | null;
}> {
  return {
    label: pierCastOpportunityLabelV5(input.internalScore),
    timing: pierCastSeasonTimingLabelV5(input),
  };
}
