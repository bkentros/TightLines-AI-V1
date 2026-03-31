import { toYYYYMMDD } from "./dateUtils.ts";

export interface TideEntry {
  time: string;
  type: "H" | "L";
  value: number;
}

export interface TidesResult {
  raw: unknown;
  station_id: string;
  high_low: TideEntry[];
  phase: string | undefined;
}

function noaaLocalToUtcMs(localTime: string, tzOffsetHours: number): number {
  const asIfUtcMs = new Date(localTime.replace(" ", "T") + ":00Z").getTime();
  return asIfUtcMs - tzOffsetHours * 3600 * 1000;
}

export async function fetchNOAATides(
  stationId: string,
  date: string,
  tzOffsetHours: number,
): Promise<TidesResult | null> {
  const dateNoaa = toYYYYMMDD(date);
  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&station=${stationId}` +
    `&begin_date=${dateNoaa}&end_date=${dateNoaa}` +
    `&interval=hilo&units=english&datum=mllw&time_zone=lst_ldt&format=json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "TightLinesAI-Audit/1.0" },
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const json = await response.json();
    if (json?.error) {
      console.warn(`NOAA tides error for station ${stationId} on ${date}: ${json.error.message}`);
      return null;
    }

    const predictions: Array<{ t?: string; v?: string; type?: string }> = json?.predictions ?? [];
    if (!Array.isArray(predictions) || predictions.length === 0) return null;

    const highLow: TideEntry[] = predictions.slice(0, 12).map((prediction) => ({
      time: String(prediction.t ?? ""),
      type: prediction.type === "L" ? "L" : "H",
      value: Number.parseFloat(String(prediction.v ?? "0")) || 0,
    }));

    const noonLocalMs = new Date(date + "T12:00:00Z").getTime() - tzOffsetHours * 3600 * 1000;
    const pastPredictions = highLow.filter((entry) => noaaLocalToUtcMs(entry.time, tzOffsetHours) <= noonLocalMs);
    const futurePredictions = highLow.filter((entry) => noaaLocalToUtcMs(entry.time, tzOffsetHours) > noonLocalMs);

    let phase: string | undefined;
    if (pastPredictions.length > 0 && futurePredictions.length > 0) {
      const lastPrediction = pastPredictions[pastPredictions.length - 1]!;
      const nextPrediction = futurePredictions[0]!;
      const minutesToNext = (noaaLocalToUtcMs(nextPrediction.time, tzOffsetHours) - noonLocalMs) / 60_000;
      if (minutesToNext <= 30) phase = "approaching slack";
      else if (lastPrediction.type === "L") phase = "incoming";
      else phase = "outgoing";
    } else if (pastPredictions.length === 0 && futurePredictions.length > 0) {
      const nextPrediction = futurePredictions[0]!;
      const minutesToNext = (noaaLocalToUtcMs(nextPrediction.time, tzOffsetHours) - noonLocalMs) / 60_000;
      if (minutesToNext <= 30) phase = "approaching slack";
      else phase = nextPrediction.type === "H" ? "incoming" : "outgoing";
    } else if (futurePredictions.length === 0 && pastPredictions.length > 0) {
      const lastPrediction = pastPredictions[pastPredictions.length - 1]!;
      const minutesSinceLast = (noonLocalMs - noaaLocalToUtcMs(lastPrediction.time, tzOffsetHours)) / 60_000;
      if (minutesSinceLast <= 30) phase = "approaching slack";
      else phase = lastPrediction.type === "L" ? "incoming" : "outgoing";
    }

    return {
      raw: json,
      station_id: stationId,
      high_low: highLow,
      phase,
    };
  } catch {
    return null;
  }
}
