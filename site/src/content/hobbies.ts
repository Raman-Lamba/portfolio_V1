export type Stat = { value: string; label: string };

// Personal bests kept for fun; wording stays modest on purpose.
export const hobbies = {
  kicker: 'Off the clock',
  note: 'Running and lifting. Figures are kept for fun.',
  stats: [
    { value: '56 min', label: '10 km personal best (an old one)' },
    { value: '60 kg', label: 'Bench press, current' },
    { value: '80 kg', label: 'Squat, current' },
  ] satisfies Stat[],
};
