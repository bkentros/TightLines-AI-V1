export type PierCastHourlyWeatherPoint = {
  localTime: string;
  airTemperatureF: number | null;
  windSpeedMph: number | null;
  windDirectionDegrees: number | null;
};

type OpenMeteoPayload = {
  timezone?: unknown;
  hourly?: {
    time?: unknown;
    temperature_2m?: unknown;
    wind_speed_10m?: unknown;
    wind_direction_10m?: unknown;
  };
};

export async function fetchPierCastHourlyWeather(input: {
  latitude: number;
  longitude: number;
  signal?: AbortSignal;
}): Promise<{
  timezone: string | null;
  points: PierCastHourlyWeatherPoint[];
}> {
  const params = new URLSearchParams({
    latitude: String(input.latitude),
    longitude: String(input.longitude),
    hourly: "temperature_2m,wind_speed_10m,wind_direction_10m",
    temperature_unit: "fahrenheit",
    wind_speed_unit: "mph",
    timezone: "auto",
    forecast_days: "6",
    timeformat: "iso8601",
  });
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
    { signal: input.signal },
  );
  if (!response.ok) {
    throw new Error(`Hourly weather request failed (${response.status}).`);
  }
  const payload = (await response.json()) as OpenMeteoPayload;
  const times = asStringArray(payload.hourly?.time);
  if (times.length === 0) throw new Error("Hourly weather is unavailable.");
  const air = asNullableNumberArray(payload.hourly?.temperature_2m);
  const wind = asNullableNumberArray(payload.hourly?.wind_speed_10m);
  const direction = asNullableNumberArray(payload.hourly?.wind_direction_10m);
  return {
    timezone: typeof payload.timezone === "string" ? payload.timezone : null,
    points: times.map((localTime, index) => ({
      localTime,
      airTemperatureF: air[index] ?? null,
      windSpeedMph: wind[index] ?? null,
      windDirectionDegrees: direction[index] ?? null,
    })),
  };
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function asNullableNumberArray(value: unknown): Array<number | null> {
  return Array.isArray(value)
    ? value.map((item) =>
        typeof item === "number" && Number.isFinite(item) ? item : null,
      )
    : [];
}
