# Known authoring issues (recommender engine tests)

Pre-existing seasonal / metadata inconsistencies surfaced by the Deno suite. **Do not fix without product owner approval** — evidence only.

---

## Cross-species surface flag vs eligible pools

**Test file:** `TightLinesAI/supabase/functions/_shared/recommenderEngine/__tests__/crossSpeciesSeasonalConsistency.test.ts`

**Test name:** `Cross-species: surface_seasonally_possible matches eligible lure/fly pool surface content (trout, pike, smallmouth, largemouth)`

**Failing assertion message (verbatim from Deno):**

```text
smallmouth_bass appalachian m10 freshwater_lake_pond: surface_seasonally_possible (true) must match presence of surface-tagged lures/flies in eligible pools (false)
```

**What the test checks:** For every authored V3 seasonal row across trout, pike, smallmouth, and largemouth, the boolean `monthly_baseline.surface_seasonally_possible` must agree with whether the row’s `eligible_lure_ids` / `eligible_fly_ids` actually include any archetype tagged as surface in the archetype libraries. A mismatch means the monthly narrative flag says “surface is seasonally possible” while the eligible pool contains no surface-tagged lure or fly (or the inverse).

**Next action:** Pending product owner review — do not fix without approval.

---

## Smallmouth Phase 4 — northern river midsummer surface kit

**Test file:** `TightLinesAI/supabase/functions/_shared/recommenderEngine/__tests__/smallmouthSeasonalPhase4.test.ts`

**Test name:** `Smallmouth Phase 4: default northern river midsummer stays current-first (no surface kit)`

**Failing assertion message (verbatim from Deno):**

```text
AssertionError
```

**What the test checks:** For the default smallmouth row at `northeast`, July, `freshwater_river`, the row must keep a current-first / subsurface story: `surface_seasonally_possible` must be `false`, the fly pool must include `crawfish_streamer`, and the fly pool must not include `popper_fly`. The failure is one of these `assert(...)` expectations on that row (Deno does not print a custom message for those asserts).

**Next action:** Pending product owner review — do not fix without approval.
