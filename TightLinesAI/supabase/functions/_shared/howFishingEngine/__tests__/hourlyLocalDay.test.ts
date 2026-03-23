import { assertEquals } from "jsr:@std/assert";
import { hourlyPointsTo24ArrayForLocalDate, utcIsoToLocalDateHour } from "../request/hourlyLocalDay.ts";

Deno.test("utcIsoToLocalDateHour: America/New_York EDT midnight", () => {
  const r = utcIsoToLocalDateHour("2026-06-15T04:00:00.000Z", "America/New_York");
  assertEquals(r, { ymd: "2026-06-15", hour: 0 });
});

Deno.test("hourlyPointsTo24ArrayForLocalDate: 24 EDT hours on one calendar day", () => {
  const pts: Array<{ time_utc: string; value: number }> = [];
  for (let h = 0; h < 24; h++) {
    const iso = new Date(
      `2026-06-15T${String(h).padStart(2, "0")}:00:00-04:00`,
    ).toISOString();
    pts.push({ time_utc: iso, value: h + 100 });
  }
  const arr = hourlyPointsTo24ArrayForLocalDate(pts, "2026-06-15", "America/New_York");
  assertEquals(arr?.length, 24);
  for (let h = 0; h < 24; h++) assertEquals(arr![h], h + 100);
});
