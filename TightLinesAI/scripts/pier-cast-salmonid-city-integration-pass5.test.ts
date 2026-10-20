import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildPierCastSalmonidCityIntegrationAuditV18,
  PIER_CAST_SALMONID_CITY_INTEGRATION_DATES,
} from "../lib/pierCastSalmonidCityIntegrationAuditV18.ts";
import { PIER_CAST_SALMONID_AUDIT_SPECIES } from "../lib/pierCastSalmonidCalibrationAuditV18.ts";
import { PIER_CAST_V3_CITY_IDS } from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";

const report = buildPierCastSalmonidCityIntegrationAuditV18();

test("Pass 5 covers every city, supported salmonid pair, boundary date, and thermal knot", () => {
  assert.equal(report.coverage.cityCount, 32);
  assert.equal(report.coverage.cityCount, PIER_CAST_V3_CITY_IDS.length);
  assert.equal(report.coverage.speciesCount, 6);
  assert.equal(
    report.coverage.speciesCount,
    PIER_CAST_SALMONID_AUDIT_SPECIES.length,
  );
  assert.equal(report.coverage.pairCount, 157);
  assert.equal(report.coverage.scoredPairCount, 151);
  assert.equal(report.coverage.researchHoldPairCount, 6);
  assert.equal(
    report.coverage.dateCount,
    PIER_CAST_SALMONID_CITY_INTEGRATION_DATES.length,
  );
  assert.equal(report.coverage.dateCount, 19);
  assert.equal(
    report.coverage.auditedRowCount,
    report.coverage.expectedRowCount,
  );
  assert.equal(report.cities.length, 32);
  assert.ok(report.cities.every((city) => city.pairCount > 0));
  assert.ok(report.cities.every((city) => city.auditedRowCount > 0));
});

test("all city-report integration rows agree on Today, Season, water fit, closures, and holds", () => {
  assert.equal(report.errorCount, 0);
  assert.deepEqual(report.findings, []);
  assert.ok(report.coverage.scoredRowCount > 0);
  assert.ok(report.coverage.closedRowCount > 0);
  assert.ok(report.coverage.researchHoldRowCount > 0);
  assert.equal(
    report.coverage.unavailableTemperatureRowCount,
    report.coverage.pairCount * report.coverage.dateCount,
  );
  assert.ok(report.cities.every((city) => city.errorCount === 0));
});

test("fresh, saved, future-day, and landing paths all use the bundled 1.18 projection", () => {
  const client = readFileSync("lib/pierCast.ts", "utf8");
  const presentation = readFileSync(
    "lib/pierCastCityReportPresentation.ts",
    "utf8",
  );
  const projection = readFileSync("lib/pierCastOpportunityV5.ts", "utf8");
  assert.match(
    client,
    /report: projectPierCastCityReportLabelsV5\(envelope\.report\)/,
  );
  assert.match(
    client,
    /const labelsOnly = projectPierCastCityReportLabelsV5\(saved\.envelope\.report\)/,
  );
  assert.match(client, /projectPierCastLeaderboardV5\(leaderboard\)/);
  assert.match(client, /projectPierCastLakeTroutStandingsV5/);
  assert.match(client, /rank: null/);
  assert.match(presentation, /evaluatePierCastOpportunityV5\(\{/);
  assert.match(presentation, /entry\.representativeTemperatureC/);
  assert.match(projection, /speciesStandings: \[\]/);
});

test("the 1.18 city report presents the three signals without stale ranking or discouraging copy", () => {
  const ui = readFileSync(
    "components/pier-cast/PierCastConditionsUI.tsx",
    "utf8",
  );
  const statStrip = readFileSync(
    "components/pier-cast/PierCastStatStrip.tsx",
    "utf8",
  );
  const cityReportSurface = `${ui}\n${statStrip}`;
  const screen = readFileSync("app/pier-cast-review.tsx", "utf8");
  assert.match(cityReportSurface, />TODAY</);
  assert.match(cityReportSurface, />SEASON</);
  assert.match(ui, /WATER TODAY/);
  assert.match(ui, /Prime, Good, Fair or Limited/);
  assert.match(
    ui,
    /Building, Peak window, In season, Tapering or Outside main window/,
  );
  assert.doesNotMatch(
    cityReportSurface,
    /past peak|tad bit warm|slightly warm/i,
  );
  assert.doesNotMatch(
    cityReportSurface,
    /IN STANDINGS|#\d+ out of|LEADERBOARD/,
  );
  assert.doesNotMatch(screen, /onOpenStandings|PierCastStandings/);
});

test("Pass 5 output is deterministic", () => {
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(report))
    .digest("hex");
  assert.match(fingerprint, /^[a-f0-9]{64}$/);
  assert.equal(
    fingerprint,
    "dcb3d44677a70243285ce28f785e023f51fbb4f8d94a998ce3b74d3c95f54ab8",
  );
});
