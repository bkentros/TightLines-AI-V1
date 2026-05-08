# Seasonal Row Renovation Preflight Pass 5A

Date: 2026-05-08  
Scope: audit only. No seasonal CSV rows, generated seasonal files, catalog profiles, runtime code, frontend code, or tests were changed.

## Purpose

Pass 5A identifies seasonal row changes for Pass 5B+ before editing `data/seasonal-matrix/*.csv`.

Seasonal rows should express presentation biology:

- whether surface is seasonally possible
- seasonal column envelope: bottom, mid, upper, surface
- seasonal pace envelope: slow, medium, fast
- forage emphasis
- curated seasonal allowed lure/fly IDs

Rows should not become arbitrary forever-bans, and they should not stay padded forever to satisfy the old 3:3 runtime.

## Audit Method

Inspected generated runtime rows:

- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/largemouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/smallmouth_bass.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`
- `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts`

Used Deno one-off row scans against generated rows and current v4 catalogs. No reusable script was added.

Compatibility scan result: after Pass 4B.1, every generated row's authored `primary_lure_ids` and `primary_fly_ids` is compatible with the row species and water type according to the catalog. This is current-runtime compatibility, not final biological approval.

## Pass 5B Result

Status: completed.

Pass 5B removed `popper_fly` and `deer_hair_slider` from trout `primary_fly_ids` in `data/seasonal-matrix/trout.csv` and regenerated `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts`.

Scope notes:

- `surface_seasonally_possible`, `column_range`, and `pace_range` were unchanged.
- `mouse_fly` and `small_floating_trout_plug` remain in trout surface rows.
- `baitfish_slider_fly` and `unweighted_baitfish_streamer` remain for future review.
- `ned_rig` and trout lure-side rows were not changed.

## Pass 5C Result

Status: completed.

Pass 5C removed `baitfish_slider_fly` from trout rows where `surface_seasonally_possible` is `false`, then regenerated `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/trout.ts`.

Before/after counts:

| ID | Before Pass 5C | After Pass 5C | Notes |
| --- | ---: | ---: | --- |
| `baitfish_slider_fly` total trout rows | 104 | 59 | Now present only in trout surface rows. |
| `baitfish_slider_fly` non-surface trout rows | 45 | 0 | Removed from cold/shoulder non-surface rows. |
| `baitfish_slider_fly` surface trout rows | 59 | 59 | Intentionally unchanged in this pass. |
| `unweighted_baitfish_streamer` trout rows | 104 | 104 | Intentionally unchanged for later review. |
| `popper_fly` trout rows | 0 | 0 | Remains absent after Pass 5B. |
| `deer_hair_slider` trout rows | 0 | 0 | Remains absent after Pass 5B. |
| `weightless_stick_worm` trout rows | 0 | 0 | Remains absent. |

Scope notes:

- `surface_seasonally_possible`, `column_range`, and `pace_range` were unchanged.
- `mouse_fly`, `small_floating_trout_plug`, `unweighted_baitfish_streamer`, and `ned_rig` were not changed.
- Surface-row `baitfish_slider_fly` remains for a later trout surface-window review.

## Pass 5D Result

Status: repaired by Pass 5D.1.

Pass 5D removed `tube_jig` from northern pike `primary_lure_ids` in `data/seasonal-matrix/northern_pike.csv` and regenerated `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`.

Before/after counts:

| ID | Before Pass 5D | After Pass 5D | Notes |
| --- | ---: | ---: | --- |
| `tube_jig` northern pike rows | 216 | 0 | Removed as bass-coded bottom finesse padding. |
| `pike_jig_and_plastic` northern pike rows | 216 | 216 | Pike-first bottom/soft-plastic inventory preserved. |
| `pike_jerkbait` northern pike rows | 216 | 216 | Pike-first reaction/search inventory preserved. |
| `large_profile_pike_swimbait` northern pike rows | 216 | 216 | Pike-first large-profile inventory preserved. |
| `casting_spoon` northern pike rows | 216 | 216 | Pike-relevant flash/search inventory preserved. |

Scope notes:

- Pike crankbaits, `buzzbait`, and generic fly profiles were not changed.
- Trout and bass CSV rows were not edited in Pass 5D.
- Catalog profiles, runtime logic, scoring, selector behavior, frontend, cache/session logic, and migrations were not changed.

Coverage note:

- Initial Pass 5D failed `rebuildTripleCoverage.test.ts` for 41 northern pike river rows under suppressive conditions, with 2 lure picks and 3 fly picks. The failing row set was pike river bottom/mid slow/medium rows in cold/shoulder months in most pike regions, plus south-central July/August.
- Pass 5D.1 repaired this without re-adding `tube_jig`.

## Pass 5D.1 Result

Status: completed.

Pass 5D.1 added a pike-first `large_pike_tube` lure profile and authored it only into the 41 northern pike river rows with `column_range=bottom|mid`, `column_baseline=bottom`, `pace_range=slow|medium`, and `pace_baseline=slow`.

Before/after counts:

| ID | Before Pass 5D.1 | After Pass 5D.1 | Notes |
| --- | ---: | ---: | --- |
| `tube_jig` northern pike rows | 0 | 0 | Stays removed from pike rows. |
| `large_pike_tube` northern pike rows | 0 | 41 | Added only to affected pike river suppressive-geometry rows. |
| `large_pike_tube` off-geometry northern pike rows | 0 | 0 | No lake rows, bass rows, trout rows, or broader pike rows authored. |
| `pike_jig_and_plastic` northern pike rows | 216 | 216 | Preserved. |
| `pike_jerkbait` northern pike rows | 216 | 216 | Preserved. |
| `large_profile_pike_swimbait` northern pike rows | 216 | 216 | Preserved. |
| `casting_spoon` northern pike rows | 216 | 216 | Preserved. |

Profile note:

- `large_pike_tube` is pike-only, bottom, slow/medium, baitfish/perch-oriented, and tagged for `cold_slow`, `current_swing`, and `cover_ambush`.
- It is intentionally distinct from generic bass `tube_jig` and from `pike_jig_and_plastic`.

## Pass 5D.2 Result

Status: manifest ready; image asset deferred.

Pass 5D.2 added a `large_pike_tube` entry to `scripts/data/recommenderTackleImageManifest.ts`, but did not generate `assets/images/lures/large_pike_tube.png` because the OpenAI API account hit a billing hard limit. Brandon plans to generate images for all lures and flies near the end of the renovation, so this is deferred asset work rather than a blocker for continued seasonal/catalog/engine passes.

Asset note:

- `assets/images/lures/large_pike_tube.png` is still missing.
- `lib/lureImages.ts` intentionally has no `large_pike_tube` mapping until the PNG exists.
- Before public release, ensure `large_pike_tube` and every other recommendable lure/fly ID has a generated image and a `lib/lureImages.ts` / `lib/flyImages.ts` mapping.

## Pass 5E Result

Status: completed.

Pass 5E removed `woolly_bugger` from northern pike `primary_fly_ids` in `data/seasonal-matrix/northern_pike.csv` and regenerated `supabase/functions/_shared/recommenderEngine/v4/seasonal/generated/northern_pike.ts`.

Before/after counts:

| ID | Before Pass 5E | After Pass 5E | Notes |
| --- | ---: | ---: | --- |
| `woolly_bugger` northern pike rows | 216 | 0 | Removed as too generic/small for every-row pike fly inventory. |
| `pike_bunny_streamer` northern pike rows | 216 | 216 | Preserved. |
| `large_articulated_pike_streamer` northern pike rows | 216 | 216 | Preserved. |
| `pike_flash_fly` northern pike rows | 102 | 102 | Preserved where currently authored. |
| `rabbit_strip_leech` northern pike rows | 216 | 216 | Intentionally unchanged for later review. |
| `clouser_minnow` northern pike rows | 216 | 216 | Intentionally unchanged for later review. |
| `jighead_marabou_leech` northern pike rows | 216 | 216 | Intentionally unchanged for later review. |
| `lead_eye_leech` northern pike rows | 216 | 216 | Intentionally unchanged for later review. |
| `feather_jig_leech` northern pike rows | 216 | 216 | Intentionally unchanged for later review. |

Scope notes:

- No trout or bass rows were edited in Pass 5E.
- No catalog profiles, species eligibility, runtime logic, scoring, selector behavior, frontend, cache/session logic, migrations, or image assets were changed.

## Targeted ID Usage Summary

### Trout Fly Rows

| ID | Rows | Months | Regions | Water types | Surface rows | Pass 5A read |
| --- | ---: | --- | --- | --- | ---: | --- |
| `popper_fly` | 0 after Pass 5B (59 before) | removed | none | river | 0 after Pass 5B | Removed from trout rows in Pass 5B as warmwater/generic surface fly inventory. |
| `deer_hair_slider` | 0 after Pass 5B (59 before) | removed | none | river | 0 after Pass 5B | Removed from trout rows in Pass 5B as too broad for trout surface inventory. |
| `baitfish_slider_fly` | 59 after Pass 5C (104 before) | surface months only | all 14 trout regions | river | 59 | Removed from 45 non-surface cold/shoulder rows in Pass 5C; surface-row use still needs future review. |
| `unweighted_baitfish_streamer` | 104 | 3-11 | all 14 trout regions | river | 59 | More plausible than slider as a high-riding streamer, but current usage is too broad across months/regions. |

### Trout Lure Rows

| ID | Rows | Months | Regions | Water types | Surface rows | Pass 5A read |
| --- | ---: | --- | --- | --- | ---: | --- |
| `ned_rig` | 168 | 1-12 | all 14 trout regions | river | 59 | Keep as potentially valid bottom/slow suppressed/cold-slow trout river finesse; do not treat as stick-worm coverage or Big Fish. |
| `soft_jerkbait` | 104 | 3-11 | all 14 trout regions | river | 59 | Review by month/region. Likely keep narrower warm/search windows; remove from cold/early runoff rows where inline spinner, spoon, hair jig, Ned, or streamer inventory is better. |
| `blade_bait` | 99 | 1-5, 10-12 | all 14 trout regions | river | 0 | Cold/shoulder bottom option. Keep in cold/slow rows only if row column/pace supports it; remove from rows where it is only old coverage padding. |
| `weightless_stick_worm` | 0 | none | none | none | 0 | Correctly absent from trout rows and catalog trout eligibility. Keep absent. |

### Pike Bass-Coded Lure Rows

| ID | Rows | Months | Regions | Water types | Surface rows | Pass 5A read |
| --- | ---: | --- | --- | --- | ---: | --- |
| `tube_jig` | 0 after Pass 5D (216 before) | removed | none | lake/pond, river | 0 after Pass 5D | Removed from northern pike rows in Pass 5D as bass-coded bottom finesse padding. |
| `large_pike_tube` | 41 after Pass 5D.1 | cold/shoulder suppressive river geometry | affected pike regions | river | 0 | Added as pike-first cold/slow bottom repair inventory for rows that lost 3:3 coverage after `tube_jig` removal. |
| `squarebill_crankbait` | 120 | 1-11 | all 9 pike regions | lake/pond, river | 36 | Bass-coded shallow crank. Remove from many pike rows; if kept, narrow to specific warm shallow reaction windows after review. |
| `flat_sided_crankbait` | 120 | 1-11 | all 9 pike regions | lake/pond, river | 36 | Bass-coded cold/clear crank. Likely remove from pike rows or replace with jerkbait/spoon/bucktail/swimbait profiles. |
| `deep_diving_crankbait` | 108 | 1-12 | all 9 pike regions | lake/pond only | 20 | Lake-only pike row usage; needs human review. Could be replaced with large pike swimbait/jerkbait/bucktail in most rows. |
| `lipless_crankbait` | 120 | 1-11 | all 9 pike regions | lake/pond, river | 36 | Bass-coded reaction bait; likely replace with pike jerkbait, casting spoon, bucktail, pike swimbait, or blade/spinner profiles. |
| `buzzbait` | 36 | 4-8 | all 9 pike regions | lake/pond, river | 36 | Surface + fast bait. Pike can hit surface, but this is not pike-first. Remove from most pike rows; use pike topwater only in narrow calm/warm windows. |

### Pike Generic Fly Rows

| ID | Rows | Months | Regions | Water types | Surface rows | Pass 5A read |
| --- | ---: | --- | --- | --- | ---: | --- |
| `clouser_minnow` | 216 | 1-12 | all 9 pike regions | lake/pond, river | 36 | Present in every pike row. Too generic as year-round pike fly inventory; replace many rows with `pike_flash_fly`, `pike_bunny_streamer`, and `large_articulated_pike_streamer`. |
| `woolly_bugger` | 0 after Pass 5E (216 before) | removed | none | lake/pond, river | 0 after Pass 5E | Removed from northern pike rows in Pass 5E as too generic/small for every-row pike fly inventory. |
| `rabbit_strip_leech` | 216 | 1-12 | all 9 pike regions | lake/pond, river | 36 | More plausible than bugger, but still generic; narrow or replace with pike bunny streamer where the row wants a large leech/profile. |
| `jighead_marabou_leech` | 216 | 1-12 | all 9 pike regions | lake/pond, river | 36 | Likely padding. Remove broadly unless a specific cold/slow row needs a jigged fly and no better pike-first profile exists. |
| `lead_eye_leech` | 216 | 1-12 | all 9 pike regions | lake/pond, river | 36 | Likely padding. Remove broadly or reserve for very specific cold/clear bottom lanes after review. |
| `feather_jig_leech` | 216 | 1-12 | all 9 pike regions | lake/pond, river | 36 | Too broad as every-row pike inventory. Replace with pike-first flash/profile tools in most rows. |

## Concrete Seasonal Cleanup Action Table

| Species | Region | Month | Water type | Issue type | Current row signal | Recommended action | Rationale |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| trout | all trout regions | 5-9 | river | Warmwater/generic trout surface flies | `popper_fly`, `deer_hair_slider` removed in Pass 5B; formerly 59 surface rows | Completed in Pass 5B | Trout surface should not globally mirror warmwater popper/slider inventory; `mouse_fly` and `small_floating_trout_plug` are more credible surface specialists. |
| trout | appalachian, northern_california, south_central, southeast_atlantic, southern_california, southwest_high_desert | 5 | river | Early trout surface timing | May surface rows still include full column/pace range plus `small_floating_trout_plug` and `mouse_fly`; popper/slider removed in Pass 5B | Narrow months / needs human review | May may be plausible in some warm regions, but mouse/topwater should not be blanket all-conditions surface. |
| trout | all trout regions | 3-11 | river | Questionable high-riding fly breadth | `baitfish_slider_fly` now only in 59 surface rows after Pass 5C; `unweighted_baitfish_streamer` remains in 104 rows | Continue future review; do not remove `unweighted_baitfish_streamer` until a dedicated pass | These can be streamer/topwater-adjacent, but current March-November all-region use is too broad for seasonal truth. |
| trout | all trout regions | 1-12 | river | Trout finesse lure | `ned_rig` in all 168 trout rows | Keep, then narrow only if later row biology demands it | Accepted as bottom/slow suppressed/cold-slow trout river finesse; not Big Fish and not stick-worm coverage. |
| trout | all trout regions | 3-11 | river | Trout lure-side jerkbait breadth | `soft_jerkbait` in 104 rows | Narrow months / human review | Could be a baitfish search lure in active periods, but row use spans too many regions/months. |
| trout | all trout regions | 1-5, 10-12 | river | Cold/shoulder lure-side reaction | `blade_bait` in 99 non-surface rows | Keep only in cold/slow bottom/mid rows; remove if row column/pace is only coverage | Better fit in cold/slow or shoulder contexts, not blanket trout lure inventory. |
| trout | all trout regions | none | river | Stick worm trout coverage | `weightless_stick_worm` absent from trout rows | Keep absent | Catalog and rows should not use trout stick worms. |
| northern_pike | all pike regions | 1-12 | lake/pond, river | Bass-coded bottom finesse | `tube_jig` removed in Pass 5D; formerly all 216 pike rows | Completed after Pass 5D.1 repair | Every-row pike tube usage looked like old 3:3 padding; Pass 5D.1 repaired the current 3:3 coverage gap with pike-first `large_pike_tube` in 41 affected river rows. |
| northern_pike | all pike regions | 1-11 | lake/pond, river | Bass-coded crankbait inventory | `squarebill_crankbait`, `flat_sided_crankbait`, `lipless_crankbait` in 120 rows each | Replace with existing profile / human review | Pike reaction should lean jerkbait, spoon, bucktail, swimbait, spinner/flash; bass cranks should be exceptional. |
| northern_pike | all pike regions | 1-12 | lake/pond | Deep crankbait pike inventory | `deep_diving_crankbait` in 108 lake rows | Replace with existing profile / human review | Lake pike may use deeper baitfish presentations, but pike-first swimbait/jerkbait/bucktail profiles are better defaults. |
| northern_pike | all pike regions | 4-8 | lake/pond, river | Pike surface generic buzzbait | `buzzbait` in all 36 pike surface rows | Future pike cleanup; use `large_pike_topwater` only in narrow calm/warm rows | Wind/reaction pike behavior should not imply topwater; buzzbait is bass-coded even if pike can hit it. |
| northern_pike | all pike regions | 1-12 | lake/pond, river | Generic pike fly inventory | `woolly_bugger` removed in Pass 5E; five generic fly profiles still in every pike row | Replace with existing pike-first profiles | Current every-row use likely exists for old 3:3 coverage; pike fly recommendations should emphasize size, flash, and profile. |
| northern_pike | all pike regions with surface rows | 4-8 | lake/pond, river | Pike surface timing | 36 surface rows include full column/pace, buzzbait, popper/slider/frog/gurgler signals | Narrow months / human review | Surface can be real, but should be calm/warm and separate from wind/flash reaction logic. |
| largemouth_bass | midwest_interior | 5 | lake/pond | Northern/cooler early bass surface | Surface true; walking topwater, buzzbait, popper/slider/gurgler signals | Needs human review by state/region mapping | May surface may be right for some Midwest water and too early for colder northern lakes. Confirm resolver region mapping before editing. |
| smallmouth_bass | northern/cooler regions | <=5 | lake/pond, river | Early SMB topwater | No generated northern/cooler early rows found in the targeted scan | Keep | Current generated rows did not show northern/cooler SMB surface before June; continue reviewing June buzzbait/topwater scope in a later bass surface pass. |
| all species | rows with very large ID pools | varies | lake/pond, river | Old 3:3 padding pressure | Many rows carry broad all-column/all-pace pools and G8/padded notes from old coverage requirements | Human review; trim to true seasonal allowed IDs | 2x2 should need fewer but truer seasonal IDs, not large pools built to satisfy three slots. |
| bass and pike | future Big Fish rows | varies | lake/pond, river | Inventory gap rows cannot solve alone | Big Fish mode lacks a true glidebait/glide-style swimbait profile | Needs new archetype later | Seasonal rows can choose existing IDs, but cannot invent this major big-fish presentation. Keep glidebait for Pass 4C/5C review. |

## Region/Month Detail

### Trout Questionable Fly Rows

| Species | Region | Water | IDs | Months | Row count | Recommended action |
| --- | --- | --- | --- | --- | ---: | --- |
| trout | all 14 trout regions | river | `baitfish_slider_fly`, `unweighted_baitfish_streamer`; `popper_fly`/`deer_hair_slider` removed in Pass 5B | surface windows, mostly 5-9 with cooler-region variation | 59 surface rows still carry baitfish slider/unweighted streamer | Review surface-row slider/unweighted streamer by warm months. |
| trout | all 14 trout regions | river | `unweighted_baitfish_streamer`; `baitfish_slider_fly` removed from non-surface rows in Pass 5C | non-surface shoulder windows from 3-11 depending region | 45 additional rows | Review `unweighted_baitfish_streamer` later; slider cleanup is complete for non-surface rows. |

### Trout Lure Rows

| Species | Region | Water | IDs | Months | Row count | Recommended action |
| --- | --- | --- | --- | --- | ---: | --- |
| trout | all 14 trout regions | river | `ned_rig` | 1-12 | 168 | Keep as valid bottom/slow finesse unless individual rows prove otherwise. |
| trout | all 14 trout regions | river | `soft_jerkbait` | 3-11 | 104 | Narrow to active baitfish/search periods; likely remove from some early/late rows. |
| trout | all 14 trout regions | river | `blade_bait` | 1-5, 10-12 | 99 | Keep only where bottom/mid and slow/medium cold or shoulder geometry is intentional. |
| trout | all 14 trout regions | river | `weightless_stick_worm` | none | 0 | Keep absent. |

### Pike Bass-Coded Lure Rows

| Species | Region | Water | IDs | Months | Row count | Recommended action |
| --- | --- | --- | --- | --- | ---: | --- |
| northern_pike | all 9 pike regions | lake/pond, river | `tube_jig` | 1-12 | 216 before Pass 5D, 0 after Pass 5D | Removed; coverage repaired in Pass 5D.1. |
| northern_pike | affected pike regions | river | `large_pike_tube` | cold/shoulder suppressive geometry | 41 after Pass 5D.1 | Keep as pike-first repair inventory; revisit only when 2x2 removes old 3-slot pressure. |
| northern_pike | all 9 pike regions | lake/pond, river | `squarebill_crankbait`, `flat_sided_crankbait`, `lipless_crankbait` | 1-11 | 120 each | Remove or keep only narrow, human-reviewed shallow reaction exceptions. |
| northern_pike | all 9 pike regions | lake/pond | `deep_diving_crankbait` | 1-12 | 108 | Replace with pike-first deep/mid baitfish profiles where possible. |
| northern_pike | all 9 pike regions | lake/pond, river | `buzzbait` | 4-8 | 36 | Remove from most pike rows; if surface stays, prefer `large_pike_topwater` in calm/warm rows. |

### Pike Generic Fly Rows

| Species | Region | Water | IDs | Months | Row count | Recommended action |
| --- | --- | --- | --- | --- | ---: | --- |
| northern_pike | all 9 pike regions | lake/pond, river | `woolly_bugger` | 1-12 before Pass 5E | 216 before Pass 5E, 0 after Pass 5E | Removed in Pass 5E. |
| northern_pike | all 9 pike regions | lake/pond, river | `clouser_minnow`, `rabbit_strip_leech`, `jighead_marabou_leech`, `lead_eye_leech`, `feather_jig_leech` | 1-12 | 216 each | Replace or narrow aggressively in later passes. Default pike fly pool should be `pike_flash_fly`, `pike_bunny_streamer`, `large_articulated_pike_streamer`, and other pike-first profiles. |

## Surface Timing Risks

### Trout May Surface Rows

These six May rows need first human review because they open full surface and carry broad topwater signals:

| Species | Region | Month | Water type | Issue type | Current row signal | Recommended action | Rationale |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| trout | appalachian | 5 | river | May trout surface | full column/pace; `small_floating_trout_plug`, `mouse_fly`; popper/slider removed in Pass 5B | Narrow months / human review | May can be plausible but broad surface + mouse is still permissive. |
| trout | northern_california | 5 | river | May trout surface | same as above | Narrow months / human review | Keep only if row biology supports warm low-light surface. |
| trout | south_central | 5 | river | May trout surface | same as above | Narrow months / human review | Warm region may justify some surface; warmwater fly padding is already removed. |
| trout | southeast_atlantic | 5 | river | May trout surface | same as above | Narrow months / human review | Warm region may justify surface; mouse should be narrower than generic May. |
| trout | southern_california | 5 | river | May trout surface | same as above | Narrow months / human review | Keep only specific topwater/plugs with rationale. |
| trout | southwest_high_desert | 5 | river | May trout surface | same as above | Narrow months / human review | Review low-light/calm assumption after generic popper/slider removal. |

### Pike Surface Rows

Current pike surface rows are all full column/full pace and include broad surface signals. A future pike cleanup pass should separate pike reaction/flash from topwater.

| Species | Region | Month(s) | Water type | Issue type | Current row signal | Recommended action | Rationale |
| --- | --- | --- | --- | --- | --- | --- | --- |
| northern_pike | south_central | 4-5 | lake/pond | Early warm pike surface | `large_pike_topwater`, `buzzbait`, popper/slider/frog flies | Human review / narrow | Could be plausible earliest pike surface, but should not be broad all-pace surface. |
| northern_pike | appalachian, midwest_interior | 5-6 lake; 6 river | lake/pond, river | Spring/early summer pike surface | lake rows use `large_pike_topwater` + `buzzbait`; river rows use `buzzbait` plus surface flies | Narrow months / replace IDs | Keep pike-first topwater only where warm/calm; remove buzzbait/frog fly padding. |
| northern_pike | great_lakes_upper_midwest, inland_northwest, mountain_west, northeast | 6-7 | lake/pond, river | Northern pike summer surface | same broad pike surface package | Narrow / replace IDs | Surface can be real in summer, but daily wind should gate hard and row IDs should be pike-first. |
| northern_pike | alaska, mountain_alpine | 6-8 | lake/pond, river | Cool-region pike summer surface | same broad pike surface package | Human review | Cooler regions may justify shorter windows; current all-pace/full-surface rows are too broad. |

### Northern/Cooler Bass Early Surface Rows

| Species | Region | Month | Water type | Issue type | Current row signal | Recommended action | Rationale |
| --- | --- | ---: | --- | --- | --- | --- | --- |
| largemouth_bass | midwest_interior | 5 | lake/pond | Early northern/cooler surface | full column/pace; `walking_topwater`, `buzzbait`, `popper_fly`, `deer_hair_slider`, `foam_gurgler_fly` | Needs human review | May can be valid in parts of Midwest Interior but too early for some colder states/waters. Confirm region/state mapping before editing. |
| smallmouth_bass | northern/cooler regions | <=5 | lake/pond, river | Early topwater | targeted scan found no surface rows before June | Keep | Current surface timing looks safer than LMB. Review June rows and buzzbait scope in a later bass surface pass. |

## Big Fish Inventory Gap

Seasonal row edits cannot solve missing catalog inventory.

Keep `glidebait` as a likely future catalog/inventory pass candidate:

| Candidate | Species | Water types | Column | Pace | Likely tags | Why rows cannot solve it |
| --- | --- | --- | --- | --- | --- | --- |
| `glidebait` | LMB, SMB, possibly pike | lake/pond, large rivers after review | mid | slow/medium | `clear_subtle`, `open_water_search`, `cover_ambush`; `big_fish_upside`, `high_risk_high_reward` | Big Fish mode needs a slow, visual, large-profile baitfish choice distinct from current swimbait/jerkbait/bucktail profiles. Rows can only choose existing IDs. |

Do not add this inside a seasonal-row cleanup pass. Keep it for a dedicated catalog/inventory pass after the current row cleanup risk is lower.

## Seasonal Cleanup Priorities After Pass 5B

1. Start with trout rows because they carry the sharpest product-scope conflict: river-only, streamer/topwater fly direction, but broad warmwater surface fly and high-riding baitfish rows.
2. Keep `ned_rig` in trout rows initially, but document it as bottom/slow reliable finesse, not Big Fish.
3. Pass 5B removed trout `popper_fly` and `deer_hair_slider`.
4. Pass 5C removed `baitfish_slider_fly` from non-surface trout rows; review remaining surface-row `baitfish_slider_fly` and broader `unweighted_baitfish_streamer` use by month next.
5. Review trout May surface rows before broad summer surface rows.
6. Rebuild pike rows around pike-first lures/flies, especially replacing all-row generic fly inventory and remaining bass-coded crankbait/buzzbait row padding. `tube_jig` is already removed from pike rows, with Pass 5D.1 coverage repaired by `large_pike_tube`.
7. Review pike surface rows separately from wind/reaction rows. Wind should promote flash/reaction, not topwater.
8. Review Midwest Interior LMB May lake surface after confirming state/region routing.
9. After row edits, regenerate seasonal TS and rerun generated seasonal integrity plus rebuild coverage tests.

## Explicit Non-Actions In Pass 5A

- Did not edit `data/seasonal-matrix/*.csv`.
- Did not edit generated seasonal TypeScript files.
- Did not change catalog files.
- Did not change frontend/backend/runtime code.
- Did not add `glidebait`.
- Did not change tests.
