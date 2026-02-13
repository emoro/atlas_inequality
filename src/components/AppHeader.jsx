/**
 * Top bar: Atlas of Inequality logo, nav menu (Map, Cities, Methods, …), and optional actions.
 * Clicking a nav item opens that page in a modal over the map; "Map" closes the modal.
 */
const LOGO_SRC = `${import.meta.env.BASE_URL}images/atlas-of-inequality@2x.png`;

const NAV_ITEMS = [
  { id: null, label: 'Map' },
  { id: 'cities', label: 'Cities' },
  { id: 'methods', label: 'Methods' },
  { id: 'research', label: 'Research' },
  { id: 'stories', label: 'Stories' },
  { id: 'about', label: 'About' },
  { id: 'faq', label: 'FAQ' },
  { id: 'accessibility', label: 'Accessibility', href: 'https://accessibility.mit.edu' },
];

export function AppHeader({
  selectedCity,
  onSelectAnotherCity,
  modalPage,
  onSelectPage,
}) {
  return (
    <header className="flex shrink-0 items-center justify-between gap-4 px-4 py-3 bg-slate-900 border-b border-slate-800">
      <div className="flex items-center min-w-0">
        <img
          src={LOGO_SRC}
          alt="Atlas of Inequality"
          className="h-8 w-auto object-contain shrink-0"
        />
        <nav className="ml-8 flex items-center gap-1 overflow-x-auto scrollbar-none" aria-label="Main">
          {NAV_ITEMS.map(({ id, label, href }) => {
            const isActive = !href && (id === null ? !modalPage : modalPage === id);
            const isCities = id === 'cities';
            const linkClass = `
              shrink-0 px-2 py-1.5 text-sm font-medium transition-colors whitespace-nowrap
              border-b-2 -mb-px
              ${isActive
                ? 'text-orange-400 border-orange-400'
                : 'text-white border-transparent hover:text-slate-200'
              }
            `;
            if (href) {
              return (
                <a
                  key={id ?? 'map'}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  {label}
                </a>
              );
            }
            return (
              <button
                key={id ?? 'map'}
                type="button"
                onClick={() => {
                  if (isCities) {
                    onSelectAnotherCity?.();
                  } else {
                    onSelectPage?.(id);
                  }
                }}
                className={linkClass}
              >
                {label}
              </button>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => onSelectPage?.('help')}
          className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Help"
          title="Help"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
