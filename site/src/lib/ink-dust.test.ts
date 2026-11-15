import { describe, it, expect } from 'vitest';
import {
  exitProgress,
  gridFor,
  hashSeed,
  placeDot,
  sampleDots,
  sourceOpacity,
  dustOpacity,
  type Dot,
} from './ink-dust';

function pixels(cols: number, rows: number, fill: (i: number, j: number) => [number, number, number, number]) {
  const out = new Uint8ClampedArray(cols * rows * 4);
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) out.set(fill(i, j), (j * cols + i) * 4);
  return out;
}

describe('ink dust sampling', () => {
  it('spreads at most the requested number of cells over the box', () => {
    const { cols, rows } = gridFor(192, 274, 3200);
    expect(cols * rows).toBeLessThanOrEqual(3200);
    expect(cols * rows).toBeGreaterThan(2400);
    expect(gridFor(144, 206, 1600).cols * gridFor(144, 206, 1600).rows).toBeLessThanOrEqual(1600);
  });

  it('only keeps cells that hold ink, sized by darkness, and never more than the cap', () => {
    // left half black, right half paper, one transparent corner
    const dots = sampleDots(
      pixels(10, 10, (i, j) => (i === 9 && j === 0 ? [0, 0, 0, 0] : i < 5 ? [27, 22, 18, 255] : [239, 230, 208, 255])),
      10,
      10,
      1000,
    );
    expect(dots).toHaveLength(50);
    expect(dots.every((d) => d.x < 0.5)).toBe(true);
    expect(dots.every((d) => d.k > 0.85 && d.r > 0 && d.s >= 0 && d.s < 1)).toBe(true);

    const capped = sampleDots(pixels(10, 10, () => [0, 0, 0, 255]), 10, 10, 30);
    expect(capped).toHaveLength(30);
  });

  it('seeds are deterministic and spread across 0..1', () => {
    expect(hashSeed(7)).toBe(hashSeed(7));
    const seeds = Array.from({ length: 200 }, (_, i) => hashSeed(i));
    expect(Math.min(...seeds)).toBeLessThan(0.1);
    expect(Math.max(...seeds)).toBeGreaterThan(0.9);
  });
});

describe('scroll progress', () => {
  it('is 0 at the top of the page and 1 once the element has left the top edge', () => {
    expect(exitProgress(0, 300, 274)).toBe(0);
    expect(exitProgress(287, 300, 274)).toBeCloseTo(0.5);
    expect(exitProgress(574, 300, 274)).toBe(1);
    expect(exitProgress(2000, 300, 274)).toBe(1);
    expect(exitProgress(-10, 300, 274)).toBe(0);
  });

  it('crossfades the real element out as the dots come in, with nothing shown at rest', () => {
    expect(sourceOpacity(0)).toBe(1);
    expect(dustOpacity(0)).toBe(0);
    expect(sourceOpacity(0.2)).toBe(0);
    expect(dustOpacity(0.2)).toBe(1);
  });
});

describe('placing dots', () => {
  const left: Dot = { x: 0.1, y: 0.5, r: 0.01, k: 0.9, s: 0.5 };
  const right: Dot = { x: 0.95, y: 0.5, r: 0.01, k: 0.9, s: 0.5 };

  it('leaves every dot in place at rest', () => {
    const d = placeDot(left, 0, 200, 300)!;
    expect(d.x).toBeCloseTo(20);
    expect(d.y).toBeCloseTo(150);
    expect(d.r).toBeCloseTo(2);
    expect(d.a).toBeCloseTo(0.9);
  });

  it('drifts dots to the right and thins them as progress grows, right edge first', () => {
    const l = placeDot(left, 0.5, 200, 300)!;
    const r = placeDot(right, 0.5, 200, 300)!;
    expect(r.x - 190).toBeGreaterThan(l.x - 20);
    expect(r.a).toBeLessThan(l.a);
    const xs = [0, 0.3, 0.6, 0.9].map((p) => placeDot(right, p, 200, 300)?.x ?? Infinity);
    for (let i = 1; i < xs.length; i++) expect(xs[i]).toBeGreaterThanOrEqual(xs[i - 1]);
  });

  it('drops dots that have all but vanished', () => {
    expect(placeDot(right, 1, 200, 300)).toBeNull();
  });
});
