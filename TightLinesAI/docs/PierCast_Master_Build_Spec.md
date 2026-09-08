# FinFindr PierCast — Master Build Specification

**Version:** 1.7  
**Established:** 2026-09-05  
**Last audited:** 2026-09-06  
**Finalized:** 2026-09-06  
**Status:** Revised implementation specification for daily species outlooks; forecast validation and release readiness remain subject to the gates below  
**Scope:** Researched Great Lakes piers and breakwalls, with an initial limited pilot  
**Predecessor:** [PierCast_Agent_Build_Spec.md](PierCast_Agent_Build_Spec.md)

This document replaces the predecessor's implementation requirements for new PierCast work. The predecessor remains a concept record. Where they differ, follow this document. Existing River Run requirements continue to govern River Run; they do not automatically become PierCast scoring rules.

The requirements below define the product, scoring semantics, evidence standards, configuration, data processing, presentation, validation, and rollout. Numerical species preferences and pier thresholds must be researched during onboarding. An implementer must not fill those fields with remembered values or invent evidence to make a configuration pass.

**MUST** means required. **SHOULD** allows a documented implementation decision with a reason. Examples and product defaults are not biological findings. Building this specification does not itself authorize production deployment or public enablement; follow the user's actual release instructions.

### Version 1.7 scope change

Replaces three-hour session selection with daily species opportunity scores. All five dates refresh after accepted new model runs, normally approximately every six hours. Today covers the remaining local day. Practical conditions remain independent, interval-specific assessments. Best fishing times and fixed fishing durations are outside v1 scope.

### Navigation

- [Product and scope](#1-product-purpose)
- [Public outputs](#3-public-output-contract)
- [Research requirements](#4-scientific-evidence-and-provenance)
- [Configuration](#5-configuration-model)
- [Environmental data](#6-environmental-data-contract)
- [Biological scoring](#7-biological-scoring-model)
- [Access and practical conditions](#8-access-restrictions-and-practical-conditions)
- [Daily aggregation and headline selection](#9-daily-aggregation-and-headline-selection)
- [Confidence and fallbacks](#10-confidence-and-fallback-behavior)
- [User experience](#11-user-experience)
- [Architecture](#12-architecture-and-operational-design)
- [Validation](#13-validation-and-calibration)
- [Onboarding and release](#14-pier-onboarding-and-release-gates)
- [Build sequence](#15-implementation-sequence-and-deliverables)
- [Definition of done](#16-definition-of-done)

## 1. Product purpose

PierCast answers:

1. Is there a worthwhile fishing opportunity at this specific pier?
2. Which supported species should I consider targeting?
3. Which of the next five dates has the strongest supported opportunity for my target?
4. What changed, and how much confidence should I place in the outlook?
5. Is there an access or conditions limitation that changes the trip decision?

PierCast combines researched local fishery knowledge with representative observations and environmental forecasts. It predicts **fishing opportunity**, not guaranteed catches, measured fish presence, fish counts, or a calibrated probability of catching a fish.

The primary experience must remain simple. The underlying system must be explainable, reproducible, and economical to operate. Adding a pier should normally require research, configuration, and validation rather than new scoring code.

### 1.1 Success hypothesis

Anglers will return if PierCast helps them choose a more worthwhile pier, species, or time than a seasonal calendar or generic weather forecast alone. Treat this as a hypothesis to validate, not a marketing claim already established by the specification.

Measure usefulness, repeat use, and forecast performance separately. More forecast views do not establish biological accuracy; occasional catches do not establish product retention.

### 1.2 Initial scope and exclusions

The initial pilot SHOULD contain three to five individually researched piers with useful observations, different exposures or fishery patterns, and feasible prospective feedback. This count is a planning default, not a statistical sample-size claim. Choose locations through the onboarding process rather than declaring an entire lake covered.

The first implementation MUST include:

- A supported-pier catalog with exact pier identity and verified access context.
- Today plus four additional local dates.
- Daily species scores and a daily headline supported by a named species, with explicit date/remaining-day scope.
- Species opportunity, confidence, access status, and conditions limitations.
- A concise explanation grounded in engine reason codes.
- Source freshness and coverage disclosure.
- Versioned configuration, archived issued forecasts, and operational monitoring.
- Saved piers, a target-species filter, and optional trip feedback using existing app patterns where available.
- A dashboard without a map: today’s supported piers and State → Pier selection; Top 5/Top 10 presentation as coverage grows.
- Individual pier profiles with a clickable five-date calendar, species images, and an hourly water-temperature chart.

Defer until the core forecast has demonstrated usefulness:

- Best-time predictions, fixed-duration fishing recommendations, and improvement push notifications or automated trip alerts.
- Automatic coefficient updates from user reports.
- Unrestricted map-pin scoring or implied coverage of unresearched piers.
- Predictions of exact fish positions, exact casting spots, or catch probability.
- Separate models for every conceivable weather variable.
- Crowd estimates, guaranteed parking, or live closure claims without a supported source.
- Machine learning replacing the initial deterministic engine.

The schema may accommodate all Great Lakes jurisdictions. Public coverage is limited to individually onboarded jurisdictions and piers. Do not silently reuse U.S. regulations, alert providers, or units for Canadian locations.

## 2. Non-negotiable principles

1. **Local availability comes first.** Favorable weather cannot create an elite opportunity for an unsupported or weak fishery.
2. **Every headline has a biological basis.** An excellent overall score requires a correspondingly strong eligible species opportunity over the same daily assessment period.
3. **Availability is inferred, not observed.** A configured seasonal curve is not proof that fish are present today.
4. **Reachable water matters.** Conditions offshore, across a breakwall, or below reachable depths cannot silently represent the fishing area.
5. **Opportunity and confidence are separate.** Lead time or weak evidence must not be hidden inside a lower biological score.
6. **Biological opportunity and trip eligibility are separate.** A closure or hazard can suppress a recommendation while biological context remains available.
7. **Missing is not neutral.** Essential unavailable inputs yield explicit unavailable or limited outputs.
8. **Evidence must match the claim.** A reputable source does not validate every coefficient associated with its species.
9. **One physical effect has one primary scoring owner.** Avoid repeated penalties or bonuses for the same temperature, wind, or runoff event.
10. **Complexity must earn its place.** Keep a modifier only if evidence supports its use and evaluation justifies its contribution.

## 3. Public output contract

### 3.1 Score semantics

All numeric scores use one centrally versioned opportunity rubric. They describe the quality of an opportunity for a reasonably equipped angler using a suitable pier-fishing method over the stated daily assessment period. They summarize biological opportunity; lawful targeting and practical access are assessed separately. They do not prescribe trip duration or imply uniform conditions throughout the day.

An 8 for perch and an 8 for Chinook both describe strong target-specific opportunities. They do not imply equal expected catch counts. Scores are not percentiles independently normalized to each pier's best day. A weak fishery must not receive a 10 merely because conditions are its annual best.

Cross-pier comparisons use the same rubric but remain subject to evidence quality and calibration limitations. Do not claim quantitatively equal catch prospects across species or fisheries without validation.

Store continuous scores internally. Display whole numbers initially. Use the following **product rubric**, whose usefulness must be evaluated during the pilot:

| Displayed score | Label | Intended interpretation |
| --- | --- | --- |
| 1–2 | Poor | Little supported opportunity for the target |
| 3–4 | Limited | A weak or restrictive opportunity |
| 5–6 | Fair | A credible opportunity with meaningful limitations |
| 7–8 | Good | Strong support for target-specific opportunity over the assessed day |
| 9–10 | Excellent | Exceptional support within the shared opportunity rubric |

Round only for presentation using one shared function. Use the displayed integer to choose its label. Ranking comparisons use continuous values. Store the rubric version with forecasts. A score of 1 does not mean proven absence.

### 3.2 Overall Pier Score

The headline answers:

> Which eligible species has the strongest supported daily biological opportunity at this pier?

The Overall Pier Score equals the highest eligible daily species biological score under Section 9. It is not an independent weather score or an average of species. Practical conditions do not numerically cap it. A numeric headline is a daily biological outlook, not an all-day trip clearance; prominent notices and a separate promotion status govern whether it may appear as a recommended pier.

Always show the driving species, daily assessment period, and its confidence. Adding a poor species must not reduce an existing headline. An explicit target filter may change the headline and must identify that scope. Favorites alone must not change the default all-target result. A port narrative may provide context but cannot maintain a second seasonal score.

### 3.3 Species Opportunity Score

Species scores summarize biological opportunity over the requested daily assessment period in Section 9.1. Each species has one preconfigured representative zone and method basis for its primary daily score. Do not choose whichever zone or method scores highest that day or switch zones between hours. Additional assessed zones may appear as labeled detail; they do not compete for the primary species score in v1.

All primary species scores on a date use the same requested period. Each retains its own actual coverage, method, zone, targeting eligibility, practical assessments, confidence, and reasons. Identify different zone/method contexts explicitly. A restricted or unassessed species may retain a biological score as qualified context, but cannot inherit another target's eligibility or recommended placement.

A numeric Overall Pier Score must equal its driving species score, with the same period and coverage. Conditions limitations do not produce a second lower numeric score. If no species qualifies for a headline, preserve available species biology under “Biological outlook only” and give the nonnumeric headline an explicit reason.

Keep a selected or favorited species visible when low, unsupported, restricted, or unavailable. Other irrelevant species may be collapsed. Distinguish low seasonal opportunity from absent research, insufficient environmental data, and targeting restrictions.

### 3.4 States outside the numeric scale

The domain and UI MUST distinguish:

- `available`: usable dynamic biological outlook.
- `unavailable`: required evidence or environmental inputs cannot support it.
- `unsupported`: species or location not onboarded for this use.
- `restricted`: verified targeting restriction prevents a recommendation.
- Access `closed` or `unknown`.
- Conditions `hazardous`, `limited`, `no_identified_limitation`, or `unknown`.
- Coverage `complete`, `partial`, or `none` for the requested date interval.

Do not encode closed, unknown, or unavailable as 0/10 or 1/10. A boolean `safe` field is prohibited. “No identified limitation” is an assessment of configured checks, not a safety certification.

## 4. Scientific evidence and provenance

### 4.1 Required evidence standard

All material biological claims and species-preference inputs MUST be supported by reputable, traceable research. This includes temperature suitability, temperature-trend responses, seasonal accessibility, local fishery strength, migration behavior, and environmental sensitivities.

Prefer sources in this order, while evaluating applicability rather than authority alone:

1. Relevant DNR or equivalent state/provincial fisheries agencies and tribal fisheries co-managers.
2. NOAA, USGS, USFWS, other applicable public scientific agencies, and official technical reports.
3. Relevant peer-reviewed studies and university/Sea Grant research.
4. Established monitoring organizations for measurements or facts they directly collect or manage.

Land managers and municipal authorities are appropriate primary sources for access and closures. Applicable regulatory authorities govern legal facts. Do not use a biological publication to establish current access or regulations.

Fishing forums, commercial guide promotions, uncited temperature charts, search snippets, AI-generated answers, and remembered reputation are not sufficient support for material biological configuration. Local angler feedback may identify research questions and support validation; it does not replace foundational evidence.

### 4.2 Evidence records

Every material parameter or relationship MUST reference one or more evidence records with:

| Field | Requirement |
| --- | --- |
| `evidenceId` | Stable internal identifier |
| `authority`, `title`, `urlOrPath` | Direct source, not a search-results URL |
| `publishedAt`, `updatedAt` | Record when available; unknown must remain explicit |
| `dataYears`, `accessedAt` | Distinguish observation years from publication and retrieval dates |
| `locator` | Relevant page, section, table, or dataset query |
| `supportedClaim` | Specific finding used by the configuration |
| `geographicScope` | Lake, tributary, pier, region, or study location |
| `species`, `lifeStage`, `behavioralContext` | Applicability of the finding |
| `measurementContext` | Units, depth, habitat, method, and relevant uncertainty |
| `limitations`, `contradictions` | Transfer limits and unresolved conflicting findings |
| `reviewedBy`, `reviewedAt` | Review provenance |
| `nextReviewAt`, `reviewTriggers` | Time- or event-based maintenance |

Store concise factual notes and permitted excerpts rather than copying entire copyrighted publications.

### 4.3 Findings versus calibration

Each configurable biological relationship MUST declare one of:

- `documented`: the source directly supports the stated relationship in the relevant context.
- `inferred`: an explicit, reviewed transfer or interpretation of evidence.
- `provisional_calibration`: an engineering curve or coefficient awaiting empirical evaluation.

A source documenting a preferred temperature range does not necessarily establish a pier catchability peak. Distinguish survival tolerance, juvenile growth, adult thermal selection, spawning, migration, feeding, and reachable-water accessibility.

Exact interpolation points, opportunity ceilings, modifier magnitudes, lag durations, and score mappings are normally calibration choices unless a source directly establishes them. Do not describe a numeric scoring threshold as “DNR validated” merely because a DNR page supports the species' general biology.

If reputable sources disagree, record both, explain the chosen scope, and identify the affected confidence dimension. Missing local studies may justify a conservative regional transfer, but not a claim of local validation. Unresolved material species-presence or water-representation questions block that capability from public enablement.

### 4.4 Research bundle and maintenance

Maintain shared species evidence once, then reference it from pier dossiers. Each pier retains its own identity, local fishery support, sampling assessment, restrictions, and calibration findings.

Re-review when a source changes, a fishery assessment is revised, stocking or habitat changes become relevant, a model grid changes, a station moves, or validation identifies a contradiction. Expired optional annual adjustments revert to neutral; expired essential legal or representation evidence follows its unavailable policy.

## 5. Configuration model

Use validated, versioned schemas. Do not distribute scoring constants across UI components or endpoint handlers. The following are required contract fields or equivalent typed structures, not a demand for a particular database layout.

### 5.1 Configuration hierarchy

Resolve configuration in this order:

`global product defaults → species defaults → regional behavioral profile → pier × species overrides → zone-specific overrides`

Annual adjustments are a separate dated layer with explicit scope. The resolved configuration MUST record where each value originated. Reject ambiguous duplicate overrides, unknown fields, broken references, and incompatible units. Arrays of curve points replace explicitly rather than merging accidentally by index.

No override may bypass required evidence, hard targeting restrictions, source validity, or the maximum opportunity ceiling. Preview the resolved configuration before publication.

### 5.2 Pier configuration

Required:

- `pierId`, canonical name, aliases, `portId`, lake, country, state/province, jurisdiction identifiers.
- Latitude/longitude, IANA timezone, exact north/south or named-structure identity.
- Verified fishing-access point distinct from model sampling coordinates.
- Public access evidence, access hours if known, seasonal limitations, closure sources and freshness rules.
- One or more assessed fishing zones, including a single default zone if finer subdivision is unsupported.
- Shoreline orientation, exposed side, and relevant structure geometry.
- Supported species IDs and optional tributary association.
- Environmental source plan and fallback rules by variable and zone.
- Conditions-assessment profile and supported alert jurisdictions.
- Capability flags, evidence IDs, review status, and versions.

A port is a grouping, not a substitute for the identity of its individual piers. Never navigate an angler to a sampling point in the lake.

Onboard by port/area as a research bundle, while retaining individual pier identities. A shared bundle may own regional biology, fishery sources, provider probes, and a versioned environmental sampling plan. Each pier records only its assessed differences and explicit references to shared evidence/configuration. A pier still requires an individual check of access, exposure, reachable water, and local fishery applicability; it does not require independently repeating identical research or fetching duplicate model data.

Nearby piers may share environmental series and biological profiles when the representation assessment supports equivalence. Distance or a shared city name alone is insufficient. Distinct exposure, channel/plume position, reachable depth, restrictions, or fishery support requires the relevant override, not necessarily an entirely new model. Identical evidence may legitimately produce identical scores; do not invent differences to make separate profiles look useful.

The public profile remains pier-based, labeled with its port/city and named structure. Group sibling piers in selection controls and offer a switch between supported piers in that port. A port need not have every pier onboarded to launch: begin with the principal verified fishing piers and mark only those as supported. Do not publish a city-wide score that implies unassessed piers share conditions.

### 5.3 Fishing-zone and sampling configuration

Each scored zone MUST describe:

- Stable zone ID and user-comprehensible geographic scope.
- Lake-facing, harbor-facing, channel, or plume context as applicable.
- Approximate reachable distance and depth range, with evidence and limitations.
- Whether the supported method is casting, float, bottom, or another researched method category.
- Sample coordinate, model element/cell or interpolation method, grid version, and wet-cell checks.
- Sensor depth or model layer, local bathymetry context, and variable represented.
- Source-to-zone relationship, representativeness evidence, and unacceptable conditions for that source.
- The required coverage and accepted alternate sources.

Do not select whichever nearby cell produces the highest score. Sampling is configured before seeing forecast favorability. Do not average lake and plume water solely because both points are nearby. More than one point or depth is allowed when necessary and supportable; an unresolved microenvironment must remain a limitation rather than fabricated precision.

### 5.4 Pier × species configuration

Required:

- Local eligibility and evidence status.
- Local fishery baseline description, evidence, and calibrated opportunity ceiling.
- Seasonal accessibility ceiling curve on the shared scale.
- One or more supported behavioral profiles and their smooth activation weights.
- Temperature suitability curve per applicable profile.
- Temperature-trend configuration: enabled state, history windows, minimum coverage, magnitude curve, absolute-temperature constraints, response duration, and evidence.
- Optional modifiers with effect ownership, bounds, required inputs, and missing-data behavior.
- Applicable zones, method category, and targeting restrictions; a fixed primary zone/method basis for the daily species score, chosen during onboarding rather than from forecast favorability.
- Optional dated annual adjustment.
- Calibration maturity, evidence confidence, and configuration version.

“No local evidence” is not the same as a proven poor fishery. An unsupported species must not acquire a precise low numeric baseline merely to fill the catalog.

### 5.5 Curves and behavioral profiles

Use bounded piecewise-linear curves for v1. Validate strictly increasing input coordinates and finite values. Use explicit endpoint clamping; do not extrapolate beyond researched bounds. Seasonal curves MUST be continuous across year-end and handle leap day deterministically using month/day anchors.

Temperature suitability MUST interpolate between adjacent curve points using the unrounded input temperature. Do not assign abrupt suitability bands or an exact-temperature bonus. Within a supported approach to the optimal range, suitability increases gradually toward that range, may plateau across it, and decreases gradually beyond it as the researched profile specifies. Cooling is beneficial only when it moves toward that profile's suitable range; other scoring factors held constant, its temperature contribution must follow that direction.

For example, if a hypothetical profile improves as water cools from 62°F toward 61°F, intermediate temperatures must receive intermediate suitability values rather than switching at 61°F. These temperatures illustrate behavior, not a species preference. Compute in canonical Celsius without rounding before curve evaluation; whole-number rounding occurs only at final score display.

An optimal **band** is supported and preferred when evidence describes a range: gradually rising suitability on one side, a plateau or gently varying high-suitability region, and gradually falling suitability on the other. The cold-side and warm-side slopes need not be symmetric. Do not collapse a documented range to its midpoint or assume all temperatures inside it are equally suitable when the evidence says otherwise. A narrower peak is allowed only with an applicable evidence/calibration rationale. A physiological preference band alone does not establish the pier-accessibility band; retain the behavioral, seasonal, and depth context.

Separate a curve's interpolation knots from its accepted input domain. Endpoint clamping is permitted only within that explicitly supported domain. A physically plausible measurement outside the profile's accepted domain yields unavailable for the affected dynamic score, unless a separately evidenced out-of-domain rule applies; it must not inherit a favorable endpoint value. Measurement quality checks and biological applicability checks are distinct.

Behavioral profiles may distinguish, for example, a spring feeding fishery and a late-season staging fishery where evidence supports that distinction. Their smooth activation weights are scenario weights, not observed population proportions. Weights must be nonnegative and sum to one whenever that species is eligible for scoring. A single profile with weight one is valid and preferred where sufficient.

Start with one temperature curve for each supported pier/species combination, inheriting a reviewed shared curve where applicable. Add the smallest number of seasonal behavioral variants needed to represent evidenced differences. The same temperature may have different suitability in those contexts, and the relative penalty below versus above the optimal band may differ by profile. Do not create twelve monthly curves, separate warming/cooling curves, or additional seasonal score multipliers by default. Use the existing smooth profile weights and combination rule in Section 7.5; do not blend temperature curves and then blend the resulting profile scores a second time.

Seasonal context and recent temperature direction are distinct. Warming toward the active profile's suitable range improves absolute-temperature suitability just as cooling toward it does. Neither spring nor fall automatically grants a warming/cooling bonus. If the same temperature in the same seasonal profile should score differently because of its recent history, that difference must satisfy the separate trend-evidence requirements in Section 6.5.2. Otherwise, identical temperatures receive identical temperature suitability regardless of how they were reached.

Do not copy a river migration calendar or activity curve into a pier profile without a documented applicability assessment. Do not dynamically shift the calendar in response to weather unless that mechanism is separately specified, evidenced, and validated.

### 5.6 Annual abundance adjustment

Default to a neutral factor of `1`. This means no applied annual adjustment, not proof that the year is average. Store `annualStatus: unknown | assessed` separately.

An enabled adjustment MUST include lake/pier/species scope, relevant cohort or life stage, effective dates, bounds, evidence IDs, and an expiration. Do not infer current adult availability directly from current stocking totals or offshore harvest. Do not apply a lake-wide adjustment locally without documenting transfer limits.

Revisions are prospective and versioned. Historical evaluation must use the adjustment knowable at forecast issue time. Updating a baseline and annual adjustment for the same evidence must not count that change twice.

## 6. Environmental data contract

### 6.1 Source-selection policy

For current water temperature, prefer a quality-controlled representative observation, then an accepted model estimate, then a configured fallback. Representativeness and quality are eligibility checks before source priority is applied.

For future temperature, use an accepted forecast product. An observation cannot become a five-day forecast through indefinite persistence. Air temperature must never substitute for water temperature.

Use operational products where suitable. NOAA's operational Great Lakes systems currently document hourly forecast fields extending 120 hours and four daily cycles. Native products include NetCDF files; ingestion feasibility must be demonstrated for the chosen sampling strategy. These are provider capabilities, not a guarantee of skill at a particular pier. [NOAA OFS documentation](https://tidesandcurrents.noaa.gov/ofs/ofs_faq.html)

GLERL identifies its GLCFS products as experimental. Any use must document that status and its availability implications. [NOAA GLERL GLCFS notice](https://www.glerl.noaa.gov/res/glcfs/)

### 6.2 Capability matrix required before implementation completion

For each launch pier, fill and probe this matrix with actual provider/product IDs:

| Input | Purpose | Requirement |
| --- | --- | --- |
| Representative water temperature | Main biological suitability | Required for dynamic v1 species scoring |
| Temperature history | Trend modifier and explanation | Required only when that configured effect is enabled |
| Wind vector and gusts where supported | Exposure and practical conditions | Required for practical assessment |
| Waves | Pier conditions | Required for practical assessment; profile defines necessary height/direction/period fields |
| Severe-weather information | Current hazards and future weather limitations | Required applicable feed checks and forecast coverage |
| Ice information | Seasonal conditions | Required when the pier's seasonal risk profile says applicable |
| Access and restrictions | Recommendation eligibility | Required reviewed baseline plus available current-status checks |
| Light/cloud | Optional biological context | Enable only with evidence and valid inputs |
| Tributary hydraulics/rainfall | Optional local response | Enable only for supported species/profile and represented reach |

Each row MUST declare endpoint, variable, units, spatial/depth scope, issue cadence, observed or forecast horizon, acceptable age, coverage minimum, provider timeout, retry policy, alternate product, and unavailable behavior. A successful sample response must be retained as a sanitized fixture. Public enablement is blocked for capabilities whose essential rows remain unresolved.

### 6.3 Normalized sample metadata

Normalized data MUST include:

```ts
type EnvironmentalSample = {
  sourceId: string;
  productId: string;
  variable: string;
  kind: "observation" | "nowcast" | "forecast";
  issuedAt: string | null;
  observedAt: string | null;
  validAt: string;
  validUntil: string | null; // interval data; instant fields remain explicit
  ingestedAt: string;
  value: number | null;
  unit: string;
  zoneId: string;
  depthMeters: number | null;
  modelLayer: string | null;
  runId: string | null;
  gridVersion: string | null;
  qualityFlags: string[];
  transformationIds: string[];
};
```

Use UTC ISO timestamps internally. Convert to pier-local dates only through timezone-aware functions. Canonical units are Celsius, meters, meters/second, cubic meters/second, millimeters, and hPa as applicable. Display conversions occur at the presentation boundary. Provider wind conventions and coordinate frames must be explicit.

Reject or quarantine sentinel values, implausible values, conflicting duplicates, invalid timestamps, wrong units, unexpected schema changes, and invalid wet-cell/depth mappings. Do not silently replace rejected values with zero. Keep rejection counts and reasons.

### 6.4 Temporal alignment and coverage

Use an hourly UTC evaluation lattice when source resolution supports it. Preserve native temporal resolution and distinguish measured samples from interpolated values. Hourly inputs support daily aggregation and the temperature chart; they do not authorize fishing-time recommendations.

Interpolation requires a per-variable accepted policy and bracketing valid data. Do not extrapolate beyond the source horizon. Do not interpolate closures, warnings, categorical hazards, or data across an unassessed provider outage. A daily label does not waive temporal-resolution requirements: the source policy must show that accepted resolution captures material variation before aggregation.

Store source issue times separately from forecast valid times. Joining inputs by array index is prohibited. Every evaluated interval must have a source manifest covering its actual validity interval. Mixed model cycles are allowed across different variables only under a documented alignment policy; do not accidentally splice different temperature runs into one forecast series.

### 6.5 Observed/model continuity and temperature trends

Trend computation MUST use comparable locations, depths, methods, and source histories. Never subtract an observed reading from a biased fallback model and call the difference environmental cooling.

V1 may display a representative observation for current conditions while using a separately identified model series for future scoring. Keep observed historical trends and within-run forecast trends distinct. At their boundary, omit an unsupported cross-source trend rather than invent continuity.

Where comparable observed and modeled temperatures overlap, the source plan MUST define a disagreement check: matched valid times and depth/zone, minimum paired coverage, absolute-error and persistence thresholds, and recovery criteria. Thresholds require a source-specific error/representation rationale; no universal temperature difference is assumed. Compare like-for-like samples, not a current observation against tomorrow's forecast. Insufficient paired coverage means the check is unavailable, not that the sources agree.

Material disagreement reduces environmental confidence and produces an explicit source-disagreement limitation. If it breaches the plan's rejection threshold, exclude the affected model source/zone/lead capability until its recovery criteria pass; use an independently accepted fallback or return that capability unavailable. A current mismatch does not automatically invalidate every future lead, but the source plan must specify the affected scope rather than ignoring it. Do not average conflicting sources, automatically favor the warmer/cooler value, or apply an unvalidated correction to conceal the disagreement.

Bias correction is optional and disabled until validated. If enabled, record paired observation/model overlap, robust offset method, permissible magnitude, decay behavior, verification results, and correction version. Corrected values remain labeled modeled.

Trend profiles MUST specify matched history windows, minimum samples, smoothing, absolute change, rate of change, and starting/ending temperature constraints. Default optional trend behavior when its history is insufficient is no trend adjustment with an explicit missing-effect reason. If a profile requires the trend as an essential input, that profile becomes unavailable instead.

Use elapsed time, not sample count, to measure trend. Reject unsupported causal wording: a temperature drop supports “cooling water,” not automatically “upwelling confirmed” or “fresh fish arrived.”

### 6.5.1 Initial trend measurement contract

Use the following reproducible v1 measurement defaults. They are engineering defaults to evaluate during onboarding, not universal biological response times:

1. Reduce accepted temperature data to UTC hourly buckets. For observations, use the median of valid observations within each bucket; for model series, use the accepted hourly alignment policy. Dense observation bursts must not outweigh other hours.
2. At evaluation hour `t`, let `R(t)` be the median of available hourly bucket values in `[t−3h, t)`. Require at least two of the three hourly buckets, including the latest bucket. Apply the same rules at each comparison time; do not fill missing buckets merely to pass this test.
3. Compute `delta24 = R(t) − R(t−24h)` and `rate24 = delta24 / 24`, in °C and °C/hour. This compares matched time-of-day windows rather than treating an afternoon-to-night change as a full-day cooling event.
4. Compute `delta6 = R(t) − R(t−6h)` where supported as short-term direction/reversal context. It is not an additional independent bonus. Do not present the average 24-hour rate as an instantaneous rate.
5. Record the exact bucket coverage, starting/ending temperatures, source identity, and whether each comparison uses observations, model nowcasts, or forecasts. At a future hour, use only compatible model history and forecast data available in that issued run's accepted manifest. Do not borrow later observations or splice older forecast runs to fill missing history without an explicitly validated continuity method.

If required comparison windows are unavailable, follow the existing optional/essential trend policy. A validated profile may override these measurement windows and coverage rules, but must version and explain the override. The source capability matrix must distinguish history needed to compute a trend from the forecast horizon available to the user.

### 6.5.2 Translating trend into a scoring effect

Current absolute-temperature suitability remains the primary temperature contribution. A temperature moving toward a suitable band already raises that contribution; this does not automatically justify a second trend bonus.

A trend modifier defaults to disabled (`1`) until the profile has evidence for an additional history-dependent accessibility/behavior effect and an explicit bounded calibration. When enabled, use one continuous configured response to starting/ending temperature, signed change, and supported rate/reversal context. Define a continuous deadband around changes too small to distinguish from source noise, with a ramp beyond it rather than a threshold jump. Record the source-error rationale, factor bounds, and effect duration. Recompute from the trailing windows; v1 does not latch and repeatedly accumulate bonuses from the same event.

The modifier MUST respect current absolute-temperature constraints as well as the smoothed trend. Cooling away from the suitable band, overshooting below it, or a supported recent reversal cannot retain a positive “approaching optimum” bonus solely because `delta24` is negative. Movement within a flat optimal band creates no preference-improvement bonus. Any different history effect requires its own documented rationale; rapid change is not automatically more favorable than gradual change.

Validate the modifier against the same model with trend disabled. If it merely rewards the absolute-temperature improvement twice or does not justify its added complexity, retain the trend as explanatory context and leave its scoring factor at `1`. Missing optional trend data must not erase a valid absolute-temperature score.

### 6.6 Wind and correlated variables

Convert meteorological wind-from direction into a wind vector in documented true east/north coordinates before projection onto zone orientation. Derive onshore, offshore, and signed alongshore components, sustained speed, duration, and gusts where available. Test opposite shores and known cardinal examples.

Never use a universal favorable compass direction. A hydrodynamic temperature forecast already responding to wind must not receive a second large wind-for-cooling bonus. Wind may independently affect casting, drift, or assessed practical conditions.

Waves can have a biological modifier and a practical gate only when those effects are separately defined. Cloud cover and solar elevation may inform one effective-light signal; do not also reward the same low light through multiple overlapping terms. Rainfall and measured discharge must not automatically add two bonuses for one runoff event.

### 6.7 Tributary influence and deferred variables

Only enable tributary inputs for a supported pier/profile where the source represents the relevant mouth or receiving water. Record upstream distance, dams, intervening lakes, lag assumptions, and plume uncertainty. Do not infer a current plume boundary from river flow alone.

Pressure, moon phase, and other weakly supported additions are disabled in v1 unless a specific evidence review and held-out comparison justify them. Bait availability, turbidity, dissolved oxygen, and currents may matter, but an unmeasured variable must remain an uncertainty or a future capability rather than a fabricated live input. A known material limitation may block a location until it can be represented adequately.

### 6.8 Initial biological variables and light evaluation

The initial biological baseline uses local fishery support, seasonal accessibility, and representative absolute water temperature. Annual adjustments remain neutral unless separately supported. Trend and other optional biological modifiers start disabled. Wind/waves and applicable weather inputs remain required for practical assessment independently of biological modifiers.

Light is the first candidate additional biological modifier to research and evaluate, not a mandatory scoring input at launch. Enable it only for an evidenced species/behavioral profile with a bounded provisional calibration and a held-out comparison against the same model without light. Define hourly effective light using solar context and accepted cloud information; do not award a universal cloud bonus or score from a daily cloud percentage. Explicitly define nighttime behavior so cloud cover does not duplicate darkness. Surface light is a proxy with depth/turbidity limitations, not measured underwater illumination.

Apply any enabled light factor at the resolved time steps before daily aggregation. Record bounds, effect ownership, missing-input behavior, and applicability. No light bonus may bypass the availability ceiling. Retain a display-only cloud summary if useful when the biological effect is unsupported. Other modifiers require their own evidence and incremental-value evaluation; adding variables is not an accuracy claim.

## 7. Biological scoring model

### 7.1 Model intent

Use a gated, bounded model. Do not use a flat weighted average allowing weather to overcome poor local availability. Do not multiply several overlapping estimates of fish presence merely because each can be normalized to 0–1.

The following is the v1 engineering model family. Its coefficients and curves are provisional until evaluated; the formula itself is not a scientific finding. Changes to this family require an engine-version change and comparison with the previous model.

### 7.2 Eligibility

Before numeric scoring, resolve biological support for pier, species, zone, method category, and profile. Unsupported or materially unresolved combinations return a nonnumeric state. A historically poor season may produce a low score; lack of research may not.

Legal targeting and access do not change the underlying biological estimate. They determine whether it can support a trip recommendation in Sections 8–9.

### 7.3 Availability ceiling

For each species and profile, configure:

- `L`: local fishery ceiling in `[0, 1]`, calibrated against the shared opportunity rubric.
- `S(t)`: smooth seasonal ceiling in `[0, 1]` on that same rubric, not a second catch-probability estimate.
- `A(t)`: approved annual multiplier, neutral at `1`, within explicit bounds.

Compute:

```text
localCeiling(t) = clamp(L × A(t), 0, 1)
availableCeiling(t) = min(localCeiling(t), S(t))
```

Using the smaller ceiling avoids multiplying two overlapping descriptions of availability. The local baseline must not incorporate today's environmental conditions. The seasonal ceiling describes historical seasonal access under supportive conditions, rather than average weather that the environmental layer would count again.

No live weather effect can increase opportunity beyond the resolved availability ceiling. An exceptional fishery event requires a reviewed, time-bounded configuration revision with evidence; do not provide an automatic weather override or a hidden manual score slider.

### 7.4 Environmental support

For each active profile:

```text
T(t) = configured temperature suitability in [0, 1]
M(t) = product of enabled, bounded conditional modifier factors
E(t) = clamp(T(t) × M(t), 0, 1)
Oprofile(t) = availableCeiling(t) × E(t)
```

Neutral modifier factor is `1`. Required missing inputs yield unavailable, not `1`. Optional omitted modifiers retain a reason code and affect confidence where material. Do not renormalize remaining favorable inputs upward after an input disappears.

Classify any factor representing a material adverse constraint as required for the profile where it applies. It cannot be labeled optional merely to preserve a score during an outage. For a genuinely minor optional factor, replacing a negative adjustment with `1` may increase the numeric result even without renormalization. Each optional factor therefore requires a reviewed maximum omission effect on the final score, and the combined optional factors require an aggregate omission bound. Validate these bounds across the accepted input domain; a factor or combination exceeding them must be narrowed, disabled, or made required.

When optional-input loss raises a score, disclose the omitted effect and reassess confidence. Explain the change as reduced information, not improving fishing conditions, and suppress any improvement alert caused by that loss. Do not indefinitely retain an expired negative measurement to avoid this issue. The fallback matrix's neutral-factor policy applies only to factors that pass these optional-effect checks.

Every factor MUST specify its bounds and primary physical effect. The combined multiplier also has a configured bound. A zero temperature suitability remains zero under modifiers. Minor variables cannot independently create an excellent result or bypass the availability ceiling.

Temperature suitability depends on behavioral context, attainable depth, and absolute temperature. Cooling may improve, worsen, or leave opportunity unchanged. The direction must emerge from the applicable researched curves, not a global cooling bonus.

### 7.5 Combining behavioral profiles

For one species in one zone:

```text
O(t) = sum(profileWeight(t) × Oprofile(t))
biologicalScore(t) = 1 + 9 × clamp(O(t), 0, 1)
```

Use the configured weights from Section 5.5. Do not select the maximum profile merely because it produces the best forecast. If a required active profile is unavailable, do not renormalize away its weight; the combined dynamic species output is unavailable unless a separately validated reduced-profile capability exists.

Evaluate required inputs only for profiles with positive weight at the evaluated time. A zero-weight inactive profile cannot make the species unavailable. Do not introduce an undocumented small-weight cutoff that silently removes an active profile.

Store the ceiling, temperature suitability, modifier contributions, profile weights, resulting continuous score, reason codes, and configuration references. Explanations must be traceable to these values.

### 7.6 Calibration checks

During onboarding, assess the score distribution and perform parameter sensitivity checks. Verify that common supportive conditions can reach appropriate rubric bands, weak fisheries stay bounded, and small input changes do not cause unjustified large changes. Do not stretch every pier's distribution to fill 1–10.

Continuity alone is insufficient: tightly spaced curve points can still create an unjustifiably steep response. Each temperature profile MUST declare reviewed limits for curve slope (suitability change per °C) and resulting biological-score sensitivity, with their calibration rationale. Validate every segment and test temperatures just below, at, and above each knot, including changes equivalent to 0.1°F and 1°F. Check the combined temperature/trend response as well as temperature alone. No universal slope limit is assumed to be a scientific fact.

These requirements control sensitivity to inputs, not how quickly genuine new information may change a forecast. Do not smooth old and new scores together or delay closures/hazards to enforce gradual display changes. A small continuous score change may cross a whole-number rounding boundary; that is distinct from a discontinuous underlying model.

If the availability model and environmental layer cannot be meaningfully separated with available evidence, simplify the profile or keep it provisional. Adding coefficients does not resolve absent evidence.

### 7.7 Daily calibration anchors

Maintain a small reviewed set of reference days spanning the shared Poor through Excellent rubric across pilot species and fisheries. Record source inputs, expected interpretation, resulting score, uncertainty, and calibration rationale. These are provisional engineering anchors, not agency-validated thresholds. Evaluate final daily outputs rather than assigning intuitive values independently to each multiplicative factor.

For example, one profile with availability ceiling `0.8`, temperature suitability `0.8`, and neutral modifiers yields `1 + 9 × 0.8 × 0.8 = 6.76`, displayed as 7. These illustrative values are not species parameters. Validate realistic score distributions, aggregation sensitivity, and false excellent outcomes; do not force every pier to fill the scale.

## 8. Access, restrictions, and practical conditions

### 8.1 Independent assessments

Maintain these dimensions separately for each zone and interval:

| Dimension | States | Effect |
| --- | --- | --- |
| Access | `open_by_published_rules`, `closed`, `unknown` | Qualifies the daily outlook and controls promotion |
| Target eligibility | `eligible`, `restricted`, `unknown` | Applies to species/method/date and relevant location boundary |
| Conditions | `no_identified_limitation`, `limited`, `hazardous`, `unknown` | Qualifies or blocks promotion; does not alter biology |

Published public access with a recent review and no known closure may support `open_by_published_rules`. This does not claim real-time confirmation. Store `lastVerifiedAt`, source, and the fact that current closures may be unreported. A missing live closure feed alone must not imply closed access, but expired essential access evidence yields unknown.

Differentiate a harvest restriction from a targeting prohibition. Do not remove a lawful catch-and-release opportunity solely because harvest is closed. Do not generate detailed legal interpretations beyond reviewed configuration; link the appropriate official source and show the limitation where necessary.

### 8.2 Conditions assessment

Each pier's profile MUST define accepted variables, relevant official alerts, conditions thresholds, and their scope. Wave height alone must not become a universal pier-safety rule. Consider direction, period, gusts, exposed geometry, water level/overtopping context where supported, ice, lightning/severe weather, and known structure limitations.

NWS describes wave reflection and larger combined waves near piers. This supports treating structure exposure as material; it does not provide a universal safe wave-height threshold. [NWS Great Lakes safety guidance](https://www.weather.gov/safety/great-lakes)

Numeric thresholds are reviewed practical-assessment rules unless directly established by an applicable authority. Do not present them as certified safety limits. Official closure and applicable serious hazard information take precedence over a favorable model score. Interpret alerts by their documented scope; do not equate every beach or boating advisory with an official pier closure.

### 8.3 Time and forecast limits of hazards

Assess conditions, access, and targeting rules over their actual intervals within the daily assessment period. Preserve current status separately. Absence of an alert today cannot establish hazard-free conditions four days ahead. Accepted future wind/wave/weather forecasts may support a planning assessment with “Forecast conditions; check again before leaving” context; current alert feeds only cover their issued validity intervals.

If an essential practical product does not cover part of the period, that portion is unknown even when biological inputs remain valid. Do not require an unissued day-four warning to assess day-four planning conditions. Do not average away a brief hazard, closure, or restriction, and do not extend it to the entire day without its actual scope. Retain dated/time-specific notices; these are conditions information, not suggested fishing windows.

### 8.4 Daily qualification and promotion

Maintain `promotionStatus: eligible | limited | blocked | unknown` independently from biological scores. For each species' fixed zone/method basis:

1. Any hazardous interval, closed access interval, or targeting restriction within the assessment period yields `blocked` for whole-period promotion. Biology may remain visible with the affected intervals and an explicit qualification.
2. If no known blocker exists but any essential practical/eligibility coverage is unknown, promotion is `unknown`.
3. Complete assessments with only limited conditions yield `limited`, with reasons.
4. Complete assessments with published access, eligible targeting, and no identified limitation throughout yield `eligible`.

This is a conservative dashboard policy, not a claim that an entire date is closed or hazardous. A partial-day limitation does not erase biological context or identify an alternative fishing time. A route hazard applies to every dependent zone. Never infer the opposite side is usable.

Only `eligible` and `limited` records with complete biological daily coverage may enter the ranked dashboard. Low-confidence records remain visible in the catalog/profile but are excluded from ranked promotion during the pilot. Show these exclusions in the dashboard's coverage explanation; do not reduce biological scores to encode them. No eligible entries is a valid dashboard result.

## 9. Daily aggregation and headline selection

### 9.1 Daily assessment period

The calendar contains today plus four local dates using the pier's IANA timezone. Future dates cover `[local midnight, next local midnight)`. Today covers `[evaluationTime, next local midnight)` and is labeled **“Today · remaining day”**. No fixed trip duration, best-hour search, dawn-only selection, or cross-midnight fishing session is defined.

Use UTC elapsed duration for calculation, including 23/25-hour DST dates. All species on a report share the requested period and evaluation time. Do not silently restrict biology to daylight or open-access hours; those would change score meaning and conceal limitations. Access and hazards are assessed independently over the same period.

Reaggregate today from stored valid time series at hourly boundaries, on accepted input changes, and on reads when its assessment start is out of date. Use the actual evaluation time, reconstructing its boundary only under accepted interpolation rules. This removes elapsed conditions without claiming a new provider forecast. Record `evaluatedAt` separately from the input-driven `forecastUpdatedAt`. Future dates change with accepted inputs/configuration, not merely the passing hour. At midnight, advance the calendar and expose unavailable coverage rather than inventing the new fifth date's data.

### 9.2 Daily biological aggregation

For each species' fixed primary zone and method:

```text
dailySpeciesScore = integral(biologicalScore(t), covered intervals)
                    / duration(covered intervals)
```

Use the time-resolved biological scores from Section 7 before final display rounding. This duration-weighted mean is a versioned product/calibration choice to evaluate during the pilot; it is not a catch probability or measured daily abundance.

Require interval-supported values or permitted reconstruction from bracketing samples. For continuous point scores, use trapezoidal integration including both boundaries and intervening points. Never average isolated timestamps while assuming the unsampled tail is covered. Respect gaps and actual validity boundaries.

Evaluate temperature suitability and enabled modifiers before aggregation. Temperatures above and below a suitable band may average into it without ever producing sustained favorable conditions. Do not score from daily mean temperature, daily cloud percentage, or smoothed trend-window temperature. Preserve material accepted sub-hourly excursions or flag inadequate resolution. A short favorable spike contributes only its duration, not the day's maximum.

Newly suitable water does not prove fish arrival or establish a universal response lag. Optional history effects retain Section 6.5's independent evidence requirements. No three-hour biological response assumption follows from trend measurement windows.

### 9.3 Coverage and within-day variation

Store requested and covered intervals, duration-based coverage fraction, gaps, and source resolution separately for each species and practical assessment. `complete` means the entire requested period is covered; `partial` means some but not all; `none` means no usable intervals. Elapsed hours today are not missing coverage.

A numeric partial biological score is permitted only under a predeclared source/profile policy specifying minimum duration and fraction and acceptable gap patterns, with a representativeness rationale. Label it **“Partial-day outlook”**, expose its actual coverage, and exclude it from the Overall Pier Score and rankings. Otherwise return unavailable biology. Never fill gaps or lower coverage requirements to preserve a favorable result.

Retain within-day score range and duration distribution for diagnostics. Each profile must define and version a reviewed material-variation rule (magnitude and duration, with calibration rationale). When triggered, show “Conditions vary substantially today.” This qualifies the mean without presenting a best time. Compute the rule over actual covered data and disclose partial coverage. No universal variation threshold is a biological finding.

### 9.4 Daily headline

Among species with numeric, complete biological coverage and targeting eligibility verified throughout the period, choose the highest continuous daily species score. Exact ties use stable species ID. The driving species, fixed zone/method, period, coverage, confidence, and reasons travel with the headline. Do not maximize across hours, zones, methods, or behavioral profiles.

Access/conditions do not change this biological number. They qualify its presentation and independently determine promotion under Section 8.4. If blocked or unknown, the profile/calendar may retain a numeric headline only explicitly labeled **“Biological outlook only”** with the material notice prominent. If no species meets headline eligibility, return nonnumeric overall and null driving species while preserving qualified species context. Restricted/unknown targeting cannot support the headline.

The headline means strongest among assessed eligible targets; disclose unavailable and partial targets. Favorites do not change it. An explicit target filter searches only its labeled scope. Do not select a different lower-scoring species merely to bypass the driving species' promotion limitation.

### 9.5 Comparisons

Use whole-number display and deterministic continuous ordering. Describe rankings as daily opportunity among supported piers, with species, confidence, coverage, and limitations. Avoid copy claiming that adjacent ranks or small differences establish materially better catch prospects. Do not confidence-adjust the biological number.

Evaluate rank stability under plausible input/configuration uncertainty and differences in supported species breadth. More supported targets can legitimately raise a headline, but must not masquerade as stronger validation. Keep target-specific comparisons available and document ranking limitations during the pilot.

## 10. Confidence and fallback behavior

### 10.1 Separate dimensions

Maintain:

1. **Environmental confidence:** representativeness, quality, coverage, age, model/observation disagreement, and lead time.
2. **Fishery evidence confidence:** local support, transfer limits, seasonal evidence, and unresolved uncertainty.
3. **Calibration maturity:** `provisional`, `pilot_evaluated`, or `validated_for_scope`, with an evaluation reference.

For biological scores, environmental confidence concerns the inputs used by biology; missing practical-only inputs belong to the independent conditions assessment. Environmental and fishery confidence use `low`, `moderate`, or `high` under documented criteria. The displayed combined confidence is no higher than its weaker dimension. Provisional calibration caps combined confidence at moderate. Low confidence is not a numeric probability and must not be rendered as a percentage.

Fresh observed temperature alone cannot produce high overall confidence for an untested fishery model. All else equal, environmental confidence must not increase with lead time; improved evidence or a better source may legitimately change the comparison. Never reduce the underlying biological score merely because it is day four.

A daily score's confidence reflects its weakest material interval or input, not a favorable average hiding gaps. Practical-assessment uncertainty separately determines promotion and must not make an otherwise valid biological confidence unavailable. Display the main limitation next to the recommendation with details available on demand.

Use these minimum classification rules; source-specific numeric error and freshness cutoffs belong in the reviewed source profile:

| Dimension | High | Moderate | Low |
| --- | --- | --- | --- |
| Environmental | Representative source, complete fresh inputs, and independent evaluation supporting the relevant lead/depth/zone | Accepted source and complete essential coverage with documented model, fallback, or lead-time limitations | Usable but materially uncertain representation or forecast performance; not an essential validity failure |
| Fishery evidence | Direct local evidence supporting the target, season, and relevant behavior | Supported local fishery with reviewed regional transfer or limited local detail | Material but explicitly bounded inference remains beyond established foundational eligibility |

Failure of an essential validity or foundational eligibility check is unavailable, not merely low confidence. A modifier's inference label does not automatically determine the entire forecast's confidence; assess the materiality and scope of the uncertainty.

### 10.2 Required fallback matrix

| Situation | Required behavior |
| --- | --- |
| Preferred temperature observation fails, accepted model remains | Use labeled model estimate and reassess confidence |
| Required temperature unavailable from all accepted sources | Dynamic biological score unavailable; sourced seasonal context may remain |
| Optional trend history missing | Omit trend factor, disclose limitation; no fabricated trend |
| Required active profile unavailable | Combined species score unavailable; no weight redistribution |
| Optional minor weather modifier unavailable | Neutral factor with missing-effect reason; no remaining-weight inflation |
| Essential waves/weather missing | Biological scores may remain; practical assessment unknown and ranked promotion withheld |
| Freshness limit exceeded | Reject for active recommendation or use an independently valid configured fallback |
| Last successful snapshot exists but is expired | Historical read only, timestamped; no live daily recommendation |
| Forecast horizon ends | Partial/unavailable period; no persistence beyond horizon |
| Annual assessment absent or expired | Neutral annual factor, annual strength unknown |
| Current closure feed absent but reviewed access baseline valid | Published-access context with explicit live-status limitation |
| Essential legal/access baseline expired | Affected trip eligibility unknown |

Age limits are per product and capability. They must be assigned before a pier is enabled, based on source cadence and assessed usefulness. Merely displaying a stale badge does not make an expired recommendation usable.

## 11. User experience

### 11.1 Dashboard, navigation, and pier profiles

PierCast opens to its dashboard, without an interactive map. The primary flows are:

`Dashboard → ranked pier → pier profile → selected day report`

`Dashboard → State → Pier → View forecast → pier profile`

**Dashboard rankings:** During the three-to-five-pier pilot, use **Today’s supported piers**, listing up to five qualifying records with an explicit pilot scope. As the public catalog exceeds five piers, use **Top 5 piers today**; expose Top 10 only when at least ten piers are publicly supported. Either list may contain fewer eligible records. “Today” means each pier's remaining local day, not instantaneous bite quality.

Rank only records allowed by Section 8.4, using continuous Overall Pier Score then stable pier ID. Each row includes exact pier name, city/port, state, daily score, driving species, confidence, remaining-day label, and material limitations. The row opens its profile. Do not silently deduplicate sibling piers or modify scores by favorites. Poor/Limited scores retain their labels. Explain exclusion/coverage limitations and provide catalog access to piers outside the ranking. A number-one rank does not establish a statistically meaningful advantage.

**Find your pier:** Provide a state dropdown, followed by a pier dropdown filtered to that state. Label entries with city/port and exact pier identity. Reset the selected pier when its state changes; disable **View forecast** until a valid supported pier is selected. State selection here navigates the catalog and does not silently filter the Top 5/10 list. An optional separately labeled ranking filter may offer “All supported states” and a selected state. For supported Canadian coverage, use State/Province and unambiguous jurisdiction labels. Surface saved piers without requiring the dropdown sequence.

**Pier profile:** Show the individual pier name, city/port, and sibling-pier switch where applicable. Use a clickable five-date strip/calendar consistent with the existing FinFindr homepage calendar design, showing one overall score or unavailable state per date. Default to today. Selecting a date updates the day score, driving target, species images and scores, assessment period, confidence, limitations, and one to three grounded reasons together. Keep species score time context from Section 3.3; these are daily species means over the defined full/remaining-day period, with per-species coverage. Use existing species assets with accessible names and a fallback image; missing artwork must not suppress a valid species read.

**Hourly water temperature:** Below the day report, provide a five-day line-chart overview and selected-day detail, °F/°C display, and accessible hourly values. Identify the assessed full/remaining-day period; do not highlight a recommended fishing window. Identify the represented zone and depth when material; if the driving species uses a different configured zone, update the chart context rather than silently splicing zones into one line. A manually selected alternate series must identify that it is not the daily headline's basis.

The chart uses the same normalized source runs and transformations as the forecast. Label observations, nowcasts, and forecasts distinctly; preserve gaps, source changes, and horizon limits. Do not draw a seamless measured-to-modeled connection across an unassessed offset. Where only modeled temperatures exist, label the chart accordingly. If a temperature series remains valid but another essential input prevents a score, the temperature chart can remain visible with the scoring limitation. An hourly forecast chart does not imply hourly provider model runs.

The profile also includes source update time, material closure/conditions notices, and official access/regulation links. Keep model IDs and technical configuration out of the primary display. No map is required for either discovery or the temperature report.

### 11.1.1 Selected-day report order

1. Exact pier name and selected date; clear supported-coverage identity.
2. Prominent applicable current closure/hazard notice.
3. Overall score or explicit unavailable state, driving species, and confidence.
4. Five-date strip with explicit unavailable or biological-only states; partial species coverage remains visible in the day report.
5. Full/remaining-day scope, coverage, and any material within-day variation.
6. Daily species scores with their zone/method context, driving target first.
7. One to three grounded reasons and one material limitation if applicable.
8. Source update time and optional environmental details.
9. Official access/regulation links and optional trip feedback.

Use existing FinFindr components, typography, navigation, and entitlement conventions. Do not introduce implementation vocabulary such as model grid IDs into primary flows. Support screen readers, dynamic text, and non-color status cues.

### 11.2 Illustrative content only

The following is fictional UI copy, not a Ludington forecast or a calibrated fixture:

```text
PierCast — Example North Pier
Today · remaining day: 8/10 · Good
Strongest daily target: Chinook
Confidence: Moderate

Daily biological outlook · Lake-facing area

Species for the remaining day
Chinook 8 · Steelhead 6

Forecast cooling water supports this pier's seasonal Chinook opportunity.
Nearshore temperature is modeled; local plume conditions may differ.

Forecast updated 2:30 PM · Conditions can change before your visit
```

In a closed state, lead the report with closure information, preserving the actual affected interval. Available biological context may appear below with “Biological outlook only.” Do not leave a bright excellent-trip card above the closure notice.

### 11.3 Explanations and changes

Reasons MUST be generated from recorded contributions and limitations. Allowed wording distinguishes observed from forecast changes and inferred opportunity from measured fish presence.

Do not say “fish are here,” “fish are feeding aggressively,” “the run has arrived,” or “upwelling confirmed” based only on the scoring engine. Prefer “forecast cooling supports seasonal opportunity” when that is what the inputs establish.

“What changed?” compares like-for-like species, zone, and future valid intervals. If a score changed because elapsed hours were removed, a source changed, or configuration was revised, say so. For model-change attribution, compare old and new inputs over the same remaining interval; record passage-of-time effects separately. Do not attribute every score revision to changing lake conditions.

### 11.4 Comparison, personalization, and later alerts

Saved piers and target filtering must not mutate canonical forecasts. A nearby-pier comparison SHOULD show species, daily scope, confidence, and current limitations alongside score, rather than ranking on score alone with hidden context.

The pilot dashboard and later Top 5/10 presentation follow Section 11.1. User-specific target filtering applies to the pier report unless a separate ranking target filter is explicitly exposed and labeled; it must not silently change the default all-target leaderboard.

After validation, optional alerts may use saved pier/species preferences. Require explicit opt-in, minimum confidence, meaningful daily opportunity, complete practical checks, a meaningful change threshold, cooldown, deduplication, and a fresh reassessment immediately before send. Suppress alerts for unknown/closed/hazardous or expired conditions. Quantitative alert thresholds are a later evaluated product policy, not part of initial release.

Link to existing technique or tackle guidance only when the target/method context matches. PierCast's score must not change because a user owns particular tackle or has a particular subscription.

## 12. Architecture and operational design

### 12.1 Processing boundary

```mermaid
flowchart LR
  A[Agency observations and forecast products] --> B[Scheduled ingestion and quality checks]
  B --> C[Versioned zone time series]
  D[Reviewed pier and species configuration] --> E[Deterministic scoring and daily aggregation]
  C --> E
  F[Access rules and hazard assessments] --> E
  E --> G[Immutable forecast snapshot]
  G --> H[Authenticated API and app]
  G --> I[Replay and prospective evaluation]
```

Separate provider access, normalization, scientific configuration, scoring, conditions assessment, daily aggregation, storage, and presentation. Scoring functions must be pure given explicit inputs and evaluation time; do not fetch data or read wall-clock time inside them.

Extract each model cycle's required locations once and share the resulting environmental series across species and users. Client requests must not download and process whole lake model files. Verify NetCDF extraction, subsetting, runtime cost, and storage volume before choosing the ingestion runtime. Use a worker if the measured workload does not fit the existing environment; do not assume a new service is required before that prototype.

### 12.2 Existing application integration

Use a dedicated `_shared/pierCastEngine/` module and a PierCast API boundary following current repository conventions. Candidate reusable patterns include:

- [River Run temperature normalization](../supabase/functions/_shared/riverRunEngine/data/waterTemperature.ts).
- [Configuration revision storage](../supabase/functions/_shared/riverRunEngine/storage/configRevisions.ts).
- [Versioned snapshot construction](../supabase/functions/_shared/riverRunEngine/snapshot/buildDailySnapshot.ts).
- [River Run evidence/onboarding discipline](river_run_onboarding.md).

Reuse or extract general utilities where behavior actually matches. Do not make PierCast import River Run biological coefficients, river-only types, or public primitive semantics just to avoid a small dedicated interface. Shared changes require relevant existing-feature regression checks.

Suggested module responsibilities:

```text
_shared/pierCastEngine/
  config/         schemas, resolved profiles, evidence references
  providers/      adapters and source capability metadata
  normalization/  units, quality, depth and time alignment
  scoring/        availability, temperature, modifiers, biological output
  conditions/     access, target eligibility, practical conditions
  daily/          daily periods, coverage, aggregation, headline selection
  confidence/     dimension assessments and limitations
  presentation/   reason-code copy and public serialization
  storage/        manifests, revisions, snapshots, evaluation records
  validation/     config audits and onboarding invariants
```

### 12.3 Storage and immutable provenance

Persist these logical entities, using existing storage where appropriate:

- Pier catalog and versioned configuration/evidence revisions.
- Provider run manifests and normalized zone time series.
- Access, restrictions, and hazard assessments with validity and observation time.
- Immutable forecast snapshots and an active-snapshot pointer per pier.
- Issued forecast exposure events and optional trip feedback.
- Evaluation reports linked to engine/config/source versions.

A forecast MUST record `snapshotId`, `pierId`, `schemaVersion`, `engineVersion`, `configVersion`, `rubricVersion`, `generatedAt`, `evaluationTime`, source-run manifest, represented intervals, per-capability expiration, and resolved configuration hash.

Do not overwrite historical forecasts when new data arrives. Cache keys must include the versions and source identity needed to prevent an old calculation from masquerading as current. Store enough normalized inputs and provenance to replay a published score even when upstream rolling files disappear. Retention and cost must be sized before launch; retain at least the full pilot/evaluation period and the comparison seasons needed by its agreed analysis plan.

### 12.4 Public response contract

Use discriminated unions so numeric and unavailable states cannot be confused. The endpoint MUST expose equivalent information to:

```ts
type ScoreRead =
  | { status: "available"; score: number; displayScore: number; label: string }
  | { status: "unavailable" | "unsupported" | "restricted"; reasonCodes: string[] };

type ConfidenceRead = {
  environmental: "low" | "moderate" | "high" | "unavailable";
  fisheryEvidence: "low" | "moderate" | "high" | "unavailable";
  calibration: "provisional" | "pilot_evaluated" | "validated_for_scope";
  combined: "low" | "moderate" | "high" | "unavailable";
  reasonCodes: string[];
};

type Interval = { start: string; end: string };
type CoverageRead = {
  status: "complete" | "partial" | "none";
  coveredIntervals: Interval[];
  fraction: number;
  reasonCodes: string[];
};
type PromotionRead = {
  status: "eligible" | "limited" | "blocked" | "unknown";
  reasonCodes: string[];
};
type SpeciesDailyRead = {
  speciesId: string;
  zoneId: string;
  methodCategory: string;
  biological: ScoreRead;
  coverage: CoverageRead;
  targetingEligibility: "eligible" | "restricted" | "unknown"; // throughout requested period
  promotion: PromotionRead;
  confidence: ConfidenceRead; // biology, independent of missing practical inputs
  materialVariation: boolean | null; // null when not assessable
  reasonCodes: string[];
};
type DailyPierOutlook = {
  localDate: string;
  timezone: string;
  scope: "full_day" | "remaining_day";
  requestedInterval: Interval;
  evaluatedAt: string;
  coverage: CoverageRead | null; // driving species; null without a headline
  targetCoverage: { assessed: string[]; partial: string[]; unavailable: string[] };
  overall: ScoreRead;
  drivingSpeciesId: string | null;
  headlineMode: "daily_outlook" | "biological_only" | "unavailable";
  promotion: PromotionRead;
  species: SpeciesDailyRead[];
  confidence: ConfidenceRead; // driving biology; unavailable without headline
  limitations: string[];
  reasonCodes: string[];
};
```

This is the minimum response shape, not a complete type library. Add typed interval-specific access, targeting, and conditions assessments, practical coverage, current notices, source ages, expiration, and links. Preserve current hazards separately from full/remaining-day summaries. No `NaN`, `Infinity`, misleading zero, or fabricated default score may reach the API.

Enforce cross-field invariants: numeric `overall` requires a matching driving species with identical numeric biology, complete coverage, and verified targeting eligibility. Headline confidence equals the driving species' biological confidence, and top-level promotion matches that species' promotion. `daily_outlook` requires eligible/limited promotion; blocked/unknown promotion with numeric biology requires `biological_only`. No eligible headline requires nonnumeric overall, null driving species, unavailable headline confidence, and `unavailable` headline mode; species context remains independent. In that case top-level coverage is null with an explicit no-headline reason; per-species coverage remains available. Known blockers take precedence over unknown promotion; otherwise no-headline promotion is unknown. All species inherit the same requested period and retain their own actual coverage. Never serialize old session-selection fields.

Provide catalog lookup by jurisdiction/port, leaderboard reads restricted to limit 5 or 10, and chart series by pier/zone/interval. Chart metadata includes source kind, units, depth/zone, source run, and freshness. Leaderboard rows include `snapshotId`, `evaluatedAt`, local date, assessment interval, and driving species so ranking/profile provenance can be reconciled. Reuse stored forecasts and time series; opening the dashboard must not refetch environmental providers. The catalog-size rule controls Top 10 UI visibility independently of the endpoint's supported limits.

### 12.5 Refresh, failure, and consistency

Run ingestion when expected provider cycles become available, allowing their actual publication delay. Poll/retry with bounded backoff and idempotent run keys; deduplicate concurrent extraction. Define a source-specific refresh schedule for observations and alerts instead of inheriting a river schedule blindly.

Use the following initial refresh policy; polling intervals are product/operating defaults subject to verified provider limits, not promises that new measurements exist at those intervals:

| Layer | Initial policy | What changes |
| --- | --- | --- |
| Full five-date forecast | Rebuild after each accepted new hydrodynamic run, normally four times daily, approximately six hours apart | All supported future temperature values, daily species scores, headlines, coverage, and confidence are recomputed from the new run and other accepted inputs |
| Representative observations/current conditions | Check hourly, or at the slower supported source cadence | Refresh observations and affected near-term calculations only; do not propagate a current observation across all five days without a validated correction method |
| Wind/waves and other forecast products | Check at their documented publication cadence | Recompute affected valid intervals when a newly accepted product changes biological or practical assessment, even between water-model cycles |
| Current hazards/closures | Check supported machine-readable feeds every 15 minutes where permitted, or use supported event delivery | Apply relevant restrictions as soon as successfully ingested; do not wait for the next full forecast run |
| Remaining-day scores and dashboard | Reaggregate from stored valid series at hourly boundaries, accepted input/eligibility changes, and reads with an outdated assessment start | Remove elapsed hours, advance local dates at midnight, and refresh ranking without implying new provider data |

The approximately six-hour full refresh follows NOAA's documented four daily Great Lakes model cycles; wait for actual product availability and validation rather than using the cycle start as a release timestamp. [NOAA OFS run schedule](https://tidesandcurrents.noaa.gov/ofs/ofs_faq.html)

Do not rebuild or increment a public forecast revision solely because a poll returned unchanged data. Record `lastCheckedAt` separately from source observation/issue time and `forecastUpdatedAt`. On provider delay, retain still-valid data and disclose its age; do not imply a successful new forecast. No polling schedule overrides per-capability expiration.

### 12.5.1 Forecast changes and user trust

The normal five-day refresh is approximately four times daily, but relevant newer weather, hazard, access, or accepted near-term information may change affected reports between those cycles. Publish a coherent replacement snapshot when that happens. Forecast changes are expected; do not freeze a day, average old and new forecasts, or hide meaningful changes to preserve a pleasing score.

Use whole-number scores, qualified daily comparisons, and stable tie rules already defined in this specification to avoid implying significance in tiny differences. Show “Forecast updated…” and, where distinct, “Conditions checked…”. Explain a meaningful change using the actual cause; mention removal of elapsed hours or configuration changes when those caused it. Show “Forecasts may change as conditions develop” near the forecast details, with lead-time confidence retained separately.

On an already open screen, preserve the selected date/pier and apply a coherent update without resetting navigation. Safety/access limitations update promptly. Do not continuously reorder a leaderboard under the user's finger: mark that updated rankings are available and apply them on refresh/re-entry, while immediately disabling or qualifying any newly invalid recommendation. Opening a ranked pier loads its latest valid profile; if its score/assessment period differs from the displayed ranking snapshot, identify whether new inputs or removal of elapsed hours changed the report, rather than presenting inconsistent scores without context.

### 12.5.2 Publication and failure handling

Publish a snapshot atomically after source and scoring validation. A snapshot may intentionally contain unavailable capabilities, but must not mix a new headline with old species/period data. Keep the previous snapshot as current only while its applicable inputs remain valid; otherwise expose expiry or publish an explicit degraded result.

Publication MUST also reject superseded work. Use a per-pier refresh generation and a guarded active-pointer update that verifies the expected engine/configuration revision and accepted source/assessment manifest. A slow job built before a newer forecast or hazard update may be archived, but cannot replace the active result. `generatedAt` or job completion order alone is not a freshness ordering. An intentional rollback starts a new refresh generation under the explicitly restored version.

Hazard/access updates may require a new assessment before the next temperature cycle. Reuse valid environmental series and recompute eligibility promptly. On reads, reaggregate the remaining local day under Section 9.1 from still-valid stored series, so elapsed morning conditions cannot sustain an afternoon score. Persist or reproducibly identify this derived view with its base snapshot and evaluation time; source/configuration changes still publish a new immutable snapshot. Record the evaluated presentation time when logging what a user saw.

Monitor ingestion lag, rejected values, coverage loss, freshness breaches, fallback frequency, missing forecast cycles, abnormal score changes, and conditions-assessment failures. Configure operational thresholds from provider cadence and pilot performance; do not silently keep serving favorable cached results during an outage.

Support per-pier and per-capability disablement plus rollback to a prior reviewed engine/configuration pair. Rollback regenerates a forecast from still-valid inputs under the restored version; it must not reactivate an expired historical snapshot. Preserve the incident reason and all original forecast records.

The app may retain a last-viewed forecast offline, but MUST reevaluate its expiry and assessment timestamps locally. Show it as a saved forecast with its issue time and an explicit inability to refresh conditions. Offline data must not imply a fresh hazard/access check or produce a new trip alert. Do not recalculate a new live daily score on the client; retain the saved assessment interval explicitly until online refresh.

### 12.6 Access control and operating cost

Follow existing authentication, subscription enforcement, rate limiting, and database access patterns. Scoring runs server-side. Clients cannot publish configurations or alter shared scores. Service credentials stay server-side, and feedback is isolated by user under existing privacy controls.

Before public release, record measured extraction time/memory, calls per provider cycle, per-pier refresh cost, forecast response latency, and storage growth. Batch shared work and cache results to keep cost proportional primarily to coverage and provider cycles, not page views. Product/engineering must set concrete performance budgets from the measured pilot before broad rollout.

## 13. Validation and calibration

### 13.1 Separate three kinds of evidence

1. **Implementation correctness:** the software follows its contracts.
2. **Environmental skill:** inputs represent the pier and forecasts predict relevant conditions adequately.
3. **Fishing/product usefulness:** the resulting advice helps anglers make worthwhile decisions.

Passing unit tests establishes only the first. Replaying plausible-looking scores against observed weather does not establish prospective fishing forecast accuracy.

### 13.2 Required implementation scenarios

| Test scenario | Required outcome |
| --- | --- |
| Weak local ceiling, perfect temperature | Score cannot exceed the ceiling |
| Strong fishery and supportive season/temperature | Appropriate high bands are reachable without unrelated bonuses |
| Poor season, good weather | Seasonal ceiling remains effective |
| Unsupported species | Explicit unsupported state, no invented baseline |
| Every eligible species low | Headline cannot be excellent |
| Low species added | Existing headline score does not fall |
| Hazard affects part of the assessed day | Block ranked promotion, preserve exact notice interval and qualified daily biology; no implied all-day closure |
| Practical inputs missing but complete biology and targeting valid | Numeric biological headline may remain in biological-only mode; promotion unknown, no ranked entry |
| Secondary target restricted, unassessed, or less certain | No inherited eligibility/confidence and no misleading recommended-target placement |
| Conditions limited | Reasons qualify promotion; headline still equals driving daily biology with no practical score cap |
| Hazard affects route to another zone | Other zone is not silently treated as accessible |
| Essential input missing | Affected capability unavailable |
| Optional modifier missing | No renormalization inflation |
| Active profile missing | No favorable weight redistribution |
| Inactive zero-weight profile missing inputs | Active supported profile remains scoreable |
| Observation switches to model | No artificial trend at boundary |
| Comparable model and observations disagree materially | Source-specific confidence/rejection and recovery rules apply; disagreement is not concealed by averaging |
| Wrong depth or land cell | Source rejected or configuration invalid |
| Sentinel or wrong-unit temperature | Rejected, not scored |
| Temperature approaches the supported optimal range | Unrounded interpolated suitability improves gradually with other inputs fixed; no exact-temperature bonus |
| Small temperature change crosses a curve knot | Continuous response within reviewed slope/sensitivity limits, including combined trend effects |
| Temperature moves within a configured optimal plateau | No artificial preference for its midpoint or repeated improvement bonus |
| Evidence supports different seasonal temperature responses | Existing profiles express different bands/asymmetric slopes with continuous transitions; no duplicate seasonal multiplier |
| Same temperature/profile reached by warming versus cooling, trend disabled | Identical temperature suitability; no implicit direction bonus |
| Cooling overshoots the optimal band or reverses recently | No stale approaching-optimum bonus; current absolute constraints remain effective |
| Matched trend windows contain gaps or unequal observation density | Enforce hourly coverage; no fabricated change or weighting by sensor burst frequency |
| Absolute suitability improves but extra trend effect is unsupported | Temperature score improves without a second trend bonus |
| Valid measurement outside biological curve's accepted domain | No favorable endpoint clamping; explicit unavailable or evidenced out-of-domain rule |
| Opposite shore wind projection | Correct signed components |
| Forecast temperature includes wind response | No duplicate thermal wind effect |
| One-hour score spike | Daily mean reflects its duration; no best-hour maximization |
| Temperatures above/below the optimal band average into it | Aggregate time-resolved suitability scores; no score from the favorable mean temperature |
| Water becomes favorable | No inferred fish arrival or invented universal response lag |
| Negative optional modifier disappears | Bounded omission effect, explicit information-loss reason, reassessed confidence, and no loss-driven improvement alert |
| Material adverse-constraint input disappears | Required-input unavailable behavior; no neutral substitution |
| Large within-day variation | Configured magnitude/duration rule adds variation notice; no best-time recommendation |
| Partial day or species coverage | Visible limitation; no complete-day claim |
| Favorable morning has elapsed | Reaggregate remaining day using stored data; distinguish evaluation time from source refresh |
| Midnight, leap day, spring/fall DST | Correct dates, elapsed durations, and labels |
| Farther lead with identical biology | Same biological rating, separately assessed confidence |
| Annual adjustment expires | Neutral factor with unknown annual status |
| New config or model run | New immutable provenance; no stale cache collision |
| Old refresh completes after newer forecast or hazard assessment | Guarded publication prevents active-snapshot regression |
| Later closure/hazard update | Eligibility refresh does not wait for a new temperature run |
| Historical replay | Uses only data available by original issue time |
| Pilot catalog or Top 10 toggle | Pilot label with up to five entries; toggle appears at ten supported piers and preserves ranking scope/order |
| Fewer eligible piers than requested | No fabricated or blocked entries to fill the list |
| State changes in pier finder | Invalid pier selection cleared; leaderboard scope unchanged unless separately filtered |
| Calendar day changes | Score, species, daily scope, confidence, and chart context update coherently |
| Shared port research/source plan | Each pier retains its own assessed access/exposure; no fabricated score differences |
| Poll returns identical data | Check timestamp may advance; forecast issue/update time is not falsely renewed |
| New non-temperature forecast changes practical conditions | Affected report updates without waiting for next hydrodynamic run |
| Ranking snapshot differs from latest profile | Latest valid profile shown with update context |
| Temperature chart has source gap or zone change | Gap/scope disclosed; no artificial continuous series |
| Partial biological coverage meets configured display policy | Labeled partial species score; excluded from headline and rankings |
| Partial coverage fails duration/fraction/gap policy | Species score unavailable; no favorable subset selection |
| Alternate zone or method scores higher | Primary species basis stays configured; no daily or hourly maximization |
| All targeting eligibility restricted/unknown | Nonnumeric overall and null driver; qualified species biology preserved |
| Low biological confidence | Profile remains available; ranked promotion withheld without altering score |
| Cloud cover changes at night | No duplicated darkness bonus; enabled light follows evidenced hourly policy |
| Light modifier enabled | Compared with identical baseline without light; availability ceiling and omission bounds remain effective |
| Current date changes or DST shifts | Correct remaining/full-day boundaries and duration-weighted means; no invented fifth-date coverage |
| Same provider inputs, later evaluation | Remaining-day mean may change; forecast update timestamp does not falsely advance |
| Offline saved outlook | Original assessment scope retained, expiry reevaluated, no new client-generated live score |

Use focused unit/property tests for mathematical and state invariants, provider fixtures for parsing, integration tests for snapshot/expiry behavior, and rendered UI checks for misleading combinations. Avoid snapshot tests that merely lock in arbitrary curve values as scientific truth.

### 13.3 Environmental evaluation

Compare model estimates against representative, quality-controlled observations at relevant depth and scope where available. Quantify temperature bias and absolute error, trend-direction agreement, event timing error, coverage, and failure frequency by pier and forecast lead.

Include stable periods, rapid warming/cooling, seasonal transitions, source outages, and available high-wave events. Do not treat the same observation used for bias correction as independent validation. Keep fitting and evaluation periods separate and document limitations where observations are sparse.

A model can describe lake-wide conditions well and still misrepresent a harbor mouth. Material local errors require a better source/sampling plan, a narrower capability, or withholding that pier's dynamic forecast.

### 13.4 Fishery evidence and feedback

Seek agency creel data specific to fishing mode, species, place, season, and effort. Michigan DNR collects trip duration, targets, and catch information through angler surveys. This is a candidate evidence source, not assurance that every pier has sufficient records. [Michigan DNR creel program](https://www.michigan.gov/dnr/managing-resources/fisheries/creel)

Record dataset version and corrections. Do not substitute charter or offshore success for pier productivity, interpret unsampled periods as zero catch, or use raw catch totals without effort context.

Prospective voluntary feedback SHOULD capture pier/zone, trip start and duration, target, broad method, whether any target fish were caught, approximate count if offered, and perceived forecast usefulness. Include unsuccessful trips. Do not require a photo or precise private location. Tie feedback to the forecast actually seen when possible, preserving issue time and lead.

Treat feedback as observational and biased by angler skill, method, selection, reporting, and app influence. Deduplicate obvious repeated reports and investigate outliers; do not auto-tune from unverified reports. Offer existing user deletion/privacy controls and use aggregated results for evaluation.

### 13.5 Baselines and prospective evaluation

Compare:

1. Seasonal/local fishery baseline alone.
2. Baseline plus representative temperature.
3. Full enabled PierCast model.

Use held-out time periods and, where feasible, held-out locations. Tune on training data only. Use archived **as-issued forecasts** for forecast-skill claims; observed-weather replays must be labeled diagnostic. Never backfill future annual knowledge or revised catch reports into a past forecast's inputs without labeling the exercise retrospective.

Evaluate whether higher opportunity bands associate with better target-specific trip outcomes after effort/method context, whether day selection and pier comparisons add value separately, and how performance changes by lead time. Evaluate the duration-weighted daily mean and material-variation policy; compare any enabled light effect against the same baseline without light. Fishing-time prediction is outside v1 evaluation claims. Examine false excellent recommendations and missed good sessions, not just average agreement. A rare-target fishery needs its own uncertainty assessment rather than a borrowed catch-rate benchmark.

Before seeing pilot outcomes, write an evaluation plan specifying cohorts, collection period, feasible sample/precision targets, primary metrics, meaningful improvement thresholds, and stopping/extension criteria. Do not claim statistical reliability from an arbitrary minimum number of reports. Insufficient evidence permits an explicitly limited beta, not a validated-forecast claim.

### 13.6 Product measures

Track forecast-to-planning actions, repeat use among supported-region users, saved-pier use, voluntary usefulness feedback, and retention with exposure context. Separate app growth from forecast skill and account for seasonality. Do not use push-open rates as evidence of fishing accuracy.

Measure biological-score availability and ranked-recommendation availability during relevant fishing hours separately. Attribute absent recommendations to actual restrictions/hazards, missing or expired data, incomplete biology, or low confidence; do not collapse these into one outage metric. Track onboarding effort and recurring evidence/source maintenance per port alongside runtime costs.

Assess ranking stability under plausible input uncertainty and differences in supported target counts. Do not claim meaningful superiority from small numerical rank differences without evidence. Reference days and pilot findings must assess false excellent days and missed good days, with feedback linked to the daily forecast actually seen; individual trip outcomes remain observations with their actual duration and method.

Remove a modifier that does not justify its complexity on held-out evaluation. Preserve the comparison result and bump configuration/engine versions appropriately.

## 14. Pier onboarding and release gates

### 14.1 Required dossier

Create `docs/onboarding/piercast/<pier-id>/` or an equivalent consistent repository location containing:

- Identity, access, jurisdiction, fishing-zone, and reachability assessment.
- Shared and local evidence references with contradictions and limitations.
- Candidate species decisions, ceilings, profiles, and parameter provenance.
- Source capability matrix, endpoint fixtures, depth/grid assessment, and fallback plan.
- Resolved configuration and validation results, including fixed daily zone/method bases, partial-coverage policies, material-variation rules, and daily calibration anchors.
- Environmental comparison and scoring replay findings.
- Rendered normal, partial, unavailable, closed, and hazardous states.
- Pilot evaluation scope, release state, and maintenance/review triggers.

Do not copy another pier's calendar, strength, station, safety threshold, or legal reminder just because it shares a port or species.

Use one shared port research bundle plus concise per-pier difference records when onboarding sibling piers. Reference shared evidence rather than duplicating dossiers verbatim. Record why each inherited profile/source is representative and which overrides are required. Expanding coverage does not require onboarding every pier in that city at once.

### 14.2 Status progression

| Status | Required evidence |
| --- | --- |
| `research_incomplete` | Candidate exists; material identity, fishery, source, or access questions remain |
| `research_ready` | Foundational evidence, zone representation, species eligibility, and source plan reviewed |
| `implementation_ready` | Valid configuration, provider prototype, replayable engine, and acceptance scenarios pass |
| `pilot_ready` | Rendered states, monitoring, privacy/feedback flow, and predeclared evaluation plan complete |
| `pilot_live` | Authorized limited public/beta enablement, with actual scope recorded |
| `release_ready` | Pilot reviewed against its predeclared criteria; remaining limitations and operating budgets accepted |
| `released` | Authorized broader enablement, production smoke checks, monitoring, and handoff complete |

Authorization is evaluated from actual user instructions, including authorization already given. Do not invent repeated permission gates. Technical readiness and user authorization are separate facts; neither should be implied by a generic “done” label.

Unresolved foundational fishery evidence, sampling representation, essential access/targeting rules, or required data capability blocks the affected public capability. A disabled optional modifier does not block an otherwise valid pier. Failures at one pier must not require disabling unrelated validated piers.

## 15. Implementation sequence and deliverables

### Phase 1 — Evidence and provider feasibility

- Select pilot candidates based on data and validation feasibility.
- Build species evidence bundles and pier dossiers.
- Probe actual model, observation, wave/weather, access, and alert sources.
- First demonstrate one complete pier/species/zone forecast using real provider extraction, then extend to the three-to-five-pier pilot. Verify that configured depth/zone samples represent water reachable by pier anglers; pier-only usage does not establish sampling validity.
- Measure ingestion resource needs and choose the simplest sufficient runtime.

**Exit:** No assumed live data capabilities; candidate scope and missing capabilities explicit.

### Phase 2 — Contracts and deterministic engine

- Implement schemas, evidence references, configuration resolution, and validation.
- Normalize units/time/depth and implement provider fixtures.
- Implement bounded biology, separate conditions assessment, confidence, and daily aggregation/headline selection.
- Add pure-function invariants and reason-code traces, daily calibration anchors, and remaining-day/partial-coverage checks. Keep optional biological modifiers disabled for the initial baseline; evaluate light separately before enabling it.

**Exit:** Representative fixtures produce coherent, explainable outputs including failures; no production enabling required.

### Phase 3 — Stored forecasts and app integration

- Implement scheduled shared ingestion, immutable snapshots, API serialization, expiry, and refresh behavior.
- Integrate the pilot dashboard and catalog-dependent Top 5/10 presentation, State → Pier finder, individual pier profiles, clickable five-date calendar, species images/target filtering, hourly temperature chart, source/limitation details, and saved piers.
- Add voluntary feedback and exposure linkage.
- Verify accessibility, entitlement handling, and the misleading-state scenarios.

**Exit:** Complete end-to-end experience in the intended test environment with measured cost/latency and operational checks.

### Phase 4 — Environmental validation and limited pilot

- Evaluate source representativeness and forecast errors by lead.
- Predeclare prospective fishing/product evaluation and baseline comparisons.
- Enable only the authorized, ready pilot scope.
- Monitor failures and collect successful and unsuccessful trip feedback.

**Exit:** A written assessment distinguishing correctness, environmental skill, and product/fishing usefulness; extend the pilot if evidence is insufficient.

### Phase 5 — Broader release and expansion

- Apply evaluated calibration changes with versioned replay evidence.
- Publish the actual validated scope and known limitations.
- Expand through the same dossier/configuration workflow.
- Consider comparison enhancements and opt-in improvement alerts only after the core decision support earns trust.

**Exit:** Authorized release, operational ownership, maintenance cadence, and measurable evidence for further expansion.

## 16. Definition of done

PierCast is complete for a named release scope only when:

- Its exact piers/species/jurisdictions are declared and researched.
- Required biological claims have reputable, applicable evidence and calibration labels.
- No species temperatures or coefficients are invented to satisfy a schema.
- Sampling represents reachable water within documented limits.
- Scores, targets, daily periods, confidence, and practical limitations agree by construction.
- Five-date coverage and partial/unavailable states reflect actual provider support.
- Current and future conditions are assessed within their real validity horizons.
- Essential missing data and expired snapshots cannot produce a live recommendation.
- Configuration and source-run provenance reproduce published results.
- Necessary automated and rendered checks pass, including unaffected shared-feature checks when shared code changed.
- Environmental evaluation and prospective pilot findings are recorded without overstated accuracy claims, separating day selection from pier comparison and testing any enabled modifier against its baseline.
- Biological and ranked-recommendation availability, false excellent days, onboarding effort, and recurring maintenance are recorded against the predeclared pilot criteria.
- Operating budgets, monitoring, feedback privacy, source maintenance, and rollback are in place.
- The user-authorized release action and scope have actually been completed and verified.

## 17. Research starting points and applicability notes

These references support source discovery and design rationale. They do not substitute for parameter-specific evidence records or approve a launch pier.

| Source | Appropriate use | Must not be inferred automatically |
| --- | --- | --- |
| [NOAA OFS documentation](https://tidesandcurrents.noaa.gov/ofs/ofs_faq.html) | Product formats, timing, variables, and access discovery | Local pier forecast accuracy |
| [NOAA GLERL GLCFS](https://www.glerl.noaa.gov/res/glcfs/) | Experimental product status and related data discovery | Guaranteed operational availability |
| [NOAA water-temperature FAQ](https://www.glerl.noaa.gov/education/FAQs/temperatureFAQ.html) | Stratification and wind/upwelling context | Confirmed local fish presence or a catchability coefficient |
| [Indiana DNR Lake Michigan fishing](https://www.in.gov/dnr/fish-and-wildlife/fishing/lake-michigan-fishing/) | Regional seasonal shoreline-fishery context | Identical profiles at other Great Lakes piers |
| [Michigan DNR Chinook profile](https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon) | Species and life-history research starting point | An exact universal pier temperature curve |
| [Michigan DNR creel program](https://www.michigan.gov/dnr/managing-resources/fisheries/creel) | Agency effort/catch evidence discovery | Adequate samples for every pier or fishing mode |
| [Michigan DNR 2025 creel report](https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/FisheriesReports/FR049.pdf) | Fishing-mode methodology and historical revision context | Direct use of lake-wide catch totals as pier productivity |
| [NWS Great Lakes safety](https://www.weather.gov/safety/great-lakes) | Pier wave/structure hazards and official safety context | A universal safe wave-height threshold |
| [Michigan DNR regulations](https://www.michigan.gov/dnr/things-to-do/fishing/fishing-regulations) | Current jurisdiction-specific regulation discovery | Coverage of another jurisdiction or an unreviewed boundary |

Reference review date: 2026-09-05. Provider contracts and current regulations must be rechecked during implementation and onboarding. This document deliberately leaves unsupported biological numbers out: the required evidence-and-calibration workflow is how those numbers become defensible configuration.
