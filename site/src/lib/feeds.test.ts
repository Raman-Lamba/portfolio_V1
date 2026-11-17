import { describe, it, expect } from 'vitest';
import { isOpen, newest, parseItems, parseQuote, summarise, type Quote } from './feeds';

const chart = (meta: object, close?: (number | null)[]) => ({
  chart: { result: [{ meta, indicators: { quote: [{ close }] } }] },
});

describe('parseQuote', () => {
  it('uses the daily change Yahoo reports', () => {
    const q = parseQuote('Nifty 50', chart({ regularMarketPrice: 110, regularMarketChangePercent: -0.61 }));
    expect(q).toMatchObject({ label: 'Nifty 50', price: 110, changePct: -0.61 });
  });
  it('falls back to the last two daily closes, ignoring gaps', () => {
    const q = parseQuote('x', chart({ regularMarketPrice: 110 }, [90, 100, null, 110]));
    expect(q?.changePct).toBeCloseTo(10);
  });
  it('knows whether the session is open', () => {
    const meta = { regularMarketPrice: 1, regularMarketChangePercent: 0, currentTradingPeriod: { regular: { start: 100, end: 200 } } };
    expect(parseQuote('x', chart(meta), 150_000)?.open).toBe(true);
    expect(parseQuote('x', chart(meta), 250_000)?.open).toBe(false);
  });
  it('keeps the session window so a cached quote can be re-checked later', () => {
    const meta = { regularMarketPrice: 1, regularMarketChangePercent: 0, currentTradingPeriod: { regular: { start: 100, end: 200 } } };
    const stale = parseQuote('x', chart(meta), 50_000)!; // fetched before the open
    expect(stale.open).toBe(false);
    expect(isOpen(stale, 150_000)).toBe(true);
    expect(isOpen(stale, 250_000)).toBe(false);
  });
  it('returns null for missing or broken data', () => {
    expect(parseQuote('x', null)).toBeNull();
    expect(parseQuote('x', chart({}))).toBeNull();
    expect(parseQuote('x', chart({ regularMarketPrice: 5 }, [5]))).toBeNull();
  });
});

describe('summarise', () => {
  const row = (label: string, changePct: number, open = false): Quote => ({ label, price: 1, changePct, open });
  it('says higher, lower or flat from the lead index', () => {
    expect(summarise('India', [row('Nifty 50', 0.8)])).toBe('Indian equities ended higher: Nifty 50 +0.80%.');
    expect(summarise('US', [row('S&P 500', -1.2, true)])).toBe('US equities are trading lower: S&P 500 -1.20%.');
    expect(summarise('US', [row('S&P 500', 0.05)])).toBe('US equities ended flat: S&P 500 +0.05%.');
  });
  it('mentions volatility only when the VIX moves 5% or more', () => {
    const base = [row('Nifty 50', 0.4), row('Sensex', 0.4), row('Bank Nifty', 0.4)];
    expect(summarise('India', [...base, row('India VIX', -11.3)])).toContain('volatility easing (India VIX -11.3%)');
    expect(summarise('India', [...base, row('India VIX', 2)])).not.toContain('volatility');
  });
  it('is empty without data', () => {
    expect(summarise('India', [])).toBe('');
  });
});

describe('parseItems and newest', () => {
  const xml = `<rss><channel>
    <item><title><![CDATA[Old story]]></title><description><![CDATA[Old summary]]></description><link>https://a.test/1</link><pubDate>Mon, 09 Nov 2026 01:00:00 +0530</pubDate></item>
    <item><title><![CDATA[Nifty &amp; Sensex rise]]></title><description><![CDATA[<p>Benchmarks <b>gained</b> on FII buying.</p>]]></description><link><![CDATA[https://a.test/2]]></link><pubDate><![CDATA[Sat, 14 Nov 2026 05:00:00 +0530]]></pubDate></item>
    <item><title>Bad link</title><link>javascript:x</link></item></channel></rss>`;
  const now = Date.parse('Sat, 14 Nov 2026 12:00:00 +0530');

  it('reads CDATA, strips markup and skips non-http links', () => {
    const items = parseItems(xml, 'Mint');
    expect(items).toHaveLength(2);
    expect(items[1]).toMatchObject({
      title: 'Nifty & Sensex rise',
      summary: 'Benchmarks gained on FII buying.',
      source: 'Mint',
      url: 'https://a.test/2',
    });
  });
  it('picks the newest item and ignores stale ones', () => {
    expect(newest(parseItems(xml, 'Mint'), now)?.url).toBe('https://a.test/2');
    expect(newest(parseItems(xml, 'Mint').slice(0, 1), now)).toBeNull();
    expect(newest([], now)).toBeNull();
  });
  it('clips long summaries on a word boundary', () => {
    const long = `<item><title>t</title><link>https://a.test/3</link><description>${'word '.repeat(80)}</description></item>`;
    const [item] = parseItems(long, 'x');
    expect(item.summary.length).toBeLessThanOrEqual(221);
    expect(item.summary.endsWith('…')).toBe(true);
  });
});
