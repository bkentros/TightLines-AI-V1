import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = new URL("..", import.meta.url);
const OUTPUT = new URL("../assets/data/pier-cast-great-lakes-map.json", import.meta.url);
const LAKES_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_lakes.geojson";
const REGIONS_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson";

const LAKE_NAMES = new Set([
  "Lake Superior",
  "Lake Michigan",
  "Lake Huron",
  "Lake Erie",
  "Lake Ontario",
]);
const REGION_NAMES = new Set([
  "Minnesota",
  "Wisconsin",
  "Illinois",
  "Indiana",
  "Michigan",
  "Ohio",
  "Pennsylvania",
  "New York",
  "Ontario",
]);

function squareSegmentDistance(point, start, end) {
  let x = start[0];
  let y = start[1];
  let dx = end[0] - x;
  let dy = end[1] - y;
  if (dx || dy) {
    const projection =
      ((point[0] - x) * dx + (point[1] - y) * dy) / (dx * dx + dy * dy);
    if (projection > 1) {
      x = end[0];
      y = end[1];
    } else if (projection > 0) {
      x += dx * projection;
      y += dy * projection;
    }
  }
  dx = point[0] - x;
  dy = point[1] - y;
  return dx * dx + dy * dy;
}

function simplifyRing(points, tolerance = 0.025) {
  if (points.length <= 4) return points;
  const closed = points[0][0] === points.at(-1)[0] &&
    points[0][1] === points.at(-1)[1];
  const source = closed ? points.slice(0, -1) : points;
  const keep = new Uint8Array(source.length);
  keep[0] = 1;
  keep[source.length - 1] = 1;
  const stack = [[0, source.length - 1]];
  const squareTolerance = tolerance * tolerance;
  while (stack.length > 0) {
    const [startIndex, endIndex] = stack.pop();
    let furthestIndex = -1;
    let furthestDistance = squareTolerance;
    for (let index = startIndex + 1; index < endIndex; index += 1) {
      const distance = squareSegmentDistance(
        source[index],
        source[startIndex],
        source[endIndex],
      );
      if (distance > furthestDistance) {
        furthestDistance = distance;
        furthestIndex = index;
      }
    }
    if (furthestIndex > 0) {
      keep[furthestIndex] = 1;
      stack.push([startIndex, furthestIndex], [furthestIndex, endIndex]);
    }
  }
  const output = source
    .filter((_, index) => keep[index])
    .map(([longitude, latitude]) => [
      Number(longitude.toFixed(5)),
      Number(latitude.toFixed(5)),
    ]);
  if (closed) output.push(output[0]);
  return output.length >= 4 ? output : points;
}

function simplifyGeometry(geometry) {
  if (geometry.type === "Polygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map((ring) => simplifyRing(ring)),
    };
  }
  if (geometry.type === "MultiPolygon") {
    return {
      ...geometry,
      coordinates: geometry.coordinates.map((polygon) =>
        polygon.map((ring) => simplifyRing(ring))
      ),
    };
  }
  return geometry;
}

function compactFeature(feature, kind) {
  return {
    type: "Feature",
    properties: {
      name: feature.properties.name,
      code: feature.properties.iso_3166_2 ?? null,
      kind,
    },
    geometry: simplifyGeometry(feature.geometry),
  };
}

async function readGeoJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Could not download ${url}: ${response.status}`);
  return response.json();
}

const [lakeSource, regionSource] = await Promise.all([
  readGeoJson(LAKES_URL),
  readGeoJson(REGIONS_URL),
]);
const output = {
  attribution: "Natural Earth public-domain vector data",
  generatedBy: path.relative(
    fileURLToPath(ROOT),
    fileURLToPath(import.meta.url),
  ),
  regions: {
    type: "FeatureCollection",
    features: regionSource.features
      .filter((feature) => REGION_NAMES.has(feature.properties.name))
      .map((feature) => compactFeature(feature, "region"))
      .sort((left, right) => left.properties.name.localeCompare(right.properties.name)),
  },
  lakes: {
    type: "FeatureCollection",
    features: lakeSource.features
      .filter((feature) => LAKE_NAMES.has(feature.properties.name))
      .map((feature) => compactFeature(feature, "lake"))
      .sort((left, right) => left.properties.name.localeCompare(right.properties.name)),
  },
};

if (output.regions.features.length !== REGION_NAMES.size) {
  throw new Error(
    `Expected ${REGION_NAMES.size} regions, received ${output.regions.features.length}`,
  );
}
if (output.lakes.features.length !== LAKE_NAMES.size) {
  throw new Error(
    `Expected ${LAKE_NAMES.size} lakes, received ${output.lakes.features.length}`,
  );
}

await mkdir(new URL("../assets/data/", import.meta.url), { recursive: true });
await writeFile(OUTPUT, `${JSON.stringify(output)}\n`);
console.log(
  `Wrote ${output.regions.features.length} regions and ${output.lakes.features.length} lakes to ${fileURLToPath(OUTPUT)}`,
);
