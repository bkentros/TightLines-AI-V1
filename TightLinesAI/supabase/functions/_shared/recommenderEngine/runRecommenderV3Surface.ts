import { analyzeSharedConditions } from "../howFishingEngine/analyzeSharedConditions.ts";
import type { SharedEngineRequest } from "../howFishingEngine/contracts/input.ts";
import { type SpeciesGroup } from "./contracts/species.ts";
import type { RecommenderRequest } from "./contracts/input.ts";
import {
  RECOMMENDER_FEATURE,
  type RankedFamily,
  type RecommenderResponse,
} from "./contracts/output.ts";
import type {
  ActivityLevel,
  AggressionLevel,
  BehaviorOutput,
  BehaviorSummaryRow,
  ColorFamily,
  DepthLane,
  FlashLevel,
  ForageMode,
  NoiseLevel,
  PresentationOutput,
  ProfileSize,
  SeasonalFlag,
  SpeedPreference,
  TriggerType,
} from "./contracts/behavior.ts";
import type { LureFamilyId, FlyFamilyId } from "./contracts/families.ts";
import { computeRecommenderV3 } from "./runRecommenderV3.ts";
import { normalizeLightBucketV3, resolveColorDecisionV3 } from "./v3/colorDecision.ts";
import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./v3/candidates/index.ts";
import type {
  RecommenderV3RankedArchetype,
  RecommenderV3Response,
  TacticalLaneV3,
} from "./v3/contracts.ts";

export function locationLocalMidnightIso(timezone: string, now = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = Object.fromEntries(formatter.formatToParts(now).map((p) => [p.type, p.value]));
  const y = Number(parts.year);
  const m = Number(parts.month);
  const d = Number(parts.day);
  const hh = Number(parts.hour);
  const mm = Number(parts.minute);
  const ss = Number(parts.second);
  const localNowUtcMillis = Date.UTC(y, m - 1, d, hh, mm, ss);
  const offsetMillis = localNowUtcMillis - now.getTime();
  const nextLocalMidnightUtcMillis = Date.UTC(y, m - 1, d + 1, 0, 0, 0) - offsetMillis;
  return new Date(nextLocalMidnightUtcMillis).toISOString();
}

function mapWaterColumnToDepthLane(
  column: RecommenderV3Response["resolved_profile"]["likely_water_column_today"],
): DepthLane {
  switch (column) {
    case "top":
    case "high_top":
      return "surface";
    case "high":
      return "upper";
    case "mid_high":
    case "mid":
      return "mid";
    case "mid_low":
      return "near_bottom";
    case "low":
    default:
      return "bottom";
  }
}

function forageBucketToMode(
  bucket: RecommenderV3Response["resolved_profile"]["primary_forage"] | undefined,
  depthLane: DepthLane,
): ForageMode | undefined {
  if (!bucket) return undefined;
  switch (bucket) {
    case "baitfish":
    case "bluegill_perch":
      return "baitfish";
    case "crawfish":
      return "crawfish";
    case "leech_worm":
      return "leech";
    case "insect_misc":
      return depthLane === "surface" ? "surface_prey" : "mixed";
  }
}

function activityFromV3(result: RecommenderV3Response): ActivityLevel {
  switch (result.resolved_profile.daily_posture_band) {
    case "suppressed":
      return result.daily_payload.posture_score_10 <= 1.6 ? "inactive" : "low";
    case "slightly_suppressed":
      return "low";
    case "neutral":
      return "neutral";
    case "slightly_aggressive":
      return "active";
    case "aggressive":
      return "aggressive";
  }
}

function aggressionFromV3(result: RecommenderV3Response): AggressionLevel {
  if (
    result.resolved_profile.daily_posture_band === "suppressed" ||
    result.resolved_profile.daily_posture_band === "slightly_suppressed"
  ) {
    return "passive";
  }
  if (result.resolved_profile.daily_posture_band === "neutral") {
    return result.resolved_profile.presentation_presence_today === "bold"
      ? "reactive"
      : "neutral";
  }
  return result.resolved_profile.presentation_presence_today === "bold"
    ? "aggressive"
    : "reactive";
}

function strikeZoneFromActivity(activity: ActivityLevel): BehaviorOutput["strike_zone"] {
  switch (activity) {
    case "inactive":
    case "low":
      return "narrow";
    case "neutral":
      return "moderate";
    case "active":
    case "aggressive":
      return "wide";
  }
}

function chaseRadiusFromActivity(activity: ActivityLevel): BehaviorOutput["chase_radius"] {
  switch (activity) {
    case "inactive":
    case "low":
      return "short";
    case "neutral":
      return "moderate";
    case "active":
    case "aggressive":
      return "long";
  }
}

function speedFromV3(result: RecommenderV3Response): SpeedPreference {
  const {
    daily_posture_band,
    presentation_presence_today,
  } = result.resolved_profile;
  if (daily_posture_band === "suppressed") {
    return presentation_presence_today === "bold" ? "slow" : "dead_slow";
  }
  if (daily_posture_band === "slightly_suppressed") return "slow";
  if (daily_posture_band === "neutral") {
    return presentation_presence_today === "subtle" ? "slow" : "moderate";
  }
  if (daily_posture_band === "aggressive" && presentation_presence_today === "bold") {
    return "fast";
  }
  return presentation_presence_today === "bold" ? "fast" : "moderate";
}

function noiseFromPresentation(
  style: RecommenderV3Response["resolved_profile"]["presentation_presence_today"],
): NoiseLevel {
  switch (style) {
    case "subtle":
      return "subtle";
    case "balanced":
      return "moderate";
    case "bold":
      return "loud";
  }
}

function flashFromPresentation(
  style: RecommenderV3Response["resolved_profile"]["presentation_presence_today"],
): FlashLevel {
  switch (style) {
    case "subtle":
      return "subtle";
    case "balanced":
      return "moderate";
    case "bold":
      return "heavy";
  }
}

function triggerFromV3(result: RecommenderV3Response): TriggerType {
  if (result.resolved_profile.presentation_presence_today === "subtle") {
    return "finesse";
  }
  if (
    (result.resolved_profile.daily_posture_band === "slightly_aggressive" ||
      result.resolved_profile.daily_posture_band === "aggressive") &&
    result.resolved_profile.presentation_presence_today === "bold"
  ) {
    return "aggressive";
  }
  if (
    result.resolved_profile.daily_posture_band === "slightly_aggressive" ||
    result.resolved_profile.daily_posture_band === "aggressive"
  ) {
    return "reaction";
  }
  return "natural_match";
}

function profileFromCandidate(candidate: RecommenderV3RankedArchetype): ProfileSize {
  switch (candidate.tactical_lane) {
    case "finesse_subtle":
      return "slim";
    case "pike_big_profile":
      return "bulky";
    default:
      return "medium";
  }
}

function motionFromCandidate(candidate: RecommenderV3RankedArchetype): PresentationOutput["motion"] {
  switch (candidate.tactical_lane) {
    case "surface":
      return "walk";
    case "fly_surface":
      return "pop";
    case "bottom_contact":
    case "fly_bottom":
      return "drag";
    case "reaction_mid_column":
      return "twitch_pause";
    case "horizontal_search":
      return "steady";
    case "pike_big_profile":
      return "sweep";
    case "cover_weedless":
      return "hop";
    case "fly_baitfish":
      return "swing";
    default:
      return "steady";
  }
}

function colorFamilyFromTheme(theme: RecommenderV3RankedArchetype["color_theme"]): ColorFamily {
  switch (theme) {
    case "bright":
      return "chartreuse_white";
    case "dark":
      return "dark_silhouette";
    case "natural":
    default:
      return "natural_match";
  }
}

function habitatTags(
  species: SpeciesGroup,
  context: RecommenderRequest["context"],
  depthLane: DepthLane,
): string[] {
  if (species === "pike_musky") {
    return context === "freshwater_lake_pond"
      ? ["vegetation", "open_water", "hard_structure"]
      : ["current_seam", "vegetation", "open_water"];
  }

  if (species === "river_trout") {
    return depthLane === "bottom"
      ? ["current_seam", "bottom", "rock"]
      : ["current_seam", "rock", "open_water"];
  }

  if (context === "freshwater_river") {
    return depthLane === "bottom"
      ? ["current_seam", "rock", "bottom"]
      : ["current_seam", "rock", "wood"];
  }

  return depthLane === "bottom"
    ? ["bottom", "hard_structure", "wood"]
    : ["vegetation", "wood", "hard_structure"];
}

/** Vertical position in the water (surface → bottom), not “shallow vs deep” spot depth. */
function waterColumnBehaviorDetail(depthLane: DepthLane): string {
  switch (depthLane) {
    case "surface":
      return (
        "Vertically: fish are most likely keyed to the true surface or just under it. " +
        "This reads height in the water column—not whether the overall spot is deep or shallow."
      );
    case "upper":
      return (
        "Vertically: expect fish higher in the water column—closer to the surface than to the bottom. " +
        "That still includes bottom-contact lures in shallow cover; the jig ticks bottom in water that isn’t deep overall."
      );
    case "mid":
      return (
        "Vertically: expect fish in the middle of the column—between the surface and the bottom—for much of the day."
      );
    case "near_bottom":
      return (
        "Vertically: expect fish in the lower third of the column, tight to or just above bottom."
      );
    case "bottom":
      return (
        "Vertically: expect fish on or scraping the bottom—lean into bottom-contact and structure presentations."
      );
  }
}

/** Short phrase for tips—same vertical meaning, less prose. */
function waterColumnShortForTip(depthLane: DepthLane): string {
  switch (depthLane) {
    case "surface":
      return "top of the water column (surface)";
    case "upper":
      return "upper water column (nearer the surface than the bottom)";
    case "mid":
      return "middle of the water column";
    case "near_bottom":
      return "lower water column (near bottom)";
    case "bottom":
      return "bottom of the water column";
  }
}

function forageLabel(mode: ForageMode | undefined): string {
  switch (mode) {
    case "baitfish":
      return "baitfish";
    case "crawfish":
      return "crawfish";
    case "leech":
      return "leech and worm forage";
    case "surface_prey":
      return "surface prey";
    case "mixed":
      return "mixed forage";
    case "shrimp":
      return "shrimp";
    case "crab":
      return "crab";
    default:
      return "seasonal forage";
  }
}

function v3ForageLabel(bucket: RecommenderV3Response["resolved_profile"]["primary_forage"] | undefined): string {
  switch (bucket) {
    case "baitfish":
      return "baitfish";
    case "crawfish":
      return "crawfish";
    case "bluegill_perch":
      return "bluegill and perch forage";
    case "leech_worm":
      return "leech and worm forage";
    case "insect_misc":
      return "insect and small surface forage";
    default:
      return "seasonal forage";
  }
}

function speedSummarySentence(
  speed: SpeedPreference,
  presentation: RecommenderV3Response["resolved_profile"]["presentation_presence_today"],
): string {
  const pace =
    speed === "dead_slow"
      ? "Fish dead slow"
      : speed === "slow"
      ? "Keep retrieves slow"
      : speed === "fast"
      ? "You can speed up"
      : speed === "vary"
      ? "Vary pace"
      : "Use a steady, measured cadence";
  const tail =
    presentation === "subtle"
      ? "with long pauses and minimal noise."
      : presentation === "bold"
      ? "and add thump or flash only if fish respond."
      : "with balanced motion and pauses.";
  return `${pace} ${tail}`;
}

function buildBehaviorSummary(
  depthLane: DepthLane,
  primary: RecommenderV3Response["resolved_profile"]["primary_forage"] | undefined,
  secondary: RecommenderV3Response["resolved_profile"]["secondary_forage"] | undefined,
  speed: SpeedPreference,
  presentation: RecommenderV3Response["resolved_profile"]["presentation_presence_today"],
): [BehaviorSummaryRow, BehaviorSummaryRow, BehaviorSummaryRow] {
  const water: BehaviorSummaryRow = {
    label: "Where in the water",
    detail: waterColumnBehaviorDetail(depthLane),
  };
  const forage: BehaviorSummaryRow = {
    label: "Forage",
    detail: secondary
      ? `Month centers on ${v3ForageLabel(primary)}; keep ${v3ForageLabel(secondary)} in mind as a backup.`
      : `Month centers on ${v3ForageLabel(primary)}.`,
  };
  const speedRow: BehaviorSummaryRow = {
    label: "Speed",
    detail: speedSummarySentence(speed, presentation),
  };
  return [water, forage, speedRow];
}

function seasonalFlagFromV3(result: RecommenderV3Response): SeasonalFlag {
  const month = result.month;
  const species = result.species;

  if (month >= 12 || month <= 2) return "off_season";
  if (species === "largemouth_bass" || species === "smallmouth_bass") {
    if (month <= 4) return "pre_spawn";
    if (month === 5) return "spawning";
    if (month === 6) return "post_spawn";
  }
  return "peak_season";
}

const LANE_FALLBACKS: Partial<Record<TacticalLaneV3, readonly [string, string, string]>> = {
  bottom_contact: [
    "Keep it close to bottom with short lifts, drags, or slow hops and let it linger in front of the fish.",
    "Drag it along the substrate slowly with minimal rod movement, pausing when you feel resistance against structure.",
    "Stay low and slow on the retrieve; short rod-tip lifts and long pauses keep the bait working in the strike zone.",
  ],
  fly_bottom: [
    "Sink it fully and retrieve with short strips, letting the fly tick along the substrate.",
    "Keep it near the bottom with a slow strip-pause cadence; let the fly settle after each pull.",
    "Work it close to the substrate with short, controlled strips and deliberate pauses between each one.",
  ],
  surface: [
    "Work it across the surface with deliberate pauses near edges or openings instead of racing it back.",
    "Pop or walk it with a steady cadence, slowing near cover and letting it rest in the ring before moving.",
    "Keep the surface disturbance consistent and pause after any splash or boil near the bait.",
  ],
  fly_surface: [
    "Fish it with a strip-pause cadence that mimics surface prey; the pause is when fish commit.",
    "Strip slowly and let the fly sit between movements — surface strikes come to the stillness, not the action.",
    "Work it near structure with deliberate pauses after each strip; longer pauses draw more committed strikes.",
  ],
  reaction_mid_column: [
    "Use a pull-pause cadence so the bait flashes, then hangs in the strike window.",
    "Dart and stall with rod sweeps followed by complete stops; the pause is when fish commit.",
    "Rip and kill the retrieve, varying pause length until you find the timing fish respond to.",
  ],
  cover_weedless: [
    "Thread it through cover cleanly, then let it fall or stall beside the target before moving it again.",
    "Pitch tight to cover, give it slack on the drop, and move it only after a thorough pause in each spot.",
    "Present it at the cover edge, let it settle, then work it slowly before repositioning for the next cast.",
  ],
  pike_big_profile: [
    "Fish it with long sweeps and deliberate pauses so the larger profile hangs in front of following fish.",
    "Retrieve at a measured pace and deadstop near structure; pike follow long before committing, so hold steady.",
    "Long sweeps, long pauses — pike want to follow and close, so give them time at each pause point.",
  ],
  fly_baitfish: [
    "Strip it on a steady-to-pulsed cadence that keeps the fly tracking like a live baitfish.",
    "Vary strip length to make the fly dart and glide; pause to let it sink and breathe between pulls.",
    "Retrieve with purpose at a baitfish pace; slow near structure and kill the retrieve if you see a follow.",
  ],
  horizontal_search: [
    "Cover water at a steady pace, then slow slightly after follows, bumps, or missed strikes.",
    "Maintain a consistent retrieve speed and let the lure's action work through the target zone.",
    "Work through the area at a medium pace, varying depth with rod angle; pause briefly near cover or transitions.",
  ],
  finesse_subtle: [
    "Let it soak, glide, or pendulum naturally with longer pauses than you think you need.",
    "Fish it slow and methodically; finesse presentations need minimum rod movement and maximum patience.",
    "Keep the bait in the zone as long as possible with minimal movement — the subtlety is the point.",
  ],
};

function stableVariantIndex(seed: string, length: number): number {
  let hash = 5381;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 33) ^ seed.charCodeAt(index);
  }
  return (hash >>> 0) % length;
}

function howToFishText(candidate: RecommenderV3RankedArchetype, seed: string): string {
  const profile =
    candidate.gear_mode === "lure"
      ? LURE_ARCHETYPES_V3[candidate.id as keyof typeof LURE_ARCHETYPES_V3]
      : FLY_ARCHETYPES_V3[candidate.id as keyof typeof FLY_ARCHETYPES_V3];

  const variants: readonly [string, string, string] | undefined =
    profile?.how_to_fish_text ??
    LANE_FALLBACKS[candidate.tactical_lane as TacticalLaneV3];

  if (variants) {
    const pick = stableVariantIndex(
      `${seed}:${candidate.id}:${candidate.gear_mode}:${candidate.tactical_lane}`,
      variants.length,
    );
    return variants[pick]!;
  }
  return "Keep the presentation clean and in the fish's lane longer than a rushed, mechanical retrieve.";
}

// ─── Color of the Day ─────────────────────────────────────────────────────────
//
// A single condition-driven color direction for the entire session.
// Applies equally to lures and flies — displayed once at the top of results.

/**
 * Returns "Brighter Colors", "Darker Colors", or "Natural Colors" based on
 * conditions. Dirty water and overcast both need higher visibility; negative
 * mood + finesse day calls for darker/subtler silhouettes; everything else
 * defaults to natural forage-match patterns.
 */
function colorOfDayText(theme: RecommenderV3RankedArchetype["color_theme"]): string {
  switch (theme) {
    case "bright":
      return "Bright Colors";
    case "dark":
      return "Dark Colors";
    case "natural":
    default:
      return "Natural Colors";
  }
}

const RANK_CONTEXT_BY_LANE: Partial<Record<TacticalLaneV3, string>> = {
  finesse_subtle: "Finesse alternative when fish want a smaller, slower look.",
  bottom_contact: "Bottom-contact option if fish are pinned to structure or depth.",
  horizontal_search: "Search bait to cover water when fish are roaming.",
  reaction_mid_column: "Mid-column reaction bait for suspended or intercepting fish.",
  surface: "Topwater lane if conditions allow surface strikes.",
  fly_surface: "Surface fly if fish are looking up.",
  cover_weedless: "Weedless presentation for heavy cover.",
  pike_big_profile: "Larger profile for follow-and-crush predator windows.",
  fly_baitfish: "Baitfish streamer lane for a different silhouette and speed.",
  fly_bottom: "Bottom-hugging fly if fish won’t come up.",
};

function buildRankContext(
  candidate: RecommenderV3RankedArchetype,
  rank: number,
  top: RecommenderV3RankedArchetype | undefined,
): string | undefined {
  if (rank <= 1 || !top || candidate.id === top.id) return undefined;
  if (candidate.tactical_lane !== top.tactical_lane) {
    return RANK_CONTEXT_BY_LANE[candidate.tactical_lane] ??
      "Different tactical lane from your #1 pick.";
  }
  if (candidate.family_key !== top.family_key) {
    return "Same general lane with a different lure family.";
  }
  return "Close backup if your top pick isn’t producing.";
}

function toRankedFamily(
  candidate: RecommenderV3RankedArchetype,
  rank: number,
  topInList: RecommenderV3RankedArchetype | undefined,
  requestSeed: string,
): RankedFamily {
  return {
    family_id: candidate.id as unknown as LureFamilyId | FlyFamilyId,
    display_name: candidate.display_name,
    how_to_fish: howToFishText(candidate, requestSeed),
    rank_context: buildRankContext(candidate, rank, topInList),
  };
}

function buildBehavior(
  result: RecommenderV3Response,
): BehaviorOutput {
  const depthLane = mapWaterColumnToDepthLane(
    result.resolved_profile.likely_water_column_today,
  );
  const activity = activityFromV3(result);
  const primary = forageBucketToMode(result.resolved_profile.primary_forage, depthLane);
  const secondary = forageBucketToMode(result.resolved_profile.secondary_forage, depthLane);
  const topwaterViable = result.daily_payload.surface_allowed_today &&
    !result.daily_payload.suppress_true_topwater;

  return {
    activity,
    aggression: aggressionFromV3(result),
    strike_zone: strikeZoneFromActivity(activity),
    chase_radius: chaseRadiusFromActivity(activity),
    depth_lane: depthLane,
    habitat_tags: habitatTags(result.species === "northern_pike" ? "pike_musky" : result.species === "trout" ? "river_trout" : result.species, result.context, depthLane),
    forage_mode: primary ?? "mixed",
    secondary_forage: secondary,
    topwater_viable: topwaterViable,
    speed_preference: speedFromV3(result),
    noise_preference: noiseFromPresentation(
      result.resolved_profile.presentation_presence_today,
    ),
    flash_preference: flashFromPresentation(
      result.resolved_profile.presentation_presence_today,
    ),
    behavior_summary: buildBehaviorSummary(
      depthLane,
      result.resolved_profile.primary_forage,
      result.resolved_profile.secondary_forage,
      speedFromV3(result),
      result.resolved_profile.presentation_presence_today,
    ),
    seasonal_flag: seasonalFlagFromV3(result),
  };
}

function buildPresentation(
  result: RecommenderV3Response,
  behavior: BehaviorOutput,
): PresentationOutput {
  const leadCandidate = result.lure_recommendations[0] ?? result.fly_recommendations[0];
  return {
    depth_target: behavior.depth_lane,
    speed: behavior.speed_preference,
    motion: leadCandidate ? motionFromCandidate(leadCandidate) : "steady",
    trigger_type: triggerFromV3(result),
    noise: behavior.noise_preference,
    flash: behavior.flash_preference,
    profile: leadCandidate ? profileFromCandidate(leadCandidate) : "medium",
    color_family: colorFamilyFromTheme(leadCandidate?.color_theme ?? "natural"),
    topwater_viable: behavior.topwater_viable,
    current_technique: result.context === "freshwater_river"
      ? (leadCandidate?.tactical_lane === "fly_baitfish" ? "cross_current" : "downstream_drift")
      : undefined,
  };
}

function buildPrimaryPatternSummary(
  top: RankedFamily | undefined,
  behavior: BehaviorOutput,
  result: RecommenderV3Response,
): string | undefined {
  if (!top) return undefined;
  const depth = waterColumnShortForTip(behavior.depth_lane);
  const forage = forageLabel(behavior.forage_mode);
  const pres = result.resolved_profile.presentation_presence_today;
  const s1 = `${top.display_name} is the lead pick—work the ${depth}.`;
  const s2 = `Match ${forage} and stay ${pres} on presentation until the bite tells you to change.`;
  return `${s1}\n\n${s2}`;
}

function buildSharedRequest(req: RecommenderRequest): SharedEngineRequest {
  return {
    latitude: req.location.latitude,
    longitude: req.location.longitude,
    state_code: req.location.state_code,
    region_key: req.location.region_key,
    local_date: req.location.local_date,
    local_timezone: req.location.local_timezone,
    context: req.context,
    environment: req.env_data as SharedEngineRequest["environment"],
    data_coverage: {},
  };
}

export function runRecommenderV3Surface(req: RecommenderRequest): RecommenderResponse {
  const analysis = analyzeSharedConditions(buildSharedRequest(req));
  const v3 = computeRecommenderV3(req, analysis);
  const requestSeed = [
    req.location.local_date,
    req.location.local_timezone,
    req.location.region_key,
    req.species,
    req.context,
    req.water_clarity,
  ].join(":");
  const lightLabel = analysis.norm.normalized.light_cloud_condition?.label ?? null;
  const colorDecision = resolveColorDecisionV3(
    req.water_clarity,
    normalizeLightBucketV3(lightLabel),
  );
  const behavior = buildBehavior(v3);
  const presentation = buildPresentation(v3, behavior);
  const lureTop = v3.lure_recommendations[0];
  const flyTop = v3.fly_recommendations[0];
  const lure_rankings = v3.lure_recommendations.map((candidate, i) =>
    toRankedFamily(candidate, i + 1, lureTop, requestSeed),
  );
  const fly_rankings = v3.fly_recommendations.map((candidate, i) =>
    toRankedFamily(candidate, i + 1, flyTop, requestSeed),
  );
  const now = new Date();
  const expires = locationLocalMidnightIso(req.location.local_timezone, now);

  return {
    feature: RECOMMENDER_FEATURE,
    species: req.species,
    context: req.context,
    water_clarity: req.water_clarity,
    generated_at: now.toISOString(),
    cache_expires_at: expires,
    behavior,
    presentation,
    lure_rankings,
    fly_rankings,
    daily_posture_band: v3.resolved_profile.daily_posture_band,
    typical_seasonal_water_column:
      v3.resolved_profile.typical_seasonal_water_column,
    likely_water_column_today: v3.resolved_profile.likely_water_column_today,
    typical_seasonal_location: v3.resolved_profile.typical_seasonal_location,
    color_of_day: colorOfDayText(colorDecision.color_theme),
    primary_pattern_summary: buildPrimaryPatternSummary(lure_rankings[0], behavior, v3),
  };
}
