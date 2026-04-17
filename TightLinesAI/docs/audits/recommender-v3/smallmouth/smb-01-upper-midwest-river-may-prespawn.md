# smb-01-upper-midwest-river-may-prespawn — Upper Midwest river • May pre-spawn • warming trend

> **Intent:** Mid-May on a WI/MN smallmouth river. Water temps climbing into the low-60s, fish staging pre-spawn. Stable pressure, partly cloudy, light wind. Guide read: mid-column reaction or bottom-oriented crayfish presentations, moderate pace, moderate presence. Surface should not be the top pick yet.

## Setup

| Field | Value |
| --- | --- |
| Species | smallmouth_bass |
| Context | freshwater_river |
| Water clarity | clear |
| Condition profile | spring_spawn_warming |
| Region | great_lakes_upper_midwest |
| State | WI |
| Coordinates | 44.65, -90.85 |
| Date | 2026-05-12 (May) |
| Timezone | America/Chicago |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 64°F |
| Daily mean / low / high | 60°F / 48°F / 72°F |
| Prior day mean | 58°F |
| Day minus 2 mean | 55°F |
| Measured water (now/24h/72h) | 61°F / 60°F / 57°F |
| Pressure (now) | 1018.0 mb |
| Pressure trend (48h) | rising (1017.0 → 1017.3 → 1017.5 → 1017.8 → 1018.0) |
| Wind | 7 mph |
| Cloud cover | 45% |
| Precip 24h / 72h / 7d | 0.00″ / 0.10″ / 0.40″ |
| Active precip now | no |
| Sunrise / sunset | 2026-05-12T05:42:00-05:00 / 2026-05-12T20:15:00-05:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | aggressive |
| reaction_window | watch |
| surface_window | rippled |
| surface_allowed_today | true |
| suppress_fast_presentations | false |
| high_visibility_needed | false |
| opportunity_mix | aggressive |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | upper | mid | upper → mid |
| pace | medium | slow | medium → slow → fast |
| presence | subtle | moderate | subtle → moderate → bold |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | 1 |
| pace_shift | 0 |
| presence_shift | -1 |

### Normalized states

```json
{
  "temperature_metabolic_context": "neutral",
  "temperature_trend": "warming",
  "temperature_shock": "none",
  "pressure_regime": "rising_slow",
  "wind_condition": "light",
  "light_cloud_condition": "mixed",
  "precipitation_disruption": null,
  "runoff_flow_disruption": "stable"
}
```

### Variables triggered

- `temperature_trend`
- `runoff_flow_disruption`

### Daily preference notes

- A warming trend nudges fish slightly higher in the allowed range.

## Seasonal baseline (month 5)

| Field | Value |
| --- | --- |
| source region | great_lakes_upper_midwest |
| region fallback used | false |
| state-scoped row | false |
| primary forage | crawfish |
| secondary forage | baitfish |
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



### 1. Tube Jig — `tube_jig`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `bottom_contact` |
| family_group | `tube` |
| primary_column | upper |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.790 |
| tactical_fit | 12.000 |
| practicality_fit | -0.150 |
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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": -0.15,
    "detail": "Its practicality holds up in river conditions."
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Snap the tube off bottom with short pops so it spirals on the fall, then let it glide back down on slack or semi-slack line. Keep it high in the zone.

**Automated flags**

_(none)_

### 2. Squarebill Crankbait — `squarebill_crankbait`  _(strong_alternate)_

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
| score | 12.200 |
| tactical_fit | 10.500 |
| practicality_fit | 0.450 |
| forage_fit | 0.900 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.450 |

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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It gives you a different horizontal search look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast past structure and crank it down, then steer it right into cover; the deflection is the trigger, so don't try to avoid contact. Keep it high in the zone.

**Automated flags**

_(none)_

### 3. Suspending Jerkbait — `suspending_jerkbait`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `reaction_mid_column` |
| family_group | `jerkbait` |
| primary_column | upper |
| pace | fast |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 13.250 |
| tactical_fit | 12.000 |
| practicality_fit | 0.450 |
| forage_fit | 0.450 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.100 |

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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.45,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Work it with wrist snaps, not big sweeps; keep slack in the line between snaps so the bait swings freely, then pause until you see a follow or feel weight. Keep it high in the zone.

**Automated flags**

_(none)_

## Flies



### 1. Zonker Streamer — `zonker_streamer`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_baitfish` |
| family_group | `bugger_leech` |
| primary_column | upper |
| pace | medium |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 11.750 |
| tactical_fit | 10.500 |
| practicality_fit | 0.450 |
| forage_fit | 0.450 |
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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.45,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It stays high enough in the zone to match the day's more open positioning.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip with a mixed pace — a few short darts, then a longer glide; the rabbit wing wraps on fast strips and flares on the pause for a big profile change. Keep it high in the zone.

**Automated flags**

_(none)_

### 2. Game Changer — `game_changer`  _(strong_alternate)_

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
| score | 11.150 |
| tactical_fit | 10.500 |
| practicality_fit | -0.150 |
| forage_fit | 0.450 |
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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": -0.15,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.45,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A warming trend nudges fish slightly higher in the allowed range. It stays high enough in the zone to match the day's more open positioning. It rounds out the lineup with a different look. It gives you a different fly baitfish look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Strip with alternating long and short pulls so the articulated body undulates differently each time; kill the retrieve if you see a fish following and let it sink. Keep it high in the zone.

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
| score | 10.840 |
| tactical_fit | 9.000 |
| practicality_fit | 0.450 |
| forage_fit | 0.450 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.700 |

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
    "detail": "It leads on today's preferred medium pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 0.45,
    "detail": "Its practicality holds up in river conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.59,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.45,
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

- theme: `natural`
- recommendations: `green pumpkin, olive, smoke`
- reason: Clear water + mixed light — stay natural. _(code: `clear_mixed_natural`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. It stays practical in current seams and river lanes when flow still matters. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast and let the weighted eyes sink the fly, then retrieve with a strip-pause cadence that makes it dart upward on the strip and dive back on the pause.

**Automated flags**

_(none)_

## Automated flags summary

### FYI (2)
- [trio] lure trio: pick 3 (suspending_jerkbait, score=13.250) has a higher raw score than pick 2 (squarebill_crankbait, score=12.200). This is expected under per-slot diversity_bonus reordering in topThreeSelection.ts and is not by itself a bug.
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
