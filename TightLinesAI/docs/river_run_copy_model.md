# FinFindr River Run Public Read Model

**Status:** Normative source of truth

**Version:** 2.2

**Established:** 2026-08-30

This standard defines the smallest dependable River Run experience. It replaces
the former four-card, state-by-state copy matrix. The biological calendars,
Activity model, presence model, gauge calibration, source provenance, safety
rules, and fail-closed behavior remain unchanged.

## 1. Product contract

The report has three public reads:

1. Migration Stage
2. Activity Outlook
3. Seasonal Presence

Gauge Read remains essential and appears before the reads. When calibrated
hydraulic evidence exists, Gauge Read also contains a compact **Fishing Shape**
result. Fishing Shape is not a separate tab.

Spot Finder appears between Gauge Read and the reads when an audited inventory
matches the selected river, state, species, and accessible migration corridor.

The report must not expose these legacy copy surfaces:

- `WHERE TO START`
- `WHY THIS READ`
- `GUIDE'S READ`
- a standalone Fishability card or tab

The API may retain legacy fields during compatibility migration. They are not
public authoring requirements and must not be used to justify new river-specific
copy.

## 2. One job per surface

| Surface | Answers | Must not claim |
| --- | --- | --- |
| Gauge Read | What do accepted instruments report, how old is the observation, and what reach does it represent? | Whole-river conditions, fish location, abundance, safety, or legal access |
| Fishing Shape | How workable is presentation in the represented hydraulic reach if fish are present? | Abundance, responsiveness, access, wading/boating safety, or the entire river |
| Spot Finder | Which broad river sections are reasonable starting areas for this migration phase, and which source-listed public access names fall inside them? | Where fish are today, the best individual spot, legal parking, open roads, safe entry, or permission across neighboring land |
| Migration Stage | What fixed seasonal phase is this run in? | Live movement, abundance, responsiveness, catch probability, or an individual access recommendation |
| Seasonal Zone | Which broad accessible river section or corridor is seasonally relevant in this phase? | A live fish-location report or a preferred access point |
| Activity Outlook | How responsive may fish be in each supported time block if fish are present? | Abundance, migration progress, feeding proof, exact location, or catch probability |
| Seasonal Presence | What historical presence level is reasonable for this river/species/date? | A live fish count, today's movement, bite quality, exact location, or current conditions |

Independent results may disagree. Strong seasonal presence may coexist with low
Activity. Good Fishing Shape may coexist with low presence. Never rewrite one
surface merely to make the report appear internally consistent.

## 3. Migration Stage

Stage public output contains only:

- the canonical phase label;
- one global phase sentence;
- one structured Seasonal Zone;
- the permanent scope note.

The global phase sentences are product-owned and shared by every river:

| Phase | Public sentence |
| --- | --- |
| Before the run | The dependable seasonal river migration has not started yet. |
| Beginning | The seasonal river migration is beginning. |
| Building | The migration is building toward its seasonal peak. |
| Peak | This is the core seasonal migration period. |
| Tapering | The migration is tapering after its seasonal peak. |
| Ending | The tracked migration is nearing its seasonal endpoint. |
| Complete | This seasonal migration model is complete. |

Do not write river/species prose for these sentences.

### 3.1 Seasonal Zone

Seasonal Zone is structured geography, not free copy. It is resolved from:

1. the river foundation's ordered accessible reaches;
2. presentation-state reach limits;
3. the species-specific endpoint, when narrower;
4. the fixed run calendar and phase.

Its response contains a status, a short derived label, canonical foundation
reach IDs, `basis: seasonal_calendar`, and `orientationOnly: true`.

Rules:

- Exclude harbor or mouth context from an in-river zone.
- Never cross a configured species barrier or presentation-state boundary.
- Beginning uses the first accessible migratory reach.
- Building expands through the accepted corridor.
- Peak may name the core accessible corridor.
- Tapering and ending use established accessible sections without claiming fish
  remain in all of them.
- Before dependable entry and after completion may return a status statement
  instead of an active in-river zone.
- Use canonical foundation display names. Do not author duplicate prose.

Seasonal Zone always displays: `Calendar-based orientation · not a live
location report.`

## 4. Spot Finder

Spot Finder translates the fixed Migration Stage into broad, ordered sections
and then exposes source-listed public access inside them. It recommends sections
as starting areas for research, never an individual access or live fish location.

Every section requires:

- a stable ID;
- one or more canonical foundation reach IDs;
- one required relative position: `lower`, `middle`, or `upper`;
- one required concrete downstream-to-upstream boundary/range label;
- optional species eligibility only when the endpoint differs by species;
- at least one source-listed access entry.

Every access entry requires:

- stable ID and public name;
- access type;
- official or accepted land-manager source URL;
- a plain explanation of where the source identifies it;
- source verification date;
- material caution when needed.

Behavior:

- Public section names are always derived as `Lower Run Section`, `Middle Run
  Section`, or `Upper Run Section`. "Run" makes clear that position is relative
  to the supported migration corridor, not the entire river. Landmarks define
  the boundary subtitle; they never replace the shared position vocabulary.
- Do not invent a middle section for a two-section corridor. Use Lower Run and
  Upper Run.
- Apply state and species endpoint filters before resolving recommendations.
- For three or more eligible sections: Beginning recommends the first section;
  Building the first two; Peak every section; Tapering and Ending the last two.
- For two eligible sections: Beginning recommends Lower Run; Building and Peak
  both; Tapering and Ending Upper Run.
- For one eligible section, every active migration phase recommends that section.
- Pre-run, post-run, and missing stages produce no recommendation and retain the
  ordinary access directory.
- Put recommended sections first and include every eligible source-listed access
  in them without ranking. Keep all other eligible sections available below.
- Display `Broad starting areas—not a live fish-location report.` with every
  recommendation.
- The About disclosure must state that sections describe the supported
  migration corridor, not the entire river.
- Do not create stage-specific access copy, featured-access fields, or
  species-by-access recommendations.
- Do not expose internal coordinates as navigation pins unless a separately
  audited entrance-coordinate feature is approved.
- Do not truncate names, source locators, or cautions.
- Use progressive disclosure: compact access rows first; descriptions,
  cautions, source locator guidance, source identity, and verification date
  appear after the access is opened.
- Fail closed when the inventory does not match the selected river, state,
  species endpoint, or migration corridor.

The permanent warning must distinguish a listed access name from legal parking,
safe wading, road status, and permission to cross neighboring land.

## 5. Activity Outlook

Activity keeps the existing scored four-block model. Public output contains:

- Today/Tomorrow and local date;
- data confidence or weather-only limitation;
- four time blocks with state, score, and activity label;
- one compact Best Window evidence summary;
- the permanent scope note.

The Best Window summary is derived from the highest-scoring block and shows:

- tied best windows when applicable;
- the block's strongest favorable driver;
- the block's main limiting factor.

Do not author a separate headline, explanation paragraph, or guide paragraph for
each Activity band. Those legacy strings may remain internal while downstream
contracts migrate.

Activity always displays: `Expected responsiveness if fish are present · not
abundance or catch probability.`

When required data is unavailable or seasonal monitoring has not begun, use one
shared deterministic status sentence. Never fill failed evidence with neutral
values.

## 6. Seasonal Presence

Seasonal Presence keeps the existing calendar curve, river/species ceiling,
quantization, and terminal biology. Public output contains:

- the score or unavailable state;
- the canonical presence label and meter;
- the permanent scope note.

Do not author or display an additional headline, explanation, or guide. The
curve and label already answer the question.

Seasonal Presence always displays: `Seasonal presence estimate · not a live
fish count or today's river conditions.`

Calendar truth remains species-specific. Weather, gauges, Activity, and Fishing
Shape never change Seasonal Presence.

## 7. Gauge Read and Fishing Shape

Gauge Read remains the evidence surface for accepted flow, level, and measured
water temperature. Each metric retains observation age, trend, station,
represented reach, attribution, and date-relative historical context when
available.

Fishing Shape is displayed only when the existing calibrated hydraulic result
has a numeric score. The compact public result contains:

- `FISHING SHAPE`;
- the canonical label;
- a five-stop meter ordered `Poor`, `Tough`, `Fishable`, `Good`, `Excellent`;
- a selected meter stop resolved from the exact displayed label.

The meter runs red to green and sits beside the label. Do not add an explanatory
sentence beneath it. Gauge Read's represented-reach detail and the permanent
safety disclosure carry the necessary scope without repeating copy here.

Do not display a separate unavailable Fishing Shape card. Gauge Read already
explains missing or unrepresentative instruments.

The internal Fishability scorer, bands, trend modifiers, freshness rules, and
fail-closed capabilities remain authoritative until a separately tested schema
rename is approved. Public simplification must not alter calibration.

## 8. Copy budget

New river onboarding should normally require no state-by-state primitive prose.
The public copy budget is:

| Item | Ownership | Normal per-river/species authoring |
| --- | --- | --- |
| Phase sentences | Global product copy | None |
| Seasonal Zone labels | Derived from foundation reaches | None |
| Activity labels/drivers/limits | Shared scorer | Calibration inputs only |
| Seasonal Presence labels | Shared scorer | Curve and ceiling only |
| Fishing Shape labels | Shared scorer | Hydraulic bands only |
| Gauge Read | Structured source metadata | Station/reach/provenance facts |
| Spot Finder | River-level source inventory | One inventory, plus rare species endpoint filters |
| Permanent scope notes | Global product copy | None |

River-specific prose is allowed only for a durable material limitation that
cannot be represented structurally, such as a split sensor reach, regulatory
boundary, or facility-specific closure. Store it once at the narrowest correct
river/source scope; do not repeat it across species and states.

## 9. Acceptance gates

A river is copy-complete when all of the following pass:

- all configured species/dates resolve a canonical Stage label;
- every active stage resolves a non-empty, valid Seasonal Zone;
- Seasonal Zone reach IDs exist in the foundation and respect presentation and
  species endpoints;
- Activity exposes all supported blocks and a derived best-window explanation;
- Seasonal Presence follows its accepted curve and terminal semantics;
- Gauge Read preserves source reach, freshness, trend, and unavailable behavior;
- Fishing Shape appears only with calibrated numeric evidence and never as a
  standalone tab;
- Spot Finder is hidden on any alignment mismatch and never recommends a spot;
- the public UI contains no `WHERE TO START`, `WHY THIS READ`, or `GUIDE'S READ`;
- all text remains readable at supported font scaling;
- safety, regulations, access warnings, and fail-closed behavior remain intact.

Review the structured states and boundary dates, not every combination of
generated paragraphs. This is the operating change that makes high-throughput
onboarding possible without lowering evidence quality.
