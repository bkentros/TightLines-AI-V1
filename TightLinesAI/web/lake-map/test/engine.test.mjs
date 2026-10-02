import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { detectEvents, SURGE_RULE } from '../src/engine/signals.js';
import { toTemp, toWind, toLength, fmtWaves, fmtWind, tempBand, compass, paletteBytes, PALETTES } from '../src/engine/scales.js';
import {
  compactFramePixels,
  FrameStore,
  gridCubicSampler,
  gridSampler,
  interpolateValidValues,
  packScalarTexturePixels,
} from '../src/engine/frames.js';

const series = (fn) => Array.from({ length: 121 }, (_, h) => fn(h));
const ramp = (a, b, h0, h1) => (h) => h <= h0 ? a : h >= h1 ? b : a + (b - a) * (h - h0) / (h1 - h0);

test('a 5°F wobble never triggers an alert', () => {
  assert.deepEqual(detectEvents(series((h) => 58 + 2.5 * Math.sin(h / 4))), []);
});
test('a 12°F drop into trout and salmon range is a cold-water surge with its full window', () => {
  const ev = detectEvents(series(ramp(61, 49, 20, 40)));
  assert.equal(ev.length, 1);
  assert.equal(ev[0].kind, 'cold');
  assert.ok(ev[0].startHour >= 19 && ev[0].startHour <= 21, `start ${ev[0].startHour}`);
  assert.equal(ev[0].bottomHour, 40);
  assert.equal(ev[0].strong, false);
});
test('a big drop that stays above 60°F is not a surge', () => {
  assert.deepEqual(detectEvents(series(ramp(74, 62, 20, 40))), []);
});
test('a short dip that rebounds within 6 hours is not a surge', () => {
  const s = series((h) => h < 20 ? 61 : h < 30 ? 61 - (h - 20) * 1.2 : h < 32 ? 49 : 49 + (h - 32) * 4);
  assert.deepEqual(detectEvents(s).filter((e) => e.kind === 'cold'), []);
});
test('a 16°F drop is labeled strong; a rise into warm water is a warm-water push', () => {
  assert.equal(detectEvents(series(ramp(64, 48, 10, 30)))[0].strong, true);
  const w = detectEvents(series(ramp(55, 66, 30, 40)));
  assert.equal(w.length, 1); assert.equal(w[0].kind, 'warm');
});
test('the same event is reported once', () => {
  assert.equal(detectEvents(series(ramp(62, 48, 10, 30))).length, 1);
  assert.equal(SURGE_RULE.guardHours, 48);
});
test('units: Celsius, km/h, knots, meters', () => {
  assert.equal(toTemp(50, 'C'), 10);
  assert.ok(Math.abs(toWind(10, 'kph') - 16.09) < 0.01);
  assert.ok(Math.abs(toWind(10, 'kt') - 8.69) < 0.01);
  assert.ok(Math.abs(toLength(10, 'm') - 3.048) < 1e-9);
  assert.equal(fmtWind(10, 'kph'), '16');
  assert.equal(fmtWaves(3.2, 'ft'), '3–4');
  assert.equal(fmtWaves(0.3, 'ft'), '< 1');
  assert.equal(tempBand('F'), 2); assert.equal(tempBand('C'), 1);
  assert.equal(compass(315), 'NW'); assert.equal(compass(0), 'N');
});
test('palettes are 256 opaque colors', () => {
  for (const k of Object.keys(PALETTES)) { const b = paletteBytes(k); assert.equal(b.length, 1024); for (let i = 3; i < 1024; i += 4) assert.equal(b[i], 255); }
});
test('grid sampling interpolates and skips no-data corners', () => {
  const grid = { res: 1, nodata: 255 }, dom = { west: 0, north: 1 };
  const rgba = new Uint8ClampedArray([10, 0, 0, 255, 20, 0, 0, 255, 30, 0, 0, 255, 255, 0, 0, 255]);
  const s = gridSampler(grid, dom), f = { w: 2, h: 2, rgba };
  assert.equal(s(f, 0.5, 1), 15);
  assert.ok(Number.isFinite(s(f, 0.5, 0.5)));
  assert.ok(s(f, 0.5, 0.5) < 30);
  assert.ok(Number.isNaN(s(f, 5, 5)));
});

test('scalar forecast frames retain one byte per pixel while wind retains RGBA', () => {
  const rgba = new Uint8ClampedArray([10, 1, 2, 255, 20, 3, 4, 255]);
  const scalar = compactFramePixels('temp/000.png', rgba);
  assert.equal(scalar.channels, 1);
  assert.deepEqual([...scalar.data], [10, 20]);
  const wind = compactFramePixels('wind/000.png', rgba);
  assert.equal(wind.channels, 4);
  assert.equal(wind.data, rgba);
});

test('valid-to-valid temporal interpolation remains smooth', () => {
  assert.equal(interpolateValidValues(40, 60, 0), 40);
  assert.equal(interpolateValidValues(40, 60, 0.25), 45);
  assert.equal(interpolateValidValues(40, 60, 0.5), 50);
  assert.equal(interpolateValidValues(40, 60, 1), 60);
});

test('valid-to-no-data transitions use the valid frame and both-invalid stays absent', () => {
  assert.equal(interpolateValidValues(66, NaN, 0.75), 66);
  assert.equal(interpolateValidValues(NaN, 68, 0.25), 68);
  assert.ok(Number.isNaN(interpolateValidValues(NaN, NaN, 0.5)));
});

test('scalar GPU packing prevents no-data bytes from entering filtered values', () => {
  assert.deepEqual(
    [...packScalarTexturePixels(new Uint8Array([10, 255, 20]), 255)],
    [10, 255, 0, 0, 20, 255],
  );
  assert.deepEqual(
    [...packScalarTexturePixels(new Uint8Array([10, 1, 2, 255, 255, 3, 4, 255]), 255, 4)],
    [10, 255, 0, 0],
  );
});

test('no-data adjacent to valid water cannot contaminate bicubic sampling', () => {
  const grid = { res: 1, nodata: 255 };
  const domain = { west: 0, north: 3 };
  const data = new Uint8Array(16).fill(20);
  data[0] = 255; data[3] = 255; data[12] = 255;
  const sample = gridCubicSampler(grid, domain);
  const frame = { w: 4, h: 4, channels: 1, data };
  assert.ok(Math.abs(sample(frame, 1.2, 1.8) - 20) < 1e-6);
  assert.ok(Number.isNaN(sample({ ...frame, data: new Uint8Array(16).fill(255) }, 1.2, 1.8)));
});

test('field shader validates both frames and releases its bounded texture cache', () => {
  const source = readFileSync(new URL('../src/engine/fieldLayer.js', import.meta.url), 'utf8');
  assert.match(source, /packScalarTexturePixels/);
  assert.match(source, /internal: isWind \? gl\.RGBA8 : gl\.RG8/);
  assert.doesNotMatch(source, /\b(?:float|vec[234])\s+sample\b/, 'GLSL reserves sample as a keyword');
  assert.match(source, /bool av = a\.y[^;]+bv = b\.y/);
  assert.match(source, /if \(!av && !bv\) discard/);
  assert.match(source, /av && bv \? mix\(a\.x, b\.x, u_mix\) : av \? a\.x : b\.x/);
  assert.match(source, /onRemove[\s\S]+deleteTexture[\s\S]+textures\.clear/);
});

test('dismissing the alert banner keeps future alerts in the Alerts tool without reopening it', () => {
  const source = readFileSync(new URL('../src/prototype.js', import.meta.url), 'utf8');
  assert.match(source, /ui\.alertHidden = true;[\s\S]*updateAlerts\(\);[\s\S]*\$\('#alerts-tool'\)\.focus\(\)/);
  assert.match(source, /chip\.hidden = ui\.alertHidden; tool\.hidden = !ui\.alertHidden/);
  assert.doesNotMatch(source, /ui\.alertHidden\s*&&[\s\S]{0,160}ui\.alertHidden\s*=\s*false/);
  assert.doesNotMatch(source, /ui\.dismissed|ui\.shownIds/);
});

test('alert groups collapse, details return to the list, and water groups can show fewer', () => {
  const source = readFileSync(new URL('../src/prototype.js', import.meta.url), 'utf8');
  assert.match(source, /const open = nwsOpen\.has\(event\);/);
  assert.doesNotMatch(source, /nwsOpen\.has\(event\) \|\| list\.length === 1/);
  assert.match(source, /#nd-back'[\s\S]{0,100}openAlerts\('nws'\)/);
  assert.match(source, /data-more="\$\{kind\}" aria-expanded="\$\{open\}"/);
  assert.match(source, /\$\{open \? 'Show fewer' : `Show \$\{list\.length - 3\} more`\}/);
});

test('map credits use a compact disclosure while preserving required attribution links', () => {
  const page = readFileSync(new URL('../src/index.html', import.meta.url), 'utf8');
  const layers = readFileSync(new URL('../src/engine/staticLayers.js', import.meta.url), 'utf8');
  assert.match(page, /<button id="attrib"[^>]+>i<\/button>/);
  assert.match(page, /id="sheet-credits"/);
  assert.doesNotMatch(page, /<div id="attrib"/);
  assert.match(layers, /openstreetmap\.org\/copyright/);
  assert.match(layers, /openmaptiles\.org/);
  assert.match(layers, /open-meteo\.com/);
});

test('five-day playback keeps only a bounded decoded frame window', () => {
  const store = Object.create(FrameStore.prototype);
  store.hours = Array.from({ length: 121 }, (_, i) => i);
  store.manifest = { frames: store.hours.map((hour) => ({ hour, temp: `temp/${String(hour).padStart(3, '0')}.png` })) };
  store.images = new Map(); store.evictListeners = new Set();
  let evicted = 0; store.onEvict(() => evicted++);
  for (let hour = 0; hour < 121; hour++) {
    const path = store.framePath('temp', hour), promise = Promise.resolve();
    promise.__v = { path }; store.images.set(path, promise);
  }
  store.prune(60, ['temp']);
  assert.equal(store.images.size, 7);
  assert.equal(evicted, 114);
  assert.deepEqual([...store.images.keys()], Array.from({ length: 7 }, (_, i) => `temp/${String(i + 58).padStart(3, '0')}.png`));
});

/* ── band labels ── */
import { BandLabeler } from '../src/engine/bandLabels.js';
import { bandSpec, speciesFit, SPECIES } from '../src/engine/scales.js';

function fakeStore(valueF) {
  // 4°×2° lake, 0.02° temp grid; west half 55°F, east half 61°F
  const domain = { west: -88, east: -84, south: 43, north: 45 }, res = 0.02;
  const w = Math.round(4 / res) + 1, h = Math.round(2 / res) + 1, rgba = new Uint8ClampedArray(w * h * 4);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) rgba[(j * w + i) * 4] = Math.round((valueF(domain.west + i * res, domain.north - j * res) - 30) * 5);
  const frame = { path: 'temp/000.png', w, h, rgba };
  return {
    frame, store: {
      manifest: { domain, grids: { temp: { res, scale: 5, offset: 30, nodata: 255 } } },
      bracket: () => ({ ia: 0, ib: 0, mix: 0 }),
    },
  };
}
const inLake = (lon, lat) => lon > -87.8 && lon < -84.2 && lat > 43.2 && lat < 44.8;

test('band labels sit inside their own band, well away from its edge', () => {
  const { store, frame } = fakeStore((lon) => (lon < -86 ? 55 : 61));
  const L = new BandLabeler(store, inLake);
  const t0 = Date.now();
  const anchors = L.compute('temp', 0, { temp: 'F' }, [frame, frame]);
  assert.ok(Date.now() - t0 < 1500, 'fast enough to run every forecast hour');
  const texts = new Set(anchors.map((a) => a.text));
  assert.ok(texts.has('54–56°') && texts.has('60–62°'), [...texts].join(','));
  for (const a of anchors) {
    if (a.text === '54–56°') assert.ok(a.lon < -86.05, `54–56 at ${a.lon}`);
    if (a.text === '60–62°') assert.ok(a.lon > -85.95, `60–62 at ${a.lon}`);
  }
  const best = anchors[0]; assert.ok(best.r > 0.3, `interior radius ${best.r}`);
});
test('band labels are identical for the same hour (no jitter while zooming)', () => {
  const { store, frame } = fakeStore((lon, lat) => 50 + (lon + 88) * 2 + Math.sin(lat * 6));
  const L = new BandLabeler(store, inLake);
  const a = L.compute('temp', 3, { temp: 'F' }, [frame, frame]), b = L.compute('temp', 3.4, { temp: 'F' }, [frame, frame]);
  assert.equal(JSON.stringify(a), JSON.stringify(b));
});
test('band labels follow the unit: 1°C bands', () => {
  const { store, frame } = fakeStore(() => 59); // 15°C
  const anchors = new BandLabeler(store, inLake).compute('temp', 0, { temp: 'C' }, [frame, frame]);
  assert.equal(anchors[0].text, '15–16°');
});

test('band labels use the same no-data-normalized values as the rendered field', () => {
  const { store, frame } = fakeStore(() => 67);
  const nodata = new Uint8ClampedArray(frame.rgba);
  for (let i = 0; i < nodata.length; i += 16) nodata[i] = 255;
  const mixedFrame = { ...frame, path: 'temp/mixed.png', rgba: nodata };
  const labeler = new BandLabeler(store, inLake);
  const anchors = labeler.compute('temp', 0, { temp: 'F' }, [mixedFrame, frame]);
  assert.ok(anchors.length > 0);
  assert.ok(anchors.every((anchor) => anchor.text === '66–68°'));
});
test('band specs for waves, wind and species', () => {
  assert.equal(bandSpec('waves', { length: 'ft' }).label(1, 2), '1–2 ft');
  assert.equal(bandSpec('waves', { length: 'm' }).width, 0.5);
  assert.equal(bandSpec('wind', { wind: 'mph' }).width, 5);
  assert.equal(bandSpec('wind', { wind: 'kph' }).width, 10);
  assert.equal(bandSpec('depth', {}), null);
  const coho = SPECIES.find((s) => s.id === 'coho_salmon');
  assert.equal(speciesFit(54, coho).grade, 0);
  assert.deepEqual([speciesFit(60, coho).grade, speciesFit(60, coho).dir], [1, 'warm']);
  assert.equal(speciesFit(40, coho).grade, 3);
});
