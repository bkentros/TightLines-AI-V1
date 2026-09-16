# Public location visibility and store build readiness — September 16, 2026

## Public coverage

- River Run production serves 23 distinct rivers and 72 distinct supported runs to anonymous clients. The app's selector reads this public catalog without a subscription filter. No River Run deployment or migration was required for this change.
- PierCast's public catalog now contains all 12 configured cities and their covered piers. The five previously released Lake Michigan cities retain public standings and reports. The seven Wisconsin and Lake Huron expansion cities appear as research previews; their scores, species configurations, and reports remain unavailable to ordinary users pending release review.
- `npm run smoke:public-location-visibility:production` is the read-only regression check for both public catalogs and PierCast's scored roster.

## Deployment and checks

- Deployed the `pier-cast` Edge Function to project `hsesngprhpgajyfbrwbf`. No database migration was needed.
- Production anonymous visibility check passed: 23 rivers, 72 runs, 12 cities, five scored cities, seven previews.
- PierCast foundation tests: 210 passed. V3 pass 2 checks: 44 passed. TypeScript: passed. iOS and Android Expo exports: passed.
- The account-level smoke check confirmed that a research-preview report returns `city_unavailable`, then stopped because the first released-city report returned `report_unavailable`. The latest complete archived LMHOFS cycle was issued at 06:00 UTC and was outside the 13-hour report freshness window at the time of the check. A direct NOAA LMHOFS audit returned HTTP 503 for the attempted cycles. The published daily leaderboard remained available. Re-run the account smoke check after NOAA service and scheduled ingestion recover.
- The broader River Run live-conditions smoke check stopped because Manitowoc currently has no usable live measurement. This did not affect River Run catalog visibility.
- The owner account's private v3 route returned `pier_cast_v3_outlook_unavailable`: the core, Wisconsin, and Lake Huron archives all had a complete 06:00 UTC issue, but no newer complete issue, so the shared 06:00 cycle aged past the 13-hour freshness limit. NOAA's live LMHOFS endpoint returned HTTP 503 during the check. The app now falls back to the public city catalog and standings, shows a review-availability notice, and retries the private review on refresh. A temporarily unavailable public leaderboard still leaves city discovery visible. Released-city report failures remain visible within the page instead of replacing all of PierCast.

## Store counters

- App version: `1.12` on both platforms. EAS uses remote version counters and `production.autoIncrement: true`.
- At the last EAS check, remote counters were iOS build `35` and Android version code `17`; the next production build should allocate iOS `36` and Android `18`. Recheck immediately before submission if another build is started elsewhere.
- No production build was started as part of this work.
