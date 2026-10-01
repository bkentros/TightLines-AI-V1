import { assert, assertEquals, assertRejects } from "jsr:@std/assert";
import {
  archivePierCastPentwaterCasevilleLmhofsBatch,
  buildPierCastCatalog,
  getPierCastV3PairCalibration,
  ingestPierCastPentwaterCasevilleShadowCycle,
  PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS,
  PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES,
  PIER_CAST_PUBLIC_V3_RELEASE,
  PIER_CAST_V3_PAIR_CALIBRATIONS,
  type PierCastLmhofsBatch,
  type PierCastLmhofsSample,
} from "../index.ts";

const admittedCounts = {
  pentwater_mi: 8,
  rogers_city_mi: 7,
  tawas_city_mi: 9,
  charlevoix_mi: 7,
  caseville_mi: 5,
} as const;
type PresentBatch = Extract<
  PierCastLmhofsBatch,
  { status: "available" | "partial" }
>;

Deno.test("Pentwater–Caseville profiles preserve every decision while bluegill stays unconfigured and unserialized", () => {
  assertEquals(PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES.length, 5);
  const review = buildPierCastCatalog("review", "v3");
  assertEquals(review.cities.length, 32);
  for (const city of PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES) {
    assertEquals(city.publicEnabled, false);
    assertEquals(city.tentative, true);
    assertEquals(city.species.length, 19);
    assert(
      city.structures.some((structure) =>
        structure.disposition === "candidate"
      ),
    );
    assert(city.waterTemperatureSource?.configuredLocation);
    assert(city.waterTemperatureSource.configuredLocation.modelBathymetryM > 0);
    assertEquals(
      city.species.filter((row) => row.inheritance === "candidate").length,
      admittedCounts[city.cityId],
    );
    for (const row of city.species) {
      assertEquals(row.ratingEnabled, false);
      assertEquals(
        !!getPierCastV3PairCalibration(city.cityId, row.speciesId),
        row.inheritance === "candidate",
      );
    }
    assertEquals(getPierCastV3PairCalibration(city.cityId, "bluegill"), null);
    const serialized = review.cities.find((candidate) =>
      candidate.cityId === city.cityId
    )!;
    assert(!serialized.species.some((row) => row.speciesId === "bluegill"));
  }
  assertEquals(PIER_CAST_PUBLIC_V3_RELEASE.cityIds.length, 32);
  const publicIds = new Set<string>(PIER_CAST_PUBLIC_V3_RELEASE.cityIds);
  for (const cityId of PIER_CAST_PENTWATER_CASEVILLE_CITY_IDS) {
    assert(publicIds.has(cityId));
    assert(
      buildPierCastCatalog("public", "v3").cities.some((city) =>
        city.cityId === cityId
      ),
    );
  }
});

Deno.test("unresolved access structures never become covered candidates", () => {
  const unresolved = PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES.flatMap((
    city,
  ) =>
    city.structures.filter((structure) =>
      structure.disposition === "unresolved"
    )
  );
  assertEquals(unresolved.length, 3);
  assert(
    unresolved.every((structure) =>
      structure.accessStatus === "route_unverified" &&
      structure.accessRoute === null
    ),
  );
});

Deno.test("Pentwater–Caseville archive freezes five exact wet-cell 121-hour timelines", async () => {
  const source = completeBatch();
  let rpcName = "";
  let archivedSamples = 0;
  const result = await archivePierCastPentwaterCasevilleLmhofsBatch(
    {
      rpc: (name, args) => {
        rpcName = name;
        archivedSamples = Array.isArray(args?.p_samples)
          ? args.p_samples.length
          : 0;
        return Promise.resolve({ data: { status: "committed" }, error: null });
      },
    },
    source,
    "test-engine",
  );
  assertEquals(rpcName, "commit_pier_cast_pentwater_caseville_lmhofs_cycle");
  assertEquals(archivedSamples, 605);
  assertEquals(result.sampleCount, 605);

  const altered = structuredClone(source);
  altered.cities[0].samples[120].gridRow += 1;
  await assertRejects(
    () =>
      archivePierCastPentwaterCasevilleLmhofsBatch(
        { rpc: () => Promise.resolve({ data: null, error: null }) },
        altered,
        "test-engine",
      ),
    Error,
    "samples are inconsistent",
  );
});

Deno.test("Pentwater–Caseville ingestion fails over only to a complete fresh cohort", async () => {
  const cached = completeBatch();
  const result = await ingestPierCastPentwaterCasevilleShadowCycle({
    database: { rpc: () => Promise.resolve({ data: null, error: null }) },
    engineVersion: "test-engine",
    operations: {
      fetchLive: () => Promise.resolve({ ...cached, status: "partial" }),
      readFreshArchive: () => Promise.resolve(cached),
    },
  });
  assertEquals(result.status, "cached_fallback");
  assertEquals(result.batch?.cities.length, 5);
  assertEquals(
    result.batch?.cities.flatMap((city) => city.samples).length,
    605,
  );
});

Deno.test("Pass 3 migration freezes the 32-city manifest and keeps every source ingest ahead of aggregation", async () => {
  const sql = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260921230000_pier_cast_pentwater_caseville_private_pass3_v11.sql",
      import.meta.url,
    ),
  );
  const countFix = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260922003000_pier_cast_pentwater_caseville_v11_forecast_count_fix.sql",
      import.meta.url,
    ),
  );
  const v12 = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260922120000_pier_cast_caseville_species_v12.sql",
      import.meta.url,
    ),
  );
  assert(
    sql.includes(
      "'piercast-v3-twenty-seven-city-st-joseph-harrisville-pass3-v10'",
    ),
  );
  assert(
    sql.includes("'piercast-v3-thirty-two-city-pentwater-caseville-pass3-v11'"),
  );
  assert(sql.includes("jsonb_array_length(p_forecasts)<>1255"));
  assert(
    sql.includes(
      "count(distinct item->>'cityId') from jsonb_array_elements(p_forecasts)item)<>32",
    ),
  );
  assert(
    sql.includes(
      "count(distinct (item->>'cityId',item->>'speciesId')) from jsonb_array_elements(p_forecasts)item)<>251",
    ),
  );
  assert(
    sql.includes("forecast_count in (180,280,350,470,590,845,865,1110,1255)"),
  );
  assert(!countFix.includes("1110"));
  assert(countFix.includes("jsonb_array_length(p_forecasts)<>1255"));
  assert(countFix.includes("true,'blocked',1255"));
  assert(countFix.includes("existing_count<>1255"));
  assert(countFix.includes("select count(*)<>1255"));
  assert(v12.includes("'piercast-v3-thirty-two-city-caseville-species-v12'"));
  assert(v12.includes("jsonb_array_length(p_forecasts)<>1270"));
  assert(v12.includes("true,'blocked',1270"));
  assert(
    v12.includes(
      "count(distinct (item->>'cityId',item->>'speciesId')) from jsonb_array_elements(p_forecasts)item)<>254",
    ),
  );
  assert(v12.includes("('caseville_mi','coho_salmon')"));
  assert(v12.includes("('caseville_mi','steelhead')"));
  assert(v12.includes("('caseville_mi','lake_trout')"));
  assert(sql.includes("'52 0,6,12,18 * * *'"));
  assert(!sql.includes("('pentwater_mi','bluegill')"));
  const expected = v12.match(
    /create or replace function public\.piercast_v3_expected_pairs\(\)[\s\S]*?\$\$;/,
  )?.[0];
  assert(expected);
  const sqlPairs = [...expected.matchAll(/\('([a-z_]+)','([a-z_]+)'\)/g)].map((
    match,
  ) => `${match[1]}/${match[2]}`).sort();
  assertEquals(
    sqlPairs,
    PIER_CAST_V3_PAIR_CALIBRATIONS.map((pair) => pair.pairKey).sort(),
  );

  const scheduleSources = [
    [
      "../../../../migrations/20260910010000_schedule_pier_cast_temperature_ingestion.sql",
      35,
    ],
    [
      "../../../../migrations/20260914190000_wisconsin_pier_cast_shadow_cohort.sql",
      45,
    ],
    [
      "../../../../migrations/20260915230000_expand_pier_cast_v3_lake_huron_manifest.sql",
      50,
    ],
    [
      "../../../../migrations/20260919190000_pier_cast_alpena_species_correction_v9.sql",
      54,
    ],
    [
      "../../../../migrations/20260920220000_pier_cast_st_joseph_harrisville_schedule_fix.sql",
      55,
    ],
    [
      "../../../../migrations/20260921230000_pier_cast_pentwater_caseville_private_pass3_v11.sql",
      52,
    ],
  ] as const;
  for (const [path, minute] of scheduleSources) {
    const migration = await Deno.readTextFile(new URL(path, import.meta.url));
    assert(migration.includes(`'${minute} 0,6,12,18 * * *'`));
    assert(minute < 58, `${path} must run before minute-58 aggregation.`);
  }
  const aggregator = await Deno.readTextFile(
    new URL(
      "../../../../migrations/20260915230000_expand_pier_cast_v3_lake_huron_manifest.sql",
      import.meta.url,
    ),
  );
  assert(aggregator.includes("'58 0,6,12,18 * * *'"));
  assertEquals(58 - 52, 6);
});

function completeBatch(): PresentBatch & { status: "available" } {
  const issuedAt = "2026-09-21T12:00:00.000Z";
  const hours = Array.from({ length: 121 }, (_, hour) => hour);
  return {
    status: "available",
    issuedAt,
    fetchedAt: "2026-09-21T12:05:00.000Z",
    cycleAgeHours: 0.25,
    fullHorizonRequested: true,
    requestedForecastHours: hours,
    diagnostics: [],
    cities: PIER_CAST_PENTWATER_CASEVILLE_CITY_PROFILES.map((city) => {
      const source = city.waterTemperatureSource!;
      const location = source.configuredLocation!;
      const samples: PierCastLmhofsSample[] = hours.map((forecastHour) => ({
        cityId: city.cityId,
        sourceId: source.sourceId,
        productId: "NOAA_NOS_LMHOFS_REGULARGRID",
        issuedAt,
        forecastHour,
        validAt: new Date(Date.parse(issuedAt) + forecastHour * 3_600_000)
          .toISOString(),
        temperatureC: 14,
        rawUnit: "C",
        verticalSelection: "surface",
        depthIndex: 0,
        gridRow: location.gridRow,
        gridColumn: location.gridColumn,
        latitude: location.latitude,
        longitude: location.longitude,
        sourceUrl: `https://example.test/${city.cityId}/${forecastHour}`,
      }));
      return {
        status: "available" as const,
        cityId: city.cityId,
        sourceId: source.sourceId,
        issuedAt,
        requestedForecastHours: hours,
        coverageStart: samples[0].validAt,
        coverageEnd: samples[120].validAt,
        samples,
        reasonCodes: [] as const,
      };
    }),
  };
}
