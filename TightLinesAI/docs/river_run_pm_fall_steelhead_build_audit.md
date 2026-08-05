# Pere Marquette Fall Steelhead — Build Audit

**Status:** implementation complete; public audit gate disabled\
**Engine version:** `river-run-v1.5.3`\
**Configuration version:** `2026-08-05.6`\
**Copy version:** `river-run-copy-v20`\
**Movement branch:** `fall_entry_cooling` / `fall-entry-cooling-v1`

## Product decision

Fall steelhead is implemented as a separate fall-entry branch, not as a
fall-spawning salmon curve. It reuses the PM river sources, hydraulic response,
precipitation role, Fishability bands, and deterministic primitive framework. It
supplies steelhead-specific biology, temperature behavior, dates, presence,
timing weights, copy, and a winter-holding handoff.

The fall experience ends on December 22. December 23 does not score winter
activity with the migration primitives. Migration Timing and Push become
complete, Fish In River keeps the required 70/100 retained-presence reference
visible while explicitly distinguishing it from winter activity, and Guide's
Read directs the product to the separate winter fishery model planned for later
work.

## Configured PM calendar and presence

| Boundary                        |  Date / value |
| ------------------------------- | ------------: |
| Early watch                     |     August 15 |
| Cumulative condition monitoring |   September 1 |
| Earliest seasonal entry         |  September 20 |
| Beginning ends                  |    October 10 |
| Established building            |    October 15 |
| Broadly established building    |    November 1 |
| Peak stage begins               |   November 15 |
| Presence reaches 80 / 100       |   November 15 |
| Peak stage ends                 |    December 4 |
| Late-fall stage                 | December 5–19 |
| Holding transition begins       |   December 20 |
| Holding transition ends         |   December 22 |
| Winter holding handoff          |   December 23 |
| PM opportunity ceiling          |      80 / 100 |
| December 22 retained presence   |      70 / 100 |

The revised curve acknowledges legitimate late-September fish without delaying
the established PM fall fishery: September 20 begins at 8/100, October 1 reaches
16/100, October 10 reaches 28/100, October 15 reaches 36/100, November 1 reaches
60/100, and November 15 reaches 80/100. The curve holds at 80 through December
4, begins tapering December 5, and retains 70/100 on December 22.

Established-building location guidance begins October 15. It recognizes that
steelhead can already occupy lower, middle, and upper river sections wherever
passage is open, while directing an angler toward lower- and middle-river
holding water first because dependable concentrations may still be greater
there. A second broadly established state begins November 1 and elevates middle-
and upper-river holding water to the primary starting plan while retaining lower
travel lanes for a supportive Push.

If November Migration Timing remains Delayed, Guide's Read overrides the normal
broad-distribution starting plan: it keeps middle and upper water legitimate but
directs the angler to begin lower or in the middle river and expand upstream
only after direct fish activity supports it.

## Shared steelhead biology

- Iteroparous (`semelparous: false`) and represented as pre-spawn overwintering
  entry.
- 46–52°F: core fall-entry band.
- 40–45°F: cold but movement-capable; additional cooling increasingly favors
  holding.
- Approximately 39°F and colder: active upstream movement is capped at No clear
  push while in-river presence remains intact.
- 53–60°F: warm transitional water.
- Above 60°F: too warm for strong movement confidence.
- 70°F: migration barrier threshold.
- Rising flow remains supportive only inside usable hydraulic bounds.
- Rain remains a precursor and cannot create Strong without a measured river
  response.

## Reused PM configuration

- USGS Scottville primary flow source and PM hydraulic thresholds.
- PMTU measured-water source priority and fallback rules.
- Baldwin-area modeled precipitation context.
- Audited Scottville Fishability bands and conservative caps.
- Canonical PM flow baseline coverage.

Run Timing is intentionally different: steelhead uses 40% gauge response and 60%
measured-water pattern because PM telemetry identifies temperature as the
dominant movement correlate.

## Mechanical evidence

### Run Timing baseline, 2021–2025

- Five of five cumulative checkpoints generated.
- Five distinct usable years at every checkpoint.
- 100% checkpoint coverage.
- Historical candidate replay: 5 Ahead, 15 Typical, 5 Delayed; tempered final
  labels: 4 Ahead, 16 Typical, 5 Delayed.
- Zero candidate-agreement violations.

### Push replay, 2021–2025

- 419 usable dates; 376 required.
- Temperature states exercised: 122 supportive, 125 cold-active, 63
  cold-holding, 96 transitional-warm, and 13 too-warm.
- Labels: 88 Weak, 277 No clear push, 43 Possible, 10 Strong, and 1 Very strong.
- Zero strong-without-gauge-response, rain-double-count, warm-barrier,
  flood-cap, copy, or overclaim violations.

### Fishability replay, 2016–2025

- 921 usable dates; 846 required.
- Zero very-low, blown-out, sharp-rise/high-flow, incomplete-copy, or
  unsupported-copy violations.

### Integrated replay, 2021–2025

- 570 of 570 expected daily snapshots.
- Five timing baselines loaded.
- Five December 23 winter-holding handoffs exercised.
- Zero incomplete copy, prohibited copy, unexplained conflicts, pre-season Push
  leaks, post-season Push leaks, or residual-presence contradictions.

### Generated acceptance surface

- 103 production-derived Steelhead review scenarios.
- Every stage, timing, Push, Fishability, and presence state covered.
- Dedicated cold-active and cold-holding Push scenarios.
- 80-point river ceiling and visible 70-point handoff meter behavior verified.
- Fish In River uses five true 20-point color intervals with labels on the six
  interval boundaries, so marker position remains numerically accurate for every
  species and configured strength.
- No Chinook/Coho/spawning-gravel leakage and no public use of the word “run.”

## Image asset

`assets/images/fish/steelhead.png` is a new transparent, left-facing Great Lakes
steelhead asset in bright fall-entry condition. It uses the existing Chinook and
Coho assets as style and scale references. The fish is chrome-silver with an
olive-blue back, restrained pink lateral band, and steelhead spotting across the
back and tail.

## Public release approval

The owner completed device review and explicitly approved the accepted Fall
Steelhead configuration for public visibility. `publicAudit` is enabled under
`pm-fall-steelhead-acceptance-v1`.

Deployment and the authenticated production smoke path remain operational
steps. A separate future winter-holding engine with activity- and
feeding-oriented primitives remains future work; the completed fall branch
deliberately does not fabricate those winter scores.
