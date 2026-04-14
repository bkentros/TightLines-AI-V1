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
  how_to_fish_by_role: [string, string, string];
};

const WORM_HEAVY_FAMILIES = new Set([
  "worm",
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

function matchesPreferredColumn(
  profile: RecommenderV3ArchetypeProfile,
  preferred: TacticalColumnV3,
): boolean {
  return profile.primary_column === preferred || profile.secondary_column === preferred;
}

function uniqueNonEmpty(parts: readonly (string | null | undefined)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of parts) {
    const value = part?.trim();
    if (!value || seen.has(value)) continue;
    seen.add(value);
    out.push(value);
  }
  return out;
}

function pickNoteByKeywords(
  notes: readonly string[],
  keywords: readonly string[],
): string | null {
  for (const note of notes) {
    const lower = note.toLowerCase();
    if (keywords.some((keyword) => lower.includes(keyword))) return note;
  }
  return null;
}

function isMovingLane(profile: RecommenderV3ArchetypeProfile): boolean {
  return profile.tactical_lane === "horizontal_search" ||
    profile.tactical_lane === "reaction_mid_column" ||
    profile.tactical_lane === "fly_baitfish" ||
    profile.tactical_lane === "surface" ||
    profile.tactical_lane === "fly_surface";
}

function isSlowLane(profile: RecommenderV3ArchetypeProfile): boolean {
  return profile.tactical_lane === "bottom_contact" ||
    profile.tactical_lane === "finesse_subtle" ||
    profile.tactical_lane === "fly_bottom";
}

function isSurfaceLane(profile: RecommenderV3ArchetypeProfile): boolean {
  return profile.tactical_lane === "surface" || profile.tactical_lane === "fly_surface";
}

function lanePace(profile: RecommenderV3ArchetypeProfile): "slow" | "medium" | "fast" {
  if (isSlowLane(profile)) return "slow";
  if (
    profile.tactical_lane === "reaction_mid_column" ||
    isSurfaceLane(profile) ||
    profile.tactical_lane === "pike_big_profile"
  ) {
    return "fast";
  }
  return "medium";
}

function targetColumnForProfile(
  profile: RecommenderV3ArchetypeProfile,
  resolved: RecommenderV3ResolvedProfile,
): TacticalColumnV3 {
  if (profile.is_surface) return "surface";
  if (matchesPreferredColumn(profile, resolved.daily_preference.preferred_column)) {
    return resolved.daily_preference.preferred_column;
  }
  return profile.primary_column;
}

function buildSeasonalReason(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
): string | null {
  const monthlyPrimaryIds = profile.gear_mode === "lure"
    ? seasonal.primary_lure_ids
    : seasonal.primary_fly_ids;
  if (monthlyPrimaryIds?.includes(profile.id as never)) {
    return "It is one of the lead monthly looks for this exact seasonal window.";
  }
  if (
    seasonal.monthly_baseline.primary_forage === "bluegill_perch" &&
    (profile.tactical_lane === "horizontal_search" || profile.tactical_lane === "cover_weedless")
  ) {
    return "This window is still built around bluegill-and-perch feeding lanes.";
  }
  if (
    seasonal.monthly_baseline.primary_forage === "crawfish" &&
    (profile.tactical_lane === "bottom_contact" || profile.tactical_lane === "cover_weedless")
  ) {
    return "That keeps a crawfish-first look in the water for the month.";
  }
  if (
    seasonal.monthly_baseline.primary_forage === "baitfish" &&
    (isMovingLane(profile) || profile.tactical_lane === "pike_big_profile")
  ) {
    return "The month is still baitfish-forward, and this stays inside that search lane.";
  }
  if (
    seasonal.monthly_baseline.primary_forage === "leech_worm" &&
    (isSlowLane(profile) || profile.tactical_lane === "fly_bottom")
  ) {
    return "That fits the slower worm-and-leech food profile this window still allows.";
  }
  if (matchesPreferredColumn(profile, resolved.daily_preference.preferred_column)) {
    switch (resolved.daily_preference.preferred_column) {
      case "bottom":
        return "It stays low in the zone where this day still wants fish to hold.";
      case "upper":
        return "It stays high enough in the zone to match the day's more open positioning.";
      case "surface":
        return "It keeps the presentation right at the top where the monthly window still allows it.";
      case "mid":
      default:
        return "It stays in the middle band where the seasonal setup is most stable today.";
    }
  }
  return null;
}

function buildDailyReasons(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
): string[] {
  const temperatureNote = pickNoteByKeywords(daily.notes, [
    "warming",
    "cooling",
    "cooldown",
    "temperature metabolism",
  ]);
  const pressureNote = pickNoteByKeywords(daily.notes, ["pressure"]);
  const windNote = pickNoteByKeywords(daily.notes, ["wind", "chop"]);
  const lightNote = pickNoteByKeywords(daily.notes, ["light", "overcast", "glare", "bright"]);
  const precipNote = pickNoteByKeywords(daily.notes, ["precipitation", "rain"]);
  const runoffNote = pickNoteByKeywords(daily.notes, ["runoff", "flow", "river"]);
  const visibilityNote = pickNoteByKeywords(daily.notes, ["visibility", "dirty water"]);
  const parts: string[] = [];

  if (profile.is_surface && resolved.daily_preference.surface_allowed_today) {
    parts.push(
      resolved.daily_preference.surface_window === "clean"
        ? "Low disturbance is keeping a true surface lane open today."
        : "Even with a little ripple, the surface lane is still open enough to matter.",
    );
  }

  if (
    !profile.is_surface &&
    resolved.daily_preference.surface_window === "closed" &&
    (profile.primary_column === "upper" || profile.primary_column === "mid")
  ) {
    parts.push("With true surface suppressed, this keeps you just under the cleaner active lane.");
  }

  if (daily.reaction_window === "on" && isMovingLane(profile)) {
    parts.push(
      pressureNote ??
        lightNote ??
        temperatureNote ??
        "The stronger feeding window supports a moving search presentation today.",
    );
  }

  if (daily.suppress_fast_presentations && isSlowLane(profile)) {
    parts.push(
      temperatureNote ??
        pressureNote ??
        lightNote ??
        "The tighter daily setup rewards a slower, cleaner presentation.",
    );
  }

  if (daily.high_visibility_needed && profile.presence !== "subtle") {
    parts.push(
      visibilityNote ??
        runoffNote ??
        "Reduced visibility supports a stronger profile fish can find more easily.",
    );
  }

  if (seasonal.context === "freshwater_river" && profile.current_friendly) {
    parts.push(
      runoffNote ??
        precipNote ??
        "It stays practical in current seams and river lanes when flow still matters.",
    );
  }

  if (
    parts.length === 0 &&
    seasonal.monthly_baseline.surface_seasonally_possible &&
    profile.is_surface
  ) {
    parts.push("The month still leaves a real surface opportunity in the system.");
  }

  if (parts.length === 0 && daily.notes.length > 0) {
    parts.push(daily.notes[0]!);
  }

  return uniqueNonEmpty(parts).slice(0, 2);
}

function selectWhyHook(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
): string {
  const forageAligned = profile.forage_tags.includes(seasonal.monthly_baseline.primary_forage) ||
    (seasonal.monthly_baseline.secondary_forage != null &&
      profile.forage_tags.includes(seasonal.monthly_baseline.secondary_forage));
  if (forageAligned && profile.why_hooks[1]) {
    return profile.why_hooks[1];
  }
  return profile.why_hooks[0] ?? profile.display_name;
}

function buildWhyChosen(
  profile: RecommenderV3ArchetypeProfile,
  breakdown: readonly RecommenderV3ScoreBreakdown[],
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
): string {
  const breakdownDrivers = breakdown
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .map((item) => item.detail);
  const hook = selectWhyHook(profile, seasonal);
  const dailyReasons = buildDailyReasons(profile, seasonal, daily, resolved);
  const seasonalReason = buildSeasonalReason(profile, seasonal, resolved);
  // Lead with the biological/seasonal reason so users hear the "why this lure/fly"
  // story first.  Daily condition context follows, then a tactical fit confirmation
  // from the breakdown as supporting detail.
  const parts = uniqueNonEmpty([
    seasonalReason ?? hook,
    dailyReasons[0],
    breakdownDrivers[0],
  ]);
  return parts.slice(0, 3).join(" ");
}

function buildPaceHint(
  profile: RecommenderV3ArchetypeProfile,
  resolved: RecommenderV3ResolvedProfile,
): string {
  switch (resolved.daily_preference.preferred_pace) {
    case "slow":
      return profile.is_surface
        ? " Work it with longer pauses."
        : " Slow down and lengthen the pause.";
    case "fast":
      return isSlowLane(profile)
        ? " Keep it moving just enough to stay lively."
        : " Fish it with a more active cadence.";
    case "medium":
    default:
      return "";
  }
}

function buildColumnHint(
  profile: RecommenderV3ArchetypeProfile,
  resolved: RecommenderV3ResolvedProfile,
): string {
  switch (targetColumnForProfile(profile, resolved)) {
    case "bottom":
      return " Keep it low in the strike zone.";
    case "surface":
      return " Keep it on top.";
    case "upper":
      return " Keep it high in the zone.";
    case "mid":
    default:
      return "";
  }
}

/**
 * Selects which how-to-fish variant to use for a given recommendation slot.
 *
 * Condition-driven days (suppress, visibility, reaction) keep a consistent
 * tone across all three picks because all three presentations should reflect
 * the same constraint.  On neutral/balanced days the roleIndex rotates through
 * variants 0→1→2 so each recommendation slot has genuinely different
 * instruction text rather than all defaulting to the same variant.
 */
function selectHowToFishTemplate(
  profile: RecommenderV3ArchetypeProfile,
  daily: RecommenderV3DailyPayload,
  roleIndex: 0 | 1 | 2,
): string {
  if (daily.suppress_fast_presentations) {
    return profile.how_to_fish_variants[0] ?? profile.how_to_fish_template;
  }
  if (daily.high_visibility_needed) {
    return profile.how_to_fish_variants[1] ??
      profile.how_to_fish_variants[0] ??
      profile.how_to_fish_template;
  }
  if (daily.reaction_window === "on" && isMovingLane(profile) && roleIndex === 0) {
    return profile.how_to_fish_variants[2] ?? profile.how_to_fish_template;
  }
  // Neutral conditions: rotate by selection role to guarantee differentiated text
  return profile.how_to_fish_variants[roleIndex] ?? profile.how_to_fish_template;
}

function buildHowToFish(
  profile: RecommenderV3ArchetypeProfile,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
  roleIndex: 0 | 1 | 2,
): string {
  const template = selectHowToFishTemplate(profile, daily, roleIndex);
  const paceHint = buildPaceHint(profile, resolved);
  const columnHint = buildColumnHint(profile, resolved);
  return `${template}${paceHint || columnHint}`.trim();
}

function buildSelectionRoleNote(
  candidate: ScoredCandidate,
  selectionRole: RecommenderV3RankedArchetype["selection_role"],
): string {
  switch (selectionRole) {
    case "strong_alternate":
      return ` It gives you a different ${candidate.profile.tactical_lane.replaceAll("_", " ")} look without leaving today's window.`;
    case "change_up":
      return " It is the cleaner change-up if the lead look does not convert.";
    case "best_match":
    default:
      return "";
  }
}

function buildSelectionRoleWhyChosen(
  candidate: ScoredCandidate,
  selectionRole: RecommenderV3RankedArchetype["selection_role"],
): string {
  return `${candidate.why_chosen}${buildSelectionRoleNote(candidate, selectionRole)}`.trim();
}

function conflictsWithLeadStory(
  lead: ScoredCandidate,
  candidate: ScoredCandidate,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
): boolean {
  const leadPace = lanePace(lead.profile);
  const candidatePace = lanePace(candidate.profile);
  const leadSurface = isSurfaceLane(lead.profile);
  const candidateSurface = isSurfaceLane(candidate.profile);
  const leadBottom = isSlowLane(lead.profile);
  const candidateBottom = isSlowLane(candidate.profile);

  if (
    (leadSurface && candidateBottom) || (leadBottom && candidateSurface)
  ) {
    if (
      daily.surface_window === "closed" ||
      resolved.daily_preference.preferred_presence === "subtle" ||
      daily.suppress_fast_presentations
    ) {
      return true;
    }
  }

  if (leadPace === "slow" && candidatePace === "fast" && daily.suppress_fast_presentations) {
    return true;
  }

  if (
    leadPace === "fast" &&
    candidatePace === "slow" &&
    resolved.daily_preference.preferred_pace === "fast"
  ) {
    return true;
  }

  return false;
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
    (profile.tactical_lane === "reaction_mid_column" ||
      profile.tactical_lane === "horizontal_search" ||
      profile.tactical_lane === "fly_baitfish")
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
  return fit;
}

/**
 * Forage weighting scales with opportunity_mix so that daily conditions still
 * dominate on aggressive and suppressive days while forage alignment becomes
 * the primary differentiator on neutral/balanced windows.
 *
 *  conservative → technique matters more than forage type (0.3 / 0.15)
 *  balanced     → forage is the key tipping-point on neutral days (1.1 / 0.55)
 *  aggressive   → fish chase more freely but forage still influences (0.5 / 0.25)
 */
function forageFit(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  opportunityMix: RecommenderV3ResolvedProfile["daily_preference"]["opportunity_mix"],
): number {
  const primaryMatch = profile.forage_tags.includes(
    seasonal.monthly_baseline.primary_forage,
  );
  const secondaryMatch =
    seasonal.monthly_baseline.secondary_forage != null &&
    profile.forage_tags.includes(seasonal.monthly_baseline.secondary_forage);

  let primaryWeight: number;
  let secondaryWeight: number;

  switch (opportunityMix) {
    case "conservative":
      primaryWeight = 0.3;
      secondaryWeight = 0.15;
      break;
    case "aggressive":
      primaryWeight = 0.5;
      secondaryWeight = 0.25;
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
  const forage = forageFit(profile, seasonal, resolved.daily_preference.opportunity_mix);
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
    why_chosen: buildWhyChosen(profile, breakdown, seasonal, daily, resolved),
    how_to_fish_by_role: [
      buildHowToFish(profile, daily, resolved, 0),
      buildHowToFish(profile, daily, resolved, 1),
      buildHowToFish(profile, daily, resolved, 2),
    ],
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
  if (!usedFamilies.has(candidate.profile.family_group)) bonus += 0.65;
  if (!usedLanes.has(candidate.profile.tactical_lane)) bonus += 0.3;
  if (!usedColumns.has(candidate.profile.primary_column)) bonus += 0.2;
  if (!usedPaces.has(candidate.profile.pace)) bonus += 0.15;
  if (!usedPresence.has(candidate.profile.presence)) bonus += 0.1;
  if (usedFamilies.has(candidate.profile.family_group)) bonus -= 0.35;
  if (usedLanes.has(candidate.profile.tactical_lane)) bonus -= 0.15;
  if (candidate.profile.family_group === lead.profile.family_group) bonus -= 0.55;
  if (candidate.profile.tactical_lane === lead.profile.tactical_lane) bonus -= 0.25;
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
    bonus += 0.25;
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
  const roleIndex: 0 | 1 | 2 = selectionRole === "best_match"
    ? 0
    : selectionRole === "strong_alternate"
    ? 1
    : 2;
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
    why_chosen: buildSelectionRoleWhyChosen(candidate, selectionRole),
    how_to_fish: candidate.how_to_fish_by_role[roleIndex],
    breakdown: candidate.breakdown,
  };
}

function selectTopThree(
  scored: ScoredCandidate[],
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
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
    const leadIsWormHeavy = isWormHeavyCandidate(selected[0]!);
    const bestRemainingRepeatsFamily = selected.some((entry) =>
      entry.profile.family_group === bestRemaining.profile.family_group
    );
    const bestRemainingRepeatsWormClass = isWormHeavyCandidate(bestRemaining) &&
      selected.some((entry) => isWormHeavyCandidate(entry));
    const coherentRemaining = remaining.filter((candidate) =>
      !conflictsWithLeadStory(selected[0]!, candidate, daily, resolved)
    );
    const bestCoherentRemaining = coherentRemaining[0] ?? bestRemaining;

    if (selected.length === 1) {
      const diverse = coherentRemaining
        .map((candidate) => ({
          candidate,
          bonus: changeupBonus(candidate, selected, resolved),
        }))
        .filter(({ candidate }) =>
          candidate.profile.family_group !== selected[0]!.profile.family_group &&
          (!leadIsWormHeavy || !isWormHeavyCandidate(candidate))
        )
        .sort((a, b) =>
          b.bonus - a.bonus ||
          compareScored(a.candidate, b.candidate)
        );
      const diversityThreshold = bestRemainingRepeatsFamily || bestRemainingRepeatsWormClass
        ? threshold + 1.4
        : threshold;
      if (
        diverse[0] &&
        diverse[0].candidate.score >= bestCoherentRemaining.score - diversityThreshold
      ) {
        chosen = diverse[0].candidate;
      } else {
        chosen = bestCoherentRemaining;
      }
    } else {
      const changeups = coherentRemaining
        .map((candidate) => ({
          candidate,
          bonus: changeupBonus(candidate, selected, resolved),
        }))
        .sort((a, b) =>
          b.bonus - a.bonus ||
          compareScored(a.candidate, b.candidate)
        );
      const changeupThreshold = bestRemainingRepeatsFamily || bestRemainingRepeatsWormClass
        ? threshold + 1.4
        : threshold + 0.2;
      if (
        changeups[0] &&
        changeups[0].bonus > 0 &&
        changeups[0].candidate.score >= bestCoherentRemaining.score - changeupThreshold
      ) {
        chosen = changeups[0].candidate;
      } else {
        chosen = bestCoherentRemaining;
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

  return selectTopThree(scored, resolved, daily);
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
