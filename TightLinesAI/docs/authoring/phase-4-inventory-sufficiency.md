# Phase 4 — Per-context inventory sufficiency

**Status:** complete (2026-04-20)
**Upstream:** Phase 2 (seasonal biology) + Phase 3 (item eligibility)
**Downstream:** Phase 5 (engine implementation)

This memo records the per-context inventory-truth audit performed after
Phase 2 re-authored the seasonal-row biology and Phase 3 tightened item
eligibility. Its purpose is to make the seasonal matrix bindings
(`primary_lure_ids`, `primary_fly_ids`, `excluded_*`) honestly agree with
those two upstream truths, and to document where contexts are structurally
thin so that the upcoming engine implementation (Phase 5) can handle them
explicitly instead of relying on catalog padding.

---

## 1. Authoring method

For every supported runtime row in `data/seasonal-matrix/*.csv`, we
re-derived `primary_lure_ids` / `primary_fly_ids` using the
"honest strong-fit ∩ (forage-aligned or baseline-anchored)" rule:

An archetype is a primary iff **all** of:

- `species_allowed` contains the row species.
- `water_types_allowed` contains the row water type.
- `column` is inside `column_range`.
- `primary_pace` is inside `pace_range`
  (secondary-pace-only matches are intentionally **not** primaries; they
  still reach the runtime eligible pool via
  `buildEligiblePoolV4`'s `paceSet.has(a.primary_pace) ||
  paceSet.has(a.secondary_pace)` check).

AND at least one of:

- the archetype's `forage_tags` intersect the row's
  `primary_forage` / `secondary_forage` bucket, **or**
- the archetype sits exactly on the row's
  `(column_baseline, pace_baseline)` anchor. The anchor clause guarantees
  every row has at least one primary sitting on the neutral-posture slot-0
  target, so §15.1 G8 headline coverage is satisfied for the neutral
  posture without needing to fire the `primary_relaxed` fallback.

Ordering inside each primary list is deterministic: forage-matching items
first, then by `(column-depth, primary-pace)`, then by `id` alphabetical.

`excluded_lure_ids` / `excluded_fly_ids` were re-visited only for
**staleness**. An exclusion is dropped if the catalog already gates the
archetype out by species, water type, or column (the exclusion is noise
there — the runtime would filter it regardless). No exclusions were
added.

The re-curation pipeline is
`scripts/lib/phase4/recurate.py`-style logic (authoring-only; not part
of the runtime pipeline) and was re-run until the v4 generator produced
zero §15.1 G1 errors and `check:seasonal-matrix` reported clean.

## 2. Post-Phase-3 structural catalog gaps

These are catalog-wide shapes. They are not row-level authoring bugs;
they are the limits of the tightened Phase-3 archetype catalog.

### 2.1 (species × water × column) combinations with **zero** archetypes

| species | water | column | side | note |
|---|---|---|---|---|
| largemouth_bass | lake | `upper` | FLY | **LMB fly catalog lacks the `upper` column entirely.** Surface flies + mid streamers + bottom leeches only. Drives LMB `upper` slot failures in wide summer contexts. |
| largemouth_bass | river | `upper` | FLY | same as above |
| smallmouth_bass | lake | `upper` | FLY | SMB fly `upper` is similarly missing on lakes. SMB river is better — covered by sculpin/slim-minnow variants there. |
| northern_pike | lake | `upper` | FLY | No `upper` pike flies at all. |
| northern_pike | river | `upper` | FLY | |
| northern_pike | river | `surface` | FLY | No surface pike flies on rivers (`frog_fly` is lake-only, no river topwater fly). |
| northern_pike | lake | `upper` | LURE | |
| northern_pike | river | `bottom` | LURE | **Pike rivers have no bottom-column lure at all** (`pike_jig_and_plastic` is lake-only). |
| northern_pike | river | `upper` | LURE | |
| northern_pike | river | `surface` | LURE | |
| trout | river | `upper` | LURE | Trout lure catalog has no `upper`-column archetype. |
| trout | river | `surface` | LURE | Trout lure catalog has no surface archetype (expected — trout surface is exclusively a fly domain). |

### 2.2 (species × water × column × primary_pace) dead zones

Full list is in `phase-4-inventory-sufficiency-appendix.md` (auto-generated);
the highlights the engine will hit most often:

- **pike lake (bottom, medium)** — `pike_jig_and_plastic` is (bottom, slow)
  and only reaches `medium` via `secondary_pace`. So when slot-0 lands on
  (bottom, medium) exactly, no pike lake lure has `primary_pace === 'medium'`.
- **pike lake (mid, slow)** — every mid pike lure is `primary_pace: medium`,
  relying on `secondary_pace: slow` (`large_profile_pike_swimbait`,
  `large_bucktail_spinner` via fast, `pike_jerkbait` via fast). So the
  slot exists in the eligible pool but no primary-pace match exists.
- **pike river (bottom, slow)** — **zero pike-river lures at bottom at all.**
  Every bottom-slot pike river recommendation must relax to `mid` via
  the `nearestAdjacentColumn` ladder.
- **trout river (upper, *)** and **(surface, *)** — structurally empty,
  matches reality (trout + conventional tackle + upper/surface
  is a niche).

### 2.3 LMB fly catalog narrowness

LMB-eligible flies after Phase 3:

| family_group | archetypes |
|---|---|
| `fly_frog` | `frog_fly` (lake only, surface) |
| `fly_popper` | `popper_fly` (surface) |
| `leech_family` | `woolly_bugger`, `rabbit_strip_leech` (both bottom) |
| `streamer_articulated` | `articulated_baitfish_streamer`, `articulated_dungeon_streamer` (both mid) |
| `streamer_baitfish` | `deceiver` (mid) |
| `streamer_segmented` | `game_changer` (mid) |
| `streamer_weighted` | `clouser_minnow` (mid) |

Total **9 archetypes, 7 families, columns {bottom, mid, surface}**. No `upper`.

## 3. Per species / water inventory totals after re-curation

| species | water | rows | `primary_lure_ids` range | `primary_fly_ids` range |
|---|---|---|---|---|
| largemouth_bass | lake | 192 | 19..23 | 5..6 |
| largemouth_bass | river | 192 | 15..20 | 5..6 |
| smallmouth_bass | lake | 168 | 19..23 | 5..6 |
| smallmouth_bass | river | 168 | 16..21 | 11..12 |
| northern_pike | lake | 108 | 5..6 | 7..8 |
| northern_pike | river | 108 | 4..4 | 8..9 |
| trout | river | 168 | 4..4 | 12..13 |

Observations:

- **LMB and SMB lakes run wide on lures (≥15 primaries)** — that is real
  biology; the lure catalog is deep on bass-appropriate items and the
  warm-season envelopes are wide.
- **LMB fly primaries are always 5..6** — a catalog-limited ceiling, not
  a seasonal authoring choice. LMB fly-fishing legitimately is narrow
  in this catalog (see 2.3).
- **Pike primaries plateau at 4–8** — a catalog-limited ceiling; the pike
  archetype set is intentionally focused.
- **Trout river lure primaries are always exactly 4** — the entire trout
  river lure catalog is `hair_jig, casting_spoon, inline_spinner,
  suspending_jerkbait`. This is the whole universe; there is no
  seasonal widening to find.

Every row passes §15.1 G1 (≥3 primary lures, ≥3 primary flies) with
trout-river-winter relaxation where applicable. Zero rows report
<3 families in their *eligible* pool (secondary-pace counted).

## 4. Residual §15.1 G8 (headline slot-0) warnings

The v4 generator emits 194 `DATA_QUALITY_WARN` G8 diagnostics after
re-curation. They are all structurally honest:

| count | side | posture | slot-0 target | species | cause |
|---:|---|---|---|---|---|
| 80 | `primary_fly_ids` | suppressed | (bottom, slow) | LMB / pike / SMB | row forage is `baitfish`/`bluegill_perch`/`crawfish`; the only (bottom, slow) fly is `rabbit_strip_leech` (tag `leech_worm`) which is forage-dropped by the headline filter. The engine's `primary_relaxed` fallback fires. |
| 86 | `primary_lure_ids` | agg/neu/sup | (bottom, slow) | pike river | no pike-river lure exists at `column=bottom`; the engine must relax via `nearestAdjacentColumn`. |
| 22 | `primary_fly_ids` | agg/neu | (upper, medium) | LMB lake/river | LMB fly catalog has no `upper` column archetype. The engine's relaxation chain handles it. |
| 6 | `primary_fly_ids` | agg/neu | (bottom, medium) | LMB / SMB | no (bottom, medium primary_pace) fly at all; `woolly_bugger` is (bottom, slow, sec=medium) and caught via secondary-pace in eligible pool but not in headline primary-pace match. |

**None of these were fixed in Phase 4.** Fixing them requires either:

- adding new catalog archetypes (deferred; the user-facing cost/benefit
  belongs with catalog expansion, not binding authoring), or
- engine behavioural changes around the forage gate and the
  headline-pool primary-pace matcher (Phase 5 scope).

## 5. Contexts that honestly cannot yield 3 recommendations

The catalog eligible-pool check reports zero rows with <3 distinct-family
eligibility, but the **engine's slot-filling algorithm** can still fail
to pick 3 when surface caps, forage-headline gating, and the
`excludeFamilies` requirement combine. The integration tests expose the
two worst-case contexts:

### 5.1 `integration §14.A` — LMB / GLUM / June / lake / aggressive

- Row authored: all columns, all paces, baseline (upper, fast),
  forage bluegill_perch/baitfish.
- Today dist (aggressive): `column = [upper, upper, surface]`,
  `pace = [fast, fast, medium]`.
- Slot 0 and 1 both target `(upper, fast)`. **The LMB fly catalog has
  zero `upper` archetypes.** The engine relaxes via nearest-adjacent
  column for both slots, then hits the family-distinct gate for slot 2
  on `(surface, medium)`: only `frog_fly` and `popper_fly` sit there,
  and by this point their families are consumed.
- **Nature of thinness:** catalog-limited. Adding a single `upper` LMB
  streamer (family ≠ `fly_popper`/`fly_frog`/`streamer_weighted`) would
  satisfy slot 0 without relaxation and free family capacity for later
  slots.

### 5.2 `integration §14.C` — pike / GLUM / December / lake / neutral

- Row authored: `column_range=[bottom, mid]`, `pace_range=[slow]`,
  baseline (bottom, slow), forage baitfish.
- Today dist (neutral): `column = [bottom, bottom, mid]`,
  `pace = [slow, slow, slow]`.
- `pace_range=[slow]` forces every slot to use archetypes where `slow`
  is *any* supported pace. Pike lake archetypes with slow support:
  - `pike_jig_and_plastic` (bottom, pri=slow)       → fam `pike_jig`
  - `large_profile_pike_swimbait` (mid, sec=slow)   → fam `pike_swimbait`
  - `large_pike_topwater` (surface, sec=slow)       → surface, cut by surface-off rule in this row
  - `hollow_body_frog` (surface, pri=slow)          → surface, cut
- **Only 2 distinct non-surface pike-lake families** can contribute
  at `pace=slow`. The engine's family-distinct rule fails at slot 2.
- **Nature of thinness:** catalog-limited. The pike lake catalog has
  7 families total, but only 2 support slow pace without surfacing.

Both contexts are **biologically real narrow windows**. The architecture
explicitly allows the engine to return fewer than 3 recommendations
when inventory is honestly thin; Phase 5 must implement that handling.

### 5.3 `coverage.test.ts` (§20.4) — 1374 engine errors

Running the 9-payload × per-region coverage sweep after Phase 2 + Phase 3 +
Phase 4 re-curation produces **1374 `slot N could not be filled` engine
errors** (down from ~1803 at end of Phase 3, before binding re-curation).
Every one of them is a cell that hit the two structural patterns in 5.1
and 5.2:

- LMB fly side relaxed into the `upper` gap, then slot 2 starved of
  distinct families (accounts for the majority of LMB lake/river cells).
- Pike + trout constrained (column, pace) envelopes where the
  catalog-wide (col, pace) matrix has zero archetypes.

The coverage report written to
`docs/authoring/coverage-per-region.md` by `coverage.test.ts` shows
every triple with `triple caps = FAIL` due to `relax_cells% > 25%` —
that is the relaxation-rate cap, not a correctness failure. The
relaxation rate is telling you exactly the thing Phase 4 is
documenting: the engine must relax on a large fraction of cells because
the catalog's (col, pace) coverage matrix is sparse relative to the
tactical envelopes Phase 2 authored.

This is **expected and honest** given the phase rules; §20.4's
`≤ 25%` cap is a Phase-5 tunable and will be revisited once Phase 5
decides how to surface thin outputs.

## 6. CSV-level contexts that trend toward thinness

These are authored contexts where the eligible pool is at its
structural minimum (3 families) and where surface + forage gating
shrinks the pool further. They are not currently engine failures but
they are the contexts Phase 5 should exercise first.

- **Pike / river / all months**: every row has a 4-primary lure list
  (no bottom-column archetype exists). Any slot recipe that lands on
  `(bottom, *)` relaxes via nearest-adjacent column.
- **Pike / lake / winter (Dec–Feb)**: narrow column/pace envelopes
  compound with the 7-family pike catalog. Eligible pool after
  surface-strip is 2–3 families.
- **LMB / all contexts, fly side**: 5–6 primaries every row. Any
  `upper` slot relaxes.
- **Trout / river / winter (Dec–Feb)**: G1 relaxation kicks in (min=2
  primary flies). Lure list always 4. Adequate on the fly side
  (12–13 primaries) because trout fly catalog is broad.
- **Trout / river / `pace_range={slow, medium}` months**: lure list
  drops to `{hair_jig, suspending_jerkbait}` primary-pace matches;
  `casting_spoon` and `inline_spinner` must ride on secondary pace.
  Still passes G1 (≥3 primaries via anchor / forage extension).

## 7. Binding corrections made

This phase made no seasonal-row biology edits (by rule). The work
was entirely binding re-authoring:

- **All 1104 rows** had `primary_lure_ids` and `primary_fly_ids`
  fully re-derived; the prior hand-authored lists from the v3 → v4
  migration are replaced.
- **`excluded_lure_ids` / `excluded_fly_ids` noise stripped**: any
  exclusion whose archetype is already gated out by species, water,
  or column is removed. Exclusions that encode real biological
  NO-GO intent within the envelope are preserved (very few remained).
- No `primary_*` list is padded with stale items; no list is narrowed
  below the honest strong-fit set. No forced "3 and 3" preservation.

## 8. Handoff to Phase 5

Phase 5 engine implementation must explicitly handle:

1. **Fewer than 3 picks are a legal output.** The existing
   `RecommenderV4EngineError: slot N could not be filled` behaviour
   needs to degrade gracefully — probably to a truncated
   `lure_recommendations` / `fly_recommendations` array with a
   diagnostic marking honest thinness instead of a thrown error.
2. **Integration tests §14.A and §14.C encode inventory realities.**
   They should assert "≤3 picks + diagnostic" instead of
   `assertEquals(picks.length, 3)` once Phase 5 decides the shape.
3. **G8 WARN is expected; not an error.** The current generator
   emits 194 of them; they represent real catalog shape, not row bugs.
4. **Forage-off headline fallback fires frequently on suppressed
   posture.** The `primary_relaxed` variant is normal operating mode
   for `(bottom, slow)` rows with baitfish/bluegill_perch forage —
   this is because `rabbit_strip_leech` is the only (bottom, slow)
   fly and its `leech_worm` tag is outside baitfish/bluegill_perch
   forage buckets. Consider whether this is a Phase 5 display
   concern.
5. **Trout-river-winter G1 relaxation remains valid.** No rows were
   authored that violate it.

## 9. What was NOT done (per scope)

- No seasonal row biology was changed.
- No item eligibility was broadened.
- No new archetypes were added.
- No fallback/rescue logic was added.
- No column or pace range was widened for convenience.
- No engine code changes.
- No attempt to force `(3, 3)` where catalog + biology cannot support it.

Thin contexts are now documented and traceable; the catalog + matrix
relationship is honestly reconciled; Phase 5 can proceed against a
truthful inventory baseline.
