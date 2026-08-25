# {{RIVER_NAME}} River Run Foundation

**River ID:** `{{RIVER_ID}}` **State:** `{{STATE}}` **Created:** {{CREATED_ON}}
**Status:** `research_incomplete` **Owner section approval:** `pending`

> Stop gate: do not configure species runs, write state copy, or add the river
> to the catalog until every blocking item in this foundation is resolved and
> the product owner approves the public section names and endpoints.

## 1. Identity and corridor

| Field                               | Researched value | Evidence ID | Status     |
| ----------------------------------- | ---------------- | ----------- | ---------- |
| Public river name                   | {{RIVER_NAME}}   |             | unresolved |
| State/jurisdictions                 | {{STATE}}        |             | unresolved |
| IANA timezone                       |                  |             | unresolved |
| Mouth waterbody                     |                  |             | unresolved |
| Mouth coordinates                   |                  |             | unresolved |
| Downstream product boundary         |                  |             | unresolved |
| Upstream migratory/product boundary |                  |             | unresolved |
| Approximate corridor length         |                  |             | unresolved |
| Runtime region/schema fit           |                  |             | unresolved |

If this river is outside the currently implemented Great Lakes state/region
types, stop ordinary onboarding and open a separate engine/biology/catalog
expansion. Do not force it into `great_lakes` to satisfy validation.

## 2. Public sections

Use two to four recognizable, ordered sections. Boundaries orient anglers; they
do not promise access or safety.

| Section ID | Public label | Downstream boundary | Upstream boundary | Order | Migration access by species | Gauge coverage | Evidence IDs |
| ---------- | ------------ | ------------------- | ----------------- | ----: | --------------------------- | -------------- | ------------ |
|            |              |                     |                   |       |                             |                |              |

Record the exact owner-approved wording:

- Primary lower/entry section:
- Middle or transition section:
- Upper accessible section:
- Mouth/lake/harbor context, if applicable:
- Landmarks prohibited from public copy:

## 3. Mandatory barrier and passage inventory

Research dams, weirs, falls, lamprey barriers, seasonal structures, ladders,
lifts, closures, removed structures, and proposed changes. A finding of “none in
the relevant corridor” requires evidence; silence does not pass.

| Barrier ID | Official/alternate names | Type/status | Reach/location | Passage: Chinook | Passage: Coho | Passage: Steelhead | Public upstream limit | Closure/regulation | Last verified | Evidence IDs | Confidence |
| ---------- | ------------------------ | ----------- | -------------- | ---------------- | ------------- | ------------------ | --------------------- | ------------------ | ------------- | ------------ | ---------- |
|            |                          |             |                |                  |               |                    |                       |                    |               |              | unresolved |

Unresolved passage is treated conservatively: public guidance ends below the
structure until authoritative evidence resolves it.

### 3.1 Species endpoint and passage-chain decision

Trace every intervening structure from the mouth to the proposed endpoint.
Passage at the last structure does not prove passage through the earlier chain.

| Species   | Biological upstream evidence | Every intervening structure verified? | Conservative product endpoint | Biological vs product-limit reason | Evidence IDs | Confidence/status |
| --------- | ---------------------------- | ------------------------------------- | ----------------------------- | ---------------------------------- | ------------ | ----------------- |
| Chinook   |                              | no                                    |                               |                                    |              | unresolved        |
| Coho      |                              | no                                    |                               |                                    |              | unresolved        |
| Steelhead |                              | no                                    |                               |                                    |              | unresolved        |

## 4. Regulations and access scope

| Jurisdiction | Regulation/version dates | River reach | Public reminder copy | Last verified | Evidence IDs |
| ------------ | ------------------------ | ----------- | -------------------- | ------------- | ------------ |
|              |                          |             |                      |               |              |

- Section names are orientation ranges, not public-access guarantees.
- River Run must not rate wading, boating, floating, ice, or personal safety.
- Time-sensitive closures must be rechecked immediately before release.

## 5. Source coverage map

| Source ID | Public station name | Provider/site/series | Metric(s) | Physical section | Represented reach | Role | Freshness limit | Historical record | Attribution/license | Evidence IDs | Accepted? |
| --------- | ------------------- | -------------------- | --------- | ---------------- | ----------------- | ---- | --------------- | ----------------- | ------------------- | ------------ | --------- |
|           |                     |                      |           |                  |                   |      |                 |                   |                     |              | no        |

Rules:

- Never average raw readings across gauges.
- One accepted primary hydraulic source is sufficient.
- Temperature fallbacks are selected by priority, not averaged.
- Air temperature is not measured water temperature.
- A source may describe only the reach supported by the audit.
- Provider/source identifiers stay in details and provenance, not headlines.
- Source probes must confirm returned timestamps and numeric values, not only
  endpoint success.
- Provider faults fail closed; a later valid reading must restore normal display
  automatically without a code/configuration change.

## 6. Weather strategy

| Weather point ID | Latitude/longitude | Role    | Basin/reach represented | Known limitations | Evidence ID | Accepted? |
| ---------------- | ------------------ | ------- | ----------------------- | ----------------- | ----------- | --------- |
|                  |                    | primary |                         |                   |             | no        |

Weather is modeled context. Rain does not prove a measured river response or
clarity change.

## 7. Supported species decision and shared comparison matrix

| Species        | Occurs in system | Recurring river run | Dependable opportunity | Strength evidence | Distribution evidence | Endpoint | Planned run | Status     | Evidence IDs |
| -------------- | ---------------- | ------------------- | ---------------------- | ----------------- | --------------------- | -------- | ----------- | ---------- | ------------ |
| Chinook salmon |                  |                     |                        |                   |                       |          | Fall        | unresolved |              |
| Coho salmon    |                  |                     |                        |                   |                       |          | Fall        | unresolved |              |
| Steelhead      |                  |                     |                        |                   |                       |          | Fall entry  | unresolved |              |

Unsupported combinations remain visible but disabled in the product catalog only
when that catalog behavior is intentionally configured and tested.

## 8. Research evidence ledger

Use authoritative primary sources wherever possible. Record access date and the
specific fact each source supports; a URL dump is not an evidence ledger.

| Evidence ID | Authority/title | URL or repository path | Published/updated | Event/data year(s) | Relevant page/table | Accessed | Facts supported | Geographic reach | Limitations |
| ----------- | --------------- | ---------------------- | ----------------- | ------------------ | ------------------- | -------- | --------------- | ---------------- | ----------- |
| E-001       |                 |                        |                   |                    |                     |          |                 |                  |             |

## 9. Contradictions and owner-calibrated decisions

| ID    | Question/conflict | Evidence on each side | Resolution | Resolution owner | Date | Code/copy consequence |
| ----- | ----------------- | --------------------- | ---------- | ---------------- | ---- | --------------------- |
| D-001 |                   |                       | unresolved |                  |      |                       |

Owner calibration may resolve product boundaries and conservative presentation.
It may not be mislabeled as biological or agency fact.

## 10. Foundation gate

- [ ] Identity, timezone, mouth, and corridor are verified.
- [ ] Public sections are recognizable and owner-approved.
- [ ] Barrier inventory is complete for the relevant corridor.
- [ ] Passage is species-qualified and unresolved cases fail closed.
- [ ] Every species endpoint has a verified mouth-to-endpoint passage chain.
- [ ] Current regulations and closure sources are recorded.
- [ ] Gauge, temperature, and weather reach limitations are explicit.
- [ ] Live Conditions capability is decided.
- [ ] Supported species are evidence-backed.
- [ ] Occurrence, recurrence, dependable opportunity, strength, distribution,
      and calibration quality were answered separately for every species.
- [ ] Every material claim resolves to the evidence ledger.
- [ ] No unresolved blocking decision remains.

**Foundation decision:** `blocked` **Owner approval/date:** **Foundation
version:**
