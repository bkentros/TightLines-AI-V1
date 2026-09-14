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
  /title: "Today's Bite"[\s\S]*?title: "Tackle Box"[\s\S]*?title: "River Migration"[\s\S]*?title: "Pier Cast"[\s\S]*?title: "Color Match"[\s\S]*?title: "Water Read"/,
  "Feature guidance must follow the product-priority order",
);

for (const label of ["WHEN TO USE IT", "HOW IT WORKS"]) {
  assert.match(
    guide,
    new RegExp(`label=\\"${label.replaceAll("'", "\\'")}\\"`),
    `Every feature card must use the structured ${label} section`,
  );
}

assert.match(
  guide,
  /Trout reads are dependable from fall through spring[\s\S]*?In summer heat, trust it for warmwater fish and treat coldwater species with caution/,
  "Today's Bite must carry the owner-approved species and season boundary",
);

assert.match(
  guide,
  /module: "color-match"[\s\S]*?route: "\/color-picker"[\s\S]*?two colors that hold up in bright, direct sun and two for flat, overcast light[\s\S]*?equal picks, not a ranking/,
  "Color Match must be openable and describe its honest two-by-two guidance",
);

assert.match(
  guide,
  /When a migration is your question, this is the read to trust \\u2014 not Today's Bite/,
  "River Migration must be positioned as the primary supported-migration tool",
);

assert.match(
  guide,
  /live gauge readings from that exact river \\u2014 flow, height and water temperature \\u2014 with researched run timing[\s\S]*?migration stage[\s\S]*?official fish counts/,
  "River Migration guidance must describe the simplified public reads and conditions",
);

assert.doesNotMatch(
  guide,
  /DATA_SIGNALS|What it considers|What it returns|6-Day Forecast|weighted conditions|private formulas/i,
  "The feature guide must not restore the dense engine-explainer content",
);

console.log(
  "Feature guide QA passed: concise six-tool order, structured guidance, and seasonal product boundaries.",
);
