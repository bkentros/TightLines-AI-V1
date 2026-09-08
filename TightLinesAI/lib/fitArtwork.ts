/** Normalized artwork bounds: left, top, right, bottom in a square canvas. */
export type ArtworkBounds = readonly [number, number, number, number];

/** Scale uniformly and center the visible subject, reserving 6% breathing room. */
export function fitArtwork(bounds: ArtworkBounds, width: number, height: number) {
  const [left, top, right, bottom] = bounds;
  const size = Math.min(width * 0.94 / (right - left), height * 0.94 / (bottom - top));
  return {
    width: size,
    height: size,
    left: (width - size * (right - left)) / 2 - size * left,
    top: (height - size * (bottom - top)) / 2 - size * top,
  };
}
