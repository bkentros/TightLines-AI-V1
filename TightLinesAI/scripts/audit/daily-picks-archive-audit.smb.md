# FinFindr SMB Daily-Picks Archive Audit
Generated: 2026-05-18T13:27:39.700Z

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
| breezy_windy_stained_reaction | 48 |
| dirty_vibration | 68 |
| cold_slow_or_front | 300 |
| warming_search | 48 |
| heat_limited_finesse | 0 |
| stable_pleasant_high_confidence | 168 |
| stable_pleasant_medium_confidence_archive | 0 |
| river_elevated_runoff_current | 60 |
| medium_confidence_archive | 0 |
| missing_or_low_confidence_inputs | 0 |
| adjacent_day_similar | 0 |
| adjacent_day_change | 2 |

## Adjacent-Day Coverage

| Pair | Class | Wind delta | Temp delta | Tag delta |
| --- | --- | --- | --- | --- |
| Table Rock / Ozark clear reservoir<br>2025-10-19 -> 2025-10-20 | changed | 1.6 | 9.0 | cold_slow -> wind_reaction|dirty_vibration|cold_slow |
| Mille Lacs / Upper Midwest natural lake<br>2025-09-20 -> 2025-09-21 | changed | 2.9 | 1.1 | none -> calm_surface |

## Hard Fails

None.

None.

## Credibility Warnings By Condition Bucket

| Bucket | Runs with warnings | Top warning codes |
| --- | --- | --- |
| breezy_windy_stained_reaction | 15 | WIND_NOT_ELEVATING_REACTION (9), BIG_FISH_NOT_FAVORING_UPSIDE (7) |
| cold_slow_or_front | 50 | BIG_FISH_NOT_FAVORING_UPSIDE (38), WIND_NOT_ELEVATING_REACTION (14), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2), COLD_CLEAR_TOO_FAST (1) |
| dirty_vibration | 15 | WIND_NOT_ELEVATING_REACTION (8), BIG_FISH_NOT_FAVORING_UPSIDE (6), DIRTY_WIND_NOT_ELEVATING_VIBRATION (3) |
| river_elevated_runoff_current | 6 | BIG_FISH_NOT_FAVORING_UPSIDE (4), DIRTY_WIND_NOT_ELEVATING_VIBRATION (2) |
| stable_pleasant_high_confidence | 26 | WIND_NOT_ELEVATING_REACTION (25), BIG_FISH_NOT_FAVORING_UPSIDE (4), DIRTY_WIND_NOT_ELEVATING_VIBRATION (1) |
| unclassified | 1 | BIG_FISH_NOT_FAVORING_UPSIDE (1) |
| warming_search | 1 | BIG_FISH_NOT_FAVORING_UPSIDE (1) |

- BIG_FISH_NOT_FAVORING_UPSIDE: 44
- WIND_NOT_ELEVATING_REACTION: 39
- DIRTY_WIND_NOT_ELEVATING_VIBRATION: 3
- COLD_CLEAR_TOO_FAST: 1

- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Jigged Marabou Leech (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Bladed Jig (lure); Zonker Streamer (fly); Jigged Marabou Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Paddle-Tail Swimbait (lure); Tube Jig (lure); Clouser Minnow (fly); Lead-Eye Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Big Tube Jig (lure); Game Changer (fly); Articulated Baitfish (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Football Jig (lure); Game Changer (fly); Articulated Baitfish (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Football Jig (lure); Compact Glide Bait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Tube Jig (lure); Compact Glide Bait (lure); Articulated Baitfish (fly); Baitfish Slider (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Squarebill Crankbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Medium-Diving Crankbait (lure); Articulated Baitfish (fly); Jigged Marabou Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Suspending Jerkbait (lure); Rabbit-Strip Leech (fly); Dungeon Streamer (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Texas-Rigged Craw (lure); Medium-Diving Crankbait (lure); Dungeon Streamer (fly); Rabbit-Strip Leech (fly)
- mo_table_rock__2025-02-20__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Texas-Rigged Craw (lure); Suspending Jerkbait (lure); Game Changer (fly); Jigged Marabou Leech (fly)
- mo_table_rock__2025-02-20__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Suspending Jerkbait (lure); Articulated Baitfish (fly); Jigged Marabou Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__clear__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Big Tube Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Articulated Baitfish (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__stained__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Medium-Diving Crankbait (lure); Blade Bait (lure); Zonker Streamer (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Big Tube Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__dirty__big_fish__A: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Medium-Diving Crankbait (lure); Blade Bait (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Finesse Jig (lure); Medium-Diving Crankbait (lure); Rabbit-Strip Leech (fly); Dungeon Streamer (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Texas-Rigged Craw (lure); Spinnerbait (lure); Articulated Baitfish (fly); Muddler Minnow (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__dirty__big_fish__A: DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Magnum Jerkbait (lure); Big Tube Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Texas-Rigged Craw (lure); Inline Spinner (lure); Sculpzilla (fly); Dungeon Streamer (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Squarebill Crankbait (lure); Game Changer (fly); Baitfish Slider (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Big Tube Jig (lure); Zonker Streamer (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- ca_trinity__2025-03-30__freshwater_lake_pond__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Big Tube Jig (lure); Magnum Jerkbait (lure); Woolly Bugger (fly); Jigged Marabou Leech (fly)
- ca_trinity__2025-03-30__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Big Tube Jig (lure); Magnum Jerkbait (lure); Woolly Bugger (fly); Jigged Marabou Leech (fly)
- wv_new_river_smb__2025-04-04__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Drop-Shot Minnow (lure); Crawfish Streamer (fly); Dungeon Streamer (fly)
- mo_current_river__2025-04-05__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Hair Jig (lure); Inline Spinner (lure); Rabbit-Strip Leech (fly); Dungeon Streamer (fly)
- mo_current_river__2025-04-05__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Spinnerbait (lure); Sculpzilla (fly); Dungeon Streamer (fly)
- mo_current_river__2025-04-05__freshwater_river__dirty__big_fish__A: DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Big Tube Jig (lure); Magnum Jerkbait (lure); Rabbit-Strip Leech (fly); Dungeon Streamer (fly)
- mo_current_river__2025-04-05__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Squarebill Crankbait (lure); Sculpzilla (fly); Game Changer (fly)
- mo_table_rock__2025-04-24__freshwater_lake_pond__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Crawfish Fly (fly); Articulated Baitfish (fly)
- mo_current_river__2025-05-06__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Game Changer (fly); Crawfish Streamer (fly)
- mo_current_river__2025-05-06__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Rabbit-Strip Leech (fly); Game Changer (fly)
- mo_current_river__2025-05-06__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Flat-Sided Crankbait (lure); Sculpzilla (fly); Dungeon Streamer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Sculpzilla (fly); Game Changer (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Flat-Sided Crankbait (lure); Dungeon Streamer (fly); Sculpzilla (fly)
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__dirty__big_fish__B: COLD_CLEAR_TOO_FAST. Picks: Football Jig (lure); Buzzbait (lure); Game Changer (fly); Crawfish Fly (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Compact Glide Bait (lure); Big Tube Jig (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__stained__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Big Tube Jig (lure); Crawfish Fly (fly); Articulated Baitfish (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__dirty__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Bladed Jig (lure); Football Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- co_yampa__2025-05-19__freshwater_river__clear__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Finesse Jig (lure); Flat-Sided Crankbait (lure); Dungeon Streamer (fly); Sculpzilla (fly)
- co_yampa__2025-05-19__freshwater_river__stained__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Flat-Sided Crankbait (lure); Rabbit-Strip Leech (fly); Game Changer (fly)
- co_yampa__2025-05-19__freshwater_river__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Flat-Sided Crankbait (lure); Dungeon Streamer (fly); Sculpin Streamer (fly)
- ca_trinity__2025-05-23__freshwater_lake_pond__dirty__big_fish__B: BIG_FISH_NOT_FAVORING_UPSIDE. Picks: Blade Bait (lure); Flat-Sided Crankbait (lure); Crawfish Fly (fly); Articulated Baitfish (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Ned Rig (lure); Inline Spinner (lure); Crawfish Fly (fly); Clouser Minnow (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Magnum Jerkbait (lure); Big Tube Jig (lure); Game Changer (fly); Deceiver (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__stained__big_fish__A: WIND_NOT_ELEVATING_REACTION. Picks: Suspending Jerkbait (lure); Big Tube Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__dirty__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Squarebill Crankbait (lure); Compact Glide Bait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mo_current_river__2025-06-14__freshwater_river__dirty__all_purpose__A: DIRTY_WIND_NOT_ELEVATING_VIBRATION. Picks: Bladed Jig (lure); Blade Bait (lure); Clouser Minnow (fly); Slim Baitfish Streamer (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__clear__all_purpose__A: WIND_NOT_ELEVATING_REACTION. Picks: Paddle-Tail Swimbait (lure); Squarebill Crankbait (lure); Game Changer (fly); Baitfish Slider (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__clear__all_purpose__B: WIND_NOT_ELEVATING_REACTION. Picks: Inline Spinner (lure); Blade Bait (lure); Clouser Minnow (fly); Unweighted Baitfish (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__clear__big_fish__B: WIND_NOT_ELEVATING_REACTION. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Unweighted Baitfish (fly)

## Variety Warnings

Audit priority: top/honorable same-family on the same side is a hard invariant. Set B exact-ID reuse is a real variety failure unless scarcity makes it unavoidable. Set B same-family or same-presentation overlap with Set A is advisory/watch only when exact IDs are avoided and the top/honorable family invariant holds. Top/honorable same presentation with different families is acceptable.

- SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE: 47
- SET_B_ID_OVERLAP_AVOIDABLE: 25
- ADJACENT_DAY_EXACT_REPEAT: 7
- SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE: 5

- wv_new_river_smb__2025-03-26__freshwater_river__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Woolly Bugger (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Texas-Rigged Craw (lure); Zonker Streamer (fly); Jigged Marabou Leech (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Spinnerbait (lure); Zonker Streamer (fly); Lead-Eye Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Spinnerbait (lure); Deep-Diving Crankbait (lure); Deceiver (fly); Jigged Marabou Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Deep-Diving Crankbait (lure); Zonker Streamer (fly); Lead-Eye Leech (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- wi_upper_mississippi__2025-09-29__freshwater_river__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Walking Bait (lure); Big Tube Jig (lure); Mouse Pattern (fly); Articulated Baitfish (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__clear__all_purpose__B: ADJACENT_DAY_EXACT_REPEAT. Picks: Ned Rig (lure); Drop-Shot Minnow (lure); Lead-Eye Leech (fly); Woolly Bugger (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT. Picks: Bladed Jig (lure); Texas-Rigged Craw (lure); Zonker Streamer (fly); Crawfish Fly (fly)
- wi_door_county__2025-12-12__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Tube Jig (lure); Bladed Jig (lure); Deceiver (fly); Jigged Marabou Leech (fly)
- wi_door_county__2025-12-12__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Texas-Rigged Craw (lure); Deceiver (fly); Jigged Marabou Leech (fly)
- vt_champlain_smb__2025-12-12__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Football Jig (lure); Suspending Jerkbait (lure); Dungeon Streamer (fly); Jigged Marabou Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Inline Spinner (lure); Lead-Eye Leech (fly); Clouser Minnow (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Medium-Diving Crankbait (lure); Zonker Streamer (fly); Jigged Marabou Leech (fly)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Medium-Diving Crankbait (lure); Articulated Baitfish (fly); Jigged Marabou Leech (fly)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Tube Jig (lure); Drop-Shot Minnow (lure); Muddler Minnow (fly); Clouser Minnow (fly)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Tube Jig (lure); Suspending Jerkbait (lure); Jigged Marabou Leech (fly); Zonker Streamer (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Paddle-Tail Swimbait (lure); Tube Jig (lure); Clouser Minnow (fly); Lead-Eye Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Big Tube Jig (lure); Magnum Jerkbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs__2025-03-20__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Magnum Jerkbait (lure); Football Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__clear__big_fish__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Finesse Jig (lure); Medium-Diving Crankbait (lure); Rabbit-Strip Leech (fly); Dungeon Streamer (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__stained__all_purpose__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Finesse Jig (lure); Bladed Jig (lure); Crawfish Streamer (fly); Woolly Bugger (fly)
- wv_new_river_smb__2025-03-26__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Texas-Rigged Craw (lure); Spinnerbait (lure); Articulated Baitfish (fly); Muddler Minnow (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Ned Rig (lure); Zonker Streamer (fly); Jigged Marabou Leech (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Football Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- tn_dale_hollow__2025-03-28__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Jigged Marabou Leech (fly)
- ca_trinity__2025-03-30__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Big Tube Jig (lure); Magnum Jerkbait (lure); Woolly Bugger (fly); Jigged Marabou Leech (fly)
- ca_trinity__2025-03-30__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Big Tube Jig (lure); Magnum Jerkbait (lure); Woolly Bugger (fly); Jigged Marabou Leech (fly)
- wv_new_river_smb__2025-04-04__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Magnum Jerkbait (lure); Squarebill Crankbait (lure); Articulated Baitfish (fly); Marabou Jig Leech (fly)
- mo_current_river__2025-04-05__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Suspending Jerkbait (lure); Sculpin Streamer (fly); Clouser Minnow (fly)
- mo_current_river__2025-05-06__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Sculpin Streamer (fly); Clouser Minnow (fly)
- mo_current_river__2025-05-06__freshwater_river__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Texas-Rigged Craw (lure); Paddle-Tail Swimbait (lure); Sculpin Streamer (fly); Clouser Minnow (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Sculpin Streamer (fly); Clouser Minnow (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Sculpin Streamer (fly); Clouser Minnow (fly)
- wv_new_river_smb__2025-05-06__freshwater_river__stained__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Ned Rig (lure); Unweighted Baitfish (fly); Deceiver (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Inline Spinner (lure); Soft Jerkbait (lure); Zonker Streamer (fly); Baitfish Slider (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Texas-Rigged Craw (lure); Zonker Streamer (fly); Baitfish Slider (fly)
- mn_mille_lacs__2025-05-15__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Squarebill Crankbait (lure); Compact Glide Bait (lure); Deceiver (fly); Rabbit-Strip Leech (fly)
- co_yampa__2025-05-19__freshwater_river__clear__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Sculpin Streamer (fly); Clouser Minnow (fly)
- co_yampa__2025-05-19__freshwater_river__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Ned Rig (lure); Flat-Sided Crankbait (lure); Sculpin Streamer (fly); Clouser Minnow (fly)
- co_yampa__2025-05-19__freshwater_river__dirty__big_fish__B: SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE. Picks: Blade Bait (lure); Flat-Sided Crankbait (lure); Dungeon Streamer (fly); Sculpin Streamer (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Soft Jerkbait (lure); Zonker Streamer (fly); Baitfish Slider (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Suspending Jerkbait (lure); Texas-Rigged Craw (lure); Zonker Streamer (fly); Baitfish Slider (fly)
- wi_door_county__2025-05-23__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Squarebill Crankbait (lure); Compact Glide Bait (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Blade Bait (lure); Zonker Streamer (fly); Unweighted Baitfish (fly)
- mo_table_rock__2025-06-18__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Blade Bait (lure); Deceiver (fly); Unweighted Baitfish (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__clear__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Big Tube Jig (lure); Glide Bait (lure); Zonker Streamer (fly); Deer Hair Slider (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Soft Jerkbait (lure); Zonker Streamer (fly); Unweighted Baitfish (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Weightless Stick Worm (lure); Zonker Streamer (fly); Crawfish Fly (fly)
- wi_door_county__2025-06-21__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Buzzbait (lure); Zonker Streamer (fly); Deer Hair Slider (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Squarebill Crankbait (lure); Zonker Streamer (fly); Crawfish Fly (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Inline Spinner (lure); Big Tube Jig (lure); Zonker Streamer (fly); Rabbit-Strip Leech (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__dirty__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Spinnerbait (lure); Soft Jerkbait (lure); Zonker Streamer (fly); Crawfish Fly (fly)
- mn_mille_lacs__2025-07-16__freshwater_lake_pond__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Bladed Jig (lure); Squarebill Crankbait (lure); Game Changer (fly); Rabbit-Strip Leech (fly)
- co_yampa__2025-07-12__freshwater_river__dirty__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Medium-Diving Crankbait (lure); Big Tube Jig (lure); Articulated Baitfish (fly); Rabbit-Strip Leech (fly)
- wi_upper_mississippi__2025-09-29__freshwater_river__stained__big_fish__B: SET_B_ID_OVERLAP_AVOIDABLE. Picks: Walking Bait (lure); Magnum Jerkbait (lure); Sculpzilla (fly); Mouse Pattern (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__clear__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Tube Jig (lure); Suspending Jerkbait (lure); Crawfish Fly (fly); Deceiver (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__stained__all_purpose__A: ADJACENT_DAY_EXACT_REPEAT. Picks: Suspending Jerkbait (lure); Tube Jig (lure); Deceiver (fly); Crawfish Fly (fly)
- mo_table_rock__2025-10-20__freshwater_lake_pond__stained__all_purpose__B: SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE. Picks: Bladed Jig (lure); Finesse Jig (lure); Zonker Streamer (fly); Jigged Marabou Leech (fly)

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
| May | great_lakes_upper_midwest | cooling_or_shock:1, stable:1 |
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
| Aug | great_lakes_upper_midwest | open | low_light | all_purpose | 6 | 70.1-79.1F | 5.8 |
| Aug | great_lakes_upper_midwest | open | low_light | big_fish | 6 | 70.1-79.1F | 5.8 |
| Aug | inland_northwest | open | glare | all_purpose | 6 | 55.5-86.1F | 2.5 |
| Aug | inland_northwest | open | glare | big_fish | 6 | 55.5-86.1F | 2.5 |
| Aug | mountain_west | caution | bright | big_fish | 3 | 60.3-86.9F | 7.6 |
| Aug | northeast | caution | bright | big_fish | 3 | 69.7-77.0F | 8.8 |
| Jul | great_lakes_upper_midwest | caution | low_light | big_fish | 3 | 57.1-64.2F | 14 |
| Jul | mountain_west | caution | bright | big_fish | 5 | 54.6-84.6F | 6.2 |
| Jul | northern_california | open | bright | all_purpose | 5 | 64.6-97.2F | 5.3 |
| Jul | northern_california | open | bright | big_fish | 6 | 64.6-97.2F | 5.3 |
| Jun | appalachian | caution | low_light | big_fish | 6 | 64.2-78.3F | 6.2 |
| Jun | great_lakes_upper_midwest | caution | mixed | big_fish | 6 | 58.0-83.1F | 13.5 |
| Jun | inland_northwest | open | low_light | all_purpose | 5 | 57.8-79.1F | 3.2 |
| Jun | inland_northwest | open | low_light | big_fish | 6 | 57.8-79.1F | 3.2 |
| Jun | mountain_west | caution | glare | big_fish | 4 | 61.5-93.6F | 6.5 |
| Jun | northeast | open | mixed | all_purpose | 5 | 58.4-74.2F | 5.2 |
| Jun | northeast | open | mixed | big_fish | 6 | 58.4-74.2F | 5.2 |
| Jun | south_central | caution | low_light | all_purpose | 4 | 67.5-81.1F | 6.9 |
| Jun | south_central | caution | low_light | big_fish | 6 | 67.5-81.1F | 6.9 |
| Jun | south_central | caution | mixed | big_fish | 2 | 70.5-81.5F | 9.8 |
| Jun | south_central | open | mixed | all_purpose | 4 | 65.0-82.3F | 5.7 |
| Jun | south_central | open | mixed | big_fish | 6 | 65.0-82.3F | 5.7 |
| May | south_central | caution | low_light | big_fish | 3 | 51.3-69.4F | 8.2 |
| Sep | appalachian | open | low_light | all_purpose | 3 | 55.8-73.2F | 5.6 |
| Sep | appalachian | open | low_light | big_fish | 6 | 55.8-73.2F | 5.6 |
| Sep | great_lakes_upper_midwest | caution | mixed | big_fish | 3 | 61.3-71.1F | 8.2 |
| Sep | great_lakes_upper_midwest | open | bright | all_purpose | 6 | 58.9-83.6F | 4.1 |
| Sep | great_lakes_upper_midwest | open | bright | big_fish | 6 | 58.9-83.6F | 4.1 |
| Sep | great_lakes_upper_midwest | open | mixed | all_purpose | 6 | 60.7-71.1F | 5.3 |
| Sep | great_lakes_upper_midwest | open | mixed | big_fish | 6 | 60.7-71.1F | 5.3 |

### Shoulder-Season Topwater Selections

None.

## Water Column Diversity Diagnostics

### Same-Side Surface/Surface Summary

None.

### Remaining Same-Side Surface/Surface Examples

None.

### Same-Side Column/Band Summary

| Side | Same exact column | Same broad band | Same broad band with close different-band alt |
| --- | --- | --- | --- |
| lure | 22 | 22 | 4 |
| fly | 10 | 10 | 5 |

### Surface/Upper Watch Summary

| Metric | Runs | With close lower-column alt |
| --- | --- | --- |
| open-surface rows | 108 | - |
| open-surface rows with 2+ surface picks | 66 | 66 |
| open-surface rows with 3+ surface picks | 0 | 0 |
| open-surface rows with 3+ surface/upper picks (watch-only) | 8 | 8 |
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
| exact_id | truly_avoidable | 14 | 11 | 25 |
| exact_id | unavoidable_due_score_band | 2 | 7 | 9 |
| exact_id | unavoidable_due_goal_condition_fit | 3 | 0 | 3 |
| same_family_same_presentation | truly_avoidable | 1 | 46 | 47 |
| same_family_same_presentation | unavoidable_due_score_band | 1 | 26 | 27 |
| same_family_same_presentation | unavoidable_because_only_alternative_already_selected_in_set_b | 0 | 2 | 2 |
| same_family_same_presentation | unavoidable_due_goal_condition_fit | 0 | 10 | 10 |
| same_family_different_presentation | truly_avoidable | 0 | 5 | 5 |
| same_family_different_presentation | unavoidable_due_score_band | 0 | 6 | 6 |
| same_family_different_presentation | unavoidable_due_goal_condition_fit | 0 | 2 | 2 |

### Top True Set B Variety Examples

| Scenario | Issue | Set A | Set B | Close alternative |
| --- | --- | --- | --- | --- |
| Dale Hollow / Tennessee highland reservoir<br>2025-11-08 stained big_fish | lure honorable: same_family_same_presentation | Big Tube Jig (182); Magnum Jerkbait (168) | Football Jig (176); Suspending Jerkbait (130) | Ned Rig (174, alt edge 44) |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear all_purpose | lure honorable: exact_id | Ned Rig (214); Suspending Jerkbait (176) | Tube Jig (210); Suspending Jerkbait (176) | Finesse Jig (210, alt edge 34) |
| Lake Champlain SMB water<br>2025-12-12 stained big_fish | lure honorable: exact_id | Blade Bait (172); Suspending Jerkbait (136) | Ned Rig (168); Suspending Jerkbait (136) | Football Jig (170, alt edge 34) |
| New River Appalachian SMB context<br>2025-03-26 clear all_purpose | lure honorable: exact_id | Ned Rig (214); Suspending Jerkbait (176) | Finesse Jig (210); Suspending Jerkbait (176) | Texas-Rigged Craw (210, alt edge 34) |
| Dworshak / inland northwest SMB reservoir<br>2025-11-15 clear all_purpose | lure honorable: exact_id | Ned Rig (214); Drop-Shot Minnow (180) | Texas-Rigged Craw (210); Drop-Shot Minnow (180) | Finesse Jig (210, alt edge 30) |
| Upper Mississippi smallmouth river<br>2025-01-26 clear all_purpose | lure honorable: exact_id | Ned Rig (214); Drop-Shot Minnow (180) | Tube Jig (210); Drop-Shot Minnow (180) | Finesse Jig (210, alt edge 30) |
| Lake Champlain SMB water<br>2025-12-12 clear big_fish | lure honorable: exact_id | Ned Rig (168); Suspending Jerkbait (136) | Football Jig (170); Suspending Jerkbait (136) | Finesse Jig (164, alt edge 28) |
| New River Appalachian SMB context<br>2025-03-26 clear all_purpose | fly honorable: exact_id | Muddler Minnow (196); Woolly Bugger (162) | Sculpin Streamer (196); Woolly Bugger (162) | Crawfish Streamer (190, alt edge 28) |
| New River Appalachian SMB context<br>2025-03-26 stained all_purpose | fly honorable: exact_id | Muddler Minnow (190); Woolly Bugger (162) | Crawfish Streamer (184); Woolly Bugger (162) | Sculpin Streamer (190, alt edge 28) |
| Mille Lacs / Upper Midwest natural lake<br>2025-07-16 stained big_fish | fly honorable: exact_id | Deceiver (156); Rabbit-Strip Leech (134) | Zonker Streamer (156); Rabbit-Strip Leech (134) | Articulated Baitfish (160, alt edge 26) |
| Door County / Green Bay smallmouth lake<br>2025-06-21 clear big_fish | fly honorable: exact_id | Deer Hair Slider (120); Rabbit-Strip Leech (126) | Zonker Streamer (140); Deer Hair Slider (120) | Game Changer (144, alt edge 24) |
| Mille Lacs / Upper Midwest natural lake<br>2025-07-16 dirty big_fish | fly honorable: exact_id | Zonker Streamer (148); Rabbit-Strip Leech (134) | Game Changer (160); Rabbit-Strip Leech (134) | Deceiver (156, alt edge 22) |
| New River Appalachian SMB context<br>2025-03-26 stained big_fish | fly top: same_family_different_presentation | Dungeon Streamer (156); Rabbit-Strip Leech (164) | Articulated Baitfish (140); Muddler Minnow (162) | Sculpin Streamer (162, alt edge 22) |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 stained all_purpose | fly honorable: same_family_same_presentation | Zonker Streamer (170); Lead-Eye Leech (146) | Deceiver (164); Jigged Marabou Leech (146) | Clouser Minnow (166, alt edge 20) |
| Upper Mississippi smallmouth river<br>2025-09-29 dirty big_fish | fly honorable: same_family_different_presentation | Deer Hair Slider (160); Dungeon Streamer (162) | Mouse Pattern (154); Articulated Baitfish (154) | Foam Gurgler (174, alt edge 20) |

## Goal Contrast Diagnostics

### All-Purpose vs Big-Fish Near-Identical Picks

| Scenario | Set | Overlap | All-purpose | Big-fish |
| --- | --- | --- | --- | --- |
| Upper Mississippi smallmouth river<br>2025-01-26 clear | A | 3/4 | Ned Rig; Drop-Shot Minnow; Crawfish Streamer; Woolly Bugger | Ned Rig; Drop-Shot Minnow; Game Changer; Crawfish Streamer |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 dirty | A | 3/4 | Blade Bait; Medium-Diving Crankbait; Deceiver; Jigged Marabou Leech | Medium-Diving Crankbait; Blade Bait; Deceiver; Rabbit-Strip Leech |
| Door County / Green Bay smallmouth lake<br>2025-12-12 dirty | A | 3/4 | Blade Bait; Inline Spinner; Zonker Streamer; Rabbit-Strip Leech | Blade Bait; Medium-Diving Crankbait; Zonker Streamer; Rabbit-Strip Leech |

### Big-Fish Sides With No Explicit Big-Fish Score Reason

| Scenario | Side | Selected |
| --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 clear A | lure | Blade Bait; Suspending Jerkbait |
| Lake Champlain SMB water<br>2025-01-18 clear B | lure | Ned Rig; Medium-Diving Crankbait |
| Lake Champlain SMB water<br>2025-01-18 clear B | fly | Zonker Streamer; Jigged Marabou Leech |
| Lake Champlain SMB water<br>2025-01-18 stained A | lure | Blade Bait; Suspending Jerkbait |
| Lake Champlain SMB water<br>2025-01-18 stained B | lure | Ned Rig; Medium-Diving Crankbait |
| Lake Champlain SMB water<br>2025-01-18 dirty A | lure | Blade Bait; Suspending Jerkbait |
| Upper Mississippi smallmouth river<br>2025-01-26 clear A | lure | Ned Rig; Drop-Shot Minnow |
| Upper Mississippi smallmouth river<br>2025-01-26 clear B | lure | Finesse Jig; Suspending Jerkbait |
| Upper Mississippi smallmouth river<br>2025-01-26 stained A | lure | Ned Rig; Finesse Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 stained B | lure | Texas-Rigged Craw; Tube Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty A | lure | Texas-Rigged Craw; Finesse Jig |
| Upper Mississippi smallmouth river<br>2025-01-26 dirty B | lure | Ned Rig; Blade Bait |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 clear A | lure | Ned Rig; Suspending Jerkbait |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained B | lure | Ned Rig; Bladed Jig |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained B | fly | Zonker Streamer; Jigged Marabou Leech |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty A | lure | Texas-Rigged Craw; Medium-Diving Crankbait |
| Table Rock / Ozark clear reservoir<br>2025-02-20 clear A | lure | Ned Rig; Drop-Shot Minnow |
| Table Rock / Ozark clear reservoir<br>2025-02-20 stained B | lure | Texas-Rigged Craw; Suspending Jerkbait |
| Table Rock / Ozark clear reservoir<br>2025-02-20 dirty B | lure | Blade Bait; Suspending Jerkbait |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 stained A | lure | Medium-Diving Crankbait; Blade Bait |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 dirty A | lure | Medium-Diving Crankbait; Blade Bait |
| New River Appalachian SMB context<br>2025-03-26 clear B | lure | Finesse Jig; Medium-Diving Crankbait |
| New River Appalachian SMB context<br>2025-03-26 stained B | lure | Texas-Rigged Craw; Spinnerbait |
| New River Appalachian SMB context<br>2025-03-26 dirty B | lure | Texas-Rigged Craw; Inline Spinner |
| Trinity Lake northern California SMB water<br>2025-03-30 stained B | fly | Woolly Bugger; Jigged Marabou Leech |
| Trinity Lake northern California SMB water<br>2025-03-30 dirty B | fly | Woolly Bugger; Jigged Marabou Leech |
| New River Appalachian SMB context<br>2025-04-04 clear B | lure | Ned Rig; Drop-Shot Minnow |
| Ozark Current River smallmouth context<br>2025-04-05 clear B | lure | Hair Jig; Inline Spinner |
| Ozark Current River smallmouth context<br>2025-04-05 stained B | lure | Blade Bait; Spinnerbait |
| Ozark Current River smallmouth context<br>2025-04-05 dirty B | lure | Blade Bait; Squarebill Crankbait |
| Table Rock / Ozark clear reservoir<br>2025-04-24 clear B | lure | Ned Rig; Flat-Sided Crankbait |

## Big Fish No-Upside Diagnostics

| Selected no-upside profile | Count | Common close upside alternatives | Avg alt score edge |
| --- | --- | --- | --- |
| Blade Bait [lure] | 14 | Magnum Jerkbait (7), Football Jig (5), Big Tube Jig (2) | 7.9 |
| Ned Rig [lure] | 12 | Football Jig (6), Magnum Jerkbait (5), Big Tube Jig (1) | 11 |
| Flat-Sided Crankbait [lure] | 11 | Magnum Jerkbait (11) | 27.5 |
| Suspending Jerkbait [lure] | 10 | Football Jig (10) | 33.6 |
| Jigged Marabou Leech [fly] | 6 | Rabbit-Strip Leech (5), Game Changer (1) | 17.3 |
| Medium-Diving Crankbait [lure] | 6 | Football Jig (3), Magnum Jerkbait (2), Big Tube Jig (1) | 25.7 |
| Texas-Rigged Craw [lure] | 6 | Big Tube Jig (3), Football Jig (3) | 7.7 |
| Drop-Shot Minnow [lure] | 3 | Big Tube Jig (3) | 31.3 |
| Finesse Jig [lure] | 3 | Big Tube Jig (2), Magnum Jerkbait (1) | 20.7 |
| Woolly Bugger [fly] | 3 | Rabbit-Strip Leech (3) | 30 |
| Zonker Streamer [fly] | 3 | Rabbit-Strip Leech (2), Articulated Baitfish (1) | 15.3 |
| Bladed Jig [lure] | 2 | Buzzbait (1), Football Jig (1) | 28 |
| Inline Spinner [lure] | 2 | Big Tube Jig (2) | 43 |
| Spinnerbait [lure] | 2 | Big Tube Jig (2) | 40 |
| Squarebill Crankbait [lure] | 2 | Big Tube Jig (1), Buzzbait (1) | 28 |

## Pike Big Fish Upside Split Diagnostics

Not applicable.

## Condition Warning Diagnostics

| Scenario | Warning | Selected side | Close fit alternative | Likely selector pressure |
| --- | --- | --- | --- | --- |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (lure) | Paddle-Tail Swimbait (182; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Tube Jig (178; goal:all_purpose:reliable_action:+18) | Inline Spinner (182, alt edge 0) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 clear all_purpose B | WIND_NOT_ELEVATING_REACTION (fly) | Clouser Minnow (166; condition_tag:open_water_search:+16, goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12); Lead-Eye Leech (146; goal:all_purpose:reliable_action:+18) | Zonker Streamer (170, alt edge 4) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (156; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Articulated Baitfish (154; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20) | Zonker Streamer (158, alt edge 2) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (156; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (148; goal:big_fish:big_fish_upside:+20) | Zonker Streamer (158, alt edge 2) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (166; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Football Jig (154; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (158, alt edge -8) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (162; condition_tag:open_water_search:+16, goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (148; goal:big_fish:big_fish_upside:+20) | Deceiver (152, alt edge -10) | goal fit likely competed |
| New River Appalachian SMB context<br>2025-03-26 dirty big_fish A | DIRTY_WIND_NOT_ELEVATING_VIBRATION (lure) | Magnum Jerkbait (160; condition_tag:cold_slow:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Big Tube Jig (174; condition_tag:cold_slow:+16, goal:big_fish:big_fish_upside:+20) | Texas-Rigged Craw (170, alt edge -4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (146; goal:all_purpose:versatile_search:+12); Baitfish Slider (136; goal:all_purpose:versatile_search:+12) | Deceiver (162, alt edge 16) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (166; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Big Tube Jig (152; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge -4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Articulated Baitfish (146; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 stained big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (166; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Big Tube Jig (152; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (162, alt edge -4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 stained big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 dirty big_fish B | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (154; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (150, alt edge -4) | goal fit likely competed |
| Ozark Current River smallmouth context<br>2025-04-05 dirty big_fish A | DIRTY_WIND_NOT_ELEVATING_VIBRATION (lure) | Big Tube Jig (176; condition_tag:cold_slow:+16, condition_tag:current_swing:+16, goal:big_fish:big_fish_upside:+20); Magnum Jerkbait (174; condition_tag:cold_slow:+16, goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Blade Bait (168, alt edge -8) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (156; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Football Jig (140; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (152, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (144; goal:big_fish:big_fish_upside:+20); Articulated Baitfish (136; goal:big_fish:big_fish_upside:+20) | Deceiver (140, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Compact Glide Bait (152; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Big Tube Jig (152; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (152, alt edge 0) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (144; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (140, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 stained big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (156; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Big Tube Jig (152; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (152, alt edge -4) | goal fit likely competed |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 dirty big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (144; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (140, alt edge -4) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-05-23 clear all_purpose A | WIND_NOT_ELEVATING_REACTION (fly) | Crawfish Fly (144; goal:all_purpose:reliable_action:+18); Clouser Minnow (154; goal:all_purpose:reliable_action:+18, goal:all_purpose:versatile_search:+12) | Deceiver (152, alt edge -2) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-05-23 clear big_fish A | WIND_NOT_ELEVATING_REACTION (lure) | Football Jig (140; goal:big_fish:big_fish_upside:+20); Compact Glide Bait (152; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12) | Medium-Diving Crankbait (152, alt edge 0) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-05-23 clear big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Articulated Baitfish (136; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (126; goal:big_fish:big_fish_upside:+20) | Deceiver (140, alt edge 4) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-05-23 clear big_fish B | WIND_NOT_ELEVATING_REACTION (lure) | Magnum Jerkbait (156; goal:big_fish:big_fish_upside:+20, goal:big_fish:high_risk_high_reward:+12); Big Tube Jig (152; goal:big_fish:big_fish_upside:+20) | Medium-Diving Crankbait (152, alt edge -4) | goal fit likely competed |
| Door County / Green Bay smallmouth lake<br>2025-05-23 stained big_fish A | WIND_NOT_ELEVATING_REACTION (fly) | Game Changer (144; goal:big_fish:big_fish_upside:+20); Rabbit-Strip Leech (134; goal:big_fish:big_fish_upside:+20) | Deceiver (140, alt edge -4) | goal fit likely competed |

## Wind Warning Split Diagnostics

| Wind warning split | Rows |
| --- | --- |
| clear_subtle_wind_watch | 17 |
| dirty_vibration_acceptable | 6 |
| other_wind_watch | 5 |
| current_open_water_acceptable | 3 |
| true_dirty_stained_wind_miss | 1 |
| surface_low_light_acceptable | 1 |

| Split | Scenario | Bucket/activity | Lure picks |
| --- | --- | --- | --- |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 all_purpose clear B | stable_pleasant_high_confidence<br>neutral | Paddle-Tail Swimbait 182<br>Tube Jig 178 |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 big_fish clear A | stable_pleasant_high_confidence<br>neutral | Big Tube Jig 166<br>Magnum Jerkbait 174 |
| clear_subtle_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 all_purpose clear A | cold_slow_or_front<br>neutral | Inline Spinner 180<br>Squarebill Crankbait 144 |
| clear_subtle_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish clear A | cold_slow_or_front<br>neutral | Magnum Jerkbait 166<br>Big Tube Jig 152 |
| clear_subtle_wind_watch | Mille Lacs / Upper Midwest natural lake<br>2025-05-15 big_fish clear A | cold_slow_or_front<br>neutral | Magnum Jerkbait 156<br>Football Jig 140 |
| current_open_water_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Big Tube Jig 166<br>Magnum Jerkbait 174 |
| current_open_water_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-03-20 big_fish dirty B | dirty_vibration<br>neutral | Magnum Jerkbait 166<br>Football Jig 154 |
| current_open_water_acceptable | Table Rock / Ozark clear reservoir<br>2025-06-18 big_fish dirty B | dirty_vibration<br>neutral | Big Tube Jig 144<br>Medium-Diving Crankbait 178 |
| other_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Magnum Jerkbait 166<br>Big Tube Jig 152 |
| other_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Dale Hollow / Tennessee highland reservoir<br>2025-03-28 big_fish dirty B | dirty_vibration<br>neutral | Medium-Diving Crankbait 162<br>Football Jig 140 |
| other_wind_watch | Mille Lacs / Upper Midwest natural lake<br>2025-05-15 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 152<br>Football Jig 140 |
| other_wind_watch | Door County / Green Bay smallmouth lake<br>2025-05-23 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Suspending Jerkbait 140<br>Big Tube Jig 152 |
| true_dirty_stained_wind_miss | Mille Lacs / Upper Midwest natural lake<br>2025-05-15 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Magnum Jerkbait 156<br>Big Tube Jig 152 |
| dirty_vibration_acceptable | Mille Lacs / Upper Midwest natural lake<br>2025-05-15 big_fish dirty A | dirty_vibration<br>neutral | Bladed Jig 140<br>Football Jig 140 |
| dirty_vibration_acceptable | Door County / Green Bay smallmouth lake<br>2025-05-23 big_fish dirty B | dirty_vibration<br>neutral | Squarebill Crankbait 150<br>Compact Glide Bait 144 |
| dirty_vibration_acceptable | Table Rock / Ozark clear reservoir<br>2025-06-18 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Buzzbait 150<br>Compact Glide Bait 184 |
| dirty_vibration_acceptable | Table Rock / Ozark clear reservoir<br>2025-06-18 big_fish dirty A | dirty_vibration<br>neutral | Buzzbait 150<br>Compact Glide Bait 176 |
| dirty_vibration_acceptable | Door County / Green Bay smallmouth lake<br>2025-06-21 big_fish stained A | breezy_windy_stained_reaction<br>neutral | Buzzbait 144<br>Big Tube Jig 152 |
| surface_low_light_acceptable | Door County / Green Bay smallmouth lake<br>2025-06-21 big_fish stained B | breezy_windy_stained_reaction<br>neutral | Medium-Diving Crankbait 152<br>Football Jig 140 |

## Guide Verdict Summary

| Exact pick verdict | Pick count |
| --- | --- |
| likely_miss | 0 |
| watch | 397 |
| acceptable_fit | 938 |
| strong_fit | 1113 |

### Bucketed Pick Verdict Counts

| Verdict | Goal | Set | Side | Condition bucket | Pick count |
| --- | --- | --- | --- | --- | --- |
| watch | big_fish | A | fly | cold_slow_or_front | 73 |
| watch | big_fish | B | fly | cold_slow_or_front | 54 |
| watch | big_fish | A | lure | cold_slow_or_front | 37 |
| watch | big_fish | B | lure | cold_slow_or_front | 30 |
| watch | big_fish | B | fly | dirty_vibration | 24 |
| watch | big_fish | A | fly | stable_pleasant_high_confidence | 23 |
| watch | all_purpose | A | fly | cold_slow_or_front | 20 |
| watch | big_fish | A | fly | dirty_vibration | 20 |
| watch | all_purpose | B | fly | cold_slow_or_front | 19 |
| watch | big_fish | B | fly | breezy_windy_stained_reaction | 18 |
| watch | big_fish | A | lure | dirty_vibration | 17 |
| watch | big_fish | B | fly | stable_pleasant_high_confidence | 17 |
| watch | big_fish | B | lure | stable_pleasant_high_confidence | 17 |
| watch | all_purpose | A | fly | stable_pleasant_high_confidence | 16 |
| watch | all_purpose | B | lure | cold_slow_or_front | 16 |
| watch | big_fish | A | fly | breezy_windy_stained_reaction | 16 |
| watch | big_fish | A | lure | stable_pleasant_high_confidence | 15 |
| watch | big_fish | A | lure | breezy_windy_stained_reaction | 14 |
| watch | big_fish | B | fly | river_elevated_runoff_current | 14 |
| watch | big_fish | B | lure | dirty_vibration | 12 |
| watch | big_fish | B | lure | breezy_windy_stained_reaction | 10 |
| watch | all_purpose | B | fly | stable_pleasant_high_confidence | 9 |
| watch | all_purpose | B | lure | stable_pleasant_high_confidence | 7 |
| watch | big_fish | A | fly | river_elevated_runoff_current | 7 |
| watch | all_purpose | A | fly | breezy_windy_stained_reaction | 6 |
| watch | all_purpose | A | fly | dirty_vibration | 6 |
| watch | all_purpose | B | fly | breezy_windy_stained_reaction | 6 |
| watch | all_purpose | B | fly | dirty_vibration | 6 |
| watch | big_fish | A | fly | warming_search | 6 |
| watch | all_purpose | A | lure | cold_slow_or_front | 5 |
| watch | all_purpose | A | lure | stable_pleasant_high_confidence | 5 |
| watch | all_purpose | A | fly | unclassified | 4 |
| watch | all_purpose | B | lure | breezy_windy_stained_reaction | 4 |
| watch | all_purpose | B | lure | dirty_vibration | 4 |
| watch | big_fish | A | lure | warming_search | 4 |
| watch | big_fish | B | fly | warming_search | 4 |
| watch | big_fish | B | lure | unclassified | 4 |
| watch | all_purpose | A | lure | dirty_vibration | 3 |
| watch | big_fish | A | fly | calm_bright_clear_subtle | 3 |
| watch | big_fish | A | fly | unclassified | 3 |
| watch | all_purpose | A | fly | calm_bright_clear_subtle | 2 |
| watch | all_purpose | B | fly | calm_bright_clear_subtle | 2 |
| watch | big_fish | A | lure | calm_low_light_surface | 2 |
| watch | big_fish | A | lure | river_elevated_runoff_current | 2 |
| watch | big_fish | B | fly | calm_low_light_surface | 2 |
| watch | big_fish | B | fly | unclassified | 2 |
| watch | big_fish | B | lure | warming_search | 2 |
| watch | all_purpose | A | fly | calm_low_light_surface | 1 |
| watch | all_purpose | A | fly | warming_search | 1 |
| watch | all_purpose | A | lure | breezy_windy_stained_reaction | 1 |
| watch | all_purpose | A | lure | calm_bright_clear_subtle | 1 |
| watch | all_purpose | A | lure | calm_low_light_surface | 1 |
| watch | all_purpose | B | fly | unclassified | 1 |
| watch | all_purpose | B | lure | calm_bright_clear_subtle | 1 |
| watch | big_fish | A | fly | calm_low_light_surface | 1 |
| watch | big_fish | A | lure | unclassified | 1 |
| watch | big_fish | B | lure | calm_low_light_surface | 1 |
| watch | big_fish | B | lure | river_elevated_runoff_current | 1 |
| acceptable_fit | big_fish | B | fly | cold_slow_or_front | 77 |
| acceptable_fit | big_fish | B | lure | cold_slow_or_front | 73 |
| acceptable_fit | big_fish | B | fly | stable_pleasant_high_confidence | 56 |
| acceptable_fit | big_fish | B | fly | unclassified | 40 |
| acceptable_fit | big_fish | A | fly | unclassified | 39 |
| acceptable_fit | big_fish | B | lure | stable_pleasant_high_confidence | 39 |
| acceptable_fit | all_purpose | B | fly | unclassified | 38 |
| acceptable_fit | big_fish | B | lure | unclassified | 36 |
| acceptable_fit | all_purpose | B | fly | cold_slow_or_front | 35 |
| acceptable_fit | all_purpose | A | fly | unclassified | 34 |
| acceptable_fit | all_purpose | A | lure | unclassified | 34 |
| acceptable_fit | all_purpose | B | lure | stable_pleasant_high_confidence | 34 |
| acceptable_fit | all_purpose | B | lure | unclassified | 34 |
| acceptable_fit | big_fish | A | fly | cold_slow_or_front | 34 |
| acceptable_fit | big_fish | A | lure | unclassified | 34 |
| acceptable_fit | all_purpose | B | fly | stable_pleasant_high_confidence | 32 |
| acceptable_fit | big_fish | A | lure | stable_pleasant_high_confidence | 31 |
| acceptable_fit | big_fish | A | fly | stable_pleasant_high_confidence | 30 |
| acceptable_fit | all_purpose | A | fly | stable_pleasant_high_confidence | 25 |
| acceptable_fit | all_purpose | A | lure | stable_pleasant_high_confidence | 23 |
| acceptable_fit | big_fish | A | lure | cold_slow_or_front | 23 |
| acceptable_fit | big_fish | B | lure | river_elevated_runoff_current | 22 |

## Recalibrated All Purpose Risk Summary

| Metric | Count |
| --- | --- |
| Old ALL_PURPOSE_OVER_SELECTING_HIGH_RISK warnings | 0 |
| Risk-balance likely_miss picks | 0 |
| Risk-balance watch picks | 0 |
| All-purpose rows with 4/4 surface picks | 0 |
| 4/4 surface rows with row-level watch/likely_miss | 0 |

## Top Likely Misses

None.

## Top Strong Hits

| Scenario | Pick | Why it is a strong hit |
| --- | --- | --- |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained all_purpose A | Blade Bait (lure_of_the_day, lure, score 216) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 dirty all_purpose A | Blade Bait (lure_of_the_day, lure, score 206) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dworshak / inland northwest SMB reservoir<br>2025-06-25 clear all_purpose A | Tube Jig (lure_of_the_day, lure, score 196) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-09-29 clear all_purpose A | Tube Jig (lure_of_the_day, lure, score 196) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-09-29 clear all_purpose A | Crawfish Streamer (fly_of_the_day, fly, score 186) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+low_light_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained all_purpose A | Rabbit-Strip Leech (honorable_fly, fly, score 172) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Dworshak / inland northwest SMB reservoir<br>2025-06-25 clear all_purpose A | Foam Gurgler (fly_of_the_day, fly, score 170) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit, surface_window_strength<br>calm_surface+low_light_surface+clear_subtle+warming_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 dirty all_purpose B | Deceiver (fly_of_the_day, fly, score 164) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Door County / Green Bay smallmouth lake<br>2025-12-12 clear all_purpose A | Blade Bait (lure_of_the_day, lure, score 216) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+cold_slow+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Table Rock / Ozark clear reservoir<br>2025-10-20 clear all_purpose A | Tube Jig (lure_of_the_day, lure, score 212) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained all_purpose A | Ned Rig (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-03-26 stained all_purpose A | Ned Rig (lure_of_the_day, lure, score 208) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained all_purpose B | Texas-Rigged Craw (lure_of_the_day, lure, score 204) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-01-18 stained all_purpose A | Tube Jig (lure_of_the_day, lure, score 204) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| New River Appalachian SMB context<br>2025-03-26 stained all_purpose B | Finesse Jig (lure_of_the_day, lure, score 204) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Table Rock / Ozark clear reservoir<br>2025-06-18 stained all_purpose A | Inline Spinner (lure_of_the_day, lure, score 202) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+open_water_search<br>Selected pick has active goal plus priority daily-condition fit. |
| Lake Champlain SMB water<br>2025-01-18 stained all_purpose B | Blade Bait (lure_of_the_day, lure, score 200) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+dirty_vibration+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Table Rock / Ozark clear reservoir<br>2025-10-20 clear big_fish B | Magnum Jerkbait (lure_of_the_day, lure, score 198) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, set_b_second_opinion_role, goal_fit, condition_fit, clarity_fit<br>wind_reaction+clear_subtle+cold_slow<br>Selected pick has active goal plus priority daily-condition fit. |
| Ozark Current River smallmouth context<br>2025-04-05 stained all_purpose A | Blade Bait (lure_of_the_day, lure, score 196) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>dirty_vibration+cold_slow+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |
| Ozark Current River smallmouth context<br>2025-06-14 clear all_purpose A | Tube Jig (lure_of_the_day, lure, score 196) | species_valid, seasonal_row_valid, water_type_valid, column_pace_valid, surface_gate_ok, goal_fit, condition_fit, clarity_fit<br>calm_surface+clear_subtle+current_swing<br>Selected pick has active goal plus priority daily-condition fit. |

## Condition Satisfaction Rates

| Signal | Opportunities | Satisfied | Rate |
| --- | --- | --- | --- |
| wind_reaction | 576 | 218 | 38% |
| clear_subtle | 432 | 241 | 56% |
| dirty_vibration | 544 | 81 | 15% |
| heat_finesse | 0 | 0 |  |
| cold_slow | 912 | 668 | 73% |
| low_light_surface | 312 | 83 | 27% |
| calm_surface | 432 | 155 | 36% |
| Big Fish upside | 1224 | 905 | 74% |
| All Purpose reliable/versatile | 1224 | 1223 | 100% |

## Most-Selected Lures/Flies

| Scope | Most selected |
| --- | --- |
| Overall | Game Changer [fly] (137), Rabbit-Strip Leech [fly] (132), Big Tube Jig [lure] (126), Articulated Baitfish [fly] (118), Clouser Minnow [fly] (98), Crawfish Fly [fly] (97), Ned Rig [lure] (96), Football Jig [lure] (94), Magnum Jerkbait [lure] (89), Suspending Jerkbait [lure] (79), Woolly Bugger [fly] (74), Blade Bait [lure] (63) |
| All-purpose | Clouser Minnow [fly] (97), Ned Rig [lure] (79), Woolly Bugger [fly] (64), Tube Jig [lure] (62), Suspending Jerkbait [lure] (60), Crawfish Fly [fly] (59), Soft Jerkbait [lure] (49), Baitfish Slider [fly] (48) |
| Big-fish | Big Tube Jig [lure] (126), Game Changer [fly] (118), Rabbit-Strip Leech [fly] (114), Articulated Baitfish [fly] (102), Football Jig [lure] (94), Magnum Jerkbait [lure] (89), Compact Glide Bait [lure] (54), Deer Hair Slider [fly] (51) |

## Profile Utilization Summary

| Gear | Candidate profiles | Selected profiles | Zero-selected | Low-use | Over-selected |
| --- | --- | --- | --- | --- | --- |
| lure | 31 | 30 | 1 | 3 | 0 |
| fly | 25 | 24 | 1 | 1 | 1 |

### Selected Count By Profile

| Profile | Gear | Selected/Opp | Rate | Goal | Set | Slot | Clarity | Water | Selected tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 137/612 | 22.4% | big_fish:118, all_purpose:19 | B:72, A:65 | top:82, honorable:55 | clear:50, dirty:47, stained:40 | freshwater_lake_pond:108, freshwater_river:29 | cold_slow:35, none:31, calm_surface:29, clear_subtle:28 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 132/612 | 21.6% | big_fish:114, all_purpose:18 | A:86, B:46 | honorable:85, top:47 | dirty:56, stained:52, clear:24 | freshwater_lake_pond:108, freshwater_river:24 | cold_slow:70, wind_reaction:47, dirty_vibration:42, none:25 |
| Big Tube Jig<br>big_smallmouth_tube | lure | 126/540 | 23.3% | big_fish:126 | A:90, B:36 | honorable:71, top:55 | stained:44, clear:43, dirty:39 | freshwater_lake_pond:91, freshwater_river:35 | cold_slow:41, calm_surface:25, clear_subtle:25, none:23 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 118/612 | 19.3% | big_fish:102, all_purpose:16 | A:61, B:57 | top:77, honorable:41 | dirty:50, stained:42, clear:26 | freshwater_lake_pond:104, freshwater_river:14 | cold_slow:34, none:29, calm_surface:22, wind_reaction:21 |
| Clouser Minnow<br>clouser_minnow | fly | 98/612 | 16% | all_purpose:97, big_fish:1 | B:72, A:26 | honorable:53, top:45 | clear:37, stained:37, dirty:24 | freshwater_lake_pond:71, freshwater_river:27 | cold_slow:33, calm_surface:20, none:19, clear_subtle:17 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 97/348 | 27.9% | all_purpose:59, big_fish:38 | A:53, B:44 | honorable:51, top:46 | clear:39, stained:32, dirty:26 | freshwater_lake_pond:97 | cold_slow:49, clear_subtle:24, none:23, wind_reaction:15 |
| Ned Rig<br>ned_rig | lure | 96/612 | 15.7% | all_purpose:79, big_fish:17 | B:59, A:37 | top:75, honorable:21 | clear:54, stained:40, dirty:2 | freshwater_lake_pond:70, freshwater_river:26 | cold_slow:45, clear_subtle:32, wind_reaction:17, none:14 |
| Football Jig<br>football_jig | lure | 94/468 | 20.1% | big_fish:94 | B:63, A:31 | honorable:51, top:43 | dirty:38, clear:29, stained:27 | freshwater_lake_pond:94 | cold_slow:37, wind_reaction:28, none:21, dirty_vibration:18 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 89/360 | 24.7% | big_fish:89 | A:62, B:27 | honorable:46, top:43 | stained:33, clear:30, dirty:26 | freshwater_lake_pond:66, freshwater_river:23 | cold_slow:45, none:16, clear_subtle:15, wind_reaction:14 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 79/612 | 12.9% | all_purpose:60, big_fish:19 | A:51, B:28 | honorable:61, top:18 | clear:27, dirty:27, stained:25 | freshwater_lake_pond:65, freshwater_river:14 | cold_slow:63, wind_reaction:27, dirty_vibration:16, clear_subtle:6 |
| Woolly Bugger<br>woolly_bugger | fly | 74/612 | 12.1% | all_purpose:64, big_fish:10 | A:51, B:23 | honorable:58, top:16 | clear:27, stained:26, dirty:21 | freshwater_lake_pond:52, freshwater_river:22 | cold_slow:61, clear_subtle:12, wind_reaction:11, dirty_vibration:9 |
| Blade Bait<br>blade_bait | lure | 63/612 | 10.3% | all_purpose:39, big_fish:24 | A:39, B:24 | top:39, honorable:24 | dirty:41, stained:17, clear:5 | freshwater_lake_pond:38, freshwater_river:25 | cold_slow:40, dirty_vibration:33, wind_reaction:22, current_swing:16 |
| Tube Jig<br>tube_jig | lure | 63/612 | 10.3% | all_purpose:62, big_fish:1 | A:44, B:19 | top:45, honorable:18 | clear:40, stained:19, dirty:4 | freshwater_lake_pond:45, freshwater_river:18 | cold_slow:35, clear_subtle:26, calm_surface:9, wind_reaction:8 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 61/612 | 10% | all_purpose:42, big_fish:19 | B:42, A:19 | honorable:34, top:27 | dirty:22, stained:22, clear:17 | freshwater_lake_pond:59, freshwater_river:2 | cold_slow:48, wind_reaction:27, dirty_vibration:20, open_water_search:9 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 58/480 | 12.1% | all_purpose:48, big_fish:10 | B:30, A:28 | honorable:54, top:4 | dirty:24, stained:21, clear:13 | freshwater_lake_pond:56, freshwater_river:2 | none:21, wind_reaction:20, dirty_vibration:15, warming_search:13 |
| Deceiver<br>deceiver | fly | 55/612 | 9% | all_purpose:41, big_fish:14 | A:36, B:19 | top:44, honorable:11 | dirty:22, clear:17, stained:16 | freshwater_lake_pond:52, freshwater_river:3 | wind_reaction:42, dirty_vibration:29, cold_slow:15, open_water_search:12 |
| Compact Glide Bait<br>compact_glidebait | lure | 54/300 | 18% | big_fish:54 | A:32, B:22 | honorable:33, top:21 | clear:24, stained:20, dirty:10 | freshwater_lake_pond:54 | clear_subtle:17, calm_surface:11, cold_slow:11, none:11 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 52/612 | 8.5% | all_purpose:47, big_fish:5 | A:36, B:16 | top:42, honorable:10 | dirty:20, stained:18, clear:14 | freshwater_lake_pond:45, freshwater_river:7 | calm_surface:20, warming_search:16, low_light_surface:12, none:12 |
| Deer Hair Slider<br>deer_hair_slider | fly | 52/234 | 22.2% | big_fish:51, all_purpose:1 | A:36, B:16 | honorable:32, top:20 | clear:18, dirty:18, stained:16 | freshwater_lake_pond:39, freshwater_river:13 | calm_surface:28, low_light_surface:17, clear_subtle:12, current_swing:9 |
| Bladed Jig<br>bladed_jig | lure | 49/612 | 8% | all_purpose:44, big_fish:5 | B:27, A:22 | top:40, honorable:9 | stained:26, dirty:21, clear:2 | freshwater_lake_pond:34, freshwater_river:15 | dirty_vibration:27, wind_reaction:16, current_swing:12, calm_surface:11 |
| Soft Jerkbait<br>soft_jerkbait | lure | 49/480 | 10.2% | all_purpose:49 | B:32, A:17 | honorable:46, top:3 | clear:21, stained:16, dirty:12 | freshwater_lake_pond:42, freshwater_river:7 | calm_surface:15, clear_subtle:15, none:12, low_light_surface:9 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49/234 | 20.9% | all_purpose:29, big_fish:20 | B:31, A:18 | top:35, honorable:14 | clear:17, dirty:16, stained:16 | freshwater_lake_pond:39, freshwater_river:10 | calm_surface:46, low_light_surface:17, clear_subtle:14, current_swing:7 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 43/612 | 7% | big_fish:30, all_purpose:13 | B:28, A:15 | top:24, honorable:19 | dirty:19, stained:13, clear:11 | freshwater_lake_pond:37, freshwater_river:6 | wind_reaction:33, dirty_vibration:23, cold_slow:11, open_water_search:11 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 42/612 | 6.9% | all_purpose:33, big_fish:9 | B:31, A:11 | top:33, honorable:9 | dirty:29, stained:8, clear:5 | freshwater_lake_pond:31, freshwater_river:11 | cold_slow:33, dirty_vibration:13, wind_reaction:12, clear_subtle:5 |
| Zonker Streamer<br>zonker_streamer | fly | 42/612 | 6.9% | all_purpose:29, big_fish:13 | B:28, A:14 | top:35, honorable:7 | stained:18, dirty:17, clear:7 | freshwater_lake_pond:40, freshwater_river:2 | wind_reaction:38, dirty_vibration:33, cold_slow:12, open_water_search:9 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 41/612 | 6.7% | all_purpose:32, big_fish:9 | B:25, A:16 | top:21, honorable:20 | clear:29, dirty:6, stained:6 | freshwater_lake_pond:40, freshwater_river:1 | clear_subtle:23, cold_slow:23, wind_reaction:10, dirty_vibration:4 |
| Walking Bait<br>walking_topwater | lure | 38/234 | 16.2% | big_fish:38 | B:21, A:17 | top:28, honorable:10 | stained:15, clear:13, dirty:10 | freshwater_lake_pond:24, freshwater_river:14 | calm_surface:25, low_light_surface:14, clear_subtle:9, current_swing:9 |
| Spinnerbait<br>spinnerbait | lure | 36/612 | 5.9% | all_purpose:33, big_fish:3 | B:24, A:12 | top:22, honorable:14 | dirty:19, stained:15, clear:2 | freshwater_lake_pond:24, freshwater_river:12 | dirty_vibration:18, cold_slow:11, wind_reaction:10, current_swing:9 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 35/480 | 7.3% | all_purpose:19, big_fish:16 | B:35 | honorable:35 | stained:13, clear:12, dirty:10 | freshwater_lake_pond:19, freshwater_river:16 | cold_slow:34, clear_subtle:4, low_light_surface:2 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 34/480 | 7.1% | all_purpose:20, big_fish:14 | A:17, B:17 | honorable:25, top:9 | clear:25, stained:5, dirty:4 | freshwater_lake_pond:34 | clear_subtle:22, wind_reaction:8, cold_slow:7, calm_surface:6 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 32/168 | 19% | big_fish:32 | A:20, B:12 | honorable:17, top:15 | dirty:12, stained:11, clear:9 | freshwater_river:20, freshwater_lake_pond:12 | cold_slow:25, dirty_vibration:10, wind_reaction:9, current_swing:6 |
| Buzzbait<br>buzzbait | lure | 31/234 | 13.2% | big_fish:31 | A:23, B:8 | top:21, honorable:10 | dirty:17, stained:9, clear:5 | freshwater_lake_pond:20, freshwater_river:11 | low_light_surface:15, dirty_vibration:13, calm_surface:11, wind_reaction:9 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 30/612 | 4.9% | all_purpose:22, big_fish:8 | B:19, A:11 | honorable:27, top:3 | clear:24, stained:4, dirty:2 | freshwater_lake_pond:18, freshwater_river:12 | clear_subtle:24, cold_slow:6, none:6, calm_surface:3 |
| Sculpzilla<br>sculpzilla | fly | 30/144 | 20.8% | big_fish:30 | A:18, B:12 | top:19, honorable:11 | stained:11, dirty:10, clear:9 | freshwater_river:30 | current_swing:15, cold_slow:11, dirty_vibration:11, calm_surface:7 |
| Inline Spinner<br>inline_spinner | lure | 29/612 | 4.7% | all_purpose:23, big_fish:6 | B:18, A:11 | top:16, honorable:13 | clear:14, stained:8, dirty:7 | freshwater_lake_pond:22, freshwater_river:7 | wind_reaction:22, dirty_vibration:13, open_water_search:10, cold_slow:9 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 27/480 | 5.6% | all_purpose:20, big_fish:7 | B:16, A:11 | honorable:23, top:4 | dirty:14, stained:9, clear:4 | freshwater_lake_pond:17, freshwater_river:10 | dirty_vibration:23, wind_reaction:17, current_swing:10, low_light_surface:6 |
| Muddler Minnow<br>muddler_sculpin | fly | 23/144 | 16% | all_purpose:22, big_fish:1 | A:14, B:9 | top:19, honorable:4 | clear:10, stained:9, dirty:4 | freshwater_river:23 | cold_slow:14, current_swing:8, dirty_vibration:6, clear_subtle:5 |
| Bass Popper<br>popper_fly | fly | 21/234 | 9% | all_purpose:20, big_fish:1 | B:15, A:6 | top:13, honorable:8 | stained:9, dirty:7, clear:5 | freshwater_lake_pond:16, freshwater_river:5 | calm_surface:19, low_light_surface:7, clear_subtle:3, current_swing:2 |
| Crawfish Streamer<br>crawfish_streamer | fly | 21/144 | 14.6% | all_purpose:17, big_fish:4 | B:12, A:9 | top:16, honorable:5 | clear:12, dirty:6, stained:3 | freshwater_river:21 | clear_subtle:11, current_swing:9, cold_slow:6, dirty_vibration:6 |
| Finesse Jig<br>finesse_jig | lure | 20/612 | 3.3% | all_purpose:13, big_fish:7 | B:13, A:7 | honorable:11, top:9 | clear:10, stained:9, dirty:1 | freshwater_lake_pond:10, freshwater_river:10 | cold_slow:13, clear_subtle:6, none:4, wind_reaction:4 |
| Sculpin Streamer<br>sculpin_streamer | fly | 17/144 | 11.8% | all_purpose:16, big_fish:1 | B:14, A:3 | top:13, honorable:4 | clear:6, dirty:6, stained:5 | freshwater_river:17 | cold_slow:10, current_swing:5, dirty_vibration:3, calm_surface:2 |
| Topwater Popper<br>popping_topwater | lure | 16/234 | 6.8% | all_purpose:15, big_fish:1 | A:13, B:3 | honorable:16 | dirty:7, stained:7, clear:2 | freshwater_lake_pond:13, freshwater_river:3 | calm_surface:16, low_light_surface:4, warming_search:2, clear_subtle:1 |
| Wake Bait<br>wake_bait | lure | 16/174 | 9.2% | big_fish:16 | B:13, A:3 | top:13, honorable:3 | clear:7, stained:5, dirty:4 | freshwater_lake_pond:16 | calm_surface:15, low_light_surface:6, clear_subtle:5, warming_search:3 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 14/156 | 9% | all_purpose:14 | B:11, A:3 | honorable:14 | clear:6, dirty:6, stained:2 | freshwater_lake_pond:13, freshwater_river:1 | clear_subtle:5, calm_surface:4, none:4, wind_reaction:4 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 12/612 | 2% | all_purpose:11, big_fish:1 | A:7, B:5 | honorable:9, top:3 | dirty:6, stained:5, clear:1 | freshwater_lake_pond:9, freshwater_river:3 | warming_search:9, dirty_vibration:4, current_swing:3, none:2 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 12/468 | 2.6% | all_purpose:12 | A:8, B:4 | honorable:10, top:2 | dirty:11, stained:1 | freshwater_lake_pond:12 | none:5, calm_surface:2, dirty_vibration:2, open_water_search:2 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 11/120 | 9.2% | all_purpose:9, big_fish:2 | A:6, B:5 | honorable:8, top:3 | clear:7, dirty:2, stained:2 | freshwater_river:11 | current_swing:8, clear_subtle:5, calm_surface:4, dirty_vibration:4 |
| Swim Jig<br>swim_jig | lure | 8/612 | 1.3% | all_purpose:8 | B:7, A:1 | top:6, honorable:2 | dirty:5, stained:2, clear:1 | freshwater_lake_pond:6, freshwater_river:2 | calm_surface:2, cold_slow:2, none:2, warming_search:2 |
| Mouse Pattern<br>mouse_fly | fly | 6/36 | 16.7% | big_fish:6 | B:6 | honorable:4, top:2 | clear:2, dirty:2, stained:2 | freshwater_river:6 | calm_surface:6, current_swing:3, low_light_surface:3, clear_subtle:2 |
| Lipless Crankbait<br>lipless_crankbait | lure | 5/612 | 0.8% | all_purpose:3, big_fish:2 | A:3, B:2 | top:3, honorable:2 | dirty:4, stained:1 | freshwater_lake_pond:5 | dirty_vibration:4, wind_reaction:4, cold_slow:2, none:1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3/144 | 2.1% | all_purpose:2, big_fish:1 | A:3 | honorable:2, top:1 | stained:2, clear:1 | freshwater_river:3 | current_swing:3, dirty_vibration:2, cold_slow:1, low_light_surface:1 |
| Hair Jig<br>hair_jig | lure | 3/144 | 2.1% | all_purpose:2, big_fish:1 | B:3 | honorable:2, top:1 | stained:2, clear:1 | freshwater_river:3 | current_swing:3, dirty_vibration:2, calm_surface:1, cold_slow:1 |
| Glide Bait<br>glidebait | lure | 3/36 | 8.3% | big_fish:3 | B:2, A:1 | top:2, honorable:1 | clear:2, dirty:1 | freshwater_lake_pond:3 | none:2, wind_reaction:1 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 2/468 | 0.4% | all_purpose:2 | A:1, B:1 | honorable:1, top:1 | dirty:2 | freshwater_lake_pond:2 | none:2 |
| Conehead Streamer<br>conehead_streamer | fly | 0/144 | 0% |  |  |  |  |  |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0/132 | 0% |  |  |  |  |  |  |

## Actual Recommendation Slot Share

| Profile | Gear | Combined all slots | Top slots | Honorable slots | Lure-side slots | Fly-side slots | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 137/2448 (5.6%) | 82/1224 (6.7%) | 55/1224 (4.5%) | - | 137/1224 (11.2%) |  |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 132/2448 (5.4%) | 47/1224 (3.8%) | 85/1224 (6.9%) | - | 132/1224 (10.8%) |  |
| Big Tube Jig<br>big_smallmouth_tube | lure | 126/2448 (5.1%) | 55/1224 (4.5%) | 71/1224 (5.8%) | 126/1224 (10.3%) | - |  |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 118/2448 (4.8%) | 77/1224 (6.3%) | 41/1224 (3.3%) | - | 118/1224 (9.6%) |  |
| Clouser Minnow<br>clouser_minnow | fly | 98/2448 (4%) | 45/1224 (3.7%) | 53/1224 (4.3%) | - | 98/1224 (8%) |  |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 97/2448 (4%) | 46/1224 (3.8%) | 51/1224 (4.2%) | - | 97/1224 (7.9%) |  |
| Ned Rig<br>ned_rig | lure | 96/2448 (3.9%) | 75/1224 (6.1%) | 21/1224 (1.7%) | 96/1224 (7.8%) | - |  |
| Football Jig<br>football_jig | lure | 94/2448 (3.8%) | 43/1224 (3.5%) | 51/1224 (4.2%) | 94/1224 (7.7%) | - |  |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 89/2448 (3.6%) | 43/1224 (3.5%) | 46/1224 (3.8%) | 89/1224 (7.3%) | - |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 79/2448 (3.2%) | 18/1224 (1.5%) | 61/1224 (5%) | 79/1224 (6.5%) | - |  |
| Woolly Bugger<br>woolly_bugger | fly | 74/2448 (3%) | 16/1224 (1.3%) | 58/1224 (4.7%) | - | 74/1224 (6%) |  |
| Blade Bait<br>blade_bait | lure | 63/2448 (2.6%) | 39/1224 (3.2%) | 24/1224 (2%) | 63/1224 (5.1%) | - |  |
| Tube Jig<br>tube_jig | lure | 63/2448 (2.6%) | 45/1224 (3.7%) | 18/1224 (1.5%) | 63/1224 (5.1%) | - |  |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 61/2448 (2.5%) | 27/1224 (2.2%) | 34/1224 (2.8%) | - | 61/1224 (5%) |  |
| Baitfish Slider<br>baitfish_slider_fly | fly | 58/2448 (2.4%) | 4/1224 (0.3%) | 54/1224 (4.4%) | - | 58/1224 (4.7%) |  |
| Deceiver<br>deceiver | fly | 55/2448 (2.2%) | 44/1224 (3.6%) | 11/1224 (0.9%) | - | 55/1224 (4.5%) |  |
| Compact Glide Bait<br>compact_glidebait | lure | 54/2448 (2.2%) | 21/1224 (1.7%) | 33/1224 (2.7%) | 54/1224 (4.4%) | - |  |
| Deer Hair Slider<br>deer_hair_slider | fly | 52/2448 (2.1%) | 20/1224 (1.6%) | 32/1224 (2.6%) | - | 52/1224 (4.2%) |  |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 52/2448 (2.1%) | 42/1224 (3.4%) | 10/1224 (0.8%) | 52/1224 (4.2%) | - |  |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49/2448 (2%) | 35/1224 (2.9%) | 14/1224 (1.1%) | - | 49/1224 (4%) |  |
| Bladed Jig<br>bladed_jig | lure | 49/2448 (2%) | 40/1224 (3.3%) | 9/1224 (0.7%) | 49/1224 (4%) | - |  |
| Soft Jerkbait<br>soft_jerkbait | lure | 49/2448 (2%) | 3/1224 (0.2%) | 46/1224 (3.8%) | 49/1224 (4%) | - |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 43/2448 (1.8%) | 24/1224 (2%) | 19/1224 (1.6%) | 43/1224 (3.5%) | - |  |
| Zonker Streamer<br>zonker_streamer | fly | 42/2448 (1.7%) | 35/1224 (2.9%) | 7/1224 (0.6%) | - | 42/1224 (3.4%) |  |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 42/2448 (1.7%) | 33/1224 (2.7%) | 9/1224 (0.7%) | 42/1224 (3.4%) | - |  |
| Lead-Eye Leech<br>lead_eye_leech | fly | 41/2448 (1.7%) | 21/1224 (1.7%) | 20/1224 (1.6%) | - | 41/1224 (3.3%) |  |
| Walking Bait<br>walking_topwater | lure | 38/2448 (1.6%) | 28/1224 (2.3%) | 10/1224 (0.8%) | 38/1224 (3.1%) | - |  |
| Spinnerbait<br>spinnerbait | lure | 36/2448 (1.5%) | 22/1224 (1.8%) | 14/1224 (1.1%) | 36/1224 (2.9%) | - |  |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 35/2448 (1.4%) | 0/1224 (0%) | 35/1224 (2.9%) | 35/1224 (2.9%) | - |  |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 34/2448 (1.4%) | 9/1224 (0.7%) | 25/1224 (2%) | - | 34/1224 (2.8%) |  |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 32/2448 (1.3%) | 15/1224 (1.2%) | 17/1224 (1.4%) | - | 32/1224 (2.6%) |  |
| Buzzbait<br>buzzbait | lure | 31/2448 (1.3%) | 21/1224 (1.7%) | 10/1224 (0.8%) | 31/1224 (2.5%) | - |  |
| Sculpzilla<br>sculpzilla | fly | 30/2448 (1.2%) | 19/1224 (1.6%) | 11/1224 (0.9%) | - | 30/1224 (2.5%) |  |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 30/2448 (1.2%) | 3/1224 (0.2%) | 27/1224 (2.2%) | 30/1224 (2.5%) | - |  |
| Inline Spinner<br>inline_spinner | lure | 29/2448 (1.2%) | 16/1224 (1.3%) | 13/1224 (1.1%) | 29/1224 (2.4%) | - |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 27/2448 (1.1%) | 4/1224 (0.3%) | 23/1224 (1.9%) | 27/1224 (2.2%) | - |  |
| Muddler Minnow<br>muddler_sculpin | fly | 23/2448 (0.9%) | 19/1224 (1.6%) | 4/1224 (0.3%) | - | 23/1224 (1.9%) |  |
| Bass Popper<br>popper_fly | fly | 21/2448 (0.9%) | 13/1224 (1.1%) | 8/1224 (0.7%) | - | 21/1224 (1.7%) |  |
| Crawfish Streamer<br>crawfish_streamer | fly | 21/2448 (0.9%) | 16/1224 (1.3%) | 5/1224 (0.4%) | - | 21/1224 (1.7%) |  |
| Finesse Jig<br>finesse_jig | lure | 20/2448 (0.8%) | 9/1224 (0.7%) | 11/1224 (0.9%) | 20/1224 (1.6%) | - |  |
| Sculpin Streamer<br>sculpin_streamer | fly | 17/2448 (0.7%) | 13/1224 (1.1%) | 4/1224 (0.3%) | - | 17/1224 (1.4%) |  |
| Topwater Popper<br>popping_topwater | lure | 16/2448 (0.7%) | 0/1224 (0%) | 16/1224 (1.3%) | 16/1224 (1.3%) | - |  |
| Wake Bait<br>wake_bait | lure | 16/2448 (0.7%) | 13/1224 (1.1%) | 3/1224 (0.2%) | 16/1224 (1.3%) | - |  |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 14/2448 (0.6%) | 0/1224 (0%) | 14/1224 (1.1%) | 14/1224 (1.1%) | - |  |
| Marabou Jig Leech<br>feather_jig_leech | fly | 12/2448 (0.5%) | 3/1224 (0.2%) | 9/1224 (0.7%) | - | 12/1224 (1%) |  |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 12/2448 (0.5%) | 2/1224 (0.2%) | 10/1224 (0.8%) | 12/1224 (1%) | - |  |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 11/2448 (0.4%) | 3/1224 (0.2%) | 8/1224 (0.7%) | - | 11/1224 (0.9%) |  |
| Swim Jig<br>swim_jig | lure | 8/2448 (0.3%) | 6/1224 (0.5%) | 2/1224 (0.2%) | 8/1224 (0.7%) | - |  |
| Mouse Pattern<br>mouse_fly | fly | 6/2448 (0.2%) | 2/1224 (0.2%) | 4/1224 (0.3%) | - | 6/1224 (0.5%) |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 5/2448 (0.2%) | 3/1224 (0.2%) | 2/1224 (0.2%) | 5/1224 (0.4%) | - |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3/2448 (0.1%) | 1/1224 (0.1%) | 2/1224 (0.2%) | - | 3/1224 (0.2%) |  |
| Glide Bait<br>glidebait | lure | 3/2448 (0.1%) | 2/1224 (0.2%) | 1/1224 (0.1%) | 3/1224 (0.2%) | - |  |
| Hair Jig<br>hair_jig | lure | 3/2448 (0.1%) | 1/1224 (0.1%) | 2/1224 (0.2%) | 3/1224 (0.2%) | - |  |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 2/2448 (0.1%) | 1/1224 (0.1%) | 1/1224 (0.1%) | 2/1224 (0.2%) | - |  |
| Conehead Streamer<br>conehead_streamer | fly | 0/2448 (0%) | 0/1224 (0%) | 0/1224 (0%) | - | 0/1224 (0%) |  |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0/2448 (0%) | 0/1224 (0%) | 0/1224 (0%) | 0/1224 (0%) | - |  |

## Per-Profile Usage Audit

| Profile | Gear | Selected | All-slot share | Side-slot share | All-purpose side share | Big-fish side share | Top/HM | Available rows | Finalist/repair opp | Selected/opportunity | Goal | Surface gate | Activity | Wind | Bucket | Clarity | Month/season | Condition tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 137 | 137/2448 (5.6%) | 137/1224 (11.2%) | 19/612 (3.1%) | 118/612 (19.3%) | 82/55 | 612/612 (100%) | 468 | 29.3% | big_fish:118, all_purpose:19 | closed:73, caution:35, open:29 | neutral:118, suppressed:11, active:8 | calm:58, slight:50, breezy:24, windy:5 | cold_slow_or_front:43, stable_pleasant_high_confidence:29, unclassified:28, warming_search:9, calm_low_light_surface:8 | clear:50, dirty:47, stained:40 | Jun:24, Sep:19, Apr:18, Aug:16<br>summer:50, fall:40, spring:38, winter:9 | cold_slow:35, none:31, calm_surface:29, clear_subtle:28, wind_reaction:22, dirty_vibration:18 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 132 | 132/2448 (5.4%) | 132/1224 (10.8%) | 18/612 (2.9%) | 114/612 (18.6%) | 47/85 | 612/612 (100%) | 318 | 41.5% | big_fish:114, all_purpose:18 | closed:105, caution:27 | neutral:107, suppressed:22, active:3 | breezy:44, slight:39, calm:33, windy:16 | cold_slow_or_front:59, dirty_vibration:22, breezy_windy_stained_reaction:17, unclassified:16, stable_pleasant_high_confidence:10 | dirty:56, stained:52, clear:24 | May:26, Mar:18, Apr:15, Oct:14<br>spring:59, fall:29, winter:24, summer:20 | cold_slow:70, wind_reaction:47, dirty_vibration:42, none:25, low_light_surface:12, open_water_search:11 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 118 | 118/2448 (4.8%) | 118/1224 (9.6%) | 16/612 (2.6%) | 102/612 (16.7%) | 77/41 | 612/612 (100%) | 399 | 29.6% | big_fish:102, all_purpose:16 | closed:72, caution:24, open:22 | neutral:96, suppressed:14, active:8 | calm:52, slight:38, breezy:21, windy:7 | cold_slow_or_front:37, stable_pleasant_high_confidence:24, unclassified:24, dirty_vibration:10, breezy_windy_stained_reaction:7 | dirty:50, stained:42, clear:26 | Sep:16, Jun:15, Apr:14, Aug:14<br>fall:36, spring:36, summer:36, winter:10 | cold_slow:34, none:29, calm_surface:22, wind_reaction:21, dirty_vibration:18, clear_subtle:14 |
| Clouser Minnow<br>clouser_minnow | fly | 98 | 98/2448 (4%) | 98/1224 (8%) | 97/612 (15.8%) | 1/612 (0.2%) | 45/53 | 612/612 (100%) | 381 | 25.7% | all_purpose:97, big_fish:1 | closed:58, caution:20, open:20 | neutral:78, suppressed:16, active:4 | calm:43, slight:37, breezy:16, windy:2 | cold_slow_or_front:41, stable_pleasant_high_confidence:18, unclassified:17, warming_search:8, calm_low_light_surface:7 | clear:37, stained:37, dirty:24 | Apr:17, Jun:13, Sep:13, May:12<br>spring:32, summer:30, fall:27, winter:9 | cold_slow:33, calm_surface:20, none:19, clear_subtle:17, low_light_surface:13, current_swing:12 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 97 | 97/2448 (4%) | 97/1224 (7.9%) | 59/612 (9.6%) | 38/612 (6.2%) | 46/51 | 348/612 (56.9%) | 254 | 38.2% | all_purpose:59, big_fish:38 | closed:69, caution:23, open:5 | neutral:87, suppressed:7, active:3 | slight:46, calm:29, breezy:17, windy:5 | cold_slow_or_front:48, unclassified:18, stable_pleasant_high_confidence:10, calm_bright_clear_subtle:7, breezy_windy_stained_reaction:5 | clear:39, stained:32, dirty:26 | Oct:27, May:19, Apr:16, Sep:15<br>fall:42, spring:35, summer:20 | cold_slow:49, clear_subtle:24, none:23, wind_reaction:15, low_light_surface:10, dirty_vibration:9 |
| Woolly Bugger<br>woolly_bugger | fly | 74 | 74/2448 (3%) | 74/1224 (6%) | 64/612 (10.5%) | 10/612 (1.6%) | 16/58 | 612/612 (100%) | 297 | 24.9% | all_purpose:64, big_fish:10 | closed:66, caution:7, open:1 | neutral:52, suppressed:21, active:1 | calm:30, slight:21, breezy:19, windy:4 | cold_slow_or_front:57, stable_pleasant_high_confidence:5, breezy_windy_stained_reaction:4, dirty_vibration:3, calm_bright_clear_subtle:2 | clear:27, stained:26, dirty:21 | May:18, Mar:10, Oct:10, Sep:8<br>spring:35, fall:25, winter:13, summer:1 | cold_slow:61, clear_subtle:12, wind_reaction:11, dirty_vibration:9, low_light_surface:7, none:6 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 61 | 61/2448 (2.5%) | 61/1224 (5%) | 42/612 (6.9%) | 19/612 (3.1%) | 27/34 | 612/612 (100%) | 237 | 25.7% | all_purpose:42, big_fish:19 | closed:59, caution:2 | neutral:44, suppressed:17 | breezy:23, calm:20, windy:12, slight:6 | cold_slow_or_front:35, breezy_windy_stained_reaction:10, dirty_vibration:10, stable_pleasant_high_confidence:6 | dirty:22, stained:22, clear:17 | Dec:11, Feb:11, Mar:11, Nov:9<br>winter:28, spring:19, fall:14 | cold_slow:48, wind_reaction:27, dirty_vibration:20, open_water_search:9, clear_subtle:4, none:4 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 58 | 58/2448 (2.4%) | 58/1224 (4.7%) | 48/612 (7.8%) | 10/612 (1.6%) | 4/54 | 480/612 (78.4%) | 169 | 34.3% | all_purpose:48, big_fish:10 | closed:33, caution:20, open:5 | neutral:55, active:3 | slight:22, calm:16, breezy:15, windy:5 | unclassified:14, stable_pleasant_high_confidence:11, warming_search:9, dirty_vibration:8, breezy_windy_stained_reaction:7 | dirty:24, stained:21, clear:13 | Jun:16, Apr:15, Aug:5, May:5<br>summer:25, spring:23, fall:10 | none:21, wind_reaction:20, dirty_vibration:15, warming_search:13, open_water_search:6, calm_surface:5 |
| Deceiver<br>deceiver | fly | 55 | 55/2448 (2.2%) | 55/1224 (4.5%) | 41/612 (6.7%) | 14/612 (2.3%) | 44/11 | 612/612 (100%) | 265 | 20.8% | all_purpose:41, big_fish:14 | closed:39, caution:14, open:2 | neutral:52, active:3 | breezy:30, windy:12, slight:11, calm:2 | dirty_vibration:17, breezy_windy_stained_reaction:12, cold_slow_or_front:11, unclassified:8, stable_pleasant_high_confidence:6 | dirty:22, clear:17, stained:16 | May:11, Mar:9, Jul:7, Jun:7<br>spring:23, summer:15, fall:10, winter:7 | wind_reaction:42, dirty_vibration:29, cold_slow:15, open_water_search:12, none:7, low_light_surface:5 |
| Deer Hair Slider<br>deer_hair_slider | fly | 52 | 52/2448 (2.1%) | 52/1224 (4.2%) | 1/612 (0.2%) | 51/612 (8.3%) | 20/32 | 234/612 (38.2%) | 80 | 65% | big_fish:51, all_purpose:1 | open:28, caution:24 | neutral:46, active:6 | calm:28, slight:20, breezy:4 | unclassified:16, stable_pleasant_high_confidence:13, calm_low_light_surface:10, cold_slow_or_front:4, calm_bright_clear_subtle:3 | clear:18, dirty:18, stained:16 | Jun:22, Aug:13, Sep:12, Jul:4<br>summer:39, fall:12, spring:1 | calm_surface:28, low_light_surface:17, clear_subtle:12, current_swing:9, none:9, dirty_vibration:8 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49 | 49/2448 (2%) | 49/1224 (4%) | 29/612 (4.7%) | 20/612 (3.3%) | 35/14 | 234/612 (38.2%) | 225 | 21.8% | all_purpose:29, big_fish:20 | open:46, caution:3 | neutral:43, active:6 | calm:46, slight:3 | stable_pleasant_high_confidence:20, calm_low_light_surface:14, cold_slow_or_front:6, calm_bright_clear_subtle:5, unclassified:3 | clear:17, dirty:16, stained:16 | Jun:20, Aug:12, Sep:11, Jul:6<br>summer:38, fall:11 | calm_surface:46, low_light_surface:17, clear_subtle:14, current_swing:7, warming_search:6, dirty_vibration:4 |
| Zonker Streamer<br>zonker_streamer | fly | 42 | 42/2448 (1.7%) | 42/1224 (3.4%) | 29/612 (4.7%) | 13/612 (2.1%) | 35/7 | 612/612 (100%) | 263 | 16% | all_purpose:29, big_fish:13 | closed:28, caution:12, open:2 | neutral:42 | breezy:23, windy:15, calm:3, slight:1 | breezy_windy_stained_reaction:16, dirty_vibration:16, cold_slow_or_front:5, stable_pleasant_high_confidence:3, calm_low_light_surface:1 | stained:18, dirty:17, clear:7 | Jun:8, Mar:8, Jul:5, May:5<br>summer:15, spring:14, winter:10, fall:3 | wind_reaction:38, dirty_vibration:33, cold_slow:12, open_water_search:9, low_light_surface:4, calm_surface:2 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 41 | 41/2448 (1.7%) | 41/1224 (3.3%) | 32/612 (5.2%) | 9/612 (1.5%) | 21/20 | 612/612 (100%) | 211 | 19.4% | all_purpose:32, big_fish:9 | closed:37, caution:3, open:1 | neutral:32, suppressed:9 | calm:22, breezy:9, slight:6, windy:4 | cold_slow_or_front:22, stable_pleasant_high_confidence:8, dirty_vibration:3, unclassified:3, calm_bright_clear_subtle:2 | clear:29, dirty:6, stained:6 | Mar:7, Nov:7, Oct:6, Feb:5<br>fall:17, winter:11, spring:9, summer:4 | clear_subtle:23, cold_slow:23, wind_reaction:10, dirty_vibration:4, open_water_search:4, none:2 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 34 | 34/2448 (1.4%) | 34/1224 (2.8%) | 20/612 (3.3%) | 14/612 (2.3%) | 9/25 | 480/612 (78.4%) | 132 | 25.8% | all_purpose:20, big_fish:14 | closed:16, caution:12, open:6 | neutral:34 | calm:17, slight:9, breezy:6, windy:2 | cold_slow_or_front:8, stable_pleasant_high_confidence:6, unclassified:6, calm_bright_clear_subtle:5, breezy_windy_stained_reaction:3 | clear:25, stained:5, dirty:4 | Jun:14, May:5, Oct:5, Apr:3<br>summer:18, fall:8, spring:8 | clear_subtle:22, wind_reaction:8, cold_slow:7, calm_surface:6, dirty_vibration:5, open_water_search:5 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 32 | 32/2448 (1.3%) | 32/1224 (2.6%) | 0/612 (0%) | 32/612 (5.2%) | 15/17 | 168/612 (27.5%) | 93 | 34.4% | big_fish:32 | closed:30, open:2 | neutral:23, suppressed:9 | breezy:12, calm:9, windy:6, slight:5 | cold_slow_or_front:20, dirty_vibration:5, breezy_windy_stained_reaction:3, stable_pleasant_high_confidence:2, warming_search:2 | dirty:12, stained:11, clear:9 | May:7, Apr:6, Feb:6, Jan:5<br>spring:16, winter:14, fall:2 | cold_slow:25, dirty_vibration:10, wind_reaction:9, current_swing:6, warming_search:3, calm_surface:2 |
| Sculpzilla<br>sculpzilla | fly | 30 | 30/2448 (1.2%) | 30/1224 (2.5%) | 0/612 (0%) | 30/612 (4.9%) | 19/11 | 144/612 (23.5%) | 81 | 37% | big_fish:30 | closed:17, open:7, caution:6 | neutral:25, suppressed:5 | calm:12, slight:12, breezy:6 | cold_slow_or_front:12, dirty_vibration:5, calm_low_light_surface:3, stable_pleasant_high_confidence:3, unclassified:3 | stained:11, dirty:10, clear:9 | May:7, Apr:6, Jun:6, Sep:4<br>spring:14, summer:9, fall:4, winter:3 | current_swing:15, cold_slow:11, dirty_vibration:11, calm_surface:7, low_light_surface:6, clear_subtle:5 |
| Muddler Minnow<br>muddler_sculpin | fly | 23 | 23/2448 (0.9%) | 23/1224 (1.9%) | 22/612 (3.6%) | 1/612 (0.2%) | 19/4 | 144/612 (23.5%) | 100 | 23% | all_purpose:22, big_fish:1 | closed:16, open:4, caution:3 | neutral:17, suppressed:6 | breezy:9, calm:7, slight:7 | cold_slow_or_front:13, breezy_windy_stained_reaction:2, calm_low_light_surface:2, river_elevated_runoff_current:2, calm_bright_clear_subtle:1 | clear:10, stained:9, dirty:4 | May:8, Apr:3, Jun:3, Mar:3<br>spring:14, summer:4, fall:3, winter:2 | cold_slow:14, current_swing:8, dirty_vibration:6, clear_subtle:5, calm_surface:4, low_light_surface:4 |
| Bass Popper<br>popper_fly | fly | 21 | 21/2448 (0.9%) | 21/1224 (1.7%) | 20/612 (3.3%) | 1/612 (0.2%) | 13/8 | 234/612 (38.2%) | 147 | 14.3% | all_purpose:20, big_fish:1 | open:19, caution:2 | neutral:18, active:3 | calm:19, slight:2 | stable_pleasant_high_confidence:10, calm_low_light_surface:5, calm_bright_clear_subtle:2, cold_slow_or_front:2, unclassified:2 | stained:9, dirty:7, clear:5 | Jun:7, Sep:7, Aug:5, Jul:2<br>summer:14, fall:7 | calm_surface:19, low_light_surface:7, clear_subtle:3, current_swing:2, dirty_vibration:2, warming_search:2 |
| Crawfish Streamer<br>crawfish_streamer | fly | 21 | 21/2448 (0.9%) | 21/1224 (1.7%) | 17/612 (2.8%) | 4/612 (0.7%) | 16/5 | 144/612 (23.5%) | 137 | 15.3% | all_purpose:17, big_fish:4 | closed:12, caution:5, open:4 | neutral:19, suppressed:2 | calm:9, slight:8, breezy:4 | cold_slow_or_front:7, unclassified:3, warming_search:3, calm_low_light_surface:2, dirty_vibration:2 | clear:12, dirty:6, stained:3 | Apr:4, Jan:3, Jul:3, Jun:3<br>spring:9, summer:6, fall:3, winter:3 | clear_subtle:11, current_swing:9, cold_slow:6, dirty_vibration:6, calm_surface:4, low_light_surface:4 |
| Sculpin Streamer<br>sculpin_streamer | fly | 17 | 17/2448 (0.7%) | 17/1224 (1.4%) | 16/612 (2.6%) | 1/612 (0.2%) | 13/4 | 144/612 (23.5%) | 125 | 13.6% | all_purpose:16, big_fish:1 | closed:12, caution:3, open:2 | neutral:13, suppressed:4 | slight:7, breezy:5, calm:5 | cold_slow_or_front:11, dirty_vibration:2, unclassified:2, stable_pleasant_high_confidence:1, warming_search:1 | clear:6, dirty:6, stained:5 | May:8, Jun:3, Apr:2, Jul:2<br>spring:11, summer:5, winter:1 | cold_slow:10, current_swing:5, dirty_vibration:3, calm_surface:2, clear_subtle:2, none:2 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 12 | 12/2448 (0.5%) | 12/1224 (1%) | 11/612 (1.8%) | 1/612 (0.2%) | 3/9 | 612/612 (100%) | 70 | 17.1% | all_purpose:11, big_fish:1 | closed:10, caution:1, open:1 | neutral:12 | calm:7, slight:4, windy:1 | warming_search:6, dirty_vibration:2, breezy_windy_stained_reaction:1, calm_low_light_surface:1, stable_pleasant_high_confidence:1 | dirty:6, stained:5, clear:1 | Apr:7, Jun:2, Oct:2, May:1<br>spring:8, fall:2, summer:2 | warming_search:9, dirty_vibration:4, current_swing:3, none:2, calm_surface:1, low_light_surface:1 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 11 | 11/2448 (0.4%) | 11/1224 (0.9%) | 9/612 (1.5%) | 2/612 (0.3%) | 3/8 | 120/612 (19.6%) | 51 | 21.6% | all_purpose:9, big_fish:2 | caution:5, open:4, closed:2 | neutral:11 | calm:6, slight:5 | river_elevated_runoff_current:3, dirty_vibration:2, stable_pleasant_high_confidence:2, calm_bright_clear_subtle:1, cold_slow_or_front:1 | clear:7, dirty:2, stained:2 | Jun:7, Apr:1, Jul:1, May:1<br>summer:8, spring:2, fall:1 | current_swing:8, clear_subtle:5, calm_surface:4, dirty_vibration:4, low_light_surface:4, cold_slow:1 |
| Mouse Pattern<br>mouse_fly | fly | 6 | 6/2448 (0.2%) | 6/1224 (0.5%) | 0/612 (0%) | 6/612 (1%) | 2/4 | 36/612 (5.9%) | 16 | 37.5% | big_fish:6 | open:6 | neutral:6 | calm:6 | calm_low_light_surface:3, stable_pleasant_high_confidence:2, calm_bright_clear_subtle:1 | clear:2, dirty:2, stained:2 | Sep:6<br>fall:6 | calm_surface:6, current_swing:3, low_light_surface:3, clear_subtle:2, dirty_vibration:2 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3 | 3/2448 (0.1%) | 3/1224 (0.2%) | 2/612 (0.3%) | 1/612 (0.2%) | 1/2 | 144/612 (23.5%) | 29 | 10.3% | all_purpose:2, big_fish:1 | closed:2, caution:1 | neutral:2, suppressed:1 | breezy:1, calm:1, slight:1 | cold_slow_or_front:1, river_elevated_runoff_current:1, warming_search:1 | stained:2, clear:1 | Apr:2, Jun:1<br>spring:2, summer:1 | current_swing:3, dirty_vibration:2, cold_slow:1, low_light_surface:1, warming_search:1 |
| Conehead Streamer<br>conehead_streamer | fly | 0 | 0/2448 (0%) | 0/1224 (0%) | 0/612 (0%) | 0/612 (0%) | 0/0 | 144/612 (23.5%) | 30 | 0% |  |  |  |  |  |  |  |  |
| Big Tube Jig<br>big_smallmouth_tube | lure | 126 | 126/2448 (5.1%) | 126/1224 (10.3%) | 0/612 (0%) | 126/612 (20.6%) | 55/71 | 540/612 (88.2%) | 261 | 48.3% | big_fish:126 | closed:70, caution:31, open:25 | neutral:108, suppressed:14, active:4 | calm:54, slight:43, breezy:26, windy:3 | cold_slow_or_front:42, stable_pleasant_high_confidence:23, unclassified:22, breezy_windy_stained_reaction:9, calm_low_light_surface:8 | stained:44, clear:43, dirty:39 | Jun:22, May:19, Apr:18, Sep:17<br>spring:47, summer:42, fall:37 | cold_slow:41, calm_surface:25, clear_subtle:25, none:23, dirty_vibration:22, wind_reaction:20 |
| Ned Rig<br>ned_rig | lure | 96 | 96/2448 (3.9%) | 96/1224 (7.8%) | 79/612 (12.9%) | 17/612 (2.8%) | 75/21 | 612/612 (100%) | 343 | 28% | all_purpose:79, big_fish:17 | closed:72, caution:13, open:11 | neutral:83, suppressed:13 | calm:39, slight:31, breezy:16, windy:10 | cold_slow_or_front:51, stable_pleasant_high_confidence:13, unclassified:12, breezy_windy_stained_reaction:6, warming_search:6 | clear:54, stained:40, dirty:2 | May:16, Apr:12, Jun:9, Oct:9<br>spring:34, fall:21, summer:21, winter:20 | cold_slow:45, clear_subtle:32, wind_reaction:17, none:14, calm_surface:11, low_light_surface:7 |
| Football Jig<br>football_jig | lure | 94 | 94/2448 (3.8%) | 94/1224 (7.7%) | 0/612 (0%) | 94/612 (15.4%) | 43/51 | 468/612 (76.5%) | 157 | 59.9% | big_fish:94 | closed:67, caution:22, open:5 | neutral:80, suppressed:10, active:4 | slight:31, calm:30, breezy:24, windy:9 | cold_slow_or_front:35, stable_pleasant_high_confidence:16, unclassified:16, dirty_vibration:11, breezy_windy_stained_reaction:7 | dirty:38, clear:29, stained:27 | Oct:15, Apr:11, May:11, Sep:10<br>fall:31, spring:31, summer:20, winter:12 | cold_slow:37, wind_reaction:28, none:21, dirty_vibration:18, clear_subtle:13, low_light_surface:7 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 89 | 89/2448 (3.6%) | 89/1224 (7.3%) | 0/612 (0%) | 89/612 (14.5%) | 43/46 | 360/612 (58.8%) | 188 | 47.3% | big_fish:89 | closed:76, open:7, caution:6 | neutral:66, suppressed:18, active:5 | calm:42, slight:24, breezy:21, windy:2 | cold_slow_or_front:43, stable_pleasant_high_confidence:17, warming_search:8, unclassified:6, breezy_windy_stained_reaction:5 | stained:33, clear:30, dirty:26 | Apr:19, May:18, Sep:16, Oct:15<br>spring:50, fall:39 | cold_slow:45, none:16, clear_subtle:15, wind_reaction:14, dirty_vibration:13, warming_search:9 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 79 | 79/2448 (3.2%) | 79/1224 (6.5%) | 60/612 (9.8%) | 19/612 (3.1%) | 18/61 | 612/612 (100%) | 355 | 22.3% | all_purpose:60, big_fish:19 | closed:69, caution:7, open:3 | neutral:60, suppressed:18, active:1 | breezy:29, calm:20, slight:17, windy:13 | cold_slow_or_front:51, dirty_vibration:9, stable_pleasant_high_confidence:8, breezy_windy_stained_reaction:7, unclassified:3 | clear:27, dirty:27, stained:25 | May:17, Dec:11, Feb:11, Oct:11<br>winter:28, spring:27, fall:19, summer:5 | cold_slow:63, wind_reaction:27, dirty_vibration:16, clear_subtle:6, none:5, low_light_surface:4 |
| Blade Bait<br>blade_bait | lure | 63 | 63/2448 (2.6%) | 63/1224 (5.1%) | 39/612 (6.4%) | 24/612 (3.9%) | 39/24 | 612/612 (100%) | 254 | 24.8% | all_purpose:39, big_fish:24 | closed:49, caution:7, open:7 | neutral:49, suppressed:14 | breezy:27, calm:21, slight:9, windy:6 | cold_slow_or_front:28, dirty_vibration:16, breezy_windy_stained_reaction:7, stable_pleasant_high_confidence:5, calm_low_light_surface:3 | dirty:41, stained:17, clear:5 | May:10, Dec:9, Jun:9, Apr:8<br>spring:25, winter:18, fall:10, summer:10 | cold_slow:40, dirty_vibration:33, wind_reaction:22, current_swing:16, open_water_search:14, calm_surface:7 |
| Tube Jig<br>tube_jig | lure | 63 | 63/2448 (2.6%) | 63/1224 (5.1%) | 62/612 (10.1%) | 1/612 (0.2%) | 45/18 | 612/612 (100%) | 247 | 25.5% | all_purpose:62, big_fish:1 | closed:44, caution:10, open:9 | neutral:48, suppressed:12, active:3 | calm:25, slight:22, breezy:13, windy:3 | cold_slow_or_front:36, unclassified:8, calm_bright_clear_subtle:5, stable_pleasant_high_confidence:5, breezy_windy_stained_reaction:3 | clear:40, stained:19, dirty:4 | May:10, Oct:9, Sep:8, Apr:7<br>spring:20, fall:19, summer:12, winter:12 | cold_slow:35, clear_subtle:26, calm_surface:9, wind_reaction:8, none:7, current_swing:6 |
| Compact Glide Bait<br>compact_glidebait | lure | 54 | 54/2448 (2.2%) | 54/1224 (4.4%) | 0/612 (0%) | 54/612 (8.8%) | 21/33 | 300/612 (49%) | 170 | 31.8% | big_fish:54 | closed:23, caution:20, open:11 | neutral:51, active:3 | calm:22, slight:22, breezy:6, windy:4 | cold_slow_or_front:16, unclassified:14, stable_pleasant_high_confidence:9, calm_bright_clear_subtle:4, calm_low_light_surface:3 | clear:24, stained:20, dirty:10 | Aug:12, Jun:11, Oct:11, Sep:9<br>summer:27, fall:20, spring:7 | clear_subtle:17, calm_surface:11, cold_slow:11, none:11, wind_reaction:10, low_light_surface:8 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 52 | 52/2448 (2.1%) | 52/1224 (4.2%) | 47/612 (7.7%) | 5/612 (0.8%) | 42/10 | 612/612 (100%) | 233 | 22.3% | all_purpose:47, big_fish:5 | closed:20, open:20, caution:12 | neutral:47, active:5 | calm:28, slight:22, breezy:2 | stable_pleasant_high_confidence:12, unclassified:12, warming_search:11, calm_low_light_surface:7, cold_slow_or_front:6 | dirty:20, stained:18, clear:14 | Apr:13, Jun:13, Aug:8, Sep:7<br>summer:24, spring:16, fall:12 | calm_surface:20, warming_search:16, low_light_surface:12, none:12, clear_subtle:5, current_swing:4 |
| Bladed Jig<br>bladed_jig | lure | 49 | 49/2448 (2%) | 49/1224 (4%) | 44/612 (7.2%) | 5/612 (0.8%) | 40/9 | 612/612 (100%) | 311 | 15.8% | all_purpose:44, big_fish:5 | closed:27, caution:11, open:11 | neutral:43, active:4, suppressed:2 | calm:19, slight:12, breezy:10, windy:8 | breezy_windy_stained_reaction:10, dirty_vibration:10, unclassified:7, stable_pleasant_high_confidence:6, calm_low_light_surface:5 | stained:26, dirty:21, clear:2 | Jun:10, Apr:9, Jul:8, Sep:7<br>summer:19, spring:14, fall:13, winter:3 | dirty_vibration:27, wind_reaction:16, current_swing:12, calm_surface:11, cold_slow:10, low_light_surface:9 |
| Soft Jerkbait<br>soft_jerkbait | lure | 49 | 49/2448 (2%) | 49/1224 (4%) | 49/612 (8%) | 0/612 (0%) | 3/46 | 480/612 (78.4%) | 156 | 31.4% | all_purpose:49 | closed:18, caution:16, open:15 | neutral:45, active:4 | calm:22, slight:22, windy:3, breezy:2 | unclassified:16, stable_pleasant_high_confidence:9, calm_low_light_surface:5, cold_slow_or_front:5, warming_search:5 | clear:21, stained:16, dirty:12 | Aug:10, Jun:10, Sep:8, Apr:6<br>summer:26, fall:12, spring:11 | calm_surface:15, clear_subtle:15, none:12, low_light_surface:9, warming_search:7, wind_reaction:5 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 43 | 43/2448 (1.8%) | 43/1224 (3.5%) | 13/612 (2.1%) | 30/612 (4.9%) | 24/19 | 612/612 (100%) | 329 | 13.1% | big_fish:30, all_purpose:13 | closed:30, caution:12, open:1 | neutral:43 | breezy:24, windy:9, slight:8, calm:2 | dirty_vibration:13, breezy_windy_stained_reaction:10, cold_slow_or_front:8, unclassified:8, stable_pleasant_high_confidence:3 | dirty:19, stained:13, clear:11 | Mar:12, Jun:7, Jul:5, May:5<br>spring:21, summer:13, winter:8, fall:1 | wind_reaction:33, dirty_vibration:23, cold_slow:11, open_water_search:11, none:9, low_light_surface:2 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 42 | 42/2448 (1.7%) | 42/1224 (3.4%) | 33/612 (5.4%) | 9/612 (1.5%) | 33/9 | 612/612 (100%) | 433 | 9.7% | all_purpose:33, big_fish:9 | closed:41, caution:1 | neutral:30, suppressed:12 | calm:17, breezy:12, slight:8, windy:5 | cold_slow_or_front:27, dirty_vibration:11, breezy_windy_stained_reaction:2, stable_pleasant_high_confidence:2 | dirty:29, stained:8, clear:5 | Feb:8, Mar:7, May:7, Nov:6<br>spring:16, winter:16, fall:10 | cold_slow:33, dirty_vibration:13, wind_reaction:12, clear_subtle:5, none:5, current_swing:1 |
| Walking Bait<br>walking_topwater | lure | 38 | 38/2448 (1.6%) | 38/1224 (3.1%) | 0/612 (0%) | 38/612 (6.2%) | 28/10 | 234/612 (38.2%) | 85 | 44.7% | big_fish:38 | open:25, caution:13 | neutral:35, active:3 | calm:25, slight:13 | stable_pleasant_high_confidence:11, unclassified:9, calm_low_light_surface:7, cold_slow_or_front:4, calm_bright_clear_subtle:3 | stained:15, clear:13, dirty:10 | Jun:16, Sep:9, Aug:7, Jul:5<br>summer:28, fall:9, spring:1 | calm_surface:25, low_light_surface:14, clear_subtle:9, current_swing:9, dirty_vibration:6, none:4 |
| Spinnerbait<br>spinnerbait | lure | 36 | 36/2448 (1.5%) | 36/1224 (2.9%) | 33/612 (5.4%) | 3/612 (0.5%) | 22/14 | 612/612 (100%) | 312 | 11.5% | all_purpose:33, big_fish:3 | closed:22, caution:7, open:7 | neutral:29, suppressed:6, active:1 | calm:12, breezy:10, slight:10, windy:4 | cold_slow_or_front:9, dirty_vibration:7, unclassified:6, breezy_windy_stained_reaction:5, stable_pleasant_high_confidence:5 | dirty:19, stained:15, clear:2 | Jun:7, Apr:5, Aug:4, Mar:4<br>summer:13, spring:10, winter:7, fall:6 | dirty_vibration:18, cold_slow:11, wind_reaction:10, current_swing:9, none:9, calm_surface:7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 35 | 35/2448 (1.4%) | 35/1224 (2.9%) | 19/612 (3.1%) | 16/612 (2.6%) | 0/35 | 480/612 (78.4%) | 84 | 41.7% | all_purpose:19, big_fish:16 | closed:33, caution:2 | neutral:24, suppressed:11 | slight:13, breezy:11, calm:11 | cold_slow_or_front:33, calm_bright_clear_subtle:1, stable_pleasant_high_confidence:1 | stained:13, clear:12, dirty:10 | May:22, Apr:7, Oct:5, Sep:1<br>spring:29, fall:6 | cold_slow:34, clear_subtle:4, low_light_surface:2 |
| Buzzbait<br>buzzbait | lure | 31 | 31/2448 (1.3%) | 31/1224 (2.5%) | 0/612 (0%) | 31/612 (5.1%) | 21/10 | 234/612 (38.2%) | 68 | 45.6% | big_fish:31 | caution:20, open:11 | neutral:31 | calm:11, slight:11, breezy:6, windy:3 | unclassified:7, calm_low_light_surface:6, dirty_vibration:6, stable_pleasant_high_confidence:4, breezy_windy_stained_reaction:3 | dirty:17, stained:9, clear:5 | Jun:16, Aug:5, Jul:5, Sep:4<br>summer:26, fall:4, spring:1 | low_light_surface:15, dirty_vibration:13, calm_surface:11, wind_reaction:9, current_swing:8, none:5 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 30 | 30/2448 (1.2%) | 30/1224 (2.5%) | 22/612 (3.6%) | 8/612 (1.3%) | 3/27 | 612/612 (100%) | 112 | 26.8% | all_purpose:22, big_fish:8 | closed:22, caution:5, open:3 | neutral:27, suppressed:2, active:1 | calm:17, slight:12, breezy:1 | cold_slow_or_front:11, stable_pleasant_high_confidence:7, unclassified:5, calm_bright_clear_subtle:3, warming_search:3 | clear:24, stained:4, dirty:2 | Sep:7, Nov:6, Jan:5, Oct:4<br>fall:17, winter:6, summer:4, spring:3 | clear_subtle:24, cold_slow:6, none:6, calm_surface:3, current_swing:3, warming_search:3 |
| Inline Spinner<br>inline_spinner | lure | 29 | 29/2448 (1.2%) | 29/1224 (2.4%) | 23/612 (3.8%) | 6/612 (1%) | 16/13 | 612/612 (100%) | 284 | 10.2% | all_purpose:23, big_fish:6 | closed:17, caution:11, open:1 | neutral:27, suppressed:2 | breezy:19, windy:5, slight:4, calm:1 | breezy_windy_stained_reaction:7, cold_slow_or_front:7, dirty_vibration:6, stable_pleasant_high_confidence:4, river_elevated_runoff_current:2 | clear:14, stained:8, dirty:7 | Jun:8, Mar:7, Dec:3, May:3<br>spring:12, summer:11, winter:5, fall:1 | wind_reaction:22, dirty_vibration:13, open_water_search:10, cold_slow:9, current_swing:5, low_light_surface:4 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 27 | 27/2448 (1.1%) | 27/1224 (2.2%) | 20/612 (3.3%) | 7/612 (1.1%) | 4/23 | 480/612 (78.4%) | 115 | 23.5% | all_purpose:20, big_fish:7 | closed:13, caution:11, open:3 | neutral:26, suppressed:1 | breezy:12, windy:6, calm:5, slight:4 | dirty_vibration:13, breezy_windy_stained_reaction:6, stable_pleasant_high_confidence:3, cold_slow_or_front:2, river_elevated_runoff_current:2 | dirty:14, stained:9, clear:4 | Jun:12, Jul:4, May:4, Apr:3<br>summer:16, spring:10, fall:1 | dirty_vibration:23, wind_reaction:17, current_swing:10, low_light_surface:6, calm_surface:3, open_water_search:3 |
| Finesse Jig<br>finesse_jig | lure | 20 | 20/2448 (0.8%) | 20/1224 (1.6%) | 13/612 (2.1%) | 7/612 (1.1%) | 9/11 | 612/612 (100%) | 341 | 5.9% | all_purpose:13, big_fish:7 | closed:17, caution:2, open:1 | neutral:13, suppressed:7 | calm:8, breezy:7, slight:5 | cold_slow_or_front:14, breezy_windy_stained_reaction:2, stable_pleasant_high_confidence:2, unclassified:2 | clear:10, stained:9, dirty:1 | Mar:5, Jan:3, Nov:3, Dec:2<br>winter:7, spring:6, fall:4, summer:3 | cold_slow:13, clear_subtle:6, none:4, wind_reaction:4, dirty_vibration:2, calm_surface:1 |
| Wake Bait<br>wake_bait | lure | 16 | 16/2448 (0.7%) | 16/1224 (1.3%) | 0/612 (0%) | 16/612 (2.6%) | 13/3 | 174/612 (28.4%) | 63 | 25.4% | big_fish:16 | open:15, caution:1 | neutral:13, active:3 | calm:15, slight:1 | stable_pleasant_high_confidence:6, calm_low_light_surface:5, calm_bright_clear_subtle:2, cold_slow_or_front:2, unclassified:1 | clear:7, stained:5, dirty:4 | Jun:6, Aug:4, Jul:3, Sep:3<br>summer:13, fall:3 | calm_surface:15, low_light_surface:6, clear_subtle:5, warming_search:3 |
| Topwater Popper<br>popping_topwater | lure | 16 | 16/2448 (0.7%) | 16/1224 (1.3%) | 15/612 (2.5%) | 1/612 (0.2%) | 0/16 | 234/612 (38.2%) | 22 | 72.7% | all_purpose:15, big_fish:1 | open:16 | neutral:13, active:3 | calm:16 | stable_pleasant_high_confidence:10, calm_low_light_surface:4, cold_slow_or_front:2 | dirty:7, stained:7, clear:2 | Jun:5, Sep:5, Aug:4, Jul:2<br>summer:11, fall:5 | calm_surface:16, low_light_surface:4, warming_search:2, clear_subtle:1, current_swing:1 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 14 | 14/2448 (0.6%) | 14/1224 (1.1%) | 14/612 (2.3%) | 0/612 (0%) | 0/14 | 156/612 (25.5%) | 59 | 23.7% | all_purpose:14 | closed:6, caution:4, open:4 | neutral:14 | calm:7, breezy:3, slight:3, windy:1 | stable_pleasant_high_confidence:5, dirty_vibration:3, unclassified:3, calm_low_light_surface:2, cold_slow_or_front:1 | clear:6, dirty:6, stained:2 | Jun:8, Apr:3, May:3<br>summer:8, spring:6 | clear_subtle:5, calm_surface:4, none:4, wind_reaction:4, dirty_vibration:3, low_light_surface:2 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 12 | 12/2448 (0.5%) | 12/1224 (1%) | 12/612 (2%) | 0/612 (0%) | 2/10 | 468/612 (76.5%) | 125 | 9.6% | all_purpose:12 | closed:7, caution:3, open:2 | neutral:10, active:2 | slight:6, calm:4, breezy:2 | unclassified:4, cold_slow_or_front:2, stable_pleasant_high_confidence:2, warming_search:2, breezy_windy_stained_reaction:1 | dirty:11, stained:1 | Apr:3, Jun:3, Mar:2, Oct:2<br>spring:5, fall:4, summer:3 | none:5, calm_surface:2, dirty_vibration:2, open_water_search:2, warming_search:2, wind_reaction:2 |
| Swim Jig<br>swim_jig | lure | 8 | 8/2448 (0.3%) | 8/1224 (0.7%) | 8/612 (1.3%) | 0/612 (0%) | 6/2 | 612/612 (100%) | 207 | 3.9% | all_purpose:8 | closed:6, open:2 | neutral:7, suppressed:1 | calm:4, slight:3, breezy:1 | cold_slow_or_front:4, stable_pleasant_high_confidence:2, warming_search:2 | dirty:5, stained:2, clear:1 | Sep:3, Apr:2, Jun:1, May:1<br>fall:4, spring:3, summer:1 | calm_surface:2, cold_slow:2, none:2, warming_search:2 |
| Lipless Crankbait<br>lipless_crankbait | lure | 5 | 5/2448 (0.2%) | 5/1224 (0.4%) | 3/612 (0.5%) | 2/612 (0.3%) | 3/2 | 612/612 (100%) | 109 | 4.6% | all_purpose:3, big_fish:2 | closed:4, caution:1 | neutral:5 | breezy:2, windy:2, slight:1 | dirty_vibration:3, breezy_windy_stained_reaction:1, unclassified:1 | dirty:4, stained:1 | Aug:1, Dec:1, Jan:1, Jul:1<br>summer:2, winter:2, spring:1 | dirty_vibration:4, wind_reaction:4, cold_slow:2, none:1, open_water_search:1 |
| Hair Jig<br>hair_jig | lure | 3 | 3/2448 (0.1%) | 3/1224 (0.2%) | 2/612 (0.3%) | 1/612 (0.2%) | 1/2 | 144/612 (23.5%) | 44 | 6.8% | all_purpose:2, big_fish:1 | closed:2, open:1 | neutral:2, suppressed:1 | calm:2, breezy:1 | calm_low_light_surface:1, cold_slow_or_front:1, warming_search:1 | stained:2, clear:1 | Apr:2, Sep:1<br>spring:2, fall:1 | current_swing:3, dirty_vibration:2, calm_surface:1, cold_slow:1, low_light_surface:1, warming_search:1 |
| Glide Bait<br>glidebait | lure | 3 | 3/2448 (0.1%) | 3/1224 (0.2%) | 0/612 (0%) | 3/612 (0.5%) | 2/1 | 36/612 (5.9%) | 26 | 11.5% | big_fish:3 | caution:3 | active:2, neutral:1 | slight:2, breezy:1 | unclassified:2, stable_pleasant_high_confidence:1 | clear:2, dirty:1 | Sep:2, Jun:1<br>fall:2, summer:1 | none:2, wind_reaction:1 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 2 | 2/2448 (0.1%) | 2/1224 (0.2%) | 2/612 (0.3%) | 0/612 (0%) | 1/1 | 468/612 (76.5%) | 118 | 1.7% | all_purpose:2 | caution:1, closed:1 | neutral:2 | calm:1, slight:1 | stable_pleasant_high_confidence:1, unclassified:1 | dirty:2 | Aug:1, Nov:1<br>fall:1, summer:1 | none:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0 | 0/2448 (0%) | 0/1224 (0%) | 0/612 (0%) | 0/612 (0%) | 0/0 | 132/612 (21.6%) | 9 | 0% |  |  |  |  |  |  |  |  |

## PB Sensibility Audit

| Profile | Gear | All side share | AP side share | BF side share | AP selected | BF selected | PB skew | Top/HM | Goal tags | Condition tags | Forage tags | Wind selected | Surface gate selected | Primary selected contexts |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 118/1224 (9.6%) | 16/612 (2.6%) | 102/612 (16.7%) | 16 | 102 | 6.4x | 77/41 | versatile_search, big_fish_upside | open_water_search, runoff_streamer | baitfish | calm:52, slight:38, breezy:21, windy:7 | closed:72, caution:24, open:22 | cold_slow_or_front:37, stable_pleasant_high_confidence:24, unclassified:24, dirty_vibration:10<br>dirty:50, stained:42, clear:26<br>cold_slow:34, none:29, calm_surface:22, wind_reaction:21, dirty_vibration:18 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 58/1224 (4.7%) | 48/612 (7.8%) | 10/612 (1.6%) | 48 | 10 | 0.2x | 4/54 | versatile_search | open_water_search, warming_search | baitfish, bluegill_perch | slight:22, calm:16, breezy:15, windy:5 | closed:33, caution:20, open:5 | unclassified:14, stable_pleasant_high_confidence:11, warming_search:9, dirty_vibration:8<br>dirty:24, stained:21, clear:13<br>none:21, wind_reaction:20, dirty_vibration:15, warming_search:13, open_water_search:6 |
| Bass Popper<br>popper_fly | fly | 21/1224 (1.7%) | 20/612 (3.3%) | 1/612 (0.2%) | 20 | 1 | 0.1x | 13/8 | reliable_action, versatile_search | calm_surface, low_light_surface | surface_prey, bluegill_perch | calm:19, slight:2 | open:19, caution:2 | stable_pleasant_high_confidence:10, calm_low_light_surface:5, calm_bright_clear_subtle:2, cold_slow_or_front:2<br>stained:9, dirty:7, clear:5<br>calm_surface:19, low_light_surface:7, clear_subtle:3, current_swing:2, dirty_vibration:2 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3/1224 (0.2%) | 2/612 (0.3%) | 1/612 (0.2%) | 2 | 1 | 0.5x | 1/2 | versatile_search | current_swing, open_water_search, wind_reaction | baitfish | breezy:1, calm:1, slight:1 | closed:2, caution:1 | cold_slow_or_front:1, river_elevated_runoff_current:1, warming_search:1<br>stained:2, clear:1<br>current_swing:3, dirty_vibration:2, cold_slow:1, low_light_surface:1, warming_search:1 |
| Clouser Minnow<br>clouser_minnow | fly | 98/1224 (8%) | 97/612 (15.8%) | 1/612 (0.2%) | 97 | 1 | 0x | 45/53 | reliable_action, versatile_search | current_swing, open_water_search | baitfish | calm:43, slight:37, breezy:16, windy:2 | closed:58, caution:20, open:20 | cold_slow_or_front:41, stable_pleasant_high_confidence:18, unclassified:17, warming_search:8<br>clear:37, stained:37, dirty:24<br>cold_slow:33, calm_surface:20, none:19, clear_subtle:17, low_light_surface:13 |
| Conehead Streamer<br>conehead_streamer | fly | 0/1224 (0%) | 0/612 (0%) | 0/612 (0%) | 0 | 0 | 0 | 0/0 | versatile_search | current_swing, open_water_search, wind_reaction | baitfish |  |  |  |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 97/1224 (7.9%) | 59/612 (9.6%) | 38/612 (6.2%) | 59 | 38 | 0.6x | 46/51 | reliable_action | cover_ambush, cold_slow | crawfish | slight:46, calm:29, breezy:17, windy:5 | closed:69, caution:23, open:5 | cold_slow_or_front:48, unclassified:18, stable_pleasant_high_confidence:10, calm_bright_clear_subtle:7<br>clear:39, stained:32, dirty:26<br>cold_slow:49, clear_subtle:24, none:23, wind_reaction:15, low_light_surface:10 |
| Crawfish Streamer<br>crawfish_streamer | fly | 21/1224 (1.7%) | 17/612 (2.8%) | 4/612 (0.7%) | 17 | 4 | 0.2x | 16/5 | reliable_action | current_swing, clear_subtle, cold_slow | crawfish | calm:9, slight:8, breezy:4 | closed:12, caution:5, open:4 | cold_slow_or_front:7, unclassified:3, warming_search:3, calm_low_light_surface:2<br>clear:12, dirty:6, stained:3<br>clear_subtle:11, current_swing:9, cold_slow:6, dirty_vibration:6, calm_surface:4 |
| Deceiver<br>deceiver | fly | 55/1224 (4.5%) | 41/612 (6.7%) | 14/612 (2.3%) | 41 | 14 | 0.3x | 44/11 | versatile_search | wind_reaction, open_water_search | baitfish | breezy:30, windy:12, slight:11, calm:2 | closed:39, caution:14, open:2 | dirty_vibration:17, breezy_windy_stained_reaction:12, cold_slow_or_front:11, unclassified:8<br>dirty:22, clear:17, stained:16<br>wind_reaction:42, dirty_vibration:29, cold_slow:15, open_water_search:12, none:7 |
| Deer Hair Slider<br>deer_hair_slider | fly | 52/1224 (4.2%) | 1/612 (0.2%) | 51/612 (8.3%) | 1 | 51 | 51x | 20/32 | big_fish_upside | calm_surface, low_light_surface | surface_prey, baitfish | calm:28, slight:20, breezy:4 | open:28, caution:24 | unclassified:16, stable_pleasant_high_confidence:13, calm_low_light_surface:10, cold_slow_or_front:4<br>clear:18, dirty:18, stained:16<br>calm_surface:28, low_light_surface:17, clear_subtle:12, current_swing:9, none:9 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 32/1224 (2.6%) | 0/612 (0%) | 32/612 (5.2%) | 0 | 32 | PB-only | 15/17 | big_fish_upside, high_risk_high_reward | runoff_streamer, cover_ambush | baitfish, bluegill_perch | breezy:12, calm:9, windy:6, slight:5 | closed:30, open:2 | cold_slow_or_front:20, dirty_vibration:5, breezy_windy_stained_reaction:3, stable_pleasant_high_confidence:2<br>dirty:12, stained:11, clear:9<br>cold_slow:25, dirty_vibration:10, wind_reaction:9, current_swing:6, warming_search:3 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49/1224 (4%) | 29/612 (4.7%) | 20/612 (3.3%) | 29 | 20 | 0.7x | 35/14 | reliable_action, versatile_search | calm_surface, low_light_surface | surface_prey, baitfish | calm:46, slight:3 | open:46, caution:3 | stable_pleasant_high_confidence:20, calm_low_light_surface:14, cold_slow_or_front:6, calm_bright_clear_subtle:5<br>clear:17, dirty:16, stained:16<br>calm_surface:46, low_light_surface:17, clear_subtle:14, current_swing:7, warming_search:6 |
| Game Changer<br>game_changer | fly | 137/1224 (11.2%) | 19/612 (3.1%) | 118/612 (19.3%) | 19 | 118 | 6.2x | 82/55 | versatile_search, big_fish_upside | open_water_search | baitfish | calm:58, slight:50, breezy:24, windy:5 | closed:73, caution:35, open:29 | cold_slow_or_front:43, stable_pleasant_high_confidence:29, unclassified:28, warming_search:9<br>clear:50, dirty:47, stained:40<br>cold_slow:35, none:31, calm_surface:29, clear_subtle:28, wind_reaction:22 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 61/1224 (5%) | 42/612 (6.9%) | 19/612 (3.1%) | 42 | 19 | 0.5x | 27/34 | reliable_action | cold_slow, current_swing | leech_worm | breezy:23, calm:20, windy:12, slight:6 | closed:59, caution:2 | cold_slow_or_front:35, breezy_windy_stained_reaction:10, dirty_vibration:10, stable_pleasant_high_confidence:6<br>dirty:22, stained:22, clear:17<br>cold_slow:48, wind_reaction:27, dirty_vibration:20, open_water_search:9, clear_subtle:4 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 41/1224 (3.3%) | 32/612 (5.2%) | 9/612 (1.5%) | 32 | 9 | 0.3x | 21/20 | reliable_action | cold_slow, clear_subtle | leech_worm | calm:22, breezy:9, slight:6, windy:4 | closed:37, caution:3, open:1 | cold_slow_or_front:22, stable_pleasant_high_confidence:8, dirty_vibration:3, unclassified:3<br>clear:29, dirty:6, stained:6<br>clear_subtle:23, cold_slow:23, wind_reaction:10, dirty_vibration:4, open_water_search:4 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 12/1224 (1%) | 11/612 (1.8%) | 1/612 (0.2%) | 11 | 1 | 0.1x | 3/9 | versatile_search | warming_search, current_swing | leech_worm | calm:7, slight:4, windy:1 | closed:10, caution:1, open:1 | warming_search:6, dirty_vibration:2, breezy_windy_stained_reaction:1, calm_low_light_surface:1<br>dirty:6, stained:5, clear:1<br>warming_search:9, dirty_vibration:4, current_swing:3, none:2, calm_surface:1 |
| Mouse Pattern<br>mouse_fly | fly | 6/1224 (0.5%) | 0/612 (0%) | 6/612 (1%) | 0 | 6 | PB-only | 2/4 | big_fish_upside, high_risk_high_reward | calm_surface, low_light_surface | surface_prey | calm:6 | open:6 | calm_low_light_surface:3, stable_pleasant_high_confidence:2, calm_bright_clear_subtle:1<br>clear:2, dirty:2, stained:2<br>calm_surface:6, current_swing:3, low_light_surface:3, clear_subtle:2, dirty_vibration:2 |
| Muddler Minnow<br>muddler_sculpin | fly | 23/1224 (1.9%) | 22/612 (3.6%) | 1/612 (0.2%) | 22 | 1 | 0x | 19/4 | reliable_action | current_swing, cold_slow | baitfish, crawfish | breezy:9, calm:7, slight:7 | closed:16, open:4, caution:3 | cold_slow_or_front:13, breezy_windy_stained_reaction:2, calm_low_light_surface:2, river_elevated_runoff_current:2<br>clear:10, stained:9, dirty:4<br>cold_slow:14, current_swing:8, dirty_vibration:6, clear_subtle:5, calm_surface:4 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 132/1224 (10.8%) | 18/612 (2.9%) | 114/612 (18.6%) | 18 | 114 | 6.3x | 47/85 | reliable_action, big_fish_upside | cold_slow, cover_ambush | leech_worm | breezy:44, slight:39, calm:33, windy:16 | closed:105, caution:27 | cold_slow_or_front:59, dirty_vibration:22, breezy_windy_stained_reaction:17, unclassified:16<br>dirty:56, stained:52, clear:24<br>cold_slow:70, wind_reaction:47, dirty_vibration:42, none:25, low_light_surface:12 |
| Sculpin Streamer<br>sculpin_streamer | fly | 17/1224 (1.4%) | 16/612 (2.6%) | 1/612 (0.2%) | 16 | 1 | 0.1x | 13/4 | reliable_action | current_swing, cold_slow, runoff_streamer | baitfish, crawfish | slight:7, breezy:5, calm:5 | closed:12, caution:3, open:2 | cold_slow_or_front:11, dirty_vibration:2, unclassified:2, stable_pleasant_high_confidence:1<br>clear:6, dirty:6, stained:5<br>cold_slow:10, current_swing:5, dirty_vibration:3, calm_surface:2, clear_subtle:2 |
| Sculpzilla<br>sculpzilla | fly | 30/1224 (2.5%) | 0/612 (0%) | 30/612 (4.9%) | 0 | 30 | PB-only | 19/11 | big_fish_upside | runoff_streamer, current_swing | baitfish, crawfish | calm:12, slight:12, breezy:6 | closed:17, open:7, caution:6 | cold_slow_or_front:12, dirty_vibration:5, calm_low_light_surface:3, stable_pleasant_high_confidence:3<br>stained:11, dirty:10, clear:9<br>current_swing:15, cold_slow:11, dirty_vibration:11, calm_surface:7, low_light_surface:6 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 11/1224 (0.9%) | 9/612 (1.5%) | 2/612 (0.3%) | 9 | 2 | 0.2x | 3/8 | reliable_action | clear_subtle, current_swing | baitfish | calm:6, slight:5 | caution:5, open:4, closed:2 | river_elevated_runoff_current:3, dirty_vibration:2, stable_pleasant_high_confidence:2, calm_bright_clear_subtle:1<br>clear:7, dirty:2, stained:2<br>current_swing:8, clear_subtle:5, calm_surface:4, dirty_vibration:4, low_light_surface:4 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 34/1224 (2.8%) | 20/612 (3.3%) | 14/612 (2.3%) | 20 | 14 | 0.7x | 9/25 | versatile_search | clear_subtle, open_water_search | baitfish, bluegill_perch | calm:17, slight:9, breezy:6, windy:2 | closed:16, caution:12, open:6 | cold_slow_or_front:8, stable_pleasant_high_confidence:6, unclassified:6, calm_bright_clear_subtle:5<br>clear:25, stained:5, dirty:4<br>clear_subtle:22, wind_reaction:8, cold_slow:7, calm_surface:6, dirty_vibration:5 |
| Woolly Bugger<br>woolly_bugger | fly | 74/1224 (6%) | 64/612 (10.5%) | 10/612 (1.6%) | 64 | 10 | 0.2x | 16/58 | reliable_action | cold_slow, current_swing | leech_worm | calm:30, slight:21, breezy:19, windy:4 | closed:66, caution:7, open:1 | cold_slow_or_front:57, stable_pleasant_high_confidence:5, breezy_windy_stained_reaction:4, dirty_vibration:3<br>clear:27, stained:26, dirty:21<br>cold_slow:61, clear_subtle:12, wind_reaction:11, dirty_vibration:9, low_light_surface:7 |
| Zonker Streamer<br>zonker_streamer | fly | 42/1224 (3.4%) | 29/612 (4.7%) | 13/612 (2.1%) | 29 | 13 | 0.4x | 35/7 | versatile_search | wind_reaction, open_water_search, current_swing | baitfish | breezy:23, windy:15, calm:3, slight:1 | closed:28, caution:12, open:2 | breezy_windy_stained_reaction:16, dirty_vibration:16, cold_slow_or_front:5, stable_pleasant_high_confidence:3<br>stained:18, dirty:17, clear:7<br>wind_reaction:38, dirty_vibration:33, cold_slow:12, open_water_search:9, low_light_surface:4 |
| Big Tube Jig<br>big_smallmouth_tube | lure | 126/1224 (10.3%) | 0/612 (0%) | 126/612 (20.6%) | 0 | 126 | PB-only | 55/71 | big_fish_upside | clear_subtle, current_swing, cold_slow | crawfish, baitfish | calm:54, slight:43, breezy:26, windy:3 | closed:70, caution:31, open:25 | cold_slow_or_front:42, stable_pleasant_high_confidence:23, unclassified:22, breezy_windy_stained_reaction:9<br>stained:44, clear:43, dirty:39<br>cold_slow:41, calm_surface:25, clear_subtle:25, none:23, dirty_vibration:22 |
| Blade Bait<br>blade_bait | lure | 63/1224 (5.1%) | 39/612 (6.4%) | 24/612 (3.9%) | 39 | 24 | 0.6x | 39/24 | reliable_action | cold_slow, open_water_search, current_swing | baitfish | breezy:27, calm:21, slight:9, windy:6 | closed:49, caution:7, open:7 | cold_slow_or_front:28, dirty_vibration:16, breezy_windy_stained_reaction:7, stable_pleasant_high_confidence:5<br>dirty:41, stained:17, clear:5<br>cold_slow:40, dirty_vibration:33, wind_reaction:22, current_swing:16, open_water_search:14 |
| Bladed Jig<br>bladed_jig | lure | 49/1224 (4%) | 44/612 (7.2%) | 5/612 (0.8%) | 44 | 5 | 0.1x | 40/9 | reliable_action, versatile_search | wind_reaction, dirty_vibration, cover_ambush, warming_search | baitfish, bluegill_perch | calm:19, slight:12, breezy:10, windy:8 | closed:27, caution:11, open:11 | breezy_windy_stained_reaction:10, dirty_vibration:10, unclassified:7, stable_pleasant_high_confidence:6<br>stained:26, dirty:21, clear:2<br>dirty_vibration:27, wind_reaction:16, current_swing:12, calm_surface:11, cold_slow:10 |
| Buzzbait<br>buzzbait | lure | 31/1224 (2.5%) | 0/612 (0%) | 31/612 (5.1%) | 0 | 31 | PB-only | 21/10 | big_fish_upside, high_risk_high_reward | low_light_surface, wind_reaction, dirty_vibration | surface_prey, baitfish | calm:11, slight:11, breezy:6, windy:3 | caution:20, open:11 | unclassified:7, calm_low_light_surface:6, dirty_vibration:6, stable_pleasant_high_confidence:4<br>dirty:17, stained:9, clear:5<br>low_light_surface:15, dirty_vibration:13, calm_surface:11, wind_reaction:9, current_swing:8 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 2/1224 (0.2%) | 2/612 (0.3%) | 0/612 (0%) | 2 | 0 | 0x | 1/1 | reliable_action, versatile_search | clear_subtle, cold_slow | leech_worm, baitfish | calm:1, slight:1 | caution:1, closed:1 | stable_pleasant_high_confidence:1, unclassified:1<br>dirty:2<br>none:2 |
| Compact Glide Bait<br>compact_glidebait | lure | 54/1224 (4.4%) | 0/612 (0%) | 54/612 (8.8%) | 0 | 54 | PB-only | 21/33 | big_fish_upside, high_risk_high_reward | clear_subtle, open_water_search | baitfish, bluegill_perch | calm:22, slight:22, breezy:6, windy:4 | closed:23, caution:20, open:11 | cold_slow_or_front:16, unclassified:14, stable_pleasant_high_confidence:9, calm_bright_clear_subtle:4<br>clear:24, stained:20, dirty:10<br>clear_subtle:17, calm_surface:11, cold_slow:11, none:11, wind_reaction:10 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 12/1224 (1%) | 12/612 (2%) | 0/612 (0%) | 12 | 0 | 0x | 2/10 | versatile_search | open_water_search, cold_slow | baitfish, crawfish | slight:6, calm:4, breezy:2 | closed:7, caution:3, open:2 | unclassified:4, cold_slow_or_front:2, stable_pleasant_high_confidence:2, warming_search:2<br>dirty:11, stained:1<br>none:5, calm_surface:2, dirty_vibration:2, open_water_search:2, warming_search:2 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 30/1224 (2.5%) | 22/612 (3.6%) | 8/612 (1.3%) | 22 | 8 | 0.4x | 3/27 | reliable_action | clear_subtle, heat_finesse | baitfish, crawfish | calm:17, slight:12, breezy:1 | closed:22, caution:5, open:3 | cold_slow_or_front:11, stable_pleasant_high_confidence:7, unclassified:5, calm_bright_clear_subtle:3<br>clear:24, stained:4, dirty:2<br>clear_subtle:24, cold_slow:6, none:6, calm_surface:3, current_swing:3 |
| Finesse Jig<br>finesse_jig | lure | 20/1224 (1.6%) | 13/612 (2.1%) | 7/612 (1.1%) | 13 | 7 | 0.5x | 9/11 | reliable_action | clear_subtle, cold_slow, heat_finesse | crawfish, leech_worm | calm:8, breezy:7, slight:5 | closed:17, caution:2, open:1 | cold_slow_or_front:14, breezy_windy_stained_reaction:2, stable_pleasant_high_confidence:2, unclassified:2<br>clear:10, stained:9, dirty:1<br>cold_slow:13, clear_subtle:6, none:4, wind_reaction:4, dirty_vibration:2 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 35/1224 (2.9%) | 19/612 (3.1%) | 16/612 (2.6%) | 19 | 16 | 0.8x | 0/35 | reliable_action | clear_subtle, cold_slow | baitfish | slight:13, breezy:11, calm:11 | closed:33, caution:2 | cold_slow_or_front:33, calm_bright_clear_subtle:1, stable_pleasant_high_confidence:1<br>stained:13, clear:12, dirty:10<br>cold_slow:34, clear_subtle:4, low_light_surface:2 |
| Football Jig<br>football_jig | lure | 94/1224 (7.7%) | 0/612 (0%) | 94/612 (15.4%) | 0 | 94 | PB-only | 43/51 | big_fish_upside | cold_slow, cover_ambush | crawfish | slight:31, calm:30, breezy:24, windy:9 | closed:67, caution:22, open:5 | cold_slow_or_front:35, stable_pleasant_high_confidence:16, unclassified:16, dirty_vibration:11<br>dirty:38, clear:29, stained:27<br>cold_slow:37, wind_reaction:28, none:21, dirty_vibration:18, clear_subtle:13 |
| Glide Bait<br>glidebait | lure | 3/1224 (0.2%) | 0/612 (0%) | 3/612 (0.5%) | 0 | 3 | PB-only | 2/1 | big_fish_upside, high_risk_high_reward | clear_subtle, open_water_search, cover_ambush | baitfish, bluegill_perch | slight:2, breezy:1 | caution:3 | unclassified:2, stable_pleasant_high_confidence:1<br>clear:2, dirty:1<br>none:2, wind_reaction:1 |
| Hair Jig<br>hair_jig | lure | 3/1224 (0.2%) | 2/612 (0.3%) | 1/612 (0.2%) | 2 | 1 | 0.5x | 1/2 | reliable_action | clear_subtle, current_swing, cold_slow | baitfish, leech_worm | calm:2, breezy:1 | closed:2, open:1 | calm_low_light_surface:1, cold_slow_or_front:1, warming_search:1<br>stained:2, clear:1<br>current_swing:3, dirty_vibration:2, calm_surface:1, cold_slow:1, low_light_surface:1 |
| Inline Spinner<br>inline_spinner | lure | 29/1224 (2.4%) | 23/612 (3.8%) | 6/612 (1%) | 23 | 6 | 0.3x | 16/13 | reliable_action, versatile_search | wind_reaction, open_water_search, current_swing | baitfish | breezy:19, windy:5, slight:4, calm:1 | closed:17, caution:11, open:1 | breezy_windy_stained_reaction:7, cold_slow_or_front:7, dirty_vibration:6, stable_pleasant_high_confidence:4<br>clear:14, stained:8, dirty:7<br>wind_reaction:22, dirty_vibration:13, open_water_search:10, cold_slow:9, current_swing:5 |
| Lipless Crankbait<br>lipless_crankbait | lure | 5/1224 (0.4%) | 3/612 (0.5%) | 2/612 (0.3%) | 3 | 2 | 0.7x | 3/2 | versatile_search | wind_reaction, open_water_search | baitfish | breezy:2, windy:2, slight:1 | closed:4, caution:1 | dirty_vibration:3, breezy_windy_stained_reaction:1, unclassified:1<br>dirty:4, stained:1<br>dirty_vibration:4, wind_reaction:4, cold_slow:2, none:1, open_water_search:1 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 89/1224 (7.3%) | 0/612 (0%) | 89/612 (14.5%) | 0 | 89 | PB-only | 43/46 | big_fish_upside, high_risk_high_reward | clear_subtle, cold_slow, open_water_search | baitfish | calm:42, slight:24, breezy:21, windy:2 | closed:76, open:7, caution:6 | cold_slow_or_front:43, stable_pleasant_high_confidence:17, warming_search:8, unclassified:6<br>stained:33, clear:30, dirty:26<br>cold_slow:45, none:16, clear_subtle:15, wind_reaction:14, dirty_vibration:13 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 43/1224 (3.5%) | 13/612 (2.1%) | 30/612 (4.9%) | 13 | 30 | 2.3x | 24/19 | versatile_search | wind_reaction, open_water_search, warming_search | baitfish, crawfish | breezy:24, windy:9, slight:8, calm:2 | closed:30, caution:12, open:1 | dirty_vibration:13, breezy_windy_stained_reaction:10, cold_slow_or_front:8, unclassified:8<br>dirty:19, stained:13, clear:11<br>wind_reaction:33, dirty_vibration:23, cold_slow:11, open_water_search:11, none:9 |
| Ned Rig<br>ned_rig | lure | 96/1224 (7.8%) | 79/612 (12.9%) | 17/612 (2.8%) | 79 | 17 | 0.2x | 75/21 | reliable_action | clear_subtle, cold_slow, heat_finesse | leech_worm, crawfish | calm:39, slight:31, breezy:16, windy:10 | closed:72, caution:13, open:11 | cold_slow_or_front:51, stable_pleasant_high_confidence:13, unclassified:12, breezy_windy_stained_reaction:6<br>clear:54, stained:40, dirty:2<br>cold_slow:45, clear_subtle:32, wind_reaction:17, none:14, calm_surface:11 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 52/1224 (4.2%) | 47/612 (7.7%) | 5/612 (0.8%) | 47 | 5 | 0.1x | 42/10 | reliable_action, versatile_search | open_water_search, warming_search | baitfish, bluegill_perch | calm:28, slight:22, breezy:2 | closed:20, open:20, caution:12 | stable_pleasant_high_confidence:12, unclassified:12, warming_search:11, calm_low_light_surface:7<br>dirty:20, stained:18, clear:14<br>calm_surface:20, warming_search:16, low_light_surface:12, none:12, clear_subtle:5 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 0/1224 (0%) | 0/612 (0%) | 0/612 (0%) | 0 | 0 | 0 | 0/0 | reliable_action | clear_subtle, cold_slow, heat_finesse, current_swing | leech_worm |  |  |  |
| Soft Jerkbait<br>soft_jerkbait | lure | 49/1224 (4%) | 49/612 (8%) | 0/612 (0%) | 49 | 0 | 0x | 3/46 | reliable_action, versatile_search | clear_subtle, open_water_search | baitfish | calm:22, slight:22, windy:3, breezy:2 | closed:18, caution:16, open:15 | unclassified:16, stable_pleasant_high_confidence:9, calm_low_light_surface:5, cold_slow_or_front:5<br>clear:21, stained:16, dirty:12<br>calm_surface:15, clear_subtle:15, none:12, low_light_surface:9, warming_search:7 |
| Spinnerbait<br>spinnerbait | lure | 36/1224 (2.9%) | 33/612 (5.4%) | 3/612 (0.5%) | 33 | 3 | 0.1x | 22/14 | reliable_action, versatile_search | wind_reaction, dirty_vibration, cover_ambush | baitfish, bluegill_perch | calm:12, breezy:10, slight:10, windy:4 | closed:22, caution:7, open:7 | cold_slow_or_front:9, dirty_vibration:7, unclassified:6, breezy_windy_stained_reaction:5<br>dirty:19, stained:15, clear:2<br>dirty_vibration:18, cold_slow:11, wind_reaction:10, current_swing:9, none:9 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 27/1224 (2.2%) | 20/612 (3.3%) | 7/612 (1.1%) | 20 | 7 | 0.4x | 4/23 | versatile_search | cover_ambush, dirty_vibration, wind_reaction | baitfish, bluegill_perch | breezy:12, windy:6, calm:5, slight:4 | closed:13, caution:11, open:3 | dirty_vibration:13, breezy_windy_stained_reaction:6, stable_pleasant_high_confidence:3, cold_slow_or_front:2<br>dirty:14, stained:9, clear:4<br>dirty_vibration:23, wind_reaction:17, current_swing:10, low_light_surface:6, calm_surface:3 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 79/1224 (6.5%) | 60/612 (9.8%) | 19/612 (3.1%) | 60 | 19 | 0.3x | 18/61 | reliable_action, versatile_search | clear_subtle, cold_slow, wind_reaction | baitfish | breezy:29, calm:20, slight:17, windy:13 | closed:69, caution:7, open:3 | cold_slow_or_front:51, dirty_vibration:9, stable_pleasant_high_confidence:8, breezy_windy_stained_reaction:7<br>clear:27, dirty:27, stained:25<br>cold_slow:63, wind_reaction:27, dirty_vibration:16, clear_subtle:6, none:5 |
| Swim Jig<br>swim_jig | lure | 8/1224 (0.7%) | 8/612 (1.3%) | 0/612 (0%) | 8 | 0 | 0x | 6/2 | reliable_action, versatile_search | cover_ambush, warming_search | bluegill_perch, baitfish | calm:4, slight:3, breezy:1 | closed:6, open:2 | cold_slow_or_front:4, stable_pleasant_high_confidence:2, warming_search:2<br>dirty:5, stained:2, clear:1<br>calm_surface:2, cold_slow:2, none:2, warming_search:2 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 42/1224 (3.4%) | 33/612 (5.4%) | 9/612 (1.5%) | 33 | 9 | 0.3x | 33/9 | reliable_action | cover_ambush, cold_slow, clear_subtle, heat_finesse | crawfish | calm:17, breezy:12, slight:8, windy:5 | closed:41, caution:1 | cold_slow_or_front:27, dirty_vibration:11, breezy_windy_stained_reaction:2, stable_pleasant_high_confidence:2<br>dirty:29, stained:8, clear:5<br>cold_slow:33, dirty_vibration:13, wind_reaction:12, clear_subtle:5, none:5 |
| Topwater Popper<br>popping_topwater | lure | 16/1224 (1.3%) | 15/612 (2.5%) | 1/612 (0.2%) | 15 | 1 | 0.1x | 0/16 | reliable_action, high_risk_high_reward | calm_surface, low_light_surface | surface_prey | calm:16 | open:16 | stable_pleasant_high_confidence:10, calm_low_light_surface:4, cold_slow_or_front:2<br>dirty:7, stained:7, clear:2<br>calm_surface:16, low_light_surface:4, warming_search:2, clear_subtle:1, current_swing:1 |
| Tube Jig<br>tube_jig | lure | 63/1224 (5.1%) | 62/612 (10.1%) | 1/612 (0.2%) | 62 | 1 | 0x | 45/18 | reliable_action | clear_subtle, cold_slow | crawfish, baitfish | calm:25, slight:22, breezy:13, windy:3 | closed:44, caution:10, open:9 | cold_slow_or_front:36, unclassified:8, calm_bright_clear_subtle:5, stable_pleasant_high_confidence:5<br>clear:40, stained:19, dirty:4<br>cold_slow:35, clear_subtle:26, calm_surface:9, wind_reaction:8, none:7 |
| Wake Bait<br>wake_bait | lure | 16/1224 (1.3%) | 0/612 (0%) | 16/612 (2.6%) | 0 | 16 | PB-only | 13/3 | big_fish_upside, high_risk_high_reward | calm_surface, low_light_surface | surface_prey, baitfish, bluegill_perch | calm:15, slight:1 | open:15, caution:1 | stable_pleasant_high_confidence:6, calm_low_light_surface:5, calm_bright_clear_subtle:2, cold_slow_or_front:2<br>clear:7, stained:5, dirty:4<br>calm_surface:15, low_light_surface:6, clear_subtle:5, warming_search:3 |
| Walking Bait<br>walking_topwater | lure | 38/1224 (3.1%) | 0/612 (0%) | 38/612 (6.2%) | 0 | 38 | PB-only | 28/10 | big_fish_upside, high_risk_high_reward | calm_surface, low_light_surface | surface_prey, baitfish | calm:25, slight:13 | open:25, caution:13 | stable_pleasant_high_confidence:11, unclassified:9, calm_low_light_surface:7, cold_slow_or_front:4<br>stained:15, clear:13, dirty:10<br>calm_surface:25, low_light_surface:14, clear_subtle:9, current_swing:9, dirty_vibration:6 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 14/1224 (1.1%) | 14/612 (2.3%) | 0/612 (0%) | 14 | 0 | 0x | 0/14 | reliable_action, versatile_search | clear_subtle, heat_finesse | leech_worm | calm:7, breezy:3, slight:3, windy:1 | closed:6, caution:4, open:4 | stable_pleasant_high_confidence:5, dirty_vibration:3, unclassified:3, calm_low_light_surface:2<br>clear:6, dirty:6, stained:2<br>clear_subtle:5, calm_surface:4, none:4, wind_reaction:4, dirty_vibration:3 |

## PB Topwater Composition

| Group | Profile | BF selections | Share of BF topwater |
| --- | --- | --- | --- |
| Topwater lures | Walking Bait<br>walking_topwater | 38 | 38/86 (44.2%) |
| Topwater lures | Buzzbait<br>buzzbait | 31 | 31/86 (36%) |
| Topwater lures | Hollow-Body Frog<br>hollow_body_frog | 0 | 0/86 (0%) |
| Topwater lures | Wake Bait<br>wake_bait | 16 | 16/86 (18.6%) |
| Topwater lures | Topwater Popper<br>popping_topwater | 1 | 1/86 (1.2%) |
| Topwater flies | Bass Popper<br>popper_fly | 1 | 1/78 (1.3%) |
| Topwater flies | Deer Hair Slider<br>deer_hair_slider | 51 | 51/78 (65.4%) |
| Topwater flies | Foam Gurgler<br>foam_gurgler_fly | 20 | 20/78 (25.6%) |
| Topwater flies | Frog Popper<br>frog_fly | 0 | 0/78 (0%) |
| Topwater flies | Mouse Pattern<br>mouse_fly | 6 | 6/78 (7.7%) |

## Topwater Context Audit

| Species | Goal | Gear | Activity | Surface gate | Wind bucket | Rows | Topwater selections | Side-share in context | Scenario tags | Profiles |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| smallmouth_bass | all_purpose | lure | active | open | calm | 6 | 3 | 3/12 (25%) | calm_surface:6 | popping_topwater:3 |
| smallmouth_bass | all_purpose | lure | neutral | closed | calm | 54 | 0 | 0/108 (0%) | cold_slow:24, clear_subtle:18, dirty_vibration:4 |  |
| smallmouth_bass | all_purpose | lure | neutral | closed | slight | 42 | 0 | 0/84 (0%) | cold_slow:18, clear_subtle:6 |  |
| smallmouth_bass | all_purpose | lure | neutral | closed | breezy | 36 | 0 | 0/72 (0%) | wind_reaction:36, dirty_vibration:24, cold_slow:18, clear_subtle:2 |  |
| smallmouth_bass | all_purpose | lure | neutral | closed | windy | 24 | 0 | 0/48 (0%) | wind_reaction:24, dirty_vibration:16, cold_slow:12 |  |
| smallmouth_bass | all_purpose | lure | neutral | open | calm | 48 | 12 | 12/96 (12.5%) | calm_surface:48, low_light_surface:18, clear_subtle:16, dirty_vibration:8 | popping_topwater:12 |
| smallmouth_bass | all_purpose | lure | suppressed | closed | calm | 12 | 0 | 0/24 (0%) | cold_slow:12, clear_subtle:4 |  |
| smallmouth_bass | all_purpose | lure | suppressed | closed | breezy | 24 | 0 | 0/48 (0%) | cold_slow:24, dirty_vibration:4 |  |
| smallmouth_bass | all_purpose | fly | active | open | calm | 6 | 6 | 6/12 (50%) | calm_surface:6 | foam_gurgler_fly:3, popper_fly:3 |
| smallmouth_bass | all_purpose | fly | neutral | closed | calm | 54 | 0 | 0/108 (0%) | cold_slow:24, clear_subtle:18, dirty_vibration:4 |  |
| smallmouth_bass | all_purpose | fly | neutral | closed | slight | 42 | 0 | 0/84 (0%) | cold_slow:18, clear_subtle:6 |  |
| smallmouth_bass | all_purpose | fly | neutral | closed | breezy | 36 | 0 | 0/72 (0%) | wind_reaction:36, dirty_vibration:24, cold_slow:18, clear_subtle:2 |  |
| smallmouth_bass | all_purpose | fly | neutral | closed | windy | 24 | 0 | 0/48 (0%) | wind_reaction:24, dirty_vibration:16, cold_slow:12 |  |
| smallmouth_bass | all_purpose | fly | neutral | caution | slight | 42 | 4 | 4/84 (4.8%) | low_light_surface:18, clear_subtle:8, cold_slow:6, dirty_vibration:4 | foam_gurgler_fly:3, popper_fly:1 |
| smallmouth_bass | all_purpose | fly | neutral | open | calm | 48 | 40 | 40/96 (41.7%) | calm_surface:48, low_light_surface:18, clear_subtle:16, dirty_vibration:8 | foam_gurgler_fly:23, popper_fly:16, deer_hair_slider:1 |
| smallmouth_bass | all_purpose | fly | suppressed | closed | calm | 12 | 0 | 0/24 (0%) | cold_slow:12, clear_subtle:4 |  |
| smallmouth_bass | all_purpose | fly | suppressed | closed | breezy | 24 | 0 | 0/48 (0%) | cold_slow:24, dirty_vibration:4 |  |
| smallmouth_bass | big_fish | lure | active | open | calm | 6 | 6 | 6/12 (50%) | calm_surface:6 | wake_bait:3, walking_topwater:3 |
| smallmouth_bass | big_fish | lure | neutral | closed | calm | 54 | 0 | 0/108 (0%) | cold_slow:24, clear_subtle:18, dirty_vibration:4 |  |
| smallmouth_bass | big_fish | lure | neutral | closed | slight | 42 | 0 | 0/84 (0%) | cold_slow:18, clear_subtle:6 |  |
| smallmouth_bass | big_fish | lure | neutral | closed | breezy | 36 | 0 | 0/72 (0%) | wind_reaction:36, dirty_vibration:24, cold_slow:18, clear_subtle:2 |  |
| smallmouth_bass | big_fish | lure | neutral | closed | windy | 18 | 0 | 0/36 (0%) | wind_reaction:18, cold_slow:12, dirty_vibration:12 |  |
| smallmouth_bass | big_fish | lure | neutral | caution | slight | 42 | 25 | 25/84 (29.8%) | low_light_surface:18, clear_subtle:8, cold_slow:6, dirty_vibration:4 | walking_topwater:13, buzzbait:11, wake_bait:1 |
| smallmouth_bass | big_fish | lure | neutral | caution | breezy | 12 | 6 | 6/24 (25%) | wind_reaction:12, dirty_vibration:8 | buzzbait:6 |
| smallmouth_bass | big_fish | lure | neutral | caution | windy | 6 | 3 | 3/12 (25%) | low_light_surface:6, wind_reaction:6, dirty_vibration:4 | buzzbait:3 |
| smallmouth_bass | big_fish | lure | neutral | open | calm | 48 | 46 | 46/96 (47.9%) | calm_surface:48, low_light_surface:18, clear_subtle:16, dirty_vibration:8 | walking_topwater:22, wake_bait:12, buzzbait:11, popping_topwater:1 |
| smallmouth_bass | big_fish | lure | suppressed | closed | calm | 12 | 0 | 0/24 (0%) | cold_slow:12, clear_subtle:4 |  |
| smallmouth_bass | big_fish | lure | suppressed | closed | breezy | 24 | 0 | 0/48 (0%) | cold_slow:24, dirty_vibration:4 |  |
| smallmouth_bass | big_fish | fly | active | caution | slight | 6 | 3 | 3/12 (25%) |  | deer_hair_slider:3 |
| smallmouth_bass | big_fish | fly | active | open | calm | 6 | 6 | 6/12 (50%) | calm_surface:6 | deer_hair_slider:3, foam_gurgler_fly:3 |
| smallmouth_bass | big_fish | fly | neutral | closed | calm | 54 | 0 | 0/108 (0%) | cold_slow:24, clear_subtle:18, dirty_vibration:4 |  |
| smallmouth_bass | big_fish | fly | neutral | closed | slight | 42 | 0 | 0/84 (0%) | cold_slow:18, clear_subtle:6 |  |
| smallmouth_bass | big_fish | fly | neutral | closed | breezy | 36 | 0 | 0/72 (0%) | wind_reaction:36, dirty_vibration:24, cold_slow:18, clear_subtle:2 |  |
| smallmouth_bass | big_fish | fly | neutral | closed | windy | 18 | 0 | 0/36 (0%) | wind_reaction:18, cold_slow:12, dirty_vibration:12 |  |
| smallmouth_bass | big_fish | fly | neutral | caution | slight | 42 | 18 | 18/84 (21.4%) | low_light_surface:18, clear_subtle:8, cold_slow:6, dirty_vibration:4 | deer_hair_slider:17, popper_fly:1 |
| smallmouth_bass | big_fish | fly | neutral | caution | breezy | 12 | 4 | 4/24 (16.7%) | wind_reaction:12, dirty_vibration:8 | deer_hair_slider:4 |
| smallmouth_bass | big_fish | fly | neutral | open | calm | 48 | 47 | 47/96 (49%) | calm_surface:48, low_light_surface:18, clear_subtle:16, dirty_vibration:8 | deer_hair_slider:24, foam_gurgler_fly:17, mouse_fly:6 |
| smallmouth_bass | big_fish | fly | suppressed | closed | calm | 12 | 0 | 0/24 (0%) | cold_slow:12, clear_subtle:4 |  |
| smallmouth_bass | big_fish | fly | suppressed | closed | breezy | 24 | 0 | 0/48 (0%) | cold_slow:24, dirty_vibration:4 |  |

## Topwater Eligibility Rate Audit

| Species | Goal | Slice | Rows | Eligible rows | Global topwater all-slot share | Eligible topwater all-slot share | Eligible lure-side topwater share | Eligible fly-side topwater share | Closed surface | Suppressed surface | High-wind surface | Heat/no-light surface | Slight wind-reaction score |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| smallmouth_bass | all_purpose | all | 306 | 114 | 65/1224 (5.3%) | 65/456 (14.3%) | 15/228 (6.6%) | 50/228 (21.9%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | all_purpose | activity:active | 12 | 12 | 9/48 (18.8%) | 9/48 (18.8%) | 3/24 (12.5%) | 6/24 (25%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | all_purpose | activity:neutral | 258 | 102 | 56/1032 (5.4%) | 56/408 (13.7%) | 12/204 (5.9%) | 44/204 (21.6%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | all_purpose | activity:suppressed | 36 | 0 | 0/144 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | all_purpose | surface_gate:open | 54 | 54 | 61/216 (28.2%) | 61/216 (28.2%) | 15/108 (13.9%) | 46/108 (42.6%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | all_purpose | surface_gate:caution | 60 | 60 | 4/240 (1.7%) | 4/240 (1.7%) | 0/120 (0%) | 4/120 (3.3%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | all_purpose | surface_gate:closed | 192 | 0 | 0/768 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | all_purpose | wind:calm | 120 | 54 | 61/480 (12.7%) | 61/216 (28.2%) | 15/108 (13.9%) | 46/108 (42.6%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | all_purpose | wind:slight | 90 | 48 | 4/360 (1.1%) | 4/192 (2.1%) | 0/96 (0%) | 4/96 (4.2%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | all_purpose | wind:breezy | 72 | 12 | 0/288 (0%) | 0/48 (0%) | 0/24 (0%) | 0/24 (0%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | all_purpose | wind:windy | 24 | 0 | 0/96 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 0 | 0 | 0 |
| smallmouth_bass | big_fish | all | 306 | 120 | 164/1224 (13.4%) | 164/480 (34.2%) | 86/240 (35.8%) | 78/240 (32.5%) | 0 | 0 | 3 | 0 | 0 |
| smallmouth_bass | big_fish | activity:active | 12 | 12 | 15/48 (31.3%) | 15/48 (31.3%) | 6/24 (25%) | 9/24 (37.5%) | 0 | 0 | 3 | 0 | 0 |
| smallmouth_bass | big_fish | activity:neutral | 258 | 108 | 149/1032 (14.4%) | 149/432 (34.5%) | 80/216 (37%) | 69/216 (31.9%) | 0 | 0 | 3 | 0 | 0 |
| smallmouth_bass | big_fish | activity:suppressed | 36 | 0 | 0/144 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 3 | 0 | 0 |
| smallmouth_bass | big_fish | surface_gate:open | 54 | 54 | 105/216 (48.6%) | 105/216 (48.6%) | 52/108 (48.1%) | 53/108 (49.1%) | 0 | 0 | 3 | 0 | 0 |
| smallmouth_bass | big_fish | surface_gate:caution | 66 | 66 | 59/264 (22.3%) | 59/264 (22.3%) | 34/132 (25.8%) | 25/132 (18.9%) | 0 | 0 | 3 | 0 | 0 |
| smallmouth_bass | big_fish | surface_gate:closed | 186 | 0 | 0/744 (0%) | 0/0 (0%) | 0/0 (0%) | 0/0 (0%) | 0 | 0 | 3 | 0 | 0 |
| smallmouth_bass | big_fish | wind:calm | 120 | 54 | 105/480 (21.9%) | 105/216 (48.6%) | 52/108 (48.1%) | 53/108 (49.1%) | 0 | 0 | 3 | 0 | 0 |
| smallmouth_bass | big_fish | wind:slight | 90 | 48 | 46/360 (12.8%) | 46/192 (24%) | 25/96 (26%) | 21/96 (21.9%) | 0 | 0 | 3 | 0 | 0 |
| smallmouth_bass | big_fish | wind:breezy | 72 | 12 | 10/288 (3.5%) | 10/48 (20.8%) | 6/24 (25%) | 4/24 (16.7%) | 0 | 0 | 3 | 0 | 0 |
| smallmouth_bass | big_fish | wind:windy | 24 | 6 | 3/96 (3.1%) | 3/24 (12.5%) | 3/12 (25%) | 0/12 (0%) | 0 | 0 | 3 | 0 | 0 |

## Wind-Reaction Tag Audit

Selected rows with condition_tag:wind_reaction scoring in slight wind: 0.

| Profile | Gear | Selected | Calm | Slight | Breezy | Windy | Selected with wind score | Slight wind-score rows | Questionable? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Big Articulated Streamer<br>large_articulated_pike_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3 | 1 | 1 | 1 | 0 | 0 | 0 | watch: context-sensitive fly wind tag |
| Bunny Streamer<br>pike_bunny_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Conehead Streamer<br>conehead_streamer | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 | watch: context-sensitive fly wind tag |
| Deceiver<br>deceiver | fly | 55 | 2 | 11 | 30 | 12 | 42 | 0 |  |
| Flash Fly<br>pike_flash_fly | fly | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Zonker Streamer<br>zonker_streamer | fly | 42 | 3 | 1 | 23 | 15 | 38 | 0 | watch: context-sensitive fly wind tag |
| Bladed Jig<br>bladed_jig | lure | 49 | 19 | 12 | 10 | 8 | 16 | 0 |  |
| Buzzbait<br>buzzbait | lure | 31 | 11 | 11 | 6 | 3 | 9 | 0 |  |
| Casting Spoon<br>casting_spoon | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Inline Spinner<br>inline_spinner | lure | 29 | 1 | 4 | 19 | 5 | 22 | 0 |  |
| Large Bucktail Spinner<br>large_bucktail_spinner | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Large Jerkbait<br>pike_jerkbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Lipless Crankbait<br>lipless_crankbait | lure | 5 | 0 | 1 | 2 | 2 | 4 | 0 |  |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 43 | 2 | 8 | 24 | 9 | 33 | 0 |  |
| Oversized Spinnerbait<br>pike_spinnerbait | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |
| Spinnerbait<br>spinnerbait | lure | 36 | 12 | 10 | 10 | 4 | 10 | 0 |  |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 27 | 5 | 4 | 12 | 6 | 17 | 0 |  |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 79 | 20 | 17 | 29 | 13 | 27 | 0 |  |
| Weedless Spoon<br>weedless_spoon | lure | 0 | 0 | 0 | 0 | 0 | 0 | 0 |  |

## Bass Staple Watch List

| Profile | Gear | Side share | All-purpose side share | Big-fish side share | Selected | Top/HM | Available | Finalist/repair opp | Selected/opportunity | Home selected/opp | Selected contexts |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hollow-Body Frog<br>hollow_body_frog | lure | 0% | 0/0 | 0/0 | 0 | 0/0 | 0 | 0 | 0/0 | 0/0 |  |
| Bladed Jig<br>bladed_jig | lure | 4% | 44/612 (7.2%) | 5/612 (0.8%) | 49 | 40/9 | 612 | 311 | 15.8% | 27/136 (19.9%) | all_purpose:44, big_fish:5<br>closed:27, caution:11, open:11<br>breezy_windy_stained_reaction:10, dirty_vibration:10, unclassified:7<br>dirty_vibration:27, wind_reaction:16, current_swing:12, calm_surface:11 |
| Spinnerbait<br>spinnerbait | lure | 2.9% | 33/612 (5.4%) | 3/612 (0.5%) | 36 | 22/14 | 612 | 312 | 11.5% | 19/152 (12.5%) | all_purpose:33, big_fish:3<br>closed:22, caution:7, open:7<br>cold_slow_or_front:9, dirty_vibration:7, unclassified:6<br>dirty_vibration:18, cold_slow:11, wind_reaction:10, current_swing:9 |
| Swim Jig<br>swim_jig | lure | 0.7% | 8/612 (1.3%) | 0/612 (0%) | 8 | 6/2 | 612 | 207 | 3.9% | 0/0 | all_purpose:8<br>closed:6, open:2<br>cold_slow_or_front:4, stable_pleasant_high_confidence:2, warming_search:2<br>calm_surface:2, cold_slow:2, none:2, warming_search:2 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 4.2% | 47/612 (7.7%) | 5/612 (0.8%) | 52 | 42/10 | 612 | 233 | 22.3% | 6/204 (2.9%) | all_purpose:47, big_fish:5<br>closed:20, open:20, caution:12<br>stable_pleasant_high_confidence:12, unclassified:12, warming_search:11<br>calm_surface:20, warming_search:16, low_light_surface:12, none:12 |
| Lipless Crankbait<br>lipless_crankbait | lure | 0.4% | 3/612 (0.5%) | 2/612 (0.3%) | 5 | 3/2 | 612 | 109 | 4.6% | 4/152 (2.6%) | all_purpose:3, big_fish:2<br>closed:4, caution:1<br>dirty_vibration:3, breezy_windy_stained_reaction:1, unclassified:1<br>dirty_vibration:4, wind_reaction:4, cold_slow:2, none:1 |
| Walking Bait<br>walking_topwater | lure | 3.1% | 0/612 (0%) | 38/612 (6.2%) | 38 | 28/10 | 234 | 85 | 44.7% | 25/108 (23.1%) | big_fish:38<br>open:25, caution:13<br>stable_pleasant_high_confidence:11, unclassified:9, calm_low_light_surface:7<br>calm_surface:25, low_light_surface:14, clear_subtle:9, current_swing:9 |
| Buzzbait<br>buzzbait | lure | 2.5% | 0/612 (0%) | 31/612 (5.1%) | 31 | 21/10 | 234 | 68 | 45.6% | 11/108 (10.2%) | big_fish:31<br>caution:20, open:11<br>unclassified:7, calm_low_light_surface:6, dirty_vibration:6<br>low_light_surface:15, dirty_vibration:13, calm_surface:11, wind_reaction:9 |
| Topwater Popper<br>popping_topwater | lure | 1.3% | 15/612 (2.5%) | 1/612 (0.2%) | 16 | 0/16 | 234 | 22 | 72.7% | 0/0 | all_purpose:15, big_fish:1<br>open:16<br>stable_pleasant_high_confidence:10, calm_low_light_surface:4, cold_slow_or_front:2<br>calm_surface:16, low_light_surface:4, warming_search:2, clear_subtle:1 |
| Wake Bait<br>wake_bait | lure | 1.3% | 0/612 (0%) | 16/612 (2.6%) | 16 | 13/3 | 174 | 63 | 25.4% | 0/0 | big_fish:16<br>open:15, caution:1<br>stable_pleasant_high_confidence:6, calm_low_light_surface:5, calm_bright_clear_subtle:2<br>calm_surface:15, low_light_surface:6, clear_subtle:5, warming_search:3 |
| Bass Popper<br>popper_fly | fly | 1.7% | 20/612 (3.3%) | 1/612 (0.2%) | 21 | 13/8 | 234 | 147 | 14.3% | 0/0 | all_purpose:20, big_fish:1<br>open:19, caution:2<br>stable_pleasant_high_confidence:10, calm_low_light_surface:5, calm_bright_clear_subtle:2<br>calm_surface:19, low_light_surface:7, clear_subtle:3, current_swing:2 |
| Deer Hair Slider<br>deer_hair_slider | fly | 4.2% | 1/612 (0.2%) | 51/612 (8.3%) | 52 | 20/32 | 234 | 80 | 65% | 28/108 (25.9%) | big_fish:51, all_purpose:1<br>open:28, caution:24<br>unclassified:16, stable_pleasant_high_confidence:13, calm_low_light_surface:10<br>calm_surface:28, low_light_surface:17, clear_subtle:12, current_swing:9 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 4.7% | 48/612 (7.8%) | 10/612 (1.6%) | 58 | 4/54 | 480 | 169 | 34.3% | 0/0 | all_purpose:48, big_fish:10<br>closed:33, caution:20, open:5<br>unclassified:14, stable_pleasant_high_confidence:11, warming_search:9<br>none:21, wind_reaction:20, dirty_vibration:15, warming_search:13 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 4% | 29/612 (4.7%) | 20/612 (3.3%) | 49 | 35/14 | 234 | 225 | 21.8% | 0/0 | all_purpose:29, big_fish:20<br>open:46, caution:3<br>stable_pleasant_high_confidence:20, calm_low_light_surface:14, cold_slow_or_front:6<br>calm_surface:46, low_light_surface:17, clear_subtle:14, current_swing:7 |
| Frog Popper<br>frog_fly | fly | 0% | 0/0 | 0/0 | 0 | 0/0 | 0 | 0 | 0/0 | 0/0 |  |

## Bass Macro-Family Utilization Diagnostics

| Macro family | Gear | Goal | Selected | All-slot share | Side-slot share | Top/HM | Profiles |
| --- | --- | --- | --- | --- | --- | --- | --- |
| hard_jerk_crank_core | lure | all | 287 | 287/2448 (11.7%) | 287/1224 (23.4%) | 92/195 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait |
| hard_jerk_crank_core | lure | all_purpose | 142 | 142/1224 (11.6%) | 142/612 (23.2%) | 29/113 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait |
| hard_jerk_crank_core | lure | big_fish | 145 | 145/1224 (11.8%) | 145/612 (23.7%) | 63/82 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait |
| hard_jerk_crank_broad | lure | all | 339 | 339/2448 (13.8%) | 339/1224 (27.7%) | 97/242 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait, lipless_crankbait, flat_sided_crankbait, deep_diving_crankbait |
| hard_jerk_crank_broad | lure | all_purpose | 176 | 176/1224 (14.4%) | 176/612 (28.8%) | 34/142 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait, lipless_crankbait, flat_sided_crankbait, deep_diving_crankbait |
| hard_jerk_crank_broad | lure | big_fish | 163 | 163/1224 (13.3%) | 163/612 (26.6%) | 63/100 | suspending_jerkbait, soft_jerkbait, magnum_jerkbait, squarebill_crankbait, medium_diving_crankbait, lipless_crankbait, flat_sided_crankbait, deep_diving_crankbait |
| skirted_jig_family | lure | all | 171 | 171/2448 (7%) | 171/1224 (14%) | 98/73 | compact_flipping_jig, football_jig, finesse_jig, swim_jig, bladed_jig |
| skirted_jig_family | lure | all_purpose | 65 | 65/1224 (5.3%) | 65/612 (10.6%) | 47/18 | compact_flipping_jig, football_jig, finesse_jig, swim_jig, bladed_jig |
| skirted_jig_family | lure | big_fish | 106 | 106/1224 (8.7%) | 106/612 (17.3%) | 51/55 | compact_flipping_jig, football_jig, finesse_jig, swim_jig, bladed_jig |
| worm_plastic_family | lure | all | 184 | 184/2448 (7.5%) | 184/1224 (15%) | 112/72 | carolina_rigged_stick_worm, texas_rigged_soft_plastic_craw, weightless_stick_worm, shaky_head_worm, ned_rig, drop_shot_minnow, magnum_worm |
| worm_plastic_family | lure | all_purpose | 150 | 150/1224 (12.3%) | 150/612 (24.5%) | 86/64 | carolina_rigged_stick_worm, texas_rigged_soft_plastic_craw, weightless_stick_worm, shaky_head_worm, ned_rig, drop_shot_minnow, magnum_worm |
| worm_plastic_family | lure | big_fish | 34 | 34/1224 (2.8%) | 34/612 (5.6%) | 26/8 | carolina_rigged_stick_worm, texas_rigged_soft_plastic_craw, weightless_stick_worm, shaky_head_worm, ned_rig, drop_shot_minnow, magnum_worm |
| moving_single_hook_family | lure | all | 145 | 145/2448 (5.9%) | 145/1224 (11.8%) | 110/35 | spinnerbait, bladed_jig, swim_jig, paddle_tail_swimbait |
| moving_single_hook_family | lure | all_purpose | 132 | 132/1224 (10.8%) | 132/612 (21.6%) | 102/30 | spinnerbait, bladed_jig, swim_jig, paddle_tail_swimbait |
| moving_single_hook_family | lure | big_fish | 13 | 13/1224 (1.1%) | 13/612 (2.1%) | 8/5 | spinnerbait, bladed_jig, swim_jig, paddle_tail_swimbait |
| topwater_lure_family | lure | all | 101 | 101/2448 (4.1%) | 101/1224 (8.3%) | 62/39 | walking_topwater, buzzbait, popping_topwater, wake_bait, hollow_body_frog |
| topwater_lure_family | lure | all_purpose | 15 | 15/1224 (1.2%) | 15/612 (2.5%) | 0/15 | walking_topwater, buzzbait, popping_topwater, wake_bait, hollow_body_frog |
| topwater_lure_family | lure | big_fish | 86 | 86/1224 (7%) | 86/612 (14.1%) | 62/24 | walking_topwater, buzzbait, popping_topwater, wake_bait, hollow_body_frog |
| baitfish_streamers | fly | all | 500 | 500/2448 (20.4%) | 500/1224 (40.8%) | 261/239 | clouser_minnow, deceiver, game_changer, articulated_baitfish_streamer, unweighted_baitfish_streamer, baitfish_slider_fly, bluegill_streamer |
| baitfish_streamers | fly | all_purpose | 241 | 241/1224 (19.7%) | 241/612 (39.4%) | 103/138 | clouser_minnow, deceiver, game_changer, articulated_baitfish_streamer, unweighted_baitfish_streamer, baitfish_slider_fly, bluegill_streamer |
| baitfish_streamers | fly | big_fish | 259 | 259/1224 (21.2%) | 259/612 (42.3%) | 158/101 | clouser_minnow, deceiver, game_changer, articulated_baitfish_streamer, unweighted_baitfish_streamer, baitfish_slider_fly, bluegill_streamer |
| bugger_leech | fly | all | 320 | 320/2448 (13.1%) | 320/1224 (26.1%) | 114/206 | woolly_bugger, rabbit_strip_leech, jighead_marabou_leech, lead_eye_leech, feather_jig_leech |
| bugger_leech | fly | all_purpose | 167 | 167/1224 (13.6%) | 167/612 (27.3%) | 74/93 | woolly_bugger, rabbit_strip_leech, jighead_marabou_leech, lead_eye_leech, feather_jig_leech |
| bugger_leech | fly | big_fish | 153 | 153/1224 (12.5%) | 153/612 (25%) | 40/113 | woolly_bugger, rabbit_strip_leech, jighead_marabou_leech, lead_eye_leech, feather_jig_leech |
| topwater_flies | fly | all | 128 | 128/2448 (5.2%) | 128/1224 (10.5%) | 70/58 | popper_fly, deer_hair_slider, foam_gurgler_fly, frog_fly, mouse_fly |
| topwater_flies | fly | all_purpose | 50 | 50/1224 (4.1%) | 50/612 (8.2%) | 30/20 | popper_fly, deer_hair_slider, foam_gurgler_fly, frog_fly, mouse_fly |
| topwater_flies | fly | big_fish | 78 | 78/1224 (6.4%) | 78/612 (12.7%) | 40/38 | popper_fly, deer_hair_slider, foam_gurgler_fly, frog_fly, mouse_fly |
| crawfish_bluegill_specialty | fly | all | 188 | 188/2448 (7.7%) | 188/1224 (15.4%) | 113/75 | warmwater_crawfish_fly, crawfish_streamer, bluegill_streamer, warmwater_worm_fly, sculpin_streamer, muddler_sculpin, sculpzilla |
| crawfish_bluegill_specialty | fly | all_purpose | 114 | 114/1224 (9.3%) | 114/612 (18.6%) | 73/41 | warmwater_crawfish_fly, crawfish_streamer, bluegill_streamer, warmwater_worm_fly, sculpin_streamer, muddler_sculpin, sculpzilla |
| crawfish_bluegill_specialty | fly | big_fish | 74 | 74/1224 (6%) | 74/612 (12.1%) | 40/34 | warmwater_crawfish_fly, crawfish_streamer, bluegill_streamer, warmwater_worm_fly, sculpin_streamer, muddler_sculpin, sculpzilla |

## Wind Bucket Diagnostics

| Wind bucket | Goal | Rows | Share | Surface picks | Wind-reaction rows |
| --- | --- | --- | --- | --- | --- |
| calm | all | 240 | 39.2% | 166 | 0 |
| calm | all_purpose | 120 | 19.6% | 61 | 0 |
| calm | big_fish | 120 | 19.6% | 105 | 0 |
| slight | all | 180 | 29.4% | 50 | 0 |
| slight | all_purpose | 90 | 14.7% | 4 | 0 |
| slight | big_fish | 90 | 14.7% | 46 | 0 |
| breezy | all | 144 | 23.5% | 10 | 96 |
| breezy | all_purpose | 72 | 11.8% | 0 | 48 |
| breezy | big_fish | 72 | 11.8% | 10 | 48 |
| windy | all | 48 | 7.8% | 3 | 48 |
| windy | all_purpose | 24 | 3.9% | 0 | 24 |
| windy | big_fish | 24 | 3.9% | 3 | 24 |
| unknown | all | 0 | 0% | 0 | 0 |
| unknown | all_purpose | 0 | 0% | 0 | 0 |
| unknown | big_fish | 0 | 0% | 0 | 0 |

## Surface Gate by Goal and Wind Bucket

| Goal | Wind bucket | Surface gate | Rows | Selected surface picks |
| --- | --- | --- | --- | --- |
| all_purpose | calm | closed | 66 | 0 |
| all_purpose | calm | open | 54 | 61 |
| all_purpose | slight | closed | 42 | 0 |
| all_purpose | slight | caution | 48 | 4 |
| all_purpose | breezy | closed | 60 | 0 |
| all_purpose | breezy | caution | 12 | 0 |
| all_purpose | windy | closed | 24 | 0 |
| big_fish | calm | closed | 66 | 0 |
| big_fish | calm | open | 54 | 105 |
| big_fish | slight | closed | 42 | 0 |
| big_fish | slight | caution | 48 | 46 |
| big_fish | breezy | closed | 60 | 0 |
| big_fish | breezy | caution | 12 | 10 |
| big_fish | windy | closed | 18 | 0 |
| big_fish | windy | caution | 6 | 3 |

## Zero-Selected Eligible Profiles

| Profile | Gear | Candidate opportunities | Top available contexts | Top competing winners |
| --- | --- | --- | --- | --- |
| Conehead Streamer<br>conehead_streamer | fly | 144 | all_purpose / clear / freshwater_river / cold_slow_or_front:12, big_fish / clear / freshwater_river / cold_slow_or_front:12, all_purpose / dirty / freshwater_river / dirty_vibration:10, all_purpose / stained / freshwater_river / cold_slow_or_front:10 | Muddler Minnow (top), Woolly Bugger (honorable):12, Sculpin Streamer (top), Clouser Minnow (honorable):8, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):7, Sculpzilla (top), Game Changer (honorable):7 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 132 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:14, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:14, all_purpose / dirty / freshwater_lake_pond / cold_slow_or_front:8, all_purpose / dirty / freshwater_lake_pond / dirty_vibration:8 | Big Tube Jig (top), Magnum Jerkbait (honorable):10, Texas-Rigged Craw (top), Suspending Jerkbait (honorable):7, Blade Bait (top), Suspending Jerkbait (honorable):6, Football Jig (top), Suspending Jerkbait (honorable):6 |

## Low-Use Eligible Profiles

| Profile | Gear | Selected/Opp | Rate | Close opp | Far-behind opp | Available tags | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 2/468 | 0.4% | 37 | 336 | cold_slow:168, wind_reaction:132, dirty_vibration:88, clear_subtle:80, none:80 | Big Tube Jig (top), Magnum Jerkbait (honorable):19, Magnum Jerkbait (top), Big Tube Jig (honorable):16, Magnum Jerkbait (top), Football Jig (honorable):16, Tube Jig (top), Suspending Jerkbait (honorable):16 |
| Lipless Crankbait<br>lipless_crankbait | lure | 5/612 | 0.8% | 58 | 455 | cold_slow:228, wind_reaction:144, dirty_vibration:136, calm_surface:108, clear_subtle:108 | Big Tube Jig (top), Magnum Jerkbait (honorable):28, Magnum Jerkbait (top), Big Tube Jig (honorable):25, Ned Rig (top), Flat-Sided Crankbait (honorable):21, Tube Jig (top), Suspending Jerkbait (honorable):21 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3/144 | 2.1% | 24 | 77 | cold_slow:60, current_swing:60, dirty_vibration:48, calm_surface:36, clear_subtle:28 | Muddler Minnow (top), Woolly Bugger (honorable):12, Sculpin Streamer (top), Clouser Minnow (honorable):8, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):7, Sculpzilla (top), Game Changer (honorable):7 |
| Hair Jig<br>hair_jig | lure | 3/144 | 2.1% | 6 | 103 | cold_slow:60, current_swing:60, dirty_vibration:48, calm_surface:36, clear_subtle:28 | Ned Rig (top), Flat-Sided Crankbait (honorable):10, Big Tube Jig (top), Magnum Jerkbait (honorable):9, Magnum Jerkbait (top), Big Tube Jig (honorable):9, Bladed Jig (top), Blade Bait (honorable):7 |

## Over-Selected Profiles

| Profile | Gear | Selected/Opp | Rate | Dominant goals | Dominant condition tags |
| --- | --- | --- | --- | --- | --- |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 97/348 | 27.9% | all_purpose:59, big_fish:38 | cold_slow:49, clear_subtle:24, none:23, wind_reaction:15, low_light_surface:10 |

## Overdominance Guardrail Summary

| Profile | Gear | Trigger | Selected/Opp | Rate | Likely cause | Context |
| --- | --- | --- | --- | --- | --- | --- |
| Magnum Jerkbait<br>magnum_jerkbait | lure | home-window >30% severe | 41/80 | 51.3% | selector_filtering_variety_jitter:33 | AP/BF 0/0, 41/80<br>clarity clear:46, stained:34<br>bucket cold_slow_or_front:50, warming_search:12, calm_bright_clear_subtle:6 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | home-window >30% severe | 51/116 | 44% | selector_filtering_variety_jitter:36 | AP/BF 28/58, 23/58<br>clarity clear:84, stained:32<br>bucket cold_slow_or_front:68, calm_bright_clear_subtle:16, unclassified:12 |
| Ned Rig<br>ned_rig | lure | home-window >25% overdominant | 66/232 | 28.4% | goal_tags:90 | AP/BF 54/116, 12/116<br>clarity clear:148, stained:84<br>bucket cold_slow_or_front:144, calm_bright_clear_subtle:20, breezy_windy_stained_reaction:16 |
| Deer Hair Slider<br>deer_hair_slider | fly | home-window >25% overdominant | 28/108 | 25.9% | goal_tags:57 | AP/BF 1/54, 27/54<br>clarity clear:36, dirty:36, stained:36<br>bucket stable_pleasant_high_confidence:44, calm_low_light_surface:36, calm_bright_clear_subtle:12 |
| Big Tube Jig<br>big_smallmouth_tube | lure | home-window >20% watch | 87/360 | 24.2% | goal_tags:223 | AP/BF 0/180, 87/180<br>clarity clear:180, stained:180<br>bucket cold_slow_or_front:124, stable_pleasant_high_confidence:68, unclassified:56 |
| Walking Bait<br>walking_topwater | lure | home-window >20% watch | 25/108 | 23.1% | goal_tags:54 | AP/BF 0/54, 25/54<br>clarity clear:36, dirty:36, stained:36<br>bucket stable_pleasant_high_confidence:44, calm_low_light_surface:36, calm_bright_clear_subtle:12 |
| Woolly Bugger<br>woolly_bugger | fly | home-window >20% watch | 63/276 | 22.8% | goal_tags:101 | AP/BF 53/138, 10/138<br>clarity clear:92, dirty:92, stained:92<br>bucket cold_slow_or_front:176, dirty_vibration:36, breezy_windy_stained_reaction:20 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | home-window >20% watch | 24/108 | 22.2% | goal_tags:44 | AP/BF 16/54, 8/54<br>clarity clear:108<br>bucket cold_slow_or_front:36, calm_bright_clear_subtle:20, stable_pleasant_high_confidence:16 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | home-window >20% watch | 80/372 | 21.5% | forage_clarity_stack:114 | AP/BF 18/186, 62/186<br>clarity clear:168, stained:112, dirty:92<br>bucket cold_slow_or_front:212, dirty_vibration:36, stable_pleasant_high_confidence:24 |
| Sculpzilla<br>sculpzilla | fly | home-window >20% watch | 28/132 | 21.2% | goal_tags:69 | AP/BF 0/66, 28/66<br>clarity clear:48, stained:48, dirty:36<br>bucket cold_slow_or_front:56, dirty_vibration:20, calm_low_light_surface:12 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | home-window >20% watch | 42/204 | 20.6% | forage_clarity_stack:69 | AP/BF 28/102, 14/102<br>clarity clear:116, stained:88<br>bucket cold_slow_or_front:132, warming_search:24, breezy_windy_stained_reaction:20 |

## Slot Utilization Guardrails

| Profile | Gear | Actual combined | Actual top | Actual honorable | Actual side | Home | Home top/HM | Flags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 89/2448 (3.6%) | 43/1224 (3.5%) | 46/1224 (3.8%) | 89/1224 (7.3%) | 41/80 (51.3%) | 22/80 (27.5%) / 19/80 (23.8%) | home>20%<br>home>25%<br>home>30% |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 97/2448 (4%) | 46/1224 (3.8%) | 51/1224 (4.2%) | 97/1224 (7.9%) | 51/116 (44%) | 36/116 (31%) / 15/116 (12.9%) | home>20%<br>home>25%<br>home>30% |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49/2448 (2%) | 35/1224 (2.9%) | 14/1224 (1.1%) | 49/1224 (4%) | 46/108 (42.6%) | 35/108 (32.4%) / 11/108 (10.2%) | home>20%<br>home>25%<br>home>30% |
| Ned Rig<br>ned_rig | lure | 96/2448 (3.9%) | 75/1224 (6.1%) | 21/1224 (1.7%) | 96/1224 (7.8%) | 66/232 (28.4%) | 60/232 (25.9%) / 6/232 (2.6%) | home>20%<br>home>25% |
| Deer Hair Slider<br>deer_hair_slider | fly | 52/2448 (2.1%) | 20/1224 (1.6%) | 32/1224 (2.6%) | 52/1224 (4.2%) | 28/108 (25.9%) | 13/108 (12%) / 15/108 (13.9%) | home>20%<br>home>25% |
| Big Tube Jig<br>big_smallmouth_tube | lure | 126/2448 (5.1%) | 55/1224 (4.5%) | 71/1224 (5.8%) | 126/1224 (10.3%) | 87/360 (24.2%) | 39/360 (10.8%) / 48/360 (13.3%) | home>20% |
| Walking Bait<br>walking_topwater | lure | 38/2448 (1.6%) | 28/1224 (2.3%) | 10/1224 (0.8%) | 38/1224 (3.1%) | 25/108 (23.1%) | 21/108 (19.4%) / 4/108 (3.7%) | home>20% |
| Woolly Bugger<br>woolly_bugger | fly | 74/2448 (3%) | 16/1224 (1.3%) | 58/1224 (4.7%) | 74/1224 (6%) | 63/276 (22.8%) | 11/276 (4%) / 52/276 (18.8%) | home>20% |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 30/2448 (1.2%) | 3/1224 (0.2%) | 27/1224 (2.2%) | 30/1224 (2.5%) | 24/108 (22.2%) | 1/108 (0.9%) / 23/108 (21.3%) | home>20% |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 132/2448 (5.4%) | 47/1224 (3.8%) | 85/1224 (6.9%) | 132/1224 (10.8%) | 80/372 (21.5%) | 41/372 (11%) / 39/372 (10.5%) | home>20% |
| Sculpzilla<br>sculpzilla | fly | 30/2448 (1.2%) | 19/1224 (1.6%) | 11/1224 (0.9%) | 30/1224 (2.5%) | 28/132 (21.2%) | 18/132 (13.6%) / 10/132 (7.6%) | home>20% |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 79/2448 (3.2%) | 18/1224 (1.5%) | 61/1224 (5%) | 79/1224 (6.5%) | 42/204 (20.6%) | 2/204 (1%) / 40/204 (19.6%) | home>20% |
| Deceiver<br>deceiver | fly | 55/2448 (2.2%) | 44/1224 (3.6%) | 11/1224 (0.9%) | 55/1224 (4.5%) | 42/204 (20.6%) | 34/204 (16.7%) / 8/204 (3.9%) | home>20% |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 27/2448 (1.1%) | 4/1224 (0.3%) | 23/1224 (1.9%) | 27/1224 (2.2%) | 23/112 (20.5%) | 4/112 (3.6%) / 19/112 (17%) | home>20% |

## Finalist Pool Diagnostics

Average pre-expansion selected-tier pool size: 3.00.
Average expanded finalist pool size: 3.96.
Minimum pre-expansion selected-tier pool size: 1.
Minimum expanded finalist pool size: 1.
Rows/slots with selected-tier pool size 1: 755.
Rows/slots with expanded finalist pool size 1: 334.
Selected-tier singleton slots expanded above 1: 421.

| Side/slot | Avg selected-tier | Avg expanded | Min selected-tier | Min expanded | Selected-tier singletons | Expanded singletons |
| --- | --- | --- | --- | --- | --- | --- |
| fly/honorable | 2.49 | 3.68 | 1 | 1 | 250 | 107 |
| fly/top | 2.58 | 3.43 | 1 | 1 | 237 | 131 |
| lure/honorable | 3.36 | 4.40 | 1 | 1 | 127 | 41 |
| lure/top | 3.58 | 4.34 | 1 | 1 | 141 | 55 |

| Pre-expansion selected finalist tier | Slots |
| --- | --- |
| goal_and_priority_condition | 1217 |
| goal_or_priority_condition | 1129 |
| daily_lane_specialist | 63 |
| credible_fallback | 39 |

| Expanded finalist tiers included | Slots |
| --- | --- |
| goal_or_priority_condition | 1689 |
| goal_and_priority_condition | 1217 |
| credible_fallback | 208 |
| daily_lane_specialist | 200 |

| Expanded singleton cause | Slots |
| --- | --- |
| hard_gated_scarcity | 145 |
| family_diversity_scarcity | 124 |
| surface_safety_scarcity | 65 |

Representative expanded singleton finalist pools:
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__all_purpose__B fly/top: woolly_bugger (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__big_fish__B fly/top: articulated_baitfish_streamer (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B fly/top: woolly_bugger (goal_and_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__B fly/top: articulated_dungeon_streamer (goal_or_priority_condition; hard_gated_scarcity)
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__B fly/honorable: game_changer (goal_or_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__clear__all_purpose__B fly/honorable: lead_eye_leech (goal_and_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__all_purpose__B fly/honorable: crawfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__stained__big_fish__B fly/top: sculpzilla (goal_or_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__dirty__all_purpose__B fly/top: crawfish_streamer (goal_or_priority_condition; hard_gated_scarcity)
- wi_upper_mississippi__2025-01-26__freshwater_river__dirty__big_fish__B fly/top: sculpzilla (goal_or_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__clear__all_purpose__B fly/honorable: zonker_streamer (goal_and_priority_condition; family_diversity_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__all_purpose__B fly/honorable: zonker_streamer (goal_and_priority_condition; family_diversity_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__stained__big_fish__B fly/honorable: articulated_baitfish_streamer (goal_or_priority_condition; family_diversity_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__all_purpose__B fly/top: woolly_bugger (goal_and_priority_condition; hard_gated_scarcity)
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__all_purpose__B fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- mo_table_rock__2025-02-20__freshwater_lake_pond__clear__all_purpose__A fly/honorable: woolly_bugger (goal_and_priority_condition; family_diversity_scarcity)
- mo_table_rock__2025-02-20__freshwater_lake_pond__clear__all_purpose__B lure/honorable: tube_jig (goal_and_priority_condition; family_diversity_scarcity)
- mo_table_rock__2025-02-20__freshwater_lake_pond__clear__all_purpose__B fly/honorable: clouser_minnow (goal_or_priority_condition; family_diversity_scarcity)
- mo_table_rock__2025-02-20__freshwater_lake_pond__clear__big_fish__A fly/honorable: articulated_dungeon_streamer (goal_or_priority_condition; family_diversity_scarcity)

Set B finalist-pool novelty diagnostics:
| Stage | Average pool size / slots |
| --- | --- |
| After exact-ID avoidance and hard/safety gates | 5.08 |
| Different-presentation close candidates | 2.09 |
| Different-family close candidates | 2.95 |
| Final expanded Set B pool | 2.68 |
| Same-family/same-presentation reintroduced | 63/1224 |

## Dirty/Stained Wind Coverage Pool Diagnostics

| Metric | Value |
| --- | --- |
| Coverage rows checked | 136 |
| Coverage pool used | 53 |
| Average used coverage pool size | 4.66 |
| Singleton used coverage pools | 2 |
| Broad pool larger than narrowed pool | 46 |
| Broad pool same as narrowed pool | 7 |
| Spinnerbait/Lipless selected with 3+ other active candidates | 6 |

Coverage source:

| Coverage source | Rows |
| --- | --- |
| none | 83 |
| broad | 53 |

Top coverage-pool IDs by frequency:

| Profile ID in coverage pool | Rows |
| --- | --- |
| spinnerbait | 51 |
| bladed_jig | 49 |
| inline_spinner | 40 |
| lipless_crankbait | 32 |
| medium_diving_crankbait | 30 |
| suspending_jerkbait | 27 |
| squarebill_crankbait | 16 |
| buzzbait | 2 |

Selected coverage IDs by frequency:

| Selected coverage ID | Rows |
| --- | --- |
| medium_diving_crankbait | 8 |
| suspending_jerkbait | 8 |
| bladed_jig | 5 |
| magnum_jerkbait | 5 |
| spinnerbait | 5 |
| inline_spinner | 4 |
| big_smallmouth_tube | 3 |
| blade_bait | 3 |
| football_jig | 3 |
| squarebill_crankbait | 3 |
| buzzbait | 2 |
| lipless_crankbait | 2 |
| hair_jig | 1 |
| walking_topwater | 1 |

Spinnerbait/Lipless selected despite 3+ other active candidates:

- vt_champlain_smb__2025-01-18__freshwater_lake_pond__stained__all_purpose__A: Spinnerbait; pool bladed_jig, inline_spinner, spinnerbait, suspending_jerkbait
- vt_champlain_smb__2025-01-18__freshwater_lake_pond__dirty__big_fish__B: Lipless Crankbait; pool bladed_jig, inline_spinner, lipless_crankbait, medium_diving_crankbait, spinnerbait
- tn_dale_hollow__2025-02-15__freshwater_lake_pond__dirty__all_purpose__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, medium_diving_crankbait, spinnerbait
- wv_new_river_smb__2025-03-26__freshwater_river__stained__big_fish__B: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, medium_diving_crankbait, spinnerbait, suspending_jerkbait
- wi_door_county__2025-12-12__freshwater_lake_pond__stained__all_purpose__A: Spinnerbait; pool bladed_jig, inline_spinner, lipless_crankbait, medium_diving_crankbait, spinnerbait, suspending_jerkbait
- wi_door_county__2025-12-12__freshwater_lake_pond__dirty__big_fish__B: Lipless Crankbait; pool bladed_jig, inline_spinner, lipless_crankbait, spinnerbait, suspending_jerkbait

## Surface Safety Expansion Check

| Surface gate | Slots checked | Selected surface picks | Surface finalist IDs |
| --- | --- | --- | --- |
| closed | 1512 | 0 | 0 |
| caution | 504 | 63 | 145 |

Caution-gate selected surface examples:
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__clear__big_fish__B: honorable_lure:walking_topwater
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__dirty__big_fish__A: honorable_fly:deer_hair_slider
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__dirty__big_fish__B: honorable_lure:buzzbait
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__clear__all_purpose__A: honorable_fly:foam_gurgler_fly
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__clear__big_fish__A: lure_of_the_day:walking_topwater, honorable_fly:deer_hair_slider
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__clear__big_fish__B: lure_of_the_day:wake_bait, honorable_fly:popper_fly
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__stained__all_purpose__B: honorable_fly:foam_gurgler_fly
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__stained__big_fish__A: lure_of_the_day:walking_topwater, fly_of_the_day:deer_hair_slider
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__stained__big_fish__B: lure_of_the_day:buzzbait
- tn_dale_hollow__2025-06-07__freshwater_lake_pond__dirty__all_purpose__A: honorable_fly:foam_gurgler_fly

Caution-gate surface finalist examples:
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__clear__big_fish__A lure/honorable: walking_topwater
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__clear__big_fish__A fly/honorable: foam_gurgler_fly, popper_fly
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__clear__big_fish__B lure/honorable: walking_topwater
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__clear__big_fish__B fly/top: foam_gurgler_fly
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__clear__big_fish__B fly/honorable: foam_gurgler_fly
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__stained__big_fish__A lure/honorable: walking_topwater
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__stained__big_fish__A fly/honorable: foam_gurgler_fly, popper_fly
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__stained__big_fish__B lure/honorable: walking_topwater
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__stained__big_fish__B fly/top: foam_gurgler_fly
- tn_dale_hollow__2025-05-10__freshwater_lake_pond__stained__big_fish__B fly/honorable: foam_gurgler_fly

## Tag Load And Stack Risk

### Tag Inventory

| Profile | Gear | Species | Family | Presentation | Column/Pace | Forage | Clarity | Condition | Goal | Water | Surface | Signals |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Bladed Jig<br>bladed_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | bladed_jig | spinner_vibration | mid<br>medium/fast | 2: baitfish, bluegill_perch | 2: stained, dirty | 4: wind_reaction, dirty_vibration, cover_ambush, warming_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 10 |
| Foam Gurgler<br>foam_gurgler_fly | fly | largemouth_bass, smallmouth_bass, northern_pike | fly_gurgler | surface_fly_gurgler | surface<br>medium/slow | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 9 |
| Sculpin Streamer<br>sculpin_streamer | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: current_swing, cold_slow, runoff_streamer | 1: reliable_action | freshwater_river | false | 9 |
| Buzzbait<br>buzzbait | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_buzz | topwater_open | surface<br>fast/medium | 2: surface_prey, baitfish | 2: stained, dirty | 3: low_light_surface, wind_reaction, dirty_vibration | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 9 |
| Glide Bait<br>glidebait | lure | largemouth_bass, smallmouth_bass | hard_swimbait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 3: clear_subtle, open_water_search, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 9 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | largemouth_bass, smallmouth_bass | crankbait_medium | crankbait | mid<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 3: wind_reaction, open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Ned Rig<br>ned_rig | lure | largemouth_bass, smallmouth_bass, trout | finesse_plastic | ned_tube_finesse | bottom<br>slow | 2: leech_worm, crawfish | 3: clear, stained, dirty | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | largemouth_bass, smallmouth_bass, northern_pike | swimbait | swimbait | mid<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Shaky-Head Worm<br>shaky_head_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 4: clear_subtle, cold_slow, heat_finesse, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Spinnerbait<br>spinnerbait | lure | largemouth_bass, smallmouth_bass, northern_pike | safety_pin_spinner | spinner_vibration | mid<br>medium/slow | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: wind_reaction, dirty_vibration, cover_ambush | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 9 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | largemouth_bass, smallmouth_bass | soft_plastic_craw | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 4: cover_ambush, cold_slow, clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 9 |
| Wake Bait<br>wake_bait | lure | largemouth_bass, smallmouth_bass | surface_wake | topwater_open | surface<br>slow/medium | 3: surface_prey, baitfish, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | true | 9 |
| Baitfish Slider<br>baitfish_slider_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_slider | baitfish_slider | upper<br>medium/fast | 2: baitfish, bluegill_perch | 3: clear, stained, dirty | 2: open_water_search, warming_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Bass Popper<br>popper_fly | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_popper | surface_fly_popper_slider | surface<br>medium/slow | 2: surface_prey, bluegill_perch | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | true | 8 |
| Crawfish Streamer<br>crawfish_streamer | fly | smallmouth_bass, trout | crawfish_fly | crawfish_fly | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 3: current_swing, clear_subtle, cold_slow | 1: reliable_action | freshwater_river | false | 8 |
| Deer Hair Slider<br>deer_hair_slider | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | fly_slider | surface_fly_slider | surface<br>medium/fast | 2: surface_prey, baitfish | 3: clear, stained, dirty | 2: calm_surface, low_light_surface | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | true | 8 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | big_articulated_streamer | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: stained, dirty | 2: runoff_streamer, cover_ambush | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Big Tube Jig<br>big_smallmouth_tube | lure | smallmouth_bass | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: big_fish_upside | freshwater_lake_pond, freshwater_river | false | 8 |
| Blade Bait<br>blade_bait | lure | largemouth_bass, smallmouth_bass, northern_pike, trout | blade_bait | blade_spoon | bottom<br>slow/medium | 1: baitfish | 3: clear, stained, dirty | 3: cold_slow, open_water_search, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | largemouth_bass, smallmouth_bass, trout | soft_plastic_worm | worm_finesse | bottom<br>slow | 2: leech_worm, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 2: reliable_action, versatile_search | freshwater_lake_pond | false | 8 |
| Compact Glide Bait<br>compact_glidebait | lure | smallmouth_bass | hard_swimbait | glidebait | mid<br>slow/medium | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond | false | 8 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_deep | crankbait | bottom<br>medium | 2: baitfish, crawfish | 3: clear, stained, dirty | 2: open_water_search, cold_slow | 1: versatile_search | freshwater_lake_pond | false | 8 |
| Finesse Jig<br>finesse_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 2: crawfish, leech_worm | 2: clear, stained | 3: clear_subtle, cold_slow, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 8 |
| Hair Jig<br>hair_jig | lure | smallmouth_bass, trout | hair_jig | hair_jig | bottom<br>slow/medium | 2: baitfish, leech_worm | 2: clear, stained | 3: clear_subtle, current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 8 |
| Inline Spinner<br>inline_spinner | lure | smallmouth_bass, trout, northern_pike | spinner | spinner_vibration | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | largemouth_bass, smallmouth_bass | jerkbait | jerkbait | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, open_water_search | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | false | 8 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium/fast | 2: baitfish, bluegill_perch | 2: stained, dirty | 3: cover_ambush, dirty_vibration, wind_reaction | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | largemouth_bass, smallmouth_bass, trout | jerkbait | jerkbait | mid<br>medium | 1: baitfish | 2: clear, stained | 3: clear_subtle, cold_slow, wind_reaction | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Swim Jig<br>swim_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_swimming | swim_jig | mid<br>medium/fast | 2: bluegill_perch, baitfish | 2: stained, dirty | 2: cover_ambush, warming_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Walking Bait<br>walking_topwater | lure | largemouth_bass, smallmouth_bass, northern_pike | surface_walking | topwater_open | surface<br>medium | 2: surface_prey, baitfish | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 8 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | largemouth_bass, smallmouth_bass | soft_plastic_worm | worm_finesse | upper<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: clear_subtle, heat_finesse | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 8 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_articulated | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: stained, dirty | 2: open_water_search, runoff_streamer | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | smallmouth_bass, northern_pike, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Clouser Minnow<br>clouser_minnow | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | streamer_weighted | baitfish_streamer | mid<br>medium/fast | 1: baitfish | 2: clear, stained | 2: current_swing, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Conehead Streamer<br>conehead_streamer | fly | smallmouth_bass, trout | streamer_weighted | baitfish_streamer | mid<br>medium | 1: baitfish | 2: clear, stained | 3: current_swing, open_water_search, wind_reaction | 1: versatile_search | freshwater_river | false | 7 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | largemouth_bass, smallmouth_bass | crawfish_fly | crawfish_fly | bottom<br>slow/medium | 1: crawfish | 3: clear, stained, dirty | 2: cover_ambush, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Deceiver<br>deceiver | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_baitfish | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Game Changer<br>game_changer | fly | smallmouth_bass, largemouth_bass, northern_pike | streamer_segmented | baitfish_streamer | mid<br>medium | 1: baitfish | 3: clear, stained, dirty | 1: open_water_search | 2: versatile_search, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Lead-Eye Leech<br>lead_eye_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, clear_subtle | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Marabou Jig Leech<br>feather_jig_leech | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>medium/slow | 1: leech_worm | 3: clear, stained, dirty | 2: warming_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Mouse Pattern<br>mouse_fly | fly | largemouth_bass, smallmouth_bass, trout | fly_mouse | surface_fly_frog_mouse | surface<br>slow/medium | 1: surface_prey | 2: clear, stained | 2: calm_surface, low_light_surface | 2: big_fish_upside, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 7 |
| Muddler Minnow<br>muddler_sculpin | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: current_swing, cold_slow | 1: reliable_action | freshwater_river | false | 7 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | leech_family | leech_bugger | bottom<br>slow/medium | 1: leech_worm | 2: stained, dirty | 2: cold_slow, cover_ambush | 2: reliable_action, big_fish_upside | freshwater_lake_pond, freshwater_river | false | 7 |
| Sculpzilla<br>sculpzilla | fly | smallmouth_bass, trout | sculpin_family | sculpin_bottom | bottom<br>slow/medium | 2: baitfish, crawfish | 2: stained, dirty | 2: runoff_streamer, current_swing | 1: big_fish_upside | freshwater_river | false | 7 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | largemouth_bass, smallmouth_bass, northern_pike, trout | streamer_unweighted | baitfish_streamer | upper<br>medium/slow | 2: baitfish, bluegill_perch | 2: clear, stained | 2: clear_subtle, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Woolly Bugger<br>woolly_bugger | fly | smallmouth_bass, largemouth_bass, northern_pike, trout | bugger_streamer | leech_bugger | mid<br>slow/medium | 1: leech_worm | 3: clear, stained, dirty | 2: cold_slow, current_swing | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Zonker Streamer<br>zonker_streamer | fly | smallmouth_bass, trout | streamer_baitfish | baitfish_streamer | mid<br>medium/slow | 1: baitfish | 2: clear, stained | 3: wind_reaction, open_water_search, current_swing | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | largemouth_bass, smallmouth_bass, trout | soft_plastic_minnow | drop_shot_minnow | mid<br>slow | 2: baitfish, crawfish | 2: clear, stained | 2: clear_subtle, heat_finesse | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Football Jig<br>football_jig | lure | largemouth_bass, smallmouth_bass | skirted_jig_bottom | bottom_jig_craw | bottom<br>slow | 1: crawfish | 3: clear, stained, dirty | 2: cold_slow, cover_ambush | 1: big_fish_upside | freshwater_lake_pond | false | 7 |
| Soft Jerkbait<br>soft_jerkbait | lure | largemouth_bass, smallmouth_bass, northern_pike | jerkbait_soft | jerkbait | upper<br>medium/slow | 1: baitfish | 2: clear, stained | 2: clear_subtle, open_water_search | 2: reliable_action, versatile_search | freshwater_lake_pond, freshwater_river | false | 7 |
| Topwater Popper<br>popping_topwater | lure | largemouth_bass, smallmouth_bass | surface_popper | topwater_open | surface<br>medium/slow | 1: surface_prey | 2: clear, stained | 2: calm_surface, low_light_surface | 2: reliable_action, high_risk_high_reward | freshwater_lake_pond, freshwater_river | true | 7 |
| Tube Jig<br>tube_jig | lure | largemouth_bass, smallmouth_bass, northern_pike | tube_jig | ned_tube_finesse | bottom<br>slow/medium | 2: crawfish, baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 7 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_shallow | crankbait | upper<br>medium | 1: baitfish | 2: clear, stained | 2: clear_subtle, cold_slow | 1: reliable_action | freshwater_lake_pond, freshwater_river | false | 6 |
| Lipless Crankbait<br>lipless_crankbait | lure | largemouth_bass, smallmouth_bass, northern_pike | crankbait_lipless | crankbait | mid<br>medium/fast | 1: baitfish | 2: stained, dirty | 2: wind_reaction, open_water_search | 1: versatile_search | freshwater_lake_pond, freshwater_river | false | 6 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | smallmouth_bass, trout | streamer_sparse | baitfish_streamer | upper<br>medium/fast | 1: baitfish | 1: clear | 2: clear_subtle, current_swing | 1: reliable_action | freshwater_river | false | 5 |

### Stack Risk Flags

| Profile | Gear | Signals | Selected/Opp | Home selected/opp | Stack risk flags |
| --- | --- | --- | --- | --- | --- |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 7 | 118/612 | 24/204 | goal_tags>1<br>versatile_search+big_fish_upside |
| Baitfish Slider<br>baitfish_slider_fly | fly | 8 | 58/480 | 2/4 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Bass Popper<br>popper_fly | fly | 8 | 21/234 | 19/108 | goal_tags>1 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 98/612 | 18/204 | goal_tags>1 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 97/348 | 51/116 | clear+stained+dirty clarity<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Crawfish Streamer<br>crawfish_streamer | fly | 8 | 21/144 | 16/112 | clear+stained+dirty clarity |
| Deceiver<br>deceiver | fly | 7 | 55/612 | 42/204 | clear+stained+dirty clarity<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 52/234 | 28/108 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 32/168 | 0/0 | goal_tags>1 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 49/234 | 46/108 | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Game Changer<br>game_changer | fly | 7 | 137/612 | 34/204 | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 7 | 61/612 | 0/0 | clear+stained+dirty clarity |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 41/612 | 0/0 | clear+stained+dirty clarity |
| Marabou Jig Leech<br>feather_jig_leech | fly | 7 | 12/612 | 0/0 | clear+stained+dirty clarity |
| Mouse Pattern<br>mouse_fly | fly | 7 | 6/36 | 0/0 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 132/612 | 80/372 | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 17/144 | 13/112 | clear+stained+dirty clarity |
| Sculpzilla<br>sculpzilla | fly | 7 | 30/144 | 28/132 | home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 74/612 | 63/276 | clear+stained+dirty clarity<br>home-window share>20% |
| Big Tube Jig<br>big_smallmouth_tube | lure | 8 | 126/540 | 87/360 | home-window share>20% |
| Blade Bait<br>blade_bait | lure | 8 | 63/612 | 16/208 | clear+stained+dirty clarity |
| Bladed Jig<br>bladed_jig | lure | 10 | 49/612 | 27/136 | condition_tags>3<br>goal_tags>1<br>wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Buzzbait<br>buzzbait | lure | 9 | 31/234 | 11/108 | goal_tags>1<br>wind+dirty+big_fish_upside<br>wind+dirty+stained/dirty clarity |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 2/468 | 0/164 | goal_tags>1 |
| Compact Glide Bait<br>compact_glidebait | lure | 8 | 54/300 | 0/0 | goal_tags>1 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 12/468 | 4/104 | clear+stained+dirty clarity |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 30/612 | 24/108 | home-window share>20% |
| Football Jig<br>football_jig | lure | 7 | 94/468 | 32/168 | clear+stained+dirty clarity |
| Glide Bait<br>glidebait | lure | 9 | 3/36 | 0/0 | goal_tags>1 |
| Inline Spinner<br>inline_spinner | lure | 8 | 29/612 | 5/48 | goal_tags>1 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 8 | 89/360 | 41/80 | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 9 | 43/612 | 23/152 | clear+stained+dirty clarity<br>open_water+warming+versatile |
| Ned Rig<br>ned_rig | lure | 9 | 96/612 | 66/232 | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 9 | 52/612 | 6/204 | clear+stained+dirty clarity<br>goal_tags>1<br>open_water+warming+versatile |
| Shaky-Head Worm<br>shaky_head_worm | lure | 9 | 0/132 | 0/60 | condition_tags>3<br>clear+stained+dirty clarity |
| Soft Jerkbait<br>soft_jerkbait | lure | 7 | 49/480 | 19/108 | goal_tags>1 |
| Spinnerbait<br>spinnerbait | lure | 9 | 36/612 | 19/152 | goal_tags>1<br>wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 27/480 | 23/112 | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity<br>home-window share>20% |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 79/612 | 42/204 | goal_tags>1<br>home-window share>20% |
| Swim Jig<br>swim_jig | lure | 8 | 8/612 | 0/164 | goal_tags>1 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 42/612 | 12/280 | condition_tags>3<br>clear+stained+dirty clarity |
| Topwater Popper<br>popping_topwater | lure | 7 | 16/234 | 16/108 | goal_tags>1 |
| Wake Bait<br>wake_bait | lure | 9 | 16/174 | 15/72 | forage_tags>2<br>goal_tags>1<br>surface+calm+low_light+big_fish+high_risk |
| Walking Bait<br>walking_topwater | lure | 8 | 38/234 | 25/108 | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 14/156 | 5/28 | clear+stained+dirty clarity<br>goal_tags>1 |

### Tag Load vs Selection Share

| Profile | Gear | Signals | Overall selected/rate | Home selected/rate | AP/BF | Top/HM | Common selected buckets |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 7 | 137/612 (22.4%) | 34/204 (16.7%) | big_fish:118, all_purpose:19 | top:82, honorable:55 | cold_slow:35, none:31, calm_surface:29, clear_subtle:28, wind_reaction:22 |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 7 | 132/612 (21.6%) | 80/372 (21.5%) | big_fish:114, all_purpose:18 | honorable:85, top:47 | cold_slow:70, wind_reaction:47, dirty_vibration:42, none:25, low_light_surface:12 |
| Big Tube Jig<br>big_smallmouth_tube | lure | 8 | 126/540 (23.3%) | 87/360 (24.2%) | big_fish:126 | honorable:71, top:55 | cold_slow:41, calm_surface:25, clear_subtle:25, none:23, dirty_vibration:22 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 7 | 118/612 (19.3%) | 24/204 (11.8%) | big_fish:102, all_purpose:16 | top:77, honorable:41 | cold_slow:34, none:29, calm_surface:22, wind_reaction:21, dirty_vibration:18 |
| Clouser Minnow<br>clouser_minnow | fly | 7 | 98/612 (16%) | 18/204 (8.8%) | all_purpose:97, big_fish:1 | honorable:53, top:45 | cold_slow:33, calm_surface:20, none:19, clear_subtle:17, low_light_surface:13 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 7 | 97/348 (27.9%) | 51/116 (44%) | all_purpose:59, big_fish:38 | honorable:51, top:46 | cold_slow:49, clear_subtle:24, none:23, wind_reaction:15, low_light_surface:10 |
| Ned Rig<br>ned_rig | lure | 9 | 96/612 (15.7%) | 66/232 (28.4%) | all_purpose:79, big_fish:17 | top:75, honorable:21 | cold_slow:45, clear_subtle:32, wind_reaction:17, none:14, calm_surface:11 |
| Football Jig<br>football_jig | lure | 7 | 94/468 (20.1%) | 32/168 (19%) | big_fish:94 | honorable:51, top:43 | cold_slow:37, wind_reaction:28, none:21, dirty_vibration:18, clear_subtle:13 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 8 | 89/360 (24.7%) | 41/80 (51.3%) | big_fish:89 | honorable:46, top:43 | cold_slow:45, none:16, clear_subtle:15, wind_reaction:14, dirty_vibration:13 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 8 | 79/612 (12.9%) | 42/204 (20.6%) | all_purpose:60, big_fish:19 | honorable:61, top:18 | cold_slow:63, wind_reaction:27, dirty_vibration:16, clear_subtle:6, none:5 |
| Woolly Bugger<br>woolly_bugger | fly | 7 | 74/612 (12.1%) | 63/276 (22.8%) | all_purpose:64, big_fish:10 | honorable:58, top:16 | cold_slow:61, clear_subtle:12, wind_reaction:11, dirty_vibration:9, low_light_surface:7 |
| Blade Bait<br>blade_bait | lure | 8 | 63/612 (10.3%) | 16/208 (7.7%) | all_purpose:39, big_fish:24 | top:39, honorable:24 | cold_slow:40, dirty_vibration:33, wind_reaction:22, current_swing:16, open_water_search:14 |
| Tube Jig<br>tube_jig | lure | 7 | 63/612 (10.3%) | 59/408 (14.5%) | all_purpose:62, big_fish:1 | top:45, honorable:18 | cold_slow:35, clear_subtle:26, calm_surface:9, wind_reaction:8, none:7 |
| Jigged Marabou Leech<br>jighead_marabou_leech | fly | 7 | 61/612 (10%) | 0/0 | all_purpose:42, big_fish:19 | honorable:34, top:27 | cold_slow:48, wind_reaction:27, dirty_vibration:20, open_water_search:9, clear_subtle:4 |
| Baitfish Slider<br>baitfish_slider_fly | fly | 8 | 58/480 (12.1%) | 2/4 (50%) | all_purpose:48, big_fish:10 | honorable:54, top:4 | none:21, wind_reaction:20, dirty_vibration:15, warming_search:13, open_water_search:6 |
| Deceiver<br>deceiver | fly | 7 | 55/612 (9%) | 42/204 (20.6%) | all_purpose:41, big_fish:14 | top:44, honorable:11 | wind_reaction:42, dirty_vibration:29, cold_slow:15, open_water_search:12, none:7 |
| Compact Glide Bait<br>compact_glidebait | lure | 8 | 54/300 (18%) | 0/0 | big_fish:54 | honorable:33, top:21 | clear_subtle:17, calm_surface:11, cold_slow:11, none:11, wind_reaction:10 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 9 | 52/612 (8.5%) | 6/204 (2.9%) | all_purpose:47, big_fish:5 | top:42, honorable:10 | calm_surface:20, warming_search:16, low_light_surface:12, none:12, clear_subtle:5 |
| Deer Hair Slider<br>deer_hair_slider | fly | 8 | 52/234 (22.2%) | 28/108 (25.9%) | big_fish:51, all_purpose:1 | honorable:32, top:20 | calm_surface:28, low_light_surface:17, clear_subtle:12, current_swing:9, none:9 |
| Bladed Jig<br>bladed_jig | lure | 10 | 49/612 (8%) | 27/136 (19.9%) | all_purpose:44, big_fish:5 | top:40, honorable:9 | dirty_vibration:27, wind_reaction:16, current_swing:12, calm_surface:11, cold_slow:10 |
| Foam Gurgler<br>foam_gurgler_fly | fly | 9 | 49/234 (20.9%) | 46/108 (42.6%) | all_purpose:29, big_fish:20 | top:35, honorable:14 | calm_surface:46, low_light_surface:17, clear_subtle:14, current_swing:7, warming_search:6 |
| Soft Jerkbait<br>soft_jerkbait | lure | 7 | 49/480 (10.2%) | 19/108 (17.6%) | all_purpose:49 | honorable:46, top:3 | calm_surface:15, clear_subtle:15, none:12, low_light_surface:9, warming_search:7 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 9 | 43/612 (7%) | 23/152 (15.1%) | big_fish:30, all_purpose:13 | top:24, honorable:19 | wind_reaction:33, dirty_vibration:23, cold_slow:11, open_water_search:11, none:9 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 9 | 42/612 (6.9%) | 12/280 (4.3%) | all_purpose:33, big_fish:9 | top:33, honorable:9 | cold_slow:33, dirty_vibration:13, wind_reaction:12, clear_subtle:5, none:5 |
| Zonker Streamer<br>zonker_streamer | fly | 7 | 42/612 (6.9%) | 0/0 | all_purpose:29, big_fish:13 | top:35, honorable:7 | wind_reaction:38, dirty_vibration:33, cold_slow:12, open_water_search:9, low_light_surface:4 |
| Lead-Eye Leech<br>lead_eye_leech | fly | 7 | 41/612 (6.7%) | 0/0 | all_purpose:32, big_fish:9 | top:21, honorable:20 | clear_subtle:23, cold_slow:23, wind_reaction:10, dirty_vibration:4, open_water_search:4 |
| Walking Bait<br>walking_topwater | lure | 8 | 38/234 (16.2%) | 25/108 (23.1%) | big_fish:38 | top:28, honorable:10 | calm_surface:25, low_light_surface:14, clear_subtle:9, current_swing:9, dirty_vibration:6 |
| Spinnerbait<br>spinnerbait | lure | 9 | 36/612 (5.9%) | 19/152 (12.5%) | all_purpose:33, big_fish:3 | top:22, honorable:14 | dirty_vibration:18, cold_slow:11, wind_reaction:10, current_swing:9, none:9 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 6 | 35/480 (7.3%) | 0/112 (0%) | all_purpose:19, big_fish:16 | honorable:35 | cold_slow:34, clear_subtle:4, low_light_surface:2 |
| Unweighted Baitfish<br>unweighted_baitfish_streamer | fly | 7 | 34/480 (7.1%) | 2/4 (50%) | all_purpose:20, big_fish:14 | honorable:25, top:9 | clear_subtle:22, wind_reaction:8, cold_slow:7, calm_surface:6, dirty_vibration:5 |
| Dungeon Streamer<br>articulated_dungeon_streamer | fly | 8 | 32/168 (19%) | 0/0 | big_fish:32 | honorable:17, top:15 | cold_slow:25, dirty_vibration:10, wind_reaction:9, current_swing:6, warming_search:3 |
| Buzzbait<br>buzzbait | lure | 9 | 31/234 (13.2%) | 11/108 (10.2%) | big_fish:31 | top:21, honorable:10 | low_light_surface:15, dirty_vibration:13, calm_surface:11, wind_reaction:9, current_swing:8 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 7 | 30/612 (4.9%) | 24/108 (22.2%) | all_purpose:22, big_fish:8 | honorable:27, top:3 | clear_subtle:24, cold_slow:6, none:6, calm_surface:3, current_swing:3 |
| Sculpzilla<br>sculpzilla | fly | 7 | 30/144 (20.8%) | 28/132 (21.2%) | big_fish:30 | top:19, honorable:11 | current_swing:15, cold_slow:11, dirty_vibration:11, calm_surface:7, low_light_surface:6 |
| Inline Spinner<br>inline_spinner | lure | 8 | 29/612 (4.7%) | 5/48 (10.4%) | all_purpose:23, big_fish:6 | top:16, honorable:13 | wind_reaction:22, dirty_vibration:13, open_water_search:10, cold_slow:9, current_swing:5 |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 8 | 27/480 (5.6%) | 23/112 (20.5%) | all_purpose:20, big_fish:7 | honorable:23, top:4 | dirty_vibration:23, wind_reaction:17, current_swing:10, low_light_surface:6, calm_surface:3 |
| Muddler Minnow<br>muddler_sculpin | fly | 7 | 23/144 (16%) | 18/112 (16.1%) | all_purpose:22, big_fish:1 | top:19, honorable:4 | cold_slow:14, current_swing:8, dirty_vibration:6, clear_subtle:5, calm_surface:4 |
| Bass Popper<br>popper_fly | fly | 8 | 21/234 (9%) | 19/108 (17.6%) | all_purpose:20, big_fish:1 | top:13, honorable:8 | calm_surface:19, low_light_surface:7, clear_subtle:3, current_swing:2, dirty_vibration:2 |
| Crawfish Streamer<br>crawfish_streamer | fly | 8 | 21/144 (14.6%) | 16/112 (14.3%) | all_purpose:17, big_fish:4 | top:16, honorable:5 | clear_subtle:11, current_swing:9, cold_slow:6, dirty_vibration:6, calm_surface:4 |
| Finesse Jig<br>finesse_jig | lure | 8 | 20/612 (3.3%) | 16/280 (5.7%) | all_purpose:13, big_fish:7 | honorable:11, top:9 | cold_slow:13, clear_subtle:6, none:4, wind_reaction:4, dirty_vibration:2 |
| Sculpin Streamer<br>sculpin_streamer | fly | 9 | 17/144 (11.8%) | 13/112 (11.6%) | all_purpose:16, big_fish:1 | top:13, honorable:4 | cold_slow:10, current_swing:5, dirty_vibration:3, calm_surface:2, clear_subtle:2 |
| Wake Bait<br>wake_bait | lure | 9 | 16/174 (9.2%) | 15/72 (20.8%) | big_fish:16 | top:13, honorable:3 | calm_surface:15, low_light_surface:6, clear_subtle:5, warming_search:3 |
| Topwater Popper<br>popping_topwater | lure | 7 | 16/234 (6.8%) | 16/108 (14.8%) | all_purpose:15, big_fish:1 | honorable:16 | calm_surface:16, low_light_surface:4, warming_search:2, clear_subtle:1, current_swing:1 |
| Weightless Stick Worm<br>weightless_stick_worm | lure | 8 | 14/156 (9%) | 5/28 (17.9%) | all_purpose:14 | honorable:14 | clear_subtle:5, calm_surface:4, none:4, wind_reaction:4, dirty_vibration:3 |
| Deep-Diving Crankbait<br>deep_diving_crankbait | lure | 8 | 12/468 (2.6%) | 4/104 (3.8%) | all_purpose:12 | honorable:10, top:2 | none:5, calm_surface:2, dirty_vibration:2, open_water_search:2, warming_search:2 |
| Marabou Jig Leech<br>feather_jig_leech | fly | 7 | 12/612 (2%) | 0/0 | all_purpose:11, big_fish:1 | honorable:9, top:3 | warming_search:9, dirty_vibration:4, current_swing:3, none:2, calm_surface:1 |
| Slim Baitfish Streamer<br>slim_minnow_streamer | fly | 5 | 11/120 (9.2%) | 0/0 | all_purpose:9, big_fish:2 | honorable:8, top:3 | current_swing:8, clear_subtle:5, calm_surface:4, dirty_vibration:4, low_light_surface:4 |
| Swim Jig<br>swim_jig | lure | 8 | 8/612 (1.3%) | 0/164 (0%) | all_purpose:8 | top:6, honorable:2 | calm_surface:2, cold_slow:2, none:2, warming_search:2 |
| Mouse Pattern<br>mouse_fly | fly | 7 | 6/36 (16.7%) | 0/0 | big_fish:6 | honorable:4, top:2 | calm_surface:6, current_swing:3, low_light_surface:3, clear_subtle:2, dirty_vibration:2 |
| Lipless Crankbait<br>lipless_crankbait | lure | 6 | 5/612 (0.8%) | 4/152 (2.6%) | all_purpose:3, big_fish:2 | top:3, honorable:2 | dirty_vibration:4, wind_reaction:4, cold_slow:2, none:1, open_water_search:1 |
| Glide Bait<br>glidebait | lure | 9 | 3/36 (8.3%) | 0/0 | big_fish:3 | top:2, honorable:1 | none:2, wind_reaction:1 |
| Hair Jig<br>hair_jig | lure | 8 | 3/144 (2.1%) | 3/112 (2.7%) | all_purpose:2, big_fish:1 | honorable:2, top:1 | current_swing:3, dirty_vibration:2, calm_surface:1, cold_slow:1, low_light_surface:1 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 7 | 3/144 (2.1%) | 3/72 (4.2%) | all_purpose:2, big_fish:1 | honorable:2, top:1 | current_swing:3, dirty_vibration:2, cold_slow:1, low_light_surface:1, warming_search:1 |
| Carolina-Rigged Stick Worm<br>carolina_rigged_stick_worm | lure | 8 | 2/468 (0.4%) | 0/164 (0%) | all_purpose:2 | honorable:1, top:1 | none:2 |
| Shaky-Head Worm<br>shaky_head_worm | lure | 9 | 0/132 (0%) | 0/60 (0%) |  |  |  |
| Conehead Streamer<br>conehead_streamer | fly | 7 | 0/144 (0%) | 0/72 (0%) |  |  |  |

### Likely Cause Classification

| Profile | Gear | Selected/Opp | Home selected/opp | Cause classification | Stack flags |
| --- | --- | --- | --- | --- | --- |
| Game Changer<br>game_changer | fly | 137/612 (22.4%) | 34/204 (16.7%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | clear+stained+dirty clarity<br>goal_tags>1<br>versatile_search+big_fish_upside |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 132/612 (21.6%) | 80/372 (21.5%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>reliable_action+big_fish_upside<br>home-window share>20% |
| Big Tube Jig<br>big_smallmouth_tube | lure | 126/540 (23.3%) | 87/360 (24.2%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | home-window share>20% |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 97/348 (27.9%) | 51/116 (44%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>combined all-slot share>25%<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Ned Rig<br>ned_rig | lure | 96/612 (15.7%) | 66/232 (28.4%) | catalog_tag_stack<br>condition_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Football Jig<br>football_jig | lure | 94/468 (20.1%) | 32/168 (19%) | catalog_tag_stack<br>goal_tag_pressure | clear+stained+dirty clarity |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 89/360 (24.7%) | 41/80 (51.3%) | catalog_tag_stack<br>goal_tag_pressure<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 79/612 (12.9%) | 42/204 (20.6%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | goal_tags>1<br>home-window share>20% |
| Woolly Bugger<br>woolly_bugger | fly | 74/612 (12.1%) | 63/276 (22.8%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Deceiver<br>deceiver | fly | 55/612 (9%) | 42/204 (20.6%) | catalog_tag_stack<br>selector_direct_score_bias | clear+stained+dirty clarity<br>home-window share>20% |
| Deer Hair Slider<br>deer_hair_slider | fly | 52/234 (22.2%) | 28/108 (25.9%) | catalog_tag_stack<br>goal_tag_pressure<br>forage_clarity_stack | clear+stained+dirty clarity<br>home-window share>20%<br>home-window share>25% overdominant |
| Foam Gurgler<br>foam_gurgler_fly | fly | 49/234 (20.9%) | 46/108 (42.6%) | catalog_tag_stack<br>forage_clarity_stack<br>selector_direct_score_bias<br>acceptable_niche_concentration | clear+stained+dirty clarity<br>goal_tags>1<br>home-window share>20%<br>home-window share>25% overdominant<br>home-window share>30% severe |
| Walking Bait<br>walking_topwater | lure | 38/234 (16.2%) | 25/108 (23.1%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | goal_tags>1<br>surface+calm+low_light+big_fish+high_risk<br>home-window share>20% |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 30/612 (4.9%) | 24/108 (22.2%) | catalog_tag_stack<br>selector_direct_score_bias<br>scenario_coverage_bias | home-window share>20% |
| Sculpzilla<br>sculpzilla | fly | 30/144 (20.8%) | 28/132 (21.2%) | catalog_tag_stack<br>goal_tag_pressure<br>selector_direct_score_bias | home-window share>20% |
| Squarebill Crankbait<br>squarebill_crankbait | lure | 27/480 (5.6%) | 23/112 (20.5%) | catalog_tag_stack<br>condition_tag_stack<br>selector_direct_score_bias | wind+dirty+versatile_search<br>wind+dirty+stained/dirty clarity<br>home-window share>20% |

### Staple Underuse vs Tag Support

| Profile | Gear | Tag support | Home opp | Selected home rate | Common winners beating it | Likely issue |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | forage 2: leech_worm, crawfish<br>clarity 3: clear, stained, dirty<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 232 | 66/232 (28.4%) | Tube Jig (top), Suspending Jerkbait (honorable):19, Big Tube Jig (top), Magnum Jerkbait (honorable):15, Magnum Jerkbait (top), Big Tube Jig (honorable):13, Magnum Jerkbait (top), Football Jig (honorable):9 | healthy / not underused |
| Tube Jig<br>tube_jig | lure | forage 2: crawfish, baitfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, cold_slow<br>goal 1: reliable_action | 408 | 59/408 (14.5%) | Big Tube Jig (top), Magnum Jerkbait (honorable):21, Ned Rig (top), Flat-Sided Crankbait (honorable):21, Magnum Jerkbait (top), Big Tube Jig (honorable):19, Ned Rig (top), Drop-Shot Minnow (honorable):14 | healthy / not underused |
| Big Tube Jig<br>big_smallmouth_tube | lure | forage 2: crawfish, baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: big_fish_upside | 360 | 87/360 (24.2%) | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Tube Jig (top), Suspending Jerkbait (honorable):18, Magnum Jerkbait (top), Football Jig (honorable):13, Ned Rig (top), Drop-Shot Minnow (honorable):10 | healthy / not underused |
| Finesse Jig<br>finesse_jig | lure | forage 2: crawfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, heat_finesse<br>goal 1: reliable_action | 280 | 16/280 (5.7%) | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Tube Jig (top), Suspending Jerkbait (honorable):21, Big Tube Jig (top), Magnum Jerkbait (honorable):15, Magnum Jerkbait (top), Big Tube Jig (honorable):13 | selector/direct-score or overpowered competitors |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | forage 1: crawfish<br>clarity 3: clear, stained, dirty<br>condition 4: cover_ambush, cold_slow, clear_subtle, heat_finesse<br>goal 1: reliable_action | 280 | 12/280 (4.3%) | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Tube Jig (top), Suspending Jerkbait (honorable):21, Big Tube Jig (top), Magnum Jerkbait (honorable):15, Magnum Jerkbait (top), Big Tube Jig (honorable):13 | selector/direct-score or overpowered competitors |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | forage 2: baitfish, crawfish<br>clarity 2: clear, stained<br>condition 2: clear_subtle, heat_finesse<br>goal 1: reliable_action | 108 | 24/108 (22.2%) | Tube Jig (top), Soft Jerkbait (honorable):9, Magnum Jerkbait (top), Big Tube Jig (honorable):7, Ned Rig (top), Soft Jerkbait (honorable):6, Ned Rig (top), Weightless Stick Worm (honorable):5 | healthy / not underused |
| Suspending Jerkbait<br>suspending_jerkbait | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: clear_subtle, cold_slow, wind_reaction<br>goal 2: reliable_action, versatile_search | 204 | 42/204 (20.6%) | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Big Tube Jig (top), Magnum Jerkbait (honorable):15, Magnum Jerkbait (top), Big Tube Jig (honorable):14, Ned Rig (top), Drop-Shot Minnow (honorable):10 | healthy / not underused |
| Hair Jig<br>hair_jig | lure | forage 2: baitfish, leech_worm<br>clarity 2: clear, stained<br>condition 3: clear_subtle, current_swing, cold_slow<br>goal 1: reliable_action | 112 | 3/112 (2.7%) | Ned Rig (top), Flat-Sided Crankbait (honorable):10, Bladed Jig (top), Blade Bait (honorable):7, Magnum Jerkbait (top), Big Tube Jig (honorable):7, Big Tube Jig (top), Magnum Jerkbait (honorable):6 | selector/direct-score or overpowered competitors |
| Inline Spinner<br>inline_spinner | lure | forage 1: baitfish<br>clarity 2: clear, stained<br>condition 3: wind_reaction, open_water_search, current_swing<br>goal 2: reliable_action, versatile_search | 48 | 5/48 (10.4%) | Big Tube Jig (top), Magnum Jerkbait (honorable):3, Bladed Jig (top), Blade Bait (honorable):3, Buzzbait (top), Big Tube Jig (honorable):3, Magnum Jerkbait (top), Big Tube Jig (honorable):2 | selector/direct-score or overpowered competitors |
| Bladed Jig<br>bladed_jig | lure | forage 2: baitfish, bluegill_perch<br>clarity 2: stained, dirty<br>condition 4: wind_reaction, dirty_vibration, cover_ambush, warming_search<br>goal 2: reliable_action, versatile_search | 136 | 27/136 (19.9%) | Buzzbait (top), Big Tube Jig (honorable):7, Medium-Diving Crankbait (top), Football Jig (honorable):6, Spinnerbait (top), Squarebill Crankbait (honorable):6, Big Tube Jig (top), Magnum Jerkbait (honorable):4 | healthy / not underused |
| Lipless Crankbait<br>lipless_crankbait | lure | forage 1: baitfish<br>clarity 2: stained, dirty<br>condition 2: wind_reaction, open_water_search<br>goal 1: versatile_search | 152 | 4/152 (2.6%) | Bladed Jig (top), Blade Bait (honorable):7, Buzzbait (top), Big Tube Jig (honorable):7, Bladed Jig (top), Squarebill Crankbait (honorable):6, Medium-Diving Crankbait (top), Football Jig (honorable):6 | selector/direct-score or overpowered competitors |

### Guide Review Tag Candidates

### High-confidence remove/reduce tag candidates
Foam Gurgler (foam_gurgler_fly), Game Changer (game_changer), Magnum Jerkbait (magnum_jerkbait), Rabbit-Strip Leech (rabbit_strip_leech), Squarebill Crankbait (squarebill_crankbait), Suspending Jerkbait (suspending_jerkbait), Walking Bait (walking_topwater)

### High-confidence missing tag candidates
None from audit alone.

### Needs guide review
Big Tube Jig (big_smallmouth_tube), Crawfish Fly (warmwater_crawfish_fly), Deceiver (deceiver), Deer Hair Slider (deer_hair_slider), Drop-Shot Minnow (drop_shot_minnow), Foam Gurgler (foam_gurgler_fly), Football Jig (football_jig), Game Changer (game_changer), Magnum Jerkbait (magnum_jerkbait), Ned Rig (ned_rig), Rabbit-Strip Leech (rabbit_strip_leech), Sculpzilla (sculpzilla), Squarebill Crankbait (squarebill_crankbait), Suspending Jerkbait (suspending_jerkbait), Walking Bait (walking_topwater), Woolly Bugger (woolly_bugger)

### Probably selector problem, not catalog problem
Finesse Jig (finesse_jig), Hair Jig (hair_jig), Inline Spinner (inline_spinner), Lipless Crankbait (lipless_crankbait), Texas-Rigged Craw (texas_rigged_soft_plastic_craw)

## Utilization Notes / Coverage Gaps

- 2 eligible profile(s) were never selected despite appearing in candidate pools; these are prime coverage or selector-balance review targets.
- 1 low-use profile(s) were often close to selected winners, which leans toward selector/catalog balance rather than pure scenario coverage.
- 3 low-use profile(s) were usually far behind winners; these may need better-fit scenarios or narrower catalog/seasonal expectations.
- 1 profile(s) crossed the report-only over-selection threshold; review whether they are appropriately dominant in their contexts.

## Signature Profile Home-Window Summary

| Diagnosis | Profiles |
| --- | --- |
| healthy | Rabbit-Strip Leech, Woolly Bugger, Articulated Baitfish, Clouser Minnow, Game Changer, Sculpzilla, Crawfish Streamer, Muddler Minnow, Sculpin Streamer, Tube Jig, Big Tube Jig, Suspending Jerkbait, Football Jig, Medium-Diving Crankbait, Spinnerbait, Bladed Jig, Buzzbait, Drop-Shot Minnow, Soft Jerkbait, Walking Bait, Inline Spinner |
| underused_home_window | Bucktail Streamer, Conehead Streamer, Finesse Jig, Texas-Rigged Craw, Blade Bait, Paddle-Tail Swimbait, Lipless Crankbait, Flat-Sided Crankbait, Hair Jig |
| no_home_window_coverage | None |
| over-dominant | Crawfish Fly, Deer Hair Slider, Ned Rig, Magnum Jerkbait |
| probably okay niche profile | None |

## SMB Species-Staple Floor Audit

| Profile | Gear | Actual side share | Selected/Opp | Selected/home | Selected overall | Selected home | Home win rate | AP home | Big Fish home | Close home losses | Diagnosis | Home context split | Common home winners |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Rabbit-Strip Leech<br>rabbit_strip_leech | fly | 10.8% | 132/612 | 80/372 | 132 | 80 | 21.5% | 18/186 | 62/186 | 97 | healthy | activity neutral:300, suppressed:72<br>clarity clear:168, stained:112, dirty:92<br>water freshwater_lake_pond:240, freshwater_river:132<br>bucket cold_slow_or_front:212, dirty_vibration:36, stable_pleasant_high_confidence:24 | Crawfish Fly (top), Woolly Bugger (honorable):22, Muddler Minnow (top), Woolly Bugger (honorable):11, Lead-Eye Leech (top), Woolly Bugger (honorable):10 |
| Woolly Bugger<br>woolly_bugger | fly | 6% | 74/612 | 63/276 | 74 | 63 | 22.8% | 53/138 | 10/138 | 85 | healthy | activity neutral:204, suppressed:72<br>clarity clear:92, dirty:92, stained:92<br>water freshwater_lake_pond:168, freshwater_river:108<br>bucket cold_slow_or_front:176, dirty_vibration:36, breezy_windy_stained_reaction:20 | Rabbit-Strip Leech (top), Articulated Baitfish (honorable):9, Jigged Marabou Leech (top), Clouser Minnow (honorable):8, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):7 |
| Articulated Baitfish<br>articulated_baitfish_streamer | fly | 9.6% | 118/612 | 24/204 | 118 | 24 | 11.8% | 0/102 | 24/102 | 61 | healthy | activity neutral:192, suppressed:12<br>clarity clear:68, dirty:68, stained:68<br>water freshwater_lake_pond:132, freshwater_river:72<br>bucket dirty_vibration:64, breezy_windy_stained_reaction:48, cold_slow_or_front:40 | Deceiver (top), Rabbit-Strip Leech (honorable):11, Game Changer (top), Rabbit-Strip Leech (honorable):10, Deceiver (top), Jigged Marabou Leech (honorable):8 |
| Clouser Minnow<br>clouser_minnow | fly | 8% | 98/612 | 18/204 | 98 | 18 | 8.8% | 18/102 | 0/102 | 83 | healthy | activity neutral:192, suppressed:12<br>clarity clear:68, dirty:68, stained:68<br>water freshwater_lake_pond:132, freshwater_river:72<br>bucket dirty_vibration:64, breezy_windy_stained_reaction:48, cold_slow_or_front:40 | Deceiver (top), Rabbit-Strip Leech (honorable):11, Game Changer (top), Rabbit-Strip Leech (honorable):10, Deceiver (top), Jigged Marabou Leech (honorable):8 |
| Game Changer<br>game_changer | fly | 11.2% | 137/612 | 34/204 | 137 | 34 | 16.7% | 2/102 | 32/102 | 51 | healthy | activity neutral:192, suppressed:12<br>clarity clear:68, dirty:68, stained:68<br>water freshwater_lake_pond:132, freshwater_river:72<br>bucket dirty_vibration:64, breezy_windy_stained_reaction:48, cold_slow_or_front:40 | Deceiver (top), Rabbit-Strip Leech (honorable):11, Deceiver (top), Jigged Marabou Leech (honorable):8, Deceiver (top), Baitfish Slider (honorable):7 |
| Sculpzilla<br>sculpzilla | fly | 2.5% | 30/144 | 28/132 | 30 | 28 | 21.2% | 0/66 | 28/66 | 39 | healthy | activity neutral:108, suppressed:24<br>clarity clear:48, stained:48, dirty:36<br>water freshwater_river:132<br>bucket cold_slow_or_front:56, dirty_vibration:20, calm_low_light_surface:12 | Muddler Minnow (top), Woolly Bugger (honorable):11, Sculpin Streamer (top), Clouser Minnow (honorable):7, Dungeon Streamer (honorable), Rabbit-Strip Leech (top):4 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 7.9% | 97/348 | 51/116 | 97 | 51 | 44% | 28/58 | 23/58 | 47 | over-dominant | activity neutral:108, suppressed:8<br>clarity clear:84, stained:32<br>water freshwater_lake_pond:116<br>bucket cold_slow_or_front:68, calm_bright_clear_subtle:16, unclassified:12 | Deer Hair Slider (honorable), Game Changer (top):6, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):4, Clouser Minnow (top), Lead-Eye Leech (honorable):4 |
| Crawfish Streamer<br>crawfish_streamer | fly | 1.7% | 21/144 | 16/112 | 21 | 16 | 14.3% | 12/56 | 4/56 | 51 | healthy | activity neutral:92, suppressed:20<br>clarity clear:48, stained:44, dirty:20<br>water freshwater_river:112<br>bucket cold_slow_or_front:44, dirty_vibration:16, calm_low_light_surface:12 | Muddler Minnow (top), Woolly Bugger (honorable):9, Sculpin Streamer (top), Clouser Minnow (honorable):6, Dungeon Streamer (honorable), Rabbit-Strip Leech (top):4 |
| Muddler Minnow<br>muddler_sculpin | fly | 1.9% | 23/144 | 18/112 | 23 | 18 | 16.1% | 18/56 | 0/56 | 56 | healthy | activity neutral:92, suppressed:20<br>clarity clear:48, stained:44, dirty:20<br>water freshwater_river:112<br>bucket cold_slow_or_front:44, dirty_vibration:16, calm_low_light_surface:12 | Sculpin Streamer (top), Clouser Minnow (honorable):6, Dungeon Streamer (honorable), Rabbit-Strip Leech (top):4, Game Changer (top), Rabbit-Strip Leech (honorable):4 |
| Sculpin Streamer<br>sculpin_streamer | fly | 1.4% | 17/144 | 13/112 | 17 | 13 | 11.6% | 13/56 | 0/56 | 68 | healthy | activity neutral:92, suppressed:20<br>clarity clear:48, stained:44, dirty:20<br>water freshwater_river:112<br>bucket cold_slow_or_front:44, dirty_vibration:16, calm_low_light_surface:12 | Muddler Minnow (top), Woolly Bugger (honorable):9, Dungeon Streamer (honorable), Rabbit-Strip Leech (top):4, Game Changer (top), Rabbit-Strip Leech (honorable):4 |
| Deer Hair Slider<br>deer_hair_slider | fly | 4.2% | 52/234 | 28/108 | 52 | 28 | 25.9% | 1/54 | 27/54 | 9 | over-dominant | activity neutral:96, active:12<br>clarity clear:36, dirty:36, stained:36<br>water freshwater_lake_pond:72, freshwater_river:36<br>bucket stable_pleasant_high_confidence:44, calm_low_light_surface:36, calm_bright_clear_subtle:12 | Foam Gurgler (top), Game Changer (honorable):10, Foam Gurgler (top), Articulated Baitfish (honorable):9, Foam Gurgler (top), Clouser Minnow (honorable):6 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 0.2% | 3/144 | 3/72 | 3 | 3 | 4.2% | 2/36 | 1/36 | 17 | underused_home_window | activity neutral:60, suppressed:12<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_river:72<br>bucket dirty_vibration:20, calm_low_light_surface:12, cold_slow_or_front:12 | Muddler Minnow (top), Woolly Bugger (honorable):4, Game Changer (top), Rabbit-Strip Leech (honorable):3, Sculpzilla (honorable), Deer Hair Slider (top):3 |
| Conehead Streamer<br>conehead_streamer | fly | 0% | 0/144 | 0/72 | 0 | 0 | 0% | 0/36 | 0/36 | 19 | underused_home_window | activity neutral:60, suppressed:12<br>clarity clear:24, dirty:24, stained:24<br>water freshwater_river:72<br>bucket dirty_vibration:20, calm_low_light_surface:12, cold_slow_or_front:12 | Muddler Minnow (top), Woolly Bugger (honorable):4, Game Changer (top), Rabbit-Strip Leech (honorable):3, Sculpzilla (honorable), Deer Hair Slider (top):3 |
| Tube Jig<br>tube_jig | lure | 5.1% | 63/612 | 59/408 | 63 | 59 | 14.5% | 58/204 | 1/204 | 124 | healthy | activity neutral:344, suppressed:48, active:16<br>clarity clear:204, stained:204<br>water freshwater_lake_pond:312, freshwater_river:96<br>bucket cold_slow_or_front:160, stable_pleasant_high_confidence:68, unclassified:56 | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Magnum Jerkbait (top), Big Tube Jig (honorable):17, Ned Rig (top), Drop-Shot Minnow (honorable):14 |
| Big Tube Jig<br>big_smallmouth_tube | lure | 10.3% | 126/540 | 87/360 | 126 | 87 | 24.2% | 0/180 | 87/180 | 60 | healthy | activity neutral:304, suppressed:40, active:16<br>clarity clear:180, stained:180<br>water freshwater_lake_pond:272, freshwater_river:88<br>bucket cold_slow_or_front:124, stable_pleasant_high_confidence:68, unclassified:56 | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Tube Jig (top), Suspending Jerkbait (honorable):17, Magnum Jerkbait (top), Football Jig (honorable):13 |
| Finesse Jig<br>finesse_jig | lure | 1.6% | 20/612 | 16/280 | 20 | 16 | 5.7% | 10/140 | 6/140 | 147 | underused_home_window | activity neutral:228, suppressed:52<br>clarity clear:168, stained:92, dirty:20<br>water freshwater_lake_pond:168, freshwater_river:112<br>bucket cold_slow_or_front:160, stable_pleasant_high_confidence:24, calm_bright_clear_subtle:20 | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Tube Jig (top), Suspending Jerkbait (honorable):20, Ned Rig (top), Drop-Shot Minnow (honorable):13 |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 3.4% | 42/612 | 12/280 | 42 | 12 | 4.3% | 9/140 | 3/140 | 148 | underused_home_window | activity neutral:228, suppressed:52<br>clarity clear:168, stained:92, dirty:20<br>water freshwater_lake_pond:168, freshwater_river:112<br>bucket cold_slow_or_front:160, stable_pleasant_high_confidence:24, calm_bright_clear_subtle:20 | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Tube Jig (top), Suspending Jerkbait (honorable):20, Ned Rig (top), Drop-Shot Minnow (honorable):13 |
| Ned Rig<br>ned_rig | lure | 7.8% | 96/612 | 66/232 | 96 | 66 | 28.4% | 54/116 | 12/116 | 94 | over-dominant | activity neutral:184, suppressed:48<br>clarity clear:148, stained:84<br>water freshwater_lake_pond:164, freshwater_river:68<br>bucket cold_slow_or_front:144, calm_bright_clear_subtle:20, breezy_windy_stained_reaction:16 | Tube Jig (top), Suspending Jerkbait (honorable):18, Magnum Jerkbait (top), Big Tube Jig (honorable):11, Magnum Jerkbait (top), Football Jig (honorable):9 |
| Blade Bait<br>blade_bait | lure | 5.1% | 63/612 | 16/208 | 63 | 16 | 7.7% | 8/104 | 8/104 | 38 | underused_home_window | activity neutral:160, suppressed:48<br>clarity clear:104, stained:104<br>water freshwater_lake_pond:168, freshwater_river:40<br>bucket cold_slow_or_front:136, breezy_windy_stained_reaction:48, stable_pleasant_high_confidence:16 | Ned Rig (top), Flat-Sided Crankbait (honorable):20, Tube Jig (top), Suspending Jerkbait (honorable):19, Magnum Jerkbait (top), Big Tube Jig (honorable):10 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 4.2% | 52/612 | 6/204 | 52 | 6 | 2.9% | 6/102 | 0/102 | 61 | underused_home_window | activity neutral:192, suppressed:12<br>clarity clear:68, dirty:68, stained:68<br>water freshwater_lake_pond:132, freshwater_river:72<br>bucket dirty_vibration:64, breezy_windy_stained_reaction:48, cold_slow_or_front:40 | Medium-Diving Crankbait (top), Football Jig (honorable):9, Spinnerbait (top), Squarebill Crankbait (honorable):7, Bladed Jig (top), Squarebill Crankbait (honorable):6 |
| Suspending Jerkbait<br>suspending_jerkbait | lure | 6.5% | 79/612 | 42/204 | 79 | 42 | 20.6% | 28/102 | 14/102 | 15 | healthy | activity neutral:156, suppressed:48<br>clarity clear:116, stained:88<br>water freshwater_lake_pond:144, freshwater_river:60<br>bucket cold_slow_or_front:132, warming_search:24, breezy_windy_stained_reaction:20 | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Magnum Jerkbait (top), Big Tube Jig (honorable):12, Ned Rig (top), Drop-Shot Minnow (honorable):10 |
| Football Jig<br>football_jig | lure | 7.7% | 94/468 | 32/168 | 94 | 32 | 19% | 0/84 | 32/84 | 15 | healthy | activity neutral:136, suppressed:32<br>clarity clear:120, stained:48<br>water freshwater_lake_pond:168<br>bucket cold_slow_or_front:116, calm_bright_clear_subtle:16, stable_pleasant_high_confidence:12 | Tube Jig (top), Suspending Jerkbait (honorable):15, Ned Rig (top), Flat-Sided Crankbait (honorable):11, Ned Rig (top), Drop-Shot Minnow (honorable):8 |
| Lipless Crankbait<br>lipless_crankbait | lure | 0.4% | 5/612 | 4/152 | 5 | 4 | 2.6% | 2/76 | 2/76 | 35 | underused_home_window | activity neutral:128, active:16, suppressed:8<br>clarity dirty:76, stained:76<br>water freshwater_lake_pond:104, freshwater_river:48<br>bucket dirty_vibration:64, breezy_windy_stained_reaction:48, stable_pleasant_high_confidence:12 | Bladed Jig (top), Squarebill Crankbait (honorable):6, Medium-Diving Crankbait (top), Football Jig (honorable):6, Spinnerbait (top), Squarebill Crankbait (honorable):6 |
| Medium-Diving Crankbait<br>medium_diving_crankbait | lure | 3.5% | 43/612 | 23/152 | 43 | 23 | 15.1% | 8/76 | 15/76 | 57 | healthy | activity neutral:128, active:16, suppressed:8<br>clarity dirty:76, stained:76<br>water freshwater_lake_pond:104, freshwater_river:48<br>bucket dirty_vibration:64, breezy_windy_stained_reaction:48, stable_pleasant_high_confidence:12 | Bladed Jig (top), Squarebill Crankbait (honorable):6, Spinnerbait (top), Squarebill Crankbait (honorable):6, Blade Bait (honorable), Bladed Jig (top):5 |
| Spinnerbait<br>spinnerbait | lure | 2.9% | 36/612 | 19/152 | 36 | 19 | 12.5% | 16/76 | 3/76 | 59 | healthy | activity neutral:128, active:16, suppressed:8<br>clarity dirty:76, stained:76<br>water freshwater_lake_pond:104, freshwater_river:48<br>bucket dirty_vibration:64, breezy_windy_stained_reaction:48, stable_pleasant_high_confidence:12 | Bladed Jig (top), Squarebill Crankbait (honorable):6, Medium-Diving Crankbait (top), Football Jig (honorable):6, Blade Bait (honorable), Bladed Jig (top):5 |
| Bladed Jig<br>bladed_jig | lure | 4% | 49/612 | 27/136 | 49 | 27 | 19.9% | 22/68 | 5/68 | 50 | healthy | activity neutral:128, suppressed:8<br>clarity dirty:68, stained:68<br>water freshwater_lake_pond:88, freshwater_river:48<br>bucket dirty_vibration:64, breezy_windy_stained_reaction:48, calm_low_light_surface:8 | Medium-Diving Crankbait (top), Football Jig (honorable):6, Spinnerbait (top), Squarebill Crankbait (honorable):6, Big Tube Jig (honorable), Buzzbait (top):4 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 2.9% | 35/480 | 0/112 | 35 | 0 | 0% | 0/56 | 0/56 | 1 | underused_home_window | activity neutral:88, active:16, suppressed:8<br>clarity dirty:56, stained:56<br>water freshwater_lake_pond:72, freshwater_river:40<br>bucket dirty_vibration:44, breezy_windy_stained_reaction:28, stable_pleasant_high_confidence:12 | Bladed Jig (top), Squarebill Crankbait (honorable):6, Medium-Diving Crankbait (top), Football Jig (honorable):6, Spinnerbait (top), Squarebill Crankbait (honorable):6 |
| Hair Jig<br>hair_jig | lure | 0.2% | 3/144 | 3/112 | 3 | 3 | 2.7% | 2/56 | 1/56 | 4 | underused_home_window | activity neutral:92, suppressed:20<br>clarity clear:48, stained:44, dirty:20<br>water freshwater_river:112<br>bucket cold_slow_or_front:44, dirty_vibration:16, calm_low_light_surface:12 | Ned Rig (top), Flat-Sided Crankbait (honorable):10, Blade Bait (honorable), Bladed Jig (top):5, Magnum Jerkbait (top), Big Tube Jig (honorable):5 |
| Buzzbait<br>buzzbait | lure | 2.5% | 31/234 | 11/108 | 31 | 11 | 10.2% | 0/54 | 11/54 | 22 | healthy | activity neutral:96, active:12<br>clarity clear:36, dirty:36, stained:36<br>water freshwater_lake_pond:72, freshwater_river:36<br>bucket stable_pleasant_high_confidence:44, calm_low_light_surface:36, calm_bright_clear_subtle:12 | Paddle-Tail Swimbait (top), Topwater Popper (honorable):13, Wake Bait (top), Big Tube Jig (honorable):6, Walking Bait (top), Big Tube Jig (honorable):6 |
| Drop-Shot Minnow<br>drop_shot_minnow | lure | 2.5% | 30/612 | 24/108 | 30 | 24 | 22.2% | 16/54 | 8/54 | 6 | healthy | activity neutral:100, suppressed:8<br>clarity clear:108<br>water freshwater_lake_pond:80, freshwater_river:28<br>bucket cold_slow_or_front:36, calm_bright_clear_subtle:20, stable_pleasant_high_confidence:16 | Tube Jig (top), Soft Jerkbait (honorable):9, Magnum Jerkbait (top), Big Tube Jig (honorable):6, Ned Rig (top), Soft Jerkbait (honorable):6 |
| Soft Jerkbait<br>soft_jerkbait | lure | 4% | 49/480 | 19/108 | 49 | 19 | 17.6% | 19/54 | 0/54 | 15 | healthy | activity neutral:108<br>clarity clear:92, stained:16<br>water freshwater_lake_pond:80, freshwater_river:28<br>bucket warming_search:24, calm_bright_clear_subtle:20, cold_slow_or_front:20 | Magnum Jerkbait (top), Big Tube Jig (honorable):9, Ned Rig (top), Drop-Shot Minnow (honorable):8, Ned Rig (top), Weightless Stick Worm (honorable):5 |
| Walking Bait<br>walking_topwater | lure | 3.1% | 38/234 | 25/108 | 38 | 25 | 23.1% | 0/54 | 25/54 | 28 | healthy | activity neutral:96, active:12<br>clarity clear:36, dirty:36, stained:36<br>water freshwater_lake_pond:72, freshwater_river:36<br>bucket stable_pleasant_high_confidence:44, calm_low_light_surface:36, calm_bright_clear_subtle:12 | Paddle-Tail Swimbait (top), Topwater Popper (honorable):13, Wake Bait (top), Big Tube Jig (honorable):6, Buzzbait (top), Big Tube Jig (honorable):5 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 7.3% | 89/360 | 41/80 | 89 | 41 | 51.3% | 0/0 | 41/80 | 39 | over-dominant | activity neutral:60, suppressed:20<br>clarity clear:46, stained:34<br>water freshwater_lake_pond:52, freshwater_river:28<br>bucket cold_slow_or_front:50, warming_search:12, calm_bright_clear_subtle:6 | Compact Glide Bait (top), Football Jig (honorable):6, Ned Rig (top), Flat-Sided Crankbait (honorable):5, Big Tube Jig (top), Compact Glide Bait (honorable):4 |
| Inline Spinner<br>inline_spinner | lure | 2.4% | 29/612 | 5/48 | 29 | 5 | 10.4% | 3/24 | 2/24 | 11 | healthy | activity neutral:40, suppressed:8<br>clarity clear:24, stained:24<br>water freshwater_river:48<br>bucket cold_slow_or_front:12, calm_low_light_surface:8, river_elevated_runoff_current:8 | Big Tube Jig (top), Magnum Jerkbait (honorable):3, Big Tube Jig (honorable), Buzzbait (top):2, Big Tube Jig (honorable), Magnum Jerkbait (top):2 |

## Bladed Jig Home-Window Win Diagnosis

| Cause | Bladed Jig home-window wins |
| --- | --- |
| score_condition_stack | 15 |
| all_purpose_goal_fit | 10 |
| forage_clarity_stack | 2 |

| Context | Goal/clarity/water | Bucket/activity | Score | Cause | Reasons |
| --- | --- | --- | --- | --- | --- |
| Lake Champlain SMB water<br>2025-01-18 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 166 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 | big_fish<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 130 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| New River Appalachian SMB context<br>2025-03-26 | all_purpose<br>stained<br>freshwater_river | breezy_windy_stained_reaction<br>neutral | 160 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6 |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 180 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | all_purpose<br>stained<br>freshwater_river | warming_search<br>neutral | 196 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>condition_tag:warming_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | big_fish<br>stained<br>freshwater_river | warming_search<br>neutral | 166 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>condition_tag:warming_search:+16<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 196 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>condition_tag:warming_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-04-04 | big_fish<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 166 | forage_clarity_stack | base:+100<br>condition_tag:dirty_vibration:+16<br>condition_tag:warming_search:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 | all_purpose<br>stained<br>freshwater_river | cold_slow_or_front<br>suppressed | 180 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-04-05 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>suppressed | 180 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 170 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 | big_fish<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 140 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Door County / Green Bay smallmouth lake<br>2025-05-23 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 170 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-06-14 | all_purpose<br>stained<br>freshwater_river | stable_pleasant_high_confidence<br>neutral | 170 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Ozark Current River smallmouth context<br>2025-06-14 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 170 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-06-17 | all_purpose<br>stained<br>freshwater_river | river_elevated_runoff_current<br>neutral | 170 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| New River Appalachian SMB context<br>2025-06-17 | all_purpose<br>dirty<br>freshwater_river | dirty_vibration<br>neutral | 170 | all_purpose_goal_fit | base:+100<br>condition_tag:dirty_vibration:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Door County / Green Bay smallmouth lake<br>2025-06-21 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 170 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Door County / Green Bay smallmouth lake<br>2025-06-21 | all_purpose<br>dirty<br>freshwater_lake_pond | dirty_vibration<br>neutral | 170 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Mille Lacs / Upper Midwest natural lake<br>2025-07-16 | all_purpose<br>stained<br>freshwater_lake_pond | breezy_windy_stained_reaction<br>neutral | 186 | score_condition_stack | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |

## Underused Signature Loss Diagnosis

| Profile | AP home selected/opp | Big Fish home selected/opp | Loss causes | Best close losses |
| --- | --- | --- | --- | --- |
| Finesse Jig<br>finesse_jig | 10/140 | 6/140 | goal_tags:130, raw_score:56, forage_clarity_stack:42, daily_condition_tags:19, selector_filtering_variety_jitter:16 | Table Rock / Ozark clear reservoir 2025-02-20 big_fish clear: lost to Football Jig by -10 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 all_purpose clear: lost to Tube Jig by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 all_purpose stained: lost to Texas-Rigged Craw by 0 (selector_filtering_variety_jitter) |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | 9/140 | 3/140 | goal_tags:129, raw_score:62, forage_clarity_stack:44, daily_condition_tags:19, selector_filtering_variety_jitter:13 | Table Rock / Ozark clear reservoir 2025-02-20 big_fish clear: lost to Football Jig by -10 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 all_purpose clear: lost to Tube Jig by 0 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Finesse Jig by 0 (selector_filtering_variety_jitter) |
| Ned Rig<br>ned_rig | 54/116 | 12/116 | goal_tags:90, forage_clarity_stack:38, selector_filtering_variety_jitter:30, daily_condition_tags:8 | Table Rock / Ozark clear reservoir 2025-02-20 big_fish clear: lost to Football Jig by -14 (selector_filtering_variety_jitter)<br>Trinity Lake northern California SMB water 2025-03-30 big_fish clear: lost to Football Jig by -14 (selector_filtering_variety_jitter)<br>Upper Mississippi smallmouth river 2025-01-26 all_purpose clear: lost to Tube Jig by -4 (selector_filtering_variety_jitter) |
| Drop-Shot Minnow<br>drop_shot_minnow | 16/54 | 8/54 | goal_tags:44, raw_score:20, daily_condition_tags:13, seasonal_baseline:6, selector_filtering_variety_jitter:1 | Table Rock / Ozark clear reservoir 2025-04-24 big_fish clear: lost to Ned Rig by 12 (raw_score)<br>New River Appalachian SMB context 2025-04-04 all_purpose clear: lost to Paddle-Tail Swimbait by 16 (goal_tags)<br>Upper Mississippi smallmouth river 2025-01-26 big_fish clear: lost to Finesse Jig by 18 (seasonal_baseline) |

| Profile/context | Candidate | Selected alternative | Delta | Cause | Candidate reasons | Winner reasons |
| --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>big_fish clear cold_slow_or_front | 190 | Football Jig<br>176 | -14 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Trinity Lake northern California SMB water 2025-03-30<br>big_fish clear cold_slow_or_front | 190 | Football Jig<br>176 | -14 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Table Rock / Ozark clear reservoir 2025-02-20<br>big_fish clear cold_slow_or_front | 186 | Football Jig<br>176 | -10 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Craw<br>Table Rock / Ozark clear reservoir 2025-02-20<br>big_fish clear cold_slow_or_front | 186 | Football Jig<br>176 | -10 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 214 | Tube Jig<br>210 | -4 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_tube_jig_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Ned Rig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 174 | Finesse Jig<br>170 | -4 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 210 | Tube Jig<br>210 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_tube_jig_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose stained cold_slow_or_front | 178 | Texas-Rigged Craw<br>178 | 0 | selector_filtering_variety_jitter | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Finesse Jig<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish stained cold_slow_or_front | 154 | Texas-Rigged Craw<br>154 | 0 | selector_filtering_variety_jitter | base:+100<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Craw<br>Upper Mississippi smallmouth river 2025-01-26<br>all_purpose clear cold_slow_or_front | 210 | Tube Jig<br>210 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_tube_jig_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Craw<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 170 | Finesse Jig<br>170 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Texas-Rigged Craw<br>Dale Hollow / Tennessee highland reservoir 2025-02-15<br>all_purpose clear cold_slow_or_front | 210 | Tube Jig<br>210 | 0 | selector_filtering_variety_jitter | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_tube_jig_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Table Rock / Ozark clear reservoir 2025-04-24<br>big_fish clear stable_pleasant_high_confidence | 142 | Ned Rig<br>154 | 12 | raw_score | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6 | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Drop-Shot Minnow<br>New River Appalachian SMB context 2025-04-04<br>all_purpose clear warming_search | 180 | Paddle-Tail Swimbait<br>196 | 16 | goal_tags | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 | base:+100<br>condition_tag:warming_search:+16<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>daily_lane:smallmouth_paddle_tail_search:+16<br>clarity_strength:clear:+8<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10<br>baseline_primary_pace:medium:+10 |
| Drop-Shot Minnow<br>Upper Mississippi smallmouth river 2025-01-26<br>big_fish clear cold_slow_or_front | 152 | Finesse Jig<br>170 | 18 | seasonal_baseline | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Drop-Shot Minnow<br>Table Rock / Ozark clear reservoir 2025-02-20<br>big_fish clear cold_slow_or_front | 152 | Football Jig<br>176 | 24 | goal_tags | base:+100<br>condition_tag:clear_subtle:+16<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |

## Equal-Or-Better Underused Signature Losses

| Cause | Equal-or-better underused losses |
| --- | --- |
| avoidIds | 38 |
| jitter_or_id_tiebreak | 17 |
| set_b_group_novelty | 14 |
| goal_filtering | 8 |
| condition_filtering | 3 |
| honorable_diversity_or_replacement | 1 |

| Scenario | Set/slot | Selected | Underused candidate | Delta | Cause | Candidate reasons | Selected reasons |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose dirty<br>cold_slow_or_front | B<br>lure_of_the_day | Tube Jig<br>156 | Texas-Rigged Craw<br>172 | -16 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:dirty:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Dworshak / inland northwest SMB reservoir<br>2025-11-15 all_purpose dirty<br>stable_pleasant_high_confidence | B<br>lure_of_the_day | Carolina-Rigged Stick Worm<br>156 | Texas-Rigged Craw<br>172 | -16 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:dirty:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-02-20 big_fish clear<br>cold_slow_or_front | B<br>lure_of_the_day | Football Jig<br>176 | Ned Rig<br>190 | -14 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Trinity Lake northern California SMB water<br>2025-03-30 big_fish clear<br>cold_slow_or_front | B<br>lure_of_the_day | Football Jig<br>176 | Ned Rig<br>190 | -14 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 big_fish clear<br>unclassified | B<br>lure_of_the_day | Football Jig<br>140 | Ned Rig<br>154 | -14 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Dworshak / inland northwest SMB reservoir<br>2025-11-15 big_fish clear<br>stable_pleasant_high_confidence | B<br>lure_of_the_day | Football Jig<br>160 | Ned Rig<br>174 | -14 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-02-20 big_fish clear<br>cold_slow_or_front | B<br>lure_of_the_day | Football Jig<br>176 | Finesse Jig<br>186 | -10 | goal_filtering | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-02-20 big_fish clear<br>cold_slow_or_front | B<br>lure_of_the_day | Football Jig<br>176 | Texas-Rigged Craw<br>186 | -10 | goal_filtering | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Trinity Lake northern California SMB water<br>2025-03-30 big_fish clear<br>cold_slow_or_front | B<br>lure_of_the_day | Football Jig<br>176 | Finesse Jig<br>186 | -10 | goal_filtering | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Trinity Lake northern California SMB water<br>2025-03-30 big_fish clear<br>cold_slow_or_front | B<br>lure_of_the_day | Football Jig<br>176 | Texas-Rigged Craw<br>186 | -10 | goal_filtering | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 big_fish clear<br>unclassified | B<br>lure_of_the_day | Football Jig<br>140 | Finesse Jig<br>150 | -10 | goal_filtering | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 big_fish clear<br>unclassified | B<br>lure_of_the_day | Football Jig<br>140 | Texas-Rigged Craw<br>150 | -10 | goal_filtering | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Dworshak / inland northwest SMB reservoir<br>2025-11-15 big_fish clear<br>stable_pleasant_high_confidence | B<br>lure_of_the_day | Football Jig<br>160 | Finesse Jig<br>170 | -10 | goal_filtering | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Dworshak / inland northwest SMB reservoir<br>2025-11-15 big_fish clear<br>stable_pleasant_high_confidence | B<br>lure_of_the_day | Football Jig<br>160 | Texas-Rigged Craw<br>170 | -10 | goal_filtering | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:big_fish:big_fish_upside:+20<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Lake Champlain SMB water<br>2025-06-21 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Swim Jig<br>154 | Ned Rig<br>162 | -8 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>secondary_forage:baitfish:+6<br>baseline_primary_pace:medium:+10 |
| Table Rock / Ozark clear reservoir<br>2025-09-13 all_purpose stained<br>stable_pleasant_high_confidence | B<br>lure_of_the_day | Drop-Shot Minnow<br>154 | Ned Rig<br>162 | -8 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>goal:all_purpose:reliable_action:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:mid:+10 |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Tube Jig<br>210 | Ned Rig<br>214 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_tube_jig_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Mississippi smallmouth river<br>2025-01-26 big_fish clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Ned Rig<br>174 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Mississippi smallmouth river<br>2025-01-26 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Texas-Rigged Craw<br>178 | Ned Rig<br>182 | -4 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Upper Mississippi smallmouth river<br>2025-01-26 big_fish stained<br>cold_slow_or_front | B<br>lure_of_the_day | Texas-Rigged Craw<br>154 | Ned Rig<br>158 | -4 | avoidIds | base:+100<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Tube Jig<br>210 | Ned Rig<br>214 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_tube_jig_all_purpose:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 all_purpose stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Texas-Rigged Craw<br>204 | Ned Rig<br>208 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 all_purpose dirty<br>dirty_vibration | B<br>lure_of_the_day | Blade Bait<br>184 | Texas-Rigged Craw<br>188 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:dirty:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_blade_bait_cold_reaction:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-02-20 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Texas-Rigged Craw<br>226 | Ned Rig<br>230 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-02-20 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Texas-Rigged Craw<br>210 | Ned Rig<br>214 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-02-20 big_fish stained<br>cold_slow_or_front | B<br>lure_of_the_day | Texas-Rigged Craw<br>170 | Ned Rig<br>174 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-02-20 all_purpose dirty<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>184 | Texas-Rigged Craw<br>188 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:dirty:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_blade_bait_cold_reaction:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 all_purpose stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Spinnerbait<br>172 | Ned Rig<br>176 | -4 | condition_filtering | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>secondary_forage:crawfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:wind_reaction:+16<br>condition_tag:dirty_vibration:+0<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>primary_forage:baitfish:+12<br>baseline_secondary_pace:slow:+6 |
| New River Appalachian SMB context<br>2025-03-26 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>210 | Ned Rig<br>214 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| New River Appalachian SMB context<br>2025-03-26 big_fish clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>170 | Ned Rig<br>174 | -4 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| New River Appalachian SMB context<br>2025-03-26 all_purpose stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Finesse Jig<br>204 | Ned Rig<br>208 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| New River Appalachian SMB context<br>2025-03-26 big_fish stained<br>breezy_windy_stained_reaction | B<br>lure_of_the_day | Texas-Rigged Craw<br>170 | Ned Rig<br>174 | -4 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| New River Appalachian SMB context<br>2025-03-26 all_purpose dirty<br>dirty_vibration | B<br>lure_of_the_day | Blade Bait<br>184 | Texas-Rigged Craw<br>188 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:dirty:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_blade_bait_cold_reaction:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Trinity Lake northern California SMB water<br>2025-03-30 all_purpose clear<br>cold_slow_or_front | B<br>lure_of_the_day | Texas-Rigged Craw<br>226 | Ned Rig<br>230 | -4 | avoidIds | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:clear_subtle:+16<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Trinity Lake northern California SMB water<br>2025-03-30 all_purpose stained<br>cold_slow_or_front | B<br>lure_of_the_day | Texas-Rigged Craw<br>210 | Ned Rig<br>214 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:slow_subtle_all_purpose:+10<br>daily_lane:craw_bottom_all_purpose:+6<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Trinity Lake northern California SMB water<br>2025-03-30 all_purpose dirty<br>cold_slow_or_front | B<br>lure_of_the_day | Blade Bait<br>184 | Texas-Rigged Craw<br>188 | -4 | avoidIds | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_texas_craw:+14<br>clarity_strength:dirty:+8<br>primary_forage:crawfish:+12<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 | base:+100<br>condition_tag:cold_slow:+16<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_blade_bait_cold_reaction:+16<br>clarity_strength:dirty:+8<br>secondary_forage:baitfish:+6<br>baseline_column:bottom:+10<br>baseline_primary_pace:slow:+10 |
| Table Rock / Ozark clear reservoir<br>2025-04-24 all_purpose stained<br>stable_pleasant_high_confidence | B<br>honorable_lure | Weightless Stick Worm<br>158 | Ned Rig<br>162 | -4 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |
| Yampa River mountain-west SMB context<br>2025-05-19 big_fish clear<br>cold_slow_or_front | B<br>lure_of_the_day | Finesse Jig<br>150 | Ned Rig<br>154 | -4 | set_b_group_novelty | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:cold_slow:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Ozark Current River smallmouth context<br>2025-06-14 big_fish clear<br>stable_pleasant_high_confidence | B<br>lure_of_the_day | Finesse Jig<br>150 | Ned Rig<br>154 | -4 | set_b_group_novelty | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 | base:+100<br>condition_tag:clear_subtle:+16<br>daily_lane:smallmouth_finesse_jig:+14<br>clarity_strength:clear:+8<br>primary_forage:crawfish:+12 |
| Colorado mountain-west SMB reservoir<br>2025-06-22 all_purpose stained<br>unclassified | B<br>honorable_lure | Weightless Stick Worm<br>158 | Ned Rig<br>162 | -4 | avoidIds | base:+100<br>goal:all_purpose:reliable_action:+18<br>daily_lane:smallmouth_bottom_finesse_all_purpose:+6<br>daily_lane:smallmouth_ned_finesse:+18<br>clarity_strength:stained:+8<br>primary_forage:crawfish:+12 | base:+100<br>goal:all_purpose:reliable_action:+18<br>goal:all_purpose:versatile_search:+12<br>clarity_strength:stained:+8<br>baseline_column:upper:+10<br>baseline_primary_pace:medium:+10 |

## Underused In Home Windows

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Texas-Rigged Craw<br>texas_rigged_soft_plastic_craw | lure | 12/280 | 4.3% | 148 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:34, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:34, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:24, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:24 | goal_tags:129, raw_score:62, forage_clarity_stack:44, daily_condition_tags:19 | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Tube Jig (top), Suspending Jerkbait (honorable):20, Ned Rig (top), Drop-Shot Minnow (honorable):13, Magnum Jerkbait (top), Big Tube Jig (honorable):11 |
| Finesse Jig<br>finesse_jig | lure | 16/280 | 5.7% | 147 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:34, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:34, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:24, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:24 | goal_tags:130, raw_score:56, forage_clarity_stack:42, daily_condition_tags:19 | Ned Rig (top), Flat-Sided Crankbait (honorable):21, Tube Jig (top), Suspending Jerkbait (honorable):20, Ned Rig (top), Drop-Shot Minnow (honorable):13, Magnum Jerkbait (top), Big Tube Jig (honorable):11 |
| Blade Bait<br>blade_bait | lure | 16/208 | 7.7% | 38 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:30, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:30, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:22, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:22 | goal_tags:87, forage_clarity_stack:58, daily_condition_tags:31, selector_filtering_variety_jitter:12 | Ned Rig (top), Flat-Sided Crankbait (honorable):20, Tube Jig (top), Suspending Jerkbait (honorable):19, Magnum Jerkbait (top), Big Tube Jig (honorable):10, Magnum Jerkbait (honorable), Big Tube Jig (top):9 |
| Paddle-Tail Swimbait<br>paddle_tail_swimbait | lure | 6/204 | 2.9% | 61 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:22, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:22, big_fish / dirty / freshwater_lake_pond / dirty_vibration:22, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:22 | daily_condition_tags:102, goal_tags:55, selector_filtering_variety_jitter:33, seasonal_baseline:6 | Medium-Diving Crankbait (top), Football Jig (honorable):9, Spinnerbait (top), Squarebill Crankbait (honorable):7, Bladed Jig (top), Squarebill Crankbait (honorable):6, Inline Spinner (top), Squarebill Crankbait (honorable):6 |
| Lipless Crankbait<br>lipless_crankbait | lure | 4/152 | 2.6% | 35 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:22, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:22, big_fish / dirty / freshwater_lake_pond / dirty_vibration:22, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:22 | goal_tags:111, forage_clarity_stack:18, seasonal_baseline:9, daily_condition_tags:5 | Bladed Jig (top), Squarebill Crankbait (honorable):6, Medium-Diving Crankbait (top), Football Jig (honorable):6, Spinnerbait (top), Squarebill Crankbait (honorable):6, Blade Bait (honorable), Bladed Jig (top):5 |
| Hair Jig<br>hair_jig | lure | 3/112 | 2.7% | 4 | all_purpose / clear / freshwater_river / cold_slow_or_front:12, big_fish / clear / freshwater_river / cold_slow_or_front:12, all_purpose / stained / freshwater_river / cold_slow_or_front:10, big_fish / stained / freshwater_river / cold_slow_or_front:10 | goal_tags:51, forage_clarity_stack:49, raw_score:5, seasonal_baseline:2 | Ned Rig (top), Flat-Sided Crankbait (honorable):10, Blade Bait (honorable), Bladed Jig (top):5, Magnum Jerkbait (top), Big Tube Jig (honorable):5, Ned Rig (top), Drop-Shot Minnow (honorable):5 |
| Flat-Sided Crankbait<br>flat_sided_crankbait | lure | 0/112 | 0% | 1 | all_purpose / dirty / freshwater_lake_pond / dirty_vibration:14, all_purpose / stained / freshwater_lake_pond / breezy_windy_stained_reaction:14, big_fish / dirty / freshwater_lake_pond / dirty_vibration:14, big_fish / stained / freshwater_lake_pond / breezy_windy_stained_reaction:14 | goal_tags:76, daily_condition_tags:32, forage_clarity_stack:4 | Bladed Jig (top), Squarebill Crankbait (honorable):6, Medium-Diving Crankbait (top), Football Jig (honorable):6, Spinnerbait (top), Squarebill Crankbait (honorable):6, Blade Bait (honorable), Bladed Jig (top):5 |
| Conehead Streamer<br>conehead_streamer | fly | 0/72 | 0% | 19 | all_purpose / dirty / freshwater_river / dirty_vibration:10, big_fish / dirty / freshwater_river / dirty_vibration:10, all_purpose / clear / freshwater_river / cold_slow_or_front:4, big_fish / clear / freshwater_river / cold_slow_or_front:4 | goal_tags:64, raw_score:2, seasonal_baseline:2, selector_filtering_variety_jitter:2 | Muddler Minnow (top), Woolly Bugger (honorable):4, Game Changer (top), Rabbit-Strip Leech (honorable):3, Sculpzilla (honorable), Deer Hair Slider (top):3, Sculpzilla (top), Deer Hair Slider (honorable):3 |
| Bucktail Streamer<br>bucktail_baitfish_streamer | fly | 3/72 | 4.2% | 17 | all_purpose / dirty / freshwater_river / dirty_vibration:10, big_fish / dirty / freshwater_river / dirty_vibration:10, all_purpose / clear / freshwater_river / cold_slow_or_front:4, big_fish / clear / freshwater_river / cold_slow_or_front:4 | goal_tags:62, raw_score:2, seasonal_baseline:2, daily_condition_tags:1 | Muddler Minnow (top), Woolly Bugger (honorable):4, Game Changer (top), Rabbit-Strip Leech (honorable):3, Sculpzilla (honorable), Deer Hair Slider (top):3, Sculpzilla (top), Deer Hair Slider (honorable):3 |

## Over-Dominant Profiles

| Profile | Gear | Home selected/opp | Home rate | Close home losses | Home contexts | Loss causes | Common winners |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Ned Rig<br>ned_rig | lure | 66/232 | 28.4% | 94 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:26, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:26, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:24, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:24 | goal_tags:90, forage_clarity_stack:38, selector_filtering_variety_jitter:30, daily_condition_tags:8 | Tube Jig (top), Suspending Jerkbait (honorable):18, Magnum Jerkbait (top), Big Tube Jig (honorable):11, Magnum Jerkbait (top), Football Jig (honorable):9, Tube Jig (top), Soft Jerkbait (honorable):9 |
| Crawfish Fly<br>warmwater_crawfish_fly | fly | 51/116 | 44% | 47 | all_purpose / clear / freshwater_lake_pond / cold_slow_or_front:18, big_fish / clear / freshwater_lake_pond / cold_slow_or_front:18, all_purpose / stained / freshwater_lake_pond / cold_slow_or_front:16, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:16 | selector_filtering_variety_jitter:36, goal_tags:20, daily_condition_tags:9 | Deer Hair Slider (honorable), Game Changer (top):6, Articulated Baitfish (top), Rabbit-Strip Leech (honorable):4, Clouser Minnow (top), Lead-Eye Leech (honorable):4, Foam Gurgler (top), Articulated Baitfish (honorable):4 |
| Deer Hair Slider<br>deer_hair_slider | fly | 28/108 | 25.9% | 9 | all_purpose / dirty / freshwater_lake_pond / stable_pleasant_high_confidence:6, all_purpose / stained / freshwater_lake_pond / stable_pleasant_high_confidence:6, big_fish / dirty / freshwater_lake_pond / stable_pleasant_high_confidence:6, big_fish / stained / freshwater_lake_pond / stable_pleasant_high_confidence:6 | goal_tags:57, raw_score:20, selector_filtering_variety_jitter:2, forage_clarity_stack:1 | Foam Gurgler (top), Game Changer (honorable):10, Foam Gurgler (top), Articulated Baitfish (honorable):9, Foam Gurgler (top), Clouser Minnow (honorable):6, Foam Gurgler (honorable), Clouser Minnow (top):5 |
| Magnum Jerkbait<br>magnum_jerkbait | lure | 41/80 | 51.3% | 39 | big_fish / clear / freshwater_lake_pond / cold_slow_or_front:16, big_fish / stained / freshwater_lake_pond / cold_slow_or_front:16, big_fish / clear / freshwater_river / cold_slow_or_front:10, big_fish / stained / freshwater_river / cold_slow_or_front:8 | selector_filtering_variety_jitter:33, forage_clarity_stack:4, daily_condition_tags:2 | Compact Glide Bait (top), Football Jig (honorable):6, Ned Rig (top), Flat-Sided Crankbait (honorable):5, Big Tube Jig (top), Compact Glide Bait (honorable):4, Football Jig (top), Drop-Shot Minnow (honorable):2 |

## Home-Window Coverage Gaps

None.

## Top Condition-Tag Winners

| Tag | Goal | Top-pick winners | All-slot winners |
| --- | --- | --- | --- |
| calm_surface | all_purpose | Foam Gurgler [fly] (16), Paddle-Tail Swimbait [lure] (15), Bass Popper [fly] (13), Bladed Jig [lure] (11), Clouser Minnow [fly] (10) | Foam Gurgler [fly] (26), Clouser Minnow [fly] (20), Bass Popper [fly] (19), Paddle-Tail Swimbait [lure] (18), Soft Jerkbait [lure] (15) |
| calm_surface | big_fish | Walking Bait [lure] (21), Foam Gurgler [fly] (19), Deer Hair Slider [fly] (12), Game Changer [fly] (12), Wake Bait [lure] (12) | Deer Hair Slider [fly] (27), Big Tube Jig [lure] (25), Walking Bait [lure] (25), Game Changer [fly] (24), Foam Gurgler [fly] (20) |
| low_light_surface | all_purpose | Bladed Jig [lure] (8), Paddle-Tail Swimbait [lure] (8), Clouser Minnow [fly] (6), Spinnerbait [lure] (6), Foam Gurgler [fly] (5) | Clouser Minnow [fly] (13), Foam Gurgler [fly] (11), Paddle-Tail Swimbait [lure] (10), Soft Jerkbait [lure] (9), Bladed Jig [lure] (8) |
| low_light_surface | big_fish | Game Changer [fly] (11), Buzzbait [lure] (10), Walking Bait [lure] (9), Articulated Baitfish [fly] (6), Big Tube Jig [lure] (6) | Big Tube Jig [lure] (18), Game Changer [fly] (17), Deer Hair Slider [fly] (16), Buzzbait [lure] (15), Walking Bait [lure] (14) |
| wind_reaction | all_purpose | Deceiver [fly] (22), Zonker Streamer [fly] (21), Inline Spinner [lure] (11), Bladed Jig [lure] (10), Blade Bait [lure] (9) | Deceiver [fly] (28), Zonker Streamer [fly] (25), Inline Spinner [lure] (18), Jigged Marabou Leech [fly] (18), Suspending Jerkbait [lure] (18) |
| wind_reaction | big_fish | Articulated Baitfish [fly] (16), Game Changer [fly] (15), Medium-Diving Crankbait [lure] (13), Deceiver [fly] (12), Zonker Streamer [fly] (12) | Rabbit-Strip Leech [fly] (41), Football Jig [lure] (28), Medium-Diving Crankbait [lure] (23), Articulated Baitfish [fly] (21), Big Tube Jig [lure] (20) |
| dirty_vibration | all_purpose | Zonker Streamer [fly] (21), Deceiver [fly] (19), Bladed Jig [lure] (18), Spinnerbait [lure] (12), Blade Bait [lure] (8) | Zonker Streamer [fly] (24), Bladed Jig [lure] (22), Blade Bait [lure] (21), Deceiver [fly] (21), Squarebill Crankbait [lure] (16) |
| dirty_vibration | big_fish | Articulated Baitfish [fly] (16), Game Changer [fly] (13), Buzzbait [lure] (10), Medium-Diving Crankbait [lure] (10), Zonker Streamer [fly] (9) | Rabbit-Strip Leech [fly] (36), Big Tube Jig [lure] (22), Articulated Baitfish [fly] (18), Football Jig [lure] (18), Game Changer [fly] (18) |
| clear_subtle | all_purpose | Ned Rig [lure] (27), Tube Jig [lure] (21), Crawfish Fly [fly] (10), Lead-Eye Leech [fly] (10), Crawfish Streamer [fly] (7) | Ned Rig [lure] (27), Tube Jig [lure] (26), Clouser Minnow [fly] (17), Crawfish Fly [fly] (16), Drop-Shot Minnow [lure] (16) |
| clear_subtle | big_fish | Game Changer [fly] (17), Big Tube Jig [lure] (11), Magnum Jerkbait [lure] (11), Compact Glide Bait [lure] (7), Walking Bait [lure] (7) | Game Changer [fly] (27), Big Tube Jig [lure] (25), Compact Glide Bait [lure] (17), Magnum Jerkbait [lure] (15), Articulated Baitfish [fly] (14) |
| cold_slow | all_purpose | Ned Rig [lure] (31), Tube Jig [lure] (28), Jigged Marabou Leech [fly] (25), Texas-Rigged Craw [lure] (21), Blade Bait [lure] (19) | Woolly Bugger [fly] (51), Suspending Jerkbait [lure] (46), Tube Jig [lure] (35), Clouser Minnow [fly] (33), Ned Rig [lure] (33) |
| cold_slow | big_fish | Big Tube Jig [lure] (28), Rabbit-Strip Leech [fly] (26), Football Jig [lure] (24), Articulated Baitfish [fly] (22), Blade Bait [lure] (17) | Rabbit-Strip Leech [fly] (53), Magnum Jerkbait [lure] (45), Big Tube Jig [lure] (41), Football Jig [lure] (37), Game Changer [fly] (33) |
| warming_search | all_purpose | Paddle-Tail Swimbait [lure] (11), Clouser Minnow [fly] (9), Bladed Jig [lure] (7), Foam Gurgler [fly] (3), Ned Rig [lure] (3) | Paddle-Tail Swimbait [lure] (11), Clouser Minnow [fly] (10), Baitfish Slider [fly] (8), Marabou Jig Leech [fly] (8), Bladed Jig [lure] (7) |
| warming_search | big_fish | Articulated Baitfish [fly] (9), Game Changer [fly] (9), Magnum Jerkbait [lure] (8), Compact Glide Bait [lure] (3), Foam Gurgler [fly] (3) | Big Tube Jig [lure] (11), Game Changer [fly] (11), Articulated Baitfish [fly] (9), Magnum Jerkbait [lure] (9), Football Jig [lure] (6) |
| heat_finesse | all_purpose | None | None |
| heat_finesse | big_fish | None | None |
| current_swing | all_purpose | Bladed Jig [lure] (9), Spinnerbait [lure] (8), Muddler Minnow [fly] (7), Crawfish Streamer [fly] (6), Clouser Minnow [fly] (5) | Clouser Minnow [fly] (12), Blade Bait [lure] (10), Bladed Jig [lure] (10), Crawfish Streamer [fly] (8), Muddler Minnow [fly] (8) |
| current_swing | big_fish | Sculpzilla [fly] (9), Buzzbait [lure] (6), Game Changer [fly] (6), Big Tube Jig [lure] (5), Walking Bait [lure] (5) | Big Tube Jig [lure] (15), Sculpzilla [fly] (15), Game Changer [fly] (12), Deer Hair Slider [fly] (9), Walking Bait [lure] (9) |

## Representative Guide Review Rows

| Scenario | Weather | Daily | Picks | Flags |
| --- | --- | --- | --- | --- |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 clear all_purpose B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+open_water_search, high | Paddle-Tail Swimbait (182); Tube Jig (178); Clouser Minnow (166); Lead-Eye Leech (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 dirty big_fish B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, high | Magnum Jerkbait (166); Football Jig (154); Articulated Baitfish (162); Rabbit-Strip Leech (148) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Mille Lacs / Upper Midwest natural lake<br>2025-07-16 dirty big_fish B | 57.1-64.2F, 14 mph wind, 99.9% cloud, 0.4 in precip | neutral, caution, low_light_surface+wind_reaction+dirty_vibration, high | Bladed Jig (156); Squarebill Crankbait (146); Game Changer (160); Rabbit-Strip Leech (134) | BIG_FISH_NOT_FAVORING_UPSIDE, WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 dirty big_fish B | 55.2-76F, 9.6 mph wind, 72.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration, high | Medium-Diving Crankbait (162); Football Jig (140); Game Changer (154); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Lake Champlain SMB water<br>2025-01-18 clear big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, high | Ned Rig (168); Medium-Diving Crankbait (142); Zonker Streamer (142); Jigged Marabou Leech (144) | BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| New River Appalachian SMB context<br>2025-03-26 clear all_purpose B | 30.3-45F, 10.4 mph wind, 64.7% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow, high | Finesse Jig (210); Suspending Jerkbait (176); Sculpin Streamer (196); Woolly Bugger (162) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_ID_OVERLAP_AVOIDABLE |
| Trinity Lake northern California SMB water<br>2025-03-30 dirty big_fish B | 36.6-46.2F, 4.9 mph wind, 89.4% cloud, 1.2 in precip | suppressed, closed, cold_slow, high | Big Tube Jig (174); Magnum Jerkbait (160); Woolly Bugger (134); Jigged Marabou Leech (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| Trinity Lake northern California SMB water<br>2025-03-30 stained big_fish B | 36.6-46.2F, 4.9 mph wind, 89.4% cloud, 1.2 in precip | suppressed, closed, cold_slow, high | Big Tube Jig (182); Magnum Jerkbait (168); Woolly Bugger (134); Jigged Marabou Leech (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| Yampa River mountain-west SMB context<br>2025-05-19 dirty big_fish B | 37.6-50.1F, 10.4 mph wind, 68.5% cloud, 0 in precip | suppressed, closed, cold_slow, high | Blade Bait (152); Flat-Sided Crankbait (132); Dungeon Streamer (162); Sculpin Streamer (142) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 dirty all_purpose B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, high | Inline Spinner (174); Deep-Diving Crankbait (164); Zonker Streamer (162); Lead-Eye Leech (146) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 stained all_purpose B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, high | Spinnerbait (172); Deep-Diving Crankbait (164); Deceiver (164); Jigged Marabou Leech (146) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Mille Lacs / Upper Midwest natural lake<br>2025-03-20 stained big_fish B | 20.8-44.2F, 10 mph wind, 49% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+open_water_search, high | Big Tube Jig (166); Magnum Jerkbait (174); Game Changer (156); Rabbit-Strip Leech (148) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Mille Lacs / Upper Midwest natural lake<br>2025-05-15 clear big_fish A | 56.4-75.1F, 16 mph wind, 68.1% cloud, 1 in precip | neutral, closed, wind_reaction, high | Magnum Jerkbait (156); Football Jig (140); Game Changer (144); Articulated Baitfish (136) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Table Rock / Ozark clear reservoir<br>2025-06-18 clear big_fish A | 70.5-81.5F, 9.8 mph wind, 66.2% cloud, 0.1 in precip | neutral, caution, wind_reaction+open_water_search, high | Big Tube Jig (152); Compact Glide Bait (184); Articulated Baitfish (168); Baitfish Slider (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Table Rock / Ozark clear reservoir<br>2025-10-20 clear all_purpose B | 47.1-75.5F, 9.8 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+clear_subtle+cold_slow, high | Ned Rig (210); Drop-Shot Minnow (180); Lead-Eye Leech (168); Woolly Bugger (168) | ADJACENT_DAY_EXACT_REPEAT, ADJACENT_DAY_EXACT_REPEAT |
| Table Rock / Ozark clear reservoir<br>2025-10-20 dirty all_purpose B | 47.1-75.5F, 9.8 mph wind, 6.3% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Bladed Jig (180); Texas-Rigged Craw (168); Zonker Streamer (154); Crawfish Fly (160) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, ADJACENT_DAY_EXACT_REPEAT |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 dirty all_purpose B | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Blade Bait (184); Spinnerbait (166); Zonker Streamer (140); Lead-Eye Leech (162) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Dale Hollow / Tennessee highland reservoir<br>2025-02-15 stained big_fish B | 27.4-60.6F, 15.1 mph wind, 100% cloud, 0.8 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Ned Rig (174); Bladed Jig (130); Zonker Streamer (136); Jigged Marabou Leech (144) | BIG_FISH_NOT_FAVORING_UPSIDE, BIG_FISH_NOT_FAVORING_UPSIDE |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 clear big_fish A | 55.2-76F, 9.6 mph wind, 72.6% cloud, 0 in precip | neutral, closed, wind_reaction, high | Magnum Jerkbait (166); Big Tube Jig (152); Game Changer (154); Articulated Baitfish (146) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Dale Hollow / Tennessee highland reservoir<br>2025-03-28 stained big_fish B | 55.2-76F, 9.6 mph wind, 72.6% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration, high | Medium-Diving Crankbait (162); Football Jig (140); Articulated Baitfish (154); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Dale Hollow / Tennessee highland reservoir<br>2025-11-08 stained big_fish B | 33.3-55.7F, 2.9 mph wind, 51.6% cloud, 0.1 in precip | suppressed, closed, cold_slow, high | Football Jig (176); Suspending Jerkbait (130); Woolly Bugger (134); Jigged Marabou Leech (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake Champlain SMB water<br>2025-01-18 dirty all_purpose B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Suspending Jerkbait (174); Texas-Rigged Craw (182); Zonker Streamer (146); Jigged Marabou Leech (162) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake Champlain SMB water<br>2025-01-18 stained big_fish B | 14.2-34.8F, 19 mph wind, 100% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow, high | Ned Rig (168); Medium-Diving Crankbait (142); Articulated Baitfish (146); Jigged Marabou Leech (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake Champlain SMB water<br>2025-12-12 clear big_fish B | 19.8-30.6F, 13.5 mph wind, 63.1% cloud, 0 in precip | suppressed, closed, cold_slow, high | Football Jig (170); Suspending Jerkbait (136); Dungeon Streamer (154); Jigged Marabou Leech (144) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Lake Champlain SMB water<br>2025-12-12 stained big_fish B | 19.8-30.6F, 13.5 mph wind, 63.1% cloud, 0 in precip | suppressed, closed, cold_slow, high | Ned Rig (168); Suspending Jerkbait (136); Dungeon Streamer (162); Lead-Eye Leech (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_ID_OVERLAP_AVOIDABLE |
| Door County / Green Bay smallmouth lake<br>2025-05-23 clear big_fish A | 42.9-55.9F, 9.9 mph wind, 80.1% cloud, 0 in precip | neutral, closed, wind_reaction, high | Football Jig (140); Compact Glide Bait (152); Articulated Baitfish (136); Rabbit-Strip Leech (126) | WIND_NOT_ELEVATING_REACTION, WIND_NOT_ELEVATING_REACTION |
| Door County / Green Bay smallmouth lake<br>2025-05-23 dirty big_fish B | 42.9-55.9F, 9.9 mph wind, 80.1% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration, high | Squarebill Crankbait (150); Compact Glide Bait (144); Articulated Baitfish (144); Rabbit-Strip Leech (134) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Door County / Green Bay smallmouth lake<br>2025-06-21 clear big_fish B | 58-83.1F, 13.5 mph wind, 64.8% cloud, 1.3 in precip | neutral, caution, wind_reaction, high | Big Tube Jig (152); Glide Bait (152); Zonker Streamer (140); Deer Hair Slider (120) | WIND_NOT_ELEVATING_REACTION, SET_B_ID_OVERLAP_AVOIDABLE |
| Door County / Green Bay smallmouth lake<br>2025-12-12 clear big_fish B | -0.8-17.3F, 10.6 mph wind, 88.4% cloud, 0 in precip | neutral, closed, wind_reaction+cold_slow+open_water_search, high | Football Jig (170); Inline Spinner (152); Deceiver (152); Jigged Marabou Leech (144) | BIG_FISH_NOT_FAVORING_UPSIDE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Door County / Green Bay smallmouth lake<br>2025-12-12 dirty all_purpose B | -0.8-17.3F, 10.6 mph wind, 88.4% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+open_water_search, high | Suspending Jerkbait (174); Texas-Rigged Craw (182); Deceiver (164); Jigged Marabou Leech (162) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Door County / Green Bay smallmouth lake<br>2025-12-12 stained all_purpose B | -0.8-17.3F, 10.6 mph wind, 88.4% cloud, 0 in precip | neutral, closed, wind_reaction+dirty_vibration+cold_slow+open_water_search, high | Tube Jig (204); Bladed Jig (166); Deceiver (164); Jigged Marabou Leech (172) | SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE, SET_B_SAME_FAMILY_SAME_PRESENTATION_AVOIDABLE |
| Upper Mississippi smallmouth river<br>2025-09-29 dirty big_fish B | 58.9-83.6F, 4.1 mph wind, 23.9% cloud, 0 in precip | neutral, open, calm_surface, high | Walking Bait (164); Big Tube Jig (144); Mouse Pattern (154); Articulated Baitfish (154) | SET_B_ID_OVERLAP_AVOIDABLE, SET_B_SAME_FAMILY_DIFFERENT_PRESENTATION_AVOIDABLE |

## Known Coverage Gaps

- heat_limited_finesse: not naturally produced by completed archive rows.
- stable_pleasant_medium_confidence_archive: not naturally produced by completed archive rows.
- missing_or_low_confidence_inputs: not naturally produced by completed archive rows.
- adjacent_day_similar: not naturally produced by completed archive rows.

## Skipped Weather Scenarios

None.
