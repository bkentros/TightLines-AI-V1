import { assert, assertEquals } from "jsr:@std/assert";
import {
  listVisibleRiverRuns,
  ST_JOSEPH_RIVER_PROFILE,
  validateRiverProfile,
} from "../index.ts";

Deno.test("St. Joseph canonical foundation validates without species runs", () => {
  const result = validateRiverProfile(ST_JOSEPH_RIVER_PROFILE);
  assertEquals(result.valid, true, JSON.stringify(result.issues, null, 2));
  assertEquals(result.publicVisible, true);
  assertEquals(listVisibleRiverRuns([ST_JOSEPH_RIVER_PROFILE], []), []);
});

Deno.test("St. Joseph has one canonical identity with two state presentations", () => {
  assertEquals(ST_JOSEPH_RIVER_PROFILE.riverId, "st_joseph");
  assertEquals(
    ST_JOSEPH_RIVER_PROFILE.presentationContexts?.map((item) => item.state),
    ["MI", "IN"],
  );
  assertEquals(
    ST_JOSEPH_RIVER_PROFILE.presentationContexts?.map((item) =>
      item.defaultReachId
    ),
    ["st_joseph_lower_michigan", "st_joseph_indiana"],
  );
  assertEquals(
    ST_JOSEPH_RIVER_PROFILE.foundation?.stateRegulations?.map((item) =>
      item.state
    ),
    ["MI", "IN"],
  );
});

Deno.test("St. Joseph uses exact Niles flow and same-station temperature identities", () => {
  const primaryGauge = ST_JOSEPH_RIVER_PROFILE.hydraulicSources.find((item) =>
    item.role === "primary"
  );
  const primaryTemperature = ST_JOSEPH_RIVER_PROFILE
    .waterTemperatureSources.find((item) => item.role === "primary");

  assertEquals(primaryGauge?.siteId, "04101500");
  assertEquals(primaryGauge?.primaryMetric, "flow_cfs");
  assertEquals(primaryTemperature?.siteId, "04101500");
  assertEquals(primaryTemperature?.sourceType, "same_gauge");
  assert(
    ST_JOSEPH_RIVER_PROFILE.gaugeLimitationCopy.includes("Niles reach"),
  );
});

Deno.test("St. Joseph passage sequence ends only at Twin Branch", () => {
  const locations = ST_JOSEPH_RIVER_PROFILE.foundation?.locations ?? [];
  const passageStructures = locations
    .filter((item) => item.kind === "fish_ladder" || item.kind === "barrier")
    .toSorted((a, b) => (a.riverMile ?? 0) - (b.riverMile ?? 0));

  assertEquals(
    passageStructures.map((item) => [
      item.locationId,
      item.riverMile,
      item.fishPassage,
    ]),
    [
      ["st_joseph_berrien_springs_ladder", 24.6, "passable"],
      ["st_joseph_buchanan_ladder", 35.2, "passable"],
      ["st_joseph_french_paper_ladder", 44.5, "passable"],
      ["st_joseph_south_bend_ladder", 58.2, "passable"],
      ["st_joseph_mishawaka_ladder", 62.2, "passable"],
      ["st_joseph_twin_branch_barrier", 65.7, "impassable"],
    ],
  );
  assertEquals(
    locations.filter((item) => item.fishPassage === "impassable").map((item) =>
      item.officialName
    ),
    ["Twin Branch Dam"],
  );
});

Deno.test("St. Joseph distinguishes the French Paper mainstem facility from Dowagiac Niles Dam", () => {
  const locations = ST_JOSEPH_RIVER_PROFILE.foundation?.locations ?? [];
  const frenchPaper = locations.find((item) =>
    item.locationId === "st_joseph_french_paper_ladder"
  );

  assertEquals(
    frenchPaper?.officialName,
    "French Paper Hydroelectric Project fish ladder",
  );
  assert(frenchPaper?.aliases?.includes("Niles Dam fish ladder"));
  assert(
    locations.every((item) =>
      !item.sourceNotes.includes("Dowagiac River structure")
    ),
  );
});

Deno.test("St. Joseph provisional or restricted locations cannot face beginners", () => {
  const locations = ST_JOSEPH_RIVER_PROFILE.foundation?.locations ?? [];
  assertEquals(
    locations.filter((item) =>
      item.coordinateStatus === "provisional" ||
      item.publicAccess !== "verified"
    ).filter((item) => item.beginnerSuitable),
    [],
  );
  assert(
    locations.find((item) => item.locationId === "st_joseph_south_bend_ladder")
      ?.restrictionNotes.includes("100 feet"),
  );
  assert(
    locations.find((item) => item.locationId === "st_joseph_mishawaka_ladder")
      ?.restrictionNotes.includes("100 feet"),
  );
});
