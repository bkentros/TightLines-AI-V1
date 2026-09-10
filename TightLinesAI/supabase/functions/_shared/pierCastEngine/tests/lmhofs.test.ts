import {
  assert,
  assertEquals,
  assertRejects,
  assertStringIncludes,
} from "jsr:@std/assert";
import {
  buildPierCastLmhofsDatasetUrl,
  buildPierCastLmhofsPointUrl,
  fetchPierCastLmhofsBatch,
  listPierCastLmhofsCycleCandidates,
  parsePierCastLmhofsPointResponse,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_LMHOFS_FORECAST_HOURS,
  type PierCastLmhofsFetch,
} from "../index.ts";

const NOW = new Date("2026-09-10T00:30:00.000Z");
const COMPLETE_CYCLE = "2026-09-09T18:00:00.000Z";

function providerPayload(validAt: Date, temperatureC: number): string {
  const providerTime = validAt.toISOString().replace(".000Z", ".000000");
  return `Dataset {
    String Times[time = 1];
    Float32 temp[time = 1][Depth = 1][ny = 1][nx = 1];
} fixture;
---------------------------------------------
Times[1]
"${providerTime}"

temp[1][1][1][1]
[0][0][0], ${temperatureC}
`;
}

function parseRequest(url: string): {
  issuedAt: Date;
  forecastHour: number;
  gridRow: number;
  gridColumn: number;
} {
  const match = url.match(
    /MODELS\/(\d{4})\/(\d{2})\/(\d{2})\/lmhofs\.t(\d{2})z\.\d{8}\.regulargrid\.f(\d{3})\.nc\.ascii\?(.+)$/,
  );
  if (!match) throw new Error(`Unexpected LMHOFS URL: ${url}`);
  const projection = decodeURIComponent(match[6]);
  const indices = projection.match(
    /temp\[0:1:0\]\[0:1:0\]\[(\d+):1:\1\]\[(\d+):1:\2\]/,
  );
  if (!indices) throw new Error(`Unexpected LMHOFS projection: ${projection}`);
  return {
    issuedAt: new Date(
      `${match[1]}-${match[2]}-${match[3]}T${match[4]}:00:00Z`,
    ),
    forecastHour: Number(match[5]),
    gridRow: Number(indices[1]),
    gridColumn: Number(indices[2]),
  };
}

function completeCycleFetch(
  fail?: (request: ReturnType<typeof parseRequest>) => boolean,
): PierCastLmhofsFetch {
  return async (input) => {
    const request = parseRequest(String(input));
    if (request.issuedAt.toISOString() !== COMPLETE_CYCLE || fail?.(request)) {
      return new Response("not found", { status: 404 });
    }
    const validAt = new Date(
      request.issuedAt.getTime() + request.forecastHour * 60 * 60 * 1000,
    );
    const temperatureC = 5 + request.gridRow / 100 +
      request.gridColumn / 1000 + request.forecastHour / 1000;
    return new Response(providerPayload(validAt, temperatureC));
  };
}

Deno.test("LMHOFS cycle candidates stay on six-hour UTC boundaries", () => {
  assertEquals(
    listPierCastLmhofsCycleCandidates(NOW).map((date) => date.toISOString()),
    [
      "2026-09-10T00:00:00.000Z",
      "2026-09-09T18:00:00.000Z",
      "2026-09-09T12:00:00.000Z",
      "2026-09-09T06:00:00.000Z",
    ],
  );
});

Deno.test("LMHOFS URLs freeze cycle, horizon, depth, row, and column", () => {
  const city = PIER_CAST_CITY_PROFILES[0];
  const source = city.waterTemperatureSource!;
  const issuedAt = new Date(COMPLETE_CYCLE);
  assertEquals(
    buildPierCastLmhofsDatasetUrl(source.endpoint, issuedAt, 7),
    "https://opendap.co-ops.nos.noaa.gov/thredds/dodsC/NOAA/LMHOFS/MODELS/2026/09/09/lmhofs.t18z.20260909.regulargrid.f007.nc",
  );
  const pointUrl = buildPierCastLmhofsPointUrl(
    source as Parameters<typeof buildPierCastLmhofsPointUrl>[0],
    issuedAt,
    7,
  );
  assertStringIncludes(pointUrl, ".f007.nc.ascii?");
  assertStringIncludes(
    decodeURIComponent(pointUrl),
    "temp[0:1:0][0:1:0][235:1:235][159:1:159]",
  );
});

Deno.test("LMHOFS parser accepts the live ASCII shape and rejects unsafe values", async () => {
  assertEquals(
    parsePierCastLmhofsPointResponse(
      providerPayload(new Date("2026-09-09T19:00:00Z"), 21.86915),
    ),
    {
      validAt: "2026-09-09T19:00:00.000Z",
      temperatureC: 21.86915,
    },
  );
  await assertRejects(
    async () => parsePierCastLmhofsPointResponse("<html>provider error</html>"),
    Error,
    "omitted",
  );
  await assertRejects(
    async () =>
      parsePierCastLmhofsPointResponse(
        providerPayload(new Date("2026-09-09T19:00:00Z"), -999),
      ),
    Error,
    "sanity range",
  );
});

Deno.test("all-five LMHOFS pipeline builds complete 121-hour timelines", async () => {
  const batch = await fetchPierCastLmhofsBatch({
    fetchImpl: completeCycleFetch(),
    now: () => NOW,
    concurrency: 12,
  });

  assertEquals(batch.status, "available");
  assertEquals(batch.issuedAt, COMPLETE_CYCLE);
  assertEquals(batch.fullHorizonRequested, true);
  assertEquals(batch.requestedForecastHours, PIER_CAST_LMHOFS_FORECAST_HOURS);
  assertEquals(batch.cities.length, 5);
  for (const city of batch.cities) {
    assertEquals(city.status, "available");
    if (city.status !== "available") continue;
    assertEquals(city.samples.length, 121);
    assertEquals(city.samples[0].forecastHour, 0);
    assertEquals(city.samples[120].forecastHour, 120);
    assertEquals(city.samples[0].issuedAt, COMPLETE_CYCLE);
    assertEquals(city.samples[0].rawUnit, "C");
    assertEquals(city.samples[0].depthIndex, 0);
    assert(
      city.samples.every((sample) => Number.isFinite(sample.temperatureC)),
    );
  }
});

Deno.test("one failed city-hour stays unavailable without contaminating other cities", async () => {
  const batch = await fetchPierCastLmhofsBatch({
    fetchImpl: completeCycleFetch((request) =>
      request.gridRow === 265 && request.gridColumn === 171 &&
      request.forecastHour === 1
    ),
    now: () => NOW,
    forecastHours: [0, 1, 24, 72, 120],
  });

  assertEquals(batch.status, "partial");
  if (batch.status === "unavailable") return;
  assertEquals(
    batch.cities.filter((city) => city.status === "available").length,
    4,
  );
  const manistee = batch.cities.find((city) => city.cityId === "manistee_mi")!;
  assertEquals(manistee.status, "unavailable");
  if (manistee.status === "unavailable") {
    assertEquals(manistee.missingForecastHours, [1]);
    assertEquals(manistee.reasonCodes, ["temperature_partial_horizon"]);
    assertEquals(manistee.samples.length, 4);
  }
});

Deno.test("pipeline refuses a complete cycle older than configured freshness", async () => {
  const batch = await fetchPierCastLmhofsBatch({
    fetchImpl: completeCycleFetch(),
    now: () => new Date("2026-09-10T07:00:01.000Z"),
    forecastHours: [120],
  });

  assertEquals(batch.status, "unavailable");
  assertEquals(batch.issuedAt, null);
  assert(
    batch.diagnostics.some((diagnostic) => diagnostic.code === "cycle_stale"),
  );
});

Deno.test("LMHOFS retries transient responses but not missing cycle files", async () => {
  const baseFetch = completeCycleFetch();
  const attempts = new Map<string, number>();
  const fetchImpl: PierCastLmhofsFetch = async (input, init) => {
    const url = String(input);
    const request = parseRequest(url);
    const count = (attempts.get(url) ?? 0) + 1;
    attempts.set(url, count);
    if (
      request.issuedAt.toISOString() === COMPLETE_CYCLE &&
      request.forecastHour === 0 && count === 1
    ) {
      return new Response("temporary", { status: 503 });
    }
    return baseFetch(input, init);
  };
  const batch = await fetchPierCastLmhofsBatch({
    fetchImpl,
    now: () => NOW,
    forecastHours: [0],
    maxAttempts: 2,
  });

  assertEquals(batch.status, "available");
  const zeroHourAttempts = [...attempts.entries()].filter(([url]) =>
    parseRequest(url).issuedAt.toISOString() === COMPLETE_CYCLE &&
    parseRequest(url).forecastHour === 0
  ).map(([, count]) => count);
  assertEquals(zeroHourAttempts, [2, 2, 2, 2, 2]);
  const missingNewest = [...attempts.entries()].find(([url]) =>
    parseRequest(url).issuedAt.toISOString() ===
      "2026-09-10T00:00:00.000Z"
  );
  assertEquals(missingNewest?.[1], 1);
});
