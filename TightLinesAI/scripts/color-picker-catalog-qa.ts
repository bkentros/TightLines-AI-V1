import assert from "node:assert/strict";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { COLOR_PICKER_TAXONOMY as catalog } from "../supabase/functions/_shared/colorPickerEngine/taxonomy.ts";
import { LURE_ARCHETYPES_V4, FLY_ARCHETYPES_V4 } from "../supabase/functions/_shared/recommenderEngine/v4/candidates/index.ts";

const root = fileURLToPath(new URL("../", import.meta.url));
const unique = (values: string[], label: string) => {
  assert.equal(new Set(values).size, values.length, `Duplicate ${label}`);
};
unique(catalog.categories.map(x => x.id), "category ID");
unique(catalog.baitTypes.map(x => x.id), "type ID");
unique(catalog.baitTypes.map(x => x.label.toLowerCase()), "type label");
unique(catalog.imageRequirements.map(x => x.id), "image ID");
unique(catalog.imageRequirements.map(x => x.targetPath), "image target");
unique(catalog.archetypeMappings.map(x => `${x.gearMode}:${x.archetypeId}`), "archetype mapping");
const categories = new Map(catalog.categories.map(x => [x.id, x]));
const types = new Map(catalog.baitTypes.map(x => [x.id, x]));
const images = new Map(catalog.imageRequirements.map(x => [x.id, x]));
for (const category of catalog.categories) {
  assert(catalog.baitTypes.some(x => x.categoryId === category.id), `Empty category ${category.id}`);
  const image = images.get(category.imageId);
  assert(image?.role === "category" && image.subjectId === category.id, `Category image ${category.id}`);
}
for (const type of catalog.baitTypes) {
  assert(categories.has(type.categoryId), `Unknown category on ${type.id}`);
  assert(type.description.trim() && type.ruleFamily.trim(), `Missing type description/family ${type.id}`);
  assert(type.components.length > 0, `Missing color components ${type.id}`);
  unique(type.components, `component on ${type.id}`);
  const image = images.get(type.imageId);
  assert(image?.role === "bait_type" && image.subjectId === type.id, `Type image ${type.id}`);
  assert(["research_pending", "reviewed_heuristic"].includes(type.poolStatus), `Unknown research status ${type.id}`);
}
for (const image of catalog.imageRequirements) {
  assert(!image.targetPath.includes("..") && image.targetPath.startsWith("assets/images/"));
  assert(image.brief.trim(), `Missing brief ${image.id}`);
  for (const path of image.referencePaths) {
    assert(path.startsWith("assets/images/") && !path.includes(".."));
    assert(existsSync(resolve(root, path)), `Missing reference ${path}`);
  }
  if (image.status === "reference_review_pending") assert(image.referencePaths.length > 0);
}
for (const clarity of ["clear", "stained", "dirty"]) {
  assert(images.get(`clarity_${clarity}`)?.role === "clarity");
}
const live = [
  ...LURE_ARCHETYPES_V4.map(x => ({ id: x.id, gear: "lure", label: x.display_name })),
  ...FLY_ARCHETYPES_V4.map(x => ({ id: x.id, gear: "fly", label: x.display_name })),
];
const mappings = new Map(catalog.archetypeMappings.map(x => [`${x.gearMode}:${x.archetypeId}`, x]));
for (const source of live) assert(mappings.has(`${source.gear}:${source.id}`), `Unaccounted archetype ${source.id}`);
for (const mapping of catalog.archetypeMappings) {
  assert(live.some(x => x.id === mapping.archetypeId && x.gear === mapping.gearMode), `Stale mapping ${mapping.archetypeId}`);
  assert(mapping.reason.trim(), `Missing mapping rationale ${mapping.archetypeId}`);
  if (mapping.disposition === "excluded") {
    assert.equal(mapping.gearMode, "fly", "Every current conventional archetype must be covered");
    assert(catalog.deferredTypes.some(x => x.id === mapping.archetypeId));
    continue;
  }
  const targets = mapping.disposition === "mapped" ? [mapping.typeId] : mapping.typeIds;
  if (mapping.disposition === "choose_type") assert(targets.length >= 2);
  unique(targets, `target on ${mapping.archetypeId}`);
  for (const target of targets) {
    const type = types.get(target);
    assert(type, `Unknown target ${target}`);
    assert.equal(categories.get(type.categoryId)?.gearMode, mapping.gearMode, `Cross-gear mapping ${mapping.archetypeId}`);
  }
}
assert.equal(types.get("fly_popper")?.categoryId, "surface_flies");
assert.equal(types.get("hard_popper")?.categoryId, "topwater_lures");
assert.notEqual(types.get("fly_popper")?.imageId, types.get("hard_popper")?.imageId);
assert.notEqual(types.get("fly_popper")?.ruleFamily, types.get("hard_popper")?.ruleFamily);

const stats = {
  version: catalog.version,
  categories: catalog.categories.length,
  baitTypes: catalog.baitTypes.length,
  sourceLures: LURE_ARCHETYPES_V4.length,
  sourceFlies: FLY_ARCHETYPES_V4.length,
  mapped: catalog.archetypeMappings.filter(x => x.disposition === "mapped").length,
  chooseType: catalog.archetypeMappings.filter(x => x.disposition === "choose_type").length,
  explicitlyDeferred: catalog.archetypeMappings.filter(x => x.disposition === "excluded").length,
  selectorImageRequirements: catalog.imageRequirements.length,
  imagesNeedingGeneration: catalog.imageRequirements.filter(x => x.status === "generation_needed").length,
  imagesWithReferencesToReview: catalog.imageRequirements.filter(x => x.status === "reference_review_pending").length,
  clarityLightCellsToResearch: catalog.baitTypes.length * 3 * 2,
};

if (process.argv.includes("--write-report")) {
  const lines = [
    "# Color picker — pass one catalog audit", "",
    "Generated by `npx tsx scripts/color-picker-catalog-qa.ts --write-report`. Regenerate after taxonomy changes.", "",
    "Taxonomy inclusion is not color eligibility. See the separate pass-two matrix for reviewed condition pools.", "",
    "## Coverage", "", ...Object.entries(stats).map(([k, v]) => `- ${k}: ${v}`), "",
    "## Release types", "", "| Category | Type ID | Display label | Rule authoring family |", "| --- | --- | --- | --- |",
    ...catalog.baitTypes.map(x => `| ${categories.get(x.categoryId)!.label} | ${x.id} | ${x.label} | ${x.ruleFamily} |`), "",
    "## Existing archetype reconciliation", "", "| Gear | Existing ID | Disposition | Picker target | Reason |", "| --- | --- | --- | --- | --- |",
    ...catalog.archetypeMappings.map(x => `| ${x.gearMode} | ${x.archetypeId} | ${x.disposition} | ${x.disposition === "mapped" ? x.typeId : x.disposition === "choose_type" ? x.typeIds.join(" / ") : "Deferred"} | ${x.reason} |`), "",
    "## Selector artwork inventory", "", "References are candidates for visual review, not approved/generated assets. Pattern-specific result previews will be enumerated after pass-two pattern validation.", "",
    "| Image ID | Status | Reference count | Target |", "| --- | --- | --- | --- |",
    ...catalog.imageRequirements.map(x => `| ${x.id} | ${x.status} | ${x.referencePaths.length} | ${x.targetPath} |`), "",
  ];
  mkdirSync(resolve(root, "docs/color-picker"), { recursive: true });
  writeFileSync(resolve(root, "docs/color-picker/pass_1_catalog_audit.md"), lines.join("\n"));
}
console.log(JSON.stringify({ result: "PASS", ...stats }, null, 2));
