import { describe, it, expect } from 'vitest';
import { newest, parseItems, parseQuote } from './feeds';

const chart = (meta: object) => ({ chart: { result: [{ meta }] } });

describe('parseQuote', () => {
  it('computes the change against the previous close', () => {
    const q = parseQuote('Nifty 50', chart({ regularMarketPrice: 110, chartPreviousClose: 100 }));
    expect(q).toEqual({ label: 'Nifty 50', price: 110, changePct: 10 });
  });
  it('returns null for missing or broken data', () => {
    expect(parseQuote('x', null)).toBeNull();
    expect(parseQuote('x', chart({ regularMarketPrice: 5 }))).toBeNull();
    expect(parseQuote('x', chart({ regularMarketPrice: 5, chartPreviousClose: 0 }))).toBeNull();
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
