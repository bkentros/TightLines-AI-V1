/**
 * PierCast Live Lake Map engine.
 *
 * createLakeMap(container, options) builds a MapLibre map with:
 *   - the GPU color field (water temp bands + isotherms, waves, depth, wind speed)
 *   - a vector land layer above it, so the coastline is sharp at every zoom
 *     (OpenStreetMap detail when `staticUrl` is given, see staticLayers.js)
 *   - optional depth charts (NOAA) and an OpenFreeMap base map (`basemap: true`)
 *   - GPU wind streaks
 *   - pier markers, band labels, lake and town names (screen overlay)
 * and exposes a small API used by the app screen (native timeline, readout,
 * pier card, layers sheet) through the web-view bridge.
 */
import maplibregl from 'maplibre-gl';
import { FrameStore, gridCubicSampler, gridSampler, gridBox, blendHours, onFrameReady } from './frames.js';
import { FieldLayer } from './fieldLayer.js';
import { ParticleLayer } from './particleLayer.js';
import { PALETTES, colorAt, toTemp, fmtWind, fmtWaves, compass, tempBand, bandSpec, speciesFit, FIT_COLORS, bandIndex } from './scales.js';
import { BandLabeler } from './bandLabels.js';
import { addStaticLayers, GLYPHS, ATTRIBUTION } from './staticLayers.js';

const LAND = '#12253A', INLAND = '#0B1B2A';
/* Reference towns for orientation (piers are labeled separately). tier 1 shows earlier. */
const TOWNS = [
  ['Duluth', -92.10, 46.79, 1], ['Thunder Bay', -89.25, 48.38, 1], ['Green Bay', -88.02, 44.52, 1], ['Detroit', -83.05, 42.33, 1],
  ['Toronto', -79.38, 43.65, 1], ['Cleveland', -81.69, 41.50, 1], ['Buffalo', -78.88, 42.89, 1], ['Traverse City', -85.62, 44.76, 1],
  ['Marquette', -87.40, 46.54, 2], ['Sault Ste. Marie', -84.35, 46.50, 2], ['Mackinaw City', -84.73, 45.78, 2], ['Petoskey', -84.95, 45.37, 2],
  ['Escanaba', -87.06, 45.75, 2], ['Sturgeon Bay', -87.38, 44.83, 2], ['Grand Rapids', -85.67, 42.96, 2], ['Bay City', -83.89, 43.59, 2],
  ['Sarnia', -82.40, 42.97, 2], ['Toledo', -83.54, 41.66, 2], ['Erie', -80.09, 42.13, 2], ['Rochester', -77.61, 43.16, 2],
  ['Kingston', -76.48, 44.23, 2], ['Hamilton', -79.87, 43.26, 2], ['Owen Sound', -80.94, 44.57, 2], ['Gary', -87.35, 41.60, 2],
  ['Ashland', -90.88, 46.59, 2], ['Munising', -86.65, 46.41, 2], ['Wawa', -84.77, 47.99, 2], ['Sandusky', -82.71, 41.45, 2],
];
const LAKE_LABELS = [['LAKE SUPERIOR', -87.6, 47.62, 0], ['LAKE MICHIGAN', -87.08, 43.35, -82], ['LAKE HURON', -82.35, 44.55, -58], ['GEORGIAN BAY', -80.85, 45.3, -45], ['LAKE ERIE', -81.35, 42.15, -22], ['LAKE ONTARIO', -77.95, 43.66, -8]];

/** [west, south, east, north] of a GeoJSON FeatureCollection. */
function geoBox(fc) {
  const b = [180, 90, -180, -90];
  const walk = (c) => { if (typeof c[0] === 'number') { b[0] = Math.min(b[0], c[0]); b[1] = Math.min(b[1], c[1]); b[2] = Math.max(b[2], c[0]); b[3] = Math.max(b[3], c[1]); } else c.forEach(walk); };
  (fc.features || [fc]).forEach((f) => walk((f.geometry || f).coordinates));
  return b;
}

export async function createLakeMap(container, options = {}) {
  const store = await new FrameStore(options.dataUrl || 'data/', { smoothTemperature: options.smoothTemperature !== false }).init();
  // shoreline / land / borders: shared by every run (manifest.geo, relative to the run folder)
  const geoUrl = new URL(store.manifest.geo || 'geo.json', new URL(store.base, location.href)).href;
  const geo = options.geo || await fetch(geoUrl).then((r) => r.json());
  const state = {
    layer: 'temp', t: 0, units: { temp: 'F', wind: 'mph', length: 'ft' }, lines: true, streaks: true,
    piers: options.piers || [], selected: null, species: null, alerts: {}, boxes: [],
    buoys: [], buoysOn: true, buoyDim: false, selectedBuoy: null,
  };
  const map = new maplibregl.Map({
    container, attributionControl: false, dragRotate: false, pitchWithRotate: false, touchPitch: false,
    maxPitch: 0, renderWorldCopies: false, fadeDuration: 0, minZoom: 3.8, maxZoom: 14,
    // the map stays inside the wind area, so every spot you can see has streaks
    maxBounds: (() => { const b = gridBox(store.manifest.grids.wind, store.manifest.domain); return [[b.west, b.south], [b.east, b.north]]; })(),
    center: options.center || [-86.72, 43.92], zoom: options.zoom ?? 6.85,
    style: {
      version: 8, ...(options.basemap ? { glyphs: GLYPHS } : {}), sources: {
        land: { type: 'geojson', data: geo.land, tolerance: 0.2 },
        inland: { type: 'geojson', data: geo.inland, tolerance: 0.3 },
        lakes: { type: 'geojson', data: geo.lakes, tolerance: 0.2 },
        borders: { type: 'geojson', data: geo.borders },
      },
      layers: [
        { id: 'water-base', type: 'background', paint: { 'background-color': '#16324D' } },
      ],
    },
  });
  map.touchZoomRotate.disableRotation();
  const field = new FieldLayer(store), particles = new ParticleLayer(store);
  await new Promise((r) => map.on('load', r));
  const hd = !!options.staticUrl, bm = !!options.basemap;
  const coarse = hd ? { maxzoom: 4.3 } : {};
  // coarse land under the field too, so land outside the model area is never water-colored
  map.addLayer({ id: 'land-base', type: 'fill', source: 'land', paint: { 'fill-color': LAND } });
  map.addLayer(field);
  map.addLayer({ id: 'land', type: 'fill', source: 'land', ...coarse, paint: { 'fill-color': LAND, 'fill-antialias': true } });
  // everything beyond the shoreline file's box is land too (the wind area is much wider)
  const lb = geoBox(geo.land);
  map.addSource('land-outer', { type: 'geojson', data: { type: 'Polygon', coordinates: [
    [[-179, -80], [179, -80], [179, 84], [-179, 84], [-179, -80]],
    [[lb[0], lb[1]], [lb[0], lb[3]], [lb[2], lb[3]], [lb[2], lb[1]], [lb[0], lb[1]]]] } });
  map.addLayer({ id: 'land-outer', type: 'fill', source: 'land-outer', paint: { 'fill-color': LAND, 'fill-antialias': false } });
  map.addLayer({ id: 'inland', type: 'fill', source: 'inland', paint: { 'fill-color': INLAND } });
  if (!bm) {
    map.addLayer({ id: 'states', type: 'line', source: 'borders', filter: ['==', ['get', 'kind'], 'state'], paint: { 'line-color': 'rgba(255,255,255,0.1)', 'line-width': 1 } });
    map.addLayer({ id: 'nation', type: 'line', source: 'borders', filter: ['==', ['get', 'kind'], 'nation'], paint: { 'line-color': 'rgba(255,255,255,0.22)', 'line-width': 1, 'line-dasharray': [3, 3] } });
  }
  const halo = { 'line-color': 'rgba(3,10,18,0.6)', 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 2.6, 12, 4] };
  const edge = { 'line-color': 'rgba(240,246,250,0.92)', 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 1.0, 12, 1.8] };
  map.addLayer({ id: 'coast-halo', type: 'line', source: 'lakes', ...coarse, paint: halo });
  map.addLayer({ id: 'coast', type: 'line', source: 'lakes', ...coarse, paint: edge });
  const statics = addStaticLayers(map, { staticUrl: options.staticUrl, basemap: bm, pierNames: (options.piers || []).map((p) => p.name), before: 'coast-halo' });
  map.moveLayer('inland', 'coast-halo'); // inland lakes above the detailed land
  // National Weather Service alert areas (marine zones, lakeshore counties)
  const NWS_COLOR = ['match', ['get', 'level'], 'warning', '#F0524A', 'advisory', '#F29A3A', '#E9CB4A'];
  map.addSource('nws', { type: 'geojson', data: { type: 'FeatureCollection', features: [] }, tolerance: 0.4 });
  map.addLayer({ id: 'nws-fill', type: 'fill', source: 'nws', paint: { 'fill-color': NWS_COLOR, 'fill-opacity': 0.13 } }, 'coast-halo');
  map.addLayer({ id: 'nws-line', type: 'line', source: 'nws', layout: { 'line-join': 'round' },
    paint: { 'line-color': NWS_COLOR, 'line-opacity': 0.85, 'line-width': ['interpolate', ['linear'], ['zoom'], 5, 1, 10, 2] } }, 'coast-halo');
  if (hd) {
    map.addLayer({ id: 'coast-hd-halo', type: 'line', source: 'lakes-hd', 'source-layer': 'coast', minzoom: 4, layout: { 'line-join': 'round' }, paint: halo });
    map.addLayer({ id: 'coast-hd', type: 'line', source: 'lakes-hd', 'source-layer': 'coast', minzoom: 4, layout: { 'line-join': 'round' }, paint: edge });
  }
  map.addLayer(particles);
  // base-map names sit above the streaks
  ['ofm-road-names', 'ofm-places', 'contour-labels'].forEach((id) => map.getLayer(id) && map.moveLayer(id));

  /* ── overlay: lake names, isotherm labels, pier markers ── */
  const overlay = document.createElement('canvas');
  Object.assign(overlay.style, { position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none' });
  container.appendChild(overlay);
  const markerLayer = document.createElement('div');
  Object.assign(markerLayer.style, { position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden' });
  container.appendChild(markerLayer);

  const sampleTemp = gridCubicSampler(store.manifest.grids.temp, store.manifest.domain);
  const sampleWaves = gridCubicSampler(store.manifest.grids.waves, store.manifest.domain);
  const sampleDepth = gridSampler(store.manifest.grids.depth, store.manifest.domain);
  const sampleWind = gridCubicSampler(store.manifest.grids.wind, store.manifest.domain);
  const resolved = (p) => p && p.__v;
  const lastFrames = {};
  function framesFor(kind, t) {
    const br = store.bracket(t);
    const a = store.loaded(store.framePath(kind, br.ia)), b = store.loaded(store.framePath(kind, br.ib));
    [a, b].forEach((p) => onFrameReady(p, refresh));
    const A = resolved(a), B = resolved(b);
    if (A && B) {
      // neighbors for smooth motion, exactly as the color field picks them
      const last = store.hours.length - 1, span = br.ib > br.ia;
      const P = span && br.ia > 0 ? resolved(store.loaded(store.framePath(kind, br.ia - 1))) : null;
      const N = span && br.ib < last ? resolved(store.loaded(store.framePath(kind, br.ib + 1))) : null;
      lastFrames[kind] = [A, B, br.mix, P || null, N || null];
      return lastFrames[kind];
    }
    return lastFrames[kind] || [A || B, B || A, br.mix, null, null];
  }
  /**
   * Forecast values at a point (°F, mph, ft) without the land/harbor test or the
   * depth chart: cheap enough to run for every pier on every playback frame.
   */
  function sampleFast(lon, lat, t = state.t) {
    const g = store.manifest.grids;
    const T = framesFor('temp', t), Wd = framesFor('wind', t), Wv = framesFor('waves', t);
    // value at time t from one sampler: hours p, a, b, n blended like the color field
    const blend = ([fa, fb, m, fp, fn], sample) => blendHours(fp ? sample(fp) : NaN, sample(fa), sample(fb), fn ? sample(fn) : NaN, m);
    // right against a breakwall the model cell can be empty: use the closest cell that has water
    const near = (fn, res) => {
      let v = fn(lon, lat); if (Number.isFinite(v)) return v;
      for (let r = 1; r <= 4; r++) for (let k = 0; k < 8 * r; k++) {
        const a = (k / (8 * r)) * 2 * Math.PI; v = fn(lon + Math.cos(a) * r * res / Math.cos(lat * Math.PI / 180), lat + Math.sin(a) * r * res);
        if (Number.isFinite(v)) return v;
      }
      return NaN;
    };
    const tr = g.temp.res, wr = g.waves.res;
    const temp = blend(T, (f) => near((x, y) => sampleTemp(f, x, y), tr)) / g.temp.scale + g.temp.offset;
    const u = (blend(Wd, (f) => sampleWind(f, lon, lat, 0)) - g.wind.offset) / g.wind.scale;
    const v = (blend(Wd, (f) => sampleWind(f, lon, lat, 1)) - g.wind.offset) / g.wind.scale;
    const waves = blend(Wv, (f) => near((x, y) => sampleWaves(f, x, y), wr)) / g.waves.scale;
    return { temp, wind: Math.hypot(u, v), windFrom: (Math.atan2(-u, -v) * 180 / Math.PI + 360) % 360, u, v, waves };
  }
  /** Values at a point for the current time (native units: °F, mph, ft). */
  function sampleAt(lon, lat, t = state.t) {
    const g = store.manifest.grids, fast = sampleFast(lon, lat, t);
    const near = (fn, res) => {
      let v = fn(lon, lat); if (Number.isFinite(v)) return v;
      for (let r = 1; r <= 4; r++) for (let k = 0; k < 8 * r; k++) {
        const a = (k / (8 * r)) * 2 * Math.PI; v = fn(lon + Math.cos(a) * r * res / Math.cos(lat * Math.PI / 180), lat + Math.sin(a) * r * res);
        if (Number.isFinite(v)) return v;
      }
      return NaN;
    };
    const kind = waterKind(lon, lat);
    const hdDepth = kind === 'lake' ? statics.depthAt(lon, lat, refresh) : NaN;
    const depth = kind !== 'lake' ? NaN : Number.isFinite(hdDepth) ? hdDepth : sampleDepth(store.depth, lon, lat) / g.depth.scale;
    const depthNear = Number.isFinite(depth) ? depth : near((x, y) => sampleDepth(store.depth, x, y), g.depth.res) / g.depth.scale;
    return { ...fast, depth, depthNear, onWater: kind === 'lake', harbor: kind === 'harbor', kind };
  }
  /**
   * 'lake' (Great Lakes water with model data), 'harbor' (rivers and harbor lakes:
   * real water, no lake model) or 'land'. Uses the drawn shoreline, breakwalls and
   * piers when the point is on screen, so it matches what the user sees exactly.
   */
  const HD_TEST = ['land-hd', 'inland-hd', 'ofm-pier-area', 'ofm-pier-line'];
  function waterKind(lon, lat) {
    const D = store.manifest.domain;
    if (lon < D.west || lon > D.east || lat < D.south || lat > D.north) return 'land'; // beyond the lake data
    if (statics.hd && map.getZoom() >= 4) {
      const pt = map.project([lon, lat]), c = map.getCanvas();
      if (pt.x >= 0 && pt.y >= 0 && pt.x <= c.clientWidth && pt.y <= c.clientHeight) {
        const layers = HD_TEST.filter((id) => map.getLayer(id));
        const hits = map.queryRenderedFeatures(pt, { layers }).map((f) => f.layer.id);
        if (hits.includes('ofm-pier-area') || hits.includes('ofm-pier-line')) return 'land';
        if (hits.includes('inland-hd')) return 'harbor';
        if (hits.includes('land-hd')) return 'land';
        if (map.isSourceLoaded('lakes-hd')) return 'lake';
      }
    }
    return isWater(lon, lat) ? 'lake' : 'land';
  }
  /* Great Lakes water mask, rasterized once from the shoreline (0.01°) for fast point tests. */
  const MASK = 0.01, dom = store.manifest.domain;
  const mw = Math.round((dom.east - dom.west) / MASK) + 1, mh = Math.round((dom.north - dom.south) / MASK) + 1;
  const mask = (() => {
    const c = document.createElement('canvas'); c.width = mw; c.height = mh;
    const x = c.getContext('2d', { willReadFrequently: true }); x.fillStyle = '#fff'; x.beginPath();
    geo.lakes.features.forEach((f) => f.geometry.coordinates.forEach((ring) => ring.forEach((q, k) => { const px = (q[0] - dom.west) / MASK, py = (dom.north - q[1]) / MASK; if (k) x.lineTo(px, py); else x.moveTo(px, py); })));
    x.fill('evenodd');
    const d = x.getImageData(0, 0, mw, mh).data, m = new Uint8Array(mw * mh);
    for (let i = 0; i < m.length; i++) m[i] = d[i * 4 + 3] > 127 ? 1 : 0;
    return m;
  })();
  function isWater(lon, lat) {
    const i = Math.round((lon - dom.west) / MASK), j = Math.round((dom.north - lat) / MASK);
    return i >= 0 && j >= 0 && i < mw && j < mh && mask[j * mw + i] === 1;
  }

  const listeners = {};
  const emit = (name, payload) => (listeners[name] || []).forEach((fn) => fn(payload));

  const pierDepth = new Map();
  function depthNearPier(p) {
    if (pierDepth.has(p.id)) return pierDepth.get(p.id);
    const d = sampleAt(p.lon, p.lat).depthNear;
    if (Number.isFinite(d)) pierDepth.set(p.id, d);
    return d;
  }
  function pierLook(p) {
    const s = state.layer === 'depth' ? { depthNear: depthNearPier(p) } : sampleFast(p.lon, p.lat), u = state.units;
    if (state.layer === 'wind') return { color: colorAt('wind', s.wind), text: `${compass(s.windFrom)} ${fmtWind(s.wind, u.wind)}` };
    if (state.layer === 'waves') return { color: colorAt('waves', s.waves), text: fmtWaves(s.waves, u.length) };
    if (state.layer === 'depth') return { color: colorAt('depth', s.depthNear), text: u.length === 'm' ? `${Math.round(s.depthNear * 0.3048)}m` : `${Math.round(s.depthNear)}'` };
    if (state.layer === 'species' && state.species) {
      const f = speciesFit(s.temp, state.species), disp = toTemp(s.temp, u.temp);
      return { color: FIT_COLORS[f.grade], text: Number.isFinite(disp) ? `${Math.round(disp)}°` : '—', fit: f };
    }
    const band = tempBand(u.temp), disp = toTemp(s.temp, u.temp), mid = (bandIndex(disp, band) + 0.5) * band;
    return { color: colorAt('temp', u.temp === 'C' ? mid * 9 / 5 + 32 : mid), text: Number.isFinite(disp) ? `${Math.round(disp)}°` : '—' };
  }

  const markers = new Map();
  function drawMarkers() {
    const z = map.getZoom(), boxes = [], W = container.clientWidth, H = container.clientHeight;
    const reserved = typeof options.reserved === 'function' ? options.reserved() : options.reserved || [];
    reserved.forEach((r) => boxes.push(r));
    state.boxes = boxes;
    const free = (b) => { for (const q of boxes) if (b[0] < q[2] && b[2] > q[0] && b[1] < q[3] && b[3] > q[1]) return false; boxes.push(b); return true; };
    const order = state.piers.slice().sort((a, b) => (b.id === state.selected) - (a.id === state.selected) || (state.alerts[b.id] ? 1 : 0) - (state.alerts[a.id] ? 1 : 0));
    const seen = new Set();
    for (const p of order) {
      seen.add(p.id);
      let el = markers.get(p.id);
      if (!el) {
        el = document.createElement('button');
        el.className = 'lm-pier'; el.type = 'button';
        el.innerHTML = '<span class="lm-dot"></span><span class="lm-val"></span><span class="lm-name"></span><span class="lm-pulse"></span>';
        el.addEventListener('click', (e) => { e.stopPropagation(); emit('pierTap', p.id); });
        markerLayer.appendChild(el); markers.set(p.id, el);
      }
      const pt = map.project([p.lon, p.lat]);
      if (pt.x < -40 || pt.y < -40 || pt.x > W + 40 || pt.y > H + 40) { if (el._view !== 'off') { el.style.display = 'none'; el._view = 'off'; } continue; }
      const look = pierLook(p), sel = p.id === state.selected, alert = state.alerts[p.id];
      const dotOnly = z < 6.4 && !sel;
      const wPill = 18 + look.text.length * 7.4;
      let mode = dotOnly ? 'dot' : 'pill';
      if (mode === 'pill' && !sel && !free([pt.x - wPill / 2 - 4, pt.y - 14, pt.x + wPill / 2 + 4, pt.y + 14])) mode = 'dot';
      if (mode === 'dot') free([pt.x - 7, pt.y - 7, pt.x + 7, pt.y + 7]);
      let showName = false;
      const nameW = p.name.length * 7.2 + 8, left = p.nameSide === 'left';
      if (mode === 'pill' && (z >= 6.4 || sel)) {
        const nx = left ? pt.x - wPill / 2 - nameW - 4 : pt.x + wPill / 2 + 4;
        showName = sel || free([nx, pt.y - 10, nx + nameW, pt.y + 10]);
      } else if (mode === 'dot' && z >= 5.9) {
        const nx = left ? pt.x - 9 - nameW : pt.x + 9;
        showName = free([nx, pt.y - 9, nx + nameW, pt.y + 9]);
      }
      // write to the DOM only what changed: during playback this runs every frame
      const view = `${mode}|${sel ? 1 : ''}|${alert || ''}|${left ? 'l' : 'r'}|${pt.x.toFixed(1)},${pt.y.toFixed(1)}|${look.color}|${look.text}|${showName ? 1 : 0}`;
      if (el._view === view) continue;
      el._view = view;
      el.dataset.mode = mode; el.dataset.sel = sel ? '1' : ''; el.dataset.alert = alert || ''; el.dataset.side = left ? 'left' : 'right';
      el.style.display = ''; el.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
      el.querySelector('.lm-dot').style.background = look.color;
      el.querySelector('.lm-val').textContent = mode === 'pill' ? look.text : '';
      const nm = el.querySelector('.lm-name'); nm.textContent = showName ? p.name : ''; nm.style.display = showName ? '' : 'none';
      el.setAttribute('aria-label', `${p.name}: ${look.text}`);
    }
    for (const [id, el] of markers) if (!seen.has(id)) { el.remove(); markers.delete(id); }
    drawBuoys(z, W, H, free);
  }

  /* Observed readings at NOAA buoys: small diamonds, never over a pier label. */
  const buoyEls = new Map();
  function buoyLook(b) {
    const u = state.units;
    if (state.layer === 'wind') return b.windMph == null ? null : { color: colorAt('wind', b.windMph), text: fmtWind(b.windMph, u.wind) };
    if (state.layer === 'waves') return b.wavesFt == null ? null : { color: colorAt('waves', b.wavesFt), text: (u.length === 'm' ? b.wavesFt * 0.3048 : b.wavesFt).toFixed(1) };
    if (b.waterF == null) return null;
    return { color: colorAt('temp', b.waterF), text: `${Math.round(toTemp(b.waterF, u.temp))}°` };
  }
  function drawBuoys(z, W, H, free) {
    const seen = new Set();
    if (state.buoysOn && z >= 5.2) {
      for (const b of state.buoys) {
        const look = buoyLook(b); if (!look) continue;
        const pt = map.project([b.lon, b.lat]);
        if (pt.x < -30 || pt.y < -30 || pt.x > W + 30 || pt.y > H + 30) continue;
        const w = 20 + look.text.length * 7, sel = state.selectedBuoy === b.id;
        if (!sel && !free([pt.x - w / 2 - 2, pt.y - 12, pt.x + w / 2 + 2, pt.y + 12])) continue;
        let el = buoyEls.get(b.id);
        if (!el) {
          el = document.createElement('button'); el.type = 'button'; el.className = 'lm-buoy';
          el.innerHTML = '<span class="lm-bdot"></span><span class="lm-bval"></span>';
          el.addEventListener('click', (e) => { e.stopPropagation(); emit('buoyTap', b.id); });
          markerLayer.appendChild(el); buoyEls.set(b.id, el);
        }
        seen.add(b.id);
        el.style.display = ''; el.style.transform = `translate(${pt.x}px, ${pt.y}px)`;
        const observationTime = state.layer === 'wind' || state.layer === 'waves' ? (b.weatherTime || b.time) : (b.waterTime || b.time);
        const ageMinutes = Math.max(0, Math.round((Date.now() - Date.parse(observationTime)) / 60000));
        el.dataset.dim = state.buoyDim ? '1' : ''; el.dataset.sel = sel ? '1' : ''; el.dataset.stale = ageMinutes > 90 ? '1' : '';
        el.querySelector('.lm-bdot').style.background = look.color;
        el.querySelector('.lm-bval').textContent = look.text;
        el.setAttribute('aria-label', `Buoy ${b.name}: ${look.text} observed ${ageMinutes} minutes ago`);
      }
    }
    for (const [id, el] of buoyEls) if (!seen.has(id)) el.style.display = 'none';
  }

  const labeler = new BandLabeler(store, isWater);
  function drawOverlay() {
    const dpr = window.devicePixelRatio || 1, W = container.clientWidth, H = container.clientHeight;
    if (overlay.width !== W * dpr) { overlay.width = W * dpr; overlay.height = H * dpr; }
    const X = overlay.getContext('2d'); X.setTransform(dpr, 0, 0, dpr, 0, 0); X.clearRect(0, 0, W, H);
    const z = map.getZoom(), boxes = state.boxes.slice();
    const free = (b) => { for (const q of boxes) if (b[0] < q[2] && b[2] > q[0] && b[1] < q[3] && b[3] > q[1]) return false; boxes.push(b); return true; };
    if (z < 6.6) {
      X.font = "600 11px 'DM Sans', system-ui, sans-serif"; X.textAlign = 'center'; X.textBaseline = 'middle';
      for (const l of LAKE_LABELS) {
        const p = map.project([l[1], l[2]]); if (p.x < 40 || p.x > W - 40 || p.y < 0 || p.y > H) continue;
        X.save(); X.translate(p.x, p.y); X.rotate(l[3] * Math.PI / 180); X.fillStyle = `rgba(255,255,255,${(0.62 * (1 - Math.max(0, Math.min(1, (z - 6.2) / 0.4)))).toFixed(2)})`;
        X.fillText(l[0].split('').join(' '), 0, 0); X.restore();
      }
    }
    if (!bm) drawTowns(X, W, H, z, free);
    if (bandSpec(state.layer, state.units)) {
      if (state.animating) fadeOutBandLabels(X, W, H);
      else drawBandLabels(X, W, H, z, free);
    }
  }
  /*
   * While the forecast plays (or the timeline is dragged) the band labels fade
   * out instead of jumping to new spots every hour; they fade back in, placed
   * for the new hour, as soon as the motion stops.
   */
  let labelFade = 1, fadeClock = 0;
  function fadeOutBandLabels(X) {
    const now = performance.now();
    labelFade = Math.max(0, labelFade - (fadeClock ? now - fadeClock : 16) / 180); fadeClock = now;
    fade = new Map(); // fresh placements fade in when motion stops
    if (labelFade <= 0 || !state.drawn) return;
    X.font = "700 11px 'JetBrains Mono', monospace"; X.textAlign = 'center'; X.textBaseline = 'middle';
    X.globalAlpha = labelFade;
    for (const a of state.drawn) {
      const p = map.project([a.lon, a.lat]);
      X.lineWidth = 3.2; X.strokeStyle = 'rgba(6,16,26,0.62)'; X.strokeText(a.text, p.x, p.y);
      X.fillStyle = '#fff'; X.fillText(a.text, p.x, p.y);
    }
    X.globalAlpha = 1;
    setTimeout(refresh, 16);
  }
  /* Town names on land, for orientation. */
  function drawTowns(X, W, H, z, free) {
    if (z < 4.9) return;
    const pierNames = new Set(state.piers.map((p) => p.name));
    X.font = "600 11px 'DM Sans', system-ui, sans-serif"; X.textBaseline = 'middle';
    for (const [name, lon, lat, tier] of TOWNS) {
      if (tier === 2 && z < 6.3) continue;
      if (pierNames.has(name)) continue;
      const p = map.project([lon, lat]); if (p.x < -60 || p.x > W + 60 || p.y < -20 || p.y > H + 20) continue;
      const tw = X.measureText(name).width;
      let side = 1;
      if (!free([p.x - 3, p.y - 3, p.x + 3, p.y + 3])) continue;
      let box = [p.x + 6, p.y - 8, p.x + 8 + tw, p.y + 8];
      if (!free(box)) { side = -1; box = [p.x - 8 - tw, p.y - 8, p.x - 6, p.y + 8]; if (!free(box)) continue; }
      X.fillStyle = 'rgba(230,238,245,0.75)'; X.fillRect(p.x - 2, p.y - 2, 4, 4);
      X.textAlign = side > 0 ? 'left' : 'right';
      X.lineWidth = 3; X.strokeStyle = 'rgba(6,16,26,0.75)'; X.strokeText(name, p.x + side * 7, p.y);
      X.fillStyle = 'rgba(230,238,245,0.82)'; X.fillText(name, p.x + side * 7, p.y);
    }
  }
  /* One label inside each band, at its most interior point (see bandLabels.js). */
  let lastAnchors = null, lastAnchorKey = '', fade = new Map(), lastDraw = 0, fadeReady = false;
  function drawBandLabels(X, W, H, z, free) {
    const kind = state.layer === 'species' ? 'temp' : state.layer;
    const key = `${kind}|${JSON.stringify(state.units)}`;
    const hour = Math.round(state.t); framesFor(kind, hour);
    const anchors = labeler.compute(state.layer, hour, state.units, framesAt(kind, hour));
    if (anchors) { lastAnchors = anchors; lastAnchorKey = key; }
    const list = anchors || (lastAnchorKey === key ? lastAnchors : null); if (!list) return;
    const world = 512 * Math.pow(2, z);
    X.font = "700 11px 'JetBrains Mono', monospace"; X.textAlign = 'center'; X.textBaseline = 'middle';
    labelFade = 1; fadeClock = 0;
    const sameBand = []; let n = 0; state.drawn = [];
    const now = performance.now(), seen = new Map(); let again = false;
    const bnd = map.getBounds(), pad = 0.05;
    for (const a of list) {
      if (n >= 16) break;
      if (a.lon < bnd.getWest() - pad || a.lon > bnd.getEast() + pad || a.lat < bnd.getSouth() - pad || a.lat > bnd.getNorth() + pad) continue;
      // Keep geographic anchors steady between whole-hour recomputations, but
      // never show a label whose band disagrees with the continuously blended
      // field currently on screen.
      const spec = bandSpec(state.layer, state.units);
      const sampled = sampleFast(a.lon, a.lat, state.t);
      const nativeValue = kind === 'temp' ? sampled.temp : kind === 'waves' ? sampled.waves : sampled.wind;
      const liveBand = Number.isFinite(nativeValue) && spec
        ? bandIndex(nativeValue * spec.a + spec.b, spec.width)
        : null;
      if (liveBand !== a.band) continue;
      const pxR = a.r * world / 360 / Math.cos(a.lat * Math.PI / 180);
      const tw = X.measureText(a.text).width;
      if (pxR < Math.max(11, tw * 0.5)) continue;
      const p = map.project([a.lon, a.lat]);
      if (p.x < tw / 2 + 6 || p.x > W - tw / 2 - 6 || p.y < 12 || p.y > H - 12) continue;
      if (sameBand.some((q) => q.band === a.band && Math.hypot(q.x - p.x, q.y - p.y) < 170)) continue;
      if (!free([p.x - tw / 2 - 5, p.y - 10, p.x + tw / 2 + 5, p.y + 10])) continue;
      sameBand.push({ band: a.band, x: p.x, y: p.y }); n++; state.drawn.push({ text: a.text, lon: a.lon, lat: a.lat });
      // new labels fade in instead of popping
      const id = `${a.text}@${a.lon},${a.lat}`, alpha = Math.min(1, (fade.get(id) ?? (fadeReady ? 0 : 1)) + (now - lastDraw) / 220);
      seen.set(id, alpha); if (alpha < 1) again = true;
      X.globalAlpha = alpha;
      X.lineWidth = 3.2; X.strokeStyle = 'rgba(6,16,26,0.62)'; X.strokeText(a.text, p.x, p.y);
      X.fillStyle = '#fff'; X.fillText(a.text, p.x, p.y);
      X.globalAlpha = 1;
    }
    fade = seen; lastDraw = now; fadeReady = true;
    if (again) setTimeout(refresh, 16);
  }
  /* Decoded frames around hour t (null until both are loaded). */
  function framesAt(kind, t) {
    const br = store.bracket(t);
    const a = resolved(store.loaded(store.framePath(kind, br.ia))), b = resolved(store.loaded(store.framePath(kind, br.ib)));
    return a && b ? [a, b] : null;
  }

  let raf = 0;
  const refresh = () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; drawMarkers(); drawOverlay(); emit('view', { center: map.getCenter(), zoom: map.getZoom() }); }); };
  map.on('move', refresh); map.on('resize', refresh);
  // re-check once the shoreline tiles for a new view have arrived (precise land/water test)
  map.on('sourcedata', (e) => { if (e.sourceId === 'lakes-hd' && e.isSourceLoaded) refresh(); });
  store.onLoad(refresh);
  map.on('click', (e) => emit('mapTap', { lon: e.lngLat.lng, lat: e.lngLat.lat }));

  const api = {
    map, store, sampleAt, isWater, waterKind,
    get state() { return state; },
    setTime(t) { state.t = Math.max(0, Math.min(store.maxHour, t)); store.prefetch(state.t, ['temp', 'wind', 'waves'], 2); field.set({ t: state.t }); particles.set({ t: state.t }); refresh(); },
    setLayer(layer) {
      state.layer = layer;
      field.set({ layer: layer === 'species' ? 'temp' : layer, band: bandSpec(layer, state.units), species: layer === 'species' ? state.species : null,
        hidden: layer === 'depth' && statics.dem });
      statics.setLayer(layer);
      // no wind streaks over the depth chart: the contour lines are the point there
      particles.set({ brightness: layer === 'wind' ? 0.75 : 0.4, visible: state.streaks !== false && !state.paused && layer !== 'depth' }); refresh();
    },
    setSpecies(sp) { state.species = sp; if (state.layer === 'species') field.set({ species: sp }); refresh(); },
    setUnits(units) { Object.assign(state.units, units); field.set({ units: state.units, band: bandSpec(state.layer, state.units) }); statics.setUnits(state.units); refresh(); },
    /** Stops all drawing work (streaks, repaints) while the map is covered or in the background. */
    setPaused(paused) {
      state.paused = !!paused;
      particles.set({ visible: !state.paused && state.streaks && state.layer !== 'depth' });
      if (!state.paused) refresh();
    },
    setOptions({ lines, streaks }) {
      if (lines !== undefined) { state.lines = lines; field.set({ lines }); }
      if (streaks !== undefined) { state.streaks = streaks; particles.set({ visible: streaks && !state.paused && state.layer !== 'depth' }); }
      refresh();
    },
    /**
     * The forecast is moving (playing at `hoursPerSecond`, or being dragged):
     * decode further ahead and fade the band labels. false when it stops.
     */
    setAnimating(on, hoursPerSecond = 0) {
      state.animating = !!on;
      store.setLookahead(on ? hoursPerSecond * 1.5 + 2 : 0);
      if (on) store.prefetch(state.t, ['temp', 'wind', 'waves']);
      refresh();
    },
    /** true when everything drawn at hour t is decoded and on the GPU, so playback can move there without a hitch. */
    ready(t) {
      const kinds = [];
      if (state.layer !== 'depth') kinds.push(state.layer === 'species' ? 'temp' : state.layer); // depth never changes with time
      if (particles.visible) kinds.push('wind');
      // the color field also needs the hours on either side (smooth motion) uploaded
      const br = store.bracket(t), last = store.hours.length - 1;
      const around = [br.ia - 1, br.ia, br.ib, br.ib + 1].filter((i) => i >= 0 && i <= last);
      return kinds.every((kind) => store.isLoaded(kind, t) && (kind !== field.kind() || around.every((i) => field.hasTexture(store.framePath(kind, i)))));
    },
    setPiers(piers) { state.piers = piers; refresh(); },
    setSelected(id) { state.selected = id; refresh(); },
    setAlerts(alerts) { state.alerts = alerts; refresh(); },
    /** Observed buoy readings [{id, name, lat, lon, time, waterF, windMph, windFrom, wavesFt, …}] */
    setBuoys(list) { state.buoys = Array.isArray(list) ? list : []; refresh(); },
    setBuoyOptions({ on, dim, selected }) {
      if (on !== undefined) state.buoysOn = !!on;
      if (dim !== undefined) state.buoyDim = !!dim;
      if (selected !== undefined) state.selectedBuoy = selected;
      refresh();
    },
    /** NWS alert areas (GeoJSON from nws.js alertShapes) and whether to draw them */
    setNwsAreas(geojson) { map.getSource('nws').setData(geojson || { type: 'FeatureCollection', features: [] }); },
    /** Only alerts in force at this moment (ms) are drawn — follows the timeline. */
    setNwsTime(ms) {
      const f = ['all', ['<=', ['get', 's'], ms], ['>', ['get', 'e'], ms]];
      ['nws-fill', 'nws-line'].forEach((id) => map.setFilter(id, f));
    },
    setNwsVisible(on) { ['nws-fill', 'nws-line'].forEach((id) => map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none')); },
    fitBox(b, padding) { map.fitBounds([[b[0], b[1]], [b[2], b[3]]], { padding: padding || 60, duration: 800, maxZoom: 9.5 }); },
    flyTo(lon, lat, zoom, offset) { map.flyTo({ center: [lon, lat], zoom, offset: offset || [0, 0], speed: 1.4, curve: 1.3, essential: true }); },
    fitAll() { map.fitBounds([[-92.2, 41.3], [-76.0, 49.0]], { padding: { top: 180, bottom: 170, left: 10, right: 10 }, duration: 900 }); },
    on(name, fn) { (listeners[name] = listeners[name] || []).push(fn); },
    project(lon, lat) { return map.project([lon, lat]); },
    unproject(x, y) { const p = map.unproject([x, y]); return [p.lng, p.lat]; },
    palette: PALETTES,
    attribution: bm || hd ? ATTRIBUTION : 'NOAA · <a href="https://glos.org/" target="_blank" rel="noopener">GLOS</a> · Weather data by <a href="https://open-meteo.com/" target="_blank" rel="noopener">Open-Meteo</a>',
  };
  api.setLayer('temp');
  refresh();
  return api;
}
