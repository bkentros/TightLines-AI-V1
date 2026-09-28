import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import { riverRunSpotFinderForRiver } from "../../../../../lib/riverRunSpotFinder.ts";
import {
  FALL_2026_DRAFT_CONFIGURATION_DOCUMENTS,
  KEWAUNEE_FALL_STEELHEAD_RUN_PROFILE,
  MANITOWOC_FALL_STEELHEAD,
  MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  validateConfigurationRevision,
  validateRunProfile,
  WISCONSIN_WINTER_PASS1_DECISIONS,
  WISCONSIN_WINTER_PASS1_EXCLUSIONS,
  WISCONSIN_WINTER_PASS1_SOURCE_LEDGER,
} from "../index.ts";

const decisions = WISCONSIN_WINTER_PASS1_DECISIONS;
const allSpecies = decisions.flatMap((river) => river.species);
const riversById = new Map(
  RIVER_RUN_RIVER_PROFILES.map((river) => [river.riverId, river]),
);
const runsById = new Map(
  RIVER_RUN_RUN_PROFILES.map((run) => [run.runId, run]),
);

Deno.test("Wisconsin winter Pass 1 covers exactly five rivers and two supported species each", () => {
  assertEquals(
    decisions.map((decision) => decision.riverId),
    ["milwaukee", "sheboygan", "root", "kewaunee_river", "manitowoc"],
  );
  assertEquals(allSpecies.length, 10);
  assertEquals(new Set(allSpecies.map((item) => item.futureRunId)).size, 10);
  for (const river of decisions) {
    assertEquals(
      river.species.map((item) => item.species),
      ["steelhead", "lake_run_brown_trout"],
      river.riverId,
    );
  }
});

Deno.test("every winter activation is the calendar day after its fall endpoint", () => {
  for (const decision of allSpecies) {
    const fall = runsById.get(decision.fallRunId);
    assert(
      fall,
      `${decision.fallRunId} must be registered as a hidden profile`,
    );
    assertEquals(
      decision.activationMonthDay,
      nextMonthDay(fall.runWindow.end),
      decision.futureRunId,
    );
    assertEquals(decision.endMonthDay, "02-28");
    assertMatch(decision.lifecycleContract, /not a new migration|not a claim/i);
  }
});

Deno.test("Pass 1 decisions reconcile exactly to the subsequently registered winter profiles", () => {
  const registeredIds = new Set(RIVER_RUN_RUN_PROFILES.map((run) => run.runId));
  for (const decision of allSpecies) {
    assertEquals(
      registeredIds.has(decision.futureRunId),
      true,
      `${decision.futureRunId} must preserve the accepted Pass 1 identity`,
    );
  }
});

Deno.test("every source and reach contract resolves against its river foundation", () => {
  for (const decision of decisions) {
    const river = riversById.get(decision.riverId);
    assert(river, decision.riverId);
    assert(river.foundation, `${decision.riverId} foundation`);
    const reachIds = new Set(
      river.foundation.reaches.map((reach) => reach.reachId),
    );
    const hydraulicIds = new Set(
      river.hydraulicSources.map((source) => source.sourceId),
    );
    const temperatureIds = new Set(
      river.waterTemperatureSources.map((source) => source.sourceId),
    );
    const weatherIds = new Set(
      river.weatherPoints.map((point) => point.weatherPointId),
    );

    for (const species of decision.species) {
      for (const id of species.corridorReachIds) assert(reachIds.has(id), id);
      for (const id of species.preferredStartReachIds) {
        assert(species.corridorReachIds.includes(id), id);
      }
      for (const id of species.activityReachIds) {
        assert(species.corridorReachIds.includes(id), id);
      }
      for (const id of species.hydraulicSourceIds) {
        assert(hydraulicIds.has(id), id);
      }
      for (const id of species.waterTemperatureSourceIds) {
        assert(temperatureIds.has(id), id);
      }
      for (const id of species.weatherPointIds) assert(weatherIds.has(id), id);
    }
  }
});

Deno.test("Steelhead modes use only representative sources and Brown Trout stays lower-river proxy-only", () => {
  for (const riverDecision of decisions) {
    const river = riversById.get(riverDecision.riverId)!;
    assert(river.foundation, `${riverDecision.riverId} foundation`);
    const steelhead = riverDecision.species[0];
    const brown = riverDecision.species[1];

    assertEquals(steelhead.species, "steelhead");
    if (steelhead.activityMode === "measured_water") {
      assert(steelhead.hydraulicSourceIds.length > 0);
      assert(steelhead.waterTemperatureSourceIds.length > 0);
    } else if (steelhead.activityMode === "flow_air_proxy") {
      assert(steelhead.hydraulicSourceIds.length > 0);
      assertEquals(steelhead.waterTemperatureSourceIds, []);
    } else {
      assertEquals(steelhead.hydraulicSourceIds, []);
      assertEquals(steelhead.waterTemperatureSourceIds, []);
    }

    assertEquals(brown.species, "lake_run_brown_trout");
    assertEquals(brown.activityMode, "weather_air_proxy");
    assertEquals(brown.corridorReachIds.length, 1);
    assertEquals(brown.hydraulicSourceIds, []);
    assertEquals(brown.waterTemperatureSourceIds, []);
    const brownReach = river.foundation.reaches.find((reach) =>
      reach.reachId === brown.corridorReachIds[0]
    );
    assert(brownReach);
    assert(
      brownReach.role === "harbor" || brownReach.role === "downstream",
      `${river.riverId}/${brownReach.reachId} must be lower river`,
    );
  }
});

Deno.test("Spot Finder covers every future corridor with species-correct access", () => {
  for (const river of decisions) {
    for (const species of river.species) {
      const finder = riverRunSpotFinderForRiver(
        river.riverId,
        species.species,
        "WI",
      );
      assert(finder, `${river.riverId}/${species.species}`);
      const sectionReachIds = new Set(
        finder.sections.flatMap((section) => section.foundationReachIds),
      );
      for (const reachId of species.corridorReachIds) {
        assert(
          sectionReachIds.has(reachId),
          `${river.riverId}/${species.species}/${reachId}`,
        );
      }
    }
  }

  const manitowoc = decisions.find((river) => river.riverId === "manitowoc")!;
  const winterSteelhead = manitowoc.species[0];
  assertEquals(
    winterSteelhead.corridorReachIds.includes("manitowoc_upper_corridor"),
    false,
  );
  assertMatch(manitowoc.legalSeasonNotes, /Lower Cato Falls.*October 31/i);
});

Deno.test("Kewaunee and Manitowoc fall Steelhead prerequisites validate and publish in their config documents", () => {
  for (
    const [run, documents] of [
      [
        KEWAUNEE_FALL_STEELHEAD_RUN_PROFILE,
        MIDWEST_DRAFT_CONFIGURATION_DOCUMENTS,
      ],
      [MANITOWOC_FALL_STEELHEAD, FALL_2026_DRAFT_CONFIGURATION_DOCUMENTS],
    ] as const
  ) {
    const river = riversById.get(run.riverId)!;
    const result = validateRunProfile(run, river);
    assertEquals(
      result.valid,
      true,
      `${run.runId}: ${JSON.stringify(result.issues)}`,
    );
    assertEquals(run.runWindow.end, "12-15");
    assertEquals(
      run.historicalPresence.anchors.at(-1)?.fractionOfMaximum,
      .62,
    );
    const document = documents.find((item) =>
      item.river.riverId === run.riverId
    );
    assert(document, run.riverId);
    assert(document.runs.some((item) => item.runId === run.runId));
    assert(
      document.biologyProfiles.some((profile) =>
        profile.biologyProfileId === "great_lakes_steelhead_fall_entry_v1"
      ),
    );
    assert(document.movementEngineVersion.includes("fall-entry"));
    const issues = validateConfigurationRevision({
      configKey: `${run.riverId}-wisconsin-winter-pass1-test`,
      revision: 1,
      status: "draft",
      evidenceNotes: "Wisconsin winter Pass 1 prerequisite validation.",
      document,
    });
    assertEquals(issues, [], `${run.riverId}: ${JSON.stringify(issues)}`);
  }
});

Deno.test("Bois Brule is excluded for legal closure rather than biological absence", () => {
  assertEquals(WISCONSIN_WINTER_PASS1_EXCLUSIONS.length, 1);
  const exclusion = WISCONSIN_WINTER_PASS1_EXCLUSIONS[0];
  assertEquals(exclusion.riverId, "bois_brule");
  assertEquals(exclusion.legalClosureStartMonthDay, "11-16");
  assertMatch(exclusion.legalReopenRule, /last Saturday in March/i);
  assertMatch(exclusion.evidenceNotes, /Fish may overwinter/i);
});

Deno.test("Pass 1 source ledger uses authoritative Wisconsin DNR evidence", () => {
  assert(WISCONSIN_WINTER_PASS1_SOURCE_LEDGER.length >= 8);
  for (const source of WISCONSIN_WINTER_PASS1_SOURCE_LEDGER) {
    assertMatch(source.url, /^https:\/\/dnr\.wisconsin\.gov\//);
    assert(source.supports.length > 20);
  }
});

function nextMonthDay(monthDay: string): string {
  const [month, day] = monthDay.split("-").map(Number);
  const date = new Date(Date.UTC(2000, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 1);
  const nextMonth = String(date.getUTCMonth() + 1).padStart(2, "0");
  const nextDay = String(date.getUTCDate()).padStart(2, "0");
  return `${nextMonth}-${nextDay}`;
}
