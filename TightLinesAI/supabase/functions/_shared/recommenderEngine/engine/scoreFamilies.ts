/**
 * scoreFamilies — biologically sensible family ranking.
 *
 * Core philosophy:
 *   - Match what fish are doing first: forage, depth, activity, trigger.
 *   - Then match how the bait must fish: speed, noise, flash, profile.
 *   - Reward context fit: current capability and weedlessness when relevant.
 *   - Penalize contradictions: overly loud / flashy / aggressive families in
 *     cautious conditions, or subtle families that are hard to locate in dirty water.
 */

import type { EngineContext } from "../../howFishingEngine/contracts/context.ts";
import type {
  ActivityLevel,
  BehaviorOutput,
  CoverClass,
  DepthLane,
  FlashLevel,
  FlowSuitability,
  NoiseLevel,
  PresentationOutput,
  ProfileSize,
  SpeedPreference,
  TriggerType,
} from "../contracts/behavior.ts";
import type { WaterClarity } from "../contracts/input.ts";
import type { FlyFamilyId, GearMode, LureFamilyId } from "../contracts/families.ts";
import type { SpeciesGroup } from "../contracts/species.ts";
import type { RankedFamilyScoreBreakdown } from "../contracts/output.ts";
import {
  FLY_FAMILIES,
  type FlyFamilyMetadata,
} from "../config/flyFamilies.ts";
import {
  LURE_FAMILIES,
  type LureFamilyMetadata,
} from "../config/lureFamilies.ts";

// ─── Scoring result ───────────────────────────────────────────────────────────

export type ScoredFamily = {
  family_id: LureFamilyId | FlyFamilyId;
  gear_mode: GearMode;
  display_name: string;
  examples: string[];
  raw_score: number;
  score: number; // 0–100 normalized
  breakdown: RankedFamilyScoreBreakdown[];
  score_reasons: string[];
  v1_scope_note?: string;
};

// ─── Ordinal helpers ──────────────────────────────────────────────────────────

const DEPTH_LANES: DepthLane[] = ["surface", "upper", "mid", "near_bottom", "bottom"];
const SPEED_LEVELS: SpeedPreference[] = ["dead_slow", "slow", "moderate", "fast"];
const ACTIVITY_LEVELS: ActivityLevel[] = ["inactive", "low", "neutral", "active", "aggressive"];
const NOISE_LEVELS: NoiseLevel[] = ["silent", "subtle", "moderate", "loud"];
const FLASH_LEVELS: FlashLevel[] = ["none", "subtle", "moderate", "heavy"];
const CLARITY_MAX_BONUS = 1.5;
const COVER_MAX_BONUS = 1.5;
const CURRENT_MAX_BONUS = 2;
const TIDE_MAX_BONUS = 1.5;

type BreakdownDirection = RankedFamilyScoreBreakdown["direction"];

function pushBreakdown(
  breakdown: RankedFamilyScoreBreakdown[],
  direction: BreakdownDirection,
  code: string,
  weight: number,
  detail: string,
) {
  breakdown.push({ code, direction, weight, detail });
}

function indexDistance<T>(ordered: readonly T[], a: T, b: T): number | null {
  const ia = ordered.indexOf(a);
  const ib = ordered.indexOf(b);
  if (ia === -1 || ib === -1) return null;
  return Math.abs(ia - ib);
}

function bestOrdinalDistance<T>(ordered: readonly T[], actual: T, options: readonly T[]): number | null {
  let best: number | null = null;
  for (const option of options) {
    const dist = indexDistance(ordered, actual, option);
    if (dist === null) continue;
    if (best === null || dist < best) best = dist;
  }
  return best;
}

function bestSpeedDistance(actual: SpeedPreference, options: readonly SpeedPreference[]): number | null {
  if (actual === "vary") {
    return options.length > 0 ? 0 : null;
  }
  const filtered = options.filter((speed) => speed !== "vary");
  return bestOrdinalDistance(SPEED_LEVELS, actual, filtered);
}

function activitySupportDistance(actual: ActivityLevel, options: readonly ActivityLevel[]): number | null {
  return bestOrdinalDistance(ACTIVITY_LEVELS, actual, options);
}

function roundRaw(score: number): number {
  return Number(Math.max(0, score).toFixed(2));
}

function normalizedScore(raw: number, max: number): number {
  return Math.max(0, Math.min(100, Math.round((raw / max) * 100)));
}

function sortedReasons(breakdown: RankedFamilyScoreBreakdown[]): RankedFamilyScoreBreakdown[] {
  return [...breakdown].sort((a, b) => {
    if (a.direction !== b.direction) return a.direction === "bonus" ? -1 : 1;
    if (b.weight !== a.weight) return b.weight - a.weight;
    return a.code.localeCompare(b.code);
  });
}

function scoreReasons(breakdown: RankedFamilyScoreBreakdown[]): string[] {
  return sortedReasons(breakdown)
    .filter((item) => item.direction === "bonus")
    .slice(0, 3)
    .map((item) => item.detail);
}

function depthPhrase(depth: DepthLane): string {
  switch (depth) {
    case "surface": return "the surface lane";
    case "upper": return "the upper water column";
    case "mid": return "the mid-water lane";
    case "near_bottom": return "the near-bottom lane";
    case "bottom": return "the bottom lane";
  }
}

function speedPhrase(speed: SpeedPreference): string {
  switch (speed) {
    case "dead_slow": return "an ultra-slow presentation";
    case "slow": return "a slow presentation";
    case "moderate": return "a moderate retrieve";
    case "fast": return "a fast retrieve";
    case "vary": return "a varied retrieve";
  }
}

function activityPhrase(activity: ActivityLevel): string {
  switch (activity) {
    case "inactive": return "inactive fish";
    case "low": return "low-activity fish";
    case "neutral": return "neutral fish";
    case "active": return "active fish";
    case "aggressive": return "aggressive fish";
  }
}

function triggerPhrase(trigger: TriggerType): string {
  switch (trigger) {
    case "finesse": return "a finesse cue";
    case "natural_match": return "a natural food-first cue";
    case "reaction": return "a reaction cue";
    case "aggressive": return "an aggressive triggering cue";
  }
}

function profilePhrase(profile: ProfileSize): string {
  switch (profile) {
    case "slim": return "a slim profile";
    case "medium": return "a medium profile";
    case "bulky": return "a bulky profile";
  }
}

function flashPhrase(flash: FlashLevel): string {
  switch (flash) {
    case "none": return "almost no flash";
    case "subtle": return "subtle flash";
    case "moderate": return "moderate flash";
    case "heavy": return "heavy flash";
  }
}

function noisePhrase(noise: NoiseLevel): string {
  switch (noise) {
    case "silent": return "very little sound";
    case "subtle": return "subtle vibration";
    case "moderate": return "moderate vibration";
    case "loud": return "loud vibration";
  }
}

function foragePhrase(mode: BehaviorOutput["forage_mode"]): string {
  switch (mode) {
    case "baitfish": return "baitfish-focused feeding";
    case "shrimp": return "shrimp-focused feeding";
    case "crab": return "crab-focused feeding";
    case "crawfish": return "crawfish-focused feeding";
    case "leech": return "leech- and worm-focused feeding";
    case "surface_prey": return "surface-oriented feeding";
    case "mixed": return "the mixed forage base";
  }
}

function preyLabel(mode: BehaviorOutput["forage_mode"]): string {
  switch (mode) {
    case "baitfish": return "baitfish";
    case "shrimp": return "shrimp";
    case "crab": return "crab";
    case "crawfish": return "crawfish";
    case "leech": return "leech or worm";
    case "surface_prey": return "surface prey";
    case "mixed": return "mixed forage";
  }
}

function forageMatchDetail(
  matchedForage: BehaviorOutput["forage_mode"],
  code: "primary" | "secondary",
  metaForage: readonly BehaviorOutput["forage_mode"][],
): string {
  if (metaForage.length === 1) {
    const prey = preyLabel(metaForage[0]!);
    if (code === "primary") {
      return `shows fish a clean ${prey} profile`;
    }
    return `still gives fish a ${prey} profile around the secondary forage window`;
  }

  if (code === "primary") {
    return `matches ${foragePhrase(matchedForage)}`;
  }

  return `still overlaps the ${preyLabel(matchedForage)} secondary forage window`;
}

function preferredWrongForage(metaForage: readonly string[]): string {
  if (metaForage.length === 0) return "another prey type";
  return metaForage[0]!.replace(/_/g, " ");
}

function deriveCoverClasses(
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
): Set<CoverClass> {
  const covers = new Set<CoverClass>();
  const tags = new Set(behavior.habitat_tags);

  if (
    [
      "weed_edges",
      "shallow_grass",
      "grass_flats",
      "vegetation",
      "matted_grass",
      "tailing_fish",
    ].some((tag) => tags.has(tag))
  ) {
    covers.add("vegetation");
  }
  if (["wood_structure", "laydowns", "mangrove_edges"].some((tag) => tags.has(tag))) {
    covers.add("wood");
  }
  if (
    [
      "rock_substrate",
      "rocky_points",
      "rock_humps",
      "rocky_structure",
      "oyster_bars",
    ].some((tag) => tags.has(tag))
  ) {
    covers.add("rock");
  }
  if (
    [
      "current_seams",
      "eddy_pockets",
      "eddy_seams",
      "tailouts",
      "pool_tailouts",
      "runs",
      "pocket_water",
      "wing_dams",
      "current_breaks",
      "river_structure",
      "tidal_rips",
      "points_and_rips",
      "passes",
      "inlets",
      "tidal_channels",
      "tide_rips",
    ].some((tag) => tags.has(tag))
  ) {
    covers.add("current_seam");
  }
  if (
    [
      "open_water",
      "baitfish_schools",
      "baitfish_blitz",
      "main_basin_edges",
      "rolling_schools",
      "daisy_chains",
    ].some((tag) => tags.has(tag))
  ) {
    covers.add("open_water");
  }
  if (
    [
      "deep_structure",
      "main_lake_structure",
      "bridges",
      "structure_ambush",
      "behind_structure",
      "deeper_structure",
      "drop_offs",
      "points",
      "main_lake_points",
    ].some((tag) => tags.has(tag))
  ) {
    covers.add("hard_structure");
  }
  if (
    [
      "tidal_flats",
      "mud_edges",
      "shallow_bays",
      "pothole_edges",
      "tailing_fish",
      "channel_edges",
    ].some((tag) => tags.has(tag))
  ) {
    covers.add("flats");
  }
  if (presentation.depth_target === "near_bottom" || presentation.depth_target === "bottom") {
    covers.add("bottom");
  }

  return covers;
}

function flowBonus(suitability: FlowSuitability): number {
  switch (suitability) {
    case "strong": return CURRENT_MAX_BONUS;
    case "capable": return 1;
    case "poor": return -1.5;
  }
}

function tideBonus(suitability: FlowSuitability): number {
  switch (suitability) {
    case "strong": return TIDE_MAX_BONUS;
    case "capable": return 0.75;
    case "poor": return -1.25;
  }
}

function hasVegetation(behavior: BehaviorOutput): boolean {
  const weedTags = ["weed_edges", "shallow_grass", "grass_flats", "vegetation", "matted_grass"];
  return behavior.habitat_tags.some((tag) => weedTags.includes(tag));
}

function isCautiousWindow(behavior: BehaviorOutput, waterClarity: WaterClarity): boolean {
  return waterClarity === "clear" && (behavior.activity === "inactive" || behavior.activity === "low");
}

function isDirtyReactionWindow(presentation: PresentationOutput, waterClarity: WaterClarity): boolean {
  return waterClarity === "dirty" && (presentation.trigger_type === "reaction" || presentation.flash === "heavy");
}

function isTriggerAdjacent(requested: TriggerType, actual: TriggerType): boolean {
  return (
    (requested === "finesse" && actual === "natural_match") ||
    (requested === "natural_match" && actual === "finesse") ||
    (requested === "reaction" && actual === "aggressive") ||
    (requested === "aggressive" && actual === "reaction")
  );
}

function scoreCommonDimensions(
  breakdown: RankedFamilyScoreBreakdown[],
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  waterClarity: WaterClarity,
  coverClasses: Set<CoverClass>,
  meta: {
    depth_match: readonly DepthLane[];
    speed_match: readonly SpeedPreference[];
    forage_affinity: readonly BehaviorOutput["forage_mode"][];
    activity_affinity: readonly ActivityLevel[];
    trigger_type: TriggerType;
    noise_level: NoiseLevel;
    flash_level: FlashLevel;
    profile: ProfileSize;
    clarity_strengths: readonly WaterClarity[];
    cover_strengths: readonly CoverClass[];
    topwater: boolean;
  },
): number {
  let score = 0;

  const depthDist = bestOrdinalDistance(DEPTH_LANES, presentation.depth_target, meta.depth_match);
  if (depthDist === 0) {
    score += 3;
    pushBreakdown(breakdown, "bonus", "depth_match", 3, `can be kept in ${depthPhrase(presentation.depth_target)}`);
  } else if (depthDist === 1) {
    score += 1.5;
    pushBreakdown(breakdown, "bonus", "depth_near_match", 1.5, "can still cover water just off the target depth");
  } else if (depthDist !== null) {
    score -= 1.5;
    pushBreakdown(breakdown, "penalty", "depth_mismatch", 1.5, `is harder to hold in ${depthPhrase(presentation.depth_target)}`);
  }

  const speedDist = bestSpeedDistance(presentation.speed, meta.speed_match);
  if (speedDist === 0) {
    score += 2;
    pushBreakdown(breakdown, "bonus", "speed_match", 2, `can be worked with ${speedPhrase(presentation.speed)}`);
  } else if (speedDist === 1) {
    score += 1;
    pushBreakdown(breakdown, "bonus", "speed_near_match", 1, "can still be fished close to the needed cadence");
  } else if (speedDist !== null) {
    score -= 1.5;
    pushBreakdown(breakdown, "penalty", "speed_mismatch", 1.5, `wants more or less pace than ${activityPhrase(behavior.activity)} should see`);
  }

  if (meta.forage_affinity.includes(behavior.forage_mode)) {
    score += 4;
    pushBreakdown(
      breakdown,
      "bonus",
      "forage_primary_match",
      4,
      forageMatchDetail(behavior.forage_mode, "primary", meta.forage_affinity),
    );
  } else if (behavior.secondary_forage && meta.forage_affinity.includes(behavior.secondary_forage)) {
    score += 2;
    pushBreakdown(
      breakdown,
      "bonus",
      "forage_secondary_match",
      2,
      forageMatchDetail(behavior.secondary_forage, "secondary", meta.forage_affinity),
    );
  } else if (meta.forage_affinity.length <= 1) {
    const hardBottomMismatch =
      (behavior.forage_mode === "crab" || behavior.forage_mode === "shrimp" || behavior.forage_mode === "crawfish") &&
      (presentation.depth_target === "near_bottom" || presentation.depth_target === "bottom" || presentation.motion === "drag");
    const mismatchPenalty = hardBottomMismatch ? 4 : 2;
    score -= mismatchPenalty;
    pushBreakdown(
      breakdown,
      "penalty",
      "forage_mismatch",
      mismatchPenalty,
      `leans toward ${preferredWrongForage(meta.forage_affinity)} when fish should be on ${behavior.forage_mode.replace(/_/g, " ")}`,
    );
  }

  const activityDist = activitySupportDistance(behavior.activity, meta.activity_affinity);
  if (activityDist === 0) {
    score += 3;
    pushBreakdown(breakdown, "bonus", "activity_match", 3, `fits ${activityPhrase(behavior.activity)}`);
  } else if (activityDist === 1) {
    score += 1.5;
    pushBreakdown(breakdown, "bonus", "activity_near_match", 1.5, "still makes sense for the current bite window");
  } else if (behavior.activity === "inactive" || behavior.activity === "low") {
    score -= 2;
    pushBreakdown(breakdown, "penalty", "activity_mismatch", 2, "asks for more aggression than fish should show right now");
  } else if (behavior.activity === "aggressive") {
    score -= 1;
    pushBreakdown(breakdown, "penalty", "activity_mismatch", 1, "is subtler than the most aggressive fish should prefer");
  }

  if (meta.trigger_type === presentation.trigger_type) {
    score += 3;
    pushBreakdown(breakdown, "bonus", "trigger_match", 3, `delivers ${triggerPhrase(presentation.trigger_type)}`);
  } else if (isTriggerAdjacent(presentation.trigger_type, meta.trigger_type)) {
    score += 1.5;
    pushBreakdown(breakdown, "bonus", "trigger_near_match", 1.5, "still gives fish a close enough strike cue");
  } else if (
    (presentation.trigger_type === "finesse" && (meta.trigger_type === "reaction" || meta.trigger_type === "aggressive")) ||
    (presentation.trigger_type === "aggressive" && meta.trigger_type === "finesse")
  ) {
    score -= 2;
    pushBreakdown(breakdown, "penalty", "trigger_mismatch", 2, "relies on the wrong strike trigger for today's fish mood");
  }

  const noiseDist = bestOrdinalDistance(NOISE_LEVELS, presentation.noise, [meta.noise_level]);
  if (noiseDist === 0) {
    score += 1.5;
    pushBreakdown(breakdown, "bonus", "noise_match", 1.5, `puts off ${noisePhrase(presentation.noise)}`);
  } else if (noiseDist === 1) {
    score += 0.75;
    pushBreakdown(breakdown, "bonus", "noise_near_match", 0.75, "stays close to the right sound level");
  } else if (noiseDist !== null) {
    if (isCautiousWindow(behavior, waterClarity) && meta.noise_level === "loud") {
      score -= 1.5;
      pushBreakdown(breakdown, "penalty", "noise_too_loud", 1.5, "is louder than clear-water, cautious fish should want");
    } else if (isDirtyReactionWindow(presentation, waterClarity) && meta.noise_level === "silent") {
      score -= 1;
      pushBreakdown(breakdown, "penalty", "noise_too_subtle", 1, "may be too quiet for fish to track cleanly in low visibility");
    }
  }

  const flashDist = bestOrdinalDistance(FLASH_LEVELS, presentation.flash, [meta.flash_level]);
  if (flashDist === 0) {
    score += 1.5;
    pushBreakdown(breakdown, "bonus", "flash_match", 1.5, `shows ${flashPhrase(presentation.flash)}`);
  } else if (flashDist === 1) {
    score += 0.75;
    pushBreakdown(breakdown, "bonus", "flash_near_match", 0.75, "stays close to the needed flash level");
  } else if (flashDist !== null) {
    if (isCautiousWindow(behavior, waterClarity) && meta.flash_level === "heavy") {
      score -= 1;
      pushBreakdown(breakdown, "penalty", "flash_too_heavy", 1, "throws more flash than cautious clear-water fish should tolerate");
    } else if (isDirtyReactionWindow(presentation, waterClarity) && meta.flash_level === "none") {
      score -= 1;
      pushBreakdown(breakdown, "penalty", "flash_too_subtle", 1, "may not show enough flash in reduced visibility");
    }
  }

  if (meta.profile === presentation.profile) {
    score += 2;
    pushBreakdown(breakdown, "bonus", "profile_match", 2, `matches ${profilePhrase(presentation.profile)}`);
  } else if (presentation.profile === "medium") {
    score += 1;
    pushBreakdown(breakdown, "bonus", "profile_near_match", 1, "stays close to the target body size");
  } else if (presentation.profile === "slim" && meta.profile === "bulky" && isCautiousWindow(behavior, waterClarity)) {
    score -= 1.5;
    pushBreakdown(breakdown, "penalty", "profile_too_large", 1.5, "shows a bulkier profile than today's fish should prefer");
  } else if (presentation.profile === "bulky" && meta.profile === "slim" && behavior.activity === "aggressive") {
    score -= 1;
    pushBreakdown(breakdown, "penalty", "profile_too_small", 1, "may be slimmer than the biggest aggressive fish should want");
  }

  if (meta.clarity_strengths.includes(waterClarity)) {
    score += CLARITY_MAX_BONUS;
    pushBreakdown(breakdown, "bonus", "clarity_fit", CLARITY_MAX_BONUS, `shows up well in ${waterClarity} water`);
  } else if (waterClarity === "clear") {
    score -= 1;
    pushBreakdown(breakdown, "penalty", "clarity_mismatch", 1, "is not at its best in clear, inspectable water");
  } else if (waterClarity === "dirty") {
    score -= 1;
    pushBreakdown(breakdown, "penalty", "clarity_mismatch", 1, "is not ideal for fish tracking in dirty water");
  }

  if (coverClasses.size > 0) {
    const coverOverlap = meta.cover_strengths.filter((cover) => coverClasses.has(cover));
    if (coverOverlap.length > 0) {
      score += COVER_MAX_BONUS;
      pushBreakdown(
        breakdown,
        "bonus",
        "cover_preference_fit",
        COVER_MAX_BONUS,
        `fits ${coverOverlap[0]!.replace(/_/g, " ")} cover well`,
      );
    }
  }

  if (
    meta.topwater &&
    (presentation.depth_target === "near_bottom" || presentation.depth_target === "bottom") &&
    (behavior.forage_mode === "crab" || behavior.forage_mode === "shrimp" || behavior.forage_mode === "crawfish")
  ) {
    score -= 2.5;
    pushBreakdown(
      breakdown,
      "penalty",
      "topwater_contradiction",
      2.5,
      "is a poor match when fish are set up low and feeding on bottom-oriented forage",
    );
  }

  return score;
}

// ─── Lure scorer ──────────────────────────────────────────────────────────────

const BASE_LURE_MAX = 20 + CLARITY_MAX_BONUS;
const WEEDLESS_BONUS = 1;
const BASE_FLY_MAX = 20 + CLARITY_MAX_BONUS;

function scoreLure(
  meta: LureFamilyMetadata,
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  species: SpeciesGroup,
  context: EngineContext,
  waterClarity: WaterClarity,
): { raw_score: number; breakdown: RankedFamilyScoreBreakdown[]; max_score: number } | null {
  if (!meta.valid_species.includes(species)) return null;
  if (!meta.valid_contexts.includes(context)) return null;
  if (meta.topwater && !presentation.topwater_viable) return null;

  const breakdown: RankedFamilyScoreBreakdown[] = [];
  const coverClasses = deriveCoverClasses(behavior, presentation);
  let score = scoreCommonDimensions(breakdown, behavior, presentation, waterClarity, coverClasses, meta);
  const hasWeeds = hasVegetation(behavior);

  if (presentation.current_technique) {
    const currentDelta = flowBonus(meta.current_suitability);
    score += currentDelta;
    if (currentDelta >= 0) {
      pushBreakdown(breakdown, "bonus", "current_fit", currentDelta, "fishes cleanly in moving current");
    } else {
      pushBreakdown(breakdown, "penalty", "current_mismatch", Math.abs(currentDelta), "is harder to present naturally in moving current");
    }
  }

  if (behavior.tidal_note) {
    const tideDelta = tideBonus(meta.tide_suitability);
    score += tideDelta;
    if (tideDelta >= 0) {
      pushBreakdown(breakdown, "bonus", "tide_fit", tideDelta, "matches a tide-positioned feeding setup");
    } else {
      pushBreakdown(breakdown, "penalty", "tide_mismatch", Math.abs(tideDelta), "is less natural when tide movement is positioning fish");
    }
  }

  if (hasWeeds) {
    if (meta.weedless) {
      score += WEEDLESS_BONUS;
      pushBreakdown(breakdown, "bonus", "cover_fit", WEEDLESS_BONUS, "comes through grass and vegetation cleanly");
    } else if (!meta.topwater) {
      score -= WEEDLESS_BONUS;
      pushBreakdown(breakdown, "penalty", "cover_mismatch", WEEDLESS_BONUS, "is more likely to foul around vegetation");
    }
  }

  const max_score = BASE_LURE_MAX
    + (coverClasses.size > 0 ? COVER_MAX_BONUS : 0)
    + (presentation.current_technique ? CURRENT_MAX_BONUS : 0)
    + (behavior.tidal_note ? TIDE_MAX_BONUS : 0)
    + (hasWeeds ? WEEDLESS_BONUS : 0);

  return { raw_score: roundRaw(score), breakdown: sortedReasons(breakdown), max_score };
}

// ─── Fly scorer ───────────────────────────────────────────────────────────────

function scoreFly(
  meta: FlyFamilyMetadata,
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  species: SpeciesGroup,
  context: EngineContext,
  waterClarity: WaterClarity,
): { raw_score: number; breakdown: RankedFamilyScoreBreakdown[]; max_score: number } | null {
  if (!meta.valid_species.includes(species)) return null;
  if (!meta.valid_contexts.includes(context)) return null;
  if (meta.topwater && !presentation.topwater_viable) return null;

  const breakdown: RankedFamilyScoreBreakdown[] = [];
  const coverClasses = deriveCoverClasses(behavior, presentation);
  let score = scoreCommonDimensions(breakdown, behavior, presentation, waterClarity, coverClasses, meta);

  if (presentation.current_technique) {
    const currentDelta = flowBonus(meta.current_suitability);
    score += currentDelta;
    if (currentDelta >= 0) {
      pushBreakdown(breakdown, "bonus", "current_fit", currentDelta, "mends naturally through moving current");
    } else {
      pushBreakdown(breakdown, "penalty", "current_mismatch", Math.abs(currentDelta), "is harder to keep natural in moving current");
    }
  }

  if (behavior.tidal_note) {
    const tideDelta = tideBonus(meta.tide_suitability);
    score += tideDelta;
    if (tideDelta >= 0) {
      pushBreakdown(breakdown, "bonus", "tide_fit", tideDelta, "matches a tide-driven presentation lane");
    } else {
      pushBreakdown(breakdown, "penalty", "tide_mismatch", Math.abs(tideDelta), "is less natural when fish are set up on tidal flow");
    }
  }

  if (
    waterClarity === "dirty" &&
    meta.profile === "bulky" &&
    !meta.forage_affinity.includes(behavior.forage_mode)
  ) {
    score -= 2;
    pushBreakdown(
      breakdown,
      "penalty",
      "dirty_bulk_mismatch",
      2,
      "is bulkier than a dirty-water mismatch fly should be for the current forage lane",
    );
  }

  if (
    presentation.current_technique &&
    waterClarity === "dirty" &&
    behavior.forage_mode === "crawfish" &&
    !meta.forage_affinity.includes("crawfish") &&
    meta.profile === "bulky"
  ) {
    score -= 2;
    pushBreakdown(
      breakdown,
      "penalty",
      "current_craw_mismatch",
      2,
      "leans too hard on big baitfish movement when fish should be set up on crawfish in current",
    );
  }

  const dirtyRiverCrawWindow =
    context === "freshwater_river" &&
    waterClarity === "dirty" &&
    behavior.forage_mode === "crawfish" &&
    presentation.current_technique !== undefined;

  if (dirtyRiverCrawWindow) {
    const baitfishOnly =
      meta.forage_affinity.length === 1 &&
      meta.forage_affinity[0] === "baitfish";
    const buggerStyleMatch =
      (meta.forage_affinity.includes("crawfish") || meta.forage_affinity.includes("leech")) &&
      meta.current_suitability === "strong" &&
      meta.profile !== "bulky" &&
      meta.trigger_type === "natural_match";

    if (baitfishOnly) {
      score -= 3;
      pushBreakdown(
        breakdown,
        "penalty",
        "dirty_river_craw_forage_mismatch",
        3,
        "leans too hard on baitfish when dirty current fish should stay on crawfish or bugger-style forage",
      );
    }

    if (buggerStyleMatch) {
      score += 1.5;
      pushBreakdown(
        breakdown,
        "bonus",
        "dirty_river_craw_fit",
        1.5,
        "tracks like a bugger- or craw-style fly in dirty current where smallmouth stay on bottom forage",
      );
    }
  }

  return {
    raw_score: roundRaw(score),
    breakdown: sortedReasons(breakdown),
    max_score:
      BASE_FLY_MAX
      + (coverClasses.size > 0 ? COVER_MAX_BONUS : 0)
      + (presentation.current_technique ? CURRENT_MAX_BONUS : 0)
      + (behavior.tidal_note ? TIDE_MAX_BONUS : 0),
  };
}

// ─── Main scorers ─────────────────────────────────────────────────────────────

export function scoreLureFamilies(
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  species: SpeciesGroup,
  context: EngineContext,
  waterClarity: WaterClarity,
): ScoredFamily[] {
  const results: ScoredFamily[] = [];

  for (const meta of Object.values(LURE_FAMILIES)) {
    const scored = scoreLure(meta, behavior, presentation, species, context, waterClarity);
    if (scored === null) continue;

    results.push({
      family_id: meta.id,
      gear_mode: "lure",
      display_name: meta.display_name,
      examples: meta.examples,
      raw_score: scored.raw_score,
      score: normalizedScore(scored.raw_score, scored.max_score),
      breakdown: scored.breakdown,
      score_reasons: scoreReasons(scored.breakdown),
    });
  }

  return results.sort((a, b) =>
    b.raw_score - a.raw_score ||
    b.score - a.score ||
    a.display_name.localeCompare(b.display_name)
  );
}

export function scoreFlyFamilies(
  behavior: BehaviorOutput,
  presentation: PresentationOutput,
  species: SpeciesGroup,
  context: EngineContext,
  waterClarity: WaterClarity,
): ScoredFamily[] {
  const results: ScoredFamily[] = [];

  for (const meta of Object.values(FLY_FAMILIES)) {
    const scored = scoreFly(meta, behavior, presentation, species, context, waterClarity);
    if (scored === null) continue;

    results.push({
      family_id: meta.id,
      gear_mode: "fly",
      display_name: meta.display_name,
      examples: meta.examples,
      raw_score: scored.raw_score,
      score: normalizedScore(scored.raw_score, scored.max_score),
      breakdown: scored.breakdown,
      score_reasons: scoreReasons(scored.breakdown),
      v1_scope_note: meta.v1_scope_note,
    });
  }

  return results.sort((a, b) =>
    b.raw_score - a.raw_score ||
    b.score - a.score ||
    a.display_name.localeCompare(b.display_name)
  );
}

export function topN(ranked: ScoredFamily[], n = 3): ScoredFamily[] {
  return ranked.slice(0, n);
}
