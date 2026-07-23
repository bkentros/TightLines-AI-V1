import type { FishabilityBands, FlowBand, RiverMetric } from "../types.ts";
import type { RiverRunGaugeBaseline } from "../storage/types.ts";

export type BaselineBandInput = {
  metric: RiverMetric;
  value: number;
  fishabilityBands?: FishabilityBands;
  baseline?: Pick<RiverRunGaugeBaseline, "percentiles" | "bandData"> | null;
};

export type FlowBandResolution = {
  band: FlowBand;
  bandSource: "admin_override" | "percentile_default";
};

export function resolveFlowBand(
  input: BaselineBandInput,
): FlowBandResolution | null {
  if (!Number.isFinite(input.value)) return null;
  if (input.fishabilityBands) {
    return {
      band: resolveAdminOverrideBand(input.value, input.fishabilityBands),
      bandSource: "admin_override",
    };
  }
  if (input.baseline?.percentiles) {
    return {
      band: resolvePercentileBand(input.value, input.baseline.percentiles),
      bandSource: "percentile_default",
    };
  }
  return null;
}

export function resolveAdminOverrideBand(
  value: number,
  bands: FishabilityBands,
): FlowBand {
  if (bands.tooLow?.max != null && value < bands.tooLow.max) return "very_low";
  if (
    bands.lowFishable &&
    value >= bands.lowFishable.min &&
    value < bands.lowFishable.max
  ) return "low";
  if (bands.ideal && value >= bands.ideal.min && value <= bands.ideal.max) {
    return "ideal";
  }
  if (
    bands.highFishable &&
    value >= bands.highFishable.min &&
    value <= bands.highFishable.max
  ) return "high_fishable";
  if (bands.blownOut?.min != null && value >= bands.blownOut.min) {
    return "blown_out";
  }
  if (bands.ideal && value < bands.ideal.min) return "normal_fishable";
  if (bands.blownOut?.min != null && value < bands.blownOut.min) {
    return "very_high";
  }
  return "normal_fishable";
}

export function resolvePercentileBand(
  value: number,
  percentiles: Record<string, number>,
): FlowBand {
  const p10 = percentiles.p10;
  const p25 = percentiles.p25;
  const p40 = percentiles.p40;
  const p65 = percentiles.p65;
  const p85 = percentiles.p85;
  const p90 = percentiles.p90;
  if (value < p10) return "very_low";
  if (value < p25) return "low";
  if (value < p40) return "normal_fishable";
  if (value < p65) return "ideal";
  if (value < p85) return "high_fishable";
  if (value < p90) return "very_high";
  return "blown_out";
}
