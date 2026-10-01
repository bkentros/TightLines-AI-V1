import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { verifyPass } from '../gate/worker.js';

const SECRET = 'x'.repeat(64);
const b64u = (bytes) => Buffer.from(bytes).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function makePass(secret = SECRET, expiry = Math.floor(Date.now() / 1000) + 3600) {
  const payload = `v1.${expiry}.${b64u(crypto.getRandomValues(new Uint8Array(12)))}`;
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return `${payload}.${b64u(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))))}`;
}

const FILES = {
  'map/index.html': { body: '<html>map</html>', meta: { contentType: 'text/html', cacheControl: 'public, max-age=60' } },
  'latest.json': { body: 'gz', meta: { contentType: 'application/json', contentEncoding: 'gzip', cacheControl: 'public, max-age=120' } },
  'static/lakes-v2.pmtiles': { body: '0123456789', meta: { contentType: 'application/vnd.pmtiles' } },
  'proto/index.html': { body: 'old', meta: { contentType: 'text/html' } },
};
const BUCKET = {
  async get(key, opts) {
    const f = FILES[key]; if (!f) return null;
    const range = opts?.range?.get?.('range');
    const m = range && /bytes=(\d+)-(\d+)/.exec(range);
    const body = m ? f.body.slice(+m[1], +m[2] + 1) : f.body;
    return {
      size: f.body.length, httpEtag: '"e"', body: new Blob([body]).stream(),
      range: m ? { offset: +m[1], length: +m[2] - +m[1] + 1 } : undefined,
      writeHttpMetadata(h) {
        if (f.meta.contentType) h.set('content-type', f.meta.contentType);
        if (f.meta.contentEncoding) h.set('content-encoding', f.meta.contentEncoding);
        if (f.meta.cacheControl) h.set('cache-control', f.meta.cacheControl);
      },
    };
  },
};
const env = { BUCKET, MAP_PASS_SECRET: SECRET };
const get = (path, headers = {}) => worker.fetch(new Request(`https://map.finfindr.app${path}`, { headers }), env);

test('passes: signed, unexpired, right secret', async () => {
  assert.ok(await verifyPass(await makePass(), SECRET));
  assert.ok(!(await verifyPass(await makePass('y'.repeat(64)), SECRET)));
  assert.ok(!(await verifyPass(await makePass(SECRET, Math.floor(Date.now() / 1000) - 5), SECRET)));
  const good = await makePass();
  assert.ok(!(await verifyPass(good.replace(/^v1\.\d+/, 'v1.9999999999'), SECRET)));
  assert.ok(!(await verifyPass('nonsense', SECRET)));
  assert.ok(!(await verifyPass(good, '')));
});

test('no pass: nothing is served', async () => {
  for (const path of ['/', '/map/index.html', '/latest.json', '/static/lakes-v2.pmtiles']) {
    assert.equal((await get(path)).status, 401, path);
  }
  assert.equal((await get('/map/index.html?t=v1.1.a.b')).status, 401);
});

test('a pass in the link opens the page and becomes a cookie', async () => {
  const pass = await makePass();
  const r = await get(`/map/index.html?app=1&t=${pass}`);
  assert.equal(r.status, 200);
  assert.equal(await r.text(), '<html>map</html>');
  assert.match(r.headers.get('set-cookie'), /^pcmap=.*; Path=\/; Max-Age=\d+; Secure; HttpOnly; SameSite=Lax$/);
  assert.equal(r.headers.get('cache-control'), 'private, max-age=60');
  const withCookie = await get('/latest.json', { cookie: `other=1; pcmap=${encodeURIComponent(pass)}` });
  assert.equal(withCookie.status, 200);
  assert.equal(withCookie.headers.get('content-encoding'), 'gzip');
});

test('tile range requests, renewals and blocked paths', async () => {
  const cookie = `pcmap=${encodeURIComponent(await makePass())}`;
  const r = await get('/static/lakes-v2.pmtiles', { cookie, range: 'bytes=2-5' });
  assert.equal(r.status, 206);
  assert.equal(r.headers.get('content-range'), 'bytes 2-5/10');
  assert.equal(await r.text(), '2345');
  assert.equal((await get('/proto/index.html', { cookie })).status, 404);
  assert.equal((await get('/map/../proto/index.html', { cookie })).status, 404);
  assert.equal((await get('/nope.json', { cookie })).status, 404);
  const renew = await get(`/_pass?t=${await makePass()}`);
  assert.equal(renew.status, 204);
  assert.match(renew.headers.get('set-cookie'), /^pcmap=/);
});

import { parseLatestObs, parseStations } from '../gate/buoys.js';

const OBS = `#STN     LAT      LON  YYYY MM DD hh mm WDIR WSPD   GST WVHT  DPD APD MWD   PRES  PTDY  ATMP  WTMP  DEWP  VIS   TIDE
#text    deg      deg   yr mo day hr mn degT  m/s   m/s   m   sec sec degT   hPa   hPa  degC  degC  degC  nmi     ft
45007   42.674  -87.026 2026 09 30 22 00 200  8.0  10.0  1.2   5  4.1 210 1015.2 -0.4   15.0  18.0  10.0   MM    MM
45024   43.978  -86.559 2026 09 30 21 50  MM   MM    MM   0.6   4  3.5  MM     MM    MM     MM  16.5    MM   MM    MM
LDTM4   43.947  -86.441 2026 09 30 22 00 190  5.0   7.0   MM  MM   MM  MM 1015.0   MM  14.0    MM   9.0   MM    MM
41001   34.675  -72.698 2026 09 30 22 00 100  5.0   6.0  1.5   8  6.0 100 1017.0   MM  24.0  26.0  20.0   MM    MM
45002   45.344  -86.411 2026 09 29 10 00 200  8.0  10.0  1.2   5  4.1 210 1015.2 -0.4   15.0  17.0  10.0   MM    MM`;
const XML = `<?xml version="1.0"?><stations created="x" count="3">
<station id="45007" lat="42.674" lon="-87.026" elev="176" name="SOUTH MICHIGAN - 43NM East Southeast of Milwaukee, WI" owner="NDBC" pgm="NDBC Meteorological/Ocean" type="buoy" met="y"/>
<station id="45024" lat="43.978" lon="-86.559" name="Ludington Buoy &amp; Friends" owner="GLOS &amp;lt;Partner&amp;gt;" type="buoy" met="y"/>
</stations>`;

test('buoys: Great Lakes water readings only, recent, converted', () => {
  const now = Date.UTC(2026, 8, 30, 22, 30);
  const list = parseLatestObs(OBS, parseStations(XML), now);
  assert.deepEqual(list.map((s) => s.id), ['45007', '45024']); // not the Atlantic, not wind-only, not stale
  const [a, b] = list;
  assert.equal(a.name, 'South Michigan - 43 NM East Southeast of Milwaukee, WI');
  assert.equal(a.waterF, 64.4);
  assert.equal(a.windMph, 17.9);
  assert.equal(a.gustMph, 22.4);
  assert.equal(a.wavesFt, 3.9);
  assert.equal(a.windFrom, 200);
  assert.equal(a.time, '2026-09-30T22:00:00.000Z');
  assert.equal(b.name, 'Ludington Buoy & Friends');
  assert.equal(b.windMph, null);
  assert.equal(b.waterF, 61.7);
  assert.equal(parseStations(XML)['45024'].owner, 'GLOS &lt;Partner&gt;');
});
