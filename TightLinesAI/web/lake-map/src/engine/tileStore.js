/*
 * On-phone tile store. Map tiles are read from the .pmtiles files in small
 * byte ranges, and phones (iOS especially) don't keep range downloads in their
 * normal web cache, so every open would fetch the same tiles again through the
 * gatekeeper (each fetch is a billed Cloudflare request). This keeps every
 * range the phone has already downloaded in Cache Storage, under a name tied
 * to STATIC_REV (staticLayers.js): bumping STATIC_REV starts a fresh store
 * and deletes the old one. Without Cache Storage (old WebView, private mode) it simply fetches.
 */
import { FetchSource, EtagMismatch } from 'pmtiles';

const STORE_PREFIX = 'pc-static-';
const STORE_MAX_ENTRIES = 8000; // ~ a few tens of MB; start over past this
const stores = new Map();
export function openStore(rev) {
  if (!stores.has(rev)) stores.set(rev, open(STORE_PREFIX + rev));
  return stores.get(rev);
}
async function open(name) {
  try {
    if (typeof caches === 'undefined') return null;
    for (const old of await caches.keys()) if (old.startsWith(STORE_PREFIX) && old !== name) caches.delete(old);
    let store = await caches.open(name);
    if ((await store.keys()).length > STORE_MAX_ENTRIES) { await caches.delete(name); store = await caches.open(name); }
    return store;
  } catch { return null; }
}
export async function resetStore(rev) {
  stores.delete(rev);
  try { await caches.delete(STORE_PREFIX + rev); } catch { /* nothing stored */ }
}

export class StoredSource {
  constructor(url, rev, inner = new FetchSource(url)) { this.url = url; this.rev = rev; this.inner = inner; }
  getKey() { return this.url; }
  async getBytes(offset, length, signal, etag) {
    const key = `${this.url}${this.url.includes('?') ? '&' : '?'}bytes=${offset}-${length}`;
    const store = await openStore(this.rev);
    if (store) {
      try {
        const hit = await store.match(key);
        const stored = hit && (hit.headers.get('x-etag') || undefined);
        if (hit && (!etag || !stored || stored === etag)) return { data: await hit.arrayBuffer(), etag: stored };
      } catch { /* fall through to the network */ }
    }
    let res;
    try {
      res = await this.inner.getBytes(offset, length, signal, etag);
    } catch (err) {
      // the file on the server changed under this revision: drop what's stored
      if (err instanceof EtagMismatch) await resetStore(this.rev);
      throw err;
    }
    if (store) store.put(key, new Response(res.data.slice(0), { headers: res.etag ? { 'x-etag': res.etag } : {} })).catch(() => {});
    return res;
  }
}
