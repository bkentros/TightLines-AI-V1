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
} from "../supabase/functions/_shared/riverRunEngine/index.ts";

const useMuskegon = Deno.args.includes("--muskegon");
const selectedRiver = useMuskegon ? MUSKEGON_RIVER_PROFILE : river;
const selectedRun = useMuskegon ? MUSKEGON_FALL_CHINOOK_RUN_PROFILE : run;
const gauge = getPrimaryHydraulicSource(selectedRiver);
const observations = await fetchUsgsDailyFlowBaselineObservations({
  fetchFn: fetch,
  riverId: selectedRiver.riverId,
  siteId: gauge.siteId,
  startDate: `${useMuskegon ? 2007 : 1996}-08-14`,
  endDate: "2025-12-22",
});
const byDate = new Map(
  observations.map((item) => [item.localDate, item.value]),
);
const counts = new Map<string, number>();
const yearlyUsable = new Map<string, number>();
const yearlyMissing = new Map<string, number>();
let usableDays = 0;
let violations = 0;
let missingFlowDays = 0;
const firstYear = useMuskegon ? 2007 : 1996;
const expectedDays = activeDayCount("08-15", "12-22") * (2025 - firstYear + 1);
for (let year = firstYear; year <= 2025; year++) {
  for (
    let date = `${year}-08-15`;
    date <= `${year}-12-22`;
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
      rising24hAbsolute: selectedRun.push.hydraulic.rising24h.absolute,
      rising24hPercent: selectedRun.push.hydraulic.rising24h.percent,
      meaningfulRise24hAbsolute:
        selectedRun.push.hydraulic.meaningfulRise24h.absolute,
      meaningfulRise24hPercent:
        selectedRun.push.hydraulic.meaningfulRise24h.percent,
      sharpRise24hAbsolute: selectedRun.push.hydraulic.sharpRise24h.absolute,
      sharpRise24hPercent: selectedRun.push.hydraulic.sharpRise24h.percent,
    });
    const band = resolveAdminOverrideBand(flow, selectedRun.fishabilityBands);
    const result = scoreFishability({
      rules: selectedRun.fishabilityBands,
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
      (result.score ?? 100) > selectedRun.fishabilityBands.caps.veryLow
    ) violations++;
    if (
      band === "blown_out" &&
      (result.score ?? 100) > selectedRun.fishabilityBands.caps.blownOut
    ) violations++;
    if (
      trend.rawSignal === "sharp_rise" &&
      ["high_fishable", "very_high", "blown_out"].includes(band) &&
      (result.score ?? 100) > selectedRun.fishabilityBands.caps.sharpRiseHigh
    ) violations++;
  }
}
console.log(JSON.stringify(
  {
    riverId: selectedRiver.riverId,
    runId: useMuskegon
      ? "muskegon_shared_fall_fishability"
      : "big_manistee_shared_fall_fishability",
    gaugeSiteId: gauge.siteId,
    replayYears: `${firstYear}-2025`,
    replayWindow:
      `08-15 through 12-22 (union of implemented ${selectedRiver.displayName} fall runs)`,
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
