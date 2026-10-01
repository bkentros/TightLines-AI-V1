/**
 * Static vector layers for the Live Lake Map prototype.
 * - lakes: Great Lakes water polygons (GLATOS shoreline, public domain GLFC/USGS derived)
 * - land: everything that is not Great Lakes water inside the map area, drawn ABOVE the
 *   color field so the coastline is a crisp vector edge at every zoom
 * - inland: other lakes (Natural Earth 10m), drawn as plain dark water
 * - borders: state / national lines (us-atlas, Natural Earth)
 * The production job replaces the shoreline with OpenStreetMap land polygons.
 */
import fs from 'node:fs';
import * as shapefile from 'shapefile';
import * as topo from '../../geo/node_modules/topojson-client/src/index.js';

const OUT = process.argv[2] || 'public/data/geo.json';
const r5 = (v) => Math.round(v * 1e5) / 1e5;
const shore = await shapefile.read(new URL('../../geo/sh/shoreline.shp', import.meta.url).pathname);
const lakePolys = [];
shore.features.forEach((f) => { (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates).forEach((p) => lakePolys.push(p.map((ring) => ring.map((q) => [r5(q[0]), r5(q[1])])))); });
const OUTER = [[-99, 37], [-66, 37], [-66, 54], [-99, 54], [-99, 37]];
/* land = big box with every lake outer ring as a hole, plus each island as its own polygon */
const signed = (r) => { let a = 0; for (let i = 0; i < r.length - 1; i++) a += r[i][0] * r[i + 1][1] - r[i + 1][0] * r[i][1]; return a / 2; };
const orient = (r, ccw) => (signed(r) > 0) === ccw ? r : r.slice().reverse();
/* outer box counterclockwise, lake holes clockwise, islands as their own counterclockwise polygons */
const land = [[orient(OUTER, true), ...lakePolys.map((p) => orient(p[0], false))], ...lakePolys.flatMap((p) => p.slice(1).map((isl) => [orient(isl, true)]))];
const ne = JSON.parse(fs.readFileSync(new URL('../../geo/node_modules/@geo-maps/earth-lakes-10m/map.geo.json', import.meta.url))).geometries[0].coordinates;
const inland = [];
for (const poly of ne) {
  const ring = poly[0]; let a = 999, b = 999, c = -999, d = -999;
  for (const q of ring) { a = Math.min(a, q[0]); b = Math.min(b, q[1]); c = Math.max(c, q[0]); d = Math.max(d, q[1]); }
  if (c < -97 || a > -70 || d < 39 || b > 52) continue;
  if ((c - a) * (d - b) > 0.3 || (c - a) * (d - b) < 0.004) continue; // skip the Great Lakes themselves and specks
  inland.push(poly.map((rg) => rg.map((q) => [Math.round(q[0] * 1e4) / 1e4, Math.round(q[1] * 1e4) / 1e4])));
}
const st = JSON.parse(fs.readFileSync(new URL('../../geo/node_modules/us-atlas/states-10m.json', import.meta.url)));
const states = topo.mesh(st, st.objects.states, (x, y) => x !== y);
const nation = topo.mesh(st, st.objects.nation);
const clip = (ml) => ml.coordinates.map((l) => l.filter((q) => q[0] > -99 && q[0] < -66 && q[1] > 37 && q[1] < 54).map((q) => [r5(q[0]), r5(q[1])])).filter((l) => l.length > 1);
const fc = (features) => ({ type: 'FeatureCollection', features });
const out = {
  lakes: fc(lakePolys.map((p) => ({ type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: p } }))),
  land: fc([{ type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: land } }]),
  inland: fc([{ type: 'Feature', properties: {}, geometry: { type: 'MultiPolygon', coordinates: inland } }]),
  borders: fc([
    { type: 'Feature', properties: { kind: 'state' }, geometry: { type: 'MultiLineString', coordinates: clip(states) } },
    { type: 'Feature', properties: { kind: 'nation' }, geometry: { type: 'MultiLineString', coordinates: clip(nation) } },
  ]),
};
fs.writeFileSync(OUT, JSON.stringify(out));
console.log('geo', (fs.statSync(OUT).size / 1024 | 0) + 'KB', 'inland', inland.length);
