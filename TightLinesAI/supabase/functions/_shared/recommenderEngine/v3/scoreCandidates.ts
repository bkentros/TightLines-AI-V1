import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./candidates/index.ts";
import { RESOLVED_COLOR_SHADE_POOLS_V3 } from "./colors.ts";
import {
  normalizeLightBucketV3,
  resolveColorDecisionV3,
} from "./colorDecision.ts";
import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  MoodV3,
  PresentationStyleV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3DailyPayload,
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
const PRESENTATION_STYLES: PresentationStyleV3[] = [
  "subtle",
  "balanced",
  "bold",
];
const PACE_ORDER = ["slow", "medium", "fast"] as const;

type ScoredSelectionCandidate = {
  candidate: RecommenderV3RankedArchetype;
  top3_redundancy_key?: string;
};

type CohesionLevel = 0 | 1 | 2;

function roundScore(value: number): number {
  return Number(value.toFixed(2));
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

function waterColumnComponent(
  target: WaterColumnV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  const distance = ordinalDistance(
    WATER_COLUMNS,
    target,
    profile.preferred_water_columns,
  );
  if (distance === 0) return 0.7;
  if (distance === 1) return 0.35;
  return 0;
}

function moodComponent(
  target: MoodV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  const distance = ordinalDistance(MOODS, target, profile.preferred_moods);
  if (distance === 0) return 0.7;
  if (distance === 1) return 0.35;
  return 0;
}

function presentationComponent(
  target: PresentationStyleV3,
  profile: RecommenderV3ArchetypeProfile,
): number {
  const distance = ordinalDistance(
    PRESENTATION_STYLES,
    target,
    profile.preferred_presentation_styles,
  );
  if (distance === 0) return 0.6;
  if (distance === 1) return 0.3;
  return 0;
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

function lanePace(
  profile: RecommenderV3ArchetypeProfile,
): (typeof PACE_ORDER)[number] {
  switch (profile.tactical_lane) {
    case "bottom_contact":
    case "finesse_subtle":
    case "fly_bottom":
      return "slow";
    case "horizontal_search":
    case "cover_weedless":
    case "fly_baitfish":
      return "medium";
    case "reaction_mid_column":
    case "surface":
    case "pike_big_profile":
    case "fly_surface":
      return "fast";
  }
}

function tacticalLanePace(
  lane: RecommenderV3RankedArchetype["tactical_lane"],
): (typeof PACE_ORDER)[number] {
  switch (lane) {
    case "bottom_contact":
    case "finesse_subtle":
    case "fly_bottom":
      return "slow";
    case "horizontal_search":
    case "cover_weedless":
    case "fly_baitfish":
      return "medium";
    case "reaction_mid_column":
    case "surface":
    case "pike_big_profile":
    case "fly_surface":
      return "fast";
  }
}

function isSurfaceLane(
  lane: RecommenderV3RankedArchetype["tactical_lane"],
): boolean {
  return lane === "surface" || lane === "fly_surface";
}

function isBottomLane(
  lane: RecommenderV3RankedArchetype["tactical_lane"],
): boolean {
  return lane === "bottom_contact" || lane === "fly_bottom";
}

function paceDistance(
  a: (typeof PACE_ORDER)[number],
  b: (typeof PACE_ORDER)[number],
): number {
  return Math.abs(PACE_ORDER.indexOf(a) - PACE_ORDER.indexOf(b));
}

function cohesionLevelForCandidate(
  anchor: RecommenderV3RankedArchetype | undefined,
  next: ScoredSelectionCandidate,
  daily: RecommenderV3DailyPayload | undefined,
): CohesionLevel {
  if (!anchor) return 0;

  const anchorLane = anchor.tactical_lane;
  const nextLane = next.candidate.tactical_lane;
  const surfaceWindow = daily?.surface_window ?? "off";
  const reactionWindow = daily?.reaction_window ?? "off";
  const finesseWindow = daily?.finesse_window ?? "off";
  const mixedWindows = reactionWindow !== "off" && finesseWindow !== "off";
  const scoreGap = Math.abs(anchor.score - next.candidate.score);
  const surfaceBottomMix =
    (isSurfaceLane(anchorLane) && isBottomLane(nextLane)) ||
    (isBottomLane(anchorLane) && isSurfaceLane(nextLane));

  if (surfaceBottomMix) {
    if (surfaceWindow === "off") return 2;
    if (finesseWindow === "on" && reactionWindow === "off") return 2;
    if (daily?.pace_bias === "slow" && !isSurfaceLane(anchorLane)) return 2;
    if (surfaceWindow === "watch") {
      return scoreGap <= 0.35 ? 1 : 2;
    }
    return scoreGap <= 0.6 ? 1 : 2;
  }

  if (
    surfaceWindow === "off" && isSurfaceLane(nextLane) &&
    !isSurfaceLane(anchorLane)
  ) {
    return 2;
  }

  const anchorPace = tacticalLanePace(anchorLane);
  const targetPaces = new Set<(typeof PACE_ORDER)[number]>([anchorPace]);
  if (daily?.pace_bias && daily.pace_bias !== "neutral") {
    // Keep rank 2-3 anchored to the story rank 1 is already telling.
    // A daily pace bias can stretch the list one pace step, but should not
    // let a slow winter anchor suddenly justify a fast reaction lane as
    // equally coherent.
    if (paceDistance(anchorPace, daily.pace_bias) <= 1) {
      targetPaces.add(daily.pace_bias);
    }
  }

  const candidatePace = tacticalLanePace(nextLane);
  if (
    reactionWindow === "on" &&
    finesseWindow === "off" &&
    candidatePace === "slow" &&
    anchorPace !== "slow"
  ) {
    return 2;
  }
  if (
    finesseWindow === "on" &&
    reactionWindow === "off" &&
    candidatePace === "fast" &&
    anchorPace !== "fast"
  ) {
    return 2;
  }

  const bestDistance = Math.min(
    ...[...targetPaces].map((pace) => paceDistance(pace, candidatePace)),
  );

  if (bestDistance === 0) return 0;
  if (bestDistance === 1) return 1;
  if (mixedWindows && scoreGap <= 0.35) {
    return 1;
  }
  return 2;
}

function laneContextBonusValue(
  profile: RecommenderV3ArchetypeProfile,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
): number {
  const surfaceWindow = daily?.surface_window ?? "off";
  if (surfaceWindow === "off") {
    if (
      profile.tactical_lane === "surface" ||
      profile.tactical_lane === "fly_surface"
    ) {
      if (profile.tactical_lane === "fly_surface") {
        return resolved.final_water_column === "top" ? -0.7 : -1.4;
      }
      return resolved.final_water_column === "top" ? -0.35 : -0.85;
    }
    return 0;
  }

  if (surfaceWindow === "watch") {
    if (
      profile.tactical_lane === "surface" ||
      profile.tactical_lane === "fly_surface"
    ) return 0.6;
    if (profile.tactical_lane === "cover_weedless") return 0.25;
    return 0;
  }

  if (
    profile.tactical_lane === "surface" ||
    profile.tactical_lane === "fly_surface"
  ) return 1.25;
  if (profile.tactical_lane === "cover_weedless") return 0.45;
  if (
    profile.tactical_lane === "bottom_contact" ||
    profile.tactical_lane === "fly_bottom"
  ) return -0.35;
  return 0;
}

function tacticalWindowBonusValue(
  profile: RecommenderV3ArchetypeProfile,
  daily: RecommenderV3DailyPayload | undefined,
): number {
  const reactionWindow = daily?.reaction_window ?? "off";
  const finesseWindow = daily?.finesse_window ?? "off";
  let bonus = 0;

  if (reactionWindow !== "off") {
    switch (profile.tactical_lane) {
      case "reaction_mid_column":
        bonus += reactionWindow === "on" ? 1.15 : 0.55;
        break;
      case "horizontal_search":
        bonus += reactionWindow === "on" ? 0.9 : 0.4;
        break;
      case "fly_baitfish":
      case "pike_big_profile":
        bonus += reactionWindow === "on" ? 0.8 : 0.35;
        break;
      case "bottom_contact":
      case "finesse_subtle":
      case "fly_bottom":
        bonus += reactionWindow === "on" ? -0.45 : -0.2;
        break;
      default:
        break;
    }
  }

  if (finesseWindow !== "off") {
    switch (profile.tactical_lane) {
      case "finesse_subtle":
        bonus += finesseWindow === "on" ? 1.1 : 0.5;
        break;
      case "bottom_contact":
      case "fly_bottom":
        bonus += finesseWindow === "on" ? 0.9 : 0.4;
        break;
      case "reaction_mid_column":
        bonus += finesseWindow === "on" ? -0.55 : -0.25;
        break;
      case "horizontal_search":
      case "fly_baitfish":
      case "pike_big_profile":
        bonus += finesseWindow === "on" ? -0.35 : -0.15;
        break;
      default:
        break;
    }
  }

  return bonus;
}

function paceBiasBonusValue(
  profile: RecommenderV3ArchetypeProfile,
  daily: RecommenderV3DailyPayload | undefined,
): number {
  const paceBias = daily?.pace_bias ?? "neutral";
  if (paceBias === "neutral") return 0;

  const target = PACE_ORDER.indexOf(paceBias);
  const lane = PACE_ORDER.indexOf(lanePace(profile));
  const distance = Math.abs(target - lane);
  if (distance === 0) return 0.45;
  if (distance === 1) return 0.15;
  return -0.35;
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
  daily: RecommenderV3DailyPayload | undefined,
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
    detail:
      "Seasonal fit stays intentionally tight so daily conditions can reshuffle the pool.",
  });

  const daily_modifier = roundScore(
    (ordinalDistance(
        WATER_COLUMNS,
        resolved.final_water_column,
        profile.preferred_water_columns,
      ) === 0
      ? 0.75
      : ordinalDistance(
          WATER_COLUMNS,
          resolved.final_water_column,
          profile.preferred_water_columns,
        ) === 1
      ? 0.35
      : -0.5) +
      (ordinalDistance(MOODS, resolved.final_mood, profile.preferred_moods) ===
          0
        ? 1.0
        : ordinalDistance(
            MOODS,
            resolved.final_mood,
            profile.preferred_moods,
          ) === 1
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
    detail:
      "Daily conditions determine whether this archetype moves up, down, or stays in place today.",
  });

  const clarity_modifier = 0;
  breakdown.push({
    code: "clarity_modifier",
    value: clarity_modifier,
    detail:
      "Clarity now stays in the color-theme layer instead of directly moving rank order.",
  });

  const forage_bonus = roundScore(forageBonusValue(seasonal, profile));
  breakdown.push({
    code: "forage_bonus",
    value: forage_bonus,
    detail:
      "Forage bonus keeps the recommendation tied to likely prey for the month and region.",
  });

  const lane_window_bonus = roundScore(
    laneContextBonusValue(profile, resolved, daily),
  );
  breakdown.push({
    code: "lane_window_bonus",
    value: lane_window_bonus,
    detail:
      "A small deterministic lane bonus helps real surface windows and suppresses surface when the day does not support it.",
  });

  const tactical_window_bonus = roundScore(
    tacticalWindowBonusValue(profile, daily),
  );
  breakdown.push({
    code: "tactical_window_bonus",
    value: tactical_window_bonus,
    detail:
      "Reaction and finesse windows give a bounded lift to the tactical lanes that best match today's biological posture.",
  });

  const pace_bias_bonus = roundScore(paceBiasBonusValue(profile, daily));
  breakdown.push({
    code: "pace_bias_bonus",
    value: pace_bias_bonus,
    detail:
      "A small pace bonus keeps faster or slower lanes aligned with the overall speed the day supports.",
  });

  const score = roundScore(
    seasonal_baseline +
      daily_modifier +
      clarity_modifier +
      forage_bonus +
      lane_window_bonus +
      tactical_window_bonus +
      pace_bias_bonus,
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
  scored: ScoredSelectionCandidate[],
  seasonalOrder: readonly (LureArchetypeIdV3 | FlyArchetypeIdV3)[],
  daily: RecommenderV3DailyPayload | undefined,
): RecommenderV3RankedArchetype[] {
  const orderIndex = new Map(seasonalOrder.map((id, index) => [id, index]));
  const sorted = [...scored].sort((a, b) =>
    b.candidate.score - a.candidate.score ||
    (orderIndex.get(a.candidate.id) ?? Number.MAX_SAFE_INTEGER) -
      (orderIndex.get(b.candidate.id) ?? Number.MAX_SAFE_INTEGER) ||
    a.candidate.display_name.localeCompare(b.candidate.display_name)
  );
  const selected: ScoredSelectionCandidate[] = [];

  function redundancyAllowed(
    candidate: ScoredSelectionCandidate,
    usedRedundancyKeys: ReadonlySet<string>,
  ): boolean {
    return candidate.top3_redundancy_key == null ||
      !usedRedundancyKeys.has(candidate.top3_redundancy_key);
  }

  while (selected.length < 3 && sorted.length > 0) {
    const top = sorted[0]!;
    const nearBand = sorted.filter((candidate) =>
      top.candidate.score - candidate.candidate.score <= 0.5
    );
    const usedLanes = new Set(
      selected.map((candidate) => candidate.candidate.tactical_lane),
    );
    const usedFamilies = new Set(
      selected.map((candidate) => candidate.candidate.family_key),
    );
    const usedRedundancyKeys = new Set(
      selected
        .map((candidate) => candidate.top3_redundancy_key)
        .filter((value): value is string => value != null),
    );
    const anchor = selected[0]?.candidate;

    const pick = (
      candidates: readonly ScoredSelectionCandidate[],
      maxCohesion: CohesionLevel,
      requireFreshLane: boolean,
      requireFreshFamily: boolean,
    ) =>
      candidates.find((candidate) =>
        redundancyAllowed(candidate, usedRedundancyKeys) &&
        cohesionLevelForCandidate(anchor, candidate, daily) <= maxCohesion &&
        (!requireFreshLane ||
          !usedLanes.has(candidate.candidate.tactical_lane)) &&
        (!requireFreshFamily ||
          !usedFamilies.has(candidate.candidate.family_key))
      );

    const preferred = pick(nearBand, 0, true, true) ??
      pick(nearBand, 0, true, false) ??
      pick(sorted, 0, true, true) ??
      pick(sorted, 0, true, false) ??
      pick(nearBand, 1, true, true) ??
      pick(nearBand, 1, true, false) ??
      pick(sorted, 1, true, true) ??
      pick(sorted, 1, true, false) ??
      pick(nearBand, 0, false, false) ??
      pick(sorted, 0, false, false) ??
      pick(nearBand, 1, false, false) ??
      pick(sorted, 1, false, false) ??
      sorted.find((candidate) =>
        redundancyAllowed(candidate, usedRedundancyKeys)
      ) ??
      top;

    selected.push(preferred);
    const index = sorted.findIndex((candidate) =>
      candidate.candidate.id === preferred.candidate.id
    );
    if (index >= 0) {
      sorted.splice(index, 1);
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
  const scored = seasonal.viable_lure_archetypes.map((id) => {
    const bonus = seasonalPriorityBonus(id, seasonal.primary_lure_archetypes);
    return {
      candidate: scoreProfile(
        LURE_ARCHETYPES_V3[id],
        seasonal,
        resolved,
        daily,
        clarity,
        lightLabel,
        bonus,
      ),
      top3_redundancy_key: LURE_ARCHETYPES_V3[id].top3_redundancy_key,
    };
  });
  return selectTopThree(scored, seasonal.viable_lure_archetypes, daily);
}

export function scoreFlyCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
  lightLabel: string | null,
): RecommenderV3RankedArchetype[] {
  const scored = seasonal.viable_fly_archetypes.map((id) => {
    const bonus = seasonalPriorityBonus(id, seasonal.primary_fly_archetypes);
    return {
      candidate: scoreProfile(
        FLY_ARCHETYPES_V3[id],
        seasonal,
        resolved,
        daily,
        clarity,
        lightLabel,
        bonus,
      ),
      top3_redundancy_key: FLY_ARCHETYPES_V3[id].top3_redundancy_key,
    };
  });
  return selectTopThree(scored, seasonal.viable_fly_archetypes, daily);
}
