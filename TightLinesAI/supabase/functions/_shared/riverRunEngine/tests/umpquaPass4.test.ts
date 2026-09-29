import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  NORTH_UMPQUA_CONFIGURATION_DOCUMENT,
  NORTH_UMPQUA_FALL_COHO_RUN,
  NORTH_UMPQUA_RIVER_PROFILE,
  resolveAdminOverrideBand,
  resolveRunStage,
  resolveSeasonalZone,
  RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS,
  RIVER_RUN_DRAFT_RIVER_PROFILES,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  scoreActivity,
  scoreFishability,
  scorePush,
  UMPQUA_MAINSTEM_CONFIGURATION_DOCUMENT,
  UMPQUA_MAINSTEM_FALL_CHINOOK_RUN,
  UMPQUA_MAINSTEM_FALL_COHO_RUN,
  UMPQUA_MAINSTEM_RIVER_PROFILE,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";
import type { AuditedRiverRunProfile, DirectEventSample } from "../types.ts";
import {
  RIVER_RUN_SPOT_FINDERS,
  riverRunSpotFinderForRiver,
} from "../../../../../lib/riverRunSpotFinder.ts";

const runs = [
  UMPQUA_MAINSTEM_FALL_CHINOOK_RUN,
  UMPQUA_MAINSTEM_FALL_COHO_RUN,
  NORTH_UMPQUA_FALL_COHO_RUN,
];
const rivers = [UMPQUA_MAINSTEM_RIVER_PROFILE, NORTH_UMPQUA_RIVER_PROFILE];
const documents = [
  UMPQUA_MAINSTEM_CONFIGURATION_DOCUMENT,
  NORTH_UMPQUA_CONFIGURATION_DOCUMENT,
];

type Pass3Run = {
  runId: string;
  calendar: AuditedRiverRunProfile["runWindow"];
  historicalPresence: { maximum: number };
  activity: {
    weights: NonNullable<AuditedRiverRunProfile["activity"]>["weights"];
    caps: {
      noMeasuredRiverData: number;
      noWaterTemperature: number;
      lateRun: number;
      ending: number;
      taperingPenalty: number;
    };
  };
};

type Pass3Truth = {
  deliveryContract: { clientCapabilityId: string; databaseMigration: string };
  rivers: Record<string, {
    fishingShape: {
      bands: Record<string, number>;
      caps: Record<string, number>;
    };
    pushCalibration: {
      rising24h: { absoluteCfs: number; percent: number };
      meaningfulRise24h: { absoluteCfs: number; percent: number };
      sharpRise24h: { absoluteCfs: number; percent: number };
      temperatureRole: string;
    };
  }>;
  runs: Pass3Run[];
};

const truth = JSON.parse(
  await Deno.readTextFile(
    new URL(
      "../../../../../docs/onboarding/river-run/umpqua_fall_2026_pass3_run_truth.json",
      import.meta.url,
    ),
  ),
) as Pass3Truth;

function riverFor(run: AuditedRiverRunProfile) {
  return rivers.find((river) => river.riverId === run.riverId)!;
}

function fourHourSeries(low: number, high: number): DirectEventSample[] {
  const values = [...Array(7).fill(low), ...Array(6).fill(high)];
  const end = Date.parse("2026-10-25T20:00:00.000Z");
  return values.map((value, index) => ({
    windowEndAt: new Date(
      end - (values.length - index - 1) * 4 * 3_600_000,
    ).toISOString(),
    value,
    observationCount: 8,
  }));
}

Deno.test("Umpqua Pass 4 profiles validate only in the hidden draft registry", () => {
  assertEquals(
    truth.deliveryContract.clientCapabilityId,
    "river_run_umpqua_fall_v1",
  );
  assertMatch(
    truth.deliveryContract.databaseMigration,
    /^No schema or data migration/i,
  );
  assertEquals(
    RIVER_RUN_DRAFT_RIVER_PROFILES.map((river) => river.riverId).toSorted(),
    ["north_umpqua", "umpqua_mainstem"],
  );
  assertEquals(
    RIVER_RUN_DRAFT_RUN_PROFILES.map((run) => run.runId).toSorted(),
    runs.map((run) => run.runId).toSorted(),
  );
  assertEquals(RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS.length, 2);

  for (const river of rivers) {
    const result = validateRiverProfile(river);
    assertEquals(
      result.valid,
      true,
      result.issues.map((issue) => issue.message).join("\n"),
    );
    assertEquals(
      RIVER_RUN_RIVER_PROFILES.some((item) => item.riverId === river.riverId),
      false,
    );
  }
  for (const run of runs) {
    const result = validateRunProfile(run, riverFor(run));
    assertEquals(
      result.valid,
      true,
      result.issues.map((issue) => issue.message).join("\n"),
    );
    assertEquals(result.publicVisible, false, run.runId);
    assertEquals(run.publicAudit.isEnabled, false, run.runId);
    assertEquals(
      RIVER_RUN_RUN_PROFILES.some((item) => item.runId === run.runId),
      false,
    );
  }
  for (const document of documents) {
    const issues = validateConfigurationRevision({
      configKey: document.river.riverId,
      revision: 1,
      status: "draft",
      document,
      evidenceNotes: "Umpqua Pass 4 hidden owner-review implementation.",
    });
    assert(
      issues.every((issue) => issue.severity !== "error"),
      issues.map((issue) => `${issue.field}: ${issue.message}`).join("\n"),
    );
  }
});

Deno.test("runtime calendars, strengths, Activity, and Push match accepted Pass 3 truth", () => {
  for (const run of runs) {
    const accepted = truth.runs.find((item) => item.runId === run.runId)!;
    assertEquals(run.runWindow, accepted.calendar, `${run.runId} calendar`);
    assertEquals(
      run.historicalPresence.maximum,
      accepted.historicalPresence.maximum,
      `${run.runId} strength`,
    );
    assertEquals(run.historicalPresence.distributionScope, "broad", run.runId);
    assertEquals(run.activity?.weights, accepted.activity.weights, run.runId);
    assertEquals(run.activity?.caps.noMeasuredRiverData, 60, run.runId);
    assertEquals(
      run.activity?.caps.noWaterTemperature,
      accepted.activity.caps.noWaterTemperature,
      run.runId,
    );
    assertEquals(run.activity?.caps.lateRun, 75, run.runId);
    assertEquals(run.activity?.caps.ending, 42, run.runId);
    assertEquals(run.activity?.caps.taperingPenalty, 15, run.runId);
  }

  for (const riverId of ["umpqua_mainstem", "north_umpqua"]) {
    const accepted = truth.rivers[riverId];
    const run = runs.find((item) => item.riverId === riverId)!;
    const bands = run.fishabilityBands!;
    assertEquals([
      bands.tooLow.max,
      bands.lowFishable.min,
      bands.lowFishable.max,
      bands.ideal.min,
      bands.ideal.max,
      bands.highFishable.min,
      bands.highFishable.max,
      bands.blownOut.min,
    ], [
      accepted.fishingShape.bands.tooLowMax,
      accepted.fishingShape.bands.lowFishableMin,
      accepted.fishingShape.bands.lowFishableMax,
      accepted.fishingShape.bands.idealMin,
      accepted.fishingShape.bands.idealMax,
      accepted.fishingShape.bands.highFishableMin,
      accepted.fishingShape.bands.highFishableMax,
      accepted.fishingShape.bands.blownOutMin,
    ]);
    assertEquals(
      [
        run.push?.hydraulic.rising24h.absolute,
        run.push?.hydraulic.rising24h.percent,
        run.push?.hydraulic.meaningfulRise24h.absolute,
        run.push?.hydraulic.meaningfulRise24h.percent,
        run.push?.hydraulic.sharpRise24h.absolute,
        run.push?.hydraulic.sharpRise24h.percent,
      ],
      [
        accepted.pushCalibration.rising24h.absoluteCfs,
        accepted.pushCalibration.rising24h.percent,
        accepted.pushCalibration.meaningfulRise24h.absoluteCfs,
        accepted.pushCalibration.meaningfulRise24h.percent,
        accepted.pushCalibration.sharpRise24h.absoluteCfs,
        accepted.pushCalibration.sharpRise24h.percent,
      ],
      `${riverId} Push thresholds`,
    );
    assertEquals(
      run.push?.directEvent?.temperature,
      accepted.pushCalibration.temperatureRole,
      `${riverId} Push temperature role`,
    );

    // Pass 4 tightens two presentation caps to the national safety contract.
    assertEquals(bands.caps.staleGauge, 55);
    assertEquals(bands.caps.sharpRiseHigh, 40);
    assert(bands.caps.staleGauge <= accepted.fishingShape.caps.staleGauge);
    assert(
      bands.caps.sharpRiseHigh <= accepted.fishingShape.caps.sharpRiseHigh,
    );
  }
});

Deno.test("mainstem and North Umpqua condition sources stay isolated by reach", () => {
  for (
    const run of [
      UMPQUA_MAINSTEM_FALL_CHINOOK_RUN,
      UMPQUA_MAINSTEM_FALL_COHO_RUN,
    ]
  ) {
    assertEquals(run.activity?.confidenceCeiling, "Limited");
    assertEquals(run.activity?.inputReach?.hydraulicSourceIds, [
      "umpqua_mainstem_elkton_usgs",
    ]);
    assertEquals(run.activity?.inputReach?.waterTemperatureSourceIds, []);
    assertEquals(run.activity?.weights.waterTemperature, 0);
    assertEquals(run.push?.directEvent?.temperature, "disabled");
    assertEquals(run.waterTemperature, undefined);
  }
  assertEquals(
    NORTH_UMPQUA_FALL_COHO_RUN.activity?.confidenceCeiling,
    undefined,
  );
  assertEquals(
    NORTH_UMPQUA_FALL_COHO_RUN.activity?.inputReach?.waterTemperatureSourceIds,
    ["north_umpqua_winchester_temperature"],
  );
  assertEquals(
    NORTH_UMPQUA_FALL_COHO_RUN.waterTemperature?.sourcePriority,
    ["north_umpqua_winchester_temperature"],
  );
  assertEquals(NORTH_UMPQUA_RIVER_PROFILE.foundation?.contextualGaugeSiteIds, [
    "14317450",
  ]);
  assertEquals(
    NORTH_UMPQUA_RIVER_PROFILE.waterTemperatureSources.some((source) =>
      source.siteId === "14317450"
    ),
    false,
  );
});

Deno.test("every Umpqua phase resolves to audited reaches and Building leaves Beginning", () => {
  for (const run of runs) {
    const river = riverFor(run);
    const beginning = resolveSeasonalZone({
      river,
      run,
      stage: resolveRunStage(run, `2026-${run.runWindow.start}`),
      localDate: `2026-${run.runWindow.start}`,
    });
    const building = resolveSeasonalZone({
      river,
      run,
      stage: resolveRunStage(
        run,
        `2026-${run.runWindow.buildingEstablishedStart}`,
      ),
      localDate: `2026-${run.runWindow.buildingEstablishedStart}`,
    });
    const peak = resolveSeasonalZone({
      river,
      run,
      stage: resolveRunStage(run, `2026-${run.runWindow.peak}`),
      localDate: `2026-${run.runWindow.peak}`,
    });
    assertEquals(beginning.status, "active", run.runId);
    assertEquals(building.status, "active", run.runId);
    assertEquals(peak.status, "active", run.runId);
    assertEquals(
      building.foundationReachIds.some((reachId) =>
        beginning.foundationReachIds.includes(reachId)
      ),
      false,
      run.runId,
    );
    assertEquals(
      peak.foundationReachIds.toSorted(),
      run.seasonalZoneReachIds!.toSorted(),
      run.runId,
    );
  }
});

Deno.test("Spot Finder reconciles exactly three official access sites per river", () => {
  for (const river of rivers) {
    const finder = riverRunSpotFinderForRiver(river.riverId);
    assert(finder, river.riverId);
    assertEquals(finder.sections.length, 3, river.riverId);
    assertEquals(
      finder.sections.flatMap((section) => section.spots).length,
      3,
      river.riverId,
    );
    assertEquals(
      finder.sections.flatMap((section) => section.foundationReachIds)
        .toSorted(),
      river.foundation!.reaches.map((reach) => reach.reachId).toSorted(),
      river.riverId,
    );
    for (const spot of finder.sections.flatMap((section) => section.spots)) {
      assertMatch(spot.sourceUrl, /^https:\/\//, spot.id);
      assertEquals(spot.verifiedOn, "2026-09-28", spot.id);
      assert(spot.caution?.length, `${spot.id} needs caution copy`);
    }
    assertEquals(RIVER_RUN_SPOT_FINDERS[river.riverId], finder);
  }
});

Deno.test("Fishability boundaries and severe flow remain conservative", () => {
  for (const run of runs) {
    const bands = run.fishabilityBands!;
    assertEquals(resolveAdminOverrideBand(bands.ideal.min, bands), "ideal");
    assertEquals(resolveAdminOverrideBand(bands.ideal.max, bands), "ideal");
    assertEquals(
      resolveAdminOverrideBand(bands.ideal.max + 0.1, bands),
      "high_fishable",
    );
    assertEquals(
      resolveAdminOverrideBand(bands.blownOut.min, bands),
      "blown_out",
    );
    const severe = scoreFishability({
      rules: bands,
      gaugeFreshness: "fresh",
      flowBand: "blown_out",
      flowSignal: "sharp_rise",
      currentHydraulicValue: bands.blownOut.min,
    });
    assert((severe.score ?? 100) <= 20, run.runId);
  }
});

Deno.test("controlled hydraulic events activate direct Push while outages fail closed", () => {
  for (const run of runs) {
    const rules = run.push!;
    const low = Math.max(rules.hydraulic.lowValue * 1.1, 100);
    const high = low + Math.max(
      rules.hydraulic.sharpRise24h.absolute * 1.1,
      low * rules.hydraulic.sharpRise24h.percent / 100 * 1.1,
    );
    assert(high < rules.hydraulic.severeHighValue, run.runId);
    const temperatureEnabled = rules.directEvent?.temperature !== "disabled";
    const active = scorePush({
      movementEngineId: run.movementEngineId,
      rules,
      gaugeFreshness: "fresh",
      flowSignal: "stable",
      currentHydraulicValue: high,
      hydraulicAbsoluteChange24h: high - low,
      hydraulicPercentChange24h: (high - low) / low * 100,
      hydraulicChanges: [],
      hydraulicFourHourSeries: fourHourSeries(low, high),
      rainSignal: "missing_rain_data",
      temperatureSignal: temperatureEnabled ? "cooling" : "neutral_missing",
      temperatureSourceType: temperatureEnabled ? "same_gauge" : "unavailable",
      waterTempF: temperatureEnabled ? 50 : null,
      temperatureChanges: [],
      temperatureFourHourSeries: temperatureEnabled
        ? fourHourSeries(58, 50)
        : [],
      trackingState: "active",
      trackingStartDate: "2026-09-01",
      trackingEndDate: "2026-12-31",
    });
    assertEquals(active.label, "Strong", run.runId);

    const missing = scorePush({
      movementEngineId: run.movementEngineId,
      rules,
      gaugeFreshness: "missing",
      flowSignal: "unknown",
      currentHydraulicValue: null,
      hydraulicAbsoluteChange24h: null,
      hydraulicPercentChange24h: null,
      hydraulicChanges: [],
      hydraulicFourHourSeries: [],
      rainSignal: "missing_rain_data",
      temperatureSignal: "neutral_missing",
      temperatureSourceType: "unavailable",
      waterTempF: null,
      temperatureChanges: [],
      temperatureFourHourSeries: [],
      trackingState: "active",
      trackingStartDate: "2026-09-01",
      trackingEndDate: "2026-12-31",
    });
    assertEquals(missing.score, null, run.runId);
    assertEquals(missing.label, "Unavailable", run.runId);
  }
});

Deno.test("Activity honors Limited mainstem and full North contracts", () => {
  for (const run of runs) {
    const mainstem = run.riverId === "umpqua_mainstem";
    const result = scoreActivity({
      rules: run.activity!,
      requestDate: `2026-${run.runWindow.peak}`,
      targetDate: `2026-${run.runWindow.peak}`,
      runStage: "peak",
      staging: false,
      waterTempF: mainstem ? null : 52,
      temperatureTrend: mainstem ? "neutral_missing" : "cooling",
      gaugeFreshness: "fresh",
      weatherFreshness: "fresh",
      flowBand: "ideal",
      currentHydraulicValue: run.fishabilityBands!.ideal.min,
      fishabilityBands: run.fishabilityBands,
      flowSignal: "stable",
      hourlyWeather: Array.from({ length: 24 }, (_, hour) => ({
        time_local: `2026-${run.runWindow.peak}T${
          String(hour).padStart(2, "0")
        }:00`,
        cloud_cover_pct: 80,
        shortwave_w_m2: hour >= 8 && hour < 18 ? 100 : 0,
        clear_sky_shortwave_w_m2: hour >= 8 && hour < 18 ? 450 : 0,
        precipitation_in: 0,
      })),
    });
    assert(result.score !== null, run.runId);
    assertEquals(result.confidence, mainstem ? "Limited" : "Full", run.runId);
  }
});

Deno.test("Winchester Fish Counts are North-Coho-only and cannot score primitives", () => {
  assertEquals(UMPQUA_MAINSTEM_RIVER_PROFILE.fishCountSources, undefined);
  const sources = NORTH_UMPQUA_RIVER_PROFILE.fishCountSources ?? [];
  assertEquals(sources.length, 1);
  assertEquals(sources[0].provider, "ODFW_WINCHESTER");
  assertEquals(sources[0].eligibleSpecies, ["coho_salmon"]);
  assertEquals(sources[0].maximumAgeHours, 240);
  assertMatch(sources[0].recapturePolicy, /Jacks.*already included/i);
  assertEquals(
    JSON.stringify(NORTH_UMPQUA_FALL_COHO_RUN).includes(
      "north_umpqua_winchester_coho",
    ),
    false,
  );
});
