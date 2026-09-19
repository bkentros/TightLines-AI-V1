# Pass 2 cross-city due-diligence review

**Reviewed:** 2026-09-19

**Scope:** all 95 city/species cells, all 55 numeric peaks, and every same-species established or prior-private calibration

**Result:** 9 numeric revisions, 4 Alpena species promoted from hold, 42 original numeric peaks retained, and 40 cells remain unscored

## Method

Each numeric pair was checked against:

1. the complete same-species ranking in `cross-city-rankings.csv`;
2. exact pier, dock, breakwall, harbor-edge, or port-mode evidence;
3. direct qualitative magnitude language such as good, limited, few, or common;
4. full, modern, and recent Michigan Pier/Dock records where available;
5. whether a city's reputation belongs to the covered shore structure rather than a boat, charter, river, or broader bay fishery;
6. the rule that missing precision affects evidence grade and does not numerically discount an otherwise established fishery.

The row-by-row result is in `due-diligence-review.csv`. A retained value means the evidence and adjacent all-city anchors still support its placement. It does not mean the decimal is a measured catch probability.

## Revisions

| City | Species | Previous | Audited | Reason |
|---|---|---:|---:|---|
| Chicago | Lake trout | 4.8 | **5.4** | Repeated recent specialist and expert reports describe an increasingly targeted, decent-to-good winter shore fishery and document limit catches. The old value improperly used missing standardized effort as part of the magnitude decision. The revised value sits between Harbor Beach 5.3 and Port Sanilac 5.5. |
| Chicago | Smallmouth bass | 6.0 | **6.5** | Repeated current Montrose reports call the fishing good, and Illinois identifies the growing Chicago shore fishery. The revised value sits between Whitehall 6.3 and Muskegon 6.6. |
| Michigan City | Chinook salmon | 7.7 | **7.4** | Indiana DNR calls Chinook a “some pier” opportunity, and the current shore report says a few fish. That direct magnitude language supports Kenosha's 7.4 tier rather than placement above Waukegan. |
| Michigan City | Yellow perch | 6.8 | **6.2** | Indiana DNR describes shore availability as limited. The fishery remains real and recurring, but the old strong-band placement was too high. |
| Michigan City | Bluegill | 4.8 | **5.2** | Indiana DNR describes panfish as common at Washington Park marina. The old value was modestly suppressed; the revised value matches Whitehall. |
| Muskegon | Chinook salmon | 7.7 | **6.5** | Historical recurrence is strong, but the modern series contains 47 fish and the recent series one fish, with four surveyed fall zeros. The old Grand Haven/Waukegan placement overstated the observed current pier fishery. |
| Muskegon | Lake whitefish | 8.8 | **4.0** | Michigan DNR says much of the harvest in the regulated ports came from snagged fish. Historical totals therefore cannot set lawful bite strength. The intentional November opportunity remains numeric at the ordinary Grand Haven lawful-fishing anchor. |
| Whitehall | Lake whitefish | 7.8 | **4.0** | The agency and November rule establish an intentional fishery, but the reviewed port series has no positive catch row and the snagging contamination prevents an excellent lawful-bite inference. |
| Alpena | Yellow perch | 8.8 | **7.6** | Historical fall magnitude is exceptional, but the last positive surveyed year is 2015 and October is zero in 2018, 2020, and 2021. The fishery remains strong and agency-listed, but no longer ranks above current Chicago evidence. |

## Alpena salmonid correction

The original hold decision gave too much weight to six zero Pier/Dock survey years and did not incorporate the current managed fishery. Michigan DNR lists all four species for Alpena Harbor. Its stocking database records annual 2023–26 Thunder Bay River releases of Atlantic salmon, coho, and steelhead. The DNR Atlantic salmon page confirms the Thunder Bay program and its spring nearshore and October–December return windows, while the 2024 Master Angler report records Atlantic salmon in both Thunder Bay and the river.

All four species are now Grade B private numeric calibrations:

- **Atlantic salmon 7.2:** below Oscoda 8.4 and above Port Sanilac 6.3, with separate winter/spring and fall-return modes.
- **Coho salmon 6.5:** equal to Oscoda because direct Alpena stocking is strong but exact breakwall magnitude remains unmeasured.
- **Steelhead 5.8:** below Oscoda 7.4 because annual Thunder Bay releases are materially smaller than the Au Sable program and the modern pier rows remain zero.
- **Lake trout 5.0:** between Oscoda 4.6 and Harbor Beach 5.3, supported by the current harbor/season listing and the positive April 2007 pier record. The model suppresses scores during the MH-2 October 1–December 31 closure.

Lake whitefish remains a Grade C hold because the current harbor list conflicts with six explicit-zero Pier/Dock years and no equivalent current stocking or catch evidence closes the magnitude gap.

## High scores retained after comparison

- **Whitehall Chinook 9.3:** retained because 16 of 17 surveyed Pier/Dock years are positive and measured fall magnitude is elite. The score is supported by exact mode data even though Whitehall has less general name recognition than Frankfort or Manistee.
- **Whitehall steelhead 8.7 and brown trout 7.7:** retained because every reviewed port year is positive and the measured seasonal magnitude supports their adjacent established anchors.
- **Michigan City coho 8.7 and steelhead 8.5:** retained because Indiana DNR documents exact pier modes: the named spring coho fishery, summer Skamania, and late-fall/winter steelhead. Their renown belongs to shore and pier fishing rather than only Trail Creek.
- **Chicago perch 8.4:** retained because the direct Montrose series and the measured Navy Pier share support excellent prime windows despite the broader long-term perch decline.
- **Alpena smallmouth 8.0 and walleye 7.4:** retained because high port Pier/Dock magnitude and recurring positive years support the covered mode. General Thunder Bay boat reputation was not needed to create either value.
- **Muskegon steelhead 8.0, brown trout 7.0, smallmouth 6.6, drum 6.2, and walleye 6.4:** retained because modern and recent direct Pier/Dock records support their relative placements.

## Validation

After the revisions, the generator rebuilt all 55 numeric pairs and 83 modes across all 365 dates at `T = 0`, `0.5`, and `1`:

- 20,075 daily rows;
- 59,811 open-date score evaluations;
- 99,685 formula-bound comparisons;
- 46 Chicago perch and 92 Alpena lake-trout closure dates with no biological score;
- zero invariant, closure, or December/January seam failures.

The revised package remains private owner review. Public visibility remains disabled.
