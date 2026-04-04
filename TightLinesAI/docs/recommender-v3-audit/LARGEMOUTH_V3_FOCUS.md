# Largemouth V3 Audit Focus

## Goal

Make `largemouth_bass` the first fully tuned freshwater V3 species.

This means the recommender should feel right for:

- region
- month
- lake / pond vs river
- daily condition shifts
- user-entered water clarity
- lure archetype
- fly archetype
- color guidance

## Why Largemouth First

Largemouth is the highest-value audit target because:

- it is the flagship freshwater species
- it spans the broadest range of U.S. water and seasonal behavior
- its recommendations must feel strongest in the South and Southeast
- it will pressure-test almost every major V3 system

## Largemouth Audit Regions

Prioritize these region groups first:

### Core

- Florida
- South Central / Texas
- Southeast highland reservoir belt
- Ozarks
- major warm river systems in the Southeast

### Secondary

- Midwest natural lake belt
- Northeast natural lake belt
- California Delta / western warmwater

## Largemouth Scenario Mix

Cover both contexts:

- `freshwater_lake_pond`
- `freshwater_river`

Cover all 12 months, but weight these windows hardest:

- winter slowdown
- prespawn opening
- spawn / postspawn transition
- summer grass / offshore / current
- fall baitfish transition

## Recommended Gold Scenario Count

Target `60–80` largemouth gold scenarios.

Suggested split:

- `40–50` lake / pond
- `20–30` river

Suggested regional weighting:

- Florida / Southeast: heaviest
- Texas / South Central: heavy
- Ozarks / highland reservoirs: medium
- Midwest / Northeast / California: supporting

## What To Judge In Every Largemouth Scenario

### 1. Seasonal lane

Is the engine in the correct broad family of behavior for the month and region?

Examples:

- winter Florida should still stay controlled and lower in the column
- spring openings should allow mild upward and faster adjustments
- fall should support stronger baitfish/horizontal lanes

### 2. Daily nudge quality

Did the engine move correctly for the day?

Examples:

- warming trend should open the bite moderately
- abrupt spike should not automatically create a drastic jump
- high wind should suppress surface lanes when appropriate

### 3. Archetype quality

Are the top picks classic, sensible largemouth choices?

Examples of likely good largemouth lanes:

- `Texas-rigged stick worm`
- `Wacky-rigged stick worm`
- `Football jig`
- `Compact flipping jig`
- `Swim jig`
- `Spinnerbait`
- `Bladed jig`
- `Squarebill crankbait`
- `Suspending jerkbait`
- `Paddle-tail swimbait`

### 4. Fly realism

Are fly picks believable for largemouth bass and not just generic streamers?

Examples:

- `Game Changer`
- `Clouser Minnow`
- `Woolly Bugger`
- `Rabbit-strip leech`
- `Topwater popper fly`
- `Topwater frog fly`
- `Mouse fly`

### 5. Color realism

Do the 3 recommended colors fit:

- the archetype itself
- water clarity
- visibility
- typical angler tackle reality

Examples:

- `Football jig` should lean lanes like `green pumpkin`, `brown/orange`, `pb&j`, `black/blue`
- `Spinnerbait` should lean lanes like `white`, `white/chartreuse`, `white/blue`, `firetiger`, `black`
- `Soft-plastic craw` should not recommend spinnerbait-style bright lanes by default

### 6. Top 3 usefulness

Are the top 3 distinct enough to help the angler make real decisions, while still fitting one believable daily gameplan?

## Largemouth Failure Clusters To Watch

1. winter warm-up overreaction
2. too much topwater
3. not enough baitfish transition in fall
4. river largemouth reading like lake largemouth
5. dirty-water color collapse
6. clear-water color over-boldness
7. top 3 too repetitive
8. fly recommendations feeling generic rather than bass-specific

## Tuning Sequence For Largemouth

Tune in this order:

1. lake / pond winter and prespawn
2. lake / pond summer and fall
3. river spring and summer
4. river fall and winter
5. color cleanup across all largemouth scenarios

## Starter Scenario Set

The starter archived scenario pack lives in:

`scripts/recommenderCalibrationScenarios.ts`

Start with those largemouth scenarios, then expand the gold set once the first failure clusters are visible.

## Pass Bar Before Moving On

Do not move to smallmouth until largemouth feels stable across:

1. Florida winter / spring
2. Texas winter / fall
3. Southeast reservoir spring
4. stained summer cover scenarios
5. clear summer finesse scenarios
6. fall shad-transition scenarios
7. at least one credible river batch

If those are strong, the V3 largemouth engine is in the right place.
