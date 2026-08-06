# Muskegon River Run research and build audit

Build version: `2026-08-06-muskegon.1`
Status: beta, enabled for owner audit

## Decision

The supported corridor is Muskegon Lake upstream to the hard stop at Croton Dam. Nothing in this build directs anglers above Croton or implies fish passage. Named geography is not access permission.

Included profiles are Fall Chinook (9/10, broad), Fall Coho (3/10, sectional), and Fall Steelhead (9/10, broad). Chinook and Steelhead are major documented fisheries. Coho is included conservatively because the river/lake system and state records support a recognizable opportunity, but evidence does not justify equal strength or river-wide dependability. Lake-run brown trout is relevant in roughly the lower ten miles during October–November but was not added because it was outside the requested scope and needs a separate model.

## Sources and geography

- [USGS 04121970 current conditions](https://waterdata.usgs.gov/nwis/uv?legacy=1&site_no=04121970): discharge, gage height, precipitation, and measured water temperature; the station is immediately below Croton Dam.
- [USGS 04121970 water-data report](https://wdr.water.usgs.gov/wy2012/pdfs/04121970.2012.pdf): station coordinates, 2,313-square-mile drainage area, location 75 feet below Croton Drive and roughly 1,000 feet below the dam, and the statement that flow is completely regulated by Croton Dam.
- [Michigan DNR Central Lake Michigan Management Unit](https://www.michigan.gov/dnr/managing-resources/fisheries/units/c-michigan): the Muskegon Lake–Croton corridor, September–October Chinook fishery, late-October–June Steelhead fishery, reach hydraulics, boating/wading cautions, and public access descriptions.
- [Michigan DNR 1985–2005 Muskegon River angler survey](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/MuskegonRiver-CreelReport-2005.pdf): Croton-to-Muskegon Lake study area, Steelhead consistency, stocking, temperature, and fishery history.
- [Michigan DNR 2022–2023 creel survey](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Creel-Archive/ReportMuskegonRiver2022-2023_est2024_01_03_2025.pdf): Site 151 (Croton–Newaygo) and Site 152 (Newaygo–M-120) reach definitions and modern seasonal effort/catch context.
- [Michigan DNR Fisheries Orders](https://www.michigan.gov/dnr/managing-resources/laws/orders/fisheries-orders): current FO-200 source. The app tells anglers to verify current rules and posted notices instead of borrowing a closure or gear rule from another river.

Reach vocabulary is: Croton tailwater; Croton-to-Newaygo corridor; Newaygo-to-M-120 lower migratory corridor; lower river/Muskegon Lake approach; Muskegon Lake and channel context.

## Calibration

USGS 04121970 is the only scored hydraulic and temperature source. No upstream gauge, reservoir reading, contextual gauge, or air temperature is blended into the score. The common historical replay is 2007–2025.

Fishability bands are under 900 CFS very low; 900–1,200 low but fishable; 1,200–2,000 ideal; 2,000–3,000 high but fishable; 3,000–5,000 very high/difficult; and 5,000+ blown out. Boundaries are inclusive according to the shared engine (`2,000` remains ideal and `3,000` remains high-fishable).

Positive fall daily rises were approximately p50 70 CFS/4.7%, p75 150/10.7%, and p90 310/20.4%. Push therefore uses 70/5% rising, 150/10% meaningful, and 310/20% sharp thresholds. Strong requires measured meaningful response; Very Strong requires measured sharp response. Rain is absorbed once reflected at the gauge.

## Calendars

Chinook: monitor Jul 15; stage Aug 10; river start Aug 20; established Sep 5; broad Sep 15; peak approach Sep 25; 9/10 reference Oct 1; peak complete Oct 12; taper through Oct 25; end Nov 5; presence tail Nov 12.

Coho: monitor Aug 20; stage Sep 5; river start Sep 15; established Oct 1; broad Oct 12; peak approach Oct 20; 3/10 reference Oct 25; peak complete Nov 5; taper through Nov 15; end Nov 30; presence tail Dec 7.

Steelhead: monitor Aug 20; stage Sep 10; river start Sep 25; established Oct 15; broad Nov 1; peak approach Nov 10; 9/10 reference Nov 15; peak complete Dec 5; taper through Dec 19; fall-entry end Dec 22; winter-holding handoff Dec 23 retaining 80/100.

## Replay results

Fishability: 2,470 expected and usable days (100%); Excellent 1,175; Good 325; Fishable 715; Tough 229; Poor 26; zero invariant violations. Detailed band/label combinations are emitted by `river-run-big-manistee-fishability-replay.ts --muskegon`.

Push: Chinook 1,444 usable/1,482 expected (97.44%): Weak 456, No clear push 807, Possible 110, Strong 63, Very strong 8. Coho 1,431/1,463 (97.81%): Weak 173, No clear push 1,042, Possible 112, Strong 97, Very strong 7. Steelhead 1,667/1,691 (98.58%): Weak 453, No clear push 1,010, Possible 129, Strong 71, Very strong 4. Every species had zero Strong-without-response, rain-double-count, Very-Strong-without-sharp-rise, and total violations.

Migration Timing: each profile generated all five checkpoints. Chinook: Ahead 1, Typical 69, Delayed 25, mixed 1. Coho: Ahead 14, Typical 58, Delayed 23, mixed 10. Steelhead: Ahead 10, Typical 61, Delayed 23, mixed 1. Candidate/final agreement violations and reversal-tempering events were zero. Usable years were 19 at every checkpoint except Steelhead building-start (18).

## Limitations and owner review

USGS 04121970 directly represents only the Croton tailwater. Releases are regulated and downstream clarity, tributary inputs, wood, access, and safety can differ. The Coho ceiling and calendar have the greatest biological uncertainty. Calendar presence is environmental opportunity context, never a fish count. All current regulations and access claims require owner/legal review before promotion from beta.

Owner-review focus: Coho inclusion and 3/10 ceiling; the 42-mile corridor approximation; current FO-200 reach language; 900/1,200/2,000/3,000/5,000 Fishability boundaries; and all novice reach progression copy.
