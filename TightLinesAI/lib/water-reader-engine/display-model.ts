import type { PointM, PolygonM, RingM, WaterReaderFeatureClass, WaterReaderLegendEntry } from './contracts';
import { WATER_READER_FEATURE_COLORS } from './legend';
import { distanceM } from './metrics';
import type {
  WaterReaderFeatureZoneCoverage,
  WaterReaderPlacedZone,
  WaterReaderStructureConfluenceGroup,
  WaterReaderZonePlacementKind,
  WaterReaderZonePlacementSemanticId,
  WaterReaderZonePlacementResult,
} from './zones/types';
import { visibleZoneCap } from './zones/priority';

export type WaterReaderDisplayEntryType = 'standalone_zone' | 'structure_confluence' | 'neck_area';

export type WaterReaderDisplayReadabilityTier = 'readable' | 'borderline_tiny' | 'hard_tiny';

export type WaterReaderDisplayState =
  | 'displayed_standalone'
  | 'displayed_confluence'
  | 'displayed_neck_area'
  | 'retained_not_displayed_cap'
  | 'retained_not_displayed_diversity'
  | 'retained_not_displayed_readability'
  | 'suppressed_invalid_geometry'
  | 'suppressed_failed_invariants'
  | 'suppressed_dependency';

export type WaterReaderDisplayModelOptions = {
  acreage?: number | null;
  longestDimensionM?: number | null;
  lakePolygon?: PolygonM | null;
  appMapWidth?: number | null;
  renderPadding?: number | null;
};

type RetainedDisplayState = Extract<
  WaterReaderDisplayState,
  'retained_not_displayed_cap' | 'retained_not_displayed_diversity' | 'retained_not_displayed_readability'
>;

const DIVERSITY_RETENTION_DIAGNOSTICS = new Set([
  'retained_repeated_title_diversity',
  'retained_title_diversity_rebalance',
  'retained_feature_family_diversity_rebalance',
]);

const READABILITY_RETENTION_DIAGNOSTIC = 'retained_constriction_line_readability';
const QUESTIONABLE_CONSTRICTION_RETENTION_DIAGNOSTIC = 'retained_questionable_constriction';
const TINY_CONSTRICTION_RETENTION_DIAGNOSTIC = 'retained_tiny_constriction_display_readability';

export interface WaterReaderDisplayReadabilityDiagnostics {
  estimatedAppFootprintWidthPx: number;
  estimatedAppFootprintHeightPx: number;
  estimatedAppFootprintAreaPx: number;
  estimatedAppFootprintMinDimensionPx: number;
  estimatedAppFootprintMaxDimensionPx: number;
  displayReadabilityTier: WaterReaderDisplayReadabilityTier;
}

export interface WaterReaderDisplayZoneGeometry {
  zoneId: string;
  sourceFeatureId: string;
  featureClass: WaterReaderFeatureClass;
  placementKind: WaterReaderZonePlacementKind;
  placementSemanticId?: WaterReaderZonePlacementSemanticId;
  anchorSemanticId?: WaterReaderZonePlacementSemanticId;
  anchor: PointM;
  center: PointM;
  majorAxisM: number;
  majorAxisPctOfLakeLongestDimension: number | null;
  minorAxisM: number;
  rotationRad: number;
  visibleWaterFraction: number;
  visibleWaterRing: RingM;
  unclippedRing: RingM;
  colorHex: string;
  qaFlags: string[];
  diagnostics: Record<string, number | string | boolean | string[] | null>;
}

export interface WaterReaderDisplayEntry {
  entryId: string;
  entryType: WaterReaderDisplayEntryType;
  displayState: WaterReaderDisplayState;
  displayNumber: number | null;
  zoneIds: string[];
  sourceFeatureIds: string[];
  featureClasses: WaterReaderFeatureClass[];
  placementKinds: WaterReaderZonePlacementKind[];
  confluenceGroupId?: string;
  confluenceStrength?: WaterReaderStructureConfluenceGroup['strength'];
  legendEntryId?: string;
  legendTemplateId?: string;
  legend?: WaterReaderLegendEntry;
  colorHex: string;
  transitionWarning?: string;
  zones: WaterReaderDisplayZoneGeometry[];
  majorAxisM: number;
  majorAxisPctOfLakeLongestDimension: number | null;
  displayReadability: WaterReaderDisplayReadabilityDiagnostics;
  rankingDiagnostics: string[];
  sort: {
    priority: number;
    readabilityRank: number;
    displayUsefulnessScore: number;
    confluenceStrengthRank: number;
    score: number;
    seasonalRelevanceScore: number;
    majorAxisM: number;
    stableSourceFeatureId: string;
    stableZoneId: string;
    stableId: string;
  };
}

export interface WaterReaderSuppressedDisplayEntry {
  entryId: string;
  displayState: Exclude<WaterReaderDisplayState, 'displayed_standalone' | 'displayed_confluence' | 'displayed_neck_area' | 'retained_not_displayed_cap' | 'retained_not_displayed_diversity' | 'retained_not_displayed_readability'>;
  sourceFeatureId: string;
  featureClass: WaterReaderFeatureClass;
  reason: string;
}

export interface WaterReaderDisplayModel {
  displayCap: number;
  capExceeded: boolean;
  displayedEntries: WaterReaderDisplayEntry[];
  displayLegendEntries: WaterReaderLegendEntry[];
  retainedEntries: WaterReaderDisplayEntry[];
  suppressedEntries: WaterReaderSuppressedDisplayEntry[];
  rawLegendEntries: WaterReaderLegendEntry[];
  rawZones: WaterReaderPlacedZone[];
  confluenceGroups: WaterReaderStructureConfluenceGroup[];
  splitSourceFeatureCount: number;
  splitSourceFeatureIds: string[];
  displaySelectionUnits: WaterReaderDisplaySelectionUnitDiagnostic[];
  multiZoneStandaloneEntryViolationCount: number;
  summary: {
    displayedEntryCount: number;
    displayedStandaloneCount: number;
    displayedConfluenceCount: number;
    displayLegendEntryCount: number;
    retainedNotDisplayedCount: number;
    suppressedInvalidGeometryCount: number;
    suppressedFailedInvariantsCount: number;
    suppressedDependencyCount: number;
    rawZoneCount: number;
    confluenceGroupCount: number;
    splitSourceFeatureCount: number;
    multiZoneStandaloneEntryViolationCount: number;
  };
}

export interface WaterReaderDisplaySelectionUnitDiagnostic {
  unitId: string;
  entryType: WaterReaderDisplayEntryType;
  entryCost: number;
  displayState: 'displayed' | 'retained_not_displayed_cap' | 'retained_not_displayed_diversity' | 'retained_not_displayed_readability';
  zoneIds: string[];
  sourceFeatureIds: string[];
  featureClasses: WaterReaderFeatureClass[];
  placementKinds: WaterReaderZonePlacementKind[];
  confluenceGroupId?: string;
  priority: number;
  readabilityRank: number;
  displayUsefulnessScore: number;
  seasonalRelevanceScore: number;
  displayReadability: WaterReaderDisplayReadabilityDiagnostics;
  score: number;
  majorAxisM: number;
  rankingDiagnostics: string[];
}

type DisplayUnit = {
  unitId: string;
  entryType: WaterReaderDisplayEntryType;
  zones: WaterReaderPlacedZone[];
  confluenceGroup?: WaterReaderStructureConfluenceGroup;
  entryCost: number;
  sort: WaterReaderDisplayEntry['sort'];
  displayReadability: WaterReaderDisplayReadabilityDiagnostics;
  rankingDiagnostics: string[];
};

type ConfluenceNormalizationCandidate = {
  targetId: string;
  sourceId: string;
  reason: string;
  envelopeMajorAxisM: number;
  envelopeRatio: number;
  crossFeatureOverlapPair?: string;
  crossFeatureOverlapFraction?: number;
  crossFeatureContainmentFraction?: number;
};

type ConstrictionDisplayClass =
  | 'clear_neck'
  | 'display_saddle'
  | 'channel_pinch'
  | 'one_sided_pinch_review'
  | 'broad_saddle'
  | 'retained_questionable_constriction';

type ConstrictionRecoveryReason =
  | 'high_confidence_clear_neck'
  | 'high_confidence_channel_pinch'
  | 'high_confidence_one_sided_pinch'
  | 'high_confidence_readable_broad_saddle';

type ConstrictionDisplayClassification = {
  displayClass: ConstrictionDisplayClass;
  recoveryReason?: ConstrictionRecoveryReason;
  saddleRecovery?: boolean;
};

type ConstrictionDisplaySubtype = {
  subtype: 'neck' | 'pinch';
  reason?: 'narrow_width_ratio' | 'channel_pinch' | 'one_sided_channel_like' | 'compact_two_sided_channel';
};

const FEATURE_PRIORITY: Record<WaterReaderFeatureClass, number> = {
  dam: 1,
  neck: 2,
  main_lake_point: 3,
  saddle: 4,
  island: 5,
  cove: 6,
  secondary_point: 7,
  universal: 8,
};
const DEFAULT_APP_MAP_WIDTH = 420;
const DEFAULT_RENDER_PADDING = 28;
const HARD_TINY_MIN_DIMENSION_PX = 6;
const HARD_TINY_AREA_PX = 100;
const BORDERLINE_TINY_MAX_DIMENSION_PX = 12;
const COVE_POINT_VISIBLE_RING_DISTANCE_CAP_M = 450;
const COVE_POINT_SAME_SHORELINE_CORRIDOR_CAP_M = 1200;

export function buildWaterReaderDisplayModel(
  zoneResult: WaterReaderZonePlacementResult,
  legend: WaterReaderLegendEntry[],
  options: WaterReaderDisplayModelOptions = {},
): WaterReaderDisplayModel {
  const displayCap = visibleZoneCap(options.acreage);
  const legendByEntryId = new Map<string, WaterReaderLegendEntry>();
  const legendByZoneId = new Map<string, WaterReaderLegendEntry>();
  for (const entry of legend) {
    if (entry.entryId) legendByEntryId.set(entry.entryId, entry);
    legendByZoneId.set(entry.zoneId, entry);
  }

  const units = withConstrictionDisplayClasses(withDisplayReadability(buildDisplayUnits(zoneResult), options));
  const sortedUnits = [...units].sort(compareDisplayUnits);
  const totalDisplayCost = sortedUnits.reduce((sum, unit) => sum + unit.entryCost, 0);
  const initialSelection = totalDisplayCost <= displayCap
    ? { displayedUnits: sortedUnits, retainedUnits: [] }
    : selectOverCapDisplayUnits({
      sortedUnits,
      displayCap,
      legendByEntryId,
      legendByZoneId,
    });
  const normalizedSelection = normalizeDisplayedConfluences(initialSelection, zoneResult.season, displayCap);
  const saddleFilteredSelection = retainQuestionableConfluenceSaddleMembers(normalizedSelection, zoneResult.season);
  const readabilitySelection = retainConstrictionLineFallbacksForReadability(saddleFilteredSelection, displayCap, totalDisplayCost > displayCap);
  const constrictionSelection = retainQuestionableConstrictions(readabilitySelection);
  const recoveredSelection = recoverRetainedConstrictions(constrictionSelection, displayCap);
  const tinyConstrictionSelection = retainLowReadabilityStandaloneConstrictions(recoveredSelection);
  const selection = retainRepeatedTitleDiversity({
    ...tinyConstrictionSelection,
    displayCap,
    legendByEntryId,
    legendByZoneId,
  });
  const islandBackfilledSelection = backfillReadableIslands(selection, displayCap);
  const balancedSelection = rebalanceNonPointOverExcessMainPoint(islandBackfilledSelection, displayCap);
  const displayedUnits = balancedSelection.displayedUnits;
  const retainedUnits = balancedSelection.retainedUnits;

  const displayedEntriesWithoutNumbers = displayedUnits.flatMap((unit) =>
    displayEntriesForUnit(unit, legendByEntryId, legendByZoneId, options.longestDimensionM),
  );
  const displayedEntries = displayedEntriesWithoutNumbers.map((entry, index) => {
    const displayNumber = index + 1;
    const legendEntry = entry.legend
      ? displayLegendForEntry(entry, entry.legend, displayNumber)
      : undefined;
    return {
      ...entry,
      displayNumber,
      legend: legendEntry,
      legendEntryId: legendEntry?.entryId ?? legendEntry?.zoneId ?? entry.legendEntryId,
      legendTemplateId: legendEntry?.templateId ?? entry.legendTemplateId,
      transitionWarning: legendEntry?.transitionWarning,
    };
  });
  const retainedEntries = retainedUnits.flatMap((unit) =>
    displayEntriesForUnit(unit, legendByEntryId, legendByZoneId, options.longestDimensionM),
  ).map((entry) => ({
    ...entry,
    displayState: retainedDisplayState(entry.rankingDiagnostics),
    displayNumber: null,
    legend: undefined,
    legendEntryId: entry.legendEntryId,
    legendTemplateId: entry.legendTemplateId,
  }));
  const displayLegendEntries = displayedEntries
    .flatMap((entry) => entry.legend ? [entry.legend] : [])
    .sort((a, b) => (a.number ?? 0) - (b.number ?? 0));

  const displayedIds = new Set(displayedEntries.map((entry) => entry.entryId));
  const retainedIds = new Set(retainedEntries.map((entry) => entry.entryId));
  const suppressedEntries = zoneResult.diagnostics.featureCoverage
    .filter((coverage) => !coverage.producedVisibleZones)
    .map(suppressedEntryFromCoverage)
    .filter((entry) => !displayedIds.has(entry.entryId) && !retainedIds.has(entry.entryId));
  const splitSourceFeatureIds = splitSourceFeatures(displayedEntries, retainedEntries);
  const multiZoneStandaloneEntryViolationCount = [...displayedEntries, ...retainedEntries]
    .filter((entry) => entry.entryType === 'standalone_zone' && entry.zoneIds.length !== 1)
    .length;
  const displaySelectionUnits = [
    ...displayedUnits.map((unit) => selectionUnitDiagnostic(unit, 'displayed' as const)),
    ...retainedUnits.map((unit) => selectionUnitDiagnostic(
      unit,
      retainedDisplayState(unit.rankingDiagnostics),
    )),
  ];

  const summary = {
    displayedEntryCount: displayedEntries.length,
    displayedStandaloneCount: displayedEntries.filter((entry) => entry.displayState === 'displayed_standalone').length,
    displayedConfluenceCount: displayedEntries.filter((entry) => entry.displayState === 'displayed_confluence').length,
    displayLegendEntryCount: displayLegendEntries.length,
    retainedNotDisplayedCount: retainedEntries.length,
    suppressedInvalidGeometryCount: suppressedEntries.filter((entry) => entry.displayState === 'suppressed_invalid_geometry').length,
    suppressedFailedInvariantsCount: suppressedEntries.filter((entry) => entry.displayState === 'suppressed_failed_invariants').length,
    suppressedDependencyCount: suppressedEntries.filter((entry) => entry.displayState === 'suppressed_dependency').length,
    rawZoneCount: zoneResult.zones.length,
    confluenceGroupCount: zoneResult.diagnostics.confluenceGroupCount,
    splitSourceFeatureCount: splitSourceFeatureIds.length,
    multiZoneStandaloneEntryViolationCount,
  };

  return {
    displayCap,
    capExceeded: retainedEntries.some((entry) => retainedDisplayState(entry.rankingDiagnostics) === 'retained_not_displayed_cap'),
    displayedEntries,
    displayLegendEntries,
    retainedEntries,
    suppressedEntries,
    rawLegendEntries: legend,
    rawZones: zoneResult.zones,
    confluenceGroups: zoneResult.diagnostics.confluenceGroups,
    splitSourceFeatureCount: splitSourceFeatureIds.length,
    splitSourceFeatureIds,
    displaySelectionUnits,
    multiZoneStandaloneEntryViolationCount,
    summary,
  };
}

export function retainedDisplayState(rankingDiagnostics: string[]): RetainedDisplayState {
  if (rankingDiagnostics.includes(QUESTIONABLE_CONSTRICTION_RETENTION_DIAGNOSTIC)) return 'retained_not_displayed_readability';
  if (rankingDiagnostics.includes(READABILITY_RETENTION_DIAGNOSTIC)) return 'retained_not_displayed_readability';
  if (rankingDiagnostics.includes(TINY_CONSTRICTION_RETENTION_DIAGNOSTIC)) return 'retained_not_displayed_readability';
  if (rankingDiagnostics.some((diagnostic) => DIVERSITY_RETENTION_DIAGNOSTICS.has(diagnostic))) return 'retained_not_displayed_diversity';
  return 'retained_not_displayed_cap';
}

function retainRepeatedTitleDiversity(params: {
  displayedUnits: DisplayUnit[];
  retainedUnits: DisplayUnit[];
  displayCap: number;
  legendByEntryId: Map<string, WaterReaderLegendEntry>;
  legendByZoneId: Map<string, WaterReaderLegendEntry>;
}): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  const displayedCost = params.displayedUnits.reduce((sum, unit) => sum + unit.entryCost, 0);
  if (displayedCost < params.displayCap) return params;
  const maxPerTitle = repeatedLegendTitleMax(params.displayCap);
  if (params.displayedUnits.length <= maxPerTitle + 1) return params;
  let displayedUnits = [...params.displayedUnits];
  const retainedForDiversity: DisplayUnit[] = [];
  let changed = true;
  while (changed) {
    changed = false;
    const titleCounts = countUnitTitles(displayedUnits, params.legendByEntryId, params.legendByZoneId);
    const dominant = [...titleCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
    if (!dominant || dominant[1] <= maxPerTitle) break;
    const [dominantTitle] = dominant;
    const duplicateCandidates = displayedUnits
      .filter((unit) => {
        const titles = unitDiversityKeys(unit, params.legendByEntryId, params.legendByZoneId);
        return titles.length > 0 && titles.every((title) => title === dominantTitle);
      })
      .sort((a, b) =>
        a.sort.displayUsefulnessScore - b.sort.displayUsefulnessScore ||
        a.sort.score - b.sort.score ||
        compareDisplayUnits(b, a)
      );
    const demoted = duplicateCandidates[0];
    if (!demoted) break;
    displayedUnits = displayedUnits.filter((unit) => unit.unitId !== demoted.unitId);
    retainedForDiversity.push(annotateUnitZones(demoted, {
      retainedRepeatedTitleDiversity: true,
      retainedRepeatedTitle: dominantTitle,
    }, 'retained_repeated_title_diversity'));
    changed = true;
  }
  if (retainedForDiversity.length === 0) return params;
  return {
    displayedUnits: displayedUnits.sort(compareDisplayUnits),
    retainedUnits: [...params.retainedUnits, ...retainedForDiversity].sort(compareDisplayUnits),
  };
}

function backfillReadableIslands(
  params: { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] },
  displayCap: number,
): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  let displayedUnits = [...params.displayedUnits];
  let retainedUnits = [...params.retainedUnits];
  let remainingCap = displayCap - displayedUnits.reduce((sum, unit) => sum + unit.entryCost, 0);
  if (remainingCap <= 0 || retainedUnits.length === 0) return params;
  const candidates = retainedUnits
    .filter((unit) =>
      unitPrimaryFeatureClass(unit) === 'island' &&
      unit.displayReadability.displayReadabilityTier !== 'hard_tiny'
    )
    .sort((a, b) =>
      b.sort.displayUsefulnessScore - a.sort.displayUsefulnessScore ||
      b.sort.score - a.sort.score ||
      compareDisplayUnits(a, b)
    );
  for (const candidate of candidates) {
    if (candidate.entryCost > remainingCap) continue;
    displayedUnits.push(annotateUnitZones(candidate, {
      islandDisplayBackfillUsed: true,
      islandDisplayBackfillReason: 'unused_display_cap_after_structure_selection',
    }, 'displayed_island_backfill_unused_cap'));
    retainedUnits = retainedUnits.filter((unit) => unit.unitId !== candidate.unitId);
    remainingCap -= candidate.entryCost;
    if (remainingCap <= 0) break;
  }
  return {
    displayedUnits: displayedUnits.sort(compareDisplayUnits),
    retainedUnits: retainedUnits.sort(compareDisplayUnits),
  };
}

function rebalanceNonPointOverExcessMainPoint(
  params: { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] },
  displayCap: number,
): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  const displayedMainPoints = params.displayedUnits.filter((unit) => unitPrimaryFeatureClass(unit) === 'main_lake_point');
  if (displayedMainPoints.length < 4) return params;
  const promoted = params.retainedUnits
    .filter((unit) =>
      unitPrimaryFeatureClass(unit) !== 'main_lake_point' &&
      retainedDisplayState(unit.rankingDiagnostics) !== 'retained_not_displayed_readability'
    )
    .sort(compareDisplayUnits)[0];
  if (!promoted) return params;

  const demoted = [...displayedMainPoints]
    .sort((a, b) =>
      a.sort.displayUsefulnessScore - b.sort.displayUsefulnessScore ||
      a.sort.score - b.sort.score ||
      compareDisplayUnits(b, a)
    )[0];
  if (!demoted) return params;
  const nextDisplayCost = params.displayedUnits.reduce((sum, unit) => sum + unit.entryCost, 0) - demoted.entryCost + promoted.entryCost;
  if (nextDisplayCost > displayCap) return params;

  const displayedUnits = params.displayedUnits
    .filter((unit) => unit.unitId !== demoted.unitId)
    .concat([annotateUnitZones(promoted, {
      displayedNonPointOverExcessMainPoint: true,
      displayedNonPointReplacedMainPointUnitId: demoted.unitId,
    }, 'displayed_non_point_over_excess_main_point')])
    .sort(compareDisplayUnits);
  const retainedUnits = params.retainedUnits
    .filter((unit) => unit.unitId !== promoted.unitId)
    .concat([annotateUnitZones(demoted, {
      retainedExcessMainPointDisplayBalance: true,
      retainedExcessMainPointReplacedByUnitId: promoted.unitId,
    }, 'retained_excess_main_point_display_balance')])
    .sort(compareDisplayUnits);
  return { displayedUnits, retainedUnits };
}

function retainQuestionableConfluenceSaddleMembers(
  params: { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] },
  season: WaterReaderZonePlacementResult['season'],
): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  const displayedUnits: DisplayUnit[] = [];
  const retainedUnits = [...params.retainedUnits];

  for (const unit of params.displayedUnits) {
    if (unit.entryType !== 'structure_confluence') {
      displayedUnits.push(unit);
      continue;
    }

    const retainedSaddles = unit.zones.filter(questionableSaddleConfluenceMember);
    if (retainedSaddles.length === 0) {
      displayedUnits.push(unit);
      continue;
    }

    const retainedZoneIds = new Set(retainedSaddles.map((zone) => zone.zoneId));
    const remainingZones = unit.zones.filter((zone) => !retainedZoneIds.has(zone.zoneId));
    retainedUnits.push(...retainedSaddles.map((zone) => retainedConfluenceSaddleUnit(zone, unit, season)));
    displayedUnits.push(...displayUnitsAfterConfluenceSaddleRetention(unit, remainingZones, season));
  }

  return {
    displayedUnits: displayedUnits.sort(compareDisplayUnits),
    retainedUnits: retainedUnits.sort(compareDisplayUnits),
  };
}

function displayUnitsAfterConfluenceSaddleRetention(
  unit: DisplayUnit,
  remainingZones: WaterReaderPlacedZone[],
  season: WaterReaderZonePlacementResult['season'],
): DisplayUnit[] {
  if (remainingZones.length === 0) return [];
  const crossFeatureOverlapPair = crossFeatureDisplayPair(remainingZones);
  if (remainingZones.length > 1 && confluenceFeatureClassLabelCount(remainingZones) > 1) {
    const memberSummary = finalMemberSummaryForZones(remainingZones);
    const confluenceGroup: WaterReaderStructureConfluenceGroup = {
      ...(unit.confluenceGroup ?? {
        groupId: unit.unitId,
        strength: 'light' as const,
        memberZoneIds: [],
        memberSourceFeatureIds: [],
        memberFeatureClasses: [],
        memberPlacementKinds: [],
      }),
      memberZoneIds: remainingZones.map((zone) => zone.zoneId),
      memberSourceFeatureIds: unique(remainingZones.map((zone) => zone.sourceFeatureId)),
      memberFeatureClasses: unique(remainingZones.map((zone) => zone.featureClass)),
      memberPlacementKinds: unique(remainingZones.map((zone) => zone.placementKind)),
      crossFeatureOverlapPair: crossFeatureOverlapPair ?? unit.confluenceGroup?.crossFeatureOverlapPair,
    };
    const zones = remainingZones.map((zone) => annotateZoneDiagnostics(zone, {
      confluenceSaddleMemberRetainedForReadability: true,
      finalConfluenceMemberSummary: memberSummary,
      finalConfluenceLegendTitle: crossFeatureStructureAreaTitleForZones(remainingZones),
    }));
    return [{
      ...unit,
      zones,
      confluenceGroup,
      displayReadability: displayReadabilityForZones(zones, unit.displayReadability),
      ...unitSort(zones, unit.unitId, season, confluenceGroup),
      rankingDiagnostics: unique([
        ...unit.rankingDiagnostics,
        'confluence_saddle_member_retained_for_readability',
      ]),
    }];
  }

  return remainingZones.map((zone) => {
    const annotatedZone = annotateZoneDiagnostics(zone, {
      confluenceSplitAfterSaddleRetention: true,
      confluenceSplitReason: 'questionable_saddle_member_retained_for_readability',
    });
    return {
      unitId: annotatedZone.zoneId,
      entryType: 'standalone_zone',
      zones: [annotatedZone],
      entryCost: 1,
      displayReadability: displayReadabilityForZones([annotatedZone], unit.displayReadability),
      ...unitSort([annotatedZone], annotatedZone.zoneId, season),
      rankingDiagnostics: unique([
        ...unit.rankingDiagnostics,
        'confluence_split_after_saddle_retention',
      ]),
    };
  });
}

function retainedConfluenceSaddleUnit(
  zone: WaterReaderPlacedZone,
  unit: DisplayUnit,
  season: WaterReaderZonePlacementResult['season'],
): DisplayUnit {
  const retainReason = questionableSaddleConfluenceRetainReason(zone);
  const displayClass = zone.diagnostics.constrictionDisplayClass === 'retained_questionable_constriction'
    ? 'retained_questionable_constriction'
    : 'broad_saddle';
  const annotatedZone = annotateZoneDiagnostics(zone, {
    saddleConfluenceMemberRetainedForReadability: true,
    saddleConfluenceRetainedFromUnitId: unit.unitId,
    constrictionDisplayClass: displayClass,
    constrictionDisplayRetainedReason: retainReason,
  });
  return {
    unitId: annotatedZone.zoneId,
    entryType: 'standalone_zone',
    zones: [annotatedZone],
    entryCost: 1,
    displayReadability: displayReadabilityForZones([annotatedZone], unit.displayReadability),
    ...unitSort([annotatedZone], annotatedZone.zoneId, season),
    rankingDiagnostics: unique([
      ...unit.rankingDiagnostics,
      QUESTIONABLE_CONSTRICTION_RETENTION_DIAGNOSTIC,
      'retained_confluence_saddle_member_readability',
    ]),
  };
}

function questionableSaddleConfluenceMember(zone: WaterReaderPlacedZone): boolean {
  if (zone.featureClass !== 'saddle') return false;
  if (zone.diagnostics.saddleRecoveredFromBroadReview === true) return false;
  const displayClass = typeof zone.diagnostics.constrictionDisplayClass === 'string'
    ? zone.diagnostics.constrictionDisplayClass
    : '';
  if (displayClass === 'retained_questionable_constriction' || displayClass === 'broad_saddle') return true;
  const readabilityClass = typeof zone.diagnostics.constrictionReadabilityClass === 'string'
    ? zone.diagnostics.constrictionReadabilityClass
    : '';
  if (
    readabilityClass === 'low_confidence_review' ||
    readabilityClass === 'one_sided_constriction_review' ||
    readabilityClass === 'broad_saddle_review'
  ) return true;
  const widthToAverage = diagnosticNumber(zone.diagnostics.constrictionWidthToAverage);
  const expansionBalance = diagnosticNumber(zone.diagnostics.constrictionExpansionBalance, 1);
  const oneSided = zone.diagnostics.constrictionOneSidedExpansion === true || expansionBalance < 0.38;
  return widthToAverage >= 0.25 && oneSided;
}

function questionableSaddleConfluenceRetainReason(zone: WaterReaderPlacedZone): string {
  const displayClass = typeof zone.diagnostics.constrictionDisplayClass === 'string'
    ? zone.diagnostics.constrictionDisplayClass
    : '';
  if (displayClass === 'retained_questionable_constriction') return 'low_confidence_or_tiny_constriction';
  if (displayClass === 'broad_saddle') return 'broad_saddle_not_visually_substantial';
  return 'broad_or_one_sided_saddle_confluence_member';
}

function retainConstrictionLineFallbacksForReadability(params: {
  displayedUnits: DisplayUnit[];
  retainedUnits: DisplayUnit[];
}, displayCap: number, capInitiallyExceeded: boolean): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  const displayedCost = params.displayedUnits.reduce((sum, unit) => sum + unit.entryCost, 0);
  if (displayedCost <= 5) return params;
  const capAlreadyExceeded = capInitiallyExceeded || params.retainedUnits.length > 0 || displayedCost > displayCap;
  const retainedForReadability: DisplayUnit[] = [];
  const displayedUnits: DisplayUnit[] = [];
  for (const unit of params.displayedUnits) {
    if (nonUsefulConstrictionLineFallback(unit)) {
      const neckAreaDiagnostics: Record<string, number | string | boolean | string[] | null> = unit.entryType === 'neck_area'
        ? {
            sameNeckShouldersGrouped: true,
            sameNeckShoulderGroupFeatureId: unit.zones[0]?.sourceFeatureId ?? null,
            sameNeckShoulderMemberZoneIds: unit.zones.map((zone) => zone.zoneId),
            neckAreaRetainedForReadability: true,
          }
        : {};
      retainedForReadability.push(annotateUnitZones(unit, {
        constrictionLineRetainedForReadability: true,
        ...neckAreaDiagnostics,
      }, capAlreadyExceeded ? undefined : 'retained_constriction_line_readability'));
    } else {
      displayedUnits.push(annotateUnitZones(unit, {
        constrictionDisplayedAsLineFallback: unit.zones.some((zone) => zone.diagnostics.constrictionLineFallbackUsed === true),
      }));
    }
  }
  if (retainedForReadability.length === 0) return params;
  return {
    displayedUnits: displayedUnits.sort(compareDisplayUnits),
    retainedUnits: [...params.retainedUnits, ...retainedForReadability].sort(compareDisplayUnits),
  };
}

function retainQuestionableConstrictions(params: {
  displayedUnits: DisplayUnit[];
  retainedUnits: DisplayUnit[];
}): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  const displayedUnits: DisplayUnit[] = [];
  const retainedUnits = [...params.retainedUnits];
  for (const unit of params.displayedUnits) {
    const retainReason = constrictionDisplayRetainReason(unit, params.displayedUnits);
    if (retainReason) {
      retainedUnits.push(annotateUnitZones(unit, {
        constrictionDisplayRetainedReason: retainReason,
        constrictionDisplayClass: 'retained_questionable_constriction',
      }, QUESTIONABLE_CONSTRICTION_RETENTION_DIAGNOSTIC));
    } else {
      displayedUnits.push(unit);
    }
  }
  return {
    displayedUnits: displayedUnits.sort(compareDisplayUnits),
    retainedUnits: retainedUnits.sort(compareDisplayUnits),
  };
}

function recoverRetainedConstrictions(
  params: { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] },
  displayCap: number,
): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  let displayedUnits = [...params.displayedUnits];
  let retainedUnits = [...params.retainedUnits];
  let displayedCost = displayedUnits.reduce((sum, unit) => sum + unit.entryCost, 0);
  const candidates = retainedUnits
    .filter(recoveredConstrictionUnit)
    .sort(compareRecoveredConstrictions);
  for (const candidate of candidates) {
    if (displayedCost + candidate.entryCost > displayCap) continue;
    if (nearbyStrongerConstrictionRetainReason(candidate, displayedUnits)) continue;
    displayedUnits.push(annotateUnitZones(candidate, {
      constrictionRecoveredIntoDisplay: true,
      constrictionLineRetainedForReadability: false,
      constrictionDisplayRetainedReason: null,
    }, 'displayed_recovered_constriction'));
    retainedUnits = retainedUnits.filter((unit) => unit.unitId !== candidate.unitId);
    displayedCost += candidate.entryCost;
  }
  return {
    displayedUnits: displayedUnits.sort(compareDisplayUnits),
    retainedUnits: retainedUnits.sort(compareDisplayUnits),
  };
}

function retainLowReadabilityStandaloneConstrictions(params: {
  displayedUnits: DisplayUnit[];
  retainedUnits: DisplayUnit[];
}): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  const displayedUnits: DisplayUnit[] = [];
  const retainedUnits = [...params.retainedUnits];
  const displayedCost = params.displayedUnits.reduce((sum, unit) => sum + unit.entryCost, 0);

  for (const unit of params.displayedUnits) {
    if (
      lowReadabilityStandaloneConstriction(unit) &&
      shouldRetainLowReadabilityConstriction(unit, params.displayedUnits, displayedCost)
    ) {
      retainedUnits.push(annotateUnitZones(unit, {
        constrictionDisplayRetainedReason: 'hard_tiny_or_negative_usefulness_with_readable_alternatives',
        tinyConstrictionRetainedForDisplayReadability: true,
      }, TINY_CONSTRICTION_RETENTION_DIAGNOSTIC));
      continue;
    }
    displayedUnits.push(unit);
  }

  return {
    displayedUnits: displayedUnits.sort(compareDisplayUnits),
    retainedUnits: retainedUnits.sort(compareDisplayUnits),
  };
}

function lowReadabilityStandaloneConstriction(unit: DisplayUnit): boolean {
  if (unit.entryType !== 'standalone_zone' || unit.zones.length !== 1) return false;
  const featureClass = unit.zones[0]?.featureClass;
  if (featureClass !== 'neck' && featureClass !== 'saddle') return false;
  return unit.displayReadability.displayReadabilityTier === 'hard_tiny' ||
    unit.sort.displayUsefulnessScore < 0;
}

function shouldRetainLowReadabilityConstriction(
  unit: DisplayUnit,
  displayedUnits: DisplayUnit[],
  displayedCost: number,
): boolean {
  if (displayedCost - unit.entryCost >= 5) return true;
  const strongerReadableAlternatives = displayedUnits.filter((candidate) =>
    candidate.unitId !== unit.unitId &&
    readableNonConstrictionDisplayAlternative(candidate) &&
    candidate.sort.displayUsefulnessScore > unit.sort.displayUsefulnessScore
  );
  return strongerReadableAlternatives.length >= 4;
}

function readableNonConstrictionDisplayAlternative(unit: DisplayUnit): boolean {
  const featureClass = unitPrimaryFeatureClass(unit);
  if (featureClass !== 'cove' && featureClass !== 'main_lake_point' && featureClass !== 'secondary_point' && featureClass !== 'island') return false;
  return unit.displayReadability.displayReadabilityTier !== 'hard_tiny' &&
    unit.sort.displayUsefulnessScore >= 0;
}

function recoveredConstrictionUnit(unit: DisplayUnit): boolean {
  return unit.zones.some((zone) =>
    (zone.featureClass === 'neck' && zone.diagnostics.constrictionRecoveredFromTinyGate === true) ||
    (zone.featureClass === 'saddle' && zone.diagnostics.saddleRecoveredFromBroadReview === true)
  );
}

function compareRecoveredConstrictions(a: DisplayUnit, b: DisplayUnit): number {
  return candidateRecoveryRank(a) - candidateRecoveryRank(b) ||
    b.sort.displayUsefulnessScore - a.sort.displayUsefulnessScore ||
    b.sort.score - a.sort.score ||
    compareDisplayUnits(a, b);
}

function candidateRecoveryRank(unit: DisplayUnit): number {
  const reasons = unit.zones
    .map((zone) => zone.diagnostics.constrictionRecoveryReason ?? zone.diagnostics.saddleRecoveryReason)
    .filter((reason): reason is ConstrictionRecoveryReason => typeof reason === 'string');
  if (reasons.includes('high_confidence_clear_neck')) return 1;
  if (reasons.includes('high_confidence_channel_pinch')) return 2;
  if (reasons.includes('high_confidence_one_sided_pinch')) return 3;
  if (reasons.includes('high_confidence_readable_broad_saddle')) return 4;
  return 99;
}

function constrictionDisplayRetainReason(unit: DisplayUnit, displayedUnits: DisplayUnit[]): string | null {
  const displayClass = primaryConstrictionDisplayClass(unit);
  if (!displayClass) return null;
  if (displayClass === 'retained_questionable_constriction') return 'low_confidence_or_tiny_constriction';
  if (displayClass === 'broad_saddle') {
    if (unit.zones.some(broadOneSidedSaddleZone)) return 'broad_saddle_not_visually_substantial';
    const visuallySubstantial = unit.displayReadability.estimatedAppFootprintMaxDimensionPx >= 22 &&
      unit.displayReadability.estimatedAppFootprintAreaPx >= 220 &&
      unit.zones.some((zone) => diagnosticNumber(zone.diagnostics.constrictionConfidence) >= 0.86);
    return visuallySubstantial ? null : 'broad_saddle_not_visually_substantial';
  }
  if (displayClass === 'channel_pinch' || displayClass === 'one_sided_pinch_review') {
    return nearbyStrongerConstrictionRetainReason(unit, displayedUnits);
  }
  if (displayClass === 'display_saddle' && unit.zones.some((zone) => zone.diagnostics.saddleRecoveredFromBroadReview === true)) {
    return nearbyStrongerConstrictionRetainReason(unit, displayedUnits);
  }
  return null;
}

function broadOneSidedSaddleZone(zone: WaterReaderPlacedZone): boolean {
  if (zone.featureClass !== 'saddle') return false;
  const readabilityClass = typeof zone.diagnostics.constrictionReadabilityClass === 'string'
    ? zone.diagnostics.constrictionReadabilityClass
    : '';
  const widthToAverage = diagnosticNumber(zone.diagnostics.constrictionWidthToAverage);
  const expansionBalance = diagnosticNumber(zone.diagnostics.constrictionExpansionBalance, 1);
  const broadGeometry = readabilityClass === 'broad_saddle_review' || widthToAverage >= 0.25;
  return broadGeometry &&
    (
      zone.diagnostics.constrictionOneSidedExpansion === true ||
      zone.diagnostics.constrictionTwoSidedExpansion !== true ||
      expansionBalance < 0.55
    );
}

function nearbyStrongerConstrictionRetainReason(unit: DisplayUnit, displayedUnits: DisplayUnit[]): string | null {
  for (const other of displayedUnits) {
    if (other.unitId === unit.unitId) continue;
    if (!primaryConstrictionDisplayClass(other)) continue;
    if (!materiallyStrongerConstriction(other, unit)) continue;
    const relationship = constrictionUnitRelationship(unit, other);
    if (relationship === 'overlap') return 'overlaps_stronger_constriction';
    if (relationship === 'near') return 'near_stronger_constriction';
  }
  return null;
}

function materiallyStrongerConstriction(candidate: DisplayUnit, unit: DisplayUnit): boolean {
  const candidateConfidence = maxConstrictionConfidence(candidate);
  const unitConfidence = maxConstrictionConfidence(unit);
  return compareDisplayUnits(candidate, unit) < 0 ||
    candidate.sort.displayUsefulnessScore > unit.sort.displayUsefulnessScore + 0.04 ||
    candidate.sort.score > unit.sort.score + 0.04 ||
    candidateConfidence > unitConfidence + 0.08;
}

function maxConstrictionConfidence(unit: DisplayUnit): number {
  return Math.max(0, ...unit.zones.map((zone) => diagnosticNumber(zone.diagnostics.constrictionConfidence)));
}

function constrictionUnitRelationship(a: DisplayUnit, b: DisplayUnit): 'overlap' | 'near' | null {
  const aPoints = a.zones.flatMap((zone) => visibleOrUnclippedRing(zone)).filter(validPoint);
  const bPoints = b.zones.flatMap((zone) => visibleOrUnclippedRing(zone)).filter(validPoint);
  if (aPoints.length < 3 || bPoints.length < 3) return null;
  const aBounds = boundsForPoints(aPoints);
  const bBounds = boundsForPoints(bPoints);
  const maxAxisM = Math.max(a.sort.majorAxisM, b.sort.majorAxisM);
  const padM = Math.max(4, Math.min(18, maxAxisM * 0.04));
  if (boundsTouchOrOverlap(expandBounds(aBounds, padM), expandBounds(bBounds, padM))) return 'overlap';
  const centerDistanceM = distanceM(boundsCenterForDisplay(aBounds), boundsCenterForDisplay(bBounds));
  const nearThresholdM = Math.max(10, Math.min(80, maxAxisM * 0.38));
  return centerDistanceM <= nearThresholdM ? 'near' : null;
}

function primaryConstrictionDisplayClass(unit: DisplayUnit): ConstrictionDisplayClass | null {
  const classes = unit.zones
    .map((zone) => typeof zone.diagnostics.constrictionDisplayClass === 'string' ? zone.diagnostics.constrictionDisplayClass as ConstrictionDisplayClass : null)
    .filter((displayClass): displayClass is ConstrictionDisplayClass => displayClass !== null);
  if (classes.length === 0) return null;
  const rank: Record<ConstrictionDisplayClass, number> = {
    retained_questionable_constriction: 0,
    broad_saddle: 1,
    one_sided_pinch_review: 2,
    channel_pinch: 3,
    display_saddle: 4,
    clear_neck: 5,
  };
  return classes.sort((a, b) => rank[a] - rank[b])[0] ?? null;
}

function normalizeDisplayedConfluences(
  params: { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] },
  season: WaterReaderZonePlacementResult['season'],
  displayCap: number,
): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  let displayedUnits = [...params.displayedUnits];
  let retainedUnits = [...params.retainedUnits];
  let changed = true;
  let normalizedAnyPointTipOpenWater = false;
  while (changed) {
    changed = false;
    const candidate = bestConfluenceNormalizationCandidate(displayedUnits);
    if (!candidate) break;
    const target = displayedUnits.find((unit) => unit.unitId === candidate.targetId);
    const source = displayedUnits.find((unit) => unit.unitId === candidate.sourceId);
    if (!target || !source) break;
    const merged = mergeDisplayUnitsAsConfluence(target, source, candidate, season);
    displayedUnits = displayedUnits
      .filter((unit) => unit.unitId !== target.unitId && unit.unitId !== source.unitId)
      .concat([merged])
      .sort(compareDisplayUnits);
    changed = true;
    if (candidate.reason === 'same_point_tip_open_water_compact' || candidate.reason === 'near_point_tip_open_water_compact') {
      normalizedAnyPointTipOpenWater = true;
    }
  }
  if (normalizedAnyPointTipOpenWater && retainedUnits.length > 0) {
    const refilled = refillDisplayCap({ displayedUnits, retainedUnits, displayCap });
    displayedUnits = refilled.displayedUnits;
    retainedUnits = refilled.retainedUnits;
  }
  return { displayedUnits, retainedUnits };
}

function refillDisplayCap(params: {
  displayedUnits: DisplayUnit[];
  retainedUnits: DisplayUnit[];
  displayCap: number;
}): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  const displayedUnits = [...params.displayedUnits];
  const retainedUnits: DisplayUnit[] = [];
  let remainingCap = params.displayCap - displayedUnits.reduce((sum, unit) => sum + unit.entryCost, 0);
  for (const unit of params.retainedUnits.sort(compareDisplayUnits)) {
    if (unit.entryCost <= remainingCap) {
      displayedUnits.push({
        ...unit,
        rankingDiagnostics: unique([...unit.rankingDiagnostics, 'display_refilled_after_confluence_normalization']),
      });
      remainingCap -= unit.entryCost;
    } else {
      retainedUnits.push(unit);
    }
  }
  return {
    displayedUnits: displayedUnits.sort(compareDisplayUnits),
    retainedUnits: retainedUnits.sort(compareDisplayUnits),
  };
}

function bestConfluenceNormalizationCandidate(units: DisplayUnit[]): ConfluenceNormalizationCandidate | null {
  const candidates: ConfluenceNormalizationCandidate[] = [];
  for (let i = 0; i < units.length; i++) {
    for (let j = i + 1; j < units.length; j++) {
      const candidate = confluenceNormalizationCandidate(units[i]!, units[j]!);
      if (candidate) candidates.push(candidate);
    }
  }
  return candidates.sort((a, b) =>
    a.envelopeRatio - b.envelopeRatio ||
    a.targetId.localeCompare(b.targetId) ||
    a.sourceId.localeCompare(b.sourceId)
  )[0] ?? null;
}

function confluenceNormalizationCandidate(a: DisplayUnit, b: DisplayUnit): ConfluenceNormalizationCandidate | null {
  if (a.zones.some(nonDisplayedLineFallbackZone) || b.zones.some(nonDisplayedLineFallbackZone)) return null;
  if (a.entryType !== 'structure_confluence' && b.entryType !== 'structure_confluence' && (a.entryCost !== 1 || b.entryCost !== 1)) return null;
  const zones = [...a.zones, ...b.zones];
  const relationshipAllowed = confluenceNormalizationRelationshipAllowed(a, b, zones);
  if (!relationshipAllowed.allowed) return null;
  const relationship = confluenceRelationship(a.zones, b.zones);
  if (!relationship) return null;
  const envelopeMajorAxisM = envelopeMajorAxisMeters(zones);
  const largestMember = Math.max(...zones.map((zone) => zone.majorAxisM), 1);
  const envelopeRatio = envelopeMajorAxisM / largestMember;
  const pointTipOpenWater = relationship.reason === 'same_point_tip_open_water_compact' ||
    relationship.reason === 'near_point_tip_open_water_compact';
  const crossFeaturePair = crossFeatureDisplayPair(zones);
  const maxEnvelopeRatio = pointTipOpenWater
    ? 3.15
    : crossFeaturePair
      ? relationship.reason === 'cross_feature_cove+point_same_shoreline_corridor' ? 2.05 : crossFeaturePair === 'cove+point' ? 2.9 : crossFeaturePair === 'island+point' ? 2.2 : 2.45
      : 2.25;
  const directVisibleRingIntersection = relationship.reason.includes('visible_ring_intersection');
  if (directVisibleRingIntersection && envelopeRatio > Math.max(maxEnvelopeRatio, 4.2)) return null;
  if (envelopeRatio > maxEnvelopeRatio && relationship.reason !== 'visible_overlap_heavy' && !directVisibleRingIntersection) return null;
  if (relationshipAllowed.mode === 'same_class_extreme_compact' && (relationship.reason !== 'visible_overlap_heavy' || envelopeRatio > 1.45)) return null;
  if (relationshipAllowed.mode === 'existing_placement_confluence' && envelopeRatio > 1.8) return null;
  const target = a.entryType === 'structure_confluence'
    ? a
    : b.entryType === 'structure_confluence'
      ? b
      : compareDisplayUnits(a, b) <= 0 ? a : b;
  const source = target.unitId === a.unitId ? b : a;
  return {
    targetId: target.unitId,
    sourceId: source.unitId,
    reason: relationship.reason,
    envelopeMajorAxisM,
    envelopeRatio,
    crossFeatureOverlapPair: crossFeaturePair ?? undefined,
    crossFeatureOverlapFraction: crossFeaturePair ? relationship.overlapFraction : undefined,
    crossFeatureContainmentFraction: crossFeaturePair ? relationship.containmentFraction : undefined,
  };
}

function confluenceNormalizationRelationshipAllowed(
  a: DisplayUnit,
  b: DisplayUnit,
  zones: WaterReaderPlacedZone[],
): { allowed: boolean; mode: 'same_source' | 'same_class_extreme_compact' | 'existing_placement_confluence' | 'legacy_point_tip_open_water' | 'cross_feature_visible_overlap' | 'blocked_cross_feature' } {
  if (pointTipOpenWaterConfluenceRelationship(a.zones, b.zones)) return { allowed: true, mode: 'legacy_point_tip_open_water' };
  const sourceIds = new Set(zones.map((zone) => zone.sourceFeatureId));
  const featureClasses = new Set(zones.map((zone) => zone.featureClass));
  if (crossFeatureDisplayPair(zones)) return { allowed: true, mode: 'cross_feature_visible_overlap' };
  if (sourceIds.size < zones.length) return { allowed: false, mode: 'blocked_cross_feature' };
  if (featureClasses.size === 1) return { allowed: false, mode: 'blocked_cross_feature' };
  const existingPlacementConfluence = a.entryType === 'structure_confluence' || b.entryType === 'structure_confluence' ||
    zones.some((zone) => typeof zone.diagnostics.structureConfluenceGroupId === 'string' && String(zone.diagnostics.structureConfluenceGroupId).length > 0);
  if (existingPlacementConfluence) return { allowed: true, mode: 'existing_placement_confluence' };
  return { allowed: false, mode: 'blocked_cross_feature' };
}

function mergeDisplayUnitsAsConfluence(
  target: DisplayUnit,
  source: DisplayUnit,
  candidate: ConfluenceNormalizationCandidate,
  season: WaterReaderZonePlacementResult['season'],
): DisplayUnit {
  const sourceEntryIds = source.entryType === 'structure_confluence' ? [source.unitId] : source.zones.map((zone) => zone.zoneId);
  const targetEntryIds = target.entryType === 'structure_confluence' ? [target.unitId] : target.zones.map((zone) => zone.zoneId);
  const sortedZones = [...target.zones, ...source.zones].sort((a, b) => a.zoneId.localeCompare(b.zoneId));
  const memberSummary = finalMemberSummaryForZones(sortedZones);
  const finalLegendTitle = candidate.crossFeatureOverlapPair
    ? crossFeatureStructureAreaTitleForZones(sortedZones)
    : `Structure Confluence - ${memberSummary}`;
  const zones = sortedZones
    .map((zone) => annotateZoneDiagnostics(zone, {
      confluenceNormalized: true,
      confluenceAbsorbedEntryIds: sourceEntryIds,
      confluenceMergeReason: candidate.reason,
      confluenceEnvelopeMajorAxisMeters: roundDiagnosticNumber(candidate.envelopeMajorAxisM),
      confluenceEnvelopeToLargestMemberRatio: roundDiagnosticNumber(candidate.envelopeRatio),
      crossFeatureOverlapResolutionMode: candidate.crossFeatureOverlapPair ? 'unified_display_geometry_structure_area' : zone.diagnostics.crossFeatureOverlapResolutionMode ?? null,
      crossFeatureOverlapPair: candidate.crossFeatureOverlapPair ?? zone.diagnostics.crossFeatureOverlapPair ?? null,
      crossFeatureOverlapFraction: candidate.crossFeatureOverlapFraction !== undefined ? roundDiagnosticNumber(candidate.crossFeatureOverlapFraction) : zone.diagnostics.crossFeatureOverlapFraction ?? null,
      crossFeatureContainmentFraction: candidate.crossFeatureContainmentFraction !== undefined ? roundDiagnosticNumber(candidate.crossFeatureContainmentFraction) : zone.diagnostics.crossFeatureContainmentFraction ?? null,
      crossFeatureUnifiedCompactnessRatio: candidate.crossFeatureOverlapPair ? roundDiagnosticNumber(candidate.envelopeRatio) : zone.diagnostics.crossFeatureUnifiedCompactnessRatio ?? null,
      normalizedConfluenceLegendRebuilt: true,
      finalConfluenceMemberSummary: memberSummary,
      finalConfluenceLegendTitle: finalLegendTitle,
    }));
  const groupId = `normalized-confluence-${stableHash([...targetEntryIds, ...sourceEntryIds].sort((x, y) => x.localeCompare(y)).join('|'))}`;
  const confluenceGroup: WaterReaderStructureConfluenceGroup = {
    groupId,
    strength: candidate.reason === 'visible_overlap_heavy' ? 'strong' : 'light',
    memberZoneIds: zones.map((zone) => zone.zoneId),
    memberSourceFeatureIds: unique(zones.map((zone) => zone.sourceFeatureId)),
    memberFeatureClasses: unique(zones.map((zone) => zone.featureClass)),
    memberPlacementKinds: unique(zones.map((zone) => zone.placementKind)),
    mergeReason: candidate.reason,
    compactnessRatio: roundDiagnosticNumber(candidate.envelopeRatio),
    envelopeMajorAxisM: roundDiagnosticNumber(candidate.envelopeMajorAxisM),
    largestMemberAxisM: roundDiagnosticNumber(Math.max(...zones.map((zone) => zone.majorAxisM), 1)),
    renderedAsUnifiedEnvelope: true,
    crossFeatureOverlapResolutionMode: candidate.crossFeatureOverlapPair ? 'unified_display_geometry_structure_area' : undefined,
    crossFeatureOverlapPair: candidate.crossFeatureOverlapPair,
    crossFeatureOverlapFraction: candidate.crossFeatureOverlapFraction !== undefined ? roundDiagnosticNumber(candidate.crossFeatureOverlapFraction) : undefined,
    crossFeatureContainmentFraction: candidate.crossFeatureContainmentFraction !== undefined ? roundDiagnosticNumber(candidate.crossFeatureContainmentFraction) : undefined,
    crossFeatureUnifiedCompactnessRatio: candidate.crossFeatureOverlapPair ? roundDiagnosticNumber(candidate.envelopeRatio) : undefined,
  };
  return {
    unitId: groupId,
    entryType: 'structure_confluence',
    zones,
    confluenceGroup,
    entryCost: 1,
    displayReadability: displayReadabilityForZones(zones, target.displayReadability),
    ...unitSort(zones, groupId, season, confluenceGroup),
    rankingDiagnostics: unique([...target.rankingDiagnostics, ...source.rankingDiagnostics, `confluence_normalized:${candidate.reason}`]),
  };
}

function finalMemberSummaryForZones(zones: WaterReaderPlacedZone[]): string {
  const counts = new Map<string, number>();
  for (const zone of zones) {
    const label = confluenceMemberLabel(zone);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, count]) => count > 1 ? `${label} x${count}` : label)
    .join(' + ');
}

function nonUsefulConstrictionLineFallback(unit: DisplayUnit): boolean {
  const constrictionZones = unit.zones.filter((zone) => zone.featureClass === 'neck' || zone.featureClass === 'saddle');
  if (constrictionZones.length === 0 || constrictionZones.length !== unit.zones.length) return false;
  const allLineFallbacks = constrictionZones.every((zone) => zone.diagnostics.constrictionLineFallbackUsed === true);
  if (!allLineFallbacks) return false;
  const bestAspectRatio = Math.min(...constrictionZones.map((zone) => diagnosticNumber(zone.diagnostics.zoneAspectRatio, zone.minorAxisM > 0 ? zone.majorAxisM / zone.minorAxisM : 999)));
  const anyApproachUsed = constrictionZones.some((zone) => zone.diagnostics.constrictionApproachCandidateUsed === true);
  return !anyApproachUsed && bestAspectRatio > 8;
}

function annotateUnitZones(
  unit: DisplayUnit,
  diagnostics: Record<string, number | string | boolean | string[] | null>,
  rankingDiagnostic?: string,
): DisplayUnit {
  return {
    ...unit,
    zones: unit.zones.map((zone) => ({
      ...zone,
      diagnostics: {
        ...zone.diagnostics,
        ...diagnostics,
      },
    })),
    rankingDiagnostics: rankingDiagnostic ? unique([...unit.rankingDiagnostics, rankingDiagnostic]) : unit.rankingDiagnostics,
  };
}

function annotateZoneDiagnostics(
  zone: WaterReaderPlacedZone,
  diagnostics: Record<string, number | string | boolean | string[] | null>,
): WaterReaderPlacedZone {
  return {
    ...zone,
    diagnostics: {
      ...zone.diagnostics,
      ...diagnostics,
    },
  };
}

function mixedIslandLineFallbackConfluence(zones: WaterReaderPlacedZone[]): boolean {
  const hasIsland = zones.some((zone) => zone.featureClass === 'island');
  const hasLineFallback = zones.some(nonDisplayedLineFallbackZone);
  const hasReadableNonLine = zones.some((zone) => !nonDisplayedLineFallbackZone(zone));
  return hasIsland && hasLineFallback && hasReadableNonLine;
}

function nonDisplayedLineFallbackZone(zone: WaterReaderPlacedZone): boolean {
  return (zone.featureClass === 'neck' || zone.featureClass === 'saddle') &&
    zone.diagnostics.constrictionLineFallbackUsed === true &&
    zone.diagnostics.constrictionApproachCandidateUsed !== true;
}

function confluenceRelationship(
  aZones: WaterReaderPlacedZone[],
  bZones: WaterReaderPlacedZone[],
): { reason: string; overlapFraction?: number; containmentFraction?: number } | null {
  const pointTipOpenWater = pointTipOpenWaterConfluenceRelationship(aZones, bZones);
  if (pointTipOpenWater) return pointTipOpenWater;
  const crossFeaturePair = crossFeatureDisplayPair([...aZones, ...bZones]);
  let bestOverlap = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  let maxMajorAxisM = 0;
  let bestContainment = 0;
  let touched = false;
  let bestVisibleRingDistance = Number.POSITIVE_INFINITY;
  for (const a of aZones) {
    for (const b of bZones) {
      maxMajorAxisM = Math.max(maxMajorAxisM, a.majorAxisM, b.majorAxisM);
      const overlap = visibleOverlapFraction(a, b);
      bestOverlap = Math.max(bestOverlap, overlap);
      bestContainment = Math.max(bestContainment, overlap);
      if (overlap >= 0.32) return { reason: 'visible_overlap_heavy', overlapFraction: overlap, containmentFraction: overlap };
      const distance = Math.min(distanceM(a.ovalCenter, b.ovalCenter), distanceM(a.anchor, b.anchor));
      bestDistance = Math.min(bestDistance, distance);
      const touchToleranceM = Math.max(3, maxMajorAxisM * 0.012);
      const aRing = visibleOrUnclippedRing(a);
      const bRing = visibleOrUnclippedRing(b);
      const matchingCrossFeaturePair = zonePairMatchesCrossFeaturePair(a, b, crossFeaturePair);
      const sampledTouch = ringsTouchOrNear(aRing, bRing, touchToleranceM);
      const segmentTouch = ringsIntersectOrNearSegments(aRing, bRing, touchToleranceM);
      if (matchingCrossFeaturePair && crossFeaturePair && segmentTouch) {
        return {
          reason: `cross_feature_${crossFeaturePair}_visible_ring_intersection`,
          overlapFraction: Math.max(bestOverlap, 0.12),
          containmentFraction: Math.max(bestContainment, 0.12),
        };
      }
      if (
        ((sampledTouch || segmentTouch) && (!crossFeatureExactTouchPair(crossFeaturePair) || matchingCrossFeaturePair)) ||
        (matchingCrossFeaturePair && crossFeatureExactTouchPair(crossFeaturePair) && ringsTouchOrNearExact(aRing, bRing, touchToleranceM))
      ) {
        touched = true;
      }
      if (matchingCrossFeaturePair && crossFeaturePair === 'cove+point') {
        const covePointVisibleDistanceSearchM = Math.min(
          COVE_POINT_SAME_SHORELINE_CORRIDOR_CAP_M,
          Math.max(18, maxMajorAxisM * 1.25),
        );
        bestVisibleRingDistance = Math.min(
          bestVisibleRingDistance,
          ringsMinimumDistanceExact(aRing, bRing, covePointVisibleDistanceSearchM),
        );
      }
    }
  }
  if (crossFeaturePair) {
    if (bestOverlap >= 0.1) {
      return { reason: `cross_feature_${crossFeaturePair}_display_overlap`, overlapFraction: bestOverlap, containmentFraction: bestContainment };
    }
    if (touched && (crossFeatureExactTouchPair(crossFeaturePair) || bestDistance <= 0.58 * Math.max(maxMajorAxisM, 1))) {
      return { reason: `cross_feature_${crossFeaturePair}_display_touch`, overlapFraction: bestOverlap, containmentFraction: bestContainment };
    }
    if (
      crossFeaturePair === 'cove+point' &&
      bestVisibleRingDistance <= Math.min(COVE_POINT_VISIBLE_RING_DISTANCE_CAP_M, Math.max(18, maxMajorAxisM * 1.25))
    ) {
      return { reason: 'cross_feature_cove+point_tight_visible_distance', overlapFraction: bestOverlap, containmentFraction: bestContainment };
    }
    if (
      crossFeaturePair === 'cove+point' &&
      bestVisibleRingDistance <= Math.min(COVE_POINT_SAME_SHORELINE_CORRIDOR_CAP_M, Math.max(18, maxMajorAxisM * 0.74))
    ) {
      return { reason: 'cross_feature_cove+point_same_shoreline_corridor', overlapFraction: bestOverlap, containmentFraction: bestContainment };
    }
    if (bestDistance <= 0.38 * Math.max(maxMajorAxisM, 1)) {
      return { reason: `cross_feature_${crossFeaturePair}_local_distance`, overlapFraction: bestOverlap, containmentFraction: bestContainment };
    }
    return null;
  }
  if (touched) return { reason: 'visible_boundary_touch', overlapFraction: bestOverlap, containmentFraction: bestContainment };
  if (bestOverlap >= 0.15) return { reason: 'visible_overlap_15pct', overlapFraction: bestOverlap, containmentFraction: bestContainment };
  if (bestDistance <= 0.35 * Math.max(maxMajorAxisM, 1)) return { reason: 'local_anchor_distance', overlapFraction: bestOverlap, containmentFraction: bestContainment };
  return null;
}

function pointTipOpenWaterConfluenceRelationship(
  aZones: WaterReaderPlacedZone[],
  bZones: WaterReaderPlacedZone[],
): { reason: string; overlapFraction?: number; containmentFraction?: number } | null {
  const zones = [...aZones, ...bZones];
  if (!zones.every((zone) => zone.featureClass === 'main_lake_point')) return null;
  const hasTip = zones.some((zone) => zone.placementKind === 'main_point_tip');
  const hasOpenWater = zones.some((zone) => zone.placementKind === 'main_point_open_water');
  if (!hasTip || !hasOpenWater) return null;
  const largestMember = Math.max(...zones.map((zone) => zone.majorAxisM), 1);
  const envelopeRatio = envelopeMajorAxisMeters(zones) / largestMember;
  const sharedSource = aZones.some((a) => bZones.some((b) => a.sourceFeatureId === b.sourceFeatureId));
  const nearest = nearestZoneDistance(aZones, bZones);
  if (sharedSource && envelopeRatio <= 3.15 && nearest <= largestMember * 1.65) {
    return { reason: 'same_point_tip_open_water_compact' };
  }
  if (envelopeRatio <= 2.35 && nearest <= largestMember * 0.55) {
    return { reason: 'near_point_tip_open_water_compact' };
  }
  return null;
}

function crossFeatureDisplayPair(zones: WaterReaderPlacedZone[]): string | null {
  const classes = new Set(zones.map((zone) => zone.featureClass));
  const hasPoint = classes.has('main_lake_point') || classes.has('secondary_point');
  if (classes.has('cove') && hasPoint) return 'cove+point';
  if (classes.has('cove') && classes.has('neck')) return 'cove+neck';
  if (classes.has('cove') && classes.has('saddle')) return 'cove+saddle';
  if (classes.has('island') && hasPoint) return 'island+point';
  return null;
}

function crossFeatureExactTouchPair(pair: string | null): boolean {
  return pair === 'cove+neck' || pair === 'cove+point';
}

function zonePairMatchesCrossFeaturePair(a: WaterReaderPlacedZone, b: WaterReaderPlacedZone, pair: string | null): boolean {
  if (pair === 'cove+point') return oneZoneIsCoveAndOtherIsPoint(a, b);
  if (pair === 'cove+neck') return oneZoneIsFeatureClass(a, b, 'cove', 'neck');
  return true;
}

function oneZoneIsCoveAndOtherIsPoint(a: WaterReaderPlacedZone, b: WaterReaderPlacedZone): boolean {
  const aPoint = a.featureClass === 'main_lake_point' || a.featureClass === 'secondary_point';
  const bPoint = b.featureClass === 'main_lake_point' || b.featureClass === 'secondary_point';
  return (a.featureClass === 'cove' && bPoint) || (b.featureClass === 'cove' && aPoint);
}

function oneZoneIsFeatureClass(a: WaterReaderPlacedZone, b: WaterReaderPlacedZone, left: WaterReaderFeatureClass, right: WaterReaderFeatureClass): boolean {
  return (a.featureClass === left && b.featureClass === right) || (a.featureClass === right && b.featureClass === left);
}

function nearestZoneDistance(aZones: WaterReaderPlacedZone[], bZones: WaterReaderPlacedZone[]): number {
  let best = Number.POSITIVE_INFINITY;
  for (const a of aZones) {
    for (const b of bZones) {
      best = Math.min(
        best,
        distanceM(a.ovalCenter, b.ovalCenter),
        distanceM(a.anchor, b.anchor),
      );
    }
  }
  return best;
}

function visibleOverlapFraction(a: WaterReaderPlacedZone, b: WaterReaderPlacedZone): number {
  const aRing = visibleOrUnclippedRing(a);
  const bRing = visibleOrUnclippedRing(b);
  const aArea = Math.max(1, Math.abs(ringArea(aRing)));
  const bArea = Math.max(1, Math.abs(ringArea(bRing)));
  const aInside = sampledInsideFraction(aRing, bRing) * aArea;
  const bInside = sampledInsideFraction(bRing, aRing) * bArea;
  return Math.max(aInside, bInside) / Math.min(aArea, bArea);
}

function sampledInsideFraction(samples: RingM, polygon: RingM): number {
  if (samples.length === 0 || polygon.length < 3) return 0;
  let inside = 0;
  const step = Math.max(1, Math.floor(samples.length / 24));
  let total = 0;
  for (let i = 0; i < samples.length; i += step) {
    total++;
    if (pointInRing(samples[i]!, polygon)) inside++;
  }
  return total > 0 ? inside / total : 0;
}

function ringsTouchOrNear(a: RingM, b: RingM, toleranceM: number): boolean {
  if (a.length === 0 || b.length === 0) return false;
  const stepA = Math.max(1, Math.floor(a.length / 24));
  const stepB = Math.max(1, Math.floor(b.length / 24));
  for (let i = 0; i < a.length; i += stepA) {
    for (let j = 0; j < b.length; j += stepB) {
      if (distanceM(a[i]!, b[j]!) <= toleranceM) return true;
    }
  }
  return false;
}

function ringsTouchOrNearExact(a: RingM, b: RingM, toleranceM: number): boolean {
  if (a.length === 0 || b.length === 0) return false;
  const aBounds = boundsForPoints(a);
  const bBounds = boundsForPoints(b);
  if (!boundsTouchOrOverlap(expandBounds(aBounds, toleranceM), expandBounds(bBounds, toleranceM))) return false;
  for (const aPoint of a) {
    for (const bPoint of b) {
      if (distanceM(aPoint, bPoint) <= toleranceM) return true;
    }
  }
  return false;
}

function ringsIntersectOrNearSegments(a: RingM, b: RingM, toleranceM: number): boolean {
  if (a.length < 2 || b.length < 2) return false;
  const aBounds = boundsForPoints(a);
  const bBounds = boundsForPoints(b);
  if (!boundsTouchOrOverlap(expandBounds(aBounds, toleranceM), expandBounds(bBounds, toleranceM))) return false;
  for (let i = 0; i < a.length; i++) {
    const a1 = a[i]!;
    const a2 = a[(i + 1) % a.length]!;
    const aSegBounds = expandBounds(boundsForPoints([a1, a2]), toleranceM);
    for (let j = 0; j < b.length; j++) {
      const b1 = b[j]!;
      const b2 = b[(j + 1) % b.length]!;
      if (!boundsTouchOrOverlap(aSegBounds, expandBounds(boundsForPoints([b1, b2]), toleranceM))) continue;
      if (segmentsIntersect(a1, a2, b1, b2) || segmentDistanceM(a1, a2, b1, b2) <= toleranceM) return true;
    }
  }
  return false;
}

function segmentsIntersect(a1: PointM, a2: PointM, b1: PointM, b2: PointM): boolean {
  const o1 = orientation(a1, a2, b1);
  const o2 = orientation(a1, a2, b2);
  const o3 = orientation(b1, b2, a1);
  const o4 = orientation(b1, b2, a2);
  if (o1 !== o2 && o3 !== o4) return true;
  return (o1 === 0 && pointOnSegment(b1, a1, a2)) ||
    (o2 === 0 && pointOnSegment(b2, a1, a2)) ||
    (o3 === 0 && pointOnSegment(a1, b1, b2)) ||
    (o4 === 0 && pointOnSegment(a2, b1, b2));
}

function orientation(a: PointM, b: PointM, c: PointM): -1 | 0 | 1 {
  const value = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
  if (Math.abs(value) < 1e-9) return 0;
  return value > 0 ? 1 : -1;
}

function pointOnSegment(point: PointM, a: PointM, b: PointM): boolean {
  return point.x <= Math.max(a.x, b.x) + 1e-9 &&
    point.x >= Math.min(a.x, b.x) - 1e-9 &&
    point.y <= Math.max(a.y, b.y) + 1e-9 &&
    point.y >= Math.min(a.y, b.y) - 1e-9;
}

function segmentDistanceM(a1: PointM, a2: PointM, b1: PointM, b2: PointM): number {
  return Math.min(
    pointToSegmentDistanceM(a1, b1, b2),
    pointToSegmentDistanceM(a2, b1, b2),
    pointToSegmentDistanceM(b1, a1, a2),
    pointToSegmentDistanceM(b2, a1, a2),
  );
}

function pointToSegmentDistanceM(point: PointM, a: PointM, b: PointM): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq <= 0) return distanceM(point, a);
  const t = Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / lenSq));
  return distanceM(point, { x: a.x + dx * t, y: a.y + dy * t });
}

function ringsMinimumDistanceExact(a: RingM, b: RingM, maxSearchM: number): number {
  if (a.length === 0 || b.length === 0) return Number.POSITIVE_INFINITY;
  const aBounds = boundsForPoints(a);
  const bBounds = boundsForPoints(b);
  if (!boundsTouchOrOverlap(expandBounds(aBounds, maxSearchM), expandBounds(bBounds, maxSearchM))) {
    return Number.POSITIVE_INFINITY;
  }
  let best = Number.POSITIVE_INFINITY;
  for (const aPoint of a) {
    for (const bPoint of b) {
      const candidate = distanceM(aPoint, bPoint);
      if (candidate < best) best = candidate;
    }
  }
  return best;
}

function envelopeMajorAxisMeters(zones: WaterReaderPlacedZone[]): number {
  const points = zones.flatMap((zone) => visibleOrUnclippedRing(zone)).filter(validPoint);
  const bounds = boundsForPoints(points.length > 0 ? points : zones.map((zone) => zone.ovalCenter));
  return Math.hypot(bounds.maxX - bounds.minX, bounds.maxY - bounds.minY);
}

function ringArea(ring: RingM): number {
  if (ring.length < 3) return 0;
  let area = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i]!;
    const b = ring[(i + 1) % ring.length]!;
    area += a.x * b.y - b.x * a.y;
  }
  return area / 2;
}

function pointInRing(point: PointM, ring: RingM): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i]!;
    const b = ring[j]!;
    const crosses = (a.y > point.y) !== (b.y > point.y) &&
      point.x < ((b.x - a.x) * (point.y - a.y)) / ((b.y - a.y) || 1e-9) + a.x;
    if (crosses) inside = !inside;
  }
  return inside;
}

function stableHash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash).toString(36);
}

function selectOverCapDisplayUnits(params: {
  sortedUnits: DisplayUnit[];
  displayCap: number;
  legendByEntryId: Map<string, WaterReaderLegendEntry>;
  legendByZoneId: Map<string, WaterReaderLegendEntry>;
}): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  const displayedUnits = fillDisplayCap(params.sortedUnits, params.displayCap);
  const displayedIds = new Set(displayedUnits.map((unit) => unit.unitId));
  const retainedUnits = params.sortedUnits.filter((unit) => !displayedIds.has(unit.unitId));
  return rebalanceDisplayDiversity({
    displayedUnits,
    retainedUnits,
    displayCap: params.displayCap,
    legendByEntryId: params.legendByEntryId,
    legendByZoneId: params.legendByZoneId,
  });
}

function fillDisplayCap(units: DisplayUnit[], displayCap: number): DisplayUnit[] {
  const displayed: DisplayUnit[] = [];
  let remainingCap = displayCap;
  for (const unit of units) {
    if (unit.entryCost <= remainingCap) {
      displayed.push(unit);
      remainingCap -= unit.entryCost;
    }
  }
  return displayed.sort(compareDisplayUnits);
}

function rebalanceDisplayDiversity(params: {
  displayedUnits: DisplayUnit[];
  retainedUnits: DisplayUnit[];
  displayCap: number;
  legendByEntryId: Map<string, WaterReaderLegendEntry>;
  legendByZoneId: Map<string, WaterReaderLegendEntry>;
}): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  if (params.retainedUnits.length === 0) return params;
  const titleBalanced = rebalanceRepeatedLegendTitle(params);
  return rebalanceDominantFeatureFamily({
    ...params,
    displayedUnits: titleBalanced.displayedUnits,
    retainedUnits: titleBalanced.retainedUnits,
  });
}

function rebalanceRepeatedLegendTitle(params: {
  displayedUnits: DisplayUnit[];
  retainedUnits: DisplayUnit[];
  displayCap: number;
  legendByEntryId: Map<string, WaterReaderLegendEntry>;
  legendByZoneId: Map<string, WaterReaderLegendEntry>;
}): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  const titleCounts = countUnitTitles(params.displayedUnits, params.legendByEntryId, params.legendByZoneId);
  const dominant = [...titleCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  if (!dominant || dominant[1] <= repeatedLegendTitleMax(params.displayCap)) return params;
  const [dominantTitle] = dominant;
  const promoted = params.retainedUnits.find((unit) => {
    const titles = unitDiversityKeys(unit, params.legendByEntryId, params.legendByZoneId);
    return titles.some((title) => title !== dominantTitle) &&
      params.displayedUnits.some((displayed) => {
        const displayedTitles = unitDiversityKeys(displayed, params.legendByEntryId, params.legendByZoneId);
        return displayedTitles.length > 0 &&
          displayedTitles.every((title) => title === dominantTitle) &&
          displayed.entryCost >= unit.entryCost &&
          structurallyComparableForDiversity(unit, displayed);
      });
  });
  if (!promoted) return params;

  const demoted = [...params.displayedUnits].reverse().find((unit) => {
    const titles = unitDiversityKeys(unit, params.legendByEntryId, params.legendByZoneId);
    return titles.length > 0 &&
      titles.every((title) => title === dominantTitle) &&
      unit.entryCost >= promoted.entryCost &&
      structurallyComparableForDiversity(promoted, unit);
  });
  if (!demoted) return params;

  const nextDisplayed = params.displayedUnits
    .filter((unit) => unit.unitId !== demoted.unitId)
    .concat([{ ...promoted, rankingDiagnostics: unique([...promoted.rankingDiagnostics, 'displayed_title_diversity_rebalance']) }])
    .sort(compareDisplayUnits);
  const nextRetained = params.retainedUnits
    .filter((unit) => unit.unitId !== promoted.unitId)
    .concat([{ ...demoted, rankingDiagnostics: unique([...demoted.rankingDiagnostics, 'retained_title_diversity_rebalance']) }])
    .sort(compareDisplayUnits);

  const used = nextDisplayed.reduce((sum, unit) => sum + unit.entryCost, 0);
  if (used > params.displayCap) return params;
  let remainingCap = params.displayCap - used;
  const filledDisplayed = [...nextDisplayed];
  const filledRetained: DisplayUnit[] = [];
  for (const unit of nextRetained) {
    if (unit.entryCost <= remainingCap) {
      filledDisplayed.push(unit);
      remainingCap -= unit.entryCost;
    } else {
      filledRetained.push(unit);
    }
  }

  return {
    displayedUnits: filledDisplayed.sort(compareDisplayUnits),
    retainedUnits: filledRetained.sort(compareDisplayUnits),
  };
}

function rebalanceDominantFeatureFamily(params: {
  displayedUnits: DisplayUnit[];
  retainedUnits: DisplayUnit[];
  displayCap: number;
  legendByEntryId: Map<string, WaterReaderLegendEntry>;
  legendByZoneId: Map<string, WaterReaderLegendEntry>;
}): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  if (params.retainedUnits.length === 0 || params.displayedUnits.length < 5) return params;
  const classCounts = countUnitPrimaryFeatureClasses(params.displayedUnits);
  const dominant = [...classCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  if (!dominant || dominant[1] <= featureClassMax(params.displayCap)) return params;
  const [dominantClass] = dominant;
  if (dominantClass === 'main_lake_point') return params;
  const promoted = params.retainedUnits.find((unit) =>
    unitPrimaryFeatureClass(unit) !== dominantClass &&
    params.displayedUnits.some((displayed) =>
      unitPrimaryFeatureClass(displayed) === dominantClass &&
      displayed.entryCost >= unit.entryCost &&
      structurallyComparableForDiversity(unit, displayed)
    )
  );
  if (!promoted) return params;

  const demoted = [...params.displayedUnits]
    .filter((unit) =>
      unitPrimaryFeatureClass(unit) === dominantClass &&
      unit.entryCost >= promoted.entryCost &&
      structurallyComparableForDiversity(promoted, unit)
    )
    .sort((a, b) => a.sort.displayUsefulnessScore - b.sort.displayUsefulnessScore || compareDisplayUnits(b, a))[0];
  if (!demoted) return params;

  const nextDisplayed = params.displayedUnits
    .filter((unit) => unit.unitId !== demoted.unitId)
    .concat([{ ...promoted, rankingDiagnostics: unique([...promoted.rankingDiagnostics, 'displayed_feature_family_diversity_rebalance']) }])
    .sort(compareDisplayUnits);
  const nextRetained = params.retainedUnits
    .filter((unit) => unit.unitId !== promoted.unitId)
    .concat([{ ...demoted, rankingDiagnostics: unique([...demoted.rankingDiagnostics, 'retained_feature_family_diversity_rebalance']) }])
    .sort(compareDisplayUnits);

  const used = nextDisplayed.reduce((sum, unit) => sum + unit.entryCost, 0);
  if (used > params.displayCap) return params;
  let remainingCap = params.displayCap - used;
  const filledDisplayed = [...nextDisplayed];
  const filledRetained: DisplayUnit[] = [];
  for (const unit of nextRetained) {
    if (unit.entryCost <= remainingCap) {
      filledDisplayed.push(unit);
      remainingCap -= unit.entryCost;
    } else {
      filledRetained.push(unit);
    }
  }

  return {
    displayedUnits: filledDisplayed.sort(compareDisplayUnits),
    retainedUnits: filledRetained.sort(compareDisplayUnits),
  };
}

function countUnitTitles(
  units: DisplayUnit[],
  legendByEntryId: Map<string, WaterReaderLegendEntry>,
  legendByZoneId: Map<string, WaterReaderLegendEntry>,
): Map<string, number> {
  const counts = new Map<string, number>();
  for (const unit of units) {
    for (const key of unitDiversityKeys(unit, legendByEntryId, legendByZoneId)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

function countUnitPrimaryFeatureClasses(units: DisplayUnit[]): Map<WaterReaderFeatureClass, number> {
  const counts = new Map<WaterReaderFeatureClass, number>();
  for (const unit of units) {
    const featureClass = unitPrimaryFeatureClass(unit);
    counts.set(featureClass, (counts.get(featureClass) ?? 0) + 1);
  }
  return counts;
}

function unitPrimaryFeatureClass(unit: DisplayUnit): WaterReaderFeatureClass {
  return [...unique(unit.zones.map((zone) => zone.featureClass))]
    .sort((a, b) => featurePriority(a) - featurePriority(b) || a.localeCompare(b))[0] ?? 'universal';
}

function structurallyComparableForDiversity(promoted: DisplayUnit, demoted: DisplayUnit): boolean {
  const promotedScore = prominenceScore(promoted);
  const demotedScore = prominenceScore(demoted);
  if (promotedScore < 35 && promotedScore < demotedScore * 0.55) return false;
  if ((unitPrimaryFeatureClass(demoted) === 'dam' || unitPrimaryFeatureClass(demoted) === 'neck') && demotedScore >= 35 && promotedScore < demotedScore * 0.75) return false;
  if (promoted.sort.priority > demoted.sort.priority + 2) return false;
  if (promoted.sort.confluenceStrengthRank > demoted.sort.confluenceStrengthRank + 1) return false;
  return true;
}

function prominenceScore(unit: DisplayUnit): number {
  return Math.max(...unit.zones.map((zone) => numericDiagnostic(zone.diagnostics.featureProminenceScore)), unit.sort.score, 0);
}

function featureClassMax(displayCap: number): number {
  if (displayCap <= 5) return 3;
  if (displayCap <= 9) return 4;
  return 5;
}

function repeatedLegendTitleMax(displayCap: number): number {
  if (displayCap <= 5) return 2;
  return 3;
}

function unitDiversityKeys(
  unit: DisplayUnit,
  legendByEntryId: Map<string, WaterReaderLegendEntry>,
  legendByZoneId: Map<string, WaterReaderLegendEntry>,
): string[] {
  if (unit.entryType === 'structure_confluence') {
    const memberKinds = unique(unit.zones.map((zone) => zone.placementKind)).sort((a, b) => a.localeCompare(b));
    return [`structure_confluence:${memberKinds.join('+')}`];
  }
  if (unit.entryType === 'neck_area') {
    return ['neck_area:neck_structure_area'];
  }
  return unit.zones
    .map((zone) => legendByZoneId.get(zone.zoneId)?.placementKind ?? zone.placementKind ?? legendByZoneId.get(zone.zoneId)?.templateId ?? zone.featureClass)
    .filter((title): title is string => Boolean(title));
}

function buildDisplayUnits(zoneResult: WaterReaderZonePlacementResult): DisplayUnit[] {
  const zonesById = new Map(zoneResult.zones.map((zone) => [zone.zoneId, zone]));
  const confluenceByZoneId = new Map<string, WaterReaderStructureConfluenceGroup>();
  for (const group of zoneResult.diagnostics.confluenceGroups) {
    for (const zoneId of group.memberZoneIds) confluenceByZoneId.set(zoneId, group);
  }
  const confluenceSplitDiagnosticsByZoneId = new Map<string, Record<string, number | string | boolean | string[] | null>>();

  const units: DisplayUnit[] = [];
  const consumedZoneIds = new Set<string>();
  for (const group of zoneResult.diagnostics.confluenceGroups) {
    const memberZones = group.memberZoneIds
      .map((zoneId) => zonesById.get(zoneId))
      .filter((member): member is WaterReaderPlacedZone => Boolean(member));
    if (memberZones.length === 0) continue;
    if (sameNeckShoulderUnit(memberZones)) {
      for (const zone of memberZones) consumedZoneIds.add(zone.zoneId);
      const unitId = `neck-area-${memberZones[0]?.sourceFeatureId ?? group.groupId}`;
      units.push({
        unitId,
        entryType: 'neck_area',
        zones: memberZones.sort((a, b) => a.zoneId.localeCompare(b.zoneId)),
        entryCost: 1,
        displayReadability: defaultDisplayReadability(),
        ...unitSort(memberZones, unitId, zoneResult.season),
        rankingDiagnostics: ['same_neck_shoulders_grouped'],
      });
      continue;
    }
    if (mixedIslandLineFallbackConfluence(memberZones)) {
      for (const zone of memberZones) {
        confluenceSplitDiagnosticsByZoneId.set(zone.zoneId, {
          confluenceMergeRejectedReason: 'mixed_island_line_fallback_not_compact',
          confluenceRejectedOversizedIslandMember: memberZones.some((member) => member.featureClass === 'island'),
        });
      }
      continue;
    }
    if (!group.crossFeatureOverlapPair) {
      for (const zone of memberZones) {
        confluenceSplitDiagnosticsByZoneId.set(zone.zoneId, {
          confluenceMergeRejectedReason: 'same_feature_overlap_rendered_as_member_zones',
          sameFeatureOverlapRenderedAsMemberZones: true,
        });
      }
      continue;
    }
    for (const zone of memberZones) consumedZoneIds.add(zone.zoneId);
    units.push({
      unitId: group.groupId,
      entryType: 'structure_confluence',
      zones: memberZones,
      confluenceGroup: group,
      entryCost: 1,
      displayReadability: defaultDisplayReadability(),
      ...unitSort(memberZones, group.groupId, zoneResult.season, group),
    });
  }

  const unitsByKey = new Map<string, WaterReaderPlacedZone[]>();
  for (const zone of zoneResult.zones) {
    if (consumedZoneIds.has(zone.zoneId)) continue;
    const annotatedZone = confluenceSplitDiagnosticsByZoneId.has(zone.zoneId)
      ? annotateZoneDiagnostics(zone, confluenceSplitDiagnosticsByZoneId.get(zone.zoneId)!)
      : zone;
    const key = displayUnitKey(annotatedZone);
    const zones = unitsByKey.get(key) ?? [];
    zones.push(annotatedZone);
    unitsByKey.set(key, zones);
  }

  for (const [key, zones] of [...unitsByKey.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const sameNeckShoulders = sameNeckShoulderUnit(zones);
    units.push({
      unitId: key,
      entryType: sameNeckShoulders ? 'neck_area' : 'standalone_zone',
      zones: zones.sort((a, b) => a.zoneId.localeCompare(b.zoneId)),
      entryCost: sameNeckShoulders ? 1 : zones.length,
      displayReadability: defaultDisplayReadability(),
      ...unitSort(zones, key, zoneResult.season),
    });
  }

  return units;
}

function displayUnitKey(zone: WaterReaderPlacedZone): string {
  if (zone.featureClass === 'universal') return zone.zoneId;
  return `${zone.featureClass}:${zone.sourceFeatureId}`;
}

function sameNeckShoulderUnit(zones: WaterReaderPlacedZone[]): boolean {
  if (zones.length < 2) return false;
  const sourceIds = unique(zones.map((zone) => zone.sourceFeatureId));
  return sourceIds.length === 1 &&
    zones.every((zone) => zone.featureClass === 'neck' && zone.placementKind === 'neck_shoulder');
}

function firstLegendForZones(
  zones: WaterReaderPlacedZone[],
  legendByZoneId: Map<string, WaterReaderLegendEntry>,
): WaterReaderLegendEntry | undefined {
  return zones
    .map((zone) => legendByZoneId.get(zone.zoneId))
    .find((entry): entry is WaterReaderLegendEntry => Boolean(entry));
}

function displayEntriesForUnit(
  unit: DisplayUnit,
  legendByEntryId: Map<string, WaterReaderLegendEntry>,
  legendByZoneId: Map<string, WaterReaderLegendEntry>,
  longestDimensionM?: number | null,
): WaterReaderDisplayEntry[] {
  if (unit.entryType === 'structure_confluence') {
    return [makeDisplayEntry({
      entryId: unit.unitId,
      entryType: 'structure_confluence',
      displayState: 'displayed_confluence',
      zones: unit.zones,
      legend: syntheticConfluenceLegend(unit, legendByZoneId),
      confluenceGroup: unit.confluenceGroup,
      longestDimensionM,
      sort: unit.sort,
      displayReadability: unit.displayReadability,
      rankingDiagnostics: unit.rankingDiagnostics,
    })];
  }
  if (unit.entryType === 'neck_area') {
    return [makeDisplayEntry({
      entryId: unit.unitId,
      entryType: 'neck_area',
      displayState: 'displayed_neck_area',
      zones: unit.zones.map((zone) => annotateZoneDiagnostics(zone, {
        sameNeckShouldersGrouped: true,
        sameNeckShoulderGroupFeatureId: zone.sourceFeatureId,
        sameNeckShoulderMemberZoneIds: unit.zones.map((member) => member.zoneId),
        neckAreaRetainedForReadability: false,
      })),
      legend: syntheticNeckAreaLegend(unit),
      longestDimensionM,
      sort: unit.sort,
      displayReadability: unit.displayReadability,
      rankingDiagnostics: unique([...unit.rankingDiagnostics, 'same_neck_shoulders_grouped']),
    })];
  }

  return unit.zones.map((zone) => makeDisplayEntry({
    entryId: zone.zoneId,
    entryType: 'standalone_zone',
    displayState: 'displayed_standalone',
    zones: [zone],
    legend: standaloneLegendForZone(zone, legendByZoneId.get(zone.zoneId) ?? firstLegendForZones([zone], legendByZoneId)),
    longestDimensionM,
    sort: {
      ...unit.sort,
      stableZoneId: zone.zoneId,
      stableId: stableEntryId(zone.zoneId, [zone.sourceFeatureId], [zone.zoneId]),
    },
    displayReadability: displayReadabilityForZones([zone], unit.displayReadability),
    rankingDiagnostics: unit.rankingDiagnostics,
  }));
}

function standaloneLegendForZone(zone: WaterReaderPlacedZone, legend: WaterReaderLegendEntry | undefined): WaterReaderLegendEntry | undefined {
  const resolvedLegend = legend ?? syntheticStandaloneLegendForZone(zone);
  const displaySubtype = typeof zone.diagnostics.constrictionDisplaySubtype === 'string' ? zone.diagnostics.constrictionDisplaySubtype : '';
  if (zone.featureClass === 'neck' && displaySubtype === 'pinch') {
    return {
      ...resolvedLegend,
      title: pinchLegendTitle(resolvedLegend.title),
      templateId: `${resolvedLegend.templateId}:display-pinch`,
    };
  }
  return resolvedLegend;
}

function syntheticStandaloneLegendForZone(zone: WaterReaderPlacedZone): WaterReaderLegendEntry {
  return {
    entryId: zone.zoneId,
    zoneId: zone.zoneId,
    zoneIds: [zone.zoneId],
    featureClass: zone.featureClass,
    placementKind: zone.placementKind,
    placementKinds: [zone.placementKind],
    colorHex: WATER_READER_FEATURE_COLORS[zone.featureClass],
    templateId: `synthetic:${zone.featureClass}:${zone.placementKind}`,
    title: `${confluenceFeatureClassLabel(zone.featureClass)} - Structure Area`,
    body: 'Focus on the displayed physical structure area and its edges.',
    isConfluence: false,
  };
}

function pinchLegendTitle(title: string): string {
  return title.includes('Neck') ? title.replace(/\bNeck\b/, 'Pinch') : 'Pinch - Structure Area';
}

function syntheticConfluenceLegend(
  unit: DisplayUnit,
  legendByZoneId: Map<string, WaterReaderLegendEntry>,
): WaterReaderLegendEntry {
  const memberSummary = finalMemberSummary(unit, legendByZoneId);
  const crossFeaturePair = unit.confluenceGroup?.crossFeatureOverlapPair ??
    unit.zones.map((zone) => zone.diagnostics.crossFeatureOverlapPair).find((pair): pair is string => typeof pair === 'string' && pair.length > 0);
  const title = crossFeaturePair || confluenceFeatureClassLabelCount(unit.zones) > 1
    ? crossFeatureStructureAreaTitleForZones(unit.zones)
    : `Structure Confluence - ${memberSummary}`;
  return {
    entryId: unit.unitId,
    zoneId: unit.zones[0]?.zoneId ?? unit.unitId,
    zoneIds: unit.zones.map((zone) => zone.zoneId),
    featureClass: 'structure_confluence',
    placementKinds: unique(unit.zones.map((zone) => zone.placementKind)),
    colorHex: WATER_READER_FEATURE_COLORS.structure_confluence,
    templateId: 'normalized_structure_confluence',
    title,
    body: 'Multiple polygon structure cues overlap in one compact area.',
    isConfluence: true,
  };
}

function crossFeatureStructureAreaTitleForZones(zones: WaterReaderPlacedZone[]): string {
  return `${confluenceFeatureClassTitle(zones)} - Structure Area`;
}

function confluenceFeatureClassTitle(zones: WaterReaderPlacedZone[]): string {
  const labels: string[] = [];
  const seen = new Set<string>();
  for (const featureClass of CONFLUENCE_FEATURE_TITLE_ORDER) {
    if (!zones.some((zone) => zone.featureClass === featureClass)) continue;
    const label = confluenceFeatureClassLabel(featureClass);
    if (seen.has(label)) continue;
    seen.add(label);
    labels.push(label);
  }
  return labels.join(' + ') || 'Structure';
}

function confluenceFeatureClassLabelCount(zones: WaterReaderPlacedZone[]): number {
  return new Set(zones.map((zone) => confluenceFeatureClassLabel(zone.featureClass))).size;
}

const CONFLUENCE_FEATURE_TITLE_ORDER: WaterReaderFeatureClass[] = [
  'cove',
  'island',
  'main_lake_point',
  'secondary_point',
  'neck',
  'saddle',
  'dam',
  'universal',
];

function confluenceFeatureClassLabel(featureClass: WaterReaderFeatureClass): string {
  if (featureClass === 'main_lake_point' || featureClass === 'secondary_point') return 'Point';
  return featureClass
    .split('_')
    .map((part) => part[0]!.toUpperCase() + part.slice(1))
    .join(' ');
}

function syntheticNeckAreaLegend(unit: DisplayUnit): WaterReaderLegendEntry {
  return {
    entryId: unit.unitId,
    zoneId: unit.zones[0]?.zoneId ?? unit.unitId,
    zoneIds: unit.zones.map((zone) => zone.zoneId),
    featureClass: 'neck',
    placementKind: 'neck_shoulder',
    placementKinds: ['neck_shoulder'],
    colorHex: WATER_READER_FEATURE_COLORS.neck,
    templateId: 'neck:spring:shoulder_area',
    title: 'Neck - Shoulder Area',
    body: 'This grouped neck entry marks the paired shoulder area from the same detected neck feature.',
    isConfluence: false,
  };
}

function finalMemberSummary(
  unit: DisplayUnit,
  legendByZoneId: Map<string, WaterReaderLegendEntry>,
): string {
  const counts = new Map<string, number>();
  for (const zone of unit.zones) {
    const label = confluenceMemberLabel(zone, legendByZoneId.get(zone.zoneId));
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([label, count]) => count > 1 ? `${label} x${count}` : label)
    .join(' + ');
}

function confluenceMemberLabel(zone: WaterReaderPlacedZone, legend?: WaterReaderLegendEntry): string {
  const envelopeLabel = featureEnvelopeMemberLabel(zone.placementKind);
  if (envelopeLabel) return envelopeLabel;
  const islandMainlandLabel = islandMainlandConfluenceMemberLabel(zone);
  if (islandMainlandLabel) return islandMainlandLabel;
  const openWaterLabel = openWaterConfluenceMemberLabel(zone);
  if (openWaterLabel) return openWaterLabel;
  const secondaryPointLabel = secondaryPointConfluenceMemberLabel(zone.anchorSemanticId);
  if (zone.featureClass === 'secondary_point' && secondaryPointLabel) return secondaryPointLabel;
  const coveLabel = coveConfluenceMemberLabel(zone.anchorSemanticId);
  if (zone.featureClass === 'cove' && coveLabel) return coveLabel;
  if (zone.placementKind === 'neck_shoulder') return 'Neck Shoulder';
  if (legend?.title) return legend.title.replace(/^[^-]+ - /, '');
  if (zone.placementKind === 'main_point_side') return 'Point Side';
  return featureLabel(zone.featureClass);
}

function featureEnvelopeMemberLabel(placementKind: WaterReaderZonePlacementKind): string | null {
  switch (placementKind) {
    case 'main_point_structure_area':
      return 'Main Point Structure Area';
    case 'secondary_point_structure_area':
      return 'Secondary Point Structure Area';
    case 'cove_structure_area':
      return 'Cove Structure Area';
    case 'neck_structure_area':
      return 'Neck Structure Area';
    case 'saddle_structure_area':
      return 'Saddle Structure Area';
    case 'island_structure_area':
      return 'Island Structure Area';
    case 'dam_structure_area':
      return 'Dam Structure Area';
    default:
      return null;
  }
}

function islandMainlandConfluenceMemberLabel(zone: WaterReaderPlacedZone): string | null {
  if (zone.featureClass === 'island' && zone.placementKind === 'island_endpoint' && zone.anchorSemanticId === 'shoreline_frame_recovery') {
    return 'Island Endpoint Recovery';
  }
  if (zone.featureClass !== 'island' || zone.placementKind !== 'island_mainland') return null;
  switch (zone.anchorSemanticId) {
    case 'island_mainland_primary':
      return 'Island Mainland-Facing Edge';
    case 'island_mainland_recovery':
      return 'Island Mainland Recovery';
    case 'island_shoreline_recovery':
    case 'island_alternate_endpoint_recovery':
    case 'island_open_water_recovery':
    case 'shoreline_frame_recovery':
      return 'Island Shoreline Recovery';
    default:
      return 'Island Edge';
  }
}

function openWaterConfluenceMemberLabel(zone: WaterReaderPlacedZone): string | null {
  if (zone.featureClass === 'main_lake_point' && zone.placementKind === 'main_point_open_water') {
    return zone.anchorSemanticId === 'main_point_open_water_area' ? 'Point Open-Water Side' : 'Point Broad-Water Recovery';
  }
  if (zone.featureClass === 'island' && zone.placementKind === 'island_open_water') {
    if (zone.anchorSemanticId === 'island_open_water_area') return 'Island Open-Water Edge';
    if (zone.anchorSemanticId === 'island_open_water_same_side_recovery' || zone.anchorSemanticId === 'island_open_water_recovery') {
      return 'Island Open-Water Recovery';
    }
    return 'Island Shoreline Recovery';
  }
  return null;
}

function secondaryPointConfluenceMemberLabel(anchorSemanticId: WaterReaderZonePlacementSemanticId | undefined): string | null {
  switch (anchorSemanticId) {
    case 'secondary_point_back_true':
      return 'Secondary Point Back-Facing Side';
    case 'secondary_point_mouth_true':
      return 'Secondary Point Mouth-Facing Side';
    case 'secondary_point_parent_cove_missing':
    case 'secondary_point_parent_cove_axis_recovery':
    case 'secondary_point_back_proxy':
    case 'secondary_point_mouth_proxy':
    case 'secondary_point_side_recovery':
    case 'secondary_point_tip_transition':
      return 'Secondary Point Cove-Side Recovery';
    default:
      return null;
  }
}

function coveConfluenceMemberLabel(anchorSemanticId: WaterReaderZonePlacementSemanticId | undefined): string | null {
  switch (anchorSemanticId) {
    case 'cove_back_primary':
      return 'Cove Back Shoreline';
    case 'cove_back_pocket_recovery':
    case 'cove_back_pocket_recovery_left':
    case 'cove_back_pocket_recovery_right':
      return 'Cove Back Pocket';
    case 'cove_inner_shoreline_left':
    case 'cove_inner_shoreline_right':
    case 'cove_inner_wall_midpoint_left':
    case 'cove_inner_wall_midpoint_right':
      return 'Cove Inner Shoreline';
    case 'cove_mouth_shoulder_recovery':
    case 'cove_mouth_primary':
    case 'cove_opposite_mouth':
    case 'cove_near_mouth_inner_wall':
    case 'cove_near_mouth_inner_wall_opposite':
      return 'Cove Mouth';
    default:
      return null;
  }
}

function featureLabel(featureClass: WaterReaderFeatureClass): string {
  return featureClass
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function makeDisplayEntry(params: {
  entryId: string;
  entryType: WaterReaderDisplayEntryType;
  displayState: Extract<WaterReaderDisplayState, 'displayed_standalone' | 'displayed_confluence' | 'displayed_neck_area'>;
  zones: WaterReaderPlacedZone[];
  legend?: WaterReaderLegendEntry;
  confluenceGroup?: WaterReaderStructureConfluenceGroup;
  longestDimensionM?: number | null;
  sort: WaterReaderDisplayEntry['sort'];
  displayReadability: WaterReaderDisplayReadabilityDiagnostics;
  rankingDiagnostics: string[];
}): WaterReaderDisplayEntry {
  const featureClasses = unique(params.zones.map((zone) => zone.featureClass));
  const placementKinds = unique(params.zones.map((zone) => zone.placementKind));
  const sourceFeatureIds = unique(params.zones.map((zone) => zone.sourceFeatureId));
  const majorAxisM = Math.max(...params.zones.map((zone) => zone.majorAxisM), 0);
  const colorHex = params.entryType === 'structure_confluence'
    ? WATER_READER_FEATURE_COLORS.structure_confluence
    : WATER_READER_FEATURE_COLORS[params.zones[0]?.featureClass ?? 'universal'];

  return {
    entryId: params.entryId,
    entryType: params.entryType,
    displayState: params.displayState,
    displayNumber: null,
    zoneIds: params.zones.map((zone) => zone.zoneId),
    sourceFeatureIds,
    featureClasses,
    placementKinds,
    confluenceGroupId: params.confluenceGroup?.groupId,
    confluenceStrength: params.confluenceGroup?.strength,
    legendEntryId: params.legend?.entryId ?? params.legend?.zoneId,
    legendTemplateId: params.legend?.templateId,
    legend: params.legend,
    colorHex,
    transitionWarning: params.legend?.transitionWarning,
    zones: params.zones.map((zone) => displayZoneGeometry(zone, params.longestDimensionM)),
    majorAxisM,
    majorAxisPctOfLakeLongestDimension: majorAxisPct(majorAxisM, params.longestDimensionM),
    displayReadability: params.displayReadability,
    rankingDiagnostics: params.rankingDiagnostics,
    sort: params.sort,
  };
}

function displayLegendForEntry(
  entry: WaterReaderDisplayEntry,
  legendEntry: WaterReaderLegendEntry,
  displayNumber: number,
): WaterReaderLegendEntry {
  return {
    ...legendEntry,
    number: displayNumber,
    entryId: entry.entryId,
    zoneId: entry.zoneIds[0] ?? legendEntry.zoneId,
    zoneIds: entry.zoneIds,
    featureClass: entry.entryType === 'structure_confluence' ? 'structure_confluence' : entry.featureClasses[0],
    placementKind: entry.placementKinds[0],
    placementKinds: entry.placementKinds,
    colorHex: entry.colorHex,
    isConfluence: entry.entryType === 'structure_confluence',
  };
}

function displayZoneGeometry(zone: WaterReaderPlacedZone, longestDimensionM?: number | null): WaterReaderDisplayZoneGeometry {
  return {
    zoneId: zone.zoneId,
    sourceFeatureId: zone.sourceFeatureId,
    featureClass: zone.featureClass,
    placementKind: zone.placementKind,
    placementSemanticId: zone.placementSemanticId,
    anchorSemanticId: zone.anchorSemanticId,
    anchor: zone.anchor,
    center: zone.ovalCenter,
    majorAxisM: zone.majorAxisM,
    majorAxisPctOfLakeLongestDimension: majorAxisPct(zone.majorAxisM, longestDimensionM),
    minorAxisM: zone.minorAxisM,
    rotationRad: zone.rotationRad,
    visibleWaterFraction: zone.visibleWaterFraction,
    visibleWaterRing: zone.visibleWaterRing,
    unclippedRing: zone.unclippedRing,
    colorHex: WATER_READER_FEATURE_COLORS[zone.featureClass],
    qaFlags: zone.qaFlags,
    diagnostics: zone.diagnostics,
  };
}

function suppressedEntryFromCoverage(coverage: WaterReaderFeatureZoneCoverage): WaterReaderSuppressedDisplayEntry {
  return {
    entryId: coverage.featureId,
    sourceFeatureId: coverage.featureId,
    featureClass: coverage.featureClass,
    displayState: suppressedStateForReason(coverage.reason),
    reason: coverage.reason,
  };
}

function suppressedStateForReason(reason: WaterReaderFeatureZoneCoverage['reason']): WaterReaderSuppressedDisplayEntry['displayState'] {
  if (reason === 'parent_cove_not_zoned') return 'suppressed_dependency';
  if (reason === 'seasonal_skip' || reason === 'feature_unit_not_selected') return 'suppressed_invalid_geometry';
  if (reason === 'no_valid_draft' || reason.startsWith('rejected_invariant:')) return 'suppressed_failed_invariants';
  if (
    reason === 'unrenderable_tight_constriction' ||
    reason === 'micro_island_unrenderable_without_open_water_zone' ||
    reason === 'island_edge_zone_failed_hard_invariants' ||
    reason === 'rejected_heavy_pair_overlap'
  ) {
    return 'suppressed_failed_invariants';
  }
  return 'suppressed_invalid_geometry';
}

function compareDisplayUnits(a: DisplayUnit, b: DisplayUnit): number {
  return compareSort(a.sort, b.sort);
}

function compareSort(a: WaterReaderDisplayEntry['sort'], b: WaterReaderDisplayEntry['sort']): number {
  return (
    a.priority - b.priority ||
    a.confluenceStrengthRank - b.confluenceStrengthRank ||
    b.score - a.score ||
    b.seasonalRelevanceScore - a.seasonalRelevanceScore ||
    b.majorAxisM - a.majorAxisM ||
    a.readabilityRank - b.readabilityRank ||
    b.displayUsefulnessScore - a.displayUsefulnessScore ||
    a.stableSourceFeatureId.localeCompare(b.stableSourceFeatureId) ||
    a.stableZoneId.localeCompare(b.stableZoneId) ||
    a.stableId.localeCompare(b.stableId)
  );
}

function unitSort(
  zones: WaterReaderPlacedZone[],
  unitId: string,
  season: WaterReaderZonePlacementResult['season'],
  confluenceGroup?: WaterReaderStructureConfluenceGroup,
): Pick<DisplayUnit, 'sort' | 'rankingDiagnostics'> {
  const featureClasses = unique(zones.map((zone) => zone.featureClass));
  const sourceFeatureIds = unique(zones.map((zone) => zone.sourceFeatureId));
  const zoneIds = zones.map((zone) => zone.zoneId);
  const majorAxisM = Math.max(...zones.map((zone) => zone.majorAxisM), 0);
  const sort = {
    priority: Math.min(...featureClasses.map(featurePriority)),
    readabilityRank: 0,
    displayUsefulnessScore: 0,
    confluenceStrengthRank: confluenceGroup?.strength === 'strong' ? 1 : confluenceGroup?.strength === 'light' ? 2 : 3,
    score: Math.max(...zones.map(zoneScore), 0),
    seasonalRelevanceScore: Math.max(...zones.map((zone) => seasonalRelevanceScore(zone, season)), 0),
    majorAxisM,
    stableSourceFeatureId: [...sourceFeatureIds].sort((a, b) => a.localeCompare(b))[0] ?? unitId,
    stableZoneId: [...zoneIds].sort((a, b) => a.localeCompare(b))[0] ?? unitId,
    stableId: stableEntryId(unitId, sourceFeatureIds, zoneIds),
  };
  return { sort, rankingDiagnostics: rankingDiagnostics(zones, sort.seasonalRelevanceScore) };
}

function selectionUnitDiagnostic(
  unit: DisplayUnit,
  displayState: WaterReaderDisplaySelectionUnitDiagnostic['displayState'],
): WaterReaderDisplaySelectionUnitDiagnostic {
  return {
    unitId: unit.unitId,
    entryType: unit.entryType,
    entryCost: unit.entryCost,
    displayState,
    zoneIds: unit.zones.map((zone) => zone.zoneId),
    sourceFeatureIds: unique(unit.zones.map((zone) => zone.sourceFeatureId)),
    featureClasses: unique(unit.zones.map((zone) => zone.featureClass)),
    placementKinds: unique(unit.zones.map((zone) => zone.placementKind)),
    confluenceGroupId: unit.confluenceGroup?.groupId,
    priority: unit.sort.priority,
    readabilityRank: unit.sort.readabilityRank,
    displayUsefulnessScore: unit.sort.displayUsefulnessScore,
    seasonalRelevanceScore: unit.sort.seasonalRelevanceScore,
    displayReadability: unit.displayReadability,
    score: unit.sort.score,
    majorAxisM: unit.sort.majorAxisM,
    rankingDiagnostics: unit.rankingDiagnostics,
  };
}

type ReadabilityContext = {
  scale: number;
  minX: number;
  maxY: number;
  padding: number;
};

function withDisplayReadability(
  units: DisplayUnit[],
  options: WaterReaderDisplayModelOptions,
): DisplayUnit[] {
  const context = buildReadabilityContext(units, options);
  return units.map((unit) => {
    const displayReadability = estimateDisplayReadability(unit.zones, context);
    const displayUsefulnessScore = displayUsefulnessScoreForUnit(unit, displayReadability);
    return {
      ...unit,
      displayReadability,
      sort: {
        ...unit.sort,
        readabilityRank: displayReadability.displayReadabilityTier === 'hard_tiny'
          ? 2
          : displayReadability.displayReadabilityTier === 'borderline_tiny'
            ? 1
            : 0,
        displayUsefulnessScore,
      },
      rankingDiagnostics: unique([
        ...unit.rankingDiagnostics,
        `display_readability:${displayReadability.displayReadabilityTier}`,
        `estimated_app_footprint_min_px:${formatDiagnosticNumber(displayReadability.estimatedAppFootprintMinDimensionPx)}`,
        `estimated_app_footprint_area_px:${formatDiagnosticNumber(displayReadability.estimatedAppFootprintAreaPx)}`,
        `display_usefulness_score:${formatDiagnosticNumber(displayUsefulnessScore)}`,
      ]),
    };
  });
}

function withConstrictionDisplayClasses(units: DisplayUnit[]): DisplayUnit[] {
  return units.map((unit) => {
    const zones = unit.zones.map((zone) => {
      if (zone.featureClass !== 'neck' && zone.featureClass !== 'saddle') return zone;
      const classification = constrictionDisplayClassForZone(zone, unit.displayReadability);
      const displayClass = classification.displayClass;
      const displaySubtype = constrictionDisplaySubtypeForZone(zone, displayClass, unit.displayReadability);
      return annotateZoneDiagnostics(zone, {
        constrictionDisplayClass: displayClass,
        constrictionDisplaySubtype: displaySubtype?.subtype ?? null,
        constrictionDisplaySubtypeReason: displaySubtype?.reason ?? null,
        constrictionDisplayAppFootprintMinPx: unit.displayReadability.estimatedAppFootprintMinDimensionPx,
        constrictionDisplayAppFootprintMaxPx: unit.displayReadability.estimatedAppFootprintMaxDimensionPx,
        constrictionDisplayAppFootprintAreaPx: unit.displayReadability.estimatedAppFootprintAreaPx,
        constrictionDisplayShoulderSeparationM: zone.diagnostics.constrictionSpanM ?? zone.majorAxisM,
        constrictionRecoveredFromTinyGate: classification.recoveryReason && !classification.saddleRecovery ? true : null,
        constrictionRecoveryReason: classification.recoveryReason && !classification.saddleRecovery ? classification.recoveryReason : null,
        saddleRecoveredFromBroadReview: classification.saddleRecovery === true ? true : null,
        saddleRecoveryReason: classification.saddleRecovery ? classification.recoveryReason ?? null : null,
      });
    });
    const displayClasses = unique(zones
      .map((zone) => typeof zone.diagnostics.constrictionDisplayClass === 'string' ? String(zone.diagnostics.constrictionDisplayClass) : '')
      .filter(Boolean));
    return {
      ...unit,
      zones,
      rankingDiagnostics: displayClasses.length > 0
        ? unique([...unit.rankingDiagnostics, ...displayClasses.map((displayClass) => `constriction_display_class:${displayClass}`)])
        : unit.rankingDiagnostics,
    };
  });
}

function constrictionDisplayClassForZone(
  zone: WaterReaderPlacedZone,
  displayReadability: WaterReaderDisplayReadabilityDiagnostics,
): ConstrictionDisplayClassification {
  const readabilityClass = typeof zone.diagnostics.constrictionReadabilityClass === 'string' ? zone.diagnostics.constrictionReadabilityClass : '';
  const widthToAverage = diagnosticNumber(zone.diagnostics.constrictionWidthToAverage);
  const confidence = diagnosticNumber(zone.diagnostics.constrictionConfidence);
  const weakerExpansionRatio = diagnosticNumber(zone.diagnostics.constrictionWeakerExpansionRatio);
  const expansionBalance = diagnosticNumber(zone.diagnostics.constrictionExpansionBalance);
  const oneSided = zone.diagnostics.constrictionOneSidedExpansion === true || expansionBalance < 0.62;
  const twoSided = zone.diagnostics.constrictionTwoSidedExpansion === true;
  const appMaxPx = displayReadability.estimatedAppFootprintMaxDimensionPx;
  const appAreaPx = displayReadability.estimatedAppFootprintAreaPx;
  const oldTinyGate = displayReadability.displayReadabilityTier !== 'readable' || appMaxPx < 16;
  const trulyUnreadable = appMaxPx < 8 && appAreaPx < 60;
  if (confidence > 0 && confidence < 0.58) return { displayClass: 'retained_questionable_constriction' };
  if (zone.featureClass === 'saddle') {
    if (
      readabilityClass === 'low_confidence_review' ||
      readabilityClass === 'one_sided_constriction_review' ||
      displayReadability.displayReadabilityTier === 'hard_tiny' ||
      trulyUnreadable
    ) return { displayClass: 'retained_questionable_constriction' };
    const broadSaddleOneSidedRisk = zone.diagnostics.constrictionOneSidedExpansion === true ||
      !twoSided ||
      expansionBalance < 0.68;
    if (
      widthToAverage >= 0.25 &&
      (
        appMaxPx < 20 ||
        broadSaddleOneSidedRisk
      )
    ) return { displayClass: 'broad_saddle' };
    const strongTwoSidedEvidence = twoSided && weakerExpansionRatio >= 2.4 && expansionBalance >= 0.68;
    const visuallySubstantialBroadSaddle = confidence >= 0.82 &&
      appMaxPx >= 20 &&
      appAreaPx >= 260 &&
      twoSided &&
      !broadSaddleOneSidedRisk &&
      strongTwoSidedEvidence;
    if (readabilityClass === 'broad_saddle_review') {
      return visuallySubstantialBroadSaddle
        ? {
            displayClass: 'display_saddle',
            recoveryReason: 'high_confidence_readable_broad_saddle',
            saddleRecovery: true,
          }
        : { displayClass: 'broad_saddle' };
    }
    return { displayClass: 'display_saddle' };
  }

  if (trulyUnreadable) return { displayClass: 'retained_questionable_constriction' };

  if (widthToAverage > 0 && widthToAverage <= 0.035 && confidence >= 0.85 && (appMaxPx >= 10 || appAreaPx >= 95)) {
    return {
      displayClass: 'channel_pinch',
      recoveryReason: oldTinyGate ? 'high_confidence_channel_pinch' : undefined,
    };
  }
  if (oneSided && confidence >= 0.82 && widthToAverage > 0 && widthToAverage <= 0.08 && weakerExpansionRatio >= 2.2 && (appMaxPx >= 8 || appAreaPx >= 60)) {
    return {
      displayClass: 'one_sided_pinch_review',
      recoveryReason: oldTinyGate ? 'high_confidence_one_sided_pinch' : undefined,
    };
  }
  if (readabilityClass === 'clear_two_sided_constriction' && confidence >= 0.85 && (appMaxPx >= 12 || appAreaPx >= 110)) {
    return {
      displayClass: 'clear_neck',
      recoveryReason: oldTinyGate ? 'high_confidence_clear_neck' : undefined,
    };
  }

  if (oldTinyGate) return { displayClass: 'retained_questionable_constriction' };
  if (widthToAverage > 0 && widthToAverage <= 0.035) return { displayClass: 'channel_pinch' };
  if (oneSided && weakerExpansionRatio < 6) return { displayClass: 'one_sided_pinch_review' };
  if (widthToAverage > 0 && widthToAverage <= 0.08 && expansionBalance < 0.65) return { displayClass: 'channel_pinch' };
  return { displayClass: 'clear_neck' };
}

function constrictionDisplaySubtypeForZone(
  zone: WaterReaderPlacedZone,
  displayClass: ConstrictionDisplayClass,
  displayReadability: WaterReaderDisplayReadabilityDiagnostics,
): ConstrictionDisplaySubtype | null {
  if (zone.featureClass !== 'neck') return null;
  const widthToAverage = diagnosticNumber(zone.diagnostics.constrictionWidthToAverage);
  const expansionBalance = diagnosticNumber(zone.diagnostics.constrictionExpansionBalance);
  const confidence = diagnosticNumber(zone.diagnostics.constrictionConfidence);
  const weakerExpansionRatio = diagnosticNumber(zone.diagnostics.constrictionWeakerExpansionRatio);
  const oneSided = zone.diagnostics.constrictionOneSidedExpansion === true || expansionBalance < 0.62;
  if (widthToAverage > 0 && widthToAverage <= 0.035) return { subtype: 'pinch', reason: 'narrow_width_ratio' };
  if (displayClass === 'channel_pinch') return { subtype: 'pinch', reason: 'channel_pinch' };
  if (
    displayClass === 'clear_neck' &&
    widthToAverage > 0 &&
    widthToAverage <= 0.11 &&
    confidence >= 0.9 &&
    weakerExpansionRatio >= 8 &&
    expansionBalance >= 0.7 &&
    displayReadability.estimatedAppFootprintMinDimensionPx < 14
  ) {
    return { subtype: 'pinch', reason: 'compact_two_sided_channel' };
  }
  if (oneSided && expansionBalance < 0.62 && widthToAverage > 0 && widthToAverage <= 0.08) {
    return { subtype: 'pinch', reason: 'one_sided_channel_like' };
  }
  return { subtype: 'neck' };
}

function buildReadabilityContext(
  units: DisplayUnit[],
  options: WaterReaderDisplayModelOptions,
): ReadabilityContext {
  const points: PointM[] = [];
  if (options.lakePolygon) points.push(...options.lakePolygon.exterior, ...options.lakePolygon.holes.flat());
  for (const unit of units) {
    for (const zone of unit.zones) {
      points.push(...visibleOrUnclippedRing(zone), zone.ovalCenter, zone.anchor);
    }
  }
  const bounds = boundsForPoints(points);
  const rawW = Math.max(1, bounds.maxX - bounds.minX);
  const rawH = Math.max(1, bounds.maxY - bounds.minY);
  const padM = Math.max(rawW, rawH) * 0.055;
  const minX = bounds.minX - padM;
  const maxX = bounds.maxX + padM;
  const maxY = bounds.maxY + padM;
  const worldW = Math.max(1, maxX - minX);
  const appMapWidth = options.appMapWidth ?? DEFAULT_APP_MAP_WIDTH;
  const padding = options.renderPadding ?? DEFAULT_RENDER_PADDING;
  const innerW = Math.max(1, appMapWidth - padding * 2);
  return { scale: innerW / worldW, minX, maxY, padding };
}

function estimateDisplayReadability(
  zones: WaterReaderPlacedZone[],
  context: ReadabilityContext,
): WaterReaderDisplayReadabilityDiagnostics {
  const points = zones.flatMap((zone) => visibleOrUnclippedRing(zone)).filter(validPoint);
  const svgPoints = points.map((point) => svgPointForReadability(point, context));
  const bounds = boundsForPoints(svgPoints);
  const width = Math.max(0, bounds.maxX - bounds.minX);
  const height = Math.max(0, bounds.maxY - bounds.minY);
  const area = width * height;
  const minDimension = Math.min(width, height);
  const maxDimension = Math.max(width, height);
  const tier: WaterReaderDisplayReadabilityTier =
    minDimension < HARD_TINY_MIN_DIMENSION_PX || area < HARD_TINY_AREA_PX
      ? 'hard_tiny'
      : maxDimension < BORDERLINE_TINY_MAX_DIMENSION_PX
        ? 'borderline_tiny'
        : 'readable';
  return {
    estimatedAppFootprintWidthPx: roundDiagnosticNumber(width),
    estimatedAppFootprintHeightPx: roundDiagnosticNumber(height),
    estimatedAppFootprintAreaPx: roundDiagnosticNumber(area),
    estimatedAppFootprintMinDimensionPx: roundDiagnosticNumber(minDimension),
    estimatedAppFootprintMaxDimensionPx: roundDiagnosticNumber(maxDimension),
    displayReadabilityTier: tier,
  };
}

function displayReadabilityForZones(
  zones: WaterReaderPlacedZone[],
  fallback: WaterReaderDisplayReadabilityDiagnostics,
): WaterReaderDisplayReadabilityDiagnostics {
  if (zones.length <= 1) return fallback;
  return fallback;
}

function displayUsefulnessScoreForUnit(
  unit: DisplayUnit,
  readability: WaterReaderDisplayReadabilityDiagnostics,
): number {
  const readabilityScore = readability.displayReadabilityTier === 'readable'
    ? 300
    : readability.displayReadabilityTier === 'borderline_tiny'
      ? -120
      : -1500;
  const areaScore = Math.min(1200, Math.sqrt(Math.max(0, readability.estimatedAppFootprintAreaPx)) * 14);
  const axisScore = Math.min(800, Math.max(0, unit.sort.majorAxisM) * 0.55);
  const zoneMetricScore = Math.min(650, Math.max(0, unit.sort.score) * 0.4);
  const confluenceScore = unit.confluenceGroup?.strength === 'strong'
    ? 220
    : unit.confluenceGroup?.strength === 'light'
      ? 90
      : 0;
  const featureWeight = Math.max(0, 9 - unit.sort.priority) * 38;
  const seasonalScore = unit.sort.seasonalRelevanceScore * 25;
  return roundDiagnosticNumber(readabilityScore + areaScore + axisScore + zoneMetricScore + confluenceScore + featureWeight + seasonalScore);
}

function defaultDisplayReadability(): WaterReaderDisplayReadabilityDiagnostics {
  return {
    estimatedAppFootprintWidthPx: 0,
    estimatedAppFootprintHeightPx: 0,
    estimatedAppFootprintAreaPx: 0,
    estimatedAppFootprintMinDimensionPx: 0,
    estimatedAppFootprintMaxDimensionPx: 0,
    displayReadabilityTier: 'readable',
  };
}

function visibleOrUnclippedRing(zone: WaterReaderPlacedZone): RingM {
  return zone.visibleWaterRing.length >= 3 ? zone.visibleWaterRing : zone.unclippedRing;
}

function svgPointForReadability(point: PointM, context: ReadabilityContext): PointM {
  return {
    x: context.padding + (point.x - context.minX) * context.scale,
    y: context.padding + (context.maxY - point.y) * context.scale,
  };
}

function boundsForPoints(points: PointM[]): { minX: number; maxX: number; minY: number; maxY: number } {
  if (points.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  return points.reduce(
    (bounds, point) => ({
      minX: Math.min(bounds.minX, point.x),
      maxX: Math.max(bounds.maxX, point.x),
      minY: Math.min(bounds.minY, point.y),
      maxY: Math.max(bounds.maxY, point.y),
    }),
    { minX: points[0]!.x, maxX: points[0]!.x, minY: points[0]!.y, maxY: points[0]!.y },
  );
}

function expandBounds(bounds: { minX: number; maxX: number; minY: number; maxY: number }, padM: number): { minX: number; maxX: number; minY: number; maxY: number } {
  return {
    minX: bounds.minX - padM,
    maxX: bounds.maxX + padM,
    minY: bounds.minY - padM,
    maxY: bounds.maxY + padM,
  };
}

function boundsTouchOrOverlap(
  a: { minX: number; maxX: number; minY: number; maxY: number },
  b: { minX: number; maxX: number; minY: number; maxY: number },
): boolean {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
}

function boundsCenterForDisplay(bounds: { minX: number; maxX: number; minY: number; maxY: number }): PointM {
  return {
    x: (bounds.minX + bounds.maxX) / 2,
    y: (bounds.minY + bounds.maxY) / 2,
  };
}

function validPoint(point: PointM): boolean {
  return Number.isFinite(point.x) && Number.isFinite(point.y);
}

function roundDiagnosticNumber(value: number): number {
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
}

function diagnosticNumber(value: number | string | boolean | string[] | null | undefined, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function formatDiagnosticNumber(value: number): string {
  return roundDiagnosticNumber(value).toFixed(2);
}

function featurePriority(featureClass: WaterReaderFeatureClass): number {
  return FEATURE_PRIORITY[featureClass] ?? 99;
}

function zoneScore(zone: WaterReaderPlacedZone): number {
  const metrics = [
    zone.diagnostics.featureProminenceScore,
    zone.diagnostics.unitScore,
    zone.diagnostics.featureScore,
    zone.diagnostics.score,
    zone.diagnostics.segmentLengthM,
    zone.diagnostics.protrusionLengthM,
    zone.diagnostics.coveAreaSqM,
    zone.diagnostics.areaSqM,
    zone.diagnostics.confidence,
    zone.diagnostics.candidateCount,
  ];
  for (const metric of metrics) {
    if (typeof metric === 'number' && Number.isFinite(metric)) return metric;
  }
  const sourceRank = zone.diagnostics.sourceRank;
  if (typeof sourceRank === 'number' && Number.isFinite(sourceRank)) return -sourceRank;
  return 0;
}

function rankingDiagnostics(zones: WaterReaderPlacedZone[], seasonalRelevanceScore: number): string[] {
  return unique([
    ...zones.map((zone) => {
      if (typeof zone.diagnostics.featureProminenceScore === 'number') return 'ranking_metric:feature_prominence_score';
      if (
        typeof zone.diagnostics.unitScore === 'number' ||
        typeof zone.diagnostics.featureScore === 'number' ||
        typeof zone.diagnostics.score === 'number'
      ) {
        return 'ranking_metric:feature_score_fallback';
      }
      if (typeof zone.diagnostics.sourceRank === 'number') return 'ranking_metric:source_rank_fallback';
      return 'ranking_metric:unscored_feature_fallback';
    }),
    `seasonal_relevance_score:${formatDiagnosticNumber(seasonalRelevanceScore)}`,
  ]).sort((a, b) => a.localeCompare(b));
}

function seasonalRelevanceScore(zone: WaterReaderPlacedZone, season: WaterReaderZonePlacementResult['season']): number {
  if (zone.diagnostics.seasonalEmphasisOnly === true) {
    switch (zone.placementKind) {
      case 'cove_structure_area':
        return season === 'spring' || season === 'fall' ? 1 : 0.75;
      case 'main_point_structure_area':
      case 'secondary_point_structure_area':
        return season === 'summer' || season === 'fall' || season === 'winter' ? 1 : 0.75;
      case 'neck_structure_area':
      case 'saddle_structure_area':
        return season === 'summer' || season === 'fall' || season === 'winter' ? 1 : 0.75;
      case 'island_structure_area':
        return season === 'summer' || season === 'winter' ? 1 : 0.75;
      case 'dam_structure_area':
        return 0.75;
    }
  }
  switch (season) {
    case 'spring':
      if (zone.placementKind === 'cove_back') return coveInnerSemantic(zone) ? 2 : 1;
      if (zone.placementKind === 'island_mainland') return 1;
      return 0;
    case 'summer':
      if (zone.placementKind === 'main_point_open_water' || zone.placementKind === 'main_point_tip') return 1;
      if (zone.placementKind === 'neck_shoulder' || zone.placementKind === 'saddle_shoulder' || zone.placementKind === 'cove_mouth') return 1;
      return 0;
    case 'fall':
      if (zone.placementKind === 'main_point_side' || zone.placementKind === 'cove_irregular_side') return 1;
      if (zone.placementKind === 'neck_shoulder' || zone.placementKind === 'saddle_shoulder') return 1;
      if (typeof zone.anchorSemanticId === 'string' && zone.anchorSemanticId.includes('recovery')) return 1;
      return 0;
    case 'winter':
      if (zone.placementKind === 'neck_shoulder' || zone.placementKind === 'saddle_shoulder') return 1;
      if (zone.placementKind === 'main_point_open_water' || zone.placementKind === 'island_open_water' || zone.placementKind === 'cove_mouth') return 1;
      return 0;
  }
}

function coveInnerSemantic(zone: WaterReaderPlacedZone): boolean {
  return zone.anchorSemanticId === 'cove_back_primary' ||
    zone.anchorSemanticId === 'cove_back_pocket_recovery' ||
    zone.anchorSemanticId === 'cove_back_pocket_recovery_left' ||
    zone.anchorSemanticId === 'cove_back_pocket_recovery_right' ||
    zone.anchorSemanticId === 'cove_inner_shoreline_left' ||
    zone.anchorSemanticId === 'cove_inner_shoreline_right' ||
    zone.anchorSemanticId === 'cove_inner_wall_midpoint_left' ||
    zone.anchorSemanticId === 'cove_inner_wall_midpoint_right';
}

function numericDiagnostic(value: number | string | boolean | string[] | null | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function splitSourceFeatures(
  displayedEntries: WaterReaderDisplayEntry[],
  retainedEntries: WaterReaderDisplayEntry[],
): string[] {
  const displayed = new Set(displayedEntries.flatMap((entry) => entry.sourceFeatureIds));
  const retained = new Set(retainedEntries.flatMap((entry) => entry.sourceFeatureIds));
  return [...displayed].filter((sourceFeatureId) => retained.has(sourceFeatureId)).sort((a, b) => a.localeCompare(b));
}

function majorAxisPct(majorAxisM: number, longestDimensionM?: number | null): number | null {
  return typeof longestDimensionM === 'number' && Number.isFinite(longestDimensionM) && longestDimensionM > 0
    ? (majorAxisM / longestDimensionM) * 100
    : null;
}

function stableEntryId(entryId: string, sourceFeatureIds: string[], zoneIds: string[]): string {
  return [...sourceFeatureIds, ...zoneIds, entryId].join('|');
}

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}
