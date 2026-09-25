import assert from "node:assert/strict";
import test from "node:test";

import {
  buildPierCastTemperatureMapCities,
  buildPierCastTemperatureRasterFrame,
  buildPierCastMapCities,
  celsiusToFahrenheit,
  closestPierCastTemperatureTime,
  filterPierCastMapCities,
  PIER_CAST_ACTIVE_MAP_BOUNDS,
  pierCastTemperatureHorizonLabel,
  pierCastTemperatureRasterValidTimes,
  pierCastTemperatureValidTimes,
  pierCastMapBoundsForFilter,
  PIER_CAST_STATE_MAP_BOUNDS,
} from "../lib/pierCastMap";
import type {
  PierCastCatalogCityRead,
  PierCastCatalogResponse,
  PierCastLeaderboardResponse,
  PierCastTemperatureMapResponse,
} from "../lib/pierCastContracts";

function city(
  cityId: string,
  stateCode: PierCastCatalogCityRead["stateCode"],
  latitude: number,
  longitude: number,
): PierCastCatalogCityRead {
  return {
    cityId,
    displayName: cityId,
    stateCode,
    timezone: stateCode === "WI" || stateCode === "IL"
      ? "America/Chicago"
      : "America/Detroit",
    tentative: false,
    releaseStatus: "public_research",
    waterTemperatureSource: {
      sourceId: "source",
      productId: "product",
      displayName: "source",
      kind: "model",
      canonicalUnit: "C",
      calibrationStatus: "approved_for_pilot",
      endpoint: "https://example.com",
      variable: "temp",
      configuredLocation: {
        latitude,
        longitude,
        verticalSelection: "surface",
        depthIndex: 0,
        gridRow: 0,
        gridColumn: 0,
        modelBathymetryM: 1,
        selectionMethod: "nearest_wet_lakeward_regular_grid_center",
        referencePoint: {
          referenceId: cityId,
          displayName: cityId,
          latitude,
          longitude,
          distanceM: 0,
          coordinateSource: "NOAA Aids to Navigation",
        },
        gridCellStatus: "approved_for_pilot",
      },
      issueCyclesUtc: [0, 6, 12, 18],
      forecastHorizonHours: 120,
      freshnessLimitHours: 12,
      fallbackPolicy: "unavailable",
      validationObservation: null,
      limitation: "test",
    },
    structures: [],
    species: [],
  };
}

const catalog = {
  cities: [
    city("grand_haven_mi", "MI", 43.05, -86.25),
    city("sheboygan_wi", "WI", 43.75, -87.7),
  ],
} as Pick<PierCastCatalogResponse, "cities">;

const leaderboard = {
  cities: [
    {
      cityId: "grand_haven_mi",
      dates: [{
        localDate: "2026-09-25",
        headline: {
          overall: {
            status: "available",
            score: 8,
            displayScore: 8,
            displayText: "8/10",
            label: "Excellent",
            ratingName: "FinFindr Opportunity Rating",
            rubricVersion: "test",
          },
          drivingSpeciesId: "chinook_salmon",
        },
      }],
    },
    {
      cityId: "sheboygan_wi",
      dates: [{
        localDate: "2026-09-25",
        headline: {
          overall: {
            status: "available",
            score: 6,
            displayScore: 6,
            displayText: "6/10",
            label: "Fair",
            ratingName: "FinFindr Opportunity Rating",
            rubricVersion: "test",
          },
          drivingSpeciesId: "coho_salmon",
        },
      }],
    },
  ],
} as unknown as Pick<PierCastLeaderboardResponse, "cities">;

test("PierCast map projects released catalog coordinates and leaderboard ranks", () => {
  const entries = buildPierCastMapCities(catalog, leaderboard);
  assert.deepEqual(
    entries.map((entry) => ({
      cityId: entry.city.cityId,
      score: entry.score,
      rank: entry.rank,
      latitude: entry.latitude,
      longitude: entry.longitude,
    })),
    [
      {
        cityId: "grand_haven_mi",
        score: 8,
        rank: 1,
        latitude: 43.05,
        longitude: -86.25,
      },
      {
        cityId: "sheboygan_wi",
        score: 6,
        rank: 2,
        latitude: 43.75,
        longitude: -87.7,
      },
    ],
  );
});

test("PierCast map state filters and camera bounds stay deterministic", () => {
  const entries = buildPierCastMapCities(catalog, leaderboard);
  assert.deepEqual(
    filterPierCastMapCities(entries, "WI").map((entry) => entry.city.cityId),
    ["sheboygan_wi"],
  );
  assert.deepEqual(pierCastMapBoundsForFilter("ALL"), PIER_CAST_ACTIVE_MAP_BOUNDS);
  assert.deepEqual(pierCastMapBoundsForFilter("MI"), PIER_CAST_STATE_MAP_BOUNDS.MI);
});

const temperatureMap: PierCastTemperatureMapResponse = {
  mode: "nearshore_temperature_map",
  generatedAt: "2026-09-25T12:00:00Z",
  disclosure: "Modeled guidance.",
  source: {
    productId: "NOAA_NOS_LMHOFS_REGULARGRID",
    issuedAt: "2026-09-25T06:00:00Z",
    fetchedAt: "2026-09-25T08:00:00Z",
    cycleAgeHours: 6,
  },
  cities: [
    {
      cityId: "grand_haven_mi",
      points: [
        { validAt: "2026-09-25T12:00:00Z", temperatureC: 10 },
        { validAt: "2026-09-25T13:00:00Z", temperatureC: 11 },
      ],
    },
    {
      cityId: "sheboygan_wi",
      points: [
        { validAt: "2026-09-25T12:00:00Z", temperatureC: 15 },
        { validAt: "2026-09-25T13:00:00Z", temperatureC: 16 },
      ],
    },
  ],
};

test("PierCast temperature map joins the requested coherent hour to map cities", () => {
  const cities = buildPierCastMapCities(catalog, leaderboard);
  const temperatures = buildPierCastTemperatureMapCities(
    cities,
    temperatureMap,
    "2026-09-25T13:00:00Z",
  );
  assert.deepEqual(
    temperatures.map((entry) => ({
      cityId: entry.city.cityId,
      temperatureC: entry.temperatureC,
      temperatureF: entry.temperatureF,
      validAt: entry.validAt,
    })),
    [
      {
        cityId: "grand_haven_mi",
        temperatureC: 11,
        temperatureF: 51.8,
        validAt: "2026-09-25T13:00:00Z",
      },
      {
        cityId: "sheboygan_wi",
        temperatureC: 16,
        temperatureF: 60.8,
        validAt: "2026-09-25T13:00:00Z",
      },
    ],
  );
  assert.equal(celsiusToFahrenheit(0), 32);
});

test("PierCast temperature timeline exposes ordered hours and chooses the nearest one", () => {
  const times = pierCastTemperatureValidTimes(temperatureMap);
  assert.deepEqual(times, [
    "2026-09-25T12:00:00Z",
    "2026-09-25T13:00:00Z",
  ]);
  assert.equal(
    closestPierCastTemperatureTime(times, "2026-09-25T12:40:00Z"),
    "2026-09-25T13:00:00Z",
  );
  assert.equal(closestPierCastTemperatureTime([], Date.now()), null);
  assert.equal(pierCastTemperatureHorizonLabel(times), "+1H");
  assert.equal(
    pierCastTemperatureHorizonLabel([
      "2026-09-25T12:00:00Z",
      "2026-09-30T12:00:00Z",
    ]),
    "+5 DAYS",
  );
  assert.equal(
    pierCastTemperatureHorizonLabel([
      "2026-09-25T15:00:00Z",
      "2026-09-30T06:00:00Z",
    ]),
    "+4D 15H",
  );
});

test("PierCast temperature raster uses exact NOAA hourly frames and a fixed 32–78F scale", () => {
  const withInterpolatedNow: PierCastTemperatureMapResponse = {
    ...temperatureMap,
    cities: temperatureMap.cities.map((entry) => ({
      ...entry,
      points: [
        { validAt: "2026-09-25T12:37:00Z", temperatureC: 10.5 },
        ...entry.points,
      ],
    })),
  };
  assert.deepEqual(pierCastTemperatureRasterValidTimes(withInterpolatedNow), [
    "2026-09-25T12:00:00Z",
    "2026-09-25T13:00:00Z",
  ]);

  const frame = buildPierCastTemperatureRasterFrame(
    temperatureMap,
    "2026-09-25T13:00:00Z",
  );
  assert.equal(frame?.forecastHour, 7);
  assert.match(
    frame?.tileUrl ?? "",
    /\/2026\/09\/25\/lmhofs\.t06z\.20260925\.regulargrid\.f007\.nc\?/,
  );
  assert.match(frame?.tileUrl ?? "", /layers=temp/);
  assert.match(frame?.tileUrl ?? "", /styles=default-scalar\/x-Sst/);
  assert.match(frame?.tileUrl ?? "", /bbox=\{bbox-epsg-3857\}/);
  assert.match(frame?.tileUrl ?? "", /colorscalerange=0,25\.555/);
  assert.equal(
    buildPierCastTemperatureRasterFrame(
      temperatureMap,
      "2026-09-25T12:30:00Z",
    ),
    null,
  );
});
