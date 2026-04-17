import type {
  FlyArchetypeIdV3,
  LureArchetypeIdV3,
  RecommenderV3ArchetypeProfile,
  RecommenderV3DailyPayload,
  RecommenderV3SeasonalRow,
} from "../../contracts.ts";

/** Keeps smallmouth scoring aligned with authored monthly primaries (esp. clear-lake + tailwater rows). */
export function smallmouthGuardAdjustments(
  profile: RecommenderV3ArchetypeProfile,
  seasonal: RecommenderV3SeasonalRow,
  daily: RecommenderV3DailyPayload,
): number {
  if (seasonal.species !== "smallmouth_bass") return 0;

  const month = seasonal.month;
  const rk = seasonal.region_key;
  const ctx = seasonal.context;
  const prim = seasonal.primary_lure_ids ?? [];
  const fprim = seasonal.primary_fly_ids ?? [];

  let delta = 0;

  const northernLakeLike = ctx === "freshwater_lake_pond" &&
    (rk === "great_lakes_upper_midwest" || rk === "northeast" ||
      rk === "midwest_interior");

  const warmHighlandLake = ctx === "freshwater_lake_pond" &&
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
        delta -= daily.posture_band === "suppressed" ||
            daily.posture_band === "slightly_suppressed"
          ? 1.75
          : 1.2;
      }
      if (id === "ned_rig" && !prim.includes("ned_rig")) delta -= 0.95;
      if (id === "tube_jig" && prim.includes("tube_jig")) delta += 0.38;
      if (
        id === "suspending_jerkbait" && prim.includes("suspending_jerkbait")
      ) delta += 0.38;
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
        delta -= daily.posture_band === "suppressed" ||
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
      delta -= daily.posture_band === "aggressive" ||
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
      (id === "suspending_jerkbait" || id === "paddle_tail_swimbait" ||
        id === "spinnerbait") &&
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
      (id === "inline_spinner" || id === "soft_jerkbait" ||
        id === "tube_jig") &&
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
      (id === "suspending_jerkbait" || id === "spinnerbait" ||
        id === "paddle_tail_swimbait") &&
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
      (id === "suspending_jerkbait" || id === "blade_bait" ||
        id === "hair_jig") &&
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
      delta -= daily.posture_band === "aggressive" ||
          daily.posture_band === "slightly_aggressive"
        ? 0.5
        : 1.55;
    }
  }

  return delta;
}
