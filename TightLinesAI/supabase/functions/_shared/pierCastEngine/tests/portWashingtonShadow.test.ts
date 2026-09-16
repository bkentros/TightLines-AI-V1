import {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
} from "jsr:@std/assert";
import {
  archivePierCastPortWashingtonLmhofsBatch,
  archivePierCastPortWashingtonShadowForecast,
  buildPierCastCatalog,
  buildPierCastPortWashingtonReviewOutlook,
  buildPierCastPortWashingtonShadowForecastPayload,
  evaluatePierCastSeasonalOpportunity,
  getPierCastPortWashingtonTemperatureCurve,
  ingestPierCastPortWashingtonShadowCycle,
  parsePierCastShadowOutcomeInput,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_FROZEN_CITY_IDS,
  PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION,
  PIER_CAST_PORT_WASHINGTON_PROFILE,
  PIER_CAST_PORT_WASHINGTON_ROSTER_VERSION,
  PIER_CAST_PORT_WASHINGTON_SEASONAL_CURVES,
  PIER_CAST_PORT_WASHINGTON_SPECIES_IDS,
  type PierCastArchiveClient,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
  validatePierCastSeasonalOpportunityCurve,
} from "../index.ts";

const ISSUED_AT = "2026-09-14T06:00:00.000Z";

function portWashingtonBatch(): Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
> {
  const hours = Array.from({ length: 121 }, (_, hour) => hour);
  const samples: PierCastLmhofsSample[] = hours.map((forecastHour) => ({
    cityId: "port_washington_wi",
    sourceId: PIER_CAST_PORT_WASHINGTON_PROFILE.waterTemperatureSource!
      .sourceId,
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    issuedAt: ISSUED_AT,
    forecastHour,
    validAt: new Date(
      Date.parse(ISSUED_AT) + forecastHour * 3_600_000,
    ).toISOString(),
    temperatureC: 14 + forecastHour / 120,
    rawUnit: "C",
    verticalSelection: "surface",
    depthIndex: 0,
    gridRow: PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION.gridRow,
    gridColumn: PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION.gridColumn,
    latitude: PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION.latitude,
    longitude: PIER_CAST_PORT_WASHINGTON_LMHOFS_LOCATION.longitude,
    sourceUrl: `https://example.test/port-washington/${forecastHour}`,
  }));
  return {
    status: "available",
    issuedAt: ISSUED_AT,
    fetchedAt: "2026-09-14T12:05:00.000Z",
    cycleAgeHours: 6.25,
    fullHorizonRequested: true,
    requestedForecastHours: hours,
    cities: [{
      status: "available",
      cityId: "port_washington_wi",
      sourceId: samples[0].sourceId,
      issuedAt: ISSUED_AT,
      requestedForecastHours: hours,
      coverageStart: samples[0].validAt,
      coverageEnd: samples[120].validAt,
      samples,
      reasonCodes: [],
    }],
    diagnostics: [],
  };
}

Deno.test("Port Washington is discoverable without a public score or report", () => {
  assertEquals(PIER_CAST_FROZEN_CITY_IDS.length, 5);
  assertEquals(PIER_CAST_CITY_PROFILES.length, 5);
  const publicCity = buildPierCastCatalog("public").cities.find((city) =>
    city.cityId === "port_washington_wi"
  );
  assertEquals(publicCity?.releaseStatus, "research_only");
  assertEquals(publicCity?.species, []);
  const candidate = buildPierCastCatalog("review").cities.find((city) =>
    city.cityId === "port_washington_wi"
  );
  assert(candidate);
  assertEquals(candidate.tentative, true);
  assertEquals(candidate.structures.length, 2);
  assertEquals(
    candidate.species.filter((row) => row.seasonalOpportunityCurve)
      .map((row) => row.speciesId),
    [...PIER_CAST_PORT_WASHINGTON_SPECIES_IDS],
  );
  assertEquals(candidate.species.every((row) => !row.ratingEnabled), true);
});

Deno.test("Port Washington curves are valid, distinct and explicitly provisional", () => {
  const curveIds = new Set<string>();
  for (const speciesId of PIER_CAST_PORT_WASHINGTON_SPECIES_IDS) {
    const seasonal = PIER_CAST_PORT_WASHINGTON_SEASONAL_CURVES[speciesId];
    assertEquals(validatePierCastSeasonalOpportunityCurve(seasonal), []);
    assertEquals(seasonal.calibrationStatus, "provisional");
    assert(!curveIds.has(seasonal.curveId));
    curveIds.add(seasonal.curveId);
    assertEquals(
      getPierCastPortWashingtonTemperatureCurve(speciesId)
        ?.calibrationStatus,
      "provisional",
    );
  }
});

Deno.test("Port Washington runtime curves exactly match the reviewed research artifact", async () => {
  const artifact = JSON.parse(
    await Deno.readTextFile(
      new URL(
        "../../../../../docs/onboarding/piercast/port-washington/seasonal-curves.json",
        import.meta.url,
      ),
    ),
  ) as {
    calibrationVersion: string;
    curves: Record<string, Array<[string, number]>>;
  };
  assertEquals(
    artifact.calibrationVersion,
    "piercast-port-washington-seasonal-v0.1.0",
  );
  for (const speciesId of PIER_CAST_PORT_WASHINGTON_SPECIES_IDS) {
    assertEquals(
      PIER_CAST_PORT_WASHINGTON_SEASONAL_CURVES[speciesId].knots.map((
        knot,
      ) => [knot.monthDay, knot.rating]),
      artifact.curves[speciesId],
    );
    for (let day = 0; day < 365; day += 1) {
      const localDate = new Date(Date.UTC(2027, 0, 1 + day)).toISOString()
        .slice(0, 10);
      assertEquals(
        evaluatePierCastSeasonalOpportunity({
          ratingEnabled: true,
          mode: "review",
          localDate,
          curve: PIER_CAST_PORT_WASHINGTON_SEASONAL_CURVES[speciesId],
        }).status,
        "available",
      );
    }
  }
});

Deno.test("Port Washington review creates one five-day four-species blocked cohort", () => {
  const batch = portWashingtonBatch();
  const outlook = buildPierCastPortWashingtonReviewOutlook({
    batch,
    evaluationTime: "2026-09-14T12:15:00.000Z",
  });
  assertEquals(
    outlook.speciesRosterVersion,
    PIER_CAST_PORT_WASHINGTON_ROSTER_VERSION,
  );
  assertEquals(outlook.source.cityCount, 1);
  assertEquals(outlook.source.sampleCount, 121);
  assertEquals(outlook.cities.length, 1);
  assertEquals(outlook.cities[0].dates.length, 5);
  assertEquals(
    outlook.cities[0].dates.every((date) =>
      date.species.length === 4 &&
      date.species.every((species) =>
        species.configurationRatingEnabled === false &&
        species.promotion.status === "blocked"
      )
    ),
    true,
  );
  const payload = buildPierCastPortWashingtonShadowForecastPayload({
    outlook,
    batch,
    ingestionSource: "live_lmhofs",
    engineVersion: "test-engine",
  });
  assertEquals(payload.forecasts.length, 20);
  assertEquals(new Set(payload.forecasts.map((row) => row.speciesId)).size, 4);
  assertEquals(payload.run.previewOnly, true);
});

Deno.test("Port Washington archives use only expansion RPCs and fail partial cycles closed", async () => {
  const calls: string[] = [];
  const database: PierCastArchiveClient = {
    rpc: (name) => {
      calls.push(name);
      if (name === "commit_pier_cast_expansion_shadow_forecast") {
        return Promise.resolve({
          data: {
            status: "committed",
            runId: crypto.randomUUID(),
            forecastCount: 20,
          },
          error: null,
        });
      }
      return Promise.resolve({ data: { status: "committed" }, error: null });
    },
  };
  const batch = portWashingtonBatch();
  await archivePierCastPortWashingtonLmhofsBatch(
    database,
    batch,
    "test-engine",
  );
  const outlook = buildPierCastPortWashingtonReviewOutlook({
    batch,
    evaluationTime: "2026-09-14T12:15:00.000Z",
  });
  await archivePierCastPortWashingtonShadowForecast({
    database,
    outlook,
    batch,
    ingestionSource: "live_lmhofs",
    engineVersion: "test-engine",
  });
  assertEquals(calls, [
    "commit_pier_cast_expansion_lmhofs_cycle",
    "commit_pier_cast_expansion_shadow_forecast",
  ]);

  const partial = structuredClone(batch);
  partial.cities[0].samples.pop();
  await assertRejects(
    () => archivePierCastPortWashingtonLmhofsBatch(database, partial, "test"),
    Error,
    "complete 121-hour cycle",
  );
  assertThrows(
    () =>
      buildPierCastPortWashingtonReviewOutlook({
        batch: partial,
        evaluationTime: "2026-09-14T12:15:00.000Z",
      }),
    Error,
    "complete archived all-city cycle",
  );
});

Deno.test("Port Washington ingestion falls back only to its fresh expansion archive", async () => {
  const batch = portWashingtonBatch();
  const outcome = await ingestPierCastPortWashingtonShadowCycle({
    database: { rpc: () => Promise.resolve({ data: null, error: null }) },
    engineVersion: "test-engine",
    operations: {
      fetchLive: () => Promise.reject(new Error("provider offline")),
      readFreshArchive: () => Promise.resolve(batch),
    },
  });
  assertEquals(outcome.status, "cached_fallback");
  assertEquals(outcome.source, "fresh_archived_complete_cycle");
  assertEquals(outcome.batch?.cities[0].cityId, "port_washington_wi");
});

Deno.test("Port Washington migration is private, exact and scheduled separately", async () => {
  const sql = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260914120000_port_washington_pier_cast_shadow_pilot.sql",
      import.meta.url,
    ),
  );
  assert(sql.includes("jsonb_array_length(p_samples) <> 121"));
  assert(sql.includes("jsonb_array_length(p_forecasts) <> 20"));
  assert(sql.includes("pier_cast_shadow_outcomes_species_id_check"));
  assert(sql.includes("grid_row = 179"));
  assert(sql.includes("grid_column = 21"));
  assert(sql.includes("enable row level security"));
  assert(sql.includes("x-pier-cast-operation','port-washington-shadow'"));
  assert(sql.includes("'45 0,6,12,18 * * *'"));
  assert(sql.includes("from public, anon, authenticated"));
});

Deno.test("Port Washington outcomes admit only the four shadow species", () => {
  const common = {
    dedupeKey: "port-washington-20260914-001",
    cityId: "port_washington_wi",
    localDate: "2026-09-14",
    structureName: "Harbor Breakwalls / North Pier",
    observedAt: "2026-09-14T13:00:00.000Z",
    assessmentStatus: "assessable",
    result: "zero_catch",
    effortMinutes: 120,
    catchCount: 0,
    sourceType: "owner_trip",
    evidenceQuality: "direct_effort",
    sourceReference: null,
    notes: null,
  };
  assertEquals(
    parsePierCastShadowOutcomeInput({
      ...common,
      speciesId: "coho_salmon",
    }).cityId,
    "port_washington_wi",
  );
  assertThrows(
    () =>
      parsePierCastShadowOutcomeInput({
        ...common,
        speciesId: "yellow_perch",
      }),
    Error,
    "Unsupported PierCast outcome species",
  );
});
