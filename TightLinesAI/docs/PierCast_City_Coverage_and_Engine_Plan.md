# PierCast — City Coverage and Engine Plan

> **Remaining-species review — 2026-09-12:** The [45-pair decision register](onboarding/piercast/remaining-species/README.md) supersedes earlier candidate labels for the nine non-core species. Three narrow fishery leads remain; other pairings are historical/unresolved or excluded. No additional daily seasonal or thermal curve is justified by this review. Numerical onboarding remains unresolved, with explicit unavailable/excluded weekly rows and configuration gates. The existing four-species scores, formula, UI, daily lock, conditions pipeline and disabled public release remain unchanged.

**Date:** 2026-09-09\
**Status:** Accepted product direction and completed upfront research synthesis;
implementation/release gates remain unresolved.\
**Baseline:** [Master Build Specification v2.0](PierCast_Master_Build_Spec.md)

**Research update, 2026-09-09:**
[Pilot Cities Research](PierCast_Pilot_Cities_Research.md) provides named-pier
dispositions, species priorities, dated seasonal evidence, and access/identity
gaps. Its [monthly CSV](PierCast_Pilot_Season_Matrix.csv) contains 56
city/species pairings across twelve months. Grand Haven starts with South Pier
only; Manistee starts with North Pier only; unresolved aliases/routes remain
excluded. No pairing is production-ready.

**Annual biology and provider research complete:**
[Annual Species Biology and Thermal Research](PierCast_Seasonal_Temperature_Research.md),
[156-row shared matrix](PierCast_Species_Month_Biology_Matrix.csv),
[structured evidence](PierCast_Thermal_Evidence.json), and
[Environmental Data Feasibility](PierCast_Environmental_Data_Feasibility.md).
All 13 species and twelve months are covered as evidence dispositions. Numerical
configuration remains unapproved because adult pier-catch response and
pier-reachable input validation are absent.

**Implementation update, 2026-09-09:** The non-public foundation now lives in
`supabase/functions/_shared/pierCastEngine`. It includes the
five-city/13-species research registry, the simplified seasonal-ceiling ×
water-temperature formula, explicit `X/10` serialization, smooth recurring
calendar curves, fail-closed temperature evaluation, duration-weighted daily
aggregation, winter/open-water qualification, headline selection, catalog
validation, and an authenticated owner-review catalog handler. All real curves,
ratings, and public cities remain disabled pending detailed calibration. Run
`npm run qa:pier-cast:foundation` before changing these contracts.

## 1. Accepted product decisions

- One public profile per city/port, with a visible **Covers these piers**
  section. No separate public pier profiles or sibling-pier navigation.
- Five initial city candidates: Ludington, Grand Haven, Manistee, Frankfort, and
  tentatively Sheboygan, Wisconsin. These are research targets, not verified
  forecast coverage.
- Operate during all twelve months. Research the full annual fishery, not only
  salmon season.
- Multiple target species per city, with species-specific needs and seasonality.
- Temperature research must review every month and relevant seasonal behavior
  for each retained species. A single year-round favorite-temperature band is
  insufficient; use supported seasonal profiles with smooth transitions, not
  twelve invented monthly optima. See the completed
  [annual month coverage](PierCast_Seasonal_Temperature_Research.md#5-annual-month-coverage).
- Retain the five-date daily outlook, species scores, named headline target,
  confidence, temperature chart, and separate conditions notices from the master
  spec.
- Label the public product **FinFindr Opportunity Rating**. Explain its
  biological, local-evidence, environmental, and calibration basis; do not
  present it as a biological measurement or catch probability.

The city name is a navigation label for a defined port fishery. It does not
imply coverage of all city waters, nearby rivers, inland lakes, beaches, or
offshore fishing.

## 2. One engine, configured for each species and city

Each species has a biological profile, not a separate software engine. Shared
code resolves configuration, checks input validity, evaluates species
opportunity over time, calculates daily means, selects the headline species, and
produces reasons and confidence.

Suggested configuration hierarchy:

`product defaults → species defaults → regional behavioral profile → city × species configuration → explicitly assessed area override`

| Record          | Owns                                                                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Species profile | Stable species ID and aliases, shared biological evidence, and seasonal water-temperature suitability curves                              |
| City            | Public identity, state, timezone, covered-pier inventory, one declared water-temperature series, supported species, and review status     |
| City × species  | One recurring `1–10` Seasonal Pier Opportunity Rating curve, method/coverage scope, evidence, and calibration provenance                  |
| Covered pier    | Exact structure identity, verified access point, hours/closures, exposure, practical assessments, and applicable forecast-area references |

These are logical responsibilities, not a requirement for five new database
tables. Reuse shared profiles by reference and record local differences only. A
new city or species normally adds reviewed configuration and fixtures; new
engine code is needed only for a justified new behavior the model cannot already
express.

Do not add a separate general city seasonal score. The overall score continues
to equal the strongest qualifying daily species score.

## 3. What one city score represents

Proposed v1 policy:

1. Each city × species has one fixed primary forecast area and method selected
   during research, not by whichever area scores highest that day.
2. Record the named covered piers to which that species forecast applies.
   Species may have different assessed coverage; make material differences
   visible inside the same city profile.
3. Share temperature data and biological configuration across covered piers when
   an explicit representation review supports it. Do not fabricate distinct
   scores for equivalent sites.
4. If one primary basis cannot represent a proposed covered pier for that
   species, narrow the species coverage and explain it. Separate public pier
   pages are not required. Do not average incompatible waters to retain a broad
   coverage claim.
5. Select the city headline from complete, targeting-eligible daily species
   outputs under the master rubric. The headline carries its actual
   species/area/covered-pier scope.
6. The temperature chart follows the selected headline's represented water.
   Identify a source/area change; never silently splice different areas.

This deliberately avoids taking a daily maximum across piers. A single city
profile does not require pretending all structures have identical conditions.

### Proposed conditions and ranking policy

Retain pier-specific access and practical notices within the city profile.
Unknown or closed access at one pier cannot establish the status of another.

For the initial conservative policy, apply the master's whole-period promotion
checks to every pier included in the driving species forecast's declared
coverage. Any known blocker in that coverage blocks city ranked promotion;
otherwise essential unknown coverage yields unknown promotion. Keep the
biological outlook visible with the exact affected pier and interval. Notices
elsewhere in the city profile do not expand a closure to unaffected structures.

Do not dynamically remove an inconvenient pier from declared coverage to keep a
city ranked. A less conservative “at least one fully assessed usable pier”
ranking policy would require an explicit design revision, visible
qualifying-pier scope, and dedicated validation. Decide this policy before
freezing the city API; the conservative policy above is the starting proposal,
not an additional user-approved product decision.

## 4. Initial city research register

| Candidate   | State     | Product intent               | Research status                                                                                                                      |
| ----------- | --------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Ludington   | Michigan  | Initial city profile         | Start North Breakwater; keep stub alias and South Breakwater excluded until mapped/access-reviewed; no environmental sample approved |
| Grand Haven | Michigan  | Initial city profile         | Start South Pier; catalog North Pier as excluded/closed-unresolved during construction; no environmental sample approved             |
| Manistee    | Michigan  | Initial city profile         | Start North Pier; exclude South Breakwater connector until authoritative reopening; no environmental sample approved                 |
| Frankfort   | Michigan  | Initial city profile         | North Breakwater and Elberta South Breakwater remain candidates; approaches and shared representation still block activation         |
| Sheboygan   | Wisconsin | Tentative fifth city profile | Both pier areas remain tentative; exact access, annual local roster, jurisdiction, and representation are unresolved                 |

For each city, produce a short researched coverage sheet: exact structure names
and aliases, map/reference boundaries for research, actual access coordinates,
land-manager sources, candidate forecast areas, representation findings, and
exclusions. A public map is not required. Do not guess north/south pier
identity, current access, or inclusion from a city's name.

Select the first technical prototype by evidence and source feasibility. All
five cities remain the intended pilot research scope; one successful prototype
does not establish the others' readiness.

## 5. Retained species research scope

The retained upfront research roster is:

- Walleye
- Smallmouth bass
- Steelhead
- Coho salmon
- Chinook salmon (king salmon)
- Brown trout
- Freshwater drum
- Lake trout
- Yellow perch
- Lake whitefish
- Round whitefish
- Channel catfish
- Largemouth bass

These 13 species have shared annual research profiles. This does not add each
species to every city. Bowfin and northern pike remain incidental Manistee leads
outside this roster because the package lacks a supported multi-city/pier season
case. Use canonical species IDs; aliases must not produce duplicate targets.

Every city × candidate species begins **not assessed**. This list does not
establish that all candidates support a useful pier fishery in every city, and
broad lake presence is insufficient. Offshore catches or upstream river
opportunities do not automatically establish covered-pier opportunity.

For every pairing, record:

| Question                                                                           | Required result                                                                                      |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Is there a credible targetable fishery from the covered structures?                | Include, exclude, or unresolved, with applicable evidence                                            |
| Where and by what broad method does the outlook apply?                             | Fixed primary area/method and named pier coverage                                                    |
| How much opportunity can this local fishery support through the year?              | One continuous `1–10` Seasonal Pier Opportunity Rating with evidence-backed date knots               |
| Does behavior require different thermal responses during the year?                 | Smallest supported set of seasonal temperature curves with smooth transitions                        |
| Does the declared city water-temperature series remain useful throughout the year? | Source comparison, accepted domain, forecast coverage, and seasonal failure rules                    |
| Are additional score factors necessary?                                            | Not in v1; a later factor requires evidence and a held-out comparison against the two-input baseline |
| What limits confidence or eligibility?                                             | Reviewed uncertainty, conditions/access/targeting scope, expiry rules                                |

No temperature ranges, score ceilings, or month-by-month fishery claims are
supplied by this planning document. Those require the master's evidence records
and reviewed provisional calibration.

## 6. Year-round behavior

The feature remains available all year and always evaluates the next five local
dates. It does not automatically shut down after a salmon season or roll over to
a generic winter score.

Each supported city/species requires January–December assessment. Monthly
research notes document the evidence; runtime uses continuous seasonal curves
and supported behavioral profiles, not twelve disconnected monthly engines.
Distinguish:

- Supported low seasonal opportunity: may produce a low numeric score with valid
  essential inputs.
- Credible biological opportunity with closed access or hazardous conditions:
  qualified biology, with recommendation suppressed as required.
- Missing winter source coverage or unsupported input domain: explicit
  unavailable dynamic outlook; sourced seasonal context can remain.
- Unresearched species or area: unsupported/unassessed state, not a fabricated
  low score.

Year-round service does not promise favorable fishing, open piers, or numeric
scores on every date. No fixed quota of high-scoring species should be used to
fill a calendar month. A city may have no recommended target on a date.

Winter review must cover provider operation, structure access, and seasonal
restrictions. January–March reports always carry the open-water-only notice.
This is a pier-fishing feature; it does not add on-ice recommendations or assess
ice load-bearing safety.

Retain selected/favorited species even when low or unavailable. Other supported
targets can be collapsed with their status accessible. Do not make the product
appear salmon-only by permanently hiding other researched species.

## 7. Calculation flow

```text
Accepted environmental runs + reviewed configuration
    ↓
Resolve city × species configuration
    ↓
For each supported time interval:
  score = 1 + (seasonalRating − 1) × temperatureSuitability
    ↓
Duration-weighted daily species means
  (today: remaining local day; future dates: full local day)
    ↓
Highest eligible complete species score → city headline
    ↓
Attach confidence, named-pier scope, practical notices, and promotion status
    ↓
Store reproducible city outlook → dashboard and single city profile
```

The seasonal curve owns both local fishery strength and fine-grained timing, so
there is no separate permanent baseline or annual multiplier. Temperature is the
only live score input and is evaluated before daily aggregation. No averaging of
species creates the city headline; wind, waves, light, pressure, moon, flow,
access, and confidence have zero numeric weight.

## 8. Concrete build sequence

1. **Coverage and research — complete as an upfront pass:** Named-pier
   dispositions, the 672-row local matrix, the 156-row shared biology matrix,
   structured evidence, and provider feasibility are present. Unresolved facts
   remain explicit gates.
2. **Freeze city contracts:** Adopt a stable `cityId` (or consistently named
   `portId`) for catalog, saved destinations, dashboard, API, snapshot
   ownership, and feedback. Retain `pierId` for coverage, conditions, and actual
   trip location. Resolve the proposed promotion policy and migrate conflicting
   v1.7 contracts.
3. **One complete real-data prototype:** One city, one supported species, one
   representative area, accepted provider extraction, scoring, conditions
   assessment, stored forecast, and a basic city profile. This is a technical
   milestone, not the completed year-round release.
4. **General engine and configuration validation:** Complete seasonal
   temperature-profile resolution, interval scoring, daily aggregation,
   confidence, reason codes, coverage/fallbacks, and reproducible snapshots
   using the master invariants. Demonstrate a second species and city by
   configuration rather than copied engine code.
5. **Calibrate fine-grained seasonal opportunity:** Extend the completed monthly
   inventories with dated city/pier evidence. Create sparse daily-interpolated
   anchors, using broad flat spans during slow periods and weekly/finer knots
   around supported arrivals, peaks, and declines. Keep unresolved targets
   disabled and label retrospective work accurately.
6. **Complete the city experience:** State → City finder, saved cities, one
   profile per city, Covers these piers, five-date calendar, species
   images/scores, hourly temperature chart, and named-pier notices. Rank cities
   once each; count public cities for Top 5/10 thresholds.
7. **Validate and pilot:** Retain the master's environmental validation and
   predeclared prospective evaluation. Track results by city, species, season,
   and lead time, plus dashboard exclusions. Validate sampled seasons honestly;
   a working annual calendar does not establish twelve months of forecast skill.

### Planning-artifact status

- **Present:** coverage sheets with explicit included/excluded/unresolved
  structures; exact boundaries/coordinates remain blocked where noted.
- **Present:** shared 13-species evidence library and per-city applicability
  dispositions.
- **Present:** 672-row city matrix and 156-row shared biology matrix with
  explicit unknowns.
- **Present:** provider capability/source plan including horizon, winter, and
  localization limitations; declared city sample fixtures remain blocked.
- **Missing:** versioned, reviewed numerical configurations and daily
  calibration reference cases.
- **Missing:** consolidated city-based API/storage contracts and representative
  UI examples.
- **Missing:** prospective pilot evaluation, reviewer assignment, expiration
  dates, and maintenance ownership.

### Final readiness ledger

| Layer                                           | State                                    | Consequence                                                                |
| ----------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------- |
| Product direction and one-engine architecture   | Supported/accepted                       | Contract migration may proceed                                             |
| Shared annual species biology                   | Sourced plus explicit regional transfers | Schema/profile resolver may proceed; numerical curves stay off             |
| Local species occurrence                        | Uneven but explicitly inventoried        | Enable only reviewed city pairings; unknown is not zero                    |
| Structure coverage/access                       | Partial, with conservative exclusions    | Catalog work may proceed; affected structures cannot enter promotion scope |
| Environmental provider availability             | Technically feasible                     | Adapter/probe work may proceed                                             |
| Declared city water-temperature source          | Unapproved for all cities                | Blocks all numerical forecasts                                             |
| Opportunity calibration and held-out validation | Absent                                   | Blocks public score claims and production launch                           |

## 9. Master-spec migration checklist

The 2026-09-09 product decisions supersede pier-only public navigation. Before
production implementation, consolidate the master specification so it has one
authoritative contract:

- Replace public pier catalog/profile/ranking/favorite identity with city
  identity throughout Sections 1, 3, 9, 11, 12, and acceptance scenarios.
- Update `DailyPierOutlook`, snapshot keys, active pointers, API routes, refresh
  generations, chart requests, and feedback/exposure linkage for city ownership
  and nested pier coverage.
- Preserve physical pier/zone identities for representation, access, conditions,
  source scope, and actual trip feedback.
- Define species-specific covered-pier scope and adopt an explicit city
  promotion aggregation policy.
- Replace the three-to-five-pier pilot with the named city candidate scope and
  tentative fifth-city status.
- Add year-round research/source coverage and seasonal validation gates.
- Update labels to Today's supported cities, State → City, and Covers these
  piers; use Top 5/10 cities only under the catalog-size rules.
- Test differing closures among covered piers, narrower species coverage,
  chart-area changes, no qualifying winter targets, and identical shared biology
  with differing practical conditions.

## 10. Research starting points

These are source-discovery links, not completed evidence dossiers or validated
coefficients:

- [Michigan DNR Great Lakes fishing roadmaps](https://www.michigan.gov/dnr/things-to-do/fishing/where/roadmaps-to-fishing-michigans-great-lakes)
- [Michigan DNR Central Lake Michigan Management Unit](https://www.michigan.gov/dnr/managing-resources/fisheries/units/c-michigan)
- [Wisconsin DNR Lake Michigan fishing reports](https://dnr.wisconsin.gov/topic/Fishing/lakemichigan/OutdoorReport)
- [Michigan DNR creel program](https://www.michigan.gov/dnr/managing-resources/fisheries/creel)

Reports may guide further research; individual catches do not establish a
scoring curve. Preserve dated source records and distinguish shore/pier
observations from boat or upstream reports. Current access and legal facts
require their applicable authorities and review dates.
