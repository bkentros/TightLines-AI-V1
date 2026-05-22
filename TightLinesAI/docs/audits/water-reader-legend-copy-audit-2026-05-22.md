# Water Reader Legend Copy Audit - 2026-05-22

Scope: baseline audit of the pre-renovation Water Reader legend wording, season/transition handling, redundancy risk, and deployment implications. Runtime code has since been changed in this branch; see the implementation update below.

## Current Flow

- The app calls the Supabase Edge Function `water-reader-read`.
- The Edge Function builds geometry, detects features, places zones, builds legend entries, builds the display model, and renders the production SVG.
- The React legend renders `productionSvgResult.legendEntries`.
- The UI prefers the server-provided `entry.body`. The large client-side template pool in `lib/waterReaderLegendTemplates.ts` is fallback copy only for older or partial payloads.
- The live template source is the server/shared engine legend implementation:
  - Node/local mirror: `lib/water-reader-engine/legend.ts`
  - Deno/Edge mirror: `supabase/functions/_shared/waterReaderEngine/legend.ts`

Important consequence: changing only the React component or only `lib/waterReaderLegendTemplates.ts` will usually not change what users see.

## Implementation Update

This branch now makes the first renovation pass:

- Rewrites server/shared standalone structure legend bodies into action-first guidance.
- Rewrites confluence legend bodies with shape-safe cove language and clearer "where to start / what earns more time" guidance.
- Adds repeated-feature cadence planning with a stable map-specific starting offset so several coves, points, islands, or confluences in one legend do not all speak in the same rhythm.
- Clarifies UI season mismatch language as "regional pattern" rather than implying every mismatch is an engine transition window.
- Slims the client fallback pool to a compact rewritten set so stale legacy language cannot leak through older or partial payloads.
- Stages the cache version as `water-reader-engine-v7-legend-guidance-copy` so a future deploy regenerates cached read rows.

## Baseline Production Copy Inventory

Automated inventory from `waterReaderLegendTemplateCoverage()`:

- Checked template surfaces: 356
- Placement kinds: 23
- Seasons: 4
- Confluence keys: 22
- Checked confluence variants: 264
- Missing template keys: 0
- Missing color keys: 0
- Forbidden phrase hits: 0

Baseline client fallback quality report from `waterReaderLegendTemplateQualityReport()`:

- Checked fallback templates: 544
- Issues: 0

Current branch fallback quality report:

- Checked fallback templates: 424
- Issues: 0

Current branch server coverage:

- Checked template surfaces: 532
- Checked confluence variants: 440
- Standalone cadence gaps: 0
- Confluence cadence gaps: 0
- Forbidden phrase hits: 0

The automated gates pass, but they do not measure plain-English clarity, duplicate row cadence, or repeated sentence structure.

## Live Seasonal Base Copy

These are the main server-side feature-envelope bodies. Extra variants are added later by feature class, so a displayed row may use one of several variants with the same basic meaning.

| Feature | Spring | Summer | Fall | Winter |
| --- | --- | --- | --- | --- |
| Main lake point | Compare the protected-side shoulder, tip, and outside shoulder within this point area. Keep the read broad until one edge shows a clearer seasonal signal. | Compare the broad-water shoulder and tip with the protected side. Use the full point area to decide which edge has better comfort or activity. | Read the point as a transition from shoreline into broader water. Compare the tip and both shoulders before narrowing to one casting angle. | Keep this point read compact. Compare the tip with the nearest defined shoulder and favor the side with the most stable-looking water. |
| Secondary point | Compare the protected side, smaller tip, and opening-facing side within this secondary point area. Use it as a staging reference, not a whole-cove call. | Compare the opening-facing side and tip with nearby shade or cover. Leave room for wide pockets where the outer edge matters more than the back. | Use this secondary point as a small transition between cove shoreline and broader water. Compare both sides for bait movement or wind influence. | Keep the read tight around the tip and nearest defined shoulder. The highlighted area is a checkpoint beside safer water. |
| Cove | Compare the protected interior edge with the opening-facing shoulders inside this cove area. This covers both narrow coves and broad shoreline pockets. | Compare the opening-facing edge, shade, and any defined inner shoreline. The back of a cove should earn attention through cover, bait, or comfort. | Read the cove as a shoreline transition. Compare the outer edge, shaped interior bank, and any bait-holding turn within the highlighted area. | Use the cove area conservatively. Compare the outer edge with the most protected defined shoreline and stay close to stable-looking water. |
| Neck | Compare the protected-side shoulder with the opposite shoulder inside this neck area. Treat the constriction as a route with edges, not a center target. | Compare the broader-water shoulder with shade, wind, or cover on the opposite side. The strongest edge should narrow the pass. | Read both shoulders as a paired transition around the constriction. Watch which side gives bait or fish less room to scatter. | Keep the comparison tight across the two shoulders. Work beside the constriction before spending time in the middle. |
| Saddle | Compare the inside shoulder with the opposing shoulder across this saddle. Use the crossing as a route between shoreline options. | Compare the outer-facing shoulder with the more protected side. Shade, wind, or nearby cover should decide the tighter focus. | Read both saddle shoulders as a broad opening. Cover the crossing only enough to learn which edge is carrying activity. | Use the nearest shoulder pair as the conservative read. Stay near the edge that gives the quickest route to stable water. |
| Island | Compare the mainland-facing rim, nearest corner, and protected side within this island area. Let the highlighted edge guide the first lap. | Compare the broad-water rim, shade, and island corners. Avoid treating the full perimeter as equal unless bait or wind says so. | Read the island as a perimeter transition. Compare corners and both sides for bait movement before slowing down on one rim. | Use the nearest defined island side and corner as a compact reference. Favor the rim closest to stable-looking water. |
| Dam | Compare the transition corner, straight face, and nearby softer bank inside this dam area. Hard edge plus warmth or cover matters most. | Compare shade, wall contact, and the outer transition corner. Use the straight segment as a reference, not the whole plan. | Compare both transition corners with the straight segment. Bait movement should decide whether the corner or face gets more time. | Use the straight segment and nearest transition corner as a compact hard-edge read. Keep the focus near stable-looking water. |

Universal/simple-water fallback live copy:

- Spring: Compare protected cover with the nearest shoreline change. Keep the read simple and let visible structure narrow the pass.
- Summer: Compare shade, cover, and the deepest-looking available edge. Comfort should matter more than covering every bank.
- Fall: Cover the shoreline until bait, wind, or a strike gives direction. Then repeat the strongest edge.
- Winter: Work the most stable edge with patience. Cover, rock, or nearby safer water should decide where to spend time.

## Transition Copy

Season lookup uses five regional season groups and a 14-day transition window. Separately, the UI masthead compares the read season to the meteorological calendar season and may display a transition label when those differ.

Server row-level transition warnings:

- Spring target: Transitional conditions can lag behind the season badge; compare this with main-lake structure areas.
- Summer target: Transitional conditions can keep protected shoreline structure relevant in some areas.
- Fall target: Warm-day patterns can keep broad-water-side structure relevant.
- Winter target: Late-transition patterns can persist along cove and shoreline structure.

The row warning appears only when the state/date lookup is in the 14-day transition window and that zone's placement logic differs between the transition-from and transition-to seasons.

## Main Problems

1. Repetition is structurally baked in. A lake with five coves can show five independently selected cove bodies, but the cove variants all orbit the same nouns and verbs: compare, opening-facing, protected, outer edge, cover, bait, comfort, stable-looking water.

2. The copy passes safety gates by staying conservative, but it often reads like an internal QA note instead of user guidance. Phrases like "staging reference," "seasonal signal," "broad-water shoulder," "opening-facing," "stable-looking water," and "read compact" are intelligent but not plain.

3. The templates describe how to compare map geometry more than what the angler should do first. A normal user is likely asking, "Where do I start, what do I check next, and what tells me to leave?"

4. The UI transition badge is ambiguous. The masthead says "SEASON - TRANSITION" when the read season differs from the meteorological calendar season. The server row warnings use a real 14-day regional transition window. Those are not the same concept.

5. The local fallback copy is more action-oriented in many places, but it is normally hidden because server `entry.body` wins.

6. The quality gates do not check for repeated openers or repeated concepts across entries. They catch forbidden specificity and unsafe phrasing, not user-facing sameness.

## Recommended Rewrite Direction

Keep the working geometry, placement, display, and cache contract intact. Rewrite the body strings only.

Use a plain-English row shape:

- First sentence: tell the user where to start.
- Second sentence: tell the user what decides whether to stay, shift, or leave.

Example pattern:

- Current: Compare the protected interior edge with the opening-facing shoulders inside this cove area.
- Clearer: Start on the cove edge closest to open water. Move farther back only if you see bait, cover, shade, or a calmer bank worth slowing down on.

Plain-language replacements:

- protected side -> calmer tucked-away side
- opening-facing side -> side closest to open water
- broad-water side -> open-water side
- shoulder -> edge
- stable-looking water -> deeper or calmer water that changes less
- comfort -> shade, wind, cover, or nearby open water
- reference -> starting point, check, or edge

For duplicate structures in one legend, add map-level variety:

- First cove: "Start..."
- Second cove: "Use this..."
- Third cove: "Treat this..."
- Fourth cove: "Check..."

The current deterministic hash is stable, but it does not know that the surrounding legend already contains several similar coves.

## Deployment Implications

Server-visible copy changes require changing both engine mirrors:

- `lib/water-reader-engine/legend.ts`
- `supabase/functions/_shared/waterReaderEngine/legend.ts`

Then bump and synchronize:

- `WATER_READER_ENGINE_VERSION` in `supabase/functions/_shared/waterReaderRead/contracts.ts`
- the matching constant in `scripts/water-reader-build-read-cache.ts`
- smoke tests that assert the current engine version string
- heavy-worker docs/tag if the heavy generator is used in production

Why: cache lookup is keyed by `lake_id`, `season_context_key`, `map_width`, and `engine_version`. Without a version bump or cache purge, old cached `read_response` rows can keep serving old legend bodies.

An app-only release is only enough for:

- masthead wording
- transition badge wording
- fallback copy for old/partial payloads
- layout/styling around the legend

It is not enough for the normal row bodies users see today.

## Suggested Safe Next Pass

1. Rewrite the server bodies in small buckets: standalone structures first, confluences second, transition warnings third.
2. Keep titles, placement kinds, feature classes, zone IDs, SVG generation, cache schema, and geometry logic unchanged.
3. Add a lexical-variety test that flags repeated row openers and repeated body text inside a single generated legend.
4. Run the existing coverage reports plus:
   - `npm run qa:water-reader-typecheck`
   - `npm run qa:water-reader-production-feature-envelope`
   - `npm run qa:water-reader-app-integration-smoke`
5. Deploy Edge Function and heavy worker together with a new engine version, then prewarm/regenerate the high-value cache rows.
