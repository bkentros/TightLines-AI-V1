/**
 * get-environment — Supabase Edge Function
 *
 * Fetches weather (Open-Meteo), tides (NOAA CO-OPS), and moon/sun (USNO) in parallel.
 * Returns a unified EnvironmentData payload for the dashboard and AI features.
 *
 * @see TightLinesAI/docs/ENV_API_IMPLEMENTATION_PLAN.md
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// -----------------------------------------------------------------------------
// Types (mirror lib/env/types.ts for Edge Function isolation)
// -----------------------------------------------------------------------------

interface EnvironmentData {
  weather_available: boolean;
  tides_available: boolean;
  tides_coming_soon?: boolean;
  moon_available: boolean;
  sun_available: boolean;
  weather?: {
    temperature: number;
    humidity: number;
    cloud_cover: number;
    pressure: number;
    wind_speed: number;
    wind_direction: number;
    precipitation: number;
    temp_unit: string;
    wind_speed_unit: string;
  };
  tides?: {
    station_id: string;
    station_name: string;
    high_low: { time: string; type: "H" | "L"; value: number }[];
    phase?: string;
    unit: string;
  } | null;
  moon?: {
    phase: string;
    illumination: number;
    rise: string | null;
    set: string | null;
    upper_transit: string | null;
    lower_transit: string | null;
  };
  sun?: {
    sunrise: string;
    sunset: string;
    twilight_begin?: string;
    twilight_end?: string;
  };
  solunar?: {
    major_periods: { start: string; end: string; type?: "overhead" | "underfoot" }[];
    minor_periods: { start: string; end: string }[];
  };
  fetched_at: string;
}

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const TIDE_STATION_MAX_MILES = 50;
const GREAT_LAKES_BBOX: [number, number, number, number] = [41.3, -93, 49, -76];
const SOLUNAR_MAJOR_MINUTES = 60;
const SOLUNAR_MINOR_MINUTES = 30;
const EARTH_RADIUS_MILES = 3958.8;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function haversineMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

function isInGreatLakes(lat: number, lon: number): boolean {
  const [s, w, n, e] = GREAT_LAKES_BBOX;
  return lat >= s && lat <= n && lon >= w && lon <= e;
}

/** Derive moon phase label from illumination (0-1) when USNO doesn't return phase name */
function derivePhaseFromIllumination(frac: number): string {
  if (frac <= 0.05) return "New Moon";
  if (frac <= 0.4) return "Crescent";
  if (frac <= 0.6) return "Half";
  if (frac <= 0.9) return "Gibbous";
  return "Full Moon";
}

/** US timezone offset (hours from UTC) from longitude — approximate */
function getTzOffsetHours(lon: number): number {
  if (lon >= -81) return -5;
  if (lon >= -96) return -6;
  if (lon >= -114) return -7;
  return -8;
}

/**
 * Add minutes to a local time "HH:mm" and return ISO string (UTC).
 * tzHours: offset from UTC (e.g. -5 for Eastern)
 */
function addMinutesToLocalTime(
  timeStr: string,
  minutes: number,
  baseDate: string,
  tzHours: number
): string {
  const [h, m] = timeStr.split(":").map(Number);
  const hUtc = (h - tzHours + 24) % 24;
  const [y, mo, d] = baseDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, (mo ?? 1) - 1, d ?? 1, hUtc, m, 0));
  date.setUTCMinutes(date.getUTCMinutes() + minutes);
  return date.toISOString();
}

// -----------------------------------------------------------------------------
// API Fetchers
// -----------------------------------------------------------------------------

async function fetchOpenMeteo(
  lat: number,
  lon: number,
  units: "imperial" | "metric"
): Promise<{ weather?: EnvironmentData["weather"]; sun?: EnvironmentData["sun"] } | null> {
  const tempUnit = units === "imperial" ? "fahrenheit" : "celsius";
  const windUnit = units === "imperial" ? "mph" : "kmh";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,precipitation&daily=sunrise,sunset&temperature_unit=${tempUnit}&wind_speed_unit=${windUnit}&timezone=auto`;

  const res = await fetch(url, {
    headers: { "User-Agent": "TightLinesAI/1.0 (fishing app)" },
  });
  if (!res.ok) return null;

  const json = await res.json();
  const current = json?.current;
  const daily = json?.daily;
  if (!current || !daily) return null;

  const sunrise = Array.isArray(daily.sunrise) ? daily.sunrise[0] : null;
  const sunset = Array.isArray(daily.sunset) ? daily.sunset[0] : null;

  return {
    weather: {
      temperature: Number(current.temperature_2m) ?? 0,
      humidity: Number(current.relative_humidity_2m) ?? 0,
      cloud_cover: Number(current.cloud_cover) ?? 0,
      pressure: Number(current.pressure_msl) ?? 0,
      wind_speed: Number(current.wind_speed_10m) ?? 0,
      wind_direction: Number(current.wind_direction_10m) ?? 0,
      precipitation: Number(current.precipitation) ?? 0,
      temp_unit: units === "imperial" ? "°F" : "°C",
      wind_speed_unit: units === "imperial" ? "mph" : "km/h",
    },
    sun:
      sunrise && sunset
        ? {
            sunrise: String(sunrise),
            sunset: String(sunset),
          }
        : undefined,
  };
}

interface NOAAStation {
  id?: string;
  name?: string;
  lat?: number;
  lon?: number;
  latitude?: number;
  longitude?: number;
}

async function fetchNOAA(
  lat: number,
  lon: number,
  units: "imperial" | "metric"
): Promise<{
  tides: EnvironmentData["tides"] | null;
  nearestMiles: number;
  stationId: string | null;
} | null> {
  const stationsUrl =
    "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations.json?type=waterlevels";

  const stationsRes = await fetch(stationsUrl, {
    headers: { "User-Agent": "TightLinesAI/1.0 (fishing app)" },
  });
  if (!stationsRes.ok) return null;

  const stationsJson = await stationsRes.json();
  const stations: NOAAStation[] =
    stationsJson?.stations ??
    stationsJson?.data?.stations ??
    [];
  if (!Array.isArray(stations) || stations.length === 0) return null;

  let nearest: { station: NOAAStation; miles: number } | null = null;
  for (const s of stations) {
    const slat = Number(s.lat ?? s.latitude);
    const slon = Number(s.lon ?? s.longitude);
    if (isNaN(slat) || isNaN(slon) || !s.id) continue;
    const miles = haversineMiles(lat, lon, slat, slon);
    if (!nearest || miles < nearest.miles) {
      nearest = { station: s, miles };
    }
  }

  if (!nearest || nearest.miles > TIDE_STATION_MAX_MILES) {
    return {
      tides: null,
      nearestMiles: nearest?.miles ?? Infinity,
      stationId: null,
    };
  }

  const stationId = String(nearest.station.id);
  const unitsParam = units === "imperial" ? "english" : "metric";
  const predUrl = `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&station=${stationId}&format=json&interval=hilo&units=${unitsParam}&datum=mllw&date=today`;

  const predRes = await fetch(predUrl, {
    headers: { "User-Agent": "TightLinesAI/1.0 (fishing app)" },
  });
  if (!predRes.ok) {
    return {
      tides: null,
      nearestMiles: nearest.miles,
      stationId,
    };
  }

  const predJson = await predRes.json();
  const preds = predJson?.predictions ?? [];
  const highLow = (Array.isArray(preds) ? preds : []).slice(0, 10).map((p: { t?: string; v?: string; type?: string }) => ({
    time: String(p.t ?? ""),
    type: (p.type === "L" ? "L" : "H") as "H" | "L",
    value: parseFloat(String(p.v ?? 0)) || 0,
  }));

  return {
    tides: {
      station_id: stationId,
      station_name: String(nearest.station.name ?? stationId),
      high_low: highLow,
      unit: units === "imperial" ? "ft" : "m",
    },
    nearestMiles: nearest.miles,
    stationId,
  };
}

async function fetchUSNO(
  lat: number,
  lon: number
): Promise<{
  moon?: EnvironmentData["moon"];
  sun?: EnvironmentData["sun"];
} | null> {
  const today = new Date().toISOString().slice(0, 10);
  const tz = getTzOffsetHours(lon);
  const coords = `${lat},${lon}`;
  const url = `https://aa.usno.navy.mil/api/rstt/oneday?date=${today}&coords=${coords}&tz=${tz}`;

  const res = await fetch(url, {
    headers: { "User-Agent": "TightLinesAI/1.0 (fishing app)" },
  });
  if (!res.ok) return null;

  const json = await res.json();
  const moondata = json?.moondata ?? [];
  const sundata = json?.sundata ?? [];
  const phasedata = json?.phasedata ?? json?.properties?.data ?? {};

  let rise: string | null = null;
  let set: string | null = null;
  let upperTransit: string | null = null;
  for (const m of moondata) {
    const t = m?.time ?? "";
    switch (String(m?.phen ?? "")) {
      case "R":
        rise = t;
        break;
      case "S":
        set = t;
        break;
      case "U":
        upperTransit = t;
        break;
    }
  }

  let sunRise: string | null = null;
  let sunSet: string | null = null;
  for (const s of sundata) {
    const t = s?.time ?? "";
    switch (String(s?.phen ?? "")) {
      case "R":
        sunRise = t;
        break;
      case "S":
        sunSet = t;
        break;
    }
  }

  let phase = phasedata?.phase ?? phasedata?.curphase ?? null;
  let frac = phasedata?.frac;
  if (frac == null && phasedata?.fracillum != null) {
    const s = String(phasedata.fracillum).replace("%", "");
    frac = parseFloat(s) / 100;
  }
  const illumination = typeof frac === "number" ? frac : parseFloat(String(frac ?? 0)) || 0;

  if (!phase || String(phase).toLowerCase() === "unknown") {
    phase = derivePhaseFromIllumination(illumination);
  }

  let lowerTransit: string | null = null;
  if (upperTransit) {
    const [h, m] = upperTransit.split(":").map(Number);
    let lh = h + 12;
    if (lh >= 24) lh -= 24;
    lowerTransit = `${String(lh).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

  const moon: EnvironmentData["moon"] = {
    phase: String(phase),
    illumination,
    rise,
    set,
    upper_transit: upperTransit,
    lower_transit: lowerTransit,
  };

  let sun: EnvironmentData["sun"] | undefined;
  if (sunRise && sunSet) {
    sun = {
      sunrise: `${today}T${sunRise}:00`,
      sunset: `${today}T${sunSet}:00`,
    };
  }

  return { moon, sun };
}

// -----------------------------------------------------------------------------
// Solunar computation
// -----------------------------------------------------------------------------

function computeSolunar(
  moon: EnvironmentData["moon"],
  dateStr: string,
  tzHours: number
): EnvironmentData["solunar"] {
  const major: { start: string; end: string; type?: "overhead" | "underfoot" }[] = [];
  const minor: { start: string; end: string }[] = [];

  if (!moon) return { major_periods: major, minor_periods: minor };

  const addPeriod = (
    timeStr: string | null,
    halfMins: number,
    type?: "overhead" | "underfoot"
  ) => {
    if (!timeStr) return;
    const t = timeStr.includes(":") ? timeStr : `${timeStr}:00`;
    const start = addMinutesToLocalTime(t, -halfMins, dateStr, tzHours);
    const end = addMinutesToLocalTime(t, halfMins, dateStr, tzHours);
    if (type) {
      major.push({ start, end, type });
    } else {
      minor.push({ start, end });
    }
  };

  addPeriod(moon.upper_transit, SOLUNAR_MAJOR_MINUTES, "overhead");
  addPeriod(moon.lower_transit, SOLUNAR_MAJOR_MINUTES, "underfoot");
  addPeriod(moon.rise, SOLUNAR_MINOR_MINUTES);
  addPeriod(moon.set, SOLUNAR_MINOR_MINUTES);

  return { major_periods: major, minor_periods: minor };
}

// -----------------------------------------------------------------------------
// Main handler
// -----------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { latitude?: number; longitude?: number; units?: string } = {};
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const lat = Number(body.latitude);
  const lon = Number(body.longitude);
  const units = body.units === "metric" ? "metric" : "imperial";

  if (typeof lat !== "number" || isNaN(lat) || lat < -90 || lat > 90) {
    return new Response(
      JSON.stringify({ error: "Invalid latitude" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
  if (typeof lon !== "number" || isNaN(lon) || lon < -180 || lon > 180) {
    return new Response(
      JSON.stringify({ error: "Invalid longitude" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const fetchedAt = new Date().toISOString();

  const [meteoResult, noaaResult, usnoResult] = await Promise.allSettled([
    fetchOpenMeteo(lat, lon, units),
    fetchNOAA(lat, lon, units),
    fetchUSNO(lat, lon),
  ]);

  const meteo = meteoResult.status === "fulfilled" ? meteoResult.value : null;
  const noaa = noaaResult.status === "fulfilled" ? noaaResult.value : null;
  const usno = usnoResult.status === "fulfilled" ? usnoResult.value : null;

  const inGreatLakes = isInGreatLakes(lat, lon);
  let tides_available = false;
  let tides_coming_soon = false;
  let tides: EnvironmentData["tides"] = null;

  if (noaa?.tides) {
    tides_available = true;
    tides = noaa.tides;
  } else if (inGreatLakes && (!noaa?.stationId || (noaa.nearestMiles ?? Infinity) > TIDE_STATION_MAX_MILES)) {
    tides_coming_soon = true;
  }

  let weather = meteo?.weather ?? undefined;
  let sun = meteo?.sun ?? usno?.sun ?? undefined;
  const moon = usno?.moon ?? undefined;

  const tzHours = getTzOffsetHours(lon);
  const solunar = moon ? computeSolunar(moon, fetchedAt.slice(0, 10), tzHours) : undefined;

  const response: EnvironmentData = {
    weather_available: Boolean(weather && typeof weather.temperature === "number"),
    tides_available,
    tides_coming_soon: tides_coming_soon || undefined,
    moon_available: Boolean(moon && moon.phase),
    sun_available: Boolean(sun && sun.sunrise && sun.sunset),
    weather,
    tides,
    moon,
    sun,
    solunar,
    fetched_at: fetchedAt,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
