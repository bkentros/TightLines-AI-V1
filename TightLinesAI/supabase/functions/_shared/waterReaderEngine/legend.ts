import type { PointM, WaterReaderFeatureClass, WaterReaderLegendEntry, WaterReaderSeason } from './contracts.ts';
import { lookupWaterReaderSeason } from './seasons.ts';
import type {
  WaterReaderPlacedZone,
  WaterReaderStructureConfluenceGroup,
  WaterReaderZonePlacementKind,
  WaterReaderZonePlacementSemanticId,
  WaterReaderZonePlacementResult,
} from './zones/types.ts';

/**
 * Paper-warm Water Reader feature palette.
 *
 * MUST stay in lock-step with the client-side mirror at
 * `lib/waterReaderZonePaperPalette.ts` (`PAPER_WARM_FEATURE_COLORS`). When
 * either side changes, change both AND bump `WATER_READER_ENGINE_VERSION`
 * (in `supabase/functions/_shared/waterReaderRead/contracts.ts`) so any
 * cached SVG rows generated under the older palette are regenerated.
 *
 * Why these hues: the original launch palette was tuned against a near-white
 * SVG backdrop. The FinFindr app shell renders Water Reader on the warm
 * paper canvas (`paper.paper` #E8DFC9 / `paper.paperLight` #F0E8D4 in
 * `lib/theme.ts`), against which the spec's saturated blue/green/magenta
 * read as too loud. The paper-warm swap below preserves the original
 * meaning (each feature class still has a deterministic glance-recognizable
 * hue) but anchors the palette in the paper / forest / gold / walnut /
 * red / moss vocabulary the rest of the app already uses.
 */
export const WATER_READER_FEATURE_COLORS: Record<WaterReaderFeatureClass | 'structure_confluence', string> = {
  // Main features → forest / moss spine.
  main_lake_point: '#2E4A2A',     // paper.forest — anchor of the system.
  secondary_point: '#5B7A3E',     // paper.moss — softer companion to forest.
  // Coves carry the warm gold (the same hue used for "FAIR" tier elsewhere).
  cove: '#B87818',                 // paper.goldDk — readable on paperLight.
  // Necks/pinches → rust, the warm orange that already lives in paper.
  neck: '#CC6A22',                 // paper.rust.
  // Islands → walnut, the warm dark brown for visually heavier features.
  island: '#3A2E22',               // paper.walnut.
  // Saddles → warmer teal that reads as "cool but still in the paper family".
  saddle: '#357A6F',
  // Dam corners → red, mirrors the SKIP / accent treatment.
  dam: '#C8352C',                  // paper.red.
  // Confluence → muted magenta-walnut so overlap groups still pop without
  // resorting to the screaming #D946EF magenta.
  structure_confluence: '#7A3A52',
  // Universal pond fallback → the same gold pivot the rest of the app uses.
  universal: '#E8A02E',            // paper.gold.
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
  spring: 'Pattern is shifting; check protected water and nearby main-lake edges before settling in.',
  summer: 'Pattern is shifting; protected banks can still matter when shade, cover, bait, or wind lines up.',
  fall: 'Pattern is shifting; open-water edges can still matter when bait or wind sets up there.',
  winter: 'Pattern is shifting; pocket and shoreline edges can still matter if cover or calmer water is present.',
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

type LegendCadenceProfile =
  | 'primary'
  | 'start_then_check'
  | 'quick_checkpoint'
  | 'treat_as_option'
  | 'leave_unless'
  | 'one_pass_then_shift';

type LegendCadenceContext = {
  key: string;
  occurrenceIndex: number;
  occurrenceCount: number;
  profile: LegendCadenceProfile;
};

const REPEATED_LEGEND_CADENCE_PROFILES: LegendCadenceProfile[] = [
  'start_then_check',
  'quick_checkpoint',
  'treat_as_option',
  'leave_unless',
  'one_pass_then_shift',
];

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
    body: (season) => `Start on this edge of the narrow opening, then check the opposite edge. Stay longer only if bait, wind, cover, or current makes one side clearly better.`,
  },
  saddle_shoulder: {
    title: 'Saddle Shoulder',
    body: (season) => `Start on this edge of the crossing, then look across to the other side. The better edge is the one with bait, wind, cover, or calmer water.`,
  },
  main_point_side: {
    title: 'Main Lake Point - Point Side',
    body: (season) => `Start on the highlighted side of the point, then check the tip. If shade, bait, wind, or cover lines up here, give this side more time.`,
  },
  main_point_tip: {
    title: 'Main Lake Point - Point Tip',
    body: (season) => `Start on the tip, then work down the two sides. The side with bait, wind, cover, or a sharper turn is the one to slow down on.`,
  },
  main_point_open_water: {
    title: 'Main Lake Point - Open-Water Side',
    body: (season) => `Start on the open-water side of the point. If it has no clear bait, shade, wind, or cover, check the more protected side before treating the whole point as quiet.`,
  },
  cove_back: {
    title: 'Cove - Inside Edge',
    body: (season) => `Start on this calmer inside edge, then check the side closest to open water. Stay longer where cover, bait, shade, or a sharper bank turn lines up.`,
  },
  cove_mouth: {
    title: 'Cove - Open-Water Edge',
    body: (season) => `Start on the side closest to open water, then check the calmer inside edge. This works for narrow coves and broad corner pockets.`,
  },
  cove_irregular_side: {
    title: 'Cove - Shaped Bank',
    body: (season) => `Start on the strongest bend or bank change inside the highlighted water. Slow down if that shape also has shade, cover, bait, or calmer water.`,
  },
  secondary_point_back: {
    title: 'Secondary Point - Protected Side',
    body: (season) => `Start on the tucked-away side of the smaller point, then check the tip. This side earns more time when cover, shade, or calmer water is present.`,
  },
  secondary_point_mouth: {
    title: 'Secondary Point - Open-Water Side',
    body: (season) => `Start on the side closest to open water, then work across the tip. Stay if bait, wind, or cover makes this small point feel active.`,
  },
  island_mainland: {
    title: 'Island Edge - Shore-Facing Edge',
    body: (season) => `Start on the island rim that faces nearby shoreline, then check the nearest corner. Keep circling only if bait, cover, wind, or shade gives you a reason.`,
  },
  island_open_water: {
    title: 'Island Edge - Open-Water Edge',
    body: (season) => `Start on the open-water rim, then check the nearest protected side. Do not treat the whole island equally unless activity follows you around it.`,
  },
  island_endpoint: {
    title: 'Island Edge - Island End',
    body: (season) => `Start on the island end, then work each adjoining side. The better side is the one with bait, wind, shade, or quick access to open water.`,
  },
  dam_corner: {
    title: 'Dam Corner',
    body: (season) => `Start where the hard edge changes direction or meets natural shoreline. Stay longer if shade, bait, wind, or warmer rock makes the corner stand out.`,
  },
  universal_longest_shoreline: {
    title: 'Universal Shoreline - Longest Uniform Shoreline',
    body: () => 'Start with this longest clean shoreline because no stronger structure stood out. Look for cover, shade, bait, or a small bank change before slowing down.',
  },
  universal_centroid_shoreline: {
    title: 'Universal Shoreline - Interior-Center Shoreline',
    body: () => "Start with this central shoreline as a simple-water checkpoint. Stay only if cover, shade, bait, or a clearer bank edge gives you a reason.",
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
  const cadencePlan = buildLegendCadencePlan(zoneResult, confluenceByZoneId);

  const entries: WaterReaderLegendEntry[] = [];
  const emittedConfluenceGroups = new Set<string>();
  for (const zone of zoneResult.zones) {
    const group = confluenceByZoneId.get(zone.zoneId);
    if (group) {
      if (!group.crossFeatureOverlapPair) {
        entries.push(buildZoneEntry(entries.length + 1, zone, season, transitionWarningForZone(zone, seasonLookup), cadencePlan.get(zone.zoneId)));
        continue;
      }
      if (emittedConfluenceGroups.has(group.groupId)) continue;
      emittedConfluenceGroups.add(group.groupId);
      entries.push(buildConfluenceEntry(entries.length + 1, group, zoneResult.zones, season, transitionWarningForGroup(group, zoneResult.zones, seasonLookup), cadencePlan.get(group.groupId)));
      continue;
    }
    entries.push(buildZoneEntry(entries.length + 1, zone, season, transitionWarningForZone(zone, seasonLookup), cadencePlan.get(zone.zoneId)));
  }
  return disambiguateRepeatedLegendTitles(entries, zoneResult);
}

function buildLegendCadencePlan(
  zoneResult: WaterReaderZonePlacementResult,
  confluenceByZoneId: Map<string, WaterReaderStructureConfluenceGroup>,
): Map<string, LegendCadenceContext> {
  const planned: Array<{ id: string; key: string }> = [];
  const emittedConfluenceGroups = new Set<string>();

  for (const zone of zoneResult.zones) {
    const group = confluenceByZoneId.get(zone.zoneId);
    if (group?.crossFeatureOverlapPair) {
      if (emittedConfluenceGroups.has(group.groupId)) continue;
      emittedConfluenceGroups.add(group.groupId);
      const memberZones = group.memberZoneIds
        .map((zoneId) => zoneResult.zones.find((candidate) => candidate.zoneId === zoneId))
        .filter((candidate): candidate is WaterReaderPlacedZone => Boolean(candidate));
      planned.push({
        id: group.groupId,
        key: `confluence:${confluenceTemplateKey(memberZones)}`,
      });
      continue;
    }
    planned.push({
      id: zone.zoneId,
      key: `feature:${zone.featureClass}`,
    });
  }

  const counts = countBy(planned.map((item) => item.key));
  const profileOffsets = new Map<string, number>();
  for (const [key, count] of counts) {
    if (count <= 1) continue;
    const stableIds = planned
      .filter((item) => item.key === key)
      .map((item) => item.id)
      .sort()
      .join('|');
    profileOffsets.set(key, hashString(`${key}|${stableIds}`) % REPEATED_LEGEND_CADENCE_PROFILES.length);
  }
  const seen = new Map<string, number>();
  const contexts = new Map<string, LegendCadenceContext>();

  for (const item of planned) {
    const occurrenceIndex = (seen.get(item.key) ?? 0) + 1;
    seen.set(item.key, occurrenceIndex);
    const occurrenceCount = counts.get(item.key) ?? 1;
    contexts.set(item.id, {
      key: item.key,
      occurrenceIndex,
      occurrenceCount,
      profile: cadenceProfileFor(occurrenceIndex, occurrenceCount, profileOffsets.get(item.key) ?? 0),
    });
  }

  return contexts;
}

function cadenceProfileFor(
  occurrenceIndex: number,
  occurrenceCount: number,
  startOffset = 0,
): LegendCadenceProfile {
  if (occurrenceCount <= 1) return 'primary';
  return REPEATED_LEGEND_CADENCE_PROFILES[
    (startOffset + occurrenceIndex - 1) % REPEATED_LEGEND_CADENCE_PROFILES.length
  ]!;
}

export function waterReaderLegendForbiddenPhraseHits(text: string): string[] {
  const lower = text.toLowerCase();
  return WATER_READER_LEGEND_FORBIDDEN_PHRASES.filter((phrase) => lower.includes(phrase.toLowerCase()));
}

export function waterReaderLegendTemplateCoverage() {
  const missingTemplateKeys: string[] = [];
  const forbiddenTemplateHits: Array<{ key: string; hits: string[] }> = [];
  const standaloneVariantGaps: string[] = [];
  const confluenceVariantGaps: string[] = [];
  const missingColorKeys = WATER_READER_LEGEND_FEATURE_CLASSES.filter((featureClass) => !WATER_READER_FEATURE_COLORS[featureClass]);
  const minimumCadenceVariantCount = REPEATED_LEGEND_CADENCE_PROFILES.length;

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

  for (const featureClass of WATER_READER_LEGEND_FEATURE_CLASSES) {
    if (featureClass === 'structure_confluence') continue;
    for (const season of WATER_READER_LEGEND_SEASONS) {
      const variants = standaloneStructureBodyVariants(featureClass, season);
      if (variants.length < minimumCadenceVariantCount) {
        standaloneVariantGaps.push(`${featureClass}:${season}`);
      }
    }
  }

  let checkedConfluenceVariantCount = 0;
  for (const [confluenceKey, seasonBodies] of Object.entries(CONFLUENCE_BODIES) as Array<[ConfluenceTemplateKey, Record<WaterReaderSeason, string>]>) {
    for (const season of WATER_READER_LEGEND_SEASONS) {
      const variants = confluenceBodyVariants(confluenceKey, season, seasonBodies[season]).map(sentenceCase);
      checkedConfluenceVariantCount += variants.length;
      if (variants.length < minimumCadenceVariantCount) confluenceVariantGaps.push(`structure_confluence:${season}:${confluenceKey}`);
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
    standaloneVariantGaps,
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
  cadenceContext?: LegendCadenceContext,
): WaterReaderLegendEntry {
  const templateId = templateIdFor(zone.featureClass, season, zone.placementKind);
  const resolvedTemplate = resolvedZoneTemplate(zone, season);
  const body = pickBodyVariant(
    `${zone.zoneId}|${season}|${zone.placementKind}|${zone.anchorSemanticId ?? ''}`,
    bodyVariantsForZone(zone, season, resolvedTemplate),
    cadenceContext,
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
  cadenceContext?: LegendCadenceContext,
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
    body: confluenceBody(season, memberZones, group.groupId, cadenceContext),
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
        case 'spring': return 'Start on the side of the point that leads toward protected water, then check the tip. Stay longer where warmth, cover, bait, or a sharper turn lines up.';
        case 'summer': return 'Start on the open-water side or shaded edge of the point. If bait, wind, or cover is present, work the tip and that side more carefully.';
        case 'fall': return 'Start across the tip, then follow the side where bait, wind, or activity points. This is a travel spot, so do not spend equal time everywhere.';
        case 'winter': return 'Start on the point edge closest to deeper or calmer water. Fish the tip and nearest side slowly before widening around the whole point.';
      }
    case 'secondary_point_structure_area':
      switch (season) {
        case 'spring': return 'Start on the protected side of the smaller point, then check the tip. It is worth more time if warmth, cover, or calmer water is nearby.';
        case 'summer': return 'Start on the side closest to open water, then check shade or cover near the tip. Leave quickly if those clues are missing.';
        case 'fall': return 'Start with a quick pass across the tip and both sides. Slow down only where bait, wind, or a sharper edge gives you direction.';
        case 'winter': return 'Start tight to the tip and the side closest to deeper or calmer water. Treat this as a checkpoint, not a whole-area grind.';
      }
    case 'cove_structure_area':
      switch (season) {
        case 'spring': return 'Start on the calmer inside edge, especially near cover or warmer water. Then check the side closest to open water before leaving.';
        case 'summer': return 'Start on shade, cover, or the side closest to open water. Move deeper into the pocket only if bait or calmer water gives you a reason.';
        case 'fall': return 'Start on the outer edge, then follow bait or wind toward the shaped bank. Stay with the side where activity collects.';
        case 'winter': return 'Start near the outer edge and the most protected defined bank. Keep the pass slow, and stay only where cover or calmer water supports it.';
      }
    case 'neck_structure_area':
      switch (season) {
        case 'spring': return 'Start on the edge that leads toward protected water, then check the opposite edge. The middle is secondary unless bait is moving through.';
        case 'summer': return 'Start on the shaded, wind-hit, or open-water edge of the narrow opening. Work the other edge only if it has cover or bait.';
        case 'fall': return 'Start where the opening squeezes bait the most. Repeat the edge that shows activity before casting through the middle.';
        case 'winter': return 'Start just beside the narrow opening on the side closest to deeper or calmer water. Work slowly before testing the center lane.';
      }
    case 'saddle_structure_area':
      switch (season) {
        case 'spring': return 'Start on the side that leads toward protected water, then check the opposite side. Use the crossing to pick the edge that gets more casts.';
        case 'summer': return 'Start on the edge with shade, wind, cover, or quick access to open water. The middle is a follow-up, not the first target.';
        case 'fall': return 'Start with a broad pass across the crossing, then slow down on the side with bait or wind. One edge usually matters more.';
        case 'winter': return 'Start on the edge closest to deeper or calmer water. Keep the work compact before spreading across the whole crossing.';
      }
    case 'island_structure_area':
      switch (season) {
        case 'spring': return 'Start on the island side that faces protected water, then check the nearest corner. Cover or warmer water makes that rim worth more time.';
        case 'summer': return 'Start on shade, wind, or the open-water rim. Do not circle the whole island slowly unless bait or activity follows that edge.';
        case 'fall': return 'Start on the wind-facing or bait-facing rim, then check the corners. Slow down only after one side shows life.';
        case 'winter': return 'Start on the island side closest to deeper or calmer water. Fish one strong rim carefully before circling wider.';
      }
    case 'dam_structure_area':
      switch (season) {
        case 'spring': return 'Start where the hard edge meets a corner or softer bank. Stay longer if sun-warmed rock, cover, or nearby bait lines up there.';
        case 'summer': return 'Start on shade, wall contact, or the strongest corner. If bait is present, work the face; if not, move to the next edge.';
        case 'fall': return 'Start where bait can be pushed against the hard edge. Check the corner first, then run the face only while activity stays present.';
        case 'winter': return 'Start on the most stable hard edge or corner. Keep casts tight to rock or wall before checking nearby softer bank.';
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
        title: 'Island Edge - Shore-Facing Recovery',
        body: `Start on this shore-facing island rim, then check the nearest corner. The exact rim line is broad, so let cover, bait, wind, or shade narrow it.`,
      };
    case 'island_shoreline_recovery':
    case 'island_alternate_endpoint_recovery':
    case 'island_open_water_recovery':
    case 'shoreline_frame_recovery':
      return {
        title: 'Island Edge - Shoreline Recovery',
        body: `Start on this local island shoreline as a careful first check. Stay near the highlighted rim until one side gives you a clearer clue.`,
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
        body: `Start near this island end, then check the two adjoining rim sections. Slow down on the side with bait, wind, shade, or quick access to open water.`,
      };
    default:
      return null;
  }
}

function openWaterSemanticTemplate(zone: WaterReaderPlacedZone, season: WaterReaderSeason): WaterReaderResolvedLegendTemplate | null {
  if (zone.featureClass === 'main_lake_point' && zone.placementKind === 'main_point_open_water') {
    if (zone.anchorSemanticId === 'main_point_open_water_area') return null;
    return {
      title: 'Main Lake Point - Open-Water Side Recovery',
      body: `Start on this open-water side of the point, then check the protected side. The highlighted side is broad, so let bait, wind, cover, or shade narrow it.`,
    };
  }
  if (zone.featureClass === 'island' && zone.placementKind === 'island_open_water') {
    if (zone.anchorSemanticId === 'island_open_water_area') return null;
    if (zone.anchorSemanticId === 'island_open_water_same_side_recovery' || zone.anchorSemanticId === 'island_open_water_recovery') {
      return {
        title: 'Island Edge - Open-Water Recovery',
        body: `Start on this open-water island rim, then check nearby rim sections. The outside edge is broad, so slow down only where clues line up.`,
      };
    }
    if (zone.anchorSemanticId === 'island_shoreline_recovery' || zone.anchorSemanticId === 'island_alternate_endpoint_recovery' || zone.anchorSemanticId === 'shoreline_frame_recovery') {
      return {
        title: 'Island Edge - Shoreline Recovery',
        body: `Start on this local island shoreline as a careful first check. Treat the highlighted rim as the target until one side gives a clearer reason.`,
      };
    }
    return {
      title: 'Island Edge - Open-Water Recovery',
      body: `Start on this open-water island edge, then check the nearest protected rim. Do not commit to the whole island unless activity follows the edge.`,
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
        title: 'Secondary Point - Protected Side',
        body: `Start on this protected side of the smaller point, then check the tip. Stay longer if cover, shade, bait, or calmer water lines up here.`,
      };
    case 'secondary_point_mouth_true':
      return {
        title: 'Secondary Point - Open-Water Side',
        body: `Start on the side closest to open water, then work across the tip. On broad pockets, this outer edge may matter more than the tucked-away side.`,
      };
    case 'secondary_point_parent_cove_missing':
    case 'secondary_point_parent_cove_axis_recovery':
    case 'secondary_point_back_proxy':
    case 'secondary_point_mouth_proxy':
    case 'secondary_point_side_recovery':
    case 'secondary_point_tip_transition':
      return {
        title: 'Secondary Point - Cove-Side Recovery',
        body: `Start on this smaller point as a careful cove-side check. The side label is broad, so use cover, bait, wind, or shade to choose the better edge.`,
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
        title: 'Cove - Inside Edge',
        body: `Start on this calmer inside edge, especially around cover, shade, or warmer water. Then check the side closest to open water before leaving.`,
      };
    case 'cove_back_pocket_recovery':
    case 'cove_back_pocket_recovery_left':
    case 'cove_back_pocket_recovery_right':
      return {
        title: 'Cove - Protected Pocket',
        body: `Start in this protected pocket as a careful first check. It may be a broad corner, so stay only where cover, bait, shade, or calmer water lines up.`,
      };
    case 'cove_inner_shoreline_left':
    case 'cove_inner_shoreline_right':
    case 'cove_inner_wall_midpoint_left':
    case 'cove_inner_wall_midpoint_right':
      return {
        title: 'Cove - Inner Shoreline',
        body: `Start along this inner shoreline where the bank shape changes. Then check the outer edge, especially if bait, wind, or shade points that way.`,
      };
    case 'cove_mouth_shoulder_recovery':
    case 'cove_mouth_primary':
    case 'cove_opposite_mouth':
    case 'cove_near_mouth_inner_wall':
    case 'cove_near_mouth_inner_wall_opposite':
      return {
        title: 'Cove - Open-Water Edge',
        body: `Start on the cove side closest to open water. On wide pockets, treat this as the outer edge and move inward only when the clues improve.`,
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
        `Use this point as a quick checkpoint between shoreline and open water. ${focus}`,
        `Treat the tip and two sides as separate targets. Stay on the side where cover, bait, wind, or shade lines up.`,
        `Check the open-water side first, then the protected side. Leave quickly if neither side has cover, bait, wind, or shade.`,
        `Make one pass across the tip, then shift to the better side. The better side is the one with the clearest fishing clue.`,
        `Start broad across the highlighted point, then narrow fast. Do not give every side equal time unless activity follows the edge.`,
      ];
    case 'secondary_point':
      return [
        `Use this smaller point as a quick checkpoint between tucked-away water and open water. ${focus}`,
        `Treat the tip as the first test, then choose the better side. Cover, bait, shade, or wind decides where you slow down.`,
        `Check the side closest to open water before spending time on the calmer side. Leave quickly if neither side has a clear clue.`,
        `Make one clean pass around the tip, then shift only if the edge has cover, bait, shade, or sharper bank shape.`,
        `Start tight to the highlighted point instead of fishing the whole pocket. Give small points extra time only when one side clearly stands out.`,
      ];
    case 'cove':
      return [
        `Use this cove as a quick checkpoint, not a place to camp. ${focus}`,
        `Treat the highlighted water as a protected pocket or broad corner. Stay longer only where cover, bait, shade, or calmer water lines up.`,
        `Check the side closest to open water first, then the calmer inside edge. Leave quickly if neither side has cover, bait, shade, or wind.`,
        `Make one pass along the shaped bank, then shift only if bait, cover, shade, or a sharper turn gives you a reason.`,
        `Start with the clearest edge in the highlighted water. Let the strongest cove clue decide whether you work inward or move on.`,
      ];
    case 'neck':
      return [
        `Use this narrow opening as a quick checkpoint between two water areas. ${focus}`,
        `Treat the two edges as the main targets. Stay on the side where bait, cover, wind, or shade makes the pinch stronger.`,
        `Check both edges before casting through the middle. Leave quickly if the opening has no bait, cover, wind, or shade.`,
        `Make one pass along each edge, then shift to the side where bait has less room to escape.`,
        `Start beside the narrowest water, not in the center. Give the slower pass to the edge with the clearest clue.`,
      ];
    case 'saddle':
      return [
        `Use this crossing as a quick checkpoint between nearby edges. ${focus}`,
        `Treat the two sides as separate targets. Stay on the side where bait, wind, shade, or cover makes the crossing stronger.`,
        `Check the edges before working the middle. Leave quickly if neither side shows bait, cover, wind, or calmer water.`,
        `Make one pass across the crossing, then shift to the edge that gives fish the easiest reason to stop.`,
        `Start on the cleanest edge of the saddle. The middle is only worth more time if activity pulls you across it.`,
      ];
    case 'island':
      return [
        `Use this island edge as a quick checkpoint before circling wider. ${focus}`,
        `Treat the nearest corner and rim as separate targets. Stay on the side with bait, wind, shade, cover, or quick open-water access.`,
        `Check one strong rim before working the whole island. Leave quickly if the edge has no cover, bait, wind, or shade.`,
        `Make one pass along the highlighted rim, then shift only if a corner or side gives you a better clue.`,
        `Start where the island edge changes direction. Give the full perimeter time only when bait, wind, shade, or visible cover follows it.`,
      ];
    case 'dam':
      return [
        `Use this hard edge as a quick checkpoint before running the whole face. ${focus}`,
        `Treat the corner and straight face as separate targets. Stay where bait, shade, wind, warmer rock, or cover makes the edge stand out.`,
        `Check the corner first, then the straight face. Leave quickly if the hard edge has no bait, shade, wind, or cover.`,
        `Make one pass tight to rock or wall, then shift only if the edge shows bait, shade, wind, or a clean transition.`,
        `Start where hard structure changes angle or meets softer shoreline. Let that change decide whether the dam gets more time.`,
      ];
    case 'universal':
      return [
        `Use this simple shoreline as a quick checkpoint. ${focus}`,
        `Treat the highlighted bank as a starting edge, then let cover, shade, bait, or a sharper turn decide where to slow down.`,
        `Check the cleanest visible edge first. Leave quickly if there is no cover, shade, bait, wind, or bank change.`,
        `Make one pass along the highlighted shoreline, then shift only if another edge gives a clearer reason.`,
        `Start simple and look for one useful clue. On plain water, let cover, shade, bait, or bank shape choose the spot.`,
      ];
  }
}

function seasonalFocus(season: WaterReaderSeason): string {
  switch (season) {
    case 'spring':
      return 'Give more time to warmth, cover, and calmer water near the highlighted edge.';
    case 'summer':
      return 'Give more time to shade, wind, cover, and quick access to open water.';
    case 'fall':
      return 'Give more time to the side that gathers bait or wind.';
    case 'winter':
      return 'Give more time to the edge closest to deeper or calmer water.';
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
    spring: 'start where the point meets the protected pocket edge, then check the calmer inside side. Stay longer if warmth, cover, or bait lines up there.',
    summer: 'start on the point side closest to open water, then check shade or cover inside the pocket. Move inward only when the clues improve.',
    fall: 'start on the point edge, then follow bait or wind toward the pocket side. Stay with the edge where activity collects.',
    winter: 'start on the point and outer pocket edge closest to deeper or calmer water. Use the protected inside edge only when cover or bait supports it.',
  },
  'point+neck': {
    spring: 'start where the point feeds into the narrow opening, especially on the side leading toward protected water. Check the opposite edge after that.',
    summer: 'start on shade, wind, or the open-water side where the point touches the narrow opening. The middle is a follow-up, not the first target.',
    fall: 'start with casts from the point across the narrow opening. Repeat the edge where bait has less room to escape.',
    winter: 'start beside the point-neck edge closest to deeper or calmer water. Work the edge slowly before casting through the center lane.',
  },
  'point+saddle': {
    spring: 'start on the point edge that leads toward protected water, then check the saddle side beside it. Give more time to warmth, cover, or bait.',
    summer: 'start on the open-water point edge or the saddle side with shade, wind, or cover. Let that clue choose the slower pass.',
    fall: 'start across the point crown and nearby saddle edge. Slow down where bait, wind, or activity chooses one side.',
    winter: 'start on the point-saddle edge closest to deeper or calmer water. Work the corner before spreading across the whole crossing.',
  },
  'point+island': {
    spring: 'start in the gap between the point and island, then check the protected rim. Stay longer where cover, warmth, or bait lines up.',
    summer: 'start on the open-water corner between the point and island. Let shade, wind, or cover decide which rim gets more time.',
    fall: 'start with moving casts through the gap. Slow down only where bait gets trapped along the point tip or island rim.',
    winter: 'start on the point-island edge closest to deeper or calmer water. Work the strongest corner instead of circling both structures.',
  },
  'point+dam': {
    spring: 'start where the point meets the hard edge, then check the nearby softer bank. Stay longer if warmth, cover, or bait is present.',
    summer: 'start on shade, wall contact, or the point edge at the corner. Work the face only if bait or wind gives it life.',
    fall: 'start where bait can be pushed against the hard edge and point. Check the corner first, then sweep the point side.',
    winter: 'start tight to the hard-edge corner where the point meets the dam. Expand only after that edge gets a careful pass.',
  },
  'cove+neck': {
    spring: 'start on the narrow edge leading into the protected pocket, then check the calmer inside side. Warmth, cover, or bait makes it worth staying.',
    summer: 'start on the side closest to open water, then check shade or cover inside the pocket. Do not linger inside without a clear clue.',
    fall: 'start through the narrow edge, then follow bait or wind along the shaped pocket bank. Repeat the side where activity collects.',
    winter: 'start on the narrow edge closest to deeper or calmer water. Treat the protected inside side as a second check unless cover or bait is present.',
  },
  'cove+saddle': {
    spring: 'start where the saddle edge meets the protected pocket side. Move inward only if warmth, cover, or bait makes the pocket stronger.',
    summer: 'start on the saddle edge closest to open water, then check shade or cover on the pocket side. Give the inside edge time only when it has those clues.',
    fall: 'start across the saddle side, then follow bait or wind toward the pocket edge. Stay with whichever side shows activity.',
    winter: 'start near the saddle side and outer pocket edge. Move inward only when cover, bait, or calmer water gives you a reason.',
  },
  'cove+island': {
    spring: 'start on the island rim facing the protected pocket, then check the calmer shoreline edge. Stay where warmth, cover, or bait lines up.',
    summer: 'start on the island side with shade, wind, cover, or open-water access. Check the pocket side only when it has a stronger clue.',
    fall: 'start where bait can collect between the island rim and pocket edge. Follow activity, but do not assume the whole pocket is involved.',
    winter: 'start on the island edge closest to deeper or calmer water. Use the protected shoreline as a careful second check.',
  },
  'cove+dam': {
    spring: 'start where the hard edge meets the protected pocket side. Stay longer if sun-warmed rock, cover, or bait lines up there.',
    summer: 'start on shade or wall contact near the pocket edge. Move into the pocket only if cover, bait, or calmer water is obvious.',
    fall: 'start where bait can be pinned between the hard edge and pocket side. Work the corner before moving inward.',
    winter: 'start on the hard edge closest to deeper or calmer water beside the pocket. The inside edge is secondary unless cover or bait supports it.',
  },
  'neck+saddle': {
    spring: 'start on the tighter edge leading toward protected water, then widen onto the saddle side. Give more time to cover, warmth, or bait.',
    summer: 'start beside the pinch on the shaded, wind-hit, or open-water edge. Then check the saddle side if it has cover or bait.',
    fall: 'start where the route squeezes bait, then sweep the saddle side. Repeat the edge where bait has less room to turn.',
    winter: 'start beside the route on the edge closest to deeper or calmer water. The middle of the crossing is a later check.',
  },
  'neck+island': {
    spring: 'start where the narrow route touches the island rim, especially on the side leading toward protected water. Then check the nearest corner.',
    summer: 'start on shade, wind, or open-water access along the island-side opening. The rim gets more time only when one clue stands out.',
    fall: 'start through the island-side gap, then repeat the edge where bait gets squeezed. Widen only after the rim shows activity.',
    winter: 'start just outside the island gap on the side closest to deeper or calmer water. Work the rim before the center lane.',
  },
  'neck+dam': {
    spring: 'start where the hard edge tightens the narrow route, then check the side leading toward protected water. Warmth or cover makes it stronger.',
    summer: 'start on shaded wall contact beside the narrow route. Stay only if bait, wind, or cover makes the edge active.',
    fall: 'start where bait can be pinned between the hard edge and narrow route. Repeat the wall-side edge before changing angles.',
    winter: 'start near the wall-side edge closest to deeper or calmer water. Check beside the route before moving through the middle.',
  },
  'saddle+island': {
    spring: 'start where the saddle touches the island rim, then check the protected-side edge. Stay where warmth, cover, or bait makes the connection stronger.',
    summer: 'start on the island rim or saddle side with shade, wind, or quick access to open water. Let that clue choose the pass.',
    fall: 'start across the saddle toward the island rim. Slow down where bait, wind, or a corner concentrates activity.',
    winter: 'start on the island-side edge closest to deeper or calmer water. Work the connection slowly before circling wider.',
  },
  'saddle+dam': {
    spring: 'start where the saddle meets the hard edge, then check the side leading toward protected water. Let warmth, cover, or bait choose the slower pass.',
    summer: 'start on shade or wind along the wall-side edge of the saddle. Widen across the crossing only if bait or cover supports it.',
    fall: 'start at the hard-edge corner, then sweep across the saddle side. Stay with the edge where bait gets pinned.',
    winter: 'start on the wall-side edge closest to deeper or calmer water. Keep the pass tight to hard structure before widening.',
  },
  'island+dam': {
    spring: 'start in the gap between island rim and hard edge, then check the protected side nearby. Let warmth, cover, or bait choose the focus.',
    summer: 'start on shade, wall contact, or the island corner with open-water access. The strongest clue gets the slower pass.',
    fall: 'start where bait can be pinned between the island rim and hard edge. Check the seam before circling the island.',
    winter: 'start near the island-wall corner closest to deeper or calmer water. Use the hard edge before checking the open rim.',
  },
  'point+cove+island': {
    spring: 'start where the point and island frame the protected pocket, then check the calmer inside edge. Stay where warmth, cover, or bait lines up.',
    summer: 'start on the point and island edges closest to open water. Move toward the pocket only if shade, wind, cover, or bait improves there.',
    fall: 'start across the point-island edge, then follow bait toward the pocket only while activity stays clear.',
    winter: 'start on the outside point-island edge closest to deeper or calmer water. Treat the protected pocket side as a careful follow-up.',
  },
  travel_hub: {
    spring: 'start on the route edge leading toward protected water, then check each nearby side. Let warmth, cover, or bait decide where to slow down.',
    summer: 'start on the shaded, wind-hit, or open-water edge beside the route. Work the hub efficiently unless bait or cover builds there.',
    fall: 'start where the routes squeeze bait the hardest. Repeat the side that shows activity before spreading wider.',
    winter: 'start just beside the route on the edge closest to deeper or calmer water. Work slowly before testing the center.',
  },
  island_travel_hub: {
    spring: 'start where the route brushes the island rim, especially on the protected side. Then check the nearest corner or shoulder.',
    summer: 'start on the island-side edge with shade, wind, or open-water access. Let one clear clue decide whether the route deserves more time.',
    fall: 'start along the island-side route where bait can get squeezed against the rim. Repeat that edge before circling wider.',
    winter: 'start on the island shoulder outside the route closest to deeper or calmer water. Work just off the rim before widening.',
  },
  mouth_complex: {
    spring: 'start on the outer edge of the protected pocket, then check the calmer inside side. This works for narrow pockets and broad corners.',
    summer: 'start on the side closest to open water, shade, or visible cover. Give the inside edge more time only when bait or calmer water is present.',
    fall: 'start on the outer pocket edge and follow bait only as far as activity stays clear. Do not assume the whole pocket is active.',
    winter: 'start on the outer edge closest to deeper or calmer water. Move inward only when cover, bait, or protection supports it.',
  },
  island_complex: {
    spring: 'start on the protected island rim, then check the connected shoreline edge. Let warmth, cover, or bait pick the first slow pass.',
    summer: 'start where shade, wind, or open-water access is strongest around the island. Avoid equal time around every rim.',
    fall: 'start on the island-facing edge where bait can move along the rim. Check corners before slowing down on one side.',
    winter: 'start on the island side closest to deeper or calmer water. Treat the connected edge as a compact second check.',
  },
  shoreline_complex: {
    spring: 'start where the shaped or hard bank meets a protected side. Let warmth, cover, or bait decide whether to stay.',
    summer: 'start on shade, hard edge, or quick open-water access along the shoreline change. Give the connected bank extra time only if it has cover, bait, shade, or wind.',
    fall: 'start where bait can be pinned against the shoreline change. Slow down on the corner with cover or wind influence.',
    winter: 'start on the hard or protected edge closest to deeper or calmer water. Keep the pass close to the strongest bank change.',
  },
  mixed_confluence: {
    spring: 'start on the side leading toward protected water, then check the nearest strong edge. Let warmth, cover, or bait choose the focus.',
    summer: 'start where shade, wind, cover, or quick open-water access lines up. Choose the clearest clue before expanding.',
    fall: 'start with the edge that can gather bait. Repeat the side that shows activity before exploring the rest.',
    winter: 'start on the side closest to deeper or calmer water. Work beside the intersection instead of covering every piece equally.',
  },
};

function confluenceBody(
  season: WaterReaderSeason,
  zones: WaterReaderPlacedZone[] = [],
  seed = '',
  cadenceContext?: LegendCadenceContext,
): string {
  const key = confluenceTemplateKey(zones);
  const body = CONFLUENCE_BODIES[key]?.[season] ?? CONFLUENCE_BODIES.mixed_confluence[season];
  return sentenceCase(pickBodyVariant(
    `${seed}|${season}|${key}|${zones.map((zone) => zone.zoneId).sort().join('|')}`,
    confluenceBodyVariants(key, season, body),
    cadenceContext,
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
      'start on the pocket side closest to open water, then check the connected structure. Treat broad pockets as edges, not perfect narrow shapes.',
      `use this overlap to decide whether the protected side or connected structure deserves more time. ${seasonalConfluenceFocus(season)}`,
      'check the protected pocket first, then leave quickly unless the connected edge adds bait, shade, wind, or cover.',
      'make one pass on the pocket edge and one on the connected structure. Repeat the side with the clearest fishing clue.',
    ]);
  }
  if (key === 'island_complex' || key === 'island_travel_hub' || featureSet.has('island')) {
    return uniqueStrings([
      baseBody,
      'start on the island rim, then check the connected edge or shoulder. Let one rim section earn time before circling wider.',
      `use this overlap as an island-edge check beside connected structure. ${seasonalConfluenceFocus(season)}`,
      'check the strongest rim first, then leave the wider complex unless bait, shade, wind, or cover keeps pointing there.',
      'make one pass along the island edge, then shift to the connected structure only if the clues line up.',
    ]);
  }
  if (key === 'travel_hub' || featureSet.has('neck') || featureSet.has('saddle')) {
    return uniqueStrings([
      baseBody,
      'start on the travel edge, then check both nearby sides. Work the edges before treating the center lane as the target.',
      `use this overlap as a route-and-edge check. ${seasonalConfluenceFocus(season)}`,
      'check the tightest edge first, then leave quickly unless bait, wind, cover, or shade gives the route a reason to matter.',
      'make one pass on each shoulder, then repeat the side where bait has less room to turn.',
    ]);
  }
  if (key === 'shoreline_complex' || featureSet.has('dam')) {
    return uniqueStrings([
      baseBody,
      'start on the hard edge or shoreline change, then check the connected structure. The corner is the first check, not the whole plan.',
      `use this overlap to choose between hard edge, softer shoreline, and nearby structure. ${seasonalConfluenceFocus(season)}`,
      'check the hard corner first, then leave quickly unless shade, bait, wind, or cover makes the connected water worth time.',
      'make one tight pass along the hard edge, then shift only if the nearby structure gives a clearer clue.',
    ]);
  }
  return uniqueStrings([
    baseBody,
    'start on the strongest nearby edge inside the overlap. Keep the read tight until one side shows more activity.',
    `use this overlap to organize the first pass across nearby structure. ${seasonalConfluenceFocus(season)}`,
    'check the cleanest edge first, then leave quickly unless bait, shade, wind, or cover points to the rest of the overlap.',
    'make one pass on each side, then repeat the edge with the clearest reason to slow down.',
  ]);
}

function seasonalConfluenceFocus(season: WaterReaderSeason): string {
  switch (season) {
    case 'spring':
      return 'Give more time to warmth, cover, bait, or the side leading toward protected water.';
    case 'summer':
      return 'Give more time to shade, wind, cover, or quick access to open water.';
    case 'fall':
      return 'Give more time to the side that gathers bait or wind.';
    case 'winter':
      return 'Give more time to the side closest to deeper or calmer water.';
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
    return zone.anchorSemanticId === 'island_mainland_recovery' ? 'Island Shore-Facing Recovery' : 'Island Shoreline Recovery';
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
      return 'Secondary Point Protected Side';
    case 'secondary_point_mouth':
      return 'Secondary Point Open-Water Side';
    case 'cove_back':
      return 'Cove Inside Edge';
    case 'cove_mouth':
      return 'Cove Open-Water Edge';
    case 'cove_irregular_side':
      return 'Cove Shaped Bank';
    case 'neck_shoulder':
      return 'Neck Shoulder';
    case 'saddle_shoulder':
      return 'Saddle Shoulder';
    case 'island_mainland':
      return 'Island Shore-Facing Edge';
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
    return zone.anchorSemanticId === 'main_point_open_water_area' ? 'Point Open-Water Side' : 'Point Open-Water Recovery';
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
      return 'Secondary Point Protected Side';
    case 'secondary_point_mouth_true':
      return 'Secondary Point Open-Water Side';
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
      return 'Cove Inside Edge';
    case 'cove_back_pocket_recovery':
    case 'cove_back_pocket_recovery_left':
    case 'cove_back_pocket_recovery_right':
      return 'Cove Protected Pocket';
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
      return 'Cove Open-Water Edge';
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

function pickBodyVariant(
  seed: string,
  variants: string[],
  cadenceContext?: LegendCadenceContext,
): string {
  const options = uniqueStrings(variants);
  if (options.length <= 1) return options[0] ?? '';
  if (cadenceContext && cadenceContext.occurrenceCount > 1) {
    return options[cadenceVariantOffset(cadenceContext.profile) % options.length]!;
  }
  return options[hashString(seed) % options.length]!;
}

function cadenceVariantOffset(profile: LegendCadenceProfile): number {
  switch (profile) {
    case 'primary':
    case 'start_then_check':
      return 0;
    case 'quick_checkpoint':
      return 1;
    case 'treat_as_option':
      return 2;
    case 'leave_unless':
      return 3;
    case 'one_pass_then_shift':
      return 4;
  }
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
