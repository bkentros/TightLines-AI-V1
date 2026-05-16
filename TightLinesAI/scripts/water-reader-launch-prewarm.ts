import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import {
  WATER_READER_APP_SVG_WIDTH,
  WATER_READER_ENGINE_VERSION,
  type WaterReaderReadResponse,
} from '../supabase/functions/_shared/waterReaderRead/contracts.ts';
import { generateWaterReaderHeavyRead } from './water-reader-heavy-generator-server.ts';

interface LaunchTarget {
  label: string;
  state: string;
  query: string;
  expectedName?: string;
  county?: string;
  lakeId?: string;
}

interface SearchRow {
  lake_id: string;
  name: string;
  state: string;
  county: string | null;
  water_reader_support_status: string | null;
  has_polygon_geometry?: boolean | null;
}

const OUT = 'tmp/water-reader-launch-prewarm/latest.json';

const LAUNCH_CORE_TARGETS: LaunchTarget[] = [
  { label: 'Glen Lake, MI', state: 'MI', query: 'glen lake', expectedName: 'Glen Lake', county: 'Leelanau' },
  { label: 'Van Norman Lake, MI', state: 'MI', query: 'van norman', expectedName: 'Van Norman Lake' },
  { label: 'Mullett Lake, MI', state: 'MI', query: 'mullett', expectedName: 'Mullett Lake' },
  { label: 'Burt Lake, MI', state: 'MI', query: 'burt lake', expectedName: 'Burt Lake' },
  { label: 'Houghton Lake, MI', state: 'MI', query: 'houghton lake', expectedName: 'Houghton Lake' },
  { label: 'Higgins Lake, MI', state: 'MI', query: 'higgins lake', expectedName: 'Higgins Lake' },
  { label: 'Torch Lake, MI', state: 'MI', query: 'torch lake', expectedName: 'Torch Lake' },
  { label: 'Lake Charlevoix, MI', state: 'MI', query: 'lake charlevoix', expectedName: 'Lake Charlevoix' },
  { label: 'Elk Lake, MI', state: 'MI', query: 'elk lake', expectedName: 'Elk Lake' },
  { label: 'Crystal Lake, MI', state: 'MI', query: 'crystal lake', expectedName: 'Crystal Lake', county: 'Benzie' },
  { label: 'Walloon Lake, MI', state: 'MI', query: 'walloon lake', expectedName: 'Walloon Lake' },
  {
    label: 'Lake St. Clair, MI',
    state: 'MI',
    query: 'lake saint clair',
    expectedName: 'Lake Saint Clair',
    lakeId: '65cda1cd-8c4e-4ebd-9ff6-f0485bf9ab63',
  },
  {
    label: 'Lake Okeechobee, FL',
    state: 'FL',
    query: 'okeechobee',
    expectedName: 'Lake Okeechobee',
    lakeId: 'e7cf320b-1f49-4694-82cd-92aa849ffbb2',
  },
  { label: 'Lake Apopka, FL', state: 'FL', query: 'lake apopka', expectedName: 'Lake Apopka' },
  { label: 'Lake Tohopekaliga, FL', state: 'FL', query: 'tohopekaliga' },
  {
    label: 'Moosehead Lake, ME',
    state: 'ME',
    query: 'moosehead',
    expectedName: 'Moosehead Lake',
    lakeId: 'e7ce3879-a6eb-4c7c-908e-75ab3a724fed',
  },
  { label: 'Lake Minnetonka, MN', state: 'MN', query: 'lake minnetonka', expectedName: 'Lake Minnetonka' },
  { label: 'Mille Lacs Lake, MN', state: 'MN', query: 'mille lacs' },
  {
    label: 'Lake Fork Reservoir, TX',
    state: 'TX',
    query: 'lake fork',
    expectedName: 'Lake Fork Reservoir',
    lakeId: '16d0b9d0-1eb3-463d-b4c1-7d96b79620da',
  },
  {
    label: 'Cayuga Lake, NY',
    state: 'NY',
    query: 'cayuga lake',
    expectedName: 'Cayuga Lake',
    lakeId: 'c836d66f-703b-4ccb-b1ff-aacf43a2b7e5',
  },
];

const STRESS_TARGETS: LaunchTarget[] = [
  {
    label: 'Toledo Bend Reservoir, TX/LA',
    state: 'TX',
    query: 'toledo bend',
    expectedName: 'Toledo Bend Reservoir',
    lakeId: '6381fb36-3b37-4335-95e0-6076e8f7709c',
  },
];

function requireEnv(names: string[]): Record<string, string> {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length > 0) throw new Error(`Missing required env: ${missing.join(', ')}`);
  return Object.fromEntries(names.map((name) => [name, process.env[name] as string]));
}

function arg(name: string): string | null {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] ?? null : null;
}

function hasFlag(name: string): boolean {
  return process.argv.includes(name);
}

function parseDate(raw: string | null): string {
  const value = raw ?? new Date().toISOString().slice(0, 10);
  const date = new Date(value.includes('T') ? value : `${value}T12:00:00.000Z`);
  if (!Number.isFinite(date.getTime())) throw new Error(`Invalid date: ${value}`);
  return date.toISOString();
}

function customTargets(): LaunchTarget[] {
  const lakeValues = process.argv
    .map((value, index) => value === '--lake' ? process.argv[index + 1] : null)
    .filter((value): value is string => Boolean(value));
  const lakeTargets = lakeValues.map((value) => {
    const [stateRaw, queryRaw, expectedNameRaw, countyRaw] = value.split(':');
    const state = stateRaw?.trim().toUpperCase();
    const query = queryRaw?.trim();
    if (!state || !query) {
      throw new Error(`Invalid --lake "${value}". Use STATE:query[:expected name[:county]].`);
    }
    return {
      label: expectedNameRaw?.trim() || `${query}, ${state}`,
      state,
      query,
      expectedName: expectedNameRaw?.trim() || undefined,
      county: countyRaw?.trim() || undefined,
    };
  });
  const idTargets = process.argv
    .map((value, index) => value === '--lake-id' ? process.argv[index + 1] : null)
    .filter((value): value is string => Boolean(value))
    .map((value) => {
      const [lakeIdRaw, labelRaw] = value.split(':');
      const lakeId = lakeIdRaw?.trim();
      if (!lakeId) throw new Error(`Invalid --lake-id "${value}". Use UUID[:label].`);
      const label = labelRaw?.trim() || lakeId;
      return { label, state: '', query: label, lakeId };
    });
  return [...lakeTargets, ...idTargets];
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/<!DOCTYPE html>[\s\S]*/i, 'html_error_response')
    .slice(0, 500);
}

function retryablePrewarmError(error: unknown): boolean {
  const message = errorMessage(error).toLowerCase();
  return (
    message.includes('520') ||
    message.includes('521') ||
    message.includes('522') ||
    message.includes('html_error_response') ||
    message.includes('timeout') ||
    message.includes('timed out') ||
    message.includes('fetch failed') ||
    message.includes('network') ||
    message.includes('temporarily')
  );
}

async function withRetry<T>(label: string, task: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      if (attempt === 3 || !retryablePrewarmError(error)) break;
      await sleep(2_000 * attempt);
    }
  }
  throw new Error(`${label}:${errorMessage(lastError)}`);
}

function chooseTarget(rows: SearchRow[], target: LaunchTarget): SearchRow | null {
  const county = target.county?.toLowerCase();
  const expected = target.expectedName?.toLowerCase();
  const query = target.query.toLowerCase();
  const openable = rows.filter((row) => row.water_reader_support_status !== 'not_supported');
  return (
    openable.find((row) =>
      expected &&
      row.name.toLowerCase() === expected &&
      (!county || row.county?.toLowerCase() === county)
    ) ??
    openable.find((row) =>
      expected &&
      row.name.toLowerCase().includes(expected) &&
      (!county || row.county?.toLowerCase() === county)
    ) ??
    openable.find((row) =>
      row.name.toLowerCase().includes(query) &&
      (!county || row.county?.toLowerCase() === county)
    ) ??
    openable[0] ??
    null
  );
}

async function searchTarget(supabase: any, target: LaunchTarget): Promise<SearchRow> {
  if (target.lakeId) {
    const { data, error } = await supabase
      .from('waterbody_index')
      .select('id, canonical_name, state_code, county_name')
      .eq('id', target.lakeId)
      .maybeSingle();
    if (error) throw new Error(`lake_id_lookup_failed:${error.message}`);
    if (!data?.id) throw new Error(`lake_id_not_found:${target.lakeId}`);
    return {
      lake_id: data.id,
      name: data.canonical_name,
      state: data.state_code,
      county: data.county_name ?? null,
      water_reader_support_status: 'limited',
    };
  }

  const { data, error } = await supabase.rpc('search_waterbodies', {
    query_text: target.query,
    state_filter: target.state,
    result_limit: 12,
  });
  if (error) throw new Error(`search_failed:${error.message}`);
  const rows = Array.isArray(data) ? data as SearchRow[] : [];
  const selected = chooseTarget(rows, target);
  if (!selected) throw new Error('no_supported_search_result');
  return selected;
}

function summarizeRead(read: WaterReaderReadResponse, elapsedMs: number) {
  const passed = Boolean(
    read.productionSvgResult?.svg &&
    read.displayedEntryCount > 0 &&
    read.fallbackMessage == null &&
    (read.cacheStatus === 'hit' || read.cacheWriteStatus === 'stored'),
  );
  return {
    status: passed ? 'passed' : 'failed',
    elapsedMs,
    cacheStatus: read.cacheStatus ?? null,
    cacheWriteStatus: read.cacheWriteStatus ?? null,
    displayedEntryCount: read.displayedEntryCount,
    retainedEntryCount: read.retainedEntryCount,
    hasSvg: Boolean(read.productionSvgResult?.svg),
    fallbackMessage: read.fallbackMessage,
    originalVertexCount: read.originalVertexCount ?? null,
    runtimeVertexCount: read.runtimeVertexCount ?? null,
    runtimeInteriorRingCount: read.runtimeInteriorRingCount ?? null,
    timings: read.timings ?? null,
  };
}

async function main() {
  mkdirSync(dirname(OUT), { recursive: true });
  const env = requireEnv(['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']);
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  const date = parseDate(arg('--date'));
  const limit = Math.max(1, Math.min(100, Number(arg('--limit') ?? 100)));
  const targets = [
    ...(hasFlag('--launch-core') ? LAUNCH_CORE_TARGETS : []),
    ...(hasFlag('--stress') ? STRESS_TARGETS : []),
    ...customTargets(),
  ].slice(0, limit);
  if (targets.length === 0) {
    throw new Error('No targets. Use --launch-core, --stress, --lake STATE:query[:expected name[:county]], or --lake-id UUID[:label].');
  }

  const rows = [];
  for (const target of targets) {
    const started = Date.now();
    try {
      const selected = await withRetry('search', () => searchTarget(supabase, target));
      const read = await withRetry('generate', () => generateWaterReaderHeavyRead({
        lakeId: selected.lake_id,
        currentDate: date,
        mapWidth: WATER_READER_APP_SVG_WIDTH,
        engineVersion: WATER_READER_ENGINE_VERSION,
      }));
      rows.push({
        requested: target,
        selected: {
          lakeId: selected.lake_id,
          name: selected.name,
          state: selected.state,
          county: selected.county,
          supportStatus: selected.water_reader_support_status,
        },
        ...summarizeRead(read, Date.now() - started),
      });
    } catch (error) {
      rows.push({
        requested: target,
        selected: null,
        status: 'failed',
        elapsedMs: Date.now() - started,
        error: errorMessage(error),
      });
    }
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    date,
    engineVersion: WATER_READER_ENGINE_VERSION,
    mapWidth: WATER_READER_APP_SVG_WIDTH,
    status: rows.every((row) => row.status === 'passed') ? 'passed' : 'failed',
    passed: rows.filter((row) => row.status === 'passed').length,
    failed: rows.filter((row) => row.status === 'failed').length,
    rows,
  };
  writeFileSync(OUT, JSON.stringify(payload, null, 2));
  console.log(JSON.stringify(payload, null, 2));
  if (payload.status !== 'passed') process.exit(1);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
