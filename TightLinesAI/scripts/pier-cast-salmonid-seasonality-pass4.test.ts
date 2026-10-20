import assert from "node:assert/strict";
import test from "node:test";

import {
  evaluatePierCastOpportunityV5,
  getPierCastOpportunityPairV5,
} from "../lib/pierCastOpportunityV5.ts";
import { pierCastOpportunityLabelV5 } from "../lib/pierCastOpportunityPresentationV5.ts";
import { applyPierCastSalmonidBatch1V5 } from "../lib/pierCastSalmonidBatch1V5.ts";
import { applyPierCastSalmonidBatch2V5 } from "../lib/pierCastSalmonidBatch2V5.ts";
import {
  applyPierCastSalmonidSeasonalityV18,
  PIER_CAST_V18_COHO_TAPER_PAIR_KEYS,
  PIER_CAST_V18_STRONG_CHINOOK_TAIL_CITY_IDS,
  pierCastLakeTroutMonthlyAvailabilityV18,
} from "../lib/pierCastSalmonidSeasonalityV18.ts";
import {
  getPierCastLakeTroutV5Candidate,
  PIER_CAST_LAKE_TROUT_V5_CANDIDATES,
} from "../supabase/functions/_shared/pierCastEngine/config/lakeTroutV5.candidate.ts";
import { PIER_CAST_V3_PAIR_CALIBRATIONS } from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";

const SPECIES = new Set([
  "chinook_salmon",
  "coho_salmon",
  "steelhead",
  "brown_trout",
  "atlantic_salmon",
]);

function evaluation(
  cityId: string,
  speciesId:
    | "chinook_salmon"
    | "coho_salmon"
    | "steelhead"
    | "brown_trout"
    | "lake_trout"
    | "atlantic_salmon",
  localDate: string,
) {
  const result = evaluatePierCastOpportunityV5({
    cityId,
    speciesId,
    localDate,
    thermalValue: 1,
  });
  assert.ok(result, `${cityId}/${speciesId} should evaluate on ${localDate}`);
  return result;
}

test("Pass 4 preserves every reviewed fishery-strength ceiling and evidence list", () => {
  for (
    const base of PIER_CAST_V3_PAIR_CALIBRATIONS.filter((pair) =>
      SPECIES.has(pair.speciesId)
    )
  ) {
    const before = applyPierCastSalmonidBatch2V5(
      applyPierCastSalmonidBatch1V5(base),
    );
    const after = applyPierCastSalmonidSeasonalityV18(before);
    assert.equal(after.modes.length, before.modes.length, base.pairKey);
    assert.equal(
      Math.max(...after.modes.map((mode) => mode.fisheryStrength)),
      Math.max(...before.modes.map((mode) => mode.fisheryStrength)),
      base.pairKey,
    );
    for (const mode of after.modes) {
      const prior = before.modes.find((candidate) =>
        candidate.modeId === mode.modeId
      );
      assert.ok(prior, `${base.pairKey}/${mode.modeId}`);
      assert.equal(mode.fisheryStrength, prior.fisheryStrength, base.pairKey);
      assert.deepEqual(mode.fisheryEvidenceIds, prior.fisheryEvidenceIds);
      assert.equal(mode.thermalCurveId, prior.thermalCurveId);
    }
  }
  assert.equal(
    PIER_CAST_V3_PAIR_CALIBRATIONS.some((pair) =>
      pair.modes.some((mode) =>
        mode.modeCalibrationId.includes("seasonality_1_18")
      )
    ),
    false,
  );
});

test("strong Chinook fisheries remain Fair in the late-October taper without a blanket uplift", () => {
  for (const cityId of PIER_CAST_V18_STRONG_CHINOOK_TAIL_CITY_IDS) {
    const october19 = evaluation(
      cityId,
      "chinook_salmon",
      "2028-10-19",
    );
    assert.equal(pierCastOpportunityLabelV5(october19.score!), "Fair", cityId);
    assert.equal(october19.timing, "past", cityId);
    assert.ok(october19.score! <= 5, cityId);
    const november15 = evaluation(
      cityId,
      "chinook_salmon",
      "2028-11-15",
    );
    assert.equal(
      pierCastOpportunityLabelV5(november15.score!),
      "Limited",
      cityId,
    );
  }
  assert.equal(
    pierCastOpportunityLabelV5(
      evaluation(
        "grand_haven_mi",
        "chinook_salmon",
        "2028-10-19",
      ).score!,
    ),
    "Limited",
  );
  assert.equal(
    pierCastOpportunityLabelV5(
      evaluation("st_joseph_mi", "chinook_salmon", "2028-10-19").score!,
    ),
    "Limited",
  );
});

test("lake trout build through October and retain the approved November high point", () => {
  const casevilleOctober = evaluation(
    "caseville_mi",
    "lake_trout",
    "2028-10-19",
  );
  assert.equal(pierCastOpportunityLabelV5(casevilleOctober.score!), "Fair");
  assert.equal(casevilleOctober.timing, "approaching");
  assert.ok(casevilleOctober.availability < 0.75);

  const harborBeachOctober = evaluation(
    "harbor_beach_mi",
    "lake_trout",
    "2028-10-19",
  );
  assert.equal(pierCastOpportunityLabelV5(harborBeachOctober.score!), "Fair");
  assert.equal(harborBeachOctober.timing, "approaching");

  for (const cityId of ["caseville_mi", "harbor_beach_mi"] as const) {
    const november = evaluation(cityId, "lake_trout", "2028-11-15");
    assert.equal(pierCastOpportunityLabelV5(november.score!), "Good");
    assert.equal(november.timing, "peak");
  }

  const caseville = getPierCastLakeTroutV5Candidate("caseville_mi")!;
  assert.equal(pierCastLakeTroutMonthlyAvailabilityV18(caseville)?.[9], 0.65);
  assert.equal(pierCastLakeTroutMonthlyAvailabilityV18(caseville)?.[10], 1);
  for (
    const hold of PIER_CAST_LAKE_TROUT_V5_CANDIDATES.filter((candidate) =>
      candidate.decision === "research_hold"
    )
  ) {
    assert.equal(pierCastLakeTroutMonthlyAvailabilityV18(hold), null);
    assert.equal(
      evaluatePierCastOpportunityV5({
        cityId: hold.cityId,
        speciesId: "lake_trout",
        localDate: "2028-11-15",
        thermalValue: 1,
      }),
      null,
    );
  }
});

test("coho, steelhead, brown trout, and Atlantic tapers no longer collapse at November 1", () => {
  for (const pairKey of PIER_CAST_V18_COHO_TAPER_PAIR_KEYS) {
    const [cityId] = pairKey.split("/");
    const october15 = evaluation(cityId!, "coho_salmon", "2028-10-15");
    const november1 = evaluation(cityId!, "coho_salmon", "2028-11-01");
    assert.ok(
      october15.phaseAvailability - november1.phaseAvailability <= 0.200001,
      pairKey,
    );
    assert.notEqual(pierCastOpportunityLabelV5(november1.score!), "Prime");
  }

  for (
    const [cityId, speciesId] of [
      ["harbor_beach_mi", "steelhead"],
      ["port_sanilac_mi", "brown_trout"],
      ["harbor_beach_mi", "atlantic_salmon"],
    ] as const
  ) {
    const october15 = evaluation(cityId, speciesId, "2028-10-15");
    const november1 = evaluation(cityId, speciesId, "2028-11-01");
    assert.ok(
      october15.phaseAvailability - november1.phaseAvailability < 0.25,
      `${cityId}/${speciesId}`,
    );
  }
});

test("season phase is annual-pair relative while the frozen mode value remains intact", () => {
  const charlevoix = evaluation(
    "charlevoix_mi",
    "chinook_salmon",
    "2028-07-15",
  );
  assert.equal(charlevoix.availability, 1);
  assert.ok(charlevoix.phaseAvailability < 0.75);
  assert.equal(charlevoix.timing, "past");

  const pair = getPierCastOpportunityPairV5({
    cityId: "charlevoix_mi",
    speciesId: "chinook_salmon",
  });
  assert.ok(pair);
  assert.equal(
    Math.max(...pair.modes.map((mode) => mode.fisheryStrength)),
    7.2,
  );
});
