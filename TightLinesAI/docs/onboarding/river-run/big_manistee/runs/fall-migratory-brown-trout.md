# Big Manistee Fall Migratory Brown Trout River Run Profile

**River ID:** `big_manistee` **Species:** `lake_run_brown_trout`
**Status:** `owner_approved_static_release_ready` **Approval:** 2026-08-29
**Production deployment:** `not_performed`

## 0. Decision and evidence boundary

The Big Manistee supports documented Brown Trout fishing below Tippy Dam and
Michigan's 41.45-pound state-record Brown Trout. Michigan DNR describes
lake-run Browns entering tributaries in late summer and early fall and spawning
in September and October. The connected Manistee system also has a recurring,
but comparatively small, documented migratory-Brown component.

Those facts support a real product opportunity and exceptional fish potential,
but they do not establish Chinook-scale migratory abundance. Resident and
migratory Browns overlap, creel records do not reliably distinguish them, and
one record fish cannot set an abundance rating.

**Approved decision:** 5/10, sectional, public static-catalog profile. The run is
merged into the canonical Big Manistee configuration under
`2026-08-29-big-manistee-brown-release.3`; no backend deployment, app build, or
store submission was performed during approval reconciliation.

## 1. Calendar and Fish In River

| Boundary | Date |
| --- | --- |
| Pre-run / staging / river start | Aug. 15 / Aug. 25 / Sept. 5 |
| Beginning end / established / broad build | Sept. 15 / Sept. 16 / Sept. 23 |
| Peak start / reference peak / peak end | Sept. 25 / Oct. 1 / Oct. 15 |
| Taper end / model end / late context | Oct. 31 / Nov. 30 / Dec. 1-15 |

The October 1 anchor scores 50/100. Fish In River is historical seasonal
presence relative to this river's Brown ceiling, not a count, a live report, or
proof that fish are distributed equally across all sections.

After December 15 the fall model is unavailable, not zero. Surviving Browns may
remain in river holding water or return lakeward after spawning; the product
does not force either behavior.

## 2. Corridor and copy

Stage guidance progresses from Manistee Lake, harbor, river entrance, and the
Lower river into the Middle and Upper river below Tippy Dam. Tippy Dam remains
the impassable upstream endpoint. Copy must never recommend water above it.

The Upper river near Tippy is one part of the accepted corridor, not a fourth
public section. During the spawning period, copy emphasizes avoiding actively
spawning fish and complying with current signs and regulations.

## 3. Live primitives

| Primitive | Candidate behavior |
| --- | --- |
| Migration Stage | species-specific repeat-spawner progression |
| Fish In River | 5/10 sectional curve, Oct. 1 maximum |
| Activity | observed Wellston/Tippy tailwater; temperature-led |
| Fishability | accepted Wellston presentation-shape bands |
| Push | accepted Wellston hydraulics with Brown-specific temperature response |
| Migration Timing | accepted same-gauge historical coverage, pending replay/review |

Activity weights measured water temperature 45%, effective light 25%, river
behavior 20%, and restrained weather context 10%. Its favorable temperature
band is 44-58°F, with a declining warm shoulder above 58°F, a strong warm
constraint at 64°F, and a barrier at 70°F. The read applies to the measured
Wellston/Tippy tailwater; it is not a direct measurement of the Middle or Lower
river.

Brown Activity receives no Chinook/Coho mortality ramp, taper penalty, ending
ceiling, or automatic post-spawn departure. Identical observed conditions
retain identical response potential across Peak, Tapering, and Ending.

## 4. Sources

- [Michigan DNR Brown Trout species profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/brown-trout)
- [Michigan DNR Tippy Dam General Management Plan](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/PRD/MgtPlans-archive/TippyDam_GMP.pdf)
- [Michigan DNR state-record fish table](https://www.michigan.gov/dnr/things-to-do/fishing/master-angler/state-record)
- [Michigan DNR Little Manistee River status report](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Status/folder1/2005-8-Little-Manistee-River.pdf)
- [Michigan DNR 1984 Little Manistee weir periodicity report](https://www.midnr.com/publications/pdfs/DNRFishLibrary/TechnicalReports/TR86-1.pdf)
- [USGS Wellston station 04125550](https://waterdata.usgs.gov/nwis/dv?site_no=04125550)

The corrected-calendar 2007-2025 Activity replay passed with 1,851/1,881 usable
days, a 64.65 overall mean, and zero invariants. Activity becomes strongest in
the cooler Tapering/Ending calendar even though Fish In River peaks October 1;
that separation is intentional because Activity measures response conditions
for a fish already present, not migration strength. Exact calendar shoulders,
temperature thresholds, and the 5/10 ceiling remain conservative product
calibration accepted by the owner for the static release candidate.
