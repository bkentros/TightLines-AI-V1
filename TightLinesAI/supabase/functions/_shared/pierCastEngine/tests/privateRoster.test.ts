import {
  assert,
  assertEquals,
  assertRejects,
  assertThrows,
} from "jsr:@std/assert";
import {
  applyPierCastDailyScoreSnapshot,
  buildPierCastDailyScoreSnapshot,
  buildPierCastReviewOutlook,
  evaluatePierCastSeasonalOpportunity,
  evaluateTemperatureSuitability,
  getPierCastPrivateSeasonalCurve,
  getPierCastPrivateSpeciesIds,
  getPierCastPrivateTemperatureCurve,
  PIER_CAST_CITY_PROFILES,
  PIER_CAST_CORE_SPECIES_IDS,
  PIER_CAST_ENGINE_VERSION,
  PIER_CAST_LEGACY_ROSTER_VERSION,
  PIER_CAST_PRIVATE_ADMISSIONS,
  PIER_CAST_PRIVATE_ROSTER_VERSION,
  PIER_CAST_SPECIES_PROFILES,
  pierCastRosterMatches,
  readPublishedPierCastDailyScoreSnapshot,
  validatePierCastCityProfiles,
  validatePierCastSpeciesProfiles,
} from "../index.ts";
import { completeLmhofsBatch } from "./fixtures/lmhofs.ts";
Deno.test("private admissions are city-specific, full-year and publicly disabled", () => {
  assertEquals(PIER_CAST_PRIVATE_ADMISSIONS.length, 7);
  assertEquals(
    PIER_CAST_CITY_PROFILES.map((c) =>
      getPierCastPrivateSpeciesIds(c.cityId).length
    ),
    [6, 6, 7, 4, 4],
  );
  for (const row of PIER_CAST_PRIVATE_ADMISSIONS) {
    const curve = getPierCastPrivateSeasonalCurve(row.cityId, row.speciesId)!;
    const thermal = getPierCastPrivateTemperatureCurve(row.speciesId)!;
    for (
      let t = Date.UTC(2024, 0, 1);
      t < Date.UTC(2025, 0, 1);
      t += 86400000
    ) {
      const result = evaluatePierCastSeasonalOpportunity({
        curve,
        localDate: new Date(t).toISOString().slice(0, 10),
        ratingEnabled: true,
        mode: "review",
      });
      assert(
        result.rating !== null && result.rating >= 1 && result.rating <= 10,
      );
    }
    assertEquals(
      evaluateTemperatureSuitability({
        curve: thermal,
        waterTemperatureC: 2,
        inputStatus: "valid",
        ratingEnabled: true,
        mode: "public",
        monthEvidenceState: "proposed_regional_transfer",
      }).status,
      "unavailable",
    );
  }
  assertEquals(
    getPierCastPrivateSeasonalCurve("sheboygan_wi", "freshwater_drum"),
    null,
  );
  assertEquals(getPierCastPrivateTemperatureCurve("round_whitefish"), null);
  assertEquals(
    pierCastRosterMatches("ludington_mi", [
      ...PIER_CAST_CORE_SPECIES_IDS,
      "smallmouth_bass",
      "channel_catfish",
    ]),
    false,
  );
  assertThrows(() => getPierCastPrivateSpeciesIds("ludington_mi", "invented"));
});
Deno.test("legacy daily snapshots remain readable and preserve today's old roster", async () => {
  const batch = completeLmhofsBatch();
  const snapshot = buildPierCastDailyScoreSnapshot({
    batch,
    lakeDate: "2026-09-10",
    generatedAt: "2026-09-10T00:36:00.000Z",
    engineVersion: PIER_CAST_ENGINE_VERSION,
  });
  assertEquals(snapshot.speciesRosterVersion, PIER_CAST_PRIVATE_ROSTER_VERSION);
  delete snapshot.speciesRosterVersion;
  for (const city of snapshot.cities) {
    city.date.species = city.date.species.filter((s) =>
      (PIER_CAST_CORE_SPECIES_IDS as readonly string[]).includes(s.speciesId)
    );
  }
  const database = {
    rpc: () => Promise.resolve({ data: snapshot, error: null }),
  };
  const read = await readPublishedPierCastDailyScoreSnapshot(
    database,
    new Date("2026-09-10T12:00:00Z"),
  );
  assert(read);
  const live = buildPierCastReviewOutlook({
    batch,
    evaluationTime: "2026-09-10T12:00:00Z",
  });
  const merged = applyPierCastDailyScoreSnapshot(live, read);
  for (const city of merged.cities) {
    assertEquals(city.dates[0].species.length, 4);
    assertEquals(
      city.dates[1].species.length,
      getPierCastPrivateSpeciesIds(city.cityId).length,
    );
  }
  snapshot.speciesRosterVersion = PIER_CAST_PRIVATE_ROSTER_VERSION;
  await assertRejects(() =>
    readPublishedPierCastDailyScoreSnapshot(
      database,
      new Date("2026-09-10T12:00:00Z"),
    )
  );
  snapshot.speciesRosterVersion = PIER_CAST_LEGACY_ROSTER_VERSION;
  snapshot.cities[0].date.species[0].speciesId = "freshwater_drum";
  await assertRejects(() =>
    readPublishedPierCastDailyScoreSnapshot(
      database,
      new Date("2026-09-10T12:00:00Z"),
    )
  );
});
Deno.test("configuration rejects missing, copied or altered private calibration", () => {
  const cities = structuredClone(PIER_CAST_CITY_PROFILES);
  const species = cities[0].species.find((s) =>
    s.speciesId === "yellow_perch"
  )!;
  species.seasonalOpportunityCurve = null;
  assert(validatePierCastCityProfiles(cities).length > 0);
  species.seasonalOpportunityCurve = structuredClone(
    getPierCastPrivateSeasonalCurve("manistee_mi", "yellow_perch"),
  );
  assert(validatePierCastCityProfiles(cities).length > 0);
  const profiles = structuredClone(PIER_CAST_SPECIES_PROFILES);
  profiles.find((p) => p.speciesId === "freshwater_drum")!
    .seasonalTemperatureCurves![0].knots[0].suitability = .99;
  assert(validatePierCastSpeciesProfiles(profiles).length > 0);
});
