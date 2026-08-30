import {
  BIG_MANISTEE_FALL_CHINOOK_RUN_PROFILE as run,
  BIG_MANISTEE_RIVER_PROFILE as river,
  fetchUsgsDailyFlowBaselineObservations,
  getPrimaryHydraulicSource,
  MUSKEGON_FALL_CHINOOK_RUN_PROFILE,
  MUSKEGON_RIVER_PROFILE,
  resolveAdminOverrideBand,
  resolveFlowTrendSignal,
  scoreFishability,
  WHITE_FALL_CHINOOK_RUN_PROFILE,
  WHITE_RIVER_PROFILE,
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

const useMuskegon = Deno.args.includes("--muskegon");
const useWhite = Deno.args.includes("--white");
const selectedRiver = useWhite
  ? WHITE_RIVER_PROFILE
  : useMuskegon
  ? MUSKEGON_RIVER_PROFILE
  : river;
const selectedRun = useWhite
  ? WHITE_FALL_CHINOOK_RUN_PROFILE
  : useMuskegon
  ? MUSKEGON_FALL_CHINOOK_RUN_PROFILE
  : run;
const gauge = getPrimaryHydraulicSource(selectedRiver);
const bands = selectedRun.fishabilityBands;
if (!bands) throw new Error(`${selectedRun.runId} has no Fishability bands.`);
const firstYear = useWhite ? 1957 : useMuskegon ? 2007 : 1996;
const replayStart = useWhite ? "08-01" : "08-15";
const replayEnd = useWhite ? "12-31" : "12-22";
const observationRanges = useWhite
  ? Array.from(
    { length: Math.ceil((2025 - firstYear + 1) / 5) },
    (_, index) => ({
      startYear: firstYear + index * 5,
      endYear: Math.min(firstYear + index * 5 + 4, 2025),
    }),
  )
  : [{ startYear: firstYear, endYear: 2025 }];
const observations = (
  await Promise.all(
    observationRanges.map((range) =>
      fetchUsgsDailyFlowBaselineObservations({
        fetchFn: fetch,
        riverId: selectedRiver.riverId,
        siteId: gauge.siteId,
        startDate: `${range.startYear}-${useWhite ? "07-31" : "08-14"}`,
        endDate: `${range.endYear}-${useWhite ? "12-31" : "12-22"}`,
      })
    ),
  )
).flat();
const byDate = new Map(
  observations.map((item) => [item.localDate, item.value]),
);
const counts = new Map<string, number>();
const yearlyUsable = new Map<string, number>();
const yearlyMissing = new Map<string, number>();
let usableDays = 0;
let violations = 0;
let missingFlowDays = 0;
const expectedDays = activeDayCount(replayStart, replayEnd) *
  (2025 - firstYear + 1);
const hydraulicThresholds = selectedRun.push?.hydraulic ??
  selectedRun.activity?.hydraulicTrend;
if (!hydraulicThresholds) {
  throw new Error(`${selectedRun.runId} has no audited hydraulic thresholds.`);
}
for (let year = firstYear; year <= 2025; year++) {
  for (
    let date = `${year}-${replayStart}`;
    date <= `${year}-${replayEnd}`;
    date = addDays(date, 1)
  ) {
    const flow = byDate.get(date);
    const prior = byDate.get(addDays(date, -1));
    if (flow == null || prior == null) {
      missingFlowDays++;
      yearlyMissing.set(
        String(year),
        (yearlyMissing.get(String(year)) ?? 0) + 1,
      );
      continue;
    }
    const trend = resolveFlowTrendSignal({
      currentValue: flow,
      value24hAgo: prior,
      rising24hAbsolute: hydraulicThresholds.rising24h.absolute,
      rising24hPercent: hydraulicThresholds.rising24h.percent,
      meaningfulRise24hAbsolute: hydraulicThresholds.meaningfulRise24h.absolute,
      meaningfulRise24hPercent: hydraulicThresholds.meaningfulRise24h.percent,
      sharpRise24hAbsolute: hydraulicThresholds.sharpRise24h.absolute,
      sharpRise24hPercent: hydraulicThresholds.sharpRise24h.percent,
    });
    const band = resolveAdminOverrideBand(flow, bands);
    const result = scoreFishability({
      rules: bands,
      gaugeFreshness: "fresh",
      flowBand: band,
      flowSignal: trend.rawSignal,
      currentHydraulicValue: flow,
      hydraulicAbsoluteChange24h: trend.absoluteChange24h,
      hydraulicPercentChange24h: trend.percentChange24h,
      flowReasonCodes: trend.reasonCodes,
    });
    usableDays++;
    yearlyUsable.set(String(year), (yearlyUsable.get(String(year)) ?? 0) + 1);
    counts.set(
      `${band}:${result.label}`,
      (counts.get(`${band}:${result.label}`) ?? 0) + 1,
    );
    if (
      !result.headline.trim() || !result.detail.trim() || !result.tip.trim()
    ) violations++;
    if (
      band === "very_low" &&
      (result.score ?? 100) > bands.caps.veryLow
    ) violations++;
    if (
      band === "blown_out" &&
      (result.score ?? 100) > bands.caps.blownOut
    ) violations++;
    if (
      trend.rawSignal === "sharp_rise" &&
      ["high_fishable", "very_high", "blown_out"].includes(band) &&
      (result.score ?? 100) > bands.caps.sharpRiseHigh
    ) violations++;
  }
}
console.log(JSON.stringify(
  {
    riverId: selectedRiver.riverId,
    runId: useWhite
      ? "white_shared_fall_fishability"
      : useMuskegon
      ? "muskegon_shared_fall_fishability"
      : "big_manistee_shared_fall_fishability",
    gaugeSiteId: gauge.siteId,
    replayYears: `${firstYear}-2025`,
    replayWindow:
      `${replayStart} through ${replayEnd} (union of implemented ${selectedRiver.displayName} fall runs)`,
    expectedDays,
    usableDays,
    coveragePercent: Math.round(usableDays / expectedDays * 10000) / 100,
    missingFlowDays,
    yearlyCoverage: Object.fromEntries(
      Array.from({ length: 2025 - firstYear + 1 }, (_, index) => {
        const year = String(firstYear + index);
        return [year, {
          usable: yearlyUsable.get(year) ?? 0,
          missing: yearlyMissing.get(year) ?? 0,
        }];
      }),
    ),
    states: Object.fromEntries([...counts].sort()),
    violations,
  },
  null,
  2,
));
if (usableDays < expectedDays * 0.9 || violations > 0) Deno.exit(1);

function addDays(date: string, days: number): string {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
function activeDayCount(startMonthDay: string, endMonthDay: string): number {
  const start = `2024-${startMonthDay}`;
  const end = `2024-${endMonthDay}`;
  return Math.round(
    (new Date(`${end}T12:00:00Z`).getTime() -
      new Date(`${start}T12:00:00Z`).getTime()) / 86_400_000,
  ) + 1;
}
