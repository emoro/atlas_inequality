/**
 * Legend for the Inequality Index (Atlas of Inequality–style palette).
 */
export function InequalityLegend() {
  const gradient =
    'linear-gradient(to right, rgb(61, 75, 229), rgb(75, 201, 229), rgb(247, 210, 1), rgb(255, 138, 0), rgb(229, 46, 46))';

  return (
    <div className="absolute top-4 left-4 z-10 rounded-lg bg-slate-800/95 backdrop-blur-sm px-3 py-2 shadow-lg border border-white/10">
      <div className="text-xs font-semibold text-white uppercase tracking-wider mb-2">
        Inequality index
      </div>
      <div
        className="h-3 w-44 rounded border border-white/20"
        style={{ background: gradient }}
      />
      <div className="flex justify-between text-[10px] text-white/90 mt-1.5">
        <span>Very Equal</span>
        <span>Very Unequal</span>
      </div>
    </div>
  );
}
