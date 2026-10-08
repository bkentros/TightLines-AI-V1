import { assertEquals } from "jsr:@std/assert";
import { buildPierCastReviewOutlook } from "../_shared/pierCastEngine/index.ts";
import type { PierCastV3ReviewOutlookResponse } from "../_shared/pierCastEngine/pipeline/v3ReviewOutlook.ts";
import { completeLmhofsBatch } from "../_shared/pierCastEngine/tests/fixtures/lmhofs.ts";
import {
  createPierCastHandler,
  type PierCastHandlerDependencies,
} from "./handler.ts";
import { PIER_CAST_EXPIRED_FORECAST_MESSAGE } from "./outageFallback.ts";
import { PierCastAccessError } from "./reportAccess.ts";

function request(path: string, method = "GET", body?: unknown): Request {
  return new Request(`https://example.test/functions/v1/pier-cast/${path}`, {
    method,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: body === undefined
      ? undefined
      : { "Content-Type": "application/json" },
  });
}

function dependencies(input?: {
  authorized?: boolean;
  readReviewOutlook?: () => Promise<ReturnType<typeof reviewOutlook> | null>;
  readExpansionReviewOutlook?: () => Promise<
    ReturnType<typeof reviewOutlook> | null
  >;
  readV3ReviewOutlook?: () => Promise<PierCastV3ReviewOutlookResponse | null>;
  readTemperatureMap?: PierCastHandlerDependencies["readTemperatureMap"];
  readLeaderboard?: PierCastHandlerDependencies["readLeaderboard"];
  readCityReport?: PierCastHandlerDependencies["readCityReport"];
  readSavedReport?: PierCastHandlerDependencies["readSavedReport"];
  recordLegacyRouteUse?: PierCastHandlerDependencies["recordLegacyRouteUse"];
  readMapFoundation?: PierCastHandlerDependencies["readMapFoundation"];
  readConditionsLeaderboard?:
    PierCastHandlerDependencies["readConditionsLeaderboard"];
  readConditionsCatalog?: PierCastHandlerDependencies["readConditionsCatalog"];
  readConditionsMap?: PierCastHandlerDependencies["readConditionsMap"];
  readObservedTemperatureMap?:
    PierCastHandlerDependencies["readObservedTemperatureMap"];
  readConditionsCityReport?:
    PierCastHandlerDependencies["readConditionsCityReport"];
  readSavedConditionsReport?:
    PierCastHandlerDependencies["readSavedConditionsReport"];
  readV4ReviewOutlook?: PierCastHandlerDependencies["readV4ReviewOutlook"];
}) {
  return {
    authorizeReview: () => Promise.resolve(input?.authorized ?? true),
    readReviewOutlook: input?.readReviewOutlook ??
      (() => Promise.resolve(reviewOutlook())),
    readExpansionReviewOutlook: input?.readExpansionReviewOutlook ??
      (() => Promise.resolve(null)),
    readV3ReviewOutlook: input?.readV3ReviewOutlook ??
      (() => Promise.resolve(null)),
    readTemperatureMap: input?.readTemperatureMap,
    readLeaderboard: input?.readLeaderboard,
    readCityReport: input?.readCityReport,
    readSavedReport: input?.readSavedReport,
    recordLegacyRouteUse: input?.recordLegacyRouteUse,
    readMapFoundation: input?.readMapFoundation,
    readConditionsLeaderboard: input?.readConditionsLeaderboard,
    readConditionsCatalog: input?.readConditionsCatalog,
    readConditionsMap: input?.readConditionsMap,
    readObservedTemperatureMap: input?.readObservedTemperatureMap,
    readConditionsCityReport: input?.readConditionsCityReport,
    readSavedConditionsReport: input?.readSavedConditionsReport,
    readV4ReviewOutlook: input?.readV4ReviewOutlook,
    readShadowReview: () =>
      Promise.resolve({
        status: "private_shadow_validation" as const,
        runCount: 1,
        forecastCount: 100,
        outcomeCount: 0,
        pairedForecastCount: 0,
        latestRun: null,
        outcomeCandidates: [],
        recentOutcomes: [],
      }),
    recordShadowOutcome: () =>
      Promise.resolve({
        status: "committed" as const,
        outcomeId: "850753b5-83bf-4a2f-b28f-3ec866ee6f6d",
      }),
  };
}

Deno.test("conditions v4 routes require species only where ranking/report needs it", async () => {
  const leaderboardReads: Array<string | null> = [];
  const mapReads: Array<string | null> = [];
  const reportReads: Array<[string, string]> = [];
  const handler = createPierCastHandler(dependencies({
    readConditionsLeaderboard: (speciesId) => {
      leaderboardReads.push(speciesId);
      return Promise.resolve({
        schemaVersion: "piercast-conditions-v4",
        formulaVersion: "seasonal-outlook-plus-thermal-match-v1",
        rankingVersion: "species-seasonal-band-then-thermal-v1",
        generatedAt: "2026-09-27T12:00:00Z",
        selectedSpeciesId: speciesId,
        selectionRequired: speciesId === null,
        targetSpecies: [],
        cities: [],
        disclosure: "test",
      } as never);
    },
    readConditionsCityReport: (_request, cityId, speciesId) => {
      reportReads.push([cityId, speciesId]);
      return Promise.resolve({ status: "ok" });
    },
    readConditionsMap: (speciesId) => {
      mapReads.push(speciesId);
      return Promise.resolve({
        schemaVersion: "piercast-conditions-v4",
        selectedSpeciesId: speciesId,
        selectionRequiredForMatch: speciesId === null,
        targetSpecies: [],
        cities: [],
      } as never);
    },
    readSavedConditionsReport: (_request, speciesId) =>
      Promise.resolve({ status: "empty", envelope: null, speciesId }),
  }));

  const unselected = await handler(request("conditions/leaderboard"));
  assertEquals(unselected.status, 200);
  assertEquals(unselected.headers.get("X-PierCast-Contract"), "conditions-v4");
  assertEquals(unselected.headers.get("Deprecation"), null);
  assertEquals((await unselected.json()).selectionRequired, true);
  const selected = await handler(request(
    "conditions/leaderboard?speciesId=chinook_salmon",
  ));
  assertEquals(selected.status, 200);
  assertEquals(leaderboardReads, [null, "chinook_salmon"]);
  const unselectedMap = await handler(request("conditions/map"));
  assertEquals(unselectedMap.status, 200);
  assertEquals((await unselectedMap.json()).selectionRequiredForMatch, true);
  const selectedMap = await handler(request(
    "conditions/map?speciesId=coho_salmon",
  ));
  assertEquals(selectedMap.status, 200);
  assertEquals(
    selectedMap.headers.get("Cache-Control"),
    "public, max-age=300, s-maxage=900, stale-while-revalidate=21600",
  );
  assertEquals(mapReads, [null, "coho_salmon"]);

  assertEquals(
    (await handler(request("conditions/report?cityId=grand_haven_mi"))).status,
    400,
  );
  const report = await handler(request(
    "conditions/report?cityId=grand_haven_mi&speciesId=chinook_salmon",
  ));
  assertEquals(report.status, 200);
  assertEquals(reportReads, [["grand_haven_mi", "chinook_salmon"]]);
  assertEquals(
    (await handler(request("conditions/leaderboard?speciesId=bad-value")))
      .status,
    400,
  );
  assertEquals(
    (await handler(request("conditions/map?speciesId=bad-value"))).status,
    400,
  );
  assertEquals(
    (await handler(request("conditions/saved-report?speciesId=coho_salmon")))
      .status,
    200,
  );
  assertEquals(
    (await handler(request("conditions/leaderboard", "POST"))).status,
    405,
  );
});

Deno.test("conditions catalog omits retired score metadata and is cacheable", async () => {
  const handler = createPierCastHandler(dependencies({
    readConditionsCatalog: () => ({
      schemaVersion: "piercast-conditions-catalog-v2",
      disclosure: "test",
      cities: [],
    }),
  }));
  const response = await handler(request("conditions/catalog"));
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(response.headers.get("X-PierCast-Contract"), "conditions-v4");
  assertEquals(
    response.headers.get("Cache-Control"),
    "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
  );
  assertEquals(body.schemaVersion, "piercast-conditions-catalog-v2");
  assertEquals("ratingName" in body, false);
  assertEquals("formulaVersion" in body, false);
});

Deno.test("expired NOAA data keeps the existing error shape with clear copy", async () => {
  const expired = () => {
    throw new PierCastAccessError(
      "pier_cast_conditions_unavailable",
      PIER_CAST_EXPIRED_FORECAST_MESSAGE,
      503,
    );
  };
  const handler = createPierCastHandler(dependencies({
    readConditionsLeaderboard: expired,
    readConditionsMap: expired,
    readConditionsCityReport: expired,
  }));
  for (
    const path of [
      "conditions/leaderboard?speciesId=chinook_salmon",
      "conditions/map?speciesId=chinook_salmon",
      "conditions/report?cityId=grand_haven_mi&speciesId=chinook_salmon",
    ]
  ) {
    const response = await handler(request(path));
    assertEquals(response.status, 503);
    assertEquals(await response.json(), {
      error: "pier_cast_conditions_unavailable",
      message: PIER_CAST_EXPIRED_FORECAST_MESSAGE,
    });
  }
});

Deno.test("legacy score routes stay compatible, declare deprecation, and emit telemetry", async () => {
  const events: string[] = [];
  const handler = createPierCastHandler(dependencies({
    readLeaderboard: () => Promise.resolve({ mode: "legacy" } as never),
    readTemperatureMap: () => Promise.resolve({ mode: "legacy" } as never),
    readCityReport: () => Promise.resolve({ mode: "legacy" }),
    readSavedReport: () => Promise.resolve({ report: null }),
    recordLegacyRouteUse: (route) => {
      events.push(route);
    },
  }));

  for (
    const path of [
      "leaderboard",
      "temperature-map",
      "report?cityId=grand_haven_mi",
      "saved-report",
    ]
  ) {
    const response = await handler(request(path));
    assertEquals(response.status, 200);
    assertEquals(response.headers.get("Deprecation"), "true");
    assertEquals(
      response.headers.get("X-PierCast-Contract"),
      "score-v3-compatibility",
    );
    assertEquals(
      response.headers.get("X-PierCast-Replacement"),
      "conditions-v4",
    );
  }
  assertEquals(events, [
    "leaderboard",
    "temperature-map",
    "report",
    "saved-report",
  ]);
});

Deno.test("legacy telemetry failure never breaks compatibility reads", async () => {
  const handler = createPierCastHandler(dependencies({
    readLeaderboard: () => Promise.resolve({ mode: "legacy" } as never),
    recordLegacyRouteUse: () => {
      throw new Error("monitor unavailable");
    },
  }));
  const response = await handler(request("leaderboard"));
  assertEquals(response.status, 200);
  assertEquals(response.headers.get("Deprecation"), "true");
});

Deno.test("conditions v4 shadow review is owner-only and additive to v3", async () => {
  let reads = 0;
  const forbidden = createPierCastHandler(dependencies({
    authorized: false,
    readV4ReviewOutlook: () => {
      reads += 1;
      return Promise.resolve({} as never);
    },
  }));
  assertEquals((await forbidden(request("review/v4/outlook"))).status, 403);
  assertEquals(reads, 0);

  const allowed = createPierCastHandler(dependencies({
    readV4ReviewOutlook: () => {
      reads += 1;
      return Promise.resolve({
        outlook: { schemaVersion: "piercast-conditions-v4" },
        shadowComparison: { comparedPairCount: 254 },
      } as never);
    },
  }));
  const response = await allowed(request("review/v4/outlook"));
  assertEquals(response.status, 200);
  assertEquals((await response.json()).shadowComparison.comparedPairCount, 254);
  assertEquals(reads, 1);
});

function reviewOutlook() {
  return buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-10T00:30:00.000Z",
  });
}

Deno.test("public PierCast catalog exposes the approved research roster", async () => {
  const handler = createPierCastHandler(dependencies());
  const response = await handler(request("catalog"));
  assertEquals(response.status, 200);
  const body = await response.json();
  assertEquals(body.mode, "public");
  assertEquals(body.ratingName, "FinFindr Opportunity Rating");
  assertEquals(body.ratingDisplayFormat, "X.X/10");
  assertEquals(
    body.formulaVersion,
    "seasonal-opportunity-bounded-temperature-v2",
  );
  assertEquals(body.cities.length, 12);
  assertEquals(
    body.cities.map((c: { species: unknown[] }) => c.species.length),
    [6, 6, 8, 4, 4, 0, 0, 0, 0, 0, 0, 0],
  );
  assertEquals(
    body.cities.map((c: { releaseStatus: string }) => c.releaseStatus),
    [
      ...Array(5).fill("public_research"),
      ...Array(7).fill("research_only"),
    ],
  );
});

Deno.test("owner-review catalog requires authorization", async () => {
  let reads = 0;
  const handler = createPierCastHandler(dependencies({
    authorized: false,
    readReviewOutlook: () => {
      reads += 1;
      return Promise.resolve(reviewOutlook());
    },
  }));
  const response = await handler(request("review/catalog"));
  assertEquals(response.status, 403);
  assertEquals((await response.json()).error, "pier_cast_review_forbidden");
  const outlookResponse = await handler(request("review/outlook"));
  assertEquals(outlookResponse.status, 403);
  assertEquals(
    (await outlookResponse.json()).error,
    "pier_cast_review_forbidden",
  );
  assertEquals(reads, 0);
});

Deno.test("authorized owner-review catalog includes all thirty-two cities", async () => {
  const handler = createPierCastHandler(dependencies());
  const response = await handler(request("review/catalog"));
  assertEquals(response.status, 200);
  const body = await response.json();
  assertEquals(body.mode, "review");
  assertEquals(body.cities.length, 32);
  assertEquals(
    body.formulaVersion,
    "piercast-opportunity-modes-bounded-temperature-v3",
  );
  assertEquals(
    ["port_washington_wi", "milwaukee_wi", "racine_wi", "kenosha_wi"].every(
      (cityId) =>
        body.cities.some((city: { cityId: string }) => city.cityId === cityId),
    ),
    true,
  );
  assertEquals(
    [
      "two_rivers_wi",
      "kewaunee_wi",
      "algoma_wi",
      "manitowoc_wi",
      "waukegan_il",
      "chicago_il",
      "michigan_city_in",
      "muskegon_mi",
      "whitehall_mi",
      "alpena_mi",
      "st_joseph_mi",
      "south_haven_mi",
      "holland_mi",
      "lexington_mi",
      "harrisville_mi",
    ]
      .every((cityId) =>
        body.cities.some((city: { cityId: string }) => city.cityId === cityId)
      ),
    true,
  );
  assertEquals(
    ["harbor_beach_mi", "oscoda_mi", "port_sanilac_mi"].every((cityId) =>
      body.cities.some((city: { cityId: string }) => city.cityId === cityId)
    ),
    true,
  );
  assertEquals(
    body.cities.find((city: { cityId: string }) =>
      city.cityId === "port_washington_wi"
    )?.species.filter((species: { seasonalOpportunityCurve: unknown }) =>
      species.seasonalOpportunityCurve !== null
    ).length,
    4,
  );
  assertEquals(
    body.cities.every((city: { releaseStatus: string }) =>
      city.releaseStatus === "research_only"
    ),
    true,
  );
  assertEquals(
    body.cities.every((city: {
      waterTemperatureSource: {
        productId: string;
        configuredLocation: {
          gridCellStatus: string;
          depthIndex: number;
        } | null;
        fallbackPolicy: string;
      };
    }) =>
      city.waterTemperatureSource.productId ===
        "NOAA_NOS_LMHOFS_REGULARGRID" &&
      city.waterTemperatureSource.configuredLocation?.gridCellStatus ===
        "candidate" &&
      city.waterTemperatureSource.configuredLocation?.depthIndex === 0 &&
      city.waterTemperatureSource.fallbackPolicy === "unavailable"
    ),
    true,
  );
  assertEquals(
    body.cities.flatMap((city: {
      species: Array<{
        ratingEnabled: boolean;
        seasonalOpportunityCurve: unknown;
      }>;
    }) => city.species).filter((species: {
      ratingEnabled: boolean;
      seasonalOpportunityCurve: unknown;
    }) => !species.ratingEnabled && species.seasonalOpportunityCurve !== null)
      .length,
    44,
  );
});

Deno.test("review authorization failures fail closed", async () => {
  const handler = createPierCastHandler({
    ...dependencies(),
    authorizeReview: () => Promise.reject(new Error("auth offline")),
  });
  const response = await handler(request("review/catalog"));
  assertEquals(response.status, 503);
  assertEquals(
    (await response.json()).error,
    "pier_cast_review_access_unavailable",
  );
});

Deno.test("authorized owner-review outlook returns real disabled-preview ratings", async () => {
  const handler = createPierCastHandler(dependencies());
  const response = await handler(request("review/outlook"));
  const body = await response.json();
  assertEquals(response.status, 200);
  assertEquals(body.mode, "review");
  assertEquals(body.previewOnly, true);
  assertEquals(body.source.sampleCount, 605);
  assertEquals(body.cities.length, 5);
  assertEquals(body.cities[0].dates.length, 5);
  assertEquals(body.cities[0].dates[0].species.length, 6);
  assertEquals(
    body.cities[0].temperatureEvents.detectorVersion,
    "piercast-temperature-events-v1",
  );
  assertEquals(body.cities[0].temperatureEvents.events, []);
  assertEquals(
    body.cities.every((city: { representationDecision: string }) =>
      city.representationDecision === "blocked_insufficient_evidence"
    ),
    true,
  );
});

Deno.test("Port Washington expansion outlook is authorization-gated and isolated", async () => {
  let reads = 0;
  const forbidden = createPierCastHandler(dependencies({
    authorized: false,
    readExpansionReviewOutlook: () => {
      reads += 1;
      return Promise.resolve(reviewOutlook());
    },
  }));
  assertEquals(
    (await forbidden(request("review/expansion/outlook"))).status,
    403,
  );
  assertEquals(reads, 0);

  const unavailable = createPierCastHandler(dependencies());
  const response = await unavailable(request("review/expansion/outlook"));
  assertEquals(response.status, 503);
  assertEquals(
    (await response.json()).error,
    "pier_cast_expansion_outlook_unavailable",
  );
});

Deno.test("Formula v3 review route is owner-only and fails closed without a coherent cycle", async () => {
  let reads = 0;
  const forbidden = createPierCastHandler(dependencies({
    authorized: false,
    readV3ReviewOutlook: () => {
      reads += 1;
      return Promise.resolve(null);
    },
  }));
  assertEquals((await forbidden(request("review/v3/outlook"))).status, 403);
  assertEquals(reads, 0);

  const unavailable = createPierCastHandler(dependencies());
  const response = await unavailable(request("review/v3/outlook"));
  assertEquals(response.status, 503);
  assertEquals(
    (await response.json()).error,
    "pier_cast_v3_outlook_unavailable",
  );
  assertEquals(
    (await unavailable(request("review/v3/outlook", "POST"))).status,
    405,
  );
});

Deno.test("owner-review outlook fails closed when no fresh complete cycle exists", async () => {
  const missingHandler = createPierCastHandler(dependencies({
    readReviewOutlook: () => Promise.resolve(null),
  }));
  const missingResponse = await missingHandler(request("review/outlook"));
  assertEquals(missingResponse.status, 503);
  assertEquals(
    (await missingResponse.json()).error,
    "pier_cast_review_outlook_unavailable",
  );

  const failedHandler = createPierCastHandler(dependencies({
    readReviewOutlook: () => Promise.reject(new Error("archive failed")),
  }));
  const failedResponse = await failedHandler(request("review/outlook"));
  assertEquals(failedResponse.status, 503);
  assertEquals(
    (await failedResponse.json()).error,
    "pier_cast_review_outlook_failed",
  );
});

Deno.test("owner shadow status and outcome entry require authorization", async () => {
  const forbidden = createPierCastHandler(dependencies({ authorized: false }));
  assertEquals((await forbidden(request("review/shadow"))).status, 403);
  assertEquals(
    (await forbidden(request("review/outcomes", "POST", {}))).status,
    403,
  );

  const handler = createPierCastHandler(dependencies());
  const statusResponse = await handler(request("review/shadow"));
  const statusBody = await statusResponse.json();
  assertEquals(statusResponse.status, 200);
  assertEquals(statusBody.runCount, 1);
  assertEquals(statusBody.forecastCount, 100);

  const outcomeResponse = await handler(request("review/outcomes", "POST", {
    dedupeKey: "owner-trip-20260910-0001",
    cityId: "grand_haven_mi",
    speciesId: "brown_trout",
    localDate: "2026-09-10",
    structureName: "Grand Haven South Pier",
    observedAt: null,
    assessmentStatus: "assessable",
    result: "zero_catch",
    effortMinutes: 120,
    catchCount: 0,
    sourceType: "owner_trip",
    evidenceQuality: "direct_effort",
    sourceReference: null,
    notes: null,
  }));
  assertEquals(outcomeResponse.status, 201);
  assertEquals((await outcomeResponse.json()).status, "committed");
});

Deno.test("owner outcome entry rejects invalid negatives before storage", async () => {
  let commitCalls = 0;
  const configured = dependencies();
  const handler = createPierCastHandler({
    ...configured,
    recordShadowOutcome: (outcome) => {
      commitCalls += 1;
      void outcome;
      return Promise.resolve({
        status: "committed" as const,
        outcomeId: "850753b5-83bf-4a2f-b28f-3ec866ee6f6d",
      });
    },
  });
  const response = await handler(request("review/outcomes", "POST", {
    dedupeKey: "owner-trip-20260910-0002",
    cityId: "grand_haven_mi",
    speciesId: "brown_trout",
    localDate: "2026-09-10",
    structureName: "Grand Haven South Pier",
    observedAt: null,
    assessmentStatus: "assessable",
    result: "zero_catch",
    effortMinutes: null,
    catchCount: 0,
    sourceType: "owner_trip",
    evidenceQuality: "direct_effort",
    sourceReference: null,
    notes: null,
  }));
  assertEquals(response.status, 400);
  assertEquals((await response.json()).error, "pier_cast_outcome_invalid");
  assertEquals(commitCalls, 0);
});

Deno.test("PierCast handler enforces route and method boundaries", async () => {
  const handler = createPierCastHandler(dependencies());
  assertEquals((await handler(request("snapshot"))).status, 404);
  assertEquals((await handler(request("outlook"))).status, 404);
  assertEquals((await handler(request("catalog", "POST"))).status, 405);
  assertEquals((await handler(request("review/outcomes"))).status, 405);
  const options = await handler(request("catalog", "OPTIONS"));
  assertEquals(options.status, 200);
  assertEquals(options.headers.get("access-control-allow-origin"), "*");
});

Deno.test("public temperature map is read-only, anonymous, and independently unavailable", async () => {
  const body: NonNullable<
    Awaited<
      ReturnType<
        NonNullable<PierCastHandlerDependencies["readTemperatureMap"]>
      >
    >
  > = {
    mode: "nearshore_temperature_map",
    generatedAt: "2026-09-25T12:00:00Z",
    disclosure: "Modeled guidance.",
    source: {
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: "2026-09-25T06:00:00Z",
      fetchedAt: "2026-09-25T08:00:00Z",
      cycleAgeHours: 6,
    },
    cities: [{
      cityId: "ludington_mi",
      points: [{ validAt: "2026-09-25T12:00:00Z", temperatureC: 15 }],
    }],
  };
  const handler = createPierCastHandler(dependencies({
    authorized: false,
    readTemperatureMap: () => Promise.resolve(body),
  }));
  const response = await handler(request("temperature-map"));
  assertEquals(response.status, 200);
  assertEquals(await response.json(), body);
  assertEquals((await handler(request("temperature-map", "POST"))).status, 405);

  const unavailable = createPierCastHandler(dependencies());
  const unavailableResponse = await unavailable(request("temperature-map"));
  assertEquals(unavailableResponse.status, 503);
  assertEquals(
    (await unavailableResponse.json()).error,
    "pier_cast_temperature_map_unavailable",
  );
});

Deno.test("observed station map is anonymous, cacheable, and isolated from modeled layers", async () => {
  const body = {
    schemaVersion: "piercast-observed-temperature-map-v1" as const,
    generatedAt: "2026-09-27T12:00:00.000Z",
    stations: [],
    cacheStatus: "fresh" as const,
    disclosure: "Point observations only.",
    diagnostics: [],
  };
  const handler = createPierCastHandler(dependencies({
    authorized: false,
    readObservedTemperatureMap: () => Promise.resolve(body),
  }));
  const response = await handler(request("observations/temperature-map"));
  assertEquals(response.status, 200);
  assertEquals(await response.json(), body);
  assertEquals(
    response.headers.get("cache-control"),
    "public, max-age=300, s-maxage=900, stale-while-revalidate=21600",
  );
  assertEquals(
    (await handler(request("observations/temperature-map", "POST"))).status,
    405,
  );

  const unavailable = createPierCastHandler(dependencies({
    readObservedTemperatureMap: () => Promise.resolve(null),
  }));
  const unavailableResponse = await unavailable(
    request("observations/temperature-map"),
  );
  assertEquals(unavailableResponse.status, 503);
  assertEquals(
    (await unavailableResponse.json()).error,
    "pier_cast_observations_unavailable",
  );
});

Deno.test("public map foundation is anonymous, cacheable, and independently unavailable", async () => {
  const validTimes = Array.from(
    { length: 121 },
    (_, hour) => new Date(Date.UTC(2026, 8, 25, hour)).toISOString(),
  );
  const body = {
    mode: "great_lakes_map_foundation" as const,
    schemaVersion: "pier-cast-map-foundation-v1" as const,
    generatedAt: "2026-09-25T01:00:00.000Z",
    cacheStatus: "fresh" as const,
    timeline: {
      startsAt: validTimes[0],
      endsAt: validTimes[120],
      stepHours: 1 as const,
      frameCount: 121 as const,
      validTimes,
    },
    temperature: {
      provider: "NOAA NOS" as const,
      cycleIssuedAt: validTimes[0],
      models: [],
      disclosure: "Modeled guidance.",
    },
    wind: {
      provider: "Open-Meteo" as const,
      model: "best_match" as const,
      fetchedAt: "2026-09-25T01:00:00.000Z",
      forecastStart: validTimes[0],
      forecastEnd: validTimes[120],
      temporalResolutionHours: 1 as const,
      nodeSpacingDegrees: 0.4,
      nodes: [],
      disclosure: "Modeled guidance.",
    },
    bathymetry: {
      static: true as const,
      sources: [],
      disclosure: "Not for navigation.",
    },
    diagnostics: [],
  };
  const handler = createPierCastHandler(dependencies({
    authorized: false,
    readMapFoundation: () => Promise.resolve(body),
  }));
  const response = await handler(request("map-foundation"));
  assertEquals(response.status, 200);
  assertEquals(await response.json(), body);
  assertEquals(
    response.headers.get("cache-control"),
    "public, max-age=300, s-maxage=900, stale-while-revalidate=21600",
  );
  assertEquals((await handler(request("map-foundation", "POST"))).status, 405);

  const unavailable = createPierCastHandler(dependencies());
  const unavailableResponse = await unavailable(request("map-foundation"));
  assertEquals(unavailableResponse.status, 503);
  assertEquals(
    (await unavailableResponse.json()).error,
    "pier_cast_map_foundation_unavailable",
  );
});

Deno.test("public standings are independent of account access and cannot expose reports", async () => {
  const { leaderboardOnly } = await import("./reportAccess.ts");
  let claims = 0;
  const handler = createPierCastHandler({
    ...dependencies({ authorized: false }),
    readLeaderboard: async () => leaderboardOnly(reviewOutlook()),
    readCityReport: async () => {
      claims++;
      throw new Error("not authorized");
    },
  });
  for (let index = 0; index < 3; index++) {
    const response = await handler(request("leaderboard"));
    assertEquals(response.status, 200);
    const body = await response.json();
    assertEquals(body.cities.length, 5);
    assertEquals(
      body.cities.every((c: { dates: object[] }) =>
        c.dates.every((d) => !("species" in d) && !("waterTemperature" in d))
      ),
      true,
    );
  }
  assertEquals(claims, 0);
  assertEquals((await handler(request("review/outlook"))).status, 403);
  assertEquals((await handler(request("report?cityId=bad-id"))).status, 400);
  assertEquals(
    (await handler(request("report?cityId=ludington_mi", "POST"))).status,
    405,
  );
});

Deno.test("city report quota errors reach the paywall and never become a leaderboard response", async () => {
  const { PierCastAccessError } = await import("./reportAccess.ts");
  const handler = createPierCastHandler({
    ...dependencies(),
    readCityReport: async () => {
      throw new PierCastAccessError(
        "subscription_required",
        "Upgrade for another report.",
        403,
      );
    },
  });
  const response = await handler(request("report?cityId=ludington_mi"));
  assertEquals(response.status, 403);
  assertEquals((await response.json()).error, "subscription_required");
  assertEquals(
    (await createPierCastHandler(dependencies())(
      request("report?cityId=ludington_mi"),
    )).status,
    404,
  );
  assertEquals(
    (await createPierCastHandler(dependencies())(request("leaderboard")))
      .status,
    503,
  );
});
