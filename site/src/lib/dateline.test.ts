import { describe, it, expect } from 'vitest';
import { formatDateline } from './dateline';

describe('formatDateline', () => {
  it('formats in newspaper style', () => {
    expect(formatDateline(new Date('2026-11-13T06:00:00Z'))).toBe('Friday, 13 November 2026');
  });
  it('uses the Hyderabad (IST) date, not UTC', () => {
    // 20:00 UTC on 13 Nov is 01:30 IST on 14 Nov
    expect(formatDateline(new Date('2026-11-13T20:00:00Z'))).toBe('Saturday, 14 November 2026');
  });
});
