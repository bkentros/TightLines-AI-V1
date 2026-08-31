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

for (const phrase of [
  "Today's score, bite windows, limiting factors, and the reason behind the read.",
  'Migration stage, activity, seasonal presence, and live river conditions.',
  'Lures, flies, and presentations tuned to your species and current conditions.',
  'Structure, cover, and likely holding zones across supported lakes.',
]) {
  assert.ok(welcome.includes(phrase), `Logged-out module copy is missing: ${phrase}`);
}

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
  /HANDLE[\s\S]*?STATE[\s\S]*?CITY · OPT\.[\s\S]*?STATE · REQUIRED[\s\S]*?CITY · OPTIONAL/,
  'Onboarding must make required and optional details explicit',
);
assert.match(
  onboarding,
  /style=\{styles\.statePicker\}[\s\S]*?showStateList &&[\s\S]*?style=\{styles\.stateList\}[\s\S]*?<VerifiedCityInput/,
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
