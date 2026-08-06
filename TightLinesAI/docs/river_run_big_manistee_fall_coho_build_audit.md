# Big Manistee Fall Coho — Owner Build Audit

**Run:** `big_manistee_fall_coho`
**Configuration:** `2026-08-06-big-manistee-steelhead-activity.1`
**Status:** Enabled for owner audit

## Accepted research position

Big Manistee Coho is modeled as a moderate **5/10** historical opportunity
with sectional—not uniformly broad—distribution. Sparse river presence begins
September 10, builds through October, reaches its 50/100 reference maximum on
October 20, tapers through November, and reaches zero December 10. Fish In
River interpolates between every anchor each calendar day; copy changes only
at meaningful behavioral and location subphases.

Michigan DNR identifies a notable late-October Manistee Coho fishery while its
below-Tippy status report describes the Coho run as much weaker than Chinook.
The same report documents historic High Bridge stocking, limited mainstem
natural reproduction because much of the lower river is too warm for parr,
and meaningful tributary reproduction in Bear and Pine creeks. Those findings
support a real but moderate and sectional opportunity rather than PM-scale or
Chinook-scale abundance.

## Primitive implementation

| Primitive | Implementation |
|---|---|
| Migration Stage | Fifteen river-specific owner-review states from pre-staging through late tail |
| Fish In River | 5/10 ceiling with eleven anchors and daily interpolation |
| Migration Timing | Five cumulative Coho checkpoints built from 2007–2025 Wellston history |
| Push | Shared regulated-tailwater hydraulic response plus Coho-specific 50–62F supportive band |
| Fishability | Shared Wellston CFS bands, explicitly limited to the Tippy tailwater |
| Activity | Four-block, Wellston-scoped Coho responsiveness with continuous late lifecycle |

The generated historical timing series contains all five required checkpoints:
17 usable years at river start and 19 at the remaining checkpoints. Its replay
contains 93 historical checkpoint reads: 20 Ahead, 51 Typical, and 22 Delayed,
with no candidate-agreement violations.

Precipitation remains precursor evidence. Once discharge responds, the gauge
absorbs the rain signal so rain and flow are not double-counted as independent
movement events.

## Activity Outlook

Activity estimates the conditional responsiveness of a Coho already present;
it is not abundance, migration timing, fishability, or catch probability. The
Big Manistee profile retains the evidence-supported adult Coho 45–60°F response
band while binding every live measurement to the Wellston/Tippy tailwater.

| Component | Weight |
|---|---:|
| Effective light | 50% |
| Measured Wellston water temperature | 25% |
| Wellston river behavior | 15% |
| Precipitation context | 10% |

The complete-input 15–25 Coho floor remains fully active through October 31.
From November 1–10 it fades continuously to zero while the lifecycle deduction
grows from 0 to 15 points. From November 11–30 that deduction blends daily into
the stronger 42% ending constraint. The December residual tail holds 42% with
no floor. This prevents calendar-boundary cliffs while allowing very low reads
for deteriorating semelparous fish. Late output represents a fish of unknown
condition: a newly arrived or fresher fish may be more active than the score,
while a spawning or spent fish may be less active.

The 2007–2025 mechanical replay contains 1,901 usable days out of 1,919
expected. Daily min/p10/median/p90/max is 4/25/67/88/93; block range is 4–96.
Tapering has a 75 median and 90 maximum. Ending has a 50 median and 76 maximum
while the constraint transitions, with no Highly active days. Every residual
day is Reserved, with a 32 median and 37 maximum. All scoring, copy, geography,
warm-water, barrier, rollup, and lifecycle invariants are zero.

## Where to start

Big Manistee copy does not use “upper river” by itself because migratory salmon
cannot pass Tippy Dam. Novice-facing directions use these named zones:

- **Tippy tailwater** and **Tippy-to-High Bridge reach**
- **High Bridge–Bear Creek middle migratory corridor**
- **Lower migratory river toward M-55 and Manistee Lake**

Early reads allow a quick Tippy reconnaissance check but redirect anglers to
the middle and lower migratory river when tailwater evidence is sparse. Peak
copy compares named reaches without claiming every hole is occupied. The same
landmarked vocabulary was applied to Chinook, replacing ambiguous “upper
river” and generic “lower river” wording where necessary.

## Evidence

- [Michigan DNR Coho Salmon profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/coho-salmon)
- [Michigan DNR Manistee River below Tippy Dam Status Report 2004-4](https://www.michigan.gov/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder4/StatusReport_ManisteeRiverTippyDam_04-4.pdf)
- [Michigan DNR 2022–2023 Manistee River creel survey](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/ReportManisteeRiver2022-2023_est2024_12_23.pdf)
- [Michigan DNR Tippy Dam General Management Plan](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/PRD/MgtPlans-archive/TippyDam_GMP.pdf)
- USGS `04125550`, Manistee River near Wellston, daily discharge and measured water temperature

## Verification

- 84 production-derived Coho owner-review scenarios, including every Activity
  lifecycle, constraint, missing-input, and reach-scope state
- 84 regenerated Chinook scenarios and 66 Steelhead scenarios after the shared
  configuration revision
- Deterministic daily presence assertions, including 46–50 from October 16–20
- Species-correct temperature, timing-baseline, catalog, endpoint, and UI wiring
- No Pere Marquette geography or naked “upper river” language in audited Big
  Manistee Migration Stage copy

Public visibility is enabled so the complete profile can be audited in the app.
