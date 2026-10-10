import { strict as assert } from "node:assert";
import {
  getPierCastLakeTroutV5Candidate,
  PIER_CAST_LAKE_TROUT_V5_APP_ENABLED,
  PIER_CAST_LAKE_TROUT_V5_CANDIDATES,
  PIER_CAST_LAKE_TROUT_V5_SERVER_RUNTIME_ENABLED,
} from "../config/lakeTroutV5.candidate.ts";
import { PIER_CAST_V3_CITY_IDS } from "../config/v3Calibration.ts";
import {
  pierCastOpportunityLabelV5,
  pierCastOpportunityPresentationV5,
  pierCastSeasonTimingLabelV5,
} from "../../../../../lib/pierCastOpportunityPresentationV5.ts";

Deno.test("lake-trout v5 covers every city, is app-enabled, and remains server-disabled", () => {
  assert.equal(PIER_CAST_LAKE_TROUT_V5_APP_ENABLED, true);
  assert.equal(PIER_CAST_LAKE_TROUT_V5_SERVER_RUNTIME_ENABLED, false);
  assert.equal(PIER_CAST_LAKE_TROUT_V5_CANDIDATES.length, 32);
  assert.equal(
    new Set(PIER_CAST_LAKE_TROUT_V5_CANDIDATES.map((row) => row.cityId)).size,
    32,
  );
  assert.deepEqual(
    [...PIER_CAST_LAKE_TROUT_V5_CANDIDATES.map((row) => row.cityId)].sort(),
    [...PIER_CAST_V3_CITY_IDS].sort(),
  );
  assert.deepEqual(
    [1, 2, 3].map((batch) =>
      PIER_CAST_LAKE_TROUT_V5_CANDIDATES.filter((row) => row.batch === batch)
        .length
    ),
    [10, 10, 12],
  );
});

Deno.test("numeric and hold decisions never invent zero scores", () => {
  const numeric = PIER_CAST_LAKE_TROUT_V5_CANDIDATES.filter((row) =>
    row.fisheryStrength !== null
  );
  const holds = PIER_CAST_LAKE_TROUT_V5_CANDIDATES.filter((row) =>
    row.decision === "research_hold"
  );
  assert.equal(numeric.length, 26);
  assert.equal(holds.length, 6);
  assert.ok(
    numeric.every((row) =>
      row.fisheryStrength! >= 4.2 && row.fisheryStrength! <= 7.2
    ),
  );
  assert.ok(
    holds.every((row) =>
      row.fisheryStrength === null && row.monthlyAvailability === null
    ),
  );
});

Deno.test("November is strongest and December remains solid where lake trout are legally open", () => {
  for (const row of PIER_CAST_LAKE_TROUT_V5_CANDIDATES) {
    if (
      !row.monthlyAvailability ||
      (row.closedMonths as readonly number[]).includes(11)
    ) continue;
    assert.equal(row.monthlyAvailability[10], 1, row.cityName);
    assert.ok(row.monthlyAvailability[11] >= 0.85, row.cityName);
    assert.ok(
      row.monthlyAvailability[0] > 0 && row.monthlyAvailability[1] > 0,
      row.cityName,
    );
  }
});

Deno.test("Harbor Beach and Caseville are Good at their internal peak", () => {
  const harborBeach = getPierCastLakeTroutV5Candidate("harbor_beach_mi");
  const caseville = getPierCastLakeTroutV5Candidate("caseville_mi");
  assert.equal(harborBeach?.fisheryStrength, 7.2);
  assert.equal(caseville?.fisheryStrength, 6.8);
  assert.equal(
    pierCastOpportunityLabelV5(harborBeach!.fisheryStrength!),
    "Good",
  );
  assert.equal(pierCastOpportunityLabelV5(caseville!.fisheryStrength!), "Good");
});

Deno.test("v5 exposes labels and directional timing, never ambiguous shoulder wording", () => {
  assert.equal(pierCastOpportunityLabelV5(8.1), "Prime");
  assert.equal(pierCastOpportunityLabelV5(6.1), "Good");
  assert.equal(pierCastOpportunityLabelV5(4.1), "Fair");
  assert.equal(pierCastOpportunityLabelV5(4), "Poor");
  assert.equal(
    pierCastSeasonTimingLabelV5({
      availability: 0.9,
      trend: "steady",
      regulationOpen: true,
      accessOpen: true,
    }),
    "Peak season",
  );
  assert.equal(
    pierCastSeasonTimingLabelV5({
      availability: 0.6,
      trend: "building",
      regulationOpen: true,
      accessOpen: true,
    }),
    "Approaching peak",
  );
  assert.equal(
    pierCastSeasonTimingLabelV5({
      availability: 0.6,
      trend: "fading",
      regulationOpen: true,
      accessOpen: true,
    }),
    "Past peak",
  );
  assert.equal(
    pierCastSeasonTimingLabelV5({
      availability: 0.6,
      trend: "steady",
      regulationOpen: true,
      accessOpen: true,
    }),
    "In season",
  );
  assert.equal(
    pierCastSeasonTimingLabelV5({
      availability: 1,
      trend: "steady",
      regulationOpen: false,
      accessOpen: true,
    }),
    "Off season",
  );
  const presentation = pierCastOpportunityPresentationV5({
    internalScore: 7.2,
    availability: 1,
    trend: "steady",
    regulationOpen: true,
    accessOpen: true,
  });
  assert.deepEqual(presentation, { label: "Good", timing: "Peak season" });
  assert.equal("score" in presentation, false);
  assert.equal("displayText" in presentation, false);
});
