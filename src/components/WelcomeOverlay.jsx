/**
 * Welcome modal: intro text and "Select a city" CTA.
 * Shown on every load until dismissed; no persistence.
 */
const LOGO_SRC = `${import.meta.env.BASE_URL}images/atlas-of-inequality@2x.png`;

export function WelcomeOverlay({ onSelectCity }) {
  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/60"
        aria-hidden
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
      >
        <div
          className="w-full max-w-md max-h-[85dvh] sm:max-h-[90vh] flex flex-col bg-[#3b3096] text-white shadow-2xl rounded-xl overflow-y-auto"
        >
          <div className="p-5 sm:p-8 pb-6">
            <div className="mb-6 sm:mb-8">
              <img
                src={LOGO_SRC}
                alt="Atlas of Inequality"
                className="h-10 w-auto object-contain"
              />
            </div>

            <h1 id="welcome-title" className="sr-only">
              Welcome to the Atlas of Inequality
            </h1>

            <p className="text-white/95 text-[14px] sm:text-[15px] leading-relaxed mb-4 sm:mb-5">
            We usually measure inequality by neighborhood. But cities are not only where people live. They are also where people go.
            </p>

            <p className="text-white/95 text-[14px] sm:text-[15px] leading-relaxed mb-4 sm:mb-5">
            Restaurants, stores, parks, offices, and other destinations reflect economic divides. Some places bring together people from different income backgrounds. Others are visited mostly by people from similar backgrounds.
            </p>

            <p className="text-white/95 text-[14px] sm:text-[15px] leading-relaxed mb-4 sm:mb-5">
            The Atlas of Inequality measures how economically mixed the visitors to each place are. Using aggregated and anonymized location data, we estimate the income distribution of people who visit millions of places across cities in the United States.            </p>

            <p className="text-white/95 text-[14px] sm:text-[15px] leading-relaxed mb-4 sm:mb-5">
            By shifting the focus from neighborhoods to everyday destinations, the Atlas reveals a new geography of inequality shaped by where people spend their time.
            </p>

            <p className="text-white/95 text-[14px] sm:text-[15px] leading-relaxed mb-6 sm:mb-8">
            Inequality is not only about where people live. It is also about the places they share and the ones they do not.
            </p>

            <button
              type="button"
              onClick={onSelectCity}
              className="w-full py-3.5 px-5 rounded-lg bg-[#f5d547] text-slate-900 font-semibold text-base flex items-center justify-center gap-2 hover:bg-[#f0ce3d] focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#3b3096] transition-colors"
            >
              <span>Select a city</span>
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
