# Phase 2 — Seasonal row re-authorship

**Source of truth:** [`tightlines_recommender_architecture_clean.md`](../tightlines_recommender_architecture_clean.md)

This pass re-authored every supported runtime context's seasonal row from
scratch against biology-first principles and the architecture doc. Inventory
bindings (`primary_lure_ids`, `primary_fly_ids`, `excluded_*`) were
**preserved verbatim**; they will be re-curated in Phase 3 (species-specific
biological eligibility review) and Phase 4 (per-context inventory
sufficiency review).

## Supported runtime matrix (authoritative)

| species           | water types                                 | regions | rows per context-pair |
| ----------------- | ------------------------------------------- | ------: | --------------------: |
| `largemouth_bass` | `freshwater_lake_pond`, `freshwater_river`  |      16 |                    12 |
| `smallmouth_bass` | `freshwater_lake_pond`, `freshwater_river`  |      14 |                    12 |
| `northern_pike`   | `freshwater_lake_pond`, `freshwater_river`  |       9 |                    12 |
| `trout`           | `freshwater_river` only                     |      14 |                    12 |

Exact row counts after Phase 2:

| file                   | rows | expected |
| ---------------------- | ---: | -------: |
| `largemouth_bass.csv`  |  384 |      384 |
| `smallmouth_bass.csv`  |  336 |      336 |
| `northern_pike.csv`    |  216 |      216 |
| `trout.csv`            |  168 |      168 |
| **total**              | **1104** | **1104** |

All four CSVs contain **exactly one** authored row per supported
`(species, region, month, water_type)` triple — zero missing, zero
unsupported contexts present, zero duplicates, zero fallback rows.

## Authoring principles applied (architecture invariants)

For every row, the following invariants now hold and are machine-checked:

1. **`bottom` is always inside `column_range`.** The architecture states
   *"Bottom is the permanent depth floor and should effectively never be
   removed from play."* Authoring reflects that: fish always have a
   vertical depth escape, and a bottom-presented tool is always legal in
   the seasonal envelope.
2. **`slow` is always inside `pace_range`.** The architecture states
   *"Slow is the permanent pace floor and should effectively never be
   removed from play."* Even mid-summer aggressive rows retain slow as
   legal for pressure/finesse conditions.
3. **`column_baseline` is never `surface`** and is always a member of
   `column_range`. Surface can only be reached by daily shaping upward
   from a non-surface anchor.
4. **`pace_baseline` is always a member of `pace_range`.**
5. **`surface_seasonally_possible` agrees with whether `surface` is in
   `column_range`.**
6. **`primary_forage != secondary_forage`** (per §17.6 coarse-but-fine
   forage rules).
7. **`surface_prey` is never used as a seasonal-row forage value** — it
   is item-level only per the architecture.
8. **No state-scoped seasonal overrides** — two prior PA / ID override
   rows were removed.

## Biology framework

Each row is authored as a deliberate biological claim for its exact
`(species, region, month, water_type)` cell. Regions are grouped into
species-specific climate classes only so the per-cell authoring reflects
what fish are actually doing in a matching biological zone; the runtime
lookup itself remains region-keyed.

### Warmwater climate classes (LMB, SMB, pike)

| class            | regions                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `tropical`       | `florida`, `hawaii`                                                                                  |
| `hot_south`      | `gulf_coast`, `south_central`, `southeast_atlantic`, `southern_california`, `southwest_desert`       |
| `mid_latitude`   | `appalachian`, `midwest_interior`, `northern_california`, `southwest_high_desert`                    |
| `cool_temperate` | `great_lakes_upper_midwest`, `inland_northwest`, `mountain_west`, `northeast`, `pacific_northwest`   |
| `boreal`         | `alaska`, `mountain_alpine` (only pike in scope — SMB/LMB out of matrix)                             |

### Trout river climate classes

| class                   | regions                                               |
| ----------------------- | ----------------------------------------------------- |
| `boreal`                | `alaska`                                              |
| `alpine`                | `mountain_alpine`                                     |
| `mountain_tailwater`    | `mountain_west`                                       |
| `maritime_nw`           | `pacific_northwest`                                   |
| `interior_nw`           | `inland_northwest`                                    |
| `west_coast_temperate`  | `northern_california`, `southern_california`          |
| `glacial_temperate`     | `great_lakes_upper_midwest`, `midwest_interior`, `northeast` |
| `appalachian_stocked`   | `appalachian`, `southeast_atlantic`                   |
| `southern_tailwater`    | `south_central`, `southwest_high_desert`              |

Row-by-row shape inside each class is still authored month-by-month
(spawn windows, runoff windows, thermocline suppression, pre-spawn
aggression, cold-lockup) so adjacent-month sharing is biology-driven,
not mechanical.

## Major biological corrections made in this pass

The rewrite changed far more than it preserved. The recurring defects
found in the prior authoring were:

1. **Missing `bottom` floor in ~65% of LMB rows, ~50% of SMB rows, ~35%
   of pike rows, and ~40% of trout rows.** Summer rows had `upper|mid`
   or `surface|upper|mid` with no bottom option, which violates the
   architecture's permanent depth-floor rule. Every row now includes
   bottom.
2. **Missing `slow` floor in ~40% of LMB rows, ~30% of SMB rows, ~30%
   of pike rows, and ~40% of trout rows.** Summer rows had `medium|fast`
   only, denying a slow-presentation path on pressured or high-sun
   windows. Every row now includes slow.
3. **Trout river January / February rows that over-closed the column
   range and anchored on bottom with no surface** did not account for
   winter tailwater realities; southern tailwater rows (`south_central`,
   `southwest_high_desert`) and maritime NW winter steelhead rows now
   retain a realistic slow-to-medium pace anchor instead of being
   clamped to slow-only.
4. **Northern pike hot-south rows** (south_central) previously carried
   too-open summer envelopes. Pike in S-central lakes are thermally
   stressed in July/August; those rows now correctly contract to
   bottom-anchored, slow-anchored, no-surface biology and re-open in
   cooler months.
5. **Pike mid-latitude lake summer rows** (Appalachian, midwest
   interior) were widened with surface through peak summer, which
   overstates the reliability of surface pike in warm 75+°F water;
   those rows now hold at bottom|mid, mid-anchored, with surface closed
   July/August.
6. **Smallmouth mountain_west river June** rows previously pushed a
   surface bite during runoff/spawn; surface in MW rivers typically
   opens July-September. Fixed.
7. **LMB Hawaii year-round rows** were authored with a northern-climate
   winter pattern (slow-only Dec). Hawaii never cools that hard; Dec
   now retains fast pace and a moderate anchor.
8. **Forage choices** were reviewed row-by-row. In particular, mid and
   post-spawn LMB months now favor `bluegill_perch` (biologically
   dominant during bluegill bed period + post-spawn fry protection),
   peak-summer rows favor `baitfish`, and fall rows favor `baitfish`
   with `crawfish` secondary in non-tropical climates.
9. **Two state-scoped seasonal overrides** (smallmouth/northeast/6/
   river/PA, trout/mountain_west/4/river/ID) were removed per the
   architecture's "no state-scoped seasonal override layer" rule.

## Validation

Run `python3` against the re-authored CSVs; architecture invariants are
encoded in `/tmp/tlai_phase2/validate.py` (authoring scratch, not in
repo — see below for redundancy).

Every row in every CSV satisfies:

- full supported-context coverage (no missing, no extras, no duplicates)
- `bottom` in `column_range`
- `slow` in `pace_range`
- `column_baseline` in `column_range`, never `surface`
- `pace_baseline` in `pace_range`
- `surface_seasonally_possible` agrees with `surface ∈ column_range`
- `primary_forage != secondary_forage`, neither equals `surface_prey`
- `state_code` is empty everywhere

## Expected downstream effect: inventory binding drift

Because seasonal biology was intentionally tightened, **~268 preserved
`primary_lure_ids` / `primary_fly_ids` entries** across the four CSVs
no longer satisfy the v4 generator's G1 column-alignment cross-check
(their archetype's canonical column is no longer in the row's
`column_range`, or their pace is no longer in the row's `pace_range`).

Rough distribution of column-misalignment only:

| file                    | lure-misaligned | fly-misaligned |
| ----------------------- | --------------: | -------------: |
| `largemouth_bass.csv`   |              53 |             21 |
| `smallmouth_bass.csv`   |             125 |             33 |
| `northern_pike.csv`     |              10 |              3 |
| `trout.csv`             |               — |             23 |
| **total**               |         **188** |         **80** |

Typical examples (honest biology pruning):

- `walking_topwater` listed as a primary for cold-month rows that now
  correctly lack `surface` from their `column_range`.
- `soft_jerkbait` / `squarebill_crankbait` (column `upper`) listed as
  primaries for early-spring cold-water rows that now correctly clamp
  to `bottom|mid`.
- `popper_fly` / `mouse_fly` listed for rows whose `surface_seasonally_possible`
  is now `false`.

These are **Phase 3 / Phase 4 concerns**, not Phase 2 concerns:

- Phase 3 (species-specific biological eligibility review) will decide
  whether each archetype should even be eligible for the row's
  species/month/region/water-type combination.
- Phase 4 (per-context inventory sufficiency review) will re-populate
  `primary_lure_ids` and `primary_fly_ids` against the now-correct
  seasonal envelopes and report honest thinness where it exists.

The v4 generator (`npm run gen:seasonal-rows-v4`) will not pass end-to-end
until those downstream phases realign the inventory bindings. That is
the architecturally correct sequencing: biology first, inventory
second.

## What was intentionally not done

- **Engine implementation** — Phase 5.
- **Species-specific lure/fly eligibility review** — Phase 3.
- **Per-context inventory sufficiency review / binding re-curation** —
  Phase 4.
- **Fallback rows, region-borrow logic, or runtime rescue behavior** —
  explicitly excluded.
- **State-specific seasonal overrides** — explicitly excluded; prior
  overrides removed.
- **Widening column or pace ranges to paper over thin inventory** —
  explicitly excluded; narrow rows stay narrow.
