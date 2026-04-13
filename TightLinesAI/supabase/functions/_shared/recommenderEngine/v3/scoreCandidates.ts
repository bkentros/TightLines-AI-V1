import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./candidates/index.ts";
import { RESOLVED_COLOR_SHADE_POOLS_V3 } from "./colors.ts";
import {
  normalizeLightBucketV3,
  resolveColorDecisionV3,
} from "./colorDecision.ts";
import type {
  ArchetypeWaterColumnV3,
  FlyArchetypeIdV3,
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

function isTrueTopwaterLure(profile: RecommenderV3ArchetypeProfile): boolean {
  return profile.gear_mode === "lure" && profile.tactical_lane === "surface";
}

function isSurfaceAdjacentCoverLure(
  profile: RecommenderV3ArchetypeProfile,
): boolean {
  return profile.id === "hollow_body_frog";
}

function isSpringSouthernFrogWindow(
  seasonal: RecommenderV3SeasonalRow,
  profile: RecommenderV3ArchetypeProfile,
): boolean {
  return (
    profile.id === "hollow_body_frog" &&
    seasonal.context === "freshwater_lake_pond" &&
    (seasonal.month === 4 || seasonal.month === 5) &&
    (
      seasonal.region_key === "florida" ||
      seasonal.region_key === "gulf_coast" ||
      seasonal.region_key === "southeast_atlantic" ||
      seasonal.region_key === "south_central"
    )
  );
}

function largemouthSurfaceFlyAdjustmentValue(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
): number {
  if (!daily) return 0;
  if (seasonal.species !== "largemouth_bass") return 0;
  if (profile.tactical_lane !== "fly_surface") return 0;

  const surfaceWindow = daily.surface_window_today;
  if (surfaceWindow === "closed") return 0;

  const upperColumnOpen = resolved.likely_water_column_today !== "mid_low" &&
    resolved.likely_water_column_today !== "low";
  const subtlePresentation = resolved.presentation_presence_today === "subtle";
  const balancedPresentation = resolved.presentation_presence_today === "balanced";
  const neutralPosture = resolved.daily_posture_band === "neutral";
  const slightlyAggressivePosture =
    resolved.daily_posture_band === "slightly_aggressive";
  const aggressivePosture = resolved.daily_posture_band === "aggressive";

  if (!upperColumnOpen) return -0.35;

  if (profile.id === "popper_fly") {
    if (subtlePresentation) return clarity === "clear" ? -1.1 : -0.8;
    if (neutralPosture && clarity === "clear") return -0.65;
    if (
      surfaceWindow === "rippled" &&
      clarity !== "clear" &&
      (aggressivePosture || slightlyAggressivePosture)
    ) {
      return 0.35;
    }
    if (
      surfaceWindow === "clean" &&
      clarity !== "dirty" &&
      balancedPresentation &&
      slightlyAggressivePosture
    ) {
      return 0.15;
    }
    return -0.15;
  }

  if (profile.id === "frog_fly") {
    if (clarity === "clear" && subtlePresentation) return -1.0;
    if (clarity === "clear" && neutralPosture) return -0.6;
    if (seasonal.context === "freshwater_river" && clarity === "clear") return -0.4;
    if (
      surfaceWindow === "rippled" &&
      clarity !== "clear" &&
      !subtlePresentation
    ) {
      return 0.25;
    }
    if (aggressivePosture || slightlyAggressivePosture) return 0.15;
    return -0.1;
  }

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
  if (daily.surface_window_today === "closed" && isSurfaceAdjacentCover) penalty -= 2.15;
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

function surfaceWindowBonusValue(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
): number {
  if (!daily) return 0;

  const isTopwaterLure = isTrueTopwaterLure(profile);
  const isFrogLure = isSurfaceAdjacentCoverLure(profile);
  if (!isTopwaterLure && !isFrogLure) return 0;

  const surfaceWindow = daily.surface_window_today;
  const surfaceOpen = surfaceWindow !== "closed";
  const cleanSurfaceWindow = surfaceWindow === "clean";
  const rippledSurfaceWindow = surfaceWindow === "rippled";
  const upperColumnOpen = resolved.likely_water_column_today !== "mid_low" &&
    resolved.likely_water_column_today !== "low";
  const neutralPosture = resolved.daily_posture_band === "neutral";
  const aggressivePosture = resolved.daily_posture_band === "aggressive";
  const slightlyAggressivePosture =
    resolved.daily_posture_band === "slightly_aggressive";
  const subtlePresentation = resolved.presentation_presence_today === "subtle";
  const balancedPresentation = resolved.presentation_presence_today === "balanced";
  const boldPresentation = resolved.presentation_presence_today === "bold";

  if (isSpringSouthernFrogWindow(seasonal, profile)) {
    if (!surfaceOpen || (!aggressivePosture && !slightlyAggressivePosture)) {
      return -1.25;
    }
    if (rippledSurfaceWindow) return aggressivePosture ? 1.25 : 1.0;
    return aggressivePosture ? 1.05 : 0.8;
  }

  if (!surfaceOpen || !upperColumnOpen) return 0;

  if (isTopwaterLure) {
    if (profile.id === "buzzbait") {
      if (rippledSurfaceWindow) {
        if (aggressivePosture) return clarity === "dirty" ? 1.45 : 1.25;
        if (slightlyAggressivePosture) return clarity === "clear" ? 0.35 : 1.0;
        if (neutralPosture && clarity !== "clear" && !subtlePresentation) {
          return 0.35;
        }
        return 0;
      }
      if (cleanSurfaceWindow && aggressivePosture && clarity !== "clear") {
        return 0.55;
      }
      return 0;
    }

    if (profile.id === "prop_bait") {
      if (clarity === "dirty") return 0;
      if (cleanSurfaceWindow) {
        if (slightlyAggressivePosture) {
          return subtlePresentation ? 1.25 : 1.1;
        }
        if (neutralPosture) {
          return subtlePresentation || balancedPresentation ? 1.0 : 0.65;
        }
        if (aggressivePosture) return balancedPresentation ? 0.75 : 0.55;
        return 0;
      }
      if (rippledSurfaceWindow) {
        if (slightlyAggressivePosture && balancedPresentation && clarity === "stained") {
          return 0.25;
        }
        if (neutralPosture && subtlePresentation && clarity === "stained") return 0.15;
      }
      return 0;
    }

    if (profile.id === "walking_topwater") {
      if (clarity === "dirty") return 0;
      if (cleanSurfaceWindow) {
        if (aggressivePosture) return clarity === "clear" ? 1.4 : 1.25;
        if (slightlyAggressivePosture) return clarity === "clear" ? 1.1 : 0.95;
        if (neutralPosture && !subtlePresentation) {
          return clarity === "clear" ? 0.65 : 0.5;
        }
        return 0;
      }
      if (rippledSurfaceWindow) {
        if (aggressivePosture) return clarity === "clear" ? 0.85 : 0.75;
        if (slightlyAggressivePosture) return clarity === "clear" ? 0.65 : 0.55;
        if (neutralPosture && clarity === "stained" && boldPresentation) return 0.25;
        return 0;
      }
      return 0;
    }

    if (profile.id === "popping_topwater") {
      if (cleanSurfaceWindow) {
        if (aggressivePosture) return clarity === "dirty" ? 0.95 : 0.8;
        if (slightlyAggressivePosture) return clarity === "dirty" ? 0.85 : 0.7;
        if (neutralPosture && !subtlePresentation) {
          return clarity === "clear" ? 0.35 : 0.55;
        }
        return 0;
      }
      if (rippledSurfaceWindow) {
        if (aggressivePosture) return clarity === "dirty" ? 1.1 : 0.9;
        if (slightlyAggressivePosture) return clarity === "dirty" ? 1.0 : 0.8;
        if (neutralPosture && !subtlePresentation) {
          return clarity === "clear" ? 0.25 : 0.45;
        }
      }
      return 0;
    }

    if (rippledSurfaceWindow) {
      if (aggressivePosture) return 0.9;
      if (slightlyAggressivePosture) return 0.7;
      if (neutralPosture && !subtlePresentation) return 0.35;
      return 0;
    }
    if (aggressivePosture) return 0.8;
    if (slightlyAggressivePosture) return 0.6;
    if (neutralPosture && !subtlePresentation) return 0.25;
    return 0;
  }

  if (isFrogLure) {
    if (rippledSurfaceWindow) {
      if (aggressivePosture) return 0.95;
      if (slightlyAggressivePosture) return 0.75;
      if (neutralPosture && !subtlePresentation && clarity !== "clear") return 0.3;
      return 0;
    }
    if (aggressivePosture) return 0.75;
    if (slightlyAggressivePosture) return 0.55;
    if (neutralPosture && seasonal.month >= 6 && !subtlePresentation && clarity !== "clear") {
      return 0.2;
    }
  }

  return 0;
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

function scoreProfile(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
  lightLabel: string | null,
  seasonalWeight: number,
): RecommenderV3RankedArchetype {
  const breakdown: RecommenderV3ScoreBreakdown[] = [];
  const seasonal_weight = seasonalWeight * 2;
  breakdown.push({
    code: "seasonal_weight",
    value: seasonal_weight,
    detail:
      "Seasonal row weighting stays the primary driver of what belongs at the top today.",
  });

  const targetColumn = toArchetypeWaterColumn(resolved.likely_water_column_today);
  const water_column_fit = roundScore(waterColumnFit(targetColumn, profile));
  breakdown.push({
    code: "water_column_fit",
    value: water_column_fit,
    detail:
      "Water-column fit compares the resolved likely bite lane today to the archetype's natural lane.",
  });

  const posture_fit = roundScore(
    moodFit(toMood(resolved.daily_posture_band), profile),
  );
  breakdown.push({
    code: "posture_fit",
    value: posture_fit,
    detail:
      "Posture fit checks whether the archetype matches today's suppression or aggression level.",
  });

  const presentation_fit_value = roundScore(
    presentationFit(resolved.presentation_presence_today, profile),
  );
  breakdown.push({
    code: "presentation_fit",
    value: presentation_fit_value,
    detail:
      "Presentation fit checks whether the archetype naturally matches today's subtle, balanced, or bold look.",
  });

  const forage_bonus = roundScore(forageBonusValue(seasonal, profile));
  breakdown.push({
    code: "forage_bonus",
    value: forage_bonus,
    detail:
      "Forage bonus keeps the recommendation tied to likely prey for the season and region.",
  });

  const surface_window_bonus = roundScore(
    surfaceWindowBonusValue(profile, seasonal, resolved, daily, clarity),
  );
  breakdown.push({
    code: "surface_window_bonus",
    value: surface_window_bonus,
    detail:
      "Surface-window bonus promotes topwater only when today's surface window is either clean or lightly rippled, then differentiates which style of topwater actually fits that specific window.",
  });

  const largemouth_surface_fly_adjustment = roundScore(
    largemouthSurfaceFlyAdjustmentValue(profile, seasonal, resolved, daily, clarity),
  );
  breakdown.push({
    code: "largemouth_surface_fly_adjustment",
    value: largemouth_surface_fly_adjustment,
    detail:
      "Largemouth surface-fly adjustment keeps popper and frog flies from outranking cleaner streamer lanes unless today's surface window and presentation really support that choice.",
  });

  const guardrail_penalty = roundScore(guardrailPenaltyValue(profile, daily));
  breakdown.push({
    code: "guardrail_penalty",
    value: guardrail_penalty,
    detail:
      "Guardrail penalties suppress archetypes that today's deterministic rules say should not rise to the top.",
  });

  const score = roundScore(
    seasonal_weight +
      water_column_fit +
      posture_fit +
      presentation_fit_value +
      forage_bonus +
      surface_window_bonus +
      largemouth_surface_fly_adjustment +
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
    seasonal_weight,
    water_column_fit,
    posture_fit,
    presentation_fit: presentation_fit_value,
    forage_bonus,
    guardrail_penalty,
    color_theme,
    color_recommendations,
    breakdown,
  };
}

function eligibleWeights<T extends string>(
  weights: Partial<Record<T, 1 | 2 | 3>>,
): Array<[T, 1 | 2 | 3]> {
  return Object.entries(weights) as Array<[T, 1 | 2 | 3]>;
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

export function scoreLureCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
  lightLabel: string | null,
): RecommenderV3RankedArchetype[] {
  const scored = eligibleWeights(seasonal.seasonal_lure_weights).map(([id, weight]) => {
    return {
      candidate: scoreProfile(
        LURE_ARCHETYPES_V3[id],
        seasonal,
        resolved,
        daily,
        clarity,
        lightLabel,
        weight,
      ),
      top3_redundancy_key: LURE_ARCHETYPES_V3[id].top3_redundancy_key,
    };
  });
  return selectTopThree(scored);
}

export function scoreFlyCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
  lightLabel: string | null,
): RecommenderV3RankedArchetype[] {
  const scored = eligibleWeights(seasonal.seasonal_fly_weights).map(([id, weight]) => {
    return {
      candidate: scoreProfile(
        FLY_ARCHETYPES_V3[id],
        seasonal,
        resolved,
        daily,
        clarity,
        lightLabel,
        weight,
      ),
      top3_redundancy_key: FLY_ARCHETYPES_V3[id].top3_redundancy_key,
    };
  });
  return selectTopThree(scored);
}
