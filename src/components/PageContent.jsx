import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const CONTENT_BASE = `${import.meta.env.BASE_URL}content`.replace(/\/+/g, '/');

/**
 * Fetches and renders markdown for a page. Looks for public/content/{pageId}.md.
 */
export function PageContent({ pageId }) {
  const [markdown, setMarkdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const url = `${CONTENT_BASE}/${pageId}.md`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Could not load ${pageId}.md`);
        return r.text();
      })
      .then((text) => {
        setMarkdown(text);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
        setMarkdown(null);
      })
      .finally(() => setLoading(false));
  }, [pageId]);

  if (loading) {
    return (
      <div className="text-slate-400 text-sm">Loading…</div>
    );
  }

  if (error || !markdown) {
    return (
      <div className="text-slate-400 text-sm">
        {error || 'No content found.'} Add <code className="text-slate-300">public/content/{pageId}.md</code> to provide content for this page.
      </div>
    );
  }

  return (
    <article className={pageId === 'about' ? 'max-w-none content-about' : 'max-w-none'}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw]}
        components={{
          h1: () => null,
          h2: ({ children }) => <h2 className="content-heading text-xl font-semibold text-slate-100 mt-10 mb-4 pb-2 border-b border-slate-700/60">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-medium text-slate-200 mt-8 mb-2">{children}</h3>,
          p: ({ children }) => <p className="text-slate-400 text-[15px] leading-[1.65] mb-5">{children}</p>,
          ul: ({ children }) => (
            <ul className={pageId === 'about' ? 'content-about-profile-grid' : 'list-disc list-outside text-slate-400 text-[15px] mb-5 space-y-4 pl-6'}>
              {children}
            </ul>
          ),
          ol: ({ children }) => <ol className="list-decimal list-outside text-slate-400 text-[15px] mb-5 space-y-4 pl-6">{children}</ol>,
          li: ({ children }) => <li className="pl-1">{children}</li>,
          strong: ({ children }) => <strong className="text-slate-200 font-semibold">{children}</strong>,
          em: ({ children }) => <em className="text-slate-300">{children}</em>,
          a: ({ href, children }) => (
            <a href={href} className="text-amber-400/95 hover:text-amber-300 underline underline-offset-2 transition-colors duration-150" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          code: ({ children }) => <code className="text-slate-200 bg-slate-800/80 px-1.5 py-0.5 rounded text-[13px] border border-slate-700/50">{children}</code>,
          hr: () => <hr className="border-slate-700/60 my-8" />,
          img: ({ src, alt }) => {
            const url = src?.startsWith('http') || src?.startsWith('/') ? src : `${CONTENT_BASE}/${src}`.replace(/\/+/g, '/');
            return <img src={url} alt={alt ?? ''} className="max-w-full h-auto rounded-lg my-4 shadow-lg shadow-black/20 ring-1 ring-slate-700/50" />;
          },
          iframe: ({ src, title, ...props }) => (
            <div className="relative w-full my-4 rounded overflow-hidden" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={src}
                title={title ?? 'Video'}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                {...props}
              />
            </div>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
