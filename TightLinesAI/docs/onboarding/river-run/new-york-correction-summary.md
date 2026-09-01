# New York River Run correction summary

Prepared 2026-08-31 for hidden owner review. This summary does not authorize
public release or deployment.

## Corrected gauge decisions

| River | Gauge Read | Historical comparison | Activity use | Fishing Shape |
| --- | --- | --- | --- | --- |
| Salmon River | USGS 04250200 Pineville flow and height; represented as regulated Pineville/mainstem context, not estuary, tributary, or reservoir conditions | USGS provides a 33-year same-date flow comparison. No continuous Pineville water-temperature series exists, so no temperature norm is shown | Excluded; Activity remains Limited weather-only | Unavailable: no accepted release-aware absolute workability bands and replay |
| Oak Orchard Creek | USGS 04220045 Shelby flow, height, and measured temperature; labeled upstream context across the Erie Canal crossing, Waterport Reservoir, and Waterport Dam | USGS same-date flow context is available; current measured temperature is available, but the USGS statistics service did not return a qualifying temperature norm | Excluded; Activity remains Limited weather-only | Unavailable: the gauge does not represent the Point Breeze-to-Waterport fishing corridor |
| Lower Genesee River | USGS 04231600 Ford Street flow, height, and measured temperature; labeled upstream-basin context above High, Middle, and Lower Falls | USGS same-date flow and temperature context is available at Ford Street only; the Aug. 31 probe returned 121 flow years and 15 temperature years | Excluded; Activity remains Limited weather-only | Unavailable: three falls, hydropower/urban routing, and reach mismatch prevent corridor calibration |

The discontinued USGS 04232000 Rochester station is no longer included in the
live gauge set. A live-provider probe at 2026-08-31 23:00 UTC returned fresh
readings for every configured source: Pineville 236 CFS/5.36 ft; Shelby 64.2
CFS/6.55 ft/66.2°F; Ford Street 694 CFS/12.83 ft/70.7°F.

## Salmon River temperature finding

USGS lists only continuous discharge and gauge height at Pineville. Archive
queries returned no continuous parameter 00010 series. Occasional historical
field measurements and the one-summer 1986 temperature study do not satisfy the
onboarding requirement for a multi-year exact-date fall average. The product
therefore fails closed instead of manufacturing a historical temperature line.

## Corrected Spot Finder inventory

| River | Audited inventory | Deliberate exclusions |
| --- | --- | --- |
| Salmon River | 19 NYSDEC-named mainstem accesses: 7 lower, 5 middle, 7 upper; north/south accesses remain distinct | Orwell Brook and Trout Brook are tributary locations, not mainstem recommendations; fee-only Douglaston access is not represented as public |
| Oak Orchard Creek | 6 records: distinct County and State marine parks, river piers, complete signed-but-unnamed PFR parking/footpath network, Park Avenue Fishing Trail, and Waterport Dam PFR | No invented names for map-only PFR markers; date-limited paid St. Mary's Archers Club parking is withheld because the current contract cannot enforce its access dates |
| Lower Genesee River | 3 records: Ontario Beach Park/Charlotte Pier, Port of Rochester public launch, and Seth Green–Lower Falls PFA | General trails/overlooks remain omitted; Summerville/east-harbor access remains withheld pending unambiguous current post-construction access confirmation |

Every access record links to NYSDEC, the responsible public facility operator,
or a county authority and includes a source locator a customer can use. The
live source audit covers all 161 River Run access records and rejects dead pages
or sources outside the approved authority list.

## Recommendation and safety corrections

- Spot Finder recommendations still come only from the engine-owned Seasonal
  Zone; they do not use gauge values, Activity, or an access popularity rank.
- Every active calendar day for all 11 New York runs is regression-tested for
  exact foundation-reach overlap, downstream-to-upstream order, and
  fail-closed behavior.
- Nearby measurements can now be useful without being mislabeled: Gauge Read
  displays them, while Activity and Fishing Shape receive zero credit.
- Access records remain orientation, not promises of parking, legal entry,
  safe wading, open facilities, or fish at a location. Current regulations and
  posted signs control.

## Review and release status

Final correction-gate results: all 11 fixed 2007-2025 Activity replays have
100% coverage and zero coded invariants; 405 engine tests and 58 endpoint tests
pass; 1,425 owner-review fixtures are current; all three onboarding packets
validate; UI, visual, TypeScript, and 161-entry live source audits pass.

The three rivers and all 11 runs remain hidden with `publicAudit.isEnabled =
false`. No public registry promotion, deployment, production smoke test,
commit, or push has been performed. Owner review is the next gate; public
release and deployment require a separate explicit authorization after any
owner corrections are accepted.
