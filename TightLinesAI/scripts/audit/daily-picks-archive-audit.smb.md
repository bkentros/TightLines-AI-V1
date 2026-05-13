# FinFindr SMB Daily-Picks Archive Audit
Generated: 2026-05-12T20:22:53.671Z

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
| breezy_windy_stained_reaction | 84 |
| dirty_vibration | 104 |
| cold_slow_or_front | 312 |
| warming_search | 48 |
| heat_limited_finesse | 0 |
| stable_pleasant_high_confidence | 0 |
| stable_pleasant_medium_confidence_archive | 252 |
| river_elevated_runoff_current | 60 |
| medium_confidence_archive | 612 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 2 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Table Rock / Ozark clear reservoir<br>2025-10-19 -> 2025-10-20 | changed | 1.6 | 9.0 | cold_slow -> cold_slow |
| Mille Lacs / Upper Midwest natural lake<br>2025-09-20 -> 2025-09-21 | changed | 2.9 | 1.1 | wind_reaction|dirty_vibration -> calm_surface |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 13 | WIND_NOT_ELEVATING_REACTION (8), BIG_FISH_NOT_FAVORING_UPSIDE (5), COLD_CLEAR_TOO_FAST (1) |
| calm_low_light_surface | 2 | ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2) |
| cold_slow_or_front | 50 | BIG_FISH_NOT_FAVORING_UPSIDE (28), WIND_NOT_ELEVATING_REACTION (23), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (4), COLD_CLEAR_TOO_FAST (2) |
| dirty_vibration | 20 | WIND_NOT_ELEVATING_REACTION (9), BIG_FISH_NOT_FAVORING_UPSIDE (6), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (2), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2), COLD_CLEAR_TOO_FAST (1) |
| medium_confidence_archive | 90 | WIND_NOT_ELEVATING_REACTION (50), BIG_FISH_NOT_FAVORING_UPSIDE (40), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (8), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (4), COLD_CLEAR_TOO_FAST (2) |
| river_elevated_runoff_current | 10 | BIG_FISH_NOT_FAVORING_UPSIDE (5), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (3), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2) |
| stable_pleasant_medium_confidence_archive | 35 | WIND_NOT_ELEVATING_REACTION (24), BIG_FISH_NOT_FAVORING_UPSIDE (10), ALL_PURPOSE_OVER_SELECTING_HIGH_RISK (4), CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (4), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2) |
| warming_search | 5 | WIND_NOT_ELEVATING_REACTION (3), BIG_FISH_NOT_FAVORING_UPSIDE (2) |

- WIND_NOT_ELEVATING_REACTION: 50
- BIG_FISH_NOT_FAVORING_UPSIDE: 40
- CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE: 8
- ALL_PURPOSE_OVER_SELECTING_HIGH_RISK: 4
- COLD_CLEAR_TOO_FAST: 2
- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 2

- co_pueblo_smb__2025-08-12__freshwater_lake_pond__clear__big_fish__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Medium-Diving Crankbait (lure); Unweighted Baitfish Streamer (fly); Deceiver (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Smallmouth Tube (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Glide Bait (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Smallmouth Tube (lure); Compact Glide Bait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Medium-Diving Crankbait (lure); Inline Spinner (lure); Baitfish Slider Fly (fly); Zonker Streamer (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Glide Bait (lure); Big Smallmouth Tube (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Smallmouth Tube (lure); Compact Glide Bait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Glide Bait (lure); Big Smallmouth Tube (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_smb__2025-08-14__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Soft Plastic Jerkbait (lure); Carolina-Rigged Stick Worm (lure); Zonker Streamer (fly); Game Changer (fly)
- vt_champlain_smb__2025-08-14__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Medium-Diving Crankbait (lure); Suspending Jerkbait (lure); Unweighted Baitfish Streamer (fly); Baitfish Slider Fly (fly)
- mn_mille_lacs__2025-09-20__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Glide Bait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- co_pueblo_smb__2025-10-05__freshwater_lake_pond__clear__all_purpose__B: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Inline Spinner (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Clouser Minnow (fly)
- co_pueblo_smb__2025-10-05__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Compact Glide Bait (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- co_pueblo_smb__2025-10-05__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Big Smallmouth Tube (lure); Football Jig (lure); Zonker Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Carolina-Rigged Stick Worm (lure); Deep-Diving Crankbait (lure); Zonker Streamer (fly); Game Changer (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Tube Jig (lure); Spinnerbait (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Medium-Diving Crankbait (lure); Spinnerbait (lure); Rabbit-Strip Leech (fly); Articulated Dungeon Streamer (fly)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__big_fish__A: CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE. Picks: Hair Jig (lure); Finesse Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Carolina-Rigged Stick Worm (lure); Ned Rig (lure); Jighead Marabou Leech (fly); Game Changer (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Texas-Rigged Soft-Plastic Craw (lure); Zonker Streamer (fly); Articulated Baitfish Streamer (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Medium-Diving Crankbait (lure); Ned Rig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mo_table_rock__2025-02-20__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Tube Jig (lure); Texas-Rigged Soft-Plastic Craw (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_table_rock__2025-02-20__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Carolina-Rigged Stick Worm (lure); Texas-Rigged Soft-Plastic Craw (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_table_rock__2025-02-20__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Tube Jig (lure); Ned Rig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Tube Jig (lure); Blade Bait (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Carolina-Rigged Stick Worm (lure); Clouser Minnow (fly); Jighead Marabou Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Big Smallmouth Tube (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Lipless Crankbait (lure); Magnum Jerkbait (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Texas-Rigged Soft-Plastic Craw (lure); Tube Jig (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Suspending Jerkbait (lure); Tube Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Inline Spinner (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Big Smallmouth Tube (lure); Articulated Baitfish Streamer (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Zonker Streamer (fly); Game Changer (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-04-04__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Paddle-Tail Swimbait (lure); Feather Jig Leech (fly); Articulated Dungeon Streamer (fly)
- wv_new_river_smb__2025-04-04__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Bladed Jig (lure); Spinnerbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mo_current_river__2025-04-05__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Inline Spinner (lure); Hair Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- mo_current_river__2025-04-05__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Bladed Jig (lure); Spinnerbait (lure); Sculpzilla (fly); Game Changer (fly)
- mo_current_river__2025-04-05__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Bladed Jig (lure); Squarebill Crankbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wi_door_county__2025-04-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Paddle-Tail Swimbait (lure); Clouser Minnow (fly); Feather Jig Leech (fly)
- wi_door_county__2025-04-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Smallmouth Tube (lure); Magnum Jerkbait (lure); Baitfish Slider Fly (fly); Game Changer (fly)
- wi_door_county__2025-04-18__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Big Smallmouth Tube (lure); Baitfish Slider Fly (fly); Articulated Baitfish Streamer (fly)
- mo_current_river__2025-05-06__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Muddler Minnow (fly); Game Changer (fly)
- mo_current_river__2025-05-06__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Sculpzilla (fly); Game Changer (fly)
- mo_current_river__2025-05-06__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__stained__big_fish__A: COLD_CLEAR_TOO_FAST. Picks: Buzzbait (lure); Big Smallmouth Tube (lure); Deer Hair Slider (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__dirty__big_fish__A: COLD_CLEAR_TOO_FAST. Picks: Buzzbait (lure); Big Smallmouth Tube (lure); Baitfish Slider Fly (fly); Deer Hair Slider (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Soft Plastic Jerkbait (lure); Unweighted Baitfish Streamer (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Big Smallmouth Tube (lure); Baitfish Slider Fly (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Baitfish Slider Fly (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Squarebill Crankbait (lure); Compact Glide Bait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- co_yampa__2025-05-19__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Medium-Diving Crankbait (lure); Tube Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_current_river__2025-06-14__freshwater_river__dirty__all_purpose__A: DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Spinnerbait (lure); Bladed Jig (lure); Clouser Minnow (fly); Slim Baitfish Streamer (fly)
- wv_new_river_smb__2025-06-17__freshwater_river__stained__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Bladed Jig (lure); Buzzbait (lure); Sculpin Streamer (fly); Slim Baitfish Streamer (fly)
- wv_new_river_smb__2025-06-17__freshwater_river__dirty__all_purpose__A: DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Spinnerbait (lure); Squarebill Crankbait (lure); Slim Baitfish Streamer (fly); Muddler Minnow (fly)
- wv_new_river_smb__2025-06-17__freshwater_river__dirty__all_purpose__B: ALL_PURPOSE_OVER_SELECTING_HIGH_RISK. Picks: Bladed Jig (lure); Buzzbait (lure); Foam Gurgler (fly); Crawfish Streamer (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 60
- ADJACENT_DAY_EXACT_REPEAT: 9
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 8

- mo_current_river__2025-05-06__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Ned Rig (lure); Sculpin Streamer (fly); Rabbit-Strip Leech (fly)
- mo_current_river__2025-05-06__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Ned Rig (lure); Sculpin Streamer (fly); Jighead Marabou Leech (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Sculpzilla (fly); Articulated Dungeon Streamer (fly)
- co_yampa__2025-05-19__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Tube Jig (lure); Game Changer (fly); Articulated Baitfish Streamer (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Texas-Rigged Soft-Plastic Craw (lure); Ned Rig (lure); Woolly Bugger (fly); Jighead Marabou Leech (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__clear__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Magnum Jerkbait (lure); Compact Glide Bait (lure); Rabbit-Strip Leech (fly); Game Changer (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__stained__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Tube Jig (lure); Texas-Rigged Soft-Plastic Craw (lure); Warmwater Crawfish Fly (fly); Woolly Bugger (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Finesse Jig (lure); Lead-Eye Leech (fly); Clouser Minnow (fly)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Ned Rig (lure); Crawfish Streamer (fly); Sculpin Streamer (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Lipless Crankbait (lure); Deceiver (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Lipless Crankbait (lure); Zonker Streamer (fly); Game Changer (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Tube Jig (lure); Articulated Baitfish Streamer (fly); Game Changer (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Lipless Crankbait (lure); Zonker Streamer (fly); Game Changer (fly)
- mo_current_river__2025-04-05__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Texas-Rigged Soft-Plastic Craw (lure); Sculpin Streamer (fly); Clouser Minnow (fly)
- mo_current_river__2025-04-05__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Squarebill Crankbait (lure); Clouser Minnow (fly); Muddler Minnow (fly)
- mo_current_river__2025-04-05__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Squarebill Crankbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- wi_door_county__2025-04-18__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Deceiver (fly); Game Changer (fly)
- mo_table_rock__2025-04-24__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Carolina-Rigged Stick Worm (lure); Unweighted Baitfish Streamer (fly); Baitfish Slider Fly (fly)
- vt_champlain_smb__2025-04-27__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Tube Jig (lure); Zonker Streamer (fly); Woolly Bugger (fly)
- vt_champlain_smb__2025-04-27__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Big Smallmouth Tube (lure); Deceiver (fly); Articulated Baitfish Streamer (fly)
- vt_champlain_smb__2025-04-27__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Bladed Jig (lure); Zonker Streamer (fly); Woolly Bugger (fly)
- mo_current_river__2025-05-06__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Texas-Rigged Soft-Plastic Craw (lure); Ned Rig (lure); Sculpin Streamer (fly); Slim Baitfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Texas-Rigged Soft-Plastic Craw (lure); Ned Rig (lure); Sculpin Streamer (fly); Crawfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Game Changer (fly); Articulated Dungeon Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Tube Jig (lure); Sculpzilla (fly); Articulated Baitfish Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Flat-Sided Crankbait (lure); Suspending Jerkbait (lure); Muddler Minnow (fly); Lead-Eye Leech (fly)
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Squarebill Crankbait (lure); Foam Gurgler (fly); Zonker Streamer (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Inline Spinner (lure); Zonker Streamer (fly); Unweighted Baitfish Streamer (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- co_yampa__2025-05-19__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Ned Rig (lure); Sculpin Streamer (fly); Jighead Marabou Leech (fly)
- co_yampa__2025-05-19__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Tube Jig (lure); Deceiver (fly); Sculpin Streamer (fly)
- co_yampa__2025-05-19__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Magnum Jerkbait (lure); Bladed Jig (lure); Bucktail Streamer (fly); Articulated Dungeon Streamer (fly)
- co_yampa__2025-05-19__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Bladed Jig (lure); Deceiver (fly); Baitfish Slider Fly (fly)
- co_yampa__2025-05-19__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Magnum Jerkbait (lure); Articulated Dungeon Streamer (fly); Sculpzilla (fly)
- ca_trinity__2025-05-23__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Carolina-Rigged Stick Worm (lure); Jighead Marabou Leech (fly); Clouser Minnow (fly)
- ca_trinity__2025-05-23__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Suspending Jerkbait (lure); Warmwater Crawfish Fly (fly); Lead-Eye Leech (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Football Jig (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Squarebill Crankbait (lure); Warmwater Crawfish Fly (fly); Zonker Streamer (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Lipless Crankbait (lure); Deceiver (fly); Clouser Minnow (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Lipless Crankbait (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Game Changer (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Squarebill Crankbait (lure); Deceiver (fly); Unweighted Baitfish Streamer (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Squarebill Crankbait (lure); Medium-Diving Crankbait (lure); Deceiver (fly); Clouser Minnow (fly)
- co_pueblo_smb__2025-06-22__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Carolina-Rigged Stick Worm (lure); Lead-Eye Leech (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Inline Spinner (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Game Changer (fly)
- vt_champlain_smb__2025-08-14__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Suspending Jerkbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- vt_champlain_smb__2025-08-14__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Bladed Jig (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- co_pueblo_smb__2025-08-12__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Lipless Crankbait (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- co_pueblo_smb__2025-08-12__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Lipless Crankbait (lure); Zonker Streamer (fly); Articulated Baitfish Streamer (fly)
- mn_mille_lacs__2025-09-20__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Inline Spinner (lure); Zonker Streamer (fly); Clouser Minnow (fly)
- mn_mille_lacs__2025-09-20__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Game Changer (fly)
- tn_dale_hollow__2025-09-27__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Ned Rig (lure); Warmwater Crawfish Fly (fly); Rabbit-Strip Leech (fly)
- mo_table_rock__2025-10-19__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Carolina-Rigged Stick Worm (lure); Ned Rig (lure); Woolly Bugger (fly); Jighead Marabou Leech (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__clear__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Tube Jig (lure); Carolina-Rigged Stick Worm (lure); Warmwater Crawfish Fly (fly); Lead-Eye Leech (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__clear__big_fish__B: ADJACENT_DAY_EXACT_REPEAT. Picks: Big Smallmouth Tube (lure); Football Jig (lure); Warmwater Crawfish Fly (fly); Articulated Baitfish Streamer (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__dirty__all_purpose__B: ADJACENT_DAY_EXACT_REPEAT. Picks: Deep-Diving Crankbait (lure); Suspending Jerkbait (lure); Woolly Bugger (fly); Warmwater Crawfish Fly (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__dirty__big_fish__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Football Jig (lure); Magnum Jerkbait (lure); Rabbit-Strip Leech (fly); Articulated Baitfish Streamer (fly)
- ca_trinity__2025-10-25__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Tube Jig (lure); Zonker Streamer (fly); Woolly Bugger (fly)

## Temperature/Thermal Diagnostics

### Thermal Modes By Month/Region

| Month | Region | Thermal modes |
| --- | --- | --- |
| Jan | great_lakes_upper_midwest | cooling_or_shock:1 |
| Jan | northeast | cold_slow:1 |
| Feb | south_central | cold_slow:2 |
| Mar | appalachian | cold_slow:1 |
| Mar | great_lakes_upper_midwest | stable:1 |
| Mar | northern_california | cold_slow:1 |
| Mar | south_central | cooling_or_shock:1 |
| Apr | appalachian | warming:1 |
| Apr | great_lakes_upper_midwest | warming:1 |
| Apr | mountain_west | stable:1 |
| Apr | northeast | cold_slow:1 |
| Apr | south_central | cold_slow:1, stable:1 |
| May | appalachian | cold_slow:1 |
| May | great_lakes_upper_midwest | cooling_or_shock:1, cold_slow:1 |
| May | mountain_west | cold_slow:1 |
| May | northern_california | cold_slow:1 |
| May | south_central | cold_slow:2 |
| Jun | appalachian | stable:1 |
| Jun | great_lakes_upper_midwest | stable:1 |
| Jun | inland_northwest | warming:1 |
| Jun | mountain_west | stable:1 |
| Jun | northeast | cooling_or_shock:1 |
| Jun | south_central | stable:3 |
| Jul | great_lakes_upper_midwest | cooling_or_shock:1 |
| Jul | mountain_west | stable:1 |
| Jul | northern_california | stable:1 |
| Aug | great_lakes_upper_midwest | stable:1 |
| Aug | inland_northwest | stable:1 |
| Aug | mountain_west | stable:1 |
| Aug | northeast | stable:1 |
| Sep | appalachian | stable:1 |
| Sep | great_lakes_upper_midwest | stable:3 |
| Sep | south_central | stable:1, cold_slow:1 |
| Oct | mountain_west | cooling_or_shock:1 |
| Oct | northeast | warming:1 |
| Oct | northern_california | cold_slow:1 |
| Oct | south_central | cold_slow:2 |
| Nov | inland_northwest | stable:1 |
| Nov | south_central | cold_slow:1 |
| Dec | great_lakes_upper_midwest | cold_slow:1 |
| Dec | northeast | cold_slow:1 |

### Hot Days Tagged Cold Slow

None.

### Heat Finesse Rows With Non-Finesse Top Winners

None.

## Surface/Topwater Diagnostics

### Topwater Selection Summary

| Month | Region | Gate | Light | Goal | Runs | Temp range | Avg wind |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Aug | great_lakes_upper_midwest | open | low_light | all_purpose | 5 | 70.1-79.1F | 5.8 |
| Aug | great_lakes_upper_midwest | open | low_light | big_fish | 6 | 70.1-79.1F | 5.8 |
| Aug | inland_northwest | open | glare | all_purpose | 5 | 55.5-86.1F | 2.5 |
| Aug | inland_northwest | open | glare | big_fish | 6 | 55.5-86.1F | 2.5 |
| Jul | northern_california | open | bright | all_purpose | 5 | 64.6-97.2F | 5.3 |
| Jul | northern_california | open | bright | big_fish | 6 | 64.6-97.2F | 5.3 |
| Jun | appalachian | open | low_light | all_purpose | 4 | 64.2-78.3F | 6.2 |
| Jun | appalachian | open | low_light | big_fish | 6 | 64.2-78.3F | 6.2 |
| Jun | inland_northwest | open | low_light | all_purpose | 5 | 57.8-79.1F | 3.2 |
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
| lure | 290 | 290 | 232 |
| fly | 183 | 183 | 174 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 144 | - |
| open-surface rows with 2+ surface picks | 38 | 38 |
| open-surface rows with 3+ surface picks | 3 | 3 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 17 | 17 |
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
| exact_id | unavoidable_because_only_alternative_already_selected_in_set_b | 3 | 0 | 3 |
| same_family_same_presentation | truly_avoidable | 8 | 52 | 60 |
| same_family_same_presentation | unavoidable_due_score_band | 3 | 19 | 22 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 6 | 6 | 12 |
| same_family_same_presentation | unavoidable_due_goal_condition_fit | 1 | 1 | 2 |
| same_family_different_presentation | truly_avoidable | 0 | 8 | 8 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 9 | 9 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 4 | 4 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| New River Appalachian SMB context<br>2025-03-26 stained big_fish | fly top: same_family_different_presentation | Articulated Dungeon Streamer (156); Rabbit-Strip Leech (164) | Articulated Baitfish Streamer (140); Game Changer (134) | Muddler Minnow (162, alt edge 22) |
| New River Appalachian SMB context<br>2025-05-06 dirty all_purpose | fly honorable: same_family_same_presentation | Jighead Marabou Leech (148); Slim Baitfish Streamer (144) | Muddler Minnow (152); Lead-Eye Leech (142) | Sculpin Streamer (160, alt edge 18) |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 dirty all_purpose | fly honorable: same_family_same_presentation | Baitfish Slider Fly (162); Deceiver (152) | Foam Gurgler (170); Zonker Streamer (144) | Warmwater Crawfish Fly (160, alt edge 16) |
| Dale Hollow / Tennessee highland reservoir<br>2025-09-27 dirty all_purpose | fly honorable: same_family_same_presentation | Lead-Eye Leech (142); Clouser Minnow (156) | Warmwater Crawfish Fly (160); Rabbit-Strip Leech (148) | Woolly Bugger (158, alt edge 10) |
| Yampa River mountain-west SMB context<br>2025-05-19 stained all_purpose | fly top: same_family_same_presentation | Bucktail Streamer (162); Conehead Streamer (162) | Deceiver (162); Sculpin Streamer (170) | Muddler Minnow (170, alt edge 8) |
| Trinity Lake northern California SMB water<br>2025-05-23 dirty all_purpose | fly honorable: same_family_same_presentation | Rabbit-Strip Leech (148); Unweighted Baitfish Streamer (138) | Warmwater Crawfish Fly (160); Lead-Eye Leech (142) | Woolly Bugger (148, alt edge 6) |
| Lake Champlain SMB water<br>2025-04-27 dirty all_purpose | fly top: same_family_same_presentation | Deceiver (162); Baitfish Slider Fly (152) | Zonker Streamer (154); Woolly Bugger (158) | Warmwater Crawfish Fly (160, alt edge 6) |
| Trinity Lake northern California SMB water<br>2025-05-23 clear all_purpose | fly top: same_family_same_presentation | Warmwater Crawfish Fly (176); Lead-Eye Leech (168) | Jighead Marabou Leech (158); Clouser Minnow (154) | Unweighted Baitfish Streamer (162, alt edge 4) |
| Trinity Lake northern California SMB water<br>2025-10-25 dirty all_purpose | fly top: same_family_same_presentation | Deceiver (162); Baitfish Slider Fly (152) | Zonker Streamer (154); Warmwater Crawfish Fly (160) | Woolly Bugger (158, alt edge 4) |
| Yampa River mountain-west SMB context<br>2025-05-19 clear big_fish | fly honorable: same_family_different_presentation | Articulated Dungeon Streamer (154); Rabbit-Strip Leech (142) | Game Changer (154); Articulated Baitfish Streamer (146) | Bucktail Streamer (150, alt edge 4) |
| Door County / Green Bay smallmouth lake<br>2025-05-23 dirty all_purpose | fly honorable: same_family_same_presentation | Baitfish Slider Fly (162); Deceiver (152) | Warmwater Crawfish Fly (160); Zonker Streamer (144) | Jighead Marabou Leech (148, alt edge 4) |
| Colorado mountain-west SMB reservoir<br>2025-08-12 dirty all_purpose | fly top: same_family_same_presentation | Deceiver (184); Baitfish Slider Fly (174) | Zonker Streamer (176); Articulated Baitfish Streamer (168) | Clouser Minnow (178, alt edge 2) |
| Yampa River mountain-west SMB context<br>2025-05-19 clear big_fish | lure honorable: same_family_same_presentation | Magnum Jerkbait (170); Big Smallmouth Tube (168) | Medium-Diving Crankbait (162); Tube Jig (148) | Inline Spinner (150, alt edge 2) |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 stained all_purpose | fly top: same_family_same_presentation | Baitfish Slider Fly (162); Deceiver (152) | Zonker Streamer (152); Unweighted Baitfish Streamer (146) | Clouser Minnow (154, alt edge 2) |
| Mille Lacs / Upper Midwest natural lake<br>2025-07-16 dirty all_purpose | fly top: same_family_same_presentation | Baitfish Slider Fly (158); Deceiver (168) | Zonker Streamer (160); Game Changer (152) | Clouser Minnow (162, alt edge 2) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Table Rock / Ozark clear reservoir<br>2025-02-20 dirty | B | 3/4 | Tube Jig; Ned Rig; Rabbit-Strip Leech; Articulated Baitfish Streamer | Tube Jig; Ned Rig; Articulated Baitfish Streamer; Game Changer |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 clear B | lure | Carolina-Rigged Stick Worm; Deep-Diving Crankbait |
| Lake Champlain SMB water<br>2025-01-18 stained B | lure | Tube Jig; Spinnerbait |
| Lake Champlain SMB water<br>2025-01-18 dirty B | lure | Medium-Diving Crankbait; Spinnerbait |
| Upper Mississippi smallmouth river<br>2025-01-26 clear A | lure | Hair Jig; Finesse Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 clear B | lure | Tube Jig; Drop-Shot Minnow |
| Upper Mississippi smallmouth river<br>2025-01-26 stained A | lure | Blade Bait; Texas-Rigged Soft-Plastic Craw |
| Upper Mississippi smallmouth river<br>2025-01-26 stained B | lure | Tube Jig; Hair Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty A | lure | Texas-Rigged Soft-Plastic Craw; Finesse Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty B | lure | Ned Rig; Shaky-Head Worm |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear B | lure | Carolina-Rigged Stick Worm; Ned Rig |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained B | lure | Suspending Jerkbait; Texas-Rigged Soft-Plastic Craw |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty B | lure | Medium-Diving Crankbait; Ned Rig |
| Table Rock / Ozark clear reservoir<br>2025-02-20 clear B | lure | Tube Jig; Texas-Rigged Soft-Plastic Craw |
| Table Rock / Ozark clear reservoir<br>2025-02-20 stained B | lure | Carolina-Rigged Stick Worm; Texas-Rigged Soft-Plastic Craw |
| Table Rock / Ozark clear reservoir<br>2025-02-20 dirty B | lure | Tube Jig; Ned Rig |
| New River Appalachian SMB context<br>2025-03-26 clear B | lure | Texas-Rigged Soft-Plastic Craw; Tube Jig |
| New River Appalachian SMB context<br>2025-03-26 stained B | lure | Suspending Jerkbait; Tube Jig |
| New River Appalachian SMB context<br>2025-03-26 dirty B | lure | Ned Rig; Inline Spinner |
| New River Appalachian SMB context<br>2025-04-04 clear B | lure | Inline Spinner; Paddle-Tail Swimbait |
| New River Appalachian SMB context<br>2025-04-04 stained B | lure | Bladed Jig; Spinnerbait |
| Ozark Current River smallmouth context<br>2025-04-05 clear B | lure | Inline Spinner; Hair Jig |
| Ozark Current River smallmouth context<br>2025-04-05 stained B | lure | Bladed Jig; Spinnerbait |
| Ozark Current River smallmouth context<br>2025-04-05 dirty B | lure | Bladed Jig; Squarebill Crankbait |
| Ozark Current River smallmouth context<br>2025-05-06 clear B | lure | Flat-Sided Crankbait; Tube Jig |
| Ozark Current River smallmouth context<br>2025-05-06 stained B | lure | Flat-Sided Crankbait; Tube Jig |
| Ozark Current River smallmouth context<br>2025-05-06 dirty B | lure | Flat-Sided Crankbait; Tube Jig |
| New River Appalachian SMB context<br>2025-05-06 clear B | lure | Flat-Sided Crankbait; Tube Jig |
| New River Appalachian SMB context<br>2025-05-06 stained B | lure | Flat-Sided Crankbait; Tube Jig |
| New River Appalachian SMB context<br>2025-05-06 dirty B | lure | Flat-Sided Crankbait; Tube Jig |
| Yampa River mountain-west SMB context<br>2025-05-19 clear B | lure | Medium-Diving Crankbait; Tube Jig |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear B | lure | Medium-Diving Crankbait; Inline Spinner |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Tube Jig [lure] | 13 | Big Smallmouth Tube (8), Football Jig (4), Magnum Jerkbait (1) | 16.8 |
| Medium-Diving Crankbait [lure] | 10 | Football Jig (4), Compact Glide Bait (3), Big Smallmouth Tube (2), Magnum Jerkbait (1) | 14.8 |
| Flat-Sided Crankbait [lure] | 6 | Big Smallmouth Tube (6) | 18 |
| Inline Spinner [lure] | 6 | Big Smallmouth Tube (3), Compact Glide Bait (2), Football Jig (1) | 27 |
| Spinnerbait [lure] | 5 | Football Jig (3), Big Smallmouth Tube (2) | 27.2 |
| Blade Bait [lure] | 4 | Football Jig (4) | -2 |
| Ned Rig [lure] | 4 | Football Jig (3), Big Smallmouth Tube (1) | 19.5 |
| Suspending Jerkbait [lure] | 4 | Big Smallmouth Tube (2), Compact Glide Bait (1), Football Jig (1) | 28 |
| Texas-Rigged Soft-Plastic Craw [lure] | 4 | Football Jig (3), Big Smallmouth Tube (1) | 17.5 |
| Bladed Jig [lure] | 3 | Big Smallmouth Tube (3) | 26 |
| Carolina-Rigged Stick Worm [lure] | 3 | Football Jig (3) | 22 |
| Baitfish Slider Fly [fly] | 2 | Game Changer (2) | 14 |
| Deep-Diving Crankbait [lure] | 2 | Football Jig (2) | 10 |
| Drop-Shot Minnow [lure] | 2 | Big Smallmouth Tube (2) | 16 |
| Lipless Crankbait [lure] | 2 | Football Jig (2) | 18 |

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Upper Mississippi smallmouth river<br>2025-01-26 clear big_fish A | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE (fly) | Game Changer (134; goal:big_fish:big_fish_upside:+20); Articulated Dungeon Streamer (148; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Crawfish Streamer (156, alt edge 8) | goal fit likely competed |
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
| Door County / Green Bay smallmouth lake<br>2025-04-18 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (164; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Feather Jig Leech (146; condition_tag:warming_search:+16, goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (168, alt edge 4) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-04-18 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Big Smallmouth Tube (152; goal:big_fish:big_fish_upside:+20); Magnum Jerkbait (154; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (178, alt edge 24) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-04-18 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Bladed Jig (150; condition_tag:dirty_vibration:+16); Big Smallmouth Tube (144; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (178, alt edge 28) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Unweighted Baitfish Streamer (146; goal:all_purpose:versatile_search:+12); Clouser Minnow (154; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Baitfish Slider Fly (162, alt edge 8) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Compact Glide Bait (152; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Magnum Jerkbait (144; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (152, alt edge 0) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish Streamer (136; goal:big_fish:big_fish_upside:+20); Game Changer (144; goal:big_fish:big_fish_upside:+20) | Baitfish Slider Fly (150, alt edge 6) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Football Jig (140; goal:big_fish:big_fish_upside:+20); Big Smallmouth Tube (152; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (152, alt edge 0) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Bladed Jig (140; condition_tag:dirty_vibration:+16); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (152, alt edge 12) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (144; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Baitfish Slider Fly (150, alt edge 6) | goal fit likely competed |
| Ozark Current River smallmouth context<br>2025-06-14 dirty all_purpose A | DIRTY_WIND_NOT_ELEVATING_VIBRATION (fly) | Clouser Minnow (162; condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Slim Baitfish Streamer (160; condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18) | Foam Gurgler (170, alt edge 8) | goal fit likely competed |
| New River Appalachian SMB context<br>2025-06-17 dirty all_purpose A | DIRTY_WIND_NOT_ELEVATING_VIBRATION (fly) | Slim Baitfish Streamer (160; condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18); Muddler Minnow (152; condition_tag:current_swing:+16, goal:all_purpose:reliable_action:+18) | Foam Gurgler (170, alt edge 10) | goal fit likely competed |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (186; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Game Changer (168; condition_tag:open_water_search:+16, goal:all_purpose:versatile_search:+12) | Deceiver (184, alt edge -2) | goal fit likely competed |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Big Smallmouth Tube (152; goal:big_fish:big_fish_upside:+20); Compact Glide Bait (184; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Medium-Diving Crankbait (178, alt edge -6) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| clear_subtle_wind_watch | 25 |
| dirty_vibration_acceptable | 7 |
| current_open_water_acceptable | 4 |
| other_wind_watch | 4 |
| true_dirty_stained_wind_miss | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 all_purpose clear A | stable_pleasant_medium_confidence_archive<br>neutral | Tube Jig 164<br>Blade Bait 174 |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 all_purpose clear B | stable_pleasant_medium_confidence_archive<br>neutral | Inline Spinner 182<br>Carolina-Rigged Stick Worm 170 |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 big_fish clear A | stable_pleasant_medium_confidence_archive<br>neutral | Big Smallmouth Tube 166<br>Magnum Jerkbait 162 |
| clear_subtle_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish clear A | cold_slow_or_front<br>active | Magnum Jerkbait 154<br>Football Jig 140 |
| clear_subtle_wind_watch | Door County / Green Bay smallmouth lake<br>2025-04-18 all_purpose clear A | warming_search<br>active | Medium-Diving Crankbait 190<br>Paddle-Tail Swimbait 162 |
| current_open_water_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 158<br>Big Smallmouth Tube 166 |
| current_open_water_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 big_fish dirty B | dirty_vibration<br>neutral | Lipless Crankbait 152<br>Magnum Jerkbait 154 |
| current_open_water_acceptable | Table Rock / Ozark clear reservoir<br>2025-06-18 big_fish dirty A | dirty_vibration<br>neutral | Lipless Crankbait 172<br>Compact Glide Bait 176 |
| current_open_water_acceptable | Colorado mountain-west SMB reservoir<br>2025-08-12 big_fish stained A | breezy_windy_stained_reaction<br>active | Lipless Crankbait 172<br>Compact Glide Bait 184 |
| other_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish stained A | breezy_windy_stained_reaction<br>active | Medium-Diving Crankbait 162<br>Big Smallmouth Tube 152 |
| other_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish dirty B | dirty_vibration<br>active | Medium-Diving Crankbait 162<br>Magnum Jerkbait 146 |
| other_wind_watch | Mille Lacs / Upper Midwest natural lake<br>2025-09-20 big_fish stained B | breezy_windy_stained_reaction<br>active | Medium-Diving Crankbait 162<br>Magnum Jerkbait 154 |
| other_wind_watch | Colorado mountain-west SMB reservoir<br>2025-10-05 big_fish dirty B | dirty_vibration<br>active | Medium-Diving Crankbait 162<br>Magnum Jerkbait 146 |
| dirty_vibration_acceptable | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish stained B | breezy_windy_stained_reaction<br>active | Bladed Jig 150<br>Football Jig 140 |
| dirty_vibration_acceptable | Door County / Green Bay smallmouth lake<br>2025-04-18 big_fish dirty B | dirty_vibration<br>active | Bladed Jig 150<br>Big Smallmouth Tube 144 |
| dirty_vibration_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-05-15 big_fish dirty A | dirty_vibration<br>active | Bladed Jig 140<br>Football Jig 140 |
| dirty_vibration_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-05-15 big_fish dirty B | dirty_vibration<br>active | Squarebill Crankbait 150<br>Compact Glide Bait 144 |
| dirty_vibration_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-07-16 big_fish dirty B | dirty_vibration<br>neutral | Spinnerbait 156<br>Compact Glide Bait 160 |
| true_dirty_stained_wind_miss | Mille Lacs / Upper Midwest natural lake<br>2025-07-16 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Compact Glide Bait 168<br>Big Smallmouth Tube 152 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 394 |
| acceptable_fit | 787 |
| strong_fit | 1267 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | medium_confidence_archive | 123 |
| watch | big_fish | B | fly | medium_confidence_archive | 97 |
| watch | big_fish | A | fly | cold_slow_or_front | 82 |
| watch | big_fish | B | fly | cold_slow_or_front | 67 |
| watch | big_fish | A | lure | medium_confidence_archive | 57 |
| watch | big_fish | B | lure | medium_confidence_archive | 56 |
| watch | big_fish | A | fly | dirty_vibration | 33 |
| watch | big_fish | A | lure | cold_slow_or_front | 33 |
| watch | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 31 |
| watch | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 28 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 24 |
| watch | big_fish | B | fly | dirty_vibration | 24 |
| watch | all_purpose | A | fly | medium_confidence_archive | 23 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 22 |
| watch | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 22 |
| watch | big_fish | B | lure | cold_slow_or_front | 22 |
| watch | big_fish | A | lure | dirty_vibration | 20 |
| watch | all_purpose | B | fly | medium_confidence_archive | 19 |
| watch | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 18 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 17 |
| watch | big_fish | B | lure | dirty_vibration | 17 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 16 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 14 |
| watch | all_purpose | B | fly | cold_slow_or_front | 12 |
| watch | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 11 |
| watch | all_purpose | A | fly | cold_slow_or_front | 10 |
| watch | all_purpose | A | lure | medium_confidence_archive | 10 |
| watch | big_fish | A | fly | warming_search | 10 |
| watch | all_purpose | B | lure | medium_confidence_archive | 9 |
| watch | all_purpose | B | fly | dirty_vibration | 8 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 8 |
| watch | big_fish | B | fly | warming_search | 8 |
| watch | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 7 |
| watch | all_purpose | A | lure | cold_slow_or_front | 6 |
| watch | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 6 |
| watch | big_fish | A | lure | warming_search | 6 |
| watch | big_fish | B | lure | warming_search | 6 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 5 |
| watch | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 4 |
| watch | all_purpose | B | lure | river_elevated_runoff_current | 4 |
| watch | big_fish | B | fly | calm_low_light_surface | 4 |
| watch | all_purpose | B | fly | calm_bright_clear_subtle | 3 |
| watch | big_fish | A | fly | calm_low_light_surface | 3 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 3 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 2 |
| watch | all_purpose | A | fly | warming_search | 2 |
| watch | all_purpose | A | lure | calm_low_light_surface | 2 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 2 |
| watch | all_purpose | B | lure | cold_slow_or_front | 2 |
| watch | all_purpose | B | lure | dirty_vibration | 2 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 2 |
| watch | big_fish | B | fly | calm_bright_clear_subtle | 2 |
| watch | big_fish | B | lure | calm_low_light_surface | 2 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 1 |
| watch | all_purpose | A | fly | dirty_vibration | 1 |
| watch | all_purpose | A | lure | dirty_vibration | 1 |
| watch | all_purpose | A | lure | river_elevated_runoff_current | 1 |
| watch | all_purpose | B | fly | warming_search | 1 |
| watch | all_purpose | B | lure | calm_bright_clear_subtle | 1 |
| acceptable_fit | big_fish | B | fly | medium_confidence_archive | 175 |
| acceptable_fit | big_fish | B | lure | medium_confidence_archive | 168 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 90 |
| acceptable_fit | all_purpose | B | fly | medium_confidence_archive | 89 |
| acceptable_fit | big_fish | B | fly | stable_pleasant_medium_confidence_archive | 86 |
| acceptable_fit | big_fish | A | lure | medium_confidence_archive | 84 |
| acceptable_fit | big_fish | A | fly | medium_confidence_archive | 77 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 73 |
| acceptable_fit | all_purpose | A | lure | medium_confidence_archive | 72 |
| acceptable_fit | all_purpose | B | lure | medium_confidence_archive | 67 |
| acceptable_fit | big_fish | B | lure | stable_pleasant_medium_confidence_archive | 65 |
| acceptable_fit | all_purpose | B | lure | stable_pleasant_medium_confidence_archive | 57 |
| acceptable_fit | all_purpose | A | lure | stable_pleasant_medium_confidence_archive | 56 |
| acceptable_fit | all_purpose | A | fly | medium_confidence_archive | 55 |
| acceptable_fit | big_fish | A | fly | stable_pleasant_medium_confidence_archive | 53 |
| acceptable_fit | all_purpose | B | fly | stable_pleasant_medium_confidence_archive | 51 |
| acceptable_fit | big_fish | A | lure | stable_pleasant_medium_confidence_archive | 50 |
| acceptable_fit | all_purpose | A | fly | stable_pleasant_medium_confidence_archive | 46 |
| acceptable_fit | all_purpose | B | fly | cold_slow_or_front | 31 |
| acceptable_fit | big_fish | A | lure | cold_slow_or_front | 25 |
| acceptable_fit | big_fish | B | lure | dirty_vibration | 25 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 4 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 4 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| Lake Champlain SMB water<br>2025-12-12 stained all_purpose A | Blade Bait (lure_of_the_day, lure, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained all_purpose A | Blade Bait (lure_of_the_day, lure, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dworshak / inland northwest SMB reservoir<br>2025-06-25 clear all_purpose A | Soft Plastic Jerkbait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 dirty all_purpose B | Blade Bait (lure_of_the_day, lure, score 190) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 stained all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-09-29 clear all_purpose A | Crawfish Streamer (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-09-29 clear big_fish A | Big Smallmouth Tube (lure_of_the_day, lure, score 184) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 dirty all_purpose B | Deep-Diving Crankbait (honorable_lure, lure, score 180) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 dirty all_purpose A | Suspending Jerkbait (lure_of_the_day, lure, score 178) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 stained all_purpose A | Jighead Marabou Leech (honorable_fly, fly, score 172) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained all_purpose A | Rabbit-Strip Leech (honorable_fly, fly, score 172) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dworshak / inland northwest SMB reservoir<br>2025-06-25 clear all_purpose A | Foam Gurgler (fly_of_the_day, fly, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>calm_surface+low_light_surface+clear_subtle+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dworshak / inland northwest SMB reservoir<br>2025-06-25 clear all_purpose B | Drop-Shot Minnow (honorable_lure, lure, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 stained all_purpose A | Inline Spinner (honorable_lure, lure, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-05-10 stained all_purpose B | Warmwater Crawfish Fly (fly_of_the_day, fly, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>low_light_surface+wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 dirty all_purpose B | Medium-Diving Crankbait (lure_of_the_day, lure, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 dirty big_fish A | Football Jig (honorable_lure, lure, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 stained all_purpose A | Zonker Streamer (fly_of_the_day, fly, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-12-12 stained big_fish A | Football Jig (honorable_lure, lure, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 dirty big_fish A | Football Jig (honorable_lure, lure, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 1008 | 459 | 46% |
| clear_subtle | 400 | 216 | 54% |
| dirty_vibration | 832 | 90 | 11% |
| heat_finesse | 0 | 0 |  |
| cold_slow | 960 | 612 | 64% |
| low_light_surface | 288 | 84 | 29% |
| calm_surface | 432 | 109 | 25% |
| Big Fish upside | 1224 | 908 | 74% |
| All Purpose reliable/versatile | 1224 | 1220 | 100% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Game Changer [fly] (161), Articulated Baitfish Streamer [fly] (149), Rabbit-Strip Leech [fly] (139), Big Smallmouth Tube [lure] (120), Medium-Diving Crankbait [lure] (110), Suspending Jerkbait [lure] (98), Clouser Minnow [fly] (92), Inline Spinner [lure] (88), Tube Jig [lure] (87), Deceiver [fly] (84), Baitfish Slider Fly [fly] (83), Football Jig [lure] (80) |
| All-purpose | Clouser Minnow [fly] (90), Suspending Jerkbait [lure] (86), Inline Spinner [lure] (76), Tube Jig [lure] (67), Medium-Diving Crankbait [lure] (63), Deceiver [fly] (60), Baitfish Slider Fly [fly] (50), Zonker Streamer [fly] (50) |
| Big-fish | Game Changer [fly] (135), Articulated Baitfish Streamer [fly] (130), Rabbit-Strip Leech [fly] (121), Big Smallmouth Tube [lure] (120), Football Jig [lure] (80), Magnum Jerkbait [lure] (80), Compact Glide Bait [lure] (64), Medium-Diving Crankbait [lure] (47) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 30 | 30 | 0 | 2 | 0 |
| fly | 24 | 24 | 0 | 2 | 1 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 161/612 | 26.3% | big_fish:135, all_purpose:26 | B:85, A:76 | honorable:89, top:72 | clear:58, dirty:58, stained:45 | freshwater_lake_pond:130, freshwater_river:31 | wind_reaction:62, cold_slow:49, dirty_vibration:44, calm_surface:30 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 149/612 | 24.3% | big_fish:130, all_purpose:19 | A:90, B:59 | honorable:79, top:70 | dirty:54, stained:54, clear:41 | freshwater_lake_pond:127, freshwater_river:22 | wind_reaction:57, cold_slow:51, dirty_vibration:45, calm_surface:29 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 139/612 | 22.7% | big_fish:121, all_purpose:18 | A:78, B:61 | honorable:100, top:39 | stained:57, dirty:50, clear:32 | freshwater_lake_pond:113, freshwater_river:26 | cold_slow:76, wind_reaction:60, dirty_vibration:48, none:16 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 120/540 | 22.2% | big_fish:120 | A:80, B:40 | honorable:74, top:46 | clear:43, stained:42, dirty:35 | freshwater_lake_pond:87, freshwater_river:33 | cold_slow:45, wind_reaction:40, dirty_vibration:33, calm_surface:26 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 110/612 | 18% | all_purpose:63, big_fish:47 | B:67, A:43 | top:79, honorable:31 | dirty:46, stained:39, clear:25 | freshwater_lake_pond:98, freshwater_river:12 | wind_reaction:85, dirty_vibration:66, cold_slow:30, open_water_search:26 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 98/612 | 16% | all_purpose:86, big_fish:12 | A:50, B:48 | top:56, honorable:42 | dirty:35, stained:34, clear:29 | freshwater_lake_pond:82, freshwater_river:16 | wind_reaction:66, dirty_vibration:49, cold_slow:43, open_water_search:15 |
| Clouser Minnow<br>clouser_minnow | fly | 92/612 | 15% | all_purpose:90, big_fish:2 | B:67, A:25 | honorable:60, top:32 | stained:36, clear:33, dirty:23 | freshwater_lake_pond:75, freshwater_river:17 | wind_reaction:26, cold_slow:22, dirty_vibration:22, calm_surface:20 |
| Inline Spinner<br>inline_spinner | lure | 88/612 | 14.4% | all_purpose:76, big_fish:12 | B:51, A:37 | top:46, honorable:42 | stained:37, dirty:29, clear:22 | freshwater_lake_pond:70, freshwater_river:18 | wind_reaction:55, dirty_vibration:45, cold_slow:20, open_water_search:19 |
| Tube Jig<br>tube_jig | lure | 87/612 | 14.2% | all_purpose:67, big_fish:20 | A:46, B:41 | top:62, honorable:25 | clear:46, stained:30, dirty:11 | freshwater_lake_pond:57, freshwater_river:30 | cold_slow:63, wind_reaction:28, clear_subtle:27, dirty_vibration:14 |
| Deceiver<br>deceiver | fly | 84/612 | 13.7% | all_purpose:60, big_fish:24 | B:43, A:41 | top:63, honorable:21 | dirty:35, stained:32, clear:17 | freshwater_lake_pond:79, freshwater_river:5 | wind_reaction:71, dirty_vibration:57, cold_slow:28, open_water_search:26 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 83/480 | 17.3% | all_purpose:50, big_fish:33 | A:48, B:35 | honorable:48, top:35 | dirty:36, stained:30, clear:17 | freshwater_lake_pond:80, freshwater_river:3 | wind_reaction:63, dirty_vibration:49, cold_slow:17, open_water_search:14 |
| Football Jig<br>football_jig | lure | 80/468 | 17.1% | big_fish:80 | A:45, B:35 | honorable:56, top:24 | dirty:31, clear:29, stained:20 | freshwater_lake_pond:80 | cold_slow:42, wind_reaction:41, dirty_vibration:25, clear_subtle:13 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 80/360 | 22.2% | big_fish:80 | A:49, B:31 | honorable:51, top:29 | clear:30, stained:27, dirty:23 | freshwater_lake_pond:57, freshwater_river:23 | cold_slow:41, wind_reaction:28, dirty_vibration:21, clear_subtle:14 |
| Zonker Streamer<br>zonker_streamer | fly | 66/612 | 10.8% | all_purpose:50, big_fish:16 | B:41, A:25 | top:53, honorable:13 | dirty:26, stained:24, clear:16 | freshwater_lake_pond:62, freshwater_river:4 | wind_reaction:59, dirty_vibration:47, cold_slow:20, open_water_search:19 |
| Compact Glide Bait<br>compact_glidebait | lure | 64/300 | 21.3% | big_fish:64 | A:45, B:19 | honorable:37, top:27 | clear:23, stained:22, dirty:19 | freshwater_lake_pond:64 | wind_reaction:24, calm_surface:17, dirty_vibration:15, clear_subtle:14 |
| Woolly Bugger<br>woolly_bugger | fly | 55/612 | 9% | all_purpose:47, big_fish:8 | A:28, B:27 | honorable:36, top:19 | clear:19, dirty:19, stained:17 | freshwater_lake_pond:48, freshwater_river:7 | cold_slow:46, wind_reaction:17, dirty_vibration:12, clear_subtle:9 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 49/348 | 14.1% | all_purpose:36, big_fish:13 | B:26, A:23 | top:30, honorable:19 | clear:23, stained:15, dirty:11 | freshwater_lake_pond:49 | cold_slow:32, clear_subtle:15, wind_reaction:13, none:7 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 41/612 | 6.7% | all_purpose:38, big_fish:3 | A:21, B:20 | top:22, honorable:19 | clear:19, stained:12, dirty:10 | freshwater_lake_pond:33, freshwater_river:8 | cold_slow:36, wind_reaction:18, dirty_vibration:8, clear_subtle:7 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 41/480 | 8.5% | all_purpose:41 | A:24, B:17 | honorable:23, top:18 | clear:22, stained:12, dirty:7 | freshwater_lake_pond:31, freshwater_river:10 | calm_surface:15, clear_subtle:14, cold_slow:8, low_light_surface:7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 39/612 | 6.4% | all_purpose:33, big_fish:6 | B:20, A:19 | top:21, honorable:18 | clear:26, dirty:9, stained:4 | freshwater_lake_pond:34, freshwater_river:5 | clear_subtle:22, cold_slow:22, wind_reaction:8, calm_surface:3 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 38/612 | 6.2% | all_purpose:31, big_fish:7 | B:20, A:18 | honorable:25, top:13 | clear:19, stained:10, dirty:9 | freshwater_lake_pond:27, freshwater_river:11 | cold_slow:31, clear_subtle:11, wind_reaction:9, none:3 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 37/168 | 22% | big_fish:37 | A:20, B:17 | honorable:21, top:16 | dirty:14, clear:12, stained:11 | freshwater_river:23, freshwater_lake_pond:14 | cold_slow:28, wind_reaction:17, dirty_vibration:16, current_swing:7 |
| Bladed Jig<br>bladed_jig | lure | 36/612 | 5.9% | all_purpose:24, big_fish:12 | B:19, A:17 | top:24, honorable:12 | dirty:21, stained:15 | freshwater_river:20, freshwater_lake_pond:16 | dirty_vibration:30, current_swing:16, wind_reaction:14, calm_surface:8 |
| Deer Hair Slider<br>deer_hair_slider | fly | 36/228 | 15.8% | big_fish:36 | A:25, B:11 | top:21, honorable:15 | clear:12, dirty:12, stained:12 | freshwater_lake_pond:24, freshwater_river:12 | calm_surface:27, low_light_surface:18, current_swing:9, dirty_vibration:8 |
| Ned Rig<br>ned_rig | lure | 35/612 | 5.7% | all_purpose:29, big_fish:6 | B:31, A:4 | honorable:24, top:11 | clear:15, dirty:12, stained:8 | freshwater_lake_pond:23, freshwater_river:12 | cold_slow:28, clear_subtle:10, wind_reaction:7, dirty_vibration:3 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 34/228 | 14.9% | all_purpose:32, big_fish:2 | B:21, A:13 | top:25, honorable:9 | clear:13, dirty:12, stained:9 | freshwater_lake_pond:24, freshwater_river:10 | calm_surface:27, low_light_surface:15, clear_subtle:8, current_swing:7 |
| Walking Topwater<br>walking_topwater | lure | 33/228 | 14.5% | big_fish:32, all_purpose:1 | B:18, A:15 | top:25, honorable:8 | clear:13, stained:11, dirty:9 | freshwater_lake_pond:21, freshwater_river:12 | calm_surface:25, low_light_surface:16, current_swing:9, clear_subtle:7 |
| Lipless Crankbait<br>lipless_crankbait | lure | 32/612 | 5.2% | all_purpose:20, big_fish:12 | B:18, A:14 | honorable:17, top:15 | stained:19, dirty:13 | freshwater_lake_pond:30, freshwater_river:2 | dirty_vibration:28, wind_reaction:28, open_water_search:20, cold_slow:6 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 32/468 | 6.8% | all_purpose:27, big_fish:5 | B:20, A:12 | honorable:18, top:14 | clear:19, stained:11, dirty:2 | freshwater_lake_pond:32 | cold_slow:26, wind_reaction:14, clear_subtle:11, open_water_search:7 |
| Sculpzilla<br>sculpzilla | fly | 31/144 | 21.5% | big_fish:31 | A:20, B:11 | top:19, honorable:12 | dirty:12, stained:10, clear:9 | freshwater_river:31 | current_swing:15, dirty_vibration:12, cold_slow:10, calm_surface:9 |
| Spinnerbait<br>spinnerbait | lure | 28/612 | 4.6% | all_purpose:17, big_fish:11 | A:16, B:12 | honorable:19, top:9 | dirty:18, stained:10 | freshwater_lake_pond:15, freshwater_river:13 | dirty_vibration:28, wind_reaction:15, current_swing:13, cold_slow:7 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 27/468 | 5.8% | all_purpose:14, big_fish:13 | B:17, A:10 | honorable:16, top:11 | dirty:19, stained:5, clear:3 | freshwater_lake_pond:27 | cold_slow:12, none:11, wind_reaction:4, calm_surface:3 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 26/480 | 5.4% | all_purpose:17, big_fish:9 | B:17, A:9 | top:14, honorable:12 | clear:21, stained:3, dirty:2 | freshwater_lake_pond:23, freshwater_river:3 | clear_subtle:19, wind_reaction:8, calm_surface:7, warming_search:4 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 25/612 | 4.1% | all_purpose:21, big_fish:4 | A:14, B:11 | honorable:18, top:7 | clear:13, stained:9, dirty:3 | freshwater_lake_pond:14, freshwater_river:11 | clear_subtle:11, calm_surface:10, none:9, low_light_surface:4 |
| Finesse Jig<br>finesse_jig | lure | 25/612 | 4.1% | all_purpose:22, big_fish:3 | B:17, A:8 | honorable:13, top:12 | clear:13, stained:8, dirty:4 | freshwater_lake_pond:14, freshwater_river:11 | cold_slow:17, clear_subtle:7, wind_reaction:6, none:4 |
| Buzzbait<br>buzzbait | lure | 25/228 | 11% | big_fish:22, all_purpose:3 | A:13, B:12 | top:18, honorable:7 | dirty:12, stained:8, clear:5 | freshwater_river:14, freshwater_lake_pond:11 | low_light_surface:18, calm_surface:15, current_swing:12, dirty_vibration:11 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 24/480 | 5% | all_purpose:17, big_fish:7 | B:15, A:9 | honorable:14, top:10 | dirty:15, stained:8, clear:1 | freshwater_lake_pond:13, freshwater_river:11 | dirty_vibration:21, current_swing:11, wind_reaction:11, calm_surface:5 |
| Blade Bait<br>blade_bait | lure | 22/612 | 3.6% | all_purpose:14, big_fish:8 | A:12, B:10 | top:16, honorable:6 | dirty:10, clear:7, stained:5 | freshwater_lake_pond:18, freshwater_river:4 | cold_slow:18, wind_reaction:13, open_water_search:11, dirty_vibration:6 |
| Popper Fly<br>popper_fly | fly | 20/228 | 8.8% | all_purpose:20 | B:12, A:8 | top:16, honorable:4 | stained:11, clear:5, dirty:4 | freshwater_lake_pond:16, freshwater_river:4 | calm_surface:16, low_light_surface:9, current_swing:3, dirty_vibration:3 |
| Sculpin Streamer<br>sculpin_streamer | fly | 20/144 | 13.9% | all_purpose:20 | B:14, A:6 | top:13, honorable:7 | stained:8, clear:7, dirty:5 | freshwater_river:20 | cold_slow:13, dirty_vibration:8, current_swing:7, wind_reaction:5 |
| Muddler Minnow<br>muddler_sculpin | fly | 19/144 | 13.2% | all_purpose:18, big_fish:1 | A:14, B:5 | top:13, honorable:6 | clear:10, stained:6, dirty:3 | freshwater_river:19 | cold_slow:11, current_swing:6, clear_subtle:5, dirty_vibration:4 |
| Wake Bait<br>wake_bait | lure | 18/168 | 10.7% | big_fish:18 | B:12, A:6 | top:14, honorable:4 | stained:7, clear:6, dirty:5 | freshwater_lake_pond:18 | calm_surface:14, low_light_surface:8, clear_subtle:4, warming_search:3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 18/144 | 12.5% | all_purpose:17, big_fish:1 | A:9, B:9 | honorable:10, top:8 | clear:10, dirty:5, stained:3 | freshwater_river:18 | clear_subtle:7, current_swing:6, cold_slow:5, dirty_vibration:5 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 14/612 | 2.3% | all_purpose:12, big_fish:2 | B:8, A:6 | honorable:10, top:4 | dirty:7, clear:5, stained:2 | freshwater_lake_pond:10, freshwater_river:4 | calm_surface:4, warming_search:4, low_light_surface:3, none:3 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 12/480 | 2.5% | big_fish:9, all_purpose:3 | B:10, A:2 | top:11, honorable:1 | clear:5, stained:4, dirty:3 | freshwater_river:8, freshwater_lake_pond:4 | cold_slow:7, clear_subtle:4, calm_surface:3, current_swing:1 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 12/156 | 7.7% | all_purpose:12 | A:8, B:4 | honorable:9, top:3 | clear:6, dirty:4, stained:2 | freshwater_lake_pond:10, freshwater_river:2 | calm_surface:5, clear_subtle:5, none:3, low_light_surface:2 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 11/120 | 9.2% | all_purpose:9, big_fish:2 | B:7, A:4 | honorable:6, top:5 | clear:5, dirty:4, stained:2 | freshwater_river:11 | current_swing:8, calm_surface:5, clear_subtle:4, dirty_vibration:4 |
| Feather Jig Leech<br>feather_jig_leech | fly | 9/612 | 1.5% | all_purpose:8, big_fish:1 | A:6, B:3 | honorable:6, top:3 | clear:3, dirty:3, stained:3 | freshwater_lake_pond:5, freshwater_river:4 | warming_search:8, current_swing:4, dirty_vibration:2, calm_surface:1 |
| Hair Jig<br>hair_jig | lure | 8/144 | 5.6% | all_purpose:5, big_fish:3 | B:5, A:3 | honorable:4, top:4 | clear:6, stained:2 | freshwater_river:8 | current_swing:6, clear_subtle:3, cold_slow:3, calm_surface:2 |
| Swim Jig<br>swim_jig | lure | 6/612 | 1% | all_purpose:6 | A:3, B:3 | honorable:4, top:2 | dirty:4, clear:1, stained:1 | freshwater_lake_pond:4, freshwater_river:2 | calm_surface:4, warming_search:2, current_swing:1, low_light_surface:1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3/144 | 2.1% | all_purpose:2, big_fish:1 | A:2, B:1 | top:3 | stained:3 | freshwater_river:3 | dirty_vibration:3, cold_slow:2, wind_reaction:2, current_swing:1 |
| Conehead Streamer<br>conehead_streamer | fly | 2/144 | 1.4% | all_purpose:2 | A:2 | honorable:2 | dirty:1, stained:1 | freshwater_river:2 | cold_slow:2, dirty_vibration:2, wind_reaction:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 2/132 | 1.5% | all_purpose:1, big_fish:1 | A:1, B:1 | honorable:1, top:1 | dirty:2 | freshwater_lake_pond:1, freshwater_river:1 | none:2 |
| Glide Bait<br>glidebait | lure | 2/36 | 5.6% | big_fish:2 | A:2 | honorable:1, top:1 | clear:2 | freshwater_lake_pond:2 | wind_reaction:2 |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 161/2448 (6.6%) | 72/1224 (5.9%) | 89/1224 (7.3%) | - | 161/1224 (13.2%) |  |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 149/2448 (6.1%) | 70/1224 (5.7%) | 79/1224 (6.5%) | - | 149/1224 (12.2%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 139/2448 (5.7%) | 39/1224 (3.2%) | 100/1224 (8.2%) | - | 139/1224 (11.4%) |  |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 120/2448 (4.9%) | 46/1224 (3.8%) | 74/1224 (6%) | 120/1224 (9.8%) | - |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 110/2448 (4.5%) | 79/1224 (6.5%) | 31/1224 (2.5%) | 110/1224 (9%) | - |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 98/2448 (4%) | 56/1224 (4.6%) | 42/1224 (3.4%) | 98/1224 (8%) | - |  |
| Clouser Minnow<br>clouser_minnow | fly | 92/2448 (3.8%) | 32/1224 (2.6%) | 60/1224 (4.9%) | - | 92/1224 (7.5%) |  |
| Inline Spinner<br>inline_spinner | lure | 88/2448 (3.6%) | 46/1224 (3.8%) | 42/1224 (3.4%) | 88/1224 (7.2%) | - |  |
| Tube Jig<br>tube_jig | lure | 87/2448 (3.6%) | 62/1224 (5.1%) | 25/1224 (2%) | 87/1224 (7.1%) | - |  |
| Deceiver<br>deceiver | fly | 84/2448 (3.4%) | 63/1224 (5.1%) | 21/1224 (1.7%) | - | 84/1224 (6.9%) |  |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 83/2448 (3.4%) | 35/1224 (2.9%) | 48/1224 (3.9%) | - | 83/1224 (6.8%) |  |
| Football Jig<br>football_jig | lure | 80/2448 (3.3%) | 24/1224 (2%) | 56/1224 (4.6%) | 80/1224 (6.5%) | - |  |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 80/2448 (3.3%) | 29/1224 (2.4%) | 51/1224 (4.2%) | 80/1224 (6.5%) | - |  |
| Zonker Streamer<br>zonker_streamer | fly | 66/2448 (2.7%) | 53/1224 (4.3%) | 13/1224 (1.1%) | - | 66/1224 (5.4%) |  |
| Compact Glide Bait<br>compact_glidebait | lure | 64/2448 (2.6%) | 27/1224 (2.2%) | 37/1224 (3%) | 64/1224 (5.2%) | - |  |
| Woolly Bugger<br>woolly_bugger | fly | 55/2448 (2.2%) | 19/1224 (1.6%) | 36/1224 (2.9%) | - | 55/1224 (4.5%) |  |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 49/2448 (2%) | 30/1224 (2.5%) | 19/1224 (1.6%) | - | 49/1224 (4%) |  |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 41/2448 (1.7%) | 22/1224 (1.8%) | 19/1224 (1.6%) | - | 41/1224 (3.3%) |  |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 41/2448 (1.7%) | 18/1224 (1.5%) | 23/1224 (1.9%) | 41/1224 (3.3%) | - |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 39/2448 (1.6%) | 21/1224 (1.7%) | 18/1224 (1.5%) | - | 39/1224 (3.2%) |  |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 38/2448 (1.6%) | 13/1224 (1.1%) | 25/1224 (2%) | 38/1224 (3.1%) | - |  |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 37/2448 (1.5%) | 16/1224 (1.3%) | 21/1224 (1.7%) | - | 37/1224 (3%) |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 36/2448 (1.5%) | 21/1224 (1.7%) | 15/1224 (1.2%) | - | 36/1224 (2.9%) |  |
| Bladed Jig<br>bladed_jig | lure | 36/2448 (1.5%) | 24/1224 (2%) | 12/1224 (1%) | 36/1224 (2.9%) | - |  |
| Ned Rig<br>ned_rig | lure | 35/2448 (1.4%) | 11/1224 (0.9%) | 24/1224 (2%) | 35/1224 (2.9%) | - |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 34/2448 (1.4%) | 25/1224 (2%) | 9/1224 (0.7%) | - | 34/1224 (2.8%) |  |
| Walking Topwater<br>walking_topwater | lure | 33/2448 (1.3%) | 25/1224 (2%) | 8/1224 (0.7%) | 33/1224 (2.7%) | - |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 32/2448 (1.3%) | 14/1224 (1.1%) | 18/1224 (1.5%) | 32/1224 (2.6%) | - |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 32/2448 (1.3%) | 15/1224 (1.2%) | 17/1224 (1.4%) | 32/1224 (2.6%) | - |  |
| Sculpzilla<br>sculpzilla | fly | 31/2448 (1.3%) | 19/1224 (1.6%) | 12/1224 (1%) | - | 31/1224 (2.5%) |  |
| Spinnerbait<br>spinnerbait | lure | 28/2448 (1.1%) | 9/1224 (0.7%) | 19/1224 (1.6%) | 28/1224 (2.3%) | - |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 27/2448 (1.1%) | 11/1224 (0.9%) | 16/1224 (1.3%) | 27/1224 (2.2%) | - |  |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 26/2448 (1.1%) | 14/1224 (1.1%) | 12/1224 (1%) | - | 26/1224 (2.1%) |  |
| Buzzbait<br>buzzbait | lure | 25/2448 (1%) | 18/1224 (1.5%) | 7/1224 (0.6%) | 25/1224 (2%) | - |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 25/2448 (1%) | 7/1224 (0.6%) | 18/1224 (1.5%) | 25/1224 (2%) | - |  |
| Finesse Jig<br>finesse_jig | lure | 25/2448 (1%) | 12/1224 (1%) | 13/1224 (1.1%) | 25/1224 (2%) | - |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 24/2448 (1%) | 10/1224 (0.8%) | 14/1224 (1.1%) | 24/1224 (2%) | - |  |
| Blade Bait<br>blade_bait | lure | 22/2448 (0.9%) | 16/1224 (1.3%) | 6/1224 (0.5%) | 22/1224 (1.8%) | - |  |
| Popper Fly<br>popper_fly | fly | 20/2448 (0.8%) | 16/1224 (1.3%) | 4/1224 (0.3%) | - | 20/1224 (1.6%) |  |
| Sculpin Streamer<br>sculpin_streamer | fly | 20/2448 (0.8%) | 13/1224 (1.1%) | 7/1224 (0.6%) | - | 20/1224 (1.6%) |  |
| Muddler Minnow<br>muddler_sculpin | fly | 19/2448 (0.8%) | 13/1224 (1.1%) | 6/1224 (0.5%) | - | 19/1224 (1.6%) |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 18/2448 (0.7%) | 8/1224 (0.7%) | 10/1224 (0.8%) | - | 18/1224 (1.5%) |  |
| Wake Bait<br>wake_bait | lure | 18/2448 (0.7%) | 14/1224 (1.1%) | 4/1224 (0.3%) | 18/1224 (1.5%) | - |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 14/2448 (0.6%) | 4/1224 (0.3%) | 10/1224 (0.8%) | 14/1224 (1.1%) | - |  |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 12/2448 (0.5%) | 11/1224 (0.9%) | 1/1224 (0.1%) | 12/1224 (1%) | - |  |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 12/2448 (0.5%) | 3/1224 (0.2%) | 9/1224 (0.7%) | 12/1224 (1%) | - |  |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 11/2448 (0.4%) | 5/1224 (0.4%) | 6/1224 (0.5%) | - | 11/1224 (0.9%) |  |
| Feather Jig Leech<br>feather_jig_leech | fly | 9/2448 (0.4%) | 3/1224 (0.2%) | 6/1224 (0.5%) | - | 9/1224 (0.7%) |  |
| Hair Jig<br>hair_jig | lure | 8/2448 (0.3%) | 4/1224 (0.3%) | 4/1224 (0.3%) | 8/1224 (0.7%) | - |  |
| Swim Jig<br>swim_jig | lure | 6/2448 (0.2%) | 2/1224 (0.2%) | 4/1224 (0.3%) | 6/1224 (0.5%) | - |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3/2448 (0.1%) | 3/1224 (0.2%) | 0/1224 (0%) | - | 3/1224 (0.2%) |  |
| Conehead Streamer<br>conehead_streamer | fly | 2/2448 (0.1%) | 0/1224 (0%) | 2/1224 (0.2%) | - | 2/1224 (0.2%) |  |
| Glide Bait<br>glidebait | lure | 2/2448 (0.1%) | 1/1224 (0.1%) | 1/1224 (0.1%) | 2/1224 (0.2%) | - |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 2/2448 (0.1%) | 1/1224 (0.1%) | 1/1224 (0.1%) | 2/1224 (0.2%) | - |  |

## Zero-Selected Eligible Profiles

None.

## Low-Use Eligible Profiles

| Profile | Gear | Selected/Opp | Rate | Close opp | Far-behind opp | Available tags | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Swim Jig<br>swim_jig | lure | 6/612 | 1% | 64 | 482 | wind_reaction:252, cold_slow:240, dirty_vibration:208, calm_surface:108, clear_subtle:100 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):16, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):15, Buzzbait (top), Big Smallmouth Tube (honorable):14, Inline Spinner (top), Suspending Jerkbait (honorable):14 |
| Conehead Streamer<br>conehead_streamer | fly | 2/144 | 1.4% | 34 | 69 | cold_slow:60, current_swing:60, dirty_vibration:56, calm_surface:36, clear_subtle:24 | Sculpzilla (top), Deer Hair Slider (honorable):6, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):5, Sculpzilla (top), Articulated Dungeon Streamer (honorable):5, Articulated Baitfish Streamer (top), Game Changer (honorable):4 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 2/132 | 1.5% | 38 | 64 | cold_slow:96, wind_reaction:72, dirty_vibration:48, open_water_search:36, clear_subtle:20 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):7, Tube Jig (top), Ned Rig (honorable):5, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):5, Finesse Jig (top), Ned Rig (honorable):4 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3/144 | 2.1% | 34 | 66 | cold_slow:60, current_swing:60, dirty_vibration:56, calm_surface:36, clear_subtle:24 | Sculpzilla (top), Deer Hair Slider (honorable):6, Articulated Baitfish Streamer (top), Rabbit-Strip Leech (honorable):5, Sculpzilla (top), Articulated Dungeon Streamer (honorable):5, Articulated Baitfish Streamer (top), Game Changer (honorable):4 |

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 161/612 | 26.3% | big_fish:135, all_purpose:26 | wind_reaction:62, cold_slow:49, dirty_vibration:44, calm_surface:30, clear_subtle:27 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Magnum Jerkbait<br>magnum_jerkbait | lure | home-window >30% severe | 41/84 | 48.8% | selector_filtering_variety_jitter:28 | AP/BF 0/0, 41/84<br>clarity clear:48, stained:36<br>bucket cold_slow_or_front:46, breezy_windy_stained_reaction:14, warming_search:10 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | home-window >30% severe | 74/240 | 30.8% | goal_tags:93 | AP/BF 41/120, 33/120<br>clarity dirty:120, stained:120<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, stable_pleasant_medium_confidence_archive:32 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | home-window >25% overdominant | 28/104 | 26.9% | goal_tags:46 | AP/BF 20/52, 8/52<br>clarity clear:84, stained:20<br>bucket cold_slow_or_front:60, stable_pleasant_medium_confidence_archive:20, calm_bright_clear_subtle:16 |
| Deer Hair Slider<br>deer_hair_slider | fly | home-window >20% watch | 36/144 | 25% | goal_tags:73 | AP/BF 0/72, 36/72<br>clarity clear:48, dirty:48, stained:48<br>bucket stable_pleasant_medium_confidence_archive:64, calm_low_light_surface:36, cold_slow_or_front:16 |
| Game Changer<br>game_changer | fly | home-window >20% watch | 75/312 | 24% | goal_tags:99 | AP/BF 12/156, 63/156<br>clarity clear:104, dirty:104, stained:104<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, cold_slow_or_front:64 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | home-window >20% watch | 89/376 | 23.7% | forage_clarity_stack:115 | AP/BF 18/188, 71/188<br>clarity clear:168, stained:112, dirty:96<br>bucket cold_slow_or_front:180, dirty_vibration:56, stable_pleasant_medium_confidence_archive:52 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | home-window >20% watch | 85/360 | 23.6% | goal_tags:211 | AP/BF 0/180, 85/180<br>clarity clear:180, stained:180<br>bucket stable_pleasant_medium_confidence_archive:116, cold_slow_or_front:112, breezy_windy_stained_reaction:68 |
| Walking Topwater<br>walking_topwater | lure | home-window >20% watch | 33/144 | 22.9% | goal_tags:71 | AP/BF 1/72, 32/72<br>clarity clear:48, dirty:48, stained:48<br>bucket stable_pleasant_medium_confidence_archive:64, calm_low_light_surface:36, cold_slow_or_front:16 |
| Sculpzilla<br>sculpzilla | fly | home-window >20% watch | 28/132 | 21.2% | goal_tags:69 | AP/BF 0/66, 28/66<br>clarity clear:48, stained:48, dirty:36<br>bucket cold_slow_or_front:48, stable_pleasant_medium_confidence_archive:28, dirty_vibration:24 |
| Football Jig<br>football_jig | lure | home-window >20% watch | 31/152 | 20.4% | goal_tags:92 | AP/BF 0/76, 31/76<br>clarity clear:120, stained:32<br>bucket cold_slow_or_front:104, stable_pleasant_medium_confidence_archive:24, calm_bright_clear_subtle:16 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | home-window >20% watch | 63/312 | 20.2% | daily_condition_tags:104 | AP/BF 3/156, 60/156<br>clarity clear:104, dirty:104, stained:104<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, cold_slow_or_front:64 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 80/2448 (3.3%) | 29/1224 (2.4%) | 51/1224 (4.2%) | 80/1224 (6.5%) | 41/84 (48.8%) | 17/84 (20.2%) / 24/84 (28.6%) | home>20%<br>home>25%<br>home>30% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 110/2448 (4.5%) | 79/1224 (6.5%) | 31/1224 (2.5%) | 110/1224 (9%) | 74/240 (30.8%) | 59/240 (24.6%) / 15/240 (6.3%) | home>20%<br>home>25%<br>home>30% |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 49/2448 (2%) | 30/1224 (2.5%) | 19/1224 (1.6%) | 49/1224 (4%) | 28/104 (26.9%) | 23/104 (22.1%) / 5/104 (4.8%) | home>20%<br>home>25% |
| Deer Hair Slider<br>deer_hair_slider | fly | 36/2448 (1.5%) | 21/1224 (1.7%) | 15/1224 (1.2%) | 36/1224 (2.9%) | 36/144 (25%) | 21/144 (14.6%) / 15/144 (10.4%) | home>20% |
| Game Changer<br>game_changer | fly | 161/2448 (6.6%) | 72/1224 (5.9%) | 89/1224 (7.3%) | 161/1224 (13.2%) | 75/312 (24%) | 29/312 (9.3%) / 46/312 (14.7%) | home>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 139/2448 (5.7%) | 39/1224 (3.2%) | 100/1224 (8.2%) | 139/1224 (11.4%) | 89/376 (23.7%) | 32/376 (8.5%) / 57/376 (15.2%) | home>20% |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 120/2448 (4.9%) | 46/1224 (3.8%) | 74/1224 (6%) | 120/1224 (9.8%) | 85/360 (23.6%) | 35/360 (9.7%) / 50/360 (13.9%) | home>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 34/2448 (1.4%) | 25/1224 (2%) | 9/1224 (0.7%) | 34/1224 (2.8%) | 34/144 (23.6%) | 25/144 (17.4%) / 9/144 (6.3%) | home>20% |
| Walking Topwater<br>walking_topwater | lure | 33/2448 (1.3%) | 25/1224 (2%) | 8/1224 (0.7%) | 33/1224 (2.7%) | 33/144 (22.9%) | 25/144 (17.4%) / 8/144 (5.6%) | home>20% |
| Deceiver<br>deceiver | fly | 84/2448 (3.4%) | 63/1224 (5.1%) | 21/1224 (1.7%) | 84/1224 (6.9%) | 71/312 (22.8%) | 58/312 (18.6%) / 13/312 (4.2%) | home>20% |
| Sculpzilla<br>sculpzilla | fly | 31/2448 (1.3%) | 19/1224 (1.6%) | 12/1224 (1%) | 31/1224 (2.5%) | 28/132 (21.2%) | 18/132 (13.6%) / 10/132 (7.6%) | home>20% |
| Football Jig<br>football_jig | lure | 80/2448 (3.3%) | 24/1224 (2%) | 56/1224 (4.6%) | 80/1224 (6.5%) | 31/152 (20.4%) | 11/152 (7.2%) / 20/152 (13.2%) | home>20% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 149/2448 (6.1%) | 70/1224 (5.7%) | 79/1224 (6.5%) | 149/1224 (12.2%) | 63/312 (20.2%) | 25/312 (8%) / 38/312 (12.2%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 3.14.
Average expanded finalist pool size: 4.06.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 758.
Rows/slots with expanded finalist pool size 1: 359.
Selected-tier singleton slots expanded above 1: 399.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.53 | 3.82 | 1 | 1 | 241 | 94 |
| fly/top | 2.82 | 3.81 | 1 | 1 | 225 | 102 |
| lure/honorable | 3.47 | 4.31 | 1 | 1 | 147 | 81 |
| lure/top | 3.75 | 4.32 | 1 | 1 | 145 | 82 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1379 |
| goal_or_priority_condition | 1020 |
| credible_fallback | 49 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 1630 |
| goal_and_priority_condition | 1379 |
| credible_fallback | 208 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 159 |
| family_diversity_scarcity | 154 |
| surface_safety_scarcity | 46 |

Representative expanded singleton finalist pools:
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__all_purpose__B fly/top: woolly_bugger (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B fly/top: articulated_baitfish_streamer (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B fly/top: woolly_bugger (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__B fly/honorable: articulated_dungeon_streamer (goal_or_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__all_purpose__B fly/top: lead_eye_leech (goal_and_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__all_purpose__B fly/honorable: sculpin_streamer (goal_or_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__big_fish__B fly/honorable: sculpzilla (goal_or_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__all_purpose__B fly/top: crawfish_streamer (goal_or_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__dirty__all_purpose__B fly/top: crawfish_streamer (goal_or_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__dirty__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__dirty__big_fish__B fly/honorable: sculpin_streamer (credible_fallback; family_diversity_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__all_purpose__B fly/honorable: zonker_streamer (goal_and_priority_condition; family_diversity_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__all_purpose__B fly/honorable: zonker_streamer (goal_and_priority_condition; family_diversity_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B fly/honorable: articulated_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__all_purpose__B fly/top: woolly_bugger (goal_and_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__big_fish__A lure/top: football_jig (goal_and_priority_condition; hard_gated_scarcity)
- mo_table_rock__2025-02-20__freshwater_lake_pond__clear__all_purpose__A fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 5.23 |
| Different-presentation close candidates | 1.84 |
| Different-family close candidates | 2.75 |
| Final expanded Set B pool | 2.55 |
| Same-family/same-presentation reintroduced | 82/1224 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 208 |
| Coverage pool used | 44 |
| Average used coverage pool size | 4.23 |
| Singleton used coverage pools | 2 |
| Broad pool larger than narrowed pool | 42 |
| Broad pool same as narrowed pool | 2 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 7 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 164 |
| broad | 44 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| spinnerbait | 34 |
| bladed_jig | 33 |
| inline_spinner | 29 |
| lipless_crankbait | 27 |
| medium_diving_crankbait | 22 |
| squarebill_crankbait | 21 |
| suspending_jerkbait | 19 |
| buzzbait | 1 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| lipless_crankbait | 6 |
| spinnerbait | 6 |
| squarebill_crankbait | 6 |
| big_smallmouth_tube | 5 |
| inline_spinner | 5 |
| magnum_jerkbait | 5 |
| bladed_jig | 4 |
| suspending_jerkbait | 4 |
| football_jig | 3 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, medium_diving_crankbait, spinnerbait
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__big_fish__A: Lipless Crankbait; pool bladed_jig, inline_spinner, lipless_crankbait, medium_diving_crankbait, spinnerbait, suspending_jerkbait
- wv_new_river_smb__2025-03-26__freshwater_river__stained__all_purpose__B: Lipless Crankbait; pool bladed_jig, inline_spinner, lipless_crankbait, medium_diving_crankbait, spinnerbait
- mn_mille_lacs__2025-09-20__freshwater_lake_pond__dirty__big_fish__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, squarebill_crankbait, suspending_jerkbait
- wi_door_county__2025-12-12__freshwater_lake_pond__dirty__big_fish__B: Lipless Crankbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait
- vt_champlain_smb__2025-12-12__freshwater_lake_pond__stained__big_fish__B: Lipless Crankbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait
- vt_champlain_smb__2025-12-12__freshwater_lake_pond__dirty__big_fish__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 1536 | 0 | 0 |
| caution | 336 | 0 | 4 |

Caution-gate surface finalist examples:
- co_yampa__2025-07-12__freshwater_river__stained__big_fish__B lure/honorable: buzzbait, walking_topwater
- co_yampa__2025-07-12__freshwater_river__dirty__big_fish__B lure/honorable: buzzbait, walking_topwater

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Foam Gurgler<br>foam_gurgler_fly | fly | largemouth_bass, smallmouth_bass, northern_pike | fly_gurgler | surface_fly_gurgler | surface<br>medium/slow | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 9 |
| Sculpin Streamer<br>sculpin_streamer | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: current_swing, cold_slow, runoff_streamer | 1: reliable_action | freshwater_river | false | 9 |
| Buzzbait<br>buzzbait | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_buzz | topwater_open | surface<br>fast/medium | 2: surface_prey, baitfish | 2: stained, dirty | 3: low_light_surface, wind_reaction, dirty_vibration | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 9 |
| Glide Bait<br>glidebait | lure | largemouth_bass, smallmouth_bass | hard_swimbait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 3: clear_subtle, open_water_search, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 9 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | largemouth_bass, smallmouth_bass | crankbait_medium | crankbait | mid<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | largemouth_bass, smallmouth_bass | soft_plastic_craw | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 4: cover_ambush, cold_slow, clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Wake Bait<br>wake_bait | lure | largemouth_bass, smallmouth_bass | surface_wake | topwater_open | surface<br>slow/medium | 3: surface_prey, baitfish, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Deer Hair Slider<br>deer_hair_slider | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_slider | surface_fly_slider | surface<br>medium/fast | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | true | 8 |
| Popper Fly<br>popper_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_popper | surface_fly_popper_slider | surface<br>medium/slow | 2: surface_prey, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 8 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | smallmouth_bass | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 8 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | largemouth_bass, smallmouth_bass, trout | soft_plastic_worm | worm_finesse | bottom<br>slow | 2: leech_worm, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 2: reliable_action, versatile_search | freshwater_lake_pond | false | 8 |
| Compact Glide Bait<br>compact_glidebait | lure | smallmouth_bass | hard_swimbait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Finesse Jig<br>finesse_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, leech_worm | 2: clear, stained | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Hair Jig<br>hair_jig | lure | smallmouth_bass, trout | hair_jig | hair_jig | bottom<br>slow/medium | 2: baitfish, leech_worm | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 8 |
| Inline Spinner<br>inline_spinner | lure | smallmouth_bass, trout, northern_pike | spinner | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | largemouth_bass, smallmouth_bass, northern_pike | swimbait | swimbait | mid<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Shaky-Head Worm<br>shaky_head_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Spinnerbait<br>spinnerbait | lure | largemouth_bass, smallmouth_bass, northern_pike | safety_pin_spinner | spinner_vibration | mid<br>medium/slow | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, dirty_vibration, cover_ambush | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
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
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
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
| Drop-Shot Minnow<br>drop_shot_minnow | lure | largemouth_bass, smallmouth_bass, trout | soft_plastic_minnow | drop_shot_minnow | mid<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Football Jig<br>football_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: cold_slow, cover_ambush | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | largemouth_bass, smallmouth_bass | jerkbait | jerkbait | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, open_water_search | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | largemouth_bass, smallmouth_bass, northern_pike | jerkbait_soft | jerkbait | upper<br>medium/slow | 1: baitfish | 2: clear, stained | 2: clear_subtle, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Swim Jig<br>swim_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_swimming | swim_jig | mid<br>medium/fast | 2: bluegill_perch, baitfish | 2: stained, dirty | 2: cover_ambush, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Tube Jig<br>tube_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Bladed Jig<br>bladed_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | bladed_jig | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: dirty_vibration, cover_ambush | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium | 1: baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 6 |
| Lipless Crankbait<br>lipless_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_lipless | crankbait | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | smallmouth_bass, trout | streamer_sparse | baitfish_streamer | upper<br>medium/fast | 1: baitfish | 1: clear | 2: clear_subtle, current_swing | 1: reliable_action | freshwater_river | false | 5 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 149/612 | 63/312 | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 37/168 | 0/0 | goal_tags>1 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 83/480 | 4/12 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 92/612 | 38/312 | goal_tags>1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 18/144 | 14/108 | clear+stained+dirty clarity |
| Deceiver<br>deceiver | fly | 7 | 84/612 | 71/312 | clear+stained+dirty clarity<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 36/228 | 36/144 | clear+stained+dirty clarity<br>home-window share>20% |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 9/612 | 0/0 | clear+stained+dirty clarity |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 34/228 | 34/144 | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Game Changer<br>game_changer | fly | 7 | 161/612 | 75/312 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20% |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 41/612 | 0/0 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 39/612 | 0/0 | clear+stained+dirty clarity |
| Popper Fly<br>popper_fly | fly | 8 | 20/228 | 20/144 | goal_tags>1 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 139/612 | 89/376 | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 20/144 | 15/108 | clear+stained+dirty clarity |
| Sculpzilla<br>sculpzilla | fly | 7 | 31/144 | 28/132 | home-window share>20% |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 49/348 | 28/104 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 55/612 | 48/288 | clear+stained+dirty clarity |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 8 | 120/540 | 85/360 | home-window share>20% |
| Blade Bait<br>blade_bait | lure | 7 | 22/612 | 11/248 | clear+stained+dirty clarity |
| Buzzbait<br>buzzbait | lure | 9 | 25/228 | 25/144 | goal_tags>1<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 32/468 | 22/144 | goal_tags>1 |
| Compact Glide Bait<br>compact_glidebait | lure | 8 | 64/300 | 0/0 | goal_tags>1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 27/468 | 2/176 | clear+stained+dirty clarity |
| Football Jig<br>football_jig | lure | 7 | 80/468 | 31/152 | clear+stained+dirty clarity<br>home-window share>20% |
| Glide Bait<br>glidebait | lure | 9 | 2/36 | 0/0 | goal_tags>1 |
| Inline Spinner<br>inline_spinner | lure | 8 | 88/612 | 9/56 | goal_tags>1 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7 | 80/360 | 41/84 | home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 9 | 110/612 | 74/240 | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Ned Rig<br>ned_rig | lure | 9 | 35/612 | 21/204 | clear+stained+dirty clarity |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 14/612 | 3/312 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 2/132 | 0/60 | clear+stained+dirty clarity |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 41/480 | 12/72 | goal_tags>1 |
| Spinnerbait<br>spinnerbait | lure | 8 | 28/612 | 28/240 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 24/480 | 21/192 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 98/612 | 28/212 | goal_tags>1 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 38/612 | 28/260 | condition_tags>3<br>clear+stained+dirty clarity |
| Wake Bait<br>wake_bait | lure | 9 | 18/168 | 18/96 | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Walking Topwater<br>walking_topwater | lure | 8 | 33/228 | 33/144 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 12/156 | 5/28 | clear+stained+dirty clarity<br>goal_tags>1 |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 7 | 161/612 (26.3%) | 75/312 (24%) | big_fish:135, all_purpose:26 | honorable:89, top:72 | wind_reaction:62, cold_slow:49, dirty_vibration:44, calm_surface:30, clear_subtle:27 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 7 | 149/612 (24.3%) | 63/312 (20.2%) | big_fish:130, all_purpose:19 | honorable:79, top:70 | wind_reaction:57, cold_slow:51, dirty_vibration:45, calm_surface:29, clear_subtle:21 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 139/612 (22.7%) | 89/376 (23.7%) | big_fish:121, all_purpose:18 | honorable:100, top:39 | cold_slow:76, wind_reaction:60, dirty_vibration:48, none:16, calm_surface:14 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 8 | 120/540 (22.2%) | 85/360 (23.6%) | big_fish:120 | honorable:74, top:46 | cold_slow:45, wind_reaction:40, dirty_vibration:33, calm_surface:26, clear_subtle:23 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 9 | 110/612 (18%) | 74/240 (30.8%) | all_purpose:63, big_fish:47 | top:79, honorable:31 | wind_reaction:85, dirty_vibration:66, cold_slow:30, open_water_search:26, warming_search:14 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 98/612 (16%) | 28/212 (13.2%) | all_purpose:86, big_fish:12 | top:56, honorable:42 | wind_reaction:66, dirty_vibration:49, cold_slow:43, open_water_search:15, calm_surface:13 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 92/612 (15%) | 38/312 (12.2%) | all_purpose:90, big_fish:2 | honorable:60, top:32 | wind_reaction:26, cold_slow:22, dirty_vibration:22, calm_surface:20, clear_subtle:16 |
| Inline Spinner<br>inline_spinner | lure | 8 | 88/612 (14.4%) | 9/56 (16.1%) | all_purpose:76, big_fish:12 | top:46, honorable:42 | wind_reaction:55, dirty_vibration:45, cold_slow:20, open_water_search:19, calm_surface:13 |
| Tube Jig<br>tube_jig | lure | 7 | 87/612 (14.2%) | 76/408 (18.6%) | all_purpose:67, big_fish:20 | top:62, honorable:25 | cold_slow:63, wind_reaction:28, clear_subtle:27, dirty_vibration:14, calm_surface:9 |
| Deceiver<br>deceiver | fly | 7 | 84/612 (13.7%) | 71/312 (22.8%) | all_purpose:60, big_fish:24 | top:63, honorable:21 | wind_reaction:71, dirty_vibration:57, cold_slow:28, open_water_search:26, none:8 |
| Baitfish Slider Fly<br>baitfish_slider_fly | fly | 9 | 83/480 (17.3%) | 4/12 (33.3%) | all_purpose:50, big_fish:33 | honorable:48, top:35 | wind_reaction:63, dirty_vibration:49, cold_slow:17, open_water_search:14, warming_search:13 |
| Football Jig<br>football_jig | lure | 7 | 80/468 (17.1%) | 31/152 (20.4%) | big_fish:80 | honorable:56, top:24 | cold_slow:42, wind_reaction:41, dirty_vibration:25, clear_subtle:13, none:11 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7 | 80/360 (22.2%) | 41/84 (48.8%) | big_fish:80 | honorable:51, top:29 | cold_slow:41, wind_reaction:28, dirty_vibration:21, clear_subtle:14, none:9 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 66/612 (10.8%) | 0/0 | all_purpose:50, big_fish:16 | top:53, honorable:13 | wind_reaction:59, dirty_vibration:47, cold_slow:20, open_water_search:19, warming_search:6 |
| Compact Glide Bait<br>compact_glidebait | lure | 8 | 64/300 (21.3%) | 0/0 | big_fish:64 | honorable:37, top:27 | wind_reaction:24, calm_surface:17, dirty_vibration:15, clear_subtle:14, cold_slow:14 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 55/612 (9%) | 48/288 (16.7%) | all_purpose:47, big_fish:8 | honorable:36, top:19 | cold_slow:46, wind_reaction:17, dirty_vibration:12, clear_subtle:9, current_swing:5 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 49/348 (14.1%) | 28/104 (26.9%) | all_purpose:36, big_fish:13 | top:30, honorable:19 | cold_slow:32, clear_subtle:15, wind_reaction:13, none:7, dirty_vibration:6 |
| Jighead Marabou Leech<br>jighead_marabou_leech | fly | 7 | 41/612 (6.7%) | 0/0 | all_purpose:38, big_fish:3 | top:22, honorable:19 | cold_slow:36, wind_reaction:18, dirty_vibration:8, clear_subtle:7, open_water_search:5 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 7 | 41/480 (8.5%) | 12/72 (16.7%) | all_purpose:41 | honorable:23, top:18 | calm_surface:15, clear_subtle:14, cold_slow:8, low_light_surface:7, none:6 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 39/612 (6.4%) | 0/0 | all_purpose:33, big_fish:6 | top:21, honorable:18 | clear_subtle:22, cold_slow:22, wind_reaction:8, calm_surface:3, dirty_vibration:3 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 38/612 (6.2%) | 28/260 (10.8%) | all_purpose:31, big_fish:7 | honorable:25, top:13 | cold_slow:31, clear_subtle:11, wind_reaction:9, none:3, dirty_vibration:2 |
| Articulated Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 37/168 (22%) | 0/0 | big_fish:37 | honorable:21, top:16 | cold_slow:28, wind_reaction:17, dirty_vibration:16, current_swing:7, open_water_search:5 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 36/228 (15.8%) | 36/144 (25%) | big_fish:36 | top:21, honorable:15 | calm_surface:27, low_light_surface:18, current_swing:9, dirty_vibration:8, clear_subtle:7 |
| Bladed Jig<br>bladed_jig | lure | 6 | 36/612 (5.9%) | 30/208 (14.4%) | all_purpose:24, big_fish:12 | top:24, honorable:12 | dirty_vibration:30, current_swing:16, wind_reaction:14, calm_surface:8, cold_slow:8 |
| Ned Rig<br>ned_rig | lure | 9 | 35/612 (5.7%) | 21/204 (10.3%) | all_purpose:29, big_fish:6 | honorable:24, top:11 | cold_slow:28, clear_subtle:10, wind_reaction:7, dirty_vibration:3, none:3 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 34/228 (14.9%) | 34/144 (23.6%) | all_purpose:32, big_fish:2 | top:25, honorable:9 | calm_surface:27, low_light_surface:15, clear_subtle:8, current_swing:7, dirty_vibration:6 |
| Walking Topwater<br>walking_topwater | lure | 8 | 33/228 (14.5%) | 33/144 (22.9%) | big_fish:32, all_purpose:1 | top:25, honorable:8 | calm_surface:25, low_light_surface:16, current_swing:9, clear_subtle:7, dirty_vibration:7 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 32/468 (6.8%) | 22/144 (15.3%) | all_purpose:27, big_fish:5 | honorable:18, top:14 | cold_slow:26, wind_reaction:14, clear_subtle:11, open_water_search:7, dirty_vibration:5 |
| Lipless Crankbait<br>lipless_crankbait | lure | 6 | 32/612 (5.2%) | 30/240 (12.5%) | all_purpose:20, big_fish:12 | honorable:17, top:15 | dirty_vibration:28, wind_reaction:28, open_water_search:20, cold_slow:6, calm_surface:3 |
| Sculpzilla<br>sculpzilla | fly | 7 | 31/144 (21.5%) | 28/132 (21.2%) | big_fish:31 | top:19, honorable:12 | current_swing:15, dirty_vibration:12, cold_slow:10, calm_surface:9, low_light_surface:6 |
| Spinnerbait<br>spinnerbait | lure | 8 | 28/612 (4.6%) | 28/240 (11.7%) | all_purpose:17, big_fish:11 | honorable:19, top:9 | dirty_vibration:28, wind_reaction:15, current_swing:13, cold_slow:7, calm_surface:5 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 27/468 (5.8%) | 2/176 (1.1%) | all_purpose:14, big_fish:13 | honorable:16, top:11 | cold_slow:12, none:11, wind_reaction:4, calm_surface:3, open_water_search:3 |
| Unweighted Baitfish Streamer<br>unweighted_baitfish_streamer | fly | 7 | 26/480 (5.4%) | 3/12 (25%) | all_purpose:17, big_fish:9 | top:14, honorable:12 | clear_subtle:19, wind_reaction:8, calm_surface:7, warming_search:4, open_water_search:3 |
| Buzzbait<br>buzzbait | lure | 9 | 25/228 (11%) | 25/144 (17.4%) | big_fish:22, all_purpose:3 | top:18, honorable:7 | low_light_surface:18, calm_surface:15, current_swing:12, dirty_vibration:11, clear_subtle:2 |
| Finesse Jig<br>finesse_jig | lure | 8 | 25/612 (4.1%) | 19/260 (7.3%) | all_purpose:22, big_fish:3 | honorable:13, top:12 | cold_slow:17, clear_subtle:7, wind_reaction:6, none:4, calm_surface:1 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 25/612 (4.1%) | 9/84 (10.7%) | all_purpose:21, big_fish:4 | honorable:18, top:7 | clear_subtle:11, calm_surface:10, none:9, low_light_surface:4, warming_search:3 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 24/480 (5%) | 21/192 (10.9%) | all_purpose:17, big_fish:7 | honorable:14, top:10 | dirty_vibration:21, current_swing:11, wind_reaction:11, calm_surface:5, cold_slow:5 |
| Blade Bait<br>blade_bait | lure | 7 | 22/612 (3.6%) | 11/248 (4.4%) | all_purpose:14, big_fish:8 | top:16, honorable:6 | cold_slow:18, wind_reaction:13, open_water_search:11, dirty_vibration:6, none:2 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 20/144 (13.9%) | 15/108 (13.9%) | all_purpose:20 | top:13, honorable:7 | cold_slow:13, dirty_vibration:8, current_swing:7, wind_reaction:5, calm_surface:3 |
| Popper Fly<br>popper_fly | fly | 8 | 20/228 (8.8%) | 20/144 (13.9%) | all_purpose:20 | top:16, honorable:4 | calm_surface:16, low_light_surface:9, current_swing:3, dirty_vibration:3, warming_search:2 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 19/144 (13.2%) | 16/108 (14.8%) | all_purpose:18, big_fish:1 | top:13, honorable:6 | cold_slow:11, current_swing:6, clear_subtle:5, dirty_vibration:4, low_light_surface:3 |
| Wake Bait<br>wake_bait | lure | 9 | 18/168 (10.7%) | 18/96 (18.8%) | big_fish:18 | top:14, honorable:4 | calm_surface:14, low_light_surface:8, clear_subtle:4, warming_search:3, cold_slow:1 |
| Crawfish Streamer<br>crawfish_streamer | fly | 7 | 18/144 (12.5%) | 14/108 (13%) | all_purpose:17, big_fish:1 | honorable:10, top:8 | clear_subtle:7, current_swing:6, cold_slow:5, dirty_vibration:5, calm_surface:4 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 8 | 14/612 (2.3%) | 3/312 (1%) | all_purpose:12, big_fish:2 | honorable:10, top:4 | calm_surface:4, warming_search:4, low_light_surface:3, none:3, wind_reaction:2 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 12/156 (7.7%) | 5/28 (17.9%) | all_purpose:12 | honorable:9, top:3 | calm_surface:5, clear_subtle:5, none:3, low_light_surface:2, warming_search:2 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 6 | 12/480 (2.5%) | 0/192 (0%) | big_fish:9, all_purpose:3 | top:11, honorable:1 | cold_slow:7, clear_subtle:4, calm_surface:3, current_swing:1 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 5 | 11/120 (9.2%) | 0/0 | all_purpose:9, big_fish:2 | honorable:6, top:5 | current_swing:8, calm_surface:5, clear_subtle:4, dirty_vibration:4, low_light_surface:4 |
| Feather Jig Leech<br>feather_jig_leech | fly | 7 | 9/612 (1.5%) | 0/0 | all_purpose:8, big_fish:1 | honorable:6, top:3 | warming_search:8, current_swing:4, dirty_vibration:2, calm_surface:1, low_light_surface:1 |
| Hair Jig<br>hair_jig | lure | 8 | 8/144 (5.6%) | 8/108 (7.4%) | all_purpose:5, big_fish:3 | honorable:4, top:4 | current_swing:6, clear_subtle:3, cold_slow:3, calm_surface:2, low_light_surface:2 |
| Swim Jig<br>swim_jig | lure | 7 | 6/612 (1%) | 2/264 (0.8%) | all_purpose:6 | honorable:4, top:2 | calm_surface:4, warming_search:2, current_swing:1, low_light_surface:1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 3/144 (2.1%) | 3/84 (3.6%) | all_purpose:2, big_fish:1 | top:3 | dirty_vibration:3, cold_slow:2, wind_reaction:2, current_swing:1, warming_search:1 |
| Glide Bait<br>glidebait | lure | 9 | 2/36 (5.6%) | 0/0 | big_fish:2 | honorable:1, top:1 | wind_reaction:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 8 | 2/132 (1.5%) | 0/60 (0%) | all_purpose:1, big_fish:1 | honorable:1, top:1 | none:2 |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 2/144 (1.4%) | 2/84 (2.4%) | all_purpose:2 | honorable:2 | cold_slow:2, dirty_vibration:2, wind_reaction:2 |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 161/612 (26.3%) | 75/312 (24%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside<br>combined all-slot share>25%<br>home-window share>20% |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 149/612 (24.3%) | 63/312 (20.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>versatile_search+big_fish_upside<br>home-window share>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 139/612 (22.7%) | 89/376 (23.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 120/540 (22.2%) | 85/360 (23.6%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | home-window share>20% |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 110/612 (18%) | 74/240 (30.8%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>open_water+warming+versatile<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Deceiver<br>deceiver | fly | 84/612 (13.7%) | 71/312 (22.8%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Football Jig<br>football_jig | lure | 80/468 (17.1%) | 31/152 (20.4%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 80/360 (22.2%) | 41/84 (48.8%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Compact Glide Bait<br>compact_glidebait | lure | 64/300 (21.3%) | 0/0 | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 49/348 (14.1%) | 28/104 (26.9%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Deer Hair Slider<br>deer_hair_slider | fly | 36/228 (15.8%) | 36/144 (25%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 34/228 (14.9%) | 34/144 (23.6%) | catalog_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20% |
| Walking Topwater<br>walking_topwater | lure | 33/228 (14.5%) | 33/144 (22.9%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Sculpzilla<br>sculpzilla | fly | 31/144 (21.5%) | 28/132 (21.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 204 | 21/204 (10.3%) | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):9, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):9, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):9, Tube Jig (top), Soft Plastic Jerkbait (honorable):8 | selector/direct-score or overpowered competitors |
| Tube Jig<br>tube_jig | lure | forage 2: crawfish, baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, cold_slow<br>goal 1: reliable_action | 408 | 76/408 (18.6%) | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):13, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):12, Inline Spinner (top), Suspending Jerkbait (honorable):9, Big Smallmouth Tube (top), Football Jig (honorable):8 | healthy / not underused |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | forage 2: crawfish, baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: big_fish_upside | 360 | 85/360 (23.6%) | Inline Spinner (top), Suspending Jerkbait (honorable):9, Suspending Jerkbait (top), Inline Spinner (honorable):8, Tube Jig (top), Soft Plastic Jerkbait (honorable):8, Compact Glide Bait (top), Magnum Jerkbait (honorable):7 | healthy / not underused |
| Finesse Jig<br>finesse_jig | lure | forage 2: crawfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 260 | 19/260 (7.3%) | Magnum Jerkbait (top), Big Smallmouth Tube (honorable):11, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):10, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):9, Tube Jig (top), Soft Plastic Jerkbait (honorable):8 | selector/direct-score or overpowered competitors |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 4: cover_ambush, cold_slow, clear_subtle, heat_finesse<br>goal 1: reliable_action | 260 | 28/260 (10.8%) | Magnum Jerkbait (top), Big Smallmouth Tube (honorable):11, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):9, Tube Jig (top), Soft Plastic Jerkbait (honorable):8, Tube Jig (top), Drop-Shot Minnow (honorable):7 | selector/direct-score or overpowered competitors |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, heat_finesse<br>goal 1: reliable_action | 84 | 9/84 (10.7%) | Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):5, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):4, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):4, Big Smallmouth Tube (top), Football Jig (honorable):3 | selector/direct-score or overpowered competitors |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 212 | 28/212 (13.2%) | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):11, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):11, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):10, Tube Jig (top), Soft Plastic Jerkbait (honorable):8 | healthy / not underused |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 108 | 8/108 (7.4%) | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):6, Buzzbait (top), Big Smallmouth Tube (honorable):6, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):6, Bladed Jig (top), Spinnerbait (honorable):5 | selector/direct-score or overpowered competitors |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 56 | 9/56 (16.1%) | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):4, Bladed Jig (top), Spinnerbait (honorable):3, Buzzbait (top), Big Smallmouth Tube (honorable):3, Magnum Jerkbait (top), Big Smallmouth Tube (honorable):3 | healthy / not underused |
| Bladed Jig<br>bladed_jig | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: dirty_vibration, cover_ambush<br>goal 1: versatile_search | 208 | 30/208 (14.4%) | Medium-Diving Crankbait (top), Football Jig (honorable):10, Buzzbait (top), Big Smallmouth Tube (honorable):8, Inline Spinner (top), Suspending Jerkbait (honorable):7, Suspending Jerkbait (top), Inline Spinner (honorable):7 | healthy / not underused |
| Lipless Crankbait<br>lipless_crankbait | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 1: versatile_search | 240 | 30/240 (12.5%) | Medium-Diving Crankbait (top), Football Jig (honorable):10, Buzzbait (top), Big Smallmouth Tube (honorable):9, Inline Spinner (top), Suspending Jerkbait (honorable):8, Suspending Jerkbait (top), Inline Spinner (honorable):8 | healthy / not underused |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Articulated Baitfish Streamer (articulated_baitfish_streamer), Compact Glide Bait (compact_glidebait), Foam Gurgler (foam_gurgler_fly), Game Changer (game_changer), Rabbit-Strip Leech (rabbit_strip_leech), Walking Topwater (walking_topwater)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Articulated Baitfish Streamer (articulated_baitfish_streamer), Big Smallmouth Tube (big_smallmouth_tube), Compact Glide Bait (compact_glidebait), Deceiver (deceiver), Deer Hair Slider (deer_hair_slider), Foam Gurgler (foam_gurgler_fly), Football Jig (football_jig), Game Changer (game_changer), Magnum Jerkbait (magnum_jerkbait), Medium-Diving Crankbait (medium_diving_crankbait), Rabbit-Strip Leech (rabbit_strip_leech), Sculpzilla (sculpzilla), Walking Topwater (walking_topwater), Warmwater Crawfish Fly (warmwater_crawfish_fly)

### Probably selector problem, not catalog problem
Drop-Shot Minnow (drop_shot_minnow), Finesse Jig (finesse_jig), Hair Jig (hair_jig), Ned Rig (ned_rig), Texas-Rigged Soft-Plastic Craw (texas_rigged_soft_plastic_craw)

## Utilization Notes / Coverage Gaps

- 4 low-use profile(s) were often close to selected winners, which leans toward selector/catalog balance rather than pure scenario coverage.
- 1 low-use profile(s) were usually far behind winners; these may need better-fit scenarios or narrower catalog/seasonal expectations.
- 1 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Rabbit-Strip Leech, Articulated Baitfish Streamer, Clouser Minnow, Woolly Bugger, Deer Hair Slider, Sculpzilla, Crawfish Streamer, Muddler Minnow, Sculpin Streamer, Tube Jig, Big Smallmouth Tube, Texas-Rigged Soft-Plastic Craw, Lipless Crankbait, Spinnerbait, Suspending Jerkbait, Bladed Jig, Ned Rig, Football Jig, Buzzbait, Walking Topwater, Drop-Shot Minnow, Soft Plastic Jerkbait, Inline Spinner |
| underused_home_window | Bucktail Streamer, Conehead Streamer, Paddle-Tail Swimbait, Finesse Jig, Blade Bait, Flat-Sided Crankbait, Hair Jig |
| no_home_window_coverage | None |
| over-dominant | Game Changer, Warmwater Crawfish Fly, Medium-Diving Crankbait, Magnum Jerkbait |
| probably okay niche profile | None |

## SMB Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 11.4% | 139/612 | 89/376 | 139 | 89 | 23.7% | 18/188 | 71/188 | 127 | healthy | activity neutral:264, suppressed:72, active:40<br>clarity clear:168, stained:112, dirty:96<br>water freshwater_lake_pond:244, freshwater_river:132<br>bucket cold_slow_or_front:180, dirty_vibration:56, stable_pleasant_medium_confidence_archive:52 | Articulated Baitfish Streamer (top), Game Changer (honorable):11, Game Changer (honorable), Articulated Baitfish Streamer (top):7, Lead-Eye Leech (top), Woolly Bugger (honorable):7 |
| Articulated Baitfish Streamer<br>articulated_baitfish_streamer | fly | 12.2% | 149/612 | 63/312 | 149 | 63 | 20.2% | 3/156 | 60/156 | 81 | healthy | activity neutral:204, active:96, suppressed:12<br>clarity clear:104, dirty:104, stained:104<br>water freshwater_lake_pond:228, freshwater_river:84<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, cold_slow_or_front:64 | Deceiver (top), Baitfish Slider Fly (honorable):13, Game Changer (top), Rabbit-Strip Leech (honorable):10, Clouser Minnow (honorable), Zonker Streamer (top):9 |
| Clouser Minnow<br>clouser_minnow | fly | 7.5% | 92/612 | 38/312 | 92 | 38 | 12.2% | 37/156 | 1/156 | 106 | healthy | activity neutral:204, active:96, suppressed:12<br>clarity clear:104, dirty:104, stained:104<br>water freshwater_lake_pond:228, freshwater_river:84<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, cold_slow_or_front:64 | Deceiver (top), Baitfish Slider Fly (honorable):13, Game Changer (top), Rabbit-Strip Leech (honorable):10, Deceiver (top), Rabbit-Strip Leech (honorable):9 |
| Game Changer<br>game_changer | fly | 13.2% | 161/612 | 75/312 | 161 | 75 | 24% | 12/156 | 63/156 | 77 | over-dominant | activity neutral:204, active:96, suppressed:12<br>clarity clear:104, dirty:104, stained:104<br>water freshwater_lake_pond:228, freshwater_river:84<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, cold_slow_or_front:64 | Deceiver (top), Baitfish Slider Fly (honorable):13, Clouser Minnow (honorable), Zonker Streamer (top):9, Deceiver (top), Rabbit-Strip Leech (honorable):9 |
| Woolly Bugger<br>woolly_bugger | fly | 4.5% | 55/612 | 48/288 | 55 | 48 | 16.7% | 41/144 | 7/144 | 96 | healthy | activity neutral:204, suppressed:72, active:12<br>clarity clear:96, dirty:96, stained:96<br>water freshwater_lake_pond:180, freshwater_river:108<br>bucket cold_slow_or_front:148, dirty_vibration:56, breezy_windy_stained_reaction:40 | Rabbit-Strip Leech (top), Articulated Baitfish Streamer (honorable):11, Articulated Baitfish Streamer (top), Game Changer (honorable):10, Game Changer (top), Rabbit-Strip Leech (honorable):10 |
| Deer Hair Slider<br>deer_hair_slider | fly | 2.9% | 36/228 | 36/144 | 36 | 36 | 25% | 0/72 | 36/72 | 38 | healthy | activity neutral:108, active:36<br>clarity clear:48, dirty:48, stained:48<br>water freshwater_lake_pond:96, freshwater_river:48<br>bucket stable_pleasant_medium_confidence_archive:64, calm_low_light_surface:36, cold_slow_or_front:16 | Foam Gurgler (top), Clouser Minnow (honorable):6, Game Changer (top), Rabbit-Strip Leech (honorable):6, Articulated Baitfish Streamer (top), Game Changer (honorable):5 |
| Sculpzilla<br>sculpzilla | fly | 2.5% | 31/144 | 28/132 | 31 | 28 | 21.2% | 0/66 | 28/66 | 40 | healthy | activity neutral:100, active:20, suppressed:12<br>clarity clear:48, stained:48, dirty:36<br>water freshwater_river:132<br>bucket cold_slow_or_front:48, stable_pleasant_medium_confidence_archive:28, dirty_vibration:24 | Articulated Baitfish Streamer (top), Game Changer (honorable):4, Sculpin Streamer (top), Jighead Marabou Leech (honorable):4, Articulated Dungeon Streamer (honorable), Game Changer (top):3 |
| Crawfish Streamer<br>crawfish_streamer | fly | 1.5% | 18/144 | 14/108 | 18 | 14 | 13% | 13/54 | 1/54 | 25 | healthy | activity neutral:76, active:20, suppressed:12<br>clarity clear:48, stained:40, dirty:20<br>water freshwater_river:108<br>bucket cold_slow_or_front:40, stable_pleasant_medium_confidence_archive:28, dirty_vibration:16 | Articulated Dungeon Streamer (honorable), Game Changer (top):3, Articulated Dungeon Streamer (top), Game Changer (honorable):3, Deer Hair Slider (honorable), Sculpzilla (top):3 |
| Muddler Minnow<br>muddler_sculpin | fly | 1.6% | 19/144 | 16/108 | 19 | 16 | 14.8% | 15/54 | 1/54 | 52 | healthy | activity neutral:76, active:20, suppressed:12<br>clarity clear:48, stained:40, dirty:20<br>water freshwater_river:108<br>bucket cold_slow_or_front:40, stable_pleasant_medium_confidence_archive:28, dirty_vibration:16 | Articulated Dungeon Streamer (honorable), Game Changer (top):3, Articulated Dungeon Streamer (top), Game Changer (honorable):3, Deer Hair Slider (honorable), Sculpzilla (top):3 |
| Sculpin Streamer<br>sculpin_streamer | fly | 1.6% | 20/144 | 15/108 | 20 | 15 | 13.9% | 15/54 | 0/54 | 60 | healthy | activity neutral:76, active:20, suppressed:12<br>clarity clear:48, stained:40, dirty:20<br>water freshwater_river:108<br>bucket cold_slow_or_front:40, stable_pleasant_medium_confidence_archive:28, dirty_vibration:16 | Articulated Dungeon Streamer (honorable), Game Changer (top):3, Articulated Dungeon Streamer (top), Game Changer (honorable):3, Deer Hair Slider (honorable), Sculpzilla (top):3 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 4% | 49/348 | 28/104 | 49 | 28 | 26.9% | 20/52 | 8/52 | 36 | over-dominant | activity neutral:72, active:16, suppressed:16<br>clarity clear:84, stained:20<br>water freshwater_lake_pond:104<br>bucket cold_slow_or_front:60, stable_pleasant_medium_confidence_archive:20, calm_bright_clear_subtle:16 | Game Changer (top), Rabbit-Strip Leech (honorable):8, Game Changer (honorable), Articulated Baitfish Streamer (top):6, Articulated Baitfish Streamer (top), Game Changer (honorable):2 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0.2% | 3/144 | 3/84 | 3 | 3 | 3.6% | 2/42 | 1/42 | 27 | underused_home_window | activity neutral:60, active:12, suppressed:12<br>clarity clear:28, dirty:28, stained:28<br>water freshwater_river:84<br>bucket dirty_vibration:24, cold_slow_or_front:16, stable_pleasant_medium_confidence_archive:16 | Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Articulated Baitfish Streamer (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3 |
| Conehead Streamer<br>conehead_streamer | fly | 0.2% | 2/144 | 2/84 | 2 | 2 | 2.4% | 2/42 | 0/42 | 28 | underused_home_window | activity neutral:60, active:12, suppressed:12<br>clarity clear:28, dirty:28, stained:28<br>water freshwater_river:84<br>bucket dirty_vibration:24, cold_slow_or_front:16, stable_pleasant_medium_confidence_archive:16 | Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Articulated Baitfish Streamer (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3 |
| Tube Jig<br>tube_jig | lure | 7.1% | 87/612 | 76/408 | 87 | 76 | 18.6% | 59/204 | 17/204 | 105 | healthy | activity neutral:264, active:96, suppressed:48<br>clarity clear:204, stained:204<br>water freshwater_lake_pond:312, freshwater_river:96<br>bucket cold_slow_or_front:144, stable_pleasant_medium_confidence_archive:116, breezy_windy_stained_reaction:84 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):11, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):8, Big Smallmouth Tube (top), Football Jig (honorable):8 |
| Big Smallmouth Tube<br>big_smallmouth_tube | lure | 9.8% | 120/540 | 85/360 | 120 | 85 | 23.6% | 0/180 | 85/180 | 78 | healthy | activity neutral:224, active:96, suppressed:40<br>clarity clear:180, stained:180<br>water freshwater_lake_pond:272, freshwater_river:88<br>bucket stable_pleasant_medium_confidence_archive:116, cold_slow_or_front:112, breezy_windy_stained_reaction:68 | Inline Spinner (top), Suspending Jerkbait (honorable):8, Tube Jig (top), Soft Plastic Jerkbait (honorable):8, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):7 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 1.1% | 14/612 | 3/312 | 14 | 3 | 1% | 2/156 | 1/156 | 12 | underused_home_window | activity neutral:204, active:96, suppressed:12<br>clarity clear:104, dirty:104, stained:104<br>water freshwater_lake_pond:228, freshwater_river:84<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, cold_slow_or_front:64 | Medium-Diving Crankbait (top), Football Jig (honorable):10, Inline Spinner (top), Suspending Jerkbait (honorable):8, Bladed Jig (top), Spinnerbait (honorable):7 |
| Finesse Jig<br>finesse_jig | lure | 2% | 25/612 | 19/260 | 25 | 19 | 7.3% | 17/130 | 2/130 | 68 | underused_home_window | activity neutral:168, suppressed:52, active:40<br>clarity clear:168, stained:72, dirty:20<br>water freshwater_lake_pond:152, freshwater_river:108<br>bucket cold_slow_or_front:144, stable_pleasant_medium_confidence_archive:52, calm_bright_clear_subtle:20 | Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):10, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):9, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):8 |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | lure | 3.1% | 38/612 | 28/260 | 38 | 28 | 10.8% | 23/130 | 5/130 | 61 | healthy | activity neutral:168, suppressed:52, active:40<br>clarity clear:168, stained:72, dirty:20<br>water freshwater_lake_pond:152, freshwater_river:108<br>bucket cold_slow_or_front:144, stable_pleasant_medium_confidence_archive:52, calm_bright_clear_subtle:20 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):9, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):8, Tube Jig (top), Soft Plastic Jerkbait (honorable):8 |
| Blade Bait<br>blade_bait | lure | 1.8% | 22/612 | 11/248 | 22 | 11 | 4.4% | 6/124 | 5/124 | 49 | underused_home_window | activity neutral:144, active:56, suppressed:48<br>clarity clear:124, stained:124<br>water freshwater_lake_pond:208, freshwater_river:40<br>bucket cold_slow_or_front:128, breezy_windy_stained_reaction:84, stable_pleasant_medium_confidence_archive:24 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):9, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):9, Tube Jig (top), Soft Plastic Jerkbait (honorable):8 |
| Lipless Crankbait<br>lipless_crankbait | lure | 2.6% | 32/612 | 30/240 | 32 | 30 | 12.5% | 18/120 | 12/120 | 78 | healthy | activity neutral:136, active:96, suppressed:8<br>clarity dirty:120, stained:120<br>water freshwater_lake_pond:176, freshwater_river:64<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, stable_pleasant_medium_confidence_archive:32 | Buzzbait (top), Big Smallmouth Tube (honorable):8, Bladed Jig (top), Spinnerbait (honorable):7, Medium-Diving Crankbait (top), Football Jig (honorable):7 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 9% | 110/612 | 74/240 | 110 | 74 | 30.8% | 41/120 | 33/120 | 93 | over-dominant | activity neutral:136, active:96, suppressed:8<br>clarity dirty:120, stained:120<br>water freshwater_lake_pond:176, freshwater_river:64<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, stable_pleasant_medium_confidence_archive:32 | Buzzbait (top), Big Smallmouth Tube (honorable):8, Bladed Jig (top), Spinnerbait (honorable):7, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):5 |
| Spinnerbait<br>spinnerbait | lure | 2.3% | 28/612 | 28/240 | 28 | 28 | 11.7% | 17/120 | 11/120 | 69 | healthy | activity neutral:136, active:96, suppressed:8<br>clarity dirty:120, stained:120<br>water freshwater_lake_pond:176, freshwater_river:64<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, stable_pleasant_medium_confidence_archive:32 | Buzzbait (top), Big Smallmouth Tube (honorable):8, Medium-Diving Crankbait (top), Football Jig (honorable):7, Big Smallmouth Tube (honorable), Medium-Diving Crankbait (top):5 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8% | 98/612 | 28/212 | 98 | 28 | 13.2% | 22/106 | 6/106 | 82 | healthy | activity neutral:140, suppressed:48, active:24<br>clarity clear:120, stained:92<br>water freshwater_lake_pond:152, freshwater_river:60<br>bucket cold_slow_or_front:120, breezy_windy_stained_reaction:44, warming_search:20 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):10, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):10, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):8 |
| Bladed Jig<br>bladed_jig | lure | 2.9% | 36/612 | 30/208 | 36 | 30 | 14.4% | 19/104 | 11/104 | 53 | healthy | activity neutral:136, active:64, suppressed:8<br>clarity dirty:104, stained:104<br>water freshwater_lake_pond:152, freshwater_river:56<br>bucket dirty_vibration:100, breezy_windy_stained_reaction:84, calm_low_light_surface:8 | Buzzbait (top), Big Smallmouth Tube (honorable):7, Medium-Diving Crankbait (top), Football Jig (honorable):7, Big Smallmouth Tube (honorable), Medium-Diving Crankbait (top):5 |
| Ned Rig<br>ned_rig | lure | 2.9% | 35/612 | 21/204 | 35 | 21 | 10.3% | 20/102 | 1/102 | 68 | healthy | activity neutral:156, suppressed:48<br>clarity clear:124, stained:80<br>water freshwater_lake_pond:144, freshwater_river:60<br>bucket cold_slow_or_front:120, breezy_windy_stained_reaction:32, stable_pleasant_medium_confidence_archive:24 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):9, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):9, Tube Jig (top), Soft Plastic Jerkbait (honorable):8 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 1% | 12/480 | 0/192 | 12 | 0 | 0% | 0/96 | 0/96 | 16 | underused_home_window | activity active:96, neutral:88, suppressed:8<br>clarity dirty:96, stained:96<br>water freshwater_lake_pond:136, freshwater_river:56<br>bucket dirty_vibration:76, breezy_windy_stained_reaction:60, stable_pleasant_medium_confidence_archive:32 | Buzzbait (top), Big Smallmouth Tube (honorable):8, Bladed Jig (top), Spinnerbait (honorable):7, Medium-Diving Crankbait (top), Football Jig (honorable):7 |
| Football Jig<br>football_jig | lure | 6.5% | 80/468 | 31/152 | 80 | 31 | 20.4% | 0/76 | 31/76 | 14 | healthy | activity neutral:92, suppressed:40, active:20<br>clarity clear:120, stained:32<br>water freshwater_lake_pond:152<br>bucket cold_slow_or_front:104, stable_pleasant_medium_confidence_archive:24, calm_bright_clear_subtle:16 | Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):10, Tube Jig (top), Carolina-Rigged Stick Worm (honorable):5, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):4 |
| Buzzbait<br>buzzbait | lure | 2% | 25/228 | 25/144 | 25 | 25 | 17.4% | 3/72 | 22/72 | 34 | healthy | activity neutral:108, active:36<br>clarity clear:48, dirty:48, stained:48<br>water freshwater_lake_pond:96, freshwater_river:48<br>bucket stable_pleasant_medium_confidence_archive:64, calm_low_light_surface:36, cold_slow_or_front:16 | Walking Topwater (top), Big Smallmouth Tube (honorable):6, Walking Topwater (top), Compact Glide Bait (honorable):6, Wake Bait (top), Big Smallmouth Tube (honorable):5 |
| Walking Topwater<br>walking_topwater | lure | 2.7% | 33/228 | 33/144 | 33 | 33 | 22.9% | 1/72 | 32/72 | 43 | healthy | activity neutral:108, active:36<br>clarity clear:48, dirty:48, stained:48<br>water freshwater_lake_pond:96, freshwater_river:48<br>bucket stable_pleasant_medium_confidence_archive:64, calm_low_light_surface:36, cold_slow_or_front:16 | Buzzbait (top), Big Smallmouth Tube (honorable):13, Wake Bait (top), Big Smallmouth Tube (honorable):5, Wake Bait (top), Compact Glide Bait (honorable):4 |
| Hair Jig<br>hair_jig | lure | 0.7% | 8/144 | 8/108 | 8 | 8 | 7.4% | 5/54 | 3/54 | 29 | underused_home_window | activity neutral:76, active:20, suppressed:12<br>clarity clear:48, stained:40, dirty:20<br>water freshwater_river:108<br>bucket cold_slow_or_front:40, stable_pleasant_medium_confidence_archive:28, dirty_vibration:16 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):6, Bladed Jig (top), Spinnerbait (honorable):5, Buzzbait (top), Big Smallmouth Tube (honorable):5 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 2% | 25/612 | 9/84 | 25 | 9 | 10.7% | 7/42 | 2/42 | 20 | healthy | activity neutral:64, suppressed:20<br>clarity clear:84<br>water freshwater_lake_pond:64, freshwater_river:20<br>bucket cold_slow_or_front:32, stable_pleasant_medium_confidence_archive:24, calm_bright_clear_subtle:16 | Soft Plastic Jerkbait (top), Weightless Stick Worm (honorable):5, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):4, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):4 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 6.5% | 80/360 | 41/84 | 80 | 41 | 48.8% | 0/0 | 41/84 | 38 | over-dominant | activity neutral:52, suppressed:20, active:12<br>clarity clear:48, stained:36<br>water freshwater_lake_pond:56, freshwater_river:28<br>bucket cold_slow_or_front:46, breezy_windy_stained_reaction:14, warming_search:10 | Big Smallmouth Tube (top), Football Jig (honorable):5, Flat-Sided Crankbait (top), Tube Jig (honorable):4, Big Smallmouth Tube (honorable), Compact Glide Bait (top):2 |
| Soft Plastic Jerkbait<br>soft_jerkbait | lure | 3.3% | 41/480 | 12/72 | 41 | 12 | 16.7% | 12/36 | 0/36 | 24 | healthy | activity neutral:64, suppressed:8<br>clarity clear:64, stained:8<br>water freshwater_lake_pond:56, freshwater_river:16<br>bucket stable_pleasant_medium_confidence_archive:20, calm_bright_clear_subtle:16, cold_slow_or_front:16 | Tube Jig (top), Drop-Shot Minnow (honorable):6, Big Smallmouth Tube (top), Football Jig (honorable):3, Magnum Jerkbait (top), Football Jig (honorable):3 |
| Inline Spinner<br>inline_spinner | lure | 7.2% | 88/612 | 9/56 | 88 | 9 | 16.1% | 6/28 | 3/28 | 20 | healthy | activity neutral:40, active:8, suppressed:8<br>clarity clear:28, stained:28<br>water freshwater_river:56<br>bucket cold_slow_or_front:16, stable_pleasant_medium_confidence_archive:16, breezy_windy_stained_reaction:8 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):4, Bladed Jig (top), Spinnerbait (honorable):3, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):2 |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |
| all_purpose_goal_fit | 19 |
| forage_clarity_stack | 11 |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 | big_fish<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | all_purpose<br>stained<br>freshwater_river | warming_search<br>active | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | big_fish<br>stained<br>freshwater_river | warming_search<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>active | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | big_fish<br>dirty<br>freshwater_river | dirty_vibration<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 | all_purpose<br>stained<br>freshwater_river | cold_slow_or_front<br>suppressed | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 | big_fish<br>stained<br>freshwater_river | cold_slow_or_front<br>suppressed | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>suppressed | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 | big_fish<br>dirty<br>freshwater_river | dirty_vibration<br>suppressed | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Door County / Green Bay smallmouth lake<br>2025-04-18 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Lake Champlain SMB water<br>2025-04-27 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>active | 152 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>active | 140 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Yampa River mountain-west SMB context<br>2025-05-19 | big_fish<br>stained<br>freshwater_river | breezy_windy_stained_reaction<br>neutral | 150 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Yampa River mountain-west SMB context<br>2025-05-19 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 162 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-06-14 | all_purpose<br>stained<br>freshwater_river | stable_pleasant_medium_confidence_archive<br>neutral | 152 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-06-14 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 152 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-06-17 | all_purpose<br>stained<br>freshwater_river | stable_pleasant_medium_confidence_archive<br>neutral | 152 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Finesse Jig<br>finesse_jig | 17/130 | 2/130 | goal_tags:139, forage_clarity_stack:49, daily_condition_tags:28, selector_filtering_variety_jitter:17, seasonal_baseline:8 | Upper Mississippi smallmouth river 2025-01-26 all_purpose stained: lost to Texas-Rigged Soft-Plastic Craw by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish stained: lost to Texas-Rigged Soft-Plastic Craw by 0 (selector_filtering_variety_jitter)<br>Dale Hollow / Tennessee highland reservoir 2025-02-15 big_fish clear: lost to Ned Rig by 0 (selector_filtering_variety_jitter) |
| Texas-Rigged Soft-Plastic Craw<br>texas_rigged_soft_plastic_craw | 23/130 | 5/130 | goal_tags:137, forage_clarity_stack:41, daily_condition_tags:28, selector_filtering_variety_jitter:16, seasonal_baseline:10 | Lake Champlain SMB water 2025-01-18 all_purpose clear: lost to Blade Bait by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter)<br>Dale Hollow / Tennessee highland reservoir 2025-02-15 all_purpose clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter) |
| Ned Rig<br>ned_rig | 20/102 | 1/102 | goal_tags:99, forage_clarity_stack:51, selector_filtering_variety_jitter:13, daily_condition_tags:12, seasonal_baseline:8 | Upper Mississippi smallmouth river 2025-01-26 all_purpose clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 all_purpose stained: lost to Texas-Rigged Soft-Plastic Craw by 0 (selector_filtering_variety_jitter) |
| Drop-Shot Minnow<br>drop_shot_minnow | 7/42 | 2/42 | goal_tags:45, daily_condition_tags:15, seasonal_baseline:11, selector_filtering_variety_jitter:4 | Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Finesse Jig by 4 (seasonal_baseline)<br>Table Rock / Ozark clear reservoir 2025-04-24 big_fish clear: lost to Flat-Sided Crankbait by 8 (seasonal_baseline)<br>Upper Mississippi smallmouth river 2025-01-26 all_purpose clear: lost to Finesse Jig by 10 (seasonal_baseline) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Finesse Jig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose stained cold_slow_or_front | 158 | Texas-Rigged Soft-Plastic Craw<br>158 | 0 | selector_filtering_variety_jitter | base:+100<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish stained cold_slow_or_front | 140 | Texas-Rigged Soft-Plastic Craw<br>140 | 0 | selector_filtering_variety_jitter | base:+100<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Dale Hollow / Tennessee highland reservoir 2025-02-15<br>big_fish clear cold_slow_or_front | 156 | Ned Rig<br>156 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>all_purpose clear cold_slow_or_front | 206 | Carolina-Rigged Stick Worm<br>206 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 190 | Finesse Jig<br>190 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 156 | Finesse Jig<br>156 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose stained cold_slow_or_front | 158 | Texas-Rigged Soft-Plastic Craw<br>158 | 0 | selector_filtering_variety_jitter | base:+100<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish stained cold_slow_or_front | 140 | Texas-Rigged Soft-Plastic Craw<br>140 | 0 | selector_filtering_variety_jitter | base:+100<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Lake Champlain SMB water 2025-01-18<br>all_purpose clear cold_slow_or_front | 184 | Blade Bait<br>184 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 156 | Finesse Jig<br>156 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Dale Hollow / Tennessee highland reservoir 2025-02-15<br>all_purpose clear cold_slow_or_front | 190 | Finesse Jig<br>190 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Soft-Plastic Craw<br>Dale Hollow / Tennessee highland reservoir 2025-02-15<br>big_fish clear cold_slow_or_front | 156 | Ned Rig<br>156 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 152 | Finesse Jig<br>156 | 4 | seasonal_baseline | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Table Rock / Ozark clear reservoir 2025-04-24<br>big_fish clear stable_pleasant_medium_confidence_archive | 142 | Flat-Sided Crankbait<br>150 | 8 | seasonal_baseline | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Drop-Shot Minnow<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 180 | Finesse Jig<br>190 | 10 | seasonal_baseline | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Table Rock / Ozark clear reservoir 2025-04-24<br>all_purpose clear stable_pleasant_medium_confidence_archive | 170 | Tube Jig<br>182 | 12 | seasonal_baseline | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 15 |
| set_b_group_novelty | 10 |
| jitter_or_id_tiebreak | 9 |
| honorable_diversity_or_replacement | 5 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>184 | Ned Rig<br>184 | 0 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake Champlain SMB water<br>2025-01-18 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>184 | Texas-Rigged Soft-Plastic Craw<br>184 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:baitfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>190 | Ned Rig<br>190 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>190 | Texas-Rigged Soft-Plastic Craw<br>190 | 0 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
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
| Yampa River mountain-west SMB context<br>2025-05-19 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Trinity Lake northern California SMB water<br>2025-05-23 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>186 | Ned Rig<br>186 | 0 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Trinity Lake northern California SMB water<br>2025-05-23 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>186 | Texas-Rigged Soft-Plastic Craw<br>186 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Trinity Lake northern California SMB water<br>2025-05-23 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>170 | Finesse Jig<br>170 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Trinity Lake northern California SMB water<br>2025-05-23 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>170 | Ned Rig<br>170 | 0 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Yampa River mountain-west SMB context<br>2025-07-12 all_purpose clear<br>stable_pleasant_medium_confidence_archive | B<br>honorable_lure | Soft Plastic Jerkbait<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Table Rock / Ozark clear reservoir<br>2025-09-13 all_purpose clear<br>stable_pleasant_medium_confidence_archive | B<br>lure_of_the_day | Soft Plastic Jerkbait<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-09-27 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>186 | Finesse Jig<br>186 | 0 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Dale Hollow / Tennessee highland reservoir<br>2025-09-27 all_purpose clear<br>calm_bright_clear_subtle | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>186 | Texas-Rigged Soft-Plastic Craw<br>186 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Dale Hollow / Tennessee highland reservoir<br>2025-09-27 all_purpose stained<br>cold_slow_or_front | B<br>honorable_lure | Finesse Jig<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |
| New River Appalachian SMB context<br>2025-09-29 all_purpose clear<br>calm_low_light_surface | B<br>lure_of_the_day | Hair Jig<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:current_swing:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_secondary_pace:medium:+6 |
| Lake Champlain SMB water<br>2025-10-12 all_purpose clear<br>warming_search | B<br>lure_of_the_day | Soft Plastic Jerkbait<br>180 | Drop-Shot Minnow<br>180 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Table Rock / Ozark clear reservoir<br>2025-10-19 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>186 | Finesse Jig<br>186 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Table Rock / Ozark clear reservoir<br>2025-10-19 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>186 | Texas-Rigged Soft-Plastic Craw<br>186 | 0 | jitter_or_id_tiebreak | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6 |
| Table Rock / Ozark clear reservoir<br>2025-10-20 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Ned Rig<br>186 | Finesse Jig<br>186 | 0 | honorable_diversity_or_replacement | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Table Rock / Ozark clear reservoir<br>2025-10-20 all_purpose stained<br>cold_slow_or_front | B<br>honorable_lure | Finesse Jig<br>170 | Texas-Rigged Soft-Plastic Craw<br>170 | 0 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 |
| Dale Hollow / Tennessee highland reservoir<br>2025-11-08 all_purpose clear<br>cold_slow_or_front | B<br>honorable_lure | Ned Rig<br>206 | Finesse Jig<br>206 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-11-08 all_purpose stained<br>cold_slow_or_front | B<br>honorable_lure | Finesse Jig<br>190 | Ned Rig<br>190 | 0 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Dworshak / inland northwest SMB reservoir<br>2025-11-15 all_purpose clear<br>stable_pleasant_medium_confidence_archive | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>190 | Finesse Jig<br>190 | 0 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Dworshak / inland northwest SMB reservoir<br>2025-11-15 all_purpose clear<br>stable_pleasant_medium_confidence_archive | B<br>honorable_lure | Carolina-Rigged Stick Worm<br>190 | Texas-Rigged Soft-Plastic Craw<br>190 | 0 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 3/312 | 1% | 12 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:38, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:38, big_fish / dirty / freshwater_lake_pond / dirty_vibration:38, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:38 | goal_tags:216, daily_condition_tags:86, selector_filtering_variety_jitter:4, forage_clarity_stack:3 | Medium-Diving Crankbait (top), Football Jig (honorable):10, Inline Spinner (top), Suspending Jerkbait (honorable):8, Bladed Jig (top), Spinnerbait (honorable):7, Buzzbait (top), Big Smallmouth Tube (honorable):7 |
| Finesse Jig<br>finesse_jig | lure | 19/260 | 7.3% | 68 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:36, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:36, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:16, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:16 | goal_tags:139, forage_clarity_stack:49, daily_condition_tags:28, selector_filtering_variety_jitter:17 | Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):10, Big Smallmouth Tube (top), Magnum Jerkbait (honorable):9, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):8, Tube Jig (top), Soft Plastic Jerkbait (honorable):8 |
| Blade Bait<br>blade_bait | lure | 11/248 | 4.4% | 49 | all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:38, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:38, all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:34, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:34 | goal_tags:137, forage_clarity_stack:44, daily_condition_tags:42, selector_filtering_variety_jitter:10 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):9, Tube Jig (top), Texas-Rigged Soft-Plastic Craw (honorable):9, Tube Jig (top), Soft Plastic Jerkbait (honorable):8, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):6 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 0/192 | 0% | 16 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:28, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:28, big_fish / dirty / freshwater_lake_pond / dirty_vibration:28, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:28 | goal_tags:115, daily_condition_tags:54, forage_clarity_stack:21, seasonal_baseline:1 | Buzzbait (top), Big Smallmouth Tube (honorable):8, Bladed Jig (top), Spinnerbait (honorable):7, Medium-Diving Crankbait (top), Football Jig (honorable):7, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):5 |
| Hair Jig<br>hair_jig | lure | 8/108 | 7.4% | 29 | all_purpose / clear / freshwater_river / cold_slow_or_front:12, big_fish / clear / freshwater_river / cold_slow_or_front:12, all_purpose / dirty / freshwater_river / dirty_vibration:8, all_purpose / stained / freshwater_river / cold_slow_or_front:8 | goal_tags:49, forage_clarity_stack:36, seasonal_baseline:9, selector_filtering_variety_jitter:6 | Big Smallmouth Tube (top), Magnum Jerkbait (honorable):6, Bladed Jig (top), Spinnerbait (honorable):5, Buzzbait (top), Big Smallmouth Tube (honorable):5, Big Smallmouth Tube (honorable), Magnum Jerkbait (top):4 |
| Conehead Streamer<br>conehead_streamer | fly | 2/84 | 2.4% | 28 | all_purpose / dirty / freshwater_river / dirty_vibration:12, big_fish / dirty / freshwater_river / dirty_vibration:12, all_purpose / clear / freshwater_river / cold_slow_or_front:6, big_fish / clear / freshwater_river / cold_slow_or_front:6 | goal_tags:76, selector_filtering_variety_jitter:3, daily_condition_tags:2, forage_clarity_stack:1 | Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Articulated Baitfish Streamer (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3, Sculpzilla (top), Deer Hair Slider (honorable):3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3/84 | 3.6% | 27 | all_purpose / dirty / freshwater_river / dirty_vibration:12, big_fish / dirty / freshwater_river / dirty_vibration:12, all_purpose / clear / freshwater_river / cold_slow_or_front:6, big_fish / clear / freshwater_river / cold_slow_or_front:6 | goal_tags:75, selector_filtering_variety_jitter:3, daily_condition_tags:2, forage_clarity_stack:1 | Sculpzilla (top), Articulated Dungeon Streamer (honorable):4, Articulated Baitfish Streamer (top), Game Changer (honorable):3, Sculpin Streamer (top), Jighead Marabou Leech (honorable):3, Sculpzilla (top), Deer Hair Slider (honorable):3 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 75/312 | 24% | 77 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:38, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:38, big_fish / dirty / freshwater_lake_pond / dirty_vibration:38, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:38 | goal_tags:99, daily_condition_tags:85, selector_filtering_variety_jitter:44, seasonal_baseline:7 | Deceiver (top), Baitfish Slider Fly (honorable):13, Clouser Minnow (honorable), Zonker Streamer (top):9, Deceiver (top), Rabbit-Strip Leech (honorable):9, Baitfish Slider Fly (top), Articulated Baitfish Streamer (honorable):8 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 74/240 | 30.8% | 93 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:38, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:38, big_fish / dirty / freshwater_lake_pond / dirty_vibration:38, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:38 | goal_tags:93, selector_filtering_variety_jitter:53, daily_condition_tags:12, seasonal_baseline:8 | Buzzbait (top), Big Smallmouth Tube (honorable):8, Bladed Jig (top), Spinnerbait (honorable):7, Big Smallmouth Tube (honorable), Suspending Jerkbait (top):5, Inline Spinner (top), Suspending Jerkbait (honorable):5 |
| Warmwater Crawfish Fly<br>warmwater_crawfish_fly | fly | 28/104 | 26.9% | 36 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:20, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:20, all_purpose / clear / freshwater_lake_pond / stable_pleasant_medium_confidence_archive:10, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:10 | goal_tags:46, daily_condition_tags:14, selector_filtering_variety_jitter:14, seasonal_baseline:2 | Game Changer (top), Rabbit-Strip Leech (honorable):8, Game Changer (honorable), Articulated Baitfish Streamer (top):6, Articulated Baitfish Streamer (top), Game Changer (honorable):2, Clouser Minnow (honorable), Deceiver (top):2 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 41/84 | 48.8% | 38 | big_fish / clear / freshwater_lake_pond / cold_slow_or_front:18, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:12, big_fish / clear / freshwater_river / cold_slow_or_front:10, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:10 | selector_filtering_variety_jitter:28, forage_clarity_stack:8, goal_tags:5, daily_condition_tags:2 | Big Smallmouth Tube (top), Football Jig (honorable):5, Flat-Sided Crankbait (top), Tube Jig (honorable):4, Big Smallmouth Tube (honorable), Compact Glide Bait (top):2, Big Smallmouth Tube (honorable), Football Jig (top):2 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Foam Gurgler [fly] (19), Popper Fly [fly] (12), Clouser Minnow [fly] (10), Soft Plastic Jerkbait [lure] (9), Suspending Jerkbait [lure] (7) | Foam Gurgler [fly] (25), Clouser Minnow [fly] (19), Popper Fly [fly] (16), Soft Plastic Jerkbait [lure] (15), Inline Spinner [lure] (13) |
| calm_surface | big_fish | Walking Topwater [lure] (19), Deer Hair Slider [fly] (15), Articulated Baitfish Streamer [fly] (13), Game Changer [fly] (12), Wake Bait [lure] (11) | Deer Hair Slider [fly] (27), Big Smallmouth Tube [lure] (26), Game Changer [fly] (25), Walking Topwater [lure] (24), Articulated Baitfish Streamer [fly] (23) |
| low_light_surface | all_purpose | Foam Gurgler [fly] (12), Inline Spinner [lure] (6), Popper Fly [fly] (6), Clouser Minnow [fly] (5), Soft Plastic Jerkbait [lure] (5) | Foam Gurgler [fly] (15), Clouser Minnow [fly] (11), Inline Spinner [lure] (11), Popper Fly [fly] (9), Suspending Jerkbait [lure] (9) |
| low_light_surface | big_fish | Buzzbait [lure] (13), Deer Hair Slider [fly] (12), Walking Topwater [lure] (12), Game Changer [fly] (7), Articulated Baitfish Streamer [fly] (6) | Deer Hair Slider [fly] (18), Game Changer [fly] (16), Big Smallmouth Tube [lure] (15), Buzzbait [lure] (15), Walking Topwater [lure] (15) |
| wind_reaction | all_purpose | Deceiver [fly] (37), Zonker Streamer [fly] (37), Medium-Diving Crankbait [lure] (29), Suspending Jerkbait [lure] (29), Inline Spinner [lure] (26) | Suspending Jerkbait [lure] (55), Deceiver [fly] (48), Inline Spinner [lure] (47), Medium-Diving Crankbait [lure] (44), Zonker Streamer [fly] (44) |
| wind_reaction | big_fish | Medium-Diving Crankbait [lure] (38), Game Changer [fly] (25), Articulated Baitfish Streamer [fly] (22), Deceiver [fly] (21), Baitfish Slider Fly [fly] (20) | Articulated Baitfish Streamer [fly] (54), Rabbit-Strip Leech [fly] (54), Game Changer [fly] (50), Football Jig [lure] (41), Medium-Diving Crankbait [lure] (41) |
| dirty_vibration | all_purpose | Zonker Streamer [fly] (34), Deceiver [fly] (29), Medium-Diving Crankbait [lure] (23), Suspending Jerkbait [lure] (21), Inline Spinner [lure] (19) | Inline Spinner [lure] (39), Suspending Jerkbait [lure] (39), Zonker Streamer [fly] (39), Deceiver [fly] (38), Medium-Diving Crankbait [lure] (35) |
| dirty_vibration | big_fish | Medium-Diving Crankbait [lure] (31), Articulated Baitfish Streamer [fly] (19), Deceiver [fly] (18), Game Changer [fly] (17), Baitfish Slider Fly [fly] (16) | Articulated Baitfish Streamer [fly] (44), Rabbit-Strip Leech [fly] (42), Game Changer [fly] (37), Big Smallmouth Tube [lure] (33), Medium-Diving Crankbait [lure] (31) |
| clear_subtle | all_purpose | Tube Jig [lure] (21), Soft Plastic Jerkbait [lure] (10), Warmwater Crawfish Fly [fly] (9), Lead-Eye Leech [fly] (7), Clouser Minnow [fly] (6) | Tube Jig [lure] (22), Lead-Eye Leech [fly] (16), Clouser Minnow [fly] (15), Soft Plastic Jerkbait [lure] (14), Warmwater Crawfish Fly [fly] (12) |
| clear_subtle | big_fish | Big Smallmouth Tube [lure] (13), Articulated Baitfish Streamer [fly] (10), Compact Glide Bait [lure] (9), Game Changer [fly] (8), Unweighted Baitfish Streamer [fly] (8) | Game Changer [fly] (25), Big Smallmouth Tube [lure] (23), Articulated Baitfish Streamer [fly] (21), Compact Glide Bait [lure] (14), Magnum Jerkbait [lure] (14) |
| cold_slow | all_purpose | Tube Jig [lure] (35), Jighead Marabou Leech [fly] (19), Suspending Jerkbait [lure] (17), Warmwater Crawfish Fly [fly] (16), Deceiver [fly] (14) | Tube Jig [lure] (45), Woolly Bugger [fly] (39), Jighead Marabou Leech [fly] (34), Suspending Jerkbait [lure] (33), Texas-Rigged Soft-Plastic Craw [lure] (27) |
| cold_slow | big_fish | Game Changer [fly] (25), Rabbit-Strip Leech [fly] (21), Articulated Baitfish Streamer [fly] (19), Big Smallmouth Tube [lure] (17), Football Jig [lure] (17) | Rabbit-Strip Leech [fly] (59), Articulated Baitfish Streamer [fly] (49), Game Changer [fly] (48), Big Smallmouth Tube [lure] (45), Football Jig [lure] (42) |
| warming_search | all_purpose | Clouser Minnow [fly] (7), Medium-Diving Crankbait [lure] (6), Inline Spinner [lure] (4), Suspending Jerkbait [lure] (4), Deceiver [fly] (3) | Medium-Diving Crankbait [lure] (10), Clouser Minnow [fly] (9), Baitfish Slider Fly [fly] (8), Inline Spinner [lure] (8), Feather Jig Leech [fly] (7) |
| warming_search | big_fish | Big Smallmouth Tube [lure] (5), Articulated Baitfish Streamer [fly] (4), Game Changer [fly] (4), Baitfish Slider Fly [fly] (3), Bladed Jig [lure] (3) | Big Smallmouth Tube [lure] (12), Game Changer [fly] (11), Articulated Baitfish Streamer [fly] (9), Magnum Jerkbait [lure] (8), Rabbit-Strip Leech [fly] (7) |
| heat_finesse | all_purpose | None | None |
| heat_finesse | big_fish | None | None |
| current_swing | all_purpose | Bladed Jig [lure] (8), Clouser Minnow [fly] (6), Tube Jig [lure] (5), Foam Gurgler [fly] (4), Sculpin Streamer [fly] (4) | Clouser Minnow [fly] (11), Bladed Jig [lure] (10), Spinnerbait [lure] (9), Squarebill Crankbait [lure] (8), Foam Gurgler [fly] (7) |
| current_swing | big_fish | Sculpzilla [fly] (11), Walking Topwater [lure] (8), Buzzbait [lure] (7), Bladed Jig [lure] (4), Game Changer [fly] (4) | Big Smallmouth Tube [lure] (15), Sculpzilla [fly] (15), Game Changer [fly] (13), Buzzbait [lure] (9), Deer Hair Slider [fly] (9) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Colorado mountain-west SMB reservoir<br>2025-08-12 clear big_fish B | 60.3-86.9F, 7.6 mph wind, 27.3% cloud, 0 in precip | active, caution, wind_reaction+clear_subtle+open_water_search, medium | Inline Spinner (172); Medium-Diving Crankbait (178); Unweighted Baitfish Streamer (162); Deceiver (172) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE |
| Yampa River mountain-west SMB context<br>2025-05-19 clear big_fish B | 37.6-50.1F, 10.4 mph wind, 68.5% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, medium | Medium-Diving Crankbait (162); Tube Jig (148); Game Changer (154); Articulated Baitfish Streamer (146) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Ozark Current River smallmouth context<br>2025-05-06 dirty big_fish B | 46.3-70F, 4.1 mph wind, 65.2% cloud, 0 in precip | neutral, closed, cold_slow, medium | Flat-Sided Crankbait (142); Tube Jig (140); Rabbit-Strip Leech (150); Articulated Baitfish Streamer (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| New River Appalachian SMB context<br>2025-05-06 dirty big_fish B | 41-59.3F, 7.5 mph wind, 71.8% cloud, 0.1 in precip | neutral, closed, cold_slow, medium | Flat-Sided Crankbait (142); Tube Jig (140); Sculpzilla (152); Articulated Dungeon Streamer (152) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Colorado mountain-west SMB reservoir<br>2025-10-05 clear all_purpose B | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | active, closed, wind_reaction+clear_subtle, medium | Inline Spinner (180); Medium-Diving Crankbait (174); Deceiver (162); Clouser Minnow (164) | CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Colorado mountain-west SMB reservoir<br>2025-10-05 clear big_fish A | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | active, closed, wind_reaction+clear_subtle, medium | Compact Glide Bait (178); Magnum Jerkbait (170); Articulated Baitfish Streamer (146); Game Changer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Colorado mountain-west SMB reservoir<br>2025-10-05 clear big_fish B | 47.5-74.9F, 7.6 mph wind, 6.3% cloud, 0 in precip | active, closed, wind_reaction+clear_subtle, medium | Big Smallmouth Tube (168); Football Jig (140); Zonker Streamer (150); Rabbit-Strip Leech (126) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 clear big_fish A | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+open_water_search, medium | Big Smallmouth Tube (166); Magnum Jerkbait (162); Game Changer (156); Articulated Baitfish Streamer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear big_fish A | 56.4-75.1F, 16 mph wind, 68.1% cloud, 1 in precip | active, closed, wind_reaction, medium | Compact Glide Bait (152); Magnum Jerkbait (144); Articulated Baitfish Streamer (136); Game Changer (144) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest natural lake<br>2025-07-16 clear big_fish A | 57.1-64.2F, 14 mph wind, 99.9% cloud, 0.4 in precip | neutral, closed, wind_reaction, medium | Big Smallmouth Tube (152); Compact Glide Bait (168); Game Changer (160); Articulated Baitfish Streamer (152) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest natural lake<br>2025-07-16 stained big_fish A | 57.1-64.2F, 14 mph wind, 99.9% cloud, 0.4 in precip | neutral, closed, wind_reaction+dirty_vibration, medium | Compact Glide Bait (168); Big Smallmouth Tube (152); Articulated Baitfish Streamer (160); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Mille Lacs / Upper Midwest natural lake<br>2025-09-20 clear big_fish A | 61.3-71.1F, 8.2 mph wind, 63.6% cloud, 0.1 in precip | active, caution, wind_reaction, medium | Football Jig (140); Glide Bait (162); Articulated Baitfish Streamer (146); Game Changer (154) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Ozark Current River smallmouth context<br>2025-04-05 dirty big_fish B | 45-55F, 11.3 mph wind, 100% cloud, 2 in precip | suppressed, closed, dirty_vibration+cold_slow+current_swing, medium | Bladed Jig (150); Squarebill Crankbait (140); Rabbit-Strip Leech (150); Articulated Baitfish Streamer (154) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Ozark Current River smallmouth context<br>2025-05-06 stained all_purpose B | 46.3-70F, 4.1 mph wind, 65.2% cloud, 0 in precip | neutral, closed, cold_slow, medium | Finesse Jig (170); Ned Rig (170); Sculpin Streamer (176); Rabbit-Strip Leech (158) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear big_fish A | 70.5-81.5F, 9.8 mph wind, 66.2% cloud, 0.1 in precip | neutral, caution, wind_reaction+open_water_search, medium | Big Smallmouth Tube (152); Compact Glide Bait (184); Game Changer (176); Articulated Baitfish Streamer (168) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear big_fish B | 70.5-81.5F, 9.8 mph wind, 66.2% cloud, 0.1 in precip | neutral, caution, wind_reaction+open_water_search, medium | Medium-Diving Crankbait (178); Inline Spinner (172); Baitfish Slider Fly (162); Zonker Streamer (172) | BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE |
| Table Rock / Ozark clear reservoir<br>2025-10-20 clear all_purpose B | 47.1-75.5F, 9.8 mph wind, 6.3% cloud, 0 in precip | suppressed, closed, clear_subtle+cold_slow, medium | Texas-Rigged Soft-Plastic Craw (186); Ned Rig (186); Woolly Bugger (168); Jighead Marabou Leech (158) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Table Rock / Ozark clear reservoir<br>2025-10-20 clear big_fish A | 47.1-75.5F, 9.8 mph wind, 6.3% cloud, 0 in precip | suppressed, closed, clear_subtle+cold_slow, medium | Magnum Jerkbait (186); Compact Glide Bait (178); Rabbit-Strip Leech (142); Game Changer (154) | ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |
| Table Rock / Ozark clear reservoir<br>2025-10-20 stained all_purpose A | 47.1-75.5F, 9.8 mph wind, 6.3% cloud, 0 in precip | suppressed, closed, cold_slow, medium | Tube Jig (182); Texas-Rigged Soft-Plastic Craw (170); Warmwater Crawfish Fly (176); Woolly Bugger (168) | ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 clear big_fish A | 55.2-76F, 9.6 mph wind, 72.6% cloud, 0 in precip | active, closed, wind_reaction, medium | Magnum Jerkbait (154); Football Jig (140); Game Changer (154); Articulated Baitfish Streamer (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Lake Champlain SMB water<br>2025-08-14 clear all_purpose A | 69.7-77F, 8.8 mph wind, 18.6% cloud, 0 in precip | active, caution, wind_reaction+clear_subtle+open_water_search, medium | Soft Plastic Jerkbait (192); Carolina-Rigged Stick Worm (166); Zonker Streamer (184); Game Changer (168) | WIND_NOT_ELEVATING_REACTION, CLEAR_BRIGHT_NOT_ELEVATING_SUBTLE |
| Lake Champlain SMB water<br>2025-08-14 clear big_fish B | 69.7-77F, 8.8 mph wind, 18.6% cloud, 0 in precip | active, caution, wind_reaction+clear_subtle+open_water_search, medium | Medium-Diving Crankbait (178); Suspending Jerkbait (172); Unweighted Baitfish Streamer (162); Baitfish Slider Fly (162) | BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE |
| Door County / Green Bay smallmouth lake<br>2025-06-21 clear big_fish A | 58-83.1F, 13.5 mph wind, 64.8% cloud, 1.3 in precip | neutral, caution, wind_reaction, medium | Glide Bait (152); Big Smallmouth Tube (152); Articulated Baitfish Streamer (136); Game Changer (144) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| New River Appalachian SMB context<br>2025-03-26 stained big_fish B | 30.3-45F, 10.4 mph wind, 64.7% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Suspending Jerkbait (146); Tube Jig (162); Articulated Baitfish Streamer (140); Game Changer (134) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| New River Appalachian SMB context<br>2025-05-06 clear big_fish B | 41-59.3F, 7.5 mph wind, 71.8% cloud, 0.1 in precip | neutral, closed, cold_slow, medium | Flat-Sided Crankbait (150); Tube Jig (148); Game Changer (144); Articulated Dungeon Streamer (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| New River Appalachian SMB context<br>2025-05-06 stained all_purpose B | 41-59.3F, 7.5 mph wind, 71.8% cloud, 0.1 in precip | neutral, closed, cold_slow, medium | Finesse Jig (170); Ned Rig (170); Sculpin Streamer (176); Jighead Marabou Leech (158) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| New River Appalachian SMB context<br>2025-05-06 stained big_fish B | 41-59.3F, 7.5 mph wind, 71.8% cloud, 0.1 in precip | neutral, closed, cold_slow, medium | Flat-Sided Crankbait (150); Tube Jig (148); Sculpzilla (152); Articulated Baitfish Streamer (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Trinity Lake northern California SMB water<br>2025-05-23 clear all_purpose B | 44.6-79.2F, 4 mph wind, 21.7% cloud, 0 in precip | neutral, closed, clear_subtle+cold_slow, medium | Finesse Jig (186); Carolina-Rigged Stick Worm (186); Jighead Marabou Leech (158); Clouser Minnow (154) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Trinity Lake northern California SMB water<br>2025-05-23 dirty all_purpose B | 44.6-79.2F, 4 mph wind, 21.7% cloud, 0 in precip | neutral, closed, cold_slow, medium | Ned Rig (154); Suspending Jerkbait (162); Warmwater Crawfish Fly (160); Lead-Eye Leech (142) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Trinity Lake northern California SMB water<br>2025-10-25 dirty all_purpose B | 42.6-52.6F, 7.5 mph wind, 91.4% cloud, 1 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Medium-Diving Crankbait (174); Bladed Jig (162); Zonker Streamer (154); Warmwater Crawfish Fly (160) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Trinity Lake northern California SMB water<br>2025-10-25 stained all_purpose B | 42.6-52.6F, 7.5 mph wind, 91.4% cloud, 1 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, medium | Medium-Diving Crankbait (174); Tube Jig (176); Zonker Streamer (162); Woolly Bugger (168) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Colorado mountain-west SMB reservoir<br>2025-06-22 clear all_purpose B | 61.5-93.6F, 6.5 mph wind, 0% cloud, 0 in precip | neutral, caution, clear_subtle, medium | Tube Jig (182); Carolina-Rigged Stick Worm (170); Lead-Eye Leech (152); Clouser Minnow (154) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |

## Known Coverage Gaps

- heat_limited_finesse: not naturally produced by completed archive rows.
- stable_pleasant_high_confidence: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
