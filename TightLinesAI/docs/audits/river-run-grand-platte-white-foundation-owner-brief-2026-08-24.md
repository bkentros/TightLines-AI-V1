# Grand, Platte, and White River Run Foundation Decision Brief

> **Superseded species decisions (2026-08-24 correction):** The Platte
> Chinook/Fall Steelhead disabled conclusions, White Chinook September 10
> beginning, and White Coho disabled decision in this original brief are no
> longer operative. Direct DNR lower-weir records establish both Platte runs,
> and DNR Chinook biology supports a conservative August 15 White beginning. See
> `docs/audits/river-run-grand-platte-white-species-correction-2026-08-24.md`.

**Date:** 2026-08-24 **Branch:** `develop/cross-platform-next` **Baseline:**
`dc00b3ca7beb92254dd153b7b8d7851efc1391e9` **Scope:** Phase A river foundations
and Phase B source capability only **Owner decision:** approved 2026-08-24
**Runtime status:** unchanged; all three rivers remain disabled **Release
status:** no deployment, publication, public enablement, or store-version change

This brief is the single owner stop before species/run implementation. The
detailed evidence and endpoint probes remain in each river's
`river-foundation.md` and `live-conditions.md` packet.

## Recommended owner decisions

| River  | Sections                                                                                                                                                  | Supported Phase C candidates                                                                | Gauge Read                                                                                             | Scored-condition recommendation                                                                                                                                                                                                                                                  |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Grand  | Approve the three labels below as the intended section model, but keep guidance above unresolved structures fail-closed until current passage is verified | Chinook, Coho, Steelhead                                                                    | Accept Grand Rapids discharge/height plus North Park temperature with separate station/reach labels    | Do not approve Activity yet; weather input and reach pairing remain blocked. Fishability may later describe only the accepted Fulton Street hydraulic reach.                                                                                                                     |
| Platte | Approve the two lower sections ending at the signed Lower Weir closure                                                                                    | Coho only                                                                                   | Accept Honor discharge/height, explicitly labeled as upstream of Platte Lake; no temperature tile      | Treat capabilities by represented run reach: Stage and Fish In River eligible; lower-corridor Fishability unavailable; Activity may use weather-only only if the owner accepts that the Honor gauge is not an accepted input for the lower run corridor.                         |
| White  | Approve the three sections ending below Hesperia Dam                                                                                                      | Chinook and Steelhead; keep Coho visible but disabled pending sparse-run Phase C acceptance | Accept Fruitvale discharge/height and Weaver Street temperature as separate reach-labeled measurements | Do not combine split-reach measurements into observed-river Activity. Fishability may describe only the Fruitvale hydraulic reach. Activity should remain blocked unless a reach-specific observed model or conservative weather-only model is separately accepted and replayed. |

## 1. Grand River

### Proposed public sections

1. `Lower river (Grand Haven mouth–Sixth Street Dam)`
2. `Middle passage corridor (Sixth Street Dam–Webber Dam)`
3. `Upper accessible corridor (Webber Dam–Moores Park Dam)`

The third section is Coho/Steelhead-only under the proposed species scope.
Chinook guidance ends at Webber Dam. These labels can be approved as the stable
product model, but public routing through unresolved Ada/Wagar status or
unresolved Portland/Grand Ledge ladder operation remains prohibited.

### Barrier and passage conclusion

- Four downtown low-head dams are being removed during active 2026–2027
  construction; source reach and access must be rechecked after material work.
- Sixth Street has a salmonid ladder, but current unrestricted operation still
  needs release-time verification.
- Lyons Dam is confirmed removed.
- Historic evidence proves Chinook, Coho, and Steelhead passage at Webber, but
  does not prove every intermediate structure's current operation.
- Current DNR destination evidence supports Coho and Steelhead below Moores
  Impoundment; Chinook is not supported in the upper Lansing counties.
- Until Ada/Wagar and Portland/Grand Ledge are resolved, the engine section
  graph must clamp guidance below the first unresolved structure.

### Gauge Read recommendation

| Metric            | Station                                         | Public precision | Represented reach/history                                                                                                               |
| ----------------- | ----------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Discharge         | USGS 04119000, Grand River at Grand Rapids      | whole CFS        | Fulton Street/downtown reach; daily mean record 1901–1905 and 1930–present; exact ±3-day prior-year context allowed with gaps disclosed |
| Gauge height      | USGS 04119000                                   | 0.01 ft          | Current and 24-hour trend only; no date average because of datum/site/channel changes                                                   |
| Water temperature | USGS 04118564, Grand River at North Park Street | 0.1°F            | North Park reach; daily record from July 2020 with material gaps; date context only when per-date history is sufficient                 |

The two stations must never be presented as one co-located observation or as
whole-river conditions. Grand Rapids dam-removal work requires a versioned
post-construction rating/datum/reach audit.

### Species recommendation

- **Chinook:** supported candidate; proposed public limit at Webber Dam.
- **Coho:** supported candidate; proposed limit below Moores Park Dam, subject
  to intermediate-passage verification.
- **Steelhead:** supported fall-entry candidate; same proposed upper limit and
  verification condition as Coho; no salmon mortality logic.

### Important uncertainty and approval request

Approve the three section labels and species-specific intended endpoints, with
the explicit condition that unresolved passage continues to clamp production
guidance. Activity remains blocked because the production-shaped weather probe
returned no clear-sky-radiation values and the accepted water stations cover
different Grand Rapids reaches.

## 2. Platte River

### Proposed public sections

1. `Lower river — Platte River Point to El Dorado`
2. `Weir approach — El Dorado to the Lower Weir closure`

River Run guidance ends at the downstream edge of the signed 300-foot closure
whenever the Lower Platte River Weir is installed.

### Barrier and passage conclusion

- The seasonal Lower Weir is a real harvest/passage structure and signed
  closure, not a generic landmark.
- Coho collection/harvest is directly documented.
- Spring 2026 emergency Steelhead handling proves species presence but does not
  establish normal fall passage or a fall-entry calendar.
- Current Chinook handling/support was not established.
- The Upper/Hatchery Weir is outside the proposed product corridor.
- No other fixed mainstem dam, falls, lamprey barrier, ladder, or lift was found
  inside the proposed mouth-to-lower-weir corridor.

### Gauge Read recommendation

| Metric            | Station                              | Public precision | Represented reach/history                                                                                |
| ----------------- | ------------------------------------ | ---------------- | -------------------------------------------------------------------------------------------------------- |
| Discharge         | USGS 04126740, Platte River at Honor | whole CFS        | US-31/Honor upstream of Platte Lake; daily mean from March 1990; exact ±3-day prior-year context allowed |
| Gauge height      | USGS 04126740                        | 0.01 ft          | Current and trend only; no accepted date average                                                         |
| Water temperature | none                                 | no tile          | Exact live and daily `00010` probes returned no series; no substitute allowed                            |

At the research probe the station was unavailable because equipment-malfunction
placeholders followed the last numeric reading on 2026-08-20. Older-than-24h
values and trends remain suppressed. The station does not represent the lower
weir/mouth corridor.

### Species recommendation

- **Coho:** supported Phase C candidate.
- **Chinook:** keep visible but disabled; historic occurrence is not current run
  support, and the current DNR opportunity list omits Platte Chinook.
- **Steelhead:** keep the planned fall-entry combination disabled; Steelhead is
  supported in the river, but the reviewed direct evidence is spring-specific.

### Important uncertainty and approval request

Approve the two sections, Coho-only Phase C scope, disabled Chinook and fall
Steelhead states, and the following reach-based capability interpretation:

- Gauge Read may display Honor hydraulics because it names the actual station.
- The Honor source cannot drive lower-corridor Fishability.
- The lower run corridor has no accepted hydraulic or measured-temperature input
  for Activity. If weather-only Activity is approved, the capability model and
  standard will define eligibility by represented run reach rather than merely
  by whether any river-level gauge exists; confidence stays Limited and the
  model receives its own Coho replay. Otherwise Activity stays deterministically
  unavailable and the run cannot pass the current public Activity gate.

**Recommendation:** approve the reach-based weather-only path for Platte Coho,
not a mixed hydraulic-plus-weather score using the upstream Honor gauge.

## 3. White River

### Proposed public sections

1. `Lower river — Covell Park/Business US-31 to Fruitvale Road`
2. `Forest corridor — Fruitvale Road to Pines Point`
3. `Upper accessible corridor — Pines Point to Hesperia Dam`

White Lake is entry context outside the scored river corridor. Guidance ends at
the downstream face of Hesperia Dam.

### Barrier and passage conclusion

- Hesperia Dam is the confirmed current upstream limit for Chinook, Coho, and
  Steelhead; future fish-passage discussion is not current passage.
- White Cloud Dam is upstream and outside product scope.
- The 1983 lower Chinook weir was temporary and is no longer a barrier.
- Silver, Sand, and Cleveland Creek dams are tributary barriers; routine public
  copy will not name or recommend those tributaries.
- No natural mainstem falls/rapids barrier was documented within the 33-mile
  White Lake-to-Hesperia corridor.

### Gauge Read recommendation

| Metric            | Station                                                                           | Public precision | Represented reach/history                                                                                                           |
| ----------------- | --------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Discharge         | USGS 04122200, White River near Whitehall at Fruitvale Road                       | whole CFS        | Fruitvale/free-flowing lower mainstem; daily mean from August 1957 with near-complete coverage; exact ±3-day context allowed        |
| Gauge height      | USGS 04122200                                                                     | 0.01 ft          | Current and trend only; no accepted date average                                                                                    |
| Water temperature | Trout Unlimited / Monitor My Watershed, South Branch White River at Weaver Street | 0.1°F            | Immediate Hesperia tailwater; live/trend accepted; date average unavailable pending a versioned short/gappy-history baseline policy |

Gauge Read can show all three measurements only with each metric's actual
station and a permanent split-reach limitation. Missing data at either station
must produce Partial rather than suppressing the other station.

### Species recommendation

- **Chinook:** supported Phase C candidate.
- **Steelhead:** supported fall-entry Phase C candidate.
- **Coho:** annual/wild occurrence is directly documented, but opportunity is
  sparse and the current DNR destination list omits it. Keep visible but
  disabled for this pass; revisit only with owner acceptance of a low-ceiling
  sparse run and complete Phase C/D evidence.

### Important uncertainty and approval request

Approve the three sections, hard Hesperia endpoint, Chinook/Steelhead Phase C
scope, disabled Coho state, and split-reach Gauge Read. Do not approve an
observed-river Activity score that combines Fruitvale hydraulics with Hesperia
temperature. Activity remains blocked until a single represented reach or a
separately accepted conservative weather-only contract is chosen and replayed.

## 4. Infrastructure audit before production work

The following changes are required after this owner gate and before any parallel
production implementation:

1. **Isolated configuration modules.** Add one river module and separate run
   modules per new river. Shared `rivers.ts`, `runs.ts`, and `catalog.ts` become
   integration registries only; no production subagent edits those registries.
2. **Run-driven replay and fixtures.** Replace hard-coded accepted-run
   allowlists and nested river/species selection in the regulated-tailwater
   replay/fixture tools with configuration-document/run-ID resolution plus
   explicit source/mode capability checks. Unsupported provider or mode
   combinations fail with a precise error; they do not silently reuse another
   river's generator.
3. **Visible capability model.** Represent Migration Stage, Activity, Fish In
   River, and Fishability explicitly and independently. Represent Gauge Read
   river metrics independently by source/reach. Move hidden Timing and Push to
   legacy compatibility capability fields so they cannot force visible
   Fishability availability or appear in public navigation/copy.
4. **Fail-closed dependencies.** Stage and Fish In River require an accepted run
   truth profile; Fishability requires accepted hydraulics for its public reach;
   observed-river Activity requires an accepted same-reach input contract;
   weather-only Activity requires zero hydraulic/temperature credit, Limited
   confidence, an explicit reach limitation, and a species replay. Gauge Read
   may remain available for a differently represented reach without granting
   scoring eligibility.
5. **Unavailable public state.** A visible primitive lacking an accepted input
   contract renders a deterministic, river/species-correct unavailable state. It
   must not fall through to the current PM-specific Activity fallback copy.

These changes will receive focused validation tests before any new river/run
profile is registered. Hidden Timing/Push remain excluded from public order,
copy acceptance, and onboarding scope.

## 5. Exact approval requested

The owner approved this single bundle on 2026-08-24:

1. Grand's three section labels and intended species-specific endpoints,
   retaining fail-closed clamps until the listed current passage checks pass.
2. Platte's two sections, Coho-only Phase C scope, disabled Chinook/fall
   Steelhead states, upstream-only Gauge Read, lower Fishability unavailable,
   and reach-based weather-only Activity path.
3. White's three sections and Hesperia limit, Chinook/Steelhead Phase C scope,
   disabled Coho state, split-reach Gauge Read, and prohibition on combining
   Fruitvale hydraulics with Hesperia temperature for observed Activity.
4. The explicit visible-capability/refactored tooling plan in Section 4.

This approval authorizes continued research and hidden implementation on
`develop/cross-platform-next`; it does **not** authorize deployment,
publication, public enablement, release-branch changes, or store-version
changes.
