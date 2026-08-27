import { assertMatch, assertNotMatch } from "jsr:@std/assert";
import {
  addDays,
  BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE,
  BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE,
  MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
  resolveRunStage,
  ROOT_FALL_BROWN_TROUT_RUN_PROFILE,
  scoreActivity,
  scoreFishInRiver,
  SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE,
} from "../index.ts";

const runs = [
  BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE,
  MILWAUKEE_FALL_BROWN_TROUT_RUN_PROFILE,
  SHEBOYGAN_FALL_BROWN_TROUT_RUN_PROFILE,
  ROOT_FALL_BROWN_TROUT_RUN_PROFILE,
  BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE,
];

const date = (monthDay: string) => `2026-${monthDay}`;

Deno.test("every migratory Brown Stage follows entry, spawning, and repeat-spawner behavior", () => {
  for (const run of runs) {
    const staging = resolveRunStage(run, date(run.runWindow.stagingStart));
    const beginning = resolveRunStage(run, date(run.runWindow.start));
    const building = resolveRunStage(
      run,
      date(run.runWindow.buildingEstablishedStart),
    );
    const peak = resolveRunStage(run, date(run.runWindow.peak));
    const tapering = resolveRunStage(
      run,
      addDays(date(run.runWindow.peakEnd), 1),
    );
    const ending = resolveRunStage(
      run,
      addDays(date(run.runWindow.taperingEnd), 1),
    );
    const complete = resolveRunStage(
      run,
      addDays(date(run.runWindow.end), 1),
    );

    assertMatch(JSON.stringify(staging), /staging|migration/i, run.runId);
    assertMatch(JSON.stringify(beginning), /enter|migrant/i, run.runId);
    assertMatch(
      JSON.stringify(building),
      /migrat|spawn|holding/i,
      run.runId,
    );
    assertMatch(
      JSON.stringify(peak),
      run.runId === "bois_brule_fall_brown_trout"
        ? /core Bois Brule.*migration window/i
        : /migration-and-spawning|spawning migration/i,
      run.runId,
    );
    assertMatch(
      JSON.stringify(peak),
      /spawning fish|spawners|redds/i,
      run.runId,
    );
    assertMatch(
      JSON.stringify(tapering),
      /late migrants|post-spawn|fresh.*less consistent/i,
      run.runId,
    );
    assertMatch(JSON.stringify(ending), /remain|return lakeward/i, run.runId);
    assertMatch(JSON.stringify(complete), /surviv|remain|return/i, run.runId);
    assertNotMatch(
      JSON.stringify({ staging, beginning, building, peak, tapering, ending }),
      /dying|deteriorat|spent fish|semelpar/i,
      run.runId,
    );
  }
});

Deno.test("Bois Brule Stage separates its early migration peak from later fall spawning", () => {
  const building = resolveRunStage(
    BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE,
    date(BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE.runWindow.buildingBroadStart!),
  );
  const peak = resolveRunStage(
    BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE,
    date(BOIS_BRULE_FALL_BROWN_TROUT_RUN_PROFILE.runWindow.peak),
  );
  assertMatch(JSON.stringify(building), /entry, travel, and holding/i);
  assertNotMatch(JSON.stringify(building), /actively spawning/i);
  assertMatch(
    JSON.stringify(peak),
    /spawning activity generally develops later/i,
  );
  assertNotMatch(JSON.stringify(peak), /migration-and-spawning window/i);
});

Deno.test("Big Manistee Stage keeps the documented sparse November tail active", () => {
  const ending = resolveRunStage(
    BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE,
    "2026-11-16",
  );
  const complete = resolveRunStage(
    BIG_MANISTEE_FALL_BROWN_TROUT_RUN_PROFILE,
    "2026-12-01",
  );
  assertMatch(JSON.stringify(ending), /winding down|residual late/i);
  assertNotMatch(JSON.stringify(ending), /migration is complete/i);
  assertMatch(JSON.stringify(complete), /migration is complete/i);
});

Deno.test("every migratory Brown Fish In River read separates migration presence from fish identity", () => {
  for (const run of runs) {
    const rising = scoreFishInRiver(
      run,
      date(run.runWindow.buildingEstablishedStart),
    );
    const peak = scoreFishInRiver(run, date(run.runWindow.peak));
    const falling = scoreFishInRiver(
      run,
      addDays(date(run.runWindow.peakEnd), 1),
    );
    assertMatch(
      JSON.stringify(rising),
      /spawning-migration|lake-run migration/i,
    );
    assertMatch(JSON.stringify(peak), /resident Browns|individual fish/i);
    assertMatch(
      JSON.stringify(falling),
      /surviving fish.*hold.*return lakeward/i,
    );
    assertNotMatch(
      JSON.stringify({ rising, peak, falling }),
      /dying|deteriorat|spent fish|all.*leave/i,
      run.runId,
    );
  }
});

Deno.test("every migratory Brown Activity read describes response, not migration or mortality", () => {
  for (const run of runs) {
    const targetDate = addDays(date(run.runWindow.peakEnd), 1);
    const result = scoreActivity({
      rules: run.activity!,
      requestDate: targetDate,
      targetDate,
      runStage: "tapering",
      staging: false,
      waterTempF: 52,
      temperatureTrend: "neutral",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      currentHydraulicValue: 100,
      fishabilityBands: run.fishabilityBands,
      flowSignal: "stable",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `${targetDate}T${String(hour).padStart(2, "0")}:00`,
        cloud_cover_pct: 75,
        shortwave_w_m2: hour >= 8 && hour <= 18 ? 150 : 0,
        clear_sky_shortwave_w_m2: hour >= 8 && hour <= 18 ? 600 : 0,
        precipitation_in: 0,
      })),
    });
    assertMatch(JSON.stringify(result), /respons|already present/i, run.runId);
    assertMatch(
      JSON.stringify(result),
      /late migrants|spawning fish|post-spawn|repeat spawners/i,
      run.runId,
    );
    assertNotMatch(
      JSON.stringify(result),
      /fresh movement|catch probability|dying|deteriorat|remain living/i,
      run.runId,
    );
  }
});
