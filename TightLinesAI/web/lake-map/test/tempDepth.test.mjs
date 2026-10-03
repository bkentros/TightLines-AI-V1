import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { resolveInitialMapLayer } from '../src/engine/preferences.js';
import {
  TempDepthCatalog,
  TEMP_DEPTHS_FT,
  depthCellValid,
  depthLabel,
  featureState,
  layerChangedProps,
  tempDepthEnabled,
} from '../src/engine/tempDepth.js';

test('Temp at depth feature resolves off, labs and on without changing the off default', () => {
  assert.equal(featureState(null), 'off');
  assert.equal(featureState({ tempDepth: 'unexpected' }), 'off');
  assert.equal(tempDepthEnabled({ tempDepth: 'off' }, { labsUnlocked: true, labsQuery: true }), false);
  assert.equal(tempDepthEnabled({ tempDepth: 'labs' }), false);
  assert.equal(tempDepthEnabled({ tempDepth: 'labs' }, { labsUnlocked: true }), true);
  assert.equal(tempDepthEnabled({ tempDepth: 'labs' }, { labsQuery: true }), true);
  assert.equal(tempDepthEnabled({ tempDepth: 'on' }), true);
  assert.equal(resolveInitialMapLayer('temp_depth'), 'temp', 'off preserves the production layer set');
  assert.equal(resolveInitialMapLayer('temp_depth', { tempDepth: true }), 'temp_depth');
});

test('only the five launch depths are exposed and metric labels are fixed', () => {
  assert.deepEqual(TEMP_DEPTHS_FT, [10, 20, 30, 40, 50]);
  assert.deepEqual(TEMP_DEPTHS_FT.map((depth) => depthLabel(depth, 'm')), ['3 m', '6 m', '9 m', '12 m', '15 m']);
  assert.equal(depthLabel(30, 'ft'), '30 ft');
});

test('layer analytics reuse layer_changed with snake_case depth_ft', () => {
  assert.deepEqual(layerChangedProps('temp_depth', 30), { layer: 'temp_depth', depth_ft: 30 });
  assert.deepEqual(layerChangedProps('wind', 30), { layer: 'wind' });
  for (const key of Object.keys(layerChangedProps('temp_depth', 30))) assert.match(key, /^[a-z_]+$/);
});

test('shallow-water no-data remains masked at the selected depth', () => {
  const grid = { west: -90, north: 45, width: 3, height: 2, res: 1, nodata: 65535 };
  const frame = { w: 3, h: 2, data: new Uint16Array([100, 65535, 120, 130, 140, 150]) };
  const domain = { west: -90, east: -88, north: 45, south: 44 };
  assert.equal(depthCellValid(frame, grid, domain, -90, 45), true);
  assert.equal(depthCellValid(frame, grid, domain, -89, 45), false);
  assert.equal(depthCellValid(frame, grid, domain, -95, 45), false);
  const shader = readFileSync(new URL('../src/engine/fieldLayer.js', import.meta.url), 'utf8');
  assert.match(shader, /u_strict_mask[\s\S]+discard/, 'GPU rendering enforces the same mask');
});

test('depth catalog loads only the pointer and selected manifest until frames are requested', async () => {
  const oldLocation = globalThis.location, oldFetch = globalThis.fetch;
  globalThis.location = new URL('https://staging.example/map/index.html');
  const requests = [];
  const pointer = { run: 'surface-run', base: 'runs/tdepth-surface-run/', depthsFt: [10, 20, 30, 40, 50] };
  const manifest = {
    run: 'surface-run', depthFt: 30, events: null, depth: null,
    domain: { west: -90, east: -89, south: 44, north: 45 },
    grids: { temp: { west: -90, north: 45, width: 2, height: 2, res: 1, scale: 20, offset: 30, nodata: 65535, encoding: 'rgb16' } },
    frames: [{ hour: 0, validTime: '2026-10-02T12:00:00Z', temp: 'temp/000.png' }, { hour: 3, validTime: '2026-10-02T15:00:00Z', temp: 'temp/003.png' }],
  };
  globalThis.fetch = async (input) => {
    const url = String(input); requests.push(url);
    const body = url.endsWith('/latest.json') ? pointer : manifest;
    return { ok: true, json: async () => body };
  };
  try {
    const catalog = await new TempDepthCatalog('https://staging.example/runs/tdepth/latest.json', 'surface-run').init();
    assert.equal(catalog.available, true);
    assert.equal(requests.length, 1);
    await catalog.store(30);
    assert.equal(requests.length, 2);
    assert.match(requests[1], /\/d030\/manifest\.json$/);
    assert.ok(requests.every((url) => !url.endsWith('.png')), 'no frame downloads before selection playback asks for them');
  } finally {
    globalThis.location = oldLocation; globalThis.fetch = oldFetch;
  }
});

test('a mismatched depth run is unavailable without affecting the surface run', async () => {
  const catalog = await new TempDepthCatalog('https://staging.example/runs/tdepth/latest.json', 'new-surface', {
    fetchImpl: async () => ({ ok: true, json: async () => ({ run: 'old-surface', base: 'runs/tdepth-old-surface/', depthsFt: [10, 20, 30, 40, 50] }) }),
  }).init();
  assert.equal(catalog.available, false);
});

test('the pointer fetch is called without rebinding browser fetch', async () => {
  const expectedThis = undefined;
  const pointer = { run: 'surface', base: 'runs/tdepth-surface/', depthsFt: [10, 20, 30, 40, 50] };
  const fetchImpl = function () { assert.equal(this, expectedThis); return Promise.resolve({ ok: true, json: async () => pointer }); };
  const catalog = await new TempDepthCatalog('https://staging.example/runs/tdepth/latest.json', 'surface', { fetchImpl }).init();
  assert.equal(catalog.available, true);
});
