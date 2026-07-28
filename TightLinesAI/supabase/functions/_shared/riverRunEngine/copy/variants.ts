export type RiverRunCopyVariant = "A" | "B";

export const RIVER_RUN_COPY_VERSION = "river-run-copy-v2";

export type RiverRunCopyOptions = {
  copyVariant?: RiverRunCopyVariant;
  copyKey?: string;
};

export function resolveCopyVariant(
  key: string,
  forced?: RiverRunCopyVariant,
): RiverRunCopyVariant {
  if (forced) return forced;

  let hash = 2166136261;
  for (let index = 0; index < key.length; index += 1) {
    hash ^= key.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 2 === 0 ? "A" : "B";
}

export function alternate(
  variant: RiverRunCopyVariant,
  canonical: string,
  alternateCopy: string,
): string {
  return variant === "A" ? canonical : alternateCopy;
}
