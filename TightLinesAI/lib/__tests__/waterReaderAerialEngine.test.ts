/**
 * Assertion harness for aerial engine primitives (run: `npx tsx lib/__tests__/waterReaderAerialEngine.test.ts`).
 * Not wired to a global test runner — see `package.json` (no unified `test` script for app lib yet).
 */

import assert from 'node:assert/strict';

import {
  WR_AERIAL_ONLY_RESULT_CONTRACT_ID,
  WR_POLICY_USGS_TNM_NAIP_PLUS_NATIONAL,
  WR_REGISTRY_USGS_TNM_NAIP_PLUS,
  type WaterReaderAerialOnlyReadResult,
} from '../waterReaderResultContracts';
import type {
  WaterbodyAerialGeometryCandidateRow,
  WaterbodyPreviewBbox,
} from '../waterReaderContracts';
import type {
  AerialTilePlanLikeForProxy,
  WaterReaderAerialEngineFeatureTag,
  WaterReaderAerialRawCandidateInput,
} from '../waterReaderAerialEngine';
import {
  AERIAL_ONLY_ENGINE_STANDARD_LIMITATIONS,
  WR_GEOMETRY_RPC_GRID_BASE_SCORE_CAP,
  WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP,
  WR_TILE_PLAN_PROXY_BASE_SCORE,
  WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION,
  buildAerialProxyCandidatesFromTilePlan,
  buildWaterReaderAerialOnlyGeometryResultFromCandidateRows,
  buildWaterReaderAerialOnlyProxyResultFromTilePlan,
  buildWaterReaderAerialOnlyResultFromCandidates,
  buildDeterministicZoneExplanation,
  getWaterReaderAerialMonthWeight,
  inferWaterReaderAerialCandidateSource,
  makeOverlayRectAroundAnchor01,
  mapEngineFeatureTagToReasonCode,
  mapFinalScoreAndMonthToZoneConfidence,
  mapZonesToOverallReadConfidence,
  normalizeCalendarMonth,
  selectWaterReaderAerialCandidates,
  toAerialTilePlanLikeFromClientTilePlan,
  waterReaderAerialGeometryRowsToRawCandidates,
} from '../waterReaderAerialEngine';
import { planAerialReadTiles } from '../waterReaderAerialTilePlan';
import { USGS_TNM_ATTRIBUTION } from '../usgsTnmAerialSnapshot';

const tags: readonly WaterReaderAerialEngineFeatureTag[] = [
  'point_protrusion',
  'cove_pocket',
  'neckdown_constriction',
  'island_inside_turn',
  'shoreline_complexity',
  'coverage_distribution',
  'tile_bbox_proxy_anchor',
];

const TEST_WATERBODY = {
  lakeId: 'wr-engine-test-id',
  name: 'Engine Test Reservoir',
  state: 'MI',
  county: 'Oakland',
  waterbodyType: 'reservoir' as const,
};

export function assertNoDepthVocabulary(reasonText: string): void {
  const banned = [/depth\b/i, /\bbathym/i, /\bcontour/i];
  for (const re of banned) {
    assert.equal(re.test(reasonText), false, `unexpected term in "${reasonText}"`);
  }
}

function rawInput(
  id: string,
  anchor: { x: number; y: number },
  baseScore: number,
  featureTag: WaterReaderAerialEngineFeatureTag,
  overlay = { w: 0.08, h: 0.08 },
): WaterReaderAerialRawCandidateInput {
  return {
    id,
    anchor,
    overlayWidthFrac: overlay.w,
    overlayHeightFrac: overlay.h,
    featureTag,
    baseScore,
  };
}

function assertExplanationSafe(explanation: string | undefined): void {
  assert.ok(explanation && explanation.length > 0);
  assert.doesNotMatch(explanation, /\bplaceholder\b/i);
  assert.doesNotMatch(explanation, /\blayout exploration\b/i);
  assert.match(explanation, /\bno depth charts, bathymetry, or contours\b/i);
  assert.doesNotMatch(explanation, /\b(?:we|you)\s+will\s+catch\b/i);
  assert.doesNotMatch(explanation, /\bguaranteed?\s+(?:catch|bite|fish)\b/i);
  assert.doesNotMatch(explanation, /\bai\b/i);
  assert.doesNotMatch(explanation, /\bmodel\b/i);
}

/** Tile-plan proxy copy avoids implying inferred shoreline geometry from polygons (still deterministic templates). */
function assertTilePlanProxyExplanationSafe(explanation: string | undefined): void {
  assert.ok(explanation && explanation.length > 0);
  assert.match(explanation, /tile-plan anchor placement/i);
  assert.match(explanation, /\bno depth charts, bathymetry, or contours\b/i);
  assert.doesNotMatch(explanation, /\bai\b/i);
  assert.doesNotMatch(explanation, /\bpublic\s+access\b|\btrespass\b/i);
}

function assertAerialReadResultGuards(result: WaterReaderAerialOnlyReadResult): void {
  const blob = JSON.stringify(result);
  assert.doesNotMatch(blob, /"confidence":"high"/);
  assert.doesNotMatch(blob, /\bpublic access\b/i);
  assert.doesNotMatch(blob, /\bdepth structure\b/i);
}

function run(): void {
  assert.deepEqual(getWaterReaderAerialMonthWeight(1), {
    month: 1,
    multiplier: 0.88,
    confidenceBias: 'winter_low',
  });
  assert.deepEqual(getWaterReaderAerialMonthWeight(5), {
    month: 5,
    multiplier: 0.98,
    confidenceBias: 'standard',
  });
  assert.deepEqual(getWaterReaderAerialMonthWeight(6), {
    month: 6,
    multiplier: 1.0,
    confidenceBias: 'standard',
  });
  assert.deepEqual(getWaterReaderAerialMonthWeight(12), {
    month: 12,
    multiplier: 0.88,
    confidenceBias: 'winter_low',
  });

  assert.equal(normalizeCalendarMonth(Number.NaN), 6);
  assert.equal(normalizeCalendarMonth(0), 12);
  assert.equal(normalizeCalendarMonth(13), 1);

  assert.equal(inferWaterReaderAerialCandidateSource({ featureTag: 'point_protrusion' }), 'geometry_candidate');
  assert.equal(
    inferWaterReaderAerialCandidateSource({ featureTag: 'tile_bbox_proxy_anchor' }),
    'tile_plan_proxy',
  );

  for (let i = -20; i < 60; i += 1) {
    const zone = mapFinalScoreAndMonthToZoneConfidence(i * 0.01, i * 0.01);
    assert.ok(zone === 'low' || zone === 'moderate');
  }
  assert.equal(mapZonesToOverallReadConfidence(['low', 'low', 'low', 'moderate'], 1), 'low');
  assert.equal(mapZonesToOverallReadConfidence(['moderate', 'moderate', 'moderate'], 0.96), 'moderate');

  const anchored = makeOverlayRectAroundAnchor01(0.99, 0.98, 0.25, 0.3);
  assert.ok(anchored.x + anchored.w <= 1 + 1e-9);
  assert.ok(anchored.y + anchored.h <= 1 + 1e-9);
  assert.ok(anchored.x >= 0 && anchored.y >= 0);

  const deepTermRe = /\b(depth|deep|deepwater|deep water|deep-water|deeply)\b|\bbathym/i;
  for (const tag of tags) {
    assertNoDepthVocabulary(mapEngineFeatureTagToReasonCode(tag));
    assert.deepEqual(deepTermRe.test(mapEngineFeatureTagToReasonCode(tag)), false);
  }

  const exp = buildDeterministicZoneExplanation({
    featureTag: 'point_protrusion',
    month: 4,
    reasonCode: 'shoreline_area_geometry_context',
    confidence: 'low',
  });
  assert.doesNotMatch(exp, /placeholder/i);
  assert.doesNotMatch(exp, /layout exploration/i);
  assert.match(exp, /\bno depth charts, bathymetry, or contours\b/i);
  assert.match(exp, /Selected from coarse polygon\/grid sampling/i);
  assert.match(exp, /coarse_geometry_grid/i);
  assert.match(exp, /not final starting-area detection/i);
  assert.doesNotMatch(exp, /\b(?:we|you)\s+will\s+catch\b/i);
  assert.doesNotMatch(exp, /\bguaranteed?\s+(?:catch|bite|fish)\b/i);

  const june = 6;
  const spread: WaterReaderAerialRawCandidateInput[] = [];
  for (let i = 0; i < 7; i += 1) {
    const t = i / 10;
    spread.push(
      rawInput(`z${String(i)}`, { x: t, y: 1 - t }, 0.5 + i * 0.05, 'point_protrusion'),
    );
  }
  const cap5 = selectWaterReaderAerialCandidates(spread, june, { maxZones: 5, minZones: 3 });
  assert.equal(cap5.selected.length, 5);
  assert.equal(cap5.shortfall, false);
  assert.ok(cap5.selected[0].scores.final >= cap5.selected[4].scores.final);
  cap5.selected.forEach((c) => assert.equal(c.candidateSource, 'geometry_candidate'));

  const cluster = selectWaterReaderAerialCandidates(
    [
      rawInput('high', { x: 0.5, y: 0.5 }, 0.95, 'cove_pocket'),
      rawInput('lowdup', { x: 0.5, y: 0.5 }, 0.94, 'cove_pocket'),
    ],
    june,
    { separationThresholdNormalized: 0.15, maxZones: 5, minZones: 2 },
  );
  assert.equal(cluster.selected.length, 1);
  assert.equal(cluster.selected[0]?.id, 'high');

  const duplicateBaseOrder = selectWaterReaderAerialCandidates(
    [
      rawInput('aaa', { x: 0.5, y: 0.5 }, 0.8, 'cove_pocket'),
      rawInput('zzz', { x: 0.5, y: 0.5 }, 0.95, 'cove_pocket'),
    ],
    june,
    { separationThresholdNormalized: 0.1, maxZones: 5, minZones: 1 },
  );
  assert.equal(duplicateBaseOrder.selected.length, 1);
  assert.equal(duplicateBaseOrder.selected[0]?.id, 'zzz');
  assert.ok(duplicateBaseOrder.selected[0].scores.base > 0.85);

  const nearDupCluster = selectWaterReaderAerialCandidates(
    [
      rawInput('top', { x: 0.5, y: 0.5 }, 0.99, 'point_protrusion'),
      rawInput('mid', { x: 0.502, y: 0.5 }, 0.9, 'point_protrusion'),
      rawInput('low', { x: 0.5, y: 0.502 }, 0.5, 'point_protrusion'),
    ],
    june,
    { separationThresholdNormalized: 0.08, maxZones: 5, minZones: 1 },
  );
  assert.equal(nearDupCluster.selected.length, 1);
  assert.equal(nearDupCluster.selected[0]?.id, 'top');

  const tieFar = selectWaterReaderAerialCandidates(
    [
      rawInput('n', { x: 0.02, y: 0.98 }, 0.82, 'point_protrusion'),
      rawInput('m', { x: 0.98, y: 0.02 }, 0.82, 'point_protrusion'),
    ],
    june,
    { separationThresholdNormalized: 0.08, maxZones: 5, minZones: 2 },
  );
  assert.equal(tieFar.selected.length, 2);
  assert.deepEqual(tieFar.selected.map((z) => z.id), ['m', 'n']);

  const shortfall = selectWaterReaderAerialCandidates([rawInput('only', { x: 0.3, y: 0.3 }, 0.66, 'neckdown_constriction')], june, {
    maxZones: 5,
    minZones: 3,
  });
  assert.equal(shortfall.selected.length, 1);
  assert.equal(shortfall.shortfall, true);
  assert.ok(shortfall.warnings.some((w) => w.code === 'MIN_ZONES_SHORTFALL'));

  const mappedRead = buildWaterReaderAerialOnlyResultFromCandidates({
    waterbody: TEST_WATERBODY,
    selectedCandidates: cap5.selected,
    monthInput: june,
    generatedAtIso: '2026-04-13T15:00:00.000Z',
  });
  assert.equal(mappedRead.ok, true);
  if (!mappedRead.ok) throw new Error('expected contract map');
  const read = mappedRead.result;
  assert.deepEqual(read.waterbody, TEST_WATERBODY);
  assert.equal(read.generatedAt, '2026-04-13T15:00:00.000Z');
  assert.equal(read.contractId, WR_AERIAL_ONLY_RESULT_CONTRACT_ID);
  assert.deepEqual(read.imagerySource, {
    sourceRegistryId: WR_REGISTRY_USGS_TNM_NAIP_PLUS,
    aerialPolicyKey: WR_POLICY_USGS_TNM_NAIP_PLUS_NATIONAL,
  });
  assert.equal(read.attribution, USGS_TNM_ATTRIBUTION);
  assert.deepEqual(read.limitations, AERIAL_ONLY_ENGINE_STANDARD_LIMITATIONS);
  assert.equal(read.zones.length, 5);
  assert.ok(read.overallConfidence === 'low' || read.overallConfidence === 'moderate');
  assert.ok(!('enginePlaceholder' in read) || read.enginePlaceholder === undefined);
  const limJoined = read.limitations.join(' ');
  assert.match(limJoined, /depth charts.*bathymetry.*contour/i);
  assert.match(limJoined, /orthophoto|imagery labeling|vision-model/i);
  assert.match(limJoined, /public\/private shoreline access/i);
  assert.match(limJoined, /exact fish GPS/i);
  assert.match(limJoined, /never high/i);
  read.zones.forEach((zone, ix) => {
    assert.deepEqual(zone.overlayRect, cap5.selected[ix].overlayRect);
    assert.equal(zone.reasonCode, cap5.selected[ix].reasonCode);
    assert.equal(zone.humanExplanation, cap5.selected[ix].deterministicExplanation);
    assertExplanationSafe(zone.humanExplanation);
    assert.deepEqual(zone.evidence, {
      geometryBackedCue: true,
      visibleImageryHypothesisUsed: false,
      depthEvidenceUsed: false,
      bathymetryEvidenceUsed: false,
    });
  });
  assertAerialReadResultGuards(read);

  const twoCand = selectWaterReaderAerialCandidates(
    [
      rawInput('x', { x: 0.11, y: 0.11 }, 0.9, 'point_protrusion'),
      rawInput('y', { x: 0.89, y: 0.89 }, 0.85, 'cove_pocket'),
    ],
    june,
    { separationThresholdNormalized: 0.08, maxZones: 5, minZones: 1 },
  );
  assert.equal(twoCand.selected.length, 2);
  assert.deepEqual(
    buildWaterReaderAerialOnlyResultFromCandidates({
      waterbody: TEST_WATERBODY,
      selectedCandidates: twoCand.selected,
      monthInput: june,
    }),
    { ok: false, reason: 'INSUFFICIENT_CANDIDATES' },
  );

  const sixCand = [...cap5.selected, { ...cap5.selected[cap5.selected.length - 1], id: 'extra-sixth-slot' }];
  assert.deepEqual(
    buildWaterReaderAerialOnlyResultFromCandidates({
      waterbody: TEST_WATERBODY,
      selectedCandidates: sixCand,
      monthInput: june,
    }),
    { ok: false, reason: 'INVALID_ZONE_COUNT' },
  );

  for (const z of [
    ...cap5.selected,
    ...tieFar.selected,
    ...shortfall.selected,
    ...cluster.selected,
    ...duplicateBaseOrder.selected,
    ...nearDupCluster.selected,
  ]) {
    assert.ok(z.confidence === 'low' || z.confidence === 'moderate');
    assertExplanationSafe(z.deterministicExplanation);
  }

  function sampleSpreadTilePlan(): AerialTilePlanLikeForProxy {
    const contextBbox = { minLon: -90, minLat: 40, maxLon: -89, maxLat: 41 };
    const tiles: { id: number; bbox: WaterbodyPreviewBbox }[] = [];
    for (let row = 0; row < 3; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const id = row * 3 + col + 1;
        const lonLo = -90 + col / 3;
        const latLo = 40 + row / 3;
        tiles.push({
          id,
          bbox: {
            minLon: lonLo + 0.005,
            minLat: latLo + 0.005,
            maxLon: lonLo + 0.325,
            maxLat: latLo + 0.325,
          },
        });
      }
    }
    return { contextBbox, tiles };
  }

  const proxyOnce = buildAerialProxyCandidatesFromTilePlan(sampleSpreadTilePlan());
  const proxyTwice = buildAerialProxyCandidatesFromTilePlan(sampleSpreadTilePlan());
  assert.equal(JSON.stringify(proxyOnce.rawCandidates), JSON.stringify(proxyTwice.rawCandidates));
  assert.equal(proxyOnce.warnings[0]?.code, 'TILE_PLAN_PROXY_NO_POLYGON_GEOMETRY');

  assert.deepEqual(buildAerialProxyCandidatesFromTilePlan({ contextBbox: sampleSpreadTilePlan().contextBbox, tiles: [] }).rawCandidates, []);

  for (const r of proxyOnce.rawCandidates) {
    assert.ok(r.baseScore <= WR_TILE_PLAN_PROXY_BASE_SCORE + 1e-9);
    assert.equal(r.featureTag, 'tile_bbox_proxy_anchor');
    assert.equal(r.explanationAnchorKind, 'tile_plan_proxy');
    assert.equal(r.candidateSource, 'tile_plan_proxy');
    assert.equal(inferWaterReaderAerialCandidateSource(r), 'tile_plan_proxy');
  }

  const proxySel = selectWaterReaderAerialCandidates(proxyOnce.rawCandidates, 6, { maxZones: 5, minZones: 3 });
  assert.equal(proxySel.selected.length, 5);
  assert.equal(proxySel.shortfall, false);
  proxySel.selected.forEach((z) => {
    assert.ok(z.scores.base <= WR_TILE_PLAN_PROXY_BASE_SCORE + 1e-9);
    assertTilePlanProxyExplanationSafe(z.deterministicExplanation);
    assert.equal(z.reasonCode, 'visible_boundary_context_uncertain');
    assert.equal(z.candidateSource, 'tile_plan_proxy');
  });

  const proxyRead = buildWaterReaderAerialOnlyResultFromCandidates({
    waterbody: TEST_WATERBODY,
    selectedCandidates: proxySel.selected,
    monthInput: 6,
    generatedAtIso: '2026-04-27T12:00:00.000Z',
  });
  assert.equal(proxyRead.ok, true);
  if (!proxyRead.ok) throw new Error('proxy read');
  const pr = proxyRead.result;
  assert.ok(pr.limitations.includes(WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION));
  assert.equal(
    pr.limitations.filter((l) => l === WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION).length,
    1,
  );
  assert.deepEqual(
    pr.limitations.slice(0, AERIAL_ONLY_ENGINE_STANDARD_LIMITATIONS.length),
    [...AERIAL_ONLY_ENGINE_STANDARD_LIMITATIONS],
  );
  pr.zones.forEach((z) => {
    assert.equal(z.evidence.geometryBackedCue, false);
    assertTilePlanProxyExplanationSafe(z.humanExplanation);
  });
  assertAerialReadResultGuards(pr);

  const mixedRead = buildWaterReaderAerialOnlyResultFromCandidates({
    waterbody: TEST_WATERBODY,
    selectedCandidates: [
      ...cap5.selected.slice(0, 3),
      ...proxySel.selected.slice(0, 2),
    ],
    monthInput: 6,
    generatedAtIso: '2026-04-27T12:01:00.000Z',
  });
  assert.equal(mixedRead.ok, true);
  if (!mixedRead.ok) throw new Error('mixed read');
  const mr = mixedRead.result;
  assert.equal(mr.zones.length, 5);
  assert.ok(mr.limitations.includes(WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION));
  assert.equal(mr.zones[0].evidence.geometryBackedCue, true);
  assert.equal(mr.zones[1].evidence.geometryBackedCue, true);
  assert.equal(mr.zones[2].evidence.geometryBackedCue, true);
  assert.equal(mr.zones[3]!.evidence.geometryBackedCue, false);
  assert.equal(mr.zones[4]!.evidence.geometryBackedCue, false);

  const dupLim = buildWaterReaderAerialOnlyResultFromCandidates({
    waterbody: TEST_WATERBODY,
    selectedCandidates: proxySel.selected,
    monthInput: 6,
    additionalLimitations: [WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION, 'Extra note for QA.'],
  });
  assert.equal(dupLim.ok, true);
  if (!dupLim.ok) throw new Error('dup lim');
  assert.equal(
    dupLim.result.limitations.filter((l) => l === WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION).length,
    1,
  );
  assert.ok(dupLim.result.limitations.some((l) => l === 'Extra note for QA.'));

  const orchOk = buildWaterReaderAerialOnlyProxyResultFromTilePlan({
    waterbody: TEST_WATERBODY,
    tilePlan: sampleSpreadTilePlan(),
    monthInput: 6,
    generatedAtIso: '2026-05-01T00:00:00.000Z',
  });
  assert.equal(orchOk.ok, true);
  if (!orchOk.ok) throw new Error('orchestration expected ok');
  assert.equal(orchOk.selectedCount, 5);
  assert.equal(orchOk.result.zones.length, 5);
  assert.ok(orchOk.result.limitations.includes(WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION));
  assert.equal(orchOk.result.overallConfidence, 'low');
  orchOk.result.zones.forEach((z) => assert.equal(z.evidence.geometryBackedCue, false));
  assert.ok(orchOk.warnings.some((w) => w.code === 'TILE_PLAN_PROXY_NO_POLYGON_GEOMETRY'));
  assertAerialReadResultGuards(orchOk.result);

  const orchEmpty = buildWaterReaderAerialOnlyProxyResultFromTilePlan({
    waterbody: TEST_WATERBODY,
    tilePlan: { contextBbox: sampleSpreadTilePlan().contextBbox, tiles: [] },
    monthInput: 6,
  });
  assert.equal(orchEmpty.ok, false);
  if (orchEmpty.ok) throw new Error('expected empty tile plan failure');
  assert.equal(orchEmpty.reason, 'NO_PROXY_RAW_CANDIDATES');
  assert.equal(orchEmpty.selectedCount, 0);

  const ctxOnly = sampleSpreadTilePlan().contextBbox;
  const orchShort = buildWaterReaderAerialOnlyProxyResultFromTilePlan({
    waterbody: TEST_WATERBODY,
    tilePlan: {
      contextBbox: ctxOnly,
      tiles: [{ id: 1, bbox: { ...ctxOnly } }],
    },
    monthInput: 6,
  });
  assert.equal(orchShort.ok, false);
  if (orchShort.ok) throw new Error('expected shortfall failure');
  assert.equal(orchShort.reason, 'INSUFFICIENT_ZONES_AFTER_SELECTION');
  assert.equal(orchShort.selectedCount, 1);

  /** Fixture shaped like staging smoke (Lake Mary MN–style): geometry-backed rows only — no Edge fetch. */
  function lakeMaryLikeGeometryCandidateRows(): WaterbodyAerialGeometryCandidateRow[] {
    const lakeId = '11111111-2222-4333-8444-555555555555';
    const contextBbox = {
      minLon: -95.42,
      minLat: 46.08,
      maxLon: -95.18,
      maxLat: 46.27,
    };
    const anchors: readonly [number, number][] = [
      [0.08, 0.92],
      [0.28, 0.72],
      [0.48, 0.52],
      [0.68, 0.32],
      [0.88, 0.12],
    ];
    return anchors.map(([normalizedAnchorX, normalizedAnchorY], i) => ({
      lakeId,
      name: 'Lake Mary',
      state: 'MN',
      county: 'Douglas',
      waterbodyType: 'lake',
      contextBbox,
      candidateId: i + 1,
      featureTag: 'shoreline_complexity',
      candidateSource: 'geometry_candidate',
      reasonCode: 'shoreline_area_geometry_context',
      anchorLon: -95.28 + i * 0.02,
      anchorLat: 46.15 + i * 0.02,
      normalizedAnchorX,
      normalizedAnchorY,
      overlayX: Math.max(0, normalizedAnchorX - 0.045),
      overlayY: Math.max(0, normalizedAnchorY - 0.045),
      overlayW: 0.09,
      overlayH: 0.09,
      baseScore: 0.52 + i * 0.01,
      geometryQa: { geometry_valid: true, bbox_fallback: false },
      requestedMonth: 6,
    }));
  }

  const lmRows = lakeMaryLikeGeometryCandidateRows();
  const lmRaw = waterReaderAerialGeometryRowsToRawCandidates(lmRows);
  assert.equal(lmRaw.length, 5);
  lmRaw.forEach((r) => {
    assert.equal(r.candidateSource, 'geometry_candidate');
    assert.equal(r.explanationAnchorKind, 'geometry_feature');
    assert.equal(inferWaterReaderAerialCandidateSource(r), 'geometry_candidate');
    assert.ok(r.overlayWidthFrac <= WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP + 1e-12);
    assert.ok(r.overlayHeightFrac <= WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP + 1e-12);
    assert.ok(r.baseScore <= WR_GEOMETRY_RPC_GRID_BASE_SCORE_CAP + 1e-12);
  });

  const hugeRows = lmRows.map((r) => ({
    ...r,
    overlayW: 0.96,
    overlayH: 0.91,
    baseScore: 0.95,
  }));
  const rawHuge = waterReaderAerialGeometryRowsToRawCandidates(hugeRows);
  assert.equal(rawHuge.length, 5);
  rawHuge.forEach((r) => {
    assert.equal(r.overlayWidthFrac, WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP);
    assert.equal(r.overlayHeightFrac, WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP);
    assert.equal(r.baseScore, WR_GEOMETRY_RPC_GRID_BASE_SCORE_CAP);
  });

  const geomRead = buildWaterReaderAerialOnlyGeometryResultFromCandidateRows({
    rows: lmRows,
    monthInput: 6,
    generatedAtIso: '2026-06-01T18:00:00.000Z',
  });
  assert.equal(geomRead.ok, true);
  if (!geomRead.ok) throw new Error('geometry orchestration expected ok');
  assert.equal(geomRead.selectedCount, 5);
  const gr = geomRead.result;
  assert.equal(gr.zones.length, 5);
  assert.ok(!('enginePlaceholder' in gr) || gr.enginePlaceholder === undefined);
  assert.ok(!gr.limitations.some((l) => l === WR_TILE_PLAN_PROXY_NO_POLYGON_LIMITATION));
  assert.equal(gr.overallConfidence, 'low');
  gr.zones.forEach((z) => {
    assert.equal(z.confidence, 'low');
    assert.ok(z.overlayRect.w <= WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP + 1e-9);
    assert.ok(z.overlayRect.h <= WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP + 1e-9);
    assert.doesNotMatch(z.label, /complexity segment/i);
    assert.equal(z.label, 'Coarse grid window (preview)');
    assert.match(z.humanExplanation, /coarse polygon\/grid sampling/i);
    assert.match(z.humanExplanation, /coarse_geometry_grid/i);
    assert.equal(z.evidence.geometryBackedCue, true);
    assert.equal(z.evidence.visibleImageryHypothesisUsed, false);
    assert.equal(z.evidence.depthEvidenceUsed, false);
    assert.equal(z.evidence.bathymetryEvidenceUsed, false);
  });
  assertAerialReadResultGuards(gr);

  const geomReadHuge = buildWaterReaderAerialOnlyGeometryResultFromCandidateRows({
    rows: hugeRows,
    monthInput: 6,
    generatedAtIso: '2026-06-01T18:00:00.000Z',
  });
  assert.equal(geomReadHuge.ok, true);
  if (!geomReadHuge.ok) throw new Error('huge overlay orchestration expected ok');
  geomReadHuge.result.zones.forEach((z) => {
    assert.ok(z.overlayRect.w <= WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP + 1e-9);
    assert.ok(z.overlayRect.h <= WR_GEOMETRY_RPC_GRID_OVERLAY_FRAC_CAP + 1e-9);
  });

  const geomTooFew = buildWaterReaderAerialOnlyGeometryResultFromCandidateRows({
    rows: lmRows.slice(0, 2),
    monthInput: 6,
  });
  assert.equal(geomTooFew.ok, false);
  if (geomTooFew.ok) throw new Error('expected insufficient geometry rows');
  assert.equal(geomTooFew.reason, 'INSUFFICIENT_GEOMETRY_CANDIDATE_ROWS');

  const planned = planAerialReadTiles({
    previewBbox: { minLon: -84.52, minLat: 42.48, maxLon: -84.38, maxLat: 42.62 },
    centroid: { lat: 42.55, lon: -84.45 },
    surfaceAreaAcres: 220,
  });
  assert.ok(planned !== null);
  const likeFromPlan = toAerialTilePlanLikeFromClientTilePlan(planned);
  const fromPlanA = buildAerialProxyCandidatesFromTilePlan(likeFromPlan);
  const fromPlanB = buildAerialProxyCandidatesFromTilePlan(likeFromPlan);
  assert.equal(JSON.stringify(fromPlanA.rawCandidates), JSON.stringify(fromPlanB.rawCandidates));

  console.log('waterReaderAerialEngine tests passed');
}

run();
