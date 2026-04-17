import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3DailyPayload,
  RecommenderV3SeasonalRow,
} from "../../contracts.ts";

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
export function largemouthLakeGuardAdjustments(
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

    const monthlyNamesOpenSurface = prim.some((p) =>
      OPEN_SURFACE_LURE_IDS.has(p)
    );
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
      delta -= daily.posture_band === "suppressed" ||
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
      if (
        id === "paddle_tail_swimbait" && !prim.includes("paddle_tail_swimbait")
      ) {
        delta -= 1.2;
      }
      if (
        id === "texas_rigged_soft_plastic_craw" &&
        !prim.includes("texas_rigged_soft_plastic_craw")
      ) {
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
      if (
        id === "suspending_jerkbait" && !prim.includes("suspending_jerkbait")
      ) {
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
      (id === "football_jig" || id === "spinnerbait" ||
        id === "suspending_jerkbait" ||
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
