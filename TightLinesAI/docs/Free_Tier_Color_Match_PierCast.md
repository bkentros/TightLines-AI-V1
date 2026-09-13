# Color Match and PierCast lifetime free reports

Confirmed policy (2026-09-13): one free report per feature per account, forever. No daily allowance reset.

- Color Match: the first successful report is persisted. Reopening it and retrying its existing request/setup returns the same report. Another lure/fly, clarity, or new report date requires upgrading. Saved trial recovery is server-backed, including after reinstalling or changing devices.
- PierCast: the first successful city report binds the allowance to that city and its server-calculated local report date. The same report may refresh conditions during that day. Another city or another report day returns `subscription_required`; the original dated snapshot remains reopenable.
- The top-five leaderboard is independent of report claims and account tier. Its explicit response projection contains headline scores only, never species reports, temperature series, research candidates, or full daily snapshots. It reads the published daily snapshot independently of live conditions availability.
- Leaderboard, city finder and nearby-port selections use the same authenticated city-report endpoint and paywall handling. Subscription upgrades bypass trial limits; downgrading does not clear an existing trial.
- Claims are persisted in `feature_report_trials`, which has no client read/write privileges. Service-only RPCs arbitrate concurrent claims. Color report insertion and allowance consumption share one database transaction; invalid/failed work does not consume an allowance. Only the existing authorized admin reset can deliberately clear these records.

## Release boundary

PierCast public scientific gates remain disabled. These access controls do not release the five private-review cities. The owner review endpoints remain owner-only; they are not used to supply free-user reports. Public leaderboard/city routes remain unavailable until the existing city, species and temperature approval gates permit release. No scoring formula, seasonal configuration or daily score lock changed.

## Verification

- PierCast foundation, handler and report-access suite: 143 tests passed.
- Color Match engine/service/handler suite: 31 tests passed.
- Color Match release UI/contract QA passed.
- Isolated PostgreSQL migration tests cover concurrent identical Color Match requests, competing PierCast cities, lifetime expiry, same-day condition refresh, failed-work rollback, upgrade/downgrade, account isolation and denied client table/RPC access.
- App TypeScript and changed edge-function checks passed.

Manual device interaction with a regular free account remains a release QA step once PierCast is authorized for public availability; automated public-route tests inject eligible data without altering production scientific gates.

## Deployment verification

Migration `20260913160000` applied; the linked database reports up to date. Deployed `color-picker`, `pier-cast`, and `admin-reset-free-trials`. The disposable-account production smoke passed first Color Match generation, identical-report replay, second-report HTTP 403, saved report recovery, denied client trial-table access, and retained PierCast private/owner gates. The smoke account was deleted afterward. Run it with `node --env-file=.env scripts/color-pier-free-trial-production-smoke.mjs`.

## Conversion-path audit — 2026-09-13

A second audit hardened two edge cases: Color Match generation from an existing paid cache now goes through the atomic lifetime claim after downgrade; PierCast background condition refreshes no longer suppress explicit report/paywall taps. Both screens also check known-used trial state before a different report request, allowing the paywall to open without depending on another successful network round trip. The server remains authoritative when local state is missing or stale. Existing saved report reopening remains allowed.

Additional regressions: `node --import tsx --test scripts/report-trial-paywall.test.ts` verifies setup/city/date paywall decisions, paid access and both cached-generation routes. The production smoke now creates a paid report, downgrades the disposable account and checks that both request-ID and daily-cache generation routes return HTTP 403. Color Match's 31 engine/service tests, release QA and TypeScript checks also pass.

These checks establish quota enforcement and the application's paywall triggers. Actual RevenueCat paywall presentation/purchase completion on iOS and Android is not exercised by server or unit tests; it should be verified on devices using a regular free account, including dismissal and reopening. PierCast remains behind the scientific release gate, so its public free-user flow cannot yet be exercised against real released city reports.
