import { assert, assertEquals } from "jsr:@std/assert";
import {
  addDays,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  type PrimitiveDisplay,
  resolveRunStage,
  RIVER_RUN_COPY_VERSION,
  type RiverRunSpecies,
  scoreConditionsSuggest,
  scoreFishability,
  scoreFishInRiver,
  scorePush,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;

Deno.test("every primitive uses the single canonical copy template", () => {
  const displays: PrimitiveDisplay[] = [
    resolveRunStage(run, "2026-09-20"),
    scoreFishInRiver(run, "2026-10-15"),
    push(),
    fishability(),
    scoreConditionsSuggest({
      localDate: "2026-08-01",
      run,
      evidenceByDate: {},
      baselines: [],
    }),
  ];

  assertEquals(RIVER_RUN_COPY_VERSION, "river-run-copy-v34");
  for (const display of displays) {
    assertEquals(display.copyVersion, RIVER_RUN_COPY_VERSION);
    assertEquals("copyVariant" in display, false);
    assert(display.headline.trim().length > 0);
    assert(display.detail.trim().length > 0);
    assert(display.tip.trim().length > 0);
  }
});

Deno.test("canonical copy stays stable for identical primitive inputs", () => {
  assertEquals(
    resolveRunStage(run, "2026-08-25"),
    resolveRunStage(run, "2026-08-25"),
  );
  assertEquals(push(), push());
  assertEquals(fishability(), fishability());
  assertEquals(
    scoreFishInRiver(run, "2026-10-15"),
    scoreFishInRiver(run, "2026-10-15"),
  );
});

Deno.test("Migration Stage and Fish In River name the selected species", () => {
  const names: Record<RiverRunSpecies, string> = {
    chinook_salmon: "Chinook salmon",
    coho_salmon: "Coho salmon",
    steelhead: "Steelhead",
    skamania: "Skamania steelhead",
    lake_run_brown_trout: "migratory brown trout",
    atlantic_salmon: "Atlantic salmon",
  };
  for (const [species, name] of Object.entries(names)) {
    const speciesRun = { ...run, species: species as RiverRunSpecies };
    assert(resolveRunStage(speciesRun, "2026-08-10").headline.includes(name));
    assert(scoreFishInRiver(speciesRun, "2026-08-10").headline.includes(name));
  }
});

Deno.test("Fish In River separates level from run direction", () => {
  const limited = [];
  for (
    let localDate = "2026-08-15";
    localDate <= `2026-${run.runWindow.lateEnd}`;
    localDate = addDays(localDate, 1)
  ) {
    const display = scoreFishInRiver(run, localDate);
    if (display.label === "Limited presence") limited.push(display);
  }
  const rising = limited.find((item) => item.curveDirection === "rising");
  const falling = limited.find((item) => item.curveDirection === "falling");
  assert(rising);
  assert(falling);
  assert(rising.headline.includes("building"));
  assert(falling.headline.includes("declining"));
  assertEquals(rising.headline === falling.headline, false);

  const lowerCapRun = {
    ...run,
    historicalPresence: {
      ...run.historicalPresence,
      maximum: 6 as const,
    },
  };
  const lowerCapPeak = scoreFishInRiver(lowerCapRun, "2026-09-20");
  assertEquals(lowerCapPeak.score, 60);
  assertEquals(lowerCapPeak.maximum, 100);
  assertEquals(lowerCapPeak.riverCeiling, 60);
  assertEquals(lowerCapPeak.label, "Peak presence");
  assertEquals(lowerCapPeak.curveDirection, "near_peak");
});

function push() {
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
  });
}

function fishability() {
  return scoreFishability({
    rules: run.fishabilityBands,
    gaugeFreshness: "fresh",
    flowBand: "ideal",
    flowSignal: "stable",
    currentHydraulicValue: 600,
    hydraulicAbsoluteChange24h: 0,
    hydraulicPercentChange24h: 0,
    localDate: "2026-09-05",
  });
}
