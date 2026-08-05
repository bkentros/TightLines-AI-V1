import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const support = readFileSync(`${projectRoot}app/support.tsx`, "utf8");
const feedback = readFileSync(`${projectRoot}components/FeedbackCard.tsx`, "utf8");
const home = readFileSync(`${projectRoot}app/(tabs)/index.tsx`, "utf8");

assert.match(
  feedback,
  /requestMode: variant === 'request' \? 'true' : undefined/,
  "Coverage cards must identify the request flow to the support screen",
);
assert.match(
  support,
  /placeholder="Type your message here\."/,
  "The support composer must use the short message placeholder",
);
assert.match(
  support,
  /requestMode \? 'EXPANSION DESK' : 'SUPPORT DESK'/,
  "Coverage requests must receive purpose-built expansion-desk framing",
);
assert.match(
  support,
  /requestMode \? 'SEND REQUEST' : 'SEND'/,
  "Coverage requests must use a specific send action",
);
assert.match(
  support,
  /<CornerMarkSet[\s\S]*?<View style=\{styles\.formCard\}>/,
  "The support page must retain the upgraded field-card treatment",
);
assert.match(
  home,
  /<TopographicLines[\s\S]*?<CornerMarkSet[\s\S]*?styles\.liveCardHeader/,
  "Live Conditions must include restrained topographic and corner details",
);
assert.doesNotMatch(
  home,
  /cornerCross/,
  "Invisible legacy corner-cross placeholders must be removed",
);

console.log(
  "Support/live UI QA passed: tailored coverage flow, concise composer, and restrained Live Conditions polish.",
);
