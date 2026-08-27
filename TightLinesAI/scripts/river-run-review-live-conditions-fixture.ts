import type {
  RiverRunLiveConditionMetric,
  RiverRunLiveConditions,
  RiverRunLiveMetricId,
} from "../lib/riverRunContracts.ts";
import type {
  RiverProfile,
} from "../supabase/functions/_shared/riverRunEngine/types.ts";

const USGS_ATTRIBUTION =
  "U.S. Geological Survey Water Data for the Nation; values may be provisional and subject to revision.";

const REVIEW_VALUES: Record<
  string,
  {
    flowAverage: number;
    gageHeight: number;
    waterTemperatureAverage: number | null;
  }
> = {
  pere_marquette: {
    flowAverage: 620,
    gageHeight: 3.08,
    waterTemperatureAverage: 59.4,
  },
  big_manistee: {
    flowAverage: 1_800,
    gageHeight: 5.42,
    waterTemperatureAverage: 59.1,
  },
  muskegon: {
    flowAverage: 1_900,
    gageHeight: 4.76,
    waterTemperatureAverage: 59.8,
  },
  st_joseph: {
    flowAverage: 2_600,
    gageHeight: 4.38,
    waterTemperatureAverage: 60.6,
  },
  grand: {
    flowAverage: 2_700,
    gageHeight: 1.25,
    waterTemperatureAverage: 64.2,
  },
  platte: {
    flowAverage: 165,
    gageHeight: 1.43,
    waterTemperatureAverage: null,
  },
  white: {
    flowAverage: 341,
    gageHeight: 0.91,
    waterTemperatureAverage: null,
  },
  milwaukee: {
    flowAverage: 359,
    gageHeight: 2.5,
    waterTemperatureAverage: null,
  },
};

export function buildReviewLiveConditionsFixture(input: {
  river: RiverProfile;
  localDate: string;
  refreshSlot: string;
  refreshedAt: string;
  flowCfs: number | null;
  flowDelta24h?: number | null;
  flowPercentDelta24h?: number | null;
  waterTempF: number | null;
}): RiverRunLiveConditions {
  const hydraulic = input.river.hydraulicSources.find((source) =>
    source.role === "primary"
  );
  const temperature =
    [...input.river.waterTemperatureSources].sort((a, b) =>
      a.priority - b.priority
    )[0];
  const values = REVIEW_VALUES[input.river.riverId];
  const metrics: RiverRunLiveConditionMetric[] = [];

  if (hydraulic) {
    for (const metric of hydraulic.availableMetrics) {
      const value = metric === "flow_cfs"
        ? input.flowCfs
        : input.flowCfs == null
        ? null
        : values?.gageHeight ?? null;
      const delta = metric === "flow_cfs"
        ? input.flowDelta24h ?? 0
        : value == null
        ? null
        : .04;
      metrics.push({
        metric,
        label: metric === "flow_cfs" ? "Discharge" : "Gauge Height",
        value,
        unit: metric === "flow_cfs" ? "CFS" : "ft",
        observedAt: value == null ? undefined : input.refreshedAt,
        freshness: value == null ? "missing" : "fresh",
        approvalStatus: value == null ? undefined : "Provisional",
        sourceId: hydraulic.sourceId,
        provider: "USGS",
        stationName: hydraulic.name,
        siteId: hydraulic.siteId,
        representedReach: hydraulic.reachNotes,
        attribution: USGS_ATTRIBUTION,
        trend24h: {
          direction: delta == null
            ? "unknown"
            : delta > 0
            ? "rising"
            : delta < 0
            ? "falling"
            : "stable",
          delta,
          percentDelta: metric === "flow_cfs"
            ? input.flowPercentDelta24h ?? 0
            : null,
          comparisonObservedAt: delta == null
            ? undefined
            : shiftIsoHours(input.refreshedAt, -24),
        },
        seasonalContext: metric === "flow_cfs" && value != null && values
          ? seasonalContext({
            metric,
            localDate: input.localDate,
            average: values.flowAverage,
            value,
            historicalYears: hydraulic.historyYearsAvailable,
            source: "usgs_statistics",
          })
          : undefined,
      });
    }
  }

  if (temperature) {
    const value = input.waterTempF;
    const delta = value == null ? null : -1.2;
    metrics.push({
      metric: "water_temp_f",
      label: "Water Temperature",
      value,
      unit: "°F",
      observedAt: value == null ? undefined : input.refreshedAt,
      freshness: value == null ? "missing" : "fresh",
      sourceId: temperature.sourceId,
      provider: temperature.provider,
      stationName: temperature.name,
      siteId: temperature.siteId,
      representedReach: temperature.reachNotes,
      attribution: temperature.attribution,
      trend24h: {
        direction: delta == null ? "unknown" : "cooling",
        delta,
        percentDelta: null,
        comparisonObservedAt: delta == null
          ? undefined
          : shiftIsoHours(input.refreshedAt, -24),
      },
      seasonalContext: value != null &&
          values?.waterTemperatureAverage != null
        ? seasonalContext({
          metric: "water_temp_f",
          localDate: input.localDate,
          average: values.waterTemperatureAverage,
          value,
          historicalYears: temperature.historicalStartYear &&
              temperature.historicalEndYear
            ? temperature.historicalEndYear -
              temperature.historicalStartYear + 1
            : 5,
          source: temperature.provider === "USGS"
            ? "usgs_statistics"
            : "monitor_my_watershed_history",
        })
        : undefined,
    });
  } else if (input.river.historicalWaterTemperatureSource) {
    const source = input.river.historicalWaterTemperatureSource;
    const normal = source.normals[input.localDate.slice(5)];
    metrics.push({
      metric: "water_temp_f",
      label: "Historical Water Temperature",
      value: null,
      unit: "°F",
      freshness: "missing",
      sourceId: source.sourceId,
      provider: source.provider,
      stationName: source.name,
      siteId: source.siteId,
      representedReach: source.reachNotes,
      attribution: source.attribution,
      trend24h: {
        direction: "unknown",
        delta: null,
        percentDelta: null,
      },
      seasonalContext: normal
        ? {
          average: normal.averageF,
          p10: normal.p10F,
          p25: normal.p25F,
          median: normal.medianF,
          p75: normal.p75F,
          p90: normal.p90F,
          historicalYears: normal.historicalYears,
          sampleCount: normal.sampleCount,
          availableWindowDays: 1,
          windowRadiusDays: 0,
          windowStartMonthDay: input.localDate.slice(5),
          windowEndMonthDay: input.localDate.slice(5),
          recordKind: "recent",
          baselineVersion: source.baselineVersion,
          source: "usgs_approved_exact_date_archive",
        }
        : undefined,
    });
  }

  const available = metrics.filter((metric) => metric.value != null).length;
  return {
    riverId: input.river.riverId,
    status: available === 0
      ? "unavailable"
      : available === metrics.length
      ? "available"
      : "partial",
    refreshedAt: input.refreshedAt,
    localDate: input.localDate,
    refreshSlot: input.refreshSlot,
    metrics,
    limitation: input.river.gaugeLimitationCopy,
    dataVersion: "river-live-conditions-v2-review-fixture",
  };
}

function seasonalContext(input: {
  metric: Extract<RiverRunLiveMetricId, "flow_cfs" | "water_temp_f">;
  localDate: string;
  average: number;
  value: number;
  historicalYears: number;
  source: "usgs_statistics" | "monitor_my_watershed_history";
}) {
  const spread = input.metric === "flow_cfs"
    ? Math.max(40, input.average * .2)
    : 4;
  const difference = input.value - input.average;
  const tolerance = input.metric === "flow_cfs"
    ? Math.max(25, input.average * .08)
    : 1.5;
  const comparisonLabel = Math.abs(difference) <= tolerance
    ? "Near seasonal average"
    : difference > 0
    ? input.metric === "water_temp_f"
      ? "Warmer than average"
      : "Higher than average"
    : input.metric === "water_temp_f"
    ? "Colder than average"
    : "Lower than average";
  return {
    average: input.average,
    p10: input.average - spread * 1.5,
    p25: input.average - spread * .75,
    median: input.average,
    p75: input.average + spread * .75,
    p90: input.average + spread * 1.5,
    comparisonLabel,
    historicalYears: input.historicalYears,
    sampleCount: Math.max(30, input.historicalYears * 7),
    availableWindowDays: 7,
    windowRadiusDays: 3 as const,
    windowStartMonthDay: shiftDate(input.localDate, -3).slice(5),
    windowEndMonthDay: shiftDate(input.localDate, 3).slice(5),
    recordKind: input.historicalYears >= 10
      ? "long_term" as const
      : "recent" as const,
    baselineVersion: "river-live-conditions-review-baseline-v1",
    source: input.source,
  };
}

function shiftDate(localDate: string, days: number): string {
  const date = new Date(`${localDate}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function shiftIsoHours(value: string, hours: number): string {
  return new Date(Date.parse(value) + hours * 60 * 60 * 1_000).toISOString();
}
