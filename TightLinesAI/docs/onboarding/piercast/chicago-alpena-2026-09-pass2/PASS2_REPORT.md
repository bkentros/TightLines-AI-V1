# PierCast Chicago–Alpena onboarding — Pass 2 completion report

**Cities:** Chicago, Illinois; Michigan City, Indiana; Muskegon, Michigan; Whitehall, Michigan; Alpena, Michigan

**Completed:** 2026-09-19

**Status:** complete private Formula v3 calibration package

**Visibility:** private owner review only; public release remains unchanged

## Decision

Pass 2 is complete.

Every one of the 95 city/species cells was reopened after Pass 1. The final private research roster contains:

- **55 numeric pairs** supported at Grade A or B;
- **23 Grade C research holds** with no score;
- **17 Grade D exclusions** with no score;
- **83 seasonal opportunity modes**;
- **20,075 daily rows**, covering all 365 dates for every numeric pair;
- **59,811 scores** evaluated at thermal suitability `T = 0`, `0.5`, and `1` after removing legally unavailable dates;
- **46 unavailable Chicago yellow-perch dates** and **92 unavailable Alpena lake-trout dates**.

No placeholder values were assigned. A blank score means the evidence does not support numeric admission. It does not mean a score of 1, weak biological presence, or species absence.

A subsequent due-diligence comparison reopened all cells against the complete same-species city rankings and the reputation of the covered shore mode. Nine existing values changed, 42 were retained, and four Alpena salmonids were promoted from hold after current DNR stocking and catch evidence was added. The row-by-row audit is in `due-diligence-review.csv`; the reasoning is summarized in `DUE_DILIGENCE_REVIEW.md`.

## Formula and interpretation

For each active seasonal mode:

```text
seasonalPotential = 1 + (F - 1) × A
score = clamp(1, 10, 1 + (seasonalPotential - 1) × (0.30 + 0.70 × T))
```

- `F` is the best recurring prime-condition ceiling.
- `A` contains seasonal timing and duration.
- `T` contains thermal suitability.
- Evidence grade records confidence and never multiplies `F`, `A`, `T`, or score.
- When multiple modes are available, the largest seasonal potential wins. Modes never add.
- The annual peak shown below is the ideal-temperature ceiling, not an annual average, catch probability, abundance estimate, or agency rating.

## Every species peak for every city

### Chicago, Illinois

| Species | Peak `F` | Grade | Peak date / disposition |
|---|---:|:---:|---|
| Chinook salmon | **7.0** | B | Sep 5 — fall harbor staging |
| Coho salmon | **8.2** | B | Apr 20 — spring nearshore |
| Steelhead | **6.5** | B | Apr 15 — winter/spring pier |
| Brown trout | **6.2** | B | Apr 10 — winter/spring nearshore |
| Lake trout | **5.4** | B | Feb 15 — winter nearshore |
| Walleye | — | D | Exclude |
| Smallmouth bass | **6.5** | B | Jul 20 — warm-season harbor |
| Freshwater drum | **5.6** | B | Jul 15 — warm-season harbor |
| Yellow perch | **8.4** | A | Feb 1 — winter Navy Pier schooling; separate summer Montrose mode |
| Lake whitefish | — | C | Research hold |
| Round whitefish | — | D | Exclude |
| Channel catfish | — | C | Research hold |
| Largemouth bass | — | C | Research hold |
| Atlantic salmon | — | D | Exclude |
| Northern pike | **4.7** | B | May 1 — spring harbor |
| Burbot | — | C | Research hold |
| White perch | — | D | Exclude |
| White bass | — | C | Research hold |
| Bluegill | — | C | Research hold |

Chicago's model deliberately covers the whole year. The strongest windows are spring coho, summer Montrose perch/bass/drum, fall Chinook, and winter Navy Pier perch and lake trout. Lake trout is 5.4 after the due-diligence review: repeated expert reporting describes an increasingly targeted, decent-to-good winter shore fishery and documents limit catches. That puts Chicago between Harbor Beach 5.3 and Port Sanilac 5.5; missing standardized Navy Pier effort remains only in Grade B confidence. Smallmouth rises to 6.5 because repeated current reports describe good Montrose fishing and Illinois identifies the growing Chicago shore fishery; the value now sits between Whitehall 6.3 and Muskegon 6.6.

Yellow perch receives separate Navy Pier winter and Montrose summer modes. The ideal peak is 8.4 and the legal May 1-June 15 closure produces no score on all 46 dates.

### Michigan City, Indiana

| Species | Peak `F` | Grade | Peak date / disposition |
|---|---:|:---:|---|
| Chinook salmon | **7.4** | B | Sep 5 — fall harbor staging |
| Coho salmon | **8.7** | B | Apr 20 — spring nearshore |
| Steelhead | **8.5** | B | Jul 15 — summer Skamania pier; separate winter mode |
| Brown trout | **6.0** | B | Apr 10 — winter/spring nearshore |
| Lake trout | — | C | Research hold |
| Walleye | — | C | Research hold |
| Smallmouth bass | **5.7** | B | Jul 20 — warm-season harbor |
| Freshwater drum | — | C | Research hold |
| Yellow perch | **6.2** | B | Jul 20 — summer pier schooling |
| Lake whitefish | — | C | Research hold |
| Round whitefish | — | D | Exclude |
| Channel catfish | — | C | Research hold |
| Largemouth bass | **5.5** | B | Aug 15 — warm-season harbor |
| Atlantic salmon | — | D | Exclude |
| Northern pike | — | D | Exclude |
| Burbot | — | D | Exclude |
| White perch | — | D | Exclude |
| White bass | — | D | Exclude |
| Bluegill | **5.2** | B | Aug 15 — warm-season harbor |

Spring coho at 8.7 is placed between Waukegan/Grand Haven at 8.8 and Kenosha/Frankfort–Elberta at 8.6. Steelhead at 8.5 reflects two distinct agency-documented pier fisheries: summer Skamania and late-fall/winter steelhead. Those renowned southern Lake Michigan shore opportunities retain their excellent peaks. Chinook is 7.4 after applying Indiana DNR's direct “some pier” magnitude description and the current report of only a few shore fish; it now matches Kenosha and sits below Waukegan 7.6. Perch is 6.2 because the agency calls shore availability limited. Bluegill rises to 5.2 because the guide calls panfish common at Washington Park marina.

Lake trout remains unscored because agency guidance primarily identifies a boat fishery. Lake whitefish is an exact-site possibility in the spring-coho guide, but recurrence and comparative magnitude remain unresolved. Walleye, drum, and channel-catfish evidence points primarily to the excluded NIPSCO discharge.

### Muskegon, Michigan

| Species | Peak `F` | Grade | Peak date / disposition |
|---|---:|:---:|---|
| Chinook salmon | **6.5** | A | Sep 5 — fall harbor staging |
| Coho salmon | **6.4** | A | Apr 15 — spring nearshore |
| Steelhead | **8.0** | A | Apr 15 — winter/spring pier; separate fall mode |
| Brown trout | **7.0** | A | Apr 10 — winter/spring nearshore |
| Lake trout | — | C | Research hold |
| Walleye | **6.4** | A | May 15 — spring low light |
| Smallmouth bass | **6.6** | A | Jul 20 — warm-season harbor |
| Freshwater drum | **6.2** | A | Jul 15 — warm-season harbor |
| Yellow perch | **5.2** | A | Apr 20 — spring channel; separate summer mode |
| Lake whitefish | **4.0** | B | Nov 15 — lawful late-fall channel opportunity |
| Round whitefish | — | C | Research hold |
| Channel catfish | **6.0** | A | Aug 20 — warm-season channel |
| Largemouth bass | **6.5** | A | Aug 15 — warm-season harbor |
| Atlantic salmon | — | D | Exclude |
| Northern pike | **4.8** | A | May 1 — spring harbor |
| Burbot | — | D | Exclude |
| White perch | **5.7** | A | Aug 20 — warm-season schooling |
| White bass | — | C | Research hold |
| Bluegill | **6.0** | A | Aug 15 — warm-season harbor |

The long port series supports a broad roster without a confidence penalty. Chinook is 6.5 after the due-diligence review. Its historical record is strong, but the modern series contains only 47 fish and the recent series contains one fish, with four surveyed fall zeros. That observed current weakness no longer supports placement beside Grand Haven and Waukegan. Steelhead at 8.0 is immediately below Ludington 8.1. Smallmouth at 6.6 is below Grand Haven 7.0 and just above Chicago 6.5. Drum at 6.2 remains below Grand Haven 7.2 and above Chicago/Whitehall 5.6.

Lake whitefish remains an admitted, intentional cold-season fishery, but its peak is 4.0 rather than 8.8. Michigan DNR states that much of the harvest in the regulated ports came from snagged fish. The large creel totals therefore cannot calibrate lawful bite strength. Exact channel guidance and the protected November opportunity support the same ordinary lawful-fishing anchor used for Grand Haven, with Grade B confidence.

Muskegon perch remains numeric but peaks at 5.2. Historical recurrence and current channel guidance establish a real fishery; the modern Catch series has only 52 fish over 27,515 matched all-species hours with many in-season zeros. Lake trout remains Grade C. Only two of eight surveyed years are positive, the last in 2015, at roughly 0.9 catches per 1,000 matched all-species hours across the full reviewed record. Round whitefish also remains Grade C because its sparse modern catch does not support a stable spring/fall annual shape. White bass remains unscored after only two positive years.

### Whitehall, Michigan

| Species | Peak `F` | Grade | Peak date / disposition |
|---|---:|:---:|---|
| Chinook salmon | **9.3** | A | Sep 5 — fall harbor staging |
| Coho salmon | **7.4** | A | Oct 5 — fall harbor return |
| Steelhead | **8.7** | A | Apr 15 — winter/spring pier; separate fall mode |
| Brown trout | **7.7** | A | Apr 10 — winter/spring nearshore |
| Lake trout | — | C | Research hold |
| Walleye | **5.8** | A | Aug 15 — summer low light |
| Smallmouth bass | **6.3** | A | Jul 20 — warm-season harbor |
| Freshwater drum | **5.6** | A | Jul 15 — warm-season harbor |
| Yellow perch | **8.0** | A | Jul 20 — summer channel schooling |
| Lake whitefish | **4.0** | B | Nov 15 — lawful late-fall channel opportunity |
| Round whitefish | — | C | Research hold |
| Channel catfish | **5.0** | A | Aug 20 — warm-season channel |
| Largemouth bass | **7.1** | A | Aug 15 — warm-season harbor |
| Atlantic salmon | — | C | Research hold |
| Northern pike | **4.9** | A | May 1 — spring harbor |
| Burbot | — | D | Exclude |
| White perch | — | C | Research hold |
| White bass | — | C | Research hold |
| Bluegill | **5.2** | A | Aug 15 — warm-season harbor |

Whitehall-Montague port data make the fall Chinook fishery elite: 16 of 17 surveyed years are positive with high measured magnitude. Its 9.3 peak sits below Sheboygan 9.4 and above Kewaunee 9.1. Steelhead at 8.7 falls between Grand Haven 9.2 and Michigan City 8.5/Ludington 8.1. Perch peaks at 8.0 in July: the summer magnitude is high, but the extraordinary September estimate occurs in only one sampled year and 2018 is zero.

Lake whitefish receives a 4.0 Grade B calibration. The current agency identifies White Lake pier/channel whitefish and the November rule confirms an intentional fishery, but the port series has no positive catch row and Michigan DNR says much of the harvest in the regulated ports came from snagged fish. The defensible lawful-fishing magnitude is therefore the ordinary Grand Haven anchor rather than a new excellent-class ceiling.

Lake trout stays unscored: two positive years, last in 2015, and roughly 0.7 per 1,000 matched hours do not establish a current recurring target. Round whitefish, Atlantic salmon, white perch, and white bass also lack enough current recurrence and magnitude for admission.

### Alpena, Michigan

| Species | Peak `F` | Grade | Peak date / disposition |
|---|---:|:---:|---|
| Chinook salmon | **5.4** | B | Oct 5 — fall harbor staging |
| Coho salmon | **6.5** | B | Oct 10 — fall harbor return |
| Steelhead | **5.8** | B | Apr 25 — spring harbor |
| Brown trout | **5.4** | B | Apr 10 — winter/spring nearshore |
| Lake trout | **5.0** | B | Aug 15 — summer/early-fall nearshore; closed Oct 1–Dec 31 |
| Walleye | **7.4** | A | May 15 — spring low light |
| Smallmouth bass | **8.0** | A | Jul 20 — warm-season harbor |
| Freshwater drum | **4.2** | B | Jul 15 — warm-season harbor |
| Yellow perch | **7.6** | A | Oct 10 — fall harbor schooling |
| Lake whitefish | — | C | Research hold |
| Round whitefish | — | D | Exclude |
| Channel catfish | — | C | Research hold |
| Largemouth bass | — | C | Research hold |
| Atlantic salmon | **7.2** | B | Apr 25 — winter/spring nearshore |
| Northern pike | **5.5** | A | May 1 — spring harbor |
| Burbot | — | D | Exclude |
| White perch | — | D | Exclude |
| White bass | — | D | Exclude |
| Bluegill | — | C | Research hold |

Alpena's highest-confidence opportunities are warmwater and coolwater species. Yellow perch is 7.6 after the due-diligence review. Ten historical surveyed years are positive and several fall estimates are exceptional, but the last positive year is 2015 and the prime October stratum is zero in 2018, 2020, and 2021. The current agency listing keeps the fishery numeric and strong, while the modern record no longer supports ranking it above Chicago. Smallmouth at 8.0 exceeds Grand Haven 7.0. Walleye at 7.4 exceeds Oscoda 6.8. Pike at 5.5 sits modestly above Ludington 5.2.

Chinook and brown trout receive limited 5.4 values from positive port years plus the exact-harbor agency list. Drum receives 4.2: three positive years establish recurrence, but the low total and omission from the current agency harbor list constrain magnitude.

Atlantic salmon, coho, steelhead, and lake trout are now numeric Grade B species. Michigan DNR lists all four for Alpena Harbor; annual 2023–26 Thunder Bay River stocking establishes current Atlantic, coho, and steelhead support; DNR records also confirm recent Atlantic catches in Thunder Bay and the river. The conservative peaks account for zero modern Pier/Dock rows and the difference between connected-river evidence and exact breakwall magnitude. Lake whitefish remains Grade C because the exact-harbor list conflicts with six explicit-zero port years and no equivalent current evidence closes that gap. Channel catfish and largemouth have two sparse positive years; bluegill has one.

## Cross-city scale checks

The new peaks were ranked against every relevant established or prior private same-species calibration.

- **Chinook:** Whitehall 9.3 is below Sheboygan 9.4; Michigan City 7.4 matches Kenosha and remains below Waukegan 7.6; Chicago 7.0 is above revised Muskegon 6.5; Alpena 5.4 is near Oscoda 5.5.
- **Coho:** Michigan City 8.7 sits immediately below Waukegan/Grand Haven 8.8; Chicago 8.2 matches the strong established 8.2 group; Whitehall 7.4 is above Manitowoc 7.2; Alpena 6.5 matches Oscoda; Muskegon 6.4 matches Port Sanilac.
- **Steelhead:** Whitehall 8.7 and Michigan City 8.5 sit between Grand Haven 9.2 and Ludington 8.1; Muskegon 8.0 is immediately below Ludington; Chicago 6.5 lies between Port Washington 6.6 and Alpena/Milwaukee 5.8.
- **Brown trout:** Whitehall 7.7 is between Sheboygan 7.8 and Algoma/Grand Haven/Ludington 7.6; Muskegon 7.0 matches Waukegan; Chicago 6.2 and Michigan City 6.0 stay below Kenosha 6.4; Alpena 5.4 is above Port Sanilac 4.8.
- **Lake trout:** Chicago 5.4 sits between Port Sanilac 5.5 and Harbor Beach 5.3. Alpena 5.0 sits between Harbor Beach 5.3 and Oscoda 4.6 and is legally unavailable October through December.
- **Atlantic salmon:** Alpena 7.2 sits below Oscoda 8.4 and above Port Sanilac 6.3.
- **Freshwater drum:** Muskegon 6.2 is below Grand Haven 7.2; Chicago and Whitehall are 5.6; Alpena 4.2 remains just above Oscoda 3.9.
- **Yellow perch:** Chicago 8.4 is the leading current new anchor. Whitehall 8.0 remains above Alpena/Ludington 7.6. Michigan City 6.2 reflects the agency's “limited” shore description, while observed modern weakness places Muskegon at 5.2 between Port Sanilac 5.0 and Kenosha 5.4.
- **Lake whitefish:** Muskegon, Whitehall, and Grand Haven are all 4.0 lawful-fishing anchors. Historical estimates affected by snagging do not create an excellent legal-bite ceiling.
- **Warmwater species:** Alpena smallmouth 8.0 exceeds Grand Haven 7.0; Muskegon 6.6 and Chicago 6.5 follow; Whitehall largemouth 7.1 remains below Grand Haven 7.4; Alpena walleye 7.4 exceeds Oscoda 6.8; new pike values remain within or just above the established 4.5-5.2 band.

The complete ordering is in `cross-city-rankings.csv`, and every numeric pair's adjacent stronger/weaker placement is in `calibration-anchors.json`.

## Full-year audit

Every numeric pair was evaluated for all 365 dates at `T = 0`, `0.5`, and `1`.

The generator verified:

```text
1 ≤ score(T=0) ≤ score(T=0.5) ≤ score(T=1)
  ≤ seasonalPotential ≤ pair peak F ≤ 10
```

Audit result:

| Check | Result |
|---|---:|
| Numeric pairs | 55 |
| Seasonal modes | 83 |
| Daily rows | 20,075 |
| Open-date score evaluations | 59,811 |
| Formula-bound comparisons | 99,685 |
| Chicago perch closure dates | 46 |
| Alpena lake-trout closure dates | 92 |
| Maximum Dec. 31 / Jan. 1 seam delta | 0.000 |
| Invalid values or invariant failures | 0 |

The daily file records winning mode, mode `F`, `A`, seasonal potential, all three thermal-fit scores, and legal status. Prime peaks, shoulders, off-season floors, closure dates, and year seams are summarized in `score-summary.csv` and `monthly-checkpoints.csv`.

The audit uses explicit thermal suitability inputs of 0, 0.5, and 1. It inherits existing species thermal-curve IDs for later integration but does not approve a city temperature source. NOAA model-domain and wet-cell validation belongs to Pass 3, especially for Lake Huron at Alpena.

## Regulation and access handling

- Chicago yellow perch is unavailable May 1-June 15. Closed rows contain no biological score.
- Michigan's November single-point-hook rules are method restrictions, not closures. They are retained as report metadata and do not reduce biological `F`.
- The uncertain Muskegon north-walkway reopening does not reduce fishery strength. Pass 3 must verify access before any report recommends that segment.
- Whitehall's report still requires the Medbery Park ownership/location disclosure.
- Weather, waves, ice, construction, posted security restrictions, and temporary closures remain live report gates.

## Private boundary

Pass 2 changed only research documentation. It did not:

- add the five cities to the runtime catalog;
- edit the public manifest or backend report projection;
- create database migrations or forecast archives;
- approve a NOAA model source or wet cell;
- deploy anything;
- build or update an app;
- make any city or species public.

The package is ready for owner review and a separate Pass 3 command.
