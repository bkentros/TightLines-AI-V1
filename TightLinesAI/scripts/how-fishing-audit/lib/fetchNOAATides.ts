/**
 * Fetches NOAA CO-OPS tide predictions for a specific past date.
 * Phase is derived from the high/low sequence relative to noon local time.
 * Logic adapted from get-environment/index.ts.
 */

import { toYYYYMMDD } from "./dateUtils.ts";

export interface TideEntry {
  time: string;  // "YYYY-MM-DD HH:mm" in local station time
  type: "H" | "L";
  value: number; // ft
}

export interface TidesResult {
  raw: unknown;
  station_id: string;
  high_low: TideEntry[];
  phase: string | undefined;
}

/**
 * Parse a NOAA local time string "YYYY-MM-DD HH:mm" to UTC milliseconds.
 * NOAA times are in local station time; shift by tzHours to get UTC.
 */
function noaaLocalToUtcMs(localTime: string, tzOffsetHours: number): number {
  const asIfUtcMs = new Date(localTime.replace(" ", "T") + ":00Z").getTime();
  return asIfUtcMs - tzOffsetHours * 3600 * 1000;
}

export async function fetchNOAATides(
  stationId: string,
  date: string,           // YYYY-MM-DD
  tzOffsetHours: number,  // local timezone offset for phase derivation
): Promise<TidesResult | null> {
  const dateNoaa = toYYYYMMDD(date);

  const url =
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter` +
    `?product=predictions&station=${stationId}` +
    `&begin_date=${dateNoaa}&end_date=${dateNoaa}` +
    `&interval=hilo&units=english&datum=mllw&time_zone=lst_ldt&format=json`;

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "TightLinesAI-Audit/1.0" },
    });
    clearTimeout(timer);

    if (!res.ok) return null;

    const json = await res.json();

    // NOAA returns { error: { message: "..." } } for invalid station/date combos
    if (json?.error) {
      console.warn(`NOAA tides error for station ${stationId} on ${date}: ${json.error.message}`);
      return null;
    }

    const preds: { t?: string; v?: string; type?: string }[] =
      json?.predictions ?? [];
    if (!Array.isArray(preds) || preds.length === 0) return null;

    const highLow: TideEntry[] = preds.slice(0, 12).map((p) => ({
      time: String(p.t ?? ""),
      type: p.type === "L" ? "L" : "H",
      value: parseFloat(String(p.v ?? "0")) || 0,
    }));

    // Derive phase relative to noon local time on target date
    // Construct a "noon" UTC ms for the target date using tzOffsetHours
    const noonLocalMs = new Date(date + "T12:00:00Z").getTime() - tzOffsetHours * 3600 * 1000;

    let phase: string | undefined;
    const pastPreds = highLow.filter(
      (p) => noaaLocalToUtcMs(p.time, tzOffsetHours) <= noonLocalMs,
    );
    const futurePreds = highLow.filter(
      (p) => noaaLocalToUtcMs(p.time, tzOffsetHours) > noonLocalMs,
    );

    if (pastPreds.length > 0 && futurePreds.length > 0) {
      const lastPred = pastPreds[pastPreds.length - 1]!;
      const nextPred = futurePreds[0]!;
      const minsToNext =
        (noaaLocalToUtcMs(nextPred.time, tzOffsetHours) - noonLocalMs) / 60000;
      if (minsToNext <= 30) {
        phase = "approaching slack";
      } else if (lastPred.type === "L") {
        phase = "incoming";
      } else {
        phase = "outgoing";
      }
    }

    return { raw: json, station_id: stationId, high_low: highLow, phase };
  } catch {
    return null;
  }
}
