# Milwaukee and Sheboygan River Run Timing Audit

**Audit date:** 2026-08-26\
**Decision state:** owner review; no runtime dates changed by this audit\
**Rivers:** Milwaukee and Sheboygan\
**Species:** Chinook, Coho, fall Steelhead, lake-run Seeforellen Brown Trout

## 1. What the dates mean

The product calendar estimates fish already in the river, not offshore harvest,
spawning readiness alone, or the best bite. The required boundaries mean:

- **Staging:** meaningful near-mouth/harbor staging, with only rare river fish.
- **Beginning:** repeatable but still lower-river-weighted entry.
- **Building:** expanding abundance and reach occupation.
- **Peak:** the broad highest-abundance portion of the modeled river run.
- **Tapering:** meaningful fish remain, but the seasonal maximum has passed.
- **Ending:** a late tail; for Steelhead and Brown Trout this is nonterminal.

Conditions can advance, delay, or compress a particular year. These are typical
calendar priors, not promises for a specific date.

## 2. Evidence hierarchy and limitations

1. Current Wisconsin DNR weir and brood-collection records are the strongest
   dated regional evidence.
2. Current DNR strain biology and spawning reports establish species lifecycle
   bounds.
3. DNR's Milwaukee-area fall calendar and named-river occurrence establish local
   seasonality but are older and month-level.
4. Credible local observations corroborate timing but do not replace counts.

Neither Milwaukee nor Sheboygan has a complete adult-return counter. Root River,
Strawberry Creek, and Kewaunee data are regional comparators whose timing is
affected by weir operating dates, processing batches, pumping, flow, and
temperature. Exact day-level dates below are therefore calibrated centers inside
broader evidence-supported windows.

## 3. Cross-year timing findings

### Chinook

At Strawberry Creek, the weighted median processing date was October 9 in 2023,
October 10 in 2024, and October 9 in 2025. Peak individual processing dates
varied from October 2 to October 14. The 2024 and 2025 Root reports
independently say large salmon movements occurred in October or early-to-mid
October despite warm, low water. DNR warns that these are processed samples
rather than absolute return counts.

Conclusion: Milwaukee's September 20 and Sheboygan's September 25 nominal peaks
are too early for a modern Wisconsin river-abundance prior. Late September
remains the leading edge of Peak, but the nominal peak should move into early
October.

### Coho

DNR describes Wisconsin tributary entry from September through December. Its
Milwaukee-area calendar places peak opportunity in October, and
Milwaukee-specific public reporting describes October-November as the best
viewing period. Root River recorded very large Coho movements in October 2024
and early-to-mid October 2025. A Sheboygan River live-release record on October
16, 2022 is corroborative only, not a distribution sample.

Conclusion: the existing October 10-31 Peak band with an October 20 center is
defensible for both rivers. It preserves rare September entry without calling
September the main run.

### Fall Steelhead

Steelhead are a mixed-strain fishery rather than one simple run. DNR places
useful Skamania fishing from mid-September, Chambers Creek's strongest fall
fishing in mid-November-December, and Ganaraska pulses in November-December and
again in spring. Recent coded-wire-tag evidence confirms returning Skamania from
the 2022 southern-Wisconsin stocking cohort, including fish stocked in the
Sheboygan, Milwaukee, and Root rivers.

Conclusion: Milwaukee's accepted strong early-fall fishery supports a September
25 nominal peak plus a long autumn shoulder. Sheboygan's lower 5/10 composite is
better represented by an early Skamania shoulder that builds toward the stronger
November 15 mixed-strain peak. A single peak cannot imply that all strains move
at once, and completion ends only the fall-entry model.

### Lake-run Brown Trout

Wisconsin now stocks Seeforellen. DNR states that tributary movement begins in
October, the spawning run generally occurs in November-December, and egg
collection occurs from mid-November into December. In 2024 DNR sampled Milwaukee
River and harbor adults on November 5 and 14; those fish were processed for
spawning from November 20 through December 17. Collection and egg-readiness
dates measure different phases.

Conclusion: the existing November 15-December 10 Peak band and November 25
center fit both rivers. The curve must retain fish after spawning because
survivors can hold in the river or return lakeward.

## 4. Recommended calendars for owner decision

Only the Chinook rows differ from current runtime configuration.

| River / species       | Staging   | Beginning     | Building      | Peak band     | Nominal peak | Tapering      | Ending / model completion                           | Decision                        |
| --------------------- | --------- | ------------- | ------------- | ------------- | ------------ | ------------- | --------------------------------------------------- | ------------------------------- |
| Milwaukee Chinook     | Aug 15-24 | Aug 25-Sep 7  | Sep 8-27      | Sep 28-Oct 18 | **Oct 8**    | Oct 19-31     | Nov 1-20; late copy to Nov 30                       | shift later                     |
| Sheboygan Chinook     | Aug 15-24 | Aug 25-Sep 10 | Sep 11-30     | Oct 1-20      | **Oct 10**   | Oct 21-Nov 2  | Nov 3-20; late copy to Nov 30                       | shift later                     |
| Milwaukee Coho        | Sep 1-9   | Sep 10-20     | Sep 21-Oct 9  | Oct 10-31     | **Oct 20**   | Nov 1-20      | Nov 21-Dec 10; late copy to Dec 20                  | retain                          |
| Sheboygan Coho        | Sep 1-9   | Sep 10-20     | Sep 21-Oct 9  | Oct 10-31     | **Oct 20**   | Nov 1-20      | Nov 21-Dec 10; late copy to Dec 20                  | retain                          |
| Milwaukee Steelhead   | Aug 15-31 | Sep 1-15      | Sep 16-Oct 7  | Oct 8-25      | **Oct 8**    | Oct 26-Nov 20 | ending Nov 21-Dec 15; copy to Jan 15 | owner/local peak override |
| Sheboygan Steelhead   | Aug 15-31 | Sep 1-10      | Sep 11-30     | Oct 1-15      | **Oct 1**    | Oct 16-Nov 15 | ending Nov 16-Dec 15; copy to Jan 31 | owner/local peak override |
| Milwaukee Brown Trout | Sep 20-30 | Oct 1-15      | Oct 16-Nov 14 | Nov 15-Dec 10 | **Nov 25**   | Dec 11-20     | nonterminal tail Dec 21-Jan 31; copy to Feb 15      | retain                          |
| Sheboygan Brown Trout | Sep 20-30 | Oct 1-15      | Oct 16-Nov 14 | Nov 15-Dec 10 | **Nov 25**   | Dec 11-20     | nonterminal tail Dec 21-Jan 31; copy to Feb 15      | retain                          |

The one- or two-day difference between the proposed Milwaukee and Sheboygan
Chinook centers is a calibration choice inside the same early-October evidence
window, not a claim that the available data can distinguish the rivers that
precisely.

## 5. Configuration consequences after approval

- Shift both Chinook calendars, presence anchors, lifecycle boundaries, replay
  date groupings, generated fixtures, packets, and tests together.
- Re-run Milwaukee Activity because its lifecycle adjustment uses Chinook stage
  boundaries; do not assume the old accepted replay remains valid after a date
  shift.
- Keep Coho and Brown Trout calendars unchanged unless the owner
  supplies stronger river-specific dated evidence.
- Keep both rivers hidden and do not begin Sheboygan Gate 4B until the timing
  decision and Milwaukee replay regression are accepted.

## 6. Evidence ledger

| ID    | Source                                                                                                                                                            | Timing use                                                                                                        | Limitation                                                     |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| T-001 | Wisconsin DNR, [2025 Strawberry Creek Weir Summary](https://dnr.wisconsin.gov/sites/default/files/topic/documents/LakeMichiganStrawberryCreekWeir2025Summary.pdf) | Oct. 2-23 Chinook processing; weighted median Oct. 9                                                              | pumped, batch-processed northern comparator                    |
| T-002 | Wisconsin DNR, [2024 Lake Michigan management report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LMGLFC2025.pdf)                                 | 2024 Strawberry daily Chinook counts; Root October salmon movement; Milwaukee Brown collection and spawning dates | multiple facilities; counts not absolute returns               |
| T-003 | Wisconsin DNR, [2023 Strawberry Creek Weir Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/StrawberryCreekWeirSummary2023.pdf)               | Oct. 2-19 counts; weighted median Oct. 9                                                                          | report table mislabels rows as 2022; narrative identifies 2023 |
| T-004 | Wisconsin DNR, [Fall 2025 Root River Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSummaryFall2025.pdf)                        | large Chinook/Coho movement early-to-mid October                                                                  | southern comparator; no daily species table                    |
| T-005 | Wisconsin DNR, [Fall 2023 Root River Summary](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSummaryFall2023.pdf)                        | Sep. 25-Nov. 13 operating envelope                                                                                | southern comparator; no daily species table                    |
| T-006 | Wisconsin DNR, [Milwaukee fall-fishing guide](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_closetohome_letter.pdf)                              | Milwaukee month peaks: Chinook Sep., Coho Oct., Steelhead Sep., Brown Dec.                                        | older, month-level, combines shore/harbor/river opportunity    |
| T-007 | Wisconsin DNR, [Steelhead strain guide](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Pubs_steelhead.pdf)                                           | Skamania mid-Sep.; Chambers mid-Nov.-Dec.; Ganaraska Nov.-Dec. pulses                                             | regional strain biology                                        |
| T-008 | Wisconsin DNR, [2024 Root River facility report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_RootRiverSteelheadFacilityFall2024Spring2025.pdf) | recent southern-Wisconsin Skamania return and stocking-origin context                                             | Root capture sample; mixed origin                              |
| T-009 | Wisconsin DNR, [Lake Michigan trout and salmon Q&A](https://dnr.wisconsin.gov/topic/Fishing/questions/lakemichtroutsalmon.html)                                   | Seeforellen November-December spawning run                                                                        | statewide Lake Michigan context                                |
| T-010 | Wisconsin DNR, [2026 Fishing Report](https://dnr.wisconsin.gov/topic/Fishing/outreach/wifishingreport)                                                            | Brown October entry; November-early-December ripeness                                                             | regional, not a dated river count                              |
| T-011 | Wisconsin DNR, [live-release records](https://dnr.wisconsin.gov/topic/Fishing/recordfish/LiveReleaseRecords)                                                      | Sheboygan Chinook Oct. 3 and Coho Oct. 16 occurrence                                                              | isolated catches, not run distributions                        |
| T-012 | Smithsonian, [Milwaukee's Secret Salmon Runs](https://www.smithsonianmag.com/travel/milwaukees-secret-salmon-runs-180972913/)                                     | Milwaukee Chinook Sep.-Oct.; Coho Oct.-Nov.; quotes local/DNR practitioners                                       | qualitative public reporting                                   |
