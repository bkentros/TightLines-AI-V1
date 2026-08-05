import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const guide = readFileSync(`${projectRoot}app/how-it-works.tsx`, "utf8");
const home = readFileSync(`${projectRoot}app/(tabs)/index.tsx`, "utf8");

assert.match(
  home,
  /<Text style=\{styles\.howWorksEyebrow\}>FIELD GUIDE<\/Text>[\s\S]*?<Text style=\{styles\.howWorksTitle\}>\s*Choose the right read/,
  "The home entry point must frame this page as a feature-selection guide",
);

assert.match(
  guide,
  /title="CHOOSE YOUR READ"/,
  "The page title must emphasize choosing a feature, not engine transparency",
);

assert.match(
  guide,
  /title: "Today's Bite"[\s\S]*?title: "River Migration"[\s\S]*?title: "Tackle Box"[\s\S]*?title: "Water Read"/,
  "Feature guidance must follow the product-priority order",
);

for (const label of ["WHEN TO USE IT", "HOW IT READS", "GUIDE'S NOTE"]) {
  assert.match(
    guide,
    new RegExp(`label=\\"${label.replace("'", "\\'")}\\"`),
    `Every feature card must use the structured ${label} section`,
  );
}

assert.match(
  guide,
  /warmwater species[\s\S]*?trout and other coldwater species in fall, winter, and spring[\s\S]*?Do not rely on it for coldwater species in summer/,
  "Today's Bite must carry the owner-approved species and season boundary",
);

assert.match(
  guide,
  /When a supported migration is your main question, this is the primary read—not Today's Bite/,
  "River Migration must be positioned as the primary supported-migration tool",
);

assert.doesNotMatch(
  guide,
  /DATA_SIGNALS|What it considers|What it returns|6-Day Forecast|weighted conditions|private formulas/i,
  "The feature guide must not restore the dense engine-explainer content",
);

console.log(
  "Feature guide QA passed: concise four-tool order, structured guidance, and seasonal product boundaries.",
);
