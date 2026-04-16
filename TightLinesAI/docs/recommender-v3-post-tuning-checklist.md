# Recommender V3 Post-Tuning Checklist

## Purpose
This checklist captures the remaining work after the recommender engine reached a matrix-clean state across all four supported species:

- `largemouth_bass`
- `smallmouth_bass`
- `trout`
- `northern_pike`

The engine is no longer in a broad species-retuning phase. The remaining work is now:

- audit and tooling hardening
- documentation and maintainer guidance
- regression protection
- analyzer and specialty-metric hygiene
- product integration confidence

This file is meant to be worked section-by-section with separate agent passes if needed.

## Current Baseline
The tuned engine has already achieved the following unified validation baseline:

- `309/309` top-1 primary
- `309/309` top-3 primary
- `309/309` disallowed avoidance
- `309/309` top color-lane match
- `0` hard fails
- `0` soft fails
- `14/14` daily-shift audit checks
- coverage intent mismatches cleaned up to `0`

This checklist should preserve that baseline. No task below should knowingly regress that state.

## Guardrails For Any Future Work
- Do not broadly rewrite the recommender architecture unless a truly critical flaw is discovered.
- Do not reopen species-level tuning unless a regression or real-world failure proves it is necessary.
- Do not introduce random tie-breakers or fake certainty.
- Do not chase noisy specialty diagnostics unless they reflect a real product-quality issue.
- Always rerun the smallest useful validation set after each change.
- Prefer narrow, documented fixes over broad hidden scoring rules.

## Section 1: Audit And Tooling Hardening
Goal: make the validation workflow consistent, documented, repeatable, and easy to rerun.

Maintainer commands and artifact policy: [recommender-v3-audit/MAINTAINER_VALIDATION.md](./recommender-v3-audit/MAINTAINER_VALIDATION.md).

### 1.1 Package Script Coverage
- [x] Review `package.json` and confirm that all recommender audit flows are exposed consistently.
- [x] Confirm the following categories are represented by scripts:
  - [x] species-specific matrix archive generation
  - [x] species-specific matrix runs
  - [x] freshwater combined matrix analysis
  - [x] coverage audit
  - [x] daily-shift audit
  - [x] full one-command validation
- [x] Verify the new pike-related scripts are consistent with largemouth, smallmouth, and trout script naming.
- [x] Remove any old or duplicate script patterns that are no longer used.

### 1.2 One-Command Validation Workflow
- [x] Verify the single-command validation flow works from a clean checkout.
- [x] Confirm it regenerates the expected artifacts in the right order.
- [x] Confirm it fails loudly when one sub-step breaks.
- [x] Decide whether the one-command validation should run:
  - [x] matrix archive rebuilds (**excluded** from one-command flow; use `npm run audit:recommender:v3:freshwater:matrix:archive-env-all` when scenario locations/dates change)
  - [x] matrix runs
  - [x] matrix analysis
  - [x] coverage audit
  - [x] daily-shift audit
- [x] Document expected runtime and prerequisites.

### 1.3 Generated Artifact Policy
- [x] Decide which generated audit artifacts should remain committed to git.
- [x] Decide which generated files are temporary and should be ignored.
- [x] Confirm the current tracked generated files match that policy.
- [x] If needed, update `.gitignore` or docs to reflect the intended workflow.

### 1.4 Validation Command Documentation
- [x] Create or update a short maintainer reference for:
  - [x] full freshwater validation
  - [x] individual species matrix validation
  - [x] coverage audit
  - [x] daily-shift audit
- [x] Include copy-paste-ready commands.
- [x] Include expected output locations.
- [x] Include what counts as a pass/fail result.

## Section 2: Documentation And Maintainer Guidance
Goal: document the tuned state so future changes do not accidentally unravel the work.

Canonical write-up: [recommender-v3-audit/V3_POST_TUNING_STATE.md](./recommender-v3-audit/V3_POST_TUNING_STATE.md) (engine status, species notes, philosophy, exception registry).

### 2.1 Engine State Documentation
- [x] Update relevant recommender docs to reflect that all four species are now matrix-clean.
- [x] Add a short summary of the current engine status and what “clean” means.
- [x] Record the final validation baseline numbers.
- [x] Document that the engine is now in post-tuning / polish mode rather than rebuild mode.

### 2.2 Species Reference Notes
- [x] Add a short reference note for each species describing what makes its current tuning state “finished enough.”
- [x] Capture the biggest lessons from each species pass:
  - [x] largemouth
  - [x] smallmouth
  - [x] trout
  - [x] pike
- [x] Note any narrow intentional exceptions or overrides that future maintainers should not casually remove.

### 2.3 Tuning Philosophy Documentation
- [x] Make sure the maintainer-facing docs clearly state:
  - [x] monthly biology defines the valid world
  - [x] daily conditions rank within that world
  - [x] the engine should express conviction when one option is truly better
  - [x] specialty archetypes do not need fake winner windows
  - [x] state/scenario misses are evidence, not usually the place to encode biology

### 2.4 Exception And Override Documentation
- [x] Audit any narrow state-aware or geography-aware scoring exceptions still in the engine.
- [x] For each one, document:
  - [x] why it exists
  - [x] what scenario it protects
  - [x] what would justify replacing it with a better regional model later

## Section 3: Regression Protection
Goal: protect the strongest tuned behavior from accidental future regressions.

Anchor list, test map, tie policy, and baseline pointers: [recommender-v3-audit/V3_REGRESSION_ANCHORS.md](./recommender-v3-audit/V3_REGRESSION_ANCHORS.md).

### 3.1 Identify Critical Anchors
- [x] List the most important “must not regress” scenarios across species.
- [x] Include flagship anchors and any formerly fragile rows that required multiple tuning passes.
- [x] Group them by species and context.

### 3.2 Test Coverage Review
- [x] Review current recommender tests and determine whether the most important final-state behaviors are protected.
- [x] Decide whether new targeted tests are worth adding for:
  - [x] flagship seasonal rows
  - [x] previously fragile daily-shift behaviors
  - [x] previously fragile tie / conviction scenarios
- [x] Avoid low-value tests that only restate implementation details.

### 3.3 Tie Regression Monitoring
- [x] Decide whether tie counts should be tracked as a formal regression signal.
- [x] If yes, determine where and how to surface that signal.
- [x] Define what level of tie increase would be considered a regression.

### 3.4 Audit Regression Baseline
- [x] Preserve a known-good final baseline for:
  - [x] freshwater matrix summary
  - [x] coverage audit
  - [x] daily-shift audit
- [x] Decide whether to store a human-readable changelog of these baselines for future comparison.

## Section 4: Analyzer And Specialty-Metric Hygiene
Goal: reduce diagnostic noise so future maintainers know what is a real issue versus a cosmetic one.

Canonical interpretation (matrix + coverage + specialty): [recommender-v3-audit/V3_AUDIT_INTERPRETATION.md](./recommender-v3-audit/V3_AUDIT_INTERPRETATION.md).

### 4.1 Specialty Table Review
- [x] Review the specialty sections in generated summaries for all species.
- [x] Identify metrics that are still useful.
- [x] Identify metrics that create more confusion than signal.
- [x] Decide whether specialty expectations should be:
  - [x] kept as-is
  - [x] reworded
  - [x] reclassified
  - [x] removed from certain summaries

### 4.2 Intent Table Truthfulness
- [x] Re-review the archetype intent table after the latest cleanup.
- [x] Confirm that each archetype’s expected role is still honest:
  - [x] winner-capable
  - [x] support-only
  - [x] narrow specialty
- [x] Check whether any other rare archetypes now deserve intent adjustments.

### 4.3 Coverage Report Interpretation
- [x] Review `v3-coverage-audit` language for any remaining misleading implications.
- [x] Make sure the report distinguishes clearly between:
  - [x] true failures
  - [x] acceptable top-3 specialty roles
  - [x] noisy reachability observations
- [x] Adjust wording only where it improves trust and maintainer clarity.

### 4.4 Matrix Summary Interpretation
- [x] Review whether any matrix summary fields are still easy to misread.
- [x] Clarify the difference between:
  - [x] primary contract success
  - [x] specialty reach diagnostics
  - [x] tie signals
  - [x] explanation conflicts
  - [x] fallback usage

## Section 5: Product Integration Confidence
Goal: make sure the tuned recommender baseline is safely integrated into the product and surrounding tooling.

Canonical note: [recommender-v3-audit/V3_PRODUCT_INTEGRATION.md](./recommender-v3-audit/V3_PRODUCT_INTEGRATION.md).

### 5.1 Integration Surface Review
- [x] Confirm the final tuned engine state is used everywhere the recommender is invoked.
- [x] Check whether any product code assumes outdated response behavior.
- [x] Confirm any downstream UI or gating logic still matches the current recommender outputs.

### 5.2 Recommender Output Stability
- [x] Review whether any user-facing surfaces need updated assumptions for:
  - [x] ranking confidence
  - [x] explanation text
  - [x] color recommendations
  - [x] top-3 lineup structure

### 5.3 Release Confidence Notes
- [x] Prepare a short internal note describing what has been finished and what is intentionally considered “done.”
- [x] Record what kinds of future issues should justify reopening tuning work.
- [x] Record what kinds of issues should instead be treated as product-layer or UX-layer work.

## Section 6: Optional Final Cleanup
Goal: nice-to-have polish that is not required for recommender correctness.

**Canonical closeout:** [V3_FINAL_HANDOFF.md](recommender-v3-audit/V3_FINAL_HANDOFF.md) (golden pointers, maintainer summary, reopen criteria). No duplicate JSON blobs in this checklist.

### 6.1 Golden Baseline Snapshot
- [x] Save a “known good” snapshot of the most important generated summary outputs. **Location:** committed paths under `docs/recommender-v3-audit/generated/` (see handoff §6.1); headline caps checked by `regression-baselines/expected-headlines.json` + `npm run audit:recommender:v3:regression-baselines`.
- [x] Decide whether that snapshot should live in docs, a changelog, or a release note. **Decision:** **docs** (repo) as source of truth; release notes may **link** to those paths; changelog of baseline bumps in `regression-baselines/CHANGELOG.md`.

### 6.2 Final Handoff Summary
- [x] Write a concise recommender handoff summary for future agents or maintainers. **Doc:** [V3_FINAL_HANDOFF.md](recommender-v3-audit/V3_FINAL_HANDOFF.md).
- [x] Include:
  - [x] what was tuned
  - [x] what is considered complete
  - [x] what remains optional
  - [x] what should not be casually changed

### 6.3 Future Reopen Criteria
- [x] Define explicit triggers for reopening recommender tuning. **See handoff §6.3** (aligned with [V3_PRODUCT_INTEGRATION.md](recommender-v3-audit/V3_PRODUCT_INTEGRATION.md) / [V3_POST_TUNING_STATE.md](recommender-v3-audit/V3_POST_TUNING_STATE.md)).
- [x] Examples:
  - [x] real-world recommendation failures
  - [x] new species or contexts
  - [x] major product requirement changes
  - [x] audit regressions

## Suggested Execution Order
If working this checklist with multiple agents, the recommended order is:

1. Audit and tooling hardening
2. Documentation and maintainer guidance
3. Regression protection
4. Analyzer and specialty-metric hygiene
5. Product integration confidence
6. Optional final cleanup

## Definition Of Completion
This checklist is complete when:

- validation workflows are consistent and documented
- maintainers can understand the current tuned state without rereading the entire tuning history
- critical recommender behavior has reasonable regression protection
- noisy diagnostics are clearly separated from true failures
- product integration assumptions are confirmed
- the recommender can be treated as a stable baseline unless real-world testing proves otherwise
