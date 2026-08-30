# FinFindr River Run Rapid Onboarding Playbook

**Status:** Normative source of truth **Version:** 2.0 **Established:**
2026-08-30 **Branch family:** `develop/cross-platform-next` **Scope:**
Researching, configuring, validating, reviewing, and handing off a new River Run
river and its supported migratory salmonid runs

**Version 1.1 learning source:** Grand, Platte, and White onboarding and
Activity audit. It adds full-calendar evidence classification, ordinal strength
comparison, species-specific passage chains, same-reach Activity decisions,
provider recovery, cross-year replay, fast execution, and post-review learning
requirements.

**Version 1.2 learning source:** production promotion and final live-source
audit for Grand, Platte, and White. It adds an explicit ordered release phase,
static-catalog promotion, migration reconciliation, engine/data-version cache
invalidation, complete public-catalog smoke coverage, hourly Gauge Read refresh,
visible observation age, unreadable-provider behavior, post-deploy verification,
atomic commits, and clean synchronized handoff.

**Version 1.3 learning source:** planning the Milwaukee, Sheboygan, Root, and
Bois Brule onboarding wave. It makes approval gates mandatory for multi-river
batches so shared research remains efficient without silently authorizing one
continuous research-to-release implementation.

**Version 1.4 learning source:** Wisconsin species-truth review. It adds an
explicit facility-coverage audit before using weir/ladder/trap counts for
strength and a provenance contract for owner-relayed local field calibration.

**Current runtime boundary:** River Run presently supports the Great Lakes
region, its configured state enum, and the implemented run/biology engines. A
river in another state is not automatically a supported biological region.
Expanding beyond those types requires a separately reviewed schema, biology,
movement-engine, regulations, catalog, and copy-model expansion before this
river workflow can be applied. Never disguise a new-region build as ordinary
configuration onboarding.

## 1. Authority

This is the controlling workflow for future River Run onboarding. Every agent
must read it completely before researching or changing a river.

Supporting normative standards, in order:

1. `docs/river_run_copy_model.md` — public copy and geography rules.
2. `docs/river_run_activity_onboarding_standard.md` — Activity research,
   calibration, replay, copy, and acceptance.
3. `docs/river_run_live_conditions_onboarding_standard.md` — Gauge Read sources,
   date context, trends, provenance, and unavailable behavior.
4. Current engine types, validation, scoring code, and tests — runtime behavior.
5. The river’s versioned onboarding packet and accepted audit — researched
   river/run facts.
6. `docs/templates/river_run_river_foundation_template.md`,
   `docs/templates/river_run_live_conditions_template.md`,
   `docs/templates/river_run_species_run_template.md`, and
   `docs/templates/river_run_acceptance_template.md` — required packet shape.

Older six-primitive, five-primitive, release-branch, Push, or Migration Timing
instructions are historical. Timing and Push may remain internal for backward
compatibility, but they are hidden and are not part of public onboarding, public
copy acceptance, navigation, or the visible primitive order.

When sources, code, or standards disagree, stop and record the contradiction. Do
not silently select the convenient answer. A change to an accepted score,
calendar, public section, capability, or biological conclusion requires an
explicit versioned decision.

### 1.1 Ordered execution map

An onboarding agent follows this sequence without skipping ahead:

1. Preflight the branch, worktree, runtime contract, existing portfolio, and
   provider adapters.
2. Scaffold one river packet plus one run packet for every independently
   supported species.
3. Phase A: lock exact river identity, jurisdiction, public sections, every
   barrier, and each species endpoint.
4. Phase B: probe real providers and lock Live Conditions capabilities,
   freshness, reach, historical context, and honest unavailable behavior.
5. Phase C: research every run field—calendar, strength, distribution,
   lifecycle, presence curve, Fishing Shape calibration, and terminal semantics.
6. Phase D: select and calibrate Activity independently for each river/species.
7. Phase E: verify the shared public read model and structured Seasonal Zone;
   author only durable river/source limitations that cannot be structured.
8. Phase F: implement hidden configuration, review catalog, validation, and
   generated fixtures.
9. Phase G: replay, run structural/copy/UI/type QA, and obtain rendered owner
   acceptance.
10. Phase H: only after explicit authorization, promote public registries,
    reconcile migrations/config source, deploy, and smoke production.
11. Phase I: commit and push atomic work, prove the remote is synchronized and
    the worktree clean, and record limitations and future re-audit triggers.

Research acceptance, rendered owner acceptance, deployment authorization, and
public enablement remain separate recorded decisions even though this document
describes the complete path through all four.

### 1.2 Mandatory stop gates for multi-river batches

An instruction to onboard several rivers is authorization to begin the staged
workflow, not authorization to complete every phase in one uninterrupted run.
The agent must stop, present the required artifacts, and receive explicit owner
approval at each gate below. Approval of one gate authorizes only the next gate.
Silence, a general statement such as "looks good," or an earlier approval for a
different river must not be stretched into later-phase authorization.

Use this sequence for a multi-river wave:

1. **Readiness gate — entire cohort.** Read the standards, inspect the branch,
   runtime, portfolio, provider adapters, and overlapping changes, then deliver
   the section 18 readiness response and proposed river identities. Stop for
   approval before substantive onboarding research or code changes.
2. **Foundation and source-feasibility gate — entire cohort.** Research exact
   identities, jurisdictions, sections, complete barrier inventories,
   preliminary species support, regulations, candidate gauges, weather points,
   and real live/history endpoint feasibility. Deliver one foundation/source
   packet per river plus unresolved contradictions. Stop before detailed run
   configuration.
3. **Portfolio species-truth gate — entire cohort.** Deliver the side-by-side
   support, relative-strength, distribution, evidence-quality, calendar-anchor,
   and endpoint matrix for every candidate river/species combination. Exclude
   unsupported combinations explicitly. Stop before runtime implementation.
4. **River truth and non-Activity gate — one river at a time.** For one approved
   river, finish every supported species packet, full field reconciliation,
   calendars, Seasonal Zone, Migration Stage, Seasonal Presence,
   Fishing Shape/Gauge Read behavior, and hidden candidate configuration. Stop
   for owner truth/copy review before Activity calibration for that river.
5. **Activity and rendered-review gate — the same river.** Select the data mode,
   run full fixed historical replays for every supported species, tune only
   through the controlled ledger, verify lifecycle shape and caps, generate
   fixtures, run UI/copy/structural QA, and present rendered private review.
   Stop for owner acceptance before starting the next river.
6. Repeat gates 4 and 5 for each remaining river. A correction reopens the
   affected gate and every downstream audit it can influence.
7. **Consolidated cohort gate.** After every river is individually accepted,
   present cross-river calendars, strengths, endpoints, source capabilities,
   Activity stage means, limitations, commands, and results. Stop for explicit
   cohort acceptance.
8. **Release gate.** Deployment and public enablement still require their own
   explicit authorization. Then, and only then, perform Phases H and I.

Do not hide work from a later gate inside an earlier one. In particular, do not
implement Activity while awaiting river truth approval, do not begin the next
river while the current river's rendered review is unresolved, and do not
promote or deploy during private review. The owner may explicitly combine or
skip a stop, but the agent must never infer that choice merely from the size or
urgency of the request.

## 2. Current product contract

The visible River Run order is fixed:

1. Migration Stage
2. Activity
3. Seasonal Presence

Live Conditions, presented as Gauge Read, appears above the reads. It is an
unscored measurement surface. Calibrated internal Fishability output appears
there as compact Fishing Shape context, not as a separate tab.

Primitive ownership:

| Surface         | Owns                                                                                                                                        | Must not claim                                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Migration Stage | Fixed researched seasonal phase and a structured, calendar-based Seasonal Zone                                                               | Live abundance, confirmed distribution, current movement, responsiveness, catch probability, an access recommendation |
| Activity        | Conditional responsiveness of fish already present and differences among four supported time blocks                                         | Abundance, migration, catch probability, exact fish location, proof of feeding                                  |
| Seasonal Presence | Approximate historical seasonal presence relative to that river/species ceiling                                                           | Live fish count, current movement, bite quality, exact location                                                 |
| Fishing Shape   | Presentation control and the shape of fishable water represented by the accepted hydraulic source                                           | Abundance, responsiveness, access, wading/boating safety, the entire river unless audited                       |
| Live Conditions | Current measurements, source-appropriate precision, date-based historical context, 24-hour trend, freshness, station, and represented reach | A score, migration inference, clarity inference, safety, fish presence, whole-river conditions without evidence |

Valid tension is expected. High seasonal presence can coexist with low Activity.
Excellent Fishing Shape can coexist with low Seasonal Presence. Do not rewrite one
surface to make independent conclusions superficially agree.

### 2.1 Rapid implementation budget

The product no longer requires a primitive-copy matrix. For a new river, the
incremental public implementation is limited to:

- one canonical river foundation and ordered reach set;
- one river-level Spot Finder inventory, reused by every eligible species;
- one required Lower/Middle/Upper position and concrete boundary range for each
  Spot Finder section so Migration Stage can recommend broad sections automatically;
- rare species filters only where endpoints genuinely differ;
- structured station, source, represented-reach, and regulation facts;
- per-species calendars, presence curves, endpoints, and Activity calibration;
- Fishing Shape bands when the accepted hydraulic source supports them.

Phase sentences, scope notes, Seasonal Zone labels, Activity evidence text, and
Seasonal Presence presentation are shared or derived. Do not author replacements
for them. Ten implementation-ready rivers can be configured in one day only
when their evidence packets, access sources, gauges, barriers, calendars, and
species decisions are already resolved; the speed target never permits skipping
those truth gates.

## 3. Non-negotiable safety and release boundaries

- Start only from the clean pushed development branch specified by the owner.
- Never modify `release/app-store-v1` or release tags.
- Do not deploy, publish a configuration, or publicly enable a river without
  separate explicit authorization.
- Do not make App Store or Play Store release-version changes during ordinary
  river onboarding.
- Do not claim safety, access, legal methods, or current closure status from
  River Run section guidance.
- Fail closed when geography, passage, source scope, biological support, data
  capability, or a material copy fact is unresolved.
- Preserve unrelated user changes in a dirty worktree. Stop if they overlap the
  onboarding files and cannot safely be separated.

Acceptance, deployment, and public enablement are three separate decisions.

## 4. The unit of work

Onboard one river foundation once, then configure all supported species runs
against it.

River-level facts:

- Identity, timezone, mouth, corridor, and presentation jurisdictions.
- Public sections and named endpoints.
- Dams, barriers, passage, closures, and product limits.
- Regulations and access disclaimers.
- Hydraulic, measured-temperature, and weather sources.
- Live Conditions metrics, history, freshness, attribution, and reach.
- Target species capability.

Run-level facts:

- Species biology and run type.
- Seasonal dates and stage substates.
- Historical-presence ceiling, distribution scope, and curve.
- Activity rules, lifecycle behavior, and replay.
- Fishing Shape bands or deterministic unavailable behavior.
- Structured Seasonal Zone, shared public read behavior, and terminal semantics.

Every configurable run field is a research or calibration decision. A run is not
researched merely because occurrence, three headline dates, and a ceiling have
citations. The packet must inventory every field that can change runtime
behavior and trace it to direct river/species evidence, a documented cross-river
comparison, or an explicitly identified owner calibration.

Never repeat river geography research independently for each species. Never
assume shared geography means shared calendar, presence, passage, Activity, or
lifecycle.

### 4.1 Evidence questions that must remain separate

For each species, answer these independently:

1. Does the species occur in the connected system?
2. Is there a recurring migratory run in the configured river?
3. Is it a dependable public opportunity, or sparse/occasional?
4. Where can that species actually pass, and what is the conservative product
   endpoint?
5. When do first entry, building, peak, decline, and the terminal tail occur?
6. How strong is the run relative to the accepted portfolio, and how widely is
   it distributed?
7. How good is the evidence for each conclusion?

Do not let a strong answer to one substitute for another. Stocking can support
occurrence without proving adult strength. A weir collection date can document
mature fish without identifying initial entry. One ladder count can prove
passage at that structure without describing the whole river. A famous river
name does not establish every species.

## 5. Create the onboarding workspace

From the repository root:

```bash
npm run river-run:onboarding:init -- \
  --river-id example_river \
  --display-name "Example River" \
  --state MI
```

This creates:

```text
docs/onboarding/river-run/example_river/
├── river-foundation.md
├── live-conditions.md
├── acceptance.md
└── runs/
    ├── fall-chinook.md
    ├── fall-coho.md
    └── fall-steelhead.md
```

The scaffolder currently accepts only the state codes implemented by the Great
Lakes runtime types. A rejected state is an engine-expansion signal, not a
reason to edit around the guard.

The scaffolder never overwrites an existing workspace. Do not rename packet
files; automation and reviewers rely on the stable layout.

The default three species files are research candidates, not an assertion that
all combinations are supported. A combination becomes public only after its own
evidence, configuration, replay, copy, and acceptance pass.

Absence of a result in one current summary page is never proof that a run does
not exist. A disabled or unsupported decision has a higher evidence burden than
a supported-but-conservative draft because a false negative removes a real
fishery from the product.

### 5.1 Fast-start research bundle

Before opening many browser tabs, create one shared river evidence bundle and
one species comparison matrix. Search and capture authoritative sources once,
then route each supported fact into the foundation and affected run packets.

The shared bundle should contain:

- Current agency river/fishery assessments and regulations.
- Official barrier, ladder, weir, removal, and passage records.
- Live and historical station metadata plus actual endpoint probes.
- Stocking, creel, harvest, passage, egg-take, enforcement, and technical-report
  archives for all candidate species and aliases.
- Accepted portfolio runs used only for comparison.

The species matrix should place Chinook, Coho, and Steelhead side by side for
occurrence, recurrence, strength evidence, dates, distribution, barriers,
lifecycle, source quality, contradictions, and unresolved facts. This exposes
cross-species inconsistencies early and prevents repeated river research.

Store exact report titles, URLs, publication/event dates, relevant pages or
tables, and limitations immediately. Do not rely on remembered search snippets
or plan to reconstruct citations after configuration.

## 6. Phase A — river foundation lock

### A1. Inspect before researching

Record:

- Current branch and worktree state.
- Existing river IDs, run IDs, source IDs, and naming conventions.
- Current engine/profile availability.
- Existing shared biology profiles that might fit.
- Current UI catalog behavior for supported and disabled combinations.
- Any user work already in progress.

Do not begin by copying the nearest river configuration.

### A2. Research hierarchy

Use current primary/authoritative sources first:

1. State fish and wildlife agency and current regulations/orders.
2. USGS, NOAA, USFWS, USACE, FERC, tribal authority, municipal owner, or
   documented operator.
3. Peer-reviewed research and official technical reports.
4. Established conservation organizations or watershed operators for station
   metadata when they own the relevant monitoring network.
5. Secondary sources only to locate primary material or document local names.

Every material fact needs an evidence-ledger entry with title, authority, URL or
repository path, publication/update date when available, access date, specific
supported facts, geographic reach, and limitations.

Do not cite a search-results page. Do not turn a URL list into implied support.

### A3. Confirm exact identity and lock public geography

Before defining sections, prove the exact waterbody: official name and aliases,
state/jurisdictions, counties, coordinates, source and mouth, receiving basin or
Great Lake, and runtime presentation state. When a name repeats, document the
similarly named river that is **not** in scope. Do not assume a common name
identifies one waterbody or that a river is wholly within one state. Boundary
waters and rivers with separate same-name basins require an explicit identity
decision before research continues.

Define two to four ordered, recognizable sections. Three is preferred when the
river naturally supports it. Each section needs:

- Stable ID and public label.
- Named downstream and upstream boundaries.
- Order from the mouth.
- Migration accessibility by supported species.
- Accepted public landmarks.
- Gauge coverage and limitations.
- Citations.

The product owner must approve exact public labels and endpoints before state
copy begins. Technical points that normal anglers do not recognize are not
acceptable merely because they are precise.

### A4. Complete the barrier inventory

Search current and historic/local names for:

- Dams, diversions, and low-head structures.
- Weirs, lamprey barriers, gates, and temporary controls.
- Natural falls or documented rapids barriers.
- Fish ladders, lifts, bypasses, and passage programs.
- Removed, breached, defunct, reconstructed, and proposed structures.
- Associated fishing closures and exclusion zones.

Verify structure status and fish passage separately. A ladder is not proof of
unrestricted, year-round, species-neutral passage. When passage affects where
the app sends users, use a second authoritative source when possible.

Record a separate endpoint decision for each species. Different endpoints are
expected when ladder design, operations, attraction, documented passage, or the
evidence chain differs. Inventory every intervening structure from mouth to
endpoint; proving passage at the last dam does not prove passage through all
earlier dams. Temporary weirs and signed exclusion zones can be product limits
even when they are not permanent biological barriers.

Keep three concepts separate: the physical/biological endpoint, the dependable
opportunity distribution, and the reach represented by measurements. An access
guide naming a species at one site—or omitting it at the next—is not exclusion
evidence and must not be turned into a biological stop. A run may share the
river's physical endpoint while remaining strongly lower-river weighted, and an
observed score may cover only the gauge reach inside that larger corridor.

An unresolved barrier ends the public corridor below it. Limited passage is not
rewritten as impassable; product scope and biological passage remain distinct.

### A5. Lock regulations and access language

Record current jurisdiction, effective dates, affected reaches, and the exact
public reminder. Section names are orientation ranges. They do not promise
public access, a uniform tackle rule, harvest legality, or safe entry.

Reverify time-sensitive rules immediately before release even when the initial
foundation research passed.

### A6. Foundation approval gate

No run implementation begins until:

- Geography and endpoints are approved.
- Barrier/passage inventory is complete or conservatively bounded.
- Source reach is explicit.
- Regulations are recorded.
- Target species are evidence-supported.
- Contradictions have decisions.
- The foundation packet says `approved` with a version and owner date.

## 7. Phase B — source and Live Conditions lock

Follow `docs/river_run_live_conditions_onboarding_standard.md`.

### B1. Probe capabilities

For each plausible source verify the real endpoint and parameter:

- Provider/site/series identifiers.
- Physical station location.
- Live metric availability and units.
- Observation cadence and actual recent freshness.
- Historical endpoint, record length, and material gaps.
- Datum or method discontinuities.
- Provisional/revised semantics.
- Attribution/license.
- Represented reach.

Do not accept a source because a station exists on a map. Prove that the exact
series and needed live/history endpoints work.

Probe returned timestamps and numeric values, not only HTTP success. Record
parameter codes, null/sentinel behavior, timezone, unit conversion, cadence,
rating or datum changes, provider maintenance notices, and a reproducible probe
date. When a source temporarily fails, the app must automatically resume normal
fresh display and scoring after valid readings return; ordinary provider
recovery must not require a code change. While the provider is faulty, fail
closed and show the truthful stale/missing state.

### B2. Select source roles

- One primary hydraulic source is enough.
- Never average raw discharge or gauge height across stations.
- Select measured-temperature sources by audited priority.
- Label fallbacks and constrain claims to their reach.
- Weather is a modeled point, not measured river state.
- If no gauge passes, configure an honest no-gauge state; the river can still
  support Stage, Seasonal Presence, and a separately accepted weather-only Activity
  model.

### B3. Date context and trend

Date averages use the same calendar date ±3 days across prior years. They are
not broad seasonal averages. The product discloses record length and window.
Missing days remain part of the freshness/coverage truth.

Twenty-four-hour change uses an accepted prior observation near the target time.
Missing prior evidence produces an unknown trend, never a fabricated stable
result.

### B4. Live Conditions gate

Test fresh, partial, delayed, older-than-24-hours, missing, fallback, historical
unavailable, and long-station-name states on narrow iOS and Android widths.

## 8. Phase C — configure all species/run truth profiles

Research all candidate species together after the foundation locks. This lets
the agent resolve river-level evidence once while preserving species-specific
truth.

For each species:

1. Complete the candidate capability audit below, then confirm the run and
   movement-engine fit.
2. Select or create an evidence-matched biology profile.
3. Set staging, entry, building, peak, tapering, ending, tail, and return
   boundaries.
4. Record which dates are directly sourced and which are owner-calibrated.
5. Set a river-specific presence ceiling and independently researched
   distribution scope.
6. Build versioned presence anchors with biological/observational reasons.
7. Define species-specific barrier response.
8. Define lifecycle and terminal behavior.
9. Configure Fishing Shape calibration or deterministic unavailability.
10. Complete the dedicated Activity track.

### C0. Calendar evidence protocol

Research the complete curve, not only start/peak/end. Prefer direct river
records that expose dates or weekly distributions: weir/ladder daily counts,
harvest tables, creel timing, egg-take operations, enforcement observations, and
agency fishery descriptions. Record the event year separately from the
publication year.

Distinguish:

- Fish concentrating near the mouth from entering the river.
- Sparse first arrivals from dependable beginning.
- Peak migration/passage from peak harvest, spawning, egg take, or agency
  operations.
- One unusual year from the intended multi-year calendar.
- A structure becoming effective from the fish actually arriving that day.

When only a biased or incomplete operation exists, use it as a bounded anchor,
state the limitation, and avoid false day-level certainty. Calendar anchors are
product dates informed by evidence; label them as calibrations unless the source
directly establishes the same boundary.

### C1. Strength and distribution protocol

The 1–10 maximum is an ordinal portfolio calibration, not a population count.
Complete a portfolio comparison before selecting it. At minimum compare:

- Direct adult counts and their years/coverage.
- Creel/harvest and destination-fishery evidence.
- Current and historic stocking in the receiving river.
- Natural reproduction and tributary contribution.
- Corridor length, concentration, and passage attrition.
- Recency, trend, and whether evidence represents the mouth, one ladder, one
  reach, or the whole accessible river.

For every weir, ladder, trap, or egg-take count, audit the actual operating
window, capture efficiency, pre-installation passage, high-flow bypass, manual
passage, and species/strain timing before using the series for relative
strength. A small bounded facility sample is not proof of a small seasonal run,
and a large sample is not automatically a whole-river census. Preserve the raw
count as agency evidence, state what it sampled, and calibrate only the claim
that its coverage can support.

Local field knowledge may resolve a product-strength judgment when agency data
establish recurrence but cannot measure the relevant opportunity. Record who
supplied it, which river/species/season it covers, and whether effort and
observation years are known. Treat it as an explicit owner/local calibration,
not as a fish count or a substitute for agency biology, regulations, or source
capability.

Set `maximum` and `distributionScope` independently. A small run can be broad; a
strong run can be concentrated. Record the closest lower and higher accepted
portfolio comparators and why the proposed run belongs between them. If the
evidence cannot distinguish adjacent ratings, choose conservatively and mark the
calibration confidence instead of manufacturing precision.

### C2. Mandatory configuration-field inventory

Before implementation, copy the current engine/profile schema into the run
packet as a field inventory. Complete it for every species independently. The
minimum inventory is:

- Identity, biology profile, migration purpose, lifecycle, run type, movement
  engine, and every primitive capability decision.
- All 13 seasonal boundaries, optional handoff, and the meaning/evidence for
  each boundary.
- Presence maximum, absolute opportunity tier, distribution scope, curve
  version, every anchor, endpoint/barrier behavior, and terminal semantics.
- Activity mode, represented reaches, every source, component weight,
  temperature breakpoint, hydraulic response, cap, lifecycle ramp, missing-data
  rule, confidence rule, four-block behavior, and refresh rule.
- Fishing Shape metric/source/reach, every band boundary, trend behavior,
  freshness behavior, and unavailable-state contract.
- Baseline coverage, water-temperature priority/fallback, current-versus-
  historical source limitations, copy strategy, version IDs, and audit gates.

For every field record: proposed value, direct evidence IDs, comparison runs,
why those comparisons are genuinely comparable, calibration owner, replay or
test artifact, and status. `Inherited`, `default`, `same as River X`, or an
uncited value is not a completed row. Shared species biology may support a
breakpoint, but river observations and source reach still require independent
validation.

Comparison is a required reasonableness check, not a copying method. Compare
calendars and ceilings with all accepted portfolio rivers and compare current
stocking only where stocking is biologically relevant. Also compare weir or
ladder returns, creel/catch evidence, natural reproduction, destination-fishery
status, corridor length, passage attrition, spatial concentration, and recency.
Stocking volume alone never determines adult run strength, and an upstream
ladder count never represents the whole river without an explicit passage model.

The independent verifier must reconcile the completed inventory against the
actual configuration object. Any configured value missing from the packet, or
any packet value not reflected in code, blocks review.

Do not infer Coho dates from Chinook, Steelhead lifecycle from salmon, or run
strength from river size or reputation.

### C3. Mandatory candidate capability audit

Before either `supported` or `unsupported` is allowed, search each candidate
independently using the scientific name and local aliases such as `king`,
`silver`, `rainbow`, and `steelhead`. Record affirmative and contradictory
findings from all applicable source classes:

1. Current agency fishery assessments and destination/species lists.
2. Current stocking database records, including the receiving water and life
   stage; hatchery production alone is not river stocking evidence.
3. Weir, ladder, harvest, egg-take, creel, and passage reports, including the
   agency technical-report archive.
4. Current agency field observations, conservation-officer reports, and advisory
   minutes.
5. Regulations and closures as context only; legal coverage does not prove a
   biological run.

Separate four questions in the packet: `occurs in system`, `recurring run`,
`dependable public opportunity`, and `calibration quality`. A sparse, stray, or
wild run may justify a lower ceiling and concentrated scope; it must not be
rewritten as absent. Weak date or abundance calibration blocks precision, not
the already-established existence of a run.

An `unsupported` decision requires affirmative exclusion evidence or a logged
contradiction search across every applicable source class. “Not found,” an
omission from a curated list, no direct stocking, and evidence for a different
season are insufficient individually or together. If existence evidence and
calibration evidence conflict, mark the combination `research_unresolved`, keep
it hidden, and escalate it for independent verification—never gray it as
unsupported.

The independent verifier must attempt to falsify every capability decision,
including checking historic reports that predate current web summaries. A
species/run cannot enter review fixtures until that contradiction search is
recorded.

## 9. Phase D — dedicated Activity track

Follow `docs/river_run_activity_onboarding_standard.md` completely.

Activity is the most calibration-sensitive public primitive. Shared scoring
mechanics do not authorize borrowed weights or thresholds.

Minimum deliverables per river/species:

- Explicit observed-river or weather-only mode.
- Source and reach contract.
- Species/lifecycle evidence.
- Component weights with rationale.
- Temperature response and constraints.
- River-behavior input and limitations.
- Restrained precipitation behavior.
- Four-block and day-rollup contract.
- Today/tomorrow schedule behavior.
- Missing-data/confidence contract.
- Multi-year replay with coverage and distribution statistics.
- Stage-by-stage and stage-by-four-hour-block score distributions, including
  sample count, mean, min, p10, median, p90, and max for Beginning, Building,
  Peak, Tapering, Ending, and any residual/holding state.
- A before/after calibration ledger for every scoring change made after replay,
  with the biological/product reason and a full rerun after the change.
- Controlled single-variable tests.
- Warm/cold/extreme/missing boundary tests.
- Lifecycle continuity tests.
- State copy and foreign-geography checks.

Activity remains blocked until historical replay and owner review pass.

### D1. Same-reach source decision

Observed-river Activity requires accepted hydraulics and measured water
temperature that describe the same represented reach, plus the accepted weather
point. Nearby stations on opposite sides of a dam, lake, major tributary,
tailwater boundary, or long corridor cannot be combined merely because both are
on the named river. Live Conditions may still display each separately with its
own reach label.

If two nearby mainstem stations could represent a narrow reach, run a proxy
validation before rejecting or accepting the pair: map the distance and every
intervening control; compare simultaneous observations against any archived or
co-located reference; report signed bias and absolute-error percentiles; check
construction-era changes; then bind the score to the narrowest defensible reach.
This evidence authorizes only that reach, never the whole named section.

When the sources do not pair, decide explicitly between:

- A narrower observed reach with truly compatible inputs.
- An independently calibrated weather-only profile.
- Activity unavailable while research continues.

Never silently fall back from observed-river to weather-only at runtime.
Observed models must also state whether one missing river input is capped
Moderate and which combinations are Unavailable. Full confidence requires all
configured measured inputs plus usable target-day hourly weather.

### D2. Missing-primary-evidence calibration

Weather-only weights must total one using only supported weather inputs. If the
omitted input is the species' primary accepted response driver—measured water
temperature for current Steelhead profiles, for example—review whether a
versioned proportional evidence scale or stricter true maximum is necessary.
Such a control requires a biological/product rationale, sensitivity replay,
before/after ledger, and owner review. It cannot be introduced only to create a
prettier label histogram, and it must not be copied to other species.

Missing required hourly weather returns `Unavailable`, no score, no blocks, and
no strongest-window language. It is not an Inactive zero. Provider recovery must
restore scoring automatically when complete valid hours resume.

## 10. Phase E — verify the shared public read model

Follow `docs/river_run_copy_model.md`.

Do not create a river/species paragraph matrix. Verify structured truth and let
the shared presentation layer render it. Every supported run requires:

- exact stage triggers and canonical labels;
- a Seasonal Zone constrained by foundation, presentation state, and species
  endpoint;
- presence curve, ceiling, direction, and terminal semantics;
- Activity blocks, confidence, drivers, limits, and unavailable behavior;
- Fishing Shape bands or deterministic unavailability;
- Gauge Read source/reach/freshness metadata;
- one river-level Spot Finder inventory when its corridor aligns;
- deterministic Migration Stage-to-Spot Finder recommendations that include
  every access in selected sections, never a hand-ranked access point;
- only the durable limitation copy that cannot be represented structurally.

Copy review order:

1. Migration Stage and Seasonal Zone across the full calendar.
2. Seasonal Presence curve/direction/terminal states.
3. Fishing Shape bands, trends, freshness, and unavailability.
4. Activity blocks, confidence, lifecycle, and today/tomorrow states.
5. Valid cross-primitive combinations.

Required leakage checks include foreign river/dam/city/station names, internal
reason codes, thresholds, weights, percentiles, engine IDs, source IDs,
configuration language, and provider implementation names.

## 11. Phase F — configuration implementation

Keep new work isolated by river and run whenever practical. Shared registries
are changed once by the integration owner after foundation and run profiles
validate.

Implementation order:

1. River profile and foundation.
2. Source configs and refresh schedule.
3. Biology profile only when an existing profile is not a genuine fit.
4. Run profiles.
5. Catalog/configuration document.
6. Review fixtures and audit artifacts.
7. UI catalog coverage and disabled-state behavior.

Requirements:

- Stable snake_case IDs.
- Version every configuration, presence curve, Activity ruleset, copy set, and
  audit.
- Keep source/provider IDs in configuration, not public prose.
- Preserve hidden legacy fields only where current engine validation requires
  them; do not expose them or let them control public acceptance.
- Do not relax validation to make incomplete research pass.
- Do not enable `publicAudit` until all gates are complete.

## 12. Phase G — replay and generated acceptance

### G1. Structural and portfolio validation

```bash
npm run river-run:onboarding:validate
npm run river-run:onboarding:audit
npm run river-run:onboarding:validate-packet -- --river-id example_river
```

The audit checks configuration validation, registry uniqueness, biology/run
matching, target-species coverage, foundation completeness, source-capability
coherence, Activity mode invariants, public-audit gates, visible primitive
order, and expected Live Conditions metrics. Packet validation fails when a
required file is absent or a template remains research-incomplete, unresolved,
pending, blocked, or unrendered.

### G2. Activity replay

Run the generic or accepted run-specific replay across the longest reliable
fixed historical window. Record why the window begins and ends where it does. Do
not select years after inspecting results solely to improve the distribution.

The replay must evaluate all four blocks for every usable day. Report overall,
per-stage, per-block, and stage-by-block counts and min/p10/mean/median/p90/max,
plus label shares, cap frequency, confidence states, missing-input states,
best-block frequency, and block spread. Review stage means as diagnostics: they
must be biologically coherent, but they are not arbitrary numeric targets to
force. Peak must be the highest mean; Building and Tapering must sit below and
normally within 20 points of Peak; Pre-run, Beginning, Ending, and residual
stages must be lower without unexplained cliffs. If accepted environmental
history masks that lifecycle shape, verify calendar/source/threshold accuracy
before testing a bounded, versioned stage-response adjustment. Such an
adjustment requires a true maximum and must not bypass warm, barrier,
extreme-flow, or missing-data caps. If a stage or block is too sparse to
interpret, extend the fixed reliable record or leave calibration blocked.

After any weight, breakpoint, cap, lifecycle, calendar, source, or scoring-code
change, rerun the complete fixed interval and attach before/after results. A
single attractive day, an overall mean, compile success, or fixture generation
cannot accept Activity.

Replay date iteration must use local seasonal intervals, not lexical month-day
loops. Runs that cross December into January must advance the end and all
affected stage/lifecycle dates into the following calendar year. The replay must
prove its expected-day calculation and include a cross-year controlled test
whenever `lateEnd` is earlier than `stagingStart`.

### G3. Fishing Shape replay

Replay every band and trend against accepted historical hydraulics. Confirm that
rare/excessive states are reachable for defensible reasons and extreme states
never become safety advice.

### G4. State fixtures

Fixtures must declare intended state and compare it with actual production
output. A fixture that snapshots whatever the current generator emitted is not
an acceptance test.

Cover:

- All Stage substates and terminal states.
- All presence bands and directions.
- All Fishing Shape bands/trends/freshness states or unavailable state.
- All Activity labels, confidence states, four blocks, leader ties,
  today/tomorrow states, lifecycle phases, caps, and missing modes.
- Representative valid cross-primitive tensions.
- Live Conditions fresh/partial/stale/missing/history states.

When a primitive changes from unavailable to an implemented candidate,
regenerate its private fixtures and update assertions so review cannot pass
against stale unavailable snapshots. Fixture generation, current-fixture
checking, and intended-state QA are separate commands and all must pass.

Every hidden run approved for owner review must also be selectable in the
development review catalog. Verify the complete State → Season → Species → River
path for every supported combination. A current generated fixture that cannot be
reached through the app is not review-ready.

Review Seasonal Zone cadence separately from score cadence. Seasonal Presence
curves must interpolate through configured anchors. During every active run,
replay each calendar day and verify that the zone progresses only through
canonical accessible reaches and never crosses a presentation-state or species
barrier. Adjust structured boundaries or endpoint reach IDs when needed; do not
solve geography with new prose.

The owner-review Stage selector must expose every date on which Stage or
Seasonal Zone output can change, not only the headline configuration anchors. Include the last day and
first day on both sides of `beginningEnd`, `peakEnd`, `taperingEnd`, `end`, and
`postRunLateCopyEnd`, plus every configured established/broad/peak checkpoint.
This prevents a valid intermediate transition—such as a Lower-first corridor
opening to a secondary inland check—from existing in production code while
remaining invisible to the owner reviewing fixtures.

Owner review has two separate modes. **Current Live** must run the selected
hidden configuration through the authenticated server/provider path used by
production. **Scenario Fixtures** remain isolated deterministic inputs for
boundary testing. The visible Gauge Read in either owner-review mode comes from
the current live response and fails closed when that request fails; fixture
measurements are never substituted. Synthetic gauge/temperature cases remain
automated acceptance artifacts, not a current-looking device read.

### G5. Cross-platform visual review

Review real device or faithful simulator output on iOS and Android, including
the narrowest supported widths and dynamic text wrapping. Inspect the complete
page, Gauge Read collapsed/expanded, every primitive tab, terminal states, and
long station/section names.

## 13. Phase H — authorized public release and production verification

Do not enter this phase from research approval alone. Record explicit owner
authorization for deployment and public enablement in `acceptance.md`.

### H1. Promote the accepted configuration

1. Set every accepted run's `publicAudit.isEnabled` to `true` and replace
   private-review audit/version language with a dated release version.
2. Add the river profile, every accepted run profile, and its configuration
   document to the public static registries.
3. Remove those values from the draft registries; draft registries must contain
   only genuinely unreleased candidates.
4. Update catalog QA to assert the exact unique river and run counts and every
   new run ID. Account for a canonical river intentionally appearing in more
   than one state presentation.
5. Update review/Activity QA that previously read the draft registry so it now
   validates the public profiles. A successful promotion must not silently make
   release QA stop testing the promoted runs.
6. Update acceptance packets from private-candidate claims to the actual
   accepted public scope and known limitations.

### H2. Reconcile runtime source, caches, and migrations

Before deploying, verify which configuration source production actually uses. If
`RIVER_RUN_CONFIG_SOURCE=static`, public registry promotion is authoritative and
a database configuration revision is not a substitute. If production uses
published database documents, validate and publish the accepted revision under
that contract. Never assume both paths are active.

Run the linked migration comparison and prove every local migration has the same
remote version. Create a migration only for a real schema/data/cron change; do
not manufacture one for a static-catalog release. Resolve local-only,
remote-only, duplicate, or reordered migrations before deployment.

Bump the appropriate engine, configuration, copy, or Live Conditions data
version whenever old cached rows could preserve prior scoring, catalog, copy,
freshness, or source behavior. Version bumps are cache contracts, not cosmetic
release notes.

### H3. Deploy and smoke the actual production surface

Required release gate:

1. Run formatting, diff checks, type checks, onboarding QA, UI/copy QA, provider
   normalization, all engine tests, and endpoint tests.
2. Regenerate fixtures after final versions change and prove `--check` produces
   no diff.
3. Deploy the River Run function only after the complete gate passes.
4. Verify the deployed function is active and its version/update time changed.
5. Call the real production `/rivers` endpoint and assert the exact unique
   river/run counts plus every newly released ID—not merely the first legacy
   river.
6. Exercise the protected refresh/production smoke when authorized credentials
   are available; its expected catalog must include every current public run.
7. Recheck linked migrations after deployment.
8. Record production function version, smoke response, counts, run IDs,
   migration result, and any provider outage separately from code health.

A provider malfunction is not a failed deployment when the adapter returns an
honest unreadable state, preserves the last readable observation time, and
recovers automatically. Conversely, an HTTP 200 catalog response alone does not
prove snapshot/provider health.

## 14. Phase I — repository and operational handoff

Keep the river release atomic. Preserve unrelated user work in a separate commit
rather than mixing it into the onboarding commit or deleting it. Before handoff:

1. Inspect the final staged file list and run `git diff --cached --check`.
2. Commit the river release with a specific message.
3. Fetch before push and stop on unexpected divergence.
4. Push the owner-specified development branch.
5. Prove `HEAD` equals the remote branch, ahead/behind is `0 0`, and
   `git status --porcelain` is empty.
6. State what is already live versus what requires a new mobile build. Edge
   function changes can be production-live while UI copy still awaits the next
   app binary.
7. Hand off the accepted limitations: missing gauges, reach mismatch,
   weather-only confidence, unresolved passage, regulation recheck dates, and
   provider/station changes that trigger re-audit.

## 15. Definition of done

A river is onboarding-complete only when:

- Foundation, sections, barriers, and current regulations are versioned and
  approved.
- Live Conditions capability and reach are audited.
- Every supported run has independent truth, presence, Activity, Fishing Shape,
  and structured-read acceptance.
- All three public reads and Gauge Read have complete reachable-state fixtures.
- No hidden Timing/Push surface or language is exposed.
- Activity replay coverage, distributions, boundaries, and copy invariants pass.
- The configuration-field inventory matches code and every material value has
  evidence/calibration provenance.
- Activity stage-by-block replay tables and the calibration iteration ledger are
  reviewed for every supported species.
- Date-average ±3-day behavior and 24-hour trends pass where supported.
- Catalog species/state behavior is correct, including intentionally disabled
  combinations.
- Portfolio validation, copy QA, UI QA, type checks, and production-shaped smoke
  tests pass.
- The product owner accepts public geography, copy, and visual output.
- If release is not authorized, configuration remains hidden and the packet
  explicitly records that deployment/public enablement were not performed.
- If release is authorized, public registries, runtime configuration source,
  migrations, deployment, production catalog, provider behavior, commits, remote
  synchronization, and clean worktree all pass Phases H and I.

## 16. Fast execution protocol

Speed comes from eliminating duplicate work and catching wrong assumptions
early—not from skipping evidence, replay, or the mandatory multi-river stop
gates in section 1.2.

Use this critical path:

1. Scaffold the packet and inspect current schema/tests.
2. Build the shared source bundle and three-species comparison matrix in one
   research pass, but present and approve the foundation/source and portfolio
   truth gates separately.
3. Lock geography, every barrier, species endpoints, regulations, and source
   reaches once.
4. Probe live/history providers concurrently and record reusable results.
5. Complete all species capability/calendar/strength packets side by side for
   one river at a time after the cohort portfolio gate passes.
6. Reconcile every configuration field before writing code.
7. Implement hidden river/run profiles with shared helpers only for genuinely
   identical mechanics; keep evidence and versioning species/river-specific.
8. Run structural QA before expensive historical downloads.
9. Batch independent replays by source/weather point, cache immutable archive
   responses where tooling supports it, and never change the fixed interval
   after seeing results without a documented data-quality reason.
10. Review compact summary tables first, then inspect stage-by-block and
    boundary outliers before tuning.
11. Rerun the full interval after accepted changes, generate private fixtures,
    and run copy/visual QA once scoring is stable.
12. Present one rendered owner review per river and stop for acceptance before
    beginning the next river; after all rivers pass, present one consolidated
    cohort review and explicitly list what remains hidden.
13. After explicit release authorization, promote all accepted registries once,
    run the complete release gate, deploy once, and perform one comprehensive
    production smoke across the entire catalog.
14. Commit/push the atomic release and prove the worktree and remote are clean.

Avoid repeated broad web searches, per-species duplication of river facts,
manual editing of generated fixtures, one-day score tuning, and premature dev
builds. Record reusable commands in `package.json` or the audit so another agent
can reproduce the work without reconstructing the process.

## 17. Multi-agent operating protocol

The preferred future team structure is:

| Role                   | Owns                                                                    | Must hand off                                      |
| ---------------------- | ----------------------------------------------------------------------- | -------------------------------------------------- |
| River lead             | Foundation, source reach, sections, barriers, regulations, decision log | Approved foundation version and unresolved list    |
| Species/run researcher | Calendar, presence, lifecycle, biology evidence                         | Completed run truth packet with evidence IDs       |
| Activity specialist    | Calibration, replay, boundary tests, Activity copy states               | Versioned rules and replay report                  |
| Copy reviewer          | Four-primitive state matrix and geography/certainty checks              | State-by-state corrections and copy version        |
| Integration owner      | Configuration, registries, fixtures, shared QA                          | Clean diff, commands, results, acceptance artifact |
| Independent verifier   | Re-runs gates and inspects claims against evidence                      | Pass/fail report; no silent fixes                  |

Parallel work begins only after the river foundation locks. Give each agent
isolated files. Only the integration owner edits shared registries. A handoff
must state files changed, commands/results, citations, owner-calibrated
decisions, unresolved issues, and whether deployment or enablement occurred.

## 18. Required agent start response

Before changing a future river, an agent must be able to state in its own words:

- The four visible primitives and their ownership.
- Why Live Conditions is separate and unscored.
- The river-level versus run-level split.
- The barrier/passage fail-closed rule.
- Why endpoints can differ by species and require a complete passage chain.
- Why a physical endpoint, opportunity distribution, and measurement reach are
  separate decisions.
- Why migration, harvest, spawning, egg-take, and operations dates are not
  interchangeable.
- Why run strength and distribution scope are separate portfolio calibrations.
- The difference between observed-river and weather-only Activity.
- Why Activity requires a river/species replay.
- Why cross-year seasons require year-aware replay dates.
- The date-average ±3-day rule.
- How provider faults fail closed and valid readings automatically recover.
- Why Gauge Read refreshes independently each hour while scored primitives may
  retain a different audited cadence.
- Why provider observation time, server refresh time, and device display time
  are different and must never be presented as one timestamp.
- The separation of acceptance, deployment, and public enablement.
- How static versus database configuration source changes the release action.
- How migration reconciliation, production smoke, commit/push, and clean remote
  verification close an authorized release.

If the agent cannot do so after reading the standards, it is not ready to
onboard the river.

## 19. Post-review correction and continuous-learning protocol

Owner review is an evidence gate, not an informal cleanup. For every reported
error:

1. Reproduce the exact state and classify the cause: missing research, source
   misread, calendar interpretation, strength comparison, passage/endpoint,
   source reach, scoring mechanics, copy, fixture, or visual layout.
2. Correct the river/run packet, configuration, audit artifact, fixtures, and
   tests together. Never fix only the displayed sentence when the underlying
   structured truth is wrong.
3. Rerun every gate affected by the change, including full historical replay for
   calendar, weight, cap, lifecycle, source, or scoring changes.
4. Add an acceptance-ledger row with before/after behavior and reviewer/date.
5. Ask whether the cause could recur on another river. If yes, update the
   canonical playbook, relevant standard/template, packet validator, and QA in
   the same change whenever practical.
6. Record why the generalized rule is correct and which cases it must not
   overgeneralize to.

Do not add a vague lesson such as “research more.” Convert it into a concrete
required question, template field, validation rule, test, or reproducible
command. Future agents should encounter the safeguard before they can repeat the
mistake.
