# River Run Live Runtime Launch — 2026-08-07

## Live State

- Supabase project: `hsesngprhpgajyfbrwbf` (`FinFindr`)
- Edge Function: `river-run`, deployed and public-gated on
- Configuration source: version-controlled static catalog
- Refresh job: `river-run-hourly-refresh`, active at `17 * * * *`
- Public reports: 12
  - Pere Marquette: Fall Chinook, Fall Coho, Fall Steelhead
  - Betsie: Fall Chinook, Fall Coho, Fall Steelhead
  - Big Manistee: Fall Chinook, Fall Coho, Fall Steelhead
  - Muskegon: Fall Chinook, Fall Coho, Fall Steelhead
- St. Joseph Fall Steelhead: owner-gated and API-hidden

The existing App Store binary was not rebuilt as part of this launch. Test the
new client access behavior through the development client. A later production
build will carry the same committed client code to App Store Connect.

## Access Contract

- Catalog/setup browsing is available without a paid tier.
- Snapshot/report generation requires an authenticated `angler` or
  `master_angler` profile.
- Free users receive `403 subscription_required` from the Edge Function.
- The app presents the RevenueCat paywall only after a free user finishes setup
  and asks to generate the selected report.
- A successful purchase continues into the selected report.
- St. Joseph is presented as disabled/coming later in the Michigan Fall
  Steelhead river list and returns `403 river_run_hidden` if requested directly.

## Production Evidence

- 27 River Run migrations applied cleanly.
- 730 gauge baseline rows present.
- 59 Migration Timing baseline rows present.
- Protected refresh returned 12 targets and zero failures.
- 12 daily snapshots and 12 condition refreshes were created on the first warm.
- All 12 public reports returned HTTP 200 for a real production
  `master_angler` account.
- A temporary verified free account returned `403 subscription_required` and
  was deleted after the smoke test.
- St. Joseph returned `403 river_run_hidden`.
- Public catalog contained exactly the expected 12 reports.
- PM, Big Manistee, and Muskegon reads were Fresh.
- Betsie reads were Limited as designed because its sensor-dependent primitives
  are explicitly unavailable and its Activity read is weather-only.

## Local Acceptance Evidence

- River Run engine and endpoint tests: 299 passed, 0 failed.
- River Run UI QA: passed.
- River Run visual QA: passed across 85 generated states.
- TypeScript: passed.
- Production smoke: passed with paid and free access tokens.

## Testing Before The App Store Build

1. Start the normal live development client without review fixtures:

   ```bash
   npm run dev:live
   ```

2. With an active subscriber account:
   - Open River Migration.
   - Complete State → Season → Species → River.
   - Confirm all four live rivers are selectable for their three fall species.
   - Confirm the report opens without a paywall.
   - Pull to refresh and background/foreground the app.

3. With a free account:
   - Confirm every setup step remains browseable.
   - Confirm St. Joseph is visible but disabled for Michigan Fall Steelhead.
   - Select a live river and press the final report action.
   - Confirm the RevenueCat paywall appears before any report is fetched.
   - Dismiss it and confirm setup remains intact.

4. Complete or restore a subscription from that paywall:
   - Confirm the account tier synchronizes.
   - Confirm the selected report opens immediately.
   - Reopen River Migration and confirm later reports bypass the paywall.

5. Review Betsie explicitly:
   - Migration Stage, Fish In River, and weather-only Activity remain useful.
   - Migration Timing, Push, and Fishability show honest unavailable states.
   - No PM, Big Manistee, or Muskegon geography leaks into Betsie copy.

## Operational Checks

During the test period, periodically confirm:

- the cron job remains active;
- condition refresh timestamps advance at configured active/inactive slots;
- protected refreshes continue returning zero failures;
- public catalog remains exactly 12 reports;
- St. Joseph remains absent until its owner audit is explicitly accepted;
- RevenueCat webhooks and `sync-subscription-tier` keep profile tiers current.

