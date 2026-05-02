import {
  lookupWaterReaderSeason,
  preprocessWaterReaderGeometry,
  ringSignedAreaM,
  type WaterReaderPolygonGeoJson,
} from '../lib/water-reader-engine';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function rectangle(minLon: number, minLat: number, maxLon: number, maxLat: number): number[][] {
  return [
    [minLon, minLat],
    [maxLon, minLat],
    [maxLon, maxLat],
    [minLon, maxLat],
    [minLon, minLat],
  ];
}

function polygon(rings: number[][][]): WaterReaderPolygonGeoJson {
  return { type: 'Polygon', coordinates: rings };
}

function multipolygon(polygons: number[][][][]): WaterReaderPolygonGeoJson {
  return { type: 'MultiPolygon', coordinates: polygons };
}

function scaledRing(points: [number, number][]): number[][] {
  const baseLon = -85;
  const baseLat = 44;
  const scale = 0.001;
  const ring = points.map(([x, y]) => [baseLon + x * scale, baseLat + y * scale]);
  const first = ring[0]!;
  const last = ring[ring.length - 1]!;
  if (first[0] !== last[0] || first[1] !== last[1]) ring.push([...first]);
  return ring;
}

const simple = preprocessWaterReaderGeometry({
  state: 'MI',
  geojson: polygon([rectangle(-85, 44, -84.99, 44.008)]),
});
assert(simple.supportStatus === 'supported', 'simple rectangle should be supported');
assert(simple.metrics && simple.metrics.areaSqM > 0, 'simple rectangle should have area');
assert(simple.metrics && simple.metrics.longestDimensionM > 0, 'simple rectangle should have longest dimension');
assert(simple.primaryPolygon && ringSignedAreaM(simple.primaryPolygon.exterior) > 0, 'exterior should be CCW');
assert(simple.resampledExterior && simple.resampledExterior.length >= 3, 'simple rectangle should resample');

const withHole = preprocessWaterReaderGeometry({
  state: 'MI',
  geojson: polygon([
    rectangle(-85, 44, -84.98, 44.018),
    rectangle(-84.993, 44.007, -84.989, 44.011),
  ]),
});
assert(withHole.supportStatus === 'supported', 'polygon with island hole should be supported');
assert(withHole.primaryPolygon?.holes.length === 1, 'polygon should preserve one hole');
assert(withHole.primaryPolygon.holes.every((hole) => ringSignedAreaM(hole) < 0), 'holes should be clockwise');
assert(withHole.qaFlags.includes('interior_rings_treated_as_islands'), 'hole QA flag should be present');

const smallSecondary = preprocessWaterReaderGeometry({
  state: 'MI',
  geojson: multipolygon([
    [rectangle(-85, 44, -84.98, 44.02)],
    [rectangle(-84.95, 44.05, -84.948, 44.052)],
  ]),
});
assert(smallSecondary.supportStatus === 'supported', 'small secondary component should remain supported');
assert(smallSecondary.secondaryComponents?.length === 1, 'small secondary component should be retained as secondary');
assert(
  smallSecondary.qaFlags.includes('secondary_components_ignored_as_disconnected_water'),
  'small secondary component QA flag should be present',
);

const largeSecondary = preprocessWaterReaderGeometry({
  state: 'MI',
  geojson: multipolygon([
    [rectangle(-85, 44, -84.98, 44.02)],
    [rectangle(-84.95, 44.05, -84.94, 44.06)],
  ]),
});
assert(largeSecondary.supportStatus === 'needs_review', 'large secondary component should need review');
assert(
  largeSecondary.qaFlags.includes('secondary_component_gt_8pct_primary'),
  'large secondary component QA flag should be present',
);

const protrusion = preprocessWaterReaderGeometry({
  state: 'MI',
  geojson: polygon([
    scaledRing([
      [0, 0],
      [12, 0],
      [12, 8],
      [7, 8],
      [6, 4],
      [5, 8],
      [0, 8],
    ]),
  ]),
});
assert(protrusion.supportStatus === 'supported', 'non-rectangular protrusion polygon should be supported');
assert(
  (protrusion.resampledExterior?.length ?? 0) > (protrusion.primaryPolygon?.exterior.length ?? 0),
  'protrusion polygon should gain resampled shoreline detail',
);
assert(
  (protrusion.simplifiedExterior?.length ?? 0) >= 5 && (protrusion.smoothedExterior?.length ?? 0) >= 5,
  'protrusion simplify/smooth should preserve enough vertices',
);

const pocket = preprocessWaterReaderGeometry({
  state: 'MI',
  geojson: polygon([
    scaledRing([
      [0, 0],
      [12, 0],
      [12, 6],
      [7.75, 6],
      [7, 9],
      [6, 10],
      [5, 9],
      [4.25, 6],
      [0, 6],
    ]),
  ]),
});
assert(pocket.supportStatus === 'supported', 'cove/pocket-shaped polygon should be supported');
assert(
  (pocket.simplifiedExterior?.length ?? 0) >= 6 && (pocket.smoothedExterior?.length ?? 0) >= 6,
  'pocket simplify/smooth should preserve enough vertices',
);

const michiganSeason = lookupWaterReaderSeason('MI', new Date(Date.UTC(2026, 4, 1)));
assert(michiganSeason?.seasonGroup === 'north', 'MI should map to North');
assert(michiganSeason.season === 'spring', 'MI on 2026-05-01 should be spring');

console.log(
  JSON.stringify({
    ok: true,
    cases: 7,
    simpleAreaSqM: Math.round(simple.metrics?.areaSqM ?? 0),
    michiganSeason: michiganSeason.season,
  }),
);
