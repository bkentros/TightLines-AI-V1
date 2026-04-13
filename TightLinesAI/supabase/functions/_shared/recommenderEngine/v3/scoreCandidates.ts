import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./candidates/index.ts";
import { RESOLVED_COLOR_SHADE_POOLS_V3 } from "./colors.ts";
import {
  normalizeLightBucketV3,
  resolveColorDecisionV3,
} from "./colorDecision.ts";
import { buildConditionFeaturesFromAnalysis } from "./buildConditionFeatures.ts";
import {
  clarityProfileFit,
  dailyConditionFitScore,
} from "./archetypeConditionWeights.ts";
import type {
  ArchetypeWaterColumnV3,
  MoodV3,
  PresentationStyleV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3DailyPayload,
  RecommenderV3RankedArchetype,
  RecommenderV3ResolvedProfile,
  RecommenderV3ScoreBreakdown,
  RecommenderV3SeasonalRow,
  ResolvedColorThemeV3,
} from "./contracts.ts";
import type { WaterClarity } from "../contracts/input.ts";

const ARCHETYPE_WATER_COLUMNS: ArchetypeWaterColumnV3[] = [
  "top",
  "shallow",
  "mid",
  "bottom",
];
const MOODS: MoodV3[] = ["negative", "neutral", "active"];
const PRESENTATION_STYLES: PresentationStyleV3[] = [
  "subtle",
  "balanced",
  "bold",
];

type ScoredSelectionCandidate = {
  candidate: RecommenderV3RankedArchetype;
  top3_redundancy_key?: string;
};

function roundScore(value: number): number {
  return Number(value.toFixed(2));
}

function toArchetypeWaterColumn(
  resolved: RecommenderV3ResolvedProfile["likely_water_column_today"],
): ArchetypeWaterColumnV3 {
  switch (resolved) {
    case "top":
    case "high_top":
      return "top";
    case "high":
    case "mid_high":
      return "shallow";
    case "mid":
      return "mid";
    case "mid_low":
    case "low":
    default:
      return "bottom";
  }
}

function toMood(
  postureBand: RecommenderV3ResolvedProfile["daily_posture_band"],
): MoodV3 {
  switch (postureBand) {
    case "suppressed":
      return "negative";
    case "slightly_suppressed":
    case "neutral":
      return "neutral";
    case "slightly_aggressive":
    case "aggressive":
      return "active";
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

function waterColumnFit(
  target: ArchetypeWaterColumnV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  const distance = ordinalDistance(
    ARCHETYPE_WATER_COLUMNS,
    target,
    profile.preferred_water_columns,
  );
  if (distance === 0) return 1.2;
  if (distance === 1) return 0.45;
  return -0.65;
}

function moodFit(
  target: MoodV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  const distance = ordinalDistance(MOODS, target, profile.preferred_moods);
  if (distance === 0) return 1.1;
  if (distance === 1) return 0.35;
  return -0.7;
}

function presentationFit(
  target: PresentationStyleV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  const distance = ordinalDistance(
    PRESENTATION_STYLES,
    target,
    profile.preferred_presentation_styles,
  );
  if (distance === 0) return 1.0;
  if (distance === 1) return 0.35;
  return -0.55;
}

function forageBonusValue(
  row: RecommenderV3SeasonalRow,
  profile: RecommenderV3ArchetypeProfile,
): number {
  if (profile.forage_matches.includes(row.primary_forage)) return 1.5;
  if (
    row.secondary_forage &&
    profile.forage_matches.includes(row.secondary_forage)
  ) return 1.0;
  return 0;
}

function guardrailPenaltyValue(
  profile: RecommenderV3ArchetypeProfile,
  daily: RecommenderV3DailyPayload | undefined,
): number {
  if (!daily) return 0;
  let penalty = 0;
  const isTrueTopwater = profile.tactical_lane === "surface" ||
    profile.tactical_lane === "fly_surface";
  const isSurfaceAdjacentCover =
    profile.id === "hollow_body_frog" || profile.id === "frog_fly";
  const isFastLane = profile.tactical_lane === "surface" ||
    profile.tactical_lane === "fly_surface" ||
    profile.tactical_lane === "reaction_mid_column" ||
    profile.tactical_lane === "pike_big_profile";

  if (!daily.surface_allowed_today && isTrueTopwater) return -100;
  if (daily.suppress_true_topwater && isTrueTopwater) return -100;
  if (daily.surface_window_today === "closed" && isSurfaceAdjacentCover) {
    penalty -= 2.15;
  }
  if (daily.suppress_fast_presentations && isFastLane) penalty -= 0.9;
  if (
    daily.high_visibility_needed_today &&
    profile.preferred_presentation_styles.includes("subtle") &&
    !profile.preferred_presentation_styles.includes("bold")
  ) {
    penalty -= 0.4;
  }
  return penalty;
}

function firstThreeColors(
  theme: ResolvedColorThemeV3,
): [string, string, string] {
  const pool = RESOLVED_COLOR_SHADE_POOLS_V3[theme];
  const a = pool[0] ?? "natural";
  const b = pool[1] ?? pool[0] ?? "natural";
  const c = pool[2] ?? pool[1] ?? pool[0] ?? "natural";
  return [a, b, c];
}

function breakdownEntry(
  code: string,
  value: number,
  detail: string,
): RecommenderV3ScoreBreakdown {
  return {
    code,
    value: roundScore(value),
    detail,
    direction: value < 0 ? "penalty" : "bonus",
  };
}

function scoreProfile(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
  lightLabel: string | null,
  analysis: SharedConditionAnalysis,
): RecommenderV3RankedArchetype {
  const breakdown: RecommenderV3ScoreBreakdown[] = [];

  const features = daily
    ? buildConditionFeaturesFromAnalysis(
      analysis,
      daily,
      clarity,
      seasonal.context,
    )
    : null;

  const targetColumn = toArchetypeWaterColumn(resolved.likely_water_column_today);
  const water_column_fit = roundScore(waterColumnFit(targetColumn, profile));
  breakdown.push(
    breakdownEntry(
      "water_column_fit",
      water_column_fit,
      "Compares today's resolved water column to the archetype's preferred lanes.",
    ),
  );

  const posture_fit = roundScore(
    moodFit(toMood(resolved.daily_posture_band), profile),
  );
  breakdown.push(
    breakdownEntry(
      "posture_fit",
      posture_fit,
      "Matches daily fish willingness (from posture band) to archetype mood.",
    ),
  );

  const presentation_fit_value = roundScore(
    presentationFit(resolved.presentation_presence_today, profile),
  );
  breakdown.push(
    breakdownEntry(
      "presentation_fit",
      presentation_fit_value,
      "Aligns daily presentation presence (subtle/balanced/bold) with the archetype.",
    ),
  );

  const forage_bonus = roundScore(forageBonusValue(seasonal, profile));
  breakdown.push(
    breakdownEntry(
      "forage_bonus",
      forage_bonus,
      "Seasonal primary/secondary forage alignment.",
    ),
  );

  const daily_condition_fit = features
    ? roundScore(
      dailyConditionFitScore(features, profile.tactical_lane, profile.id),
    )
    : 0;
  breakdown.push(
    breakdownEntry(
      "daily_condition_fit",
      daily_condition_fit,
      "Weather and flow features × tactical lane (and small per-id tuning).",
    ),
  );

  const clarity_fit = roundScore(
    clarityProfileFit(clarity, profile.clarity_strengths),
  );
  breakdown.push(
    breakdownEntry(
      "clarity_fit",
      clarity_fit,
      "User water clarity vs archetype clarity strengths.",
    ),
  );

  const guardrail_penalty = roundScore(guardrailPenaltyValue(profile, daily));
  breakdown.push({
    code: "guardrail_penalty",
    value: guardrail_penalty,
    detail: "Hard limits for illegal surface or pace when today's rules forbid them.",
    direction: guardrail_penalty < 0 ? "penalty" : "bonus",
  });

  const score = roundScore(
    water_column_fit +
      posture_fit +
      presentation_fit_value +
      forage_bonus +
      daily_condition_fit +
      clarity_fit +
      guardrail_penalty,
  );

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
    water_column_fit,
    posture_fit,
    presentation_fit: presentation_fit_value,
    forage_bonus,
    daily_condition_fit,
    clarity_fit,
    guardrail_penalty,
    color_theme,
    color_recommendations,
    breakdown,
  };
}

function selectTopThree(
  scored: ScoredSelectionCandidate[],
): RecommenderV3RankedArchetype[] {
  const sorted = [...scored].sort((a, b) =>
    b.candidate.score - a.candidate.score ||
    a.candidate.display_name.localeCompare(b.candidate.display_name)
  );
  const selected: ScoredSelectionCandidate[] = [];
  const usedRedundancyKeys = new Set<string>();

  for (const candidate of sorted) {
    if (selected.length >= 3) break;
    if (
      candidate.top3_redundancy_key &&
      usedRedundancyKeys.has(candidate.top3_redundancy_key)
    ) {
      continue;
    }
    selected.push(candidate);
    if (candidate.top3_redundancy_key) {
      usedRedundancyKeys.add(candidate.top3_redundancy_key);
    }
  }

  for (const candidate of sorted) {
    if (selected.length >= 3) break;
    if (!selected.some((item) => item.candidate.id === candidate.candidate.id)) {
      selected.push(candidate);
    }
  }

  return selected.map((candidate) => candidate.candidate);
}

function assertEligiblePools(seasonal: RecommenderV3SeasonalRow): void {
  if (seasonal.eligible_lure_ids.length < 3) {
    throw new Error(
      `Seasonal row ${seasonal.species} ${seasonal.region_key} m${seasonal.month} ${seasonal.context}: need >= 3 eligible lures`,
    );
  }
  if (seasonal.eligible_fly_ids.length < 3) {
    throw new Error(
      `Seasonal row ${seasonal.species} ${seasonal.region_key} m${seasonal.month} ${seasonal.context}: need >= 3 eligible flies`,
    );
  }
}

export function scoreLureCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
  lightLabel: string | null,
  analysis: SharedConditionAnalysis,
): RecommenderV3RankedArchetype[] {
  assertEligiblePools(seasonal);
  const scored = seasonal.eligible_lure_ids.map((id) => ({
    candidate: scoreProfile(
      LURE_ARCHETYPES_V3[id],
      seasonal,
      resolved,
      daily,
      clarity,
      lightLabel,
      analysis,
    ),
    top3_redundancy_key: LURE_ARCHETYPES_V3[id].top3_redundancy_key,
  }));
  return selectTopThree(scored);
}

export function scoreFlyCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
  lightLabel: string | null,
  analysis: SharedConditionAnalysis,
): RecommenderV3RankedArchetype[] {
  assertEligiblePools(seasonal);
  const scored = seasonal.eligible_fly_ids.map((id) => ({
    candidate: scoreProfile(
      FLY_ARCHETYPES_V3[id],
      seasonal,
      resolved,
      daily,
      clarity,
      lightLabel,
      analysis,
    ),
    top3_redundancy_key: FLY_ARCHETYPES_V3[id].top3_redundancy_key,
  }));
  return selectTopThree(scored);
}
