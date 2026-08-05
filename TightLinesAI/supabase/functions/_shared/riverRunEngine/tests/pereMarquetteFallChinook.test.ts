import { assert, assertEquals } from "jsr:@std/assert";
import {
  listVisibleRiverRuns,
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  type PrimitiveDisplay,
  RIVER_RUN_REASON_CODES,
  resolveRunStage,
  scoreFishInRiver,
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
  "fishability_very_low_cap",
  "fishability_blown_out_cap",
  "fishability_sharp_rise_high_cap",
  "fishability_unknown_trend_cap",
  "fishability_stale_gauge_cap",
  "temperature_measured",
  "temperature_adjusted_reference",
  "temperature_unavailable",
  "temperature_neutral_missing",
  "temperature_cooling",
  "temperature_strong_cooling",
  "temperature_warming",
  "temperature_strong_warming",
  "temperature_too_warm_cap",
  "temperature_primary_source",
  "temperature_upstream_fallback",
  "temperature_source_stale",
  "temperature_value_invalid",
  "stage_pre_run",
  "stage_pre_run_staging",
  "stage_beginning",
  "stage_building",
  "stage_peak",
  "stage_tapering",
  "stage_ending",
  "stage_post_run",
  "conditions_ahead",
  "conditions_typical",
  "conditions_delayed",
  "conditions_insufficient",
  "conditions_checkpoint_evaluating",
  "conditions_checkpoint_river_start",
  "conditions_checkpoint_building_start",
  "conditions_checkpoint_building_established",
  "conditions_checkpoint_peak_start",
  "conditions_checkpoint_peak_complete",
  "conditions_checkpoint_reversal_tempered",
  "conditions_timing_complete",
  "conditions_limited_source_days",
  "conditions_missing_checkpoint_gauge",
  "conditions_missing_checkpoint_temperature",
  "conditions_baseline_missing",
  "conditions_baseline_insufficient_years",
  "conditions_baseline_version_mismatch",
  "conditions_baseline_window_mismatch",
  "conditions_source_mismatch",
  "conditions_signals_mixed",
  "run_strength_weak",
  "run_strength_light",
  "run_strength_medium",
  "run_strength_strong",
  "run_strength_signature",
  "historical_presence_curve",
  "data_quality_fresh",
  "data_quality_partial",
  "data_quality_stale",
  "data_quality_limited",
  "building_presence_limited_push",
  "peak_presence_weak_push",
  "good_fishability_low_presence",
  "strong_push_low_fishability",
  "delayed_conditions_strong_push",
  "beginning_ahead_conditions",
  "broad_building_delayed_conditions",
  "peak_delayed_conditions",
  "post_run_residual_presence",
] as const;

type RiverOverrides = Partial<Omit<RiverProfile, "hydraulicSources">> & {
  hydraulicSource?: Partial<RiverProfile["hydraulicSources"][number]>;
};

type RunOverrides =
  & Partial<
    Omit<
      RiverRunProfile,
      "runWindow" | "waterTemperature" | "userCopyHints"
    >
  >
  & {
    runWindow?: Partial<RiverRunProfile["runWindow"]>;
    waterTemperature?: Partial<RiverRunProfile["waterTemperature"]>;
    userCopyHints?: Partial<NonNullable<RiverRunProfile["userCopyHints"]>>;
    publicAudit?: { isEnabled: boolean; auditVersion?: string; notes?: string };
  };

function riverWith(overrides: RiverOverrides): RiverProfile {
  return {
    ...PERE_MARQUETTE_RIVER_PROFILE,
    ...overrides,
    hydraulicSources: [{
      ...PERE_MARQUETTE_RIVER_PROFILE.hydraulicSources[0],
      ...overrides.hydraulicSource,
    }],
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
    waterTemperature: {
      ...PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE.waterTemperature,
      ...overrides.waterTemperature,
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

Deno.test("PM refresh cadence is four-hourly in season and daily outside it", () => {
  assertEquals(
    PERE_MARQUETTE_RIVER_PROFILE.conditionRefreshSchedule.activeSlots,
    ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  );
  assertEquals(
    PERE_MARQUETTE_RIVER_PROFILE.conditionRefreshSchedule.inactiveSlots,
    ["00:00"],
  );
});

Deno.test("river refresh cadence fails closed when slots are invalid", () => {
  const river = riverWith({
    conditionRefreshSchedule: {
      activeSlots: ["04:00", "not-a-time"],
      inactiveSlots: [],
      evidenceNotes: "",
    },
  });
  const result = validateRiverProfile(river);

  assertEquals(result.valid, false);
  assert(
    result.issues.some((issue) =>
      issue.field.startsWith("conditionRefreshSchedule")
    ),
  );
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

Deno.test("PM Fall Chinook location guidance broadens without changing presence", () => {
  const earlyEstablished = resolveRunStage(
    PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    "2026-09-01",
  );
  assertEquals(earlyEstablished.stage, "building");
  assertEquals(earlyEstablished.broadBuildingContext, false);
  assert(/lower and middle river first/i.test(earlyEstablished.whereToStart ?? ""));
  assert(/upper holding water/i.test(earlyEstablished.detail));
  assert(/secondary starting choice/i.test(earlyEstablished.detail));

  for (const localDate of ["2026-09-10", "2026-09-19"]) {
    const broadlyEstablished = resolveRunStage(
      PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
      localDate,
    );
    assertEquals(broadlyEstablished.stage, "building");
    assertEquals(broadlyEstablished.broadBuildingContext, true);
    assert(/lower and middle river remain the first choices/i.test(
      broadlyEstablished.whereToStart ?? "",
    ));
    assert(/lower, middle, and upper sections are all in play/i.test(
      broadlyEstablished.detail,
    ));
    assert(/upper water can now hold meaningful numbers/i.test(
      broadlyEstablished.detail,
    ));
  }

  const peak = resolveRunStage(
    PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
    "2026-09-20",
  );
  assertEquals(peak.stage, "peak");
  assertEquals(peak.broadBuildingContext, false);

  const expectedPresence = new Map([
    ["2026-09-01", 44],
    ["2026-09-09", 66],
    ["2026-09-10", 69],
    ["2026-09-19", 97],
    ["2026-09-20", 100],
  ]);
  for (const [localDate, expectedScore] of expectedPresence) {
    assertEquals(
      scoreFishInRiver(PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE, localDate)
        .score,
      expectedScore,
      `Fish In River changed at ${localDate}`,
    );
  }
});

Deno.test("river without measured water-temperature sources is unsupported", () => {
  const river = riverWith({ waterTemperatureSources: [] });
  const result = validateRiverProfile(river);

  assertEquals(result.valid, false);
  assertEquals(result.publicVisible, false);
  assert(
    result.issues.some((issue) =>
      issue.field === "waterTemperatureSources" &&
      issue.code === "temperature_source_invalid"
    ),
  );
});

Deno.test("run without a measured water-temperature source priority is invalid", () => {
  const result = validateRunProfile(
    runWith({ waterTemperature: { sourcePriority: [] } }),
    PERE_MARQUETTE_RIVER_PROFILE,
  );

  assertEquals(result.valid, false);
  assert(
    result.issues.some((issue) =>
      issue.field === "waterTemperature.sourcePriority" &&
      issue.code === "temperature_source_invalid"
    ),
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
  const river = riverWith({ hydraulicSource: { reachQuality: "limited" } });
  const result = validateRiverProfile(river);

  assertEquals(result.publicVisible, false);
  assert(result.issues.some((issue) => issue.code === "gauge_reach_limited"));
});

Deno.test("missing history hides public support", () => {
  const river = riverWith({ hydraulicSource: { historyYearsAvailable: 1 } });
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
    hydraulicSource: { reachQuality: "limited" },
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
