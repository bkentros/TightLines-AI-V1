# Phase 2 thermal research checkpoint

This is a tested research checkpoint, not completed runtime onboarding or public approval.

## Artifacts

- Nine species-specific provisional thermal candidates, with explicit per-knot judgment labels and source references. Round whitefish is marked very low confidence.
- Nine preserved source snapshots and three documented direct-download failures across 12 reviewed source records. GLFC PDF pages 71, 136 and 192 and Wisconsin guide-study PDF page 22 were visually checked.
- 2,889 temperature samples and 6,656 hypothetical weekly/temperature scenarios for the 16 accepted annual pairings, generated using the actual runtime interpolators and unchanged scoring formula.
- Sixteen-pair eligibility register: three named covered-structure corroborations, five contextual inferences, eight unresolved side attributions. No source/structure gate has been approved by inference from a thermal curve.
- Maximum tested score difference for a two-degree input difference at an annual peak is 0.9, for Manistee yellow perch. This is numerical sensitivity, not measured error, a confidence interval or evidence that the temperature source meets its acceptance criteria.

## Checks

- Complete PierCast suite: **125 passed, zero failed**.
- TypeScript: `npx tsc --noEmit` passed.
- Deno type check: `deno check scripts/generate-pier-cast-phase2.ts` passed.
- Phase 2 generator, source hashes, generated thermal module, scenario tables and evidence report: current.
- Phase 1 annual research: six tests and generated artifacts passed.
- Original remaining-species evidence: four tests and generated artifacts passed.
- Completed-core seasonal replay: current.
- New tests cover curve bounds, continuity, cold values, species distinctions, formula headroom, missing/stale/unreviewed input, public approval and unchanged active species profiles.

## Open work

Thermal candidates require scientific review and independent outcome validation; the warm tails and adult round-whitefish response are particularly weak. The side/method review must resolve or defer the uncertain attributions and reconcile current regulations before any affected runtime activation. The 2026 regulation PDF exceeded the web reader's size limit; the 2025 agency notice and retained 2026 register do not constitute a fresh complete legal audit.

The generated thermal module remains detached from runtime assembly. Existing core scores, species profiles, UI, daily snapshot behavior, provider pipeline and public gates are unchanged. No migration or deployment was required for this research checkpoint. Phase 2 remains in progress; do not call these species onboarded or the numerical profiles empirically validated.
