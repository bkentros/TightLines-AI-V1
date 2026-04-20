# Phase 4 blocker — plan revision memo (Recommender v4)

**Audience:** product owner + implementer  
**Purpose:** decision-ready packet for resolving the conflict between strict §11 eligibility, Appendix A’s closed catalog, worked examples, and §20.4 “always three picks” expectations.  
**Scope:** analysis only — no engine changes, no catalog edits, no threshold loosening in this pass.

---

## 1. Executive summary

Strict §11 pool construction (`unique(column_distribution)` × `unique(pace_distribution)` × species × water × clarity × excluded ids) is **consistent with the §11 pseudocode** in `recommender-v4-simplified-design.md` (lines 640–671). Under that rule, **many** `(seasonal row × §20.4 payload)` cells cannot complete `pickTop3V4` because the eligible pool does not contain **three distinct `family_group` values** (P7) while the engine **always** requires three picks with unique families.

The **canonical visible failure** is §14.1 Example A on the **fly** side: for the published tactic slice, only **two** fly archetypes pass the §11 filter, so slot fill throws before any “worked example” fly narrative can occur.

Coverage enumeration (`coverage.test.ts` matrix: all generated seasonal rows × nine payloads) records **1,617** `RecommenderV4EngineError` failures in the current repo state (strict engine path). Failures are **not** fly-only: **lure** failures dominate the count (~69% lure vs ~31% fly), with **trout** and **northern_pike** lure paths accounting for the largest species buckets.

**Conclusion:** the blocker is **broader than Example A** but still **targeted** (catalog + matrix authoring), not a full engine redesign. The plan text contains **over-strong guarantees** (§11.2 line ~702 and §20.4 lines ~2366–2368) relative to a **21-fly / 36-lure** Appendix A and **P13**’s restriction that only three flies may use `column === "surface"`.

---

## 2. Plan assumptions in conflict (explicit)

| Source | What it says | Conflict |
|--------|----------------|----------|
| **§11** (lines 640–671) | Eligible pool = catalog filtered by `today_cols` / `today_paces` sets passed in (implemented as `unique` of resolved distributions) + clarity + species + water + excluded | Small `unique()` sets can shrink the intersection to **few** archetypes. |
| **§11.2** (line ~702) | If `eligible_pool.length < 6`, emit `pool_undersized` and “**The picker still produces 3 picks**” with relaxation | **False** whenever `\|eligible\| < 3` **or** eligible has `< 3` distinct `family_group` values: relaxation only searches **eligible**, not the full catalog. |
| **P7** (line ~135) | `family_group` unique across top-3 | Requires **≥3** distinct families in the union of picks drawn from eligible (post-relaxation rules). |
| **P13** (line ~141) | Only `popper_fly`, `frog_fly`, `mouse_fly` may have `column === "surface"` | Any slice whose `unique(column_distribution)` is `{upper, surface}` forces **all** non-surface flies to sit in **`upper`** only; **mid/bottom** streamers drop out entirely. |
| **§20.4** (lines ~2366–2372) | Zero engine errors; both lure and fly arrays length 3 | Incompatible with the above for many real cells until catalog/matrix support the slices. |
| **§14.1** (lines ~960–1013) | Worked example verified vs Appendix A for **lures** | **Fly side is not walked** in §14.1; the narrative implies full top-3 success for both gears but only **proves** lure picks. That is an **omission**, not a proof that flies exist for the same slice. |
| **§20.2** (historical; test removed 2026) | ~~Integration test~~ asserted §14 Example A–D including fly distribution | `runRecommenderV4.integration.test.ts` was retired post-cutover; memo row preserved as context for why §14 synthetic scenarios were brittle vs Appendix A + §11. |

---

## 3. §14.1 Example A — strict eligible **fly** pool (reproduced)

**Inputs (integration / §14.1 alignment):**

- `species` = `largemouth_bass`
- `water_type` = `freshwater_lake_pond`
- `water_clarity` = `stained` (Example A; integration uses `stained` on the request)
- Tactic distributions from integration §14.A (`analysisWithScore(82)`, fixed seed / row as in test):
  - `column_distribution` = `["upper","upper","surface"]` → **`column_set` = `["upper","surface"]`** (order preserved for display; set semantics for §11)
  - `pace_distribution` = `["fast","fast","medium"]` → **`pace_set` = `["fast","medium"]`**

**`buildEligiblePoolV4("fly", …)` result** (verified via `scripts/example-a-strict-pools.ts`):

| `id` | `family_group` | `column` | `primary_pace` | `secondary_pace` |
|------|----------------|----------|----------------|------------------|
| `popper_fly` | `fly_popper` | `surface` | `medium` | `slow` |
| `frog_fly` | `fly_frog` | `surface` | `slow` | `medium` |

**Distinct `family_group` count:** **2**

**Can three P7-distinct fly picks exist?** **No.** Even with full §12 relaxation, every candidate remains one of these two archetypes / two families.

**Strict eligible lure pool** for the **same** slice (same script): **10** lures, **9** distinct `family_group` values — **lure side is viable** for this cell; the immediate §14.1 integration failure on fly is **not** mirrored on lure for this slice.

**Why only two flies?** P13 confines `column === "surface"` to three patterns. For **stained** + **LMB** + **lake**, `popper_fly` and `frog_fly` qualify on `surface`. For **`upper`**, the only authored fly with `column: "upper"` in `flies.ts` is `slim_minnow_streamer`, but it has `clarity_strengths: ["clear"]` only and `species_allowed` without `largemouth_bass` — so it **does not** enter this pool. Other LMB streamers are authored on **`mid`** / **`bottom`**, which **do not** intersect `column_set` when that set is exactly `{upper, surface}`.

---

## 4. Coverage matrix — failure quantification

**Method:** `scripts/analyze-v4-coverage-blocker.ts` — same row set and nine payloads as `coverage.test.ts`, catch errors from `computeRecommenderV4`.

**Totals (9954 cells = all seasonal rows × 9 payloads):**

| Metric | Count |
|--------|------:|
| Success | 8,337 |
| `RecommenderV4EngineError` | **1,617** |

**By gear mode (parsed from error message):**

| Gear | Errors |
|------|-------:|
| `lure` | **1,113** |
| `fly` | **504** |

**By species (all errors):**

| Species | Errors |
|---------|-------:|
| `trout` | 593 |
| `northern_pike` | 520 |
| `largemouth_bass` | 294 |
| `smallmouth_bass` | 210 |

**By `water_type`:**

| Context | Errors |
|---------|-------:|
| `freshwater_river` | 1,148 |
| `freshwater_lake_pond` | 469 |

**By payload `water_clarity`:**

| Clarity | Errors |
|---------|-------:|
| `dirty` | 1,137 |
| `clear` | 240 |
| `stained` | 240 |

**Slot index (where assembly aborted):**

| Slot | Errors |
|------|-------:|
| 0 | 765 |
| 1 | 590 |
| 2 | 262 |

**Representative messages:**

- Fly: `V4: slot … could not be filled (fly) for largemouth_bass appalachian m6 freshwater_river` (and many similar LMB/SMB regions).
- Trout lure: `V4: slot 0 could not be filled (lure) for trout alaska m1 freshwater_river` (headline / first slot starvation on narrow winter rows + dirty/clear payloads).
- Pike lure: `V4: slot 2 could not be filled (lure) for northern_pike alaska m1 freshwater_river`.

**Pattern buckets (high level):**

1. **LMB/SMB fly + aggressive/neutral with surface in `today_columns`:** `unique` columns often `{upper, surface}` or `{mid, surface}` etc., combined with pace pairs that **exclude mid-column** LMB streamers → pool collapses toward **only** P13 surface flies (at most **two** LMB-eligible surface flies: `popper_fly`, `frog_fly`; `mouse_fly` is trout-only).
2. **Trout / pike lure failures (dominant volume):** narrow `column_range` / `pace_range` on cold-month or tailwater-style rows intersect **dirty**/**clear** payloads with **small** strict lure pools and/or **headline** / primary-id intersection leaving slot 0 or later unsatisfiable under P7.

---

## 5. Revision options (comparison)

### Option A — Revise Appendix A / catalog only (`flies.ts`, `lures.ts`, Appendix §22.1–§22.2)

**Idea:** Add or adjust the **minimum** archetypes so that high-frequency §11 slices (especially `{upper|mid} + surface` × common pace pairs × clarity × water × species) always contain **≥3** eligible flies with **≥3** `family_group` values, and similarly close **lure** gaps for trout/pike narrow rows.

**Pros:** Keeps strict §11 and §20.4 semantics; aligns product with “full catalog” vision; no special-case engine.

**Cons:** Requires disciplined Appendix diff; must respect **G7** surface-fly species rules and **P13**; fly count may exceed 21 unless you merge/replace.

### Option B — Revise seasonal-matrix authoring only (CSV → generated rows)

**Idea:** Widen `column_range` / `pace_range` or change baselines so `unique(column_distribution)` almost never excludes `mid` when `surface` is present, etc.

**Pros:** No new lure/fly SKUs if ranges always pull mid-column streamers into the slice.

**Cons:** **Large blast radius** (many rows); biologically may be wrong to force wide ranges in winter; **cannot** fix cases where the true distribution is `{upper, surface}` by posture rules (§14.1 is exactly that for aggressive).

### Option C — Revise engine guarantees / strict eligibility

**Examples:** allow headline to draw outside strict pool; widen `today_paces`/`today_cols` beyond `unique(distribution)`; relax P7 in thin pools.

**Pros:** Immediate green CI.

**Cons:** **Violates current written §11 and invariants P6/P7** unless the plan is formally rewritten; creates hidden recommendations outside catalog truth.

### Option D — Mixed minimal fix (recommended shape)

1. **Catalog (primary):** targeted fly additions/edits so LMB+SMB **lake/river** × **stained/clear** × slices that include `surface` also include **≥1** additional **streamer** in **`upper`** (or ensure `mid` appears in `unique(column_distribution)` whenever that is posture-legal — often **not** for aggressive 2+1 column commit). The **smallest** fly-side fix for the Example A slice is **one** new or revised archetype that is simultaneously:
   - `column: "upper"` (or adjust distribution rules — see B — not preferred),
   - `species_allowed` includes `largemouth_bass`,
   - `water_types_allowed` includes `L`,
   - `clarity_strengths` includes `stained`,
   - `primary_pace` / `secondary_pace` intersects `{fast, medium}` for that Example,
   - `family_group` ∉ `{fly_popper, fly_frog}`.
2. **Matrix / primary ids (secondary):** for **trout** and **pike** months/regions with **593 / 520** lure failures, audit `primary_lure_ids` + ranges + dirty/clear cells — likely need **either** more archetypes in those intersections **or** row range edits so strict pools retain enough distinct families.
3. **Plan text:** amend §11.2 (~702) and §20.4 (~2366–2368) to state the **mathematical** precondition: three picks with P7 require **≥3** eligible archetypes with distinct `family_group` (or an explicitly approved exception path).

---

## 6. Recommendation (single best path)

**Choose Option D with Option A as the lead deliverable.**

- **Smallest blast radius for the visible §14.1 contradiction:** **one** Appendix A fly archetype (or a **minimal** attribute extension of an existing fly **if** G2/G7 still pass) that fills the **`upper` × `stained` × LMB × lake × {fast,∪medium}** hole described in section 3. That restores both **integration §14.A** and a large share of **LMB fly** coverage failures **without** changing posture math.
- **Parallel:** a **slice audit script** (not necessarily CI) for trout/pike **lure** failures to list `(region, month, clarity, column_set, pace_set)` tuples — then either **catalog** (more cold-water / dirty-clear lures) or **targeted row** fixes (Option B) per tuple. Prefer **catalog** where the same gap repeats across many rows.

**Worked example §14.1:** **Not “wrong”** for **lures** (the lure narrative matches Appendix-style IDs). It is **incomplete** for **flies** — add a short §14.1 subsection “Fly pool verification” or soften line ~958 to “lures verified below; flies require the same check” and add the actual strict fly pool table once catalog supports it.

**Plan sections to revise after implementation:**

| Section | Change |
|---------|--------|
| **§11.2** (~702) | Replace unconditional “picker still produces 3 picks” with explicit precondition + optional “engine error if impossible” **or** keep guarantee but add **validator** that proves every matrix cell has ≥3 eligible families per gear. |
| **§20.4** (~2366–2372) | Tie “zero errors” to catalog/matrix validation **or** document allowed error class until Appendix closes. |
| **§14.1** (~960–1013) | Add fly-side catalog verification or cross-reference a generator test. |
| **Appendix §22.2** | Add/revise fly row(s) per minimum catalog change. |

---

## 7. If catalog expansion is chosen — minimum **fly** change (concrete)

**Goal:** For `column_set = {upper, surface}`, `pace_set = {fast, medium}`, `species = largemouth_bass`, `water = L`, `clarity = stained`, add **exactly one** qualifying streamer fly (new `id` or extend an existing row **only if** all invariants hold) such that:

- `family_group` is not `fly_popper` or `fly_frog`,
- P13 satisfied (`column !== "surface"`),
- G7 unchanged for surface trio.

**Illustrative direction (not implemented):** an “upper-column baitfish streamer” with `clarity_strengths` including `stained`, `species_allowed` including `largemouth_bass`, `water_types_allowed` including `L`, pace matching `fast` and/or `medium`. This is the **minimum** structural fix for the §14.1 fly contradiction.

**Lure side (trout/pike):** requires separate enumeration — **do not** assume a single new fly fixes the 1,113 lure errors.

---

## 8. Is a major redesign required?

**No**, provided the team accepts **bounded** Appendix growth and/or **targeted** seasonal-row fixes driven by the failure buckets above. A **major** redesign would only be necessary if the product refuses both catalog expansion **and** any matrix widening **and** any honest relaxation of §20.4 / §11.2 guarantees.

---

## 9. References (repo + plan)

- Plan: `docs/recommender-v4-simplified-design.md` — §3 invariants (e.g. P4, P6, P7, P13, P18), §11, §12, §14.1, §20.2, §20.4, Appendix §22.1–§22.2.
- Engine: `supabase/functions/_shared/recommenderEngine/v4/engine/runRecommenderV4.ts`, `buildEligiblePool.ts`.
- Tests: `v4/__tests__/coverage.test.ts` (experimental v4 engine matrix; opt-in env). ~~`runRecommenderV4.integration.test.ts`~~ removed.
- Analysis helpers (this pass): `scripts/analyze-v4-coverage-blocker.ts`, `scripts/example-a-strict-pools.ts`.

---

*End of memo — implementation of the chosen option is explicitly out of scope for this document.*
