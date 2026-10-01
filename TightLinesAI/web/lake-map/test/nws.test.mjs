import assert from 'node:assert/strict';
import test from 'node:test';
import { alertLevel, alertWindow, activeAt, fetchNwsAlerts, alertShapes } from '../src/engine/nws.js';

const H = 3600e3, now = Date.now(), iso = (h) => new Date(now + h * H).toISOString();
const box = (w, s, e, n) => ({ type: 'Polygon', coordinates: [[[w, s], [e, s], [e, n], [w, n], [w, s]]] });
const feat = (id, event, props = {}, geometry = box(-87, 43, -86.5, 44)) => ({ type: 'Feature', id, geometry, properties: { id, event, onset: iso(-1), ends: iso(6), areaDesc: 'X', ...props } });
function fakeFetch(marine, shore = [], zones = {}) {
  return async (url) => {
    const json = url.includes('/alerts/active') ? { features: url.includes('area=LS') ? marine : shore } : zones[url] ? { geometry: zones[url] } : null;
    return { ok: !!json, json: async () => json };
  };
}

test('levels', () => {
  assert.equal(alertLevel('Gale Warning'), 'warning');
  assert.equal(alertLevel('Small Craft Advisory'), 'advisory');
  assert.equal(alertLevel('Gale Watch'), 'advisory');
  assert.equal(alertLevel('Beach Hazards Statement'), 'statement');
});

test('when an alert is in force', () => {
  const w = alertWindow({ onset: iso(2), ends: iso(8) });
  assert.ok(!activeAt(w, now) && activeAt(w, now + 3 * H) && !activeAt(w, now + 9 * H));
  const x = alertWindow({ effective: iso(-1), expires: iso(4) }); // no "ends": expires
  assert.ok(activeAt(x, now) && !activeAt(x, now + 5 * H) && !x.openEnded);
  const open = alertWindow({ sent: iso(0) }); // until further notice
  assert.ok(open.openEnded && activeAt(open, now + 23 * H) && !activeAt(open, now + 25 * H));
});

test('updates replace, cancels and expired alerts drop, far-away shore alerts filtered, warnings first', async () => {
  const marine = [
    feat('old', 'Small Craft Advisory', { ends: iso(3) }),
    feat('new', 'Small Craft Advisory', { ends: iso(9), references: [{ identifier: 'old' }] }),
    feat('cxl', 'Gale Warning', { messageType: 'Cancel' }),
    feat('gone', 'Gale Warning', { ends: iso(-1) }),
    feat('gale', 'Gale Warning'),
  ];
  const shore = [
    feat('beach', 'Beach Hazards Statement', { affectedZones: ['z/MIZ037'] }, null),
    feat('li', 'Rip Current Statement', { affectedZones: ['z/NYZ080'] }, null),
    feat('snow', 'Winter Storm Warning'),
  ];
  const f = fakeFetch(marine, shore, { 'z/MIZ037': box(-86.5, 43.8, -86, 44.2), 'z/NYZ080': box(-73.2, 40.6, -72.6, 41) });
  const list = await fetchNwsAlerts(f);
  assert.deepEqual(list.map((a) => a.id), ['gale', 'new', 'beach', 'li']);
  const { alerts, geojson } = await alertShapes(list, f);
  assert.deepEqual(alerts.map((a) => a.id), ['gale', 'new', 'beach']); // Long Island dropped
  assert.equal(geojson.features.at(-1).properties.level, 'warning'); // warnings drawn on top
  assert.ok(geojson.features.every((x) => Number.isFinite(x.properties.s) && x.properties.e > x.properties.s));
});
