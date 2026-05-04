import type { PointM, RingM, WaterReaderFeatureClass, WaterReaderLegendEntry } from './contracts.ts';
import { WATER_READER_FEATURE_COLORS } from './legend.ts';
import type {
  WaterReaderFeatureZoneCoverage,
  WaterReaderPlacedZone,
  WaterReaderStructureConfluenceGroup,
  WaterReaderZonePlacementKind,
  WaterReaderZonePlacementSemanticId,
  WaterReaderZonePlacementResult,
} from './zones/types.ts';
import { visibleZoneCap } from './zones/priority.ts';

export type WaterReaderDisplayEntryType = 'standalone_zone' | 'structure_confluence';

export type WaterReaderDisplayState =
  | 'displayed_standalone'
  | 'displayed_confluence'
  | 'retained_not_displayed_cap'
  | 'suppressed_invalid_geometry'
  | 'suppressed_failed_invariants'
  | 'suppressed_dependency';

export type WaterReaderDisplayModelOptions = {
  acreage?: number | null;
  longestDimensionM?: number | null;
};

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
  diagnostics: Record<string, number | string | boolean | null>;
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
  rankingDiagnostics: string[];
  sort: {
    priority: number;
    confluenceStrengthRank: number;
    score: number;
    majorAxisM: number;
    stableSourceFeatureId: string;
    stableZoneId: string;
    stableId: string;
  };
}

export interface WaterReaderSuppressedDisplayEntry {
  entryId: string;
  displayState: Exclude<WaterReaderDisplayState, 'displayed_standalone' | 'displayed_confluence' | 'retained_not_displayed_cap'>;
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
  displayState: 'displayed' | 'retained_not_displayed_cap';
  zoneIds: string[];
  sourceFeatureIds: string[];
  featureClasses: WaterReaderFeatureClass[];
  placementKinds: WaterReaderZonePlacementKind[];
  confluenceGroupId?: string;
  priority: number;
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
  rankingDiagnostics: string[];
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

  const units = buildDisplayUnits(zoneResult);
  const sortedUnits = [...units].sort(compareDisplayUnits);
  let displayedUnits: DisplayUnit[] = [];
  let retainedUnits: DisplayUnit[] = [];
  let remainingCap = displayCap;
  for (const unit of sortedUnits) {
    if (unit.entryCost <= remainingCap) {
      displayedUnits.push(unit);
      remainingCap -= unit.entryCost;
    } else {
      retainedUnits.push(unit);
    }
  }
  ({ displayedUnits, retainedUnits } = rebalanceDisplayDiversity({
    displayedUnits,
    retainedUnits,
    displayCap,
    legendByEntryId,
    legendByZoneId,
  }));

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
    displayState: 'retained_not_displayed_cap' as const,
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
    ...retainedUnits.map((unit) => selectionUnitDiagnostic(unit, 'retained_not_displayed_cap' as const)),
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
    capExceeded: retainedEntries.length > 0,
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

function rebalanceDisplayDiversity(params: {
  displayedUnits: DisplayUnit[];
  retainedUnits: DisplayUnit[];
  displayCap: number;
  legendByEntryId: Map<string, WaterReaderLegendEntry>;
  legendByZoneId: Map<string, WaterReaderLegendEntry>;
}): { displayedUnits: DisplayUnit[]; retainedUnits: DisplayUnit[] } {
  if (params.retainedUnits.length === 0) return params;
  const titleCounts = countUnitTitles(params.displayedUnits, params.legendByEntryId, params.legendByZoneId);
  const dominant = [...titleCounts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0];
  if (!dominant || dominant[1] < 4) return params;
  const [dominantTitle] = dominant;
  const promoted = params.retainedUnits.find((unit) => {
    const titles = unitLegendTitles(unit, params.legendByEntryId, params.legendByZoneId);
    return titles.some((title) => title !== dominantTitle);
  });
  if (!promoted) return params;

  const demoted = [...params.displayedUnits].reverse().find((unit) => {
    const titles = unitLegendTitles(unit, params.legendByEntryId, params.legendByZoneId);
    return titles.length > 0 && titles.every((title) => title === dominantTitle) && unit.entryCost >= promoted.entryCost;
  });
  if (!demoted) return params;

  const nextDisplayed = params.displayedUnits
    .filter((unit) => unit.unitId !== demoted.unitId)
    .concat([{ ...promoted, rankingDiagnostics: unique([...promoted.rankingDiagnostics, 'displayed_diversity_rebalance']) }])
    .sort(compareDisplayUnits);
  const nextRetained = params.retainedUnits
    .filter((unit) => unit.unitId !== promoted.unitId)
    .concat([{ ...demoted, rankingDiagnostics: unique([...demoted.rankingDiagnostics, 'retained_diversity_rebalance']) }])
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
    for (const title of unitLegendTitles(unit, legendByEntryId, legendByZoneId)) {
      counts.set(title, (counts.get(title) ?? 0) + 1);
    }
  }
  return counts;
}

function unitLegendTitles(
  unit: DisplayUnit,
  legendByEntryId: Map<string, WaterReaderLegendEntry>,
  legendByZoneId: Map<string, WaterReaderLegendEntry>,
): string[] {
  if (unit.entryType === 'structure_confluence') {
    const title = unit.confluenceGroup ? legendByEntryId.get(unit.confluenceGroup.groupId)?.title : undefined;
    return title ? [title] : [];
  }
  return unit.zones
    .map((zone) => legendByZoneId.get(zone.zoneId)?.title)
    .filter((title): title is string => Boolean(title));
}

function buildDisplayUnits(zoneResult: WaterReaderZonePlacementResult): DisplayUnit[] {
  const zonesById = new Map(zoneResult.zones.map((zone) => [zone.zoneId, zone]));
  const confluenceByZoneId = new Map<string, WaterReaderStructureConfluenceGroup>();
  for (const group of zoneResult.diagnostics.confluenceGroups) {
    for (const zoneId of group.memberZoneIds) confluenceByZoneId.set(zoneId, group);
  }

  const units: DisplayUnit[] = [];
  const consumedZoneIds = new Set<string>();
  for (const group of zoneResult.diagnostics.confluenceGroups) {
    const memberZones = group.memberZoneIds
      .map((zoneId) => zonesById.get(zoneId))
      .filter((member): member is WaterReaderPlacedZone => Boolean(member));
    if (memberZones.length === 0) continue;
    for (const zone of memberZones) consumedZoneIds.add(zone.zoneId);
    units.push({
      unitId: group.groupId,
      entryType: 'structure_confluence',
      zones: memberZones,
      confluenceGroup: group,
      entryCost: 1,
      ...unitSort(memberZones, group.groupId, group),
    });
  }

  const unitsByKey = new Map<string, WaterReaderPlacedZone[]>();
  for (const zone of zoneResult.zones) {
    if (consumedZoneIds.has(zone.zoneId) || confluenceByZoneId.has(zone.zoneId)) continue;
    const key = displayUnitKey(zone);
    const zones = unitsByKey.get(key) ?? [];
    zones.push(zone);
    unitsByKey.set(key, zones);
  }

  for (const [key, zones] of [...unitsByKey.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    units.push({
      unitId: key,
      entryType: 'standalone_zone',
      zones: zones.sort((a, b) => a.zoneId.localeCompare(b.zoneId)),
      entryCost: zones.length,
      ...unitSort(zones, key),
    });
  }

  return units;
}

function displayUnitKey(zone: WaterReaderPlacedZone): string {
  if (zone.featureClass === 'universal') return zone.zoneId;
  return `${zone.featureClass}:${zone.sourceFeatureId}`;
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
      legend: unit.confluenceGroup ? legendByEntryId.get(unit.confluenceGroup.groupId) : undefined,
      confluenceGroup: unit.confluenceGroup,
      longestDimensionM,
      sort: unit.sort,
      rankingDiagnostics: unit.rankingDiagnostics,
    })];
  }

  return unit.zones.map((zone) => makeDisplayEntry({
    entryId: zone.zoneId,
    entryType: 'standalone_zone',
    displayState: 'displayed_standalone',
    zones: [zone],
    legend: legendByZoneId.get(zone.zoneId) ?? firstLegendForZones([zone], legendByZoneId),
    longestDimensionM,
    sort: {
      ...unit.sort,
      stableZoneId: zone.zoneId,
      stableId: stableEntryId(zone.zoneId, [zone.sourceFeatureId], [zone.zoneId]),
    },
    rankingDiagnostics: unit.rankingDiagnostics,
  }));
}

function makeDisplayEntry(params: {
  entryId: string;
  entryType: WaterReaderDisplayEntryType;
  displayState: Extract<WaterReaderDisplayState, 'displayed_standalone' | 'displayed_confluence'>;
  zones: WaterReaderPlacedZone[];
  legend?: WaterReaderLegendEntry;
  confluenceGroup?: WaterReaderStructureConfluenceGroup;
  longestDimensionM?: number | null;
  sort: WaterReaderDisplayEntry['sort'];
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
    b.majorAxisM - a.majorAxisM ||
    a.stableSourceFeatureId.localeCompare(b.stableSourceFeatureId) ||
    a.stableZoneId.localeCompare(b.stableZoneId) ||
    a.stableId.localeCompare(b.stableId)
  );
}

function unitSort(
  zones: WaterReaderPlacedZone[],
  unitId: string,
  confluenceGroup?: WaterReaderStructureConfluenceGroup,
): Pick<DisplayUnit, 'sort' | 'rankingDiagnostics'> {
  const featureClasses = unique(zones.map((zone) => zone.featureClass));
  const sourceFeatureIds = unique(zones.map((zone) => zone.sourceFeatureId));
  const zoneIds = zones.map((zone) => zone.zoneId);
  const majorAxisM = Math.max(...zones.map((zone) => zone.majorAxisM), 0);
  const sort = {
    priority: Math.min(...featureClasses.map(featurePriority)),
    confluenceStrengthRank: confluenceGroup?.strength === 'strong' ? 1 : confluenceGroup?.strength === 'light' ? 2 : 3,
    score: Math.max(...zones.map(zoneScore), 0),
    majorAxisM,
    stableSourceFeatureId: [...sourceFeatureIds].sort((a, b) => a.localeCompare(b))[0] ?? unitId,
    stableZoneId: [...zoneIds].sort((a, b) => a.localeCompare(b))[0] ?? unitId,
    stableId: stableEntryId(unitId, sourceFeatureIds, zoneIds),
  };
  return { sort, rankingDiagnostics: rankingDiagnostics(zones) };
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
    score: unit.sort.score,
    majorAxisM: unit.sort.majorAxisM,
    rankingDiagnostics: unit.rankingDiagnostics,
  };
}

function featurePriority(featureClass: WaterReaderFeatureClass): number {
  return FEATURE_PRIORITY[featureClass] ?? 99;
}

function zoneScore(zone: WaterReaderPlacedZone): number {
  const metrics = [
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
  return zone.majorAxisM;
}

function rankingDiagnostics(zones: WaterReaderPlacedZone[]): string[] {
  return unique(zones.map((zone) => {
    if (
      typeof zone.diagnostics.unitScore === 'number' ||
      typeof zone.diagnostics.featureScore === 'number' ||
      typeof zone.diagnostics.score === 'number'
    ) {
      return 'ranking_metric:feature_score_diagnostic';
    }
    if (typeof zone.diagnostics.sourceRank === 'number') return 'ranking_metric:source_rank_fallback';
    return 'ranking_metric:major_axis_fallback_todo_feature_metric';
  })).sort((a, b) => a.localeCompare(b));
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
