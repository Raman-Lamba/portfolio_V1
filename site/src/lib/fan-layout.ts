// Tilt (degrees) and lift (pixels) for each clipping in a hand-placed fan.
export function fanLayout(n: number): { rotate: number; lift: number }[] {
  if (n <= 0) return [];
  const mid = (n - 1) / 2;
  return Array.from({ length: n }, (_, i) => {
    const d = i - mid;
    const rotate = Math.max(-8, Math.min(8, Math.round(d * 3 * 10) / 10));
    return { rotate: rotate === 0 ? 0 : rotate, lift: Math.round(Math.abs(d) * 10) };
  });
}
