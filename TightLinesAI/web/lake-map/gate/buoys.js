/**
 * Observed Great Lakes conditions from NOAA NDBC, NOAA CO-OPS and GLOS Seagull, served by
 * the gatekeeper at /obs/buoys.json. The page cannot reliably join these feeds
 * itself, so the Worker fetches, quality-filters, merges and caches them.
 *
 *   latest_obs.txt       one line per station: newest wind, waves, air/water temp
 *   activestations.xml   station names and types
 *   CO-OPS Data API      six-minute Great Lakes water temperatures
 *   GLOS obs-latest      bulk latest readings with QARTOD flags and depth profiles
 */
import { GLOS_CATALOG_GENERATED_AT, GLOS_DATASETS, GLOS_TEMP_PARAMETERS } from './glos-catalog.js';
import { COOPS_STATIONS } from './coops-catalog.js';

export { COOPS_STATIONS } from './coops-catalog.js';

export const LATEST_OBS_URL = 'https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt';
export const STATIONS_URL = 'https://www.ndbc.noaa.gov/activestations.xml';
export const GLOS_LATEST_URL = 'https://seagull-api.glos.org/api/v2/obs-latest';
export const COOPS_BASE_URL = 'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter';
export const OBS_CACHE_SECONDS = 300;
export const GLOS_CACHE_SECONDS = 600; // GLOS says this bulk endpoint updates roughly every 10 minutes
export const COOPS_CACHE_SECONDS = 900;
const COOPS_BATCH_SIZE = 4;
const COOPS_BATCH_PAUSE_MS = 200;
// the Great Lakes (and St. Clair / Niagara / St. Marys connecting waters)
const BOX = { west: -92.6, east: -75.6, south: 41.0, north: 49.4 };
const MAX_AGE_H = 3;
const MAX_SOURCE_BYTES = 16 * 1024 * 1024;
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
    const coopsStationId = /^(\d{7})\s*-/.exec(st.name || '')?.[1] || null;
    const wspd = num(v[I.wspd]), gst = num(v[I.gst]);
    out.push({
      id, name: tidyName(st.name, id), type: st.type || null, lat, lon,
      time: iso(t), waterTime: waterF === null ? null : iso(t), weatherTime: iso(t), source: 'NOAA NDBC',
      coopsStationId, waterIdentity: waterF === null ? null : `external:${normalizedId(id)}`,
      waterQuality: waterF === null ? null : 'provider_qc',
      waterF, airF: round1(cToF(num(v[I.atmp]))),
      windMph: round1(wspd === null ? null : wspd * MS_TO_MPH), gustMph: round1(gst === null ? null : gst * MS_TO_MPH),
      windFrom: num(v[I.wdir]), wavesFt, periodS: num(v[I.dpd]),
    });
  }
  return out.sort((a, b) => a.id.localeCompare(b.id));
}

/** One quality-passing CO-OPS latest-water-temperature response, in °F. */
export function parseCoopsLatest(input, station, now = Date.now()) {
  const row = Array.isArray(input?.data) ? input.data[0] : null;
  const metadata = input?.metadata;
  if (!row || !metadata || String(metadata.id) !== station.id) return null;
  const celsius = Number(row.v), lat = Number(metadata.lat), lon = Number(metadata.lon);
  const timestamp = typeof row.t === 'string' ? Date.parse(`${row.t.replace(' ', 'T')}Z`) : NaN;
  const flags = String(row.f ?? '').split(',').filter(Boolean);
  if (!Number.isFinite(celsius) || celsius < -2 || celsius > 40 || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lon < BOX.west || lon > BOX.east || lat < BOX.south || lat > BOX.north) return null;
  if (milesBetween({ lat, lon }, station) > 0.5) return null; // reviewed station identity/geometry changed
  if (!Number.isFinite(timestamp) || now - timestamp > MAX_AGE_H * 3600e3 || timestamp - now > 3600e3) return null;
  // CO-OPS flags are emitted per automated check. Only an all-zero result is
  // admitted; a flagged or undocumented value is not silently displayed.
  if (!flags.length || flags.some((flag) => flag !== '0')) return null;
  const waterF = round1(cToF(celsius));
  return {
    id: `COOPS-${station.id}`, externalId: station.id, coopsStationId: station.id,
    name: tidyName(metadata.name || '', station.id), type: 'fixed', body: station.body,
    lat, lon, time: iso(timestamp), waterTime: iso(timestamp), weatherTime: null,
    waterF, waterDepthM: null, waterIdentity: `coops:${station.id}`, waterQuality: 'provider_qc', profile: [],
    airF: null, windMph: null, gustMph: null, windFrom: null, wavesFt: null, periodS: null,
    source: 'NOAA CO-OPS',
  };
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
          identity: `glos:${Number(row.obs_dataset_id)}`, source: 'GLOS Seagull',
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
      waterDepthM: surface.depthM, waterSurface: surface.surface, waterIdentity: surface.identity,
      waterQuality: surface.quality, profile,
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

function addSource(current, next) {
  const sources = String(current || '').split(' + ').filter(Boolean);
  if (!sources.includes(next)) sources.push(next);
  return sources.join(' + ');
}

/** Merge duplicate NDBC/CO-OPS/GLOS platforms while retaining weather fields. */
export function mergeStations(ndbc = [], glos = [], coops = []) {
  const out = ndbc.map((station) => ({ ...station, externalId: station.id, profile: station.profile || [] }));
  for (const station of coops) {
    const match = out.find((candidate) =>
      candidate.coopsStationId === station.coopsStationId || milesBetween(candidate, station) <= 0.4);
    if (!match) { out.push({ ...station }); continue; }
    match.coopsStationId = station.coopsStationId;
    match.source = addSource(match.source, 'NOAA CO-OPS');
    if (station.waterF != null && (!match.waterTime || Date.parse(station.waterTime) >= Date.parse(match.waterTime))) {
      match.waterF = station.waterF; match.waterTime = station.waterTime; match.time = station.waterTime;
      match.waterDepthM = station.waterDepthM; match.waterSurface = false;
      match.waterIdentity = station.waterIdentity || `coops:${station.coopsStationId || normalizedId(station.id)}`;
      match.waterQuality = station.waterQuality;
    }
  }
  for (const station of glos) {
    const external = normalizedId(station.externalId);
    const match = out.find((candidate) =>
      (external && normalizedId(candidate.externalId || candidate.id) === external) || milesBetween(candidate, station) <= 0.25);
    if (!match) { out.push({ ...station }); continue; }

    match.profile = combineProfiles(match.profile, station.profile);
    match.glosDatasetId = match.glosDatasetId || station.glosDatasetId;
    match.source = addSource(match.source, 'GLOS Seagull');
    if (station.name && /^Station\s/i.test(match.name || '')) match.name = station.name;
    // NDBC's WTMP is normally a near-surface measurement. Replace it only with
    // an explicitly shallow GLOS sensor; deeper profiles remain visible without
    // being mislabeled as surface temperature.
    if (match.waterF == null || (station.waterDepthM != null && station.waterDepthM <= 2)) {
      match.waterF = station.waterF; match.waterTime = station.waterTime; match.time = station.waterTime;
      match.waterDepthM = station.waterDepthM; match.waterSurface = station.waterSurface;
      match.waterIdentity = station.waterIdentity || `glos:${station.glosDatasetId || normalizedId(station.id)}`;
      match.waterQuality = station.waterQuality;
    }
  }
  return out.sort((a, b) => String(a.id).localeCompare(String(b.id)));
}

function coopsUrl(id) {
  const url = new URL(COOPS_BASE_URL);
  for (const [key, value] of Object.entries({
    date: 'latest', station: id, product: 'water_temperature', datum: 'IGLD',
    time_zone: 'gmt', units: 'metric', format: 'json', application: 'FinFindr',
  })) url.searchParams.set(key, value);
  return url.toString();
}

function qualitySummary(stations) {
  const water = stations.filter((station) => station.waterF != null);
  const shallow = water.filter((station) => station.waterSurface || (Number.isFinite(station.waterDepthM) && station.waterDepthM <= 3));
  const strict = shallow.filter((station) => station.waterQuality === 'good');
  return {
    stations: stations.length, waterStations: water.length,
    knownDepth: water.filter((station) => Number.isFinite(station.waterDepthM)).length,
    surfaceOrShallow: shallow.length, strictValidation: strict.length,
    profiles: stations.filter((station) => Array.isArray(station.profile) && station.profile.length > 1).length,
  };
}

async function fetchCoopsStations(ctx, now) {
  const results = [];
  for (let start = 0; start < COOPS_STATIONS.length; start += COOPS_BATCH_SIZE) {
    const batch = COOPS_STATIONS.slice(start, start + COOPS_BATCH_SIZE);
    results.push(...await Promise.all(batch.map(async (station) => {
      try {
        const raw = await cachedText(coopsUrl(station.id), COOPS_CACHE_SECONDS, ctx);
        return { ok: true, value: parseCoopsLatest(JSON.parse(raw), station, now) };
      } catch { return { ok: false, value: null }; }
    })));
    // NOAA explicitly recommends spacing successive API queries. Keep this
    // scheduled workload gentle; the one-second total pause is not user-facing.
    if (start + COOPS_BATCH_SIZE < COOPS_STATIONS.length) {
      await new Promise((resolve) => setTimeout(resolve, COOPS_BATCH_PAUSE_MS));
    }
  }
  return results;
}

async function cachedText(url, ttlSeconds, ctx) {
  const cache = typeof caches !== 'undefined' ? caches.default : null;
  const key = new Request(`https://cache.piercast/${encodeURIComponent(url)}`);
  if (cache) {
    const hit = await cache.match(key);
    if (hit) return hit.text();
  }
  const res = await fetch(url, {
    headers: { 'user-agent': 'PierCast-LakeMap/1.0 (+https://finfindr.app)' },
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  const declared = Number(res.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_SOURCE_BYTES) throw new Error(`${url}: response too large`);
  if (!res.body) throw new Error(`${url}: empty response`);
  const reader = res.body.getReader(), decoder = new TextDecoder();
  let received = 0, text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_SOURCE_BYTES) {
      await reader.cancel();
      throw new Error(`${url}: response too large`);
    }
    text += decoder.decode(value, { stream: true });
  }
  text += decoder.decode();
  if (cache) {
    const put = cache.put(key, new Response(text, { headers: { 'cache-control': `max-age=${ttlSeconds}` } }));
    if (ctx && ctx.waitUntil) ctx.waitUntil(put); else await put;
  }
  return text;
}

export async function buildObservationSnapshot(ctx, now = Date.now()) {
  const ndbcObs = cachedText(LATEST_OBS_URL, OBS_CACHE_SECONDS, ctx).catch(() => null);
  const ndbcXml = cachedText(STATIONS_URL, 86400, ctx).catch(() => '');
  const glosText = cachedText(GLOS_LATEST_URL, GLOS_CACHE_SECONDS, ctx).catch(() => null);
  const coopsResults = fetchCoopsStations(ctx, now);
  const [obs, xml, glosRaw, coopsSettled] = await Promise.all([ndbcObs, ndbcXml, glosText, coopsResults]);
  let ndbc = [], ndbcOk = false;
  try { ndbc = obs ? parseLatestObs(obs, parseStations(xml), now) : []; ndbcOk = !!obs; } catch { ndbc = []; }
  let glos = [], glosOk = false;
  try { glos = glosRaw ? parseGlosLatest(JSON.parse(glosRaw), now) : []; glosOk = !!glosRaw; } catch { glos = []; }
  const coops = coopsSettled.map((result) => result.value).filter(Boolean);
  const list = mergeStations(ndbc, glos, coops);
  if (!list.length) throw new Error('No observation source available');
  return {
    formatVersion: 3,
    source: 'NOAA NDBC + NOAA CO-OPS + GLOS Seagull', updated: new Date(now).toISOString(),
    catalogUpdated: GLOS_CATALOG_GENERATED_AT,
    health: {
      sources: {
        ndbc: { status: ndbcOk ? 'ok' : 'unavailable', stations: ndbc.length },
        coops: {
          status: coopsSettled.every((result) => result.ok) ? 'ok' : coops.length ? 'partial' : 'unavailable',
          requested: COOPS_STATIONS.length, responses: coopsSettled.filter((result) => result.ok).length, stations: coops.length,
        },
        glos: { status: glosOk ? 'ok' : 'unavailable', stations: glos.length },
      },
      quality: qualitySummary(list),
    },
    stations: list,
  };
}

async function centralSnapshot(env) {
  if (!env?.BUCKET?.get) return null;
  const object = await env.BUCKET.get('observations/latest.json');
  if (!object?.body) return null;
  try {
    const payload = JSON.parse(await new Response(object.body).text());
    const age = Date.now() - Date.parse(payload.updated);
    if (!Number.isFinite(age) || age < 0) return null;
    return { payload, fresh: age <= 30 * 60e3 };
  } catch { return null; }
}

export async function buoysResponse(ctx, env) {
  const finalCache = typeof caches !== 'undefined' ? caches.default : null;
  const finalKey = new Request('https://cache.piercast/observations-v3');
  try {
    if (finalCache) {
      const hit = await finalCache.match(finalKey);
      if (hit) return new Response(hit.body, { headers: { 'content-type': 'application/json', 'cache-control': `private, max-age=${OBS_CACHE_SECONDS}` } });
    }
    const archived = await centralSnapshot(env);
    // Once the scheduled archive exists, never turn map traffic into upstream
    // traffic if the cron falls behind. Fail visibly instead of serving stale
    // water temperatures or multiplying 23 source requests across edge POPs.
    if (archived && !archived.fresh) {
      return new Response(JSON.stringify({
        source: archived.payload.source, updated: archived.payload.updated,
        error: 'archive_stale', stations: [],
      }), { status: 503, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
    }
    const payload = archived?.payload || await buildObservationSnapshot(ctx);
    const body = JSON.stringify(payload);
    if (finalCache) {
      const put = finalCache.put(finalKey, new Response(body, { headers: { 'content-type': 'application/json', 'cache-control': `max-age=${OBS_CACHE_SECONDS}` } }));
      if (ctx?.waitUntil) ctx.waitUntil(put); else await put;
    }
    return new Response(body, {
      headers: { 'content-type': 'application/json', 'cache-control': 'private, max-age=300' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ source: 'NOAA NDBC + NOAA CO-OPS + GLOS Seagull', error: 'unavailable', stations: [] }), {
      status: 503, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
    });
  }
}
