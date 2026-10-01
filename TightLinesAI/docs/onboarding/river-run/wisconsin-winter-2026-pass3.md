# Wisconsin Winter Steelhead and Brown Trout — Pass 3 acceptance

Status: accepted on 2026-09-28 for the next production build. Seasonal gating
keeps every pathway absent until its exact winter activation date.

## Accepted scope

| River     | Steelhead window and Activity                                                 | Brown Trout window and Activity                       | Winter geography                                                                                                             |
| --------- | ----------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Milwaukee | Dec. 16–Feb. 28; Estabrook measured water temperature + flow + daylight/cloud | Jan. 16–Feb. 28; Limited air-pattern + daylight/cloud | Steelhead: harbor, Urban Greenway, North Shore; prefer Urban Greenway/North Shore. Brown: harbor only.                       |
| Sheboygan | Dec. 16–Feb. 28; I-43 flow + Limited air-pattern + daylight/cloud             | Jan. 16–Feb. 28; Limited air-pattern + daylight/cloud | Steelhead: harbor/lower city, urban river, Kohler; prefer urban river/Kohler. Brown: harbor/lower city only.                 |
| Root      | Jan. 1–Feb. 28; Limited air-pattern + daylight/cloud                          | Jan. 16–Feb. 28; Limited air-pattern + daylight/cloud | Steelhead: harbor/downtown, city parks, Lincoln Park; prefer city parks/Lincoln Park. Brown: harbor/downtown only.           |
| Kewaunee  | Dec. 16–Feb. 28; County F measured water temperature + flow + daylight/cloud  | Dec. 23–Feb. 28; Limited air-pattern + daylight/cloud | Steelhead: lower river, Besadny reach, upper access; prefer Besadny/upper access. Brown: lower river only.                   |
| Manitowoc | Dec. 16–Feb. 28; Rapids flow + Limited air-pattern + daylight/cloud           | Jan. 1–Feb. 28; Limited air-pattern + daylight/cloud  | Steelhead: lower and middle river; prefer middle. Brown: lower river only. The seasonally closed upper corridor is excluded. |

Steelhead corridors remain fully viable throughout the accepted winter window.
“Preferred” reaches are starting orientation based on the best accepted
condition coverage and holding-water context; they do not imply the other listed
reaches are fishless. Brown Trout is deliberately restricted to the accepted
lower-river or harbor transition rather than presented as a river-wide upstream
winter run.

The Bois Brule remains excluded. Its supported downstream trout season closes
after November 15 and does not provide the continuous winter opportunity used by
these Lake Michigan tributary pathways.

## Primitive contract

- Migration Stage uses `Winter transition`, `Core winter hold`, and
  `Spring approach`. These are holding phases, not beginning/peak/ending claims
  for a new migration.
- Fish in River carries the species-specific fall endpoint into a slow,
  non-rising winter decline. It is opportunity context—not a count, activity
  estimate, or claim of equal distribution.
- Activity estimates feeding responsiveness for fish already present. Fresh
  measured water temperature leads only on Milwaukee and Kewaunee Steelhead. All
  air-temperature pathways are explicitly `Limited`, capped, and never label
  modeled air as water temperature.
- Stable mild conditions and gradual warming are favorable. Persistent cold,
  strong warming/cooling reversals, large daily swings, stale inputs, and
  blown-out hydraulics reduce or cap the score.
- Clouds rank legal daylight windows. The proxy ceiling is applied
  proportionally so the window ranking remains visible; rain receives no
  independent positive credit.
- Fishability is retained only where an accepted reach-representative hydraulic
  source exists. Push and Migration Timing are unavailable for all ten pathways
  because winter holding is not a fresh migratory event.
- Every profile ends February 28. March 1 is inactive and reserved for
  separately researched spring pathways; no Wisconsin spring pathway is inferred
  here.

## Replay and calibration result

Pass 3 replayed five winter starts (2021–2025) for all ten pathways using
official USGS daily observations where accepted and archived hourly weather. The
audit contains 3,090 expected pathway-days, 2,786 usable days (90.16% aggregate
coverage), at least 80% coverage per pathway, and 1,000 stratified review rows.
All mechanical, scope, copy, confidence, and ceiling invariants passed.

The historical medians were intentionally conservative: 19–22 for the air-proxy
pathways and 59 for the two measured-water pathways when old thermal history was
unavailable. Occasional Active days remain possible during stable mild periods
or favorable warmups. Deterministic counterfactuals confirm favorable conditions
beat persistent cold and gradual stable warmups beat large swings on every
pathway.

Milwaukee and Kewaunee water-temperature sensors began in 2026. The 2021–2025
replay does not invent older measured-water values or convert air to water. It
audits the available flow/light pathway, while deterministic measured-water
cases lock near-freezing, favorable-temperature, gradual-warming, large-swing,
and blown-out behavior. Current production scoring uses the fresh measured
sensor when available and fails safely when the required inputs are absent.

The machine-readable acceptance record is
`docs/audits/river-run-wisconsin-winter-pass3-review.json`; each pathway also
has a replay JSON and a 100-row review CSV.

## Authoritative evidence

- Wisconsin DNR,
  [Inland Trout and Salmon Regulations](https://dnr.wisconsin.gov/topic/Fishing/seasons/trout):
  continuous Lake Michigan tributary season and current water-specific
  regulation context.
- Wisconsin DNR,
  [Fall Fishing](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/fallfishing.html):
  tributary night restriction from September 15 through the first Saturday in
  May.
- Wisconsin DNR,
  [A Year of Fishing](https://dnr.wisconsin.gov/topic/Fishing/outreach/yearoffishing.html):
  winter Brown Trout opportunity at river mouths, harbors, and nearshore
  warm-water areas, contrasted with Steelhead moving into tributaries.
- Wisconsin DNR,
  [2026 Wisconsin Fishing Report](https://dnr.wisconsin.gov/topic/Fishing/outreach/wifishingreport):
  lake-run Brown Trout can remain in tributaries through winter.
- Wisconsin DNR,
  [Root River Report](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/rootriverreport):
  current seasonal facility operation and spring context; facility processing is
  not used as a live abundance proxy outside its scope.
- Wisconsin DNR,
  [Bois Brule Fishing](https://dnr.wisconsin.gov/topic/Fishing/lakesuperior/boisbrulefishing):
  downstream season closes November 15 and reopens on the last Saturday in
  March.
- USGS Water Data for the Nation: accepted reach-specific flow and
  water-temperature records.
- Open-Meteo Historical Weather API: archived hourly temperature, light, cloud,
  precipitation, and daylight fields used for replay only.

All posted refuges, facility boundaries, property restrictions, emergency
orders, ice conditions, and personal-safety decisions remain outside the score
and must be verified directly.
