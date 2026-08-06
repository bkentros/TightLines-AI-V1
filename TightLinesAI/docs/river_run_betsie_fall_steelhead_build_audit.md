# Betsie Fall Steelhead — Owner Build Audit

**Status:** implemented, owner-gated, not publicly released\
**Configuration version:** `2026-08-06-betsie-weather-activity.3`\
**Copy version:** `river-run-copy-v26`\
**Review catalog:** 34 production-derived scenarios

## Accepted model

Betsie Fall Steelhead is implemented as a **7/10 historical opportunity**, a
70/100 Fish In River ceiling, and **Broad** distribution. In canonical public
copy, 7/10 resolves to the Moderate tier; it is the top of that tier,
immediately below the Strong tier used for ceilings of 8–10.

Every calendar boundary and every presence anchor is exactly five days ahead of
the accepted Pere Marquette Fall Steelhead profile. The curve shape is otherwise
unchanged. The final fall-entry score is 61/100, and the December 18 handoff
retains that 61/100 into winter holding. This is approximately the requested
6/10 endpoint.

## Calendar

| State                  |  Betsie date |      PM date |
| ---------------------- | -----------: | -----------: |
| Early monitoring       |    August 10 |    August 15 |
| Staging context        |    August 27 |  September 1 |
| River presence begins  | September 15 | September 20 |
| Beginning ends         |    October 5 |   October 10 |
| Established build      |   October 10 |   October 15 |
| Broad build            |   October 27 |   November 1 |
| Peak begins/reference  |  November 10 |  November 15 |
| Peak ends              |  November 29 |   December 4 |
| Taper ends             |  December 14 |  December 19 |
| Fall entry ends        |  December 17 |  December 22 |
| Winter holding handoff |  December 18 |  December 23 |

## Presence anchors

The production curve displays 0, 7, 14, 25, 32, 53, 70, 70, 69, 63, and 61 at
its audited fall-entry anchors. The winter handoff remains 61/100 because
`70 × 0.875 = 61.25`, rounded for display.

The 61/100 value means retained seasonal presence. It is not a live winter
activity, feeding, or fishability score.

## River and biology basis

- Michigan DNR lists the Betsie River and Betsie Lake as Better Fishing Waters
  for Steelhead.
- DNR identifies Homestead as a popular Steelhead access and documents its
  barrier and access-site context.
- DNR Betsie Survey 2004-3 describes the stocked and naturalized Steelhead
  fishery.
- DNR describes many fall-entering Great Lakes Steelhead as overwintering before
  spawning in spring. The model therefore hands presence into winter rather than
  treating migration completion as fish leaving the river.

The 7/10 ceiling and exact five-day lead remain accepted owner calibration, not
a claim derived from paired adult counts.

## Betsie-specific copy

- Copy uses only the migratory corridor below Homestead and never borrows
  PM-scale lower/middle/upper geography.
- Early reads begin near Frankfort harbor, Betsie Lake, and the river mouth.
- Peak and late reads cover substantial legal holding water below Homestead,
  always outside the signed closure.
- No state recommends or implies migratory fishing above Homestead.
- Fall-ending copy explicitly says the migration phase is ending, not the
  in-river Steelhead fishery.
- Winter copy does not direct anglers to a nonexistent live Betsie winter read.
- No state recommends Migration Timing, Push, or Fishability.

## Data limitations and regulations

Migration Timing, Push, and Fishability remain unavailable. No accepted live
flow gauge or measured-water-temperature source represents the below-Homestead
corridor, and air temperature is not substituted.

## Weather-only Activity

Betsie Steelhead Activity assigns 70% to effective light and 30% to in-block
precipitation context. Scores can reach 95 for those evaluated weather
variables and 90 for tomorrow. Every headline says `weather-only` and `Limited
confidence`; the detail identifies river level, clarity, and measured water
temperature as unknown.

Steelhead receive no conditional floor, lifecycle deduction, late-fall ceiling,
ending constraint, or mortality copy. Identical weather must produce the same
score at Peak, Late fall, Holding transition, the fall-entry endpoint, and the
winter-holding handoff. Seasonal copy can explain the transition toward winter
holding, but the calendar cannot lower Activity.

The 2007–2025 replay contains all 2,166 expected dates. Daily scores range
62–95 with an 82 median and 34 distinct values; four-hour blocks range 44–95
with 52 distinct values. The high distribution is expected for a model limited
to the darker and cloudier weather variables common during the Steelhead
calendar; it does not claim favorable water temperature or river condition.
The identical-weather stage audit returns `84, 84, 84, 84` at Peak, Late fall,
Holding transition, and Winter holding. All audit invariants are zero, including
weather-only disclosure, the 95-point bound, prohibited river inference,
mortality-language exclusion, and stage invariance.

The current regulation reminder preserves the seasonal Homestead closures: 300
feet from August 1 through November 15 and 100 feet from November 16 through
July 31. Anglers are directed to current regulations and signed boundaries.

## Fishing-technique dropdown

The shared Steelhead guide now includes **Stripping flies**, so the method is
present for every current and future Steelhead river using the species guide. It
remains alongside float/centerpin presentations, indicator nymphing, swinging
flies, hardware/plugs, and bottom drifting, with the existing reach-specific
regulation and anti-snagging warning.

## Mechanical acceptance

- 34 production-derived Betsie Steelhead scenarios cover ten Migration Stage
  states, weather-only Activity, all three unavailable hydraulic primitives,
  and twelve exact presence/handoff reads.
- Engine tests prove every calendar and handoff boundary is exactly five days
  ahead of PM.
- Endpoint proof verifies Activity reads weather without calling gauge or
  measured-temperature providers.
- Copy checks reject salmon leakage, PM-scale geography, spawning-salmon advice,
  unavailable-primitive recommendations, and a nonexistent winter-read link.
- UI QA requires stripping flies in the shared Steelhead dropdown.

Run the deterministic acceptance check:

```bash
npm run qa:river-run:betsie-steelhead-acceptance
```

For device review:

```bash
npm run dev:river-run
```

Select Michigan → Fall → Steelhead → Betsie River. Review September 15, October
10, October 27, November 10, November 30, December 15, December 17, and
December 18.
