import {
  assert,
  assertEquals,
  assertMatch,
  assertNotEquals,
  assertNotMatch,
} from "jsr:@std/assert";
import {
  GRAND_FALL_STEELHEAD_RUN_PROFILE,
  PLATTE_FALL_STEELHEAD_RUN_PROFILE,
  resolveRunStage,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  scoreFishInRiver,
  WHITE_FALL_CHINOOK_RUN_PROFILE,
  WHITE_FALL_STEELHEAD_RUN_PROFILE,
} from "../index.ts";

Deno.test("White Chinook guidance progresses inside the former multi-week beginning gap", () => {
  const early = resolveRunStage(
    WHITE_FALL_CHINOOK_RUN_PROFILE,
    "2026-08-15",
  );
  const forestOpening = resolveRunStage(
    WHITE_FALL_CHINOOK_RUN_PROFILE,
    "2026-08-24",
  );
  const established = resolveRunStage(
    WHITE_FALL_CHINOOK_RUN_PROFILE,
    "2026-09-01",
  );
  const broad = resolveRunStage(
    WHITE_FALL_CHINOOK_RUN_PROFILE,
    "2026-09-15",
  );

  assertEquals(early.stage, "beginning");
  assertMatch(early.whereToStart ?? "", /^Lower river/i);
  assertNotMatch(early.whereToStart ?? "", /Forest/i);

  assertEquals(forestOpening.stage, "building");
  assertMatch(forestOpening.whereToStart ?? "", /Lower river first/i);
  assertMatch(forestOpening.whereToStart ?? "", /Forest corridor/i);

  assertMatch(established.whereToStart ?? "", /Lower river and Forest/i);
  assertMatch(established.whereToStart ?? "", /Upper accessible.*conditional/i);
  assertMatch(broad.whereToStart ?? "", /^Forest corridor first/i);
  assertMatch(broad.whereToStart ?? "", /Upper accessible corridor/i);

  for (const display of [early, forestOpening, established, broad]) {
    assertMatch(display.detail, /below Hesperia Dam/i);
  }
});

Deno.test("all hidden onboarding runs use river-specific reach and barrier copy", () => {
  for (const run of RIVER_RUN_DRAFT_RUN_PROFILES) {
    const display = resolveRunStage(run, `2026-${run.runWindow.peak}`);
    if (run.riverId === "big_manistee") {
      assertEquals(
        run.runStageCopyStrategy,
        "big_manistee_tailwater",
        run.runId,
      );
      assertMatch(display.whereToStart ?? "", /Upper river/i, run.runId);
      assertMatch(JSON.stringify(display), /Tippy Dam/i, run.runId);
      assertNotMatch(JSON.stringify(display), /above Tippy/i, run.runId);
      continue;
    }
    assertEquals(run.runStageCopyStrategy, "onboarding_corridor", run.runId);
    assert(display.whereToStart, run.runId);
    if (run.riverId === "grand") {
      assertMatch(display.detail, /Grand River guidance/i, run.runId);
      assertMatch(display.whereToStart, /Lower Grand River/i, run.runId);
      assertNotMatch(display.whereToStart, /upper river/i, run.runId);
    } else if (run.riverId === "platte") {
      assertMatch(display.detail, /Lower Weir closure/i, run.runId);
      assertMatch(
        display.whereToStart,
        /below the Lower Weir closure/i,
        run.runId,
      );
      assertNotMatch(display.whereToStart, /middle|upper|harbor/i, run.runId);
    } else if (run.riverId === "white") {
      assertMatch(display.detail, /below Hesperia Dam/i, run.runId);
      assertMatch(display.whereToStart, /below Hesperia/i, run.runId);
      assertNotMatch(
        display.whereToStart,
        /wherever passage remains open/i,
        run.runId,
      );
    } else if (run.riverId === "milwaukee") {
      assertMatch(display.detail, /Bridge Street Dam/i, run.runId);
      assertMatch(display.whereToStart, /^Restrictions first:/, run.runId);
      assertMatch(display.whereToStart, /Kletzsch.*refuge/i, run.runId);
      assertMatch(
        display.whereToStart,
        /night-fishing restriction/i,
        run.runId,
      );
    } else if (run.riverId === "sheboygan") {
      assertMatch(display.detail, /Waelderhaus Dam/i, run.runId);
      assertMatch(display.whereToStart, /^Restrictions first:/, run.runId);
      assertMatch(
        display.whereToStart,
        /night-fishing restriction/i,
        run.runId,
      );
      assertMatch(display.whereToStart, /Kiwanis|Kohler/i, run.runId);
    } else if (run.riverId === "bois_brule") {
      assertMatch(display.detail, /Highway 2/i, run.runId);
      assertMatch(display.whereToStart, /^Restrictions first:/, run.runId);
      assertMatch(display.whereToStart, /Nov\. 15/i, run.runId);
      assertMatch(display.whereToStart, /Box Car Hole/i, run.runId);
      assertMatch(display.whereToStart, /Mays Ledges/i, run.runId);
      assertMatch(display.whereToStart, /500-foot refuge/i, run.runId);
    } else if (run.riverId === "green") {
      assertMatch(display.detail, /municipal watershed/i, run.runId);
      assertMatch(display.whereToStart, /Spot Finder/i, run.runId);
      assertNotMatch(JSON.stringify(display), /Grand River/i, run.runId);
    } else if (run.riverId === "puyallup") {
      assertMatch(display.detail, /Carbon River confluence/i, run.runId);
      assertMatch(display.whereToStart, /Spot Finder/i, run.runId);
      assertNotMatch(JSON.stringify(display), /Grand River/i, run.runId);
    } else if (run.riverId === "cowlitz") {
      assertMatch(display.detail, /Barrier Dam exclusion/i, run.runId);
      assertMatch(display.whereToStart, /Spot Finder/i, run.runId);
      assertNotMatch(JSON.stringify(display), /Grand River/i, run.runId);
    } else if (run.riverId === "salmon_ny") {
      assertMatch(display.detail, /Lighthouse Hill/i, run.runId);
      assertMatch(display.whereToStart, /Spot Finder/i, run.runId);
      assertNotMatch(
        JSON.stringify(display),
        /Waterport|Lower Falls/i,
        run.runId,
      );
    } else if (run.riverId === "oak_orchard") {
      assertMatch(display.detail, /Waterport/i, run.runId);
      assertMatch(display.whereToStart, /Spot Finder/i, run.runId);
      assertNotMatch(
        JSON.stringify(display),
        /Lighthouse Hill|Lower Falls/i,
        run.runId,
      );
    } else if (run.riverId === "lower_genesee") {
      assertMatch(display.detail, /Lower Falls/i, run.runId);
      assertMatch(display.whereToStart, /Spot Finder/i, run.runId);
      assertNotMatch(
        JSON.stringify(display),
        /Lighthouse Hill|Waterport/i,
        run.runId,
      );
    } else {
      assertEquals(run.riverId, "root", run.runId);
      assertMatch(display.detail, /Steelhead Facility/i, run.runId);
      assertMatch(display.whereToStart, /^Restrictions first:/, run.runId);
      assertMatch(
        display.whereToStart,
        /night-fishing restriction/i,
        run.runId,
      );
      assertMatch(display.whereToStart, /City Parks|Lincoln Park/i, run.runId);
    }
  }
});

Deno.test("Fish In River remains daily-interpolated for every onboarding run", () => {
  for (const run of RIVER_RUN_DRAFT_RUN_PROFILES) {
    const start = `2026-${run.runWindow.start}`;
    const next = addLocalDays(start, 1);
    const first = scoreFishInRiver(run, start);
    const second = scoreFishInRiver(run, next);
    assertEquals(first.curveDirection, "rising", run.runId);
    assertNotEquals(first.curveFraction, second.curveFraction, run.runId);
  }
});

Deno.test("onboarding Steelhead tails end the fall-entry estimate without claiming fish left", () => {
  for (
    const [run, date] of [
      [GRAND_FALL_STEELHEAD_RUN_PROFILE, "2027-01-01"],
      [PLATTE_FALL_STEELHEAD_RUN_PROFILE, "2026-12-16"],
      [WHITE_FALL_STEELHEAD_RUN_PROFILE, "2026-12-29"],
    ] as const
  ) {
    const stage = resolveRunStage(run, date);
    const presence = scoreFishInRiver(run, date);
    assertEquals(stage.label, "Fall entry complete", run.runId);
    assertMatch(stage.tip, /does not mean|not a complete/i, run.runId);
    assertEquals(presence.label, "Fall entry complete", run.runId);
    assertEquals(presence.score, null, run.runId);
    assertMatch(presence.detail, /may remain/i, run.runId);
  }
});

function addLocalDays(localDate: string, days: number): string {
  const date = new Date(`${localDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
