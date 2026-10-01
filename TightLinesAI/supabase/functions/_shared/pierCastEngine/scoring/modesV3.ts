import type {
  PierCastV3AvailabilityKnot,
  PierCastV3ModePotential,
  PierCastV3OpportunityMode,
  PierCastV3PairCalibration,
} from "../config/v3Calibration.ts";

type ParsedDate = { year: number; month: number; day: number };

export function validatePierCastV3OpportunityMode(
  mode: PierCastV3OpportunityMode,
): string[] {
  const issues: string[] = [];
  if (!mode.modeCalibrationId.trim() || !mode.modeId.trim()) {
    issues.push("v3_mode_id_missing");
  }
  if (
    !Number.isFinite(mode.fisheryStrength) || mode.fisheryStrength < 2.1 ||
    mode.fisheryStrength > 10
  ) {
    issues.push("v3_fishery_strength_invalid");
  }
  if (mode.availabilityKnots.length < 2) {
    issues.push("v3_availability_curve_too_short");
  }
  const dates = new Set<string>();
  for (const knot of mode.availabilityKnots) {
    if (!parseMonthDay(knot.monthDay)) {
      issues.push("v3_availability_date_invalid");
    }
    if (dates.has(knot.monthDay)) issues.push("v3_availability_date_duplicate");
    dates.add(knot.monthDay);
    if (
      !Number.isFinite(knot.availability) || knot.availability < 0 ||
      knot.availability > 1
    ) {
      issues.push("v3_availability_value_invalid");
    }
  }
  if (!mode.thermalCurveId.trim()) issues.push("v3_thermal_curve_id_missing");
  return [...new Set(issues)];
}

export function evaluatePierCastV3ModePotential(input: {
  localDate: string;
  mode: PierCastV3OpportunityMode;
}): PierCastV3ModePotential | null {
  const date = parseLocalDate(input.localDate);
  if (!date || validatePierCastV3OpportunityMode(input.mode).length > 0) {
    return null;
  }
  const seasonalAvailability = interpolateRecurringAvailability(
    date,
    input.mode.availabilityKnots,
  );
  if (seasonalAvailability === null) return null;
  return {
    modeCalibrationId: input.mode.modeCalibrationId,
    modeId: input.mode.modeId,
    fisheryStrength: input.mode.fisheryStrength,
    seasonalAvailability,
    seasonalPotential: 1 +
      (input.mode.fisheryStrength - 1) * seasonalAvailability,
    thermalCurveId: input.mode.thermalCurveId,
  };
}

export function evaluatePierCastV3ModePotentials(input: {
  localDate: string;
  modes: readonly PierCastV3OpportunityMode[];
}): PierCastV3ModePotential[] {
  if (input.modes.length === 0) return [];
  const evaluated = input.modes.map((mode) =>
    evaluatePierCastV3ModePotential({ localDate: input.localDate, mode })
  );
  return evaluated.every((mode): mode is PierCastV3ModePotential =>
      mode !== null
    )
    ? evaluated
    : [];
}

export function pierCastV3RegulationClosureApplies(input: {
  localDate: string;
  pair: PierCastV3PairCalibration;
}): boolean {
  const date = parseLocalDate(input.localDate);
  if (!date) return false;
  const monthDay = input.localDate.slice(5);
  return (input.pair.closedWindows ?? []).some((window) => {
    if (
      !parseMonthDay(window.startMonthDay) ||
      !parseMonthDay(window.endMonthDay)
    ) return false;
    return window.startMonthDay <= window.endMonthDay
      ? monthDay >= window.startMonthDay && monthDay <= window.endMonthDay
      : monthDay >= window.startMonthDay || monthDay <= window.endMonthDay;
  });
}

function interpolateRecurringAvailability(
  date: ParsedDate,
  knots: readonly PierCastV3AvailabilityKnot[],
): number | null {
  const target = Date.UTC(date.year, date.month - 1, date.day);
  const currentYear = knots.map((knot) => ({
    ...knot,
    time: anchorTime(date.year, knot.monthDay),
  }))
    .sort((left, right) => left.time - right.time);
  if (currentYear.some((knot) => !Number.isFinite(knot.time))) return null;
  const exact = currentYear.find((knot) => knot.time === target);
  if (exact) return exact.availability;
  const before =
    [...currentYear].reverse().find((knot) => knot.time < target) ?? {
      ...currentYear.at(-1)!,
      time: anchorTime(date.year - 1, currentYear.at(-1)!.monthDay),
    };
  const after = currentYear.find((knot) => knot.time > target) ?? {
    ...currentYear[0],
    time: anchorTime(date.year + 1, currentYear[0].monthDay),
  };
  const progress = (target - before.time) / (after.time - before.time);
  return before.availability +
    (after.availability - before.availability) * progress;
}

function parseLocalDate(localDate: string): ParsedDate | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(localDate);
  if (!match) return null;
  const parsed = {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
  const check = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
  return check.getUTCFullYear() === parsed.year &&
      check.getUTCMonth() === parsed.month - 1 &&
      check.getUTCDate() === parsed.day
    ? parsed
    : null;
}

function parseMonthDay(monthDay: string): Omit<ParsedDate, "year"> | null {
  const parsed = parseLocalDate(`2025-${monthDay}`);
  return parsed ? { month: parsed.month, day: parsed.day } : null;
}

function anchorTime(year: number, monthDay: string): number {
  const parsed = parseMonthDay(monthDay);
  return parsed ? Date.UTC(year, parsed.month - 1, parsed.day) : Number.NaN;
}
