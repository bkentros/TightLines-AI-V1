import {
  PIER_CAST_CONDITIONS_CATALOG_SCHEMA_VERSION,
  PIER_CAST_CONDITIONS_FORMULA_VERSION,
  PIER_CAST_CONDITIONS_SCHEMA_VERSION,
  PIER_CAST_RANKING_VERSION,
  PIER_CAST_SAVED_REPORT_ENVELOPE_VERSION,
  type PierCastConditionsCatalogResponseV4,
  type PierCastConditionsMapResponseV4,
  type PierCastLeaderboardResponseV4,
  type PierCastObservedTemperatureMapResponseV1,
  type PierCastSavedReportEnvelopeV4,
  type PierCastSavedReportReadV4,
} from "./pierCastConditionsV4";
import type {
  PierCastMapFoundationResponse,
  PierCastSpeciesId,
} from "./pierCastContracts";

export class PierCastContractError extends Error {
  readonly code = "incompatible_contract";

  constructor(readonly scope: string) {
    super(
      `PierCast ${scope} data is temporarily incompatible with this app version. Please refresh and try again.`,
    );
    this.name = "PierCastContractError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function fail(scope: string): never {
  throw new PierCastContractError(scope);
}

function requireRecord(value: unknown, scope: string): Record<string, unknown> {
  return isRecord(value) ? value : fail(scope);
}

function requireArray(value: unknown, scope: string): unknown[] {
  return Array.isArray(value) ? value : fail(scope);
}

function validateConditionsHeader(
  value: unknown,
  scope: string,
): Record<string, unknown> {
  const response = requireRecord(value, scope);
  if (
    response.schemaVersion !== PIER_CAST_CONDITIONS_SCHEMA_VERSION ||
    response.formulaVersion !== PIER_CAST_CONDITIONS_FORMULA_VERSION
  ) fail(scope);
  return response;
}

function validateRequestedSpecies(
  actual: unknown,
  requested: PierCastSpeciesId | undefined,
  scope: string,
) {
  if (actual !== (requested ?? null)) fail(scope);
}

export function validatePierCastConditionsCatalog(
  value: unknown,
): PierCastConditionsCatalogResponseV4 {
  const response = requireRecord(value, "catalog");
  if (response.schemaVersion !== PIER_CAST_CONDITIONS_CATALOG_SCHEMA_VERSION) {
    fail("catalog");
  }
  for (const candidate of requireArray(response.cities, "catalog")) {
    const city = requireRecord(candidate, "catalog");
    if (
      typeof city.cityId !== "string" ||
      typeof city.displayName !== "string" ||
      !Array.isArray(city.supportedSpeciesIds) ||
      city.supportedSpeciesIds.some((speciesId) => typeof speciesId !== "string")
    ) fail("catalog");
  }
  return response as PierCastConditionsCatalogResponseV4;
}

export function validatePierCastConditionsLeaderboard(
  value: unknown,
  requestedSpeciesId?: PierCastSpeciesId,
): PierCastLeaderboardResponseV4 {
  const response = validateConditionsHeader(value, "leaderboard");
  if (
    response.rankingVersion !== PIER_CAST_RANKING_VERSION ||
    !Array.isArray(response.targetSpecies) ||
    !Array.isArray(response.cities)
  ) fail("leaderboard");
  validateRequestedSpecies(
    response.selectedSpeciesId,
    requestedSpeciesId,
    "leaderboard",
  );
  if (response.cities.some((candidate) => {
    const city = isRecord(candidate) ? candidate : null;
    return !city || city.speciesId !== requestedSpeciesId;
  })) fail("leaderboard");
  return response as PierCastLeaderboardResponseV4;
}

export function validatePierCastConditionsMap(
  value: unknown,
  requestedSpeciesId?: PierCastSpeciesId,
): PierCastConditionsMapResponseV4 {
  const response = validateConditionsHeader(value, "map");
  if (
    !Array.isArray(response.targetSpecies) ||
    !Array.isArray(response.cities)
  ) fail("map");
  validateRequestedSpecies(response.selectedSpeciesId, requestedSpeciesId, "map");
  if (response.cities.some((candidate) => {
    const city = isRecord(candidate) ? candidate : null;
    if (!city) return true;
    if (city.selectedSpecies === null) return false;
    const selected = isRecord(city.selectedSpecies) ? city.selectedSpecies : null;
    return !selected || selected.speciesId !== requestedSpeciesId;
  })) fail("map");
  return response as PierCastConditionsMapResponseV4;
}

export function validatePierCastSavedReportEnvelope(
  value: unknown,
  expected?: { cityId?: string; speciesId?: PierCastSpeciesId },
): PierCastSavedReportEnvelopeV4 {
  const envelope = requireRecord(value, "city report");
  const report = validateConditionsHeader(envelope.report, "city report");
  const species = Array.isArray(report.species) ? report.species : [];
  if (
    envelope.envelopeVersion !== PIER_CAST_SAVED_REPORT_ENVELOPE_VERSION ||
    typeof envelope.reportKey !== "string" ||
    !Array.isArray(report.species) ||
    (expected?.cityId !== undefined && report.cityId !== expected.cityId) ||
    (expected?.speciesId !== undefined &&
      (report.selectedSpeciesId !== expected.speciesId ||
        !species.some((candidate) =>
          isRecord(candidate) && candidate.speciesId === expected.speciesId
        )))
  ) fail("city report");
  return envelope as PierCastSavedReportEnvelopeV4;
}

export function validatePierCastSavedReportRead(
  value: unknown,
  requestedSpeciesId?: PierCastSpeciesId,
): PierCastSavedReportReadV4 {
  const response = requireRecord(value, "saved report");
  if (response.status === "available") {
    validatePierCastSavedReportEnvelope(response.envelope, {
      speciesId: requestedSpeciesId,
    });
  } else if (response.status === "archived_legacy") {
    if (
      response.envelope !== null ||
      response.refreshAvailable !== true ||
      typeof response.reason !== "string"
    ) fail("saved report");
  } else if (response.status === "empty") {
    if (response.envelope !== null) fail("saved report");
  } else {
    fail("saved report");
  }
  return response as PierCastSavedReportReadV4;
}

export function validatePierCastObservedTemperatureMap(
  value: unknown,
): PierCastObservedTemperatureMapResponseV1 {
  const response = requireRecord(value, "observations");
  if (
    response.schemaVersion !== "piercast-observed-temperature-map-v1" ||
    !Array.isArray(response.stations) ||
    !Array.isArray(response.diagnostics)
  ) fail("observations");
  return response as PierCastObservedTemperatureMapResponseV1;
}

export function validatePierCastMapFoundation(
  value: unknown,
): PierCastMapFoundationResponse {
  const response = requireRecord(value, "map foundation");
  const timeline = requireRecord(response.timeline, "map foundation");
  const wind = requireRecord(response.wind, "map foundation");
  const validTimes = requireArray(timeline.validTimes, "map foundation");
  const nodes = requireArray(wind.nodes, "map foundation");
  if (
    response.mode !== "great_lakes_map_foundation" ||
    response.schemaVersion !== "pier-cast-map-foundation-v1" ||
    timeline.stepHours !== 1 ||
    timeline.frameCount !== 121 ||
    validTimes.length !== timeline.frameCount ||
    validTimes.some((validAt) => typeof validAt !== "string")
  ) fail("map foundation");
  for (const candidate of nodes) {
    const node = requireRecord(candidate, "map foundation");
    if (
      !Array.isArray(node.speedMph) ||
      !Array.isArray(node.directionDegrees) ||
      !Array.isArray(node.gustMph) ||
      node.speedMph.length !== validTimes.length ||
      node.directionDegrees.length !== validTimes.length ||
      node.gustMph.length !== validTimes.length
    ) fail("map foundation");
  }
  return response as PierCastMapFoundationResponse;
}
