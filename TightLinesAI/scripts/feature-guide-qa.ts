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

assert.doesNotMatch(
  home,
  /Match your fishing question to the right feature/,
  "The compact getting-started card must not restore its removed subtitle",
);

assert.match(
  home,
  /How to get started[\s\S]*?Great Lakes live map[\s\S]*?<ModuleRow/,
  "The live conditions map shortcut must sit below the guide and above the intelligence modules",
);

assert.match(
  home,
  /readPierCastTargetPreference\(\)[\s\S]*?pathname: "\/pier-cast-map"[\s\S]*?speciesId/,
  "The home map shortcut must preserve the remembered PierCast target species",
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
  /feature\.module === "tackle-box" && activeLocation[\s\S]*?pathname: "\/recommender"[\s\S]*?latitude: String\(activeLocation\.lat\)/,
  "Tackle Box must inherit the known homepage location",
);

assert.match(
  guide,
  /title: "Today's Bite"[\s\S]*?title: "Tackle Box"[\s\S]*?title: "Color Match"[\s\S]*?title: "River Migration"[\s\S]*?title: "PierCast"[\s\S]*?title: "Water Read"/,
  "Feature guidance must follow the every-trip, then go-deeper order",
);

for (const field of ["question:", "summary:", "gets:", "worksOn:"]) {
  assert.equal(
    guide.split(`\n    ${field}`).length - 1,
    6,
    `Every feature card must define ${field.replace(":", "")}`,
  );
}

assert.match(
  guide,
  /Trout reads are dependable from fall through spring[\s\S]*?In summer heat, trust it for warmwater fish and treat coldwater species with caution/,
  "Today's Bite must carry the owner-approved species and season boundary",
);

assert.match(
  guide,
  /worksOn: "Largemouth, smallmouth, pike and trout"/,
  "Tackle Box must list only the species the wizard offers",
);

assert.match(
  guide,
  /module: "color-match"[\s\S]*?route: "\/color-picker"/,
  "Color Match must be openable",
);
assert.match(
  guide,
  /label: "2 for sun"[\s\S]*?label: "2 for clouds"/,
  "Color Match must describe its honest two-by-two guidance",
);

assert.match(
  guide,
  /When a run is your question, trust this over Today's Bite\./,
  "River Migration must be positioned as the primary supported-migration tool",
);

assert.match(
  guide,
  /readPierCastTargetPreference\(\)[\s\S]*?pathname: "\/pier-cast-map"[\s\S]*?speciesId/,
  "The guide's live map button must preserve the remembered PierCast target species",
);

assert.match(
  guide,
  /Reads shape, not fish\. It is not sonar or a depth chart\./,
  "Water Read must state that it reads structure, not fish",
);

assert.doesNotMatch(
  guide,
  /DATA_SIGNALS|What it considers|What it returns|6-Day Forecast|weighted conditions|private formulas/i,
  "The feature guide must not restore the dense engine-explainer content",
);

console.log(
  "Feature guide QA passed: image-forward six-tool guide, location hand-off, honest coverage, and seasonal product boundaries.",
);
