/**
 * Builds the map page (dist/): index.html + app.js + a self-hosted MapLibre
 * runtime and worker. Keep the historical CSP filenames: publish.py and the
 * installed app contract intentionally treat them as stable asset names.
 * The same files are published twice by static-build/publish.py:
 *   proto/  – open in a phone browser for testing
 *   map/    – loaded by the FinFindr app's web view (app/pier-cast-map.tsx)
 * Run: npm run build:page   (then copy dist/* to static-build/proto/ and publish)
 */
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import crypto from 'node:crypto';

const out = process.argv[2] || 'dist';
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
await esbuild.build({ entryPoints: ['src/prototype.js'], bundle: true, minify: true, format: 'iife', target: 'es2019', outfile: `${out}/app.js`, alias: { 'maplibre-gl': './src/shim-maplibre.js' } });
await esbuild.build({ entryPoints: ['src/maplibre-global.js'], bundle: true, minify: true, format: 'iife', target: 'es2022', outfile: `${out}/maplibre-gl-csp.js` });
await esbuild.build({ entryPoints: ['node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs'], bundle: true, minify: true, format: 'esm', target: 'es2022', outfile: `${out}/maplibre-gl-csp-worker.js` });
const css = fs.readFileSync('node_modules/maplibre-gl/dist/maplibre-gl.css', 'utf8');
const html = fs.readFileSync('src/index.html', 'utf8').replace('/*__MAPLIBRE_CSS__*/', css);
// version the scripts by content, so phones can keep them for a year and
// still pick up a new build the moment index.html points at it
const ver = (f) => crypto.createHash('sha256').update(fs.readFileSync(`${out}/${f}`)).digest('hex').slice(0, 10);
const workerMarker = 'maplibre-gl-csp-worker.js';
const appPath = `${out}/app.js`;
const app = fs.readFileSync(appPath, 'utf8');
if (app.split(workerMarker).length - 1 !== 1) throw new Error('MapLibre worker URL changed: update the versioning in build.mjs');
fs.writeFileSync(appPath, app.replace(workerMarker, `${workerMarker}?v=${ver(workerMarker)}`));
const page = html
  .replace('src="maplibre-gl-csp.js"', `src="maplibre-gl-csp.js?v=${ver('maplibre-gl-csp.js')}"`)
  .replace('src="app.js"', `src="app.js?v=${ver('app.js')}"`);
if ((page.match(/\?v=/g) || []).length !== 2) throw new Error('index.html script tags changed: update the versioning in build.mjs');
fs.writeFileSync(`${out}/index.html`, page);
// sample frames (npm run sample) for trying the page without the storage bucket
if (fs.existsSync('public/data')) fs.cpSync('public/data', `${out}/data`, { recursive: true });
console.log('built', fs.readdirSync(out).join(' '));
