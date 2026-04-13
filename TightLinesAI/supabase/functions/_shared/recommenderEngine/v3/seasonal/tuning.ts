import type {
  ArchetypeWaterColumnV3,
  ForageBucketV3,
  MoodV3,
  PresentationStyleV3,
  RecommenderV3ArchetypeProfile,
  SeasonalWaterColumnV3,
} from "../contracts.ts";

export type LegacyWaterColumn = "top" | "shallow" | "mid" | "bottom";
export type LegacyMood = MoodV3;

export type LegacySeasonalSignals = {
  base_water_column: LegacyWaterColumn;
  base_mood: LegacyMood;
  base_presentation_style: PresentationStyleV3;
  primary_forage: ForageBucketV3;
  secondary_forage?: ForageBucketV3;
};

const ARCHETYPE_WATER_COLUMNS: readonly ArchetypeWaterColumnV3[] = [
  "top",
  "shallow",
  "mid",
  "bottom",
] as const;

const MOODS: readonly MoodV3[] = ["negative", "neutral", "active"] as const;

function toArchetypeWaterColumn(
  column: SeasonalWaterColumnV3,
): ArchetypeWaterColumnV3 {
  switch (column) {
    case "top":
      return "top";
    case "high":
      return "shallow";
    case "mid":
      return "mid";
    case "mid_low":
    case "low":
    default:
      return "bottom";
  }
}

function ordinalDistance<T>(
  ordered: readonly T[],
  value: T,
  allowed: readonly T[],
): number | null {
  const current = ordered.indexOf(value);
  if (current === -1) return null;

  let best: number | null = null;
  for (const option of allowed) {
    const idx = ordered.indexOf(option);
    if (idx === -1) continue;
    const distance = Math.abs(current - idx);
    if (best === null || distance < best) best = distance;
  }
  return best;
}

function waterColumnSupport(
  target: SeasonalWaterColumnV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  const distance = ordinalDistance(
    ARCHETYPE_WATER_COLUMNS,
    toArchetypeWaterColumn(target),
    profile.preferred_water_columns,
  );
  if (distance === 0) return 2;
  if (distance === 1) return 1;
  return 0;
}

function moodSupport(
  target: MoodV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  return profile.preferred_moods.includes(target) ? 1 : 0;
}

function presentationSupport(
  target: PresentationStyleV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  return profile.preferred_presentation_styles.includes(target) ? 1 : 0;
}

function forageSupport(
  primary: ForageBucketV3,
  secondary: ForageBucketV3 | undefined,
  profile: RecommenderV3ArchetypeProfile,
): number {
  if (profile.forage_matches.includes(primary)) return 2;
  if (secondary && profile.forage_matches.includes(secondary)) return 1;
  return 0;
}

export function baseSeasonalWaterColumn(
  base: LegacyWaterColumn,
): SeasonalWaterColumnV3 {
  switch (base) {
    case "top":
      return "top";
    case "shallow":
      return "high";
    case "mid":
      return "mid";
    case "bottom":
    default:
      return "low";
  }
}

const SEASONAL_COLUMN_ORDER: readonly SeasonalWaterColumnV3[] = [
  "low",
  "mid_low",
  "mid",
  "high",
  "top",
] as const;

export function shiftSeasonalWaterColumn(
  base: SeasonalWaterColumnV3,
  delta: -2 | -1 | 0 | 1 | 2,
): SeasonalWaterColumnV3 {
  const start = SEASONAL_COLUMN_ORDER.indexOf(base);
  if (start === -1) return base;
  const next = Math.max(
    0,
    Math.min(SEASONAL_COLUMN_ORDER.length - 1, start + delta),
  );
  return SEASONAL_COLUMN_ORDER[next]!;
}

export function buildSeasonalWeights<T extends string>(
  viable: readonly T[],
  primary: readonly T[] | undefined,
  profiles: Record<T, RecommenderV3ArchetypeProfile>,
  signals: LegacySeasonalSignals,
  seasonalColumn: SeasonalWaterColumnV3,
): Partial<Record<T, 1 | 2 | 3>> {
  const weights: Partial<Record<T, 1 | 2 | 3>> = {};
  const primarySet = new Set(primary ?? []);

  for (const id of viable) {
    weights[id] = 1;
  }

  primary?.forEach((id, index) => {
    if (!(id in profiles)) return;
    weights[id] = index === 0 ? 3 : 2;
  });

  const supportThreshold = (primary?.length ?? 0) >= 2 ? 5 : 4;
  const maxBoosts = (primary?.length ?? 0) >= 2 ? 1 : 2;

  const boostable = viable
    .filter((id) => !primarySet.has(id))
    .map((id) => {
      const profile = profiles[id];
      const support =
        waterColumnSupport(seasonalColumn, profile) +
        moodSupport(signals.base_mood, profile) +
        presentationSupport(signals.base_presentation_style, profile) +
        forageSupport(
          signals.primary_forage,
          signals.secondary_forage,
          profile,
        );
      return { id, support, name: profile.display_name };
    })
    .filter((entry) => entry.support >= supportThreshold)
    .sort((a, b) => b.support - a.support || a.name.localeCompare(b.name))
    .slice(0, maxBoosts);

  for (const entry of boostable) {
    weights[entry.id] = 2;
  }

  return weights;
}
