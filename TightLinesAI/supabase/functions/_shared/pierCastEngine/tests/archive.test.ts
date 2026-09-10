import {
  assertEquals,
  assertRejects,
  assertStringIncludes,
} from "jsr:@std/assert";
import {
  archivePierCastLmhofsBatch,
  PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS,
  PIER_CAST_LMHOFS_FORECAST_HOURS,
  type PierCastArchiveClient,
  type PierCastCityId,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
  readLatestFreshPierCastLmhofsBatch,
} from "../index.ts";

const ISSUED_AT = "2026-09-09T18:00:00.000Z";

function completeBatch(): Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
> {
  const cities = Object.entries(PIER_CAST_LMHOFS_CANDIDATE_LOCATIONS).map(
    ([cityId, location]) => {
      const samples: PierCastLmhofsSample[] = PIER_CAST_LMHOFS_FORECAST_HOURS
        .map((forecastHour) => ({
          cityId: cityId as PierCastCityId,
          sourceId: `${cityId}__test`,
          productId: "NOAA_NOS_LMHOFS_REGULARGRID",
          issuedAt: ISSUED_AT,
          forecastHour,
          validAt: new Date(
            Date.parse(ISSUED_AT) + forecastHour * 60 * 60 * 1000,
          ).toISOString(),
          temperatureC: 15,
          rawUnit: "C",
          verticalSelection: "surface",
          depthIndex: 0,
          gridRow: location.gridRow,
          gridColumn: location.gridColumn,
          latitude: location.latitude,
          longitude: location.longitude,
          sourceUrl: `https://example.test/${cityId}/${forecastHour}`,
        }));
      return {
        status: "available" as const,
        cityId: cityId as PierCastCityId,
        sourceId: `${cityId}__test`,
        issuedAt: ISSUED_AT,
        requestedForecastHours: [...PIER_CAST_LMHOFS_FORECAST_HOURS],
        coverageStart: samples[0].validAt,
        coverageEnd: samples[120].validAt,
        samples,
        reasonCodes: [] as const,
      };
    },
  );
  return {
    status: "available",
    issuedAt: ISSUED_AT,
    fetchedAt: "2026-09-10T00:31:46.416Z",
    cycleAgeHours: 6.5,
    fullHorizonRequested: true,
    requestedForecastHours: [...PIER_CAST_LMHOFS_FORECAST_HOURS],
    cities,
    diagnostics: [],
  };
}

Deno.test("archive commits exactly one complete all-five cycle", async () => {
  let calledFunction = "";
  let calledArguments: Record<string, unknown> = {};
  const database: PierCastArchiveClient = {
    rpc: (functionName, arguments_) => {
      calledFunction = functionName;
      calledArguments = arguments_;
      return Promise.resolve({ data: { status: "committed" }, error: null });
    },
  };
  const result = await archivePierCastLmhofsBatch(
    database,
    completeBatch(),
    "pier-cast-simple-model-v0.4.0",
  );

  assertEquals(calledFunction, "commit_pier_cast_lmhofs_cycle");
  assertEquals((calledArguments.p_samples as unknown[]).length, 605);
  assertEquals(
    (calledArguments.p_cycle as { fullHorizonRequested: boolean })
      .fullHorizonRequested,
    true,
  );
  assertEquals(result, {
    issuedAt: ISSUED_AT,
    cityCount: 5,
    sampleCount: 605,
  });
});

Deno.test("archive refuses partial and failed database commits", async () => {
  const database: PierCastArchiveClient = {
    rpc: () => Promise.resolve({ data: null, error: null }),
  };
  const partial = { ...completeBatch(), status: "partial" as const };
  await assertRejects(
    () => archivePierCastLmhofsBatch(database, partial, "test"),
    Error,
    "Only a complete",
  );

  await assertRejects(
    () =>
      archivePierCastLmhofsBatch(
        {
          rpc: () =>
            Promise.resolve({
              data: null,
              error: { message: "database down" },
            }),
        },
        completeBatch(),
        "test",
      ),
    Error,
    "database down",
  );
});

Deno.test("temperature archive migration is private and transaction-gated", async () => {
  const migration = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260910004500_create_pier_cast_temperature_archive.sql",
      import.meta.url,
    ),
  );
  assertStringIncludes(
    migration,
    "alter table public.pier_cast_temperature_samples enable row level security",
  );
  assertStringIncludes(
    migration,
    "PierCast LMHOFS archive requires 121 unique hours for all five cities",
  );
  for (
    const frozenCell of [
      "(sample->>'gridRow')::integer = 235",
      "(sample->>'gridRow')::integer = 146",
      "(sample->>'gridRow')::integer = 265",
      "(sample->>'gridRow')::integer = 303",
      "(sample->>'gridRow')::integer = 215",
    ]
  ) {
    assertStringIncludes(migration, frozenCell);
  }
  assertStringIncludes(
    migration,
    "revoke all on table public.pier_cast_temperature_samples\n  from public, anon, authenticated",
  );
  assertStringIncludes(
    migration,
    "grant execute on function public.commit_pier_cast_lmhofs_cycle(jsonb, jsonb)\n  to service_role",
  );
  assertStringIncludes(
    migration,
    "read_latest_fresh_pier_cast_lmhofs_samples",
  );
  assertStringIncludes(migration, "p_max_age_hours integer default 13");
});

Deno.test("temperature ingestion schedule is private, authenticated, and cycle-aligned", async () => {
  const migration = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260910010000_schedule_pier_cast_temperature_ingestion.sql",
      import.meta.url,
    ),
  );
  assertStringIncludes(
    migration,
    "'35 0,6,12,18 * * *'",
  );
  assertStringIncludes(
    migration,
    "'/functions/v1/pier-cast-ingest'",
  );
  assertStringIncludes(
    migration,
    "'x-pier-cast-internal-key', internal_key",
  );
  assertStringIncludes(migration, "name = 'pier_cast_project_url'");
  assertStringIncludes(migration, "name = 'pier_cast_anon_key'");
  assertStringIncludes(migration, "name = 'pier_cast_internal_key'");
  assertStringIncludes(
    migration,
    "from public, anon, authenticated",
  );
  assertStringIncludes(
    migration,
    "to service_role",
  );
});

Deno.test("calibration observation archive is private, QC-gated, and validation-only", async () => {
  const migration = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260910022000_create_pier_cast_temperature_observation_archive.sql",
      import.meta.url,
    ),
  );
  assertStringIncludes(
    migration,
    "alter table public.pier_cast_temperature_observations enable row level security",
  );
  assertStringIncludes(
    migration,
    "record_status = 'usable' and aggregate_quality_flag = 1",
  );
  assertStringIncludes(
    migration,
    "revoke all on table public.pier_cast_temperature_observations from public, anon, authenticated",
  );
  assertStringIncludes(
    migration,
    "grant execute on function public.commit_pier_cast_temperature_observations(jsonb) to service_role",
  );
  assertStringIncludes(
    migration,
    "read_pier_cast_temperature_validation_pairs",
  );
  assertStringIncludes(
    migration,
    "candidate.record_status = 'usable'",
  );

  const typeFixMigration = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260910122000_fix_pier_cast_temperature_validation_pair_offset_type.sql",
      import.meta.url,
    ),
  );
  assertStringIncludes(
    typeFixMigration,
    ")::double precision",
  );
  assertStringIncludes(
    typeFixMigration,
    "from public, anon, authenticated",
  );
});

Deno.test("archive reader reconstructs only a complete fresh coherent cycle", async () => {
  const sourceBatch = completeBatch();
  const rows = sourceBatch.cities.flatMap((city) =>
    city.samples.map((sample) => ({
      city_id: sample.cityId,
      source_id: sample.sourceId,
      issued_at: sample.issuedAt,
      forecast_hour: sample.forecastHour,
      valid_at: sample.validAt,
      temperature_c: sample.temperatureC,
      raw_unit: sample.rawUnit,
      vertical_selection: sample.verticalSelection,
      depth_index: sample.depthIndex,
      grid_row: sample.gridRow,
      grid_column: sample.gridColumn,
      latitude: sample.latitude,
      longitude: sample.longitude,
      source_url: sample.sourceUrl,
      cycle_fetched_at: sourceBatch.fetchedAt,
      diagnostics: sourceBatch.diagnostics,
    }))
  );
  let calledFunction = "";
  const database: PierCastArchiveClient = {
    rpc: (functionName) => {
      calledFunction = functionName;
      return Promise.resolve({ data: rows, error: null });
    },
  };
  const batch = await readLatestFreshPierCastLmhofsBatch(
    database,
    new Date("2026-09-10T00:45:00Z"),
  );

  assertEquals(
    calledFunction,
    "read_latest_fresh_pier_cast_lmhofs_samples",
  );
  assertEquals(batch?.status, "available");
  assertEquals(batch?.issuedAt, ISSUED_AT);
  assertEquals(batch?.cities.length, 5);
  assertEquals(
    batch?.cities.reduce((sum, city) => sum + city.samples.length, 0),
    605,
  );

  await assertRejects(
    () =>
      readLatestFreshPierCastLmhofsBatch(
        {
          rpc: () => Promise.resolve({ data: rows.slice(1), error: null }),
        },
        new Date("2026-09-10T00:45:00Z"),
      ),
    Error,
    "incomplete",
  );
});
