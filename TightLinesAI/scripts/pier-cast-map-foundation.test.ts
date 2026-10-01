import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

import type { PierCastMapFoundationResponse } from "../lib/pierCastContracts";
import {
  buildPierCastHourlyTimeline,
  buildPierCastOfsDatasetUrl,
  PIER_CAST_GREAT_LAKES,
  PIER_CAST_GREAT_LAKES_MODELS,
  PIER_CAST_MAP_REGIONS,
} from "../lib/pierCastGreatLakes";
import {
  buildPierCastBathymetryRasterFrames,
  buildPierCastGreatLakesTemperatureRasterFrames,
  PIER_CAST_STATE_MAP_BOUNDS,
  type PierCastMapCity,
  pierCastMapFoundationValidTimes,
  pierCastMapRegionFeatureCode,
  pierCastWindFrame,
} from "../lib/pierCastMap";
import {
  buildPierCastWindArrowGeoJson,
  pierCastWindBandLabel,
  pierCastWindColor,
  pierCastWindCompassDirection,
  pierCastWindTravelDirection,
  summarizePierCastWindFrame,
} from "../lib/pierCastWind";
import {
  buildPierCastCityWindInsights,
  pierCastShorelineWindSetup,
  pierCastWindCaution,
  summarizePierCastCityWindInsights,
} from "../lib/pierCastMapInsights";
import {
  PIER_CAST_WIND_GRID,
  PIER_CAST_WIND_GRID_SOURCE_SHA256,
} from "../lib/pierCastWindGrid.generated";

function foundation(): PierCastMapFoundationResponse {
  const validTimes = buildPierCastHourlyTimeline("2026-09-25T06:00:00Z");
  return {
    mode: "great_lakes_map_foundation",
    schemaVersion: "pier-cast-map-foundation-v1",
    generatedAt: "2026-09-25T08:00:00Z",
    cacheStatus: "fresh",
    timeline: {
      startsAt: validTimes[0]!,
      endsAt: validTimes[120]!,
      stepHours: 1,
      frameCount: 121,
      validTimes,
    },
    temperature: {
      provider: "NOAA NOS",
      cycleIssuedAt: validTimes[0]!,
      models: PIER_CAST_GREAT_LAKES_MODELS.map((model) => ({
        ofsId: model.ofsId,
        productId: model.productId,
        lakeIds: [...model.lakeIds],
        issuedAt: validTimes[0]!,
        forecastStart: validTimes[0]!,
        forecastEnd: validTimes[120]!,
        forecastHorizonHours: 120,
        temporalResolutionHours: 1,
        status: "available",
      })),
      disclosure: "Modeled guidance.",
    },
    wind: {
      provider: "Open-Meteo",
      model: "best_match",
      fetchedAt: "2026-09-25T08:00:00Z",
      forecastStart: validTimes[0]!,
      forecastEnd: validTimes[120]!,
      temporalResolutionHours: 1,
      nodeSpacingDegrees: 0.4,
      nodes: [{
        nodeId: "michigan_000",
        lakeId: "michigan",
        latitude: 43,
        longitude: -87,
        speedMph: validTimes.map(() => 10),
        directionDegrees: validTimes.map(() => 270),
        gustMph: validTimes.map(() => 16),
      }],
      disclosure: "Modeled guidance.",
    },
    bathymetry: {
      static: true,
      sources: [],
      disclosure: "Not for navigation.",
    },
    diagnostics: [],
  };
}

test("five-lake manifest covers every lake with four NOAA forecast systems", () => {
  assert.deepEqual(
    PIER_CAST_GREAT_LAKES.map((lake) => lake.lakeId).sort(),
    ["erie", "huron", "michigan", "ontario", "superior"],
  );
  assert.deepEqual(
    PIER_CAST_GREAT_LAKES_MODELS.map((model) => model.ofsId),
    ["LSOFS", "LMHOFS", "LEOFS", "LOOFS"],
  );
  assert.equal(
    new Set(PIER_CAST_GREAT_LAKES_MODELS.flatMap((model) => model.lakeIds))
      .size,
    5,
  );
  for (const lake of PIER_CAST_GREAT_LAKES) {
    assert.match(lake.bathymetry.gridUrl, /^https:\/\/www\.ngdc\.noaa\.gov\//);
    assert.equal(lake.bathymetry.navigationUse, false);
  }
  assert.equal(
    PIER_CAST_GREAT_LAKES.find((lake) => lake.lakeId === "superior")
      ?.bathymetry.coverage,
    "incomplete_grid_only",
  );
});

test("NOAA dataset paths and five-lake raster frames stay synchronized", () => {
  const response = foundation();
  const frames = buildPierCastGreatLakesTemperatureRasterFrames(
    response,
    response.timeline.validTimes[24]!,
  );
  assert.equal(frames.length, 4);
  assert.deepEqual(frames.map((frame) => frame.ofsId), [
    "LSOFS",
    "LMHOFS",
    "LEOFS",
    "LOOFS",
  ]);
  for (const frame of frames) {
    assert.equal(frame.forecastHour, 24);
    assert.match(frame.tileUrl, /regulargrid\.f024\.nc/);
    assert.match(frame.tileUrl, /layers=temp/);
    assert.match(frame.tileUrl, /colorscalerange=0,25\.555/);
  }
  assert.match(
    buildPierCastOfsDatasetUrl(
      PIER_CAST_GREAT_LAKES_MODELS[0],
      new Date("2026-09-25T06:00:00Z"),
      120,
    ),
    /LSOFS\/MODELS\/2026\/09\/25\/lsofs\.t06z\.20260925\.regulargrid\.f120\.nc$/,
  );
  assert.equal(
    buildPierCastGreatLakesTemperatureRasterFrames(
      response,
      "2026-10-01T00:00:00Z",
    ).length,
    0,
  );
});

test("map foundation exposes exactly 121 hours and extracts an exact wind frame", () => {
  const response = foundation();
  const times = pierCastMapFoundationValidTimes(response);
  assert.equal(times.length, 121);
  assert.equal(
    (Date.parse(times[120]!) - Date.parse(times[0]!)) / 3_600_000,
    120,
  );
  assert.deepEqual(pierCastWindFrame(response, times[8]!), [{
    nodeId: "michigan_000",
    lakeId: "michigan",
    latitude: 43,
    longitude: -87,
    validAt: times[8],
    speedMph: 10,
    directionDegrees: 270,
    gustMph: 16,
  }]);
});

test("all five lakes have render-ready bathymetry rasters and contours", () => {
  const response = foundation();
  response.bathymetry.sources = PIER_CAST_GREAT_LAKES.map((lake) => ({
    lakeId: lake.lakeId,
    displayName: lake.displayName,
    ...lake.bathymetry,
  }));
  const frames = buildPierCastBathymetryRasterFrames(response);
  assert.equal(frames.length, 4);
  assert.deepEqual(
    frames.flatMap((frame) => frame.lakeIds).sort(),
    ["erie", "huron", "michigan", "ontario", "superior"],
  );
  for (const frame of frames) {
    assert.match(frame.rasterTileUrl, /layers=h/);
    assert.match(frame.rasterTileUrl, /styles=default-scalar\/default/);
    assert.match(frame.contourTileUrl, /styles=contours/);
    assert.match(frame.rasterTileUrl, /regulargrid\.f000\.nc/);
  }
});

test("wind grid is reproducible, unique, and represents all five lakes", () => {
  const source = readFileSync(
    new URL("../assets/data/pier-cast-great-lakes-map.json", import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(source).digest("hex"),
    PIER_CAST_WIND_GRID_SOURCE_SHA256,
  );
  assert.equal(
    new Set(PIER_CAST_WIND_GRID.map((node) => node.nodeId)).size,
    173,
  );
  for (const lake of PIER_CAST_GREAT_LAKES) {
    assert.ok(
      PIER_CAST_WIND_GRID.filter((node) => node.lakeId === lake.lakeId)
        .length >=
        10,
    );
  }
});

test("map filters cover every surrounding state and Ontario", () => {
  assert.deepEqual(
    PIER_CAST_MAP_REGIONS.map((region) => region.code),
    ["MI", "WI", "IL", "IN", "MN", "OH", "PA", "NY", "ON"],
  );
  assert.deepEqual(
    Object.keys(PIER_CAST_STATE_MAP_BOUNDS),
    ["MI", "WI", "IL", "IN", "MN", "OH", "PA", "NY", "ON"],
  );
  assert.equal(pierCastMapRegionFeatureCode("MI"), "US-MI");
  assert.equal(pierCastMapRegionFeatureCode("ON"), "CA-ON");
});

test("wind arrows encode travel direction, speed, gusts, and readable zoom size", () => {
  const point = {
    nodeId: "erie_001",
    lakeId: "erie" as const,
    latitude: 42,
    longitude: -81,
    validAt: "2026-09-25T12:00:00.000Z",
    speedMph: 20,
    directionDegrees: 270,
    gustMph: 31,
  };
  const broad = buildPierCastWindArrowGeoJson([point], 4);
  const close = buildPierCastWindArrowGeoJson([point], 10);
  assert.equal(broad.features.length, 1);
  assert.equal(close.features.length, 1);
  assert.equal(broad.features[0]?.geometry.coordinates.length, 3);
  assert.equal(
    broad.features[0]?.properties.travelDirectionDegrees,
    90,
  );
  assert.equal(pierCastWindTravelDirection(350), 170);
  assert.equal(pierCastWindCompassDirection(270), "W");
  assert.equal(pierCastWindBandLabel(20), "BREEZY");
  assert.match(pierCastWindColor(20), /^#[0-9A-F]{6}$/);
  assert.deepEqual(summarizePierCastWindFrame([point]), {
    averageMph: 20,
    strongestMph: 20,
    strongestGustMph: 31,
  });
  const broadStem = broad.features[0]?.geometry.coordinates[0];
  const closeStem = close.features[0]?.geometry.coordinates[0];
  assert.ok(
    Math.abs(broadStem![1]![0] - broadStem![0]![0]) >
      Math.abs(closeStem![1]![0] - closeStem![0]![0]),
  );
});

test("angler lens translates wind vectors into restrained shoreline guidance", () => {
  assert.equal(pierCastShorelineWindSetup(0, 0), "onshore");
  assert.equal(pierCastShorelineWindSetup(60, 0), "onshore");
  assert.equal(pierCastShorelineWindSetup(90, 0), "alongshore");
  assert.equal(pierCastShorelineWindSetup(120, 0), "offshore");
  assert.equal(pierCastShorelineWindSetup(180, 0), "offshore");
  assert.equal(pierCastWindCaution(14, 23), "none");
  assert.equal(pierCastWindCaution(15, 20), "elevated_gusts");
  assert.equal(pierCastWindCaution(20, 24), "rough_water");

  const city = {
    city: { cityId: "test_city" },
    latitude: 43,
    longitude: -86,
  } as unknown as PierCastMapCity;
  const insights = buildPierCastCityWindInsights([city], [{
    nodeId: "michigan_test",
    lakeId: "michigan",
    latitude: 43,
    longitude: -86.25,
    validAt: "2026-09-25T12:00:00.000Z",
    speedMph: 16,
    directionDegrees: 270,
    gustMph: 26,
  }]);
  assert.deepEqual(insights.get("test_city"), {
    cityId: "test_city",
    nodeId: "michigan_test",
    setup: "onshore",
    setupLabel: "ONSHORE PUSH",
    speedMph: 16,
    gustMph: 26,
    windFrom: "W",
    distanceMiles: 12.6,
    caution: "elevated_gusts",
  });
  assert.deepEqual(summarizePierCastCityWindInsights(insights), {
    onshore: 1,
    alongshore: 0,
    offshore: 0,
    cautions: 1,
  });
});
