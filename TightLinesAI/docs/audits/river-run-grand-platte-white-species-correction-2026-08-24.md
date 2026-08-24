# Grand, Platte, and White Species Research Correction Audit

**Date:** 2026-08-24\
**Scope:** Chinook, Coho, and Fall Steelhead on Grand, Platte, and White\
**Runtime status:** hidden review only; no public registry or deployment change

## Finding

The initial nine-combination pass did not meet the intended research standard.
It adequately supported the six implemented profiles, but it treated failure to
find direct evidence in current summary pages as evidence against two Platte
runs. It also placed White Chinook's scored beginning at September 10 despite
accepted DNR biology supporting meaningful mid-August upstream migration.

The error was not a UI defect. The private review catalog faithfully displayed
incorrect research decisions.

## Corrected nine-combination matrix

| River  | Chinook                                       | Coho                                       | Fall Steelhead                           | Audit result                                                          |
| ------ | --------------------------------------------- | ------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------- |
| Grand  | Supported hidden review                       | Supported hidden review                    | Supported hidden review                  | Existing decisions retained after DNR passage-evidence check          |
| Platte | **Corrected to supported hidden review**      | Supported hidden review                    | **Corrected to supported hidden review** | Direct DNR lower-weir records contradict the prior disabled decisions |
| White  | Supported; **beginning corrected to Aug. 15** | **Corrected to sparse 2/10 hidden review** | Supported hidden review                  | 2026 DNR assessment identifies annual migrations of all three species |

## Decisive corrections

### Platte Chinook

Michigan DNR Technical Report 91-1 reports recurring lower-weir Chinook returns
from 1979-90 (average 4,722 adults), a 1990 total of 1,761, a late-September
through November run, and a strongest 1990 interval from late September to
October 17. It explains that these fish were strays, hatchery escapees, or
natural reproduction because Chinook were not planted in the Platte. A 2024 DNR
enforcement report documents an 18-pound Platte king salmon. No stocking and
omission from Better Fishing Waters limit the ceiling; they do not establish
absence.

Corrected draft: September 15 beginning, September 23 anchor, conservative 4/10
ceiling, concentrated lower corridor, Activity/Fishability unavailable.

### Platte Fall Steelhead

Technical Report 91-1 records Steelhead beginning September 3, describes the run
as strong throughout fall, places its peak in the week of October 17, and
records fish through November 30. Its 1980-90 table demonstrates recurring fall
returns. DNR's 2026 emergency egg take separately confirms a substantial Platte
population but is not used to infer fall timing.

Corrected draft: September 3 beginning, October 17 anchor, calibrated 7/10
ceiling, retained winter holding tail, Activity/Fishability unavailable.

### White Chinook

The 2026 DNR Lower White River assessment calls the river a self-sustaining
Chinook destination fishery. DNR Chinook biology places upstream migration and
catchability in mid-August. Direct White enforcement observations begin in
mid-September and support the later curve, but they are not evidence that no
fish enter earlier.

Corrected draft: August 15 beginning at 5% of the 7/10 river ceiling; gradual
rise to direct mid-September evidence; October 8 anchor retained.

### White Coho

The same 2026 DNR assessment explicitly documents annual Coho migration and wild
Coho in most accessible tributaries, while describing catches as occasional and
a larger run as desirable. That supports a real but sparse profile. The
correction uses a 2/10 ceiling, broad-but-sparse distribution, general DNR
September-November Coho timing, and unavailable Activity.

## Sources

- Michigan DNR,
  [Platte River Harvest Weir and Coho Salmon Egg-Take Report,
  1990 (Technical Report 91-1)](https://www.michigandnr.com/publications/pdfs/DNRFishLibrary/TechnicalReports/TR91-1.pdf)
- Michigan DNR,
  [Lower White River Status Report 0460](https://www2.dnr.state.mi.us/publications/pdfs/DNRFishLibrary/StatusoftheFisheryResourceReports/0460_2026_Lower_White_River.pdf)
- Michigan DNR,
  [Chinook salmon](https://www.michigan.gov/dnr/education/michigan-species/fish-species/chinook-salmon)
- Michigan DNR,
  [Steelhead](https://www.michigan.gov/dnr/education/michigan-species/fish-species/steelhead)
- Michigan DNR,
  [Platte River State Fish Hatchery & Weir](https://www.michigan.gov/dnr/managing-resources/fisheries/hatcheries/platte)
- Michigan DNR,
  [2026 Platte Steelhead egg collection](https://www.michigan.gov/dnr/about/newsroom/releases/2026/05/14/dnr-staff-successfully-complete-steelhead-egg-collection-after-lightning-strike-damage)
- Michigan DNR,
  [Conservation officer report, Sept. 15-28, 2024](https://www.michigan.gov/dnr/managing-resources/laws/cobiweekly/reports/2024/9-15-2024-9-28-2024)

## Process correction

The rapid-onboarding playbook, run template, and packet validator now require a
candidate capability audit that separates occurrence, recurrence, dependable
opportunity, and calibration quality. An unsupported verdict requires a logged
contradiction search across current assessments, stocking, technical/weir/creel
archives, current field observations, aliases, and regulatory context. “Not
found,” omission from a list, no direct stocking, or evidence from another
season can no longer become unsupported by themselves.

## Remaining gates

Regenerate all private fixtures, run configuration/engine/review QA, and obtain
fresh owner copy/visual acceptance. These corrections do not authorize public
enablement, deployment, or release.
