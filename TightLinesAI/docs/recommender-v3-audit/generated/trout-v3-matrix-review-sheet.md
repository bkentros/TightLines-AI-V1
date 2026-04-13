# Trout V3 Matrix Review Sheet

Generated: 2026-04-10T19:54:19.116Z
Archive bundle generated: 2026-04-04T21:03:35.392Z
Scenario count: 68
Contexts: 0 lake/pond, 68 river
Priority mix: 48 core, 20 secondary
Completed engine runs: 68/68

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

## trout_matrix_appalachian_tailwater_01

- Label: Appalachian clear tailwater, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- A clear Appalachian winter tailwater should stay subtle and lower-column with sculpin, bugger, leech, and disciplined hair support.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- conehead_streamer
- hair_jig
- suspending_jerkbait
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 45.7 F
- Noon pressure: 1019 mb
- Noon cloud cover: 80%
- Daily high/low: 53.5 / 25.9 F
- Daily wind max: 4.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:40 / 17:47

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Blade Bait `blade_bait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Blade Bait: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid_low, likely_column_today=mid, seasonal_location=mid_deep, posture=slightly_aggressive, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_appalachian_tailwater_02

- Label: Appalachian clear tailwater, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- Late-winter and early-spring Appalachian trout should open slim-minnow and spinner lanes carefully without getting loud; the coldest bottom-push days can still elevate sculpin-style streamers and disciplined hair or jerkbait support.
Expected primary lanes:
- slim_minnow_streamer
- inline_spinner
- woolly_bugger
- sculpin_streamer
Acceptable secondary lanes:
- clouser_minnow
- suspending_jerkbait
- muddler_sculpin
- hair_jig
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 40.1 F
- Noon pressure: 1022.9 mb
- Noon cloud cover: 100%
- Daily high/low: 30.5 / 19.4 F
- Daily wind max: 9.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:13 / 18:21

Actual output:
- Top 1 lure: Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Hair Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.8/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_appalachian_tailwater_03

- Label: Appalachian clear tailwater, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- Late-winter and early-spring Appalachian trout should open slim-minnow and spinner lanes carefully without getting loud; the coldest bottom-push days can still elevate sculpin-style streamers and disciplined hair or jerkbait support.
Expected primary lanes:
- slim_minnow_streamer
- inline_spinner
- woolly_bugger
- sculpin_streamer
Acceptable secondary lanes:
- clouser_minnow
- suspending_jerkbait
- muddler_sculpin
- hair_jig
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 54.5 F
- Noon pressure: 1008.5 mb
- Noon cloud cover: 12%
- Daily high/low: 54.9 / 36.3 F
- Daily wind max: 14.4 mph
- Daily precip: 0.22440944881889766 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:35 / 19:46

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_appalachian_tailwater_04

- Label: Appalachian clear tailwater, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- Spring Appalachian trout should stay current-aware with minnow, bugger, and spinner lanes rather than broad power-fishing behavior.
Expected primary lanes:
- slim_minnow_streamer
- woolly_bugger
- inline_spinner
Acceptable secondary lanes:
- clouser_minnow
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 57.6 F
- Noon pressure: 1020.3 mb
- Noon cloud cover: 0%
- Daily high/low: 62.3 / 38.8 F
- Daily wind max: 7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:57 / 20:09

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Balanced Leech `balanced_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Balanced Leech: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3.1/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_appalachian_tailwater_05

- Label: Appalachian clear tailwater, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- Spring Appalachian trout should stay current-aware with minnow, bugger, and spinner lanes rather than broad power-fishing behavior.
Expected primary lanes:
- slim_minnow_streamer
- woolly_bugger
- inline_spinner
Acceptable secondary lanes:
- clouser_minnow
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 77.3 F
- Noon pressure: 1012.4 mb
- Noon cloud cover: 100%
- Daily high/low: 79.7 / 59 F
- Daily wind max: 9.3 mph
- Daily precip: 0.07480314960629922 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:27 / 20:32

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high_top, seasonal_location=shallow, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_appalachian_tailwater_06

- Label: Appalachian clear tailwater, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- Summer tailwater trout should tighten into controlled sculpin, bugger, and leech lanes, only allowing a mouse as a narrow supporting read.
Expected primary lanes:
- muddler_sculpin
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- sculpin_streamer
- slim_minnow_streamer
- mouse_fly
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 77.9 F
- Noon pressure: 1020.2 mb
- Noon cloud cover: 27%
- Daily high/low: 83 / 65.6 F
- Daily wind max: 8.2 mph
- Daily precip: 0.043307086614173235 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:17 / 20:53

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_appalachian_tailwater_07

- Label: Appalachian clear tailwater, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- Summer tailwater trout should tighten into controlled sculpin, bugger, and leech lanes, only allowing a mouse as a narrow supporting read.
Expected primary lanes:
- muddler_sculpin
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- sculpin_streamer
- slim_minnow_streamer
- mouse_fly
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 81.9 F
- Noon pressure: 1020.2 mb
- Noon cloud cover: 42%
- Daily high/low: 86.9 / 67.6 F
- Daily wind max: 6.5 mph
- Daily precip: 0.14173228346456693 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:29 / 20:50

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_appalachian_tailwater_08

- Label: Appalachian clear tailwater, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- Summer tailwater trout should tighten into controlled sculpin, bugger, and leech lanes, only allowing a mouse as a narrow supporting read.
Expected primary lanes:
- muddler_sculpin
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- sculpin_streamer
- slim_minnow_streamer
- mouse_fly
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 80.9 F
- Noon pressure: 1017.2 mb
- Noon cloud cover: 22%
- Daily high/low: 84.7 / 67.3 F
- Daily wind max: 3.9 mph
- Daily precip: 0.043307086614173235 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:51 / 20:25

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (4.1/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Elevated flow suppresses posture and tightens fish to safer holding lanes.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_appalachian_tailwater_09

- Label: Appalachian clear tailwater, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- Fall Appalachian trout should reopen baitfish and articulated streamer lanes while staying trout-clean and current-aware.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- game_changer
Acceptable secondary lanes:
- zonker_streamer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 75.1 F
- Noon pressure: 1018.8 mb
- Noon cloud cover: 11%
- Daily high/low: 80.7 / 58.6 F
- Daily wind max: 5.6 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:17 / 19:39

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Mouse Fly `mouse_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Mouse Fly: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.8/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_aggressive, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_appalachian_tailwater_10

- Label: Appalachian clear tailwater, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- Fall Appalachian trout should reopen baitfish and articulated streamer lanes while staying trout-clean and current-aware.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- game_changer
Acceptable secondary lanes:
- zonker_streamer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 70.1 F
- Noon pressure: 1020 mb
- Noon cloud cover: 0%
- Daily high/low: 81.3 / 48.2 F
- Daily wind max: 6.7 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:39 / 18:59

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Articulated Dungeon Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_aggressive, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_appalachian_tailwater_11

- Label: Appalachian clear tailwater, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- Fall Appalachian trout should reopen baitfish and articulated streamer lanes while staying trout-clean and current-aware.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- game_changer
Acceptable secondary lanes:
- zonker_streamer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 55.1 F
- Noon pressure: 1020.4 mb
- Noon cloud cover: 0%
- Daily high/low: 62.3 / 33.8 F
- Daily wind max: 6.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:05 / 17:30

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_appalachian_tailwater_12

- Label: Appalachian clear tailwater, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: NC
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 35.4306, -83.4477
- Engine status: complete

Expected seasonal story:
- A clear Appalachian winter tailwater should stay subtle and lower-column with sculpin, bugger, leech, and disciplined hair support.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- conehead_streamer
- hair_jig
- suspending_jerkbait
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 50.7 F
- Noon pressure: 1007.2 mb
- Noon cloud cover: 16%
- Daily high/low: 44.6 / 32.1 F
- Daily wind max: 9.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:30 / 17:22

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (7.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=mid, seasonal_location=mid_deep, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_northeast_freestone_01

- Label: Northeast freestone river, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Northeast winter freestone trout should stay subtle and lower-column with sculpin, bugger, and leech control.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- conehead_streamer
- suspending_jerkbait
- hair_jig
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 17.9 F
- Noon pressure: 1011.1 mb
- Noon cloud cover: 100%
- Daily high/low: 32.4 / 21.7 F
- Daily wind max: 14.1 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:32 / 17:07

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_northeast_freestone_02

- Label: Northeast freestone river, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Early-spring freestone trout should open slim-minnow, bugger, and spinner lanes without turning flashy, while still allowing sculpin-style streamers to lead on the coldest bottom-oriented days.
Expected primary lanes:
- slim_minnow_streamer
- woolly_bugger
- inline_spinner
- sculpin_streamer
Acceptable secondary lanes:
- clouser_minnow
- muddler_sculpin
- suspending_jerkbait
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 16.9 F
- Noon pressure: 1029.9 mb
- Noon cloud cover: 100%
- Daily high/low: 17.5 / 5.2 F
- Daily wind max: 13.7 mph
- Daily precip: 0.08661417322834647 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:57 / 17:49

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_northeast_freestone_03

- Label: Northeast freestone river, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Early-spring freestone trout should open slim-minnow, bugger, and spinner lanes without turning flashy, while still allowing sculpin-style streamers to lead on the coldest bottom-oriented days.
Expected primary lanes:
- slim_minnow_streamer
- woolly_bugger
- inline_spinner
- sculpin_streamer
Acceptable secondary lanes:
- clouser_minnow
- muddler_sculpin
- suspending_jerkbait
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 51.4 F
- Noon pressure: 1002.1 mb
- Noon cloud cover: 100%
- Daily high/low: 53.3 / 34 F
- Daily wind max: 18.6 mph
- Daily precip: 0.0905511811023622 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:10 / 19:23

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_northeast_freestone_04

- Label: Northeast freestone river, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Spring northern freestone trout should still feel disciplined around minnow, sculpin, and bugger lanes.
Expected primary lanes:
- slim_minnow_streamer
- sculpin_streamer
- woolly_bugger
Acceptable secondary lanes:
- clouser_minnow
- inline_spinner
- muddler_sculpin
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 36.1 F
- Noon pressure: 1012.1 mb
- Noon cloud cover: 100%
- Daily high/low: 37.5 / 30.5 F
- Daily wind max: 19.4 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:25 / 19:53

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Strong river wind hurts comfort without creating a true feeding advantage.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_northeast_freestone_05

- Label: Northeast freestone river, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Spring northern freestone trout should still feel disciplined around minnow, sculpin, and bugger lanes.
Expected primary lanes:
- slim_minnow_streamer
- sculpin_streamer
- woolly_bugger
Acceptable secondary lanes:
- clouser_minnow
- inline_spinner
- muddler_sculpin
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 66.7 F
- Noon pressure: 1011.3 mb
- Noon cloud cover: 89%
- Daily high/low: 71.7 / 55.1 F
- Daily wind max: 6.8 mph
- Daily precip: 0.07874015748031496 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:47 / 20:24

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_northeast_freestone_06

- Label: Northeast freestone river, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Summer freestone trout should allow clean minnow lanes and one controlled mouse option, but not noisy warmwater surface behavior.
Expected primary lanes:
- slim_minnow_streamer
- clouser_minnow
- muddler_sculpin
Acceptable secondary lanes:
- woolly_bugger
- mouse_fly
- inline_spinner
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 72.8 F
- Noon pressure: 1012.8 mb
- Noon cloud cover: 100%
- Daily high/low: 76.5 / 65.1 F
- Daily wind max: 8.4 mph
- Daily precip: 0.46456692913385833 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:33 / 20:48

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Elevated flow suppresses posture and tightens fish to safer holding lanes.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_northeast_freestone_07

- Label: Northeast freestone river, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Summer freestone trout should allow clean minnow lanes and one controlled mouse option, but not noisy warmwater surface behavior.
Expected primary lanes:
- slim_minnow_streamer
- clouser_minnow
- muddler_sculpin
Acceptable secondary lanes:
- woolly_bugger
- mouse_fly
- inline_spinner
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 81.9 F
- Noon pressure: 1016.3 mb
- Noon cloud cover: 100%
- Daily high/low: 84.1 / 66.2 F
- Daily wind max: 9.2 mph
- Daily precip: 0.15748031496062992 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:48 / 20:43

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_northeast_freestone_08

- Label: Northeast freestone river, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Summer freestone trout should allow clean minnow lanes and one controlled mouse option, but not noisy warmwater surface behavior.
Expected primary lanes:
- slim_minnow_streamer
- clouser_minnow
- muddler_sculpin
Acceptable secondary lanes:
- woolly_bugger
- mouse_fly
- inline_spinner
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 80.7 F
- Noon pressure: 1015.8 mb
- Noon cloud cover: 30%
- Daily high/low: 84.6 / 63.8 F
- Daily wind max: 10.6 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:16 / 20:12

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Bucktail Streamer `bucktail_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Bucktail Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3.7/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_northeast_freestone_09

- Label: Northeast freestone river, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Fall Northeast trout should tighten around visible baitfish and zonker-style lanes, especially when flows bump up.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- zonker_streamer
Acceptable secondary lanes:
- woolly_bugger
- inline_spinner
- game_changer
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 71.1 F
- Noon pressure: 1019.7 mb
- Noon cloud cover: 45%
- Daily high/low: 77.4 / 52.6 F
- Daily wind max: 5.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:51 / 19:17

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Mouse Fly `mouse_fly` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Mouse Fly: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.8/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_aggressive, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_northeast_freestone_10

- Label: Northeast freestone river, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Fall Northeast trout should tighten around visible baitfish and zonker-style lanes, especially when flows bump up.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- zonker_streamer
Acceptable secondary lanes:
- woolly_bugger
- inline_spinner
- game_changer
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 52.8 F
- Noon pressure: 1019.9 mb
- Noon cloud cover: 66%
- Daily high/low: 57.4 / 40.9 F
- Daily wind max: 11.5 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:21 / 18:29

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Articulated Dungeon Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_northeast_freestone_11

- Label: Northeast freestone river, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Fall Northeast trout should tighten around visible baitfish and zonker-style lanes, especially when flows bump up.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- zonker_streamer
Acceptable secondary lanes:
- woolly_bugger
- inline_spinner
- game_changer
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 38.6 F
- Noon pressure: 1005.7 mb
- Noon cloud cover: 100%
- Daily high/low: 39.6 / 31.4 F
- Daily wind max: 19.3 mph
- Daily precip: 0.023622047244094488 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:54 / 16:53

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_northeast_freestone_12

- Label: Northeast freestone river, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: PA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7268, -77.4529
- Engine status: complete

Expected seasonal story:
- Northeast winter freestone trout should stay subtle and lower-column with sculpin, bugger, and leech control.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- conehead_streamer
- suspending_jerkbait
- hair_jig
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/New_York
- Noon air temp: 31.2 F
- Noon pressure: 995.5 mb
- Noon cloud cover: 100%
- Daily high/low: 27.3 / 13.9 F
- Daily wind max: 16.1 mph
- Daily precip: 0.06692913385826772 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:24 / 16:40

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=mid, seasonal_location=mid_deep, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_mountain_west_river_01

- Label: Mountain West trout river, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Winter western trout should stay in sculpin, bugger, and restrained minnow lanes with very little noise.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- suspending_jerkbait
Acceptable secondary lanes:
- rabbit_strip_leech
- conehead_streamer
- hair_jig
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 42.2 F
- Noon pressure: 1025.1 mb
- Noon cloud cover: 0%
- Daily high/low: 41.5 / 20.4 F
- Daily wind max: 8.4 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:25 / 17:17

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Blade Bait `blade_bait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Blade Bait: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_mountain_west_river_02

- Label: Mountain West trout river, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Shoulder-season western trout should open clean minnow and spinner support without over-accelerating; suspending jerkbait surfaces on warm-front days when fish push active.
Expected primary lanes:
- sculpin_streamer
- slim_minnow_streamer
- inline_spinner
- suspending_jerkbait
Acceptable secondary lanes:
- clouser_minnow
- woolly_bugger
- casting_spoon
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 42 F
- Noon pressure: 1022.8 mb
- Noon cloud cover: 99%
- Daily high/low: 44.5 / 23.7 F
- Daily wind max: 10.1 mph
- Daily precip: 0.05905511811023623 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:54 / 17:55

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Blade Bait `blade_bait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Blade Bait: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid_low, likely_column_today=mid, seasonal_location=mid_deep, posture=slightly_aggressive, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_mountain_west_river_03

- Label: Mountain West trout river, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Shoulder-season western trout should open clean minnow and spinner support without over-accelerating; suspending jerkbait surfaces on warm-front days when fish push active.
Expected primary lanes:
- sculpin_streamer
- slim_minnow_streamer
- inline_spinner
- suspending_jerkbait
Acceptable secondary lanes:
- clouser_minnow
- woolly_bugger
- casting_spoon
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- bright

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
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3.1/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_mountain_west_river_04

- Label: Mountain West trout river, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Spring western trout should reward minnow, sculpin, and spinner lanes, especially near runoff edges.
Expected primary lanes:
- slim_minnow_streamer
- sculpin_streamer
- inline_spinner
Acceptable secondary lanes:
- clouser_minnow
- woolly_bugger
- casting_spoon
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 70.1 F
- Noon pressure: 1008 mb
- Noon cloud cover: 32%
- Daily high/low: 75.7 / 46.3 F
- Daily wind max: 17.6 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:31 / 19:50

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Bucktail Streamer `bucktail_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Bucktail Streamer `bucktail_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Bucktail Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (4.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_mountain_west_river_05

- Label: Mountain West trout river, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Spring western trout should reward minnow, sculpin, and spinner lanes, especially near runoff edges.
Expected primary lanes:
- slim_minnow_streamer
- sculpin_streamer
- inline_spinner
Acceptable secondary lanes:
- clouser_minnow
- woolly_bugger
- casting_spoon
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 57.9 F
- Noon pressure: 1011.5 mb
- Noon cloud cover: 78%
- Daily high/low: 63.8 / 35.4 F
- Daily wind max: 13.2 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:57 / 20:17

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (2.8/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_mountain_west_river_06

- Label: Mountain West trout river, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Summer western trout should remain streamer-minded with controlled minnow, muddler, and spinner lanes rather than bass-style aggression.
Expected primary lanes:
- slim_minnow_streamer
- muddler_sculpin
- inline_spinner
Acceptable secondary lanes:
- clouser_minnow
- woolly_bugger
- mouse_fly
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- bright

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
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3.2/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_mountain_west_river_07

- Label: Mountain West trout river, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Summer western trout should remain streamer-minded with controlled minnow, muddler, and spinner lanes rather than bass-style aggression.
Expected primary lanes:
- slim_minnow_streamer
- muddler_sculpin
- inline_spinner
Acceptable secondary lanes:
- clouser_minnow
- woolly_bugger
- mouse_fly
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 89.4 F
- Noon pressure: 1009.4 mb
- Noon cloud cover: 52%
- Daily high/low: 90.4 / 66.1 F
- Daily wind max: 20.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:59 / 20:35

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Mouse Fly: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (4.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_mountain_west_river_08

- Label: Mountain West trout river, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Summer western trout should remain streamer-minded with controlled minnow, muddler, and spinner lanes rather than bass-style aggression.
Expected primary lanes:
- slim_minnow_streamer
- muddler_sculpin
- inline_spinner
Acceptable secondary lanes:
- clouser_minnow
- woolly_bugger
- mouse_fly
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 92.3 F
- Noon pressure: 1009.5 mb
- Noon cloud cover: 100%
- Daily high/low: 95.2 / 65.6 F
- Daily wind max: 20.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:24 / 20:08

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Mouse Fly `mouse_fly` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Mouse Fly: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (4.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_mountain_west_river_09

- Label: Mountain West trout river, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Fall western trout should center on articulated baitfish, slim minnow, and zonker-style lanes.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- game_changer
Acceptable secondary lanes:
- zonker_streamer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

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
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_mountain_west_river_10

- Label: Mountain West trout river, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Fall western trout should center on articulated baitfish, slim minnow, and zonker-style lanes.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- game_changer
Acceptable secondary lanes:
- zonker_streamer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 71.3 F
- Noon pressure: 1007.7 mb
- Noon cloud cover: 23%
- Daily high/low: 73.6 / 50.2 F
- Daily wind max: 12.3 mph
- Daily precip: 0.011811023622047244 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:19 / 18:34

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (2.7/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_mountain_west_river_11

- Label: Mountain West trout river, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Fall western trout should center on articulated baitfish, slim minnow, and zonker-style lanes.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- game_changer
Acceptable secondary lanes:
- zonker_streamer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Denver
- Noon air temp: 63.6 F
- Noon pressure: 1019.2 mb
- Noon cloud cover: 27%
- Daily high/low: 67.1 / 41.1 F
- Daily wind max: 7.9 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:49 / 17:02

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3.9/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_mountain_west_river_12

- Label: Mountain West trout river, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: CO
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 38.4783, -107.8762
- Engine status: complete

Expected seasonal story:
- Winter western trout should stay in sculpin, bugger, and restrained minnow lanes with very little noise.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- suspending_jerkbait
Acceptable secondary lanes:
- rabbit_strip_leech
- conehead_streamer
- hair_jig
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

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
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Blade Bait `blade_bait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Blade Bait: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.8/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid_low, likely_column_today=mid, seasonal_location=mid_deep, posture=slightly_aggressive, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_pacific_northwest_river_01

- Label: Pacific Northwest trout river, winter control month 1
- Priority: core
- Date: 2025-01-16
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Northwest winter trout should stay controlled around sculpin, bugger, and zonker-style lanes.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- zonker_streamer
Acceptable secondary lanes:
- rabbit_strip_leech
- suspending_jerkbait
- conehead_streamer
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 53.9 F
- Noon pressure: 1018.5 mb
- Noon cloud cover: 0%
- Daily high/low: 36.8 / 22.2 F
- Daily wind max: 9.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:36 / 16:56

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Blade Bait `blade_bait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Blade Bait: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3.9/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_pacific_northwest_river_02

- Label: Pacific Northwest trout river, prespawn opening month 2
- Priority: core
- Date: 2025-02-19
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Shoulder-season northwest trout should let minnow and spinner lanes breathe while staying clean and river-specific.
Expected primary lanes:
- slim_minnow_streamer
- inline_spinner
- woolly_bugger
Acceptable secondary lanes:
- clouser_minnow
- muddler_sculpin
- suspending_jerkbait
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 41.1 F
- Noon pressure: 1016.5 mb
- Noon cloud cover: 100%
- Daily high/low: 49.7 / 26.3 F
- Daily wind max: 9.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:57 / 17:42

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_pacific_northwest_river_03

- Label: Pacific Northwest trout river, prespawn opening month 3
- Priority: core
- Date: 2025-03-20
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Shoulder-season northwest trout should let minnow and spinner lanes breathe while staying clean and river-specific.
Expected primary lanes:
- slim_minnow_streamer
- inline_spinner
- woolly_bugger
Acceptable secondary lanes:
- clouser_minnow
- muddler_sculpin
- suspending_jerkbait
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- bright

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 38.9 F
- Noon pressure: 1020.9 mb
- Noon cloud cover: 100%
- Daily high/low: 40.8 / 31.9 F
- Daily wind max: 16 mph
- Daily precip: 0.24803149606299213 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:06 / 19:20

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.6/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Blown-out flow strongly suppresses posture and collapses the clean bite lane.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_pacific_northwest_river_04

- Label: Pacific Northwest trout river, spawn postspawn transition month 4
- Priority: core
- Date: 2025-04-16
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Spring northwest trout should mix slim minnow, muddler, and spinner lanes without surface clutter.
Expected primary lanes:
- slim_minnow_streamer
- muddler_sculpin
- inline_spinner
Acceptable secondary lanes:
- clouser_minnow
- woolly_bugger
- casting_spoon
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 63 F
- Noon pressure: 1012.4 mb
- Noon cloud cover: 0%
- Daily high/low: 64.4 / 32.3 F
- Daily wind max: 12.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:18 / 19:53

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (6.4/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_pacific_northwest_river_05

- Label: Pacific Northwest trout river, spawn postspawn transition month 5
- Priority: core
- Date: 2025-05-15
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Spring northwest trout should mix slim minnow, muddler, and spinner lanes without surface clutter.
Expected primary lanes:
- slim_minnow_streamer
- muddler_sculpin
- inline_spinner
Acceptable secondary lanes:
- clouser_minnow
- woolly_bugger
- casting_spoon
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 55.1 F
- Noon pressure: 1017.6 mb
- Noon cloud cover: 96%
- Daily high/low: 56.1 / 38.9 F
- Daily wind max: 12.8 mph
- Daily precip: 0.043307086614173235 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:36 / 20:28

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_pacific_northwest_river_06

- Label: Pacific Northwest trout river, summer positioning month 6
- Priority: core
- Date: 2025-06-18
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Summer northwest trout should stay streamer-minded with low-water restraint, allowing one mouse window only when conditions support it.
Expected primary lanes:
- slim_minnow_streamer
- muddler_sculpin
- clouser_minnow
Acceptable secondary lanes:
- woolly_bugger
- inline_spinner
- mouse_fly
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 70.9 F
- Noon pressure: 1014.5 mb
- Noon cloud cover: 3%
- Daily high/low: 71.5 / 43.4 F
- Daily wind max: 16.9 mph
- Daily precip: 0 in
- Moon phase: Third Quarter
- Sunrise/sunset: 05:19 / 20:55

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_pacific_northwest_river_07

- Label: Pacific Northwest trout river, summer positioning month 7
- Priority: core
- Date: 2025-07-16
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Summer northwest trout should stay streamer-minded with low-water restraint, allowing one mouse window only when conditions support it.
Expected primary lanes:
- slim_minnow_streamer
- muddler_sculpin
- clouser_minnow
Acceptable secondary lanes:
- woolly_bugger
- inline_spinner
- mouse_fly
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 77.1 F
- Noon pressure: 1012.8 mb
- Noon cloud cover: 0%
- Daily high/low: 89.5 / 50.1 F
- Daily wind max: 8.6 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:36 / 20:48

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Bucktail Streamer `bucktail_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Paddle-Tail Swimbait: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Bucktail Streamer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=mid_high, seasonal_location=shallow, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_pacific_northwest_river_08

- Label: Pacific Northwest trout river, summer positioning month 8
- Priority: core
- Date: 2025-08-14
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Summer northwest trout should stay streamer-minded with low-water restraint, allowing one mouse window only when conditions support it.
Expected primary lanes:
- slim_minnow_streamer
- muddler_sculpin
- clouser_minnow
Acceptable secondary lanes:
- woolly_bugger
- inline_spinner
- mouse_fly
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 72.3 F
- Noon pressure: 1014.8 mb
- Noon cloud cover: 4%
- Daily high/low: 76.3 / 55.9 F
- Daily wind max: 12.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:07 / 20:14

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Clouser Minnow `clouser_minnow` | theme: `natural` | colors: green pumpkin, olive, smoke
- Bucktail Streamer `bucktail_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Clouser Minnow: natural -> green pumpkin, olive, smoke
- Bucktail Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_pacific_northwest_river_09

- Label: Pacific Northwest trout river, fall transition month 9
- Priority: core
- Date: 2025-09-17
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Fall northwest trout should tighten around slim minnow, articulated baitfish, and zonker lanes.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- zonker_streamer
Acceptable secondary lanes:
- game_changer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 72.7 F
- Noon pressure: 1017.6 mb
- Noon cloud cover: 0%
- Daily high/low: 81.1 / 46 F
- Daily wind max: 6.3 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:46 / 19:14

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_pacific_northwest_river_10

- Label: Pacific Northwest trout river, fall transition month 10
- Priority: core
- Date: 2025-10-15
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Fall northwest trout should tighten around slim minnow, articulated baitfish, and zonker lanes.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- zonker_streamer
Acceptable secondary lanes:
- game_changer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 46 F
- Noon pressure: 1020 mb
- Noon cloud cover: 0%
- Daily high/low: 53.7 / 27.4 F
- Daily wind max: 5.4 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:20 / 18:23

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_pacific_northwest_river_11

- Label: Pacific Northwest trout river, fall transition month 11
- Priority: core
- Date: 2025-11-12
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Fall northwest trout should tighten around slim minnow, articulated baitfish, and zonker lanes.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- zonker_streamer
Acceptable secondary lanes:
- game_changer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 53.2 F
- Noon pressure: 1011.6 mb
- Noon cloud cover: 94%
- Daily high/low: 62.3 / 43.1 F
- Daily wind max: 6.2 mph
- Daily precip: 0.0984251968503937 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:57 / 16:43

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (7.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_pacific_northwest_river_12

- Label: Pacific Northwest trout river, winter control month 12
- Priority: core
- Date: 2025-12-10
- State: OR
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 44.3539, -121.5498
- Engine status: complete

Expected seasonal story:
- Northwest winter trout should stay controlled around sculpin, bugger, and zonker-style lanes.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- zonker_streamer
Acceptable secondary lanes:
- rabbit_strip_leech
- suspending_jerkbait
- conehead_streamer
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: pacific_northwest
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 54.6 F
- Noon pressure: 1019.5 mb
- Noon cloud cover: 100%
- Daily high/low: 57 / 29.1 F
- Daily wind max: 7.5 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:29 / 16:28

Actual output:
- Top 1 lure: Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Conehead Streamer `conehead_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Blade Bait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Conehead Streamer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (5.1/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Elevated flow suppresses posture and tightens fish to safer holding lanes.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_northern_california_fall_02

- Label: Northern California trout river, prespawn opening month 2
- Priority: secondary
- Date: 2025-02-19
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7922, -122.6217
- Engine status: complete

Expected seasonal story:
- Late-winter northern California trout should stay controlled around sculpin, bugger, and restrained minnow lanes.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- suspending_jerkbait
Acceptable secondary lanes:
- rabbit_strip_leech
- slim_minnow_streamer
- hair_jig
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 36.6 F
- Noon pressure: 1021.2 mb
- Noon cloud cover: 100%
- Daily high/low: 43.9 / 24.2 F
- Daily wind max: 2.9 mph
- Daily precip: 0.003937007874015749 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:57 / 17:50

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_northern_california_fall_09

- Label: Northern California trout river, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7922, -122.6217
- Engine status: complete

Expected seasonal story:
- Northern California fall trout: articulated baitfish leads active mid-column days; slim minnow surfaces on subtle-condition September days; hair jig earns the lure top slot on low clear-water October days when fish sit deep.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- hair_jig
Acceptable secondary lanes:
- game_changer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 76 F
- Noon pressure: 1016.2 mb
- Noon cloud cover: 0%
- Daily high/low: 86 / 51.2 F
- Daily wind max: 7.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:52 / 19:17

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: neutral (5.9/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_northern_california_fall_10

- Label: Northern California trout river, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7922, -122.6217
- Engine status: complete

Expected seasonal story:
- Northern California fall trout: articulated baitfish leads active mid-column days; slim minnow surfaces on subtle-condition September days; hair jig earns the lure top slot on low clear-water October days when fish sit deep.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- hair_jig
Acceptable secondary lanes:
- game_changer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 54 F
- Noon pressure: 1017.2 mb
- Noon cloud cover: 0%
- Daily high/low: 60.4 / 35.9 F
- Daily wind max: 7.9 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:22 / 18:30

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Slim Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: suppressed (0.9/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=low, seasonal_location=shallow_mid, posture=suppressed, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Elevated flow suppresses posture and tightens fish to safer holding lanes.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_northern_california_fall_11

- Label: Northern California trout river, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: CA
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 41.7922, -122.6217
- Engine status: complete

Expected seasonal story:
- Northern California fall trout: articulated baitfish leads active mid-column days; slim minnow surfaces on subtle-condition September days; hair jig earns the lure top slot on low clear-water October days when fish sit deep.
Expected primary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- hair_jig
Acceptable secondary lanes:
- game_changer
- sculpin_streamer
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: northern_california
- Archive weather timezone: America/Los_Angeles
- Noon air temp: 59.9 F
- Noon pressure: 1010.9 mb
- Noon cloud cover: 87%
- Daily high/low: 59.6 / 44.8 F
- Daily wind max: 11.4 mph
- Daily precip: 0.8188976377952757 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:55 / 16:53

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.5/10)
- Presentation presence today: bold
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Heavy overcast supports a more open feeding posture.
- Daily note: Blown-out flow strongly suppresses posture and collapses the clean bite lane.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_great_lakes_highwater_03

- Label: Great Lakes / Upper Midwest trout river, prespawn opening month 3
- Priority: secondary
- Date: 2025-03-20
- State: WI
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 46.0042, -89.6651
- Engine status: complete

Expected seasonal story:
- Cold stained northern trout water should still stay disciplined with bugger, sculpin, and spinner lanes rather than broad aggression.
Expected primary lanes:
- woolly_bugger
- sculpin_streamer
- inline_spinner
Acceptable secondary lanes:
- slim_minnow_streamer
- conehead_streamer
- casting_spoon
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 33.1 F
- Noon pressure: 1014.2 mb
- Noon cloud cover: 0%
- Daily high/low: 39.6 / 20.3 F
- Daily wind max: 15.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:58 / 19:12

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.3/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_great_lakes_highwater_05

- Label: Great Lakes / Upper Midwest trout river, spawn postspawn transition month 5
- Priority: secondary
- Date: 2025-05-15
- State: WI
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 46.0042, -89.6651
- Engine status: complete

Expected seasonal story:
- Spring stained high-water trout should elevate visible bugger, minnow, and spinner lanes, but still stay trout-clean.
Expected primary lanes:
- woolly_bugger
- clouser_minnow
- inline_spinner
Acceptable secondary lanes:
- sculpin_streamer
- slim_minnow_streamer
- casting_spoon
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 75.7 F
- Noon pressure: 999.7 mb
- Noon cloud cover: 13%
- Daily high/low: 82.2 / 55.9 F
- Daily wind max: 20.1 mph
- Daily precip: 0.3779527559055118 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:24 / 20:26

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (1.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Heat-limited metabolism suppresses fish posture and shrinks the reliable lane.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Elevated flow suppresses posture and tightens fish to safer holding lanes.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_great_lakes_highwater_10

- Label: Great Lakes / Upper Midwest trout river, fall transition month 10
- Priority: secondary
- Date: 2025-10-15
- State: WI
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 46.0042, -89.6651
- Engine status: complete

Expected seasonal story:
- Fall stained Great Lakes trout should tighten around visible articulated baitfish, bugger, and minnow lanes.
Expected primary lanes:
- articulated_baitfish_streamer
- woolly_bugger
- slim_minnow_streamer
Acceptable secondary lanes:
- game_changer
- inline_spinner
- zonker_streamer
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 52.2 F
- Noon pressure: 1027 mb
- Noon cloud cover: 7%
- Daily high/low: 56.7 / 43.8 F
- Daily wind max: 4.1 mph
- Daily precip: 0.007874015748031498 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:14 / 18:13

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid, seasonal_location=shallow_mid, posture=neutral, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_great_lakes_highwater_11

- Label: Great Lakes / Upper Midwest trout river, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: WI
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 46.0042, -89.6651
- Engine status: complete

Expected seasonal story:
- Fall stained Great Lakes trout should tighten around visible articulated baitfish, bugger, and minnow lanes.
Expected primary lanes:
- articulated_baitfish_streamer
- woolly_bugger
- slim_minnow_streamer
Acceptable secondary lanes:
- game_changer
- inline_spinner
- zonker_streamer
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark
- bright

Archived env summary:
- Region: great_lakes_upper_midwest
- Archive weather timezone: America/Chicago
- Noon air temp: 41.3 F
- Noon pressure: 1009.8 mb
- Noon cloud cover: 0%
- Daily high/low: 47.6 / 27.3 F
- Daily wind max: 10.6 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 06:53 / 16:31

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Game Changer `game_changer` | theme: `dark` | colors: black, black/blue, black/purple
- Articulated Dungeon Streamer `articulated_dungeon_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Inline Spinner: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Articulated Baitfish Streamer: dark -> black, black/blue, black/purple
- Game Changer: dark -> black, black/blue, black/purple
- Articulated Dungeon Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_alaska_big_river_06

- Label: Alaska trout river, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: AK
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 61.5799, -149.4411
- Engine status: complete

Expected seasonal story:
- Big Alaskan trout water in summer should still feel streamer-heavy and disciplined, not warmwater noisy.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- articulated_baitfish_streamer
- slim_minnow_streamer
- casting_spoon
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- natural

Archived env summary:
- Region: alaska
- Archive weather timezone: America/Anchorage
- Noon air temp: 62.2 F
- Noon pressure: 1016.4 mb
- Noon cloud cover: 21%
- Daily high/low: 71.3 / 49.9 F
- Daily wind max: 5.3 mph
- Daily precip: 0 in
- Moon phase: Third Quarter
- Sunrise/sunset: 04:08 / 23:49

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Muddler Minnow `muddler_sculpin` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Soft Plastic Jerkbait: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Muddler Minnow: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high_top, seasonal_location=shallow, posture=slightly_aggressive, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_alaska_big_river_09

- Label: Alaska trout river, fall transition month 9
- Priority: secondary
- Date: 2025-09-17
- State: AK
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 61.5799, -149.4411
- Engine status: complete

Expected seasonal story:
- Fall Alaska trout should strongly reward articulated baitfish, sculpin, and leech-style streamers.
Expected primary lanes:
- articulated_baitfish_streamer
- sculpin_streamer
- rabbit_strip_leech
Acceptable secondary lanes:
- game_changer
- slim_minnow_streamer
- zonker_streamer
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: alaska
- Archive weather timezone: America/Anchorage
- Noon air temp: 55.5 F
- Noon pressure: 999 mb
- Noon cloud cover: 0%
- Daily high/low: 59.8 / 43.3 F
- Daily wind max: 6.2 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 07:28 / 20:15

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Inline Spinner `inline_spinner` | theme: `natural` | colors: green pumpkin, olive, smoke
- Casting Spoon `casting_spoon` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Articulated Baitfish Streamer `articulated_baitfish_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Game Changer `game_changer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Inline Spinner: natural -> green pumpkin, olive, smoke
- Casting Spoon: natural -> green pumpkin, olive, smoke
- Articulated Baitfish Streamer: natural -> green pumpkin, olive, smoke
- Game Changer: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (2.6/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Blown-out flow strongly suppresses posture and collapses the clean bite lane.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_alaska_big_river_11

- Label: Alaska trout river, fall transition month 11
- Priority: secondary
- Date: 2025-11-12
- State: AK
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 61.5799, -149.4411
- Engine status: complete

Expected seasonal story:
- Fall Alaska trout should strongly reward articulated baitfish, sculpin, and leech-style streamers.
Expected primary lanes:
- articulated_baitfish_streamer
- sculpin_streamer
- rabbit_strip_leech
Acceptable secondary lanes:
- game_changer
- slim_minnow_streamer
- zonker_streamer
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- natural
- dark

Archived env summary:
- Region: alaska
- Archive weather timezone: America/Anchorage
- Noon air temp: 15.6 F
- Noon pressure: 1008.5 mb
- Noon cloud cover: 98%
- Daily high/low: 22.5 / 10 F
- Daily wind max: 4.2 mph
- Daily precip: 0 in
- Moon phase: Waning Crescent
- Sunrise/sunset: 08:57 / 16:26

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Hair Jig `hair_jig` | theme: `natural` | colors: green pumpkin, olive, smoke
- Blade Bait `blade_bait` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `natural` | colors: green pumpkin, olive, smoke
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `natural` | colors: green pumpkin, olive, smoke
- Woolly Bugger `woolly_bugger` | theme: `natural` | colors: green pumpkin, olive, smoke
- Color notes:
- Color of day: Natural Colors
- Suspending Jerkbait: natural -> green pumpkin, olive, smoke
- Hair Jig: natural -> green pumpkin, olive, smoke
- Blade Bait: natural -> green pumpkin, olive, smoke
- Sculpin Streamer: natural -> green pumpkin, olive, smoke
- Rabbit-Strip Leech: natural -> green pumpkin, olive, smoke
- Woolly Bugger: natural -> green pumpkin, olive, smoke
- Daily profile notes:
- Daily posture: slightly_suppressed (3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=mid, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:natural,natural
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

## trout_matrix_alaska_big_river_12

- Label: Alaska trout river, winter control month 12
- Priority: secondary
- Date: 2025-12-10
- State: AK
- Context: freshwater_river
- Water clarity: clear
- Coordinates: 61.5799, -149.4411
- Engine status: complete

Expected seasonal story:
- Early-winter Alaska trout should stay in heavy sculpin, leech, and conehead control with no surface drift.
Expected primary lanes:
- sculpin_streamer
- rabbit_strip_leech
- conehead_streamer
Acceptable secondary lanes:
- woolly_bugger
- hair_jig
- suspending_jerkbait
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- natural

Archived env summary:
- Region: alaska
- Archive weather timezone: America/Anchorage
- Noon air temp: 6.8 F
- Noon pressure: 1009.4 mb
- Noon cloud cover: 99%
- Daily high/low: 10.5 / 2.8 F
- Daily wind max: 4.9 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 10:01 / 15:39

Actual output:
- Top 1 lure: Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Blade Bait `blade_bait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Sculpin Streamer `sculpin_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Blade Bait: dark -> black, black/blue, black/purple
- Sculpin Streamer: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (3.6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=mid_low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=subtle
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Clear water favors a cleaner, subtler presentation.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_idaho_runoff_edge_04

- Label: Idaho runoff-edge trout river, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: ID
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 44.0772, -114.742
- Engine status: complete

Expected seasonal story:
- A stained runoff edge should push visible sculpin, bugger, and minnow lanes without turning into bass power fishing.
Expected primary lanes:
- sculpin_streamer
- woolly_bugger
- clouser_minnow
Acceptable secondary lanes:
- slim_minnow_streamer
- inline_spinner
- muddler_sculpin
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- natural
- dark
- bright

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Boise
- Noon air temp: 45.1 F
- Noon pressure: 1008.7 mb
- Noon cloud cover: 84%
- Daily high/low: 45.1 / 24 F
- Daily wind max: 11.2 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:51 / 20:26

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Bucktail Streamer `bucktail_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Bucktail Streamer `bucktail_baitfish_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Bucktail Streamer: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.8/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_high, seasonal_location=shallow_mid, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_MISS
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_idaho_runoff_edge_06

- Label: Idaho runoff-edge trout river, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: ID
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 44.0772, -114.742
- Engine status: complete

Expected seasonal story:
- Colored western summer trout water should stay visible but controlled around bugger, minnow, and spinner support lanes.
Expected primary lanes:
- woolly_bugger
- clouser_minnow
- inline_spinner
Acceptable secondary lanes:
- slim_minnow_streamer
- muddler_sculpin
- casting_spoon
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Boise
- Noon air temp: 63.1 F
- Noon pressure: 1016 mb
- Noon cloud cover: 0%
- Daily high/low: 66.4 / 41.1 F
- Daily wind max: 10.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 05:53 / 21:26

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Paddle-Tail Swimbait `paddle_tail_swimbait` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Paddle-Tail Swimbait: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.2/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_shock, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A sharp warmup can help slightly, but not enough to rewrite the seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_idaho_runoff_edge_07

- Label: Idaho runoff-edge trout river, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: ID
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 44.0772, -114.742
- Engine status: complete

Expected seasonal story:
- Colored western summer trout water should stay visible but controlled around bugger, minnow, and spinner support lanes.
Expected primary lanes:
- woolly_bugger
- clouser_minnow
- inline_spinner
Acceptable secondary lanes:
- slim_minnow_streamer
- muddler_sculpin
- casting_spoon
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Boise
- Noon air temp: 66.4 F
- Noon pressure: 1013.7 mb
- Noon cloud cover: 0%
- Daily high/low: 72 / 40.2 F
- Daily wind max: 8.7 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:09 / 21:20

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_idaho_runoff_edge_08

- Label: Idaho runoff-edge trout river, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: ID
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 44.0772, -114.742
- Engine status: complete

Expected seasonal story:
- Colored western summer trout water should stay visible but controlled around bugger, minnow, and spinner support lanes.
Expected primary lanes:
- woolly_bugger
- clouser_minnow
- inline_spinner
Acceptable secondary lanes:
- slim_minnow_streamer
- muddler_sculpin
- casting_spoon
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: mountain_west
- Archive weather timezone: America/Boise
- Noon air temp: 70.8 F
- Noon pressure: 1013.2 mb
- Noon cloud cover: 34%
- Daily high/low: 72.2 / 51.6 F
- Daily wind max: 13.8 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:40 / 20:46

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Soft Plastic Jerkbait `soft_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Zonker Streamer `zonker_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Soft Plastic Jerkbait: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Zonker Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: neutral (6.3/10)
- Presentation presence today: subtle
- Resolved profile: typical_column=high, likely_column_today=high, seasonal_location=shallow, posture=neutral, presentation=subtle
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=0
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: A warming trend nudges fish into a slightly more willing posture.
- Daily note: Hard glare keeps fish more cautious and selective.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_south_central_tailwater_04

- Label: South-central tailwater trout river, spawn postspawn transition month 4
- Priority: secondary
- Date: 2025-04-16
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.4409, -84.6013
- Engine status: complete

Expected seasonal story:
- A stained spring tailwater pulse should elevate visible minnow, bugger, and spinner lanes while staying current-aware.
Expected primary lanes:
- clouser_minnow
- slim_minnow_streamer
- inline_spinner
Acceptable secondary lanes:
- woolly_bugger
- muddler_sculpin
- suspending_jerkbait
Disallowed lanes:
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- bright

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 58.5 F
- Noon pressure: 1021.8 mb
- Noon cloud cover: 0%
- Daily high/low: 64.2 / 40.6 F
- Daily wind max: 6.3 mph
- Daily precip: 0 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 07:02 / 20:13

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Clouser Minnow `clouser_minnow` | theme: `dark` | colors: black, black/blue, black/purple
- Balanced Leech `balanced_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Clouser Minnow: dark -> black, black/blue, black/purple
- Balanced Leech: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_suppressed (2.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=mid, likely_column_today=mid_low, seasonal_location=shallow_mid, posture=slightly_suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, temperature_trend, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: A cooling trend tightens fish and reduces daily willingness.
- Daily note: Bright light trims daily willingness without fully shutting the day down.
- Daily note: Stable river flow supports a reliable seasonal posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_south_central_tailwater_06

- Label: South-central tailwater trout river, summer positioning month 6
- Priority: secondary
- Date: 2025-06-18
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.4409, -84.6013
- Engine status: complete

Expected seasonal story:
- Warm-tailwater summer trout should tighten back into sculpin, bugger, and leech-style restraint rather than broad summer aggression.
Expected primary lanes:
- muddler_sculpin
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- sculpin_streamer
- slim_minnow_streamer
- hair_jig
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 78 F
- Noon pressure: 1018.8 mb
- Noon cloud cover: 88%
- Daily high/low: 82.7 / 68.4 F
- Daily wind max: 14.5 mph
- Daily precip: 0.05511811023622047 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:21 / 20:57

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Casting Spoon `casting_spoon` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Slim Baitfish Streamer `slim_minnow_streamer` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Casting Spoon: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Slim Baitfish Streamer: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: suppressed (2.4/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=high, likely_column_today=mid, seasonal_location=shallow, posture=suppressed, presentation=balanced
- Guardrails: surface_allowed=false, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=false, column_shift_half_steps=2
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Cold-limited metabolism suppresses fish posture and tightens the bite lane.
- Daily note: Slightly elevated flow can still fish well, but it changes where fish set up.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_south_central_tailwater_07

- Label: South-central tailwater trout river, summer positioning month 7
- Priority: secondary
- Date: 2025-07-16
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.4409, -84.6013
- Engine status: complete

Expected seasonal story:
- Warm-tailwater summer trout should tighten back into sculpin, bugger, and leech-style restraint rather than broad summer aggression.
Expected primary lanes:
- muddler_sculpin
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- sculpin_streamer
- slim_minnow_streamer
- hair_jig
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 85.5 F
- Noon pressure: 1018.4 mb
- Noon cloud cover: 23%
- Daily high/low: 90.9 / 73.2 F
- Daily wind max: 9.6 mph
- Daily precip: 0.015748031496062995 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:34 / 20:54

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `dark` | colors: black, black/blue, black/purple
- Hair Jig `hair_jig` | theme: `dark` | colors: black, black/blue, black/purple
- Suspending Jerkbait `suspending_jerkbait` | theme: `dark` | colors: black, black/blue, black/purple
- Top 1 fly: Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Top 3 flies:
- Muddler Minnow `muddler_sculpin` | theme: `dark` | colors: black, black/blue, black/purple
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `dark` | colors: black, black/blue, black/purple
- Woolly Bugger `woolly_bugger` | theme: `dark` | colors: black, black/blue, black/purple
- Color notes:
- Color of day: Dark Colors
- Inline Spinner: dark -> black, black/blue, black/purple
- Hair Jig: dark -> black, black/blue, black/purple
- Suspending Jerkbait: dark -> black, black/blue, black/purple
- Muddler Minnow: dark -> black, black/blue, black/purple
- Rabbit-Strip Leech: dark -> black, black/blue, black/purple
- Woolly Bugger: dark -> black, black/blue, black/purple
- Daily profile notes:
- Daily posture: slightly_aggressive (6.5/10)
- Presentation presence today: balanced
- Resolved profile: typical_column=low, likely_column_today=mid_low, seasonal_location=mid_deep, posture=slightly_aggressive, presentation=balanced
- Guardrails: surface_allowed=true, suppress_true_topwater=false, suppress_fast_presentations=false, high_visibility_needed=false, column_shift_half_steps=-1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Perfect-clear river flow supports a stable seasonal bite posture.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:dark,dark
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

## trout_matrix_south_central_tailwater_08

- Label: South-central tailwater trout river, summer positioning month 8
- Priority: secondary
- Date: 2025-08-14
- State: TN
- Context: freshwater_river
- Water clarity: stained
- Coordinates: 35.4409, -84.6013
- Engine status: complete

Expected seasonal story:
- Warm-tailwater summer trout should tighten back into sculpin, bugger, and leech-style restraint rather than broad summer aggression.
Expected primary lanes:
- muddler_sculpin
- woolly_bugger
- rabbit_strip_leech
Acceptable secondary lanes:
- sculpin_streamer
- slim_minnow_streamer
- hair_jig
Disallowed lanes:
- mouse_fly
- frog_fly
- popper_fly
- walking_topwater
- hollow_body_frog
Expected color themes:
- dark
- natural
- natural

Archived env summary:
- Region: south_central
- Archive weather timezone: America/New_York
- Noon air temp: 79.4 F
- Noon pressure: 1017.1 mb
- Noon cloud cover: 100%
- Daily high/low: 85.1 / 71 F
- Daily wind max: 4.3 mph
- Daily precip: 0.11811023622047245 in
- Moon phase: Waning Gibbous
- Sunrise/sunset: 06:56 / 20:29

Actual output:
- Top 1 lure: Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 lures:
- Inline Spinner `inline_spinner` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Hair Jig `hair_jig` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait `suspending_jerkbait` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 1 fly: Muddler Minnow `muddler_sculpin` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Top 3 flies:
- Muddler Minnow `muddler_sculpin` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech `rabbit_strip_leech` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Woolly Bugger `woolly_bugger` | theme: `bright` | colors: white/chartreuse, chartreuse, firetiger
- Color notes:
- Color of day: Bright Colors
- Inline Spinner: bright -> white/chartreuse, chartreuse, firetiger
- Hair Jig: bright -> white/chartreuse, chartreuse, firetiger
- Suspending Jerkbait: bright -> white/chartreuse, chartreuse, firetiger
- Muddler Minnow: bright -> white/chartreuse, chartreuse, firetiger
- Rabbit-Strip Leech: bright -> white/chartreuse, chartreuse, firetiger
- Woolly Bugger: bright -> white/chartreuse, chartreuse, firetiger
- Daily profile notes:
- Daily posture: slightly_suppressed (3.1/10)
- Presentation presence today: bold
- Resolved profile: typical_column=low, likely_column_today=low, seasonal_location=mid_deep, posture=slightly_suppressed, presentation=bold
- Guardrails: surface_allowed=true, suppress_true_topwater=true, suppress_fast_presentations=true, high_visibility_needed=true, column_shift_half_steps=1
- Variables considered: temperature_metabolic_context, temperature_trend, temperature_shock, pressure_regime, wind_condition, light_cloud_condition, runoff_flow_disruption
- Variables triggered: temperature_metabolic_context, wind_condition, light_cloud_condition, runoff_flow_disruption
- Daily note: Neutral temperature metabolism keeps the day open to the normal seasonal pattern.
- Daily note: Low light opens the daily posture and supports more willingness.
- Daily note: Blown-out flow strongly suppresses posture and collapses the clean bite lane.
- Daily note: Stained water supports a balanced presentation with some extra presence.

Review:
- Precheck flags:
- TOP1_PRIMARY_HIT
- TOP3_PRIMARY_PRESENT
- NO_DISALLOWED_PRESENT
- TOP_COLOR_MATCH:bright,bright
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

