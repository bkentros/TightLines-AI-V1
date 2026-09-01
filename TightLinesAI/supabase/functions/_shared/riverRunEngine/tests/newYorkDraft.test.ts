import { assert, assertEquals } from "jsr:@std/assert";
import {
  resolveRiverSpotFinderRecommendedSections,
  riverRunSpotFinderForRiver,
} from "../../../../../lib/riverRunSpotFinder.ts";
import {
  NEW_YORK_CONFIGURATION_DOCUMENTS,
  NEW_YORK_RIVERS,
  NEW_YORK_RUNS,
  resolveRunStage,
  resolveSeasonalZone,
  RIVER_RUN_RUN_PROFILES,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

const expectedRuns = [
  ["salmon_ny_fall_chinook", "chinook_salmon", 10, "broad"],
  ["salmon_ny_fall_coho", "coho_salmon", 8, "sectional"],
  ["salmon_ny_fall_steelhead", "steelhead", 9, "broad"],
  ["salmon_ny_fall_brown_trout", "lake_run_brown_trout", 5, "sectional"],
  ["oak_orchard_fall_chinook", "chinook_salmon", 8, "sectional"],
  ["oak_orchard_fall_coho", "coho_salmon", 6, "sectional"],
  ["oak_orchard_fall_steelhead", "steelhead", 8, "sectional"],
  ["oak_orchard_fall_brown_trout", "lake_run_brown_trout", 6, "sectional"],
  ["lower_genesee_fall_chinook", "chinook_salmon", 7, "concentrated"],
  ["lower_genesee_fall_steelhead", "steelhead", 7, "concentrated"],
  ["lower_genesee_fall_brown_trout", "lake_run_brown_trout", 2, "concentrated"],
] as const;

Deno.test("New York release documents validate and are public", () => {
  assertEquals(NEW_YORK_RIVERS.length, 3);
  assertEquals(NEW_YORK_RUNS.length, 11);
  assertEquals(
    NEW_YORK_RUNS.map((run) => [
      run.runId,
      run.species,
      run.historicalPresence.maximum,
      run.historicalPresence.distributionScope,
    ]),
    expectedRuns.map((row) => [...row]),
  );

  for (const document of NEW_YORK_CONFIGURATION_DOCUMENTS) {
    const riverResult = validateRiverProfile(document.river);
    assertEquals(
      riverResult.valid,
      true,
      riverResult.issues.map((issue) => issue.message).join("\n"),
    );
    for (const run of document.runs) {
      const result = validateRunProfile(run, document.river);
      assertEquals(
        result.valid,
        true,
        `${run.runId}: ${
          result.issues.map((issue) => issue.message).join("\n")
        }`,
      );
      assertEquals(result.publicVisible, true, run.runId);
      assertEquals(run.publicAudit.isEnabled, true, run.runId);
      assertEquals(
        run.primitiveCapabilities.fishability.status,
        "unavailable",
        run.runId,
      );
      if (run.primitiveCapabilities.fishability.status === "unavailable") {
        assertEquals(
          run.primitiveCapabilities.fishability.reason,
          document.river.riverId === "salmon_ny"
            ? "no_accepted_historical_baseline"
            : "no_accepted_hydraulic_source",
          run.runId,
        );
      }
      assertEquals(
        RIVER_RUN_RUN_PROFILES.some((publicRun) =>
          publicRun.runId === run.runId
        ),
        true,
        `${run.runId} is missing from the public run registry`,
      );
    }
    const issues = validateConfigurationRevision({
      configKey: document.river.riverId,
      revision: 3,
      status: "published",
      document,
      evidenceNotes:
        "New York configuration was owner accepted and explicitly authorized for public release on 2026-09-01.",
    });
    assert(
      issues.every((issue) => issue.severity !== "error"),
      issues.map((issue) => issue.message).join("\n"),
    );
  }
});

Deno.test("New York weather-only runs fail closed around missing river temperature", () => {
  for (const run of NEW_YORK_RUNS) {
    assertEquals(run.activity?.dataMode, "weather_only", run.runId);
    assertEquals(run.activity?.weights.waterTemperature, 0, run.runId);
    assertEquals(run.activity?.weights.riverBehavior, 0, run.runId);
    assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, []);
    if (
      run.species === "steelhead" ||
      run.species === "lake_run_brown_trout"
    ) {
      assertEquals(run.activity?.caps.weatherOnlyMaximum, 69, run.runId);
      assertEquals(
        run.activity?.caps.weatherOnlyTomorrowMaximum,
        69,
        run.runId,
      );
      assertEquals(run.activity?.caps.stageResponseMaximum, 69, run.runId);
      assertEquals(run.activity?.caps.lifecycleRamp, undefined, run.runId);
    }
  }

  const salmon = NEW_YORK_RIVERS.find((river) =>
    river.riverId === "salmon_ny"
  )!;
  assertEquals(salmon.hydraulicSources.map((source) => source.siteId), [
    "04250200",
  ]);
  assertEquals(salmon.foundation?.primaryGaugeReachId, "salmon_ny_middle");
  assertEquals(
    salmon.conditionDataCapabilities.waterTemperature.status,
    "unavailable",
  );
  const oak = NEW_YORK_RIVERS.find((river) => river.riverId === "oak_orchard")!;
  assertEquals(oak.hydraulicSources.map((source) => source.siteId), [
    "04220045",
  ]);
  assertEquals(oak.waterTemperatureSources.map((source) => source.siteId), [
    "04220045",
  ]);
  assertEquals(oak.foundation?.primaryGaugeReachId, null);
  assertEquals(oak.conditionDataCapabilities.hydraulics.status, "available");
  assertEquals(
    oak.conditionDataCapabilities.waterTemperature.status,
    "available",
  );

  const genesee = NEW_YORK_RIVERS.find((river) =>
    river.riverId === "lower_genesee"
  )!;
  assertEquals(genesee.hydraulicSources.map((source) => source.siteId), [
    "04231600",
  ]);
  assertEquals(
    genesee.waterTemperatureSources.map((source) => source.siteId),
    ["04231600"],
  );
  assertEquals(genesee.foundation?.contextualGaugeSiteIds, ["04231600"]);
  assertEquals(genesee.foundation?.primaryGaugeReachId, null);
  assertEquals(
    genesee.gaugeLimitationCopy.includes("04232000"),
    true,
  );
});

Deno.test("New York Seasonal Zone replays every active day inside ordered barrier-limited corridors", () => {
  for (const document of NEW_YORK_CONFIGURATION_DOCUMENTS) {
    const orderedReachIds = [...(document.river.foundation?.reaches ?? [])]
      .sort((a, b) => a.order - b.order)
      .map((reach) => reach.reachId);
    for (const run of document.runs) {
      const start = dateForMonthDay(2026, run.runWindow.stagingStart);
      const end = dateForMonthDay(
        run.runWindow.lateEnd < run.runWindow.stagingStart ? 2027 : 2026,
        run.runWindow.lateEnd,
      );
      let activeDays = 0;
      for (
        let cursor = start;
        cursor.getTime() <= end.getTime();
        cursor = new Date(cursor.getTime() + 86_400_000)
      ) {
        const localDate = cursor.toISOString().slice(0, 10);
        const zone = resolveSeasonalZone({
          river: document.river,
          run,
          stage: resolveRunStage(run, localDate),
          localDate,
        });
        if (zone.status !== "active") continue;
        activeDays += 1;
        assert(zone.foundationReachIds.length > 0, `${run.runId}/${localDate}`);
        assert(
          zone.foundationReachIds.every((reachId) =>
            orderedReachIds.includes(reachId)
          ),
          `${run.runId}/${localDate} crossed its foundation corridor`,
        );
        assertEquals(
          zone.foundationReachIds,
          [...zone.foundationReachIds].sort((a, b) =>
            orderedReachIds.indexOf(a) - orderedReachIds.indexOf(b)
          ),
          `${run.runId}/${localDate} is not downstream-to-upstream`,
        );
        const finder = riverRunSpotFinderForRiver(
          document.river.riverId,
          run.species,
          "NY",
        );
        assert(finder, `${run.runId} is missing its audited Spot Finder`);
        const recommendation = resolveRiverSpotFinderRecommendedSections(
          finder,
          zone,
        );
        const expectedSectionIds = finder.sections.filter((section) =>
          section.foundationReachIds.some((reachId) =>
            zone.foundationReachIds.includes(reachId)
          )
        ).map((section) => section.id);
        assertEquals(
          recommendation.recommendedSections.map((section) => section.id),
          expectedSectionIds,
          `${run.runId}/${localDate} Spot Finder drifted from Seasonal Zone`,
        );
        assertEquals(
          recommendation.hasRecommendation,
          expectedSectionIds.length > 0,
          `${run.runId}/${localDate} Spot Finder fail-closed status is wrong`,
        );
      }
      assert(
        activeDays > 0,
        `${run.runId} produced no active Seasonal Zone days`,
      );
    }
  }
});

function dateForMonthDay(year: number, monthDay: string): Date {
  return new Date(`${year}-${monthDay}T12:00:00Z`);
}
