import {
  getPierCastFieldTemperatureSite,
  PIER_CAST_FIELD_TEMPERATURE_PROTOCOL,
} from "../config/fieldValidation.ts";
import type { PierCastCityId } from "../types.ts";

export type PierCastFieldTemperatureInput = {
  sourceId: string;
  cityId: PierCastCityId;
  structureId: string;
  observedAt: string;
  latitude: number;
  longitude: number;
  depthM: number;
  temperatureC: number;
  instrumentId: string;
  instrumentModel: string;
  instrumentAccuracyC: number;
  calibrationCheckedAt: string;
  calibrationReferenceC: number;
  calibrationObservedC: number;
  qualityFlag: "good" | "suspect" | "bad";
  fieldSessionId: string;
};

export type PierCastFieldTemperatureRecord = PierCastFieldTemperatureInput & {
  normalizedTemperatureC: number | null;
  recordStatus: "usable" | "rejected";
  rejectionReasons: string[];
  distanceFromTargetM: number | null;
  calibrationErrorC: number | null;
  protocolVersion: string;
  validatedAt: string;
};

function haversineM(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  const radians = Math.PI / 180;
  const deltaLatitude = (latitudeB - latitudeA) * radians;
  const deltaLongitude = (longitudeB - longitudeA) * radians;
  const a = Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(latitudeA * radians) * Math.cos(latitudeB * radians) *
      Math.sin(deltaLongitude / 2) ** 2;
  return 2 * 6_371_000 * Math.asin(Math.sqrt(a));
}

export function validatePierCastFieldTemperatureObservation(
  input: PierCastFieldTemperatureInput,
  now = new Date(),
): PierCastFieldTemperatureRecord {
  const reasons: string[] = [];
  const site = getPierCastFieldTemperatureSite(input.sourceId);
  const observedAt = new Date(input.observedAt);
  const calibrationCheckedAt = new Date(input.calibrationCheckedAt);
  const validObservedAt = Number.isFinite(observedAt.getTime());
  const validCalibrationAt = Number.isFinite(calibrationCheckedAt.getTime());

  // These timestamps form the immutable archive key and a required database
  // value. A syntactically invalid timestamp is malformed input, not rejected
  // scientific evidence that can safely be archived.
  if (!validObservedAt || !validCalibrationAt) {
    throw new TypeError(
      "Field observation timestamps must be valid ISO dates.",
    );
  }

  if (!site) reasons.push("unknown_source");
  if (
    site &&
    (site.cityId !== input.cityId || site.structureId !== input.structureId)
  ) {
    reasons.push("source_scope_mismatch");
  }
  if (observedAt > now) reasons.push("invalid_observed_at");
  if (
    !input.instrumentId.trim() || !input.instrumentModel.trim() ||
    input.instrumentId.startsWith("replace-with-") ||
    input.instrumentModel.startsWith("replace-with-")
  ) {
    reasons.push("instrument_identity_missing");
  }
  if (
    !input.fieldSessionId.trim() ||
    input.fieldSessionId.startsWith("replace-with-")
  ) reasons.push("field_session_missing");
  if (
    !Number.isFinite(input.instrumentAccuracyC) ||
    input.instrumentAccuracyC < 0 ||
    input.instrumentAccuracyC >
      PIER_CAST_FIELD_TEMPERATURE_PROTOCOL.maximumInstrumentAccuracyC
  ) {
    reasons.push("instrument_accuracy_insufficient");
  }

  const calibrationErrorC = Number.isFinite(input.calibrationReferenceC) &&
      Number.isFinite(input.calibrationObservedC)
    ? Math.abs(input.calibrationObservedC - input.calibrationReferenceC)
    : null;
  if (
    calibrationErrorC === null ||
    calibrationErrorC >
      PIER_CAST_FIELD_TEMPERATURE_PROTOCOL.maximumCalibrationErrorC
  ) {
    reasons.push("calibration_error_excessive");
  }
  if (
    calibrationCheckedAt > observedAt ||
    observedAt.getTime() - calibrationCheckedAt.getTime() >
      PIER_CAST_FIELD_TEMPERATURE_PROTOCOL.maximumCalibrationAgeDays *
        86_400_000
  ) {
    reasons.push("calibration_out_of_window");
  }

  const validCoordinates = Number.isFinite(input.latitude) &&
    Number.isFinite(input.longitude) && input.latitude >= -90 &&
    input.latitude <= 90 && input.longitude >= -180 && input.longitude <= 180;
  const distanceFromTargetM = site && validCoordinates
    ? haversineM(
      site.targetLatitude,
      site.targetLongitude,
      input.latitude,
      input.longitude,
    )
    : null;
  if (!validCoordinates) reasons.push("invalid_coordinates");
  else if (site && distanceFromTargetM! > site.maximumDistanceM) {
    reasons.push("outside_validation_site");
  }
  if (
    !Number.isFinite(input.depthM) || !site ||
    Math.abs(input.depthM - site.targetDepthM) > site.depthToleranceM
  ) {
    reasons.push("depth_outside_protocol");
  }
  if (
    !Number.isFinite(input.temperatureC) || input.temperatureC < -2 ||
    input.temperatureC > 40
  ) {
    reasons.push("temperature_out_of_range");
  }
  if (input.qualityFlag !== "good") reasons.push("quality_not_good");

  const recordStatus = reasons.length === 0 ? "usable" : "rejected";
  return {
    ...input,
    observedAt: observedAt.toISOString(),
    calibrationCheckedAt: calibrationCheckedAt.toISOString(),
    normalizedTemperatureC: recordStatus === "usable"
      ? input.temperatureC
      : null,
    recordStatus,
    rejectionReasons: reasons,
    distanceFromTargetM,
    calibrationErrorC,
    protocolVersion: PIER_CAST_FIELD_TEMPERATURE_PROTOCOL.protocolVersion,
    validatedAt: now.toISOString(),
  };
}
