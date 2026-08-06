# Big Manistee Fall Steelhead — Owner Build Audit

**Run:** `big_manistee_fall_steelhead`
**Configuration:** `2026-08-06-big-manistee-fall-steelhead.2`
**Status:** Enabled for owner review

## Implemented position

Big Manistee Fall Steelhead is implemented as a strong **8/10** historical
opportunity with broad distribution through the migratory corridor below Tippy
Dam. A restrained winter-run scouting phase begins September 15, reaches the
previously accepted early-entry level September 20, becomes established October
15, broadens November 1, reaches 80/100 on November 15, remains high through
December 4, and retains 70/100 on December 22. December 23 is a handoff into
winter holding rather than an assertion that Steelhead leave the river.

The 70-point handoff is deterministic: `80 × 0.875 = 70`.

## Big Manistee-specific biology

The profile separates the river's Skamania summer-run component from the later
winter-run fall-entry build. Pre-run copy may acknowledge a summer-run fish
already holding near Tippy, but that observation cannot make Migration Timing
call the winter-run fall entry early or inflate the fall presence curve.

The 8/10 ceiling is supported by Michigan DNR's historic annual stocking
targets of approximately 50,000 Little Manistee winter-run and 34,000 Skamania
summer-run yearlings, a sampled naturally reproduced contribution of roughly
24–41.5%, and 1999–2003 harvest estimates averaging 18,610 Steelhead. Recent
creel data places the strongest fall Rainbow Trout harvest and release in
November and retains meaningful December catch.

## Primitive implementation

| Primitive | Implementation |
|---|---|
| Migration Stage | Big-specific Skamania, fall-entry, broadening, peak, late-fall, and winter-handoff copy |
| Fish In River | 8/10 ceiling, twelve anchors, daily interpolation, and 70/100 winter handoff |
| Migration Timing | Five cumulative Steelhead checkpoints using Wellston flow and measured water |
| Push | Shared Wellston hydraulics with Steelhead-specific temperature and cold-holding behavior |
| Fishability | Shared accepted Wellston CFS bands, limited to the regulated Tippy tailwater |

Steelhead gives measured water temperature 60% of the Migration Timing weight
and regulated-tailwater response 40%. Push treats 46–52F as core fall-entry
water, 40–45F as movement-capable but increasingly holding-oriented, and about
39F or colder as a cold-holding state that caps active movement without erasing
in-river presence. Rain remains precursor-only and is absorbed after measured
discharge responds.

## Where to start

Every stage uses named migratory reaches:

- Manistee Lake, river mouth, and lower migratory river toward M-55
- High Bridge–Bear Creek middle migratory corridor
- Tippy-to-High Bridge reach
- Tippy tailwater

Early fall-entry guidance begins lakeward and treats Tippy Skamania separately.
Building copy compares fresher lower/middle fish with accumulated tailwater
fish. Peak copy puts the full corridor in play without extending Wellston's
hydraulic reading downstream. Late-fall and handoff copy prioritizes deep,
speed-controlled holding water with nearby feeding current.

## Evidence

- [Michigan DNR Manistee River below Tippy Status Report 2004-4](https://www.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/StatusoftheFisheryResourceReports/0088_2004_ManisteeRiver.pdf)
- [Michigan DNR 2022–2023 Manistee creel survey](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/ReportManisteeRiver2022-2023_est2024_12_23.pdf)
- [Michigan DNR Steelhead profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead)
- [Michigan DNR Tippy Dam General Management Plan](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/PRD/MgtPlans-archive/TippyDam_GMP.pdf)
- [U.S. Fish and Wildlife Service Manistee River profile](https://www.fws.gov/rivers/river/manistee)
- USGS `04125550`, Wellston discharge and measured water temperature

## Verification and deferred work

The owner-review build contains 66 production-derived scenarios plus focused
calendar, presence, handoff, source-sharing, thermal, reach-copy, catalog, UI,
and type checks.

The quantitative post-build Big Manistee primitive audit is complete. Its
Steelhead Push window and first Migration Timing checkpoint were rerun after the
September 15 scouting phase was added; Fishability remains the shared accepted
Wellston audit.
