import { assert, assertEquals, assertNotEquals } from "jsr:@std/assert";
import {
  addDays,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  type PrimitiveDisplay,
  RIVER_RUN_COPY_VERSION,
  resolveRunStage,
  scoreConditionsSuggest,
  scoreFishability,
  scoreFishInRiver,
  scorePush,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;

Deno.test("copy variants preserve every primitive fact and classification", () => {
  const pairs: Array<[PrimitiveDisplay, PrimitiveDisplay]> = [
    [
      resolveRunStage(run, "2026-09-20", { copyVariant: "A" }),
      resolveRunStage(run, "2026-09-20", { copyVariant: "B" }),
    ],
    [
      scoreFishInRiver(run, "2026-10-15", { copyVariant: "A" }),
      scoreFishInRiver(run, "2026-10-15", { copyVariant: "B" }),
    ],
    [
      push("A"),
      push("B"),
    ],
    [
      fishability("A"),
      fishability("B"),
    ],
    [
      scoreConditionsSuggest({
        localDate: "2026-08-01",
        run,
        evidenceByDate: {},
        baselines: [],
        copyVariant: "A",
      }),
      scoreConditionsSuggest({
        localDate: "2026-08-01",
        run,
        evidenceByDate: {},
        baselines: [],
        copyVariant: "B",
      }),
    ],
  ];

  for (const [canonical, alternate] of pairs) {
    assertEquals(canonical.copyVersion, RIVER_RUN_COPY_VERSION);
    assertEquals(alternate.copyVersion, RIVER_RUN_COPY_VERSION);
    assertEquals(canonical.copyVariant, "A");
    assertEquals(alternate.copyVariant, "B");
    assertEquals(canonical.score, alternate.score);
    assertEquals(canonical.label, alternate.label);
    assertEquals(canonical.detail, alternate.detail);
    assertEquals(canonical.reasonCodes, alternate.reasonCodes);
    assertNotEquals(canonical.headline, alternate.headline);
    assertNotEquals(canonical.tip, alternate.tip);
  }
});

Deno.test("deterministic copy stays stable for its primitive refresh window", () => {
  const firstStageRead = resolveRunStage(run, "2026-08-25");
  const laterStageRead = resolveRunStage(run, "2026-09-10");
  assertEquals(firstStageRead.stage, "building");
  assertEquals(firstStageRead.copyVariant, laterStageRead.copyVariant);

  assertEquals(push().copyVariant, push().copyVariant);
  assertEquals(fishability().copyVariant, fishability().copyVariant);
  assertEquals(
    scoreFishInRiver(run, "2026-10-15").copyVariant,
    scoreFishInRiver(run, "2026-10-15").copyVariant,
  );
});

Deno.test("Fish In River separates level from curve direction", () => {
  const limited = [];
  for (
    let localDate = "2026-08-15";
    localDate <= "2026-11-03";
    localDate = addDays(localDate, 1)
  ) {
    const display = scoreFishInRiver(run, localDate, { copyVariant: "A" });
    if (display.label === "Limited historical presence") {
      limited.push(display);
    }
  }
  const rising = limited.find((item) => item.curveDirection === "rising");
  const falling = limited.find((item) => item.curveDirection === "falling");
  assert(rising);
  assert(falling);
  assert(rising.headline.includes("increasing"));
  assert(falling.headline.includes("declining"));
  assertEquals(falling.headline.includes("Building"), false);

  const lowerCapRun = {
    ...run,
    historicalPresence: {
      ...run.historicalPresence,
      maximum: 6 as const,
    },
  };
  const lowerCapPeak = scoreFishInRiver(lowerCapRun, "2026-09-20", {
    copyVariant: "A",
  });
  assertEquals(lowerCapPeak.score, 6);
  assertEquals(lowerCapPeak.maximum, 6);
  assertEquals(lowerCapPeak.label, "Peak historical presence");
  assertEquals(lowerCapPeak.curveDirection, "near_peak");
});

function push(copyVariant?: "A" | "B") {
  return scorePush({
    movementEngineId: "fall_cooling",
    rules: run.push,
    gaugeFreshness: "fresh",
    rainSignal: "strong_rain",
    flowSignal: "meaningful_rise",
    currentHydraulicValue: 700,
    hydraulicAbsoluteChange24h: 70,
    hydraulicPercentChange24h: 11.1,
    temperatureSignal: "cooling",
    temperatureSourceType: "same_gauge",
    waterTempF: 59,
    trackingState: "active",
    trackingStartDate: "2026-08-15",
    trackingEndDate: "2026-10-20",
    localDate: "2026-09-05",
    copyVariant,
  });
}

function fishability(copyVariant?: "A" | "B") {
  return scoreFishability({
    rules: run.fishabilityBands,
    gaugeFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    currentHydraulicValue: 600,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    localDate: "2026-09-05",
    copyVariant,
  });
}
