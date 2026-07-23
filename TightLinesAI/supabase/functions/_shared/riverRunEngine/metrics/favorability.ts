import type {
  BehaviorProfile,
  FavorabilityLevel,
  FlowBand,
  RawFlowTrendSignal,
  RawRainSignal,
  RawTemperatureTrendSignal,
  RiverRunReasonCode,
  TemperatureSourceType,
} from "../types.ts";
import { flowBandReasonCode } from "./flow.ts";

export type FavorabilityInput = {
  behaviorProfile: BehaviorProfile;
  rainSignal: RawRainSignal;
  flowSignal: RawFlowTrendSignal;
  temperatureSignal: RawTemperatureTrendSignal;
  temperatureSourceType: TemperatureSourceType;
  flowBand?: FlowBand;
  measuredWaterTooWarm?: boolean;
};

export type FavorabilityResult = {
  rainSignal: number;
  flowSignal: number;
  tempSignal: number;
  favorabilityIndex: number;
  favorabilityLevel: FavorabilityLevel;
  reasonCodes: RiverRunReasonCode[];
};

export function resolveFavorability(
  input: FavorabilityInput,
): FavorabilityResult {
  const rainSignal = mapRain(input.behaviorProfile, input.rainSignal);
  const flowSignal = mapFlow(
    input.behaviorProfile,
    input.flowSignal,
    input.flowBand,
  );
  const rawTempSignal = input.temperatureSourceType === "unavailable"
    ? 0
    : mapTemperature(
      input.behaviorProfile,
      input.temperatureSignal,
      input.measuredWaterTooWarm === true,
    );
  const tempSignal = input.temperatureSourceType === "air_temp_proxy"
    ? clamp(rawTempSignal, -1, 1)
    : rawTempSignal;
  const favorabilityIndex = rainSignal + flowSignal + tempSignal;

  return {
    rainSignal,
    flowSignal,
    tempSignal,
    favorabilityIndex,
    favorabilityLevel: favorabilityLevel(favorabilityIndex),
    reasonCodes: compactReasonCodes(input),
  };
}

export function favorabilityLevel(index: number): FavorabilityLevel {
  if (index >= 4) return "very_favorable";
  if (index >= 2) return "favorable";
  if (index >= -1) return "neutral";
  if (index >= -3) return "unfavorable";
  return "very_unfavorable";
}

function mapRain(profile: BehaviorProfile, signal: RawRainSignal): number {
  switch (profile) {
    case "fall_cooling_rain_pulse":
      if (signal === "heavy_rain" || signal === "strong_rain") return 2;
      if (signal === "meaningful_rain") return 1;
      if (signal === "dry") return -1;
      return 0;
    case "spring_warming_flow_pulse":
      if (signal === "heavy_rain" || signal === "strong_rain") return 1;
      if (signal === "meaningful_rain") return 1;
      return 0;
    case "winter_thaw_flow_window":
      if (signal === "heavy_rain" || signal === "strong_rain") return 1;
      if (signal === "meaningful_rain") return 1;
      if (signal === "dry") return -1;
      return 0;
    case "summer_cool_rain_pulse":
      if (signal === "heavy_rain" || signal === "strong_rain") return 2;
      if (signal === "meaningful_rain") return 1;
      if (signal === "dry") return -1;
      return 0;
    case "stable_cool_holding":
      if (
        signal === "meaningful_rain" || signal === "strong_rain" ||
        signal === "heavy_rain"
      ) {
        return 0;
      }
      return 0;
  }
}

function mapFlow(
  profile: BehaviorProfile,
  signal: RawFlowTrendSignal,
  band?: FlowBand,
): number {
  const lowBand = band === "very_low" || band === "low";
  const fishableBand = band === "normal_fishable" || band === "ideal" ||
    band === "high_fishable";
  const highBand = band === "high_fishable" || band === "very_high" ||
    band === "blown_out";

  switch (profile) {
    case "fall_cooling_rain_pulse":
      if (signal === "meaningful_rise" || signal === "sharp_rise") return 2;
      if (signal === "rising") return 1;
      if (signal === "falling" && lowBand) return -1;
      return 0;
    case "spring_warming_flow_pulse":
      if (signal === "meaningful_rise") return highBand ? 0 : 2;
      if (signal === "rising") return 1;
      if (signal === "stable" && fishableBand) return 1;
      if (signal === "falling" && lowBand) return -1;
      return 0;
    case "winter_thaw_flow_window":
      if (signal === "meaningful_rise") return highBand ? 0 : 2;
      if (signal === "rising") return 1;
      if (signal === "stable" && fishableBand) return 1;
      if (signal === "sharp_rise" && highBand) return -1;
      return 0;
    case "summer_cool_rain_pulse":
      if (
        (signal === "meaningful_rise" || signal === "sharp_rise") &&
        fishableBand
      ) return 2;
      if (signal === "rising") return 1;
      return 0;
    case "stable_cool_holding":
      if (signal === "stable" && fishableBand) return 2;
      if (signal === "sharp_rise" || band === "blown_out") return -2;
      return 0;
  }
}

function mapTemperature(
  profile: BehaviorProfile,
  signal: RawTemperatureTrendSignal,
  tooWarm: boolean,
): number {
  if (signal === "neutral_missing" || signal === "neutral") return 0;

  switch (profile) {
    case "fall_cooling_rain_pulse":
      if (signal === "strong_cooling") return 2;
      if (signal === "cooling") return 1;
      if (signal === "warming") return -1;
      if (signal === "strong_warming") return -2;
      return 0;
    case "spring_warming_flow_pulse":
      if (signal === "strong_warming") return 2;
      if (signal === "warming") return 1;
      if (signal === "cooling") return -1;
      if (signal === "strong_cooling") return -2;
      return 0;
    case "winter_thaw_flow_window":
      if (tooWarm) return -2;
      if (signal === "warming") return 1;
      if (signal === "cooling") return 0;
      if (signal === "strong_warming") return 0;
      return 1;
    case "summer_cool_rain_pulse":
      if (tooWarm) return -2;
      if (signal === "strong_cooling") return 2;
      if (signal === "cooling") return 1;
      if (signal === "warming" || signal === "strong_warming") return -1;
      return 0;
    case "stable_cool_holding":
      return 0;
  }
}

function compactReasonCodes(input: FavorabilityInput): RiverRunReasonCode[] {
  const codes = new Set<RiverRunReasonCode>();
  if (input.flowBand) codes.add(flowBandReasonCode(input.flowBand));
  if (input.temperatureSourceType === "air_temp_proxy") {
    codes.add("temperature_air_proxy");
  }
  if (input.temperatureSourceType === "unavailable") {
    codes.add("temperature_unavailable");
  }
  if (input.measuredWaterTooWarm) codes.add("temperature_too_warm_cap");
  return [...codes];
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
