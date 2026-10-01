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
 *   - /obs/buoys.json: latest NOAA buoy readings (see buoys.js)
 * Anything else gets a 401 page.
 *
 * Bindings (wrangler.toml): BUCKET = R2 bucket piercast-lake-map; secret MAP_PASS_SECRET.
 */
import { buoysResponse } from './buoys.js';

const COOKIE = 'pcmap';
const ALLOWED = [/^map\/[\w.-]+$/, /^static\/[\w.-]+$/, /^runs\/[\w.-]+\/[\w./-]+$/, /^latest\.json$/];

function fromBase64url(text) {
  const b = atob(text.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text.length + 3) % 4));
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
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
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  return crypto.subtle.verify('HMAC', key, signature, new TextEncoder().encode(parts.slice(0, 3).join('.')));
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

const DENIED = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Live Lake Map</title><body style="margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0F2233;color:#fff;font:16px system-ui,sans-serif;text-align:center;padding:24px">
<div><b style="font-size:20px">Live Lake Map</b><p style="opacity:.75">Open the map from PierCast in the FinFindr app.</p></div></body>`;

function denied() {
  return new Response(DENIED, { status: 401, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

export default {
  async fetch(request, env, ctx) {
    if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
    const url = new URL(request.url);
    const fresh = url.searchParams.get('t');
    let setCookie = null;
    if (fresh) {
      if (!(await verifyPass(fresh, env.MAP_PASS_SECRET))) return denied();
      setCookie = passCookie(fresh);
    } else if (!(await verifyPass(cookiePass(request), env.MAP_PASS_SECRET))) {
      return denied();
    }
    if (url.pathname === '/_pass') {
      return new Response(null, { status: 204, headers: { 'set-cookie': setCookie || '', 'cache-control': 'no-store' } });
    }
    // live buoy readings (NOAA NDBC), fetched and cached here because NDBC has no CORS
    if (url.pathname === '/obs/buoys.json') return buoysResponse(ctx);

    let key = decodeURIComponent(url.pathname.slice(1));
    if (key === '' || key === 'map' || key === 'map/') key = 'map/index.html';
    if (key.includes('..') || !ALLOWED.some((re) => re.test(key))) return new Response('Not found', { status: 404 });

    const object = await env.BUCKET.get(key, { range: request.headers, onlyIf: request.headers });
    if (object === null) return new Response('Not found', { status: 404 });
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('accept-ranges', 'bytes');
    // gated content: browsers may keep it, shared caches may not
    headers.set('cache-control', (headers.get('cache-control') || 'max-age=60').replace(/\bpublic\b/, 'private'));
    headers.set('x-content-type-options', 'nosniff');
    if (setCookie) headers.append('set-cookie', setCookie);
    if (!('body' in object) || !object.body) return new Response(null, { status: 304, headers });

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
    const init = { status, headers };
    if (headers.get('content-encoding')) init.encodeBody = 'manual';
    return new Response(request.method === 'HEAD' ? null : object.body, init);
  },
};
