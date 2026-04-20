# Recommender V3 — Final handoff (post-tuning)

> **Historical:** Written after the freshwater V3 tuning era. **Production Edge today:** `runRecommenderRebuildSurface` (see [`tightlines_recommender_architecture_clean.md`](../tightlines_recommender_architecture_clean.md)). Legacy v3 remains for audits via `recommenderEngine/legacyV3.ts`.

Single closeout doc for **Section 6** of the post-tuning checklist. Deep detail lives elsewhere—**link, do not duplicate**.

| Topic | Canonical doc |
|--------|----------------|
| Tuned baseline & “clean” definition | [V3_POST_TUNING_STATE.md](./V3_POST_TUNING_STATE.md) |
| Regression anchors & CI gates | [V3_REGRESSION_ANCHORS.md](./V3_REGRESSION_ANCHORS.md) |
| Reading matrix / coverage / specialty output | [V3_AUDIT_INTERPRETATION.md](./V3_AUDIT_INTERPRETATION.md) |
| Edge + client integration & release vs product | [V3_PRODUCT_INTEGRATION.md](./V3_PRODUCT_INTEGRATION.md) |
| Rerun commands & artifacts | [MAINTAINER_VALIDATION.md](./MAINTAINER_VALIDATION.md) |

---

## 6.1 Golden baseline snapshot (pointers, not copies)

**Known-good outputs** stay **committed** under `docs/recommender-v3-audit/generated/` and are checked against caps in:

- `docs/recommender-v3-audit/regression-baselines/expected-headlines.json`
- `npm run audit:recommender:v3:regression-baselines`

**Primary files to treat as the golden headline snapshot** (regenerate only after intentional tuning + checklist update):

| Artifact | Path |
|----------|------|
| Freshwater matrix rollup | `generated/freshwater-v3-matrix-audit-summary.{md,json}` |
| Coverage audit | `generated/v3-coverage-audit.{md,json}` |
| Daily-shift audit | `generated/v3-daily-shift-audit.{md,json}` |

Per-species matrix review sheets (`*-matrix-review-sheet.{md,json}`) are large; rely on the **rollup** + regression script unless you need a per-species diff. Changelog of baseline bumps: [regression-baselines/CHANGELOG.md](./regression-baselines/CHANGELOG.md).

---

## 6.2 What was tuned, what is complete, what is optional

### What was tuned

Freshwater V3 **largemouth_bass**, **smallmouth_bass**, **river_trout** (engine `trout`), **northern_pike** (API `pike_musky`) — seasonal rows, daily payload handoff, scoring guards, color/top-3 behavior — until the **unified matrix** and related audits hit the documented baseline (see post-tuning state doc).

### What is considered complete

- Matrix-clean headline contract for **309** combined scenarios.
- **0** hard/soft matrix review failures; **14/14** daily-shift checks; coverage **intent mismatches 0**.
- **At handoff time**, single production path was Edge **`recommender`** → **`runRecommenderV3Surface`** → **`computeRecommenderV3`**. **Post-rebuild production:** **`runRecommenderRebuildSurface`**.
- Regression harness (Deno tests + `verifyRegressionBaselines` + full validate npm script).
- Maintainer docs: interpretation, integration, regression anchors, this handoff.

### What remains optional

- Broader **product** polish (copy, imagery, onboarding) without engine edits.
- **Section 6-style** doc tidying only; no requirement to duplicate JSON blobs in a second location.
- Optional future: expand regression tests beyond the current **minimal** anchor set (see regression anchors doc).

### What must not be casually changed

- **Seasonal** `addMonths` override blocks and **scoring guards** called out in [V3_POST_TUNING_STATE.md](./V3_POST_TUNING_STATE.md) §4 (exception registry)—without rerunning full validation.
- **`archetypeExpectations.ts`** intent rows without a coverage-driven reason and audit rerun.
- **Public response shape** (legacy v3 or rebuild) without coordinated **client** + **cache prefix** updates (see [V3_PRODUCT_INTEGRATION.md](./V3_PRODUCT_INTEGRATION.md)).

---

## 6.3 When to reopen recommender tuning (explicit triggers)

Reopen **species / scoring / seasonal** work when:

1. **Audit regressions** — `npm run audit:recommender:v3:freshwater:validate` or `npm run audit:recommender:v3:regression-baselines` fails after a change that was supposed to be safe.
2. **Repeated real-world wrong recommendations** that reproduce on **matrix or archived** scenarios (not one-off UX annoyances).
3. **New species or contexts** in scope for V3 (product decision + new rows + full audit cycle).
4. **Material product requirements** that change the recommendation contract (e.g. new gear mode)—treat as spec + audit first, then tune.

**Prefer product/UX** (not tuning) for: copy, images, layout, cache keys, subscription gating, errors that are clearly client or API wiring.

---

## Checklist cross-link

Post-tuning checklist: [recommender-v3-post-tuning-checklist.md](../recommender-v3-post-tuning-checklist.md) — Section 6 optional cleanup is satisfied by this file plus existing committed `generated/` + `regression-baselines/` pointers above.
