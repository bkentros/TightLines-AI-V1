# Catalog Semantic Review Pass 4B

Date: 2026-05-08

Scope: v4 lure/fly catalog semantic tightening for future 2x2 scoring. This pass changed catalog metadata only. It did not change scoring code, generated seasonal rows, frontend UI, or result-card behavior.

## Master Verification Status

Status: accepted after Pass 4B.1 corrective compatibility pass.

Initial master verification found broader failures that were not covered by the builder's focused test run:

- `rebuildTripleCoverage.test.ts`: failed because current 3:3 rebuild rows no longer always fill full lure/fly sets.
- `rebuildVarietyCoverage.test.ts`: failed for Appalachian June pike lake fly coverage.
- `rebuildWeightedVariety.test.ts`: failed for trout river confidence lure coverage.
- `generatedSeasonalIntegrity.test.ts`: failed because generated trout rows still author `popper_fly` and `deer_hair_slider` after the catalog removed trout eligibility.

Catalog/seasonal compatibility scan after attempted Pass 4B found row-authored IDs whose catalog species eligibility no longer matches the row species, including:

- `ned_rig` in 168 trout rows.
- `soft_jerkbait` in 104 trout rows.
- `blade_bait` in 99 trout rows.
- `popper_fly` and `deer_hair_slider` in 59 trout rows each.
- `tube_jig`, several bass crankbaits, `buzzbait`, and multiple generic fly profiles in current pike rows.

Steering correction:

- Removing trout from `weightless_stick_worm` is correct.
- Removing trout from `ned_rig` was an overcorrection. A small Ned-style bottom finesse profile can be credible for trout river suppressed/cold-slow contexts when seasonal rows allow it.
- Future corrective work must either preserve current runtime row/catalog compatibility or coordinate catalog tightening with seasonal-row renovation and updated coverage expectations.

## Pass 4B.1 Corrective Status

Status: corrective compatibility pass completed.

Pass 4B.1 restored catalog eligibility where generated seasonal rows still author those IDs for the current 3:3 rebuild runtime. These restores are compatibility measures only; they are not final biological endorsements for the future 2x2 engine.

Corrected:

- `ned_rig` is trout-eligible again. It remains `bottom`, `slow`, `cold_slow`/`clear_subtle`, and `reliable_action`, representing a suppressed/cold-slow trout river finesse option rather than stick-worm-style trout coverage or a Big Fish profile.
- `weightless_stick_worm` stays non-trout. No trout stick worms.
- `soft_jerkbait`, `blade_bait`, `popper_fly`, `deer_hair_slider`, `unweighted_baitfish_streamer`, and `baitfish_slider_fly` regained trout compatibility temporarily because current trout rows author those IDs.
- `tube_jig`, `squarebill_crankbait`, `flat_sided_crankbait`, `deep_diving_crankbait`, `lipless_crankbait`, `buzzbait`, and generic pike-row fly profiles regained northern pike compatibility temporarily because current pike rows author those IDs.

Added coverage:

- `generatedSeasonalIntegrity.test.ts` now asserts that every generated row's authored `primary_lure_ids` and `primary_fly_ids` are compatible with that row's species and water type according to the catalog.

Pass 5 must revisit the restored broad eligibility by editing seasonal rows and regenerated row files rather than forcing the catalog to reject IDs that production rows still author.

## Accepted Semantic State After Pass 4B.1

### Lures

- `weightless_stick_worm` is now bass-only. No trout stick worms.
- `ned_rig` remains trout-compatible as `bottom`, `slow`, `cold_slow`/`clear_subtle`, and `reliable_action`; this represents suppressed/cold-slow trout river finesse, not Big Fish or generic stick-worm coverage.
- `tube_jig`, bass-coded crankbaits, `buzzbait`, and some other bass-coded profiles remain pike-compatible temporarily because current generated pike rows still author those IDs. Pass 5 should decide whether rows should remove them, replace them with pike-first inventory, or keep narrow seasonal use.
- `soft_jerkbait` and `blade_bait` remain trout-compatible temporarily because current generated trout rows still author those IDs. Pass 5 should decide which trout rows truly need them and which should shift to hair jig, spoon, inline spinner, suspending jerkbait, Ned, or fly/streamer inventory.
- `buzzbait` remains truthful as `surface`, `fast` primary pace, `medium` secondary pace, low-light/wind/dirty-vibration reaction bait with big-fish/high-risk goal tags. It must never display slow.

### Flies

- Generic fly profiles such as `clouser_minnow`, `articulated_baitfish_streamer`, leech/bugger profiles, `unweighted_baitfish_streamer`, and `baitfish_slider_fly` retain broad compatibility temporarily where current generated rows author them.
- `popper_fly` and `deer_hair_slider` retain trout compatibility temporarily because current generated trout rows still author them. Pass 5 should narrow trout surface rows so `mouse_fly`, `small_floating_trout_plug`, and appropriate streamer/topwater options carry trout surface truth.
- `popper_fly` goal tags were narrowed from high-risk to reliable/versatile. It is now treated as a more general surface action/search fly, while larger sliders, frogs, mouse patterns, and pike-specific surface profiles carry more of the big-fish/high-risk meaning.

## Still Deferred

- `spinnerbait` remains pike-eligible. This can be biologically defensible as a pike reaction/flash tool, but Pass 5 should ensure rows and future scoring do not overuse it where larger pike-first tools are better.
- `bucktail_baitfish_streamer`, `articulated_dungeon_streamer`, and `game_changer` remain pike-eligible because their profile sizes/mechanics can plausibly fit pike. Their exact pike weighting should be handled by future 2x2 scoring.
- `balanced_leech` remains trout lake-only in the authored catalog. This is semantically true to the pattern, but it conflicts with the product direction that trout recommender use is river-only. Future cleanup should decide whether it is quarantined, repurposed, or left unused by seasonal gates.
- Broad water-type allowances for some bass/trout streamers remain intentionally deferred. This pass avoided encoding regional or monthly timing into global catalog profiles.
- Presentation-group splitting for lure topwater and crankbait families remains deferred because current 3:3 runtime may still use presentation groups for variety.

## Big Fish Inventory Gap

The catalog still lacks a dedicated glidebait or glide-style swimbait profile. That remains a true gap for future big-fish mode.

Recommended Pass 4C candidate:

- Proposed id: `glidebait`
- Species: `largemouth_bass`, `smallmouth_bass`, `northern_pike`
- Water types: `freshwater_lake_pond`, possibly `freshwater_river` for large rivers after review
- Column: `mid`
- Pace: primary `slow`, secondary `medium`
- Likely condition tags: `clear_subtle`, `open_water_search`, `cover_ambush`
- Likely goal tags: `big_fish_upside`, `high_risk_high_reward`
- Why it belongs: big-fish mode needs a slow, visual, large-profile baitfish option distinct from paddle-tail swimbaits, pike jerkbaits, and large pike swimbaits. It would improve LMB/SMB big-fish coverage and can be pike-valid where large baitfish presentations are seasonally sensible.

Other possible Pass 4C candidates:

- Magdraft-style soft swimbait distinct from general `paddletail_swimbait`.
- Wakebait or crawler-style surface bait for calm/low-light bass big-fish scenarios, if seasonal rows can support it honestly.
- Large trout streamer variants may be needed if future trout 2x2 big-fish mode is too dependent on `mouse_fly` plus a small number of articulated streamers.

## Test Coverage Added

- Catalog assertions now lock the Pass 4B species boundaries for bass-coded lures, generic leech/bugger flies, and trout surface flies.
- Buzzbait regression coverage from Pass 4A remains in place to ensure the catalog does not drift back toward slow/finesse semantics.
