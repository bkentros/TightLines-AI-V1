import type { WaterClarity } from "../contracts/input.ts";
import { FLY_ARCHETYPES_V3, LURE_ARCHETYPES_V3 } from "./candidates/index.ts";
import { RESOLVED_COLOR_SHADE_POOLS_V3 } from "./colors.ts";
import {
  buildHowToFish,
  buildWhyChosen,
} from "./recommendationCopy.ts";
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
} from "./contracts.ts";
import type { ScoredCandidate } from "./scoringTypes.ts";
import {
  archetypeFitsMonthlyBaselineLanes,
  archetypeFitsStrictMonthlyBaselineLanes,
} from "./seasonal/validateSeasonalRow.ts";
import {
  peerArchetypesCoherenceConflict,
  selectTopThreeCandidates,
} from "./topThreeSelection.ts";

function roundScore(value: number): number {
  return Number(value.toFixed(2));
}

function firstThreeColors(theme: keyof typeof RESOLVED_COLOR_SHADE_POOLS_V3): [string, string, string] {
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

/** Monthly primaries that explicitly name open hard-surface lures (not frog). */
const OPEN_SURFACE_LURE_IDS = new Set<LureArchetypeIdV3>([
  "walking_topwater",
  "popping_topwater",
  "buzzbait",
  "prop_bait",
]);

/**
 * Keeps largemouth lake scoring aligned with authored monthly primaries when
 * daily conditions would otherwise over-promote backups (finesse, roaming
 * swimbait, or open topwater) ahead of the month's lead lanes.
 */
function largemouthLakeGuardAdjustments(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
): number {
  if (seasonal.species !== "largemouth_bass") return 0;
  if (seasonal.context !== "freshwater_lake_pond") return 0;

  const month = seasonal.month;
  let delta = 0;

  if (profile.gear_mode === "lure") {
    const prim = seasonal.primary_lure_ids ?? [];
    const id = profile.id as LureArchetypeIdV3;

    const monthlyNamesOpenSurface = prim.some((p) => OPEN_SURFACE_LURE_IDS.has(p));
    if (profile.is_surface && !monthlyNamesOpenSurface) {
      delta -= 1.85;
    }

    const coldWinterMonth = month === 1 || month === 2 || month === 12;
    if (
      coldWinterMonth &&
      id === "drop_shot_worm" &&
      !prim.includes("drop_shot_worm") &&
      prim.includes("suspending_jerkbait")
    ) {
      delta -= 1.15;
    }

    if (
      (month === 4 || month === 5) &&
      id === "paddle_tail_swimbait" &&
      !prim.includes("paddle_tail_swimbait")
    ) {
      delta -= prim.includes("weightless_stick_worm") ? 2.45 : 1.05;
    }

    if (
      (month === 6 || month === 7 || month === 8) &&
      id === "drop_shot_worm" &&
      !prim.includes("drop_shot_worm")
    ) {
      delta -= 0.95;
    }

    if (
      month === 8 &&
      id === "paddle_tail_swimbait" &&
      !prim.includes("paddle_tail_swimbait") &&
      prim.includes("swim_jig")
    ) {
      delta -= 0.8;
    }

    if (
      (month === 4 || month === 5) &&
      id === "soft_jerkbait" &&
      !prim.includes("soft_jerkbait") &&
      prim.includes("weightless_stick_worm")
    ) {
      delta -= 1.85;
    }

    if (
      (month === 4 || month === 5) &&
      id === "weightless_stick_worm" &&
      prim.includes("weightless_stick_worm")
    ) {
      delta += 0.35;
    }

    if (
      seasonal.region_key === "great_lakes_upper_midwest" &&
      month === 8 &&
      id === "soft_jerkbait" &&
      !prim.includes("soft_jerkbait") &&
      prim.includes("swim_jig")
    ) {
      delta -= 0.85;
    }

    if (
      seasonal.region_key === "florida" &&
      month === 3 &&
      (id === "compact_flipping_jig" || id === "football_jig") &&
      prim.includes("suspending_jerkbait") &&
      prim.includes("spinnerbait")
    ) {
      delta -= 1.25;
    }

    // South-central / Ozarks-style clear reservoirs in true winter: jerkbait/flat/jig lead;
    // do not let finesse plastics outrank authored cold-reservoir primaries.
    // South-central clear Feb–Mar: Texas rig is a backup, not the headline prespawn lure.
    if (
      seasonal.region_key === "south_central" &&
      (month === 2 || month === 3) &&
      seasonal.context === "freshwater_lake_pond" &&
      id === "texas_rigged_soft_plastic_craw" &&
      !prim.includes("texas_rigged_soft_plastic_craw") &&
      prim.includes("suspending_jerkbait")
    ) {
      delta -= 1.35;
    }

    // Same window: shaky-head finesse is a backup, not ahead of jerkbait/flat prespawn primaries.
    if (
      seasonal.region_key === "south_central" &&
      (month === 2 || month === 3) &&
      seasonal.context === "freshwater_lake_pond" &&
      id === "shaky_head_worm" &&
      !prim.includes("shaky_head_worm") &&
      prim.includes("suspending_jerkbait")
    ) {
      delta -=
        daily.posture_band === "suppressed" ||
          daily.posture_band === "slightly_suppressed" ||
          daily.suppress_fast_presentations
        ? 2.55
        : 2.05;
    }
    if (
      seasonal.region_key === "south_central" &&
      (month === 2 || month === 3) &&
      seasonal.context === "freshwater_lake_pond" &&
      id === "suspending_jerkbait" &&
      prim.includes("suspending_jerkbait")
    ) {
      delta += 0.72;
    }

    if (
      seasonal.region_key === "south_central" &&
      month === 12 &&
      seasonal.context === "freshwater_lake_pond" &&
      prim.includes("suspending_jerkbait")
    ) {
      if (id === "shaky_head_worm" && !prim.includes("shaky_head_worm")) {
        delta -= 1.65;
      }
      if (id === "paddle_tail_swimbait" && !prim.includes("paddle_tail_swimbait")) {
        delta -= 1.2;
      }
      if (id === "texas_rigged_soft_plastic_craw" && !prim.includes("texas_rigged_soft_plastic_craw")) {
        delta -= 0.95;
      }
      if (id === "suspending_jerkbait") delta += 0.42;
      if (id === "flat_sided_crankbait") delta += 0.38;
      if (id === "football_jig") delta += 0.32;
    }

    // Great Lakes October weed-edge: matrix expects spinnerbait/swim-jig ahead of jerkbait
    // when monthly primaries list reaction edges before mid-column suspenders.
    if (
      seasonal.region_key === "great_lakes_upper_midwest" &&
      month === 10 &&
      seasonal.context === "freshwater_lake_pond" &&
      prim.includes("spinnerbait") &&
      prim.includes("swim_jig")
    ) {
      if (id === "spinnerbait") delta += 0.95;
      if (id === "swim_jig") delta += 0.95;
      if (id === "suspending_jerkbait" && !prim.includes("suspending_jerkbait")) {
        delta -= 0.85;
      }
      if (
        id === "paddle_tail_swimbait" &&
        prim.includes("paddle_tail_swimbait") &&
        prim.includes("spinnerbait") &&
        prim.indexOf("paddle_tail_swimbait") > prim.indexOf("spinnerbait")
      ) {
        delta -= 0.72;
      }
      if (id === "walking_topwater" && !prim.includes("walking_topwater")) {
        delta -= 1.55;
      }
    }

    // Pacific Northwest March stained prespawn: keep squarebill/spinner/jerk/football
    // ahead of lipless vibration when the day is metabolically suppressed.
    if (
      seasonal.region_key === "pacific_northwest" &&
      month === 3 &&
      id === "lipless_crankbait" &&
      !prim.includes("lipless_crankbait") &&
      (daily.posture_band === "suppressed" || daily.suppress_fast_presentations)
    ) {
      delta -= 1.35;
    }
    if (
      seasonal.region_key === "pacific_northwest" &&
      month === 3 &&
      (id === "football_jig" || id === "spinnerbait" || id === "suspending_jerkbait" ||
        id === "squarebill_crankbait") &&
      prim.includes(id)
    ) {
      delta += 0.42;
    }

    // Pacific Northwest August stained weed lakes: swim jig / frog are monthly leads;
    // do not let drop-shot minnow hijack rank 1 on warm stable summer days.
    if (
      seasonal.region_key === "pacific_northwest" &&
      month === 8 &&
      id === "drop_shot_minnow" &&
      !prim.includes("drop_shot_minnow") &&
      (prim.includes("swim_jig") || prim.includes("hollow_body_frog"))
    ) {
      delta -= daily.posture_band === "suppressed" ? 1.05 : 1.55;
    }
    if (
      seasonal.region_key === "pacific_northwest" &&
      month === 8 &&
      (id === "swim_jig" || id === "hollow_body_frog") &&
      prim.includes(id)
    ) {
      delta += 0.48;
    }

    // Mountain West February extreme-cold reservoirs: football/jerk/flat lead the row;
    // Texas rig stays a backup, not the default top-1 on the most suppressed days.
    if (
      seasonal.region_key === "mountain_west" &&
      month === 2 &&
      id === "texas_rigged_soft_plastic_craw" &&
      prim.includes("football_jig") &&
      !prim.includes("texas_rigged_soft_plastic_craw") &&
      daily.posture_band === "suppressed"
    ) {
      delta -= 1.25;
    }
    if (
      seasonal.region_key === "mountain_west" &&
      month === 2 &&
      id === "football_jig" &&
      prim.includes("football_jig")
    ) {
      delta += 0.55;
    }
  }

  if (profile.gear_mode === "fly") {
    const fprim = seasonal.primary_fly_ids ?? [];
    const fid = profile.id as FlyArchetypeIdV3;
    if (
      (month === 4 || month === 5) &&
      fid === "game_changer" &&
      !fprim.includes("game_changer") &&
      fprim.includes("woolly_bugger")
    ) {
      delta -= 1.15;
    }

    // Cold-reservoir winter: split near-tied leech patterns — favor monthly first fly.
    if (
      seasonal.region_key === "south_central" &&
      month === 12 &&
      seasonal.context === "freshwater_lake_pond" &&
      fprim.length > 1
    ) {
      const leadFly = fprim[0];
      const idx = fprim.indexOf(fid);
      if (idx === 0) delta += 0.22;
      else if (idx > 0 && leadFly && fid !== leadFly) delta -= 0.08 * idx;
    }
  }

  return delta;
}

/** Keeps smallmouth scoring aligned with authored monthly primaries (esp. clear-lake + tailwater rows). */
function smallmouthGuardAdjustments(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
  stateCode?: string,
): number {
  if (seasonal.species !== "smallmouth_bass") return 0;

  const month = seasonal.month;
  const rk = seasonal.region_key;
  const ctx = seasonal.context;
  const prim = seasonal.primary_lure_ids ?? [];
  const fprim = seasonal.primary_fly_ids ?? [];

  let delta = 0;

  const northernLakeLike =
    ctx === "freshwater_lake_pond" &&
    (rk === "great_lakes_upper_midwest" || rk === "northeast" || rk === "midwest_interior");

  const warmHighlandLake =
    ctx === "freshwater_lake_pond" &&
    (rk === "appalachian" ||
      rk === "south_central" ||
      rk === "gulf_coast" ||
      rk === "southeast_atlantic");

  if (profile.gear_mode === "lure") {
    const id = profile.id as LureArchetypeIdV3;

    // Clear northern lakes Feb–Mar: authored tube / jerk / hair primaries should outrank drop-shot minnow as headline.
    if (
      northernLakeLike &&
      (month === 2 || month === 3) &&
      prim.includes("tube_jig") &&
      !prim.includes("drop_shot_minnow")
    ) {
      if (id === "drop_shot_minnow") {
        delta -=
          daily.posture_band === "suppressed" ||
            daily.posture_band === "slightly_suppressed"
            ? 1.75
            : 1.2;
      }
      if (id === "ned_rig" && !prim.includes("ned_rig")) delta -= 0.95;
      if (id === "tube_jig" && prim.includes("tube_jig")) delta += 0.38;
      if (id === "suspending_jerkbait" && prim.includes("suspending_jerkbait")) delta += 0.38;
      if (id === "hair_jig" && prim.includes("hair_jig")) delta += 0.38;
    }

    // Warm highland stained lakes same prespawn window: resist pure finesse minnow hijacks.
    if (
      warmHighlandLake &&
      (month === 2 || month === 3) &&
      prim.includes("tube_jig") &&
      !prim.includes("drop_shot_minnow")
    ) {
      if (id === "drop_shot_minnow") {
        delta -=
          daily.posture_band === "suppressed" ||
            daily.posture_band === "slightly_suppressed"
            ? 1.55
            : 1.05;
      }
    }

    // Great Lakes early-summer postspawn row: matrix expects subsurface baitfish / finesse primaries, not walker default.
    if (
      rk === "great_lakes_upper_midwest" &&
      ctx === "freshwater_lake_pond" &&
      month === 6 &&
      id === "walking_topwater" &&
      !prim.includes("walking_topwater")
    ) {
      delta -=
        daily.posture_band === "aggressive" ||
          daily.posture_band === "slightly_aggressive"
          ? 0.4
          : 1.7;
    }

    // South-central stained Nov lakes: blade is cold-water support, not ahead of jerkbait / swimbait primaries.
    if (
      rk === "south_central" &&
      ctx === "freshwater_lake_pond" &&
      month === 11 &&
      id === "blade_bait" &&
      !prim.includes("blade_bait") &&
      prim.includes("suspending_jerkbait")
    ) {
      delta -= 1.35;
    }
    if (
      rk === "south_central" &&
      ctx === "freshwater_lake_pond" &&
      month === 11 &&
      (id === "suspending_jerkbait" || id === "paddle_tail_swimbait" || id === "spinnerbait") &&
      prim.includes(id)
    ) {
      delta += 0.42;
    }

    // Cold-river January (tailwaters + northern): drop-shot minnow stays backup behind tube-led primaries.
    if (
      ctx === "freshwater_river" &&
      month === 1 &&
      (rk === "south_central" ||
        rk === "northeast" ||
        rk === "great_lakes_upper_midwest" ||
        rk === "midwest_interior") &&
      id === "drop_shot_minnow" &&
      !prim.includes("drop_shot_minnow") &&
      prim.includes("tube_jig")
    ) {
      delta -= 1.55;
    }
    if (
      rk === "south_central" &&
      ctx === "freshwater_river" &&
      month === 1 &&
      id === "ned_rig" &&
      prim.includes("ned_rig")
    ) {
      delta += 0.32;
    }

    // South-central stained highland January: keep winter tube / hair / jerk ahead of drop-shot minnow headlines.
    if (
      rk === "south_central" &&
      ctx === "freshwater_lake_pond" &&
      month === 1 &&
      id === "drop_shot_minnow" &&
      !prim.includes("drop_shot_minnow") &&
      prim.includes("tube_jig")
    ) {
      delta -= 1.55;
    }

    // South-central November lakes: hair is support when jerkbait / swimbait own the authored fall read.
    if (
      rk === "south_central" &&
      ctx === "freshwater_lake_pond" &&
      month === 11 &&
      id === "hair_jig" &&
      !prim.includes("hair_jig") &&
      prim.includes("suspending_jerkbait")
    ) {
      delta -= 1.05;
    }

    // Northeast tailwater spawn (Apr–May): keep tube / soft jerkbait / inline ahead of Ned and squarebill noise.
    if (
      rk === "northeast" &&
      ctx === "freshwater_river" &&
      (month === 4 || month === 5) &&
      id === "ned_rig" &&
      !prim.includes("ned_rig") &&
      prim.includes("inline_spinner")
    ) {
      delta -= 1.45;
    }
    if (
      rk === "northeast" &&
      ctx === "freshwater_river" &&
      (month === 4 || month === 5) &&
      id === "squarebill_crankbait" &&
      !prim.includes("squarebill_crankbait")
    ) {
      delta -= 1.35;
    }
    if (
      rk === "northeast" &&
      ctx === "freshwater_river" &&
      (month === 4 || month === 5) &&
      (id === "inline_spinner" || id === "soft_jerkbait" || id === "tube_jig") &&
      prim.includes(id)
    ) {
      delta += 0.42;
    }

    // South-central tailwater Oct–Nov: fall primaries are moving baitfish tools; tube / hair are backups.
    if (
      rk === "south_central" &&
      ctx === "freshwater_river" &&
      (month === 10 || month === 11) &&
      id === "tube_jig" &&
      !prim.includes("tube_jig") &&
      prim.includes("suspending_jerkbait")
    ) {
      delta -= 1.45;
    }
    if (
      rk === "south_central" &&
      ctx === "freshwater_river" &&
      month === 11 &&
      id === "hair_jig" &&
      !prim.includes("hair_jig") &&
      prim.includes("suspending_jerkbait")
    ) {
      delta -= 1.15;
    }
    if (
      rk === "south_central" &&
      ctx === "freshwater_river" &&
      (month === 10 || month === 11) &&
      (id === "suspending_jerkbait" || id === "spinnerbait" || id === "paddle_tail_swimbait") &&
      prim.includes(id)
    ) {
      delta += 0.48;
    }

    // Great Lakes stained October natural lakes: jerkbait / blade / hair should stay ahead of generic spinner flash.
    if (
      rk === "great_lakes_upper_midwest" &&
      ctx === "freshwater_lake_pond" &&
      month === 10 &&
      id === "spinnerbait" &&
      !prim.includes("spinnerbait") &&
      prim.includes("suspending_jerkbait")
    ) {
      delta -= 1.25;
    }
    if (
      rk === "great_lakes_upper_midwest" &&
      ctx === "freshwater_lake_pond" &&
      month === 10 &&
      (id === "suspending_jerkbait" || id === "blade_bait" || id === "hair_jig") &&
      prim.includes(id)
    ) {
      delta += 0.42;
    }

    // Midwest dirty prespawn reservoirs (Apr): spinnerbait should stay in front of generic hair control.
    if (
      rk === "midwest_interior" &&
      ctx === "freshwater_lake_pond" &&
      month === 4 &&
      id === "spinnerbait" &&
      prim.includes("spinnerbait")
    ) {
      delta += 0.55;
    }
    if (
      rk === "midwest_interior" &&
      ctx === "freshwater_lake_pond" &&
      month === 4 &&
      id === "hair_jig" &&
      !prim.includes("hair_jig") &&
      prim.includes("spinnerbait")
    ) {
      delta -= 0.95;
    }

    // Great Lakes December: winter primaries include suspending; resist drop-shot minnow stealing rank 1.
    if (
      rk === "great_lakes_upper_midwest" &&
      ctx === "freshwater_lake_pond" &&
      month === 12 &&
      id === "drop_shot_minnow" &&
      !prim.includes("drop_shot_minnow") &&
      prim.includes("suspending_jerkbait")
    ) {
      delta -= 1.65;
    }
    if (
      rk === "great_lakes_upper_midwest" &&
      ctx === "freshwater_lake_pond" &&
      month === 12 &&
      id === "suspending_jerkbait" &&
      prim.includes("suspending_jerkbait")
    ) {
      delta += 0.45;
    }

    // Pennsylvania June clear rivers: same northeast June row as New England, but tailwater / ledge
    // smallmouth stay seam- and current-led (tube / crank / jerk) ahead of bold walker headlines.
    if (
      stateCode === "PA" &&
      rk === "northeast" &&
      ctx === "freshwater_river" &&
      month === 6
    ) {
      // Walking is still the first authored primary for the shared northeast June row (New England),
      // so this guard has to materially outweigh monthly-primary stacking for PA tailwater reads.
      if (id === "tube_jig") delta += 2.18;
      if (id === "squarebill_crankbait") delta += 2.12;
      if (id === "suspending_jerkbait") delta += 2.06;
      if (id === "walking_topwater") delta -= 1.38;
      if (id === "inline_spinner") delta -= 0.32;
      if (id === "paddle_tail_swimbait") delta -= 0.22;
    }
  }

  if (profile.gear_mode === "fly") {
    const fid = profile.id as FlyArchetypeIdV3;
    if (
      rk === "great_lakes_upper_midwest" &&
      ctx === "freshwater_lake_pond" &&
      month === 6 &&
      fid === "mouse_fly" &&
      !fprim.includes("mouse_fly")
    ) {
      delta -=
        daily.posture_band === "aggressive" ||
          daily.posture_band === "slightly_aggressive"
          ? 0.5
          : 1.55;
    }
  }

  return delta;
}

function practicalityFit(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
  resolved: RecommenderV3ResolvedProfile,
  stateCode?: string,
  clarity?: WaterClarity,
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
    (profile.tactical_lane === "bottom_contact" || profile.tactical_lane === "finesse_subtle")
  ) {
    fit += 0.9;
  }

  if (
    daily.posture_band === "suppressed" &&
    (profile.tactical_lane === "bottom_contact" || profile.tactical_lane === "finesse_subtle" || profile.tactical_lane === "fly_bottom")
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

  fit += largemouthLakeGuardAdjustments(profile, seasonal, daily);
  fit += smallmouthGuardAdjustments(profile, seasonal, daily, stateCode);

  if (
    clarity === "stained" &&
    seasonal.species === "trout" &&
    seasonal.context === "freshwater_river" &&
    seasonal.region_key === "mountain_west" &&
    seasonal.month === 4
  ) {
    // Runoff-edge April matrix: headline sculpin / bugger / clouser, not jerkbait + slim defaults.
    if (profile.gear_mode === "fly" && profile.id === "slim_minnow_streamer") {
      fit -= 2.55;
    }
    if (
      stateCode === "ID" &&
      profile.gear_mode === "lure" &&
      profile.id === "inline_spinner"
    ) {
      // Idaho runoff-edge April: let visible streamers headline over spinner-only reads.
      fit -= 1.55;
    }
    if (
      stateCode === "ID" &&
      profile.gear_mode === "fly" &&
      (profile.id === "sculpin_streamer" ||
        profile.id === "woolly_bugger" ||
        profile.id === "clouser_minnow")
    ) {
      fit += 0.95;
    }
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
  if (lake && (m === 1 || m === 2 || m === 11 || m === 12) && profile.gear_mode === "lure") {
    if (profile.id === "blade_bait") s += 0.027;
    if (profile.id === "casting_spoon") s += 0.017;
    if (profile.id === "suspending_jerkbait") s += 0.015;
    if (profile.id === "paddle_tail_swimbait") s -= 0.012;
    if (profile.id === "large_profile_pike_swimbait") s -= 0.007;
  }

  // Late fall / winter lake flies: jig leech over strip leech when both score as cold still-water leech reads.
  if (lake && (m === 1 || m === 2 || m === 11 || m === 12) && profile.gear_mode === "fly") {
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
  stateCode?: string,
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
  const practicalFit = practicalityFit(profile, seasonal, daily, resolved, stateCode, clarity);
  if (practicalFit <= -100) return null;
  const monthlyPrimary = monthlyPrimaryFit(profile, seasonal, resolved);
  const forage = forageFit(profile, seasonal, resolved.daily_preference.opportunity_mix);
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
  const sort_score = tacticalFit + practicalFit + monthlyPrimary + forage + clarityScore +
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
    opportunity_mix_fit: roundScore(0),
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

function rankCandidates<TId extends LureArchetypeIdV3 | FlyArchetypeIdV3>(
  ids: readonly TId[],
  catalog: Record<TId, RecommenderV3ArchetypeProfile>,
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
  lightLabel: string | null,
  stateCode?: string,
): RecommenderV3RankedArchetype[] {
  const scored = ids
    .map((id) => catalog[id])
    .filter(Boolean)
    .map((profile) => scoreProfile(profile, seasonal, resolved, daily, clarity, lightLabel, stateCode))
    .filter((candidate): candidate is ScoredCandidate => candidate != null);

  return selectTopThreeCandidates(scored, resolved, daily);
}

export { peerArchetypesCoherenceConflict };

export function scoreLureCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
  lightLabel: string | null,
  stateCode?: string,
): RecommenderV3RankedArchetype[] {
  return rankCandidates(
    seasonal.eligible_lure_ids,
    LURE_ARCHETYPES_V3,
    seasonal,
    resolved,
    daily,
    clarity,
    lightLabel,
    stateCode,
  );
}

export function scoreFlyCandidatesV3(
  seasonal: RecommenderV3SeasonalRow,
  resolved: RecommenderV3ResolvedProfile,
  daily: RecommenderV3DailyPayload,
  clarity: WaterClarity,
  lightLabel: string | null,
  stateCode?: string,
): RecommenderV3RankedArchetype[] {
  return rankCandidates(
    seasonal.eligible_fly_ids,
    FLY_ARCHETYPES_V3,
    seasonal,
    resolved,
    daily,
    clarity,
    lightLabel,
    stateCode,
  );
}
