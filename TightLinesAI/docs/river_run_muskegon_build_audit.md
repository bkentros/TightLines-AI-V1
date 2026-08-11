# Muskegon River Run research and build audit

Build version: `2026-08-11-muskegon-copy.1` Status: beta, enabled for owner
audit

> Copy authority: the owner-approved
> [`river_run_muskegon_copy_foundation.md`](./river_run_muskegon_copy_foundation.md)
> supersedes this older calibration audit wherever public geography or terminal
> copy differs. Calibration and replay results below remain historical evidence.

## Decision

The supported corridor is Muskegon Lake upstream to the hard stop at Croton Dam.
Nothing in this build directs anglers above Croton or implies fish passage.
Named geography is not access permission.

Included profiles are Fall Chinook (9/10, broad), Fall Coho (3/10, sectional),
and Fall Steelhead (9/10, broad). Chinook and Steelhead are major documented
fisheries. Coho is included conservatively because the river/lake system and
state records support a recognizable opportunity, but evidence does not justify
equal strength or river-wide dependability. Lake-run brown trout is relevant in
roughly the lower ten miles during October–November but was not added because it
was outside the requested scope and needs a separate model.

Chinook, Coho, and Steelhead Activity are independently calibrated. Steelhead
uses a living-fish feeding model and cannot inherit either salmon model's
lifecycle decline.

## Sources and geography

- [USGS 04121970 current conditions](https://waterdata.usgs.gov/nwis/uv?legacy=1&site_no=04121970):
  discharge, gage height, precipitation, and measured water temperature; the
  station is immediately below Croton Dam.
- [USGS 04121970 water-data report](https://wdr.water.usgs.gov/wy2012/pdfs/04121970.2012.pdf):
  station coordinates, 2,313-square-mile drainage area, location 75 feet below
  Croton Drive and roughly 1,000 feet below the dam, and the statement that flow
  is completely regulated by Croton Dam.
- [Michigan DNR Central Lake Michigan Management Unit](https://www.michigan.gov/dnr/managing-resources/fisheries/units/c-michigan):
  the Muskegon Lake–Croton corridor, September–October Chinook fishery,
  late-October–June Steelhead fishery, reach hydraulics, boating/wading
  cautions, and public access descriptions.
- [Michigan DNR 1985–2005 Muskegon River angler survey](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/MuskegonRiver-CreelReport-2005.pdf):
  Croton-to-Muskegon Lake study area, Steelhead consistency, stocking,
  temperature, and fishery history.
- [Michigan DNR 2022–2023 creel survey](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/ReportMuskegonRiver2022-2023_est2024_01_03_2025.pdf):
  Site 151 (Croton–Newaygo) and Site 152 (Newaygo–M-120) reach definitions and
  modern seasonal effort/catch context.
- [Michigan DNR Fisheries Orders](https://www.michigan.gov/dnr/managing-resources/laws/orders/fisheries-orders):
  current FO-200 source. The app tells anglers to verify current rules and
  posted notices instead of borrowing a closure or gear rule from another river.

Public reach vocabulary is: Lower river (Muskegon Lake–M-120); Middle river
(M-120–Newaygo); Upper river (Newaygo–Croton Dam); and Muskegon Lake, Lake
Michigan channel, and river entrance as staging context. The Croton Dam area is
an emphasis inside the Upper river, not a fourth public section.

## Calibration

USGS 04121970 is the only scored hydraulic and temperature source. No upstream
gauge, reservoir reading, contextual gauge, or air temperature is blended into
the score. The common historical replay is 2007–2025.

Fishability bands are under 900 CFS very low; 900–1,200 low but fishable;
1,200–2,000 ideal; 2,000–3,000 high but fishable; 3,000–5,000 very
high/difficult; and 5,000+ blown out. Boundaries are inclusive according to the
shared engine (`2,000` remains ideal and `3,000` remains high-fishable).

Positive fall daily rises were approximately p50 70 CFS/4.7%, p75 150/10.7%, and
p90 310/20.4%. Push therefore uses 70/5% rising, 150/10% meaningful, and 310/20%
sharp thresholds. Strong requires measured meaningful response; Very Strong
requires measured sharp response. Rain is absorbed once reflected at the gauge.

## Calendars

Chinook: monitor Jul 15; stage Aug 10; river start Aug 20; established Sep 5;
broad Sep 15; peak approach Sep 25; 9/10 reference Oct 1; peak complete Oct 12;
taper through Oct 25; end Nov 5; presence tail Nov 12.

Coho: monitor Aug 20; stage Sep 5; river start Sep 15; established Oct 1; broad
Oct 12; peak approach Oct 20; 3/10 reference Oct 25; peak complete Nov 5; taper
through Nov 15; end Nov 30; presence tail Dec 7.

Steelhead: monitor Aug 20; stage Sep 10; river start Sep 25; established Oct 15;
broad Nov 1; peak approach Nov 10; 9/10 reference Nov 15; peak complete Dec 5;
taper through Dec 19; fall-entry end Dec 22; scoreless `Fall entry complete`
state Dec 23. Steelhead may remain, but this feature does not publish a winter
read.

## Replay results

### Fall Chinook Activity

Muskegon Fall Chinook Activity is independently calibrated to the regulated
Croton tailwater. It uses effective light at 55%, same-station measured water
temperature at 20%, Croton river behavior at 15%, and precipitation context at
10%. The favorable measured-temperature band is 48–62°F, with a 68°F warm
constraint and 72°F barrier constraint. These are Activity-response rules, not
fish-presence or movement thresholds.

The 2007–2025 replay produced 1,764 usable days from 1,805 expected (97.7%).
Daily scores ranged from 0–95 with a median of 43; all copy, scope, warm,
barrier, rollup, and lifecycle invariants were zero. Warm early Croton water
kept Beginning conservative (median 28), while Peak reached a median of 80.

The salmon back-half mechanism is continuous: the response floor fades and a
15-point lifecycle deduction grows from October 12 through October 25; Ending
then blends into a 46% residual constraint by November 5 and holds it through
the November 12 presence tail. Replay medians moved from 82 at the Peak
shoulder, to 85 in early Tapering, 73 in late Tapering, 64 in early Ending, 42
in late Ending, and 39 in the residual tail. The small early-Taper increase is
environmental rather than a calendar jump; deterministic boundary tests show the
configured lifecycle adjustment changes continuously.

Artifacts:

- `docs/audits/river-run-muskegon-chinook-activity-replay.json`
- `docs/audits/river-run-muskegon-chinook-activity-review-100.csv`

### Fall Coho Activity

Muskegon Fall Coho Activity uses the accepted adult Coho response model while
binding every live input to Croton: 50% effective light, 25% measured water
temperature, 15% river behavior, and 10% precipitation context. The preferred
response band is 45–60°F, with a 64°F warm constraint and 68°F barrier. Activity
describes the likely response of a Coho already present, not the size of this
limited 3/10 run.

The 2007–2025 replay produced 1,753 usable days from 1,786 expected (98.2%).
Daily scores ranged from 3–94 with a median of 57, and all scope, warm-water,
lifecycle, copy, and safety invariants were zero. Warm September water kept
Beginning conservative at a median of 24. Peak had a median of 83.

The Coho back-half mechanism begins after the November 5 Peak shoulder. The
response floor fades while a 15-point lifecycle deduction grows through November
15; Ending then blends into a 42% ceiling through November 30 and retains it
through the December 7 tail. Replay medians moved from 80 at the Peak shoulder,
to 79 in early Tapering, 72 in late Tapering, 65 in early Ending, 36 in late
Ending, and 34 in the residual tail.

Artifacts:

- `docs/audits/river-run-muskegon-coho-activity-replay.json`
- `docs/audits/river-run-muskegon-coho-activity-review-100.csv`

### Fall Steelhead Activity

Muskegon Fall Steelhead Activity is a temperature-led feeding and
aggressive-response outlook for fish already in the river. Measured Croton water
temperature carries 50%, effective light 25%, river behavior 15%, and
precipitation context 10%. The preferred response band is 44–56°F, with the
strongest response near 48–54°F. Water around 39°F and colder shifts fish toward
slower winter behavior but does not erase them from the river.

Unlike salmon, Steelhead receive no spawning decline, response-floor fade,
lifecycle deduction, late ceiling, or ending cap. Identical environmental
conditions produce identical in-window scores across Peak, Tapering, and
Ending. December 23 is now outside public fall-entry scoring.

The 2007–2025 replay produced 1,962 usable days from 1,995 expected (98.3%).
Daily scores ranged from 3–97 with a median of 70. The 44–56°F band produced a
median of 87; water below 44°F produced a median of 68, while 64–68°F fell to 18
and 68°F or warmer fell to 7. Late fall declined with actual cooling: Peak had a
median of 80, Tapering 64, and Ending 60. All scope,
warm-water, copy, mortality-language, and stage-penalty invariants were zero.

Artifacts:

- `docs/audits/river-run-muskegon-steelhead-activity-replay.json`
- `docs/audits/river-run-muskegon-steelhead-activity-review-100.csv`

Fishability: 2,470 expected and usable days (100%); Excellent 1,175; Good 325;
Fishable 715; Tough 229; Poor 26; zero invariant violations. Detailed band/label
combinations are emitted by
`river-run-big-manistee-fishability-replay.ts --muskegon`.

Push: Chinook 1,444 usable/1,482 expected (97.44%): Weak 456, No clear push 807,
Possible 110, Strong 63, Very strong 8. Coho 1,431/1,463 (97.81%): Weak 173, No
clear push 1,042, Possible 112, Strong 97, Very strong 7. Steelhead 1,667/1,691
(98.58%): Weak 453, No clear push 1,010, Possible 129, Strong 71, Very strong 4.
Every species had zero Strong-without-response, rain-double-count,
Very-Strong-without-sharp-rise, and total violations.

Migration Timing: each profile generated all five checkpoints. Chinook: Ahead 1,
Typical 69, Delayed 25, mixed 1. Coho: Ahead 14, Typical 58, Delayed 23,
mixed 10. Steelhead: Ahead 10, Typical 61, Delayed 23, mixed 1. Candidate/final
agreement violations and reversal-tempering events were zero. Usable years were
19 at every checkpoint except Steelhead building-start (18).

## Limitations and owner review

USGS 04121970 directly represents only the Croton tailwater. Releases are
regulated and downstream clarity, tributary inputs, wood, access, and safety can
differ. The Coho ceiling and calendar have the greatest biological uncertainty.
Calendar presence is environmental opportunity context, never a fish count. All
current regulations and access claims require owner/legal review before
promotion from beta.

Owner-review focus: Coho inclusion and 3/10 ceiling; the 42-mile corridor
approximation; current FO-200 reach language; 900/1,200/2,000/3,000/5,000
Fishability boundaries; and all novice reach progression copy.

The owner-review UI uses separate Muskegon fixture catalogs for Chinook, Coho,
and Steelhead. Every fixture is pinned to its exact river/run identity, and the
screen rejects any review snapshot whose river or run differs from the active
selection. Steelhead's catalog also rejects salmon mortality language.
