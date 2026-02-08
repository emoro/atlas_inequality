import { scoreToRgb } from '../utils/scoreColor.js';

/**
 * Tooltip shown when hovering a scatter point.
 * Atlas of Inequality style: category, name, place inequality %, and Time Spent by Income (p1a–p4a) green bars.
 * Left border color matches the point color (inequality score).
 */
export function PointTooltip({ x, y, point }) {
  if (!point) return null;

  const [r, g, b] = scoreToRgb(point.score);
  const borderColor = `rgb(${r}, ${g}, ${b})`;
  const scorePct = (point.score * 100).toFixed(1);
  const hasIncome = [point.p1a, point.p2a, point.p3a, point.p4a].some(
    (v) => typeof v === 'number' && !Number.isNaN(v)
  );
  const values = [
    { label: '$', value: point.p1a },
    { label: '$$', value: point.p2a },
    { label: '$$$', value: point.p3a },
    { label: '$$$$', value: point.p4a },
  ];
  const maxVal = hasIncome
    ? Math.max(
        ...[point.p1a, point.p2a, point.p3a, point.p4a].filter(
          (v) => typeof v === 'number' && !Number.isNaN(v)
        )
      )
    : 0;
  const barScale = maxVal > 0 ? 1 / maxVal : 0;

  return (
    <div
      className="pointer-events-none absolute z-30 w-[220px] rounded-lg bg-slate-950 shadow-xl border border-slate-700 text-left border-l-4"
      style={{
        left: x,
        top: y,
        transform: 'translate(12px, -50%)',
        borderLeftColor: borderColor,
      }}
    >
      <div className="px-3 py-2.5">
        <div className="mb-1.5">
          <div className="text-[11px] text-slate-400">Category</div>
          <div className="text-sm font-semibold text-white truncate">
            {point.category || '—'}
          </div>
        </div>
        {point.name != null && point.name !== '' && (
          <div className="mb-1.5">
            <div className="text-[11px] text-slate-400">Name</div>
            <div className="text-sm font-semibold text-white truncate">
              {point.name}
            </div>
          </div>
        )}
        <div className="flex items-end gap-3 mt-2">
          <div>
            <div className="text-2xl font-bold text-white leading-none">
              {scorePct}%
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Place Inequality
            </div>
          </div>
          {hasIncome && (
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-slate-400 mb-1">
                Time Spent by Income
              </div>
              {/* Histogram: fixed-height row, bars aligned on same baseline */}
              <div
                className="flex items-end gap-1.5"
                style={{ height: 28 }}
              >
                {values.map(({ label, value }) => {
                  const p =
                    typeof value === 'number' && !Number.isNaN(value)
                      ? value
                      : 0;
                  const heightPx = Math.max(
                    2,
                    Math.min(28, Math.round(p * barScale * 28))
                  );
                  return (
                    <div
                      key={label}
                      className="flex flex-col items-center flex-1 min-w-0 h-full"
                    >
                      <div
                        className="w-full max-w-[20px] bg-emerald-500 rounded-t-sm flex-shrink-0 mt-auto"
                        style={{ height: heightPx }}
                        title={`${label}: ${(p * 100).toFixed(0)}%`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-1.5 mt-1">
                {values.map(({ label }) => (
                  <span
                    key={label}
                    className="flex-1 text-[10px] text-slate-400 text-center min-w-0 truncate"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
