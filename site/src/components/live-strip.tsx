import { cacheLife } from 'next/cache';
import { fetchHeadline, fetchQuotes, type Headline, type Quote } from '@/lib/feeds';

export function MarketsStrip({ quotes }: { quotes: Quote[] }) {
  if (quotes.length === 0) return null;
  return (
    <section aria-label="Markets" className="border-y border-ink py-1">
      <ul className="flex flex-wrap items-baseline gap-x-6 gap-y-1 font-mono text-sm">
        {quotes.map((q) => (
          <li key={q.label}>
            <span className="font-label uppercase tracking-widest">{q.label}</span>{' '}
            {q.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}{' '}
            <span className={q.changePct < 0 ? 'text-accent' : undefined}>
              <span aria-hidden="true">{q.changePct < 0 ? '▼' : '▲'}</span>
              <span className="sr-only">{q.changePct < 0 ? 'down' : 'up'}</span> {Math.abs(q.changePct).toFixed(2)}%
            </span>
          </li>
        ))}
        <li className="ml-auto font-label text-xs uppercase tracking-widest">Delayed, not advice</li>
      </ul>
    </section>
  );
}

export function Wire({ headline }: { headline: Headline | null }) {
  if (!headline) return null;
  return (
    <aside aria-label="The wire" className="border border-ink px-3 py-2">
      <p className="font-label text-xs font-semibold uppercase tracking-[0.3em] text-accent">The wire</p>
      <a
        href={headline.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-display text-lg font-bold leading-tight hover:underline"
      >
        {headline.title}
      </a>
      {headline.source && <p className="font-label text-xs uppercase tracking-widest">{headline.source}</p>}
    </aside>
  );
}

export async function LiveMarkets() {
  'use cache';
  cacheLife('hours');
  return (
    <div className="mt-4">
      <MarketsStrip quotes={await fetchQuotes()} />
    </div>
  );
}

export async function LiveWire() {
  'use cache';
  cacheLife('hours');
  return <Wire headline={await fetchHeadline()} />;
}
