/**
 * Candidate PierCast v5 presentation rules.
 *
 * Scores remain an internal ranking input. The UI receives a word label and
 * must not render an `x/10` value. This module is intentionally separate from
 * v4 so existing app contracts remain unchanged.
 */

export type PierCastOpportunityLabelV5 =
  | "Prime"
  | "Good"
  | "Fair"
  | "Limited";

export type PierCastSeasonTimingLabelV5 =
  | "Peak window"
  | "In season"
  | "Building"
  | "Tapering"
  | "Outside main window";

export type PierCastSeasonTrendV5 = "building" | "steady" | "fading";

export type PierCastLegacyTimingCodeV5 =
  | "off"
  | "approaching"
  | "peak"
  | "past"
  | "in_season";

/** Seasonal availability is independent from today's opportunity rating. */
export const PIER_CAST_PEAK_WINDOW_MIN_AVAILABILITY = 0.75;
export const PIER_CAST_MAIN_WINDOW_MIN_AVAILABILITY = 0.05;

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
  return "Limited";
}

/**
 * Converts seasonal state to an absolute window plus direction. The result is
 * deliberately independent from today's score: a tapering fishery may still
 * be Prime, Good, or Fair, while a building fishery may still be Limited.
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
  if (
    !regulationOpen || !accessOpen ||
    availability < PIER_CAST_MAIN_WINDOW_MIN_AVAILABILITY
  ) {
    return "Outside main window";
  }
  if (availability >= PIER_CAST_PEAK_WINDOW_MIN_AVAILABILITY) {
    return "Peak window";
  }
  if (trend === "building") return "Building";
  if (trend === "fading") return "Tapering";
  return "In season";
}

/**
 * Preserves the frozen v5 reason-code vocabulary while the 1.18 presentation
 * uses the clearer phase labels above. Older response readers keep seeing the
 * same opaque tokens; only the bundled app copy changes.
 */
export function pierCastLegacyTimingCodeV5(input: {
  availability: number;
  trend: PierCastSeasonTrendV5;
  regulationOpen: boolean;
  accessOpen: boolean;
}): PierCastLegacyTimingCodeV5 | null {
  const label = pierCastSeasonTimingLabelV5(input);
  if (label === null) return null;
  if (label === "Outside main window") return "off";
  if (label === "Peak window") return "peak";
  if (label === "Building") return "approaching";
  if (label === "Tapering") return "past";
  return "in_season";
}

export function pierCastSeasonTimingLabelFromLegacyCodeV5(
  code: string | null | undefined,
): PierCastSeasonTimingLabelV5 | null {
  if (code === "off") return "Outside main window";
  if (code === "peak") return "Peak window";
  if (code === "approaching") return "Building";
  if (code === "past") return "Tapering";
  if (code === "in_season") return "In season";
  return null;
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
