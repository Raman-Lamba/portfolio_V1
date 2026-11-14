import { describe, it, expect } from 'vitest';
import { parseHeadline, parseQuote } from './feeds';

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

describe('parseHeadline', () => {
  const xml = `<rss><channel><title>t</title><item><title>Fintech firm raises &amp; grows - Mint</title>
    <link>https://news.google.com/rss/articles/abc</link><source url="https://mint.com">Mint</source></item></channel></rss>`;
  it('takes the first item, strips the source suffix and decodes entities', () => {
    expect(parseHeadline(xml)).toEqual({
      title: 'Fintech firm raises & grows',
      source: 'Mint',
      url: 'https://news.google.com/rss/articles/abc',
    });
  });
  it('prefers the newest item by publish date', () => {
    const two = `<item><title>Old story - A</title><link>https://a.test/1</link><pubDate>Fri, 13 Nov 2026 01:00:00 GMT</pubDate></item>
      <item><title>New story - B</title><link>https://a.test/2</link><pubDate>Sat, 14 Nov 2026 05:00:00 GMT</pubDate></item>`;
    expect(parseHeadline(two)?.url).toBe('https://a.test/2');
  });
  it('returns null without an item or with a non-http link', () => {
    expect(parseHeadline('<rss></rss>')).toBeNull();
    expect(parseHeadline('<item><title>a</title><link>javascript:x</link></item>')).toBeNull();
  });
});
