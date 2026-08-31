# FinFindr River Run Onboarding

**Status:** Single normative source of truth\
**Version:** 3.0\
**Established:** 2026-08-30\
**Scope:** Research, configure, tune, review, and release a U.S. River Run river
and each supported migratory run

This is the only active River Run onboarding instruction. Current engine types,
validation, and tests remain the executable contract. Per-river dossiers,
replays, fixtures, and audits are evidence records; they do not override this
guide.

The objective is fast, repeatable expansion without lowering biological,
geographic, source, legal, or product accuracy. Speed comes from researching
river facts once, evaluating species together, deriving public presentation, and
automating verification. It never comes from copying another river's calendar,
strength, endpoint, gauge reach, or Activity tuning.

## 1. Current product contract

The report has three public reads, in this order:

1. Migration Stage
2. Activity Outlook
3. Seasonal Presence

Gauge Read appears above the reads and is unscored. When a representative
hydraulic source has accepted bands, Gauge Read contains compact **Fishing
Shape** context. Spot Finder appears between Gauge Read and the reads only when
an audited fishing-access inventory matches the selected river, state, species,
and migration corridor.

| Surface           | Owns                                                                                               | Must not claim                                                                |
| ----------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Gauge Read        | Accepted current measurements, age, trend, historical date context, station, and represented reach | Whole-river conditions, fish location, abundance, safety, or access           |
| Fishing Shape     | Workability of the represented hydraulic reach if fish are present                                 | Abundance, responsiveness, access, safety, or the whole river                 |
| Spot Finder       | Broad stage-appropriate run sections and source-listed public fishing access                       | A best spot, live fish location, parking legality, road status, or safe entry |
| Migration Stage   | Fixed researched seasonal phase                                                                    | Live movement, abundance, responsiveness, or catch probability                |
| Seasonal Zone     | Calendar-based orientation inside the accessible migration corridor                                | A live location report or individual access recommendation                    |
| Activity Outlook  | Conditional responsiveness by four time blocks if fish are present                                 | Abundance, migration progress, feeding proof, or catch probability            |
| Seasonal Presence | Historical seasonal presence relative to this river/species ceiling                                | A fish count, today's movement, bite quality, or current conditions           |

Do not author or expose `WHERE TO START`, `WHY THIS READ`, `GUIDE'S READ`, a
standalone Fishability tab, public Push, or public Migration Timing. Legacy API
or configuration fields may remain for compatibility but are not new public
research or copy requirements.

Public copy is shared or derived. New onboarding normally authors only durable
river/source limitations, official regulation reminders, reach labels, Spot
Finder access facts, and evidence notes.

## 2. Authority, safety, and stop rules

Use this evidence hierarchy:

1. Current state fish-and-wildlife agency and tribal co-manager material and
   regulations.
2. USGS, NOAA, USFWS, USACE, FERC, other tribal authorities, documented
   facility operators, and public land managers.
3. Peer-reviewed research and official technical reports.
4. Established watershed or conservation organizations for facts they directly
   monitor or manage.
5. Reputable secondary material only to find primary evidence or document a
   local name; never as the sole support for a material biological, legal,
   passage, or source claim.

Every material fact needs an evidence row containing authority/title, direct URL
or repository path, publication/update date when available, event/data years,
relevant page/table, access date, facts supported, geographic scope, and
limitations. A search result, snippet, URL list, fishing forum, guide promotion,
or remembered reputation is not evidence.

Stop and leave the candidate hidden when any of these remain unresolved:

- exact waterbody identity or runtime region/schema fit;
- a material barrier, passage chain, species endpoint, or presentation-state
  boundary;
- whether a species has a recurring dependable run;
- the current regulation or closure needed for the public reminder;
- whether a gauge/temperature source represents the scored reach;
- a required Activity calibration or replay invariant;
- a material contradiction between sources, code, and the dossier.

An unresolved barrier ends guidance below it. A missing gauge does not make
Stage or Seasonal Presence unavailable. Never substitute air temperature for
measured water temperature, an upstream gauge across a dam or lake for the run
corridor, neutral values for failed providers, or paddling access for verified
fishing access.

Research acceptance, rendered product acceptance, deployment authorization, and
public enablement are separate decisions. Do not infer one from another.

## 3. Rapid workflow

Run onboarding in four passes. A river becomes **research-ready** only after
Passes 1 and 2. It becomes **implementation-ready** only after Pass 3 is
accepted. The ten-rivers-per-day target applies to implementation-ready rivers,
not ten unresolved research projects.

### Pass 1 — preflight and shared evidence bundle

1. Confirm the owner-specified branch, worktree, existing IDs, public catalog,
   supported state/region/species/engines, provider adapters, and reusable
   biology profiles.
2. Create one dossier:

   ```bash
   npm run river-run:onboarding:init -- \
     --river-id example_river \
     --display-name "Example River" \
     --state MI
   ```

3. Search the river and all candidate species together. Capture current agency
   assessments, regulations/orders, stocking records, creel/harvest material,
   weir/ladder/trap/egg-take reports, passage records, barrier/removal records,
   station metadata, real live/history endpoint probes, and public fishing
   access sources.
4. When onboarding a regional batch, share only source discovery, agency and
   tribal-authority indexes, provider probes, and reusable biological evidence.
   Keep identity, passage, calendar, strength, endpoint, presence, Activity,
   Fishing Shape, access, and acceptance decisions in each river's dossier.
5. Record contradictory and negative evidence immediately. Do not reconstruct
   citations after configuration.

### Pass 2 — lock the river foundation once

Complete sections 4 through 7 of the dossier. Do not configure species runs
until identity, corridor, barriers, regulations, and source reach are accepted.

### Pass 3 — decide and tune every species independently

Complete sections 8 through 12 for every candidate. Compare candidates side by
side, but never share a calendar, strength, endpoint, lifecycle, presence curve,
or Activity rules merely because they use the same river.

### Pass 4 — configure, verify, review, and release

Implement hidden configuration first. Reconcile every configured field against
the dossier, run the complete gate, obtain rendered owner acceptance, and only
then perform separately authorized promotion and deployment.

## 4. River foundation research

Record these fields once per canonical river:

- stable snake_case river ID and display name;
- official name, aliases, similarly named rivers excluded from scope;
- state/jurisdictions, counties, presentation contexts, timezone, coordinates,
  mouth, receiving basin/lake/estuary/bay/ocean, and runtime region fit;
- downstream and upstream product termini and corridor length;
- current target-species candidates;
- one weather point and its basin/reach rationale;
- active/inactive condition-refresh schedule;
- support status, configuration version, and evidence notes.

For multi-state rivers, one canonical hydrologic river may have state-specific
presentation reaches and regulation reminders. Scoring and run identity remain
attached to the canonical river. Region is a stable snake_case evidence scope,
not a public availability gate; the river and every biology profile it uses
must declare the same region.

When foundation locations are configured, record official name/aliases,
coordinate and coordinate source/status, reach, kind, passage state, public
upstream-limit flag, public-access status, bank/wade/boat suitability,
beginner-suitability decision, restrictions, and source notes. Coordinates are
research geometry, not automatically approved navigation pins.

### 4.1 Canonical reaches

Define only the reaches needed to express the supported migration corridor,
source scope, Seasonal Zone, and Spot Finder alignment. Usually use two or three
in-river reaches plus optional harbor/mouth context.

Each reach requires a stable ID, recognizable display name, downstream and
upstream boundaries, downstream-to-upstream order, role, gauge-represented flag,
notes, and source provenance.

Rules:

- Harbor and mouth context are not an in-river Seasonal Zone.
- `lower`, `middle`, and `upper` are relative to the supported migration
  corridor, not necessarily the whole river.
- Do not invent a middle reach for a natural two-section corridor.
- Technical landmarks are acceptable only when a user can identify them from the
  cited source.
- Physical endpoint, dependable opportunity distribution, and measurement reach
  are three separate decisions.

### 4.2 Complete barrier and passage inventory

Search current and historical names for dams, low-head structures, diversions,
weirs, lamprey barriers, gates, temporary controls, natural barriers, ladders,
lifts, bypasses, removed/breached structures, and associated closures.

For every structure record:

- official/alternate names, type, status, location/reach, verification date;
- passage by candidate species and evidence quality;
- operating season, capture efficiency, bypass/manual passage, and high-flow
  limitations when a facility count is used;
- public product limit and closure/exclusion rule;
- source IDs, contradictions, and conservative decision.

Build a complete mouth-to-endpoint passage chain for each species. A ladder at
the final dam does not prove passage through every earlier structure. A ladder
also does not prove unrestricted, year-round, species-neutral passage. Limited
passage is not rewritten as impassable; instead, conservatively limit the
product corridor when the complete chain cannot be proven.

### 4.3 Regulations

Record the current issuing authority, regulation version/effective dates,
jurisdiction, affected reach, official source, exact public reminder, and
access/safety limitation. Recheck time-sensitive rules immediately before
release. River sections never promise uniform tackle rules, harvest legality,
parking, permission, or safe entry.

## 5. Gauge Read and source capability

Probe real provider endpoints; station metadata alone is insufficient. For each
candidate hydraulic or measured-temperature source record:

- provider, source/site/series/parameter IDs and public station name;
- coordinates, physical reach, represented reach, and explicit exclusions;
- live and historical endpoints, returned units, numeric sample, observation
  timestamp/timezone, cadence, maximum age, provisional/revised semantics;
- first/last usable historical years, gaps, sensor moves, rating/datum/method
  changes, null/sentinel and wrong-unit behavior;
- source role, priority, smoothing/validity limits, attribution, license, probe
  date, and accepted/rejected reason.

Use exactly one primary hydraulic source when hydraulics are accepted. Other
gauges are context unless independently normalized and audited. Temperature
sources use priority order and are never averaged.

Gauge Read supports discharge, gauge height, and measured water temperature
only. Every metric independently owns freshness, observation age, 24-hour trend,
station, and reach. Provider `observedAt`, FinFindr `refreshedAt`, and device
time must remain distinct.

Display source-appropriate precision: normally whole CFS, hundredths of a foot
when the station supports it, and tenths of a degree after the accepted
conversion/smoothing contract. Additional metrics require a separately approved
provider, unit, freshness, historical, interpretation, UI, and QA contract.
Gauge Read uses an hourly, species-independent refresh key; do not add hourly
scoring slots merely to obtain fresher measurements.

Historical date context uses the target calendar date ±3 days across prior
years. Do not substitute a broad seasonal average. Gauge-height history remains
`No average` unless datum-consistent support is implemented and audited.

Test fresh, delayed, partial, older-than-24-hours, unreadable, missing,
fallback, and recovered states. A provider fault suppresses bad numeric values,
retains the last-readable timestamp when known, and automatically restores the
metric after valid observations return without a code/configuration change.

Use this capability decision table:

| Accepted source situation                                        | Gauge Read                                | Fishing Shape                                              | Activity                                                 |
| ---------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------- |
| No representative live source                                    | Honest no-gauge state                     | Unavailable                                                | Independently tuned weather-only or unavailable          |
| Representative hydraulics, no compatible measured temperature    | Hydraulic metrics                         | Possible after band replay                                 | Independently tuned weather-only or unavailable          |
| Metrics exist but sources do not represent/pair in the run reach | Display each with exact reach limitations | Only if hydraulics alone represent the Fishing Shape reach | Weather-only or unavailable; never silently combine them |
| Compatible hydraulics, measured temperature, and weather         | Accepted metrics                          | Possible after band replay                                 | Observed-river after tuning and replay                   |

## 6. Fishing Shape decision

Fishing Shape is internal Fishability scoring displayed compactly inside Gauge
Read. It is independently eligible from measured temperature and Activity.

Enable it only when the accepted hydraulic source represents a meaningful
fishing reach and defensible absolute bands can be calibrated. Record metric,
source, reach, version, too-low maximum, low-fishable range, ideal range,
high-fishable range, blown-out minimum, trend behavior, freshness/unknown-trend
caps, baseline coverage, evidence, and replay artifact.

If the gauge is upstream, separated by a lake/dam, context-only, or otherwise
unrepresentative, mark Fishing Shape unavailable and omit calibration fields. Do
not borrow another river's bands. It may be available without measured water
temperature and unavailable even when a gauge exists.

Public output is only the canonical label and matching five-stop red-to-green
meter: Poor, Tough, Fishable, Good, Excellent. It is never safety advice.

## 7. Spot Finder decision

Spot Finder is optional and fail-closed. Build it only from verified,
fishing-oriented public access sources inside the exact supported migration
corridor. Paddling-only directories, unverified coordinates, inferred roadside
pull-offs, and general park pages that do not establish fishing access are
insufficient.

Each section requires:

- stable ID and canonical foundation reach IDs;
- required `lower`, `middle`, or `upper` position;
- concrete downstream-to-upstream range label;
- optional eligible species only when endpoints genuinely differ;
- at least one source-listed fishing access.

Each access requires stable ID/name, access kinds, concise factual detail,
material caution, official or accepted land-manager URL, source locator
instructions, source label, and verification date. Include every eligible access
in a recommended section; never rank an individual access.

Shared recommendation logic:

- one eligible section: every active phase recommends it;
- two: Beginning lower; Building/Peak both; Tapering/Ending upper;
- three or more: Beginning first; Building first two; Peak all; Tapering/Ending
  last two;
- pre-run, post-run, missing stage, state mismatch, species mismatch, or
  corridor mismatch: no recommendation or no Spot Finder.

Sections and access details start collapsed. Recommendations are broad
calendar-based starting areas, not live fish-location reports.

## 8. Candidate species truth matrix

Evaluate every current candidate independently using common, scientific, and
local names. Search agency assessments, current/historic stocking, creel and
harvest records, weir/ladder/trap/egg-take reports, passage material, field
observations, technical archives, and regulations as context.

Keep these conclusions separate:

1. species occurs in the connected system;
2. a recurring migratory run exists in the configured river/season;
3. the run provides dependable public opportunity rather than rare strays;
4. the mouth-to-endpoint passage chain is supported;
5. calendar, strength, and distribution can be calibrated honestly.

An `unsupported` conclusion requires affirmative exclusion evidence or a logged
contradiction search across every applicable source class. “Not found,” no
direct stocking, omission from one guide, or evidence from another season is not
enough. When occurrence is established but precision is weak, use a conservative
supported profile or keep it `research_unresolved`; do not erase a real sparse
run.

## 9. Species/run configuration

For every supported species record and reconcile:

- run ID/display name, species, season, run type, movement engine, biology
  profile, migration purpose, lifecycle, and terminal semantics;
- explicit capability states for Migration Stage, Activity, Seasonal Presence,
  Fishing Shape, and required legacy fields;
- species endpoint and optional `seasonalZoneReachIds` only when narrower than
  the foundation/presentation corridor;
- all run-window fields: `preRunStart`, `stagingStart`, `start`, `beginningEnd`,
  `buildingEstablishedStart`, optional `buildingBroadStart`, `peakStart`,
  `peak`, `peakEnd`, `taperingEnd`, `end`, `lateEnd`, and `postRunLateCopyEnd`;
- historical-presence maximum, distribution scope, curve version, evidence,
  source notes, and every anchor;
- Activity rules and replay;
- Fishing Shape references or explicit unavailability;
- temperature priorities when observed inputs are used;
- research/source notes, all version IDs, and public-audit gate.

For new runs, public Push and Migration Timing should normally be explicitly
unavailable and their calibration objects omitted. Do not create new
`userCopyHints`, per-river stage prose, or stage-copy strategies unless current
validation requires a compatibility value; shared presentation owns the copy.

### 9.1 Full calendar protocol

Research the complete seasonal curve, not only start/peak/end. Prefer direct
river records with dates or weekly distributions. Record event year separately
from publication year and classify each source as entry, passage, harvest,
spawn, egg-take, operation, enforcement observation, or calibration.

Do not equate mouth concentration with river entry, sparse arrival with
dependable beginning, passage peak with harvest/spawn/egg-take peak, facility
installation with fish arrival, or one unusual year with the intended multi-year
calendar. Exact boundaries are calibrated product dates unless a source directly
establishes that same boundary.

Cross-year seasons must advance all dates, stage resolution, expected-day math,
and replay inputs into the following year. Lexical month-day iteration is not
valid.

### 9.2 Strength and distribution

`historicalPresence.maximum` is a 1–10 ordinal portfolio calibration, not a fish
count. Compare direct adult counts, creel/harvest evidence, destination-fishery
status, stocking where biologically relevant, natural reproduction, corridor
length, concentration, passage attrition, recency, trend, and what reach or
operating window each observation sampled.

Audit facility coverage before using counts: operating window, capture
efficiency, pre-installation passage, bypass, manual passage, flow effects, and
species/strain timing. Preserve raw agency counts but never imply they census
the whole river without evidence.

Set `maximum` independently from `distributionScope` (`concentrated`,
`sectional`, or `broad`). Record the closest accepted lower and higher portfolio
comparators. If adjacent ratings cannot be distinguished, choose conservatively
and record limited calibration confidence.

### 9.3 Seasonal Presence

Set versioned anchors across the full run and terminal tail. Each anchor needs a
biological/observational reason and evidence or an explicit owner calibration.
Weather, gauges, Activity, and Fishing Shape never alter Seasonal Presence.
Public output is the shared label/meter and permanent scope note—no custom
headline, explanation, or guide paragraph.

### 9.4 Migration Stage and Seasonal Zone

Stage uses global phase sentences. Seasonal Zone is derived from ordered
foundation reaches, presentation-state limits, the optional species endpoint,
and the fixed calendar. Beginning starts low, Building broadens, Peak can cover
the core corridor, and Tapering/Ending orient to established upstream sections.
It never crosses a barrier or claims current fish location.

Do not author `Where to Start`. Spot Finder translates Stage into access
sections when an audited inventory exists.

## 10. Activity tuning — mandatory per river/species

Activity is the most calibration-sensitive public read. Shared code supplies
mechanics only. Every river/species combination requires its own evidence
review, data-mode decision, source-reach contract, versioned tuning, fixed
historical replay, controlled tests, and owner acceptance.

Activity estimates conditional responsiveness of fish already present. It does
not estimate abundance, fresh entry, migration, exact location, feeding proof,
fishability, safety, or catch probability.

### 10.1 Choose the data mode

**Observed-river mode** requires compatible, reach-representative hydraulics,
measured water temperature, and hourly weather. Sources divided by a dam, lake,
major tributary, tailwater transition, or materially different corridor cannot
be paired because they share a river name. If a proxy pair is proposed, record
distance/intervening controls, simultaneous sample count, signed bias,
mean/median/p90/p99 absolute error, maximum error, dates, and the narrowest
defensible reach.

Define Full/Moderate/Unavailable inputs explicitly. Missing weather or all
measured river inputs returns Unavailable. One missing measured input may be
capped only under the versioned, replayed minimum-input contract. Provider
failure never silently switches the model to weather-only.

**Weather-only mode** is a deliberate limited model when compatible river
measurements are unavailable. Water-temperature and river-behavior weights must
be zero; supported light/weather weights are positive and total one. Confidence
is Limited. Configure a true maximum and, when the omitted input is the species'
primary response driver, an evidence-backed scale or tighter maximum. Missing
hourly weather returns Unavailable with no score, blocks, or leader.

### 10.2 Tune the rule set

Record:

- profile/version, data mode, represented reaches and exact source IDs;
- four component weights totaling one;
- cold, preferred-minimum, preferred-maximum, warm, and barrier temperatures;
- hydraulic-change thresholds when used;
- missing-river, missing-temperature, warm, late-run, ending, weather-only,
  stage-response, and extreme-condition caps;
- lifecycle ramp/penalty, scope limitation, confidence rules, and evidence
  rationale.

Allowed inputs are effective light from hourly weather, accepted measured water
temperature, accepted river behavior, same-block precipitation as restrained
context, and calendar/lifecycle only for constraints. Do not add air temperature
as water temperature, pressure, moon, wind as a direct response score, inferred
clarity, angler reports, catch reports, Push/Timing, or Seasonal Presence
credit.

The four local blocks are 5–9 AM, 9 AM–1 PM, 1–5 PM, and 5–9 PM. Rain and light
affect only their own block. The daily result stays within its block range.
Leader/tie language must match the accepted display tolerance.

Today changes to Tomorrow at 9 PM local time. Midnight/4 AM refreshes update
only future blocks; completed blocks freeze after 9 AM, 1 PM, 5 PM, and 9 PM.
Test timezone, UTC rollover, and daylight-saving boundaries.

### 10.3 Fixed historical replay

Predeclare the longest reliable interval before inspecting results; normally at
least five complete seasons. Record current-source availability and historical
overlap separately. Shorter overlap requires a documented owner exception and
longer sensitivity analysis before public acceptance.

For every usable day and all four blocks report coverage/missing inputs and min,
p10, mean, median, p90, max, label shares, confidence/cap frequency, leader
frequency, and block spread. Provide rows for Beginning, Building, Peak,
Tapering, Ending, and every residual/holding stage, plus an all-blocks row.

Acceptance invariants:

- Peak has the highest mean daily Activity score.
- Building and Tapering are lower shoulders, normally within 20 points of Peak.
- Pre-run, Beginning, Ending, and residual/post-run remain below Peak without
  unexplained date cliffs.
- Environmental inputs still distinguish days and years inside each stage.
- Warm/barrier/extreme/missing caps cannot be bypassed by light or stage
  shaping.
- Salmon and Steelhead retain different terminal biology.

If the lifecycle shape fails, first verify calendar, sources, reach, thresholds,
and replay interval. Only then consider a small versioned stage-response
adjustment with a true maximum. Never tune solely to create attractive label
shares.

Maintain a calibration ledger with baseline, field changes, evidence/product
reason, predicted effect, complete before/after replay delta, and accept/reject
decision. Rerun the entire fixed interval after every accepted calendar, source,
weight, breakpoint, cap, lifecycle, or scoring change.

### 10.4 Controlled Activity tests

Prove isolated light/rain changes stay in one block; temperature shoulders are
monotonic; warm/barrier/extreme caps hold; missing evidence never becomes
credit; weather-only language never claims measured river behavior; rollup and
leader/tie behavior are correct; lifecycle boundaries are continuous;
today/tomorrow freezing works; missing weather has no score/leader; and valid
provider recovery restores scoring.

Activity public output uses shared labels, four blocks, target date,
confidence/limitation, derived best-window drivers/limits, and the permanent
scope note. Do not author per-band headlines, Why copy, or Guide's Read.

## 11. Implementation rules

Implementation order:

1. River profile/foundation and sources.
2. Biology profile only if no existing profile genuinely fits.
3. Hidden run profiles and configuration document.
4. Spot Finder inventory when accepted.
5. Registry/review-catalog wiring.
6. Replays, fixtures, and audits.
7. Public promotion only after acceptance and authorization.

Use stable snake_case IDs and version configuration, presence curve, Activity
rules, Fishing Shape bands, source data, and audit decisions. Reuse helpers only
for genuinely identical mechanics; keep evidence and decisions river/species
specific. Do not relax validation to make incomplete research pass.

The configuration-field reconciliation must prove every code value appears in
the dossier and every accepted dossier value appears in code. `Inherited`,
`default`, or `same as River X` is not provenance.

## 12. Verification and owner review

Run the generic structural gate first:

```bash
npm run river-run:onboarding:validate
npm run river-run:onboarding:audit
npm run river-run:onboarding:validate-packet -- --river-id example_river
npm run qa:river-run:onboarding
npm run qa:river-run:onboarding-weather-activity
```

Then run the appropriate full Activity and Fishing Shape replays, fixture
generation/check, engine tests, copy/UI QA, Spot Finder audit, type checks, and
production-shaped smoke for the affected configuration. Prefer generic scripts
with `--run-id`; add a reusable generic path rather than another river-specific
algorithm.

Fixtures must declare intended states. Cover every Stage boundary, Seasonal Zone
transition, Presence band/direction/terminal state, Activity label/block/
confidence/cap/missing/tie/today-tomorrow state, Fishing Shape band or
unavailable state, Gauge Read freshness/failure/recovery state, and valid
cross-surface tensions.

Replay Seasonal Zone every active calendar day and ensure canonical ordering,
presentation/species endpoint limits, and barrier compliance. Owner-review
selectors must expose both sides of every Stage or Zone transition.

Current Live owner review must use authenticated production-shaped providers.
Scenario fixtures may control primitives but never replace visible Gauge Read
with synthetic current measurements. Review the complete page on narrow iOS and
Android widths with long names, expanded Gauge Read, Spot Finder, every read,
and terminal states.

## 13. Acceptance and release gate

A river is accepted only when:

- identity, reaches, barriers, passage chains, endpoints, regulations, and
  sources are versioned and approved;
- every supported species has independent calendar, strength, distribution,
  presence, lifecycle, Activity, and capability decisions;
- Activity's final fixed replay, stage-by-block table, calibration ledger, and
  controlled tests pass;
- Gauge Read/Fishing Shape/Spot Finder capabilities and fail-closed behavior are
  honest;
- dossier-to-code reconciliation, configuration validation, fixtures, engine,
  copy, UI, and visual review pass;
- owner acceptance is recorded and unresolved combinations remain hidden.

After separate deployment/public authorization:

1. Enable accepted `publicAudit`, promote public registries, remove draft
   entries, and update exact catalog counts/IDs.
2. Confirm whether production uses static or database configuration. Do not
   create a migration for a static-catalog-only release. Reconcile local and
   linked migrations when schema/data/cron changed.
3. Bump cache-relevant engine/config/copy/data versions.
4. Run the complete release gate, deploy the River Run function, verify its
   version/update time, smoke the full production catalog and protected refresh,
   and distinguish provider outages from code health.
5. Commit atomically, fetch, push the owner-specified branch, and prove local
   HEAD equals remote, ahead/behind is `0 0`, and the worktree is clean.
6. Record what is server-live versus what requires a new mobile build, plus all
   limitations and re-audit triggers.

## 14. Single-dossier record

Future onboarding uses one per-river `river-onboarding.md` dossier generated by
the scaffold command. It contains these compact records:

- status/version/owner decisions;
- evidence ledger and contradiction log;
- identity/corridor/reach table;
- complete barrier and species passage-chain table;
- regulation table;
- source probe/capability table;
- Spot Finder section/access table or explicit fail-closed decision;
- candidate species matrix;
- one repeated run field/calendar/presence/Activity/Fishing Shape section per
  supported species;
- Activity stage-by-block replay link and calibration ledger;
- code reconciliation, QA, owner acceptance, release, migration, deployment, and
  repository handoff record;
- post-review correction and generalized safeguard ledger.

Large generated replay tables and fixtures may remain machine artifacts linked
from the dossier. They are evidence, not additional onboarding instructions.

## 15. Continuous correction

For every owner or production finding, reproduce the state and classify the root
cause: identity, source, calendar, strength, passage/endpoint, measurement
reach, Activity tuning, Fishing Shape, Spot Finder, fixture, copy, or layout.
Correct structured truth, configuration, dossier, artifacts, and tests together.
Rerun every affected gate, including the full Activity interval for any
calendar/source/scoring change.

If the cause can recur, add a concrete field, validation, test, or command to
this guide and the automation. Do not add vague advice such as “research more.”
