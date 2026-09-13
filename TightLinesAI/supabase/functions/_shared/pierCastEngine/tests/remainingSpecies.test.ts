import { getPierCastPrivateSpeciesIds, getPierCastPrivateAdmission, getPierCastPrivateTemperatureCurve, PIER_CAST_PRIVATE_ROSTER_VERSION } from "../config/privateCalibration.ts";
import { assert, assertEquals } from "jsr:@std/assert";
import { PIER_CAST_CITY_PROFILES } from "../config/cities.ts";
import { PIER_CAST_REMAINING_SPECIES_REVIEW } from "../config/remainingSpecies.generated.ts";

Deno.test("all 45 remaining pairings retain explicit reviewed unavailable configuration", async () => {
  const root = new URL("../../../../../", import.meta.url);
  const artifact = JSON.parse(
    await Deno.readTextFile(
      new URL(
        "docs/onboarding/piercast/remaining-species/decisions.json",
        root,
      ),
    ),
  );
  assertEquals(PIER_CAST_REMAINING_SPECIES_REVIEW.length, 45);
  assertEquals(
    new Set(
      PIER_CAST_REMAINING_SPECIES_REVIEW.map((r) =>
        `${r.cityId}/${r.speciesId}`
      ),
    ).size,
    45,
  );
  for (const r of PIER_CAST_REMAINING_SPECIES_REVIEW) {
    const city = PIER_CAST_CITY_PROFILES.find((c) => c.cityId === r.cityId)!;
    const profile = city.species.find((s) => s.speciesId === r.speciesId)!;
    const decision = artifact.decisions.find((
      d: { cityId: string; speciesId: string },
    ) => d.cityId === r.cityId && d.speciesId === r.speciesId);
    assertEquals(profile.seasonalOpportunityCurve !== null, !!getPierCastPrivateAdmission(city.cityId, r.speciesId));
    assertEquals(profile.ratingEnabled, false);
    assertEquals(profile.inheritance === "candidate", !!getPierCastPrivateAdmission(city.cityId, r.speciesId));
    assertEquals(decision.classification, r.classification);
    assertEquals(decision.rationale, r.limitation);
    assertEquals(
      decision.evaluatedStructureIds,
      city.structures.filter((s) => s.disposition === "candidate").map((s) =>
        s.structureId
      ),
    );
    assertEquals(city.publicEnabled, false);
  }
});
