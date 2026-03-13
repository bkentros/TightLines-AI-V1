# Core Intelligence Engine Overhaul — Implementation Plan

**Goal:** Transform the fishing intelligence engine into a biologically-accurate, seasonally-aware, regionally-tuned system that knows when fish will bite and — equally important — when they won't.

---

## Phase 1: Foundation — Types & Seasonal Profiles

### 1A. Update `types.ts`

- Add `WindowLabel` value: `"NOT_RECOMMENDED"`
- Add `DailyOutlook` type:
  ```ts
  interface DailyOutlook {
    daily_score: number;           // 0-100 composite
    overall_rating: string;        // from getOverallRating(daily_score)
    summary_line: string;          // deterministic 1-liner
    fishable_hours: { start: string; end: string }[];
  }
  ```
- Add `ForecastDay` type:
  ```ts
  interface ForecastDay {
    date: string;                  // "2026-03-14"
    daily_score: number;
    overall_rating: string;
    summary_line: string;
    high_temp_f: number;
    low_temp_f: number;
    wind_mph_avg: number;
    precip_chance_pct: number;
    front_label: string | null;
  }
  ```
- Add `WeeklyOverviewResponse` and `DailyDetailResponse` types
- Add `SeasonalWeightProfile` type:
  ```ts
  type SeasonalWeightProfile = Record<string, number>; // component → weight
  ```
- Add `FishableHoursConfig` type:
  ```ts
  interface FishableHoursConfig {
    start_block: number;  // 0-47 half-hour index
    end_block: number;
    reason: string;
  }
  ```
- Add `LatitudeBand` to exports if not already exported
- Add `CoastalBand = "north_coast" | "mid_coast" | "south_coast"`
- Extend `EngineOutput` with: `daily_outlook: DailyOutlook`

### 1B. Create `seasonalProfiles.ts` (NEW FILE)

This is the largest new file. Contains all static lookup tables.

#### Monthly Weight Tables — Freshwater (5 bands × 12 months × 8 components)

Each band has 12 monthly weight profiles. Components: `water_temp_zone`, `pressure`, `light`, `temp_trend`, `solunar`, `wind`, `moon_phase`, `precipitation`. All sum to 100.

**far_north** (≥44° effective lat):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip |
|-------|-----------|----------|-------|------------|---------|------|------|--------|
| Jan   | 32        | 20       | 20    | 14         | 4       | 6    | 2    | 2      |
| Feb   | 30        | 20       | 20    | 14         | 5       | 6    | 2    | 3      |
| Mar   | 28        | 22       | 16    | 16         | 6       | 7    | 2    | 3      |
| Apr   | 26        | 22       | 14    | 16         | 8       | 8    | 3    | 3      |
| May   | 22        | 22       | 16    | 12         | 12      | 8    | 4    | 4      |
| Jun   | 20        | 22       | 16    | 10         | 14      | 8    | 4    | 6      |
| Jul   | 20        | 22       | 16    | 10         | 14      | 8    | 4    | 6      |
| Aug   | 22        | 22       | 16    | 10         | 13      | 8    | 4    | 5      |
| Sep   | 24        | 22       | 16    | 12         | 11      | 7    | 4    | 4      |
| Oct   | 26        | 22       | 16    | 14         | 8       | 7    | 3    | 4      |
| Nov   | 30        | 20       | 18    | 14         | 6       | 7    | 2    | 3      |
| Dec   | 32        | 20       | 20    | 14         | 4       | 6    | 2    | 2      |

**north** (39-44°):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip |
|-------|-----------|----------|-------|------------|---------|------|------|--------|
| Jan   | 30        | 22       | 18    | 14         | 5       | 6    | 2    | 3      |
| Feb   | 28        | 22       | 18    | 14         | 6       | 6    | 3    | 3      |
| Mar   | 26        | 22       | 16    | 16         | 7       | 7    | 3    | 3      |
| Apr   | 24        | 22       | 14    | 14         | 10      | 8    | 4    | 4      |
| May   | 22        | 22       | 16    | 12         | 12      | 8    | 4    | 4      |
| Jun   | 20        | 22       | 16    | 10         | 14      | 8    | 4    | 6      |
| Jul   | 20        | 22       | 16    | 10         | 14      | 8    | 4    | 6      |
| Aug   | 22        | 22       | 16    | 10         | 13      | 8    | 4    | 5      |
| Sep   | 24        | 22       | 16    | 12         | 11      | 7    | 4    | 4      |
| Oct   | 26        | 22       | 16    | 14         | 8       | 7    | 3    | 4      |
| Nov   | 28        | 22       | 18    | 14         | 6       | 6    | 3    | 3      |
| Dec   | 30        | 22       | 18    | 14         | 5       | 6    | 2    | 3      |

**mid** (34-39°):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip |
|-------|-----------|----------|-------|------------|---------|------|------|--------|
| Jan   | 26        | 22       | 18    | 14         | 7       | 7    | 3    | 3      |
| Feb   | 26        | 22       | 16    | 14         | 8       | 7    | 3    | 4      |
| Mar   | 24        | 22       | 16    | 14         | 9       | 8    | 3    | 4      |
| Apr   | 22        | 22       | 16    | 12         | 12      | 8    | 4    | 4      |
| May   | 20        | 22       | 16    | 10         | 14      | 8    | 4    | 6      |
| Jun   | 22        | 22       | 16    | 10         | 12      | 8    | 4    | 6      |
| Jul   | 24        | 22       | 16    | 10         | 12      | 8    | 4    | 4      |
| Aug   | 24        | 22       | 16    | 10         | 12      | 8    | 4    | 4      |
| Sep   | 22        | 22       | 16    | 12         | 12      | 8    | 4    | 4      |
| Oct   | 24        | 22       | 16    | 14         | 10      | 7    | 3    | 4      |
| Nov   | 26        | 22       | 16    | 14         | 8       | 7    | 3    | 4      |
| Dec   | 26        | 22       | 18    | 14         | 7       | 7    | 3    | 3      |

**south** (30-34°):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip |
|-------|-----------|----------|-------|------------|---------|------|------|--------|
| Jan   | 24        | 22       | 16    | 14         | 9       | 7    | 4    | 4      |
| Feb   | 24        | 22       | 16    | 14         | 9       | 7    | 4    | 4      |
| Mar   | 22        | 22       | 16    | 12         | 12      | 8    | 4    | 4      |
| Apr   | 20        | 22       | 16    | 10         | 14      | 8    | 4    | 6      |
| May   | 20        | 22       | 16    | 10         | 14      | 8    | 4    | 6      |
| Jun   | 24        | 22       | 16    | 10         | 12      | 8    | 4    | 4      |
| Jul   | 26        | 20       | 18    | 10         | 10      | 8    | 4    | 4      |
| Aug   | 26        | 20       | 18    | 10         | 10      | 8    | 4    | 4      |
| Sep   | 22        | 22       | 16    | 12         | 12      | 8    | 4    | 4      |
| Oct   | 22        | 22       | 16    | 14         | 10      | 8    | 4    | 4      |
| Nov   | 24        | 22       | 16    | 14         | 9       | 7    | 4    | 4      |
| Dec   | 24        | 22       | 16    | 14         | 9       | 7    | 4    | 4      |

**deep_south** (<30°):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip |
|-------|-----------|----------|-------|------------|---------|------|------|--------|
| Jan   | 22        | 22       | 16    | 12         | 10      | 8    | 4    | 6      |
| Feb   | 22        | 22       | 16    | 12         | 10      | 8    | 4    | 6      |
| Mar   | 20        | 22       | 16    | 10         | 14      | 8    | 4    | 6      |
| Apr   | 20        | 22       | 16    | 10         | 14      | 8    | 4    | 6      |
| May   | 22        | 22       | 16    | 10         | 12      | 8    | 4    | 6      |
| Jun   | 26        | 20       | 18    | 10         | 10      | 8    | 4    | 4      |
| Jul   | 28        | 20       | 18    | 10         | 8       | 8    | 4    | 4      |
| Aug   | 28        | 20       | 18    | 10         | 8       | 8    | 4    | 4      |
| Sep   | 24        | 22       | 16    | 12         | 10      | 8    | 4    | 4      |
| Oct   | 22        | 22       | 16    | 12         | 10      | 8    | 4    | 6      |
| Nov   | 22        | 22       | 16    | 12         | 10      | 8    | 4    | 6      |
| Dec   | 22        | 22       | 16    | 12         | 10      | 8    | 4    | 6      |

#### Monthly Weight Tables — Saltwater (3 bands × 12 months × 10 components)

Components: `water_temp_zone`, `pressure`, `light`, `temp_trend`, `solunar`, `wind`, `moon_phase`, `precipitation`, `tide_phase`, `tide_strength`. Sum to 100.

**north_coast** (≥39°):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip | tide_ph | tide_str |
|-------|-----------|----------|-------|------------|---------|------|------|--------|---------|----------|
| Jan   | 24        | 16       | 14    | 10         | 4       | 6    | 2    | 2      | 12      | 10       |
| Feb   | 22        | 16       | 14    | 10         | 5       | 6    | 2    | 3      | 12      | 10       |
| Mar   | 20        | 16       | 12    | 12         | 6       | 7    | 2    | 3      | 12      | 10       |
| Apr   | 18        | 16       | 12    | 10         | 8       | 8    | 3    | 3      | 12      | 10       |
| May   | 16        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 10       |
| Jun   | 14        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 12       |
| Jul   | 14        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 12       |
| Aug   | 16        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 10       |
| Sep   | 18        | 16       | 12    | 10         | 8       | 8    | 3    | 3      | 12      | 10       |
| Oct   | 20        | 16       | 12    | 12         | 6       | 7    | 3    | 2      | 12      | 10       |
| Nov   | 22        | 16       | 14    | 10         | 5       | 6    | 2    | 3      | 12      | 10       |
| Dec   | 24        | 16       | 14    | 10         | 4       | 6    | 2    | 2      | 12      | 10       |

**mid_coast** (30-39°):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip | tide_ph | tide_str |
|-------|-----------|----------|-------|------------|---------|------|------|--------|---------|----------|
| Jan   | 20        | 16       | 12    | 10         | 6       | 7    | 3    | 2      | 14      | 10       |
| Feb   | 18        | 16       | 12    | 10         | 7       | 7    | 3    | 3      | 14      | 10       |
| Mar   | 16        | 16       | 12    | 10         | 8       | 8    | 3    | 3      | 14      | 10       |
| Apr   | 14        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 12       |
| May   | 14        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 12       |
| Jun   | 16        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 10       |
| Jul   | 18        | 16       | 14    | 8          | 8       | 8    | 3    | 3      | 12      | 10       |
| Aug   | 18        | 16       | 14    | 8          | 8       | 8    | 3    | 3      | 12      | 10       |
| Sep   | 16        | 16       | 12    | 10         | 8       | 8    | 3    | 3      | 14      | 10       |
| Oct   | 16        | 16       | 12    | 10         | 8       | 8    | 3    | 3      | 14      | 10       |
| Nov   | 18        | 16       | 12    | 10         | 7       | 7    | 3    | 3      | 14      | 10       |
| Dec   | 20        | 16       | 12    | 10         | 6       | 7    | 3    | 2      | 14      | 10       |

**south_coast** (<30°):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip | tide_ph | tide_str |
|-------|-----------|----------|-------|------------|---------|------|------|--------|---------|----------|
| Jan   | 16        | 16       | 12    | 8          | 8       | 8    | 3    | 3      | 14      | 12       |
| Feb   | 14        | 16       | 12    | 8          | 8       | 8    | 3    | 3      | 16      | 12       |
| Mar   | 14        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 12       |
| Apr   | 14        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 12       |
| May   | 16        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 10       |
| Jun   | 20        | 16       | 14    | 8          | 8       | 8    | 3    | 3      | 12      | 8        |
| Jul   | 22        | 14       | 14    | 8          | 8       | 8    | 3    | 3      | 12      | 8        |
| Aug   | 22        | 14       | 14    | 8          | 8       | 8    | 3    | 3      | 12      | 8        |
| Sep   | 18        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 8        |
| Oct   | 16        | 16       | 12    | 8          | 10      | 8    | 3    | 3      | 14      | 10       |
| Nov   | 16        | 16       | 12    | 8          | 8       | 8    | 3    | 3      | 14      | 12       |
| Dec   | 16        | 16       | 12    | 8          | 8       | 8    | 3    | 3      | 14      | 12       |

#### Monthly Weight Tables — Brackish (3 bands × 12 months × 10 components)

Same structure as saltwater. Components: `water_temp_zone`, `pressure`, `light`, `temp_trend`, `solunar`, `wind`, `moon_phase`, `precipitation`, `tide_phase`, `tide_strength`. Sum to 100.

**north_coast** (≥39°):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip | tide_ph | tide_str |
|-------|-----------|----------|-------|------------|---------|------|------|--------|---------|----------|
| Jan   | 26        | 18       | 14    | 12         | 4       | 6    | 2    | 4      | 8       | 6        |
| Feb   | 24        | 18       | 14    | 12         | 5       | 6    | 2    | 5      | 8       | 6        |
| Mar   | 22        | 18       | 14    | 14         | 6       | 7    | 2    | 5      | 6       | 6        |
| Apr   | 20        | 18       | 14    | 12         | 8       | 8    | 3    | 5      | 6       | 6        |
| May   | 18        | 18       | 14    | 10         | 10      | 8    | 3    | 5      | 8       | 6        |
| Jun   | 16        | 18       | 14    | 8          | 10      | 8    | 3    | 5      | 10      | 8        |
| Jul   | 16        | 18       | 14    | 8          | 10      | 8    | 3    | 5      | 10      | 8        |
| Aug   | 18        | 18       | 14    | 8          | 10      | 8    | 3    | 5      | 10      | 6        |
| Sep   | 20        | 18       | 14    | 10         | 8       | 8    | 3    | 5      | 8       | 6        |
| Oct   | 22        | 18       | 14    | 12         | 6       | 7    | 3    | 4      | 8       | 6        |
| Nov   | 24        | 18       | 14    | 12         | 5       | 6    | 2    | 5      | 8       | 6        |
| Dec   | 26        | 18       | 14    | 12         | 4       | 6    | 2    | 4      | 8       | 6        |

**mid_coast** (30-39°):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip | tide_ph | tide_str |
|-------|-----------|----------|-------|------------|---------|------|------|--------|---------|----------|
| Jan   | 22        | 18       | 14    | 10         | 6       | 7    | 3    | 6      | 8       | 6        |
| Feb   | 20        | 18       | 14    | 10         | 7       | 7    | 3    | 7      | 8       | 6        |
| Mar   | 18        | 18       | 14    | 10         | 8       | 8    | 3    | 7      | 8       | 6        |
| Apr   | 16        | 18       | 14    | 8          | 10      | 8    | 3    | 7      | 8       | 8        |
| May   | 14        | 18       | 14    | 8          | 10      | 8    | 3    | 7      | 10      | 8        |
| Jun   | 16        | 18       | 14    | 8          | 10      | 8    | 3    | 7      | 8       | 8        |
| Jul   | 18        | 16       | 14    | 8          | 8       | 8    | 3    | 7      | 10      | 8        |
| Aug   | 18        | 16       | 14    | 8          | 8       | 8    | 3    | 7      | 10      | 8        |
| Sep   | 16        | 18       | 14    | 10         | 8       | 8    | 3    | 7      | 8       | 8        |
| Oct   | 18        | 18       | 14    | 10         | 8       | 8    | 3    | 5      | 8       | 8        |
| Nov   | 20        | 18       | 14    | 10         | 7       | 7    | 3    | 7      | 8       | 6        |
| Dec   | 22        | 18       | 14    | 10         | 6       | 7    | 3    | 6      | 8       | 6        |

**south_coast** (<30°):
| Month | water_temp | pressure | light | temp_trend | solunar | wind | moon | precip | tide_ph | tide_str |
|-------|-----------|----------|-------|------------|---------|------|------|--------|---------|----------|
| Jan   | 18        | 16       | 12    | 8          | 8       | 8    | 3    | 7      | 10      | 10       |
| Feb   | 16        | 16       | 12    | 8          | 8       | 8    | 3    | 7      | 12      | 10       |
| Mar   | 14        | 16       | 12    | 8          | 10      | 8    | 3    | 7      | 12      | 10       |
| Apr   | 14        | 16       | 12    | 8          | 10      | 8    | 3    | 7      | 12      | 10       |
| May   | 16        | 16       | 12    | 8          | 10      | 8    | 3    | 7      | 10      | 10       |
| Jun   | 20        | 16       | 14    | 8          | 8       | 8    | 3    | 7      | 8       | 8        |
| Jul   | 22        | 14       | 14    | 8          | 8       | 8    | 3    | 7      | 8       | 8        |
| Aug   | 22        | 14       | 14    | 8          | 8       | 8    | 3    | 7      | 8       | 8        |
| Sep   | 18        | 16       | 12    | 8          | 10      | 8    | 3    | 7      | 10      | 8        |
| Oct   | 16        | 16       | 12    | 8          | 10      | 8    | 3    | 7      | 10      | 10       |
| Nov   | 18        | 16       | 12    | 8          | 8       | 8    | 3    | 7      | 10      | 10       |
| Dec   | 18        | 16       | 12    | 8          | 8       | 8    | 3    | 7      | 10      | 10       |

#### Expected Monthly Water Temperatures (°F)

**Freshwater** (5 bands × 12 months):
| Band       | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
|------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| far_north  | 33  | 33  | 35  | 42  | 52  | 64  | 72  | 70  | 62  | 50  | 40  | 34  |
| north      | 35  | 34  | 38  | 48  | 58  | 68  | 75  | 74  | 66  | 54  | 43  | 37  |
| mid        | 42  | 41  | 46  | 56  | 66  | 75  | 80  | 79  | 72  | 60  | 50  | 44  |
| south      | 48  | 48  | 54  | 62  | 72  | 80  | 84  | 83  | 78  | 66  | 56  | 50  |
| deep_south | 55  | 56  | 62  | 70  | 78  | 84  | 87  | 86  | 82  | 73  | 63  | 57  |

**Saltwater** (3 coastal bands × 12 months):
| Band        | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
|-------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| north_coast | 40  | 38  | 42  | 48  | 56  | 66  | 72  | 74  | 68  | 58  | 50  | 44  |
| mid_coast   | 55  | 54  | 58  | 64  | 72  | 80  | 84  | 85  | 80  | 72  | 64  | 58  |
| south_coast | 68  | 68  | 72  | 76  | 80  | 84  | 86  | 87  | 85  | 80  | 74  | 70  |

**Brackish** (3 coastal bands × 12 months):
| Band        | Jan | Feb | Mar | Apr | May | Jun | Jul | Aug | Sep | Oct | Nov | Dec |
|-------------|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|
| north_coast | 38  | 36  | 40  | 47  | 55  | 65  | 71  | 72  | 66  | 56  | 48  | 42  |
| mid_coast   | 52  | 51  | 55  | 62  | 70  | 78  | 82  | 83  | 78  | 70  | 62  | 55  |
| south_coast | 65  | 65  | 69  | 74  | 78  | 83  | 85  | 86  | 83  | 78  | 72  | 68  |

#### Fishable Hours Configuration

Driven by `water_temp_zone`, NOT calendar month:

| water_temp_zone      | Fishable blocks        | Reason                                       |
|---------------------|------------------------|----------------------------------------------|
| near_shutdown_cold  | 10:00 AM – 3:00 PM    | Only warmest window; fish nearly immobile     |
| lethargic           | 9:00 AM – 5:00 PM     | Daytime warming needed                        |
| transitional        | 6:00 AM – 9:00 PM     | Good range, still light-dependent             |
| active_prime        | ALL 24 hours           | Prime metabolism — night fishing viable        |
| peak_aggression     | ALL 24 hours           | Max metabolism — any time can produce          |
| thermal_stress_heat | dawn/dusk/night only   | 5AM-9AM, 6PM-midnight, midnight-5AM          |

**Air temp safety override:** If air temp < 15°F at any block, that block is NOT_RECOMMENDED regardless of water temp zone.

#### Deviation Bonus Parameters

```ts
interface DeviationBonusConfig {
  cold_month_bonus_per_f: 2;     // +2% per °F above expected (Jan-Mar, Nov-Dec for far_north/north)
  hot_month_bonus_per_f: 1.5;    // +1.5% per °F below expected (Jun-Aug for south+)
  comfortable_threshold_f: 3;     // No bonus within ±3°F of expected
  comfortable_bonus_per_f: 1;     // ±1% per °F beyond threshold in comfortable months
  max_bonus_pct: 15;             // Cap at ±15%
}
```

Cold/hot month classification by band:
- **far_north/north**: cold = Nov-Mar, hot = Jul-Aug, comfortable = Apr-Jun, Sep-Oct
- **mid**: cold = Dec-Feb, hot = Jul-Aug, comfortable = Mar-Jun, Sep-Nov
- **south**: cold = Dec-Jan, hot = Jun-Sep, comfortable = Feb-May, Oct-Nov
- **deep_south**: cold = Jan only, hot = Jun-Sep, comfortable = rest

#### Exported Functions

```ts
getSeasonalWeights(waterType, latBand|coastalBand, month, dayOfMonth): Record<string, number>
getExpectedWaterTemp(waterType, band, month): number
getDeviationBonusPct(waterType, band, month, actualTemp): number
getFishableHoursConfig(waterTempZone): FishableHoursConfig
isColdMonth(band, month): boolean
isHotMonth(band, month): boolean
```

`getSeasonalWeights` does linear interpolation between current and next month using `dayOfMonth / daysInMonth`.

---

## Phase 2: Score Engine Overhaul (`scoreEngine.ts`)

### 2A. Replace static weight tables

- Remove `FRESHWATER_WEIGHTS`, `SALTWATER_WEIGHTS`, `BRACKISH_WEIGHTS` constants
- `getWeights()` now accepts `(waterType, latBand|coastalBand, month, dayOfMonth)` and delegates to `getSeasonalWeights()`
- `computeRawScore` signature changes to accept month/day/lat info (passed from `runCoreIntelligence`)

### 2B. Water temp deviation bonus

After computing the `water_temp_zone` component score, apply deviation bonus:

```ts
const deviationPct = getDeviationBonusPct(waterType, band, month, actualWaterTemp);
const deviationBonus = Math.round(weights.water_temp_zone * (deviationPct / 100));
components.water_temp_zone = Math.max(0, Math.min(weights.water_temp_zone, components.water_temp_zone + deviationBonus));
```

### 2C. Near_shutdown_cold interpolation

In `scoreWaterTempZone`, replace the flat `pct = 35` for `near_shutdown_cold`:

```ts
// Before: pct = 35;
// After: interpolate from 30% at 32°F to 44% at 35.9°F
if (zone === "near_shutdown_cold") {
  const waterTemp = dv.water_temp_f ?? 33;
  const minTemp = 32;
  const maxTemp = 36; // threshold into lethargic
  const minPct = 30;
  const maxPct = 44;
  pct = minPct + ((waterTemp - minTemp) / (maxTemp - minTemp)) * (maxPct - minPct);
  pct = Math.max(minPct, Math.min(maxPct, pct));
}
```

---

## Phase 3: Time Window Engine Overhaul (`timeWindowEngine.ts`)

### 3A. Fishable hours mask

Before scoring blocks, compute the fishable mask from `getFishableHoursConfig(water_temp_zone)`. For each block:
- If block is OUTSIDE fishable hours → label = `NOT_RECOMMENDED`, skip scoring
- Exception: air temp < 15°F → `NOT_RECOMMENDED` even within fishable hours

### 3B. Solunar suppression in non-fishable blocks

Within the block scoring loop, if a block is outside the fishable window, zero out solunar, moon, and reduce other components to 10% of normal. The block still gets a score (used for daily composite with weight 0.1) but cannot be classified higher than `NOT_RECOMMENDED`.

### 3C. NOT_RECOMMENDED classification

Add to `classifyBlock`:
```ts
if (isNotRecommended) return "NOT_RECOMMENDED";
// existing thresholds unchanged
```

### 3D. Full-day block output

Currently `computeTimeWindows` returns merged best/fair/worst windows. Add a new export:
```ts
export function computeAllBlocks(env, waterType, ...): BlockResult[]
```
Returns all 48 blocks with their scores, labels, and fishable status for daily display.

---

## Phase 4: Cold Front Detection Fix (`recoveryModifier.ts`)

### 4A. Back-to-back front handling

Problem: When a second pressure system arrives before the first front's recovery completes, the algorithm may pick the wrong "bottom" timestamp.

Fix in `detectColdFront`:
1. Track ALL detected front events (not just the most recent)
2. A front is "completed" only when the rise phase finishes (rise ≥4mb after bottom)
3. If a new drop begins before the previous front's rise completes, treat it as a continuation/strengthening of the same front event
4. Return the most recent COMPLETED front
5. Add a `developing_front` flag when a drop is in progress but rise not yet confirmed

### 4B. Developing front awareness

Add to return type:
```ts
{ daysSinceFront: number; frontSeverity: FrontSeverity | null; developing_front: boolean }
```

When `developing_front` is true, the engine can note "pressure dropping — front may be approaching" without triggering full recovery modifier.

---

## Phase 5: Daily Composite Score (`index.ts`)

### 5A. Compute daily score

After time window computation, calculate daily composite:

```ts
const allBlocks = computeAllBlocks(env, waterType, ...);
const dailyScore = computeDailyComposite(allBlocks);
```

Where `computeDailyComposite`:
- Fishable blocks get weight 1.0
- Non-fishable blocks get weight 0.1
- `daily_score = round(sum(block.score * block.weight) / sum(weights))`

### 5B. Deterministic summary line

Generate a one-liner from engine state without LLM:

```ts
function generateSummaryLine(adjustedScore, behavior, alerts, engineEnv): string
```

Examples:
- "Active bite expected — stable pressure, warming trend, prime water temps."
- "Slow day ahead — cold front recovery in progress, fish holding deep."
- "Caution: thermal stress. Best action at dawn and dusk only."

### 5C. Daily outlook in output

Add to `EngineOutput`:
```ts
daily_outlook: {
  daily_score: number,
  overall_rating: string,
  summary_line: string,
  fishable_hours: { start: string, end: string }[],
}
```

---

## Phase 6: River-Specific LLM Prompt (`how-fishing/index.ts`)

### 6A. Create `RIVER_SYSTEM_PROMPT`

Variant of `HOW_FISHING_SYSTEM_PROMPT` that emphasizes:
- Current flow and positioning (eddies, seams, tailouts)
- Structure orientation (log jams, cut banks, bridge pilings)
- Presentation into current (upstream casting, dead drift, swing)
- Depth changes relative to river structure
- Seasonal run patterns if applicable

### 6B. Route river tabs to river prompt

In `buildLLMPayload`, when `freshwater_subtype === "river"`, use `RIVER_SYSTEM_PROMPT` instead of default.

---

## Phase 7: 7-Day Forecast Infrastructure

### 7A. `get-environment/index.ts` — Expand forecast range

Change `fetchOpenMeteo` from `forecast_days: '1'` to `forecast_days: '7'`.

Add a new function:
```ts
function buildForecastDaySnapshot(
  forecastData: OpenMeteoResponse,
  dayIndex: number,  // 0-6
  baseEnvData: EnvironmentResponse
): EnvironmentSnapshot
```

This extracts a single future day's data from the 7-day forecast and creates a synthetic `EnvironmentSnapshot` for engine consumption.

### 7B. `how-fishing/index.ts` — Two-mode support

Add `mode` parameter to request: `"current"` (default), `"weekly_overview"`, `"daily_detail"`.

**weekly_overview mode:**
1. Build 7 forecast day snapshots
2. Run `runCoreIntelligence` for each
3. Extract daily_score, summary_line, key weather facts
4. Return `ForecastDay[]` — zero LLM calls

**daily_detail mode:**
1. Accept `target_date` parameter
2. Build forecast snapshot for that specific day
3. Run `runCoreIntelligence`
4. Run LLM for narrative
5. Return full engine output + LLM narrative — 1 LLM call

### 7C. `envAdapter.ts` — Forecast snapshot support

Add `toForecastDaySnapshot(forecastData, dayIndex, baseEnv)` that:
- Uses daily high/low/avg from the forecast
- Estimates hourly patterns from daily data
- Carries forward tide predictions if available
- Uses forecast solunar data if available, else projects from current

---

## Phase 8: Integration & Wiring

### 8A. `runCoreIntelligence` updates

1. Accept `month`, `dayOfMonth`, `effectiveLatitude` in params (or derive from env)
2. Pass to `computeRawScore` for seasonal weight lookup
3. Compute `allBlocks` for daily composite
4. Build `daily_outlook` in output
5. Pass `developing_front` flag through to alerts

### 8B. Client-side changes (DEFERRED)

The following are noted for future implementation but NOT part of this engine-focused PR:
- `app/how-fishing.tsx` — 7-day selector UI
- `app/how-fishing-results.tsx` — full-day block display
- `lib/howFishing.ts` — new API call modes

---

## Implementation Order

1. `types.ts` — new types (no breaking changes, additive)
2. `seasonalProfiles.ts` — all lookup tables (new file, no dependencies)
3. `scoreEngine.ts` — seasonal weights, deviation bonus, near_shutdown interpolation
4. `timeWindowEngine.ts` — fishable hours mask, NOT_RECOMMENDED, solunar suppression
5. `recoveryModifier.ts` — cold front fix
6. `behaviorInference.ts` — no changes needed (consumes adjusted score, not weights)
7. `index.ts` — daily composite, summary line, wire everything together
8. `how-fishing/index.ts` — river prompt, weekly_overview/daily_detail modes
9. `get-environment/index.ts` — forecast_days=7, forecast snapshots
10. `envAdapter.ts` — forecast snapshot builder

---

## Testing Validation

After implementation, re-run the original 5 test scenarios:

1. **Prudenville MI (Jan, river)** — Should NOT recommend 2 AM. Fishable hours ~10AM-3PM. River narrative should mention current/structure.
2. **Tampa FL (Mar, saltwater)** — Should maintain strong tidal influence. Score should reflect stable warm conditions.
3. **Northern MI (Mar, freshwater)** — During snowstorm with near_shutdown_cold temps, fishable hours should be very narrow (10AM-3PM max). No overnight recommendations.
4. **Washington state (Mar, freshwater)** — Similar fix: no overnight best times in cold conditions.
5. **Summer MI test** — Night fishing should remain viable when water_temp_zone is active_prime. NOT_RECOMMENDED should NOT fire.

---

## Bug Fixes Included

1. **Winter overnight recommendation** — Root cause: solunar points awarded to blocks outside biologically fishable hours. Fix: fishable hours mask + seasonal weight suppression of solunar.
2. **Cold front timing off ~1 day** — Root cause: back-to-back pressure systems confusing bottom detection. Fix: track completed fronts separately from developing systems.
3. **Near_shutdown_cold flat scoring** — Root cause: `pct = 35` for entire zone. Fix: interpolation from 30% at 32°F to 44% at 36°F.
4. **River tab lacks differentiation** — Fix: river-specific LLM prompt.
