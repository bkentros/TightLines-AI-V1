import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const support = readFileSync(`${projectRoot}app/support.tsx`, "utf8");
const feedback = readFileSync(`${projectRoot}components/FeedbackCard.tsx`, "utf8");
const home = readFileSync(`${projectRoot}app/(tabs)/index.tsx`, "utf8");
const feedbackFunction = readFileSync(`${projectRoot}supabase/functions/submit-feedback/index.ts`, "utf8");
const supportContact = readFileSync(`${projectRoot}lib/supportContact.ts`, "utf8");
const publicSupportPages = [
  "../legal-site/index.html",
  "../legal-site/support/index.html",
  "../legal-site/privacy/index.html",
  "../legal-site/terms/index.html",
].map((path) => readFileSync(`${projectRoot}${path}`, "utf8")).join("\n");

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
assert.match(
  supportContact,
  /PUBLIC_SUPPORT_EMAIL = 'support@finfindr\.app'/,
  "The public support address must remain support@finfindr.app",
);
assert.match(
  support,
  /buildSupportMailtoUrl/,
  "The support screen must retain a direct-email fallback",
);
assert.match(
  feedbackFunction,
  /SUPPORT_NOTIFICATION_INBOX = "finfindr@hotmail\.com"/,
  "In-app inquiries must be delivered directly to the owner's Hotmail inbox",
);
assert.doesNotMatch(
  feedbackFunction,
  /Deno\.env\.get\("FEEDBACK_EMAIL_TO"\)/,
  "A stale hosted secret must not be able to redirect customer inquiries",
);
assert.doesNotMatch(
  `${support}\n${feedback}\n${feedbackFunction}\n${supportContact}\n${publicSupportPages}`,
  /finfindr24@gmail\.com/i,
  "Production support paths must not reference the old Gmail inbox",
);
const publicMailtoTargets = [...publicSupportPages.matchAll(/mailto:([^"?]+)/g)].map((match) => match[1]);
assert.ok(publicMailtoTargets.length >= 4, "Public legal/support pages must expose email links");
assert.deepEqual(
  [...new Set(publicMailtoTargets)],
  ["support@finfindr.app"],
  "Every public email link must use support@finfindr.app",
);

console.log(
  "Support/live UI QA passed: all app inquiry paths converge on support, use the Hotmail notification inbox, and retain a direct-email fallback.",
);
