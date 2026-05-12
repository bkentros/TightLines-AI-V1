# FinFindr SMB Daily-Picks Archive Audit
Generated: 2026-05-12T02:37:37.614Z

## Scope Summary

| Metric | Value |
| --- | --- |
| Archived weather scenarios | 51 |
| Expanded recommendation runs | 612 |
| Months | Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec |
| Regions | 7 |
| Fisheries | 12 |
| Water types | freshwater_lake_pond, freshwater_river |
| Clarity split | clear:204, stained:204, dirty:204 |
| Goal split | all_purpose:306, big_fish:306 |
| Skipped weather scenarios | 0 |
| JSONL output | /Users/brandonkentros/TightLines AI V1/TightLinesAI/scripts/audit/daily-picks-archive-audit.smb.jsonl |

## Condition Bucket Coverage

| Bucket | Expanded runs |
| --- | --- |
| calm_low_light_surface | 36 |
| calm_bright_clear_subtle | 20 |
| breezy_windy_stained_reaction | 116 |
| dirty_vibration | 136 |
| cold_slow_or_front | 300 |
| warming_search | 156 |
| heat_limited_finesse | 12 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 132 |
| river_elevated_runoff_current | 60 |
| medium_confidence_archive | 612 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 2 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Table Rock / Ozark clear reservoir<br>2025-10-19 -> 2025-10-20 | changed | 1.6 | 9.0 | dirty_vibration|cold_slow -> wind_reaction|dirty_vibration |
| Mille Lacs / Upper Midwest natural lake<br>2025-09-20 -> 2025-09-21 | changed | 2.9 | 1.1 | wind_reaction|dirty_vibration -> calm_surface |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 18 | WIND_NOT_ELEVATING_REACTION (15), BIG_FISH_NOT_FAVORING_UPSIDE (5), COLD_CLEAR_TOO_FAST (1) |
| calm_bright_clear_subtle | 1 | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (1) |
| calm_low_light_surface | 3 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3) |
| cold_slow_or_front | 50 | WIND_NOT_ELEVATING_REACTION (27), BIG_FISH_NOT_FAVORING_UPSIDE (22), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (6), COLD_CLEAR_TOO_FAST (3), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2) |
| dirty_vibration | 25 | WIND_NOT_ELEVATING_REACTION (14), BIG_FISH_NOT_FAVORING_UPSIDE (6), DIRTY_WIND_NOT_ELEVATING_VIBRATION (3), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2), COLD_CLEAR_TOO_FAST (2) |
| medium_confidence_archive | 112 | WIND_NOT_ELEVATING_REACTION (86), BIG_FISH_NOT_FAVORING_UPSIDE (34), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (12), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (5), COLD_CLEAR_TOO_FAST (3) |
| river_elevated_runoff_current | 13 | BIG_FISH_NOT_FAVORING_UPSIDE (5), WIND_NOT_ELEVATING_REACTION (5), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| stable_pleasant_medium_confidence_archive | 37 | WIND_NOT_ELEVATING_REACTION (39), BIG_FISH_NOT_FAVORING_UPSIDE (4), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (4), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (1) |
| warming_search | 19 | WIND_NOT_ELEVATING_REACTION (13), BIG_FISH_NOT_FAVORING_UPSIDE (8), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (2) |

- WIND_NOT_ELEVATING_REACTION: 86
- BIG_FISH_NOT_FAVORING_UPSIDE: 34
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 12
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 5
- COLD_CLEAR_TOO_FAST: 3
- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 3

- co_pueblo_smb__2025-08-12__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Medium-Diving Crankbait (lure); Unweighted Baitfish Streamer (fly); Deceiver (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Ned Rig (lure); Finesse Jig (lure); Feather Jig Leech (fly); Game Changer (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Suspending Jerkbait (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Spinnerbait (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Tube Jig (lure); Inline Spinner (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Spinnerbait (lure); Bladed Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Smallmouth Tube (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- co_pueblo_smb__2025-04-23__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Big Smallmouth Tube (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__dirty__all_purpose__B: COLD_CLEAR_TOO_FAST, ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Squarebill Crankbait (lure); Buzzbait (lure); Foam Gurgler (fly); Zonker Streamer (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Glide Bait (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Walking Topwater (lure); Compact Glide Bait (lure); Articulated Baitfish Streamer (fly); Deer Hair Slider (fly)
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__dirty__big_fish__A: DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION. Picks: Wake Bait (lure); Compact Glide Bait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-06-17__freshwater_river__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Walking Topwater (lure); Big Smallmouth Tube (lure); Sculpzilla (fly); Deer Hair Slider (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Smallmouth Tube (lure); Compact Glide Bait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Medium-Diving Crankbait (lure); Inline Spinner (lure); Baitfish Slider Fly (fly); Zonker Streamer (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Glide Bait (lure); Big Smallmouth Tube (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Smallmouth Tube (lure); Compact Glide Bait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Glide Bait (lure); Big Smallmouth Tube (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_smb__2025-08-14__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Carolina-Rigged Stick Worm (lure); Soft Plastic Jerkbait (lure); Zonker Streamer (fly); Game Changer (fly)
- vt_champlain_smb__2025-08-14__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Medium-Diving Crankbait (lure); Suspending Jerkbait (lure); Unweighted Baitfish Streamer (fly); Baitfish Slider Fly (fly)
- co_pueblo_smb__2025-08-12__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Soft Plastic Jerkbait (lure); Tube Jig (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-09-20__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Glide Bait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Tube Jig (lure); Drop-Shot Minnow (lure); Zonker Streamer (fly); Warmwater Crawfish Fly (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Big Smallmouth Tube (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Compact Glide Bait (lure); Football Jig (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- co_pueblo_smb__2025-10-05__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Tube Jig (lure); Drop-Shot Minnow (lure); Warmwater Crawfish Fly (fly); Baitfish Slider Fly (fly)
- co_pueblo_smb__2025-10-05__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Glide Bait (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- co_pueblo_smb__2025-10-05__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Big Smallmouth Tube (lure); Football Jig (lure); Zonker Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Spinnerbait (lure); Bladed Jig (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Carolina-Rigged Stick Worm (lure); Tube Jig (lure); Lead-Eye Leech (fly); Zonker Streamer (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Blade Bait (lure); Inline Spinner (lure); Clouser Minnow (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Spinnerbait (lure); Bladed Jig (lure); Articulated Dungeon Streamer (fly); Deceiver (fly)
- mo_table_rock__2025-02-20__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Tube Jig (lure); Texas-Rigged Soft-Plastic Craw (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_table_rock__2025-02-20__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Carolina-Rigged Stick Worm (lure); Texas-Rigged Soft-Plastic Craw (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_table_rock__2025-02-20__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Tube Jig (lure); Ned Rig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Tube Jig (lure); Blade Bait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Clouser Minnow (fly); Jighead Marabou Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Big Smallmouth Tube (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Lipless Crankbait (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Texas-Rigged Soft-Plastic Craw (lure); Tube Jig (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Tube Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Inline Spinner (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Big Smallmouth Tube (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Zonker Streamer (fly); Game Changer (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-04-04__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Drop-Shot Minnow (lure); Hair Jig (lure); Crawfish Streamer (fly); Articulated Dungeon Streamer (fly)
- wv_new_river_smb__2025-04-04__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Bladed Jig (lure); Spinnerbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mo_current_river__2025-04-05__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mo_current_river__2025-04-05__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Bladed Jig (lure); Spinnerbait (lure); Sculpzilla (fly); Game Changer (fly)
- mo_current_river__2025-04-05__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Bladed Jig (lure); Squarebill Crankbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wi_door_county__2025-04-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Smallmouth Tube (lure); Magnum Jerkbait (lure); Baitfish Slider Fly (fly); Game Changer (fly)
- wi_door_county__2025-04-18__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Big Smallmouth Tube (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- wi_door_county__2025-04-18__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Zonker Streamer (fly); Articulated Baitfish Streamer (fly)
- wi_door_county__2025-04-18__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Big Smallmouth Tube (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- co_pueblo_smb__2025-04-23__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Big Smallmouth Tube (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mo_current_river__2025-05-06__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Muddler Minnow (fly); Game Changer (fly)
- mo_current_river__2025-05-06__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Sculpzilla (fly); Game Changer (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 68
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 8
- ADJACENT_DAY_EXACT_REPEAT: 1

- mo_current_river__2025-05-06__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Ned Rig (lure); Sculpin Streamer (fly); Rabbit-Strip Leech (fly)
- co_yampa__2025-05-19__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Tube Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Lipless Crankbait (lure); Zonker Streamer (fly); Game Changer (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Tube Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Inline Spinner (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Game Changer (fly)
- wv_new_river_smb__2025-04-04__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mo_current_river__2025-04-05__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Texas-Rigged Soft-Plastic Craw (lure); Sculpin Streamer (fly); Clouser Minnow (fly)
- mo_current_river__2025-04-05__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Squarebill Crankbait (lure); Clouser Minnow (fly); Muddler Minnow (fly)
- mo_current_river__2025-04-05__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Squarebill Crankbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wi_door_county__2025-04-18__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- wi_door_county__2025-04-18__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Game Changer (fly)
- co_pueblo_smb__2025-04-23__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Paddle-Tail Swimbait (lure); Baitfish Slider Fly (fly); Deceiver (fly)
- co_pueblo_smb__2025-04-23__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Squarebill Crankbait (lure); Deceiver (fly); Feather Jig Leech (fly)
- mo_table_rock__2025-04-24__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Feather Jig Leech (fly)
- mo_table_rock__2025-04-24__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Paddle-Tail Swimbait (lure); Game Changer (fly); Feather Jig Leech (fly)
- vt_champlain_smb__2025-04-27__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Bladed Jig (lure); Zonker Streamer (fly); Woolly Bugger (fly)
- vt_champlain_smb__2025-04-27__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Big Smallmouth Tube (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_smb__2025-04-27__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Woolly Bugger (fly)
- mo_current_river__2025-05-06__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Texas-Rigged Soft-Plastic Craw (lure); Ned Rig (lure); Sculpin Streamer (fly); Slim Baitfish Streamer (fly)
- mo_current_river__2025-05-06__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Blade Bait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Sculpin Streamer (fly); Baitfish Slider Fly (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Medium-Diving Crankbait (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Spinnerbait (lure); Muddler Minnow (fly); Bucktail Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Magnum Jerkbait (lure); Game Changer (fly); Sculpzilla (fly)
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Buzzbait (lure); Foam Gurgler (fly); Zonker Streamer (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Zonker Streamer (fly); Unweighted Baitfish Streamer (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- co_yampa__2025-05-19__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Finesse Jig (lure); Sculpin Streamer (fly); Jighead Marabou Leech (fly)
- co_yampa__2025-05-19__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Sculpin Streamer (fly)
- co_yampa__2025-05-19__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Magnum Jerkbait (lure); Bladed Jig (lure); Bucktail Streamer (fly); Articulated Dungeon Streamer (fly)
- co_yampa__2025-05-19__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Squarebill Crankbait (lure); Deceiver (fly); Baitfish Slider Fly (fly)
- co_yampa__2025-05-19__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Magnum Jerkbait (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ca_trinity__2025-05-23__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Carolina-Rigged Stick Worm (lure); Clouser Minnow (fly); Unweighted Baitfish Streamer (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Warmwater Crawfish Fly (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Unweighted Baitfish Streamer (fly)
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Lipless Crankbait (lure); Zonker Streamer (fly); Foam Gurgler (fly)
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Suspending Jerkbait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Buzzbait (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Game Changer (fly)
- wv_new_river_smb__2025-06-17__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Baitfish Slider Fly (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Clouser Minnow (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Game Changer (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Compact Glide Bait (lure); Football Jig (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Unweighted Baitfish Streamer (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Clouser Minnow (fly)
- co_pueblo_smb__2025-06-22__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Warmwater Crawfish Fly (fly)
- co_pueblo_smb__2025-06-22__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Weightless Stick Worm (lure); Zonker Streamer (fly); Unweighted Baitfish Streamer (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Game Changer (fly)
- co_yampa__2025-07-12__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Medium-Diving Crankbait (lure); Baitfish Slider Fly (fly); Bucktail Streamer (fly)
- co_yampa__2025-07-12__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Suspending Jerkbait (lure); Conehead Streamer (fly); Deceiver (fly)
- vt_champlain_smb__2025-08-14__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- vt_champlain_smb__2025-08-14__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- co_pueblo_smb__2025-08-12__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Lipless Crankbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- co_pueblo_smb__2025-08-12__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs__2025-09-20__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-09-20__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Game Changer (fly)
- mo_table_rock__2025-09-13__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Big Smallmouth Tube (lure); Football Jig (lure); Game Changer (fly); Feather Jig Leech (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | great_lakes_upper_midwest | cold_slow:1 |
| Jan | northeast | warming:1 |
| Feb | south_central | warming:1, cold_slow:1 |
| Mar | appalachian | cold_slow:1 |
| Mar | great_lakes_upper_midwest | stable:1 |
| Mar | northern_california | cold_slow:1 |
| Mar | south_central | cooling_or_shock:1 |
| Apr | appalachian | warming:1 |
| Apr | great_lakes_upper_midwest | cooling_or_shock:1 |
| Apr | mountain_west | warming:1 |
| Apr | northeast | cold_slow:1 |
| Apr | south_central | cold_slow:1, warming:1 |
| May | appalachian | cold_slow:1 |
| May | great_lakes_upper_midwest | stable:2 |
| May | mountain_west | cold_slow:1 |
| May | northern_california | cooling_or_shock:1 |
| May | south_central | cold_slow:2 |
| Jun | appalachian | stable:1 |
| Jun | great_lakes_upper_midwest | cooling_or_shock:1 |
| Jun | inland_northwest | cooling_or_shock:1 |
| Jun | mountain_west | heat_limited:1 |
| Jun | northeast | stable:1 |
| Jun | south_central | stable:3 |
| Jul | great_lakes_upper_midwest | cooling_or_shock:1 |
| Jul | mountain_west | warming:1 |
| Jul | northern_california | cooling_or_shock:1 |
| Aug | great_lakes_upper_midwest | warming:1 |
| Aug | inland_northwest | cooling_or_shock:1 |
| Aug | mountain_west | cooling_or_shock:1 |
| Aug | northeast | stable:1 |
| Sep | appalachian | warming:1 |
| Sep | great_lakes_upper_midwest | stable:2, cooling_or_shock:1 |
| Sep | south_central | warming:2 |
| Oct | mountain_west | stable:1 |
| Oct | northeast | warming:1 |
| Oct | northern_california | cold_slow:1 |
| Oct | south_central | cold_slow:1, cooling_or_shock:1 |
| Nov | inland_northwest | warming:1 |
| Nov | south_central | warming:1 |
| Dec | great_lakes_upper_midwest | cold_slow:1 |
| Dec | northeast | cold_slow:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

| Scenario | Temp | Top winners needing review |
| --- | --- | --- |
| Colorado mountain-west SMB reservoir<br>2025-06-22 clear all_purpose B | 61.5-93.6F | Zonker Streamer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 clear big_fish A | 61.5-93.6F | Game Changer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 clear big_fish B | 61.5-93.6F | Flat-Sided Crankbait (medium); Deceiver (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 stained all_purpose A | 61.5-93.6F | Baitfish Slider Fly (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 stained all_purpose B | 61.5-93.6F | Inline Spinner (medium); Zonker Streamer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 stained big_fish A | 61.5-93.6F | Medium-Diving Crankbait (medium); Baitfish Slider Fly (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 stained big_fish B | 61.5-93.6F | Squarebill Crankbait (medium); Zonker Streamer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 dirty all_purpose A | 61.5-93.6F | Suspending Jerkbait (medium); Deceiver (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 dirty all_purpose B | 61.5-93.6F | Squarebill Crankbait (medium); Zonker Streamer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 dirty big_fish A | 61.5-93.6F | Medium-Diving Crankbait (medium); Baitfish Slider Fly (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 dirty big_fish B | 61.5-93.6F | Bladed Jig (medium); Deceiver (medium) |

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Aug | great_lakes_upper_midwest | open | low_light | all_purpose | 5 | 70.1-79.1F | 5.8 |
| Aug | great_lakes_upper_midwest | open | low_light | big_fish | 6 | 70.1-79.1F | 5.8 |
| Aug | inland_northwest | open | glare | all_purpose | 5 | 55.5-86.1F | 2.5 |
| Aug | inland_northwest | open | glare | big_fish | 6 | 55.5-86.1F | 2.5 |
| Jul | mountain_west | caution | bright | big_fish | 3 | 54.6-84.6F | 6.2 |
| Jul | northern_california | open | glare | all_purpose | 5 | 64.6-97.2F | 5.3 |
| Jul | northern_california | open | glare | big_fish | 6 | 64.6-97.2F | 5.3 |
| Jun | appalachian | open | low_light | big_fish | 6 | 64.2-78.3F | 6.2 |
| Jun | inland_northwest | open | low_light | all_purpose | 6 | 57.8-79.1F | 3.2 |
| Jun | inland_northwest | open | low_light | big_fish | 6 | 57.8-79.1F | 3.2 |
| Jun | northeast | open | mixed | all_purpose | 5 | 58.4-74.2F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 6 | 58.4-74.2F | 5.2 |
| Jun | south_central | open | low_light | all_purpose | 2 | 67.5-81.1F | 6.9 |
| Jun | south_central | open | low_light | big_fish | 6 | 67.5-81.1F | 6.9 |
| Jun | south_central | open | mixed | all_purpose | 4 | 65.0-82.3F | 5.7 |
| Jun | south_central | open | mixed | big_fish | 6 | 65.0-82.3F | 5.7 |
| May | south_central | open | low_light | all_purpose | 3 | 51.3-69.4F | 8.2 |
| May | south_central | open | low_light | big_fish | 6 | 51.3-69.4F | 8.2 |
| Sep | appalachian | open | low_light | all_purpose | 4 | 55.8-73.2F | 5.6 |
| Sep | appalachian | open | low_light | big_fish | 6 | 55.8-73.2F | 5.6 |
| Sep | great_lakes_upper_midwest | open | bright | all_purpose | 4 | 58.9-83.6F | 4.1 |
| Sep | great_lakes_upper_midwest | open | bright | big_fish | 5 | 58.9-83.6F | 4.1 |
| Sep | great_lakes_upper_midwest | open | mixed | all_purpose | 5 | 60.7-71.1F | 5.3 |
| Sep | great_lakes_upper_midwest | open | mixed | big_fish | 6 | 60.7-71.1F | 5.3 |

### Shoulder-Season Topwater Selections

None.

## Water Column Diversity Diagnostics

### Same-Side Surface/Surface Summary

| Side | Goal | Set | Region | Month | Clarity | Surface tags | Rows | Close non-surface alt | Credible non-surface alt |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| lure | big_fish | B | great_lakes_upper_midwest | Sep | dirty | calm_surface | 1 | 1 | 0 |

### Remaining Same-Side Surface/Surface Examples

| Scenario | Side | Selected surface pair | Close non-surface alternatives | Why left |
| --- | --- | --- | --- | --- |
| Upper Mississippi smallmouth river<br>2025-09-29 dirty big_fish B | lure | Walking Topwater (164); Buzzbait (152) | close: Medium-Diving Crankbait (mid, 146)<br>credible: none | Close alternatives lacked clear goal or daily-condition fit. |

### Same-Side Column/Band Summary

| Side | Same exact column | Same broad band | Same broad band with close different-band alt |
| --- | --- | --- | --- |
| lure | 261 | 261 | 204 |
| fly | 185 | 185 | 175 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 144 | - |
| open-surface rows with 2+ surface picks | 38 | 38 |
| open-surface rows with 3+ surface picks | 1 | 1 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 19 | 19 |
| lure surface/surface plus fly surface/upper | 0 | 0 |

### Surface/Upper Watch Examples

None.

## Pike Cold/Open Surface Diagnostics

Not applicable.

## Pike Clear/Bright Diagnostics

Not applicable.

## Pike Heat-Limited Diagnostics

Not applicable.

## Set B Diagnostics

### Set B Overlap Cause Counts

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

| Kind | Cause | Lure | Fly | Total |
| --- | --- | --- | --- | --- |
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 4 | 0 | 4 |
| same_family_same_presentation | truly_avoidable | 6 | 62 | 68 |
| same_family_same_presentation | unavoidable_due_score_band | 3 | 12 | 15 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 3 | 6 | 9 |
| same_family_same_presentation | unavoidable_due_goal_condition_fit | 0 | 7 | 7 |
| same_family_different_presentation | truly_avoidable | 0 | 8 | 8 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 8 | 8 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 1 | 1 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 1 | 1 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| New River Appalachian SMB context<br>2025-03-26 stained big_fish | fly top: same_family_different_presentation | Articulated Dungeon Streamer (156); Rabbit-Strip Leech (164) | Articulated Baitfish Streamer (140); Game Changer (134) | Muddler Minnow (162, alt edge 22) |
| Table Rock / Ozark clear reservoir<br>2025-04-24 clear big_fish | fly honorable: same_family_same_presentation | Game Changer (144); Rabbit-Strip Leech (126) | Articulated Baitfish Streamer (136); Feather Jig Leech (134) | Baitfish Slider Fly (150, alt edge 16) |
| Table Rock / Ozark clear reservoir<br>2025-04-24 stained big_fish | fly honorable: same_family_same_presentation | Articulated Baitfish Streamer (144); Rabbit-Strip Leech (134) | Game Changer (144); Feather Jig Leech (134) | Baitfish Slider Fly (150, alt edge 16) |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 dirty all_purpose | fly honorable: same_family_same_presentation | Baitfish Slider Fly (162); Deceiver (152) | Foam Gurgler (170); Zonker Streamer (144) | Warmwater Crawfish Fly (160, alt edge 16) |
| Yampa River mountain-west SMB context<br>2025-05-19 stained all_purpose | fly top: same_family_same_presentation | Bucktail Streamer (162); Conehead Streamer (162) | Deceiver (162); Sculpin Streamer (170) | Muddler Minnow (170, alt edge 8) |
| Table Rock / Ozark clear reservoir<br>2025-09-13 dirty big_fish | fly honorable: same_family_same_presentation | Articulated Baitfish Streamer (154); Rabbit-Strip Leech (134) | Game Changer (154); Feather Jig Leech (134) | Baitfish Slider Fly (140, alt edge 6) |
| Lake Champlain SMB water<br>2025-04-27 dirty all_purpose | fly top: same_family_same_presentation | Deceiver (162); Baitfish Slider Fly (152) | Zonker Streamer (154); Woolly Bugger (158) | Warmwater Crawfish Fly (160, alt edge 6) |
| New River Appalachian SMB context<br>2025-03-26 dirty big_fish | fly honorable: same_family_different_presentation | Articulated Baitfish Streamer (140); Rabbit-Strip Leech (164) | Sculpzilla (166); Articulated Dungeon Streamer (156) | Sculpin Streamer (162, alt edge 6) |
| New River Appalachian SMB context<br>2025-05-06 clear big_fish | fly honorable: same_family_different_presentation | Articulated Baitfish Streamer (136); Rabbit-Strip Leech (142) | Game Changer (144); Articulated Dungeon Streamer (144) | Baitfish Slider Fly (150, alt edge 6) |
| Trinity Lake northern California SMB water<br>2025-10-25 dirty all_purpose | fly top: same_family_same_presentation | Deceiver (162); Baitfish Slider Fly (152) | Zonker Streamer (154); Warmwater Crawfish Fly (160) | Woolly Bugger (158, alt edge 4) |
| Yampa River mountain-west SMB context<br>2025-05-19 clear big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (154); Rabbit-Strip Leech (142) | Game Changer (154); Articulated Baitfish Streamer (146) | Bucktail Streamer (150, alt edge 4) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 dirty all_purpose | fly top: same_family_same_presentation | Deceiver (152); Baitfish Slider Fly (162) | Zonker Streamer (144); Unweighted Baitfish Streamer (138) | Clouser Minnow (146, alt edge 2) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 stained all_purpose | fly top: same_family_same_presentation | Baitfish Slider Fly (162); Deceiver (152) | Zonker Streamer (152); Warmwater Crawfish Fly (160) | Clouser Minnow (154, alt edge 2) |
| Colorado mountain-west SMB reservoir<br>2025-08-12 dirty all_purpose | fly top: same_family_same_presentation | Deceiver (184); Baitfish Slider Fly (174) | Zonker Streamer (176); Articulated Baitfish Streamer (168) | Clouser Minnow (178, alt edge 2) |
| Yampa River mountain-west SMB context<br>2025-05-19 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (170); Big Smallmouth Tube (168) | Medium-Diving Crankbait (162); Tube Jig (148) | Inline Spinner (150, alt edge 2) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Table Rock / Ozark clear reservoir<br>2025-02-20 dirty | B | 3/4 | Tube Jig; Ned Rig; Rabbit-Strip Leech; Articulated Baitfish Streamer | Tube Jig; Ned Rig; Articulated Baitfish Streamer; Game Changer |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 clear B | lure | Medium-Diving Crankbait; Suspending Jerkbait |
| Lake Champlain SMB water<br>2025-01-18 stained B | lure | Spinnerbait; Suspending Jerkbait |
| Lake Champlain SMB water<br>2025-01-18 dirty B | lure | Spinnerbait; Bladed Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 clear A | lure | Finesse Jig; Texas-Rigged Soft-Plastic Craw |
| Upper Mississippi smallmouth river<br>2025-01-26 clear B | lure | Ned Rig; Tube Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 stained A | lure | Tube Jig; Medium-Diving Crankbait |
| Upper Mississippi smallmouth river<br>2025-01-26 stained B | lure | Suspending Jerkbait; Hair Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty A | lure | Medium-Diving Crankbait; Texas-Rigged Soft-Plastic Craw |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty B | lure | Ned Rig; Spinnerbait |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear B | lure | Tube Jig; Inline Spinner |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained B | lure | Spinnerbait; Bladed Jig |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty B | lure | Spinnerbait; Bladed Jig |
| Table Rock / Ozark clear reservoir<br>2025-02-20 clear B | lure | Tube Jig; Texas-Rigged Soft-Plastic Craw |
| Table Rock / Ozark clear reservoir<br>2025-02-20 stained B | lure | Carolina-Rigged Stick Worm; Texas-Rigged Soft-Plastic Craw |
| Table Rock / Ozark clear reservoir<br>2025-02-20 dirty B | lure | Tube Jig; Ned Rig |
| New River Appalachian SMB context<br>2025-03-26 clear B | lure | Texas-Rigged Soft-Plastic Craw; Tube Jig |
| New River Appalachian SMB context<br>2025-03-26 stained B | lure | Suspending Jerkbait; Tube Jig |
| New River Appalachian SMB context<br>2025-03-26 dirty B | lure | Ned Rig; Inline Spinner |
| New River Appalachian SMB context<br>2025-04-04 clear B | lure | Drop-Shot Minnow; Hair Jig |
| New River Appalachian SMB context<br>2025-04-04 stained B | lure | Bladed Jig; Spinnerbait |
| Ozark Current River smallmouth context<br>2025-04-05 clear B | lure | Inline Spinner; Hair Jig |
| Ozark Current River smallmouth context<br>2025-04-05 stained B | lure | Bladed Jig; Spinnerbait |
| Ozark Current River smallmouth context<br>2025-04-05 dirty B | lure | Bladed Jig; Squarebill Crankbait |
| Ozark Current River smallmouth context<br>2025-05-06 clear B | lure | Flat-Sided Crankbait; Tube Jig |
| Ozark Current River smallmouth context<br>2025-05-06 stained B | lure | Flat-Sided Crankbait; Tube Jig |
| Ozark Current River smallmouth context<br>2025-05-06 dirty B | lure | Flat-Sided Crankbait; Blade Bait |
| New River Appalachian SMB context<br>2025-05-06 clear B | lure | Flat-Sided Crankbait; Medium-Diving Crankbait |
| Yampa River mountain-west SMB context<br>2025-05-19 clear B | lure | Medium-Diving Crankbait; Tube Jig |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear B | lure | Medium-Diving Crankbait; Inline Spinner |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear B | fly | Baitfish Slider Fly; Zonker Streamer |
| Lake Champlain SMB water<br>2025-08-14 clear B | lure | Medium-Diving Crankbait; Suspending Jerkbait |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Tube Jig [lure] | 9 | Big Smallmouth Tube (4), Football Jig (4), Magnum Jerkbait (1) | 16 |
| Medium-Diving Crankbait [lure] | 8 | Compact Glide Bait (3), Football Jig (3), Big Smallmouth Tube (1), Magnum Jerkbait (1) | 11.8 |
| Spinnerbait [lure] | 7 | Football Jig (5), Big Smallmouth Tube (2) | 21.7 |
| Bladed Jig [lure] | 6 | Big Smallmouth Tube (3), Football Jig (3) | 26 |
| Inline Spinner [lure] | 6 | Big Smallmouth Tube (2), Compact Glide Bait (2), Football Jig (2) | 29 |
| Blade Bait [lure] | 5 | Football Jig (4), Big Smallmouth Tube (1) | 3.2 |
| Flat-Sided Crankbait [lure] | 4 | Big Smallmouth Tube (4) | 18 |
| Suspending Jerkbait [lure] | 4 | Football Jig (2), Big Smallmouth Tube (1), Compact Glide Bait (1) | 25 |
| Texas-Rigged Soft-Plastic Craw [lure] | 3 | Football Jig (2), Big Smallmouth Tube (1) | 16.7 |
| Baitfish Slider Fly [fly] | 2 | Game Changer (2) | 14 |
| Hair Jig [lure] | 2 | Big Smallmouth Tube (2) | 32 |
| Lipless Crankbait [lure] | 2 | Football Jig (2) | 18 |
| Ned Rig [lure] | 2 | Big Smallmouth Tube (1), Football Jig (1) | 19 |
| Unweighted Baitfish Streamer [fly] | 2 | Game Changer (2) | 14 |
| Carolina-Rigged Stick Worm [lure] | 1 | Football Jig (1) | 26 |

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (lure) | Ned Rig (152; goal:all_purpose:reliable_action:+18); Finesse Jig (152; goal:all_purpose:reliable_action:+18) | Inline Spinner (166, alt edge 14) | goal fit likely competed |
| Lake Champlain SMB water<br>2025-01-18 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Feather Jig Leech (152; condition_tag:warming_search:+16, goal:all_purpose:versatile_search:+12); Game Changer (132; goal:all_purpose:versatile_search:+12) | Zonker Streamer (154, alt edge 2) | goal fit likely competed |
| Lake Champlain SMB water<br>2025-01-18 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (154; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Rabbit-Strip Leech (140; goal:big_fish:big_fish_upside:+20) | Zonker Streamer (142, alt edge -12) | goal fit likely competed |
| Lake Champlain SMB water<br>2025-01-18 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (146; goal:big_fish:big_fish_upside:+20); Game Changer (140; goal:big_fish:big_fish_upside:+20) | Zonker Streamer (142, alt edge -4) | goal fit likely competed |
| Lake Champlain SMB water<br>2025-01-18 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (146; goal:big_fish:big_fish_upside:+20); Game Changer (140; goal:big_fish:big_fish_upside:+20) | Deceiver (136, alt edge -10) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (lure) | Carolina-Rigged Stick Worm (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Tube Jig (164; goal:all_purpose:reliable_action:+18) | Inline Spinner (160, alt edge -4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (144; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Rabbit-Strip Leech (138; goal:all_purpose:reliable_action:+18) | Zonker Streamer (148, alt edge 4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Dungeon Streamer (148; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Rabbit-Strip Leech (140; goal:big_fish:big_fish_upside:+20) | Zonker Streamer (136, alt edge -12) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (140; goal:big_fish:big_fish_upside:+20); Game Changer (134; goal:big_fish:big_fish_upside:+20) | Zonker Streamer (136, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (lure) | Tube Jig (164; goal:all_purpose:reliable_action:+18); Blade Bait (174; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18) | Inline Spinner (182, alt edge 8) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (166; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Jighead Marabou Leech (146; goal:all_purpose:reliable_action:+18) | Zonker Streamer (170, alt edge 4) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Big Smallmouth Tube (166; goal:big_fish:big_fish_upside:+20); Magnum Jerkbait (162; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (158, alt edge -8) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (156; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (154; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Zonker Streamer (158, alt edge 2) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (162; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (148; goal:big_fish:big_fish_upside:+20) | Zonker Streamer (158, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (162; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (148; goal:big_fish:big_fish_upside:+20) | Deceiver (152, alt edge -10) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 8) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (146; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 stained big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Bladed Jig (150; condition_tag:dirty_vibration:+16); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 12) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Articulated Baitfish Streamer (154; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-04-18 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Big Smallmouth Tube (152; goal:big_fish:big_fish_upside:+20); Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 8) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-04-18 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-04-18 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Bladed Jig (150; condition_tag:dirty_vibration:+16); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge 12) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-04-18 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Colorado mountain-west SMB reservoir<br>2025-04-23 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20); Big Smallmouth Tube (152; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (178, alt edge 24) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| clear_subtle_wind_watch | 43 |
| dirty_vibration_acceptable | 12 |
| other_wind_watch | 9 |
| current_open_water_acceptable | 4 |
| surface_low_light_acceptable | 2 |
| true_dirty_stained_wind_miss | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Lake Champlain SMB water<br>2025-01-18 all_purpose clear A | warming_search<br>neutral | Ned Rig 152<br>Finesse Jig 152 |
| clear_subtle_wind_watch | Lake Champlain SMB water<br>2025-01-18 big_fish clear B | warming_search<br>neutral | Medium-Diving Crankbait 158<br>Suspending Jerkbait 136 |
| clear_subtle_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-02-15 all_purpose clear A | warming_search<br>active | Carolina-Rigged Stick Worm 164<br>Tube Jig 164 |
| clear_subtle_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-02-15 all_purpose clear B | warming_search<br>active | Blade Bait 152<br>Inline Spinner 160 |
| clear_subtle_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-02-15 big_fish clear B | warming_search<br>active | Tube Jig 146<br>Inline Spinner 130 |
| dirty_vibration_acceptable | Lake Champlain SMB water<br>2025-01-18 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Spinnerbait 142<br>Suspending Jerkbait 136 |
| dirty_vibration_acceptable | Dale Hollow / Tennessee highland reservoir<br>2025-02-15 big_fish stained B | breezy_windy_stained_reaction<br>active | Spinnerbait 136<br>Bladed Jig 130 |
| dirty_vibration_acceptable | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Bladed Jig 150<br>Football Jig 140 |
| dirty_vibration_acceptable | Door County / Green Bay smallmouth lake<br>2025-04-18 big_fish dirty A | dirty_vibration<br>active | Bladed Jig 150<br>Football Jig 140 |
| dirty_vibration_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-05-15 big_fish dirty A | dirty_vibration<br>neutral | Bladed Jig 140<br>Football Jig 140 |
| other_wind_watch | Lake Champlain SMB water<br>2025-01-18 big_fish dirty A | dirty_vibration<br>neutral | Medium-Diving Crankbait 158<br>Football Jig 154 |
| other_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 162<br>Big Smallmouth Tube 152 |
| other_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish dirty B | dirty_vibration<br>neutral | Medium-Diving Crankbait 162<br>Magnum Jerkbait 146 |
| other_wind_watch | Door County / Green Bay smallmouth lake<br>2025-04-18 big_fish stained B | breezy_windy_stained_reaction<br>active | Medium-Diving Crankbait 162<br>Big Smallmouth Tube 152 |
| other_wind_watch | Door County / Green Bay smallmouth lake<br>2025-04-18 big_fish dirty B | dirty_vibration<br>active | Medium-Diving Crankbait 162<br>Big Smallmouth Tube 144 |
| current_open_water_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 158<br>Big Smallmouth Tube 166 |
| current_open_water_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 big_fish dirty B | dirty_vibration<br>neutral | Lipless Crankbait 152<br>Magnum Jerkbait 154 |
| current_open_water_acceptable | Table Rock / Ozark clear reservoir<br>2025-06-18 big_fish dirty A | dirty_vibration<br>neutral | Lipless Crankbait 172<br>Compact Glide Bait 176 |
| current_open_water_acceptable | Colorado mountain-west SMB reservoir<br>2025-08-12 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Lipless Crankbait 172<br>Compact Glide Bait 184 |
| surface_low_light_acceptable | Dale Hollow / Tennessee highland reservoir<br>2025-06-07 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Walking Topwater 178<br>Compact Glide Bait 184 |
| surface_low_light_acceptable | Dale Hollow / Tennessee highland reservoir<br>2025-06-07 big_fish dirty A | dirty_vibration<br>neutral | Wake Bait 166<br>Compact Glide Bait 176 |
| true_dirty_stained_wind_miss | Mille Lacs / Upper Midwest natural lake<br>2025-07-16 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Compact Glide Bait 168<br>Big Smallmouth Tube 152 |

## Guide Verdict Summary

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | medium_confidence_archive | 137 |
| watch | big_fish | B | fly | medium_confidence_archive | 111 |
| watch | big_fish | A | lure | medium_confidence_archive | 80 |
| watch | big_fish | A | fly | cold_slow_or_front | 71 |
| watch | big_fish | B | lure | medium_confidence_archive | 66 |
| watch | big_fish | B | fly | cold_slow_or_front | 61 |
| watch | big_fish | A | fly | dirty_vibration | 47 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 38 |
| watch | big_fish | A | lure | cold_slow_or_front | 37 |
| watch | big_fish | B | fly | dirty_vibration | 36 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 34 |
| watch | big_fish | A | lure | dirty_vibration | 30 |
| watch | all_purpose | A | fly | medium_confidence_archive | 28 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 28 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 28 |
| watch | big_fish | A | fly | warming_search | 26 |
| watch | all_purpose | B | fly | medium_confidence_archive | 25 |
| watch | big_fish | B | lure | cold_slow_or_front | 24 |
| watch | big_fish | B | lure | dirty_vibration | 24 |
| watch | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 23 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 21 |
| watch | big_fish | B | fly | warming_search | 21 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 20 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 19 |
| watch | all_purpose | A | lure | medium_confidence_archive | 16 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 15 |
| watch | all_purpose | B | fly | cold_slow_or_front | 12 |
| watch | all_purpose | B | fly | dirty_vibration | 12 |
| watch | big_fish | A | lure | warming_search | 12 |
| watch | all_purpose | A | fly | cold_slow_or_front | 11 |
| watch | all_purpose | A | fly | warming_search | 9 |
| watch | all_purpose | B | lure | medium_confidence_archive | 9 |
| watch | big_fish | B | lure | warming_search | 9 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 7 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 7 |
| watch | all_purpose | A | lure | cold_slow_or_front | 6 |
| watch | big_fish | A | fly | heat_limited_finesse | 6 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 5 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 5 |
| watch | all_purpose | B | lure | warming_search | 5 |
| watch | big_fish | B | fly | heat_limited_finesse | 5 |
| watch | all_purpose | A | fly | dirty_vibration | 4 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 4 |
| watch | all_purpose | A | lure | warming_search | 4 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 4 |
| watch | all_purpose | B | lure | dirty_vibration | 4 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 4 |
| watch | big_fish | A | lure | heat_limited_finesse | 4 |
| watch | big_fish | B | fly | calm_low_light_surface | 4 |
| watch | big_fish | B | lure | heat_limited_finesse | 4 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 3 |
| watch | all_purpose | B | fly | heat_limited_finesse | 3 |
| watch | all_purpose | B | fly | warming_search | 3 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 3 |
| watch | big_fish | B | lure | calm_low_light_surface | 3 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 3 |
| watch | all_purpose | B | lure | calm_low_light_surface | 2 |
| watch | all_purpose | B | lure | cold_slow_or_front | 2 |
| watch | big_fish | A | fly | calm_low_light_surface | 2 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 2 |
| watch | all_purpose | A | fly | calm_low_light_surface | 1 |
| watch | all_purpose | A | fly | heat_limited_finesse | 1 |
| watch | all_purpose | A | lure | calm_low_light_surface | 1 |
| watch | all_purpose | A | lure | river_elevated_runoff_current | 1 |
| watch | all_purpose | B | fly | calm_bright_clear_subtle | 1 |
| watch | all_purpose | B | fly | calm_low_light_surface | 1 |
| watch | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 1 |
| watch | big_fish | A | lure | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | calm_bright_clear_subtle | 1 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 179 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 167 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 112 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 112 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 92 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 90 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 80 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 73 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 71 |
| acceptable_fit | big_fish | B | lure | warming_search | 61 |
| acceptable_fit | big_fish | B | fly | warming_search | 56 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 5 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 5 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| New River Appalachian SMB context<br>2025-09-29 dirty big_fish A | Buzzbait (lure_of_the_day, lure, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>calm_surface+low_light_surface+dirty_vibration+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-09-29 stained all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 180) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+dirty_vibration+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-06-07 stained all_purpose B | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 stained all_purpose A | Blade Bait (lure_of_the_day, lure, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained all_purpose A | Blade Bait (lure_of_the_day, lure, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-06-07 dirty all_purpose A | Inline Spinner (lure_of_the_day, lure, score 194) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 dirty all_purpose B | Blade Bait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 stained all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-06-17 stained all_purpose B | Inline Spinner (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-06-07 dirty all_purpose B | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-06-07 stained all_purpose A | Deceiver (fly_of_the_day, fly, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-06-17 dirty big_fish A | Buzzbait (lure_of_the_day, lure, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-06-17 stained big_fish A | Buzzbait (lure_of_the_day, lure, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>low_light_surface+wind_reaction+dirty_vibration+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 stained all_purpose B | Suspending Jerkbait (honorable_lure, lure, score 182) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained all_purpose A | Inline Spinner (honorable_lure, lure, score 182) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 dirty all_purpose B | Deep-Diving Crankbait (lure_of_the_day, lure, score 180) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-09-29 clear all_purpose A | Inline Spinner (honorable_lure, lure, score 180) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-09-29 clear all_purpose A | Clouser Minnow (honorable_fly, fly, score 180) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 dirty all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 178) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-06-07 dirty all_purpose B | Suspending Jerkbait (honorable_lure, lure, score 178) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 1392 | 676 | 49% |
| clear_subtle | 336 | 174 | 52% |
| dirty_vibration | 1088 | 124 | 11% |
| heat_finesse | 48 | 5 | 10% |
| cold_slow | 672 | 393 | 58% |
| low_light_surface | 288 | 75 | 26% |
| calm_surface | 432 | 109 | 25% |
| Big Fish upside | 1224 | 883 | 72% |
| All Purpose reliable/versatile | 1224 | 1112 | 91% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Game Changer [fly] (152), Articulated Baitfish Streamer [fly] (145), Rabbit-Strip Leech [fly] (132), Medium-Diving Crankbait [lure] (125), Baitfish Slider Fly [fly] (118), Suspending Jerkbait [lure] (118), Big Smallmouth Tube [lure] (113), Inline Spinner [lure] (113), Deceiver [fly] (96), Clouser Minnow [fly] (93), Zonker Streamer [fly] (90), Football Jig [lure] (76) |
| All-purpose | Suspending Jerkbait [lure] (102), Inline Spinner [lure] (101), Clouser Minnow [fly] (93), Baitfish Slider Fly [fly] (76), Zonker Streamer [fly] (70), Deceiver [fly] (64), Medium-Diving Crankbait [lure] (58), Tube Jig [lure] (54) |
| Big-fish | Game Changer [fly] (134), Articulated Baitfish Streamer [fly] (127), Rabbit-Strip Leech [fly] (119), Big Smallmouth Tube [lure] (113), Football Jig [lure] (76), Magnum Jerkbait [lure] (76), Medium-Diving Crankbait [lure] (67), Compact Glide Bait [lure] (66) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 30 | 30 | 0 | 1 | 0 |
| fly | 24 | 24 | 0 | 0 | 0 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 152/612 | 24.8% | big_fish:134, all_purpose:18 | B:82, A:70 | honorable:79, top:73 | clear:58, dirty:52, stained:42 | freshwater_lake_pond:124, freshwater_river:28 | wind_reaction:83, dirty_vibration:58, warming_search:41, cold_slow:33 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 145/612 | 23.7% | big_fish:127, all_purpose:18 | A:84, B:61 | honorable:76, top:69 | dirty:55, stained:48, clear:42 | freshwater_lake_pond:126, freshwater_river:19 | wind_reaction:74, dirty_vibration:57, warming_search:37, cold_slow:32 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 132/612 | 21.6% | big_fish:119, all_purpose:13 | A:72, B:60 | honorable:107, top:25 | stained:49, dirty:46, clear:37 | freshwater_lake_pond:107, freshwater_river:25 | wind_reaction:77, dirty_vibration:59, cold_slow:50, warming_search:36 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 125/612 | 20.4% | big_fish:67, all_purpose:58 | B:73, A:52 | top:82, honorable:43 | dirty:52, stained:45, clear:28 | freshwater_lake_pond:104, freshwater_river:21 | wind_reaction:115, dirty_vibration:90, open_water_search:33, warming_search:31 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 118/612 | 19.3% | all_purpose:102, big_fish:16 | B:65, A:53 | top:62, honorable:56 | stained:42, dirty:41, clear:35 | freshwater_lake_pond:92, freshwater_river:26 | wind_reaction:99, dirty_vibration:72, cold_slow:33, warming_search:23 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 118/480 | 24.6% | all_purpose:76, big_fish:42 | A:73, B:45 | honorable:66, top:52 | dirty:50, stained:42, clear:26 | freshwater_lake_pond:102, freshwater_river:16 | wind_reaction:93, dirty_vibration:72, warming_search:30, low_light_surface:19 |
| Inline Spinner<br>inline_spinner | lure | 113/612 | 18.5% | all_purpose:101, big_fish:12 | A:57, B:56 | top:61, honorable:52 | stained:42, dirty:38, clear:33 | freshwater_lake_pond:90, freshwater_river:23 | wind_reaction:86, dirty_vibration:63, warming_search:28, open_water_search:23 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 113/540 | 20.9% | big_fish:113 | A:78, B:35 | honorable:76, top:37 | clear:42, stained:40, dirty:31 | freshwater_lake_pond:80, freshwater_river:33 | wind_reaction:54, dirty_vibration:41, cold_slow:30, warming_search:30 |
| Deceiver<br>deceiver | fly | 96/612 | 15.7% | all_purpose:64, big_fish:32 | A:49, B:47 | top:75, honorable:21 | dirty:40, stained:40, clear:16 | freshwater_lake_pond:89, freshwater_river:7 | wind_reaction:92, dirty_vibration:76, open_water_search:29, cold_slow:23 |
| Clouser Minnow<br>clouser_minnow | fly | 93/612 | 15.2% | all_purpose:93 | B:67, A:26 | honorable:55, top:38 | clear:37, stained:34, dirty:22 | freshwater_lake_pond:79, freshwater_river:14 | wind_reaction:40, warming_search:34, dirty_vibration:29, calm_surface:21 |
| Zonker Streamer<br>zonker_streamer | fly | 90/612 | 14.7% | all_purpose:70, big_fish:20 | B:49, A:41 | top:76, honorable:14 | dirty:33, stained:31, clear:26 | freshwater_lake_pond:84, freshwater_river:6 | wind_reaction:83, dirty_vibration:60, open_water_search:25, warming_search:18 |
| Football Jig<br>football_jig | lure | 76/468 | 16.2% | big_fish:76 | A:40, B:36 | honorable:58, top:18 | dirty:31, clear:29, stained:16 | freshwater_lake_pond:76 | wind_reaction:46, dirty_vibration:29, warming_search:26, cold_slow:21 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 76/360 | 21.1% | big_fish:76 | A:47, B:29 | honorable:49, top:27 | clear:30, stained:26, dirty:20 | freshwater_lake_pond:53, freshwater_river:23 | wind_reaction:33, cold_slow:26, dirty_vibration:25, warming_search:25 |
| Tube Jig<br>tube_jig | lure | 67/612 | 10.9% | all_purpose:54, big_fish:13 | B:34, A:33 | top:49, honorable:18 | clear:41, stained:20, dirty:6 | freshwater_lake_pond:42, freshwater_river:25 | cold_slow:42, wind_reaction:30, clear_subtle:22, dirty_vibration:12 |
| Compact Glide Bait<br>compact_glidebait | lure | 66/300 | 22% | big_fish:66 | A:43, B:23 | honorable:42, top:24 | clear:23, stained:22, dirty:21 | freshwater_lake_pond:66 | wind_reaction:35, dirty_vibration:23, calm_surface:18, clear_subtle:13 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 42/480 | 8.8% | all_purpose:32, big_fish:10 | B:27, A:15 | honorable:22, top:20 | dirty:26, stained:16 | freshwater_lake_pond:26, freshwater_river:16 | dirty_vibration:40, wind_reaction:28, cold_slow:12, current_swing:12 |
| Woolly Bugger<br>woolly_bugger | fly | 41/612 | 6.7% | all_purpose:34, big_fish:7 | B:23, A:18 | honorable:30, top:11 | dirty:16, clear:14, stained:11 | freshwater_lake_pond:35, freshwater_river:6 | cold_slow:28, warming_search:13, dirty_vibration:12, wind_reaction:10 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 41/480 | 8.5% | all_purpose:41 | A:25, B:16 | honorable:21, top:20 | clear:24, stained:11, dirty:6 | freshwater_lake_pond:32, freshwater_river:9 | calm_surface:20, clear_subtle:15, warming_search:11, wind_reaction:10 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 36/348 | 10.3% | all_purpose:32, big_fish:4 | B:20, A:16 | honorable:20, top:16 | clear:18, stained:11, dirty:7 | freshwater_lake_pond:36 | wind_reaction:16, cold_slow:12, clear_subtle:11, dirty_vibration:8 |
| Spinnerbait<br>spinnerbait | lure | 35/612 | 5.7% | all_purpose:19, big_fish:16 | B:22, A:13 | honorable:19, top:16 | dirty:18, stained:17 | freshwater_lake_pond:21, freshwater_river:14 | dirty_vibration:35, wind_reaction:24, warming_search:13, current_swing:10 |
| Deer Hair Slider<br>deer_hair_slider | fly | 35/228 | 15.4% | big_fish:35 | A:28, B:7 | honorable:18, top:17 | clear:12, stained:12, dirty:11 | freshwater_lake_pond:23, freshwater_river:12 | calm_surface:27, low_light_surface:17, current_swing:9, dirty_vibration:9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 34/168 | 20.2% | big_fish:34 | B:18, A:16 | honorable:17, top:17 | dirty:12, clear:11, stained:11 | freshwater_river:20, freshwater_lake_pond:14 | cold_slow:23, wind_reaction:21, dirty_vibration:18, warming_search:9 |
| Bladed Jig<br>bladed_jig | lure | 33/612 | 5.4% | big_fish:17, all_purpose:16 | B:17, A:16 | top:20, honorable:13 | dirty:17, stained:16 | freshwater_lake_pond:19, freshwater_river:14 | dirty_vibration:33, wind_reaction:18, cold_slow:12, current_swing:12 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 32/228 | 14% | all_purpose:29, big_fish:3 | B:17, A:15 | top:23, honorable:9 | clear:13, stained:10, dirty:9 | freshwater_lake_pond:24, freshwater_river:8 | calm_surface:28, low_light_surface:13, clear_subtle:7, dirty_vibration:6 |
| Walking Topwater<br>walking_topwater | lure | 31/228 | 13.6% | big_fish:31 | B:17, A:14 | top:26, honorable:5 | clear:12, stained:11, dirty:8 | freshwater_lake_pond:19, freshwater_river:12 | calm_surface:24, low_light_surface:14, current_swing:9, dirty_vibration:8 |
| Buzzbait<br>buzzbait | lure | 30/228 | 13.2% | big_fish:25, all_purpose:5 | B:17, A:13 | top:20, honorable:10 | dirty:14, stained:10, clear:6 | freshwater_river:17, freshwater_lake_pond:13 | low_light_surface:19, calm_surface:18, dirty_vibration:16, current_swing:12 |
| Sculpzilla<br>sculpzilla | fly | 29/144 | 20.1% | big_fish:29 | A:20, B:9 | top:17, honorable:12 | dirty:12, stained:10, clear:7 | freshwater_river:29 | dirty_vibration:18, current_swing:15, cold_slow:12, wind_reaction:12 |
| Lipless Crankbait<br>lipless_crankbait | lure | 27/612 | 4.4% | all_purpose:14, big_fish:13 | A:15, B:12 | top:19, honorable:8 | stained:15, dirty:12 | freshwater_lake_pond:26, freshwater_river:1 | dirty_vibration:27, wind_reaction:27, open_water_search:19, cold_slow:2 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 25/612 | 4.1% | all_purpose:25 | A:16, B:9 | honorable:15, top:10 | clear:11, dirty:9, stained:5 | freshwater_lake_pond:17, freshwater_river:8 | cold_slow:21, wind_reaction:14, dirty_vibration:8, open_water_search:5 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 25/480 | 5.2% | all_purpose:18, big_fish:7 | B:19, A:6 | honorable:14, top:11 | clear:17, stained:5, dirty:3 | freshwater_lake_pond:25 | clear_subtle:13, wind_reaction:11, warming_search:6, calm_surface:5 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 25/468 | 5.3% | all_purpose:22, big_fish:3 | B:14, A:11 | honorable:14, top:11 | clear:15, stained:7, dirty:3 | freshwater_lake_pond:25 | cold_slow:14, wind_reaction:10, warming_search:8, clear_subtle:7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 24/612 | 3.9% | all_purpose:22, big_fish:2 | B:13, A:11 | top:15, honorable:9 | clear:15, stained:5, dirty:4 | freshwater_lake_pond:20, freshwater_river:4 | clear_subtle:12, cold_slow:11, wind_reaction:10, warming_search:8 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 23/612 | 3.8% | all_purpose:15, big_fish:8 | B:17, A:6 | honorable:16, top:7 | dirty:10, clear:7, stained:6 | freshwater_lake_pond:21, freshwater_river:2 | warming_search:20, calm_surface:7, low_light_surface:4, current_swing:1 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 22/612 | 3.6% | all_purpose:20, big_fish:2 | A:11, B:11 | honorable:15, top:7 | clear:13, stained:6, dirty:3 | freshwater_lake_pond:16, freshwater_river:6 | warming_search:12, clear_subtle:11, calm_surface:8, current_swing:2 |
| Ned Rig<br>ned_rig | lure | 22/612 | 3.6% | all_purpose:18, big_fish:4 | B:18, A:4 | honorable:14, top:8 | clear:13, dirty:6, stained:3 | freshwater_lake_pond:14, freshwater_river:8 | cold_slow:16, wind_reaction:10, clear_subtle:8, warming_search:3 |
| Sculpin Streamer<br>sculpin_streamer | fly | 21/144 | 14.6% | all_purpose:21 | B:14, A:7 | top:13, honorable:8 | clear:7, dirty:7, stained:7 | freshwater_river:21 | cold_slow:16, dirty_vibration:12, wind_reaction:11, current_swing:7 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 20/612 | 3.3% | all_purpose:15, big_fish:5 | B:12, A:8 | honorable:13, top:7 | clear:12, dirty:6, stained:2 | freshwater_lake_pond:10, freshwater_river:10 | cold_slow:16, clear_subtle:7, wind_reaction:7, warming_search:3 |
| Feather Jig Leech<br>feather_jig_leech | fly | 19/612 | 3.1% | all_purpose:12, big_fish:7 | B:10, A:9 | honorable:11, top:8 | clear:8, stained:6, dirty:5 | freshwater_lake_pond:16, freshwater_river:3 | warming_search:19, current_swing:3, dirty_vibration:3, wind_reaction:2 |
| Blade Bait<br>blade_bait | lure | 18/612 | 2.9% | all_purpose:11, big_fish:7 | B:10, A:8 | top:13, honorable:5 | dirty:8, clear:6, stained:4 | freshwater_lake_pond:15, freshwater_river:3 | cold_slow:14, wind_reaction:14, open_water_search:11, dirty_vibration:8 |
| Finesse Jig<br>finesse_jig | lure | 18/612 | 2.9% | all_purpose:17, big_fish:1 | B:11, A:7 | honorable:9, top:9 | clear:10, stained:6, dirty:2 | freshwater_lake_pond:9, freshwater_river:9 | cold_slow:13, wind_reaction:10, clear_subtle:5, dirty_vibration:3 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 18/156 | 11.5% | all_purpose:18 | A:9, B:9 | top:11, honorable:7 | clear:8, dirty:6, stained:4 | freshwater_lake_pond:15, freshwater_river:3 | calm_surface:7, clear_subtle:5, wind_reaction:5, dirty_vibration:3 |
| Muddler Minnow<br>muddler_sculpin | fly | 18/144 | 12.5% | all_purpose:17, big_fish:1 | A:12, B:6 | top:12, honorable:6 | clear:11, stained:5, dirty:2 | freshwater_river:18 | cold_slow:14, wind_reaction:10, current_swing:6, dirty_vibration:6 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 17/468 | 3.6% | all_purpose:13, big_fish:4 | A:11, B:6 | top:9, honorable:8 | dirty:12, clear:3, stained:2 | freshwater_lake_pond:17 | cold_slow:8, wind_reaction:5, calm_surface:4, dirty_vibration:3 |
| Popper Fly<br>popper_fly | fly | 17/228 | 7.5% | all_purpose:17 | B:13, A:4 | top:14, honorable:3 | stained:8, clear:5, dirty:4 | freshwater_lake_pond:15, freshwater_river:2 | calm_surface:16, low_light_surface:6, clear_subtle:2, warming_search:2 |
| Wake Bait<br>wake_bait | lure | 16/168 | 9.5% | big_fish:16 | B:9, A:7 | top:13, honorable:3 | stained:6, clear:5, dirty:5 | freshwater_lake_pond:16 | calm_surface:14, low_light_surface:6, clear_subtle:4, dirty_vibration:2 |
| Crawfish Streamer<br>crawfish_streamer | fly | 14/144 | 9.7% | all_purpose:12, big_fish:2 | B:8, A:6 | honorable:8, top:6 | clear:9, stained:4, dirty:1 | freshwater_river:14 | clear_subtle:7, cold_slow:7, wind_reaction:7, current_swing:6 |
| Swim Jig<br>swim_jig | lure | 12/612 | 2% | all_purpose:12 | A:6, B:6 | honorable:9, top:3 | stained:7, dirty:4, clear:1 | freshwater_lake_pond:10, freshwater_river:2 | warming_search:7, calm_surface:6, low_light_surface:2, current_swing:1 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 11/480 | 2.3% | big_fish:6, all_purpose:5 | B:6, A:5 | top:10, honorable:1 | clear:6, stained:3, dirty:2 | freshwater_lake_pond:6, freshwater_river:5 | cold_slow:4, clear_subtle:3, wind_reaction:3, calm_surface:2 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 11/144 | 7.6% | all_purpose:7, big_fish:4 | B:6, A:5 | top:7, honorable:4 | stained:8, dirty:2, clear:1 | freshwater_river:11 | dirty_vibration:10, wind_reaction:9, current_swing:5, warming_search:5 |
| Conehead Streamer<br>conehead_streamer | fly | 9/144 | 6.3% | all_purpose:7, big_fish:2 | A:6, B:3 | top:5, honorable:4 | dirty:4, stained:3, clear:2 | freshwater_river:9 | wind_reaction:8, dirty_vibration:7, current_swing:4, low_light_surface:4 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 8/120 | 6.7% | all_purpose:7, big_fish:1 | B:6, A:2 | honorable:6, top:2 | clear:5, dirty:2, stained:1 | freshwater_river:8 | calm_surface:5, clear_subtle:5, current_swing:5, cold_slow:2 |
| Hair Jig<br>hair_jig | lure | 6/144 | 4.2% | all_purpose:3, big_fish:3 | B:4, A:2 | honorable:5, top:1 | clear:4, stained:2 | freshwater_river:6 | current_swing:5, cold_slow:4, clear_subtle:2, dirty_vibration:2 |
| Glide Bait<br>glidebait | lure | 2/36 | 5.6% | big_fish:2 | A:2 | honorable:1, top:1 | clear:2 | freshwater_lake_pond:2 | wind_reaction:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/132 | 0.8% | all_purpose:1 | A:1 | top:1 | stained:1 | freshwater_lake_pond:1 | warming_search:1 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 152/2448 (6.2%) | 73/1224 (6%) | 79/1224 (6.5%) | - | 152/1224 (12.4%) |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 145/2448 (5.9%) | 69/1224 (5.6%) | 76/1224 (6.2%) | - | 145/1224 (11.8%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 132/2448 (5.4%) | 25/1224 (2%) | 107/1224 (8.7%) | - | 132/1224 (10.8%) |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 125/2448 (5.1%) | 82/1224 (6.7%) | 43/1224 (3.5%) | 125/1224 (10.2%) | - |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 118/2448 (4.8%) | 52/1224 (4.2%) | 66/1224 (5.4%) | - | 118/1224 (9.6%) |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 118/2448 (4.8%) | 62/1224 (5.1%) | 56/1224 (4.6%) | 118/1224 (9.6%) | - |  |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 113/2448 (4.6%) | 37/1224 (3%) | 76/1224 (6.2%) | 113/1224 (9.2%) | - |  |
| Inline Spinner<br>inline_spinner | lure | 113/2448 (4.6%) | 61/1224 (5%) | 52/1224 (4.2%) | 113/1224 (9.2%) | - |  |
| Deceiver<br>deceiver | fly | 96/2448 (3.9%) | 75/1224 (6.1%) | 21/1224 (1.7%) | - | 96/1224 (7.8%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 93/2448 (3.8%) | 38/1224 (3.1%) | 55/1224 (4.5%) | - | 93/1224 (7.6%) |  |
| Zonker Streamer<br>zonker_streamer | fly | 90/2448 (3.7%) | 76/1224 (6.2%) | 14/1224 (1.1%) | - | 90/1224 (7.4%) |  |
| Football Jig<br>football_jig | lure | 76/2448 (3.1%) | 18/1224 (1.5%) | 58/1224 (4.7%) | 76/1224 (6.2%) | - |  |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 76/2448 (3.1%) | 27/1224 (2.2%) | 49/1224 (4%) | 76/1224 (6.2%) | - |  |
| Tube Jig<br>tube_jig | lure | 67/2448 (2.7%) | 49/1224 (4%) | 18/1224 (1.5%) | 67/1224 (5.5%) | - |  |
| Compact Glide Bait<br>compact_glidebait | lure | 66/2448 (2.7%) | 24/1224 (2%) | 42/1224 (3.4%) | 66/1224 (5.4%) | - |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 42/2448 (1.7%) | 20/1224 (1.6%) | 22/1224 (1.8%) | 42/1224 (3.4%) | - |  |
| Woolly Bugger<br>woolly_bugger | fly | 41/2448 (1.7%) | 11/1224 (0.9%) | 30/1224 (2.5%) | - | 41/1224 (3.3%) |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 41/2448 (1.7%) | 20/1224 (1.6%) | 21/1224 (1.7%) | 41/1224 (3.3%) | - |  |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 36/2448 (1.5%) | 16/1224 (1.3%) | 20/1224 (1.6%) | - | 36/1224 (2.9%) |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 35/2448 (1.4%) | 17/1224 (1.4%) | 18/1224 (1.5%) | - | 35/1224 (2.9%) |  |
| Spinnerbait<br>spinnerbait | lure | 35/2448 (1.4%) | 16/1224 (1.3%) | 19/1224 (1.6%) | 35/1224 (2.9%) | - |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 34/2448 (1.4%) | 17/1224 (1.4%) | 17/1224 (1.4%) | - | 34/1224 (2.8%) |  |
| Bladed Jig<br>bladed_jig | lure | 33/2448 (1.3%) | 20/1224 (1.6%) | 13/1224 (1.1%) | 33/1224 (2.7%) | - |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 32/2448 (1.3%) | 23/1224 (1.9%) | 9/1224 (0.7%) | - | 32/1224 (2.6%) |  |
| Walking Topwater<br>walking_topwater | lure | 31/2448 (1.3%) | 26/1224 (2.1%) | 5/1224 (0.4%) | 31/1224 (2.5%) | - |  |
| Buzzbait<br>buzzbait | lure | 30/2448 (1.2%) | 20/1224 (1.6%) | 10/1224 (0.8%) | 30/1224 (2.5%) | - |  |
| Sculpzilla<br>sculpzilla | fly | 29/2448 (1.2%) | 17/1224 (1.4%) | 12/1224 (1%) | - | 29/1224 (2.4%) |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 27/2448 (1.1%) | 19/1224 (1.6%) | 8/1224 (0.7%) | 27/1224 (2.2%) | - |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 25/2448 (1%) | 10/1224 (0.8%) | 15/1224 (1.2%) | - | 25/1224 (2%) |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 25/2448 (1%) | 11/1224 (0.9%) | 14/1224 (1.1%) | - | 25/1224 (2%) |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 25/2448 (1%) | 11/1224 (0.9%) | 14/1224 (1.1%) | 25/1224 (2%) | - |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 24/2448 (1%) | 15/1224 (1.2%) | 9/1224 (0.7%) | - | 24/1224 (2%) |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 23/2448 (0.9%) | 7/1224 (0.6%) | 16/1224 (1.3%) | 23/1224 (1.9%) | - |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 22/2448 (0.9%) | 7/1224 (0.6%) | 15/1224 (1.2%) | 22/1224 (1.8%) | - |  |
| Ned Rig<br>ned_rig | lure | 22/2448 (0.9%) | 8/1224 (0.7%) | 14/1224 (1.1%) | 22/1224 (1.8%) | - |  |
| Sculpin Streamer<br>sculpin_streamer | fly | 21/2448 (0.9%) | 13/1224 (1.1%) | 8/1224 (0.7%) | - | 21/1224 (1.7%) |  |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 20/2448 (0.8%) | 7/1224 (0.6%) | 13/1224 (1.1%) | 20/1224 (1.6%) | - |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 19/2448 (0.8%) | 8/1224 (0.7%) | 11/1224 (0.9%) | - | 19/1224 (1.6%) |  |
| Muddler Minnow<br>muddler_sculpin | fly | 18/2448 (0.7%) | 12/1224 (1%) | 6/1224 (0.5%) | - | 18/1224 (1.5%) |  |
| Blade Bait<br>blade_bait | lure | 18/2448 (0.7%) | 13/1224 (1.1%) | 5/1224 (0.4%) | 18/1224 (1.5%) | - |  |
| Finesse Jig<br>finesse_jig | lure | 18/2448 (0.7%) | 9/1224 (0.7%) | 9/1224 (0.7%) | 18/1224 (1.5%) | - |  |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 18/2448 (0.7%) | 11/1224 (0.9%) | 7/1224 (0.6%) | 18/1224 (1.5%) | - |  |
| Popper Fly<br>popper_fly | fly | 17/2448 (0.7%) | 14/1224 (1.1%) | 3/1224 (0.2%) | - | 17/1224 (1.4%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 17/2448 (0.7%) | 9/1224 (0.7%) | 8/1224 (0.7%) | 17/1224 (1.4%) | - |  |
| Wake Bait<br>wake_bait | lure | 16/2448 (0.7%) | 13/1224 (1.1%) | 3/1224 (0.2%) | 16/1224 (1.3%) | - |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 14/2448 (0.6%) | 6/1224 (0.5%) | 8/1224 (0.7%) | - | 14/1224 (1.1%) |  |
| Swim Jig<br>swim_jig | lure | 12/2448 (0.5%) | 3/1224 (0.2%) | 9/1224 (0.7%) | 12/1224 (1%) | - |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 11/2448 (0.4%) | 7/1224 (0.6%) | 4/1224 (0.3%) | - | 11/1224 (0.9%) |  |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 11/2448 (0.4%) | 10/1224 (0.8%) | 1/1224 (0.1%) | 11/1224 (0.9%) | - |  |
| Conehead Streamer<br>conehead_streamer | fly | 9/2448 (0.4%) | 5/1224 (0.4%) | 4/1224 (0.3%) | - | 9/1224 (0.7%) |  |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 8/2448 (0.3%) | 2/1224 (0.2%) | 6/1224 (0.5%) | - | 8/1224 (0.7%) |  |
| Hair Jig<br>hair_jig | lure | 6/2448 (0.2%) | 1/1224 (0.1%) | 5/1224 (0.4%) | 6/1224 (0.5%) | - |  |
| Glide Bait<br>glidebait | lure | 2/2448 (0.1%) | 1/1224 (0.1%) | 1/1224 (0.1%) | 2/1224 (0.2%) | - |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/2448 (0%) | 1/1224 (0.1%) | 0/1224 (0%) | 1/1224 (0.1%) | - |  |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

| Profile | Gear | Selected/Opp | Rate | Close opp | Far-behind opp | Available tags | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/132 | 0.8% | 36 | 61 | wind_reaction:84, cold_slow:72, dirty_vibration:56, warming_search:48, open_water_search:36 | Medium-Diving Crankbait (top), Football Jig (honorable):8, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):6, Inline Spinner (top), Suspending Jerkbait (honorable):4, Tube Jig (top), Finesse Jig (honorable):4 |

## Over-Selected Profiles

None.

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Magnum Jerkbait<br>magnum_jerkbait | lure | home-window >30% severe | 41/84 | 48.8% | selector_filtering_variety_jitter:22 | AP/BF 0/0, 41/84<br>clarity clear:46, stained:38<br>bucket cold_slow_or_front:30, warming_search:28, breezy_windy_stained_reaction:14 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | home-window >25% overdominant | 96/320 | 30% | goal_tags:137 | AP/BF 46/160, 50/160<br>clarity dirty:160, stained:160<br>bucket dirty_vibration:132, breezy_windy_stained_reaction:116, warming_search:36 |
| Deer Hair Slider<br>deer_hair_slider | fly | home-window >20% watch | 35/144 | 24.3% | goal_tags:72 | AP/BF 0/72, 35/72<br>clarity clear:48, dirty:48, stained:48<br>bucket stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:36, cold_slow_or_front:28 |
| Game Changer<br>game_changer | fly | home-window >20% watch | 98/408 | 24% | daily_condition_tags:125 | AP/BF 13/204, 85/204<br>clarity clear:136, dirty:136, stained:136<br>bucket dirty_vibration:128, breezy_windy_stained_reaction:116, cold_slow_or_front:68 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | home-window >20% watch | 82/360 | 22.8% | goal_tags:208 | AP/BF 0/180, 82/180<br>clarity clear:180, stained:180<br>bucket breezy_windy_stained_reaction:96, cold_slow_or_front:96, warming_search:60 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | home-window >20% watch | 67/308 | 21.8% | forage_clarity_stack:92 | AP/BF 9/154, 58/154<br>clarity clear:144, stained:92, dirty:72<br>bucket cold_slow_or_front:128, dirty_vibration:56, breezy_windy_stained_reaction:40 |
| Walking Topwater<br>walking_topwater | lure | home-window >20% watch | 31/144 | 21.5% | goal_tags:68 | AP/BF 0/72, 31/72<br>clarity clear:48, dirty:48, stained:48<br>bucket stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:36, cold_slow_or_front:28 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | home-window >20% watch | 19/92 | 20.7% | goal_tags:49 | AP/BF 16/46, 3/46<br>clarity clear:76, stained:16<br>bucket cold_slow_or_front:48, calm_bright_clear_subtle:16, stable_pleasant_medium_confidence_archive:12 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | home-window >20% watch | 83/408 | 20.3% | daily_condition_tags:143 | AP/BF 5/204, 78/204<br>clarity clear:136, dirty:136, stained:136<br>bucket dirty_vibration:128, breezy_windy_stained_reaction:116, cold_slow_or_front:68 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 76/2448 (3.1%) | 27/1224 (2.2%) | 49/1224 (4%) | 76/1224 (6.2%) | 41/84 (48.8%) | 17/84 (20.2%) / 24/84 (28.6%) | home>20%<br>home>25%<br>home>30% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 125/2448 (5.1%) | 82/1224 (6.7%) | 43/1224 (3.5%) | 125/1224 (10.2%) | 96/320 (30%) | 65/320 (20.3%) / 31/320 (9.7%) | home>20%<br>home>25% |
| Deer Hair Slider<br>deer_hair_slider | fly | 35/2448 (1.4%) | 17/1224 (1.4%) | 18/1224 (1.5%) | 35/1224 (2.9%) | 35/144 (24.3%) | 17/144 (11.8%) / 18/144 (12.5%) | home>20% |
| Game Changer<br>game_changer | fly | 152/2448 (6.2%) | 73/1224 (6%) | 79/1224 (6.5%) | 152/1224 (12.4%) | 98/408 (24%) | 43/408 (10.5%) / 55/408 (13.5%) | home>20% |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 113/2448 (4.6%) | 37/1224 (3%) | 76/1224 (6.2%) | 113/1224 (9.2%) | 82/360 (22.8%) | 28/360 (7.8%) / 54/360 (15%) | home>20% |
| Deceiver<br>deceiver | fly | 96/2448 (3.9%) | 75/1224 (6.1%) | 21/1224 (1.7%) | 96/1224 (7.8%) | 92/408 (22.5%) | 75/408 (18.4%) / 17/408 (4.2%) | home>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 32/2448 (1.3%) | 23/1224 (1.9%) | 9/1224 (0.7%) | 32/1224 (2.6%) | 32/144 (22.2%) | 23/144 (16%) / 9/144 (6.3%) | home>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 132/2448 (5.4%) | 25/1224 (2%) | 107/1224 (8.7%) | 132/1224 (10.8%) | 67/308 (21.8%) | 17/308 (5.5%) / 50/308 (16.2%) | home>20% |
| Walking Topwater<br>walking_topwater | lure | 31/2448 (1.3%) | 26/1224 (2.1%) | 5/1224 (0.4%) | 31/1224 (2.5%) | 31/144 (21.5%) | 26/144 (18.1%) / 5/144 (3.5%) | home>20% |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 36/2448 (1.5%) | 16/1224 (1.3%) | 20/1224 (1.6%) | 36/1224 (2.9%) | 19/92 (20.7%) | 12/92 (13%) / 7/92 (7.6%) | home>20% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 145/2448 (5.9%) | 69/1224 (5.6%) | 76/1224 (6.2%) | 145/1224 (11.8%) | 83/408 (20.3%) | 32/408 (7.8%) / 51/408 (12.5%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 3.01.
Average expanded finalist pool size: 4.13.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 763.
Rows/slots with expanded finalist pool size 1: 367.
Selected-tier singleton slots expanded above 1: 396.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.65 | 3.92 | 1 | 1 | 234 | 91 |
| fly/top | 3.00 | 4.07 | 1 | 1 | 199 | 97 |
| lure/honorable | 3.13 | 4.23 | 1 | 1 | 167 | 80 |
| lure/top | 3.26 | 4.28 | 1 | 1 | 163 | 99 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1224 |
| goal_or_priority_condition | 1168 |
| credible_fallback | 56 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 1836 |
| goal_and_priority_condition | 1224 |
| credible_fallback | 269 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 170 |
| family_diversity_scarcity | 147 |
| surface_safety_scarcity | 50 |

Representative expanded singleton finalist pools:
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__B lure/top: medium_diving_crankbait (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__all_purpose__B fly/top: clouser_minnow (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B fly/top: articulated_baitfish_streamer (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B fly/top: clouser_minnow (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__all_purpose__B lure/honorable: texas_rigged_soft_plastic_craw (goal_and_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__all_purpose__B fly/honorable: lead_eye_leech (goal_and_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__big_fish__B lure/honorable: tube_jig (goal_or_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__all_purpose__B fly/honorable: crawfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__all_purpose__B fly/top: clouser_minnow (goal_or_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__big_fish__B lure/top: tube_jig (credible_fallback; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__all_purpose__B fly/top: clouser_minnow (goal_or_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B lure/top: tube_jig (credible_fallback; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B fly/top: articulated_baitfish_streamer (goal_or_priority_condition; hard_gated_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 5.37 |
| Different-presentation close candidates | 1.92 |
| Different-family close candidates | 2.76 |
| Final expanded Set B pool | 2.58 |
| Same-family/same-presentation reintroduced | 65/1224 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 272 |
| Coverage pool used | 55 |
| Average used coverage pool size | 4.04 |
| Singleton used coverage pools | 2 |
| Broad pool larger than narrowed pool | 45 |
| Broad pool same as narrowed pool | 10 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 8 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 217 |
| broad | 55 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| spinnerbait | 46 |
| bladed_jig | 39 |
| lipless_crankbait | 28 |
| squarebill_crankbait | 28 |
| inline_spinner | 27 |
| medium_diving_crankbait | 26 |
| suspending_jerkbait | 23 |
| buzzbait | 5 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| spinnerbait | 12 |
| bladed_jig | 8 |
| medium_diving_crankbait | 6 |
| big_smallmouth_tube | 5 |
| inline_spinner | 5 |
| magnum_jerkbait | 5 |
| squarebill_crankbait | 5 |
| suspending_jerkbait | 3 |
| compact_glidebait | 2 |
| football_jig | 2 |
| lipless_crankbait | 2 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

- wi_upper_mississippi__2025-01-26__freshwater_river__dirty__big_fish__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait
- wv_new_river_smb__2025-05-06__freshwater_river__stained__all_purpose__B: Spinnerbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait
- mn_mille_lacs__2025-09-20__freshwater_lake_pond__dirty__big_fish__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- wv_new_river_smb__2025-09-29__freshwater_river__stained__all_purpose__A: Spinnerbait; pool bladed_jig, buzzbait, spinnerbait, squarebill_crankbait
- ca_trinity__2025-10-25__freshwater_lake_pond__stained__all_purpose__B: Spinnerbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait
- wi_door_county__2025-12-12__freshwater_lake_pond__dirty__big_fish__B: Lipless Crankbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait
- vt_champlain_smb__2025-12-12__freshwater_lake_pond__stained__big_fish__B: Lipless Crankbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait
- vt_champlain_smb__2025-12-12__freshwater_lake_pond__dirty__big_fish__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait

## Surface Safety Expansion Check

| Surface gate | Slots checked | Surface finalist IDs |
| --- | --- | --- |
| closed | 1536 | 0 |
| caution | 336 | 2 |

Caution-gate surface finalist examples:
- co_yampa__2025-07-12__freshwater_river__stained__big_fish__B lure/honorable: buzzbait
- co_yampa__2025-07-12__freshwater_river__dirty__big_fish__B lure/honorable: buzzbait

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Foam Gurgler<br>foam_gurgler_fly | fly | largemouth_bass, smallmouth_bass, northern_pike | fly_gurgler | surface_fly_gurgler | surface<br>medium/slow | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 9 |
| Sculpin Streamer<br>sculpin_streamer | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: current_swing, cold_slow, runoff_streamer | 1: reliable_action | freshwater_river | false | 9 |
| Buzzbait<br>buzzbait | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_buzz | topwater_open | surface<br>fast/medium | 2: surface_prey, baitfish | 2: stained, dirty | 3: low_light_surface, wind_reaction, dirty_vibration | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 9 |
| Glide Bait<br>glidebait | lure | largemouth_bass, smallmouth_bass | hard_swimbait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 3: clear_subtle, open_water_search, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | largemouth_bass, smallmouth_bass | soft_plastic_craw | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 4: cover_ambush, cold_slow, clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Wake Bait<br>wake_bait | lure | largemouth_bass, smallmouth_bass | surface_wake | topwater_open | surface<br>slow/medium | 3: surface_prey, baitfish, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Deer Hair Slider<br>deer_hair_slider | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_slider | surface_fly_slider | surface<br>medium/fast | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | true | 8 |
| Popper Fly<br>popper_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_popper | surface_fly_popper_slider | surface<br>medium/slow | 2: surface_prey, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 8 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | smallmouth_bass | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 8 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 2: leech_worm, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 2: reliable_action, versatile_search | freshwater_lake_pond | false | 8 |
| Compact Glide Bait<br>compact_glidebait | lure | smallmouth_bass | hard_swimbait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Finesse Jig<br>finesse_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, leech_worm | 2: clear, stained | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Hair Jig<br>hair_jig | lure | smallmouth_bass, trout | hair_jig | hair_jig | bottom<br>slow/medium | 2: baitfish, leech_worm | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 8 |
| Inline Spinner<br>inline_spinner | lure | smallmouth_bass, trout, northern_pike | spinner | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | largemouth_bass, smallmouth_bass | crankbait_medium | crankbait | mid<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 0: none | freshwater_lake_pond, freshwater_river | false | 8 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | largemouth_bass, smallmouth_bass, northern_pike | swimbait | swimbait | mid<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Shaky-Head Worm<br>shaky_head_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium/fast | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: cover_ambush, dirty_vibration, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Walking Topwater<br>walking_topwater | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_walking | topwater_open | surface<br>medium | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 8 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | upper<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: clear_subtle, heat_finesse | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | smallmouth_bass, northern_pike, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Conehead Streamer<br>conehead_streamer | fly | smallmouth_bass, trout | streamer_weighted | baitfish_streamer | mid<br>medium | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Crawfish Streamer<br>crawfish_streamer | fly | smallmouth_bass, trout | crawfish_fly | crawfish_fly | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: current_swing, clear_subtle | 1: reliable_action | freshwater_river | false | 7 |
| Deceiver<br>deceiver | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_baitfish | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Feather Jig Leech<br>feather_jig_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: warming_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, clear_subtle | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Muddler Minnow<br>muddler_sculpin | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Sculpzilla<br>sculpzilla | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow/medium | 2: baitfish, crawfish | 2: stained, dirty | 2: runoff_streamer, current_swing | 1: big_fish_upside | freshwater_river | false | 7 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | largemouth_bass, smallmouth_bass | crawfish_fly | crawfish_fly | bottom<br>slow/medium | 1: crawfish | 3: clear, stained, dirty | 2: cover_ambush, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Woolly Bugger<br>woolly_bugger | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | bugger_streamer | leech_bugger | mid<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Zonker Streamer<br>zonker_streamer | fly | smallmouth_bass, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 2: cold_slow, open_water_search | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | largemouth_bass, smallmouth_bass | soft_plastic_minnow | drop_shot_minnow | mid<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Football Jig<br>football_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: cold_slow, cover_ambush | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | largemouth_bass, smallmouth_bass | jerkbait | jerkbait | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, open_water_search | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | jerkbait_soft | jerkbait | upper<br>medium/slow | 1: baitfish | 2: clear, stained | 2: clear_subtle, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Spinnerbait<br>spinnerbait | lure | largemouth_bass, smallmouth_bass, northern_pike | safety_pin_spinner | spinner_vibration | mid<br>medium/slow | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, dirty_vibration, cover_ambush | 0: none | freshwater_lake_pond, freshwater_river | false | 7 |
| Swim Jig<br>swim_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_swimming | swim_jig | mid<br>medium/fast | 2: bluegill_perch, baitfish | 2: stained, dirty | 2: cover_ambush, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Tube Jig<br>tube_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium | 1: baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 6 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | smallmouth_bass, trout | streamer_sparse | baitfish_streamer | upper<br>medium/fast | 1: baitfish | 1: clear | 2: clear_subtle, current_swing | 1: reliable_action | freshwater_river | false | 5 |
| Bladed Jig<br>bladed_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | bladed_jig | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: dirty_vibration, cover_ambush | 0: none | freshwater_lake_pond, freshwater_river | false | 5 |
| Lipless Crankbait<br>lipless_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_lipless | crankbait | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: wind_reaction, open_water_search | 0: none | freshwater_lake_pond, freshwater_river | false | 5 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 145/612 | 83/408 | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 34/168 | 0/0 | goal_tags>1 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 118/480 | 8/28 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 93/612 | 53/408 | goal_tags>1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 14/144 | 11/96 | clear+stained+dirty clarity |
| Deceiver<br>deceiver | fly | 7 | 96/612 | 92/408 | clear+stained+dirty clarity<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 35/228 | 35/144 | clear+stained+dirty clarity<br>home-window share>20% |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 19/612 | 0/0 | clear+stained+dirty clarity |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 32/228 | 32/144 | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Game Changer<br>game_changer | fly | 7 | 152/612 | 98/408 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 25/612 | 0/0 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 24/612 | 0/0 | clear+stained+dirty clarity |
| Popper Fly<br>popper_fly | fly | 8 | 17/228 | 17/144 | goal_tags>1 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 132/612 | 67/308 | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 21/144 | 14/96 | clear+stained+dirty clarity |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 36/348 | 19/92 | clear+stained+dirty clarity<br>home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 41/612 | 29/216 | clear+stained+dirty clarity |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 8 | 113/540 | 82/360 | home-window share>20% |
| Blade Bait<br>blade_bait | lure | 7 | 18/612 | 10/272 | clear+stained+dirty clarity |
| Buzzbait<br>buzzbait | lure | 9 | 30/228 | 27/144 | goal_tags>1<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 25/468 | 17/152 | goal_tags>1 |
| Compact Glide Bait<br>compact_glidebait | lure | 8 | 66/300 | 0/0 | goal_tags>1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 17/468 | 6/240 | clear+stained+dirty clarity |
| Football Jig<br>football_jig | lure | 7 | 76/468 | 21/120 | clear+stained+dirty clarity |
| Glide Bait<br>glidebait | lure | 9 | 2/36 | 0/0 | goal_tags>1 |
| Inline Spinner<br>inline_spinner | lure | 8 | 113/612 | 15/80 | goal_tags>1 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7 | 76/360 | 41/84 | home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 125/612 | 96/320 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Ned Rig<br>ned_rig | lure | 9 | 22/612 | 14/216 | clear+stained+dirty clarity |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 23/612 | 5/408 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 1/132 | 0/48 | clear+stained+dirty clarity |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 41/480 | 14/76 | goal_tags>1 |
| Spinnerbait<br>spinnerbait | lure | 7 | 35/612 | 35/320 | wind+dirty+stained/dirty clarity |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 42/480 | 41/248 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 118/612 | 32/216 | goal_tags>1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 20/612 | 13/216 | condition_tags>3<br>clear+stained+dirty clarity |
| Wake Bait<br>wake_bait | lure | 9 | 16/168 | 16/96 | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Walking Topwater<br>walking_topwater | lure | 8 | 31/228 | 31/144 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 18/156 | 5/24 | clear+stained+dirty clarity<br>goal_tags>1 |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 7 | 152/612 (24.8%) | 98/408 (24%) | big_fish:134, all_purpose:18 | honorable:79, top:73 | wind_reaction:83, dirty_vibration:58, warming_search:41, cold_slow:33, calm_surface:31 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 145/612 (23.7%) | 83/408 (20.3%) | big_fish:127, all_purpose:18 | honorable:76, top:69 | wind_reaction:74, dirty_vibration:57, warming_search:37, cold_slow:32, calm_surface:29 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 132/612 (21.6%) | 67/308 (21.8%) | big_fish:119, all_purpose:13 | honorable:107, top:25 | wind_reaction:77, dirty_vibration:59, cold_slow:50, warming_search:36, open_water_search:14 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 125/612 (20.4%) | 96/320 (30%) | big_fish:67, all_purpose:58 | top:82, honorable:43 | wind_reaction:115, dirty_vibration:90, open_water_search:33, warming_search:31, cold_slow:26 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 118/480 (24.6%) | 8/28 (28.6%) | all_purpose:76, big_fish:42 | honorable:66, top:52 | wind_reaction:93, dirty_vibration:72, warming_search:30, low_light_surface:19, open_water_search:18 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 118/612 (19.3%) | 32/216 (14.8%) | all_purpose:102, big_fish:16 | top:62, honorable:56 | wind_reaction:99, dirty_vibration:72, cold_slow:33, warming_search:23, open_water_search:19 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 8 | 113/540 (20.9%) | 82/360 (22.8%) | big_fish:113 | honorable:76, top:37 | wind_reaction:54, dirty_vibration:41, cold_slow:30, warming_search:30, calm_surface:23 |
| Inline Spinner<br>inline_spinner | lure | 8 | 113/612 (18.5%) | 15/80 (18.8%) | all_purpose:101, big_fish:12 | top:61, honorable:52 | wind_reaction:86, dirty_vibration:63, warming_search:28, open_water_search:23, cold_slow:22 |
| Deceiver<br>deceiver | fly | 7 | 96/612 (15.7%) | 92/408 (22.5%) | all_purpose:64, big_fish:32 | top:75, honorable:21 | wind_reaction:92, dirty_vibration:76, open_water_search:29, cold_slow:23, warming_search:13 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 93/612 (15.2%) | 53/408 (13%) | all_purpose:93 | honorable:55, top:38 | wind_reaction:40, warming_search:34, dirty_vibration:29, calm_surface:21, clear_subtle:15 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 90/612 (14.7%) | 0/0 | all_purpose:70, big_fish:20 | top:76, honorable:14 | wind_reaction:83, dirty_vibration:60, open_water_search:25, warming_search:18, cold_slow:11 |
| Football Jig<br>football_jig | lure | 7 | 76/468 (16.2%) | 21/120 (17.5%) | big_fish:76 | honorable:58, top:18 | wind_reaction:46, dirty_vibration:29, warming_search:26, cold_slow:21, open_water_search:10 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7 | 76/360 (21.1%) | 41/84 (48.8%) | big_fish:76 | honorable:49, top:27 | wind_reaction:33, cold_slow:26, dirty_vibration:25, warming_search:25, clear_subtle:10 |
| Tube Jig<br>tube_jig | lure | 7 | 67/612 (10.9%) | 61/408 (15%) | all_purpose:54, big_fish:13 | top:49, honorable:18 | cold_slow:42, wind_reaction:30, clear_subtle:22, dirty_vibration:12, warming_search:10 |
| Compact Glide Bait<br>compact_glidebait | lure | 8 | 66/300 (22%) | 0/0 | big_fish:66 | honorable:42, top:24 | wind_reaction:35, dirty_vibration:23, calm_surface:18, clear_subtle:13, open_water_search:12 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 42/480 (8.8%) | 41/248 (16.5%) | all_purpose:32, big_fish:10 | honorable:22, top:20 | dirty_vibration:40, wind_reaction:28, cold_slow:12, current_swing:12, calm_surface:6 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 41/480 (8.5%) | 14/76 (18.4%) | all_purpose:41 | honorable:21, top:20 | calm_surface:20, clear_subtle:15, warming_search:11, wind_reaction:10, low_light_surface:7 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 41/612 (6.7%) | 29/216 (13.4%) | all_purpose:34, big_fish:7 | honorable:30, top:11 | cold_slow:28, warming_search:13, dirty_vibration:12, wind_reaction:10, clear_subtle:5 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 36/348 (10.3%) | 19/92 (20.7%) | all_purpose:32, big_fish:4 | honorable:20, top:16 | wind_reaction:16, cold_slow:12, clear_subtle:11, dirty_vibration:8, warming_search:8 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 35/228 (15.4%) | 35/144 (24.3%) | big_fish:35 | honorable:18, top:17 | calm_surface:27, low_light_surface:17, current_swing:9, dirty_vibration:9, wind_reaction:8 |
| Spinnerbait<br>spinnerbait | lure | 7 | 35/612 (5.7%) | 35/320 (10.9%) | all_purpose:19, big_fish:16 | honorable:19, top:16 | dirty_vibration:35, wind_reaction:24, warming_search:13, current_swing:10, cold_slow:7 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 34/168 (20.2%) | 0/0 | big_fish:34 | honorable:17, top:17 | cold_slow:23, wind_reaction:21, dirty_vibration:18, warming_search:9, current_swing:6 |
| Bladed Jig<br>bladed_jig | lure | 5 | 33/612 (5.4%) | 33/272 (12.1%) | big_fish:17, all_purpose:16 | top:20, honorable:13 | dirty_vibration:33, wind_reaction:18, cold_slow:12, current_swing:12, warming_search:11 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 32/228 (14%) | 32/144 (22.2%) | all_purpose:29, big_fish:3 | top:23, honorable:9 | calm_surface:28, low_light_surface:13, clear_subtle:7, dirty_vibration:6, warming_search:6 |
| Walking Topwater<br>walking_topwater | lure | 8 | 31/228 (13.6%) | 31/144 (21.5%) | big_fish:31 | top:26, honorable:5 | calm_surface:24, low_light_surface:14, current_swing:9, dirty_vibration:8, wind_reaction:7 |
| Buzzbait<br>buzzbait | lure | 9 | 30/228 (13.2%) | 27/144 (18.8%) | big_fish:25, all_purpose:5 | top:20, honorable:10 | low_light_surface:19, calm_surface:18, dirty_vibration:16, current_swing:12, wind_reaction:12 |
| Sculpzilla<br>sculpzilla | fly | 7 | 29/144 (20.1%) | 26/132 (19.7%) | big_fish:29 | top:17, honorable:12 | dirty_vibration:18, current_swing:15, cold_slow:12, wind_reaction:12, calm_surface:9 |
| Lipless Crankbait<br>lipless_crankbait | lure | 5 | 27/612 (4.4%) | 27/320 (8.4%) | all_purpose:14, big_fish:13 | top:19, honorable:8 | dirty_vibration:27, wind_reaction:27, open_water_search:19, cold_slow:2, low_light_surface:2 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 25/468 (5.3%) | 17/152 (11.2%) | all_purpose:22, big_fish:3 | honorable:14, top:11 | cold_slow:14, wind_reaction:10, warming_search:8, clear_subtle:7, open_water_search:6 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 25/612 (4.1%) | 0/0 | all_purpose:25 | honorable:15, top:10 | cold_slow:21, wind_reaction:14, dirty_vibration:8, open_water_search:5, clear_subtle:3 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 25/480 (5.2%) | 4/28 (14.3%) | all_purpose:18, big_fish:7 | honorable:14, top:11 | clear_subtle:13, wind_reaction:11, warming_search:6, calm_surface:5, dirty_vibration:4 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 24/612 (3.9%) | 0/0 | all_purpose:22, big_fish:2 | top:15, honorable:9 | clear_subtle:12, cold_slow:11, wind_reaction:10, warming_search:8, dirty_vibration:4 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 23/612 (3.8%) | 5/408 (1.2%) | all_purpose:15, big_fish:8 | honorable:16, top:7 | warming_search:20, calm_surface:7, low_light_surface:4, current_swing:1, wind_reaction:1 |
| Ned Rig<br>ned_rig | lure | 9 | 22/612 (3.6%) | 14/216 (6.5%) | all_purpose:18, big_fish:4 | honorable:14, top:8 | cold_slow:16, wind_reaction:10, clear_subtle:8, warming_search:3, dirty_vibration:2 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 22/612 (3.6%) | 11/76 (14.5%) | all_purpose:20, big_fish:2 | honorable:15, top:7 | warming_search:12, clear_subtle:11, calm_surface:8, current_swing:2, wind_reaction:2 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 21/144 (14.6%) | 14/96 (14.6%) | all_purpose:21 | top:13, honorable:8 | cold_slow:16, dirty_vibration:12, wind_reaction:11, current_swing:7, calm_surface:4 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 20/612 (3.3%) | 13/216 (6%) | all_purpose:15, big_fish:5 | honorable:13, top:7 | cold_slow:16, clear_subtle:7, wind_reaction:7, warming_search:3, dirty_vibration:2 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 19/612 (3.1%) | 0/0 | all_purpose:12, big_fish:7 | honorable:11, top:8 | warming_search:19, current_swing:3, dirty_vibration:3, wind_reaction:2, calm_surface:1 |
| Finesse Jig<br>finesse_jig | lure | 8 | 18/612 (2.9%) | 11/216 (5.1%) | all_purpose:17, big_fish:1 | honorable:9, top:9 | cold_slow:13, wind_reaction:10, clear_subtle:5, dirty_vibration:3, warming_search:3 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 18/156 (11.5%) | 5/24 (20.8%) | all_purpose:18 | top:11, honorable:7 | calm_surface:7, clear_subtle:5, wind_reaction:5, dirty_vibration:3, heat_finesse:3 |
| Blade Bait<br>blade_bait | lure | 7 | 18/612 (2.9%) | 10/272 (3.7%) | all_purpose:11, big_fish:7 | top:13, honorable:5 | cold_slow:14, wind_reaction:14, open_water_search:11, dirty_vibration:8, warming_search:3 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 18/144 (12.5%) | 13/96 (13.5%) | all_purpose:17, big_fish:1 | top:12, honorable:6 | cold_slow:14, wind_reaction:10, current_swing:6, dirty_vibration:6, clear_subtle:5 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 17/468 (3.6%) | 6/240 (2.5%) | all_purpose:13, big_fish:4 | top:9, honorable:8 | cold_slow:8, wind_reaction:5, calm_surface:4, dirty_vibration:3, open_water_search:3 |
| Popper Fly<br>popper_fly | fly | 8 | 17/228 (7.5%) | 17/144 (11.8%) | all_purpose:17 | top:14, honorable:3 | calm_surface:16, low_light_surface:6, clear_subtle:2, warming_search:2, cold_slow:1 |
| Wake Bait<br>wake_bait | lure | 9 | 16/168 (9.5%) | 16/96 (16.7%) | big_fish:16 | top:13, honorable:3 | calm_surface:14, low_light_surface:6, clear_subtle:4, dirty_vibration:2, wind_reaction:2 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 14/144 (9.7%) | 11/96 (11.5%) | all_purpose:12, big_fish:2 | honorable:8, top:6 | clear_subtle:7, cold_slow:7, wind_reaction:7, current_swing:6, dirty_vibration:5 |
| Swim Jig<br>swim_jig | lure | 7 | 12/612 (2%) | 6/356 (1.7%) | all_purpose:12 | honorable:9, top:3 | warming_search:7, calm_surface:6, low_light_surface:2, current_swing:1, dirty_vibration:1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 11/144 (7.6%) | 11/120 (9.2%) | all_purpose:7, big_fish:4 | top:7, honorable:4 | dirty_vibration:10, wind_reaction:9, current_swing:5, warming_search:5, low_light_surface:4 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 6 | 11/480 (2.3%) | 0/248 (0%) | big_fish:6, all_purpose:5 | top:10, honorable:1 | cold_slow:4, clear_subtle:3, wind_reaction:3, calm_surface:2, none:2 |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 9/144 (6.3%) | 9/120 (7.5%) | all_purpose:7, big_fish:2 | top:5, honorable:4 | wind_reaction:8, dirty_vibration:7, current_swing:4, low_light_surface:4, cold_slow:3 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 5 | 8/120 (6.7%) | 0/0 | all_purpose:7, big_fish:1 | honorable:6, top:2 | calm_surface:5, clear_subtle:5, current_swing:5, cold_slow:2, dirty_vibration:2 |
| Hair Jig<br>hair_jig | lure | 8 | 6/144 (4.2%) | 5/96 (5.2%) | all_purpose:3, big_fish:3 | honorable:5, top:1 | current_swing:5, cold_slow:4, clear_subtle:2, dirty_vibration:2, calm_surface:1 |
| Glide Bait<br>glidebait | lure | 9 | 2/36 (5.6%) | 0/0 | big_fish:2 | honorable:1, top:1 | wind_reaction:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 1/132 (0.8%) | 0/48 (0%) | all_purpose:1 | top:1 | warming_search:1 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 152/612 (24.8%) | 98/408 (24%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 145/612 (23.7%) | 83/408 (20.3%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 132/612 (21.6%) | 67/308 (21.8%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 125/612 (20.4%) | 96/320 (30%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 118/480 (24.6%) | 8/28 (28.6%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 113/540 (20.9%) | 82/360 (22.8%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | home-window share>20% |
| Deceiver<br>deceiver | fly | 96/612 (15.7%) | 92/408 (22.5%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 76/360 (21.1%) | 41/84 (48.8%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Compact Glide Bait<br>compact_glidebait | lure | 66/300 (22%) | 0/0 | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 36/348 (10.3%) | 19/92 (20.7%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 35/228 (15.4%) | 35/144 (24.3%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 32/228 (14%) | 32/144 (22.2%) | catalog_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Walking Topwater<br>walking_topwater | lure | 31/228 (13.6%) | 31/144 (21.5%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 216 | 14/216 (6.5%) | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):8, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):8, Suspending Jerkbait (top), Inline Spinner (honorable):7, Tube Jig (top), Drop-Shot Minnow (honorable):7 | selector/direct-score or overpowered competitors |
| Tube Jig<br>tube_jig | lure | forage 2: crawfish, baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, cold_slow<br>goal 1: reliable_action | 408 | 61/408 (15%) | Suspending Jerkbait (top), Inline Spinner (honorable):14, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):13, Inline Spinner (top), Suspending Jerkbait (honorable):13, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):12 | healthy / not underused |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | forage 2: crawfish, baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: big_fish_upside | 360 | 82/360 (22.8%) | Inline Spinner (top), Suspending Jerkbait (honorable):13, Suspending Jerkbait (top), Inline Spinner (honorable):13, Inline Spinner (top), Medium-Diving Crankbait (honorable):7, Medium-Diving Crankbait (top), Suspending Jerkbait (honorable):7 | healthy / not underused |
| Finesse Jig<br>finesse_jig | lure | forage 2: crawfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 216 | 11/216 (5.1%) | Magnum Jerkbait (top), Big Smallmouth Tube (honorable):10, Buzzbait (top), Big Smallmouth Tube (honorable):8, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7, Tube Jig (top), Drop-Shot Minnow (honorable):7 | selector/direct-score or overpowered competitors |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 4: cover_ambush, cold_slow, clear_subtle, heat_finesse<br>goal 1: reliable_action | 216 | 13/216 (6%) | Magnum Jerkbait (top), Big Smallmouth Tube (honorable):10, Buzzbait (top), Big Smallmouth Tube (honorable):8, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7, Tube Jig (top), Drop-Shot Minnow (honorable):7 | selector/direct-score or overpowered competitors |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, heat_finesse<br>goal 1: reliable_action | 76 | 11/76 (14.5%) | Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):4, Big Smallmouth Tube (top), Compact Glide Bait (honorable):3, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):3, Tube Jig (top), Finesse Jig (honorable):3 | healthy / not underused |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 216 | 32/216 (14.8%) | Magnum Jerkbait (top), Big Smallmouth Tube (honorable):11, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):10, Big Smallmouth Tube (top), Football Jig (honorable):5, Tube Jig (top), Drop-Shot Minnow (honorable):5 | healthy / not underused |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 96 | 5/96 (5.2%) | Buzzbait (top), Big Smallmouth Tube (honorable):7, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):7, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):4, Tube Jig (top), Soft Plastic Jerkbait (honorable):4 | selector/direct-score or overpowered competitors |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 80 | 15/80 (18.8%) | Magnum Jerkbait (top), Big Smallmouth Tube (honorable):5, Buzzbait (top), Big Smallmouth Tube (honorable):4, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):3, Medium-Diving Crankbait (top), Big Smallmouth Tube (honorable):3 | healthy / not underused |
| Bladed Jig<br>bladed_jig | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: dirty_vibration, cover_ambush<br>goal 0: none | 272 | 33/272 (12.1%) | Medium-Diving Crankbait (top), Football Jig (honorable):17, Inline Spinner (top), Suspending Jerkbait (honorable):16, Medium-Diving Crankbait (top), Big Smallmouth Tube (honorable):11, Suspending Jerkbait (top), Inline Spinner (honorable):11 | healthy / not underused |
| Lipless Crankbait<br>lipless_crankbait | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 0: none | 320 | 27/320 (8.4%) | Inline Spinner (top), Suspending Jerkbait (honorable):17, Medium-Diving Crankbait (top), Football Jig (honorable):17, Suspending Jerkbait (top), Inline Spinner (honorable):12, Medium-Diving Crankbait (top), Big Smallmouth Tube (honorable):11 | selector/direct-score or overpowered competitors |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish Streamer (articulated_baitfish_streamer), Compact Glide Bait (compact_glidebait), Foam Gurgler (foam_gurgler_fly), Game Changer (game_changer), Rabbit-Strip Leech (rabbit_strip_leech), Walking Topwater (walking_topwater)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish Streamer (articulated_baitfish_streamer), Baitfish Slider Fly (baitfish_slider_fly), Big Smallmouth Tube (big_smallmouth_tube), Compact Glide Bait (compact_glidebait), Deceiver (deceiver), Deer Hair Slider (deer_hair_slider), Foam Gurgler (foam_gurgler_fly), Game Changer (game_changer), Magnum Jerkbait (magnum_jerkbait), Medium-Diving Crankbait (medium_diving_crankbait), Rabbit-Strip Leech (rabbit_strip_leech), Walking Topwater (walking_topwater), Warmwater Crawfish Fly (warmwater_crawfish_fly)

### Probably selector problem, not catalog problem
Finesse Jig (finesse_jig), Hair Jig (hair_jig), Lipless Crankbait (lipless_crankbait), Ned Rig (ned_rig), Texas-Rigged Soft-Plastic Craw (texas_rigged_soft_plastic_craw)

## Utilization Notes / Coverage Gaps

- 1 low-use profile(s) were often close to selected winners, which leans toward selector/catalog balance rather than pure scenario coverage.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Articulated Baitfish Streamer, Clouser Minnow, Game Changer, Rabbit-Strip Leech, Woolly Bugger, Deer Hair Slider, Sculpzilla, Bucktail Streamer, Crawfish Streamer, Muddler Minnow, Sculpin Streamer, Warmwater Crawfish Fly, Tube Jig, Big Smallmouth Tube, Lipless Crankbait, Spinnerbait, Bladed Jig, Suspending Jerkbait, Buzzbait, Walking Topwater, Football Jig, Inline Spinner, Drop-Shot Minnow, Soft Plastic Jerkbait |
| underused_home_window | Conehead Streamer, Paddle-Tail Swimbait, Blade Bait, Flat-Sided Crankbait, Finesse Jig, Ned Rig, Texas-Rigged Soft-Plastic Craw, Hair Jig |
| no_home_window_coverage | None |
| over-dominant | Medium-Diving Crankbait, Magnum Jerkbait |
| probably okay niche profile | None |

## SMB Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 11.8% | 145/612 | 83/408 | 145 | 83 | 20.3% | 5/204 | 78/204 | 118 | healthy | activity neutral:300, active:96, suppressed:12<br>clarity clear:136, dirty:136, stained:136<br>water freshwater_lake_pond:288, freshwater_river:120<br>bucket dirty_vibration:128, breezy_windy_stained_reaction:116, cold_slow_or_front:68 | Deceiver (top), Baitfish Slider Fly (honorable):18, Game Changer (top), Rabbit-Strip Leech (honorable):15, Clouser Minnow (honorable), Zonker Streamer (top):13 |
| Clouser Minnow<br>clouser_minnow | fly | 7.6% | 93/612 | 53/408 | 93 | 53 | 13% | 53/204 | 0/204 | 140 | healthy | activity neutral:300, active:96, suppressed:12<br>clarity clear:136, dirty:136, stained:136<br>water freshwater_lake_pond:288, freshwater_river:120<br>bucket dirty_vibration:128, breezy_windy_stained_reaction:116, cold_slow_or_front:68 | Deceiver (top), Baitfish Slider Fly (honorable):18, Game Changer (top), Rabbit-Strip Leech (honorable):15, Deceiver (top), Rabbit-Strip Leech (honorable):12 |
| Game Changer<br>game_changer | fly | 12.4% | 152/612 | 98/408 | 152 | 98 | 24% | 13/204 | 85/204 | 106 | healthy | activity neutral:300, active:96, suppressed:12<br>clarity clear:136, dirty:136, stained:136<br>water freshwater_lake_pond:288, freshwater_river:120<br>bucket dirty_vibration:128, breezy_windy_stained_reaction:116, cold_slow_or_front:68 | Deceiver (top), Baitfish Slider Fly (honorable):18, Clouser Minnow (honorable), Zonker Streamer (top):13, Deceiver (top), Rabbit-Strip Leech (honorable):12 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 10.8% | 132/612 | 67/308 | 132 | 67 | 21.8% | 9/154 | 58/154 | 81 | healthy | activity neutral:236, suppressed:48, active:24<br>clarity clear:144, stained:92, dirty:72<br>water freshwater_lake_pond:176, freshwater_river:132<br>bucket cold_slow_or_front:128, dirty_vibration:56, breezy_windy_stained_reaction:40 | Game Changer (top), Articulated Baitfish Streamer (honorable):7, Articulated Baitfish Streamer (top), Game Changer (honorable):6, Game Changer (honorable), Articulated Baitfish Streamer (top):6 |
| Woolly Bugger<br>woolly_bugger | fly | 3.3% | 41/612 | 29/216 | 41 | 29 | 13.4% | 24/108 | 5/108 | 63 | healthy | activity neutral:156, suppressed:48, active:12<br>clarity clear:72, dirty:72, stained:72<br>water freshwater_river:120, freshwater_lake_pond:96<br>bucket cold_slow_or_front:88, dirty_vibration:56, breezy_windy_stained_reaction:40 | Game Changer (top), Rabbit-Strip Leech (honorable):7, Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):7, Articulated Baitfish Streamer (top), Game Changer (honorable):5 |
| Deer Hair Slider<br>deer_hair_slider | fly | 2.9% | 35/228 | 35/144 | 35 | 35 | 24.3% | 0/72 | 35/72 | 39 | healthy | activity neutral:108, active:36<br>clarity clear:48, dirty:48, stained:48<br>water freshwater_lake_pond:96, freshwater_river:48<br>bucket stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:36, cold_slow_or_front:28 | Articulated Baitfish Streamer (top), Game Changer (honorable):5, Foam Gurgler (top), Baitfish Slider Fly (honorable):5, Game Changer (top), Rabbit-Strip Leech (honorable):5 |
| Sculpzilla<br>sculpzilla | fly | 2.4% | 29/144 | 26/132 | 29 | 26 | 19.7% | 0/66 | 26/66 | 42 | healthy | activity neutral:104, active:16, suppressed:12<br>clarity clear:48, stained:44, dirty:40<br>water freshwater_river:132<br>bucket cold_slow_or_front:40, dirty_vibration:32, breezy_windy_stained_reaction:20 | Articulated Baitfish Streamer (top), Game Changer (honorable):3, Muddler Minnow (top), Crawfish Streamer (honorable):3, Muddler Minnow (top), Jighead Marabou Leech (honorable):3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0.9% | 11/144 | 11/120 | 11 | 11 | 9.2% | 7/60 | 4/60 | 44 | healthy | activity neutral:84, active:24, suppressed:12<br>clarity clear:40, dirty:40, stained:40<br>water freshwater_river:120<br>bucket dirty_vibration:36, breezy_windy_stained_reaction:24, cold_slow_or_front:24 | Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Articulated Baitfish Streamer (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3 |
| Conehead Streamer<br>conehead_streamer | fly | 0.7% | 9/144 | 9/120 | 9 | 9 | 7.5% | 7/60 | 2/60 | 46 | underused_home_window | activity neutral:84, active:24, suppressed:12<br>clarity clear:40, dirty:40, stained:40<br>water freshwater_river:120<br>bucket dirty_vibration:36, breezy_windy_stained_reaction:24, cold_slow_or_front:24 | Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Articulated Baitfish Streamer (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 1.1% | 14/144 | 11/96 | 14 | 11 | 11.5% | 9/48 | 2/48 | 20 | healthy | activity neutral:68, active:16, suppressed:12<br>clarity clear:48, stained:28, dirty:20<br>water freshwater_river:96<br>bucket cold_slow_or_front:36, dirty_vibration:16, calm_low_light_surface:12 | Deer Hair Slider (honorable), Sculpzilla (top):3, Sculpzilla (top), Articulated Dungeon Streamer (honorable):3, Sculpzilla (top), Deer Hair Slider (honorable):3 |
| Muddler Minnow<br>muddler_sculpin | fly | 1.5% | 18/144 | 13/96 | 18 | 13 | 13.5% | 12/48 | 1/48 | 47 | healthy | activity neutral:68, active:16, suppressed:12<br>clarity clear:48, stained:28, dirty:20<br>water freshwater_river:96<br>bucket cold_slow_or_front:36, dirty_vibration:16, calm_low_light_surface:12 | Deer Hair Slider (honorable), Sculpzilla (top):3, Sculpzilla (top), Articulated Dungeon Streamer (honorable):3, Sculpzilla (top), Deer Hair Slider (honorable):3 |
| Sculpin Streamer<br>sculpin_streamer | fly | 1.7% | 21/144 | 14/96 | 21 | 14 | 14.6% | 14/48 | 0/48 | 52 | healthy | activity neutral:68, active:16, suppressed:12<br>clarity clear:48, stained:28, dirty:20<br>water freshwater_river:96<br>bucket cold_slow_or_front:36, dirty_vibration:16, calm_low_light_surface:12 | Deer Hair Slider (honorable), Sculpzilla (top):3, Muddler Minnow (top), Crawfish Streamer (honorable):3, Sculpzilla (top), Articulated Dungeon Streamer (honorable):3 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 2.9% | 36/348 | 19/92 | 36 | 19 | 20.7% | 16/46 | 3/46 | 20 | healthy | activity neutral:80, active:8, suppressed:4<br>clarity clear:76, stained:16<br>water freshwater_lake_pond:92<br>bucket cold_slow_or_front:48, calm_bright_clear_subtle:16, stable_pleasant_medium_confidence_archive:12 | Game Changer (top), Rabbit-Strip Leech (honorable):7, Game Changer (honorable), Articulated Baitfish Streamer (top):5, Game Changer (top), Articulated Baitfish Streamer (honorable):4 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 1.9% | 23/612 | 5/408 | 23 | 5 | 1.2% | 5/204 | 0/204 | 40 | underused_home_window | activity neutral:300, active:96, suppressed:12<br>clarity clear:136, dirty:136, stained:136<br>water freshwater_lake_pond:288, freshwater_river:120<br>bucket dirty_vibration:128, breezy_windy_stained_reaction:116, cold_slow_or_front:68 | Inline Spinner (top), Suspending Jerkbait (honorable):21, Medium-Diving Crankbait (top), Football Jig (honorable):16, Inline Spinner (honorable), Suspending Jerkbait (top):11 |
| Tube Jig<br>tube_jig | lure | 5.5% | 67/612 | 61/408 | 67 | 61 | 15% | 49/204 | 12/204 | 104 | healthy | activity neutral:272, active:104, suppressed:32<br>clarity clear:204, stained:204<br>water freshwater_lake_pond:312, freshwater_river:96<br>bucket breezy_windy_stained_reaction:116, cold_slow_or_front:116, warming_search:68 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):11, Inline Spinner (top), Suspending Jerkbait (honorable):11, Inline Spinner (honorable), Suspending Jerkbait (top):9 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 9.2% | 113/540 | 82/360 | 113 | 82 | 22.8% | 0/180 | 82/180 | 81 | healthy | activity neutral:240, active:96, suppressed:24<br>clarity clear:180, stained:180<br>water freshwater_lake_pond:272, freshwater_river:88<br>bucket breezy_windy_stained_reaction:96, cold_slow_or_front:96, warming_search:60 | Inline Spinner (top), Suspending Jerkbait (honorable):11, Inline Spinner (honorable), Suspending Jerkbait (top):8, Tube Jig (top), Drop-Shot Minnow (honorable):7 |
| Lipless Crankbait<br>lipless_crankbait | lure | 2.2% | 27/612 | 27/320 | 27 | 27 | 8.4% | 14/160 | 13/160 | 74 | healthy | activity neutral:200, active:104, suppressed:16<br>clarity dirty:160, stained:160<br>water freshwater_lake_pond:240, freshwater_river:80<br>bucket dirty_vibration:132, breezy_windy_stained_reaction:116, warming_search:36 | Inline Spinner (top), Suspending Jerkbait (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):8 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 10.2% | 125/612 | 96/320 | 125 | 96 | 30% | 46/160 | 50/160 | 124 | over-dominant | activity neutral:200, active:104, suppressed:16<br>clarity dirty:160, stained:160<br>water freshwater_lake_pond:240, freshwater_river:80<br>bucket dirty_vibration:132, breezy_windy_stained_reaction:116, warming_search:36 | Inline Spinner (top), Suspending Jerkbait (honorable):14, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):8, Buzzbait (top), Big Smallmouth Tube (honorable):7 |
| Spinnerbait<br>spinnerbait | lure | 2.9% | 35/612 | 35/320 | 35 | 35 | 10.9% | 19/160 | 16/160 | 63 | healthy | activity neutral:200, active:104, suppressed:16<br>clarity dirty:160, stained:160<br>water freshwater_lake_pond:240, freshwater_river:80<br>bucket dirty_vibration:132, breezy_windy_stained_reaction:116, warming_search:36 | Inline Spinner (top), Suspending Jerkbait (honorable):14, Medium-Diving Crankbait (top), Football Jig (honorable):12, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):8 |
| Blade Bait<br>blade_bait | lure | 1.5% | 18/612 | 10/272 | 18 | 10 | 3.7% | 6/136 | 4/136 | 49 | underused_home_window | activity neutral:192, active:48, suppressed:32<br>clarity clear:136, stained:136<br>water freshwater_lake_pond:208, freshwater_river:64<br>bucket breezy_windy_stained_reaction:116, cold_slow_or_front:100, stable_pleasant_medium_confidence_archive:32 | Inline Spinner (top), Suspending Jerkbait (honorable):11, Inline Spinner (honorable), Suspending Jerkbait (top):8, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7 |
| Bladed Jig<br>bladed_jig | lure | 2.7% | 33/612 | 33/272 | 33 | 33 | 12.1% | 16/136 | 17/136 | 60 | healthy | activity neutral:200, active:56, suppressed:16<br>clarity dirty:136, stained:136<br>water freshwater_lake_pond:192, freshwater_river:80<br>bucket dirty_vibration:132, breezy_windy_stained_reaction:116, calm_low_light_surface:8 | Inline Spinner (top), Suspending Jerkbait (honorable):13, Medium-Diving Crankbait (top), Football Jig (honorable):12, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):8 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 0.9% | 11/480 | 0/248 | 11 | 0 | 0% | 0/124 | 0/124 | 23 | underused_home_window | activity neutral:152, active:80, suppressed:16<br>clarity dirty:124, stained:124<br>water freshwater_lake_pond:184, freshwater_river:64<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, warming_search:20 | Inline Spinner (top), Suspending Jerkbait (honorable):11, Medium-Diving Crankbait (top), Football Jig (honorable):10, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):8 |
| Finesse Jig<br>finesse_jig | lure | 1.5% | 18/612 | 11/216 | 18 | 11 | 5.1% | 10/108 | 1/108 | 43 | underused_home_window | activity neutral:160, suppressed:32, active:24<br>clarity clear:144, stained:52, dirty:20<br>water freshwater_lake_pond:120, freshwater_river:96<br>bucket cold_slow_or_front:112, stable_pleasant_medium_confidence_archive:24, calm_bright_clear_subtle:20 | Tube Jig (top), Drop-Shot Minnow (honorable):7, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):6, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):6 |
| Ned Rig<br>ned_rig | lure | 1.8% | 22/612 | 14/216 | 22 | 14 | 6.5% | 13/108 | 1/108 | 56 | underused_home_window | activity neutral:184, suppressed:32<br>clarity clear:120, stained:96<br>water freshwater_lake_pond:152, freshwater_river:64<br>bucket cold_slow_or_front:108, breezy_windy_stained_reaction:56, calm_bright_clear_subtle:20 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7, Tube Jig (top), Drop-Shot Minnow (honorable):7, Suspending Jerkbait (top), Inline Spinner (honorable):5 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 9.6% | 118/612 | 32/216 | 118 | 32 | 14.8% | 25/108 | 7/108 | 81 | healthy | activity neutral:128, active:56, suppressed:32<br>clarity clear:116, stained:100<br>water freshwater_lake_pond:148, freshwater_river:68<br>bucket cold_slow_or_front:80, warming_search:64, breezy_windy_stained_reaction:48 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):9, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):6, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):5 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 1.6% | 20/612 | 13/216 | 20 | 13 | 6% | 9/108 | 4/108 | 41 | underused_home_window | activity neutral:160, suppressed:32, active:24<br>clarity clear:144, stained:52, dirty:20<br>water freshwater_lake_pond:120, freshwater_river:96<br>bucket cold_slow_or_front:112, stable_pleasant_medium_confidence_archive:24, calm_bright_clear_subtle:20 | Tube Jig (top), Drop-Shot Minnow (honorable):7, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):6, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):6 |
| Buzzbait<br>buzzbait | lure | 2.5% | 30/228 | 27/144 | 30 | 27 | 18.8% | 5/72 | 22/72 | 32 | healthy | activity neutral:108, active:36<br>clarity clear:48, dirty:48, stained:48<br>water freshwater_lake_pond:96, freshwater_river:48<br>bucket stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:36, cold_slow_or_front:28 | Walking Topwater (top), Big Smallmouth Tube (honorable):6, Wake Bait (top), Big Smallmouth Tube (honorable):5, Inline Spinner (top), Medium-Diving Crankbait (honorable):4 |
| Walking Topwater<br>walking_topwater | lure | 2.5% | 31/228 | 31/144 | 31 | 31 | 21.5% | 0/72 | 31/72 | 39 | healthy | activity neutral:108, active:36<br>clarity clear:48, dirty:48, stained:48<br>water freshwater_lake_pond:96, freshwater_river:48<br>bucket stable_pleasant_medium_confidence_archive:40, calm_low_light_surface:36, cold_slow_or_front:28 | Buzzbait (top), Big Smallmouth Tube (honorable):10, Wake Bait (top), Big Smallmouth Tube (honorable):5, Buzzbait (top), Medium-Diving Crankbait (honorable):4 |
| Football Jig<br>football_jig | lure | 6.2% | 76/468 | 21/120 | 76 | 21 | 17.5% | 0/60 | 21/60 | 9 | healthy | activity neutral:92, suppressed:20, active:8<br>clarity clear:96, stained:24<br>water freshwater_lake_pond:120<br>bucket cold_slow_or_front:76, calm_bright_clear_subtle:16, stable_pleasant_medium_confidence_archive:12 | Tube Jig (top), Drop-Shot Minnow (honorable):6, Inline Spinner (top), Suspending Jerkbait (honorable):4, Compact Glide Bait (top), Big Smallmouth Tube (honorable):3 |
| Hair Jig<br>hair_jig | lure | 0.5% | 6/144 | 5/96 | 6 | 5 | 5.2% | 3/48 | 2/48 | 26 | underused_home_window | activity neutral:68, active:16, suppressed:12<br>clarity clear:48, stained:28, dirty:20<br>water freshwater_river:96<br>bucket cold_slow_or_front:36, dirty_vibration:16, calm_low_light_surface:12 | Big Smallmouth Tube (honorable), Magnum Jerkbait (top):5, Buzzbait (top), Big Smallmouth Tube (honorable):5, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):4 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 6.2% | 76/360 | 41/84 | 76 | 41 | 48.8% | 0/0 | 41/84 | 34 | over-dominant | activity neutral:48, active:24, suppressed:12<br>clarity clear:46, stained:38<br>water freshwater_lake_pond:54, freshwater_river:30<br>bucket cold_slow_or_front:30, warming_search:28, breezy_windy_stained_reaction:14 | Big Smallmouth Tube (top), Football Jig (honorable):5, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):3, Football Jig (top), Paddle-Tail Swimbait (honorable):3 |
| Inline Spinner<br>inline_spinner | lure | 9.2% | 113/612 | 15/80 | 113 | 15 | 18.8% | 13/40 | 2/40 | 24 | healthy | activity neutral:56, active:16, suppressed:8<br>clarity clear:40, stained:40<br>water freshwater_river:80<br>bucket breezy_windy_stained_reaction:24, cold_slow_or_front:24, stable_pleasant_medium_confidence_archive:12 | Big Smallmouth Tube (honorable), Magnum Jerkbait (top):4, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):3, Big Smallmouth Tube (honorable), Buzzbait (top):2 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 1.8% | 22/612 | 11/76 | 22 | 11 | 14.5% | 9/38 | 2/38 | 14 | healthy | activity neutral:64, suppressed:12<br>clarity clear:76<br>water freshwater_lake_pond:56, freshwater_river:20<br>bucket cold_slow_or_front:28, calm_bright_clear_subtle:20, stable_pleasant_medium_confidence_archive:12 | Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):4, Tube Jig (top), Finesse Jig (honorable):3, Big Smallmouth Tube (top), Compact Glide Bait (honorable):2 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 3.3% | 41/480 | 14/76 | 41 | 14 | 18.4% | 14/38 | 0/38 | 24 | healthy | activity neutral:72, suppressed:4<br>clarity clear:64, stained:12<br>water freshwater_lake_pond:56, freshwater_river:20<br>bucket calm_bright_clear_subtle:20, warming_search:20, cold_slow_or_front:16 | Tube Jig (top), Drop-Shot Minnow (honorable):7, Big Smallmouth Tube (top), Football Jig (honorable):3, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):3 |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |
| forage_clarity_stack | 33 |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 136 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12 |
| Upper Mississippi smallmouth river<br>2025-01-26 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 130 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 130 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 | big_fish<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 130 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 130 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6 |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 | big_fish<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | all_purpose<br>stained<br>freshwater_river | warming_search<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | big_fish<br>stained<br>freshwater_river | warming_search<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | big_fish<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 | all_purpose<br>stained<br>freshwater_river | cold_slow_or_front<br>suppressed | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 | big_fish<br>stained<br>freshwater_river | cold_slow_or_front<br>suppressed | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>suppressed | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 | big_fish<br>dirty<br>freshwater_river | dirty_vibration<br>suppressed | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Door County / Green Bay smallmouth lake<br>2025-04-18 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Colorado mountain-west SMB reservoir<br>2025-04-23 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Champlain SMB water<br>2025-04-27 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Finesse Jig<br>finesse_jig | 10/108 | 1/108 | goal_tags:133, forage_clarity_stack:33, daily_condition_tags:25, selector_filtering_variety_jitter:10, seasonal_baseline:4 | Upper Mississippi smallmouth river 2025-01-26 all_purpose clear: lost to Ned Rig by 0 (selector_filtering_variety_jitter)<br>Table Rock / Ozark clear reservoir 2025-02-20 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Table Rock / Ozark clear reservoir 2025-02-20 big_fish stained: lost to Texas-Rigged Soft-Plastic Craw by 0 (selector_filtering_variety_jitter) |
| Ned Rig<br>ned_rig | 13/108 | 1/108 | goal_tags:123, forage_clarity_stack:45, daily_condition_tags:18, selector_filtering_variety_jitter:12, seasonal_baseline:4 | Upper Mississippi smallmouth river 2025-01-26 big_fish stained: lost to Hair Jig by -6 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 all_purpose stained: lost to Finesse Jig by 0 (selector_filtering_variety_jitter) |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | 9/108 | 4/108 | goal_tags:133, forage_clarity_stack:33, daily_condition_tags:25, selector_filtering_variety_jitter:7, seasonal_baseline:5 | Table Rock / Ozark clear reservoir 2025-02-20 all_purpose stained: lost to Finesse Jig by 0 (selector_filtering_variety_jitter)<br>Trinity Lake northern California SMB water 2025-03-30 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Trinity Lake northern California SMB water 2025-03-30 big_fish stained: lost to Magnum Jerkbait by 0 (selector_filtering_variety_jitter) |
| Drop-Shot Minnow<br>drop_shot_minnow | 9/38 | 2/38 | goal_tags:42, daily_condition_tags:13, seasonal_baseline:4, selector_filtering_variety_jitter:4, raw_score:2 | New River Appalachian SMB context 2025-04-04 all_purpose clear: lost to Tube Jig by 2 (raw_score)<br>Trinity Lake northern California SMB water 2025-05-23 all_purpose clear: lost to Tube Jig by 12 (seasonal_baseline)<br>Ozark Current River smallmouth context 2025-06-14 all_purpose clear: lost to Tube Jig by 12 (seasonal_baseline) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish stained breezy_windy_stained_reaction | 156 | Hair Jig<br>150 | -6 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 206 | Ned Rig<br>206 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>all_purpose clear cold_slow_or_front | 206 | Carolina-Rigged Stick Worm<br>206 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>big_fish stained cold_slow_or_front | 156 | Texas-Rigged Soft-Plastic Craw<br>156 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>New River Appalachian SMB context 2025-03-26<br>all_purpose clear cold_slow_or_front | 190 | Ned Rig<br>190 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 172 | Finesse Jig<br>172 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose stained breezy_windy_stained_reaction | 184 | Finesse Jig<br>184 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>all_purpose clear cold_slow_or_front | 206 | Carolina-Rigged Stick Worm<br>206 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Table Rock / Ozark clear reservoir 2025-02-20<br>all_purpose stained cold_slow_or_front | 190 | Finesse Jig<br>190 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Trinity Lake northern California SMB water 2025-03-30<br>all_purpose clear cold_slow_or_front | 206 | Carolina-Rigged Stick Worm<br>206 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Trinity Lake northern California SMB water 2025-03-30<br>big_fish stained cold_slow_or_front | 156 | Magnum Jerkbait<br>156 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:slow:+6 |
| Drop-Shot Minnow<br>New River Appalachian SMB context 2025-04-04<br>all_purpose clear warming_search | 180 | Tube Jig<br>182 | 2 | raw_score | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Texas-Rigged Soft-Plastic Craw<br>Table Rock / Ozark clear reservoir 2025-02-20<br>big_fish clear cold_slow_or_front | 172 | Football Jig<br>176 | 4 | goal_tags | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Trinity Lake northern California SMB water 2025-05-23<br>all_purpose clear calm_bright_clear_subtle | 170 | Tube Jig<br>182 | 12 | seasonal_baseline | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Drop-Shot Minnow<br>Ozark Current River smallmouth context 2025-06-14<br>all_purpose clear stable_pleasant_medium_confidence_archive | 170 | Tube Jig<br>182 | 12 | seasonal_baseline | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Drop-Shot Minnow<br>Ozark Current River smallmouth context 2025-05-06<br>all_purpose clear cold_slow_or_front | 170 | Ned Rig<br>186 | 16 | daily_condition_tags | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| jitter_or_id_tiebreak | 10 |
| avoidIds | 9 |
| set_b_group_novelty | 5 |
| honorable_diversity_or_replacement | 3 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Ned Rig<br>206 | Finesse Jig<br>206 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose stained<br>breezy_windy_stained_reaction | B<br>honorable_lure | Finesse Jig<br>184 | Ned Rig<br>184 | 0 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose stained<br>breezy_windy_stained_reaction | B<br>honorable_lure | Finesse Jig<br>184 | Texas-Rigged Soft-Plastic Craw<br>184 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-02-20 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>206 | Finesse Jig<br>206 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-02-20 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>206 | Ned Rig<br>206 | 0 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-02-20 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>190 | Texas-Rigged Soft-Plastic Craw<br>190 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| New River Appalachian SMB context<br>2025-03-26 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Ned Rig<br>190 | Finesse Jig<br>190 | 0 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| New River Appalachian SMB context<br>2025-03-26 all_purpose stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Finesse Jig<br>184 | Ned Rig<br>184 | 0 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| New River Appalachian SMB context<br>2025-03-26 all_purpose stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Finesse Jig<br>184 | Texas-Rigged Soft-Plastic Craw<br>184 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Trinity Lake northern California SMB water<br>2025-03-30 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>206 | Finesse Jig<br>206 | 0 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Trinity Lake northern California SMB water<br>2025-03-30 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>206 | Texas-Rigged Soft-Plastic Craw<br>206 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Trinity Lake northern California SMB water<br>2025-03-30 all_purpose stained<br>cold_slow_or_front | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>190 | Finesse Jig<br>190 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Trinity Lake northern California SMB water<br>2025-03-30 all_purpose stained<br>cold_slow_or_front | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>190 | Ned Rig<br>190 | 0 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Ned Rig<br>170 | 0 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Ozark Current River smallmouth context<br>2025-05-06 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Ned Rig<br>186 | Finesse Jig<br>186 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Ozark Current River smallmouth context<br>2025-05-06 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Finesse Jig<br>192 | Ned Rig<br>192 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Finesse Jig<br>192 | Texas-Rigged Soft-Plastic Craw<br>192 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 all_purpose stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Inline Spinner<br>170 | Drop-Shot Minnow<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 all_purpose stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Inline Spinner<br>170 | Finesse Jig<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 all_purpose stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Inline Spinner<br>170 | Ned Rig<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 all_purpose stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Inline Spinner<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:wind_reaction:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Table Rock / Ozark clear reservoir<br>2025-09-13 all_purpose clear<br>warming_search | B<br>lure_of_the_day | Soft Plastic Jerkbait<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-09-27 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Soft Plastic Jerkbait<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Upper Mississippi smallmouth river<br>2025-09-29 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Soft Plastic Jerkbait<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Table Rock / Ozark clear reservoir<br>2025-10-19 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>186 | Finesse Jig<br>186 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Table Rock / Ozark clear reservoir<br>2025-10-19 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>186 | Texas-Rigged Soft-Plastic Craw<br>186 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 5/408 | 1.2% | 40 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:46, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:46, big_fish / dirty / freshwater_lake_pond / dirty_vibration:46, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:46 | goal_tags:288, daily_condition_tags:97, selector_filtering_variety_jitter:12, seasonal_baseline:4 | Inline Spinner (top), Suspending Jerkbait (honorable):21, Medium-Diving Crankbait (top), Football Jig (honorable):16, Inline Spinner (honorable), Suspending Jerkbait (top):11, Suspending Jerkbait (honorable), Medium-Diving Crankbait (top):10 |
| Blade Bait<br>blade_bait | lure | 10/272 | 3.7% | 49 | all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:46, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:46, all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28 | goal_tags:165, daily_condition_tags:53, forage_clarity_stack:31, selector_filtering_variety_jitter:11 | Inline Spinner (top), Suspending Jerkbait (honorable):11, Inline Spinner (honorable), Suspending Jerkbait (top):8, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7, Inline Spinner (top), Medium-Diving Crankbait (honorable):6 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 0/248 | 0% | 23 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:38, big_fish / dirty / freshwater_lake_pond / dirty_vibration:38, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:36, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:36 | goal_tags:159, daily_condition_tags:71, forage_clarity_stack:16, seasonal_baseline:1 | Inline Spinner (top), Suspending Jerkbait (honorable):11, Medium-Diving Crankbait (top), Football Jig (honorable):10, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):8, Buzzbait (top), Big Smallmouth Tube (honorable):7 |
| Ned Rig<br>ned_rig | lure | 14/216 | 6.5% | 56 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:24, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:24, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:20, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:20 | goal_tags:123, forage_clarity_stack:45, daily_condition_tags:18, selector_filtering_variety_jitter:12 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7, Tube Jig (top), Drop-Shot Minnow (honorable):7, Suspending Jerkbait (top), Inline Spinner (honorable):5, Tube Jig (top), Finesse Jig (honorable):5 |
| Finesse Jig<br>finesse_jig | lure | 11/216 | 5.1% | 43 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28, all_purpose / clear / freshwater_river / cold_slow_or_front:12, big_fish / clear / freshwater_river / cold_slow_or_front:12 | goal_tags:133, forage_clarity_stack:33, daily_condition_tags:25, selector_filtering_variety_jitter:10 | Tube Jig (top), Drop-Shot Minnow (honorable):7, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):6, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):6, Buzzbait (top), Big Smallmouth Tube (honorable):6 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 13/216 | 6% | 41 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28, all_purpose / clear / freshwater_river / cold_slow_or_front:12, big_fish / clear / freshwater_river / cold_slow_or_front:12 | goal_tags:133, forage_clarity_stack:33, daily_condition_tags:25, selector_filtering_variety_jitter:7 | Tube Jig (top), Drop-Shot Minnow (honorable):7, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):6, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):6, Buzzbait (top), Big Smallmouth Tube (honorable):6 |
| Conehead Streamer<br>conehead_streamer | fly | 9/120 | 7.5% | 46 | all_purpose / dirty / freshwater_river / dirty_vibration:18, big_fish / dirty / freshwater_river / dirty_vibration:18, all_purpose / stained / freshwater_river / breezy_windy_stained_reaction:12, big_fish / stained / freshwater_river / breezy_windy_stained_reaction:12 | goal_tags:91, selector_filtering_variety_jitter:8, daily_condition_tags:7, forage_clarity_stack:5 | Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Articulated Baitfish Streamer (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3, Sculpzilla (top), Deer Hair Slider (honorable):3 |
| Hair Jig<br>hair_jig | lure | 5/96 | 5.2% | 26 | all_purpose / clear / freshwater_river / cold_slow_or_front:12, big_fish / clear / freshwater_river / cold_slow_or_front:12, all_purpose / dirty / freshwater_river / dirty_vibration:8, big_fish / dirty / freshwater_river / dirty_vibration:8 | goal_tags:52, forage_clarity_stack:25, selector_filtering_variety_jitter:7, seasonal_baseline:4 | Big Smallmouth Tube (honorable), Magnum Jerkbait (top):5, Buzzbait (top), Big Smallmouth Tube (honorable):5, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):4, Tube Jig (top), Soft Plastic Jerkbait (honorable):4 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 96/320 | 30% | 124 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:48, big_fish / dirty / freshwater_lake_pond / dirty_vibration:48, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:46, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:46 | goal_tags:137, selector_filtering_variety_jitter:77, seasonal_baseline:8, daily_condition_tags:2 | Inline Spinner (top), Suspending Jerkbait (honorable):14, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):8, Buzzbait (top), Big Smallmouth Tube (honorable):7, Inline Spinner (honorable), Suspending Jerkbait (top):7 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 41/84 | 48.8% | 34 | big_fish / clear / freshwater_lake_pond / cold_slow_or_front:12, big_fish / clear / freshwater_lake_pond / warming_search:12, big_fish / stained / freshwater_lake_pond / warming_search:12, big_fish / clear / freshwater_river / cold_slow_or_front:10 | selector_filtering_variety_jitter:22, forage_clarity_stack:10, goal_tags:9, daily_condition_tags:2 | Big Smallmouth Tube (top), Football Jig (honorable):5, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):3, Football Jig (top), Paddle-Tail Swimbait (honorable):3, Big Smallmouth Tube (honorable), Football Jig (top):2 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Foam Gurgler [fly] (21), Popper Fly [fly] (13), Clouser Minnow [fly] (11), Soft Plastic Jerkbait [lure] (11), Inline Spinner [lure] (10) | Foam Gurgler [fly] (25), Clouser Minnow [fly] (21), Soft Plastic Jerkbait [lure] (20), Popper Fly [fly] (16), Inline Spinner [lure] (15) |
| calm_surface | big_fish | Walking Topwater [lure] (19), Articulated Baitfish Streamer [fly] (15), Deer Hair Slider [fly] (15), Game Changer [fly] (13), Buzzbait [lure] (11) | Deer Hair Slider [fly] (27), Game Changer [fly] (26), Articulated Baitfish Streamer [fly] (24), Walking Topwater [lure] (24), Big Smallmouth Tube [lure] (23) |
| low_light_surface | all_purpose | Foam Gurgler [fly] (10), Inline Spinner [lure] (10), Clouser Minnow [fly] (7), Suspending Jerkbait [lure] (6), Medium-Diving Crankbait [lure] (4) | Baitfish Slider Fly [fly] (14), Inline Spinner [lure] (14), Foam Gurgler [fly] (12), Suspending Jerkbait [lure] (11), Clouser Minnow [fly] (10) |
| low_light_surface | big_fish | Buzzbait [lure] (15), Walking Topwater [lure] (13), Deer Hair Slider [fly] (8), Game Changer [fly] (8), Articulated Baitfish Streamer [fly] (5) | Deer Hair Slider [fly] (17), Buzzbait [lure] (15), Game Changer [fly] (14), Walking Topwater [lure] (14), Articulated Baitfish Streamer [fly] (12) |
| wind_reaction | all_purpose | Zonker Streamer [fly] (56), Deceiver [fly] (46), Suspending Jerkbait [lure] (41), Inline Spinner [lure] (40), Medium-Diving Crankbait [lure] (26) | Suspending Jerkbait [lure] (83), Inline Spinner [lure] (75), Zonker Streamer [fly] (63), Deceiver [fly] (60), Baitfish Slider Fly [fly] (58) |
| wind_reaction | big_fish | Medium-Diving Crankbait [lure] (54), Game Changer [fly] (36), Deceiver [fly] (29), Articulated Baitfish Streamer [fly] (28), Baitfish Slider Fly [fly] (28) | Game Changer [fly] (71), Rabbit-Strip Leech [fly] (70), Articulated Baitfish Streamer [fly] (69), Medium-Diving Crankbait [lure] (63), Big Smallmouth Tube [lure] (54) |
| dirty_vibration | all_purpose | Zonker Streamer [fly] (48), Deceiver [fly] (40), Inline Spinner [lure] (31), Suspending Jerkbait [lure] (28), Medium-Diving Crankbait [lure] (20) | Suspending Jerkbait [lure] (59), Inline Spinner [lure] (57), Deceiver [fly] (51), Zonker Streamer [fly] (50), Medium-Diving Crankbait [lure] (43) |
| dirty_vibration | big_fish | Medium-Diving Crankbait [lure] (44), Baitfish Slider Fly [fly] (25), Game Changer [fly] (24), Deceiver [fly] (23), Articulated Baitfish Streamer [fly] (22) | Articulated Baitfish Streamer [fly] (54), Rabbit-Strip Leech [fly] (52), Game Changer [fly] (51), Medium-Diving Crankbait [lure] (47), Big Smallmouth Tube [lure] (41) |
| clear_subtle | all_purpose | Tube Jig [lure] (16), Soft Plastic Jerkbait [lure] (9), Clouser Minnow [fly] (7), Warmwater Crawfish Fly [fly] (6), Suspending Jerkbait [lure] (5) | Tube Jig [lure] (18), Clouser Minnow [fly] (15), Soft Plastic Jerkbait [lure] (15), Warmwater Crawfish Fly [fly] (11), Lead-Eye Leech [fly] (10) |
| clear_subtle | big_fish | Game Changer [fly] (10), Big Smallmouth Tube [lure] (9), Articulated Baitfish Streamer [fly] (8), Compact Glide Bait [lure] (7), Unweighted Baitfish Streamer [fly] (6) | Game Changer [fly] (21), Big Smallmouth Tube [lure] (19), Articulated Baitfish Streamer [fly] (18), Compact Glide Bait [lure] (13), Rabbit-Strip Leech [fly] (12) |
| cold_slow | all_purpose | Tube Jig [lure] (28), Suspending Jerkbait [lure] (15), Deceiver [fly] (13), Sculpin Streamer [fly] (12), Muddler Minnow [fly] (10) | Tube Jig [lure] (30), Suspending Jerkbait [lure] (25), Woolly Bugger [fly] (23), Jighead Marabou Leech [fly] (21), Inline Spinner [lure] (19) |
| cold_slow | big_fish | Game Changer [fly] (19), Medium-Diving Crankbait [lure] (14), Articulated Baitfish Streamer [fly] (12), Rabbit-Strip Leech [fly] (12), Big Smallmouth Tube [lure] (11) | Rabbit-Strip Leech [fly] (41), Game Changer [fly] (33), Articulated Baitfish Streamer [fly] (30), Big Smallmouth Tube [lure] (30), Magnum Jerkbait [lure] (26) |
| warming_search | all_purpose | Clouser Minnow [fly] (18), Inline Spinner [lure] (14), Zonker Streamer [fly] (10), Suspending Jerkbait [lure] (9), Feather Jig Leech [fly] (8) | Clouser Minnow [fly] (34), Inline Spinner [lure] (26), Baitfish Slider Fly [fly] (19), Suspending Jerkbait [lure] (18), Zonker Streamer [fly] (16) |
| warming_search | big_fish | Articulated Baitfish Streamer [fly] (24), Game Changer [fly] (22), Big Smallmouth Tube [lure] (15), Magnum Jerkbait [lure] (12), Medium-Diving Crankbait [lure] (11) | Game Changer [fly] (38), Rabbit-Strip Leech [fly] (32), Articulated Baitfish Streamer [fly] (30), Big Smallmouth Tube [lure] (30), Football Jig [lure] (26) |
| heat_finesse | all_purpose | Zonker Streamer [fly] (3), Weightless Stick Worm [lure] (2), Baitfish Slider Fly [fly] (1), Deceiver [fly] (1), Finesse Jig [lure] (1) | Weightless Stick Worm [lure] (3), Zonker Streamer [fly] (3), Baitfish Slider Fly [fly] (2), Deceiver [fly] (2), Inline Spinner [lure] (2) |
| heat_finesse | big_fish | Baitfish Slider Fly [fly] (2), Deceiver [fly] (2), Medium-Diving Crankbait [lure] (2), Big Smallmouth Tube [lure] (1), Bladed Jig [lure] (1) | Articulated Baitfish Streamer [fly] (3), Compact Glide Bait [lure] (3), Baitfish Slider Fly [fly] (2), Big Smallmouth Tube [lure] (2), Deceiver [fly] (2) |
| current_swing | all_purpose | Clouser Minnow [fly] (9), Inline Spinner [lure] (6), Tube Jig [lure] (4), Bladed Jig [lure] (3), Crawfish Streamer [fly] (3) | Clouser Minnow [fly] (11), Squarebill Crankbait [lure] (10), Inline Spinner [lure] (8), Sculpin Streamer [fly] (7), Bladed Jig [lure] (6) |
| current_swing | big_fish | Sculpzilla [fly] (10), Buzzbait [lure] (8), Walking Topwater [lure] (8), Bladed Jig [lure] (5), Deer Hair Slider [fly] (4) | Big Smallmouth Tube [lure] (15), Sculpzilla [fly] (15), Game Changer [fly] (12), Buzzbait [lure] (9), Deer Hair Slider [fly] (9) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Colorado mountain-west SMB reservoir<br>2025-08-12 clear big_fish B | 60.3-86.9F, 7.6 mph wind, 27.3% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle+open_water_search, medium | Inline Spinner (172); Medium-Diving Crankbait (178); Unweighted Baitfish Streamer (162); Deceiver (172) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE |
| Yampa River mountain-west SMB context<br>2025-05-19 clear big_fish B | 37.6-50.1F, 10.4 mph wind, 68.5% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, medium | Medium-Diving Crankbait (162); Tube Jig (148); Game Changer (154); Articulated Baitfish Streamer (146) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 dirty all_purpose B | 51.3-69.4F, 8.2 mph wind, 100% cloud, 0 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow, medium | Squarebill Crankbait (162); Buzzbait (152); Foam Gurgler (170); Zonker Streamer (144) | COLD_CLEAR_TOO_FAST, ALL_PURPOSE_OVER_SELECTING_HIGH_RISK, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Colorado mountain-west SMB reservoir<br>2025-04-23 clear big_fish A | 43.9-72.1F, 7.1 mph wind, 71.2% cloud, 0 in precip | active, closed, wind_reaction+warming_search, medium | Magnum Jerkbait (154); Big Smallmouth Tube (152); Game Changer (154); Articulated Baitfish Streamer (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Colorado mountain-west SMB reservoir<br>2025-08-12 clear all_purpose A | 60.3-86.9F, 7.6 mph wind, 27.3% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle+open_water_search, medium | Soft Plastic Jerkbait (202); Tube Jig (182); Zonker Streamer (184); Clouser Minnow (186) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Colorado mountain-west SMB reservoir<br>2025-10-05 clear all_purpose A | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle, medium | Tube Jig (182); Drop-Shot Minnow (180); Warmwater Crawfish Fly (160); Baitfish Slider Fly (152) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Colorado mountain-west SMB reservoir<br>2025-10-05 clear big_fish A | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle, medium | Compact Glide Bait (178); Magnum Jerkbait (170); Articulated Baitfish Streamer (146); Game Changer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Colorado mountain-west SMB reservoir<br>2025-10-05 clear big_fish B | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle, medium | Big Smallmouth Tube (168); Football Jig (140); Zonker Streamer (150); Rabbit-Strip Leech (126) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 clear big_fish A | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+open_water_search, medium | Big Smallmouth Tube (166); Magnum Jerkbait (162); Game Changer (156); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear big_fish A | 56.4-75.1F, 16 mph wind, 68.1% cloud, 1 in precip | neutral, closed, wind_reaction, medium | Compact Glide Bait (152); Magnum Jerkbait (144); Articulated Baitfish Streamer (136); Game Changer (144) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest natural lake<br>2025-07-16 clear big_fish A | 57.1-64.2F, 14 mph wind, 99.9% cloud, 0.4 in precip | neutral, closed, wind_reaction, medium | Big Smallmouth Tube (152); Compact Glide Bait (168); Game Changer (160); Articulated Baitfish Streamer (152) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest natural lake<br>2025-07-16 stained big_fish A | 57.1-64.2F, 14 mph wind, 99.9% cloud, 0.4 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Compact Glide Bait (168); Big Smallmouth Tube (152); Articulated Baitfish Streamer (160); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest natural lake<br>2025-09-20 clear big_fish A | 61.3-71.1F, 8.2 mph wind, 63.6% cloud, 0.1 in precip | active, caution, wind_reaction, medium | Football Jig (140); Glide Bait (162); Articulated Baitfish Streamer (146); Game Changer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Ozark Current River smallmouth context<br>2025-04-05 dirty big_fish B | 45-55F, 11.3 mph wind, 100% cloud, 2 in precip | suppressed, closed, dirty_vibration+cold_slow+current_swing, medium | Bladed Jig (150); Squarebill Crankbait (140); Rabbit-Strip Leech (150); Articulated Baitfish Streamer (154) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Ozark Current River smallmouth context<br>2025-05-06 dirty big_fish B | 46.3-70F, 4.1 mph wind, 65.2% cloud, 0 in precip | neutral, closed, cold_slow, medium | Flat-Sided Crankbait (142); Blade Bait (136); Rabbit-Strip Leech (150); Articulated Baitfish Streamer (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Ozark Current River smallmouth context<br>2025-05-06 stained all_purpose B | 46.3-70F, 4.1 mph wind, 65.2% cloud, 0 in precip | neutral, closed, cold_slow, medium | Finesse Jig (170); Ned Rig (170); Sculpin Streamer (176); Rabbit-Strip Leech (158) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear big_fish A | 70.5-81.5F, 9.8 mph wind, 66.2% cloud, 0.1 in precip | neutral, caution, wind_reaction+open_water_search, medium | Big Smallmouth Tube (152); Compact Glide Bait (184); Game Changer (176); Articulated Baitfish Streamer (168) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear big_fish B | 70.5-81.5F, 9.8 mph wind, 66.2% cloud, 0.1 in precip | neutral, caution, wind_reaction+open_water_search, medium | Medium-Diving Crankbait (178); Inline Spinner (172); Baitfish Slider Fly (162); Zonker Streamer (172) | BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE |
| Table Rock / Ozark clear reservoir<br>2025-10-20 clear all_purpose A | 47.1-75.5F, 9.8 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle, medium | Tube Jig (182); Drop-Shot Minnow (180); Zonker Streamer (162); Warmwater Crawfish Fly (160) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Table Rock / Ozark clear reservoir<br>2025-10-20 clear big_fish A | 47.1-75.5F, 9.8 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle, medium | Magnum Jerkbait (170); Big Smallmouth Tube (168); Game Changer (154); Articulated Baitfish Streamer (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Table Rock / Ozark clear reservoir<br>2025-10-20 clear big_fish B | 47.1-75.5F, 9.8 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle, medium | Compact Glide Bait (178); Football Jig (140); Deceiver (150); Rabbit-Strip Leech (126) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Table Rock / Ozark clear reservoir<br>2025-10-20 stained big_fish A | 47.1-75.5F, 9.8 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Lipless Crankbait (150); Compact Glide Bait (162); Game Changer (154); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, ADJACENT_DAY_EXACT_REPEAT |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear big_fish B | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+warming_search, medium | Tube Jig (146); Inline Spinner (130); Articulated Dungeon Streamer (148); Rabbit-Strip Leech (140) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained big_fish B | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | active, closed, wind_reaction+dirty_vibration+warming_search, medium | Spinnerbait (136); Bladed Jig (130); Articulated Baitfish Streamer (140); Game Changer (134) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 clear big_fish A | 55.2-76F, 9.6 mph wind, 72.6% cloud, 0 in precip | neutral, closed, wind_reaction, medium | Magnum Jerkbait (154); Football Jig (140); Game Changer (154); Articulated Baitfish Streamer (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Dale Hollow / Tennessee highland reservoir<br>2025-06-07 clear big_fish A | 67.5-81.1F, 6.9 mph wind, 89.2% cloud, 0.8 in precip | neutral, open, low_light_surface+wind_reaction+open_water_search, medium | Walking Topwater (178); Compact Glide Bait (184); Articulated Baitfish Streamer (168); Deer Hair Slider (166) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Dale Hollow / Tennessee highland reservoir<br>2025-06-07 dirty big_fish A | 67.5-81.1F, 6.9 mph wind, 89.2% cloud, 0.8 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+open_water_search, medium | Wake Bait (166); Compact Glide Bait (176); Deceiver (172); Articulated Baitfish Streamer (176) | DIRTY_WIND_NOT_ELEVATING_VIBRATION, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-01-18 clear all_purpose A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Ned Rig (152); Finesse Jig (152); Feather Jig Leech (152); Game Changer (132) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-01-18 clear big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Medium-Diving Crankbait (158); Suspending Jerkbait (136); Articulated Dungeon Streamer (154); Rabbit-Strip Leech (140) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-01-18 stained big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Spinnerbait (142); Suspending Jerkbait (136); Articulated Baitfish Streamer (146); Game Changer (140) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-08-14 clear all_purpose A | 69.7-77F, 8.8 mph wind, 18.6% cloud, 0 in precip | active, caution, wind_reaction+clear_subtle+open_water_search, medium | Carolina-Rigged Stick Worm (166); Soft Plastic Jerkbait (192); Zonker Streamer (184); Game Changer (168) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Lake Champlain SMB water<br>2025-08-14 clear big_fish B | 69.7-77F, 8.8 mph wind, 18.6% cloud, 0 in precip | active, caution, wind_reaction+clear_subtle+open_water_search, medium | Medium-Diving Crankbait (178); Suspending Jerkbait (172); Unweighted Baitfish Streamer (162); Baitfish Slider Fly (162) | BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE |

## Known Coverage Gaps

- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
