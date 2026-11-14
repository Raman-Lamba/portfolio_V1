export type Quote = { label: string; price: number; changePct: number };
export type Headline = { title: string; source: string; url: string };

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

// Pure: the newest usable <item> of a Google News RSS feed. Google appends " - Source" to titles.
export function parseHeadline(xml: string): Headline | null {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => m[1]);
  const stamp = (it: string) => Date.parse(/<pubDate>([^<]*)<\/pubDate>/.exec(it)?.[1] ?? '') || 0;
  const item = items.sort((a, b) => stamp(b) - stamp(a))[0];
  if (!item) return null;
  const pick = (tag: string) =>
    new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?</${tag}>`).exec(item)?.[1]?.trim();
  const url = pick('link');
  const raw = pick('title');
  if (!url || !raw || !/^https?:\/\//.test(url)) return null;
  const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const source = decode(pick('source') ?? '');
  const title = decode(raw);
  const suffix = source ? ` - ${source}` : '';
  return { title: suffix && title.endsWith(suffix) ? title.slice(0, -suffix.length) : title, source, url };
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
  const res = await get('https://news.google.com/rss/search?q=stock+market+Sensex+Nifty+when:1d&hl=en-IN&gl=IN&ceid=IN:en');
  return res ? parseHeadline(await res.text()) : null;
}
