# Recommender rebuild — catalog expansion plan

Generated: 2026-04-25

## Executive Recommendation

Do not broaden production selection, seasonal rows, or profile shaping yet. The next implementation pass should make a small catalog-only improvement focused on fly-side macro diversity, with two safe presentation-group retags and four targeted new fly archetypes. Lure expansion is not the main bottleneck right now.

The profile geometry/catalog gap audit shows 68 flagged lanes. Every flagged lane has fewer than three fly-side presentation groups, while only 40 have fewer than three lure-side groups. The safest correction is therefore to add truthful warmwater fly patterns that create new macro groups in bottom, upper, and surface lanes without changing species/water eligibility of existing patterns just to improve metrics.

Recommended implementation order:
1. Retag two existing fly archetypes whose current `presentation_group` is too coarse.
2. Add two warmwater bass bottom flies.
3. Add one warmwater surface fly.
4. Add one pike upper/flash fly.
5. Re-run the same catalog gap, geometry, repeat-cause, and full recommender tests before considering trout lake or additional pike work.

## Lane Classification Summary

### Needs Fly Archetype Expansion

- `largemouth_bass|freshwater_lake_pond|bottom|slow|medium|fast`
- `largemouth_bass|freshwater_river|bottom|slow|medium|fast`
- `smallmouth_bass|freshwater_lake_pond|bottom|slow|medium|fast`
- `smallmouth_bass|freshwater_river|bottom|fast`
- `northern_pike|freshwater_lake_pond|upper|slow|medium|fast`
- `northern_pike|freshwater_river|upper|slow|medium|fast`
- Most warmwater `upper` fly lanes where everything currently collapses into baitfish streamer variants.

### Needs Surface Fly Expansion

- `largemouth_bass|freshwater_lake_pond|surface|slow|medium|fast`
- `largemouth_bass|freshwater_river|surface|slow|medium|fast`
- `smallmouth_bass|freshwater_lake_pond|surface|slow|medium|fast`
- `smallmouth_bass|freshwater_river|surface|slow|medium|fast`
- `northern_pike|freshwater_lake_pond|surface|slow|medium|fast`
- `northern_pike|freshwater_river|surface|slow|medium|fast`

### Likely Row/Menu Issue Rather Than Catalog Issue

- `largemouth_bass|freshwater_lake_pond|bottom|fast`
- `smallmouth_bass|freshwater_lake_pond|bottom|fast`
- `smallmouth_bass|freshwater_river|bottom|fast`
- `northern_pike|freshwater_lake_pond|bottom|fast`
- `northern_pike|freshwater_river|bottom|fast`
- `trout|freshwater_river|bottom|fast`

These have enough or nearly enough catalog breadth on at least one side, but profile/row usage can still funnel into narrow repeated lanes.

### Intentionally Left Narrow For Now

- Trout lake/pond lanes. The current trout stillwater fly catalog is thin, but adding truthful trout lake insects would likely require revisiting forage policy (`insect_misc` is not currently in trout forage policy). Do not force warmwater bass flies into trout.
- Cold winter bottom/slow rows. Repetition here is often biologically acceptable because the posture is genuinely narrow.
- Smallmouth frog lanes. Do not make `frog_fly` smallmouth-eligible just to increase surface variety.

## Proposed Retags

### 1. `deer_hair_slider`

- Current `presentation_group`: `surface_fly_popper_slider`
- Proposed `presentation_group`: `surface_fly_slider`
- No species, water, column, pace, forage, clarity, or family changes.

Why this is truthful:
`popper_fly` spits/pops water with a cupped face. `deer_hair_slider` skitters, wakes, and slides across or just under the surface. These are meaningfully different surface presentations and should not be treated as the same macro group.

Lanes helped:
- Bass, pike, and trout surface fly lanes where `popper_fly` and `deer_hair_slider` currently count as only one presentation group.

Risk:
Low. This is a diversity-label correction, not an eligibility broadening.

### 2. `baitfish_slider_fly`

- Current `presentation_group`: `baitfish_streamer`
- Proposed `presentation_group`: `baitfish_slider`
- No species, water, column, pace, forage, clarity, or family changes.

Why this is truthful:
The catalog already gives it a distinct `family_group` (`streamer_slider`) and places it in the `upper` column with a wake/dart/glide retrieve. It does not fish like a weighted Clouser, Deceiver, Game Changer, or mid-column streamer.

Lanes helped:
- Warmwater and trout `upper|medium` / `upper|fast` fly lanes.
- Pike upper fly lanes where everything currently collapses into baitfish-streamer macro identity.

Risk:
Moderate-low. This is a true presentation distinction, but it should not trigger over-splitting other streamers.

## Proposed New Archetypes

### 1. `warmwater_crawfish_fly`

- Display name: Warmwater Crawfish Fly
- Gear mode: fly
- `species_allowed`: `["largemouth_bass", "smallmouth_bass"]`
- `water_types_allowed`: `["freshwater_lake_pond", "freshwater_river"]`
- `column`: `bottom`
- `primary_pace`: `slow`
- `secondary_pace`: `medium`
- `forage_tags`: `["crawfish"]`
- `clarity_strengths`: `["clear", "stained", "dirty"]`
- `family_group`: `warmwater_crawfish_fly`
- `presentation_group`: `crawfish_fly`
- `is_surface`: `false`

Why this is truthful:
Crawfish flies are a mainstream bass fly pattern in both rivers and lakes. The current `crawfish_streamer` is smallmouth/trout river-only, which is defensible for that archetype but leaves largemouth lake/river craw fly lanes artificially empty.

Lanes helped:
- LMB lake/pond bottom slow/medium/fast fly lanes.
- LMB river bottom slow/medium/fast fly lanes.
- SMB lake/pond bottom slow/medium/fast fly lanes.
- SMB river bottom slow/medium/fast fly lanes.

Expected impact:
Adds a true bottom/craw fly macro group where the current bass bottom fly lane is dominated by `leech_bugger`.

### 2. `warmwater_worm_fly`

- Display name: Worm Fly
- Gear mode: fly
- `species_allowed`: `["largemouth_bass", "smallmouth_bass"]`
- `water_types_allowed`: `["freshwater_lake_pond", "freshwater_river"]`
- `column`: `bottom`
- `primary_pace`: `slow`
- `secondary_pace`: `medium`
- `forage_tags`: `["leech_worm"]`
- `clarity_strengths`: `["clear", "stained", "dirty"]`
- `family_group`: `worm_fly`
- `presentation_group`: `worm_fly`
- `is_surface`: `false`

Why this is truthful:
Worm-style bass flies are common, especially in ponds, slow rivers, and stained water. This should be a quiet bottom-lane alternative to buggers/leeches rather than another streamer.

Lanes helped:
- LMB and SMB bottom slow/medium fly lanes.
- Bottom fast lanes via adjacent-pace compatibility from `secondary_pace: "medium"`.
- Leech/worm forage rows that currently have many different fly IDs but only one macro group.

Expected impact:
Gives bass bottom rows a second or third true fly macro group without touching trout or pike.

### 3. `foam_gurgler_fly`

- Display name: Foam Gurgler
- Gear mode: fly
- `species_allowed`: `["largemouth_bass", "smallmouth_bass", "northern_pike"]`
- `water_types_allowed`: `["freshwater_lake_pond", "freshwater_river"]`
- `column`: `surface`
- `primary_pace`: `medium`
- `secondary_pace`: `slow`
- `forage_tags`: `["surface_prey", "baitfish"]`
- `clarity_strengths`: `["clear", "stained", "dirty"]`
- `family_group`: `fly_gurgler`
- `presentation_group`: `surface_fly_gurgler`
- `is_surface`: `true`

Why this is truthful:
Gurglers are a standard bass and pike fly pattern. They wake/gurgle differently from a hard popper/slider and are not a frog/mouse imitation. They are particularly useful for warmwater surface fishing without requiring frog cover.

Lanes helped:
- LMB lake/river surface fly lanes.
- SMB lake/river surface fly lanes.
- Pike lake/river surface fly lanes.

Expected impact:
Creates a third warmwater surface fly macro group after `surface_fly_popper_slider` / `surface_fly_slider` and `surface_fly_frog_mouse` where applicable.

Risk:
Keep trout out initially. Trout surface lanes need a separate review because mouse/popper/slider already cover river surface use, while lake trout surface insect logic is not modeled well by current forage policy.

### 4. `pike_flash_fly`

- Display name: Pike Flash Fly
- Gear mode: fly
- `species_allowed`: `["northern_pike"]`
- `water_types_allowed`: `["freshwater_lake_pond", "freshwater_river"]`
- `column`: `upper`
- `primary_pace`: `medium`
- `secondary_pace`: `fast`
- `forage_tags`: `["baitfish"]`
- `clarity_strengths`: `["clear", "stained", "dirty"]`
- `family_group`: `pike_flash_fly`
- `presentation_group`: `pike_flash_fly`
- `is_surface`: `false`

Why this is truthful:
Flash-heavy pike flies are mainstream pike tools, especially shallow and high in the water column. They fish differently from bulky rabbit/articulated mid-depth pike streamers and from small baitfish streamers.

Lanes helped:
- Pike lake/pond upper slow/medium/fast fly lanes.
- Pike river upper slow/medium/fast fly lanes.

Expected impact:
Addresses pike upper-column fly gaps without broadening bass/trout streamer eligibility.

## Archetypes Considered But Not Recommended Yet

### Smallmouth Hellgrammite Fly

Truthful for smallmouth rivers, but less helpful globally than the warmwater craw/worm additions. It would also add an `insect_misc` fly for smallmouth only. Consider later if smallmouth river bottom still repeats after the first pass.

### Trout Stillwater Chironomid / Nymph

Truthful for trout lakes, but current trout forage policy does not include `insect_misc`. Do not add this until the trout forage model is intentionally expanded.

### Smallmouth Frog Fly Eligibility

Not recommended. A frog-style fly can catch smallmouth occasionally, but making `frog_fly` smallmouth-eligible would be an eligibility broadening for metrics, not a conservative catalog truth correction.

### Pike Frog Fly River Eligibility

Not recommended now. Pike surface river lanes are thin, but `foam_gurgler_fly` is a better broad river/lake surface addition than stretching frog behavior into all pike rivers.

### Additional Lure Archetypes

Not recommended in this pass. The lure catalog already has materially better macro breadth than the fly catalog. Remaining lure lane issues appear more profile/row-menu related than catalog absence.

## Lanes Helped By Each Change

| Change | Primary lanes helped |
| --- | --- |
| `deer_hair_slider` retag | All surface fly lanes where popper/slider currently count as one macro group |
| `baitfish_slider_fly` retag | Upper fly lanes for bass, pike, and trout |
| `warmwater_crawfish_fly` | Bass bottom slow/medium/fast lake and river fly lanes |
| `warmwater_worm_fly` | Bass bottom slow/medium/fast lake and river fly lanes, leech/worm forage contexts |
| `foam_gurgler_fly` | Warmwater surface lanes for LMB, SMB, and pike across lake and river |
| `pike_flash_fly` | Pike upper slow/medium/fast lake and river fly lanes |

## Lanes Intentionally Left Narrow

- Winter LMB bottom/slow lanes in cold months: likely honest narrow behavior.
- Trout lake bottom/upper/surface lanes: real gap, but needs forage-policy review before adding insect/stillwater fly patterns.
- Trout river surface lanes: combined surface macro count is already at least three; avoid adding trout surface flies only for metrics.
- Pike bottom lanes: current lure-side breadth is adequate, and pike bottom fly repetition is less important than pike upper/surface breadth.
- Fast bottom lanes classified as row/menu issues: do not add fast-bottom flies just to satisfy a profile that may itself be questionable.

## Expected Metric Impact

Expected impact is moderate but targeted:

- Repeated fly-side `presentation_group` should improve more than lure-side metrics.
- Warmwater surface and bottom lanes should see the clearest improvement.
- Global repeated `presentation_group` may not drop dramatically because many winter/profile duplicate lanes are intentionally left narrow.
- Family-group repeats should improve if new archetypes use distinct `family_group` values as specified.
- Southern LMB frog candidate/finalist rate should remain 100%; frog pick rate may drop slightly if `foam_gurgler_fly` competes in surface slots, so this must be audited.

Target acceptance for implementation pass:

- Invalid-pick cells remain 0.
- Southern LMB frog candidate/finalist remains 100% when a surface slot exists.
- Southern LMB frog pick rate should not collapse below roughly the current high-50% range without explicit product approval.
- Repeated presentation-group rate should improve by more than the 0.30 points seen in the profile-only prototype.

## Risks

- Adding too many warmwater flies could make fly recommendations feel artificially broad if seasonal rows do not list them. Mitigation: add catalog entries first, then audit row menus before including everywhere.
- `foam_gurgler_fly` could reduce frog pick share in southern LMB surface contexts. Mitigation: rerun frog candidate/finalist/pick metrics immediately.
- Retagging `baitfish_slider_fly` could over-split streamers if applied as a general pattern. Mitigation: retag only this high-column slider, not all baitfish streamers.
- Trout lake gaps remain unresolved. Mitigation: treat trout stillwater insect modeling as a separate design pass.

## Implementation Order

1. Update ID unions in `contracts.ts` for the four new fly IDs.
2. Add the four fly archetypes in `flies.ts`.
3. Retag `deer_hair_slider` and `baitfish_slider_fly`.
4. Add factory/catalog invariant tests for new IDs, presentation groups, surface flags, and eligibility.
5. Run focused catalog validation tests.
6. Regenerate and rerun:
   - `deno test supabase/functions/_shared/recommenderEngine`
   - `deno run -A scripts/audit-recommender-geometry-pool-comparison.ts`
   - `deno run -A scripts/audit-recommender-repeat-cause-analysis.ts`
   - `deno run -A scripts/audit-recommender-profile-geometry-catalog-gap.ts`
7. Review southern LMB frog pick rate and pike/smallmouth surface outputs before accepting.

## Final Recommendation

The next pass should be implementation, not more review, but it should be limited to the two retags and four new fly archetypes listed above. Do not change lure catalog, seasonal rows, selector rescue, or `shapeProfiles.ts` in the same pass.
