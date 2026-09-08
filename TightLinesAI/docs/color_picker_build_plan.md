# Freshwater color picker — build plan

Status: the September 8 correction contract below supersedes older pass documents. The corrected migration and edge function are deployed; no new mobile production build was created. The catalog contains reviewed heuristics, not experimental proof of catch superiority. See [daily reports and color audit](color-picker/daily_report_color_audit.md) and [release correction](color-picker/release_correction_20260908.md).

Pass-one deliverables: [decisions and handoff](color-picker/pass_1_decisions.md), [full catalog and artwork audit](color-picker/pass_1_catalog_audit.md). The executable taxonomy supersedes the proposed type table below where reconciliation introduced more precise distinctions.

Pass-two deliverables: [research decisions and handoff](color-picker/pass_2_decisions.md), [all condition pools](color-picker/pass_2_pool_matrix.md), [source register](color-picker/pass_2_sources.md), and [pattern image requirements](color-picker/pattern_image_manifest.json).

The [UI redesign](color-picker/ui_redesign.md) brings setup, loading, and results into the lure/fly recommender’s paper design system.

## Current correction contract — September 8, 2026

The [simplification handoff](color-picker/simplification_decisions.md) supersedes the original 56-type selector, image reuse, and manual-weather policy. The live picker exposes 23 broad choices in five categories. Historical pass documents and the 336-cell research matrix remain research records; they do not define current navigation.

## Product contract

- Freshwater conventional artificial lures plus streamer flies and fly poppers. The Flies category contains Streamer fly and Fly popper. Saltwater, live bait, insect dry flies, and nymphs are outside this release. Additional surface-fly types remain proposed extensions, not committed release scope.
- Illustrated bait category/type selection → illustrated water clarity selection → generate → two equal-status FinFindr picks for each meaningful light condition. The product presents these as its picks for the day without claiming a knowable first-place color.
- Filter by bait type, clarity, then the reviewed bright/direct and low/diffuse light pools. Each pair is sampled uniformly without effectiveness scores or a cross-condition anti-repeat rule that would bias individual colors.
- When the two reviewed light pools differ, show both conditional sections. When they are identical, sample once and show one “Across changing light” section instead of implying a distinction the catalog does not contain.
- Color Match does not request or persist coordinates, forecast data, or hourly weather. Device timezone is used only to determine the authenticated user’s current local date.
- The lure/fly color banner is removed. Both recommendation slots link to their correct broad bait unless the pattern identity is fixed or unsupported.
- One server-cached report per authenticated user, broad bait, water clarity, and local calendar date. A different clarity is a distinct report; changing request ID or device cannot reroll the same setup. A new daily draw is available the following day, and repeats remain possible. Do not add mandatory species, depth, forage, or season questions in this release. Do not claim those variables influenced results when they did not.

## Historical repository assessment

| Existing surface | Reuse or change |
| --- | --- |
| `app/recommender.tsx` | Reference for location handling, paper theme, illustrated choices, navigation, and loading; implement a separate picker route |
| `components/fishing/RecommenderView.tsx` | Reuse visual primitives; do not reuse the top-pick/honorable-mention hierarchy |
| `lib/waterclarityImages.ts` | Existing clear/stained/murky illustrations and three-value contract |
| `lib/lureImages.ts`, `lib/flyImages.ts` | Existing illustrations and archetype IDs to map into picker types |
| `lib/colorPaletteImages.ts` | Current natural/bright/dark palette system; too coarse for the picker |
| `lib/recommenderContracts.ts` | Current `scenario_summary.color_palette_theme` response dependency |
| `supabase/functions/_shared/recommenderEngine/dailyPicks/shapeDailyPicksResponse.ts` | Current color theme generation to retire during migration |
| Shared environment/howFishing code | Existing hourly cloud inputs and local-date handling; inspect provider adapter before extending weather fetches |

## Historical research taxonomy (not current picker navigation)

Category is navigation; type is the eligibility boundary. Rigging methods and size variants should alias to the same type unless they change color reasoning. A Texas-rigged stick worm and a wacky-rigged stick worm do not need independent palettes. Each type below receives a stable ID and its own explicit pattern allowlist; sharing a pool template must not automatically authorize every color on every shape.

| Category | Selectable types | Candidate pattern vocabulary to verify per type |
| --- | --- | --- |
| Soft plastics | Stick worm; finesse/straight-tail worm; ribbon-tail worm; Ned-style bait; craw; creature/beaver; tube; curly-tail grub; soft jerkbait; paddle-tail swimbait; straight-tail minnow; soft toad | Green pumpkin, watermelon seed, watermelon red flake, pumpkinseed, brown, smoke, motor oil, black, black/blue flake, junebug, plum, pearl, smoke/silver flake, silver shiner, chartreuse, white/chartreuse; baitfish patterns limited to compatible shapes |
| Skirted and hair jigs | Flipping/structure jig; football jig; finesse jig; swim jig; hair/marabou jig | Green pumpkin, brown, brown/orange craw, black/blue, black, olive, pearl white, white/chartreuse, bluegill-style skirt; hair jigs use material-appropriate variants |
| Bladed and wire baits | Spinnerbait; bladed jig; buzzbait; inline spinner; large bucktail spinner; underspin | White, white/chartreuse, chartreuse, black, black/blue, baitfish skirt, bluegill skirt; silver, gold/brass, copper, painted blade variants where applicable |
| Diving and sinking hard baits | Squarebill; flat-sided crankbait; medium-diving crankbait; deep-diving crankbait; lipless crankbait; suspending jerkbait; floating minnow plug; hard swimbait; glidebait; pull/jerk bait; tail spinner; horizontal jigging minnow | Ghost minnow/shad, silver/black, silver/blue, pearl, gold/black, perch, bluegill, brown craw, red craw, chartreuse/black back, firetiger, clown; require type-specific availability verification |
| Metal baits | Casting spoon; weedless spoon; trolling spoon; jigging spoon; blade bait | Silver, gold/brass, copper, silver/blue, white, chartreuse, firetiger, black; distinguish painted finish from reflective metal |
| Topwater lures | Walking bait; hard-bait popper; prop/plopper bait; wake bait; hollow-body frog | Bone, pearl/white belly, black belly, silver baitfish, translucent baitfish, frog, bluegill, perch; frog dorsal pattern and belly color recorded separately |
| Streamers | Woolly Bugger; leech/rabbit-strip streamer; baitfish/minnow streamer; Clouser-style streamer; articulated streamer; sculpin streamer; crawfish streamer; large pike streamer | Black, olive, brown, tan, white, olive/white, gray/white, black/olive, black/purple, chartreuse/white, yellow/brown, rust; color compatibility differs between baitfish, sculpin, craw, and leech forms |
| Surface flies | Fly popper | Candidate body/belly colors: white, black, yellow, chartreuse, olive; record tail and leg accents separately. Verify each pattern and condition before activation; do not inherit hard-bait popper pools. |

Fly poppers use a distinct stable ID (`fly_popper`) from conventional poppers (`hard_popper`), with separate artwork, material descriptions, and eligibility records. Foam/cork/balsa and deer-hair construction can be recorded as variants where needed. Potential later surface-fly additions are sliders/divers, gurglers, and frog/mouse flies, several of which already have repository artwork. Add them only with separately validated pools and clear type labels.

This is a proposed release taxonomy, not a claim to enumerate every manufactured freshwater bait. Before catalog freeze, reconcile every current freshwater lure and streamer archetype against it. Record explicit aliases and justified exclusions. Keep conventional buzzbaits in one category, and keep rigged jig-and-plastic entries mapped to the relevant plastic or complete recipe instead of showing duplicates.

### Pattern records

Store canonical ID, common display name, aliases, compatible type IDs, material, body/back/belly/accent colors, opacity, flake colors, finish/flash, pattern description, image reference, and optional component recipe. Record forage resemblance separately from verified local forage; this release only knows resemblance.

Examples:

- `plastic_green_pumpkin_black_flake`: olive-brown translucent-to-opaque plastic with black flakes; define the actual illustrated opacity rather than allowing it to vary silently.
- `plastic_black_blue_flake`: opaque black body with blue flakes; distinct from a two-tone black/blue skirt.
- `hard_ghost_minnow`: translucent body, subdued back, restrained reflective accent.
- `hard_pearl_minnow`: opaque pearl baitfish pattern; not interchangeable with ghost minnow in eligibility rules.
- `streamer_olive_white`: olive upper wing/back and white lower wing/body, with explicitly specified flash level.

For spinnerbaits, jigs, and underspins, one result is one coherent color recipe. State whether the choice concerns the skirt, trailer/body, blade, or entire combination. Do not multiply three skirt colors by three trailers into nine recommendations. Do not add blade-shape or tackle-size recommendations to this feature.

## Research and limits of the rules

These sources supply angling guidance, not controlled proof of three optimal colors for every scenario. Manufacturer advice is identified as such. Store source links and a short rationale alongside each rule; distinguish direct guidance from our extension to another pattern/type.

| Source | Supported takeaway | Implementation consequence |
| --- | --- | --- |
| [Bassmaster: soft-plastic colors](https://www.bassmaster.com/bass-basics/news/the-texas-rig-part-5-soft-plastic-colors/) | Natural/translucent plastics are conventional clear-water choices; dark opaque plastics are conventional reduced-visibility choices | Separate opacity from hue; retain versatile patterns in multiple pools |
| [Bassmaster: when color matters](https://www.bassmaster.com/how-to/news/when-color-matters/) | Hard-bait transparency and solid finishes are discussed in relation to clarity and light | A hard-bait pattern name alone cannot determine eligibility |
| [Bassmaster: spinnerbait tuning](https://www.bassmaster.com/how-to/news/fine-tuning-your-spinnerbaits/) | Skirt choices involve water color and forage | Give skirted moving baits their own rules and component recipes |
| [Orvis: streamer colors](https://howtoflyfish.orvis.com/video-lessons/the-basics-of-fly-fishing/chapter-seven-streamer-fishing/353-streamer_colors_and_best_times) | Offers white on bright days and black on dull days as starting guidance, while stressing experimentation and local experience | Use a streamer-specific light rule; do not apply plastic rules wholesale |
| [Orvis: dead-drifting streamers](https://news.orvis.com/fly-fishing/pro-tips-dead-drifting-streamers-big-trout) | Describes successful use of olive, black, brown, and white | These are candidate streamer colors, not evidence that all fit every clarity/light cell |
| [Mepps: color technology](https://www.mepps.com/mepps-tactics/article/color-tech...-not-what-you-get/77) | Manufacturer discusses how underwater appearance changes and how lure components contribute | Treat metal finish and multicolor components explicitly; do not claim surface RGB represents fish vision |
| [Rapala: clear-water baits](https://usa.rapala.com/email/erap-up_72/clear-water/) | Manufacturer/guide advice includes natural minnow patterns and accents for clear water | Baitfish-pattern candidates extend beyond bass plastics; avoid unsupported species claims |
| [Open-Meteo forecast documentation](https://open-meteo.com/en/docs) | Hourly cloud cover is percent; shortwave radiation is surface solar energy flux averaged over the preceding hour | Normalize units explicitly and align timestamps; radiation is not underwater illumination |

### Eligibility design

Implement explicit rules for bottom plastics, baitfish plastics, bottom skirted jigs, moving skirted baits, hard baitfish patterns, hard craw patterns, metal finishes, topwater belly patterns, and streamer subfamilies. Shared traits help author rules, but an explicit bait-pattern allowlist remains mandatory.

1. Load only reviewed patterns supported by the selected type.
2. Intersect with that type's clarity allowlist.
3. Intersect with that type's requested light-state allowlist.
4. Apply any explicit combination exception, identified by rule ID.
5. Deduplicate by canonical pattern/recipe ID.
6. Randomly draw three from that eligible pool.

Do not use a universal rule such as “muddy means chartreuse” or “cloudy means black.” Dark silhouettes and opaque bright patterns can be alternative visibility strategies. A rule may allow both without ranking them. Do not force patterns into mutually exclusive light pools: the same suitable pattern can appear in both groups.

Topwater underside emphasis is a proposed rule family requiring targeted source review before activation. Deep-diving bait types do not reveal actual fishing depth; do not invent depth-dependent color loss. Tannin-stained but transparent water is not the same as suspended mud; the initial three clarity choices represent visibility, and their descriptions must make that clear. A future water-tint refinement can extend the model without silently changing this release's inputs.

### Catalog review artifact

Create one row per `(bait_type, pattern_id, clarity, light_state)` with allowed/excluded, rationale, source IDs, direct-guidance/editorial-extension status, and review status. Publish an automatically generated coverage report for every type × three clarities × two light states.

Every release cell must contain at least three distinct reviewed patterns; target six or more where defensible to permit useful rotation. A pool of exactly three cannot provide new combinations. Never invent colors, relax bait compatibility, or insert duplicates just to fill the UI. An insufficient pool fails catalog validation before release. Unexpected runtime catalog failure returns a recoverable error instead of unsuitable recommendations.

## Historical weather contract (superseded)

The 30% and 70% thresholds are product heuristics. It measures cloud coverage, not chance of clouds, sunlight percentage, or a fish-vision boundary.

Proposed precise interpretation for this release:

1. Use today at the Home-selected location, averaged over sunrise-to-sunset. Show the date used in results; do not ask the user for it.
2. Take the duration-weighted mean of valid hourly cloud cover over that window. Exclude nighttime; weight partial hours. This is the report cloud percentage, not a daily mean including midnight.
3. Validate provider values as percent in [0,100]. Convert fractions only when the provider schema explicitly declares fraction units. Never guess that `0.7` means 70% based on magnitude. Reject invalid values; null is not clear skies.
4. Compare the unrounded mean: <30 yields three sunny choices; 30–70 inclusive yields three sunny and three cloudy choices; >70 yields three cloudy choices. Round only display text.
5. Call the second group “For cloudy periods” only if the hourly forecast actually contains such periods; otherwise “If clouds move in.” A low mean does not promise both conditions will occur. Apply the same conditional labeling to sunny alternatives if necessary.
6. Require at least 75% valid duration coverage of the chosen window (an engineering quality threshold, not a fishing rule). With insufficient coverage or provider failure, explain that the forecast is unavailable and offer retry. Do not generate from guessed or user-supplied weather.
7. For a night-only request or no daylight window, explain that the release supports daylight color guidance and ask the user to retry when daylight forecast data is available; do not add date controls to the picker. Do not classify midnight as sunny because cloud cover is zero.

Hourly shortwave radiation can be retained for future brightness refinement, but must not silently override the agreed 30%/70% grouping rules in this release. A brightness model would need solar-angle/clear-sky normalization, dawn/dusk handling, and validation. Surface radiation still does not account for shade, depth, or water attenuation. No fixed raw W/m² cutoff should be presented as universal.

## Historical randomization and report stability (superseded)

- Use unbiased shuffle/sample without replacement, with an injectable RNG for tests.
- Within a pool, all candidates remaining eligible for the draw have equal probability. No performance weights or hidden scores.
- Keep a short recent-pattern history keyed by user, bait type, clarity, light group, and catalog version. Prefer unseen patterns; if fewer than three remain, admit the least recently shown patterns until the draw can be filled. Tie-break equally at random.
- This rotation intentionally changes selection frequency based on recency, not predicted effectiveness. It must never make an ineligible pattern eligible.
- Persist selected IDs, catalog/rule version, weather snapshot, report ID, and generated time. Reopening a report preserves its colors; “Show other colors” creates a new draw. Navigation, image loading, and component renders must not reroll.
- No requirement for six globally unique colors across two groups: overlapping eligibility is legitimate. Each group must have three unique colors, and a shared color must have its own condition-appropriate explanation.
- Retry/idempotency handling must prevent one tap from consuming multiple refreshes or producing multiple saved reports.

## Historical UX and artwork plan (superseded)

Step 1: “What are you using?” Five category tabs filter 23 illustrated broad bait choices. Fly popper is separate from conventional topwater lures. Selected state uses outline/checkmark and text, not color alone. Next requires a type.

Step 2: “How clear is the water?” Use new Clear, Stained, and Murky illustrations. Add short observational descriptions about how easily a submerged lure remains visible; do not imply exact optical measurements. Preserve selections when navigating backward. Use today’s forecast at the Home-selected location automatically; do not show location, date, GPS, or weather controls. Render all three clarity choices side by side.

Results: show selected bait, clarity, location/date, and weather basis above one or two groups. Each group has exactly three equal-sized cards with a bait-shaped pattern preview, common color name, a short visual description, and one sentence explaining the actual rule that admitted it. No numbered podium, gold top pick, or score. “Show other colors” and “Change setup” are explicit actions. Explanations use reviewed templates, not runtime invented fishing claims.

Artwork inventory must cover category thumbnails, type thumbnails, clarity assets, and every released type-pattern preview. All selector illustrations must be newly generated; do not reuse lure/fly recommender artwork. Generate missing/new bitmap art using the imagegen skill during the artwork phase. Keep a manifest of prompts, references, asset paths, pattern IDs, and review status.

Use one consistent field-guide treatment, square assets on a consistent warm off-white background, controlled neutral illumination, and adequate margins for hooks/tails. Review previews against the specified body/belly colors, flakes, transparency, and finish at actual card size. Lighting must not make watermelon look like green pumpkin or hide blue flakes. Export mobile-sized derivatives after approval of the master image. The exact asset count is determined by the validated manifest, not guessed before catalog review.

## Historical implementation sequence (superseded)

Complete the research and eligibility matrix before implementing production recommendation logic. Generic UI scaffolding may proceed independently, but no unreviewed pool enters the engine. During implementation, encode the reviewed matrix and verify every combination; corrections return to the matrix and source rationale first.

1. **Taxonomy foundation — complete:** reconcile current lure/fly archetypes, stable IDs, aliases, categories and selector requirements.
2. **Research catalog — complete:** known-color recipes, sources, explicit 336-cell eligibility matrix, credibility cleanup and pattern-image specifications. Gate: every released cell reviewed with at least three distinct patterns.
3. **Pure engine — complete:** validation, explicit pool lookup, unbiased draws, recency, saved replay, persisted-retry handling and explanation copy. See the pass-three handoff for tests and service boundaries.
4. **Weather and report service — locally complete, not deployed:** dedicated edge endpoint, shared environment/location/date semantics, weather snapshots, durable draws, atomic idempotency and access controls. Gate: 69.999/70/70.001 boundaries, percent/fraction inputs, missing hours, daylight weighting, local date/DST, provider failures, forecast-only failure handling and report replay tests.
5. **Illustrated flow — implemented locally, artwork pending:** color-picker route, view, client contracts/image maps, dashboard entry and preselected navigation from relevant lure/streamer results. Gate: every category including fly poppers, back navigation, exhausted pools and recoverable errors.
6. **Artwork and end-to-end QA:** generate and visually review missing category/type/pattern assets; test the full flow, report reopen, refresh, duplicate requests and fallback on mobile. Gate: no missing or mismatched images, unclipped anatomy, accessibility labels and successful end-to-end checks.
7. **Lure/fly migration after picker completion:** remove the banner and all color advice from summaries, cards, details, exports, narration and saved-report presentation. Preserve clarity where it still informs lure profile/presentation; version compatibility for older clients/reports and delete only assets proven unused. Gate: no old color recommendation remains visible and the new picker is available.

No production deployment or live schema change is part of this planning document. The migration is authorized work once implementation reaches its completion gate; it does not require asking again merely to remove the old feature's color guidance.

## Historical acceptance examples (superseded)

- Black/blue plastic means black with visible blue flakes when that is the recorded pattern; it never renders as a blue-skirted jig.
- Selecting a sculpin streamer cannot draw a craw-pattern crankbait color record.
- Clear water does not automatically exclude every opaque pattern if a reviewed type-specific rule permits one.
- A 29% report returns three sunny choices; 30%, 69%, and 70% return two groups of three; 71% returns three cloudy choices.
- A sunny report's conditional cloudy group does not assert cloudy weather is forecast.
- A three-pattern pool returns those three without duplicates and makes no promise of fresh combinations.
- A pattern with no evidence for a specific scenario cannot enter the pool solely because it increases variety.
- Reopening a saved report never silently changes its choices or its weather basis.
- Existing lure/fly color guidance disappears only after the new feature passes its completion gates.

### September 8 — approved familiar-color curation

Applied user-approved skeptical-color removals per bait and legacy alias; retained the explicitly accepted catalog-supported colors. See `color-picker/color_familiarity_review.md` for decisions and `color-picker/live_picker_pools.json` for current pools. Gold/brass + Firetiger is the separately approved murky spoon pair. All 138 live cells support two distinct colors (12 cells have exactly two). Catalog 2026-09-08.1 deployed; 34 tests, structural QA, TypeScript and live generation/cache checks pass. Existing immutable daily reports retain their saved colors; new reports use the curated pools.

### September 8 — minimize repeated colors within each report

User requested different sunny/cloudy colors whenever viable pools allow it. Catalog/replay version 2026-09-08.2 now jointly selects the two light pairs: enumerate valid pair allocations, retain those with minimum overlap, choose one uniformly, then shuffle the two display slots independently. No color scores or new eligibility rules. This supersedes the earlier independent sun/cloud draws and unconditional equal per-color probability claim: randomness is uniform over minimum-overlap allocations; individual color probabilities can differ because the pools differ.

Four distinct colors appear whenever possible; otherwise only unavoidable repeats remain. Single-light engine draws retain uniform pair selection. Historical daily snapshots stay unchanged; no cache reset. Selection envelope version stays 3.0.0 to preserve the existing daily-lock SQL contract; catalog version identifies the new draw policy. Tests cover maximum distinctness across all live bait/clarity combinations, equal allocation/order sampling in a narrow pool, eligibility, daily replay and two-choice pools. All 36 tests and structural QA pass.

### September 8 — verified additions for common and thin pools

Implemented approved Junebug soft jerkbaits; black/blue-flake and Junebug paddletails/underspins; red/white and Five of Diamonds spoons; verified Clown topwater for stained water. Added documented Senko green-pumpkin/red-flake, green-pumpkin/watermelon, chartreuse-tail and blue/black laminate recipes with explicit clarity boundaries. Added documented chartreuse/white paddletails. See `color-picker/verified_pool_expansion.md` for exact recipes, manufacturer evidence and limitations. Prior skeptical-color exclusions remain enforced.

Worm pools now contain 8–11 choices; paddletails 5–7. Murky underspins and spoons each have four. Catalog 2026-09-08.3 deployed through shared backend. 38 tests, TypeScript, structural QA and 320px/390px report-flow checks pass. Daily cache and minimum-overlap randomization remain intact; existing reports are not rerolled.
