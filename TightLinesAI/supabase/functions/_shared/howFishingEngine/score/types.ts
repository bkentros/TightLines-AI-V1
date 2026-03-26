import type { ScoredVariableKey } from "../contracts/mod.ts";

export type ActiveVariableScore = {
  key: ScoredVariableKey;
  score: number;
  label: string;
  weight: number;
  weightedContribution: number;
};
