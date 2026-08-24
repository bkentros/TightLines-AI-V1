# River Run Rapid-Onboarding System Dry Run

**Date:** 2026-08-24
**Branch:** `develop/cross-platform-next`
**Scope:** Validate the onboarding program against the complete existing River
Run portfolio without onboarding a new river or changing runtime output
**Result:** Passed

## Portfolio result

`npm run river-run:onboarding:validate` returned:

- Status: Ready
- Rivers: 5
- Public runs: 15
- Onboarding errors: 0
- Onboarding warnings: 0
- Visible primitive order: Migration Stage, Activity, Fish In River,
  Fishability
- Live Conditions: configured once per river, separate from the four primitives

| River | Runs | Activity mode | Expected Live Conditions metrics |
| --- | ---: | --- | --- |
| Pere Marquette | 3 | Observed river | Discharge, gauge height, water temperature |
| Betsie | 3 | Weather only | No accepted live metrics; explicit unavailable Gauge Read |
| Big Manistee | 3 | Observed river | Discharge, gauge height, water temperature |
| Muskegon | 3 | Observed river | Discharge, gauge height, water temperature |
| St. Joseph | 3 | Observed river | Discharge, gauge height, water temperature |

The dry run also confirmed unique river/run IDs, matching biology profiles,
target-species coverage, enabled public audits, river foundation provenance,
source-capability coherence, Activity mode invariants, and accepted primary
hydraulic-source behavior.

## Scaffolder and fail-closed result

The workbench created an isolated test packet containing:

- River foundation.
- Live Conditions audit.
- Chinook, Coho, and Steelhead run packets.
- Final acceptance record.

It refused a second initialization at the same path, proving that existing
research is not overwritten. Packet validation returned a nonzero result for
the new incomplete template and reported 58 unresolved status markers. This is
the intended fail-closed behavior.

## Regression results

| Check | Result |
| --- | --- |
| Onboarding QA and normative-document contract | Passed |
| Deno type-check of onboarding workbench | Passed |
| Complete River Run engine suite | 301 passed, 0 failed |
| Existing portfolio fixture checks | All 15 runs current |
| River Run review-mode QA | Passed |
| River Run UI QA | Passed |
| River Run visual QA | Passed |
| Repository TypeScript check (`npx tsc --noEmit`) | Passed |
| Diff whitespace/error check | Passed |

The engine suite includes Activity block isolation, leader ties, today/tomorrow
rollover, completed-block freezing, weather-only behavior, lifecycle continuity,
Live Conditions freshness, 24-hour trends, same-date ±3-day historical context,
all river/species configuration tests, copy safety, provider normalization,
storage, and seasonal lifecycle coverage.

## Behavior-change audit

- No river configuration changed.
- No run configuration changed.
- No scoring or copy implementation changed.
- No generated review fixture changed.
- No UI component changed.
- No database migration or Edge Function deployment occurred.
- No river was added, published, or publicly enabled.
- Frozen iOS and Android release tags were not modified.

## Acceptance conclusion

The rapid-onboarding program is ready to scaffold and govern future river work.
Each new river remains blocked until its own research, source, Activity,
four-primitive copy, replay, cross-platform visual, owner-acceptance, and
separate release gates pass.
