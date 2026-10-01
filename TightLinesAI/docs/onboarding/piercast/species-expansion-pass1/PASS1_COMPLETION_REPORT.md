# PierCast live-city species expansion — Pass 1 completion report

Status: research complete; implementation intentionally not started

Evidence freeze: 2026-09-15
Scope: all 12 live PierCast cities; public piers, breakwalls, catwalks, harbor walls and immediately adjacent river-mouth shore

## Decision

The current 70-pair roster is materially incomplete. This pass recommends 24 additional city/species pairings, producing a proposed 94-pair roster for Pass 2. Nine additions have Grade A evidence and 15 have Grade B evidence. Another 22 candidates are deferred and 16 excluded. Carp, suckers and rock bass were excluded from the research universe at the owner's direction.

An admission means the evidence supports a recurring, intentional city-harbor opportunity with enough seasonal information to create a conservative v3 curve. It does not mean the species is abundant every day, and it does not turn boat-only or merely regional occurrence into a pier forecast.

## Recommended additions

| City | Current | Add | Proposed | Additions |
|---|---:|---:|---:|---|
| Ludington | 8 | 2 | 10 | Northern pike; burbot |
| Grand Haven | 11 | 4 | 15 | White perch; white bass; bluegill; lake whitefish |
| Manistee | 10 | 2 | 12 | Northern pike; burbot |
| Frankfort–Elberta | 5 | 2 | 7 | Northern pike; walleye |
| Sheboygan | 4 | 0 | 4 | None supported above the admission threshold |
| Port Washington | 4 | 0 | 4 | None supported above the admission threshold |
| Milwaukee | 4 | 0 | 4 | None supported above the admission threshold |
| Racine | 5 | 0 | 5 | None supported above the admission threshold |
| Kenosha | 5 | 0 | 5 | None supported above the admission threshold |
| Harbor Beach | 2 | 5 | 7 | Atlantic salmon; steelhead; lake trout; walleye; northern pike |
| Oscoda | 9 | 1 | 10 | Northern pike |
| Port Sanilac | 3 | 8 | 11 | Atlantic salmon; Chinook salmon; brown trout; lake trout; yellow perch; walleye; smallmouth bass; white bass |
| **Total** | **70** | **24** | **94** | |

The owner's concern was correct: Harbor Beach and Port Sanilac were substantially underrepresented. Oscoda was already broad at nine live species, so only northern pike clears the additional-pair threshold.

## Important deferrals

- Oscoda lake whitefish: Michigan DNR identifies the local Lake Huron water as good lake-whitefish water, but the reviewed record does not establish a recurring pier/catwalk or immediate-mouth target window. This is a real local species lead, not enough evidence for a numeric pier score.
- Harbor Beach brown trout and Chinook salmon: occurrence exists, but current recurring public-harbor target evidence is too thin. Brown trout has one old report described as occasional; reviewed Chinook evidence is boat-oriented.
- Grand Haven walleye: six modern positive survey years establish recurring occurrence, but the low rate and lack of repeated directed pier reports do not yet establish a dependable target fishery.
- Manistee largemouth bass, lake whitefish and cisco: catches occur, but directed city-harbor target evidence is not sufficiently recurrent.
- Ludington walleye and round whitefish: the survey establishes occurrence, not a clearly intentional present-day harbor fishery.
- Frankfort freshwater drum, smallmouth bass and lake whitefish: evidence is too sparse or mixed to defend year-round numeric calibration.
- Wisconsin non-core candidates: the exact Wisconsin DNR pier guide continues to support the current core lists. Regional or county-level lake-trout/perch/pike evidence was not promoted without recurring city-pier evidence and identifiable seasonal magnitude.

Deferral is deliberately different from exclusion. A deferred species should be revisited when exact-structure reports, targeted creel data or repeated current observations become available; it must not receive a score in Pass 2.

## Seasonal and scoring research delivered

The 24 admitted pairs have 33 proposed opportunity modes in `proposed-opportunity-modes.json`. Each mode contains:

- an ordinal `fisheryStrength` ceiling;
- full-year-bounded availability knots with explicit inactive shoulders;
- a shared thermal-curve reference;
- evidence grade and source IDs.

Pass 2 must continue to use the v3 formula:

`score = 1 + ((1 + (F - 1) × A) - 1) × (0.30 + 0.70 × T)`

When multiple modes exist, take the maximum mode score; never add modes. Zero availability yields the v3 floor of 1.0. Strength is a calibration ceiling, not a catch probability, abundance estimate or government rating.

Existing species reuse their already researched shared thermal curves. Four globally new PierCast species require new profiles and curves:

| Species | New admitted cities | Research shape |
|---|---|---|
| Burbot | Ludington; Manistee | Broad cold-water compatibility through about 12 C, declining quickly above 14 C; winter timing is controlled by availability |
| White perch | Grand Haven | Broad warm-water response with growth evidence in the upper 20s C and a cool spring shoulder |
| White bass | Grand Haven; Port Sanilac | Broad mid-teen through warm-water compatibility; city schooling windows remain in availability |
| Bluegill | Grand Haven | Warm-water curve with a 21–27 C plateau and broad shoulders |

The thermal ordinates are conservative engineering judgments constrained by the cited biology. They are not direct measurements of bite probability, and surface temperature may differ from fish-experienced temperature. All four curves remain provisional until Pass 2 replay and residual review.

## Quantitative evidence interpretation

The preserved Michigan DNR Pier/Dock extract was analyzed for 2012–2022 excluding the anomalous 2020 survey year. `Catch` is used rather than `Harvest` so released fish are not discarded. Effort-normalized rates use only month-years where the species was enumerated; treating every port survey month as an observed zero would bias rates downward because omitted species rows are not confirmed zeros.

The extract supports strong recurrence for Ludington pike, Grand Haven white perch/bluegill, and Manistee pike. Grand Haven white bass is recurring but episodic. Frankfort pike and walleye remain low-ceiling admissions because the quantitative record is sparse and current DNR harbor reports carry the recurrence decision. Historical Grand Haven November lake-whitefish magnitude is not used to set lawful bite strength because DNR reports that much historical harvest was snagged.

The exact figures and month-by-month recurrence are frozen in `michigan-admission-creel-summary.csv`.

## Regulations and access

- The reviewed 2026 Michigan regulations are effective through 2027-03-31 and must be refreshed after that date.
- Great Lakes trout/salmon and the covered Lower Peninsula Great Lakes pike/walleye fisheries are generally open year-round under the reviewed tables, subject to size, bag and water-specific rules.
- Bass forecasts can remain biologically live, but the UI must identify catch-and-immediate-release periods outside the legal possession season.
- Grand Haven has a November 1–30 single-pointed, unweighted hook restriction within the defined port. The UI needs a method notice, and historical snagging harvest cannot calibrate lake-whitefish bite strength.
- Port Sanilac forecasts must remain scoped to lawful public breakwall/shore access and not imply that every marina dock or basin edge is public.

The structured implementation gates are in `regulation-and-access-gates.json`.

## Evidence quality and limitations

The research prioritizes state DNR regulations, DNR fishery roadmaps, the Michigan DNR creel extract, dated DNR weekly reports, municipal access statements, and primary/agency thermal literature. Weekly reports are qualitative snapshots and silence is not absence. Port roadmaps are intentionally non-exhaustive and do not provide catch rates. County or regional evidence cannot by itself admit a city-pier pairing.

Confidence is high that the 24 recommendations are the defensible additions for this product boundary. Confidence is lower in exact magnitude than in identity for the Grade B pairs, especially Frankfort pike/walleye, winter burbot, and the lawful-bite component of Grand Haven lake whitefish. The conservative strengths reflect that uncertainty. There is no claim that the deferred list is biologically absent.

## Pass 2 implementation contract

Pass 2 is not complete until all of the following are done together:

1. Add exactly the 24 admitted pairings and 33 modes; do not implement deferred or excluded rows.
2. Add global catalog/schema/behavior entries, correctly sized fish art and shared thermal curves for burbot, white perch, white bass and bluegill.
3. Preserve existing species thermal curves and the v3 formula; modes combine by maximum.
4. Apply the regulation/access gates and render the Grand Haven November notice.
5. Run all 94 pairings through full-year daily or weekly audits at multiple thermal-fit scenarios, formula invariants, cross-city calibration and roster-count tests.
6. Confirm every public response has unique species IDs, valid art, correct ordering and no oversized image collision.
7. Keep all new ratings private/promotion-blocked until owner review, migration reconciliation and production smoke tests pass.

## Artifact index

- `source-ledger.json`: normalized source record and limitations.
- `candidate-decision-matrix.csv`: all 62 researched candidates with admit/defer/exclude dispositions.
- `proposed-opportunity-modes.json`: 24 admitted pairs and 33 research-mode calibrations.
- `proposed-new-species-thermal-curves.json`: four provisional new-species thermal profiles.
- `new-species-global-dispositions.json`: explicit disposition for each new species across all 12 cities.
- `michigan-admission-creel-summary.csv`: reproducible quantitative support for the Michigan survey-backed admissions.
- `regulation-and-access-gates.json`: structured legal and access handoff.

No runtime configuration, database migration, deployment or public score was changed in Pass 1.
