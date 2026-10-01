import {
  PIER_CAST_SEASON_STAGE_LABELS,
  PIER_CAST_SEASONAL_BAND_LABELS,
  PIER_CAST_THERMAL_BAND_LABELS,
  type PierCastSeasonStageV4,
  type PierCastSeasonalBandV4,
  type PierCastThermalBandV4,
} from "./pierCastConditionsV4";

export const PIER_CAST_SPECIES_LABELS = {
  chinook_salmon: "Chinook Salmon",
  coho_salmon: "Coho Salmon",
  steelhead: "Steelhead",
  brown_trout: "Brown Trout",
  lake_trout: "Lake Trout",
  walleye: "Walleye",
  smallmouth_bass: "Smallmouth Bass",
  freshwater_drum: "Freshwater Drum",
  yellow_perch: "Yellow Perch",
  lake_whitefish: "Lake Whitefish",
  round_whitefish: "Round Whitefish",
  channel_catfish: "Channel Catfish",
  largemouth_bass: "Largemouth Bass",
  atlantic_salmon: "Atlantic Salmon",
  northern_pike: "Northern Pike",
  burbot: "Burbot",
  white_perch: "White Perch",
  white_bass: "White Bass",
  bluegill: "Bluegill",
} as const;

export const PIER_CAST_STATE_LABELS: Record<string, string> = {
  MI: "Michigan",
  WI: "Wisconsin",
  IL: "Illinois",
  IN: "Indiana",
  MN: "Minnesota",
  OH: "Ohio",
  PA: "Pennsylvania",
  NY: "New York",
  ON: "Ontario",
};

export function fahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatWaterTemperature(celsius: number | null): string {
  return celsius === null ? "—" : `${fahrenheit(celsius).toFixed(1)}°F`;
}

export function formatOptimumRange(
  range: readonly [number, number] | null,
): string {
  return range
    ? `${fahrenheit(range[0]).toFixed(0)}–${fahrenheit(range[1]).toFixed(0)}°F`
    : "Unavailable";
}

export function formatDistanceFromOptimum(celsius: number | null): string {
  if (celsius === null) return "Unavailable";
  if (celsius <= 0.05) return "Inside optimum range";
  return `${(celsius * 9 / 5).toFixed(1)}°F outside optimum`;
}

export function seasonalBandLabel(band: PierCastSeasonalBandV4): string {
  return PIER_CAST_SEASONAL_BAND_LABELS[band];
}

export function thermalBandLabel(band: PierCastThermalBandV4): string {
  return PIER_CAST_THERMAL_BAND_LABELS[band];
}

export function seasonStageLabel(stage: PierCastSeasonStageV4): string {
  return PIER_CAST_SEASON_STAGE_LABELS[stage];
}

export function formatSeasonTrend(
  stage: PierCastSeasonStageV4,
  trend: "building" | "steady" | "fading",
): string {
  return `${seasonStageLabel(stage)} · ${trend[0].toUpperCase()}${trend.slice(1)}`;
}

export function formatConditionsFreshness(
  generatedAt: string,
  now = Date.now(),
): string {
  const elapsedMinutes = Math.max(
    0,
    Math.round((now - new Date(generatedAt).getTime()) / 60_000),
  );
  if (!Number.isFinite(elapsedMinutes)) return "Update time unavailable";
  if (elapsedMinutes < 1) return "Updated just now";
  if (elapsedMinutes < 60) return `Updated ${elapsedMinutes}m ago`;
  const hours = Math.round(elapsedMinutes / 60);
  return `Updated ${hours}h ago`;
}

export function formatLocalContext(
  label: "established" | "documented" | "limited_evidence" | null,
): string {
  if (label === "established") return "Established local fishery";
  if (label === "documented") return "Documented local fishery";
  if (label === "limited_evidence") return "Limited local evidence";
  return "Local context unavailable";
}
