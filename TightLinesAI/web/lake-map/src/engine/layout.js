const overlaps = (a, b, gap = 0) => (
  a.left < b.right + gap && a.right > b.left - gap
  && a.top < b.bottom + gap && a.bottom > b.top - gap
);

/**
 * Places the essential Layers control inside the usable vertical band without
 * colliding with visible controls that overlap its right-hand screen column.
 * The preferred position keeps the rail steady; nearby obstacle edges are the
 * deterministic fallbacks for compact phones and landscape WebViews.
 */
export function essentialControlTop({
  left,
  right,
  height,
  minTop,
  maxBottom,
  preferredTop,
  obstacles = [],
  gap = 8,
}) {
  const low = Math.ceil(minTop);
  const high = Math.floor(maxBottom - height);
  if (high < low) return low;
  const relevant = obstacles.filter((rect) => rect && rect.width !== 0 && rect.height !== 0
    && left < rect.right + gap && right > rect.left - gap);
  const clamp = (value) => Math.max(low, Math.min(high, Math.round(value)));
  const candidates = [preferredTop, low, high];
  for (const rect of relevant) candidates.push(rect.bottom + gap, rect.top - height - gap);
  const ordered = [...new Set(candidates.map(clamp))]
    .sort((a, b) => Math.abs(a - preferredTop) - Math.abs(b - preferredTop) || a - b);
  return ordered.find((top) => {
    const candidate = { left, right, top, bottom: top + height };
    return relevant.every((rect) => !overlaps(candidate, rect, gap));
  }) ?? low;
}

