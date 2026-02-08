/** Place categories used for mock data and sidebar (single source of truth). */
export const PLACE_CATEGORIES = [
  'Restaurants & Cafes',
  'Retail & Shopping',
  'Parks & Recreation',
  'Education',
  'Healthcare',
  'Entertainment',
  'Transportation',
  'Religious & Community',
];

/**
 * Generates ~1000 mock data points with position, score in [0, 1], and category.
 * Points are spread within the given bounds (city or US).
 */
export function generateMockPoints(count, bounds, categories = PLACE_CATEGORIES) {
  const { west, south, east, north } = bounds;
  const points = [];
  const rng = seededRandom(42);

  for (let i = 0; i < count; i++) {
    const lng = west + rng() * (east - west);
    const lat = south + rng() * (north - south);
    const score = rng(); // 0–1
    const categoryIndex = Math.floor(rng() * categories.length);
    points.push({
      position: [lng, lat],
      score,
      category: categories[categoryIndex],
      id: `point-${i}`,
    });
  }

  return points;
}

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Bounds for the full US (approximate) */
export const US_BOUNDS = {
  west: -125,
  south: 24,
  east: -66,
  north: 50,
};

/**
 * Get bounds for a city by its center and zoom level (approximate span).
 */
export function getBoundsFromCenter(centerLng, centerLat, zoom) {
  const span = 360 / Math.pow(2, zoom);
  const latSpan = span * 0.7;
  return {
    west: centerLng - span / 2,
    east: centerLng + span / 2,
    south: centerLat - latSpan / 2,
    north: centerLat + latSpan / 2,
  };
}
