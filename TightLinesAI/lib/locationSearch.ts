/**
 * U.S. city search helpers.
 *
 * Uses a bundled U.S. Census-derived places index so custom city search is
 * instant, deterministic, and not dependent on live geocoder quirks.
 */

import { US_CITY_INDEX } from './generated/usCityIndex.generated';

export interface PlaceResult {
  lat: number;
  lon: number;
  label: string; // "City, ST"
}

/**
 * Offline fallback for native reverse geocoding. Returns the state of the
 * nearest Census place only when the coordinates are plausibly close to one;
 * this deliberately does not turn overseas GPS coordinates into a U.S. state.
 */
export function nearestUsStateCode(
  lat: number,
  lon: number,
  maxDistanceMiles = 175,
): string | null {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;

  const latitudeScale = Math.max(0.15, Math.cos(lat * Math.PI / 180));
  let nearestState: string | null = null;
  let nearestDistanceSquared = Number.POSITIVE_INFINITY;

  for (const [, stateCode, cityLat, cityLon] of US_CITY_INDEX) {
    const northMiles = (cityLat - lat) * 69;
    const eastMiles = (cityLon - lon) * 69 * latitudeScale;
    const distanceSquared = northMiles * northMiles + eastMiles * eastMiles;
    if (distanceSquared < nearestDistanceSquared) {
      nearestDistanceSquared = distanceSquared;
      nearestState = stateCode;
    }
  }

  return nearestDistanceSquared <= maxDistanceMiles * maxDistanceMiles
    ? nearestState
    : null;
}

const STATE_ABBR: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR',
  California: 'CA', Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE',
  Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID',
  Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS',
  Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS',
  Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK',
  Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT',
  Vermont: 'VT', Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV',
  Wisconsin: 'WI', Wyoming: 'WY', 'District of Columbia': 'DC',
};

const ABBR_TO_STATE_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_ABBR).map(([name, abbr]) => [abbr, name]),
) as Record<string, string>;

const SEARCH_CACHE = new Map<string, PlaceResult[]>();
const REMOTE_GEOCODER_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const DEFAULT_RESULT_LIMIT = 16;
const FUZZY_QUERY_MIN_LENGTH = 4;
const REMOTE_NOISE_PATTERN = /\b(airport|airpark|dam|park|zoo|memorial|station|university|school|hospital|cemetery|reservoir|canal)\b/i;

interface IndexedPlace extends PlaceResult {
  cityNorm: string;
  cityCompact: string;
  labelNorm: string;
  stateCode: string;
  placeRank: number;
  importanceBoost: number;
}

let INDEXED_PLACES: IndexedPlace[] | null = null;
let INDEX_BY_FIRST_CHAR: Map<string, IndexedPlace[]> | null = null;

function toStateAbbr(stateName: string): string {
  return STATE_ABBR[stateName] ?? stateName;
}

function normalizeText(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[.,']/g, '')
    .replace(/\s+/g, ' ');
}

function compactText(value: string): string {
  return normalizeText(value).replace(/\s+/g, '');
}

const MAJOR_CITY_TIERS: Array<{ boost: number; labels: string[] }> = [
  {
    boost: 32,
    labels: [
      'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
      'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX',
      'Jacksonville, FL', 'Austin, TX', 'Fort Worth, TX', 'San Jose, CA',
      'Columbus, OH', 'Charlotte, NC', 'Indianapolis, IN', 'San Francisco, CA',
      'Seattle, WA', 'Denver, CO', 'Washington, DC', 'Boston, MA', 'El Paso, TX',
      'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK', 'Portland, OR',
      'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
      'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA',
      'Sacramento, CA', 'Atlanta, GA', 'Kansas City, MO', 'Colorado Springs, CO',
      'Miami, FL', 'Raleigh, NC', 'Omaha, NE', 'Long Beach, CA', 'Virginia Beach, VA',
      'Oakland, CA', 'Minneapolis, MN', 'Tulsa, OK', 'Arlington, TX', 'Tampa, FL',
      'New Orleans, LA', 'Wichita, KS', 'Cleveland, OH', 'Bakersfield, CA',
      'Aurora, CO', 'Honolulu, HI', 'Anaheim, CA', 'Santa Ana, CA', 'Corpus Christi, TX',
      'Riverside, CA', 'Lexington, KY', 'Stockton, CA', 'Henderson, NV',
      'Saint Paul, MN', 'Cincinnati, OH', 'St. Louis, MO', 'Pittsburgh, PA',
      'Greensboro, NC', 'Lincoln, NE', 'Anchorage, AK', 'Plano, TX', 'Orlando, FL',
      'Irvine, CA', 'Newark, NJ', 'Durham, NC', 'Chula Vista, CA', 'Toledo, OH',
      'Fort Wayne, IN', 'St. Petersburg, FL', 'Laredo, TX', 'Jersey City, NJ',
      'Chandler, AZ', 'Madison, WI', 'Lubbock, TX', 'Scottsdale, AZ', 'Reno, NV',
      'Buffalo, NY', 'Gilbert, AZ', 'Glendale, AZ', 'North Las Vegas, NV',
      'Winston-Salem, NC', 'Chesapeake, VA', 'Norfolk, VA', 'Fremont, CA',
      'Garland, TX', 'Irving, TX', 'Hialeah, FL', 'Richmond, VA', 'Boise, ID',
      'Spokane, WA', 'Baton Rouge, LA', 'Tacoma, WA', 'San Bernardino, CA',
      'Modesto, CA', 'Fontana, CA', 'Des Moines, IA', 'Moreno Valley, CA',
      'Santa Clarita, CA', 'Fayetteville, NC', 'Birmingham, AL', 'Oxnard, CA',
      'Rochester, NY', 'Port St. Lucie, FL', 'Grand Rapids, MI', 'Huntsville, AL',
      'Salt Lake City, UT', 'Frisco, TX', 'Yonkers, NY', 'Amarillo, TX',
      'Glendale, CA', 'Huntington Beach, CA', 'McKinney, TX', 'Montgomery, AL',
      'Augusta, GA', 'Aurora, IL', 'Akron, OH', 'Little Rock, AR', 'Tempe, AZ',
      'Columbus, GA', 'Overland Park, KS', 'Grand Prairie, TX', 'Tallahassee, FL',
      'Cape Coral, FL', 'Mobile, AL', 'Knoxville, TN', 'Shreveport, LA',
      'Worcester, MA', 'Vancouver, WA', 'Brownsville, TX', 'Sioux Falls, SD',
      'Peoria, AZ', 'Providence, RI', 'Fort Lauderdale, FL',
    ],
  },
  {
    boost: 22,
    labels: [
      'Key West, FL', 'Naples, FL', 'Sarasota, FL', 'Fort Myers, FL',
      'Panama City, FL', 'Destin, FL', 'Pensacola, FL', 'Gainesville, FL',
      'Crystal River, FL', 'Homosassa, FL', 'Islamorada, FL', 'Marathon, FL',
      'Galveston, TX', 'South Padre Island, TX', 'Port Aransas, TX', 'Freeport, TX',
      'Traverse City, MI', 'Muskegon, MI', 'Duluth, MN', 'Brainerd, MN',
      'Bemidji, MN', 'Alexandria, MN', 'Hayward, WI', 'Green Bay, WI',
      'La Crosse, WI', 'Lake Placid, NY', 'Ithaca, NY', 'Burlington, VT',
      'Portland, ME', 'Bar Harbor, ME', 'Bozeman, MT', 'Missoula, MT',
      'Kalispell, MT', 'Bend, OR', 'Eugene, OR', 'Medford, OR', 'Astoria, OR',
      'Bellingham, WA', 'Olympia, WA', 'Coeur dAlene, ID', 'Idaho Falls, ID',
      'Jackson, WY', 'Casper, WY', 'Cheyenne, WY', 'Asheville, NC',
      'Wilmington, NC', 'Charleston, SC', 'Myrtle Beach, SC', 'Savannah, GA',
      'Hilton Head Island, SC', 'Chattanooga, TN', 'Hot Springs, AR',
      'Lake Charles, LA', 'Biloxi, MS', 'Gulfport, MS',
    ],
  },
];

const CITY_IMPORTANCE = new Map<string, number>(
  MAJOR_CITY_TIERS.flatMap(({ boost, labels }) =>
    labels.map((label) => [normalizeText(label), boost] as const),
  ),
);

function cleanPlaceName(value: string): string {
  return value
    .trim()
    .replace(/^(city|town|village|borough|municipality|charter township|township)\s+of\s+/i, '')
    .replace(/\s+\(balance\)$/i, '')
    .replace(/\s+(town|village|borough|municipio|municipality|cdp)$/i, '')
    .trim();
}

function normalizeQueryKey(query: string): string {
  return normalizeText(query).replace(/\./g, '');
}

function resolveStateToken(value: string): { state: string; stateAbbr: string } | null {
  const state = value.trim().replace(/\./g, '');
  const upper = state.toUpperCase();
  const stateAbbr = /^[A-Z]{2}$/.test(upper) ? upper : toStateAbbr(state);
  if (!/^[A-Z]{2}$/.test(stateAbbr)) return null;
  return { state: ABBR_TO_STATE_NAME[stateAbbr] ?? state, stateAbbr };
}

function parseCityState(q: string): { city: string; state: string; stateAbbr: string } | null {
  const commaMatch = q.match(/^(.+?),\s*([A-Za-z.\s]{2,})\s*$/);
  const trailingAbbrMatch = q.match(/^(.+?)\s+([A-Za-z]{2})\s*$/);
  const trailingStateMatch = q.match(/^(.+?)\s+([A-Za-z]+(?:\s+[A-Za-z]+){0,2})\s*$/);
  const m = commaMatch ?? trailingAbbrMatch ?? trailingStateMatch;
  if (!m) return null;
  const city = m[1].trim();
  const stateParts = resolveStateToken(m[2]);
  if (!stateParts) return null;
  const { state, stateAbbr } = stateParts;
  if (city.length < 2 || state.length < 2 || !/^[A-Z]{2}$/.test(stateAbbr)) return null;
  return { city, state, stateAbbr };
}

function dedupePlaces(items: PlaceResult[], max = DEFAULT_RESULT_LIMIT): PlaceResult[] {
  const seen = new Set<string>();
  const results: PlaceResult[] = [];
  for (const item of items) {
    const key = item.label;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(item);
    if (results.length >= max) break;
  }
  return results;
}

function clampQueryCount(query: string): number {
  const len = query.trim().length;
  if (len >= 8) return 20;
  if (len >= 5) return 18;
  return 14;
}

function buildIndex(): { all: IndexedPlace[]; byFirstChar: Map<string, IndexedPlace[]> } {
  const all = US_CITY_INDEX.map(([name, stateCode, lat, lon, placeRank]) => {
    const cleanedName = cleanPlaceName(name);
    const label = `${cleanedName}, ${stateCode}`;
    return {
      lat,
      lon,
      label,
      stateCode,
      placeRank,
      cityNorm: normalizeText(cleanedName),
      cityCompact: compactText(cleanedName),
      labelNorm: normalizeText(label),
      importanceBoost: CITY_IMPORTANCE.get(normalizeText(label)) ?? 0,
    };
  });

  const byFirstChar = new Map<string, IndexedPlace[]>();
  for (const item of all) {
    const key = item.cityNorm[0] ?? '#';
    const bucket = byFirstChar.get(key);
    if (bucket) bucket.push(item);
    else byFirstChar.set(key, [item]);
  }
  return { all, byFirstChar };
}

function getIndexedPlaces(): { all: IndexedPlace[]; byFirstChar: Map<string, IndexedPlace[]> } {
  if (!INDEXED_PLACES || !INDEX_BY_FIRST_CHAR) {
    const built = buildIndex();
    INDEXED_PLACES = built.all;
    INDEX_BY_FIRST_CHAR = built.byFirstChar;
  }
  return { all: INDEXED_PLACES, byFirstChar: INDEX_BY_FIRST_CHAR };
}

function editDistanceWithin(a: string, b: string, maxDistance: number): number {
  if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  const curr = Array.from({ length: b.length + 1 }, () => 0);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        curr[j - 1] + 1,
        prev[j] + 1,
        prev[j - 1] + cost,
      );
      rowMin = Math.min(rowMin, curr[j]);
    }
    if (rowMin > maxDistance) return maxDistance + 1;
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }

  return prev[b.length] ?? maxDistance + 1;
}

function fuzzyPenalty(item: IndexedPlace, cityNorm: string): number {
  if (cityNorm.length < FUZZY_QUERY_MIN_LENGTH) return Number.POSITIVE_INFINITY;
  const queryCompact = compactText(cityNorm);
  const maxDistance = queryCompact.length >= 7 ? 2 : 1;
  const prefix = item.cityCompact.slice(0, queryCompact.length);
  const fullDistance = editDistanceWithin(queryCompact, item.cityCompact, maxDistance);
  const prefixDistance = editDistanceWithin(queryCompact, prefix, maxDistance);
  const best = Math.min(fullDistance, prefixDistance);
  return best <= maxDistance ? 90 + best * 18 : Number.POSITIVE_INFINITY;
}

function scoreCandidate(item: IndexedPlace, cityNorm: string, labelNorm: string, stateAbbr?: string | null): number {
  if (stateAbbr && item.stateCode !== stateAbbr) return Number.POSITIVE_INFINITY;
  const stateBonus = stateAbbr && item.stateCode === stateAbbr ? -20 : 0;
  const cdpPenalty = item.placeRank * 8;
  const base = (() => {
    if (item.labelNorm === labelNorm) return 0;
    if (item.cityNorm === cityNorm && (!stateAbbr || item.stateCode === stateAbbr)) return 5;
    if (item.cityNorm.startsWith(cityNorm) && (!stateAbbr || item.stateCode === stateAbbr)) return 20;
    if (item.labelNorm.startsWith(labelNorm)) return 35;
    if (item.cityNorm.includes(cityNorm) && (!stateAbbr || item.stateCode === stateAbbr)) return 50;
    if (item.labelNorm.includes(labelNorm)) return 70;
    return fuzzyPenalty(item, cityNorm);
  })();
  return Number.isFinite(base)
    ? base + stateBonus + cdpPenalty - item.importanceBoost
    : Number.POSITIVE_INFINITY;
}

function scoreLocalPlaces(
  places: IndexedPlace[],
  cityNorm: string,
  labelNorm: string,
  stateAbbr?: string | null,
): Array<{ item: IndexedPlace; score: number }> {
  return places
    .map((item) => ({ item, score: scoreCandidate(item, cityNorm, labelNorm, stateAbbr) }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return a.item.label.localeCompare(b.item.label);
    });
}

function scoreRemoteCandidate(
  item: PlaceResult & { cityNorm: string; labelNorm: string; stateCode: string; population: number },
  cityNorm: string,
  labelNorm: string,
  stateAbbr?: string | null,
): number {
  const stateBonus = stateAbbr && item.stateCode === stateAbbr ? -25 : 0;
  const popRank = item.population > 0 ? -Math.min(18, Math.round(Math.log10(item.population + 1) * 3)) : 0;
  if (item.labelNorm === labelNorm) return 0 + stateBonus + popRank;
  if (item.cityNorm === cityNorm && (!stateAbbr || item.stateCode === stateAbbr)) return 4 + stateBonus + popRank;
  if (item.cityNorm.startsWith(cityNorm) && (!stateAbbr || item.stateCode === stateAbbr)) return 18 + stateBonus + popRank;
  if (item.labelNorm.startsWith(labelNorm)) return 32 + stateBonus + popRank;
  if (item.cityNorm.includes(cityNorm) && (!stateAbbr || item.stateCode === stateAbbr)) return 48 + stateBonus + popRank;
  if (item.labelNorm.includes(labelNorm)) return 68 + stateBonus + popRank;
  return Number.POSITIVE_INFINITY;
}

async function searchRemoteUsCities(
  rawQuery: string,
  cityNorm: string,
  labelNorm: string,
  stateAbbr: string | null,
  signal?: AbortSignal,
): Promise<PlaceResult[]> {
  const url = new URL(REMOTE_GEOCODER_URL);
  url.searchParams.set('name', rawQuery.trim());
  url.searchParams.set('count', String(clampQueryCount(rawQuery)));
  url.searchParams.set('language', 'en');
  url.searchParams.set('format', 'json');
  url.searchParams.set('countryCode', 'US');

  const res = await fetch(url.toString(), {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!res.ok) return [];

  const data = (await res.json()) as {
    results?: Array<{
      name?: string;
      latitude?: number;
      longitude?: number;
      country_code?: string;
      admin1?: string;
      population?: number;
    }>;
  };

  const mapped = (data.results ?? [])
    .filter((row) =>
      row &&
      row.country_code === 'US' &&
      typeof row.name === 'string' &&
      Number.isFinite(row.latitude) &&
      Number.isFinite(row.longitude) &&
      typeof row.admin1 === 'string',
    )
    .map((row) => {
      const stateCode = toStateAbbr(row.admin1!);
      const cleanedName = cleanPlaceName(row.name!);
      const label = `${cleanedName}, ${stateCode}`;
      return {
        lat: Number(row.latitude),
        lon: Number(row.longitude),
        label,
        stateCode,
        population: Number(row.population ?? 0),
        cityNorm: normalizeText(cleanedName),
        labelNorm: normalizeText(label),
      };
    })
    .filter((row) => /^[A-Z]{2}$/.test(row.stateCode))
    .filter((row) => !REMOTE_NOISE_PATTERN.test(row.label))
    .map((row) => ({
      ...row,
      score: scoreRemoteCandidate(row, cityNorm, labelNorm, stateAbbr),
    }))
    .filter((row) => Number.isFinite(row.score))
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return a.label.localeCompare(b.label);
    })
    .map(({ lat, lon, label }) => ({ lat, lon, label }));

  return dedupePlaces(mapped);
}

export async function searchUsCities(query: string, signal?: AbortSignal): Promise<PlaceResult[]> {
  if (signal?.aborted) {
    const abortError = new Error('Search aborted');
    abortError.name = 'AbortError';
    throw abortError;
  }

  const trimmed = query.trim();
  if (trimmed.length < 1) return [];

  const cacheKey = normalizeQueryKey(trimmed);
  const cached = SEARCH_CACHE.get(cacheKey);
  if (cached) return cached;

  const parsed = parseCityState(trimmed);
  const cityQuery = parsed ? parsed.city : trimmed;
  const cityNorm = normalizeText(cityQuery);
  const labelNorm = normalizeText(trimmed);
  const stateAbbr = parsed?.stateAbbr ?? null;

  const { all, byFirstChar } = getIndexedPlaces();
  const pool = byFirstChar.get(cityNorm[0] ?? '#') ?? all;
  let scored = scoreLocalPlaces(pool, cityNorm, labelNorm, stateAbbr);

  if (scored.length === 0 && pool !== all && cityNorm.length >= FUZZY_QUERY_MIN_LENGTH) {
    scored = scoreLocalPlaces(all, cityNorm, labelNorm, stateAbbr);
  }

  const selectedScored = parsed
    ? scored.filter(({ item }) => item.cityNorm === cityNorm && item.stateCode === stateAbbr)
    : [];
  const localSource = selectedScored.length > 0 ? selectedScored : scored;

  const localResults = dedupePlaces(localSource.map(({ item }) => ({
    lat: item.lat,
    lon: item.lon,
    label: item.label,
  })));

  let merged = localResults;
  const exactParsedMatch =
    parsed != null && localResults.some((r) => normalizeText(r.label) === labelNorm);
  const shouldQueryRemote =
    trimmed.length >= 3 &&
    (localResults.length === 0 || (parsed != null && !exactParsedMatch));

  if (shouldQueryRemote) {
    try {
      const remoteResults = await searchRemoteUsCities(trimmed, cityNorm, labelNorm, stateAbbr, signal);
      merged = dedupePlaces([...localResults, ...remoteResults]);
    } catch (error) {
      if ((error as Error)?.name === 'AbortError') throw error;
    }
  }

  SEARCH_CACHE.set(cacheKey, merged);
  return merged;
}
