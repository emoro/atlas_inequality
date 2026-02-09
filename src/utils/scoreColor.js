/**
 * Map score in [0, 1] to RGB for Inequality Index.
 * Exactly 5 discrete colors: deep blue → cyan → yellow → orange → red.
 * Returns [r, g, b] in 0-255.
 */
const COLORS = [
  [61, 75, 229],   // 0–20%   – deep blue (Very Equal)
  [75, 201, 229],  // 20–40%  – cyan
  [247, 210, 1],   // 40–60%  – yellow
  [255, 138, 0],   // 60–80%  – orange
  [229, 46, 46],   // 80–100% – red (Very Unequal)
];

export function scoreToRgb(score) {
  const t = Math.max(0, Math.min(1, score));
  const i = Math.min(4, Math.floor(t * 5)); // bin into 0..4
  return [...COLORS[i]];
}

/** For deck.gl: returns [r, g, b] in 0-255 (same as above). */
export function scoreToColor(score) {
  return scoreToRgb(score);
}
