# River Run PM Integrated Primitive Audit

**Audit version:** 2026-07-28.1

**Engine version:** `river-run-v1.2.1`

**Configuration version:** `2026-07-29.1`

**Release conclusion:** Integrated engine and copy accepted locally; product
owner in-app acceptance and production gates remain open.

## Scope

This audit evaluates the five River Run primitives together:

1. Run Stage — configured calendar position only.
2. Conditions Suggest — locked cumulative historical timing comparison.
3. Push — current movement-trigger conditions, not observed fish movement.
4. Fishability — current fishing shape in the primary Scottville reach.
5. Fish In River — configured historical seasonal-presence context.

It checks both the numeric/label outputs and every user-facing headline, detail,
tip, and interpretation note. Independence is intentional: two primitives may
point in different directions when they describe different questions, but the
combined product must explain why.

## Critical findings and corrections

### 1. Simultaneous disagreements were incompletely explained

The interpretation resolver returned after its first matching disagreement. A
day such as Delayed Conditions Suggest + Strong Push + Tough Fishability could
therefore explain the Push/Fishability tension while silently omitting the
Delayed/Strong timing tension.

**Correction:** the resolver now collects every applicable finding into one
bounded interpretation note and emits every corresponding reason code. A single
disagreement retains its focused headline; simultaneous disagreements use one
combined headline and all relevant explanations.

### 2. The main run end and late historical-presence tail were conflated

After October 20, Run Stage correctly became Post-run and Push correctly became
Tracking complete. Conditions Suggest, however, could continue saying the run
was “well underway” until the separate November 3 historical-presence tail
ended. That was a direct trust problem.

**Correction:** Conditions Suggest now follows the configured main run end. From
October 21 onward it says the run window has passed and that Conditions Suggest
and Push are complete. If Fish In River remains above zero during the separately
configured late tail, an interpretation note explains that this is historical
seasonal-presence context and not a fresh run still underway.

### 3. Integrated acceptance coverage did not yet exist

The individual primitive tests were strong, but there was no exhaustive
all-primitive composition check and no daily five-season integrated replay.

**Correction:** the audit now includes:

- an exhaustive `22,176`-combination copy/interpretation matrix;
- explicit season-boundary and lower-river-cap invariants;
- a daily `2021–2025` PM replay across July 28 through November 3;
- simultaneous score, label, copy, quality, provenance, and interpretation
  checks.

## Exhaustive matrix result

- Primitive combinations checked: `22,176`
- Run Stage variants: all seven
- Conditions Suggest labels: all six
- Push labels: all eight, including unavailable and season-boundary states
- Fishability labels: all six, including unavailable
- Fish In River levels: every integer `0–10`
- Lower configured maximum: verified with a maximum-`6` run
- Simultaneous disagreement support: verified
- Incomplete copy findings: `0`
- Prohibited certainty, fish-count, clarity, or activity-safety claims: `0`

Every applicable disagreement reason code must be present. The matrix fails if
the resolver explains only one of multiple applicable conflicts.

## Five-season PM replay result

The replay covers `495` daily snapshots from `2021` through `2025`, using:

- Scottville USGS daily mean discharge for Conditions Suggest, Push, and
  Fishability;
- PMTU M-37 daily median measured water temperature for Conditions Suggest;
- PMTU Maple Leaf daily median measured water temperature for Push;
- Baldwin watershed-point modeled precipitation for Push;
- configured calendar history for Run Stage and Fish In River.

### Label distribution

| Primitive          | Replay distribution                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Run Stage          | 90 Pre-run, 45 Beginning, 110 Building, 55 Peak, 90 Tapering, 35 Ending, 70 Post-run                                             |
| Conditions Suggest | 90 Evaluating, 22 Ahead, 157 Typical, 31 Delayed, 195 Timing complete                                                            |
| Push               | 90 Tracking not started, 16 Unavailable, 16 Weak, 247 No clear push, 45 Possible, 10 Strong, 1 Very strong, 70 Tracking complete |
| Fishability        | 60 Tough, 147 Fishable, 138 Good, 150 Excellent                                                                                  |
| Data Quality       | 417 Fresh, 44 Partial, 34 Limited                                                                                                |

Fish In River produced every configured level from `0` through `10`.

### Integrated invariants

| Invariant                                       | Violations |
| ----------------------------------------------- | ---------: |
| Incomplete primitive or interpretation copy     |          0 |
| Prohibited overclaim copy                       |          0 |
| Applicable disagreement missing its explanation |          0 |
| Active Push before the run starts               |          0 |
| Active Push after the main run ends             |          0 |
| Post-run copy saying the run is “well underway” |          0 |
| Post-run historical tail without an explanation |          0 |

Real replay examples included Strong Push + Tough Fishability, Peak + No clear
push, favorable Fishability + low historical presence, and Post-run + a limited
historical-presence tail. These combinations are not treated as engine errors;
they are independently valid dimensions and now receive deterministic
explanations.

## Guide-level product judgment

The five primitives now form a coherent, intentionally conservative product. The
design does not force agreement where a river guide would not expect it:

- a fresh movement-trigger event can make a reach harder to fish;
- a calendar peak does not require a new Push that day;
- good river shape does not mean high fish numbers;
- a cumulative timing checkpoint should not reverse because of one new weather
  event;
- limited late-season historical presence does not extend Push tracking.

No scoring-threshold change is recommended from this integrated audit. The
historical replay shows useful variation without turning common weather into
frequent Strong/Very strong claims. Push produced Possible-or-stronger support
on `56 / 319` scored run-window days, while Strong/Very strong remained rare at
`11 / 319`. That balance is conservative without collapsing the primitive into
permanent “no signal” output.

## What this audit does not prove

This is a deterministic interaction and copy audit, not biological validation
against observed fish counts or catch records. The Conditions Suggest baselines
include the replay years, so the replay is not an out-of-sample forecast test.
It also does not replace:

- product-owner review of the rendered mobile screen;
- small-screen and accessibility acceptance;
- hidden production observation and provider-transition monitoring;
- production smoke tests after deployment;
- future validation for a river that adds optional context gauges.

## Reproduction

```sh
deno test --allow-env --allow-net \
  supabase/functions/_shared/riverRunEngine/tests \
  supabase/functions/river-run/index.test.ts

npm run audit:river-run:pm-integrated
npm run qa:water-reader-typecheck
```

Local result: `148` tests passed, `0` failed; TypeScript typecheck passed.
