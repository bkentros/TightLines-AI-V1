# Smallmouth V3 Matrix Review Sheet

Generated: 2026-04-05T16:22:05.449Z
Archive bundle generated: 2026-04-05T15:44:56.004Z
Scenario count: 83
Contexts: 36 lake/pond, 47 river
Priority mix: 48 core, 35 secondary
Completed engine runs: 83/83

This sheet is the scoring surface for the freshwater V3 recommender audit batch.
It supports archive-backed engine runs, real top-3 output capture, and lightweight precheck flags before manual scoring.

Scoring rubric:
- 2 = clearly right
- 1 = acceptable but not ideal
- 0 = wrong or concerning

Required score keys:
- seasonal_fit
- daily_fit
- water_column_fit
- archetype_fit
- color_fit
- top3_variety
- boundedness

## smb_matrix_great_lakes_clear_lake_01

- Label: Great Lakes clear natural lake, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Clear Great Lakes smallmouth winter should stay disciplined with tubes, hair, and jerkbait lanes in front.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- drop_shot_worm_minnow
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
- frog_fly
Expected color themes:
- green_pumpkin_natural
- natural_baitfish
- craw_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 27.8 F
- Noon pressure: 1005.3 mb
- Noon cloud cover: 100%
- Daily high/low: 36.2 / 19.3 F
- Daily wind max: 21.2 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 08:10 / 17:26

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 65 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_02

- Label: Great Lakes clear natural lake, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Clear prespawn Great Lakes smallmouth should open jerkbait and tube lanes without drifting too aggressive too early.
Expected primary lanes:
- tube_jig
- suspending_jerkbait
- hair_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- football_jig
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 13.8 F
- Noon pressure: 1031.8 mb
- Noon cloud cover: 100%
- Daily high/low: 18.2 / 5.1 F
- Daily wind max: 13.8 mph
- Daily precip: 0.06692913385826772 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:30 / 18:13

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Drop-Shot Worm / Minnow: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 39 (Poor)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=bottom, mood=negative, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_03

- Label: Great Lakes clear natural lake, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Clear prespawn Great Lakes smallmouth should open jerkbait and tube lanes without drifting too aggressive too early.
Expected primary lanes:
- tube_jig
- suspending_jerkbait
- hair_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- football_jig
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 29.3 F
- Noon pressure: 1006 mb
- Noon cloud cover: 100%
- Daily high/low: 31.5 / 21.8 F
- Daily wind max: 17.5 mph
- Daily precip: 0.26377952755905515 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:39 / 19:52

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Drop-Shot Worm / Minnow: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 37 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=negative, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_04

- Label: Great Lakes clear natural lake, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Spawn and immediate postspawn clear-lake smallmouth should mix tube, drop-shot, and baitfish lanes with one clean surface option only when supported.
Expected primary lanes:
- tube_jig
- drop_shot_worm_minnow
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- walking_topwater
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 39 F
- Noon pressure: 1019.3 mb
- Noon cloud cover: 0%
- Daily high/low: 41.1 / 27.6 F
- Daily wind max: 15.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:49 / 20:27

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural_baitfish` | colors: ghost shad, smoke shad, olive shad
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Flat-Sided Crankbait: Theme: natural baitfish. Try ghost shad, smoke shad, olive shad.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 38 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=negative, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_05

- Label: Great Lakes clear natural lake, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Spawn and immediate postspawn clear-lake smallmouth should mix tube, drop-shot, and baitfish lanes with one clean surface option only when supported.
Expected primary lanes:
- tube_jig
- drop_shot_worm_minnow
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- walking_topwater
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 73.1 F
- Noon pressure: 1005.4 mb
- Noon cloud cover: 15%
- Daily high/low: 78.1 / 56.6 F
- Daily wind max: 13.9 mph
- Daily precip: 0.01968503937007874 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:07 / 21:03

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Medium-Diving Crankbait `medium_diving_crankbait` | theme: `white_shad` | colors: sexy shad, pearl shad, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Medium-Diving Crankbait: Theme: white shad. Try sexy shad, pearl shad, white/silver.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 63 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_06

- Label: Great Lakes clear natural lake, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Early-summer clear Great Lakes smallmouth can legitimately open with a soft jerkbait or swimbait around a postspawn baitfish shift, while still keeping drop-shot and hair support in play.
Expected primary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- drop_shot_worm_minnow
Acceptable secondary lanes:
- hair_jig
- tube_jig
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 66.7 F
- Noon pressure: 1011 mb
- Noon cloud cover: 100%
- Daily high/low: 70.1 / 59.9 F
- Daily wind max: 7.1 mph
- Daily precip: 0.5511811023622047 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:49 / 21:30

Actual output:
- Top 1 lure: Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 59 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_07

- Label: Great Lakes clear natural lake, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Summer clear-lake smallmouth should rotate between baitfish and finesse lanes, with topwater as a controlled option rather than a default overreaction.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm_minnow
- hair_jig
Acceptable secondary lanes:
- walking_topwater
- tube_jig
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural
- craw_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 81.9 F
- Noon pressure: 1010.7 mb
- Noon cloud cover: 19%
- Daily high/low: 84.3 / 67.8 F
- Daily wind max: 10.1 mph
- Daily precip: 1.1377952755905512 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:05 / 21:23

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Color notes:
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Daily profile notes:
- Shared score: 61 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_08

- Label: Great Lakes clear natural lake, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Summer clear-lake smallmouth should rotate between baitfish and finesse lanes, with topwater as a controlled option rather than a default overreaction.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm_minnow
- hair_jig
Acceptable secondary lanes:
- walking_topwater
- tube_jig
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural
- craw_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 72.6 F
- Noon pressure: 1019.2 mb
- Noon cloud cover: 0%
- Daily high/low: 76.6 / 55 F
- Daily wind max: 8.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:38 / 20:48

Actual output:
- Top 1 lure: Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 lures:
- Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Hair Jig / Marabou Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 66 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:craw_natural,craw_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_09

- Label: Great Lakes clear natural lake, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Great Lakes fall smallmouth should tighten around jerkbait, swimbait, and hair / blade lanes with clean baitfish colors.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- hair_jig
Acceptable secondary lanes:
- blade_bait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 74 F
- Noon pressure: 1019.5 mb
- Noon cloud cover: 36%
- Daily high/low: 78 / 57.9 F
- Daily wind max: 7.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:18 / 19:47

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 68 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_10

- Label: Great Lakes clear natural lake, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Great Lakes fall smallmouth should tighten around jerkbait, swimbait, and hair / blade lanes with clean baitfish colors.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- hair_jig
Acceptable secondary lanes:
- blade_bait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 51.6 F
- Noon pressure: 1027.1 mb
- Noon cloud cover: 5%
- Daily high/low: 56.6 / 41.5 F
- Daily wind max: 7.1 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:53 / 18:55

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 44 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_11

- Label: Great Lakes clear natural lake, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Great Lakes fall smallmouth should tighten around jerkbait, swimbait, and hair / blade lanes with clean baitfish colors.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- hair_jig
Acceptable secondary lanes:
- blade_bait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 38.9 F
- Noon pressure: 1004.3 mb
- Noon cloud cover: 100%
- Daily high/low: 44.5 / 34.7 F
- Daily wind max: 18.8 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:31 / 17:14

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 65 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_great_lakes_clear_lake_12

- Label: Great Lakes clear natural lake, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: MI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 45.0727, -84.6748
- Engine status: complete

Expected seasonal story:
- Clear Great Lakes smallmouth winter should stay disciplined with tubes, hair, and jerkbait lanes in front.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- drop_shot_worm_minnow
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
- frog_fly
Expected color themes:
- green_pumpkin_natural
- natural_baitfish
- craw_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Detroit
- Noon air temp: 24.4 F
- Noon pressure: 1000.8 mb
- Noon cloud cover: 100%
- Daily high/low: 22.9 / 9.3 F
- Daily wind max: 13.6 mph
- Daily precip: 0.03937007874015748 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 08:04 / 16:58

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Drop-Shot Worm / Minnow: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 58 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=bottom, mood=neutral, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_01

- Label: Kentucky highland lake, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Highland winter smallmouth should stay lower-column and disciplined, but still allow jerkbait and hair-jig lanes.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- flat_sided_crankbait
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- green_pumpkin_natural
- white_shad
- natural_baitfish

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 45.8 F
- Noon pressure: 1017.9 mb
- Noon cloud cover: 0%
- Daily high/low: 54.3 / 27.4 F
- Daily wind max: 16.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:55 / 16:55

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Blade Bait `blade_bait` | theme: `bright_contrast` | colors: firetiger, chartreuse chrome, orange/chartreuse
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Blade Bait: Theme: bright contrast. Try firetiger, chartreuse chrome, orange/chartreuse.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 41 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_02

- Label: Kentucky highland lake, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Windy stained prespawn smallmouth lakes should keep tube, jerkbait, and swimbait lanes in front.
Expected primary lanes:
- tube_jig
- suspending_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- flat_sided_crankbait
- hair_jig
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait_prop_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 22.2 F
- Noon pressure: 1029.7 mb
- Noon cloud cover: 100%
- Daily high/low: 18.7 / 9.8 F
- Daily wind max: 13.4 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:27 / 17:31

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Blade Bait `blade_bait` | theme: `bright_contrast` | colors: firetiger, chartreuse chrome, orange/chartreuse
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Blade Bait: Theme: bright contrast. Try firetiger, chartreuse chrome, orange/chartreuse.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 42 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_03

- Label: Kentucky highland lake, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Windy stained prespawn smallmouth lakes should keep tube, jerkbait, and swimbait lanes in front.
Expected primary lanes:
- tube_jig
- suspending_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- flat_sided_crankbait
- hair_jig
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait_prop_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 42.2 F
- Noon pressure: 1014.5 mb
- Noon cloud cover: 100%
- Daily high/low: 56.2 / 36.4 F
- Daily wind max: 18.4 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:46 / 18:58

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Flat-Sided Crankbait: Theme: white shad. Try white, pearl, white/silver.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 35 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_04

- Label: Kentucky highland lake, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Late-spring stained smallmouth lakes should let tube, swimbait, and spinnerbait lanes work without turning into generic largemouth cover fishing.
Expected primary lanes:
- tube_jig
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- soft_jerkbait
- flat_sided_crankbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 62.2 F
- Noon pressure: 1021.4 mb
- Noon cloud cover: 0%
- Daily high/low: 64.5 / 40.8 F
- Daily wind max: 7.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:07 / 19:22

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Flat-Sided Crankbait: Theme: white shad. Try white, pearl, white/silver.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 38 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_05

- Label: Kentucky highland lake, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Late-spring stained smallmouth lakes should let tube, swimbait, and spinnerbait lanes work without turning into generic largemouth cover fishing.
Expected primary lanes:
- tube_jig
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- soft_jerkbait
- flat_sided_crankbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 79.5 F
- Noon pressure: 1007.4 mb
- Noon cloud cover: 75%
- Daily high/low: 86.1 / 68.4 F
- Daily wind max: 15.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:35 / 19:48

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 67 (Good)
- Daily nudges: mood=up_2, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_06

- Label: Kentucky highland lake, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Summer stained highland smallmouth should still stay clean and open-water enough to support swimbait and spinnerbait behavior.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- walking_topwater
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 80.2 F
- Noon pressure: 1014.9 mb
- Noon cloud cover: 100%
- Daily high/low: 84.8 / 71.3 F
- Daily wind max: 16.2 mph
- Daily precip: 0.2795275590551181 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:24 / 20:09

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 53 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_07

- Label: Kentucky highland lake, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Summer stained highland smallmouth should still stay clean and open-water enough to support swimbait and spinnerbait behavior.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- walking_topwater
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 88.2 F
- Noon pressure: 1015.5 mb
- Noon cloud cover: 26%
- Daily high/low: 92 / 73.5 F
- Daily wind max: 10.4 mph
- Daily precip: 0.1968503937007874 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:37 / 20:05

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Top 3 flies:
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 76 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_08

- Label: Kentucky highland lake, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Summer stained highland smallmouth should still stay clean and open-water enough to support swimbait and spinnerbait behavior.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- walking_topwater
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 87.7 F
- Noon pressure: 1015.8 mb
- Noon cloud cover: 23%
- Daily high/low: 90 / 72.7 F
- Daily wind max: 4.3 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:00 / 19:39

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Top 3 flies:
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 67 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_09

- Label: Kentucky highland lake, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Highland fall smallmouth should move toward jerkbait, swimbait, and spinnerbait lanes with shad-forward colors.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- hair_jig
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 84.7 F
- Noon pressure: 1017.7 mb
- Noon cloud cover: 10%
- Daily high/low: 87.9 / 65.7 F
- Daily wind max: 7.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:28 / 18:51

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 64 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_10

- Label: Kentucky highland lake, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Highland fall smallmouth should move toward jerkbait, swimbait, and spinnerbait lanes with shad-forward colors.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- hair_jig
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 72.2 F
- Noon pressure: 1021.4 mb
- Noon cloud cover: 0%
- Daily high/low: 77.9 / 53.7 F
- Daily wind max: 7.9 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:52 / 18:10

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `bright_contrast` | colors: white/chartreuse, yellow/white, chartreuse/olive
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Slim Minnow Streamer: Theme: bright contrast. Try white/chartreuse, yellow/white, chartreuse/olive.
- Daily profile notes:
- Shared score: 73 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_11

- Label: Kentucky highland lake, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Highland fall smallmouth should move toward jerkbait, swimbait, and spinnerbait lanes with shad-forward colors.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- hair_jig
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- white_shad
- natural_baitfish
- bright_contrast

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 61.5 F
- Noon pressure: 1019.7 mb
- Noon cloud cover: 0%
- Daily high/low: 63.3 / 38 F
- Daily wind max: 6.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:19 / 16:39

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `bright_contrast` | colors: white/chartreuse, yellow/white, chartreuse/olive
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Slim Minnow Streamer: Theme: bright contrast. Try white/chartreuse, yellow/white, chartreuse/olive.
- Daily profile notes:
- Shared score: 55 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_kentucky_highland_lake_12

- Label: Kentucky highland lake, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: KY
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 36.9156, -86.3922
- Engine status: complete

Expected seasonal story:
- Highland winter smallmouth should stay lower-column and disciplined, but still allow jerkbait and hair-jig lanes.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- flat_sided_crankbait
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- green_pumpkin_natural
- white_shad
- natural_baitfish

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 45.3 F
- Noon pressure: 1005.1 mb
- Noon cloud cover: 36%
- Daily high/low: 39.3 / 25.8 F
- Daily wind max: 10.8 mph
- Daily precip: 0.09448818897637795 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:46 / 16:30

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Conehead Bugger / Streamer `conehead_streamer` | theme: `dark_contrast` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Conehead Bugger / Streamer: Theme: dark contrast. Try black, black/blue, black/purple.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 60 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_01

- Label: Tennessee current river, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Winter Tennessee smallmouth should stay current-aware and controlled with tube, hair, and Ned lanes.
Expected primary lanes:
- tube_jig
- hair_jig
- ned_rig
Acceptable secondary lanes:
- blade_bait
- suspending_jerkbait
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
- buzzbait_prop_bait
Expected color themes:
- green_pumpkin_natural
- natural_baitfish
- craw_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 46.8 F
- Noon pressure: 1020.5 mb
- Noon cloud cover: 14%
- Daily high/low: 51.9 / 24.9 F
- Daily wind max: 11.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:45 / 17:52

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 68 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=mid, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_02

- Label: Tennessee current river, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Prespawn stained river smallmouth should open spinnerbait and soft-minnow lanes while staying seam- and rock-aware.
Expected primary lanes:
- spinnerbait
- tube_jig
- soft_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait_prop_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 37.9 F
- Noon pressure: 1024.5 mb
- Noon cloud cover: 100%
- Daily high/low: 26.4 / 19.5 F
- Daily wind max: 13.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:18 / 18:26

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Blade Bait `blade_bait` | theme: `bright_contrast` | colors: firetiger, chartreuse chrome, orange/chartreuse
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Blade Bait: Theme: bright contrast. Try firetiger, chartreuse chrome, orange/chartreuse.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 45 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_03

- Label: Tennessee current river, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Prespawn stained river smallmouth should open spinnerbait and soft-minnow lanes while staying seam- and rock-aware.
Expected primary lanes:
- spinnerbait
- tube_jig
- soft_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait_prop_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 48.7 F
- Noon pressure: 1012.8 mb
- Noon cloud cover: 100%
- Daily high/low: 67.6 / 40.6 F
- Daily wind max: 21.2 mph
- Daily precip: 0.1220472440944882 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:40 / 19:51

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Ned Rig `ned_rig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Ned Rig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 35 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_04

- Label: Tennessee current river, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Late-spring river smallmouth should carry tube control plus clean seam-search lanes like soft jerkbait and inline spinner.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- spinnerbait
- squarebill_crankbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 59.5 F
- Noon pressure: 1021.8 mb
- Noon cloud cover: 0%
- Daily high/low: 65.7 / 40 F
- Daily wind max: 6.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:02 / 20:13

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Ned Rig `ned_rig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Ned Rig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 46 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_05

- Label: Tennessee current river, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Late-spring river smallmouth should carry tube control plus clean seam-search lanes like soft jerkbait and inline spinner.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- spinnerbait
- squarebill_crankbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 75 F
- Noon pressure: 1011.7 mb
- Noon cloud cover: 100%
- Daily high/low: 81.8 / 64.7 F
- Daily wind max: 14.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:32 / 20:37

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse black back, chartreuse blue
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Squarebill Crankbait: Theme: bright contrast. Try firetiger, chartreuse black back, chartreuse blue.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 66 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_06

- Label: Tennessee current river, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Summer stained river smallmouth should lean current-edge search tools like inline spinner, spinnerbait, and controlled topwater.
Expected primary lanes:
- inline_spinner
- spinnerbait
- walking_topwater
Acceptable secondary lanes:
- soft_jerkbait
- tube_jig
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- bright_contrast
- white_shad
- metal_flash

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 79.9 F
- Noon pressure: 1018.6 mb
- Noon cloud cover: 55%
- Daily high/low: 83 / 68.6 F
- Daily wind max: 14.2 mph
- Daily precip: 0.047244094488188976 in
- Moon phase: n/a
- Sunrise/sunset: n/a / n/a

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/black, firetiger
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/black, firetiger
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Top 3 flies:
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Inline Spinner: Theme: bright contrast. Try white/chartreuse, chartreuse/black, firetiger.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 50 (Fair)
- Daily nudges: mood=neutral, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_07

- Label: Tennessee current river, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Summer stained river smallmouth should lean current-edge search tools like inline spinner, spinnerbait, and controlled topwater.
Expected primary lanes:
- inline_spinner
- spinnerbait
- walking_topwater
Acceptable secondary lanes:
- soft_jerkbait
- tube_jig
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- bright_contrast
- white_shad
- metal_flash

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 86.4 F
- Noon pressure: 1018.2 mb
- Noon cloud cover: 24%
- Daily high/low: 91.8 / 73.7 F
- Daily wind max: 9.1 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: n/a
- Sunrise/sunset: n/a / n/a

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/black, firetiger
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/black, firetiger
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Top 3 flies:
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Inline Spinner: Theme: bright contrast. Try white/chartreuse, chartreuse/black, firetiger.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 66 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_08

- Label: Tennessee current river, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Summer stained river smallmouth should lean current-edge search tools like inline spinner, spinnerbait, and controlled topwater.
Expected primary lanes:
- inline_spinner
- spinnerbait
- walking_topwater
Acceptable secondary lanes:
- soft_jerkbait
- tube_jig
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- bright_contrast
- white_shad
- metal_flash

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 80.4 F
- Noon pressure: 1017 mb
- Noon cloud cover: 85%
- Daily high/low: 87.2 / 71.7 F
- Daily wind max: 6.3 mph
- Daily precip: 0.03149606299212599 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:56 / 20:30

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/black, firetiger
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/black, firetiger
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Inline Spinner: Theme: bright contrast. Try white/chartreuse, chartreuse/black, firetiger.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 42 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright_contrast,bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_09

- Label: Tennessee current river, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Fall Tennessee smallmouth should shift toward jerkbait, spinnerbait, and swimbait lanes with current still respected.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 77.4 F
- Noon pressure: 1018.4 mb
- Noon cloud cover: 12%
- Daily high/low: 83.4 / 63.8 F
- Daily wind max: 6 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:22 / 19:43

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 64 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_10

- Label: Tennessee current river, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Fall Tennessee smallmouth should shift toward jerkbait, spinnerbait, and swimbait lanes with current still respected.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 72.1 F
- Noon pressure: 1020.3 mb
- Noon cloud cover: 0%
- Daily high/low: 82.2 / 55.3 F
- Daily wind max: 12.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:44 / 19:04

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `bright_contrast` | colors: white/chartreuse, yellow/white, chartreuse/olive
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Slim Minnow Streamer: Theme: bright contrast. Try white/chartreuse, yellow/white, chartreuse/olive.
- Daily profile notes:
- Shared score: 77 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_11

- Label: Tennessee current river, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Fall Tennessee smallmouth should shift toward jerkbait, spinnerbait, and swimbait lanes with current still respected.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 55.1 F
- Noon pressure: 1022.2 mb
- Noon cloud cover: 0%
- Daily high/low: 65.9 / 35.4 F
- Daily wind max: 5.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:10 / 17:35

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Slim Minnow Streamer `slim_minnow_streamer` | theme: `bright_contrast` | colors: white/chartreuse, yellow/white, chartreuse/olive
- Top 3 flies:
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `bright_contrast` | colors: white/chartreuse, yellow/white, chartreuse/olive
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Slim Minnow Streamer: Theme: bright contrast. Try white/chartreuse, yellow/white, chartreuse/olive.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Daily profile notes:
- Shared score: 59 (Fair)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_tennessee_river_12

- Label: Tennessee current river, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.3973, -84.6705
- Engine status: complete

Expected seasonal story:
- Winter Tennessee smallmouth should stay current-aware and controlled with tube, hair, and Ned lanes.
Expected primary lanes:
- tube_jig
- hair_jig
- ned_rig
Acceptable secondary lanes:
- blade_bait
- suspending_jerkbait
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
- buzzbait_prop_bait
Expected color themes:
- green_pumpkin_natural
- natural_baitfish
- craw_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 48.1 F
- Noon pressure: 1007.5 mb
- Noon cloud cover: 5%
- Daily high/low: 46.2 / 33.9 F
- Daily wind max: 10.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:35 / 17:27

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Conehead Bugger / Streamer `conehead_streamer` | theme: `dark_contrast` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Conehead Bugger / Streamer: Theme: dark contrast. Try black, black/blue, black/purple.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 69 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_01

- Label: Pennsylvania clear river, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Clear northern river smallmouth winter should stay lower-column and subtle with tube, hair, and jerkbait control.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- drop_shot_worm_minnow
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 18.4 F
- Noon pressure: 1010.2 mb
- Noon cloud cover: 100%
- Daily high/low: 31.2 / 21.4 F
- Daily wind max: 14.5 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:33 / 17:06

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Drop-Shot Worm / Minnow: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 51 (Fair)
- Daily nudges: mood=up_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=neutral, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_02

- Label: Pennsylvania clear river, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Clear prespawn river smallmouth should open tube, Ned, and soft-minnow lanes while staying current-correct.
Expected primary lanes:
- tube_jig
- ned_rig
- soft_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait_prop_bait
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 13.6 F
- Noon pressure: 1030.2 mb
- Noon cloud cover: 100%
- Daily high/low: 15.9 / 7 F
- Daily wind max: 18 mph
- Daily precip: 0.08661417322834647 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:58 / 17:49

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 41 (Fair)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=mid, mood=neutral, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_03

- Label: Pennsylvania clear river, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Clear prespawn river smallmouth should open tube, Ned, and soft-minnow lanes while staying current-correct.
Expected primary lanes:
- tube_jig
- ned_rig
- soft_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- buzzbait_prop_bait
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 52.7 F
- Noon pressure: 1001.4 mb
- Noon cloud cover: 100%
- Daily high/low: 53.8 / 32.6 F
- Daily wind max: 20.5 mph
- Daily precip: 0.08267716535433071 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:11 / 19:23

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 78 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=mid, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_04

- Label: Pennsylvania clear river, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Late-spring clear river smallmouth should keep seam and rock behavior in front, not generic lake power.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- paddle_tail_swimbait
- spinnerbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 33.7 F
- Noon pressure: 1012.2 mb
- Noon cloud cover: 100%
- Daily high/low: 36 / 30 F
- Daily wind max: 22.3 mph
- Daily precip: 0.027559055118110236 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:25 / 19:54

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 44 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_05

- Label: Pennsylvania clear river, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Late-spring clear river smallmouth should keep seam and rock behavior in front, not generic lake power.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- paddle_tail_swimbait
- spinnerbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 66.6 F
- Noon pressure: 1011.2 mb
- Noon cloud cover: 48%
- Daily high/low: 71.6 / 55.5 F
- Daily wind max: 8.8 mph
- Daily precip: 0.16141732283464566 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:47 / 20:25

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Squarebill Crankbait `squarebill_crankbait` | theme: `white_shad` | colors: sexy shad, pearl shad, white chart back
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Squarebill Crankbait: Theme: white shad. Try sexy shad, pearl shad, white chart back.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 73 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_06

- Label: Pennsylvania clear river, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Early-summer clear northern river smallmouth should still carry spring-to-early-summer control and current-search behavior rather than fully shifting into pure surface play.
Expected primary lanes:
- tube_jig
- squarebill_crankbait
- suspending_jerkbait
Acceptable secondary lanes:
- soft_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- green_pumpkin_natural
- white_shad
- natural_baitfish

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 75.7 F
- Noon pressure: 1012.1 mb
- Noon cloud cover: 98%
- Daily high/low: 78.6 / 64.9 F
- Daily wind max: 9.8 mph
- Daily precip: 0.2283464566929134 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:32 / 20:50

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Squarebill Crankbait `squarebill_crankbait` | theme: `white_shad` | colors: sexy shad, pearl shad, white chart back
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Squarebill Crankbait: Theme: white shad. Try sexy shad, pearl shad, white chart back.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 63 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_07

- Label: Pennsylvania clear river, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Early-summer clear northern river smallmouth should still carry spring-to-early-summer control and current-search behavior rather than fully shifting into pure surface play.
Expected primary lanes:
- tube_jig
- squarebill_crankbait
- suspending_jerkbait
Acceptable secondary lanes:
- soft_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- green_pumpkin_natural
- white_shad
- natural_baitfish

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 82.6 F
- Noon pressure: 1015.9 mb
- Noon cloud cover: 100%
- Daily high/low: 83.1 / 67 F
- Daily wind max: 9.5 mph
- Daily precip: 0.2874015748031496 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:47 / 20:45

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Muddler-Style Sculpin `muddler_sculpin` | theme: `natural_baitfish` | colors: natural, olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Muddler-Style Sculpin: Theme: natural baitfish. Try natural, olive, tan/olive.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Daily profile notes:
- Shared score: 60 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_08

- Label: Pennsylvania clear river, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Early-summer clear northern river smallmouth should still carry spring-to-early-summer control and current-search behavior rather than fully shifting into pure surface play.
Expected primary lanes:
- tube_jig
- squarebill_crankbait
- suspending_jerkbait
Acceptable secondary lanes:
- soft_jerkbait
- inline_spinner
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- green_pumpkin_natural
- white_shad
- natural_baitfish

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 79.6 F
- Noon pressure: 1016.1 mb
- Noon cloud cover: 15%
- Daily high/low: 81.9 / 64 F
- Daily wind max: 10.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:16 / 20:13

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Muddler-Style Sculpin `muddler_sculpin` | theme: `natural_baitfish` | colors: natural, olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Muddler-Style Sculpin: Theme: natural baitfish. Try natural, olive, tan/olive.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Daily profile notes:
- Shared score: 58 (Fair)
- Daily nudges: mood=neutral, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_09

- Label: Pennsylvania clear river, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Late-fall clear northern river smallmouth should still respect baitfish lanes, but with a stronger tube and hair safety net than southern fall river rows.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- blade_bait
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- green_pumpkin_natural
- natural_baitfish
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 69.6 F
- Noon pressure: 1020 mb
- Noon cloud cover: 95%
- Daily high/low: 75.5 / 53.4 F
- Daily wind max: 8.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:51 / 19:17

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 85 (Excellent)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_10

- Label: Pennsylvania clear river, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Late-fall clear northern river smallmouth should still respect baitfish lanes, but with a stronger tube and hair safety net than southern fall river rows.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- blade_bait
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- green_pumpkin_natural
- natural_baitfish
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 51.6 F
- Noon pressure: 1020.5 mb
- Noon cloud cover: 17%
- Daily high/low: 54.2 / 40.5 F
- Daily wind max: 11.7 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:21 / 18:29

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 60 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_11

- Label: Pennsylvania clear river, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Late-fall clear northern river smallmouth should still respect baitfish lanes, but with a stronger tube and hair safety net than southern fall river rows.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- blade_bait
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- green_pumpkin_natural
- natural_baitfish
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 38.2 F
- Noon pressure: 1004.9 mb
- Noon cloud cover: 100%
- Daily high/low: 38.9 / 33 F
- Daily wind max: 22 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:55 / 16:53

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 66 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_pennsylvania_river_12

- Label: Pennsylvania clear river, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.9912, -77.5542
- Engine status: complete

Expected seasonal story:
- Clear northern river smallmouth winter should stay lower-column and subtle with tube, hair, and jerkbait control.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- drop_shot_worm_minnow
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 33.4 F
- Noon pressure: 993.9 mb
- Noon cloud cover: 100%
- Daily high/low: 25.8 / 13.3 F
- Daily wind max: 17.8 mph
- Daily precip: 0.06692913385826772 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:25 / 16:40

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 68 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_wisconsin_natural_lake_05

- Label: Wisconsin natural lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin clear-lake spawn and postspawn should keep tube, drop-shot, and clean baitfish lanes in front.
Expected primary lanes:
- tube_jig
- drop_shot_worm_minnow
- paddle_tail_swimbait
Acceptable secondary lanes:
- hair_jig
- soft_jerkbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 75.6 F
- Noon pressure: 1000.2 mb
- Noon cloud cover: 16%
- Daily high/low: 81.1 / 56.2 F
- Daily wind max: 19.4 mph
- Daily precip: 0.4921259842519685 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:23 / 20:25

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural_baitfish` | colors: ghost shad, smoke shad, olive shad
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Flat-Sided Crankbait: Theme: natural baitfish. Try ghost shad, smoke shad, olive shad.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 60 (Good)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_wisconsin_natural_lake_06

- Label: Wisconsin natural lake, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin early-summer natural-lake smallmouth can open with a soft jerkbait around a clean baitfish shift, but should still keep tube, drop-shot, and hair control nearby.
Expected primary lanes:
- soft_jerkbait
- drop_shot_worm_minnow
- tube_jig
Acceptable secondary lanes:
- hair_jig
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 76.6 F
- Noon pressure: 1008.9 mb
- Noon cloud cover: 100%
- Daily high/low: 77.7 / 57.7 F
- Daily wind max: 8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:04 / 20:53

Actual output:
- Top 1 lure: Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 87 (Excellent)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_wisconsin_natural_lake_08

- Label: Wisconsin natural lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin summer natural-lake smallmouth should still favor finesse and clean baitfish lanes even when surface windows exist.
Expected primary lanes:
- drop_shot_worm_minnow
- tube_jig
- hair_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- walking_topwater
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural
- craw_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 74.7 F
- Noon pressure: 1016.3 mb
- Noon cloud cover: 2%
- Daily high/low: 80.1 / 55.6 F
- Daily wind max: 10.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:55 / 20:09

Actual output:
- Top 1 lure: Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 lures:
- Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Hair Jig / Marabou Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 79 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:craw_natural,craw_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_wisconsin_natural_lake_10

- Label: Wisconsin natural lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: WI
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.0481, -89.486
- Engine status: complete

Expected seasonal story:
- Wisconsin clear-lake fall smallmouth should move toward jerkbait, swimbait, and hair / blade lanes.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- hair_jig
Acceptable secondary lanes:
- blade_bait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 51.5 F
- Noon pressure: 1027.1 mb
- Noon cloud cover: 8%
- Daily high/low: 56.7 / 41.8 F
- Daily wind max: 3.4 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:14 / 18:13

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 51 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_minnesota_fall_lake_04

- Label: Minnesota northern lake, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Spring northern stained-lake smallmouth should still stay controlled around tube, hair, and jerkbait lanes rather than forcing a pure fall baitfish read too early.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- flat_sided_crankbait
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- green_pumpkin_natural
- natural_baitfish
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 48.5 F
- Noon pressure: 1016 mb
- Noon cloud cover: 80%
- Daily high/low: 55.1 / 28.9 F
- Daily wind max: 13.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:26 / 20:10

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Medium-Diving Crankbait `medium_diving_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse blue, chartreuse black back
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Medium-Diving Crankbait: Theme: bright contrast. Try firetiger, chartreuse blue, chartreuse black back.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 75 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_minnesota_fall_lake_08

- Label: Minnesota northern lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- A stained northern summer lake can still lead with hair, swimbait, or tube lanes when the fish are roaming but not fully power-fishing.
Expected primary lanes:
- hair_jig
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- spinnerbait
- walking_topwater
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural
- craw_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 71.8 F
- Noon pressure: 1010.9 mb
- Noon cloud cover: 96%
- Daily high/low: 80.1 / 63.9 F
- Daily wind max: 15.7 mph
- Daily precip: 0.10629921259842522 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:14 / 20:32

Actual output:
- Top 1 lure: Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 lures:
- Hair Jig / Marabou Jig `hair_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Hair Jig / Marabou Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 75 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:craw_natural,craw_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_minnesota_fall_lake_10

- Label: Minnesota northern lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Stained Minnesota fall smallmouth should tighten around jerkbait, blade, hair, and swimbait lanes.
Expected primary lanes:
- suspending_jerkbait
- blade_bait
- hair_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- white_shad
- bright_contrast
- natural_baitfish

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 52.3 F
- Noon pressure: 1025.4 mb
- Noon cloud cover: 84%
- Daily high/low: 52.3 / 41.9 F
- Daily wind max: 9.1 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:35 / 18:33

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `bright_contrast` | colors: white/chartreuse, yellow/white, chartreuse/olive
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Slim Minnow Streamer: Theme: bright contrast. Try white/chartreuse, yellow/white, chartreuse/olive.
- Daily profile notes:
- Shared score: 52 (Fair)
- Daily nudges: mood=up_2, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_minnesota_fall_lake_11

- Label: Minnesota northern lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: MN
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Stained Minnesota fall smallmouth should tighten around jerkbait, blade, hair, and swimbait lanes.
Expected primary lanes:
- suspending_jerkbait
- blade_bait
- hair_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- white_shad
- bright_contrast
- natural_baitfish

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 45.1 F
- Noon pressure: 1015.3 mb
- Noon cloud cover: 2%
- Daily high/low: 53.4 / 26 F
- Daily wind max: 8 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:16 / 16:49

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `bright_contrast` | colors: white/chartreuse, yellow/white, chartreuse/olive
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Slim Minnow Streamer: Theme: bright contrast. Try white/chartreuse, yellow/white, chartreuse/olive.
- Daily profile notes:
- Shared score: 66 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_colorado_river_03

- Label: Colorado western river, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Cold clear western river smallmouth prespawn should stay subtle and current-aware with tube, hair, and soft-minnow lanes.
Expected primary lanes:
- tube_jig
- hair_jig
- soft_jerkbait
Acceptable secondary lanes:
- ned_rig
- suspending_jerkbait
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 35.3 F
- Noon pressure: 1023.7 mb
- Noon cloud cover: 55%
- Daily high/low: 44.5 / 13.6 F
- Daily wind max: 9.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:12 / 19:24

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Ned Rig `ned_rig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Ned Rig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 55 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=neutral, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_colorado_river_06

- Label: Colorado western river, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Clear western summer river smallmouth should keep current-aware baitfish and search lanes open, with tube support but not tube-first control on every good day.
Expected primary lanes:
- inline_spinner
- soft_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- tube_jig
- walking_topwater
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- metal_flash
- white_shad

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 82.5 F
- Noon pressure: 1013.2 mb
- Noon cloud cover: 0%
- Daily high/low: 90.4 / 58 F
- Daily wind max: 9.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:45 / 20:39

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Muddler-Style Sculpin `muddler_sculpin` | theme: `natural_baitfish` | colors: natural, olive, tan/olive
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Inline Spinner: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Muddler-Style Sculpin: Theme: natural baitfish. Try natural, olive, tan/olive.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 61 (Good)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_colorado_river_09

- Label: Colorado western river, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Clear western fall river smallmouth should center on jerkbait, spinner, and swimbait lanes with current still respected.
Expected primary lanes:
- suspending_jerkbait
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- tube_jig
- clouser_minnow
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 72 F
- Noon pressure: 1017.7 mb
- Noon cloud cover: 0%
- Daily high/low: 76.7 / 46.2 F
- Daily wind max: 10.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:54 / 19:17

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 72 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_colorado_river_12

- Label: Colorado western river, winter control month 12
- Priority: secondary
- Date: 2025-12-10
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Early-winter western river smallmouth should stay lower-column and disciplined with tube, hair, and jerkbait control.
Expected primary lanes:
- tube_jig
- hair_jig
- suspending_jerkbait
Acceptable secondary lanes:
- blade_bait
- drop_shot_worm_minnow
- sculpin_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 49 F
- Noon pressure: 1024.3 mb
- Noon cloud cover: 44%
- Daily high/low: 49.9 / 32.4 F
- Daily wind max: 7.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:16 / 16:52

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 83 (Excellent)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=mid, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_washington_river_04

- Label: Washington inland river, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: WA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 46.2396, -119.1006
- Engine status: complete

Expected seasonal story:
- Northwest clear river smallmouth should open tube, soft-minnow, and spinner lanes while staying river-specific.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- paddle_tail_swimbait
- spinnerbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 68.4 F
- Noon pressure: 1013.1 mb
- Noon cloud cover: 0%
- Daily high/low: 69.1 / 48.7 F
- Daily wind max: 15.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:05 / 19:47

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Squarebill Crankbait `squarebill_crankbait` | theme: `white_shad` | colors: sexy shad, pearl shad, white chart back
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Squarebill Crankbait: Theme: white shad. Try sexy shad, pearl shad, white chart back.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 80 (Excellent)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_washington_river_07

- Label: Washington inland river, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: WA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 46.2396, -119.1006
- Engine status: complete

Expected seasonal story:
- Summer northwest river smallmouth should allow topwater and spinner lanes, but only as current-aware river options.
Expected primary lanes:
- walking_topwater
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- tube_jig
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 79.1 F
- Noon pressure: 1012.9 mb
- Noon cloud cover: 0%
- Daily high/low: 88.9 / 62.5 F
- Daily wind max: 7.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:19 / 20:45

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Muddler-Style Sculpin `muddler_sculpin` | theme: `natural_baitfish` | colors: natural, olive, tan/olive
- Color notes:
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Muddler-Style Sculpin: Theme: natural baitfish. Try natural, olive, tan/olive.
- Daily profile notes:
- Shared score: 76 (Good)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=mid, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_washington_river_09

- Label: Washington inland river, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: WA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 46.2396, -119.1006
- Engine status: complete

Expected seasonal story:
- Cool-season northwest river smallmouth should prioritize jerkbait, spinner, and swimbait lanes with a clean tube backup.
Expected primary lanes:
- suspending_jerkbait
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- tube_jig
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 74.1 F
- Noon pressure: 1017.5 mb
- Noon cloud cover: 0%
- Daily high/low: 82.4 / 56.1 F
- Daily wind max: 3.1 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:36 / 19:05

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 75 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_washington_river_11

- Label: Washington inland river, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: WA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 46.2396, -119.1006
- Engine status: complete

Expected seasonal story:
- Cool-season northwest river smallmouth should prioritize jerkbait, spinner, and swimbait lanes with a clean tube backup.
Expected primary lanes:
- suspending_jerkbait
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- tube_jig
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- metal_flash

Archived env summary:
- Region: inland_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 48.3 F
- Noon pressure: 1014.8 mb
- Noon cloud cover: 98%
- Daily high/low: 53.7 / 42.5 F
- Daily wind max: 5.5 mph
- Daily precip: 0.16929133858267717 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:52 / 16:28

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 71 (Good)
- Daily nudges: mood=up_2, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_ohio_dirty_reservoir_04

- Label: Ohio dirty reservoir, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: OH
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Dirty prespawn and spawn-transition smallmouth reservoirs should stay disciplined but visible, letting spinnerbait and jerkbait lanes stay in play.
Expected primary lanes:
- spinnerbait
- tube_jig
- suspending_jerkbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- flat_sided_crankbait
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/New_York
- Noon air temp: 47.4 F
- Noon pressure: 1019.5 mb
- Noon cloud cover: 47%
- Daily high/low: 51.6 / 33.9 F
- Daily wind max: 12.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:49 / 20:13

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright_contrast` | colors: clown, firetiger, chartreuse shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Sculpin Streamer `sculpin_streamer` | theme: `dark_contrast` | colors: black/blue, black/purple, black/red
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Suspending Jerkbait: Theme: bright contrast. Try clown, firetiger, chartreuse shad.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Sculpin Streamer: Theme: dark contrast. Try black/blue, black/purple, black/red.
- Daily profile notes:
- Shared score: 36 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_ohio_dirty_reservoir_06

- Label: Ohio dirty reservoir, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: OH
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Dirty summer smallmouth reservoirs should still use visible baitfish tools, not collapse into largemouth-only cover pitching.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- walking_topwater
- medium_diving_crankbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- bright_contrast
- white_shad
- dark_contrast

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/New_York
- Noon air temp: 78.8 F
- Noon pressure: 1012.7 mb
- Noon cloud cover: 100%
- Daily high/low: 82.8 / 67.9 F
- Daily wind max: 15.8 mph
- Daily precip: 0.16141732283464566 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:00 / 21:06

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Medium-Diving Crankbait `medium_diving_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse blue, chartreuse black back
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Medium-Diving Crankbait: Theme: bright contrast. Try firetiger, chartreuse blue, chartreuse black back.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 86 (Excellent)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright_contrast,bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_ohio_dirty_reservoir_08

- Label: Ohio dirty reservoir, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: OH
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Dirty summer smallmouth reservoirs should still use visible baitfish tools, not collapse into largemouth-only cover pitching.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- walking_topwater
- medium_diving_crankbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- bright_contrast
- white_shad
- dark_contrast

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/New_York
- Noon air temp: 79.9 F
- Noon pressure: 1017.1 mb
- Noon cloud cover: 31%
- Daily high/low: 83.1 / 65.6 F
- Daily wind max: 5.7 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:41 / 20:32

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright_contrast` | colors: clown, firetiger, chartreuse shad
- Top 1 fly: Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Top 3 flies:
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Suspending Jerkbait: Theme: bright contrast. Try clown, firetiger, chartreuse shad.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 53 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_ohio_dirty_reservoir_12

- Label: Ohio dirty reservoir, winter control month 12
- Priority: secondary
- Date: 2025-12-10
- State: OH
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.367, -82.9962
- Engine status: complete

Expected seasonal story:
- Dirty winter smallmouth reservoirs should stay lower-column and visible with jerkbait, blade, and hair/tube lanes.
Expected primary lanes:
- suspending_jerkbait
- blade_bait
- hair_jig
Acceptable secondary lanes:
- tube_jig
- paddle_tail_swimbait
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- bright_contrast
- white_shad
- dark_contrast

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/New_York
- Noon air temp: 38.8 F
- Noon pressure: 996.2 mb
- Noon cloud cover: 100%
- Daily high/low: 28.7 / 24.1 F
- Daily wind max: 15.5 mph
- Daily precip: 0.027559055118110236 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:42 / 17:07

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `bright_contrast` | colors: clown, firetiger, chartreuse shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright_contrast` | colors: clown, firetiger, chartreuse shad
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Hair Jig / Marabou Jig `hair_jig` | theme: `dark_contrast` | colors: black, brown/black, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Conehead Bugger / Streamer `conehead_streamer` | theme: `dark_contrast` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark_contrast` | colors: black/blue, black/purple, black/red
- Color notes:
- Suspending Jerkbait: Theme: bright contrast. Try clown, firetiger, chartreuse shad.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Hair Jig / Marabou Jig: Theme: dark contrast. Try black, brown/black, black/purple.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Conehead Bugger / Streamer: Theme: dark contrast. Try black, black/blue, black/purple.
- Sculpin Streamer: Theme: dark contrast. Try black/blue, black/purple, black/red.
- Daily profile notes:
- Shared score: 70 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright_contrast,dark_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_willamette_river_smb_04

- Label: Willamette River smallmouth, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.94, -123.03
- Engine status: complete

Expected seasonal story:
- April Willamette River smallmouth should open tube and soft-minnow lanes in WESTERN_MIXED spring posture with craw-primary colors.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- spinnerbait
- suspending_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 56.2 F
- Noon pressure: 1017.7 mb
- Noon cloud cover: 0%
- Daily high/low: 63.3 / 38.8 F
- Daily wind max: 10.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:22 / 20:00

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 69 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=subtler
- Resolved profile: water_column=mid, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_willamette_river_smb_06

- Label: Willamette River smallmouth, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.94, -123.03
- Engine status: complete

Expected seasonal story:
- June Willamette River smallmouth should be in active surface and search mode; walking topwater leads on active days with inline spinner and swimbait as baitfish support lanes.
Expected primary lanes:
- walking_topwater
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- popping_topwater
- soft_jerkbait
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 66 F
- Noon pressure: 1018.8 mb
- Noon cloud cover: 67%
- Daily high/low: 69.9 / 54.5 F
- Daily wind max: 11.4 mph
- Daily precip: 0.03543307086614173 in
- Moon phase: Third Quarter
- Sunrise/sunset: 05:23 / 21:03

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Top 3 flies:
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Color notes:
- Inline Spinner: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Daily profile notes:
- Shared score: 75 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_willamette_river_smb_09

- Label: Willamette River smallmouth, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.94, -123.03
- Engine status: complete

Expected seasonal story:
- September Willamette River smallmouth hits the NORTHWEST_EARLY_FALL override — suspending jerkbait leads the baitfish-first fall window with inline spinner and swimbait as support.
Expected primary lanes:
- suspending_jerkbait
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 73.3 F
- Noon pressure: 1018.6 mb
- Noon cloud cover: 0%
- Daily high/low: 80.2 / 54.4 F
- Daily wind max: 9.8 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:52 / 19:20

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 75 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_willamette_river_smb_11

- Label: Willamette River smallmouth, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.94, -123.03
- Engine status: complete

Expected seasonal story:
- November Willamette River smallmouth should center on suspending jerkbait and spinnerbait as baitfish lanes tighten in cool-season FALL_RIVER posture.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- tube_jig
- clouser_minnow
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 57.3 F
- Noon pressure: 1010.8 mb
- Noon cloud cover: 78%
- Daily high/low: 58.9 / 49.5 F
- Daily wind max: 9.9 mph
- Daily precip: 0.1968503937007874 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:04 / 16:47

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 78 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_northern_california_smb_river_03

- Label: Northern California smallmouth river, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.78, -123.02
- Engine status: complete

Expected seasonal story:
- March Northern California smallmouth river should open tube and soft-minnow lanes in WESTERN_MIXED spring posture with craw-primary crawfish-colored reads.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- spinnerbait
Acceptable secondary lanes:
- ned_rig
- suspending_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 56.4 F
- Noon pressure: 1026.3 mb
- Noon cloud cover: 100%
- Daily high/low: 60.5 / 39.6 F
- Daily wind max: 9.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:13 / 19:25

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Squarebill Crankbait `squarebill_crankbait` | theme: `white_shad` | colors: sexy shad, pearl shad, white chart back
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Squarebill Crankbait: Theme: white shad. Try sexy shad, pearl shad, white chart back.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 49 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_northern_california_smb_river_06

- Label: Northern California smallmouth river, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.78, -123.02
- Engine status: complete

Expected seasonal story:
- Northern California summer river smallmouth should be in active surface and baitfish-search mode; walking topwater leads on surface-active days, but tube jig takes over when wind and clear-water depth cues push fish to rocky mid-column holds.
Expected primary lanes:
- walking_topwater
- inline_spinner
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- popping_topwater
- soft_jerkbait
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 88.1 F
- Noon pressure: 1011.5 mb
- Noon cloud cover: 0%
- Daily high/low: 90.9 / 58.6 F
- Daily wind max: 14.3 mph
- Daily precip: 0 in
- Moon phase: Third Quarter
- Sunrise/sunset: 05:45 / 20:41

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Muddler-Style Sculpin `muddler_sculpin` | theme: `natural_baitfish` | colors: natural, olive, tan/olive
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Muddler-Style Sculpin: Theme: natural baitfish. Try natural, olive, tan/olive.
- Daily profile notes:
- Shared score: 61 (Good)
- Daily nudges: mood=up_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=mid, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_northern_california_smb_river_08

- Label: Northern California smallmouth river, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.78, -123.02
- Engine status: complete

Expected seasonal story:
- Northern California summer river smallmouth should be in active surface and baitfish-search mode; walking topwater leads on surface-active days, but tube jig takes over when wind and clear-water depth cues push fish to rocky mid-column holds.
Expected primary lanes:
- walking_topwater
- inline_spinner
- paddle_tail_swimbait
- tube_jig
Acceptable secondary lanes:
- popping_topwater
- soft_jerkbait
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 86.9 F
- Noon pressure: 1012.6 mb
- Noon cloud cover: 0%
- Daily high/low: 93.6 / 58.2 F
- Daily wind max: 13.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:24 / 20:09

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Top 3 flies:
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Color notes:
- Inline Spinner: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Daily profile notes:
- Shared score: 53 (Fair)
- Daily nudges: mood=up_2, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_northern_california_smb_river_10

- Label: Northern California smallmouth river, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.78, -123.02
- Engine status: complete

Expected seasonal story:
- October Northern California river smallmouth should center on suspending jerkbait and spinnerbait as baitfish lanes tighten in FALL_RIVER posture.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- tube_jig
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 60.1 F
- Noon pressure: 1019.1 mb
- Noon cloud cover: 100%
- Daily high/low: 63.7 / 52.2 F
- Daily wind max: 4.8 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:20 / 18:34

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 39 (Poor)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_northeast_connecticut_river_04

- Label: Connecticut River smallmouth, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: MA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 42.33, -72.64
- Engine status: complete

Expected seasonal story:
- Northeast spring river smallmouth should open tube and soft-minnow lanes in standard NORTHERN_COLD spring posture.
Expected primary lanes:
- tube_jig
- soft_jerkbait
- inline_spinner
Acceptable secondary lanes:
- spinnerbait
- suspending_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 45.5 F
- Noon pressure: 1003.7 mb
- Noon cloud cover: 71%
- Daily high/low: 47.6 / 38.4 F
- Daily wind max: 16.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:05 / 19:34

Actual output:
- Top 1 lure: Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Ned Rig `ned_rig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Ned Rig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 45 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_northeast_connecticut_river_06

- Label: Connecticut River smallmouth, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: MA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 42.33, -72.64
- Engine status: complete

Expected seasonal story:
- Northeast June river smallmouth hits the NORTHEAST_SUMMER_RIVER override — bold topwater presentation leads with walking topwater and inline spinner, confirming the northeast-specific aggressive early-summer surface window distinct from the GLUM spring-holdover posture.
Expected primary lanes:
- walking_topwater
- inline_spinner
- paddle_tail_swimbait
Acceptable secondary lanes:
- popping_topwater
- spinnerbait
- popper_fly
Disallowed lanes:
- hollow_body_frog
- compact_flipping_jig
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 69.8 F
- Noon pressure: 1013.2 mb
- Noon cloud cover: 100%
- Daily high/low: 77.8 / 63 F
- Daily wind max: 7.9 mph
- Daily precip: 0.25984251968503935 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:11 / 20:31

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Walking Topwater `walking_topwater` | theme: `white_shad` | colors: bone, white, pearl
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Popper Fly `popper_fly` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Inline Spinner: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Walking Topwater: Theme: white shad. Try bone, white, pearl.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Popper Fly: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 68 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_northeast_connecticut_river_09

- Label: Connecticut River smallmouth, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: MA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 42.33, -72.64
- Engine status: complete

Expected seasonal story:
- Northeast fall river smallmouth should center on suspending jerkbait — FALL_RIVER fires in September and NORTHEAST_LATEFALL_RIVER fires in November, both putting jerkbait at the top vs the NORTHERN_COLD WINTER_RIVER (tube-first) that would apply to GLUM November.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- blade_bait
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 67.6 F
- Noon pressure: 1021.7 mb
- Noon cloud cover: 2%
- Daily high/low: 72.9 / 51.8 F
- Daily wind max: 6.1 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:31 / 18:58

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 78 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_northeast_connecticut_river_11

- Label: Connecticut River smallmouth, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: MA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 42.33, -72.64
- Engine status: complete

Expected seasonal story:
- Northeast fall river smallmouth should center on suspending jerkbait — FALL_RIVER fires in September and NORTHEAST_LATEFALL_RIVER fires in November, both putting jerkbait at the top vs the NORTHERN_COLD WINTER_RIVER (tube-first) that would apply to GLUM November.
Expected primary lanes:
- suspending_jerkbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- inline_spinner
- blade_bait
- slim_minnow_streamer
Disallowed lanes:
- walking_topwater
- popping_topwater
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 43.2 F
- Noon pressure: 1006.1 mb
- Noon cloud cover: 80%
- Daily high/low: 46.9 / 35.8 F
- Daily wind max: 10.8 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:36 / 16:32

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Slim Minnow Streamer: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 67 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural_baitfish,natural_baitfish
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_illinois_river_smb_04

- Label: Illinois River dirty smallmouth, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: IL
- Context: freshwater_river
- Water clarity: dirty
- Coordinates: 41.37, -88.84
- Engine status: complete

Expected seasonal story:
- GLUM dirty river spring smallmouth: tube_jig is penalized in dirty water; spinnerbait and ned_rig both get dirty clarity bonuses (ned_rig also has crawfish forage alignment); paddle_tail_swimbait surfaces as dirty-friendly baitfish option; clear-water finesse tools drop off.
Expected primary lanes:
- spinnerbait
- ned_rig
- tube_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- hair_jig
- clouser_minnow
Disallowed lanes:
- suspending_jerkbait
- squarebill_crankbait
- inline_spinner
Expected color themes:
- green_pumpkin_natural
- bright_contrast
- dark_contrast
- natural_baitfish

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 51.8 F
- Noon pressure: 1021.5 mb
- Noon cloud cover: 100%
- Daily high/low: 57.4 / 32.4 F
- Daily wind max: 10 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:11 / 19:38

Actual output:
- Top 1 lure: Ned Rig `ned_rig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Ned Rig `ned_rig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Ned Rig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Daily profile notes:
- Shared score: 68 (Good)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_illinois_river_smb_07

- Label: Illinois River dirty smallmouth, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: IL
- Context: freshwater_river
- Water clarity: dirty
- Coordinates: 41.37, -88.84
- Engine status: complete

Expected seasonal story:
- GLUM dirty river summer smallmouth: GREAT_LAKES_CLEAR_SUMMER_RIVER is a clear-water-optimized pool — every lure except paddle_tail_swimbait is penalized in dirty water; paddle_tail wins by a wide margin as the sole dirty-friendly option in the pool.
Expected primary lanes:
- paddle_tail_swimbait
Acceptable secondary lanes:
- spinnerbait
- clouser_minnow
Disallowed lanes:
- tube_jig
- suspending_jerkbait
- squarebill_crankbait
- walking_topwater
Expected color themes:
- natural_baitfish
- dark_contrast
- white_shad

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 85.9 F
- Noon pressure: 1009.9 mb
- Noon cloud cover: 22%
- Daily high/low: 87.9 / 72.2 F
- Daily wind max: 13.6 mph
- Daily precip: 0.15354330708661418 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:34 / 20:28

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright_contrast` | colors: clown, firetiger, chartreuse shad
- Tube Jig `tube_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Suspending Jerkbait: Theme: bright contrast. Try clown, firetiger, chartreuse shad.
- Tube Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 41 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- DISALLOWED_PRESENT:suspending_jerkbait,tube_jig
- TOP_COLOR_MATCH:white_shad
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

## smb_matrix_illinois_river_smb_10

- Label: Illinois River dirty smallmouth, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: IL
- Context: freshwater_river
- Water clarity: dirty
- Coordinates: 41.37, -88.84
- Engine status: complete

Expected seasonal story:
- GLUM dirty river fall smallmouth: suspending_jerkbait drops from position 0 due to dirty clarity penalty; spinnerbait and paddle_tail_swimbait take over with dirty clarity bonuses; blade_bait surfaces as a dirty-friendly option.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- blade_bait
Acceptable secondary lanes:
- hair_jig
- clouser_minnow
Disallowed lanes:
- suspending_jerkbait
- squarebill_crankbait
- tube_jig
Expected color themes:
- bright_contrast
- white_shad
- dark_contrast

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 66.1 F
- Noon pressure: 1023.6 mb
- Noon cloud cover: 73%
- Daily high/low: 66.3 / 57.7 F
- Daily wind max: 8.3 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:06 / 18:15

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse black back, chartreuse blue
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Slim Minnow Streamer `slim_minnow_streamer` | theme: `bright_contrast` | colors: white/chartreuse, yellow/white, chartreuse/olive
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Squarebill Crankbait: Theme: bright contrast. Try firetiger, chartreuse black back, chartreuse blue.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Slim Minnow Streamer: Theme: bright contrast. Try white/chartreuse, yellow/white, chartreuse/olive.
- Daily profile notes:
- Shared score: 82 (Excellent)
- Daily nudges: mood=up_2, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- DISALLOWED_PRESENT:squarebill_crankbait
- TOP_COLOR_MATCH:bright_contrast,bright_contrast
- Top 1 verdict:
- Top 3 verdict:
- seasonal_fit:
- daily_fit:
- water_column_fit:
- archetype_fit:
- color_fit:
- top3_variety:
- boundedness:
- failure_clusters:
- notes:

