export const SURFACE_STALE_HOURS = 9;
export const DEPTH_MISMATCH_CYCLES = 2;
export const STATE_VERSION = 1;

const INCIDENTS = ['surfaceStale', 'depthMismatch', 'deliveryFailed'];

export function initialState() {
  return {
    version: STATE_VERSION,
    incidents: Object.fromEntries(INCIDENTS.map((key) => [key, { active: false }])),
    mismatch: { consecutiveCycles: 0, lastSurfaceRun: null },
    github: { seenRunIds: [], records: [] },
    outbox: [],
    alertHistory: [],
    lastWeeklyKey: null,
  };
}

export function normalizeState(raw) {
  const clean = initialState();
  if (!raw || raw.version !== STATE_VERSION) return clean;
  for (const key of INCIDENTS) {
    const incident = raw.incidents?.[key];
    if (incident && typeof incident.active === 'boolean') clean.incidents[key] = { ...incident };
  }
  const count = Number(raw.mismatch?.consecutiveCycles);
  clean.mismatch = {
    consecutiveCycles: Number.isSafeInteger(count) && count >= 0 ? count : 0,
    lastSurfaceRun: typeof raw.mismatch?.lastSurfaceRun === 'string' ? raw.mismatch.lastSurfaceRun : null,
  };
  clean.github.seenRunIds = Array.isArray(raw.github?.seenRunIds)
    ? raw.github.seenRunIds.filter(Number.isSafeInteger).slice(-100) : [];
  clean.github.records = Array.isArray(raw.github?.records)
    ? raw.github.records.filter((item) => item && typeof item === 'object').slice(-40) : [];
  clean.outbox = Array.isArray(raw.outbox)
    ? raw.outbox.filter((item) => item?.id && item?.subject).slice(-20) : [];
  clean.alertHistory = Array.isArray(raw.alertHistory)
    ? raw.alertHistory.filter((item) => item?.at && item?.type).slice(-100) : [];
  clean.lastWeeklyKey = typeof raw.lastWeeklyKey === 'string' ? raw.lastWeeklyKey : null;
  return clean;
}

function parseTime(value) {
  const millis = Date.parse(value);
  return Number.isFinite(millis) ? millis : null;
}

export function surfaceAgeHours(cycle, now = new Date()) {
  const cycleMs = parseTime(cycle);
  return cycleMs == null ? null : (now.getTime() - cycleMs) / 3_600_000;
}

function incidentCopy(state, key) {
  return { ...(state.incidents[key] || { active: false }) };
}

function queueTransition(state, key, active, now, details) {
  const previous = incidentCopy(state, key);
  if (previous.active === active) return;
  const at = now.toISOString();
  const label = {
    surfaceStale: 'SURFACE STALE',
    depthMismatch: 'DEPTH MISMATCH',
    deliveryFailed: 'DELIVERY FAILED',
  }[key];
  const transition = active ? 'OPEN' : 'RECOVERY';
  const id = `lake-map-${key}-${transition.toLowerCase()}-${at}`;
  state.incidents[key] = active
    ? { active: true, openedAt: at, details }
    : { active: false, clearedAt: at, previousOpenedAt: previous.openedAt, details };
  state.outbox.push({
    id,
    type: key,
    transition,
    at,
    subject: active ? `FinFindr Live Lake Map — ${label}` : `FinFindr Live Lake Map — RECOVERY: ${label}`,
    text: active
      ? `${label}\n\n${details}\n\nDetected: ${at}`
      : `RECOVERY — ${label} is back to normal.\n\n${details}\n\nCleared: ${at}`,
  });
  state.outbox = state.outbox.slice(-20);
}

export function clearSkippedDeliveryFalseAlarm(rawState, now = new Date()) {
  const state = normalizeState(rawState);
  const incident = state.incidents.deliveryFailed;
  const alreadySent = state.alertHistory.some((item) => item.type === 'deliveryFalseAlarm');
  const conflictingActiveIncident = incident.active
    && !/concluded (?:skipped|cancelled)\b/i.test(incident.details || '');
  if (alreadySent || conflictingActiveIncident) {
    return { state, cleared: false };
  }
  const at = now.toISOString();
  state.incidents.deliveryFailed = {
    active: false,
    clearedAt: at,
    previousOpenedAt: incident.openedAt,
    details: 'False alarm: a no-op workflow skipped the delivery job; no delivery failure occurred.',
  };
  state.outbox.push({
    id: `lake-map-delivery-false-alarm-recovery-${at}`,
    type: 'deliveryFalseAlarm',
    transition: 'RECOVERY',
    at,
    subject: 'FinFindr Live Lake Map — RECOVERY: DELIVERY FAILED (false alarm)',
    text: [
      'FALSE ALARM RECOVERY — DELIVERY FAILED',
      '',
      'The incident was caused by a no-op workflow whose delivery job was correctly skipped. No publish or delivery failed.',
      '',
      `Cleared: ${at}`,
    ].join('\n'),
  });
  state.outbox = state.outbox.slice(-20);
  return { state, cleared: true };
}

export function evaluateIncidents(rawState, observation, now = new Date()) {
  const state = normalizeState(rawState);
  const age = surfaceAgeHours(observation.surfaceCycle, now);
  if (age == null) throw new Error('surface pointer has no valid NOAA cycle');
  queueTransition(
    state,
    'surfaceStale',
    age > SURFACE_STALE_HOURS,
    now,
    `Surface run ${observation.surfaceRun} uses ${observation.surfaceCycle} (${age.toFixed(1)} hours old; threshold ${SURFACE_STALE_HOURS} hours).`,
  );

  if (!observation.depthEnabled) {
    state.mismatch = { consecutiveCycles: 0, lastSurfaceRun: null };
    queueTransition(state, 'depthMismatch', false, now, 'Temp at depth is disabled.');
  } else if (observation.depthRun === observation.surfaceRun) {
    state.mismatch = { consecutiveCycles: 0, lastSurfaceRun: observation.surfaceRun };
    queueTransition(
      state, 'depthMismatch', false, now,
      `Depth and surface both point to ${observation.surfaceRun}.`,
    );
  } else if (state.mismatch.lastSurfaceRun !== observation.surfaceRun) {
    state.mismatch.consecutiveCycles += 1;
    state.mismatch.lastSurfaceRun = observation.surfaceRun;
    const count = state.mismatch.consecutiveCycles;
    queueTransition(
      state,
      'depthMismatch',
      count >= DEPTH_MISMATCH_CYCLES,
      now,
      `Depth points to ${observation.depthRun || 'no run'} while surface points to ${observation.surfaceRun}; mismatch observed for ${count} consecutive surface cycles.`,
    );
  }

  if (typeof observation.deliveryFailed === 'boolean') {
    queueTransition(
      state,
      'deliveryFailed',
      observation.deliveryFailed,
      now,
      observation.deliveryDetails || (observation.deliveryFailed
        ? 'The workflow public pointer delivery job failed.'
        : 'The latest workflow public pointer delivery job passed.'),
    );
  }
  return state;
}

export function easternMondayMorningKey(now = new Date()) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', weekday: 'short', year: 'numeric', month: '2-digit',
    day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(now).filter((part) => part.type !== 'literal').map((part) => [part.type, part.value]));
  const hour = Number(parts.hour);
  if (parts.weekday !== 'Mon' || hour < 9 || hour >= 12) return null;
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function median(values) {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function lagMinutes(start, end) {
  const a = parseTime(start), b = parseTime(end);
  return a == null || b == null ? null : Math.max(0, (b - a) / 60_000);
}

export function weeklySummary(rawState, now = new Date()) {
  const state = normalizeState(rawState);
  const since = now.getTime() - 7 * 24 * 3_600_000;
  const records = state.github.records.filter((record) => (parseTime(record.completedAt) || 0) >= since);
  const byCycle = new Map();
  for (const record of records) {
    if (record.cycle) byCycle.set(record.cycle, record);
  }
  const cycles = [...byCycle.values()];
  const sourceCounts = { thredds: 0, nodd: 0, unknown: 0 };
  const depthSourceCounts = { thredds: 0, nodd: 0, unknown: 0 };
  let retries = 0, fallbacks = 0;
  const surfaceLags = [], depthLags = [];
  for (const record of cycles) {
    sourceCounts[record.surfaceSource in sourceCounts ? record.surfaceSource : 'unknown'] += 1;
    depthSourceCounts[record.depthSource in depthSourceCounts ? record.depthSource : 'unknown'] += 1;
    retries += Number(record.retryCount || 0);
    fallbacks += Number(Boolean(record.surfaceFallback)) + Number(Boolean(record.depthFallback));
    const surfaceLag = lagMinutes(record.completeObservedAt, record.surfacePublishedAt);
    const depthLag = lagMinutes(record.completeObservedAt, record.depthPublishedAt);
    if (surfaceLag != null) surfaceLags.push(surfaceLag);
    if (depthLag != null) depthLags.push(depthLag);
  }
  const alerts = state.alertHistory.filter((item) => (parseTime(item.at) || 0) >= since);
  const fmtLag = (values) => values.length
    ? `median ${median(values).toFixed(1)} min; worst ${Math.max(...values).toFixed(1)} min`
    : 'unavailable';
  const text = [
    'Production weekly summary',
    `Window ending ${now.toISOString()}`,
    `Cycles published vs expected: ${cycles.length}/28`,
    `Surface sources: THREDDS ${sourceCounts.thredds}, NODD ${sourceCounts.nodd}, unknown ${sourceCounts.unknown}`,
    `Depth sources: THREDDS ${depthSourceCounts.thredds}, NODD ${depthSourceCounts.nodd}, unknown ${depthSourceCounts.unknown}`,
    `Retries: ${retries}; fallbacks: ${fallbacks}`,
    `Surface lag from first observed NOAA completion: ${fmtLag(surfaceLags)}`,
    `Depth lag from first observed NOAA completion: ${fmtLag(depthLags)}`,
    `Alert transitions: ${alerts.length}`,
    ...alerts.map((item) => `- ${item.at} ${item.transition} ${item.type}`),
  ].join('\n');
  return { cycles: cycles.length, expected: 28, sourceCounts, depthSourceCounts, retries, fallbacks, alerts, text };
}

function timestampFor(log, pattern) {
  const line = log.split('\n').find((entry) => pattern.test(entry));
  return line?.match(/\b(20\d\d-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z)\b/)?.[1] || null;
}

export function parseWorkflowMetrics(run, buildLog = '', depthLog = '') {
  const cycle = buildLog.match(/NOAA (20\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ) release ready/)?.[1] || null;
  const surfaceChoice = buildLog.match(/Surface source choice: (thredds|nodd)\b/i)?.[1]?.toLowerCase();
  const surfaceFallback = /Rebuilding ALL surface frames from nodd/i.test(buildLog);
  const depthFallback = /Depth fallback completed from .*NODD/i.test(depthLog);
  const depthSource = /Depth source for all four models:.*NODD/i.test(depthLog) || depthFallback
    ? 'nodd' : /Depth source for all four models:.*THREDDS/i.test(depthLog) ? 'thredds' : 'unknown';
  const retryLines = `${buildLog}\n${depthLog}`.split('\n').filter((line) => /Retrying thredds/i.test(line));
  const retryTypes = {};
  for (const line of retryLines) {
    const type = line.match(/after ([A-Za-z]+)(?: \(HTTP (\d+)\))?/i);
    const key = type?.[2] ? `http_${type[2]}` : (type?.[1] || 'unknown').toLowerCase();
    retryTypes[key] = (retryTypes[key] || 0) + 1;
  }
  return {
    runId: run.id,
    event: run.event,
    completedAt: run.updated_at,
    cycle,
    completeObservedAt: timestampFor(buildLog, /NOAA .* release ready/),
    surfacePublishedAt: timestampFor(buildLog, /Uploaded run .* pointed latest\.json/),
    depthPublishedAt: timestampFor(depthLog, /Uploaded complete depth run .*latest\.json last/),
    surfaceSource: surfaceFallback ? 'nodd' : (surfaceChoice || (/THREDDS/i.test(buildLog) ? 'thredds' : 'unknown')),
    depthSource,
    surfaceFallback,
    depthFallback,
    retryCount: retryLines.length,
    retryTypes,
  };
}
