import type {
  ClarityLightMode,
  FlyConditionWindowId,
  FlyDailyConditionState,
  LureConditionWindowId,
  LureDailyConditionState,
  RunoffMode,
  ThermalMode,
} from "./conditionWindows.ts";
import {
  activeFlyConditionWindow,
  activeLureConditionWindow,
} from "./conditionWindows.ts";
import type { WaterClarity } from "../contracts/input.ts";
import type { DailyRegime } from "./shapeProfiles.ts";
import type { WindBand } from "./wind.ts";

export function clarityLightModeFromLabels(args: {
  water_clarity: WaterClarity;
  lightLabel: string | null;
}): ClarityLightMode {
  const bright = args.lightLabel === "bright" || args.lightLabel === "glare";
  const lowLight = args.lightLabel === "low_light" ||
    args.lightLabel === "heavy_overcast";
  if (!bright && !lowLight) return "mixed_or_unknown";
  if (args.water_clarity === "clear") {
    return bright ? "clear_bright" : "clear_low_light";
  }
  return bright ? "stained_or_dirty_bright" : "stained_or_dirty_low_light";
}

export function thermalModeFromLabels(args: {
  temperatureBand: string | null;
  temperatureTrend: string | null;
  temperatureShock: string | null;
}): ThermalMode {
  if (args.temperatureShock != null && args.temperatureShock !== "none") {
    return "cooling_or_shock";
  }
  if (args.temperatureTrend === "cooling") return "cooling_or_shock";
  if (
    args.temperatureBand === "very_cold" ||
    args.temperatureBand === "cool"
  ) {
    return "cold_limited";
  }
  if (args.temperatureBand === "very_warm") return "heat_limited";
  if (args.temperatureTrend === "warming") return "warming";
  return "stable_or_unknown";
}

export function runoffModeFromLabel(runoffLabel: string | null): RunoffMode {
  if (runoffLabel === "perfect_clear" || runoffLabel === "stable") {
    return "clear_or_stable";
  }
  if (
    runoffLabel === "slightly_elevated" ||
    runoffLabel === "elevated"
  ) {
    return "elevated_or_dirty";
  }
  if (runoffLabel === "blown_out") return "blown_out";
  return "unknown";
}

export type DailyTacticalProfile = {
  regime: DailyRegime;
  howsScore: number;
  daylightWindMph: number;
  windBand: WindBand;
  lightLabel: string | null;
  temperatureBand: string | null;
  temperatureTrend: string | null;
  temperatureShock: string | null;
  runoffLabel: string | null;
  clarityLightMode: ClarityLightMode;
  thermalMode: ThermalMode;
  runoffMode: RunoffMode;
  surfaceBlocked: boolean;
  surfaceAllowedToday: boolean;
  surfaceSlotPresent: boolean;
  activeLureConditionWindow: LureConditionWindowId | null;
  activeFlyConditionWindow: FlyConditionWindowId | null;
};

export function buildDailyTacticalProfile(args: {
  regime: DailyRegime;
  howsScore: number;
  daylightWindMph: number;
  windBand: WindBand;
  lightLabel: string | null;
  temperatureBand: string | null;
  temperatureTrend: string | null;
  temperatureShock: string | null;
  runoffLabel: string | null;
  clarityLightMode: ClarityLightMode;
  thermalMode: ThermalMode;
  runoffMode: RunoffMode;
  surfaceBlocked: boolean;
  surfaceAllowedToday: boolean;
  surfaceSlotPresent: boolean;
  lureConditionState: LureDailyConditionState;
  flyConditionState: FlyDailyConditionState;
}): DailyTacticalProfile {
  return {
    regime: args.regime,
    howsScore: args.howsScore,
    daylightWindMph: args.daylightWindMph,
    windBand: args.windBand,
    lightLabel: args.lightLabel,
    temperatureBand: args.temperatureBand,
    temperatureTrend: args.temperatureTrend,
    temperatureShock: args.temperatureShock,
    runoffLabel: args.runoffLabel,
    clarityLightMode: args.clarityLightMode,
    thermalMode: args.thermalMode,
    runoffMode: args.runoffMode,
    surfaceBlocked: args.surfaceBlocked,
    surfaceAllowedToday: args.surfaceAllowedToday,
    surfaceSlotPresent: args.surfaceSlotPresent,
    activeLureConditionWindow: activeLureConditionWindow(
      args.lureConditionState,
    ),
    activeFlyConditionWindow: activeFlyConditionWindow(args.flyConditionState),
  };
}
