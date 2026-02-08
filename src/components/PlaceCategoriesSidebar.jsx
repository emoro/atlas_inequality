import { useMemo } from 'react';

/** Bin edges and colors matching the inequality palette (5 bins). */
const BINS = [
  { min: 0, max: 0.2, color: 'rgb(61, 75, 229)', label: '0–20%' },
  { min: 0.2, max: 0.4, color: 'rgb(75, 201, 229)', label: '20–40%' },
  { min: 0.4, max: 0.6, color: 'rgb(247, 210, 1)', label: '40–60%' },
  { min: 0.6, max: 0.8, color: 'rgb(255, 138, 0)', label: '60–80%' },
  { min: 0.8, max: 1, color: 'rgb(229, 46, 46)', label: '80–100%' },
];

function InequalityDistribution({ visiblePoints }) {
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
  const totalCount = visiblePoints.length;

  return (
    <div className="px-4 py-4 border-b border-white/10">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-widest">
          Inequality (Visible)
        </h3>
        <span className="text-[10px] text-slate-500 tabular-nums">
          {totalCount.toLocaleString()} point{totalCount !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="flex items-end gap-1 h-20" role="img" aria-label="Histogram of visible points by inequality score">
        {histogram.map((bin, i) => {
          const heightPct = maxCount > 0 ? (bin.count / maxCount) * 100 : 0;
          const heightPx = Math.max(bin.count > 0 ? 4 : 0, (heightPct / 100) * 80);
          return (
            <div
              key={i}
              className="flex-1 min-w-0 flex flex-col justify-end h-full"
              title={`${bin.label}: ${bin.count.toLocaleString()} place${bin.count !== 1 ? 's' : ''}`}
            >
              <div
                className="w-full rounded-t-md transition-all duration-300 ease-out border border-white/10 border-b-0"
                style={{
                  height: heightPx,
                  backgroundColor: bin.color,
                  boxShadow: bin.count > 0 ? 'inset 0 1px 0 rgba(255,255,255,0.12)' : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 px-0.5">
        <span className="text-[9px] text-slate-500 uppercase tracking-wider">Equal</span>
        <span className="text-[9px] text-slate-500 uppercase tracking-wider">Unequal</span>
      </div>
    </div>
  );
}

/**
 * Sidebar with inequality distribution (visible viewport) and Place Categories.
 * categories: list of category labels (e.g. unique pcat from data).
 */
export function PlaceCategoriesSidebar({ selectedCategory, onSelectCategory, visiblePoints = [], categories = [] }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col bg-slate-900 border-l border-white/10 overflow-hidden">
      <InequalityDistribution visiblePoints={visiblePoints} />
      <div className="p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white/95 uppercase tracking-wider">
          Place Categories
        </h2>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => onSelectCategory(null)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                selectedCategory === null
                  ? 'bg-indigo-500/40 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              All
            </button>
          </li>
          {categories.map((label) => (
            <li key={label}>
              <button
                type="button"
                onClick={() => onSelectCategory(label)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === label
                    ? 'bg-indigo-500/40 text-white'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
