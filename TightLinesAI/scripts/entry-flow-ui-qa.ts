import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const read = (path: string) => readFileSync(`${projectRoot}${path}`, 'utf8');

const home = read('app/(tabs)/index.tsx');
const welcome = read('app/(auth)/welcome.tsx');
const signIn = read('app/(auth)/sign-in.tsx');
const signUp = read('app/(auth)/sign-up.tsx');
const verify = read('app/(auth)/verify-email.tsx');
const onboarding = read('app/(onboarding)/step-2-preferences.tsx');
const locationPicker = read('components/LocationPickerModal.tsx');
const verifiedCity = read('components/VerifiedCityInput.tsx');
const moduleCopy = read('lib/intelligenceModuleCopy.ts');

assert.match(
  home,
  /style=\{styles\.metricCellReading\}[\s\S]*?<Text style=\{styles\.metricCellValue\}>\{value\}<\/Text>[\s\S]*?<Text style=\{styles\.metricCellUnit\}> \{unit\}<\/Text>/,
  'Live-condition values and units must render as one atomic reading line',
);
assert.doesNotMatch(
  home,
  /metricCellValueRow/,
  'The independently shrinking metric value row must not return',
);

for (const moduleId of [
  'todays-bite', 'tackle-box', 'river-run', 'pier-cast', 'color-match', 'water-read',
]) {
  assert.ok(
    welcome.includes(`INTELLIGENCE_MODULE_DESCRIPTIONS["${moduleId}"]`),
    `Logged-out module copy must use the shared description for ${moduleId}`,
  );
}
assert.match(moduleCopy, /Daily fishing conditions and best times/);

assert.match(
  locationPicker,
  /READING NOW · \{sourceLabel\}[\s\S]*?This location powers Live Conditions/,
  'The location picker must explain the active read scope',
);
assert.match(
  signIn,
  /SECURE ANGLER ACCESS[\s\S]*?ACCOUNT DETAILS/,
  'Sign in must retain its premium access hero and structured form',
);
assert.match(
  signUp,
  /ACCOUNT CREDENTIALS[\s\S]*?3 FIELDS/,
  'Create account must retain its structured credentials card',
);
assert.match(
  verify,
  /ACCOUNT[\s\S]*?VERIFY[\s\S]*?PROFILE[\s\S]*?DELIVERY CHECK/,
  'Verification must show progress and resend guidance',
);
assert.match(
  onboarding,
  /title="Your handle"[\s\S]*?status=\{handleReady \? 'ready' : 'required'\}[\s\S]*?title="Home water"[\s\S]*?>STATE<[\s\S]*?>CITY<[\s\S]*?'OPTIONAL'/,
  'Onboarding must make required and optional details explicit',
);
assert.match(
  onboarding,
  /styles\.statePicker[\s\S]*?showStateList &&[\s\S]*?styles\.stateGridWrap[\s\S]*?<VerifiedCityInput/,
  'Onboarding state options must render directly below the state picker and before city search',
);
assert.match(
  onboarding,
  /Choose a verified city[\s\S]*?<VerifiedCityInput[\s\S]*?homeCityVerified/,
  'Onboarding must require a selected city-index result when the optional city is populated',
);
assert.match(
  verifiedCity,
  /searchUsCities[\s\S]*?onSelect[\s\S]*?const showResults = !verified[\s\S]*?SELECT A VERIFIED CITY/,
  'The shared city field must use city search, explicit selection, and scroll-persistent results',
);

console.log(
  'Entry-flow UI QA passed: readable live metrics, accurate module copy, location scope, and structured auth/onboarding screens.',
);
