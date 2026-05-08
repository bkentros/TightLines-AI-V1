# Pass 8C Deployment And Device Smoke Checklist

Created: 2026-05-08

Scope: deployment/device smoke readiness for the app-wired daily-picks 2x2 path. This is verification only; no recommender scoring, selection, catalog, seasonal row, image generation, frontend layout, or backend default cutover changes are included.

## Local Readiness Findings

| Area | Local finding | Deployment implication |
|---|---|---|
| `recommendation_goal` migration | `supabase/migrations/20260508120000_add_recommendation_goal_to_recommender_daily_sessions.sql` adds `recommendation_goal text not null default 'all_purpose'`, adds a check constraint for `all_purpose` / `big_fish`, drops the existing primary key by discovered name, and recreates the primary key including `recommendation_goal`. | Must be applied to the remote Supabase database before using the app-wired 2x2 path live. Do not assume it is already applied. |
| Client preview request | `lib/recommender.ts` sends `x-recommender-preview: daily_picks_2x2` on recommender edge calls. | The app build expects the deployed edge function to understand the preview header. |
| Edge preview route | `supabase/functions/recommender/index.ts` allows `x-recommender-preview` in CORS and routes the exact value `daily_picks_2x2` to `resolveDailyPicksSession`. | Deploy the edge function containing the preview route before or with the app build. |
| Session separation | `supabase/functions/recommender/dailyPicksSession.ts` keys sessions by user/date/location/state/region/species/water/clarity/`recommendation_goal`/daily-picks engine version. | All Purpose and Big Fish sessions should not collide once the migration is applied. |
| Stale response rejection | `lib/recommender.ts` validates the daily-picks feature/version and four-slot shape before caching/returning. | If the app hits an old edge function that returns 3:3, the app rejects it instead of treating it as a valid result. |
| Missing images | `components/fishing/RecommenderView.tsx` renders an `IMAGE PENDING` placeholder when an image is not mapped. | Missing lure/fly images should not crash the smoke flow. |

## Release Order

1. Apply `supabase/migrations/20260508120000_add_recommendation_goal_to_recommender_daily_sessions.sql` to the target Supabase project.
2. Deploy the `recommender` edge function version that includes the daily-picks preview/session path.
3. Ship or install the app build that sends `x-recommender-preview: daily_picks_2x2`.
4. Run the device smoke cases below against the deployed edge function and real `recommender_daily_sessions` table.
5. Consider backend default cutover only after the device smoke passes.

## Manual Device Smoke Cases

Run these with a signed-in user who has recommender access.

| Case | Steps | Expected result |
|---|---|---|
| First All Purpose request | Choose a supported state/location/species/water/clarity, set Goal to `All Purpose`, build recommendations. | Response renders exactly four cards: Lure of the Day, Honorable Mention Lure, Fly of the Day, Honorable Mention Fly. |
| Stable Set A | Repeat the exact same All Purpose request without refresh. | Same Set A returns from the server/cache for the same local day/context. |
| Set B second opinion | Tap/build Set B while refresh is available. | Set B returns; where alternatives exist, selected IDs should differ from Set A. Refresh then locks with no third set. |
| Repeated Set B | Request refresh again after Set B is active. | Stored Set B returns, not a third generated set. |
| Big Fish separation | Repeat the same location/species/water/clarity with Goal set to `Big Fish`. | Big Fish creates/reads a separate session from All Purpose. |
| Missing image candidate | Use or simulate a result containing any unmapped lure/fly image. | Card shows the graceful image placeholder and the screen does not crash. |
| Old 3:3 rejection | Point the app at an old edge function or omit the preview header in a controlled debug build. | The app should not render the old 3:3 response as a valid 2x2 result. |

## Scenario Coverage To Try

| Scenario | Suggested setup | Notes |
|---|---|---|
| Florida LMB Big Fish | Florida largemouth bass, lake/pond, clear or stained water, Goal `Big Fish`. | Confirms Big Fish goal lane and glidebait-capable inventory where row-authored. |
| Florida LMB All Purpose | Same location/species/water/clarity, Goal `All Purpose`. | Confirms goal separation and non-Big-Fish default behavior. |
| Great Lakes / Upper Midwest bass | Michigan/Wisconsin/Minnesota bass lake/pond where supported. | Confirms northern seasonal rows and surface gate restraint. |
| Trout river | A supported trout state/location, freshwater river, clear or stained. | Confirms trout river-only daily-picks path and removed warmwater surface flies stay absent. |
| Northern pike | Supported pike state/location, river and/or lake/pond. | Confirms pike-first inventory path and removed `tube_jig` / `woolly_bugger` stay absent. |

## Backend Default Cutover Recommendation

Do not cut the backend default to 2x2 yet. Local compile and Deno coverage are green, and the app/preview path is locally ready, but deployed readiness still depends on:

- remote migration application,
- deployed edge function with the preview/session path,
- device smoke confirmation against the real table and production-like auth/subscription path.

After those pass, backend default cutover can be considered in a separate explicit pass.

## Pass 8D Operational Deployment Verification

Date: 2026-05-08

### Target checked

| Check | Result |
|---|---|
| Linked Supabase project | `hsesngprhpgajyfbrwbf` |
| Linked project name | `TightLines AI V1` |
| URL/env alignment | `SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_URL` point at `https://hsesngprhpgajyfbrwbf.supabase.co`; `V1_DATABASE_URL` points at the same project pooler host. |
| CLI access | Supabase CLI could list migrations/functions for the linked project. |

### Migration status

Before Pass 8D, `supabase migration list --linked` showed `20260508120000` as local-only, and direct schema inspection showed:

- `public.recommender_daily_sessions.recommendation_goal`: missing
- recommendation-goal check constraint: missing
- primary key: did not include `recommendation_goal`

The normal `supabase db push --linked --dry-run` path was not safe because remote migration history contains versions not present locally, and the CLI refused with a divergent-history warning.

Pass 8D applied only `supabase/migrations/20260508120000_add_recommendation_goal_to_recommender_daily_sessions.sql` to the confirmed V1 database using the repo's `V1_DATABASE_URL`, then recorded version `20260508120000` in `supabase_migrations.schema_migrations`.

After apply, remote verification showed:

| Schema item | Verified remote state |
|---|---|
| Column | `recommendation_goal text not null default 'all_purpose'` exists. |
| Constraint | `recommender_daily_sessions_recommendation_goal_check` enforces `all_purpose` / `big_fish`. |
| Primary key | Includes `user_id, local_date, lat_key, lon_key, state_code, species, region_key, water_type, water_clarity, recommendation_goal, engine_version`. |
| Migration history | `20260508120000` is recorded as applied. |

Operational caution: because the project still has broader local/remote migration-history divergence, future broad `supabase db push` runs should be treated carefully and reconciled separately.

### Edge deployment status

Pass 8D deployed `supabase/functions/recommender` to project `hsesngprhpgajyfbrwbf` with `supabase functions deploy recommender --project-ref hsesngprhpgajyfbrwbf --use-api`.

Post-deploy `supabase functions list` showed:

| Function | Status | Version | Updated at UTC |
|---|---|---:|---|
| `recommender` | `ACTIVE` | `78` | `2026-05-08 17:45:18` |

The deployed function bundle includes the local code path that:

- allows `x-recommender-preview` in CORS,
- routes `x-recommender-preview: daily_picks_2x2` to `resolveDailyPicksSession`,
- keeps the default no-preview path on the old 3:3 rebuild response.

### Remote HTTP smoke status

Using secure test auth credentials from `.env`, Pass 8D ran a real HTTP smoke against:

`https://hsesngprhpgajyfbrwbf.supabase.co/functions/v1/recommender`

Headers included:

- `Authorization: Bearer <anon key>`
- `x-user-token: <signed-in test user access token>`
- `x-recommender-preview: daily_picks_2x2`

Smoke setup:

- Florida largemouth bass
- freshwater lake/pond
- stained water
- target date `2026-07-18`
- unique rounded session key: `lat_key=28.543`, `lon_key=-81.383`

Smoke results:

| Case | Result |
|---|---|
| All Purpose first request | Returned `feature: recommender_daily_picks_2x2_future`, exactly four picks, session variant `A`, refresh available. |
| All Purpose repeat | Returned stable Set A with same four IDs. |
| All Purpose refresh | Returned variant `B`, refresh locked with `refreshes_remaining: 0`. |
| All Purpose repeated refresh | Returned the same stored Set B, not a third set. |
| Set B variety | Set B differed from Set A in the rich Florida pool. |
| Big Fish same context | Returned separate `big_fish` variant `A` session with exactly four picks and refresh available. |

Observed selected IDs:

| Goal / set | IDs |
|---|---|
| All Purpose Set A | `suspending_jerkbait`, `flat_sided_crankbait`, `popper_fly`, `clouser_minnow` |
| All Purpose Set B | `suspending_jerkbait`, `tube_jig`, `woolly_bugger`, `game_changer` |
| Big Fish Set A | `walking_topwater`, `glidebait`, `articulated_dungeon_streamer`, `deer_hair_slider` |

### Cutover recommendation after Pass 8D

Operational backend readiness for the preview path is verified:

- remote migration is applied and verified,
- recommender edge function is deployed with the preview/session path,
- real HTTP smoke passed for feature shape, Set A stability, Set B locking, and goal-separated sessions.

Backend default cutover is still not recommended until Brandon completes an actual device smoke with the app build. The remaining blocker is not backend deployment; it is confirming the on-device UI, cache, refresh button, and image-placeholder behavior against the deployed function from the production-like app experience.

## Pass 8E Second-Opinion UX/Session Hardening

Date: 2026-05-08

Scope: harden the app-wired daily-picks preview path for the one-time second-opinion product loop. This pass did not cut backend default behavior to 2x2; the no-preview backend path still returns the old 3:3 rebuild response.

### Implementation status

| Area | Pass 8E result |
|---|---|
| Set metadata | Daily-picks session responses now include `recommendation_session.available_variants`, initially `["A"]` and then `["A", "B"]` once the second opinion exists. |
| Stored variant retrieval | Preview requests may send `view_variant: "A" | "B"` to read a stored Set A or Set B without generating another set. Invalid values return `400 invalid_view_variant`; unavailable stored variants return `409 variant_unavailable`. |
| One-time refresh | Existing `refresh_requested` semantics remain: first request creates/returns A, one refresh creates/stores B, repeated refresh returns stored B. |
| App cache | The frontend recommender cache now stores Set A and Set B under separate variant-aware keys for the exact location/date/state/species/water type/water clarity/goal context. |
| App UI | The result page shows a prominent "Get one more second opinion for today" CTA while only Set A exists, then swaps to a First Picks / Second Opinion segmented toggle after Set B exists. |
| Context separation | Goal was already session-keyed; Pass 8E verification also covers water-clarity separation so changing clarity creates a distinct session with its own Set A and one Set B allowance. |

### Updated manual smoke cases

Add these checks to the device smoke checklist before backend default cutover:

| Case | Steps | Expected result |
|---|---|---|
| Visible Set B CTA | Build an initial daily-picks result. | The result page shows a clear CTA reading close to "Get one more second opinion for today"; it is not hidden in the hero corner. |
| Build Set B once | Tap the second-opinion CTA. | Set B returns, the CTA disappears, refresh allowance is spent, and no third set can be generated. |
| Toggle back to First Picks | After Set B exists, tap `First Picks`. | Stored Set A is displayed without generating a new response. |
| Toggle to Second Opinion | Tap `Second Opinion`. | Stored Set B is displayed without generating a new response. |
| Toggle persistence after cached Set A | After building Set B, tap `First Picks`, then `Second Opinion`, then `First Picks` again. | The segmented toggle remains visible the whole time and the one-time second-opinion CTA does not reappear. |
| Water clarity separation | Change only water clarity and build again. | A new exact-context session starts with Set A and one available second opinion. The prior clarity's Set A/B remain separate. |
| Goal separation after toggling | Build/toggle All Purpose and then build Big Fish for the same location/species/water/clarity. | All Purpose and Big Fish maintain separate Set A/B sessions and do not overwrite each other in cache. |

### Daily condition snapshot finding

Current app behavior does not use literal midnight weather as tactical input. `forecast-scores` fetches a 7-day Open-Meteo bundle, returns a `snapshot_env` with hourly wind/temperature/cloud/pressure arrays, and the recommender request sends that snapshot plus today's `target_date`. The recommender condition builders profile the requested local calendar day from those hourly fields when available.

Same-day result stability is currently provided in two layers:

- The client `forecastScores` cache stores the weather snapshot until the next location-local midnight.
- The daily-picks server session stores Set A and Set B by exact local date/context/goal until location-local midnight.

Gap to address before or after default cutover: there is no durable server-side weather snapshot keyed to the recommender session. A first-ever report generated at 12:01 AM and another first-ever report for the same context generated at 4:02 PM on a different device, after the forecast cache has missed or refreshed, can reflect a newer upstream weather snapshot. Once Set A exists for that exact user/session key, subsequent reads are stable until local midnight.

Recommended follow-up: add a narrow persisted daily condition snapshot or store the normalized `DailyScenario`/source forecast metadata with the session if product requirements demand cross-device first-request stability for the entire local day.

### Cutover recommendation after Pass 8E

Backend default cutover is still not recommended until a new app/edge build containing Pass 8E is deployed and Brandon reruns device smoke against the deployed preview path. The previous Pass 8D deployment does not include the new `view_variant` behavior or First Picks / Second Opinion UI.

## Pass 8E.1 Stale Variant-Cache Correction

Date: 2026-05-08

Pass 8E.1 corrected one frontend cache edge case: Set A can be cached before Set B exists with `available_variants: ["A"]`. After Set B is generated, explicit First Picks / Second Opinion toggle requests now bypass local cache and read the stored variant from the backend with fresh `recommendation_session.available_variants`, then update the cache with that fresh response.

This prevents a stale cached Set A from hiding the segmented toggle and showing the one-time second-opinion CTA again after Set B already exists.

No backend default cutover, scoring, selection, catalog profile, seasonal row, image, migration, or layout changes were made in Pass 8E.1.

## Pass 8F Backend Default Cutover

Date: 2026-05-08

Confirmed preconditions before implementation:

- Remote `recommendation_goal` migration is applied on project `hsesngprhpgajyfbrwbf`.
- Deployed preview function version 79 works.
- Real HTTP preview smoke passed.
- Brandon completed on-device app smoke after version 79 deploy.
- The app generated valid 2x2 recommendations successfully.

### Default behavior after Pass 8F

`supabase/functions/recommender/index.ts` now routes normal valid recommender requests with no preview header to `resolveDailyPicksSession` and returns the daily-picks 2x2 response by default:

- `feature: recommender_daily_picks_2x2_future`
- `engine_version: daily_picks_2x2_response_v1`
- exactly four named `picks`
- `recommendation_session.available_variants`
- no old `lure_recommendations` / `fly_recommendations` arrays

The `x-recommender-preview: daily_picks_2x2` header remains backward-compatible and routes to the same daily-picks session behavior. Current app builds that still send the header should continue to work.

### Session and history behavior

Default daily-picks requests preserve:

- Set A creation and stable repeat reads,
- one Set B refresh,
- repeated refresh returning stored Set B,
- `view_variant: "A" | "B"` reads without generation,
- `all_purpose` / `big_fish` session separation,
- exact context separation including water clarity.

The default daily-picks path does not write `recommender_recent_history`. The old 3:3 recent-history integration and rebuild engine files remain in the repository only for the later deletion/quarantine pass.

### Cleanup recommendation after Pass 8F

After deploy and smoke pass, old 3:3 rebuild runtime files, stale metadata, and tests that only protect the old default response can move to a dedicated deletion/quarantine pass. Do not delete them opportunistically inside cutover.

### Pass 8F deploy and smoke status

Pass 8F deployed `supabase/functions/recommender` to project `hsesngprhpgajyfbrwbf` with:

`supabase functions deploy recommender --project-ref hsesngprhpgajyfbrwbf --use-api`

Post-deploy `supabase functions list` showed `recommender` active at version `80`, updated `2026-05-08 18:53:43` UTC.

Real HTTP smoke used secure test auth credentials from `.env` and hit:

`https://hsesngprhpgajyfbrwbf.supabase.co/functions/v1/recommender`

Smoke setup:

- Florida largemouth bass
- freshwater lake/pond
- stained water
- target date `2026-07-18`
- rounded session key: `lat_key=28.549`, `lon_key=-81.389`

Smoke results:

| Case | Result |
|---|---|
| Normal no-preview request | Returned `feature: recommender_daily_picks_2x2_future`, exactly four picks, session variant `A`. |
| Normal repeat | Returned stable Set A with same IDs and `generated_at`. |
| Normal refresh | Returned/stored Set B and locked refresh. |
| `view_variant: "A"` after B | Returned stored Set A with `available_variants: ["A", "B"]`. |
| Preview header request | Returned `feature: recommender_daily_picks_2x2_future`; header remains compatible. |
| Big Fish same context | Returned separate `big_fish` Set A session. |

Pass 8F backend cutover smoke passed. Old 3:3 deletion is now safe to plan as a separate cleanup pass, assuming no post-deploy device regression appears.
