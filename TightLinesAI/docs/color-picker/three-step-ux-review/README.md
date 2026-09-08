# Three-step Color Match rebuild

Supersedes the open catalog experiment. The flow is now category → bait within that category → water clarity → generate. Category cards use one representative illustration (worm, spinnerbait, jerkbait, spoon, streamer). Each setup selection is explicit, highlighted blue over the artwork, with fixed Back/Continue navigation. Completed steps turn green. The bait catalog uses two columns and shows every bait in the chosen category, with no search field. Step indicators now copy the lure/fly recommender’s exact sizing, gold active badge, completed checkmark, JetBrains Mono labels and completed-step navigation. The bottom safe-area inset uses the same cream as the footer; the top status area retains navy. Report cards use gold ribbons, large color names, approximate palette panels and a gold-accented Why it fits section. Palette panels are color references, not bait-pattern illustrations or scores.

Report navigation now resolves missing route coordinates from the active Home environment/custom-location stores. Previously, the lure recommender's Color Match link supplied only a bait ID, leaving generation disabled. Coordinates supplied explicitly in the route retain priority. A new setup requires a clarity selection. Saved reports retain their stored clarity.

## Live generation — deployed and verified

A network probe originally returned HTTP 404 with `Requested function was not found`. After restoring CLI access, the migration list and dry run confirmed that `20260905120000_create_color_picker_reports.sql` was the only pending migration. It was applied, and `color-picker` was deployed to the configured project.

Gateway JWT verification is disabled (`supabase functions deploy color-picker --no-verify-jwt`); the handler authenticates the real user via `x-user-token`, matching the app's invocation scheme. An unauthenticated request now returns HTTP 401. An authenticated live smoke check using a disposable Angler account passed generation, identical-request replay, saved-report reopen and a fresh draw. Open-Meteo returned approximately 23.18% cloud cover for the test location, producing one sunny group of three distinct colors for a craw/creature bait in clear water: Green pumpkin, Black and Watermelon red flake. The test account and its reports were deleted afterward.

The client translates the missing-function error into a readable service-unavailable message while retaining the selections. It does not fabricate a successful report or substitute manual weather.

## Validation

- TypeScript passed.
- All 25 local engine/service tests passed, including all 138 bait/clarity/light cells.
- Browser flows at 390px and 320px: category is required; hard-bait catalog excludes soft worms; Jerkbait selection continues to explicit clarity; Clear generates the expected request using Home coordinates; report renders without runtime errors.
- Screenshots are browser previews with mocked weather/service responses. Live authenticated backend acceptance passed separately as described above; native-device visual acceptance remains pending.
