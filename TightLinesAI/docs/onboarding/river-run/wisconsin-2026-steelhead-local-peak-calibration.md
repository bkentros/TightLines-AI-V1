# Wisconsin Fall Steelhead Local Peak Calibration

**Recorded:** 2026-08-27
**Status:** implemented in hidden owner-review profiles
**Scope:** Fall Steelhead only; this is not a Skamania-specific, winter-holding,
or spring-spawning model.

## Locked field anchors

The product owner supplied exact peak dates from a local Wisconsin angler. These
dates override the earlier research-only peak estimates:

| River | Locked peak |
| --- | --- |
| Bois Brule | **Sept. 28** |
| Sheboygan | **Oct. 1** |
| Milwaukee | **Oct. 8** |
| Root | **Oct. 10** |

The peak dates are field calibration. All surrounding stage boundaries are
conservative interpolation informed by the river sequence, agency-supported
fall windows, and the requirement to preserve living-fish behavior.

## Implemented stage calendars

| River | Staging | Beginning | Building | Peak | Tapering | Ending |
| --- | --- | --- | --- | --- | --- | --- |
| Bois Brule | Aug. 1-14 | Aug. 15-31 | Sept. 1-27 | **Sept. 28-Oct. 20** | Oct. 21-Nov. 10 | Nov. 11-30* |
| Sheboygan | Aug. 15-31 | Sept. 1-10 | Sept. 11-30 | **Oct. 1-15** | Oct. 16-Nov. 15 | Nov. 16-Dec. 15 |
| Milwaukee | Aug. 15-31 | Sept. 1-15 | Sept. 16-Oct. 7 | **Oct. 8-25** | Oct. 26-Nov. 20 | Nov. 21-Dec. 15 |
| Root | Aug. 15-31 | Sept. 1-15 | Sept. 16-Oct. 9 | **Oct. 10-31** | Nov. 1-30 | Dec. 1-31 |

\*The lower Bois Brule fishing season closes Nov. 15. Biological stage copy may
continue after that date, but the product must not direct fishing after closure.

## Fish In River reconciliation

Each curve retains its approved maximum and reaches it on the locked peak:

| River | Maximum | Peak score/date | Late-fall behavior |
| --- | ---: | --- | --- |
| Bois Brule | 9/10 | 90 on Sept. 28 | declines to 61 by Nov. 30; never salmon mortality |
| Sheboygan | 5/10 | 50 on Oct. 1 | declines to 31 by Dec. 15; fish may remain |
| Milwaukee | 7/10 | 70 on Oct. 8 | declines to 43 by Dec. 15; fish may remain |
| Root | 7/10 | 70 on Oct. 10 | declines to 43 by Dec. 31; fish may remain |

Zero is retained before modeled river entry. After the fall model ends, the
primitive becomes unavailable rather than asserting that Steelhead died or left.

## Primitive impact review

- **Migration Stage:** recalibrated to the locked anchors.
- **Fish In River:** curves rebuilt; maxima and distribution ratings unchanged.
- **Activity:** Sheboygan, Root, and Bois Brule remain Limited weather-only; the
  scoring rules did not change. Milwaukee's measured-river Activity was
  recalibrated because its old stage boosts over-inflated the corrected October
  peak. It now uses small `5/7/9/9` early-to-peak nudges and zero late-stage
  adjustment.
- **Fishability / Gauge Read:** unchanged; neither consumes the seasonal stage
  calendar.
- **Push / Migration Timing:** remain unavailable where previously unavailable;
  no unsupported capability was enabled.
- **Copy/lifecycle:** Steelhead remain living repeat spawners; no salmon death,
  deterioration, or forced-departure semantics were introduced.

## Evidence boundary

Wisconsin DNR evidence remains the basis for recurrence, lifecycle, restrictions,
and the broad biological windows. Exact peak-day precision comes from the
owner-supplied local field calibration and must be labeled as such; it is not
misrepresented as an agency-counted daily peak.
