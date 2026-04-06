# Largemouth V3 Matrix Review Sheet

Generated: 2026-04-05T15:45:03.967Z
Archive bundle generated: 2026-04-05T15:13:24.391Z
Scenario count: 90
Contexts: 74 lake/pond, 16 river
Priority mix: 48 core, 42 secondary
Completed engine runs: 90/90

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

## lmb_matrix_florida_lake_01

- Label: Florida shallow natural lake, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida winter largemouth should stay in a controlled lower-column lane with only mild daily openings.
Expected primary lanes:
- football_jig
- texas_rigged_soft_plastic_craw
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- walking_topwater
- hollow_body_frog
- mouse_fly
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 60.2 F
- Noon pressure: 1024.4 mb
- Noon cloud cover: 100%
- Daily high/low: 65.4 / 58.1 F
- Daily wind max: 14.8 mph
- Daily precip: 0.03937007874015748 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:12 / 17:54

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Texas-Rigged Soft-Plastic Craw: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 50 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
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

## lmb_matrix_florida_lake_02

- Label: Florida shallow natural lake, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida prespawn largemouth should open moving baitfish lanes without abandoning controlled shallow cover options.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- compact_flipping_jig
- swim_jig
- football_jig
Disallowed lanes:
- hollow_body_frog
- mouse_fly
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 75.3 F
- Noon pressure: 1016 mb
- Noon cloud cover: 99%
- Daily high/low: 74.6 / 62.3 F
- Daily wind max: 21.4 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:54 / 18:19

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 79 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
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

## lmb_matrix_florida_lake_03

- Label: Florida shallow natural lake, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida prespawn largemouth should open moving baitfish lanes without abandoning controlled shallow cover options.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- spinnerbait
Acceptable secondary lanes:
- compact_flipping_jig
- swim_jig
- football_jig
Disallowed lanes:
- hollow_body_frog
- mouse_fly
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 69 F
- Noon pressure: 1018.3 mb
- Noon cloud cover: 0%
- Daily high/low: 75.2 / 65.7 F
- Daily wind max: 23 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:25 / 19:35

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 44 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=neutral
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
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

## lmb_matrix_florida_lake_04

- Label: Florida shallow natural lake, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida spawn and immediate postspawn should stay shallow and target-oriented first, with one clean baitfish follow-up lane.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- compact_flipping_jig
Acceptable secondary lanes:
- swim_jig
- paddle_tail_swimbait
- woolly_bugger
Disallowed lanes:
- blade_bait
- hollow_body_frog
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 71.7 F
- Noon pressure: 1019.2 mb
- Noon cloud cover: 17%
- Daily high/low: 79 / 67.1 F
- Daily wind max: 22.3 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:56 / 19:49

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Clouser Minnow `clouser_minnow` | theme: `white_shad` | colors: white, pearl, white/silver
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Weightless Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Wacky-Rigged Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Clouser Minnow: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 56 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=neutral, presentation=subtle
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

## lmb_matrix_florida_lake_05

- Label: Florida shallow natural lake, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida spawn and immediate postspawn should stay shallow and target-oriented first, with one clean baitfish follow-up lane.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- compact_flipping_jig
Acceptable secondary lanes:
- swim_jig
- paddle_tail_swimbait
- woolly_bugger
Disallowed lanes:
- blade_bait
- hollow_body_frog
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 79.1 F
- Noon pressure: 1017 mb
- Noon cloud cover: 0%
- Daily high/low: 88.2 / 76.8 F
- Daily wind max: 18.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:33 / 20:05

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Clouser Minnow `clouser_minnow` | theme: `white_shad` | colors: white, pearl, white/silver
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Weightless Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Wacky-Rigged Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Clouser Minnow: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 44 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=neutral, presentation=subtle
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

## lmb_matrix_florida_lake_06

- Label: Florida shallow natural lake, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Warm-season Florida largemouth should lean grass, cover, and surface-adjacent lanes rather than winter-style control tools.
Expected primary lanes:
- hollow_body_frog
- swim_jig
- buzzbait_prop_bait
Acceptable secondary lanes:
- compact_flipping_jig
- texas_rigged_stick_worm
- frog_fly
Disallowed lanes:
- blade_bait
- drop_shot_worm_minnow
- suspending_jerkbait
Expected color themes:
- frog_natural
- white_shad
- dark_contrast

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 84.7 F
- Noon pressure: 1020.8 mb
- Noon cloud cover: 59%
- Daily high/low: 86.3 / 79.3 F
- Daily wind max: 17.7 mph
- Daily precip: 0.06692913385826772 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:28 / 20:20

Actual output:
- Top 1 lure: Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 lures:
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Walking Topwater `walking_topwater` | theme: `white_shad` | colors: bone, white, pearl
- Top 1 fly: Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 flies:
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Color notes:
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Walking Topwater: Theme: white shad. Try bone, white, pearl.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Daily profile notes:
- Shared score: 56 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:frog_natural,frog_natural
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

## lmb_matrix_florida_lake_07

- Label: Florida shallow natural lake, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Warm-season Florida largemouth should lean grass, cover, and surface-adjacent lanes rather than winter-style control tools.
Expected primary lanes:
- hollow_body_frog
- swim_jig
- buzzbait_prop_bait
Acceptable secondary lanes:
- compact_flipping_jig
- texas_rigged_stick_worm
- frog_fly
Disallowed lanes:
- blade_bait
- drop_shot_worm_minnow
- suspending_jerkbait
Expected color themes:
- frog_natural
- white_shad
- dark_contrast

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 83.4 F
- Noon pressure: 1018.6 mb
- Noon cloud cover: 37%
- Daily high/low: 85.1 / 78.8 F
- Daily wind max: 19.3 mph
- Daily precip: 0.2362204724409449 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:38 / 20:20

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Bladed Jig: Theme: dark contrast. Try black/blue, black/purple, black.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 40 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=mid, mood=negative, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
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

## lmb_matrix_florida_lake_08

- Label: Florida shallow natural lake, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Warm-season Florida largemouth should lean grass, cover, and surface-adjacent lanes rather than winter-style control tools.
Expected primary lanes:
- hollow_body_frog
- swim_jig
- buzzbait_prop_bait
Acceptable secondary lanes:
- compact_flipping_jig
- texas_rigged_stick_worm
- frog_fly
Disallowed lanes:
- blade_bait
- drop_shot_worm_minnow
- suspending_jerkbait
Expected color themes:
- frog_natural
- white_shad
- dark_contrast

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 83.5 F
- Noon pressure: 1018.7 mb
- Noon cloud cover: 82%
- Daily high/low: 88.3 / 82.2 F
- Daily wind max: 13.3 mph
- Daily precip: 0.06299212598425198 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:53 / 20:02

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Bladed Jig: Theme: dark contrast. Try black/blue, black/purple, black.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 45 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=mid, mood=negative, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
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

## lmb_matrix_florida_lake_09

- Label: Florida shallow natural lake, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida fall largemouth should allow stronger shallow baitfish and grass-cover options than the summer slowdown windows.
Expected primary lanes:
- walking_topwater
- swim_jig
- spinnerbait
Acceptable secondary lanes:
- bladed_jig
- hollow_body_frog
- paddle_tail_swimbait
Disallowed lanes:
- blade_bait
Expected color themes:
- frog_natural
- white_shad
- bright_contrast

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 77.5 F
- Noon pressure: 1017.4 mb
- Noon cloud cover: 100%
- Daily high/low: 80.1 / 77.4 F
- Daily wind max: 17.2 mph
- Daily precip: 0.3346456692913386 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:08 / 19:26

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Deceiver `deceiver` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Bladed Jig: Theme: dark contrast. Try black/blue, black/purple, black.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Deceiver: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 48 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=active, presentation=balanced
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

## lmb_matrix_florida_lake_10

- Label: Florida shallow natural lake, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida fall largemouth should allow stronger shallow baitfish and grass-cover options than the summer slowdown windows.
Expected primary lanes:
- walking_topwater
- swim_jig
- spinnerbait
Acceptable secondary lanes:
- bladed_jig
- hollow_body_frog
- paddle_tail_swimbait
Disallowed lanes:
- blade_bait
Expected color themes:
- frog_natural
- white_shad
- bright_contrast

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 75.8 F
- Noon pressure: 1014.1 mb
- Noon cloud cover: 0%
- Daily high/low: 81.3 / 72.1 F
- Daily wind max: 19.8 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:21 / 18:55

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 flies:
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
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
- TOP_COLOR_MATCH:white_shad,frog_natural
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

## lmb_matrix_florida_lake_11

- Label: Florida shallow natural lake, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida fall largemouth should allow stronger shallow baitfish and grass-cover options than the summer slowdown windows.
Expected primary lanes:
- walking_topwater
- swim_jig
- spinnerbait
Acceptable secondary lanes:
- bladed_jig
- hollow_body_frog
- paddle_tail_swimbait
Disallowed lanes:
- blade_bait
Expected color themes:
- frog_natural
- white_shad
- bright_contrast

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 61.5 F
- Noon pressure: 1025.7 mb
- Noon cloud cover: 98%
- Daily high/low: 67.1 / 57.2 F
- Daily wind max: 12.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:39 / 17:34

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Deceiver `deceiver` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Bladed Jig: Theme: dark contrast. Try black/blue, black/purple, black.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Deceiver: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 54 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
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

## lmb_matrix_florida_lake_12

- Label: Florida shallow natural lake, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: FL
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 26.94, -80.8
- Engine status: complete

Expected seasonal story:
- Florida winter largemouth should stay in a controlled lower-column lane with only mild daily openings.
Expected primary lanes:
- football_jig
- texas_rigged_soft_plastic_craw
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- walking_topwater
- hollow_body_frog
- mouse_fly
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: florida
- Archive weather timezone: America/New_York
- Noon air temp: 66.6 F
- Noon pressure: 1015 mb
- Noon cloud cover: 31%
- Daily high/low: 70.2 / 59.1 F
- Daily wind max: 18.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:00 / 17:31

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Texas-Rigged Soft-Plastic Craw: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 58 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
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

## lmb_matrix_texas_reservoir_01

- Label: Texas reservoir, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- South-central winter reservoir largemouth should stay lower and controlled, with jerkbait or flat-side still in play when conditions allow.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
Acceptable secondary lanes:
- shaky_head_worm
- texas_rigged_soft_plastic_craw
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- green_pumpkin_natural
- white_shad
- dark_contrast

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 57 F
- Noon pressure: 1029.1 mb
- Noon cloud cover: 100%
- Daily high/low: 60.3 / 42.6 F
- Daily wind max: 12.3 mph
- Daily precip: 0.023622047244094488 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:19 / 17:44

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Texas-Rigged Soft-Plastic Craw: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Flat-Sided Crankbait: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 60 (Good)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=negative, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,dark_contrast
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

## lmb_matrix_texas_reservoir_02

- Label: Texas reservoir, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- South-central prespawn reservoirs should open baitfish lanes, but still stay bounded inside a late-winter / early-spring largemouth posture.
Expected primary lanes:
- spinnerbait
- suspending_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- football_jig
- bladed_jig
- swim_jig
Disallowed lanes:
- hollow_body_frog
- popper_fly
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 34.1 F
- Noon pressure: 1031.2 mb
- Noon cloud cover: 100%
- Daily high/low: 37.3 / 20 F
- Daily wind max: 12.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:57 / 18:14

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 37 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
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

## lmb_matrix_texas_reservoir_03

- Label: Texas reservoir, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- South-central prespawn reservoirs should open baitfish lanes, but still stay bounded inside a late-winter / early-spring largemouth posture.
Expected primary lanes:
- spinnerbait
- suspending_jerkbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- football_jig
- bladed_jig
- swim_jig
Disallowed lanes:
- hollow_body_frog
- popper_fly
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 57.2 F
- Noon pressure: 1028.6 mb
- Noon cloud cover: 0%
- Daily high/low: 62.6 / 44.2 F
- Daily wind max: 14.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:24 / 19:35

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 41 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
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

## lmb_matrix_texas_reservoir_04

- Label: Texas reservoir, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Texas spawn-to-postspawn largemouth should balance target fishing with one or two clean horizontal follow-up lanes.
Expected primary lanes:
- compact_flipping_jig
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- weightless_stick_worm
- paddle_tail_swimbait
- soft_jerkbait
Disallowed lanes:
- blade_bait
- walking_topwater
Expected color themes:
- green_pumpkin_natural
- white_shad
- watermelon_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 78.9 F
- Noon pressure: 1019.7 mb
- Noon cloud cover: 0%
- Daily high/low: 85.3 / 60.1 F
- Daily wind max: 13.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:51 / 19:52

Actual output:
- Top 1 lure: Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 72 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=neutral, presentation=balanced
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

## lmb_matrix_texas_reservoir_05

- Label: Texas reservoir, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Texas spawn-to-postspawn largemouth should balance target fishing with one or two clean horizontal follow-up lanes.
Expected primary lanes:
- compact_flipping_jig
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- weightless_stick_worm
- paddle_tail_swimbait
- soft_jerkbait
Disallowed lanes:
- blade_bait
- walking_topwater
Expected color themes:
- green_pumpkin_natural
- white_shad
- watermelon_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 89.8 F
- Noon pressure: 1009.1 mb
- Noon cloud cover: 69%
- Daily high/low: 93.8 / 72.1 F
- Daily wind max: 15.7 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:24 / 20:12

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 57 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
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

## lmb_matrix_texas_reservoir_06

- Label: Texas reservoir, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- deep_diving_crankbait
Acceptable secondary lanes:
- texas_rigged_soft_plastic_craw
- spinnerbait
- swim_jig
Disallowed lanes:
- drop_shot_worm_minnow
- weightless_stick_worm
- blade_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 88.3 F
- Noon pressure: 1015.1 mb
- Noon cloud cover: 11%
- Daily high/low: 89.1 / 74.9 F
- Daily wind max: 13.1 mph
- Daily precip: 0.023622047244094488 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:17 / 20:29

Actual output:
- Top 1 lure: Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Deep-Diving Crankbait: Theme: white shad. Try white, pearl, white/silver.
- Football Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 67 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=neutral
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

## lmb_matrix_texas_reservoir_07

- Label: Texas reservoir, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- deep_diving_crankbait
Acceptable secondary lanes:
- texas_rigged_soft_plastic_craw
- spinnerbait
- swim_jig
Disallowed lanes:
- drop_shot_worm_minnow
- weightless_stick_worm
- blade_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 89.5 F
- Noon pressure: 1015.8 mb
- Noon cloud cover: 22%
- Daily high/low: 95.9 / 75.2 F
- Daily wind max: 9.5 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:28 / 20:28

Actual output:
- Top 1 lure: Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Deep-Diving Crankbait: Theme: white shad. Try white, pearl, white/silver.
- Football Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 74 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=subtler
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

## lmb_matrix_texas_reservoir_08

- Label: Texas reservoir, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Summer reservoirs should favor brush, structure, and visible control lanes over clear-water finesse or cold-water reaction tools.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- deep_diving_crankbait
Acceptable secondary lanes:
- texas_rigged_soft_plastic_craw
- spinnerbait
- swim_jig
Disallowed lanes:
- drop_shot_worm_minnow
- weightless_stick_worm
- blade_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 90.6 F
- Noon pressure: 1015.8 mb
- Noon cloud cover: 10%
- Daily high/low: 95.3 / 77.4 F
- Daily wind max: 8.4 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:46 / 20:07

Actual output:
- Top 1 lure: Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Deep-Diving Crankbait: Theme: white shad. Try white, pearl, white/silver.
- Football Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Daily profile notes:
- Shared score: 51 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
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

## lmb_matrix_texas_reservoir_09

- Label: Texas reservoir, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Fall south-central reservoir bass should chase schooling baitfish with horizontal moving lanes; squarebill and paddle tail lead, suspending as a control backup.
Expected primary lanes:
- squarebill_crankbait
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- spinnerbait
- shaky_head_worm
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- white_shad
- natural_baitfish
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 90.1 F
- Noon pressure: 1017.6 mb
- Noon cloud cover: 18%
- Daily high/low: 93.5 / 73.8 F
- Daily wind max: 6.1 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:06 / 19:26

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 44 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
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

## lmb_matrix_texas_reservoir_10

- Label: Texas reservoir, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Fall south-central reservoir bass should chase schooling baitfish with horizontal moving lanes; squarebill and paddle tail lead, suspending as a control backup.
Expected primary lanes:
- squarebill_crankbait
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- spinnerbait
- shaky_head_worm
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- white_shad
- natural_baitfish
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 81.5 F
- Noon pressure: 1017.5 mb
- Noon cloud cover: 0%
- Daily high/low: 87.5 / 62.3 F
- Daily wind max: 6.9 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:24 / 18:51

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 54 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
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

## lmb_matrix_texas_reservoir_11

- Label: Texas reservoir, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- Fall south-central reservoir bass should chase schooling baitfish with horizontal moving lanes; squarebill and paddle tail lead, suspending as a control backup.
Expected primary lanes:
- squarebill_crankbait
- paddle_tail_swimbait
- suspending_jerkbait
Acceptable secondary lanes:
- spinnerbait
- shaky_head_worm
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- white_shad
- natural_baitfish
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 78.1 F
- Noon pressure: 1021.8 mb
- Noon cloud cover: 22%
- Daily high/low: 81.9 / 57.7 F
- Daily wind max: 11.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:45 / 17:27

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Clouser Minnow `clouser_minnow` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Flat-Sided Crankbait: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Clouser Minnow: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 42 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=neutral, presentation=subtle
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

## lmb_matrix_texas_reservoir_12

- Label: Texas reservoir, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: TX
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 31.101, -95.566
- Engine status: complete

Expected seasonal story:
- South-central winter reservoir largemouth should stay lower and controlled, with jerkbait or flat-side still in play when conditions allow.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
Acceptable secondary lanes:
- shaky_head_worm
- texas_rigged_soft_plastic_craw
- rabbit_strip_leech
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- green_pumpkin_natural
- white_shad
- dark_contrast

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 66.7 F
- Noon pressure: 1017.2 mb
- Noon cloud cover: 0%
- Daily high/low: 66.9 / 37.9 F
- Daily wind max: 9.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:08 / 17:21

Actual output:
- Top 1 lure: Flat-Sided Crankbait `flat_sided_crankbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Flat-Sided Crankbait: Theme: white shad. Try white, pearl, white/silver.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 74 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=neutral
- Resolved profile: water_column=mid, mood=neutral, presentation=subtle
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

## lmb_matrix_alabama_river_01

- Label: Alabama river current system, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Winter river largemouth should stay current-aware and controlled, not drift into lake-only or ultra-finesse nonsense.
Expected primary lanes:
- compact_flipping_jig
- suspending_jerkbait
- shaky_head_worm
Acceptable secondary lanes:
- tube_jig
- squarebill_crankbait
- rabbit_strip_leech
Disallowed lanes:
- hollow_body_frog
- walking_topwater
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 52.4 F
- Noon pressure: 1021.5 mb
- Noon cloud cover: 0%
- Daily high/low: 56.8 / 28.6 F
- Daily wind max: 11.4 mph
- Daily precip: 0.12598425196850396 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:55 / 17:05

Actual output:
- Top 1 lure: Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 56 (Fair)
- Daily nudges: mood=up_1, water_column=lower_1, presentation=subtler
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

## lmb_matrix_alabama_river_02

- Label: Alabama river current system, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Prespawn river largemouth should use current seams and softer edges with moving river-specific search lanes.
Expected primary lanes:
- spinnerbait
- swim_jig
- soft_jerkbait
Acceptable secondary lanes:
- squarebill_crankbait
- texas_rigged_soft_plastic_craw
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 32.2 F
- Noon pressure: 1027.1 mb
- Noon cloud cover: 79%
- Daily high/low: 26.5 / 17.1 F
- Daily wind max: 13.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:29 / 17:38

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 45 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=neutral
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

## lmb_matrix_alabama_river_03

- Label: Alabama river current system, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Prespawn river largemouth should use current seams and softer edges with moving river-specific search lanes.
Expected primary lanes:
- spinnerbait
- swim_jig
- soft_jerkbait
Acceptable secondary lanes:
- squarebill_crankbait
- texas_rigged_soft_plastic_craw
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 44.8 F
- Noon pressure: 1017.9 mb
- Noon cloud cover: 100%
- Daily high/low: 56.1 / 39.5 F
- Daily wind max: 20.3 mph
- Daily precip: 0.03937007874015748 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:52 / 19:03

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Articulated Baitfish Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 29 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
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

## lmb_matrix_alabama_river_04

- Label: Alabama river current system, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Spring river largemouth should still fish like river bass, with moving seam lanes and one controlled backup.
Expected primary lanes:
- spinnerbait
- swim_jig
- squarebill_crankbait
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- compact_flipping_jig
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 63.1 F
- Noon pressure: 1022.1 mb
- Noon cloud cover: 0%
- Daily high/low: 65.8 / 44.2 F
- Daily wind max: 4.4 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:15 / 19:25

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 49 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=subtler
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

## lmb_matrix_alabama_river_05

- Label: Alabama river current system, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Spring river largemouth should still fish like river bass, with moving seam lanes and one controlled backup.
Expected primary lanes:
- spinnerbait
- swim_jig
- squarebill_crankbait
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- compact_flipping_jig
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 80.9 F
- Noon pressure: 1010.2 mb
- Noon cloud cover: 50%
- Daily high/low: 84 / 66 F
- Daily wind max: 14.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:45 / 19:48

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Articulated Baitfish Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 73 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
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

## lmb_matrix_alabama_river_06

- Label: Alabama river current system, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Summer river largemouth should lean current-edge, shade, and ambush lanes rather than generic lake finesse.
Expected primary lanes:
- swim_jig
- spinnerbait
- soft_jerkbait
Acceptable secondary lanes:
- squarebill_crankbait
- texas_rigged_stick_worm
- clouser_minnow
Disallowed lanes:
- drop_shot_worm_minnow
- blade_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 79.8 F
- Noon pressure: 1017.1 mb
- Noon cloud cover: 100%
- Daily high/low: 84.3 / 70.8 F
- Daily wind max: 13 mph
- Daily precip: 0.06692913385826772 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:35 / 20:08

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse black back, chartreuse blue
- Top 1 fly: Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 flies:
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Squarebill Crankbait: Theme: bright contrast. Try firetiger, chartreuse black back, chartreuse blue.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 47 (Fair)
- Daily nudges: mood=neutral, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=neutral, presentation=balanced
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

## lmb_matrix_alabama_river_07

- Label: Alabama river current system, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Summer river largemouth should lean current-edge, shade, and ambush lanes rather than generic lake finesse.
Expected primary lanes:
- swim_jig
- spinnerbait
- soft_jerkbait
Acceptable secondary lanes:
- squarebill_crankbait
- texas_rigged_stick_worm
- clouser_minnow
Disallowed lanes:
- drop_shot_worm_minnow
- blade_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 85.8 F
- Noon pressure: 1017.2 mb
- Noon cloud cover: 26%
- Daily high/low: 90.6 / 75.7 F
- Daily wind max: 4.4 mph
- Daily precip: 0.08267716535433071 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:48 / 20:05

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 67 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

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

## lmb_matrix_alabama_river_08

- Label: Alabama river current system, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Summer river largemouth should lean current-edge, shade, and ambush lanes rather than generic lake finesse.
Expected primary lanes:
- swim_jig
- spinnerbait
- soft_jerkbait
Acceptable secondary lanes:
- squarebill_crankbait
- texas_rigged_stick_worm
- clouser_minnow
Disallowed lanes:
- drop_shot_worm_minnow
- blade_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 85.8 F
- Noon pressure: 1016.4 mb
- Noon cloud cover: 65%
- Daily high/low: 88.8 / 72.7 F
- Daily wind max: 7.4 mph
- Daily precip: 0.20078740157480315 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:09 / 19:41

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse black back, chartreuse blue
- Top 1 fly: Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 flies:
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Squarebill Crankbait: Theme: bright contrast. Try firetiger, chartreuse black back, chartreuse blue.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 69 (Good)
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

## lmb_matrix_alabama_river_09

- Label: Alabama river current system, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Fall river largemouth should open horizontal baitfish lanes around current edges without losing river-specific control.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- squarebill_crankbait
Acceptable secondary lanes:
- bladed_jig
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- drop_shot_worm_minnow
Expected color themes:
- white_shad
- bright_contrast
- natural_baitfish

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 86.6 F
- Noon pressure: 1017.1 mb
- Noon cloud cover: 7%
- Daily high/low: 89 / 68.7 F
- Daily wind max: 8.9 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:34 / 18:55

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Articulated Baitfish Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 61 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
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

## lmb_matrix_alabama_river_10

- Label: Alabama river current system, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Fall river largemouth should open horizontal baitfish lanes around current edges without losing river-specific control.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- squarebill_crankbait
Acceptable secondary lanes:
- bladed_jig
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- drop_shot_worm_minnow
Expected color themes:
- white_shad
- bright_contrast
- natural_baitfish

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 75.3 F
- Noon pressure: 1019.5 mb
- Noon cloud cover: 0%
- Daily high/low: 83.1 / 55 F
- Daily wind max: 8.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:55 / 18:17

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Deceiver `deceiver` | theme: `white_shad` | colors: white, pearl, white/silver
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Bladed Jig: Theme: dark contrast. Try black/blue, black/purple, black.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Deceiver: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
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

## lmb_matrix_alabama_river_11

- Label: Alabama river current system, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Fall river largemouth should open horizontal baitfish lanes around current edges without losing river-specific control.
Expected primary lanes:
- spinnerbait
- paddle_tail_swimbait
- squarebill_crankbait
Acceptable secondary lanes:
- bladed_jig
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- drop_shot_worm_minnow
Expected color themes:
- white_shad
- bright_contrast
- natural_baitfish

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 63.1 F
- Noon pressure: 1021.7 mb
- Noon cloud cover: 0%
- Daily high/low: 69.7 / 38.7 F
- Daily wind max: 4.1 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:20 / 16:48

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse black back, chartreuse blue
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Squarebill Crankbait: Theme: bright contrast. Try firetiger, chartreuse black back, chartreuse blue.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 63 (Good)
- Daily nudges: mood=up_2, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
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

## lmb_matrix_alabama_river_12

- Label: Alabama river current system, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: AL
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 34.8, -87.67
- Engine status: complete

Expected seasonal story:
- Winter river largemouth should stay current-aware and controlled, not drift into lake-only or ultra-finesse nonsense.
Expected primary lanes:
- compact_flipping_jig
- suspending_jerkbait
- shaky_head_worm
Acceptable secondary lanes:
- tube_jig
- squarebill_crankbait
- rabbit_strip_leech
Disallowed lanes:
- hollow_body_frog
- walking_topwater
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 52.4 F
- Noon pressure: 1009.6 mb
- Noon cloud cover: 85%
- Daily high/low: 49.5 / 29.8 F
- Daily wind max: 8.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:46 / 16:41

Actual output:
- Top 1 lure: Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Squarebill Crankbait `squarebill_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse black back, chartreuse blue
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Squarebill Crankbait: Theme: bright contrast. Try firetiger, chartreuse black back, chartreuse blue.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 76 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=neutral
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

## lmb_matrix_new_york_natural_lake_01

- Label: New York natural lake, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Northern clear-water winter largemouth should stay disciplined around jerkbait, flat-side, and jig lanes.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- drop_shot_worm_minnow
- clouser_minnow
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 20 F
- Noon pressure: 1010.3 mb
- Noon cloud cover: 100%
- Daily high/low: 33.7 / 20.6 F
- Daily wind max: 15.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:31 / 17:01

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural_baitfish` | colors: ghost shad, smoke shad, olive shad
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Flat-Sided Crankbait: Theme: natural baitfish. Try ghost shad, smoke shad, olive shad.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 46 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=negative, presentation=subtle
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

## lmb_matrix_new_york_natural_lake_02

- Label: New York natural lake, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Northern prespawn largemouth should open carefully with cleaner baitfish and control lanes, not jump too shallow too fast.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- football_jig
Acceptable secondary lanes:
- flat_sided_crankbait
- drop_shot_worm_minnow
- rabbit_strip_leech
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 18.2 F
- Noon pressure: 1029 mb
- Noon cloud cover: 100%
- Daily high/low: 17.5 / 13.5 F
- Daily wind max: 16 mph
- Daily precip: 0.10236220472440946 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:55 / 17:45

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural_baitfish` | colors: ghost shad, smoke shad, olive shad
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Flat-Sided Crankbait: Theme: natural baitfish. Try ghost shad, smoke shad, olive shad.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Daily profile notes:
- Shared score: 42 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=bottom, mood=neutral, presentation=subtle
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

## lmb_matrix_new_york_natural_lake_03

- Label: New York natural lake, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Northern prespawn largemouth should open carefully with cleaner baitfish and control lanes, not jump too shallow too fast.
Expected primary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- football_jig
Acceptable secondary lanes:
- flat_sided_crankbait
- drop_shot_worm_minnow
- rabbit_strip_leech
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 60.2 F
- Noon pressure: 1000.7 mb
- Noon cloud cover: 100%
- Daily high/low: 61 / 38.3 F
- Daily wind max: 19.1 mph
- Daily precip: 0.0905511811023622 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:07 / 19:20

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural_baitfish` | colors: ghost shad, smoke shad, olive shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Flat-Sided Crankbait: Theme: natural baitfish. Try ghost shad, smoke shad, olive shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 79 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=neutral
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

## lmb_matrix_new_york_natural_lake_04

- Label: New York natural lake, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Spawn and immediate postspawn in clear northern lakes should lean shallow target-fishing and one clean follow-up baitfish lane.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- woolly_bugger
Disallowed lanes:
- blade_bait
Expected color themes:
- watermelon_natural
- green_pumpkin_natural
- natural_baitfish

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 35.6 F
- Noon pressure: 1010.9 mb
- Noon cloud cover: 100%
- Daily high/low: 39.5 / 33.7 F
- Daily wind max: 20.7 mph
- Daily precip: 0.10236220472440946 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:21 / 19:51

Actual output:
- Top 1 lure: Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Weightless Stick Worm `weightless_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Wacky-Rigged Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Weightless Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 37 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=mid, mood=negative, presentation=subtle
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

## lmb_matrix_new_york_natural_lake_05

- Label: New York natural lake, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Spawn and immediate postspawn in clear northern lakes should lean shallow target-fishing and one clean follow-up baitfish lane.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- woolly_bugger
Disallowed lanes:
- blade_bait
Expected color themes:
- watermelon_natural
- green_pumpkin_natural
- natural_baitfish

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 70.3 F
- Noon pressure: 1010.9 mb
- Noon cloud cover: 100%
- Daily high/low: 74.6 / 57.9 F
- Daily wind max: 9.6 mph
- Daily precip: 0.027559055118110236 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:42 / 20:24

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Weightless Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Wacky-Rigged Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 82 (Excellent)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
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

## lmb_matrix_new_york_natural_lake_06

- Label: New York natural lake, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Northern GLUM-zone summer largemouth: paddle tail and finesse tools lead when conditions press subtle; swim jig leads when conditions open active.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm_minnow
- swim_jig
Acceptable secondary lanes:
- hollow_body_frog
- walking_topwater
- woolly_bugger
Disallowed lanes:
- buzzbait_prop_bait
- blade_bait
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 78.8 F
- Noon pressure: 1011 mb
- Noon cloud cover: 100%
- Daily high/low: 82.8 / 66.2 F
- Daily wind max: 13.2 mph
- Daily precip: 0.5433070866141733 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:26 / 20:49

Actual output:
- Top 1 lure: Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Drop-Shot Worm / Minnow: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Wacky-Rigged Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 58 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=neutral, presentation=subtle
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

## lmb_matrix_new_york_natural_lake_07

- Label: New York natural lake, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Northern GLUM-zone summer largemouth: paddle tail and finesse tools lead when conditions press subtle; swim jig leads when conditions open active.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm_minnow
- swim_jig
Acceptable secondary lanes:
- hollow_body_frog
- walking_topwater
- woolly_bugger
Disallowed lanes:
- buzzbait_prop_bait
- blade_bait
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 85.3 F
- Noon pressure: 1015.1 mb
- Noon cloud cover: 96%
- Daily high/low: 87.3 / 70.9 F
- Daily wind max: 9.7 mph
- Daily precip: 0.023622047244094488 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:42 / 20:43

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 49 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
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

## lmb_matrix_new_york_natural_lake_08

- Label: New York natural lake, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Northern GLUM-zone summer largemouth: paddle tail and finesse tools lead when conditions press subtle; swim jig leads when conditions open active.
Expected primary lanes:
- paddle_tail_swimbait
- drop_shot_worm_minnow
- swim_jig
Acceptable secondary lanes:
- hollow_body_frog
- walking_topwater
- woolly_bugger
Disallowed lanes:
- buzzbait_prop_bait
- blade_bait
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 76.5 F
- Noon pressure: 1015.9 mb
- Noon cloud cover: 22%
- Daily high/low: 79.2 / 66.9 F
- Daily wind max: 10.8 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:11 / 20:11

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
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

## lmb_matrix_new_york_natural_lake_09

- Label: New York natural lake, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Northern fall largemouth should respect baitfish transition lanes with swim jig and paddle tail leading edge fishing.
Expected primary lanes:
- swim_jig
- paddle_tail_swimbait
- squarebill_crankbait
Acceptable secondary lanes:
- soft_jerkbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- texas_rigged_soft_plastic_craw
Expected color themes:
- white_shad
- natural_baitfish
- metal_flash

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 68.4 F
- Noon pressure: 1020.2 mb
- Noon cloud cover: 62%
- Daily high/low: 71.8 / 58.8 F
- Daily wind max: 6.9 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:47 / 19:14

Actual output:
- Top 1 lure: Squarebill Crankbait `squarebill_crankbait` | theme: `white_shad` | colors: sexy shad, pearl shad, white chart back
- Top 3 lures:
- Squarebill Crankbait `squarebill_crankbait` | theme: `white_shad` | colors: sexy shad, pearl shad, white chart back
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Walking Topwater `walking_topwater` | theme: `white_shad` | colors: bone, white, pearl
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Squarebill Crankbait: Theme: white shad. Try sexy shad, pearl shad, white chart back.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Walking Topwater: Theme: white shad. Try bone, white, pearl.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Articulated Baitfish Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 83 (Excellent)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
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

## lmb_matrix_new_york_natural_lake_10

- Label: New York natural lake, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Northern fall largemouth should respect baitfish transition lanes with swim jig and paddle tail leading edge fishing.
Expected primary lanes:
- swim_jig
- paddle_tail_swimbait
- squarebill_crankbait
Acceptable secondary lanes:
- soft_jerkbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- texas_rigged_soft_plastic_craw
Expected color themes:
- white_shad
- natural_baitfish
- metal_flash

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 51.3 F
- Noon pressure: 1020.7 mb
- Noon cloud cover: 99%
- Daily high/low: 53.3 / 45.3 F
- Daily wind max: 13.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:19 / 18:25

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Squarebill Crankbait `squarebill_crankbait` | theme: `white_shad` | colors: sexy shad, pearl shad, white chart back
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Squarebill Crankbait: Theme: white shad. Try sexy shad, pearl shad, white chart back.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Articulated Baitfish Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 54 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
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

## lmb_matrix_new_york_natural_lake_11

- Label: New York natural lake, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Northern fall largemouth should respect baitfish transition lanes with swim jig and paddle tail leading edge fishing.
Expected primary lanes:
- swim_jig
- paddle_tail_swimbait
- squarebill_crankbait
Acceptable secondary lanes:
- soft_jerkbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- texas_rigged_soft_plastic_craw
Expected color themes:
- white_shad
- natural_baitfish
- metal_flash

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 41.7 F
- Noon pressure: 1003.5 mb
- Noon cloud cover: 100%
- Daily high/low: 42.4 / 36 F
- Daily wind max: 14.9 mph
- Daily precip: 0.1811023622047244 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:53 / 16:48

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Articulated Baitfish Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 70 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
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

## lmb_matrix_new_york_natural_lake_12

- Label: New York natural lake, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: NY
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 42.642, -76.718
- Engine status: complete

Expected seasonal story:
- Northern clear-water winter largemouth should stay disciplined around jerkbait, flat-side, and jig lanes.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- drop_shot_worm_minnow
- clouser_minnow
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 33.3 F
- Noon pressure: 993.9 mb
- Noon cloud cover: 100%
- Daily high/low: 30 / 18.6 F
- Daily wind max: 21.9 mph
- Daily precip: 0.06299212598425198 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:24 / 16:34

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Drop-Shot Worm / Minnow: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Texas-Rigged Soft-Plastic Craw: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 72 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=subtle
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

## lmb_matrix_georgia_highland_02

- Label: Georgia highland reservoir, prespawn opening month 2
- Priority: secondary
- Date: 2025-02-19
- State: GA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 34.579, -83.543
- Engine status: complete

Expected seasonal story:
- Clear highland prespawn largemouth should favor baitfish and jerkbait lanes over bulky shallow cover reads.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- football_jig
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 41.4 F
- Noon pressure: 1022.7 mb
- Noon cloud cover: 100%
- Daily high/low: 36.9 / 21.4 F
- Daily wind max: 15.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:13 / 18:22

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Texas-Rigged Soft-Plastic Craw: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Daily profile notes:
- Shared score: 48 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=neutral, presentation=subtle
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

## lmb_matrix_georgia_highland_04

- Label: Georgia highland reservoir, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: GA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 34.579, -83.543
- Engine status: complete

Expected seasonal story:
- Georgia highland spawn/postspawn largemouth should lean on target cover with compact jigs and shallow finesse.
Expected primary lanes:
- compact_flipping_jig
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- woolly_bugger
Disallowed lanes:
- hollow_body_frog
- squarebill_crankbait
Expected color themes:
- green_pumpkin_natural
- craw_natural
- watermelon_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 59.7 F
- Noon pressure: 1020.2 mb
- Noon cloud cover: 0%
- Daily high/low: 65.5 / 41.3 F
- Daily wind max: 10.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:59 / 20:08

Actual output:
- Top 1 lure: Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Rabbit-Strip Leech: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 45 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=mid, mood=negative, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,craw_natural
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

## lmb_matrix_georgia_highland_06

- Label: Georgia highland reservoir, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: GA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 34.579, -83.543
- Engine status: complete

Expected seasonal story:
- Clear highland summer largemouth should lean toward deeper structure and cover fishing with finesse backup options.
Expected primary lanes:
- compact_flipping_jig
- football_jig
- soft_jerkbait
Acceptable secondary lanes:
- swim_jig
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- buzzbait_prop_bait
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 79.3 F
- Noon pressure: 1020.1 mb
- Noon cloud cover: 11%
- Daily high/low: 82.2 / 66.7 F
- Daily wind max: 11.6 mph
- Daily precip: 0.043307086614173235 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:19 / 20:51

Actual output:
- Top 1 lure: Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Deep-Diving Crankbait `deep_diving_crankbait` | theme: `natural_baitfish` | colors: gizzard shad, olive shad, smoke shad
- Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Deep-Diving Crankbait: Theme: natural baitfish. Try gizzard shad, olive shad, smoke shad.
- Football Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 50 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=bottom, mood=active, presentation=balanced
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

## lmb_matrix_georgia_highland_10

- Label: Georgia highland reservoir, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: GA
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 34.579, -83.543
- Engine status: complete

Expected seasonal story:
- Highland fall largemouth should center on shad-oriented moving lanes with a clean backup option.
Expected primary lanes:
- squarebill_crankbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- white_shad
- natural_baitfish
- metal_flash

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 70.3 F
- Noon pressure: 1019.8 mb
- Noon cloud cover: 0%
- Daily high/low: 82.2 / 55 F
- Daily wind max: 7.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:38 / 19:00

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural_baitfish` | colors: ghost shad, smoke shad, olive shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Flat-Sided Crankbait: Theme: natural baitfish. Try ghost shad, smoke shad, olive shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 69 (Good)
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

## lmb_matrix_louisiana_grass_lake_03

- Label: Louisiana grass lake, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: LA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 30.208, -92.329
- Engine status: complete

Expected seasonal story:
- Dirty-to-stained southern prespawn grass bass should open visible grass and baitfish lanes without turning into winter bottom dragging.
Expected primary lanes:
- spinnerbait
- bladed_jig
- compact_flipping_jig
Acceptable secondary lanes:
- swim_jig
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- drop_shot_worm_minnow
- walking_topwater
Expected color themes:
- dark_contrast
- bright_contrast
- craw_natural

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 58.6 F
- Noon pressure: 1025 mb
- Noon cloud cover: 0%
- Daily high/low: 64.4 / 47.8 F
- Daily wind max: 19.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:11 / 19:22

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Bladed Jig: Theme: dark contrast. Try black/blue, black/purple, black.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 37 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=mid, mood=negative, presentation=balanced
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

## lmb_matrix_louisiana_grass_lake_06

- Label: Louisiana grass lake, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: LA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 30.208, -92.329
- Engine status: complete

Expected seasonal story:
- Warm southern grass largemouth should lean frog, swim-jig, and other cover/surface-adjacent lanes.
Expected primary lanes:
- hollow_body_frog
- swim_jig
- buzzbait_prop_bait
Acceptable secondary lanes:
- compact_flipping_jig
- texas_rigged_stick_worm
- frog_fly
Disallowed lanes:
- blade_bait
Expected color themes:
- frog_natural
- white_shad
- dark_contrast

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 86.9 F
- Noon pressure: 1017.6 mb
- Noon cloud cover: 25%
- Daily high/low: 87.4 / 75.8 F
- Daily wind max: 9.9 mph
- Daily precip: 0.13385826771653545 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:06 / 20:14

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 68 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
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

## lmb_matrix_louisiana_grass_lake_09

- Label: Louisiana grass lake, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: LA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 30.208, -92.329
- Engine status: complete

Expected seasonal story:
- Southern grass fall largemouth should still favor visible shallow cover and horizontal baitfish lanes over dead-winter behavior.
Expected primary lanes:
- bladed_jig
- spinnerbait
- swim_jig
Acceptable secondary lanes:
- hollow_body_frog
- paddle_tail_swimbait
- rabbit_strip_leech
Disallowed lanes:
- blade_bait
Expected color themes:
- dark_contrast
- bright_contrast
- frog_natural

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 88.2 F
- Noon pressure: 1017.4 mb
- Noon cloud cover: 2%
- Daily high/low: 90.6 / 72.4 F
- Daily wind max: 7.5 mph
- Daily precip: 0.03543307086614173 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:54 / 19:13

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 flies:
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Daily profile notes:
- Shared score: 50 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:frog_natural
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

## lmb_matrix_louisiana_grass_lake_11

- Label: Louisiana grass lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: LA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 30.208, -92.329
- Engine status: complete

Expected seasonal story:
- Southern grass fall largemouth should still favor visible shallow cover and horizontal baitfish lanes over dead-winter behavior.
Expected primary lanes:
- bladed_jig
- spinnerbait
- swim_jig
Acceptable secondary lanes:
- hollow_body_frog
- paddle_tail_swimbait
- rabbit_strip_leech
Disallowed lanes:
- blade_bait
Expected color themes:
- dark_contrast
- bright_contrast
- frog_natural

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 75.9 F
- Noon pressure: 1023.7 mb
- Noon cloud cover: 20%
- Daily high/low: 78.5 / 55.3 F
- Daily wind max: 7 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:31 / 17:15

Actual output:
- Top 1 lure: Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Top 3 lures:
- Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Bladed Jig: Theme: dark contrast. Try black/blue, black/purple, black.
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 55 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark_contrast,bright_contrast
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

## lmb_matrix_ozarks_reservoir_02

- Label: Ozarks reservoir, prespawn opening month 2
- Priority: secondary
- Date: 2025-02-19
- State: MO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 36.525, -93.214
- Engine status: complete

Expected seasonal story:
- Clear Ozarks prespawn largemouth should still be disciplined, with jerkbait and flat-side leading the lane.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- natural_baitfish
- white_shad
- craw_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 11.2 F
- Noon pressure: 1039.3 mb
- Noon cloud cover: 99%
- Daily high/low: 14.5 / -1.9 F
- Daily wind max: 7.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:54 / 17:59

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Daily profile notes:
- Shared score: 38 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
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

## lmb_matrix_ozarks_reservoir_05

- Label: Ozarks reservoir, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: MO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 36.525, -93.214
- Engine status: complete

Expected seasonal story:
- Postspawn Ozarks largemouth should allow cleaner shad-following lanes with one controlled backup.
Expected primary lanes:
- swim_jig
- paddle_tail_swimbait
- soft_jerkbait
Acceptable secondary lanes:
- suspending_jerkbait
- wacky_rigged_stick_worm
- game_changer
Disallowed lanes:
- blade_bait
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 83.8 F
- Noon pressure: 1004 mb
- Noon cloud cover: 92%
- Daily high/low: 85.2 / 66.7 F
- Daily wind max: 13 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:03 / 20:14

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 85 (Excellent)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,natural_baitfish
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

## lmb_matrix_ozarks_reservoir_10

- Label: Ozarks reservoir, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: MO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 36.525, -93.214
- Engine status: complete

Expected seasonal story:
- Fall Ozarks largemouth should strongly respect shad-transition lanes without collapsing into one moving bait only.
Expected primary lanes:
- squarebill_crankbait
- spinnerbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- soft_jerkbait
- suspending_jerkbait
- game_changer
Disallowed lanes:
- texas_rigged_soft_plastic_craw
Expected color themes:
- white_shad
- natural_baitfish
- metal_flash

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 75.5 F
- Noon pressure: 1021.6 mb
- Noon cloud cover: 0%
- Daily high/low: 81.1 / 60.3 F
- Daily wind max: 7 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:19 / 18:37

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural_baitfish` | colors: ghost shad, smoke shad, olive shad
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Flat-Sided Crankbait: Theme: natural baitfish. Try ghost shad, smoke shad, olive shad.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 71 (Good)
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

## lmb_matrix_ozarks_reservoir_12

- Label: Ozarks reservoir, winter control month 12
- Priority: secondary
- Date: 2025-12-10
- State: MO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 36.525, -93.214
- Engine status: complete

Expected seasonal story:
- Cold clear inland-reservoir largemouth should stay disciplined around jerkbait, flat-side, and jig lanes.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- blade_bait
- clouser_minnow
Disallowed lanes:
- hollow_body_frog
- walking_topwater
Expected color themes:
- natural_baitfish
- white_shad
- craw_natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/Chicago
- Noon air temp: 50.5 F
- Noon pressure: 1015.4 mb
- Noon cloud cover: 0%
- Daily high/low: 58.3 / 34.4 F
- Daily wind max: 11.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:12 / 16:58

Actual output:
- Top 1 lure: Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural_baitfish` | colors: ghost shad, smoke shad, olive shad
- Top 3 lures:
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural_baitfish` | colors: ghost shad, smoke shad, olive shad
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Flat-Sided Crankbait: Theme: natural baitfish. Try ghost shad, smoke shad, olive shad.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 64 (Good)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=mid, mood=neutral, presentation=subtle
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

## lmb_matrix_minnesota_weed_lake_05

- Label: Minnesota weed lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: MN
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Northern weedline largemouth around spawn/postspawn should stay shallow and target-oriented first.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- soft_jerkbait
- woolly_bugger
Disallowed lanes:
- blade_bait
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 73.9 F
- Noon pressure: 990.3 mb
- Noon cloud cover: 76%
- Daily high/low: 78.7 / 53.1 F
- Daily wind max: 23.7 mph
- Daily precip: 0.16141732283464566 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:41 / 20:48

Actual output:
- Top 1 lure: Weightless Stick Worm `weightless_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Weightless Stick Worm `weightless_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Wacky-Rigged Stick Worm `wacky_rigged_stick_worm` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Weightless Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Wacky-Rigged Stick Worm: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 71 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=neutral, presentation=balanced
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

## lmb_matrix_minnesota_weed_lake_07

- Label: Minnesota weed lake, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: MN
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Northern weedline summer largemouth should allow edge and occasional surface lanes, but still through a bass-season lens.
Expected primary lanes:
- swim_jig
- walking_topwater
- weightless_stick_worm
Acceptable secondary lanes:
- hollow_body_frog
- mouse_fly
- paddle_tail_swimbait
Disallowed lanes:
- blade_bait
Expected color themes:
- white_shad
- frog_natural
- green_pumpkin_natural

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 59.5 F
- Noon pressure: 1016.3 mb
- Noon cloud cover: 100%
- Daily high/low: 63.3 / 55.3 F
- Daily wind max: 11.3 mph
- Daily precip: 0.01968503937007874 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:39 / 21:09

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 39 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
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

## lmb_matrix_minnesota_weed_lake_08

- Label: Minnesota weed lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: MN
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Northern weedline summer largemouth should allow edge and occasional surface lanes, but still through a bass-season lens.
Expected primary lanes:
- swim_jig
- walking_topwater
- weightless_stick_worm
Acceptable secondary lanes:
- hollow_body_frog
- mouse_fly
- paddle_tail_swimbait
Disallowed lanes:
- blade_bait
Expected color themes:
- white_shad
- frog_natural
- green_pumpkin_natural

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
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 flies:
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
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
- TOP_COLOR_MATCH:white_shad,frog_natural
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

## lmb_matrix_minnesota_weed_lake_10

- Label: Minnesota weed lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: MN
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 46.7296, -94.6859
- Engine status: complete

Expected seasonal story:
- Northern early-fall weedline largemouth should open horizontal edge lanes and a surface option, but through a cooler seasonal posture.
Expected primary lanes:
- spinnerbait
- swim_jig
- walking_topwater
Acceptable secondary lanes:
- paddle_tail_swimbait
- hollow_body_frog
- mouse_fly
Disallowed lanes:
- blade_bait
Expected color themes:
- white_shad
- frog_natural
- bright_contrast

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
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Squarebill Crankbait `squarebill_crankbait` | theme: `white_shad` | colors: sexy shad, pearl shad, white chart back
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Squarebill Crankbait: Theme: white shad. Try sexy shad, pearl shad, white chart back.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Articulated Baitfish Streamer: Theme: white shad. Try white, pearl, white/silver.
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
- TOP_COLOR_MATCH:white_shad,white_shad
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

## lmb_matrix_california_delta_03

- Label: California Delta freshwater reach, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: CA
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 38.035, -121.636
- Engine status: complete

Expected seasonal story:
- Prespawn Delta largemouth should still respect current and cover, but with cleaner baitfish and target lanes than the stained late-fall version.
Expected primary lanes:
- soft_jerkbait
- compact_flipping_jig
- spinnerbait
Acceptable secondary lanes:
- swim_jig
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- walking_topwater
- blade_bait
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 56 F
- Noon pressure: 1026.3 mb
- Noon cloud cover: 49%
- Daily high/low: 61.3 / 45 F
- Daily wind max: 8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:07 / 19:20

Actual output:
- Top 1 lure: Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Top 3 lures:
- Soft Jerkbait `soft_jerkbait` | theme: `bright_contrast` | colors: bubblegum, albino, white/chartreuse
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Soft Jerkbait: Theme: bright contrast. Try bubblegum, albino, white/chartreuse.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 57 (Fair)
- Daily nudges: mood=up_1, water_column=higher_1, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
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

## lmb_matrix_california_delta_06

- Label: California Delta freshwater reach, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: CA
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 38.035, -121.636
- Engine status: complete

Expected seasonal story:
- Summer Delta largemouth should favor grass/current ambush lanes and visible cover tools, not cold-water finesse.
Expected primary lanes:
- swim_jig
- spinnerbait
- hollow_body_frog
Acceptable secondary lanes:
- bladed_jig
- compact_flipping_jig
- game_changer
Disallowed lanes:
- drop_shot_worm_minnow
- blade_bait
Expected color themes:
- frog_natural
- white_shad
- dark_contrast

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 83.3 F
- Noon pressure: 1010.8 mb
- Noon cloud cover: 0%
- Daily high/low: 94 / 58.4 F
- Daily wind max: 11.5 mph
- Daily precip: 0 in
- Moon phase: Third Quarter
- Sunrise/sunset: 05:42 / 20:33

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 flies:
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 66 (Good)
- Daily nudges: mood=up_2, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,frog_natural
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

## lmb_matrix_california_delta_09

- Label: California Delta freshwater reach, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: CA
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 38.035, -121.636
- Engine status: complete

Expected seasonal story:
- Fall Delta largemouth should still need visible horizontal or cover-oriented lanes rather than generic winter bottom reads.
Expected primary lanes:
- bladed_jig
- compact_flipping_jig
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- rabbit_strip_leech
- game_changer
Disallowed lanes:
- walking_topwater
Expected color themes:
- dark_contrast
- bright_contrast
- craw_natural

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 87.4 F
- Noon pressure: 1013.1 mb
- Noon cloud cover: 0%
- Daily high/low: 97.2 / 63.9 F
- Daily wind max: 11.9 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:49 / 19:12

Actual output:
- Top 1 lure: Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Top 3 lures:
- Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Bladed Jig: Theme: dark contrast. Try black/blue, black/purple, black.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 79 (Good)
- Daily nudges: mood=up_2, water_column=higher_1, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark_contrast
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

## lmb_matrix_california_delta_11

- Label: California Delta freshwater reach, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: CA
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 38.035, -121.636
- Engine status: complete

Expected seasonal story:
- Fall Delta largemouth should still need visible horizontal or cover-oriented lanes rather than generic winter bottom reads.
Expected primary lanes:
- bladed_jig
- compact_flipping_jig
- spinnerbait
Acceptable secondary lanes:
- paddle_tail_swimbait
- rabbit_strip_leech
- game_changer
Disallowed lanes:
- walking_topwater
Expected color themes:
- dark_contrast
- bright_contrast
- craw_natural

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 65.4 F
- Noon pressure: 1015.9 mb
- Noon cloud cover: 77%
- Daily high/low: 64.2 / 58.4 F
- Daily wind max: 18.5 mph
- Daily precip: 1.4448818897637796 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:43 / 16:58

Actual output:
- Top 1 lure: Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Top 3 lures:
- Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Bladed Jig: Theme: dark contrast. Try black/blue, black/purple, black.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 46 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark_contrast,dark_contrast
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

## lmb_matrix_socal_reservoir_01

- Label: Southern California reservoir, winter control month 1
- Priority: secondary
- Date: 2025-01-16
- State: CA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 33.68, -117.02
- Engine status: complete

Expected seasonal story:
- Mild-winter Southern California reservoir largemouth should stay lower-column and controlled; football jig leads active cold days, drop-shot wins when presentation locks fully subtle on the coldest archive days.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
- drop_shot_worm_minnow
Acceptable secondary lanes:
- compact_flipping_jig
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: southern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 62.8 F
- Noon pressure: 1019.8 mb
- Noon cloud cover: 78%
- Daily high/low: 59 / 38.4 F
- Daily wind max: 9.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:50 / 17:05

Actual output:
- Top 1 lure: Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Blade Bait `blade_bait` | theme: `white_shad` | colors: white, pearl, white/silver
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Drop-Shot Worm / Minnow: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Blade Bait: Theme: white shad. Try white, pearl, white/silver.
- Texas-Rigged Soft-Plastic Craw: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 55 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=negative, presentation=subtle
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

## lmb_matrix_socal_reservoir_04

- Label: Southern California reservoir, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: CA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 33.68, -117.02
- Engine status: complete

Expected seasonal story:
- April Southern California reservoir largemouth is still building toward spawn; WESTERN_WARM prespawn rows put football jig at the top with craw-first color reads and moving search lanes as backup.
Expected primary lanes:
- football_jig
- spinnerbait
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- swim_jig
- paddle_tail_swimbait
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- green_pumpkin_natural
- craw_natural
- white_shad

Archived env summary:
- Region: southern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 58.3 F
- Noon pressure: 1015.2 mb
- Noon cloud cover: 100%
- Daily high/low: 62.1 / 47.8 F
- Daily wind max: 14.4 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:14 / 19:21

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 lures:
- Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Lipless Crankbait `lipless_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse shad, orange craw
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Football Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Texas-Rigged Soft-Plastic Craw: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Lipless Crankbait: Theme: bright contrast. Try firetiger, chartreuse shad, orange craw.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Daily profile notes:
- Shared score: 48 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
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

## lmb_matrix_socal_reservoir_07

- Label: Southern California reservoir, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: CA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 33.68, -117.02
- Engine status: complete

Expected seasonal story:
- SoCal summer reservoir largemouth should be in active shallow-cover mode with topwater, swim jig, and frog lanes leading on warm days.
Expected primary lanes:
- walking_topwater
- swim_jig
- hollow_body_frog
Acceptable secondary lanes:
- buzzbait_prop_bait
- paddle_tail_swimbait
- compact_flipping_jig
Disallowed lanes:
- blade_bait
- drop_shot_worm_minnow
Expected color themes:
- white_shad
- frog_natural
- bright_contrast

Archived env summary:
- Region: southern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 83.9 F
- Noon pressure: 1013.2 mb
- Noon cloud cover: 0%
- Daily high/low: 88.2 / 60 F
- Daily wind max: 14.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:48 / 20:00

Actual output:
- Top 1 lure: Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 lures:
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 flies:
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 54 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:frog_natural,frog_natural
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

## lmb_matrix_socal_reservoir_10

- Label: Southern California reservoir, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: CA
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 33.68, -117.02
- Engine status: complete

Expected seasonal story:
- Fall Southern California reservoir largemouth should open baitfish-chasing lanes with spinnerbait and swim jig leading the horizontal search.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- bladed_jig
- walking_topwater
- game_changer
Disallowed lanes:
- blade_bait
Expected color themes:
- white_shad
- bright_contrast
- natural_baitfish

Archived env summary:
- Region: southern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 61.5 F
- Noon pressure: 1016.2 mb
- Noon cloud cover: 96%
- Daily high/low: 64.8 / 51.4 F
- Daily wind max: 7.5 mph
- Daily precip: 0.03937007874015748 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:52 / 18:15

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Suspending Jerkbait `suspending_jerkbait` | theme: `white_shad` | colors: pearl, table rock shad, white/silver
- Bladed Jig `bladed_jig` | theme: `dark_contrast` | colors: black/blue, black/purple, black
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Deceiver `deceiver` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Suspending Jerkbait: Theme: white shad. Try pearl, table rock shad, white/silver.
- Bladed Jig: Theme: dark contrast. Try black/blue, black/purple, black.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Deceiver: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 41 (Fair)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
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

## lmb_matrix_pnw_bass_lake_03

- Label: Pacific Northwest bass lake, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: OR
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 45.47, -123.18
- Engine status: complete

Expected seasonal story:
- March Pacific Northwest bass lake is deep prespawn; WESTERN_INLAND prespawn row puts football jig on top with crawfish-first color reads and spinnerbait as the open search lane.
Expected primary lanes:
- football_jig
- spinnerbait
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- swim_jig
- paddle_tail_swimbait
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- green_pumpkin_natural
- craw_natural
- white_shad

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 44.5 F
- Noon pressure: 1019.9 mb
- Noon cloud cover: 100%
- Daily high/low: 46 / 37.2 F
- Daily wind max: 13.7 mph
- Daily precip: 0.6181102362204725 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:12 / 19:27

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 lures:
- Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Lipless Crankbait `lipless_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse shad, orange craw
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Football Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Texas-Rigged Soft-Plastic Craw: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Lipless Crankbait: Theme: bright contrast. Try firetiger, chartreuse shad, orange craw.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Daily profile notes:
- Shared score: 62 (Good)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=bolder
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
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

## lmb_matrix_pnw_bass_lake_05

- Label: Pacific Northwest bass lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: OR
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 45.47, -123.18
- Engine status: complete

Expected seasonal story:
- May Pacific Northwest bass lake is late prespawn — WESTERN_INLAND fish don't spawn until June; football jig still leads with craw-first posture, but spinnerbait and swim jig build as activating pre-spawn search lanes.
Expected primary lanes:
- football_jig
- spinnerbait
- swim_jig
Acceptable secondary lanes:
- compact_flipping_jig
- paddle_tail_swimbait
- suspending_jerkbait
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- green_pumpkin_natural
- craw_natural
- white_shad

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 54.3 F
- Noon pressure: 1021.8 mb
- Noon cloud cover: 100%
- Daily high/low: 55.4 / 45.4 F
- Daily wind max: 5 mph
- Daily precip: 0.13385826771653545 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:39 / 20:38

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 lures:
- Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Lipless Crankbait `lipless_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse shad, orange craw
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Football Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Texas-Rigged Soft-Plastic Craw: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Lipless Crankbait: Theme: bright contrast. Try firetiger, chartreuse shad, orange craw.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Daily profile notes:
- Shared score: 43 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
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

## lmb_matrix_pnw_bass_lake_08

- Label: Pacific Northwest bass lake, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: OR
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 45.47, -123.18
- Engine status: complete

Expected seasonal story:
- Summer PNW bass lake should be in active shallow mode with topwater and swim jig leading on warm Oregon summer days.
Expected primary lanes:
- walking_topwater
- swim_jig
- hollow_body_frog
Acceptable secondary lanes:
- buzzbait_prop_bait
- paddle_tail_swimbait
- bladed_jig
Disallowed lanes:
- blade_bait
- drop_shot_worm_minnow
Expected color themes:
- white_shad
- frog_natural
- bright_contrast

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 74.7 F
- Noon pressure: 1016.8 mb
- Noon cloud cover: 25%
- Daily high/low: 79.9 / 60.6 F
- Daily wind max: 9.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:11 / 20:23

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 77 (Good)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=neutral
- Resolved profile: water_column=mid, mood=neutral, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
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

## lmb_matrix_pnw_bass_lake_11

- Label: Pacific Northwest bass lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: OR
- Context: freshwater_lake_pond
- Water clarity: stained
- Coordinates: 45.47, -123.18
- Engine status: complete

Expected seasonal story:
- November Pacific Northwest bass lake is already in winter posture — WESTERN_INLAND drops into WINTER_LAKE rows at month 11; football jig and jerkbait lead, but blade bait surfaces on neutral-mood overcast days when pressure drops and fish stay slightly active.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
- blade_bait
Acceptable secondary lanes:
- compact_flipping_jig
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- white_shad
- bright_contrast
- green_pumpkin_natural

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 57.3 F
- Noon pressure: 1010.8 mb
- Noon cloud cover: 100%
- Daily high/low: 59 / 50 F
- Daily wind max: 4.9 mph
- Daily precip: 0.6181102362204725 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:06 / 16:47

Actual output:
- Top 1 lure: Blade Bait `blade_bait` | theme: `bright_contrast` | colors: firetiger, chartreuse chrome, orange/chartreuse
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `bright_contrast` | colors: firetiger, chartreuse chrome, orange/chartreuse
- Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Blade Bait: Theme: bright contrast. Try firetiger, chartreuse chrome, orange/chartreuse.
- Drop-Shot Worm / Minnow: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Texas-Rigged Soft-Plastic Craw: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 78 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=bottom, mood=neutral, presentation=balanced
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

## lmb_matrix_colorado_bass_lake_02

- Label: Colorado highland reservoir, prespawn opening month 2
- Priority: secondary
- Date: 2025-02-19
- State: CO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 40.55, -105.17
- Engine status: complete

Expected seasonal story:
- February Colorado highland reservoir largemouth is fully in winter posture — football jig leads most days, but drop-shot wins on the coldest extreme-bottom days when subtle presentation locks in and finesse edges out the jig.
Expected primary lanes:
- football_jig
- suspending_jerkbait
- flat_sided_crankbait
- drop_shot_worm_minnow
Acceptable secondary lanes:
- shaky_head_worm
- paddle_tail_swimbait
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 7 F
- Noon pressure: 1039.1 mb
- Noon cloud cover: 100%
- Daily high/low: 21.6 / 3.7 F
- Daily wind max: 4.1 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:46 / 17:42

Actual output:
- Top 1 lure: Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Drop-Shot Worm / Minnow `drop_shot_worm_minnow` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Blade Bait `blade_bait` | theme: `white_shad` | colors: white, pearl, white/silver
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Drop-Shot Worm / Minnow: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Blade Bait: Theme: white shad. Try white, pearl, white/silver.
- Texas-Rigged Soft-Plastic Craw: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 39 (Poor)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=neutral
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

## lmb_matrix_colorado_bass_lake_05

- Label: Colorado highland reservoir, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: CO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 40.55, -105.17
- Engine status: complete

Expected seasonal story:
- May Colorado highland reservoir is late prespawn — mountain_west fish don't spawn until June; football jig leads most days, but texas-rigged craw can edge it out when low-pressure bottoms out presentation and bottom-column focus shifts to a slow-drag finesse.
Expected primary lanes:
- football_jig
- texas_rigged_soft_plastic_craw
- spinnerbait
- suspending_jerkbait
Acceptable secondary lanes:
- compact_flipping_jig
- paddle_tail_swimbait
- swim_jig
Disallowed lanes:
- hollow_body_frog
Expected color themes:
- green_pumpkin_natural
- craw_natural
- natural_baitfish

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 61.8 F
- Noon pressure: 1002.6 mb
- Noon cloud cover: 3%
- Daily high/low: 63.8 / 42.4 F
- Daily wind max: 11.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:41 / 20:12

Actual output:
- Top 1 lure: Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Texas-Rigged Soft-Plastic Craw: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 47 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=neutral, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:green_pumpkin_natural,craw_natural
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

## lmb_matrix_colorado_bass_lake_08

- Label: Colorado highland reservoir, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: CO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 40.55, -105.17
- Engine status: complete

Expected seasonal story:
- Colorado highland reservoir summer largemouth should be in active mode; topwater and swim jig lead on shallow-surface days, but paddle-tail swimbait takes over when wind and pressure push water column to mid rather than purely shallow.
Expected primary lanes:
- walking_topwater
- swim_jig
- hollow_body_frog
- paddle_tail_swimbait
Acceptable secondary lanes:
- buzzbait_prop_bait
- compact_flipping_jig
Disallowed lanes:
- blade_bait
- drop_shot_worm_minnow
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 90.8 F
- Noon pressure: 1007.6 mb
- Noon cloud cover: 58%
- Daily high/low: 90.8 / 56.3 F
- Daily wind max: 16.7 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:09 / 20:01

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Color notes:
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Daily profile notes:
- Shared score: 35 (Poor)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=mid, mood=active, presentation=subtle
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

## lmb_matrix_colorado_bass_lake_10

- Label: Colorado highland reservoir, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: CO
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 40.55, -105.17
- Engine status: complete

Expected seasonal story:
- October Colorado highland reservoir fall largemouth should open spinnerbait and baitfish-following lanes with clean natural colors.
Expected primary lanes:
- spinnerbait
- swim_jig
- paddle_tail_swimbait
Acceptable secondary lanes:
- bladed_jig
- squarebill_crankbait
- game_changer
Disallowed lanes:
- blade_bait
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 59.3 F
- Noon pressure: 1012.1 mb
- Noon cloud cover: 5%
- Daily high/low: 66 / 44.8 F
- Daily wind max: 7.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:10 / 18:21

Actual output:
- Top 1 lure: Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 lures:
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Squarebill Crankbait `squarebill_crankbait` | theme: `white_shad` | colors: sexy shad, pearl shad, white chart back
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Deceiver `deceiver` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Color notes:
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Squarebill Crankbait: Theme: white shad. Try sexy shad, pearl shad, white chart back.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Deceiver: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Daily profile notes:
- Shared score: 73 (Good)
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

## lmb_matrix_northeast_maine_lake_01

- Label: Maine clear natural lake, winter control month 1
- Priority: secondary
- Date: 2025-01-16
- State: ME
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 43.87, -70.56
- Engine status: complete

Expected seasonal story:
- Northeast clear-lake winter largemouth should open with jerkbait and flat-side in front — NORTHERN_CLEAR_WINTER_LAKE puts suspending jerkbait at position 0, not football jig.
Expected primary lanes:
- suspending_jerkbait
- flat_sided_crankbait
- football_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- shaky_head_worm
- clouser_minnow
Disallowed lanes:
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural_baitfish
- white_shad
- green_pumpkin_natural

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 25.4 F
- Noon pressure: 1012.4 mb
- Noon cloud cover: 100%
- Daily high/low: 31.7 / 14.4 F
- Daily wind max: 6.1 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:10 / 16:33

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Flat-Sided Crankbait `flat_sided_crankbait` | theme: `natural_baitfish` | colors: ghost shad, smoke shad, olive shad
- Football Jig `football_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 1 fly: Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 3 flies:
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Woolly Bugger `woolly_bugger` | theme: `natural_baitfish` | colors: olive, white/olive, gray/white
- Sculpin Streamer `sculpin_streamer` | theme: `natural_baitfish` | colors: olive, sculpin olive, tan/olive
- Color notes:
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Flat-Sided Crankbait: Theme: natural baitfish. Try ghost shad, smoke shad, olive shad.
- Football Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Rabbit-Strip Leech: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Woolly Bugger: Theme: natural baitfish. Try olive, white/olive, gray/white.
- Sculpin Streamer: Theme: natural baitfish. Try olive, sculpin olive, tan/olive.
- Daily profile notes:
- Shared score: 38 (Poor)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=bottom, mood=negative, presentation=subtle
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

## lmb_matrix_northeast_maine_lake_05

- Label: Maine clear natural lake, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: ME
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 43.87, -70.56
- Engine status: complete

Expected seasonal story:
- Northeast clear-lake spawn and postspawn largemouth should open with finesse stick-worm lanes first; compact jig surfaces when crawfish-primary forage scoring edges it ahead of stick worms on pre-spawn structure days.
Expected primary lanes:
- weightless_stick_worm
- wacky_rigged_stick_worm
- swim_jig
- compact_flipping_jig
Acceptable secondary lanes:
- soft_jerkbait
- paddle_tail_swimbait
- woolly_bugger
Disallowed lanes:
- hollow_body_frog
- blade_bait
Expected color themes:
- watermelon_natural
- green_pumpkin_natural
- natural_baitfish

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 70.3 F
- Noon pressure: 1014.2 mb
- Noon cloud cover: 94%
- Daily high/low: 70.3 / 51.7 F
- Daily wind max: 9.8 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:14 / 20:02

Actual output:
- Top 1 lure: Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Top 3 lures:
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 65 (Good)
- Daily nudges: mood=up_1, water_column=neutral, presentation=neutral
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

## lmb_matrix_northeast_maine_lake_07

- Label: Maine clear natural lake, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: ME
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 43.87, -70.56
- Engine status: complete

Expected seasonal story:
- Northeast clear-lake summer largemouth: wacky rig and stick worm lead on subtle days; swim jig with perch/bluegill colors takes over on hot bluebird days when active mood and bluegill_perch forage scoring push horizontal presentations ahead of finesse.
Expected primary lanes:
- wacky_rigged_stick_worm
- weightless_stick_worm
- drop_shot_worm_minnow
- swim_jig
Acceptable secondary lanes:
- soft_jerkbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- buzzbait_prop_bait
- blade_bait
Expected color themes:
- watermelon_natural
- green_pumpkin_natural
- natural_baitfish
- perch_bluegill

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 85.7 F
- Noon pressure: 1015.8 mb
- Noon cloud cover: 3%
- Daily high/low: 87.5 / 71.5 F
- Daily wind max: 10.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:13 / 20:23

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `perch_bluegill` | colors: perch, bluegill, olive/orange
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `perch_bluegill` | colors: perch, bluegill, olive/orange
- Soft Jerkbait `soft_jerkbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Walking Topwater `walking_topwater` | theme: `perch_bluegill` | colors: perch, bluegill, olive/orange
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Color notes:
- Swim Jig: Theme: perch bluegill. Try perch, bluegill, olive/orange.
- Soft Jerkbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Walking Topwater: Theme: perch bluegill. Try perch, bluegill, olive/orange.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Daily profile notes:
- Shared score: 44 (Fair)
- Daily nudges: mood=neutral, water_column=neutral, presentation=subtler
- Resolved profile: water_column=shallow, mood=active, presentation=subtle
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:perch_bluegill
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

## lmb_matrix_northeast_maine_lake_11

- Label: Maine clear natural lake, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: ME
- Context: freshwater_lake_pond
- Water clarity: clear
- Coordinates: 43.87, -70.56
- Engine status: complete

Expected seasonal story:
- Northeast November clear-lake largemouth stays in active fall posture — NORTHERN_CLEAR_FALL_LAKE fires at month 11 with spinnerbait and swim jig leading a mid/active baitfish window, not the locked-down winter posture that GLUM enters in November.
Expected primary lanes:
- spinnerbait
- swim_jig
- squarebill_crankbait
Acceptable secondary lanes:
- suspending_jerkbait
- paddle_tail_swimbait
- game_changer
Disallowed lanes:
- hollow_body_frog
- blade_bait
Expected color themes:
- white_shad
- natural_baitfish
- metal_flash

Archived env summary:
- Region: northeast
- Archive weather timezone: America/New_York
- Noon air temp: 40.7 F
- Noon pressure: 1004.1 mb
- Noon cloud cover: 98%
- Daily high/low: 43.6 / 34.7 F
- Daily wind max: 7.7 mph
- Daily precip: 0.023622047244094488 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:32 / 16:20

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural_baitfish` | colors: ghost minnow, pro blue, olive shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Top 1 fly: Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 flies:
- Game Changer `game_changer` | theme: `white_shad` | colors: white, pearl, white/silver
- Clouser Minnow `clouser_minnow` | theme: `natural_baitfish` | colors: olive/white, shad, smoke shad
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `white_shad` | colors: white, pearl, white/silver
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Suspending Jerkbait: Theme: natural baitfish. Try ghost minnow, pro blue, olive shad.
- Paddle-Tail Swimbait: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Game Changer: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: natural baitfish. Try olive/white, shad, smoke shad.
- Articulated Baitfish Streamer: Theme: white shad. Try white, pearl, white/silver.
- Daily profile notes:
- Shared score: 53 (Fair)
- Daily nudges: mood=up_1, water_column=neutral, presentation=bolder
- Resolved profile: water_column=mid, mood=active, presentation=balanced
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:white_shad,white_shad
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

## lmb_matrix_gulf_dirty_grass_lake_03

- Label: Gulf Coast dirty grass lake, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: LA
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 30.18, -91.82
- Engine status: complete

Expected seasonal story:
- Gulf Coast dirty prespawn grass lake fires the GULF_DIRTY_PRESPAWN pool: all lures are dirty-friendly so position dominates; spinnerbait leads, bladed jig is close second, compact jig surfaces on slower days.
Expected primary lanes:
- spinnerbait
- bladed_jig
- compact_flipping_jig
- swim_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- lipless_crankbait
- clouser_minnow
Disallowed lanes:
- suspending_jerkbait
- football_jig
- hollow_body_frog
Expected color themes:
- bright_contrast
- white_shad
- dark_contrast

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 57.7 F
- Noon pressure: 1024.5 mb
- Noon cloud cover: 0%
- Daily high/low: 62.6 / 47.6 F
- Daily wind max: 18.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:09 / 19:20

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Compact Flipping / Pitching Jig `compact_flipping_jig` | theme: `green_pumpkin_natural` | colors: green pumpkin, green pumpkin blue, pb&j
- Bladed Jig `bladed_jig` | theme: `white_shad` | colors: white, white/chartreuse, pearl shad
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark_contrast` | colors: black, black/purple, black/blue
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Compact Flipping / Pitching Jig: Theme: green pumpkin natural. Try green pumpkin, green pumpkin blue, pb&j.
- Bladed Jig: Theme: white shad. Try white, white/chartreuse, pearl shad.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Rabbit-Strip Leech: Theme: dark contrast. Try black, black/purple, black/blue.
- Daily profile notes:
- Shared score: 36 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=mid, mood=negative, presentation=bold
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

## lmb_matrix_gulf_dirty_grass_lake_09

- Label: Gulf Coast dirty grass lake, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: LA
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 30.18, -91.82
- Engine status: complete

Expected seasonal story:
- Gulf Coast dirty fall grass lake: walking_topwater is penalized in dirty water so buzzbait, swim jig, spinnerbait, or bladed jig wins in early fall (month 9); spinnerbait locks up October FALL_LAKE with position-0 plus dirty bonus.
Expected primary lanes:
- buzzbait_prop_bait
- swim_jig
- spinnerbait
- bladed_jig
- hollow_body_frog
Acceptable secondary lanes:
- paddle_tail_swimbait
- lipless_crankbait
- game_changer
Disallowed lanes:
- walking_topwater
- suspending_jerkbait
- squarebill_crankbait
Expected color themes:
- bright_contrast
- white_shad
- dark_contrast

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 87.2 F
- Noon pressure: 1017.5 mb
- Noon cloud cover: 20%
- Daily high/low: 91.3 / 71.1 F
- Daily wind max: 7.5 mph
- Daily precip: 0.07086614173228346 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:51 / 19:11

Actual output:
- Top 1 lure: Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 3 lures:
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 1 fly: Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 flies:
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Popper Fly `popper_fly` | theme: `bright_contrast` | colors: chartreuse, yellow, firetiger
- Color notes:
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Popper Fly: Theme: bright contrast. Try chartreuse, yellow, firetiger.
- Daily profile notes:
- Shared score: 52 (Fair)
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

## lmb_matrix_gulf_dirty_grass_lake_10

- Label: Gulf Coast dirty grass lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: LA
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 30.18, -91.82
- Engine status: complete

Expected seasonal story:
- Gulf Coast dirty fall grass lake: walking_topwater is penalized in dirty water so buzzbait, swim jig, spinnerbait, or bladed jig wins in early fall (month 9); spinnerbait locks up October FALL_LAKE with position-0 plus dirty bonus.
Expected primary lanes:
- buzzbait_prop_bait
- swim_jig
- spinnerbait
- bladed_jig
- hollow_body_frog
Acceptable secondary lanes:
- paddle_tail_swimbait
- lipless_crankbait
- game_changer
Disallowed lanes:
- walking_topwater
- suspending_jerkbait
- squarebill_crankbait
Expected color themes:
- bright_contrast
- white_shad
- dark_contrast

Archived env summary:
- Region: gulf_coast
- Archive weather timezone: America/Chicago
- Noon air temp: 84.1 F
- Noon pressure: 1016.5 mb
- Noon cloud cover: 0%
- Daily high/low: 88.4 / 59.7 F
- Daily wind max: 7.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:08 / 18:37

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Bladed Jig `bladed_jig` | theme: `white_shad` | colors: white, white/chartreuse, pearl shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Popper Fly `popper_fly` | theme: `bright_contrast` | colors: chartreuse, yellow, firetiger
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Bladed Jig: Theme: white shad. Try white, white/chartreuse, pearl shad.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Popper Fly: Theme: bright contrast. Try chartreuse, yellow, firetiger.
- Daily profile notes:
- Shared score: 47 (Fair)
- Daily nudges: mood=neutral, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=active, presentation=balanced
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

## lmb_matrix_midwest_dirty_backwater_03

- Label: Midwest dirty backwater lake, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: IL
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.3, -90.04
- Engine status: complete

Expected seasonal story:
- Midwest dirty backwater prespawn: football jig holds at position 0 via crawfish forage match plus dirty bonus; spinnerbait and bladed jig surface with dirty clarity boost but lack the forage alignment; suspending jerkbait drops away.
Expected primary lanes:
- football_jig
- texas_rigged_soft_plastic_craw
- spinnerbait
- bladed_jig
Acceptable secondary lanes:
- lipless_crankbait
- compact_flipping_jig
- woolly_bugger
Disallowed lanes:
- suspending_jerkbait
- squarebill_crankbait
- walking_topwater
Expected color themes:
- craw_natural
- dark_contrast
- green_pumpkin_natural

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/Chicago
- Noon air temp: 40.4 F
- Noon pressure: 1018.1 mb
- Noon cloud cover: 0%
- Daily high/low: 44.4 / 32.7 F
- Daily wind max: 22.1 mph
- Daily precip: 0.16141732283464566 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:01 / 19:13

Actual output:
- Top 1 lure: Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 lures:
- Football Jig `football_jig` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Texas-Rigged Soft-Plastic Craw `texas_rigged_soft_plastic_craw` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Lipless Crankbait `lipless_crankbait` | theme: `bright_contrast` | colors: firetiger, chartreuse shad, orange craw
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Sculpin Streamer `sculpin_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Crawfish Streamer `crawfish_streamer` | theme: `craw_natural` | colors: brown/orange, rust brown, amber brown
- Color notes:
- Football Jig: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Texas-Rigged Soft-Plastic Craw: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Lipless Crankbait: Theme: bright contrast. Try firetiger, chartreuse shad, orange craw.
- Woolly Bugger: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Sculpin Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Crawfish Streamer: Theme: craw natural. Try brown/orange, rust brown, amber brown.
- Daily profile notes:
- Shared score: 29 (Poor)
- Daily nudges: mood=down_1, water_column=lower_1, presentation=subtler
- Resolved profile: water_column=bottom, mood=negative, presentation=balanced
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

## lmb_matrix_midwest_dirty_backwater_07

- Label: Midwest dirty backwater lake, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: IL
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.3, -90.04
- Engine status: complete

Expected seasonal story:
- Midwest dirty backwater summer: walking_topwater drops off in dirty water; popping_topwater, buzzbait, hollow body frog, and swim jig all carry dirty-water clarity bonuses and compete for the top slot on active shallow days; hollow_body_frog wins on bold active baitfish days and produces frog_natural colors.
Expected primary lanes:
- popping_topwater
- buzzbait_prop_bait
- hollow_body_frog
- swim_jig
Acceptable secondary lanes:
- paddle_tail_swimbait
- texas_rigged_stick_worm
- frog_fly
Disallowed lanes:
- walking_topwater
- deep_diving_crankbait
- blade_bait
Expected color themes:
- bright_contrast
- dark_contrast
- white_shad
- frog_natural

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/Chicago
- Noon air temp: 88.1 F
- Noon pressure: 1010.4 mb
- Noon cloud cover: 5%
- Daily high/low: 89.2 / 72.1 F
- Daily wind max: 15.2 mph
- Daily precip: 0.6377952755905512 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:42 / 20:29

Actual output:
- Top 1 lure: Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 lures:
- Hollow-Body Frog `hollow_body_frog` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Swim Jig `swim_jig` | theme: `white_shad` | colors: white, pearl, white/silver
- Popping Topwater `popping_topwater` | theme: `bright_contrast` | colors: firetiger, chartreuse, orange belly
- Top 1 fly: Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Top 3 flies:
- Topwater Frog Fly `frog_fly` | theme: `frog_natural` | colors: leopard frog, bullfrog, black frog
- Topwater Mouse Fly `mouse_fly` | theme: `mouse_natural` | colors: gray mouse, brown mouse, black mouse
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Color notes:
- Hollow-Body Frog: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Swim Jig: Theme: white shad. Try white, pearl, white/silver.
- Popping Topwater: Theme: bright contrast. Try firetiger, chartreuse, orange belly.
- Topwater Frog Fly: Theme: frog natural. Try leopard frog, bullfrog, black frog.
- Topwater Mouse Fly: Theme: mouse natural. Try gray mouse, brown mouse, black mouse.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Daily profile notes:
- Shared score: 67 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=bolder
- Resolved profile: water_column=shallow, mood=active, presentation=bold
- Variables considered: temperature_condition, pressure_regime, wind_condition, light_cloud_condition, precipitation_disruption

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:frog_natural,frog_natural
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

## lmb_matrix_midwest_dirty_backwater_10

- Label: Midwest dirty backwater lake, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: IL
- Context: freshwater_lake_pond
- Water clarity: dirty
- Coordinates: 40.3, -90.04
- Engine status: complete

Expected seasonal story:
- Midwest dirty backwater fall: spinnerbait at position 0 with dirty clarity bonus dominates the FALL_LAKE pool; bladed jig and lipless crankbait round out the dirty-water baitfish set; clear-water lures are suppressed.
Expected primary lanes:
- spinnerbait
- bladed_jig
- lipless_crankbait
- paddle_tail_swimbait
Acceptable secondary lanes:
- swim_jig
- compact_flipping_jig
- clouser_minnow
Disallowed lanes:
- suspending_jerkbait
- squarebill_crankbait
- walking_topwater
Expected color themes:
- white_shad
- bright_contrast
- dark_contrast

Archived env summary:
- Region: midwest_interior
- Archive weather timezone: America/Chicago
- Noon air temp: 73.1 F
- Noon pressure: 1022.2 mb
- Noon cloud cover: 39%
- Daily high/low: 73.8 / 57.5 F
- Daily wind max: 7.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:10 / 18:21

Actual output:
- Top 1 lure: Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Top 3 lures:
- Spinnerbait `spinnerbait` | theme: `bright_contrast` | colors: white/chartreuse, firetiger, chartreuse/white
- Bladed Jig `bladed_jig` | theme: `white_shad` | colors: white, white/chartreuse, pearl shad
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `white_shad` | colors: white, pearl, white/silver
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `bright_contrast` | colors: white/chartreuse, chartreuse/white, firetiger
- Woolly Bugger `woolly_bugger` | theme: `dark_contrast` | colors: black, black/olive, black/purple
- Popper Fly `popper_fly` | theme: `bright_contrast` | colors: chartreuse, yellow, firetiger
- Color notes:
- Spinnerbait: Theme: bright contrast. Try white/chartreuse, firetiger, chartreuse/white.
- Bladed Jig: Theme: white shad. Try white, white/chartreuse, pearl shad.
- Paddle-Tail Swimbait: Theme: white shad. Try white, pearl, white/silver.
- Clouser Minnow: Theme: bright contrast. Try white/chartreuse, chartreuse/white, firetiger.
- Woolly Bugger: Theme: dark contrast. Try black, black/olive, black/purple.
- Popper Fly: Theme: bright contrast. Try chartreuse, yellow, firetiger.
- Daily profile notes:
- Shared score: 69 (Good)
- Daily nudges: mood=neutral, water_column=neutral, presentation=neutral
- Resolved profile: water_column=shallow, mood=active, presentation=balanced
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

