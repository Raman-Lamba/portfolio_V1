import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from './proxy';

const run = (path: string) => proxy(new NextRequest(`http://localhost${path}`));

describe('proxy', () => {
  it('lets a known project through', () => {
    expect(run('/work/gold-price-forecasting').headers.get('x-middleware-next')).toBe('1');
  });
  it('rewrites an unknown project to a path with no route', () => {
    expect(run('/work/nope').headers.get('x-middleware-rewrite')).toBe('http://localhost/no-such-page');
  });
});
