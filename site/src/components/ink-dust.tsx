'use client';
import { useEffect, useRef } from 'react';
import { dustOpacity, exitProgress, gridFor, placeDot, sampleDots, sourceOpacity, type Dot } from '@/lib/ink-dust';

type Source = 'image' | 'text';

/**
 * Wraps one element (an <img>, or a single line of text) and, as it scrolls off the top of the
 * page, lets its ink loosen into halftone dots that drift right like dust off a printed sheet.
 * The real element stays in the DOM for crawlers and screen readers; the canvas is a visual layer
 * that is only redrawn while the visitor scrolls. Reduced-motion readers, and browsers where the
 * canvas cannot be set up, simply see the static page.
 */
export function InkDust({
  source,
  maxDots = [1600, 3200],
  reach = 3,
  className,
  children,
}: {
  source: Source;
  /** dot cap on [phones, larger screens] */
  maxDots?: [number, number];
  /** how far the dust may travel, in widths of the element */
  reach?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [capSmall, capLarge] = maxDots;

  useEffect(() => {
    const host = wrap.current;
    const target = host?.firstElementChild as HTMLElement | null;
    if (!host || !target) return;
    if (typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;pointer-events:none;';
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const small = window.matchMedia('(max-width: 767px)').matches;
    const cap = small ? capSmall : capLarge;
    // read ink from the wrapper, not the target: next/image sets `color: transparent` on its <img>
    const ink = getComputedStyle(host).color || '#1b1612';
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() || '#8b1e1e';
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let dots: Dot[] = [];
    let boxW = 0;
    let boxH = 0;
    let padTop = 0;
    let cw = 0;
    let ch = 0;
    let lastP = -1;
    let raf = 0;
    let visible = false;
    let alive = true;
    let sampledFor = '';

    const sample = async () => {
      const w = target.offsetWidth;
      const h = target.offsetHeight;
      if (!w || !h) return;
      const key = `${w}x${h}`;
      if (key === sampledFor) return;
      const { cols, rows } = gridFor(w, h, cap);
      const off = document.createElement('canvas');
      off.width = cols;
      off.height = rows;
      const octx = off.getContext('2d');
      if (!octx) return;
      octx.imageSmoothingQuality = 'high';
      if (source === 'image') {
        const img = target as HTMLImageElement;
        try {
          await img.decode();
        } catch {
          return; // the static picture stays
        }
        if (!alive) return;
        octx.drawImage(img, 0, 0, cols, rows);
      } else {
        await document.fonts.ready;
        if (!alive) return;
        const cs = getComputedStyle(target);
        const full = document.createElement('canvas');
        full.width = w;
        full.height = h;
        const fctx = full.getContext('2d');
        if (!fctx) return;
        fctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        if ('letterSpacing' in fctx) fctx.letterSpacing = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
        fctx.textBaseline = 'alphabetic';
        fctx.textAlign = cs.textAlign === 'center' ? 'center' : 'left';
        const text = target.textContent ?? '';
        const m = fctx.measureText(text);
        const size = parseFloat(cs.fontSize);
        const asc = m.fontBoundingBoxAscent || size * 0.8;
        const desc = m.fontBoundingBoxDescent || size * 0.2;
        const line = parseFloat(cs.lineHeight) || h;
        fctx.fillStyle = '#000';
        fctx.fillText(text, fctx.textAlign === 'center' ? w / 2 : 0, (h - line) / 2 + (line - asc - desc) / 2 + asc);
        octx.drawImage(full, 0, 0, cols, rows);
      }
      dots = sampleDots(octx.getImageData(0, 0, cols, rows).data, cols, rows, cap);
      sampledFor = key;
      lastP = -1;
      layout();
      draw();
    };

    // The canvas sits over the element and extends to the right (clamped to the page edge) and a
    // little above and below, so the dust has room to travel without causing any overflow.
    const layout = () => {
      boxW = target.offsetWidth;
      boxH = target.offsetHeight;
      padTop = Math.round(boxH * 0.25);
      const rect = target.getBoundingClientRect();
      const room = document.documentElement.clientWidth - rect.left - 2;
      cw = Math.max(boxW, Math.min(Math.round(boxW * reach), room));
      ch = boxH + padTop + Math.round(boxH * 0.5);
      canvas.style.left = `${target.offsetLeft}px`;
      canvas.style.top = `${target.offsetTop - padTop}px`;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
      canvas.width = Math.round(cw * dpr);
      canvas.height = Math.round(ch * dpr);
      lastP = -1;
    };

    const draw = () => {
      raf = 0;
      if (!visible || !dots.length) return;
      const rect = target.getBoundingClientRect();
      const p = exitProgress(window.scrollY, rect.top + window.scrollY, rect.height);
      if (p > 0 && p < 1 && Math.abs(p - lastP) < 0.0015) return;
      lastP = p;
      target.style.opacity = p <= 0 ? '' : String(sourceOpacity(p));
      ctx.setTransform(dpr, 0, 0, dpr, 0, padTop * dpr);
      ctx.clearRect(0, -padTop, cw, ch);
      const show = dustOpacity(p);
      if (show <= 0) return;
      // dots are batched by colour and a few alpha steps so each frame is a handful of fills
      const buckets: Record<string, Path2D[]> = {};
      for (let i = 0; i < dots.length; i++) {
        const d = placeDot(dots[i], p, boxW, boxH);
        if (!d) continue;
        const colour = dots[i].s > 0.92 ? accent : ink;
        const step = Math.min(4, Math.floor(d.a * 5));
        const list = (buckets[colour] ??= []);
        const path = (list[step] ??= new Path2D());
        path.moveTo(d.x + d.r, d.y);
        path.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      }
      for (const colour in buckets) {
        ctx.fillStyle = colour;
        buckets[colour].forEach((path, step) => {
          if (!path) return;
          ctx.globalAlpha = show * ((step + 0.5) / 5);
          ctx.fill(path);
        });
      }
      ctx.globalAlpha = 1;
    };

    const schedule = () => {
      if (!raf && visible) raf = requestAnimationFrame(draw);
    };
    const onResize = () => {
      layout();
      if (source === 'text') void sample();
      schedule();
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        window.addEventListener('scroll', schedule, { passive: true });
        schedule();
      } else {
        window.removeEventListener('scroll', schedule);
      }
    });

    host.appendChild(canvas);
    io.observe(host);
    window.addEventListener('resize', onResize);
    void sample();

    return () => {
      alive = false;
      io.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      target.style.opacity = '';
      canvas.remove();
    };
  }, [source, capSmall, capLarge, reach]);

  return (
    <div ref={wrap} className={className ? `relative ${className}` : 'relative'}>
      {children}
    </div>
  );
}
