/**
 * Phase 4 static layers for the Live Lake Map:
 *   - lakes-v2.pmtiles: OpenStreetMap land + shoreline (sharp to zoom 14+),
 *     NOAA depth contours in feet
 *   - depth-v1.pmtiles: NOAA NCEI bathymetry as Terrarium DEM tiles
 *     (depth colors, relief shading, depth readout)
 *   - OpenFreeMap base map (roads, towns, inland lakes, borders) in a navy style
 * Everything here is optional: without `staticUrl` the engine keeps its
 * built-in coarse shoreline, and without `basemap` no roads or towns are drawn.
 */
import maplibregl from 'maplibre-gl';
import { PMTiles, Protocol } from 'pmtiles';
import { StoredSource } from './tileStore.js';
import { PALETTES } from './scales.js';

const LAND = '#12253A';
const OFM = 'https://tiles.openfreemap.org/planet';
export const GLYPHS = 'https://tiles.openfreemap.org/fonts/{fontstack}/{range}.pbf';
export const ATTRIBUTION = '© OpenStreetMap contributors · © OpenMapTiles · OpenFreeMap · NOAA';
/** bump when static/*.pmtiles are rebuilt and re-uploaded */
export const STATIC_REV = '4.3';
let protocol = null;


export function addStaticLayers(map, { staticUrl, basemap, pierNames = [], before }) {
  const out = { hd: false, dem: false, basemap: !!basemap, depthAt: () => NaN, setLayer() {}, setUnits() {} };
  if (staticUrl) {
    if (!protocol) { protocol = new Protocol(); maplibregl.addProtocol('pmtiles', protocol.tile); }
    const base = new URL(staticUrl, location.href).href.replace(/\/?$/, '/');
    // the revision tag makes phones fetch fresh tiles whenever the files are rebuilt
    const lakes = new PMTiles(new StoredSource(`${base}lakes-v2.pmtiles?r=${STATIC_REV}`, STATIC_REV));
    const dem = new PMTiles(new StoredSource(`${base}depth-v1.pmtiles?r=${STATIC_REV}`, STATIC_REV));
    protocol.add(lakes); protocol.add(dem);
    map.addSource('lakes-hd', { type: 'vector', url: `pmtiles://${lakes.source.getKey()}` });
    map.addSource('dem', { type: 'raster-dem', url: `pmtiles://${dem.source.getKey()}`, encoding: 'terrarium', tileSize: 256 });
    out.hd = true; out.dem = true;

    // depth colors (NOAA grid) + soft relief, only on the Depth layer
    const p = PALETTES.depth, M = 0.3048;
    const stops = [];
    p.stops.slice().reverse().forEach(([ft, c]) => stops.push(-ft * M, c));
    stops.push(0.4, 'rgba(0,0,0,0)');
    map.addLayer({ id: 'depth-relief', type: 'color-relief', source: 'dem', layout: { visibility: 'none' },
      paint: { 'color-relief-color': ['interpolate', ['linear'], ['elevation'], ...stops], 'color-relief-opacity': 1 } }, before);
    map.addLayer({ id: 'depth-shade', type: 'hillshade', source: 'dem', layout: { visibility: 'none' },
      paint: { 'hillshade-exaggeration': 0.45, 'hillshade-shadow-color': 'rgba(4,12,28,0.9)', 'hillshade-highlight-color': 'rgba(255,255,255,0.25)', 'hillshade-accent-color': 'rgba(0,0,0,0)' } }, before);
    // depth lines sit under the land, so the real shoreline trims them
    map.addLayer({ id: 'contours', type: 'line', source: 'lakes-hd', 'source-layer': 'contours', layout: { visibility: 'none', 'line-join': 'round' },
      paint: { 'line-color': ['case', ['==', ['get', 'major'], 1], 'rgba(255,255,255,0.78)', 'rgba(255,255,255,0.45)'],
        'line-width': ['interpolate', ['linear'], ['zoom'], 6, ['case', ['==', ['get', 'major'], 1], 1.0, 0.7], 12, ['case', ['==', ['get', 'major'], 1], 1.8, 1.1]] } }, before);
    // precise land (covers the color field right to the real shoreline)
    map.addLayer({ id: 'land-hd', type: 'fill', source: 'lakes-hd', 'source-layer': 'land', minzoom: 4,
      paint: { 'fill-color': LAND, 'fill-antialias': true } }, before);
    // rivers and harbor lakes next to the Great Lakes (no lake-model data there, so plain water)
    map.addLayer({ id: 'inland-hd', type: 'fill', source: 'lakes-hd', 'source-layer': 'inland', minzoom: 7,
      paint: { 'fill-color': '#1E4A6C', 'fill-outline-color': 'rgba(240,246,250,0.55)' } }, before);

    // depth readout: decode the z10 DEM tile under a point (cached)
    const cache = new Map(), Z = 10;
    const tileOf = (lon, lat) => {
      const n = 2 ** Z, x = (lon + 180) / 360 * n, r = lat * Math.PI / 180;
      const y = (1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * n;
      return { x: Math.floor(x), y: Math.floor(y), px: Math.floor((x % 1) * 256), py: Math.floor((y % 1) * 256) };
    };
    out.depthAt = (lon, lat, onLoad) => {
      const t = tileOf(lon, lat), key = `${t.x}/${t.y}`;
      const c = cache.get(key);
      if (c === undefined) {
        cache.set(key, null);
        dem.getZxy(Z, t.x, t.y).then(async (res) => {
          if (!res) { cache.set(key, false); return; }
          const bmp = await createImageBitmap(new Blob([res.data], { type: 'image/png' }), { colorSpaceConversion: 'none', premultiplyAlpha: 'none' });
          const cv = document.createElement('canvas'); cv.width = cv.height = 256;
          const cx = cv.getContext('2d', { willReadFrequently: true }); cx.drawImage(bmp, 0, 0);
          cache.set(key, cx.getImageData(0, 0, 256, 256).data);
          if (cache.size > 64) cache.delete(cache.keys().next().value);
          onLoad && onLoad();
        }).catch(() => cache.set(key, false));
        return NaN;
      }
      if (!c) return NaN;
      const i = (t.py * 256 + t.px) * 4;
      const elev = c[i] * 256 + c[i + 1] + c[i + 2] / 256 - 32768;
      return elev < 0 ? -elev / M : NaN;   // feet of water
    };
  }

  if (basemap) {
    map.addSource('ofm', { type: 'vector', url: OFM });
    const hidePiers = ['!', ['in', ['get', 'name'], ['literal', pierNames]]];
    const L = (spec) => map.addLayer(spec, before);
    // rivers only: OpenStreetMap files the Great Lakes as ordinary lakes, so the base
    // map's water fill would paint over the color field. Inland lakes come from the
    // engine's own lake file instead (it leaves the Great Lakes out).
    L({ id: 'ofm-river', type: 'line', source: 'ofm', 'source-layer': 'waterway', minzoom: 8, filter: ['in', ['get', 'class'], ['literal', ['river', 'canal']]],
      paint: { 'line-color': '#0E2236', 'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.6, 14, 2.4] } });
    // piers and breakwalls (OpenStreetMap man_made=pier / breakwater), drawn like land over the water
    L({ id: 'ofm-pier-area', type: 'fill', source: 'ofm', 'source-layer': 'transportation', minzoom: 11,
      filter: ['all', ['==', ['get', 'class'], 'pier'], ['==', ['geometry-type'], 'Polygon']],
      paint: { 'fill-color': LAND, 'fill-outline-color': 'rgba(240,246,250,0.8)' } });
    L({ id: 'ofm-pier-line', type: 'line', source: 'ofm', 'source-layer': 'transportation', minzoom: 11,
      filter: ['all', ['==', ['get', 'class'], 'pier'], ['==', ['geometry-type'], 'LineString']],
      layout: { 'line-cap': 'round' },
      paint: { 'line-color': 'rgba(236,242,248,0.9)', 'line-width': ['interpolate', ['exponential', 1.6], ['zoom'], 11, 1, 14, 3.5, 16, 9] } });
    const road = (id, classes, minzoom, color, w) => L({ id, type: 'line', source: 'ofm', 'source-layer': 'transportation', minzoom,
      filter: ['all', ['in', ['get', 'class'], ['literal', classes]], ['!=', ['get', 'brunnel'], 'tunnel']],
      layout: { 'line-join': 'round', 'line-cap': 'round' },
      paint: { 'line-color': color, 'line-width': ['interpolate', ['exponential', 1.5], ['zoom'], minzoom, w[0], 14, w[1]] } });
    road('ofm-road-minor', ['minor', 'service', 'track'], 12, 'rgba(255,255,255,0.07)', [0.4, 2]);
    road('ofm-road-mid', ['secondary', 'tertiary'], 9.5, 'rgba(255,255,255,0.1)', [0.4, 3]);
    road('ofm-road-main', ['primary', 'trunk'], 7, 'rgba(255,255,255,0.13)', [0.5, 4]);
    road('ofm-road-motorway', ['motorway'], 5.5, 'rgba(255,255,255,0.17)', [0.6, 4.5]);
    L({ id: 'ofm-state', type: 'line', source: 'ofm', 'source-layer': 'boundary', filter: ['all', ['==', ['get', 'admin_level'], 4], ['!=', ['get', 'maritime'], 1]],
      paint: { 'line-color': 'rgba(255,255,255,0.12)', 'line-width': 1 } });
    L({ id: 'ofm-nation', type: 'line', source: 'ofm', 'source-layer': 'boundary', filter: ['==', ['get', 'admin_level'], 2],
      paint: { 'line-color': 'rgba(255,255,255,0.25)', 'line-width': 1, 'line-dasharray': [3, 3] } });
    // names on top of everything drawn by MapLibre
    map.addLayer({ id: 'ofm-road-names', type: 'symbol', source: 'ofm', 'source-layer': 'transportation_name', minzoom: 12.5,
      filter: ['in', ['get', 'class'], ['literal', ['motorway', 'trunk', 'primary', 'secondary', 'tertiary']]],
      layout: { 'symbol-placement': 'line', 'text-field': ['get', 'name'], 'text-font': ['Noto Sans Regular'], 'text-size': 10.5 },
      paint: { 'text-color': 'rgba(220,230,240,0.55)', 'text-halo-color': 'rgba(10,22,36,0.9)', 'text-halo-width': 1.2 } });
    map.addLayer({ id: 'ofm-places', type: 'symbol', source: 'ofm', 'source-layer': 'place',
      filter: ['all', hidePiers, ['any',
        ['==', ['get', 'class'], 'city'],
        ['all', ['==', ['get', 'class'], 'town'], ['>=', ['zoom'], 7.5]],
        ['all', ['in', ['get', 'class'], ['literal', ['village', 'suburb']]], ['>=', ['zoom'], 10.5]],
        ['all', ['==', ['get', 'class'], 'hamlet'], ['>=', ['zoom'], 12.5]]]],
      layout: { 'text-field': ['coalesce', ['get', 'name:en'], ['get', 'name']],
        'text-font': ['match', ['get', 'class'], 'city', ['literal', ['Noto Sans Bold']], ['literal', ['Noto Sans Regular']]],
        'text-size': ['match', ['get', 'class'], 'city', 12.5, 'town', 11.5, 10.5], 'text-max-width': 8, 'text-padding': 4,
        'symbol-sort-key': ['-', 0, ['coalesce', ['get', 'rank'], 0]] },
      paint: { 'text-color': 'rgba(226,234,242,0.78)', 'text-halo-color': 'rgba(9,20,33,0.92)', 'text-halo-width': 1.4 } });
  }

  if (out.hd && basemap) {
    // contour labels need the base map's fonts
    map.addLayer({ id: 'contour-labels', type: 'symbol', source: 'lakes-hd', 'source-layer': 'contours', minzoom: 6,
      filter: ['==', ['get', 'major'], 1], layout: { visibility: 'none', 'symbol-placement': 'line', 'symbol-spacing': 280,
        'text-field': ['concat', ['to-string', ['get', 'ft']], ' ft'], 'text-font': ['Noto Sans Regular'], 'text-size': 10 },
      paint: { 'text-color': 'rgba(235,242,248,0.85)', 'text-halo-color': 'rgba(10,30,60,0.9)', 'text-halo-width': 1.2 } });
  }

  const vis = (id, on) => map.getLayer(id) && map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none');
  out.setLayer = (layer) => {
    const depth = layer === 'depth' && out.dem;
    ['depth-relief', 'depth-shade', 'contours', 'contour-labels'].forEach((id) => vis(id, depth));
  };
  out.setUnits = (units) => {
    if (!map.getLayer('contour-labels')) return;
    map.setLayoutProperty('contour-labels', 'text-field', units.length === 'm'
      ? ['concat', ['to-string', ['round', ['*', ['get', 'ft'], 0.3048]]], ' m']
      : ['concat', ['to-string', ['get', 'ft']], ' ft']);
  };
  return out;
}
