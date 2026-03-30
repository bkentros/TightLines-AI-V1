/**
 * Timing profile resolution — maps (context, region, month) to a single-anchor
 * timing profile and one fallback feeding-bias window.
 */

import type { EngineContext, RegionKey } from "../contracts/mod.ts";
import type { ClimateZone, SeasonKey, TimingFamilyConfig } from "./timingTypes.ts";
import { TIMING_FAMILY_CONFIGS } from "./timingDriverConfig.ts";

/** Meteorological season label for traces only. */
export function seasonFromMonth(month: number): SeasonKey {
  if (month === 12 || month === 1 || month === 2) return "winter";
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  return "fall";
}

const CLIMATE_ZONE_MAP: Record<RegionKey, ClimateZone> = {
  northeast: "interior_continental",
  great_lakes_upper_midwest: "interior_continental",
  midwest_interior: "interior_continental",
  mountain_west: "interior_continental",
  southwest_high_desert: "interior_continental",
  pacific_northwest: "maritime_cool",
  southeast_atlantic: "warm_humid",
  south_central: "warm_humid",
  florida: "hot_humid",
  gulf_coast: "hot_humid",
  southwest_desert: "hot_arid",
  southern_california: "hot_arid",
  mountain_alpine: "interior_continental",
  northern_california: "warm_humid",
  appalachian: "warm_humid",
  inland_northwest: "interior_continental",
  alaska: "interior_continental",
  hawaii: "hot_humid",
};

export function climateZoneFromRegion(region: RegionKey): ClimateZone {
  return CLIMATE_ZONE_MAP[region] ?? "warm_humid";
}

type MonthProfileRow = readonly [
  string, string, string, string, string, string,
  string, string, string, string, string, string,
];

const LAKE_INTERIOR: MonthProfileRow = [
  "lake_cold_winter",
  "lake_cold_winter",
  "lake_cold_spring",
  "lake_cold_spring",
  "lake_cold_spring",
  "lake_cold_summer",
  "lake_cold_summer",
  "lake_cold_summer",
  "lake_cold_fall",
  "lake_cold_fall",
  "lake_cold_fall",
  "lake_cold_winter",
];

const LAKE_MARITIME: MonthProfileRow = [
  "lake_warm_winter",
  "lake_warm_winter",
  "lake_warm_spring",
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

const LAKE_WARM_HUMID: MonthProfileRow = [
  "lake_warm_winter",
  "lake_warm_winter",
  "lake_warm_winter",
  "lake_warm_spring",
  "lake_warm_spring",
  "lake_warm_summer",
  "lake_warm_summer",
  "lake_warm_summer",
  "lake_warm_summer",
  "lake_warm_fall",
  "lake_warm_fall",
  "lake_warm_winter",
];

const LAKE_HOT_HUMID: MonthProfileRow = [
  "lake_hot_winter",
  "lake_hot_winter",
  "lake_hot_spring",
  "lake_hot_spring",
  "lake_hot_spring",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_fall",
  "lake_hot_fall",
  "lake_hot_winter",
];

const LAKE_HOT_ARID: MonthProfileRow = [
  "lake_hot_winter",
  "lake_hot_winter",
  "lake_hot_spring",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_summer",
  "lake_hot_fall",
  "lake_hot_fall",
  "lake_hot_winter",
];

const LAKE_BY_ZONE: Record<ClimateZone, MonthProfileRow> = {
  interior_continental: LAKE_INTERIOR,
  maritime_cool: LAKE_MARITIME,
  warm_humid: LAKE_WARM_HUMID,
  hot_humid: LAKE_HOT_HUMID,
  hot_arid: LAKE_HOT_ARID,
};

const RIVER_INTERIOR: MonthProfileRow = [
  "river_cold_winter",
  "river_cold_winter",
  "river_cold_spring",
  "river_cold_spring",
  "river_cold_spring",
  "river_cold_summer",
  "river_cold_summer",
  "river_cold_summer",
  "river_cold_fall",
  "river_cold_fall",
  "river_cold_fall",
  "river_cold_winter",
];

const RIVER_MARITIME: MonthProfileRow = [
  "river_warm_winter",
  "river_warm_winter",
  "river_warm_spring",
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

const RIVER_WARM_HUMID: MonthProfileRow = [
  "river_warm_winter",
  "river_warm_winter",
  "river_warm_winter",
  "river_warm_spring",
  "river_warm_spring",
  "river_warm_summer",
  "river_warm_summer",
  "river_warm_summer",
  "river_warm_summer",
  "river_warm_fall",
  "river_warm_fall",
  "river_warm_winter",
];

const RIVER_HOT_HUMID: MonthProfileRow = [
  "river_hot_winter",
  "river_hot_winter",
  "river_hot_spring",
  "river_hot_spring",
  "river_hot_spring",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_fall",
  "river_hot_fall",
  "river_hot_winter",
];

const RIVER_HOT_ARID: MonthProfileRow = [
  "river_hot_winter",
  "river_hot_winter",
  "river_hot_spring",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_summer",
  "river_hot_fall",
  "river_hot_fall",
  "river_hot_winter",
];

const RIVER_BY_ZONE: Record<ClimateZone, MonthProfileRow> = {
  interior_continental: RIVER_INTERIOR,
  maritime_cool: RIVER_MARITIME,
  warm_humid: RIVER_WARM_HUMID,
  hot_humid: RIVER_HOT_HUMID,
  hot_arid: RIVER_HOT_ARID,
};

const COAST_INTERIOR: MonthProfileRow = [
  "coastal_cold_winter_tide",
  "coastal_cold_winter_tide",
  "coastal_cold_shoulder_tide",
  "coastal_cold_shoulder_tide",
  "coastal_cold_shoulder_tide",
  "coastal_cold_summer_tide",
  "coastal_cold_summer_tide",
  "coastal_cold_summer_tide",
  "coastal_cold_fall_tide",
  "coastal_cold_fall_tide",
  "coastal_cold_fall_tide",
  "coastal_cold_winter_tide",
];

const COAST_MARITIME: MonthProfileRow = [
  "coastal_cold_winter_tide",
  "coastal_cold_winter_tide",
  "coastal_cold_shoulder_tide",
  "coastal_cold_shoulder_tide",
  "coastal_cold_shoulder_tide",
  "coastal_cold_summer_tide",
  "coastal_cold_summer_tide",
  "coastal_cold_summer_tide",
  "coastal_cold_fall_tide",
  "coastal_cold_fall_tide",
  "coastal_cold_fall_tide",
  "coastal_cold_winter_tide",
];

const COAST_WARM_HUMID: MonthProfileRow = [
  "coastal_warm_winter_tide",
  "coastal_warm_winter_tide",
  "coastal_warm_shoulder_tide",
  "coastal_warm_shoulder_tide",
  "coastal_warm_shoulder_tide",
  "coastal_warm_summer_tide",
  "coastal_warm_summer_tide",
  "coastal_warm_summer_tide",
  "coastal_warm_summer_tide",
  "coastal_warm_shoulder_tide",
  "coastal_warm_shoulder_tide",
  "coastal_warm_winter_tide",
];

const COAST_HOT_HUMID: MonthProfileRow = [
  "coastal_hot_winter_tide",
  "coastal_hot_winter_tide",
  "coastal_hot_shoulder_tide",
  "coastal_hot_shoulder_tide",
  "coastal_hot_shoulder_tide",
  "coastal_hot_summer_tide",
  "coastal_hot_summer_tide",
  "coastal_hot_summer_tide",
  "coastal_hot_summer_tide",
  "coastal_hot_shoulder_tide",
  "coastal_hot_shoulder_tide",
  "coastal_hot_winter_tide",
];

const COAST_HOT_ARID: MonthProfileRow = [
  "coastal_warm_winter_tide",
  "coastal_warm_winter_tide",
  "coastal_warm_shoulder_tide",
  "coastal_warm_shoulder_tide",
  "coastal_warm_shoulder_tide",
  "coastal_warm_summer_tide",
  "coastal_warm_summer_tide",
  "coastal_warm_summer_tide",
  "coastal_warm_summer_tide",
  "coastal_warm_shoulder_tide",
  "coastal_warm_shoulder_tide",
  "coastal_warm_winter_tide",
];

const COAST_BY_ZONE: Record<ClimateZone, MonthProfileRow> = {
  interior_continental: COAST_INTERIOR,
  maritime_cool: COAST_MARITIME,
  warm_humid: COAST_WARM_HUMID,
  hot_humid: COAST_HOT_HUMID,
  hot_arid: COAST_HOT_ARID,
};

const FLATS_INTERIOR: MonthProfileRow = [
  "flats_cold_winter_warmth",
  "flats_cold_winter_warmth",
  "flats_cold_spring_tide",
  "flats_cold_spring_tide",
  "flats_cold_spring_tide",
  "flats_cold_summer_light",
  "flats_cold_summer_light",
  "flats_cold_summer_light",
  "flats_cold_fall_tide",
  "flats_cold_fall_tide",
  "flats_cold_fall_tide",
  "flats_cold_winter_warmth",
];

const FLATS_MARITIME: MonthProfileRow = [
  "flats_cold_winter_warmth",
  "flats_cold_winter_warmth",
  "flats_cold_spring_tide",
  "flats_cold_spring_tide",
  "flats_cold_spring_tide",
  "flats_cold_summer_light",
  "flats_cold_summer_light",
  "flats_cold_summer_light",
  "flats_cold_fall_tide",
  "flats_cold_fall_tide",
  "flats_cold_fall_tide",
  "flats_cold_winter_warmth",
];

const FLATS_WARM_HUMID: MonthProfileRow = [
  "flats_warm_winter_warmth",
  "flats_warm_winter_warmth",
  "flats_warm_spring_tide",
  "flats_warm_spring_tide",
  "flats_warm_spring_tide",
  "flats_warm_summer_heat",
  "flats_warm_summer_heat",
  "flats_warm_summer_heat",
  "flats_warm_summer_heat",
  "flats_warm_fall_tide",
  "flats_warm_fall_tide",
  "flats_warm_winter_warmth",
];

const FLATS_HOT_HUMID: MonthProfileRow = [
  "flats_hot_winter_warmth",
  "flats_hot_winter_warmth",
  "flats_hot_spring_tide",
  "flats_hot_spring_tide",
  "flats_hot_spring_tide",
  "flats_hot_summer_heat",
  "flats_hot_summer_heat",
  "flats_hot_summer_heat",
  "flats_hot_summer_heat",
  "flats_hot_fall_tide",
  "flats_hot_fall_tide",
  "flats_hot_winter_warmth",
];

const FLATS_HOT_ARID: MonthProfileRow = [
  "flats_warm_winter_warmth",
  "flats_warm_winter_warmth",
  "flats_warm_spring_tide",
  "flats_warm_spring_tide",
  "flats_warm_spring_tide",
  "flats_warm_summer_heat",
  "flats_warm_summer_heat",
  "flats_warm_summer_heat",
  "flats_warm_summer_heat",
  "flats_warm_fall_tide",
  "flats_warm_fall_tide",
  "flats_warm_winter_warmth",
];

const FLATS_BY_ZONE: Record<ClimateZone, MonthProfileRow> = {
  interior_continental: FLATS_INTERIOR,
  maritime_cool: FLATS_MARITIME,
  warm_humid: FLATS_WARM_HUMID,
  hot_humid: FLATS_HOT_HUMID,
  hot_arid: FLATS_HOT_ARID,
};

function monthIndexClamped(month: number): number {
  if (!Number.isFinite(month) || month < 1 || month > 12) return 0;
  return month - 1;
}

export function resolveTimingFamily(
  context: EngineContext,
  region: RegionKey,
  month: number,
): TimingFamilyConfig {
  const zone = climateZoneFromRegion(region);
  const mi = monthIndexClamped(month);

  let table: Record<ClimateZone, MonthProfileRow>;
  if (context === "freshwater_lake_pond") {
    table = LAKE_BY_ZONE;
  } else if (context === "freshwater_river") {
    table = RIVER_BY_ZONE;
  } else if (context === "coastal") {
    table = COAST_BY_ZONE;
  } else {
    table = FLATS_BY_ZONE;
  }

  const profileId = table[zone][mi]!;
  return TIMING_FAMILY_CONFIGS[profileId] ?? TIMING_FAMILY_CONFIGS.lake_cold_fall;
}
