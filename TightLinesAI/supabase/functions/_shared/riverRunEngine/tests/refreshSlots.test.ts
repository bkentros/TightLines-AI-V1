import { assertEquals } from "jsr:@std/assert";
import {
  PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE,
  PERE_MARQUETTE_RIVER_PROFILE,
  refreshSlotsForDate,
  resolveLatestRefreshSlot,
  resolveNextConditionRefresh,
} from "../index.ts";

const run = PERE_MARQUETTE_FALL_CHINOOK_RUN_PROFILE;
const schedule = PERE_MARQUETTE_RIVER_PROFILE.conditionRefreshSchedule;
const timezone = PERE_MARQUETTE_RIVER_PROFILE.timezone;

Deno.test("PM resolves four-hour active-season condition slots", () => {
  assertEquals(
    refreshSlotsForDate({ localDate: "2026-09-20", run, schedule }),
    ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  );
  assertEquals(
    resolveLatestRefreshSlot({
      localDate: "2026-09-20",
      localTime: "13:42",
      timezone,
      run,
      schedule,
    }),
    { localDate: "2026-09-20", refreshSlot: "12:00" },
  );
  assertEquals(
    resolveNextConditionRefresh({
      localDate: "2026-09-20",
      localTime: "13:42",
      timezone,
      run,
      schedule,
    }),
    {
      localDate: "2026-09-20",
      refreshSlot: "16:00",
      localDateTime: "2026-09-20T16:00:00",
      timezone,
    },
  );
});

Deno.test("PM drops to daily condition refreshes outside the active window", () => {
  assertEquals(
    refreshSlotsForDate({ localDate: "2026-07-20", run, schedule }),
    ["00:00"],
  );
  assertEquals(
    resolveLatestRefreshSlot({
      localDate: "2026-07-20",
      localTime: "18:30",
      timezone,
      run,
      schedule,
    }),
    { localDate: "2026-07-20", refreshSlot: "00:00" },
  );
  assertEquals(
    resolveNextConditionRefresh({
      localDate: "2026-07-20",
      localTime: "18:30",
      timezone,
      run,
      schedule,
    }),
    {
      localDate: "2026-07-21",
      refreshSlot: "00:00",
      localDateTime: "2026-07-21T00:00:00",
      timezone,
    },
  );
});

Deno.test("PM active cadence begins at staging and covers the presence tail", () => {
  assertEquals(
    refreshSlotsForDate({ localDate: "2026-07-27", run, schedule }),
    ["00:00"],
  );
  assertEquals(
    refreshSlotsForDate({ localDate: "2026-07-28", run, schedule }),
    ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  );
  assertEquals(
    refreshSlotsForDate({ localDate: "2026-10-27", run, schedule }),
    ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  );
  assertEquals(
    refreshSlotsForDate({ localDate: "2026-10-28", run, schedule }),
    ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  );
  assertEquals(
    refreshSlotsForDate({ localDate: "2026-11-08", run, schedule }),
    ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  );
  assertEquals(
    refreshSlotsForDate({ localDate: "2026-11-09", run, schedule }),
    ["00:00"],
  );
});
