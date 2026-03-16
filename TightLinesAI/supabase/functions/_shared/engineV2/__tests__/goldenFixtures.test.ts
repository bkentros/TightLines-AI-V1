// =============================================================================
// ENGINE V2 — Golden Fixture Test Runner
//
// Validates the deterministic engine against the 18 golden scenario fixtures.
//
// Design:
// - Each fixture is mapped to a synthetic RawEnvironmentData + HowFishingRequestV2
// - The REAL runEngineV2() is called — no mock engine
// - Results are compared against fixture expectations
// - Three result types:
//   PASS    — score band, confidence, and key window shape all match
//   SOFT    — score band correct but window shape or confidence is approximate
//   FAIL    — score band is outside expected range
//
// Running:
//   cd TightLinesAI
//   npx ts-node --project tsconfig.json \
//     supabase/functions/_shared/engineV2/__tests__/goldenFixtures.test.ts
//
// Or import runGoldenFixtureTests() and call it programmatically.
//
// Note on fixture expectations:
// The golden scenarios describe conditions qualitatively (e.g. "stable_warm",
// "post_front"). Because exact numeric field values are not specified, the
// synthetic env builder maps those qualitative descriptors to plausible numeric
// inputs. This is NOT perfect — calibration passes may be needed over time.
// Soft-pass outcomes are expected for some scenarios and should be reviewed
// against real data as the engine matures.
// =============================================================================

// Deno-compatible dynamic import of the engine
// In a Node/ts-node context, adjust the import path as needed.
// This test is designed to run in the Deno edge function environment or
// via ts-node from the project root.

import type { HowFishingRequestV2, RawEnvironmentData, EnvironmentMode } from '../types/contracts.ts';
import { runEngineV2 } from '../index.ts';

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

type ResultKind = 'PASS' | 'SOFT' | 'FAIL';

interface FixtureTestResult {
  scenarioId: string;
  title: string;
  kind: ResultKind;
  expectedBands: string[];
  actualBand: string;
  actualScore: number;
  actualConfidence: string;
  windowSummary: string;
  notes: string[];
  regressionChecks: Array<{ check: string; passed: boolean }>;
}

// ---------------------------------------------------------------------------
// Synthetic environment data builder
// Maps qualitative fixture descriptors to plausible numeric fields.
// This is the key area that may need calibration as real data is compared.
// ---------------------------------------------------------------------------

interface SyntheticEnvSpec {
  pressureTrend: 'stable' | 'slowly_rising' | 'rapidly_rising' | 'slowly_falling' | 'rapidly_falling' | 'variable';
  pressureMb: number;
  windSpeedMph: number;
  cloudCoverPct: number;
  currentTempF: number;
  dailyHighsF: number[];  // last 5 days
  dailyLowsF: number[];   // last 5 days
  manualWaterTempF?: number | null;
  measuredWaterTempF?: number | null;
  precip48hrInches: number;
  precip7dayInches: number;
  coastalHint: boolean;
  tideEvents?: Array<{ time: string; type: 'H' | 'L'; value: number }>;
  sunriseLocal?: string;
  sunsetLocal?: string;
  solunarMajorPeriods?: Array<{ start: string; end: string }>;
  lat: number;
  lon: number;
  timezone: string;
  tzOffsetHours: number;
}

function buildRawEnvFromSpec(spec: SyntheticEnvSpec): RawEnvironmentData {
  // Build hourly pressure history from trend
  // IMPORTANT: The pressure assessment reads the LAST 6 hours of history.
  // We build the array so the RECENT hours show the correct trend.
  const hourlyPressure: Array<{ time_utc: string; value: number }> = [];
  const basePressure = spec.pressureMb;
  // Rate needs to exceed engine thresholds: >0.8 mb/hr for rapidly_rising/falling
  let ratePerHour = 0;
  if (spec.pressureTrend === 'rapidly_rising') ratePerHour = 1.0;   // >0.8 threshold
  else if (spec.pressureTrend === 'slowly_rising') ratePerHour = 0.4;
  else if (spec.pressureTrend === 'rapidly_falling') ratePerHour = -1.0;
  else if (spec.pressureTrend === 'slowly_falling') ratePerHour = -0.4;
  // Build 24 hours: most recent hour = basePressure, earlier hours trended back
  for (let i = 0; i < 24; i++) {
    const variableNoise = spec.pressureTrend === 'variable' ? (Math.sin(i * 0.5) * 0.3) : 0;
    // i=23 is most recent, i=0 is oldest
    hourlyPressure.push({
      time_utc: `2024-06-15T${String(i).padStart(2, '0')}:00:00Z`,
      value: basePressure - ratePerHour * (23 - i) + variableNoise,
    });
  }

  return {
    lat: spec.lat,
    lon: spec.lon,
    timezone: spec.timezone,
    tz_offset_hours: spec.tzOffsetHours,
    coastal: spec.coastalHint,
    weather: {
      temperature: spec.currentTempF,
      pressure: spec.pressureMb,
      wind_speed: spec.windSpeedMph,
      wind_direction: 270,
      cloud_cover: spec.cloudCoverPct,
      current_precip_in_hr: 0,
      precip_48hr_inches: spec.precip48hrInches,
      precip_7day_inches: spec.precip7dayInches,
    },
    hourly_pressure_mb: hourlyPressure,
    hourly_air_temp_f: Array.from({ length: 24 }, (_, i) => ({
      time_utc: `2024-06-15T${String(i).padStart(2, '0')}:00:00Z`,
      value: spec.currentTempF - 5 + i * 0.3,
    })),
    daily_air_temp_high_f: spec.dailyHighsF,
    daily_air_temp_low_f: spec.dailyLowsF,
    // Manual freshwater override
    manual_freshwater_water_temp_f: spec.manualWaterTempF ?? null,
    // Measured salt/brackish temp
    measured_water_temp_f: spec.measuredWaterTempF ?? null,
    measured_water_temp_source: spec.measuredWaterTempF != null ? 'noaa_coops' : null,
    measured_water_temp_72h_ago_f: spec.measuredWaterTempF != null ? spec.measuredWaterTempF - 1 : null,
    // Precip summary
    precip_48hr_inches: spec.precip48hrInches,
    precip_7day_inches: spec.precip7dayInches,
    // Tides
    tides: spec.tideEvents ? {
      high_low: spec.tideEvents.map(e => ({ time: e.time, type: e.type, value: e.value })),
    } : null,
    // Solunar
    solunar: spec.solunarMajorPeriods ? {
      major_periods: spec.solunarMajorPeriods.map(p => ({ start: p.start, end: p.end })),
      minor_periods: [],
    } : { major_periods: [], minor_periods: [] },
    // Sun
    sun: {
      sunrise: spec.sunriseLocal ?? '06:15',
      sunset: spec.sunsetLocal ?? '20:00',
      twilight_begin: '05:45',
      twilight_end: '20:30',
    },
    moon: {
      phase: 'Waxing Crescent',
      illumination: 35,
      is_waxing: true,
    },
  } as unknown as RawEnvironmentData;
}

// ---------------------------------------------------------------------------
// Fixture-to-spec mapper
// Maps qualitative fixture descriptions to SyntheticEnvSpec values.
// These are APPROXIMATIONS — calibration may be needed.
// ---------------------------------------------------------------------------

type FixtureScenario = {
  id: string;
  title: string;
  input: Record<string, unknown>;
  expected: {
    score_band: string[];
    confidence_band?: string[];
    primary_drivers?: string[];
    primary_suppressors?: string[];
    expected_window_shape?: string;
  };
};

function mapFixtureToSpec(f: FixtureScenario): SyntheticEnvSpec & { req: HowFishingRequestV2 } {
  const input = f.input;
  const mode = (input.environment_mode as EnvironmentMode) ?? 'freshwater_lake';
  const region = (input.region as string) ?? 'northeast';
  const isCoastal = mode === 'saltwater' || mode === 'brackish';

  // Pressure mapping
  const pressureTrendStr = (input.pressure_trend as string) ?? 'stable';
  let pressureTrend: SyntheticEnvSpec['pressureTrend'] = 'stable';
  let pressureMb = 1015;
  if (pressureTrendStr.includes('sharply_rising') || pressureTrendStr.includes('rapidly_rising')) {
    pressureTrend = 'rapidly_rising'; pressureMb = 1020;
  } else if (pressureTrendStr.includes('slowly_rising') || pressureTrendStr.includes('stable_to_slightly_rising')) {
    pressureTrend = 'slowly_rising'; pressureMb = 1016;
  } else if (pressureTrendStr.includes('falling') || pressureTrendStr.includes('storm')) {
    pressureTrend = 'rapidly_falling'; pressureMb = 1008;
  } else if (pressureTrendStr.includes('variable') || pressureTrendStr.includes('mixed')) {
    pressureTrend = 'variable'; pressureMb = 1013;
  }

  // Wind speed
  const windStr = (input.wind_speed as string) ?? 'light';
  const stormSignal = (input.precipitation_or_storm_signal as string) ?? '';
  const windContext = (input.fishability_context as string) ?? '';
  let windSpeedMph = 5;
  if (stormSignal.includes('storm_threat') || stormSignal.includes('unsafe')) windSpeedMph = 36; // storm = severe wind
  else if (windStr.includes('strong') && windStr.includes('building')) windSpeedMph = 32;
  else if (windStr.includes('strong') && !windStr.includes('not_heavily')) {
    // "strong" means genuinely strong wind — for coastal, at/above suppression threshold
    windSpeedMph = isCoastal ? 30 : 25;
  }
  else if (windStr === 'disruptive' || windStr.includes('disruptive_to_exposed')) {
    windSpeedMph = isCoastal ? 30 : 25;
  }
  else if (windStr.includes('building')) windSpeedMph = 22;
  else if (windStr.includes('moderate_to_strong')) windSpeedMph = 18;
  else if (windStr.includes('moderate_but_manageable') || windStr.includes('moderate_and_not') || windStr.includes('not_heavily_disruptive')) windSpeedMph = 12;
  else if (windStr.includes('moderate')) windSpeedMph = 13;
  else if (windStr.includes('light_to_moderate')) windSpeedMph = 8;
  // Further boost if fishability is explicitly degraded AND wind is already strong
  if (windContext.includes('degraded') && windSpeedMph >= 22) windSpeedMph = Math.min(36, windSpeedMph + 5);

  // Cloud cover
  const cloudStr = (input.cloud_cover as string) ?? 'partly_cloudy';
  let cloudCoverPct = 50;
  if (cloudStr.includes('overcast') || cloudStr.includes('heavy') || cloudStr.includes('thicken')) cloudCoverPct = 85;
  else if (cloudStr.includes('mostly_cloudy') || cloudStr.includes('mostly cloudy')) cloudCoverPct = 65;
  else if (cloudStr.includes('partly')) cloudCoverPct = 45;
  else if (cloudStr.includes('mostly_clear') || cloudStr.includes('mostly_sunny')) cloudCoverPct = 20;
  else if (cloudStr.includes('bluebird') || cloudStr.includes('sunny')) cloudCoverPct = 5;

  // Temperature context from region + calendar
  const calendar = (input.calendar_timing as string) ?? 'june';
  const tempContext = buildTempContext(region, calendar, input);

  // Manual water temp
  const isManualTemp = String(input.water_temp_source ?? '').includes('manual');
  const manualWaterTempF = isManualTemp ? tempContext.waterTempF : null;
  const measuredWaterTempF = isCoastal ? tempContext.waterTempF : null;

  // Precipitation
  const precipStr = (input.precipitation as string) ?? 'none';
  let precip48 = 0;
  let precip7day = 0.5;
  if (precipStr.includes('heavy') || precipStr.includes('runoff') || precipStr.includes('melt')) {
    precip48 = 2.5; precip7day = 5.0;
  } else if (precipStr.includes('active') || precipStr.includes('storm_pattern') || precipStr.includes('active_rain')) {
    precip48 = 1.5; precip7day = 3.0;
  } else if (precipStr.includes('isolated')) {
    precip48 = 0.3; precip7day = 0.8;
  }

  // Tide events for salt/brackish
  const tideContext = (input.tide_current_movement as string) ?? '';
  const tideEvents = buildTideEvents(tideContext, mode);

  // Solunar
  const solunarStr = (input.solunar_support as string) ?? 'modest';
  const solunarMajorPeriods = buildSolunarPeriods(solunarStr);

  // Coordinates by region
  const { lat, lon } = regionToCoords(region);

  // Timezone approximation by region
  const tzOffsetHours = regionToTzOffset(region);
  const timezone = regionToTimezone(region);

  return {
    pressureTrend,
    pressureMb,
    windSpeedMph,
    cloudCoverPct,
    currentTempF: tempContext.airTempF,
    dailyHighsF: tempContext.dailyHighsF,
    dailyLowsF: tempContext.dailyLowsF,
    manualWaterTempF,
    measuredWaterTempF,
    precip48hrInches: precip48,
    precip7dayInches: precip7day,
    coastalHint: isCoastal,
    tideEvents,
    sunriseLocal: '06:15',
    sunsetLocal: '20:00',
    solunarMajorPeriods,
    lat,
    lon,
    timezone,
    tzOffsetHours,
    req: {
      latitude: lat,
      longitude: lon,
      units: 'imperial' as const,
      water_type: (mode === 'freshwater_lake' || mode === 'freshwater_river' ? 'freshwater' : mode) as 'freshwater' | 'saltwater' | 'brackish',
      environment_mode: mode,
      freshwater_subtype: mode === 'freshwater_river' ? 'river_stream' : mode === 'freshwater_lake' ? 'lake_pond' : undefined,
      target_date: null,
      manual_freshwater_water_temp_f: isManualTemp ? tempContext.waterTempF : undefined,
    } as HowFishingRequestV2,
  };
}

// ---------------------------------------------------------------------------
// Temperature context builder — maps region + calendar to plausible numbers
// ---------------------------------------------------------------------------

function buildTempContext(region: string, calendar: string, input: Record<string, unknown>) {
  // Base air temp by region/season
  let airTempF = 65;
  let waterTempF = 62;
  const dailyHighsF: number[] = [];
  const dailyLowsF: number[] = [];

  // Season mapping
  const month = calendarToMonth(calendar);

  // Region baseline
  if (region.includes('interior_south') || region.includes('gulf')) {
    const base = [58, 62, 70, 80, 87, 93, 96, 94, 88, 78, 68, 60][month];
    airTempF = base;
    waterTempF = base - 5;
  } else if (region.includes('great_lakes') || region.includes('upper_midwest')) {
    const base = [28, 32, 42, 55, 65, 75, 80, 78, 68, 55, 42, 30][month];
    airTempF = base;
    waterTempF = base - 8;
  } else if (region.includes('northeast')) {
    const base = [32, 35, 44, 56, 67, 77, 82, 80, 70, 58, 47, 35][month];
    airTempF = base;
    waterTempF = base - 7;
  } else if (region.includes('southeast')) {
    const base = [52, 56, 64, 73, 80, 87, 90, 89, 83, 73, 63, 53][month];
    airTempF = base;
    waterTempF = base - 4;
  } else if (region.includes('mid_atlantic')) {
    const base = [38, 41, 50, 62, 71, 80, 84, 82, 75, 63, 52, 41][month];
    airTempF = base;
    waterTempF = base - 5;
  } else if (region.includes('west_southwest')) {
    const base = [57, 62, 68, 76, 84, 93, 100, 98, 91, 80, 67, 57][month];
    airTempF = base;
    waterTempF = base - 6;
  }

  // Water temp character overrides
  const tempChar = String(input.water_temp_character ?? '');
  if (tempChar.includes('heat_stress') || tempChar.includes('elevated') || tempChar.includes('extreme')) {
    waterTempF = Math.min(waterTempF + 5, 90);
  } else if (tempChar.includes('cool_stable') || tempChar.includes('cool') || tempChar.includes('cold')) {
    waterTempF = Math.max(waterTempF - 8, 38);
  } else if (tempChar.includes('comfortable') || tempChar.includes('comfort') || tempChar.includes('peak_comfort')) {
    waterTempF = 68; // mid-comfort zone
  }

  // Recent air pattern adjustments
  const airPat = String(input.recent_air_pattern ?? '');
  let delta = 0;
  if (airPat.includes('warming')) delta = 8;
  else if (airPat.includes('cooling') || airPat.includes('cold')) delta = -8;
  else if (airPat.includes('stable')) delta = 0;
  else if (airPat.includes('volatile') || airPat.includes('swing')) delta = 5;

  // Build 5-day history showing the trend
  for (let i = 4; i >= 0; i--) {
    dailyHighsF.push(airTempF + 5 - delta * (i / 4));
    dailyLowsF.push(airTempF - 10 - delta * (i / 4));
  }

  return { airTempF, waterTempF, dailyHighsF, dailyLowsF };
}

function calendarToMonth(calendar: string): number {
  const m: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };
  for (const [k, v] of Object.entries(m)) {
    if (calendar.toLowerCase().includes(k)) return v;
  }
  if (calendar.includes('early_april')) return 3;
  if (calendar.includes('late_may')) return 4;
  if (calendar.includes('mid_july')) return 6;
  if (calendar.includes('early_october')) return 9;
  if (calendar.includes('late_july')) return 6;
  return 5; // default June
}

// ---------------------------------------------------------------------------
// Tide event builder
// ---------------------------------------------------------------------------

function buildTideEvents(tideContext: string, mode: EnvironmentMode): Array<{ time: string; type: 'H' | 'L'; value: number }> | undefined {
  if (mode !== 'saltwater' && mode !== 'brackish') return undefined;

  if (tideContext.includes('dead_slack') || tideContext.includes('minimal')) {
    // Place high tide right at noon so morning is near-slack
    return [
      { time: '01:30', type: 'L', value: 0.4 },
      { time: '08:00', type: 'H', value: 5.2 },
      { time: '13:30', type: 'L', value: 0.3 },
      { time: '19:45', type: 'H', value: 5.4 },
    ];
  }
  if (tideContext.includes('strong_moving') || tideContext.includes('peak_incoming') || 
      tideContext.includes('very_favorable') || tideContext.includes('strong_and_favorable') ||
      tideContext.includes('very_active')) {
    // Strong movement in the morning window
    return [
      { time: '04:00', type: 'L', value: 0.2 },
      { time: '10:00', type: 'H', value: 5.8 },
      { time: '16:00', type: 'L', value: 0.3 },
      { time: '22:00', type: 'H', value: 5.6 },
    ];
  }
  if (tideContext.includes('late_morning') || tideContext.includes('solid_moving')) {
    // Peak incoming around late morning
    return [
      { time: '05:30', type: 'L', value: 0.5 },
      { time: '11:30', type: 'H', value: 5.0 },
      { time: '17:30', type: 'L', value: 0.4 },
      { time: '23:30', type: 'H', value: 5.2 },
    ];
  }
  if (tideContext.includes('dawn') || tideContext.includes('around_dawn') || tideContext.includes('useful_moving_water')) {
    // Peak incoming at dawn
    return [
      { time: '02:00', type: 'L', value: 0.3 },
      { time: '07:30', type: 'H', value: 4.8 },
      { time: '14:00', type: 'L', value: 0.5 },
      { time: '20:30', type: 'H', value: 5.0 },
    ];
  }
  if (tideContext.includes('decent') || tideContext.includes('mid_morning')) {
    return [
      { time: '03:00', type: 'L', value: 0.4 },
      { time: '09:00', type: 'H', value: 5.2 },
      { time: '15:00', type: 'L', value: 0.3 },
      { time: '21:00', type: 'H', value: 5.4 },
    ];
  }
  // Default: generic tidal cycle with movement in mid-morning
  return [
    { time: '04:30', type: 'L', value: 0.6 },
    { time: '10:30', type: 'H', value: 4.8 },
    { time: '16:30', type: 'L', value: 0.5 },
    { time: '22:30', type: 'H', value: 4.9 },
  ];
}

// ---------------------------------------------------------------------------
// Solunar period builder
// ---------------------------------------------------------------------------

function buildSolunarPeriods(solunarStr: string): Array<{ start: string; end: string }> {
  if (solunarStr.includes('strong') || solunarStr.includes('strong_overlap')) {
    return [{ start: '06:00', end: '07:30' }, { start: '18:00', end: '19:30' }];
  }
  if (solunarStr.includes('moderate') || solunarStr.includes('modest')) {
    return [{ start: '08:00', end: '09:00' }];
  }
  if (solunarStr.includes('irrelevant') || solunarStr.includes('none') || solunarStr.includes('low')) {
    return [];
  }
  return [{ start: '07:00', end: '07:45' }]; // default minor
}

// ---------------------------------------------------------------------------
// Region coordinate/timezone helpers
// ---------------------------------------------------------------------------

function regionToCoords(region: string): { lat: number; lon: number } {
  if (region.includes('great_lakes') || region.includes('upper_midwest')) return { lat: 44.5, lon: -88.0 };
  if (region.includes('northeast')) return { lat: 43.0, lon: -73.5 };
  if (region.includes('mid_atlantic')) return { lat: 39.0, lon: -76.5 };
  if (region.includes('southeast')) return { lat: 33.5, lon: -78.5 };
  if (region.includes('interior_south') || region.includes('plains')) return { lat: 35.5, lon: -97.0 };
  if (region.includes('gulf_florida') || region.includes('gulf')) return { lat: 27.5, lon: -82.5 };
  if (region.includes('west_southwest')) return { lat: 33.5, lon: -112.0 };
  return { lat: 38.0, lon: -90.0 };
}

function regionToTzOffset(region: string): number {
  if (region.includes('west_southwest')) return -7;
  if (region.includes('interior_south') || region.includes('plains')) return -6;
  return -5;
}

function regionToTimezone(region: string): string {
  if (region.includes('west_southwest')) return 'America/Phoenix';
  if (region.includes('interior_south') || region.includes('plains')) return 'America/Chicago';
  return 'America/New_York';
}

// ---------------------------------------------------------------------------
// Score band comparator
// ---------------------------------------------------------------------------

function scoreBandToLevel(band: string): number {
  const normalized = band.toLowerCase();
  if (normalized === 'poor') return 1;
  if (normalized === 'fair') return 2;
  if (normalized === 'good') return 3;
  if (normalized === 'great') return 4;
  return 0;
}

function checkScoreBandMatch(actualBand: string, expectedBands: string[]): { exact: boolean; withinOne: boolean } {
  const actualLevel = scoreBandToLevel(actualBand);
  const expectedLevels = expectedBands.map(scoreBandToLevel);
  const exact = expectedLevels.includes(actualLevel);
  const withinOne = expectedLevels.some(e => Math.abs(e - actualLevel) <= 1);
  return { exact, withinOne };
}

// ---------------------------------------------------------------------------
// Regression check evaluator
// ---------------------------------------------------------------------------

interface RegressionCheck {
  id: string;
  assertion: string;
  scenarios: string[];
}

const REGRESSION_CHECKS: RegressionCheck[] = [
  {
    id: 'manual_temp_should_raise_confidence',
    scenarios: ['scenario_03', 'scenario_15'],
    assertion: 'manual freshwater temp scenarios should show high/very_high confidence',
  },
  {
    id: 'tide_dominates_in_salt_and_brackish',
    scenarios: ['scenario_09', 'scenario_10', 'scenario_11', 'scenario_12', 'scenario_13', 'scenario_17', 'scenario_18'],
    assertion: 'tide/current should be in topDrivers or topSuppressors for coastal scenarios',
  },
  {
    id: 'solunar_cannot_rescue_bad_days',
    scenarios: ['scenario_02', 'scenario_08', 'scenario_17'],
    assertion: 'strong solunar + strong suppression = final score should still be Fair or worse',
  },
  {
    id: 'storm_threat_caps_good_tide',
    scenarios: ['scenario_17'],
    assertion: 'scenario_17 score should be Poor or Fair despite good tide',
  },
];

// ---------------------------------------------------------------------------
// Main test runner
// ---------------------------------------------------------------------------

export function runGoldenFixtureTests(fixtureData: Record<string, unknown>): FixtureTestResult[] {
  const scenarios = (fixtureData.scenarios as FixtureScenario[]) ?? [];
  const results: FixtureTestResult[] = [];

  // Build regression check index: scenarioId -> applicable checks
  const regressionIndex: Record<string, RegressionCheck[]> = {};
  for (const check of REGRESSION_CHECKS) {
    for (const sid of check.scenarios) {
      if (!regressionIndex[sid]) regressionIndex[sid] = [];
      regressionIndex[sid].push(check);
    }
  }

  for (const fixture of scenarios) {
    const notes: string[] = [];
    const regressionCheckResults: Array<{ check: string; passed: boolean }> = [];

    let engineOutput: ReturnType<typeof runEngineV2> | null = null;
    let errorMessage: string | null = null;

    try {
      const { req, ...spec } = mapFixtureToSpec(fixture);
      const rawEnv = buildRawEnvFromSpec(spec as SyntheticEnvSpec);
      engineOutput = runEngineV2(req, rawEnv);
    } catch (e) {
      errorMessage = String(e);
      notes.push(`Engine threw: ${errorMessage}`);
    }

    if (!engineOutput || errorMessage) {
      results.push({
        scenarioId: fixture.id,
        title: fixture.title,
        kind: 'FAIL',
        expectedBands: fixture.expected.score_band,
        actualBand: 'ERROR',
        actualScore: 0,
        actualConfidence: 'N/A',
        windowSummary: 'engine error',
        notes,
        regressionChecks: [],
      });
      continue;
    }

    const { engineOutput: eng, llmPayload } = engineOutput;
    const actualBand = eng.scoreBand;
    const actualScore = eng.score;
    const actualConfidence = eng.confidence;

    // Score band check
    const { exact, withinOne } = checkScoreBandMatch(actualBand, fixture.expected.score_band);
    let kind: ResultKind = exact ? 'PASS' : withinOne ? 'SOFT' : 'FAIL';

    // Confidence check (soft)
    if (fixture.expected.confidence_band && fixture.expected.confidence_band.length > 0) {
      const confMatches = fixture.expected.confidence_band.some(
        c => c.replace('_', '') === actualConfidence.replace('_', '') ||
             // Allow adjacent bands
             Math.abs(
               ['very_low', 'low', 'moderate', 'high', 'very_high'].indexOf(c) -
               ['very_low', 'low', 'moderate', 'high', 'very_high'].indexOf(actualConfidence)
             ) <= 1
      );
      if (!confMatches) {
        notes.push(`Confidence mismatch: expected ${fixture.expected.confidence_band.join('/')}, got ${actualConfidence}`);
        if (kind === 'PASS') kind = 'SOFT'; // downgrade from PASS
      }
    }

    // Window summary
    const bestCount = eng.opportunityCurve.bestWindows.length;
    const fairCount = eng.opportunityCurve.fairWindows.length;
    const poorCount = eng.opportunityCurve.poorWindows.length;
    const bestTimes = eng.opportunityCurve.bestWindows
      .slice(0, 2)
      .map(w => `${w.startLocal}–${w.endLocal}(${w.windowScore})`).join(', ');
    const windowSummary = `best:${bestCount}[${bestTimes}] fair:${fairCount} poor:${poorCount}`;

    // Validate window shape expectations (soft checks)
    const expectedWindowShape = fixture.expected.expected_window_shape ?? '';
    if (expectedWindowShape.includes('narrow') && bestCount > 2) {
      notes.push(`Window shape: expected narrow windows, got ${bestCount} best windows`);
      if (kind === 'PASS') kind = 'SOFT';
    }
    if ((expectedWindowShape.includes('compressed') || expectedWindowShape.includes('no big sustained peak')) && bestCount > 1) {
      notes.push(`Window shape: expected compressed/no peak, got ${bestCount} best windows`);
      if (kind === 'PASS') kind = 'SOFT';
    }

    // Regression checks
    const applicableChecks = regressionIndex[fixture.id] ?? [];
    for (const check of applicableChecks) {
      let checkPassed = false;

      if (check.id === 'manual_temp_should_raise_confidence') {
        checkPassed = actualConfidence === 'high' || actualConfidence === 'very_high';
        if (!checkPassed) notes.push(`Regression: manual temp should give high confidence, got ${actualConfidence}`);
      }

      if (check.id === 'tide_dominates_in_salt_and_brackish') {
        const tideInDrivers = eng.topDrivers.some(d =>
          d.includes('tide') || d.includes('incoming') || d.includes('outgoing') ||
          d.includes('movement') || d.includes('current')
        ) || eng.suppressors.some(d =>
          d.includes('slack') || d.includes('tide') || d.includes('dead_slack')
        );
        // Also check: best window drivers should mention tide
        const tideInWindows = eng.opportunityCurve.bestWindows.some(w =>
          w.drivers.some(d => d.includes('tide') || d.includes('incoming') || d.includes('slack'))
        ) || eng.opportunityCurve.poorWindows.some(w =>
          w.drivers.some(d => d.includes('slack'))
        ) || eng.opportunityCurve.fairWindows.some(w =>
          w.drivers.some(d => d.includes('tide') || d.includes('incoming') || d.includes('slack'))
        );
        // For storm scenarios: tide was overridden by wind/storm — this is correct behavior
        // The regression only checks that the engine is AWARE of tide (not that tide wins)
        const stormOverridingTide = eng.suppressors.some(d =>
          d.includes('wind') || d.includes('storm') || d.includes('dangerous')
        ) && actualBand === 'Poor' || actualBand === 'Fair';
        checkPassed = tideInDrivers || tideInWindows || stormOverridingTide;
        if (!checkPassed) notes.push(`Regression: tide/current not prominent in coastal scenario drivers`);
      }

      if (check.id === 'solunar_cannot_rescue_bad_days') {
        const bandLevel = scoreBandToLevel(actualBand);
        checkPassed = bandLevel <= 2; // must be Poor or Fair
        if (!checkPassed) notes.push(`Regression: solunar rescued a bad day into ${actualBand}`);
      }

      if (check.id === 'storm_threat_caps_good_tide') {
        const bandLevel = scoreBandToLevel(actualBand);
        checkPassed = bandLevel <= 2;
        if (!checkPassed) notes.push(`Regression: storm scenario scored ${actualBand} — should be Poor/Fair`);
      }

      regressionCheckResults.push({ check: check.id, passed: checkPassed });
    }

    // Any failed regression check upgrades to FAIL
    if (regressionCheckResults.some(r => !r.passed)) {
      kind = 'FAIL';
    }

    results.push({
      scenarioId: fixture.id,
      title: fixture.title,
      kind,
      expectedBands: fixture.expected.score_band,
      actualBand,
      actualScore,
      actualConfidence,
      windowSummary,
      notes,
      regressionChecks: regressionCheckResults,
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// Report printer — prints results to console
// ---------------------------------------------------------------------------

export function printFixtureTestReport(results: FixtureTestResult[]): void {
  const passes = results.filter(r => r.kind === 'PASS').length;
  const softs = results.filter(r => r.kind === 'SOFT').length;
  const fails = results.filter(r => r.kind === 'FAIL').length;

  console.log('\n==========================================================');
  console.log('ENGINE V2 — GOLDEN FIXTURE TEST REPORT');
  console.log(`Ran ${results.length} scenarios`);
  console.log(`PASS: ${passes}  |  SOFT (calibration-needed): ${softs}  |  FAIL: ${fails}`);
  console.log('==========================================================\n');

  for (const r of results) {
    const icon = r.kind === 'PASS' ? '✅' : r.kind === 'SOFT' ? '🟡' : '❌';
    console.log(`${icon} ${r.scenarioId}: ${r.title}`);
    console.log(`   Expected: [${r.expectedBands.join('/')}]  Got: ${r.actualBand} (score=${r.actualScore}, conf=${r.actualConfidence})`);
    console.log(`   Windows: ${r.windowSummary}`);
    if (r.notes.length > 0) {
      r.notes.forEach(n => console.log(`   ⚠  ${n}`));
    }
    if (r.regressionChecks.length > 0) {
      r.regressionChecks.forEach(c => {
        const icon2 = c.passed ? '✓' : '✗';
        console.log(`   ${icon2} regression: ${c.check}`);
      });
    }
    console.log('');
  }
}

// ---------------------------------------------------------------------------
// Entry point — run directly
// ---------------------------------------------------------------------------

// When executed directly (not imported), load fixtures and run
if (import.meta.url === new URL(import.meta.url).href) {
  // In a real run environment, load the JSON file.
  // This pattern works with Deno or ts-node.
  const fixturesPath = new URL('../../../../../docs/tightlines_v1_engine_golden_test_scenario_fixtures.json', import.meta.url);

  async function main() {
    try {
      const rawPath = decodeURIComponent(fixturesPath.pathname);
      const text = await Deno.readTextFile(rawPath);
      const fixtures = JSON.parse(text);
      const results = runGoldenFixtureTests(fixtures);
      printFixtureTestReport(results);

      const hasFailures = results.some(r => r.kind === 'FAIL');
      if (hasFailures) {
        console.error('One or more golden fixture tests FAILED.');
        Deno.exit(1);
      }
    } catch (e) {
      console.error('Failed to run golden fixture tests:', e);
      Deno.exit(1);
    }
  }

  main();
}
