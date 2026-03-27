import type {
  RecommenderResponse,
  WaterClarity,
} from "../../../supabase/functions/_shared/recommenderEngine/contracts.ts";

export type AuditSeverity = "blocker" | "major" | "minor" | "info";

export type AuditFlag = {
  code: string;
  severity: AuditSeverity;
  detail: string;
};

export type RecommenderE2eExpectation = {
  top_depth_in?: string[];
  top_relation_in?: string[];
  top_archetype_in?: string[];
  forbidden_top_archetype_ids?: string[];
  required_style_flags?: string[];
  top_lure_ids_in?: string[];
  top_lure_method_ids_in?: string[];
  top_fly_ids_in?: string[];
  top_fly_method_ids_in?: string[];
  forbidden_top_lure_ids?: string[];
  forbidden_top_fly_ids?: string[];
  activity_in?: string[];
};

export type RecommenderE2eScenario = {
  id: string;
  notes?: string;
  latitude: number;
  longitude: number;
  local_date: string;
  local_timezone: string;
  context: string;
  location_name?: string;
  region_key?: string;
  state_code?: string;
  altitude_ft?: number;
  tide_station_id?: string;
  refinements?: {
    water_clarity?: WaterClarity;
  };
  expectations: RecommenderE2eExpectation;
};

const HEDGE_WORDS = [
  "might",
  "maybe",
  "perhaps",
  "could",
  "possibly",
  "should try",
];

const FAST_PRESENTATION_WORDS = [
  "burn",
  "rip",
  "ripping",
  "fast",
  "aggressive",
  "hard snap",
  "cover water fast",
  "power fish",
];

const NUMERIC_WATER_TEMP_RE =
  /\bwater(?:\s+temp(?:erature)?s?)?\s+(?:of|at|around|near|is|about)\s+\d{1,3}\b/i;
const NUMERIC_WATER_DEGREE_RE = /\b\d{1,3}\s*°?\s*F?\s*(?:degree\s+)?water\b/i;
const SPECIES_TERM_RE =
  /\b(?:striped bass|sea trout|speckled trout|smallmouth|largemouth|bass|trout|redfish|snook|tarpon|steelhead|salmon|striper)\b/i;
const METHOD_STOPWORDS = new Set([
  "keep",
  "just",
  "enough",
  "into",
  "lane",
  "target",
  "right",
  "work",
  "works",
  "with",
  "then",
  "only",
  "when",
  "they",
  "them",
  "through",
  "before",
  "after",
  "still",
  "fish",
  "bait",
  "water",
  "current",
  "light",
  "short",
  "small",
  "clean",
  "steady",
  "slow",
  "medium",
  "surface",
]);

function severityRank(severity: AuditSeverity): number {
  return { blocker: 4, major: 3, minor: 2, info: 1 }[severity];
}

export function worstSeverity(flags: AuditFlag[]): AuditSeverity | null {
  let worst: AuditSeverity | null = null;
  for (const flag of flags) {
    if (!worst || severityRank(flag.severity) > severityRank(worst)) worst = flag.severity;
  }
  return worst;
}

export function e2eAuditPass(flags: AuditFlag[]): boolean {
  return !flags.some((flag) => flag.severity === "blocker" || flag.severity === "major");
}

export function failureModeSummary(flags: AuditFlag[]): string {
  if (flags.length === 0) return "pass";
  const blocker = flags.find((flag) => flag.severity === "blocker");
  if (blocker) return `${blocker.code}: ${blocker.detail}`;
  const major = flags.find((flag) => flag.severity === "major");
  if (major) return `${major.code}: ${major.detail}`;
  return `${flags.length} minor/info flags`;
}

function includesAny(actual: string[], expected: string[] | undefined): boolean {
  if (!expected || expected.length === 0) return true;
  return expected.some((item) => actual.includes(item));
}

function excludesAll(actual: string[], forbidden: string[] | undefined): boolean {
  if (!forbidden || forbidden.length === 0) return true;
  return forbidden.every((item) => !actual.includes(item));
}

function normalizedTokens(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3);
}

function mentionsTopFamily(text: string, response: RecommenderResponse): boolean {
  const haystack = normalizedTokens(text);
  const primary = primaryTrack(response);
  const families = [primary?.display_name].filter((value): value is string => Boolean(value));

  return families.some((family) => {
    const tokens = normalizedTokens(family);
    return tokens.some((token) => haystack.includes(token));
  });
}

function primaryTrack(response: RecommenderResponse) {
  const topLure = response.lure_rankings[0] ?? null;
  const topFly = response.fly_rankings[0] ?? null;
  if (!topFly) return topLure;
  if (!topLure) return topFly;
  return topLure.score >= topFly.score ? topLure : topFly;
}

function backupTrack(response: RecommenderResponse) {
  const primary = primaryTrack(response);
  if (!primary) return null;
  const topLure = response.lure_rankings[0] ?? null;
  const topFly = response.fly_rankings[0] ?? null;
  if (primary.family_id === topLure?.family_id) return topFly;
  return topLure;
}

function anchorTokens(text: string): string[] {
  return normalizedTokens(text).filter((token) => !METHOD_STOPWORDS.has(token));
}

function presentationAnchors(response: RecommenderResponse, ranked?: RecommenderResponse["lure_rankings"][number] | null): string[] {
  if (!ranked) return [];
  return anchorTokens(
    `${ranked.display_name} ${ranked.best_method.setup_label} ${ranked.best_method.presentation_guide.summary}`,
  );
}

function containsHedgeWord(text: string): string | null {
  const lower = text.toLowerCase();
  return HEDGE_WORDS.find((word) => lower.includes(word)) ?? null;
}

function containsFastPresentationWord(text: string): string | null {
  const lower = text.toLowerCase();
  return FAST_PRESENTATION_WORDS.find((word) => lower.includes(word)) ?? null;
}

function containsNumericWaterTemp(text: string): boolean {
  return NUMERIC_WATER_TEMP_RE.test(text) || NUMERIC_WATER_DEGREE_RE.test(text);
}

function containsSpeciesClaim(text: string): string | null {
  return text.match(SPECIES_TERM_RE)?.[0] ?? null;
}

function violatesBroadActionGuide(
  text: string,
  guide: RecommenderResponse["lure_rankings"][number]["best_method"]["presentation_guide"] | undefined,
): string | null {
  if (!guide) return null;
  const lower = text.toLowerCase();

  if (
    guide.action !== "bottom contact" &&
    (/\bhop\b/.test(lower) || /\bdrag\b/.test(lower) || /\bcrawl\b/.test(lower) || lower.includes("bottom contact"))
  ) {
    return "bottom-contact detail leaked into a non-bottom-contact guide";
  }
  if (
    guide.action !== "natural drift" &&
    (lower.includes("dead-drift") || lower.includes("dead drift") || /\bswing\b/.test(lower))
  ) {
    return "drift or swing detail leaked into a non-drift guide";
  }
  if (
    guide.action !== "surface commotion" &&
    (/\bpop\b/.test(lower) || /\bwalk\b/.test(lower))
  ) {
    return "surface-only detail leaked into a non-surface guide";
  }

  return null;
}

export function runRecommenderE2eAuditChecks(input: {
  scenario: RecommenderE2eScenario;
  response: RecommenderResponse;
  polished: RecommenderResponse["polished"];
  requirePolishedCopy?: boolean;
}): AuditFlag[] {
  const { scenario, response, polished, requirePolishedCopy = true } = input;
  const flags: AuditFlag[] = [];
  const expectations = scenario.expectations;
  const depths = response.fish_behavior.position.depth_lanes.slice(0, 3).map((item) => item.id);
  const relations = response.fish_behavior.position.relation_tags.slice(0, 4).map((item) => item.id);
  const archetypes = response.presentation_archetypes.slice(0, 3).map((item) => item.archetype_id);
  const styleFlags = response.fish_behavior.behavior.style_flags;
  const lureIds = response.lure_rankings.slice(0, 3).map((item) => item.family_id);
  const lureMethods = response.lure_rankings.slice(0, 3).map((item) => item.best_method.method_id);
  const flyIds = response.fly_rankings.slice(0, 3).map((item) => item.family_id);
  const flyMethods = response.fly_rankings.slice(0, 3).map((item) => item.best_method.method_id);
  const activity = response.fish_behavior.behavior.activity;

  if (!includesAny(depths, expectations.top_depth_in)) {
    flags.push({
      code: "unexpected_top_depth",
      severity: "major",
      detail: `expected ${JSON.stringify(expectations.top_depth_in)} but saw ${JSON.stringify(depths)}`,
    });
  }
  if (!includesAny(relations, expectations.top_relation_in)) {
    flags.push({
      code: "unexpected_top_relation",
      severity: "major",
      detail: `expected ${JSON.stringify(expectations.top_relation_in)} but saw ${JSON.stringify(relations)}`,
    });
  }
  if (!includesAny(archetypes, expectations.top_archetype_in)) {
    flags.push({
      code: "unexpected_top_archetype",
      severity: "major",
      detail: `expected ${JSON.stringify(expectations.top_archetype_in)} but saw ${JSON.stringify(archetypes)}`,
    });
  }
  if (!excludesAll(archetypes, expectations.forbidden_top_archetype_ids)) {
    flags.push({
      code: "forbidden_top_archetype",
      severity: "major",
      detail: `forbidden ${JSON.stringify(expectations.forbidden_top_archetype_ids)} but saw ${JSON.stringify(archetypes)}`,
    });
  }
  if (!includesAny(styleFlags, expectations.required_style_flags)) {
    flags.push({
      code: "missing_style_flag",
      severity: "major",
      detail: `expected ${JSON.stringify(expectations.required_style_flags)} but saw ${JSON.stringify(styleFlags)}`,
    });
  }
  if (!includesAny(lureIds, expectations.top_lure_ids_in)) {
    flags.push({
      code: "unexpected_top_lure",
      severity: "major",
      detail: `expected ${JSON.stringify(expectations.top_lure_ids_in)} but saw ${JSON.stringify(lureIds)}`,
    });
  }
  if (!includesAny(lureMethods, expectations.top_lure_method_ids_in)) {
    flags.push({
      code: "unexpected_top_lure_method",
      severity: "major",
      detail: `expected ${JSON.stringify(expectations.top_lure_method_ids_in)} but saw ${JSON.stringify(lureMethods)}`,
    });
  }
  if (!excludesAll(lureIds, expectations.forbidden_top_lure_ids)) {
    flags.push({
      code: "forbidden_top_lure",
      severity: "major",
      detail: `forbidden ${JSON.stringify(expectations.forbidden_top_lure_ids)} but saw ${JSON.stringify(lureIds)}`,
    });
  }
  if (!includesAny(flyIds, expectations.top_fly_ids_in)) {
    flags.push({
      code: "unexpected_top_fly",
      severity: "major",
      detail: `expected ${JSON.stringify(expectations.top_fly_ids_in)} but saw ${JSON.stringify(flyIds)}`,
    });
  }
  if (!includesAny(flyMethods, expectations.top_fly_method_ids_in)) {
    flags.push({
      code: "unexpected_top_fly_method",
      severity: "major",
      detail: `expected ${JSON.stringify(expectations.top_fly_method_ids_in)} but saw ${JSON.stringify(flyMethods)}`,
    });
  }
  if (!excludesAll(flyIds, expectations.forbidden_top_fly_ids)) {
    flags.push({
      code: "forbidden_top_fly",
      severity: "major",
      detail: `forbidden ${JSON.stringify(expectations.forbidden_top_fly_ids)} but saw ${JSON.stringify(flyIds)}`,
    });
  }
  if (!includesAny([activity], expectations.activity_in)) {
    flags.push({
      code: "unexpected_activity",
      severity: "major",
      detail: `expected ${JSON.stringify(expectations.activity_in)} but saw ${JSON.stringify(activity)}`,
    });
  }

  if (!polished) {
    if (requirePolishedCopy) {
      flags.push({
        code: "missing_polished_copy",
        severity: "blocker",
        detail: "LLM polish returned null",
      });
    }
    return flags;
  }

  const fields = [
    ["headline", polished.headline],
    ["where_insight", polished.where_insight],
    ["behavior_read", polished.behavior_read],
    ["presentation_tip", polished.presentation_tip],
  ] as const;

  for (const [field, text] of fields) {
    if (!text.trim()) {
      flags.push({
        code: "empty_polished_field",
        severity: "major",
        detail: field,
      });
    }
    if (containsNumericWaterTemp(text)) {
      flags.push({
        code: "numeric_water_temperature",
        severity: "blocker",
        detail: field,
      });
    }
    const species = containsSpeciesClaim(text);
    if (species) {
      flags.push({
        code: "species_specific_claim",
        severity: "major",
        detail: `${field}:${species}`,
      });
    }
    const hedge = containsHedgeWord(text);
    if (hedge) {
      flags.push({
        code: "hedge_language",
        severity: "minor",
        detail: `${field}:${hedge}`,
      });
    }
  }

  if (!mentionsTopFamily(polished.headline, response)) {
    flags.push({
      code: "headline_missing_top_family",
      severity: "minor",
      detail: `headline="${polished.headline}"`,
    });
  }

  const coldOrInactive =
    response.fish_behavior.behavior.activity === "inactive" ||
    response.debug?.baseline_profile_id.includes("winter_hold");
  if (coldOrInactive) {
    const fastWord = containsFastPresentationWord(polished.presentation_tip);
    if (fastWord) {
      flags.push({
        code: "metabolic_contradiction",
        severity: "major",
        detail: fastWord,
      });
    }
  }

  const primary = primaryTrack(response);
  const backup = backupTrack(response);
  const tipTokens = new Set(anchorTokens(polished.presentation_tip));
  const primaryAnchors = presentationAnchors(response, primary);
  const backupAnchors = presentationAnchors(response, backup);
  const hasPrimaryAnchor = primaryAnchors.some((token) => tipTokens.has(token));
  const hasBackupAnchor = backupAnchors.some((token) => tipTokens.has(token));

  if (!hasPrimaryAnchor && hasBackupAnchor) {
    flags.push({
      code: "presentation_method_drift",
      severity: "major",
      detail: `tip="${polished.presentation_tip}" primary=${primary?.best_method.method_id ?? "none"} backup=${backup?.best_method.method_id ?? "none"}`,
    });
  } else if (!hasPrimaryAnchor) {
    flags.push({
      code: "presentation_method_unanchored",
      severity: "minor",
      detail: `tip="${polished.presentation_tip}" primary=${primary?.best_method.method_id ?? "none"}`,
    });
  }

  const broadGuideViolation = violatesBroadActionGuide(polished.presentation_tip, primary?.best_method.presentation_guide);
  if (broadGuideViolation) {
    flags.push({
      code: "presentation_overdetailed_or_wrong_action",
      severity: "major",
      detail: broadGuideViolation,
    });
  }

  const topRiverLure = response.context === "freshwater_river" ? response.lure_rankings[0]?.family_id : null;
  const riverTopThree = response.lure_rankings.slice(0, 3).map((item) => item.family_id);
  if (
    response.context === "freshwater_river" &&
    topRiverLure === "finesse_worm" &&
    !riverTopThree.some((id) => id === "inline_spinner" || id === "compact_spoon")
  ) {
    flags.push({
      code: "river_lure_bias",
      severity: "major",
      detail: `river top lure stack=${JSON.stringify(riverTopThree)}`,
    });
  }

  if (
    (response.context === "coastal" || response.context === "coastal_flats_estuary") &&
    response.debug?.clarity_adjustments.some((note) => note.toLowerCase().includes("dirty")) &&
    response.lure_rankings[0]?.family_id === "jerkbait"
  ) {
    flags.push({
      code: "dirty_inshore_pausebait_bias",
      severity: "major",
      detail: `dirty-water top lure was jerkbait in ${response.context}`,
    });
  }

  return flags;
}
