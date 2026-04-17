# pike-01-upper-midwest-lake-may-postspawn — Upper Midwest lake • May • post-spawn shallow, overcast warm

> **Intent:** Mid-May on a MN/WI pike water (Leech, Mille Lacs, Chippewa flowage). Ice-out was weeks ago; water 58°F, pike post-spawn and recovering aggressively in shallow weed flats. Overcast, moderate wind, falling pressure. Guide read: big spinnerbaits, glide baits, jerkbaits, big flies — bold presence, medium-fast pace. Mid-to-upper column dominates. Reaction window should be ON.

## Setup

| Field | Value |
| --- | --- |
| Species | pike_musky |
| Context | freshwater_lake_pond |
| Water clarity | stained |
| Condition profile | pre_front_falling_pressure |
| Region | great_lakes_upper_midwest |
| State | MN |
| Coordinates | 47.1, -94.5 |
| Date | 2026-05-18 (May) |
| Timezone | America/Chicago |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 66°F |
| Daily mean / low / high | 62°F / 48°F / 74°F |
| Prior day mean | 60°F |
| Day minus 2 mean | 56°F |
| Measured water (now/24h/72h) | 58°F / 57°F / 54°F |
| Pressure (now) | 1010.0 mb |
| Pressure trend (48h) | falling strongly (1016.0 → 1014.5 → 1013.0 → 1011.5 → 1010.0) |
| Wind | 13 mph |
| Cloud cover | 85% |
| Precip 24h / 72h / 7d | 0.10″ / 0.30″ / 0.70″ |
| Active precip now | no |
| Sunrise / sunset | 2026-05-18T05:33:00-05:00 / 2026-05-18T20:43:00-05:00 |

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
| column | upper | surface | upper → surface → mid |
| pace | fast | medium | fast → medium |
| presence | bold | moderate | bold → moderate → subtle |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 1 |
| pace_shift | 1 |
| presence_shift | 1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "warming",
  "temperature_shock": "none",
  "pressure_regime": "falling_moderate",
  "wind_condition": "moderate",
  "light_cloud_condition": "low_light",
  "precipitation_disruption": "recent_rain",
  "runoff_flow_disruption": null
}
```

### Variables triggered

- `temperature_trend`
- `pressure_regime`
- `light_cloud_condition`
- `wind_condition`
- `precipitation_disruption`

### Daily preference notes

- A warming trend nudges fish slightly higher in the allowed range.
- Falling pressure supports a more willing feeding window.
- Lower light supports a slightly higher, more open lane.
- Moderate chop improves fishability and supports a stronger moving look.

## Seasonal baseline (month 5)

| Field | Value |
| --- | --- |
| source region | great_lakes_upper_midwest |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | bluegill_perch |
| surface seasonally possible | true |
| monthly allowed columns | surface, upper, mid |
| monthly column order | surface → upper → mid |
| monthly allowed paces | medium, fast |
| monthly pace order | medium → fast |
| monthly allowed presence | subtle, moderate, bold |
| monthly presence order | moderate → subtle → bold |
| typical seasonal water column | top |
| typical seasonal location | shallow |

## Lures



### 1. Spinnerbait — `spinnerbait`  _(best_match)_

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

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it parallel to grass lines or over submerged timber; slow the retrieve near the target and let the head tick the top. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 2. Large Paddle-Tail Swimbait — `large_profile_pike_swimbait`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `pike_big_profile` |
| family_group | `pike_swimbait` |
| primary_column | upper |
| pace | fast |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.790 |
| tactical_fit | 12.000 |
| practicality_fit | 0.850 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.350 |

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
    "value": 0.85,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.69,
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

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with long, deliberate sweeps that make the body undulate; pause at the end of each sweep and hold position so following pike can close. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 3. Hollow-Body Frog — `hollow_body_frog`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `cover_weedless` |
| family_group | `frog` |
| primary_column | surface |
| pace | medium |
| presence | moderate |
| is_surface | true |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.050 |
| tactical_fit | 10.500 |
| practicality_fit | 2.300 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.700 |

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
    "value": 2.3,
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

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. Hollow-Body Frog stays in play when bluegill_perch is relevant. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Twitch it just enough to make the legs kick; pause over every opening in the cover and count to three before moving — strikes on mats come after the pause. Fish it with a more active cadence.

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
| score | 14.800 |
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

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. The month is still baitfish-forward, and this stays inside that search lane.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 2. Articulated Pike Streamer — `large_articulated_pike_streamer`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `pike_big_profile` |
| family_group | `pike_streamer` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.790 |
| tactical_fit | 12.000 |
| practicality_fit | 0.850 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.200 |

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
    "value": 0.85,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.69,
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

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. Falling pressure supports a more willing feeding window. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It gives you a different pike big profile look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Retrieve with slow, arm-length strips and complete stops; pike follow and commit on the pause, so hold the deadstop for a count of two. Fish it with a more active cadence.

**Automated flags**

_(none)_

### 3. Mouse Fly — `mouse_fly`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_surface` |
| family_group | `surface_fly` |
| primary_column | surface |
| pace | fast |
| presence | subtle |
| is_surface | true |

**Scoring**

| Field | Value |
| --- | --- |
| score | 12.550 |
| tactical_fit | 9.000 |
| practicality_fit | 2.300 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.950 |

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
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred bold presence."
  },
  {
    "code": "practicality_fit",
    "value": 2.3,
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

- theme: `bright`
- recommendations: `white/chartreuse, chartreuse, firetiger`
- reason: Stained water + low light — bright/chartreuse stands out. _(code: `stained_low_bright`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. The monthly surface window is still alive today, even with a little ripple on top. The month is still baitfish-forward, and this stays inside that search lane. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Swim it on a constant slow retrieve just fast enough to leave a wake; target near-shore edges and structure where big fish expect food to cross. Fish it with a more active cadence.

**Automated flags**

_(none)_

## Automated flags summary

_(none)_

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
