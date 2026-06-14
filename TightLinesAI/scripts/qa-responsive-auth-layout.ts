/**
 * Static QA for auth/onboarding responsive tiers — run without a device:
 *   npx tsx scripts/qa-responsive-auth-layout.ts
 */
import {
  IPHONE_LAYOUT_PROFILES,
  estimateUsableHeight,
  getAuthLayoutTier,
  authScopeStageSize,
} from '../lib/responsiveAuth';

type Expectation = {
  id: string;
  tier: ReturnType<typeof getAuthLayoutTier>;
  spreadAllowed: boolean;
  insetKind: 'notch' | 'homeButton';
};

const EXPECTATIONS: Expectation[] = [
  { id: 'se-320', tier: 'compact', spreadAllowed: false, insetKind: 'homeButton' },
  { id: 'se-375', tier: 'compact', spreadAllowed: false, insetKind: 'homeButton' },
  { id: 'mini-375', tier: 'compact', spreadAllowed: false, insetKind: 'notch' },
  { id: 'std-393', tier: 'standard', spreadAllowed: false, insetKind: 'notch' },
  { id: 'plus-428', tier: 'tall', spreadAllowed: true, insetKind: 'notch' },
  { id: 'promax-430', tier: 'tall', spreadAllowed: true, insetKind: 'notch' },
];

let failed = 0;

for (const exp of EXPECTATIONS) {
  const profile = IPHONE_LAYOUT_PROFILES.find((p) => p.id === exp.id);
  if (!profile) {
    console.error(`FAIL missing profile ${exp.id}`);
    failed += 1;
    continue;
  }

  const usable = estimateUsableHeight(profile, exp.insetKind);
  const tier = getAuthLayoutTier(profile.width, usable, 1);
  const spreadAllowed = tier === 'tall';
  const stage = authScopeStageSize(tier);

  const ok = tier === exp.tier && spreadAllowed === exp.spreadAllowed;
  const tag = ok ? 'PASS' : 'FAIL';
  console.log(
    `${tag} ${profile.label.padEnd(14)} ${profile.width}×${profile.height} usable=${usable} tier=${tier} spread=${spreadAllowed} stage=${stage.stage}`,
  );

  if (!ok) {
    failed += 1;
    console.log(
      `     expected tier=${exp.tier} spread=${exp.spreadAllowed}`,
    );
  }
}

// Large Dynamic Type must never use spread (content gets crushed).
const se = IPHONE_LAYOUT_PROFILES.find((p) => p.id === 'se-375')!;
const seUsable = estimateUsableHeight(se, 'homeButton');
const largeTypeTier = getAuthLayoutTier(se.width, seUsable, 1.25);
if (largeTypeTier !== 'compact') {
  console.error('FAIL Dynamic Type 1.25 on SE should force compact');
  failed += 1;
} else {
  console.log('PASS Dynamic Type 1.25 on SE forces compact (scroll, no spread)');
}

// Onboarding header reserve must not downgrade iPhone 15 tier.
const std = IPHONE_LAYOUT_PROFILES.find((p) => p.id === 'std-393')!;
const stdUsable = estimateUsableHeight(std, 'notch');
const stdTier = getAuthLayoutTier(std.width, stdUsable, 1);
if (stdTier !== 'standard') {
  console.error(`FAIL iPhone 15 tier should stay standard (got ${stdTier})`);
  failed += 1;
} else {
  console.log('PASS iPhone 15 stays standard even with onboarding nav header');
}

if (failed > 0) {
  console.error(`\n${failed} responsive auth layout check(s) failed.`);
  process.exit(1);
}

console.log('\nAll responsive auth layout checks passed.');
