import { timestampedPressureHistory } from "../request/pressureHistory.ts";
import { materializeForecastEnvForDate } from "../../../../../lib/forecastSnapshot.ts";
import { assert, assertEquals } from "jsr:@std/assert";
import { resolveRegionForCoordinates } from "../context/resolveRegion.ts";
import { resolveStateFromCoords } from "../context/usStateBounds.ts";
import { normalizePressureDetailed } from "../normalize/normalizePressure.ts";
import { buildSharedEngineRequestFromEnvData } from "../request/buildFromEnvData.ts";
import {
  runHowFishingReport,
  runHowFishingScoreOnly,
} from "../runHowFishingReport.ts";
import { resolveDailyPicksSeasonalRow } from "../../recommenderEngine/dailyPicks/resolveDailyPicksSeasonalRow.ts";

Deno.test("Pass 1: overlapping boxes no longer misidentify southern states and regions", () => {
  const cases = [
    [32.3668, -86.3, "AL", "south_central"],
    [32.2988, -90.1848, "MS", "south_central"],
    [30.4383, -84.2807, "FL", "florida"],
    [35.5951, -82.5515, "NC", "appalachian"],
    [30.8327, -83.2785, "GA", "southeast_atlantic"],
    [30.6954, -88.0399, "AL", "gulf_coast"],
    [38.9784, -76.4922, "MD", "southeast_atlantic"],
    [38.9072, -77.0369, "DC", "southeast_atlantic"],
  ] as const;
  for (const [lat, lon, state, region] of cases) {
    assertEquals(resolveRegionForCoordinates(lat, lon), {
      state_code: state,
      region_key: region,
    });
    for (let month = 1; month <= 12; month++) {
      assert(
        resolveDailyPicksSeasonalRow({
          species: "largemouth_bass",
          region_key: region,
          month,
          water_type: "freshwater_lake_pond",
        }),
      );
      if (region === "appalachian") {
        assert(
          resolveDailyPicksSeasonalRow({
            species: "river_trout",
            region_key: region,
            month,
            water_type: "freshwater_river",
          }),
        );
      }
    }
  }
});

Deno.test("Pass 1: state polygons cover all states, islands, and DC", () => {
  const points = [
    [32.37, -86.30, "AL"],
    [58.30, -134.42, "AK"],
    [33.45, -112.07, "AZ"],
    [34.75, -92.29, "AR"],
    [38.58, -121.49, "CA"],
    [39.74, -104.98, "CO"],
    [41.76, -72.68, "CT"],
    [39.16, -75.52, "DE"],
    [30.44, -84.28, "FL"],
    [33.75, -84.39, "GA"],
    [21.31, -157.86, "HI"],
    [43.62, -116.20, "ID"],
    [39.80, -89.65, "IL"],
    [39.77, -86.16, "IN"],
    [41.59, -93.60, "IA"],
    [39.05, -95.68, "KS"],
    [38.20, -84.88, "KY"],
    [30.46, -91.14, "LA"],
    [44.31, -69.78, "ME"],
    [38.98, -76.49, "MD"],
    [42.36, -71.06, "MA"],
    [42.73, -84.56, "MI"],
    [44.95, -93.09, "MN"],
    [32.30, -90.18, "MS"],
    [38.58, -92.17, "MO"],
    [46.59, -112.04, "MT"],
    [40.81, -96.68, "NE"],
    [39.16, -119.77, "NV"],
    [43.21, -71.54, "NH"],
    [40.22, -74.76, "NJ"],
    [35.69, -105.94, "NM"],
    [42.65, -73.75, "NY"],
    [35.78, -78.64, "NC"],
    [46.81, -100.78, "ND"],
    [39.96, -83.00, "OH"],
    [35.47, -97.52, "OK"],
    [44.94, -123.03, "OR"],
    [40.27, -76.88, "PA"],
    [41.82, -71.41, "RI"],
    [34.00, -81.03, "SC"],
    [44.37, -100.35, "SD"],
    [36.16, -86.78, "TN"],
    [30.27, -97.74, "TX"],
    [40.76, -111.89, "UT"],
    [44.26, -72.58, "VT"],
    [37.54, -77.44, "VA"],
    [47.04, -122.90, "WA"],
    [38.35, -81.63, "WV"],
    [43.07, -89.38, "WI"],
    [41.14, -104.82, "WY"],
    [38.91, -77.04, "DC"],
    [52.93, 173.16, "AK"], // Attu: east side of the dateline.
    [24.56, -81.78, "FL"], // Key West: detached island.
  ] as const;
  for (const [lat, lon, state] of points) {
    assertEquals(resolveStateFromCoords(lat, lon), state, `${lat},${lon}`);
  }
  for (
    const [lat, lon] of [[0, 0], [NaN, -90], [40, Infinity], [30, -60], [
      91,
      -90,
    ]]
  ) assertEquals(resolveStateFromCoords(lat, lon), null);
});

Deno.test("Pass 1: pressure uses 25 hourly endpoints, excluding earlier front and oscillations", () => {
  const history = Array.from({ length: 48 }, (_, i) => 1015 - i * .125);
  assertEquals(
    normalizePressureDetailed(history),
    normalizePressureDetailed(history.slice(-25)),
  );
  assertEquals(normalizePressureDetailed(history)?.state.detail, "-3.0 mb/24h");
  const settled = [
    ...Array.from({ length: 23 }, (_, i) => i % 2 ? 1000 : 1030),
    ...Array(25).fill(1013),
  ];
  assertEquals(
    normalizePressureDetailed(settled)?.state.label,
    "stable_neutral",
  );
  assertEquals(normalizePressureDetailed([1013, 1010.5])?.quality, "two_point");
  assertEquals(normalizePressureDetailed([NaN, Infinity, 0, null]), null);
});

Deno.test("Pass 1: missing pressure slots neither backfill old data nor fabricate a 3h swing", () => {
  assertEquals(
    normalizePressureDetailed([
      ...Array(23).fill(1013),
      ...Array(25).fill(null),
    ]),
    null,
  );
  const gaps: (number | null)[] = Array(25).fill(null);
  gaps[0] = 1013;
  gaps[12] = 1011;
  gaps[24] = 1008;
  assertEquals(
    normalizePressureDetailed(gaps)?.state.label,
    "falling_moderate",
  );
  const req = buildSharedEngineRequestFromEnvData(
    32.3668,
    -86.3,
    "2026-01-15",
    "UTC",
    "freshwater_river",
    { weather: { pressure_48hr: [1013, null, 0, 1011] } },
  );
  assertEquals(req.environment.pressure_history_mb, [1013, null, null, 1011]);
});

Deno.test("Pass 1: seven-day builder/report parity crosses autumn, winter, year, and spring boundaries", () => {
  for (
    const start of [
      "2026-09-28",
      "2026-10-28",
      "2026-11-28",
      "2026-12-28",
      "2027-01-28",
      "2027-02-26",
      "2027-03-28",
    ]
  ) {
    for (const timezone of ["America/New_York", "America/Chicago"]) {
      for (
        const context of [
          "freshwater_lake_pond",
          "freshwater_river",
          "coastal",
          "coastal_flats_estuary",
        ] as const
      ) {
        for (let offset = 0; offset <= 6; offset++) {
          const date = new Date(`${start}T12:00:00Z`);
          date.setUTCDate(date.getUTCDate() + offset);
          const target = date.toISOString().slice(0, 10);
          const env = {
            weather: {
              temp_7day_high: Array(21).fill(72),
              temp_7day_low: Array(21).fill(52),
              pressure_48hr: Array(48).fill(1013),
              wind_speed: 8,
              cloud_cover: 50,
              precip_7day_daily: Array(21).fill(0),
            },
            measured_water_temp_f: 65,
          };
          const req = buildSharedEngineRequestFromEnvData(
            30.4383,
            -84.2807,
            target,
            timezone,
            context,
            materializeForecastEnvForDate(env, target, {
              allowMeasuredWaterTemp: offset === 0,
            })!,
            offset,
            { useCalendarDayProfileForToday: true },
          );
          assertEquals(req.local_date, target);
          const report = runHowFishingReport(req);
          assertEquals(report.score, runHowFishingScoreOnly(req));
          assert(Number.isFinite(report.score));
          if (offset > 0) {
            assertEquals(req.environment.measured_water_temp_f, null);
          }
        }
      }
    }
  }
});

Deno.test("Pass 1: timestamped pressure stays anchored through DST, gaps, and shuffled input", () => {
  for (
    const [date, utcHour] of [["2026-10-31", 16], ["2026-11-01", 17], [
      "2027-03-13",
      17,
    ], ["2027-03-14", 16]] as const
  ) {
    const end = Date.parse(`${date}T${utcHour}:00:00Z`);
    const points = Array.from(
      { length: 100 },
      (_, i) => ({
        time_utc: new Date(end + (i - 70) * 3600000).toISOString(),
        value: 1000 + i,
      }),
    );
    points.splice(69, 1); // Missing hour immediately before noon; future hours remain.
    const history = timestampedPressureHistory(
      points.reverse(),
      date,
      "America/New_York",
      true,
      null,
    )!;
    assertEquals(history.length, 48);
    assertEquals(history.at(-1), 1070);
    assertEquals(history.at(-2), null);
    assertEquals(history.at(-25), 1046);
    const live = timestampedPressureHistory(
      points,
      date,
      "America/New_York",
      false,
      new Date(end - 3 * 3600000).toISOString(),
    )!;
    assertEquals(live.at(-1), 1067);
  }
  assertEquals(
    timestampedPressureHistory(
      [{ time_utc: "t0", value: 1013 }],
      "2026-01-01",
      "UTC",
      true,
      null,
    ),
    undefined,
  );
});

Deno.test("Pass 1: missing forecast pressure does not copy today's pressure scalar", () => {
  const req = buildSharedEngineRequestFromEnvData(
    30.4383,
    -84.2807,
    "2026-11-01",
    "America/New_York",
    "freshwater_lake_pond",
    {
      weather: { pressure: 1013 },
      hourly_pressure_mb: [{ time_utc: "2026-10-31T12:00:00Z", value: 1010 }],
    },
    1,
  );
  assertEquals(req.environment.pressure_mb, null);
});
