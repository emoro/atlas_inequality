/**
 * Map score in [0, 1] to RGB for Inequality Index.
 * Atlas of Inequality–style palette: blue → cyan → yellow → orange → red (no white).
 * Returns [r, g, b] in 0-255.
 */
const STOPS = [
  [61, 75, 229],   // 0   – deep blue (Very Equal)
  [75, 201, 229],  // 0.25 – cyan
  [247, 210, 1],   // 0.5  – yellow
  [255, 138, 0],   // 0.75 – orange
  [229, 46, 46],   // 1    – red (Very Unequal)
];

function lerp(a, b, t) {
  return Math.round(a + (b - a) * t);
}

export function scoreToRgb(score) {
  const t = Math.max(0, Math.min(1, score));
  const i = Math.min(3, Math.floor(t * 4)); // segment 0..3
  const local = (t * 4) - i;
  const [r0, g0, b0] = STOPS[i];
  const [r1, g1, b1] = STOPS[i + 1];
  return [lerp(r0, r1, local), lerp(g0, g1, local), lerp(b0, b1, local)];
}

/** For deck.gl: returns [r, g, b] in 0-255 (same as above). */
export function scoreToColor(score) {
  return scoreToRgb(score);
}
