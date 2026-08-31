# St. Joseph River Run Copy Foundation

> **Accepted river research record.** Geography, sources, barriers, species
> evidence, and owner decisions remain useful. Its six-primitive implementation
> sections are historical; future onboarding follows only
> `docs/river_run_onboarding.md`.

**Status:** Research-led geography and terminology owner-approved; bundled copy
renovation implemented; owner copy review pending **Version:**
`st-joseph-copy-foundation-v1` **Researched and approved:** 2026-08-11 **Applies
to:** St. Joseph Fall Chinook, Fall Coho, and Fall Steelhead

## 1. Normative public geography

Use these exact section names in River Run state copy:

1. **Lower river (St. Joseph harbor–Berrien Springs)**
2. **Middle river (Berrien Springs–Niles)**, including Buchanan
3. **Upper river (Niles–Twin Branch Dam)**, including South Bend and Mishawaka
4. **Lake Michigan, St. Joseph harbor, and river mouth** — staging context only;
   this does not prove river entry.

Twin Branch Dam is the absolute upstream endpoint. `Upper river` never means
water above Twin Branch. Stage names one primary section and, only when useful,
one comparison section with a clear reason. Routine state copy does not recite
the five individual passage facilities.

## 2. Barrier and passage inventory

Indiana DNR confirms five fish-passage facilities: Berrien Springs, Buchanan,
and Niles in Michigan; South Bend at Seitz Park and Mishawaka at Central Park in
Indiana. They allow salmon and Steelhead to move through the lower 63 river
miles. None is the run-ending barrier.

Twin Branch Dam in Mishawaka is the upstream endpoint. River Run must never
recommend water above it or imply passage. Current posted dam, ladder, access,
and jurisdictional restrictions control; state copy must not substitute for
them.

Primary sources:

- [Indiana DNR South Bend Fish Ladder](https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/south-bend-fish-ladder/)
- [Indiana DNR Bodine State Fish Hatchery](https://www.in.gov/dnr/fish-and-wildlife/fishing/indiana-fish-stocking/bodine-state-fish-hatchery)
- [Michigan DNR St. Joseph River Assessment](https://www.michigan.gov/dnr/-/media/Project/Websites/dnr/Documents/Fisheries/Mgt/SR24-St-Joesph-River-Assessment.pdf)

## 3. Source coverage

USGS 04101500 supplies discharge and measured water temperature at Niles. It
directly describes the Niles mainstem reach, not the harbor, the entire Lower or
Middle river, individual dam areas, South Bend, Mishawaka, or Twin Branch. Niles
point weather is supporting local context, not basin-wide rainfall.

| Primitive        | Public scope                                             |
| ---------------- | -------------------------------------------------------- |
| Migration Stage  | Whole accessible corridor; seasonal geography only       |
| Migration Timing | Season-to-date Niles evidence                            |
| Push             | Current fresh-movement support at Niles only             |
| Fishability      | Current presentation shape at Niles only                 |
| Activity         | Likely responsiveness at Niles only                      |
| Fish In River    | Whole-corridor seasonal estimate; not equal distribution |

## 4. Species truths and terminal behavior

### Chinook

- Limited, sectional fall opportunity; 30/100 river ceiling.
- Lower and Middle river are the primary plan. Upper-river opportunity remains
  selective even at Peak.
- Terminal state: `Fall run complete`, no score, then return when staging begins
  in mid-August.

### Coho

- Stronger, broad but uneven opportunity; 70/100 river ceiling.
- Coho can occupy all three sections after passage, but copy never implies equal
  distribution.
- Terminal state: `Fall run complete`, no score, then return when staging begins
  in late August.

### Steelhead

- Strong, broad fall-entry opportunity; 90/100 river ceiling.
- Indiana DNR documents stocked summer-run Skamania in this system. Public copy
  may explain that Skamania can already be inland before the later fall-entry
  build, but it must never identify an individual fish as Skamania from timing
  alone.
- Terminal state: `Fall entry complete` after December 22, no score, no winter
  recommendation, and return when monitoring resumes around September 10.

## 5. State-copy contract

### Migration Stage

- Before entry: harbor and mouth only; Lower river is an early check during
  staging.
- Beginning: Lower river primary; Middle river is conditional.
- Building: transition from Lower to Middle; Upper becomes an established-fish
  comparison without implying equal occupation.
- Peak: Middle primary; Upper is the established-fish comparison. Chinook
  remains selective.
- Tapering and Ending: established Middle or Upper holding water; Lower travel
  water only when Push supports fresh movement.
- Complete: no active starting section.

### Migration Timing

Ahead, Typical, Delayed, mixed, evaluating, insufficient, and complete states
use season-to-date Niles flow and measured temperature. Timing may move the
Stage plan by one approved section; it does not locate fish or prove passage.

### Push, Fishability, and Activity

Each is Niles-only. Why This Read uses no more than three short points. Push
describes fresh-movement support, Fishability describes presentation shape, and
Activity ranks likely responsiveness and time blocks. None may be carried
through the corridor as a direct measurement.

### Fish In River

The internal score remains exact. Public intermediate values are rounded to the
nearest five without changing state. The estimate is relative to the
species-specific St. Joseph ceiling and applies to the accessible corridor as a
whole, not equally to each section.

## 6. Copy QA prohibitions

Reject public copy containing:

- another river's geography;
- routine city-by-city or ladder-by-ladder itineraries instead of the three
  approved sections;
- a recommendation above Twin Branch or an implication of passage;
- a Niles measurement applied directly to another section;
- more than three Why points;
- a strongest Activity block without at least a three-point lead;
- Steelhead winter-holding or winter-experience guidance;
- an inferred Skamania identity based only on date or one early fish;
- internal approval, configuration, threshold, or model-process language;
- a score after `Fall run complete` or `Fall entry complete`.

## 7. Implementation acceptance

The bundled renovation uses copy version `river-run-copy-v34` across all three
species and six primitives. The dedicated audit covers 236 production-derived
scenarios and enforces approved geography, Twin Branch passage, Niles source
scope, copy length, three-point Why copy, Activity-leader separation,
cross-river leakage, internal-language leakage, and terminal behavior. It
changes public copy structure, section naming, scope explanations, and terminal
behavior. It does not change seasonal dates, presence ceilings, hydraulic
thresholds, Fishability bands, Push scoring, Activity weights, or source
identities. The Steelhead winter handoff was removed because the winter
experience is not yet available.

## 8. Fish Counts capability

The official Indiana DNR South Bend Fish Ladder dashboard is accepted as a
`ladder_passage` source for Chinook, Coho, and Steelhead. Each report request
checks the authoritative page and forced-refresh Tableau export with cache
bypass, so a newly published dashboard revision is not held behind an app cache.
Indiana DNR—not FinFindr—controls video-review and publication timing, and
delayed dashboard review must become a stale read rather than manufactured
freshness.

Use only the dashboard's current-calendar-year species totals. Do not sum daily
chart marks into those totals. Passage at South Bend omits fish below the
ladder, downstream harvest, and fish that never reach the facility; it is not
whole-river abundance, live fish location, catch probability, or evidence that
fish are evenly distributed across the five-ladder corridor. Fish Counts never
changes Stage, Activity, Presence, or Fishing Shape.
