# Lake trout all-city recalibration

Reviewed: 2026-10-09
Runtime status: **enabled in the 1.17 app branch; no live server or database change**

## Outcome

The review covers all 32 supported cities in the agreed 10 / 10 / 12 batches. It implements 26 internal numeric calibrations and keeps six cities unscored where the evidence still cannot distinguish a repeatable covered-pier fishery from regional or offshore lake-trout presence.

The 1.17 app now applies the v5 calibration in the real PierCast standings path while retaining the frozen v4 network response shape. It does not edit the generated v3 calibration, deploy an Edge Function, or change any database row. Newly admitted cities open the real city map until a separately approved server rollout can provide their full city reports.

## Product rules

- The internal number is a model input and ordering signal, not a catch probability and not an angler-facing `x/10` rating.
- The UI separates **Today** from **Season**. Today displays only **Prime**, **Good**, **Fair**, or **Poor**. A legal/access closure displays **Off season** instead of a score label.
- Season timing uses **Peak season**, **In season**, **Approaching peak**, **Past peak**, and **Off season**. The ambiguous term “shoulder” is prohibited.
- Water-temperature fit is supporting context, not a third rating.
- Absolute opportunity must drive cross-city ordering. A city's seasonal curve says *when that city's fishery is strongest*; it does not say that city is better than another city.
- After eligibility and closure gates, lake-trout cities are ordered by the exact unrounded daily opportunity score. Display-label ties never erase the configured city/species/date differences.
- November is the candidate high point and December remains strong wherever harvest is legal. January-February remain catchable when open water or safe legal ice access exists. Live access, ice and regulation gates always override the biological curve.
- Offshore abundance, charter success, reef stocking and a general port listing are not automatically transferred to a pedestrian pier.

## Why the old city-curve ranking was misleading

The seasonal city curve is a normalized `0…1` availability value. It answers: “How close is this city to its own best lake-trout window?” A weak fishery and a strong fishery can both equal `1.0` at their respective peaks. Ranking those curves directly can therefore put a weak city's best week above a much better city's merely-good week.

The proposed ordering uses the full opportunity calculation:

`seasonal potential = 1 + (city fishery strength - 1) × seasonal availability`

`daily opportunity = 1 + (seasonal potential - 1) × temperature modifier`

That preserves city quality, seasonal timing and current temperature as separate inputs. Only the derived word label is shown to anglers.

## Batch decisions

“Current” is the existing private calibration ceiling; `—` means the pair is currently unscored. “Candidate” remains internal and is never displayed as `/10`.

### Batch 1 — west Michigan

| City | Current | Candidate | Peak label | Decision | Evidence |
|---|---:|---:|---|---|---|
| St. Joseph | 4.1 | 5.8 | Fair | Recalibrate | B |
| South Haven | 3.8 | 5.6 | Fair | Recalibrate | A |
| Holland | 3.8 | 6.6 | Good | Recalibrate | B |
| Grand Haven | 3.6 | 6.5 | Good | Recalibrate | B |
| Muskegon | — | 5.8 | Fair | Provisional admission | C |
| Whitehall | — | 5.7 | Fair | Provisional admission | C |
| Pentwater | — | 5.8 | Fair | Provisional admission | C |
| Ludington | 3.8 | 6.2 | Good | Recalibrate | B |
| Manistee | 4.0 | 6.3 | Good | Recalibrate | A |
| Frankfort / Elberta | 4.0 | 5.9 | Fair | Recalibrate; Oct-Dec closed | B |

Batch 1 conclusion: the prior ceilings were too compressed. Holland, Grand Haven, Ludington and Manistee now reach Good in ideal legal conditions. The three newly scored ports remain provisional because the DNR seasonal roadmap is port-wide rather than an exact-pier catch series.

### Batch 2 — north and east Michigan

| City | Current | Candidate | Peak label | Decision | Evidence |
|---|---:|---:|---|---|---|
| Charlevoix | 5.0 | 5.7 | Fair | Recalibrate; Oct-Dec closed | B |
| Rogers City | 5.1 | 6.8 | Good | Recalibrate; Oct-Dec closed | A |
| Alpena | 5.0 | 6.2 | Good | Recalibrate; Oct-Dec closed | B |
| Harrisville | — | 5.5 | Fair | Provisional admission | C |
| Oscoda | 4.6 | 5.4 | Fair | Recalibrate; Oct-Dec closed | B |
| Tawas City | 5.1 | 5.4 | Fair | Recalibrate | B |
| Caseville | 4.6 | 6.8 | Good | Recalibrate | B |
| Harbor Beach | 5.3 | 7.2 | Good | Recalibrate | B |
| Port Sanilac | 5.5 | 6.3 | Good | Recalibrate | B |
| Lexington | 4.8 | 5.5 | Fair | Recalibrate | B |

Batch 2 conclusion: Caseville and Harbor Beach were materially understated. Harbor Beach is the highest candidate ceiling in the 32-city set. Its spring-through-fall port identity is direct agency evidence; November-December and ice-free winter are a biological/access-conditioned inference, not a claimed winter creel measurement.

### Batch 3 — Indiana, Illinois and Wisconsin

| City | Current | Candidate | Peak label | Decision | Evidence |
|---|---:|---:|---|---|---|
| Michigan City | — | — | Not ranked | Research hold | C |
| Chicago | 5.4 | 5.8 | Fair | Recalibrate | B |
| Waukegan | — | — | Not ranked | Research hold | C |
| Kenosha | — | — | Not ranked | Research hold | C |
| Racine | — | 4.4 | Fair | Provisional admission | C |
| Milwaukee | — | 4.3 | Fair | Provisional admission | C |
| Port Washington | — | 4.8 | Fair | Provisional admission | C |
| Sheboygan | — | 4.8 | Fair | Provisional admission | C |
| Manitowoc | — | — | Not ranked | Research hold | C |
| Two Rivers | — | — | Not ranked | Research hold | C |
| Kewaunee | 4.2 | 4.2 | Fair | Retain | B |
| Algoma | — | — | Not ranked | Research hold | C |

Batch 3 conclusion: Wisconsin DNR confirms that pier/shore lake trout are real, especially early and late, but recent harvest is tiny compared with boat modes. Racine, Milwaukee, Port Washington and Sheboygan now have cautious provisional values because their county geography and recent pier/shore positives are usable. Pooled-county or zero-harvest cities remain unscored rather than receiving invented placeholders. Indiana's documented fall shoreline run is near the Port of Indiana, not proof of repeatable Michigan City East Pier catch.

## Strong-source ledger

- [Michigan DNR lake trout species account](https://www.michigan.gov/dnr/education/michigan-species/fish-species/lake-trout): shallow-water presence in fall, winter and spring; pier opportunity around fall spawning; preferred temperature context.
- [Michigan DNR Lake Michigan roadmap](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Maps/LakeMichigaRoadmap.pdf): named-port seasonal target inventory; mixed fishing modes, so it establishes timing but not pier magnitude.
- [Michigan DNR Lake Huron roadmap](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Maps/RoadmapLake_Huron-accessible.pdf): named-port seasonal target inventory; explicitly non-exhaustive and mode-mixed.
- [Michigan DNR Better Fishing Waters](https://www.michigan.gov/dnr/things-to-do/fishing/where/better-fishing-waters): biologist-selected waters and named pier/port species, including Caseville, Harbor Beach and Port Sanilac lake trout.
- [Michigan DNR creel program](https://www.michigan.gov/dnr/managing-resources/fisheries/creel): preserved Pier/Dock estimates used for recurrence and relative magnitude; survey gaps are not treated as absence.
- [2026 Michigan fishing regulations](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/LED/digests/2026-Michigan-Fishing-Regulations_web_accessible.pdf): management-unit possession seasons and closure gates.
- [Wisconsin DNR Lake Michigan creel harvest tables, 1998-2024](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_CreelHarvestTables1998-2024.pdf): county-by-mode lake-trout estimates; pooled counties are not split between cities.
- [Wisconsin DNR lake trout guide](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Pubs_laketrout.pdf): statewide biological context and explicit early/late shore and pier opportunity; not city magnitude.
- [Illinois DNR Lake Michigan fishery](https://ifishillinois.org/Waterbodies/Details/76b7c9b3-4594-4e64-8651-49b0afbdc657): Illinois fishery context; offshore/reef evidence is not transferred to Waukegan Government Pier.
- [Indiana DNR Lake Michigan fishing](https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/): mid-October to mid-November shoreline run near the Port of Indiana and separately named Michigan City access.
- [Indiana DNR shoreline guide](https://www.in.gov/dnr/fish-and-wildlife/files/fw-fishing_lake_michigan.pdf): mode-specific constraint; lake trout are mainly a boat opportunity and exact Michigan City recurrence remains unresolved.

## Promotion gates

Before any live server use:

1. ~~Owner review of the 32 decisions, especially the Grade C provisional admissions.~~ Approved.
2. Recheck current regulations and local structure access immediately before release.
3. Implement the matching server projection without renaming, removing or retyping v4 response fields.
4. ~~Make the 1.17 app render labels and timing text only—never the internal numeric score.~~ Implemented.
5. App invariants, all 12 monthly snapshots, peak ordering, winter continuity and legal-closure tests are implemented. Add daily boundary snapshots and repeat them against the server projection before deployment.
6. Deploy one function at a quiet time through a normal PR with the current stable function version documented for rollback, then run the health workflow.

## Files

- Candidate calibration: `supabase/functions/_shared/pierCastEngine/config/lakeTroutV5.candidate.ts`
- Real 1.17 standings projection: `lib/pierCastLakeTroutV5.ts`
- Label/timing rules: `lib/pierCastOpportunityPresentationV5.ts`
- Invariant and app-projection tests: `supabase/functions/_shared/pierCastEngine/tests/lakeTroutV5Candidate.test.ts`, `lakeTroutV5AppProjection.test.ts`
