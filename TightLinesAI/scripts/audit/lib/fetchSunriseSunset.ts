export interface SunResult {
  sunrise: string;
  sunset: string;
  raw: unknown;
}

function utcIsoToLocalHHMM(utcIso: string, ianaTimezone: string): string {
  const date = new Date(utcIso);
  if (Number.isNaN(date.getTime())) return "00:00";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ianaTimezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const hour = parts.find((part) => part.type === "hour")?.value ?? "00";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  return `${hour === "24" ? "00" : hour}:${minute}`;
}

export async function fetchSunriseSunset(
  latitude: number,
  longitude: number,
  date: string,
  ianaTimezone: string,
): Promise<SunResult | null> {
  const url =
    `https://api.sunrise-sunset.org/json?lat=${latitude}&lng=${longitude}&date=${date}&formatted=0`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8_000);
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "TightLinesAI-Audit/1.0" },
    });
    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const json = await response.json();
    const results = json?.results;
    if (!results?.sunrise || !results?.sunset) return null;

    return {
      sunrise: utcIsoToLocalHHMM(results.sunrise, ianaTimezone),
      sunset: utcIsoToLocalHHMM(results.sunset, ianaTimezone),
      raw: json,
    };
  } catch {
    return null;
  }
}
