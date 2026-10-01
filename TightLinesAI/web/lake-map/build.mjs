/**
 * Builds the map page (dist/): index.html + app.js + MapLibre's CSP build.
 * The same files are published twice by static-build/publish.py:
 *   proto/  – open in a phone browser for testing
 *   map/    – loaded by the FinFindr app's web view (app/pier-cast-map.tsx)
 * Run: npm run build:page   (then copy dist/* to static-build/proto/ and publish)
 */
import * as esbuild from 'esbuild';
import fs from 'node:fs';

const out = process.argv[2] || 'dist';
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
await esbuild.build({ entryPoints: ['src/prototype.js'], bundle: true, minify: true, format: 'iife', target: 'es2019', outfile: `${out}/app.js`, alias: { 'maplibre-gl': './src/shim-maplibre.js' } });
for (const f of ['maplibre-gl-csp.js', 'maplibre-gl-csp-worker.js']) fs.copyFileSync(`node_modules/maplibre-gl/dist/${f}`, `${out}/${f}`);
const css = fs.readFileSync('node_modules/maplibre-gl/dist/maplibre-gl.css', 'utf8');
const cities = JSON.stringify(JSON.parse(fs.readFileSync('src/cities.json', 'utf8')));
const html = fs.readFileSync('src/index.html', 'utf8').replace('/*__MAPLIBRE_CSS__*/', css).replace('/*__CITIES__*/[]', cities);
fs.writeFileSync(`${out}/index.html`, html);
// sample frames (npm run sample) for trying the page without the storage bucket
if (fs.existsSync('public/data')) fs.cpSync('public/data', `${out}/data`, { recursive: true });
console.log('built', fs.readdirSync(out).join(' '));
