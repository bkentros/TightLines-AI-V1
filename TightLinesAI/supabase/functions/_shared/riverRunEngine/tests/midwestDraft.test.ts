import { assert, assertEquals } from "jsr:@std/assert";
import {
  riverRunSpotFinderForRiver,
} from "../../../../../lib/riverRunSpotFinder.ts";
import {
  MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS,
  MIDWEST_DRAFT_RIVERS,
  MIDWEST_DRAFT_RUNS,
  RIVER_RUN_RUN_PROFILES,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

Deno.test("Midwest owner-review documents validate and remain hidden", () => {
  assertEquals(MIDWEST_DRAFT_RIVERS.length, 2);
  assertEquals(MIDWEST_DRAFT_RUNS.length, 5);
  assertEquals(
    MIDWEST_DRAFT_RUNS.map((
      run,
    ) => [run.runId, run.historicalPresence.maximum]),
    [
      ["trail_creek_fall_chinook", 7],
      ["trail_creek_fall_coho", 7],
      ["kewaunee_river_fall_chinook", 8],
      ["kewaunee_river_fall_coho", 8],
      ["kewaunee_river_fall_brown_trout", 7],
    ],
  );
  for (const document of MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS) {
    const riverResult = validateRiverProfile(document.river);
    assertEquals(
      riverResult.valid,
      true,
      riverResult.issues.map((i) => i.message).join("\n"),
    );
    for (const run of document.runs) {
      const result = validateRunProfile(run, document.river);
      assertEquals(
        result.valid,
        true,
        `${run.runId}: ${result.issues.map((i) => i.message).join("\n")}`,
      );
      assertEquals(result.publicVisible, false, run.runId);
      assertEquals(run.publicAudit.isEnabled, false, run.runId);
      assertEquals(run.activity?.weights.waterTemperature, 0, run.runId);
      if (run.riverId === "trail_creek") {
        assertEquals(run.activity?.dataMode, "observed_river", run.runId);
        assertEquals(run.activity?.weights.riverBehavior, 0.55, run.runId);
        assertEquals(run.activity?.inputReach?.hydraulicSourceIds, [
          "trail_creek_springland_usgs",
        ]);
        assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, []);
      } else {
        assertEquals(run.activity?.dataMode, "weather_only", run.runId);
        assertEquals(run.activity?.weights.riverBehavior, 0, run.runId);
      }
      assertEquals(
        RIVER_RUN_RUN_PROFILES.some((publicRun) =>
          publicRun.runId === run.runId
        ),
        false,
        run.runId,
      );
    }
    const issues = validateConfigurationRevision({
      configKey: document.river.riverId,
      revision: 1,
      status: "draft",
      document,
      evidenceNotes:
        "Hidden owner-review candidate; public release is not authorized.",
    });
    assert(
      issues.every((issue) => issue.severity !== "error"),
      issues.map((i) => i.message).join("\n"),
    );
  }
});

Deno.test("Midwest Spot Finder inventories are corridor- and species-bounded", () => {
  const trail = riverRunSpotFinderForRiver("trail_creek", "chinook_salmon")!;
  assertEquals(trail.sections.flatMap((section) => section.spots).length, 10);
  assertEquals(
    trail.sections.flatMap((section) => section.spots.map((spot) => spot.id)),
    [
      "trail_creek_dnr_building",
      "trail_creek_hansen_park",
      "trail_creek_winding_creek_cove",
      "trail_creek_fire_station_2",
      "trail_creek_robert_peo",
      "trail_creek_karwick",
      "trail_creek_us35",
      "trail_creek_forks",
      "trail_creek_johnson_road",
      "trail_creek_creek_ridge",
    ],
  );
  const kewauneeSalmon = riverRunSpotFinderForRiver(
    "kewaunee_river",
    "chinook_salmon",
  )!;
  assertEquals(kewauneeSalmon.sections.map((section) => section.id), [
    "kewaunee_lower_river",
    "kewaunee_besadny_reach",
  ]);
  assertEquals(
    kewauneeSalmon.sections.flatMap((section) => section.spots).length,
    7,
  );
  const kewauneeBrown = riverRunSpotFinderForRiver(
    "kewaunee_river",
    "lake_run_brown_trout",
  )!;
  assertEquals(
    kewauneeBrown.sections.flatMap((section) => section.spots).length,
    11,
  );
  assertEquals(
    kewauneeBrown.sections.flatMap((section) =>
      section.spots.map((spot) => spot.id)
    ),
    [
      "kewaunee_harbor_park",
      "kewaunee_harbor_point",
      "kewaunee_landing",
      "kewaunee_first_highway_c",
      "kewaunee_highway_c_launch",
      "kewaunee_bruemmer_river_trail",
      "kewaunee_besadny_facility",
      "kewaunee_second_highway_c",
      "kewaunee_highway_e_launch",
      "kewaunee_clyde_hill",
      "kewaunee_third_highway_c",
    ],
  );
  assertEquals(
    kewauneeBrown.sections.flatMap((section) => section.spots).filter((spot) =>
      [
        "kewaunee_first_highway_c",
        "kewaunee_second_highway_c",
        "kewaunee_clyde_hill",
        "kewaunee_third_highway_c",
      ].includes(spot.id)
    ).every((spot) => Boolean(spot.caution)),
    true,
  );
  assert(
    kewauneeBrown.sections.flatMap((section) => section.spots).find((spot) =>
      spot.id === "kewaunee_bruemmer_river_trail"
    )?.caution?.includes("north of the County F bridge"),
  );
  assertEquals(
    [...trail.sections, ...kewauneeBrown.sections].flatMap((section) =>
      section.spots
    )
      .every((spot) =>
        !spot.latitude && !spot.longitude && Boolean(spot.sourceLocator)
      ),
    true,
  );
});
