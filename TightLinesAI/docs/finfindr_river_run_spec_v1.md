# FinFindr River Run — V1 Spec

> Legacy design record. The reconciled source of truth is
> `finfindr_river_run_v1_simple_spec.md` plus `river_run_rollout_plan.md`.
> Where this document differs, the reconciled specification wins.

**Feature:** River Run  
**Product:** FinFindr  
**V1 proof point:** Pere Marquette River — fall Chinook (king salmon)  
**Principle:** Deterministic engine first. No fish-count claims. No gauge = no River Run.

---

## 1. What River Run Is

River Run answers one question:

> **Is a fresh movement window happening, is the river fishable, and should I go now, wait, or watch the next rain?**

It is a **migratory-run timing and fishability engine** — not a catch predictor.

**Fresh Push** (movement signal) and **Fishability** (river shape) are always separate scores. A river can score high movement and low fishability during a blowout.

**Expansion model:**

```txt
Shared engine
+ RiverProfile (gauge + coords + hydrology tuning)
+ SpeciesRunProfile per run (season + species + dates + runStrength + tuning)
+ Historical gauge baselines (auto-built from USGS)
= Live River Run for any supported river/species/season
```

Adding a new river should require **research + config + light tuning**, not new engine code.

---

## 2. User Navigation Model

Users drill down by **river → season → species run**. Each scored card is one `SpeciesRunProfile`, not a whole season lumped together.

```txt
Select River (e.g. Pere Marquette)
  → Show only seasons that have active runs (hide empty seasons)
    → Fall
        → Chinook — Fall Run (5/5 signature)
        → Steelhead — Fall Entry (2/5 light)
    → Spring
        → Steelhead — Spring Run (5/5 signature)
```

**Rules:**

- **Hide empty seasons.** If a river has no summer runs, Summer does not appear.
- **One profile per distinct run.** PM fall steelhead and PM spring steelhead are separate profiles (different windows, strength, tuning) sharing the same gauge.
- **Same species, different season = different runs.** Platte fall coho (5/5) and Platte fall chinook (3/5) are two profiles under Fall.
- **Score individually.** Never score "Fall" as a bucket; score each species run card.

---

## 3. V1 Scope

### 3.1 In scope

| Area | V1 deliverable |
|---|---|
| River | Pere Marquette only (UI); config model supports multi-river |
| Species/run | Fall Chinook only (engine proof) |
| Gauge | One USGS station per river (required) |
| Weather | Open-Meteo at river mouth (reuse existing stack) |
| Historical baselines | Auto-built flow + gage-height percentiles from USGS daily history |
| Today score | Overall River Run Score, Fresh Push, Fishability, Run Stage, Run Timing, Best Call, Confidence, reasons |
| **10-day outlook** | Same metrics per forward day; midnight refresh (§16) |
| Push notifications | Opt-in River Run alerts with anti-spam rules (§17) |
| Config model | `season`, `runStrength` (1–5), multi-run per river (documented; PM fall kings live first) |
| Storage | Daily + outlook snapshots for validation |
| Tests | PM fall-king scenario tests + outlook tests + regression suite |
| UI | River Run card + detail + 10-day outlook strip |

### 3.2 Out of scope (V2+)

- Multiple rivers in production UI (beyond PM)
- Additional PM runs live in UI (fall/spring steelhead — config-ready, not V1 live)
- Reach lag / lower-middle-upper guidance
- Manual DNR/guide reports in scoring
- AI narration
- Presentation recommendation engine
- Full admin tuning dashboard
- NOAA/NWPS as separate ingestion path
- User feedback loop

---

## 4. Data Requirements

### 4.1 Gauge — required, non-negotiable

Each river **must** have at least one active USGS (or equivalent authoritative) gauge with:

- **Discharge (CFS)** — preferred primary signal
- **Gage height (ft)** — required fallback when CFS unavailable; used when both exist

**No gauge data → River Run does not run.** Return `unsupported: no_gauge_data` with confidence capped at 0.

**PM V1 gauge:** `04122500` — Pere Marquette River at Scottville, MI  
(Discharge since 1989; gage height since 2017.)

### 4.2 Weather — required

Reuse FinFindr's existing Open-Meteo integration (`fetchOpenMeteo14Day` / `get-environment`) at the river's `mouthLat` / `mouthLon`.

Required fields:

- Rain: 24h, 48h, 72h observed + forecast through **10 days**
- Cloud cover (for low-light context in reasons only)

### 4.3 Water temperature — required

Water temperature is valuable for salmon/steelhead timing, but a gauge does **not** guarantee water-temp data. Each river/run uses an admin-approved temperature source, in priority order:

1. Same USGS gauge water temperature, if available
2. Same-river or nearby water-temperature gauge, manually approved by admin
3. Adjusted reference water-temperature gauge, manually approved by admin
4. Unavailable — do not support a river with no viable measured-water source;
   fail temperature-dependent output closed during a temporary outage

Adjusted reference gauges are allowed only through explicit admin config. Example: a nearby reference river runs ~3°F warmer than the target spring-fed river, so the target profile uses `adjustmentF: -3`. This is deterministic config, not daily manual scoring.

Air temperature is not a River Run input and is never a fallback for measured
water temperature.

### 4.4 Historical baselines — required for accuracy

On river onboarding (and refreshed weekly), the engine ingests USGS **daily mean** values for the gauge and builds **day-of-year percentile tables**:

- For each calendar day (1–366), use a ±14-day rolling window across all available years
- Compute percentiles: p10, p25, p50, p75, p90 for **both** `flow_cfs` and `gage_height_ft` (whichever parameters exist)
- Store as `gauge_baselines` keyed by `gaugeId` + `dayOfYear`

**Why both flow and height:** Some rivers score better on CFS; others only have reliable height. The engine uses the best available primary metric per profile, with the other as a cross-check. If only one exists, score on that one and reduce confidence slightly.

**Default fishable bands** (auto-derived from baselines, overridable per river):

| Band | Default percentile range |
|---|---|
| Very low | below p10 |
| Low | p10–p25 |
| Normal / fishable | p25–p75 |
| High | p75–p90 |
| Blown out | above p90 |

Per-run tuning overrides these defaults in `SpeciesRunProfile.flowBands`.

---

## 5. Plug-and-Play Config

All river-specific knowledge lives in **typed TS config files** under:

```txt
supabase/functions/_shared/riverRunEngine/
  config/
    rivers.ts          # RiverProfile[]
    speciesRuns.ts     # SpeciesRunProfile[]
  types.ts
```

No per-river engine code. Adding a river = add config entries + run baseline ingest + tune + validate.

### 5.1 RiverProfile

```ts
export type RiverProfile = {
  riverId: string;
  displayName: string;
  state: string;
  supportTier: 'fully_supported' | 'beta_supported';

  mouthLat: number;
  mouthLon: number;
  timezone: string;           // IANA, e.g. 'America/Detroit' — for midnight outlook refresh

  gauge: {
    provider: 'USGS';
    siteId: string;           // e.g. '04122500'
    name: string;
    primaryMetric: 'flow_cfs' | 'gage_height_ft';
  };

  temperatureSource: {
    type: 'same_gauge' | 'nearby_water_gauge' | 'adjusted_reference_gauge' | 'unavailable';
    provider?: 'USGS' | 'MONITOR_MY_WATERSHED';
    siteId?: string;          // required for water gauge sources
    name?: string;
    adjustmentF?: number;     // admin-entered modifier, e.g. -3 for cooler spring-fed river
    confidence: 'high' | 'medium' | 'low' | 'none';
    notes: string;            // documents why this source/modifier was approved
  };

  hydrology: {
    clearsFast: boolean;      // stain clears quickly after rain
    stainSensitivity: 'low' | 'medium' | 'high';
    flashyRiver: boolean;     // rises/falls quickly — affects fishability + flow projection
  };

  activeRunIds: string[];
};
```

### 5.2 SpeciesRunProfile

Research inputs you provide per **river + season + species run**:

```ts
export type RunSeason = 'spring' | 'summer' | 'fall' | 'winter';

export type SpeciesRunProfile = {
  runId: string;
  riverId: string;
  species: 'chinook_salmon' | 'coho_salmon' | 'steelhead' | 'brown_trout' | 'atlantic_salmon';
  runType: 'fall_spawn' | 'fall_entry' | 'spring_spawn' | 'winter_holding' | 'summer_run';
  displayName: string;

  // UI grouping — primary season tab this run appears under
  season: RunSeason;

  // Researched local run significance for this river (NOT a substitute for live triggers)
  runStrength: 1 | 2 | 3 | 4 | 5;
  runStrengthLabel?: 'light' | 'moderate' | 'strong' | 'signature';  // optional display copy

  // Core calendar — your researched averages (MM-DD)
  window: {
    start: string;   // avg run start
    peak: string;    // avg peak / mid-run
    end: string;     // avg run end
  };

  // Small tuning knobs — not full rewrites
  tuning: {
    canStartEarlyDays: number;   // default 10
    canEndLateDays: number;      // default 10
    idealRisePercent24h: number; // default 15
    strongRisePercent24h: number;// default 30
    minTriggerRain48hIn: number; // default 0.35
    warmWaterPenaltyTempF?: number;
  };

  // Species + season behavior. Fall salmon may respond to cooling;
  // spring steelhead may respond to warming after cold water.
  timingBehavior: {
    temperatureTrend: 'cooling' | 'warming' | 'stable_cold' | 'stable_cool' | 'none';
    primaryMovementDrivers: Array<'calendar' | 'flow_pulse' | 'rain' | 'temperature' | 'stability'>;
    earlyAccelerationDays: number; // max days timing can be called ahead from triggers
    lateDelayDays: number;         // max days timing can be called behind from weak triggers
  };

  // Optional overrides; if omitted, use auto-derived percentile bands
  flowBands?: {
    veryLow: number;   // percentile
    low: number;
    normalHigh: number;
    high: number;
    blownOut: number;
  };

  triggerWeights: {
    calendarReadiness: number;  // sum ≈ 1.0
    flowPulse: number;
    rainTrigger: number;
    temperatureTrigger: number;
  };
};
```

### 5.3 Run Strength (1–5) — how it is used

`runStrength` is **researched local metadata** (e.g. Platte coho 5/5, chinook 3/5; PM spring steelhead 5/5, fall steelhead 2/5). It shapes interpretation, not raw weather readings.

| Strength | Meaning | Engine effect |
|---:|---|---|
| 1–2 | Light / occasional run | Lower calendar ceiling in marginal windows; copy warns "historically light run"; Fresh Push labels conservative |
| 3 | Moderate | Default weighting |
| 4–5 | Strong / signature | Higher run-presence weight when calendar + triggers align; copy may note "signature run" |

**Run strength must NOT:**

- Inflate scores when calendar says pre-run or gauge is dry/low
- Override missing gauge data
- Act as a standalone "green day" without rain/flow/cooling triggers

**Run strength may:**

- Scale internal `runPresenceWeight` (0.6 at 1/5 → 1.0 at 5/5) used in Run Stage and timing copy
- Adjust confidence caps slightly (light runs: don't oversell strong movement language)
- Surface on the card: "Spring steelhead — signature run (5/5)"

### 5.4 What you research per new river/run

1. **Season** tab this run belongs under
2. Avg **start**, **peak**, **end** dates
3. **Run strength** (1–5) for this species on this river in this season
4. One reliable **USGS gauge** site ID
5. River mouth coords + timezone
6. Species/season timing behavior (cooling fall run, warming spring run, stable winter holding, etc.)
7. Light hydrology notes (flashy? clears fast? stain-sensitive?)
8. Optional band/threshold overrides after first backtest

Everything else is engine math + auto-built historical baselines.

### 5.5 Admin River Onboarding Model

FinFindr can accept user requests and votes for new rivers, but a river/run goes live only after admin enters and approves the required config. The engine never auto-selects a substitute gauge or temperature source.

Admin-entered fields include:

1. River gauge and primary metric
2. Water-temperature source and any adjustment
3. River/run calendar window and run strength
4. Species/season timing behavior
5. Hydrology notes and flow-band overrides
6. Safety/regulation copy region
7. Support tier: `beta_supported` or `fully_supported`

This keeps the product scalable while preserving deterministic behavior: users can influence the roadmap, but live scoring depends on researched, versioned config.

### 5.6 Multi-run examples (config reference)

```txt
Platte River — Fall
  coho_salmon     runStrength: 5  (signature)
  chinook_salmon  runStrength: 3  (moderate)

Pere Marquette — Fall
  chinook_salmon  runStrength: 5  (V1 live)
  steelhead       runStrength: 2  (light fall entry — config only until validated)

Pere Marquette — Spring
  steelhead       runStrength: 5  (signature — config only until validated)
```

---

## 6. Engine Pipeline

### 6.1 Today score (confirmed)

```txt
1. Load RiverProfile + SpeciesRunProfile
2. Fetch/cache latest gauge observation (USGS)
3. Fetch/cache weather snapshot (Open-Meteo at mouth)
4. Load gauge_baselines for today's day-of-year
5. Compute normalized metrics (§7) — source: 'confirmed'
6. Apply runStrength weighting (§7.9)
7. Score outputs (§8)
8. Emit reason codes → plain-English reasons
9. Persist daily snapshot
10. Return today card payload
```

### 6.2 Scheduled ingestion

| Data | Frequency |
|---|---|
| Gauge observations | Every 30–60 min |
| Weather | Every 60 min (or piggyback on env cache) |
| Baselines | Weekly rebuild |
| Today score | Every 6 hours + on-demand |
| 10-day outlook bundle | Built with today score; stable until midnight (§16) |

---

## 7. Metrics Layer

All metrics normalize to **0–100** unless noted.

### 7.1 Calendar Readiness

Where today (or forecast target day) falls in the configured run window.

```txt
Before (start − canStartEarlyDays):     0–15   → pre-run territory
Early window (start → midpoint to peak): 15–55  → building territory
Peak window (±7 days around peak date):  70–100 → prime territory
Late window (peak → end):               55–80  → still active, declining
After (end + canEndLateDays):           0–30   → post-run territory
```

### 7.2 Flow Level Score

Compare gauge value to historical baseline for target day-of-year.

```ts
percentile = lookupPercentile(value, baselines[doy], primaryMetric);

if (percentile < p10)  levelScore = 25;  // very low
if (p10–p25)           levelScore = 45;  // low
if (p25–p75)           levelScore = 80;  // normal/fishable sweet spot
if (p75–p90)           levelScore = 55;  // high — movement possible, tougher
if ( > p90)            levelScore = 15;  // blown out
```

**Today:** uses live gauge reading.  
**Outlook days:** uses projected flow from forecast rain + `flashyRiver` profile (approximate — see §16).

### 7.3 Flow Pulse Score

Detect movement triggers from rate of change (today) or projected rise from forecast rain (outlook).

```ts
rise24 = percentChange(now, ago24h);

if (rise24 >= strongRisePercent24h)  pulseScore = 90;
else if (rise24 >= idealRisePercent24h) pulseScore = 75;
else if (rise48h >= idealRisePercent24h) pulseScore = 60;
else if (falling after recent spike) pulseScore = 50;
else pulseScore = 20;
```

Rising flow **increases Fresh Push** and often **decreases Fishability**.

### 7.4 Rain Trigger Score

```txt
No rain + dry antecedent:        10–25
Light rain (0.1–0.35" / 48h):   40–55
Moderate rain after dry spell:   70–85
Heavy rain (blowout risk):       85 movement / fishability penalty separately
Forecast rain on outlook day:    scored directly from that day's forecast totals
```

### 7.5 Temperature Trigger Score

Build a deterministic temperature signal from `RiverProfile.temperatureSource`, then interpret it through `SpeciesRunProfile.timingBehavior`.

```ts
tempSignal = {
  source: 'same_gauge' | 'nearby_water_gauge' | 'adjusted_reference_gauge' | 'unavailable',
  valueF?: number,
  trend24hF?: number,
  trend72hF?: number,
  confidenceMultiplier: number,
};
```

Rules:

- Same-gauge water temp can score actual thermal suitability + the configured temperature trend.
- Nearby or adjusted reference water temp can score suitability + trend, but confidence is capped below same-gauge data.
- An unavailable current measured-water source makes temperature-dependent
  output unavailable.
- Unavailable temp removes this component from reasons and lowers confidence for temp-sensitive runs.
- Adjusted reference gauges apply the admin-entered `adjustmentF` before scoring.

Examples:

| Run type | Temperature behavior |
|---|---|
| Fall Chinook | Cooling after warm weather can accelerate the run |
| Fall coho | Cooling + rain often matters, tuned per river |
| Spring steelhead | Warming after cold water can strengthen movement/spawn activity |
| Winter steelhead | Stable cold/cool water may matter more than warming |
| Summer runs | Cooling relief may matter; warming is usually not a positive trigger |

### 7.6 Dry Spell / Release Context

This is **not** a separate weighted score in V1. It is deterministic context used for reasons and timing labels.

High release context exists when:

- Calendar says run should be active (readiness ≥ 45)
- Prior 7–14 days were low flow + dry + seasonally unfavorable temperature
- Rain/flow/temperature triggers just occurred, or are forecast on short-range outlook days

This powers copy like **"behind schedule but improving"** without adding another scoring knob.

### 7.7 Clarity Proxy (internal)

Estimate stain from rain + flow pulse + `hydrology.clearsFast` + `stainSensitivity`:

- `clear` / `slightly_stained` / `stained_fishable` / `dirty` / `blown_dirty`

### 7.8 Timing Deviation Signal (internal)

```ts
expectedActivity = calendarReadiness;
driverScores = pickConfiguredDrivers({
  calendar: calendarReadiness,
  flow_pulse: flowPulse,
  rain: rainTrigger,
  temperature: temperatureTrigger,
  stability: stabilityScore,
}, timingBehavior.primaryMovementDrivers);

actualActivity = weightedAvg(driverScores);
timingDeviation = actualActivity - expectedActivity;
```

| Deviation | Status |
|---|---|
| ≥ +12 | `ahead` |
| −11 to +11 | `on_schedule` |
| ≤ −12 | `behind` |
| Low/conflicting signal | `uncertain` |

User-facing labels collapse to Ahead / On schedule / Behind / Uncertain.

Timing status is run-profile aware:

- Fall cooling-driven runs can move ahead when cool rain/flow triggers appear before the average peak.
- Spring warming-driven runs can move ahead when warming + fishable flows appear after cold conditions.
- Stable winter holding runs should not be called ahead simply because water warms.
- If temperature source quality is low or triggers conflict, use `uncertain`.

### 7.9 Run Strength Weighting (internal)

```ts
runPresenceWeight = 0.6 + (runStrength - 1) * 0.1;  // 1→0.6, 5→1.0
```

Applied when deriving Run Stage and movement significance — not as a flat bonus to Fresh Push.

---

## 8. Scoring Outputs

### 8.1 Overall River Run Score (hero)

The overall score is the daily decision score. It summarizes whether the run window is useful **today**, while Fresh Push and Fishability remain visible underneath.

```ts
rawOverall =
  freshPushScore  * 0.45 +
  fishability     * 0.35 +
  confidence      * 0.20;

// Safety and honesty caps
if (blown_out) overallScore = min(rawOverall, 35);
if (fishability < 35) overallScore = min(rawOverall, 45);
if (confidence < 45) overallScore = min(rawOverall, 55);
if (calendarReadiness < 15 && noEarlyTrigger) overallScore = min(rawOverall, 30);

riverRunScore = clamp(overallScore, 0, 100);
```

| Score | Label |
|---:|---|
| 0–24 | Poor |
| 25–44 | Weak |
| 45–64 | Fair |
| 65–79 | Good |
| 80–100 | Excellent |

The UI should lead with the overall score and Best Call, then show Fresh Push and Fishability as the explanation.

### 8.2 Fresh Push Score

```ts
raw =
  calendarReadiness  × w.calendarReadiness +
  flowPulseScore     × w.flowPulse +
  rainTriggerScore   × w.rainTrigger +
  temperatureTriggerScore × w.temperatureTrigger;

// Penalties
if (calendarReadiness < 15)        raw -= 30;
if (after post-run window)          raw -= 25;
if (blown_out flow band)            raw -= 10;
if (gauge stale > 6h && confirmed) raw *= 0.7;

freshPushScore = clamp(raw * runPresenceWeight, 0, 100);
```

| Score | Label |
|---:|---|
| 0–24 | Very low |
| 25–44 | Weak |
| 45–64 | Moderate |
| 65–79 | Strong |
| 80–100 | Very strong |

### 8.3 Fishability Score

```ts
raw =
  flowLevelScore      × 0.40 +
  stabilityScore      × 0.25 +
  clarityProxyScore   × 0.25 +
  shortTermForecast   × 0.10;

if (blown_out) fishability = min(raw, 30);
if (very_low && clear) fishability = min(raw, 50);
```

### 8.4 Run Stage

Five stages: `pre_run` → `building` → `prime` → `fading` → `post_run`

```ts
if (calendarReadiness < 20)                          → 'pre_run'
if (past end + grace && freshPush < 35)              → 'post_run'
if (calendar near peak && freshPush ≥ 45)            → 'prime'
if (past peak calendar && freshPush < 45)            → 'fading'
else                                                 → 'building'
```

### 8.5 Run Timing Status

From §7.8 + calendar context + `timingBehavior`. Always paired with a short reason.

### 8.6 Best Call

| Call | Conditions |
|---|---|
| `go_now` | freshPush ≥ 65, fishability ≥ 60, confidence ≥ 55 |
| `go_at_dawn` | freshPush ≥ 55, fishability ≥ 50, improving overnight |
| `wait_for_drop` | freshPush ≥ 60, fishability < 45, forecast falling flow |
| `watch_next_rain` | calendar readiness ≥ 45, low flow, forecast rain within 72h |
| `too_low_wait` | very low flow, no recent rain, calendar active |
| `run_not_open` | calendar readiness < 20, no early trigger |
| `fading_go_soon` | stage = fading, fishability ≥ 50 |

Outlook days may surface `watch_next_rain` or `wait_for_drop` when forecast signals dominate.

### 8.7 Travel Confidence

Travel confidence translates scores into the user's real decision: whether the window justifies a trip.

| Label | Meaning |
|---|---|
| `local_ok` | Worth checking if nearby, but not enough signal for travel |
| `worth_short_drive` | Conditions may justify a short drive if schedule is flexible |
| `worth_planning` | Strong enough signal to plan around, especially days 0–3 |
| `do_not_travel` | Unsafe, blown out, too early, too low, or confidence too weak |

Rules:

- Never show `worth_planning` when confidence < 65.
- Never show `worth_planning` for outlook days beyond day 3.
- Any blown-out/safety condition forces `do_not_travel`.
- Use conservative labels when using adjusted-reference water temperature.

### 8.8 Confidence

**Today (confirmed):**

```ts
confidence =
  gaugeFreshness      × 0.30 +
  baselineYears       × 0.25 +
  metricCompleteness  × 0.25 +
  weatherFreshness    × 0.20;
```

**Outlook days:** apply day-offset decay on top:

```txt
Day 0 (today):     100% of computed confidence
Days 1–3:          × 0.85
Days 4–7:          × 0.65
Days 8–10:         × 0.45
```

Hard caps: no gauge → 0 (unsupported); gauge stale > 12h → max 40; baseline < 5yr → max 60; outlook day > 0 → max 75.

Temperature source quality contributes to `metricCompleteness`: same-gauge
water temperature is full credit, an approved nearby/adjusted water gauge is
partial credit, and unavailable measured temperature fails temperature-sensitive
output closed.

### 8.9 Reason Strings

Deterministic reason codes → plain English. Min 2, max 6. No LLM in V1.

Outlook-specific examples:

- `forecast_rain_trigger` → "Forecast rain may trigger movement over the next few days."
- `forecast_cooling` → "Cooler nights in the forecast may help the run."
- `forecast_flow_approx` → "Projected flow is approximate — check gauge before traveling."

---

## 9. V1 Example: PM Fall Kings

```ts
export const pereMarquette: RiverProfile = {
  riverId: 'pere_marquette',
  displayName: 'Pere Marquette',
  state: 'MI',
  supportTier: 'fully_supported',
  mouthLat: 43.945,
  mouthLon: -86.279,
  timezone: 'America/Detroit',
  gauge: {
    provider: 'USGS',
    siteId: '04122500',
    name: 'Pere Marquette River at Scottville',
    primaryMetric: 'flow_cfs',
  },
  temperatureSource: {
    type: 'nearby_water_gauge',
    provider: 'MONITOR_MY_WATERSHED',
    siteId: 'Maple Leaf',
    confidence: 'medium',
    notes: 'Audited PMTU Maple Leaf measured-water source.',
  },
  hydrology: {
    clearsFast: true,
    stainSensitivity: 'medium',
    flashyRiver: true,
  },
  activeRunIds: [
    'pere_marquette_chinook_fall',
    // 'pere_marquette_steelhead_fall',   // V2 — runStrength 2
    // 'pere_marquette_steelhead_spring', // V2 — runStrength 5
  ],
};

export const pmChinookFall: SpeciesRunProfile = {
  runId: 'pere_marquette_chinook_fall',
  riverId: 'pere_marquette',
  species: 'chinook_salmon',
  runType: 'fall_spawn',
  displayName: 'Fall Kings',
  season: 'fall',
  runStrength: 5,
  runStrengthLabel: 'signature',

  window: { start: '08-25', peak: '09-20', end: '10-15' },

  tuning: {
    canStartEarlyDays: 10,
    canEndLateDays: 10,
    idealRisePercent24h: 15,
    strongRisePercent24h: 30,
    minTriggerRain48hIn: 0.35,
    warmWaterPenaltyTempF: 68,
  },

  timingBehavior: {
    temperatureTrend: 'cooling',
    primaryMovementDrivers: ['calendar', 'flow_pulse', 'rain', 'temperature'],
    earlyAccelerationDays: 10,
    lateDelayDays: 10,
  },

  triggerWeights: {
    calendarReadiness: 0.35,
    flowPulse: 0.30,
    rainTrigger: 0.20,
    temperatureTrigger: 0.15,
  },
};
```

Window dates are **starting placeholders** — tune against historical flow/rain/temperature events and admin research before public launch.

---

## 10. API Contract

### 10.1 `GET /river-run/rivers`

Lists rivers with seasons and runs (empty seasons omitted).

```json
{
  "rivers": [{
    "riverId": "pere_marquette",
    "displayName": "Pere Marquette",
    "seasons": [{
      "season": "fall",
      "runs": [{
        "runId": "pere_marquette_chinook_fall",
        "displayName": "Fall Kings",
        "species": "chinook_salmon",
        "runStrength": 5,
        "runStrengthLabel": "signature"
      }]
    }]
  }]
}
```

### 10.2 `GET /river-run/score?riverId=&runId=`

Returns **today (confirmed)** + **10-day outlook bundle**.

```json
{
  "riverId": "pere_marquette",
  "runId": "pere_marquette_chinook_fall",
  "timezone": "America/Detroit",
  "bundleDate": "2026-09-10",
  "expiresAt": "2026-09-11T04:00:00Z",
  "today": {
    "source": "confirmed",
    "scoredAt": "2026-09-10T11:00:00Z",
    "runStage": "building",
    "timingStatus": "behind",
    "scores": { "overall": 75, "freshPush": 82, "fishability": 68, "confidence": 78 },
    "bestCall": "go_at_dawn",
    "travelConfidence": "worth_short_drive",
    "gauge": {
      "siteId": "04122500",
      "flowCfs": 420,
      "gageHeightFt": 2.1,
      "flowPercentile": 62,
      "observedAt": "2026-09-10T10:30:00Z"
    },
    "temperature": {
      "source": "nearby_water_gauge",
      "valueF": 61.2,
      "adjustmentF": null,
      "confidence": "medium"
    },
    "reasons": ["Flow rose meaningfully over the last 24 hours.", "..."],
    "safety": {
      "regulationReminder": "Check current local regulations before fishing.",
      "gaugeBasis": "Based on USGS gauge 04122500 at Scottville; conditions can vary by reach."
    },
    "runStrength": 5,
    "runStrengthLabel": "signature"
  },
  "outlook": [
    {
      "source": "forecast",
      "date": "2026-09-11",
      "dayOffset": 1,
      "scores": { "overall": 67, "freshPush": 74, "fishability": 62, "confidence": 66 },
      "runStage": "building",
      "timingStatus": "behind",
      "bestCall": "watch_next_rain",
      "travelConfidence": "worth_short_drive",
      "reasons": ["Forecast rain may trigger movement.", "Cooler nights in the forecast may help the run."]
    }
  ],
  "outlookDisclaimer": "Outlook days use forecast weather and approximate flow. Scores refresh at local midnight.",
  "modelVersion": "river-run-v1.0.0"
}
```

### 10.3 Unsupported response

```json
{
  "supported": false,
  "reason": "no_gauge_data",
  "message": "River Run requires an active gauge. This river is not available."
}
```

---

## 11. Storage

### 11.1 Config — TS files (V1)

River and species run profiles live in code. Version-controlled; matches `howFishingEngine` pattern.

### 11.2 Tables — minimal (V1)

| Table | Purpose |
|---|---|
| `gauge_baselines` | Auto-built percentile tables |
| `gauge_observations` | Normalized USGS snapshots |
| `river_run_scores` | Frozen daily confirmed snapshots |
| `river_run_outlook_snapshots` | 10-day bundle per river+run+local date |
| `river_run_alert_subscriptions` | User opt-in alert preferences per river+run |
| `river_run_alert_events` | Sent/deduped push-alert history |

Defer DB-backed `rivers`, `species_runs`, `manual_reports`, `feedback` until V2 admin tooling. V1 river/run config remains version-controlled TS entered by admin.

### 11.3 Snapshot rules

- Freeze every **confirmed** daily prediction before validation. Never retro-edit.
- Freeze the full **10-day outlook bundle** when built. Stable until local midnight.
- Store: all outputs + raw gauge + rain totals + forecast inputs + model version + reason codes.

---

## 12. File Structure

```txt
supabase/functions/
  river-run/
    index.ts
  river-run-outlook/
    index.ts                    # optional split; may live in river-run/index.ts
  river-run-alerts/
    index.ts                    # scheduled push alert evaluator

  _shared/riverRunEngine/
    types.ts
    config/
      rivers.ts
      speciesRuns.ts
    data/
      usgsGauge.ts
      weather.ts
      baselines.ts
    metrics/
      calendar.ts
      flow.ts
      weather.ts
      timing.ts
      outlookProjection.ts      # forecast-day flow approximation
    scoring/
      freshPush.ts
      fishability.ts
      runStage.ts
      bestCall.ts
      confidence.ts
    outlook/
      buildOutlookBundle.ts     # 10-day forward pass
      midnightCache.ts          # TTL = next local midnight
    alerts/
      evaluateAlertTriggers.ts
      dedupeAlerts.ts
    reasons/
      reasonCodes.ts
    tests/
      pereMarquetteChinook.test.ts
      outlookBundle.test.ts
```

---

## 13. Test Cases (V1 must pass)

| # | Scenario | Expected |
|---|---|---|
| 1 | Too early (Aug 1), no rain, normal flow | pre_run, low fresh push, `run_not_open` |
| 2 | Early cool rain before start | building, ahead timing, moderate+ push |
| 3 | Standard start but dry/low/warm | behind timing, `watch_next_rain` |
| 4 | Rain after delayed dry stretch | building, behind-but-improving, high push |
| 5 | Heavy rain, >p90 flow, fast rise | high push, low fishability, `wait_for_drop` |
| 6 | Peak window, normal flow, stained | prime, on schedule, go_now or dawn |
| 7 | Late season, stable low water | fading, low push, `fading_go_soon` |
| 8 | Holding conditions (stable, clearing, no new rain) | low-moderate push, good fishability — no false fresh-entry copy |
| 9 | Outlook day 4 with forecast rain + cooling | elevated fresh push vs today; confidence ≤ 65; `source: forecast` |
| 10 | Light run (runStrength 2) vs signature (5), same inputs | strength-2 card uses more conservative stage/copy; not higher score |
| 11 | Same gauge has no water temp; approved adjusted reference gauge is configured | temp signal uses adjusted water temp; confidence capped below same-gauge temp |
| 12 | Air-temp proxy only | temp score capped; no actual water-temp suitability reason |
| 13 | Alert threshold crossed twice in same day | one push sent; duplicate suppressed |
| 14 | High Fresh Push but blown-out flow | overall score capped low; `wait_for_drop` or safety copy wins |
| 15 | Fall Chinook with early cool rain before peak | timing may become `ahead` |
| 16 | Spring steelhead with warming after cold water | timing may become `ahead`; same input must not be treated like fall cooling logic |

---

## 14. Validation Loop

Engine accuracy is judged by **deterministic movement and fishability proxies**, not catches and not manual daily report review.

1. Freeze daily + outlook snapshots
2. Backtest against historical gauge/weather events for the configured river/run window
3. Check whether high Fresh Push aligns with meaningful rain + rise + cooling events in season
4. Check whether low Fishability aligns with very low, blown-out, or unstable gauge conditions
5. Tune `window` dates, temperature source/modifier, `runStrength` labels, and thresholds — not engine structure
6. Promote river from `beta_supported` → `fully_supported` after one validated season or admin expert review

Manual DNR/guide reports may be used as optional admin research before launch, but they are **never required for daily scoring** and are not part of the V1 runtime loop.

---

## 15. Rollout Phases

| Phase | Goal |
|---|---|
| **0 — Spike** | PM gauge ingest + baseline build + 3 manual score days |
| **1 — Engine** | Today metrics + scoring + tests passing |
| **2 — Outlook** | 10-day bundle + midnight cache + outlook tests |
| **3 — API + snapshots** | Edge function + DB persistence |
| **4 — UI** | River → season → run nav; today card + 10-day strip |
| **5 — Alerts** | Opt-in push notifications + dedupe rules |
| **6 — Backtest** | 2024/2025 fall retro + tune windows/thresholds |
| **7 — Launch** | Paywall + PM public beta |

---

## 16. 10-Day Outlook — Midnight Refresh Contract

River Run's 10-day calendar follows the **same stability contract** as FinFindr's home-screen forecast (`forecast-scores` / `forecastScores.ts`):

### 16.1 Behavior

- Each day, the engine builds **one outlook bundle**: today (confirmed) + next 9 days (forecast) = **10 days total**.
- The bundle is **stable for the entire local calendar day** at the river's timezone (`RiverProfile.timezone`).
- At **local midnight**, the bundle expires. The next request (or scheduled job) pulls **fresh gauge + fresh Open-Meteo forecast** and rebuilds all 10 days.
- Day 0 rolls forward; a new day 9 appears at the far end.

### 16.2 Cache layers

| Layer | Key | TTL |
|---|---|---|
| Server DB | `riverId + runId + bundleDate` | Until local midnight |
| Server memory | Same | Until local midnight |
| Client AsyncStorage | Same pattern as `forecast_scores_v*` | `nextMidnightInTimeZoneMs(timezone)` |

Use the same `nextMidnightInTimeZoneMs` helper from `lib/forecastSnapshot.ts`.

### 16.3 What refreshes at midnight

- New USGS gauge reading becomes day-0 anchor
- Open-Meteo forecast rolls forward (new 10-day window)
- All 10 outlook scores recomputed deterministically
- `bundleDate` increments to the new local date

### 16.4 Confirmed vs forecast days

| | Today (day 0) | Days 1–9 |
|---|---|---|
| **Source** | `confirmed` | `forecast` |
| Gauge | Live USGS | Projected from rain forecast + flashyRiver profile |
| Weather | Observed + near forecast | That day's forecast totals |
| Confidence | Full formula | Decay by day offset (§8.8) |
| UI label | "Today" | Date + "Forecast" badge on days 3+ |

### 16.5 Outlook reliability tiers

| Window | Product treatment |
|---|---|
| Today | Actionable confirmed score |
| Days 1–3 | Actionable short-range outlook if confidence supports it |
| Days 4–10 | Watchlist only; useful for upcoming rain/cooling patterns, not travel commitment |

Future flow projection is always approximate. Long-range outlook days can highlight "watch next rain" but must not imply a firm go/travel recommendation.

### 16.6 UI

- 10-day strip matches home dashboard forecast tile pattern (band colors, score, hi/lo or rain icon on forecast days).
- Disclaimer: *"Outlook days use forecast weather and approximate flow. Scores refresh at local midnight."*
- Tapping a future day opens detail with forecast reasons.

### 16.7 Why midnight stability matters

Anglers plan trips around runs. Scores must not drift hourly from model jitter — only from a new calendar day and newly ingested gauge/forecast data.

---

## 17. Push Notifications

Push notifications are opt-in and deterministic. They should notify users when the river-run decision changes meaningfully, not every time a score recomputes.

### 17.1 Alert types

| Type | V1? | Meaning |
|---|---|---|
| `fresh_push_opening` | Yes | Fresh Push crosses into a strong movement window |
| `wait_for_drop` | Yes | Movement signal is strong but river is too high/dirty now |
| `watch_next_rain` | Yes | Calendar is active and forecast rain may trigger movement |
| `go_at_dawn` | Optional V1.1 | Movement + fishability support an early trip |
| `blowout_warning` | Optional V1.1 | Flow/safety conditions override excitement |
| `run_fading` | V2 | Run is fading but still fishable soon |

### 17.2 User controls

- Subscribe by river/run, not only by river.
- Minimum confidence threshold, default 60.
- Quiet hours.
- Max alerts per river/run per week.
- Optional long-range watch alerts for days 4–10; off by default.

### 17.3 Trigger rules

Send only when all are true:

- User is subscribed to the river/run.
- Confidence meets user threshold.
- Best Call or Travel Confidence meaningfully improved since last alert.
- Alert was not already sent for the same river/run/type/local date.

Example thresholds:

```ts
fresh_push_opening:
  previousFreshPush < 55 &&
  currentFreshPush >= 70 &&
  fishability >= 50 &&
  confidence >= 60

go_at_dawn:
  bestCall === 'go_at_dawn' &&
  ['worth_short_drive', 'worth_planning'].includes(travelConfidence) &&
  dayOffset <= 3
```

Days 4–10 can only send `watch_next_rain` if the user opts into long-range watch alerts. They must never send `go_at_dawn` or `worth_planning` travel language.

### 17.4 Alert copy

Copy is generated from reason codes, not LLMs.

Example:

> PM fall kings: a fresh movement window may be opening after recent rain. Fishability looks decent. Best call: dawn.

### 17.5 Anti-spam rules

- Deduplicate by `userId + riverId + runId + alertType + localDate`.
- Do not send more than one River Run alert per river/run per local day unless safety worsens.
- Safety/blowout alerts may override regular rate limits.
- If a notification is sent from a forecast day, suppress another alert until confirmed day-0 inputs materially change.

---

## 18. Future Versions (V2+)

V1 should prove the engine with one river/run and keep the math understandable. Future versions expand coverage and precision without changing the core deterministic model.

### 18.1 V1 stays simple

- One live river/run: PM fall Chinook
- Admin-entered config, not automatic river onboarding
- Overall River Run Score plus visible component scores
- Run-aware timing behavior in config, not per-river engine branches
- 10-day outlook with days 4–10 treated as watchlist
- Opt-in push alerts with conservative dedupe

### 18.2 V2+ expansion

- Additional MI rivers live in UI (Platte, Manistee, Muskegon, etc.)
- PM fall/spring steelhead profiles live
- More species-specific timing refinements after backtesting
- Reach lag / lower-middle-upper guidance when multiple gauges or reliable lag rules exist
- Presentation recommendations
- Optional admin research notes + feedback tooling
- Config migration from TS files to DB admin UI
- More advanced alert preferences after V1 alert behavior is proven

---

## 19. Expansion Checklist

A river/run goes live when:

- [ ] USGS gauge confirmed active with ≥ 10 years daily history
- [ ] Temperature source manually approved (`same_gauge`, nearby water gauge, adjusted reference gauge, fallback, or unavailable)
- [ ] Any temperature adjustment documented with admin notes
- [ ] Baselines built and spot-checked against known high/low events
- [ ] Season, species, run window dates researched (start / peak / end)
- [ ] **Run strength (1–5)** researched for this river/species/season
- [ ] Species/season timing behavior configured (`cooling`, `warming`, `stable_cold`, `stable_cool`, or `none`)
- [ ] Hydrology tuning set (flashy, clears fast, stain sensitivity)
- [ ] Gauge reach limitation copy written ("based on gauge X; conditions vary by reach")
- [ ] User request/vote history reviewed if this river was community-prioritized
- [ ] Scenario + outlook tests pass
- [ ] One season backtest or expert review completed
- [ ] `supportTier` set appropriately

---

## 20. Product Guardrails

- No fish-count claims
- No exact pool / GPS recommendations
- Safety language overrides excitement when flow > blown-out band
- Always include regulation reminder
- Confidence visible on every card (today and outlook)
- Outlook clearly labeled as forecast-derived
- Deterministic: same inputs → same outputs
- Run strength informs context, not live gauge data
- Temperature source quality is visible internally and reflected in confidence/copy
- Air temperature is not used by River Run
- Push notifications are opt-in, deduped, and conservative
- Gauge limitation copy included in score payloads

---

## 21. Agent Build Prompt

```txt
Build FinFindr River Run V1 as a deterministic, config-driven engine.

Start with Pere Marquette fall Chinook only. USGS gauge 04122500.
Auto-build historical flow + gage-height percentile baselines.
Reuse Open-Meteo for weather at river mouth.
Require an admin-approved measured-water source. If every configured source is
temporarily unavailable, fail temperature-dependent output closed.

Config model supports season, runStrength (1-5), and multi-run per river.
River onboarding is admin-controlled: no automatic substitute gauges or temperature sources.
V1 UI live: PM fall kings only. Navigation: river → season → run.

Score today: Overall River Run Score, Fresh Push, Fishability, Run Stage, Run Timing, Best Call, Confidence.
Include Travel Confidence, temperature source metadata, safety/regulation reminder, and gauge-basis copy.
Build 10-day outlook bundle (today confirmed + 9 forecast days).
Midnight refresh: stable until local midnight in river timezone — same contract as forecast-scores.

Outlook uses forecast weather confidently; flow is approximate on future days.
Confidence decays by day offset. source: 'confirmed' | 'forecast' on each day.
Days 1-3 can be actionable when confidence supports it; days 4-10 are watchlist only.

No LLM. No second river live until PM validates.
Shared engine: supabase/functions/_shared/riverRunEngine/
Edge function: supabase/functions/river-run/index.ts

Add opt-in push notifications with threshold triggers, quiet hours, dedupe, and anti-spam rules.
Pass all §13 test cases. Persist daily + outlook snapshots.
```

---

## 22. References

- [USGS 04122500 — Pere Marquette at Scottville](https://waterdata.usgs.gov/monitoring-location/04122500/)
- [USGS Water Data APIs](https://api.waterdata.usgs.gov/docs/)
- [Open-Meteo Forecast API](https://open-meteo.com/en/docs) (weather — already in FinFindr)
- [Michigan DNR Weekly Fishing Report](https://www.michigan.gov/dnr/things-to-do/fishing/weekly)
- FinFindr `forecast-scores` edge function + `lib/forecastScores.ts` (midnight cache pattern)
