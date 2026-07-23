import { assert, assertEquals } from "jsr:@std/assert";
import {
  listVisibleRiverRuns,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  type PrimitiveDisplay,
  RIVER_RUN_REASON_CODES,
  type RiverProfile,
  type RiverRunProfile,
  validateRiverProfile,
  validateRunProfile,
} from "../index.ts";

const REQUIRED_REASON_CODES = [
  "gauge_fresh",
  "gauge_stale",
  "gauge_missing",
  "gauge_older_than_24h",
  "gauge_metric_missing",
  "gauge_reach_limited",
  "baseline_missing",
  "baseline_insufficient_history",
  "weather_fresh",
  "weather_stale",
  "weather_missing",
  "rain_missing",
  "dry_72h",
  "light_rain_48h",
  "meaningful_rain_48h",
  "strong_rain_48h",
  "heavy_rain_48h",
  "flow_trend_unknown",
  "flow_falling_24h",
  "flow_stable_24h",
  "flow_rising_24h",
  "flow_meaningful_rise_24h",
  "flow_sharp_rise_24h",
  "very_low_flow_band",
  "low_flow_band",
  "normal_flow_band",
  "ideal_flow_band",
  "high_fishable_flow_band",
  "very_high_flow_band",
  "blown_out_flow_band",
  "temperature_measured",
  "temperature_adjusted_reference",
  "temperature_air_proxy",
  "temperature_unavailable",
  "temperature_neutral_missing",
  "temperature_cooling",
  "temperature_strong_cooling",
  "temperature_warming",
  "temperature_strong_warming",
  "temperature_too_warm_cap",
  "stage_pre_run",
  "stage_beginning",
  "stage_building",
  "stage_peak",
  "stage_tapering",
  "stage_ending",
  "stage_post_run",
  "schedule_ahead",
  "schedule_on_schedule",
  "schedule_behind",
  "schedule_uncertain",
  "schedule_limited_source_days",
  "schedule_missing_yesterday_gauge",
  "schedule_missing_required_inputs",
  "run_strength_weak",
  "run_strength_light",
  "run_strength_medium",
  "run_strength_strong",
  "run_strength_signature",
  "data_quality_fresh",
  "data_quality_partial",
  "data_quality_stale",
  "data_quality_limited",
  "building_presence_limited_push",
  "peak_presence_weak_push",
  "good_fishability_low_presence",
  "strong_push_low_fishability",
  "behind_schedule_strong_push",
  "pre_run_ahead_schedule",
] as const;

type RiverOverrides = Partial<Omit<RiverProfile, "gauge">> & {
  gauge?: Partial<RiverProfile["gauge"]>;
};

type RunOverrides =
  & Partial<
    Omit<
      RiverRunProfile,
      "runWindow" | "waterTemperatureSource" | "userCopyHints"
    >
  >
  & {
    runWindow?: Partial<RiverRunProfile["runWindow"]>;
    waterTemperatureSource?: Partial<RiverRunProfile["waterTemperatureSource"]>;
    userCopyHints?: Partial<NonNullable<RiverRunProfile["userCopyHints"]>>;
    publicAudit?: { isEnabled: boolean; auditVersion?: string; notes?: string };
  };

function riverWith(overrides: RiverOverrides): RiverProfile {
  return {
    ...PERE_MARQUETTE_RIVER_PROFILE,
    ...overrides,
    gauge: {
      ...PERE_MARQUETTE_RIVER_PROFILE.gauge,
      ...overrides.gauge,
    },
  };
}

function runWith(overrides: RunOverrides): RiverRunProfile {
  return {
    ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    ...overrides,
    runWindow: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.runWindow,
      ...overrides.runWindow,
    },
    waterTemperatureSource: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.waterTemperatureSource,
      ...overrides.waterTemperatureSource,
    },
    userCopyHints: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.userCopyHints,
      ...overrides.userCopyHints,
    },
  };
}

Deno.test("reason code constants include required canonical codes", () => {
  for (const code of REQUIRED_REASON_CODES) {
    assert(RIVER_RUN_REASON_CODES.includes(code), `missing ${code}`);
  }
});

Deno.test("PM river config is structurally valid", () => {
  const result = validateRiverProfile(PERE_MARQUETTE_RIVER_PROFILE);
  assertEquals(result.valid, true);
  assertEquals(result.publicVisible, true);
  assertEquals(result.issues, []);
});

Deno.test("PM Fall Chinook run is structurally valid", () => {
  const result = validateRunProfile(
    PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    PERE_MARQUETTE_RIVER_PROFILE,
  );
  assertEquals(result.valid, true);
  assertEquals(result.publicVisible, true);
  assertEquals(
    result.issues.some((issue) => issue.code === "audit_gate_disabled"),
    false,
  );
});

Deno.test("explicit disabled audit gate hides otherwise valid PM run", () => {
  const hiddenResult = validateRunProfile(
    runWith({ publicAudit: { isEnabled: false } }),
    PERE_MARQUETTE_RIVER_PROFILE,
  );

  assertEquals(hiddenResult.valid, true);
  assertEquals(hiddenResult.publicVisible, false);
  assert(
    hiddenResult.issues.some((issue) => issue.code === "audit_gate_disabled"),
  );
});

Deno.test("invalid reach quality hides public support", () => {
  const river = riverWith({ gauge: { reachQuality: "limited" } });
  const result = validateRiverProfile(river);

  assertEquals(result.publicVisible, false);
  assert(result.issues.some((issue) => issue.code === "gauge_reach_limited"));
});

Deno.test("missing history hides public support", () => {
  const river = riverWith({ gauge: { historyYearsAvailable: 1 } });
  const result = validateRiverProfile(river);

  assertEquals(result.publicVisible, false);
  assert(
    result.issues.some((issue) =>
      issue.code === "baseline_insufficient_history"
    ),
  );
});

Deno.test("missing research/source notes hides public support", () => {
  const run = runWith({ researchNotes: "", sourceNotes: "" });
  const result = validateRunProfile(run, PERE_MARQUETTE_RIVER_PROFILE);

  assertEquals(result.publicVisible, false);
  assert(result.issues.some((issue) => issue.code === "audit_notes_missing"));
});

Deno.test("default visible helper includes PM Fall Chinook", () => {
  const catalog = listVisibleRiverRuns(
    [PERE_MARQUETTE_RIVER_PROFILE],
    [PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE],
  );

  assertEquals(
    catalog[0].rivers[0].runs[0].runId,
    "pere_marquette_fall_chinook",
  );
});

Deno.test("visible helper returns no PM run when audit gate is explicitly disabled", () => {
  const catalog = listVisibleRiverRuns(
    [PERE_MARQUETTE_RIVER_PROFILE],
    [runWith({ publicAudit: { isEnabled: false } })],
  );

  assertEquals(catalog, []);
});

Deno.test("visible helper returns only valid/public runs", () => {
  const hiddenRiver = riverWith({
    riverId: "hidden_limited_reach",
    gauge: { reachQuality: "limited" },
  });
  const hiddenRun = runWith({
    runId: "hidden_missing_notes",
    researchNotes: "",
    sourceNotes: "",
  });
  const catalog = listVisibleRiverRuns(
    [PERE_MARQUETTE_RIVER_PROFILE, hiddenRiver],
    [PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE, hiddenRun],
  );

  assertEquals(catalog.length, 1);
  assertEquals(catalog[0].state, "MI");
  assertEquals(catalog[0].rivers.length, 1);
  assertEquals(catalog[0].rivers[0].riverId, "pere_marquette");
  assertEquals(catalog[0].rivers[0].runs.map((run) => run.runId), [
    "pere_marquette_fall_chinook",
  ]);
});

Deno.test('unavailable PrimitiveDisplay shape allows score null and label "Unavailable"', () => {
  const display: PrimitiveDisplay = {
    score: null,
    label: "Unavailable",
    headline: "Gauge data is unavailable.",
    detail: "A current gauge reading is required for this primitive.",
    tip: "Check back after the next condition refresh.",
    reasonCodes: ["gauge_missing"],
  };

  assertEquals(display.score, null);
  assertEquals(display.label, "Unavailable");
});
