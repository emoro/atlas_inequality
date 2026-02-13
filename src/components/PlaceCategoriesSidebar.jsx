import { useMemo, useState, useEffect } from 'react';

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

const SIDEBAR_MEDIA = '(min-width: 768px)';

function useIsWideScreen() {
  const [isWide, setIsWide] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(SIDEBAR_MEDIA).matches : true
  );
  useEffect(() => {
    const m = window.matchMedia(SIDEBAR_MEDIA);
    const handler = () => setIsWide(m.matches);
    m.addEventListener('change', handler);
    setIsWide(m.matches);
    return () => m.removeEventListener('change', handler);
  }, []);
  return isWide;
}

/**
 * Sidebar: inequality distribution (visible viewport) and place categories with counts.
 * On narrow screens (< 768px) it is hidden by default and toggled via a floating button.
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
  const isWideScreen = useIsWideScreen();
  const [mobileOpen, setMobileOpen] = useState(false);

  const categoryCounts = useMemo(() => {
    const map = new Map();
    for (const p of visiblePoints) {
      const c = p.category || 'Other';
      map.set(c, (map.get(c) || 0) + 1);
    }
    return map;
  }, [visiblePoints]);

  const totalPlaces = visiblePoints.length;

  const sidebarContent = (
    <>
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
    </>
  );

  const asideClass = 'flex flex-col bg-black/95 backdrop-blur-sm rounded-lg shadow-2xl shadow-black/50 max-h-[calc(100vh-2rem)] overflow-y-auto';
  const asideContent = <aside className={`absolute top-4 right-4 w-72 z-10 ${asideClass}`}>{sidebarContent}</aside>;

  if (isWideScreen) {
    return asideContent;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="absolute top-4 right-4 z-10 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/95 backdrop-blur-sm text-white text-sm font-medium shadow-lg border border-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Open filters"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters
      </button>
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-20 bg-black/50"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-0 z-30 flex flex-col items-end pointer-events-none">
            <div className="w-full max-w-[min(20rem,100%)] h-full flex flex-col pointer-events-auto bg-slate-900 border-l border-slate-700 shadow-2xl overflow-y-auto">
              <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-3 border-b border-slate-700">
                <span className="text-sm font-semibold text-white">Filters</span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Close filters"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 pb-4">
                {sidebarContent}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
