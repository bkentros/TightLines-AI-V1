# TightLines AI V3 Master Spec

## 1. Objective

Rebuild the TightLines AI "How's Fishing" engine so the report becomes:

- more accurate
- more explainable
- less inference-heavy
- easier to tune
- more resilient when data is missing

The V3 engine must preserve the app's deterministic-first philosophy while replacing the current freshwater overreliance on inferred thermal logic and generalized seasonal assumptions.

## 2. Product philosophy

### 2.1 Deterministic-first rule
The deterministic engine is the source of truth. The LLM does not determine score, windows, or drivers. The LLM only converts approved structured outputs into readable report text.

### 2.2 Measured-first rule
The headline score may only use measured variables that are actually present in the normalized environment contract.

### 2.3 Historical-context rule
Historical baselines may shape:
- relative-to-normal flags
- interpretation
- timing nuance
- cautious behavior framing
- narration

Historical baselines may not:
- replace missing measured score inputs
- fabricate freshwater temperature values for scoring
- override strongly suppressive measured conditions

### 2.4 Missing-data honesty rule
If data is missing, the engine must:
- remove that variable from the eligible score set
- recalculate weights among remaining eligible variables
- reduce confidence when important signals are absent
- narrow claims in narration

### 2.5 Water-type separation rule
Lake, river, brackish, and saltwater reports must remain distinct in:
- weighting logic
- window logic
- explanation style
- LLM narration tone and emphasis

## 3. Current-codebase alignment

This is not a greenfield rebuild. V3 must be anchored to the current code.

### 3.1 Existing foundations to keep
- Confirmed user context flow in `app/how-fishing.tsx`
- `get-environment` as the environmental data collection layer
- `how-fishing` as the report orchestration layer
- Modular engine organization under `_shared/engineV2/`
- Deterministic-first design
- Existing report-shell UI components
- Separate narration by water type

### 3.2 Existing areas to remove or heavily refactor
- Manual freshwater water-temperature entry
- Any freshwater score path that depends on inferred freshwater water temperature
- Freshwater thermal comfort scoring based on modeled temperature
- River pseudo-current / river-flow proxy in headline score
- Coarse seasonal-state logic as a primary score driver
- Broad behavior inference that is treated like measured truth
- Transitional V1/V2 compatibility glue that is no longer necessary after V3 stabilizes

## 4. Core V3 architecture

### Layer A — normalized environment contract
Purpose: convert raw fetched environment data into a strict engine-ready contract.

This layer must:
- normalize units
- normalize timestamps/time zones
- distinguish measured vs derived vs historical vs missing
- attach provenance/coverage flags
- expose nulls explicitly
- remove any score-driving guessed freshwater temperature substitutes

### Layer B — geo/context resolver
Purpose: determine exact user context before scoring.

The context model must contain:
- `state`
- `region`
- `month`
- `water_type`
- `freshwater_subtype`
- `environment_mode`

Rules:
- Resolve state from synced location coordinates.
- Map state to one of the existing 7 regions.
- Use state for numeric baseline lookup.
- Use region for rule selection, weighting, and timing logic.

### Layer C — historical baseline layer
Purpose: provide normal/range references for variables where relative-to-normal context matters.

Phase-1 required baseline groups:
- state monthly air temperature baselines
- state monthly precipitation baselines
- state monthly freshwater temperature ranges for `lake_pond` and `river_stream`
- coastal monthly water-temperature baselines where applicable

### Layer D — measured score engine
Purpose: calculate the headline score from measured signals only.

#### Freshwater measured-score inputs
- air-temperature trend
- intraday air-temperature shape
- pressure trend
- wind
- cloud cover / light softness
- current precipitation and recent precipitation
- solunar
- daylight / time-of-day context

#### Saltwater/brackish measured-score inputs
- tide/current
- measured coastal water temperature when available
- air-temperature trend where relevant
- pressure trend
- wind
- cloud cover / light
- current precipitation and recent precipitation
- solunar
- daylight / time-of-day context

### Layer E — primary conditions regime
Purpose: determine whether secondary and tertiary variables should materially matter.

Regimes:
- `supportive`
- `neutral`
- `suppressive`
- `highly_suppressive`

Regime rules:
- supportive: secondary and tertiary factors can materially influence windows and the score mix
- neutral: primary factors lead; secondary factors help; tertiary factors remain modest
- suppressive: primary suppressors dominate; tertiary factors are heavily muted
- highly suppressive: primary suppressors dominate so strongly that secondary and tertiary factors have little or no practical effect

### Layer F — dynamic missing-data reweighting
Purpose: preserve honest scoring when variables are absent.

Rules:
- missing variables are removed from the eligible variable set
- weights are renormalized across the remaining eligible variables
- key missing variables reduce confidence more than tertiary missing variables
- no guessed values may stand in for missing measured variables

### Layer G — time-window engine
Purpose: produce best/fair/poor windows that vary by context.

Window logic must use:
- measured current conditions
- region
- month
- water type/subtype
- regime
- historical comparison flags
- tide timing for coastal paths
- solunar overlap

### Layer H — narration payload builder
Purpose: send a narrow and defensible structured payload to the LLM.

The payload must include:
- overall score and score band
- regime
- confidence and data-coverage status
- best/fair/poor windows with reasons
- measured drivers
- measured suppressors
- historical comparison flags
- relative-to-normal summary lines
- claim-guard instructions

The payload must not imply permission for the LLM to invent:
- exact depth certainty
- specific fish movement certainty
- unsupported river-flow behavior
- species-specific claims beyond the engine contract

## 5. Variable role system

Every variable used by V3 must be explicitly placed into one or more of these roles:

- `score_variable`
- `window_variable`
- `historical_context_variable`
- `narration_modifier`

Examples:
- air-temp trend: score + windows + historical context + narration
- pressure trend: score + windows + narration
- solunar: score + windows + narration
- state precip normal: historical context + narration
- measured coastal water temp: score + windows + historical context + narration

No variable should have an implicit role.

## 6. Geography model

### 6.1 Existing regions to preserve
Keep these 7 regions as the rule layer:
- `northeast`
- `great_lakes_upper_midwest`
- `mid_atlantic`
- `southeast_atlantic`
- `gulf_florida`
- `interior_south_plains`
- `west_southwest`

### 6.2 Required upgrade
The current bounding-box-only region assignment is too coarse for V3.

V3 must switch to:
1. `lat/lon -> state`
2. `state -> region`

### 6.3 Meaning of state vs region
- `state` = baseline lookup layer
- `region` = weight-profile and rule layer

## 7. Explicit non-goals

V3 must not attempt to:
- build a species-specific fishing AI
- infer missing freshwater temperature and score it as real
- claim exact river flow without a real flow source
- create an unmaintainable state-by-state custom scoring matrix for every variable
- redesign the entire product UI from scratch

## 8. Success criteria

V3 succeeds if:
- the score is measured-only
- inferred freshwater thermal logic is removed from the headline score
- windows become more context-aware and traceable
- missing data lowers confidence instead of creating fake precision
- historical context improves explanation without overpowering measured reality
- lake/river/brackish/saltwater narration stays distinct
- the UI reflects the engine's confidence and reasoning more honestly
