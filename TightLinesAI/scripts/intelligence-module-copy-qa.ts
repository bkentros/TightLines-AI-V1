import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const read = (path: string) => readFileSync(`${projectRoot}${path}`, "utf8");

const copy = read("lib/intelligenceModuleCopy.ts");
const descriptions = {
  "todays-bite": "Daily fishing conditions and best times",
  "tackle-box": "Condition-matched lure and fly picks",
  "river-run": "River run timing, activity, and conditions",
  "pier-cast": "Great Lakes pier conditions and forecasts",
  "color-match": "Lure and fly colors for clarity and light",
  "water-read": "Lake structure and likely fishing zones",
} as const;

for (const [moduleId, description] of Object.entries(descriptions)) {
  assert.ok(copy.includes(`"${moduleId}": "${description}"`), `Missing shared copy for ${moduleId}`);
}

const fullConsumers = [
  "app/(tabs)/index.tsx",
  "app/(auth)/welcome.tsx",
  "app/subscribe.tsx",
  "app/module-icons-preview.tsx",
];
for (const path of fullConsumers) {
  const source = read(path);
  for (const moduleId of Object.keys(descriptions)) {
    const doubleQuoted = `INTELLIGENCE_MODULE_DESCRIPTIONS["${moduleId}"]`;
    const singleQuoted = `INTELLIGENCE_MODULE_DESCRIPTIONS['${moduleId}']`;
    assert.ok(
      source.includes(doubleQuoted) || source.includes(singleQuoted),
      `${path} must use shared copy for ${moduleId}`,
    );
  }
}

const partialConsumers = [
  "app/(onboarding)/step-1-welcome.tsx",
  "components/fishing/RebuildReportView.tsx",
];
for (const path of partialConsumers) {
  const source = read(path);
  for (const moduleId of ["todays-bite", "tackle-box", "water-read"]) {
    assert.match(source, new RegExp(`INTELLIGENCE_MODULE_DESCRIPTIONS\\[["']${moduleId}["']\\]`));
  }
}

const consumerCopy = [...fullConsumers, ...partialConsumers].map(read).join("\n");
for (const retired of [
  "Full breakdown · windows",
  "Tuned picks for today's conditions & species",
  "Most lakes: structure + potential hotspots",
  "Great Lakes pier outlooks ·",
  "Advanced color guidance for soft plastics",
]) {
  assert.ok(!consumerCopy.includes(retired), `Retired module description remains: ${retired}`);
}

console.log("Intelligence module copy QA passed: six shared, concise descriptions across customer surfaces.");
