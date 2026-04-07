import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./candidates/index.ts";
import { RESOLVED_COLOR_SHADE_POOLS_V3 } from "./colors.ts";
import { normalizeLightBucketV3, resolveColorDecisionV3 } from "./colorDecision.ts";
import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  MoodV3,
  PresentationStyleV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3RankedArchetype,
  RecommenderV3ResolvedProfile,
  RecommenderV3ScoreBreakdown,
  RecommenderV3SeasonalRow,
  ResolvedColorThemeV3,
  WaterColumnV3,
} from "./contracts.ts";
import type { WaterClarity } from "../contracts/input.ts";

const WATER_COLUMNS: WaterColumnV3[] = ["top", "shallow", "mid", "bottom"];
const MOODS: MoodV3[] = ["negative", "neutral", "active"];
const PRESENTATION_STYLES: PresentationStyleV3[] = ["subtle", "balanced", "bold"];
function roundScore(value: number): number {
  return Number(value.toFixed(2));
}

function ordinalDistance<T>(ordered: readonly T[], value: T, allowed: readonly T[]): number | null {
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

function waterColumnComponent(target: WaterColumnV3, profile: RecommenderV3ArchetypeProfile): number {
  const distance = ordinalDistance(WATER_COLUMNS, target, profile.preferred_water_columns);
  if (distance === 0) return 0.7;
  if (distance === 1) return 0.35;
  return 0;
}

function moodComponent(target: MoodV3, profile: RecommenderV3ArchetypeProfile): number {
  const distance = ordinalDistance(MOODS, target, profile.preferred_moods);
  if (distance === 0) return 0.7;
  if (distance === 1) return 0.35;
  return 0;
}

function presentationComponent(
  target: PresentationStyleV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  const distance = ordinalDistance(PRESENTATION_STYLES, target, profile.preferred_presentation_styles);
  if (distance === 0) return 0.6;
  if (distance === 1) return 0.3;
  return 0;
}

function forageBonusValue(
  row: RecommenderV3SeasonalRow,
  profile: RecommenderV3ArchetypeProfile,
): number {
  if (profile.forage_matches.includes(row.primary_forage)) return 1.5;
  if (row.secondary_forage && profile.forage_matches.includes(row.secondary_forage)) return 1.0;
  return 0;
}

function firstThreeColors(theme: ResolvedColorThemeV3): [string, string, string] {
  const pool = RESOLVED_COLOR_SHADE_POOLS_V3[theme];
  const a = pool[0] ?? "natural";
  const b = pool[1] ?? pool[0] ?? "natural";
  const c = pool[2] ?? pool[1] ?? pool[0] ?? "natural";
  return [a, b, c];
}

/** Not in primary list → tier penalty. Primary list order: 0 = +1.5, 1 = +0.75, 2+ = 0. */
const TIER_PENALTY = 0.8;

function seasonalPriorityBonus(
  id: string,
  primaryList: readonly string[] | undefined,
): number {
  if (!primaryList || primaryList.length === 0) return 0;
  const index = (primaryList as readonly string[]).indexOf(id);
  if (index === -1) return -TIER_PENALTY;
  if (index === 0) return 1.5;
  if (index === 1) return 0.75;
  return 0;
}

function scoreProfile(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  clarity: WaterClarity,
  lightLabel: string | null,
  priorityBonus: number,
): RecommenderV3RankedArchetype {
  const breakdown: RecommenderV3ScoreBreakdown[] = [];

  const seasonal_baseline = roundScore(
    6.8 +
      waterColumnComponent(seasonal.base_water_column, profile) +
      moodComponent(seasonal.base_mood, profile) +
      presentationComponent(seasonal.base_presentation_style, profile) +
      priorityBonus,
  );
  breakdown.push({
    code: "seasonal_baseline",
    value: seasonal_baseline,
    detail: "Seasonal fit stays intentionally tight so daily conditions can reshuffle the pool.",
  });

  const daily_modifier = roundScore(
    (ordinalDistance(WATER_COLUMNS, resolved.final_water_column, profile.preferred_water_columns) === 0
      ? 0.75
      : ordinalDistance(WATER_COLUMNS, resolved.final_water_column, profile.preferred_water_columns) === 1
      ? 0.35
      : -0.5) +
      (ordinalDistance(MOODS, resolved.final_mood, profile.preferred_moods) === 0
        ? 1.0
        : ordinalDistance(MOODS, resolved.final_mood, profile.preferred_moods) === 1
        ? 0.5
        : -0.75) +
      (ordinalDistance(
          PRESENTATION_STYLES,
          resolved.final_presentation_style,
          profile.preferred_presentation_styles,
        ) === 0
        ? 0.75
        : ordinalDistance(
            PRESENTATION_STYLES,
            resolved.final_presentation_style,
            profile.preferred_presentation_styles,
          ) === 1
        ? 0.35
        : -0.5),
  );
  breakdown.push({
    code: "daily_modifier",
    value: daily_modifier,
    detail: "Daily conditions determine whether this archetype moves up, down, or stays in place today.",
  });

  const clarity_modifier = roundScore(
    profile.clarity_strengths.includes(clarity)
      ? 0.9
      : -0.6,
  );
  breakdown.push({
    code: "clarity_modifier",
    value: clarity_modifier,
    detail: "Clarity fine-tunes how visible and assertive this archetype should be.",
  });

  const forage_bonus = roundScore(forageBonusValue(seasonal, profile));
  breakdown.push({
    code: "forage_bonus",
    value: forage_bonus,
    detail: "Forage bonus keeps the recommendation tied to likely prey for the month and region.",
  });

  const score = roundScore(seasonal_baseline + daily_modifier + clarity_modifier + forage_bonus);
  const color_theme = resolveColorDecisionV3(
    clarity,
    normalizeLightBucketV3(lightLabel),
  ).color_theme;
  const color_recommendations = firstThreeColors(color_theme);

  return {
    id: profile.id,
    display_name: profile.display_name,
    gear_mode: profile.gear_mode,
    family_key: profile.family_key,
    tactical_lane: profile.tactical_lane,
    score,
    seasonal_baseline,
    daily_modifier,
    clarity_modifier,
    forage_bonus,
    color_theme,
    color_recommendations,
    breakdown,
  };
}

function selectTopThree(
  scored: RecommenderV3RankedArchetype[],
  seasonalOrder: readonly (LureArchetypeIdV3 | FlyArchetypeIdV3)[],
): RecommenderV3RankedArchetype[] {
  const orderIndex = new Map(seasonalOrder.map((id, index) => [id, index]));
  const sorted = [...scored].sort((a, b) =>
    b.score - a.score ||
    (orderIndex.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (orderIndex.get(b.id) ?? Number.MAX_SAFE_INTEGER) ||
    a.display_name.localeCompare(b.display_name)
  );
  const selected: RecommenderV3RankedArchetype[] = [];

  while (selected.length < 3 && sorted.length > 0) {
    const top = sorted[0]!;
    const nearBand = sorted.filter((candidate) => top.score - candidate.score <= 0.5);
    const usedLanes = new Set(selected.map((candidate) => candidate.tactical_lane));
    const usedFamilies = new Set(selected.map((candidate) => candidate.family_key));
    const preferred =
      nearBand.find((candidate) =>
        !usedLanes.has(candidate.tactical_lane) && !usedFamilies.has(candidate.family_key)
      ) ??
      nearBand.find((candidate) => !usedLanes.has(candidate.tactical_lane)) ??
      top;

    selected.push(preferred);
    const index = sorted.findIndex((candidate) => candidate.id === preferred.id);
    if (index >= 0) sorted.splice(index, 1);
  }

  return selected;
}

export function scoreLureCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  clarity: WaterClarity,
  lightLabel: string | null,
): RecommenderV3RankedArchetype[] {
  const scored = seasonal.viable_lure_archetypes.map((id) => {
    const bonus = seasonalPriorityBonus(id, seasonal.primary_lure_archetypes);
    return scoreProfile(LURE_ARCHETYPES_V3[id], seasonal, resolved, clarity, lightLabel, bonus);
  });
  return selectTopThree(scored, seasonal.viable_lure_archetypes);
}

export function scoreFlyCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  clarity: WaterClarity,
  lightLabel: string | null,
): RecommenderV3RankedArchetype[] {
  const scored = seasonal.viable_fly_archetypes.map((id) => {
    const bonus = seasonalPriorityBonus(id, seasonal.primary_fly_archetypes);
    return scoreProfile(FLY_ARCHETYPES_V3[id], seasonal, resolved, clarity, lightLabel, bonus);
  });
  return selectTopThree(scored, seasonal.viable_fly_archetypes);
}
