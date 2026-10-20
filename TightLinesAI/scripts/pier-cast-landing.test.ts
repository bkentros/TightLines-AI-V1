import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildPierCastLakeSnapshot,
  buildPierCastLandingSwings,
  buildPierCastShoreGroups,
  buildPierCastSparkline,
  nearestPierCastCities,
  parsePierCastSavedCities,
  pickPierCastTopSalmonid,
  pierCastSampleSwing,
  pierCastSwingSummary,
  searchPierCastCities,
  togglePierCastSavedCity,
} from "../lib/pierCastLanding";
import { pierCastCityTopPick } from "../lib/pierCastCityReportPresentation";
import { PIER_CAST_LAKE_SHAPES, pierCastLakePoint } from "../lib/pierCastLakeShapes";
import { projectPierCastSpeciesConditionsV5 } from "../lib/pierCastOpportunityV5";
import { PIER_CAST_SALMONID_AUDIT_SPECIES } from "../lib/pierCastSalmonidCalibrationAuditV18";
import { PIER_CAST_LAKE_TROUT_V5_CANDIDATES } from "../supabase/functions/_shared/pierCastEngine/config/lakeTroutV5.candidate";
import { PIER_CAST_V3_PAIR_CALIBRATIONS } from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration";

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");

const city = (cityId: string, name: string, state: string, lat: number, lon: number, species = ["chinook_salmon", "steelhead", "yellow_perch"]) => ({
  cityId,
  displayName: name,
  stateCode: state,
  supportedSpeciesIds: species,
  structures: [],
  waterTemperatureSource: { configuredLocation: { referencePoint: { latitude: lat, longitude: lon } } },
}) as never;

const CITIES = [
  city("grand_haven_mi", "Grand Haven", "MI", 43.0569, -86.2558),
  city("holland_mi", "Holland", "MI", 42.7725, -86.2128),
  city("milwaukee_wi", "Milwaukee", "WI", 43.0389, -87.8956),
  city("port_washington_wi", "Port Washington", "WI", 43.387, -87.875),
  city("port_sanilac_mi", "Port Sanilac", "MI", 43.43, -82.54),
];

test("My Piers keeps at most five valid, unique cities", () => {
  assert.deepEqual(
    parsePierCastSavedCities('["a_b","a_b","BAD!","c_d","e_f","g_h","i_j","k_l"]'),
    ["a_b", "c_d", "e_f", "g_h", "i_j"],
  );
  assert.deepEqual(parsePierCastSavedCities("not json"), []);
  assert.equal(togglePierCastSavedCity([], "grand_haven_mi").status, "saved");
  const five = ["a_1", "b_2", "c_3", "d_4", "e_5"];
  assert.deepEqual(togglePierCastSavedCity(five, "grand_haven_mi"), { status: "full", cityIds: five });
  assert.deepEqual(togglePierCastSavedCity(["a_1", "grand_haven_mi"], "grand_haven_mi"), { status: "removed", cityIds: ["a_1"] });
});

test("Near me returns the closest pier cities with distances", () => {
  const near = nearestPierCastCities({ latitude: 42.96, longitude: -85.67 }, CITIES, new Map(), 2);
  assert.deepEqual(near.map((item) => item.city.cityId), ["grand_haven_mi", "holland_mi"]);
  assert.ok(near[0]!.miles > 25 && near[0]!.miles < 35);
});

test("search matches city and state names, prefix matches first", () => {
  const states = { MI: "Michigan", WI: "Wisconsin" };
  assert.deepEqual(searchPierCastCities(CITIES, "port", states).map((c) => c.cityId), ["port_sanilac_mi", "port_washington_wi"]);
  assert.equal(searchPierCastCities(CITIES, "wisconsin", states).length, 2);
  assert.deepEqual(searchPierCastCities(CITIES, "  ", states), []);
});

function row(
  cityId: string,
  speciesId: string,
  band: string | null,
  thermal: number,
  ranked = true,
  temperatureC = 12,
  localDate = "2026-10-20",
) {
  return {
    cityId, speciesId, displayName: cityId,
    rankingDisposition: ranked ? "ranked" : "unranked",
    targetingEligibility: ranked ? "eligible" : "unknown",
    seasonalOutlook: band
      ? {
        status: "available",
        value: 1,
        band,
        stage: "active",
        trend: "steady",
        profileId: "landing-test-source",
        basis: "regional",
        localDate,
        reasonCodes: [],
      }
      : {
        status: "unavailable",
        value: null,
        band: null,
        stage: null,
        trend: null,
        profileId: null,
        basis: null,
        localDate,
        reasonCodes: ["seasonal_profile_missing"],
      },
    thermalMatch: {
      status: "available",
      value: thermal,
      temperatureC,
      optimumRangeC: [10, 14],
      distanceFromOptimumC: 0,
      band: "excellent",
      curveId: "landing-test-source",
      validAt: `${localDate}T12:00:00.000Z`,
      sourceKind: "model",
      reasonCodes: [],
    },
    localFisheryContext: null,
    reasonCodes: [],
  };
}
const conditionsFeed = (speciesId: string, rows: unknown[]) => ({ selectedSpeciesId: speciesId, cities: rows }) as never;

test("a saved pier shows its best trout or salmon only, even when the best is weak", () => {
  const conditions = [
    conditionsFeed("chinook_salmon", [row("grand_haven_mi", "chinook_salmon", "fair", 0.9)]),
    conditionsFeed("steelhead", [row("grand_haven_mi", "steelhead", "good", 0.4)]),
    conditionsFeed("yellow_perch", [row("grand_haven_mi", "yellow_perch", "excellent", 1)]),
    conditionsFeed("coho_salmon", [row("grand_haven_mi", "coho_salmon", "excellent", 1)]), // not supported here
  ];
  assert.equal(pickPierCastTopSalmonid(CITIES[0]!, conditions)?.speciesId, "steelhead");
  const weak = [conditionsFeed("chinook_salmon", [row("grand_haven_mi", "chinook_salmon", "poor", 0.2)])];
  assert.equal(pickPierCastTopSalmonid(CITIES[0]!, weak)?.speciesId, "chinook_salmon");
  // The exact opportunity calculation, not the shared label, breaks a tie.
  const tie = [
    conditionsFeed("chinook_salmon", [row("grand_haven_mi", "chinook_salmon", "good", 0.3)]),
    conditionsFeed("steelhead", [row("grand_haven_mi", "steelhead", "good", 0.8)]),
  ];
  assert.equal(pickPierCastTopSalmonid(CITIES[0]!, tie)?.speciesId, "steelhead");
  assert.equal(pickPierCastTopSalmonid(CITIES[0]!, []), null);
});

test("Caseville landing and city report agree when Coho and Lake Trout are both Fair", () => {
  const caseville = city(
    "caseville_mi",
    "Caseville",
    "MI",
    43.94,
    -83.27,
    ["coho_salmon", "lake_trout"],
  );
  const coho = row("caseville_mi", "coho_salmon", "fair", 1, true, 12);
  const lakeTrout = row(
    "caseville_mi",
    "lake_trout",
    "fair",
    1,
    true,
    12,
  );
  const cohoProjected = projectPierCastSpeciesConditionsV5({
    cityId: caseville.cityId,
    species: coho as never,
  });
  const lakeTroutProjected = projectPierCastSpeciesConditionsV5({
    cityId: caseville.cityId,
    species: lakeTrout as never,
  });
  assert.equal(cohoProjected.evaluation?.band, "fair");
  assert.equal(lakeTroutProjected.evaluation?.band, "fair");
  assert.ok(
    lakeTroutProjected.evaluation!.score! > cohoProjected.evaluation!.score!,
  );
  const feeds = [
    conditionsFeed("coho_salmon", [coho]),
    conditionsFeed("lake_trout", [lakeTrout]),
  ];
  assert.equal(
    pickPierCastTopSalmonid(caseville, feeds)?.speciesId,
    "lake_trout",
  );
  assert.equal(
    pierCastCityTopPick(
      [cohoProjected.species, lakeTroutProjected.species],
      caseville.cityId,
    )?.speciesId,
    "lake_trout",
  );
});

test("landing and city report choose the same salmonid across all 32 cities", () => {
  const salmonids = new Set<string>(PIER_CAST_SALMONID_AUDIT_SPECIES);
  const byCity = new Map<string, Set<string>>();
  for (const pair of PIER_CAST_V3_PAIR_CALIBRATIONS) {
    if (pair.speciesId === "lake_trout" || !salmonids.has(pair.speciesId)) {
      continue;
    }
    const species = byCity.get(pair.cityId) ?? new Set<string>();
    species.add(pair.speciesId);
    byCity.set(pair.cityId, species);
  }
  for (const candidate of PIER_CAST_LAKE_TROUT_V5_CANDIDATES) {
    const species = byCity.get(candidate.cityId) ?? new Set<string>();
    species.add("lake_trout");
    byCity.set(candidate.cityId, species);
  }
  assert.equal(byCity.size, 32);
  for (const [cityId, supported] of byCity) {
    const testCity = city(cityId, cityId, "MI", 44, -84, [...supported]);
    for (
      const localDate of [
        "2028-01-15",
        "2028-04-15",
        "2028-07-15",
        "2028-10-20",
        "2028-11-15",
      ]
    ) {
      for (const temperatureC of [0, 12, 20]) {
        const sources = [...supported].map((speciesId) =>
          row(
            cityId,
            speciesId,
            "fair",
            0.5,
            true,
            temperatureC,
            localDate,
          )
        );
        const feeds = sources.map((source) =>
          conditionsFeed(source.speciesId, [source])
        );
        const projected = sources.map((source) =>
          projectPierCastSpeciesConditionsV5({
            cityId,
            species: source as never,
          }).species
        );
        const landing = pickPierCastTopSalmonid(testCity, feeds)?.speciesId ??
          null;
        const report = pierCastCityTopPick(projected, cityId)?.speciesId ??
          null;
        assert.equal(
          landing,
          report,
          `${cityId}/${localDate}/${temperatureC}C`,
        );
      }
    }
  }
});

const START = Date.parse("2026-10-19T12:00:00Z");
function timeline(startF: number, dropF: number) {
  return Array.from({ length: 120 }, (_, h) => ({
    validAt: new Date(START + (h - 2) * 3600_000).toISOString(),
    temperatureC: ((startF - dropF / (1 + Math.exp(-(h - 30) / 6))) - 32) * 5 / 9,
    sourceKind: "model" as const,
  }));
}
const summary = {
  generatedAt: "2026-10-19T10:30:00Z",
  cities: [
    { cityId: "st_joseph_mi", displayName: "St. Joseph", stateCode: "MI", lakeId: "michigan", timezone: "America/Detroit", latitude: 42.11, longitude: -86.48, temperatureTimeline: timeline(58, 12) },
    { cityId: "racine_wi", displayName: "Racine", stateCode: "WI", lakeId: "michigan", timezone: "America/Chicago", latitude: 42.73, longitude: -87.78, temperatureTimeline: timeline(52, 0) },
    { cityId: "alpena_mi", displayName: "Alpena", stateCode: "MI", lakeId: "huron", timezone: "America/Detroit", latitude: 45.06, longitude: -83.43, temperatureTimeline: timeline(47, -1) },
  ],
} as never;

test("the lake snapshot reports the range and the coldest and warmest pier now", () => {
  const snap = buildPierCastLakeSnapshot(summary, START)!;
  assert.equal(snap.coldest.name, "Alpena");
  assert.equal(snap.warmest.name, "St. Joseph");
  assert.equal(snap.pierCount, 3);
  assert.ok(snap.lowF < snap.highF);
  assert.equal(buildPierCastLakeSnapshot(null), null);
});

test("water temp swings use the City Report shift rule and skip small changes", () => {
  const swings = buildPierCastLandingSwings(summary, START);
  assert.deepEqual(swings.map((swing) => swing.cityId), ["st_joseph_mi"]);
  assert.equal(swings[0]!.direction, "cooling");
  assert.notEqual(swings[0]!.severity, "minor");
  assert.equal(pierCastSwingSummary(swings), "1 cooling · next 5 days");
  assert.equal(pierCastSwingSummary([]), "No big swings in the 5-day forecast");
  assert.equal(pierCastSampleSwing(START).sample, true);
});

test("the lake index splits Lake Michigan into shores and places piers on the outline", () => {
  const cities = [
    city("st_joseph_mi", "St. Joseph", "MI", 42.11, -86.48),
    city("racine_wi", "Racine", "WI", 42.73, -87.78),
    city("alpena_mi", "Alpena", "MI", 45.06, -83.43),
  ];
  const lakes = new Map([["st_joseph_mi", "michigan"], ["racine_wi", "michigan"], ["alpena_mi", "huron"]]);
  const groups = buildPierCastShoreGroups(cities, lakes as never);
  assert.deepEqual(groups.map((group) => group.id), ["michigan-east", "michigan-west", "huron"]);
  assert.deepEqual(groups.map((group) => group.cities.length), [1, 1, 1]);
  const shape = PIER_CAST_LAKE_SHAPES.michigan;
  const at = pierCastLakePoint(shape, 42.11, -86.48);
  assert.ok(at.x > 0 && at.x <= shape.width + 2 && at.y > 0 && at.y <= shape.height + 2, JSON.stringify(at));
});

test("the five-day sparkline starts now and reports the change", () => {
  const start = Date.parse("2026-10-19T12:00:00Z");
  const timeline = Array.from({ length: 41 }, (_, i) => ({
    validAt: new Date(start + i * 3 * 3600_000).toISOString(),
    temperatureC: 14 - i * 0.1,
    sourceKind: "model" as const,
  }));
  const line = buildPierCastSparkline(timeline, start)!;
  assert.ok(Math.abs(line.nowF - 57.2) < 0.01);
  assert.ok(line.changeF < -7);
  assert.ok(line.points.every(([x, y]) => x >= 0 && x <= 1 && y >= 0 && y <= 1));
});

test("the landing replaces the leaderboard and keeps the PierCast field-guide look", () => {
  const landing = read("components/pier-cast/PierCastLanding.tsx");
  const screen = read("app/pier-cast-review.tsx");
  assert.match(landing, /<PierCastLighthouseArt/);
  assert.match(landing, /right now/);
  assert.match(landing, /Live Lake Map/);
  assert.match(landing, /Near me/);
  assert.match(landing, /BROWSE BY SHORELINE/);
  assert.match(landing, /MY PIERS/);
  assert.match(landing, /snapToInterval=\{step\}/);
  assert.match(landing, /accessibilityRole="tab"/);
  assert.match(landing, /BEST TROUT & SALMON/);
  assert.match(landing, /<PierCastWaterGauge fit=\{fit\} \/>/);
  assert.match(landing, /WATER TEMP SWINGS/);
  assert.match(landing, /accessibilityState=\{\{ expanded \}\}/);
  // The development preview swing never reaches release builds.
  assert.match(landing, /__DEV__ && found\.length === 0/);
  assert.match(screen, /<PierCastLanding/);
  assert.match(read("components/pier-cast/PierCastConditionsUI.tsx"), /SAVE PIER/);
  // Every landing number is computed in-app; no new public map endpoints.
  assert.doesNotMatch(read("lib/pierCastLanding.ts"), /public\/v1|fetch\(/);
});

test("screen guards: background refresh, back while loading, failed catalog, saved-pier hydration", () => {
  const screen = read("app/pier-cast-review.tsx");
  // A 15-minute background refresh never cancels a city the angler just tapped.
  assert.match(screen, /if \(silent && openingCity\.current\) return;/);
  // Back while a tapped city is loading returns to the landing instead of leaving PierCast.
  assert.match(screen, /if \(reportLoading && !selectedCityId && !returnToMap\)/);
  // A map deep link whose catalog fails shows the error, not an endless skeleton.
  assert.match(screen, /setReportLoading\(false\);\n\s+setForecastDelayed\(isForecastDelayedError\(caught\)\);\n\s+setError\(caught instanceof Error \? caught\.message : "PierCast could not be loaded\."\)/);
  // Saving is side-effect free inside React state and survives a slow storage read.
  assert.match(screen, /togglePierCastSavedCity\(savedCityIdsRef\.current, cityId\)/);
  assert.match(screen, /Keep anything saved while storage was still loading/);
});

test("landing guards: unavailable forecast is never shown as calm water; refresh bypasses the cache", () => {
  const landing = read("components/pier-cast/PierCastLanding.tsx");
  assert.match(landing, /available=\{summary !== null\}/);
  assert.match(landing, /The 5-day water forecast couldn't load/);
  assert.match(landing, /fetchPierCastConditionsSummaryMap\(\{ force \}\)/);
  assert.match(read("lib/pierCast.ts"), /!force &&\n\s+targetSummaryMapCache/);
  assert.match(landing, /Shoreline browsing isn't available right now/);
});
