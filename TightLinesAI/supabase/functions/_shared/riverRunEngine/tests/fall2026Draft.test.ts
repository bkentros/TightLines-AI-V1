import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  buildRiverLiveConditions,
  FALL_2026_DRAFT_RIVERS,
  FALL_2026_DRAFT_RUNS,
  MANITOWOC_RIVER_PROFILE,
  OSWEGO_FALL_BROWN,
  OSWEGO_FALL_COHO,
  OSWEGO_RIVER_PROFILE,
  scoreActivity,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";
import type {
  NormalizedGaugeObservation,
  SupabaseLikeClient,
} from "../index.ts";

Deno.test("fall 2026 river and run drafts validate and remain hidden", () => {
  assertEquals(FALL_2026_DRAFT_RIVERS.length, 3);
  assertEquals(FALL_2026_DRAFT_RUNS.length, 9);
  for (const river of FALL_2026_DRAFT_RIVERS) {
    const result = validateRiverProfile(river);
    assertEquals(
      result.valid,
      true,
      result.issues.map((issue) => issue.message).join("\n"),
    );
  }
  for (const run of FALL_2026_DRAFT_RUNS) {
    const river = FALL_2026_DRAFT_RIVERS.find((item) =>
      item.riverId === run.riverId
    )!;
    const result = validateRunProfile(run, river);
    assertEquals(
      result.valid,
      true,
      `${run.runId}: ${result.issues.map((issue) => issue.message).join("\n")}`,
    );
    assertEquals(run.publicAudit.isEnabled, false);
    assertEquals(result.publicVisible, false);
  }
});

Deno.test("Manitowoc and Oswego retain archival temperature context without live or scored temperature", () => {
  for (const river of [MANITOWOC_RIVER_PROFILE, OSWEGO_RIVER_PROFILE]) {
    assertEquals(river.waterTemperatureSources, []);
    assertEquals(river.conditionDataCapabilities.waterTemperature.status, "unavailable");
    assertEquals(river.historicalWaterTemperatureSource?.windowRadiusDays, 3);
    assertEquals(
      Object.keys(river.historicalWaterTemperatureSource?.normals ?? {}).length,
      365,
    );
    assert(
      river.historicalWaterTemperatureSource?.normals["10-15"]
        .historicalYears! >= 2,
    );
  }
  for (
    const run of FALL_2026_DRAFT_RUNS.filter((item) =>
      item.riverId === "manitowoc" || item.riverId === "oswego"
    )
  ) {
    assertEquals(run.activity?.weights.waterTemperature, 0);
    assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, []);
    assertMatch(run.activity?.evidenceNotes ?? "", /hydraulic-only/i);
  }
});

Deno.test("Manitowoc and Oswego Gauge Read renders the archival average beside live hydraulics", async () => {
  for (const river of [MANITOWOC_RIVER_PROFILE, OSWEGO_RIVER_PROFILE]) {
    const source = river.hydraulicSources[0];
    const gaugeObservations: NormalizedGaugeObservation[] = [{
      provider: "USGS",
      siteId: source.siteId,
      observedAt: "2026-10-15T12:00:00Z",
      flow_cfs: river.riverId === "manitowoc" ? 142 : 4_840,
      gage_height_ft: river.riverId === "manitowoc" ? 3.1 : 5.4,
      approvalStatus: "Provisional",
      source: "usgs_continuous_values",
    }];
    const conditions = await buildRiverLiveConditions({
      client: {} as SupabaseLikeClient,
      river,
      localDate: "2026-10-15",
      refreshSlot: "08:00",
      refreshAtUtc: "2026-10-15T12:00:00Z",
      fetchFn: () => {
        throw new Error("provider should not be called");
      },
      gaugeObservations,
      seasonalContextsByMetric: {
        flow_cfs: null,
        gage_height_ft: null,
      },
    });
    assertEquals(conditions.status, "partial");
    const temperature = conditions.metrics.find((metric) =>
      metric.metric === "water_temp_f"
    );
    assert(temperature);
    assertEquals(temperature.label, "Historical Water Temperature");
    assertEquals(temperature.value, null);
    assertEquals(temperature.seasonalContext?.windowRadiusDays, 3);
    assertEquals(
      temperature.seasonalContext?.source,
      "usgs_approved_calendar_window_archive",
    );
    assert((temperature.seasonalContext?.average ?? 0) > 32);
  }
});

Deno.test("hydraulic-only fall 2026 Activity is explicitly Limited", () => {
  const run = OSWEGO_FALL_COHO;
  const result = scoreActivity({
    rules: run.activity!,
    requestDate: "2026-10-05",
    targetDate: "2026-10-05",
    runStage: "peak",
    staging: false,
    waterTempF: null,
    temperatureTrend: "neutral_missing",
    gaugeFreshness: "fresh",
    weatherFreshness: "fresh",
    flowBand: "ideal",
    currentHydraulicValue: 4_840,
    fishabilityBands: run.fishabilityBands,
    flowSignal: "stable",
    hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
      time_local: `2026-10-05T${String(hour).padStart(2, "0")}:00`,
      cloud_cover_pct: 70,
      shortwave_w_m2: hour >= 8 && hour < 18 ? 150 : 0,
      clear_sky_shortwave_w_m2: hour >= 8 && hour < 18 ? 450 : 0,
      precipitation_in: 0,
    })),
  });
  assertEquals(result.confidence, "Limited");
  assertEquals(typeof result.score, "number");
  assertMatch(result.detail, /hydraulic-only/i);
  assertMatch(result.detail, /temperature.*zero influence/i);
});

Deno.test("Oswego calendars follow DEC hydropower salmon and post-salmon brown timing", () => {
  assertEquals(OSWEGO_FALL_COHO.runWindow.peakStart, "09-25");
  assertEquals(OSWEGO_FALL_COHO.runWindow.peak, "10-05");
  assertEquals(OSWEGO_FALL_COHO.runWindow.peakEnd, "10-15");
  assertEquals(OSWEGO_FALL_BROWN.runWindow.start, "10-15");
  assertEquals(OSWEGO_FALL_BROWN.runWindow.peak, "11-25");
});
