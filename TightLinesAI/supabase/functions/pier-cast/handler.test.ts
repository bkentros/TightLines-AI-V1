import { assertEquals } from "jsr:@std/assert";
import { createPierCastHandler } from "./handler.ts";

function request(path: string, method = "GET"): Request {
  return new Request(`https://example.test/functions/v1/pier-cast/${path}`, {
    method,
  });
}

Deno.test("public PierCast catalog remains empty before release", async () => {
  const handler = createPierCastHandler({ authorizeReview: async () => true });
  const response = await handler(request("catalog"));
  assertEquals(response.status, 200);
  const body = await response.json();
  assertEquals(body.mode, "public");
  assertEquals(body.ratingName, "FinFindr Opportunity Rating");
  assertEquals(body.ratingDisplayFormat, "X.X/10");
  assertEquals(body.formulaVersion, "seasonal-ceiling-x-temperature-v1");
  assertEquals(body.cities, []);
});

Deno.test("owner-review catalog requires authorization", async () => {
  const handler = createPierCastHandler({ authorizeReview: async () => false });
  const response = await handler(request("review/catalog"));
  assertEquals(response.status, 403);
  assertEquals((await response.json()).error, "pier_cast_review_forbidden");
});

Deno.test("authorized owner-review catalog returns five disabled cities", async () => {
  const handler = createPierCastHandler({ authorizeReview: async () => true });
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
    20,
  );
});

Deno.test("review authorization failures fail closed", async () => {
  const handler = createPierCastHandler({
    authorizeReview: () => Promise.reject(new Error("auth offline")),
  });
  const response = await handler(request("review/catalog"));
  assertEquals(response.status, 503);
  assertEquals(
    (await response.json()).error,
    "pier_cast_review_access_unavailable",
  );
});

Deno.test("PierCast handler enforces route and method boundaries", async () => {
  const handler = createPierCastHandler({ authorizeReview: async () => true });
  assertEquals((await handler(request("snapshot"))).status, 404);
  assertEquals((await handler(request("catalog", "POST"))).status, 405);
  const options = await handler(request("catalog", "OPTIONS"));
  assertEquals(options.status, 200);
  assertEquals(options.headers.get("access-control-allow-origin"), "*");
});
