# Trout Biology Brief

## Overview

Trout in this engine are **river-only** (`freshwater_river`). The monthly layer models **where fish hold**, **how aggressively they will move on feed**, **what they are eating**, and **whether true surface presentations are biologically credible** before daily weather narrows tactics. Authoring uses seven **biome keys** (tropical, southeast_warm, appalachian_transition, northern_temperate, western_warm, western_inland, subarctic_alpine) mapped to existing `RegionKey`s for readability only; runtime region types are unchanged. Pools must stay **tight and literal**: if an archetype is not realistic on a representative day in that month and biome, it does not belong in the eligible pool.

## Thermal benchmarks

Authoring maps water temperature and day-length cues into `BaseMood` (the biological feeding ceiling before daily modifiers):

- **dormant**: Midwinter ice-edge or near-freezing water; metabolic crawl; almost no lateral chase. Rare in product except alpine/subarctic deep winter.
- **negative**: Cold water, short strikes, fish hug structure or slow slots; reaction is possible but narrow.
- **neutral_subtle**: Warming or cooling transition windows; fish feed but punish mistakes; subtle-to-moderate presentations dominate.
- **neutral**: Stable grow-season metabolism; multiple paces and columns are realistic.
- **active**: Strong feeding window (spring build, summer dawn/dusk, fall pulse); fish will move for baitfish.
- **aggressive**: Short windows (pre-spawn push, peak summer on cold rivers, fall baitfish frenzy) where faster and bolder presentations are still **cold-water-credible**—not largemouth-style aggression.
- **thermal stress**: Warm tailwaters and southern transition rivers in **Jul–Aug** often show **heat stress**: fish drop deep, slow, or nocturnal; mood drops toward **negative** or **neutral_subtle**, **not** peak `active` on the hottest sustained weeks unless the row explicitly models a cold tailwater release.

`BasePresentationStyle` sets the **upper bound of presence** (subtle → bold) that remains defensible for that mood and flow regime.

## Forage progression by biome × month

**Subarctic / alpine** (`alaska`, `mountain_alpine`):  
Year-round emphasis on **baitfish + leech_worm**; **insect_misc** as minor summer note (driftless terrestrials are not modeled as a separate system—keep streamer-first). Winter: sculpin/leech. Summer: broad baitfish; **crawfish** minor where glacial silt and stoneflies suggest sculpin/cray overlap.

**Northern temperate** (`northeast`, `great_lakes_upper_midwest`, `midwest_interior`):  
Winter–early spring: **leech_worm** and **baitfish** (slow sculpin, bugger, conehead). Prespawn–spring: **baitfish** primary, **leech_worm** secondary. Summer: **baitfish** + **insect_misc** (attractor/streamer-attractor overlap, not dry-fly logic). Fall: **baitfish** + **leech_worm**; late fall high water favors **baitfish** silhouettes (zonker, articulated) over tiny soft hackle.

**Western inland** (`mountain_west`, `inland_northwest`, `pacific_northwest`, `northern_california`, `southwest_high_desert`):  
Similar to northern but **stronger summer runoff/stain** in PNW/INW/MW: baitfish and sculpin profiles stay honest; **mouse_fly** only where brief calls a **narrow late-summer low-light bank window** (not generic summer). High desert tailwaters: **crawfish** secondary in late summer when applicable.

**Appalachian transition** (`appalachian`):  
Warm rain, stained flows, long growing season. Spring: baitfish + leech. Summer heat: **stress** bias—deeper, slower, fewer true surface nights than northern freestones. Fall: baitfish + leech pulse.

**Southeast warm** (`south_central`, `southeast_atlantic`):  
Tailwater and southern highland trout: winter leech/baitfish; spring active baitfish; **summer heat** pushes **bottom / negative** holding; fall active baitfish. **crawfish** can appear as secondary where geology supports it.

**Western warm** (`southern_california`, `southwest_desert`):  
Short cold season, long warm season; tailwater character dominates. Summer: same heat-stress rules; leech remains honest in cold releases.

**Tropical** (`florida`, `hawaii`, `gulf_coast`):  
**Out of range** for meaningful wild trout in this product—do not author primary trout rows; rely on `resolveSeasonalRow` fallbacks (see below).

## Position progression by biome × month × water type

River-only: **water type is always river**.

- **Winter (Dec–Feb):** Mid-column to **mid_low / low** holds; fish in soft current and depth changes. `base_water_column` typically **mid** authoring resolving to **mid_low** where the resolver shifts cold mid stacks.
- **Prespawn / spring (Mar–May):** Fish redistribute toward **mid** and **shallow** (high column) for feeding and spawning traffic (no spawning **system**—just position realism).
- **Summer (Jun–Aug):** **Shallow** at dawn/dusk and cold releases; **mid** default; **heat-stressed warm biomes** use **bottom** + slower mood.
- **Fall (Sep–Nov):** Back toward **mid** with **active** feeding windows; late fall **mid** holding before winter.
- **Subarctic summer:** Broad current; **shallow** credible for short windows when flows allow; still streamer-led.

## Surface viability by biome × month

- **General rule:** True **surface** and **mouse** / **popper** windows are **narrow** for trout compared to warmwater bass. If `surface_seasonally_possible === false`, **no** `is_surface` fly or lure may appear in the pool.
- **Subarctic / alpine:** `surface_seasonally_possible` **false** almost all year; no mouse in generic pools.
- **Northern temperate:** **false** Dec–Aug; **true** Sep–Nov only where **hopper-attractor / skated streamer** bank windows exist—pools may include **popper_fly** sparingly in **single-region overrides**, not blanket northern fall. Default northern fall: **true** only if pool includes a surface fly; otherwise set **false** and keep pools subsurface. **Practical authoring choice for this pass:** northern & cold fall rows use **`surface_seasonally_possible: true`** only when the fly pool includes a surface-pattern fly; **cold-classic fall pool stays subsurface-only** (no mouse, no popper) → set **`false`** for Sep–Nov cold classic to match blueprint streamer-first credibility.
- **Western inland:** **true** only on explicit **late-summer mouse** overrides (`mountain_west`, `northern_california` Jul–Aug) and **northern_california Oct** fall run; otherwise **false**.
- **Warm tailwater:** **true** Sep–Nov fall run rows where **mouse** or **popper** is biologically marginal—prefer **`false`** unless pool is explicitly surface-forward; **this pass** sets warm fall **true** only if popper/mouse in pool; warm fall pool uses **articulated / game_changer** first—set **`false`** for warm `WARM_FALL` rows.

## Presentation style by biome × month

- **Winter:** `leaning_subtle` or `subtle` moods; never `leaning_bold` unless rare tailwater trophy window (not used in default rows).
- **Spring:** `balanced` default; `leaning_subtle` in cold snaps.
- **Summer:** `balanced` on cold rivers; `leaning_subtle` under heat stress; `neutral_subtle` where brief calls for “feed but finicky.”
- **Fall:** `balanced` for baitfish pulse; `leaning_subtle` when clearing to low water.

## Hard biological constraints

1. **River-only** for trout in this product.
2. **Streamer-first fly side**—no nymph, dry, or soft-hackle systems.
3. **No surface archetypes** in any pool when `surface_seasonally_possible === false`.
4. **Eligible pool is sacred**—wrong archetype in pool = wrong recommendation.
5. **Primary IDs** are 1–3 **true lead** patterns for that month/biome, not a hedge list.
6. **Tropical / pure lowland southern** regions are **out of range** for trout primary authoring.

## Out-of-range regions

Trout are **not** meaningfully modeled for **`florida`**, **`hawaii`**, **`gulf_coast`**, or other purely lowland tropical contexts. The engine continues to resolve those `RegionKey`s via **`resolveSeasonalRow` fallbacks** (e.g. toward `south_central` / `southeast_atlantic`)—**do not add fake trout rows** for those keys.

## Citations

Authoring synthesizes general cold-water trout ecology and regional fisheries timing (holding winter depth, spring redistribution, summer thermal refugia in tailwaters, fall baitfish pulse, subarctic daylight and temperature amplitude) with the product’s **streamer-only** fly constraint (`assets/tightlines_lure_fly_recommender_blueprint.md`). For detailed life-history metrics, consult state/province agency trout management summaries and tailwater thermal regime literature for the relevant region; the brief intentionally stays **qualitative** to avoid false precision in a consumer recommender.
