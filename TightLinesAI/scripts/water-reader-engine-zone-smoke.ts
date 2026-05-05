import {
  WATER_READER_FEATURE_COLORS,
  WATER_READER_ZONE_PLACEMENT_KINDS,
  buildWaterReaderDisplayModel,
  buildWaterReaderLegend,
  buildWaterReaderProductionSvg,
  materializeZoneDraft,
  placeWaterReaderZones,
  preprocessWaterReaderGeometry,
  waterReaderLegendForbiddenPhraseHits,
  waterReaderLegendTemplateCoverage,
  type PointM,
  type PolygonM,
  type WaterReaderCoveFeature,
  type WaterReaderDetectedFeature,
  type WaterReaderIslandFeature,
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
assertZoneSemanticIds(neckZones, 'neck');
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
assertZoneSemanticIds(pointZones, 'point');
assert(pointZone, 'point feature should create a zone');
assert(pointZone.visibleWaterFraction <= 0.75, 'point zone visible fraction should be <= 0.75');
assert(pointZone.visibleWaterRing.length > 0, 'point zone should touch visible water');

const farBackPoint = fakePoint('far-point', topMid, fixture.polygonM.exterior[3]!, fixture.polygonM.exterior[2]!);
const farBackSpringZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 4, 1)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assertZoneSemanticIds(farBackSpringZones, 'spring point');
assert(farBackSpringZones.length === 2, 'spring point should create two side zones');
const farBackPointSideSlopeLength = (
  distance(farBackPoint.tip, farBackPoint.leftSlope) +
  distance(farBackPoint.tip, farBackPoint.rightSlope)
) / 2;
const expectedPointSideNatural = Math.max(farBackPoint.protrusionLengthM * 1.05, farBackPointSideSlopeLength * 0.6);
assert(
  farBackSpringZones.every((zone) => approx(Number(zone.diagnostics.sizeNaturalMajorAxisM), expectedPointSideNatural, 0.1)),
  'main-lake point side sizing should use calibrated protrusion/side-slope formula',
);
assert(
  farBackSpringZones.every((zone) => approx(Number(zone.diagnostics.sizeMinClampM), fixture.longestDimensionM * 0.065, 0.1)),
  'small-lake point side sizing should use 6.5% L minimum',
);
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
assertZoneSemanticIds(farBackSummerZones, 'summer point');
assert(farBackSummerZones.some((zone) => zone.placementKind === 'main_point_tip'), 'summer point should create a tip zone');
assert(farBackSummerZones.some((zone) => zone.placementKind === 'main_point_open_water'), 'summer point should create an open-water-side zone');
const summerOpenWaterZone = farBackSummerZones.find((zone) => zone.placementKind === 'main_point_open_water');
assert(
  summerOpenWaterZone?.diagnostics.openWaterSideMethod === 'deterministic_area_sampling',
  'summer point open-water side should run deterministic area sampling',
);
assert(
  Number(summerOpenWaterZone?.diagnostics.openWaterSideTotalWaterSampleCount ?? 0) > 0,
  'summer point open-water sampling should find nearby water samples',
);
assert(
  summerOpenWaterZone?.diagnostics.openWaterSideResolved !== true || summerOpenWaterZone.anchorSemanticId === 'main_point_open_water_area',
  'resolved summer point open-water side should use area-comparison semantics',
);
const summerTipZone = farBackSummerZones.find((zone) => zone.placementKind === 'main_point_tip');
assert(
  summerTipZone?.diagnostics.pointTipPlacementMode === 'tip_centered' || summerTipZone?.diagnostics.pointTipPlacementMode === 'tip_near',
  'summer point-tip should select a tip-centered or tip-near oval when valid',
);
const expectedPointTipNatural = Math.max(farBackPoint.protrusionLengthM * 0.65, farBackPointSideSlopeLength * 0.35);
assert(
  summerTipZone && approx(Number(summerTipZone.diagnostics.sizeNaturalMajorAxisM), expectedPointTipNatural, 0.1),
  'main-lake point tip sizing should use calibrated tip formula',
);
assert(
  farBackSummerZones.every((zone) => Number(zone.diagnostics.distanceFromTipM) <= distance(topMid, fixture.polygonM.exterior[3]!)),
  'summer point zones should remain point-adjacent',
);

const largeLakePointZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 2500, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assert(
  largeLakePointZones.every((zone) => zone.diagnostics.pointZoneLakeSizeBand === 'large'),
  'large-lake point zones should carry large lake-size-band diagnostics',
);
assert(
  largeLakePointZones.every((zone) => Number(zone.diagnostics.sizeMinClampM) >= fixture.longestDimensionM * 0.04 - 0.1),
  'large-lake point side/open-water sizing should use 4.0% L minimum',
);

const farBackWinterZones = placeWaterReaderZones(
  preprocessShell(fixture),
  [farBackPoint],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
).zones.filter((zone) => zone.featureClass === 'main_lake_point');
assertZoneSemanticIds(farBackWinterZones, 'winter point');
assert(farBackWinterZones.length === 1, `winter point should create one open-water-side zone, got ${farBackWinterZones.length}`);
assert(farBackWinterZones[0]?.placementKind === 'main_point_open_water', 'winter point should use open-water-side placement');
assert(farBackWinterZones[0]?.diagnostics.openWaterSideMethod === 'deterministic_area_sampling', 'winter point open-water placement should run deterministic area sampling');
assert(
  Number(farBackWinterZones[0]?.diagnostics.openWaterSideTotalWaterSampleCount ?? 0) > 0,
  'winter point open-water sampling should find nearby water samples',
);
assert(
  farBackWinterZones[0]?.diagnostics.openWaterSideResolved !== true || farBackWinterZones[0]?.anchorSemanticId === 'main_point_open_water_area',
  'resolved winter point open-water placement should expose area-comparison semantic id',
);
assertHonestOpenWaterLegend(
  farBackWinterZones,
  buildWaterReaderLegend(
    placeWaterReaderZones(preprocessShell(fixture), [farBackPoint], { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson }),
    { state: 'MI', currentDate: new Date(Date.UTC(2026, 0, 15)) },
  ),
  'winter point open-water legend',
);

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
assert(coveZone.visibleWaterFraction <= 0.75, 'cove zone visible fraction should be <= 0.75');
assert(coveZone.visibleWaterRing.length > 0, 'cove zone should touch visible water');
assert(Number(coveZone.diagnostics.candidateCount) >= 30, 'cove placement should evaluate adaptive offset/size candidates');
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
assert(springCoveResult.zones.some((zone) => zone.placementKind === 'cove_back'), 'spring cove should zone the back of cove');
assertZoneSemanticIds(springCoveResult.zones, 'spring cove');
assert(
  springCoveResult.zones.every((zone) =>
    zone.placementKind !== 'cove_back' ||
    zone.placementSemanticId === 'cove_back_primary' ||
    zone.placementSemanticId === 'cove_back_pocket_recovery'
  ),
  'spring cove back zones should expose cove back primary or pocket-recovery placement semantic id',
);
const summerCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 6, 15)), geojson: fixture.geojson },
);
assert(summerCoveResult.zones.some((zone) => zone.placementKind === 'cove_mouth'), 'summer cove should zone the mouth shoulder');
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
assert(fallCoveResult.zones.some((zone) => zone.placementKind === 'cove_irregular_side'), 'fall cove should zone the irregular side');
assertZoneSemanticIds(fallCoveResult.zones, 'fall cove');
assertHonestCoveLegend(fallCoveResult.zones, buildWaterReaderLegend(fallCoveResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 9, 1)) }), 'fall cove legend');
const winterCoveResult = placeWaterReaderZones(
  preprocessShell(fixture),
  [seasonalCove],
  { state: 'MI', acreage: 80, currentDate: new Date(Date.UTC(2026, 0, 15)), geojson: fixture.geojson },
);
assert(winterCoveResult.zones.some((zone) => zone.placementKind === 'cove_mouth'), 'winter cove should use a conservative cove-mouth transition zone');
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
const springIslandZones = springIslandResult.zones.filter((zone) => zone.featureClass === 'island' && zone.placementKind === 'island_mainland');
assertZoneSemanticIds(springIslandZones, 'spring island');
assert(
  springIslandZones.every((zone) => zone.anchorSemanticId === 'island_mainland_primary' || zone.anchorSemanticId?.includes('recovery')),
  'spring island mainland placement should expose true mainland or recovery semantics',
);
assertHonestIslandMainlandLegend(
  springIslandResult.zones,
  buildWaterReaderLegend(springIslandResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 3)) }),
  'spring island mainland legend',
);
const fallIslandResult = placeWaterReaderZones(
  islandPreprocess,
  [islandFeature],
  { state: 'MI', acreage: 140, currentDate: new Date(Date.UTC(2026, 9, 15)), geojson: islandGeojson },
);
const fallIslandZones = fallIslandResult.zones.filter((zone) => zone.featureClass === 'island' && zone.placementKind === 'island_endpoint');
assert(fallIslandZones.length === 2, `fall island should produce two endpoint zones, got ${fallIslandZones.length}`);
assert(
  new Set(fallIslandZones.map((zone) => zone.anchorSemanticId)).has('island_endpoint_a') &&
    new Set(fallIslandZones.map((zone) => zone.anchorSemanticId)).has('island_endpoint_b'),
  'fall island endpoint zones should expose endpoint A and endpoint B semantics',
);
assert(
  fallIslandZones.every((zone) => !['island_open_water_proxy', 'island_open_water_area', 'island_mainland_primary', 'island_mainland_recovery', 'island_open_water_recovery'].includes(zone.anchorSemanticId ?? '')),
  'fall island endpoints should not use mainland/open-water semantics',
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
  [0, 2].includes(overlapZones.filter((zone) => zone.sourceFeatureId === 'neck-1').length),
  'neck feature should return exactly two valid zones or none, never one',
);
assert(
  overlapZones.some((zone) => zone.diagnostics.structureConfluenceGroupId),
  'overlapping valid structures should be diagnosed as a structure confluence',
);
const confluenceLegend = buildWaterReaderLegend(overlapResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 1)) });
assertHonestCoveLegend(overlapResult.zones, confluenceLegend, 'confluence legend');
assertLegendShape(confluenceLegend);
assert(
  confluenceLegend.filter((entry) => entry.isConfluence).length === overlapResult.diagnostics.confluenceGroupCount,
  'confluence output should create one legend entry per confluence group',
);
assert(
  confluenceLegend.some((entry) => entry.isConfluence && entry.colorHex === WATER_READER_FEATURE_COLORS.structure_confluence),
  'confluence legend entries should use the confluence color',
);
assert(
  confluenceLegend.filter((entry) => entry.isConfluence).every((entry) => !entry.title.includes('Point Point')),
  'confluence titles should not duplicate point wording',
);
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
assert(
  transitionConfluenceLegend.some((entry) => entry.isConfluence && entry.transitionWarning),
  'confluence transition warnings should be based on actual member zone feature/placement pairs',
);
assertNoForbiddenLegendCopy(transitionConfluenceLegend);

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
      memberPlacementKinds: ['neck_shoulder'],
    }],
  },
}, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 1)) });
const duplicateNeckConfluenceTitle = duplicateNeckConfluenceLegend.find((entry) => entry.isConfluence)?.title ?? '';
assert(
  duplicateNeckConfluenceTitle.includes('Neck Shoulder x2'),
  'duplicate same-kind confluence members should be represented with a count',
);
assertNoForbiddenLegendCopy(duplicateNeckConfluenceLegend);

const combinedCapResult = {
  ...neckResult,
  zones: [
    ...cloneZonesWithPrefix(neckResult.zones, 'cap-neck'),
    ...cloneZonesWithPrefix(coveResult.zones, 'cap-cove'),
    ...cloneZonesWithPrefix(farBackSummerZones, 'cap-point'),
    ...cloneZonesWithPrefix(farBackSpringZones, 'cap-spring-point'),
    ...cloneZonesWithPrefix(fallCoveResult.zones, 'cap-fall-cove'),
  ],
  diagnostics: {
    ...neckResult.diagnostics,
    confluenceGroupCount: 0,
    confluenceGroups: [],
    zoneCount: neckResult.zones.length + coveResult.zones.length + farBackSummerZones.length + farBackSpringZones.length + fallCoveResult.zones.length,
    featureCoverage: [],
  },
};
const combinedCapLegend = buildWaterReaderLegend(combinedCapResult, { state: 'MI', currentDate: new Date(Date.UTC(2026, 4, 1)) });
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
assert([0, 2].includes(tightNeckZones.length), 'paired neck recovery should keep exactly two shoulders or suppress the pair');
if (tightNeckZones.length === 2) {
  assert(
    tightNeckZones.every((zone) => zone.qaFlags.includes('constriction_minor_axis_width_capped')),
    'tight neck shoulder zones should apply the local-width minor-axis cap',
  );
  assert(
    tightNeckZones.every((zone) => Number(zone.diagnostics.minorAxisToFeatureWidthRatio) <= 0.85 + 0.001),
    'neck minor axis should not exceed 85% of local constriction width',
  );
}
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
  transitionCoveLegend.some((entry) => entry.transitionWarning),
  'transition warning should appear near a MI/North boundary for placement-changing structure',
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

function midpoint(a: PointM, b: PointM): PointM {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function lerp(a: PointM, b: PointM, t: number): PointM {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function distance(a: PointM, b: PointM): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
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
  }
  assert(result.svg === repeated.svg, 'production SVG output should be deterministic');
  assert(result.summary.retainedRenderedCount === 0, 'retained entries rendered count should be zero');
  assert(result.summary.renderedNumberCount === model.displayLegendEntries.length, 'renderer summary number count should align');
  assert(result.summary.calloutLabelCount >= 0, 'renderer summary should include callout label count');

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
}

function countMatches(value: string, needle: string): number {
  return value.split(needle).length - 1;
}
