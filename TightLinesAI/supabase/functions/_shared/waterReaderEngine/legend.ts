import type { WaterReaderFeatureClass, WaterReaderLegendEntry, WaterReaderSeason } from './contracts.ts';
import { lookupWaterReaderSeason } from './seasons.ts';
import type {
  WaterReaderPlacedZone,
  WaterReaderStructureConfluenceGroup,
  WaterReaderZonePlacementKind,
  WaterReaderZonePlacementSemanticId,
  WaterReaderZonePlacementResult,
} from './zones/types.ts';

export const WATER_READER_FEATURE_COLORS: Record<WaterReaderFeatureClass | 'structure_confluence', string> = {
  main_lake_point: '#1E5FBF',
  secondary_point: '#6FA8DC',
  cove: '#2E8B57',
  neck: '#E67E22',
  island: '#8E44AD',
  saddle: '#1ABC9C',
  dam: '#C0392B',
  structure_confluence: '#D946EF',
  universal: '#D4A017',
};

export const WATER_READER_LEGEND_FORBIDDEN_PHRASES = [
  'best',
  'guaranteed',
  'fish are here',
  'fish hold here',
  'highest confidence',
  'most productive',
  'GPS',
  'waypoint',
  'depth break',
  'channel',
  'hump',
  'deepest water',
] as const;

export type WaterReaderLegendBuildContext = {
  state: string;
  currentDate?: Date;
};

type TemplateKey = `${WaterReaderFeatureClass}:${WaterReaderSeason}:${WaterReaderZonePlacementKind}`;

export const WATER_READER_LEGEND_SEASONS = ['spring', 'summer', 'fall', 'winter'] as const satisfies readonly WaterReaderSeason[];

export const WATER_READER_ZONE_PLACEMENT_KINDS = [
  'neck_shoulder',
  'saddle_shoulder',
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
  'universal_longest_shoreline',
  'universal_centroid_shoreline',
] as const satisfies readonly WaterReaderZonePlacementKind[];

type MissingPlacementKind = Exclude<WaterReaderZonePlacementKind, typeof WATER_READER_ZONE_PLACEMENT_KINDS[number]>;
const ALL_PLACEMENT_KINDS_COVERED: MissingPlacementKind extends never ? true : never = true;
void ALL_PLACEMENT_KINDS_COVERED;

const WATER_READER_LEGEND_FEATURE_CLASSES = [
  'main_lake_point',
  'secondary_point',
  'cove',
  'neck',
  'island',
  'saddle',
  'dam',
  'universal',
  'structure_confluence',
] as const satisfies ReadonlyArray<WaterReaderFeatureClass | 'structure_confluence'>;

const PLACEMENT_FEATURE_CLASS: Record<WaterReaderZonePlacementKind, WaterReaderFeatureClass> = {
  neck_shoulder: 'neck',
  saddle_shoulder: 'saddle',
  main_point_side: 'main_lake_point',
  main_point_tip: 'main_lake_point',
  main_point_open_water: 'main_lake_point',
  cove_back: 'cove',
  cove_mouth: 'cove',
  cove_irregular_side: 'cove',
  secondary_point_back: 'secondary_point',
  secondary_point_mouth: 'secondary_point',
  island_mainland: 'island',
  island_open_water: 'island',
  island_endpoint: 'island',
  dam_corner: 'dam',
  universal_longest_shoreline: 'universal',
  universal_centroid_shoreline: 'universal',
};

const STABLE_PLACEMENT_KINDS = new Set<WaterReaderZonePlacementKind>([
  'dam_corner',
  'neck_shoulder',
  'saddle_shoulder',
  'universal_longest_shoreline',
  'universal_centroid_shoreline',
]);

const TRANSITION_WARNINGS: Record<WaterReaderSeason, string> = {
  spring: 'Seasonal patterns may still resemble winter in some conditions; compare this with main-lake structure zones.',
  summer: 'Seasonal patterns may still resemble spring in some conditions; protected shoreline structure can remain relevant.',
  fall: 'Summer patterns may persist on warmer days; open-water-side structure can remain relevant.',
  winter: 'Fall transitional patterns may persist along cove and shoreline structure.',
};

const FEATURE_LABELS: Record<WaterReaderFeatureClass, string> = {
  main_lake_point: 'Main Lake Point',
  secondary_point: 'Secondary Point',
  cove: 'Cove',
  neck: 'Neck Shoulder',
  island: 'Island Edge',
  saddle: 'Saddle Shoulder',
  dam: 'Dam Corner',
  universal: 'Universal Shoreline',
};

type WaterReaderLegendTemplate = {
  title: string;
  body: (season: WaterReaderSeason) => string;
};

type WaterReaderResolvedLegendTemplate = {
  title: string;
  body: string;
};

const LEGEND_TEMPLATES: Record<WaterReaderZonePlacementKind, WaterReaderLegendTemplate> = {
  neck_shoulder: {
    title: 'Neck Shoulder',
    body: (season) => `In ${season}, this neck shoulder is a seasonally relevant structure area. This shoulder marks one side of a narrow pass; compare both shoreline shoulders rather than the middle of the opening.`,
  },
  saddle_shoulder: {
    title: 'Saddle Shoulder',
    body: (season) => `In ${season}, this saddle shoulder is a seasonally relevant structure area. This shoulder marks one side of a broader constriction; compare both shorelines that frame the opening.`,
  },
  main_point_side: {
    title: 'Main Lake Point - Point Side',
    body: (season) => `In ${season}, this main-lake point side is a seasonally relevant structure area. Work from the bank edge outward along the point side and compare both nearby shoreline slopes.`,
  },
  main_point_tip: {
    title: 'Main Lake Point - Point Tip',
    body: (season) => `In ${season}, this main-lake point tip is a seasonally relevant structure area. Start around the point tip, then compare the adjoining sides to understand how the point connects with the surrounding water.`,
  },
  main_point_open_water: {
    title: 'Main Lake Point - Open-Water Side',
    body: (season) => `In ${season}, this main-lake point side is a seasonally relevant structure area. Focus on the side facing broader open water and compare it with the protected side of the same point.`,
  },
  cove_back: {
    title: 'Cove - Back Shoreline',
    body: (season) => `In ${season}, this cove back shoreline is a seasonally relevant structure area. The back shoreline gives a clear protected-water reference for a careful seasonal pass.`,
  },
  cove_mouth: {
    title: 'Cove - Mouth Shoulder',
    body: (season) => `In ${season}, this cove mouth is a seasonally relevant structure area. The mouth shoulder connects protected water with the main lake and can be worth checking as conditions shift.`,
  },
  cove_irregular_side: {
    title: 'Cove - Irregular Side',
    body: (season) => `In ${season}, this cove side is a seasonally relevant structure area. The selected side has stronger shoreline shape variation, so compare the bends and edges along that side.`,
  },
  secondary_point_back: {
    title: 'Secondary Point - Back-Facing Side',
    body: (season) => `In ${season}, this secondary point side is a seasonally relevant structure area. This back-facing side connects a smaller point with protected cove shoreline, making it a logical area to check.`,
  },
  secondary_point_mouth: {
    title: 'Secondary Point - Mouth-Facing Side',
    body: (season) => `In ${season}, this secondary point side is a seasonally relevant structure area. This mouth-facing side connects the smaller point with the cove opening and nearby main-lake water.`,
  },
  island_mainland: {
    title: 'Island Edge - Mainland-Facing Edge',
    body: (season) => `In ${season}, this island edge is a seasonally relevant structure area. This edge faces the nearest mainland shoreline, giving a simple island-to-shore reference line.`,
  },
  island_open_water: {
    title: 'Island Edge - Open-Water Edge',
    body: (season) => `In ${season}, this island edge is a seasonally relevant structure area. This edge faces broader open water, making it a clear island-side structure reference.`,
  },
  island_endpoint: {
    title: 'Island Edge - Island End',
    body: (season) => `In ${season}, this island edge is a seasonally relevant structure area. This island end gives a defined corner-like reference along the island edge.`,
  },
  dam_corner: {
    title: 'Dam Corner',
    body: (season) => `In ${season}, this dam corner is a seasonally relevant structure area. Work the corner where the straight bank transitions into natural shoreline.`,
  },
  universal_longest_shoreline: {
    title: 'Universal Shoreline - Longest Uniform Shoreline',
    body: () => 'No major structural features were detected on this water. This zone marks the longest uniform shoreline, a simple geometry-only structure edge that can be worth checking.',
  },
  universal_centroid_shoreline: {
    title: 'Universal Shoreline - Interior-Center Shoreline',
    body: () => "No major structural features were detected on this water. This zone marks the shoreline closest to the waterbody's interior center, a geometry-only fallback for simple shapes.",
  },
};

export function buildWaterReaderLegend(
  zoneResult: WaterReaderZonePlacementResult,
  context: WaterReaderLegendBuildContext,
): WaterReaderLegendEntry[] {
  const season = zoneResult.season;
  const seasonLookup = transitionLookupForLegend(zoneResult, context);
  const confluenceByZoneId = new Map<string, WaterReaderStructureConfluenceGroup>();
  for (const group of zoneResult.diagnostics.confluenceGroups) {
    for (const zoneId of group.memberZoneIds) confluenceByZoneId.set(zoneId, group);
  }

  const entries: WaterReaderLegendEntry[] = [];
  const emittedConfluenceGroups = new Set<string>();
  for (const zone of zoneResult.zones) {
    const group = confluenceByZoneId.get(zone.zoneId);
    if (group) {
      if (emittedConfluenceGroups.has(group.groupId)) continue;
      emittedConfluenceGroups.add(group.groupId);
      entries.push(buildConfluenceEntry(entries.length + 1, group, zoneResult.zones, season, transitionWarningForGroup(group, zoneResult.zones, seasonLookup)));
      continue;
    }
    entries.push(buildZoneEntry(entries.length + 1, zone, season, transitionWarningForZone(zone, seasonLookup)));
  }
  return entries;
}

export function waterReaderLegendForbiddenPhraseHits(text: string): string[] {
  const lower = text.toLowerCase();
  return WATER_READER_LEGEND_FORBIDDEN_PHRASES.filter((phrase) => lower.includes(phrase.toLowerCase()));
}

export function waterReaderLegendTemplateCoverage() {
  const missingTemplateKeys: string[] = [];
  const forbiddenTemplateHits: Array<{ key: string; hits: string[] }> = [];
  const missingColorKeys = WATER_READER_LEGEND_FEATURE_CLASSES.filter((featureClass) => !WATER_READER_FEATURE_COLORS[featureClass]);

  for (const placementKind of WATER_READER_ZONE_PLACEMENT_KINDS) {
    const template = LEGEND_TEMPLATES[placementKind];
    const featureClass = PLACEMENT_FEATURE_CLASS[placementKind];
    for (const season of WATER_READER_LEGEND_SEASONS) {
      const key = templateIdFor(featureClass, season, placementKind);
      if (!template?.title || !template.body(season)) {
        missingTemplateKeys.push(key);
        continue;
      }
      const hits = waterReaderLegendForbiddenPhraseHits(`${template.title} ${template.body(season)}`);
      if (hits.length > 0) forbiddenTemplateHits.push({ key, hits });
    }
  }

  for (const warningSeason of WATER_READER_LEGEND_SEASONS) {
    const hits = waterReaderLegendForbiddenPhraseHits(TRANSITION_WARNINGS[warningSeason]);
    if (hits.length > 0) forbiddenTemplateHits.push({ key: `transition_warning:${warningSeason}`, hits });
  }

  const confluenceHits = waterReaderLegendForbiddenPhraseHits(confluenceBody('spring'));
  if (confluenceHits.length > 0) {
    forbiddenTemplateHits.push({ key: 'structure_confluence:spring', hits: confluenceHits });
  }

  return {
    checkedTemplateCount: WATER_READER_ZONE_PLACEMENT_KINDS.length * WATER_READER_LEGEND_SEASONS.length,
    placementKindCount: WATER_READER_ZONE_PLACEMENT_KINDS.length,
    seasonCount: WATER_READER_LEGEND_SEASONS.length,
    missingTemplateKeys,
    missingColorKeys,
    forbiddenTemplateHits,
  };
}

function buildZoneEntry(
  number: number,
  zone: WaterReaderPlacedZone,
  season: WaterReaderSeason,
  transitionWarning?: string,
): WaterReaderLegendEntry {
  const templateId = templateIdFor(zone.featureClass, season, zone.placementKind);
  const resolvedTemplate = resolvedZoneTemplate(zone, season);
  return {
    number,
    entryId: zone.zoneId,
    zoneId: zone.zoneId,
    zoneIds: [zone.zoneId],
    featureClass: zone.featureClass,
    placementKind: zone.placementKind,
    placementKinds: [zone.placementKind],
    colorHex: WATER_READER_FEATURE_COLORS[zone.featureClass],
    templateId,
    title: resolvedTemplate.title,
    body: resolvedTemplate.body,
    transitionWarning,
    isConfluence: false,
  };
}

function buildConfluenceEntry(
  number: number,
  group: WaterReaderStructureConfluenceGroup,
  zones: WaterReaderPlacedZone[],
  season: WaterReaderSeason,
  transitionWarning?: string,
): WaterReaderLegendEntry {
  const memberZones = group.memberZoneIds
    .map((zoneId) => zones.find((zone) => zone.zoneId === zoneId))
    .filter((zone): zone is WaterReaderPlacedZone => Boolean(zone));
  const titleDetail = compactConfluenceMemberLabels(memberZones).join(' + ');
  return {
    number,
    entryId: group.groupId,
    zoneId: group.groupId,
    zoneIds: group.memberZoneIds,
    featureClass: 'structure_confluence',
    placementKinds: group.memberPlacementKinds,
    colorHex: WATER_READER_FEATURE_COLORS.structure_confluence,
    templateId: `structure_confluence:${season}:${unique(group.memberPlacementKinds).join('+')}`,
    title: `Structure Confluence - ${titleDetail}`,
    body: confluenceBody(season),
    transitionWarning,
    isConfluence: true,
  };
}

function templateIdFor(
  featureClass: WaterReaderFeatureClass,
  season: WaterReaderSeason,
  placementKind: WaterReaderZonePlacementKind,
): TemplateKey {
  return `${featureClass}:${season}:${placementKind}`;
}

function templateTitle(placementKind: WaterReaderZonePlacementKind): string {
  return LEGEND_TEMPLATES[placementKind].title;
}

function templateBody(season: WaterReaderSeason, placementKind: WaterReaderZonePlacementKind): string {
  return LEGEND_TEMPLATES[placementKind].body(season);
}

function resolvedZoneTemplate(zone: WaterReaderPlacedZone, season: WaterReaderSeason): WaterReaderResolvedLegendTemplate {
  const islandEndpointTemplate = islandEndpointSemanticTemplate(zone.anchorSemanticId, season);
  if (zone.featureClass === 'island' && zone.placementKind === 'island_endpoint' && islandEndpointTemplate) return islandEndpointTemplate;
  const islandMainlandTemplate = islandMainlandSemanticTemplate(zone.anchorSemanticId, season);
  if (zone.featureClass === 'island' && zone.placementKind === 'island_mainland' && islandMainlandTemplate) return islandMainlandTemplate;
  const openWaterTemplate = openWaterSemanticTemplate(zone, season);
  if (openWaterTemplate) return openWaterTemplate;
  const secondaryPointTemplate = secondaryPointSemanticTemplate(zone.anchorSemanticId, season);
  if (zone.featureClass === 'secondary_point' && secondaryPointTemplate) return secondaryPointTemplate;
  const coveTemplate = coveSemanticTemplate(zone.anchorSemanticId, season);
  if (zone.featureClass === 'cove' && coveTemplate) return coveTemplate;
  return {
    title: templateTitle(zone.placementKind),
    body: templateBody(season, zone.placementKind),
  };
}

function islandMainlandSemanticTemplate(
  anchorSemanticId: WaterReaderZonePlacementSemanticId | undefined,
  season: WaterReaderSeason,
): WaterReaderResolvedLegendTemplate | null {
  switch (anchorSemanticId) {
    case 'island_mainland_primary':
      return null;
    case 'island_mainland_recovery':
      return {
        title: 'Island Edge - Mainland Recovery',
        body: `In ${season}, this island edge is a seasonally relevant structure area. It uses a conservative island-edge recovery near the mainland-facing side when the exact mainland-facing anchor cannot render cleanly.`,
      };
    case 'island_shoreline_recovery':
    case 'island_alternate_endpoint_recovery':
    case 'island_open_water_recovery':
    case 'shoreline_frame_recovery':
      return {
        title: 'Island Edge - Shoreline Recovery',
        body: `In ${season}, this island edge is a seasonally relevant structure area. It uses a conservative shoreline recovery and should not be read as the exact mainland-facing edge.`,
      };
    default:
      return null;
  }
}

function islandEndpointSemanticTemplate(
  anchorSemanticId: WaterReaderZonePlacementSemanticId | undefined,
  season: WaterReaderSeason,
): WaterReaderResolvedLegendTemplate | null {
  switch (anchorSemanticId) {
    case 'island_endpoint_a':
    case 'island_endpoint_b':
      return null;
    case 'shoreline_frame_recovery':
      return {
        title: 'Island Edge - Endpoint Recovery',
        body: `In ${season}, this island edge is a seasonally relevant structure area. It uses an endpoint-local shoreline recovery near the detected island end.`,
      };
    default:
      return null;
  }
}

function openWaterSemanticTemplate(zone: WaterReaderPlacedZone, season: WaterReaderSeason): WaterReaderResolvedLegendTemplate | null {
  if (zone.featureClass === 'main_lake_point' && zone.placementKind === 'main_point_open_water') {
    if (zone.anchorSemanticId === 'main_point_open_water_area') return null;
    return {
      title: 'Main Lake Point - Broad-Water Side Recovery',
      body: `In ${season}, this main-lake point side is a seasonally relevant structure area. It uses a conservative broad-water-side recovery where the polygon area comparison could not fully resolve the side.`,
    };
  }
  if (zone.featureClass === 'island' && zone.placementKind === 'island_open_water') {
    if (zone.anchorSemanticId === 'island_open_water_area') return null;
    return {
      title: 'Island Edge - Broad-Water Recovery',
      body: `In ${season}, this island edge is a seasonally relevant structure area. It uses a conservative island-edge recovery where the polygon area comparison could not fully resolve the broad-water side.`,
    };
  }
  return null;
}

function secondaryPointSemanticTemplate(
  anchorSemanticId: WaterReaderZonePlacementSemanticId | undefined,
  season: WaterReaderSeason,
): WaterReaderResolvedLegendTemplate | null {
  switch (anchorSemanticId) {
    case 'secondary_point_back_true':
      return {
        title: 'Secondary Point - Back-Facing Side',
        body: `In ${season}, this secondary point side is a seasonally relevant structure area. This side faces the parent cove back by polygon geometry, giving a protected-cove shoreline reference.`,
      };
    case 'secondary_point_mouth_true':
      return {
        title: 'Secondary Point - Mouth-Facing Side',
        body: `In ${season}, this secondary point side is a seasonally relevant structure area. This side faces the parent cove mouth by polygon geometry, giving a cove-opening shoreline reference.`,
      };
    case 'secondary_point_parent_cove_missing':
    case 'secondary_point_parent_cove_axis_recovery':
    case 'secondary_point_back_proxy':
    case 'secondary_point_mouth_proxy':
    case 'secondary_point_side_recovery':
    case 'secondary_point_tip_transition':
      return {
        title: 'Secondary Point - Cove-Side Recovery',
        body: `In ${season}, this secondary point area is a seasonally relevant structure area. It uses a conservative point-adjacent shoreline reference where parent-cove side orientation is not fully available.`,
      };
    default:
      return null;
  }
}

function coveSemanticTemplate(
  anchorSemanticId: WaterReaderZonePlacementSemanticId | undefined,
  season: WaterReaderSeason,
): WaterReaderResolvedLegendTemplate | null {
  switch (anchorSemanticId) {
    case 'cove_back_primary':
      return {
        title: 'Cove - Back Shoreline',
        body: `In ${season}, this cove back shoreline is a seasonally relevant structure area. The back shoreline gives a clear protected-water reference for a careful seasonal pass.`,
      };
    case 'cove_back_pocket_recovery':
    case 'cove_back_pocket_recovery_left':
    case 'cove_back_pocket_recovery_right':
      return {
        title: 'Cove - Back Pocket',
        body: `In ${season}, this cove back pocket is a seasonally relevant structure area. It marks protected inner cove shoreline near the back of the pocket.`,
      };
    case 'cove_inner_shoreline_left':
    case 'cove_inner_shoreline_right':
    case 'cove_inner_wall_midpoint_left':
    case 'cove_inner_wall_midpoint_right':
      return {
        title: 'Cove - Inner Shoreline',
        body: `In ${season}, this inner cove shoreline is a seasonally relevant structure area. Compare the protected shoreline shape along the inside wall of the cove.`,
      };
    case 'cove_mouth_shoulder_recovery':
    case 'cove_mouth_primary':
    case 'cove_opposite_mouth':
    case 'cove_near_mouth_inner_wall':
    case 'cove_near_mouth_inner_wall_opposite':
      return {
        title: 'Cove - Mouth Shoulder',
        body: `In ${season}, this cove mouth shoulder is a seasonally relevant structure area. It connects protected cove water with the broader lake-side opening.`,
      };
    default:
      return null;
  }
}

function confluenceBody(season: WaterReaderSeason): string {
  return `In ${season}, multiple mapped structure cues overlap in this general area. Use it as a logical area to check while comparing the nearby shoreline shapes that created the overlap.`;
}

function transitionWarningForZone(zone: WaterReaderPlacedZone, seasonLookup: ReturnType<typeof lookupWaterReaderSeason>): string | undefined {
  if (!seasonLookup?.inTransitionWindow || !seasonLookup.transitionFrom || !seasonLookup.transitionTo) return undefined;
  if (!placementChangesAcrossTransition(zone.featureClass, zone.placementKind, seasonLookup.transitionFrom, seasonLookup.transitionTo)) return undefined;
  return TRANSITION_WARNINGS[seasonLookup.transitionTo];
}

function transitionWarningForGroup(
  group: WaterReaderStructureConfluenceGroup,
  zones: WaterReaderPlacedZone[],
  seasonLookup: ReturnType<typeof lookupWaterReaderSeason>,
): string | undefined {
  if (!seasonLookup?.inTransitionWindow || !seasonLookup.transitionFrom || !seasonLookup.transitionTo) return undefined;
  const changes = group.memberZoneIds
    .map((zoneId) => zones.find((zone) => zone.zoneId === zoneId))
    .filter((zone): zone is WaterReaderPlacedZone => Boolean(zone))
    .some((zone) => placementChangesAcrossTransition(
      zone.featureClass,
      zone.placementKind,
      seasonLookup.transitionFrom!,
      seasonLookup.transitionTo!,
    ));
  return changes ? TRANSITION_WARNINGS[seasonLookup.transitionTo] : undefined;
}

function transitionLookupForLegend(
  zoneResult: WaterReaderZonePlacementResult,
  context: WaterReaderLegendBuildContext,
): ReturnType<typeof lookupWaterReaderSeason> {
  if (!context.currentDate) return null;
  const lookup = lookupWaterReaderSeason(context.state, context.currentDate);
  if (!lookup || lookup.season !== zoneResult.season) return null;
  return lookup;
}

function placementChangesAcrossTransition(
  featureClass: WaterReaderFeatureClass,
  placementKind: WaterReaderZonePlacementKind,
  from: WaterReaderSeason,
  to: WaterReaderSeason,
): boolean {
  if (STABLE_PLACEMENT_KINDS.has(placementKind)) return false;
  return seasonPlacementKinds(featureClass, from).join('|') !== seasonPlacementKinds(featureClass, to).join('|');
}

function seasonPlacementKinds(featureClass: WaterReaderFeatureClass, season: WaterReaderSeason): WaterReaderZonePlacementKind[] {
  switch (featureClass) {
    case 'main_lake_point':
      if (season === 'spring' || season === 'fall') return ['main_point_side'];
      if (season === 'summer') return ['main_point_tip', 'main_point_open_water'];
      return ['main_point_open_water'];
    case 'secondary_point':
      return season === 'spring' ? ['secondary_point_back'] : ['secondary_point_mouth'];
    case 'cove':
      if (season === 'spring') return ['cove_back'];
      if (season === 'fall') return ['cove_irregular_side'];
      return ['cove_mouth'];
    case 'island':
      if (season === 'spring') return ['island_mainland'];
      if (season === 'fall') return ['island_endpoint'];
      return ['island_open_water'];
    case 'neck':
      return ['neck_shoulder'];
    case 'saddle':
      return ['saddle_shoulder'];
    case 'dam':
      return ['dam_corner'];
    case 'universal':
      return ['universal_longest_shoreline', 'universal_centroid_shoreline'];
  }
}

function compactConfluenceMemberLabels(zones: WaterReaderPlacedZone[]): string[] {
  const counts = new Map<string, number>();
  const orderedLabels: string[] = [];
  for (const zone of zones) {
    const label = confluenceMemberLabel(zone);
    if (!counts.has(label)) orderedLabels.push(label);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  }
  return orderedLabels.map((label) => {
    const count = counts.get(label) ?? 0;
    return count > 1 ? `${label} x${count}` : label;
  });
}

function confluenceMemberLabel(zone: WaterReaderPlacedZone): string {
  if (zone.featureClass === 'island' && zone.placementKind === 'island_endpoint' && zone.anchorSemanticId === 'shoreline_frame_recovery') {
    return 'Island Endpoint Recovery';
  }
  if (zone.featureClass === 'island' && zone.placementKind === 'island_mainland' && zone.anchorSemanticId !== 'island_mainland_primary') {
    return zone.anchorSemanticId === 'island_mainland_recovery' ? 'Island Mainland Recovery' : 'Island Shoreline Recovery';
  }
  const openWaterLabel = openWaterConfluenceMemberLabel(zone);
  if (openWaterLabel) return openWaterLabel;
  const secondaryPointLabel = secondaryPointConfluenceMemberLabel(zone.anchorSemanticId);
  if (zone.featureClass === 'secondary_point' && secondaryPointLabel) return secondaryPointLabel;
  const coveLabel = coveConfluenceMemberLabel(zone.anchorSemanticId);
  if (zone.featureClass === 'cove' && coveLabel) return coveLabel;
  switch (zone.placementKind) {
    case 'main_point_side':
      return 'Point Side';
    case 'main_point_tip':
      return 'Point Tip';
    case 'main_point_open_water':
      return 'Point Open-Water Side';
    case 'secondary_point_back':
      return 'Secondary Point Back-Facing Side';
    case 'secondary_point_mouth':
      return 'Secondary Point Mouth-Facing Side';
    case 'cove_back':
      return 'Cove Back Shoreline';
    case 'cove_mouth':
      return 'Cove Mouth';
    case 'cove_irregular_side':
      return 'Cove Irregular Side';
    case 'neck_shoulder':
      return 'Neck Shoulder';
    case 'saddle_shoulder':
      return 'Saddle Shoulder';
    case 'island_mainland':
      return 'Island Mainland-Facing Edge';
    case 'island_open_water':
      return 'Island Open-Water Edge';
    case 'island_endpoint':
      return 'Island End';
    case 'dam_corner':
      return 'Dam Corner';
    case 'universal_longest_shoreline':
      return 'Universal Longest Uniform Shoreline';
    case 'universal_centroid_shoreline':
      return 'Universal Interior-Center Shoreline';
    default:
      return FEATURE_LABELS[zone.featureClass];
  }
}

function openWaterConfluenceMemberLabel(zone: WaterReaderPlacedZone): string | null {
  if (zone.featureClass === 'main_lake_point' && zone.placementKind === 'main_point_open_water') {
    return zone.anchorSemanticId === 'main_point_open_water_area' ? 'Point Open-Water Side' : 'Point Broad-Water Recovery';
  }
  if (zone.featureClass === 'island' && zone.placementKind === 'island_open_water') {
    return zone.anchorSemanticId === 'island_open_water_area' ? 'Island Open-Water Edge' : 'Island Broad-Water Recovery';
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

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}
