/**
 * National Weather Service alerts that matter on the piers and the water:
 * marine alerts for the Great Lakes (Small Craft Advisory, Gale Warning …) and
 * lakeshore alerts for the shore counties (Beach Hazards / Rip Current
 * statements, Lakeshore Flood …). Read live from api.weather.gov (free, CORS
 * open) so the map always shows what is in effect right now.
 *
 * Alerts issued by zone come without a shape; their zones' outlines are
 * fetched once and cached for the session.
 */
export const NWS_API = 'https://api.weather.gov';
export const MARINE_AREAS = ['LS', 'LM', 'LH', 'LE', 'LO', 'LC', 'SL'];
export const SHORE_STATES = ['MN', 'WI', 'IL', 'IN', 'MI', 'OH', 'PA', 'NY'];
export const SHORE_EVENTS = new Set([
  'Beach Hazards Statement', 'Rip Current Statement', 'High Surf Advisory', 'High Surf Warning',
  'Lakeshore Flood Warning', 'Lakeshore Flood Advisory', 'Lakeshore Flood Watch', 'Lakeshore Flood Statement',
]);
// Great Lakes box (alerts elsewhere in these states, e.g. Long Island rip currents, are dropped)
const BOX = { west: -92.8, east: -75.4, south: 40.9, north: 49.5 };
const MAX_ZONES = 60;

/** 'warning' (red) | 'advisory' (orange) | 'statement' (yellow) */
export function alertLevel(event = '') {
  if (/Warning$/.test(event)) return 'warning';
  if (/Advisory$|Watch$/.test(event)) return 'advisory';
  return 'statement';
}
const RANK = { warning: 0, advisory: 1, statement: 2 };

function slim(f) {
  const p = f.properties || {};
  return {
    id: p.id || f.id, event: p.event || 'Alert', headline: p.headline || p.event || '', areaDesc: p.areaDesc || '',
    severity: p.severity || '', sent: p.sent || null, onset: p.onset || p.effective || null,
    ends: p.ends || p.expires || null, description: p.description || '', instruction: p.instruction || '',
    sender: p.senderName || '', level: alertLevel(p.event), zones: Array.isArray(p.affectedZones) ? p.affectedZones : [],
    geometry: f.geometry || null, ...alertWindow(p),
    references: (Array.isArray(p.references) ? p.references : []).map((r) => r.identifier || r['@id'] || r.id).filter(Boolean),
  };
}

/**
 * When an alert is in force, in ms: from onset (else effective / sent) until
 * ends (else expires). Without either end the Weather Service means "until
 * further notice"; it is then treated as lasting 24 hours from its start and
 * shown as "until further notice".
 */
export function alertWindow(p) {
  const start = Date.parse(p.onset || p.effective || p.sent || '') || Date.now();
  const endAt = Date.parse(p.ends || p.expires || '');
  return { start, end: Number.isFinite(endAt) ? endAt : start + 24 * 3600e3, openEnded: !Number.isFinite(endAt) };
}

/** Is the alert in force at time ms? */
export const activeAt = (a, ms) => a.start <= ms && ms < a.end;

/** Active alerts that apply to the lakes and their shore, most serious first. */
export async function fetchNwsAlerts(fetchFn = fetch) {
  const get = (q) => fetchFn(`${NWS_API}/alerts/active?${q}`, { headers: { accept: 'application/geo+json' } })
    .then((r) => (r.ok ? r.json() : { features: [] }));
  const [marine, shore] = await Promise.all([
    get(`area=${MARINE_AREAS.join(',')}`),
    get(`area=${SHORE_STATES.join(',')}`).catch(() => ({ features: [] })),
  ]);
  const seen = new Set(), all = [];
  for (const f of [...(marine.features || []), ...(shore.features || []).filter((x) => SHORE_EVENTS.has(x.properties?.event))]) {
    const a = slim(f);
    if (seen.has(a.id) || a.end <= Date.now()) continue;
    if ((f.properties?.messageType || '') === 'Cancel') continue;
    seen.add(a.id); all.push(a);
  }
  // an update replaces the alert it refers to: never show both
  const replaced = new Set(all.flatMap((a) => a.references));
  const out = all.filter((a) => !replaced.has(a.id));
  return out.sort((a, b) => RANK[a.level] - RANK[b.level] || a.end - b.end);
}

const zoneCache = new Map();
function zoneShape(url, fetchFn) {
  if (!zoneCache.has(url)) {
    zoneCache.set(url, fetchFn(url, { headers: { accept: 'application/geo+json' } })
      .then((r) => (r.ok ? r.json() : null)).then((z) => z?.geometry || null).catch(() => null));
  }
  return zoneCache.get(url);
}

function bbox(geom) {
  const b = [180, 90, -180, -90];
  const walk = (c) => { if (typeof c[0] === 'number') { b[0] = Math.min(b[0], c[0]); b[1] = Math.min(b[1], c[1]); b[2] = Math.max(b[2], c[0]); b[3] = Math.max(b[3], c[1]); } else c.forEach(walk); };
  if (geom?.type === 'GeometryCollection') geom.geometries.forEach((g) => walk(g.coordinates)); else if (geom) walk(geom.coordinates);
  return b;
}
const inBox = (b) => b[2] >= BOX.west && b[0] <= BOX.east && b[3] >= BOX.south && b[1] <= BOX.north;

/**
 * Alerts with shapes (their own, or their zones'), as a GeoJSON FeatureCollection
 * plus the alert list with a bounding box each; alerts outside the Great Lakes are dropped.
 */
export async function alertShapes(alerts, fetchFn = fetch) {
  const features = [], kept = [];
  let zonesLeft = MAX_ZONES;
  for (const a of alerts) {
    let geoms = a.geometry ? [a.geometry] : [];
    if (!geoms.length && a.zones.length) {
      const urls = a.zones.slice(0, Math.max(0, zonesLeft)); zonesLeft -= urls.length;
      geoms = (await Promise.all(urls.map((u) => zoneShape(u, fetchFn)))).filter(Boolean);
    }
    if (!geoms.length) continue;
    const boxes = geoms.map(bbox).filter(inBox);
    if (!boxes.length) continue;
    const b = boxes.reduce((m, x) => [Math.min(m[0], x[0]), Math.min(m[1], x[1]), Math.max(m[2], x[2]), Math.max(m[3], x[3])]);
    kept.push({ ...a, bbox: b, geometry: undefined });
    geoms.forEach((g) => { if (inBox(bbox(g))) features.push({ type: 'Feature', geometry: g, properties: { id: a.id, level: a.level, event: a.event, s: a.start, e: a.end } }); });
  }
  // warnings drawn last (on top)
  features.sort((x, y) => RANK[y.properties.level] - RANK[x.properties.level]);
  return { alerts: kept, geojson: { type: 'FeatureCollection', features } };
}
