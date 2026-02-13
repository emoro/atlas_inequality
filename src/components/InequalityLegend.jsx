/** Exactly 5 colors for the Inequality Index legend (matches scoreColor.js). */
const LEGEND_COLORS = [
  'rgb(61, 75, 229)',   // Very Equal – deep blue
  'rgb(75, 201, 229)',  // cyan
  'rgb(247, 210, 1)',   // yellow
  'rgb(255, 138, 0)',   // orange
  'rgb(229, 46, 46)',   // Very Unequal – red
];

export function InequalityLegend() {
  return (
    <div className="absolute top-4 left-4 z-10 rounded-lg bg-slate-800/95 backdrop-blur-sm px-3 py-2 shadow-lg">
      <div className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
        Place Inequality
      </div>
      <div className="flex h-3 w-44 rounded overflow-hidden">
        {LEGEND_COLORS.map((color, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-white/90 mt-1.5">
        <span>Very Equal</span>
        <span>Very Unequal</span>
      </div>
    </div>
  );
}
