import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { resolveInitialMapLayer } from '../src/engine/preferences.js';
import {
  TempDepthCatalog,
  TEMP_DEPTHS_FT,
  depthCellValid,
  depthLabel,
  depthPickerItems,
  depthPopoverTop,
  featureState,
  layerChangedProps,
  rememberedDepth,
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
  assert.deepEqual(depthPickerItems('ft').map((item) => item.label), ['10 ft', '20 ft', '30 ft', '40 ft', '50 ft']);
  assert.deepEqual(depthPickerItems('m').map((item) => item.label), ['3 m', '6 m', '9 m', '12 m', '15 m']);
});

test('layer analytics reuse layer_changed with snake_case depth_ft and picker source', () => {
  assert.deepEqual(layerChangedProps('temp_depth', 30), { layer: 'temp_depth', depth_ft: 30 });
  assert.deepEqual(layerChangedProps('temp_depth', 10, 'sheet'), { layer: 'temp_depth', depth_ft: 10, source: 'sheet' });
  assert.deepEqual(layerChangedProps('temp_depth', 50, 'readout'), { layer: 'temp_depth', depth_ft: 50, source: 'readout' });
  assert.deepEqual(layerChangedProps('wind', 30), { layer: 'wind' });
  for (const key of Object.keys(layerChangedProps('temp_depth', 30, 'readout'))) assert.match(key, /^[a-z_]+$/);
});

test('remembered depth accepts only launch depths', () => {
  for (const depth of TEMP_DEPTHS_FT) assert.equal(rememberedDepth(depth), depth);
  assert.equal(rememberedDepth('30'), 30);
  assert.equal(rememberedDepth(75), 30);
  assert.equal(rememberedDepth(null, 20), 20);
});

test('the depth popover stays between the readout and playback panel at phone sizes', () => {
  for (const [width, height] of [[320, 568], [375, 667], [393, 852], [440, 956], [360, 760], [852, 393]]) {
    const floor = 60, anchorBottom = height < width ? 122 : 154, ceiling = height < width ? 210 : height - 250;
    const top = depthPopoverTop({ anchorBottom, popoverHeight: 58, floor, ceiling });
    assert.ok(top >= floor, `${width}x${height}: below top controls`);
    assert.ok(top + 58 <= ceiling, `${width}x${height}: above playback panel`);
  }
});

test('the page exposes inline and readout pickers without the retired floating chip', () => {
  const page = readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
  const shell = readFileSync(new URL('../src/prototype.js', import.meta.url), 'utf8');
  assert.ok(page.indexOf('id="temp-depth-layer"') < page.indexOf('id="td-picker"'));
  assert.ok(page.indexOf('id="td-picker"') < page.indexOf('data-layer="wind"'));
  assert.match(page, /id="ro-depth"[^>]+aria-controls="depth-popover"/);
  assert.match(page, /#ro-depth\{min-height:44px/);
  assert.match(page, /\.depth-segments button\{[^}]*min-height:44px/);
  assert.doesNotMatch(page, /depth-chip/);
  assert.match(shell, /depthRowOpen = !depthRowOpen/);
  assert.match(shell, /changeDepth\(event, 'sheet'\)/);
  assert.match(shell, /changeDepth\(event, 'readout'\)/);
  assert.match(shell, /event\.target\.closest\('#depth-popover,#ro-depth'\)/);
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
