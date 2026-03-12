# Sonnet Implementation Prompts

Use ONE prompt per session. Do Sweep 1 first, verify, then Sweep 2, then Sweep 3.

---

## SWEEP 1 PROMPT

```
You are implementing Sweep 1 of a 3-sweep engine refinement for a fishing intelligence app called TightLines AI. This sweep establishes the foundation — new types, derived variable logic, and data fetching changes — that Sweeps 2 and 3 depend on. Everything must be correct here or the later sweeps will fail.

YOUR IMPLEMENTATION GUIDE:
Read the full sweep document at: docs/ENGINE_REFINEMENT_SWEEP_1.md

BEFORE YOU WRITE A SINGLE LINE OF CODE:
1. Read docs/ENGINE_REFINEMENT_SWEEP_1.md in FULL — cover to cover, every change, every code block
2. Read EVERY target file listed under "Files Modified" in FULL:
   - supabase/functions/_shared/coreIntelligence/types.ts
   - supabase/functions/_shared/coreIntelligence/derivedVariables.ts
   - supabase/functions/get-environment/index.ts
3. Understand the existing code structure before modifying anything

EXECUTION RULES — READ CAREFULLY:
- Execute changes IN ORDER: 1.1, 1.2, 1.3, ... 1.14
- Do NOT skip any change — every single one is required
- Do NOT rush. Take your time on each change. Think critically about what the change does and WHY before writing code.
- When the doc says "REPLACE" → replace the ENTIRE function/block. Do not partially merge.
- When the doc says "Add" → add code without removing existing code
- When the doc says "Find and change" → locate the exact line and modify ONLY that
- Preserve ALL existing exports and function signatures unless the change explicitly says to modify them
- After modifying each file, verify it compiles: run `deno check` on the file

CRITICAL AREAS THAT NEED EXTRA CARE (slow down here):

Change 1.3 (5-band seasonal mapping table):
This is a LARGE lookup table — 5 latitude bands × 12 months. Copy it exactly from the sweep doc. Do not abbreviate, do not skip months, do not guess values. Every cell matters — a wrong seasonal state for a given band+month will cascade into wrong scores for users in that region. Double-check after pasting.

Change 1.4 (Saltwater seasonal state):
New function with a 3-band × 12-month table. Same care as 1.3 — transcribe exactly.

Change 1.5 (Freshwater water temp estimation):
This is the most complex single function in the sweep. It has TWO paths — river (groundwater blending) and lake (correction table + floor + clamp). Read the entire function, understand the math, then implement. Key things to verify:
- River path uses α × air_estimate + (1-α) × groundwater_base formula
- Lake path has a 32°F hard floor (water can't be below freezing)
- Lake deep-winter clamp: north/far_north lakes in deep_winter_survival are clamped to 32-35°F
- Function signature CHANGED — it now takes latBand and seasonalState params. You MUST update all call sites.

Change 1.8 (Wind-tide approximation):
The function signature CHANGED — it now takes tidePhaseState and env as additional params. Update the call site in deriveDerivedVariables. If you forget to update the call site, TypeScript will error — read the error carefully and fix the call.

Change 1.10 (Main deriveDerivedVariables update):
This is the orchestrator function. Many call sites change because upstream functions got new parameters. Go through EVERY function call in this function and verify the arguments match the new signatures from earlier changes. Common mistake: forgetting to pass latBand or seasonalState to functions that now require them.

Changes 1.11-1.14 (get-environment updates):
These modify the data-fetching edge function. They are simpler but must be precise:
- 1.11: Elevation fetch — add the function AND wire it into the parallel fetches AND add to response
- 1.12: Solunar duration modulation — replace FIXED constants with the phase-aware function. Find where `SOLUNAR_MAJOR_HALF_MINUTES` and `SOLUNAR_MINOR_HALF_MINUTES` are used and replace with the dynamic function call. The moon phase label comes from the USNO moon data — make sure you pass it correctly.
- 1.13: Timezone — Open-Meteo already provides timezone and offset. Verify the existing code already uses them (it does in fetchOpenMeteo). The main handler should prefer these over the longitude fallback.
- 1.14: Wind gusts — add to the Open-Meteo API params AND extract from response AND include in weather object

IF YOU GET STUCK on any change:
- Re-read the change description word by word
- Re-read the target file's current code
- Check if a function signature changed in an earlier change that affects the current one
- If a TypeScript error appears, read it carefully — it usually tells you exactly what parameter is missing or mistyped

AFTER ALL 14 CHANGES ARE COMPLETE:
Run the Verification Checkpoint at the bottom of the sweep doc. Go through EVERY numbered item:
1. TypeScript compiles — run deno check on all three modified files
2. New types exist — verify in types.ts
3. deriveDerivedVariables returns new fields — check the return object
4. Water temp test case — mentally trace through for Prudenville MI (lat=44.3, March, lake)
5. Seasonal test cases — trace through the lookup tables
6. Altitude test case — compute effective latitude for given inputs
7. Solunar test case — verify transition zones work
8. Wind-tide test case — verify non-neutral result for East Coast incoming tide

Fix any issues found. Do NOT move on to Sweep 2 until every verification item passes.

Finally, give me a summary of:
- Every file modified and what changed
- Any issues you encountered and how you resolved them
- Verification checkpoint results (pass/fail for each item)
```

---

## SWEEP 2 PROMPT

```
You are implementing Sweep 2 of a 3-sweep engine refinement for TightLines AI. This sweep modifies the scoring engine, time window system, recovery modifier, behavior inference, and the main engine orchestrator. These changes eliminate score consistency issues (cliff effects), add 4-tier time windows, and wire up all the new fields from Sweep 1.

PREREQUISITE CHECK — DO THIS FIRST:
Before starting, verify Sweep 1 was completed by checking:
1. types.ts has: LatitudeBand, SaltwaterSeasonalState, "mild_winter_active", new SolunarState values ("within_60min_of_major", "within_90min_of_major", "within_60min_of_minor"), WindowLabel includes "FAIR" | "SLOW"
2. derivedVariables.ts exports: saltwater_seasonal_state, latitude_band, effective_latitude, severe_weather_alert, severe_weather_reasons in its return object
3. All three Sweep 1 files compile with deno check

If ANY of these are missing, STOP and tell me — Sweep 1 is incomplete.

YOUR IMPLEMENTATION GUIDE:
Read the full sweep document at: docs/ENGINE_REFINEMENT_SWEEP_2.md

BEFORE YOU WRITE A SINGLE LINE OF CODE:
1. Read docs/ENGINE_REFINEMENT_SWEEP_2.md in FULL — every change, every code block
2. Read EVERY target file listed under "Files Modified" in FULL:
   - supabase/functions/_shared/coreIntelligence/scoreEngine.ts
   - supabase/functions/_shared/coreIntelligence/timeWindowEngine.ts
   - supabase/functions/_shared/coreIntelligence/recoveryModifier.ts
   - supabase/functions/_shared/coreIntelligence/behaviorInference.ts
   - supabase/functions/_shared/coreIntelligence/index.ts
3. Understand the current scoring logic before changing it

EXECUTION RULES — READ CAREFULLY:
- Execute changes IN ORDER: 2.1, 2.2, 2.3, ... 2.16
- Do NOT skip any change — every single one is required
- Do NOT rush. These are scoring changes — a wrong number means wrong scores for every user.
- When the doc says "REPLACE" → replace the ENTIRE function/block
- When the doc says "Add" → add without removing existing code
- Preserve ALL existing exports unless explicitly told to change them
- After modifying each file, verify it compiles: run `deno check` on the file

CRITICAL AREAS THAT NEED EXTRA CARE (slow down here):

Changes 2.1-2.3 (Solunar, Light, Pressure scoring):
These three changes are the core consistency fix — they eliminate the cliff effects that caused 5-point score swings in 15 minutes. The key concept is INTERPOLATION in transition zones:
- Solunar: new score values for within_60min_of_major (40) and within_90min_of_major (20)
- Light: use lerp() to blend between scores when cloud cover is in 30-40% or 65-75% range
- Pressure: use blend zones at state boundaries (-0.6 to -0.4 and +0.4 to +0.6 mb/hr)

You MUST add the `lerp` and `inverseLerp` helper functions if they don't already exist in scoreEngine.ts:
```
function lerp(a: number, b: number, t: number): number { return a + (b - a) * t; }
function inverseLerp(value: number, min: number, max: number): number { return Math.max(0, Math.min(1, (value - min) / (max - min))); }
```

Change 2.2 IMPORTANT: The scoreLight function signature changes — it now takes cloudCoverPct. You MUST update the call site in computeRawScore where scoreLight is called. If you forget, scores will be wrong.

Changes 2.4-2.6 (mild_winter_active + saltwater seasonal modifiers):
These add scoring adjustments for seasonal states. They modify the water temp zone scoring and temp trend scoring functions. Be precise about which function each change modifies — don't accidentally put saltwater logic in the freshwater scoring function or vice versa.

Change 2.5 (rapid_cooling zone modifier):
Simple but critical: change 0.0 to 0.05. This prevents a hard-zero score for temperature trend when a fish is in near_shutdown_cold AND experiencing rapid cooling. Find the exact line — it's in a lookup table or conditional.

Changes 2.7-2.9 (4-tier time windows):
This is the biggest structural change in Sweep 2. The time window system goes from 3 tiers (PRIME/GOOD/SECONDARY + hidden worst) to 4 explicit tiers (PRIME/GOOD/FAIR/SLOW) covering ALL 24 hours.
- 2.7: New classification thresholds
- 2.8: mild_winter_active thermal profile (unique: viable all day)
- 2.9: New merging logic that handles all 4 tiers + returns fair_windows
Pay close attention to:
- The classifyBlock function must return one of the 4 labels for EVERY block (no null)
- The merging must handle all 4 labels (not just PRIME/GOOD)
- The return type changes to include fair_windows
- The return type signature of computeTimeWindows must be updated

Changes 2.14-2.16 (index.ts wiring):
These wire everything together. Common mistakes:
- 2.14 (front label): The "cold cold front" bug fix — make sure "moderate" severity produces "A" not "A cold"
- 2.15 (recovery_active): Add `&& frontSeverity !== null` to the condition. Simple but easy to miss.
- 2.16 (new fields): Multiple sub-parts (A, B, C). Don't skip sub-part C (component_detail debug output)

IF YOU GET STUCK on any change:
- Re-read the change description and the code block provided
- Check if a helper function (lerp, inverseLerp) needs to be added first
- Check if a function signature changed — the call site needs updating too
- If TypeScript errors mention missing properties on return types, check if you need to add fields to the return object

AFTER ALL 16 CHANGES ARE COMPLETE:
Run the Verification Checkpoint at the bottom of the sweep doc. Go through EVERY numbered item (1-12) and the three test cases.

Key verifications:
- Item 3 (light interpolation): Cloud cover at 35% should score ~26, NOT jump from 12 to 40
- Item 4 (pressure smoothing): Rate of -0.50 should score ~70, rate of -0.49 should score ~68 (smooth, not cliff)
- Item 8 (4-tier windows): EVERY 30-min block must have a label. No nulls anywhere.
- Item 10 (front label): Test with severity="moderate" — output must be "A cold front" not "A cold cold front"

Fix any issues found. Do NOT move on to Sweep 3 until every verification item passes.

Finally, give me a summary of:
- Every file modified and what changed
- Any issues you encountered and how you resolved them
- Verification checkpoint results (pass/fail for each item)
- Confirmation that computeTimeWindows returns { best_windows, fair_windows, worst_windows }
```

---

## SWEEP 3 PROMPT

```
You are implementing Sweep 3 of a 3-sweep engine refinement for TightLines AI. This is the integration sweep — it connects the engine to the outside world. Changes include: the environment adapter, dual lake/river engine runs, LLM system prompt updates, a deterministic LLM fallback, updated client types, and UI changes for lake/river tabs, severe weather alerts, and 4-tier time windows.

PREREQUISITE CHECK — DO THIS FIRST:
Before starting, verify Sweeps 1 and 2 were completed:
1. types.ts has all new types (LatitudeBand, SaltwaterSeasonalState, FAIR/SLOW WindowLabel, etc.)
2. derivedVariables.ts returns saltwater_seasonal_state, latitude_band, effective_latitude, severe_weather_alert, severe_weather_reasons
3. computeTimeWindows returns { best_windows, fair_windows, worst_windows }
4. EngineOutput includes fair_windows, severe_weather_alert, severe_weather_reasons, component_detail
5. index.ts buildFrontLabel produces "A cold front" for moderate severity (not "A cold cold front")
6. All coreIntelligence files compile with deno check

If ANY of these are missing, STOP and tell me — a previous sweep is incomplete.

YOUR IMPLEMENTATION GUIDE:
Read the full sweep document at: docs/ENGINE_REFINEMENT_SWEEP_3.md

BEFORE YOU WRITE A SINGLE LINE OF CODE:
1. Read docs/ENGINE_REFINEMENT_SWEEP_3.md in FULL — every change, every code block
2. Read EVERY target file listed under "Files Modified" in FULL:
   - supabase/functions/_shared/envAdapter.ts
   - supabase/functions/get-environment/index.ts
   - supabase/functions/how-fishing/index.ts
   - lib/howFishing.ts
   - app/how-fishing-results.tsx
3. Understand how data flows: get-environment → envAdapter → engine → how-fishing → client

EXECUTION RULES — READ CAREFULLY:
- Execute changes IN ORDER: 3.1, 3.2, 3.3, ... 3.16
- Do NOT skip any change — every single one is required
- Do NOT rush. This sweep touches the most files and has the most integration points.
- Preserve ALL existing exports and function signatures unless explicitly told to change them
- After modifying each Edge Function file, verify with `deno check`
- After modifying client files (lib/howFishing.ts, app/how-fishing-results.tsx), verify TypeScript is happy

CRITICAL AREAS THAT NEED EXTRA CARE (slow down here):

Changes 3.1-3.2 (Adapter + get-environment):
Simple but precise. The envAdapter needs altitude_ft and gust_speed_mph mapped through. Verify:
- envAdapter's EnvironmentData interface has altitude_ft and gust_speed in the weather block
- The toEngineSnapshot return object maps gust_speed_mph from env.weather?.gust_speed (replacing the hardcoded null)
- The toEngineSnapshot return object includes altitude_ft: env.altitude_ft ?? null

Change 3.3 (Dual engine runs — MOST COMPLEX CHANGE):
This is the biggest change in Sweep 3. Read it completely before starting. Key points:
- Inland locations now run TWO parallel engine calls — one with lake snapshot, one with river_stream snapshot
- You need a NEW helper function `runReportForWaterTypeWithSnapshot` that accepts a custom snapshot
- The existing `runReportForWaterType` gets updated to use the LLM fallback on failure
- The reports object uses NEW keys: "freshwater_lake" and "freshwater_river"
- Mode changes to "inland_dual"
- default_tab changes to "freshwater_lake" for inland

WATCH OUT: The `runReportForWaterTypeWithSnapshot` function references `anthropicKey`, `analysisDateLocal`, `currentTimeLocal`, `totalInputTokens`, and `totalOutputTokens` — these are all variables in the outer scope of the handler. Make sure the function is placed inside the handler function (alongside the existing `runReportForWaterType`), NOT at the module level.

Change 3.4 (Coastal detection hardening):
Simple but important. The `isLikelyCoastal` function is a heuristic backup — it doesn't need to be perfect, just catch obvious coastal locations when NOAA is down. Place it at the module level (outside the handler).

Change 3.5 (LLM system prompt):
REPLACE the entire HOW_FISHING_SYSTEM_PROMPT constant. The new version adds:
- mild_winter_active guidance
- saltwater_seasonal_state guidance
- severe_weather_alert handling (safety warning first)
- decent_times_today in the JSON schema
- Forbidden word additions ("solunar" → "feeding window", "barometric" → "pressure", "thermal stress" → "too hot")
Copy the complete prompt from the sweep doc. Do not truncate or abbreviate.

Change 3.6 (Deterministic LLM fallback):
This is a NEW function that generates LLM-shaped output from engine data alone. Place it BEFORE the callClaudeForReport function. It must produce valid LLMOutput that matches the interface. Key things to verify:
- headline_summary uses the engine's overall_rating
- best_times_to_fish_today comes from engine time_windows
- tips come from engine behavior state
- All text is under the word limits (12 words for tips, 20 for headline, etc.)

Also update the existing `runReportForWaterType` (Change 3.3C) to use this fallback instead of returning error status.

Changes 3.10 (Client types — howFishing.ts):
This has MANY sub-parts (A through H). Go through each one carefully:
- A: TimeWindow label union updated
- B: WorstWindow gets optional label
- C: EngineOutput gets fair_windows
- D: EngineAlerts gets severe_weather fields
- E: EngineEnvironment gets new fields
- F: LLMOutput gets decent_times_today
- G: HowFishingBundle mode and report keys updated
- H: LLMBestTime label union updated

Miss any of these and the UI will have type errors. Go through A-H one by one.

Changes 3.11-3.14 (UI changes — how-fishing-results.tsx):
These modify the React Native UI. Key things:
- 3.11: Tab types change from WaterType to string (because "freshwater_lake" isn't a WaterType)
- 3.12: Severe weather banner goes FIRST, above all other alerts
- 3.13: New DecentTimesSection component with FAIR badge styling
- 3.14: FAIR windows fallback — if LLM didn't provide decent_times, use engine fair_windows

For 3.11, make sure ALL the related types/props update together — TabBar props, activeTab state, availableTabs array, activeReport access, and the conditional rendering. If you update some but not all, TypeScript will error.

IF YOU GET STUCK on any change:
- Re-read the change description carefully
- Check the data flow: does the field exist upstream? Is it being passed through the adapter?
- For type errors: check if you missed a sub-part in Change 3.10
- For runtime shape issues: verify the response bundle construction (Change 3.3E/3.15) includes fair_windows

AFTER ALL 16 CHANGES ARE COMPLETE:
Run the Verification Checkpoint at the bottom of the sweep doc. Go through EVERY numbered item (1-13) and the three test cases.

Key verifications:
- Item 4 (inland dual): An inland request must return mode "inland_dual" with freshwater_lake and freshwater_river reports
- Item 6 (LLM fallback): Simulate failure — the report must still have status "ok" with populated fields
- Item 9 (4-tier display): UI must show Best Times, Decent Times, and Worst Times sections
- Item 10 (Lake/River tabs): Inland locations must show tab bar with "Lake" and "River"

Fix any issues found.

Finally, give me a summary of:
- Every file modified and what changed
- Any issues you encountered and how you resolved them
- Verification checkpoint results (pass/fail for each item)
- Confirmation that the full data flow works: get-environment → envAdapter → engine → how-fishing → client types → UI
```

---

## AFTER ALL 3 SWEEPS: What to Report Back

After completing all three sweeps, run these real scans and send the FULL engine output (JSON) back for audit:

1. **Prudenville, MI** (inland, winter, lat ~44.3) — both lake and river tabs
2. **Tampa, FL** (coastal, mild winter, lat ~27.9) — all three tabs
3. **Gulf Shores, AL** (coastal, lat ~30.2) — all three tabs
4. **Denver, CO** (inland, high altitude ~5280ft, lat ~39.7) — both lake and river tabs

For each scan, provide:
- The full JSON response bundle (or at least: mode, scores, seasonal states, water temps, time windows, alerts)
- Screenshots of the UI if possible
- Run TWO scans 10-15 minutes apart from the SAME location to verify score consistency
