import {
  materializeZoneDraft,
  placeWaterReaderZones,
  preprocessWaterReaderGeometry,
  type PointM,
  type PolygonM,
  type WaterReaderCoveFeature,
  type WaterReaderDetectedFeature,
  type WaterReaderNeckFeature,
  type WaterReaderPointFeature,
  type WaterReaderPolygonGeoJson,
  type WaterReaderSaddleFeature,
  type WaterReaderZoneDraft,
} from '../lib/water-reader-engine';
import { spawnSync } from 'child_process';

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

function fixturePolygon(): { geojson: WaterReaderPolygonGeoJson; polygonM: PolygonM; longestDimensionM: number } {
  const geojson = polygon([
    scaledRing([
      [0, 0],
      [14, 0],
      [14, 8],
      [0, 8],
    ]),
  ]);
  const preprocess = preprocessWaterReaderGeometry({ state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson });
  assert(preprocess.primaryPolygon && preprocess.metrics, 'fixture should preprocess');
  return { geojson, polygonM: preprocess.primaryPolygon, longestDimensionM: preprocess.metrics.longestDimensionM };
}

const fixture = fixturePolygon();
const bottomMid = midpoint(fixture.polygonM.exterior[0]!, fixture.polygonM.exterior[1]!);
const rightMid = midpoint(fixture.polygonM.exterior[1]!, fixture.polygonM.exterior[2]!);
const topMid = midpoint(fixture.polygonM.exterior[2]!, fixture.polygonM.exterior[3]!);
const topLeftShoulder = lerp(fixture.polygonM.exterior[3]!, fixture.polygonM.exterior[2]!, 0.35);
const topRightShoulder = lerp(fixture.polygonM.exterior[3]!, fixture.polygonM.exterior[2]!, 0.65);
const seasonCases = [
  { season: 'spring', date: new Date(Date.UTC(2026, 4, 1)) },
  { season: 'summer', date: new Date(Date.UTC(2026, 6, 15)) },
  { season: 'fall', date: new Date(Date.UTC(2026, 9, 1)) },
  { season: 'winter', date: new Date(Date.UTC(2026, 0, 15)) },
] as const;

const neck = fakeNeck('neck-1', bottomMid, topMid);
const neckResult = placeWaterReaderZones(
  { supportStatus: 'supported', supportReason: 'fixture', qaFlags: [], primaryPolygon: fixture.polygonM, metrics: {
    areaSqM: 1,
    perimeterM: 1,
    longestDimensionM: fixture.longestDimensionM,
    averageLakeWidthM: 1,
    bboxM: { minX: 0, minY: 0, maxX: 1, maxY: 1 },
    componentCount: 1,
    holeCount: 0,
  } },
  [neck],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
);
const neckZones = neckResult.zones;
assert(neckZones.filter((zone) => zone.featureClass === 'neck').length === 2, 'neck should create exactly two shoreline-shoulder zones');
assert(neckZones.every((zone) => zone.placementKind === 'neck_shoulder'), 'neck should not create a center-throat zone');
assert(neckResult.diagnostics.unitDiagnostics.length > 0, 'zone placement should expose per-unit diagnostics');
assert(
  neckResult.diagnostics.unitDiagnostics.some((unit) => unit.featureId === 'neck-1' && unit.draftCount > 0 && unit.materializedCandidateCount > 0 && unit.validCandidateCount > 0),
  'per-unit diagnostics should include draft/materialized/valid counters',
);
assert(
  neckZones.every((zone) => Number(zone.diagnostics.candidateCount) >= 40),
  'neck placement should evaluate adaptive offset/size candidates',
);
assert(
  neckZones.some((zone) => rejectedCandidateReasons(zone).zone_visible_fraction_too_high > 0),
  'neck placement should recover when initial larger/inset candidates are too water-heavy',
);

for (const seasonCase of seasonCases) {
  const seasonalNeckZones = placeWaterReaderZones(
    preprocessShell(fixture),
    [neck],
    { state: 'MI', acreage: 80, currentDate: seasonCase.date, geojson: fixture.geojson },
  ).zones;
  assert(
    seasonalNeckZones.filter((zone) => zone.featureClass === 'neck').length === 2,
    `neck should create two shoulder zones in ${seasonCase.season}`,
  );

  const seasonalSaddleZones = placeWaterReaderZones(
    preprocessShell(fixture),
    [fakeSaddle('saddle-1', bottomMid, topMid)],
    { state: 'MI', acreage: 80, currentDate: seasonCase.date, geojson: fixture.geojson },
  ).zones;
  assert(
    seasonalSaddleZones.filter((zone) => zone.featureClass === 'saddle').length === 2,
    `saddle should create two shoulder zones in ${seasonCase.season}`,
  );
}

const pointZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [fakePoint('point-1', topMid, topLeftShoulder, topRightShoulder)],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
).zones;
const pointZone = pointZones.find((zone) => zone.featureClass === 'main_lake_point');
assert(pointZone, 'point feature should create a zone');
assert(pointZone.visibleWaterFraction <= 0.75, 'point zone visible fraction should be <= 0.75');
assert(pointZone.visibleWaterRing.length > 0, 'point zone should touch visible water');

const farBackPoint = fakePoint('far-point', topMid, fixture.polygonM.exterior[3]!, fixture.polygonM.exterior[2]!);
const farBackSpringZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assert(farBackSpringZones.length === 2, 'spring point should create two side zones');
assert(
  farBackSpringZones.every((zone) => Number(zone.diagnostics.pointSideFractionFromTip) >= 0.35 && Number(zone.diagnostics.pointSideFractionFromTip) <= 0.55),
  'spring/fall point side anchors should use interpolated tip-side anchors',
);
assert(
  farBackSpringZones.every((zone) => Number(zone.diagnostics.distanceFromTipM) < distance(topMid, fixture.polygonM.exterior[3]!)),
  'spring/fall point side anchors should be closer to tip than raw far-back slopes',
);

const farBackFallZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 9, 1)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assert(farBackFallZones.length === 2, 'fall point should create two side zones');

const farBackSummerZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 6, 15)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assert(farBackSummerZones.some((zone) => zone.placementKind === 'main_point_tip'), 'summer point should create a tip zone');
assert(farBackSummerZones.some((zone) => zone.placementKind === 'main_point_open_water'), 'summer point should create an open-water-side zone');
const summerTipZone = farBackSummerZones.find((zone) => zone.placementKind === 'main_point_tip');
assert(
  summerTipZone?.diagnostics.pointTipPlacementMode === 'tip_centered' || summerTipZone?.diagnostics.pointTipPlacementMode === 'tip_near',
  'summer point-tip should select a tip-centered or tip-near oval when valid',
);
assert(
  farBackSummerZones.every((zone) => Number(zone.diagnostics.distanceFromTipM) <= distance(topMid, fixture.polygonM.exterior[3]!)),
  'summer point zones should remain point-adjacent',
);

const farBackWinterZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assert(farBackWinterZones.length === 1, `winter point should create one open-water-side zone, got ${farBackWinterZones.length}`);
assert(farBackWinterZones[0]?.placementKind === 'main_point_open_water', 'winter point should use open-water-side placement');

const tightPoint = fakePoint(
  'tight-point',
  topMid,
  lerp(topMid, fixture.polygonM.exterior[3]!, 0.18),
  lerp(topMid, fixture.polygonM.exterior[2]!, 0.18),
);
const tightPointSummer = placeWaterReaderZones(
  preprocessShell(fixture),
  [tightPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 6, 15)), geojson: fixture.geojson },
);
assert(coverageReason(tightPointSummer, 'tight-point') === 'zoned', 'main point should not disappear when a valid one-zone fallback exists');
assert(tightPointSummer.zones.filter((zone) => zone.sourceFeatureId === 'tight-point').length >= 1, 'one-zone point fallback should keep a visible point zone');

const overlappedPointResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [neck, farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
);
const pointCoverageReason = coverageReason(overlappedPointResult, 'far-point');
assert(
  !pointCoverageReason || pointCoverageReason === 'zoned' || pointCoverageReason.startsWith('dropped_') || pointCoverageReason.startsWith('rejected_invariant:') || pointCoverageReason === 'feature_unit_not_selected',
  'retained point without zones should carry explicit coverage diagnostics',
);
assert(
  overlappedPointResult.diagnostics.selectedFeatureCount + overlappedPointResult.diagnostics.suppressedFeatureCount === overlappedPointResult.diagnostics.detectedFeatureCount,
  'selected and suppressed feature counts should reconcile to detected candidate features',
);
assert(
  overlappedPointResult.diagnostics.featureCoverage.every((coverage) => !coverage.producedVisibleZones || coverage.zoneCount > 0),
  'user-facing selected features should all have visible zones',
);
assertZoneSelectionInvariant(overlappedPointResult);

const coveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [fakeCove('cove-1', topLeftShoulder, topRightShoulder, topMid)],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
);
const coveZones = coveResult.zones;
const coveZone = coveZones.find((zone) => zone.featureClass === 'cove');
assert(coveZone, 'cove feature should create a zone');
assert(coveZone.visibleWaterFraction <= 0.75, 'cove zone visible fraction should be <= 0.75');
assert(coveZone.visibleWaterRing.length > 0, 'cove zone should touch visible water');
assert(Number(coveZone.diagnostics.candidateCount) >= 30, 'cove placement should evaluate adaptive offset/size candidates');
assert(
  coveResult.diagnostics.unitDiagnostics.some((unit) => unit.featureId === 'cove-1' && unit.materializedCandidateCount <= unit.draftCount),
  'zone placement should expose materialized candidate counters without requiring every draft to be evaluated',
);

const seasonalCove: WaterReaderCoveFeature = {
  ...fakeCove('cove-seasonal', topLeftShoulder, topRightShoulder, topMid),
  rightIrregularity: 0.05,
};
const springCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
);
assert(springCoveResult.zones.some((zone) => zone.placementKind === 'cove_back'), 'spring cove should zone the back of cove');
const summerCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 6, 15)), geojson: fixture.geojson },
);
assert(summerCoveResult.zones.some((zone) => zone.placementKind === 'cove_mouth'), 'summer cove should zone the mouth shoulder');
const fallCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 9, 1)), geojson: fixture.geojson },
);
assert(fallCoveResult.zones.some((zone) => zone.placementKind === 'cove_irregular_side'), 'fall cove should zone the irregular side');
const winterCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
);
assert(winterCoveResult.zones.some((zone) => zone.placementKind === 'cove_mouth'), 'winter cove should use a conservative cove-mouth transition zone');
assert(coverageReason(winterCoveResult, 'cove-seasonal') === 'zoned', 'winter cove coverage should report zoned when a valid transition zone exists');

const winterSecondary: WaterReaderPointFeature = {
  ...fakePoint('secondary-1', topMid, topLeftShoulder, topRightShoulder),
  featureClass: 'secondary_point',
  parentCoveId: 'cove-seasonal',
};
const winterSecondaryResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove, winterSecondary],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
);
assert(
  coverageReason(winterSecondaryResult, 'secondary-1') === 'parent_cove_not_zoned' ||
    coverageReason(winterSecondaryResult, 'secondary-1') === 'zoned',
  'winter secondary point should zone when its parent cove zones, otherwise report parent_cove_not_zoned',
);
assertZoneSelectionInvariant(winterSecondaryResult);

const openWaterDraft: WaterReaderZoneDraft = {
  unitId: 'open-water',
  unitPriority: 1,
  unitScore: 1,
  sourceFeatureId: 'open-water',
  featureClass: 'main_lake_point',
  placementKind: 'main_point_tip',
  anchor: midpoint(bottomMid, topMid),
  ovalCenter: midpoint(bottomMid, topMid),
  majorAxisM: fixture.longestDimensionM * 0.08,
  minorAxisM: (fixture.longestDimensionM * 0.08) / 1.6,
  rotationRad: 0,
  diagnostics: {},
  qaFlags: [],
};
assert(
  !materializeZoneDraft({ draft: openWaterDraft, polygon: fixture.polygonM, longestDimensionM: fixture.longestDimensionM }).ok,
  'open-water oval should be rejected',
);

const overlapZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [fakeCove('cove-2', bottomMid, rightMid, bottomMid), neck],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
).zones;
assert(overlapZones.some((zone) => zone.featureClass === 'neck'), 'higher-priority neck zone should be retained');
assert(overlapZones.some((zone) => zone.sourceFeatureId === 'cove-2'), 'overlapping valid cove structure should be retained instead of hidden');
assert(
  [0, 2].includes(overlapZones.filter((zone) => zone.sourceFeatureId === 'neck-1').length),
  'neck feature should return exactly two valid zones or none, never one',
);
assert(
  overlapZones.some((zone) => zone.diagnostics.structureConfluenceGroupId),
  'overlapping valid structures should be diagnosed as a structure confluence',
);

const crowdedFallResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [
    fakePoint('crowded-point', topMid, fixture.polygonM.exterior[3]!, fixture.polygonM.exterior[2]!),
    fakeCove('crowded-cove', topLeftShoulder, topRightShoulder, topMid),
  ],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 9, 1)), geojson: fixture.geojson },
);
assert(
  crowdedFallResult.diagnostics.selectedFeatureCount + crowdedFallResult.diagnostics.suppressedFeatureCount === crowdedFallResult.diagnostics.detectedFeatureCount,
  'crowded valid structures should remain reconciled through coverage diagnostics',
);
assertZoneSelectionInvariant(crowdedFallResult);

const tightNeckZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [fakeNeck('tight-neck', topLeftShoulder, lerp(topLeftShoulder, topRightShoulder, 0.1))],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
).zones.filter((zone) => zone.sourceFeatureId === 'tight-neck');
assert([0, 2].includes(tightNeckZones.length), 'paired neck recovery should keep exactly two shoulders or suppress the pair');
if (tightNeckZones.length === 2) {
  assert(
    tightNeckZones.every((zone) => zone.diagnostics.structureConfluenceGroupId || zone.diagnostics.pairOverlapClassification),
    'paired neck zones should expose pair overlap or confluence diagnostics',
  );
}

const fallbackZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
  { allowUniversalFallback: true },
).zones;
assert(fallbackZones.some((zone) => zone.featureClass === 'universal'), 'universal zones should appear when feature zones are below minimum');
assert(
  fallbackZones.every((zone) => zone.featureClass !== 'universal' || zone.qaFlags.includes('universal_fallback_zone')),
  'universal fallback zones should be explicitly flagged',
);

const cliSmoke = spawnSync(
  process.execPath,
  [
    '--env-file=.env',
    './node_modules/tsx/dist/cli.mjs',
    'scripts/water-reader-engine-zone-review.ts',
    '--lake',
    'Mullett',
    '--season',
    'summer',
    '--no-svg',
    '--timings',
    '--cli-smoke',
  ],
  {
    cwd: process.cwd(),
    env: { ...process.env, WATER_READER_ZONE_REVIEW_CLI_SMOKE: '1' },
    encoding: 'utf8',
  },
);
assert(cliSmoke.status === 0, `review CLI smoke should exit 0: ${cliSmoke.stderr}`);
assert(cliSmoke.stdout.includes('timings fetch='), 'review CLI timing mode should print compact timing data');
assert(cliSmoke.stdout.includes('zone-counters drafts='), 'review CLI timing mode should print zone placement counters');
assert(cliSmoke.stdout.includes('slowestUnit='), 'review CLI timing mode should print slowest unit diagnostics');
assert(cliSmoke.stdout.includes('"lakeCount":1'), 'review CLI --lake filter should select one lake');
assert(cliSmoke.stdout.includes('"seasons":["summer"]'), 'review CLI --season filter should select one season');
assert(cliSmoke.stdout.includes('"writeSvg":false'), 'review CLI --no-svg should disable SVG output');

console.log(JSON.stringify({
  ok: true,
  cases: 32,
  counts: {
    neckZones: neckZones.filter((zone) => zone.featureClass === 'neck').length,
    pointZones: pointZones.filter((zone) => zone.featureClass === 'main_lake_point').length,
    coveZones: coveZones.filter((zone) => zone.featureClass === 'cove').length,
    fallbackZones: fallbackZones.filter((zone) => zone.featureClass === 'universal').length,
  },
}));

function preprocessShell(fixture: { polygonM: PolygonM; longestDimensionM: number }) {
  return {
    supportStatus: 'supported' as const,
    supportReason: 'fixture',
    qaFlags: [],
    primaryPolygon: fixture.polygonM,
    metrics: {
      areaSqM: 1,
      perimeterM: 1,
      longestDimensionM: fixture.longestDimensionM,
      averageLakeWidthM: 1,
      bboxM: { minX: 0, minY: 0, maxX: 1, maxY: 1 },
      componentCount: 1,
      holeCount: 0,
    },
  };
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

function midpoint(a: PointM, b: PointM): PointM {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function lerp(a: PointM, b: PointM, t: number): PointM {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function distance(a: PointM, b: PointM): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function rejectedCandidateReasons(zone: { diagnostics: Record<string, number | string | boolean | null> }): Record<string, number> {
  const raw = zone.diagnostics.rejectedCandidateReasons;
  if (typeof raw !== 'string') return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, number>;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function coverageReason(result: ReturnType<typeof placeWaterReaderZones>, featureId: string): string | null {
  return result.diagnostics.featureCoverage.find((coverage) => coverage.featureId === featureId)?.reason ?? null;
}

function assertZoneSelectionInvariant(result: ReturnType<typeof placeWaterReaderZones>): void {
  assert(
    result.diagnostics.selectedFeatureCount + result.diagnostics.suppressedFeatureCount === result.diagnostics.detectedFeatureCount,
    'selected + suppressed feature counts should equal detected candidate count',
  );
  const zoneCounts = new Map<string, number>();
  for (const zone of result.zones) zoneCounts.set(zone.sourceFeatureId, (zoneCounts.get(zone.sourceFeatureId) ?? 0) + 1);
  for (const coverage of result.diagnostics.featureCoverage) {
    const count = zoneCounts.get(coverage.featureId) ?? 0;
    assert(coverage.zoneCount === count, `coverage zone count should match zones for ${coverage.featureId}`);
    if (coverage.producedVisibleZones) {
      assert(coverage.zoneCount >= 1, `selected feature should have zones: ${coverage.featureId}`);
      assert(coverage.reason === 'zoned', `selected feature should report zoned: ${coverage.featureId}`);
    } else {
      assert(coverage.zoneCount === 0, `suppressed feature should have zero zones: ${coverage.featureId}`);
      assert(coverage.reason !== 'zoned', `suppressed feature should have non-zoned reason: ${coverage.featureId}`);
    }
  }
}
