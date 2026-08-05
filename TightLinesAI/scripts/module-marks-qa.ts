import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const home = readFileSync(`${projectRoot}app/(tabs)/index.tsx`, "utf8");
const guide = readFileSync(`${projectRoot}app/how-it-works.tsx`, "utf8");
const marks = readFileSync(
  `${projectRoot}components/paper/IntelligenceModuleIcons.tsx`,
  "utf8",
);
const preview = readFileSync(`${projectRoot}app/module-icons-preview.tsx`, "utf8");

assert.match(
  home,
  /title="Water Read"[\s\S]*?code="05"[\s\S]*?title="Color Match"[\s\S]*?tag="COLOR GUIDE"[\s\S]*?moduleId="color-match"[\s\S]*?iconBorder="#D9772B"[\s\S]*?comingSoon/,
  "Color Match must be the orange, disabled fifth module",
);
assert.match(
  home,
  /4 LIVE · 1 PLANNED/,
  "The module count must distinguish available and planned tools",
);
assert.match(
  home,
  /size=\{50\}[\s\S]*?animate=\{!comingSoon\}/,
  "Planned module artwork must stay static",
);

assert.match(
  home,
  /howWorksCta:\s*\{[\s\S]*?minHeight: 64[\s\S]*?backgroundColor: "#EAF3F7"/,
  "The getting-started card must remain compact and light",
);
assert.match(
  guide,
  /PICK A QUESTION\.\{\"\\n\"\}[\s\S]*?FIND YOUR TOOL\./,
  "The getting-started hero must stay at two short lines",
);

assert.match(
  marks,
  /INTELLIGENCE_MODULE_ICON_VARIANT: IntelligenceModuleIconVariant = 'field'/,
  "Refined field marks must be the production icon default",
);
for (const component of [
  "TodaysBiteFieldMark",
  "RiverMigrationFieldMark",
  "TackleBoxFieldMark",
  "WaterReadFieldMark",
  "ColorMatchFieldMark",
]) {
  assert.match(
    marks,
    new RegExp(`function ${component}\\(`),
    `Missing refined module artwork: ${component}`,
  );
}
assert.match(
  preview,
  /id: "color-match"[\s\S]*?title: "Color Match"[\s\S]*?key: "field"/,
  "The internal icon preview must cover Color Match and the field-mark pass",
);

console.log(
  "Module mark QA passed: compact guide CTA, two-line hero, five refined marks, and disabled Color Match.",
);
