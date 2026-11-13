import type { Ad } from './types';

export const ads: Ad[] = [
  {
    id: 'wanted',
    headline: 'WANTED: a developer who reads balance sheets',
    body: 'Inquire within.',
    cta: 'Clip the coupon',
    href: '#contact',
  },
  {
    id: 'backtest',
    headline: 'Backtest before you bet',
    body: 'Probabilistic gold forecasts, with the uncertainty shown.',
    cta: 'Read the story',
    href: '/work/gold-price-forecasting',
  },
  {
    id: 'quantum',
    headline: 'Quantum portfolios, now in stock',
    body: 'Winner, Qiskit Fall Fest 2026.',
    cta: 'Read the story',
    href: '/work/qiskit-portfolio-optimization',
  },
];
