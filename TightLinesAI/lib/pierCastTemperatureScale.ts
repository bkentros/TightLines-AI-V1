/**
 * One absolute Great Lakes water-temperature scale for every PierCast surface.
 *
 * 32°F is the freshwater freezing reference. Temperatures below 32°F and
 * above 78°F keep their numeric value, but clamp to the end colors so one
 * unusually warm or cold model cell cannot distort the shared legend.
 */
export const PIER_CAST_WATER_SCALE_MIN_F = 32;
export const PIER_CAST_WATER_SCALE_MAX_F = 78;

export const PIER_CAST_WATER_SCALE_STOPS = [
  // NOAA ncWMS x-Sst colors sampled at the same fixed 32–78°F scale used
  // by the lake-wide raster. City markers and the legend therefore agree
  // with the underlying model surface.
  { valueF: 32, tone: "#000099" },
  { valueF: 44, tone: "#0087E6" },
  { valueF: 51, tone: "#73CE69" },
  { valueF: 60, tone: "#E2B500" },
  { valueF: 67, tone: "#F87400" },
  { valueF: 74, tone: "#F30300" },
  { valueF: 78, tone: "#990000" },
] as const;

export const PIER_CAST_WATER_SCALE_LABELS = [
  "32°",
  "44°",
  "51°",
  "60°",
  "67°",
  "74°",
  "78°+",
] as const;

function clampTemperature(fahrenheit: number): number {
  if (!Number.isFinite(fahrenheit)) return PIER_CAST_WATER_SCALE_MIN_F;
  return Math.max(
    PIER_CAST_WATER_SCALE_MIN_F,
    Math.min(PIER_CAST_WATER_SCALE_MAX_F, fahrenheit),
  );
}

function hexChannel(hex: string, offset: number): number {
  return Number.parseInt(hex.slice(offset, offset + 2), 16);
}

function interpolateHex(from: string, to: string, fraction: number): string {
  const channel = (offset: number) =>
    Math.round(
      hexChannel(from, offset) +
        (hexChannel(to, offset) - hexChannel(from, offset)) * fraction,
    )
      .toString(16)
      .padStart(2, "0");
  return `#${channel(1)}${channel(3)}${channel(5)}`.toUpperCase();
}

export function pierCastWaterTemperatureFraction(fahrenheit: number): number {
  return (
    (clampTemperature(fahrenheit) - PIER_CAST_WATER_SCALE_MIN_F) /
    (PIER_CAST_WATER_SCALE_MAX_F - PIER_CAST_WATER_SCALE_MIN_F)
  );
}

export function pierCastWaterTemperatureColor(fahrenheit: number): string {
  const value = clampTemperature(fahrenheit);
  for (let index = 1; index < PIER_CAST_WATER_SCALE_STOPS.length; index += 1) {
    const upper = PIER_CAST_WATER_SCALE_STOPS[index]!;
    if (value > upper.valueF) continue;
    const lower = PIER_CAST_WATER_SCALE_STOPS[index - 1]!;
    const span = upper.valueF - lower.valueF;
    return interpolateHex(
      lower.tone,
      upper.tone,
      span === 0 ? 0 : (value - lower.valueF) / span,
    );
  }
  return PIER_CAST_WATER_SCALE_STOPS.at(-1)!.tone;
}

export function formatPierCastWaterScaleEnd(
  edge: "minimum" | "maximum",
): string {
  return edge === "minimum"
    ? `${PIER_CAST_WATER_SCALE_MIN_F}°`
    : `${PIER_CAST_WATER_SCALE_MAX_F}°+`;
}
