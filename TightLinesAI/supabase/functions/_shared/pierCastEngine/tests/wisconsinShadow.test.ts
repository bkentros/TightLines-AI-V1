import {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
} from "jsr:@std/assert";
import {
  archivePierCastWisconsinLmhofsBatch,
  archivePierCastWisconsinShadowForecast,
  buildPierCastCatalog,
  buildPierCastWisconsinReviewOutlook,
  buildPierCastWisconsinShadowForecastPayload,
  evaluatePierCastSeasonalOpportunity,
  getPierCastWisconsinTemperatureCurve,
  ingestPierCastWisconsinShadowCycle,
  parsePierCastShadowOutcomeInput,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_FROZEN_CITY_IDS,
  PIER_CAST_WISCONSIN_CITY_IDS,
  PIER_CAST_WISCONSIN_CITY_PROFILES,
  PIER_CAST_WISCONSIN_ROSTER_VERSION,
  PIER_CAST_WISCONSIN_SEASONAL_CURVES,
  PIER_CAST_WISCONSIN_SPECIES_IDS,
  type PierCastArchiveClient,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
  validatePierCastSeasonalOpportunityCurve,
} from "../index.ts";

const ISSUED_AT = "2026-09-14T12:00:00.000Z";

function wisconsinBatch(): Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
> {
  const hours = Array.from({ length: 121 }, (_, hour) => hour);
  const cities = PIER_CAST_WISCONSIN_CITY_PROFILES.map((profile, cityIndex) => {
    const source = profile.waterTemperatureSource!;
    const location = source.configuredLocation!;
    const samples: PierCastLmhofsSample[] = hours.map((forecastHour) => ({
      cityId: profile.cityId,
      sourceId: source.sourceId,
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: ISSUED_AT,
      forecastHour,
      validAt: new Date(
        Date.parse(ISSUED_AT) + forecastHour * 3_600_000,
      ).toISOString(),
      temperatureC: 13 + cityIndex + forecastHour / 240,
      rawUnit: "C",
      verticalSelection: "surface",
      depthIndex: 0,
      gridRow: location.gridRow,
      gridColumn: location.gridColumn,
      latitude: location.latitude,
      longitude: location.longitude,
      sourceUrl: `https://example.test/${profile.cityId}/${forecastHour}`,
    }));
    return {
      status: "available" as const,
      cityId: profile.cityId,
      sourceId: source.sourceId,
      issuedAt: ISSUED_AT,
      requestedForecastHours: hours,
      coverageStart: samples[0].validAt,
      coverageEnd: samples[120].validAt,
      samples,
      reasonCodes: [] as const,
    };
  });
  return {
    status: "available",
    issuedAt: ISSUED_AT,
    fetchedAt: "2026-09-14T12:05:00.000Z",
    cycleAgeHours: 0.25,
    fullHorizonRequested: true,
    requestedForecastHours: hours,
    cities,
    diagnostics: [],
  };
}

Deno.test("Wisconsin cohort is complete in owner review and absent from public release", () => {
  assertEquals(PIER_CAST_FROZEN_CITY_IDS.length, 5);
  assertEquals(PIER_CAST_CITY_PROFILES.length, 5);
  assertEquals(PIER_CAST_WISCONSIN_CITY_PROFILES.length, 4);
  const publicIds = new Set(buildPierCastCatalog("public").cities.map((city) => city.cityId));
  const review = buildPierCastCatalog("review");
  assertEquals(review.cities.length, 9);
  for (const cityId of PIER_CAST_WISCONSIN_CITY_IDS) {
    assertEquals(publicIds.has(cityId), false);
    const city = review.cities.find((candidate) => candidate.cityId === cityId);
    assert(city);
    assertEquals(city.tentative, true);
    assertEquals(city.structures.length, 2);
    assertEquals(city.species.every((row) => !row.ratingEnabled), true);
    assertEquals(
      city.species.filter((row) => row.seasonalOpportunityCurve)
        .map((row) => row.speciesId),
      [...PIER_CAST_WISCONSIN_SPECIES_IDS],
    );
  }
});

Deno.test("new Wisconsin curves are valid year-round and match the reviewed artifact", async () => {
  const artifact = JSON.parse(
    await Deno.readTextFile(
      new URL(
        "../../../../../docs/onboarding/piercast/wisconsin-expansion/seasonal-curves.json",
        import.meta.url,
      ),
    ),
  ) as {
    calibrationVersion: string;
    cities: Record<string, { curves: Record<string, Array<[string, number]>> }>;
  };
  assertEquals(artifact.calibrationVersion, "piercast-wisconsin-seasonal-v0.1.0");
  for (const cityId of ["milwaukee_wi", "racine_wi", "kenosha_wi"] as const) {
    for (const speciesId of PIER_CAST_WISCONSIN_SPECIES_IDS) {
      const curve = PIER_CAST_WISCONSIN_SEASONAL_CURVES[cityId][speciesId];
      assertEquals(validatePierCastSeasonalOpportunityCurve(curve), []);
      assertEquals(
        curve.knots.map((knot) => [knot.monthDay, knot.rating]),
        artifact.cities[cityId].curves[speciesId],
      );
      assertEquals(
        getPierCastWisconsinTemperatureCurve(speciesId)?.calibrationStatus,
        "provisional",
      );
      for (let day = 0; day < 365; day += 1) {
        const localDate = new Date(Date.UTC(2027, 0, 1 + day)).toISOString().slice(0, 10);
        assertEquals(
          evaluatePierCastSeasonalOpportunity({
            ratingEnabled: true,
            mode: "review",
            localDate,
            curve,
          }).status,
          "available",
        );
      }
    }
  }
});

Deno.test("Wisconsin review produces four cities, five days, and eighty forecasts", () => {
  const batch = wisconsinBatch();
  const outlook = buildPierCastWisconsinReviewOutlook({
    batch,
    evaluationTime: "2026-09-14T12:15:00.000Z",
  });
  assertEquals(outlook.speciesRosterVersion, PIER_CAST_WISCONSIN_ROSTER_VERSION);
  assertEquals(outlook.source.cityCount, 4);
  assertEquals(outlook.source.sampleCount, 484);
  assertEquals(outlook.cities.length, 4);
  assertEquals(outlook.cities.every((city) =>
    city.dates.length === 5 && city.dates.every((date) =>
      date.species.length === 4 && date.species.every((species) =>
        species.configurationRatingEnabled === false &&
        species.promotion.status === "blocked"
      )
    )
  ), true);
  const payload = buildPierCastWisconsinShadowForecastPayload({
    outlook,
    batch,
    ingestionSource: "live_lmhofs",
    engineVersion: "test-engine",
  });
  assertEquals(payload.forecasts.length, 80);
  assertEquals(new Set(payload.forecasts.map((row) => row.cityId)).size, 4);
  assertEquals(payload.run.previewOnly, true);
});

Deno.test("Wisconsin archive uses expansion RPCs and rejects partial city timelines", async () => {
  const calls: string[] = [];
  const database: PierCastArchiveClient = {
    rpc: (name) => {
      calls.push(name);
      return Promise.resolve(name === "commit_pier_cast_expansion_shadow_forecast"
        ? { data: { status: "committed", runId: crypto.randomUUID(), forecastCount: 80 }, error: null }
        : { data: { status: "committed" }, error: null });
    },
  };
  const batch = wisconsinBatch();
  await archivePierCastWisconsinLmhofsBatch(database, batch, "test-engine");
  const outlook = buildPierCastWisconsinReviewOutlook({
    batch,
    evaluationTime: "2026-09-14T12:15:00.000Z",
  });
  await archivePierCastWisconsinShadowForecast({
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
  partial.cities[2].samples.pop();
  await assertRejects(
    () => archivePierCastWisconsinLmhofsBatch(database, partial, "test"),
    Error,
    "four complete 121-hour",
  );
  assertThrows(
    () => buildPierCastWisconsinReviewOutlook({
      batch: partial,
      evaluationTime: "2026-09-14T12:15:00.000Z",
    }),
    Error,
    "complete archived all-city cycle",
  );
});

Deno.test("Wisconsin ingestion falls back only to a complete fresh cohort", async () => {
  const batch = wisconsinBatch();
  const outcome = await ingestPierCastWisconsinShadowCycle({
    database: { rpc: () => Promise.resolve({ data: null, error: null }) },
    engineVersion: "test-engine",
    operations: {
      fetchLive: () => Promise.reject(new Error("provider offline")),
      readFreshArchive: () => Promise.resolve(batch),
    },
  });
  assertEquals(outcome.status, "cached_fallback");
  assertEquals(outcome.source, "fresh_archived_complete_cycle");
  assertEquals(outcome.batch?.cities.length, 4);
});

Deno.test("Wisconsin migration enforces exact manifests and replaces the one-city schedule", async () => {
  const sql = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260914190000_wisconsin_pier_cast_shadow_cohort.sql",
      import.meta.url,
    ),
  );
  assert(sql.includes("jsonb_array_length(p_samples) <> expected_count"));
  assert(sql.includes("expected_count := 484"));
  assert(sql.includes("expected_count := 80"));
  assert(sql.includes("count(distinct (item->>'forecastHour')::integer) <> 121"));
  assert(sql.includes("x-pier-cast-operation','wisconsin-shadow'"));
  assert(sql.includes("cron.unschedule(existing_job_id)"));
  assert(sql.includes("'45 0,6,12,18 * * *'"));
});

Deno.test("Wisconsin outcomes admit core four but not conditional perch", () => {
  const common = {
    dedupeKey: "racine-20260914-south-pier-001",
    cityId: "racine_wi",
    localDate: "2026-09-14",
    structureName: "South Pier",
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
  assertEquals(parsePierCastShadowOutcomeInput({ ...common, speciesId: "coho_salmon" }).cityId, "racine_wi");
  assertThrows(
    () => parsePierCastShadowOutcomeInput({ ...common, speciesId: "yellow_perch" }),
    Error,
    "Unsupported PierCast outcome species",
  );
});
