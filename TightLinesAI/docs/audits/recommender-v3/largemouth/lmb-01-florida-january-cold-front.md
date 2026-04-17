# lmb-01-florida-january-cold-front — Florida lake • January • post-cold-front, bed edge

> **Intent:** Mid-January on Lake Okeechobee or similar FL largemouth water. Air cooled into the 50s after a front, water 58°F — cold for FL bass. Bluebird high pressure, clear. Guide read: SLOW + SUBTLE presentations; flipping soft plastics in cover, shaky head, lipless with long pauses. Surface should close; reaction baits demoted. Opportunity mix should trend conservative.

## Setup

| Field | Value |
| --- | --- |
| Species | largemouth_bass |
| Context | freshwater_lake_pond |
| Water clarity | stained |
| Condition profile | post_front_bluebird |
| Region | florida |
| State | FL |
| Coordinates | 26.95, -80.88 |
| Date | 2026-01-16 (January) |
| Timezone | America/New_York |

## Environmental snapshot

| Variable | Value |
| --- | --- |
| Current air | 56°F |
| Daily mean / low / high | 54°F / 42°F / 66°F |
| Prior day mean | 60°F |
| Day minus 2 mean | 68°F |
| Measured water (now/24h/72h) | 58°F / 60°F / 64°F |
| Pressure (now) | 1028.0 mb |
| Pressure trend (48h) | rising strongly (1012.0 → 1016.0 → 1020.0 → 1024.0 → 1028.0) |
| Wind | 4 mph |
| Cloud cover | 10% |
| Precip 24h / 72h / 7d | 0.00″ / 0.30″ / 0.50″ |
| Active precip now | no |
| Sunrise / sunset | 2026-01-16T07:13:00-05:00 / 2026-01-16T17:47:00-05:00 |

## Resolved daily read

### Posture & windows

| Field | Value |
| --- | --- |
| posture_band | suppressed |
| reaction_window | off |
| surface_window | closed |
| surface_allowed_today | false |
| suppress_fast_presentations | true |
| high_visibility_needed | false |
| opportunity_mix | conservative |

### Daily tactical preference

| Dimension | Primary | Secondary | Order |
| --- | --- | --- | --- |
| column | bottom | mid | bottom → mid |
| pace | slow | medium | slow → medium |
| presence | subtle | moderate | subtle → moderate |

### Shifts applied to monthly baseline

| Shift | Value |
| --- | --- |
| column_shift | -1 |
| pace_shift | -1 |
| presence_shift | 0 |

### Normalized states

```json
{
  "temperature_metabolic_context": "cold_limited",
  "temperature_trend": "cooling",
  "temperature_shock": "none",
  "pressure_regime": "volatile",
  "wind_condition": "light",
  "light_cloud_condition": "bright",
  "precipitation_disruption": "dry_stable",
  "runoff_flow_disruption": null
}
```

### Variables triggered

- `temperature_metabolic_context`
- `temperature_trend`
- `pressure_regime`
- `light_cloud_condition`
- `precipitation_disruption`

### Daily preference notes

- Cold metabolism shuts down activity. Slow and low is the only play.
- A cooling trend tightens fish and shifts preference lower and slower.
- Rising or volatile pressure tightens the daily window.
- Bright light trims the day back toward cleaner looks.

## Seasonal baseline (month 1)

| Field | Value |
| --- | --- |
| source region | florida |
| region fallback used | false |
| state-scoped row | false |
| primary forage | baitfish |
| secondary forage | crawfish |
| surface seasonally possible | false |
| monthly allowed columns | mid, bottom |
| monthly column order | bottom → mid |
| monthly allowed paces | slow, medium |
| monthly pace order | slow → medium |
| monthly allowed presence | subtle, moderate |
| monthly presence order | subtle → moderate |
| typical seasonal water column | mid_low |
| typical seasonal location | mid_deep |

## Lures



### 1. Shaky-Head Worm — `shaky_head_worm`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `bottom_contact` |
| family_group | `worm` |
| primary_column | mid |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.750 |
| tactical_fit | 12.000 |
| practicality_fit | 2.400 |
| forage_fit | 0.000 |
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
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 2.4,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0,
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
- reason: Stained water + bright sun — a dark silhouette pops. _(code: `stained_bright_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold.

**How to fish** _(verbatim — audit for technique correctness)_

> Cast and let it fall to bottom, then drag very slowly with the rod held low; shake the tip just enough to quiver the tail without lifting the head. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 2. Football Jig — `football_jig`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `bottom_contact` |
| family_group | `jig` |
| primary_column | mid |
| pace | slow |
| presence | moderate |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 12.400 |
| tactical_fit | 10.500 |
| practicality_fit | 1.300 |
| forage_fit | 0.250 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.600 |

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
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 2.5,
    "detail": "Its secondary presence overlaps today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.3,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.25,
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
- reason: Stained water + bright sun — a dark silhouette pops. _(code: `stained_bright_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It gives you a different bottom contact look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Drag it along hard bottom and ledges so the flat head kicks and rocks; lift only slightly on the pull so the trailer stays near the substrate. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 3. Texas-Rigged Soft-Plastic Craw — `texas_rigged_soft_plastic_craw`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | lure |
| tactical_lane | `cover_weedless` |
| family_group | `soft_craw` |
| primary_column | bottom |
| pace | medium |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 12.180 |
| tactical_fit | 12.000 |
| practicality_fit | -1.100 |
| forage_fit | 0.250 |
| clarity_fit | 0.350 |
| diversity_bonus | 1.550 |

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
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": -1.1,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.68,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.25,
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
- reason: Stained water + bright sun — a dark silhouette pops. _(code: `stained_bright_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. Cold metabolism shuts down activity. Slow and low is the only play. It is one of the lead monthly looks for this exact seasonal window. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Flip or pitch into cover, let the craw fall straight on semi-slack line, then hop it once or twice before the next pitch. Slow down and lengthen the pause.

**Automated flags**

_(none)_

## Flies



### 1. Woolly Bugger — `woolly_bugger`  _(best_match)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_bottom` |
| family_group | `bugger_leech` |
| primary_column | mid |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 15.050 |
| tactical_fit | 12.000 |
| practicality_fit | 1.500 |
| forage_fit | 0.550 |
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
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.5,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0.65,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.55,
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
- reason: Stained water + bright sun — a dark silhouette pops. _(code: `stained_bright_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> This is today's top overall read. It matches the column/pace the conditions push toward today. With the highest lane shut down, this keeps you just under the cleaner active zone. It is one of the lead monthly looks for this exact seasonal window.

**How to fish** _(verbatim — audit for technique correctness)_

> Let it sink to depth then retrieve with slow hand-twists or short strips; the marabou tail breathes best with long pauses at the end of each pull. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 2. Rabbit-Strip Leech — `rabbit_strip_leech`  _(strong_alternate)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_bottom` |
| family_group | `bugger_leech` |
| primary_column | bottom |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.400 |
| tactical_fit | 12.000 |
| practicality_fit | 1.500 |
| forage_fit | 0.550 |
| clarity_fit | 0.350 |
| diversity_bonus | -1.100 |

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
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.5,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.55,
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
- reason: Stained water + bright sun — a dark silhouette pops. _(code: `stained_bright_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Behind today's lead look, this stays inside the day's window. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It stays low in the zone where this day still wants fish to hold. It gives you a different fly bottom look without leaving today's window.

**How to fish** _(verbatim — audit for technique correctness)_

> Let it sink to the strike zone then retrieve with long, slow strips; the rabbit hair undulates seductively between pulls, so don't rush the retrieve. Slow down and lengthen the pause.

**Automated flags**

_(none)_

### 3. Sculpin Streamer — `sculpin_streamer`  _(change_up)_

**Authored profile**

| Field | Value |
| --- | --- |
| gear_mode | fly |
| tactical_lane | `fly_bottom` |
| family_group | `bottom_streamer` |
| primary_column | bottom |
| pace | slow |
| presence | subtle |
| is_surface | false |

**Scoring**

| Field | Value |
| --- | --- |
| score | 14.400 |
| tactical_fit | 12.000 |
| practicality_fit | 1.500 |
| forage_fit | 0.550 |
| clarity_fit | 0.350 |
| diversity_bonus | 0.250 |

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
    "detail": "It leads on today's preferred bottom column."
  },
  {
    "code": "pace_fit",
    "value": 4,
    "detail": "It leads on today's preferred slow pace."
  },
  {
    "code": "presence_fit",
    "value": 4,
    "detail": "It leads on today's preferred subtle presence."
  },
  {
    "code": "practicality_fit",
    "value": 1.5,
    "detail": "Its day-level practicality stays clean for today's conditions."
  },
  {
    "code": "monthly_primary_fit",
    "value": 0,
    "detail": "It sits inside the strongest monthly archetype lane for this window."
  },
  {
    "code": "forage_fit",
    "value": 0.55,
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
- reason: Stained water + bright sun — a dark silhouette pops. _(code: `stained_bright_dark`)_

**Why chosen** _(verbatim — audit for accuracy)_

> Rounding out the trio as a change-up angle. It matches the column/pace the conditions push toward today. A cooling trend tightens fish and shifts preference lower and slower. It stays low in the zone where this day still wants fish to hold. It rounds out the lineup with a different look. It is the cleaner change-up if the lead look does not convert.

**How to fish** _(verbatim — audit for technique correctness)_

> Bump bottom with short strips and let the fly tick along rocks; keep tension so you feel every stop against structure. Slow down and lengthen the pause.

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
