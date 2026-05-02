import {
  detectWaterReaderFeatures,
  getLastCoveSuppressionSummary,
  preprocessWaterReaderGeometry,
  resolveWaterReaderFeatureConflicts,
  validateCoveWaterInterior,
  type PointM,
  type WaterReaderDetectedFeature,
  type WaterReaderLakeMetrics,
  type WaterReaderPolygonGeoJson,
  type WaterReaderPreprocessResult,
} from '../lib/water-reader-engine';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
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

function polygon(rings: number[][][]): WaterReaderPolygonGeoJson {
  return { type: 'Polygon', coordinates: rings };
}

function runFeatureCase(label: string, geojson: WaterReaderPolygonGeoJson): WaterReaderDetectedFeature[] {
  return runFeatureCaseWithPreprocess(label, geojson).features;
}

function runFeatureCaseWithPreprocess(
  label: string,
  geojson: WaterReaderPolygonGeoJson,
): { preprocess: WaterReaderPreprocessResult; features: WaterReaderDetectedFeature[] } {
  const preprocess = preprocessWaterReaderGeometry({
    state: 'MI',
    acreage: 80,
    geojson,
  });
  assert(preprocess.supportStatus !== 'not_supported', `${label} should preprocess`);
  return { preprocess, features: detectWaterReaderFeatures(preprocess, { state: 'MI', acreage: 80, geojson }) };
}

const rectangle = runFeatureCase(
  'rectangle',
  polygon([
    scaledRing([
      [0, 0],
      [12, 0],
      [12, 8],
      [0, 8],
    ]),
  ]),
);
assert(!rectangle.some((f) => f.featureClass === 'main_lake_point' || f.featureClass === 'secondary_point'), 'rectangle should produce no points');
assert(!rectangle.some((f) => f.featureClass === 'cove'), 'rectangle should produce no coves');
assert(!rectangle.some((f) => f.featureClass === 'island'), 'rectangle should produce no islands');

const pointFeatures = runFeatureCase(
  'obvious point',
  polygon([
    scaledRing([
      [0, 0],
      [14, 0],
      [14, 8],
      [8, 8],
      [7, 3],
      [6, 8],
      [0, 8],
    ]),
  ]),
);
assert(pointFeatures.some((f) => f.featureClass === 'main_lake_point'), 'obvious protruding point should produce a main lake point');

const coveFeatures = runFeatureCase(
  'obvious cove',
  polygon([
    scaledRing([
      [0, 0],
      [14, 0],
      [14, 6],
      [10.5, 6],
      [8, 10],
      [7, 11],
      [6, 10],
      [3.5, 6],
      [0, 6],
    ]),
  ]),
);
assert(coveFeatures.some((f) => f.featureClass === 'cove'), 'obvious cove/pocket should produce a cove');

const islandFeatures = runFeatureCase(
  'island',
  polygon([
    scaledRing([
      [0, 0],
      [14, 0],
      [14, 10],
      [0, 10],
    ]),
    scaledRing([
      [5, 4],
      [6, 4],
      [6, 5],
      [5, 5],
    ]),
  ]),
);
assert(islandFeatures.some((f) => f.featureClass === 'island'), 'hole should produce an island');

const tinyShoreAdjacentIslandFeatures = runFeatureCase(
  'tiny shore-adjacent island',
  polygon([
    scaledRing([
      [0, 0],
      [16, 0],
      [16, 10],
      [0, 10],
    ]),
    scaledRing([
      [0.25, 4],
      [0.55, 4],
      [0.55, 4.3],
      [0.25, 4.3],
    ]),
  ]),
);
assert(!tinyShoreAdjacentIslandFeatures.some((f) => f.featureClass === 'island'), 'tiny shore-adjacent hole should be suppressed');

const meaningfulOffshoreIslandFeatures = runFeatureCase(
  'meaningful offshore island',
  polygon([
    scaledRing([
      [0, 0],
      [20, 0],
      [20, 14],
      [0, 14],
    ]),
    scaledRing([
      [8, 5],
      [10, 5],
      [10, 7],
      [8, 7],
    ]),
  ]),
);
assert(meaningfulOffshoreIslandFeatures.some((f) => f.featureClass === 'island'), 'meaningful offshore island should be retained');

const secondaryPointFeatures = runFeatureCase(
  'cove with secondary point',
  polygon([
    scaledRing([
      [0, 0],
      [16, 0],
      [16, 6],
      [10.75, 6],
      [9, 11],
      [8.2, 11],
      [8, 8],
      [7.8, 11],
      [7, 11],
      [5.25, 6],
      [0, 6],
    ]),
  ]),
);
assert(secondaryPointFeatures.some((f) => f.featureClass === 'main_lake_point'), 'strong point near cove should be retained as a main lake point');

const broadConvexArcFeatures = runFeatureCase(
  'broad convex arc',
  polygon([
    scaledRing([
      [0, 0],
      [14, 0],
      [15, 2],
      [16, 4],
      [15, 6],
      [14, 8],
      [0, 8],
    ]),
  ]),
);
assert(!broadConvexArcFeatures.some((f) => f.featureClass === 'cove'), 'broad convex shoreline arc should not produce a cove');

const neckFeatures = runFeatureCase(
  'two-lobe neck',
  polygon([
    scaledRing([
      [0, 0],
      [8, 0],
      [8, 3.4],
      [10, 3.4],
      [10, 0],
      [18, 0],
      [18, 8],
      [10, 8],
      [10, 4.6],
      [8, 4.6],
      [8, 8],
      [0, 8],
    ]),
  ]),
);
assert(neckFeatures.some((f) => f.featureClass === 'neck'), 'simple two-lobe connected polygon should produce a neck');

const saddleFeatures = runFeatureCase(
  'two-lobe saddle',
  polygon([
    scaledRing([
      [0, 0],
      [8, 0],
      [8, 2.7],
      [10, 2.7],
      [10, 0],
      [18, 0],
      [18, 8],
      [10, 8],
      [10, 5.3],
      [8, 5.3],
      [8, 8],
      [0, 8],
    ]),
  ]),
);
assert(!saddleFeatures.some((f) => f.featureClass === 'neck'), 'wider two-lobe polygon should not produce a strict neck');
assert(saddleFeatures.some((f) => f.featureClass === 'saddle'), 'wider two-lobe polygon should produce a saddle');

const higginsLikeFeatures = runFeatureCase(
  'Higgins-like two-basin connection',
  polygon([
    scaledRing([
      [0, 0],
      [12, 0],
      [12, 4.7],
      [14, 4.7],
      [14, 0],
      [26, 0],
      [26, 12],
      [14, 12],
      [14, 7.3],
      [12, 7.3],
      [12, 12],
      [0, 12],
    ]),
  ]),
);
assert(
  higginsLikeFeatures.some((f) => f.featureClass === 'neck' || f.featureClass === 'saddle'),
  'Higgins-like two-basin connection should detect neck or saddle',
);

const largeLobeFeatures = runFeatureCase(
  'large lobe basin',
  polygon([
    scaledRing([
      [0, 0],
      [12, 0],
      [18, 4],
      [20, 9],
      [18, 14],
      [12, 18],
      [0, 18],
      [-6, 14],
      [-8, 9],
      [-6, 4],
    ]),
  ]),
);
assert(!largeLobeFeatures.some((f) => f.featureClass === 'cove'), 'large lobe/basin shape should not produce a cove');

const outsideWaterCoveFeatures = runFeatureCase(
  'outside-water cove suppression',
  polygon([
    scaledRing([
      [0, 0],
      [16, 0],
      [16, 8],
      [10, 8],
      [8, 14],
      [6, 8],
      [0, 8],
    ]),
  ]),
);
const outsideWaterCovePreprocess = preprocessWaterReaderGeometry({
  state: 'MI',
  acreage: 80,
  geojson: polygon([
    scaledRing([
      [0, 0],
      [14, 0],
      [14, 8],
      [0, 8],
    ]),
  ]),
});
assert(outsideWaterCovePreprocess.primaryPolygon, 'outside-water validation fixture should preprocess');
const outsideWaterValidation = validateCoveWaterInterior({
  mouthLeft: outsideWaterCovePreprocess.primaryPolygon.exterior[0]!,
  mouthRight: outsideWaterCovePreprocess.primaryPolygon.exterior[3]!,
  back: {
    x: outsideWaterCovePreprocess.primaryPolygon.exterior[0]!.x - 300,
    y: (outsideWaterCovePreprocess.primaryPolygon.exterior[0]!.y + outsideWaterCovePreprocess.primaryPolygon.exterior[3]!.y) / 2,
  },
  waterPolygon: outsideWaterCovePreprocess.primaryPolygon,
  toleranceM: 5,
});
assert(
  !outsideWaterCoveFeatures.some((f) => f.featureClass === 'cove') && !outsideWaterValidation.valid,
  'outside-water cove body should be suppressed by fan/axis validation',
);

const naturalStraightNoDam = runFeatureCase(
  'natural straight shoreline no dam metadata',
  polygon([
    scaledRing([
      [0, 0],
      [18, 0],
      [18, 8],
      [0, 8],
    ]),
  ]),
);
assert(!naturalStraightNoDam.some((f) => f.featureClass === 'dam'), 'natural straight shoreline without dam metadata should produce no dams');

const neckCase = runFeatureCaseWithPreprocess(
  'neck segment validity',
  polygon([
    scaledRing([
      [0, 0],
      [8, 0],
      [8, 3.4],
      [10, 3.4],
      [10, 0],
      [18, 0],
      [18, 8],
      [10, 8],
      [10, 4.6],
      [8, 4.6],
      [8, 8],
      [0, 8],
    ]),
  ]),
);
const retainedNeck = neckCase.features.find((f) => f.featureClass === 'neck');
assert(retainedNeck?.featureClass === 'neck', 'neck segment validity case should retain a neck');
assert(segmentInsidePrimaryWater(retainedNeck.endpointA, retainedNeck.endpointB, neckCase.preprocess), 'neck segment samples should stay inside water');

const clustered = resolveWaterReaderFeatureConflicts({
  dams: [],
  necks: [],
  saddles: [],
  coves: [],
  points: [0, 1, 2, 3].map((i) => fakePoint({ x: 500 + i * 20, y: 500 })),
  islands: [],
  metrics: fakeMetrics(),
});
assert(clustered.length <= 2, 'feature cluster pruning should keep at most two nearby retained features');

const capped = resolveWaterReaderFeatureConflicts({
  dams: [],
  necks: [fakeWidthFeature('neck', 100, 100), fakeWidthFeature('neck', 230, 100), fakeWidthFeature('neck', 360, 100)],
  saddles: [fakeWidthFeature('saddle', 100, 250), fakeWidthFeature('saddle', 230, 250)],
  coves: [0, 1, 2, 3, 4, 5].map((i) => fakeCove({ x: 100 + i * 130, y: 500 })),
  points: [0, 1, 2, 3, 4].map((i) => fakePoint({ x: 100 + i * 130, y: 700 })),
  islands: [],
  metrics: fakeMetrics(),
});
assert(capped.length <= 8, 'total retained feature cap should be enforced');
assert(capped.filter((f) => f.featureClass === 'cove').length <= 4, 'cove class cap should be enforced');
assert(capped.filter((f) => f.featureClass === 'neck').length <= 2, 'neck class cap should be enforced');
assert(capped.filter((f) => f.featureClass === 'saddle').length <= 1, 'saddle class cap should be enforced');

const counts = {
  rectangle: rectangle.length,
  mainLakePoints: pointFeatures.filter((f) => f.featureClass === 'main_lake_point').length,
  coves: coveFeatures.filter((f) => f.featureClass === 'cove').length,
  islands: islandFeatures.filter((f) => f.featureClass === 'island').length,
  tinyShoreAdjacentIslands: tinyShoreAdjacentIslandFeatures.filter((f) => f.featureClass === 'island').length,
  offshoreIslands: meaningfulOffshoreIslandFeatures.filter((f) => f.featureClass === 'island').length,
  nearbyCoveMainLakePoints: secondaryPointFeatures.filter((f) => f.featureClass === 'main_lake_point').length,
  necks: neckFeatures.filter((f) => f.featureClass === 'neck').length,
  saddles: saddleFeatures.filter((f) => f.featureClass === 'saddle').length,
  higginsLikeConstrictions: higginsLikeFeatures.filter((f) => f.featureClass === 'neck' || f.featureClass === 'saddle').length,
  largeLobeCoves: largeLobeFeatures.filter((f) => f.featureClass === 'cove').length,
  outsideWaterCoves: outsideWaterCoveFeatures.filter((f) => f.featureClass === 'cove').length,
  clusterPruned: clustered.length,
  cappedTotal: capped.length,
  damsWithoutMetadata: naturalStraightNoDam.filter((f) => f.featureClass === 'dam').length,
};

console.log(JSON.stringify({ ok: true, cases: 17, counts }));

function fakeMetrics(): WaterReaderLakeMetrics {
  return {
    areaSqM: 1_000_000,
    perimeterM: 5000,
    longestDimensionM: 1000,
    averageLakeWidthM: 1000,
    bboxM: { minX: 0, minY: 0, maxX: 1000, maxY: 1000 },
    componentCount: 1,
    holeCount: 0,
  };
}

function fakePoint(tip: PointM) {
  return {
    tip,
    leftSlope: { x: tip.x - 10, y: tip.y + 10 },
    rightSlope: { x: tip.x + 10, y: tip.y + 10 },
    baseMidpoint: { x: tip.x, y: tip.y + 10 },
    orientationVector: { x: 0, y: -1 },
    protrusionLengthM: 50,
    turnAngleRad: 1.2,
    confidence: 0.8,
    score: 100,
    qaFlags: [],
    metrics: {},
  };
}

function fakeCove(back: PointM) {
  const mouthLeft = { x: back.x - 20, y: back.y - 40 };
  const mouthRight = { x: back.x + 20, y: back.y - 40 };
  const coveBoundary = [mouthLeft, back, mouthRight, mouthLeft];
  return {
    featureClass: 'cove' as const,
    mouthLeft,
    mouthRight,
    mouthWidthM: 40,
    back,
    shorePath: [mouthLeft, back, mouthRight],
    coveBoundary,
    shorePathLengthM: 100,
    pathRatio: 2.5,
    coveDepthM: 60,
    depthRatio: 1.5,
    coveAreaSqM: 1000,
    leftIrregularity: 0.5,
    rightIrregularity: 0.5,
    covePolygon: coveBoundary,
    score: 100,
    qaFlags: [],
    metrics: {},
  };
}

function fakeWidthFeature(featureClass: 'neck' | 'saddle', x: number, y: number) {
  return {
    featureClass,
    endpointA: { x: x - 20, y },
    endpointB: { x: x + 20, y },
    center: { x, y },
    widthM: 40,
    leftExpansionRatio: 3,
    rightExpansionRatio: 3,
    confidence: 0.8,
    score: 100,
    qaFlags: [],
    metrics: {},
  };
}

function segmentInsidePrimaryWater(a: PointM, b: PointM, preprocess: WaterReaderPreprocessResult): boolean {
  const polygon = preprocess.primaryPolygon;
  if (!polygon) return false;
  for (let i = 1; i < 8; i++) {
    const t = i / 8;
    const point = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    if (!pointInRingLocal(point, polygon.exterior)) return false;
    if (polygon.holes.some((hole) => pointInRingLocal(point, hole))) return false;
  }
  return true;
}

function pointInRingLocal(point: PointM, ring: PointM[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i]!;
    const b = ring[j]!;
    const crosses = (a.y > point.y) !== (b.y > point.y);
    if (!crosses) continue;
    const xAtY = ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y || 1e-12) + a.x;
    if (point.x < xAtY) inside = !inside;
  }
  return inside;
}
