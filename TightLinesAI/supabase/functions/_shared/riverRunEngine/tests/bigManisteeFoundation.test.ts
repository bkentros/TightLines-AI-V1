import { assert, assertEquals } from "jsr:@std/assert";
import {
  BIG_MANISTEE_CONFIGURATION_DOCUMENT,
  BIG_MANISTEE_RIVER_PROFILE,
  listVisibleRiverRuns,
  parseUsgsInstantaneousValues,
  parseUsgsWaterTemperature,
  validateConfigurationRevision,
  validateRiverProfile,
} from "../index.ts";

Deno.test("Big Manistee foundation validates with Chinook and Coho selectable", () => {
  const result = validateRiverProfile(BIG_MANISTEE_RIVER_PROFILE);

  assertEquals(result.valid, true);
  assertEquals(result.issues, []);
  assertEquals(result.publicVisible, true);
  assertEquals(
    BIG_MANISTEE_RIVER_PROFILE.foundation?.targetSpecies,
    ["chinook_salmon", "coho_salmon", "steelhead"],
  );
  assertEquals(
    listVisibleRiverRuns(
      [BIG_MANISTEE_RIVER_PROFILE],
      BIG_MANISTEE_CONFIGURATION_DOCUMENT.runs,
    ).flatMap((state) => state.rivers.flatMap((river) => river.runs)).map((
      run,
    ) => run.runId),
    [
      "big_manistee_fall_chinook",
      "big_manistee_fall_coho",
      "big_manistee_fall_steelhead",
    ],
  );
});

Deno.test("Big Manistee foundation binds Wellston primary reach and source pair", () => {
  const foundation = BIG_MANISTEE_RIVER_PROFILE.foundation!;
  const primaryHydraulic = BIG_MANISTEE_RIVER_PROFILE.hydraulicSources.find(
    (source) => source.role === "primary",
  );
  const primaryTemperature = BIG_MANISTEE_RIVER_PROFILE
    .waterTemperatureSources.find((source) => source.role === "primary");

  assertEquals(foundation.primaryGaugeReachId, "big_manistee_tippy_tailwater");
  assertEquals(
    foundation.reaches.filter((reach) => reach.gaugeRepresented).map((reach) =>
      reach.reachId
    ),
    ["big_manistee_tippy_tailwater"],
  );
  assertEquals(primaryHydraulic?.siteId, "04125550");
  assertEquals(primaryTemperature?.siteId, "04125550");
  assertEquals(primaryTemperature?.sourceType, "same_gauge");
  assert(!foundation.contextualGaugeSiteIds.includes("04125550"));
});

Deno.test("Big Manistee foundation document binds selectable Chinook and Coho", () => {
  const issues = validateConfigurationRevision({
    configKey: "big_manistee",
    revision: 1,
    status: "draft",
    document: BIG_MANISTEE_CONFIGURATION_DOCUMENT,
    evidenceNotes:
      "Approved Big Manistee river foundation with owner-audit Chinook and Coho implementations.",
  });

  assertEquals(issues, []);
  assertEquals(
    BIG_MANISTEE_CONFIGURATION_DOCUMENT.runs.map((run) => run.runId),
    [
      "big_manistee_fall_chinook",
      "big_manistee_fall_coho",
      "big_manistee_fall_steelhead",
    ],
  );
  assert(
    BIG_MANISTEE_CONFIGURATION_DOCUMENT.configVersion.includes(
      "big-manistee-fall-steelhead",
    ),
  );
});

Deno.test("Big Manistee USGS normalization retains source provenance", () => {
  const gauge = parseUsgsInstantaneousValues({
    type: "FeatureCollection",
    features: [{
      properties: {
        monitoring_location_id: "USGS-04125550",
        parameter_code: "00060",
        time: "2026-08-05T20:45:00Z",
        value: "1660",
        unit_of_measure: "ft^3/s",
        approval_status: "Provisional",
        qualifier: "Ice",
        time_series_id: "flow-series",
      },
    }],
  }, "04125550");
  const temperature = parseUsgsWaterTemperature({
    payload: {
      type: "FeatureCollection",
      features: [{
        properties: {
          monitoring_location_id: "USGS-04125550",
          parameter_code: "00010",
          time: "2026-08-05T20:45:00Z",
          value: "21.1",
          unit_of_measure: "degC",
          approval_status: "Provisional",
          qualifier: "Ice",
          time_series_id: "temperature-series",
        },
      }],
    },
    source: BIG_MANISTEE_RIVER_PROFILE.waterTemperatureSources[0],
  });

  assertEquals(gauge[0]?.approvalStatus, "Provisional");
  assertEquals(gauge[0]?.qualifier, "Ice");
  assertEquals(gauge[0]?.timeSeriesId, "flow-series");
  assertEquals(temperature.observations[0]?.approvalStatus, "Provisional");
  assertEquals(temperature.observations[0]?.qualifier, "Ice");
  assertEquals(
    temperature.observations[0]?.timeSeriesId,
    "temperature-series",
  );
});
