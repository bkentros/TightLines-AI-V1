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
  Wisconsin: 'WI', Wyoming: 'WY',
};

const ABBR_TO_STATE_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_ABBR).map(([name, abbr]) => [abbr, name]),
) as Record<string, string>;

const SEARCH_CACHE = new Map<string, PlaceResult[]>();

interface IndexedPlace extends PlaceResult {
  cityNorm: string;
  labelNorm: string;
  stateCode: string;
  placeRank: number;
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

function normalizeQueryKey(query: string): string {
  return normalizeText(query).replace(/\./g, '');
}

function parseCityState(q: string): { city: string; state: string; stateAbbr: string } | null {
  const m = q.match(/^(.+?)(?:,\s*|\s+)([A-Za-z.\s]{2,})\s*$/);
  if (!m) return null;
  const city = m[1].trim();
  let state = m[2].trim().replace(/\./g, '');
  let stateAbbr = state.toUpperCase();
  if (!/^[A-Z]{2}$/.test(stateAbbr)) {
    stateAbbr = toStateAbbr(state);
  } else {
    state = ABBR_TO_STATE_NAME[stateAbbr] ?? state;
  }
  if (city.length < 2 || state.length < 2 || !/^[A-Z]{2}$/.test(stateAbbr)) return null;
  return { city, state, stateAbbr };
}

function dedupePlaces(items: PlaceResult[], max = 8): PlaceResult[] {
  const seen = new Set<string>();
  const results: PlaceResult[] = [];
  for (const item of items) {
    const key = `${item.label}|${item.lat.toFixed(4)},${item.lon.toFixed(4)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push(item);
    if (results.length >= max) break;
  }
  return results;
}

function buildIndex(): { all: IndexedPlace[]; byFirstChar: Map<string, IndexedPlace[]> } {
  const all = US_CITY_INDEX.map(([name, stateCode, lat, lon, placeRank]) => {
    const label = `${name}, ${stateCode}`;
    return {
      lat,
      lon,
      label,
      stateCode,
      placeRank,
      cityNorm: normalizeText(name),
      labelNorm: normalizeText(label),
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

function scoreCandidate(item: IndexedPlace, cityNorm: string, labelNorm: string, stateAbbr?: string | null): number {
  const stateBonus = stateAbbr && item.stateCode === stateAbbr ? -20 : 0;
  if (item.labelNorm === labelNorm) return 0 + stateBonus + item.placeRank;
  if (item.cityNorm === cityNorm && (!stateAbbr || item.stateCode === stateAbbr)) return 5 + stateBonus + item.placeRank;
  if (item.cityNorm.startsWith(cityNorm) && (!stateAbbr || item.stateCode === stateAbbr)) return 20 + stateBonus + item.placeRank;
  if (item.labelNorm.startsWith(labelNorm)) return 35 + stateBonus + item.placeRank;
  if (item.cityNorm.includes(cityNorm) && (!stateAbbr || item.stateCode === stateAbbr)) return 50 + stateBonus + item.placeRank;
  if (item.labelNorm.includes(labelNorm)) return 70 + stateBonus + item.placeRank;
  return Number.POSITIVE_INFINITY;
}

export async function searchUsCities(query: string, signal?: AbortSignal): Promise<PlaceResult[]> {
  if (signal?.aborted) {
    const abortError = new Error('Search aborted');
    abortError.name = 'AbortError';
    throw abortError;
  }

  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

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
  const scored = pool
    .map((item) => ({ item, score: scoreCandidate(item, cityNorm, labelNorm, stateAbbr) }))
    .filter((entry) => Number.isFinite(entry.score))
    .sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      return a.item.label.localeCompare(b.item.label);
    });

  const results = dedupePlaces(scored.map(({ item }) => ({
    lat: item.lat,
    lon: item.lon,
    label: item.label,
  })));
  SEARCH_CACHE.set(cacheKey, results);
  return results;
}
