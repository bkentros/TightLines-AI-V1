import { assertEquals, assertRejects } from "jsr:@std/assert";
import { buildPierCastHourlyTimeline } from "../../../lib/pierCastGreatLakes.ts";
import type { PierCastWindGridNode } from "../../../lib/pierCastWindGrid.generated.ts";
import {
  createPierCastMapFoundationReader,
  discoverPierCastGreatLakesCycle,
  fetchPierCastGreatLakesWind,
} from "./pierCastMapFoundation.ts";

const TEST_NODES: readonly PierCastWindGridNode[] = [
  {
    nodeId: "superior_test",
    lakeId: "superior",
    latitude: 47.5,
    longitude: -87.5,
  },
  {
    nodeId: "erie_test",
    lakeId: "erie",
    latitude: 42,
    longitude: -81,
  },
];

function noaaDescriptor(): Response {
  return new Response("Dataset { Float32 temp; String Times; } test;", {
    status: 200,
  });
}

function openMeteoResponse(validTimes: readonly string[]): Response {
  const hourly = {
    time: validTimes.map((time) => time.replace(".000Z", "")),
    wind_speed_10m: validTimes.map((_, index) => 5 + index / 100),
    wind_direction_10m: validTimes.map((_, index) => index % 361),
    wind_gusts_10m: validTimes.map((_, index) => 8 + index / 100),
  };
  return Response.json(TEST_NODES.map((node) => ({
    latitude: node.latitude,
    longitude: node.longitude,
    hourly,
  })));
}

Deno.test("five-lake cycle discovery requires all four complete f120 products", async () => {
  const requested: string[] = [];
  const fetchImpl = (input: string | URL | Request) => {
    const url = String(input);
    requested.push(url);
    const latestCandidate = url.includes("t12z.20260925");
    const unavailableOntario = latestCandidate && url.includes("/LOOFS/");
    return Promise.resolve(
      unavailableOntario
        ? new Response("missing", { status: 404 })
        : noaaDescriptor(),
    );
  };
  const cycle = await discoverPierCastGreatLakesCycle({
    fetchImpl,
    now: new Date("2026-09-25T14:30:00Z"),
  });
  assertEquals(cycle.toISOString(), "2026-09-25T06:00:00.000Z");
  assertEquals(
    requested.filter((url) => url.includes("f120.nc.dds")).length,
    8,
  );
});

Deno.test("paid wind adapter returns exact synchronized 121-hour node timelines", async () => {
  const validTimes = buildPierCastHourlyTimeline("2026-09-25T06:00:00Z");
  let requestedUrl = "";
  const wind = await fetchPierCastGreatLakesWind({
    apiKey: "test-key",
    nodes: TEST_NODES,
    validTimes,
    fetchedAt: "2026-09-25T08:00:00Z",
    fetchImpl: (input) => {
      requestedUrl = String(input);
      return Promise.resolve(openMeteoResponse(validTimes));
    },
  });
  const parsedUrl = new URL(requestedUrl);
  assertEquals(parsedUrl.host, "customer-api.open-meteo.com");
  assertEquals(parsedUrl.searchParams.get("apikey"), "test-key");
  assertEquals(parsedUrl.searchParams.get("forecast_hours"), "121");
  assertEquals(parsedUrl.searchParams.get("past_hours"), "24");
  assertEquals(wind.nodes.length, 2);
  assertEquals(
    wind.nodes.every((node) =>
      node.speedMph.length === 121 &&
      node.directionDegrees.length === 121 &&
      node.gustMph.length === 121
    ),
    true,
  );
  assertEquals(wind.forecastStart, validTimes[0]);
  assertEquals(wind.forecastEnd, validTimes[120]);
});

Deno.test("wind adapter fails closed when any requested hour is absent", async () => {
  const validTimes = buildPierCastHourlyTimeline("2026-09-25T06:00:00Z");
  await assertRejects(
    () =>
      fetchPierCastGreatLakesWind({
        nodes: TEST_NODES,
        validTimes,
        fetchedAt: "2026-09-25T08:00:00Z",
        fetchImpl: () =>
          Promise.resolve(openMeteoResponse(validTimes.slice(1))),
      }),
    Error,
    "coverage is incomplete",
  );
});

Deno.test("production map foundation fails closed without the paid wind key", async () => {
  const reader = createPierCastMapFoundationReader({
    now: () => new Date("2026-09-25T08:00:00Z"),
    requirePaidOpenMeteo: true,
    fetchImpl: () => {
      throw new Error("provider must not be called");
    },
  });
  await assertRejects(
    () => reader(),
    Error,
    "Paid Open-Meteo configuration is required",
  );
});

Deno.test("foundation cache returns fresh data then bounded stale fallback", async () => {
  let now = new Date("2026-09-25T08:00:00Z");
  let fail = false;
  const validTimes = buildPierCastHourlyTimeline("2026-09-25T06:00:00Z");
  const reader = createPierCastMapFoundationReader({
    now: () => now,
    openMeteoApiKey: "test-key",
    windGrid: TEST_NODES,
    fetchImpl: (input) => {
      if (fail) return Promise.reject(new Error("provider offline"));
      const hostname = new URL(String(input)).hostname;
      return Promise.resolve(
        hostname === "customer-api.open-meteo.com" ||
          hostname === "api.open-meteo.com"
          ? openMeteoResponse(validTimes)
          : noaaDescriptor(),
      );
    },
  });
  const fresh = await reader();
  assertEquals(fresh.cacheStatus, "fresh");
  assertEquals(fresh.timeline.frameCount, 121);
  assertEquals(fresh.temperature.models.length, 4);
  assertEquals(fresh.bathymetry.sources.length, 5);

  now = new Date("2026-09-25T10:00:00Z");
  fail = true;
  const stale = await reader();
  assertEquals(stale.cacheStatus, "stale");
  assertEquals(
    stale.diagnostics.at(-1)?.code,
    "foundation_refresh_failed",
  );

  now = new Date("2026-09-25T15:00:01Z");
  await assertRejects(() => reader(), Error, "complete common");
});
