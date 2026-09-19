import { assert, assertEquals, assertMatch } from "jsr:@std/assert";
import {
  BEAR_CREEK_MANISTEE_CONFIGURATION_DOCUMENT,
  BEAR_CREEK_MANISTEE_RIVER_PROFILE,
  BEAR_CREEK_MANISTEE_RUNS,
  buildRiverLiveConditions,
  RIVER_RUN_CONFIGURATION_DOCUMENTS,
  RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS,
  RIVER_RUN_DRAFT_RIVER_PROFILES,
  RIVER_RUN_DRAFT_RUN_PROFILES,
  RIVER_RUN_RIVER_PROFILES,
  RIVER_RUN_RUN_PROFILES,
  ROGUE_MI_CONFIGURATION_DOCUMENT,
  ROGUE_MI_RIVER_PROFILE,
  ROGUE_MI_RUNS,
  validateConfigurationRevision,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";
import { riverRunSpotFinderForRiver } from "../../../../../lib/riverRunSpotFinder.ts";

Deno.test("Bear Creek and Rogue Pass 2 profiles validate in the public catalog", () => {
  assertEquals(RIVER_RUN_DRAFT_RIVER_PROFILES, []);
  assertEquals(RIVER_RUN_DRAFT_RUN_PROFILES, []);
  assertEquals(RIVER_RUN_DRAFT_CONFIGURATION_DOCUMENTS, []);

  for (
    const river of [
      BEAR_CREEK_MANISTEE_RIVER_PROFILE,
      ROGUE_MI_RIVER_PROFILE,
    ]
  ) {
    const result = validateRiverProfile(river);
    assertEquals(
      result.valid,
      true,
      result.issues.map((item) => `${item.field}: ${item.message}`).join("\n"),
    );
    assert(
      RIVER_RUN_RIVER_PROFILES.some((item) => item.riverId === river.riverId),
      `${river.riverId} is missing from the public river registry`,
    );
    assertEquals(river.supportStatus, "beta");
  }

  for (const run of [...BEAR_CREEK_MANISTEE_RUNS, ...ROGUE_MI_RUNS]) {
    const river = RIVER_RUN_RIVER_PROFILES.find((item) =>
      item.riverId === run.riverId
    )!;
    const result = validateRunProfile(run, river);
    assertEquals(
      result.valid,
      true,
      result.issues.map((item) => `${item.field}: ${item.message}`).join("\n"),
    );
    assertEquals(result.publicVisible, true);
    assertEquals(run.publicAudit.isEnabled, true);
    assertEquals(run.primitiveCapabilities.migrationStage.status, "available");
    assertEquals(run.primitiveCapabilities.fishInRiver.status, "available");
    assertEquals(run.primitiveCapabilities.activity.status, "available");
    assert(run.activity);
    assert(run.seasonalZonePlan?.earlyApproach?.label);
    assert(
      RIVER_RUN_RUN_PROFILES.some((item) => item.runId === run.runId),
      `${run.runId} is missing from the public run registry`,
    );
  }
});

Deno.test("Bear Creek has no fabricated live gauge or temperature source", () => {
  const river = BEAR_CREEK_MANISTEE_RIVER_PROFILE;
  assertEquals(river.hydraulicSources, []);
  assertEquals(river.waterTemperatureSources, []);
  assertEquals(
    river.conditionDataCapabilities.hydraulics.status,
    "unavailable",
  );
  assertEquals(
    river.conditionDataCapabilities.waterTemperature.status,
    "unavailable",
  );
  assertEquals(river.foundation?.primaryGaugeReachId, null);
  assertEquals(river.foundation?.contextualGaugeSiteIds, ["04125700"]);
  assertMatch(river.gaugeLimitationCopy, /1958–1968/);
  assertMatch(river.gaugeLimitationCopy, /not current conditions/i);
  assertEquals(river.historicalHydraulicSource?.siteId, "04125700");
  assertEquals(river.historicalHydraulicSource?.normal.sampleCount, 36);
  assertEquals(river.historicalHydraulicSource?.normal.historicalYears, 10);
});

Deno.test("Bear Creek exposes sparse discharge as archive context only", async () => {
  const conditions = await buildRiverLiveConditions({
    client: {} as never,
    river: BEAR_CREEK_MANISTEE_RIVER_PROFILE,
    localDate: "2026-10-15",
    refreshSlot: "12:00",
    refreshAtUtc: "2026-10-15T16:00:00Z",
    fetchFn: () => {
      throw new Error("archive-only conditions must not fetch a live source");
    },
  });
  assertEquals(conditions.status, "unavailable");
  assertEquals(conditions.metrics.length, 1);
  assertEquals(conditions.metrics[0].metric, "flow_cfs");
  assertEquals(conditions.metrics[0].value, null);
  assertEquals(conditions.metrics[0].seasonalContext?.average, 156.37);
  assertEquals(
    conditions.metrics[0].seasonalContext?.source,
    "usgs_approved_field_measurement_archive",
  );
});

Deno.test("Rogue live source is restricted to the lower Packer Drive reach", () => {
  const river = ROGUE_MI_RIVER_PROFILE;
  assertEquals(river.hydraulicSources.length, 1);
  assertEquals(river.hydraulicSources[0].siteId, "04118500");
  assertEquals(river.hydraulicSources[0].availableMetrics, [
    "flow_cfs",
    "gage_height_ft",
  ]);
  assertEquals(river.waterTemperatureSources, []);
  assertEquals(river.foundation?.primaryGaugeReachId, "rogue_lower");
  assertEquals(
    river.foundation?.reaches.filter((reach) => reach.gaugeRepresented).map(
      (reach) => reach.reachId,
    ),
    ["rogue_lower"],
  );
  assertMatch(river.gaugeLimitationCopy, /lower Rogue only/i);
  assertMatch(river.gaugeLimitationCopy, /does not measure water temperature/i);
  for (const run of ROGUE_MI_RUNS) {
    assertEquals(run.primitiveCapabilities.fishability.status, "available");
    assertEquals(run.primitiveCapabilities.push.status, "available");
    assertEquals(run.fishabilityBands?.ideal, { min: 133, max: 225 });
    assertEquals(run.activity?.weights.waterTemperature, 0);
    assertEquals(run.push?.directEvent?.temperature, "disabled");
    assertEquals(run.push?.directEvent?.maximumLevel, 2);
  }
});

Deno.test("Rogue live conditions resolve both accepted Packer Drive metrics", async () => {
  const conditions = await buildRiverLiveConditions({
    client: {} as never,
    river: ROGUE_MI_RIVER_PROFILE,
    localDate: "2026-10-15",
    refreshSlot: "12:00",
    refreshAtUtc: "2026-10-15T16:00:00Z",
    fetchFn: () => {
      throw new Error(
        "injected Rogue observations must avoid a provider fetch",
      );
    },
    gaugeObservations: [
      {
        provider: "USGS",
        siteId: "04118500",
        observedAt: "2026-10-14T15:45:00Z",
        flow_cfs: 150,
        gage_height_ft: 3.8,
        source: "usgs_continuous_values",
      },
      {
        provider: "USGS",
        siteId: "04118500",
        observedAt: "2026-10-15T15:45:00Z",
        flow_cfs: 190,
        gage_height_ft: 4.2,
        source: "usgs_continuous_values",
      },
    ],
    seasonalContextsByMetric: {
      flow_cfs: {
        average: 211.41,
        p10: 107,
        p25: 133,
        median: 176,
        p75: 225,
        p90: 359.5,
        historicalYears: 7,
        sampleCount: 1176,
        availableWindowDays: 7,
        windowRadiusDays: 3,
        windowStartMonthDay: "10-12",
        windowEndMonthDay: "10-18",
        recordKind: "long_term",
        baselineVersion: "rogue-2019-2025-test",
        source: "usgs_statistics",
      },
      gage_height_ft: null,
    },
  });

  assertEquals(conditions.status, "available");
  assertEquals(conditions.metrics.length, 2);
  const flow = conditions.metrics.find((metric) =>
    metric.metric === "flow_cfs"
  );
  const height = conditions.metrics.find((metric) =>
    metric.metric === "gage_height_ft"
  );
  assert(flow && height);
  assertEquals(flow.value, 190);
  assertEquals(flow.trend24h.delta, 40);
  assertEquals(flow.seasonalContext?.average, 211.41);
  assertEquals(height.value, 4.2);
  assertEquals(height.trend24h.delta, 0.4);
  assertEquals(height.seasonalContext, undefined);
});

Deno.test("Pass 1 calendars and presence strengths stay independently locked", () => {
  const expected = {
    bear_creek_manistee_fall_chinook: {
      maximum: 6,
      scope: "sectional",
      start: "09-01",
      peak: "09-25",
      end: "11-05",
    },
    bear_creek_manistee_fall_coho: {
      maximum: 4,
      scope: "sectional",
      start: "09-20",
      peak: "10-25",
      end: "12-05",
    },
    bear_creek_manistee_fall_steelhead: {
      maximum: 5,
      scope: "broad",
      start: "09-15",
      peak: "11-15",
      end: "12-31",
    },
    rogue_mi_fall_chinook: {
      maximum: 6,
      scope: "sectional",
      start: "09-01",
      peak: "10-10",
      end: "11-15",
    },
    rogue_mi_fall_coho: {
      maximum: 2,
      scope: "concentrated",
      start: "10-01",
      peak: "11-01",
      end: "11-30",
    },
    rogue_mi_fall_steelhead: {
      maximum: 7,
      scope: "broad",
      start: "09-01",
      peak: "11-15",
      end: "12-31",
    },
  } as const;

  for (const run of [...BEAR_CREEK_MANISTEE_RUNS, ...ROGUE_MI_RUNS]) {
    const locked = expected[run.runId as keyof typeof expected];
    assert(locked, `unexpected released run ${run.runId}`);
    assertEquals(run.historicalPresence.maximum, locked.maximum);
    assertEquals(run.historicalPresence.distributionScope, locked.scope);
    assertEquals(run.runWindow.start, locked.start);
    assertEquals(run.runWindow.peak, locked.peak);
    assertEquals(run.runWindow.end, locked.end);
  }
});

Deno.test("Pass 2 configuration documents validate as complete published packets", () => {
  for (
    const document of [
      BEAR_CREEK_MANISTEE_CONFIGURATION_DOCUMENT,
      ROGUE_MI_CONFIGURATION_DOCUMENT,
    ]
  ) {
    const issues = validateConfigurationRevision({
      configKey: document.river.riverId,
      revision: 1,
      status: "published",
      document,
      evidenceNotes:
        "Public Pass 2 configuration revision validated against the completed onboarding dossier and fixed replay artifacts.",
    });
    assertEquals(
      issues.length,
      0,
      issues.map((item) => `${item.field}: ${item.message}`).join("\n"),
    );
    assertEquals(document.runs.length, 3);
    assertEquals(document.biologyProfiles.length, 3);
    assert(
      RIVER_RUN_CONFIGURATION_DOCUMENTS.some((item) =>
        item.river.riverId === document.river.riverId
      ),
    );
  }
});

Deno.test("Pass 2 client presentation covers audited public access", () => {
  const bear = riverRunSpotFinderForRiver(
    "bear_creek_manistee",
    "steelhead",
    "MI",
  );
  const rogue = riverRunSpotFinderForRiver("rogue_mi", "chinook_salmon", "MI");
  assertEquals(bear?.sections.flatMap((section) => section.spots).length, 2);
  assertEquals(rogue?.sections.flatMap((section) => section.spots).length, 3);
  assert(
    [...(bear?.sections ?? []), ...(rogue?.sections ?? [])]
      .flatMap((section) => section.spots)
      .every((spot) => spot.verifiedOn === "2026-09-18"),
  );
});

Deno.test("Pass 2 Activity replay artifacts retain full coverage and stage means", async () => {
  const expected = {
    "river-run-bear-creek-manistee-chinook-weather-activity-replay.json": {
      usableDays: 1615,
      means: [70.39, 70.32, 74.83, 76.18, 72.74, 55.98, 43],
    },
    "river-run-bear-creek-manistee-coho-weather-activity-replay.json": {
      usableDays: 1843,
      means: [68.06, 70.47, 77.74, 79.65, 72.83, 57.68, 41.67],
    },
    "river-run-bear-creek-manistee-steelhead-weather-activity-replay.json": {
      usableDays: 2527,
      means: [54.02, 56.97, 63.6, 67.06, 68.51, 68.96, 68.67],
    },
    "river-run-rogue-mi-chinook-activity-replay.json": {
      usableDays: 630,
      means: [43.29, 43.58, 51.52, 56.55, 47.47, 39.14, 32.06],
    },
    "river-run-rogue-mi-coho-activity-replay.json": {
      usableDays: 609,
      means: [44.33, 39.66, 54.86, 56.79, 51.97, 39.53, 30.63],
    },
    "river-run-rogue-mi-steelhead-activity-replay.json": {
      usableDays: 1008,
      means: [41.94, 45.07, 52.74, 59.33, 54.76, 61.77, 54.04],
    },
  } as const;
  const stages = [
    "pre_run",
    "beginning",
    "building",
    "peak",
    "tapering",
    "ending",
    "post_run",
  ] as const;
  for (const [file, locked] of Object.entries(expected)) {
    const report = JSON.parse(
      await Deno.readTextFile(`docs/audits/${file}`),
    );
    assertEquals(report.usableDays, report.expectedDays, file);
    assertEquals(report.usableDays, locked.usableDays, file);
    assertEquals(
      stages.map((stage) => report.byStage[stage].scores.mean),
      [...locked.means],
      file,
    );
    assertEquals(
      Object.entries(report.invariants).filter(([, value]) => value !== 0),
      [],
      file,
    );
  }
});
