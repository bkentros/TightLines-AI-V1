import {
  PIER_CAST_REGIONAL_SEASONAL_PROFILE_SCHEMA_VERSION,
  type PierCastGreatLakeIdV4,
  type PierCastRegionalSeasonalProfileV4,
  type PierCastSeasonStageV4,
  type PierCastThermalProfileV4,
} from "../../../../../lib/pierCastConditionsV4.ts";
import type { PierCastCityId, PierCastSpeciesId } from "../types.ts";
import {
  PIER_CAST_V3_CALIBRATION_SHA256,
  PIER_CAST_V3_CITY_IDS,
  PIER_CAST_V3_CONFIG_VERSION,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  type PierCastV3PairCalibration,
} from "./v3Calibration.ts";
import { buildPierCastCatalog } from "./catalog.ts";
export {
  PIER_CAST_V4_THERMAL_CALIBRATION_VERSION,
  PIER_CAST_V4_THERMAL_PROFILES,
} from "./conditionsV4Thermal.ts";
import { PIER_CAST_V4_THERMAL_PROFILES } from "./conditionsV4Thermal.ts";

export const PIER_CAST_V4_REGIONAL_PROFILE_VERSION =
  "piercast-regional-seasonal-derived-v1" as const;
export const PIER_CAST_V4_REFERENCE_YEAR = 2027 as const;
export const PIER_CAST_V4_MAX_LATITUDE_SHIFT_DAYS = 14 as const;
export const PIER_CAST_V4_MAX_TIMING_DAYS_PER_DEGREE = 4 as const;

export type PierCastCityRegionV4 = {
  cityId: PierCastCityId;
  lakeId: PierCastGreatLakeIdV4;
  basinId:
    | "lake_michigan_west_north"
    | "lake_michigan_west_south"
    | "lake_michigan_east_north"
    | "lake_michigan_east_south"
    | "lake_huron_west"
    | "saginaw_bay";
};

const LAKE_MICHIGAN_WEST_NORTH = new Set<PierCastCityId>([
  "sheboygan_wi",
  "two_rivers_wi",
  "kewaunee_wi",
  "algoma_wi",
  "manitowoc_wi",
]);

const LAKE_MICHIGAN_WEST_SOUTH = new Set<PierCastCityId>([
  "port_washington_wi",
  "milwaukee_wi",
  "racine_wi",
  "kenosha_wi",
  "waukegan_il",
  "chicago_il",
]);

const LAKE_MICHIGAN_EAST_NORTH = new Set<PierCastCityId>([
  "charlevoix_mi",
  "frankfort_elberta_mi",
  "manistee_mi",
  "ludington_mi",
  "pentwater_mi",
]);

const LAKE_HURON_WEST = new Set<PierCastCityId>([
  "harbor_beach_mi",
  "oscoda_mi",
  "port_sanilac_mi",
  "alpena_mi",
  "lexington_mi",
  "harrisville_mi",
  "rogers_city_mi",
  "tawas_city_mi",
]);

export const PIER_CAST_V4_CITY_REGIONS: readonly PierCastCityRegionV4[] =
  PIER_CAST_V3_CITY_IDS.map((cityId) => {
    if (LAKE_MICHIGAN_WEST_NORTH.has(cityId)) {
      return {
        cityId,
        lakeId: "michigan",
        basinId: "lake_michigan_west_north",
      };
    }
    if (LAKE_MICHIGAN_WEST_SOUTH.has(cityId)) {
      return {
        cityId,
        lakeId: "michigan",
        basinId: "lake_michigan_west_south",
      };
    }
    if (LAKE_MICHIGAN_EAST_NORTH.has(cityId)) {
      return {
        cityId,
        lakeId: "michigan",
        basinId: "lake_michigan_east_north",
      };
    }
    if (LAKE_HURON_WEST.has(cityId)) {
      return { cityId, lakeId: "huron", basinId: "lake_huron_west" };
    }
    if (cityId === "caseville_mi") {
      return { cityId, lakeId: "huron", basinId: "saginaw_bay" };
    }
    return {
      cityId,
      lakeId: "michigan",
      basinId: "lake_michigan_east_south",
    };
  });

const REVIEW_CITIES = buildPierCastCatalog("review", "v3").cities;

export const PIER_CAST_V4_CITY_DEFINITIONS = PIER_CAST_V4_CITY_REGIONS.map(
  (region) => {
    const city = REVIEW_CITIES.find((candidate) =>
      candidate.cityId === region.cityId
    );
    const location = city?.waterTemperatureSource?.configuredLocation;
    if (!city || !location) {
      throw new Error(`PierCast v4 city definition missing: ${region.cityId}.`);
    }
    return {
      ...region,
      displayName: city.displayName,
      stateCode: city.stateCode,
      timezone: city.timezone,
      latitude: location.latitude,
      longitude: location.longitude,
    };
  },
);

type CityDefinitionV4 = (typeof PIER_CAST_V4_CITY_DEFINITIONS)[number];

export function getPierCastV4CityDefinition(
  cityId: string,
): CityDefinitionV4 | null {
  return PIER_CAST_V4_CITY_DEFINITIONS.find((city) => city.cityId === cityId) ??
    null;
}

export function getPierCastV4ThermalProfile(
  speciesId: PierCastSpeciesId,
): PierCastThermalProfileV4 | null {
  return PIER_CAST_V4_THERMAL_PROFILES.find((profile) =>
    profile.speciesId === speciesId
  ) ?? null;
}

export const PIER_CAST_V4_REGIONAL_SEASONAL_PROFILES:
  readonly PierCastRegionalSeasonalProfileV4[] = buildRegionalProfiles();

export function getPierCastV4RegionalSeasonalProfile(input: {
  speciesId: PierCastSpeciesId;
  lakeId: PierCastGreatLakeIdV4;
  basinId: string;
}): PierCastRegionalSeasonalProfileV4 | null {
  return PIER_CAST_V4_REGIONAL_SEASONAL_PROFILES.find((profile) =>
    profile.speciesId === input.speciesId &&
    profile.lakeId === input.lakeId && profile.basinId === input.basinId
  ) ?? null;
}

export function validatePierCastV4RegionalProfile(
  profile: PierCastRegionalSeasonalProfileV4,
): string[] {
  const issues: string[] = [];
  if (!profile.profileId.trim()) issues.push("seasonal_profile_id_missing");
  if (
    !profile.derivation.methodVersion.trim() ||
    !profile.derivation.sourceConfigVersion.trim() ||
    !/^[a-f0-9]{64}$/.test(profile.derivation.sourceCalibrationSha256) ||
    profile.derivation.excludedInputs.length !== 1 ||
    profile.derivation.excludedInputs[0] !== "fisheryStrength"
  ) {
    issues.push("seasonal_profile_derivation_invalid");
  }
  if (!Number.isFinite(profile.referenceLatitude)) {
    issues.push("seasonal_profile_reference_latitude_invalid");
  }
  if (
    !Number.isFinite(profile.latitudeAdjustment.timingShiftDaysPerDegree) ||
    !Number.isFinite(profile.latitudeAdjustment.maximumAbsoluteShiftDays) ||
    profile.latitudeAdjustment.maximumAbsoluteShiftDays < 0
  ) {
    issues.push("seasonal_profile_latitude_adjustment_invalid");
  }
  if (profile.knots.length < 3) issues.push("seasonal_profile_too_short");
  let previous = -1;
  for (const knot of profile.knots) {
    const day = monthDayToIndex(knot.monthDay);
    if (
      day === null || day <= previous || !Number.isFinite(knot.value) ||
      knot.value < 0 || knot.value > 1
    ) {
      issues.push("seasonal_profile_knot_invalid");
    }
    previous = day ?? previous;
  }
  return [...new Set(issues)];
}

function buildRegionalProfiles(): PierCastRegionalSeasonalProfileV4[] {
  const groupKeys = new Set(
    PIER_CAST_V3_PAIR_CALIBRATIONS.map((pair) => {
      const city = getPierCastV4CityDefinition(pair.cityId)!;
      return `${pair.speciesId}|${city.lakeId}|${city.basinId}`;
    }),
  );
  return [...groupKeys].sort().map((key) => {
    const [speciesId, lakeId, basinId] = key.split("|") as [
      PierCastSpeciesId,
      PierCastGreatLakeIdV4,
      CityDefinitionV4["basinId"],
    ];
    const pairs = PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) => {
      const city = getPierCastV4CityDefinition(pair.cityId)!;
      return pair.speciesId === speciesId && city.lakeId === lakeId &&
        city.basinId === basinId;
    });
    const cities = pairs.map((pair) =>
      getPierCastV4CityDefinition(pair.cityId)!
    );
    const referenceLatitude = median(cities.map((city) => city.latitude));
    const dailyCurves = pairs.map((pair) => pairDailyCurve(pair));
    const baseline = Array.from(
      { length: 365 },
      (_, day) => median(dailyCurves.map((curve) => curve[day]!)),
    );
    const timingShiftDaysPerDegree = deriveLatitudeTimingSlope({
      baseline,
      dailyCurves,
      cities,
      referenceLatitude,
    });
    const anchorDays = Array.from(
      { length: 53 },
      (_, index) => Math.min(index * 7, 364),
    );
    const knots = anchorDays.map((day) => {
      const value = round(baseline[day]!, 4);
      return {
        monthDay: dayIndexToMonthDay(day),
        value,
        stage: stageFor(baseline, day),
      };
    });
    const evidenceIds = [
      ...new Set(
        pairs.flatMap((pair) =>
          pair.modes.flatMap((mode) => mode.fisheryEvidenceIds)
        ),
      ),
    ].sort();
    return {
      schemaVersion: PIER_CAST_REGIONAL_SEASONAL_PROFILE_SCHEMA_VERSION,
      profileId:
        `${lakeId}__${basinId}__${speciesId}__${PIER_CAST_V4_REGIONAL_PROFILE_VERSION}__${
          PIER_CAST_V3_CALIBRATION_SHA256.slice(0, 12)
        }`,
      speciesId,
      lakeId,
      basinId,
      referenceLatitude: round(referenceLatitude, 4),
      latitudeAdjustment: {
        timingShiftDaysPerDegree,
        maximumAbsoluteShiftDays: PIER_CAST_V4_MAX_LATITUDE_SHIFT_DAYS,
      },
      knots,
      evidenceIds,
      derivation: {
        methodVersion: PIER_CAST_V4_REGIONAL_PROFILE_VERSION,
        sourceConfigVersion: PIER_CAST_V3_CONFIG_VERSION,
        sourceCalibrationSha256: PIER_CAST_V3_CALIBRATION_SHA256,
        excludedInputs: ["fisheryStrength"],
      },
      calibrationStatus: "provisional",
    } satisfies PierCastRegionalSeasonalProfileV4;
  });
}

function pairDailyCurve(pair: PierCastV3PairCalibration): number[] {
  const modes = pair.modes.map((mode) =>
    mode.availabilityKnots.map((knot) => {
      const day = monthDayToIndex(knot.monthDay);
      if (day === null || !Number.isFinite(knot.availability)) {
        throw new Error(`PierCast v4 source curve invalid: ${pair.pairKey}.`);
      }
      return { day, value: knot.availability };
    }).sort((left, right) => left.day - right.day)
  );
  return Array.from({ length: 365 }, (_, day) => {
    return Math.max(
      ...modes.map((knots) => interpolateRecurringDay(day, knots)),
    );
  });
}

function interpolateRecurringDay(
  day: number,
  knots: readonly { day: number; value: number }[],
): number {
  const exact = knots.find((knot) => knot.day === day);
  if (exact) return exact.value;
  const previous = [...knots].reverse().find((knot) => knot.day < day) ?? {
    ...knots.at(-1)!,
    day: knots.at(-1)!.day - 365,
  };
  const next = knots.find((knot) => knot.day > day) ?? {
    ...knots[0]!,
    day: knots[0]!.day + 365,
  };
  const progress = (day - previous.day) / (next.day - previous.day);
  return previous.value + (next.value - previous.value) * progress;
}

function deriveLatitudeTimingSlope(input: {
  baseline: readonly number[];
  dailyCurves: readonly (readonly number[])[];
  cities: readonly CityDefinitionV4[];
  referenceLatitude: number;
}): number {
  if (input.cities.length < 2) return 0;
  const variance = input.cities.reduce(
    (sum, city) => sum + (city.latitude - input.referenceLatitude) ** 2,
    0,
  );
  if (variance < 0.05) return 0;
  const fittedShifts = input.dailyCurves.map((curve) => {
    let bestShift = 0;
    let bestError = Number.POSITIVE_INFINITY;
    for (
      let shift = -PIER_CAST_V4_MAX_LATITUDE_SHIFT_DAYS;
      shift <= PIER_CAST_V4_MAX_LATITUDE_SHIFT_DAYS;
      shift += 1
    ) {
      let error = 0;
      for (let day = 0; day < 365; day += 1) {
        const expected = input.baseline[wrapDay(day - shift)]!;
        error += (curve[day]! - expected) ** 2;
      }
      if (error < bestError) {
        bestError = error;
        bestShift = shift;
      }
    }
    return bestShift;
  });
  const covariance = input.cities.reduce(
    (sum, city, index) =>
      sum + (city.latitude - input.referenceLatitude) * fittedShifts[index]!,
    0,
  );
  return round(
    clamp(
      covariance / variance,
      -PIER_CAST_V4_MAX_TIMING_DAYS_PER_DEGREE,
      PIER_CAST_V4_MAX_TIMING_DAYS_PER_DEGREE,
    ),
    3,
  );
}

function stageFor(
  values: readonly number[],
  day: number,
): PierCastSeasonStageV4 {
  const value = values[day]!;
  if (value < 0.05) return "off";
  const trend = values[wrapDay(day + 7)]! - values[wrapDay(day - 7)]!;
  if (trend > 0.08) return value < 0.25 ? "early" : "building";
  if (trend < -0.08) return value < 0.25 ? "late" : "fading";
  return value >= 0.25 ? "active" : trend >= 0 ? "early" : "late";
}

function median(values: readonly number[]): number {
  if (values.length === 0) return 0;
  const ordered = [...values].sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 === 1
    ? ordered[middle]!
    : (ordered[middle - 1]! + ordered[middle]!) / 2;
}

function dayIndexToMonthDay(day: number): string {
  return new Date(Date.UTC(PIER_CAST_V4_REFERENCE_YEAR, 0, day + 1))
    .toISOString().slice(5, 10);
}

function monthDayToIndex(monthDay: string): number | null {
  if (!/^\d{2}-\d{2}$/.test(monthDay)) return null;
  const date = new Date(`${PIER_CAST_V4_REFERENCE_YEAR}-${monthDay}T00:00:00Z`);
  if (
    Number.isNaN(date.getTime()) || date.toISOString().slice(5, 10) !== monthDay
  ) {
    return null;
  }
  return Math.floor(
    (date.getTime() - Date.UTC(PIER_CAST_V4_REFERENCE_YEAR, 0, 1)) /
      86_400_000,
  );
}

function wrapDay(day: number): number {
  return ((day % 365) + 365) % 365;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function round(value: number, places: number): number {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}
