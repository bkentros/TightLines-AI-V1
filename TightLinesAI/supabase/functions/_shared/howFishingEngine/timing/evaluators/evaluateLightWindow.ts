/**
 * Light/cloud timing — low_light_geometry vs cloud_extended_low_light.
 *
 * Optional `hourly_cloud_cover_pct` (24 values, local index 0 = midnight, 0–100%):
 * - **Geometry:** only highlight dawn and/or evening buckets whose **mean cloud is low
 *   enough** that sun angle actually creates an edge (typically <70% in-bucket).
 * - **Extended:** highlight buckets where mean cloud is high enough to soften light
 *   (≥~68%), then cap breadth (top 2 buckets by cloud) so we don’t imply "equal
 *   everywhere" when coverage varies by hour.
 *
 * When hourly is missing, behavior falls back to daily `cloud_cover_pct` + light score.
 */

import type { SharedNormalizedOutput } from "../../contracts/mod.ts";
import type {
  DaypartFlags,
  TimingEvalOptions,
  TimingSignal,
  TimingStrength,
} from "../timingTypes.ts";
import {
  collapseTrueDaypartsToTopByScore,
  daypartMeansForSeries,
  meanInHourRange,
} from "../daypartHourly.ts";

export type LightMode = "low_light_geometry" | "cloud_extended_low_light";

const HOURLY_MIN_LEN = 12;
/** Match daily geometry gate (~70%): bucket mean must stay below this for sharp edges */
const GEOMETRY_BUCKET_MAX_CLOUD_MEAN = 69;
/** Bucket qualifies as "extended low-light" helpful (aligns normalizeLight 70%+ tiers) */
const EXTENDED_BUCKET_MIN_CLOUD_MEAN = 68;
/** Fishable hours for "is this an overcast day?" when reconciling hourly vs daily */
const FISHABLE_CLOUD_LO = 6;
const FISHABLE_CLOUD_HI = 20;
const EXTENDED_DAY_MEAN_MIN = 65;
const MAX_EXTENDED_HIGHLIGHT_BUCKETS = 2;

export function evaluateLightWindow(
  mode: LightMode,
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingSignal | null {
  if (mode === "low_light_geometry") {
    return evaluateLowLightGeometry(norm, opts);
  }
  return evaluateCloudExtended(norm, opts);
}

function meanFishableCloud(hourly: number[]): number | null {
  return meanInHourRange(hourly, FISHABLE_CLOUD_LO, FISHABLE_CLOUD_HI);
}

function evaluateLowLightGeometry(
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingSignal | null {
  const cloudPct = opts.cloud_cover_pct;
  const lightState = norm.normalized.light_cloud_condition;
  const hourly = opts.hourly_cloud_cover_pct;

  if (hourly && hourly.length >= HOURLY_MIN_LEN) {
    const fishMean = meanFishableCloud(hourly);
    if (fishMean !== null && fishMean >= 70) {
      return null;
    }
    if (cloudPct != null && cloudPct >= 70) return null;

    const dawnMean = meanInHourRange(hourly, 5, 6);
    const eveningMean = meanInHourRange(hourly, 17, 20);

    const dawnOk =
      dawnMean !== null && dawnMean <= GEOMETRY_BUCKET_MAX_CLOUD_MEAN;
    const eveningOk =
      eveningMean !== null && eveningMean <= GEOMETRY_BUCKET_MAX_CLOUD_MEAN;

    if (!dawnOk && !eveningOk) return null;

    // Brutal daily glare — don’t promise sharp edges even if one bucket clears
    if (lightState && lightState.score < -1) return null;

    if (cloudPct != null && cloudPct >= 50 && cloudPct < 70) {
      if (!lightState || lightState.score <= 0) return null;
    }

    let strength: TimingStrength;
    const okVals: number[] = [];
    if (dawnOk && dawnMean != null) okVals.push(dawnMean);
    if (eveningOk && eveningMean != null) okVals.push(eveningMean);
    const avgClear =
      okVals.length > 0 ? okVals.reduce((a, b) => a + b, 0) / okVals.length : 50;

    if (avgClear < 25) strength = "strong";
    else if (avgClear < 50) strength = "good";
    else strength = "good";

    const periods: DaypartFlags = [dawnOk, false, false, eveningOk];
    const shaped = !(dawnOk && eveningOk);
    const noteKey = shaped ? "low_light_geometry_shaped" : "low_light_geometry";

    return {
      driver_id: "low_light_geometry",
      role: "anchor",
      strength,
      periods,
      note_pool_key: noteKey,
      debug_reason:
        `low_light_geometry hourly: dawnMean=${dawnMean?.toFixed(0) ?? "n/a"}% ` +
        `eveMean=${eveningMean?.toFixed(0) ?? "n/a"}% → dawn=${dawnOk} eve=${eveningOk}`,
    };
  }

  // ── Daily aggregate fallback ─────────────────────────────────────────────
  if (cloudPct != null && cloudPct >= 70) return null;

  let strength: TimingStrength;

  if (cloudPct != null) {
    if (cloudPct < 25) {
      strength = "strong";
    } else if (cloudPct < 50) {
      strength = "good";
    } else {
      if (!lightState || lightState.score <= 0) return null;
      strength = "good";
    }
  } else {
    if (lightState && lightState.score > 0) {
      strength = "good";
    } else {
      return null;
    }
  }

  const periods: DaypartFlags = [true, false, false, true];

  return {
    driver_id: "low_light_geometry",
    role: "anchor",
    strength,
    periods,
    note_pool_key: "low_light_geometry",
    debug_reason:
      `Cloud cover=${cloudPct ?? "unknown"}%, light_score=${lightState?.score ?? "absent"}; ` +
      `low-light geometry qualifies at ${strength} — dawn+evening highlighted.`,
  };
}

function evaluateCloudExtended(
  norm: SharedNormalizedOutput,
  opts: TimingEvalOptions,
): TimingSignal | null {
  const cloudPct = opts.cloud_cover_pct;
  const lightState = norm.normalized.light_cloud_condition;
  const hourly = opts.hourly_cloud_cover_pct;

  if (!lightState || lightState.score <= 0) return null;

  if (hourly && hourly.length >= HOURLY_MIN_LEN) {
    const fishMean = meanFishableCloud(hourly);
    const dailyOvercast = cloudPct != null && cloudPct >= 70;
    // Hourly curve disagrees with a "not overcast" daily average — don’t force extended
    if (
      fishMean !== null &&
      fishMean < 55 &&
      !dailyOvercast
    ) {
      return null;
    }

    const overcastNarrative =
      dailyOvercast ||
      (fishMean !== null && fishMean >= EXTENDED_DAY_MEAN_MIN);

    if (!overcastNarrative) return null;

    const means = daypartMeansForSeries(hourly);
    if (!means) return null;

    let periods: DaypartFlags = [
      means[0] !== null && means[0] >= EXTENDED_BUCKET_MIN_CLOUD_MEAN,
      means[1] !== null && means[1] >= EXTENDED_BUCKET_MIN_CLOUD_MEAN,
      means[2] !== null && means[2] >= EXTENDED_BUCKET_MIN_CLOUD_MEAN,
      means[3] !== null && means[3] >= EXTENDED_BUCKET_MIN_CLOUD_MEAN,
    ];

    if (!periods.some(Boolean)) {
      return null;
    }

    const bucketScores = means.map((m) => (m === null ? -1 : m));
    periods = collapseTrueDaypartsToTopByScore(
      periods,
      bucketScores,
      MAX_EXTENDED_HIGHLIGHT_BUCKETS,
    );

    const validMeans = means.filter((m): m is number => m !== null);
    if (validMeans.length === 0) return null;

    let strength: TimingStrength;
    const maxM = Math.max(...validMeans);
    if (maxM >= 85) strength = "strong";
    else strength = "good";

    return {
      driver_id: "cloud_extended_low_light",
      role: "anchor",
      strength,
      periods,
      note_pool_key: "cloud_extended_shaped",
      debug_reason:
        `cloud_extended hourly: fishableMean=${fishMean?.toFixed(0) ?? "n/a"}% ` +
        `bucketMeans=${means.map((m) => m?.toFixed(0) ?? "x").join("/")}`,
    };
  }

  // ── Daily fallback ─────────────────────────────────────────────────────────
  if (cloudPct == null || cloudPct < 70) return null;

  let strength: TimingStrength;
  if (cloudPct >= 85) {
    strength = "strong";
  } else {
    strength = "good";
  }

  const periods: DaypartFlags = [true, true, true, true];

  return {
    driver_id: "cloud_extended_low_light",
    role: "anchor",
    strength,
    periods,
    note_pool_key: "cloud_all_day",
    debug_reason:
      `Cloud cover=${cloudPct}%, light_score=${lightState.score}; ` +
      `cloud-extended qualifies at ${strength} — all 4 periods highlighted.`,
  };
}
