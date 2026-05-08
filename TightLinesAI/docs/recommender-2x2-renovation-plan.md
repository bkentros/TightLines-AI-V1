# FinFindr Recommender 2x2 Renovation Plan

Created: 2026-05-08  
Status: completed renovation handoff for the live daily-picks 2x2 recommender  
Supersedes as product direction: the deleted 3:3 slot-filling rebuild, older v3 tuning plans, and older v4 "top three" selection assumptions

## Living Status

This file is a living handoff document. Future agents must update it as passes are completed or the architecture changes.

Current state:

- Pass 0 planning document is created.
- Pass 1 current-state audit is completed as a documentation-only pass.
- Pass 2 contract and cache foundation is completed.
- Pass 3 frontend four-step setup is completed.
- Pass 4A catalog tag schema foundation is completed.
- Pass 4B catalog semantic review is accepted after the Pass 4B.1 corrective compatibility pass.
- Pass 5A seasonal row renovation preflight audit is completed.
- Pass 5B trout surface fly row cleanup is completed.
- Pass 5C trout `baitfish_slider_fly` non-surface cleanup is completed.
- Pass 5D pike `tube_jig` seasonal row cleanup is repaired by Pass 5D.1.
- Pass 5E pike `woolly_bugger` seasonal row cleanup is completed.
- Pass 5F daily condition normalization and archived-day validation preflight is completed.
- Pass 6A DailyScenario contract/builder foundation is completed in a parallel future-engine path.
- Pass 6A.1 DailyScenario `current_swing` semantics correction is completed.
- Pass 6B parallel 2x2 hard-gated candidate pool and candidate scoring foundation is completed.
- Pass 6B.1 row/scenario identity invariants are completed.
- Pass 6C parallel 2x2 selector and variety layer is completed.
- Pass 6D parallel 2x2 assembly layer is completed.
- Pass 6E parallel 2x2 response shaping and copy layer is completed.
- Pass 6E.1 response-shaper copy consistency tightening is completed.
- Pass 6F parallel daily-picks surface adapter and exact seasonal row resolver is completed.
- Pass 6G parallel daily-picks session/refresh integration is completed.
- Pass 6H gated internal daily-picks preview path is completed.
- Pass 7A fixture-based internal daily-picks preview quality audit is completed.
- Pass 7B targeted daily-picks preview quality tuning is completed.
- Pass 7C narrow Big Fish `glidebait` bass inventory path is completed.
- Pass 8A app-side daily-picks 2x2 preview wiring is completed.
- Pass 8B final app-integration hardening is completed.
- Pass 8C deployment/device smoke readiness checklist is completed.
- Pass 8D operational deployment verification is completed.
- Pass 8E second-opinion UX/session hardening is completed.
- Pass 8E.1 stale frontend variant-cache correction is completed.
- Pass 8F backend default cutover to daily-picks 2x2 is completed.
- Pass 9A old 3:3 recommender deletion/quarantine preflight and first cleanup is completed.
- Pass 9B archival package-script, stale script, and old-doc cleanup is completed.
- Pass 9C final post-cleanup release verification, deployment, and smoke are completed.
- The production backend default now routes valid recommender requests to daily-picks 2x2. Pass 9A removed the old rebuild/v3 runtime modules, old daily-session/recent-history modules, old 3:3 response contracts, old rebuild/v3 behavior tests, old experimental v4 top-three engine/tests, and the unreachable frontend legacy 3:3 response branch. Daily-picks 2x2 is now the only active recommender engine in the app/backend path.
- Historical Pass 0-6 notes below preserve the renovation sequence. Where they mention "current rebuild", "parallel-only", or "not wired", read that language as the state at that pass, not the post-9C live state.
- Pass 1 created:
  - `docs/audits/recommender-2x2/current-runtime-map.md`
  - `docs/audits/recommender-2x2/catalog-profile-audit.md`
  - `docs/audits/recommender-2x2/seasonal-row-audit.md`
  - `docs/audits/recommender-2x2/removal-candidates.md`
- Pass 2 added goal-aware request/response contracts, frontend cache identity, server daily session identity, and a `recommender_daily_sessions.recommendation_goal` migration.
- Daily-picks 2x2 now uses `recommendation_goal` in scoring/session identity. Older notes that say the rebuild ignored `recommendation_goal` describe the pre-cutover engine.
- Pass 3 exposes `All Purpose` and `Big Fish` as the fourth setup step and sends the selected `recommendation_goal` with initial and second-opinion requests.
- Pass 4A added closed catalog `condition_tags` and `goal_tags` vocabularies, factory validation, conservative tags on all v4 lure/fly profiles, and catalog invariant tests. Current scoring/selection still ignores these tags.
- Pass 4B tightened some catalog eligibility and goal-tag semantics, added focused catalog assertions, and documented deferred inventory gaps at `docs/audits/recommender-2x2/catalog-semantic-review-pass4b.md`.
- Pass 4B.1 corrected the initial 4B overreach by restoring `ned_rig` trout eligibility, keeping `weightless_stick_worm` non-trout, restoring row-authored broad eligibility needed by current generated seasonal rows, and adding generated seasonal row/catalog compatibility coverage. Revisit restored broad eligibility during Pass 5 seasonal row renovation.
- Pass 5A created the seasonal row renovation preflight audit at `docs/audits/recommender-2x2/seasonal-row-renovation-preflight-pass5a.md`; no CSV, generated seasonal row, catalog, runtime, or test files were changed in Pass 5A.
- Pass 5B removed `popper_fly` and `deer_hair_slider` from trout seasonal `primary_fly_ids`, regenerated v4 seasonal rows, and left surface windows, `mouse_fly`, `small_floating_trout_plug`, `baitfish_slider_fly`, `unweighted_baitfish_streamer`, and `ned_rig` unchanged.
- Pass 5C removed `baitfish_slider_fly` from the 45 trout rows where `surface_seasonally_possible` is `false`, regenerated v4 seasonal rows, and left surface-row `baitfish_slider_fly`, `unweighted_baitfish_streamer`, `mouse_fly`, `small_floating_trout_plug`, `ned_rig`, and all catalog/runtime logic unchanged.
- Pass 5D removed `tube_jig` from all 216 northern pike seasonal rows, regenerated v4 seasonal rows, and preserved pike-first inventory including `pike_jig_and_plastic`, `pike_jerkbait`, `large_profile_pike_swimbait`, and `casting_spoon`.
- Pass 5D.1 repaired the pike river suppressive coverage blocker by adding pike-only `large_pike_tube` to the catalog and authoring it only into the 41 affected northern pike river bottom/mid slow/medium rows. `tube_jig` remains absent from pike rows.
- Pass 5D.2 partially prepared `large_pike_tube` visual support by adding the tackle-image manifest entry, but image generation failed because the OpenAI API account hit a billing hard limit. Brandon will generate images for all lures and flies near the end of the renovation, so missing `large_pike_tube.png` is deferred asset work rather than a blocker for continuing recommender logic passes.
- Pass 5E removed `woolly_bugger` from all 216 northern pike seasonal rows, regenerated v4 seasonal rows, and preserved pike-first fly inventory including `pike_bunny_streamer`, `large_articulated_pike_streamer`, and existing `pike_flash_fly` row usage.
- Steering clarification after Pass 5E: seasonal rows are gates, not the whole recommender brain. Seasonal cleanup should remove biologically false or padded inventory, but daily condition normalization must do much of the tactical ranking work inside those valid pools.
- Pass 5F created `docs/audits/recommender-2x2/daily-condition-normalization-preflight-pass5f.md`, mapping current weather/shared-condition inputs into a proposed `DailyScenario` contract, documenting current gaps, separating seasonal/daily/variety responsibilities, and outlining archived hourly-weather validation fixtures. No runtime, catalog, seasonal, frontend, migration, or test behavior changed.
- Pass 6A added `supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts` and focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/dailyScenario.test.ts`. The builder preserves request metadata and goal, maps shared condition analysis into explicit activity/light/wind/thermal/runoff/pressure modes, closes surface conservatively when wind is missing or conditions are suppressive, emits bounded catalog condition tags, and tracks missing inputs/confidence. It is not wired into the production 3:3 recommender path.
- Pass 6A.1 corrected DailyScenario `current_swing` semantics so freshwater river wind alone does not imply current opportunity. `current_swing` now requires river water movement from elevated/dirty or blown-out runoff, while trout `runoff_streamer` remains trout-specific.
- Steering clarification before Pass 6B: current catalog `clarity_strengths` should be treated as scoring fit, not a hard gate. Do not let clarity delete biologically valid row-authored candidates unless a future explicit "clarity impossible" field is deliberately added and tested.
- Pass 6B added `supabase/functions/_shared/recommenderEngine/dailyPicks/buildCandidatePool.ts`, `supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts`, and focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/candidatePoolAndScoring.test.ts`. The pool starts only from seasonal row-authored IDs, applies hard species/water/exclusion/column/pace/surface gates, does not hard-gate clarity, does not borrow fallback candidates, and does not call the current 3:3 selector. Scoring is pure and auditable, using DailyScenario condition tags, goal tags, clarity as a bonus only, forage, row baseline fit, and a small surface-caution penalty. It does not select final 2x2 picks yet and is not wired into production.
- Pass 6B.1 added `region_key` and `month` to `DailyScenario` and introduced a shared row/scenario identity invariant for both `buildCandidatePool` and direct `scoreCandidate` calls. Mismatched species, region, month, or water type now throw explicit errors instead of returning misleading empty pools or scores.
- Pass 6C added `supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts` and focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/selectDailyPicks.test.ts`. The selector chooses exactly two lures and two flies from already-scored candidates, never borrows rescue candidates, preserves intrinsic catalog profile data, throws explicit insufficient-candidate errors, uses deterministic seed/date/goal/variant rotation inside a quality band, supports future Set B `avoidIds`, and prefers honorable-mention diversity when scores are close. It is not wired into production and does not create response copy yet.
- Pass 6D added `supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts` and focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksEngine.test.ts`. The internal runner accepts an explicit seasonal row, builds `DailyScenario`, hard-gates row-authored candidates, scores every pooled lure/fly, selects the 2x2 picks, and returns diagnostics with authored/candidate counts, selected IDs, variant, avoid IDs, scenario tags, surface gate, missing inputs, and confidence. It does not resolve rows, mutate sessions/history, choose colors, generate public response copy, or wire into the production endpoint.
- Pass 6E added `supabase/functions/_shared/recommenderEngine/dailyPicks/shapeDailyPicksResponse.ts` and focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/shapeDailyPicksResponse.test.ts`. The shaper converts an internal daily-picks result into a future local 2x2 response shape with four named slots, scenario summary, diagnostics, score reasons, deterministic how-to-fish variants, and short factual why-chosen copy based only on goal fit, actual scenario-tag matches, forage, clarity, surface gate, and confidence/missing-input state. It does not replace current API contracts, choose colors, call old 3:3 copy/selector paths, or wire into production.
- Pass 6E.1 tightened `shapeDailyPicksResponse` so goal copy only uses score reasons that match `scenario.recommendation_goal`, preventing stale all-purpose/big-fish score reasons from leaking into copy. It also made `result.diagnostics.variant` the single source of truth for deterministic how-to-fish copy variant selection.
- Pass 6F added `supabase/functions/_shared/recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts`, `supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksSurface.ts`, and focused tests at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/runDailyPicksSurface.test.ts`. The resolver performs exact species/region/month/water lookup against generated v4 rows with no region fallback, month borrowing, state override, or `rebuild/**` dependency. The adapter accepts a `RecommenderRequest`, optional injected shared analysis, seed, variant, and avoid IDs, then runs analysis -> exact row -> daily-picks engine -> response shaper. It remains parallel-only and is not wired into the production endpoint or session layer.
- Pass 6G added `supabase/functions/recommender/dailyPicksSession.ts` and focused tests at `supabase/functions/recommender/dailyPicksSession.test.ts`. The future session layer uses the existing `recommender_daily_sessions` table shape with a distinct `recommender_daily_picks_2x2_sessionv1_goalv1` engine version, stores future 2x2 response JSON in variant A/B fields, adds local session metadata, keeps the key goal-aware, returns stable Set A, generates one Set B with A IDs passed as avoid IDs, locks after refresh, and handles create/refresh races by returning the stored row when possible. It is not wired into the production endpoint or production `dailySession.ts`.
- Pass 6H added a gated internal preview branch in `supabase/functions/recommender/index.ts` behind `x-recommender-preview: daily_picks_2x2`, plus focused coverage in `supabase/functions/recommender/index.test.ts`. The default no-header path still returns the production `recommender_rebuild` 3:3 response. The preview path runs after normal auth/subscription/body validation, uses the same validated `engineReq`, same `refresh_requested` semantics, same Supabase admin client and authenticated user ID, calls `resolveDailyPicksSession`, returns the future 2x2 response shape, does not write `recommender_recent_history`, and keeps sessions separate by the daily-picks engine version. CORS now allows `x-recommender-preview`.
- Pass 7A added fixture-based internal preview quality coverage at `supabase/functions/_shared/recommenderEngine/dailyPicks/__tests__/previewQualityFixtures.test.ts` and documented findings at `docs/audits/recommender-2x2/daily-picks-preview-quality-pass7a.md`. The audit exercises realistic archived-day-style scenarios through `runDailyPicksSurface`, asserts core invariants, confirms seasonal/daily surface gates and removed ID cleanup are respected, verifies goal-aware score reasons, checks missing-wind copy restraint, and records Set A/Set B selected IDs. No scoring, selector, catalog, seasonal, frontend, migration, or production cutover behavior changed.
- Pass 7B traced candidate scores for the Pass 7A trout runoff and pike suppressive river findings, then made two narrow catalog tag corrections in `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`: `sculpin_streamer` now carries `runoff_streamer`, and `pike_bunny_streamer` now carries `cold_slow`. The preview fixture tests now assert that trout elevated-runoff selects at least one fly with a real `condition_tag:runoff_streamer` reason and that pike suppressive river includes a pike-only fly. No seasonal rows, generated rows, global scoring weights, selector behavior, frontend code, migrations, production cutover path, or old 3:3 tuning changed.
- Pass 7C added `glidebait` to the v4 lure catalog and closed ID set as bass-only lake/pond Big Fish inventory: mid-column, slow/medium, clear/stained, baitfish/bluegill, `clear_subtle`/`open_water_search`/`cover_ambush`, and `big_fish_upside`/`high_risk_high_reward` only. It was authored into five narrow bass lake/pond seasonal rows (`largemouth_bass` Florida March/July and Great Lakes/Upper Midwest June; `smallmouth_bass` Great Lakes/Upper Midwest June/September), then generated seasonal rows were refreshed. Preview fixture coverage proves Big Fish can select `glidebait` with real big-fish score reasons, all-purpose does not choose it when reliable/versatile alternatives exist, dirty poor-fit conditions do not promote it, and northern March bass remains un-authored. No frontend, migrations, image assets, trout/pike rows, global scoring weights, selector behavior, production cutover path, or old 3:3 tuning changed.
- Pass 8A wired the app client into the gated daily-picks 2x2 preview path by sending `x-recommender-preview: daily_picks_2x2` from `fetchRecommendation`, moving frontend cache identity/validation to the daily-picks feature/version, and rendering the future response as exactly four cards: Lure of the Day, Honorable Mention Lure, Fly of the Day, and Honorable Mention Fly. The backend default remains gated for older app builds; the `recommendation_goal` migration remains a deployment prerequisite before this can go live.
- Pass 8B corrected the frontend `DailyPicksDiagnostics` mirror to the backend field names (`row_authored_lure_count` and `row_authored_fly_count`) and verified the existing `glidebait` image/mapping are present for shipping. Release order warning: apply the `recommendation_goal` Supabase migration first; deploy the edge function containing the daily-picks preview/session path before or with the app build; the app now expects the 2x2 preview response and rejects stale 3:3 responses.
- Pass 8C created the deployment/device smoke checklist at `docs/audits/recommender-2x2/pass8c-deployment-device-smoke.md`. Local readiness checks confirm the migration adds goal-aware session identity, the app sends `x-recommender-preview: daily_picks_2x2`, the edge function allows/routes that header to the daily-picks session path, and the frontend rejects stale 3:3 response shapes. Backend default cutover is not recommended yet; it is blocked until the `recommendation_goal` migration is applied remotely, the preview/session edge function is deployed before or with the app build, and Brandon completes the listed device smoke cases against the real table.
- Pass 8D verified the linked Supabase target as project `hsesngprhpgajyfbrwbf` (`TightLines AI V1`), applied and verified migration `20260508120000` on the remote V1 database, deployed the `recommender` edge function with the daily-picks preview/session path, and ran a real HTTP smoke against the deployed function using `x-recommender-preview: daily_picks_2x2`. The smoke verified four-pick response shape, All Purpose stable Set A, Set B refresh/lock, repeated refresh returning stored B, and Big Fish session separation. Backend default cutover is still not recommended until Brandon completes on-device app smoke against the deployed function.
- Pass 8E hardened the second-opinion product loop without backend default cutover. The daily-picks preview session now exposes `available_variants`, supports read-only `view_variant: "A" | "B"` retrieval, keeps Set A viewable after Set B exists, and validates invalid `view_variant` as `400 invalid_view_variant`. The app cache now stores daily-picks Set A and Set B separately by exact location/date/species/water type/water clarity/goal context, and the result page now shows a visible "Get one more second opinion for today" Set B CTA or a First Picks / Second Opinion toggle once both sets exist. Same-day tactical stability is guaranteed after the first session generation through server sessions and client forecast/recommender caches until location-local midnight; a first-ever request at different times can still reflect a newer forecast snapshot because no durable server-side weather snapshot is stored yet.
- Pass 8E.1 corrected stale frontend cache behavior for First Picks / Second Opinion toggling. Explicit `view_variant` requests now bypass local cache and read the stored server variant, then cache the fresh response, so Set A cannot return old `available_variants: ["A"]` metadata after Set B exists. No backend default cutover, scoring, selector, catalog, seasonal, migration, image, or layout behavior changed.
- Pass 8F changed `supabase/functions/recommender/index.ts` so normal no-preview requests route to `resolveDailyPicksSession` and return the daily-picks 2x2 response by default. The `x-recommender-preview: daily_picks_2x2` header remains backward-compatible but is no longer required. Default 2x2 requests preserve auth, subscription, validation, goal-aware session identity, Set A/Set B refresh semantics, `view_variant` reads, and no longer write `recommender_recent_history`. Pass 8F deployed `recommender` version `80` to project `hsesngprhpgajyfbrwbf` and real HTTP smoke passed for no-preview 2x2, preview compatibility, Set B refresh, stored Set A view, and Big Fish separation.
- Pass 9A removed active old-engine code in a staged cleanup and documented the result at `docs/audits/recommender-2x2/pass9a-old-engine-cleanup.md`. Remaining old-name references are limited to historical migrations/docs/scripts and negative assertions that stale 3:3 response fields are absent; no active app/backend import depends on the deleted old engine.
- Pass 9B removed broken package scripts for deleted recommender audit tooling, deleted stale v3/rebuild audit script folders and one-off scripts, deleted old v3/rebuild architecture/audit docs, updated the master handoff to describe daily-picks 2x2 as the live path, and documented the cleanup at `docs/audits/recommender-2x2/pass9b-archival-cleanup.md`. Remaining old-name references are limited to historical migrations, negative field-absence assertions, test fixture variable names, and current 2x2 docs that mention old systems as history.
- Pass 9C verified active image coverage for all 39 lure IDs and all 31 fly IDs, mapped `large_pike_tube` now that its PNG exists, confirmed no broken image mappings remain, confirmed no active app/backend/package/script imports depend on deleted v3/rebuild modules, deployed cleaned `recommender` version `81` to project `hsesngprhpgajyfbrwbf`, and passed real no-preview HTTP smoke for four-pick shape, Set A stability, Set B refresh/lock, stored Set A view, and Big Fish separation. Final readiness is documented at `docs/audits/recommender-2x2/pass9c-final-release-readiness.md`.
- Deployment prerequisite: the existing `recommendation_goal` daily-session migration (`supabase/migrations/20260508120000_add_recommendation_goal_to_recommender_daily_sessions.sql`) must be applied before either production or future daily-picks session keying can be relied on in a deployed environment.
- Final recommendation-quality audits should wait until the new 2x2 engine and normalized daily scenario layer exist.
- Next recommended step: hand off to fixture-driven quality audit/tuning against the live daily-picks 2x2 baseline.
- Release checklist item: active recommender image coverage is complete as of Pass 9C; preserve this invariant when adding future catalog IDs.
- Goal architecture clarification: Big Fish is not a separate engine and should not duplicate the full seasonal row matrix. It is a stricter goal-specific candidate lane inside the same 2x2 engine, using the same biological seasonal envelope plus honest catalog `goal_tags` and, only if needed, goal-specific allowed-ID fields inside a row.
- Master-agent takeover handoff now exists at `docs/recommender-2x2-master-agent-handoff.md`.

Update rules:

- At the end of every pass, update this `Living Status` section.
- Add or update audit files under `docs/audits/recommender-2x2/` as evidence is gathered.
- If implementation discovers that a planned rule is wrong, update this document instead of relying on chat history.
- Keep older docs marked as superseded unless they are fully removed in the cleanup pass.

## Brief Summary

The new recommender should become a deterministic **2x2 daily recommendation engine**:

- The setup flow becomes four steps: **species -> water type -> water clarity -> goal**.
- Goal is one of:
  - `all_purpose`: best chance at action, higher confidence, more versatile.
  - `big_fish`: lower-volume but higher-upside presentations, larger profile/ambush/reaction choices when biologically sensible.
- The output becomes exactly:
  - **Lure of the Day**
  - **Honorable Mention Lure**
  - **Fly of the Day**
  - **Honorable Mention Fly**
- Seasonal rows define the biological envelope for species, region, month, and water type.
- Lure/fly catalog profiles define each item truthfully: actual column, actual pace, species/water eligibility, clarity strengths, condition strengths, and goal fit.
- Hard gates remove invalid choices first.
- Daily conditions then rank the remaining biologically valid candidates.
- Variety is enforced through deterministic daily selection, recent-history penalties, presentation-group rotation, and a no-repeat guard so users do not see the same exact picks day after day when valid alternatives exist.
- The server keeps Set A stable for the day, allows exactly one **second opinion** Set B, then locks until location-local midnight.

The most important architectural change is this:

> The engine must select the best real lure/fly profiles for today. It must not invent abstract column/pace slots first and then force items into those slots.

This avoids credibility failures like a buzzbait being shown as `surface + slow`. A buzzbait may be a good pick on some LMB days, but its displayed profile must remain `surface + fast/medium`.

## Why This Renovation Exists

The current production recommender has useful foundations, but the middle of the engine is too fragile.

Good pieces worth keeping:

- Server-side deterministic computation.
- Supabase Edge function boundary with auth/subscription checks.
- State/species/water-type gating.
- Seasonal rows by species/region/month/water type.
- v4 lure/fly catalogs as the best current catalog base.
- How's Fishing score and normalized daily condition analysis.
- Mean daylight wind from local 5 AM to 9 PM.
- Server-authoritative daily sessions with Set A, one Set B refresh, and location-local midnight lock.
- Recent recommendation history.
- Existing lure/fly images and result-card UI assets.

Pieces that are causing product risk:

- The current rebuild creates three daily target profiles first, then tries to fill those slots.
- Adjacent pace matching lets items fill profiles they do not actually represent.
- The output displays the target profile's pace, not always the item's intrinsic presentation pace.
- The 3:3 requirement creates pressure to pad seasonal rows, add rescue pools, and accept weak fits.
- Variety logic is layered into slot filling instead of being a clear final selection rule.
- Some tests now protect "full 3:3" more strongly than they protect biological believability.

The buzzbait example proves the architecture problem:

- The catalog profile correctly treats `buzzbait` as a fast/medium surface bait.
- The Florida May LMB row can cause surface target profiles to become slow because slow surface specialists exist in the row.
- Adjacent compatibility then allows the buzzbait to fill a slow surface slot.
- The response maps the target pace onto the item, so the user sees a slow buzzbait.

This is not just a data typo. It is a separation-of-responsibilities failure.

## Non-Negotiable Product Goals

1. Recommendations must be biologically sensible for the selected species.
2. Recommendations must respect water type. Trout remains river-only.
3. Seasonal context must define what is realistic before daily conditions rank anything.
4. Daily conditions must strongly influence recommendations within the valid seasonal pool.
5. No factor such as forage, clarity, color, or variety may overpower biological validity.
6. Lure/fly profiles must never be rewritten by daily target slots.
7. The user must not receive the same exact picks every day when valid alternatives exist.
8. Variety must rotate IDs and presentation groups, not just copy text.
9. Set A must be stable for the local day.
10. The user gets exactly one second opinion Set B per day/context/goal.
11. Set B must differ from Set A when valid alternatives exist.
12. After Set B, the session locks until location-local midnight.
13. The engine should be simple enough that future agents can reason about it without tracing a scoring maze.
14. Unused old logic must be removed or clearly deprecated as the renovation progresses.
15. Regional/month seasonal truth must gate presentations before daily weather is considered. Example: March LMB topwater can be viable in Florida, but should generally not be viable for Michigan LMB until a later spring window such as May.
16. Daily condition inputs must be normalized into a small, explicit tactical scenario before item scoring. The recommender should not scatter raw weather interpretation across lure/fly scoring code.
17. Lure and fly profiles must be detailed enough to be biologically meaningful, but bounded enough to stay auditable. Add thoughtful tags, not a messy pile of one-off metadata.
18. Seasonal rows must not become overfit daily-decision tables. They should answer "is this presentation biologically credible in this region/month/water/species?" while the normalized daily scenario answers "which credible presentations rise today?"

## Current Runtime Map

Current production path:

- `supabase/functions/recommender/index.ts`
- `supabase/functions/_shared/recommenderEngine/runRecommenderRebuildSurface.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/runRecommenderRebuild.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts`
- `supabase/functions/recommender/dailySession.ts`

Current source data:

- `data/seasonal-matrix/*.csv`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/*.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`

Current frontend surfaces:

- `app/recommender.tsx`
- `components/fishing/RecommenderView.tsx`
- `lib/recommender.ts`
- `lib/recommenderContracts.ts`

Current daily session table:

- `public.recommender_daily_sessions`
- Current key includes user, local date, rounded location, state, region, species, water type, water clarity, and engine version.
- The new fourth-step goal must become part of the session/cache identity.

## Target Runtime Map

The final runtime should have one clear production path:

- `supabase/functions/recommender/index.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksSurface.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/runDailyPicksEngine.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/buildDailyScenario.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/buildCandidatePool.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/scoreCandidate.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/selectDailyPicks.ts`
- `supabase/functions/_shared/recommenderEngine/dailyPicks/copy.ts`

The directory name may change, but the concept should not: one engine path, candidate scoring, 2x2 output.

Current `rebuild/**` files should be removed or deprecated after the new path is live:

- `shapeProfiles.ts`
- `selectSide.ts`
- `conditionWindows.ts` as currently designed
- 3-slot tests that exist only to preserve 3:3 behavior
- output fields that only make sense for slot satisfaction, especially `source_slot_index`

## New User Flow

### Step 1: Species

Supported recommender species remain:

- Largemouth Bass
- Smallmouth Bass
- Northern Pike
- Trout

Frontend values remain the current public app values unless a separate cleanup is scheduled:

- `largemouth_bass`
- `smallmouth_bass`
- `pike_musky`
- `river_trout`

Backend internal mapping may continue to normalize:

- `pike_musky` -> `northern_pike`
- `river_trout` -> `trout`

### Step 2: Water Type

Supported water types:

- `freshwater_lake_pond`
- `freshwater_river`

Rules:

- LMB: lake/pond and river.
- SMB: lake/pond and river.
- Pike: lake/pond and river.
- Trout: river only.

### Step 3: Water Clarity

Supported clarity values:

- `clear`
- `stained`
- `dirty`

Frontend may keep showing `Murky` for `dirty`, but engine value remains `dirty`.

Clarity should influence picks but should not dominate the whole engine. Dirty water can help vibration/profile picks. Clear water can help subtle/natural picks. Clarity alone should not resurrect an invalid seasonal bait.

### Step 4: Goal

New input:

```ts
export type RecommendationGoal = "all_purpose" | "big_fish";
```

Labels:

- `all_purpose`: "All Purpose"
- `big_fish`: "Big Fish"

Product meaning:

- `all_purpose` favors confidence, action, versatility, and practical fishability.
- `big_fish` favors higher-upside profile, ambush/cover/reaction opportunities, larger meals, and lower-volume choices when the biological context supports them.

Goal is not a separate species model and not a separate engine. It is a stricter candidate lane inside the same 2x2 engine.

Goal architecture rules:

- Seasonal rows still define the biological envelope: species, region, month, water type, surface window, column range, pace range, forage, and seasonally valid IDs.
- Big Fish must never bypass seasonal biology. A glidebait, big swimbait, mouse, frog, large pike streamer, or other high-upside profile is still eligible only when the row and hard gates make that presentation seasonally credible.
- Big Fish should not be implemented by duplicating every seasonal row into a second matrix. Duplicated rows would drift and make biology harder to audit.
- Big Fish does need a distinct candidate pool. Some all-purpose items can also be big-fish items, but many reliable action baits should not rank in Big Fish, and some high-upside items should not appear in All Purpose except as an explicit fallback.
- The preferred implementation is: one biological seasonal row, truthful catalog `goal_tags`, and goal-aware hard-gate/scoring rules. If catalog tags are not enough for row-specific control, add explicit goal-specific allowed-ID fields inside the same seasonal row rather than a separate engine.
- New Big Fish inventory such as a glidebait-style profile is appropriate when it represents a real missing presentation. It should be tagged and row-authored only where its species, water type, month/region, column, pace, and conditions are defensible.

## New Request Contract

Backend request should add:

```ts
recommendation_goal: "all_purpose" | "big_fish";
```

Validation rules:

- Required from frontend after the UI is updated.
- During rollout only, backend may default missing value to `all_purpose` for older clients.
- After app migration is complete, missing value should return `400 invalid_goal`.

Cache and session rules:

- `recommendation_goal` must be included in the client cache key.
- `recommendation_goal` must be included in the server daily session key.
- Engine version must be bumped.

Suggested new version:

```ts
export const RECOMMENDER_DAILY_SESSION_ENGINE_VERSION =
  "recommender_daily_picks_goalv1";
```

## New Response Contract

Prefer keeping arrays for low frontend churn, but they must now be exactly length 2 per side:

```ts
export type RankedRecommendation = {
  id: string;
  display_name: string;
  family_group: string;
  presentation_group?: string; // optional public/debug field; keep private if UI does not need it
  color_style: string;
  why_chosen: string;
  how_to_fish: string;
  primary_column: TacticalColumn;
  pace: TacticalPace;
  secondary_pace?: TacticalPace;
  presence: TacticalPresence;
  is_surface: boolean;
  rank_role: "top_pick" | "honorable_mention";
};
```

Response:

```ts
export type RecommenderResponse = {
  feature: "recommender_daily_picks";
  species: SpeciesGroup;
  context: EngineContext;
  water_clarity: WaterClarity;
  recommendation_goal: RecommendationGoal;
  generated_at: string;
  cache_expires_at: string;
  recommendation_session: {
    local_date: string;
    variant: "A" | "B";
    can_refresh: boolean;
    refreshes_remaining: 0 | 1;
    locked_until: string;
  };
  summary: RecommenderSessionSummary;
  lure_recommendations: [RankedRecommendation, RankedRecommendation];
  fly_recommendations: [RankedRecommendation, RankedRecommendation];
};
```

Important:

- Remove or stop emitting `source_slot_index`.
- Do not expose target slot pace.
- Display actual item pace and column.
- If an item has a secondary pace, UI may show `Fast / Medium` or keep the main pace plus copy details.

## New Summary Contract

Summary should describe today's scenario, not a forced target profile:

```ts
export type RecommenderSessionSummary = {
  monthly_forage: {
    primary: ForageMode;
    secondary?: ForageMode;
  };
  session_color_theme_label?: string;
  monthly_baseline: {
    allowed_columns: TacticalColumn[];
    allowed_paces: TacticalPace[];
    surface_seasonally_possible: boolean;
  };
  daily_scenario: {
    regime: "suppressive" | "neutral" | "aggressive";
    surface_state: "closed" | "open" | "prime";
    wind_band: "calm" | "breezy" | "windy";
    clarity_light_mode:
      | "clear_bright"
      | "clear_low_light"
      | "stained_or_dirty_bright"
      | "stained_or_dirty_low_light"
      | "mixed_or_unknown";
    thermal_mode:
      | "cold_limited"
      | "heat_limited"
      | "warming"
      | "cooling_or_shock"
      | "stable_or_unknown";
    runoff_mode:
      | "clear_or_stable"
      | "elevated_or_dirty"
      | "blown_out"
      | "unknown";
    recommendation_goal: RecommendationGoal;
    daylight_wind_mph: number;
  };
};
```

The frontend can render a small "Today's read" section from this summary without claiming that every pick is forced into the same preferred column/pace.

## Item Catalog Philosophy

The item catalog must represent true lure/fly identity.

An item profile answers:

- What is this lure/fly?
- Which species is it honestly good for?
- Which water types can it reasonably be used in?
- Where does it fish in the water column?
- What is its real pace?
- What daily scenarios make it better?
- What goal does it serve?

An item profile must not answer:

- Which abstract slot should it fill today?
- How do we rescue a thin pool?
- How do we force every row to produce three picks?

The profiles need to be more detailed than the current catalog, but the detail must be disciplined. A profile should capture durable fishing truth, not every situation where an angler has ever caught a fish on that bait.

Steering clarification from 2026-05-08:

- `condition_tags` must describe what the lure/fly is designed to do and when its mechanics actually improve. They are not generic weather labels and not coverage padding.
- Species and water-type eligibility must be biologically defensible for this product, not merely possible in an edge-case anecdote.
- Big Fish mode should use existing high-upside profiles where appropriate, but the catalog may add new archetypes when a true big-fish inventory gap is proven. A glidebait-style archetype is a likely review candidate for bass and possibly pike contexts.
- Do not add a new archetype just because a seasonal row is thin. Add one only when it represents a major, credible presentation missing from the catalog.

Good profile detail:

- True water column and pace.
- Species and water-type suitability.
- Clarity strengths.
- Condition strengths such as wind reaction, clear subtle, runoff streamer, calm surface, or cover ambush.
- Goal fit such as reliable action or big-fish upside.
- Presentation group for variety.

Bad profile detail:

- Huge lists of hyper-specific exceptions.
- Tags added only because a row is thin.
- Broad species eligibility just to make coverage pass.
- Treating a lure as a different lure in different weather.
- Letting a daily scenario rewrite the item's real pace or column.

## Target Item Profile Shape

Start from `ArchetypeProfileV4`, but audit and extend conservatively.

Suggested shape:

```ts
export type RecommendationGoal = "all_purpose" | "big_fish";

export type ConditionTag =
  | "calm_surface"
  | "low_light_surface"
  | "wind_reaction"
  | "dirty_vibration"
  | "clear_subtle"
  | "cold_slow"
  | "warming_search"
  | "heat_finesse"
  | "runoff_streamer"
  | "current_swing"
  | "cover_ambush"
  | "open_water_search";

export type GoalTag =
  | "reliable_action"
  | "versatile_search"
  | "big_fish_upside"
  | "high_risk_high_reward";

export type ArchetypeProfile = {
  id: string;
  display_name: string;
  gear_mode: "lure" | "fly";
  species_allowed: readonly RecommenderSpecies[];
  water_types_allowed: readonly EngineContext[];
  family_group: string;
  presentation_group: string;
  column: TacticalColumn;
  primary_pace: TacticalPace;
  secondary_pace?: TacticalPace;
  forage_tags: readonly ForageBucket[];
  clarity_strengths: readonly WaterClarity[];
  condition_tags: readonly ConditionTag[];
  goal_tags: readonly GoalTag[];
  is_surface: boolean;
  how_to_fish_variants: readonly [string, string, string];
};
```

Do not add dozens of micro-fields. The point is a small, inspectable catalog.

### Catalog Invariants

Every catalog item must satisfy:

- One primary column.
- One primary pace.
- At most one secondary pace.
- Surface items must have `column: "surface"` and `is_surface: true`.
- Non-surface items must have `is_surface: false`.
- `presentation_group` must be specific enough for real variety.
- `family_group` and `presentation_group` must not be abused to fake diversity.
- `goal_tags` must be biologically honest.
- `condition_tags` must be limited to the approved set.
- No item may exist only to pad a pool.
- Every condition tag must be defensible for that lure/fly's actual mechanics.
- Every goal tag must be defensible for that species and presentation style.
- If a tag is only true for one species, region, or month, prefer putting that control in the seasonal row instead of making the global catalog too broad.

### Catalog Authoring Rubric

Future agents should audit every lure/fly with these questions:

1. What species does this truly belong to in this product?
2. Which water types does it truly belong to?
3. What is the primary water column where this presentation actually fishes?
4. What is the primary pace?
5. Is there one honest secondary pace, or would that make the profile too loose?
6. Which clarity states does it genuinely handle well?
7. Which daily scenarios mechanically improve it?
8. Is it reliable action, big-fish upside, or both depending species?
9. Does its presentation group create real variety, or is it just a renamed duplicate?
10. Would an experienced angler call this recommendation credible in the row where it appears?
11. For `big_fish`, is this actually a higher-upside profile, or merely a normal bait made louder/larger by scoring?
12. If this profile is broad across species, is that breadth biologically intentional or old 3:3 coverage residue?

If the answer to question 10 is no, fix the profile or the seasonal row before tuning scores.

### Immediate Catalog Fixes To Verify

These are not the only required fixes, but they are known risk areas:

- `buzzbait`: surface, fast primary, medium secondary, wind should not be "high wind friendly"; good dirty/stained, active warm bass/pike contexts. Should never display slow.
- `hollow_body_frog`: surface, slow/medium, cover/ambush/big-fish upside, warm vegetation/cover contexts, not generic every-surface-day filler.
- `walking_topwater`: surface, medium/fast, low wind/low light/open-water or edge surface conditions.
- `popping_topwater`: surface, medium/slow, low wind/targeted surface, stained/clear depending species.
- `spinnerbait`: upper or mid depending current catalog decision, medium/fast, wind reaction, stained/dirty, all-purpose and big-fish depending species.
- `bladed_jig`: mid, medium, dirty vibration, wind/stained, LMB all-purpose/big-fish.
- `lipless_crankbait`: mid/upper, medium/fast, search/reaction, grass/flats/cool-to-warm transitions where seasonal row allows it.
- `weightless_stick_worm`: upper, medium/slow, all-purpose, not a fast aggressive search bait.
- Trout lure-side finesse: do not allow stick worms for trout, but a small `ned_rig` profile can remain credible for trout river bottom/suppressed/cold-slow contexts when seasonal rows allow it.
- `compact_flipping_jig`: bottom, slow, cover ambush, big-fish upside.
- Trout `mouse_fly`: surface, slow/medium, summer low-light big-fish upside, not a generic trout surface recommendation.
- Trout sculpin/articulated streamers: strong in elevated runoff, low light, big-fish mode, colder/fall windows when row allows.

## Seasonal Row Philosophy

Seasonal rows should define the biologically possible context for:

- species
- region
- month
- water type

Rows should not be padded to support 3:3. With the new 2:2 product, we can be more honest.

Rows should define:

- legal column range
- baseline column
- legal pace range
- baseline pace
- primary forage
- optional secondary forage
- surface seasonally possible
- seasonally allowed lure IDs
- seasonally allowed fly IDs
- optional excluded IDs only if needed

The existing `primary_lure_ids` and `primary_fly_ids` can be reused physically, but the concept should be renamed in code/comments to **seasonal allowed IDs**. They are not "top picks" and not slot sources.

Seasonal rows are also the first line of defense for regional timing. A bait may be globally valid for a species but still seasonally wrong in a specific region/month.

Rows should primarily express seasonal presentation reality rather than arbitrary forever-bans on individual lures. A row can say that surface is seasonally possible in Florida LMB March, that bottom/slow is the dominant northern early-spring envelope, or that river current/streamer presentations are realistic for a trout window. It should not encode a blanket idea like "this lure can never work in this state" unless the catalog/species/water relationship is truly invalid.

The row's ID lists are still useful, but their meaning is curated seasonal inventory inside the envelope. They can omit or exclude specific IDs when the item is biologically wrong for that species, water type, month, or regional pattern. The key distinction is:

- Good row logic: "topwater is not seasonally allowed here yet", "bottom contact is the baseline", "vegetation/cover surface options belong in this warmwater window", or "large streamer opportunities are realistic in this runoff/fall trout window."
- Bad row logic: "we need to ban or add individual items only to force today's four cards to fill."

Example:

- Largemouth topwater in March can be viable in Florida because warming trends, spawning/postspawn timing, shallow vegetation, and year-round warmwater behavior can support it.
- Largemouth topwater in March should generally not be viable in Michigan because water temperatures and seasonal fish position are usually too early/cold. For that region, topwater should likely wait until a later spring window such as May, depending the row audit.

This distinction belongs primarily in the seasonal rows, not in ad hoc daily scoring. Daily conditions can open or close a seasonally valid surface opportunity, but they should not create a regionally impossible surface season.

### Seasonal Gates

Rows should act as hard seasonal gates for:

- Whether true surface is seasonally possible.
- Which surface archetypes are seasonally allowed.
- Whether fast search baits are seasonally realistic.
- Whether cold-water bottom/slow tools should dominate.
- Whether river current/streamer options are realistic.
- Whether warmwater vegetation/cover tools are realistic.
- Whether big-fish surface/topwater options belong in that month and region.

Surface has two layers:

1. **Seasonal surface gate:** controlled by species, region, month, and water type.
2. **Daily surface gate:** controlled by wind, regime, light, and other daily conditions.

Both must be open for a true surface recommendation to appear.

Do not let a warm sunny day in a cold-region March row resurrect surface if the seasonal row says surface is not biologically credible.

Also do not make seasonal rows carry every daily tactical decision. A row can say topwater, bottom contact, cold/slow, or streamer inventory is seasonally allowed or important; it should not try to predict today's exact wind/light/thermal/runoff outcome. That ranking belongs in the daily scenario layer.

## Seasonal Row Audit Rules

Every supported row must be audited for biological truth:

- Does the row fit that species in that region and month?
- Is surface truly seasonally possible?
- Is the column baseline realistic?
- Is the pace baseline realistic?
- Are slow/medium/fast ranges too wide?
- Are bottom/mid/upper/surface ranges too wide?
- Are lure IDs included because they are biologically realistic, or because the old engine needed pool padding?
- Are fly IDs honest for that species/water/month?
- Is forage too strong, too generic, or wrong?
- Are pike and trout rows being treated too much like bass rows?
- Is each surface lure/fly regionally and monthly credible, not just species-legal?
- Is surface seasonality different enough between southern and northern regions?
- Are early spring, late fall, winter, heat-stress summer, and runoff windows represented honestly?
- Does big-fish mode have enough valid seasonal inventory without making every aggressive bait seasonally available?

If a row cannot honestly produce 2 lure candidates and 2 fly candidates for common daily states, fix data or catalog before adding engine exceptions.

## Daily Scenario Layer

Daily scenario should be small and explicit.

Inputs:

- How's Fishing score.
- Mean daylight wind mph from local 5 AM to 9 PM.
- Water clarity from user.
- Light/cloud mode from normalized condition analysis.
- Temperature band/trend/shock from normalized condition analysis.
- Runoff/flow disruption from normalized condition analysis.
- Species.
- Water type.
- Month.
- Goal.

Daily inputs must be normalized before scoring. The candidate scorer should receive tactical labels, not a scattered collection of raw weather values.

The engine should build one normalized daily scenario object, then score every lure/fly against that object. This keeps the system simple and prevents hidden weather logic from spreading throughout the codebase.

The daily scenario layer is also where much of the variety should come from. Similar seasonal rows should still produce different strong recommendations when wind, light, temperature trend, runoff/flow, water clarity, and goal differ. Across similar-condition days, the variety system should rotate among high-quality alternatives without breaking biological gates.

### Normalized Daily Condition Contract

The daily scenario should normalize raw/upstream condition data into stable labels:

```ts
export type DailyActivityLevel =
  | "suppressed"
  | "neutral"
  | "active"
  | "high_opportunity";

export type DailySurfaceGate =
  | "closed"
  | "caution"
  | "open";

export type DailyLightMode =
  | "low_light"
  | "mixed"
  | "bright"
  | "glare"
  | "unknown";

export type DailyWindMode =
  | "calm"
  | "breezy"
  | "windy"
  | "unknown";

export type DailyThermalMode =
  | "cold_slow"
  | "warming"
  | "stable"
  | "cooling_or_shock"
  | "heat_limited"
  | "unknown";

export type DailyWaterMovementMode =
  | "stable"
  | "elevated_or_dirty"
  | "blown_out"
  | "not_applicable"
  | "unknown";

export type DailyScenario = {
  local_date: string;
  local_timezone: string;
  species: RecommenderV4Species;
  water_type: EngineContext;
  water_clarity: WaterClarity;
  recommendation_goal: RecommendationGoal;
  hows_score: number;
  activity_level: DailyActivityLevel;
  surface_daily_gate: DailySurfaceGate;
  surface_daily_reason_codes: string[];
  light_mode: DailyLightMode;
  wind_mode: DailyWindMode;
  daylight_wind_mph: number | null;
  thermal_mode: DailyThermalMode;
  water_movement_mode: DailyWaterMovementMode;
  pressure_mode: "falling" | "stable" | "rising" | "unstable" | "unknown";
  scenario_tags: readonly DailyScenarioTag[];
  missing_inputs: readonly string[];
  confidence: "high" | "medium" | "low";
};
```

Scoring should use this object only. If a future agent needs a new daily behavior, add a normalized label or tag first, then score against it deliberately.

The Pass 5F audit at `docs/audits/recommender-2x2/daily-condition-normalization-preflight-pass5f.md` is the current source of truth for mapping existing weather/shared-condition fields into this contract.

### Regime

Keep current thresholds unless a separate calibration pass changes them, but expose them as `activity_level` in the new scenario:

- `score <= 35`: `suppressed`.
- `score >= 70`: `active` or `high_opportunity` if core data confidence is strong.
- otherwise: `neutral`.

### Wind Bands

Suggested initial bands:

- `calm`: `< 6 mph`
- `breezy`: `6-14 mph`
- `windy`: `> 14 mph`

Surface gate:

- If mean daylight wind is `> 14 mph`, true surface is closed.
- If wind data is missing or untrustworthy, close surface rather than opening it.
- If surface is seasonally impossible, surface is closed.
- If regime is suppressive, surface should generally be closed unless a future species-specific exception is deliberately authored and tested. Initial renovation should keep it closed.
- If the seasonal row does not include a given surface archetype, daily conditions cannot add it back.
- If the seasonal row says surface is false, daily conditions cannot add any true surface bait/fly back.

Daily surface gate:

- `closed`: surface candidates are hard-gated out.
- `caution`: surface candidates are legal only if the seasonal row/catalog fit is strong and non-surface alternatives are not clearly better.
- `open`: surface candidates may score normally or receive tag boosts such as `calm_surface` or `low_light_surface`.

### Daily Scenario Tags

The daily scenario should produce a small set of active tags used by scoring:

- `calm_surface`
- `low_light_surface`
- `wind_reaction`
- `dirty_vibration`
- `clear_subtle`
- `cold_slow`
- `warming_search`
- `heat_finesse`
- `runoff_streamer`
- `current_swing`
- `cover_ambush`
- `open_water_search`

Do not create dozens of weather-specific tags. Keep the engine auditable.

### Archived-Day Validation Direction

Full recommendation-quality audits should not be treated as final until the 2x2 engine, daily scenario normalization, and variety layer exist. Auditing the current 3:3 rebuild output would mostly validate the system being replaced.

Before engine cutover, create an archived-day validation plan that uses fixed historical scenarios:

- Species, region, water type, clarity, goal, date, and location fixtures.
- Hourly weather snapshots when available, especially wind, cloud/light, precipitation, pressure/front signals, temperature trend, and runoff/flow proxies.
- Multiple days with similar seasonal context but different daily conditions, proving daily scenario labels change picks.
- Multiple days with very similar conditions, proving variety rotates among valid alternatives instead of repeating the same exact set.
- Expected qualitative outcomes, not brittle exact-ID assertions at first. Example: cold suppressive pike river should lean slow/bottom/ambush; windy stained bass lake should favor reaction/vibration within the seasonal pool; clear bright trout river should lean subtle/deeper unless a seasonal and daily surface window is truly open.

Do not fetch live external archive data during ordinary row cleanup. Historical weather source selection and API behavior should be verified separately when the replay harness is actually built.

These tags should be treated as boosts inside the valid seasonal pool. They are not eligibility permission slips.

## Candidate Pipeline

The new engine should follow this exact order.

### 1. Resolve Scope

Resolve:

- frontend species -> internal species
- state/species/context validity
- region
- month
- local date
- timezone
- water clarity
- recommendation goal

### 2. Resolve Seasonal Row

Load exactly one row.

No fallback borrowing from another region.
No fallback borrowing from another month.
No hidden state override layer unless it is explicitly part of the supported data model.

### 3. Build Daily Scenario

Build daily scenario from normalized conditions.

This scenario is shared by lure and fly scoring, with species-specific interpretation in scoring.

### 4. Build Hard-Gated Pool

For each side (`lure`, `fly`), start from catalog and keep only candidates where:

- gear mode matches side
- species allowed includes internal species
- water type allowed includes context
- seasonal row allowed IDs includes candidate ID
- candidate is not row-excluded
- surface candidate is removed when surface is closed
- trout lake/pond never reaches this point
- candidate's seasonally relevant presentation is credible for the row's region/month
- daily scenario does not contradict a hard seasonal rule

Current catalog `clarity_strengths` are strengths, not an impossibility list. Use them in scoring; do not hard-gate candidates on clarity in the initial 2x2 engine.

Hard gates should be boring and conservative.

Hard gates should answer "can this be recommended at all?" Scoring should answer "how good is it today?"

### 5. Score Candidates

Score only hard-gated candidates.

The score should be simple enough to inspect in traces.

Suggested initial scoring ranges:

| Factor | Range | Notes |
|---|---:|---|
| Regime/pace fit | -18 to +24 | Primary daily driver. Suppressive rewards slow/subtle, aggressive rewards medium/fast/search/reaction. |
| Daily scenario tag fit | 0 to +28 | Wind reaction, surface prime, dirty vibration, clear subtle, runoff streamer, cold slow, etc. |
| Goal fit | -8 to +24 | Big fish boosts high-upside; all-purpose boosts reliable/versatile. |
| Seasonal baseline fit | 0 to +14 | Column/pace close to row baseline, but not overpowering. |
| Clarity fit | 0 to +12 | Helpful but bounded. |
| Forage fit | 0 to +10 | Helpful, never dominant. |
| Species confidence | 0 to +12 | Small species-specific confidence nudges only where needed. |
| Recent ID penalty | -40 | Applied after quality scoring or as selection constraint. |
| Recent presentation penalty | -20 | Applied after quality scoring or as selection constraint. |

Important:

- Forage must not overpower daily conditions.
- Clarity must not overpower regime, wind, surface, or goal.
- Variety must not select weak biological fits.
- A low-fit candidate should not beat a strong candidate just because it is different.

### 6. Build Quality Bands

After scoring a side:

- Sort by score descending.
- Pass 6C initial implementation defines the top quality band as candidates within 18 points of the best score, with deterministic top-pick jitter capped at 8 points.
- Pass 6C initial implementation defines the honorable band as candidates within 24 points of the best remaining score, with deterministic honorable jitter capped at 4 points and a bounded diversity bonus.
- Apply variety selection inside these bands.

This lets the engine vary picks without falling into bad recommendations.

### 7. Select Top Pick

For each side:

- Choose from top quality band.
- Prefer candidates not shown recently.
- Prefer candidates whose presentation group has not appeared too often recently.
- Use deterministic seeded choice, not runtime randomness.
- Seed must include user ID, local date, rounded location, species, context, clarity, goal, side, and variant.

### 8. Select Honorable Mention

For each side:

- Choose from honorable band.
- Must not duplicate top pick ID.
- Must use a different presentation group when alternatives exist.
- Prefer a different family group when alternatives exist.
- Should complement the top pick.
- Should not be a worse copy of the same approach.

Examples:

- If LMB top pick is `spinnerbait`, honorable could be `compact_flipping_jig`, `weightless_stick_worm`, `bladed_jig`, or `buzzbait` depending scenario, but avoid another spinner/vibration bait if a better complementary option exists.
- If trout top fly is `sculpin_streamer`, honorable could be `woolly_bugger`, `slim_minnow_streamer`, or `mouse_fly` depending conditions, but avoid two bulky articulated streamers unless big-fish/runoff scenario strongly supports it and alternatives are weak.

### 9. Validate Final Set

Final response must have:

- 2 lures.
- 2 flies.
- No duplicate IDs.
- No surface picks when surface is closed.
- Item displayed column equals catalog column.
- Item displayed pace equals catalog primary pace.
- Optional secondary pace comes from catalog only.
- At least one top/honorable presentation distinction per side when alternatives exist.

If a row cannot produce this, fail tests and fix data/catalog. Do not add rescue logic that returns nonsense.

## Variety Requirements

Variety is a core feature, not decoration.

The user should not feel like the app recommends the same lure every time the weather is similar.

### Variety Invariants

1. Same user/context/goal/date gets stable Set A.
2. Same user/context/goal/date gets at most one Set B.
3. Set B must differ from Set A when alternatives exist.
4. Exact same 2x2 set must not repeat on consecutive days when alternatives exist.
5. The same top pick should not appear more than two eligible days in a row when alternatives exist.
6. The same presentation group should be penalized after appearing recently.
7. Variety may only choose inside quality bands.
8. Variety may not override hard gates.
9. Variety may not choose biologically weak candidates just to be novel.

### Recent History Window

Suggested:

- ID-level recent window: 7 days.
- Presentation-group recent window: 7 days.
- Family-group soft penalty: 3 days.

History records should include:

- user ID
- local date
- species
- region
- water type
- water clarity
- recommendation goal
- variant
- side
- archetype ID
- presentation group
- family group
- rank role

### Deterministic Rotation

The seed should change every local date, but stability should remain inside a local date.

Seed components:

```txt
user_id
local_date
lat_key
lon_key
state_code
region_key
species
water_type
water_clarity
recommendation_goal
variant
side
rank_role
engine_version
```

Do not include volatile request time.

### No-Repeat Guard

After selecting the full 2x2 set:

- Load previous local day's 2x2 set for same user/species/region/water type/clarity/goal.
- If today's exact set equals yesterday's exact set and alternatives exist inside quality bands, swap the honorable mention first.
- If still identical and top-pick alternatives exist inside quality band, swap one top pick.
- If still identical because pools are genuinely too thin, emit a diagnostic and create an audit failure for that row/context.

This guard is critical. It turns "variety is preferred" into "repetition is treated as a bug unless inventory is truly too narrow."

### Set B Second Opinion

The button should say:

```txt
GET SECOND OPINION
```

Set B generation rules:

- Only available while active variant is A and refreshes used is 0.
- Does not spend refresh if the first request of the day includes refresh accidentally; existing behavior should remain.
- Generate using variant `B`.
- Add Set A picks into temporary avoid history.
- Try to differ by at least:
  - 1 lure ID
  - 1 fly ID
  - preferably one top pick if alternatives are high quality
- If full difference is impossible, return the best distinct set possible and emit diagnostics.
- Once Set B is claimed, persist B and lock until midnight.

## Species-Specific Biological Guidance

These are starting rules for auditing profiles and scoring. They are not meant to become huge special-case code. Prefer tags and simple scoring.

### Largemouth Bass

Core behavior:

- Cover, edges, ambush, vegetation, docks, wood, grass, pads, bluegill/perch, shad/baitfish, crawfish.
- In warm months, surface can be excellent under low wind/low light and around cover.
- Dirty/stained water often favors vibration, displacement, profile, and slower target presentations.
- Clear/bright and suppressive days often favor subtle plastics, jigs, jerkbaits, or slower controlled looks.

All-purpose tendencies:

- Weightless stick worm, swim jig, spinnerbait, bladed jig, squarebill, paddle tail, shaky head, Texas-rig craw, finesse/compact jig depending season.

Big-fish tendencies:

- Compact/flipping jig, frog, buzzbait in right conditions, spinnerbait, bladed jig, larger swimbait where catalog supports it, Texas-rig craw, big surface/ambush choices.

Important:

- Buzzbait is not slow.
- Frog is not a generic open-water topwater.
- Dirty water should help vibration/profile, but not force topwater if wind/surface state is poor.

### Smallmouth Bass

Core behavior:

- Rock, current, points, flats, baitfish/crawfish, clearer water bias, current breaks in rivers.
- Often responds well to tubes, Ned rigs, hair jigs, jerkbaits, drop-shot minnows, swimbaits, inline spinners, and craw/baitfish streamers.
- Surface can be valid in warm active windows, but should not be as broadly forced as LMB summer pond topwater.

All-purpose tendencies:

- Tube jig, Ned rig, drop shot minnow, suspending jerkbait, soft jerkbait, hair jig, paddle tail, finesse jig, crawfish streamer, Clouser, woolly bugger.

Big-fish tendencies:

- Jerkbait, tube, football/finesse jig where legal, larger baitfish streamer, articulated streamer, topwater in warm low-light windows.

Important:

- Do not overuse frog-style recommendations for SMB.
- Clear subtle logic matters more for SMB than for LMB in many regions.

### Northern Pike

Core behavior:

- Predator/ambush fish strongly tied to baitfish, weeds, edges, shallow flats, wind-blown banks, and flash/vibration.
- Wind often improves pike reaction fishing, especially flash and moving baits.
- True surface is valid in warm/calm-to-breezy windows but should close in strong wind.

All-purpose tendencies:

- Spinner/bucktail, spoon, pike jerkbait, swimbait, inline spinner, flash fly, bunny streamer, deceiver/game changer depending water.

Big-fish tendencies:

- Large profile pike swimbait, pike jerkbait, large bucktail, large articulated pike streamer, big flash fly, large pike topwater when surface is prime.

Important:

- Pike "big fish" mode should meaningfully shift toward larger baitfish/profile when seasonally sensible.
- Wind should promote flash/reaction, not surface.

### Trout

Core behavior:

- River only in this recommender.
- Streamer/topwater fly model, not a hatch/dry/nymph recommender.
- Conditions and flow matter strongly.
- Elevated runoff favors visible/weighted streamers, sculpin profiles, buggers, leeches, and darker/bolder profiles.
- Clear/low/bright water favors smaller/subtler streamers or lures.
- Mouse/topwater is a specific summer/low-light/big-fish window, not generic trout advice.

All-purpose tendencies:

- Inline spinner, casting spoon, hair jig, suspending/soft jerkbait where row allows, woolly bugger, muddler/sculpin, slim minnow, Clouser, leech patterns.

Big-fish tendencies:

- Articulated streamers, sculpin streamers, mouse fly in correct summer low-light/calm windows, larger baitfish streamers, bolder leech/sculpin choices in runoff.

Important:

- Trout lake/pond must remain invalid.
- Big-fish trout should not become "mouse every day."
- Runoff/dirty flow should be a strong fly-side condition driver.

## Caching And Session Renovation

The existing session idea is good and should be kept.

Required changes:

1. Add `recommendation_goal` to request contract.
2. Add `recommendation_goal` to client cache key.
3. Add `recommendation_goal` to session key.
4. Add `recommendation_goal` column to `recommender_daily_sessions`, or create a new v2 session table.
5. Bump `RECOMMENDER_DAILY_SESSION_ENGINE_VERSION`.
6. Ensure old cached 3:3 results are invalidated.
7. Ensure Set A/Set B history persists with goal.

Migration options:

Option A: alter existing table.

```sql
alter table public.recommender_daily_sessions
  add column if not exists recommendation_goal text not null default 'all_purpose';
```

Then adjust primary key. This may be awkward because the existing primary key must be dropped/recreated.

Option B: create a new table.

```txt
recommender_daily_pick_sessions
```

This is cleaner for a major architecture change and avoids risky primary-key surgery.

Recommendation:

- Use a new table if implementation time allows.
- Keep old table temporarily for old engine rollback only.
- Remove old table in a later cleanup only after production confidence.

## Frontend Renovation

### Setup UI

`app/recommender.tsx` needs to become a 4-step wizard:

1. What are you after? Species.
2. Where are you fishing? Water type.
3. How's the water today? Clarity.
4. What's the goal? All Purpose or Big Fish.

Update:

- Wizard step type from `1 | 2 | 3` to `1 | 2 | 3 | 4`.
- Progress labels to `SPECIES`, `WATER`, `CLARITY`, `GOAL`.
- Readiness requires `goal`.
- Fetch request includes `recommendation_goal`.
- Cache key includes `recommendation_goal`.
- Reset/edit preserves or clears goal intentionally.

### Result UI

`components/fishing/RecommenderView.tsx` should stop presenting "up to 3 ranked cards."

New sections:

- Lure of the Day
- Honorable Mention Lure
- Fly of the Day
- Honorable Mention Fly

Possible layout:

- Two sections: Lures and Flies.
- Each section has a top card and smaller honorable mention card.
- Keep existing card art and water-column diagram.
- Medal labels should be replaced:
  - `TOP PICK`
  - `HONORABLE MENTION`
- Refresh button label becomes `GET SECOND OPINION`.

Do not show "Build Set B" to users.

## Copy Rules

Copy must explain:

- Why this lure/fly fits today's scenario.
- How to fish it.
- How the goal influenced it when relevant.
- Surface/wind reasoning when relevant.

Copy must not:

- Claim forage match unless the item's forage tags actually match row forage.
- Claim surface is good when surface is closed.
- Call a buzzbait slow.
- Use vague "because conditions are good" wording.
- Reveal internal scoring.

Example:

```txt
Buzzbait
Surface | Fast / Medium
Why today: Warm stained water and an active bass window make a noisy surface search bait viable while surface is still open.
How to fish it: Keep it moving steadily over grass edges, pads, and shallow cover. If it misses, follow up with the honorable mention.
```

Suppressive example:

```txt
Compact Flipping Jig
Bottom | Slow
Why today: A tougher bass window favors a slower target bait that stays in cover instead of chasing fish across open water.
```

## Testing Strategy

The test suite must change from "can we always fill 3:3?" to "are the 2:2 picks biologically valid, condition-aware, and varied?"

### Required Unit Tests

Contracts:

- Backend rejects invalid `recommendation_goal`.
- Frontend request type includes `recommendation_goal`.
- Cache key changes when goal changes.
- Session key changes when goal changes.

Catalog:

- All catalog profiles pass invariants.
- Surface identity is consistent.
- No surface item has non-surface column.
- No non-surface item has `is_surface: true`.
- Buzzbait remains `surface + fast/medium`.
- Mouse fly remains trout-specific and surface.
- Trout lake/pond is not eligible.

Scenario:

- Regime thresholds remain correct.
- Wind > 14 closes surface.
- Missing wind closes surface.
- Dirty/stained + wind activates wind reaction.
- Elevated runoff activates trout streamer scenario.
- Big-fish goal activates big-fish mode.

Selection:

- Every supported context returns exactly 2 lures and 2 flies.
- No duplicate IDs.
- Top and honorable differ by presentation group when alternatives exist.
- Set B differs from Set A when alternatives exist.
- Exact same full set does not repeat on consecutive days when alternatives exist.
- Variety remains inside quality bands.

Output:

- Displayed column equals catalog column.
- Displayed pace equals catalog primary pace.
- Secondary pace comes only from catalog.
- No `source_slot_index`.
- `rank_role` is correct.

### Required Scenario Regression Tests

At minimum:

1. Florida LMB lake/pond, May, dirty, aggressive, low wind:
   - Buzzbait may be valid.
   - If buzzbait appears, it must display fast/medium, never slow.
   - Surface can be open.

2. Florida LMB lake/pond, May, dirty, aggressive, high wind:
   - No surface picks.
   - Wind reaction baits like spinnerbait/bladed jig/lipless should compete strongly.

3. Florida LMB lake/pond, May, dirty, suppressive:
   - No buzzbait top pick.
   - Slower cover/bottom/controlled presentations should rise.

4. Clear SMB river, summer, neutral/calm:
   - Subtle craw/baitfish/current presentations should compete.
   - No generic LMB frog bias.

5. Pike lake, windy, neutral/aggressive:
   - Flash/reaction should rise.
   - Surface should close if wind > threshold.

6. Trout river, elevated runoff:
   - Streamers/sculpins/buggers/leeches should rise.
   - Surface/mouse should not dominate.

7. Trout river, summer low-light/calm big-fish:
   - Mouse fly can compete.
   - It should not appear every summer day regardless of conditions.

8. Same context over 14 consecutive dates:
   - No exact same 2x2 set on consecutive days when alternatives exist.
   - Top pick repetition is bounded.
   - Presentation groups rotate.

## Multi-Pass Renovation Plan

This work should be done in several passes. Do not collapse the whole renovation into one huge code change.

### Pass 0: Planning And Freeze Point

Goal:

- Establish this document as the working plan.
- Record the current production path.
- Confirm no further tuning should be added to the existing slot engine except emergency fixes.

Deliverables:

- This document.
- Short note in any older active recommender docs pointing future agents here.

Exit criteria:

- Future agents know the intended target architecture.

### Pass 1: Current-State Audit

Goal:

- Audit what exists before changing behavior.

Tasks:

- Trace production imports from the edge function.
- List every file currently used by recommender runtime.
- List every recommender file that is legacy/offline only.
- Audit current catalog profiles for column/pace/species/water mismatches.
- Audit seasonal rows for padded or questionable IDs.
- Audit tests that protect old 3:3 behavior.
- Create JSON/MD audit reports under `docs/audits/recommender-2x2/`.

Deliverables:

- `docs/audits/recommender-2x2/current-runtime-map.md`
- `docs/audits/recommender-2x2/catalog-profile-audit.md`
- `docs/audits/recommender-2x2/seasonal-row-audit.md`
- `docs/audits/recommender-2x2/removal-candidates.md`

Exit criteria:

- We know exactly what to keep, rewrite, or remove.
- No behavior change yet.

### Pass 2: Contract And Cache Foundation

Goal:

- Add the fourth-step goal to contracts without fully replacing the engine yet.

Tasks:

- Add `RecommendationGoal` type to backend contracts.
- Add `recommendation_goal` to backend request validation.
- Add `recommendation_goal` to frontend contracts.
- Add `recommendation_goal` to `fetchRecommendation`.
- Add goal to client cache key.
- Add goal to session key through new table or migration.
- Bump engine/session version.
- Add tests proving different goals do not share cache/session results.

Deliverables:

- Updated backend/frontend contracts.
- Migration for goal-aware sessions.
- Tests.

Exit criteria:

- App can send and cache goal-aware requests.
- Existing engine may temporarily ignore goal only during transition, but cache/session must already be correct.

### Pass 3: Frontend Four-Step Setup

Goal:

- Make the product flow match the new engine inputs.

Tasks:

- Update wizard from 3 to 4 steps.
- Add goal cards for `All Purpose` and `Big Fish`.
- Include goal in readiness.
- Include goal in request.
- Update setup copy: "Four quick questions..."
- Ensure back/jump step logic handles step 4.
- Typecheck.

Deliverables:

- Updated `app/recommender.tsx`.
- Updated client contract and request.

Exit criteria:

- User can choose goal before generating picks.
- Goal is sent to backend.

### Pass 4: Catalog Renovation

Goal:

- Make lure/fly profiles truthful enough for candidate scoring.

Tasks:

- Add bounded `condition_tags` and `goal_tags`.
- Audit every lure and fly.
- Fix wrong or questionable column/pace values.
- Fix species/water eligibility where too broad.
- Fix presentation groups where too coarse or misleading.
- Add only the minimal tags needed for scoring.
- Do not add new archetypes unless audit proves a true 2x2 inventory gap.
- After the existing profiles are audited, review whether Big Fish mode is missing major credible presentations such as a glidebait. Add only high-confidence archetypes with clear species, water, seasonal, and goal rationale.

Deliverables:

- Updated catalog files.
- Catalog invariant tests.
- Catalog audit report showing before/after.

Exit criteria:

- Catalog can support truthful display and daily scoring.
- Buzzbait-class profile bugs are impossible by invariant.

### Pass 5: Seasonal Row Renovation

Goal:

- Remove 3:3 padding pressure and make rows biologically honest.

Tasks:

- Treat `primary_lure_ids` and `primary_fly_ids` as seasonal allowed IDs.
- Audit each supported species/region/month/water type.
- Tighten rows where column/pace ranges are too broad.
- Remove IDs that exist only to fill 3 slots.
- Ensure every row can produce 2 lures and 2 flies under common daily states.
- For rows that cannot, decide whether to add truthful catalog coverage or change product support.

Deliverables:

- Updated CSV rows.
- Regenerated seasonal TS rows.
- Inventory sufficiency report.
- Tests for 2x2 row coverage.

Exit criteria:

- Every supported row has honest 2x2 inventory.

### Pass 6: New Engine Core In Parallel

Goal:

- Build the new engine without cutting over production immediately.

Tasks:

- Create new engine directory.
- Implement `buildDailyScenario`.
- Implement hard-gated pool construction.
- Implement candidate scoring.
- Implement quality-band selection.
- Implement top/honorable selection.
- Implement variety and no-repeat guard.
- Implement copy builder.
- Implement diagnostics.
- Keep old production path untouched until tests pass.

Deliverables:

- New engine files.
- Unit tests.
- Scenario regression tests.
- 14-day variety audit script.

Exit criteria:

- New engine returns 2 lures and 2 flies for every supported context.
- Scenario tests prove daily conditions change picks.
- Variety tests prove no repeated exact daily sets when alternatives exist.

### Pass 7: Surface Adapter And Session Integration

Goal:

- Wire the new engine into the response shape and daily Set A/B behavior.

Tasks:

- Add `runDailyPicksSurface`.
- Produce new `RecommenderResponse`.
- Update `dailySession.ts` or create a new daily session module/table.
- Ensure Set B uses Set A as avoid history.
- Ensure history persists only when a new variant is generated.
- Ensure locked_until equals cache_expires_at.
- Ensure old 3:3 caches are invalidated.

Deliverables:

- New surface adapter.
- Session tests.
- Edge handler tests.

Exit criteria:

- Server flow: A -> repeat A -> second opinion B -> repeat B -> lock until midnight.
- Goal-specific sessions do not collide.

### Pass 8: Result UI Renovation

Goal:

- Make the UI match 2x2 product intent.

Tasks:

- Update `RecommenderView`.
- Replace "LURES up to 3" and "FLIES up to 3" with top/honorable presentation.
- Replace medal labels with `TOP PICK` and `HONORABLE MENTION`.
- Replace button label with `GET SECOND OPINION`.
- Show recommendation goal in hero or summary.
- Ensure UI handles exactly 2 per side.
- Remove user-facing "Set B" language.

Deliverables:

- Updated result UI.
- Typecheck.
- Manual screenshot/visual QA if available.

Exit criteria:

- UI feels intentionally designed for 2x2, not like a shortened 3:3 list.

### Pass 9: Production Cutover

Goal:

- Make the new engine live.

Tasks:

- Switch edge function from `runRecommenderRebuildSurface` to `runDailyPicksSurface`.
- Update feature id.
- Update version constants.
- Run focused and full recommender tests.
- Run frontend typecheck.
- Deploy migration.
- Deploy edge function.
- Smoke test real requests.

Deliverables:

- Cutover commit.
- Test summary.
- Deployment notes.

Exit criteria:

- Production app uses new 2x2 goal-aware engine.

### Pass 10: Removal And Cleanup

Goal:

- Remove old unused recommender logic.

Tasks:

- Remove or quarantine old slot-engine files no longer imported.
- Remove tests that only protect 3:3.
- Remove stale docs or add clear superseded headers.
- Remove unused scripts after confirming they are not part of the new audit workflow.
- Keep historical docs only if clearly marked legacy.

Likely removal/deprecation candidates:

- `supabase/functions/_shared/recommenderEngine/rebuild/shapeProfiles.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/selectSide.ts`
- `supabase/functions/_shared/recommenderEngine/rebuild/conditionWindows.ts`
- 3:3 coverage tests like `rebuildTripleCoverage.test.ts`
- old v3-only audit tests/scripts that are not referenced by the new workflow
- old docs that conflict with this plan

Exit criteria:

- One production recommender architecture remains.
- Future agents do not have to understand three recommender generations to make one change.

### Pass 11: Final QA And Calibration

Goal:

- Confirm product quality beyond unit tests.

Tasks:

- Run scenario matrix across all four species.
- Run 14-day and 30-day variety audits.
- Spot check real locations:
  - Florida LMB lake/pond.
  - Northern SMB river.
  - Midwest/Upper Midwest pike lake.
  - Mountain/PNW trout river.
- Review copy for truthfulness.
- Review no-repeat diagnostics.
- Review all rows that required inventory fixes.

Exit criteria:

- Recommendations are biologically sensible.
- Daily conditions visibly matter.
- Variety is healthy.
- No repeated exact daily sets unless documented inventory shortage exists.

## Files Expected To Change

Backend likely:

- `supabase/functions/recommender/index.ts`
- `supabase/functions/recommender/dailySession.ts` or new session module
- `supabase/functions/recommender/recentHistory.ts`
- `supabase/functions/_shared/recommenderEngine/contracts/input.ts`
- `supabase/functions/_shared/recommenderEngine/contracts/output.ts`
- `supabase/functions/_shared/recommenderEngine/index.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- `supabase/functions/_shared/recommenderEngine/v4/contracts.ts`
- new `supabase/functions/_shared/recommenderEngine/dailyPicks/**`
- `data/seasonal-matrix/*.csv`
- generated seasonal files under `v4/seasonal/generated/`
- migration under `supabase/migrations/`

Frontend likely:

- `app/recommender.tsx`
- `components/fishing/RecommenderView.tsx`
- `lib/recommender.ts`
- `lib/recommenderContracts.ts`

Tests likely:

- `supabase/functions/recommender/index.test.ts`
- new tests under `supabase/functions/_shared/recommenderEngine/__tests__/`
- retire/replace old rebuild 3:3 tests

Docs/audits likely:

- this file
- `docs/audits/recommender-2x2/**`
- older docs marked superseded

## Agent Reporting Requirements

Future builder agents should summarize each pass with:

```txt
Files Changed
- path
- path

Behavior Changed
- concise bullet
- concise bullet

Tests Run
- command: result
- command: result

Caveats / Blockers
- short note, or "None"

Next Recommended Pass
- one sentence
```

Do not paste massive diffs back into chat. The steering agent can inspect actual files.

## Things Future Agents Must Not Do

- Do not patch the buzzbait issue by only changing buzzbait copy.
- Do not keep the old slot engine and hide the issue with a one-off exception.
- Do not display target pace instead of catalog pace.
- Do not use adjacent pace matching to fill abstract slots.
- Do not reintroduce 3:3 requirements.
- Do not add rescue pools that choose weak biological fits.
- Do not let forage dominate daily conditions.
- Do not let clarity dominate daily conditions.
- Do not make topwater appear when wind closes surface.
- Do not broaden trout beyond river.
- Do not make mouse fly a generic trout recommendation.
- Do not keep stale recommender code imported "just in case" after cutover.

## Final Acceptance Criteria

This renovation is complete only when all are true:

- User setup has four steps including goal.
- Backend request/session/cache include goal.
- Production output is exactly 2 lures and 2 flies.
- User can get exactly one second opinion.
- Set A and Set B are stable and server-authoritative.
- Same exact full set does not repeat on consecutive days when alternatives exist.
- Daily condition changes produce meaningful recommendation changes.
- High wind closes surface.
- Surface baits display their true pace.
- Buzzbait can never display slow.
- Trout is river only.
- Catalog profiles pass invariant tests.
- Seasonal rows are audited for 2x2 truth, not 3:3 padding.
- Old slot-filling logic is removed or clearly deprecated.
- Full Deno recommender tests pass.
- Frontend typecheck passes.
- Migration is applied before deployment.
