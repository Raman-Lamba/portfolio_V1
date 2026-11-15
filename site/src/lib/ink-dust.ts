// Pure maths for the "ink dust" effect: a portrait or a line of set type is sampled once into a
// capped number of halftone dots; as the element scrolls off the top of the page the dots loosen and
// drift to the right like dust off a printed sheet, and re-form when the visitor scrolls back.
// Everything here is a function of scroll position, so nothing moves while the page is still.

export interface Dot {
  /** centre, normalised to the sampled box (0..1) */
  x: number;
  y: number;
  /** radius as a fraction of the box width */
  r: number;
  /** darkness 0..1 (how much ink the cell holds) */
  k: number;
  /** stable per-dot seed 0..1 */
  s: number;
}

export interface PlacedDot {
  x: number;
  y: number;
  r: number;
  a: number;
}

export const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

export function smoothstep(t: number, from: number, to: number) {
  const x = clamp01((t - from) / (to - from));
  return x * x * (3 - 2 * x);
}

/** Deterministic pseudo-random in [0,1) from an integer index. */
export function hashSeed(i: number) {
  let h = (i + 1) * 0x9e3779b1;
  h = Math.imul(h ^ (h >>> 15), 0x85ebca77);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae3d);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** Grid that spreads at most `maxDots` cells over a width x height box. */
export function gridFor(width: number, height: number, maxDots: number) {
  const cell = Math.sqrt((width * height) / Math.max(1, maxDots));
  return { cols: Math.max(1, Math.floor(width / cell)), rows: Math.max(1, Math.floor(height / cell)) };
}

/**
 * Turns RGBA pixels (one pixel per grid cell) into dots: a cell gets a dot when it holds enough ink,
 * sized like a halftone dot by its darkness. Never returns more than `maxDots`.
 */
export function sampleDots(
  rgba: ArrayLike<number>,
  cols: number,
  rows: number,
  maxDots: number,
  threshold = 0.14,
): Dot[] {
  const dots: Dot[] = [];
  const cellW = 1 / cols;
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const o = (j * cols + i) * 4;
      const lum = (0.299 * rgba[o] + 0.587 * rgba[o + 1] + 0.114 * rgba[o + 2]) / 255;
      const raw = (1 - lum) * (rgba[o + 3] / 255);
      if (raw < threshold) continue;
      // a cell averages a halftone's dots with the paper between them, so lift the midtones or the
      // face comes out far fainter than the hair and jacket
      const k = Math.pow(raw, 0.55);
      const s = hashSeed(j * cols + i);
      dots.push({
        x: (i + 0.5) * cellW,
        y: (j + 0.5) / rows,
        r: cellW * 0.5 * (0.45 + 0.7 * k),
        k,
        s,
      });
    }
  }
  if (dots.length > maxDots) dots.sort((a, b) => b.k - a.k).length = maxDots;
  return dots;
}

/**
 * 0 while the page sits at the top, 1 the moment the element has scrolled off the top edge.
 * `docTop` is the element's offset from the top of the document.
 */
export function exitProgress(scrollY: number, docTop: number, height: number) {
  const range = docTop + height;
  return range <= 0 ? 1 : clamp01(scrollY / range);
}

/** Opacity of the real element underneath: it gives way gradually as the dots begin to loosen. */
export const sourceOpacity = (p: number) => 1 - smoothstep(p, 0.08, 0.38);

/** How strongly the dot layer shows: it comes in a touch ahead of the source fading out. */
export const dustOpacity = (p: number) => smoothstep(p, 0.04, 0.3);

/**
 * Where a dot sits at progress `p` inside a box of boxW x boxH CSS pixels. Dots on the right edge
 * let go first and everything drifts right, a little up or down, thinning as it travels. Returns
 * null once the dot is too faint to be worth drawing.
 */
export function placeDot(d: Dot, p: number, boxW: number, boxH: number): PlacedDot | null {
  const start = (1 - d.x) * 0.45 + d.s * 0.3;
  const local = clamp01((p - start) / (1 - start));
  const e = local * local;
  const a = d.k * (1 - local) * (1 - 0.4 * local);
  if (a < 0.02) return null;
  const s2 = (d.s * 7.31) % 1;
  return {
    x: (d.x + e * (0.5 + 1.8 * d.s)) * boxW,
    y: d.y * boxH + e * boxH * (s2 - 0.35) * 0.45,
    r: d.r * boxW * (1 - 0.35 * local),
    a,
  };
}
