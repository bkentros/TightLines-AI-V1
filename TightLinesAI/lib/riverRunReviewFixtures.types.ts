import type { RiverRunSnapshotResponse } from "./riverRunContracts";

export type RiverRunReviewScenario = {
  id: string;
  label: string;
  note?: string;
  snapshot: RiverRunSnapshotResponse;
};

export type RiverRunReviewGroup = {
  id: string;
  label: string;
  scenarios: RiverRunReviewScenario[];
};
