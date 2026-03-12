# Core Intelligence Edge-Case Rules — Implementation Plan

**Status:** Ready to implement  
**Primary specs:** `core_intelligence_spec.md`, `hows_fishing_feature_spec.md`  
**Scope:** Add a small set of deterministic biological override rules that improve timing and behavior realism without turning the engine into a pile of ad hoc exceptions.

---

## 1. Executive Summary

The core engine is already strong as a weighted deterministic model, but some environmental situations are governed by a dominant biological constraint that should temporarily outweigh the normal timing mix.

Example already identified:

- in cold freshwater, midday warming can matter more than a dawn solunar bump because fish are constrained by metabolism first

This plan adds a short list of **high-confidence edge-case rules** that are:

- biologically broad enough for V1
- deterministic from current inputs
- narrow enough to avoid breaking baseline scoring logic
- testable with fixture-based engine tests

Just as important, these rules must preserve **honesty and transparency** in the final user-facing output:

- the engine should never pretend confidence it does not have
- the feature should never present a proxy as a direct measurement
- the narrative must clearly explain when a timing recommendation is being driven by a dominant biological constraint
- if a rule meaningfully shifts the usual "best time" expectation, the explanation should make clear why

The correct architecture is:

1. keep the base weighting/scoring engine
2. add narrow override or bias rules only where fish biology strongly supports them
3. apply these rules primarily to `timeWindowEngine`, and secondarily to behavior outputs when needed
4. do not create species-specific or waterbody-specific folklore rules

---

## 2. Guiding Principle

Think like a fish:

- fish do not respond to a scorecard
- fish respond to temperature, oxygen comfort, light exposure, current, safety, and feeding opportunity
- when one environmental force becomes dominant, it can temporarily override the "usual" best time

So these rules should answer:

- what is the fish trying to optimize right now
- what is the dominant biological constraint
- which windows become more or less realistic because of that constraint

They should also answer:

- what would an honest guide need to tell the angler so the recommendation does not feel misleading

These are **not** meant to replace the base engine. They are meant to keep the engine from making obviously unrealistic timing calls when one environmental driver becomes dominant.

---

## 3. Brackish Salinity Rule — V1 Position

## Recommendation

Yes, for V1, `precip_48hr_inches` is a valid proxy for runoff-driven salinity disruption in brackish systems.

That is not the same as directly measuring salinity, so the engine must describe it honestly:

- this is a **freshwater-influx / runoff disruption proxy**
- not a direct salinity reading
- useful enough in estuarine biology to justify deterministic rule logic in V1

## Why this makes biological sense

In brackish water, heavy rainfall and runoff can:

- reduce salinity in upper estuary zones
- displace bait and gamefish from their usual holding zones
- make outgoing water less stable immediately after major rain
- push fish toward cleaner, more stable, higher-salinity water

Even without direct salinity measurement, recent rainfall is still a strong ecological signal.

## V1 framing rule

Use precipitation as a **salinity disruption proxy** only in brackish logic.

Do **not** claim:

- exact salinity level
- exact runoff volume
- exact plume boundaries

Do claim:

- heavy recent rainfall likely caused freshwater influx
- this likely disrupted salinity stability
- incoming cleaner water may become relatively more favorable than outgoing water

User-facing honesty requirement:

- never say the app measured salinity
- always frame this as a rainfall/runoff-based estuary stability inference
- if the report references this condition, it should clearly say the engine is inferring likely salinity disruption from recent rainfall, not reading salinity directly

---

## 4. Rules To Implement

Only implement the following V1 rules in this pass.

### Rule 1 — Freshwater Cold-Season Midday Warming Bias

**Status:** Already partially implemented  
**Need in this pass:** formalize, spec-align, and test thoroughly

**Biology**

In cold freshwater, fish near lethargic or shutdown thresholds often feed when water reaches its daily warmest period. Small midday warming can improve comfort, movement, and willingness to slide shallower.

**Trigger**

- `water_type = freshwater`
- `water_temp_zone in [near_shutdown_cold, lethargic, transitional]`
- cold season (`DJF` or `MAM`)

**Effect**

- reduce blind dawn/dusk dominance
- add a midday warming bonus window
- allow midday blocks to outrank weak dawn solunar timing when thermal conditions justify it

**Behavior shift**

- fish hold deeper and more stable early
- move more willingly toward warming flats/transitions later
- feed in shorter, warmer-day windows rather than classic low-light windows

**User-facing honesty**

- if midday outranks dawn, the report should explain that cold-water fish are prioritizing thermal comfort over a weaker low-light/solunar setup
- it should not imply dawn is "wrong" in general, only that this specific thermal setup changes the expected timing

**Engine layer**

- primarily `timeWindowEngine.ts`
- optionally reinforce `behaviorInference.ts` narrative tags only if needed

---

### Rule 2 — Freshwater Summer Heat Suppression Rule

**Biology**

In hot freshwater, midday sun can increase thermal stress, reduce dissolved oxygen in shallow water, and make fish less willing to expose or chase aggressively. Even good solunar timing should not fully rescue a high-heat midday window.

**Trigger**

- `water_type = freshwater`
- `water_temp_zone in [thermal_stress_heat, peak_aggression]`
- strong light condition (`midday_full_sun` or `midday_partly_cloudy`)
- optional reinforcement: low cloud cover and weak cooling influence

**Effect**

- suppress midday windows
- boost dawn, dusk, and night windows relative to midday
- prevent solunar alone from turning hot midday into a prime recommendation

**Behavior shift**

- fish pull to shade, depth, or higher-oxygen zones
- become more comfortable feeding at first light, last light, or after dark
- willingness to chase decreases during peak heat exposure

**User-facing honesty**

- the report should clearly state that heat and exposure are suppressing midday activity even if another timing factor looks decent
- it should avoid hype like "great moon window" when heat stress is the dominant limiter

**Engine layer**

- `timeWindowEngine.ts`
- possibly add small supporting note in `behaviorInference.ts` if windows and behavior should stay aligned

---

### Rule 3 — Freshwater Rapid Warming Late-Day Shift

**Biology**

After a cold spell, rapid warming often improves the later part of the day more than early morning. Fish follow improving thermal comfort and may position shallower or more actively after the water has had time to warm.

**Trigger**

- `water_type = freshwater`
- `temp_trend_state = rapid_warming` or `warming`
- `water_temp_zone in [near_shutdown_cold, lethargic, transitional]`

**Effect**

- add weight to late morning through afternoon
- reduce over-reliance on dawn windows if the system is still thermally cold
- allow later windows to move above early windows when thermal recovery is the dominant driver

**Behavior shift**

- morning fish remain conservative
- later fish slide toward sun-warmed zones, transitions, shallow edges, and flats
- activity improves as comfort improves, not simply because of light

**User-facing honesty**

- the explanation should make clear that the better later-day window is tied to improving temperature conditions, not generic afternoon optimism

**Engine layer**

- `timeWindowEngine.ts`

---

### Rule 4 — Freshwater Overcast Extension Rule

**Biology**

Overcast reduces light penetration and visual exposure, often extending shallow feeding confidence beyond the usual dawn/dusk envelope. If fish are not thermally suppressed, low-light conditions can remain favorable for longer.

**Trigger**

- `water_type = freshwater`
- `light_condition` trends toward overcast conditions
- `cloud_cover_pct >= 70`
- `water_temp_zone` is not `near_shutdown_cold`
- no strong thermal-stress override active

**Effect**

- extend productive windows later into morning and/or earlier into afternoon
- soften harsh midday penalties during overcast conditions

**Behavior shift**

- fish stay shallower longer
- edge-oriented feeding lasts beyond dawn
- visual-security benefit persists while overcast remains strong

**User-facing honesty**

- the report should explain that overcast is extending the low-light effect
- it should not exaggerate overcast into a blanket "all day is great" message if other suppressors remain active

**Engine layer**

- `timeWindowEngine.ts`

---

### Rule 5 — Post-Front Bluebird Compression Rule

**Biology**

After a front, rising pressure and clear, stable conditions often do not just reduce activity; they compress activity into shorter and more conditional windows. Fish become less forgiving and more position-dependent.

**Trigger**

- `recovery_active = true`
- `pressure_state in [slowly_rising, rapidly_rising]`
- light is clear or high-exposure

**Effect**

- compress the number and size of good windows
- prevent `PRIME` under clear post-front compression and cap any remaining surfaced windows at `GOOD`
- marginal windows may fall out of surfaced best windows entirely once compressed
- this is a timing realism rule, not just a raw-score rule

**Behavior shift**

- fish hold tighter to comfort cover or stable depth
- feeding windows narrow
- activity becomes more opportunistic and less sustained

**User-facing honesty**

- if a decent-looking day still has compressed opportunity, the report should say that fish may only give short windows rather than broad sustained action

**Engine layer**

- `timeWindowEngine.ts`

---

### Rule 6 — Saltwater Slack-Tide Dominance Cap

**Biology**

In many saltwater situations, current movement is the primary feeding timer. Weak movement or slack water often suppresses feeding opportunity enough that solunar should not be able to fully override it.

**Trigger**

- `water_type = saltwater`
- `tide_phase_state in [slack, final_hour_before_slack]`
- optionally reinforce with weak tide strength

**Effect**

- cap the maximum rating of those blocks
- prevent solunar alone from producing a `PRIME` outcome during dead movement
- keep movement dominant in coastal timing logic

**Behavior shift**

- fish lose current-fed positioning advantage
- bait movement weakens
- ambush points become less productive until water movement resumes

**User-facing honesty**

- the report should be clear that moon/solunar support does not fully overcome dead movement when tide is weak or slack

**Engine layer**

- `timeWindowEngine.ts`

---

### Rule 7 — Brackish Runoff / Freshwater Influx Proxy Rule

**Biology**

Heavy recent rain in brackish systems can destabilize salinity and displace fish, especially in upper estuary and shallow backwater zones. Incoming cleaner or more stable water often becomes relatively more favorable than outgoing water immediately after runoff events.

**Trigger**

- `water_type = brackish`
- `salinity_disruption_alert = true`
- this alert remains driven by precipitation proxy in V1

**Effect**

- penalize outgoing windows after heavy runoff
- relatively favor incoming tide windows
- suppress shallow stagnant brackish windows when disruption is active

**Behavior shift**

- fish slide toward higher-salinity refuge zones
- creek mouths, passes, inlets, deeper drains, and cleaner inflow zones improve
- unstable outgoing water becomes less attractive

**Engine layer**

- `timeWindowEngine.ts`
- optional reinforcement in `behaviorInference.ts` to push positioning toward refuge/cleaner exchange zones

**Important wording rule**

This must be described internally and in specs as:

- runoff / freshwater-influx salinity disruption proxy

Not:

- direct salinity measurement

**User-facing honesty**

- the report must clearly say recent rainfall likely disrupted salinity stability
- it must not claim a measured salinity crash, plume reading, or exact salinity zone boundary

---

### Rule 8 — Cold Inshore / Brackish Midday Warming Rule

**Biology**

In cold inshore salt and brackish environments, sun-warmed flats, mud, and protected backwater can become more favorable later in the day. This is weaker and more situational than the freshwater version, but still real enough to justify a narrow rule.

**Trigger**

- `water_type = brackish`, or `water_type = saltwater` only when movement context is weaker/protected-style rather than open-coast dominant
- `water_temp_zone in [near_shutdown_cold, lethargic]`
- midday warming window is present
- no strong contradictory incoming-tide advantage

**Effect**

- add a modest midday warming bonus
- do not override strong incoming-current advantages
- weaker than freshwater cold-season midday warming

**Behavior shift**

- fish may move from deep refuge to sun-warmed edges or flats later in the day
- shallow opportunity improves after warming has accumulated
- early cold water can remain less productive despite decent moon timing

**User-facing honesty**

- the report should explain that this is a cold-water comfort effect in protected inshore/brackish settings, not a universal saltwater rule
- the report should avoid implying that midday warming applies broadly across exposed open-coast saltwater scenarios

**Engine layer**

- `timeWindowEngine.ts`

---

## 5. What Not To Implement In This Pass

Do **not** add these yet:

- snowmelt-specific rules
- reservoir generation/current rules
- turnover rules
- warm-rain vs cold-rain distinction
- species-specific night-bite rules
- bottom-composition-specific heating rules
- NDBC / marine-SST fallback logic

These may be real, but they are either too input-dependent, too location-specific, or too easy to fake with weak proxies.

---

## 6. Implementation Strategy

## Phase 1 — Formalize Rule Framework

Add a small internal rule framework inside `timeWindowEngine.ts`.

Recommended pattern:

- compute base block score as it works today
- compute `ruleAdjustments` after base scoring
- each rule can:
  - add points
  - subtract points
  - cap label ceiling
  - append drivers
- keep rules deterministic and ordered

Suggested rule categories:

- `thermal_override_rules`
- `movement_override_rules`
- `light_exposure_rules`
- `recovery_compression_rules`

Do not scatter one-off `if` statements everywhere if they can be grouped cleanly.

---

## Phase 2 — Implement In This Order

Implement in the following order:

1. freshwater cold-season midday warming formalization
2. freshwater summer heat suppression
3. freshwater rapid warming late-day shift
4. freshwater overcast extension
5. post-front bluebird compression
6. saltwater slack-tide cap
7. brackish runoff/freshwater-influx proxy rule
8. cold inshore/brackish midday warming

Reason:

- freshwater timing edge cases are currently the most visible quality issue
- slack-tide cap is the strongest coastal realism safeguard
- brackish runoff logic is important, but should be framed carefully

---

## 7. Files To Touch

Primary:

- `TightLinesAI/supabase/functions/_shared/coreIntelligence/timeWindowEngine.ts`
- `TightLinesAI/supabase/functions/_shared/coreIntelligence/behaviorInference.ts`
- `TightLinesAI/supabase/functions/_shared/coreIntelligence/__tests__/engine.test.ts`

Possibly update if needed:

- `core_intelligence_spec.md`
- `hows_fishing_feature_spec.md`

Do **not** change prompt engineering first. These are deterministic logic improvements and should be implemented and tested before any LLM wording changes.

---

## 8. Testing Requirements

Every rule must get dedicated deterministic fixture tests.

Required test categories:

### A. Positive-fire tests

For each rule:

- rule fires when the exact trigger conditions are met
- expected driver appears in `time_windows[*].drivers`
- expected window ranking shifts in the intended direction

### B. Negative-fire tests

For each rule:

- similar but non-qualifying conditions do **not** trigger the rule
- ensure the rule does not leak into unrelated seasons or water types

### C. Conflict-resolution tests

Test competing drivers:

- cold freshwater midday warming vs dawn solunar
- hot freshwater midday suppression vs major solunar
- brackish runoff incoming-tide preference vs slack penalty
- cold inshore midday warming vs strong incoming tide

### D. Regression tests

Confirm that:

- raw score logic remains unchanged unless intentionally modified
- repeatability still returns byte-identical output
- existing working freshwater/salt/brackish cases still behave sensibly

---

## 9. Success Criteria

This pass is successful if:

1. the engine stops making obviously unrealistic timing recommendations in the target edge cases
2. timing changes are explainable through fish comfort, movement, and feeding opportunity
3. brackish runoff logic works as an honest precipitation proxy rather than pretending to measure salinity
4. saltwater timing remains movement-first
5. freshwater timing better reflects seasonal thermal biology
6. test coverage proves the rules are narrow and deterministic

---

## 10. Implementation Notes For The Next Agent

- Preserve the current weighted engine. Do not rewrite the whole scoring architecture.
- Add rules narrowly.
- Prefer time-window overrides over raw-score rewrites unless a rule is clearly score-relevant.
- Keep every rule biologically defensible and explainable in one sentence.
- If a rule feels species-specific, location-specific, or dependent on missing data, skip it in this pass.
- For brackish runoff logic, always describe the mechanism as a precipitation-driven freshwater influx proxy, not measured salinity.
- Preserve honesty in both engine metadata and downstream feature narration. If the engine is using a proxy or dominant-rule interpretation, the feature must explain that clearly rather than presenting it as direct measurement or universal truth.

---

## 11. Recommended Deliverable Sequence

The implementing agent should deliver in this sequence:

1. update deterministic rule logic
2. add/expand fixture tests
3. run full engine harness
4. update specs to match final implemented rule behavior
5. provide a concise audit of which rules materially changed time-window outcomes
6. provide a short honesty/transparency audit describing how each new rule should be explained to the user

---

## 12. Bottom Line

These rules are worth adding because they reflect how fish actually behave when one environmental force becomes dominant:

- cold changes metabolism
- heat changes comfort and oxygen behavior
- overcast changes exposure
- fronts compress activity
- movement governs coastal feeding
- runoff destabilizes brackish positioning

That is the right place to sharpen the engine next.
