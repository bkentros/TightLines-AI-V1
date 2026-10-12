import { createHmac, randomBytes } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from '../../../TightLinesAI/web/lake-map/node_modules/playwright-core/index.mjs';

const label = process.argv[2];
if (!/^(thredds|nodd)$/.test(label || '')) throw new Error('usage: node capture-staging.mjs thredds|nodd');
const root = path.resolve(import.meta.dirname, '../../..');
const env = await readFile(path.join(root, 'TightLinesAI/.env'), 'utf8');
const secret = env.match(/^\s*(?:export\s+)?PIER_CAST_MAP_PASS_SECRET\s*[=:]\s*['"]?([^'"\s]+)/m)?.[1];
if (!secret) throw new Error('PIER_CAST_MAP_PASS_SECRET is unavailable');
const b64u = (value) => Buffer.from(value).toString('base64url');
const payload = `v1.${Math.floor(Date.now() / 1000) + 7200}.${b64u(randomBytes(12))}`;
const ticket = `${payload}.${b64u(createHmac('sha256', secret).update(payload).digest())}`;
const base = 'https://piercast-map-gate-staging.finfindr.workers.dev';
const outDir = path.join(import.meta.dirname, 'screenshots', label);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
  args: ['--disable-gpu-sandbox'],
});
const results = [];
const cases = [
  { name: 'superior', lon: -87.5, lat: 47.5 },
  { name: 'ontario', lon: -77.8, lat: 43.7 },
];
for (const viewport of [{ width: 393, height: 852 }, { width: 320, height: 568 }]) {
  for (const lake of cases) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const response = await page.goto(`${base}/map/index.html?t=${encodeURIComponent(ticket)}`, { waitUntil: 'domcontentloaded', timeout: 120000 });
    await page.waitForFunction(() => window.__lm && document.querySelector('#temp-depth-layer'), null, { timeout: 120000 });
    await page.click('#layers');
    await page.waitForFunction(() => {
      const button = document.querySelector('#temp-depth-layer');
      return button && !button.hidden && !button.disabled;
    }, null, { timeout: 120000 });
    await page.click('#temp-depth-layer');
    await page.waitForFunction(() => document.querySelector('#temp-depth-layer')?.getAttribute('aria-pressed') === 'true', null, { timeout: 120000 });
    await page.click('#sheet-layers [data-close]');
    await page.evaluate(({ lon, lat }) => window.__lm.flyTo(lon, lat, 6.5), lake);
    await page.waitForTimeout(3500);
    const state = await page.evaluate(async ({ lon, lat }) => {
      const latest = await fetch('/latest.json', { cache: 'no-store' }).then((r) => r.json());
      const pointer = await fetch(`/runs/tdepth/latest.json?surface=${encodeURIComponent(latest.run)}`, { cache: 'no-store' }).then((r) => r.json());
      const sample = window.__lm.sampleAt(lon, lat);
      const button = document.querySelector('#temp-depth-layer');
      return {
        run: latest.run,
        cycle: latest.cycle,
        depthRun: pointer.run,
        depthBase: pointer.base,
        sourceDistribution: pointer.sourceDistribution,
        depthsFt: pointer.depthsFt,
        depthVisible: !button.hidden,
        depthEnabled: !button.disabled,
        depthSelected: button.getAttribute('aria-pressed') === 'true',
        selectedDepthLabel: document.querySelector('#ro-depth-label')?.textContent,
        sampleTempF: Number.isFinite(sample?.tempDepth) ? Number(sample.tempDepth.toFixed(2)) : null,
      };
    }, lake);
    const file = `${viewport.width}x${viewport.height}-${lake.name}.png`;
    await page.screenshot({ path: path.join(outDir, file) });
    results.push({ source: label, viewport: `${viewport.width}x${viewport.height}`, lake: lake.name, status: response?.status(), screenshot: file, ...state });
    await context.close();
  }
}
await browser.close();
await writeFile(path.join(import.meta.dirname, `browser-results-${label}.json`), JSON.stringify(results, null, 2) + '\n');
console.log(JSON.stringify(results));
