import { assertEquals } from "jsr:@std/assert";
import { buildPierCastReviewOutlook } from "../_shared/pierCastEngine/index.ts";
import { completeLmhofsBatch } from "../_shared/pierCastEngine/tests/fixtures/lmhofs.ts";
import { createPierCastHandler } from "./handler.ts";

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
}) {
  return {
    authorizeReview: () => Promise.resolve(input?.authorized ?? true),
    readReviewOutlook: input?.readReviewOutlook ??
      (() => Promise.resolve(reviewOutlook())),
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

function reviewOutlook() {
  return buildPierCastReviewOutlook({
    batch: completeLmhofsBatch(),
    evaluationTime: "2026-09-10T00:30:00.000Z",
  });
}

Deno.test("public PierCast catalog remains empty before release", async () => {
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
  assertEquals(body.cities, []);
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

Deno.test("authorized owner-review catalog returns five disabled cities", async () => {
  const handler = createPierCastHandler(dependencies());
  const response = await handler(request("review/catalog"));
  assertEquals(response.status, 200);
  const body = await response.json();
  assertEquals(body.mode, "review");
  assertEquals(body.cities.length, 5);
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
    27,
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
    body.cities.every((city: { representationDecision: string }) =>
      city.representationDecision === "blocked_insufficient_evidence"
    ),
    true,
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
