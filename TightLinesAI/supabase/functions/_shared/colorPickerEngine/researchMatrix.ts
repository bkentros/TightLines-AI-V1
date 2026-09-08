import { familiarityExclusions } from "./familiarityReview.ts";
import { COLOR_PICKER_TAXONOMY } from "./taxonomy.ts";
import { COLOR_PATTERNS } from "./colorPatterns.ts";
import { RESEARCH_BINDINGS } from "./researchBindings.ts";
import { RESEARCH_PROFILES } from "./researchProfiles.ts";
import { RESEARCH_SOURCES } from "./researchSources.ts";
import { CELL_KEYS, type Clarity, type LightState, type ReviewedPool } from "./researchSchema.ts";

export const RESEARCH_VERSION = "2026-09-08.3";

export interface PatternDecision {
  typeId: string;
  clarity: Clarity;
  light: LightState;
  patternId: string;
  disposition: "allowed" | "excluded_construction" | "excluded_condition" | "excluded_editorial";
  profileId: string;
  sourceIds: string[];
  basis: "editorial_application_of_cited_guidance";
  reason: string;
}

/** Expands reviewed authoring tables for audit/use by a later engine. No sampling or weather logic. */
export function compileResearchMatrix(): { pools: ReviewedPool[]; decisions: PatternDecision[] } {
  const sourceIds = new Set(RESEARCH_SOURCES.map(source => source.id));
  const patterns = new Map(COLOR_PATTERNS.map(pattern => [pattern.id, pattern]));
  const profiles = new Map(RESEARCH_PROFILES.map(profile => [profile.id, profile]));
  const bindings = new Map(RESEARCH_BINDINGS.map(binding => [binding.typeId, binding]));
  const pools: ReviewedPool[] = [];
  const decisions: PatternDecision[] = [];
  for (const type of COLOR_PICKER_TAXONOMY.baitTypes) {
    const binding = bindings.get(type.id);
    if (!binding) throw new Error(`Missing research binding: ${type.id}`);
    const profile = profiles.get(binding.profileId);
    if (!profile) throw new Error(`Missing research profile: ${binding.profileId}`);
    const compatible = new Set(binding.compatiblePatternIds);
    const excluded = new Set(familiarityExclusions(type.id));
    const candidates = [...new Set([...compatible, ...CELL_KEYS.flatMap(key => profile.cells[key])])];
    for (const id of candidates) if (!patterns.has(id)) throw new Error(`Unknown pattern: ${id}`);
    const references = [...new Set([...binding.sourceIds, ...profile.sourceIds])];
    for (const id of references) if (!sourceIds.has(id)) throw new Error(`Unknown source: ${id}`);
    for (const cell of CELL_KEYS) {
      const [clarity, light] = cell.split("_") as [Clarity, LightState];
      // Explicitly approved existing spoon color, not a generic minimum-size fallback.
      const spoonGold = ["casting_spoon", "weedless_spoon", "trolling_spoon", "jigging_spoon"].includes(type.id) && clarity === "dirty";
      const conditionIds = spoonGold ? [...profile.cells[cell], "metal_gold"] : profile.cells[cell];
      const rationale = spoonGold
        ? "Reviewed Gold/brass, Firetiger and classic patterned spoon options. Gold reflects available light at close range; murk limits flash and pattern visibility. No guaranteed catch advantage or visibility distance."
        : profile.rationale[cell];
      const allowed = conditionIds.filter(id => compatible.has(id) && !excluded.has(id));
      if (new Set(allowed).size !== allowed.length) throw new Error(`Duplicate pool pattern: ${type.id}/${cell}`);
      if (allowed.length < 2) throw new Error(`Insufficient reviewed pool: ${type.id}/${cell}`);
      pools.push({
        typeId: type.id, clarity, light, patternIds: allowed,
        profileId: profile.id, sourceIds: references, rationale,
        reviewStatus: "reviewed_heuristic", evidenceBasis: "editorial_application_of_cited_guidance",
      });
      for (const patternId of candidates) {
        const disposition = !compatible.has(patternId) ? "excluded_construction"
          : excluded.has(patternId) ? "excluded_editorial" : allowed.includes(patternId) ? "allowed" : "excluded_condition";
        decisions.push({
          typeId: type.id, clarity, light, patternId, disposition, profileId: profile.id,
          sourceIds: [...new Set([...references, ...patterns.get(patternId)!.sourceIds])],
          basis: "editorial_application_of_cited_guidance",
          reason: disposition === "allowed" ? rationale
            : disposition === "excluded_editorial" ? "Removed by user-approved bait-specific familiarity review on September 8, 2026; not a claim of physical incompatibility."
            : disposition === "excluded_construction" ? binding.constructionNotes
            : `Outside this reviewed condition allowlist. ${profile.extension} Exclusion is a conservative catalog boundary, not proof this color cannot catch fish.`,
        });
      }
    }
  }
  return { pools, decisions };
}
