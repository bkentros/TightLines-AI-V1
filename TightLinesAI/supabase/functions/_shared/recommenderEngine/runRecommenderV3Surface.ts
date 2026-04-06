import { analyzeSharedConditions } from "../howFishingEngine/analyzeSharedConditions.ts";
import type { SharedConditionAnalysis } from "../howFishingEngine/analyzeSharedConditions.ts";
import type { SharedEngineRequest } from "../howFishingEngine/contracts/input.ts";
import type { TimingStrength } from "../howFishingEngine/contracts/tipsDaypart.ts";
import { SPECIES_META, type SpeciesGroup } from "./contracts/species.ts";
import type { RecommenderRequest, WaterClarity } from "./contracts/input.ts";
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
  SpeedPreference,
  TriggerType,
} from "./contracts/behavior.ts";
import type { LureFamilyId, FlyFamilyId } from "./contracts/families.ts";
import { resolveConfidence } from "./resolveConfidence.ts";
import { computeRecommenderV3 } from "./runRecommenderV3.ts";
import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./v3/candidates/index.ts";
import type {
  ColorThemeIdV3,
  RecommenderV3RankedArchetype,
  RecommenderV3Response,
  TacticalLaneV3,
} from "./v3/contracts.ts";

const CACHE_TTL_HOURS = 6;

function mapWaterColumnToDepthLane(column: RecommenderV3Response["resolved_profile"]["final_water_column"]): DepthLane {
  switch (column) {
    case "top":
      return "surface";
    case "shallow":
      return "upper";
    case "mid":
      return "mid";
    case "bottom":
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
  switch (result.resolved_profile.final_mood) {
    case "negative":
      return result.daily_payload.source_score <= 35 ? "inactive" : "low";
    case "neutral":
      return "neutral";
    case "active":
      return result.daily_payload.mood_nudge === "up_2" && result.daily_payload.source_score >= 70
        ? "aggressive"
        : "active";
  }
}

function aggressionFromV3(result: RecommenderV3Response): AggressionLevel {
  if (result.resolved_profile.final_mood === "negative") return "passive";
  if (result.resolved_profile.final_mood === "neutral") {
    return result.resolved_profile.final_presentation_style === "bold" ? "reactive" : "neutral";
  }
  return result.resolved_profile.final_presentation_style === "bold" ? "aggressive" : "reactive";
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
  const { final_mood, final_presentation_style } = result.resolved_profile;
  if (final_mood === "negative") {
    return final_presentation_style === "bold" ? "slow" : "dead_slow";
  }
  if (final_mood === "neutral") {
    return final_presentation_style === "subtle" ? "slow" : "moderate";
  }
  if (final_presentation_style === "bold") return "fast";
  return "moderate";
}

function noiseFromPresentation(style: RecommenderV3Response["resolved_profile"]["final_presentation_style"]): NoiseLevel {
  switch (style) {
    case "subtle":
      return "subtle";
    case "balanced":
      return "moderate";
    case "bold":
      return "loud";
  }
}

function flashFromPresentation(style: RecommenderV3Response["resolved_profile"]["final_presentation_style"]): FlashLevel {
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
  if (result.resolved_profile.final_presentation_style === "subtle") return "finesse";
  if (result.resolved_profile.final_mood === "active" && result.resolved_profile.final_presentation_style === "bold") {
    return "aggressive";
  }
  if (result.resolved_profile.final_mood === "active") return "reaction";
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

function colorFamilyFromTheme(theme: ColorThemeIdV3, clarity: WaterClarity): ColorFamily {
  switch (theme) {
    case "white_shad":
      return "shad_silver";
    case "bright_contrast":
      return "chartreuse_white";
    case "dark_contrast":
      return "dark_silhouette";
    case "craw_natural":
    case "green_pumpkin_natural":
      return "craw_pattern";
    case "metal_flash":
      return "flash_heavy";
    case "natural_baitfish":
    case "perch_bluegill":
    case "frog_natural":
    case "mouse_natural":
    case "watermelon_natural":
    default:
      return clarity === "dirty" ? "dark_silhouette" : "natural_match";
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

function waterColumnLabel(depthLane: DepthLane): string {
  switch (depthLane) {
    case "surface":
      return "surface";
    case "upper":
      return "upper water";
    case "mid":
      return "mid-depth";
    case "near_bottom":
      return "near-bottom";
    case "bottom":
      return "bottom";
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
  presentation: RecommenderV3Response["resolved_profile"]["final_presentation_style"],
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
  presentation: RecommenderV3Response["resolved_profile"]["final_presentation_style"],
): [BehaviorSummaryRow, BehaviorSummaryRow, BehaviorSummaryRow] {
  const water: BehaviorSummaryRow = {
    label: "Water column",
    detail: `Best focus is the ${waterColumnLabel(depthLane)} zone today.`,
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

function v3ToConfidenceInput(candidate: RecommenderV3RankedArchetype): {
  score: number;
  breakdown: Array<{ direction: "bonus" | "penalty" }>;
} {
  return {
    score: Math.max(35, Math.min(99, Math.round(candidate.score * 8))),
    breakdown: candidate.breakdown.map((item) => ({
      direction: item.value >= 0 ? "bonus" : "penalty",
    })),
  };
}

function howToFishText(
  candidate: RecommenderV3RankedArchetype,
): string {
  const profile =
    candidate.gear_mode === "lure"
      ? LURE_ARCHETYPES_V3[candidate.id as keyof typeof LURE_ARCHETYPES_V3]
      : FLY_ARCHETYPES_V3[candidate.id as keyof typeof FLY_ARCHETYPES_V3];
  if (profile?.how_to_fish_text) return profile.how_to_fish_text;

  switch (candidate.tactical_lane) {
    case "bottom_contact":
    case "fly_bottom":
      return "Keep it close to bottom with short lifts, drags, or slow hops and let it linger in front of the fish.";
    case "surface":
    case "fly_surface":
      return "Work it across the surface with deliberate pauses near edges or openings instead of racing it back.";
    case "reaction_mid_column":
      return "Use a pull-pause or rip-pause cadence so the bait flashes, then hangs in the strike window.";
    case "cover_weedless":
      return "Thread it through cover cleanly, then let it fall or stall beside the target before moving it again.";
    case "pike_big_profile":
      return "Fish it with long sweeps and deliberate pauses so the larger profile hangs in front of following fish.";
    case "fly_baitfish":
      return "Strip it on a steady-to-pulsed cadence that keeps the fly tracking like a live baitfish.";
    case "horizontal_search":
      return "Cover water at a steady pace, then slow slightly after follows, bumps, or missed strikes.";
    case "finesse_subtle":
      return "Let it soak, glide, or pendulum naturally with longer pauses than you think you need.";
    default:
      return "Keep the presentation clean, repeatable, and in the fish's lane longer than a random fast retrieve.";
  }
}

const COLOR_THEME_DISPLAY: Record<string, string> = {
  natural_baitfish:      "Natural Baitfish",
  white_shad:            "White / Shad",
  bright_contrast:       "Bright Contrast",
  dark_contrast:         "Dark Contrast",
  craw_natural:          "Natural Craw",
  green_pumpkin_natural: "Green Pumpkin",
  watermelon_natural:    "Watermelon / Natural",
  perch_bluegill:        "Perch / Bluegill",
  metal_flash:           "Metal Flash",
  frog_natural:          "Natural Frog",
  mouse_natural:         "Natural Mouse",
};

function colorGuideText(candidate: RecommenderV3RankedArchetype): string {
  return (
    COLOR_THEME_DISPLAY[candidate.color_theme] ??
    candidate.color_theme
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  );
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
): RankedFamily {
  return {
    family_id: candidate.id as unknown as LureFamilyId | FlyFamilyId,
    display_name: candidate.display_name,
    how_to_fish: howToFishText(candidate),
    color_guide: colorGuideText(candidate),
    rank_context: buildRankContext(candidate, rank, topInList),
  };
}

function buildBehavior(
  result: RecommenderV3Response,
): BehaviorOutput {
  const depthLane = mapWaterColumnToDepthLane(result.resolved_profile.final_water_column);
  const activity = activityFromV3(result);
  const primary = forageBucketToMode(result.resolved_profile.primary_forage, depthLane);
  const secondary = forageBucketToMode(result.resolved_profile.secondary_forage, depthLane);
  const topwaterViable = [
    ...result.lure_recommendations,
    ...result.fly_recommendations,
  ].some((candidate) => candidate.tactical_lane === "surface" || candidate.tactical_lane === "fly_surface");

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
    noise_preference: noiseFromPresentation(result.resolved_profile.final_presentation_style),
    flash_preference: flashFromPresentation(result.resolved_profile.final_presentation_style),
    behavior_summary: buildBehaviorSummary(
      depthLane,
      result.resolved_profile.primary_forage,
      result.resolved_profile.secondary_forage,
      speedFromV3(result),
      result.resolved_profile.final_presentation_style,
    ),
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
    color_family: colorFamilyFromTheme(leadCandidate?.color_theme ?? "natural_baitfish", result.water_clarity),
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
  const depth = waterColumnLabel(behavior.depth_lane);
  const forage = forageLabel(behavior.forage_mode);
  const pres = result.resolved_profile.final_presentation_style;
  const s1 = `${top.display_name} is the lead pick—start in the ${depth} zone.`;
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

function timingFromAnalysis(analysis: SharedConditionAnalysis): {
  highlighted_periods: [boolean, boolean, boolean, boolean];
  timing_strength: TimingStrength;
} {
  return {
    highlighted_periods: analysis.timing.highlighted_periods as [boolean, boolean, boolean, boolean],
    timing_strength: analysis.timing.timing_strength,
  };
}

export function runRecommenderV3Surface(req: RecommenderRequest): RecommenderResponse {
  const analysis = analyzeSharedConditions(buildSharedRequest(req));
  const v3 = computeRecommenderV3(req, analysis);
  const behavior = buildBehavior(v3);
  const presentation = buildPresentation(v3, behavior);
  const lureConfidence = v3.lure_recommendations.map(v3ToConfidenceInput);
  const flyConfidence = v3.fly_recommendations.map(v3ToConfidenceInput);
  const lureTop = v3.lure_recommendations[0];
  const flyTop = v3.fly_recommendations[0];
  const lure_rankings = v3.lure_recommendations.map((candidate, i) =>
    toRankedFamily(candidate, i + 1, lureTop),
  );
  const fly_rankings = v3.fly_recommendations.map((candidate, i) =>
    toRankedFamily(candidate, i + 1, flyTop),
  );
  const confidence = resolveConfidence(
    req,
    behavior,
    analysis,
    SPECIES_META[req.species].display_name,
    lureConfidence,
    flyConfidence,
  );
  const now = new Date();
  const expires = new Date(now.getTime() + CACHE_TTL_HOURS * 60 * 60 * 1000);

  return {
    feature: RECOMMENDER_FEATURE,
    species: req.species,
    context: req.context,
    water_clarity: req.water_clarity,
    generated_at: now.toISOString(),
    cache_expires_at: expires.toISOString(),
    behavior,
    presentation,
    lure_rankings,
    fly_rankings,
    timing: timingFromAnalysis(analysis),
    confidence,
    primary_pattern_summary: buildPrimaryPatternSummary(lure_rankings[0], behavior, v3),
  };
}
