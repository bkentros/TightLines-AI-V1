import { spawnSync } from 'node:child_process';
import * as LibEngine from '../lib/water-reader-engine';
import {
  buildWaterReaderDisplayModel,
  buildWaterReaderLegend,
  buildWaterReaderProductionSvg,
  placeWaterReaderZones,
  preprocessWaterReaderGeometry,
  type PointM,
  type PolygonM,
  type WaterReaderCoveFeature,
  type WaterReaderDamFeature,
  type WaterReaderDetectedFeature,
  type WaterReaderIslandFeature,
  type WaterReaderNeckFeature,
  type WaterReaderPlacedZone,
  type WaterReaderPointFeature,
  type WaterReaderPolygonGeoJson,
  type WaterReaderPreprocessResult,
  type WaterReaderSaddleFeature,
} from '../supabase/functions/_shared/waterReaderEngine/index.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const SEASON_CASES = [
  { label: 'spring', date: new Date(Date.UTC(2026, 4, 1)) },
  { label: 'summer', date: new Date(Date.UTC(2026, 6, 15)) },
  { label: 'fall', date: new Date(Date.UTC(2026, 9, 1)) },
  { label: 'winter', date: new Date(Date.UTC(2026, 0, 15)) },
] as const;

const STRUCTURE_KIND_BY_CLASS = {
  main_lake_point: 'main_point_structure_area',
  secondary_point: 'secondary_point_structure_area',
  cove: 'cove_structure_area',
  neck: 'neck_structure_area',
  saddle: 'saddle_structure_area',
  island: 'island_structure_area',
  dam: 'dam_structure_area',
} as const;

const LEGACY_VISIBLE_PLACEMENT_KINDS = new Set([
  'main_point_side',
  'main_point_tip',
  'main_point_open_water',
  'cove_back',
  'cove_mouth',
  'cove_irregular_side',
  'secondary_point_back',
  'secondary_point_mouth',
  'island_mainland',
  'island_open_water',
  'island_endpoint',
  'dam_corner',
  'neck_shoulder',
  'saddle_shoulder',
]);

assertNoActiveV1EngineVersion();

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

function fixturePolygon(): { geojson: WaterReaderPolygonGeoJson; polygonM: PolygonM; preprocess: WaterReaderPreprocessResult } {
  const geojson = polygon([
    scaledRing([
      [0, 0],
      [14, 0],
      [14, 8],
      [0, 8],
    ]),
  ]);
  const preprocess = preprocessWaterReaderGeometry({ state: 'MI', acreage: 80, currentDate: SEASON_CASES[0].date, geojson });
  assert(preprocess.primaryPolygon, 'fixture polygon should preprocess');
  return { geojson, polygonM: preprocess.primaryPolygon, preprocess };
}

function islandFixture(): { geojson: WaterReaderPolygonGeoJson; preprocess: WaterReaderPreprocessResult; island: WaterReaderIslandFeature } {
  const geojson = polygon([
    scaledRing([
      [0, 0],
      [18, 0],
      [18, 12],
      [0, 12],
    ]),
    scaledRing([
      [8, 5],
      [10, 5],
      [10, 7],
      [8, 7],
    ]),
  ]);
  const preprocess = preprocessWaterReaderGeometry({ state: 'MI', acreage: 140, currentDate: SEASON_CASES[0].date, geojson });
  const ring = preprocess.primaryPolygon?.holes[0];
  assert(ring, 'island fixture should preprocess with a hole');
  return {
    geojson,
    preprocess,
    island: {
      featureId: 'island-1',
      featureClass: 'island',
      score: 100,
      qaFlags: [],
      metrics: {},
      ring,
      areaSqM: 40000,
      endpointA: midpoint(ring[0]!, ring[1]!),
      endpointB: midpoint(ring[2]!, ring[3]!),
      nearestMainlandDistanceM: 300,
    },
  };
}

const fixture = fixturePolygon();
const bottomMid = midpoint(fixture.polygonM.exterior[0]!, fixture.polygonM.exterior[1]!);
const rightMid = midpoint(fixture.polygonM.exterior[1]!, fixture.polygonM.exterior[2]!);
const topMid = midpoint(fixture.polygonM.exterior[2]!, fixture.polygonM.exterior[3]!);
const topLeftShoulder = lerp(fixture.polygonM.exterior[3]!, fixture.polygonM.exterior[2]!, 0.35);
const topRightShoulder = lerp(fixture.polygonM.exterior[3]!, fixture.polygonM.exterior[2]!, 0.65);
const island = islandFixture();

const cove = fakeCove('cove-1', topLeftShoulder, topRightShoulder, topMid);
const secondaryPoint: WaterReaderPointFeature = {
  ...fakePoint('secondary-1', topMid, topLeftShoulder, topRightShoulder),
  featureClass: 'secondary_point',
  parentCoveId: cove.featureId,
};

const CASES: Array<{
  label: string;
  preprocess: WaterReaderPreprocessResult;
  geojson: WaterReaderPolygonGeoJson;
  features: WaterReaderDetectedFeature[];
  expectedFeatureId: string;
  expectedFeatureClass: keyof typeof STRUCTURE_KIND_BY_CLASS;
}> = [
  {
    label: 'main point',
    preprocess: fixture.preprocess,
    geojson: fixture.geojson,
    features: [fakePoint('point-1', topMid, topLeftShoulder, topRightShoulder)],
    expectedFeatureId: 'point-1',
    expectedFeatureClass: 'main_lake_point',
  },
  {
    label: 'secondary point',
    preprocess: fixture.preprocess,
    geojson: fixture.geojson,
    features: [cove, secondaryPoint],
    expectedFeatureId: 'secondary-1',
    expectedFeatureClass: 'secondary_point',
  },
  {
    label: 'cove',
    preprocess: fixture.preprocess,
    geojson: fixture.geojson,
    features: [cove],
    expectedFeatureId: 'cove-1',
    expectedFeatureClass: 'cove',
  },
  {
    label: 'neck',
    preprocess: fixture.preprocess,
    geojson: fixture.geojson,
    features: [fakeNeck('neck-1', lerp(topLeftShoulder, topRightShoulder, 0.33), lerp(topLeftShoulder, topRightShoulder, 0.67))],
    expectedFeatureId: 'neck-1',
    expectedFeatureClass: 'neck',
  },
  {
    label: 'saddle',
    preprocess: fixture.preprocess,
    geojson: fixture.geojson,
    features: [fakeSaddle('saddle-1', lerp(topLeftShoulder, topRightShoulder, 0.4), lerp(topLeftShoulder, topRightShoulder, 0.6))],
    expectedFeatureId: 'saddle-1',
    expectedFeatureClass: 'saddle',
  },
  {
    label: 'island',
    preprocess: island.preprocess,
    geojson: island.geojson,
    features: [island.island],
    expectedFeatureId: 'island-1',
    expectedFeatureClass: 'island',
  },
  {
    label: 'dam',
    preprocess: fixture.preprocess,
    geojson: fixture.geojson,
    features: [fakeDam('dam-1', fixture.polygonM.exterior[0]!, fixture.polygonM.exterior[1]!)],
    expectedFeatureId: 'dam-1',
    expectedFeatureClass: 'dam',
  },
];

for (const testCase of CASES) {
  let baselineSignature: string | null = null;
  let libBaselineSignature: string | null = null;
  for (const seasonCase of SEASON_CASES) {
    const result = placeWaterReaderZones(
      testCase.preprocess,
      testCase.features,
      { state: 'MI', acreage: 80, currentDate: seasonCase.date, geojson: testCase.geojson },
      { allowUniversalFallback: false },
    );
    assert(result.diagnostics.universalFallbackAllowed === false, `${testCase.label} normal reads should not allow universal fallback`);
    assert(result.diagnostics.universalFallbackApplied === false, `${testCase.label} normal reads should not apply universal fallback`);

    const realZones = result.zones.filter((zone) => zone.featureClass !== 'universal');
    const legacyKinds = realZones.filter((zone) => LEGACY_VISIBLE_PLACEMENT_KINDS.has(zone.placementKind));
    assert(
      legacyKinds.length === 0,
      `${testCase.label} ${seasonCase.label} should not produce legacy visible placement kinds: ${legacyKinds.map((zone) => zone.placementKind).join(', ')}`,
    );

    const expectedZones = realZones.filter((zone) => zone.sourceFeatureId === testCase.expectedFeatureId);
    assert(
      expectedZones.length === 1,
      `${testCase.label} ${seasonCase.label} should produce one selected feature-envelope zone: zones=${JSON.stringify(result.zones.map((zone) => ({ featureClass: zone.featureClass, sourceFeatureId: zone.sourceFeatureId, placementKind: zone.placementKind })))} coverage=${JSON.stringify(result.diagnostics.featureCoverage)} rejected=${JSON.stringify(result.diagnostics.rejectedByReason)} dropped=${JSON.stringify(result.diagnostics.droppedByReason)}`,
    );
    const expectedKind = STRUCTURE_KIND_BY_CLASS[testCase.expectedFeatureClass];
    assert(
      expectedZones[0]!.placementKind === expectedKind,
      `${testCase.label} ${seasonCase.label} should use ${expectedKind}, got ${expectedZones[0]!.placementKind}`,
    );
    assert(expectedZones[0]!.diagnostics.featureEnvelopeSeasonInvariant === true, `${testCase.label} should mark geometry season-invariant`);
    assert(expectedZones[0]!.diagnostics.seasonalEmphasisOnly === true, `${testCase.label} should keep season as legend/emphasis only`);

    const signature = placementSignature(expectedZones);
    if (baselineSignature == null) baselineSignature = signature;
    assert(signature === baselineSignature, `${testCase.label} placement signature changed in ${seasonCase.label}`);

    const libPreprocess = LibEngine.preprocessWaterReaderGeometry({ state: 'MI', acreage: 80, currentDate: seasonCase.date, geojson: testCase.geojson });
    const libResult = LibEngine.placeWaterReaderZones(
      libPreprocess,
      testCase.features as any,
      { state: 'MI', acreage: 80, currentDate: seasonCase.date, geojson: testCase.geojson },
      { allowUniversalFallback: false },
    );
    const libExpectedZones = libResult.zones
      .filter((zone) => zone.featureClass !== 'universal')
      .filter((zone) => zone.sourceFeatureId === testCase.expectedFeatureId);
    assert(libExpectedZones.length === 1, `lib ${testCase.label} ${seasonCase.label} should produce one feature-envelope zone`);
    const libLegacyKinds = libResult.zones
      .filter((zone) => zone.featureClass !== 'universal')
      .filter((zone) => LEGACY_VISIBLE_PLACEMENT_KINDS.has(zone.placementKind));
    assert(libLegacyKinds.length === 0, `lib ${testCase.label} ${seasonCase.label} should not produce legacy visible placement kinds`);
    const libSignature = placementSignature(libExpectedZones as any);
    if (libBaselineSignature == null) libBaselineSignature = libSignature;
    assert(libSignature === libBaselineSignature, `lib ${testCase.label} placement signature changed in ${seasonCase.label}`);
    assert(libSignature === signature, `${testCase.label} placement signature diverged between lib and production/shared in ${seasonCase.label}`);

    if (seasonCase.label === 'spring') {
      assertProductionSvgContract(result, testCase.preprocess, testCase.geojson, `${testCase.label} production/shared`);
      assertProductionSvgContract(libResult as any, libPreprocess as any, testCase.geojson, `${testCase.label} lib`, true);
    }
  }
}

const noFallbackResult = placeWaterReaderZones(
  fixture.preprocess,
  [],
  { state: 'MI', acreage: 80, currentDate: SEASON_CASES[0].date, geojson: fixture.geojson },
  { allowUniversalFallback: false },
);
assert(noFallbackResult.zones.length === 0, 'normal empty-feature reads should not synthesize universal fallback zones');
assert(noFallbackResult.diagnostics.universalFallbackAllowed === false, 'normal empty-feature reads should report fallback disabled');

const explicitFallbackResult = placeWaterReaderZones(
  fixture.preprocess,
  [],
  { state: 'MI', acreage: 80, currentDate: SEASON_CASES[0].date, geojson: fixture.geojson },
  { allowUniversalFallback: true },
);
assert(explicitFallbackResult.diagnostics.universalFallbackAllowed === true, 'explicit fallback reads should report fallback allowed');
assert(explicitFallbackResult.zones.every((zone) => zone.featureClass === 'universal'), 'explicit fallback zones should stay separate from real feature zones');

const tallGeojson = polygon([
  scaledRing([
    [0, 0],
    [2, 0],
    [2, 28],
    [0, 28],
  ]),
]);
const tallPreprocess = preprocessWaterReaderGeometry({ state: 'MI', acreage: 80, currentDate: SEASON_CASES[0].date, geojson: tallGeojson });
const tallResult = placeWaterReaderZones(
  tallPreprocess,
  [],
  { state: 'MI', acreage: 80, currentDate: SEASON_CASES[0].date, geojson: tallGeojson },
  { allowUniversalFallback: false },
);
const tallLegend = buildWaterReaderLegend(tallResult, { state: 'MI', currentDate: SEASON_CASES[0].date });
const tallDisplay = buildWaterReaderDisplayModel(tallResult, tallLegend, {
  acreage: 80,
  longestDimensionM: tallPreprocess.metrics?.longestDimensionM,
  lakePolygon: tallPreprocess.primaryPolygon,
});
const tallSvg = buildWaterReaderProductionSvg(tallDisplay, {
  lakePolygon: tallPreprocess.primaryPolygon,
  title: 'Tall Fixture',
  subtitle: 'Structure areas | spring legend guidance | polygon geometry',
  mapWidth: 420,
});
assert(tallSvg.summary.mapBottomY <= 620, `app-width tall fixture map should stay height-capped, got mapBottomY=${tallSvg.summary.mapBottomY}`);
assert(tallSvg.summary.height < 900, `app-width tall fixture SVG should stay below 900px, got ${tallSvg.summary.height}`);

console.log('water-reader-production-feature-envelope-smoke: ok');

function assertProductionSvgContract(
  zoneResult: ReturnType<typeof placeWaterReaderZones>,
  preprocess: WaterReaderPreprocessResult,
  geojson: WaterReaderPolygonGeoJson,
  label: string,
  useLib = false,
): void {
  const legend = useLib
    ? LibEngine.buildWaterReaderLegend(zoneResult as any, { state: 'MI', currentDate: SEASON_CASES[0].date })
    : buildWaterReaderLegend(zoneResult, { state: 'MI', currentDate: SEASON_CASES[0].date });
  const display = useLib
    ? LibEngine.buildWaterReaderDisplayModel(zoneResult as any, legend as any, {
      acreage: 80,
      longestDimensionM: preprocess.metrics?.longestDimensionM,
      lakePolygon: preprocess.primaryPolygon,
    })
    : buildWaterReaderDisplayModel(zoneResult, legend, {
      acreage: 80,
      longestDimensionM: preprocess.metrics?.longestDimensionM,
      lakePolygon: preprocess.primaryPolygon,
    });
  const svgResult = useLib
    ? LibEngine.buildWaterReaderProductionSvg(display as any, {
      lakePolygon: preprocess.primaryPolygon as any,
      title: label,
      subtitle: 'Structure areas | spring legend guidance | polygon geometry',
      mapWidth: 420,
    })
    : buildWaterReaderProductionSvg(display, {
      lakePolygon: preprocess.primaryPolygon,
      title: label,
      subtitle: 'Structure areas | spring legend guidance | polygon geometry',
      mapWidth: 420,
    });
  assert(Array.isArray(svgResult.legendEntries), `${label} productionSvgResult.legendEntries should exist`);
  assert(
    svgResult.legendEntries.length === display.displayLegendEntries.length,
    `${label} productionSvgResult.legendEntries should match displayed legend count`,
  );
}

function assertNoActiveV1EngineVersion(): void {
  const oldEngineVersionNeedle = ['water-reader-engine', 'v1'].join('-');
  const result = spawnSync('rg', [
    oldEngineVersionNeedle,
    '.',
    '--glob', '!node_modules/**',
    '--glob', '!tmp/**',
    '--glob', '!docs/**',
    '--glob', '!*.md',
  ], { encoding: 'utf8' });
  assert(result.status === 1, `active source files should not contain ${oldEngineVersionNeedle}: ${result.stdout}${result.stderr}`);
}

function placementSignature(zones: WaterReaderPlacedZone[]): string {
  return JSON.stringify(zones.map((zone) => ({
    sourceFeatureId: zone.sourceFeatureId,
    featureClass: zone.featureClass,
    placementKind: zone.placementKind,
    placementSemanticId: zone.placementSemanticId,
    anchorSemanticId: zone.anchorSemanticId,
    anchor: roundedPoint(zone.anchor),
    ovalCenter: roundedPoint(zone.ovalCenter),
    majorAxisM: rounded(zone.majorAxisM),
    minorAxisM: rounded(zone.minorAxisM),
    rotationRad: rounded(zone.rotationRad),
    visibleWaterRing: zone.visibleWaterRing.map(roundedPoint),
  })));
}

function fakeNeck(featureId: string, endpointA: PointM, endpointB: PointM): WaterReaderNeckFeature {
  return {
    featureId,
    featureClass: 'neck',
    endpointA,
    endpointB,
    center: midpoint(endpointA, endpointB),
    widthM: distance(endpointA, endpointB),
    leftExpansionRatio: 2.5,
    rightExpansionRatio: 2.5,
    confidence: 0.8,
    score: 100,
    qaFlags: [],
    metrics: {},
  };
}

function fakeSaddle(featureId: string, endpointA: PointM, endpointB: PointM): WaterReaderSaddleFeature {
  return {
    featureId,
    featureClass: 'saddle',
    endpointA,
    endpointB,
    center: midpoint(endpointA, endpointB),
    widthM: distance(endpointA, endpointB),
    leftExpansionRatio: 1.8,
    rightExpansionRatio: 1.8,
    confidence: 0.75,
    score: 90,
    qaFlags: [],
    metrics: {},
  };
}

function fakePoint(featureId: string, tip: PointM, leftSlope: PointM, rightSlope: PointM): WaterReaderPointFeature {
  return {
    featureId,
    featureClass: 'main_lake_point',
    tip,
    leftSlope,
    rightSlope,
    baseMidpoint: midpoint(leftSlope, rightSlope),
    orientationVector: { x: 0, y: -1 },
    protrusionLengthM: distance(tip, midpoint(leftSlope, rightSlope)),
    turnAngleRad: 1,
    confidence: 0.8,
    score: 100,
    qaFlags: [],
    metrics: {},
  };
}

function fakeCove(featureId: string, mouthLeft: PointM, mouthRight: PointM, back: PointM): WaterReaderCoveFeature {
  return {
    featureId,
    featureClass: 'cove',
    mouthLeft,
    mouthRight,
    mouthWidthM: distance(mouthLeft, mouthRight),
    back,
    shorePath: [mouthLeft, back, mouthRight],
    coveBoundary: [mouthLeft, back, mouthRight, mouthLeft],
    shorePathLengthM: distance(mouthLeft, back) + distance(back, mouthRight),
    pathRatio: 2,
    coveDepthM: distance(back, midpoint(mouthLeft, mouthRight)),
    depthRatio: 1,
    coveAreaSqM: 1000,
    leftIrregularity: 0.6,
    rightIrregularity: 0.5,
    covePolygon: [mouthLeft, back, mouthRight, mouthLeft],
    score: 100,
    qaFlags: [],
    metrics: {},
  };
}

function fakeDam(featureId: string, cornerA: PointM, cornerB: PointM): WaterReaderDamFeature {
  return {
    featureId,
    featureClass: 'dam',
    cornerA,
    cornerB,
    segmentLengthM: distance(cornerA, cornerB),
    rSquared: 0.99,
    confidence: 0.9,
    score: 120,
    qaFlags: [],
    metrics: {},
  };
}

function midpoint(a: PointM, b: PointM): PointM {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function lerp(a: PointM, b: PointM, t: number): PointM {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function distance(a: PointM, b: PointM): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function rounded(value: number): number {
  return Math.round(value * 1000) / 1000;
}

function roundedPoint(point: PointM): PointM {
  return { x: rounded(point.x), y: rounded(point.y) };
}
