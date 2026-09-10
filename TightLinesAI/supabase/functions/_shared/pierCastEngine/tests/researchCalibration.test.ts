import { assert, assertAlmostEquals, assertEquals } from "jsr:@std/assert";
import {
  calculatePierCastInstantOpportunity,
  evaluatePierCastSeasonalOpportunity,
  evaluateTemperatureSuitability,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_CORE_SPECIES_IDS,
  PIER_CAST_CORE_TEMPERATURE_CURVES,
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
    216,
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
      values[index.seasonal_opportunity_ceiling],
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

Deno.test("temperature can reduce but never exceed the seasonal ceiling", () => {
  for (const seasonalRating of [1, 4, 7, 9, 10]) {
    for (const temperatureSuitability of [0, 0.25, 0.5, 0.75, 1]) {
      const result = calculatePierCastInstantOpportunity({
        seasonalRating,
        temperatureSuitability,
      });
      assertEquals(result.status, "available");
      if (result.status !== "available") continue;
      assert(result.rating.score <= seasonalRating);
      assertAlmostEquals(
        result.rating.score,
        1 + (seasonalRating - 1) * temperatureSuitability,
      );
    }
  }
});
