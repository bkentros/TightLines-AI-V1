import type {
  PierCastSeasonalOpportunityCurve,
  PierCastSeasonalOpportunityEvaluation,
} from "../types.ts";

type ParsedDate = { year: number; month: number; day: number };

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
  if (!parsed) return Number.NaN;
  return Date.UTC(year, parsed.month - 1, parsed.day);
}

export function validatePierCastSeasonalOpportunityCurve(
  curve: PierCastSeasonalOpportunityCurve,
): string[] {
  const issues: string[] = [];
  if (!curve.curveId.trim()) issues.push("seasonal_curve_id_missing");
  if (curve.knots.length < 2) issues.push("seasonal_curve_too_short");

  const monthDays = new Set<string>();
  for (const knot of curve.knots) {
    if (!parseMonthDay(knot.monthDay)) {
      issues.push("seasonal_curve_date_invalid");
    }
    if (monthDays.has(knot.monthDay)) {
      issues.push("seasonal_curve_date_duplicate");
    }
    monthDays.add(knot.monthDay);
    if (!Number.isFinite(knot.rating) || knot.rating < 1 || knot.rating > 10) {
      issues.push("seasonal_curve_rating_invalid");
    }
  }
  return [...new Set(issues)];
}

export function evaluatePierCastSeasonalOpportunity(input: {
  ratingEnabled: boolean;
  mode: "review" | "public";
  localDate: string;
  curve: PierCastSeasonalOpportunityCurve | null;
}): PierCastSeasonalOpportunityEvaluation {
  if (!input.ratingEnabled) {
    return {
      status: "unavailable",
      rating: null,
      reasonCodes: ["rating_not_enabled"],
    };
  }
  if (!input.curve) {
    return {
      status: "unavailable",
      rating: null,
      reasonCodes: ["seasonal_curve_missing"],
    };
  }
  if (
    input.mode === "public" &&
    input.curve.calibrationStatus !== "approved_for_pilot"
  ) {
    return {
      status: "unavailable",
      rating: null,
      reasonCodes: ["seasonal_curve_not_approved"],
    };
  }
  const curveIssues = validatePierCastSeasonalOpportunityCurve(input.curve);
  if (curveIssues.length > 0) {
    return { status: "unavailable", rating: null, reasonCodes: curveIssues };
  }

  const date = parseLocalDate(input.localDate);
  if (!date) {
    return {
      status: "unavailable",
      rating: null,
      reasonCodes: ["local_date_invalid"],
    };
  }

  const target = Date.UTC(date.year, date.month - 1, date.day);
  const currentYear = [...input.curve.knots]
    .map((knot) => ({ ...knot, time: anchorTime(date.year, knot.monthDay) }))
    .sort((left, right) => left.time - right.time);
  const exact = currentYear.find((knot) => knot.time === target);
  if (exact) {
    return {
      status: "available",
      rating: exact.rating,
      curveId: input.curve.curveId,
      calibrationStatus: input.curve.calibrationStatus,
      reasonCodes: [],
    };
  }

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
  const rating = before.rating + (after.rating - before.rating) * progress;

  return {
    status: "available",
    rating,
    curveId: input.curve.curveId,
    calibrationStatus: input.curve.calibrationStatus,
    reasonCodes: [],
  };
}
