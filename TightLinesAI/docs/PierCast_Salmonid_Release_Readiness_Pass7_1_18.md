# PierCast 1.18 salmonid release readiness — Pass 7

Reviewed: 2026-10-19

## Verdict

The PierCast 1.18 app changes are ready to enter the normal EAS production-build
workflow after merge. Pass 7 did not start a build, publish an update, submit an
app, deploy a function or Worker, apply a migration, or change the lake map.

`app.json` resolves to app version and runtime version `1.18`; the production
EAS profile remains store-distributed with remote build-number auto-increment.

## App-only reconciliation

Pass 7 found that the reviewed 1.18 temperature curves had initially replaced a
file also imported by the deployed PierCast conditions engine. No server deploy
had occurred, but that shared location violated the intended app-only release
boundary.

The 1.18 curves now live in `lib/pierCastTemperatureProfilesV18.ts`. The app
projection imports that module directly. The production server calibration was
restored byte-for-byte to `origin/main`, and a regression test locks the two
calibrations to distinct version identifiers. There are no production Edge
Function, database-migration, Worker, or lake-map changes in this release.

## Reconciliation and verification

- Branch reconciliation: zero commits behind current `origin/main` before the
  final Pass 7 checkpoint.
- PierCast app tests: 222 passed, 0 failed.
- PierCast server tests: 277 passed, 0 failed.
- Salmonid calibration audit: 229,848 of 229,848 rows, zero errors, reviewed
  fingerprint unchanged.
- Salmonid city integration audit: 38,779 of 38,779 rows, zero errors, reviewed
  fingerprint unchanged.
- TypeScript: passed with `npx tsc --noEmit`.
- Feature-guide QA: passed.
- Expo public configuration: resolved successfully for iOS, Android, and web;
  version/runtime are 1.18 and the expected EAS project ID is present.
- Dependencies: installed top-level tree is valid and Expo dependencies match
  SDK 55.
- Checked-in PierCast migration generators: all current.
- Linked Supabase migration ledger: every local and remote version matches
  through `20261014173000`; no migration was applied.
- EAS account and project lookup: authenticated as `tightlinesai`; the latest
  production build remains version/runtime 1.17, proving no 1.18 build started.

## Local tooling advisory

Expo Doctor passes 19 of 20 checks. Its only advisory is local Xcode 15.2; Expo
SDK 55 requires Xcode 26 or newer for a local native iOS compile. This does not
block the intended EAS cloud production build, but Xcode must be upgraded or a
compatible installation selected before attempting a local native iOS build.

## Release commands deliberately not run

- `eas build`
- `eas update`
- `eas submit`
- `supabase db push` or any migration-up command
- `supabase functions deploy`
- any Worker or lake-map deploy command

Brandon retains the final decision to start the 1.18 production build.
