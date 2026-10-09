# PierCast salmonid accuracy audit — Batch 3

Reviewed: 2026-10-09

Runtime status: **1.17 app branch documentation only; no Edge Function,
database, map-data, calibration or live-app change**

## Scope

The read-only audit covered Sheboygan, Port Washington, Milwaukee, Racine,
Kenosha, Two Rivers, Kewaunee, Algoma, Manitowoc, Waukegan, Chicago and
Michigan City across the full annual calendar.

The core review covered Chinook salmon, coho salmon, steelhead, brown trout and
Atlantic salmon: 60 city/species cells, comprising 48 numeric pairings and 12
Atlantic-salmon research holds. The separately approved all-city lake-trout
layer adds 12 reviewed cells: six numeric calibrations and six research holds.
In total, Batch 3 reconciles 72 salmonid cells, retaining all 54 numeric
calibrations and all 18 research holds.

## Decision

Retain every Batch 3 fishery-strength ceiling and seasonal curve. No new
runtime override is warranted.

The retained ordering preserves the supported local differences:

- Sheboygan, Kewaunee and Algoma remain the strongest Wisconsin Chinook ports.
- Waukegan, Michigan City and the southern Wisconsin ports retain their major
  spring coho opportunity.
- Michigan City's summer Skamania mode remains the strongest Batch 3 steelhead
  ceiling.
- Brown trout remain centered on cold-season and spring nearshore access.
- Atlantic salmon remain unscored in all 12 cities. A research hold is not a
  zero or a Poor rating and does not enter standings.

The approved lake-trout layer remains unchanged. Chicago, Racine, Milwaukee,
Port Washington, Sheboygan and Kewaunee have numeric calibrations. Michigan
City, Waukegan, Kenosha, Manitowoc, Two Rivers and Algoma remain research holds
because the available evidence does not separate repeatable catch at the
covered structure from pooled-county, regional shoreline or offshore presence.

## Michigan City structure boundary

Indiana DNR documents January-March Chinook opportunity at the NIPSCO Michigan
City warmwater discharge. PierCast's Michigan City report covers Washington
Park East Pier and its immediate basin edge and explicitly excludes NIPSCO.
The winter-discharge evidence therefore must not be transferred into the East
Pier seasonal curve.

If the product later supports multiple structures within one municipality,
NIPSCO and the Port of Indiana should be modeled as separate locations with
their own evidence, temperature context and access information.

## Primary evidence

- [Wisconsin DNR Lake Michigan Outdoor Fishing Report](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport)
- [Wisconsin DNR 2024 Lake Michigan sport-harvest report](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/LM_LakeMichiganSportHarvestReport2024.pdf)
- [Wisconsin DNR rainbow trout fact sheet](https://dnr.wisconsin.gov/sites/default/files/topic/Fishing/Species_rainbowtrout.pdf)
- [Illinois DNR Lake Michigan fishery](https://ifishillinois.org/Waterbodies/Details/76b7c9b3-4594-4e64-8651-49b0afbdc657)
- [Illinois Natural History Survey 2024 Lake Michigan creel report](https://www.ideals.illinois.edu/items/137450/bitstreams/448334/data.pdf)
- [Indiana DNR Lake Michigan fishing guidance](https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/)
- [Indiana DNR shoreline and tributary guide](https://www.in.gov/dnr/fish-and-wildlife/files/fw-fishing_lake_michigan.pdf)

The audit also reconciles the preserved pair-level evidence and calendar files
under the all-city major-species, Wisconsin expansion and Chicago-Alpena review
directories.

## Product and release boundary

All scored Batch 3 species continue through the same 1.17 opportunity model:
city fishery strength, recurring seasonal availability and current temperature
fit determine exact ordering, while anglers see only the derived word label.
Access limitations remain informational unless an actual restriction blocks
targeting.

Because every calibration was retained, this audit adds no Batch 3 application
override. It does not modify the shared server calibration, response contract,
database, map data, Edge Functions or any live release.
