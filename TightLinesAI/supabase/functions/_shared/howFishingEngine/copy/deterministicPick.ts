export function hashDeterministicSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function pickDeterministic<T>(
  options: readonly T[],
  seed: string,
  salt = "",
): T {
  if (options.length === 0) {
    throw new Error("pickDeterministic requires at least one option");
  }
  const h = hashDeterministicSeed(`${seed}|${salt}`);
  return options[h % options.length]!;
}

export function chanceDeterministic(
  seed: string,
  salt: string,
  threshold: number,
): boolean {
  const h = hashDeterministicSeed(`${seed}|${salt}`);
  return (h % 1000) / 1000 < threshold;
}
