/**
 * Builds the small metadata catalog used to join GLOS's bulk latest feed.
 *
 * The public API returns several MB of dataset/parameter metadata. Parsing that
 * on every Cloudflare edge would waste CPU, so this command emits a reduced,
 * validated JavaScript module to stdout for explicit review. It deliberately
 * never writes network data to the repository itself.
 *
 * Run: npm run refresh:glos-catalog > /tmp/piercast-glos-catalog.js
 */
import { pathToFileURL } from 'node:url';

const DATASETS_URL = 'https://seagull-api.glos.org/api/v1/obs-datasets.geojson';
const PARAMETERS_URL = 'https://seagull-api.glos.org/api/v1/parameters';
const TEMP_NAMES = new Set(['sea_surface_temperature', 'sea_water_temperature']);
const BOX = { west: -92.6, east: -75.6, south: 41.0, north: 49.4 };
const MAX_RESPONSE_BYTES = 16 * 1024 * 1024;
const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;

async function responseText(response, url) {
  const declaredLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_RESPONSE_BYTES) {
    throw new Error(`${url}: response exceeds ${MAX_RESPONSE_BYTES} bytes`);
  }
  if (!response.body) throw new Error(`${url}: empty response`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    bytes += value.byteLength;
    if (bytes > MAX_RESPONSE_BYTES) {
      await reader.cancel();
      throw new Error(`${url}: response exceeds ${MAX_RESPONSE_BYTES} bytes`);
    }
    text += decoder.decode(value, { stream: true });
  }
  return text + decoder.decode();
}

async function json(url) {
  const response = await fetch(url, {
    headers: { accept: 'application/json, application/geo+json', 'user-agent': 'PierCast-LakeMap-Catalog/1.0 (+https://finfindr.app)' },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  const contentType = response.headers.get('content-type')?.toLowerCase() || '';
  if (!contentType.includes('json')) throw new Error(`${url}: expected JSON, received ${contentType || 'unknown content type'}`);
  try {
    return JSON.parse(await responseText(response, url));
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`${url}: invalid JSON`, { cause: error });
    throw error;
  }
}

function safeId(value, label) {
  const id = Number(value);
  if (!Number.isSafeInteger(id) || id <= 0 || id > 10_000_000) throw new Error(`${label}: invalid positive integer`);
  return String(id);
}

function safeText(value, label, maxLength, { nullable = false } = {}) {
  if (value == null && nullable) return null;
  if (typeof value !== 'string') throw new Error(`${label}: expected text`);
  const text = value.trim();
  if (!text || text.length > maxLength || CONTROL_CHARACTERS.test(text)) throw new Error(`${label}: invalid text`);
  return text;
}

function safeDepth(value, label) {
  if (value == null) return null;
  if (!Number.isFinite(value) || value < -10 || value > 1_000) throw new Error(`${label}: invalid depth`);
  return value;
}

export function normalizeCatalog(featureCollection, parameters) {
  if (!featureCollection || featureCollection.type !== 'FeatureCollection' || !Array.isArray(featureCollection.features)) {
    throw new Error('datasets: expected a GeoJSON FeatureCollection');
  }
  if (!Array.isArray(parameters)) throw new Error('parameters: expected an array');
  if (featureCollection.features.length > 100_000 || parameters.length > 100_000) throw new Error('catalog input is unexpectedly large');

  const datasets = Object.create(null);
  for (const feature of featureCollection.features) {
    const [lon, lat] = Array.isArray(feature?.geometry?.coordinates) ? feature.geometry.coordinates : [];
    const props = feature?.properties;
    if (!props || !Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    if (lon < BOX.west || lon > BOX.east || lat < BOX.south || lat > BOX.north) continue;
    if (!Array.isArray(props.parameters) || !props.parameters.some((item) => TEMP_NAMES.has(item?.standard_name))) continue;

    const id = safeId(props.obs_dataset_id, 'dataset id');
    if (datasets[id]) throw new Error(`dataset ${id}: duplicate id`);
    datasets[id] = {
      externalId: safeText(props.org_platform_id, `dataset ${id} external id`, 80, { nullable: true }),
      name: props.platform_name == null
        ? `GLOS station ${id}`
        : safeText(props.platform_name, `dataset ${id} name`, 160),
      body: safeText(props.body_of_water, `dataset ${id} body`, 80, { nullable: true }),
      type: safeText(props.platform_type, `dataset ${id} type`, 80, { nullable: true }),
      lon,
      lat,
    };
  }

  const temperatureParameters = Object.create(null);
  for (const parameter of parameters) {
    if (!TEMP_NAMES.has(parameter?.standard_name) || parameter.public === false || parameter.hide_in_ui === true) continue;
    const id = safeId(parameter.parameter_id, 'parameter id');
    if (temperatureParameters[id]) throw new Error(`parameter ${id}: duplicate id`);
    temperatureParameters[id] = {
      standard: parameter.standard_name,
      name: safeText(parameter.parameter_name ?? parameter.standard_name, `parameter ${id} name`, 160),
      depthM: safeDepth(parameter.depth, `parameter ${id}`),
    };
  }
  return { datasets, temperatureParameters };
}

export function assertCatalogScale({ datasets, temperatureParameters }) {
  const datasetCount = Object.keys(datasets).length;
  const parameterCount = Object.keys(temperatureParameters).length;
  if (datasetCount < 100 || datasetCount > 2_500) throw new Error(`unexpected Great Lakes dataset count: ${datasetCount}`);
  if (parameterCount < 100 || parameterCount > 20_000) throw new Error(`unexpected temperature parameter count: ${parameterCount}`);
}

export function renderCatalogModule({ datasets, temperatureParameters }, generatedAt = new Date().toISOString()) {
  if (!Number.isFinite(Date.parse(generatedAt))) throw new Error('generatedAt: invalid timestamp');
  return `/** Generated by update-glos-catalog.mjs from validated public GLOS metadata. */\n` +
    `export const GLOS_CATALOG_GENERATED_AT=${JSON.stringify(generatedAt)};\n` +
    `export const GLOS_DATASETS=${JSON.stringify(datasets)};\n` +
    `export const GLOS_TEMP_PARAMETERS=${JSON.stringify(temperatureParameters)};\n`;
}

export async function buildCatalogModule() {
  const [featureCollection, parameters] = await Promise.all([json(DATASETS_URL), json(PARAMETERS_URL)]);
  const catalog = normalizeCatalog(featureCollection, parameters);
  assertCatalogScale(catalog);
  return { catalog, moduleText: renderCatalogModule(catalog) };
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  try {
    const { catalog, moduleText } = await buildCatalogModule();
    if (!process.argv.includes('--validate-only')) process.stdout.write(moduleText);
    console.error(`generated ${Object.keys(catalog.datasets).length} Great Lakes datasets and ${Object.keys(catalog.temperatureParameters).length} temperature parameters`);
  } catch (error) {
    console.error(`GLOS catalog generation failed: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}
