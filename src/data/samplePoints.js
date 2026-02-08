/**
 * When there are more than maxPoints, return a deterministic subsample (stride)
 * so the map stays responsive. Preserves spatial spread.
 */
export function samplePoints(points, maxPoints) {
  if (points.length <= maxPoints) return points;
  const step = points.length / maxPoints;
  return Array.from(
    { length: maxPoints },
    (_, i) => points[Math.min(Math.floor(i * step), points.length - 1)]
  );
}
