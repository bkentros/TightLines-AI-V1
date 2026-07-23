import type {
  FlowBand,
  GaugeFreshness,
  PrimitiveDisplay,
  RawFlowTrendSignal,
  RawRainSignal,
  RiverRunReasonCode,
  WeatherFreshness,
} from "../types.ts";
import { flowBandReasonCode } from "../metrics/flow.ts";

export type FishabilityScoreInput = {
  gaugeFreshness: GaugeFreshness;
  weatherFreshness: WeatherFreshness;
  flowBand?: FlowBand;
  flowSignal: RawFlowTrendSignal;
  rainSignal: RawRainSignal;
  rainReasonCodes?: RiverRunReasonCode[];
  flowReasonCodes?: RiverRunReasonCode[];
};

export function scoreFishability(
  input: FishabilityScoreInput,
): PrimitiveDisplay {
  if (
    input.gaugeFreshness === "missing" ||
    input.gaugeFreshness === "older_than_24h"
  ) {
    return {
      score: null,
      label: "Unavailable",
      ...fishabilityCopy("Unavailable", "gauge"),
      reasonCodes: [gaugeReasonCode(input.gaugeFreshness)],
    };
  }
  if (!input.flowBand) {
    return {
      score: null,
      label: "Unavailable",
      ...fishabilityCopy("Unavailable", "baseline"),
      reasonCodes: [
        gaugeReasonCode(input.gaugeFreshness),
        weatherReasonCode(input.weatherFreshness),
        "baseline_missing",
        ...(input.rainReasonCodes ?? []),
        ...(input.flowReasonCodes ?? []),
      ],
    };
  }

  const reasonCodes = new Set<RiverRunReasonCode>([
    gaugeReasonCode(input.gaugeFreshness),
    weatherReasonCode(input.weatherFreshness),
    ...(input.rainReasonCodes ?? []),
    ...(input.flowReasonCodes ?? []),
    flowBandReasonCode(input.flowBand),
  ]);
  let score = Math.round(
    bandScore(input.flowBand) * 0.55 +
      trendScore(input.flowSignal) * 0.25 +
      rainStainScore(input.rainSignal) * 0.15 +
      freshnessScore(input.weatherFreshness) * 0.05,
  );

  if (input.flowBand === "blown_out") score = Math.min(score, 25);
  if (
    input.flowSignal === "sharp_rise" &&
    (input.flowBand === "high_fishable" || input.flowBand === "very_high" ||
      input.flowBand === "blown_out")
  ) {
    score = Math.min(score, 40);
  }
  if (input.flowBand === "very_low") score = Math.min(score, 45);
  if (input.gaugeFreshness === "stale") score = Math.min(score, 55);

  score = Math.min(100, Math.max(0, score));
  return {
    score,
    label: fishabilityLabel(score),
    ...fishabilityCopy(fishabilityLabel(score)),
    reasonCodes: [...reasonCodes],
  };
}

function bandScore(band: FlowBand): number {
  switch (band) {
    case "very_low":
      return 25;
    case "low":
      return 45;
    case "normal_fishable":
      return 75;
    case "ideal":
      return 90;
    case "high_fishable":
      return 60;
    case "very_high":
      return 35;
    case "blown_out":
      return 15;
  }
}

function trendScore(signal: RawFlowTrendSignal): number {
  switch (signal) {
    case "stable":
      return 85;
    case "falling":
    case "rising":
      return 65;
    case "meaningful_rise":
      return 45;
    case "sharp_rise":
      return 25;
    case "unknown":
      return 50;
  }
}

function rainStainScore(signal: RawRainSignal): number {
  switch (signal) {
    case "dry":
    case "light_rain":
      return 90;
    case "meaningful_rain":
    case "missing_rain_data":
      return 70;
    case "strong_rain":
      return 45;
    case "heavy_rain":
      return 25;
  }
}

function freshnessScore(freshness: WeatherFreshness): number {
  switch (freshness) {
    case "fresh":
      return 100;
    case "stale":
      return 40;
    case "missing":
      return 0;
  }
}

function fishabilityLabel(score: number): string {
  if (score <= 24) return "Poor";
  if (score <= 49) return "Tough";
  if (score <= 69) return "Fishable";
  if (score <= 84) return "Good";
  return "Excellent";
}

function fishabilityCopy(
  label: PrimitiveDisplay["label"],
  unavailableReason?: "gauge" | "baseline",
): Pick<PrimitiveDisplay, "headline" | "detail" | "tip"> {
  if (label === "Unavailable") {
    return unavailableReason === "baseline"
      ? {
        headline: "Fishability is unavailable without a resolved river band.",
        detail:
          "A river shape band requires matching percentile baselines or configured override bands.",
        tip:
          "Compare this river shape read with the other primitives separately.",
      }
      : {
        headline: "Fishability is unavailable without a current gauge read.",
        detail:
          "A usable gauge read is required to describe current river shape.",
        tip: "Check again after the next condition refresh.",
      };
  }
  switch (label) {
    case "Poor":
      return {
        headline: "Current river shape is poor.",
        detail:
          "Gauge band, trend, rain proxy, and freshness point to difficult river shape.",
        tip:
          "Compare this river shape read with the other primitives separately.",
      };
    case "Tough":
      return {
        headline: "Current river shape is tough.",
        detail:
          "The river shape inputs are usable but present meaningful constraints.",
        tip:
          "Compare this river shape read with the other primitives separately.",
      };
    case "Fishable":
      return {
        headline: "Current river shape is fishable.",
        detail:
          "The river shape inputs are in a workable range, with some limits still possible.",
        tip:
          "Compare this river shape read with the other primitives separately.",
      };
    case "Good":
      return {
        headline: "Current river shape is good.",
        detail:
          "Gauge band, trend, rain proxy, and freshness support a good river-shape read.",
        tip:
          "Compare this river shape read with the other primitives separately.",
      };
    case "Excellent":
      return {
        headline: "Current river shape is excellent.",
        detail:
          "The river shape inputs line up strongly for a clear river-shape read.",
        tip:
          "Compare this river shape read with the other primitives separately.",
      };
    default:
      return {
        headline: "Current river shape is available.",
        detail: "Fishability describes river shape only.",
        tip: "Use other primitives for separate River Run dimensions.",
      };
  }
}

function gaugeReasonCode(freshness: GaugeFreshness): RiverRunReasonCode {
  switch (freshness) {
    case "fresh":
      return "gauge_fresh";
    case "stale":
      return "gauge_stale";
    case "missing":
      return "gauge_missing";
    case "older_than_24h":
      return "gauge_older_than_24h";
  }
}

function weatherReasonCode(freshness: WeatherFreshness): RiverRunReasonCode {
  switch (freshness) {
    case "fresh":
      return "weather_fresh";
    case "stale":
      return "weather_stale";
    case "missing":
      return "weather_missing";
  }
}
