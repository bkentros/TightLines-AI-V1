import { assert, assertEquals } from "jsr:@std/assert";
import {
  buildPierCastCatalog,
  getPierCastV3PairCalibration,
  PIER_CAST_FIVE_CITY_IDS,
  PIER_CAST_FIVE_CITY_PROFILES,
  PIER_CAST_PUBLIC_V3_RELEASE,
} from "../index.ts";

const admittedCounts = {
  two_rivers_wi: 4,
  kewaunee_wi: 5,
  algoma_wi: 4,
  manitowoc_wi: 6,
  waukegan_il: 5,
} as const;

Deno.test("five-city profiles are complete, private, and mapped to audited cells", () => {
  assertEquals(PIER_CAST_FIVE_CITY_PROFILES.length, 5);
  assertEquals(new Set(PIER_CAST_FIVE_CITY_IDS).size, 5);
  for (const city of PIER_CAST_FIVE_CITY_PROFILES) {
    assertEquals(city.publicEnabled, false);
    assertEquals(city.tentative, true);
    assertEquals(city.species.length, 19);
    assert(city.structures.length > 0);
    const location = city.waterTemperatureSource?.configuredLocation;
    assert(location);
    assert(location.modelBathymetryM >= 5);
    assertEquals(location.gridCellStatus, "candidate");
    assertEquals(
      city.species.filter((row) => row.inheritance === "candidate").length,
      admittedCounts[city.cityId as keyof typeof admittedCounts],
    );
    for (const row of city.species) {
      assertEquals(row.ratingEnabled, false);
      assertEquals(row.seasonalOpportunityCurve, null);
      assertEquals(
        !!getPierCastV3PairCalibration(city.cityId, row.speciesId),
        row.inheritance === "candidate",
      );
    }
  }
});

Deno.test("five onboarding cities are public in v3", () => {
  const review = buildPierCastCatalog("review");
  const publicV2 = buildPierCastCatalog("public");
  const publicV3 = buildPierCastCatalog("public", "v3");
  assertEquals(review.cities.length, 17);
  assertEquals(publicV2.cities.length, 12);
  assertEquals(publicV3.cities.length, 17);
  for (const cityId of PIER_CAST_FIVE_CITY_IDS) {
    assert(review.cities.some((city) => city.cityId === cityId));
    assert(!publicV2.cities.some((city) => city.cityId === cityId));
    assert(publicV3.cities.some((city) => city.cityId === cityId && city.releaseStatus === "public_research"));
    assert(
      PIER_CAST_PUBLIC_V3_RELEASE.cityIds.some((id) =>
        String(id) === String(cityId)
      ),
    );
  }
});

Deno.test("Algoma carries the construction closure without suppressing its report", () => {
  const algoma = PIER_CAST_FIVE_CITY_PROFILES.find((city) =>
    city.cityId === "algoma_wi"
  )!;
  const south = algoma.structures.find((structure) =>
    structure.structureId === "algoma_south_breakwater"
  )!;
  assertEquals(south.accessStatus, "reported_closed");
  assertEquals(south.liveAccessStatus, "reported_closed");
  assertEquals(admittedCounts.algoma_wi, 4);
  assert(getPierCastV3PairCalibration("algoma_wi", "chinook_salmon"));
});
