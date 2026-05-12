# FinFindr SMB Daily-Picks Archive Audit
Generated: 2026-05-12T14:41:44.205Z

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
| breezy_windy_stained_reaction | 88 |
| dirty_vibration | 108 |
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
| Table Rock / Ozark clear reservoir<br>2025-10-19 -> 2025-10-20 | changed | 1.6 | 9.0 | cold_slow -> wind_reaction|dirty_vibration |
| Mille Lacs / Upper Midwest natural lake<br>2025-09-20 -> 2025-09-21 | changed | 2.9 | 1.1 | wind_reaction|dirty_vibration -> calm_surface |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 15 | WIND_NOT_ELEVATING_REACTION (12), BIG_FISH_NOT_FAVORING_UPSIDE (5), COLD_CLEAR_TOO_FAST (1) |
| calm_bright_clear_subtle | 1 | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (1) |
| calm_low_light_surface | 3 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3) |
| cold_slow_or_front | 51 | WIND_NOT_ELEVATING_REACTION (27), BIG_FISH_NOT_FAVORING_UPSIDE (24), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (6), COLD_CLEAR_TOO_FAST (3), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2) |
| dirty_vibration | 23 | WIND_NOT_ELEVATING_REACTION (12), BIG_FISH_NOT_FAVORING_UPSIDE (6), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), COLD_CLEAR_TOO_FAST (2), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2) |
| medium_confidence_archive | 103 | WIND_NOT_ELEVATING_REACTION (73), BIG_FISH_NOT_FAVORING_UPSIDE (36), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (10), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (7), COLD_CLEAR_TOO_FAST (3) |
| river_elevated_runoff_current | 11 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (5), BIG_FISH_NOT_FAVORING_UPSIDE (5), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2) |
| stable_pleasant_medium_confidence_archive | 32 | WIND_NOT_ELEVATING_REACTION (30), BIG_FISH_NOT_FAVORING_UPSIDE (4), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (4), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2) |
| warming_search | 14 | WIND_NOT_ELEVATING_REACTION (9), BIG_FISH_NOT_FAVORING_UPSIDE (8), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2) |

- WIND_NOT_ELEVATING_REACTION: 73
- BIG_FISH_NOT_FAVORING_UPSIDE: 36
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 10
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 7
- COLD_CLEAR_TOO_FAST: 3
- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 2

- co_pueblo_smb__2025-08-12__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Medium-Diving Crankbait (lure); Unweighted Baitfish Streamer (fly); Deceiver (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Ned Rig (lure); Finesse Jig (lure); Feather Jig Leech (fly); Game Changer (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Suspending Jerkbait (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Spinnerbait (lure); Suspending Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Tube Jig (lure); Inline Spinner (lure); Articulated Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Spinnerbait (lure); Bladed Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Smallmouth Tube (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__dirty__all_purpose__B: COLD_CLEAR_TOO_FAST, ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Squarebill Crankbait (lure); Buzzbait (lure); Foam Gurgler (fly); Zonker Streamer (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Glide Bait (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_new_river_smb__2025-06-17__freshwater_river__dirty__all_purpose__A: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK, DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Squarebill Crankbait (lure); Buzzbait (lure); Slim Baitfish Streamer (fly); Muddler Minnow (fly)
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
- mo_current_river__2025-05-06__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Muddler Minnow (fly); Game Changer (fly)
- mo_current_river__2025-05-06__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Sculpzilla (fly); Game Changer (fly)
- mo_current_river__2025-05-06__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Blade Bait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Blade Bait (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 61
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 10
- ADJACENT_DAY_EXACT_REPEAT: 1

- mo_current_river__2025-05-06__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Ned Rig (lure); Sculpin Streamer (fly); Rabbit-Strip Leech (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Ned Rig (lure); Sculpin Streamer (fly); Jighead Marabou Leech (fly)
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
- co_pueblo_smb__2025-04-23__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Feather Jig Leech (fly)
- co_pueblo_smb__2025-04-23__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Feather Jig Leech (fly)
- mo_table_rock__2025-04-24__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Paddle-Tail Swimbait (lure); Articulated Baitfish Streamer (fly); Feather Jig Leech (fly)
- mo_table_rock__2025-04-24__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Paddle-Tail Swimbait (lure); Game Changer (fly); Feather Jig Leech (fly)
- vt_champlain_smb__2025-04-27__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Bladed Jig (lure); Zonker Streamer (fly); Woolly Bugger (fly)
- vt_champlain_smb__2025-04-27__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Big Smallmouth Tube (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_smb__2025-04-27__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Woolly Bugger (fly)
- mo_current_river__2025-05-06__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Texas-Rigged Soft-Plastic Craw (lure); Ned Rig (lure); Sculpin Streamer (fly); Slim Baitfish Streamer (fly)
- mo_current_river__2025-05-06__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Blade Bait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Texas-Rigged Soft-Plastic Craw (lure); Ned Rig (lure); Sculpin Streamer (fly); Crawfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Suspending Jerkbait (lure); Muddler Minnow (fly); Lead-Eye Leech (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Blade Bait (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
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
- mo_table_rock__2025-06-18__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Clouser Minnow (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Game Changer (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Compact Glide Bait (lure); Football Jig (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Unweighted Baitfish Streamer (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Game Changer (fly)
- vt_champlain_smb__2025-08-14__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- vt_champlain_smb__2025-08-14__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- co_pueblo_smb__2025-08-12__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Lipless Crankbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- co_pueblo_smb__2025-08-12__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs__2025-09-20__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-09-20__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Game Changer (fly)
- mo_table_rock__2025-09-13__freshwater_lake_pond__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Big Smallmouth Tube (lure); Football Jig (lure); Game Changer (fly); Feather Jig Leech (fly)
- mo_table_rock__2025-10-19__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Carolina-Rigged Stick Worm (lure); Ned Rig (lure); Woolly Bugger (fly); Jighead Marabou Leech (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__stained__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Lipless Crankbait (lure); Compact Glide Bait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- ca_trinity__2025-10-25__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Spinnerbait (lure); Zonker Streamer (fly); Woolly Bugger (fly)
- ca_trinity__2025-10-25__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Warmwater Crawfish Fly (fly)

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
| Colorado mountain-west SMB reservoir<br>2025-06-22 clear all_purpose B | 61.5-93.6F | Unweighted Baitfish Streamer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 clear big_fish A | 61.5-93.6F | Game Changer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 clear big_fish B | 61.5-93.6F | Flat-Sided Crankbait (medium); Unweighted Baitfish Streamer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 stained big_fish A | 61.5-93.6F | Articulated Baitfish Streamer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 stained big_fish B | 61.5-93.6F | Game Changer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 dirty all_purpose B | 61.5-93.6F | Game Changer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 dirty big_fish A | 61.5-93.6F | Game Changer (medium) |
| Colorado mountain-west SMB reservoir<br>2025-06-22 dirty big_fish B | 61.5-93.6F | Articulated Baitfish Streamer (medium) |

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
| Jun | appalachian | open | low_light | all_purpose | 5 | 64.2-78.3F | 6.2 |
| Jun | appalachian | open | low_light | big_fish | 6 | 64.2-78.3F | 6.2 |
| Jun | inland_northwest | open | low_light | all_purpose | 6 | 57.8-79.1F | 3.2 |
| Jun | inland_northwest | open | low_light | big_fish | 6 | 57.8-79.1F | 3.2 |
| Jun | northeast | open | mixed | all_purpose | 5 | 58.4-74.2F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 6 | 58.4-74.2F | 5.2 |
| Jun | south_central | open | low_light | all_purpose | 5 | 67.5-81.1F | 6.9 |
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
| lure | big_fish | B | south_central | Jun | clear | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Jun | dirty | low_light_surface | 1 | 0 | 0 |
| lure | big_fish | B | south_central | Jun | stained | low_light_surface | 1 | 0 | 0 |

### Remaining Same-Side Surface/Surface Examples

| Scenario | Side | Selected surface pair | Close non-surface alternatives | Why left |
| --- | --- | --- | --- | --- |
| Dale Hollow / Tennessee highland reservoir<br>2025-06-07 clear big_fish B | lure | Wake Bait (174); Walking Topwater (178) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Dale Hollow / Tennessee highland reservoir<br>2025-06-07 stained big_fish B | lure | Buzzbait (174); Walking Topwater (178) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Dale Hollow / Tennessee highland reservoir<br>2025-06-07 dirty big_fish B | lure | Wake Bait (166); Buzzbait (174) | close: none<br>credible: none | Close non-surface alternatives were Set A exact-ID repeats; Set B avoidance held. |
| Upper Mississippi smallmouth river<br>2025-09-29 dirty big_fish B | lure | Walking Topwater (164); Buzzbait (152) | close: Medium-Diving Crankbait (mid, 146)<br>credible: none | Close alternatives lacked clear goal or daily-condition fit. |

### Same-Side Column/Band Summary

| Side | Same exact column | Same broad band | Same broad band with close different-band alt |
| --- | --- | --- | --- |
| lure | 269 | 269 | 215 |
| fly | 185 | 185 | 175 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 144 | - |
| open-surface rows with 2+ surface picks | 40 | 40 |
| open-surface rows with 3+ surface picks | 3 | 3 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 22 | 22 |
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
| same_family_same_presentation | truly_avoidable | 5 | 56 | 61 |
| same_family_same_presentation | unavoidable_due_score_band | 3 | 12 | 15 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 5 | 5 | 10 |
| same_family_same_presentation | unavoidable_due_goal_condition_fit | 0 | 6 | 6 |
| same_family_different_presentation | truly_avoidable | 0 | 10 | 10 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 8 | 8 |
| same_family_different_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 1 | 1 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 1 | 1 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| New River Appalachian SMB context<br>2025-03-26 stained big_fish | fly top: same_family_different_presentation | Articulated Dungeon Streamer (156); Rabbit-Strip Leech (164) | Articulated Baitfish Streamer (140); Game Changer (134) | Muddler Minnow (162, alt edge 22) |
| New River Appalachian SMB context<br>2025-05-06 dirty all_purpose | fly honorable: same_family_same_presentation | Jighead Marabou Leech (148); Slim Baitfish Streamer (144) | Muddler Minnow (152); Lead-Eye Leech (142) | Sculpin Streamer (160, alt edge 18) |
| Table Rock / Ozark clear reservoir<br>2025-04-24 clear big_fish | fly honorable: same_family_same_presentation | Game Changer (144); Rabbit-Strip Leech (126) | Articulated Baitfish Streamer (136); Feather Jig Leech (134) | Baitfish Slider Fly (150, alt edge 16) |
| Table Rock / Ozark clear reservoir<br>2025-04-24 stained big_fish | fly honorable: same_family_same_presentation | Articulated Baitfish Streamer (144); Rabbit-Strip Leech (134) | Game Changer (144); Feather Jig Leech (134) | Baitfish Slider Fly (150, alt edge 16) |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 dirty all_purpose | fly honorable: same_family_same_presentation | Baitfish Slider Fly (162); Deceiver (152) | Foam Gurgler (170); Zonker Streamer (144) | Warmwater Crawfish Fly (160, alt edge 16) |
| Yampa River mountain-west SMB context<br>2025-05-19 stained all_purpose | fly top: same_family_same_presentation | Bucktail Streamer (162); Conehead Streamer (162) | Deceiver (162); Sculpin Streamer (170) | Muddler Minnow (170, alt edge 8) |
| Colorado mountain-west SMB reservoir<br>2025-04-23 clear big_fish | fly honorable: same_family_same_presentation | Game Changer (154); Rabbit-Strip Leech (126) | Articulated Baitfish Streamer (146); Feather Jig Leech (134) | Baitfish Slider Fly (140, alt edge 6) |
| Colorado mountain-west SMB reservoir<br>2025-04-23 dirty big_fish | fly honorable: same_family_same_presentation | Game Changer (154); Rabbit-Strip Leech (134) | Articulated Baitfish Streamer (154); Feather Jig Leech (134) | Baitfish Slider Fly (140, alt edge 6) |
| Table Rock / Ozark clear reservoir<br>2025-09-13 dirty big_fish | fly honorable: same_family_same_presentation | Articulated Baitfish Streamer (154); Rabbit-Strip Leech (134) | Game Changer (154); Feather Jig Leech (134) | Baitfish Slider Fly (140, alt edge 6) |
| Lake Champlain SMB water<br>2025-04-27 dirty all_purpose | fly top: same_family_same_presentation | Deceiver (162); Baitfish Slider Fly (152) | Zonker Streamer (154); Woolly Bugger (158) | Warmwater Crawfish Fly (160, alt edge 6) |
| New River Appalachian SMB context<br>2025-03-26 dirty big_fish | fly honorable: same_family_different_presentation | Articulated Baitfish Streamer (140); Rabbit-Strip Leech (164) | Sculpzilla (166); Articulated Dungeon Streamer (156) | Sculpin Streamer (162, alt edge 6) |
| Trinity Lake northern California SMB water<br>2025-10-25 dirty all_purpose | fly top: same_family_same_presentation | Deceiver (162); Baitfish Slider Fly (152) | Zonker Streamer (154); Warmwater Crawfish Fly (160) | Woolly Bugger (158, alt edge 4) |
| Yampa River mountain-west SMB context<br>2025-05-19 clear big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (154); Rabbit-Strip Leech (142) | Game Changer (154); Articulated Baitfish Streamer (146) | Bucktail Streamer (150, alt edge 4) |
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
| Upper Mississippi smallmouth river<br>2025-01-26 clear A | lure | Ned Rig; Finesse Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 clear B | lure | Texas-Rigged Soft-Plastic Craw; Tube Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 stained A | lure | Hair Jig; Ned Rig |
| Upper Mississippi smallmouth river<br>2025-01-26 stained B | lure | Texas-Rigged Soft-Plastic Craw; Tube Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty A | lure | Texas-Rigged Soft-Plastic Craw; Blade Bait |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty B | lure | Ned Rig; Tube Jig |
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
| New River Appalachian SMB context<br>2025-05-06 clear B | lure | Flat-Sided Crankbait; Tube Jig |
| New River Appalachian SMB context<br>2025-05-06 stained B | lure | Flat-Sided Crankbait; Tube Jig |
| New River Appalachian SMB context<br>2025-05-06 dirty B | lure | Flat-Sided Crankbait; Blade Bait |
| Yampa River mountain-west SMB context<br>2025-05-19 clear B | lure | Medium-Diving Crankbait; Tube Jig |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear B | lure | Medium-Diving Crankbait; Inline Spinner |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Tube Jig [lure] | 11 | Big Smallmouth Tube (6), Football Jig (4), Magnum Jerkbait (1) | 16.7 |
| Medium-Diving Crankbait [lure] | 7 | Compact Glide Bait (3), Football Jig (3), Magnum Jerkbait (1) | 11.1 |
| Spinnerbait [lure] | 7 | Football Jig (5), Big Smallmouth Tube (2) | 21.7 |
| Blade Bait [lure] | 6 | Football Jig (4), Big Smallmouth Tube (2) | 6.7 |
| Bladed Jig [lure] | 6 | Big Smallmouth Tube (3), Football Jig (3) | 26 |
| Flat-Sided Crankbait [lure] | 6 | Big Smallmouth Tube (6) | 18 |
| Inline Spinner [lure] | 6 | Big Smallmouth Tube (2), Compact Glide Bait (2), Football Jig (2) | 29 |
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
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (lure) | Weightless Stick Worm (158; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Deep-Diving Crankbait (148; goal:all_purpose:versatile_search:+12) | Inline Spinner (170, alt edge 12) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| clear_subtle_wind_watch | 38 |
| dirty_vibration_acceptable | 10 |
| other_wind_watch | 8 |
| current_open_water_acceptable | 4 |
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
| true_dirty_stained_wind_miss | Mille Lacs / Upper Midwest natural lake<br>2025-07-16 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Compact Glide Bait 168<br>Big Smallmouth Tube 152 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 431 |
| acceptable_fit | 947 |
| strong_fit | 1070 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | medium_confidence_archive | 121 |
| watch | big_fish | B | fly | medium_confidence_archive | 92 |
| watch | big_fish | A | lure | medium_confidence_archive | 73 |
| watch | big_fish | A | fly | cold_slow_or_front | 71 |
| watch | big_fish | B | lure | medium_confidence_archive | 61 |
| watch | big_fish | B | fly | cold_slow_or_front | 59 |
| watch | big_fish | A | fly | dirty_vibration | 37 |
| watch | big_fish | A | lure | cold_slow_or_front | 35 |
| watch | all_purpose | A | fly | medium_confidence_archive | 30 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 28 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 27 |
| watch | big_fish | A | lure | dirty_vibration | 25 |
| watch | big_fish | B | fly | dirty_vibration | 25 |
| watch | all_purpose | B | fly | medium_confidence_archive | 23 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 23 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 23 |
| watch | big_fish | B | lure | cold_slow_or_front | 23 |
| watch | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 23 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 21 |
| watch | all_purpose | A | lure | medium_confidence_archive | 19 |
| watch | big_fish | B | lure | dirty_vibration | 19 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 18 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 16 |
| watch | big_fish | A | fly | warming_search | 15 |
| watch | all_purpose | B | fly | cold_slow_or_front | 14 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 14 |
| watch | all_purpose | A | fly | cold_slow_or_front | 13 |
| watch | all_purpose | B | lure | medium_confidence_archive | 12 |
| watch | big_fish | B | fly | warming_search | 12 |
| watch | all_purpose | B | fly | dirty_vibration | 11 |
| watch | all_purpose | A | fly | warming_search | 9 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 8 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 7 |
| watch | all_purpose | A | lure | cold_slow_or_front | 7 |
| watch | big_fish | A | lure | warming_search | 7 |
| watch | big_fish | B | lure | warming_search | 6 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 5 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 5 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 5 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 5 |
| watch | all_purpose | B | lure | warming_search | 5 |
| watch | all_purpose | A | lure | warming_search | 4 |
| watch | all_purpose | B | lure | dirty_vibration | 4 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 4 |
| watch | big_fish | A | lure | heat_limited_finesse | 4 |
| watch | big_fish | B | fly | calm_low_light_surface | 4 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 3 |
| watch | all_purpose | A | fly | dirty_vibration | 3 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 3 |
| watch | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 3 |
| watch | big_fish | B | lure | calm_low_light_surface | 3 |
| watch | big_fish | B | lure | heat_limited_finesse | 3 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 3 |
| watch | all_purpose | A | lure | river_elevated_runoff_current | 2 |
| watch | all_purpose | B | fly | warming_search | 2 |
| watch | all_purpose | B | lure | calm_low_light_surface | 2 |
| watch | all_purpose | B | lure | cold_slow_or_front | 2 |
| watch | big_fish | A | fly | calm_low_light_surface | 2 |
| watch | big_fish | A | fly | heat_limited_finesse | 2 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 2 |
| watch | all_purpose | A | fly | calm_low_light_surface | 1 |
| watch | all_purpose | A | fly | heat_limited_finesse | 1 |
| watch | all_purpose | A | lure | calm_low_light_surface | 1 |
| watch | all_purpose | A | lure | dirty_vibration | 1 |
| watch | all_purpose | A | lure | heat_limited_finesse | 1 |
| watch | all_purpose | B | fly | calm_bright_clear_subtle | 1 |
| watch | all_purpose | B | fly | calm_low_light_surface | 1 |
| watch | all_purpose | B | lure | heat_limited_finesse | 1 |
| watch | big_fish | A | lure | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | calm_bright_clear_subtle | 1 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 185 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 183 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 115 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 114 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 100 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 95 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 93 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 92 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 75 |
| acceptable_fit | big_fish | B | fly | warming_search | 65 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 7 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 7 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| New River Appalachian SMB context<br>2025-09-29 dirty big_fish A | Buzzbait (lure_of_the_day, lure, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>calm_surface+low_light_surface+dirty_vibration+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-09-29 stained all_purpose B | Clouser Minnow (fly_of_the_day, fly, score 180) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+dirty_vibration+warming_search+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 stained all_purpose A | Blade Bait (lure_of_the_day, lure, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained all_purpose A | Blade Bait (lure_of_the_day, lure, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 dirty all_purpose B | Blade Bait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 stained all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 dirty all_purpose B | Deep-Diving Crankbait (lure_of_the_day, lure, score 180) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 dirty all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 178) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 stained all_purpose A | Jighead Marabou Leech (honorable_fly, fly, score 172) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained all_purpose A | Rabbit-Strip Leech (honorable_fly, fly, score 172) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 stained all_purpose B | Warmwater Crawfish Fly (fly_of_the_day, fly, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 dirty all_purpose A | Deceiver (fly_of_the_day, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 dirty big_fish A | Rabbit-Strip Leech (honorable_fly, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 stained all_purpose B | Deceiver (fly_of_the_day, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 stained big_fish A | Rabbit-Strip Leech (honorable_fly, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 dirty all_purpose B | Deceiver (fly_of_the_day, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 dirty big_fish B | Rabbit-Strip Leech (honorable_fly, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained all_purpose B | Deceiver (fly_of_the_day, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained big_fish A | Rabbit-Strip Leech (honorable_fly, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 dirty all_purpose A | Inline Spinner (honorable_lure, lure, score 162) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 1056 | 506 | 48% |
| clear_subtle | 336 | 180 | 54% |
| dirty_vibration | 864 | 103 | 12% |
| heat_finesse | 48 | 12 | 25% |
| cold_slow | 672 | 415 | 62% |
| low_light_surface | 288 | 87 | 30% |
| calm_surface | 432 | 109 | 25% |
| Big Fish upside | 1224 | 908 | 74% |
| All Purpose reliable/versatile | 1224 | 1130 | 92% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Game Changer [fly] (161), Articulated Baitfish Streamer [fly] (149), Rabbit-Strip Leech [fly] (138), Big Smallmouth Tube [lure] (114), Clouser Minnow [fly] (101), Inline Spinner [lure] (101), Medium-Diving Crankbait [lure] (101), Suspending Jerkbait [lure] (100), Baitfish Slider Fly [fly] (96), Deceiver [fly] (81), Football Jig [lure] (78), Magnum Jerkbait [lure] (77) |
| All-purpose | Clouser Minnow [fly] (101), Suspending Jerkbait [lure] (90), Inline Spinner [lure] (89), Baitfish Slider Fly [fly] (62), Zonker Streamer [fly] (59), Deceiver [fly] (56), Tube Jig [lure] (56), Soft Plastic Jerkbait [lure] (47) |
| Big-fish | Game Changer [fly] (139), Articulated Baitfish Streamer [fly] (131), Rabbit-Strip Leech [fly] (123), Big Smallmouth Tube [lure] (114), Football Jig [lure] (78), Magnum Jerkbait [lure] (77), Compact Glide Bait [lure] (68), Medium-Diving Crankbait [lure] (55) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 30 | 30 | 0 | 1 | 0 |
| fly | 24 | 24 | 0 | 1 | 1 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 161/612 | 26.3% | big_fish:139, all_purpose:22 | A:81, B:80 | top:82, honorable:79 | clear:59, dirty:55, stained:47 | freshwater_lake_pond:130, freshwater_river:31 | wind_reaction:68, dirty_vibration:50, warming_search:44, cold_slow:33 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 149/612 | 24.3% | big_fish:131, all_purpose:18 | A:86, B:63 | top:75, honorable:74 | dirty:57, stained:51, clear:41 | freshwater_lake_pond:127, freshwater_river:22 | wind_reaction:61, dirty_vibration:49, warming_search:39, cold_slow:33 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 138/612 | 22.5% | big_fish:123, all_purpose:15 | A:76, B:62 | honorable:111, top:27 | stained:53, dirty:47, clear:38 | freshwater_lake_pond:111, freshwater_river:27 | wind_reaction:63, cold_slow:52, dirty_vibration:48, warming_search:37 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 114/540 | 21.1% | big_fish:114 | A:81, B:33 | honorable:71, top:43 | clear:42, stained:40, dirty:32 | freshwater_lake_pond:81, freshwater_river:33 | wind_reaction:40, dirty_vibration:32, cold_slow:30, warming_search:30 |
| Clouser Minnow<br>clouser_minnow | fly | 101/612 | 16.5% | all_purpose:101 | B:72, A:29 | honorable:60, top:41 | stained:38, clear:37, dirty:26 | freshwater_lake_pond:84, freshwater_river:17 | warming_search:37, wind_reaction:34, dirty_vibration:27, calm_surface:21 |
| Inline Spinner<br>inline_spinner | lure | 101/612 | 16.5% | all_purpose:89, big_fish:12 | B:54, A:47 | top:54, honorable:47 | stained:37, dirty:34, clear:30 | freshwater_lake_pond:86, freshwater_river:15 | wind_reaction:67, dirty_vibration:50, warming_search:24, open_water_search:20 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 101/612 | 16.5% | big_fish:55, all_purpose:46 | B:66, A:35 | top:68, honorable:33 | dirty:43, stained:37, clear:21 | freshwater_lake_pond:91, freshwater_river:10 | wind_reaction:87, dirty_vibration:70, open_water_search:27, warming_search:23 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 100/612 | 16.3% | all_purpose:90, big_fish:10 | B:57, A:43 | top:51, honorable:49 | dirty:34, stained:34, clear:32 | freshwater_lake_pond:88, freshwater_river:12 | wind_reaction:74, dirty_vibration:52, cold_slow:28, warming_search:17 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 96/480 | 20% | all_purpose:62, big_fish:34 | A:56, B:40 | honorable:59, top:37 | dirty:42, stained:32, clear:22 | freshwater_lake_pond:93, freshwater_river:3 | wind_reaction:66, dirty_vibration:50, warming_search:23, open_water_search:14 |
| Deceiver<br>deceiver | fly | 81/612 | 13.2% | all_purpose:56, big_fish:25 | A:44, B:37 | top:61, honorable:20 | dirty:34, stained:33, clear:14 | freshwater_lake_pond:78, freshwater_river:3 | wind_reaction:75, dirty_vibration:62, open_water_search:25, cold_slow:22 |
| Football Jig<br>football_jig | lure | 78/468 | 16.7% | big_fish:78 | A:41, B:37 | honorable:56, top:22 | dirty:31, clear:29, stained:18 | freshwater_lake_pond:78 | wind_reaction:42, warming_search:27, dirty_vibration:25, cold_slow:21 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 77/360 | 21.4% | big_fish:77 | A:49, B:28 | honorable:48, top:29 | clear:30, stained:26, dirty:21 | freshwater_lake_pond:54, freshwater_river:23 | wind_reaction:28, cold_slow:26, warming_search:26, dirty_vibration:20 |
| Zonker Streamer<br>zonker_streamer | fly | 76/612 | 12.4% | all_purpose:59, big_fish:17 | B:41, A:35 | top:66, honorable:10 | dirty:28, stained:27, clear:21 | freshwater_lake_pond:72, freshwater_river:4 | wind_reaction:68, dirty_vibration:50, open_water_search:20, warming_search:14 |
| Tube Jig<br>tube_jig | lure | 72/612 | 11.8% | all_purpose:56, big_fish:16 | A:36, B:36 | top:50, honorable:22 | clear:43, stained:21, dirty:8 | freshwater_lake_pond:44, freshwater_river:28 | cold_slow:46, wind_reaction:23, clear_subtle:22, warming_search:11 |
| Compact Glide Bait<br>compact_glidebait | lure | 68/300 | 22.7% | big_fish:68 | A:44, B:24 | honorable:41, top:27 | clear:23, stained:23, dirty:22 | freshwater_lake_pond:68 | wind_reaction:29, dirty_vibration:19, calm_surface:18, clear_subtle:13 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 48/480 | 10% | all_purpose:47, big_fish:1 | A:32, B:16 | honorable:25, top:23 | clear:24, stained:15, dirty:9 | freshwater_lake_pond:33, freshwater_river:15 | calm_surface:20, clear_subtle:15, warming_search:15, low_light_surface:9 |
| Woolly Bugger<br>woolly_bugger | fly | 46/612 | 7.5% | all_purpose:39, big_fish:7 | B:24, A:22 | honorable:34, top:12 | dirty:17, clear:16, stained:13 | freshwater_lake_pond:39, freshwater_river:7 | cold_slow:28, warming_search:17, wind_reaction:10, dirty_vibration:8 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 40/348 | 11.5% | all_purpose:35, big_fish:5 | B:22, A:18 | honorable:23, top:17 | clear:18, stained:13, dirty:9 | freshwater_lake_pond:40 | wind_reaction:14, cold_slow:12, clear_subtle:11, warming_search:10 |
| Deer Hair Slider<br>deer_hair_slider | fly | 36/228 | 15.8% | big_fish:36 | A:27, B:9 | top:21, honorable:15 | clear:12, dirty:12, stained:12 | freshwater_lake_pond:24, freshwater_river:12 | calm_surface:27, low_light_surface:18, current_swing:9, dirty_vibration:8 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 35/228 | 15.4% | all_purpose:32, big_fish:3 | B:21, A:14 | top:27, honorable:8 | clear:14, dirty:11, stained:10 | freshwater_lake_pond:25, freshwater_river:10 | calm_surface:28, low_light_surface:16, clear_subtle:7, current_swing:7 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 35/168 | 20.8% | big_fish:35 | B:19, A:16 | honorable:18, top:17 | dirty:13, clear:11, stained:11 | freshwater_river:21, freshwater_lake_pond:14 | cold_slow:24, wind_reaction:17, dirty_vibration:15, warming_search:9 |
| Walking Topwater<br>walking_topwater | lure | 34/228 | 14.9% | big_fish:34 | B:21, A:13 | top:25, honorable:9 | clear:13, stained:12, dirty:9 | freshwater_lake_pond:20, freshwater_river:14 | calm_surface:24, low_light_surface:15, current_swing:9, warming_search:8 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 33/480 | 6.9% | all_purpose:26, big_fish:7 | B:20, A:13 | honorable:17, top:16 | dirty:21, stained:12 | freshwater_lake_pond:20, freshwater_river:13 | dirty_vibration:31, wind_reaction:19, current_swing:12, cold_slow:7 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 32/612 | 5.2% | all_purpose:19, big_fish:13 | B:21, A:11 | honorable:22, top:10 | dirty:15, stained:10, clear:7 | freshwater_lake_pond:26, freshwater_river:6 | warming_search:27, calm_surface:7, low_light_surface:6, current_swing:1 |
| Spinnerbait<br>spinnerbait | lure | 30/612 | 4.9% | all_purpose:17, big_fish:13 | B:18, A:12 | honorable:17, top:13 | dirty:16, stained:14 | freshwater_lake_pond:19, freshwater_river:11 | dirty_vibration:30, wind_reaction:19, current_swing:11, warming_search:10 |
| Buzzbait<br>buzzbait | lure | 30/228 | 13.2% | big_fish:23, all_purpose:7 | A:15, B:15 | top:20, honorable:10 | dirty:15, stained:10, clear:5 | freshwater_river:17, freshwater_lake_pond:13 | low_light_surface:21, calm_surface:18, current_swing:14, dirty_vibration:14 |
| Sculpzilla<br>sculpzilla | fly | 30/144 | 20.8% | big_fish:30 | A:19, B:11 | top:19, honorable:11 | dirty:12, stained:10, clear:8 | freshwater_river:30 | current_swing:15, cold_slow:12, dirty_vibration:12, calm_surface:9 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 29/612 | 4.7% | all_purpose:26, big_fish:3 | B:15, A:14 | honorable:18, top:11 | clear:16, stained:10, dirty:3 | freshwater_lake_pond:21, freshwater_river:8 | warming_search:16, clear_subtle:12, calm_surface:8, current_swing:2 |
| Bladed Jig<br>bladed_jig | lure | 28/612 | 4.6% | big_fish:15, all_purpose:13 | A:14, B:14 | top:17, honorable:11 | dirty:14, stained:14 | freshwater_river:15, freshwater_lake_pond:13 | dirty_vibration:28, current_swing:14, wind_reaction:14, warming_search:10 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 28/612 | 4.6% | all_purpose:28 | A:17, B:11 | honorable:15, top:13 | clear:11, dirty:11, stained:6 | freshwater_lake_pond:19, freshwater_river:9 | cold_slow:22, wind_reaction:11, dirty_vibration:5, open_water_search:5 |
| Ned Rig<br>ned_rig | lure | 28/612 | 4.6% | all_purpose:23, big_fish:5 | B:21, A:7 | honorable:20, top:8 | clear:14, dirty:8, stained:6 | freshwater_lake_pond:14, freshwater_river:14 | cold_slow:22, clear_subtle:8, wind_reaction:6, warming_search:3 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 27/612 | 4.4% | all_purpose:21, big_fish:6 | B:15, A:12 | honorable:16, top:11 | clear:14, dirty:8, stained:5 | freshwater_river:14, freshwater_lake_pond:13 | cold_slow:21, clear_subtle:8, wind_reaction:4, warming_search:3 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 27/468 | 5.8% | all_purpose:24, big_fish:3 | B:16, A:11 | honorable:16, top:11 | clear:16, stained:8, dirty:3 | freshwater_lake_pond:27 | cold_slow:15, wind_reaction:10, warming_search:8, clear_subtle:7 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 26/480 | 5.4% | all_purpose:18, big_fish:8 | B:20, A:6 | honorable:13, top:13 | clear:19, stained:5, dirty:2 | freshwater_lake_pond:26 | clear_subtle:15, wind_reaction:10, warming_search:6, calm_surface:5 |
| Lipless Crankbait<br>lipless_crankbait | lure | 24/612 | 3.9% | big_fish:13, all_purpose:11 | A:14, B:10 | top:18, honorable:6 | stained:14, dirty:10 | freshwater_lake_pond:24 | dirty_vibration:24, wind_reaction:24, open_water_search:17, cold_slow:2 |
| Blade Bait<br>blade_bait | lure | 23/612 | 3.8% | all_purpose:14, big_fish:9 | B:12, A:11 | top:16, honorable:7 | dirty:13, clear:6, stained:4 | freshwater_lake_pond:17, freshwater_river:6 | cold_slow:18, wind_reaction:13, open_water_search:11, dirty_vibration:7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 23/612 | 3.8% | all_purpose:21, big_fish:2 | B:13, A:10 | top:13, honorable:10 | clear:14, stained:5, dirty:4 | freshwater_lake_pond:20, freshwater_river:3 | clear_subtle:11, cold_slow:11, warming_search:7, wind_reaction:6 |
| Feather Jig Leech<br>feather_jig_leech | fly | 22/612 | 3.6% | all_purpose:13, big_fish:9 | A:11, B:11 | honorable:14, top:8 | clear:9, stained:7, dirty:6 | freshwater_lake_pond:17, freshwater_river:5 | warming_search:22, current_swing:3, dirty_vibration:2, calm_surface:1 |
| Sculpin Streamer<br>sculpin_streamer | fly | 22/144 | 15.3% | all_purpose:22 | B:16, A:6 | top:16, honorable:6 | stained:9, clear:7, dirty:6 | freshwater_river:22 | cold_slow:16, dirty_vibration:9, current_swing:7, wind_reaction:5 |
| Finesse Jig<br>finesse_jig | lure | 21/612 | 3.4% | all_purpose:20, big_fish:1 | B:14, A:7 | top:12, honorable:9 | clear:10, stained:8, dirty:3 | freshwater_lake_pond:11, freshwater_river:10 | cold_slow:14, clear_subtle:5, wind_reaction:5, heat_finesse:3 |
| Popper Fly<br>popper_fly | fly | 20/228 | 8.8% | all_purpose:20 | B:13, A:7 | top:17, honorable:3 | stained:10, clear:6, dirty:4 | freshwater_lake_pond:17, freshwater_river:3 | calm_surface:16, low_light_surface:9, clear_subtle:2, current_swing:2 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 20/156 | 12.8% | all_purpose:19, big_fish:1 | B:11, A:9 | top:14, honorable:6 | clear:8, dirty:8, stained:4 | freshwater_lake_pond:16, freshwater_river:4 | calm_surface:7, clear_subtle:5, heat_finesse:4, low_light_surface:4 |
| Muddler Minnow<br>muddler_sculpin | fly | 20/144 | 13.9% | all_purpose:19, big_fish:1 | A:14, B:6 | top:14, honorable:6 | clear:11, stained:5, dirty:4 | freshwater_river:20 | cold_slow:14, current_swing:7, clear_subtle:5, dirty_vibration:3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 19/144 | 13.2% | all_purpose:16, big_fish:3 | B:11, A:8 | honorable:12, top:7 | clear:12, stained:4, dirty:3 | freshwater_river:19 | clear_subtle:9, cold_slow:9, current_swing:7, warming_search:6 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 18/468 | 3.8% | all_purpose:14, big_fish:4 | A:11, B:7 | honorable:10, top:8 | dirty:13, clear:3, stained:2 | freshwater_lake_pond:18 | cold_slow:8, wind_reaction:5, calm_surface:4, open_water_search:3 |
| Wake Bait<br>wake_bait | lure | 18/168 | 10.7% | big_fish:18 | B:11, A:7 | top:14, honorable:4 | stained:7, clear:6, dirty:5 | freshwater_lake_pond:18 | calm_surface:14, low_light_surface:8, clear_subtle:4, cold_slow:1 |
| Swim Jig<br>swim_jig | lure | 17/612 | 2.8% | all_purpose:17 | A:9, B:8 | honorable:13, top:4 | stained:9, dirty:6, clear:2 | freshwater_lake_pond:13, freshwater_river:4 | warming_search:12, calm_surface:6, low_light_surface:2, current_swing:1 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 16/480 | 3.3% | all_purpose:8, big_fish:8 | B:9, A:7 | top:13, honorable:3 | clear:7, stained:5, dirty:4 | freshwater_river:9, freshwater_lake_pond:7 | cold_slow:7, clear_subtle:4, calm_surface:2, none:2 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 13/120 | 10.8% | all_purpose:11, big_fish:2 | B:8, A:5 | honorable:8, top:5 | clear:7, dirty:4, stained:2 | freshwater_river:13 | current_swing:8, clear_subtle:6, calm_surface:5, dirty_vibration:4 |
| Hair Jig<br>hair_jig | lure | 7/144 | 4.9% | all_purpose:4, big_fish:3 | A:4, B:3 | honorable:5, top:2 | clear:5, stained:2 | freshwater_river:7 | current_swing:6, cold_slow:4, clear_subtle:2, calm_surface:1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 4/144 | 2.8% | all_purpose:3, big_fish:1 | A:3, B:1 | top:3, honorable:1 | stained:4 | freshwater_river:4 | dirty_vibration:4, cold_slow:2, current_swing:2, warming_search:2 |
| Conehead Streamer<br>conehead_streamer | fly | 3/144 | 2.1% | all_purpose:2, big_fish:1 | A:2, B:1 | honorable:2, top:1 | clear:1, dirty:1, stained:1 | freshwater_river:3 | cold_slow:2, dirty_vibration:2, wind_reaction:2, calm_surface:1 |
| Glide Bait<br>glidebait | lure | 2/36 | 5.6% | big_fish:2 | A:2 | honorable:1, top:1 | clear:2 | freshwater_lake_pond:2 | wind_reaction:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/132 | 0.8% | all_purpose:1 | A:1 | top:1 | stained:1 | freshwater_lake_pond:1 | warming_search:1 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 161/2448 (6.6%) | 82/1224 (6.7%) | 79/1224 (6.5%) | - | 161/1224 (13.2%) |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 149/2448 (6.1%) | 75/1224 (6.1%) | 74/1224 (6%) | - | 149/1224 (12.2%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 138/2448 (5.6%) | 27/1224 (2.2%) | 111/1224 (9.1%) | - | 138/1224 (11.3%) |  |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 114/2448 (4.7%) | 43/1224 (3.5%) | 71/1224 (5.8%) | 114/1224 (9.3%) | - |  |
| Clouser Minnow<br>clouser_minnow | fly | 101/2448 (4.1%) | 41/1224 (3.3%) | 60/1224 (4.9%) | - | 101/1224 (8.3%) |  |
| Inline Spinner<br>inline_spinner | lure | 101/2448 (4.1%) | 54/1224 (4.4%) | 47/1224 (3.8%) | 101/1224 (8.3%) | - |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 101/2448 (4.1%) | 68/1224 (5.6%) | 33/1224 (2.7%) | 101/1224 (8.3%) | - |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 100/2448 (4.1%) | 51/1224 (4.2%) | 49/1224 (4%) | 100/1224 (8.2%) | - |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 96/2448 (3.9%) | 37/1224 (3%) | 59/1224 (4.8%) | - | 96/1224 (7.8%) |  |
| Deceiver<br>deceiver | fly | 81/2448 (3.3%) | 61/1224 (5%) | 20/1224 (1.6%) | - | 81/1224 (6.6%) |  |
| Football Jig<br>football_jig | lure | 78/2448 (3.2%) | 22/1224 (1.8%) | 56/1224 (4.6%) | 78/1224 (6.4%) | - |  |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 77/2448 (3.1%) | 29/1224 (2.4%) | 48/1224 (3.9%) | 77/1224 (6.3%) | - |  |
| Zonker Streamer<br>zonker_streamer | fly | 76/2448 (3.1%) | 66/1224 (5.4%) | 10/1224 (0.8%) | - | 76/1224 (6.2%) |  |
| Tube Jig<br>tube_jig | lure | 72/2448 (2.9%) | 50/1224 (4.1%) | 22/1224 (1.8%) | 72/1224 (5.9%) | - |  |
| Compact Glide Bait<br>compact_glidebait | lure | 68/2448 (2.8%) | 27/1224 (2.2%) | 41/1224 (3.3%) | 68/1224 (5.6%) | - |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 48/2448 (2%) | 23/1224 (1.9%) | 25/1224 (2%) | 48/1224 (3.9%) | - |  |
| Woolly Bugger<br>woolly_bugger | fly | 46/2448 (1.9%) | 12/1224 (1%) | 34/1224 (2.8%) | - | 46/1224 (3.8%) |  |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 40/2448 (1.6%) | 17/1224 (1.4%) | 23/1224 (1.9%) | - | 40/1224 (3.3%) |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 36/2448 (1.5%) | 21/1224 (1.7%) | 15/1224 (1.2%) | - | 36/1224 (2.9%) |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 35/2448 (1.4%) | 17/1224 (1.4%) | 18/1224 (1.5%) | - | 35/1224 (2.9%) |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 35/2448 (1.4%) | 27/1224 (2.2%) | 8/1224 (0.7%) | - | 35/1224 (2.9%) |  |
| Walking Topwater<br>walking_topwater | lure | 34/2448 (1.4%) | 25/1224 (2%) | 9/1224 (0.7%) | 34/1224 (2.8%) | - |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 33/2448 (1.3%) | 16/1224 (1.3%) | 17/1224 (1.4%) | 33/1224 (2.7%) | - |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 32/2448 (1.3%) | 10/1224 (0.8%) | 22/1224 (1.8%) | 32/1224 (2.6%) | - |  |
| Sculpzilla<br>sculpzilla | fly | 30/2448 (1.2%) | 19/1224 (1.6%) | 11/1224 (0.9%) | - | 30/1224 (2.5%) |  |
| Buzzbait<br>buzzbait | lure | 30/2448 (1.2%) | 20/1224 (1.6%) | 10/1224 (0.8%) | 30/1224 (2.5%) | - |  |
| Spinnerbait<br>spinnerbait | lure | 30/2448 (1.2%) | 13/1224 (1.1%) | 17/1224 (1.4%) | 30/1224 (2.5%) | - |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 29/2448 (1.2%) | 11/1224 (0.9%) | 18/1224 (1.5%) | 29/1224 (2.4%) | - |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 28/2448 (1.1%) | 13/1224 (1.1%) | 15/1224 (1.2%) | - | 28/1224 (2.3%) |  |
| Bladed Jig<br>bladed_jig | lure | 28/2448 (1.1%) | 17/1224 (1.4%) | 11/1224 (0.9%) | 28/1224 (2.3%) | - |  |
| Ned Rig<br>ned_rig | lure | 28/2448 (1.1%) | 8/1224 (0.7%) | 20/1224 (1.6%) | 28/1224 (2.3%) | - |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 27/2448 (1.1%) | 11/1224 (0.9%) | 16/1224 (1.3%) | 27/1224 (2.2%) | - |  |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 27/2448 (1.1%) | 11/1224 (0.9%) | 16/1224 (1.3%) | 27/1224 (2.2%) | - |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 26/2448 (1.1%) | 13/1224 (1.1%) | 13/1224 (1.1%) | - | 26/1224 (2.1%) |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 24/2448 (1%) | 18/1224 (1.5%) | 6/1224 (0.5%) | 24/1224 (2%) | - |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 23/2448 (0.9%) | 13/1224 (1.1%) | 10/1224 (0.8%) | - | 23/1224 (1.9%) |  |
| Blade Bait<br>blade_bait | lure | 23/2448 (0.9%) | 16/1224 (1.3%) | 7/1224 (0.6%) | 23/1224 (1.9%) | - |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 22/2448 (0.9%) | 8/1224 (0.7%) | 14/1224 (1.1%) | - | 22/1224 (1.8%) |  |
| Sculpin Streamer<br>sculpin_streamer | fly | 22/2448 (0.9%) | 16/1224 (1.3%) | 6/1224 (0.5%) | - | 22/1224 (1.8%) |  |
| Finesse Jig<br>finesse_jig | lure | 21/2448 (0.9%) | 12/1224 (1%) | 9/1224 (0.7%) | 21/1224 (1.7%) | - |  |
| Muddler Minnow<br>muddler_sculpin | fly | 20/2448 (0.8%) | 14/1224 (1.1%) | 6/1224 (0.5%) | - | 20/1224 (1.6%) |  |
| Popper Fly<br>popper_fly | fly | 20/2448 (0.8%) | 17/1224 (1.4%) | 3/1224 (0.2%) | - | 20/1224 (1.6%) |  |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 20/2448 (0.8%) | 14/1224 (1.1%) | 6/1224 (0.5%) | 20/1224 (1.6%) | - |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 19/2448 (0.8%) | 7/1224 (0.6%) | 12/1224 (1%) | - | 19/1224 (1.6%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 18/2448 (0.7%) | 8/1224 (0.7%) | 10/1224 (0.8%) | 18/1224 (1.5%) | - |  |
| Wake Bait<br>wake_bait | lure | 18/2448 (0.7%) | 14/1224 (1.1%) | 4/1224 (0.3%) | 18/1224 (1.5%) | - |  |
| Swim Jig<br>swim_jig | lure | 17/2448 (0.7%) | 4/1224 (0.3%) | 13/1224 (1.1%) | 17/1224 (1.4%) | - |  |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 16/2448 (0.7%) | 13/1224 (1.1%) | 3/1224 (0.2%) | 16/1224 (1.3%) | - |  |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 13/2448 (0.5%) | 5/1224 (0.4%) | 8/1224 (0.7%) | - | 13/1224 (1.1%) |  |
| Hair Jig<br>hair_jig | lure | 7/2448 (0.3%) | 2/1224 (0.2%) | 5/1224 (0.4%) | 7/1224 (0.6%) | - |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 4/2448 (0.2%) | 3/1224 (0.2%) | 1/1224 (0.1%) | - | 4/1224 (0.3%) |  |
| Conehead Streamer<br>conehead_streamer | fly | 3/2448 (0.1%) | 1/1224 (0.1%) | 2/1224 (0.2%) | - | 3/1224 (0.2%) |  |
| Glide Bait<br>glidebait | lure | 2/2448 (0.1%) | 1/1224 (0.1%) | 1/1224 (0.1%) | 2/1224 (0.2%) | - |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/2448 (0%) | 1/1224 (0.1%) | 0/1224 (0%) | 1/1224 (0.1%) | - |  |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

| Profile | Gear | Selected/Opp | Rate | Close opp | Far-behind opp | Available tags | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Shaky-Head Worm<br>shaky_head_worm | lure | 1/132 | 0.8% | 35 | 62 | cold_slow:72, wind_reaction:72, dirty_vibration:48, warming_search:48, open_water_search:36 | Medium-Diving Crankbait (top), Football Jig (honorable):8, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):6, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):6, Finesse Jig (top), Ned Rig (honorable):5 |
| Conehead Streamer<br>conehead_streamer | fly | 3/144 | 2.1% | 33 | 69 | cold_slow:72, current_swing:60, dirty_vibration:56, calm_surface:36, warming_search:36 | Articulated Baitfish Streamer (top), Game Changer (honorable):5, Game Changer (top), Rabbit-Strip Leech (honorable):5, Muddler Minnow (top), Crawfish Streamer (honorable):5, Sculpzilla (top), Articulated Dungeon Streamer (honorable):5 |

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 161/612 | 26.3% | big_fish:139, all_purpose:22 | wind_reaction:68, dirty_vibration:50, warming_search:44, cold_slow:33, calm_surface:31 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Magnum Jerkbait<br>magnum_jerkbait | lure | home-window >30% severe | 41/84 | 48.8% | selector_filtering_variety_jitter:24 | AP/BF 0/0, 41/84<br>clarity clear:46, stained:38<br>bucket cold_slow_or_front:32, warming_search:30, breezy_windy_stained_reaction:10 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | home-window >25% overdominant | 79/280 | 28.2% | goal_tags:115 | AP/BF 38/140, 41/140<br>clarity dirty:140, stained:140<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, warming_search:52 |
| Game Changer<br>game_changer | fly | home-window >25% overdominant | 86/336 | 25.6% | goal_tags:103 | AP/BF 13/168, 73/168<br>clarity clear:112, dirty:112, stained:112<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, cold_slow_or_front:60 |
| Deer Hair Slider<br>deer_hair_slider | fly | home-window >20% watch | 36/144 | 25% | goal_tags:72 | AP/BF 0/72, 36/72<br>clarity clear:48, dirty:48, stained:48<br>bucket stable_pleasant_medium_confidence_archive:52, calm_low_light_surface:36, cold_slow_or_front:28 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | home-window >20% watch | 82/360 | 22.8% | goal_tags:208 | AP/BF 0/180, 82/180<br>clarity clear:180, stained:180<br>bucket cold_slow_or_front:100, breezy_windy_stained_reaction:72, warming_search:68 |
| Walking Topwater<br>walking_topwater | lure | home-window >20% watch | 32/144 | 22.2% | goal_tags:68 | AP/BF 0/72, 32/72<br>clarity clear:48, dirty:48, stained:48<br>bucket stable_pleasant_medium_confidence_archive:52, calm_low_light_surface:36, cold_slow_or_front:28 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | home-window >20% watch | 69/312 | 22.1% | forage_clarity_stack:90 | AP/BF 11/156, 58/156<br>clarity clear:144, stained:96, dirty:72<br>bucket cold_slow_or_front:148, dirty_vibration:44, breezy_windy_stained_reaction:28 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | home-window >20% watch | 71/336 | 21.1% | daily_condition_tags:109 | AP/BF 4/168, 67/168<br>clarity clear:112, dirty:112, stained:112<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, cold_slow_or_front:60 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | home-window >20% watch | 20/96 | 20.8% | goal_tags:51 | AP/BF 17/48, 3/48<br>clarity clear:76, stained:20<br>bucket cold_slow_or_front:52, calm_bright_clear_subtle:16, stable_pleasant_medium_confidence_archive:12 |
| Sculpzilla<br>sculpzilla | fly | home-window >20% watch | 28/136 | 20.6% | goal_tags:71 | AP/BF 0/68, 28/68<br>clarity clear:48, stained:48, dirty:40<br>bucket cold_slow_or_front:56, dirty_vibration:24, stable_pleasant_medium_confidence_archive:16 |
| Buzzbait<br>buzzbait | lure | home-window >20% watch | 29/144 | 20.1% | goal_tags:63 | AP/BF 7/72, 22/72<br>clarity clear:48, dirty:48, stained:48<br>bucket stable_pleasant_medium_confidence_archive:52, calm_low_light_surface:36, cold_slow_or_front:28 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 77/2448 (3.1%) | 29/1224 (2.4%) | 48/1224 (3.9%) | 77/1224 (6.3%) | 41/84 (48.8%) | 18/84 (21.4%) / 23/84 (27.4%) | home>20%<br>home>25%<br>home>30% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 101/2448 (4.1%) | 68/1224 (5.6%) | 33/1224 (2.7%) | 101/1224 (8.3%) | 79/280 (28.2%) | 54/280 (19.3%) / 25/280 (8.9%) | home>20%<br>home>25% |
| Game Changer<br>game_changer | fly | 161/2448 (6.6%) | 82/1224 (6.7%) | 79/1224 (6.5%) | 161/1224 (13.2%) | 86/336 (25.6%) | 38/336 (11.3%) / 48/336 (14.3%) | home>20%<br>home>25% |
| Deer Hair Slider<br>deer_hair_slider | fly | 36/2448 (1.5%) | 21/1224 (1.7%) | 15/1224 (1.2%) | 36/1224 (2.9%) | 36/144 (25%) | 21/144 (14.6%) / 15/144 (10.4%) | home>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 35/2448 (1.4%) | 27/1224 (2.2%) | 8/1224 (0.7%) | 35/1224 (2.9%) | 35/144 (24.3%) | 27/144 (18.8%) / 8/144 (5.6%) | home>20% |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 114/2448 (4.7%) | 43/1224 (3.5%) | 71/1224 (5.8%) | 114/1224 (9.3%) | 82/360 (22.8%) | 32/360 (8.9%) / 50/360 (13.9%) | home>20% |
| Deceiver<br>deceiver | fly | 81/2448 (3.3%) | 61/1224 (5%) | 20/1224 (1.6%) | 81/1224 (6.6%) | 75/336 (22.3%) | 61/336 (18.2%) / 14/336 (4.2%) | home>20% |
| Walking Topwater<br>walking_topwater | lure | 34/2448 (1.4%) | 25/1224 (2%) | 9/1224 (0.7%) | 34/1224 (2.8%) | 32/144 (22.2%) | 25/144 (17.4%) / 7/144 (4.9%) | home>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 138/2448 (5.6%) | 27/1224 (2.2%) | 111/1224 (9.1%) | 138/1224 (11.3%) | 69/312 (22.1%) | 19/312 (6.1%) / 50/312 (16%) | home>20% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 149/2448 (6.1%) | 75/1224 (6.1%) | 74/1224 (6%) | 149/1224 (12.2%) | 71/336 (21.1%) | 28/336 (8.3%) / 43/336 (12.8%) | home>20% |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 40/2448 (1.6%) | 17/1224 (1.4%) | 23/1224 (1.9%) | 40/1224 (3.3%) | 20/96 (20.8%) | 13/96 (13.5%) / 7/96 (7.3%) | home>20% |
| Sculpzilla<br>sculpzilla | fly | 30/2448 (1.2%) | 19/1224 (1.6%) | 11/1224 (0.9%) | 30/1224 (2.5%) | 28/136 (20.6%) | 18/136 (13.2%) / 10/136 (7.4%) | home>20% |
| Buzzbait<br>buzzbait | lure | 30/2448 (1.2%) | 20/1224 (1.6%) | 10/1224 (0.8%) | 30/1224 (2.5%) | 29/144 (20.1%) | 20/144 (13.9%) / 9/144 (6.3%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 3.00.
Average expanded finalist pool size: 4.09.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 759.
Rows/slots with expanded finalist pool size 1: 373.
Selected-tier singleton slots expanded above 1: 386.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.61 | 3.92 | 1 | 1 | 231 | 92 |
| fly/top | 2.89 | 3.93 | 1 | 1 | 215 | 108 |
| lure/honorable | 3.13 | 4.18 | 1 | 1 | 161 | 83 |
| lure/top | 3.36 | 4.31 | 1 | 1 | 152 | 90 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1187 |
| goal_or_priority_condition | 1187 |
| credible_fallback | 74 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 1813 |
| goal_and_priority_condition | 1187 |
| credible_fallback | 327 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 171 |
| family_diversity_scarcity | 150 |
| surface_safety_scarcity | 52 |

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
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__all_purpose__B lure/honorable: ned_rig (goal_and_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__all_purpose__B fly/honorable: lead_eye_leech (goal_and_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__big_fish__B lure/honorable: tube_jig (goal_or_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__all_purpose__B lure/honorable: ned_rig (goal_and_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__all_purpose__B fly/top: sculpin_streamer (goal_and_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__dirty__all_purpose__B fly/top: sculpin_streamer (goal_and_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__all_purpose__B fly/top: clouser_minnow (goal_or_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__big_fish__B lure/top: tube_jig (credible_fallback; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__all_purpose__B fly/top: clouser_minnow (goal_or_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 5.35 |
| Different-presentation close candidates | 1.86 |
| Different-family close candidates | 2.72 |
| Final expanded Set B pool | 2.51 |
| Same-family/same-presentation reintroduced | 66/1224 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 216 |
| Coverage pool used | 43 |
| Average used coverage pool size | 3.98 |
| Singleton used coverage pools | 1 |
| Broad pool larger than narrowed pool | 38 |
| Broad pool same as narrowed pool | 5 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 6 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 173 |
| broad | 43 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| spinnerbait | 38 |
| bladed_jig | 33 |
| squarebill_crankbait | 23 |
| lipless_crankbait | 20 |
| inline_spinner | 19 |
| medium_diving_crankbait | 18 |
| suspending_jerkbait | 17 |
| buzzbait | 3 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| spinnerbait | 10 |
| bladed_jig | 7 |
| medium_diving_crankbait | 5 |
| big_smallmouth_tube | 4 |
| inline_spinner | 4 |
| magnum_jerkbait | 4 |
| squarebill_crankbait | 3 |
| football_jig | 2 |
| lipless_crankbait | 2 |
| suspending_jerkbait | 2 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

- mn_mille_lacs__2025-09-20__freshwater_lake_pond__dirty__big_fish__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- wv_new_river_smb__2025-09-29__freshwater_river__stained__all_purpose__A: Spinnerbait; pool bladed_jig, buzzbait, spinnerbait, squarebill_crankbait
- ca_trinity__2025-10-25__freshwater_lake_pond__stained__all_purpose__B: Spinnerbait; pool bladed_jig, lipless_crankbait, medium_diving_crankbait, spinnerbait, squarebill_crankbait
- wi_door_county__2025-12-12__freshwater_lake_pond__dirty__big_fish__B: Lipless Crankbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait
- vt_champlain_smb__2025-12-12__freshwater_lake_pond__stained__big_fish__B: Lipless Crankbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait
- vt_champlain_smb__2025-12-12__freshwater_lake_pond__dirty__big_fish__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 1536 | 0 | 0 |
| caution | 336 | 3 | 0 |

Caution-gate selected surface examples:
- co_yampa__2025-07-12__freshwater_river__clear__big_fish__B: honorable_lure:walking_topwater
- co_yampa__2025-07-12__freshwater_river__stained__big_fish__B: honorable_lure:walking_topwater
- co_yampa__2025-07-12__freshwater_river__dirty__big_fish__B: honorable_lure:buzzbait

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
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 149/612 | 71/336 | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 35/168 | 0/0 | goal_tags>1 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 96/480 | 7/24 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 101/612 | 49/336 | goal_tags>1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 19/144 | 16/108 | clear+stained+dirty clarity |
| Deceiver<br>deceiver | fly | 7 | 81/612 | 75/336 | clear+stained+dirty clarity<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 36/228 | 36/144 | clear+stained+dirty clarity<br>home-window share>20% |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 22/612 | 0/0 | clear+stained+dirty clarity |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 35/228 | 35/144 | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Game Changer<br>game_changer | fly | 7 | 161/612 | 86/336 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 28/612 | 0/0 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 23/612 | 0/0 | clear+stained+dirty clarity |
| Popper Fly<br>popper_fly | fly | 8 | 20/228 | 20/144 | goal_tags>1 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 138/612 | 69/312 | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 22/144 | 17/108 | clear+stained+dirty clarity |
| Sculpzilla<br>sculpzilla | fly | 7 | 30/144 | 28/136 | home-window share>20% |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 40/348 | 20/96 | clear+stained+dirty clarity<br>home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 46/612 | 29/216 | clear+stained+dirty clarity |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 8 | 114/540 | 82/360 | home-window share>20% |
| Blade Bait<br>blade_bait | lure | 7 | 23/612 | 10/232 | clear+stained+dirty clarity |
| Buzzbait<br>buzzbait | lure | 9 | 30/228 | 29/144 | goal_tags>1<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity<br>home-window share>20% |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 27/468 | 18/152 | goal_tags>1 |
| Compact Glide Bait<br>compact_glidebait | lure | 8 | 68/300 | 0/0 | goal_tags>1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 18/468 | 5/216 | clear+stained+dirty clarity |
| Football Jig<br>football_jig | lure | 7 | 78/468 | 22/124 | clear+stained+dirty clarity |
| Glide Bait<br>glidebait | lure | 9 | 2/36 | 0/0 | goal_tags>1 |
| Inline Spinner<br>inline_spinner | lure | 8 | 101/612 | 9/56 | goal_tags>1 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7 | 77/360 | 41/84 | home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 101/612 | 79/280 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Ned Rig<br>ned_rig | lure | 9 | 28/612 | 18/216 | clear+stained+dirty clarity |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 32/612 | 4/336 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 1/132 | 0/48 | clear+stained+dirty clarity |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 48/480 | 13/76 | goal_tags>1 |
| Spinnerbait<br>spinnerbait | lure | 7 | 30/612 | 30/280 | wind+dirty+stained/dirty clarity |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 33/480 | 32/216 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 100/612 | 27/216 | goal_tags>1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 27/612 | 18/232 | condition_tags>3<br>clear+stained+dirty clarity |
| Wake Bait<br>wake_bait | lure | 9 | 18/168 | 18/96 | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Walking Topwater<br>walking_topwater | lure | 8 | 34/228 | 32/144 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 20/156 | 5/24 | clear+stained+dirty clarity<br>goal_tags>1 |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 7 | 161/612 (26.3%) | 86/336 (25.6%) | big_fish:139, all_purpose:22 | top:82, honorable:79 | wind_reaction:68, dirty_vibration:50, warming_search:44, cold_slow:33, calm_surface:31 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 149/612 (24.3%) | 71/336 (21.1%) | big_fish:131, all_purpose:18 | top:75, honorable:74 | wind_reaction:61, dirty_vibration:49, warming_search:39, cold_slow:33, calm_surface:29 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 138/612 (22.5%) | 69/312 (22.1%) | big_fish:123, all_purpose:15 | honorable:111, top:27 | wind_reaction:63, cold_slow:52, dirty_vibration:48, warming_search:37, open_water_search:14 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 8 | 114/540 (21.1%) | 82/360 (22.8%) | big_fish:114 | honorable:71, top:43 | wind_reaction:40, dirty_vibration:32, cold_slow:30, warming_search:30, calm_surface:23 |
| Inline Spinner<br>inline_spinner | lure | 8 | 101/612 (16.5%) | 9/56 (16.1%) | all_purpose:89, big_fish:12 | top:54, honorable:47 | wind_reaction:67, dirty_vibration:50, warming_search:24, open_water_search:20, cold_slow:18 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8 | 101/612 (16.5%) | 79/280 (28.2%) | big_fish:55, all_purpose:46 | top:68, honorable:33 | wind_reaction:87, dirty_vibration:70, open_water_search:27, warming_search:23, cold_slow:21 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 101/612 (16.5%) | 49/336 (14.6%) | all_purpose:101 | honorable:60, top:41 | warming_search:37, wind_reaction:34, dirty_vibration:27, calm_surface:21, clear_subtle:15 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 100/612 (16.3%) | 27/216 (12.5%) | all_purpose:90, big_fish:10 | top:51, honorable:49 | wind_reaction:74, dirty_vibration:52, cold_slow:28, warming_search:17, open_water_search:16 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 96/480 (20%) | 7/24 (29.2%) | all_purpose:62, big_fish:34 | honorable:59, top:37 | wind_reaction:66, dirty_vibration:50, warming_search:23, open_water_search:14, cold_slow:12 |
| Deceiver<br>deceiver | fly | 7 | 81/612 (13.2%) | 75/336 (22.3%) | all_purpose:56, big_fish:25 | top:61, honorable:20 | wind_reaction:75, dirty_vibration:62, open_water_search:25, cold_slow:22, warming_search:6 |
| Football Jig<br>football_jig | lure | 7 | 78/468 (16.7%) | 22/124 (17.7%) | big_fish:78 | honorable:56, top:22 | wind_reaction:42, warming_search:27, dirty_vibration:25, cold_slow:21, open_water_search:10 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7 | 77/360 (21.4%) | 41/84 (48.8%) | big_fish:77 | honorable:48, top:29 | wind_reaction:28, cold_slow:26, warming_search:26, dirty_vibration:20, clear_subtle:10 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 76/612 (12.4%) | 0/0 | all_purpose:59, big_fish:17 | top:66, honorable:10 | wind_reaction:68, dirty_vibration:50, open_water_search:20, warming_search:14, cold_slow:11 |
| Tube Jig<br>tube_jig | lure | 7 | 72/612 (11.8%) | 64/408 (15.7%) | all_purpose:56, big_fish:16 | top:50, honorable:22 | cold_slow:46, wind_reaction:23, clear_subtle:22, warming_search:11, calm_surface:9 |
| Compact Glide Bait<br>compact_glidebait | lure | 8 | 68/300 (22.7%) | 0/0 | big_fish:68 | honorable:41, top:27 | wind_reaction:29, dirty_vibration:19, calm_surface:18, clear_subtle:13, warming_search:12 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 48/480 (10%) | 13/76 (17.1%) | all_purpose:47, big_fish:1 | honorable:25, top:23 | calm_surface:20, clear_subtle:15, warming_search:15, low_light_surface:9, wind_reaction:6 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 46/612 (7.5%) | 29/216 (13.4%) | all_purpose:39, big_fish:7 | honorable:34, top:12 | cold_slow:28, warming_search:17, wind_reaction:10, dirty_vibration:8, clear_subtle:6 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 40/348 (11.5%) | 20/96 (20.8%) | all_purpose:35, big_fish:5 | honorable:23, top:17 | wind_reaction:14, cold_slow:12, clear_subtle:11, warming_search:10, calm_surface:5 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 36/228 (15.8%) | 36/144 (25%) | big_fish:36 | top:21, honorable:15 | calm_surface:27, low_light_surface:18, current_swing:9, dirty_vibration:8, clear_subtle:6 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 35/228 (15.4%) | 35/144 (24.3%) | all_purpose:32, big_fish:3 | top:27, honorable:8 | calm_surface:28, low_light_surface:16, clear_subtle:7, current_swing:7, dirty_vibration:6 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 35/168 (20.8%) | 0/0 | big_fish:35 | honorable:18, top:17 | cold_slow:24, wind_reaction:17, dirty_vibration:15, warming_search:9, current_swing:6 |
| Walking Topwater<br>walking_topwater | lure | 8 | 34/228 (14.9%) | 32/144 (22.2%) | big_fish:34 | top:25, honorable:9 | calm_surface:24, low_light_surface:15, current_swing:9, warming_search:8, clear_subtle:7 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 33/480 (6.9%) | 32/216 (14.8%) | all_purpose:26, big_fish:7 | honorable:17, top:16 | dirty_vibration:31, wind_reaction:19, current_swing:12, cold_slow:7, calm_surface:6 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 32/612 (5.2%) | 4/336 (1.2%) | all_purpose:19, big_fish:13 | honorable:22, top:10 | warming_search:27, calm_surface:7, low_light_surface:6, current_swing:1 |
| Buzzbait<br>buzzbait | lure | 9 | 30/228 (13.2%) | 29/144 (20.1%) | big_fish:23, all_purpose:7 | top:20, honorable:10 | low_light_surface:21, calm_surface:18, current_swing:14, dirty_vibration:14, warming_search:8 |
| Sculpzilla<br>sculpzilla | fly | 7 | 30/144 (20.8%) | 28/136 (20.6%) | big_fish:30 | top:19, honorable:11 | current_swing:15, cold_slow:12, dirty_vibration:12, calm_surface:9, warming_search:9 |
| Spinnerbait<br>spinnerbait | lure | 7 | 30/612 (4.9%) | 30/280 (10.7%) | all_purpose:17, big_fish:13 | honorable:17, top:13 | dirty_vibration:30, wind_reaction:19, current_swing:11, warming_search:10, calm_surface:5 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 29/612 (4.7%) | 11/76 (14.5%) | all_purpose:26, big_fish:3 | honorable:18, top:11 | warming_search:16, clear_subtle:12, calm_surface:8, current_swing:2, heat_finesse:2 |
| Ned Rig<br>ned_rig | lure | 9 | 28/612 (4.6%) | 18/216 (8.3%) | all_purpose:23, big_fish:5 | honorable:20, top:8 | cold_slow:22, clear_subtle:8, wind_reaction:6, warming_search:3, calm_surface:1 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 28/612 (4.6%) | 0/0 | all_purpose:28 | honorable:15, top:13 | cold_slow:22, wind_reaction:11, dirty_vibration:5, open_water_search:5, clear_subtle:3 |
| Bladed Jig<br>bladed_jig | lure | 5 | 28/612 (4.6%) | 28/216 (13%) | big_fish:15, all_purpose:13 | top:17, honorable:11 | dirty_vibration:28, current_swing:14, wind_reaction:14, warming_search:10, cold_slow:7 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 27/612 (4.4%) | 18/232 (7.8%) | all_purpose:21, big_fish:6 | honorable:16, top:11 | cold_slow:21, clear_subtle:8, wind_reaction:4, warming_search:3, heat_finesse:2 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 27/468 (5.8%) | 18/152 (11.8%) | all_purpose:24, big_fish:3 | honorable:16, top:11 | cold_slow:15, wind_reaction:10, warming_search:8, clear_subtle:7, open_water_search:6 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 26/480 (5.4%) | 4/24 (16.7%) | all_purpose:18, big_fish:8 | honorable:13, top:13 | clear_subtle:15, wind_reaction:10, warming_search:6, calm_surface:5, open_water_search:4 |
| Lipless Crankbait<br>lipless_crankbait | lure | 5 | 24/612 (3.9%) | 24/280 (8.6%) | big_fish:13, all_purpose:11 | top:18, honorable:6 | dirty_vibration:24, wind_reaction:24, open_water_search:17, cold_slow:2, warming_search:1 |
| Blade Bait<br>blade_bait | lure | 7 | 23/612 (3.8%) | 10/232 (4.3%) | all_purpose:14, big_fish:9 | top:16, honorable:7 | cold_slow:18, wind_reaction:13, open_water_search:11, dirty_vibration:7, warming_search:3 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 23/612 (3.8%) | 0/0 | all_purpose:21, big_fish:2 | top:13, honorable:10 | clear_subtle:11, cold_slow:11, warming_search:7, wind_reaction:6, dirty_vibration:3 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 22/144 (15.3%) | 17/108 (15.7%) | all_purpose:22 | top:16, honorable:6 | cold_slow:16, dirty_vibration:9, current_swing:7, wind_reaction:5, calm_surface:4 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 22/612 (3.6%) | 0/0 | all_purpose:13, big_fish:9 | honorable:14, top:8 | warming_search:22, current_swing:3, dirty_vibration:2, calm_surface:1, low_light_surface:1 |
| Finesse Jig<br>finesse_jig | lure | 8 | 21/612 (3.4%) | 13/232 (5.6%) | all_purpose:20, big_fish:1 | top:12, honorable:9 | cold_slow:14, clear_subtle:5, wind_reaction:5, heat_finesse:3, warming_search:3 |
| Popper Fly<br>popper_fly | fly | 8 | 20/228 (8.8%) | 20/144 (13.9%) | all_purpose:20 | top:17, honorable:3 | calm_surface:16, low_light_surface:9, clear_subtle:2, current_swing:2, dirty_vibration:2 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 20/156 (12.8%) | 5/24 (20.8%) | all_purpose:19, big_fish:1 | top:14, honorable:6 | calm_surface:7, clear_subtle:5, heat_finesse:4, low_light_surface:4, current_swing:3 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 20/144 (13.9%) | 16/108 (14.8%) | all_purpose:19, big_fish:1 | top:14, honorable:6 | cold_slow:14, current_swing:7, clear_subtle:5, dirty_vibration:3, low_light_surface:3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 19/144 (13.2%) | 16/108 (14.8%) | all_purpose:16, big_fish:3 | honorable:12, top:7 | clear_subtle:9, cold_slow:9, current_swing:7, warming_search:6, dirty_vibration:5 |
| Wake Bait<br>wake_bait | lure | 9 | 18/168 (10.7%) | 18/96 (18.8%) | big_fish:18 | top:14, honorable:4 | calm_surface:14, low_light_surface:8, clear_subtle:4, cold_slow:1, dirty_vibration:1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 18/468 (3.8%) | 5/216 (2.3%) | all_purpose:14, big_fish:4 | honorable:10, top:8 | cold_slow:8, wind_reaction:5, calm_surface:4, open_water_search:3, warming_search:3 |
| Swim Jig<br>swim_jig | lure | 7 | 17/612 (2.8%) | 10/312 (3.2%) | all_purpose:17 | honorable:13, top:4 | warming_search:12, calm_surface:6, low_light_surface:2, current_swing:1, dirty_vibration:1 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 6 | 16/480 (3.3%) | 0/216 (0%) | all_purpose:8, big_fish:8 | top:13, honorable:3 | cold_slow:7, clear_subtle:4, calm_surface:2, none:2, warming_search:2 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 5 | 13/120 (10.8%) | 0/0 | all_purpose:11, big_fish:2 | honorable:8, top:5 | current_swing:8, clear_subtle:6, calm_surface:5, dirty_vibration:4, cold_slow:3 |
| Hair Jig<br>hair_jig | lure | 8 | 7/144 (4.9%) | 7/108 (6.5%) | all_purpose:4, big_fish:3 | honorable:5, top:2 | current_swing:6, cold_slow:4, clear_subtle:2, calm_surface:1, dirty_vibration:1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 4/144 (2.8%) | 4/84 (4.8%) | all_purpose:3, big_fish:1 | top:3, honorable:1 | dirty_vibration:4, cold_slow:2, current_swing:2, warming_search:2, wind_reaction:2 |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 3/144 (2.1%) | 3/84 (3.6%) | all_purpose:2, big_fish:1 | honorable:2, top:1 | cold_slow:2, dirty_vibration:2, wind_reaction:2, calm_surface:1, current_swing:1 |
| Glide Bait<br>glidebait | lure | 9 | 2/36 (5.6%) | 0/0 | big_fish:2 | honorable:1, top:1 | wind_reaction:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 1/132 (0.8%) | 0/48 (0%) | all_purpose:1 | top:1 | warming_search:1 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 161/612 (26.3%) | 86/336 (25.6%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 149/612 (24.3%) | 71/336 (21.1%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 138/612 (22.5%) | 69/312 (22.1%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 114/540 (21.1%) | 82/360 (22.8%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | home-window share>20% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 101/612 (16.5%) | 79/280 (28.2%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Deceiver<br>deceiver | fly | 81/612 (13.2%) | 75/336 (22.3%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 77/360 (21.4%) | 41/84 (48.8%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Compact Glide Bait<br>compact_glidebait | lure | 68/300 (22.7%) | 0/0 | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 40/348 (11.5%) | 20/96 (20.8%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 36/228 (15.8%) | 36/144 (25%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 35/228 (15.4%) | 35/144 (24.3%) | catalog_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Walking Topwater<br>walking_topwater | lure | 34/228 (14.9%) | 32/144 (22.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Buzzbait<br>buzzbait | lure | 30/228 (13.2%) | 29/144 (20.1%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity<br>home-window share>20% |
| Sculpzilla<br>sculpzilla | fly | 30/144 (20.8%) | 28/136 (20.6%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 216 | 18/216 (8.3%) | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):8, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):8, Tube Jig (top), Drop-Shot Minnow (honorable):7, Tube Jig (top), Soft Plastic Jerkbait (honorable):6 | selector/direct-score or overpowered competitors |
| Tube Jig<br>tube_jig | lure | forage 2: crawfish, baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, cold_slow<br>goal 1: reliable_action | 408 | 64/408 (15.7%) | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):13, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):13, Suspending Jerkbait (top), Inline Spinner (honorable):13, Inline Spinner (top), Suspending Jerkbait (honorable):12 | healthy / not underused |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | forage 2: crawfish, baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: big_fish_upside | 360 | 82/360 (22.8%) | Inline Spinner (top), Suspending Jerkbait (honorable):12, Suspending Jerkbait (top), Inline Spinner (honorable):12, Tube Jig (top), Drop-Shot Minnow (honorable):7, Compact Glide Bait (top), Magnum Jerkbait (honorable):6 | healthy / not underused |
| Finesse Jig<br>finesse_jig | lure | forage 2: crawfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 232 | 13/232 (5.6%) | Magnum Jerkbait (top), Big Smallmouth Tube (honorable):10, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):8, Buzzbait (top), Big Smallmouth Tube (honorable):8, Tube Jig (top), Drop-Shot Minnow (honorable):7 | selector/direct-score or overpowered competitors |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 4: cover_ambush, cold_slow, clear_subtle, heat_finesse<br>goal 1: reliable_action | 232 | 18/232 (7.8%) | Magnum Jerkbait (top), Big Smallmouth Tube (honorable):10, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):8, Buzzbait (top), Big Smallmouth Tube (honorable):8, Tube Jig (top), Drop-Shot Minnow (honorable):7 | selector/direct-score or overpowered competitors |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, heat_finesse<br>goal 1: reliable_action | 76 | 11/76 (14.5%) | Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):4, Big Smallmouth Tube (top), Compact Glide Bait (honorable):3, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):3, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):3 | healthy / not underused |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 216 | 27/216 (12.5%) | Magnum Jerkbait (top), Big Smallmouth Tube (honorable):12, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):10, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):7, Big Smallmouth Tube (top), Football Jig (honorable):6 | healthy / not underused |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 108 | 7/108 (6.5%) | Buzzbait (top), Big Smallmouth Tube (honorable):7, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):7, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):5, Tube Jig (top), Soft Plastic Jerkbait (honorable):5 | selector/direct-score or overpowered competitors |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 56 | 9/56 (16.1%) | Buzzbait (top), Big Smallmouth Tube (honorable):4, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):4, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):3, Tube Jig (top), Hair Jig (honorable):3 | healthy / not underused |
| Bladed Jig<br>bladed_jig | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: dirty_vibration, cover_ambush<br>goal 0: none | 216 | 28/216 (13%) | Inline Spinner (top), Suspending Jerkbait (honorable):15, Medium-Diving Crankbait (top), Football Jig (honorable):15, Buzzbait (top), Big Smallmouth Tube (honorable):8, Suspending Jerkbait (top), Inline Spinner (honorable):8 | healthy / not underused |
| Lipless Crankbait<br>lipless_crankbait | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 0: none | 280 | 24/280 (8.6%) | Inline Spinner (top), Suspending Jerkbait (honorable):16, Medium-Diving Crankbait (top), Football Jig (honorable):15, Suspending Jerkbait (top), Inline Spinner (honorable):10, Buzzbait (top), Big Smallmouth Tube (honorable):8 | selector/direct-score or overpowered competitors |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish Streamer (articulated_baitfish_streamer), Buzzbait (buzzbait), Compact Glide Bait (compact_glidebait), Foam Gurgler (foam_gurgler_fly), Game Changer (game_changer), Rabbit-Strip Leech (rabbit_strip_leech), Walking Topwater (walking_topwater)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish Streamer (articulated_baitfish_streamer), Big Smallmouth Tube (big_smallmouth_tube), Buzzbait (buzzbait), Compact Glide Bait (compact_glidebait), Deceiver (deceiver), Deer Hair Slider (deer_hair_slider), Foam Gurgler (foam_gurgler_fly), Game Changer (game_changer), Magnum Jerkbait (magnum_jerkbait), Medium-Diving Crankbait (medium_diving_crankbait), Rabbit-Strip Leech (rabbit_strip_leech), Sculpzilla (sculpzilla), Walking Topwater (walking_topwater), Warmwater Crawfish Fly (warmwater_crawfish_fly)

### Probably selector problem, not catalog problem
Finesse Jig (finesse_jig), Hair Jig (hair_jig), Lipless Crankbait (lipless_crankbait), Ned Rig (ned_rig), Texas-Rigged Soft-Plastic Craw (texas_rigged_soft_plastic_craw)

## Utilization Notes / Coverage Gaps

- 2 low-use profile(s) were often close to selected winners, which leans toward selector/catalog balance rather than pure scenario coverage.
- 1 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Articulated Baitfish Streamer, Clouser Minnow, Rabbit-Strip Leech, Woolly Bugger, Deer Hair Slider, Sculpzilla, Crawfish Streamer, Muddler Minnow, Sculpin Streamer, Warmwater Crawfish Fly, Tube Jig, Big Smallmouth Tube, Lipless Crankbait, Spinnerbait, Bladed Jig, Ned Rig, Suspending Jerkbait, Buzzbait, Walking Topwater, Football Jig, Drop-Shot Minnow, Soft Plastic Jerkbait, Inline Spinner |
| underused_home_window | Bucktail Streamer, Conehead Streamer, Paddle-Tail Swimbait, Blade Bait, Finesse Jig, Texas-Rigged Soft-Plastic Craw, Flat-Sided Crankbait, Hair Jig |
| no_home_window_coverage | None |
| over-dominant | Game Changer, Medium-Diving Crankbait, Magnum Jerkbait |
| probably okay niche profile | None |

## SMB Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 12.2% | 149/612 | 71/336 | 149 | 71 | 21.1% | 4/168 | 67/168 | 95 | healthy | activity neutral:252, active:72, suppressed:12<br>clarity clear:112, dirty:112, stained:112<br>water freshwater_lake_pond:252, freshwater_river:84<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, cold_slow_or_front:60 | Deceiver (top), Baitfish Slider Fly (honorable):17, Game Changer (top), Rabbit-Strip Leech (honorable):14, Clouser Minnow (honorable), Zonker Streamer (top):12 |
| Clouser Minnow<br>clouser_minnow | fly | 8.3% | 101/612 | 49/336 | 101 | 49 | 14.6% | 49/168 | 0/168 | 119 | healthy | activity neutral:252, active:72, suppressed:12<br>clarity clear:112, dirty:112, stained:112<br>water freshwater_lake_pond:252, freshwater_river:84<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, cold_slow_or_front:60 | Deceiver (top), Baitfish Slider Fly (honorable):17, Game Changer (top), Rabbit-Strip Leech (honorable):14, Zonker Streamer (top), Game Changer (honorable):10 |
| Game Changer<br>game_changer | fly | 13.2% | 161/612 | 86/336 | 161 | 86 | 25.6% | 13/168 | 73/168 | 83 | over-dominant | activity neutral:252, active:72, suppressed:12<br>clarity clear:112, dirty:112, stained:112<br>water freshwater_lake_pond:252, freshwater_river:84<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, cold_slow_or_front:60 | Deceiver (top), Baitfish Slider Fly (honorable):17, Clouser Minnow (honorable), Zonker Streamer (top):12, Articulated Baitfish Streamer (honorable), Deceiver (top):9 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 11.3% | 138/612 | 69/312 | 138 | 69 | 22.1% | 11/156 | 58/156 | 80 | healthy | activity neutral:236, suppressed:48, active:28<br>clarity clear:144, stained:96, dirty:72<br>water freshwater_lake_pond:176, freshwater_river:136<br>bucket cold_slow_or_front:148, dirty_vibration:44, breezy_windy_stained_reaction:28 | Articulated Baitfish Streamer (top), Game Changer (honorable):8, Game Changer (top), Articulated Baitfish Streamer (honorable):7, Game Changer (honorable), Articulated Baitfish Streamer (top):5 |
| Woolly Bugger<br>woolly_bugger | fly | 3.8% | 46/612 | 29/216 | 46 | 29 | 13.4% | 24/108 | 5/108 | 63 | healthy | activity neutral:156, suppressed:48, active:12<br>clarity clear:72, dirty:72, stained:72<br>water freshwater_river:120, freshwater_lake_pond:96<br>bucket cold_slow_or_front:108, dirty_vibration:44, breezy_windy_stained_reaction:28 | Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):8, Articulated Baitfish Streamer (top), Game Changer (honorable):7, Game Changer (top), Rabbit-Strip Leech (honorable):7 |
| Deer Hair Slider<br>deer_hair_slider | fly | 2.9% | 36/228 | 36/144 | 36 | 36 | 25% | 0/72 | 36/72 | 38 | healthy | activity neutral:108, active:36<br>clarity clear:48, dirty:48, stained:48<br>water freshwater_lake_pond:96, freshwater_river:48<br>bucket stable_pleasant_medium_confidence_archive:52, calm_low_light_surface:36, cold_slow_or_front:28 | Articulated Baitfish Streamer (top), Game Changer (honorable):7, Foam Gurgler (top), Baitfish Slider Fly (honorable):6, Clouser Minnow (honorable), Popper Fly (top):5 |
| Sculpzilla<br>sculpzilla | fly | 2.5% | 30/144 | 28/136 | 30 | 28 | 20.6% | 0/68 | 28/68 | 43 | healthy | activity neutral:104, active:20, suppressed:12<br>clarity clear:48, stained:48, dirty:40<br>water freshwater_river:136<br>bucket cold_slow_or_front:56, dirty_vibration:24, stable_pleasant_medium_confidence_archive:16 | Articulated Baitfish Streamer (top), Game Changer (honorable):5, Muddler Minnow (top), Crawfish Streamer (honorable):5, Sculpin Streamer (top), Jighead Marabou Leech (honorable):4 |
| Crawfish Streamer<br>crawfish_streamer | fly | 1.6% | 19/144 | 16/108 | 19 | 16 | 14.8% | 13/54 | 3/54 | 22 | healthy | activity neutral:76, active:20, suppressed:12<br>clarity clear:48, stained:40, dirty:20<br>water freshwater_river:108<br>bucket cold_slow_or_front:44, dirty_vibration:16, stable_pleasant_medium_confidence_archive:16 | Articulated Baitfish Streamer (top), Game Changer (honorable):3, Deer Hair Slider (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3 |
| Muddler Minnow<br>muddler_sculpin | fly | 1.6% | 20/144 | 16/108 | 20 | 16 | 14.8% | 15/54 | 1/54 | 54 | healthy | activity neutral:76, active:20, suppressed:12<br>clarity clear:48, stained:40, dirty:20<br>water freshwater_river:108<br>bucket cold_slow_or_front:44, dirty_vibration:16, stable_pleasant_medium_confidence_archive:16 | Articulated Baitfish Streamer (top), Game Changer (honorable):3, Deer Hair Slider (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3 |
| Sculpin Streamer<br>sculpin_streamer | fly | 1.8% | 22/144 | 17/108 | 22 | 17 | 15.7% | 17/54 | 0/54 | 60 | healthy | activity neutral:76, active:20, suppressed:12<br>clarity clear:48, stained:40, dirty:20<br>water freshwater_river:108<br>bucket cold_slow_or_front:44, dirty_vibration:16, stable_pleasant_medium_confidence_archive:16 | Muddler Minnow (top), Crawfish Streamer (honorable):5, Articulated Baitfish Streamer (top), Game Changer (honorable):3, Deer Hair Slider (top), Game Changer (honorable):3 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 3.3% | 40/348 | 20/96 | 40 | 20 | 20.8% | 17/48 | 3/48 | 23 | healthy | activity neutral:80, active:8, suppressed:8<br>clarity clear:76, stained:20<br>water freshwater_lake_pond:96<br>bucket cold_slow_or_front:52, calm_bright_clear_subtle:16, stable_pleasant_medium_confidence_archive:12 | Game Changer (top), Rabbit-Strip Leech (honorable):8, Game Changer (honorable), Articulated Baitfish Streamer (top):5, Game Changer (top), Articulated Baitfish Streamer (honorable):4 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0.3% | 4/144 | 4/84 | 4 | 4 | 4.8% | 3/42 | 1/42 | 26 | underused_home_window | activity neutral:60, active:12, suppressed:12<br>clarity clear:28, dirty:28, stained:28<br>water freshwater_river:84<br>bucket dirty_vibration:24, cold_slow_or_front:16, stable_pleasant_medium_confidence_archive:16 | Articulated Baitfish Streamer (top), Game Changer (honorable):4, Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Deer Hair Slider (top), Game Changer (honorable):3 |
| Conehead Streamer<br>conehead_streamer | fly | 0.2% | 3/144 | 3/84 | 3 | 3 | 3.6% | 2/42 | 1/42 | 27 | underused_home_window | activity neutral:60, active:12, suppressed:12<br>clarity clear:28, dirty:28, stained:28<br>water freshwater_river:84<br>bucket dirty_vibration:24, cold_slow_or_front:16, stable_pleasant_medium_confidence_archive:16 | Articulated Baitfish Streamer (top), Game Changer (honorable):4, Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Deer Hair Slider (top), Game Changer (honorable):3 |
| Tube Jig<br>tube_jig | lure | 5.9% | 72/612 | 64/408 | 72 | 64 | 15.7% | 50/204 | 14/204 | 107 | healthy | activity neutral:272, active:104, suppressed:32<br>clarity clear:204, stained:204<br>water freshwater_lake_pond:312, freshwater_river:96<br>bucket cold_slow_or_front:124, breezy_windy_stained_reaction:88, warming_search:76 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):12, Inline Spinner (honorable), Suspending Jerkbait (top):10, Inline Spinner (top), Suspending Jerkbait (honorable):10 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 9.3% | 114/540 | 82/360 | 114 | 82 | 22.8% | 0/180 | 82/180 | 84 | healthy | activity neutral:240, active:96, suppressed:24<br>clarity clear:180, stained:180<br>water freshwater_lake_pond:272, freshwater_river:88<br>bucket cold_slow_or_front:100, breezy_windy_stained_reaction:72, warming_search:68 | Inline Spinner (top), Suspending Jerkbait (honorable):10, Inline Spinner (honorable), Suspending Jerkbait (top):9, Tube Jig (top), Drop-Shot Minnow (honorable):7 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 2.6% | 32/612 | 4/336 | 32 | 4 | 1.2% | 4/168 | 0/168 | 32 | underused_home_window | activity neutral:252, active:72, suppressed:12<br>clarity clear:112, dirty:112, stained:112<br>water freshwater_lake_pond:252, freshwater_river:84<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, cold_slow_or_front:60 | Inline Spinner (top), Suspending Jerkbait (honorable):19, Medium-Diving Crankbait (top), Football Jig (honorable):13, Inline Spinner (honorable), Suspending Jerkbait (top):10 |
| Lipless Crankbait<br>lipless_crankbait | lure | 2% | 24/612 | 24/280 | 24 | 24 | 8.6% | 11/140 | 13/140 | 64 | healthy | activity neutral:168, active:104, suppressed:8<br>clarity dirty:140, stained:140<br>water freshwater_lake_pond:216, freshwater_river:64<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, warming_search:52 | Inline Spinner (top), Suspending Jerkbait (honorable):13, Medium-Diving Crankbait (top), Football Jig (honorable):10, Buzzbait (top), Big Smallmouth Tube (honorable):7 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 8.3% | 101/612 | 79/280 | 101 | 79 | 28.2% | 38/140 | 41/140 | 115 | over-dominant | activity neutral:168, active:104, suppressed:8<br>clarity dirty:140, stained:140<br>water freshwater_lake_pond:216, freshwater_river:64<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, warming_search:52 | Inline Spinner (top), Suspending Jerkbait (honorable):13, Buzzbait (top), Big Smallmouth Tube (honorable):7, Inline Spinner (honorable), Suspending Jerkbait (top):7 |
| Spinnerbait<br>spinnerbait | lure | 2.5% | 30/612 | 30/280 | 30 | 30 | 10.7% | 17/140 | 13/140 | 53 | healthy | activity neutral:168, active:104, suppressed:8<br>clarity dirty:140, stained:140<br>water freshwater_lake_pond:216, freshwater_river:64<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, warming_search:52 | Inline Spinner (top), Suspending Jerkbait (honorable):13, Medium-Diving Crankbait (top), Football Jig (honorable):10, Buzzbait (top), Big Smallmouth Tube (honorable):7 |
| Blade Bait<br>blade_bait | lure | 1.9% | 23/612 | 10/232 | 23 | 10 | 4.3% | 6/116 | 4/116 | 48 | underused_home_window | activity neutral:168, active:32, suppressed:32<br>clarity clear:116, stained:116<br>water freshwater_lake_pond:184, freshwater_river:48<br>bucket cold_slow_or_front:108, breezy_windy_stained_reaction:88, stable_pleasant_medium_confidence_archive:24 | Inline Spinner (top), Suspending Jerkbait (honorable):9, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):8, Inline Spinner (honorable), Suspending Jerkbait (top):8 |
| Finesse Jig<br>finesse_jig | lure | 1.7% | 21/612 | 13/232 | 21 | 13 | 5.6% | 12/116 | 1/116 | 51 | underused_home_window | activity neutral:168, suppressed:36, active:28<br>clarity clear:144, stained:68, dirty:20<br>water freshwater_lake_pond:124, freshwater_river:108<br>bucket cold_slow_or_front:124, stable_pleasant_medium_confidence_archive:28, calm_bright_clear_subtle:20 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7, Tube Jig (top), Drop-Shot Minnow (honorable):7, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):6 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 2.2% | 27/612 | 18/232 | 27 | 18 | 7.8% | 13/116 | 5/116 | 46 | underused_home_window | activity neutral:168, suppressed:36, active:28<br>clarity clear:144, stained:68, dirty:20<br>water freshwater_lake_pond:124, freshwater_river:108<br>bucket cold_slow_or_front:124, stable_pleasant_medium_confidence_archive:28, calm_bright_clear_subtle:20 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7, Tube Jig (top), Drop-Shot Minnow (honorable):7, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):6 |
| Bladed Jig<br>bladed_jig | lure | 2.3% | 28/612 | 28/216 | 28 | 28 | 13% | 13/108 | 15/108 | 51 | healthy | activity neutral:168, active:40, suppressed:8<br>clarity dirty:108, stained:108<br>water freshwater_lake_pond:160, freshwater_river:56<br>bucket dirty_vibration:104, breezy_windy_stained_reaction:88, calm_low_light_surface:8 | Inline Spinner (top), Suspending Jerkbait (honorable):12, Medium-Diving Crankbait (top), Football Jig (honorable):10, Buzzbait (top), Big Smallmouth Tube (honorable):7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 1.3% | 16/480 | 0/216 | 16 | 0 | 0% | 0/108 | 0/108 | 20 | underused_home_window | activity neutral:128, active:80, suppressed:8<br>clarity dirty:108, stained:108<br>water freshwater_lake_pond:160, freshwater_river:56<br>bucket dirty_vibration:80, breezy_windy_stained_reaction:64, warming_search:36 | Inline Spinner (top), Suspending Jerkbait (honorable):10, Medium-Diving Crankbait (top), Football Jig (honorable):8, Buzzbait (top), Big Smallmouth Tube (honorable):7 |
| Ned Rig<br>ned_rig | lure | 2.3% | 28/612 | 18/216 | 28 | 18 | 8.3% | 16/108 | 2/108 | 55 | healthy | activity neutral:184, suppressed:32<br>clarity clear:120, stained:96<br>water freshwater_lake_pond:152, freshwater_river:64<br>bucket cold_slow_or_front:116, breezy_windy_stained_reaction:44, calm_bright_clear_subtle:20 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):8, Tube Jig (top), Drop-Shot Minnow (honorable):7, Tube Jig (top), Soft Plastic Jerkbait (honorable):6 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8.2% | 100/612 | 27/216 | 100 | 27 | 12.5% | 22/108 | 5/108 | 78 | healthy | activity neutral:128, active:56, suppressed:32<br>clarity clear:116, stained:100<br>water freshwater_lake_pond:148, freshwater_river:68<br>bucket cold_slow_or_front:88, warming_search:68, breezy_windy_stained_reaction:36 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):10, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):7, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):7 |
| Buzzbait<br>buzzbait | lure | 2.5% | 30/228 | 29/144 | 30 | 29 | 20.1% | 7/72 | 22/72 | 35 | healthy | activity neutral:108, active:36<br>clarity clear:48, dirty:48, stained:48<br>water freshwater_lake_pond:96, freshwater_river:48<br>bucket stable_pleasant_medium_confidence_archive:52, calm_low_light_surface:36, cold_slow_or_front:28 | Walking Topwater (top), Big Smallmouth Tube (honorable):6, Wake Bait (top), Big Smallmouth Tube (honorable):5, Walking Topwater (top), Compact Glide Bait (honorable):5 |
| Walking Topwater<br>walking_topwater | lure | 2.8% | 34/228 | 32/144 | 34 | 32 | 22.2% | 0/72 | 32/72 | 40 | healthy | activity neutral:108, active:36<br>clarity clear:48, dirty:48, stained:48<br>water freshwater_lake_pond:96, freshwater_river:48<br>bucket stable_pleasant_medium_confidence_archive:52, calm_low_light_surface:36, cold_slow_or_front:28 | Buzzbait (top), Big Smallmouth Tube (honorable):10, Wake Bait (top), Big Smallmouth Tube (honorable):5, Wake Bait (top), Compact Glide Bait (honorable):4 |
| Football Jig<br>football_jig | lure | 6.4% | 78/468 | 22/124 | 78 | 22 | 17.7% | 0/62 | 22/62 | 9 | healthy | activity neutral:92, suppressed:24, active:8<br>clarity clear:96, stained:28<br>water freshwater_lake_pond:124<br>bucket cold_slow_or_front:80, calm_bright_clear_subtle:16, stable_pleasant_medium_confidence_archive:12 | Tube Jig (top), Drop-Shot Minnow (honorable):6, Inline Spinner (top), Suspending Jerkbait (honorable):4, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):4 |
| Hair Jig<br>hair_jig | lure | 0.6% | 7/144 | 7/108 | 7 | 7 | 6.5% | 4/54 | 3/54 | 33 | underused_home_window | activity neutral:76, active:20, suppressed:12<br>clarity clear:48, stained:40, dirty:20<br>water freshwater_river:108<br>bucket cold_slow_or_front:44, dirty_vibration:16, stable_pleasant_medium_confidence_archive:16 | Big Smallmouth Tube (honorable), Magnum Jerkbait (top):5, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):5, Buzzbait (top), Big Smallmouth Tube (honorable):5 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 6.3% | 77/360 | 41/84 | 77 | 41 | 48.8% | 0/0 | 41/84 | 35 | over-dominant | activity neutral:48, active:24, suppressed:12<br>clarity clear:46, stained:38<br>water freshwater_lake_pond:54, freshwater_river:30<br>bucket cold_slow_or_front:32, warming_search:30, breezy_windy_stained_reaction:10 | Big Smallmouth Tube (top), Football Jig (honorable):6, Flat-Sided Crankbait (top), Tube Jig (honorable):4, Football Jig (top), Paddle-Tail Swimbait (honorable):3 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 2.4% | 29/612 | 11/76 | 29 | 11 | 14.5% | 9/38 | 2/38 | 14 | healthy | activity neutral:64, suppressed:12<br>clarity clear:76<br>water freshwater_lake_pond:56, freshwater_river:20<br>bucket cold_slow_or_front:28, calm_bright_clear_subtle:20, stable_pleasant_medium_confidence_archive:12 | Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):4, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):3, Big Smallmouth Tube (top), Compact Glide Bait (honorable):2 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 3.9% | 48/480 | 13/76 | 48 | 13 | 17.1% | 13/38 | 0/38 | 25 | healthy | activity neutral:72, suppressed:4<br>clarity clear:64, stained:12<br>water freshwater_lake_pond:56, freshwater_river:20<br>bucket calm_bright_clear_subtle:20, warming_search:20, cold_slow_or_front:16 | Tube Jig (top), Drop-Shot Minnow (honorable):7, Big Smallmouth Tube (top), Football Jig (honorable):3, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):3 |
| Inline Spinner<br>inline_spinner | lure | 8.3% | 101/612 | 9/56 | 101 | 9 | 16.1% | 7/28 | 2/28 | 20 | healthy | activity neutral:40, active:8, suppressed:8<br>clarity clear:28, stained:28<br>water freshwater_river:56<br>bucket cold_slow_or_front:16, stable_pleasant_medium_confidence_archive:16, breezy_windy_stained_reaction:8 | Big Smallmouth Tube (honorable), Magnum Jerkbait (top):3, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):3, Tube Jig (top), Hair Jig (honorable):3 |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |
| forage_clarity_stack | 28 |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 136 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>primary_forage:baitfish:+12 |
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
| Lake Champlain SMB water<br>2025-04-27 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Yampa River mountain-west SMB context<br>2025-05-19 | big_fish<br>stained<br>freshwater_river | breezy_windy_stained_reaction<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-06-14 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Finesse Jig<br>finesse_jig | 12/116 | 1/116 | goal_tags:136, forage_clarity_stack:39, daily_condition_tags:27, selector_filtering_variety_jitter:11, seasonal_baseline:6 | Upper Mississippi smallmouth river 2025-01-26 big_fish stained: lost to Ned Rig by 0 (selector_filtering_variety_jitter)<br>Table Rock / Ozark clear reservoir 2025-02-20 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Table Rock / Ozark clear reservoir 2025-02-20 big_fish stained: lost to Texas-Rigged Soft-Plastic Craw by 0 (selector_filtering_variety_jitter) |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | 13/116 | 5/116 | goal_tags:136, forage_clarity_stack:33, daily_condition_tags:27, selector_filtering_variety_jitter:11, seasonal_baseline:7 | Upper Mississippi smallmouth river 2025-01-26 all_purpose clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 all_purpose stained: lost to Finesse Jig by 0 (selector_filtering_variety_jitter) |
| Ned Rig<br>ned_rig | 16/108 | 2/108 | goal_tags:120, forage_clarity_stack:45, daily_condition_tags:18, selector_filtering_variety_jitter:9, seasonal_baseline:6 | Table Rock / Ozark clear reservoir 2025-02-20 all_purpose clear: lost to Carolina-Rigged Stick Worm by 0 (selector_filtering_variety_jitter)<br>Table Rock / Ozark clear reservoir 2025-02-20 big_fish stained: lost to Texas-Rigged Soft-Plastic Craw by 0 (selector_filtering_variety_jitter)<br>New River Appalachian SMB context 2025-03-26 all_purpose stained: lost to Finesse Jig by 0 (selector_filtering_variety_jitter) |
| Drop-Shot Minnow<br>drop_shot_minnow | 9/38 | 2/38 | goal_tags:42, daily_condition_tags:13, seasonal_baseline:4, selector_filtering_variety_jitter:4, raw_score:2 | New River Appalachian SMB context 2025-04-04 all_purpose clear: lost to Tube Jig by 2 (raw_score)<br>Trinity Lake northern California SMB water 2025-05-23 all_purpose clear: lost to Tube Jig by 12 (seasonal_baseline)<br>Ozark Current River smallmouth context 2025-06-14 all_purpose clear: lost to Tube Jig by 12 (seasonal_baseline) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Finesse Jig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish stained cold_slow_or_front | 156 | Ned Rig<br>156 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>all_purpose clear cold_slow_or_front | 206 | Carolina-Rigged Stick Worm<br>206 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>big_fish stained cold_slow_or_front | 156 | Texas-Rigged Soft-Plastic Craw<br>156 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>New River Appalachian SMB context 2025-03-26<br>all_purpose clear cold_slow_or_front | 190 | Ned Rig<br>190 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>all_purpose clear cold_slow_or_front | 206 | Carolina-Rigged Stick Worm<br>206 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>big_fish stained cold_slow_or_front | 156 | Texas-Rigged Soft-Plastic Craw<br>156 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>New River Appalachian SMB context 2025-03-26<br>all_purpose stained breezy_windy_stained_reaction | 184 | Finesse Jig<br>184 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 206 | Finesse Jig<br>206 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 172 | Finesse Jig<br>172 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose stained cold_slow_or_front | 190 | Finesse Jig<br>190 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish stained cold_slow_or_front | 156 | Ned Rig<br>156 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>New River Appalachian SMB context 2025-04-04<br>all_purpose clear warming_search | 180 | Tube Jig<br>182 | 2 | raw_score | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Ned Rig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>big_fish clear cold_slow_or_front | 172 | Football Jig<br>176 | 4 | goal_tags | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Trinity Lake northern California SMB water 2025-05-23<br>all_purpose clear calm_bright_clear_subtle | 170 | Tube Jig<br>182 | 12 | seasonal_baseline | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Drop-Shot Minnow<br>Ozark Current River smallmouth context 2025-06-14<br>all_purpose clear stable_pleasant_medium_confidence_archive | 170 | Tube Jig<br>182 | 12 | seasonal_baseline | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Drop-Shot Minnow<br>Ozark Current River smallmouth context 2025-05-06<br>all_purpose clear cold_slow_or_front | 170 | Ned Rig<br>186 | 16 | daily_condition_tags | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 10 |
| jitter_or_id_tiebreak | 8 |
| set_b_group_novelty | 4 |
| honorable_diversity_or_replacement | 3 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>206 | Texas-Rigged Soft-Plastic Craw<br>206 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>190 | Texas-Rigged Soft-Plastic Craw<br>190 | 0 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
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
| New River Appalachian SMB context<br>2025-05-06 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Ned Rig<br>170 | Finesse Jig<br>170 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| New River Appalachian SMB context<br>2025-05-06 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 all_purpose clear<br>heat_limited_finesse | B<br>lure_of_the_day | Finesse Jig<br>192 | Ned Rig<br>192 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Drop-Shot Minnow<br>170 | Ned Rig<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 all_purpose stained<br>heat_limited_finesse | B<br>lure_of_the_day | Drop-Shot Minnow<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:heat_slow_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:heat_finesse:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 |
| Table Rock / Ozark clear reservoir<br>2025-09-13 all_purpose clear<br>warming_search | B<br>lure_of_the_day | Soft Plastic Jerkbait<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-09-27 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Soft Plastic Jerkbait<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Upper Mississippi smallmouth river<br>2025-09-29 all_purpose clear<br>calm_bright_clear_subtle | B<br>lure_of_the_day | Soft Plastic Jerkbait<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Table Rock / Ozark clear reservoir<br>2025-10-19 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>186 | Finesse Jig<br>186 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Table Rock / Ozark clear reservoir<br>2025-10-19 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>186 | Texas-Rigged Soft-Plastic Craw<br>186 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 4/336 | 1.2% | 32 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:40, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40, big_fish / dirty / freshwater_lake_pond / dirty_vibration:40, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40 | goal_tags:238, daily_condition_tags:79, selector_filtering_variety_jitter:9, seasonal_baseline:4 | Inline Spinner (top), Suspending Jerkbait (honorable):19, Medium-Diving Crankbait (top), Football Jig (honorable):13, Inline Spinner (honorable), Suspending Jerkbait (top):10, Buzzbait (top), Big Smallmouth Tube (honorable):7 |
| Finesse Jig<br>finesse_jig | lure | 13/232 | 5.6% | 51 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28, all_purpose / clear / freshwater_river / cold_slow_or_front:12, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:12 | goal_tags:136, forage_clarity_stack:39, daily_condition_tags:27, selector_filtering_variety_jitter:11 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7, Tube Jig (top), Drop-Shot Minnow (honorable):7, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):6, Buzzbait (top), Big Smallmouth Tube (honorable):6 |
| Blade Bait<br>blade_bait | lure | 10/232 | 4.3% | 48 | all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40, all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28 | goal_tags:131, daily_condition_tags:44, forage_clarity_stack:33, selector_filtering_variety_jitter:10 | Inline Spinner (top), Suspending Jerkbait (honorable):9, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):8, Inline Spinner (honorable), Suspending Jerkbait (top):8, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):6 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 18/232 | 7.8% | 46 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:28, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:28, all_purpose / clear / freshwater_river / cold_slow_or_front:12, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:12 | goal_tags:136, forage_clarity_stack:33, daily_condition_tags:27, selector_filtering_variety_jitter:11 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7, Tube Jig (top), Drop-Shot Minnow (honorable):7, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):6, Buzzbait (top), Big Smallmouth Tube (honorable):6 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 0/216 | 0% | 20 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:30, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:30, big_fish / dirty / freshwater_lake_pond / dirty_vibration:30, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:30 | goal_tags:128, daily_condition_tags:75, forage_clarity_stack:11, seasonal_baseline:1 | Inline Spinner (top), Suspending Jerkbait (honorable):10, Medium-Diving Crankbait (top), Football Jig (honorable):8, Buzzbait (top), Big Smallmouth Tube (honorable):7, Inline Spinner (honorable), Suspending Jerkbait (top):7 |
| Hair Jig<br>hair_jig | lure | 7/108 | 6.5% | 33 | all_purpose / clear / freshwater_river / cold_slow_or_front:12, big_fish / clear / freshwater_river / cold_slow_or_front:12, all_purpose / stained / freshwater_river / cold_slow_or_front:10, big_fish / stained / freshwater_river / cold_slow_or_front:10 | goal_tags:52, forage_clarity_stack:31, seasonal_baseline:7, selector_filtering_variety_jitter:7 | Big Smallmouth Tube (honorable), Magnum Jerkbait (top):5, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):5, Buzzbait (top), Big Smallmouth Tube (honorable):5, Tube Jig (top), Soft Plastic Jerkbait (honorable):5 |
| Conehead Streamer<br>conehead_streamer | fly | 3/84 | 3.6% | 27 | all_purpose / dirty / freshwater_river / dirty_vibration:12, big_fish / dirty / freshwater_river / dirty_vibration:12, all_purpose / clear / freshwater_river / cold_slow_or_front:6, big_fish / clear / freshwater_river / cold_slow_or_front:6 | goal_tags:77, daily_condition_tags:2, forage_clarity_stack:1, selector_filtering_variety_jitter:1 | Articulated Baitfish Streamer (top), Game Changer (honorable):4, Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Deer Hair Slider (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 4/84 | 4.8% | 26 | all_purpose / dirty / freshwater_river / dirty_vibration:12, big_fish / dirty / freshwater_river / dirty_vibration:12, all_purpose / clear / freshwater_river / cold_slow_or_front:6, big_fish / clear / freshwater_river / cold_slow_or_front:6 | goal_tags:76, daily_condition_tags:2, forage_clarity_stack:1, selector_filtering_variety_jitter:1 | Articulated Baitfish Streamer (top), Game Changer (honorable):4, Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Deer Hair Slider (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 86/336 | 25.6% | 83 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:40, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40, big_fish / dirty / freshwater_lake_pond / dirty_vibration:40, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40 | goal_tags:103, daily_condition_tags:91, selector_filtering_variety_jitter:48, seasonal_baseline:6 | Deceiver (top), Baitfish Slider Fly (honorable):17, Clouser Minnow (honorable), Zonker Streamer (top):12, Articulated Baitfish Streamer (honorable), Deceiver (top):9, Deceiver (top), Rabbit-Strip Leech (honorable):9 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 79/280 | 28.2% | 115 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:40, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40, big_fish / dirty / freshwater_lake_pond / dirty_vibration:40, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:40 | goal_tags:115, selector_filtering_variety_jitter:78, seasonal_baseline:6, daily_condition_tags:2 | Inline Spinner (top), Suspending Jerkbait (honorable):13, Buzzbait (top), Big Smallmouth Tube (honorable):7, Inline Spinner (honorable), Suspending Jerkbait (top):7, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):6 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 41/84 | 48.8% | 35 | big_fish / stained / freshwater_lake_pond / warming_search:14, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:12, big_fish / clear / freshwater_lake_pond / warming_search:12, big_fish / clear / freshwater_river / cold_slow_or_front:10 | selector_filtering_variety_jitter:24, forage_clarity_stack:9, goal_tags:9, daily_condition_tags:1 | Big Smallmouth Tube (top), Football Jig (honorable):6, Flat-Sided Crankbait (top), Tube Jig (honorable):4, Football Jig (top), Paddle-Tail Swimbait (honorable):3, Big Smallmouth Tube (honorable), Football Jig (top):2 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Foam Gurgler [fly] (21), Popper Fly [fly] (13), Clouser Minnow [fly] (11), Soft Plastic Jerkbait [lure] (11), Inline Spinner [lure] (10) | Foam Gurgler [fly] (25), Clouser Minnow [fly] (21), Soft Plastic Jerkbait [lure] (20), Popper Fly [fly] (16), Inline Spinner [lure] (15) |
| calm_surface | big_fish | Walking Topwater [lure] (19), Articulated Baitfish Streamer [fly] (15), Deer Hair Slider [fly] (15), Game Changer [fly] (13), Buzzbait [lure] (11) | Deer Hair Slider [fly] (27), Game Changer [fly] (26), Articulated Baitfish Streamer [fly] (24), Walking Topwater [lure] (24), Big Smallmouth Tube [lure] (23) |
| low_light_surface | all_purpose | Foam Gurgler [fly] (14), Popper Fly [fly] (7), Clouser Minnow [fly] (6), Inline Spinner [lure] (6), Squarebill Crankbait [lure] (5) | Foam Gurgler [fly] (15), Clouser Minnow [fly] (13), Inline Spinner [lure] (12), Baitfish Slider Fly [fly] (9), Popper Fly [fly] (9) |
| low_light_surface | big_fish | Buzzbait [lure] (14), Deer Hair Slider [fly] (12), Walking Topwater [lure] (12), Game Changer [fly] (9), Articulated Baitfish Streamer [fly] (7) | Deer Hair Slider [fly] (18), Game Changer [fly] (17), Buzzbait [lure] (15), Walking Topwater [lure] (15), Articulated Baitfish Streamer [fly] (13) |
| wind_reaction | all_purpose | Zonker Streamer [fly] (47), Deceiver [fly] (39), Inline Spinner [lure] (30), Suspending Jerkbait [lure] (30), Medium-Diving Crankbait [lure] (18) | Suspending Jerkbait [lure] (64), Inline Spinner [lure] (57), Zonker Streamer [fly] (51), Deceiver [fly] (50), Baitfish Slider Fly [fly] (41) |
| wind_reaction | big_fish | Medium-Diving Crankbait [lure] (44), Game Changer [fly] (30), Articulated Baitfish Streamer [fly] (23), Deceiver [fly] (22), Baitfish Slider Fly [fly] (18) | Articulated Baitfish Streamer [fly] (57), Game Changer [fly] (56), Rabbit-Strip Leech [fly] (56), Medium-Diving Crankbait [lure] (48), Football Jig [lure] (42) |
| dirty_vibration | all_purpose | Zonker Streamer [fly] (40), Deceiver [fly] (33), Inline Spinner [lure] (25), Suspending Jerkbait [lure] (19), Medium-Diving Crankbait [lure] (14) | Inline Spinner [lure] (44), Suspending Jerkbait [lure] (44), Deceiver [fly] (42), Zonker Streamer [fly] (42), Medium-Diving Crankbait [lure] (34) |
| dirty_vibration | big_fish | Medium-Diving Crankbait [lure] (36), Game Changer [fly] (21), Articulated Baitfish Streamer [fly] (19), Deceiver [fly] (18), Baitfish Slider Fly [fly] (15) | Articulated Baitfish Streamer [fly] (47), Game Changer [fly] (43), Rabbit-Strip Leech [fly] (42), Medium-Diving Crankbait [lure] (36), Big Smallmouth Tube [lure] (32) |
| clear_subtle | all_purpose | Tube Jig [lure] (16), Soft Plastic Jerkbait [lure] (10), Clouser Minnow [fly] (7), Warmwater Crawfish Fly [fly] (6), Suspending Jerkbait [lure] (5) | Tube Jig [lure] (18), Clouser Minnow [fly] (15), Soft Plastic Jerkbait [lure] (14), Warmwater Crawfish Fly [fly] (11), Drop-Shot Minnow [lure] (10) |
| clear_subtle | big_fish | Big Smallmouth Tube [lure] (10), Game Changer [fly] (10), Articulated Baitfish Streamer [fly] (7), Compact Glide Bait [lure] (7), Unweighted Baitfish Streamer [fly] (7) | Game Changer [fly] (21), Big Smallmouth Tube [lure] (19), Articulated Baitfish Streamer [fly] (17), Compact Glide Bait [lure] (13), Rabbit-Strip Leech [fly] (12) |
| cold_slow | all_purpose | Tube Jig [lure] (28), Sculpin Streamer [fly] (14), Deceiver [fly] (12), Muddler Minnow [fly] (11), Suspending Jerkbait [lure] (11) | Tube Jig [lure] (31), Woolly Bugger [fly] (23), Jighead Marabou Leech [fly] (22), Suspending Jerkbait [lure] (22), Ned Rig [lure] (17) |
| cold_slow | big_fish | Game Changer [fly] (18), Rabbit-Strip Leech [fly] (14), Big Smallmouth Tube [lure] (13), Medium-Diving Crankbait [lure] (12), Articulated Baitfish Streamer [fly] (11) | Rabbit-Strip Leech [fly] (41), Game Changer [fly] (33), Articulated Baitfish Streamer [fly] (31), Big Smallmouth Tube [lure] (30), Magnum Jerkbait [lure] (26) |
| warming_search | all_purpose | Clouser Minnow [fly] (22), Inline Spinner [lure] (12), Soft Plastic Jerkbait [lure] (9), Suspending Jerkbait [lure] (9), Feather Jig Leech [fly] (8) | Clouser Minnow [fly] (37), Inline Spinner [lure] (22), Baitfish Slider Fly [fly] (15), Drop-Shot Minnow [lure] (15), Suspending Jerkbait [lure] (15) |
| warming_search | big_fish | Articulated Baitfish Streamer [fly] (27), Game Changer [fly] (26), Big Smallmouth Tube [lure] (18), Magnum Jerkbait [lure] (14), Football Jig [lure] (12) | Game Changer [fly] (39), Rabbit-Strip Leech [fly] (33), Articulated Baitfish Streamer [fly] (32), Big Smallmouth Tube [lure] (30), Football Jig [lure] (27) |
| heat_finesse | all_purpose | Weightless Stick Worm [lure] (3), Finesse Jig [lure] (2), Jighead Marabou Leech [fly] (2), Warmwater Crawfish Fly [fly] (2), Drop-Shot Minnow [lure] (1) | Clouser Minnow [fly] (3), Finesse Jig [lure] (3), Warmwater Crawfish Fly [fly] (3), Weightless Stick Worm [lure] (3), Jighead Marabou Leech [fly] (2) |
| heat_finesse | big_fish | Game Changer [fly] (3), Articulated Baitfish Streamer [fly] (2), Big Smallmouth Tube [lure] (2), Drop-Shot Minnow [lure] (1), Flat-Sided Crankbait [lure] (1) | Articulated Baitfish Streamer [fly] (3), Big Smallmouth Tube [lure] (3), Compact Glide Bait [lure] (3), Football Jig [lure] (3), Game Changer [fly] (3) |
| current_swing | all_purpose | Clouser Minnow [fly] (8), Foam Gurgler [fly] (5), Tube Jig [lure] (5), Bladed Jig [lure] (4), Inline Spinner [lure] (4) | Clouser Minnow [fly] (12), Squarebill Crankbait [lure] (10), Bladed Jig [lure] (7), Foam Gurgler [fly] (7), Muddler Minnow [fly] (7) |
| current_swing | big_fish | Sculpzilla [fly] (9), Buzzbait [lure] (8), Walking Topwater [lure] (8), Bladed Jig [lure] (5), Deer Hair Slider [fly] (5) | Big Smallmouth Tube [lure] (15), Sculpzilla [fly] (15), Game Changer [fly] (14), Buzzbait [lure] (9), Deer Hair Slider [fly] (9) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Colorado mountain-west SMB reservoir<br>2025-08-12 clear big_fish B | 60.3-86.9F, 7.6 mph wind, 27.3% cloud, 0 in precip | neutral, caution, wind_reaction+clear_subtle+open_water_search, medium | Inline Spinner (172); Medium-Diving Crankbait (178); Unweighted Baitfish Streamer (162); Deceiver (172) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE |
| Yampa River mountain-west SMB context<br>2025-05-19 clear big_fish B | 37.6-50.1F, 10.4 mph wind, 68.5% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, medium | Medium-Diving Crankbait (162); Tube Jig (148); Game Changer (154); Articulated Baitfish Streamer (146) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 dirty all_purpose B | 51.3-69.4F, 8.2 mph wind, 100% cloud, 0 in precip | neutral, open, low_light_surface+wind_reaction+dirty_vibration+cold_slow, medium | Squarebill Crankbait (162); Buzzbait (152); Foam Gurgler (170); Zonker Streamer (144) | COLD_CLEAR_TOO_FAST, ALL_PURPOSE_OVER_SELECTING_HIGH_RISK, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
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
| Lake Champlain SMB water<br>2025-01-18 clear all_purpose A | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Ned Rig (152); Finesse Jig (152); Feather Jig Leech (152); Game Changer (132) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-01-18 clear big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+warming_search, medium | Medium-Diving Crankbait (158); Suspending Jerkbait (136); Articulated Dungeon Streamer (154); Rabbit-Strip Leech (140) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-01-18 stained big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+warming_search, medium | Spinnerbait (142); Suspending Jerkbait (136); Articulated Baitfish Streamer (146); Game Changer (140) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-08-14 clear all_purpose A | 69.7-77F, 8.8 mph wind, 18.6% cloud, 0 in precip | active, caution, wind_reaction+clear_subtle+open_water_search, medium | Carolina-Rigged Stick Worm (166); Soft Plastic Jerkbait (192); Zonker Streamer (184); Game Changer (168) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Lake Champlain SMB water<br>2025-08-14 clear big_fish B | 69.7-77F, 8.8 mph wind, 18.6% cloud, 0 in precip | active, caution, wind_reaction+clear_subtle+open_water_search, medium | Medium-Diving Crankbait (178); Suspending Jerkbait (172); Unweighted Baitfish Streamer (162); Baitfish Slider Fly (162) | BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE |
| Door County / Green Bay smallmouth lake<br>2025-05-23 clear big_fish A | 42.9-55.9F, 9.9 mph wind, 80.1% cloud, 0 in precip | neutral, closed, wind_reaction, medium | Football Jig (140); Magnum Jerkbait (144); Articulated Baitfish Streamer (136); Game Changer (144) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Door County / Green Bay smallmouth lake<br>2025-06-21 clear big_fish A | 58-83.1F, 13.5 mph wind, 64.8% cloud, 1.3 in precip | neutral, caution, wind_reaction, medium | Glide Bait (152); Big Smallmouth Tube (152); Articulated Baitfish Streamer (136); Game Changer (144) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Door County / Green Bay smallmouth lake<br>2025-06-21 clear big_fish B | 58-83.1F, 13.5 mph wind, 64.8% cloud, 1.3 in precip | neutral, caution, wind_reaction, medium | Compact Glide Bait (152); Football Jig (140); Deceiver (140); Rabbit-Strip Leech (126) | WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |

## Known Coverage Gaps

- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
