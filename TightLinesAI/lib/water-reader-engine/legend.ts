import type { PointM, WaterReaderFeatureClass, WaterReaderLegendEntry, WaterReaderSeason } from './contracts';
import { lookupWaterReaderSeason } from './seasons';
import type {
  WaterReaderPlacedZone,
  WaterReaderStructureConfluenceGroup,
  WaterReaderZonePlacementKind,
  WaterReaderZonePlacementSemanticId,
  WaterReaderZonePlacementResult,
} from './zones/types';

/**
 * Paper-warm Water Reader feature palette (Node mirror).
 *
 * MUST stay in lock-step with:
 *   - the Deno engine copy at
 *     `supabase/functions/_shared/waterReaderEngine/legend.ts`, and
 *   - the client-side legend swatch palette at
 *     `lib/waterReaderZonePaperPalette.ts`.
 *
 * When any of the three changes, change all three AND bump
 * `WATER_READER_ENGINE_VERSION` so any cached SVG rows generated under the
 * older palette are regenerated. See the Deno mirror's comment for the full
 * rationale on why these specific paper hues were chosen.
 */
export const WATER_READER_FEATURE_COLORS: Record<WaterReaderFeatureClass | 'structure_confluence', string> = {
  main_lake_point: '#2E4A2A',
  secondary_point: '#5B7A3E',
  cove: '#B87818',
  neck: '#CC6A22',
  island: '#3A2E22',
  saddle: '#357A6F',
  dam: '#C8352C',
  structure_confluence: '#7A3A52',
  universal: '#E8A02E',
};

export const WATER_READER_LEGEND_FORBIDDEN_PHRASES = [
  'best',
  'guaranteed',
  'in spring',
  'in summer',
  'in fall',
  'in winter',
  'start at the mouth',
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
  'main_point_structure_area',
  'secondary_point_structure_area',
  'cove_structure_area',
  'neck_structure_area',
  'saddle_structure_area',
  'island_structure_area',
  'dam_structure_area',
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
  main_point_structure_area: 'main_lake_point',
  secondary_point_structure_area: 'secondary_point',
  cove_structure_area: 'cove',
  neck_structure_area: 'neck',
  saddle_structure_area: 'saddle',
  island_structure_area: 'island',
  dam_structure_area: 'dam',
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
  'main_point_structure_area',
  'secondary_point_structure_area',
  'cove_structure_area',
  'neck_structure_area',
  'saddle_structure_area',
  'island_structure_area',
  'dam_structure_area',
  'dam_corner',
  'neck_shoulder',
  'saddle_shoulder',
  'universal_longest_shoreline',
  'universal_centroid_shoreline',
]);

const TRANSITION_WARNINGS: Record<WaterReaderSeason, string> = {
  spring: 'Transitional conditions can lag behind the season badge; compare this with main-lake structure areas.',
  summer: 'Transitional conditions can keep protected shoreline structure relevant in some areas.',
  fall: 'Warm-day patterns can keep broad-water-side structure relevant.',
  winter: 'Late-transition patterns can persist along cove and shoreline structure.',
};

const FEATURE_LABELS: Record<WaterReaderFeatureClass, string> = {
  main_lake_point: 'Main Lake Point',
  secondary_point: 'Secondary Point',
  cove: 'Cove',
  neck: 'Neck Shoulder',
  island: 'Island',
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
  bodyVariants?: string[];
};

const LEGEND_TEMPLATES: Record<WaterReaderZonePlacementKind, WaterReaderLegendTemplate> = {
  main_point_structure_area: {
    title: 'Main Lake Point - Structure Area',
    body: (season) => featureEnvelopeSeasonBody('main_point_structure_area', season),
  },
  secondary_point_structure_area: {
    title: 'Secondary Point - Structure Area',
    body: (season) => featureEnvelopeSeasonBody('secondary_point_structure_area', season),
  },
  cove_structure_area: {
    title: 'Cove - Structure Area',
    body: (season) => featureEnvelopeSeasonBody('cove_structure_area', season),
  },
  neck_structure_area: {
    title: 'Neck - Structure Area',
    body: (season) => featureEnvelopeSeasonBody('neck_structure_area', season),
  },
  saddle_structure_area: {
    title: 'Saddle - Structure Area',
    body: (season) => featureEnvelopeSeasonBody('saddle_structure_area', season),
  },
  island_structure_area: {
    title: 'Island - Structure Area',
    body: (season) => featureEnvelopeSeasonBody('island_structure_area', season),
  },
  dam_structure_area: {
    title: 'Dam - Structure Area',
    body: (season) => featureEnvelopeSeasonBody('dam_structure_area', season),
  },
  neck_shoulder: {
    title: 'Neck Shoulder',
    body: (season) => `Use this neck shoulder as one side of a constricted travel area. Compare it with the opposite shoulder before treating the middle of the opening as the target.`,
  },
  saddle_shoulder: {
    title: 'Saddle Shoulder',
    body: (season) => `Use this saddle shoulder as one edge of a broader crossing. Compare both sides that frame the opening and let the stronger edge narrow the read.`,
  },
  main_point_side: {
    title: 'Main Lake Point - Point Side',
    body: (season) => `Use this point side to compare the shoreline edge with the water just off the point. Keep the read focused on the highlighted side before expanding around the point.`,
  },
  main_point_tip: {
    title: 'Main Lake Point - Point Tip',
    body: (season) => `Use the point tip as the outside reference for this structure. Compare the tip with both adjoining sides to see which edge connects better with the surrounding water.`,
  },
  main_point_open_water: {
    title: 'Main Lake Point - Open-Water Side',
    body: (season) => `Compare the broad-water side of this point with the more protected side. The highlighted side is the first reference, not a claim that the whole point fishes the same.`,
  },
  cove_back: {
    title: 'Cove - Back Shoreline',
    body: (season) => `Use this protected inner shoreline as the cove reference. Some coves are pockets rather than narrow bays, so compare the highlighted interior edge with the opening-facing edge.`,
  },
  cove_mouth: {
    title: 'Cove - Mouth Shoulder',
    body: (season) => `Use this opening-facing shoulder as the transition reference for the cove. On wide pockets, read it as the outer edge where protected water meets broader water.`,
  },
  cove_irregular_side: {
    title: 'Cove - Irregular Side',
    body: (season) => `Use this shaped cove side as the comparison edge. Work the bends and shoreline changes inside the highlighted area before assuming the entire cove is active.`,
  },
  secondary_point_back: {
    title: 'Secondary Point - Back-Facing Side',
    body: (season) => `Use this protected-facing side to compare the smaller point with nearby cove shoreline. It is a conservative reference for fish moving between point and pocket water.`,
  },
  secondary_point_mouth: {
    title: 'Secondary Point - Mouth-Facing Side',
    body: (season) => `Use this opening-facing side to compare the smaller point with nearby broader water. It is a transition reference, especially when the pocket is wide or loosely defined.`,
  },
  island_mainland: {
    title: 'Island Edge - Mainland-Facing Edge',
    body: (season) => `Use this mainland-facing island edge as a shoreline-to-island reference. Compare the rim with the nearby shore-facing water before circling the whole island.`,
  },
  island_open_water: {
    title: 'Island Edge - Open-Water Edge',
    body: (season) => `Use this broad-water island edge as the outside reference. Compare it with any protected rim nearby rather than assuming the full island perimeter is equal.`,
  },
  island_endpoint: {
    title: 'Island Edge - Island End',
    body: (season) => `Use this island end as a corner reference along the rim. Compare the end with the two adjoining sides and stay inside the highlighted structure area.`,
  },
  dam_corner: {
    title: 'Dam Corner',
    body: (season) => `Use this dam corner as the hard-edge transition reference. Compare the straight face with the adjoining natural shoreline before expanding down the bank.`,
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
      if (!group.crossFeatureOverlapPair) {
        entries.push(buildZoneEntry(entries.length + 1, zone, season, transitionWarningForZone(zone, seasonLookup)));
        continue;
      }
      if (emittedConfluenceGroups.has(group.groupId)) continue;
      emittedConfluenceGroups.add(group.groupId);
      entries.push(buildConfluenceEntry(entries.length + 1, group, zoneResult.zones, season, transitionWarningForGroup(group, zoneResult.zones, seasonLookup)));
      continue;
    }
    entries.push(buildZoneEntry(entries.length + 1, zone, season, transitionWarningForZone(zone, seasonLookup)));
  }
  return disambiguateRepeatedLegendTitles(entries, zoneResult);
}

export function waterReaderLegendForbiddenPhraseHits(text: string): string[] {
  const lower = text.toLowerCase();
  return WATER_READER_LEGEND_FORBIDDEN_PHRASES.filter((phrase) => lower.includes(phrase.toLowerCase()));
}

export function waterReaderLegendTemplateCoverage() {
  const missingTemplateKeys: string[] = [];
  const forbiddenTemplateHits: Array<{ key: string; hits: string[] }> = [];
  const confluenceVariantGaps: string[] = [];
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

  let checkedConfluenceVariantCount = 0;
  for (const [confluenceKey, seasonBodies] of Object.entries(CONFLUENCE_BODIES) as Array<[ConfluenceTemplateKey, Record<WaterReaderSeason, string>]>) {
    for (const season of WATER_READER_LEGEND_SEASONS) {
      const variants = confluenceBodyVariants(confluenceKey, season, seasonBodies[season]).map(sentenceCase);
      checkedConfluenceVariantCount += variants.length;
      if (variants.length < 3) confluenceVariantGaps.push(`structure_confluence:${season}:${confluenceKey}`);
      for (const [variantIndex, text] of variants.entries()) {
        const hits = waterReaderLegendForbiddenPhraseHits(text);
        if (hits.length > 0) {
          forbiddenTemplateHits.push({ key: `structure_confluence:${season}:${confluenceKey}:v${variantIndex + 1}`, hits });
        }
      }
    }
  }

  return {
    checkedTemplateCount: WATER_READER_ZONE_PLACEMENT_KINDS.length * WATER_READER_LEGEND_SEASONS.length + checkedConfluenceVariantCount,
    placementKindCount: WATER_READER_ZONE_PLACEMENT_KINDS.length,
    seasonCount: WATER_READER_LEGEND_SEASONS.length,
    confluenceKeyCount: Object.keys(CONFLUENCE_BODIES).length,
    checkedConfluenceVariantCount,
    missingTemplateKeys,
    confluenceVariantGaps,
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
  const body = pickBodyVariant(
    `${zone.zoneId}|${season}|${zone.placementKind}|${zone.anchorSemanticId ?? ''}`,
    bodyVariantsForZone(zone, season, resolvedTemplate),
  );
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
    body,
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
  const titleDetail = group.crossFeatureOverlapPair
    ? confluenceFeatureClassTitle(memberZones)
    : compactConfluenceMemberLabels(memberZones).join(' + ');
  return {
    number,
    entryId: group.groupId,
    zoneId: group.groupId,
    zoneIds: group.memberZoneIds,
    featureClass: 'structure_confluence',
    placementKinds: group.memberPlacementKinds,
    colorHex: WATER_READER_FEATURE_COLORS.structure_confluence,
    templateId: `structure_confluence:${season}:${unique(group.memberPlacementKinds).join('+')}`,
    title: group.crossFeatureOverlapPair ? `${titleDetail} - Structure Area` : `Structure Confluence - ${titleDetail}`,
    body: confluenceBody(season, memberZones, group.groupId),
    transitionWarning,
    isConfluence: true,
  };
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

function disambiguateRepeatedLegendTitles(
  entries: WaterReaderLegendEntry[],
  zoneResult: WaterReaderZonePlacementResult,
): WaterReaderLegendEntry[] {
  const counts = countBy(entries.map((entry) => entry.title));
  if (![...counts.values()].some((count) => count > 1)) return entries;

  const zonesById = new Map(zoneResult.zones.map((zone) => [zone.zoneId, zone]));
  const allPoints = zoneResult.zones.flatMap((zone) => [zone.anchor, zone.ovalCenter]);
  const center = boundsCenter(allPoints);
  const positions = new Map<string, PointM>();
  const stableKeys = new Map<string, string>();

  for (const zone of zoneResult.zones) {
    positions.set(zone.zoneId, zone.anchor ?? zone.ovalCenter);
    stableKeys.set(zone.zoneId, `${zone.sourceFeatureId}:${zone.zoneId}`);
  }
  for (const group of zoneResult.diagnostics.confluenceGroups) {
    const memberZones = group.memberZoneIds
      .map((zoneId) => zonesById.get(zoneId))
      .filter((zone): zone is WaterReaderPlacedZone => Boolean(zone));
    const memberPoints = memberZones.map((zone) => zone.anchor ?? zone.ovalCenter);
    positions.set(group.groupId, averagePoint(memberPoints) ?? center);
    stableKeys.set(group.groupId, memberZones.map((zone) => `${zone.sourceFeatureId}:${zone.zoneId}`).sort().join('|') || group.groupId);
  }

  return entries.map((entry) => {
    if ((counts.get(entry.title) ?? 0) <= 1) return entry;
    const sameTitle = entries.filter((candidate) => candidate.title === entry.title);
    const qualified = sameTitle.map((candidate) => ({
      entry: candidate,
      qualifier: directionQualifier(positions.get(candidate.zoneId) ?? center, center),
      stableKey: stableKeys.get(candidate.zoneId) ?? candidate.zoneIds?.join('|') ?? candidate.zoneId,
    }));
    const current = qualified.find((item) => item.entry === entry);
    if (!current) return entry;
    const sameQualifier = qualified
      .filter((item) => item.qualifier === current.qualifier)
      .sort((a, b) => a.stableKey.localeCompare(b.stableKey));
    const suffix = sameQualifier.length > 1
      ? ` ${String.fromCharCode(65 + sameQualifier.findIndex((item) => item.entry === entry))}`
      : '';
    return {
      ...entry,
      title: qualifiedTitle(entry.title, current.qualifier, suffix.trim()),
    };
  });
}

function qualifiedTitle(title: string, qualifier: string, suffix: string): string {
  const [head, ...tail] = title.split(' - ');
  const qualifiedHead = suffix ? `${qualifier} ${head} ${suffix}` : `${qualifier} ${head}`;
  return [qualifiedHead, ...tail].join(' - ');
}

function countBy(values: string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1);
  return counts;
}

function boundsCenter(points: PointM[]): PointM {
  if (points.length === 0) return { x: 0, y: 0 };
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }
  return { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
}

function averagePoint(points: PointM[]): PointM | null {
  if (points.length === 0) return null;
  return {
    x: points.reduce((sum, point) => sum + point.x, 0) / points.length,
    y: points.reduce((sum, point) => sum + point.y, 0) / points.length,
  };
}

function directionQualifier(point: PointM, center: PointM): string {
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  if (Math.abs(dx) < 1e-6 && Math.abs(dy) < 1e-6) return 'Center';
  const degrees = (Math.atan2(dy, dx) * 180) / Math.PI;
  const normalized = (degrees + 360) % 360;
  if (normalized >= 337.5 || normalized < 22.5) return 'East';
  if (normalized < 67.5) return 'Northeast';
  if (normalized < 112.5) return 'North';
  if (normalized < 157.5) return 'Northwest';
  if (normalized < 202.5) return 'West';
  if (normalized < 247.5) return 'Southwest';
  if (normalized < 292.5) return 'South';
  return 'Southeast';
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

function featureEnvelopeSeasonBody(placementKind: WaterReaderZonePlacementKind, season: WaterReaderSeason): string {
  switch (placementKind) {
    case 'main_point_structure_area':
      switch (season) {
        case 'spring': return 'Compare the protected-side shoulder, tip, and outside shoulder within this point area. Keep the read broad until one edge shows a clearer seasonal signal.';
        case 'summer': return 'Compare the broad-water shoulder and tip with the protected side. Use the full point area to decide which edge has better comfort or activity.';
        case 'fall': return 'Read the point as a transition from shoreline into broader water. Compare the tip and both shoulders before narrowing to one casting angle.';
        case 'winter': return 'Keep this point read compact. Compare the tip with the nearest defined shoulder and favor the side with the most stable-looking water.';
      }
    case 'secondary_point_structure_area':
      switch (season) {
        case 'spring': return 'Compare the protected side, smaller tip, and opening-facing side within this secondary point area. Use it as a staging reference, not a whole-cove call.';
        case 'summer': return 'Compare the opening-facing side and tip with nearby shade or cover. Leave room for wide pockets where the outer edge matters more than the back.';
        case 'fall': return 'Use this secondary point as a small transition between cove shoreline and broader water. Compare both sides for bait movement or wind influence.';
        case 'winter': return 'Keep the read tight around the tip and nearest defined shoulder. The highlighted area is a checkpoint beside safer water.';
      }
    case 'cove_structure_area':
      switch (season) {
        case 'spring': return 'Compare the protected interior edge with the opening-facing shoulders inside this cove area. This covers both narrow coves and broad shoreline pockets.';
        case 'summer': return 'Compare the opening-facing edge, shade, and any defined inner shoreline. The back of a cove should earn attention through cover, bait, or comfort.';
        case 'fall': return 'Read the cove as a shoreline transition. Compare the outer edge, shaped interior bank, and any bait-holding turn within the highlighted area.';
        case 'winter': return 'Use the cove area conservatively. Compare the outer edge with the most protected defined shoreline and stay close to stable-looking water.';
      }
    case 'neck_structure_area':
      switch (season) {
        case 'spring': return 'Compare the protected-side shoulder with the opposite shoulder inside this neck area. Treat the constriction as a route with edges, not a center target.';
        case 'summer': return 'Compare the broader-water shoulder with shade, wind, or cover on the opposite side. The strongest edge should narrow the pass.';
        case 'fall': return 'Read both shoulders as a paired transition around the constriction. Watch which side gives bait or fish less room to scatter.';
        case 'winter': return 'Keep the comparison tight across the two shoulders. Work beside the constriction before spending time in the middle.';
      }
    case 'saddle_structure_area':
      switch (season) {
        case 'spring': return 'Compare the inside shoulder with the opposing shoulder across this saddle. Use the crossing as a route between shoreline options.';
        case 'summer': return 'Compare the outer-facing shoulder with the more protected side. Shade, wind, or nearby cover should decide the tighter focus.';
        case 'fall': return 'Read both saddle shoulders as a broad opening. Cover the crossing only enough to learn which edge is carrying activity.';
        case 'winter': return 'Use the nearest shoulder pair as the conservative read. Stay near the edge that gives the quickest route to stable water.';
      }
    case 'island_structure_area':
      switch (season) {
        case 'spring': return 'Compare the mainland-facing rim, nearest corner, and protected side within this island area. Let the highlighted edge guide the first lap.';
        case 'summer': return 'Compare the broad-water rim, shade, and island corners. Avoid treating the full perimeter as equal unless bait or wind says so.';
        case 'fall': return 'Read the island as a perimeter transition. Compare corners and both sides for bait movement before slowing down on one rim.';
        case 'winter': return 'Use the nearest defined island side and corner as a compact reference. Favor the rim closest to stable-looking water.';
      }
    case 'dam_structure_area':
      switch (season) {
        case 'spring': return 'Compare the transition corner, straight face, and nearby softer bank inside this dam area. Hard edge plus warmth or cover matters most.';
        case 'summer': return 'Compare shade, wall contact, and the outer transition corner. Use the straight segment as a reference, not the whole plan.';
        case 'fall': return 'Compare both transition corners with the straight segment. Bait movement should decide whether the corner or face gets more time.';
        case 'winter': return 'Use the straight segment and nearest transition corner as a compact hard-edge read. Keep the focus near stable-looking water.';
      }
    default:
      return templateBody(season, placementKind);
  }
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
        body: `Use this island edge as a conservative mainland-facing reference. The exact shore-facing line was softened, so compare nearby rim sections before expanding wider.`,
      };
    case 'island_shoreline_recovery':
    case 'island_alternate_endpoint_recovery':
    case 'island_open_water_recovery':
    case 'shoreline_frame_recovery':
      return {
        title: 'Island Edge - Shoreline Recovery',
        body: `Use this local island shoreline as a conservative recovery reference. It should not be read as the exact mainland-facing edge.`,
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
        body: `Use this endpoint-local island edge as a conservative corner reference. Compare the adjoining rim sections before widening around the island.`,
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
      body: `Use this point side as a conservative broad-water reference. Compare it with the protected side before treating the whole point as one target.`,
    };
  }
  if (zone.featureClass === 'island' && zone.placementKind === 'island_open_water') {
    if (zone.anchorSemanticId === 'island_open_water_area') return null;
    if (zone.anchorSemanticId === 'island_open_water_same_side_recovery' || zone.anchorSemanticId === 'island_open_water_recovery') {
      return {
        title: 'Island Edge - Open-Water Recovery',
        body: `Use this island edge as a conservative broad-water reference. The exact outside rim was softened, so compare nearby rim sections carefully.`,
      };
    }
    if (zone.anchorSemanticId === 'island_shoreline_recovery' || zone.anchorSemanticId === 'island_alternate_endpoint_recovery' || zone.anchorSemanticId === 'shoreline_frame_recovery') {
      return {
        title: 'Island Edge - Shoreline Recovery',
        body: `Use this local island shoreline as a conservative recovery reference. It should not be read as the exact broad-water edge.`,
      };
    }
    return {
      title: 'Island Edge - Broad-Water Recovery',
      body: `Use this island edge as a broad-water-side recovery. Compare it with the nearest protected rim before committing to the whole island perimeter.`,
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
        body: `Use this secondary point side as the protected-cove reference. Compare it with the tip and opening-facing side before widening around the point.`,
      };
    case 'secondary_point_mouth_true':
      return {
        title: 'Secondary Point - Mouth-Facing Side',
        body: `Use this secondary point side as the opening-facing reference. On broad pockets, read it as the outer point edge nearest broader water.`,
      };
    case 'secondary_point_parent_cove_missing':
    case 'secondary_point_parent_cove_axis_recovery':
    case 'secondary_point_back_proxy':
    case 'secondary_point_mouth_proxy':
    case 'secondary_point_side_recovery':
    case 'secondary_point_tip_transition':
      return {
        title: 'Secondary Point - Cove-Side Recovery',
        body: `Use this secondary point area as a conservative cove-side reference. The exact side orientation is softened, so compare nearby point edges.`,
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
        body: `Use this protected inner shoreline as the cove reference. Compare it with the opening-facing edge, especially on broad pocket-shaped coves.`,
      };
    case 'cove_back_pocket_recovery':
    case 'cove_back_pocket_recovery_left':
    case 'cove_back_pocket_recovery_right':
      return {
        title: 'Cove - Back Pocket',
        body: `Use this inner pocket as a protected-water reference. It marks a conservative interior edge, not a claim that every cove has a narrow back.`,
      };
    case 'cove_inner_shoreline_left':
    case 'cove_inner_shoreline_right':
    case 'cove_inner_wall_midpoint_left':
    case 'cove_inner_wall_midpoint_right':
      return {
        title: 'Cove - Inner Shoreline',
        body: `Use this inner cove shoreline as a shape-change reference. Compare the protected edge with the outer opening-facing side before expanding.`,
      };
    case 'cove_mouth_shoulder_recovery':
    case 'cove_mouth_primary':
    case 'cove_opposite_mouth':
    case 'cove_near_mouth_inner_wall':
    case 'cove_near_mouth_inner_wall_opposite':
      return {
        title: 'Cove - Mouth Shoulder',
        body: `Use this opening-facing shoulder as the cove transition reference. On wide pockets, treat it as the outer edge where protected water meets broader water.`,
      };
    default:
      return null;
  }
}

function bodyVariantsForZone(
  zone: WaterReaderPlacedZone,
  season: WaterReaderSeason,
  template: WaterReaderResolvedLegendTemplate,
): string[] {
  return uniqueStrings([
    template.body,
    ...(template.bodyVariants ?? []),
    ...standaloneStructureBodyVariants(zone.featureClass, season),
  ]);
}

function standaloneStructureBodyVariants(
  featureClass: WaterReaderFeatureClass,
  season: WaterReaderSeason,
): string[] {
  const focus = seasonalFocus(season);
  switch (featureClass) {
    case 'main_lake_point':
      return [
        `Compare the point tip, inside shoulder, and outside shoulder as separate references. ${focus}`,
        `Use the highlighted point as a shoreline-to-broader-water transition. Let the side with cover, bait, wind, or comfort narrow the read.`,
      ];
    case 'secondary_point':
      return [
        `Compare the smaller point tip with its protected-facing and opening-facing sides. Treat it as a checkpoint between pocket water and broader water.`,
        `Use this secondary point to read how fish may move along the pocket edge. Keep the focus on the highlighted side that has the clearest seasonal clue.`,
      ];
    case 'cove':
      return [
        `Compare the protected interior edge with the opening-facing side. This keeps the read useful whether the cove is narrow or more like a broad pocket.`,
        `Use the highlighted cove water as a shape comparison. The interior, outer edge, shade, cover, or bait should decide where the pass tightens.`,
      ];
    case 'neck':
      return [
        `Compare both shoulders of the constriction before reading the center lane. The stronger edge should decide the first focused pass.`,
        `Use this neck as a travel-route reference with two edges. Work beside the route before assuming the middle is the target.`,
      ];
    case 'saddle':
      return [
        `Compare the two saddle shoulders as a broad crossing. Let shade, wind, bait, or stable-looking water choose the tighter side.`,
        `Use this saddle as a route between shoreline options. Read the edges first and keep the middle as a secondary check.`,
      ];
    case 'island':
      return [
        `Compare the island rim, nearest corner, and protected or broad-water side. Avoid treating the whole perimeter as equal.`,
        `Use the highlighted island edge as the first rim reference. Widen around the island only after one side gives a clearer clue.`,
      ];
    case 'dam':
      return [
        `Compare the hard edge, transition corner, and adjoining natural shoreline. The corner is a reference, not the whole bank plan.`,
        `Use this dam area as a hard-edge comparison. Shade, warmth, bait, or stable-looking water should decide whether the face or corner gets more time.`,
      ];
    case 'universal':
      return [
        `Compare the highlighted shoreline with nearby cover, shade, or bank shape. Keep the read simple and let visible edges narrow the pass.`,
        `Use this fallback shoreline as a conservative starting reference. Move only when another edge gives a clearer reason.`,
      ];
  }
}

function seasonalFocus(season: WaterReaderSeason): string {
  switch (season) {
    case 'spring':
      return 'Protected edges, warmth, and the route toward shallow water should carry the comparison.';
    case 'summer':
      return 'Comfort clues like shade, wind, cover, and broader-water access should carry the comparison.';
    case 'fall':
      return 'Bait movement and wind influence should carry the comparison before slowing down.';
    case 'winter':
      return 'Stable-looking water and compact edges should carry the comparison.';
  }
}

type PublicConfluenceFeature = 'point' | 'cove' | 'neck' | 'saddle' | 'island' | 'dam' | 'universal';
type ConfluenceTemplateKey =
  | 'point+cove'
  | 'point+neck'
  | 'point+saddle'
  | 'point+island'
  | 'point+dam'
  | 'cove+neck'
  | 'cove+saddle'
  | 'cove+island'
  | 'cove+dam'
  | 'neck+saddle'
  | 'neck+island'
  | 'neck+dam'
  | 'saddle+island'
  | 'saddle+dam'
  | 'island+dam'
  | 'point+cove+island'
  | 'travel_hub'
  | 'island_travel_hub'
  | 'mouth_complex'
  | 'island_complex'
  | 'shoreline_complex'
  | 'mixed_confluence';

const CONFLUENCE_ORDER: PublicConfluenceFeature[] = ['point', 'cove', 'neck', 'saddle', 'island', 'dam', 'universal'];
const PAIR_CONFLUENCE_KEYS = new Set<ConfluenceTemplateKey>([
  'point+cove',
  'point+neck',
  'point+saddle',
  'point+island',
  'point+dam',
  'cove+neck',
  'cove+saddle',
  'cove+island',
  'cove+dam',
  'neck+saddle',
  'neck+island',
  'neck+dam',
  'saddle+island',
  'saddle+dam',
  'island+dam',
]);

const CONFLUENCE_BODIES: Record<ConfluenceTemplateKey, Record<WaterReaderSeason, string>> = {
  'point+cove': {
    spring: 'compare the point edge that frames the cove with the protected interior edge. This keeps the read useful for both narrow coves and open pockets.',
    summer: 'compare the broad-water point side with shade, cover, or the opening-facing cove edge. Let comfort signs narrow the overlap.',
    fall: 'compare the point edge and cove transition as a bait route. Follow activity, but do not assume the far interior is automatically involved.',
    winter: 'keep the read near the point and opening-facing cove edge. Use the protected interior only when cover or stable-looking water supports it.',
  },
  'point+neck': {
    spring: 'compare the point shoulder with the neck side leading toward protected water. Treat the overlap as a travel edge, not just the center lane.',
    summer: 'compare the point corner with the shaded or broader-water neck shoulder. The better comfort edge should narrow the first pass.',
    fall: 'read the point and neck together as a compressed route. Compare the tip-side edge with both shoulders before widening out.',
    winter: 'stay beside the point-neck edge closest to stable-looking water. Check the middle of the constriction only after the shoulders are read.',
  },
  'point+saddle': {
    spring: 'compare the point edge with the saddle shoulder that leads toward protected water. Use the crossing as a route between shoreline options.',
    summer: 'compare the broad-water point edge with the saddle side that offers shade, wind, or quicker escape. Let one edge earn more time.',
    fall: 'read the point and saddle as one transition. Cover the crown and shoulder enough to learn which side carries bait or activity.',
    winter: 'keep the read on the safest point-saddle edge. Work the corner slowly before treating the whole crossing as relevant.',
  },
  'point+island': {
    spring: 'compare the point side facing the island with the protected island rim. The gap is a reference area, not the whole island plan.',
    summer: 'compare the broad-water corner between point and island with shade or wind on either rim. Use the stronger comfort edge.',
    fall: 'read the gap as a bait compression area. Compare the point tip, island rim, and outside corner before slowing down.',
    winter: 'favor the point-island edge closest to stable-looking water. Keep casts around the strongest corner instead of circling both structures.',
  },
  'point+dam': {
    spring: 'compare the point-to-hard-edge transition with the nearby softer bank. Warmth, cover, or activity should decide the tighter side.',
    summer: 'compare wall contact, shade, and the point edge. The corner is the reference, but the full dam face should still earn attention.',
    fall: 'read the hard edge and point as a bait-pinning transition. Compare the wall-side seam with the point crown.',
    winter: 'keep the read tight to the stable hard-edge corner where the point meets the dam. Expand only after that edge is checked.',
  },
  'cove+neck': {
    spring: 'compare the neck shoulder with the protected cove interior. This treats the opening as a doorway without assuming a narrow mouth exists.',
    summer: 'compare the neck side nearest broader water with shade or cover inside the cove. Avoid reading warm interior water as automatic.',
    fall: 'read the neck and cove edge as a bait route. Compare the constriction with the first defined shoreline inside the cove.',
    winter: 'favor the neck side that keeps the easiest route to stable-looking water. The protected interior is a secondary reference.',
  },
  'cove+saddle': {
    spring: 'compare the saddle shoulder with the protected cove edge. Use the highlighted area as a route into pocket water, not a fixed mouth target.',
    summer: 'compare the saddle side facing broader water with shade, cover, or the outer cove edge. The interior should earn time.',
    fall: 'read the saddle and cove edge as a moving-water transition. Let bait or wind decide whether the crossing or pocket edge matters more.',
    winter: 'keep the read near the saddle side and outer cove edge. Move inward only when cover or stable-looking water supports it.',
  },
  'cove+island': {
    spring: 'compare the island rim facing the cove with the protected shoreline edge. The gap is a staging reference for varied cove shapes.',
    summer: 'compare the island side with better comfort against the opening-facing cove edge. Shade, wind, or cover should pick the focus.',
    fall: 'read the island-cove gap as a bait collection area. Compare both edges before chasing activity deeper into the pocket.',
    winter: 'favor the island edge nearest the cove exit or broader water. Keep the protected bank as a careful second reference.',
  },
  'cove+dam': {
    spring: 'compare the hard-edge transition with the protected cove side. This covers both narrow entrances and broad pockets beside the dam.',
    summer: 'compare shade or wall contact near the cove edge with any visible cover inside. The pocket should earn extra time.',
    fall: 'read the dam and cove edge as a bait-pinning corner. Compare the hard seam with the outer pocket edge first.',
    winter: 'favor the hard edge closest to stable-looking water beside the cove. The interior is secondary unless cover or bait supports it.',
  },
  'neck+saddle': {
    spring: 'compare the tighter neck shoulder with the broader saddle shoulder leading toward protected water. Read it as one travel route.',
    summer: 'compare the deeper-looking or shaded shoulder beside the pinch with the saddle edge. The safest edge should narrow the route.',
    fall: 'read the neck and saddle as connected bait routes. Compare compression first, then the wider shoulder that gives bait room to turn.',
    winter: 'stay beside the route on the most stable shoulder. The middle of the crossing is a later check after both edges.',
  },
  'neck+island': {
    spring: 'compare the island-side shoulder with the route toward protected water. Use the island rim as the pause reference.',
    summer: 'compare shade, wind, or broader-water access along the island-side neck. The corner should decide whether the lane deserves more time.',
    fall: 'read the island gap as bait compression. Compare both entrances and the island rim before widening around the structure.',
    winter: 'favor the stable side just outside the island gap. Work along the rim before spending time in the center lane.',
  },
  'neck+dam': {
    spring: 'compare the wall-side neck shoulder with the side leading toward protected water. Hard edge and route should be read together.',
    summer: 'compare shaded wall contact with the neck shoulder beside it. The constriction matters most where comfort or movement is present.',
    fall: 'read the hard edge and neck as a bait-pinning lane. Compare the wall seam with both shoulders.',
    winter: 'stay near the stable wall-side shoulder. Check beside the route before moving through the throat.',
  },
  'saddle+island': {
    spring: 'compare the island rim touching the saddle with the protected-side shoulder. Use the crossing as a route, not a single dot.',
    summer: 'compare the island rim facing the saddle with the open-water shoulder. Shade, wind, or quicker escape should decide the focus.',
    fall: 'read the saddle and island rim as connected bait edges. Compare the crossing with the strongest island corner.',
    winter: 'favor the island-side shoulder closest to stable-looking water. Work the connection slowly before circling wider.',
  },
  'saddle+dam': {
    spring: 'compare the dam-side saddle shoulder with the side leading toward protected water. Hard edge and crossing both matter.',
    summer: 'compare shade or movement along the wall with the saddle shoulder facing broader water. Let comfort narrow the read.',
    fall: 'read the wall and saddle as a framed crossing. Compare the hard-edge corner with the opposite shoulder.',
    winter: 'favor the stable wall-side edge of the saddle. Keep the read close to hard structure before widening across the crossing.',
  },
  'island+dam': {
    spring: 'compare the island rim beside the hard edge with the protected side nearby. Treat the gap as a transition reference.',
    summer: 'compare shade, wall contact, and the island corner with broader-water access. The strongest comfort edge should lead.',
    fall: 'read the island-wall gap as a bait-pinning edge. Compare the seam and outside corner before circling the island.',
    winter: 'stay near the stable island-wall corner. Use the hard edge as the reference before checking the open rim.',
  },
  'point+cove+island': {
    spring: 'compare the point edge, island rim, and protected cove side as one staging intersection. Keep the read outside-in and shape aware.',
    summer: 'compare the point and island edges with the opening-facing cove side. Shade, wind, or cover should decide whether the pocket matters.',
    fall: 'read the point, island, and cove as a bait intersection with several exits. Follow activity without assuming the whole pocket is active.',
    winter: 'favor the outside point-island edge closest to stable-looking water. The protected cove side is a careful follow-up.',
  },
  travel_hub: {
    spring: 'compare the route leading toward protected water with each nearby shoulder. The overlap is a travel hub, not a single cast target.',
    summer: 'compare the safest edge beside the route with shade, wind, or cover nearby. Fish the hub efficiently unless activity builds.',
    fall: 'read the route compression as a bait hub. Compare entrances and shoulders, then repeat the side that shows activity.',
    winter: 'stay just beside the route on the most stable shoulder. Work slowly before testing the center of the hub.',
  },
  island_travel_hub: {
    spring: 'compare the island-side route with the protected rim or shoulder nearby. Use the island edge as the pause reference.',
    summer: 'compare the island shoulder with shade, wind, or broad-water access against the travel lane. Let one clear advantage guide the pass.',
    fall: 'read the island-side route as bait compression along the rim. Compare the lane and corner before circling wider.',
    winter: 'favor the stable island shoulder outside the route. Work just off the rim before treating the whole complex as active.',
  },
  mouth_complex: {
    spring: 'compare the outer opening edge with the protected side inside. This keeps the read useful for both narrow coves and broad pockets.',
    summer: 'compare the outside opening edge with shade, cover, or comfort inside. The pocket itself should earn more time.',
    fall: 'read the opening as a bait gate. Compare both sides and follow activity only as far as it stays clear.',
    winter: 'favor the outside edge closest to stable-looking water. Move inward only when cover, bait, or protection supports it.',
  },
  island_complex: {
    spring: 'compare the protected island rim with the connected shoreline edge. Let the strongest corner choose the first focused pass.',
    summer: 'compare shade, wind, or broad-water access around the island with the connected structure. Avoid equal time around every rim.',
    fall: 'read the island-facing edges as moving bait lanes. Compare corners and attached structure before slowing down.',
    winter: 'favor the island side closest to stable-looking water. The connected edge is a second compact reference.',
  },
  shoreline_complex: {
    spring: 'compare the shaped or hard bank with the protected side nearby. Use the transition to narrow the shoreline read.',
    summer: 'compare shade, hard edge, or quick escape along the shoreline change. The connected bank should earn extra time.',
    fall: 'read the shoreline change as a bait-pinning edge. Compare the corner with nearby cover or wind influence.',
    winter: 'favor the most stable hard or protected edge. Keep the read close to the strongest shoreline change.',
  },
  mixed_confluence: {
    spring: 'compare the side leading toward protected water with the nearest strong edge. Use the overlap to organize the read, not widen it.',
    summer: 'compare shade, wind, cover, or quicker escape across the overlap. Choose the clearest comfort edge before expanding.',
    fall: 'read the overlap as a moving bait intersection. Compare routes quickly, then repeat the side that shows activity.',
    winter: 'favor the most stable side of the overlap. Work slowly beside the intersection instead of covering every piece equally.',
  },
};

function confluenceBody(season: WaterReaderSeason, zones: WaterReaderPlacedZone[] = [], seed = ''): string {
  const key = confluenceTemplateKey(zones);
  const body = CONFLUENCE_BODIES[key]?.[season] ?? CONFLUENCE_BODIES.mixed_confluence[season];
  return sentenceCase(pickBodyVariant(
    `${seed}|${season}|${key}|${zones.map((zone) => zone.zoneId).sort().join('|')}`,
    confluenceBodyVariants(key, season, body),
  ));
}

function confluenceBodyVariants(
  key: ConfluenceTemplateKey,
  season: WaterReaderSeason,
  baseBody: string,
): string[] {
  const featureSet = new Set(key.split('+').flatMap((part) => part.split('_')) as PublicConfluenceFeature[]);
  if (key === 'mouth_complex' || featureSet.has('cove')) {
    return uniqueStrings([
      baseBody,
      'compare the opening-facing cove edge with the connected structure. Treat broad pockets as outer transitions, not fixed narrow mouths.',
      `use the overlap to compare protected water, broader-water access, and the connected structure. ${seasonalConfluenceFocus(season)}`,
    ]);
  }
  if (key === 'island_complex' || key === 'island_travel_hub' || featureSet.has('island')) {
    return uniqueStrings([
      baseBody,
      'compare the island rim with the connected edge or shoulder. Let one rim section narrow the pass before circling wider.',
      `use the overlap as an island-edge reference beside connected structure. ${seasonalConfluenceFocus(season)}`,
    ]);
  }
  if (key === 'travel_hub' || featureSet.has('neck') || featureSet.has('saddle')) {
    return uniqueStrings([
      baseBody,
      'compare the travel route with both nearby shoulders. Work the edges before treating the center lane as the target.',
      `use the overlap as a route-and-shoulder comparison. ${seasonalConfluenceFocus(season)}`,
    ]);
  }
  if (key === 'shoreline_complex' || featureSet.has('dam')) {
    return uniqueStrings([
      baseBody,
      'compare the hard edge or shoreline change with the connected structure. The corner is a reference, not the whole plan.',
      `use the overlap to compare hard edge, softer shoreline, and nearby structure. ${seasonalConfluenceFocus(season)}`,
    ]);
  }
  return uniqueStrings([
    baseBody,
    'compare the strongest nearby edges inside the overlap. Keep the read conservative until one side shows more activity.',
    `use the overlap to organize the first pass across nearby structure. ${seasonalConfluenceFocus(season)}`,
  ]);
}

function seasonalConfluenceFocus(season: WaterReaderSeason): string {
  switch (season) {
    case 'spring':
      return 'Give extra weight to the side that points toward protected water.';
    case 'summer':
      return 'Give extra weight to comfort clues like shade, wind, cover, or quicker escape.';
    case 'fall':
      return 'Give extra weight to the side that gathers bait or narrows bait movement.';
    case 'winter':
      return 'Give extra weight to the side closest to stable-looking water.';
  }
}

function confluenceTemplateKey(zones: WaterReaderPlacedZone[]): ConfluenceTemplateKey {
  const features = confluenceFeatureSet(zones);
  if (features.length < 2) return 'mixed_confluence';
  const exactKey = features.join('+') as ConfluenceTemplateKey;
  if (exactKey === 'point+cove+island') return exactKey;
  if (features.length === 2 && PAIR_CONFLUENCE_KEYS.has(exactKey)) return exactKey;

  const hasPoint = features.includes('point');
  const hasCove = features.includes('cove');
  const hasNeck = features.includes('neck');
  const hasSaddle = features.includes('saddle');
  const hasIsland = features.includes('island');
  const hasDam = features.includes('dam');
  const hasTravel = hasNeck || hasSaddle;

  if (hasIsland && hasTravel) return 'island_travel_hub';
  if (hasPoint && hasCove && hasIsland) return 'point+cove+island';
  if (hasTravel) return 'travel_hub';
  if (hasPoint && hasCove) return 'mouth_complex';
  if (hasIsland) return 'island_complex';
  if (hasDam) return 'shoreline_complex';
  return 'mixed_confluence';
}

function confluenceFeatureSet(zones: WaterReaderPlacedZone[]): PublicConfluenceFeature[] {
  const labels = new Set<PublicConfluenceFeature>();
  for (const zone of zones) labels.add(publicConfluenceFeature(zone.featureClass));
  return CONFLUENCE_ORDER.filter((feature) => labels.has(feature) && feature !== 'universal');
}

function publicConfluenceFeature(feature: WaterReaderFeatureClass): PublicConfluenceFeature {
  switch (feature) {
    case 'main_lake_point':
    case 'secondary_point':
      return 'point';
    case 'cove':
    case 'neck':
    case 'saddle':
    case 'island':
    case 'dam':
    case 'universal':
      return feature;
  }
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
  const envelopeLabel = featureEnvelopeMemberLabel(zone.placementKind);
  if (envelopeLabel) return envelopeLabel;
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

function openWaterConfluenceMemberLabel(zone: WaterReaderPlacedZone): string | null {
  if (zone.featureClass === 'main_lake_point' && zone.placementKind === 'main_point_open_water') {
    return zone.anchorSemanticId === 'main_point_open_water_area' ? 'Point Open-Water Side' : 'Point Broad-Water Recovery';
  }
  if (zone.featureClass === 'island' && zone.placementKind === 'island_open_water') {
    if (zone.anchorSemanticId === 'island_open_water_area') return 'Island Open-Water Edge';
    if (zone.anchorSemanticId === 'island_open_water_same_side_recovery' || zone.anchorSemanticId === 'island_open_water_recovery') return 'Island Open-Water Recovery';
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

function unique<T>(items: T[]): T[] {
  return [...new Set(items)];
}

function uniqueStrings(items: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of items) {
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

function pickBodyVariant(seed: string, variants: string[]): string {
  const options = uniqueStrings(variants);
  if (options.length <= 1) return options[0] ?? '';
  return options[hashString(seed) % options.length]!;
}

function sentenceCase(text: string): string {
  const trimmed = text.trim();
  return trimmed.replace(/^./, (char) => char.toUpperCase());
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) {
    h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}
