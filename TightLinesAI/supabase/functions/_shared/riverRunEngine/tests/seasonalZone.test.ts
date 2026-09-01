import { assert, assertEquals } from "jsr:@std/assert";
import { RIVER_RUN_CONFIGURATION_DOCUMENTS } from "../config/catalog.ts";
import { RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS } from "../config/onboarding/index.ts";
import { resolveSeasonalZone } from "../presentation/seasonalZone.ts";
import { resolveRunStage } from "../scoring/runStage.ts";

Deno.test("Seasonal Zone resolves every public run without authored copy", () => {
  for (const document of RIVER_RUN_CONFIGURATION_DOCUMENTS) {
    for (const run of document.runs) {
      for (
        const monthDay of [
          run.runWindow.start,
          run.runWindow.peak,
          run.runWindow.end,
        ]
      ) {
        const localDate = `2026-${monthDay}`;
        const stage = resolveRunStage(run, localDate);
        const result = resolveSeasonalZone({
          river: document.river,
          run,
          stage,
          localDate,
        });
        assert(result.label.length > 0, `${run.runId}/${localDate}`);
        assertEquals(result.basis, "seasonal_calendar");
        assertEquals(result.orientationOnly, true);
        if (result.status === "active") {
          assert(
            result.foundationReachIds.length > 0,
            `${run.runId}/${localDate} needs canonical active-zone reaches`,
          );
        }
      }
      for (const presentation of document.river.presentationContexts ?? []) {
        const localDate = `2026-${run.runWindow.peak}`;
        const result = resolveSeasonalZone({
          river: document.river,
          run,
          stage: resolveRunStage(run, localDate),
          localDate,
          presentationReachIds: presentation.foundationReachIds,
        });
        assert(
          result.foundationReachIds.length > 0,
          `${run.runId}/${presentation.state} needs an overlapping Seasonal Zone corridor`,
        );
      }
    }
  }
});

Deno.test("every catalog run carries audited approach and phase geography", () => {
  for (const document of RIVER_RUN_CONFIGURATION_DOCUMENTS) {
    for (const run of document.runs) {
      assert(run.seasonalZonePlan, `${run.runId} needs a Seasonal Zone plan`);
      assert(
        run.seasonalZonePlan.earlyApproach?.label.length,
        `${run.runId} needs early approach context`,
      );
      for (
        const [phase, reachIds] of Object.entries(
          run.seasonalZonePlan.phases,
        )
      ) {
        assert(reachIds.length > 0, `${run.runId}/${phase}`);
      }

      for (
        const beforeMigrationDate of [
          run.runWindow.preRunStart,
          run.runWindow.stagingStart,
        ]
      ) {
        const localDate = `2026-${beforeMigrationDate}`;
        const beforeMigration = resolveSeasonalZone({
          river: document.river,
          run,
          stage: resolveRunStage(run, localDate),
          localDate,
        });
        assertEquals(beforeMigration.status, "not_started", run.runId);
        assertEquals(
          beforeMigration.earlyApproach?.phase,
          "before_migration",
          `${run.runId}/${localDate}`,
        );
        assertEquals(
          beforeMigration.earlyApproach?.accessRecommendation,
          false,
        );
        assertEquals(beforeMigration.foundationReachIds, []);
      }
    }
  }
});

Deno.test("Oak Orchard exposes Point Breeze direction before each run's staging window", () => {
  const oak = RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS.find((document) =>
    document.river.riverId === "oak_orchard"
  )!;
  for (const run of oak.runs) {
    const localDate = "2026-09-01";
    const result = resolveSeasonalZone({
      river: oak.river,
      run,
      stage: resolveRunStage(run, localDate),
      localDate,
    });
    assertEquals(result.status, "not_started", run.runId);
    assertEquals(result.earlyApproach?.phase, "before_migration", run.runId);
    assertEquals(
      result.earlyApproach?.label,
      "Lake Ontario off Point Breeze, Oak Orchard harbor, and the creek mouth",
      run.runId,
    );
    assertEquals(result.foundationReachIds, [], run.runId);
  }
});

Deno.test("river-specific plans replace generic late and harbor behavior", () => {
  const pm = RIVER_RUN_CONFIGURATION_DOCUMENTS.find((document) =>
    document.river.riverId === "pere_marquette"
  )!;
  const pmChinook = pm.runs.find((run) =>
    run.runId === "pere_marquette_fall_chinook"
  )!;
  const pmTaperDate = "2026-10-01";
  assertEquals(
    resolveSeasonalZone({
      river: pm.river,
      run: pmChinook,
      stage: resolveRunStage(pmChinook, pmTaperDate),
      localDate: pmTaperDate,
    }).foundationReachIds,
    ["pm_middle_mainstem", "pm_upper_mainstem"],
  );

  const milwaukee = RIVER_RUN_CONFIGURATION_DOCUMENTS.find((document) =>
    document.river.riverId === "milwaukee"
  )!;
  const chinook = milwaukee.runs.find((run) =>
    run.runId === "milwaukee_fall_chinook"
  )!;
  const beginningDate = `2026-${chinook.runWindow.start}`;
  const beginning = resolveSeasonalZone({
    river: milwaukee.river,
    run: chinook,
    stage: resolveRunStage(chinook, beginningDate),
    localDate: beginningDate,
  });
  assertEquals(beginning.foundationReachIds, ["milwaukee_harbor_downtown"]);
  assertEquals(beginning.earlyApproach?.phase, "beginning");
});

Deno.test("Seasonal Zone honors species and state corridor boundaries", () => {
  const grand = RIVER_RUN_CONFIGURATION_DOCUMENTS.find((document) =>
    document.river.riverId === "grand"
  )!;
  const chinook = grand.runs.find((run) => run.species === "chinook_salmon")!;
  const chinookDate = `2026-${chinook.runWindow.peak}`;
  const chinookZone = resolveSeasonalZone({
    river: grand.river,
    run: chinook,
    stage: resolveRunStage(chinook, chinookDate),
    localDate: chinookDate,
  });
  assertEquals(chinookZone.foundationReachIds, [
    "grand_lower",
    "grand_middle_passage",
  ]);

  const stJoseph = RIVER_RUN_CONFIGURATION_DOCUMENTS.find((document) =>
    document.river.riverId === "st_joseph"
  )!;
  const steelhead = stJoseph.runs.find((run) => run.species === "steelhead")!;
  const steelheadDate = `2026-${steelhead.runWindow.peak}`;
  const stage = resolveRunStage(steelhead, steelheadDate);
  const indiana = stJoseph.river.presentationContexts!.find((context) =>
    context.state === "IN"
  )!;
  const indianaZone = resolveSeasonalZone({
    river: stJoseph.river,
    run: steelhead,
    stage,
    localDate: steelheadDate,
    presentationReachIds: indiana.foundationReachIds,
  });
  assertEquals(indianaZone.foundationReachIds, [
    "st_joseph_indiana",
    "st_joseph_twin_branch",
  ]);
});

Deno.test("Seasonal Zone orders migration downstream to upstream even when foundation order is reversed", () => {
  const manistee = RIVER_RUN_CONFIGURATION_DOCUMENTS.find((document) =>
    document.river.riverId === "big_manistee"
  )!;
  const chinook = manistee.runs.find((run) =>
    run.species === "chinook_salmon"
  )!;
  const localDate = `2026-${chinook.runWindow.peak}`;
  const result = resolveSeasonalZone({
    river: manistee.river,
    run: chinook,
    stage: resolveRunStage(chinook, localDate),
    localDate,
  });
  assertEquals(result.foundationReachIds, [
    "big_manistee_bear_creek_to_m55",
    "big_manistee_high_bridge_to_bear_creek",
    "big_manistee_tippy_tailwater",
  ]);
  assertEquals(result.label, "Lower river → Upper river");
});
