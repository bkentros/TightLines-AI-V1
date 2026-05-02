import type {
  LonLat,
  PolygonM,
  WaterReaderEngineInput,
  WaterReaderPolygonGeoJson,
  WaterReaderPreprocessResult,
} from './contracts';
import { computeLakeMetrics, ringSignedAreaM } from './metrics';
import { createLocalProjection, projectRing } from './projection';
import {
  resampleClosedRingByArcLength,
  resampleSpacingM,
  simplifyDouglasPeucker,
  simplifyToleranceM,
  smoothingSigmaM,
  smoothClosedRingByArcLength,
} from './shoreline';

type ComponentLonLat = {
  exterior: LonLat[];
  holes: LonLat[][];
  roughAreaM: number;
};

export function preprocessWaterReaderGeometry(input: WaterReaderEngineInput): WaterReaderPreprocessResult {
  const components = parseGeoJsonComponents(input.geojson);
  if (components.length === 0) {
    return {
      supportStatus: 'not_supported',
      supportReason: 'Missing or invalid polygon geometry.',
      qaFlags: ['invalid_or_missing_polygon_geometry'],
    };
  }

  const sorted = [...components].sort((a, b) => b.roughAreaM - a.roughAreaM);
  const primaryLonLat = sorted[0]!;
  if (primaryLonLat.roughAreaM <= 0 || primaryLonLat.exterior.length < 3) {
    return {
      supportStatus: 'not_supported',
      supportReason: 'Polygon geometry could not be measured safely.',
      qaFlags: ['unmeasurable_primary_polygon'],
    };
  }

  const origin = polygonCentroidLonLat(primaryLonLat.exterior) ?? averageLonLat(primaryLonLat.exterior);
  if (!origin || !Number.isFinite(origin.lon) || !Number.isFinite(origin.lat)) {
    return {
      supportStatus: 'not_supported',
      supportReason: 'Polygon projection origin could not be determined.',
      qaFlags: ['projection_origin_failed'],
    };
  }

  const projection = createLocalProjection(origin);
  const primaryPolygon = normalizeProjectedPolygon({
    exterior: projectRing(primaryLonLat.exterior, projection),
    holes: primaryLonLat.holes.map((hole) => projectRing(hole, projection)),
  });
  const secondaryComponents = sorted.slice(1).map((component) =>
    normalizeProjectedPolygon({
      exterior: projectRing(component.exterior, projection),
      holes: component.holes.map((hole) => projectRing(hole, projection)),
    }),
  );

  const metrics = computeLakeMetrics({
    polygon: primaryPolygon,
    componentCount: components.length,
  });
  if (metrics.areaSqM <= 0 || metrics.longestDimensionM <= 0) {
    return {
      supportStatus: 'not_supported',
      supportReason: 'Polygon area or longest dimension could not be measured safely.',
      qaFlags: ['invalid_projected_polygon_metrics'],
      projection: { origin, lat0: projection.lat0, lon0: projection.lon0 },
      primaryPolygon,
      metrics,
    };
  }

  const qaFlags: string[] = [];
  let supportStatus: WaterReaderPreprocessResult['supportStatus'] = 'supported';
  let supportReason = 'Primary polygon geometry is ready for deterministic Water Reader preprocessing.';
  const secondaryTooLarge = secondaryComponents.some((component) => {
    const area = Math.abs(ringSignedAreaM(component.exterior));
    return area > metrics.areaSqM * 0.08;
  });
  if (secondaryTooLarge) {
    supportStatus = 'needs_review';
    supportReason = 'Multipart polygon has a secondary component larger than 8% of the primary component.';
    qaFlags.push('secondary_component_gt_8pct_primary');
  } else if (secondaryComponents.length > 0) {
    qaFlags.push('secondary_components_ignored_as_disconnected_water');
  }
  if (primaryPolygon.holes.length > 0) qaFlags.push('interior_rings_treated_as_islands');

  const spacing = resampleSpacingM(metrics.longestDimensionM);
  const tolerance = simplifyToleranceM(metrics.longestDimensionM);
  const sigma = smoothingSigmaM(metrics.longestDimensionM);
  const resampledExterior = resampleClosedRingByArcLength(primaryPolygon.exterior, spacing);
  const simplifiedExterior = simplifyDouglasPeucker(resampledExterior, tolerance);
  const smoothedExterior = smoothClosedRingByArcLength(simplifiedExterior, sigma);

  return {
    supportStatus,
    supportReason,
    qaFlags,
    projection: { origin, lat0: projection.lat0, lon0: projection.lon0 },
    primaryPolygon,
    secondaryComponents,
    metrics,
    resampledExterior,
    simplifiedExterior,
    smoothedExterior,
    resampleSpacingM: spacing,
    simplifyToleranceM: tolerance,
    smoothingSigmaM: sigma,
  };
}

function parseGeoJsonComponents(geojson: WaterReaderPolygonGeoJson | null | undefined): ComponentLonLat[] {
  if (!geojson || !Array.isArray(geojson.coordinates)) return [];
  if (geojson.type === 'Polygon') {
    const component = parsePolygonCoordinates(geojson.coordinates);
    return component ? [component] : [];
  }
  if (geojson.type === 'MultiPolygon') {
    const out: ComponentLonLat[] = [];
    for (const polygon of geojson.coordinates) {
      if (!Array.isArray(polygon)) continue;
      const component = parsePolygonCoordinates(polygon);
      if (component) out.push(component);
    }
    return out;
  }
  return [];
}

function parsePolygonCoordinates(polygon: unknown[]): ComponentLonLat | null {
  if (polygon.length === 0) return null;
  const exterior = parseRing(polygon[0]);
  if (!exterior || exterior.length < 3) return null;
  const holes: LonLat[][] = [];
  for (let i = 1; i < polygon.length; i++) {
    const hole = parseRing(polygon[i]);
    if (hole && hole.length >= 3) holes.push(hole);
  }
  const roughProjection = createLocalProjection(averageLonLat(exterior) ?? exterior[0]!);
  const roughAreaM = Math.abs(ringSignedAreaM(projectRing(exterior, roughProjection)));
  if (roughAreaM <= 0) return null;
  return { exterior, holes, roughAreaM };
}

function parseRing(value: unknown): LonLat[] | null {
  if (!Array.isArray(value)) return null;
  const ring: LonLat[] = [];
  for (const point of value) {
    if (!Array.isArray(point) || point.length < 2) continue;
    const lon = point[0];
    const lat = point[1];
    if (typeof lon !== 'number' || typeof lat !== 'number') continue;
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    ring.push({ lon, lat });
  }
  const open = openLonLatRing(ring);
  return open.length >= 3 ? open : null;
}

function normalizeProjectedPolygon(polygon: PolygonM): PolygonM {
  const exteriorArea = ringSignedAreaM(polygon.exterior);
  const exterior = exteriorArea < 0 ? [...polygon.exterior].reverse() : polygon.exterior;
  const holes = polygon.holes.map((hole) => (ringSignedAreaM(hole) > 0 ? [...hole].reverse() : hole));
  return { exterior, holes };
}

function openLonLatRing(ring: LonLat[]): LonLat[] {
  if (ring.length < 2) return ring;
  const first = ring[0]!;
  const last = ring[ring.length - 1]!;
  if (first.lon === last.lon && first.lat === last.lat) return ring.slice(0, -1);
  return ring;
}

function averageLonLat(ring: LonLat[]): LonLat | null {
  if (ring.length === 0) return null;
  let lon = 0;
  let lat = 0;
  for (const point of ring) {
    lon += point.lon;
    lat += point.lat;
  }
  return { lon: lon / ring.length, lat: lat / ring.length };
}

function polygonCentroidLonLat(ring: LonLat[]): LonLat | null {
  let area2 = 0;
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    const cross = a.lon * b.lat - b.lon * a.lat;
    area2 += cross;
    cx += (a.lon + b.lon) * cross;
    cy += (a.lat + b.lat) * cross;
  }
  if (Math.abs(area2) < 1e-12) return null;
  return {
    lon: cx / (3 * area2),
    lat: cy / (3 * area2),
  };
}
