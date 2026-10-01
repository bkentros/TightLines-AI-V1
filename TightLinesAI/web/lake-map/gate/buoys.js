/**
 * Observed conditions at Great Lakes buoys and shore stations (NOAA NDBC),
 * served by the gatekeeper at /obs/buoys.json. NDBC pages have no CORS
 * headers, so the map page can't read them directly; the Worker fetches,
 * trims and caches them (10 minutes; station names 1 day).
 *
 *   latest_obs.txt       one line per station: newest wind, waves, air/water temp
 *   activestations.xml   station names and types
 */
export const LATEST_OBS_URL = 'https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt';
export const STATIONS_URL = 'https://www.ndbc.noaa.gov/activestations.xml';
// the Great Lakes (and St. Clair / Niagara / St. Marys connecting waters)
const BOX = { west: -92.6, east: -75.6, south: 41.0, north: 49.4 };
const MAX_AGE_H = 3;
const MS_TO_MPH = 2.23694, M_TO_FT = 3.28084;

const num = (v) => (v === undefined || v === 'MM' || v === '' ? null : Number.isFinite(Number(v)) ? Number(v) : null);
const round1 = (v) => (v === null ? null : Math.round(v * 10) / 10);
const cToF = (c) => (c === null ? null : c * 9 / 5 + 32);

/** { id: {name, type, owner} } from activestations.xml */
export function parseStations(xml) {
  const out = {};
  for (const m of String(xml).matchAll(/<station\s+([^>]*?)\/?>/g)) {
    const attrs = {};
    for (const a of m[1].matchAll(/(\w+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    if (attrs.id) out[attrs.id.toUpperCase()] = { name: decodeXml(attrs.name || ''), type: attrs.type || '', owner: decodeXml(attrs.owner || '') };
  }
  return out;
}
function decodeXml(s) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  return s.replace(/&(amp|lt|gt|quot|apos|#\d+);/g, (entity, name) =>
    name[0] === '#' ? String.fromCharCode(Number(name.slice(1))) : named[name] ?? entity);
}

/** Great Lakes stations with water data, newest reading each, in mph / °F / ft. */
export function parseLatestObs(text, stations = {}, now = Date.now()) {
  const lines = String(text).split(/\r?\n/);
  const head = lines.find((l) => l.startsWith('#STN'));
  if (!head) throw new Error('latest_obs.txt: no header');
  const cols = head.slice(1).trim().split(/\s+/);
  const at = (name) => cols.indexOf(name);
  const I = { stn: at('STN'), lat: at('LAT'), lon: at('LON'), y: at('YYYY'), mo: at('MM'), d: at('DD'), h: at('hh'), mi: at('mm'),
    wdir: at('WDIR'), wspd: at('WSPD'), gst: at('GST'), wvht: at('WVHT'), dpd: at('DPD'), atmp: at('ATMP'), wtmp: at('WTMP') };
  const out = [];
  for (const line of lines) {
    if (!line || line.startsWith('#')) continue;
    const v = line.trim().split(/\s+/);
    const lat = num(v[I.lat]), lon = num(v[I.lon]);
    if (lat === null || lon === null || lon < BOX.west || lon > BOX.east || lat < BOX.south || lat > BOX.north) continue;
    const t = Date.UTC(+v[I.y], +v[I.mo] - 1, +v[I.d], +v[I.h], +v[I.mi]);
    if (!Number.isFinite(t) || now - t > MAX_AGE_H * 3600e3 || t - now > 3600e3) continue;
    const waterF = round1(cToF(num(v[I.wtmp])));
    const wavesFt = round1(num(v[I.wvht]) === null ? null : num(v[I.wvht]) * M_TO_FT);
    if (waterF === null && wavesFt === null) continue; // wind-only land stations add clutter, not water facts
    const id = v[I.stn].toUpperCase(), st = stations[id] || {};
    const wspd = num(v[I.wspd]), gst = num(v[I.gst]);
    out.push({
      id, name: tidyName(st.name, id), type: st.type || null, lat, lon,
      time: new Date(t).toISOString(),
      waterF, airF: round1(cToF(num(v[I.atmp]))),
      windMph: round1(wspd === null ? null : wspd * MS_TO_MPH), gustMph: round1(gst === null ? null : gst * MS_TO_MPH),
      windFrom: num(v[I.wdir]), wavesFt, periodS: num(v[I.dpd]),
    });
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

/** Station names as NDBC lists them, with all-caps names put in title case and kept short. */
function tidyName(name, id) {
  if (!name) return `Station ${id}`;
  const title = (t) => t.toLowerCase().replace(/\b[a-z]/g, (c) => c.toUpperCase())
    .replace(/\b(Mi|Wi|Il|In|Oh|Pa|Ny|Mn|On|Us|Glerl|Noaa|Glos)\b/g, (x) => x.toUpperCase());
  const n = name.replace(/\s+/g, ' ').trim().split(' - ')
    .map((part) => (part === part.toUpperCase() && /[A-Z]{3}/.test(part) ? title(part) : part)).join(' - ')
    .replace(/(\d)\s?NM\b/gi, '$1 NM');
  return n.length > 64 ? n.slice(0, 62) + '…' : n;
}

async function cachedText(url, ttlSeconds, ctx) {
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const key = new Request(`https://cache.piercast/${encodeURIComponent(url)}`);
  if (cache) {
    const hit = await cache.match(key);
    if (hit) return hit.text();
  }
  const res = await fetch(url, { headers: { 'user-agent': 'PierCast-LakeMap/1.0 (+https://finfindr.app)' } });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const text = await res.text();
  if (cache) {
    const put = cache.put(key, new Response(text, { headers: { 'cache-control': `max-age=${ttlSeconds}` } }));
    if (ctx && ctx.waitUntil) ctx.waitUntil(put); else await put;
  }
  return text;
}

export async function buoysResponse(ctx) {
  try {
    const [obs, xml] = await Promise.all([
      cachedText(LATEST_OBS_URL, 600, ctx),
      cachedText(STATIONS_URL, 86400, ctx).catch(() => ''),
    ]);
    const list = parseLatestObs(obs, parseStations(xml));
    return new Response(JSON.stringify({ source: 'NOAA NDBC', updated: new Date().toISOString(), stations: list }), {
      headers: { 'content-type': 'application/json', 'cache-control': 'private, max-age=300' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ source: 'NOAA NDBC', error: 'unavailable', stations: [] }), {
      status: 503, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }
}
