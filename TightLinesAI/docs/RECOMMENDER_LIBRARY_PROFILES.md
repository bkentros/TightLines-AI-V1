# Recommender Library Profiles

This document is the lightweight reference for the deterministic lure/fly recommender.

## Decision Order

The engine should stay simple and auditable:

1. `seasonal baseline`
2. `daily adjustments`
3. `water clarity`
4. `family ranking`
5. `best method selection`

Seasonal context owns the main fish-state read: likely holding lane, water-column bias, activity ceiling, strike-zone width, and primary presentation posture. Daily conditions can tighten or loosen that read. Water clarity shapes profile, visibility, vibration, and finesse-vs-loud lean.

## Family Profile Schema

Each family profile is intentionally compact. The live scoring uses:

- supported water types
- strongest month groups
- depth-lane fit
- activity fit
- clarity fit
- forage/profile bias
- presentation archetype fit
- de-prioritizing conditions
- `1-3` canonical methods

The recommender does not pick a SKU. It picks a `family + best starting method`.

## Profiling Basis

Each family and method is profiled from simple fishing mechanics, not from brand-specific data:

- what part of the water column it naturally covers
- whether it is best for bottom contact, suspend/pause, horizontal search, surface, or drift
- whether it is subtle, natural, loud, bulky, or high-visibility
- whether it performs best when fish are inactive, neutral, active, or aggressive
- whether it is strongest in clear, stained, or dirty water

## Lure Families

### Freshwater

- `soft_stick_worm`
  profile basis: shallow cover finesse, natural fall, narrow-to-moderate strike zone
  methods: `weightless_fall`, `wacky_skip_pause`
- `finesse_worm`
  profile basis: slow bottom or hover finesse for tight fish
  methods: `shaky_head_drag`, `drop_shot_hover`
- `jig_trailer`
  profile basis: bottom-contact, cover-oriented, all-clarity workhorse
  methods: `crawl_hop_bottom`, `flip_pitch_pause`
- `paddle_tail_swimbait`
  profile basis: baitfish search, horizontal swim, edge and lane coverage
  methods: `jighead_swim`, `weedless_edge_swim`
- `spinnerbait`
  profile basis: stained-to-dirty water flash and vibration search bait
  methods: `slow_roll_cover`, `cover_bump_search`
- `chatterbait`
  profile basis: loud grass-edge or shallow search bait with vibration
  methods: `grass_rip_swim`, `steady_pulse_search`
- `jerkbait`
  profile basis: suspend/pause baitfish tool for cooler or pause-oriented windows
  methods: `suspend_twitch_pause`, `snap_pause_search`
- `topwater_walker_popper`
  profile basis: low-light surface commotion and silhouette
  methods: `walk_pause_surface`, `pop_pause_surface`
- `frog_toad`
  profile basis: shallow vegetation or cover topwater
  methods: `hollow_body_pause`, `steady_toad_swim`
- `crankbait_shallow_mid`
  profile basis: active fish on horizontal hard-edge search
  methods: `squarebill_deflect`, `steady_mid_crank`

### Coastal / Flats

- `shrimp_imitation`
  profile basis: year-round crustacean match for drains, edges, and lower lanes
  methods: `subtle_hop_fall`, `short_twitch_pause`
- `jighead_minnow`
  profile basis: baitfish lane coverage on channels, points, drains, and open flats
  methods: `steady_jighead_swim`, `glide_pause_swim`
- `popping_cork_trailer`
  profile basis: stained/dirty shallow-water commotion plus suspended trailer
  methods: `pop_pause_trailer`, `search_cork_rhythm`
- `weighted_bottom_presentation`
  profile basis: slow lower-lane presentation for neutral fish and stronger movement
  methods: `bottom_drag`, `bottom_hop`

## Fly Families

### Freshwater

- `weighted_streamer`
  profile basis: deeper streamer lane, seam/suspend use, sink then move
  methods: `sink_strip_pause`, `swing_current_edge`
- `woolly_bugger_leech`
  profile basis: all-season versatile search/drift fly across multiple lanes
  methods: `dead_drift_swing`, `short_strip_search`
- `nymph_rig`
  profile basis: lower-lane insect drift for neutral or inactive fish
  methods: `dead_drift_bottom`, `tight_line_nymph`
- `dry_emerger`
  profile basis: fish-looking-up windows with natural surface/film drift
  methods: `clean_dead_drift`, `emerger_pause_lift`
- `terrestrial_hopper`
  profile basis: summer bank and edge opportunism with long pauses
  methods: `bank_dead_drift`, `twitch_rest_bank`

### Coastal / Flats

- `baitfish_streamer`
  profile basis: baitfish forage periods, cruising fish, horizontal strip search
  methods: `slow_strip_pause`, `medium_strip_search`
- `popper_surface_bug`
  profile basis: surface commotion in low-light shallow windows
  methods: `pop_pause_bug`, `slide_pause_bug`
- `shrimp_fly`
  profile basis: subtle crustacean presentation for flats and moving-water lanes
  methods: `short_strip_pause`, `settle_twitch`
- `crab_fly`
  profile basis: precise bottom presentation for flats fish on potholes, troughs, and oyster-related lanes
  methods: `dead_stick_drop`, `tiny_hop_crab`

## Validation Notes

- Manual input is `water_clarity` only.
- Habitat tags are no longer active user inputs or active scoring inputs.
- The audit matrix should check both `top family` and `top method`.
- Accuracy should be tracked as scenario-matrix pass rate, not as a claim of perfect universal certainty.
