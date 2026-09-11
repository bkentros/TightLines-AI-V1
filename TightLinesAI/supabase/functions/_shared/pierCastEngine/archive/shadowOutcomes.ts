import { PIER_CAST_CORE_SPECIES_IDS } from "../config/coreCalibration.ts";
import type {
  PierCastCityId,
  PierCastShadowOutcomeCommit,
  PierCastShadowOutcomeInput,
} from "../types.ts";
import type { PierCastArchiveClient } from "./lmhofsArchive.ts";

const CITY_IDS = new Set<PierCastCityId>([
  "ludington_mi",
  "grand_haven_mi",
  "manistee_mi",
  "frankfort_elberta_mi",
  "sheboygan_wi",
]);
const ASSESSMENT_STATUSES = new Set([
  "assessable",
  "not_assessable_access",
  "not_assessable_conditions",
  "insufficient_evidence",
]);
const SOURCE_TYPES = new Set([
  "owner_trip",
  "verified_pier_report",
  "agency_creel",
  "other_documented",
]);
const EVIDENCE_QUALITIES = new Set([
  "direct_effort",
  "direct_observation",
  "verified_quantitative",
  "verified_qualitative",
]);

export function parsePierCastShadowOutcomeInput(
  value: unknown,
): PierCastShadowOutcomeInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Outcome must be a JSON object.");
  }
  const input = value as Record<string, unknown>;
  const dedupeKey = requiredText(input.dedupeKey, "dedupeKey", 8, 200);
  const cityId = requiredText(input.cityId, "cityId", 1, 100) as PierCastCityId;
  if (!CITY_IDS.has(cityId)) throw new Error("Unsupported PierCast city.");
  const speciesId = requiredText(
    input.speciesId,
    "speciesId",
    1,
    100,
  ) as PierCastShadowOutcomeInput["speciesId"];
  if (!PIER_CAST_CORE_SPECIES_IDS.includes(speciesId)) {
    throw new Error("Unsupported PierCast outcome species.");
  }
  const localDate = requiredText(input.localDate, "localDate", 10, 10);
  if (!isCalendarDate(localDate)) {
    throw new Error("localDate must be YYYY-MM-DD.");
  }
  const structureName = requiredText(
    input.structureName,
    "structureName",
    1,
    200,
  );
  const observedAt = optionalTimestamp(input.observedAt, "observedAt");
  const assessmentStatus = requiredText(
    input.assessmentStatus,
    "assessmentStatus",
    1,
    100,
  ) as PierCastShadowOutcomeInput["assessmentStatus"];
  if (!ASSESSMENT_STATUSES.has(assessmentStatus)) {
    throw new Error("Invalid assessmentStatus.");
  }
  const result = requiredText(
    input.result,
    "result",
    1,
    50,
  ) as PierCastShadowOutcomeInput["result"];
  if (!["positive", "zero_catch", "unknown"].includes(result)) {
    throw new Error("Invalid outcome result.");
  }
  const effortMinutes = optionalInteger(
    input.effortMinutes,
    "effortMinutes",
    1,
    1440,
  );
  const catchCount = optionalInteger(input.catchCount, "catchCount", 0, 1000);
  const sourceType = requiredText(
    input.sourceType,
    "sourceType",
    1,
    100,
  ) as PierCastShadowOutcomeInput["sourceType"];
  if (!SOURCE_TYPES.has(sourceType)) throw new Error("Invalid sourceType.");
  const evidenceQuality = requiredText(
    input.evidenceQuality,
    "evidenceQuality",
    1,
    100,
  ) as PierCastShadowOutcomeInput["evidenceQuality"];
  if (!EVIDENCE_QUALITIES.has(evidenceQuality)) {
    throw new Error("Invalid evidenceQuality.");
  }
  const sourceReference = optionalText(
    input.sourceReference,
    "sourceReference",
    1000,
  );
  const notes = optionalText(input.notes, "notes", 2000);

  if (
    (assessmentStatus === "assessable" && result === "unknown") ||
    (assessmentStatus !== "assessable" && result !== "unknown")
  ) {
    throw new Error("Assessability and result are inconsistent.");
  }
  if (result === "positive" && (catchCount === null || catchCount < 1)) {
    throw new Error("A positive outcome requires catchCount of at least 1.");
  }
  if (
    result === "zero_catch" &&
    (catchCount !== 0 || effortMinutes === null)
  ) {
    throw new Error(
      "A zero-catch outcome requires explicit effort and catchCount 0.",
    );
  }
  if (result === "unknown" && catchCount !== null) {
    throw new Error("A non-assessable outcome cannot include catchCount.");
  }
  if (sourceType !== "owner_trip" && !sourceReference) {
    throw new Error("Documented non-owner outcomes require sourceReference.");
  }
  if (
    sourceType === "owner_trip" &&
    ((assessmentStatus === "assessable" &&
      (evidenceQuality !== "direct_effort" || effortMinutes === null)) ||
      (assessmentStatus !== "assessable" &&
        evidenceQuality !== "direct_observation"))
  ) {
    throw new Error(
      "Owner outcomes require direct effort when assessable and direct observation otherwise.",
    );
  }

  return {
    dedupeKey,
    cityId,
    speciesId,
    localDate,
    structureName,
    observedAt,
    assessmentStatus,
    result,
    effortMinutes,
    catchCount,
    sourceType,
    evidenceQuality,
    sourceReference,
    notes,
  };
}

export async function recordPierCastShadowOutcome(
  database: PierCastArchiveClient,
  value: unknown,
): Promise<PierCastShadowOutcomeCommit> {
  const outcome = parsePierCastShadowOutcomeInput(value);
  const { data, error } = await database.rpc(
    "record_pier_cast_shadow_outcome",
    {
      p_outcome: outcome,
    },
  );
  if (error) {
    throw new Error(error.message?.trim() || "PierCast outcome commit failed.");
  }
  const result = data as Record<string, unknown> | null;
  if (
    !result ||
    (result.status !== "committed" && result.status !== "already_committed") ||
    typeof result.outcomeId !== "string" ||
    result.outcomeId.length === 0
  ) {
    throw new Error("PierCast outcome commit returned an invalid result.");
  }
  return { status: result.status, outcomeId: result.outcomeId };
}

function requiredText(
  value: unknown,
  field: string,
  minimum: number,
  maximum: number,
): string {
  if (typeof value !== "string") throw new Error(`${field} is required.`);
  const trimmed = value.trim();
  if (trimmed.length < minimum || trimmed.length > maximum) {
    throw new Error(`${field} length is invalid.`);
  }
  return trimmed;
}

function optionalText(
  value: unknown,
  field: string,
  maximum: number,
): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string") throw new Error(`${field} must be text.`);
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (trimmed.length > maximum) throw new Error(`${field} is too long.`);
  return trimmed;
}

function optionalInteger(
  value: unknown,
  field: string,
  minimum: number,
  maximum: number,
): number | null {
  if (value === null || value === undefined || value === "") return null;
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(number) || number < minimum || number > maximum) {
    throw new Error(
      `${field} must be an integer from ${minimum} to ${maximum}.`,
    );
  }
  return number;
}

function optionalTimestamp(value: unknown, field: string): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "string" || !Number.isFinite(Date.parse(value))) {
    throw new Error(`${field} must be an ISO timestamp.`);
  }
  return new Date(value).toISOString();
}

function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value;
}
