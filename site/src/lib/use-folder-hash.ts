'use client';
import { useCallback, useRef, useSyncExternalStore } from 'react';

const PREFIX = '#file-';
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener('popstate', cb);
  window.addEventListener('hashchange', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('popstate', cb);
    window.removeEventListener('hashchange', cb);
  };
}

const getSnapshot = () => window.location.hash;
const getServerSnapshot = () => '';

// Which case file is open, kept in the URL hash so Back closes it and links can deep-link to it.
export function useFolderHash(ids: readonly string[]) {
  const hash = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const candidate = hash.startsWith(PREFIX) ? hash.slice(PREFIX.length) : null;
  const openId = candidate !== null && ids.includes(candidate) ? candidate : null;
  const pushed = useRef(false);

  const open = useCallback((id: string) => {
    window.history.pushState(null, '', `${PREFIX}${id}`);
    pushed.current = true;
    emit();
  }, []);

  const close = useCallback(() => {
    if (pushed.current) {
      pushed.current = false;
      window.history.back();
      return;
    }
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
    emit();
  }, []);

  return { openId, open, close };
}
