import { describe, it, expect } from 'vitest';
import { fanLayout } from './fan-layout';

describe('fanLayout', () => {
  it('returns nothing for no items', () => {
    expect(fanLayout(0)).toEqual([]);
  });
  it('keeps a single item level and flat', () => {
    expect(fanLayout(1)).toEqual([{ rotate: 0, lift: 0 }]);
  });
  it('fans three items symmetrically', () => {
    expect(fanLayout(3)).toEqual([
      { rotate: -3, lift: 10 },
      { rotate: 0, lift: 0 },
      { rotate: 3, lift: 10 },
    ]);
  });
  it('fans an even count around the middle', () => {
    expect(fanLayout(4).map((f) => f.rotate)).toEqual([-4.5, -1.5, 1.5, 4.5]);
  });
  it('clamps the tilt at 8 degrees', () => {
    const rotations = fanLayout(7).map((f) => f.rotate);
    expect(rotations[0]).toBe(-8);
    expect(rotations[6]).toBe(8);
    expect(Math.max(...rotations.map(Math.abs))).toBeLessThanOrEqual(8);
  });
});
