/**
 * Live Lake Map gatekeeper (Cloudflare Worker at map.finfindr.app).
 *
 * The map storage bucket is private; this Worker is the only way in. It serves
 * the map page and its data only to holders of a valid pass:
 *   - the FinFindr app gets a 2-hour pass from the pier-cast-map-access function
 *     (paid users, or a free user's first 2 visits) and opens
 *     /map/index.html?app=1&t=<pass>
 *   - the Worker checks it, answers, and sets it as a cookie, so the page's own
 *     requests (frames, tiles, manifest) carry it automatically
 *   - /_pass?t=<pass> renews the cookie while the map stays open
 *   - /obs/buoys.json: merged NOAA NDBC + CO-OPS + GLOS readings (see buoys.js)
 * Anything else gets a 401 page.
 *
 * Bindings (wrangler.toml): BUCKET = R2 bucket piercast-lake-map; secret MAP_PASS_SECRET.
 */
import { buildObservationSnapshot, buoysResponse } from './buoys.js';

const COOKIE = 'pcmap';
const ALLOWED = [/^map\/[\w.-]+$/, /^static\/[\w.-]+$/, /^runs\/[\w.-]+\/[\w./-]+$/, /^latest\.json$/];
const MAX_RANGE_BYTES = 8 * 1024 * 1024;
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'none'",
  "connect-src 'self' https://api.weather.gov https://tiles.openfreemap.org",
  "font-src 'self' https://fonts.gstatic.com data:",
  "form-action 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "object-src 'none'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
].join('; ');

function fromBase64url(text) {
  const b = atob(text.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text.length + 3) % 4));
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}

const hmacKeys = new Map();

function hmacKey(secret) {
  let key = hmacKeys.get(secret);
  if (!key) {
    key = crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
    hmacKeys.set(secret, key);
  }
  return key;
}

/** true when `pass` was signed with `secret` and has not expired. */
export async function verifyPass(pass, secret, nowSeconds = Math.floor(Date.now() / 1000)) {
  if (typeof pass !== 'string' || pass.length > 200 || !secret) return false;
  const parts = pass.split('.');
  if (parts.length !== 4 || parts[0] !== 'v1') return false;
  const expiry = Number(parts[1]);
  if (!Number.isInteger(expiry) || expiry < nowSeconds || expiry > nowSeconds + 3 * 24 * 3600) return false;
  let signature;
  try { signature = fromBase64url(parts[3]); } catch { return false; }
  return crypto.subtle.verify('HMAC', await hmacKey(secret), signature, new TextEncoder().encode(parts.slice(0, 3).join('.')));
}

function cookiePass(request) {
  const header = request.headers.get('cookie') || '';
  const m = header.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

function passCookie(pass) {
  const expiry = Number(pass.split('.')[1]);
  const maxAge = Math.max(0, expiry - Math.floor(Date.now() / 1000));
  return `${COOKIE}=${encodeURIComponent(pass)}; Path=/; Max-Age=${maxAge}; Secure; HttpOnly; SameSite=Lax`;
}

async function withinLimit(binding, key) {
  if (!binding || typeof binding.limit !== 'function') return true;
  const result = await binding.limit({ key });
  return result?.success !== false;
}

function limited(serverTiming) {
  return new Response('Too many map requests', {
    status: 429,
    headers: { 'cache-control': 'no-store', 'retry-after': '60', 'content-type': 'text/plain; charset=utf-8', 'server-timing': serverTiming },
  });
}

function invalidRange(message) {
  return new Response(message, {
    status: 416,
    headers: { 'cache-control': 'no-store', 'content-type': 'text/plain; charset=utf-8' },
  });
}

function checkRange(request, key) {
  const value = request.headers.get('range');
  const pmtiles = key.endsWith('.pmtiles');
  if (!value) return request.method === 'GET' && pmtiles ? invalidRange('A byte range is required') : null;
  if (!pmtiles) return invalidRange('Byte ranges are only available for map tiles');
  const match = /^bytes=(\d+)-(\d+)$/.exec(value);
  if (!match) return invalidRange('Invalid byte range');
  const start = Number(match[1]), end = Number(match[2]);
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || end < start || end - start + 1 > MAX_RANGE_BYTES) {
    return invalidRange('Invalid byte range');
  }
  return null;
}

function clientHeaders(input, setCookie, serverTiming, key = '') {
  const headers = new Headers(input);
  headers.set('cache-control', (headers.get('cache-control') || 'max-age=60').replace(/\bpublic\b/, 'private'));
  if (key === 'latest.json' || key === 'map/index.html') {
    headers.set('cache-control', 'private, max-age=60, must-revalidate');
  }
  headers.set('x-content-type-options', 'nosniff');
  headers.set('referrer-policy', 'no-referrer');
  headers.set('permissions-policy', 'geolocation=(), camera=(), microphone=()');
  headers.set('content-security-policy', CONTENT_SECURITY_POLICY);
  if (serverTiming) headers.set('server-timing', serverTiming);
  if (setCookie) headers.append('set-cookie', setCookie);
  return headers;
}

function immutableVersionedRequest(url, key) {
  if (key.startsWith('runs/')) return true;
  const version = url.searchParams.get('v');
  if (!version || !/^[a-f0-9]{8,64}$/i.test(version)) return false;
  return /^(?:map|static)\/.+\.(?:css|js|json|png|webp|woff2?|pmtiles)$/i.test(key);
}

function timingHeader(parts) {
  return parts.map(([name, duration, description]) =>
    `${name};dur=${Math.max(0, duration).toFixed(1)}${description ? `;desc="${description}"` : ''}`
  ).join(', ');
}

function edgeCacheKey(url) {
  const key = new URL(url);
  key.searchParams.delete('t');
  key.searchParams.delete('app');
  return new Request(key.toString(), { method: 'GET' });
}

const DENIED = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Live Lake Map</title><body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0F2233;color:#fff;font:16px system-ui,sans-serif;text-align:center;padding:24px">
<div><b style="font-size:20px">Live Lake Map</b><p style="opacity:.75">Open the map from PierCast in the FinFindr app.</p></div></body>`;

function denied() {
  return new Response(DENIED, { status: 401, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

/**
 * Collect one shared observation snapshot every 15 minutes. The mutable
 * pointer keeps all edge locations off the upstream APIs; the dated copy is
 * immutable evidence for later forecast verification. Nothing here deletes or
 * expires an R2 object.
 */
export async function archiveObservations(env, ctx, scheduledTime = Date.now()) {
  if (!env?.BUCKET?.put) throw new Error('Observation archive requires the R2 binding');
  const payload = await buildObservationSnapshot(ctx, Date.now());
  payload.scheduledFor = new Date(scheduledTime).toISOString();
  const body = JSON.stringify(payload);
  const stamp = new Date(scheduledTime).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  const day = stamp.slice(0, 8);
  const key = `observations/v1/${day.slice(0, 4)}/${day.slice(4, 6)}/${day.slice(6, 8)}/${stamp}.json`;
  const latestOptions = { httpMetadata: { contentType: 'application/json', cacheControl: 'no-store' } };
  const immutableOptions = { httpMetadata: { contentType: 'application/json', cacheControl: 'public, max-age=31536000, immutable' } };
  await Promise.all([
    env.BUCKET.put(key, body, immutableOptions),
    env.BUCKET.put('observations/latest.json', body, latestOptions),
  ]);
  return { key, stations: payload.stations.length, quality: payload.health.quality };
}

export default {
  async scheduled(controller, env, ctx) {
    ctx.waitUntil(archiveObservations(env, ctx, controller.scheduledTime));
  },

  async fetch(request, env, ctx) {
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
    const url = new URL(request.url);
    let key = decodeURIComponent(url.pathname.slice(1));
    if (key === '' || key === 'map' || key === 'map/') key = 'map/index.html';
    const immutable = immutableVersionedRequest(url, key);
    const ip = request.headers.get('cf-connecting-ip') || 'unknown';
    const fresh = url.searchParams.get('t');
    const pass = fresh || cookiePass(request);
    let setCookie = null;
    const authStarted = performance.now();
    if (!(await verifyPass(pass, env.MAP_PASS_SECRET))) return denied();
    const authDuration = performance.now() - authStarted;
    let limitDuration = 0;
    if (!immutable) {
      const limitStarted = performance.now();
      const [ipAllowed, accountAllowed] = await Promise.all([
        withinLimit(env.MAP_IP_LIMITER, ip),
        withinLimit(env.MAP_ACCOUNT_LIMITER, pass.split('.')[2]),
      ]);
      limitDuration = performance.now() - limitStarted;
      const limitedTiming = timingHeader([
        ['auth', authDuration, 'signed-pass'],
        ['limit', limitDuration, 'rate-limit'],
      ]);
      if (!ipAllowed || !accountAllowed) return limited(limitedTiming);
    }
    if (fresh) {
      setCookie = passCookie(fresh);
    }
    if (url.pathname === '/_pass') {
      return new Response(null, { status: 204, headers: { 'set-cookie': setCookie || '', 'cache-control': 'no-store', 'server-timing': timingHeader([['auth', authDuration, 'signed-pass'], ['limit', limitDuration, 'rate-limit']]) } });
    }
    // Live NOAA observations come from one centrally archived 15-minute
    // snapshot, with a direct-source fallback only before the first cron run.
    // A stale archive fails closed instead of fanning user traffic upstream.
    if (url.pathname === '/obs/buoys.json') {
      const sourceStarted = performance.now();
      const buoy = await buoysResponse(ctx, env, request);
      const timing = timingHeader([
        ['auth', authDuration, 'signed-pass'],
        ['limit', limitDuration, 'rate-limit'],
        ['source', performance.now() - sourceStarted, 'observation-cache'],
      ]);
      return new Response(buoy.body, { status: buoy.status, headers: clientHeaders(buoy.headers, setCookie, timing, 'obs/buoys.json') });
    }

    if (key.includes('..') || !ALLOWED.some((re) => re.test(key))) return new Response('Not found', { status: 404 });
    const rangeError = checkRange(request, key);
    if (rangeError) return rangeError;

    const cache = request.method === 'GET' && !request.headers.has('range') && typeof caches !== 'undefined'
      ? caches.default
      : null;
    const cacheKey = cache ? edgeCacheKey(url) : null;
    if (cache && cacheKey) {
      const cacheStarted = performance.now();
      const hit = await cache.match(cacheKey);
      if (hit) {
        const timing = timingHeader([
          ['auth', authDuration, 'signed-pass'],
          ['limit', limitDuration, immutable ? 'skipped-immutable' : 'rate-limit'],
          ['cache', performance.now() - cacheStarted, 'hit'],
        ]);
        const init = { status: hit.status, headers: clientHeaders(hit.headers, setCookie, timing, key) };
        if (hit.headers.get('content-encoding')) init.encodeBody = 'manual';
        return new Response(hit.body, init);
      }
    }

    const r2Started = performance.now();
    const object = await env.BUCKET.get(key, { range: request.headers, onlyIf: request.headers });
    const r2Duration = performance.now() - r2Started;
    if (object === null) return new Response('Not found', { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('accept-ranges', 'bytes');
    const timing = timingHeader([
      ['auth', authDuration, 'signed-pass'],
      ['limit', limitDuration, immutable ? 'skipped-immutable' : 'rate-limit'],
      ['cache', 0, 'miss'],
      ['r2', r2Duration, 'object'],
    ]);
    if (!('body' in object) || !object.body) return new Response(null, { status: 304, headers: clientHeaders(headers, setCookie, timing, key) });

    let status = 200;
    if (object.range && request.headers.has('range')) {
      const size = object.size;
      const offset = 'suffix' in object.range ? size - object.range.suffix : (object.range.offset ?? 0);
      const length = 'suffix' in object.range ? object.range.suffix : (object.range.length ?? size - offset);
      headers.set('content-range', `bytes ${offset}-${offset + length - 1}/${size}`);
      headers.set('content-length', String(length));
      status = 206;
    }
    // bodies stored gzip-encoded (the data job's JSON) go out as they are
    const init = { status, headers: clientHeaders(headers, setCookie, timing, key) };
    if (headers.get('content-encoding')) init.encodeBody = 'manual';
    const response = new Response(request.method === 'HEAD' ? null : object.body, init);
    if (cache && cacheKey && status === 200 && request.method === 'GET') {
      const storedHeaders = new Headers(headers);
      storedHeaders.delete('set-cookie');
      const storedInit = { status, headers: storedHeaders };
      if (headers.get('content-encoding')) storedInit.encodeBody = 'manual';
      const put = cache.put(cacheKey, new Response(response.clone().body, storedInit));
      if (ctx?.waitUntil) ctx.waitUntil(put); else put.catch(() => {});
    }
    return response;
  },
};
