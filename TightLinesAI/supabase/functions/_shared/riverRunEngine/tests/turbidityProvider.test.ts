import { assertEquals } from "jsr:@std/assert";
import {
  parseUsgsTurbidity,
  resolveTurbidityRead,
  type TurbiditySourceConfig,
} from "../index.ts";

const source: TurbiditySourceConfig = {
  sourceId: "test_turbidity",
  provider: "USGS",
  siteId: "12345678",
  parameterCode: "63680",
  name: "Test river optical turbidity",
  displayLabel: "Turbidity",
  priority: 1,
  maxAgeHours: 2,
  reachQuality: "good",
  reachNotes: "Test reach only; not visibility depth.",
  attribution: "USGS parameter 63680.",
};

Deno.test("USGS turbidity parser accepts only numeric FNU from the configured station", () => {
  const observations = parseUsgsTurbidity({
    source,
    payload: {
      features: [
        feature("2026-09-08T12:00:00Z", 4.2),
        feature("2026-09-09T12:00:00Z", "5.6"),
        feature("2026-09-09T12:15:00Z", null),
        feature("2026-09-09T12:30:00Z", 99, { qualifier: "EQUIP" }),
        feature("2026-09-09T12:45:00Z", 7, {
          monitoring_location_id: "USGS-87654321",
        }),
        feature("2026-09-09T13:00:00Z", 8, {
          unit_of_measure: "NTU",
        }),
      ],
    },
  });

  assertEquals(observations.length, 2);
  assertEquals(observations[0].turbidityFnu, 4.2);
  assertEquals(observations[1].turbidityFnu, 5.6);
  assertEquals(observations[1].observedAt, "2026-09-09T12:00:00.000Z");
});

Deno.test("turbidity read uses a bounded 24-hour comparison and fails stale data closed", () => {
  const observations = parseUsgsTurbidity({
    source,
    payload: {
      features: [
        feature("2026-09-08T12:00:00Z", 4.2),
        feature("2026-09-09T12:00:00Z", 5.6),
      ],
    },
  });
  const fresh = resolveTurbidityRead({
    observations,
    refreshAtUtc: "2026-09-09T13:00:00Z",
    maxAgeHours: 2,
  });
  assertEquals(fresh.freshness, "fresh");
  assertEquals(fresh.current?.turbidityFnu, 5.6);
  assertEquals(fresh.prior24h?.turbidityFnu, 4.2);

  const stale = resolveTurbidityRead({
    observations,
    refreshAtUtc: "2026-09-10T13:00:01Z",
    maxAgeHours: 2,
  });
  assertEquals(stale.freshness, "older_than_24h");
});

function feature(
  time: string,
  value: unknown,
  overrides: Record<string, unknown> = {},
) {
  return {
    properties: {
      monitoring_location_id: "USGS-12345678",
      parameter_code: "63680",
      unit_of_measure: "_FNU",
      time,
      value,
      approval_status: "Provisional",
      qualifier: "P",
      ...overrides,
    },
  };
}
