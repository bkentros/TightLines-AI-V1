# Recommender V3 — Audit output interpretation

Canonical guide for reading **matrix summary**, **specialty diagnostics**, and **coverage audit** output without mistaking exploratory metrics for CI failures. Baseline numbers and rerun commands: [V3_POST_TUNING_STATE.md](./V3_POST_TUNING_STATE.md), [MAINTAINER_VALIDATION.md](./MAINTAINER_VALIDATION.md). Regression gates: [V3_REGRESSION_ANCHORS.md](./V3_REGRESSION_ANCHORS.md).

---

## 1. Freshwater matrix summary (Section 4.4)

### Primary contract (gating)

These four **headline** rates are the unified matrix pass bar (see `expected-headlines.json` + `verifyRegressionBaselines.ts`):

| Field | Meaning |
|--------|---------|
| **Top-1 primary hit** | Review precheck: authored primary lane(s) own rank 1 for lure and/or fly as the matrix expects. |
| **Top-3 primary present** | Expected primary lanes appear somewhere in the top 3. |
| **Disallowed avoidance** | No disallowed tactical lanes in the top 3. |
| **Top color-lane match** | Color output matches expected color lanes for the scenario. |

**Hard / soft fails** in the per-species failure split are derived from disallowed presence and missing top-3 primaries — they are **contract failures**, not “variety” complaints.

### Non-gating diagnostics (do not treat as CI failures)

| Field | Meaning |
|--------|---------|
| **Variety** | Counts of distinct top-1 IDs and ordered top-3 signatures — useful for diversity regressions, **not** part of the four headline rates. |
| **Top-1 ties** | Scenarios flagged `TOP1_TIE` — co-equal scores within authored primaries; monitored via **tie ceilings** in regression baselines, not as a fourth headline pass/fail. |
| **Explanation conflicts** | Copy/consistency flags on recommendations; investigate for UX, not for primary-lane biology. |
| **Region fallback** | `USED_REGION_FALLBACK` — product row resolution used a nearby region; track if frequency spikes unexpectedly. |

### Specialty surface/frog block (Section 4.1)

The matrix summary **specialty** section tracks a **fixed small set** of surface- and frog-adjacent archetype IDs (`hollow_body_frog`, `frog_fly`, `mouse_fly`, `walking_topwater`, `buzzbait`, `prop_bait`, `popper_fly`).

| Metric | Meaning |
|--------|---------|
| **Scenarios expecting** | Matrix rows whose **authored** expectation lanes (primary or acceptable secondary) include that archetype id. |
| **In top-3 when expected** | Among those rows, how often the id appears in the combined lure+fly top 3. |
| **Top-1 when expected** | Among those rows, how often it wins rank 1 (lure or fly). |
| **Bonus top-3 (not in expectation)** | Appearances in top 3 when the scenario’s **expectation lanes did not** list that id — often legitimate exploration (e.g. mouse in a non-mouse row). **Not** a primary-contract failure. |

**Decision (4.1):** Keep all four columns in the analyzer; **reword** in Markdown only so “unexpected” is not read as “bug”. Do **not** gate CI on specialty bonus counts (see [V3_REGRESSION_ANCHORS.md](./V3_REGRESSION_ANCHORS.md)).

---

## 2. Coverage audit (`v3-coverage-audit`) (Section 4.3)

### True failures (gating)

- Any **`success_targets`** bucket with `pass: false` after a run.
- **`expectation_mismatches`** length &gt; 0 for lure or fly — archetype **role/reach** contract violated on the synthetic grid.

### Acceptable / expected noise

- **`intentional_low_frequency_specialty`** with `required_reach: top3` will often show **low or zero `top1_hits`** — that is honest, not a failure.
- **`top3_support`** entries may never win top-1; the table `status` is still **pass** if they hit top-3 where required.

### Reachability lists (“never …”)

**Library reachability** lists (`never_viable`, `never_top3`, `never_top1`) summarize the **synthetic daily × clarity sweep** across seasonal rows. They are **diagnostic**, not the same document as the **archived matrix** audit:

- A lure can be “never top-1” on the synthetic grid while still winning matrix scenarios — different fixtures.
- Use these lists to find **dead archetypes** or over-tight pools, not to declare the matrix broken without checking matrix output.

### Intent table (Section 4.2)

The per-archetype table is the join of **library intent** ([`archetypeExpectations.ts`](../../scripts/recommender-v3-audit/archetypeExpectations.ts)) and **synthetic reachability**. Roles:

| Role | Honest meaning |
|------|------------------|
| `winner_capable` | Should win rank 1 in at least one audited/intended scenario on this grid. |
| `top3_support` | Should reach top 3 where intended; top-1 optional. |
| `intentional_low_frequency_specialty` | Rare, narrow windows; top-1 not required if contract says top-3 only. |

Re-review when adding archetypes or changing `required_reach`; keep **expectation_mismatches** at zero for release-quality passes.

### Archetype intent contract (Section 4.2)

After the latest matrix-clean pass, **coverage intent mismatches are zero** — the `winner_capable` / `top3_support` / `intentional_low_frequency_specialty` assignments in [`archetypeExpectations.ts`](../../scripts/recommender-v3-audit/archetypeExpectations.ts) remain **honest** for the synthetic grid. No intent row changes were required for this hygiene pass.

When you add a rare archetype or change seasonal pools, re-check: (1) role matches how the bait is used in product copy, (2) `required_reach` matches whether rank 1 or top-3 is the real bar, (3) specialty roles are not upgraded to `winner_capable` just to silence low `top1_hits` noise.

---

## Related

- [V3_IMPLEMENTATION_SCORECARD.md](./V3_IMPLEMENTATION_SCORECARD.md) — numeric success targets  
- [recommender-v3-post-tuning-checklist.md](../recommender-v3-post-tuning-checklist.md) — Section 4 checklist  
