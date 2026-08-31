import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const guide = readFileSync(`${projectRoot}app/how-it-works.tsx`, "utf8");
const home = readFileSync(`${projectRoot}app/(tabs)/index.tsx`, "utf8");

assert.match(
  home,
  /style=\{styles\.howWorksEyebrow\}[\s\S]*?NEW TO FINFINDR\?[\s\S]*?style=\{styles\.howWorksTitle\}[\s\S]*?How to get started/,
  "The home entry point must clearly invite new users to get started",
);

assert.match(
  guide,
  /title="GETTING STARTED"/,
  "The page title must frame the guide around getting started",
);

assert.match(
  home,
  /<View style=\{styles\.modulesHeader\}>[\s\S]*?<Pressable[\s\S]*?styles\.howWorksCta[\s\S]*?How to get started[\s\S]*?<ModuleRow[\s\S]*?title="River Migration"/,
  "The getting-started guide must appear before the first intelligence module",
);

assert.match(
  home,
  /pathname: "\/how-it-works"[\s\S]*?lat: String\(coords\.lat\)[\s\S]*?lon: String\(coords\.lon\)[\s\S]*?location_label: locationLabel/,
  "Home must carry its resolved location into the getting-started guide",
);

assert.match(
  guide,
  /feature\.module === "todays-bite" && activeLocation[\s\S]*?pathname: "\/how-fishing"[\s\S]*?lat: String\(activeLocation\.lat\)[\s\S]*?lon: String\(activeLocation\.lon\)[\s\S]*?location_label: activeLocation\.label/,
  "Today's Bite must inherit the known homepage location",
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

assert.match(
  guide,
  /supported salmon and steelhead river migrations—especially migration stage, seasonal presence, activity, current river conditions, and official fish counts where available/,
  "River Migration guidance must describe the simplified public reads and conditions",
);

assert.doesNotMatch(
  guide,
  /DATA_SIGNALS|What it considers|What it returns|6-Day Forecast|weighted conditions|private formulas/i,
  "The feature guide must not restore the dense engine-explainer content",
);

console.log(
  "Feature guide QA passed: concise four-tool order, structured guidance, and seasonal product boundaries.",
);
