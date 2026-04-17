# Recommender V3 Report-Audit Correction Plan

## Purpose

This plan translates the findings in `TightLinesAI/docs/audits/recommender-v3/**` into a phased, file-level fix sequence. It is the authoritative next-step document for the recommender V3 report audit. Each item cites the originating audit finding, the file(s) and function(s) to change, and an acceptance check.

Work this plan section-by-section. Separate commits per phase are encouraged so a validation pass can land between them.

## Scope And Product Direction

- **Trout flies are streamer-only by design (confirmed 2026-04-17).** Dry flies, nymphs, emergers, and terrestrials are intentionally out of scope for V3 for simplicity. Do not re-introduce them as part of this plan.
- **Trout `primary_forage=baitfish` is coarse-but-fine.** Do not split into `baitfish_fry` / `salmon_smolts` / `salmon_flesh` / `egg_pattern` as part of this plan (left as a future-polish note in trt-04).
- **Pike-01 / pike-03 fly-trio "inversion" is working-as-designed.** Root cause understood (per-slot `diversity_bonus` in `topThreeSelection.ts:98-134`); addressed by removing the auto-flag in P1 rather than by changing engine behavior.

Ground-truth references:
- Engine semantics: [`docs/recommender-v3-maintainer-guide.md`](../../recommender-v3-maintainer-guide.md)
- Post-tuning baseline: [`docs/recommender-v3-post-tuning-checklist.md`](../../recommender-v3-post-tuning-checklist.md) — do not regress the 309/309 headlines captured there.
- Cross-species findings: [`_cross_species_findings.md`](./_cross_species_findings.md)
- Species rollups: [`smallmouth/_summary.md`](./smallmouth/_summary.md), [`largemouth/_summary.md`](./largemouth/_summary.md), [`pike/_summary.md`](./pike/_summary.md), [`trout/_summary.md`](./trout/_summary.md)
- Lane-fit diagnostics: [`_lane_fit_diagnostics.md`](./_lane_fit_diagnostics.md)

## Guardrails For This Plan

- Prefer narrow, documented fixes over broad architectural changes.
- After each phase, rerun the freshwater validation suite and confirm no regression against the current post-tuning baseline (309/309 top-1, 309/309 top-3, 0 hard fails, 0 soft fails).
- Rerun the report-audit harness (`deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts <species>`) after each phase to confirm the audit findings targeted by that phase actually go away.
- Do not reopen species-level tuning beyond the specific authoring edits listed here.
- Do not introduce random tie-breakers or hidden scoring rules.

## Phase 0 — BLOCKER (temperature-context correctness)

**Goal:** Every pike and trout day read that hinges on water temperature should receive a biologically correct `temperature_metabolic_context`, instead of the current bass-tuned thresholds.

**Root finding:** [`_cross_species_findings.md` §1.1](./_cross_species_findings.md#11-blocker-species-agnostic-temperature_metabolic_context-thresholds); scenario evidence: pike-02 (63°F → `cold_limited` on a fall-feed day), pike-05 (78°F → `neutral`), trt-02 (55°F → `cold_limited`), trt-05 (55°F → `cold_limited`).

### 0.1 Species-specific metabolic-context thresholds
- [ ] Locate the metabolic-context classifier that populates `temperature_metabolic_context` inside `deriveDailyPreference` (single source of truth — do not duplicate logic into seasonal authoring).
- [ ] Replace the single species-agnostic threshold block with a species-keyed table matching:

  | species | cold_limited | optimal | warm_limited |
  | --- | --- | --- | --- |
  | largemouth_bass | < 52°F | 65-80°F | > 86°F |
  | smallmouth_bass | < 48°F | 58-75°F | > 80°F |
  | pike_musky | < 40°F | 45-65°F | > 72°F |
  | river_trout | < 40°F | 45-65°F | > 68°F |

- [ ] Thread the species key from the incoming seasonal row (or species profile) into the classifier rather than hard-coding it at the call site.
- [ ] Unit-test each species with temperatures at the threshold boundaries (39/40, 44/45, 48/49, 52/53, 58/59, 65/66, 68/69, 72/73, 75/76, 80/81, 86/87).

### 0.2 Validation
- [ ] `npm run audit:recommender:v3:freshwater:validate` — confirm 309/309 headlines unchanged.
- [ ] `deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts pike` — confirm pike-02 flips from `cold_limited` to `optimal`/`neutral` and pike-05 from `neutral` to `warm_limited`. Fall-feed posture on pike-02 should no longer read "Cold metabolism shuts down activity."
- [ ] `deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts trout` — confirm trt-02 and trt-05 flip from `cold_limited` to `optimal`.
- [ ] Smallmouth and largemouth bass scenario reports remain unchanged (bass thresholds preserved).

## Phase 1 — BUGS (copy, templates, archetypes, seasonal rows, auto-flags)

**Goal:** Eliminate the recurring copy-contradiction, fit-value detail, seasonal-surface-gate, archetype-authoring, and auditor-harness-noise findings. All items below are small and independent; they can be parallelised if desired.

### 1.1 Column-hint / variant-selection column awareness
- **Root finding:** [`_cross_species_findings.md` §1.2](./_cross_species_findings.md#12-bug-buildcolumnhint-contradicts-how_to_fish_variants-selection). Recurs on smb-02 (`inline_spinner`, `muddler_sculpin`), smb-03 (3 picks), smb-05 (`muddler_sculpin`), lmb-02 (`weightless_stick_worm`), trt-01, trt-02, trt-04, trt-05 (`muddler_sculpin`, `woolly_bugger`).
- [ ] In `supabase/functions/_shared/recommenderEngine/v3/recommendationCopy.ts`, add an optional `implied_column: "surface" | "upper" | "mid" | "bottom"` metadata field to each entry in every archetype's `how_to_fish_variants`.
- [ ] Extend `selectHowToFishTemplate` to prefer variants whose `implied_column` matches `resolved.daily_preference.preferred_column` (or `secondary_column` as a fallback), falling back to the current selection order if none match.
- [ ] Extend `buildColumnHint` to suppress itself when the selected variant's `implied_column` already matches the day preference. Cheap secondary guard: if the variant text already contains an explicit column cue (regex on `bottom`, `surface`, `near the top`, `mid-depth`), skip the hint.
- [ ] Audit every `how_to_fish_variants` entry across `candidates/lures.ts` and `candidates/flies.ts` and assign a conservative `implied_column`. Variants without a clear column intent get `undefined` and remain eligible on any day.

### 1.2 `muddler_sculpin.primary_column = bottom`
- **Root finding:** [`smallmouth/_summary.md`](./smallmouth/_summary.md), smb-02 Finding 2; trt-01 Finding 4; trt-04 Finding 3.
- [ ] In `supabase/functions/_shared/recommenderEngine/v3/candidates/flies.ts`, change `muddler_sculpin.primary_column` from `mid` to `bottom`. Keep `secondary_column=mid`. Leave `tactical_lane=fly_bottom` unchanged — it is already correct.
- [ ] Confirm `column_range` includes `bottom` and `mid`.

### 1.3 `inline_spinner.how_to_fish_variants` cleanup
- **Root finding:** smb-02 Finding 1; trt-01 Finding 5.
- [ ] In `candidates/lures.ts`, remove (or rewrite) the `inline_spinner` how-to-fish variant that describes "slow-roll near bottom". Replace with a mid-column steady retrieve variant if one is not already present.
- [ ] Tag each remaining `inline_spinner` variant with the `implied_column` added in 1.1.

### 1.4 `weightless_stick_worm.how_to_fish_variants` cleanup
- **Root finding:** lmb-02 Finding (weightless_stick_worm).
- [ ] In `candidates/lures.ts`, remove the bottom-drag variant on `weightless_stick_worm` (a weightless stick worm is canonically an upper/mid dead-stick tool). Replace with an upper-column twitch/dead-stick variant.
- [ ] Tag each remaining variant with `implied_column`.

### 1.5 Scoring `detail` text branches on fit value
- **Root finding:** [`_cross_species_findings.md` §1.3](./_cross_species_findings.md#13-bug-scoring-detail-strings-dont-differentiate-primary-40-vs-secondary-25--tertiary-125--quaternary-025--miss--25-fits).
- [ ] In `supabase/functions/_shared/recommenderEngine/v3/scoring/scoreCandidates.ts` (lines ~508-524, the `column_fit` / `pace_fit` / `presence_fit` breakdown builders), branch on the numeric fit value returned by `dimensionFit` (lines 52-68) using the set `{4.0, 2.5, 1.25, 0.25, -2.5}`. Suggested phrasing:
  - `4.0` → `"Sits in today's primary {column|pace|presence} lane."`
  - `2.5` → `"Overlaps as a secondary option for today's {column|pace|presence}."`
  - `1.25` → `"Touches today's tertiary {column|pace|presence} lane."`
  - `0.25` → `"Only grazes today's {column|pace|presence} preference."`
  - `-2.5` → `"Does not match today's {column|pace|presence}."`
- [ ] Factor the branch into a small local helper (one per dimension or a shared one) — avoid duplicating the strings across the three `breakdown` entries.

### 1.6 `buildWhyChosen` forage intersection fix
- **Root finding:** [`_cross_species_findings.md` §1.5](./_cross_species_findings.md#15-polish-buildwhychosen-forage-attribution-can-cite-forage-the-archetype-does-not-imitate). Scenario evidence: pike-01 ("Hollow-Body Frog stays in play when bluegill_perch is relevant").
- [ ] In `recommendationCopy.ts#buildWhyChosen`, emit the forage sentence only when `seasonal_row.primary_forage ∪ seasonal_row.secondary_forage` intersects `archetype.forage_matches`. Use the intersected key(s) for the phrase. When no intersection exists, drop the forage sentence rather than defaulting to the seasonal forage key.

### 1.7 `river_trout` seasonal rows — surface flag flip
- **Root finding:** [`trout/_summary.md`](./trout/_summary.md) top theme 2; trt-01 Finding 2, trt-02 Finding 3, trt-03 Finding 3, trt-05 Finding 3.
- [ ] In `supabase/functions/_shared/recommenderEngine/v3/seasonal/riverTrout.ts` (or equivalent), set `surface_seasonally_possible=true` on all in-season months (April–October across trout regions). Confirm winter rows with product before flipping.
- [ ] Do **not** change `primary_forage` (stays `baitfish` per product direction).
- [ ] Do **not** add presence/columns that aren't already there unless needed to keep `mouse_fly` / `popper_fly` candidate-eligible.
- [ ] Acceptance: re-run `runAudit.ts trout`; at least one trout scenario with an open daily `surface_window` should now surface-consider `mouse_fly` or `popper_fly`. Cold days (trt-03 at 42°F) should still close surface via the daily gate.

### 1.8 Auto-flag tuning in `flags.ts`
- **Root finding:** [`_cross_species_findings.md` §1.4](./_cross_species_findings.md#14-fyi-rank-order-auto-flag-is-a-false-positive-generator-pike-01--pike-03-dismissed).
- [ ] In `scripts/recommender-v3-report-audit/flags.ts`:
  - **Remove** the rank-order inversion auto-flag entirely (or demote to an FYI-only diagnostic with a footnote explaining per-slot `diversity_bonus` reordering from `topThreeSelection.ts:98-134`). No clean comparator exists without re-running slot-by-slot selection.
  - Restrict the "bottom-copy vs primary_column" auto-flag so it only fires on drag/crawl/slow-roll verbs (not every appearance of the word `bottom` in a how_to_fish string).
  - Restrict the surface-window violation auto-flag to candidates with `is_surface=true` or `primary_column=surface`.
  - Downgrade the low-diversity auto-flag to FYI when `opportunity_mix=conservative`.

### 1.9 Validation
- [ ] `npm run audit:recommender:v3:freshwater:validate` — confirm 309/309 headlines unchanged.
- [ ] `deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts all` — confirm:
  - No `how_to_fish` on `muddler_sculpin`, `woolly_bugger`, `inline_spinner`, or `weightless_stick_worm` is contradicted by an appended column hint.
  - Detail strings on `column_fit`/`pace_fit`/`presence_fit` differ between 4.0 and non-4.0 values.
  - pike-01 frog_fly forage sentence no longer appears (intersection is empty).
  - Trout scenarios with open daily surface windows include `mouse_fly` / `popper_fly` in the candidate pool.
  - The formerly BLOCKER-flagged rank-order inversions on pike-01 / pike-03 / smb-01 / smb-02 / lmb-02 disappear from auto-flags.

## Phase 2 — BUGS (seasonal-row narrow broadenings)

**Goal:** Fix the three specific seasonal-row authoring cells flagged in the audit. Each is a single-row edit.

### 2.1 `smallmouth_bass | great_lakes_upper_midwest | 7 | freshwater_river` allows `slow` pace
- **Root finding:** smb-05 Monthly pace constraint.
- [ ] Add `slow` to the row's `monthly_baseline.allowed_paces`. No other edits.
- [ ] Acceptance: runAudit on smb-05 — on a post-front bluebird day the daily pace preference should now land on `slow` (the intended guide read) rather than being clamped to `medium`.

### 2.2 `smallmouth_bass | mountain_west | 6 | freshwater_river` allows bottom/slow/subtle
- **Root finding:** [`_lane_fit_diagnostics.md`](./_lane_fit_diagnostics.md) Entry 1; resolved as **option (C)** per [`_cross_species_findings.md` §3](./_cross_species_findings.md#3-_lane_fit_diagnosticsmd-entries--recommended-resolution).
- [ ] Broaden the row so `allowed_columns` includes `bottom`, `allowed_paces` includes `slow`, and `allowed_presence` includes `subtle`. A properly-authored row exposes all three axes across their full range (`allowed_paces=[slow,medium,fast]`, `allowed_columns=[bottom,mid,upper,surface]`, `allowed_presence=[subtle,moderate,bold]`) so the daily shift layer can pick a cold-water finesse read or a post-front aggressive read depending on conditions.
- [ ] Acceptance: `_lane_fit_diagnostics.md` is empty after the next run; `ned_rig` lands in the candidate pool for mountain-west June SMB.

### 2.3 `pike_musky | great_lakes_upper_midwest | 6 | freshwater_river` presence order
- **Root finding:** pike authoring note.
- [ ] Reorder `monthly_baseline.allowed_presence` so `moderate`/`bold` are primary and `subtle` is secondary (the intended post-spawn pike read). Keep the same set of values.

### 2.4 Validation
- [ ] `npm run audit:recommender:v3:freshwater:validate` — no regression.
- [ ] `runAudit.ts smallmouth` — smb-05 picks a slow presentation on post-front days; lane-fit diagnostics file is empty.
- [ ] `runAudit.ts pike` — pike-01 (post-spawn UPM pike) leads with a moderate/bold presentation rather than subtle.

## Phase 3 — POLISH (engine + copy)

**Goal:** Tighten the engine and copy layer. None of these are correctness blockers; each is a targeted quality lift called out by the audit.

### 3.1 Pace-shift cap under 65°F for warmwater species
- **Root finding:** lmb-02 (April pre-spawn 62°F still shifts to `pace=fast`). See [`_cross_species_findings.md` P3 #13](./_cross_species_findings.md#p3--polish-enginetuning).
- [ ] In `deriveDailyPreference`, clamp the net `pace_shift` at `0` (or `-1`) when species is `largemouth_bass` or `smallmouth_bass` and water temperature is below 65°F. Do not suppress all fast shifts — only the net positive ones below the threshold.
- [ ] Acceptance: runAudit lmb-02 — April 62°F pre-spawn day lands on `pace=medium` primary, `pace=fast` secondary (or equivalent).

### 3.2 Surface-reservation logic
- **Root finding:** pike and LMB scenarios where a wide-open surface window still produces a sub-surface trio.
- [ ] In `scoreCandidates.ts` / `topThreeSelection.ts#changeupBonus`, add a small additional bonus for `is_surface=true` archetypes when `daily_preference.surface_allowed_today=true` and `opportunity_mix=aggressive`. Keep the bonus well below the existing surface bonus on clean windows so conservative days are not perturbed.

### 3.3 Lane-diversity term in `diversity_bonus`
- **Root finding:** audit-wide observation that `diversity_bonus` rewards family diversity but not lane diversity.
- [ ] In `topThreeSelection.ts#changeupBonus`, add a small `+0.1` bonus (tuneable) when `candidate.tactical_lane` is not already represented in the selected set.

### 3.4 Deep-structure weighting path for summer deep LMB
- **Root finding:** lmb-04 mid-deep scenarios.
- [ ] In `scoreCandidates.ts`, when `seasonal.location_band` is `mid_deep` and `resolved.daily_preference.preferred_column=bottom`, add a small positive delta to archetypes with `primary_column=bottom` and `tactical_lane=bottom_contact` to keep the trio honest on deep summer LMB days.

### 3.5 Tertiary column in `matchesPreferredColumn`
- **Root finding:** polish observation — tertiary column matches fire no hints today.
- [ ] In the column-preference matching helper, allow tertiary matches to fire a softer hint (or reduced weight) instead of being dropped.

### 3.6 Rotating `why_chosen` opener across trio picks
- **Root finding:** every species shows three near-identical leads (`"It matches the column/pace…"`).
- [ ] In `recommendationCopy.ts#buildWhyChosen`, rotate the opening clause across the three selection roles (`best_match`, `strong_alternate`, `change_up`) so the trio reads as three distinct recommendations instead of three paraphrases of the same sentence. Do not rewrite the substance, only the lead.

### 3.7 Validation
- [ ] `npm run audit:recommender:v3:freshwater:validate` — headlines unchanged.
- [ ] `runAudit.ts all` — P3 targets each resolve as above; no new BUG-severity auto-flags appear.

## Out Of Scope / Won't-Do

These showed up in the audit but are **not** part of this plan, for explicit reasons:

- **Extending `FLY_ARCHETYPES_V3` with dries / nymphs / emergers / terrestrials.** Trout is streamer-only by design.
- **Splitting `river_trout.primary_forage` into finer keys** (`baitfish_fry` / `salmon_smolts` / `salmon_flesh` / `egg_pattern`). Product direction is coarse-but-fine.
- **Re-investigating pike-01 / pike-03 role assignment.** Verified working-as-designed; the auto-flag is being removed (P1 #8) rather than the engine being changed.
- **Scenario environment polish** (e.g., lmb-02 SE Atlantic April pre-spawn conditions). Scenario tuning is a separate pass tracked in the audit `_lane_fit_diagnostics.md` and scenario FYIs.

## Suggested Execution Order

1. Phase 0 (single BLOCKER; small; unlocks clean pike/trout day reads for the rest of the audit).
2. Phase 1 (largest surface area; can be parallelised but run validation after each batch).
3. Phase 2 (three tiny seasonal-row edits; run as one commit).
4. Phase 3 (polish; optional before ship, desirable before the next audit pass).

## Definition Of Done

- Every `[ ]` box in Phases 0–3 is checked.
- `npm run audit:recommender:v3:freshwater:validate` still reports 309/309 top-1, 309/309 top-3, 0 hard fails, 0 soft fails.
- `deno run --allow-read --allow-write scripts/recommender-v3-report-audit/runAudit.ts all` produces a report with:
  - 0 [BLOCKER]-severity auditor findings.
  - No recurring column-hint/variant contradictions across `muddler_sculpin`, `woolly_bugger`, `inline_spinner`, `weightless_stick_worm`.
  - No forage sentences citing forage the archetype does not imitate.
  - `_lane_fit_diagnostics.md` empty.
- The audit summary counts after the next audit pass should collapse to approximately `[BLOCKER]: 0, [BUG]: <5, [POLISH]: ~12, [FYI]: ~20` from the current `[BLOCKER]: 1 category, [BUG]: ~15, [POLISH]: ~12, [FYI]: ~20`.
