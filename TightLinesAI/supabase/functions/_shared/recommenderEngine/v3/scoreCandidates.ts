import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import type { WaterClarity } from "../contracts/input.ts";
import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./candidates/index.ts";
import { RESOLVED_COLOR_SHADE_POOLS_V3 } from "./colors.ts";
import {
  normalizeLightBucketV3,
  resolveColorDecisionV3,
} from "./colorDecision.ts";
import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3DailyPayload,
  RecommenderV3RankedArchetype,
  RecommenderV3ResolvedProfile,
  RecommenderV3ScoreBreakdown,
  RecommenderV3SeasonalRow,
  ResolvedColorThemeV3,
  TacticalColumnV3,
  TacticalPaceV3,
  TacticalPresenceV3,
} from "./contracts.ts";

type ScoredCandidate = {
  profile: RecommenderV3ArchetypeProfile;
  score: number;
  tactical_fit: number;
  practicality_fit: number;
  forage_fit: number;
  clarity_fit: number;
  color_theme: ResolvedColorThemeV3;
  color_recommendations: [string, string, string];
  breakdown: RecommenderV3ScoreBreakdown[];
  why_chosen: string;
  how_to_fish: string;
};

const WORM_HEAVY_FAMILIES = new Set([
  "soft_plastic_worm",
  "finesse_worm",
  "drop_shot",
]);

function roundScore(value: number): number {
  return Number(value.toFixed(2));
}

function compareScored(a: ScoredCandidate, b: ScoredCandidate): number {
  return b.score - a.score ||
    b.tactical_fit - a.tactical_fit ||
    b.practicality_fit - a.practicality_fit ||
    b.forage_fit - a.forage_fit ||
    b.clarity_fit - a.clarity_fit ||
    a.profile.id.localeCompare(b.profile.id);
}

function isWormHeavyCandidate(candidate: ScoredCandidate): boolean {
  return WORM_HEAVY_FAMILIES.has(candidate.profile.family_group);
}

function firstThreeColors(theme: ResolvedColorThemeV3): [string, string, string] {
  const pool = RESOLVED_COLOR_SHADE_POOLS_V3[theme];
  return [
    pool[0] ?? "natural",
    pool[1] ?? pool[0] ?? "natural",
    pool[2] ?? pool[1] ?? pool[0] ?? "natural",
  ];
}

function dimensionFit<T extends string>(
  order: readonly T[],
  primary: T,
  secondary?: T,
): number {
  const primaryIndex = order.indexOf(primary);
  const secondaryIndex = secondary ? order.indexOf(secondary) : -1;
  const bestIndex = [primaryIndex, secondaryIndex]
    .filter((value) => value >= 0)
    .sort((a, b) => a - b)[0];

  if (bestIndex == null) return -2.5;
  if (bestIndex === 0) return 4;
  if (bestIndex === 1) return 2.5;
  if (bestIndex === 2) return 1.25;
  return 0.25;
}

function isColumnAllowed(
  profile: RecommenderV3ArchetypeProfile,
  allowed: readonly TacticalColumnV3[],
): boolean {
  return allowed.includes(profile.primary_column) ||
    (profile.secondary_column != null && allowed.includes(profile.secondary_column));
}

function isPaceAllowed(
  profile: RecommenderV3ArchetypeProfile,
  allowed: readonly TacticalPaceV3[],
): boolean {
  return allowed.includes(profile.pace) ||
    (profile.secondary_pace != null && allowed.includes(profile.secondary_pace));
}

function isPresenceAllowed(
  profile: RecommenderV3ArchetypeProfile,
  allowed: readonly TacticalPresenceV3[],
): boolean {
  return allowed.includes(profile.presence) ||
    (profile.secondary_presence != null && allowed.includes(profile.secondary_presence));
}

function buildWhyChosen(
  profile: RecommenderV3ArchetypeProfile,
  breakdown: readonly RecommenderV3ScoreBreakdown[],
): string {
  const drivers = breakdown
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 2)
    .map((item) => item.detail);
  const parts = [
    profile.why_hooks[0],
    ...drivers,
  ].filter(Boolean);
  return parts.join(" ");
}

function buildHowToFish(
  profile: RecommenderV3ArchetypeProfile,
  resolved: RecommenderV3ResolvedProfile,
): string {
  const paceHint = resolved.daily_preference.preferred_pace === "slow"
    ? " Slow down and use longer pauses."
    : resolved.daily_preference.preferred_pace === "fast"
    ? " Fish it with a more active cadence."
    : " Keep a steady medium cadence.";
  const columnHint = resolved.daily_preference.preferred_column === "bottom"
    ? " Keep it in the lower part of the zone."
    : resolved.daily_preference.preferred_column === "surface"
    ? " Keep it high and near the surface."
    : "";
  return `${profile.how_to_fish_template}${paceHint}${columnHint}`.trim();
}

function practicalityFit(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
): number {
  let fit = 0;

  if (profile.is_surface && !resolved.daily_preference.surface_allowed_today) {
    return -100;
  }
  if (daily.suppress_fast_presentations && profile.pace === "fast") {
    fit -= 2.2;
  } else if (
    daily.reaction_window === "on" &&
    (profile.pace === "fast" || profile.secondary_pace === "fast")
  ) {
    fit += 0.85;
  }

  if (
    daily.high_visibility_needed &&
    profile.presence === "subtle" &&
    profile.secondary_presence !== "moderate" &&
    profile.secondary_presence !== "bold"
  ) {
    fit -= 0.6;
  }

  if (
    daily.suppress_fast_presentations &&
    (profile.tactical_lane === "bottom_contact" || profile.tactical_lane === "finesse_subtle")
  ) {
    fit += 0.9;
  }

  if (
    daily.reaction_window === "on" &&
    (profile.tactical_lane === "reaction_mid_column" || profile.tactical_lane === "horizontal_search")
  ) {
    fit += 0.7;
  }

  if (
    resolved.daily_preference.surface_allowed_today &&
    profile.is_surface &&
    (daily.reaction_window === "on" || daily.surface_window === "clean")
  ) {
    fit += 1.35;
  }

  if (
    profile.is_surface &&
    daily.surface_window === "rippled" &&
    profile.family_group !== "frog" &&
    profile.family_group !== "surface_fly"
  ) {
    fit -= 0.35;
  }

  if (seasonal.context === "freshwater_river") {
    fit += profile.current_friendly ? 0.45 : -0.15;
  }

  if (
    resolved.daily_preference.opportunity_mix === "conservative" &&
    profile.pace === "slow"
  ) {
    fit += 0.35;
  }

  return fit;
}

function monthlyPrimaryFit(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
): number {
  const primaryIds = profile.gear_mode === "lure"
    ? seasonal.primary_lure_ids
    : seasonal.primary_fly_ids;
  if (!primaryIds?.includes(profile.id as never)) return 0;

  let fit = 0.7;
  if (
    profile.primary_column === resolved.daily_preference.preferred_column ||
    profile.secondary_column === resolved.daily_preference.preferred_column
  ) {
    fit += 0.2;
  }
  if (
    profile.pace === resolved.daily_preference.preferred_pace ||
    profile.secondary_pace === resolved.daily_preference.preferred_pace
  ) {
    fit += 0.15;
  }
  return fit;
}

function forageFit(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
): number {
  if (profile.forage_tags.includes(seasonal.monthly_baseline.primary_forage)) {
    return 0.75;
  }
  if (
    seasonal.monthly_baseline.secondary_forage &&
    profile.forage_tags.includes(seasonal.monthly_baseline.secondary_forage)
  ) {
    return 0.45;
  }
  return 0;
}

function clarityFit(
  profile: RecommenderV3ArchetypeProfile,
  clarity: WaterClarity,
): number {
  const strengths = profile.clarity_strengths;
  if (!strengths || strengths.length === 0) return 0;
  if (strengths.includes(clarity)) return 0.35;
  if (clarity === "dirty" && strengths.includes("stained")) return 0.1;
  return -0.15;
}

function scoreProfile(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
  lightLabel: string | null,
): ScoredCandidate | null {
  if (!profile.species_allowed.includes(seasonal.species)) return null;
  if (!profile.water_types_allowed.includes(seasonal.context)) return null;
  if (
    !isColumnAllowed(profile, seasonal.monthly_baseline.allowed_columns) ||
    !isPaceAllowed(profile, seasonal.monthly_baseline.allowed_paces) ||
    !isPresenceAllowed(profile, seasonal.monthly_baseline.allowed_presence)
  ) {
    return null;
  }
  if (profile.is_surface && !resolved.daily_preference.surface_allowed_today) {
    return null;
  }

  const columnFit = dimensionFit(
    resolved.daily_preference.column_preference_order,
    profile.primary_column,
    profile.secondary_column,
  );
  const paceFit = dimensionFit(
    resolved.daily_preference.pace_preference_order,
    profile.pace,
    profile.secondary_pace,
  );
  const presenceFit = dimensionFit(
    resolved.daily_preference.presence_preference_order,
    profile.presence,
    profile.secondary_presence,
  );
  const tacticalFit = columnFit + paceFit + presenceFit;
  const practicalFit = practicalityFit(profile, seasonal, daily, resolved);
  if (practicalFit <= -100) return null;
  const monthlyPrimary = monthlyPrimaryFit(profile, seasonal, resolved);
  const forage = forageFit(profile, seasonal);
  const clarityScore = clarityFit(profile, clarity);
  const lightBucket = normalizeLightBucketV3(lightLabel);
  const colorDecision = resolveColorDecisionV3(clarity, lightBucket);
  const breakdown: RecommenderV3ScoreBreakdown[] = [
    {
      code: "column_fit",
      value: roundScore(columnFit),
      detail: `It fits today's ${resolved.daily_preference.preferred_column} column preference.`,
    },
    {
      code: "pace_fit",
      value: roundScore(paceFit),
      detail: `It lines up with today's ${resolved.daily_preference.preferred_pace} pace preference.`,
    },
    {
      code: "presence_fit",
      value: roundScore(presenceFit),
      detail: `It matches today's ${resolved.daily_preference.preferred_presence} presence lane.`,
    },
    {
      code: "practicality_fit",
      value: roundScore(practicalFit),
      detail: seasonal.context === "freshwater_river"
        ? "Its practicality holds up in river conditions."
        : "Its day-level practicality stays clean for today's conditions.",
    },
    {
      code: "monthly_primary_fit",
      value: roundScore(monthlyPrimary),
      detail: "It sits inside the strongest monthly archetype lane for this window.",
    },
    {
      code: "forage_fit",
      value: roundScore(forage),
      detail: "Its forage profile fits the monthly biological context.",
    },
    {
      code: "clarity_fit",
      value: roundScore(clarityScore),
      detail: "Its visibility profile suits today's water clarity.",
    },
  ];
  const score = roundScore(
    tacticalFit + practicalFit + monthlyPrimary + forage + clarityScore,
  );

  return {
    profile,
    score,
    tactical_fit: roundScore(tacticalFit),
    practicality_fit: roundScore(practicalFit),
    forage_fit: roundScore(monthlyPrimary + forage),
    clarity_fit: roundScore(clarityScore),
    color_theme: colorDecision.color_theme,
    color_recommendations: firstThreeColors(colorDecision.color_theme),
    breakdown,
    why_chosen: buildWhyChosen(profile, breakdown),
    how_to_fish: buildHowToFish(profile, resolved),
  };
}

function changeupBonus(
  candidate: ScoredCandidate,
  selected: readonly ScoredCandidate[],
  resolved: RecommenderV3ResolvedProfile,
): number {
  const lead = selected[0]!;
  const usedFamilies = new Set(selected.map((entry) => entry.profile.family_group));
  const usedLanes = new Set(selected.map((entry) => entry.profile.tactical_lane));
  const usedColumns = new Set(selected.map((entry) => entry.profile.primary_column));
  const usedPaces = new Set(selected.map((entry) => entry.profile.pace));
  const usedPresence = new Set(selected.map((entry) => entry.profile.presence));
  let bonus = 0;
  if (!usedFamilies.has(candidate.profile.family_group)) bonus += 0.8;
  if (!usedLanes.has(candidate.profile.tactical_lane)) bonus += 0.45;
  if (!usedColumns.has(candidate.profile.primary_column)) bonus += 0.35;
  if (!usedPaces.has(candidate.profile.pace)) bonus += 0.25;
  if (!usedPresence.has(candidate.profile.presence)) bonus += 0.2;
  if (usedFamilies.has(candidate.profile.family_group)) bonus -= 0.45;
  if (usedLanes.has(candidate.profile.tactical_lane)) bonus -= 0.25;
  if (candidate.profile.family_group === lead.profile.family_group) bonus -= 0.8;
  if (candidate.profile.tactical_lane === lead.profile.tactical_lane) bonus -= 0.35;
  if (
    isWormHeavyCandidate(candidate) &&
    selected.some((entry) => isWormHeavyCandidate(entry))
  ) {
    bonus -= 0.75;
  }
  if (
    candidate.profile.primary_column === resolved.daily_preference.secondary_column ||
    candidate.profile.pace === resolved.daily_preference.secondary_pace ||
    candidate.profile.presence === resolved.daily_preference.secondary_presence
  ) {
    bonus += 0.35;
  }
  return bonus;
}

function selectionThreshold(opportunityMix: RecommenderV3ResolvedProfile["daily_preference"]["opportunity_mix"]): number {
  switch (opportunityMix) {
    case "conservative":
      return 0.45;
    case "aggressive":
      return 1.15;
    case "balanced":
    default:
      return 0.8;
  }
}

function finalizeCandidate(
  candidate: ScoredCandidate,
  selectionRole: RecommenderV3RankedArchetype["selection_role"],
  opportunityMixFit: number,
): RecommenderV3RankedArchetype {
  return {
    id: candidate.profile.id,
    display_name: candidate.profile.display_name,
    gear_mode: candidate.profile.gear_mode,
    family_group: candidate.profile.family_group,
    primary_column: candidate.profile.primary_column,
    pace: candidate.profile.pace,
    presence: candidate.profile.presence,
    is_surface: candidate.profile.is_surface,
    tactical_lane: candidate.profile.tactical_lane,
    score: candidate.score,
    selection_role: selectionRole,
    tactical_fit: candidate.tactical_fit,
    practicality_fit: candidate.practicality_fit,
    forage_fit: candidate.forage_fit,
    clarity_fit: candidate.clarity_fit,
    opportunity_mix_fit: roundScore(opportunityMixFit),
    color_theme: candidate.color_theme,
    color_recommendations: candidate.color_recommendations,
    why_chosen: candidate.why_chosen,
    how_to_fish: candidate.how_to_fish,
    breakdown: candidate.breakdown,
  };
}

function selectTopThree(
  scored: ScoredCandidate[],
  resolved: RecommenderV3ResolvedProfile,
): RecommenderV3RankedArchetype[] {
  const sorted = [...scored].sort(compareScored);
  if (sorted.length === 0) return [];

  const selected: ScoredCandidate[] = [sorted[0]!];
  const threshold = selectionThreshold(resolved.daily_preference.opportunity_mix);

  while (selected.length < 3 && selected.length < sorted.length) {
    const remaining = sorted.filter((candidate) =>
      !selected.some((chosen) => chosen.profile.id === candidate.profile.id)
    );
    const bestRemaining = remaining[0]!;
    let chosen = bestRemaining;
    const bestRemainingRepeatsFamily = selected.some((entry) =>
      entry.profile.family_group === bestRemaining.profile.family_group
    );
    const bestRemainingRepeatsWormClass = isWormHeavyCandidate(bestRemaining) &&
      selected.some((entry) => isWormHeavyCandidate(entry));

    if (selected.length === 1) {
      const diverse = remaining
        .map((candidate) => ({
          candidate,
          bonus: changeupBonus(candidate, selected, resolved),
        }))
        .filter(({ candidate }) =>
          candidate.profile.family_group !== selected[0]!.profile.family_group
        )
        .sort((a, b) =>
          b.bonus - a.bonus ||
          compareScored(a.candidate, b.candidate)
        );
      const diversityThreshold = bestRemainingRepeatsFamily || bestRemainingRepeatsWormClass
        ? threshold + 0.8
        : threshold;
      if (
        diverse[0] &&
        diverse[0].candidate.score >= bestRemaining.score - diversityThreshold
      ) {
        chosen = diverse[0].candidate;
      }
    } else {
      const changeups = remaining
        .map((candidate) => ({
          candidate,
          bonus: changeupBonus(candidate, selected, resolved),
        }))
        .sort((a, b) =>
          b.bonus - a.bonus ||
          compareScored(a.candidate, b.candidate)
        );
      const changeupThreshold = bestRemainingRepeatsFamily || bestRemainingRepeatsWormClass
        ? threshold + 0.8
        : threshold + 0.2;
      if (
        changeups[0] &&
        changeups[0].bonus > 0.2 &&
        changeups[0].candidate.score >= bestRemaining.score - changeupThreshold
      ) {
        chosen = changeups[0].candidate;
      }
    }

    selected.push(chosen);
  }

  while (selected.length < 3 && selected.length < sorted.length) {
    const fallback = sorted.find((candidate) =>
      !selected.some((chosen) => chosen.profile.id === candidate.profile.id)
    );
    if (!fallback) break;
    selected.push(fallback);
  }

  return selected.slice(0, 3).map((candidate, index) =>
    finalizeCandidate(
      candidate,
      index === 0 ? "best_match" : index === 1 ? "strong_alternate" : "change_up",
      index === 0 ? 0 : changeupBonus(candidate, selected.slice(0, index), resolved),
    )
  );
}

function rankCandidates<TId extends LureArchetypeIdV3 | FlyArchetypeIdV3>(
  ids: readonly TId[],
  catalog: Record<TId, RecommenderV3ArchetypeProfile>,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
  lightLabel: string | null,
): RecommenderV3RankedArchetype[] {
  const scored = ids
    .map((id) => catalog[id])
    .filter(Boolean)
    .map((profile) => scoreProfile(profile, seasonal, resolved, daily, clarity, lightLabel))
    .filter((candidate): candidate is ScoredCandidate => candidate != null);

  return selectTopThree(scored, resolved);
}

export function scoreLureCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
  lightLabel: string | null,
  _analysis?: SharedConditionAnalysis,
): RecommenderV3RankedArchetype[] {
  return rankCandidates(
    seasonal.eligible_lure_ids,
    LURE_ARCHETYPES_V3,
    seasonal,
    resolved,
    daily,
    clarity,
    lightLabel,
  );
}

export function scoreFlyCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
  lightLabel: string | null,
  _analysis?: SharedConditionAnalysis,
): RecommenderV3RankedArchetype[] {
  return rankCandidates(
    seasonal.eligible_fly_ids,
    FLY_ARCHETYPES_V3,
    seasonal,
    resolved,
    daily,
    clarity,
    lightLabel,
  );
}
