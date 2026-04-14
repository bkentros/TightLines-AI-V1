import type { SharedConditionAnalysis } from "../../howFishingEngine/analyzeSharedConditions.ts";
import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./candidates/index.ts";
import { RESOLVED_COLOR_SHADE_POOLS_V3 } from "./colors.ts";
import {
  normalizeLightBucketV3,
  resolveColorDecisionV3,
} from "./colorDecision.ts";
import { buildConditionFeaturesFromAnalysis } from "./buildConditionFeatures.ts";
import {
  clarityProfileFit,
  dailyConditionFitScore,
} from "./archetypeConditionWeights.ts";
import type {
  ArchetypeWaterColumnV3,
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
  raw_score: number;
  raw_daily_condition_fit: number;
  raw_water_column_fit: number;
  raw_forage_bonus: number;
  raw_clarity_fit: number;
  specificity_bonus: number;
  top3_redundancy_key?: string;
};

function roundScore(value: number): number {
  return Number(value.toFixed(2));
}

function specializationBonus(
  profile: RecommenderV3ArchetypeProfile,
): number {
  return (
    (4 - profile.preferred_water_columns.length) * 100 +
    (3 - profile.preferred_moods.length) * 10 +
    (3 - profile.preferred_presentation_styles.length) * 10 +
    (3 - profile.clarity_strengths.length)
  );
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
  const isTrueFastLane = profile.tactical_lane === "surface" ||
    profile.tactical_lane === "fly_surface" ||
    profile.tactical_lane === "reaction_mid_column" ||
    profile.tactical_lane === "pike_big_profile";
  const isModerateMovingLane = profile.tactical_lane === "horizontal_search" ||
    profile.tactical_lane === "fly_baitfish";
  const isSlowLane = profile.tactical_lane === "bottom_contact" ||
    profile.tactical_lane === "finesse_subtle" ||
    profile.tactical_lane === "fly_bottom";
  const isCleanSurfaceCadenceTool = profile.id === "walking_topwater" ||
    profile.id === "prop_bait" ||
    profile.id === "popping_topwater" ||
    profile.id === "popper_fly";

  if (!daily.surface_allowed_today && isTrueTopwater) return -100;
  if (daily.suppress_true_topwater && isTrueTopwater) return -100;
  if (daily.surface_window_today === "closed" && isSurfaceAdjacentCover) {
    penalty -= 2.15;
  }
  if (daily.suppress_fast_presentations && isTrueFastLane) penalty -= 0.9;
  if (daily.suppress_fast_presentations && isModerateMovingLane) penalty -= 0.3;
  if (daily.pace_bias_today === "fast" && isSlowLane) penalty -= 0.55;
  if (
    profile.id === "walking_topwater" &&
    daily.pace_bias_today !== "fast" &&
    daily.reaction_window_today !== "on"
  ) {
    penalty -= 0.6;
  }
  if (
    profile.id === "prop_bait" &&
    daily.pace_bias_today !== "fast"
  ) {
    penalty -= 0.35;
  }
  if (
    isCleanSurfaceCadenceTool &&
    daily.presentation_presence_today === "subtle"
  ) {
    penalty -= daily.pace_bias_today === "fast" ? 0.2 : 0.75;
  }
  if (
    daily.high_visibility_needed_today &&
    profile.preferred_presentation_styles.includes("subtle") &&
    !profile.preferred_presentation_styles.includes("bold")
  ) {
    penalty -= 0.4;
  }
  return penalty;
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

const NORTHERN_CLEAR_LARGEMOUTH_REGIONS = new Set([
  "northeast",
  "great_lakes_upper_midwest",
  "northern_new_england",
]);

function isUpperWaterColumn(
  column: RecommenderV3ResolvedProfile["likely_water_column_today"],
): boolean {
  return column === "top" || column === "high_top" || column === "high" ||
    column === "mid_high";
}

function isShallowMidWaterColumn(
  column: RecommenderV3ResolvedProfile["likely_water_column_today"],
): boolean {
  return isUpperWaterColumn(column) || column === "mid";
}

function largemouthSpeciesContextBonus(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
): number {
  if (seasonal.species !== "largemouth_bass" || !daily) return 0;

  const month = seasonal.month;
  const baitfishWindow = seasonal.primary_forage === "baitfish" ||
    seasonal.primary_forage === "bluegill_perch" ||
    seasonal.secondary_forage === "baitfish" ||
    seasonal.secondary_forage === "bluegill_perch";
  const warmGrassLakeWindow = seasonal.context === "freshwater_lake_pond" &&
    month >= 5 && month <= 10 &&
    baitfishWindow &&
    isUpperWaterColumn(resolved.likely_water_column_today);
  const riverCurrentWindow = seasonal.context === "freshwater_river" &&
    month >= 3 && month <= 11 &&
    daily.pace_bias_today !== "slow" &&
    isShallowMidWaterColumn(resolved.likely_water_column_today);
  const northernClearSummerWindow =
    seasonal.context === "freshwater_lake_pond" &&
    clarity === "clear" &&
    NORTHERN_CLEAR_LARGEMOUTH_REGIONS.has(seasonal.region_key) &&
    month >= 6 && month <= 10;
  const mountainWestClearSummerWindow =
    seasonal.region_key === "mountain_west" &&
    seasonal.context === "freshwater_lake_pond" &&
    clarity === "clear" &&
    month >= 7 && month <= 9 &&
    isUpperWaterColumn(resolved.likely_water_column_today);
  const clearSummerShallowLakeWindow =
    seasonal.context === "freshwater_lake_pond" &&
    clarity === "clear" &&
    month >= 7 && month <= 9 &&
    isUpperWaterColumn(resolved.likely_water_column_today);
  const southCentralCurrentRiverWindow =
    seasonal.region_key === "south_central" &&
    seasonal.context === "freshwater_river" &&
    [3, 4, 5, 9, 10, 11].includes(month) &&
    daily.suppress_fast_presentations &&
    isUpperWaterColumn(resolved.likely_water_column_today);
  const dirtySummerRiverWindow =
    seasonal.context === "freshwater_river" &&
    clarity === "dirty" &&
    month >= 6 && month <= 8 &&
    daily.high_visibility_needed_today;
  const prespawnBaitfishLakeWindow =
    seasonal.context === "freshwater_lake_pond" &&
    month >= 2 && month <= 4 &&
    baitfishWindow &&
    daily.pace_bias_today !== "slow";
  const fallBaitfishLakeWindow = seasonal.context === "freshwater_lake_pond" &&
    month >= 9 && month <= 11 &&
    baitfishWindow;
  const southCentralSpawnTransitionLakeWindow =
    seasonal.region_key === "south_central" &&
    seasonal.context === "freshwater_lake_pond" &&
    month === 4 &&
    seasonal.primary_forage === "crawfish" &&
    seasonal.secondary_forage === "baitfish" &&
    resolved.likely_water_column_today === "top" &&
    daily.pace_bias_today !== "fast";

  let bonus = 0;

  if (warmGrassLakeWindow) {
    switch (profile.id) {
      case "hollow_body_frog":
        bonus += daily.surface_window_today === "closed" ? -0.35 : 1.1;
        break;
      case "frog_fly":
        bonus += daily.surface_window_today === "closed" ? -0.35 : 1.0;
        break;
      case "buzzbait":
        bonus += daily.surface_window_today === "closed" ? -0.45 : 0.75;
        break;
      case "prop_bait":
        bonus += daily.surface_window_today === "clean" ||
            daily.surface_window_today === "rippled"
          ? (
            daily.pace_bias_today === "fast" ||
              daily.reaction_window_today === "on" ||
              seasonal.region_key === "florida" ||
              seasonal.region_key === "gulf_coast"
            ? 0.55
            : -0.6
          )
          : -0.55;
        break;
      case "walking_topwater":
        bonus += daily.surface_window_today === "clean" ||
            daily.surface_window_today === "rippled"
          ? 0.35
          : -0.7;
        break;
      case "popping_topwater":
      case "popper_fly":
        bonus += daily.surface_window_today === "clean" ||
            daily.surface_window_today === "rippled"
          ? 0.1
          : -0.6;
        break;
      case "swim_jig":
        bonus += 1.15;
        break;
      case "spinnerbait":
        bonus += 0.65;
        break;
      case "bladed_jig":
        bonus += 0.55;
        break;
      case "texas_rigged_stick_worm":
        bonus += 0.45;
        break;
      case "compact_flipping_jig":
        bonus += 0.45;
        break;
      case "game_changer":
        bonus += 0.45;
        break;
      case "mouse_fly":
        bonus += daily.surface_window_today === "closed" ? -0.2 : 0.6;
        break;
      case "clouser_minnow":
        bonus += 0.25;
        break;
      case "woolly_bugger":
        bonus -= 0.35;
        break;
      case "rabbit_strip_leech":
        bonus -= 0.45;
        break;
      case "crawfish_streamer":
        bonus -= 0.5;
        break;
      case "drop_shot_worm":
        bonus -= 1.15;
        break;
      case "drop_shot_minnow":
        bonus -= 1.0;
        break;
      case "blade_bait":
        bonus -= 1.25;
        break;
      case "flat_sided_crankbait":
        bonus -= 0.8;
        break;
      case "medium_diving_crankbait":
        bonus -= 0.55;
        break;
      case "deep_diving_crankbait":
        bonus -= 0.4;
        break;
      case "football_jig":
        bonus -= 0.45;
        break;
      case "finesse_jig":
        bonus -= 0.4;
        break;
    }
  }

  if (riverCurrentWindow) {
    switch (profile.id) {
      case "spinnerbait":
        bonus += 1.2;
        break;
      case "swim_jig":
        bonus += 1.15;
        break;
      case "soft_jerkbait":
        bonus += 1.05;
        break;
      case "squarebill_crankbait":
        bonus += 0.95;
        break;
      case "paddle_tail_swimbait":
        bonus += 0.7;
        break;
      case "bladed_jig":
        bonus += 0.55;
        break;
      case "clouser_minnow":
        bonus += 0.95;
        break;
      case "game_changer":
        bonus += 0.8;
        break;
      case "deceiver":
        bonus += 0.65;
        break;
      case "articulated_baitfish_streamer":
        bonus += 0.5;
        break;
      case "popper_fly":
        bonus += month >= 6 && month <= 9 &&
            daily.surface_window_today !== "closed"
          ? 0.45
          : -0.2;
        break;
      case "frog_fly":
        bonus += month >= 6 && month <= 9 &&
            daily.surface_window_today !== "closed"
          ? 0.4
          : -0.25;
        break;
      case "compact_flipping_jig":
        bonus -= 0.6;
        break;
      case "texas_rigged_soft_plastic_craw":
        bonus -= 1.1;
        break;
      case "texas_rigged_stick_worm":
        bonus -= 0.55;
        break;
      case "shaky_head_worm":
        bonus -= 0.95;
        break;
      case "drop_shot_worm":
        bonus -= 1.25;
        break;
      case "tube_jig":
        bonus -= 1.3;
        break;
      case "football_jig":
        bonus -= 0.8;
        break;
      case "woolly_bugger":
        bonus -= 0.4;
        break;
      case "rabbit_strip_leech":
        bonus -= 0.45;
        break;
      case "crawfish_streamer":
        bonus -= 0.55;
        break;
    }
  }

  if (northernClearSummerWindow) {
    switch (profile.id) {
      case "walking_topwater":
        bonus -= 0.35;
        break;
      case "prop_bait":
        bonus -= 0.75;
        break;
      case "popping_topwater":
        bonus -= 0.25;
        break;
      case "buzzbait":
        bonus -= 0.2;
        break;
      case "hollow_body_frog":
        bonus -= 0.2;
        break;
    }

    if (daily.surface_window_today !== "clean") {
      switch (profile.id) {
        case "walking_topwater":
          bonus -= 0.8;
          break;
        case "prop_bait":
          bonus -= 1.0;
          break;
        case "popping_topwater":
          bonus -= 0.7;
          break;
        case "buzzbait":
          bonus -= 0.65;
          break;
        case "hollow_body_frog":
          bonus -= 0.55;
          break;
      }
    }

    if (daily.presentation_presence_today === "subtle") {
      switch (profile.id) {
        case "walking_topwater":
          bonus -= 1.1;
          break;
        case "prop_bait":
          bonus -= 1.15;
          break;
        case "popping_topwater":
          bonus -= 0.8;
          break;
        case "buzzbait":
          bonus -= 0.55;
          break;
      }
    }

    switch (profile.id) {
      case "swim_jig":
        bonus += 0.8;
        break;
      case "weightless_stick_worm":
      case "wacky_rigged_stick_worm":
        bonus += 0.75;
        break;
      case "paddle_tail_swimbait":
        bonus += 0.55;
        break;
      case "soft_jerkbait":
        bonus += 0.45;
        break;
      case "drop_shot_worm":
        bonus += daily.pace_bias_today === "fast" ? -0.2 : 0.25;
        break;
      case "game_changer":
        bonus += 0.35;
        break;
      case "clouser_minnow":
        bonus += 0.3;
        break;
      case "carolina_rigged_stick_worm":
        bonus -= 0.5;
        break;
      case "medium_diving_crankbait":
        bonus -= 0.35;
        break;
    }
  }

  if (mountainWestClearSummerWindow) {
    switch (profile.id) {
      case "swim_jig":
        bonus += 1.75;
        break;
      case "paddle_tail_swimbait":
        bonus += 1.8;
        break;
      case "compact_flipping_jig":
        bonus += 0.8;
        break;
      case "texas_rigged_stick_worm":
        bonus += 1.2;
        break;
      case "soft_jerkbait":
        bonus += 0.65;
        break;
      case "game_changer":
        bonus += 0.25;
        break;
      case "drop_shot_worm":
        bonus -= 3.4;
        break;
      case "drop_shot_minnow":
        bonus -= 2.55;
        break;
      case "walking_topwater":
        bonus -= 0.85;
        break;
      case "prop_bait":
        bonus -= 0.95;
        break;
      case "buzzbait":
        bonus -= 0.55;
        break;
    }
  }

  if (clearSummerShallowLakeWindow) {
    switch (profile.id) {
      case "swim_jig":
        bonus += 0.5;
        break;
      case "paddle_tail_swimbait":
        bonus += 0.45;
        break;
      case "soft_jerkbait":
        bonus += 0.35;
        break;
      case "weightless_stick_worm":
      case "wacky_rigged_stick_worm":
        bonus += 0.35;
        break;
      case "drop_shot_worm":
        bonus += daily.pace_bias_today === "slow" ? 0.15 : -0.9;
        break;
      case "drop_shot_minnow":
        bonus += daily.pace_bias_today === "slow" ? 0.15 : -0.95;
        break;
    }
  }

  if (prespawnBaitfishLakeWindow) {
    switch (profile.id) {
      case "suspending_jerkbait":
        bonus += 0.85;
        break;
      case "paddle_tail_swimbait":
        bonus += 0.75;
        break;
      case "spinnerbait":
        bonus += 0.65;
        break;
      case "soft_jerkbait":
        bonus += 0.55;
        break;
      case "swim_jig":
        bonus += 0.45;
        break;
      case "clouser_minnow":
        bonus += 0.45;
        break;
      case "game_changer":
      case "deceiver":
        bonus += 0.3;
        break;
      case "football_jig":
        bonus -= 0.35;
        break;
      case "texas_rigged_soft_plastic_craw":
        bonus -= 0.45;
        break;
    }
  }

  if (fallBaitfishLakeWindow) {
    switch (profile.id) {
      case "squarebill_crankbait":
        bonus += clarity === "dirty"
          ? (daily.pace_bias_today === "fast" ? 0.15 : -0.45)
          : 0.8;
        break;
      case "suspending_jerkbait":
        bonus += 0.75;
        break;
      case "paddle_tail_swimbait":
        bonus += 0.65;
        break;
      case "spinnerbait":
        bonus += 0.55;
        break;
      case "bladed_jig":
        bonus += 0.35;
        break;
      case "flat_sided_crankbait":
        bonus += month >= 10 ? 0.45 : 0.2;
        break;
      case "deceiver":
        bonus += 0.4;
        break;
      case "clouser_minnow":
        bonus += 0.35;
        break;
      case "game_changer":
        bonus += 0.3;
        break;
      case "swim_jig":
        bonus += isUpperWaterColumn(resolved.likely_water_column_today) ? 0.45 : 0.2;
        break;
      case "medium_diving_crankbait":
        bonus -= isUpperWaterColumn(resolved.likely_water_column_today) ? 0.55 : 0;
        break;
      case "deep_diving_crankbait":
        bonus -= isUpperWaterColumn(resolved.likely_water_column_today) ? 0.45 : 0;
        break;
      case "lipless_crankbait":
        bonus -= isUpperWaterColumn(resolved.likely_water_column_today) ? 0.35 : 0;
        break;
      case "football_jig":
        bonus -= daily.pace_bias_today === "slow" ? 0.1 : 0.35;
        break;
      case "texas_rigged_soft_plastic_craw":
        bonus -= daily.pace_bias_today === "slow" ? 0.15 : 0.55;
        break;
      case "shaky_head_worm":
        bonus -= daily.pace_bias_today === "slow" ? 0.2 : 0.6;
        break;
      case "woolly_bugger":
        bonus -= 0.2;
        break;
    }
  }

  if (southCentralSpawnTransitionLakeWindow) {
    switch (profile.id) {
      case "compact_flipping_jig":
        bonus += 1.05;
        break;
      case "wacky_rigged_stick_worm":
        bonus += 1.0;
        break;
      case "swim_jig":
        bonus += 0.9;
        break;
      case "spinnerbait":
        bonus += 0.45;
        break;
      case "weightless_stick_worm":
        bonus += 0.55;
        break;
      case "soft_jerkbait":
        bonus -= 0.45;
        break;
      case "suspending_jerkbait":
        bonus -= 0.35;
        break;
      case "paddle_tail_swimbait":
        bonus -= 0.2;
        break;
      case "clouser_minnow":
      case "game_changer":
        bonus += 0.2;
        break;
    }
  }

  if (southCentralCurrentRiverWindow) {
    switch (profile.id) {
      case "spinnerbait":
        bonus += 1.15;
        break;
      case "swim_jig":
        bonus += 1.05;
        break;
      case "soft_jerkbait":
        bonus += 0.95;
        break;
      case "squarebill_crankbait":
        bonus += 0.9;
        break;
      case "paddle_tail_swimbait":
        bonus += 0.55;
        break;
      case "bladed_jig":
        bonus += 0.35;
        break;
      case "clouser_minnow":
        bonus += 0.95;
        break;
      case "game_changer":
        bonus += 0.8;
        break;
      case "deceiver":
        bonus += 0.7;
        break;
      case "articulated_baitfish_streamer":
        bonus += 0.55;
        break;
      case "compact_flipping_jig":
        bonus -= 1.35;
        break;
      case "texas_rigged_soft_plastic_craw":
        bonus -= 1.45;
        break;
      case "woolly_bugger":
        bonus -= 0.75;
        break;
      case "rabbit_strip_leech":
        bonus -= 1.2;
        break;
      case "crawfish_streamer":
        bonus -= 0.95;
        break;
    }
  }

  if (dirtySummerRiverWindow) {
    switch (profile.id) {
      case "spinnerbait":
        bonus += 0.35;
        break;
      case "swim_jig":
        bonus += 0.3;
        break;
      case "compact_flipping_jig":
        bonus += 0.25;
        break;
      case "game_changer":
        bonus += 0.75;
        break;
      case "woolly_bugger":
        bonus += 0.95;
        break;
      case "crawfish_streamer":
        bonus += 1.5;
        break;
      case "frog_fly":
        bonus += daily.surface_window_today === "closed" ? 0.1 : 0.55;
        break;
      case "articulated_dungeon_streamer":
        bonus += 1.2;
        break;
      case "mouse_fly":
        bonus += daily.surface_window_today === "closed" ? -0.15 : 0.55;
        break;
      case "clouser_minnow":
        bonus -= 2.25;
        break;
      case "deceiver":
        bonus -= 0.45;
        break;
    }
  }

  return bonus;
}

function breakdownEntry(
  code: string,
  value: number,
  detail: string,
): RecommenderV3ScoreBreakdown {
  return {
    code,
    value: roundScore(value),
    detail,
    direction: value < 0 ? "penalty" : "bonus",
  };
}

function scoreProfile(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
  lightLabel: string | null,
  analysis: SharedConditionAnalysis,
): ScoredSelectionCandidate {
  const breakdown: RecommenderV3ScoreBreakdown[] = [];

  const features = daily
    ? buildConditionFeaturesFromAnalysis(
      analysis,
      daily,
      clarity,
      seasonal.context,
    )
    : null;

  const targetColumn = toArchetypeWaterColumn(resolved.likely_water_column_today);
  const raw_water_column_fit = waterColumnFit(targetColumn, profile);
  const water_column_fit = roundScore(raw_water_column_fit);
  breakdown.push(
    breakdownEntry(
      "water_column_fit",
      water_column_fit,
      "Compares today's resolved water column to the archetype's preferred lanes.",
    ),
  );

  const raw_posture_fit = moodFit(toMood(resolved.daily_posture_band), profile);
  const posture_fit = roundScore(raw_posture_fit);
  breakdown.push(
    breakdownEntry(
      "posture_fit",
      posture_fit,
      "Matches daily fish willingness (from posture band) to archetype mood.",
    ),
  );

  const raw_presentation_fit = presentationFit(
    resolved.presentation_presence_today,
    profile,
  );
  const presentation_fit_value = roundScore(raw_presentation_fit);
  breakdown.push(
    breakdownEntry(
      "presentation_fit",
      presentation_fit_value,
      "Aligns daily presentation presence (subtle/balanced/bold) with the archetype.",
    ),
  );

  const raw_forage_bonus = forageBonusValue(seasonal, profile);
  const forage_bonus = roundScore(raw_forage_bonus);
  breakdown.push(
    breakdownEntry(
      "forage_bonus",
      forage_bonus,
      "Seasonal primary/secondary forage alignment.",
    ),
  );

  const raw_daily_condition_fit = features
    ? dailyConditionFitScore(features, profile.tactical_lane, profile.id)
    : 0;
  const daily_condition_fit = roundScore(raw_daily_condition_fit);
  breakdown.push(
    breakdownEntry(
      "daily_condition_fit",
      daily_condition_fit,
      "Weather and flow features × tactical lane (and small per-id tuning).",
    ),
  );

  const raw_clarity_fit = clarityProfileFit(clarity, profile.clarity_strengths);
  const clarity_fit = roundScore(raw_clarity_fit);
  breakdown.push(
    breakdownEntry(
      "clarity_fit",
      clarity_fit,
      "User water clarity vs archetype clarity strengths.",
    ),
  );

  const raw_guardrail_penalty = guardrailPenaltyValue(profile, daily);
  const guardrail_penalty = roundScore(raw_guardrail_penalty);
  breakdown.push({
    code: "guardrail_penalty",
    value: guardrail_penalty,
    detail: "Hard limits for illegal surface or pace when today's rules forbid them.",
    direction: guardrail_penalty < 0 ? "penalty" : "bonus",
  });

  const raw_species_context_fit = largemouthSpeciesContextBonus(
    profile,
    seasonal,
    resolved,
    daily,
    clarity,
  );
  const species_context_fit = roundScore(raw_species_context_fit);
  if (species_context_fit !== 0) {
    breakdown.push(
      breakdownEntry(
        "species_context_fit",
        species_context_fit,
        "Species-specific largemouth seasonal/context tuning layered on top of the shared weather scorer.",
      ),
    );
  }

  const raw_score =
    raw_water_column_fit +
    raw_posture_fit +
    raw_presentation_fit +
    raw_forage_bonus +
    raw_daily_condition_fit +
    raw_clarity_fit +
    raw_guardrail_penalty +
    raw_species_context_fit;
  const score = roundScore(raw_score);

  const color_theme = resolveColorDecisionV3(
    clarity,
    normalizeLightBucketV3(lightLabel),
  ).color_theme;
  const color_recommendations = firstThreeColors(color_theme);

  return {
    candidate: {
      id: profile.id,
      display_name: profile.display_name,
      gear_mode: profile.gear_mode,
      family_key: profile.family_key,
      tactical_lane: profile.tactical_lane,
      score,
      water_column_fit,
      posture_fit,
      presentation_fit: presentation_fit_value,
      forage_bonus,
      daily_condition_fit,
      clarity_fit,
      guardrail_penalty,
      color_theme,
      color_recommendations,
      breakdown,
    },
    raw_score,
    raw_daily_condition_fit,
    raw_water_column_fit,
    raw_forage_bonus,
    raw_clarity_fit,
    specificity_bonus: specializationBonus(profile),
    top3_redundancy_key: profile.top3_redundancy_key,
  };
}

function lanePace(
  lane: RecommenderV3RankedArchetype["tactical_lane"],
): "slow" | "medium" | "fast" {
  switch (lane) {
    case "bottom_contact":
    case "finesse_subtle":
    case "fly_bottom":
      return "slow";
    case "reaction_mid_column":
    case "surface":
    case "pike_big_profile":
    case "fly_surface":
      return "fast";
    case "horizontal_search":
    case "cover_weedless":
    case "fly_baitfish":
    default:
      return "medium";
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
  return lane === "bottom_contact" || lane === "finesse_subtle" ||
    lane === "fly_bottom";
}

function isSurfaceAdjacentCandidate(
  candidate: ScoredSelectionCandidate,
): boolean {
  return isSurfaceLane(candidate.candidate.tactical_lane) ||
    candidate.candidate.id === "hollow_body_frog" ||
    candidate.candidate.id === "frog_fly" ||
    candidate.candidate.id === "mouse_fly";
}

type Top3StoryMode =
  | "surface_window"
  | "fast_search"
  | "slow_grind"
  | "neutral";

function inferTop3StoryMode(
  top: ScoredSelectionCandidate,
  daily: RecommenderV3DailyPayload | undefined,
): Top3StoryMode {
  if (!daily) return "neutral";
  if (isSurfaceLane(top.candidate.tactical_lane)) return "surface_window";
  if (daily.pace_bias_today === "slow" || daily.suppress_fast_presentations) {
    return "slow_grind";
  }
  if (daily.pace_bias_today === "fast" || lanePace(top.candidate.tactical_lane) === "fast") {
    return "fast_search";
  }
  if (isBottomLane(top.candidate.tactical_lane)) return "slow_grind";
  return "neutral";
}

function coherenceTier(
  candidate: ScoredSelectionCandidate,
  top: ScoredSelectionCandidate,
  story: Top3StoryMode,
  daily: RecommenderV3DailyPayload | undefined,
): number {
  const lane = candidate.candidate.tactical_lane;
  const pace = lanePace(lane);

  if (!daily) return 0;
  if (
    isSurfaceAdjacentCandidate(candidate) &&
    (
      !daily.surface_allowed_today ||
      daily.surface_window_today === "closed" ||
      story === "slow_grind"
    )
  ) {
    return 3;
  }

  switch (story) {
    case "surface_window":
      if (isBottomLane(lane)) return 3;
      if (isSurfaceAdjacentCandidate(candidate)) return 0;
      if (lane === "horizontal_search" || lane === "cover_weedless" ||
        lane === "fly_baitfish" || lane === "pike_big_profile") {
        return 1;
      }
      return 2;
    case "fast_search":
      if (isBottomLane(lane)) return 3;
      if (pace === "fast") return 0;
      if (pace === "medium") return 1;
      return 3;
    case "slow_grind":
      if (isSurfaceAdjacentCandidate(candidate)) return 3;
      if (pace === "slow") return 0;
      if (lane === "cover_weedless") return 1;
      if (pace === "medium") return 2;
      return 3;
    case "neutral":
    default:
      if (
        isSurfaceAdjacentCandidate(top) &&
        isBottomLane(lane) &&
        (daily.presentation_presence_today === "subtle" ||
          daily.surface_window_today !== "clean")
      ) {
        return 3;
      }
      if (
        isBottomLane(top.candidate.tactical_lane) &&
        isSurfaceAdjacentCandidate(candidate) &&
        (daily.presentation_presence_today === "subtle" ||
          daily.surface_window_today !== "clean")
      ) {
        return 3;
      }
      return 0;
  }
}

function selectTopThree(
  scored: ScoredSelectionCandidate[],
  daily: RecommenderV3DailyPayload | undefined,
): RecommenderV3RankedArchetype[] {
  const sorted = [...scored].sort((a, b) =>
    b.raw_score - a.raw_score ||
    b.raw_daily_condition_fit - a.raw_daily_condition_fit ||
    b.raw_water_column_fit - a.raw_water_column_fit ||
    b.raw_forage_bonus - a.raw_forage_bonus ||
    b.raw_clarity_fit - a.raw_clarity_fit ||
    b.specificity_bonus - a.specificity_bonus ||
    a.candidate.id.localeCompare(b.candidate.id)
  );
  const top = sorted[0];
  const story = top ? inferTop3StoryMode(top, daily) : "neutral";
  const selected: ScoredSelectionCandidate[] = [];
  const usedRedundancyKeys = new Set<string>();

  const remaining = top
    ? [top, ...sorted.slice(1).sort((a, b) =>
      coherenceTier(a, top, story, daily) - coherenceTier(b, top, story, daily) ||
      b.raw_score - a.raw_score ||
      b.raw_daily_condition_fit - a.raw_daily_condition_fit ||
      b.raw_water_column_fit - a.raw_water_column_fit ||
      b.raw_forage_bonus - a.raw_forage_bonus ||
      b.raw_clarity_fit - a.raw_clarity_fit ||
      b.specificity_bonus - a.specificity_bonus ||
      a.candidate.id.localeCompare(b.candidate.id)
    )]
    : sorted;

  for (const candidate of remaining) {
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

  for (const candidate of remaining) {
    if (selected.length >= 3) break;
    if (!selected.some((item) => item.candidate.id === candidate.candidate.id)) {
      selected.push(candidate);
    }
  }

  return selected.map((candidate) => candidate.candidate);
}

function assertEligiblePools(seasonal: RecommenderV3SeasonalRow): void {
  if (seasonal.eligible_lure_ids.length < 3) {
    throw new Error(
      `Seasonal row ${seasonal.species} ${seasonal.region_key} m${seasonal.month} ${seasonal.context}: need >= 3 eligible lures`,
    );
  }
  if (seasonal.eligible_fly_ids.length < 3) {
    throw new Error(
      `Seasonal row ${seasonal.species} ${seasonal.region_key} m${seasonal.month} ${seasonal.context}: need >= 3 eligible flies`,
    );
  }
}

export function scoreLureCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
  lightLabel: string | null,
  analysis: SharedConditionAnalysis,
): RecommenderV3RankedArchetype[] {
  assertEligiblePools(seasonal);
  const scored = seasonal.eligible_lure_ids.map((id) =>
    scoreProfile(
      LURE_ARCHETYPES_V3[id],
      seasonal,
      resolved,
      daily,
      clarity,
      lightLabel,
      analysis,
    )
  );
  return selectTopThree(scored, daily);
}

export function scoreFlyCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload | undefined,
  clarity: WaterClarity,
  lightLabel: string | null,
  analysis: SharedConditionAnalysis,
): RecommenderV3RankedArchetype[] {
  assertEligiblePools(seasonal);
  const scored = seasonal.eligible_fly_ids.map((id) =>
    scoreProfile(
      FLY_ARCHETYPES_V3[id],
      seasonal,
      resolved,
      daily,
      clarity,
      lightLabel,
      analysis,
    )
  );
  return selectTopThree(scored, daily);
}
