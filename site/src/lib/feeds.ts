export type Quote = { label: string; price: number; changePct: number };
export type Headline = { title: string; summary: string; source: string; url: string };

const symbols = [
  { label: 'Nifty 50', symbol: '^NSEI' },
  { label: 'Gold (USD/oz)', symbol: 'GC=F' },
  { label: 'USD/INR', symbol: 'INR=X' },
] as const;

type Meta = { regularMarketPrice?: number; chartPreviousClose?: number; previousClose?: number };

// Pure: turns one Yahoo chart payload into a quote, or null when the numbers are missing.
export function parseQuote(label: string, json: unknown): Quote | null {
  const meta = (json as { chart?: { result?: { meta?: Meta }[] } })?.chart?.result?.[0]?.meta;
  const price = meta?.regularMarketPrice;
  const prev = meta?.chartPreviousClose ?? meta?.previousClose;
  if (typeof price !== 'number' || typeof prev !== 'number' || prev === 0) return null;
  return { label, price, changePct: ((price - prev) / prev) * 100 };
}

const feedSources = [
  { source: 'The Economic Times', url: 'https://economictimes.indiatimes.com/markets/stocks/rssfeeds/2146842.cms' },
  { source: 'Mint', url: 'https://www.livemint.com/rss/markets' },
  { source: 'Business Standard', url: 'https://www.business-standard.com/rss/markets-106.rss' },
];

const unwrap = (s: string) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const clip = (s: string, max: number) => (s.length <= max ? s : `${s.slice(0, max).replace(/\s+\S*$/, '')}…`);

// Pure: every usable <item> of a publisher RSS feed, with its publish time (ms).
export function parseItems(xml: string, source: string): (Headline & { time: number })[] {
  const out: (Headline & { time: number })[] = [];
  for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const pick = (tag: string) => new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`).exec(m[1])?.[1];
    const url = unwrap(pick('link') ?? '');
    const title = unwrap(pick('title') ?? '');
    if (!title || !/^https?:\/\//.test(url)) continue;
    out.push({
      title,
      summary: clip(unwrap(pick('description') ?? ''), 220),
      source,
      url,
      time: Date.parse(unwrap(pick('pubDate') ?? '')) || 0,
    });
  }
  return out;
}

// Pure: the newest item that is at most `maxAgeMs` old (so the wire is never an old story).
export function newest(items: (Headline & { time: number })[], now: number, maxAgeMs = 36 * 3600_000): Headline | null {
  const recent = items.filter((i) => i.time > 0 && now - i.time <= maxAgeMs);
  // Prefer whole-market stories over single-stock tips; fall back to anything recent.
  const broad = recent.filter((i) => /sensex|nifty|wall street|dow|nasdaq|s&p|fii|rupee|rbi|fed|markets?/i.test(i.title));
  const fresh = (broad.length ? broad : recent).sort((x, y) => y.time - x.time)[0];
  if (!fresh) return null;
  const { time, ...headline } = fresh;
  void time;
  return headline;
}

async function get(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(8000) });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

export async function fetchQuotes(): Promise<Quote[]> {
  const all = await Promise.all(
    symbols.map(async ({ label, symbol }) => {
      const res = await get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`,
      );
      return res ? parseQuote(label, await res.json().catch(() => null)) : null;
    }),
  );
  return all.filter((q): q is Quote => q !== null);
}

export async function fetchHeadline(): Promise<Headline | null> {
  const lists = await Promise.all(
    feedSources.map(async ({ source, url }) => {
      const res = await get(url);
      return res ? parseItems(await res.text(), source) : [];
    }),
  );
  return newest(lists.flat(), Date.now());
}
