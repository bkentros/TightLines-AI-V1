import { addDays } from "../metrics/dateWindow.ts";

export type RefreshSlot = "00:00" | "08:00" | "16:00";

export const RIVER_RUN_REFRESH_SLOTS: readonly RefreshSlot[] = [
  "00:00",
  "08:00",
  "16:00",
];

export type LocalDateTimeInput = {
  localDate: string;
  localTime: string;
  timezone: string;
};

export function resolveLatestRefreshSlot(
  input: LocalDateTimeInput,
): { localDate: string; refreshSlot: RefreshSlot } {
  const minutes = parseLocalTimeMinutes(input.localTime);
  if (minutes >= 16 * 60) {
    return { localDate: input.localDate, refreshSlot: "16:00" };
  }
  if (minutes >= 8 * 60) {
    return { localDate: input.localDate, refreshSlot: "08:00" };
  }
  return { localDate: input.localDate, refreshSlot: "00:00" };
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
  if (minutes < 8 * 60) {
    return buildNext(input.localDate, "08:00", input.timezone);
  }
  if (minutes < 16 * 60) {
    return buildNext(input.localDate, "16:00", input.timezone);
  }
  return buildNext(addDays(input.localDate, 1), "00:00", input.timezone);
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
