# PierCast brown-trout seasonality — Passes 5 and 6

Completed October 20, 2026. Target: app-only version 1.18.

## Pass 5 — app integration and regression audit

The corrected brown-trout calibration was exercised through the same bundled
projection used by the landing card, fresh city reports, saved reports, and
future-day reports. The integration matrix covers:

- all 32 PierCast cities;
- all 157 supported salmonid city/species pairs;
- 19 season-boundary dates per pair;
- every thermal-profile knot; and
- Today, Season, temperature fit, closure, and research-hold presentation.

All entry paths resolve through the app-local 1.18 seasonality-v2 projection.
The projection identifier was reconciled from `salmonid-seasonality-v1` to
`salmonid-seasonality-v2`, and an automated source guard prevents it from
drifting back to the stale identifier. The deterministic integration
fingerprint remains unchanged because the identifier correction does not alter
fishery output.

The Pass 5 suite passed 5/5. It also confirms that city reports remain
score-free and rank-free, contain no Standings language, and use the same model
as the landing-page top pick.

## Pass 6 — compatibility and release-readiness audit

The focused salmonid release suite passed 45/45. It verifies malformed-input
handling, older-server projection, all six lake-trout research holds,
idempotency for every scored salmonid pair, thermal boundary behavior,
accessibility labels, stale-request protection, and old-client compatibility.

The full PierCast suite passed 235/235, TypeScript passed with no errors, Feature
Guide QA passed, the compatibility-side lake-trout test passed 5/5, and both
the frozen Pass 1 baseline and the Pass 3/4 post-correction artifacts reproduce
exactly.

Repository reconciliation confirms:

- app version remains `1.18`;
- no database migration changed;
- no Edge Function, Worker, lake-map runtime, dependency, or app configuration
  changed as part of the brown-trout work;
- server calibration and the public response contract remain frozen; and
- no build, update-channel publish, deployment, or store submission was run.

Expo Doctor passed 19/20 repository checks. Its only failure is local tooling:
this machine has Xcode 15.2 while Expo SDK 55 requires Xcode 26 or newer. This
does not indicate a repository defect or affect EAS cloud-build workers, but
Xcode must be upgraded before attempting a local iOS build on this Mac.

## Outcome

The eight evidence-supported Wisconsin brown-trout corrections are fully wired
into the version 1.18 app projection and isolated from older clients and server
behavior. The remaining 19 audited brown-trout cities and every non-brown-trout
calibration remain unchanged.
