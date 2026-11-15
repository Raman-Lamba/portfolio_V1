import { NextResponse, type NextRequest } from 'next/server';
import { getProjectSlugs } from '@/content/queries';

const slugs = new Set(getProjectSlugs());

// An unknown /work/<slug> streams a 200 shell before the page can call notFound(), which search
// engines read as a soft 404. Sending it to a path with no route gives the same page a real 404.
export function proxy(request: NextRequest) {
  const slug = request.nextUrl.pathname.split('/')[2];
  if (slugs.has(slug)) return NextResponse.next();
  return NextResponse.rewrite(new URL('/no-such-page', request.url));
}

export const config = { matcher: '/work/:slug' };
