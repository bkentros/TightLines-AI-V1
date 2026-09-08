import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { COLOR_PICKER_TAXONOMY as taxonomy } from "../supabase/functions/_shared/colorPickerEngine/taxonomy.ts";
import { COLOR_PATTERNS } from "../supabase/functions/_shared/colorPickerEngine/colorPatterns.ts";
import { RESEARCH_PROFILES } from "../supabase/functions/_shared/colorPickerEngine/researchProfiles.ts";
import { RESEARCH_BINDINGS } from "../supabase/functions/_shared/colorPickerEngine/researchBindings.ts";
import { RESEARCH_SOURCES } from "../supabase/functions/_shared/colorPickerEngine/researchSources.ts";
import { compileResearchMatrix, RESEARCH_VERSION } from "../supabase/functions/_shared/colorPickerEngine/researchMatrix.ts";
import { CELL_KEYS } from "../supabase/functions/_shared/colorPickerEngine/researchSchema.ts";
import { NARROW_POOL_REVIEW } from "../supabase/functions/_shared/colorPickerEngine/narrowPoolReview.ts";
import {
  VISUAL_CURATION_TYPE_IDS,
  VISUAL_FAMILIES,
} from "../supabase/functions/_shared/colorPickerEngine/visualCuration.ts";

const unique = (ids: string[], label: string) => assert.equal(new Set(ids).size, ids.length, `Duplicate ${label}`);
for (const [name, list] of [
  ["pattern", COLOR_PATTERNS], ["profile", RESEARCH_PROFILES], ["source", RESEARCH_SOURCES],
] as const) unique(list.map(x => x.id), name);
unique(RESEARCH_BINDINGS.map(x => x.typeId), "binding");
const patterns = new Map(COLOR_PATTERNS.map(x => [x.id, x]));
const profiles = new Map(RESEARCH_PROFILES.map(x => [x.id, x]));
const sources = new Map(RESEARCH_SOURCES.map(x => [x.id, x]));
const types = new Map(taxonomy.baitTypes.map(x => [x.id, x]));
const checkSources = (ids: string[]) => {
  assert(ids.length > 0, "Missing provenance");
  unique(ids, "source reference");
  for (const id of ids) assert(sources.has(id), `Unknown source ${id}`);
};
for (const source of RESEARCH_SOURCES) {
  assert.equal(new URL(source.url).protocol, "https:");
  assert(source.supports && source.limitations && source.accessedOn && source.consultedVia);
}
for (const pattern of COLOR_PATTERNS) {
  checkSources(pattern.sourceIds);
  assert(pattern.visualDescription && Object.keys(pattern.components).length && pattern.swatches.length);
  assert(pattern.swatches.every(x => /^#[0-9A-Fa-f]{6}$/.test(x)), `Invalid swatch ${pattern.id}`);
  unique(pattern.aliases.map(x => x.toLowerCase()), `alias ${pattern.id}`);
  assert(!/glow|ultraviolet/i.test(pattern.visualDescription), "Unsupported optical-performance claim");
}
for (const profile of RESEARCH_PROFILES) {
  checkSources(profile.sourceIds);
  assert(profile.sourceIds.some(id => sources.get(id)!.kind !== "product_catalog"), `Product-only rule ${profile.id}`);
  assert(profile.principle && profile.extension);
  assert.deepEqual(Object.keys(profile.cells).sort(), [...CELL_KEYS].sort());
  for (const cell of CELL_KEYS) {
    unique(profile.cells[cell], `profile pattern ${profile.id}/${cell}`);
    assert(profile.rationale[cell]);
    for (const id of profile.cells[cell]) assert(patterns.has(id), `Unknown ${id}`);
  }
  if (profile.lightPolicy === "retain_without_supported_exclusion") {
    for (const clarity of ["clear", "stained", "dirty"] as const) {
      assert.deepEqual(profile.cells[`${clarity}_sunny`], profile.cells[`${clarity}_cloudy`], `Unjustified sky split ${profile.id}`);
    }
  }
}
assert.equal(RESEARCH_BINDINGS.length, types.size);
for (const binding of RESEARCH_BINDINGS) {
  assert(types.has(binding.typeId) && profiles.has(binding.profileId));
  assert(binding.constructionNotes);
  unique(binding.compatiblePatternIds, `compatibility ${binding.typeId}`);
  checkSources(binding.sourceIds);
  for (const id of binding.compatiblePatternIds) assert(patterns.has(id), `Unknown compatible pattern ${id}`);
}
const { pools, decisions } = compileResearchMatrix();
assert.equal(pools.length, types.size * 6);
unique(pools.map(x => `${x.typeId}/${x.clarity}/${x.light}`), "pool");
unique(decisions.map(x => `${x.typeId}/${x.clarity}/${x.light}/${x.patternId}`), "decision");
const pool = (type: string, cell: string) => pools.find(x => x.typeId === type && `${x.clarity}_${x.light}` === cell)!;
for (const row of pools) {
  assert(row.patternIds.length >= 2);
  assert.equal(row.evidenceBasis, "editorial_application_of_cited_guidance");
  for (const id of row.patternIds) {
    const pattern = patterns.get(id)!;
    const category = taxonomy.categories.find(x => x.id === types.get(row.typeId)!.categoryId)!;
    assert.equal(pattern.material.startsWith("fly_"), category.gearMode === "fly", `Material/gear mismatch ${row.typeId}/${id}`);
    assert(decisions.some(x => x.typeId === row.typeId && x.clarity === row.clarity && x.light === row.light && x.patternId === id && x.disposition === "allowed"));
  }
}
for (const row of decisions) checkSources(row.sourceIds);
// Credibility regressions: do not reintroduce retired variants to satisfy minimum counts.
for (const id of ["spinner_white_white", "bladed_white_white", "underspin_white", "tailspin_white", "frog_white_chartreuse", "toad_white_chartreuse", "spinner_green_pumpkin"]) {
  assert(!patterns.has(id), `Retired credibility recipe ${id}`);
}
for (const row of pools) {
  unique(row.patternIds.map(id => patterns.get(id)!.name.toLowerCase()), `visible color name in ${row.typeId}/${row.clarity}/${row.light}`);
}
for (const pattern of COLOR_PATTERNS.filter(x => /^(spinner|bladed|underspin|tailspin|buzz)_/.test(x.id))) {
  assert(!("blade" in pattern.components), `Incidental hardware leaked into color recipe ${pattern.id}`);
  assert(pattern.illustrationHardware?.blade, `Missing hardware drawing reference ${pattern.id}`);
  assert(!/blade/i.test(pattern.name), `Hardware variant presented as color ${pattern.id}`);
}


// Domain guardrails: these catch accidental broadening that a count-only audit cannot.
for (const key of CELL_KEYS) {
  assert(pool("fly_popper", key).patternIds.every(x => x.startsWith("popper_")));
  assert(pool("hard_popper", key).patternIds.every(x => x.startsWith("hard_")));
  assert(pool("crawfish_streamer", key).patternIds.every(x => ["fly_brown", "fly_olive", "fly_black", "craw_black_purple", "craw_brown_orange", "craw_tan_orange"].includes(x)));
  assert(pool("flash_streamer", key).patternIds.every(x => patterns.get(x)!.material === "fly_flash"));
  assert(!pool("glidebait", key).patternIds.some(x => x.includes("craw") || x === "hard_ghost"));
  assert(!pool("hard_jerkbait", key).patternIds.some(x => x.includes("craw")));
  assert(!pool("hollow_frog", key).patternIds.includes("frog_brown"), "No cosmetic padding of frog bellies");
  assert(!pool("hard_popper", key).patternIds.includes("hard_pearl"), "Bone and pearl must not pad the surface pool");
}
assert(pool("stick_worm", "dirty_cloudy").patternIds.includes("plastic_black_blue"));
assert(!pool("stick_worm", "dirty_sunny").patternIds.includes("plastic_watermelon_seed"));
assert(pool("lipless_crankbait", "clear_cloudy").patternIds.includes("hard_silver_blue"), "Cloud does not disable chrome");
assert(pool("fly_popper", "clear_sunny").patternIds.includes("popper_yellow"), "Clear-water poppers need not be earth tones");
assert.equal(patterns.get("plastic_black_blue")!.components.flake, "blue");
assert.equal(patterns.get("jig_black_blue")!.material, "skirt_and_plastic");
assert(pool("stick_worm", "dirty_cloudy").patternIds.length >= 2, "Curated worm pool must support two distinct picks");
assert(pool("crawfish_streamer", "dirty_cloudy").patternIds.includes("craw_black_purple"));
assert(patterns.get("plastic_junebug")!.components.flake.includes("emerald"));
assert(!patterns.get("plastic_junebug")!.components.body.includes("green"), "Junebug base must be purple");
assert(patterns.get("plastic_pbj")!.components.body.includes("brown") && patterns.get("plastic_pbj")!.components.body.includes("purple"));
assert.equal(patterns.get("hard_firetiger")!.components.belly, "orange");
assert(patterns.get("hard_firetiger")!.components.body.includes("black tiger bars"));
for (const key of CELL_KEYS) {
  assert(!pool("stick_worm", key).patternIds.includes("plastic_pbj"), "Minor worm variants must not dilute the primary pool");
  assert(pool("football_jig", key).patternIds.includes("jig_pbj"));
  assert(pool("sculpin_streamer", key).patternIds.includes("sculpin_black_white"));
}

// Release-facing curation guardrails: all options are equal-probability, so a
// pool must not be padded with two names for the same visual strategy.
for (const typeId of VISUAL_CURATION_TYPE_IDS) {
  const binding = RESEARCH_BINDINGS.find(row => row.typeId === typeId)!;
  assert(binding.profileId.startsWith("visual_20260908_"), `Missing visual curation profile for ${typeId}`);
  for (const key of CELL_KEYS) {
    const row = pool(typeId, key);
    assert(row.patternIds.length >= 3 && row.patternIds.length <= 6, `Unfocused visual pool ${typeId}/${key}`);
    const families = row.patternIds.map(id => VISUAL_FAMILIES[id]);
    assert(families.every(Boolean), `Missing visual family ${typeId}/${key}`);
    unique(families, `visual family ${typeId}/${key}`);
  }
}
assert.deepEqual(pool("curly_tail_grub", "clear_sunny").patternIds, [
  "plastic_pearl", "plastic_smoke_silver", "plastic_pumpkinseed", "plastic_black",
]);
assert(!pool("paddle_tail_swimbait", "dirty_cloudy").patternIds.includes("plastic_olive_pearl"));
assert(!pool("paddle_tail_swimbait", "dirty_cloudy").patternIds.includes("plastic_junebug"));
assert(pool("soft_craw", "stained_sunny").patternIds.includes("plastic_brown_orange_tail"));
assert(pool("structure_jig", "clear_sunny").patternIds.includes("jig_white"));
assert(pool("structure_jig", "dirty_cloudy").patternIds.includes("jig_black"));
assert(pool("bladed_jig", "dirty_cloudy").patternIds.includes("bladed_fire_craw"));
assert(!pool("underspin", "dirty_cloudy").patternIds.includes("underspin_junebug"));


// Malformed authoring data must fail closed instead of silently topping up a pool.
const firstBinding = RESEARCH_BINDINGS[0];
const originalCompatible = firstBinding.compatiblePatternIds;
try {
  firstBinding.compatiblePatternIds = originalCompatible.slice(0, 2);
  assert.throws(() => compileResearchMatrix(), /Insufficient reviewed pool/);
} finally {
  firstBinding.compatiblePatternIds = originalCompatible;
}
const firstProfile = profiles.get(firstBinding.profileId)!;
const originalCell = firstProfile.cells.clear_sunny;
try {
  firstProfile.cells.clear_sunny = [...originalCell, originalCell[0]];
  assert.throws(() => compileResearchMatrix(), /Duplicate pool pattern/);
  firstProfile.cells.clear_sunny = [...originalCell, "nonexistent_pattern"];
  assert.throws(() => compileResearchMatrix(), /Unknown pattern/);
} finally {
  firstProfile.cells.clear_sunny = originalCell;
}
const originalSources = firstBinding.sourceIds;
try {
  firstBinding.sourceIds = ["nonexistent_source"];
  assert.throws(() => compileResearchMatrix(), /Unknown source/);
} finally {
  firstBinding.sourceIds = originalSources;
}

const used = new Set(pools.flatMap(x => x.patternIds));
const pairKeys = [...new Set(pools.flatMap(x => x.patternIds.map(id => `${x.typeId}/${id}`)))];
const previewManifest = pairKeys.map(key => {
  const [typeId, patternId] = key.split("/");
  const pattern = patterns.get(patternId)!;
  let components = { ...pattern.components };
  let visualDescription = pattern.visualDescription;
  if (typeId === "crawfish_streamer" && patternId.startsWith("fly_")) {
    components = { body: pattern.components.body, claws: pattern.components.body, legs: pattern.components.body, head: pattern.components.body };
    visualDescription = `Tied crawfish fly with ${pattern.components.body} body, paired claws and legs. No baitfish wing, minnow tail or plastic glitter.`;
  }
  if (["woolly_bugger", "leech_streamer"].includes(typeId)) {
    components = { body: pattern.components.body, tail: pattern.components.tail, head: pattern.components.head };
    visualDescription = `${pattern.components.body} fiber body and ${pattern.components.tail} tail. ${typeId === "woolly_bugger" ? "Matching palmered hackle and marabou tail." : "Flowing fur or marabou leech silhouette."} No separate baitfish wing or painted scales.`;
  }
  if (typeId === "sculpin_streamer" && patternId.startsWith("fly_")) {
    components = { head: pattern.components.head, upperBody: pattern.components.wing, lowerBody: pattern.components.body, tail: pattern.components.tail };
    visualDescription = `Tied sculpin with broad ${components.head} fiber head, ${components.upperBody} upper fibers, ${components.lowerBody} lower body and ${components.tail} flowing tail. Preserve sculpin anatomy; no painted scales or separate minnow wing.`;
  }
  return {
    id: `${typeId}__${patternId}`, typeId, patternId,
    targetPath: `assets/images/color-picker/patterns/${typeId}/${patternId}.png`,
    status: "generation_pending",
    typeReferenceImageId: types.get(typeId)!.imageId,
    visualDescription,
    components,
    illustrationHardware: pattern.illustrationHardware ?? {},
    material: patterns.get(patternId)!.material,
    opacity: patterns.get(patternId)!.opacity,
    finish: patterns.get(patternId)!.finish,
    flash: patterns.get(patternId)!.flash,
    swatches: patterns.get(patternId)!.swatches,
    referenceSourceUrls: patterns.get(patternId)!.sourceIds.map(id => sources.get(id)!.url),
    generationBrief: [
      `Depict ${types.get(typeId)!.label}: ${types.get(typeId)!.description}`,
      `Color recipe: ${visualDescription}`,
      `Component assignments: ${JSON.stringify(components)}.`,
      `Incidental hardware: ${JSON.stringify(pattern.illustrationHardware ?? {})}. Hardware listed here completes the illustration; it is not an additional color recommendation or condition-dependent requirement.`,
      `Material ${patterns.get(patternId)!.material}; opacity ${patterns.get(patternId)!.opacity}; finish ${patterns.get(patternId)!.finish}; flash ${patterns.get(patternId)!.flash}.`,
      "Color names are labels, not instructions to invent a palette. Follow the explicit recipe and reviewed reference. Neutral daylight and white balance; no colored environmental light. Glitter must appear as separate embedded flakes, not an overall color cast. Metallic finish must reflect; gray paint is not silver metal.",
      "Preserve the selected bait anatomy. Fiber streamers use fibers, not plastic glitter. Crawfish flies have claws and legs, never a baitfish wing; Bugger/leeches use body and tail with no invented wing. Interpret generic upper/lower fiber colors on the selected construction. For belly patterns show a three-quarter underside view.",
      "Display the complete bait on transparent background with unclipped hook/tail. Render no text, water, packaging or logo. Color swatches are approximate human references; compare against the approved reference before final acceptance.",
    ].join(" "),
    acceptanceChecks: [
      "Base hue matches recipe and named reference in neutral light.",
      "Back/belly/tip boundaries and every required flake color match.",
      "Opacity and material finish remain distinguishable at card size.",
      "Bait anatomy and component placement match selected type.",
      "No unrequested glitter, color accent, or colored lighting; incidental hardware follows its separate illustration reference.",
      "Reject and regenerate mismatches; a successful generation call is not visual approval.",
    ],
    referenceReviewStatus: "required_before_generation",
    visualReviewStatus: "not_generated",
  };
});
for (const image of previewManifest) {
  assert(image.generationBrief.includes(image.visualDescription));
  assert(image.referenceSourceUrls.length && image.acceptanceChecks.length >= 6);
  assert(image.generationBrief.includes(JSON.stringify(image.illustrationHardware)), `Missing hardware brief ${image.id}`);
  assert.equal(image.referenceReviewStatus, "required_before_generation");
  if (["crawfish_streamer", "woolly_bugger", "leech_streamer", "sculpin_streamer"].includes(image.typeId)) {
    assert(!("wing" in image.components), `Misleading wing instruction on ${image.id}`);
  }
}
assert.equal(NARROW_POOL_REVIEW.length, 20);
assert.equal(NARROW_POOL_REVIEW.reduce((n, row) => n + row.previousThreeChoiceCells, 0), 108);
for (const row of NARROW_POOL_REVIEW) {
  checkSources([...row.sourceIds]);
  assert(profiles.has(row.profileId) && row.reason.length > 40);
}
const smallPools = pools.filter(x => x.patternIds.length === 3);
const stats = {
  researchVersion: RESEARCH_VERSION, sources: sources.size, candidatePatterns: patterns.size,
  releasedPatterns: used.size, reviewedTypes: types.size, reviewedCells: pools.length,
  minimumPoolSize: Math.min(...pools.map(x => x.patternIds.length)),
  maximumPoolSize: Math.max(...pools.map(x => x.patternIds.length)),
  exactlyThreePools: smallPools.length, decisions: decisions.length,
  patternPreviewRequirements: previewManifest.length,
  directExperimentalCellClaims: 0,
};

if (process.argv.includes("--write-report")) {
  const root = fileURLToPath(new URL("../docs/color-picker/", import.meta.url));
  mkdirSync(root, { recursive: true });
  const write = (name: string, body: string) => writeFileSync(resolve(root, name), body);
  const names = (ids: string[]) => ids.map(id => patterns.get(id)!.name).join("; ");
  write("pass_2_pool_matrix.md", [
    "# Color picker — pass two pool matrix", "",
    "Generated by `npx tsx scripts/color-picker-research-qa.ts --write-report`. Each row is an explicit bait/clarity/light pool; list order has no recommendation meaning.", "",
    "All cells are author-reviewed heuristics applying cited angler/manufacturer guidance. None is a directly experimentally validated six-cell rule. Structural QA verifies coverage and consistency, not catch effectiveness.", "",
    ...Object.entries(stats).map(([key, value]) => `- ${key}: ${value}`), "",
    "## All condition pools", "",
    "| Bait type | Clarity | Light | Eligible patterns | Research profile |", "| --- | --- | --- | --- | --- |",
    ...pools.map(x => `| ${types.get(x.typeId)!.label} | ${x.clarity === "dirty" ? "Murky" : x.clarity} | ${x.light} | ${names(x.patternIds)} | ${x.profileId} |`), "",
    "## Profile rationale and evidence", "",
    ...RESEARCH_PROFILES.flatMap(x => [
      `### ${x.id}`, "", x.principle, "", `Editorial application: ${x.extension}`, "",
      `Light handling: ${x.lightPolicy}.`, "",
      `Sources: ${x.sourceIds.map(id => `[${sources.get(id)!.title}](${sources.get(id)!.url})`).join(", ")}.`, "",
    ]),
    "## Pools with exactly three choices", "",
    "These pools cannot offer a new combination on refresh. Shuffle order is not a new selection. The later UI should explain that all options in this catalog pool are already shown.", "",
    ...smallPools.map(x => `- ${x.typeId}: ${x.clarity}/${x.light}`), "",
  ].join("\n"));
  write("pass_2_sources.md", [
    "# Color picker — research source register", "", "Access date: September 5, 2026. No commercial source is treated as experimental proof. Search-excerpt access is recorded explicitly; failed full-page retrieval is not represented as a full read.", "",
    ...RESEARCH_SOURCES.flatMap(x => [`## ${x.id}`, "", `[${x.title}](${x.url}) — ${x.kind}; consulted via ${x.consultedVia}.`, "", x.supports, "", `Limits: ${x.limitations}`, ""]),
  ].join("\n"));
  write("pass_2_patterns.md", [
    "# Color picker — canonical pattern recipes", "",
    "Names identify known palettes; descriptive combinations are allowed when grounded in cited palettes and realistic construction. Exact commercial SKU matches are not required. Named recipes vary by brand; the explicit components define the illustrated variant. Swatches are human illustration references. Unused candidates stay outside release pools. Pattern images remain to be generated and visually reviewed.", "",
    "| ID | Name | Material | Opacity / finish | Visual recipe | Basis | In a release pool |", "| --- | --- | --- | --- | --- | --- | --- |",
    ...COLOR_PATTERNS.map(x => `| ${x.id} | ${x.name} | ${x.material} | ${x.opacity} / ${x.finish} | ${x.visualDescription} | ${x.constructionBasis} | ${used.has(x.id) ? "Yes" : "No"} |`), "",
  ].join("\n"));
  // Candidate scope is the union of each type's physical allowlist and its research profile.
  // Any other catalog pattern is implicitly excluded for that type; no fallback may admit it.
  const csv = (v: unknown) => `"${String(v).replaceAll('"', '""')}"`;
  write("pass_2_pattern_decisions.csv", [
    ["type_id", "clarity", "light", "pattern_id", "disposition", "profile_id", "evidence_basis", "source_ids", "reason"].map(csv).join(","),
    ...decisions.map(x => [x.typeId, x.clarity, x.light, x.patternId, x.disposition, x.profileId, x.basis, x.sourceIds.join(";"), x.reason].map(csv).join(",")),
  ].join("\n") + "\n");
  write("pattern_image_manifest.json", JSON.stringify({ researchVersion: RESEARCH_VERSION, images: previewManifest }, null, 2) + "\n");
  write("pass_2_narrow_pool_review.md", [
    "# Pass two — narrow pool re-audit", "",
    "The earlier 108 three-choice cells were reviewed across all 20 affected authoring profiles. The table records expansions and deliberate retentions. A retained three-choice pool is not a claim that no other color works; it is the current documented scope.", "",
    `Current three-choice cells: ${smallPools.length}. Every condition is enumerated in the regenerated pool matrix.`, "",
    "| Profile | Previous three-choice cells | Decision | Reason and evidence |", "| --- | --- | --- | --- |",
    ...NARROW_POOL_REVIEW.map(x => `| ${x.profileId} | ${x.previousThreeChoiceCells} | ${x.disposition} | ${x.reason} ${x.sourceIds.map(id => `[${sources.get(id)!.title}](${sources.get(id)!.url})`).join(", ")} |`), "",
    "## Stick worm in murky water", "", names(pool("stick_worm", "dirty_cloudy").patternIds), "",
    "New finishes are supported by manufacturer recipe descriptions and applied to the established dark/opaque-plastic rationale. Availability and efficacy evidence remain separate. No color is ranked and small flakes are not promised to stay visible underwater.", "",
    "## Artwork contract", "",
    "Every manifest entry now includes full recipe, components, material, opacity, finish, flash, approximate swatches, source links, complete generation brief, and six visual acceptance checks. Source-reference inspection is required before generation, and output review before acceptance. The manifest is complete as a specification; no generated image is claimed approved by this research pass.", "",
  ].join("\n"));
}
console.log(JSON.stringify({ result: "PASS — structural and domain guardrails", ...stats }, null, 2));
