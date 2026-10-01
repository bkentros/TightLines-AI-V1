import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { buildEvents, cleanSeries } from './events.mjs';

const ramp = (a, b, h0, h1) => Array.from({ length: 121 }, (_, h) => (h <= h0 ? a : h >= h1 ? b : a + (b - a) * (h - h0) / (h1 - h0)));

test('short gaps are filled, long gaps end the series', () => {
  assert.deepEqual(cleanSeries([50, null, 52, 53]), [50, 51, 52, 53]);
  assert.deepEqual(cleanSeries([50, 51, null, null, null, null, 55]), [50, 51]);
  assert.deepEqual(cleanSeries([null, 50]), []);
});

test('events carry the pier id and the shared rule version', () => {
  const out = buildEvents({ start: '2026-09-30T12:00:00Z', piers: { ludington_mi: ramp(62, 49, 20, 40), chicago_il: ramp(58, 57, 0, 120) } });
  assert.equal(out.rule, 'piercast-surge-v1');
  assert.equal(out.events.length, 1);
  assert.equal(out.events[0].cityId, 'ludington_mi');
  assert.equal(out.events[0].kind, 'cold');
});

test('the job pier list matches the live PierCast city roster', (t) => {
  const release = new URL('../../../supabase/functions/_shared/pierCastEngine/config/publicV3Release.ts', import.meta.url);
  if (!fs.existsSync(release)) return t.skip('app config not checked out');
  const ids = [...fs.readFileSync(release, 'utf8').matchAll(/^\s+"([a-z_]+_[a-z]{2})",$/gm)].map((m) => m[1]).sort();
  const piers = JSON.parse(fs.readFileSync(new URL('./piers.json', import.meta.url), 'utf8')).map((p) => p.id).sort();
  assert.equal(ids.length, 32);
  assert.deepEqual(piers, ids);
});
