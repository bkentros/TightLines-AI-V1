import type { ScoredVariableKey } from "../contracts/mod.ts";

export type ActiveVariableScore = {
  key: ScoredVariableKey;
  score: -2 | -1 | 0 | 1 | 2;
  label: string;
  weight: number;
  weightedContribution: number;
};
