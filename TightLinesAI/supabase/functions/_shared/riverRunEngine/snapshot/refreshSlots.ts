import {
  addDays,
  compareLocalDates,
  resolveActiveRunWindow,
} from "../metrics/dateWindow.ts";
import type { ConditionRefreshSchedule, RiverRunProfile } from "../types.ts";

export type RefreshSlot = string;

export type LocalDateTimeInput = {
  localDate: string;
  localTime: string;
  timezone: string;
  run: Pick<RiverRunProfile, "runWindow">;
  schedule: ConditionRefreshSchedule;
};

export function resolveLatestRefreshSlot(
  input: LocalDateTimeInput,
): { localDate: string; refreshSlot: RefreshSlot } {
  const minutes = parseLocalTimeMinutes(input.localTime);
  const slots = refreshSlotsForDate(input);
  const latest = [...slots].reverse().find((slot) =>
    parseLocalTimeMinutes(slot) <= minutes
  );
  if (!latest) {
    throw new Error(
      "Condition refresh schedules must include a 00:00 local slot.",
    );
  }
  return { localDate: input.localDate, refreshSlot: latest };
}

export function resolveNextConditionRefresh(
  input: LocalDateTimeInput,
): {
  localDate: string;
  refreshSlot: RefreshSlot;
  localDateTime: string;
  timezone: string;
} {
  const minutes = parseLocalTimeMinutes(input.localTime);
  const nextToday = refreshSlotsForDate(input).find((slot) =>
    parseLocalTimeMinutes(slot) > minutes
  );
  if (nextToday) {
    return buildNext(input.localDate, nextToday, input.timezone);
  }
  const nextDate = addDays(input.localDate, 1);
  const firstTomorrow = refreshSlotsForDate({
    ...input,
    localDate: nextDate,
  })[0];
  if (!firstTomorrow) {
    throw new Error("Condition refresh schedule has no next slot.");
  }
  return buildNext(nextDate, firstTomorrow, input.timezone);
}

export function refreshSlotsForDate(
  input: Pick<LocalDateTimeInput, "run" | "schedule"> & {
    localDate: string;
  },
): readonly RefreshSlot[] {
  const window = resolveActiveRunWindow(input.run, input.localDate);
  const active = compareLocalDates(
        input.localDate,
        window.stagingStartDate,
      ) >= 0 &&
    compareLocalDates(input.localDate, window.lateEndDate) <= 0;
  return active ? input.schedule.activeSlots : input.schedule.inactiveSlots;
}

export function isValidRefreshSlot(value: unknown): value is RefreshSlot {
  if (typeof value !== "string") return false;
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return false;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

function buildNext(
  localDate: string,
  refreshSlot: RefreshSlot,
  timezone: string,
) {
  return {
    localDate,
    refreshSlot,
    localDateTime: `${localDate}T${refreshSlot}:00`,
    timezone,
  };
}

function parseLocalTimeMinutes(localTime: string): number {
  const match = /^(\d{2}):(\d{2})(?::\d{2})?$/.exec(localTime);
  if (!match) throw new Error(`Invalid local time: ${localTime}`);
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error(`Invalid local time: ${localTime}`);
  }
  return hours * 60 + minutes;
}
