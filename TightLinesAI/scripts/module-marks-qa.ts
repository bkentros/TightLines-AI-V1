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
const moduleCopy = readFileSync(`${projectRoot}lib/intelligenceModuleCopy.ts`, "utf8");

assert.match(
  home,
  /code="05"[\s\S]*?title="Color Match"[\s\S]*?tag="COLOR GUIDE"[\s\S]*?moduleId="color-match"[\s\S]*?iconBorder="#D9772B"[\s\S]*?onPress=\{\(\) => router\.push\("\/color-picker"\)\}[\s\S]*?code="06"[\s\S]*?title="Water Read"/,
  "Color Match must be the orange, openable fifth module",
);
assert.doesNotMatch(
  home,
  /5 LIVE · 1 PLANNED/,
  "The home module heading must not show a live/planned count",
);
assert.match(
  home,
  /size=\{50\}[\s\S]*?animate=\{!comingSoon\}/,
  "Planned module artwork must stay static",
);

assert.match(
  home,
  /howWorksCta:\s*\{[\s\S]*?minHeight: 56[\s\S]*?backgroundColor: "#EAF3F7"/,
  "The getting-started card must remain compact and light",
);
assert.match(
  home,
  /lakeMapCta:\s*\{[\s\S]*?minHeight: 56[\s\S]*?backgroundColor: "#E1F0ED"/,
  "The live lake map shortcut must match the compact guide-card height",
);
assert.match(
  home,
  /title="Pier Cast"[\s\S]*?badge="NEW"[\s\S]*?title="River Migration"/,
  "Only Pier Cast should carry the dashboard's new-feature badge",
);
assert.doesNotMatch(
  home,
  /title="River Migration"[\s\S]*?badge="NEW"/,
  "River Migration must not retain a new-feature badge",
);
assert.match(
  guide,
  /Six tools\.\{"\\n"\}One answer each\.[\s\S]*?Start with the question you have today\./,
  "The getting-started hero must keep its concise question-first framing",
);

assert.match(
  marks,
  /INTELLIGENCE_MODULE_ICON_VARIANT: IntelligenceModuleIconVariant = 'field'/,
  "Refined field marks must be the production icon default",
);
assert.match(
  marks,
  /function InstrumentFrame\(/,
  "Production marks must share the intelligence-instrument frame",
);
for (const component of [
  "TodaysBiteFieldMark",
  "RiverMigrationFieldMark",
  "TackleBoxFieldMark",
  "WaterReadFieldMark",
  "ColorMatchFieldMark",
  "PierCastFieldMark",
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
assert.match(
  moduleCopy,
  /"color-match": "Lure and fly colors for clarity and light"/,
  "Color Match must include fly color guidance",
);

console.log(
  "Module mark QA passed: compact guide CTA, shared instrument system, six refined marks, and fly-inclusive Color Match.",
);
