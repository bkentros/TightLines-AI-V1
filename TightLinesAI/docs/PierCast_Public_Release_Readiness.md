# PierCast public research release — 2026-09-13

**Owner-approved launch standard: research-based opportunity estimates, with clear limitations. No app build or submission was created.** This decision supersedes the earlier requirement to complete field/outcome validation before any public exposure; it does not confer scientific approval.

## Approved scope

| City | Species | Count |
|---|---|---:|
| Ludington | Chinook, coho, steelhead, brown trout, smallmouth, yellow perch | 6 |
| Grand Haven | Chinook, coho, steelhead, brown trout, freshwater drum, largemouth | 6 |
| Manistee | Chinook, coho, steelhead, brown trout, lake trout, smallmouth, drum, perch | 8 |
| Frankfort–Elberta | Chinook, coho, steelhead, brown trout | 4 |
| Sheboygan | Chinook, coho, steelhead, brown trout | 4 |

The seven covered structures, numeric seasonal curves, thermal profiles, formula and daily score locks are unchanged. The distinct `piercast-public-research-v1-2026-09-13` policy authorizes exactly roster v3. It rejects unknown cities, extra/missing species and unapproved roster-version changes. Unadmitted research candidates are not public reports.

## Customer disclosure

“Research-based opportunity ratings, not catch guarantees. Actual pier conditions may differ.”

This wording appears on the leaderboard and city reports. The rating explanation also states:

“Ratings combine published research with FinFindr's judgment about seasonal pier opportunity and temperature suitability. Season potential is a date-specific estimate interpolated from broader seasonal evidence; its displayed tenths help compare targets and are not daily measurements or catch probabilities. NOAA water temperatures are modeled estimates, not measurements at the pier; accuracy has not been verified at each covered pier. Evidence is stronger for some species and seasons than others.”

The public API includes disclosure and release-policy metadata. Scientific calibration/representation approvals remain unchanged. Public discovery does not expose numeric seasonal curves, and public city reports exclude additional research drafts. The disclosure communicates uncertainty; it is not a representation of legal immunity.

## Access and operations

- Public catalog: five cities, 28 admitted pairings, `public_research` release status.
- Leaderboard: top five headline ratings without species-report or temperature data, independent of subscription allowance and live conditions refresh.
- City report: authenticated; one lifetime free city/report day with same-day condition refresh. Another city or report day requires upgrade. Saved trial reports remain recoverable.
- Owner-review and validation endpoints remain owner-only.
- Public city reports still require a fresh complete model cycle and a published daily score snapshot. Data failures remain unavailable rather than inventing scores.
- Home, welcome, subscription and how-it-works availability match the approved public scope.

## Verification and remaining observation work

All 145 PierCast tests passed, including exact-roster public authorization and explicit compatibility with known earlier daily snapshots. Edge-function and app TypeScript checks passed. Production verification uses a disposable free account for catalog scope/disclosures, first city, same-city refresh, second-city denial, expired-day denial, saved recovery and independent daily leaderboard; it also checks Color Match lifetime/downgrade behavior and owner endpoint restrictions.

Field measurements and prospective fishing results remain useful post-launch validation. Production archives contained zero field-temperature observations and zero fishing outcomes/validation pairs at the readiness audit; no scientific validation results have been invented. Physical RevenueCat paywall presentation and purchase/restore on iOS/Android remain device QA; automated checks cover the application decisions and backend responses. No new production build is created by this work.

No schema or score-data migration is required: the policy changes serialization/access, not the archived daily score format or roster. Existing immutable snapshots remain intact.


## Final production verification

The approved research-release backend is deployed. Production smoke passed with a disposable account: five-city/28-pair catalog and disclosure, restricted owner review, first free city, same-city refresh, second-city and expired-day HTTP 403, saved recovery, and the full locked leaderboard. Paid five-city/five-day reports are checked separately by the same smoke script. Accounts created by the smoke are deleted in its cleanup step.

The first production check identified an older immutable roster in today's snapshot. The serializer now accepts explicitly known v1/v2 snapshots only when their species remain a subset of the approved v3 scope. It rejects unknown roster versions and arbitrary partial/expanded rosters. Today's scores and leaderboard remain unchanged; future dates use the complete current 28-pair roster. No historical snapshot was rewritten.

The database dry run reports up to date. No production app build, submission or OTA release was created. The checked-in app presents the approved disclosure and opens PierCast to regular accounts when run in a development client or a future build. Native purchase-sheet interaction remains device QA, not something the backend smoke simulates.
