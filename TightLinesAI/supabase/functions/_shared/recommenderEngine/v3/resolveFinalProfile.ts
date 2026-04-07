import type {
  MoodV3,
  PresentationStyleV3,
  RecommenderV3DailyPayload,
  RecommenderV3ResolvedProfile,
  RecommenderV3SeasonalRow,
  WaterColumnV3,
} from "./contracts.ts";
import type { WaterClarity } from "../contracts/input.ts";

const WATER_COLUMNS: WaterColumnV3[] = ["top", "shallow", "mid", "bottom"];
const MOODS: MoodV3[] = ["negative", "neutral", "active"];
const PRESENTATION_STYLES: PresentationStyleV3[] = ["subtle", "balanced", "bold"];

function shiftOrdinal<T>(ordered: readonly T[], value: T, delta: number): T {
  const current = ordered.indexOf(value);
  const next = Math.max(0, Math.min(ordered.length - 1, current + delta));
  return ordered[next]!;
}

function resolveMoodDelta(nudge: RecommenderV3DailyPayload["mood_nudge"]): number {
  switch (nudge) {
    case "down_1": return -1;
    case "up_1": return 1;
    case "up_2": return 2;
    case "neutral":
    default: return 0;
  }
}

function resolveWaterColumnDelta(
  nudge: RecommenderV3DailyPayload["water_column_nudge"],
): number {
  switch (nudge) {
    case "higher_1": return -1;
    case "lower_1": return 1;
    case "neutral":
    default: return 0;
  }
}

function resolvePresentationDelta(
  nudge: RecommenderV3DailyPayload["presentation_nudge"],
): number {
  switch (nudge) {
    case "bolder": return 1;
    case "subtler": return -1;
    case "neutral":
    default: return 0;
  }
}

/**
 * The resolver intentionally makes only bounded moves.
 * Water column can move one step. Mood can move up to two. Presentation style
 * stays seasonal-first, but gives a slightly stronger voice to aligned daily cues
 * before clarity floor/ceiling is applied.
 */
export function resolveFinalProfileV3(
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
): RecommenderV3ResolvedProfile {
  let final_water_column = shiftOrdinal(
    WATER_COLUMNS,
    seasonal.base_water_column,
    resolveWaterColumnDelta(daily.water_column_nudge),
  );
  // Daily conditions can open fish up, but V3 should not let a normal shallow
  // seasonal lane jump all the way into a true top-oriented profile.
  if (final_water_column === "top" && seasonal.base_water_column !== "top") {
    final_water_column = "shallow";
  }

  const final_mood = shiftOrdinal(
    MOODS,
    seasonal.base_mood,
    resolveMoodDelta(daily.mood_nudge),
  );

  const seasonalPresentationIndex = PRESENTATION_STYLES.indexOf(seasonal.base_presentation_style);
  const dailyPresentationIndex = PRESENTATION_STYLES.indexOf(
    shiftOrdinal(
      PRESENTATION_STYLES,
      seasonal.base_presentation_style,
      resolvePresentationDelta(daily.presentation_nudge),
    ),
  );
  const presentationDelta = Math.abs(dailyPresentationIndex - seasonalPresentationIndex);
  const dailyWeight = presentationDelta === 0 ? 0.35 : 0.48;
  let blendedPresentationIndex = Math.round(
    (1 - dailyWeight) * seasonalPresentationIndex + dailyWeight * dailyPresentationIndex,
  );
  blendedPresentationIndex = Math.max(0, Math.min(PRESENTATION_STYLES.length - 1, blendedPresentationIndex));

  if (clarity === "dirty" && blendedPresentationIndex < 1) {
    blendedPresentationIndex = 1;
  }
  if (clarity === "clear" && blendedPresentationIndex === 2) {
    const seasonalBold = seasonal.base_presentation_style === "bold";
    const dailyBold = dailyPresentationIndex === 2;
    if (!(seasonalBold && dailyBold)) {
      blendedPresentationIndex = 1;
    }
  }

  const final_presentation_style = PRESENTATION_STYLES[blendedPresentationIndex]!;

  return {
    final_water_column,
    final_mood,
    final_presentation_style,
    primary_forage: seasonal.primary_forage,
    secondary_forage: seasonal.secondary_forage,
  };
}
