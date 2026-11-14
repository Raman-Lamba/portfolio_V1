'use client';
import Link from 'next/link';
import { PREV_KEY } from './nav-tracker';

// "Front page": if the visitor came from the front page, go back in history so the page, scroll position
// and any open case file come back as they left them. Otherwise (a direct visit) go to the front page.
export function BackLink({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <Link
      href="/"
      className={className}
      onClick={(e) => {
        let cameFromFront = false;
        try {
          cameFromFront = sessionStorage.getItem(PREV_KEY) === '/' && window.history.length > 1;
        } catch {
          // fall through to a normal link
        }
        if (cameFromFront) {
          e.preventDefault();
          window.history.back(); // Next.js handles the popstate and restores the scroll position
        }
      }}
    >
      {children}
    </Link>
  );
}
