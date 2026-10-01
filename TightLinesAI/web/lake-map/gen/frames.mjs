/**
 * Live Lake Map frame format (v1) and a sample-frame generator.
 *
 * The real data job (phase 3) writes exactly these files from NOAA and
 * Open-Meteo data; this generator writes the same files from a synthetic
 * weather model so the engine can be built and tested now.
 *
 *   manifest.json
 *   temp/<hhh>.png   8-bit gray, value = round((°F - 30) * 5), 255 = no data (0.2 °F steps, 30–80.8 °F)
 *   wind/<hhh>.png   RGBA, R = u·2 + 128, G = v·2 + 128 (mph toward east / north, 0.5 mph steps), A = 255
 *   waves/<hhh>.png  8-bit gray, value = round(ft * 20), 255 = no data (0.05 ft steps, 0–12.7 ft)
 *   depth.png        8-bit gray, value = round(ft / 6), 255 = no data (6 ft steps, 0–1524 ft)
 *   events.json      cold-water surge / warm-water push events per pier (same rule as the plan)
 *
 * Every grid is a regular lon/lat grid; row 0 is the north edge. Water values
 * are extended a few cells onto land so the shoreline mask never shows a gap.
 */
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import * as shapefile from 'shapefile';
import { detectEvents } from '../src/engine/signals.js';

const OUT = process.argv[2] || 'public/data';
const STEP_HOURS = Number(process.argv[3] || 3);
const HOURS = 120;
const T0_ISO = '2026-09-29T23:00:00Z'; // Tue Sep 29, 7 PM EDT
const DOMAIN = { west: -92.4, east: -75.8, south: 41.2, north: 49.2 };
export const FORMAT = {
  version: 1,
  temp: { res: 0.02, scale: 5, offset: 30, nodata: 255, unit: 'F' },
  wind: { res: 0.25, scale: 2, offset: 128, unit: 'mph' },
  waves: { res: 0.05, scale: 20, offset: 0, nodata: 255, unit: 'ft' },
  depth: { res: 0.02, scale: 1 / 6, offset: 0, nodata: 255, unit: 'ft' },
};

/* ── shoreline raster ── */
const shore = await shapefile.read(new URL('../../geo/sh/shoreline.shp', import.meta.url).pathname);
const rings = [];
shore.features.forEach((f) => { const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates; polys.forEach((p) => p.forEach((r) => rings.push(r))); });
const MR = 0.01;
const MW = Math.round((DOMAIN.east - DOMAIN.west) / MR) + 1, MH = Math.round((DOMAIN.north - DOMAIN.south) / MR) + 1;
const water = new Uint8Array(MW * MH);
{
  const edges = [];
  for (const r of rings) for (let k = 0; k < r.length - 1; k++) { const a = r[k], b = r[k + 1]; if (a[1] !== b[1]) edges.push(a[1] < b[1] ? [a[0], a[1], b[0], b[1]] : [b[0], b[1], a[0], a[1]]); }
  edges.sort((p, q) => p[1] - q[1]);
  for (let j = 0; j < MH; j++) {
    const lat = DOMAIN.north - j * MR, xs = [];
    for (const e of edges) { if (e[1] > lat) break; if (e[3] > lat) xs.push(e[0] + (lat - e[1]) / (e[3] - e[1]) * (e[2] - e[0])); }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) {
      const i0 = Math.max(0, Math.ceil((xs[k] - DOMAIN.west) / MR)), i1 = Math.min(MW - 1, Math.floor((xs[k + 1] - DOMAIN.west) / MR));
      for (let i = i0; i <= i1; i++) water[j * MW + i] = 1;
    }
  }
}
/* lake id: 1 Superior, 2 Michigan, 3 Huron, 4 Erie, 5 Ontario, 6 St. Clair, 7 Georgian Bay */
function lakeIdAt(lon, lat) {
  if (lat > 46.35 && lon < -84.3) return 1;
  if (lon < -84.75 && lat < 46.3) return 2;
  if (lon > -83.1 && lon < -82.35 && lat > 42.25 && lat < 42.72) return 6;
  if (lat < 42.95 && lon > -83.6 && lon < -78.8) return 4;
  if (lon > -79.95 && lat > 43.1 && lat < 44.4) return 5;
  if (lon > -81.75 && lat > 44.45) return 7;
  return 3;
}
const lake = new Uint8Array(MW * MH);
for (let j = 0; j < MH; j++) for (let i = 0; i < MW; i++) if (water[j * MW + i]) lake[j * MW + i] = lakeIdAt(DOMAIN.west + i * MR, DOMAIN.north - j * MR);
/* distance to shore (km), chamfer */
const dist = new Float32Array(MW * MH);
{
  for (let n = 0; n < dist.length; n++) dist[n] = water[n] ? 1e9 : 0;
  const dy = MR * 110.57;
  const relax = (a, b, s) => { const v = dist[b] + s; if (v < dist[a]) dist[a] = v; };
  for (let pass = 0; pass < 2; pass++) {
    for (let j = 1; j < MH - 1; j++) { const dx = MR * 111.32 * Math.cos((DOMAIN.north - j * MR) * Math.PI / 180), dg = Math.hypot(dx, dy); for (let i = 1; i < MW - 1; i++) { const n = j * MW + i; if (!water[n]) continue; relax(n, n - 1, dx); relax(n, n - MW, dy); relax(n, n - MW - 1, dg); relax(n, n - MW + 1, dg); } }
    for (let j = MH - 2; j > 0; j--) { const dx = MR * 111.32 * Math.cos((DOMAIN.north - j * MR) * Math.PI / 180), dg = Math.hypot(dx, dy); for (let i = MW - 2; i > 0; i--) { const n = j * MW + i; if (!water[n]) continue; relax(n, n + 1, dx); relax(n, n + MW, dy); relax(n, n + MW + 1, dg); relax(n, n + MW - 1, dg); } }
  }
}
const mIdx = (lon, lat) => { const i = Math.round((lon - DOMAIN.west) / MR), j = Math.round((DOMAIN.north - lat) / MR); return i < 0 || j < 0 || i >= MW || j >= MH ? -1 : j * MW + i; };
const isWater = (lon, lat) => { const n = mIdx(lon, lat); return n >= 0 && water[n] === 1; };

/* ── synthetic weather (same story as the mockup: north-wind cold-water surge on the east shore) ── */
const sstep = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function hash(i, j, s) { let h = (i * 374761393 + j * 668265263 + s * 1442695041) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967295; }
function vnoise(x, y, s) { const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy); const a = hash(i, j, s), b = hash(i + 1, j, s), c = hash(i, j + 1, s), d = hash(i + 1, j + 1, s); return (a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy) * 2 - 1; }
function fbm(x, y, s) { let v = 0, amp = 1, f = 1; for (let o = 0; o < 4; o++) { v += amp * vnoise(x * f, y * f, s + o); amp *= 0.5; f *= 2.03; } return v; }
const coldEnv = (h) => h < 12 ? 0 : h < 32 ? sstep(12, 32, h) : h < 54 ? 1 : 1 - sstep(54, 96, h);
const warmEnv = (h) => h < 26 ? 0 : h < 38 ? sstep(26, 38, h) : h < 60 ? 1 : 1 - sstep(60, 100, h);
export function tempModel(lon, lat, h, d, id) {
  let t = 66 - (lat - 41.8) * 2.4;
  t += 2.2 * sstep(-83.9, -82.9, lon) * (1 - sstep(42.7, 43.3, lat)) + 1.2 * sstep(-80.2, -79.4, lon) * sstep(43, 43.4, lat);
  t -= 2.2 * (1 - Math.exp(-d / 28));
  const hod = (19 + h) % 24; t += 0.7 * Math.cos((hod - 16) / 24 * 2 * Math.PI) * Math.exp(-d / 12);
  const drift = h * 0.004;
  t += 2.1 * fbm(lon * 1.6 + drift, lat * 2.1 - drift * 0.6, 11) + 0.9 * fbm(lon * 5.5 - drift * 2, lat * 7 + drift, 23);
  if (id === 2) {
    const east = sstep(-87.05, -86.6, lon) * Math.exp(-Math.pow((lat - 44.05) / 0.5, 2));
    t -= 13.5 * coldEnv(h) * east * Math.exp(-d / 9) * (1 + 0.25 * fbm(lon * 9, lat * 9 + h * 0.01, 5));
    const west = (1 - sstep(-87.75, -87.35, lon)) * Math.exp(-Math.pow((lat - 43.05) / 0.45, 2));
    t += 9.5 * warmEnv(h) * west * Math.exp(-d / 8);
  }
  return t;
}
export function windModel(lon, lat, h, over) {
  const A = [7.1, 7.1], B = [6.5, -17.9], C = [-6.4, -6.4], D = [0.3, 8.2];
  let u, v, f;
  if (h < 8) { [u, v] = A; }
  else if (h < 14) { f = sstep(8, 14, h); u = A[0] + (B[0] - A[0]) * f; v = A[1] + (B[1] - A[1]) * f; }
  else if (h < 38) { f = 1 - 0.28 * sstep(26, 38, h); u = B[0] * f; v = B[1] * f; }
  else if (h < 50) { f = sstep(38, 50, h); u = B[0] * 0.72 + (C[0] - B[0] * 0.72) * f; v = B[1] * 0.72 + (C[1] - B[1] * 0.72) * f; }
  else if (h < 76) { [u, v] = C; }
  else if (h < 88) { f = sstep(76, 88, h); u = C[0] + (D[0] - C[0]) * f; v = C[1] + (D[1] - C[1]) * f; }
  else { [u, v] = D; }
  u += 3.2 * fbm(lon * 0.45 + h * 0.03, lat * 0.5, 71) + 1.2 * Math.sin(lon * 3.7 + lat * 1.1);
  v += 3.0 * fbm(lon * 0.5, lat * 0.45 - h * 0.03, 83) + 1.1 * Math.cos(lat * 4.1 - lon * 0.7);
  if (h < 44) {
    const cLon = -95 + h * 0.36, cLat = 48.4, dx = (lon - cLon) * 0.72, dy = lat - cLat, rr = Math.hypot(dx, dy) + 0.001;
    const g = 11 * Math.exp(-Math.pow(rr / 2.6, 2)) * (1 - sstep(30, 44, h)); u += -dy / rr * g; v += dx / rr * g;
  }
  const hod = (19 + h) % 24, m = (over ? 1.18 : 0.82) * (1 + 0.12 * Math.cos((hod - 15) / 24 * 2 * Math.PI));
  return [u * m, v * m];
}

/* ── grids ── */
function grid(res) { const w = Math.round((DOMAIN.east - DOMAIN.west) / res) + 1, h = Math.round((DOMAIN.north - DOMAIN.south) / res) + 1; return { w, h, res }; }
function extend(val, has, w, h, passes) {
  for (let p = 0; p < passes; p++) {
    const nv = new Float32Array(val), nh = new Uint8Array(has);
    for (let j = 1; j < h - 1; j++) for (let i = 1; i < w - 1; i++) {
      const n = j * w + i; if (has[n]) continue; let s = 0, c = 0;
      for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { const m = n + b * w + a; if (has[m]) { s += val[m]; c++; } }
      if (c) { nv[n] = s / c; nh[n] = 1; }
    }
    val.set(nv); has.set(nh);
  }
}
function writeGray(file, g, val, has, enc) {
  const png = new PNG({ width: g.w, height: g.h, colorType: 0, inputColorType: 0, bitDepth: 8 });
  const buf = Buffer.alloc(g.w * g.h);
  for (let n = 0; n < buf.length; n++) buf[n] = has[n] ? Math.max(0, Math.min(254, Math.round(enc(val[n])))) : 255;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write({ width: g.w, height: g.h, data: buf }, { colorType: 0, inputColorType: 0, bitDepth: 8 }));
  void png;
}
function tempFrame(h) {
  const g = grid(FORMAT.temp.res), val = new Float32Array(g.w * g.h), has = new Uint8Array(g.w * g.h);
  for (let j = 0; j < g.h; j++) { const lat = DOMAIN.north - j * g.res; for (let i = 0; i < g.w; i++) {
    const lon = DOMAIN.west + i * g.res, n = mIdx(lon, lat); if (n < 0 || !water[n]) continue;
    val[j * g.w + i] = tempModel(lon, lat, h, dist[n], lake[n]); has[j * g.w + i] = 1;
  } }
  extend(val, has, g.w, g.h, 8);
  return { g, val, has };
}
function waveFrame(h) {
  const g = grid(FORMAT.waves.res), val = new Float32Array(g.w * g.h), has = new Uint8Array(g.w * g.h);
  for (let j = 0; j < g.h; j++) { const lat = DOMAIN.north - j * g.res; for (let i = 0; i < g.w; i++) {
    const lon = DOMAIN.west + i * g.res; if (!isWater(lon, lat)) continue;
    const w = windModel(lon, lat, h, true), U = Math.hypot(w[0], w[1]), sx = -w[0] / (U + 1e-6), sy = -w[1] / (U + 1e-6);
    let fetch = 0; for (let s = 1; s <= 60; s++) { const lo = lon + sx * s * 5 / (111.32 * Math.cos(lat * Math.PI / 180)), la = lat + sy * s * 5 / 110.57; if (!isWater(lo, la)) break; fetch = s * 5; }
    val[j * g.w + i] = Math.min(12.5, 0.0175 * Math.pow(U, 1.9) * Math.sqrt(Math.min(fetch + 3, 220) / 220)); has[j * g.w + i] = 1;
  } }
  extend(val, has, g.w, g.h, 4);
  return { g, val, has };
}
const MAXD = { 1: 1330, 2: 925, 3: 750, 4: 210, 5: 800, 6: 21, 7: 540 };
function depthGrid() {
  const g = grid(FORMAT.depth.res), val = new Float32Array(g.w * g.h), has = new Uint8Array(g.w * g.h);
  for (let j = 0; j < g.h; j++) { const lat = DOMAIN.north - j * g.res; for (let i = 0; i < g.w; i++) {
    const lon = DOMAIN.west + i * g.res, n = mIdx(lon, lat); if (n < 0 || !water[n]) continue;
    const id = lake[n], L = id === 4 ? 40 : id === 6 ? 8 : 35, ridge = 1 + 0.1 * fbm(lon * 2.2, lat * 2.6, 41) + 0.05 * fbm(lon * 8, lat * 8, 42);
    val[j * g.w + i] = Math.max(4, MAXD[id] * Math.pow(1 - Math.exp(-dist[n] / L), 1.6) * ridge); has[j * g.w + i] = 1;
  } }
  extend(val, has, g.w, g.h, 8);
  return { g, val, has };
}
function windFrame(h) {
  const g = grid(FORMAT.wind.res), data = Buffer.alloc(g.w * g.h * 4);
  for (let j = 0; j < g.h; j++) { const lat = DOMAIN.north - j * g.res; for (let i = 0; i < g.w; i++) {
    const lon = DOMAIN.west + i * g.res, w = windModel(lon, lat, h, isWater(lon, lat)), n = (j * g.w + i) * 4;
    data[n] = Math.max(0, Math.min(255, Math.round(w[0] * 2 + 128))); data[n + 1] = Math.max(0, Math.min(255, Math.round(w[1] * 2 + 128))); data[n + 2] = 0; data[n + 3] = 255;
  } }
  return { g, data };
}

/* ── piers and events (plan rule) ── */
const CITIES = JSON.parse(fs.readFileSync(new URL('../../cities.json', import.meta.url)));
function pierSeries(c) { const n = mIdx(c[4], c[3]); const d = n >= 0 && water[n] ? dist[n] : 1; const id = n >= 0 && lake[n] ? lake[n] : lakeIdAt(c[4], c[3]); const s = []; for (let h = 0; h <= HOURS; h++) s.push(tempModel(c[4], c[3], h, d, id)); return s; }
/* ── write ── */
if (process.argv[1] && process.argv[1].endsWith('frames.mjs')) {
  fs.mkdirSync(OUT, { recursive: true });
  const hours = []; for (let h = 0; h <= HOURS; h += STEP_HOURS) hours.push(h);
  const pad = (h) => String(h).padStart(3, '0');
  for (const h of hours) {
    const t = tempFrame(h); writeGray(`${OUT}/temp/${pad(h)}.png`, t.g, t.val, t.has, (v) => (v - FORMAT.temp.offset) * FORMAT.temp.scale);
    const w = waveFrame(h); writeGray(`${OUT}/waves/${pad(h)}.png`, w.g, w.val, w.has, (v) => v * FORMAT.waves.scale);
    const wf = windFrame(h); fs.mkdirSync(`${OUT}/wind`, { recursive: true }); fs.writeFileSync(`${OUT}/wind/${pad(h)}.png`, PNG.sync.write({ width: wf.g.w, height: wf.g.h, data: wf.data }));
    process.stdout.write(h + ' ');
  }
  const d = depthGrid(); writeGray(`${OUT}/depth.png`, d.g, d.val, d.has, (v) => v * FORMAT.depth.scale);
  const events = [];
  for (const c of CITIES) for (const e of detectEvents(pierSeries(c))) events.push({ cityId: c[0], ...e });
  fs.writeFileSync(`${OUT}/events.json`, JSON.stringify({ rule: 'piercast-surge-v1', events }, null, 1));
  const g = (k) => { const x = grid(FORMAT[k].res); return { ...FORMAT[k], width: x.w, height: x.h }; };
  const t0 = Date.parse(T0_ISO);
  fs.writeFileSync(`${OUT}/manifest.json`, JSON.stringify({
    formatVersion: FORMAT.version, sample: true, cycle: '2026-09-29T18:00:00Z', generatedAt: '2026-09-29T22:40:00Z',
    domain: DOMAIN, grids: { temp: g('temp'), wind: g('wind'), waves: g('waves'), depth: g('depth') },
    frames: hours.map((h) => ({ hour: h, validTime: new Date(t0 + h * 3600e3).toISOString(), temp: `temp/${pad(h)}.png`, wind: `wind/${pad(h)}.png`, waves: `waves/${pad(h)}.png` })),
    depth: 'depth.png', events: 'events.json',
  }, null, 1));
  console.log('\nevents', events.map((e) => `${e.cityId}:${e.kind}:${e.sizeF}`).join(' '));
}
