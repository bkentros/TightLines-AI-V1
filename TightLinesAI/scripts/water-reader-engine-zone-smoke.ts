import {
  WATER_READER_FEATURE_COLORS,
  WATER_READER_ZONE_PLACEMENT_KINDS,
  buildWaterReaderDisplayModel,
  buildWaterReaderLegend,
  buildWaterReaderProductionSvg,
  materializeZoneDraft,
  placeWaterReaderZones,
  preprocessWaterReaderGeometry,
  retainedDisplayState,
  waterReaderLegendForbiddenPhraseHits,
  waterReaderLegendTemplateCoverage,
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
import { readFileSync } from 'fs';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertCoveBackExcellentEarlyReturnGuard() {
  const source = readFileSync('lib/water-reader-engine/zones/placement.ts', 'utf8');
  assert(
    source.includes('!isCoveBackCandidate(candidate) && isExcellentCandidate(candidate.zone)'),
    'cove_back candidates should not bypass semantic preference through excellent-candidate early return',
  );
}

assertCoveBackExcellentEarlyReturnGuard();

function assertZoneSemanticIds(zones: Array<{ placementSemanticId?: string; anchorSemanticId?: string }>, label: string) {
  assert(zones.every((zone) => zone.placementSemanticId && zone.anchorSemanticId), `${label} zones should expose placement and anchor semantic ids`);
}

function assertFeatureEnvelopeZones(
  zones: Array<{ placementKind: string; diagnostics: Record<string, unknown> }>,
  expectedPlacementKind: string,
  label: string,
) {
  assert(zones.length > 0, `${label} should produce at least one feature-envelope zone`);
  assert(zones.every((zone) => zone.placementKind === expectedPlacementKind), `${label} should use ${expectedPlacementKind}`);
  assert(
    zones.every((zone) => zone.diagnostics.featureEnvelopeModelVersion === 'feature-envelope-v1'),
    `${label} zones should expose feature-envelope model diagnostics`,
  );
  assert(
    zones.every((zone) => zone.diagnostics.featureEnvelopeSeasonInvariant === true),
    `${label} zones should mark geometry as season-invariant`,
  );
  assert(
    zones.every((zone) => zone.diagnostics.seasonalEmphasisOnly === true),
    `${label} zones should keep season as emphasis/ranking only`,
  );
  assert(
    zones.every((zone) => zone.placementKind.endsWith('_structure_area')),
    `${label} normal path should not use legacy seasonal placement kinds`,
  );
}

function assertHonestCoveLegend(
  zones: Array<{ zoneId: string; featureClass: string; placementKind: string; anchorSemanticId?: string }>,
  legend: Array<{ title: string; zoneId: string; zoneIds?: string[] }>,
  label: string,
) {
  const zonesById = new Map(zones.map((zone) => [zone.zoneId, zone]));
  for (const entry of legend) {
    const entryZoneIds = entry.zoneIds ?? [entry.zoneId];
    for (const zoneId of entryZoneIds) {
      const zone = zonesById.get(zoneId);
      if (!zone || zone.featureClass !== 'cove') continue;
      if (zone.placementKind === 'cove_back' && zone.anchorSemanticId !== 'cove_back_primary') {
        assert(!entry.title.includes('Back Shoreline'), `${label} should not label cove ${zone.anchorSemanticId} as Back Shoreline`);
      }
      if (zone.placementKind === 'cove_irregular_side' && zone.anchorSemanticId?.startsWith('cove_mouth_')) {
        assert(!entry.title.includes('Irregular Side'), `${label} should not label cove mouth recovery as Irregular Side`);
      }
    }
  }
}

function assertHonestSecondaryPointLegend(
  zones: Array<{ zoneId: string; featureClass: string; anchorSemanticId?: string }>,
  legend: Array<{ title: string; zoneId: string; zoneIds?: string[] }>,
  label: string,
) {
  const zonesById = new Map(zones.map((zone) => [zone.zoneId, zone]));
  for (const entry of legend) {
    const entryZoneIds = entry.zoneIds ?? [entry.zoneId];
    for (const zoneId of entryZoneIds) {
      const zone = zonesById.get(zoneId);
      if (!zone || zone.featureClass !== 'secondary_point') continue;
      const anchor = zone.anchorSemanticId ?? '';
      if (!anchor.endsWith('_true')) {
        assert(
          !entry.title.includes('Back-Facing Side') && !entry.title.includes('Mouth-Facing Side'),
          `${label} should not label secondary point ${anchor} as true back/mouth-facing side`,
        );
      }
    }
  }
}

function assertHonestOpenWaterLegend(
  zones: Array<{ zoneId: string; placementKind: string; anchorSemanticId?: string }>,
  legend: Array<{ title: string; zoneId: string; zoneIds?: string[] }>,
  label: string,
) {
  const zonesById = new Map(zones.map((zone) => [zone.zoneId, zone]));
  for (const entry of legend) {
    const entryZoneIds = entry.zoneIds ?? [entry.zoneId];
    for (const zoneId of entryZoneIds) {
      const zone = zonesById.get(zoneId);
      if (!zone) continue;
      if (zone.placementKind === 'main_point_open_water' && zone.anchorSemanticId !== 'main_point_open_water_area') {
        assert(!entry.title.includes('Open-Water Side'), `${label} should not label main point ${zone.anchorSemanticId} as true Open-Water Side`);
      }
      if (zone.placementKind === 'island_open_water' && zone.anchorSemanticId !== 'island_open_water_area') {
        assert(!entry.title.includes('Open-Water Edge'), `${label} should not label island ${zone.anchorSemanticId} as true Open-Water Edge`);
      }
    }
  }
}

function assertHonestIslandMainlandLegend(
  zones: Array<{ zoneId: string; featureClass: string; placementKind: string; anchorSemanticId?: string }>,
  legend: Array<{ title: string; zoneId: string; zoneIds?: string[] }>,
  label: string,
) {
  const zonesById = new Map(zones.map((zone) => [zone.zoneId, zone]));
  for (const entry of legend) {
    const entryZoneIds = entry.zoneIds ?? [entry.zoneId];
    for (const zoneId of entryZoneIds) {
      const zone = zonesById.get(zoneId);
      if (!zone || zone.featureClass !== 'island' || zone.placementKind !== 'island_mainland') continue;
      if (zone.anchorSemanticId !== 'island_mainland_primary') {
        assert(!entry.title.includes('Mainland-Facing Edge'), `${label} should not label island ${zone.anchorSemanticId} as true Mainland-Facing Edge`);
      }
    }
  }
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
const legendCoverage = waterReaderLegendTemplateCoverage();
assert(legendCoverage.placementKindCount === WATER_READER_ZONE_PLACEMENT_KINDS.length, 'legend coverage should account for every placement kind');
assert(legendCoverage.missingTemplateKeys.length === 0, `legend templates should cover every supported placement kind: ${legendCoverage.missingTemplateKeys.join(', ')}`);
assert(legendCoverage.missingColorKeys.length === 0, `legend colors should cover every feature class: ${legendCoverage.missingColorKeys.join(', ')}`);
assert(
  legendCoverage.forbiddenTemplateHits.length === 0,
  `legend template copy should not contain forbidden phrases: ${JSON.stringify(legendCoverage.forbiddenTemplateHits)}`,
);

const neck = fakeNeck('neck-1', lerp(topLeftShoulder, topRightShoulder, 0.33), lerp(topLeftShoulder, topRightShoulder, 0.67));
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
assertZoneSemanticIds(neckZones, 'neck');
assert(neckZones.filter((zone) => zone.featureClass === 'neck').length === 1, 'neck should create one grouped feature-envelope zone');
assertFeatureEnvelopeZones(neckZones.filter((zone) => zone.featureClass === 'neck'), 'neck_structure_area', 'neck');
assert(neckResult.diagnostics.unitDiagnostics.length > 0, 'zone placement should expose per-unit diagnostics');
assert(
  neckResult.diagnostics.unitDiagnostics.some((unit) => unit.featureId === 'neck-1' && unit.draftCount > 0 && unit.materializedCandidateCount > 0 && unit.validCandidateCount > 0),
  'per-unit diagnostics should include draft/materialized/valid counters',
);
assert(
  neckZones.every((zone) => Number(zone.diagnostics.candidateCount) >= 1),
  'neck placement should evaluate feature-envelope recovery candidates',
);
assert(
  neckZones.every((zone) =>
    typeof zone.diagnostics.constrictionWidthM === 'number' &&
    typeof zone.diagnostics.constrictionWidthToAverage === 'number' &&
    typeof zone.diagnostics.constrictionLeftExpansionRatio === 'number' &&
    typeof zone.diagnostics.constrictionRightExpansionRatio === 'number' &&
    typeof zone.diagnostics.constrictionConfidence === 'number' &&
    typeof zone.diagnostics.constrictionReadabilityClass === 'string'
  ),
  'neck diagnostics should expose constriction audit metrics',
);
const broadSaddle = {
  ...fakeSaddle('broad-saddle', lerp(topLeftShoulder, topRightShoulder, 0.42), lerp(topLeftShoulder, topRightShoulder, 0.58)),
  widthM: fixture.longestDimensionM * 0.45,
  leftExpansionRatio: 1.08,
  rightExpansionRatio: 1.12,
  confidence: 0.42,
};
const broadSaddleZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [broadSaddle],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'saddle');
assert(
  broadSaddleZones.some((zone) => zone.diagnostics.constrictionReadabilityClass === 'low_confidence_review'),
  'broad low-confidence saddle should be flagged for review in diagnostics',
);

for (const seasonCase of seasonCases) {
  const seasonalNeckZones = placeWaterReaderZones(
    preprocessShell(fixture),
    [neck],
    { state: 'MI', acreage: 80, currentDate: seasonCase.date, geojson: fixture.geojson },
  ).zones;
  assertFeatureEnvelopeZones(seasonalNeckZones.filter((zone) => zone.featureClass === 'neck'), 'neck_structure_area', `neck ${seasonCase.season}`);

  const seasonalSaddleZones = placeWaterReaderZones(
    preprocessShell(fixture),
    [fakeSaddle('saddle-1', lerp(topLeftShoulder, topRightShoulder, 0.4), lerp(topLeftShoulder, topRightShoulder, 0.6))],
    { state: 'MI', acreage: 80, currentDate: seasonCase.date, geojson: fixture.geojson },
  ).zones;
  assertFeatureEnvelopeZones(seasonalSaddleZones.filter((zone) => zone.featureClass === 'saddle'), 'saddle_structure_area', `saddle ${seasonCase.season}`);
}

const pointResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [fakePoint('point-1', topMid, topLeftShoulder, topRightShoulder)],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
);
const pointZones = pointResult.zones;
const pointZone = pointZones.find((zone) => zone.featureClass === 'main_lake_point');
assertZoneSemanticIds(pointZones, 'point');
assert(pointZone, 'point feature should create a zone');
assertFeatureEnvelopeZones(pointZones.filter((zone) => zone.featureClass === 'main_lake_point'), 'main_point_structure_area', 'point');
assert(pointZone.visibleWaterFraction <= Number(pointZone.diagnostics.visibleWaterFractionCeiling), 'point zone should honor its scoped visible-fraction ceiling');
assert(pointZone.visibleWaterRing.length > 0, 'point zone should touch visible water');
assert(pointZone.diagnostics.pointEnvelopeRenderShape === 'rounded_point_apron', 'point envelope should request rounded apron rendering');
assert(pointZone.diagnostics.pointEnvelopeRoundedApronUsed === true, 'point envelope should diagnose rounded apron rendering');
assert(pointZone.diagnostics.pointEnvelopeWrapsTip === true, 'point envelope should diagnose tip coverage');
assert(pointZone.diagnostics.pointEnvelopeWrapsLeftShoulder === true, 'point envelope should diagnose left shoulder coverage');
assert(pointZone.diagnostics.pointEnvelopeWrapsRightShoulder === true, 'point envelope should diagnose right shoulder coverage');
assert(pointZone.diagnostics.pointApronRenderMethod === 'shoreline_buffer', 'point apron should request shoreline buffer rendering');
assert(pointZone.diagnostics.pointApronRenderedAsShorelineBuffer === true, 'point apron should diagnose shoreline buffer rendering');
assert(typeof pointZone.diagnostics.pointEnvelopeShorePathSampleCount === 'number' && pointZone.diagnostics.pointEnvelopeShorePathSampleCount >= 3, 'point apron should expose shoreline path samples');
assert(typeof pointZone.diagnostics.pointEnvelopeShorePathLengthM === 'number', 'point apron should expose shoreline path length diagnostics');
assert(typeof pointZone.diagnostics.pointApronStrokeWidthM === 'number', 'point apron should expose stroke width meters');
assert(typeof pointZone.diagnostics.pointApronStrokeWidthPx === 'number', 'point apron should expose estimated app stroke width pixels');
assert(typeof pointZone.diagnostics.pointApronAppMinWidthPx === 'number', 'point apron should expose app minimum stroke width pixels');
assert(typeof pointZone.diagnostics.pointApronWaterwardPadM === 'number', 'point apron should expose waterward pad diagnostics');
assert(typeof pointZone.diagnostics.pointApronShoulderPadM === 'number', 'point apron should expose shoulder pad diagnostics');
assert(typeof pointZone.diagnostics.pointApronVisibleAreaRatio === 'number', 'point apron should expose visible area diagnostics');
assert(typeof pointZone.diagnostics.pointApronClippedTooThin === 'boolean', 'point apron should expose thin clipping diagnostics');
const topOutward = normalizeVector({ x: topMid.x - bottomMid.x, y: topMid.y - bottomMid.y });
const outsideCenterPointMajorAxisM = Math.max(80, fixture.longestDimensionM * 0.06);
const outsideCenterPointMinorAxisM = Math.max(46, fixture.longestDimensionM * 0.035);
const outsideCenterPointDraft: WaterReaderZoneDraft = {
  unitId: 'outside-center-point',
  unitPriority: 1,
  unitScore: 1,
  sourceFeatureId: 'outside-center-point',
  featureClass: 'main_lake_point',
  placementKind: 'main_point_structure_area',
  placementSemanticId: 'main_point_structure_area',
  anchorSemanticId: 'main_point_structure_area',
  anchor: topMid,
  ovalCenter: { x: topMid.x + topOutward.x * 6, y: topMid.y + topOutward.y * 6 },
  majorAxisM: outsideCenterPointMajorAxisM,
  minorAxisM: outsideCenterPointMinorAxisM,
  rotationRad: Math.atan2(topRightShoulder.y - topLeftShoulder.y, topRightShoulder.x - topLeftShoulder.x),
  diagnostics: {
    featureEnvelopeModelVersion: 'feature-envelope-v1',
    featureEnvelopeSourceFeatureId: 'outside-center-point',
    featureEnvelopeGeometryKind: 'point_local_span',
    featureEnvelopeIncludes: ['tip', 'left_slope', 'right_slope', 'local_point_span'],
    featureEnvelopeSeasonInvariant: true,
    featureEnvelopeSuppressionReason: null,
    seasonalEmphasisOnly: true,
  },
  qaFlags: [],
  featureFrameAllowsOutsideWaterCenter: true,
  featureFrameContactAnchors: [topMid, topLeftShoulder, topRightShoulder],
  featureFrameContactToleranceM: 24,
  featureFrameLocalityRadiusM: outsideCenterPointMajorAxisM * 0.95,
};
const outsideCenterPoint = materializeZoneDraft({
  draft: outsideCenterPointDraft,
  polygon: fixture.polygonM,
  longestDimensionM: fixture.longestDimensionM,
});
assert(outsideCenterPoint.ok, `whole-feature point envelope should not fail only because the conceptual center is outside water: ${outsideCenterPoint.ok ? '' : outsideCenterPoint.reason}`);
if (outsideCenterPoint.ok) {
  assert(outsideCenterPoint.zone.diagnostics.wholeFeatureOutsideWaterCenterAccepted === true, 'outside-water point center acceptance should be diagnostic');
  assert(outsideCenterPoint.zone.diagnostics.featureFrameLocalitySatisfied === true, 'outside-water point center acceptance should report satisfied locality');
  assert(typeof outsideCenterPoint.zone.diagnostics.featureFrameMaxVisibleWaterDistanceM === 'number', 'outside-water point center should report max visible-water locality distance');
  assert(typeof outsideCenterPoint.zone.diagnostics.featureFrameLocalityRadiusM === 'number', 'outside-water point center should report locality radius');
}
const detachedOutsideCenterPoint = materializeZoneDraft({
  draft: {
    ...outsideCenterPointDraft,
    sourceFeatureId: 'outside-center-point-detached',
    unitId: 'outside-center-point-detached',
    featureFrameLocalityRadiusM: 8,
  },
  polygon: fixture.polygonM,
  longestDimensionM: fixture.longestDimensionM,
});
assert(
  !detachedOutsideCenterPoint.ok && detachedOutsideCenterPoint.reason === 'zone_feature_frame_locality_failed',
  'outside-water point center should fail when visible water drifts beyond the feature frame locality radius',
);

const farBackPoint = fakePoint('far-point', topMid, fixture.polygonM.exterior[3]!, fixture.polygonM.exterior[2]!);
const farBackSpringZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assertZoneSemanticIds(farBackSpringZones, 'spring point');
assertFeatureEnvelopeZones(farBackSpringZones, 'main_point_structure_area', 'spring point');
assert(farBackSpringZones.length === 1, 'spring point should create one point structure-area zone');

const farBackFallZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 9, 1)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assertFeatureEnvelopeZones(farBackFallZones, 'main_point_structure_area', 'fall point');
assert(farBackFallZones.length === 1, 'fall point should create one point structure-area zone');

const farBackSummerZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 6, 15)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assertZoneSemanticIds(farBackSummerZones, 'summer point');
assertFeatureEnvelopeZones(farBackSummerZones, 'main_point_structure_area', 'summer point');
assert(farBackSummerZones.length === 1, 'summer point should create one point structure-area zone');

const largeLakePointZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 2500, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assertFeatureEnvelopeZones(largeLakePointZones, 'main_point_structure_area', 'large-lake point');

const farBackWinterZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assertZoneSemanticIds(farBackWinterZones, 'winter point');
assertFeatureEnvelopeZones(farBackWinterZones, 'main_point_structure_area', 'winter point');
assert(farBackWinterZones.length === 1, `winter point should create one point structure-area zone, got ${farBackWinterZones.length}`);

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
assertZoneSemanticIds(coveZones, 'cove');
const coveZone = coveZones.find((zone) => zone.featureClass === 'cove');
assert(coveZone, 'cove feature should create a zone');
assertFeatureEnvelopeZones(coveZones.filter((zone) => zone.featureClass === 'cove'), 'cove_structure_area', 'cove');
assert(coveZone.visibleWaterFraction <= Number(coveZone.diagnostics.visibleWaterFractionCeiling), 'cove zone should honor its scoped visible-fraction ceiling');
assert(coveZone.visibleWaterRing.length > 0, 'cove zone should touch visible water');
assert(Number(coveZone.diagnostics.candidateCount) >= 1, 'cove placement should evaluate feature-envelope recovery candidates');
assert(coveZone.diagnostics.coveEnvelopeRenderShape === 'shoreline_cove_polygon', 'cove envelope should request shoreline cove polygon rendering');
assert(coveZone.diagnostics.coveEnvelopeMouthClosureKind === 'quadratic_mouth_cap', 'cove envelope should expose curved mouth closure diagnostics');
assert(typeof coveZone.diagnostics.coveEnvelopeMouthWidthM === 'number', 'cove envelope should expose mouth width diagnostics');
assert(typeof coveZone.diagnostics.coveEnvelopeDepthM === 'number', 'cove envelope should expose depth diagnostics');
assert(typeof coveZone.diagnostics.coveEnvelopeShorePathSampleCount === 'number', 'cove envelope should expose shore-path sample diagnostics');
assert(coveZone.diagnostics.coveEnvelopeShorePathSampleCount >= 21, 'cove envelope should preserve at least 21 shoreline samples for SVG fidelity');
assert(coveZone.diagnostics.coveEnvelopeShorePathSampleCount <= 96, 'cove envelope should cap shoreline samples for app SVG review');
assert(typeof coveZone.diagnostics.coveEnvelopeMaxShoreSegmentM === 'number', 'cove envelope should expose max shoreline segment diagnostics');
assert(typeof coveZone.diagnostics.coveEnvelopeMaxShoreSegmentAppPxEstimate === 'number', 'cove envelope should expose app-pixel segment estimate diagnostics');
assert(typeof coveZone.diagnostics.coveEnvelopeShorePathPreserved === 'boolean', 'cove envelope should report whether raw shoreline path was preserved');
assert(coveZone.diagnostics.coveEnvelopeBasinBounded === true, 'cove envelope should report bounded basin behavior');
assert(
  coveResult.diagnostics.unitDiagnostics.some((unit) => unit.featureId === 'cove-1' && unit.materializedCandidateCount <= unit.draftCount),
  'zone placement should expose materialized candidate counters without requiring every draft to be evaluated',
);
const coveLegend = buildWaterReaderLegend(coveResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 1)) });
assertHonestCoveLegend(coveResult.zones, coveLegend, 'spring cove legend');
assert(coveLegend.length > 0, 'normal zone legend entries should be produced');
assert(coveLegend.length === coveResult.zones.length, 'non-confluence zones should get one legend entry per zone');
assertLegendShape(coveLegend);
assert(coveLegend.every((entry, index) => entry.number === index + 1), 'legend entries should be numbered in render order');
assert(coveLegend.some((entry) => entry.colorHex === WATER_READER_FEATURE_COLORS.cove), 'legend should use the spec cove color');
assertNoForbiddenLegendCopy(coveLegend);

const seasonalCove: WaterReaderCoveFeature = {
  ...fakeCove('cove-seasonal', topLeftShoulder, topRightShoulder, topMid),
  rightIrregularity: 0.05,
};
const springCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
);
assertFeatureEnvelopeZones(springCoveResult.zones.filter((zone) => zone.featureClass === 'cove'), 'cove_structure_area', 'spring cove');
assertZoneSemanticIds(springCoveResult.zones, 'spring cove');
const summerCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 6, 15)), geojson: fixture.geojson },
);
assertFeatureEnvelopeZones(summerCoveResult.zones.filter((zone) => zone.featureClass === 'cove'), 'cove_structure_area', 'summer cove');
assertZoneSemanticIds(summerCoveResult.zones, 'summer cove');
const summerCoveLegendWithoutDate = buildWaterReaderLegend(summerCoveResult, { state: 'MI' });
assertHonestCoveLegend(summerCoveResult.zones, summerCoveLegendWithoutDate, 'summer cove legend');
assert(
  summerCoveLegendWithoutDate.every((entry) => entry.templateId?.includes(':summer:') && entry.body.includes('In summer,')),
  'legend without currentDate should use zoneResult.season for template identity and copy',
);
assert(
  summerCoveLegendWithoutDate.every((entry) => !entry.transitionWarning),
  'legend without currentDate should not emit transition warnings',
);
assertNoForbiddenLegendCopy(summerCoveLegendWithoutDate);
const fallCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 9, 1)), geojson: fixture.geojson },
);
assertFeatureEnvelopeZones(fallCoveResult.zones.filter((zone) => zone.featureClass === 'cove'), 'cove_structure_area', 'fall cove');
assertZoneSemanticIds(fallCoveResult.zones, 'fall cove');
assertHonestCoveLegend(fallCoveResult.zones, buildWaterReaderLegend(fallCoveResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 9, 1)) }), 'fall cove legend');
const winterCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
);
assertFeatureEnvelopeZones(winterCoveResult.zones.filter((zone) => zone.featureClass === 'cove'), 'cove_structure_area', 'winter cove');
assertZoneSemanticIds(winterCoveResult.zones, 'winter cove');
assertHonestCoveLegend(winterCoveResult.zones, buildWaterReaderLegend(winterCoveResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 0, 15)) }), 'winter cove legend');
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
assertZoneSemanticIds(winterSecondaryResult.zones, 'winter secondary');
const winterSecondaryZones = winterSecondaryResult.zones.filter((zone) => zone.featureClass === 'secondary_point');
assert(
  winterSecondaryZones.every((zone) => zone.anchorSemanticId === 'secondary_point_mouth_true' || !zone.anchorSemanticId?.endsWith('_true')),
  'winter secondary point zones should expose true mouth-facing semantics only when parent-cove geometry is available',
);
assertHonestSecondaryPointLegend(
  winterSecondaryResult.zones,
  buildWaterReaderLegend(winterSecondaryResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 0, 15)) }),
  'winter secondary legend',
);

const islandGeojson = polygon([
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
const islandPreprocess = preprocessWaterReaderGeometry({ state: 'MI', acreage: 140, currentDate: new Date(Date.UTC(2026, 9, 15)), geojson: islandGeojson });
assert(islandPreprocess.primaryPolygon?.holes[0] && islandPreprocess.metrics, 'island fixture should preprocess with one interior ring');
const islandRing = islandPreprocess.primaryPolygon.holes[0]!;
const islandFeature: WaterReaderIslandFeature = {
  featureId: 'island-1',
  featureClass: 'island',
  score: 1,
  qaFlags: [],
  metrics: { rank: 1 },
  ring: islandRing,
  areaSqM: 40000,
  endpointA: midpoint(islandRing[0]!, islandRing[1]!),
  endpointB: midpoint(islandRing[2]!, islandRing[3]!),
  nearestMainlandDistanceM: 300,
};
const springIslandResult = placeWaterReaderZones(
  islandPreprocess,
  [islandFeature],
  { state: 'MI', acreage: 140, currentDate: new Date(Date.UTC(2026, 4, 3)), geojson: islandGeojson },
);
const springIslandZones = springIslandResult.zones.filter((zone) => zone.featureClass === 'island');
assertZoneSemanticIds(springIslandZones, 'spring island');
assertFeatureEnvelopeZones(springIslandZones, 'island_structure_area', 'spring island');
assert(
  springIslandZones.every((zone) => zone.diagnostics.featureEnvelopeGeometryKind === 'island_structure_envelope' && zone.diagnostics.islandStructureAreaCentered === true),
  'island structure area should be island-centered and use island structure-envelope semantics',
);
const springIslandLegend = buildWaterReaderLegend(springIslandResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 3)) });
assert(
  springIslandLegend.some((entry) => entry.title === 'Island - Structure Area') &&
    springIslandLegend.every((entry) => entry.title !== 'Island Edge - Structure Area'),
  'island feature-envelope legend title should use Island - Structure Area',
);
assertHonestIslandMainlandLegend(
  springIslandResult.zones,
  springIslandLegend,
  'spring island mainland legend',
);
const fallIslandResult = placeWaterReaderZones(
  islandPreprocess,
  [islandFeature],
  { state: 'MI', acreage: 140, currentDate: new Date(Date.UTC(2026, 9, 15)), geojson: islandGeojson },
);
const fallIslandZones = fallIslandResult.zones.filter((zone) => zone.featureClass === 'island');
assertFeatureEnvelopeZones(fallIslandZones, 'island_structure_area', 'fall island');
assert(fallIslandZones.length === 1, `fall island should produce one island structure-area zone, got ${fallIslandZones.length}`);
assert(
  fallIslandZones.every((zone) => zone.diagnostics.islandLandHoleClippingBehavior === 'lake_polygon_evenodd_hole_clip'),
  'island structure area diagnostics should report lake-hole clipping behavior',
);
assert(
  fallIslandZones.every((zone) =>
    typeof zone.diagnostics.islandSelectionAreaSqM === 'number' &&
    typeof zone.diagnostics.islandSelectionNearestMainlandDistanceM === 'number' &&
    typeof zone.diagnostics.islandSelectionNearestMainlandDistanceThresholdM === 'number' &&
    typeof zone.diagnostics.islandSelectionTinyAreaThresholdSqM === 'number'
  ),
  'island structure area diagnostics should expose selection thresholds and mainland distance',
);

const openWaterDraft: WaterReaderZoneDraft = {
  unitId: 'open-water',
  unitPriority: 1,
  unitScore: 1,
  sourceFeatureId: 'open-water',
  featureClass: 'main_lake_point',
  placementKind: 'main_point_tip',
  placementSemanticId: 'main_point_tip',
  anchorSemanticId: 'main_point_tip',
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

const overlapResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [fakeCove('cove-2', bottomMid, rightMid, bottomMid), neck],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
);
const overlapZones = overlapResult.zones;
assert(overlapZones.some((zone) => zone.featureClass === 'neck'), 'higher-priority neck zone should be retained');
assert(overlapZones.some((zone) => zone.sourceFeatureId === 'cove-2'), 'overlapping valid cove structure should be retained instead of hidden');
assert(
  [0, 1].includes(overlapZones.filter((zone) => zone.sourceFeatureId === 'neck-1').length),
  'neck feature should return one grouped structure-area zone or none',
);
assert(
  overlapResult.diagnostics.selectedFeatureCount > 0,
  'overlapping valid structures should remain available for display/confluence diagnostics',
);
const confluenceLegend = buildWaterReaderLegend(overlapResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 1)) });
assertHonestCoveLegend(overlapResult.zones, confluenceLegend, 'confluence legend');
assertLegendShape(confluenceLegend);
assert(
  confluenceLegend.filter((entry) => entry.isConfluence).length === overlapResult.diagnostics.confluenceGroupCount,
  'confluence output should create one legend entry per confluence group',
);
if (overlapResult.diagnostics.confluenceGroupCount > 0) {
  assert(
    confluenceLegend.some((entry) => entry.isConfluence && entry.colorHex === WATER_READER_FEATURE_COLORS.structure_confluence),
    'confluence legend entries should use the confluence color',
  );
  assert(
    confluenceLegend.filter((entry) => entry.isConfluence).every((entry) => !entry.title.includes('Point Point')),
    'confluence titles should not duplicate point wording',
  );
}
assertNoForbiddenLegendCopy(confluenceLegend);
const confluenceDisplay = buildWaterReaderDisplayModel(overlapResult, confluenceLegend, {
  acreage: 80,
  longestDimensionM: fixture.longestDimensionM,
});
assert(
  confluenceDisplay.summary.displayedConfluenceCount === overlapResult.diagnostics.confluenceGroupCount,
  'confluence groups should count as one displayed entry each',
);
assert(
  confluenceDisplay.displayedEntries.every((entry, index) => entry.displayNumber === index + 1),
  'displayed numbers should be stable and 1-based',
);
assertDisplayLegendAlignment(confluenceDisplay);
assertStandaloneEntriesHaveOneZone(confluenceDisplay);
assert(
  confluenceDisplay.displayedEntries
    .filter((entry) => entry.entryType === 'structure_confluence')
    .every((entry) => entry.zoneIds.length >= 1),
  'confluence display entries may preserve multiple member zone ids',
);
const confluenceMemberZoneIds = new Set(
  confluenceDisplay.displayedEntries
    .filter((entry) => entry.entryType === 'structure_confluence')
    .flatMap((entry) => entry.zoneIds),
);
assert(
  confluenceDisplay.displayedEntries
    .filter((entry) => entry.entryType === 'standalone_zone')
    .every((entry) => entry.zoneIds.every((zoneId) => !confluenceMemberZoneIds.has(zoneId))),
  'confluence member zones should not also receive standalone displayed numbers',
);
assert(confluenceDisplay.rawZones.length === overlapResult.zones.length, 'display model should retain raw zones');
assertNoForbiddenLegendCopy(confluenceDisplay.displayedEntries.map((entry) => entry.legend).filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)));
assertNoForbiddenLegendCopy(confluenceDisplay.displayLegendEntries);
assertProductionSvg(confluenceDisplay, 'confluence');
const transitionConfluenceLegend = buildWaterReaderLegend(overlapResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 5, 15)) });
if (overlapResult.diagnostics.confluenceGroupCount > 0) {
  assert(
    transitionConfluenceLegend.some((entry) => entry.isConfluence && entry.transitionWarning),
    'confluence transition warnings should be based on actual member zone feature/placement pairs',
  );
}
assertNoForbiddenLegendCopy(transitionConfluenceLegend);

const crossFeatureOverlapResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [fakeCove('cove-neck-overlap', topLeftShoulder, topRightShoulder, topMid), neck],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
);
const crossFeatureGroup = crossFeatureOverlapResult.diagnostics.confluenceGroups.find((group) => group.crossFeatureOverlapPair === 'cove+neck');
assert(crossFeatureGroup, 'heavy compact cove+neck overlap should become one cross-feature structure area');
assert(crossFeatureGroup.crossFeatureOverlapResolutionMode === 'unified_compact_structure_area', 'cross-feature overlap should report unified compact resolution');
assert(typeof crossFeatureGroup.crossFeatureOverlapFraction === 'number', 'cross-feature overlap should expose overlap fraction');
assert(typeof crossFeatureGroup.crossFeatureContainmentFraction === 'number', 'cross-feature overlap should expose containment fraction');
assert(typeof crossFeatureGroup.crossFeatureUnifiedCompactnessRatio === 'number', 'cross-feature overlap should expose compactness ratio');
const crossFeatureLegend = buildWaterReaderLegend(crossFeatureOverlapResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 1)) });
assert(
  crossFeatureLegend.some((entry) => entry.isConfluence && entry.title.includes('Structure Area - Cove + Neck')),
  'cross-feature unified overlap legend should use Structure Area - Cove + Neck wording',
);
const islandPointOverlapResult = {
  ...pointResult,
  zones: [
    pointZone,
    {
      ...pointZone,
      zoneId: 'zone-island-point-overlap',
      sourceFeatureId: 'island-point-overlap',
      featureClass: 'island' as const,
      placementKind: 'island_structure_area' as const,
      placementSemanticId: 'island_structure_area' as const,
      anchorSemanticId: 'island_structure_area' as const,
      diagnostics: {
        ...pointZone.diagnostics,
        featureEnvelopeSourceFeatureId: 'island-point-overlap',
        featureEnvelopeGeometryKind: 'island_structure_envelope',
        featureEnvelopeIncludes: ['island_ring', 'adjacent_water'],
      },
    },
  ],
  diagnostics: {
    ...pointResult.diagnostics,
    zoneCount: 2,
    confluenceGroupCount: 0,
    confluenceGroups: [],
  },
} as typeof pointResult;
const islandPointLegend = buildWaterReaderLegend(islandPointOverlapResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 1)) });
const islandPointDisplay = buildWaterReaderDisplayModel(islandPointOverlapResult, islandPointLegend, {
  acreage: 80,
  longestDimensionM: fixture.longestDimensionM,
});
assert(
  islandPointDisplay.displayedEntries.some((entry) => entry.entryType === 'structure_confluence' && entry.legend?.title === 'Structure Area - Island + Point'),
  'compact island+point overlap should display as one unified Island + Point structure area',
);

const duplicateNeckConfluenceLegend = buildWaterReaderLegend({
  ...neckResult,
  diagnostics: {
    ...neckResult.diagnostics,
    confluenceGroupCount: 1,
    confluenceGroups: [{
      groupId: 'confluence-neck-pair',
      strength: 'light',
      memberZoneIds: neckResult.zones.map((zone) => zone.zoneId),
      memberSourceFeatureIds: ['neck-1'],
      memberFeatureClasses: ['neck'],
      memberPlacementKinds: ['neck_structure_area'],
    }],
  },
}, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 1)) });
const duplicateNeckConfluenceTitle = duplicateNeckConfluenceLegend.find((entry) => entry.isConfluence)?.title ?? '';
assert(
  duplicateNeckConfluenceTitle.includes('Neck'),
  'feature-envelope neck confluence members should use neck structure-area labels',
);
assertNoForbiddenLegendCopy(duplicateNeckConfluenceLegend);

const combinedCapZones = [
  ...cloneZonesWithPrefix(neckResult.zones, 'cap-neck'),
  ...cloneZonesWithPrefix(coveResult.zones, 'cap-cove'),
  ...cloneZonesWithPrefix(farBackSummerZones, 'cap-point'),
  ...cloneZonesWithPrefix(farBackSpringZones, 'cap-spring-point'),
  ...cloneZonesWithPrefix(farBackFallZones, 'cap-fall-point'),
  ...cloneZonesWithPrefix(farBackWinterZones, 'cap-winter-point'),
  ...cloneZonesWithPrefix(fallCoveResult.zones, 'cap-fall-cove'),
  ...cloneZonesWithPrefix(summerCoveResult.zones, 'cap-summer-cove'),
];
const combinedCapResult = {
  ...neckResult,
  zones: combinedCapZones,
  diagnostics: {
    ...neckResult.diagnostics,
    confluenceGroupCount: 0,
    confluenceGroups: [],
    zoneCount: combinedCapZones.length,
    featureCoverage: [],
  },
};
const combinedCapLegend = buildWaterReaderLegend(combinedCapResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 1)) });
assert(
  retainedDisplayState(['retained_title_diversity_rebalance']) === 'retained_not_displayed_diversity' &&
    retainedDisplayState(['retained_feature_family_diversity_rebalance']) === 'retained_not_displayed_diversity' &&
    retainedDisplayState(['retained_repeated_title_diversity']) === 'retained_not_displayed_diversity' &&
    retainedDisplayState(['retained_constriction_line_readability']) === 'retained_not_displayed_readability' &&
    retainedDisplayState(['ordinary_cap_overflow']) === 'retained_not_displayed_cap',
  'retained-state classifier should separate diversity, readability, and cap retention',
);
const repeatedTitleZones = [
  translatedZoneClone(farBackSummerZones[0]!, 'duplicate-title-east', 240, 0),
  translatedZoneClone(farBackSummerZones[0]!, 'duplicate-title-west', -240, 0),
  translatedZoneClone(farBackSummerZones[0]!, 'duplicate-title-north', 0, 180),
  translatedZoneClone(farBackSummerZones[0]!, 'duplicate-title-south', 0, -180),
  translatedZoneClone(farBackSummerZones[0]!, 'duplicate-title-center', 0, 0),
];
const repeatedTitleResult = {
  ...neckResult,
  season: 'summer' as const,
  zones: repeatedTitleZones,
  diagnostics: {
    ...neckResult.diagnostics,
    confluenceGroupCount: 0,
    confluenceGroups: [],
    zoneCount: repeatedTitleZones.length,
    featureCoverage: [],
  },
};
const repeatedTitleLegend = buildWaterReaderLegend(repeatedTitleResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 6, 15)) });
const repeatedTitleLegendAgain = buildWaterReaderLegend(repeatedTitleResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 6, 15)) });
assert(
  repeatedTitleLegend.length === repeatedTitleZones.length &&
    repeatedTitleLegend.every((entry) => /^(North|South|East|West|Northeast|Northwest|Southeast|Southwest|Center) Main Lake Point( [A-Z])? - Structure Area$/.test(entry.title)),
  `duplicate legend titles should receive deterministic positional qualifiers: ${repeatedTitleLegend.map((entry) => entry.title).join(' | ')}`,
);
assert(
  JSON.stringify(repeatedTitleLegend.map((entry) => entry.title)) === JSON.stringify(repeatedTitleLegendAgain.map((entry) => entry.title)),
  'duplicate legend title qualifiers should be stable across repeated builds',
);
const diversityOnlyLegend = repeatedTitleZones.map((zone, index) => ({
  number: index + 1,
  entryId: zone.zoneId,
  zoneId: zone.zoneId,
  zoneIds: [zone.zoneId],
  featureClass: zone.featureClass,
  placementKind: zone.placementKind,
  placementKinds: [zone.placementKind],
  colorHex: WATER_READER_FEATURE_COLORS[zone.featureClass],
  templateId: `${zone.featureClass}:summer:${zone.placementKind}`,
  title: 'Main Lake Point - Structure Area',
  body: 'Summer comparison guidance for this geometry-only structure area.',
  isConfluence: false,
}));
const diversityOnlyDisplay = buildWaterReaderDisplayModel(repeatedTitleResult, diversityOnlyLegend, {
  acreage: 50,
  longestDimensionM: fixture.longestDimensionM,
});
assert(
  diversityOnlyDisplay.retainedEntries.length > 0 &&
    diversityOnlyDisplay.retainedEntries.every((entry) => entry.displayState === 'retained_not_displayed_diversity') &&
    diversityOnlyDisplay.displaySelectionUnits.some((unit) => unit.displayState === 'retained_not_displayed_diversity') &&
    !diversityOnlyDisplay.capExceeded,
  'diversity-only retention should not report display cap pressure',
);
const displayBalancePointZones = [
  translatedZoneClone(farBackSummerZones[0]!, 'balance-point-1', 320, 0),
  translatedZoneClone(farBackSummerZones[0]!, 'balance-point-2', 220, 140),
  translatedZoneClone(farBackSummerZones[0]!, 'balance-point-3', 80, 220),
  translatedZoneClone(farBackSummerZones[0]!, 'balance-point-4', -80, 220),
  translatedZoneClone(farBackSummerZones[0]!, 'balance-point-5', -220, 140),
  translatedZoneClone(farBackSummerZones[0]!, 'balance-point-6', -320, 0),
];
const displayBalanceSaddle = translatedZoneClone(
  { ...cloneZonesWithPrefix(placeWaterReaderZones(
    preprocessShell(fixture),
    [fakeSaddle('balance-saddle', lerp(topLeftShoulder, topRightShoulder, 0.4), lerp(topLeftShoulder, topRightShoulder, 0.6))],
    { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 6, 15)), geojson: fixture.geojson },
  ).zones.filter((zone) => zone.featureClass === 'saddle'), 'balance-saddle')[0]! },
  'balance-saddle-shifted',
  0,
  -260,
);
const displayBalanceZones = [...displayBalancePointZones, displayBalanceSaddle];
const displayBalanceResult = {
  ...neckResult,
  season: 'summer' as const,
  zones: displayBalanceZones,
  diagnostics: {
    ...neckResult.diagnostics,
    confluenceGroupCount: 0,
    confluenceGroups: [],
    zoneCount: displayBalanceZones.length,
    featureCoverage: [],
  },
};
const displayBalanceLegend = displayBalanceZones.map((zone, index) => ({
  number: index + 1,
  entryId: zone.zoneId,
  zoneId: zone.zoneId,
  zoneIds: [zone.zoneId],
  featureClass: zone.featureClass,
  placementKind: `${zone.placementKind}:${index}`,
  placementKinds: [`${zone.placementKind}:${index}`],
  colorHex: WATER_READER_FEATURE_COLORS[zone.featureClass],
  templateId: `${zone.featureClass}:summer:${zone.placementKind}:${index}`,
  title: `${zone.featureClass} ${index}`,
  body: 'Summer comparison guidance for this geometry-only structure area.',
  isConfluence: false,
}));
const displayBalanceModel = buildWaterReaderDisplayModel(displayBalanceResult, displayBalanceLegend as any, {
  acreage: 50,
  longestDimensionM: fixture.longestDimensionM,
});
assert(
  displayBalanceModel.displayedEntries.some((entry) => entry.featureClasses.includes('saddle') && entry.rankingDiagnostics.includes('displayed_non_point_over_excess_main_point')) &&
    displayBalanceModel.retainedEntries.some((entry) => entry.featureClasses.includes('main_lake_point') && entry.rankingDiagnostics.includes('retained_excess_main_point_display_balance')) &&
    !displayBalanceModel.retainedEntries.some((entry) => entry.featureClasses.includes('saddle')),
  '4+ displayed main-lake points with a retained saddle should rebalance the saddle into display',
);
assert(displayBalanceModel.capExceeded, 'true cap-retained structure should keep capExceeded true');

const recoveryNeckBase = neckZones.find((zone) => zone.featureClass === 'neck')!;
const recoverySaddleBase = broadSaddleZones.find((zone) => zone.featureClass === 'saddle')!;
const recoveredClearNeckZone = {
  ...translatedZoneClone(recoveryNeckBase, 'recovered-clear-neck', 0, -360),
  diagnostics: {
    ...recoveryNeckBase.diagnostics,
    constrictionReadabilityClass: 'clear_two_sided_constriction',
    constrictionConfidence: 0.97,
    constrictionWidthToAverage: 0.12,
    constrictionWeakerExpansionRatio: 3.2,
    constrictionExpansionBalance: 0.92,
    constrictionOneSidedExpansion: false,
  },
};
const recoveredOneSidedNeckZone = {
  ...translatedZoneClone(recoveryNeckBase, 'recovered-one-sided-neck', 0, -360),
  diagnostics: {
    ...recoveryNeckBase.diagnostics,
    constrictionReadabilityClass: 'one_sided_constriction_review',
    constrictionConfidence: 0.86,
    constrictionWidthToAverage: 0.07,
    constrictionWeakerExpansionRatio: 2.4,
    constrictionExpansionBalance: 0.52,
    constrictionOneSidedExpansion: true,
  },
};
const narrowRecoveredNeckZone = {
  ...translatedZoneClone(recoveryNeckBase, 'narrow-recovered-neck', 0, -360),
  diagnostics: {
    ...recoveryNeckBase.diagnostics,
    constrictionReadabilityClass: 'clear_two_sided_constriction',
    constrictionConfidence: 0.97,
    constrictionWidthToAverage: 0.02,
    constrictionWeakerExpansionRatio: 3.2,
    constrictionExpansionBalance: 0.92,
    constrictionOneSidedExpansion: false,
  },
};
const lowConfidenceSaddleZone = {
  ...translatedZoneClone(recoverySaddleBase, 'low-confidence-saddle', 0, -360),
  diagnostics: {
    ...recoverySaddleBase.diagnostics,
    constrictionReadabilityClass: 'broad_saddle_review',
    constrictionConfidence: 0.56,
    constrictionWidthToAverage: 0.42,
    constrictionWeakerExpansionRatio: 1.18,
    constrictionExpansionBalance: 0.32,
  },
};
const pontiacLikeBroadSaddleZone = {
  ...translatedZoneClone(recoverySaddleBase, 'pontiac-like-broad-saddle', 0, -360),
  diagnostics: {
    ...recoverySaddleBase.diagnostics,
    constrictionReadabilityClass: 'broad_saddle_review',
    constrictionConfidence: 0.84,
    constrictionWidthToAverage: 0.42,
    constrictionWeakerExpansionRatio: 1.18,
    constrictionExpansionBalance: 0.32,
    constrictionOneSidedExpansion: true,
  },
};
const visuallySubstantialBroadSaddleZone = {
  ...translatedZoneClone(recoverySaddleBase, 'substantial-broad-saddle', 0, -360),
  diagnostics: {
    ...recoverySaddleBase.diagnostics,
    constrictionReadabilityClass: 'broad_saddle_review',
    constrictionConfidence: 0.9,
    constrictionWidthToAverage: 0.42,
    constrictionWeakerExpansionRatio: 1.55,
    constrictionExpansionBalance: 0.58,
    constrictionTwoSidedExpansion: true,
  },
};

function recoveryDisplayFor(zone: any, appMapWidth: number) {
  const result = {
    ...neckResult,
    zones: [zone],
    diagnostics: {
      ...neckResult.diagnostics,
      confluenceGroupCount: 0,
      confluenceGroups: [],
      zoneCount: 1,
      featureCoverage: [],
    },
  };
  const legend = [{
    number: 1,
    entryId: zone.zoneId,
    zoneId: zone.zoneId,
    zoneIds: [zone.zoneId],
    featureClass: zone.featureClass,
    placementKind: zone.placementKind,
    placementKinds: [zone.placementKind],
    colorHex: WATER_READER_FEATURE_COLORS[zone.featureClass],
    templateId: `${zone.featureClass}:summer:${zone.placementKind}:recovery`,
    title: zone.featureClass === 'saddle' ? 'Saddle - Structure Area' : 'Neck - Structure Area',
    body: 'Summer comparison guidance for this geometry-only structure area.',
    isConfluence: false,
  }];
  return buildWaterReaderDisplayModel(result, legend as any, {
    acreage: 50,
    longestDimensionM: fixture.longestDimensionM,
    lakePolygon: fixture.polygonM,
    appMapWidth,
  });
}

const clearNeckRecoveryModel = recoveryDisplayFor(recoveredClearNeckZone, 245);
const clearNeckRecoveryEntry = clearNeckRecoveryModel.displayedEntries.find((entry) => entry.featureClasses.includes('neck'));
assert(clearNeckRecoveryEntry, 'high-confidence clear neck with appMax around 14px should display');
assert(!clearNeckRecoveryModel.retainedEntries.some((entry) => entry.featureClasses.includes('neck')), 'high-confidence clear neck should not remain retained');
assert(clearNeckRecoveryEntry.zones.some((zone) => zone.diagnostics.constrictionRecoveredFromTinyGate === true && zone.diagnostics.constrictionRecoveryReason === 'high_confidence_clear_neck'), 'recovered clear neck should expose tiny-gate recovery diagnostics');
assert(clearNeckRecoveryEntry.zones.some((zone) => Number(zone.diagnostics.constrictionDisplayAppFootprintMaxPx) >= 12 && Number(zone.diagnostics.constrictionDisplayAppFootprintMaxPx) < 16), 'clear neck recovery fixture should exercise the around-14px app footprint case');
assert(clearNeckRecoveryEntry.legend?.title.includes('Neck') && !clearNeckRecoveryEntry.legend?.title.includes('Pinch'), 'broader clear two-sided recovered neck should keep Neck labeling');
assert(clearNeckRecoveryEntry.zones.some((zone) => zone.diagnostics.constrictionDisplaySubtype === 'neck'), 'broader clear two-sided recovered neck should expose neck subtype diagnostics');

const narrowNeckRecoveryModel = recoveryDisplayFor(narrowRecoveredNeckZone, 245);
const narrowNeckRecoveryEntry = narrowNeckRecoveryModel.displayedEntries.find((entry) => entry.featureClasses.includes('neck'));
assert(narrowNeckRecoveryEntry, 'high-confidence narrow recovered neck should display');
assert(narrowNeckRecoveryEntry.legend?.title.includes('Pinch') && !narrowNeckRecoveryEntry.legend?.title.includes('Neck'), 'widthToAverage <= 0.035 constriction should display as Pinch, not Neck');
assert(narrowNeckRecoveryEntry.zones.some((zone) => zone.diagnostics.constrictionDisplaySubtype === 'pinch' && zone.diagnostics.constrictionDisplaySubtypeReason === 'narrow_width_ratio'), 'narrow recovered neck should expose pinch subtype diagnostics');

const oneSidedRecoveryModel = recoveryDisplayFor(recoveredOneSidedNeckZone, 177);
const oneSidedRecoveryEntry = oneSidedRecoveryModel.displayedEntries.find((entry) => entry.featureClasses.includes('neck'));
assert(oneSidedRecoveryEntry, 'high-confidence one-sided neck with appMax around 9px should display');
assert(oneSidedRecoveryEntry.legend?.title.includes('Pinch'), 'recovered one-sided neck should display as a pinch subtype');
assert(oneSidedRecoveryEntry.zones.some((zone) => zone.diagnostics.constrictionRecoveredFromTinyGate === true && zone.diagnostics.constrictionRecoveryReason === 'high_confidence_one_sided_pinch'), 'recovered one-sided pinch should expose recovery diagnostics');
assert(oneSidedRecoveryEntry.zones.some((zone) => Number(zone.diagnostics.constrictionDisplayAppFootprintMaxPx) >= 8 && Number(zone.diagnostics.constrictionDisplayAppFootprintMaxPx) < 12), 'one-sided recovery fixture should exercise the around-9px app footprint case');

const lowConfidenceSaddleModel = recoveryDisplayFor(lowConfidenceSaddleZone, 420);
assert(lowConfidenceSaddleModel.retainedEntries.some((entry) => entry.featureClasses.includes('saddle') && entry.displayState === 'retained_not_displayed_readability'), 'confidence below 0.58 saddle should remain retained');
assert(!lowConfidenceSaddleModel.displayedEntries.some((entry) => entry.featureClasses.includes('saddle')), 'low-confidence saddle should not display through recovery');

const pontiacLikeBroadSaddleModel = recoveryDisplayFor(pontiacLikeBroadSaddleZone, 420);
assert(
  pontiacLikeBroadSaddleModel.retainedEntries.some((entry) =>
    entry.featureClasses.includes('saddle') &&
    entry.zones.some((zone) => zone.diagnostics.constrictionDisplayRetainedReason === 'broad_saddle_not_visually_substantial')
  ),
  'Pontiac-like broad saddle should be retained as not visually substantial',
);
assert(!pontiacLikeBroadSaddleModel.displayedEntries.some((entry) => entry.featureClasses.includes('saddle')), 'Pontiac-like broad saddle should not display');

const recoveredBroadSaddleModel = recoveryDisplayFor(visuallySubstantialBroadSaddleZone, 640);
const recoveredBroadSaddleEntry = recoveredBroadSaddleModel.displayedEntries.find((entry) => entry.featureClasses.includes('saddle'));
assert(recoveredBroadSaddleEntry, 'visually substantial broad saddle should still display');
assert(recoveredBroadSaddleEntry.legend?.title.includes('Saddle'), 'recovered broad saddle should keep saddle labeling');
assert(recoveredBroadSaddleEntry.zones.some((zone) => zone.diagnostics.saddleRecoveredFromBroadReview === true && zone.diagnostics.saddleRecoveryReason === 'high_confidence_readable_broad_saddle'), 'recovered broad saddle should expose recovery diagnostics');

assertNoForbiddenLegendCopy(repeatedTitleLegend);
const smallCapDisplay = buildWaterReaderDisplayModel(combinedCapResult, combinedCapLegend, {
  acreage: 50,
  longestDimensionM: fixture.longestDimensionM,
});
assert(smallCapDisplay.displayCap === 6, 'small water display cap should be 6 entries');
assert(smallCapDisplay.capExceeded, 'display cap should report exceeded when valid entries overflow');
assertDisplayLegendAlignment(smallCapDisplay);
assertStandaloneEntriesHaveOneZone(smallCapDisplay);
assert(
  smallCapDisplay.retainedEntries.length > 0 &&
    smallCapDisplay.retainedEntries.every((entry) => entry.displayState === 'retained_not_displayed_cap' && entry.displayNumber === null),
  'overflow valid structure should become retained_not_displayed_cap',
);
assert(smallCapDisplay.displayLegendEntries.length === smallCapDisplay.displayedEntries.length, 'display legend should be built from displayed entries only');
assert(
  smallCapDisplay.displayLegendEntries.every((entry, index) => entry.number === index + 1),
  'display legend numbers should be 1..N in display order',
);
assert(
  noSourceFeatureSplitAcrossDisplayAndRetained(smallCapDisplay),
  'cap pressure should not split one source feature across displayed and retained entries',
);
assert(
  sourceFeaturesAreAllDisplayedOrAllRetained(smallCapDisplay, combinedCapResult.zones),
  'cap should display or retain each source-feature unit as a whole',
);
assert(
  smallCapDisplay.displaySelectionUnits.every((unit) =>
    unit.displayState === 'displayed' ? unit.entryCost <= smallCapDisplay.displayCap : unit.displayState === 'retained_not_displayed_cap',
  ),
  'selection unit diagnostics should expose cap decisions and entry costs',
);
assert(
  smallCapDisplay.summary.multiZoneStandaloneEntryViolationCount === 0,
  'standalone display entries should never collapse multiple zones into one number',
);
const mediumCapDisplay = buildWaterReaderDisplayModel(combinedCapResult, combinedCapLegend, {
  acreage: 500,
  longestDimensionM: fixture.longestDimensionM,
});
assert(mediumCapDisplay.displayCap === 10, 'medium water display cap should be 10 entries');
assertDisplayLegendAlignment(mediumCapDisplay);
assertStandaloneEntriesHaveOneZone(mediumCapDisplay);
const largeCapDisplay = buildWaterReaderDisplayModel(combinedCapResult, combinedCapLegend, {
  acreage: 1500,
  longestDimensionM: fixture.longestDimensionM,
});
assert(largeCapDisplay.displayCap === 12, 'large/unknown water display cap should be 12 entries');
assertDisplayLegendAlignment(largeCapDisplay);
assertStandaloneEntriesHaveOneZone(largeCapDisplay);
assert(
  smallCapDisplay.rawZones.length === combinedCapResult.zones.length &&
    mediumCapDisplay.rawZones.length === combinedCapResult.zones.length &&
    largeCapDisplay.rawZones.length === combinedCapResult.zones.length,
  'display cap should not remove raw zones from structured output',
);
const repeatedSmallCapDisplay = buildWaterReaderDisplayModel(combinedCapResult, combinedCapLegend, {
  acreage: 50,
  longestDimensionM: fixture.longestDimensionM,
});
assert(
  JSON.stringify(displaySignature(repeatedSmallCapDisplay)) === JSON.stringify(displaySignature(smallCapDisplay)),
  'repeated display model builds should produce identical display entry ids/numbers/states',
);
assertProductionSvg(smallCapDisplay, 'cap');

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
assert([0, 1].includes(tightNeckZones.length), 'tight neck recovery should keep one grouped structure area or suppress it');
if (tightNeckZones.length === 1) {
  assert(
    tightNeckZones.every((zone) => zone.placementKind === 'neck_structure_area' && zone.diagnostics.featureEnvelopeModelVersion === 'feature-envelope-v1'),
    'tight neck recovery should use feature-envelope structure-area semantics',
  );
}
if (tightNeckZones.length === 1) {
  assert(
    tightNeckZones.every((zone) => Number(zone.majorAxisM) / Math.max(1, Number(zone.minorAxisM)) <= 3.4),
    'tight neck envelope should not render as a pencil-line stroke',
  );
}

const fallbackZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
  { allowUniversalFallback: true },
).zones;
assertZoneSemanticIds(fallbackZones, 'universal fallback');
assert(fallbackZones.some((zone) => zone.featureClass === 'universal'), 'universal zones should appear when feature zones are below minimum');
assert(
  fallbackZones.every((zone) => zone.featureClass !== 'universal' || zone.qaFlags.includes('universal_fallback_zone')),
  'universal fallback zones should be explicitly flagged',
);
const transitionCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 5, 15)), geojson: fixture.geojson },
);
const transitionCoveLegend = buildWaterReaderLegend(transitionCoveResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 5, 15)) });
assertHonestCoveLegend(transitionCoveResult.zones, transitionCoveLegend, 'transition cove legend');
assert(
  transitionCoveLegend.every((entry) => !entry.transitionWarning || entry.body.length > 0),
  'transition cove legend should remain conservative under feature-envelope semantics',
);
assertNoForbiddenLegendCopy(transitionCoveLegend);

const transitionNeckResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [neck],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 5, 15)), geojson: fixture.geojson },
);
const transitionNeckLegend = buildWaterReaderLegend(transitionNeckResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 5, 15)) });
assert(
  transitionNeckLegend.every((entry) => !entry.transitionWarning),
  'transition warning should not appear for stable neck placements',
);

const transitionSaddleResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [fakeSaddle('transition-saddle', bottomMid, topMid)],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 5, 15)), geojson: fixture.geojson },
);
const transitionSaddleLegend = buildWaterReaderLegend(transitionSaddleResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 5, 15)) });
assert(
  transitionSaddleLegend.every((entry) => !entry.transitionWarning),
  'transition warning should not appear for stable saddle placements',
);

const transitionDamResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [fakeDam('transition-dam', bottomMid, rightMid)],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 5, 15)), geojson: fixture.geojson },
);
const transitionDamLegend = buildWaterReaderLegend(transitionDamResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 5, 15)) });
assert(
  transitionDamLegend.every((entry) => !entry.transitionWarning),
  'transition warning should not appear for stable dam placements',
);
assertNoForbiddenLegendCopy([...transitionNeckLegend, ...transitionSaddleLegend, ...transitionDamLegend]);

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

function fakeDam(featureId: string, cornerA: PointM, cornerB: PointM) {
  return {
    featureId,
    featureClass: 'dam' as const,
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

function cloneZonesWithPrefix<T extends { zoneId: string; sourceFeatureId: string }>(zones: T[], prefix: string): T[] {
  return zones.map((zone, index) => ({
    ...zone,
    zoneId: `${prefix}-zone-${index + 1}`,
    sourceFeatureId: `${prefix}-${zone.sourceFeatureId}`,
  }));
}

function translatedZoneClone<T extends {
  zoneId: string;
  sourceFeatureId: string;
  anchor: PointM;
  ovalCenter: PointM;
  visibleWaterRing: PointM[];
  unclippedRing: PointM[];
}>(zone: T, prefix: string, dx: number, dy: number): T {
  const shift = (point: PointM): PointM => ({ x: point.x + dx, y: point.y + dy });
  return {
    ...zone,
    zoneId: `${prefix}-zone-1`,
    sourceFeatureId: `${prefix}-${zone.sourceFeatureId}`,
    anchor: shift(zone.anchor),
    ovalCenter: shift(zone.ovalCenter),
    visibleWaterRing: zone.visibleWaterRing.map(shift),
    unclippedRing: zone.unclippedRing.map(shift),
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

function normalizeVector(vector: PointM): PointM {
  const length = Math.hypot(vector.x, vector.y) || 1;
  return { x: vector.x / length, y: vector.y / length };
}

function approx(actual: number, expected: number, tolerance: number): boolean {
  return Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
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

function assertLegendShape(entries: ReturnType<typeof buildWaterReaderLegend>): void {
  for (const entry of entries) {
    assert(typeof entry.number === 'number' && entry.number >= 1, 'legend entry should have a number');
    assert(typeof entry.title === 'string' && entry.title.length > 0, 'legend entry should have a title');
    assert(typeof entry.body === 'string' && entry.body.length > 0, 'legend entry should have a body');
    assert(typeof entry.colorHex === 'string' && /^#[0-9A-F]{6}$/i.test(entry.colorHex), 'legend entry should have a hex color');
    assert(typeof entry.templateId === 'string' && entry.templateId.length > 0, 'legend entry should have template identity');
  }
}

function assertNoForbiddenLegendCopy(entries: ReturnType<typeof buildWaterReaderLegend>): void {
  for (const entry of entries) {
    const hits = waterReaderLegendForbiddenPhraseHits([entry.title, entry.body, entry.transitionWarning ?? ''].join(' '));
    assert(hits.length === 0, `legend copy should not contain forbidden phrases: ${hits.join(', ')}`);
  }
}

function assertDisplayLegendAlignment(model: ReturnType<typeof buildWaterReaderDisplayModel>): void {
  assert(model.displayLegendEntries.length === model.displayedEntries.length, 'display legend entries should match displayed entries');
  for (const [index, entry] of model.displayedEntries.entries()) {
    assert(entry.displayNumber === index + 1, 'display entries should be numbered 1..N');
    assert(entry.legend, 'displayed entry should carry a display-aligned legend entry');
    assert(entry.legend.number === entry.displayNumber, 'displayed entry legend number should match display number');
    assert(model.displayLegendEntries[index]?.number === entry.displayNumber, 'display legend should be ordered by display number');
    assert(model.displayLegendEntries[index]?.entryId === entry.entryId, 'display legend entry should reference the displayed entry id');
  }
  assert(model.retainedEntries.every((entry) => entry.displayNumber === null && !entry.legend), 'retained entries should not carry user-facing display legend rows');
}

function assertStandaloneEntriesHaveOneZone(model: ReturnType<typeof buildWaterReaderDisplayModel>): void {
  const entries = [...model.displayedEntries, ...model.retainedEntries];
  assert(
    entries.every((entry) => entry.entryType !== 'standalone_zone' || (entry.zoneIds.length === 1 && entry.zones.length === 1)),
    'every standalone display entry should represent exactly one raw zone',
  );
}

function noSourceFeatureSplitAcrossDisplayAndRetained(model: ReturnType<typeof buildWaterReaderDisplayModel>): boolean {
  const displayed = new Set(model.displayedEntries.flatMap((entry) => entry.sourceFeatureIds));
  const retained = new Set(model.retainedEntries.flatMap((entry) => entry.sourceFeatureIds));
  return [...displayed].every((sourceFeatureId) => !retained.has(sourceFeatureId)) && model.splitSourceFeatureCount === 0;
}

function sourceFeaturesAreAllDisplayedOrAllRetained(
  model: ReturnType<typeof buildWaterReaderDisplayModel>,
  rawZones: Array<{ sourceFeatureId: string; zoneId: string }>,
): boolean {
  const displayed = new Map<string, Set<string>>();
  const retained = new Map<string, Set<string>>();
  for (const entry of model.displayedEntries) {
    for (const zone of entry.zones) {
      const zones = displayed.get(zone.sourceFeatureId) ?? new Set<string>();
      zones.add(zone.zoneId);
      displayed.set(zone.sourceFeatureId, zones);
    }
  }
  for (const entry of model.retainedEntries) {
    for (const zone of entry.zones) {
      const zones = retained.get(zone.sourceFeatureId) ?? new Set<string>();
      zones.add(zone.zoneId);
      retained.set(zone.sourceFeatureId, zones);
    }
  }
  for (const sourceFeatureId of new Set(rawZones.map((zone) => zone.sourceFeatureId))) {
    const rawCount = rawZones.filter((zone) => zone.sourceFeatureId === sourceFeatureId).length;
    const displayedCount = displayed.get(sourceFeatureId)?.size ?? 0;
    const retainedCount = retained.get(sourceFeatureId)?.size ?? 0;
    if (displayedCount > 0 && displayedCount !== rawCount) return false;
    if (retainedCount > 0 && retainedCount !== rawCount) return false;
    if (displayedCount > 0 && retainedCount > 0) return false;
  }
  return true;
}

function displaySignature(model: ReturnType<typeof buildWaterReaderDisplayModel>) {
  return model.displayedEntries.map((entry) => ({
    entryId: entry.entryId,
    displayNumber: entry.displayNumber,
    displayState: entry.displayState,
    zoneIds: entry.zoneIds,
  }));
}

function assertProductionSvg(model: ReturnType<typeof buildWaterReaderDisplayModel>, label: string): void {
  const result = buildWaterReaderProductionSvg(model, {
    lakePolygon: fixture.polygonM,
    title: `Smoke ${label}`,
    subtitle: 'Smoke review',
  });
  const repeated = buildWaterReaderProductionSvg(model, {
    lakePolygon: fixture.polygonM,
    title: `Smoke ${label}`,
    subtitle: 'Smoke review',
  });
  assert(result.svg.length > 500, 'production SVG should be nonblank');
  assert(result.svg.includes('<svg') && result.svg.includes('viewBox='), 'production SVG should include a viewBox');
  assert(result.svg.includes('water-reader-lake'), 'production SVG should include lake geometry');
  assert(result.svg.includes('<clipPath') && result.svg.includes('clip-path='), 'production SVG should include lake clipping behavior');
  assert(
    result.summary.mapBottomY + 20 <= result.summary.firstLegendRowY,
    'rendered map geometry and labels should stay above the first legend row',
  );
  assert(countMatches(result.svg, 'class="water-reader-map-number') === model.displayLegendEntries.length, 'rendered number count should equal display legend entry count');
  assert(countMatches(result.svg, 'class="water-reader-display-legend-entry"') === model.displayLegendEntries.length, 'display legend entry count should render exactly');
  assert(!result.svg.includes('visible-fraction') && !result.svg.includes('candidate') && !result.svg.includes('structureConfluenceGroupId'), 'production SVG should not include debug cue labels');
  assertNoForbiddenLegendCopy(model.displayLegendEntries);
  for (const entry of model.retainedEntries) {
    assert(!result.svg.includes(`data-entry-id="${entry.entryId}"`), 'retained entries should not render in production SVG');
  }
  for (const entry of model.displayedEntries.filter((item) => item.entryType === 'structure_confluence')) {
    assert(countMatches(result.svg, `data-entry-id="${entry.entryId}"`) >= 2, 'confluence should render as one grouped entry with one label');
    assert(countMatches(result.svg, `data-display-number="${entry.displayNumber}"`) >= 2, 'confluence should have one map number and one legend number');
    const crossFeaturePair = entry.confluenceGroup?.crossFeatureOverlapPair ??
      entry.zones.map((zone) => zone.diagnostics.crossFeatureOverlapPair).find((pair): pair is string => typeof pair === 'string' && pair.length > 0);
    if (crossFeaturePair) {
      assert(result.svg.includes(`data-render-mode="member-shapes" data-member-zone-count="${entry.zoneIds.length}"`), 'cross-feature confluence should render exact member shapes');
      for (const zoneId of entry.zoneIds) {
        assert(result.svg.includes(`data-zone-id="${zoneId}"`), 'cross-feature confluence member zones should render with their own shape paths');
      }
    } else {
      assert(result.svg.includes(`data-render-mode="unified-envelope" data-member-zone-count="${entry.zoneIds.length}"`), 'non-cross-feature grouped entry should use unified fallback envelope');
    }
  }
  for (const entry of model.displayedEntries.filter((item) => item.entryType === 'standalone_zone')) {
    const zone = entry.zones[0];
    if (!zone) continue;
    if (zone.diagnostics.featureEnvelopeRenderShape === 'merged_point_lobes') {
      assert(result.svg.includes(`data-entry-id="${entry.entryId}"`) && result.svg.includes('data-render-mode="merged-point-lobes"'), 'whole-point envelope should render through merged point lobes');
    }
    if (zone.diagnostics.featureEnvelopeRenderShape === 'rounded_point_apron') {
      assert(result.svg.includes(`data-entry-id="${entry.entryId}"`) && result.svg.includes('data-render-mode="point-shoreline-buffer"'), 'whole-point envelope should render through shoreline buffer');
      assert(result.svg.includes('data-point-apron-stroke-width-px='), 'whole-point shoreline buffer should expose rendered stroke width');
    }
    if (zone.diagnostics.featureEnvelopeRenderShape === 'shoreline_cove_polygon') {
      assert(result.svg.includes(`data-entry-id="${entry.entryId}"`) && result.svg.includes('data-render-mode="shoreline-cove-polygon"'), 'whole-cove envelope should render through shoreline cove polygon');
    }
    if (zone.diagnostics.featureEnvelopeRenderShape === 'paired_shoulder_lobes') {
      assert(result.svg.includes(`data-entry-id="${entry.entryId}"`) && result.svg.includes('data-render-mode="paired-shoulder-lobes"'), 'neck/saddle envelope should render through paired shoulder lobes');
    }
    if (zone.placementKind === 'island_structure_area') {
      assert(result.svg.includes(`data-entry-id="${entry.entryId}"`) && result.svg.includes('data-render-mode="island-centered-envelope"'), 'island structure area should render as an island-centered envelope');
    }
  }
  assert(result.summary.stackedConfluenceMemberRenderCount === 0, 'renderer summary should report no stacked confluence member renders');
  assert(
    (result.summary.renderedUnifiedConfluenceCount ?? 0) === model.displayedEntries.filter((item) => item.entryType === 'structure_confluence').length,
    'renderer summary should count each confluence as a unified envelope',
  );
  assert(result.svg === repeated.svg, 'production SVG output should be deterministic');
  assert(result.summary.retainedRenderedCount === 0, 'retained entries rendered count should be zero');
  assert(result.summary.renderedNumberCount === model.displayLegendEntries.length, 'renderer summary number count should align');
  assert(result.summary.calloutLabelCount >= 0, 'renderer summary should include callout label count');
  assertPointShorelineBufferGroups(result.svg);

  const mobile = buildWaterReaderProductionSvg(model, {
    lakePolygon: fixture.polygonM,
    title: `Smoke ${label}`,
    subtitle: 'Smoke review',
    mapWidth: 420,
  });
  assert(mobile.summary.renderedNumberCount === model.displayLegendEntries.length, 'mobile rendered number count should equal display legend entry count');
  assert(mobile.summary.retainedRenderedCount === 0, 'mobile retained entries rendered count should be zero');
  assert(mobile.summary.calloutLabelCount >= 0, 'mobile renderer summary should include callout label count');
  const unexpectedMobileWarnings = mobile.warnings.filter((warning) => warning.code !== 'legend_overflow_risk' && warning.code !== 'long_label_leader');
  assert(
    unexpectedMobileWarnings.length === 0,
    `mobile production SVG should not warn for valid input except layout warnings: ${unexpectedMobileWarnings.map((warning) => warning.code).join(', ')}`,
  );
  const longLegendText = [...mobile.svg.matchAll(/<g class="water-reader-display-legend-entry"[\s\S]*?<\/g>/g)]
    .flatMap((match) => [...match[0].matchAll(/<text[^>]*>([^<]+)<\/text>/g)].map((textMatch) => textMatch[1] ?? ''))
    .filter((text) => text.length > 60);
  assert(longLegendText.length === 0, `mobile legend text lines should stay within 60 chars: ${longLegendText.join(' | ')}`);
  assertPointShorelineBufferGroups(mobile.svg);
}

function countMatches(value: string, needle: string): number {
  return value.split(needle).length - 1;
}

function assertPointShorelineBufferGroups(svg: string): void {
  const groups = [...svg.matchAll(/<g class="[^"]*water-reader-point-shoreline-buffer[^"]*"[\s\S]*?<\/g>/g)].map((match) => match[0]);
  for (const group of groups) {
    assert(countMatches(group, '<path ') === 1, 'point shoreline buffer group should render exactly one wide zone stroke path');
    assert(!group.includes('stroke-opacity="0.78"'), 'point shoreline buffer group should not render a high-opacity internal edge stroke');
  }
}
