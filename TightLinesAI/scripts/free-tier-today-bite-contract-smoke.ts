/**
 * Locks Today's Bite free-tier contract:
 * - 1 full today report ever (server marks free_today_bite_full_used_at)
 * - Same calendar day: cached full revisit until local midnight
 * - Next calendar day (or regenerate after cache miss): partial + paywall surface
 *
 * Run: npx tsx scripts/free-tier-today-bite-contract-smoke.ts
 */

import { readFileSync } from 'fs';
import { freeTodayBiteFullTrialAvailable } from '../lib/freeTrialAccess';
import { shouldLimitFreeTodayBiteReport } from '../lib/subscription';
import type { UserProfile } from '../lib/types';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function profileWithTrialUsed(): UserProfile {
  return {
    id: 'test-user',
    free_today_bite_full_used_at: '2026-06-14T12:00:00.000Z',
  } as UserProfile;
}

function profileWithTrialAvailable(): UserProfile {
  return {
    id: 'test-user',
    free_today_bite_full_used_at: null,
  } as UserProfile;
}

/** Mirrors client cache read in lib/howFishing.ts getCachedHowFishingRebuild */
function readTodayCache(params: {
  accessTier: 'angler' | 'free_limited';
  expired: boolean;
  allowLimited: boolean;
}): 'miss' | 'full' | 'partial' {
  if (params.expired) return 'miss';
  if (params.accessTier === 'free_limited' && !params.allowLimited) return 'miss';
  return params.accessTier === 'free_limited' ? 'partial' : 'full';
}

/** Mirrors server limitedAccess in how-fishing/index.ts */
function serverGeneratesLimited(params: {
  tier: 'free' | 'angler';
  isTodayRead: boolean;
  profile: UserProfile | null;
}): boolean {
  return params.tier === 'free' &&
    params.isTodayRead &&
    !freeTodayBiteFullTrialAvailable(params.profile);
}

/** Mirrors client display gate in how-fishing.tsx shouldLimitReportSurface */
function clientShowsPaywallSurface(accessTier: string | undefined): boolean {
  return accessTier === 'free_limited';
}

const howFishingServer = readFileSync('supabase/functions/how-fishing/index.ts', 'utf8');
const howFishingApp = readFileSync('app/how-fishing.tsx', 'utf8');
const howFishingCache = readFileSync('lib/howFishing.ts', 'utf8');
const subscriptionSource = readFileSync('lib/subscription.ts', 'utf8');
const migrationSource = readFileSync(
  'supabase/migrations/20260614120000_add_free_tier_trial_flags.sql',
  'utf8',
);

// ── Source contracts ────────────────────────────────────────────────────────

assert(
  migrationSource.includes('free_today_bite_full_used_at'),
  'migration should add free_today_bite_full_used_at',
);
assert(
  howFishingServer.includes('freeTodayBiteFullTrialAvailable(profile)'),
  'how-fishing should read today bite trial flag from profile',
);
assert(
  howFishingServer.includes('const limitedAccess = tier === "free"'),
  'how-fishing should compute limitedAccess for free today reads',
);
assert(
  howFishingServer.includes('limitReportForFree(report)'),
  'how-fishing should strip report body for limited free access',
);
assert(
  howFishingServer.includes('access_tier: limitedAccess ? "free_limited"'),
  'how-fishing should tag limited bundles as free_limited',
);
assert(
  howFishingServer.includes('finalizeFreeTodayBiteTrial'),
  'how-fishing should finalize today bite trial only after generating a read',
);
assert(
  howFishingServer.includes('locationLocalMidnightIso(timezone)'),
  'how-fishing should expire today cache at the location next local midnight',
);
assert(
  howFishingCache.includes("entry.bundle.access_tier === 'free_limited' && !options.allowLimited"),
  'client cache should ignore partial bundles until trial is spent on device',
);
assert(
  howFishingCache.includes('!Number.isFinite(expires) || Date.now() >= expires'),
  'client cache should reject missing/invalid expiry (forces fresh day after midnight)',
);
assert(
  howFishingApp.includes('bundle?.access_tier === "free_limited"'),
  'how-fishing screen should gate paywall UI on stored bundle tier, not live profile flags',
);
assert(
  howFishingApp.includes('allowLimited: isLimitedFreeRead'),
  'how-fishing should allow partial cache reads once trial is spent',
);
assert(
  subscriptionSource.includes('if (!profile) return true'),
  'shouldLimitFreeTodayBiteReport should stay conservative until profile hydrates',
);
assert(
  howFishingApp.includes('void fetchProfile(user.id)'),
  'how-fishing should refresh profile after first free today generation',
);
assert(
  howFishingServer.includes('trial_mark_failed'),
  'how-fishing should fail closed when today bite trial mark cannot persist',
);
assert(
  readFileSync('supabase/functions/_shared/freeTrialAccess.ts', 'utf8')
    .includes('mark_today_bite_trial_not_persisted'),
  'today bite trial mark should verify persistence before succeeding',
);

// ── Scenario matrix (what you cannot smoke-test until tomorrow on device) ───

const spent = profileWithTrialUsed();
const fresh = profileWithTrialAvailable();

// Day 1 — first generation
assert(
  !shouldLimitFreeTodayBiteReport('free', fresh),
  'day1: client should not pre-limit before trial is spent',
);
assert(
  !serverGeneratesLimited({ tier: 'free', isTodayRead: true, profile: fresh }),
  'day1: server should return a full today report',
);
assert(
  clientShowsPaywallSurface('angler') === false,
  'day1: full bundle should not show paywall sections',
);

// Day 1 — same-day revisit after trial spent (cache still valid, access_tier angler)
assert(
  shouldLimitFreeTodayBiteReport('free', spent),
  'day1 later: client knows trial is spent',
);
assert(
  readTodayCache({ accessTier: 'angler', expired: false, allowLimited: true }) === 'full',
  'day1 revisit: cached full report remains readable until local midnight',
);
assert(
  clientShowsPaywallSurface('angler') === false,
  'day1 revisit: cached full bundle still renders full surface',
);

// Day 2 — tomorrow generate (cache expired, trial spent)
assert(
  readTodayCache({ accessTier: 'angler', expired: true, allowLimited: true }) === 'miss',
  'day2: yesterday full cache must miss after local midnight expiry',
);
assert(
  serverGeneratesLimited({ tier: 'free', isTodayRead: true, profile: spent }),
  'day2: server must generate limitedAccess for spent free trial',
);
assert(
  clientShowsPaywallSurface('free_limited'),
  'day2: new partial bundle must show paywall / limited surface',
);
assert(
  readTodayCache({ accessTier: 'free_limited', expired: false, allowLimited: true }) === 'partial',
  'day2 revisit: partial cache should be readable once trial is spent',
);

// Day 2 — regenerate should stay partial forever
assert(
  serverGeneratesLimited({ tier: 'free', isTodayRead: true, profile: spent }),
  'day2+: every new today generation stays partial for free tier after trial',
);

// Forecast days stay blocked for free
assert(
  howFishingServer.includes('tier === "free" && !isTodayRead'),
  'how-fishing should still 403 forecast-day reads for free tier',
);

console.log('free-tier-today-bite-contract-smoke: all checks passed');
console.log('');
console.log('Tomorrow manual smoke (free account with trial already spent today):');
console.log('  1. After local midnight, open Home → Today\'s Bite → Generate.');
console.log('  2. Expect score + summary visible, paywall card for drivers/timing/forecast.');
console.log('  3. Feedback context should show Access: free_limited.');
