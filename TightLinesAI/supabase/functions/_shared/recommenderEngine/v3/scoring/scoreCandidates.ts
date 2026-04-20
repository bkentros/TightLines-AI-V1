/**
 * Section 4 (nine-of-ten): PA / ID scoring nudges use **Option 1** — `state_scoring_adjustments`
 * on state-scoped seasonal rows — applied in `stateScoringAdjustmentsDelta` (not named profiles).
 *
 * Section 5: `why_chosen` is first built in `scoreProfile` with `changeupBonus=0` (provisional).
 * `selectTopThreeCandidates` recomputes final copy via `buildWhyChosen(..., diversity_bonus)` in
 * `finalizeCandidate` — smallest blast radius vs threading color/clarity through more call sites.
 */
import type { WaterClarity } from "../../contracts/input.ts";
import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "../candidates/index.ts";
import { RESOLVED_COLOR_SHADE_POOLS_V3 } from "../../v4/colors.ts";
import { buildHowToFish, buildWhyChosen } from "../recommendationCopy.ts";
import {
  normalizeLightBucketV3,
  resolveColorDecisionV3,
} from "../../v4/colorDecision.ts";
import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3DailyPayload,
  RecommenderV3RankedArchetype,
  RecommenderV3ResolvedProfile,
  RecommenderV3ScoreBreakdown,
  RecommenderV3SeasonalRow,
} from "../contracts.ts";
import type { ScoredCandidate } from "../scoringTypes.ts";
import {
  archetypeFitsMonthlyBaselineLanes,
  archetypeFitsStrictMonthlyBaselineLanes,
} from "../seasonal/validateSeasonalRow.ts";
import { selectTopThreeCandidates } from "../topThreeSelection.ts";
import { largemouthLakeGuardAdjustments } from "./guards/largemouthLakeGuards.ts";
import { practicalityStateGuardsV3 } from "./guards/practicalityStateGuards.ts";
import { smallmouthGuardAdjustments } from "./guards/smallmouthGuards.ts";

function roundScore(value: number): number {
  return Number(value.toFixed(2));
}

function firstThreeColors(
  theme: keyof typeof RESOLVED_COLOR_SHADE_POOLS_V3,
): [string, string, string] {
  const pool = RESOLVED_COLOR_SHADE_POOLS_V3[theme];
  return [
    pool[0] ?? "natural",
    pool[1] ?? pool[0] ?? "natural",
    pool[2] ?? pool[1] ?? pool[0] ?? "natural",
  ];
}

/**
 * Score an archetype's authored primary/secondary axis value against the day's
 * preferred-to-least-preferred order for that axis.
 *
 * Simplified to three buckets so credibility always wins:
 * - +3.0 when the archetype's primary value IS the day's preferred value.
 * - +1.5 when the archetype's primary OR secondary is the day's secondary.
 * - −2.0 when neither primary nor secondary overlap the top two preferences.
 *
 * This replaces the earlier 4.0/2.5/1.25/0.25/-2.5 ladder that quietly rewarded
 * archetypes for listing a column (or pace/presence) they do not actually fish
 * — the source of the "bass jig shown as upper" class of bug. With authored
 * primary/secondary as the single source of truth, there is no third/fourth
 * slot to reward.
 */
function dimensionFit<T extends string>(
  order: readonly T[],
  primary: T,
  secondary?: T,
): number {
  const preferred = order[0];
  const preferredSecondary = order[1];

  if (preferred != null && primary === preferred) return 3;
  if (preferred != null && secondary != null && secondary === preferred) {
    return 1.5;
  }
  if (preferredSecondary != null && primary === preferredSecondary) {
    return 1.5;
  }
  if (
    preferredSecondary != null &&
    secondary != null &&
    secondary === preferredSecondary
  ) {
    return 1.5;
  }
  return -2;
}

/**
 * Build a fit-aware detail string for `column_fit` / `pace_fit` / `presence_fit`
 * breakdown entries. Mirrors the three-bucket scale returned by `dimensionFit`:
 * - 3.0  → primary match (lead alignment)
 * - 1.5  → secondary match (overlaps today's top-two preference)
 * - -2.0 → neither primary nor secondary overlap
 */
function dimensionDetail(
  axis: "column" | "pace" | "presence",
  fitValue: number,
  preferred: string,
): string {
  if (fitValue >= 2.5) {
    return `It leads on today's preferred ${preferred} ${axis}.`;
  }
  if (fitValue >= 1.0) {
    return `Its secondary ${axis} overlaps today's preferred ${preferred} ${axis}.`;
  }
  return `Its ${axis} profile does not overlap today's preferred ${preferred} ${axis}.`;
}

/** State-scoped seasonal row deltas (applied inside practicality fit for score parity). */
function stateScoringAdjustmentsDelta(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  clarity: WaterClarity,
): number {
  let d = 0;
  for (const entry of seasonal.state_scoring_adjustments ?? []) {
    if (entry.archetype_id !== profile.id) continue;
    if (entry.when?.clarity != null && entry.when.clarity !== clarity) continue;
    d += entry.delta;
  }
  return d;
}

function practicalityFit(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
  clarity: WaterClarity,
): number {
  let fit = 0;
  const strictMonthlyFit = archetypeFitsStrictMonthlyBaselineLanes(
    profile,
    seasonal.monthly_baseline.allowed_columns,
    seasonal.monthly_baseline.allowed_paces,
    seasonal.monthly_baseline.allowed_presence,
  );

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
    daily.posture_band === "suppressed" &&
    (profile.pace === "medium" || profile.secondary_pace === "medium")
  ) {
    fit -= 1.1;
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
    (profile.tactical_lane === "bottom_contact" ||
      profile.tactical_lane === "finesse_subtle")
  ) {
    fit += 0.9;
  }

  if (
    daily.posture_band === "suppressed" &&
    (profile.tactical_lane === "bottom_contact" ||
      profile.tactical_lane === "finesse_subtle" ||
      profile.tactical_lane === "fly_bottom")
  ) {
    fit += 1.15;
  }

  if (
    daily.reaction_window === "on" &&
    (profile.tactical_lane === "reaction_mid_column" ||
      profile.tactical_lane === "horizontal_search" ||
      profile.tactical_lane === "fly_baitfish")
  ) {
    fit += 0.7;
  }

  if (
    resolved.daily_preference.surface_allowed_today &&
    profile.is_surface &&
    (
      daily.reaction_window === "on" ||
      daily.surface_window === "clean" ||
      (
        daily.surface_window === "rippled" &&
        seasonal.monthly_baseline.surface_seasonally_possible
      )
    )
  ) {
    fit += daily.surface_window === "clean" ? 1.35 : 0.9;
  }

  // Surface reservation for aggressive-mix days with an open surface window.
  // Keeps a visible lane in play even when the main surface bonus above did
  // not fire (e.g. rippled non-seasonal days). Intentionally small relative
  // to the primary surface bonus (1.35 clean / 0.9 otherwise) so conservative
  // days are not perturbed. See
  // `docs/audits/recommender-v3/_correction_plan.md` §3.2.
  if (
    resolved.daily_preference.surface_allowed_today &&
    profile.is_surface &&
    daily.opportunity_mix === "aggressive"
  ) {
    fit += 0.3;
  }

  if (
    profile.id === "popping_topwater" &&
    resolved.daily_preference.surface_allowed_today &&
    daily.surface_window === "clean"
  ) {
    fit += 0.4;
  }

  if (
    profile.id === "pike_jerkbait" &&
    daily.reaction_window === "on" &&
    !daily.high_visibility_needed &&
    !daily.suppress_fast_presentations
  ) {
    fit += 0.7;
  }

  if (
    profile.is_surface &&
    daily.surface_window === "rippled" &&
    profile.family_group !== "frog" &&
    profile.family_group !== "surface_fly"
  ) {
    fit -= 0.2;
  }

  if (
    seasonal.monthly_baseline.surface_seasonally_possible &&
    profile.is_surface &&
    daily.surface_window === "rippled" &&
    (profile.family_group === "frog" || profile.family_group === "surface_fly")
  ) {
    fit += 0.25;
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

  if (!strictMonthlyFit) {
    fit -= 0.85;
  }

  // Deep-structure reinforcement for summer deep largemouth days. When the
  // seasonal row lives in the mid_deep/deep band and the daily preference
  // resolves to a bottom read, small-but-meaningful delta keeps the
  // bottom_contact family honest in the trio (e.g. football jig, deep
  // crankbait on ledges) instead of letting mid-column searches drift up.
  // Gated to largemouth_bass and kept small so it does not perturb shallower
  // bands or other species. See
  // `docs/audits/recommender-v3/_correction_plan.md` §3.4.
  if (
    seasonal.species === "largemouth_bass" &&
    (seasonal.monthly_baseline.typical_seasonal_location === "mid_deep" ||
      seasonal.monthly_baseline.typical_seasonal_location === "deep") &&
    resolved.daily_preference.preferred_column === "bottom" &&
    profile.primary_column === "bottom" &&
    profile.tactical_lane === "bottom_contact"
  ) {
    fit += 0.3;
  }

  fit += largemouthLakeGuardAdjustments(profile, seasonal, daily);
  fit += smallmouthGuardAdjustments(profile, seasonal, daily);
  fit += practicalityStateGuardsV3(profile, seasonal, clarity);
  fit += stateScoringAdjustmentsDelta(profile, seasonal, clarity);

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

  let fit = 0.45;
  if (
    profile.primary_column === resolved.daily_preference.preferred_column ||
    profile.secondary_column === resolved.daily_preference.preferred_column
  ) {
    fit += 0.1;
  }
  if (
    profile.pace === resolved.daily_preference.preferred_pace ||
    profile.secondary_pace === resolved.daily_preference.preferred_pace
  ) {
    fit += 0.1;
  }
  if (
    (seasonal.species === "largemouth_bass" ||
      seasonal.species === "smallmouth_bass" ||
      seasonal.species === "trout" ||
      seasonal.species === "northern_pike") &&
    primaryIds.length > 1
  ) {
    const idx = primaryIds.indexOf(profile.id as never);
    if (idx >= 0) {
      // Earlier authored primaries win when totals would otherwise stack — monthly intent order.
      const tieWeight = seasonal.species === "smallmouth_bass"
        ? 0.038
        : seasonal.species === "northern_pike"
        ? 0.038
        : seasonal.species === "trout"
        ? 0.026
        : 0.032;
      fit += tieWeight * (primaryIds.length - 1 - idx);
    }
  }
  return fit;
}

function forageFit(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  opportunityMix:
    RecommenderV3ResolvedProfile["daily_preference"]["opportunity_mix"],
): number {
  const primaryMatch = profile.forage_tags.includes(
    seasonal.monthly_baseline.primary_forage,
  );
  const secondaryMatch = seasonal.monthly_baseline.secondary_forage != null &&
    profile.forage_tags.includes(seasonal.monthly_baseline.secondary_forage);

  let primaryWeight: number;
  let secondaryWeight: number;

  switch (opportunityMix) {
    case "conservative":
      primaryWeight = 0.55;
      secondaryWeight = 0.25;
      break;
    case "aggressive":
      primaryWeight = 0.9;
      secondaryWeight = 0.45;
      break;
    case "balanced":
    default:
      primaryWeight = 1.1;
      secondaryWeight = 0.55;
      break;
  }

  if (primaryMatch) return primaryWeight;
  if (secondaryMatch) return secondaryWeight;
  return 0;
}

/** Sub-cent tiebreak for ordering only (largemouth); favors tighter daily column alignment. */
function largemouthSortSkew(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
): number {
  if (seasonal.species !== "largemouth_bass") return 0;
  const order = resolved.daily_preference.column_preference_order;
  const idxPrimary = order.indexOf(profile.primary_column);
  const idxSecondary = profile.secondary_column != null
    ? order.indexOf(profile.secondary_column)
    : -1;
  const candidates = [idxPrimary, idxSecondary].filter((i) => i >= 0);
  const best = candidates.length > 0 ? Math.min(...candidates) : 9;
  return (order.length - best) * 0.00012;
}

/**
 * Northern pike: micro ordering nudges so rounded audit scores separate honest
 * winners (winter metal, summer reaction tools, river headline flies) without
 * changing monthly pools or adding arbitrary global tie-breakers.
 */
function pikeSortSkew(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
): number {
  if (seasonal.species !== "northern_pike") return 0;
  const lake = seasonal.context === "freshwater_lake_pond";
  const river = seasonal.context === "freshwater_river";
  const m = seasonal.month;
  let s = 0;

  // Late fall through winter lakes: metal and pause tools edge swimbaits when totals stack.
  if (
    lake && (m === 1 || m === 2 || m === 11 || m === 12) &&
    profile.gear_mode === "lure"
  ) {
    if (profile.id === "blade_bait") s += 0.027;
    if (profile.id === "casting_spoon") s += 0.017;
    if (profile.id === "suspending_jerkbait") s += 0.015;
    if (profile.id === "paddle_tail_swimbait") s -= 0.012;
    if (profile.id === "large_profile_pike_swimbait") s -= 0.007;
  }

  // Late fall / winter lake flies: jig leech over strip leech when both score as cold still-water leech reads.
  if (
    lake && (m === 1 || m === 2 || m === 11 || m === 12) &&
    profile.gear_mode === "fly"
  ) {
    if (profile.id === "balanced_leech") s += 0.022;
    if (profile.id === "rabbit_strip_leech") s -= 0.016;
  }

  // Clear northern lakes Mar–May: moving paddle-tail swim edges soft-jerk dart ties in prespawn/postspawn.
  if (
    lake &&
    m >= 3 &&
    m <= 5 &&
    clarity === "clear" &&
    profile.gear_mode === "lure"
  ) {
    if (profile.id === "paddle_tail_swimbait") s += 0.021;
    if (profile.id === "soft_jerkbait") s -= 0.015;
  }

  // Spring pike rivers: current-friendly paddle swim beats soft-jerk ties in Apr–May transition rows.
  if (river && m >= 3 && m <= 5 && profile.gear_mode === "lure") {
    if (profile.id === "paddle_tail_swimbait") s += 0.018;
    if (profile.id === "soft_jerkbait") s -= 0.013;
  }

  // Summer peak lakes: spinner flash separates from paddle-tail backups when both sit as
  // stratified-season backups (reaction flag alone can stay off on subtle midsummer days).
  if (lake && (m === 6 || m === 7) && profile.gear_mode === "lure") {
    if (profile.id === "spinnerbait") s += 0.024;
    if (profile.id === "paddle_tail_swimbait") s -= 0.014;
  }

  // Summer peak rivers: keep large pike streamer ahead of generic clouser when scores tie.
  if (river && (m === 6 || m === 7) && profile.gear_mode === "fly") {
    if (profile.id === "large_articulated_pike_streamer") s += 0.018;
    if (profile.id === "pike_bunny_streamer") s += 0.008;
    if (profile.id === "clouser_minnow") s -= 0.012;
  }

  // Clear northern lakes in spawn / early postspawn: open-water walker edges hollow frog when both surface.
  if (
    lake &&
    (m === 4 || m === 5) &&
    clarity === "clear" &&
    profile.gear_mode === "lure" &&
    profile.is_surface &&
    daily.surface_window !== "closed"
  ) {
    if (profile.id === "walking_topwater") s += 0.017;
    if (profile.id === "hollow_body_frog") s += 0.009;
  }

  return s;
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
    !archetypeFitsMonthlyBaselineLanes(
      profile,
      seasonal.monthly_baseline.allowed_columns,
      seasonal.monthly_baseline.allowed_paces,
      seasonal.monthly_baseline.allowed_presence,
    )
  ) {
    return null;
  }
  if (profile.is_surface && !resolved.daily_preference.surface_allowed_today) {
    return null;
  }

  const strictMonthlyFit = archetypeFitsStrictMonthlyBaselineLanes(
    profile,
    seasonal.monthly_baseline.allowed_columns,
    seasonal.monthly_baseline.allowed_paces,
    seasonal.monthly_baseline.allowed_presence,
  );
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
  const practicalFit = practicalityFit(
    profile,
    seasonal,
    daily,
    resolved,
    clarity,
  );
  if (practicalFit <= -100) return null;
  const monthlyPrimary = monthlyPrimaryFit(profile, seasonal, resolved);
  const forage = forageFit(
    profile,
    seasonal,
    resolved.daily_preference.opportunity_mix,
  );
  let clarityScore = clarityFit(profile, clarity);
  if (
    seasonal.species === "trout" &&
    seasonal.context === "freshwater_river" &&
    clarity === "stained" &&
    (seasonal.month === 7 || seasonal.month === 8) &&
    profile.gear_mode === "lure" &&
    profile.id === "hair_jig"
  ) {
    // Stained midsummer western/tailwater reads: keep the headline off generic hair
    // when minnow / leech / sculpin lanes are the honest story (Idaho runoff matrix).
    clarityScore -= 0.9;
  }
  const trueForageFit = roundScore(forage);
  const lightBucket = normalizeLightBucketV3(lightLabel);
  const colorDecision = resolveColorDecisionV3(clarity, lightBucket);
  const breakdown: RecommenderV3ScoreBreakdown[] = [
    {
      code: "strict_monthly_lane_fit",
      value: strictMonthlyFit ? 0.2 : -0.85,
      detail: strictMonthlyFit
        ? "Its lane shape stays tightly inside the monthly biological profile."
        : "It remains a valid seasonal backup, but sits outside the month's cleanest lane shape.",
    },
    {
      code: "column_fit",
      value: roundScore(columnFit),
      detail: dimensionDetail(
        "column",
        columnFit,
        resolved.daily_preference.preferred_column,
      ),
    },
    {
      code: "pace_fit",
      value: roundScore(paceFit),
      detail: dimensionDetail(
        "pace",
        paceFit,
        resolved.daily_preference.preferred_pace,
      ),
    },
    {
      code: "presence_fit",
      value: roundScore(presenceFit),
      detail: dimensionDetail(
        "presence",
        presenceFit,
        resolved.daily_preference.preferred_presence,
      ),
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
      detail:
        "It sits inside the strongest monthly archetype lane for this window.",
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
  const sort_score = tacticalFit + practicalFit + monthlyPrimary + forage +
    clarityScore +
    largemouthSortSkew(profile, seasonal, resolved) +
    pikeSortSkew(profile, seasonal, daily, clarity);
  const score = roundScore(sort_score);
  const opportunityMixFit = roundScore(monthlyPrimary + forage);

  return {
    profile,
    score,
    sort_score,
    tactical_fit: roundScore(tacticalFit),
    practicality_fit: roundScore(practicalFit),
    forage_fit: trueForageFit,
    clarity_fit: roundScore(clarityScore),
    diversity_bonus: roundScore(0),
    color_theme: colorDecision.color_theme,
    color_recommendations: firstThreeColors(colorDecision.color_theme),
    resolved_color_decision: colorDecision,
    breakdown,
    why_chosen: buildWhyChosen(
      profile,
      breakdown,
      seasonal,
      daily,
      resolved,
      clarity,
      0,
    ),
    how_to_fish_by_role: [
      buildHowToFish(profile, daily, resolved, 0),
      buildHowToFish(profile, daily, resolved, 1),
      buildHowToFish(profile, daily, resolved, 2),
    ],
  };
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
    .map((profile) =>
      scoreProfile(
        profile,
        seasonal,
        resolved,
        daily,
        clarity,
        lightLabel,
      )
    )
    .filter((candidate): candidate is ScoredCandidate => candidate != null);

  return selectTopThreeCandidates(scored, resolved, daily, seasonal, clarity);
}
export function scoreLureCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
  lightLabel: string | null,
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
