# Recommender Remediation Checklist

## Phase 1: Engine Correctness

- [x] Define the remediation order so ranking quality is fixed before UI polish.
- [x] Fix lure score normalization so a best-fit family can reach 100.
- [x] Replace flat additive scoring with biologically sensible weighted scoring.
- [x] Add contradiction penalties for poor daily/context fits.
- [x] Add per-family score breakdown output for debugging and future UI surfacing.
- [x] Generate explanation text from actual score drivers instead of global behavior only.
- [x] Remove frontend/backend state-species gating drift by generating the frontend mirror from the backend source.
- [x] Add deterministic regression tests for scoring, explanations, and gating.

## Phase 2: Recommendation Sharpness

- [x] Expand lure/fly metadata for clarity fit, cover fit, and current/tide fit.
- [ ] Tune weights against saved species/context scenarios.
- [x] Upgrade confidence so it reflects recommendation robustness, not just seasonal context.
- [x] Add a scenario harness to review top 3 rankings and explanations at scale.

## Phase 3: Product Surface

- [ ] Show the four explanation fields by default on result cards.
- [ ] Surface multiple confidence reasons instead of truncating to one line.
- [ ] Add real refresh behavior for recommender results.
- [ ] Filter available species by selected context as well as state.
