import {
  fetchUsgsDailyFlowBaselineObservations,
  getPrimaryHydraulicSource,
  MILWAUKEE_FALL_CHINOOK_RUN_PROFILE,
  MILWAUKEE_RIVER_PROFILE,
  resolveAdminOverrideBand,
  resolveFlowTrendSignal,
  scoreFishability,
  SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE,
  SHEBOYGAN_RIVER_PROFILE,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

const definitions = [
  {
    river: MILWAUKEE_RIVER_PROFILE,
    run: MILWAUKEE_FALL_CHINOOK_RUN_PROFILE,
    startMonthDay: "08-01",
    endMonthDay: "01-15",
    startYear: 2019,
    endYear: 2025,
  },
  {
    river: SHEBOYGAN_RIVER_PROFILE,
    run: SHEBOYGAN_FALL_CHINOOK_RUN_PROFILE,
    startMonthDay: "08-01",
    endMonthDay: "01-31",
    startYear: 2019,
    endYear: 2025,
  },
] as const;

const output = [];
for (const definition of definitions) {
  const gauge = getPrimaryHydraulicSource(definition.river);
  const bands = definition.run.fishabilityBands;
  if (!bands) throw new Error(`${definition.run.runId} has no Fishability bands`);
  const observations = await fetchUsgsDailyFlowBaselineObservations({
    fetchFn: fetch,
    riverId: definition.river.riverId,
    siteId: gauge.siteId,
    startDate: `${definition.startYear}-${definition.startMonthDay}`,
    endDate: `${definition.endYear + 1}-${definition.endMonthDay}`,
  });
  const byDate = new Map(observations.map((item) => [item.localDate, item.value]));
  const counts = new Map<string, number>();
  let usableDays = 0;
  let missingDays = 0;
  let violations = 0;
  const thresholds = definition.run.activity?.hydraulicTrend;

  for (let season = definition.startYear; season <= definition.endYear; season++) {
    const start = `${season}-${definition.startMonthDay}`;
    const end = `${season + 1}-${definition.endMonthDay}`;
    for (let date = start; date <= end; date = addDays(date, 1)) {
      const current = byDate.get(date);
      const prior = byDate.get(addDays(date, -1));
      if (current == null || prior == null) {
        missingDays++;
        continue;
      }
      const trend = resolveFlowTrendSignal({
        currentValue: current,
        value24hAgo: prior,
        rising24hAbsolute: thresholds?.rising24h.absolute,
        rising24hPercent: thresholds?.rising24h.percent,
        meaningfulRise24hAbsolute: thresholds?.meaningfulRise24h.absolute,
        meaningfulRise24hPercent: thresholds?.meaningfulRise24h.percent,
        sharpRise24hAbsolute: thresholds?.sharpRise24h.absolute,
        sharpRise24hPercent: thresholds?.sharpRise24h.percent,
      });
      const band = resolveAdminOverrideBand(current, bands);
      const result = scoreFishability({
        rules: bands,
        gaugeFreshness: "fresh",
        flowBand: band,
        flowSignal: trend.rawSignal,
        currentHydraulicValue: current,
        hydraulicAbsoluteChange24h: trend.absoluteChange24h,
        hydraulicPercentChange24h: trend.percentChange24h,
        flowReasonCodes: trend.reasonCodes,
      });
      usableDays++;
      counts.set(result.label, (counts.get(result.label) ?? 0) + 1);
      if (!result.headline.trim() || !result.detail.trim() || !result.tip.trim()) {
        violations++;
      }
      if (band === "very_low" && (result.score ?? 100) > bands.caps.veryLow) {
        violations++;
      }
      if (band === "blown_out" && (result.score ?? 100) > bands.caps.blownOut) {
        violations++;
      }
      if (
        trend.rawSignal === "sharp_rise" &&
        ["high_fishable", "very_high", "blown_out"].includes(band) &&
        (result.score ?? 100) > bands.caps.sharpRiseHigh
      ) violations++;
    }
  }

  const expectedDays = seasonDayCount(
    definition.startMonthDay,
    definition.endMonthDay,
  ) * (definition.endYear - definition.startYear + 1);
  output.push({
    riverId: definition.river.riverId,
    gaugeSiteId: gauge.siteId,
    rulesVersion: bands.version,
    replaySeasons: `${definition.startYear}-${definition.endYear}`,
    replayWindow: `${definition.startMonthDay} through ${definition.endMonthDay}`,
    expectedDays,
    usableDays,
    missingDays,
    coveragePercent: Math.round(usableDays / expectedDays * 10_000) / 100,
    labels: Object.fromEntries(
      [...counts.entries()].sort().map(([label, count]) => [label, {
        count,
        percent: Math.round(count / usableDays * 10_000) / 100,
      }]),
    ),
    violations,
  });
}

console.log(JSON.stringify(output, null, 2));
if (output.some((item) => item.coveragePercent < 90 || item.violations > 0)) {
  Deno.exit(1);
}

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function seasonDayCount(startMonthDay: string, endMonthDay: string): number {
  const start = `2023-${startMonthDay}`;
  const end = `2024-${endMonthDay}`;
  return Math.round(
    (Date.parse(`${end}T12:00:00Z`) - Date.parse(`${start}T12:00:00Z`)) /
      86_400_000,
  ) + 1;
}
