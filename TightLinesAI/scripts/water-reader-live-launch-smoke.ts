import { createClient } from '@supabase/supabase-js';
import {
  WATER_READER_APP_SVG_WIDTH,
  WATER_READER_ENGINE_VERSION,
  type WaterReaderReadResponse,
} from '../supabase/functions/_shared/waterReaderRead/contracts.ts';
import type {
  WaterbodySearchResponse,
  WaterbodySearchResult,
} from '../lib/waterReaderContracts.ts';

interface SmokeCase {
  state: string;
  query: string;
  minResults: number;
  readFirst?: boolean;
  expectedName?: string;
}

interface SmokeRow {
  type: 'search' | 'read';
  label: string;
  status: 'passed' | 'failed';
  elapsedMs: number;
  details: Record<string, unknown>;
}

const CURRENT_DATE = '2026-07-15T12:00:00.000Z';
const SEARCH_CASES: SmokeCase[] = [
  { state: 'MI', query: 'lake', minResults: 8 },
  { state: 'MN', query: 'mud lake', minResults: 8, readFirst: true },
  { state: 'MI', query: 'glen lake', minResults: 1, readFirst: true, expectedName: 'Glen Lake' },
  { state: 'NY', query: 'cayuga lake', minResults: 1, readFirst: true, expectedName: 'Cayuga Lake' },
  { state: 'VT', query: 'lake memphremagog', minResults: 1, expectedName: 'Lake Memphremagog' },
  { state: 'WA', query: 'clear lake', minResults: 1, readFirst: true },
];

function requireEnv(names: string[]): Record<string, string> {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) throw new Error(`Missing required env: ${missing.join(', ')}`);
  return Object.fromEntries(names.map((name) => [name, process.env[name] as string]));
}

function supabaseUrlFromEnv(): string {
  return process.env.EXPO_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? '';
}

function anonKeyFromEnv(): string {
  return process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY ?? '';
}

async function invokeEdge<T>(
  supabaseUrl: string,
  anonKey: string,
  accessToken: string,
  functionName: string,
  body: Record<string, unknown>,
): Promise<{ httpStatus: number; body: T; elapsedMs: number }> {
  const started = Date.now();
  const res = await fetch(`${supabaseUrl}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const elapsedMs = Date.now() - started;
  const payload = await res.json().catch(() => null) as T;
  return { httpStatus: res.status, body: payload, elapsedMs };
}

function firstOpenable(rows: WaterbodySearchResult[]): WaterbodySearchResult | null {
  return rows.find((row) =>
    row.hasPolygonGeometry &&
    row.waterReaderSupportStatus !== 'not_supported'
  ) ?? null;
}

function assertSearchResult(smokeCase: SmokeCase, httpStatus: number, response: WaterbodySearchResponse, elapsedMs: number): SmokeRow {
  const rows = Array.isArray(response?.results) ? response.results : [];
  const exactExpectedName = smokeCase.expectedName
    ? rows.some((row) => row.name === smokeCase.expectedName)
    : true;
  const passed = httpStatus === 200 &&
    rows.length >= smokeCase.minResults &&
    elapsedMs < 8000 &&
    exactExpectedName;
  return {
    type: 'search',
    label: `${smokeCase.state} ${smokeCase.query}`,
    status: passed ? 'passed' : 'failed',
    elapsedMs,
    details: {
      httpStatus,
      resultCount: rows.length,
      first: rows[0]
        ? {
          name: rows[0].name,
          county: rows[0].county ?? null,
          support: rows[0].waterReaderSupportStatus,
          acres: Math.round(rows[0].polygonAreaAcres ?? rows[0].surfaceAreaAcres ?? 0),
        }
        : null,
      expectedName: smokeCase.expectedName ?? null,
      exactExpectedName,
    },
  };
}

function assertReadResult(target: WaterbodySearchResult, httpStatus: number, response: WaterReaderReadResponse, elapsedMs: number): SmokeRow {
  const passed = httpStatus === 200 &&
    response?.engineVersion === WATER_READER_ENGINE_VERSION &&
    response?.mapWidth === WATER_READER_APP_SVG_WIDTH &&
    response?.fallbackMessage == null &&
    Boolean(response?.productionSvgResult?.svg) &&
    response?.displayedEntryCount > 0 &&
    response?.waterReaderSupportStatus !== 'not_supported' &&
    elapsedMs < 45000;
  return {
    type: 'read',
    label: `${target.name} (${target.state}${target.county ? `, ${target.county}` : ''})`,
    status: passed ? 'passed' : 'failed',
    elapsedMs,
    details: {
      httpStatus,
      lakeId: target.lakeId,
      expectedEngineVersion: WATER_READER_ENGINE_VERSION,
      actualEngineVersion: response?.engineVersion ?? null,
      cacheStatus: response?.cacheStatus ?? null,
      cacheWriteStatus: response?.cacheWriteStatus ?? null,
      mapWidth: response?.mapWidth ?? null,
      displayedEntryCount: response?.displayedEntryCount ?? null,
      hasSvg: Boolean(response?.productionSvgResult?.svg),
      fallbackMessage: response?.fallbackMessage ?? null,
      supportStatus: response?.waterReaderSupportStatus ?? null,
      operationalDiagnostics: response?.operationalDiagnostics ?? null,
    },
  };
}

async function main() {
  const env = requireEnv(['WATER_READER_TEST_EMAIL', 'WATER_READER_TEST_PASSWORD']);
  const supabaseUrl = supabaseUrlFromEnv();
  const anonKey = anonKeyFromEnv();
  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase URL or anon key. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  }

  const supabase = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.auth.signInWithPassword({
    email: env.WATER_READER_TEST_EMAIL,
    password: env.WATER_READER_TEST_PASSWORD,
  });
  if (error || !data.session) throw new Error(error?.message ?? 'Failed to sign in smoke user');

  const rows: SmokeRow[] = [];
  const readTargets: WaterbodySearchResult[] = [];

  for (const smokeCase of SEARCH_CASES) {
    const search = await invokeEdge<WaterbodySearchResponse>(
      supabaseUrl,
      anonKey,
      data.session.access_token,
      'waterbody-search',
      { state: smokeCase.state, query: smokeCase.query, limit: 16 },
    );
    rows.push(assertSearchResult(smokeCase, search.httpStatus, search.body, search.elapsedMs));
    if (smokeCase.readFirst && search.httpStatus === 200) {
      const target = firstOpenable(search.body.results ?? []);
      if (target) readTargets.push(target);
    }
  }

  for (const target of readTargets) {
    const read = await invokeEdge<WaterReaderReadResponse>(
      supabaseUrl,
      anonKey,
      data.session.access_token,
      'water-reader-read',
      { lakeId: target.lakeId, currentDate: CURRENT_DATE },
    );
    rows.push(assertReadResult(target, read.httpStatus, read.body, read.elapsedMs));
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    expectedEngineVersion: WATER_READER_ENGINE_VERSION,
    currentDate: CURRENT_DATE,
    status: rows.every((row) => row.status === 'passed') ? 'passed' : 'failed',
    rows,
  };
  console.log(JSON.stringify(payload, null, 2));
  if (payload.status !== 'passed') process.exit(1);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
