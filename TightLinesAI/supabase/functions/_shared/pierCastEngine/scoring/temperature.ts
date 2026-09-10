import type {
  PierCastTemperatureCurve,
  PierCastTemperatureInputStatus,
  PierCastTemperatureSuitability,
  PierCastUnavailableReasonCode,
} from "../types.ts";

function unavailable(
  reason: PierCastUnavailableReasonCode,
): PierCastTemperatureSuitability {
  return { status: "unavailable", suitability: null, reasonCodes: [reason] };
}

export function validatePierCastTemperatureCurve(
  curve: PierCastTemperatureCurve,
): string[] {
  const issues: string[] = [];
  const [minimum, maximum] = curve.acceptedDomainC;
  if (
    !Number.isFinite(minimum) || !Number.isFinite(maximum) || minimum >= maximum
  ) {
    issues.push("temperature_curve_domain_invalid");
  }
  if (!curve.curveId.trim()) issues.push("temperature_curve_id_missing");
  if (curve.knots.length < 2) issues.push("temperature_curve_too_short");
  let previous = Number.NEGATIVE_INFINITY;
  for (const knot of curve.knots) {
    if (
      !Number.isFinite(knot.temperatureC) ||
      !Number.isFinite(knot.suitability) ||
      knot.temperatureC <= previous ||
      knot.temperatureC < minimum ||
      knot.temperatureC > maximum ||
      knot.suitability < 0 ||
      knot.suitability > 1
    ) {
      issues.push("temperature_curve_knot_invalid");
    }
    previous = knot.temperatureC;
  }
  if (
    curve.knots[0]?.temperatureC !== minimum ||
    curve.knots.at(-1)?.temperatureC !== maximum
  ) {
    issues.push("temperature_curve_domain_not_anchored");
  }
  return [...new Set(issues)];
}

function curveIsValid(curve: PierCastTemperatureCurve): boolean {
  return validatePierCastTemperatureCurve(curve).length === 0;
}

function inputReason(
  status: PierCastTemperatureInputStatus,
): PierCastUnavailableReasonCode | null {
  switch (status) {
    case "valid":
      return null;
    case "missing":
      return "temperature_missing";
    case "stale":
      return "temperature_stale";
    case "partial_horizon":
      return "temperature_partial_horizon";
    case "unreviewed_representation":
      return "temperature_representation_unreviewed";
  }
}

export function evaluateTemperatureSuitability(input: {
  ratingEnabled: boolean;
  mode: "review" | "public";
  monthEvidenceState:
    | "sourced_biology"
    | "proposed_regional_transfer"
    | "absent_biology_evidence";
  inputStatus: PierCastTemperatureInputStatus;
  waterTemperatureC: number | null;
  curve: PierCastTemperatureCurve | null;
}): PierCastTemperatureSuitability {
  if (!input.ratingEnabled) return unavailable("rating_not_enabled");
  if (input.monthEvidenceState === "absent_biology_evidence") {
    return unavailable("month_biology_unsupported");
  }
  const sourceReason = inputReason(input.inputStatus);
  if (sourceReason) return unavailable(sourceReason);
  if (
    input.waterTemperatureC === null ||
    !Number.isFinite(input.waterTemperatureC)
  ) {
    return unavailable("temperature_missing");
  }
  if (!input.curve || !curveIsValid(input.curve)) {
    return unavailable("temperature_curve_invalid");
  }
  if (
    input.mode === "public" &&
    input.curve.calibrationStatus !== "approved_for_pilot"
  ) {
    return unavailable("calibration_not_approved");
  }
  const [minimum, maximum] = input.curve.acceptedDomainC;
  if (input.waterTemperatureC < minimum || input.waterTemperatureC > maximum) {
    return unavailable("temperature_out_of_domain");
  }

  const exact = input.curve.knots.find((knot) =>
    knot.temperatureC === input.waterTemperatureC
  );
  if (exact) {
    return {
      status: "available",
      suitability: exact.suitability,
      curveId: input.curve.curveId,
      calibrationStatus: input.curve.calibrationStatus,
      reasonCodes: [],
    };
  }

  const upperIndex = input.curve.knots.findIndex((knot) =>
    knot.temperatureC > input.waterTemperatureC!
  );
  if (upperIndex <= 0) return unavailable("temperature_curve_invalid");
  const lower = input.curve.knots[upperIndex - 1];
  const upper = input.curve.knots[upperIndex];
  const progress = (input.waterTemperatureC - lower.temperatureC) /
    (upper.temperatureC - lower.temperatureC);
  const suitability = lower.suitability +
    progress * (upper.suitability - lower.suitability);
  return {
    status: "available",
    suitability,
    curveId: input.curve.curveId,
    calibrationStatus: input.curve.calibrationStatus,
    reasonCodes: [],
  };
}
