export type PRNG = {
  pick<T>(arr: readonly T[]): T;
  next(): number;
};

/** Mulberry32 — deterministic, dependency-free (§12.5). */
export function createMulberry32(seed: number): PRNG {
  let state = seed >>> 0;
  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1) >>> 0;
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61) >>> 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    pick<T>(arr: readonly T[]): T {
      if (arr.length === 0) throw new Error("PRNG.pick: empty array");
      const idx = Math.floor(next() * arr.length);
      return arr[idx]!;
    },
  };
}
