import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  buildPierCastCitySpeciesCards,
} from "../lib/pierCastCityReportPresentation.ts";
import type {
  PierCastSpeciesConditionsReadV4,
} from "../lib/pierCastConditionsV4.ts";
import type { PierCastSpeciesId } from "../lib/pierCastContracts.ts";
import {
  evaluatePierCastOpportunityV5,
  projectPierCastCityReportLabelsV5,
  projectPierCastSpeciesConditionsV5,
} from "../lib/pierCastOpportunityV5.ts";
import { PIER_CAST_SALMONID_AUDIT_SPECIES } from "../lib/pierCastSalmonidCalibrationAuditV18.ts";
import {
  pierCastTemperatureProfileV18,
  pierCastTemperatureSuitabilityV18,
  projectPierCastThermalMatchV18,
} from "../lib/pierCastTemperatureFitV18.ts";
import {
  getPierCastLakeTroutV5Candidate,
  PIER_CAST_LAKE_TROUT_V5_CANDIDATES,
} from "../supabase/functions/_shared/pierCastEngine/config/lakeTroutV5.candidate.ts";
import { PIER_CAST_V3_PAIR_CALIBRATIONS } from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";
import {
  buildPierCastConditionsV4Outlook,
  projectPierCastConditionsCityReportV4,
} from "../supabase/functions/_shared/pierCastEngine/pipeline/conditionsV4.ts";

function sourceSpecies(input: {
  speciesId: PierCastSpeciesId;
  localDate?: string;
  temperatureC?: number;
}): PierCastSpeciesConditionsReadV4 {
  const localDate = input.localDate ?? "2028-10-19";
  const temperatureC = input.temperatureC ?? 5;
  return {
    speciesId: input.speciesId,
    seasonalOutlook: {
      status: "available",
      value: 1,
      band: "excellent",
      stage: "active",
      trend: "steady",
      profileId: "hostile-frozen-server-fixture",
      basis: "regional",
      localDate,
      reasonCodes: [],
    },
    thermalMatch: {
      status: "available",
      value: 1,
      band: "excellent",
      temperatureC,
      optimumRangeC: [0, 1],
      distanceFromOptimumC: 0,
      curveId: "hostile-frozen-server-fixture",
      validAt: `${localDate}T12:00:00.000Z`,
      sourceKind: "model",
      reasonCodes: [],
    },
    targetingEligibility: "eligible",
    rankingDisposition: "ranked",
    localFisheryContext: null,
    reasonCodes: [],
  };
}

test("malformed dates and suitability values fail closed without throwing", () => {
  for (const speciesId of ["chinook_salmon", "lake_trout"] as const) {
    for (const localDate of ["", "not-a-date", "2028-02-30", "2028-13-01"]) {
      assert.doesNotThrow(() =>
        evaluatePierCastOpportunityV5({
          cityId: speciesId === "lake_trout" ? "caseville_mi" : "ludington_mi",
          speciesId,
          localDate,
          thermalValue: 1,
        })
      );
      assert.equal(
        evaluatePierCastOpportunityV5({
          cityId: speciesId === "lake_trout" ? "caseville_mi" : "ludington_mi",
          speciesId,
          localDate,
          thermalValue: 1,
        }),
        null,
      );
    }
    for (
      const thermalValue of [
        Number.NaN,
        Number.POSITIVE_INFINITY,
        Number.NEGATIVE_INFINITY,
        -0.01,
        1.01,
      ]
    ) {
      const result = evaluatePierCastOpportunityV5({
        cityId: speciesId === "lake_trout" ? "caseville_mi" : "ludington_mi",
        speciesId,
        localDate: "2028-10-19",
        thermalValue,
      });
      assert.ok(result, `${speciesId}/${String(thermalValue)}`);
      assert.equal(result.score, null, `${speciesId}/${String(thermalValue)}`);
    }
  }
});

test("out-of-domain legacy water is explicitly unavailable and cannot leave a city rated", () => {
  for (
    const temperatureC of [-100, 100, Number.NaN, Number.POSITIVE_INFINITY]
  ) {
    const source = sourceSpecies({ speciesId: "lake_trout", temperatureC });
    const thermal = projectPierCastThermalMatchV18(
      "lake_trout",
      source.thermalMatch,
    );
    assert.equal(thermal.status, "unavailable");
    assert.ok(thermal.reasonCodes.includes("temperature_out_of_domain"));
    const projected = projectPierCastSpeciesConditionsV5({
      cityId: "caseville_mi",
      species: source,
    });
    assert.ok(projected.evaluation);
    assert.equal(projected.evaluation.score, null);
    assert.equal(projected.species.rankingDisposition, "unranked");
    const card = buildPierCastCitySpeciesCards({
      species: [projected.species],
    })[0]!;
    assert.equal(card.rated, false);
    assert.equal(card.waterLine, null);
    assert.equal(card.seasonLine, "Water temp outside model range");
  }
});

test("all six lake-trout research holds override a hostile ranked legacy row", () => {
  const holds = PIER_CAST_LAKE_TROUT_V5_CANDIDATES.filter((candidate) =>
    candidate.decision === "research_hold"
  );
  assert.equal(holds.length, 6);
  for (const hold of holds) {
    const first = projectPierCastSpeciesConditionsV5({
      cityId: hold.cityId,
      species: sourceSpecies({ speciesId: "lake_trout" }),
    });
    assert.equal(first.evaluation, null, hold.cityId);
    assert.equal(first.species.targetingEligibility, "unknown", hold.cityId);
    assert.equal(first.species.rankingDisposition, "unranked", hold.cityId);
    assert.ok(
      first.species.reasonCodes.includes("lake_trout_research_hold"),
      hold.cityId,
    );
    assert.ok(first.species.reasonCodes.includes("targeting_unknown"));
    const card = buildPierCastCitySpeciesCards({
      species: [first.species],
    })[0]!;
    assert.equal(card.rated, false, hold.cityId);
    assert.equal(
      card.seasonLine,
      "Local pier evidence still under review",
      hold.cityId,
    );
    assert.deepEqual(
      projectPierCastSpeciesConditionsV5({
        cityId: hold.cityId,
        species: first.species,
      }),
      first,
      `${hold.cityId} projection must be idempotent`,
    );
  }
});

test("every scored salmonid projection is idempotent at the calibrated fall shoulder", () => {
  const pairs = [
    ...PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) =>
      pair.speciesId !== "lake_trout" &&
      PIER_CAST_SALMONID_AUDIT_SPECIES.includes(
        pair.speciesId as typeof PIER_CAST_SALMONID_AUDIT_SPECIES[number],
      )
    ).map((pair) => ({
      cityId: pair.cityId,
      speciesId: pair.speciesId,
    })),
    ...PIER_CAST_LAKE_TROUT_V5_CANDIDATES.filter((candidate) =>
      candidate.decision !== "research_hold"
    ).map((candidate) => ({
      cityId: candidate.cityId,
      speciesId: "lake_trout" as const,
    })),
  ];
  assert.equal(pairs.length, 151);
  for (const pair of pairs) {
    const profile = pierCastTemperatureProfileV18(pair.speciesId)!;
    const temperatureC = (profile.optimumRangeC[0] +
      profile.optimumRangeC[1]) / 2;
    const first = projectPierCastSpeciesConditionsV5({
      cityId: pair.cityId,
      species: sourceSpecies({
        speciesId: pair.speciesId,
        temperatureC,
      }),
    });
    const second = projectPierCastSpeciesConditionsV5({
      cityId: pair.cityId,
      species: first.species,
    });
    assert.deepEqual(second, first, `${pair.cityId}/${pair.speciesId}`);
  }
});

test("all salmonid thermal curves are finite in-domain and reject both outer edges", () => {
  for (const speciesId of PIER_CAST_SALMONID_AUDIT_SPECIES) {
    const profile = pierCastTemperatureProfileV18(speciesId)!;
    const [minimum, maximum] = profile.acceptedDomainC;
    for (
      let temperatureC = minimum;
      temperatureC <= maximum;
      temperatureC = Math.round((temperatureC + 0.25) * 100) / 100
    ) {
      const suitability = pierCastTemperatureSuitabilityV18(
        speciesId,
        temperatureC,
      );
      assert.ok(suitability !== null, `${speciesId}/${temperatureC}`);
      assert.ok(Number.isFinite(suitability), `${speciesId}/${temperatureC}`);
      assert.ok(suitability >= 0 && suitability <= 1);
    }
    assert.equal(
      pierCastTemperatureSuitabilityV18(speciesId, minimum - 0.001),
      null,
    );
    assert.equal(
      pierCastTemperatureSuitabilityV18(speciesId, maximum + 0.001),
      null,
    );
  }
});

test("a complete city report projection is stable, rank-free, and score-free", () => {
  const generatedAt = "2028-10-19T16:00:00.000Z";
  const source = buildPierCastConditionsV4Outlook({
    generatedAt,
    source: {
      status: "fresh_archived_complete_cycle",
      productId: "NOAA_NOS_LMHOFS_REGULARGRID",
      issuedAt: "2028-10-19T13:00:00.000Z",
      fetchedAt: generatedAt,
      cycleAgeHours: 3,
    },
    cities: [{
      cityId: "ludington_mi",
      temperatureTimeline: Array.from({ length: 121 }, (_, hour) => ({
        validAt: new Date(Date.parse(generatedAt) + hour * 3_600_000)
          .toISOString(),
        temperatureC: 10,
      })),
      dates: [{ localDate: "2028-10-19" }],
    }],
  } as never);
  const raw = projectPierCastConditionsCityReportV4(
    source,
    "ludington_mi",
    "chinook_salmon",
  );
  const first = projectPierCastCityReportLabelsV5(raw);
  const second = projectPierCastCityReportLabelsV5(first);
  assert.deepEqual(second, first);
  assert.deepEqual(first.speciesStandings, []);
  assert.equal(JSON.stringify(first).includes('"score"'), false);
  assert.ok(
    first.species.every((species) =>
      species.rankingDisposition !== "ranked" ||
      species.seasonalOutlook.status === "available"
    ),
  );
});

test("Pass 6 keeps accessibility, stale-request, and old-client guards in shipping paths", () => {
  const ui = readFileSync(
    "components/pier-cast/PierCastConditionsUI.tsx",
    "utf8",
  );
  const statStrip = readFileSync(
    "components/pier-cast/PierCastStatStrip.tsx",
    "utf8",
  );
  const screen = readFileSync("app/pier-cast-review.tsx", "utf8");
  const client = readFileSync("lib/pierCast.ts", "utf8");
  const server = readFileSync(
    "supabase/functions/pier-cast/handler.ts",
    "utf8",
  );
  assert.match(statStrip, /fontScale >= STACK_AT_FONT_SCALE/);
  assert.match(statStrip, /accessibilityLabel=\{spoken\}/);
  assert.match(ui, /accessibilityLabel=\{`\$\{card\.name\}/);
  assert.match(screen, /cityReportRequest\.current !== reportRequestId/);
  assert.match(screen, /requestedCity\.current !== cityId/);
  assert.match(client, /projectPierCastCityReportLabelsV5/);
  assert.match(client, /rank: null/);
  assert.match(server, /Deprecation": "true"/);
  assert.match(server, /score-v3-compatibility/);
  assert.doesNotMatch(
    `${ui}\n${statStrip}`,
    /past peak|tad bit warm|slightly warm|#\d+ out of|IN STANDINGS/i,
  );
  assert.equal(
    getPierCastLakeTroutV5Candidate("michigan_city_in")?.decision,
    "research_hold",
  );
});
