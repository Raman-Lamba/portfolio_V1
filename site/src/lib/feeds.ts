// `open` is only true at fetch time; cached copies outlive it, so `session` (ms) carries the
// window itself and the page re-checks it against the viewer's clock.
export type Quote = {
  label: string;
  price: number;
  changePct: number;
  time?: number;
  open?: boolean;
  session?: { start: number; end: number };
};

export const isOpen = (q: Quote, now = Date.now()) =>
  q.session ? now >= q.session.start && now <= q.session.end : q.open === true;
export type Headline = { title: string; summary: string; source: string; url: string };
export type Region = 'India' | 'US';
export type MarketReport = Record<Region, Quote[]>;

const symbols = [
  { label: 'Nifty 50', symbol: '^NSEI' },
  { label: 'Gold (USD/oz)', symbol: 'GC=F' },
  { label: 'USD/INR', symbol: 'INR=X' },
] as const;

const regions: Record<Region, { label: string; symbol: string }[]> = {
  India: [
    { label: 'Nifty 50', symbol: '^NSEI' },
    { label: 'Sensex', symbol: '^BSESN' },
    { label: 'Bank Nifty', symbol: '^NSEBANK' },
    { label: 'India VIX', symbol: '^INDIAVIX' },
  ],
  US: [
    { label: 'S&P 500', symbol: '^GSPC' },
    { label: 'Dow Jones', symbol: '^DJI' },
    { label: 'Nasdaq', symbol: '^IXIC' },
    { label: 'VIX', symbol: '^VIX' },
  ],
};

type Meta = {
  regularMarketPrice?: number;
  regularMarketChangePercent?: number;
  regularMarketTime?: number;
  currentTradingPeriod?: { regular?: { start?: number; end?: number } };
};
type Chart = {
  chart?: { result?: { meta?: Meta; indicators?: { quote?: { close?: (number | null)[] }[] } }[] };
};

// Pure: turns one Yahoo chart payload into a quote, or null when the numbers are missing.
// The day's change comes from Yahoo's own daily figure, else from the last two daily closes
// (never from `chartPreviousClose`, which is the close before the whole 5-day range).
export function parseQuote(label: string, json: unknown, now = Date.now()): Quote | null {
  const result = (json as Chart)?.chart?.result?.[0];
  const meta = result?.meta;
  const price = meta?.regularMarketPrice;
  if (typeof price !== 'number') return null;
  let changePct = meta?.regularMarketChangePercent;
  if (typeof changePct !== 'number') {
    const closes = (result?.indicators?.quote?.[0]?.close ?? []).filter((c): c is number => typeof c === 'number');
    const prev = closes[closes.length - 2];
    if (!prev) return null;
    changePct = ((price - prev) / prev) * 100;
  }
  const period = meta?.currentTradingPeriod?.regular;
  const time = meta?.regularMarketTime ? meta.regularMarketTime * 1000 : undefined;
  const session = period?.start && period?.end ? { start: period.start * 1000, end: period.end * 1000 } : undefined;
  const open = session ? now >= session.start && now <= session.end : undefined;
  return { label, price, changePct, time, open, ...(session && { session }) };
}

// Pure: one plain sentence from the numbers (fixed rules, no generated text).
export function summarise(region: Region, rows: Quote[], open = rows[0]?.open === true): string {
  const [lead, , , vix] = rows;
  if (!lead) return '';
  const flat = Math.abs(lead.changePct) < 0.15;
  const dir = lead.changePct > 0 ? 'higher' : 'lower';
  const name = region === 'India' ? 'Indian equities' : 'US equities';
  const move = `${lead.label} ${lead.changePct >= 0 ? '+' : '-'}${Math.abs(lead.changePct).toFixed(2)}%`;
  const verb = flat ? (open ? 'are flat' : 'ended flat') : open ? `are trading ${dir}` : `ended ${dir}`;
  const vol =
    vix && Math.abs(vix.changePct) >= 5 ? `; volatility ${vix.changePct > 0 ? 'rising' : 'easing'} (${vix.label} ${vix.changePct > 0 ? '+' : '-'}${Math.abs(vix.changePct).toFixed(1)}%)` : '';
  return `${name} ${verb}: ${move}${vol}.`;
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

async function quotesFor(defs: readonly { label: string; symbol: string }[]): Promise<Quote[]> {
  const all = await Promise.all(
    defs.map(async ({ label, symbol }) => {
      const res = await get(
        `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`,
      );
      return res ? parseQuote(label, await res.json().catch(() => null)) : null;
    }),
  );
  return all.filter((q): q is Quote => q !== null);
}

export const fetchQuotes = () => quotesFor(symbols);

export async function fetchMarketReport(): Promise<MarketReport> {
  const [India, US] = await Promise.all([quotesFor(regions.India), quotesFor(regions.US)]);
  return { India, US };
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
