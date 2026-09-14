type RankedTemperatureEvent = {
  startAt: string;
  endAt: string;
  severity: "minor" | "notable" | "major" | "extreme";
  magnitudeC: number;
};

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

/** Returns every event from most significant to least without mutation. */
export function rankPierCastTemperatureEvents<
  Event extends RankedTemperatureEvent,
>(
  summary: TemperatureEventCollection<Event> | null | undefined,
): Event[] {
  return [...(summary?.events ?? [])].sort(
    (left, right) =>
      TEMPERATURE_EVENT_SEVERITY_RANK[right.severity] -
        TEMPERATURE_EVENT_SEVERITY_RANK[left.severity] ||
      right.magnitudeC - left.magnitudeC ||
      left.startAt.localeCompare(right.startAt) ||
      left.endAt.localeCompare(right.endAt),
  );
}
