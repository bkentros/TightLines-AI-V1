import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildPierCastConditionsV4Outlook,
  projectPierCastConditionsCityReportV4,
} from "../supabase/functions/_shared/pierCastEngine/pipeline/conditionsV4";
import {
  buildPierCastChartModel,
  buildPierCastCityCalendar,
  buildPierCastCitySpeciesCards,
  buildPierCastHourlyStrip,
  buildPierCastShiftCards,
  pierCastCityPrimeCount,
  pierCastCityTopPick,
  pierCastCompass,
  rankPierCastCitySpecies,
  splitPierCastCitySpeciesCards,
  pierCastTimelinePoints,
} from "../lib/pierCastCityReportPresentation";
import type {
  PierCastSeasonalBandV4,
  PierCastSpeciesConditionsReadV4,
} from "../lib/pierCastConditionsV4";
import type { PierCastSpeciesId } from "../lib/pierCastContracts";
import { isPrimaryPierCastSpecies } from "../lib/pierCastSpeciesPresentation";

/* A Ludington-like fall week: a sharp drop into Wednesday evening, then recovery. */
const START = Date.parse("2026-09-29T20:00:00Z");
const NOW = START + 10 * 60_000;
const CITY_IDS = ["ludington_mi", "grand_haven_mi", "chicago_il", "frankfort_elberta_mi"];
const KNOTS: Array<[number, number]> = [
  [0, 61.8], [10, 58.4], [20, 55.6], [27, 53.1], [36, 55.4], [47, 59.1],
  [60, 56.9], [72, 57.8], [88, 59.4], [100, 58.6], [120, 58.9],
];
const toC = (f: number) => (f - 32) * 5 / 9;
function rankedSpecies(
  speciesId: PierCastSpeciesId,
  band: PierCastSeasonalBandV4,
  thermalValue: number,
): PierCastSpeciesConditionsReadV4 {
  return {
    speciesId,
    seasonalOutlook: {
      status: "available",
      value: 0.8,
      band,
      stage: "active",
      trend: "steady",
      profileId: "test-profile",
      basis: "regional",
      localDate: "2026-09-29",
      reasonCodes: [],
    },
    thermalMatch: {
      status: "available",
      value: thermalValue,
      band: "excellent",
      temperatureC: 12,
      optimumRangeC: [11, 13],
      distanceFromOptimumC: 0,
      curveId: "test-curve",
      validAt: new Date(START).toISOString(),
      sourceKind: "model",
      reasonCodes: [],
    },
    targetingEligibility: "eligible",
    rankingDisposition: "ranked",
    localFisheryContext: null,
    reasonCodes: [],
  };
}
function tempAt(hour: number): number {
  let k = 0;
  while (k < KNOTS.length - 2 && hour > KNOTS[k + 1]![0]) k += 1;
  const [h0, t0] = KNOTS[k]!;
  const [h1, t1] = KNOTS[k + 1]!;
  return t0 + (t1 - t0) * (hour - h0) / (h1 - h0);
}
function timeline(offsetF: number) {
  return Array.from({ length: 121 }, (_, hour) => ({
    validAt: new Date(START + hour * 3_600_000).toISOString(),
    temperatureC: toC(tempAt(hour) + offsetF),
  }));
}
function report() {
  const outlook = buildPierCastConditionsV4Outlook({
    generatedAt: new Date(START).toISOString(),
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: new Date(START - 3 * 3_600_000).toISOString(),
      fetchedAt: new Date(START).toISOString(),
      cycleAgeHours: 3,
    },
    cities: CITY_IDS.map((cityId, index) => ({
      cityId,
      temperatureTimeline: timeline(index),
      dates: [{ localDate: "2026-09-29" }],
    })),
  } as never);
  return projectPierCastConditionsCityReportV4(outlook, "ludington_mi", "chinook_salmon");
}
const weather = Array.from({ length: 144 }, (_, hour) => {
  const iso = new Date(Date.UTC(2026, 8, 29, hour)).toISOString().slice(0, 13) + ":00";
  return {
    localTime: iso,
    airTemperatureF: 55 + (hour % 24) / 2,
    windSpeedMph: 8 + (hour % 5),
    windDirectionDegrees: (hour * 30) % 360,
  };
});

test("server city report adds a daily outlook and species standings", () => {
  const read = report();
  assert.ok(read.dailyOutlook && read.dailyOutlook.length >= 5);
  assert.equal(read.dailyOutlook[0]!.localDate, "2026-09-29");
  assert.equal(read.dailyOutlook[0]!.temperatureBasis, "current");
  for (const day of read.dailyOutlook.slice(1)) {
    assert.equal(day.temperatureBasis, "daily_mean");
    assert.ok(day.temperatureRangeC[0] <= day.temperatureRangeC[1]);
  }
  const top = pierCastCityTopPick(read.species);
  assert.ok(top && isPrimaryPierCastSpecies(top.speciesId));
  const expectedTop = rankPierCastCitySpecies(
    read.species.filter((species) => isPrimaryPierCastSpecies(species.speciesId)),
  )[0];
  assert.equal(top.speciesId, expectedTop?.speciesId);
  assert.ok(read.speciesStandings && read.speciesStandings.length === read.species.length);
  for (const standing of read.speciesStandings) {
    assert.ok(standing.rank === null || standing.rank <= standing.rankedCityCount);
  }
});

test("five-day calendar shows a species and rating word per day, never a score", () => {
  const read = report();
  const days = buildPierCastCityCalendar({ report: read, weather, now: NOW });
  assert.equal(days.length, 5);
  assert.equal(days[0]!.label, "TODAY");
  assert.equal(days[0]!.best?.speciesId, pierCastCityTopPick(read.species)?.speciesId);
  assert.equal(days[1]!.label, "WED");
  for (const day of days) {
    assert.ok(day.best, `${day.localDate} has a best species`);
    assert.match(day.waterRange ?? "", /^\d+–\d+°$/);
    assert.ok(day.airHighF !== null && day.airLowF !== null);
    assert.equal("score" in day, false);
  }
});

test("a higher-ranked secondary species never becomes today's top pick", () => {
  const species = [
    rankedSpecies("walleye", "excellent", 1),
    rankedSpecies("lake_trout", "good", 0.8),
    rankedSpecies("freshwater_drum", "fair", 0.7),
  ];
  assert.equal(rankPierCastCitySpecies(species)[0]!.speciesId, "walleye");
  assert.equal(pierCastCityTopPick(species)?.speciesId, "lake_trout");
  assert.equal(pierCastCityPrimeCount(species), 0);
});

test("calendar falls back to water ranges when an older server sends no daily outlook", () => {
  const read = { ...report(), dailyOutlook: undefined };
  const days = buildPierCastCityCalendar({ report: read, weather, now: NOW });
  assert.equal(days[0]!.best?.speciesId, pierCastCityTopPick(read.species)?.speciesId);
  assert.equal(days[1]!.best, null);
  assert.equal(days[1]!.bestUnavailable, true);
  assert.ok(days[1]!.waterRange);
});

test("species cards follow the leaderboard rule and carry no numeric score", () => {
  const cards = buildPierCastCitySpeciesCards(report());
  assert.ok(cards.length > 0);
  assert.equal(cards[0]!.rankLabel, "01");
  const order = { excellent: 5, good: 4, fair: 3, poor: 2, usually_off: 1 } as const;
  const ranked = cards.filter((card) => card.ranked && card.band);
  for (let index = 1; index < ranked.length; index += 1) {
    assert.ok(order[ranked[index - 1]!.band!] >= order[ranked[index]!.band!]);
  }
  for (const card of cards) {
    assert.equal("score" in card, false);
    if (card.fit) {
      assert.ok(card.fit.pin >= 0 && card.fit.pin <= 1);
      assert.match(card.idealLine ?? "", /^\d+–\d+°F$/);
    }
  }
});

test("city report keeps only salmon, trout, steelhead and drum in main targets", () => {
  const groups = splitPierCastCitySpeciesCards(buildPierCastCitySpeciesCards(report()));
  assert.ok(groups.mainTargets.length > 0);
  assert.ok(groups.otherSpecies.length > 0);
  assert.ok(groups.mainTargets.every((card) => isPrimaryPierCastSpecies(card.speciesId)));
  assert.ok(groups.otherSpecies.every((card) => !isPrimaryPierCastSpecies(card.speciesId)));
  assert.deepEqual(
    [...groups.mainTargets, ...groups.otherSpecies].map((card) => card.rankLabel),
    Array.from(
      { length: groups.mainTargets.length + groups.otherSpecies.length },
      (_, index) => String(index + 1).padStart(2, "0"),
    ),
  );
});

test("hourly strip starts at now and steps every two hours with wind direction", () => {
  const read = report();
  const today = buildPierCastHourlyStrip({ report: read, weather, localDate: "2026-09-29", now: NOW });
  assert.equal(today[0]!.label, "NOW");
  assert.deepEqual(today.slice(1).map((slot) => slot.label), ["6 PM", "8 PM", "10 PM"]);
  assert.ok(today.every((slot) => slot.windFrom !== null && slot.windArrowDegrees !== null));
  const tomorrow = buildPierCastHourlyStrip({ report: read, weather, localDate: "2026-09-30", now: NOW });
  assert.equal(tomorrow[0]!.label, "6 AM");
  assert.equal(pierCastCompass(315), "NW");
  assert.equal(pierCastCompass(0), "N");
});

test("water-temp shifts read as one plain sentence each", () => {
  const read = report();
  const shifts = buildPierCastShiftCards({ timeline: read.temperatureTimeline, timezone: read.timezone, now: NOW });
  assert.ok(shifts.length >= 1);
  const drop = shifts[0]!;
  assert.equal(drop.direction, "cooling");
  assert.equal(drop.status, "HAPPENING NOW");
  assert.match(drop.title, /^Drop of \d+\.\d°F$/);
  assert.match(drop.change, /^\d+\.\d° → \d+\.\d°F over \d+ hrs?$/);
  assert.match(drop.window, /^now to \w+ \d+ (AM|PM)$/);
  assert.ok(drop.barStart >= 0 && drop.barStart + drop.barWidth <= 1.0001);
});

test("chart model labels days on the x axis and °F on the y axis", () => {
  const read = report();
  const points = pierCastTimelinePoints(read.temperatureTimeline, read.timezone);
  const shifts = buildPierCastShiftCards({ timeline: read.temperatureTimeline, timezone: read.timezone, now: NOW });
  const model = buildPierCastChartModel({
    points,
    shifts,
    todayDate: "2026-09-29",
    layout: { width: 350, height: 262, left: 38, right: 12, top: 32, bottom: 52 },
  });
  assert.ok(model);
  assert.ok(model.yTicks.length >= 3 && model.yTicks.length <= 8);
  for (const tick of model.yTicks) assert.match(tick.label, /^\d+°$/);
  assert.ok(model.lowF <= Math.min(...points.map((point) => point.temperatureF)));
  assert.ok(model.highF >= Math.max(...points.map((point) => point.temperatureF)));
  const labels = model.days.filter((day) => day.visible).map((day) => day.label);
  assert.equal(labels[0], "TODAY");
  assert.ok(labels.includes("WED 30"));
  assert.ok(labels.includes("THU 1"));
  const wed = model.days.find((day) => day.label === "WED 30")!;
  assert.match(wed.range ?? "", /^\d+–\d+°$/);
  assert.equal(model.boundaries.length, model.days.length - 1);
  assert.ok(model.low && model.low.label.startsWith("LOW "));
  assert.ok(model.now?.label.startsWith("NOW "));
  assert.ok(model.shifts.some((shift) => shift.label === "↓ DROP"));
});

test("report screen is city-first: no species selector, no request-a-city, no scores", () => {
  const ui = readFileSync("components/pier-cast/PierCastConditionsUI.tsx", "utf8");
  const screen = readFileSync("app/pier-cast-review.tsx", "utf8");
  assert.doesNotMatch(ui, /PierCastTargetSelector|selectedSpeciesId|PierCastCoverageRequest/);
  assert.doesNotMatch(ui, /score\.toFixed|\/10\b/);
  assert.match(ui, /FiveDayOutlook/);
  assert.match(ui, /Supported species at \$\{report\.displayName\}/);
  assert.match(ui, /PierCastCityTemperatureChart/);
  assert.match(ui, /Water temp shifts/);
  assert.match(ui, /Show all \$\{cards\.length\} species/);
  assert.match(screen, /onOpenStandings=\{openStandingsFor\}/);
});

test("an open city report disables the stack back-swipe", () => {
  const screen = readFileSync("app/pier-cast-review.tsx", "utf8");
  assert.match(screen, /<Stack\.Screen options=\{\{ gestureEnabled: !selectedCityId \}\} \/>/);
  assert.match(screen, /onPress=\{leaveReport\}/);
});

test("a one-city outlook sends no species standings", () => {
  const outlook = buildPierCastConditionsV4Outlook({
    generatedAt: new Date(START).toISOString(),
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: new Date(START - 3 * 3_600_000).toISOString(),
      fetchedAt: new Date(START).toISOString(),
      cycleAgeHours: 3,
    },
    cities: [{ cityId: "ludington_mi", temperatureTimeline: timeline(0), dates: [{ localDate: "2026-09-29" }] }],
  } as never);
  const read = projectPierCastConditionsCityReportV4(outlook, "ludington_mi", "chinook_salmon");
  assert.deepEqual(read.speciesStandings, []);
  assert.ok(buildPierCastCitySpeciesCards(read).every((card) => card.standing === null));
});
