# Platte River River Run Acceptance

**River ID:** `platte` **Created/updated:** 2026-08-24 **Foundation approval:**
`approved_2026-08-24` **Current phase:**
`hidden_review_implemented_visual_acceptance_pending` **Deployment:**
`not_authorized` **Public enablement:** `not_authorized`

## Gate record

| Gate                                               | Artifact/command                                                              | Result                                      | Reviewer            | Date       | Blocking notes                                                                                                                                                                                           |
| -------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------- | ------------------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Protected baseline / active-work check             | `git branch --show-current`; `git status --short`                             | branch pass; shared worktree active         | research agent      | 2026-08-24 | Correct branch `develop/cross-platform-next`; unrelated integration-owner edits were present and untouched. Do not claim a clean worktree until integration completes.                                   |
| River foundation and exact section approval        | `river-foundation.md`                                                         | pass                                        | product owner       | 2026-08-24 | Platte River Point→El Dorado→signed lower-weir closure approved.                                                                                                                                         |
| Barrier/passage/closure audit                      | `river-foundation.md`                                                         | pass for approved corridor                  | product owner       | 2026-08-24 | Species-qualified lower-weir boundary; annual operations/signs must be rechecked.                                                                                                                        |
| Source probes and Live Conditions source decision  | `live-conditions.md`                                                          | research pass; implementation QA pending    | product owner       | 2026-08-24 | Honor discharge/gage height accepted for Gauge Read only; no temperature; source was in `Eqp` outage.                                                                                                    |
| Chinook truth profile                              | `runs/fall-chinook.md`                                                        | corrected hidden review                     | research correction | 2026-08-24 | Direct DNR lower-weir records invalidate the prior unsupported verdict; corrected fixtures/owner review pending.                                                                                         |
| Coho Phase C truth/calibration                     | `runs/fall-coho.md`                                                           | approved for hidden review                  | product owner       | 2026-08-24 | Exact calendar, 10/10 ceiling, concentrated scope, curve, and 75/25 weather-only rules approved for private app review.                                                                                  |
| Steelhead truth profile                            | `runs/fall-steelhead.md`                                                      | corrected hidden review                     | research correction | 2026-08-24 | Direct DNR fall lower-weir timing invalidates the prior unresolved verdict; corrected fixtures/owner review pending.                                                                                     |
| Lower-reach weather endpoint probes                | El Dorado NPS coordinates; Open-Meteo live/archive; NWS `/points` cross-check | structural pass with limitation             | research agent      | 2026-08-24 | Open-Meteo returns precipitation/cloud/shortwave but clear-sky series is null; fixed replay must validate engine fallback.                                                                               |
| Engine configuration validation                    | `npm run qa:river-run:onboarding`; engine test suite                          | pass                                        | integration owner   | 2026-08-24 | Hidden Platte config validates; no public registry entry.                                                                                                                                                |
| Dedicated Coho Activity historical replay          | `docs/audits/river-run-platte-coho-weather-activity-replay.json`              | superseded baseline; fresh replay required | integration owner   | 2026-08-24 | The 1,729-day mechanical artifact used the former October-centered lifecycle. Preserve it for before/after comparison, then rerun the corrected September calendar with stage-by-block v1.1 reporting. |
| Fishability contract                               | Coho §6 and owner reach decision                                              | truth accepted; runtime QA pending          | product owner       | 2026-08-24 | Deterministically unavailable for lower corridor; Honor recovery must never enable it.                                                                                                                   |
| Four-primitive state fixtures                      | `npm run qa:river-run:review-mode`                                            | pass; 321-scenario bundle                   | integration owner   | 2026-08-24 | Corrected Chinook, Coho, and Steelhead profiles are included; rendered owner review remains.                                                                                                             |
| Copy/geography/contradiction QA                    | run packet matrices / future audit                                            | pending                                     |                     |            | Must enforce closure, approved labels, weather-only limitation, scoreless terminal, and disabled states.                                                                                                 |
| Gauge Read fresh/partial/stale/missing/recovery QA | future test artifact                                                          | pending                                     |                     |            | Must prove current `Eqp` suppression and automatic recovery on a valid fresh numeric observation.                                                                                                        |
| iOS and Android narrow-screen review               | screenshots/device review                                                     | pending                                     |                     |            | Include long Honor station/reach limitation and unavailable states.                                                                                                                                      |
| Production-shaped hidden smoke                     | smoke artifact                                                                | pending                                     |                     |            | No enablement during smoke.                                                                                                                                                                              |
| Product-owner calibration/copy/visual acceptance   | signed decision                                                               | pending                                     | product owner       |            | Foundation acceptance does not accept run calibration or visual output.                                                                                                                                  |

## Accepted Phase C truth

| Combination/surface  | Decision                                                                                                                                                                                      |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fall Coho            | Supported hidden-review candidate; principal Platte salmon run                                                                                                                                |
| Fall Chinook         | Supported hidden-review candidate; conservative secondary-run ceiling and concentrated scope                                                                                                  |
| Fall Steelhead       | Supported hidden-review candidate; direct fall timing with a non-salmon holding tail                                                                                                          |
| Coho Migration Stage | Deterministic calendar and two approved lower sections accepted for hidden review                                                                                                             |
| Coho Activity        | Dedicated lower-reach `weather_only`; Limited confidence; 75% effective light, 25% in-block precipitation, 0% hydraulics, 0% temperature; proposed 90 today/85 tomorrow caps; replay required |
| Coho Fish In River   | Strong 100/100 ceiling, concentrated distribution, corrected September 20 reference high, November completion tail; fresh replay/owner review required                                        |
| Coho Fishability     | Deterministically unavailable; no lower-reach source/bands; never borrow Honor                                                                                                                |
| Gauge Read           | Honor 04126740 discharge/gage height only, explicitly upstream; independent of all run scores                                                                                                 |

## Mandatory Gauge Read outage/recovery acceptance

The research probe captured a real provider malfunction: USGS returned `Eqp`
after the last numeric 165 CFS / 1.43 ft observation on 2026-08-20. Acceptance
must prove all of the following without a manual configuration toggle:

1. `Eqp`, nonnumeric, missing, or older-than-24-hour values are suppressed.
2. When both accepted hydraulic metrics are unavailable, Gauge Read is honestly
   unavailable and 24-hour trends are unknown.
3. A later valid fresh numeric observation automatically restores the eligible
   current tile(s); no redeploy or operator override is required.
4. Recovery computes a 24-hour trend only when a separate accepted prior
   observation exists within tolerance. It does not compare against `Eqp`, a
   stale pre-outage value, or manufacture Stable.
5. Discharge date context may resume under the exact prior-year ±3-day baseline
   contract. Gage height still has `No average`.
6. Recovery never enables lower-corridor Fishability or changes Coho Activity,
   because Honor remains Gauge Read only.
7. Public copy continues to identify the US-31/Honor reach after recovery.

## Required Coho replay/fixture record

- [x] Fixed 2007–2025 weather archive interval; 1,729/1,729 dates usable.
- Expected/usable date and four-block coverage.
- [x] Runtime cloud-plus-shortwave fallback exercised while clear-sky is absent;
      no missing weather dates.
- Daily/block min, p10, median, p90, max, uniques, label distribution, leader
  frequencies, ties, spreads, and today/tomorrow cap counts.
- Lifecycle distributions and an identical-weather 09-30→12-01 continuity trace.
- Single-variable block isolation, in-block rain bounds, daily-rollup bounds,
  missing weather, rollover, DST, and block-freezing tests.
- All Stage substates, all Fish In River anchors/bands/directions, every
  reachable Activity label/confidence/leader/lifecycle state, deterministic
  unavailable Fishability, scoreless terminal, and valid cross-primitive
  tensions.
- Corrected Chinook/Steelhead seasonal states, curves, unavailable Activity and
  Fishability, and scoreless terminal behavior.
- [x] Zero replay invariant failures for incomplete blocks/copy, ceiling, rollup
      bounds, inferred river conditions, prohibited claims, and lifecycle
      continuity.
- [ ] Zero foreign-geography, provider/internal, abundance, movement, catch,
      access, and safety-copy failures.

## Version/release record

- Foundation: `platte-foundation-research-v1` — owner approved 2026-08-24.
- Live Conditions audit: `platte-live-conditions-research-v1` —
  source/capability approved; QA pending.
- Hidden Coho config: `platte-fall-coho-v1` — implemented and owner-approved for
  private review; not public.
- Hidden presence curve: `platte-fall-coho-presence-v1` — implemented and
  owner-approved for private review.
- Proposed Activity rules: `platte-fall-coho-weather-activity-v1-draft` —
  mechanical replay passed; top-heavy label distribution and exact 90/85 caps
  await owner review.
- Proposed copy: `platte-fall-coho-copy-v1` — fixtures/owner review pending.
- Fixture generation command/result: pending.
- Test commands/results: packet markdown `git diff --check` only at Phase C
  handoff; runtime tests pending integration.
- Known limitations: no lower measured hydraulics or water temperature; Honor
  Gauge Read is upstream; Open-Meteo clear-sky arrays were null in live and
  archive probes; seasonal ceiling/curve are owner-calibrated proposals.
- Explicitly deferred: runtime/config/registry edits, replay implementation,
  generated fixtures, UI/device review, hidden smoke, deployment, publication.
- Owner run/copy/visual acceptance date: pending.
- Deployment authorization: none.
- Public enablement authorization: none.

Acceptance, deployment, and public enablement remain three separate decisions.
