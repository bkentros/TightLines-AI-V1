import {
  assertEquals,
  assertRejects,
  assertStringIncludes,
  assertThrows,
} from "jsr:@std/assert";
import {
  archivePierCastFieldTemperatureObservations,
  PIER_CAST_FIELD_TEMPERATURE_SITES,
  type PierCastArchiveClient,
  type PierCastFieldTemperatureInput,
  validatePierCastFieldTemperatureObservation,
} from "../index.ts";

const NOW = new Date("2026-09-11T18:00:00.000Z");
const VALID: PierCastFieldTemperatureInput = {
  sourceId: "manistee_north_pier__surface_logger_v1",
  cityId: "manistee_mi",
  structureId: "manistee_north_pier",
  observedAt: "2026-09-11T17:45:00.000Z",
  latitude: 44.25195,
  longitude: -86.34695,
  depthM: 0.5,
  temperatureC: 17.25,
  instrumentId: "logger-001",
  instrumentModel: "documented-test-logger",
  instrumentAccuracyC: 0.2,
  calibrationCheckedAt: "2026-09-11T16:00:00.000Z",
  calibrationReferenceC: 15,
  calibrationObservedC: 15.1,
  qualityFlag: "good",
  fieldSessionId: "manistee-2026-deployment-01",
};

Deno.test("field validation scope freezes one independent site per covered structure", () => {
  assertEquals(PIER_CAST_FIELD_TEMPERATURE_SITES.length, 7);
  assertEquals(
    new Set(PIER_CAST_FIELD_TEMPERATURE_SITES.map((site) => site.structureId))
      .size,
    7,
  );
  assertEquals(
    PIER_CAST_FIELD_TEMPERATURE_SITES.every((site) =>
      site.deploymentStatus === "authorization_and_deployment_required"
    ),
    true,
  );
});

Deno.test("field observation passes only the frozen location, depth, instrument, calibration, and QA contract", () => {
  const record = validatePierCastFieldTemperatureObservation(VALID, NOW);
  assertEquals(record.recordStatus, "usable");
  assertEquals(record.normalizedTemperatureC, 17.25);
  assertEquals(record.rejectionReasons, []);
  assertEquals(record.protocolVersion, "piercast-field-temperature-v1");
  assertEquals(record.distanceFromTargetM! < 2, true);
});

Deno.test("field observation preserves all rejection reasons and never exposes rejected temperature", () => {
  const record = validatePierCastFieldTemperatureObservation({
    ...VALID,
    cityId: "ludington_mi",
    latitude: 43,
    depthM: 2,
    instrumentAccuracyC: 0.5,
    calibrationCheckedAt: "2026-07-01T00:00:00.000Z",
    calibrationObservedC: 16,
    qualityFlag: "suspect",
  }, NOW);
  assertEquals(record.recordStatus, "rejected");
  assertEquals(record.normalizedTemperatureC, null);
  assertEquals(record.rejectionReasons, [
    "source_scope_mismatch",
    "instrument_accuracy_insufficient",
    "calibration_error_excessive",
    "calibration_out_of_window",
    "outside_validation_site",
    "depth_outside_protocol",
    "quality_not_good",
  ]);
});

Deno.test("field archive is chunked, service-side, and fails closed", async () => {
  const calls: unknown[][] = [];
  const goodDatabase: PierCastArchiveClient = {
    rpc: (_functionName, arguments_) => {
      const chunk = arguments_.p_records as unknown[];
      calls.push(chunk);
      return Promise.resolve({
        data: { status: "committed", recordCount: chunk.length },
        error: null,
      });
    },
  };
  const records = Array.from(
    { length: 1001 },
    (_, index) =>
      validatePierCastFieldTemperatureObservation({
        ...VALID,
        observedAt: new Date(
          Date.parse(VALID.observedAt) - index * 60_000,
        ).toISOString(),
      }, NOW),
  );
  assertEquals(
    await archivePierCastFieldTemperatureObservations(goodDatabase, records),
    1001,
  );
  assertEquals(calls.map((chunk) => chunk.length), [1000, 1]);

  const failingDatabase: PierCastArchiveClient = {
    rpc: () => Promise.resolve({ data: null, error: { message: "denied" } }),
  };
  await assertRejects(
    () =>
      archivePierCastFieldTemperatureObservations(failingDatabase, [
        records[0],
      ]),
    Error,
    "denied",
  );

  await assertRejects(
    () =>
      archivePierCastFieldTemperatureObservations(goodDatabase, [
        records[0],
        records[0],
      ]),
    Error,
    "duplicate source timestamp",
  );
});

Deno.test("field observation treats invalid archive timestamps as malformed input", () => {
  assertThrows(
    () =>
      validatePierCastFieldTemperatureObservation({
        ...VALID,
        observedAt: "not-a-date",
      }, NOW),
    TypeError,
    "valid ISO dates",
  );
});

Deno.test("field observation migrations are private and preserve structure-specific validation", async () => {
  const migration = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260911180000_create_pier_cast_field_temperature_validation.sql",
      import.meta.url,
    ),
  );
  assertStringIncludes(
    migration,
    "alter table public.pier_cast_field_temperature_observations enable row level security",
  );
  assertStringIncludes(
    migration,
    "revoke all on table public.pier_cast_field_temperature_observations",
  );
  assertStringIncludes(
    migration,
    "auth.role() <> 'service_role'",
  );
  for (
    const cityId of [
      "'ludington_mi'",
      "'grand_haven_mi'",
      "'manistee_mi'",
      "'frankfort_elberta_mi'",
      "'sheboygan_wi'",
    ]
  ) {
    assertStringIncludes(migration, cityId);
  }
  assertStringIncludes(
    migration,
    "never a PierCast runtime fallback",
  );

  const hardeningMigration = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260911183000_harden_pier_cast_field_temperature_validation.sql",
      import.meta.url,
    ),
  );
  assertStringIncludes(
    hardeningMigration,
    "pier_cast_field_temperature_usable_protocol_check",
  );
  assertStringIncludes(
    hardeningMigration,
    "read_pier_cast_field_temperature_validation_pairs",
  );
  assertStringIncludes(
    hardeningMigration,
    "where field.source_id = p_source_id",
  );
  assertStringIncludes(
    hardeningMigration,
    "structures are never blended",
  );
});
