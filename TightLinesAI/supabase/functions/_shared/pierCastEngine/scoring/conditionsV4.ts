import {
  PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION,
  type PierCastRegionalSeasonalProfileV4,
  pierCastSeasonalBandV4,
  type PierCastSeasonalOutlookReadV4,
  pierCastThermalBandV4,
  type PierCastThermalMatchReadV4,
  type PierCastThermalProfileV4,
} from "../../../../../lib/pierCastConditionsV4.ts";
import { validatePierCastV4RegionalProfile } from "../config/conditionsV4.ts";

const DAY_MS = 86_400_000;
const SEASONAL_VALIDATION_CACHE = new WeakMap<object, readonly string[]>();
const THERMAL_VALIDATION_CACHE = new WeakMap<object, readonly string[]>();
const SEASONAL_ANCHOR_CACHE = new WeakMap<
  object,
  Map<number, Array<{ monthDay: string; value: number; time: number }>>
>();

export function evaluatePierCastSeasonalOutlookV4(input: {
  profile: PierCastRegionalSeasonalProfileV4 | null;
  localDate: string;
  latitude: number;
  hasLocalContext?: boolean;
}): PierCastSeasonalOutlookReadV4 {
  const parsed = parseLocalDate(input.localDate);
  if (!input.profile) {
    return seasonalUnavailable(
      input.localDate,
      null,
      "seasonal_profile_missing",
    );
  }
  if (
    !parsed || !Number.isFinite(input.latitude) ||
    cachedSeasonalValidation(input.profile).length > 0
  ) {
    return seasonalUnavailable(
      input.localDate,
      input.profile.profileId,
      "seasonal_profile_invalid",
    );
  }
  const rawShift = input.profile.latitudeAdjustment.timingShiftDaysPerDegree *
    (input.latitude - input.profile.referenceLatitude);
  const limit = input.profile.latitudeAdjustment.maximumAbsoluteShiftDays;
  const shiftDays = Math.min(limit, Math.max(-limit, rawShift));
  const value = interpolateSeasonalProfile(
    parsed.getTime() - shiftDays * DAY_MS,
    input.profile,
  );
  if (value === null) {
    return seasonalUnavailable(
      input.localDate,
      input.profile.profileId,
      "seasonal_profile_invalid",
    );
  }
  const before = interpolateSeasonalProfile(
    parsed.getTime() - (shiftDays + 7) * DAY_MS,
    input.profile,
  );
  const after = interpolateSeasonalProfile(
    parsed.getTime() - (shiftDays - 7) * DAY_MS,
    input.profile,
  );
  if (before === null || after === null) {
    return seasonalUnavailable(
      input.localDate,
      input.profile.profileId,
      "seasonal_profile_invalid",
    );
  }
  const delta = after - before;
  const trend = delta > 0.04
    ? "building" as const
    : delta < -0.04
    ? "fading" as const
    : "steady" as const;
  const band = pierCastSeasonalBandV4(value);
  if (!band) {
    return seasonalUnavailable(
      input.localDate,
      input.profile.profileId,
      "seasonal_profile_invalid",
    );
  }
  const stage = value < 0.05
    ? "off" as const
    : trend === "building"
    ? (value < 0.25 ? "early" as const : "building" as const)
    : trend === "fading"
    ? (value < 0.25 ? "late" as const : "fading" as const)
    : value >= 0.25
    ? "active" as const
    : delta >= 0
    ? "early" as const
    : "late" as const;
  return {
    status: "available",
    value: round(value, 4),
    band,
    stage,
    trend,
    profileId: input.profile.profileId,
    basis: input.hasLocalContext ? "regional_with_local_context" : "regional",
    localDate: input.localDate,
    reasonCodes: shiftDays === 0
      ? []
      : [`latitude_timing_shift_days:${round(shiftDays, 2)}`],
  };
}

export function validatePierCastV4ThermalProfile(
  profile: PierCastThermalProfileV4,
): string[] {
  const issues: string[] = [];
  const [minimum, maximum] = profile.acceptedDomainC;
  const [optimumMinimum, optimumMaximum] = profile.optimumRangeC;
  if (
    profile.schemaVersion !== PIER_CAST_THERMAL_PROFILE_SCHEMA_VERSION ||
    !profile.calibrationVersion.trim() ||
    profile.context !== "modeled_nearshore_surface" ||
    profile.interpretation !==
      "surface_temperature_compatibility_not_fish_presence" ||
    profile.evidenceIds.length < 2 ||
    profile.evidenceIds.some((evidenceId) => !evidenceId.trim())
  ) issues.push("temperature_curve_invalid");
  if (
    !profile.curveId.trim() || !Number.isFinite(minimum) ||
    !Number.isFinite(maximum) || minimum >= maximum
  ) issues.push("temperature_curve_invalid");
  if (
    !Number.isFinite(optimumMinimum) || !Number.isFinite(optimumMaximum) ||
    optimumMinimum > optimumMaximum || optimumMinimum < minimum ||
    optimumMaximum > maximum
  ) issues.push("temperature_curve_invalid");
  let previous = Number.NEGATIVE_INFINITY;
  for (const knot of profile.knots) {
    if (
      !Number.isFinite(knot.temperatureC) ||
      !Number.isFinite(knot.suitability) ||
      knot.temperatureC <= previous || knot.temperatureC < minimum ||
      knot.temperatureC > maximum || knot.suitability < 0 ||
      knot.suitability > 1
    ) issues.push("temperature_curve_invalid");
    previous = knot.temperatureC;
  }
  if (
    profile.knots.length < 2 || profile.knots[0]?.temperatureC !== minimum ||
    profile.knots.at(-1)?.temperatureC !== maximum
  ) issues.push("temperature_curve_invalid");
  const optimumMinimumKnot = profile.knots.find((knot) =>
    knot.temperatureC === optimumMinimum
  );
  const optimumMaximumKnot = profile.knots.find((knot) =>
    knot.temperatureC === optimumMaximum
  );
  if (
    optimumMinimumKnot?.suitability !== 1 ||
    optimumMaximumKnot?.suitability !== 1 ||
    profile.knots.some((knot) =>
      knot.temperatureC > optimumMinimum &&
      knot.temperatureC < optimumMaximum && knot.suitability !== 1
    ) ||
    profile.knots.some((knot) =>
      (knot.temperatureC < optimumMinimum ||
        knot.temperatureC > optimumMaximum) && knot.suitability === 1
    )
  ) issues.push("temperature_curve_invalid");
  const coldSide = profile.knots.filter((knot) =>
    knot.temperatureC <= optimumMinimum
  );
  const warmSide = profile.knots.filter((knot) =>
    knot.temperatureC >= optimumMaximum
  );
  if (
    coldSide.some((knot, index) =>
      index > 0 && knot.suitability < coldSide[index - 1]!.suitability
    ) ||
    warmSide.some((knot, index) =>
      index > 0 && knot.suitability > warmSide[index - 1]!.suitability
    )
  ) issues.push("temperature_curve_invalid");
  return [...new Set(issues)];
}

function cachedSeasonalValidation(
  profile: PierCastRegionalSeasonalProfileV4,
): readonly string[] {
  const cached = SEASONAL_VALIDATION_CACHE.get(profile);
  if (cached) return cached;
  const issues = validatePierCastV4RegionalProfile(profile);
  SEASONAL_VALIDATION_CACHE.set(profile, issues);
  return issues;
}

function cachedThermalValidation(
  profile: PierCastThermalProfileV4,
): readonly string[] {
  const cached = THERMAL_VALIDATION_CACHE.get(profile);
  if (cached) return cached;
  const issues = validatePierCastV4ThermalProfile(profile);
  THERMAL_VALIDATION_CACHE.set(profile, issues);
  return issues;
}

export function evaluatePierCastThermalMatchV4(input: {
  profile: PierCastThermalProfileV4 | null;
  temperatureC: number | null;
  validAt: string | null;
  inputStatus: "valid" | "missing" | "stale" | "partial_horizon";
}): PierCastThermalMatchReadV4 {
  if (!input.profile) {
    return thermalUnavailable(input, null, "temperature_curve_missing");
  }
  if (cachedThermalValidation(input.profile).length > 0) {
    return thermalUnavailable(
      input,
      input.profile,
      "temperature_curve_invalid",
    );
  }
  if (input.inputStatus !== "valid") {
    return thermalUnavailable(
      input,
      input.profile,
      input.inputStatus === "missing"
        ? "temperature_missing"
        : input.inputStatus === "stale"
        ? "temperature_stale"
        : "temperature_partial_horizon",
    );
  }
  if (
    input.temperatureC === null || !Number.isFinite(input.temperatureC) ||
    !input.validAt || !Number.isFinite(Date.parse(input.validAt))
  ) {
    return thermalUnavailable(input, input.profile, "temperature_missing");
  }
  const [minimum, maximum] = input.profile.acceptedDomainC;
  if (input.temperatureC < minimum || input.temperatureC > maximum) {
    return thermalUnavailable(
      input,
      input.profile,
      "temperature_out_of_domain",
    );
  }
  const value = interpolateThermal(input.profile, input.temperatureC);
  const band = value === null ? null : pierCastThermalBandV4(value);
  if (value === null || !band) {
    return thermalUnavailable(
      input,
      input.profile,
      "temperature_curve_invalid",
    );
  }
  const [optimumMinimum, optimumMaximum] = input.profile.optimumRangeC;
  const distance = input.temperatureC < optimumMinimum
    ? optimumMinimum - input.temperatureC
    : input.temperatureC > optimumMaximum
    ? input.temperatureC - optimumMaximum
    : 0;
  return {
    status: "available",
    value: round(value, 4),
    band,
    temperatureC: input.temperatureC,
    optimumRangeC: input.profile.optimumRangeC,
    distanceFromOptimumC: round(distance, 3),
    curveId: input.profile.curveId,
    validAt: input.validAt,
    sourceKind: "model",
    reasonCodes: [],
  };
}

function interpolateThermal(
  profile: PierCastThermalProfileV4,
  temperatureC: number,
): number | null {
  const exact = profile.knots.find((knot) =>
    knot.temperatureC === temperatureC
  );
  if (exact) return exact.suitability;
  const upperIndex = profile.knots.findIndex((knot) =>
    knot.temperatureC > temperatureC
  );
  if (upperIndex <= 0) return null;
  const lower = profile.knots[upperIndex - 1]!;
  const upper = profile.knots[upperIndex]!;
  const progress = (temperatureC - lower.temperatureC) /
    (upper.temperatureC - lower.temperatureC);
  return lower.suitability + progress * (upper.suitability - lower.suitability);
}

function interpolateSeasonalProfile(
  targetTime: number,
  profile: PierCastRegionalSeasonalProfileV4,
): number | null {
  const target = new Date(targetTime);
  if (!Number.isFinite(target.getTime())) return null;
  const year = target.getUTCFullYear();
  const knots = anchoredKnots(profile, year);
  if (knots.some((knot) => !Number.isFinite(knot.time))) return null;
  const exact = knots.find((knot) => knot.time === targetTime);
  if (exact) return exact.value;
  const before = [...knots].reverse().find((knot) => knot.time < targetTime) ??
    {
      ...knots.at(-1)!,
      time: anchorTime(year - 1, knots.at(-1)!.monthDay),
    };
  const after = knots.find((knot) => knot.time > targetTime) ?? {
    ...knots[0]!,
    time: anchorTime(year + 1, knots[0]!.monthDay),
  };
  if (after.time <= before.time) return null;
  const progress = (targetTime - before.time) / (after.time - before.time);
  return before.value + progress * (after.value - before.value);
}

function anchoredKnots(
  profile: PierCastRegionalSeasonalProfileV4,
  year: number,
): Array<{ monthDay: string; value: number; time: number }> {
  let years = SEASONAL_ANCHOR_CACHE.get(profile);
  if (!years) {
    years = new Map();
    SEASONAL_ANCHOR_CACHE.set(profile, years);
  }
  const cached = years.get(year);
  if (cached) return cached;
  const knots = profile.knots.map((knot) => ({
    monthDay: knot.monthDay,
    value: knot.value,
    time: anchorTime(year, knot.monthDay),
  }));
  years.set(year, knots);
  return knots;
}

function seasonalUnavailable(
  localDate: string,
  profileId: string | null,
  reason: "seasonal_profile_missing" | "seasonal_profile_invalid",
): PierCastSeasonalOutlookReadV4 {
  return {
    status: "unavailable",
    value: null,
    band: null,
    stage: null,
    trend: null,
    profileId,
    basis: null,
    localDate,
    reasonCodes: [reason],
  };
}

function thermalUnavailable(
  input: {
    temperatureC: number | null;
    validAt: string | null;
  },
  profile: PierCastThermalProfileV4 | null,
  reason:
    | "temperature_missing"
    | "temperature_stale"
    | "temperature_partial_horizon"
    | "temperature_out_of_domain"
    | "temperature_curve_missing"
    | "temperature_curve_invalid",
): PierCastThermalMatchReadV4 {
  return {
    status: "unavailable",
    value: null,
    band: null,
    temperatureC: input.temperatureC,
    optimumRangeC: profile?.optimumRangeC ?? null,
    distanceFromOptimumC: null,
    curveId: profile?.curveId ?? null,
    validAt: input.validAt,
    sourceKind: "model",
    reasonCodes: [reason],
  };
}

function parseLocalDate(localDate: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(localDate);
  if (!match) return null;
  const date = new Date(`${localDate}T00:00:00Z`);
  return !Number.isFinite(date.getTime()) ||
      date.toISOString().slice(0, 10) !== localDate
    ? null
    : date;
}

function anchorTime(year: number, monthDay: string): number {
  const date = new Date(`${year}-${monthDay}T00:00:00Z`);
  return date.toISOString().slice(5, 10) === monthDay
    ? date.getTime()
    : Number.NaN;
}

function round(value: number, places: number): number {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
}
