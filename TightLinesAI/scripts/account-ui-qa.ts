import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const tabs = readFileSync(`${projectRoot}app/(tabs)/_layout.tsx`, "utf8");
const settings = readFileSync(`${projectRoot}app/(tabs)/settings.tsx`, "utf8");
const membership = readFileSync(`${projectRoot}app/subscribe.tsx`, "utf8");
const welcome = readFileSync(`${projectRoot}app/(auth)/welcome.tsx`, "utf8");
const unlockedModal = readFileSync(
  `${projectRoot}components/paper/AnglerUnlockedModal.tsx`,
  "utf8",
);

assert.match(
  tabs,
  /name="index"[\s\S]*?name="log"[\s\S]*?href: null[\s\S]*?name="settings"/,
  "The log route may remain addressable internally but must be hidden from the tab bar",
);
assert.doesNotMatch(
  tabs,
  /SMART_LOG|Smart Log|smartLogModal|COMING SOON/,
  "The public two-tab shell must not retain Smart Log chrome or its gate modal",
);

assert.match(
  settings,
  /<PaperNavHeader[\s\S]*?title="SETTINGS"[\s\S]*?<SettingsHero/,
  "Settings must use the premium paper header and account hero",
);
assert.match(
  settings,
  /style=\{styles\.statePicker\}[\s\S]*?showStateList &&[\s\S]*?style=\{styles\.stateList\}[\s\S]*?<VerifiedCityInput/,
  "Settings state options must render directly below the state picker and before city search",
);
assert.match(
  settings,
  /Choose a verified city[\s\S]*?<VerifiedCityInput[\s\S]*?homeCityVerified/,
  "Settings must reject unresolved city text and use the verified city selector",
);
assert.match(
  settings,
  /function SettingsSectionHeading[\s\S]*?ACCOUNT FIELD NOTE/,
  "Settings sections must use structured field-note headings",
);
assert.match(
  settings,
  /<MembershipSettingsCard[\s\S]*?router\.push\('\/subscribe'\)/,
  "Settings must retain the enhanced membership-management route",
);

assert.match(
  membership,
  /title: 'River Migration'[\s\S]*?Audited migration reads for supported rivers, seasons, and species/,
  "River Migration must be listed as included with Angler",
);
assert.match(
  welcome,
  /moduleId: "todays-bite"[\s\S]*?moduleId: "river-run"[\s\S]*?moduleId: "tackle-box"[\s\S]*?moduleId: "water-read"[\s\S]*?moduleId: "color-match"/,
  "The public welcome screen must show all five live Angler modules",
);
assert.match(
  membership,
  /module: 'todays-bite'[\s\S]*?module: 'river-run'[\s\S]*?module: 'tackle-box'[\s\S]*?module: 'water-read'[\s\S]*?module: 'color-match'/,
  "Angler benefits must follow the current five-feature product order",
);
assert.match(
  membership,
  /<IntelligenceModuleEmblem[\s\S]*?module=\{feature\.module\}/,
  "Membership benefits must use the premium feature artwork",
);
assert.match(
  unlockedModal,
  /Today's Bite, River Migration, Tackle Box, Water Read, and Color Match/,
  "The Angler unlock confirmation must name all five included features",
);

console.log(
  "Account UI QA passed: two-tab shell, premium Settings, and five-feature Angler membership.",
);
