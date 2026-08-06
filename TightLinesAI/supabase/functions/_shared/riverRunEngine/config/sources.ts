import type {
  HydraulicSourceConfig,
  RiverProfile,
  RiverRunProfile,
  WaterTemperatureSourceConfig,
  WeatherPointConfig,
} from "../types.ts";

export function getPrimaryHydraulicSource(
  river: Pick<RiverProfile, "hydraulicSources">,
): HydraulicSourceConfig {
  const primary = river.hydraulicSources.find((source) =>
    source.role === "primary"
  );
  if (!primary) {
    throw new Error(
      "River Migration river config has no primary hydraulic source.",
    );
  }
  return primary;
}

export function getPrimaryWeatherPoint(
  river: Pick<RiverProfile, "weatherPoints" | "mouthLat" | "mouthLon">,
): WeatherPointConfig {
  return river.weatherPoints.find((point) => point.role === "primary") ?? {
    weatherPointId: "river_mouth_fallback",
    lat: river.mouthLat,
    lon: river.mouthLon,
    role: "primary",
  };
}

export function getRunTemperatureSources(
  river: Pick<RiverProfile, "waterTemperatureSources">,
  run: Pick<RiverRunProfile, "waterTemperature"> & {
    waterTemperature: NonNullable<RiverRunProfile["waterTemperature"]>;
  },
): WaterTemperatureSourceConfig[] {
  return run.waterTemperature.sourcePriority.flatMap((sourceId) => {
    const source = river.waterTemperatureSources.find((candidate) =>
      candidate.sourceId === sourceId
    );
    return source ? [source] : [];
  });
}
