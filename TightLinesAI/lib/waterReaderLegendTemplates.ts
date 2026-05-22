/**
 * Seasonal legend body templates for the Water Read map key.
 *
 * Server-supplied `entry.body` text is the source of truth. The local
 * templates below remain as defensive fallback copy for older or partial
 * payloads, and deterministic selection keeps repeated opens stable.
 *
 * The season is shown once in the legend masthead/season badge (and again
 * on the page meta ribbon), so template copy intentionally never names the
 * season — every template assumes "according to the season above".
 */

import type {
  WaterReaderProductionSvgFeatureClass,
} from './waterReaderContracts';

export type LegendSeason = 'spring' | 'summer' | 'fall' | 'winter';

const FALLBACK_SEASON: LegendSeason = 'summer';

/**
 * Normalize whatever the read returns (may include "autumn", capitalized
 * forms, etc.) into one of the four canonical seasons used as keys here.
 */
export function normalizeSeason(season: string | undefined | null): LegendSeason {
  if (!season) return FALLBACK_SEASON;
  const s = season.toLowerCase();
  if (s.startsWith('spr')) return 'spring';
  if (s.startsWith('sum')) return 'summer';
  if (s.startsWith('fal') || s.startsWith('aut')) return 'fall';
  if (s.startsWith('win')) return 'winter';
  return FALLBACK_SEASON;
}

/**
 * Northern-hemisphere meteorological seasons, by calendar:
 *   spring: Mar 1 – May 31
 *   summer: Jun 1 – Aug 31
 *   fall:   Sep 1 – Nov 30
 *   winter: Dec 1 – Feb (28|29)
 */
export function calendarSeasonFor(date: Date): LegendSeason {
  const m = date.getMonth(); // 0..11
  if (m >= 2 && m <= 4) return 'spring';
  if (m >= 5 && m <= 7) return 'summer';
  if (m >= 8 && m <= 10) return 'fall';
  return 'winter';
}

/**
 * Build a season display label that surfaces regional timing.
 *
 * When the read season matches the calendar season for the current date, we
 * show a single season ("SPRING"). When they differ, the region's timing is
 * offset from the calendar — Florida can be on a summer pattern while the
 * calendar still says spring; far-north lakes can lag behind in early
 * spring — and we surface that as "SPRING → SUMMER" without claiming the
 * lake is inside the engine's true transition window.
 *
 * Order in the transition label: earlier season → later season in the
 * cyclical order spring → summer → fall → winter → spring …, regardless
 * of which side the seasonal read landed on. Reads as "the region is moving
 * from X conditions toward Y conditions."
 *
 * `now` is injectable for testing; production callers pass `new Date()`.
 */
export function seasonDisplayLabel(
  readSeason: string | undefined | null,
  now: Date = new Date(),
): { label: string; isTransition: boolean } {
  const read = normalizeSeason(readSeason);
  const calendar = calendarSeasonFor(now);
  if (read === calendar) {
    return { label: read.toUpperCase(), isTransition: false };
  }
  const [from, to] = orderSeasons(calendar, read);
  return {
    label: `${from.toUpperCase()} → ${to.toUpperCase()}`,
    isTransition: true,
  };
}

const SEASON_ORDER: LegendSeason[] = ['spring', 'summer', 'fall', 'winter'];

/**
 * Given two distinct seasons, return them in cyclical order (spring →
 * summer → fall → winter → spring …) for display. We pick the ordering
 * that produces the SHORTER forward step between the two — so we get
 * "WINTER → SPRING" rather than "SPRING → WINTER" (3 steps).
 */
function orderSeasons(
  a: LegendSeason,
  b: LegendSeason,
): [LegendSeason, LegendSeason] {
  if (a === b) return [a, b];
  const ai = SEASON_ORDER.indexOf(a);
  const bi = SEASON_ORDER.indexOf(b);
  const forward = (bi - ai + 4) % 4;
  if (forward <= 2) return [a, b];
  return [b, a];
}

type SeasonTemplates = Record<LegendSeason, string[]>;
type StandaloneFeatureClass = Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>;
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

const LOCAL_STRUCTURE_FEATURE_CLASSES = [
  'main_lake_point',
  'secondary_point',
  'cove',
  'neck',
  'saddle',
  'island',
  'dam',
  'universal',
] as const satisfies readonly StandaloneFeatureClass[];

const CONFLUENCE_TEMPLATE_KEYS = [
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
  'point+cove+island',
  'travel_hub',
  'island_travel_hub',
  'mouth_complex',
  'island_complex',
  'shoreline_complex',
  'mixed_confluence',
] as const satisfies readonly ConfluenceTemplateKey[];

/**
 * Pick fallback guidance deterministically using a hash of `zoneId + season` so the
 * same zone always shows the same body across opens (originality lake-to-
 * lake), without re-randomizing on every render.
 */
export function pickLegendBody(args: {
  featureClass: WaterReaderProductionSvgFeatureClass;
  featureClasses?: Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>[];
  season: string | undefined | null;
  zoneId: string | undefined | null;
  zoneIds?: string[];
  title?: string;
  placementKinds?: string[];
  fallbackBody?: string;
}): string {
  const { season, fallbackBody } = args;
  // Server-side legend bodies are the source of truth for Water Read copy.
  // Keep the local pool compact and plain as a defensive fallback for older
  // or partial read payloads.
  if (fallbackBody?.trim()) return stripLeadingSeasonIntro(fallbackBody, season);
  return localFallbackLegendBody(args) ?? '';
}

function stripLeadingSeasonIntro(text: string, season: string | undefined | null): string {
  const normalized = normalizeSeason(season);
  return text
    .trim()
    .replace(new RegExp(`^in\\s+(?:${normalized}|spring|summer|fall|autumn|winter)\\s*,\\s*`, 'i'), (match) => {
      void match;
      return '';
    })
    .replace(/^./, (char) => char.toUpperCase());
}

function localFallbackLegendBody(args: {
  featureClass: WaterReaderProductionSvgFeatureClass;
  featureClasses?: Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>[];
  season: string | undefined | null;
  zoneId: string | undefined | null;
  zoneIds?: string[];
  title?: string;
  placementKinds?: string[];
}): string | null {
  const season = normalizeSeason(args.season);
  const stableZoneSeed = args.zoneIds?.length ? [...args.zoneIds].sort().join('|') : args.zoneId ?? '';
  if (args.featureClass === 'structure_confluence') {
    const key = confluenceTemplateKey(args);
    return pickFromList(
      `${stableZoneSeed}|${season}|${key}`,
      localConfluenceFallbacks(key, season),
    );
  }

  return pickFromList(
    `${stableZoneSeed}|${season}|${args.featureClass}`,
    localStructureFallbacks(args.featureClass, season),
  );
}

function pickFromList(seed: string, list: string[]): string | null {
  if (!list.length) return null;
  return list[hashString(seed) % list.length];
}

function localStructureFallbacks(
  featureClass: StandaloneFeatureClass,
  season: LegendSeason,
): string[] {
  const focus = localSeasonalFocus(season);
  switch (featureClass) {
    case 'main_lake_point':
      return [
        `Use this point as a quick checkpoint between shoreline and open water. ${focus}`,
        'Treat the tip and two sides as separate targets. Stay on the side where cover, bait, wind, or shade lines up.',
        'Check the open-water side first, then the protected side. Leave quickly if neither side has cover, bait, wind, or shade.',
        'Make one pass across the tip, then shift to the better side. The better side is the one with the clearest fishing clue.',
        'Start broad across the highlighted point, then narrow fast. Do not give every side equal time unless activity follows the edge.',
      ];
    case 'secondary_point':
      return [
        `Use this smaller point as a quick checkpoint between tucked-away water and open water. ${focus}`,
        'Treat the tip as the first test, then choose the better side. Cover, bait, shade, or wind decides where you slow down.',
        'Check the side closest to open water before spending time on the calmer side. Leave quickly if neither side has a clear clue.',
        'Make one clean pass around the tip, then shift only if the edge has cover, bait, shade, or sharper bank shape.',
        'Start tight to the highlighted point instead of fishing the whole pocket. Give small points extra time only when one side clearly stands out.',
      ];
    case 'cove':
      return [
        `Use this cove as a quick checkpoint, not a place to camp. ${focus}`,
        'Treat the highlighted water as a protected pocket or broad corner. Stay longer only where cover, bait, shade, or calmer water lines up.',
        'Check the side closest to open water first, then the calmer inside edge. Leave quickly if neither side has cover, bait, shade, or wind.',
        'Make one pass along the shaped bank, then shift only if bait, cover, shade, or a sharper turn gives you a reason.',
        'Start with the clearest edge in the highlighted water. Let the strongest cove clue decide whether you work inward or move on.',
      ];
    case 'neck':
      return [
        `Use this narrow opening as a quick checkpoint between two water areas. ${focus}`,
        'Treat the two edges as the main targets. Stay on the side where bait, cover, wind, or shade makes the pinch stronger.',
        'Check both edges before casting through the middle. Leave quickly if the opening has no bait, cover, wind, or shade.',
        'Make one pass along each edge, then shift to the side where bait has less room to escape.',
        'Start beside the narrowest water, not in the center. Give the slower pass to the edge with the clearest clue.',
      ];
    case 'saddle':
      return [
        `Use this crossing as a quick checkpoint between nearby edges. ${focus}`,
        'Treat the two sides as separate targets. Stay on the side where bait, wind, shade, or cover makes the crossing stronger.',
        'Check the edges before working the middle. Leave quickly if neither side shows bait, cover, wind, or calmer water.',
        'Make one pass across the crossing, then shift to the edge that gives fish the easiest reason to stop.',
        'Start on the cleanest edge of the saddle. The middle is only worth more time if activity pulls you across it.',
      ];
    case 'island':
      return [
        `Use this island edge as a quick checkpoint before circling wider. ${focus}`,
        'Treat the nearest corner and rim as separate targets. Stay on the side with bait, wind, shade, cover, or quick open-water access.',
        'Check one strong rim before working the whole island. Leave quickly if the edge has no cover, bait, wind, or shade.',
        'Make one pass along the highlighted rim, then shift only if a corner or side gives you a better clue.',
        'Start where the island edge changes direction. Give the full perimeter time only when bait, wind, shade, or visible cover follows it.',
      ];
    case 'dam':
      return [
        `Use this hard edge as a quick checkpoint before running the whole face. ${focus}`,
        'Treat the corner and straight face as separate targets. Stay where bait, shade, wind, warmer rock, or cover makes the edge stand out.',
        'Check the corner first, then the straight face. Leave quickly if the hard edge has no bait, shade, wind, or cover.',
        'Make one pass tight to rock or wall, then shift only if the edge shows bait, shade, wind, or a clean transition.',
        'Start where hard structure changes angle or meets softer shoreline. Let that change decide whether the dam gets more time.',
      ];
    case 'universal':
      return [
        `Use this simple shoreline as a quick checkpoint. ${focus}`,
        'Treat the highlighted bank as a starting edge, then let cover, shade, bait, or a sharper turn decide where to slow down.',
        'Check the cleanest visible edge first. Leave quickly if there is no cover, shade, bait, wind, or bank change.',
        'Make one pass along the highlighted shoreline, then shift only if another edge gives a clearer reason.',
        'Start simple and look for one useful clue. On plain water, let cover, shade, bait, or bank shape choose the spot.',
      ];
  }
}

function localSeasonalFocus(season: LegendSeason): string {
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

function localConfluenceFallbacks(key: ConfluenceTemplateKey, season: LegendSeason): string[] {
  const focus = localSeasonalConfluenceFocus(season);
  if (key === 'mouth_complex' || key.includes('cove')) {
    return [
      'Start on the pocket side closest to open water, then check the connected structure. Treat broad pockets as edges, not perfect narrow shapes.',
      `Use this overlap to decide whether the protected side or connected structure deserves more time. ${focus}`,
      'Make one quick pass on the protected side, then one on the connected edge. Stay only where bait, shade, wind, or cover lines up.',
    ];
  }
  if (key === 'island_complex' || key === 'island_travel_hub' || key.includes('island')) {
    return [
      'Start on the island rim, then check the connected edge or shoulder. Let one rim section earn time before circling wider.',
      `Use this overlap as an island-edge check beside connected structure. ${focus}`,
      'Make one pass along the strongest rim, then shift to the connected edge if bait, shade, wind, or cover supports it.',
    ];
  }
  if (key === 'travel_hub' || key.includes('neck') || key.includes('saddle')) {
    return [
      'Start on the travel edge, then check both nearby sides. Work the edges before treating the center lane as the target.',
      `Use this overlap as a route-and-edge check. ${focus}`,
      'Make one pass on each shoulder, then repeat the side where bait, wind, cover, or shade gives fish a reason to stop.',
    ];
  }
  if (key === 'shoreline_complex' || key.includes('dam')) {
    return [
      'Start on the hard edge or shoreline change, then check the connected structure. The corner is the first check, not the whole plan.',
      `Use this overlap to choose between hard edge, softer shoreline, and nearby structure. ${focus}`,
      'Make one tight pass along the hard edge, then shift only if bait, shade, wind, or cover points to the connected water.',
    ];
  }
  return [
    'Start on the strongest nearby edge inside the overlap. Keep the read tight until one side shows more activity.',
    `Use this overlap to organize the first pass across nearby structure. ${focus}`,
    'Make one clean pass on each side, then repeat the edge with the clearest bait, shade, wind, cover, or bank-shape clue.',
  ];
}

function localSeasonalConfluenceFocus(season: LegendSeason): string {
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

function confluenceTemplateKey(args: {
  featureClasses?: Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>[];
  title?: string;
  placementKinds?: string[];
}): ConfluenceTemplateKey {
  const features = confluenceFeatureSet(args.featureClasses, args.title, args.placementKinds);
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

function confluenceFeatureSet(
  featureClasses?: Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>[],
  title?: string,
  placementKinds?: string[],
): PublicConfluenceFeature[] {
  const labels = new Set<PublicConfluenceFeature>();
  for (const feature of featureClasses ?? []) {
    labels.add(publicConfluenceFeature(feature));
  }
  if (labels.size < 2) {
    const text = `${title ?? ''} ${(placementKinds ?? []).join(' ')}`.toLowerCase();
    if (/\bpoint\b/.test(text)) labels.add('point');
    if (/\bcove\b/.test(text)) labels.add('cove');
    if (/\bneck\b|\bpinch\b/.test(text)) labels.add('neck');
    if (/\bsaddle\b/.test(text)) labels.add('saddle');
    if (/\bisland\b/.test(text)) labels.add('island');
    if (/\bdam\b|\briprap\b|\bwall\b/.test(text)) labels.add('dam');
  }
  return CONFLUENCE_ORDER.filter((feature) => labels.has(feature) && feature !== 'universal');
}

function publicConfluenceFeature(feature: Exclude<WaterReaderProductionSvgFeatureClass, 'structure_confluence'>): PublicConfluenceFeature {
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
    default:
      return 'universal';
  }
}

const FORBIDDEN_COPY_PATTERNS: Array<{ pattern: RegExp; reason: string }> = [
  { pattern: /\bengine\b/i, reason: 'internal engine wording' },
  { pattern: /\balgorithm\b/i, reason: 'internal algorithm wording' },
  { pattern: /\bdetected\b/i, reason: 'internal detection wording' },
  { pattern: /\bpolygon\b/i, reason: 'internal polygon wording' },
  { pattern: /\bcandidate\b/i, reason: 'internal candidate wording' },
  { pattern: /\bconfidence\b|\bscore\b/i, reason: 'internal scoring wording' },
  { pattern: /\belectronics?\b|\bgraph\b|\bsonar\b/i, reason: 'unsupported electronics wording' },
  { pattern: /\b(?:spring|summer|fall|winter)\b/i, reason: 'repeated season wording' },
  { pattern: /\bbest\b/i, reason: 'overconfident ranking wording' },
  { pattern: /\bmouth\b|\bentrance\b|\bthroat\b/i, reason: 'literal cove-opening wording' },
  { pattern: /\bopening-facing\b|\bstable-looking\b|\bbroad-water\b/i, reason: 'unclear legacy wording' },
  { pattern: /\b\d+\s*(?:-|to)\s*\d+\s*(?:ft|feet)\b/i, reason: 'exact depth range' },
  { pattern: /\b\d+\s*(?:ft|feet)\b/i, reason: 'exact depth' },
  { pattern: /\b\d+\s*(?:sec|second|seconds)\b/i, reason: 'exact pause timing' },
];

export function waterReaderLegendTemplateQualityReport(): {
  ok: boolean;
  checked: number;
  issues: Array<{ key: string; season: LegendSeason; text: string; reason: string }>;
} {
  const issues: Array<{ key: string; season: LegendSeason; text: string; reason: string }> = [];
  let checked = 0;
  const allBuckets = expandedTemplateBuckets();

  for (const [key, seasons] of Object.entries(allBuckets)) {
    for (const season of SEASON_ORDER) {
      for (const text of seasons[season] ?? []) {
        checked += 1;
        const sentenceCount = text.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean).length;
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        if (sentenceCount > 2) {
          issues.push({ key, season, text, reason: 'more than two sentences' });
        }
        if (wordCount > 38) {
          issues.push({ key, season, text, reason: `too long: ${wordCount} words` });
        }
        for (const { pattern, reason } of FORBIDDEN_COPY_PATTERNS) {
          if (pattern.test(text)) issues.push({ key, season, text, reason });
        }
      }
    }
  }

  return { ok: issues.length === 0, checked, issues };
}

function expandedTemplateBuckets(): Record<string, SeasonTemplates> {
  const out: Record<string, SeasonTemplates> = {};
  for (const feature of LOCAL_STRUCTURE_FEATURE_CLASSES) {
    out[feature] = {
      spring: localStructureFallbacks(feature, 'spring'),
      summer: localStructureFallbacks(feature, 'summer'),
      fall: localStructureFallbacks(feature, 'fall'),
      winter: localStructureFallbacks(feature, 'winter'),
    };
  }
  for (const key of CONFLUENCE_TEMPLATE_KEYS) {
    out[key] = {
      spring: localConfluenceFallbacks(key, 'spring'),
      summer: localConfluenceFallbacks(key, 'summer'),
      fall: localConfluenceFallbacks(key, 'fall'),
      winter: localConfluenceFallbacks(key, 'winter'),
    };
  }
  return out;
}

/**
 * Tiny string hash (djb2 variant) — fast, dependency-free, gives a stable
 * unsigned integer for the deterministic template pick.
 */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}
