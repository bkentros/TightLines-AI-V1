# TightLines AI Lure & Fly Recommender Engine Blueprint

This is the full blueprint for how the TightLines AI lure and fly recommender engine should work.

The recommender must be a **lean, deterministic, biology-aware recommendation engine** that produces **3 lure recommendations and 3 fly recommendations every time**. It must be accurate, selective, explainable, and practical. It must not be over-engineered. It must not rely on vague AI logic. It must not use giant scoring matrices or bloated lure profiles. The engine should use **month-specific biological context to define what is realistic**, then use **daily conditions to determine what is most suitable today within that realistic range**.

The engine exists to answer one question:

**Given this species, region, month, water type, clarity, and today’s conditions, what 3 lure archetypes and what 3 fly archetypes should the user throw today, why, what color style should they use, and how should they fish them?**

---

## 1. Core engine philosophy

The engine must follow this hierarchy:

**1. Species + region + month + water type define biological context**  
**2. That context defines which archetypes are allowed**  
**3. That context also defines the allowed tactical baseline ranges**  
**4. Daily conditions determine what is most suitable within those allowed ranges**  
**5. Same-day gates remove invalid options like surface on bad surface days**  
**6. Final selection produces 3 lure recommendations and 3 fly recommendations using an opportunity mix, not just raw top-score duplication**  
**7. Every recommendation must explain why it was chosen and how to fish it**

This means the engine should never recommend outside of biological and seasonal realism just because daily conditions look favorable.

A good day in winter should still be interpreted as **a good winter day**, not as a summer-style day.

---

## 2. Supported species and water types

The engine supports exactly these 4 species:

- largemouth
- smallmouth
- pike
- trout

Water types are:

- lake/pond
- river

Important hard rule:

- **trout is river-only**
- trout should never be treated as lake/pond in this engine

Important fly rule:

- **flies are streamer-only**
- no nymphs
- no dry flies as a general category
- no wet fly / soft hackle systems
- the fly side of the engine is strictly a **streamer recommender**, though a few streamer-adjacent or topwater-related fly archetypes may exist if already in the archetype pool

This simplifies the engine and must remain true throughout implementation.

---

## 3. Inputs

The engine must accept, at minimum, these inputs:

- `species`
  - largemouth
  - smallmouth
  - pike
  - trout

- `region`
  - use the app’s existing region system

- `month`
  - integer 1–12
  - month must be handled individually, not by broad season labels only

- `waterType`
  - lake_pond
  - river

- `clarity`
  - clear
  - stained
  - muddy

- normalized daily condition outputs from the How’s Fishing Right Now engine:
  - temperature / thermal feel
  - wind
  - barometric pressure
  - light
  - precipitation / runoff
  - for river contexts, normalized flow/current state if the upstream system can provide it

These daily inputs should already be normalized to app-friendly states. The recommender should not be forced to derive all meaning from raw weather values if the upstream engine already normalizes them.

Important rule:

- the recommender should consume **normalized daily states**, not guess from raw weather values
- daily conditions are the actual day-level determining layer
- daily conditions decide which **eligible** lures and flies rise to the top that day
- daily conditions may not create or revive invalid archetypes outside the monthly biological context

---

## 4. What the engine must optimize for

The engine is not trying to find one magical “perfect” lure.

It is trying to produce **3 strong, realistic, distinct, explainable lure recommendations and 3 strong, realistic, distinct, explainable fly recommendations**.

The engine must optimize for:

- biological realism
- month-specific realism
- daily suitability
- practical fishability
- non-duplicative output
- clear explanation

The engine must produce an **opportunity mix**, not just 3 safe duplicates.

That means each final set of 3 should generally include:

- the best overall recommendation
- another strong recommendation
- a justified alternate or more aggressive/change-up opportunity if the day supports it

This must happen while still respecting the biological and tactical constraints of the context.

---

## 5. Month-specific biological context is the foundation

The entire engine depends on a strong **monthly biological context layer**.

For every combination of:

- species
- region
- month
- water type

the engine must define two things:

### A. Allowed archetype pool
This is the set of lure and fly archetypes that are biologically and seasonally realistic in that exact context.

### B. Baseline tactical profile
This is the context-driven tactical baseline for how that fish generally behaves in that exact context.

This monthly context must be driven by the most important biological and fishery principles available, including:

- species behavior
- forage tendencies
- regional seasonal reality
- water type behavior
- month-to-month shifts in fish positioning and aggression
- broad feeding behavior patterns

These baselines must **not** be random.  
They must be grounded in what the fish generally prefers in that exact context.

This is one of the most important parts of the engine and must be emphasized heavily.

---

## 6. Allowed / not allowed archetype system

There should be no “fringe” tier.

For each context, every archetype is either:

- **allowed**
- **not allowed**

That is it.

The allowed pool must be tight and intentional.

If an archetype is not biologically appropriate for that exact:

- species
- region
- month
- water type

then it must be excluded from the candidate pool before daily ranking begins.

This is how the engine prevents nonsense such as:

- frogs appearing in the wrong time/context
- summer-style surface flies showing up in wrong trout windows
- unrealistic prey/presentation styles appearing in biologically wrong months
- overly aggressive presentations showing up in contexts where they should not exist in the pool at all

Daily conditions are only allowed to rank **within** the allowed monthly pool.

Daily conditions can never resurrect an archetype that was not allowed by the monthly context.

---

## 7. Tactical dimensions the engine must use

The engine should use these tactical dimensions only.

### Water column
- bottom
- mid
- upper
- surface

Definitions must be explicit:

- **bottom** = near-bottom presentations
- **mid** = middle water column
- **upper** = shallow subsurface / near-surface but not true surface
- **surface** = true topwater / true surface-contact presentation

Upper and surface must not be treated as the same thing.

### Pace
- slow
- medium
- fast

### Presence
- subtle
- moderate
- bold

### Surface eligibility
- true / false

This must remain a separate same-day concept, even though surface also exists as a water-column category.

Reason:
- a context can allow upper-water options without allowing true surface today
- true surface needs stronger control and must have a same-day gate

---

## 8. Monthly baseline tactical profile

For every exact context of:

- species
- region
- month
- water type

the engine must define a **baseline tactical profile**.

This profile is not a lure score.  
It is the biology-driven tactical interpretation layer.

It must include:

- `allowedColumns`
- `columnPreferenceOrder`
- `allowedPaces`
- `pacePreferenceOrder`
- `allowedPresence`
- `presencePreferenceOrder`
- `surfaceSeasonallyPossible`
- `primaryForage`
- `secondaryForage` optional

Important rule:

- the first item in each preference order is the context's default starting preference
- the remaining items define the valid directional fallback order inside that biology-driven range
- daily conditions may shift preference along that order, but may never shift outside the allowed range

### Example concept
Northern region, January, trout, river:
- allowedColumns: bottom, mid
- columnPreferenceOrder: bottom, mid
- allowedPaces: slow, medium
- pacePreferenceOrder: slow, medium
- allowedPresence: subtle, moderate
- presencePreferenceOrder: subtle, moderate
- surfaceSeasonallyPossible: false
- primaryForage: baitfish

Another example:
Northern region, June, largemouth, lake/pond:
- allowedColumns: bottom, mid, upper, surface
- columnPreferenceOrder: upper, mid, bottom, surface
- allowedPaces: slow, medium, fast
- pacePreferenceOrder: medium, fast, slow
- allowedPresence: subtle, moderate, bold
- presencePreferenceOrder: moderate, bold, subtle
- surfaceSeasonallyPossible: true
- primaryForage: baitfish
- secondaryForage: bluegill_perch or crawfish depending on the context

This profile defines the valid tactical space for that context and where the fish generally lives inside that space.

This is critical:  
**daily conditions do not define the tactical world from scratch.**  
They only shift preference **within the biology-driven monthly baseline**.

---

## 9. How daily conditions must interact with the monthly baseline

The engine must not determine preferred pace, preferred water column, preferred presence, or surface viability from daily conditions alone.

Instead, the engine must do this:

**monthly baseline establishes the allowed tactical range and default preference**  
**daily conditions then shift the preferred tactical lane within that allowed range**

This is a core design rule.

### Example
If the monthly baseline is:
- allowedColumns: bottom, mid
- columnPreferenceOrder: bottom, mid

and today’s conditions are unusually favorable for that context, then:
- the day may shift preference toward mid
- but it may not go to upper or surface, because those are outside the allowed range

That means a “good winter day” becomes:
- more aggressive within winter reality
- not an unrealistic warm-season recommendation environment

This principle must be central to the implementation.

---

## 10. Daily condition influence

The daily condition layer should use only the most important variables:

- temperature / thermal feel
- wind
- pressure
- light
- precipitation / runoff
- clarity

If available from the upstream normalized engine, river contexts should also use:

- flow/current state

The purpose of the daily layer is to shift tactical preference within the monthly biological baseline.

Important rule:

- daily conditions do the actual determination of what rises today from the eligible pool
- monthly context defines what is allowed and what the default biological shape is
- daily conditions decide where inside that allowed world today actually lands

The daily layer should help determine:

- which allowed water-column lane is most favored today
- which allowed pace is most favored today
- which allowed presence level is most favored today
- whether true surface remains viable today
- which archetypes best fit the day’s tactical shape

### General behavior of each daily variable

#### Temperature / thermal feel
Helps shift:
- pace
- aggression
- whether the fish is behaving toward the active or inactive edge of the monthly range

It should not overrule seasonal biology.  
It should modify it.

#### Wind
Helps shift:
- practicality of surface
- value of moving/search options
- value of louder/more visible presentations
- day-shape of upper/mid options in some cases

High wind must be a major same-day surface suppressor.

#### Pressure
Helps shift:
- subtle vs aggressive
- controlled vs reactive
- slower vs more active tendencies

Pressure should be a modifier, not an absolute truth.

#### Light
Helps shift:
- surface practicality
- silhouette value
- subtlety vs stronger visibility
- whether upper/surface options gain or lose appeal

#### Precipitation / runoff
Especially important in rivers.  
It must materially matter in river contexts.

It can influence:
- visibility
- current/flow effects
- whether certain archetypes become more or less practical
- whether the tactical preference leans more anchored/subtle or more visible/aggressive

In lake/pond contexts it can matter, but less heavily.

#### Flow / current state
If provided upstream, this should be treated as a separate normalized river input, not hidden inside a vague runoff guess.

It can influence:
- drift practicality
- streamer swing / current-friendly value
- anchored vs moving presentations
- whether certain river archetypes become more or less practical that day

#### Clarity
Clarity must always affect color style.  
It may also lightly affect ranking through visibility and presence fit.

Clarity should not fully override the archetype pool.  
It mostly shapes:
- color lane
- relative presence fit
- visibility style

---

## 11. Same-day surface gate

There must absolutely be a same-day gate for surface.

This gate must remain separate from the monthly baseline.

The logic is:

### Monthly baseline decides:
- whether surface is seasonally and biologically possible in this context

### Same-day surface gate decides:
- whether surface is actually viable today

This distinction is mandatory.

A context may allow surface in the month, but today may still shut it off.

Surface should be shut off or strongly invalidated by factors such as:

- high wind
- strongly poor surface conditions
- certain cold/tough daily setups
- certain runoff-heavy river situations
- any other same-day factors that clearly make surface unrealistic

If surface fails the same-day gate:
- surface archetypes should be removed from recommendation eligibility for that day

This must apply to:
- true topwater lures
- true topwater-related flies
- any archetype whose identity depends on surface viability

This is not optional. It is a required engine rule.

---

## 12. Archetype profiles: what each archetype must include

The archetype profiles must stay lean.

Do not bloat them.

Each archetype must include the fields needed for deterministic matching and final output.

Each archetype should include:

- `id`
- `displayName`
- `speciesAllowed`
- `waterTypesAllowed`
- `familyGroup`
- `primaryColumn`
  - bottom / mid / upper / surface
- `secondaryColumn`
  - optional adjacent fit only when truly needed
- `pace`
  - slow / medium / fast
- `secondaryPace`
  - optional adjacent fit only when truly needed
- `presence`
  - subtle / moderate / bold
- `secondaryPresence`
  - optional adjacent fit only when truly needed
- `isSurface`
  - true / false
- `currentFriendly`
  - optional, mainly relevant in river contexts
- `forageTags`
  - small set only, such as baitfish / crawfish / leech_worm / surface_prey / mixed
- `whyHooks`
  - short explanation hooks that describe why the archetype tends to work
- `howToFishTemplate`
  - short base fishing instruction template

Important note:  
The archetype profile should not contain giant seasonal logic or giant weather logic.  
That belongs in the monthly context config and daily tactical engine.

The archetype profile should mostly represent the **tactical identity** of the archetype.

Important rule:

- an archetype should have one primary tactical identity
- optional secondary tactical fit fields are allowed only to represent a small adjacent range
- do not turn archetype profiles into mini scoring engines

---

## 13. Family groups are required

Every archetype must belong to a `familyGroup`.

This is essential for final recommendation diversity.

The purpose of `familyGroup` is to prevent near-duplicate recommendations in the final 3.

Example:
- weightless wacky rig stick worm
- weightless Texas-rigged stick worm

These may be separate archetypes and should stay separate, because they may score differently on a given day.

But they may belong to the same or closely related `familyGroup`, such as:
- `finesse_stickworm`

This allows the engine to preserve tactical specificity during scoring while preventing redundant final output.

Important:  
`familyGroup` should usually matter during **final selection**, not during the main ranking score.

It is an output diversity tool, not a primary scoring mechanism.

---

## 14. Candidate pool construction

The engine’s first real step is to build the candidate pool.

### Step 1: monthly pool filter
Using:
- species
- region
- month
- water type

load only archetypes that are allowed in that context.

### Step 2: hard validity checks
Apply hard rules such as:
- trout only river
- fly streamer-only design constraints
- species invalid archetypes removed
- water type invalid archetypes removed

### Step 3: same-day gates
Apply same-day practicality gates, especially:
- same-day surface gate
- any obvious tactical invalidations

After this, the engine has the day’s valid candidate pool.

Only then should scoring begin.

---

## 15. Tactical preference engine

Once the valid pool exists, the engine must determine today’s tactical preference.

This must be built from:

**monthly baseline + daily condition modifiers**

The engine should determine:

- today’s preferred column inside the allowed column range
- today’s preferred pace inside the allowed pace range
- today’s preferred presence inside the allowed presence range
- whether surface stays on or is shut off
- whether the day supports a more conservative or more aggressive opportunity mix inside the context

This should not be one rigid answer.  
It should produce a directional preference, such as:

- bottom favored, mid secondary
- slow favored, medium viable
- subtle favored, moderate viable

Or on a better day:
- mid favored, bottom still viable
- medium favored, slow secondary
- moderate favored, subtle secondary

This directional preference is what the engine uses to rank the allowed archetypes.

Important rule:

- this preference must be deterministic and inspectable
- it should be represented as an ordered day preference, not vague prose
- example:
  - column: mid favored, bottom secondary
  - pace: medium favored, slow secondary
  - presence: moderate favored, subtle secondary

---

## 16. Scoring philosophy

The engine should use a simple deterministic ranking system.

It should not use a huge direct matrix of every weather variable against every lure.

The scoring should be driven by:

- tactical fit to today’s preferred column
- tactical fit to today’s preferred pace
- tactical fit to today’s preferred presence
- same-day practical fit
- contextual fit from the monthly baseline world
- minor visibility/practical adjustments from clarity/light/runoff where appropriate
- small forage alignment where it helps separate otherwise similar valid archetypes

The score should answer:

**How well does this allowed archetype fit today’s tactical preference within this month’s biological reality?**

That is the core ranking question.

Tie-break rule:

- ties must be broken deterministically
- do not use randomness
- use a fixed order of tie-breakers, such as:
  - better exact tactical fit to today’s preferred lane
  - better same-day practical fit
  - better monthly context / forage alignment
  - stable lexical `id` fallback as the final deterministic fallback only

### Important scoring rule
There should be no major “seasonal score” layered on top.

Seasonality is already handled by:
- the allowed monthly pool
- the monthly tactical baseline

Do not double-count seasonality by adding a heavy seasonal scoring layer.

---

## 17. Tactical range behavior: hard constraints, not soft wishes

The tactical ranges in the monthly baseline should be treated as real constraints.

That means:

- if an archetype falls outside the monthly allowed archetype pool, remove it
- if its tactical identity falls outside the allowed tactical range for that context, remove it
- if it is inside the allowed tactical range but less favored today, keep it and rank it lower

This is important because otherwise weird recommendations can still leak through by score.

The engine should not “penalize but still allow” something that is outside the biology-driven tactical range.  
It should remove it.

---

## 18. Opportunity mix logic

The final output should represent an **opportunity mix**, not simply the top 3 raw scores with no thought.

This is a required behavior.

The final 3 should generally represent:

- the best overall recommendation
- another strong recommendation
- a justified alternate or more aggressive/change-up opportunity if supported by the day

This matters especially in improved-condition days inside conservative monthly contexts.

For example:
- a winter northern river context may default lower and slower
- but on a better day, if mid is the top end of the allowed range, the engine should likely include at least one recommendation that reflects that upper end of the valid tactical opportunity

That is how the engine remains dynamic without becoming biologically unrealistic.

This must be emphasized heavily.

---

## 19. Final recommendation selection

The engine must always return **3 lure recommendations and 3 fly recommendations**.

Final selection should work like this:

### First recommendation
Take the highest-quality overall fit.

### Second recommendation
Take the strongest remaining fit that is not from the same `familyGroup` if a meaningfully strong alternative exists.

### Third recommendation
Take the strongest justified alternate or change-up opportunity, again preferring distinct family group output when possible.

Because the engine must always return 3 recommendations per side, the third recommendation may sometimes be more of a justified alternate than a pure top-score lock. That is acceptable and intended.

Deterministic selection rule:

- recommendation 1 = best overall remaining fit
- recommendation 2 = best remaining fit that meaningfully improves family-group diversity, unless the score drop is too large
- recommendation 3 = best remaining fit that meaningfully expands the opportunity mix through a different family group, different tactical look, or a justified higher-upside change-up, unless no meaningful alternate exists
- if no strong alternate exists, fall back deterministically to the next-best remaining valid fit

This keeps the output dynamic without guessing.

This is why the engine should be built around opportunity mix, not raw ranking only.

---

## 20. Near-duplicate prevention

The engine should not recommend two near-identical options when better distinct alternatives exist.

Near-duplicate prevention must happen at the **final selection layer** using `familyGroup`.

Rule:
- for recommendations 2 and 3, prefer candidates from different `familyGroup`s
- only allow the same `familyGroup` more than once if no other meaningful alternative is available

This prevents outputs like:
- two very similar worm presentations
- two near-identical finesse options
- two nearly interchangeable streamers

This preserves variety while still allowing specific archetypes to compete properly during scoring.

---

## 21. Color logic

Color must be determined after the archetype is selected, not before.

Color logic must use both:
- clarity
- light

But they have different roles.

### Clarity is the primary color driver
It sets the overall lane:
- clear = natural / subtle / realistic / translucent
- stained = moderate contrast / more readable
- muddy = bold / high-visibility / stronger silhouette

### Light is the secondary modifier
It fine-tunes inside the clarity lane:
- bright can reduce excess loudness/flash in clear water
- lower light or cloud cover can justify more contrast or stronger silhouette inside the clarity lane

This means:
- clarity chooses the lane
- light adjusts inside the lane

Color selection should not radically change the archetype pool.  
It should mainly shape the style or finish of the chosen archetype.

---

## 22. Explanation generation is mandatory

Each recommendation must include a clear `whyChosen`.

This is mandatory.

The explanation must come from actual deterministic reasons, not vague AI narration.

For each candidate, the engine must preserve:
- the strongest positive tactical drivers
- the daily reasons it fit
- the contextual reason it belongs in today’s opportunity mix

Then `whyChosen` should be built from the most important reasons.

Examples of explanation source logic:
- daily conditions shifted preference toward mid within the allowed winter range
- higher pressure favored a subtler option
- wind removed surface but improved a stronger moving option
- this month/context biologically favors this style and today reinforced it
- stained water supported a stronger presence profile

The explanation should be:
- short
- specific
- grounded
- non-generic

Each recommendation should have its own reason path, not three copies of the same sentence.

---

## 23. How-to-fish generation

Each recommendation must also include a short `howToFish`.

This should come from:
- the archetype’s `howToFishTemplate`
- lightly adapted by the day’s tactical direction when helpful

Example:  
A jerkbait may always use a jerkbait template, but:
- on a tougher day it may emphasize longer pauses
- on a more active day it may emphasize a more active cadence

This should stay short and practical.

It should help the user fish the recommendation immediately.

---

## 24. Region’s role

Region matters, but should be used cleanly.

Region should influence:
- which archetypes are allowed by month
- the monthly tactical baseline ranges
- forage and biological context

Region should not create a giant custom daily weather engine for every variable unless clearly necessary.

The daily modifier system can remain broadly shared, while region is mostly expressed through:
- monthly allowed pool
- monthly baseline tactical profile

This keeps complexity under control.

---

## 25. Species-specific logic

Species must materially shape the engine through:
- monthly allowed archetype pool
- monthly tactical baseline
- biological and forage assumptions

However, the daily scoring system does not need to become a completely separate engine for each species.

The clean approach is:

- species strongly shapes the context layer
- daily tactical ranking can remain a shared deterministic framework operating inside that context

This keeps the engine maintainable while still making species matter heavily.

---

## 26. River-specific considerations

River logic must differ meaningfully from lake/pond logic.

This especially matters for:

- trout
- smallmouth river contexts
- runoff-sensitive situations
- current-friendly archetypes

River contexts should more strongly consider:
- precipitation/runoff
- current suitability
- drift/flow practicality
- visibility changes caused by river conditions

Lake/pond contexts can still use precipitation and clarity, but river contexts should give runoff materially more importance.

This must be reflected in:
- monthly baselines
- daily adjustments
- archetype suitability

---

## 27. What the engine must not do

The engine must not do any of the following:

- no giant lure-by-weather flat matrix
- no giant seasonal score layered on top of monthly context
- no confidence score
- no random diversity
- no forcing unrealistic recommendations outside biology-driven ranges
- no bloated archetype profiles with unnecessary traits
- no recommendation logic driven by LLM guessing
- no broad generic “season” buckets replacing month-specific context

The design must remain:
- deterministic
- selective
- biology-aware
- debuggable
- maintainable

---

## 28. Debuggability requirements

Even if the user never sees full debug data, the engine should internally preserve enough detail to inspect why a recommendation won.

For each selected recommendation, the engine should be able to inspect:
- allowed monthly context
- baseline tactical profile
- today’s shifted tactical preference
- same-day surface gate result if relevant
- why this archetype matched the tactical preference
- familyGroup used during final selection
- whyChosen source drivers

This is important for future calibration and trust.

---

## 29. Required engine flow

This is the exact engine flow the agent should implement.

### Step 1: Validate input context
Validate:
- species
- region
- month
- water type
- clarity
- daily condition states

Apply hard rules like trout = river-only.

### Step 2: Load monthly biological context
For the exact:
- species
- region
- month
- water type

load:
- allowed archetype pool
- baseline tactical profile:
  - allowedColumns
  - columnPreferenceOrder
  - allowedPaces
  - pacePreferenceOrder
  - allowedPresence
  - presencePreferenceOrder
  - surfaceSeasonallyPossible
  - primaryForage
  - secondaryForage optional

### Step 3: Build monthly candidate pool
From the total archetype library:
- include only archetypes allowed in that context
- exclude all not-allowed archetypes

### Step 4: Apply tactical-range validity
Remove archetypes whose tactical identity falls outside the baseline tactical ranges.

### Step 5: Apply same-day gates
Especially:
- same-day surface gate
- any other hard same-day invalidations

### Step 6: Compute today’s tactical preference
Start from:
- the first item in `columnPreferenceOrder`
- the first item in `pacePreferenceOrder`
- the first item in `presencePreferenceOrder`

Then shift those preferences using:
- temperature / thermal feel
- wind
- pressure
- light
- precipitation / runoff
- clarity where tactically relevant

But never shift outside the allowed baseline ranges.

### Step 7: Score each valid archetype
Score based on:
- fit to today’s preferred column
- fit to today’s preferred pace
- fit to today’s preferred presence
- same-day practicality
- contextual fit inside today’s opportunity mix

### Step 8: Determine color style
Using:
- clarity as primary lane
- light as secondary modifier

Generate recommended color/pattern style for each high-ranking archetype.

### Step 9: Rank candidates
Sort candidates by deterministic suitability.

### Step 10: Select final 3 using opportunity mix
- first = best overall fit
- second = another strong fit, preferring distinct family group
- third = strongest justified alternate/change-up, preferring distinct family group

Always return 3 lure recommendations and 3 fly recommendations.

### Step 11: Generate whyChosen
Use actual deterministic drivers from the candidate’s ranking path.

### Step 12: Generate howToFish
Use archetype template, lightly adapted to the day’s tactical preference.

### Step 13: Return final payload
Return exactly 3 lure recommendations and exactly 3 fly recommendations with:
- archetype
- color style
- why chosen
- how to fish
- deterministic ranking metadata internally preserved

---

## 30. Final definition of what archetypes should include

Each archetype profile should include at least:

- `id`
- `displayName`
- `speciesAllowed`
- `waterTypesAllowed`
- `familyGroup`
- `primaryColumn`
- `secondaryColumn` optional
- `pace`
- `secondaryPace` optional
- `presence`
- `secondaryPresence` optional
- `isSurface`
- `currentFriendly` when relevant
- `forageTags`
- `whyHooks`
- `howToFishTemplate`

That is the full required profile set.

Do not add large extra fields unless truly necessary.

The biological and monthly complexity should live mostly in:
- the monthly allowed archetype config
- the monthly tactical baseline config
- the daily tactical preference logic

Not inside giant archetype profiles.

---

## 31. Final implementation standard

The final engine must behave like this:

**Month-specific biological context determines what is realistic.  
That same context defines the allowed tactical range and ordered default tactical preference.  
Daily conditions, using normalized states, do the actual day-level determination of which eligible archetypes rise within that allowed range.  
Same-day surface gating removes unrealistic surface opportunities.  
The engine ranks only valid archetypes.  
Final selection produces 3 distinct lure recommendations and 3 distinct fly recommendations using a deterministic opportunity mix.  
Each recommendation includes a color style, a reason it was chosen, and how to fish it.**

That is the architecture that should replace the current lure/fly recommender engine.
