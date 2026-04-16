# Recommender V3 — Post-tuning engine state

This document captures the **matrix-clean** freshwater recommender state and maintainer philosophy so future edits do not casually undo tuned behavior. It complements the operational rerun guide in [MAINTAINER_VALIDATION.md](./MAINTAINER_VALIDATION.md) (commands and artifacts stay there; this page focuses on **what is true about the engine now** and **how to think before changing it**). One-page post-tuning closeout (golden pointers, reopen criteria): [V3_FINAL_HANDOFF.md](./V3_FINAL_HANDOFF.md).

## 1. Current engine status (Section 2.1)

### Matrix-clean across four species

The freshwater V3 recommender is **matrix-clean** for:

- `largemouth_bass`
- `smallmouth_bass`
- `river_trout` (engine species key; audits use “trout” matrix naming)
- `northern_pike`

**What “clean” means here**

- **Unified matrix audit** (`npm run audit:recommender:v3:freshwater:validate`): all headline matrix expectations pass for the fixed 309-scenario freshwater grid (see baseline below).
- **Hard / soft failures**: the matrix review pipeline reports **0** hard fails and **0** soft fails at the species rollup.
- **Daily-shift audit**: **14/14** checks pass (paired daily scenarios move in the intended direction).
- **Coverage audit**: archetype **intent mismatches at 0** against the maintainer contract in `scripts/recommender-v3-audit/archetypeExpectations.ts` (see generated [v3-coverage-audit.md](./generated/v3-coverage-audit.md)).

“Clean” is an **audit contract**, not a claim that every real-world fishery on Earth is modeled. It means the current authored seasonal rows, daily handoff, scoring guards, and matrix expectations are **internally consistent** and **protected by the harness**.

### Recorded validation baseline

These numbers are the unified bar to preserve after routine doc or non-scoring refactors:

| Metric | Baseline |
|--------|----------|
| Matrix scenarios (freshwater combined) | **309** |
| Top-1 primary | **309/309** |
| Top-3 primary | **309/309** |
| Disallowed avoidance | **309/309** |
| Top color-lane match | **309/309** |
| Hard fails | **0** |
| Soft fails | **0** |
| Daily-shift checks | **14/14** |
| Coverage intent mismatches | **0** |

Re-run validation from `TightLinesAI/`: see **One-command freshwater validation** in [MAINTAINER_VALIDATION.md](./MAINTAINER_VALIDATION.md#one-command-freshwater-validation).

### Mode: post-tuning / polish, not rebuild

The engine is in **post-tuning / polish** mode:

- Do **not** treat the codebase as an open-ended species retuning project.
- Prefer **narrow, audited fixes** when real-world failure or regression proves a change is needed.
- Architecture-wide rewrites and broad new scoring rules are **out of scope** unless something critical breaks; see [recommender-v3-roadmap.md](../recommender-v3-roadmap.md) for long-term direction without undoing the current stable state.

---

## 2. Species reference notes (Section 2.2)

Each species below is **“finished enough”** for product use relative to the matrix contract above. Deeper regional catalogs can still grow later; that is **data expansion**, not a mandate to reopen core scoring.

### Largemouth bass

**Finished enough because:** The largemouth matrix and gold-style anchors cover lake, pond, river, southern grass, highland reservoir, Midwest weed, and northern clear-water stories with stable top-1/top-3 and color lanes under the audit.

**Biggest lessons**

- **Seasonal pool first:** Wrong monthly candidate pools swamp daily logic; fix eligibility before nudging daily.
- **Florida and south-central windows** need explicit seasonal rows and occasional score guards so cold-reservoir and prespawn reads do not collapse into generic finesse or the wrong reaction order.
- **Surface discipline:** Open-water topwater must respect monthly intent and daily surface windows so midsummer and fall do not “random surface.”

**Do not casually remove**

- The **“Focused largemouth overrides”** block in `seasonal/largemouth.ts` (Florida lake months, south-central lake/river, gulf, great_lakes_upper_midwest, and related follow-on rows). These exist because the broad regional grid alone could not express audited high-value months.
- **`largemouthLakeGuardAdjustments`** in `scoreCandidates.ts`: keeps daily scoring from promoting backups (finesse, roaming swimbait, unauthored surface) ahead of **authored monthly primaries** on lakes.

### Smallmouth bass

**Finished enough because:** River and clear-lake smallmouth behavior is distinct from largemouth across prespawn, tailwater, Great Lakes, northeast, and south-central scenarios without SMB collapsing into LMB-style cover or frog logic.

**Biggest lessons**

- **Species identity is the bar:** Tubes, hair jigs, jerkbaits, inline spinners, and current-friendly tools must win when the monthly row says they should—not generic bass defaults.
- **River vs lake parity:** Both contexts must stay equally credible; river seams and rock/current stories are not optional extras.
- **Guards vs rows:** Many SMB fixes are **scoring guards** tied to specific region/month/context (drop-shot or Ned hijacks, fall blade vs jerk, GL June surface noise) because the same seasonal row sometimes serves multiple audit anchors.

**Do not casually remove**

- **`smallmouthGuardAdjustments`** in `scoreCandidates.ts` (northern lake-like vs warm highland lake prespawn, tailwater fall, GL October, GL December, midwest April, **Pennsylvania June river** `stateCode === "PA"` tailwater shaping, and related fly guards such as GL June `mouse_fly`). These encode **matrix-proven** separation between authored primaries and generic high-score backups.
- Targeted **`addMonths`** SMB rows in `seasonal/smallmouth.ts` for south_central, great_lakes_upper_midwest, midwest_interior, northeast, mountain_west, and PNW pairs—each block exists for a visible audit cluster.

### Trout (river)

**Finished enough because:** Cold classic, mountain west, tailwater, and PNW river arcs behave under matrix and daily-shift audits (including mouse vs wind and warmup vs cold snap).

**Biggest lessons**

- **Tailwater summer restraint:** Warm tailwater rows need their own seasonal story so June–August does not read like a generic cold-trout pack.
- **Narrow regional rows:** A few **explicit regional overrides** (mountain west April, southwest high desert August, PNW December) capture hydrology and season shape that the base grid under-specified.
- **State-scoped nudge (Idaho):** One **Idaho (`ID`)** practicality path for **April stained mountain-west rivers** keeps streamer-forward headlines aligned with the audit matrix without rewriting global trout biology.

**Do not casually remove**

- The **`// narrow regional overrides`** block in `seasonal/trout.ts` (`mountain_west` April, `southwest_high_desert` August, `pacific_northwest` December).
- The **trout April stained river** block in `practicalityFit` inside `scoreCandidates.ts` (`stateCode === "ID"` inline spinner / streamer nudges and `slim_minnow_streamer` penalty). Removing it without replacing the matrix story will likely regress **April Idaho river** scenarios.

### Northern pike

**Finished enough because:** Northern-core lake, Adirondack clear, Rainy River, Alaska interior, and reservoir pike stories hit matrix expectations across winter metal, spring river current, summer stratification, and fall feed-up.

**Biggest lessons**

- **Northern posture as default:** Pike logic is built around northern hard water, weed lakes, and river current; specialty tools stay credible without inventing fake winner windows everywhere.
- **Micro-ordering, not new biology:** **`pikeSortSkew`** applies **tiny** score separations so honest ties break the way the audit expects (winter metal, clear prespawn swim vs soft jerk, summer spinner vs paddle, summer river streamer vs clouser) without changing seasonal pools.

**Do not casually remove**

- **`pikeSortSkew`** and the **`pike_jerkbait`** practicality bonus (reaction-on, visibility sane days) in `scoreCandidates.ts`; they are how stable matrix ordering survives **rounded** score totals.
- The **south_central April river** seasonal row in `seasonal/pike.ts` (commented as the southern-interior spring river dungeon/streamer lead). It is a **narrow geographic/month/context** exception to the broader river grid.

---

## 3. Tuning philosophy (Section 2.3)

Maintainers should keep these principles aligned with code reality:

1. **Monthly biology defines the valid world.** Seasonal rows set which archetypes, columns, moods, and forage stories are even in play for `species + region + month + context`.
2. **Daily conditions rank within that world.** `resolveDailyPayload` and related signals reorder emphasis inside the monthly envelope; they should not invent entirely new seasonal species behavior in one jump.
3. **Conviction when one option is truly better.** When the monthly primaries and daily posture agree, the engine should not spread probability across three interchangeable clones—rank 1 should be defensible.
4. **Specialty archetypes do not need fake winner windows.** Narrow tools stay **narrow**; the audit contract (`intentional_low_frequency_specialty`, etc.) lives in [archetypeExpectations.ts](../../scripts/recommender-v3-audit/archetypeExpectations.ts) and [V3_IMPLEMENTATION_SCORECARD.md](./V3_IMPLEMENTATION_SCORECARD.md).
5. **State and scenario misses are evidence, not a license to encode biology in ad-hoc patches.** Investigate miss clusters, prefer **seasonal pool** or **small guard** fixes, and extend regional models deliberately rather than scattering one-off rules.

---

## 4. Exceptions and overrides registry (Section 2.4)

This is a **maintainer map** of narrow behaviors that are easy to misread as “bugs” or “cleanup opportunities.” Each entry: **why**, **what it protects**, **when a better regional model would replace it**.

### 4.1 Seasonal row overrides (`seasonal/*.ts`)

Later `addMonths(...)` calls **override** earlier broad grids for specific `region_key` × `month` × `context` combinations. They exist because matrix tuning proved the base grid wrong for that window.

| Location | What | Why / protected scenario | Replace when |
|----------|------|---------------------------|--------------|
| `largemouth.ts` — comment **Focused largemouth overrides** | Florida lake months; south-central lake/river; gulf; great_lakes_upper_midwest; additional follow-on months | Prespawn, spawn, grass summer, fall, and winter control stories for audited anchors (Florida, Texas/Ozarks, northern natural lakes) | You have a **declarative** regional month model (or denser grid) that reproduces the same matrix outcomes without duplicate rows. |
| `trout.ts` — **narrow regional overrides** | `mountain_west` April; `southwest_high_desert` August; `pacific_northwest` December | April runoff edge, high-desert late summer bottom hold, PNW deep winter | Hydrology/climate model per basin replaces hand-authored month exceptions. |
| `pike.ts` — **south_central** `freshwater_river` April | Dungeon / heavy streamer fly primacy in colored southern-interior spring rivers | Matrix anchor for spring river pike away from northern-default assumptions | A real `south_central` river sub-model (or split context) encodes the same story. |
| `smallmouth.ts` | Many targeted `addMonths` blocks (south_central, GL, midwest, northeast, mountain_west, PNW, etc.) | Clear prespawn GL lakes, tailwater rivers, PA/Midwest fall transitions, highland summer | Same as largemouth: replace with structured regional data, not by deleting without reproducing audits. |

### 4.2 Scoring guards and regional nudges (`scoreCandidates.ts`)

| Mechanism | Geography / state | What it does | Protected scenario | Replace when |
|-----------|-------------------|--------------|----------------------|--------------|
| `largemouthLakeGuardAdjustments` | Lakes (species-wide) | Penalizes unauthored surface, wrong finesse hijacks vs monthly primaries, prespawn/summer/winter guards | Matrix-stable LMB lake rank order | Monthly primaries + daily model alone preserve ranks. |
| Regional primary-stack deltas (same function) | `great_lakes_upper_midwest`, `florida`, `south_central`, `pacific_northwest`, `mountain_west` | Inside `largemouthLakeGuardAdjustments`: small deltas so **authored primary order** matches audit (e.g. GL Aug swim vs soft jerk, FL March jig vs jerk, SC winter finesse backup, PNW March lipless vs jig/spinner, PNW Aug drop shot vs swim/frog, MW Feb Texas rig vs football) | Specific matrix months called out in code comments | Declarative “primary tie-break policy” per region/month or improved daily posture model reproduces the same ordering. |
| `smallmouthGuardAdjustments` | Multi-region; **`stateCode === "PA"`** for northeast June river | Large set of SMB-specific hijack guards (drop shot vs tube, GL June walker, SC Nov blade, NE tailwater Apr–May, GL Oct spinner, GL Dec drop shot, **PA June river** tube/crank/jerk vs walker, GL June mouse fly) | SMB matrix and river/lake separation | First-class SMB regional subtypes (e.g. state- or basin-level rows) absorb the guards. |
| `practicalityFit` trout block | `mountain_west` + April + stained + **`ID`** | Streamer-forward April; penalize inline-only read; boost sculpin/bugger/clouser | Idaho April river matrix | Idaho hydrology modeled without hard state gate. |
| `monthlyPrimaryFit` primary order weights | Species-specific tie weights for multi-primary rows | Lets **authored primary list order** break honest ties without randomness | Any multi-primary row | Never “simplify” weights without rerunning matrix—pike/trout/SMB use slightly different coefficients. |
| `pikeSortSkew` | Context/month/clarity-based | Micro nudges only (winter metal, clear prespawn swim, summer spinner, summer river streamer, clear spawn surface order) | Stable pike rank ordering under rounding | Never merge into large arbitrary bonuses—keep micro or replace with deterministic sort key. |
| `pike_jerkbait` practicality bonus | Daily reaction + visibility | Rewards pike jerk when reaction is on and visibility sane | Honest pike jerk windows | Only if archetype metadata absorbs the same signal. |

### 4.3 Daily payload hard rules (`resolveDailyPayload.ts`)

| Rule | What | Why | Replace when |
|------|------|-----|--------------|
| Clarity-driven presence override | Dirty water **forces** presence toward visibility; clear can default subtle | Non-negotiable user-visible clarity contract | A redesigned presence model still enforces dirty-water visibility priority. |

### 4.4 Engine exceptions not mapped above

**None identified** beyond the seasonal overrides, the `scoreCandidates.ts` mechanisms above, the daily clarity presence rule, and normal archetype/clarity/family fits that are global—not “hidden exceptions.”

If you add a new **state_code** or **region_key** branch, append a row here in the same format so Section 2.4 stays the single registry.

---

## Related links

- [MAINTAINER_VALIDATION.md](./MAINTAINER_VALIDATION.md) — rerun commands and artifact policy  
- [V3_REGRESSION_ANCHORS.md](./V3_REGRESSION_ANCHORS.md) — must-not-regress scenarios, test map, tie caps, baseline verify  
- [V3_AUDIT_INTERPRETATION.md](./V3_AUDIT_INTERPRETATION.md) — how to read matrix summary, specialty block, and coverage audit  
- [V3_PRODUCT_INTEGRATION.md](./V3_PRODUCT_INTEGRATION.md) — edge + client path, species keys, release vs UX triage  
- [FRESHWATER_V3_PROGRAM.md](./FRESHWATER_V3_PROGRAM.md) — original audit program context (still useful; note **post-tuning** mode in this doc supersedes “start with largemouth only” urgency)  
- [recommender-v3-post-tuning-checklist.md](../recommender-v3-post-tuning-checklist.md) — full checklist  
- [recommender-v3-roadmap.md](../recommender-v3-roadmap.md) — long-term architecture direction  
