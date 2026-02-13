/**
 * Modal overlay on top of the map showing a page (markdown content).
 * Backdrop dims the map; panel is scrollable with close button.
 */
import { PageContent } from './PageContent.jsx';

const PAGE_TITLES = {
  cities: 'Cities',
  methods: 'Methods',
  research: 'Research',
  stories: 'Stories',
  about: 'About',
  faq: 'FAQ',
  accessibility: 'Accessibility',
  help: 'Help',
};

export function ContentModal({ pageId, onClose }) {
  if (!pageId) return null;

  const title = PAGE_TITLES[pageId] ?? pageId;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-md"
        aria-hidden
        onClick={onClose}
      />
      <div
        className="content-modal-panel fixed inset-4 z-50 flex flex-col rounded-2xl overflow-hidden md:inset-6 lg:inset-8 lg:max-w-4xl xl:max-w-5xl lg:left-1/2 lg:-translate-x-1/2"
        role="dialog"
        aria-modal="true"
        aria-labelledby="content-modal-title"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 px-6 py-4 border-b border-slate-700/80 bg-slate-900/90">
          <h2 id="content-modal-title" className="text-lg font-semibold text-white tracking-tight truncate">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-full p-2 text-slate-400 hover:text-white hover:bg-slate-700/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:ring-offset-2 focus:ring-offset-slate-900"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="content-modal-body flex-1 overflow-y-auto px-6 py-8">
          <PageContent pageId={pageId} />
        </div>
      </div>
    </>
  );
}
