'use client';
import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import type { Clipping } from '@/content/queries';
import { fanLayout } from '@/lib/fan-layout';
import { SmartLink } from './smart-link';

type Props = { label: string; clippings: Clipping[]; onClose: () => void };

export function CaseFileDialog({ label, clippings, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const reduce = useReducedMotion();
  const [closing, setClosing] = useState(false);
  const fan = fanLayout(clippings.length);

  useEffect(() => {
    const dialog = ref.current;
    const opener = document.activeElement as HTMLElement | null;
    dialog?.showModal();
    dialog?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
      dialog?.close();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    if (!closing) return;
    const t = window.setTimeout(onClose, reduce ? 0 : 150);
    return () => window.clearTimeout(t);
  }, [closing, onClose, reduce]);

  const requestClose = () => setClosing(true);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      tabIndex={-1}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
      className={`paper-grain fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-y-auto border-0 bg-paper/90 p-0 outline-none backdrop:backdrop-blur-sm text-ink transition-opacity duration-150 ${closing ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-10">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-b-2 border-ink pb-1">
          <h2 id={titleId} className="font-label text-sm font-semibold uppercase tracking-[0.3em]">
            Case file: {label}
          </h2>
          <p className="font-mono text-xs uppercase tracking-widest">
            {clippings.length} {clippings.length === 1 ? 'clipping' : 'clippings'} · Esc to close
          </p>
        </div>
        <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {clippings.map((c, i) => (
            <motion.li
              key={c.slug}
              initial={reduce ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1], delay: i * 0.05 }}
              style={{ '--r': `${fan[i].rotate}deg`, '--lift': `${fan[i].lift}px` } as React.CSSProperties}
              className="clipping group relative self-start border-2 border-ink bg-paper p-3 shadow-[0_10px_24px_rgba(27,22,18,0.16)] transition-transform duration-150 hover:-translate-y-1 focus-within:-translate-y-1 motion-reduce:transition-none md:mt-(--lift) md:rotate-(--r) md:hover:rotate-0 md:focus-within:rotate-0"
            >
              <span aria-hidden="true" className="tape absolute -top-2.5 left-1/2 h-5 w-20 -translate-x-1/2 -rotate-2" />
              {c.figure && (
                <Image
                  src={c.figure.src}
                  alt={c.figure.alt}
                  width={c.figure.width}
                  height={c.figure.height}
                  sizes="(min-width: 1024px) 24rem, (min-width: 640px) 50vw, 100vw"
                  className="h-40 w-full border border-ink object-cover object-top"
                />
              )}
              <p className="mt-2 flex items-baseline justify-between gap-2 font-label text-xs font-semibold uppercase tracking-[0.25em] text-accent">
                <span>{c.kicker}</span>
                <span aria-hidden="true" className="font-mono font-normal tracking-normal text-ink/70">
                  {i + 1}/{clippings.length}
                </span>
              </p>
              <h3 className="font-display text-xl font-bold leading-tight">
                <SmartLink href={`/work/${c.slug}`} className="hover:underline">
                  {c.title}
                </SmartLink>
              </h3>
              <p className="mt-1 font-body text-sm italic">{c.credit}</p>
            </motion.li>
          ))}
        </ul>
      </div>
      <button
        type="button"
        onClick={requestClose}
        className="fixed bottom-4 right-4 flex items-center gap-2 rounded-full border-2 border-ink bg-ink px-5 py-2.5 font-label text-sm uppercase tracking-widest text-paper shadow-[0_8px_20px_rgba(27,22,18,0.3)] transition-transform duration-100 hover:bg-accent hover:border-accent active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        <span aria-hidden="true">←</span>Close case file
      </button>
    </dialog>
  );
}
