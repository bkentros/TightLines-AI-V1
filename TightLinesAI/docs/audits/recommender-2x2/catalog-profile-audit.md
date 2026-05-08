# Catalog Profile Audit

Pass: 1 current-state audit  
Scope: documentation only; no catalog data changed

## Pass 4A Update

Pass 4A added bounded catalog metadata without changing existing selection behavior:

- Added closed `ConditionTag` vocabulary:
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
- Added closed `GoalTag` vocabulary:
  - `reliable_action`
  - `versatile_search`
  - `big_fish_upside`
  - `high_risk_high_reward`
- Added `condition_tags` and `goal_tags` to every current lure and fly profile.
- Added factory validation for missing tags, duplicate tags, and values outside the closed vocabularies.
- Added catalog tests that verify all authored profiles satisfy the new tag invariants.
- Added a buzzbait regression assertion confirming it remains `surface`, `primary_pace: fast`, `secondary_pace: medium`, with reaction/surface/big-fish tags rather than slow-finesse tags.

Important scope note: Pass 4A did not change `species_allowed`, `water_types_allowed`, columns, paces, family groups, presentation groups, forage tags, clarity strengths, or copy. The current live rebuild selector does not score from these new tags yet.

Deferred to Pass 4B:

- Review actual Pass 4A tag semantics, not just type validity. Tags must match the lure/fly's designed mechanics and condition strengths.
- Tighten questionable species eligibility such as trout plastics, pike tube/bass-coded crankbait scope, and broad warmwater streamer overlap.
- Revisit water-type eligibility that may be coverage padding.
- Split or refine overly coarse presentation groups only if needed for 2x2 variety.
- Reassess broad all-clarity profiles and surface-profile scope after the tag foundation is in place.
- Audit Big Fish inventory gaps after existing profiles are tightened. A glidebait-style archetype is a likely candidate if it can be added with clear species, water, seasonal, and goal rationale.
- Decide whether some Pass 4A tags should narrow further once seasonal rows are renovated.

## Files Audited

- `supabase/functions/_shared/recommenderEngine/v4/contracts.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/lures.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/flies.ts`
- `supabase/functions/_shared/recommenderEngine/v4/candidates/factory.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/catalog.validation.test.ts`
- `supabase/functions/_shared/recommenderEngine/v4/__tests__/factory.invariants.test.ts`

## Current Catalog Schema

`ArchetypeProfileV4` currently contains:

- `id`
- `display_name`
- `gear_mode`
- `species_allowed`
- `water_types_allowed`
- `family_group`
- `presentation_group`
- `column`
- `primary_pace`
- `secondary_pace`
- `forage_tags`
- `clarity_strengths`
- `condition_tags`
- `goal_tags`
- `is_surface`
- `how_to_fish_variants`

Catalog counts:

- Lures: 37
- Flies: 31

The schema is a useful base for truthfully representing item identity. After Pass 4A, it now includes bounded daily-condition and goal metadata needed by the future 2x2 scorer.

## Missing Fields For The 2x2 Engine

Pass 4A added these additional profile concepts:

- `condition_tags`, using a small approved vocabulary such as `calm_surface`, `low_light_surface`, `wind_reaction`, `dirty_vibration`, `clear_subtle`, `cold_slow`, `warming_search`, `heat_finesse`, `runoff_streamer`, `current_swing`, `cover_ambush`, and `open_water_search`.
- `goal_tags`, using a small approved vocabulary such as `reliable_action`, `versatile_search`, `big_fish_upside`, and `high_risk_high_reward`.

Older/current runtime equivalents are still scattered outside the catalog:

- `rebuild/conditionWindows.ts` hard-codes condition-window candidate ID lists.
- `rebuild/selectSide.ts` hard-codes species-confidence ID sets and clarity specialist whitelists.
- Goal does not exist anywhere in catalog or request/session contracts.

Future scoring work should consume these profile tags from a normalized daily scenario layer. The current live rebuild path still uses its existing condition-window and slot-selection logic.

## Invariants Already Enforced

Current factory/tests enforce:

- Lure/fly IDs must be in closed v4 ID lists.
- `column` must be a valid tactical column.
- `primary_pace` must be present and valid.
- `secondary_pace`, if present, must be valid, different from primary, and adjacent.
- `forage_tags` and `clarity_strengths` must be non-empty.
- `species_allowed` and `water_types_allowed` must be non-empty.
- `how_to_fish_variants` must have length 3.
- `presentation_group` must be non-empty.
- `condition_tags` and `goal_tags` must be non-empty.
- `condition_tags` and `goal_tags` must be unique.
- `condition_tags` and `goal_tags` must come from the closed Pass 4A vocabularies.
- Fly surface IDs are closed through `SURFACE_FLY_IDS_V4`.
- Surface fly IDs must use `column: "surface"`, and non-surface fly IDs cannot use surface column.
- `is_surface` equals `column === "surface"` for all current catalog entries.
- `mouse_fly` must be trout-only.
- `frog_fly` must be LMB/pike only.
- `foam_gurgler_fly` must exclude trout.
- Trout lake/pond is blocked at broader scope/row layers; `mouse_fly` itself is river-only.

## Invariants Not Enforced

Current code does not enforce:

- Condition tags or goal tags are semantically optimal beyond closed vocabulary membership and non-empty/unique authoring.
- Surface lures have any species/month/condition specificity beyond broad global species/water eligibility and seasonal rows.
- Clarity strengths are bounded or biologically conservative.
- Species eligibility is biologically tight rather than coverage-friendly.
- Water-type eligibility is biologically tight rather than coverage-friendly.
- `presentation_group` granularity is enough for real variety.
- `family_group` and `presentation_group` are not overused as coarse variety buckets.
- A catalog item is not included solely to pad thin seasonal pools.
- Displayed output pace equals catalog `primary_pace`; current surface adapter displays target slot pace.
- Copy cannot be driven by target slot pace.

## Buzzbait Issue

Current buzzbait catalog profile:

```txt
id: buzzbait
gear_mode: lure
species_allowed: largemouth_bass, smallmouth_bass, northern_pike
water_types_allowed: freshwater_lake_pond, freshwater_river
family_group: surface_buzz
presentation_group: topwater_open
column: surface
primary_pace: fast
secondary_pace: medium
forage_tags: surface_prey, baitfish
clarity_strengths: stained, dirty
is_surface: true
```

The catalog identity is directionally correct for the plan: buzzbait is a surface bait with fast primary pace and medium secondary pace. It is not slow.

The current engine can still display it incorrectly because:

- `shapeProfiles.ts` can create a slow surface target profile when the row includes slow surface specialists such as `hollow_body_frog`, `frog_fly`, or `mouse_fly`.
- `selectSide.ts` allows adjacent pace compatibility, so a fast/medium buzzbait can fill a slow surface slot through medium being adjacent to slow.
- `archetypeToRankedFields` returns `primary_column: archetype.column` but `pace: targetProfile.pace` and `presence: presenceFromPace(targetProfile.pace)`.
- `runRecommenderRebuildSurface.ts` exposes that value to the frontend.

This is structural. It should be fixed in later passes by replacing target-slot display semantics with catalog identity and candidate scoring. Do not patch it by changing buzzbait copy.

## Catalog-Level Concerns Requiring Future Review

### Surface Identity And Scope

- `walking_topwater`, `popping_topwater`, and `prop_bait` all use `presentation_group: topwater_open`.
  - Risk: real surface variety is compressed; top/honorable 2x2 selection may treat distinct walking, popping, and prop presentations as the same group.
  - Future review: decide whether open-water topwater should split into walk, pop, prop, buzz, and cover frog groups for better variety.

- `hollow_body_frog`
  - Current: LMB/pike, lake only, surface, slow/medium, all clarity strengths.
  - Risk: likely too broad in clear and pike contexts unless row gating is very specific. Frog should be a cover/vegetation/ambush/big-fish tool, not generic surface filler.

- `frog_fly`
  - Current: LMB/pike, lake only, surface, slow/medium, all clarity strengths.
  - Risk: same cover-specific concern as hollow-body frog; should not become generic pike/LMB surface fly inventory.

- `large_pike_topwater`
  - Current: pike-only, lake/river, surface, medium/slow, clear/stained.
  - Risk: needs condition tags around calm/breezy surface and big-profile/big-fish upside. Wind should not promote this even though wind often promotes pike reaction.

- `small_floating_trout_plug`
  - Current: trout-only river surface, medium/slow, clear/stained.
  - Risk: must be seasonally and daily gated like a specific trout surface/wake plug, not generic trout surface.

- `mouse_fly`
  - Current: trout-only river surface, slow/medium, clear/stained.
  - Risk: correct species/water identity but needs very narrow future tags: summer, low-light/calm, big-fish upside. It must not be a generic trout surface recommendation.

### Column / Pace Risks

- `spinnerbait`
  - Current: mid, medium primary, slow secondary, stained/dirty, LMB/SMB/pike, lake/river.
  - Risk: secondary pace may be questionable for many spinnerbait uses; slow-rolling exists, but current display can turn it into a slow presentation too readily. Future profile may prefer medium primary with fast or slow secondary only if copy/scoring is careful.

- `bladed_jig`
  - Current: mid, medium/fast, stained/dirty, LMB/SMB.
  - Risk: directionally good for dirty vibration/wind reaction, but needs condition tags and goal tags to keep it from being generic mid moving-bait filler.

- `lipless_crankbait`
  - Current: mid, medium/fast, stained/dirty, LMB/SMB/pike, lake/river.
  - Risk: pike and river scope may be too broad. Needs season/row support for grass/flats/cool-warm transition rather than blanket use.

- `weightless_stick_worm`
  - Current: upper, medium/slow, all clarities, LMB/SMB/trout, lake/river.
  - Risk: trout eligibility and all-clarity strength look suspicious. The plan calls it all-purpose bass, not trout coverage. Review whether trout eligibility is coverage padding.

- `tube_jig`
  - Current: bottom, slow/medium, LMB/SMB/pike, lake/river, clear/stained.
  - Risk: pike eligibility is likely coverage padding or at least not a mainstream pike recommendation.

- `ned_rig`
  - Current: bottom, slow, LMB/SMB/trout, lake/river, all clarity.
  - Risk: trout eligibility is explicitly protected by current tests, but should be reviewed in the 2x2 product: trout is a river streamer/topwater model, and Ned rig is lure-side, not fly-side. All-clarity strength may be too broad.

- `blade_bait`
  - Current: bottom, slow/medium, all four species, lake/river, all clarity.
  - Risk: broad species/water/clarity profile may be biologically useful in cold/deep contexts but too powerful without `cold_slow`/seasonal constraints.

- `soft_jerkbait`
  - Current: upper, medium/slow, all four species, lake/river.
  - Risk: pike/trout breadth may be too broad. For trout river, jerkbait may be valid lure-side but needs careful seasonal row use.

- `suspending_jerkbait`
  - Current: mid, medium, LMB/SMB/trout, lake/river.
  - Risk: trout lake/pond should never pass scope; still, water_types includes lake because catalog is global and trout is one of several species. Future scorer must preserve species-context hard gates.

### Species Eligibility Too Broad

Profiles with especially broad species scope should be reviewed first:

- Lures: `soft_jerkbait`, `blade_bait` allow all four internal species.
- Lures: `weightless_stick_worm`, `ned_rig`, `tube_jig`, `inline_spinner`, `spinnerbait`, `suspending_jerkbait`, `squarebill_crankbait`, `flat_sided_crankbait`, `deep_diving_crankbait`, `lipless_crankbait`, `buzzbait` allow three species.
- Flies: `clouser_minnow`, `articulated_baitfish_streamer`, `articulated_dungeon_streamer`, `game_changer`, `woolly_bugger`, `rabbit_strip_leech`, `jighead_marabou_leech`, `lead_eye_leech`, `feather_jig_leech`, `unweighted_baitfish_streamer`, `baitfish_slider_fly`, `popper_fly`, and `deer_hair_slider` allow all four or nearly all four species.

Broad species eligibility is not automatically wrong, but under a 2x2 product it should be defensible without relying on padded seasonal rows.

### Water-Type Eligibility Too Broad

Many catalog entries allow both lake/pond and river. Items needing review:

- River-enabled bass/pike crankbaits and buzzbaits: `squarebill_crankbait`, `flat_sided_crankbait`, `lipless_crankbait`, `buzzbait`.
- Lake-enabled fly streamers across all warmwater/pike/trout species: `clouser_minnow`, `articulated_baitfish_streamer`, `articulated_dungeon_streamer`, `game_changer`, `woolly_bugger`, leech-family flies.
- Surface flies: `popper_fly`, `deer_hair_slider`, `foam_gurgler_fly` allow broad lake/river use. Seasonal rows must be precise if this remains.

### Clarity Strengths Too Broad Or Too Powerful

All three clarities are assigned to many profiles. Review especially:

- `hollow_body_frog`, `frog_fly`: clear/stained/dirty may be defensible only in cover/vegetation, not open water.
- `paddle_tail_swimbait`, `medium_diving_crankbait`, `deep_diving_crankbait`, `blade_bait`, `large_profile_pike_swimbait`: all-clarity may be too broad without bounded scoring.
- Fly streamers with all-clarity: `deceiver`, `game_changer`, `woolly_bugger`, `jighead_marabou_leech`, `lead_eye_leech`, `feather_jig_leech`, `sculpin_streamer`, `crawfish_streamer`, `warmwater_*`, `baitfish_slider_fly`, `deer_hair_slider`, `foam_gurgler_fly`, `frog_fly`, `pike_flash_fly`.

Future scoring should treat clarity as a bounded boost, not a hard permission slip or dominant factor.

### Presentation Groups Too Coarse

- `topwater_open` covers walking topwater, popper, prop bait, buzzbait, and large pike topwater. This is too coarse for real variety.
- `baitfish_streamer` covers many fly identities: Clouser, bucktail, articulated baitfish, game changer, conehead, sometimes broad species use. It may hide real differences.
- `leech_bugger` combines woolly bugger and rabbit strip leech, while other leech-family flies may carry the same group. This may or may not be enough for 2x2 variety.
- `crankbait` groups squarebill, flat-sided, and medium diver. Current tests intentionally assert this; future 2x2 may want more nuance by depth/action.
- `spinner_vibration` groups inline spinner, spinnerbait, large bucktail, and maybe other spinner/vibration tools through family/presentation behavior. This may be too broad across species.
- `surface_fly_frog_mouse` is shared by frog fly and mouse fly. Current tests assert this, but biologically frog and mouse belong to different species/windows and should probably diverge in future catalog tags or groups.

### Likely Coverage Padding Candidates

These are not delete recommendations. They are profiles whose current broad scope likely exists to keep old 3:3 pools healthy and needs biological review:

- `weightless_stick_worm` for trout.
- `ned_rig` for trout.
- `tube_jig` for northern pike.
- `blade_bait` for all four species and all clarities.
- `soft_jerkbait` for northern pike and trout.
- `deep_diving_crankbait` for northern pike.
- Warmwater and general baitfish streamers allowed across bass, pike, and trout without species-specific condition/goal tags.
- Surface flies allowed for trout beyond `mouse_fly` and specific streamer/topwater product scope.

## Species-Specific Risk Notes

### Largemouth Bass

- Frog and frog fly should be cover/vegetation/ambush/big-fish options, not generic surface.
- Buzzbait is correctly fast/medium in catalog but current engine can display slow.
- Dirty water should help vibration/profile tools like spinnerbait and bladed jig, but surface must still depend on seasonal and daily gates.
- Finesse/plastic tools should remain strong in suppressive/clear/cold contexts; current broad row ID pools may overmix aggressive moving baits into those rows.

### Smallmouth Bass

- Topwater should be narrower than LMB summer pond topwater.
- Frogs are mostly excluded in catalog, which is good.
- Buzzbait currently allows SMB; this needs careful future review by region/month/water type.
- Clear subtle SMB tools need condition tags: tube, Ned, drop-shot, hair jig, jerkbait, soft jerkbait.

### Northern Pike

- Pike should shift toward flash/reaction in wind, not surface.
- `large_pike_topwater`, `buzzbait`, and `frog_fly`/surface flies must not be boosted by windy pike logic.
- Big-fish mode should favor large profile swimbaits, jerkbaits, bucktails, pike streamers, and flash flies where seasonally sensible.
- Several bass-coded lures remain pike-eligible through catalog or rows and need review: tube, squarebill, flat-sided, lipless, spinnerbait, buzzbait.

### Trout

- The product direction says trout is river-only and fly recommendations are streamer/topwater only.
- Current fly catalog includes many generic cross-species streamers and several trout surface flies (`popper_fly`, `deer_hair_slider`, `mouse_fly`) through global eligibility/rows.
- `mouse_fly` must be treated as summer low-light/calm big-fish upside, not generic trout surface.
- Trout rows often include very large fly pools. Future pass should decide which are true streamers/topwater for the river model and which are coverage inventory.

## Profiles Needing Careful Future Review

Highest priority:

- `buzzbait`
- `hollow_body_frog`
- `walking_topwater`
- `popping_topwater`
- `prop_bait`
- `large_pike_topwater`
- `small_floating_trout_plug`
- `mouse_fly`
- `popper_fly`
- `deer_hair_slider`
- `foam_gurgler_fly`
- `frog_fly`
- `spinnerbait`
- `bladed_jig`
- `lipless_crankbait`
- `blade_bait`
- `weightless_stick_worm`
- `ned_rig`
- `tube_jig`
- `soft_jerkbait`
- `clouser_minnow`
- `articulated_baitfish_streamer`
- `articulated_dungeon_streamer`
- `game_changer`
- `woolly_bugger`
- `rabbit_strip_leech`
- `pike_flash_fly`
- `large_articulated_pike_streamer`
- `pike_bunny_streamer`

## Keep / Rewrite Guidance

Keep as base:

- Closed ID sets.
- Basic schema shape.
- Factory-based construction.
- Surface identity invariant.
- Non-empty species/water/forage/clarity/copy invariants.
- Copy variants as source material, with future copy layer avoiding target-slot identity.

Rewrite/extend:

- Add `condition_tags` and `goal_tags`.
- Replace hard-coded condition-window ID lists with tag-based scoring.
- Replace target-slot pace display with catalog `primary_pace`.
- Tighten presentation groups.
- Audit broad species/water/clarity allowances.
- Add invariants for goal and condition tags.

Do not do in catalog pass:

- Do not add tags merely to rescue thin rows.
- Do not broaden species/water eligibility for coverage.
- Do not patch buzzbait by copy only.
