import type { ProjectFigure } from './types';

export const projectFigures: Record<string, ProjectFigure[]> = {
  'options-strategy-simulator': [
    {
      src: '/images/projects/options-simulator-result.png',
      alt: "Result screen of the options simulator: ten strategies ranked by profit and loss for one round, with the player's Long Call second.",
      caption: 'Round 1 result: a Long Call on HDFCBANK in the May 2022 crash ranked second of ten strategies.',
      width: 3825,
      height: 1950,
    },
  ],
  'qiskit-portfolio-optimization': [
    {
      src: '/images/projects/qiskit-hardware-valid-rate.png',
      alt: 'Bar chart of the valid-portfolio rate on the ibm_fez chip for 8 and 12 stocks: pure noise against hardware runs with and without error suppression. At 12 stocks, p=1: 5.3% noise, 14.3% without, 15.2% with XY4 decoupling.',
      caption:
        "Share of hardware shots that were a valid portfolio, on IBM's ibm_fez chip. At 12 stocks (p=1) the rate was 15.2% with XY4 error suppression, about three times the 5.3% expected from pure noise; a noiseless simulator is 100% by construction.",
      width: 1200,
      height: 640,
    },
  ],
  'gold-price-forecasting': [
    {
      src: '/images/projects/gold-residual-diagnostics.png',
      alt: 'Four charts: residual distribution, residuals over time, a normal Q-Q plot and uncertainty width against actual error.',
      caption:
        'Residual diagnostics: error distribution, errors over time, a normal Q-Q plot, and predicted uncertainty width against actual error.',
      width: 2220,
      height: 1475,
    },
    {
      src: '/images/projects/gold-price-targets.png',
      alt: 'Five-day price targets from the model, from a bearish 10th percentile to a bullish 90th percentile.',
      caption: 'Five-day price targets from the probabilistic model, from the 10th to the 90th percentile.',
      width: 1225,
      height: 230,
    },
  ],
  'lecture-hall-booking': [
    {
      src: '/images/projects/lecture-hall-booking.png',
      alt: 'Booking screen: date and time pickers above an interactive 3D model of the lecture halls, coloured by availability.',
      caption: 'Pick a date and time window, then click an available room in the 3D building to book it.',
      width: 3817,
      height: 1752,
    },
  ],
};
