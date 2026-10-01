/**
 * Observed Great Lakes conditions from NOAA NDBC plus GLOS Seagull, served by
 * the gatekeeper at /obs/buoys.json. The page cannot reliably join these feeds
 * itself, so the Worker fetches, quality-filters, merges and caches them.
 *
 *   latest_obs.txt       one line per station: newest wind, waves, air/water temp
 *   activestations.xml   station names and types
 *   GLOS obs-latest      bulk latest readings with QARTOD flags and depth profiles
 */
import { GLOS_CATALOG_GENERATED_AT, GLOS_DATASETS, GLOS_TEMP_PARAMETERS } from './glos-catalog.js';

export const LATEST_OBS_URL = 'https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt';
export const STATIONS_URL = 'https://www.ndbc.noaa.gov/activestations.xml';
export const GLOS_LATEST_URL = 'https://seagull-api.glos.org/api/v2/obs-latest';
export const OBS_CACHE_SECONDS = 300;
export const GLOS_CACHE_SECONDS = 600; // GLOS says this bulk endpoint updates roughly every 10 minutes
// the Great Lakes (and St. Clair / Niagara / St. Marys connecting waters)
const BOX = { west: -92.6, east: -75.6, south: 41.0, north: 49.4 };
const MAX_AGE_H = 3;
const MS_TO_MPH = 2.23694, M_TO_FT = 3.28084;

const num = (v) => (v === undefined || v === 'MM' || v === '' ? null : Number.isFinite(Number(v)) ? Number(v) : null);
const round1 = (v) => (v === null ? null : Math.round(v * 10) / 10);
const cToF = (c) => (c === null ? null : c * 9 / 5 + 32);
const kToF = (k) => round1((k - 273.15) * 9 / 5 + 32);
const iso = (ms) => new Date(ms).toISOString();

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
      time: iso(t), waterTime: waterF === null ? null : iso(t), weatherTime: iso(t), source: 'NOAA NDBC',
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

/**
 * Quality-controlled GLOS temperatures. QARTOD 1 is good and 2 is not yet
 * evaluated; 3 (suspect), 4 (failed), 9 (missing), implausible values and
 * readings older than three hours are excluded. Values are canonical Kelvin.
 */
export function parseGlosLatest(input, now = Date.now()) {
  const rows = Array.isArray(input) ? input : [];
  const stations = [];
  for (const row of rows) {
    const dataset = GLOS_DATASETS[row?.obs_dataset_id];
    if (!dataset) continue;
    const readings = [];
    for (const group of row.parameters || []) {
      const parameter = GLOS_TEMP_PARAMETERS[group?.parameter_id];
      if (!parameter) continue;
      for (const observation of group.observations || []) {
        const value = Number(observation?.value), seconds = Number(observation?.timestamp), quality = Number(observation?.qartod);
        const time = seconds * 1000;
        if (!Number.isFinite(value) || value < 270 || value > 313 || !Number.isFinite(time)) continue;
        if (now - time > MAX_AGE_H * 3600e3 || time - now > 3600e3 || (quality !== 1 && quality !== 2)) continue;
        const observedDepth = observation?.depth == null ? null : Number(observation.depth);
        const depthM = Number.isFinite(observedDepth) ? observedDepth : parameter.depthM;
        readings.push({
          parameterId: Number(group.parameter_id), depthM: Number.isFinite(depthM) ? depthM : null,
          waterF: kToF(value), time: iso(time), quality: quality === 1 ? 'good' : 'not_evaluated', qartod: quality,
          surface: parameter.standard === 'sea_surface_temperature' || parameter.name === 'sea_surface_temperature',
        });
      }
    }
    if (!readings.length) continue;
    // Prefer a declared surface reading, then the shallowest sensor, then the
    // newest/best result. Only one reading per physical depth is shown.
    readings.sort((a, b) => Number(b.surface) - Number(a.surface) || (a.depthM ?? 1e9) - (b.depthM ?? 1e9) || a.qartod - b.qartod || Date.parse(b.time) - Date.parse(a.time));
    const profile = [];
    for (const reading of readings) {
      const duplicate = profile.some((item) => item.depthM === reading.depthM);
      if (!duplicate) profile.push(reading);
    }
    profile.sort((a, b) => (a.depthM ?? 1e9) - (b.depthM ?? 1e9));
    const surface = readings[0];
    stations.push({
      id: `GLOS-${row.obs_dataset_id}`, externalId: dataset.externalId, glosDatasetId: Number(row.obs_dataset_id),
      name: dataset.name, type: dataset.type, body: dataset.body, lat: dataset.lat, lon: dataset.lon,
      time: surface.time, waterTime: surface.time, weatherTime: null, waterF: surface.waterF,
      waterDepthM: surface.depthM, waterQuality: surface.quality, profile,
      airF: null, windMph: null, gustMph: null, windFrom: null, wavesFt: null, periodS: null,
      source: 'GLOS Seagull',
    });
  }
  return stations;
}

function normalizedId(value) {
  return String(value || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
}

function milesBetween(a, b) {
  const dx = (a.lon - b.lon) * Math.cos((a.lat + b.lat) / 2 * Math.PI / 180), dy = a.lat - b.lat;
  return Math.hypot(dx, dy) * 69;
}

function combineProfiles(a = [], b = []) {
  const all = [...a, ...b].sort((x, y) => (x.depthM ?? 1e9) - (y.depthM ?? 1e9) || Date.parse(y.time) - Date.parse(x.time));
  return all.filter((item, index) => !all.slice(0, index).some((prior) => prior.depthM === item.depthM));
}

/** Merge duplicate NDBC/GLOS platforms while retaining NDBC wind/waves. */
export function mergeStations(ndbc = [], glos = []) {
  const out = ndbc.map((station) => ({ ...station, externalId: station.id, profile: station.profile || [] }));
  for (const station of glos) {
    const external = normalizedId(station.externalId);
    const match = out.find((candidate) =>
      (external && normalizedId(candidate.externalId || candidate.id) === external) || milesBetween(candidate, station) <= 0.25);
    if (!match) { out.push({ ...station }); continue; }

    match.profile = combineProfiles(match.profile, station.profile);
    match.glosDatasetId = match.glosDatasetId || station.glosDatasetId;
    match.source = match.source === 'NOAA NDBC' ? 'NOAA NDBC + GLOS Seagull' : match.source;
    if (station.name && /^Station\s/i.test(match.name || '')) match.name = station.name;
    // NDBC's WTMP is normally a near-surface measurement. Replace it only with
    // an explicitly shallow GLOS sensor; deeper profiles remain visible without
    // being mislabeled as surface temperature.
    if (match.waterF == null || (station.waterDepthM != null && station.waterDepthM <= 2)) {
      match.waterF = station.waterF; match.waterTime = station.waterTime; match.time = station.waterTime;
      match.waterDepthM = station.waterDepthM; match.waterQuality = station.waterQuality;
    }
  }
  return out.sort((a, b) => String(a.id).localeCompare(String(b.id)));
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
  const finalCache = typeof caches !== 'undefined' ? caches.default : null;
  const finalKey = new Request('https://cache.piercast/observations-v2');
  try {
    if (finalCache) {
      const hit = await finalCache.match(finalKey);
      if (hit) return new Response(hit.body, { headers: { 'content-type': 'application/json', 'cache-control': `private, max-age=${OBS_CACHE_SECONDS}` } });
    }
    const [obs, xml, glosRaw] = await Promise.all([
      cachedText(LATEST_OBS_URL, OBS_CACHE_SECONDS, ctx).catch(() => null),
      cachedText(STATIONS_URL, 86400, ctx).catch(() => ''),
      cachedText(GLOS_LATEST_URL, GLOS_CACHE_SECONDS, ctx).catch(() => null),
    ]);
    const ndbc = obs ? parseLatestObs(obs, parseStations(xml)) : [];
    const glos = glosRaw ? parseGlosLatest(JSON.parse(glosRaw)) : [];
    const list = mergeStations(ndbc, glos);
    if (!list.length) throw new Error('No observation source available');
    const body = JSON.stringify({
      source: 'NOAA NDBC + GLOS Seagull', updated: new Date().toISOString(),
      catalogUpdated: GLOS_CATALOG_GENERATED_AT, stations: list,
    });
    if (finalCache) {
      const put = finalCache.put(finalKey, new Response(body, { headers: { 'content-type': 'application/json', 'cache-control': `max-age=${OBS_CACHE_SECONDS}` } }));
      if (ctx?.waitUntil) ctx.waitUntil(put); else await put;
    }
    return new Response(body, {
      headers: { 'content-type': 'application/json', 'cache-control': 'private, max-age=300' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ source: 'NOAA NDBC + GLOS Seagull', error: 'unavailable', stations: [] }), {
      status: 503, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }
}
