import {
  buildConditionRefresh,
  fetchMonitorMyWatershedTemperature,
  fetchUsgsDailyFlowBaselineObservations,
  generateConditionsSuggestBaselineRows,
  getPrimaryHydraulicSource,
  type NormalizedTemperatureBaselineObservation,
  parseMonitorMyWatershedTemperature,
  PERE_MARQUETTE_CONFIGURATION_DOCUMENT,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveAdminOverrideBand,
  resolveConditionsSuggestCheckpoints,
  resolveFlowTrendSignal,
  resolveRainSignal,
  resolveRunStage,
  resolveTemperatureTrendSignal,
  RIVER_RUN_RUN_PROFILES,
  type RiverRunDailySnapshot,
  type RiverRunReasonCode,
  scoreConditionsSuggest,
  scoreFishInRiver,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

type AuditRow = {
  localDate: string;
  runStage: string;
  broadBuildingContext: boolean;
  conditionsSuggest: string;
  push: string;
  pushScore: number | null | undefined;
  fishability: string;
  fishabilityScore: number | null | undefined;
  fishInRiver: number | null;
  dataQuality: string;
  interpretationCodes: RiverRunReasonCode[];
  copy: string;
};

const river = PERE_MARQUETTE_RIVER_PROFILE;
const runId = argumentValue("--run-id") ?? "pere_marquette_fall_chinook";
const run = RIVER_RUN_RUN_PROFILES.find((candidate) =>
  candidate.runId === runId && candidate.riverId === river.riverId
);
if (!run) throw new Error(`Unknown Pere Marquette run ID: ${runId}`);
const gauge = getPrimaryHydraulicSource(river);
const pushTemperatureSource = river.waterTemperatureSources.find((source) =>
  source.sourceId === run.waterTemperature.sourcePriority[0]
);
const conditionsTemperatureSource = river.waterTemperatureSources.find((
  source,
) => source.sourceId === run.conditionsSuggest.temperatureSourceId);
const weatherPoint = river.weatherPoints.find((point) =>
  point.role === "primary"
);
if (
  !pushTemperatureSource || !conditionsTemperatureSource || !weatherPoint
) {
  throw new Error("PM integrated audit sources are incomplete.");
}

const startYear = 2021;
const endYear = 2025;
const replayStartDate = `${startYear}-${run.runWindow.stagingStart}`;
const replayEndDate = `${endYear}-${run.runWindow.lateEnd}`;
const flowObservations = await fetchUsgsDailyFlowBaselineObservations({
  fetchFn: fetch,
  riverId: river.riverId,
  siteId: gauge.siteId,
  startDate: addDays(replayStartDate, -3),
  endDate: replayEndDate,
});
const flowByDate = new Map(
  flowObservations.map((observation) => [
    observation.localDate,
    observation.value,
  ]),
);
const pushTemperature = await fetchTemperatureHistory(pushTemperatureSource);
const conditionsTemperature = await fetchTemperatureHistory(
  conditionsTemperatureSource,
);
const rainByDate = await fetchDailyRain({
  lat: weatherPoint.lat,
  lon: weatherPoint.lon,
  timezone: river.timezone,
  startDate: addDays(replayStartDate, -3),
  endDate: replayEndDate,
});

const checkpointDefinitions = resolveConditionsSuggestCheckpoints(
  run,
  `2026-${run.runWindow.peak}`,
).map((checkpoint) => ({
  checkpointId: checkpoint.checkpointId,
  observationStartMonthDay: checkpoint.observationStartDate.slice(5),
  checkpointMonthDay: checkpoint.checkpointDate.slice(5),
}));
const conditionsBaselines = generateConditionsSuggestBaselineRows({
  gaugeObservations: flowObservations,
  temperatureObservations: conditionsTemperature.observations,
  riverId: river.riverId,
  runId: run.runId,
  gaugeMetric: gauge.primaryMetric,
  gaugeSiteId: gauge.siteId,
  temperatureSourceId: conditionsTemperatureSource.sourceId,
  baselineVersion: run.conditionsSuggest.baselineVersion,
  checkpoints: checkpointDefinitions,
  minimumCoveragePercent: run.conditionsSuggest.minimumCoveragePercent,
  minimumUsableYears: run.conditionsSuggest.minimumUsableYears,
  coolEnoughPercentileCap: run.conditionsSuggest.coolEnoughPercentileCap,
  tooWarmF: run.push.temperature.tooWarmF,
  gaugeWeight: run.conditionsSuggest.gaugeWeight,
  waterTemperatureWeight: run.conditionsSuggest.waterTemperatureWeight,
  sourceNotes: "Integrated PM all-primitive audit baseline.",
});

const conditionsEvidenceByDate = Object.fromEntries(
  [...flowByDate].flatMap(([localDate, gaugeValue]) => {
    const waterTempF = conditionsTemperature.byDate.get(localDate);
    return waterTempF == null ? [] : [[
      localDate,
      {
        "16:00": {
          gaugeFreshness: "fresh" as const,
          gaugeValue,
          gaugeMetric: gauge.primaryMetric,
          gaugeSiteId: gauge.siteId,
          waterTemperatureFreshness: "fresh" as const,
          waterTempF,
          waterTemperatureSourceId: conditionsTemperatureSource.sourceId,
          reasonCodes: [
            "gauge_fresh",
            "temperature_measured",
          ] as RiverRunReasonCode[],
        },
      },
    ]];
  }),
);

const rows: AuditRow[] = [];
for (let year = startYear; year <= endYear; year++) {
  for (
    let localDate = `${year}-${run.runWindow.stagingStart}`;
    localDate <= `${year}-${run.runWindow.lateEnd}`;
    localDate = addDays(localDate, 1)
  ) {
    const currentFlow = flowByDate.get(localDate) ?? null;
    const priorFlow = flowByDate.get(addDays(localDate, -1)) ?? null;
    const flowTrend = resolveFlowTrendSignal({
      currentValue: currentFlow,
      value24hAgo: priorFlow,
      rising24hAbsolute: run.push.hydraulic.rising24h.absolute,
      rising24hPercent: run.push.hydraulic.rising24h.percent,
      meaningfulRise24hAbsolute: run.push.hydraulic.meaningfulRise24h.absolute,
      meaningfulRise24hPercent: run.push.hydraulic.meaningfulRise24h.percent,
      sharpRise24hAbsolute: run.push.hydraulic.sharpRise24h.absolute,
      sharpRise24hPercent: run.push.hydraulic.sharpRise24h.percent,
    });
    const flowBand = currentFlow == null
      ? undefined
      : resolveAdminOverrideBand(currentFlow, run.fishabilityBands);

    const waterTempF = pushTemperature.byDate.get(localDate) ?? null;
    const priorTemp24h = pushTemperature.byDate.get(addDays(localDate, -1));
    const priorTemp72h = pushTemperature.byDate.get(addDays(localDate, -3));
    const temperatureAvailable = waterTempF != null &&
      priorTemp24h != null && priorTemp72h != null;
    const temperatureTrend = resolveTemperatureTrendSignal({
      sourceType: temperatureAvailable
        ? pushTemperatureSource.sourceType
        : "unavailable",
      delta24hF: temperatureAvailable ? waterTempF - priorTemp24h : null,
      delta72hF: temperatureAvailable ? waterTempF - priorTemp72h : null,
      hasEnoughValues: temperatureAvailable,
    });

    const rainToday = rainByDate.get(localDate);
    const rainPrior1 = rainByDate.get(addDays(localDate, -1));
    const rainPrior2 = rainByDate.get(addDays(localDate, -2));
    const rainAvailable = rainToday != null && rainPrior1 != null &&
      rainPrior2 != null;
    const rain = resolveRainSignal(
      rainAvailable
        ? {
          rain48hIn: rainToday + rainPrior1,
          rain72hIn: rainToday + rainPrior1 + rainPrior2,
        }
        : { rain48hIn: null, rain72hIn: null },
      run.push.rain,
    );

    const runStage = resolveRunStage(run, localDate);
    const conditionsSuggest = scoreConditionsSuggest({
      localDate,
      run,
      evidenceByDate: conditionsEvidenceByDate,
      baselines: conditionsBaselines,
    });
    const fishInRiver = scoreFishInRiver(run, localDate);
    const dailySnapshot: RiverRunDailySnapshot = {
      riverId: river.riverId,
      runId: run.runId,
      localDate,
      timezone: river.timezone,
      runStage,
      conditionsSuggest,
      fishInRiver,
      evidenceSummaries: [],
      sourceDates: conditionsSuggest.sourceDates,
      sourceRefreshSlots: conditionsSuggest.sourceRefreshSlots,
      reasonCodes: [
        ...new Set([
          ...runStage.reasonCodes,
          ...conditionsSuggest.reasonCodes,
          ...fishInRiver.reasonCodes,
        ]),
      ],
      engineVersion: "river-run-integrated-audit-v1",
      configVersion: PERE_MARQUETTE_CONFIGURATION_DOCUMENT.configVersion,
    };
    const gaugeFreshness = currentFlow == null ? "missing" as const : "fresh";
    const weatherFreshness = rainAvailable ? "fresh" as const : "missing";
    const waterTemperatureFreshness = temperatureAvailable
      ? "fresh" as const
      : "missing";
    const conditionsWaterTemperatureFreshness =
      conditionsTemperature.byDate.has(localDate)
        ? "fresh" as const
        : "missing";
    const refresh = buildConditionRefresh({
      dailySnapshot,
      localDate,
      refreshSlot: "16:00",
      movementEngineId: run.movementEngineId,
      pushRules: run.push,
      fishabilityBands: run.fishabilityBands,
      gaugeFreshness,
      weatherFreshness,
      waterTemperatureFreshness,
      conditionsWaterTemperatureFreshness,
      flowBand,
      currentHydraulicValue: currentFlow,
      hydraulicAbsoluteChange24h: flowTrend.absoluteChange24h,
      hydraulicPercentChange24h: flowTrend.percentChange24h,
      rainSignal: rain.rawSignal,
      flowSignal: flowTrend.rawSignal,
      temperatureSignal: temperatureTrend.rawSignal,
      temperatureSourceType: temperatureAvailable
        ? pushTemperatureSource.sourceType
        : "unavailable",
      waterTempF,
      missingNonGaugeInputCount: (rainAvailable ? 0 : 1) +
        (temperatureAvailable ? 0 : 1),
      rainReasonCodes: rain.reasonCodes,
      flowReasonCodes: flowTrend.reasonCodes,
      temperatureReasonCodes: temperatureTrend.reasonCodes,
      sourceMetrics: {
        gauge: {
          provider: gauge.provider,
          siteId: gauge.siteId,
          primaryMetric: gauge.primaryMetric,
          value: currentFlow,
          band: flowBand,
          trend: flowTrend.rawSignal,
          absoluteChange24h: flowTrend.absoluteChange24h,
          percentChange24h: flowTrend.percentChange24h,
        },
        weather: {
          provider: "OPEN_METEO",
          evidenceType: "modeled_grid",
          weatherPointId: weatherPoint.weatherPointId,
          rain48hIn: rainAvailable ? rainToday + rainPrior1 : null,
          rain72hIn: rainAvailable ? rainToday + rainPrior1 + rainPrior2 : null,
        },
        waterTemperature: {
          provider: pushTemperatureSource.provider,
          sourceId: pushTemperatureSource.sourceId,
          siteId: pushTemperatureSource.siteId,
          seriesId: pushTemperatureSource.seriesId,
          waterTempF,
          trend: temperatureTrend.rawSignal,
          sourceType: temperatureAvailable
            ? pushTemperatureSource.sourceType
            : "unavailable",
        },
      },
      engineVersion: "river-run-integrated-audit-v1",
      configVersion: PERE_MARQUETTE_CONFIGURATION_DOCUMENT.configVersion,
    });
    const copy = [
      copyOf(refresh.runStage),
      copyOf(refresh.conditionsSuggest),
      copyOf(refresh.push),
      copyOf(refresh.fishability),
      copyOf(refresh.fishInRiver),
      refresh.interpretationNote
        ? `${refresh.interpretationNote.headline} ${refresh.interpretationNote.detail}`
        : "",
    ].join(" ");
    rows.push({
      localDate,
      runStage: refresh.runStage.label,
      broadBuildingContext: refresh.runStage.broadBuildingContext === true,
      conditionsSuggest: refresh.conditionsSuggest.label,
      push: refresh.push.label,
      pushScore: refresh.push.score,
      fishability: refresh.fishability.label,
      fishabilityScore: refresh.fishability.score,
      fishInRiver: refresh.fishInRiver.score ?? null,
      dataQuality: refresh.dataQuality.label,
      interpretationCodes: refresh.interpretationNote?.reasonCodes ?? [],
      copy,
    });
  }
}

const invariants = {
  incompleteCopy: rows.filter((row) => !row.copy.trim()).length,
  prohibitedCopy: rows.filter((row) => prohibitedCopy(row.copy)).length,
  unexplainedConflicts:
    rows.filter((row) =>
      !allExpectedCodes(row).every((code) =>
        row.interpretationCodes.includes(code)
      )
    ).length,
  preRunActivePush:
    rows.filter((row) =>
      row.runStage === "Before migration" && row.pushScore != null
    )
      .length,
  postRunActivePush:
    rows.filter((row) =>
      row.runStage === "After migration" && row.pushScore != null
    )
      .length,
  postRunUnderwayCopy:
    rows.filter((row) =>
      row.runStage === "After migration" && /well underway/i.test(row.copy)
    ).length,
  postRunResidualWithoutExplanation:
    rows.filter((row) =>
      row.runStage === "After migration" &&
      typeof row.fishInRiver === "number" && row.fishInRiver > 0 &&
      !row.interpretationCodes.includes("post_run_residual_presence")
    ).length,
};
const failedInvariants = Object.entries(invariants).filter(([, count]) =>
  count > 0
);
const expectedRows = activeDayCount(
  run.runWindow.stagingStart,
  run.runWindow.lateEnd,
) * (endYear - startYear + 1);
const report = {
  riverId: river.riverId,
  runId: run.runId,
  auditVersion: `pm-${run.species}-all-primitives-v1`,
  configVersion: PERE_MARQUETTE_CONFIGURATION_DOCUMENT.configVersion,
  replayYears: `${startYear}-${endYear}`,
  replayWindow:
    `${run.runWindow.stagingStart} through ${run.runWindow.lateEnd}`,
  method:
    "Daily-resolution integrated mechanical replay. Conditions Suggest uses cumulative Scottville plus M-37 history; Push uses Scottville, Maple measured water, and Baldwin-point modeled precipitation; Fishability uses Scottville only; Run Stage and Fish In River use configured calendar history. Historical baselines include the replay years, so this audits deterministic interactions and copy rather than out-of-sample fish-return accuracy.",
  rowCount: rows.length,
  expectedRows,
  conditionsBaselineRows: conditionsBaselines.length,
  labelCounts: {
    runStage: counts(rows.map((row) => row.runStage)),
    conditionsSuggest: counts(rows.map((row) => row.conditionsSuggest)),
    push: counts(rows.map((row) => row.push)),
    fishability: counts(rows.map((row) => row.fishability)),
    fishInRiver: counts(rows.map((row) => String(row.fishInRiver))),
    dataQuality: counts(rows.map((row) => row.dataQuality)),
  },
  interpretationCounts: counts(
    rows.flatMap((row) => row.interpretationCodes),
  ),
  invariants,
  representativeDisagreements: representativeDisagreements(rows),
};
console.log(JSON.stringify(report, null, 2));
if (
  rows.length !== expectedRows || conditionsBaselines.length !== 5 ||
  failedInvariants.length > 0
) {
  Deno.exit(1);
}

async function fetchTemperatureHistory(
  source: typeof pushTemperatureSource,
): Promise<{
  byDate: Map<string, number>;
  observations: NormalizedTemperatureBaselineObservation[];
}> {
  if (!source) return { byDate: new Map(), observations: [] };
  const valuesByDate = new Map<string, number[]>();
  for (let year = startYear; year <= endYear; year++) {
    const csv = await fetchMonitorMyWatershedTemperature({
      fetchFn: fetch,
      source,
      endAtUtc: `${year}-12-31T23:59:59.000Z`,
      lookbackDays: 365,
    });
    if (!csv) continue;
    const parsed = parseMonitorMyWatershedTemperature({ csv, source });
    for (
      const observation of parsed.observations.filter((item) =>
        item.observedAt.startsWith(`${year}-`)
      )
    ) {
      const localDate = localDateInTimezone(
        observation.observedAt,
        river.timezone,
      );
      valuesByDate.set(localDate, [
        ...(valuesByDate.get(localDate) ?? []),
        observation.waterTempF,
      ]);
    }
  }
  const byDate = new Map(
    [...valuesByDate].map(([localDate, values]) => [
      localDate,
      median(values),
    ]),
  );
  return {
    byDate,
    observations: [...byDate].map(([localDate, waterTempF]) => ({
      sourceId: source.sourceId,
      localDate,
      waterTempF,
    })),
  };
}

async function fetchDailyRain(input: {
  lat: number;
  lon: number;
  timezone: string;
  startDate: string;
  endDate: string;
}): Promise<Map<string, number>> {
  const params = new URLSearchParams({
    latitude: String(input.lat),
    longitude: String(input.lon),
    start_date: input.startDate,
    end_date: input.endDate,
    daily: "precipitation_sum",
    precipitation_unit: "inch",
    timezone: input.timezone,
  });
  const response = await fetch(
    `https://archive-api.open-meteo.com/v1/archive?${params.toString()}`,
  );
  if (!response.ok) return new Map();
  const payload = await response.json() as {
    daily?: {
      time?: string[];
      precipitation_sum?: Array<number | null>;
    };
  };
  const dates = payload.daily?.time ?? [];
  const values = payload.daily?.precipitation_sum ?? [];
  return new Map(
    dates.flatMap((date, index) =>
      typeof values[index] === "number" && Number.isFinite(values[index])
        ? [[date, values[index] as number] as const]
        : []
    ),
  );
}

function allExpectedCodes(row: AuditRow): RiverRunReasonCode[] {
  const codes: RiverRunReasonCode[] = [];
  if (
    typeof row.pushScore === "number" && row.pushScore >= 70 &&
    typeof row.fishabilityScore === "number" && row.fishabilityScore <= 49
  ) {
    codes.push("strong_push_low_fishability");
  }
  if (row.conditionsSuggest === "Ahead" && row.runStage === "Beginning") {
    codes.push("beginning_ahead_conditions");
  }
  if (
    row.runStage === "Peak" &&
    typeof row.pushScore === "number" && row.pushScore <= 49
  ) {
    codes.push("peak_presence_weak_push");
  }
  if (row.runStage === "Peak" && row.conditionsSuggest === "Delayed") {
    codes.push("peak_delayed_conditions");
  }
  if (
    row.runStage === "Building" && row.broadBuildingContext &&
    row.conditionsSuggest === "Delayed"
  ) {
    codes.push("broad_building_delayed_conditions");
  }
  if (
    typeof row.fishabilityScore === "number" &&
    row.fishabilityScore >= 70 &&
    typeof row.fishInRiver === "number" && row.fishInRiver <= 3
  ) {
    codes.push("good_fishability_low_presence");
  }
  if (
    row.conditionsSuggest === "Delayed" &&
    typeof row.pushScore === "number" && row.pushScore >= 70
  ) {
    codes.push("delayed_conditions_strong_push");
  }
  if (
    row.runStage === "After migration" &&
    typeof row.fishInRiver === "number" && row.fishInRiver > 0
  ) {
    codes.push("post_run_residual_presence");
  }
  return codes;
}

function prohibitedCopy(copy: string): boolean {
  return /\bguarantee(?:d)?\b|\bloaded\b|\bstacked\b|hot bite|(?:shows|confirms|proves) (?:that )?fish (?:moved|entered)|fish are entering|(?:safe|unsafe) to (?:wade|boat|float)|\b(?:clear|stained|turbid) water\b/i
    .test(copy);
}

function representativeDisagreements(rows: AuditRow[]): AuditRow[] {
  const selected: AuditRow[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const code of row.interpretationCodes) {
      if (seen.has(code)) continue;
      seen.add(code);
      selected.push({ ...row, copy: row.copy.slice(0, 800) });
    }
  }
  return selected;
}

function copyOf(input: {
  label: string;
  headline: string;
  detail: string;
  tip: string;
}): string {
  return `${input.label} ${input.headline} ${input.detail} ${input.tip}`;
}

function counts(values: string[]): Record<string, number> {
  return Object.fromEntries(
    [...new Set(values)].toSorted().map((value) => [
      value,
      values.filter((candidate) => candidate === value).length,
    ]),
  );
}

function localDateInTimezone(iso: string, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(iso));
  const value = Object.fromEntries(
    parts.map((part) => [part.type, part.value]),
  );
  return `${value.year}-${value.month}-${value.day}`;
}

function median(values: number[]): number {
  const sorted = values.toSorted((a, b) => a - b);
  const midpoint = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[midpoint - 1] + sorted[midpoint]) / 2
    : sorted[midpoint];
}

function addDays(localDate: string, days: number): string {
  const date = new Date(`${localDate}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function activeDayCount(startMonthDay: string, endMonthDay: string): number {
  const start = `2024-${startMonthDay}`;
  const directEnd = `2024-${endMonthDay}`;
  const end = directEnd >= start ? directEnd : `2025-${endMonthDay}`;
  return Math.round(
    (new Date(`${end}T12:00:00.000Z`).getTime() -
      new Date(`${start}T12:00:00.000Z`).getTime()) /
      86_400_000,
  ) + 1;
}

function argumentValue(flag: string): string | null {
  const inline = Deno.args.find((arg) => arg.startsWith(`${flag}=`));
  if (inline) return inline.slice(flag.length + 1) || null;
  const index = Deno.args.indexOf(flag);
  return index >= 0 ? Deno.args[index + 1] ?? null : null;
}
