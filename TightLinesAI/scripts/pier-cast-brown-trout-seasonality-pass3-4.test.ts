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
  applyPierCastSalmonidSeasonalityV18BeforeBrownTroutPass3,
  PIER_CAST_V18_BROWN_TROUT_CORRECTION_CITY_IDS,
} from "../lib/pierCastSalmonidSeasonalityV18.ts";
import { pierCastTemperatureSuitabilityV18 } from "../lib/pierCastTemperatureFitV18.ts";
import { buildPierCastCatalog } from "../supabase/functions/_shared/pierCastEngine/config/catalog.ts";
import { PIER_CAST_V3_PAIR_CALIBRATIONS } from "../supabase/functions/_shared/pierCastEngine/config/v3Calibration.ts";

const SOUTHERN_WISCONSIN = [
  "kenosha_wi",
  "milwaukee_wi",
  "port_washington_wi",
  "racine_wi",
] as const;
const NORTHERN_WISCONSIN = [
  "algoma_wi",
  "kewaunee_wi",
  "manitowoc_wi",
  "two_rivers_wi",
] as const;
const PUBLIC_BROWN_TROUT_CITY_IDS = buildPierCastCatalog("public", "v3").cities
  .filter((city) =>
    city.species.some((species) => species.speciesId === "brown_trout")
  )
  .map((city) => city.cityId)
  .sort();

function beforePass3(cityId: string) {
  const base = PIER_CAST_V3_PAIR_CALIBRATIONS.find((pair) =>
    pair.cityId === cityId && pair.speciesId === "brown_trout"
  );
  assert.ok(base, cityId);
  return applyPierCastSalmonidSeasonalityV18BeforeBrownTroutPass3(
    applyPierCastSalmonidBatch2V5(applyPierCastSalmonidBatch1V5(base)),
  );
}

function evaluation(cityId: string, localDate: string, thermalValue = 1) {
  const result = evaluatePierCastOpportunityV5({
    cityId,
    speciesId: "brown_trout",
    localDate,
    thermalValue,
  });
  assert.ok(result, `${cityId}/${localDate}`);
  assert.equal(result.closed, false, `${cityId}/${localDate}`);
  assert.notEqual(result.score, null, `${cityId}/${localDate}`);
  return result;
}

function datesIn2028(): string[] {
  const dates: string[] = [];
  for (
    let instant = Date.UTC(2028, 0, 1, 12);
    new Date(instant).getUTCFullYear() === 2028;
    instant += 86_400_000
  ) {
    dates.push(new Date(instant).toISOString().slice(0, 10));
  }
  return dates;
}

test("Pass 3 changes exactly the eight evidence-approved Wisconsin brown-trout pairs", () => {
  assert.deepEqual(
    [...PIER_CAST_V18_BROWN_TROUT_CORRECTION_CITY_IDS].sort(),
    [...SOUTHERN_WISCONSIN, ...NORTHERN_WISCONSIN].sort(),
  );
  assert.equal(PUBLIC_BROWN_TROUT_CITY_IDS.length, 27);

  for (const cityId of PUBLIC_BROWN_TROUT_CITY_IDS) {
    const before = beforePass3(cityId);
    const after = getPierCastOpportunityPairV5({
      cityId,
      speciesId: "brown_trout",
    });
    assert.ok(after, cityId);
    const corrected =
      (PIER_CAST_V18_BROWN_TROUT_CORRECTION_CITY_IDS as readonly string[])
        .includes(cityId);
    if (corrected) {
      assert.notDeepEqual(after.modes, before.modes, cityId);
    } else {
      assert.deepEqual(
        after,
        before,
        `${cityId} moved without evidence approval`,
      );
    }
  }
});

test("Pass 3 preserves every brown-trout ceiling, mode count, evidence list, and thermal curve", () => {
  for (const cityId of PIER_CAST_V18_BROWN_TROUT_CORRECTION_CITY_IDS) {
    const before = beforePass3(cityId);
    const after = getPierCastOpportunityPairV5({
      cityId,
      speciesId: "brown_trout",
    });
    assert.ok(after, cityId);
    assert.equal(after.modes.length, before.modes.length, cityId);
    assert.equal(
      Math.max(...after.modes.map((mode) => mode.fisheryStrength)),
      Math.max(...before.modes.map((mode) => mode.fisheryStrength)),
      cityId,
    );
    for (const mode of after.modes) {
      const prior = before.modes.find((candidate) =>
        candidate.modeId === mode.modeId
      );
      assert.ok(prior, `${cityId}/${mode.modeId}`);
      assert.equal(mode.fisheryStrength, prior.fisheryStrength, cityId);
      assert.deepEqual(
        mode.fisheryEvidenceIds,
        prior.fisheryEvidenceIds,
        cityId,
      );
      assert.equal(mode.evidenceGrade, prior.evidenceGrade, cityId);
      assert.equal(mode.thermalCurveId, prior.thermalCurveId, cityId);
    }
  }
});

test("southern Wisconsin now builds conservatively through October without a label floor", () => {
  for (const cityId of SOUTHERN_WISCONSIN) {
    const october20 = evaluation(cityId, "2028-10-20");
    assert.equal(october20.timing, "approaching", cityId);
    assert.ok(october20.phaseAvailability >= 0.14, cityId);
    assert.ok(october20.phaseAvailability <= 0.16, cityId);
    assert.equal(
      pierCastOpportunityLabelV5(october20.score!),
      "Limited",
      cityId,
    );
    assert.ok(october20.score! < 2.1, cityId);
  }
});

test("northern Wisconsin fall modes end explicitly and hand off smoothly to winter", () => {
  for (const cityId of NORTHERN_WISCONSIN) {
    const pair = getPierCastOpportunityPairV5({
      cityId,
      speciesId: "brown_trout",
    });
    assert.ok(pair, cityId);
    const fall = pair.modes.find((mode) => mode.modeId === "fall_harbor");
    assert.ok(fall, cityId);
    assert.deepEqual(fall.availabilityKnots.at(-1), {
      monthDay: "12-31",
      availability: 0,
    });
    const december20 = evaluation(cityId, "2028-12-20");
    const december31 = evaluation(cityId, "2028-12-31");
    assert.equal(december20.modeId, "fall_harbor", cityId);
    assert.equal(december31.modeId, "spring_nearshore", cityId);
    assert.ok(
      Math.abs(december20.score! - december31.score!) < 0.1,
      cityId,
    );
  }
});

test("Sheboygan remains evidence-conservative while its existing handoff stays continuous", () => {
  const pair = getPierCastOpportunityPairV5({
    cityId: "sheboygan_wi",
    speciesId: "brown_trout",
  });
  assert.deepEqual(pair, beforePass3("sheboygan_wi"));
  const october20 = evaluation("sheboygan_wi", "2028-10-20");
  assert.equal(october20.timing, "past");
  assert.equal(pierCastOpportunityLabelV5(october20.score!), "Limited");
  const november10 = evaluation("sheboygan_wi", "2028-11-10");
  assert.equal(november10.timing, "approaching");
  assert.ok(Math.abs(october20.score! - november10.score!) < 0.4);
});

test("Pass 4 replays all 27 cities across cold, ideal, and warm profile temperatures", () => {
  const thermalValues = [0, 10, (72 - 32) * 5 / 9].map((temperatureC) => {
    const value = pierCastTemperatureSuitabilityV18(
      "brown_trout",
      temperatureC,
    );
    assert.notEqual(value, null);
    return value!;
  });
  let evaluationCount = 0;
  for (const cityId of PUBLIC_BROWN_TROUT_CITY_IDS) {
    let priorAvailability: number | null = null;
    for (const localDate of datesIn2028()) {
      for (const thermalValue of thermalValues) {
        const result = evaluation(cityId, localDate, thermalValue);
        assert.ok(
          result.phaseAvailability >= 0 && result.phaseAvailability <= 1,
        );
        assert.ok(result.score! >= 1 && result.score! <= 10);
        assert.ok(pierCastOpportunityLabelV5(result.score!));
        evaluationCount += 1;
      }
      const current = evaluation(cityId, localDate).phaseAvailability;
      if (priorAvailability !== null) {
        assert.ok(
          Math.abs(current - priorAvailability) < 0.08,
          `${cityId}/${localDate} discontinuity`,
        );
      }
      priorAvailability = current;
    }
  }
  assert.equal(evaluationCount, 27 * 366 * 3);
});

test("brown-trout Pass 3 does not alter another species calibration", () => {
  for (
    const pair of PIER_CAST_V3_PAIR_CALIBRATIONS.filter((candidate) =>
      candidate.speciesId !== "brown_trout"
    )
  ) {
    const batch2 = applyPierCastSalmonidBatch2V5(
      applyPierCastSalmonidBatch1V5(pair),
    );
    assert.deepEqual(
      applyPierCastSalmonidSeasonalityV18(batch2),
      applyPierCastSalmonidSeasonalityV18BeforeBrownTroutPass3(batch2),
      pair.pairKey,
    );
  }
});
