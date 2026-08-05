import {
  fetchUsgsDailyFlowBaselineObservations,
  getPrimaryHydraulicSource,
  PERE_MARQUETTE_RIVER_PROFILE,
  resolveAdminOverrideBand,
  resolveFlowTrendSignal,
  RIVER_RUN_RUN_PROFILES,
  scoreFishability,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

type ReplayRow = {
  localDate: string;
  flow: number;
  band: string;
  flowSignal: string;
  absoluteChange24h: number;
  percentChange24h: number;
  score: number;
  label: string;
  appliedCaps: number[];
  headline: string;
  detail: string;
  tip: string;
};

const river = PERE_MARQUETTE_RIVER_PROFILE;
const runId = argumentValue("--run-id") ?? "pere_marquette_fall_chinook";
const run = RIVER_RUN_RUN_PROFILES.find((candidate) =>
  candidate.runId === runId && candidate.riverId === river.riverId
);
if (!run) throw new Error(`Unknown Pere Marquette run ID: ${runId}`);
const gauge = getPrimaryHydraulicSource(river);
const startYear = 2016;
const endYear = 2025;
const replayStartDate = `${startYear}-${run.runWindow.start}`;
const flowObservations = await fetchUsgsDailyFlowBaselineObservations({
  fetchFn: fetch,
  riverId: river.riverId,
  siteId: gauge.siteId,
  startDate: addDays(replayStartDate, -1),
  endDate: `${endYear}-${run.runWindow.end}`,
});
const flowByDate = new Map(
  flowObservations.map((observation) => [
    observation.localDate,
    observation.value,
  ]),
);

const rows: ReplayRow[] = [];
for (let year = startYear; year <= endYear; year++) {
  const firstDate = `${year}-${run.runWindow.start}`;
  const lastDate = `${year}-${run.runWindow.end}`;
  for (
    let localDate = firstDate;
    localDate <= lastDate;
    localDate = addDays(localDate, 1)
  ) {
    const flow = flowByDate.get(localDate);
    const priorFlow = flowByDate.get(addDays(localDate, -1));
    if (flow == null || priorFlow == null) continue;

    const trend = resolveFlowTrendSignal({
      currentValue: flow,
      value24hAgo: priorFlow,
      rising24hAbsolute: run.push.hydraulic.rising24h.absolute,
      rising24hPercent: run.push.hydraulic.rising24h.percent,
      meaningfulRise24hAbsolute: run.push.hydraulic.meaningfulRise24h.absolute,
      meaningfulRise24hPercent: run.push.hydraulic.meaningfulRise24h.percent,
      sharpRise24hAbsolute: run.push.hydraulic.sharpRise24h.absolute,
      sharpRise24hPercent: run.push.hydraulic.sharpRise24h.percent,
    });
    if (
      trend.absoluteChange24h == null || trend.percentChange24h == null
    ) continue;

    const band = resolveAdminOverrideBand(flow, run.fishabilityBands);
    const result = scoreFishability({
      rules: run.fishabilityBands,
      gaugeFreshness: "fresh",
      flowBand: band,
      flowSignal: trend.rawSignal,
      currentHydraulicValue: flow,
      hydraulicAbsoluteChange24h: trend.absoluteChange24h,
      hydraulicPercentChange24h: trend.percentChange24h,
      flowReasonCodes: trend.reasonCodes,
    });
    if (result.score == null || !result.components) continue;
    rows.push({
      localDate,
      flow,
      band,
      flowSignal: trend.rawSignal,
      absoluteChange24h: round1(trend.absoluteChange24h),
      percentChange24h: round1(trend.percentChange24h),
      score: result.score,
      label: result.label,
      appliedCaps: result.components.appliedCaps,
      headline: result.headline,
      detail: result.detail,
      tip: result.tip,
    });
  }
}

const invariants = {
  veryLowAboveCap:
    rows.filter((row) => row.band === "very_low" && row.score > 45).length,
  blownOutAbovePoor:
    rows.filter((row) => row.band === "blown_out" && row.score > 24).length,
  sharpRiseHighAboveCap: rows.filter((row) =>
    row.flowSignal === "sharp_rise" &&
    ["high_fishable", "very_high", "blown_out"].includes(row.band) &&
    row.score > 40
  ).length,
  incompleteCopy:
    rows.filter((row) =>
      !row.headline.trim() || !row.detail.trim() || !row.tip.trim()
    ).length,
  unsupportedCopy:
    rows.filter((row) =>
      /\brain\b|\bweather\b|\bstain(?:ed)?\b|\bclarity\b|\bturbid(?:ity)?\b/i
        .test(`${row.headline} ${row.detail} ${row.tip}`)
    ).length,
};
const failedInvariants = Object.entries(invariants).filter(([, count]) =>
  count > 0
);
const expectedActiveDays =
  activeDayCount(run.runWindow.start, run.runWindow.end) *
  (endYear - startYear + 1);
const minimumUsableReplayDays = Math.floor(expectedActiveDays * 0.9);
const report = {
  riverId: river.riverId,
  runId: run.runId,
  gaugeSiteId: gauge.siteId,
  fishabilityRulesVersion: run.fishabilityBands.version,
  replayYears: `${startYear}-${endYear}`,
  replayWindow: `${run.runWindow.start} through ${run.runWindow.end}`,
  method:
    "Daily-resolution mechanical replay using approved USGS Scottville daily mean discharge and the same paired 24-hour flow-change thresholds as runtime. Runtime uses near-real-time observations; replay validates band behavior, caps, copy, and rule interactions rather than fishing success or safety.",
  usableReplayDays: rows.length,
  expectedActiveDays,
  minimumUsableReplayDays,
  labelCounts: counts(rows.map((row) => row.label)),
  bandCounts: counts(rows.map((row) => row.band)),
  flowSignalCounts: counts(rows.map((row) => row.flowSignal)),
  yearlyLabelCounts: Object.fromEntries(
    Array.from(
      { length: endYear - startYear + 1 },
      (_, index) => String(startYear + index),
    ).map((year) => [
      year,
      counts(
        rows.filter((row) => row.localDate.startsWith(`${year}-`)).map((row) =>
          row.label
        ),
      ),
    ]),
  ),
  invariants,
  lowestScoringDays: rows.toSorted((a, b) =>
    a.score - b.score || a.localDate.localeCompare(b.localDate)
  ).slice(0, 12),
  highestFlowDays: rows.toSorted((a, b) =>
    b.flow - a.flow || a.localDate.localeCompare(b.localDate)
  ).slice(0, 12),
};
console.log(JSON.stringify(report, null, 2));
if (rows.length < minimumUsableReplayDays || failedInvariants.length > 0) {
  Deno.exit(1);
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

function counts(values: string[]): Record<string, number> {
  return Object.fromEntries(
    [...new Set(values)].toSorted().map((value) => [
      value,
      values.filter((candidate) => candidate === value).length,
    ]),
  );
}

function round1(value: number): number {
  return Math.round(value * 10) / 10;
}
