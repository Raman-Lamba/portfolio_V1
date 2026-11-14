'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const PREV_KEY = 'prev-path';

// Remembers the page the visitor came from inside the site, so "Front page" can step back to the
// exact spot (scroll position, open folder) instead of reloading the top of the front page.
export function NavTracker() {
  const pathname = usePathname();
  useEffect(() => {
    try {
      const last = sessionStorage.getItem('last-path');
      if (last && last !== pathname) sessionStorage.setItem(PREV_KEY, last);
      sessionStorage.setItem('last-path', pathname);
    } catch {
      // storage can be blocked; the link then simply goes to the front page
    }
  }, [pathname]);
  return null;
}
