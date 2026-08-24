# Grand River River Run Acceptance

**River ID:** `grand`
**Created/updated:** 2026-08-24
**Packet status:** `hidden_review_implemented_release_blocked`
**Deployment:** `not_authorized`
**Public enablement:** `not_authorized`

The product owner approved the three public sections, species endpoints, and
the current calendar/presence/Fishability research numbers for private app
review on 2026-08-24. Hidden runtime configuration and generated review
fixtures are implemented. Unresolved passage, replay evidence, rendered visual
acceptance, deployment, and public enablement remain separate gates.

## Gate record

| Gate | Artifact/command | Result | Reviewer | Date | Blocking notes |
| --- | --- | --- | --- | --- | --- |
| Protected baseline/worktree check | `git status --short`; Phase C changed only the three Grand run packets and this file | pending final integration audit | agent | 2026-08-24 | Shared onboarding worktree contains other untracked packet work; no runtime files were changed by this Phase C pass. |
| River foundation and section approval | `river-foundation.md` | approved_with_fail_closed_limits | product owner | 2026-08-24 | Lower: mouth–Sixth; Middle: Sixth–Webber; Upper: Webber–below Moores. |
| Barrier/passage/closure audit | `river-foundation.md` | blocked | agent | 2026-08-24 | Ada/Wagar current status and Portland/Grand Ledge operation unresolved; Sixth/current route qualified; North Lansing inefficient. No section can be recommended across an unresolved link. |
| Source probe and Live Conditions audit | `live-conditions.md` | source_capability_approved_QA_pending | product owner | 2026-08-24 | USGS 04119000 hydraulics and 04118564 temperature accepted by reach; freshness/copy implementation and QA remain pending. |
| Chinook truth profile | `runs/fall-chinook.md` | approved_for_hidden_review | product owner | 2026-08-24 | Webber endpoint, dates, 6/10 ceiling, curve, and Fulton Fishability candidate approved for private review; replay/release gates remain. |
| Coho truth profile | `runs/fall-coho.md` | approved_for_hidden_review | product owner | 2026-08-24 | Below-Moores endpoint and numeric candidate approved for private review; Upper still requires a current complete route. |
| Steelhead truth profile | `runs/fall-steelhead.md` | approved_for_hidden_review | product owner | 2026-08-24 | Fall-entry candidate approved for private review; full passage route and release evidence remain. |
| Engine configuration validation | `npm run qa:river-run:onboarding`; engine test suite | pass | integration owner | 2026-08-24 | Hidden drafts validate; 314 engine tests passed. No public registry entry. |
| Activity source capability | foundation E-018 and all run packets | blocked | agent | 2026-08-24 | Production-shaped Open-Meteo probe returned all-null clear-sky radiation; observed-river Activity cannot run as specified. |
| Activity historical replay | run-specific artifact | not_run |  |  | Requires provider resolution, fixed ≥5-year interval, coverage/distributions/subsets, controlled tests, and owner review. |
| Fishability calibration/replay | run-specific artifact | not_run |  |  | Percentile-derived bands are scaffolding only; local presentation review and construction-aware replay required. |
| Four-primitive state fixtures | `npm run qa:river-run:review-mode` | pass for private review | integration owner | 2026-08-24 | Shared onboarding bundle contains 223 generated scenarios across six supported runs; rendered owner review remains. |
| Copy/geography/capability QA | onboarding audit | packet review only | agent | 2026-08-24 | Draft intents are novice-readable and reach-limited; production rendering and automated denylist/length/determination gates remain. |
| Live Conditions partial/missing/recovery QA | generated review fixtures and provider normalization tests | pass for private review | integration owner | 2026-08-24 | Generated Gauge Read scenarios cover available, partial/missing, and recovered numeric states; rendered device review remains. |
| Today/Tomorrow/timezone QA | Activity fixtures/tests | not_run |  |  | America/Detroit DST, 9 PM rollover, midnight/4 AM refresh, and completed-block freezing required. |
| iOS/Android narrow-screen review | screenshots/device review | not_run |  |  | Required after implementation. |
| Production-shaped hidden smoke | smoke artifact | not_run |  |  | Required after runtime implementation; does not authorize release. |
| Product-owner numeric/copy/visual acceptance | signed decision | pending |  |  | Owner has approved geography/endpoints only. |

## Locked truth decisions

| Subject | Decision | Release consequence |
| --- | --- | --- |
| Chinook endpoint | Webber Dam | Never show Chinook in Upper accessible corridor. Middle is conditional on a current Sixth/Ada/Wagar route. |
| Coho endpoint | Below Moores Park Dam | Upper may appear only after every intermediate Coho passage link is current. |
| Steelhead endpoint | Below Moores Park Dam | Same complete-route rule; North Lansing passage remains qualified. |
| Steelhead lifecycle | Fall entry ends without death/departure | No salmon mortality cap; no spring handoff until such an experience exists. |
| Gauge Read | Separate, unscored USGS measurements | Cannot determine any of the four primitives, access, clarity, or safety. |
| Activity | Conditional responsiveness if fish are present | Weather clear-sky failure blocks all three run configurations. |
| Fishability | Fulton Street presentation only | Middle/Upper deterministic unavailable until a local accepted source exists. |

## Phase C proposal inventory

| Run | Calendar/curve | Presence ceiling | Activity proposal | Fishability proposal | Acceptance state |
| --- | --- | ---: | --- | --- | --- |
| Chinook | 08-20 start; 09-20 anchor; complete after 11-15 | 6/10 | unavailable until a coherent accepted input contract exists | 1,200/1,600/3,800/6,400 CFS candidate | owner-approved for hidden review; replay pending |
| Coho | 09-01 start; 09-22 anchor; complete after 12-15 | 8/10 | unavailable until a coherent accepted input contract exists | 1,300/1,700/4,200/7,200 CFS candidate | owner-approved for hidden review; replay pending |
| Steelhead | 10-01 fall-entry start; 11-15 anchor; fall profile complete after 01-15 | 5/10 | unavailable until a coherent accepted input contract exists | 1,400/1,900/4,800/8,000 CFS candidate | owner-approved for hidden review; replay pending |

Fishability values above mean too-low maximum / low-fishable boundary / high
edge of proposed ideal / blown-out minimum. They are not safety or flood
thresholds and must not enter runtime before review.

## Required replay and acceptance evidence

For each run, record before acceptance:

- Fixed interval (minimum five reliable years), expected dates, usable complete
  dates, coverage percentage, and missing flow/prior-flow/temperature/lookback/
  weather counts.
- Daily and four-block min/p10/median/p90/max, unique scores, labels overall
  and by phase, best-block frequency, block spread, and 90+ count.
- Warm, cold, preferred-temperature, low/high/extreme-flow, missing-input,
  tapering, ending, residual/holding distributions.
- Isolated light and in-block rain tests, no cross-block leakage, monotonic
  temperature shoulders, hard-cap enforcement, missing-data confidence, daily
  rollup bounds, and leader/tie language.
- Smooth lifecycle boundaries; Chinook/Coho terminal mortality distinct from
  Steelhead persistence; completed states expose no active seasonal score.
- Every public headline, one-to-three Why points, Guide's Read, Where to Start,
  permanent scope note, target date, confidence, and source reach.
- Intended versus rendered fixture labels, foreign-geography/species/internal
  token denylist, unavailable-capability checks, valid contradiction fixtures,
  safety/access checks, and narrow-screen review.

## Known blockers and deferred work

1. Obtain current authoritative status/passage evidence for Ada and Wagar and
   current operating/species passage at Sixth, Portland, Grand Ledge, and
   North Lansing. Until then, the section graph fails closed at each unresolved
   link.
2. Resolve the missing Open-Meteo clear-sky-radiation capability or explicitly
   redesign and separately accept the Activity input contract.
3. Preserve the 2026-08-24 owner approval of the current hidden-review numbers;
   revise only when replay or rendered review identifies a concrete problem.
4. Keep Activity unavailable and public enablement off until their separate
   evidence gates pass.
5. Re-audit USGS 04119000 rating/datum/source meaning after material 2026/2027
   downtown dam-removal work.
6. Reverify the current Michigan regulations, Grand Haven November gear rule,
   construction closures, and ladder restrictions immediately before release.
7. Resolve a documentation mismatch in `live-conditions.md`: its footer says
   owner-approved while the public-copy section heading still says proposed/
   owner acceptance required. This Phase C pass did not edit that file.

## Required release record

- Configuration versions: proposed in each run packet; not implemented.
- Copy versions: proposed in each run packet; not implemented.
- Replay artifacts: pending for all three runs.
- Fixture generation command/result: not run.
- Test commands/results: packet whitespace/link review only; runtime tests not run.
- Known limitations: passage chain, reach-limited sources, weather capability,
  construction-sensitive hydraulics, historic one-year Webber counts.
- Explicitly deferred work: runtime/config, replay, fixtures, automated tests,
  device QA, hidden smoke, deployment, public enablement.
- Owner acceptance date: geography/endpoints only, 2026-08-24; numeric/copy
  acceptance pending.
- Deployment authorization: not authorized.
- Public enablement authorization: not authorized.

**Acceptance decision:** `approved_for_hidden_review_blocked_pending_passage_replay_visual_and_release_QA`
