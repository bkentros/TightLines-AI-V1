import type {
  RecommenderV3ArchetypeProfile,
  RecommenderV3DailyPayload,
  RecommenderV3RankedArchetype,
  RecommenderV3ResolvedProfile,
  RecommenderV3ScoreBreakdown,
  RecommenderV3SeasonalRow,
  TacticalColumnV3,
} from "./contracts.ts";
import type { ScoredCandidate } from "./scoringTypes.ts";

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

function matchesPreferredColumn(
  profile: RecommenderV3ArchetypeProfile,
  preferred: TacticalColumnV3,
): boolean {
  return profile.primary_column === preferred || profile.secondary_column === preferred;
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
        : seasonal.monthly_baseline.surface_seasonally_possible
        ? "The monthly surface window is still alive today, even with a little ripple on top."
        : "Even with a little ripple, the surface lane is still open enough to matter.",
    );
  }

  if (
    !profile.is_surface &&
    resolved.daily_preference.surface_window === "closed" &&
    (profile.primary_column === "upper" || profile.primary_column === "mid")
  ) {
    parts.push("With the highest lane shut down, this keeps you just under the cleaner active zone.");
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

  if (!daily.suppress_fast_presentations && !isSlowLane(profile) && windNote) {
    parts.push(windNote);
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

export function buildWhyChosen(
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
  const topDriver = breakdown
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)[0];
  const parts = uniqueNonEmpty([
    topDriver?.code === "monthly_primary_fit" || topDriver?.code === "forage_fit"
      ? seasonalReason ?? hook
      : dailyReasons[0] ?? seasonalReason ?? hook,
    topDriver?.code === "practicality_fit" || topDriver?.code === "column_fit" ||
        topDriver?.code === "pace_fit" || topDriver?.code === "presence_fit"
      ? dailyReasons[0] ?? breakdownDrivers[0]
      : breakdownDrivers[0],
    topDriver?.code === "monthly_primary_fit" || topDriver?.code === "forage_fit"
      ? dailyReasons[0]
      : seasonalReason ?? hook,
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
  return profile.how_to_fish_variants[roleIndex] ?? profile.how_to_fish_template;
}

export function buildHowToFish(
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

export function buildSelectionRoleWhyChosen(
  candidate: ScoredCandidate,
  selectionRole: RecommenderV3RankedArchetype["selection_role"],
): string {
  return `${candidate.why_chosen}${buildSelectionRoleNote(candidate, selectionRole)}`.trim();
}
