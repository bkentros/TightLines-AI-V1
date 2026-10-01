export const OBSERVATION_REFRESH_MS = 5 * 60 * 1000;
export const MODEL_REFRESH_CHECK_MS = 10 * 60 * 1000;

/** Exact model hour for "Now"; the renderer interpolates between hourly fields. */
export function currentForecastHour(startMs, maxHour, now = Date.now(), sample = false) {
  if (sample) return 0;
  const hour = (now - startMs) / 3600e3;
  if (!Number.isFinite(hour)) return 0;
  return Math.max(0, Math.min(maxHour, hour));
}

function cycleLabel(manifest) {
  if (!manifest || typeof manifest === 'string') return '';
  const cycles = [...new Set((manifest.sources?.temp || []).map((source) => source.cycle).filter(Boolean))].sort();
  if (!cycles.length && manifest.cycle) cycles.push(manifest.cycle);
  const hour = (iso) => `${String(new Date(iso).getUTCHours()).padStart(2, '0')}Z`;
  if (cycles.length === 1) return `${hour(cycles[0])} cycle`;
  if (cycles.length > 1) return `${hour(cycles[0])}–${hour(cycles[cycles.length - 1])} cycles`;
  return '';
}

export function mapFreshnessText(manifest, now = Date.now()) {
  const generatedAt = typeof manifest === 'string' ? manifest : manifest?.generatedAt;
  const generated = Date.parse(generatedAt);
  const cycle = cycleLabel(manifest);
  const prefix = `NOAA surface model${cycle ? ` · ${cycle}` : ''}`;
  if (!Number.isFinite(generated)) return prefix;
  const minutes = Math.max(0, Math.round((now - generated) / 60000));
  if (minutes < 2) return `${prefix} · map refreshed just now`;
  if (minutes < 60) return `${prefix} · map refreshed ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${prefix} · map refreshed ${hours}h ago`;
  return `${prefix} · map refreshed ${Math.floor(hours / 24)}d ago`;
}

export function hasNewPublishedRun(activeRun, latest) {
  return typeof activeRun === 'string' && activeRun.length > 0 &&
    typeof latest?.run === 'string' && latest.run.length > 0 &&
    latest.run !== activeRun;
}
