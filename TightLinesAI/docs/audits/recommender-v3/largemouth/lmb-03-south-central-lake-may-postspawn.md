# lmb-03-south-central-lake-may-postspawn — South Central reservoir • May post-spawn • warm, light breeze

> **Intent:** Mid-May on a TX/OK reservoir (Falcon, Fork, Texoma). Post-spawn bass recovering, keying on shad spawns and bream beds. Water 72°F, partly cloudy, light wind, stable pressure. Guide read: a healthy mix — topwaters in low light, squarebills and swim jigs mid-morning, jigs and Texas-rigged worms for bigger fish. Surface open, presence can be bold.

## Setup

| Field | Value |
| --- | --- |
| Species | largemouth_bass |
| Context | freshwater_lake_pond |
| Water clarity | stained |
| Condition profile | stable_high_pressure_clear |
| Region | south_central |
| State | TX |
| Coordinates | 32.15, -95.7 |
| Date | 2026-05-14 (May) |
| Timezone | America/Chicago |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 78°F |
| Daily mean / low / high | 74°F / 64°F / 84°F |
| Prior day mean | 72°F |
| Day minus 2 mean | 72°F |
| Measured water (now/24h/72h) | 72°F / 71°F / 70°F |
| Pressure (now) | 1017.0 mb |
| Pressure trend (48h) | falling (1018.0 → 1017.8 → 1017.5 → 1017.3 → 1017.0) |
| Wind | 8 mph |
| Cloud cover | 50% |
| Precip 24h / 72h / 7d | 0.00″ / 0.10″ / 0.50″ |
| Active precip now | no |
| Sunrise / sunset | 2026-05-14T06:26:00-05:00 / 2026-05-14T20:14:00-05:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | aggressive |
| reaction_window | on |
| surface_window | rippled |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | true |
| opportunity_mix | aggressive |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | upper | mid | upper → mid |
| pace | fast | medium | fast → medium → slow |
| presence | bold | moderate | bold → moderate → subtle |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 0 |
| pace_shift | 1 |
| presence_shift | 1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "stable",
  "temperature_shock": "none",
  "pressure_regime": "falling_slow",
  "wind_condition": "moderate",
  "light_cloud_condition": "mixed",
  "precipitation_disruption": "dry_stable",
  "runoff_flow_disruption": null
}
```

### Variables triggered

- `pressure_regime`
- `wind_condition`
- `precipitation_disruption`

### Daily preference notes

- Falling pressure supports a more willing feeding window.
- Moderate chop improves fishability and supports a stronger moving look.

## Seasonal baseline (month 5)

| Field | Value |
| --- | --- |
| source region | south_central |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | crawfish |
| surface seasonally possible | false |
| monthly allowed columns | upper, mid |
| monthly column order | upper → mid |
| monthly allowed paces | slow, medium, fast |
| monthly pace order | medium → slow → fast |
| monthly allowed presence | subtle, moderate, bold |
| monthly presence order | moderate → subtle → bold |
| typical seasonal water column | high |
| typical seasonal location | shallow |

## Lures



### 1. Swim Jig — `swim_jig`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `jig` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 15.480 |
| tactical_fit | 12.000 |
| practicality_fit | 1.550 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.000 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.55,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.68,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast past targets and swim it through, reeling just fast enough to feel the head wiggle; slow down near the edge of cover and let it drop. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 2. Spinnerbait — `spinnerbait`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `spinnerbait` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.800 |
| tactical_fit | 12.000 |
| practicality_fit | 1.550 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.500 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.55,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 3. Squarebill Crankbait — `squarebill_crankbait`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `horizontal_search` |
| family_group | `crankbait` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.800 |
| tactical_fit | 12.000 |
| practicality_fit | 1.550 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.500 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.55,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Fish it with a more active cadence.

**Automated flags**

_(none)_

## Flies



### 1. Game Changer — `game_changer`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `articulated_streamer` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 15.450 |
| tactical_fit | 12.000 |
| practicality_fit | 1.550 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.000 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.55,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.65,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 2. Deceiver — `deceiver`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `baitfish_streamer` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.800 |
| tactical_fit | 12.000 |
| practicality_fit | 1.550 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.500 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 4,
    "detail": "It leads on today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.55,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Retrieve with medium-to-long pulls and let the feathers collapse and flare; pause every 3-4 strips to let the profile swell and hang for trailing fish. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 3. Clouser Minnow — `clouser_minnow`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `baitfish_streamer` |
| primary_column | mid |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.880 |
| tactical_fit | 10.500 |
| practicality_fit | 1.550 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | -0.300 |

**Score breakdown**

```json
[
  {
    "code": "strict_monthly_lane_fit",
    "value": 0.2,
    "detail": "Its lane shape stays tightly inside the monthly biological profile."
  },
  {
    "code": "column_fit",
    "value": 2.5,
    "detail": "Its secondary column overlaps today's preferred upper column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred fast pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.55,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.58,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.9,
    "detail": "Its forage profile fits the monthly biological context."
  },
  {
    "code": "clarity_fit",
    "value": 0.35,
    "detail": "Its visibility profile suits today's water clarity."
  }
]
```

**Color**

- theme: `dark`
- recommendations: `black, black/blue, black/purple`
- reason: Stained water + mixed light — dark profile still leads. _(code: `stained_mixed_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip in short, consistent pulls so the dumbbell eyes make the fly jig up and down; let it sink between strips to stay hook-point up throughout. Fish it with a more active cadence.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (3)
- [trio] lure trio: all three picks share tactical_lane=horizontal_search. Very low tactical diversity.
- [trio] fly trio: two of three picks share a family_group. Moderate diversity.
- [trio] fly trio: all three picks share tactical_lane=fly_baitfish. Very low tactical diversity.


## Auditor checklist

Work top-to-bottom. Record findings in the "Auditor notes" section below,
citing specific recommendation ids and quoted copy. Tag each finding with
`[BLOCKER]`, `[BUG]`, `[POLISH]`, or `[FYI]`.

- [ ] 1. **Day read** — do posture_band / opportunity_mix / surface_window / daily preference (column/pace/presence) match what a guide would deduce from the environment above?
- [ ] 2. **Primary forage** — does `seasonal_row.primary_forage` make biological sense for species + region + month?
- [ ] 3. **Lure selections** — are the 3 lures reasonable for this species/water/season/region? Any obvious misses or oddities?
- [ ] 4. **Fly selections** — are the 3 flies reasonable for this species/water/season/region? Any obvious misses or oddities?
- [ ] 5. **Per-rec authored dimensions** — do `primary_column`, `pace`, `presence`, `is_surface` match what this lure/fly is known for? Flag any authored ranges that look wrong.
- [ ] 6. **Why-chosen accuracy** — does each `why_chosen` cite drivers that actually match this lure + this day? Flag generic fluff, hallucinated reasons, or claims that contradict the day read.
- [ ] 7. **How-to-fish accuracy** — does each `how_to_fish` describe the CORRECT technique for this archetype, consistent with its column/pace/presence? Flag anything technically wrong.
- [ ] 8. **Trio coherence** — do the 3 lures (and 3 flies) form a sensible diverse-but-compatible set? Any pair that should not coexist given today's gates?
- [ ] 9. **Cross-check auto-flags** — for each auto-flag above, confirm or dismiss with reasoning.

## Auditor notes

_(fill in findings here — be specific, cite ids + quotes, tag severity, recommend fix with file path / function name when possible)_
