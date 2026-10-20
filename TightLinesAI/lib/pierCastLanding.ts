/**
 * PierCast landing page data (1.18 redesign — the Standings leaderboard is
 * retired). Everything here is deterministic presentation over data the app
 * receives (the catalog, the conditions summary map with every pier's
 * five-day modeled water temperature, and target conditions for saved piers):
 *
 * - the lake snapshot (water range, coldest and warmest pier right now);
 * - water temp swings, from the same shift rule as the City Report's
 *   "Water temp shifts" section, so the landing and every report agree;
 * - shoreline groups for the lake index;
 * - "My Piers": up to five saved cities, remembered on this device;
 * - nearest pier cities for "Near me";
 * - each saved city's best trout/salmon species today, chosen with the same
 *   exact hidden opportunity ranking as the City Report.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";

import { fahrenheit } from "./pierCastConditionsPresentation";
import {
  type PierCastConditionsCatalogCityV4,
  type PierCastConditionsMapResponseV4,
  type PierCastGreatLakeIdV4,
  type PierCastLeaderboardCityReadV4,
  type PierCastLeaderboardResponseV4,
  type PierCastModeledTemperaturePointV4,
} from "./pierCastConditionsV4";
import type { PierCastSpeciesId } from "./pierCastContracts";
import { buildPierCastShiftCards, type PierCastShiftCard } from "./pierCastCityReportPresentation";
import { selectPierCastTopSpeciesConditionsV5 } from "./pierCastOpportunityV5";
import {
  PIER_CAST_LAKE_ORDER,
  PIER_CAST_SALMONID_ORDER,
  pierCastLakeName,
} from "./pierCastStandingsPresentation";

// ─── Saved piers ──────────────────────────────────────────────────────────

export const PIER_CAST_SAVED_CITIES_KEY = "tightlines_pier_cast_saved_cities_v1";
export const PIER_CAST_MAX_SAVED_CITIES = 5;
const CITY_ID = /^[a-z0-9_]{2,64}$/;

export function parsePierCastSavedCities(value: unknown): string[] {
  let list: unknown = value;
  if (typeof value === "string") {
    try {
      list = JSON.parse(value);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(list)) return [];
  const out: string[] = [];
  for (const item of list) {
    if (typeof item === "string" && CITY_ID.test(item) && !out.includes(item)) out.push(item);
    if (out.length === PIER_CAST_MAX_SAVED_CITIES) break;
  }
  return out;
}

export async function readPierCastSavedCities(): Promise<string[]> {
  try {
    return parsePierCastSavedCities(await AsyncStorage.getItem(PIER_CAST_SAVED_CITIES_KEY));
  } catch {
    return [];
  }
}

export async function writePierCastSavedCities(cityIds: readonly string[]): Promise<void> {
  try {
    await AsyncStorage.setItem(
      PIER_CAST_SAVED_CITIES_KEY,
      JSON.stringify(parsePierCastSavedCities([...cityIds])),
    );
  } catch {
    // Saved piers are a convenience; PierCast works without them.
  }
}

export type PierCastSaveResult =
  | { status: "saved" | "removed"; cityIds: string[] }
  | { status: "full"; cityIds: string[] };

/** Adds or removes one city, keeping at most five (newest last). */
export function togglePierCastSavedCity(
  current: readonly string[],
  cityId: string,
): PierCastSaveResult {
  const list = parsePierCastSavedCities([...current]);
  if (list.includes(cityId)) {
    return { status: "removed", cityIds: list.filter((id) => id !== cityId) };
  }
  if (list.length >= PIER_CAST_MAX_SAVED_CITIES) return { status: "full", cityIds: list };
  return { status: "saved", cityIds: [...list, cityId] };
}

// ─── Near me ──────────────────────────────────────────────────────────────

export type PierCastCoordinate = { latitude: number; longitude: number };

export function pierCastDistanceMiles(a: PierCastCoordinate, b: PierCastCoordinate): number {
  const r = 3958.8;
  const rad = Math.PI / 180;
  const dLat = (b.latitude - a.latitude) * rad;
  const dLon = (b.longitude - a.longitude) * rad;
  const h = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.latitude * rad) * Math.cos(b.latitude * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** A city's map point: the conditions map coordinate, else its configured reference point. */
export function pierCastCityCoordinate(
  city: PierCastConditionsCatalogCityV4,
  mapPoints: ReadonlyMap<string, PierCastCoordinate>,
): PierCastCoordinate | null {
  const point = mapPoints.get(city.cityId);
  if (point) return point;
  const ref = city.waterTemperatureSource?.configuredLocation?.referencePoint;
  return ref && Number.isFinite(ref.latitude) && Number.isFinite(ref.longitude)
    ? { latitude: ref.latitude, longitude: ref.longitude }
    : null;
}

export function nearestPierCastCities(
  origin: PierCastCoordinate,
  cities: readonly PierCastConditionsCatalogCityV4[],
  mapPoints: ReadonlyMap<string, PierCastCoordinate>,
  count = 3,
): Array<{ city: PierCastConditionsCatalogCityV4; miles: number }> {
  return cities
    .map((city) => {
      const point = pierCastCityCoordinate(city, mapPoints);
      return point ? { city, miles: pierCastDistanceMiles(origin, point) } : null;
    })
    .filter((item): item is { city: PierCastConditionsCatalogCityV4; miles: number } => item !== null)
    .sort((a, b) => a.miles - b.miles || a.city.displayName.localeCompare(b.city.displayName))
    .slice(0, count);
}

export function formatPierCastMiles(miles: number): string {
  if (miles < 1) return "Under 1 mi";
  return `${miles < 10 ? miles.toFixed(1) : Math.round(miles)} mi`;
}

export function searchPierCastCities(
  cities: readonly PierCastConditionsCatalogCityV4[],
  query: string,
  stateNames: Readonly<Record<string, string>>,
): PierCastConditionsCatalogCityV4[] {
  const q = query.trim().toLocaleLowerCase();
  if (!q) return [];
  return cities
    .filter((city) =>
      `${city.displayName} ${stateNames[city.stateCode] ?? ""} ${city.stateCode}`
        .toLocaleLowerCase()
        .includes(q)
    )
    .sort((a, b) => {
      const aStarts = a.displayName.toLocaleLowerCase().startsWith(q) ? 0 : 1;
      const bStarts = b.displayName.toLocaleLowerCase().startsWith(q) ? 0 : 1;
      return aStarts - bStarts || a.displayName.localeCompare(b.displayName);
    });
}

// ─── Best trout & salmon today ────────────────────────────────────────────

export type PierCastSalmonidPick = {
  speciesId: PierCastSpeciesId;
  row: PierCastLeaderboardCityReadV4;
};

/** Salmonids a set of cities can be rated for, in display order. */
export function pierCastSalmonidsFor(
  cities: readonly PierCastConditionsCatalogCityV4[],
): PierCastSpeciesId[] {
  return PIER_CAST_SALMONID_ORDER.filter((speciesId) =>
    cities.some((city) => Array.isArray(city.supportedSpeciesIds) && city.supportedSpeciesIds.includes(speciesId))
  );
}

/**
 * The city's best trout/salmon species today across the given species
 * conditions feeds: always one pick when any supported salmonid has a row,
 * even when the best is only Fair or Limited.
 */
export function pickPierCastTopSalmonid(
  city: PierCastConditionsCatalogCityV4,
  conditionsFeeds: readonly PierCastLeaderboardResponseV4[],
): PierCastSalmonidPick | null {
  const supported = new Set(city.supportedSpeciesIds ?? []);
  const rows: PierCastLeaderboardCityReadV4[] = [];
  for (const conditions of conditionsFeeds) {
    const speciesId = conditions.selectedSpeciesId;
    if (!speciesId || !PIER_CAST_SALMONID_ORDER.includes(speciesId) || !supported.has(speciesId)) continue;
    const row = conditions.cities.find((candidate) => candidate.cityId === city.cityId);
    if (row && row.speciesId === speciesId) rows.push(row);
  }
  if (rows.length === 0) return null;
  const row = selectPierCastTopSpeciesConditionsV5({
    cityId: city.cityId,
    species: rows,
  });
  return row ? { speciesId: row.speciesId, row } : null;
}

// ─── Temperature sparkline ────────────────────────────────────────────────

export type PierCastSparkline = {
  /** 0–1 pairs, x left→right, y top→bottom. */
  points: Array<[number, number]>;
  nowF: number | null;
  lowF: number;
  highF: number;
  /** Change from now to the end of the timeline (°F), for "↓ 6° by Fri". */
  changeF: number;
  endsAt: string;
};

export function buildPierCastSparkline(
  timeline: readonly PierCastModeledTemperaturePointV4[],
  now = Date.now(),
): PierCastSparkline | null {
  const pts = timeline
    .filter((point) => Number.isFinite(point.temperatureC) && Number.isFinite(Date.parse(point.validAt)))
    .map((point) => ({ t: Date.parse(point.validAt), f: fahrenheit(point.temperatureC) }))
    .sort((a, b) => a.t - b.t);
  const future = pts.filter((point, index) => point.t >= now - 3 * 3600_000 || index === pts.length - 1);
  if (future.length < 2) return null;
  const t0 = future[0]!.t;
  const t1 = future[future.length - 1]!.t;
  const lowF = Math.min(...future.map((point) => point.f));
  const highF = Math.max(...future.map((point) => point.f));
  const span = Math.max(2, highF - lowF);
  const mid = (lowF + highF) / 2;
  return {
    points: future.map((point) => [
      t1 > t0 ? (point.t - t0) / (t1 - t0) : 0,
      1 - ((point.f - (mid - span / 2)) / span),
    ]),
    nowF: future[0]!.f,
    lowF,
    highF,
    changeF: future[future.length - 1]!.f - future[0]!.f,
    endsAt: new Date(t1).toISOString(),
  };
}

// ─── Lake snapshot (right now) ────────────────────────────────────────────

type SummaryCity = PierCastConditionsMapResponseV4["cities"][number];

/** The modeled temperature closest to `now` (within 3 h), in °F. */
export function pierCastTemperatureNowF(
  timeline: readonly PierCastModeledTemperaturePointV4[],
  now = Date.now(),
): number | null {
  let best: { gap: number; f: number } | null = null;
  for (const point of timeline) {
    const t = Date.parse(point.validAt);
    if (!Number.isFinite(t) || !Number.isFinite(point.temperatureC)) continue;
    const gap = Math.abs(t - now);
    if (!best || gap < best.gap) best = { gap, f: fahrenheit(point.temperatureC) };
  }
  return best && best.gap <= 3 * 3600_000 ? best.f : null;
}

export type PierCastLakeSnapshot = {
  lowF: number;
  highF: number;
  coldest: { cityId: string; name: string; tempF: number };
  warmest: { cityId: string; name: string; tempF: number };
  pierCount: number;
  generatedAt: string;
};

export function buildPierCastLakeSnapshot(
  summary: Pick<PierCastConditionsMapResponseV4, "cities" | "generatedAt"> | null,
  now = Date.now(),
): PierCastLakeSnapshot | null {
  if (!summary) return null;
  const temps = summary.cities
    .map((city) => ({ city, f: pierCastTemperatureNowF(city.temperatureTimeline, now) }))
    .filter((item): item is { city: SummaryCity; f: number } => item.f !== null)
    .sort((a, b) => a.f - b.f || a.city.displayName.localeCompare(b.city.displayName));
  if (temps.length === 0) return null;
  const first = temps[0]!;
  const last = temps[temps.length - 1]!;
  return {
    lowF: first.f,
    highF: last.f,
    coldest: { cityId: first.city.cityId, name: first.city.displayName, tempF: first.f },
    warmest: { cityId: last.city.cityId, name: last.city.displayName, tempF: last.f },
    pierCount: temps.length,
    generatedAt: summary.generatedAt,
  };
}

// ─── Water temp swings ────────────────────────────────────────────────────

export type PierCastLandingSwing = PierCastShiftCard & {
  cityId: string;
  cityName: string;
  stateCode: string;
  /** Only ever true for the development preview card. */
  sample?: boolean;
};

const SEVERITY_ORDER: Record<PierCastShiftCard["severity"], number> = {
  extreme: 4,
  major: 3,
  notable: 2,
  minor: 1,
};

/**
 * Notable or bigger swings (6°F+ within a day) at every pier, using the City
 * Report's shift rule. Happening-now first, then soonest; bigger first on ties.
 */
export function buildPierCastLandingSwings(
  summary: Pick<PierCastConditionsMapResponseV4, "cities"> | null,
  now = Date.now(),
): PierCastLandingSwing[] {
  if (!summary) return [];
  const out: PierCastLandingSwing[] = [];
  for (const city of summary.cities) {
    const cards = buildPierCastShiftCards({ timeline: city.temperatureTimeline, timezone: city.timezone, now });
    for (const card of cards) {
      if (SEVERITY_ORDER[card.severity] < SEVERITY_ORDER.notable) continue;
      out.push({ ...card, cityId: city.cityId, cityName: city.displayName, stateCode: city.stateCode });
    }
  }
  return out.sort((a, b) =>
    Math.max(now, Date.parse(a.startAt)) - Math.max(now, Date.parse(b.startAt)) ||
    SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity] ||
    a.cityName.localeCompare(b.cityName)
  );
}

/** Development-build preview so the section can be reviewed on a quiet week. */
export function pierCastSampleSwing(now = Date.now()): PierCastLandingSwing {
  return {
    id: "dev-sample",
    cityId: "st_joseph_mi",
    cityName: "St. Joseph",
    stateCode: "MI",
    direction: "cooling",
    severity: "major",
    startAt: new Date(now - 2 * 3600_000).toISOString(),
    endAt: new Date(now + 20 * 3600_000).toISOString(),
    status: "HAPPENING NOW",
    title: "Drop of 11.4°F",
    change: "57.8° → 46.4°F over 22 hrs",
    window: `now to ${pierCastRelativeDay(new Date(now + 20 * 3600_000).toISOString(), new Date(now)).toLowerCase()}`,
    barStart: 0,
    barWidth: 0.18,
    sample: true,
  };
}

export function pierCastSwingSummary(swings: readonly PierCastLandingSwing[]): string {
  if (swings.length === 0) return "No big swings in the 5-day forecast";
  const cooling = swings.filter((swing) => swing.direction === "cooling").length;
  const warming = swings.length - cooling;
  const parts = [];
  if (cooling) parts.push(`${cooling} cooling`);
  if (warming) parts.push(`${warming} warming`);
  return `${parts.join(" · ")} · next 5 days`;
}

// ─── Lake index (shoreline groups) ────────────────────────────────────────

export type PierCastShoreGroup = {
  id: string;
  lakeId: PierCastGreatLakeIdV4;
  lakeName: string;
  shore: string | null;
  states: string[];
  cities: PierCastConditionsCatalogCityV4[];
};

const MICHIGAN_WEST = new Set(["WI", "IL"]);

/**
 * Groups pier cities by lake, splitting Lake Michigan into its west (WI/IL)
 * and east (MI/IN) shores. Lakes with no PierCast cities are left out, so new
 * lakes appear automatically when cities are added.
 */
export function buildPierCastShoreGroups(
  cities: readonly PierCastConditionsCatalogCityV4[],
  cityLakes: ReadonlyMap<string, PierCastGreatLakeIdV4>,
): PierCastShoreGroup[] {
  const groups = new Map<string, PierCastShoreGroup>();
  for (const city of cities) {
    const lakeId = cityLakes.get(city.cityId);
    if (!lakeId) continue;
    const shore = lakeId === "michigan" ? (MICHIGAN_WEST.has(city.stateCode) ? "West shore" : "East shore") : null;
    const id = shore ? `${lakeId}-${shore === "West shore" ? "west" : "east"}` : lakeId;
    let group = groups.get(id);
    if (!group) {
      group = { id, lakeId, lakeName: `Lake ${pierCastLakeName(lakeId)}`, shore, states: [], cities: [] };
      groups.set(id, group);
    }
    group.cities.push(city);
    if (!group.states.includes(city.stateCode)) group.states.push(city.stateCode);
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      states: [...group.states].sort(),
      cities: [...group.cities].sort((a, b) => a.displayName.localeCompare(b.displayName)),
    }))
    .sort((a, b) =>
      PIER_CAST_LAKE_ORDER.indexOf(a.lakeId) - PIER_CAST_LAKE_ORDER.indexOf(b.lakeId) ||
      (a.shore === "East shore" ? -1 : 1)
    );
}

/** "Updated 2h ago". */
export function pierCastAgeLabel(iso: string, now = Date.now()): string {
  const minutes = Math.max(0, Math.round((now - Date.parse(iso)) / 60_000));
  if (!Number.isFinite(minutes)) return "";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return hours < 48 ? `${hours}h ago` : `${Math.round(hours / 24)}d ago`;
}

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** "Today", "Tomorrow", "Thu" — relative to the viewer's local day. */
export function pierCastRelativeDay(iso: string, now = new Date()): string {
  const at = new Date(iso);
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(at) - startOf(now)) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return WEEKDAY[at.getDay()]!;
}
