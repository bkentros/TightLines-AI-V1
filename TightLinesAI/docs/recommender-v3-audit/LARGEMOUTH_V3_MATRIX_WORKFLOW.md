# Largemouth V3 Matrix Workflow

## Goal

Tune `largemouth_bass` efficiently without relying on random scenario selection.

The largemouth audit should now run in two layers:

1. **Gold batches**
   Small hand-scored scenario packs like Batch 1.

2. **Matrix coverage**
   A fixed month-by-region grid that keeps the species under broad seasonal pressure.

## Efficient Structure

Use a stable largemouth matrix instead of inventing each new batch manually.

### Core Monthly Grid

Run all 12 months on 4 anchor systems:

- Florida shallow natural lake
- Texas reservoir
- Alabama river current system
- New York natural lake

This gives a repeatable 48-scenario backbone covering:

- tropical lake behavior
- south-central reservoir behavior
- river largemouth behavior
- northern clear-lake behavior

### Seasonal Overlay Grid

Run 4 high-value months on 5 overlay systems:

- Georgia highland reservoir
- Louisiana grass lake
- Ozarks reservoir
- Minnesota weed lake
- California Delta freshwater reach

This adds 20 focused scenarios covering:

- clear highland spring
- southern grass / fall surface lanes
- inland shad transition reservoirs
- northern weedline summer behavior
- western stained river / Delta largemouth behavior

## Why This Is Better

- It covers all 12 months where it matters most.
- It reduces random audit drift.
- It makes miss clustering much cleaner.
- It lets us rerun the same largemouth grid after each tuning pass.
- It supports both biological tuning and repetition checks.

## Operating Rhythm

1. Keep one hand-scored gold batch active.
2. Run the matrix as a broader coverage layer.
3. Tune one failure class at a time.
4. Re-run both the gold batch and the matrix after each pass.

## Tuning Order Inside The Matrix

1. Seasonal lane correctness
2. River vs lake separation
3. Daily nudge boundedness
4. Color realism by lure/fly type
5. Variety / anti-redundancy cleanup

## Current Recommendation

Use Batch 1 as the hand-scored truth set and use the largemouth matrix as the rapid wider-coverage layer before expanding to a second gold batch.
