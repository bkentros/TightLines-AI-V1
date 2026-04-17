import type { WaterClarity } from "../contracts/input.ts";
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

const DIVERSITY_WHY_SUFFIX = "It rounds out the lineup with a different look.";

/** Lead phrase for the positive top breakdown driver (Section 5A). */
export function phraseForTopDriver(
  code: string | undefined,
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  _daily: RecommenderV3DailyPayload,
  _resolved: RecommenderV3ResolvedProfile,
  waterClarity: WaterClarity,
): string | null {
  switch (code) {
    case "monthly_primary_fit": {
      const ids = profile.gear_mode === "lure"
        ? seasonal.primary_lure_ids
        : seasonal.primary_fly_ids;
      if (!ids || ids.length <= 1) return null;
      return "It's one of this month's lead lanes here.";
    }
    case "strict_monthly_lane_fit":
      return "It sits inside this month's authored lane.";
    case "forage_fit": {
      // Only credit the forage when the archetype actually imitates it.
      // `forageFit` already requires the intersection to be non-empty, but
      // this guard keeps the copy honest if upstream logic changes.
      const primaryForage = seasonal.monthly_baseline.primary_forage;
      const secondaryForage = seasonal.monthly_baseline.secondary_forage;
      if (profile.forage_tags.includes(primaryForage)) {
        return `It imitates the month's ${primaryForage.replace(/_/g, " ")} forage focus.`;
      }
      if (secondaryForage != null && profile.forage_tags.includes(secondaryForage)) {
        return `It matches the secondary ${secondaryForage.replace(/_/g, " ")} forage this window still supports.`;
      }
      return null;
    }
    case "practicality_fit":
      return "It fishes cleanly for today's conditions.";
    case "column_fit":
    case "pace_fit":
    case "presence_fit":
      return "It matches the column/pace the conditions push toward today.";
    case "clarity_fit": {
      switch (waterClarity) {
        case "clear":
          return "It reads clean in clear water today.";
        case "stained":
          return "It stands out in stained water today.";
        case "dirty":
          return "It stays visible in dirty water today.";
        default:
          return null;
      }
    }
    default:
      return null;
  }
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

function matchesPreferredColumn(
  profile: RecommenderV3ArchetypeProfile,
  preferred: TacticalColumnV3,
): boolean {
  return profile.primary_column === preferred || profile.secondary_column === preferred;
}

/**
 * Tier of an archetype's column overlap with the day's preferred column.
 * - `"primary"`   → `profile.primary_column === preferred`
 * - `"secondary"` → `profile.secondary_column === preferred`
 * - `"tertiary"`  → `profile.column_range[2]` (authored tertiary) matches the preferred column
 * - `null`        → no overlap
 *
 * Tertiary matches used to be silently dropped (`matchesPreferredColumn`
 * returned `false` for them); per
 * `docs/audits/recommender-v3/_correction_plan.md` §3.5 tertiary overlaps now
 * fire a softer hint so the copy layer can still cite the overlap without
 * claiming the archetype leads with that column.
 */
function preferredColumnMatchTier(
  profile: RecommenderV3ArchetypeProfile,
  preferred: TacticalColumnV3,
): "primary" | "secondary" | "tertiary" | null {
  if (profile.primary_column === preferred) return "primary";
  if (profile.secondary_column === preferred) return "secondary";
  const tertiary = profile.column_range[2];
  if (tertiary != null && tertiary === preferred) return "tertiary";
  return null;
}

function targetColumnForProfile(
  profile: RecommenderV3ArchetypeProfile,
  resolved: RecommenderV3ResolvedProfile,
): TacticalColumnV3 {
  if (profile.is_surface) return "surface";
  // Primary, secondary, or tertiary column all satisfy "the archetype can
  // legitimately reach today's preferred column" — return the day's preferred
  // column so downstream copy lands inside that zone.
  if (preferredColumnMatchTier(profile, resolved.daily_preference.preferred_column) != null) {
    return resolved.daily_preference.preferred_column;
  }
  return profile.primary_column;
}

/**
 * Returns true when the archetype's authored `forage_tags` (aka
 * `forage_matches` in the builder) actually include the cited forage key.
 *
 * Forage-specific why-chosen phrases should only fire when the archetype
 * honestly imitates the forage being credited. Prior behavior gated on
 * `tactical_lane` alone, which produced copy like "this window is still built
 * around bluegill-and-perch feeding lanes" for an archetype whose forage
 * profile didn't actually touch bluegill_perch.
 */
function archetypeImitatesForage(
  profile: RecommenderV3ArchetypeProfile,
  forage: RecommenderV3SeasonalRow["monthly_baseline"]["primary_forage"],
): boolean {
  return profile.forage_tags.includes(forage);
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
  const primaryForage = seasonal.monthly_baseline.primary_forage;
  // Gate each forage-specific phrase on the archetype actually imitating the
  // cited forage. Otherwise we'd cite (e.g.) bluegill-and-perch for a lure
  // whose forage_tags don't include it — the "tactical_lane alone" branch
  // that previously emitted these lines was the pike-01 false-attribution
  // source called out in the audit.
  if (
    primaryForage === "bluegill_perch" &&
    (profile.tactical_lane === "horizontal_search" || profile.tactical_lane === "cover_weedless") &&
    archetypeImitatesForage(profile, "bluegill_perch")
  ) {
    return "This window is still built around bluegill-and-perch feeding lanes.";
  }
  if (
    primaryForage === "crawfish" &&
    (profile.tactical_lane === "bottom_contact" || profile.tactical_lane === "cover_weedless") &&
    archetypeImitatesForage(profile, "crawfish")
  ) {
    return "That keeps a crawfish-first look in the water for the month.";
  }
  if (
    primaryForage === "baitfish" &&
    (isMovingLane(profile) || profile.tactical_lane === "pike_big_profile") &&
    archetypeImitatesForage(profile, "baitfish")
  ) {
    return "The month is still baitfish-forward, and this stays inside that search lane.";
  }
  if (
    primaryForage === "leech_worm" &&
    (isSlowLane(profile) || profile.tactical_lane === "fly_bottom") &&
    archetypeImitatesForage(profile, "leech_worm")
  ) {
    return "That fits the slower worm-and-leech food profile this window still allows.";
  }
  const columnTier = preferredColumnMatchTier(
    profile,
    resolved.daily_preference.preferred_column,
  );
  if (columnTier === "primary" || columnTier === "secondary") {
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
  if (columnTier === "tertiary") {
    // Softer hint: the archetype can still reach today's preferred column,
    // but not as its lead zone. Matches the §3.5 intent — tertiary overlap
    // is real but deserves a hedged sentence, not a primary-strength claim.
    switch (resolved.daily_preference.preferred_column) {
      case "bottom":
        return "It can still drop into today's lower zone when the moment calls for it.";
      case "upper":
        return "It can still work today's higher zone when a more open read opens up.";
      case "mid":
        return "It can still cover the mid band today even though that is not its lead zone.";
      case "surface":
      default:
        return null;
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
  waterClarity: WaterClarity,
  changeupBonus: number,
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
  const driverPhrase = phraseForTopDriver(
    topDriver?.code,
    profile,
    seasonal,
    daily,
    resolved,
    waterClarity,
  );
  const legacySlot1 = topDriver?.code === "monthly_primary_fit" ||
      topDriver?.code === "forage_fit"
    ? seasonalReason ?? hook
    : dailyReasons[0] ?? seasonalReason ?? hook;
  const parts = uniqueNonEmpty([
    driverPhrase ?? legacySlot1,
    topDriver?.code === "practicality_fit" || topDriver?.code === "column_fit" ||
        topDriver?.code === "pace_fit" || topDriver?.code === "presence_fit"
      ? dailyReasons[0] ?? breakdownDrivers[0]
      : breakdownDrivers[0],
    topDriver?.code === "monthly_primary_fit" || topDriver?.code === "forage_fit"
      ? dailyReasons[0]
      : seasonalReason ?? hook,
  ]);
  let text = parts.slice(0, 3).join(" ");
  if (
    changeupBonus > 0 &&
    !text.toLowerCase().includes("rounds out the lineup")
  ) {
    text = `${text} ${DIVERSITY_WHY_SUFFIX}`;
  }
  return text.trim();
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

/**
 * Detect an explicit water-column cue inside a how_to_fish variant string so
 * downstream copy can avoid contradicting the selected technique.
 *
 * Returns the implied column when a strong cue is present, or `null` when the
 * text is column-neutral. The matchers are intentionally conservative — they
 * only fire on unambiguous phrases used in authored archetype variants. If a
 * variant is ambiguous, it stays column-neutral and the normal column hint
 * runs as before.
 */
function detectImpliedColumnFromText(text: string): TacticalColumnV3 | null {
  const t = text.toLowerCase();

  // Surface cues — topwater and wake tools.
  if (
    /\b(on the surface|on top|topwater|walk[-\s]?the[-\s]?dog|skim(?:ming)?\s+the\s+(?:top|surface)|wake\s+it|skate\s+it)\b/
      .test(t)
  ) {
    return "surface";
  }

  // Bottom cues — drag, crawl, hop, or slow-roll near/along/on the bottom.
  if (
    /\b(along the bottom|on the bottom|near the bottom|off the bottom|tick(?:ing)? (?:it )?along|hop(?:ping)? (?:it )?(?:along|near) (?:the )?bottom|drag(?:ging)? (?:it )?(?:along|across|through) (?:the )?bottom|crawl(?:ing)? (?:it )?(?:along|through)? ?(?:the )?bottom|slow[-\s]?roll(?:ing)? (?:it )?(?:near|along|across) (?:the )?bottom|dead[-\s]?drift(?:ing)? near the bottom|scratch(?:ing)? (?:the )?substrate)\b/
      .test(t)
  ) {
    return "bottom";
  }

  // Upper cues — keep it shallow / high / just under the surface.
  if (
    /\b(just under the surface|near the top|high in the (?:water )?column|upper (?:water )?column|stay(?:ing)? shallow|keep it shallow|just below the surface)\b/
      .test(t)
  ) {
    return "upper";
  }

  // Mid cues — explicit mid-depth / mid-column.
  if (
    /\b(mid[-\s]?depth|mid[-\s]?column|middle of the (?:water )?column|suspend(?:ed|ing)? (?:it )?)\b/
      .test(t)
  ) {
    return "mid";
  }

  return null;
}

function buildColumnHint(
  profile: RecommenderV3ArchetypeProfile,
  resolved: RecommenderV3ResolvedProfile,
  selectedTemplate: string,
): string {
  // Suppress the hint when the selected how_to_fish template already contains
  // an explicit column cue. Appending a hint on top of "drag it along the
  // bottom" either duplicates (when the cues agree) or flatly contradicts
  // (when they disagree), both of which reduce copy trust. This is the
  // text-inspection half of the column-awareness fix; the structural half is
  // `selectHowToFishTemplate` preferring variants that match the day's column.
  if (detectImpliedColumnFromText(selectedTemplate) != null) {
    return "";
  }

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

function preferredColumnsForDay(
  resolved: RecommenderV3ResolvedProfile,
): readonly TacticalColumnV3[] {
  const pref = resolved.daily_preference;
  const primary = pref.preferred_column;
  const secondary = pref.secondary_column;
  return secondary && secondary !== primary ? [primary, secondary] : [primary];
}

/**
 * Score a variant template against the day's column preference.
 *  +2 = variant's implied column matches the day's primary preferred column
 *  +1 = variant's implied column matches the day's secondary column (or is
 *       consistent with the archetype's own `primary_column`)
 *   0 = column-neutral variant (ambiguous, safe default)
 *  -2 = variant's implied column contradicts every preferred column for today
 */
function variantColumnScore(
  template: string,
  profile: RecommenderV3ArchetypeProfile,
  preferredColumns: readonly TacticalColumnV3[],
): number {
  const implied = detectImpliedColumnFromText(template);
  if (implied == null) return 0;
  if (preferredColumns[0] === implied) return 2;
  if (preferredColumns.length > 1 && preferredColumns[1] === implied) return 1;
  if (profile.primary_column === implied) return 1;
  return -2;
}

function selectHowToFishTemplate(
  profile: RecommenderV3ArchetypeProfile,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
  roleIndex: 0 | 1 | 2,
): string {
  const variants = profile.how_to_fish_variants;

  // Start with the existing role-driven pick so behavior is preserved when
  // no column-aware alternative is clearly better.
  let baseIndex: 0 | 1 | 2 = roleIndex;
  if (daily.suppress_fast_presentations) {
    baseIndex = 0;
  } else if (daily.high_visibility_needed) {
    baseIndex = 1;
  } else if (
    daily.reaction_window === "on" && isMovingLane(profile) && roleIndex === 0
  ) {
    baseIndex = 2;
  }

  const preferredColumns = preferredColumnsForDay(resolved);
  const baseTemplate = variants[baseIndex] ?? profile.how_to_fish_template;
  const baseScore = variantColumnScore(baseTemplate, profile, preferredColumns);

  // If the role-chosen variant already agrees with (or is neutral to) the
  // day's column, keep it. Only override when the role pick actively
  // contradicts today's column and a better variant exists.
  if (baseScore >= 0) return baseTemplate;

  let bestIndex: 0 | 1 | 2 = baseIndex;
  let bestScore = baseScore;
  for (let i = 0; i < variants.length; i++) {
    const candidate = variants[i];
    if (!candidate || i === baseIndex) continue;
    const score = variantColumnScore(candidate, profile, preferredColumns);
    if (score > bestScore) {
      bestScore = score;
      bestIndex = i as 0 | 1 | 2;
    }
  }

  return variants[bestIndex] ?? profile.how_to_fish_template;
}

export function buildHowToFish(
  profile: RecommenderV3ArchetypeProfile,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
  roleIndex: 0 | 1 | 2,
): string {
  const template = selectHowToFishTemplate(profile, daily, resolved, roleIndex);
  const paceHint = buildPaceHint(profile, resolved);
  const columnHint = buildColumnHint(profile, resolved, template);
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

/**
 * Short role-scoped opener prepended to `why_chosen` so the three trio entries
 * each start with a distinct first sentence. Keeps the substance of the
 * downstream driver/seasonal phrases untouched — the opener is a one-line
 * frame in front of the existing copy. See
 * `docs/audits/recommender-v3/_correction_plan.md` §3.6.
 */
function buildSelectionRoleOpener(
  selectionRole: RecommenderV3RankedArchetype["selection_role"],
): string {
  switch (selectionRole) {
    case "strong_alternate":
      return "Behind today's lead look, this stays inside the day's window.";
    case "change_up":
      return "Rounding out the trio as a change-up angle.";
    case "best_match":
    default:
      return "This is today's top overall read.";
  }
}

export function buildSelectionRoleWhyChosen(
  candidate: ScoredCandidate,
  selectionRole: RecommenderV3RankedArchetype["selection_role"],
): string {
  const opener = buildSelectionRoleOpener(selectionRole);
  const body = candidate.why_chosen.trim();
  const note = buildSelectionRoleNote(candidate, selectionRole);
  return `${opener} ${body}${note}`.trim();
}
