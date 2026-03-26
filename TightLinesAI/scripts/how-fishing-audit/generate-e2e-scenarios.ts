#!/usr/bin/env -S deno run --allow-read --allow-write
/**
 * Build a fixed-size stratified E2E scenario list from AUDIT_SCENARIOS (real lat/lon/dates).
 *
 * Usage:
 *   cd TightLinesAI && deno run --allow-read --allow-write \
 *     scripts/how-fishing-audit/generate-e2e-scenarios.ts \
 *     --seed 424242 --count 50 --out scripts/how-fishing-audit/scenarios-e2e-50.json
 */

import { dirname, join } from "jsr:@std/path";
import { fromFileUrl } from "jsr:@std/path/from-file-url";
import { AUDIT_SCENARIOS, type AuditScenario } from "./auditScenarios.ts";

const auditDir = dirname(fromFileUrl(import.meta.url));

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(arr: T[], rand: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
}

/** Human-ish label for polish prompt (mirrors run-llm-audit locationFromId). */
function locationNameFromId(id: string): string {
  const parts = id.split("-");
  const contextTypes = new Set(["lake", "river", "coastal", "pond"]);
  let contextIdx = -1;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (contextTypes.has(parts[i]!)) {
      contextIdx = i;
      break;
    }
  }
  const nameParts = contextIdx > 0 ? parts.slice(0, contextIdx) : parts.slice(0, parts.length - 4);
  return nameParts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
}

export type E2eScenarioRow = AuditScenario & {
  location_name: string;
  e2e_seed_note?: string;
};

function parseArgs(): { seed: number; count: number; out: string } {
  const a = Deno.args;
  let seed = 424242;
  let count = 50;
  let out = join(auditDir, "scenarios-e2e-50.json");
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "--seed" && a[i + 1]) seed = parseInt(a[i + 1]!, 10) || seed;
    if (a[i] === "--count" && a[i + 1]) count = parseInt(a[i + 1]!, 10) || count;
    if (a[i] === "--out" && a[i + 1]) out = a[i + 1]!;
  }
  return { seed, count, out };
}

function stratifiedPick(
  pool: AuditScenario[],
  target: number,
  rand: () => number,
): AuditScenario[] {
  if (pool.length <= target) {
    return pool.map((s) => ({ ...s }));
  }
  const byContext: Record<string, AuditScenario[]> = {
    freshwater_lake_pond: [],
    freshwater_river: [],
    coastal: [],
  };
  for (const s of pool) {
    byContext[s.context]!.push(s);
  }
  const ctxOrder = [
    "freshwater_lake_pond",
    "freshwater_river",
    "coastal",
    "coastal_flats_estuary",
  ] as const;
  for (const c of ctxOrder) {
    shuffleInPlace(byContext[c], rand);
  }

  const picked: AuditScenario[] = [];
  const seen = new Set<string>();
  let round = 0;
  while (picked.length < target && round < 500) {
    round++;
    for (const c of ctxOrder) {
      const list = byContext[c];
      if (picked.length >= target) break;
      const idx = round - 1;
      if (idx < list.length) {
        const s = list[idx]!;
        if (!seen.has(s.id)) {
          seen.add(s.id);
          picked.push({ ...s });
        }
      }
    }
  }
  if (picked.length < target) {
    const rest = pool.filter((s) => !seen.has(s.id));
    shuffleInPlace(rest, rand);
    for (const s of rest) {
      if (picked.length >= target) break;
      picked.push({ ...s });
    }
  }
  return picked.slice(0, target);
}

const { seed, count, out } = parseArgs();
const rand = mulberry32(seed);

const picked = stratifiedPick([...AUDIT_SCENARIOS], count, rand);

const rows: E2eScenarioRow[] = picked.map((s) => ({
  ...s,
  location_name: locationNameFromId(s.id),
  e2e_seed_note: `generated seed=${seed} count=${count}`,
}));

await Deno.writeTextFile(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`Wrote ${rows.length} scenarios → ${out} (seed=${seed})`);
