# Pere Marquette Fall Coho Acceptance Audit

**Audit date:** 2026-08-03\
**Configuration version:** `2026-08-03.2`\
**Run:** `pere_marquette_fall_coho`\
**Acceptance status:** Local mechanical acceptance passed; public gate remains
disabled.

## Accepted configuration

- Historical Presence ceiling: 6/10 (60 internal points).
- Opportunity copy tier: Moderate.
- Distribution scope: Broad.
- River window: September 1 through November 30.
- Historical-presence tail: through December 31.
- Shared engine: `fall_cooling` / `fall-cooling-v2`.
- Shared PM river behavior: Scottville hydraulics, Fishability bands, rain
  thresholds and caps, measured-water source priority.
- Coho-specific behavior: biology profile, 50–62F supportive migration band, run
  dates, presence curve, and Run Timing baseline.

## Acceptance results

| Area                         |                                             Coverage | Result                                                     |
| ---------------------------- | ---------------------------------------------------: | ---------------------------------------------------------- |
| Push replay                  |                          446 usable dates, 2021–2025 | Pass; 0 invariant violations                               |
| Fishability replay           |                             910/910 dates, 2016–2025 | Pass; 0 band, cap, or copy violations                      |
| Integrated replay            |                         645/645 snapshots, 2021–2025 | Pass; 0 boundary, copy, or unexplained-conflict violations |
| Run Timing baseline          |                 5/5 checkpoints, 5 usable years each | Pass                                                       |
| Scottville seasonal baseline |   129/129 required days; 365 generated calendar days | Pass                                                       |
| Coho review fixtures         |                     104 production-derived scenarios | Pass                                                       |
| Chinook regression fixtures  |                     104 production-derived scenarios | Pass                                                       |
| Primitive visuals            |                   Every normal and unavailable state | Pass                                                       |
| Engine/API suite             |                                            187 tests | Pass after final lifecycle fixes                           |
| Type and format checks       | Full project typecheck and changed-file format check | Pass                                                       |

### Push distribution

- Weak: 16
- No clear push: 362
- Possible: 55
- Strong: 12
- Very strong: 1

No Strong result lacked measured gauge response. Rain was never double-counted
after a meaningful rise. Severe-high-flow and warm-water caps held. Every result
contained complete bounded copy.

### Integrated findings

- No active Push before September 1 or after November 30.
- No post-run copy described the run as underway.
- Every residual post-run presence state received its required explanation.
- Every mixed read requiring an interpretation note contained the correct reason
  code.
- No copy guaranteed movement, implied a live fish count, exposed configuration
  language, or presented Fishability as safety.

## Findings corrected during acceptance

1. Replay scripts were hardwired to the Chinook run. They now require/select an
   explicit PM run and derive fetch/replay windows from that run.
2. The synthetic `Ahead` review fixture assumed Chinook's longer first timing
   window and evaluated as `Typical` for Coho. Evidence ramps now scale across
   the configured checkpoint window. Both Chinook and Coho fixture suites pass.
3. Development review initially had only Chinook fixtures. It now selects a
   dedicated Coho fixture catalog, preventing Coho artwork from appearing over
   Chinook copy.
4. Shared Fishability and seasonal-baseline provenance still named Fall Chinook.
   Coho now records river-level reuse and its separate replay evidence without
   changing the accepted hydraulic thresholds.
5. True offseason dates were presented as `Post-run`, and Run Timing implied it
   was still `Evaluating` before its configured observation window. Chinook and
   Coho now share explicit `Offseason`, `Not monitoring yet`, pre-run,
   in-season, and short post-run lifecycle states.
6. Completed Run Timing retained a live-looking final-result color. Its card is
   now neutral and marked complete while preserving `FINAL READ` inside the
   card for context; completed and offseason Push are neutral as well.

## Final Coho product sign-off

The final copy, calendar, opportunity tier, presence curve, monitoring window,
Push window, and primitive lifecycle are accepted for the hidden PM Coho build.
No additional Coho configuration change is supported by the current evidence.
The December presence is deliberately a sparse historical tail, not an
extension of the dependable September-through-November run or Push window.

Evidence confidence is not uniform. Michigan DNR and the PM survey directly
support a later, lower-abundance PM Coho run centered in the August-November
period. The exact 6/10 ceiling, October 20 reference peak, 50-62F fully
supportive band, and sparse December curve are conservative accepted product
calibrations—not PM telemetry or a direct annual abundance estimate. They should
be compared with hidden live-season observations before public enablement.

## Remaining release gates

These are not engine/configuration failures and were not bypassed:

- Observe the hidden run against deployed production providers and run the
  authenticated production smoke path.
- Complete release-device small-screen and accessibility review.
- Obtain explicit owner approval, then enable `publicAudit` in a separate
  intentional change.

No migration was applied, no deployment occurred, and the Coho public audit gate
remains disabled.
