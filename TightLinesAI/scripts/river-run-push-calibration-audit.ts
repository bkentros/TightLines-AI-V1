import { fetchUsgsDailyFlowBaselineObservations } from "../supabase/functions/_shared/riverRunEngine/data/usgsDailyValues.ts";

type Options = {
  riverId: string;
  siteId: string;
  startYear: number;
  endYear: number;
  windowStart: string;
  windowEnd: string;
};

const options = parseOptions(Deno.args);
const observationsByYear = await Promise.all(
  Array.from(
    { length: options.endYear - options.startYear + 1 },
    async (_, index) => {
      const year = options.startYear + index;
      const observations = await fetchUsgsDailyFlowBaselineObservations({
        fetchFn: fetch,
        riverId: options.riverId,
        siteId: options.siteId,
        startDate: `${year}-${options.windowStart}`,
        endDate: `${year}-${options.windowEnd}`,
      });
      return { year, observations };
    },
  ),
);

const observations = observationsByYear.flatMap((item) => item.observations);
if (observations.length === 0) {
  throw new Error("USGS returned no approved daily discharge observations.");
}

const rises = observationsByYear.flatMap(({ observations }) =>
  observations.slice(1).flatMap((current, index) => {
    const prior = observations[index];
    const currentValue = current.value;
    const priorValue = prior.value;
    const consecutive = Date.parse(current.localDate) -
        Date.parse(prior.localDate) === 86_400_000;
    if (currentValue == null || priorValue == null) return [];
    const absolute = currentValue - priorValue;
    return consecutive && priorValue > 0 && absolute > 0
      ? [{ absolute, percent: absolute / priorValue * 100 }]
      : [];
  })
);
if (rises.length === 0) {
  throw new Error("The selected interval contains no consecutive-day rises.");
}

const flowValues = observations.flatMap((item) =>
  item.value == null ? [] : [item.value]
);
const absoluteRises = rises.map((item) => item.absolute);
const percentRises = rises.map((item) => item.percent);

console.log(JSON.stringify(
  {
    riverId: options.riverId,
    siteId: options.siteId,
    interval: `${options.startYear}-${options.endYear}`,
    seasonalWindow: `${options.windowStart}/${options.windowEnd}`,
    usableDays: observations.length,
    coverageByYear: observationsByYear.map(({ year, observations }) => ({
      year,
      usableDays: observations.length,
    })),
    consecutiveDayPositiveRises: rises.length,
    seasonalFlowCfs: percentileSet(flowValues, [.1, .25, .75, .9, .95]),
    positiveRiseCfs: percentileSet(absoluteRises, [.5, .75, .9]),
    positiveRisePercent: percentileSet(percentRises, [.5, .75, .9]),
  },
  null,
  2,
));

function percentileSet(values: number[], percentiles: number[]) {
  return Object.fromEntries(
    percentiles.map((percentileValue) => [
      `p${percentileValue * 100}`,
      round(percentile(values, percentileValue), 3),
    ]),
  );
}

function percentile(values: number[], percentileValue: number): number {
  const sorted = values.toSorted((left, right) => left - right);
  const position = (sorted.length - 1) * percentileValue;
  const lower = Math.floor(position);
  const upper = Math.ceil(position);
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (position - lower);
}

function round(value: number, places: number): number {
  const factor = 10 ** places;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

function parseOptions(args: string[]): Options {
  const entries = Object.fromEntries(args.map((arg) => {
    const match = /^--([a-z-]+)=(.+)$/.exec(arg);
    if (!match) throw new Error(`Invalid argument: ${arg}`);
    return [match[1], match[2]];
  }));
  const startYear = Number(entries["start-year"]);
  const endYear = Number(entries["end-year"]);
  const windowStart = entries["window-start"];
  const windowEnd = entries["window-end"];
  if (
    !entries["river-id"] || !/^\d{8}$/.test(entries["site-id"] ?? "") ||
    !Number.isInteger(startYear) || !Number.isInteger(endYear) ||
    endYear < startYear || !/^\d{2}-\d{2}$/.test(windowStart ?? "") ||
    !/^\d{2}-\d{2}$/.test(windowEnd ?? "") || windowEnd < windowStart
  ) {
    throw new Error(
      "Usage: deno run --allow-net scripts/river-run-push-calibration-audit.ts " +
        "--river-id=<id> --site-id=<8 digits> --start-year=<year> " +
        "--end-year=<year> --window-start=MM-DD --window-end=MM-DD",
    );
  }
  return {
    riverId: entries["river-id"],
    siteId: entries["site-id"],
    startYear,
    endYear,
    windowStart,
    windowEnd,
  };
}
