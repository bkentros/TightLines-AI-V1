# White River River Run Acceptance

**River ID:** `white`

**Created / updated:** 2026-08-24

**Research phase:** `phase_c_research_correction_complete`

**Runtime acceptance:**
`hidden_review_generated_owner_visual_acceptance_pending`

**Deployment authorization:** `not_authorized`

**Public enablement:** `not_authorized`

## Locked owner decisions

- Approved sections:
  `Lower river — Covell Park/Business US-31 to Fruitvale
  Road`;
  `Forest corridor — Fruitvale Road to Pines Point`;
  `Upper accessible
  corridor — Pines Point to Hesperia Dam`.
- Hesperia Dam is the hard upstream endpoint for Chinook, Coho, and Steelhead;
  there is no current passage.
- Gauge Read may show USGS 04122200 flow/height at Fruitvale Road and Trout
  Unlimited/Monitor My Watershed temperature below Hesperia Dam as separately
  attributed, partial-capable measurements.
- Activity may not silently combine those mismatched reaches. All three species'
  Activity is deterministically unavailable in these packets unless a separate
  coherent-reach or explicitly conservative model is later researched, replayed,
  and accepted.
- Coho is a sparse 2/10 hidden-review candidate, not an unsupported row.
- Freshness contract: <=2 hours fresh, >2 through 24 hours delayed, >24 hours
  suppressed. Temperature date average remains unavailable until a versioned
  baseline policy is accepted.

## Gate record

| Gate                                      | Artifact / command                                   | Result                                     | Reviewer            | Date       | Blocking notes                                                                                                                  |
| ----------------------------------------- | ---------------------------------------------------- | ------------------------------------------ | ------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Clean branch and protected baseline check | repository preflight                                 | not run in this research pass              | —                   | 2026-08-24 | Must run before implementation; preserve unrelated worktree changes                                                             |
| River foundation and section approval     | `river-foundation.md`                                | passed                                     | product owner       | 2026-08-24 | Approved labels are locked                                                                                                      |
| Barrier/passage/closure audit             | `river-foundation.md`                                | passed for Phase C                         | product owner       | 2026-08-24 | Reverify Hesperia status, regulations, and posted notices before release                                                        |
| Source probe and Live Conditions audit    | `live-conditions.md`                                 | source capability approved; QA blocked     | product owner       | 2026-08-24 | Runtime, DST, partial/stale/missing, attribution, and visual fixtures remain                                                    |
| Chinook truth/copy research               | `runs/fall-chinook.md`                               | approved for hidden review                 | product owner       | 2026-08-24 | Exact dates, 7/10 ceiling, curve, and Fishability bands approved for private app review; replay/release gates remain            |
| Coho truth/copy                           | `runs/fall-coho.md`                                  | corrected sparse hidden review             | research correction | 2026-08-24 | Annual migration supports a conservative 2/10 profile; owner fixture review remains                                             |
| Steelhead truth/copy research             | `runs/fall-steelhead.md`                             | approved for hidden review                 | product owner       | 2026-08-24 | Exact fall-entry dates, 7/10 ceiling, curve, and Fishability bands approved for private app review; replay/release gates remain |
| Engine configuration validation           | `npm run qa:river-run:onboarding`; engine test suite | pass                                       | integration owner   | 2026-08-24 | Hidden White configuration validates; no public registry entry                                                                  |
| Activity unavailable contract             | all three run packets                                | research contract complete; fixture pass   | integration owner   | 2026-08-24 | No score, block, fallback, or cross-reach blend across the generated source states                                              |
| Activity historical replay                | run-specific artifact                                | not applicable to current unavailable mode | —                   | 2026-08-24 | A future scored model requires a new predeclared replay and owner gate                                                          |
| Fishability replay                        | proposed USGS 04122200 bands                         | blocked                                    | —                   | —          | Percentiles alone do not prove local presentation usability                                                                     |
| Four-primitive state fixtures             | `npm run qa:river-run:review-mode`                   | pass; 321-scenario bundle                  | integration owner   | 2026-08-24 | Corrected bundle includes all three White profiles; rendered owner review remains                                               |
| Copy/geography/contradiction QA           | onboarding audit                                     | blocked                                    | —                   | —          | Must include terminal, permanent-limit, foreign-geography, and cross-primitive tension cases                                    |
| Live Conditions partial/stale/missing QA  | test artifact                                        | blocked                                    | —                   | —          | Separate source labels and automatic recovery must be proved                                                                    |
| iOS and Android narrow-screen review      | screenshots/device review                            | blocked                                    | —                   | —          | Long station names, attribution, unavailable Activity, and sparse Coho wording need review                                      |
| Production-shaped hidden smoke            | smoke artifact                                       | blocked                                    | —                   | —          | Must remain hidden until all gates pass                                                                                         |
| Product-owner copy/visual acceptance      | signed decision                                      | blocked                                    | product owner       | —          | Research approval does not equal runtime, deployment, or enablement approval                                                    |

## Required replay and fixture artifacts

### Chinook presence

- Replay `white_chinook_presence_v1_research` across every date boundary at one
  minute before, at, and after in `America/Detroit`.
- Prove monotonic rise to 10-08, near-peak behavior through 10-15, monotonic
  decline thereafter, the 7/10 ceiling, state-preserving five-point rounding,
  matching marker/copy, and removal rather than zero on 11-16.
- Fixture every Stage state and approved-section transition; no route or copy
  may extend above Hesperia Dam.

### Steelhead fall entry

- Replay `white_steelhead_fall_entry_v1_research`, including 12-31/01-01 year
  rollover and exact boundary instants.
- Prove the 7/10 cap, modeled high window, gentle late decline, and terminal
  removal without claiming absence, inactivity, mortality, or winter handoff.
- Fixture every Stage state and section transition below Hesperia Dam.

### Activity unavailable

For both enabled candidates, generate a truth table covering fresh, delayed,
stale, missing, and partial combinations of flow, prior flow, stage,
temperature, prior temperature, and weather. Every row must yield:

- public unavailable copy;
- no score, numeric subscore, label, best block, or block ranking;
- no weather-only or cached-value fallback;
- no hidden combination of Fruitvale flow with below-Hesperia temperature;
- separately attributed Gauge Read values only when each source passes its own
  freshness contract; and
- automatic recovery to Gauge Read partial/available states without enabling
  Activity.

No Activity distribution or cap acceptance exists because no Activity score is
authorized. If a future scored model is proposed, predeclare at least five
historical years where sources allow, coverage targets, missing-data behavior,
daily/block quantiles, lifecycle-phase label distribution, extreme-flow and
temperature slices, isolated-variable tests, boundary continuity, and copy
invariants before replaying it.

### Fishability

- Replay the proposed Fruitvale discharge bands over the documented 1957-2026
  August-December daily dataset (`n=10,580`) and report seasonal/yearly label
  shares, transition frequency, missing/prior-flow counts, and representative
  days near every boundary and extreme.
- Confirm the result remains explicitly scoped to Fruitvale Road, cannot imply
  the full corridor, and makes no access, clarity, wading, boating, or safety
  claim.
- Owner must accept or revise the bands after replay. Until then Fishability is
  blocked, even though its hydraulic source is accepted.

### Coho sparse-run state

- Prove every state retains the sparse-run qualifier, 2/10 ceiling, unavailable
  Activity, below-Hesperia scope, and scoreless terminal behavior.

## Known limitations

- Flow and temperature describe different White River reaches. Gauge Read
  exposes that distinction; Activity is unavailable rather than blended.
- Fruitvale hydraulics do not represent White Lake backwater or the full Forest
  and Upper accessible corridors.
- Weaver Street temperature represents the immediate Hesperia tailwater only;
  its raw record begins in 2022, contains material gaps, and has no accepted
  historical date-average baseline.
- Hesperia Dam currently blocks all candidate species. Future dam or fish-
  passage changes require a full geography/barrier re-audit.
- Chinook exact dates and curve use limited direct White observations plus
  statewide biology and explicit calibration; no live run count exists.
- Steelhead is a fall-entry experience only. Fish may overwinter, but winter and
  spring experiences are not implemented.
- Coho is documented as annual but occasional; its 2/10 ceiling is a
  conservative seasonal calibration, not a dependable catch claim.
- Fishability quantiles characterize historical Fruitvale discharge frequency,
  not accepted fishing usability or safety.

## Release record

- Hidden configuration version: `2026-08-24-white-phase-c-draft.3`
- Copy versions: `white_chinook_copy_v1_research`;
  `white_coho_sparse_v2_research`; `white_steelhead_copy_v1_research`
- Presence versions: `white_chinook_presence_v2_research`;
  `white_coho_presence_v2_research`; `white_steelhead_fall_entry_v1_research`
- Activity version: `white_activity_unavailable_split_reach_v1_research`
- Replay artifacts: `not_generated`
- Fixture generation command/result:
  `npm run generate:river-run:onboarding-review-fixtures` — corrected shared
  private scenarios across nine supported runs.
- Test commands/results: `npm run qa:river-run:review-mode` — existing and
  onboarding review suites passed; `npx tsc --noEmit` passed.
- Explicitly deferred: runtime registry/configuration, scored Activity model,
  temperature date averages, Fishability acceptance, winter/spring Steelhead,
  deployment and public enablement
- Owner Phase A/B acceptance: 2026-08-24
- Owner Phase C numeric/research acceptance for private review:
  `granted_2026-08-24`
- Owner rendered copy/visual acceptance: `pending`
- Deployment authorization: `not_granted`
- Public enablement authorization: `not_granted`

Acceptance, deployment, and public enablement are separate decisions. Completion
of these research packets authorizes none of them.
