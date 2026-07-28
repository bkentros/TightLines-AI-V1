import type { FishabilityBands, FlowBand, RiverMetric } from "../types.ts";

export type BaselineBandInput = {
  metric: RiverMetric;
  value: number;
  fishabilityBands?: FishabilityBands;
};

export type FlowBandResolution = {
  band: FlowBand;
  bandSource: "audited_absolute";
};

export function resolveFlowBand(
  input: BaselineBandInput,
): FlowBandResolution | null {
  if (
    !Number.isFinite(input.value) ||
    !input.fishabilityBands ||
    input.fishabilityBands.metric !== input.metric
  ) return null;
  return {
    band: resolveAdminOverrideBand(input.value, input.fishabilityBands),
    bandSource: "audited_absolute",
  };
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
