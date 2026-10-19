import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  pierCastLegacyTimingCodeV5,
  pierCastOpportunityLabelV5,
  pierCastOpportunityPresentationV5,
  pierCastSeasonTimingLabelFromLegacyCodeV5,
  pierCastSeasonTimingLabelV5,
} from "../lib/pierCastOpportunityPresentationV5.ts";
import { PIER_CAST_STANDINGS_BANDS } from "../lib/pierCastStandingsPresentation.ts";

const season = (
  availability: number,
  trend: "building" | "steady" | "fading",
) =>
  pierCastSeasonTimingLabelV5({
    availability,
    trend,
    regulationOpen: true,
    accessOpen: true,
  });

test("1.18 presents four opportunity labels without changing score thresholds", () => {
  assert.equal(pierCastOpportunityLabelV5(8.0001), "Prime");
  assert.equal(pierCastOpportunityLabelV5(8), "Good");
  assert.equal(pierCastOpportunityLabelV5(6.0001), "Good");
  assert.equal(pierCastOpportunityLabelV5(6), "Fair");
  assert.equal(pierCastOpportunityLabelV5(4.0001), "Fair");
  assert.equal(pierCastOpportunityLabelV5(4), "Limited");
  assert.equal(PIER_CAST_STANDINGS_BANDS.poor.label, "Limited");
  assert.equal(PIER_CAST_STANDINGS_BANDS.usually_off.label, "Limited");
});

test("season phase is absolute first and directional second", () => {
  assert.equal(season(0.9, "building"), "Peak window");
  assert.equal(season(0.75, "fading"), "Peak window");
  assert.equal(season(0.749, "building"), "Building");
  assert.equal(season(0.6, "steady"), "In season");
  assert.equal(season(0.6, "fading"), "Tapering");
  assert.equal(season(0.049, "building"), "Outside main window");
  assert.equal(
    pierCastSeasonTimingLabelV5({
      availability: 1,
      trend: "steady",
      regulationOpen: false,
      accessOpen: true,
    }),
    "Outside main window",
  );
});

test("season phase never caps today's opportunity label", () => {
  assert.deepEqual(
    pierCastOpportunityPresentationV5({
      internalScore: 8.2,
      availability: 0.6,
      trend: "fading",
      regulationOpen: true,
      accessOpen: true,
    }),
    { label: "Prime", timing: "Tapering" },
  );
  assert.deepEqual(
    pierCastOpportunityPresentationV5({
      internalScore: 4.5,
      availability: 0.6,
      trend: "building",
      regulationOpen: true,
      accessOpen: true,
    }),
    { label: "Fair", timing: "Building" },
  );
  assert.deepEqual(
    pierCastOpportunityPresentationV5({
      internalScore: 3.5,
      availability: 0.8,
      trend: "steady",
      regulationOpen: true,
      accessOpen: true,
    }),
    { label: "Limited", timing: "Peak window" },
  );
  assert.deepEqual(
    pierCastOpportunityPresentationV5({
      internalScore: 4.5,
      availability: 0.01,
      trend: "steady",
      regulationOpen: true,
      accessOpen: true,
    }),
    { label: "Fair", timing: "Outside main window" },
  );
});

test("frozen timing tokens round-trip to the 1.18 phase vocabulary", () => {
  const cases = [
    [0.01, "steady", "off", "Outside main window"],
    [0.5, "building", "approaching", "Building"],
    [0.8, "fading", "peak", "Peak window"],
    [0.5, "fading", "past", "Tapering"],
    [0.5, "steady", "in_season", "In season"],
  ] as const;
  for (const [availability, trend, code, label] of cases) {
    const legacy = pierCastLegacyTimingCodeV5({
      availability,
      trend,
      regulationOpen: true,
      accessOpen: true,
    });
    assert.equal(legacy, code);
    assert.equal(pierCastSeasonTimingLabelFromLegacyCodeV5(legacy), label);
  }
});

test("shipping PierCast copy contains no retired opportunity language", () => {
  const sources = [
    "../components/pier-cast/PierCastConditionsUI.tsx",
    "../components/pier-cast/PierCastStatStrip.tsx",
    "../lib/pierCastCityReportPresentation.ts",
    "../lib/pierCastStandingsPresentation.ts",
  ].map((path) => readFileSync(new URL(path, import.meta.url), "utf8")).join("\n");
  assert.doesNotMatch(
    sources,
    /Past peak|Approaching peak|Peak season|Off[- ]season|Prime, Good, Fair or Poor/,
  );
  assert.match(sources, /Prime, Good, Fair or Limited/);
  assert.match(sources, /Outside main window/);
});
