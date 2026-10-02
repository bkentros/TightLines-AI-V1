import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import worker, { archiveObservations, verifyPass } from '../gate/worker.js';

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

test('gate configuration collects one central observation snapshot every 15 minutes', () => {
  const config = readFileSync(new URL('../gate/wrangler.toml', import.meta.url), 'utf8');
  assert.match(config, /crons\s*=\s*\["\*\/15 \* \* \* \*"\]/);
  assert.match(config, /binding\s*=\s*"BUCKET"/);
});

test('staging gatekeeper is workers.dev-only and binds only the staging bucket', () => {
  const config = readFileSync(new URL('../gate/wrangler.staging.toml', import.meta.url), 'utf8');
  assert.match(config, /name\s*=\s*"piercast-map-gate-staging"/);
  assert.match(config, /workers_dev\s*=\s*true/);
  assert.match(config, /bucket_name\s*=\s*"piercast-lake-map-staging"/);
  assert.doesNotMatch(config, /map\.finfindr\.app/);
  assert.doesNotMatch(config, /\[triggers\]/);
});

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
  assert.equal(r.headers.get('cache-control'), 'private, max-age=60, must-revalidate');
  assert.match(r.headers.get('server-timing'), /auth;dur=/);
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(r.headers.get('referrer-policy'), 'no-referrer');
  assert.match(r.headers.get('content-security-policy'), /script-src 'self'/);
  assert.match(r.headers.get('content-security-policy'), /connect-src 'self' https:\/\/api\.weather\.gov https:\/\/tiles\.openfreemap\.org/);
  const withCookie = await get('/latest.json', { cookie: `other=1; pcmap=${encodeURIComponent(pass)}` });
  assert.equal(withCookie.status, 200);
  assert.equal(withCookie.headers.get('content-encoding'), 'gzip');
});

test('tile range requests, renewals and blocked paths', async () => {
  const cookie = `pcmap=${encodeURIComponent(await makePass())}`;
  assert.equal((await get('/static/lakes-v2.pmtiles', { cookie })).status, 416);
  assert.equal((await get('/static/lakes-v2.pmtiles', { cookie, range: 'bytes=0-' })).status, 416);
  assert.equal((await get('/static/lakes-v2.pmtiles', { cookie, range: `bytes=0-${8 * 1024 * 1024}` })).status, 416);
  assert.equal((await get('/latest.json', { cookie, range: 'bytes=0-2' })).status, 416);
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

test('request fuses reject abusive IP or account traffic before R2', async () => {
  const pass = await makePass();
  const cookie = `pcmap=${encodeURIComponent(pass)}`;
  const blocked = { limit: async () => ({ success: false }) };
  const allowed = { limit: async () => ({ success: true }) };
  const ipLimited = { ...env, MAP_IP_LIMITER: blocked, MAP_ACCOUNT_LIMITER: allowed };
  assert.equal((await worker.fetch(new Request('https://map.finfindr.app/latest.json', { headers: { cookie } }), ipLimited)).status, 429);
  const accountLimited = { ...env, MAP_IP_LIMITER: allowed, MAP_ACCOUNT_LIMITER: blocked };
  assert.equal((await worker.fetch(new Request('https://map.finfindr.app/latest.json', { headers: { cookie } }), accountLimited)).status, 429);
});

test('content-versioned immutable assets keep pass verification but skip limiter lookups', async () => {
  const pass = await makePass();
  const cookie = `pcmap=${encodeURIComponent(pass)}`;
  const blocked = { limit: async () => ({ success: false }) };
  const response = await worker.fetch(
    new Request('https://map.finfindr.app/static/lakes-v2.pmtiles?v=abcdef123456', {
      headers: { cookie, range: 'bytes=0-3' },
    }),
    { ...env, MAP_IP_LIMITER: blocked, MAP_ACCOUNT_LIMITER: blocked },
  );
  assert.equal(response.status, 206);
  assert.match(response.headers.get('server-timing'), /skipped-immutable/);
  assert.equal(
    (await worker.fetch(
      new Request('https://map.finfindr.app/static/lakes-v2.pmtiles?v=abcdef123456'),
      { ...env, MAP_PASS_SECRET: 'wrong', MAP_IP_LIMITER: blocked, MAP_ACCOUNT_LIMITER: blocked },
    )).status,
    401,
  );
});

test('authenticated edge cache strips tickets and avoids repeat R2 reads', async () => {
  const previousCaches = globalThis.caches;
  const entries = new Map();
  globalThis.caches = { default: {
    match: async (request) => entries.get(request.url)?.clone() || undefined,
    put: async (request, response) => { entries.set(request.url, response.clone()); },
  } };
  let reads = 0;
  const counted = { ...BUCKET, get: async (...args) => { reads++; return BUCKET.get(...args); } };
  const cachedEnv = { ...env, BUCKET: counted };
  try {
    const waits = [];
    const firstPass = await makePass();
    const first = await worker.fetch(
      new Request(`https://map.finfindr.app/map/index.html?app=1&t=${firstPass}`),
      cachedEnv,
      { waitUntil: (promise) => waits.push(promise) },
    );
    assert.equal(first.status, 200);
    await Promise.all(waits);
    assert.deepEqual([...entries.keys()], ['https://map.finfindr.app/map/index.html']);

    const secondPass = await makePass();
    const second = await worker.fetch(
      new Request(`https://map.finfindr.app/map/index.html?app=1&t=${secondPass}`),
      cachedEnv,
    );
    assert.equal(second.status, 200);
    assert.match(second.headers.get('set-cookie'), /^pcmap=/);
    assert.equal(reads, 1);
    assert.equal((await worker.fetch(new Request('https://map.finfindr.app/map/index.html'), cachedEnv)).status, 401);
  } finally {
    if (previousCaches === undefined) delete globalThis.caches;
    else globalThis.caches = previousCaches;
  }
});

import { COOPS_CACHE_SECONDS, COOPS_STATIONS, GLOS_CACHE_SECONDS, buoysResponse, mergeStations, parseCoopsLatest, parseGlosLatest, parseLatestObs, parseStations } from '../gate/buoys.js';

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

test('CO-OPS adds current all-clear water temperatures and rejects flagged values', () => {
  const now = Date.UTC(2026, 9, 1, 18, 10);
  const site = COOPS_STATIONS.find((station) => station.id === '9063085');
  const payload = {
    metadata: { id: '9063085', name: 'Toledo', lat: '41.6936', lon: '-83.4723' },
    data: [{ t: '2026-10-01 18:00', v: '19.4', f: '0,0,0' }],
  };
  const parsed = parseCoopsLatest(payload, site, now);
  assert.equal(parsed.waterF, 66.9);
  assert.equal(parsed.waterIdentity, 'coops:9063085');
  assert.equal(parsed.waterQuality, 'provider_qc');
  assert.equal(parsed.body, 'lake-erie');
  assert.equal(COOPS_CACHE_SECONDS, 900);
  assert.equal(parseCoopsLatest({ ...payload, data: [{ ...payload.data[0], f: '0,1,0' }] }, site, now), null);
  assert.equal(parseCoopsLatest({ ...payload, data: [{ ...payload.data[0], t: '2026-10-01 14:00' }] }, site, now), null);
});

test('GLOS observations retain shallow depth profiles and reject bad quality or stale data', () => {
  const now = Date.UTC(2026, 9, 1, 15, 0);
  const seconds = (minutesAgo) => (now - minutesAgo * 60e3) / 1000;
  const stations = parseGlosLatest([{
    obs_dataset_id: 2,
    parameters: [
      { parameter_id: 148, observations: [{ timestamp: seconds(10), value: 290, qartod: 2, depth: null }] },
      { parameter_id: 2800, observations: [{ timestamp: seconds(8), value: 289, qartod: 1, depth: null }] },
      { parameter_id: 2801, observations: [{ timestamp: seconds(7), value: 288, qartod: 4, depth: null }] },
      { parameter_id: 2802, observations: [{ timestamp: seconds(181), value: 287, qartod: 1, depth: null }] },
      { parameter_id: 2803, observations: [{ timestamp: seconds(5), value: -999, qartod: 1, depth: null }] },
    ],
  }], now);
  assert.equal(stations.length, 1);
  assert.equal(stations[0].externalId, '45013');
  assert.equal(stations[0].waterDepthM, 0);
  assert.equal(stations[0].waterF, 62.3);
  assert.equal(stations[0].waterQuality, 'not_evaluated');
  assert.equal(stations[0].waterIdentity, 'glos:2');
  assert.deepEqual(stations[0].profile.map((item) => item.depthM), [0, 1]);
  assert.ok(stations[0].profile.every((item) => item.identity === 'glos:2'));
  assert.equal(GLOS_CACHE_SECONDS, 600);
});

test('GLOS merge adds profiles but only replaces NDBC surface water with a shallow sensor', () => {
  const ndbc = [{
    id: '45013', externalId: '45013', name: 'NDBC Atwater', type: 'buoy', lat: 43.098, lon: -87.8496,
    time: '2026-10-01T14:50:00.000Z', waterTime: '2026-10-01T14:50:00.000Z', weatherTime: '2026-10-01T14:50:00.000Z',
    waterF: 60, windMph: 8, wavesFt: 1.2, source: 'NOAA NDBC', profile: [],
  }];
  const shallow = [{
    id: 'GLOS-2', externalId: '45013', name: 'Atwater 20-meter buoy', lat: 43.098, lon: -87.8496,
    time: '2026-10-01T14:52:00.000Z', waterTime: '2026-10-01T14:52:00.000Z', waterF: 62, waterDepthM: 1,
    waterQuality: 'good', source: 'GLOS Seagull', glosDatasetId: 2,
    profile: [{ depthM: 1, waterF: 62, time: '2026-10-01T14:52:00.000Z', quality: 'good' }],
  }];
  const merged = mergeStations(ndbc, shallow);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].waterF, 62);
  assert.equal(merged[0].windMph, 8);
  assert.equal(merged[0].source, 'NOAA NDBC + GLOS Seagull');
  assert.equal(merged[0].profile.length, 1);

  const deep = structuredClone(shallow);
  deep[0].waterF = 45; deep[0].waterDepthM = 12; deep[0].profile[0].depthM = 12; deep[0].profile[0].waterF = 45;
  const deepMerged = mergeStations(ndbc, deep);
  assert.equal(deepMerged[0].waterF, 60);
  assert.equal(deepMerged[0].profile[0].waterF, 45);
});

test('CO-OPS supplements its matching NDBC station without duplicating it', () => {
  const ndbc = [{
    id: 'HLNM4', coopsStationId: '9087031', name: '9087031 - Holland, MI', lat: 42.7733, lon: -86.2128,
    time: '2026-10-01T18:00:00.000Z', waterTime: '2026-10-01T18:00:00.000Z', waterF: 60,
    windMph: 8, wavesFt: null, source: 'NOAA NDBC', profile: [],
  }];
  const coops = [{
    id: 'COOPS-9087031', externalId: '9087031', coopsStationId: '9087031', name: 'Holland', lat: 42.773335, lon: -86.212776,
    time: '2026-10-01T18:06:00.000Z', waterTime: '2026-10-01T18:06:00.000Z', waterF: 61,
    waterDepthM: null, waterIdentity: 'coops:9087031', waterQuality: 'provider_qc', source: 'NOAA CO-OPS', profile: [],
  }];
  const merged = mergeStations(ndbc, [], coops);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].waterF, 61);
  assert.equal(merged[0].waterIdentity, 'coops:9087031');
  assert.equal(merged[0].windMph, 8);
  assert.equal(merged[0].source, 'NOAA NDBC + NOAA CO-OPS');
});

test('a stale central archive fails closed without fanning map traffic upstream', async () => {
  const previousFetch = globalThis.fetch;
  let upstreamCalls = 0;
  globalThis.fetch = async () => { upstreamCalls++; throw new Error('unexpected upstream request'); };
  const stale = JSON.stringify({
    source: 'NOAA NDBC + NOAA CO-OPS + GLOS Seagull',
    updated: new Date(Date.now() - 31 * 60e3).toISOString(), stations: [{ id: 'old' }],
  });
  const staleBucket = { get: async () => ({ body: new Blob([stale]).stream() }) };
  try {
    const response = await buoysResponse(null, { BUCKET: staleBucket });
    assert.equal(response.status, 503);
    assert.equal((await response.json()).error, 'archive_stale');
    assert.equal(upstreamCalls, 0);
  } finally {
    globalThis.fetch = previousFetch;
  }
});

test('scheduled collection writes a central pointer and an immutable dated snapshot', async () => {
  const previousFetch = globalThis.fetch;
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
  globalThis.fetch = async (input) => {
    const url = new URL(String(input));
    if (url.href.includes('latest_obs.txt')) return new Response(OBS);
    if (url.href.includes('activestations.xml')) return new Response(XML);
    if (url.href.includes('obs-latest')) return Response.json([]);
    if (url.hostname === 'api.tidesandcurrents.noaa.gov') {
      const id = url.searchParams.get('station');
      return Response.json({ metadata: { id, name: `Station ${id}`, lat: '41.6936', lon: '-83.4723' },
        data: [{ t: timestamp, v: '19.4', f: '0,0,0' }] });
    }
    throw new Error(`unexpected test URL ${url}`);
  };
  const puts = [];
  const bucket = { put: async (key, body, options) => puts.push({ key, body, options }) };
  try {
    const result = await archiveObservations({ BUCKET: bucket }, null, Date.UTC(2026, 9, 1, 18, 15));
    assert.equal(result.stations > 0, true);
    assert.deepEqual(puts.map((put) => put.key).sort(), [
      'observations/latest.json', 'observations/v1/2026/10/01/20261001T181500Z.json',
    ]);
    const latest = JSON.parse(puts.find((put) => put.key === 'observations/latest.json').body);
    assert.equal(latest.formatVersion, 3);
    assert.equal(latest.health.sources.coops.requested, COOPS_STATIONS.length);
    assert.equal(latest.health.sources.coops.status, 'ok');
  } finally {
    globalThis.fetch = previousFetch;
  }
});
