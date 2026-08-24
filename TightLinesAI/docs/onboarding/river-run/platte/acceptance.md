# Platte River River Run Acceptance

**River ID:** `platte`
**Created/updated:** 2026-08-24
**Foundation approval:** `approved_2026-08-24`
**Current phase:** `phase_c_packet_complete_implementation_blocked`
**Deployment:** `not_authorized`
**Public enablement:** `not_authorized`

## Gate record

| Gate | Artifact/command | Result | Reviewer | Date | Blocking notes |
| --- | --- | --- | --- | --- | --- |
| Protected baseline / active-work check | `git branch --show-current`; `git status --short` | branch pass; shared worktree active | research agent | 2026-08-24 | Correct branch `develop/cross-platform-next`; unrelated integration-owner edits were present and untouched. Do not claim a clean worktree until integration completes. |
| River foundation and exact section approval | `river-foundation.md` | pass | product owner | 2026-08-24 | Platte River Point→El Dorado→signed lower-weir closure approved. |
| Barrier/passage/closure audit | `river-foundation.md` | pass for approved corridor | product owner | 2026-08-24 | Species-qualified lower-weir boundary; annual operations/signs must be rechecked. |
| Source probes and Live Conditions source decision | `live-conditions.md` | research pass; implementation QA pending | product owner | 2026-08-24 | Honor discharge/gage height accepted for Gauge Read only; no temperature; source was in `Eqp` outage. |
| Chinook truth profile | `runs/fall-chinook.md` | pass as visible-disabled | product owner | 2026-08-24 | No dates, curve, score, Activity, or Fishability authorized. |
| Coho Phase C truth/calibration proposal | `runs/fall-coho.md` | packet complete; owner calibration/replay pending | pending | 2026-08-24 | Sole supported candidate; exact calendar, 10/10 ceiling, concentrated scope, curve, and 75/25 weather-only rules await acceptance. |
| Steelhead truth profile | `runs/fall-steelhead.md` | pass as visible-disabled | product owner | 2026-08-24 | Species present, but planned fall-entry run remains unsupported by direct seasonal evidence. |
| Lower-reach weather endpoint probes | El Dorado NPS coordinates; Open-Meteo live/archive; NWS `/points` cross-check | structural pass with limitation | research agent | 2026-08-24 | Open-Meteo returns precipitation/cloud/shortwave but clear-sky series is null; fixed replay must validate engine fallback. |
| Engine configuration validation | `npm run river-run:onboarding:validate` | not run for Phase C packet | integration owner |  | Runtime Platte config is intentionally out of this task. |
| Dedicated Coho Activity historical replay | `docs/audits/river-run-platte-coho-weather-activity-replay.json` | mechanical pass; calibration review pending | integration owner | 2026-08-24 | 1,729/1,729 dates usable; zero invariant failures. Distribution is top-heavy (820 Active, 591 Highly active, 262 Moderate, 56 Reserved, no Inactive), so exact calibration remains owner-review blocked. |
| Fishability contract | Coho §6 and owner reach decision | truth accepted; runtime QA pending | product owner | 2026-08-24 | Deterministically unavailable for lower corridor; Honor recovery must never enable it. |
| Four-primitive state fixtures | production-derived intended-state fixtures | pending |  |  | Coho only; disabled species need static-state fixtures. |
| Copy/geography/contradiction QA | run packet matrices / future audit | pending |  |  | Must enforce closure, approved labels, weather-only limitation, scoreless terminal, and disabled states. |
| Gauge Read fresh/partial/stale/missing/recovery QA | future test artifact | pending |  |  | Must prove current `Eqp` suppression and automatic recovery on a valid fresh numeric observation. |
| iOS and Android narrow-screen review | screenshots/device review | pending |  |  | Include long Honor station/reach limitation and unavailable states. |
| Production-shaped hidden smoke | smoke artifact | pending |  |  | No enablement during smoke. |
| Product-owner calibration/copy/visual acceptance | signed decision | pending | product owner |  | Foundation acceptance does not accept run calibration or visual output. |

## Accepted Phase C truth

| Combination/surface | Decision |
| --- | --- |
| Fall Coho | Sole supported implementation candidate; stays hidden/disabled until replay, fixtures, validation, copy, and owner review pass |
| Fall Chinook | Visible-disabled unsupported combination; historic occurrence is not current run proof |
| Fall Steelhead | Visible-disabled unresolved combination; species support is not Platte fall-entry timing proof |
| Coho Migration Stage | Proposed deterministic calendar and two approved lower sections; exact run calibration pending owner acceptance |
| Coho Activity | Dedicated lower-reach `weather_only`; Limited confidence; 75% effective light, 25% in-block precipitation, 0% hydraulics, 0% temperature; proposed 90 today/85 tomorrow caps; replay required |
| Coho Fish In River | Proposed Strong 100/100 ceiling, concentrated distribution, October 22 reference high, November 30 zero; replay/owner review required |
| Coho Fishability | Deterministically unavailable; no lower-reach source/bands; never borrow Honor |
| Gauge Read | Honor 04126740 discharge/gage height only, explicitly upstream; independent of all run scores |

## Mandatory Gauge Read outage/recovery acceptance

The research probe captured a real provider malfunction: USGS returned `Eqp`
after the last numeric 165 CFS / 1.43 ft observation on 2026-08-20. Acceptance
must prove all of the following without a manual configuration toggle:

1. `Eqp`, nonnumeric, missing, or older-than-24-hour values are suppressed.
2. When both accepted hydraulic metrics are unavailable, Gauge Read is
   honestly unavailable and 24-hour trends are unknown.
3. A later valid fresh numeric observation automatically restores the eligible
   current tile(s); no redeploy or operator override is required.
4. Recovery computes a 24-hour trend only when a separate accepted prior
   observation exists within tolerance. It does not compare against `Eqp`, a
   stale pre-outage value, or manufacture Stable.
5. Discharge date context may resume under the exact prior-year ±3-day
   baseline contract. Gage height still has `No average`.
6. Recovery never enables lower-corridor Fishability or changes Coho Activity,
   because Honor remains Gauge Read only.
7. Public copy continues to identify the US-31/Honor reach after recovery.

## Required Coho replay/fixture record

- [x] Fixed 2007–2025 weather archive interval; 1,729/1,729 dates usable.
- Expected/usable date and four-block coverage.
- [x] Runtime cloud-plus-shortwave fallback exercised while clear-sky is absent; no missing weather dates.
- Daily/block min, p10, median, p90, max, uniques, label distribution, leader
  frequencies, ties, spreads, and today/tomorrow cap counts.
- Lifecycle distributions and an identical-weather 10-28→12-01 continuity trace.
- Single-variable block isolation, in-block rain bounds, daily-rollup bounds,
  missing weather, rollover, DST, and block-freezing tests.
- All Stage substates, all Fish In River anchors/bands/directions, every
  reachable Activity label/confidence/leader/lifecycle state, deterministic
  unavailable Fishability, scoreless terminal, and valid cross-primitive tensions.
- Static visible-disabled Chinook/Steelhead states with no score or hidden
  unsupported navigation.
- [x] Zero replay invariant failures for incomplete blocks/copy, ceiling, rollup bounds, inferred river conditions, prohibited claims, and lifecycle continuity.
- [ ] Zero foreign-geography, provider/internal, abundance, movement, catch,
  access, and safety-copy failures.

## Version/release record

- Foundation: `platte-foundation-research-v1` — owner approved 2026-08-24.
- Live Conditions audit: `platte-live-conditions-research-v1` — source/capability approved; QA pending.
- Proposed Coho config: `platte-fall-coho-v1` — not accepted/implemented.
- Proposed presence curve: `platte-fall-coho-presence-v1` — not accepted/implemented.
- Proposed Activity rules: `platte-fall-coho-weather-activity-v1-draft` — mechanical replay passed; top-heavy label distribution and exact 90/85 caps await owner review.
- Proposed copy: `platte-fall-coho-copy-v1` — fixtures/owner review pending.
- Fixture generation command/result: pending.
- Test commands/results: packet markdown `git diff --check` only at Phase C handoff; runtime tests pending integration.
- Known limitations: no lower measured hydraulics or water temperature; Honor
  Gauge Read is upstream; Open-Meteo clear-sky arrays were null in live and
  archive probes; seasonal ceiling/curve are owner-calibrated proposals.
- Explicitly deferred: runtime/config/registry edits, replay implementation,
  generated fixtures, UI/device review, hidden smoke, deployment, publication.
- Owner run/copy/visual acceptance date: pending.
- Deployment authorization: none.
- Public enablement authorization: none.

Acceptance, deployment, and public enablement remain three separate decisions.
