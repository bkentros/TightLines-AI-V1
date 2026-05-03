/**
 * Client-side fishing log analytics (descriptive aggregates only).
 *
 * Loads up to MAX_ANALYTICS_CATCH_ROWS catch rows ordered by newest first
 * (`created_at` desc). When capped, `rowCapHit` is true — all metrics reflect
 * only that recent window, not necessarily the full history.
 */

import { supabase } from './supabase';

export const MAX_ANALYTICS_CATCH_ROWS = 5000;
const FETCH_PAGE_SIZE = 500;

export type GearMode = 'lure' | 'fly' | 'bait';

export type DatePreset = 'all' | '7d' | '30d' | '365d';

export type EntryModeFilter = 'all' | 'ai' | 'manual';

export interface FishingAnalyticsFilter {
  datePreset: DatePreset;
  /** Case-insensitive substring match on species text */
  speciesQuery: string;
  gearMode: 'all' | GearMode;
  entryMode: EntryModeFilter;
}

export function defaultFishingAnalyticsFilter(): FishingAnalyticsFilter {
  return {
    datePreset: 'all',
    speciesQuery: '',
    gearMode: 'all',
    entryMode: 'all',
  };
}

export interface AnalyticsSummary {
  catchCount: number;
  /** Sum of weight × quantity for rows with a measured weight */
  totalWeightLb: number;
  /** Fish count with a measured weight (sums quantities on qualifying rows) */
  weightSampleCount: number;
  averageWeightLb: number | null;
  /** Sum of length × quantity for rows with a measured length */
  totalLengthIn: number;
  /** Fish count with a measured length */
  lengthSampleCount: number;
  averageLengthIn: number | null;
  biggestLengthIn: number | null;
  biggestWeightLb: number | null;
  biggestLengthCatchId: string | null;
  biggestWeightCatchId: string | null;
  biggestLengthSpeciesLabel: string | null;
  biggestWeightSpeciesLabel: string | null;
}

export interface BreakdownMeasurementsRow {
  totalWeightLb: number;
  weightSampleCount: number;
  averageWeightLb: number | null;
  totalLengthIn: number;
  lengthSampleCount: number;
  averageLengthIn: number | null;
  biggestLengthIn: number | null;
  biggestWeightLb: number | null;
}

export interface SpeciesBreakdownRow extends BreakdownMeasurementsRow {
  speciesKey: string;
  speciesLabel: string;
  catchCount: number;
}

export interface TackleBreakdownRow extends BreakdownMeasurementsRow {
  gearMode: GearMode;
  tackleKey: string;
  tackleLabel: string;
  catchCount: number;
}

export interface WaterbodyBreakdownRow extends BreakdownMeasurementsRow {
  waterbodyLabel: string;
  catchCount: number;
}

export interface GearBreakdownRow {
  gearMode: GearMode;
  catchCount: number;
}

export interface FishingAnalyticsResult {
  summary: AnalyticsSummary;
  speciesBreakdown: SpeciesBreakdownRow[];
  tackleRankings: TackleBreakdownRow[];
  waterbodyBreakdown: WaterbodyBreakdownRow[];
  gearBreakdown: GearBreakdownRow[];
  rowCapHit: boolean;
  /** Rows returned from DB before filters (newest-first window; see rowCapHit) */
  totalCatchRowsLoaded: number;
  /** Rows matching current filters */
  matchingCatchRows: number;
}

export type FishingAnalyticsResponse =
  | { ok: true; data: FishingAnalyticsResult }
  | { ok: false; error: string };

interface SessionEmbed {
  date: string | null;
  start_time: string | null;
  body_of_water: string | null;
  region_name: string | null;
  ai_session_id: string | null;
}

interface RawCatchRow {
  id: string;
  species: string;
  length_in: number | null;
  weight_lbs: number | null;
  quantity: number | null;
  lure_name: string | null;
  lure_type: string | null;
  caught_at: string | null;
  created_at: string;
  session_id: string;
  sessions: SessionEmbed | SessionEmbed[] | null;
}

function normalizeSession(embed: RawCatchRow['sessions']): SessionEmbed | null {
  if (!embed) return null;
  return Array.isArray(embed) ? embed[0] ?? null : embed;
}

export function inferGearMode(row: RawCatchRow): GearMode {
  const lt = (row.lure_type ?? '').toLowerCase();
  const ln = (row.lure_name ?? '').toLowerCase();
  if (
    /\b(fly|streamer|nymph|dry\s*fly|wet\s*fly)\b/.test(lt) ||
    /\b(fly|streamer|nymph)\b/.test(ln)
  ) {
    return 'fly';
  }
  if (/\b(bait|worm|live\s*bait|leech)\b/.test(lt) || /\b(bait|worm)\b/.test(ln)) {
    return 'bait';
  }
  return 'lure';
}

function waterbodyLabel(row: RawCatchRow): string {
  const s = normalizeSession(row.sessions);
  const body = s?.body_of_water?.trim();
  const region = s?.region_name?.trim();
  if (body && region && body.toLowerCase() !== region.toLowerCase()) {
    return `${body} · ${region}`;
  }
  return body || region || 'Unknown place';
}

function tackleKeyAndLabel(row: RawCatchRow): { key: string; label: string } {
  const name = (row.lure_name ?? '').trim() || 'Unknown tackle';
  const typ = (row.lure_type ?? '').trim();
  const key = `${name}|${typ}`.toLowerCase();
  const label = typ ? `${name} (${typ})` : name;
  return { key, label };
}

function speciesKey(raw: string): string {
  return raw.trim().toLowerCase();
}

function rowQty(row: RawCatchRow): number {
  const q = row.quantity;
  if (q == null || !Number.isFinite(Number(q)) || Number(q) < 1) return 1;
  return Math.floor(Number(q));
}

function rowEffectiveMs(row: RawCatchRow): number {
  if (row.caught_at) return new Date(row.caught_at).getTime();
  const s = normalizeSession(row.sessions);
  if (s?.start_time) return new Date(s.start_time).getTime();
  if (s?.date) return new Date(`${s.date}T12:00:00Z`).getTime();
  return new Date(row.created_at).getTime();
}

function passesDatePreset(row: RawCatchRow, preset: DatePreset): boolean {
  if (preset === 'all') return true;
  const days = preset === '7d' ? 7 : preset === '30d' ? 30 : 365;
  const cutoff = Date.now() - days * 86400000;
  return rowEffectiveMs(row) >= cutoff;
}

function passesSpecies(row: RawCatchRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (row.species ?? '').toLowerCase().includes(q);
}

function passesEntryMode(row: RawCatchRow, mode: EntryModeFilter): boolean {
  if (mode === 'all') return true;
  const s = normalizeSession(row.sessions);
  const ai = s?.ai_session_id != null;
  return mode === 'ai' ? ai : !ai;
}

function createAggAcc() {
  return {
    catchCount: 0,
    totalWeightLb: 0,
    weightSampleCount: 0,
    totalLengthIn: 0,
    lengthSampleCount: 0,
    biggestLengthIn: null as number | null,
    biggestWeightLb: null as number | null,
  };
}

type AggAcc = ReturnType<typeof createAggAcc>;

function ingestMeasurements(acc: AggAcc, row: RawCatchRow, qty: number): void {
  acc.catchCount += qty;
  const w = row.weight_lbs;
  if (w != null && Number.isFinite(Number(w))) {
    const ww = Number(w);
    acc.totalWeightLb += ww * qty;
    acc.weightSampleCount += qty;
    acc.biggestWeightLb =
      acc.biggestWeightLb == null ? ww : Math.max(acc.biggestWeightLb, ww);
  }
  const len = row.length_in;
  if (len != null && Number.isFinite(Number(len))) {
    const ln = Number(len);
    acc.totalLengthIn += ln * qty;
    acc.lengthSampleCount += qty;
    acc.biggestLengthIn =
      acc.biggestLengthIn == null ? ln : Math.max(acc.biggestLengthIn, ln);
  }
}

function finalizeMeasurements(acc: AggAcc): BreakdownMeasurementsRow {
  return {
    totalWeightLb: acc.totalWeightLb,
    weightSampleCount: acc.weightSampleCount,
    averageWeightLb:
      acc.weightSampleCount > 0 ? acc.totalWeightLb / acc.weightSampleCount : null,
    totalLengthIn: acc.totalLengthIn,
    lengthSampleCount: acc.lengthSampleCount,
    averageLengthIn:
      acc.lengthSampleCount > 0 ? acc.totalLengthIn / acc.lengthSampleCount : null,
    biggestLengthIn: acc.biggestLengthIn,
    biggestWeightLb: acc.biggestWeightLb,
  };
}

async function loadCatchRows(): Promise<{ rows: RawCatchRow[]; rowCapHit: boolean; error?: string }> {
  const rows: RawCatchRow[] = [];
  let rowCapHit = false;
  let offset = 0;

  while (rows.length < MAX_ANALYTICS_CATCH_ROWS) {
    const { data, error } = await supabase
      .from('catches')
      .select(
        `
        id,
        species,
        length_in,
        weight_lbs,
        quantity,
        lure_name,
        lure_type,
        caught_at,
        created_at,
        session_id,
        sessions (
          date,
          start_time,
          body_of_water,
          region_name,
          ai_session_id
        )
      `,
      )
      .order('created_at', { ascending: false })
      .range(offset, offset + FETCH_PAGE_SIZE - 1);

    if (error) {
      return { rows: [], rowCapHit: false, error: error.message };
    }

    const batch = (data ?? []) as RawCatchRow[];
    if (batch.length === 0) break;

    rows.push(...batch);
    offset += batch.length;

    if (batch.length < FETCH_PAGE_SIZE) break;

    if (rows.length >= MAX_ANALYTICS_CATCH_ROWS) {
      rowCapHit = true;
      rows.length = MAX_ANALYTICS_CATCH_ROWS;
      break;
    }
  }

  return { rows, rowCapHit };
}

function filterRows(rows: RawCatchRow[], filter: FishingAnalyticsFilter): RawCatchRow[] {
  return rows.filter((row) => {
    if (!passesDatePreset(row, filter.datePreset)) return false;
    if (!passesSpecies(row, filter.speciesQuery)) return false;
    if (!passesEntryMode(row, filter.entryMode)) return false;
    if (filter.gearMode !== 'all' && inferGearMode(row) !== filter.gearMode) return false;
    return true;
  });
}

function computeAnalytics(
  rows: RawCatchRow[],
  rowCapHit: boolean,
  totalCatchRowsLoaded: number,
): FishingAnalyticsResult {
  const summaryAgg = createAggAcc();
  let biggestLenRow: RawCatchRow | null = null;
  let biggestWtRow: RawCatchRow | null = null;

  const speciesAgg = new Map<string, { label: string; acc: AggAcc }>();
  const gearCounts = new Map<GearMode, number>();
  const tackleAgg = new Map<
    string,
    { gearMode: GearMode; tackleLabel: string; acc: AggAcc }
  >();
  const wbAgg = new Map<string, AggAcc>();

  for (const row of rows) {
    const qty = rowQty(row);

    ingestMeasurements(summaryAgg, row, qty);

    const w = row.weight_lbs;
    if (w != null && Number.isFinite(Number(w))) {
      const ww = Number(w);
      const bw =
        biggestWtRow?.weight_lbs != null ? Number(biggestWtRow.weight_lbs) : -Infinity;
      if (
        biggestWtRow == null ||
        ww > bw ||
        (ww === bw &&
          String(row.caught_at ?? row.created_at) >
            String(biggestWtRow.caught_at ?? biggestWtRow.created_at))
      ) {
        biggestWtRow = row;
      }
    }

    const len = row.length_in;
    if (len != null && Number.isFinite(Number(len))) {
      const ln = Number(len);
      const bl =
        biggestLenRow?.length_in != null ? Number(biggestLenRow.length_in) : -Infinity;
      if (
        biggestLenRow == null ||
        ln > bl ||
        (ln === bl &&
          String(row.caught_at ?? row.created_at) >
            String(biggestLenRow.caught_at ?? biggestLenRow.created_at))
      ) {
        biggestLenRow = row;
      }
    }

    const sk = speciesKey(row.species ?? '');
    const label = (row.species ?? 'Unknown').trim() || 'Unknown';
    let sp = speciesAgg.get(sk);
    if (!sp) {
      sp = { label, acc: createAggAcc() };
      speciesAgg.set(sk, sp);
    }
    ingestMeasurements(sp.acc, row, qty);

    const gm = inferGearMode(row);
    gearCounts.set(gm, (gearCounts.get(gm) ?? 0) + qty);

    const tk = tackleKeyAndLabel(row);
    const tMapKey = `${gm}:${tk.key}`;
    let tg = tackleAgg.get(tMapKey);
    if (!tg) {
      tg = { gearMode: gm, tackleLabel: tk.label, acc: createAggAcc() };
      tackleAgg.set(tMapKey, tg);
    }
    ingestMeasurements(tg.acc, row, qty);

    const wb = waterbodyLabel(row);
    let wbacc = wbAgg.get(wb);
    if (!wbacc) {
      wbacc = createAggAcc();
      wbAgg.set(wb, wbacc);
    }
    ingestMeasurements(wbacc, row, qty);
  }

  const fm = finalizeMeasurements;

  const summary: AnalyticsSummary = {
    catchCount: summaryAgg.catchCount,
    totalWeightLb: summaryAgg.totalWeightLb,
    weightSampleCount: summaryAgg.weightSampleCount,
    averageWeightLb:
      summaryAgg.weightSampleCount > 0
        ? summaryAgg.totalWeightLb / summaryAgg.weightSampleCount
        : null,
    totalLengthIn: summaryAgg.totalLengthIn,
    lengthSampleCount: summaryAgg.lengthSampleCount,
    averageLengthIn:
      summaryAgg.lengthSampleCount > 0
        ? summaryAgg.totalLengthIn / summaryAgg.lengthSampleCount
        : null,
    biggestLengthIn: biggestLenRow?.length_in != null ? Number(biggestLenRow.length_in) : null,
    biggestWeightLb:
      biggestWtRow?.weight_lbs != null ? Number(biggestWtRow.weight_lbs) : null,
    biggestLengthCatchId: biggestLenRow?.id ?? null,
    biggestWeightCatchId: biggestWtRow?.id ?? null,
    biggestLengthSpeciesLabel: biggestLenRow
      ? (biggestLenRow.species ?? '').trim() || null
      : null,
    biggestWeightSpeciesLabel: biggestWtRow
      ? (biggestWtRow.species ?? '').trim() || null
      : null,
  };

  const speciesBreakdown: SpeciesBreakdownRow[] = [...speciesAgg.entries()]
    .map(([key, v]) => ({
      speciesKey: key,
      speciesLabel: v.label,
      catchCount: v.acc.catchCount,
      ...fm(v.acc),
    }))
    .sort((a, b) => b.catchCount - a.catchCount);

  const gearBreakdown: GearBreakdownRow[] = (['lure', 'fly', 'bait'] as GearMode[]).map(
    (g) => ({
      gearMode: g,
      catchCount: gearCounts.get(g) ?? 0,
    }),
  );

  const tackleRankings: TackleBreakdownRow[] = [...tackleAgg.entries()]
    .map(([compoundKey, v]) => ({
      gearMode: v.gearMode,
      tackleKey: compoundKey,
      tackleLabel: v.tackleLabel,
      catchCount: v.acc.catchCount,
      ...fm(v.acc),
    }))
    .sort((a, b) => b.catchCount - a.catchCount)
    .slice(0, 50);

  const waterbodyBreakdown: WaterbodyBreakdownRow[] = [...wbAgg.entries()]
    .map(([waterbodyLabel, acc]) => ({
      waterbodyLabel,
      catchCount: acc.catchCount,
      ...fm(acc),
    }))
    .sort((a, b) => b.catchCount - a.catchCount);

  return {
    summary,
    speciesBreakdown,
    tackleRankings,
    waterbodyBreakdown,
    gearBreakdown,
    rowCapHit,
    totalCatchRowsLoaded,
    matchingCatchRows: rows.length,
  };
}

/**
 * Loads newest catch rows first (see module doc). Applies filters in memory.
 */
export async function getFishingAnalytics(
  filter: FishingAnalyticsFilter,
): Promise<FishingAnalyticsResponse> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return { ok: false, error: 'Sign in is required to load analytics.' };
  }

  const loaded = await loadCatchRows();
  if (loaded.error) {
    return { ok: false, error: loaded.error };
  }

  const filtered = filterRows(loaded.rows, filter);
  const data = computeAnalytics(filtered, loaded.rowCapHit, loaded.rows.length);
  return { ok: true, data };
}
