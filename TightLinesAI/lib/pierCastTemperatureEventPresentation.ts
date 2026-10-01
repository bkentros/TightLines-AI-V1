type RankedTemperatureEvent = {
  startAt: string;
  endAt: string;
  severity: "minor" | "notable" | "major" | "extreme";
  magnitudeC: number;
};

type ReferenceTime = string | number | Date;

type TemperatureEventCollection<Event> = {
  events: readonly Event[];
};

const TEMPERATURE_EVENT_SEVERITY_RANK: Record<
  RankedTemperatureEvent["severity"],
  number
> = {
  extreme: 4,
  major: 3,
  notable: 2,
  minor: 1,
};

function timeValue(value: ReferenceTime): number {
  const parsed = value instanceof Date
    ? value.getTime()
    : new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

function eventPhase(
  event: RankedTemperatureEvent,
  referenceTime: number,
): 0 | 1 | 2 | 3 {
  const startTime = timeValue(event.startAt);
  const endTime = timeValue(event.endAt);
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return 3;
  if (startTime <= referenceTime && referenceTime < endTime) return 0;
  if (startTime > referenceTime) return 1;
  return 2;
}

/**
 * Returns every event without mutation: active first, upcoming chronologically,
 * then completed events. Significance breaks ties without hiding what happens next.
 */
export function orderPierCastTemperatureEvents<
  Event extends RankedTemperatureEvent,
>(
  summary: TemperatureEventCollection<Event> | null | undefined,
  referenceAt: ReferenceTime = Date.now(),
): Event[] {
  const referenceTime = timeValue(referenceAt);
  const safeReferenceTime = Number.isFinite(referenceTime)
    ? referenceTime
    : Date.now();

  return [...(summary?.events ?? [])].sort((left, right) => {
    const leftPhase = eventPhase(left, safeReferenceTime);
    const rightPhase = eventPhase(right, safeReferenceTime);
    const phaseDifference = leftPhase - rightPhase;
    if (phaseDifference !== 0) return phaseDifference;

    const leftStart = timeValue(left.startAt);
    const rightStart = timeValue(right.startAt);
    const leftEnd = timeValue(left.endAt);
    const rightEnd = timeValue(right.endAt);
    const chronologicalDifference = leftPhase === 2
      ? rightEnd - leftEnd
      : leftStart - rightStart;

    return chronologicalDifference ||
      TEMPERATURE_EVENT_SEVERITY_RANK[right.severity] -
        TEMPERATURE_EVENT_SEVERITY_RANK[left.severity] ||
      right.magnitudeC - left.magnitudeC ||
      left.endAt.localeCompare(right.endAt) ||
      left.startAt.localeCompare(right.startAt);
  });
}

function localDateParts(
  value: number,
  timezone: string,
): { dayNumber: number; hour: number } | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      hourCycle: "h23",
      timeZone: timezone,
    }).formatToParts(new Date(value));
    const read = (type: Intl.DateTimeFormatPartTypes) =>
      Number(parts.find((part) => part.type === type)?.value);
    const year = read("year");
    const month = read("month");
    const day = read("day");
    const hour = read("hour");
    if (![year, month, day, hour].every(Number.isFinite)) return null;
    return {
      dayNumber: Math.floor(Date.UTC(year, month - 1, day) / 86_400_000),
      hour,
    };
  } catch {
    return null;
  }
}

export function pierCastTemperatureEventTimingLabel(
  event: Pick<RankedTemperatureEvent, "startAt" | "endAt">,
  referenceAt: ReferenceTime,
  timezone: string,
): string {
  const referenceTime = timeValue(referenceAt);
  const startTime = timeValue(event.startAt);
  const endTime = timeValue(event.endAt);
  if (
    !Number.isFinite(referenceTime) ||
    !Number.isFinite(startTime) ||
    !Number.isFinite(endTime)
  ) {
    return "TIMING UNAVAILABLE";
  }
  if (startTime <= referenceTime && referenceTime < endTime) {
    return "IN PROGRESS";
  }

  const referenceLocal = localDateParts(referenceTime, timezone);
  const eventLocal = localDateParts(
    startTime > referenceTime ? startTime : endTime,
    timezone,
  );
  if (!referenceLocal || !eventLocal) {
    return startTime > referenceTime ? "UPCOMING" : "ENDED";
  }
  const dayDifference = eventLocal.dayNumber - referenceLocal.dayNumber;

  if (startTime > referenceTime) {
    if (dayDifference === 0) {
      return eventLocal.hour >= 17 && referenceLocal.hour < 17
        ? "STARTS TONIGHT"
        : "STARTS TODAY";
    }
    if (dayDifference === 1) return "STARTS TOMORROW";
    if (dayDifference > 1) return `STARTS IN ${dayDifference} DAYS`;
    return "UPCOMING";
  }

  if (dayDifference === 0) return "ENDED TODAY";
  if (dayDifference === -1) return "ENDED YESTERDAY";
  return "ENDED";
}
