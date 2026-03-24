/**
 * Fetches sunrise and sunset for a given date from sunrise-sunset.org.
 * Returns HH:mm in local time (using IANA timezone for conversion from UTC).
 */

export interface SunResult {
  sunrise: string; // "HH:mm" local
  sunset: string;  // "HH:mm" local
}

/** Convert UTC ISO string to local "HH:mm" via Intl. */
function utcIsoToLocalHHMM(utcIso: string, ianaTimezone: string): string {
  const d = new Date(utcIso);
  if (isNaN(d.getTime())) return "—";
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ianaTimezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const h = parts.find((p) => p.type === "hour")?.value ?? "00";
  const m = parts.find((p) => p.type === "minute")?.value ?? "00";
  // Normalize "24" hour to "00"
  return `${h === "24" ? "00" : h}:${m}`;
}

export async function fetchSunriseSunset(
  lat: number,
  lon: number,
  date: string,         // YYYY-MM-DD
  ianaTimezone: string, // for converting UTC response to local HH:mm
): Promise<SunResult | null> {
  try {
    const url =
      `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lon}&date=${date}&formatted=0`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "TightLinesAI-Audit/1.0" },
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json();
    const results = json?.results;
    if (!results?.sunrise || !results?.sunset) return null;
    return {
      sunrise: utcIsoToLocalHHMM(results.sunrise, ianaTimezone),
      sunset: utcIsoToLocalHHMM(results.sunset, ianaTimezone),
    };
  } catch {
    return null;
  }
}
