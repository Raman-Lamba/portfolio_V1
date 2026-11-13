'use client';
import { useEffect, useState } from 'react';
import { formatDateline } from '@/lib/dateline';

// Set after mount so the statically built page never freezes the date.
export function Dateline({ now, className }: { now?: Date; className?: string }) {
  const [text, setText] = useState('');
  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: date is set after mount
  useEffect(() => setText(formatDateline(now ?? new Date())), [now]);
  return (
    <time className={className} suppressHydrationWarning>
      {text}
    </time>
  );
}
