import assert from 'node:assert/strict';
import test from 'node:test';

import { OBS_CACHE_SECONDS } from '../gate/buoys.js';
import {
  currentForecastHour,
  hasNewPublishedRun,
  mapFreshnessText,
  MODEL_REFRESH_CHECK_MS,
  OBSERVATION_REFRESH_MS,
} from '../src/engine/freshness.js';

test('Now uses fractional forecast time instead of rounding to an hourly frame', () => {
  const start = Date.parse('2026-10-01T12:00:00Z');
  assert.equal(currentForecastHour(start, 120, Date.parse('2026-10-01T13:30:00Z')), 1.5);
  assert.equal(currentForecastHour(start, 120, Date.parse('2026-09-30T13:30:00Z')), 0);
  assert.equal(currentForecastHour(start, 120, Date.parse('2026-10-08T13:30:00Z')), 120);
  assert.equal(currentForecastHour(start, 120, Date.parse('2026-10-01T13:30:00Z'), true), 0);
});

test('map freshness labels identify NOAA modeled data and its publish age', () => {
  const now = Date.parse('2026-10-01T15:00:00Z');
  assert.equal(mapFreshnessText('2026-10-01T14:59:00Z', now), 'NOAA surface model · map refreshed just now');
  assert.equal(mapFreshnessText('2026-10-01T14:31:00Z', now), 'NOAA surface model · map refreshed 29 min ago');
  assert.equal(mapFreshnessText('2026-10-01T12:15:00Z', now), 'NOAA surface model · map refreshed 2h ago');
  assert.equal(mapFreshnessText('bad date', now), 'NOAA surface model');
  assert.equal(mapFreshnessText({
    generatedAt: '2026-10-01T14:31:00Z',
    sources: { temp: [{ cycle: '2026-10-01T06:00:00Z' }, { cycle: '2026-10-01T12:00:00Z' }] },
  }, now), 'NOAA surface model · 06Z–12Z cycles · map refreshed 29 min ago');
});

test('an open map reloads only for a different complete published run', () => {
  assert.equal(hasNewPublishedRun('run-a', { run: 'run-b' }), true);
  assert.equal(hasNewPublishedRun('run-a', { run: 'run-a' }), false);
  assert.equal(hasNewPublishedRun('run-a', null), false);
  assert.equal(hasNewPublishedRun(null, { run: 'run-b' }), false);
});

test('observations refresh faster than model/NWS checks and match the edge cache', () => {
  assert.equal(OBSERVATION_REFRESH_MS, 5 * 60 * 1000);
  assert.equal(MODEL_REFRESH_CHECK_MS, 10 * 60 * 1000);
  assert.equal(OBS_CACHE_SECONDS * 1000, OBSERVATION_REFRESH_MS);
});
