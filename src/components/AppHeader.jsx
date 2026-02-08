/**
 * Top menu with Atlas of Inequality logo and "Select another city" when a city is selected.
 */
export function AppHeader({ selectedCity, onSelectAnotherCity }) {
  return (
    <header className="flex shrink-0 items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/10">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold tracking-tight text-white">
          Atlas of Inequality
        </span>
      </div>
      {selectedCity && (
        <button
          type="button"
          onClick={onSelectAnotherCity}
          className="text-sm font-medium text-indigo-300 hover:text-white transition-colors underline underline-offset-2"
        >
          Select another city
        </button>
      )}
    </header>
  );
}
