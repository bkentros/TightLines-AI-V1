/**
 * Timing family resolution — maps (context, region, month) to a TimingFamilyConfig.
 *
 * **Five timing climates** (not three): interior continental, maritime cool,
 * warm humid, hot humid, hot arid. Regions map to the archetype whose seasonal
 * timing levers best match general freshwater/coastal behavior there.
 *
 * Uses **calendar month (1–12)** as the lookup key, not a 4-bucket season.
 * **Month blend** (freshwater) cross-fades adjacent months in resolveTimingResult.
 */

import type { EngineContext, RegionKey } from "../contracts/mod.ts";
import type { ClimateZone, SeasonKey, TimingFamilyConfig } from "./timingTypes.ts";
import { TIMING_FAMILY_CONFIGS } from "./timingDriverConfig.ts";

/** Meteorological season label for traces only — not used for family lookup. */
export function seasonFromMonth(month: number): SeasonKey {
  if (month === 12 || month === 1 || month === 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "fall";
}

// ── Region → timing climate (5 archetypes) ───────────────────────────────────

const CLIMATE_ZONE_MAP: Record<RegionKey, ClimateZone> = {
  /** Strong winter / real summer — same family stack as legacy "cold continental" */
  northeast: "interior_continental",
  great_lakes_upper_midwest: "interior_continental",
  midwest_interior: "interior_continental",
  mountain_west: "interior_continental",
  /** High-elevation cold winter + warm summer — not low-desert */
  southwest_high_desert: "interior_continental",

  /** Mild wet winters, moderate summers — low-light/cloud weighted vs interior heat */
  pacific_northwest: "maritime_cool",

  /** Humid warm belt without Gulf/FL subtropical extremes */
  southeast_atlantic: "warm_humid",
  south_central: "warm_humid",

  /** Subtropical wet heat */
  florida: "hot_humid",
  gulf_coast: "hot_humid",

  /** Dry bright heat — spring leans warm-belt wind/cloud row vs humid subtropical */
  southwest_desert: "hot_arid",
  southern_california: "hot_arid",

  /** Alpine: continental timing (cold winter / real summer) — same stack as mountain_west */
  mountain_alpine: "interior_continental",
  /** NorCal: Mediterranean-ish with wet winters; maritime coast + hot inland valley blend */
  northern_california: "warm_humid",

  appalachian: "warm_humid",
  inland_northwest: "interior_continental",

  alaska: "interior_continental",
  /** Year-round mild/warm — share subtropical stack with Florida for month timing */
  hawaii: "hot_humid",
};

export function climateZoneFromRegion(region: RegionKey): ClimateZone {
  return CLIMATE_ZONE_MAP[region] ?? "warm_humid";
}

// ── 12-month family IDs (index 0 = January … 11 = December) ─────────────────

type MonthFamilyRow = readonly [
  string, string, string, string, string, string,
  string, string, string, string, string, string,
];

/** Interior continental — legacy cold row */
const LAKE_INTERIOR: MonthFamilyRow = [
  "lake_cold_winter",
  "lake_cold_winter",
  "lake_cold_winter",
  "lake_cold_winter",
  "lake_cold_spring",
  "lake_cold_spring",
  "lake_cold_summer",
  "lake_cold_summer",
  "lake_cold_fall",
  "lake_cold_fall",
  "lake_cold_fall",
  "lake_cold_winter",
];

/**
 * Maritime cool — mild gray winters (warm-belt winter stack); peak summer uses
 * interior "cool summer" row (low-light + cloud) instead of harsh avoid-heat.
 */
const LAKE_MARITIME: MonthFamilyRow = [
  "lake_warm_winter",
  "lake_warm_winter",
  "lake_warm_winter",
  "lake_warm_spring",
  "lake_warm_spring",
  "lake_cold_summer",
  "lake_cold_summer",
  "lake_cold_summer",
  "lake_warm_fall",
  "lake_warm_fall",
  "lake_warm_fall",
  "lake_warm_winter",
];

/** Warm humid — legacy warm temperate row */
const LAKE_WARM_HUMID: MonthFamilyRow = [
  "lake_warm_winter",
  "lake_warm_winter",
  "lake_warm_winter",
  "lake_warm_winter",
  "lake_warm_spring",
  "lake_warm_spring",
  "lake_warm_summer",
  "lake_warm_summer",
  "lake_warm_summer",
  "lake_warm_fall",
  "lake_warm_fall",
  "lake_warm_winter",
];

/** Hot humid — legacy hot subtropical row */
const LAKE_HOT_HUMID: MonthFamilyRow = [
  "lake_hot_winter",
  "lake_hot_winter",
  "lake_hot_winter",
  "lake_hot_spring",
  "lake_hot_spring",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_fall",
  "lake_hot_fall",
  "lake_hot_fall",
  "lake_hot_winter",
];

/**
 * Hot arid — dry bright summers; Apr–Jun use warm-belt spring (cloud/low-light)
 * instead of humid-subtropical spring (low-light + avoid-heat) for wind/dust/front swings.
 */
const LAKE_HOT_ARID: MonthFamilyRow = [
  "lake_hot_winter",
  "lake_hot_winter",
  "lake_hot_winter",
  "lake_warm_spring",
  "lake_warm_spring",
  "lake_warm_spring",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_fall",
  "lake_hot_fall",
  "lake_hot_winter",
];

const LAKE_BY_ZONE: Record<ClimateZone, MonthFamilyRow> = {
  interior_continental: LAKE_INTERIOR,
  maritime_cool: LAKE_MARITIME,
  warm_humid: LAKE_WARM_HUMID,
  hot_humid: LAKE_HOT_HUMID,
  hot_arid: LAKE_HOT_ARID,
};

const RIVER_INTERIOR: MonthFamilyRow = [
  "river_cold_winter",
  "river_cold_winter",
  "river_cold_winter",
  "river_cold_winter",
  "river_cold_spring",
  "river_cold_spring",
  "river_cold_summer",
  "river_cold_summer",
  "river_cold_fall",
  "river_cold_fall",
  "river_cold_fall",
  "river_cold_winter",
];

const RIVER_MARITIME: MonthFamilyRow = [
  "river_warm_winter",
  "river_warm_winter",
  "river_warm_winter",
  "river_warm_spring",
  "river_warm_spring",
  "river_cold_summer",
  "river_cold_summer",
  "river_cold_summer",
  "river_warm_fall",
  "river_warm_fall",
  "river_warm_fall",
  "river_warm_winter",
];

const RIVER_WARM_HUMID: MonthFamilyRow = [
  "river_warm_winter",
  "river_warm_winter",
  "river_warm_winter",
  "river_warm_winter",
  "river_warm_spring",
  "river_warm_spring",
  "river_warm_summer",
  "river_warm_summer",
  "river_warm_summer",
  "river_warm_fall",
  "river_warm_fall",
  "river_warm_winter",
];

const RIVER_HOT_HUMID: MonthFamilyRow = [
  "river_hot_winter",
  "river_hot_winter",
  "river_hot_winter",
  "river_hot_spring",
  "river_hot_spring",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_fall",
  "river_hot_fall",
  "river_hot_fall",
  "river_hot_winter",
];

const RIVER_HOT_ARID: MonthFamilyRow = [
  "river_hot_winter",
  "river_hot_winter",
  "river_hot_winter",
  "river_warm_spring",
  "river_warm_spring",
  "river_warm_spring",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_fall",
  "river_hot_fall",
  "river_hot_winter",
];

const RIVER_BY_ZONE: Record<ClimateZone, MonthFamilyRow> = {
  interior_continental: RIVER_INTERIOR,
  maritime_cool: RIVER_MARITIME,
  warm_humid: RIVER_WARM_HUMID,
  hot_humid: RIVER_HOT_HUMID,
  hot_arid: RIVER_HOT_ARID,
};

// ── Public lookup ────────────────────────────────────────────────────────────

function monthIndexClamped(month: number): number {
  if (!Number.isFinite(month) || month < 1 || month > 12) return 0;
  return month - 1;
}

export function resolveTimingFamily(
  context: EngineContext,
  region: RegionKey,
  month: number,
): TimingFamilyConfig {
  if (context === "coastal") {
    return TIMING_FAMILY_CONFIGS.coastal_all;
  }

  const zone = climateZoneFromRegion(region);
  const mi = monthIndexClamped(month);
  const table = context === "freshwater_river" ? RIVER_BY_ZONE : LAKE_BY_ZONE;
  const row = table[zone];
  const familyId = row[mi]!;

  const cfg = TIMING_FAMILY_CONFIGS[familyId];
  if (!cfg) {
    return TIMING_FAMILY_CONFIGS.lake_cold_fall;
  }
  return cfg;
}
