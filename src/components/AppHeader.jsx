/**
 * Top menu with Atlas of Inequality logo and "Select another city" when a city is selected.
 */
const LOGO_SRC = `${import.meta.env.BASE_URL}images/atlas-of-inequality@2x.png`;

export function AppHeader({ selectedCity, onSelectAnotherCity }) {
  return (
    <header className="flex shrink-0 items-center justify-between px-4 py-3 bg-slate-900">
      <div className="flex items-center gap-3">
        <img
          src={LOGO_SRC}
          alt="Atlas of Inequality"
          className="h-8 w-auto object-contain"
        />
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
