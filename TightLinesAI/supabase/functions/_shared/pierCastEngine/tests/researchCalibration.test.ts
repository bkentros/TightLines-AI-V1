import { assert, assertAlmostEquals, assertEquals } from "jsr:@std/assert";
import {
  calculatePierCastInstantOpportunity,
  evaluatePierCastSeasonalOpportunity,
  evaluateTemperatureSuitability,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_CORE_SPECIES_IDS,
  PIER_CAST_CORE_TEMPERATURE_CURVES,
  PIER_CAST_CORE_TEMPERATURE_CURVES_V0_1,
  validatePierCastSeasonalOpportunityCurve,
  validatePierCastTemperatureCurve,
} from "../index.ts";
import type { PierCastSeasonalOpportunityCurve } from "../types.ts";

type ResearchCurve = {
  curveId: string;
  cityId: string;
  speciesId: string;
  confidence: string;
  knots: Array<{ monthDay: string; rating: number }>;
};

const repoRoot = new URL("../../../../../", import.meta.url);
const research = JSON.parse(
  await Deno.readTextFile(
    new URL("docs/PierCast_Core_Species_Seasonal_Curves.json", repoRoot),
  ),
) as { curves: ResearchCurve[] };

const weeklyRows = (
  await Deno.readTextFile(
    new URL("docs/PierCast_Core_Species_Weekly_Ratings.csv", repoRoot),
  )
).trim().split("\n");

const thermalResearch = JSON.parse(
  await Deno.readTextFile(
    new URL("docs/PierCast_Core_Species_Temperature_Curves.json", repoRoot),
  ),
) as {
  productionReady: boolean;
  curves: Array<{
    speciesId: (typeof PIER_CAST_CORE_SPECIES_IDS)[number];
    curveId: string;
    knots: Array<{ temperatureC: number; suitability: number }>;
  }>;
};

Deno.test("core seasonal research contains 20 unique valid decimal curves", () => {
  assertEquals(research.curves.length, 20);
  assertEquals(
    new Set(
      research.curves.map((curve) => `${curve.cityId}|${curve.speciesId}`),
    ).size,
    20,
  );
  assertEquals(
    research.curves.reduce((count, curve) => count + curve.knots.length, 0),
    217,
  );

  for (const researchCurve of research.curves) {
    const curve: PierCastSeasonalOpportunityCurve = {
      curveId: researchCurve.curveId,
      calibrationStatus: "provisional",
      knots: researchCurve.knots,
    };
    assertEquals(validatePierCastSeasonalOpportunityCurve(curve), []);
    for (const knot of curve.knots) {
      assertEquals(Number.isInteger(knot.rating * 10), true);
    }
  }
});

Deno.test("v0.4 pins the full-scale effort-aware peak calibration", () => {
  const expectedPeaks = new Map<string, readonly [string, number]>(
    [
      ["ludington_mi|chinook_salmon", ["08-30", 8.3]],
      ["ludington_mi|coho_salmon", ["10-20", 5.6]],
      ["ludington_mi|steelhead", ["10-20", 8.1]],
      ["ludington_mi|brown_trout", ["04-05", 7.6]],
      ["grand_haven_mi|chinook_salmon", ["09-08", 7.8]],
      ["grand_haven_mi|coho_salmon", ["09-10", 8.8]],
      ["grand_haven_mi|steelhead", ["10-30", 9.2]],
      ["grand_haven_mi|brown_trout", ["04-15", 7.6]],
      ["manistee_mi|chinook_salmon", ["08-30", 9.5]],
      ["manistee_mi|coho_salmon", ["10-05", 8.2]],
      ["manistee_mi|steelhead", ["10-28", 10.0]],
      ["manistee_mi|brown_trout", ["04-10", 8.2]],
      ["frankfort_elberta_mi|chinook_salmon", ["08-16", 9.7]],
      ["frankfort_elberta_mi|coho_salmon", ["09-15", 8.6]],
      ["frankfort_elberta_mi|steelhead", ["10-16", 9.8]],
      ["frankfort_elberta_mi|brown_trout", ["04-05", 7.5]],
      ["sheboygan_wi|chinook_salmon", ["08-31", 9.6]],
      ["sheboygan_wi|coho_salmon", ["04-15", 7.7]],
      ["sheboygan_wi|steelhead", ["07-15", 7.3]],
      ["sheboygan_wi|brown_trout", ["04-15", 7.8]],
    ],
  );

  for (const curve of research.curves) {
    assert(curve.curveId.endsWith("__v0_4"));
    const peak = curve.knots.reduce((best, candidate) =>
      candidate.rating > best.rating ? candidate : best
    );
    assertEquals(
      [peak.monthDay, peak.rating],
      expectedPeaks.get(`${curve.cityId}|${curve.speciesId}`),
    );
  }

  const sheboyganBrown = research.curves.find((curve) =>
    curve.cityId === "sheboygan_wi" && curve.speciesId === "brown_trout"
  );
  assert(sheboyganBrown);
  assertEquals(
    sheboyganBrown.knots.find((knot) => knot.monthDay === "09-09")?.rating,
    4.5,
  );
});

Deno.test("weekly research export matches engine interpolation", () => {
  assertEquals(weeklyRows.length - 1, 1040);
  const columns = weeklyRows[0].split(",");
  const index = Object.fromEntries(columns.map((column, i) => [column, i]));
  const curveById = new Map(
    research.curves.map((curve) => [curve.curveId, curve]),
  );

  for (const row of weeklyRows.slice(1)) {
    const values = row.split(",");
    const researchCurve = curveById.get(values[index.curve_id]);
    if (!researchCurve) {
      throw new Error("Weekly row references an unknown curve.");
    }
    const localDate = `2025-${values[index.week_midpoint_mm_dd]}`;
    const result = evaluatePierCastSeasonalOpportunity({
      ratingEnabled: true,
      mode: "review",
      localDate,
      curve: {
        curveId: researchCurve.curveId,
        calibrationStatus: "provisional",
        knots: researchCurve.knots,
      },
    });
    assertEquals(result.status, "available");
    if (result.status !== "available") continue;
    assertEquals(
      result.rating.toFixed(1),
      values[index.seasonal_opportunity_rating],
    );
    assertEquals(values[index.production_ready], "false");
  }
});

Deno.test("all 20 runtime seasonal curves exactly match the research source", () => {
  const configured = PIER_CAST_CITY_PROFILES.flatMap((city) =>
    city.species
      .filter((candidate) =>
        PIER_CAST_CORE_SPECIES_IDS.includes(
          candidate.speciesId as (typeof PIER_CAST_CORE_SPECIES_IDS)[number],
        )
      )
      .map((candidate) => ({
        cityId: city.cityId,
        speciesId: candidate.speciesId,
        curve: candidate.seasonalOpportunityCurve,
      }))
  );
  assertEquals(configured.length, 20);
  for (const entry of configured) {
    const source = research.curves.find((candidate) =>
      candidate.cityId === entry.cityId &&
      candidate.speciesId === entry.speciesId
    );
    assert(source);
    assert(entry.curve);
    assertEquals(entry.curve.curveId, source.curveId);
    assertEquals(
      entry.curve.knots,
      source.knots.map(({ monthDay, rating }) => ({
        monthDay,
        rating,
      })),
    );
    assertEquals(entry.curve.calibrationStatus, "provisional");
  }
});

Deno.test("four runtime temperature curves exactly match research and interpolate", () => {
  assertEquals(thermalResearch.productionReady, false);
  assertEquals(thermalResearch.curves.length, 4);
  for (const source of thermalResearch.curves) {
    const curve = PIER_CAST_CORE_TEMPERATURE_CURVES[source.speciesId];
    assertEquals(curve.curveId, source.curveId);
    const configuredKnots: Array<{
      temperatureC: number;
      suitability: number;
    }> = [...curve.knots];
    assertEquals(configuredKnots, source.knots);
    assertEquals(curve.calibrationStatus, "provisional");
    assertEquals(validatePierCastTemperatureCurve(curve), []);

    for (const knot of curve.knots) {
      const result = evaluateTemperatureSuitability({
        ratingEnabled: true,
        mode: "review",
        monthEvidenceState: "sourced_biology",
        inputStatus: "valid",
        waterTemperatureC: knot.temperatureC,
        curve,
      });
      assertEquals(result.status, "available");
      if (result.status === "available") {
        assertAlmostEquals(result.suitability, knot.suitability);
      }
    }
  }
});

Deno.test("v0.2 changes only the cold shoulder and preserves v0.1 at 50 F and warmer", () => {
  const comparisonTemperaturesC = [10, 12, 14, 16, 18, 20, 22, 24, 26];
  for (const speciesId of PIER_CAST_CORE_SPECIES_IDS) {
    const baseline = PIER_CAST_CORE_TEMPERATURE_CURVES_V0_1[speciesId];
    const candidate = PIER_CAST_CORE_TEMPERATURE_CURVES[speciesId];
    assert(candidate.curveId.endsWith("__v0_2"));

    for (const waterTemperatureC of comparisonTemperaturesC) {
      const baselineResult = evaluateTemperatureSuitability({
        ratingEnabled: true,
        mode: "review",
        monthEvidenceState: "sourced_biology",
        inputStatus: "valid",
        waterTemperatureC,
        curve: baseline,
      });
      const candidateResult = evaluateTemperatureSuitability({
        ratingEnabled: true,
        mode: "review",
        monthEvidenceState: "sourced_biology",
        inputStatus: "valid",
        waterTemperatureC,
        curve: candidate,
      });
      assertEquals(baselineResult.status, "available");
      assertEquals(candidateResult.status, "available");
      if (
        baselineResult.status === "available" &&
        candidateResult.status === "available"
      ) {
        assertAlmostEquals(
          candidateResult.suitability,
          baselineResult.suitability,
        );
      }
    }

    assert(
      candidate.knots[0].suitability > baseline.knots[0].suitability,
      `${speciesId} must have a less punitive freezing-water floor`,
    );
  }
});

Deno.test("temperature has a bounded penalty and five-percent maximum synergy", () => {
  for (const seasonalRating of [1, 4, 7, 9, 10]) {
    for (const temperatureSuitability of [0, 0.25, 0.5, 0.75, 1]) {
      const result = calculatePierCastInstantOpportunity({
        seasonalRating,
        temperatureSuitability,
      });
      assertEquals(result.status, "available");
      if (result.status !== "available") continue;
      assertAlmostEquals(
        result.rating.score,
        Math.min(
          10,
          1 + (seasonalRating - 1) *
              (0.3 + 0.75 * temperatureSuitability),
        ),
      );
      assert(result.rating.score >= 1 + (seasonalRating - 1) * 0.3);
      assert(
        result.rating.score <= Math.min(
          10,
          1 + (seasonalRating - 1) * 1.05,
        ),
      );
    }
  }
});
