import { useMemo } from 'react';

/** Bin edges and colors matching the inequality palette (5 bins). */
const BINS = [
  { min: 0, max: 0.2, color: 'rgb(61, 75, 229)', label: '0–20%' },
  { min: 0.2, max: 0.4, color: 'rgb(75, 201, 229)', label: '20–40%' },
  { min: 0.4, max: 0.6, color: 'rgb(247, 210, 1)', label: '40–60%' },
  { min: 0.6, max: 0.8, color: 'rgb(255, 138, 0)', label: '60–80%' },
  { min: 0.8, max: 1, color: 'rgb(229, 46, 46)', label: '80–100%' },
];

function formatCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString();
}

const INCOME_OPTIONS = [
  { id: null, label: 'All' },
  { id: '$', label: '$' },
  { id: '$$', label: '$$' },
  { id: '$$$', label: '$$$' },
  { id: '$$$$', label: '$$$$' },
];

function InequalityDistribution({
  visiblePoints,
  placesInViewCount,
  selectedInequalityBin,
  onSelectInequalityBin,
}) {
  const histogram = useMemo(() => {
    if (!visiblePoints.length) return BINS.map((b) => ({ ...b, count: 0 }));
    return BINS.map((bin, i) => {
      const isLast = i === BINS.length - 1;
      const inBin = (p) =>
        p.score >= bin.min && (isLast ? p.score <= bin.max : p.score < bin.max);
      return { ...bin, count: visiblePoints.filter(inBin).length };
    });
  }, [visiblePoints]);

  const maxCount = Math.max(1, ...histogram.map((b) => b.count));
  const totalCount = placesInViewCount ?? visiblePoints.length;

  return (
    <div className="px-5 py-5">
      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
        Place Inequality
      </h3>
      <div className="py-2">
        <div
          className="flex items-end gap-0.5 h-16 overflow-visible"
          role="group"
          aria-label="Histogram of visible points by inequality score. Click a bar to filter."
        >
          {histogram.map((bin, i) => {
            const heightPct = maxCount > 0 ? (bin.count / maxCount) * 100 : 0;
            const heightPx = Math.max(bin.count > 0 ? 3 : 0, (heightPct / 100) * 64);
            return (
              <button
                key={i}
                type="button"
                onClick={() => onSelectInequalityBin?.(i)}
                className="flex-1 min-w-0 flex flex-col justify-end h-full cursor-pointer transition-opacity hover:opacity-90 focus:outline-none rounded-t min-h-[24px]"
                title={`${bin.label}: ${bin.count.toLocaleString()} place${bin.count !== 1 ? 's' : ''}. Click to filter.`}
              >
                <div
                  className="w-full rounded-t transition-all duration-300 ease-out"
                  style={{
                    height: heightPx,
                    backgroundColor: bin.color,
                  }}
                />
              </button>
            );
          })}
        </div>
        <div className="flex gap-0.5 mt-1 h-1.5" aria-hidden="true">
          {histogram.map((bin, i) => (
            <div
              key={i}
              className={`flex-1 min-w-0 rounded-sm transition-colors ${
                selectedInequalityBin === i ? 'bg-white' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-2 px-0.5">
        <span className="text-[10px] text-slate-500">Equal</span>
        <span className="text-[10px] text-slate-500">Unequal</span>
      </div>
      <div className="mt-3 text-[11px] text-slate-500 tabular-nums">
        {totalCount.toLocaleString()} place{totalCount !== 1 ? 's' : ''} in view
      </div>
    </div>
  );
}

/**
 * Sidebar: inequality distribution (visible viewport) and place categories with counts.
 */
export function PlaceCategoriesSidebar({
  selectedCategory,
  onSelectCategory,
  selectedInequalityBin = null,
  onSelectInequalityBin,
  selectedMajorityIncome = null,
  onSelectMajorityIncome,
  visiblePoints = [],
  visiblePointsForHistogram = [],
  categories = [],
}) {
  const categoryCounts = useMemo(() => {
    const map = new Map();
    for (const p of visiblePoints) {
      const c = p.category || 'Other';
      map.set(c, (map.get(c) || 0) + 1);
    }
    return map;
  }, [visiblePoints]);

  const totalPlaces = visiblePoints.length;

  return (
    <aside className="absolute top-4 right-4 w-72 z-10 flex flex-col bg-black/95 backdrop-blur-sm rounded-lg shadow-2xl shadow-black/50 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <p className="px-5 pt-4 pb-1 text-[11px] text-slate-500">
        Combine filters below to see specific places on the map.
      </p>
      <InequalityDistribution
        visiblePoints={visiblePointsForHistogram}
        placesInViewCount={visiblePoints.length}
        selectedInequalityBin={selectedInequalityBin}
        onSelectInequalityBin={onSelectInequalityBin}
      />

      <div className="flex flex-col shrink-0 px-5 pb-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
          Place majority
        </h2>
        <div className="flex flex-nowrap gap-1.5 overflow-x-auto min-w-0" role="group" aria-label="Filter by majority income group">
          {INCOME_OPTIONS.map(({ id, label }) => {
            const isSelected = selectedMajorityIncome === id;
            return (
              <button
                key={id ?? 'all'}
                type="button"
                onClick={() => onSelectMajorityIncome?.(id)}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-indigo-500/30 text-white'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
                title={id ? `Places where ${label} is majority (>50% time spent)` : 'Show all places'}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col shrink-0">
        <div className="px-5 py-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Place category
          </h2>
        </div>

        <nav className="overflow-y-auto py-1.5 max-h-[50vh]">
          <ul className="space-y-0.5 px-3">
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory(null)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedCategory === null
                    ? 'bg-indigo-500/30 text-white'
                    : 'text-slate-300 hover:bg-white/8 hover:text-white'
                }`}
              >
                <span className="font-medium">All</span>
                <span className="text-slate-400 tabular-nums text-[13px]">
                  {formatCount(totalPlaces)}
                </span>
              </button>
            </li>
            {categories.map((label) => {
              const count = categoryCounts.get(label) ?? 0;
              const isSelected = selectedCategory === label;
              return (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(label)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? 'bg-indigo-500/30 text-white'
                        : 'text-slate-300 hover:bg-white/8 hover:text-white'
                    }`}
                  >
                    <span className="font-medium truncate text-left">{label}</span>
                    <span className="text-slate-400 tabular-nums text-[13px] shrink-0">
                      {formatCount(count)}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
