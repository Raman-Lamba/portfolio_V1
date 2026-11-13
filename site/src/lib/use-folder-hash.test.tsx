import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFolderHash } from './use-folder-hash';

const ids = ['finance', 'ml-ai', 'web', 'marketing'];

describe('useFolderHash', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('is closed when there is no hash', () => {
    const { result } = renderHook(() => useFolderHash(ids));
    expect(result.current.openId).toBeNull();
  });

  it('opens from a deep link and ignores unknown ids', () => {
    window.history.replaceState(null, '', '/#file-web');
    const a = renderHook(() => useFolderHash(ids));
    expect(a.result.current.openId).toBe('web');
    window.history.replaceState(null, '', '/#file-nope');
    const b = renderHook(() => useFolderHash(ids));
    expect(b.result.current.openId).toBeNull();
  });

  it('open() pushes the hash and close() goes back', async () => {
    const { result } = renderHook(() => useFolderHash(ids));
    act(() => result.current.open('finance'));
    expect(window.location.hash).toBe('#file-finance');
    expect(result.current.openId).toBe('finance');
    act(() => result.current.close());
    await waitFor(() => expect(result.current.openId).toBeNull());
    expect(window.location.hash).toBe('');
  });

  it('close() clears a deep-linked hash without going back', () => {
    window.history.replaceState(null, '', '/#file-ml-ai');
    const { result } = renderHook(() => useFolderHash(ids));
    expect(result.current.openId).toBe('ml-ai');
    act(() => result.current.close());
    expect(result.current.openId).toBeNull();
    expect(window.location.hash).toBe('');
  });
});
