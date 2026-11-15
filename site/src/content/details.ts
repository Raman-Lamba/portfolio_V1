import type { ProjectDetails } from './types';

// Keyed by project slug. Copy uses only verified facts about each project.
export const projectDetails: Record<string, ProjectDetails> = {
  'qiskit-portfolio-optimization': {
    problem:
      'Pick the best set of stocks for a portfolio: high return, low risk, a fixed number of stocks and, at the top level, a cap per sector. The search space grows quickly: 4,096 bitstrings at 12 stocks and 184,756 portfolios at 20.',
    approach:
      'QAOA with a mixer that keeps the number of stocks fixed and a start state made only of valid portfolios, so every sample is a valid answer. At 20 stocks a second design keeps both the count and the sector rule inside the circuit. Every result was checked against brute force, and the fast simulator was checked against the real Qiskit circuit.',
    result:
      'At 12 stocks the mixer beat penalty-based QAOA by 3.7 to 20 times and a random valid pick by 57 times, while greedy search stayed far cheaper, which the write-up says plainly. On the real ibm_fez chip, with error suppression, the 12-stock circuit gave a clear signal above noise.',
    stack: ['Qiskit', 'Python', 'NumPy'],
  },
  'gold-price-forecasting': {
    problem:
      'Forecast short-term gold prices under uncertainty, then turn the forecasts into trading decisions.',
    approach:
      'A probabilistic CNN-LSTM trained on 3,939 trading days, 9 macroeconomic indicators and more than 45 engineered features, with quantile models and checks on calibration and uncertainty. A risk-based strategy turns the model outputs into buy and sell signals.',
    result:
      '54-58% directional accuracy on 5-day forecasts and an 18% backtested strategy return. Feature-importance analysis looked at interest rates, the USD index, inflation and crude oil to see which indicators were most predictive.',
    stack: ['PyTorch', 'Python', 'Time series'],
  },
  'options-strategy-simulator': {
    problem:
      'Options strategies are hard to learn from textbooks. This game shows a real historical setup, lets you pick a strategy, then reveals how all ten would have done.',
    approach:
      'A Python pipeline fetches NSE F&O data from 2019 to 2024 and builds a pool of historical scenarios spread across market regimes, loaded into Supabase. A Next.js front end runs the rounds, and the backend scores all ten strategies using real entry premiums and the actual expiry settlement.',
    result:
      'A single-player learning game: ten rounds per playthrough, realized P&L for every strategy each round, your pick ranked against the rest, and a shared leaderboard.',
    stack: ['Python', 'Supabase', 'Next.js'],
    product: {
      user: 'Students and new traders who know the payoff diagrams but have never watched a strategy play out through a real expiry.',
      decisions: [
        'Real NSE data over simulated prices. Simulated paths are easier to build, but a result teaches more when it actually happened.',
        'Score all ten strategies every round, not only the one picked. The lesson is in the comparison: you see what you gave up.',
        'Scenarios spread across market regimes, so a playthrough is not ten rounds of the same market.',
        'Ten rounds and a shared leaderboard: short enough to finish in one sitting, with a reason to come back.',
      ],
      measure:
        "Completion: the share of players who finish all ten rounds. Learning: whether a returning player's pick ranks higher among the ten strategies than it did on their first playthrough.",
    },
  },
  'trade-simulator': {
    problem: 'Estimate the cost of a trade before placing it, in real time.',
    approach:
      'An online-learning SGD model predicts slippage tick by tick, an Almgren-Chriss model estimates market impact, and a logistic-regression classifier labels a trade as maker or taker. All three run in one live pipeline.',
    result:
      'A real-time analysis app documented model by model, with the parameters and the reasoning behind each choice.',
    stack: ['Python', 'scikit-learn'],
  },
  'deribit-oms': {
    problem:
      'Place, cancel and modify orders on a crypto derivatives exchange from code, and watch the order book live.',
    approach:
      'A C++ client built with cpr for HTTP requests, nlohmann_json for parsing and libwebsockets for streaming. It includes a WebSocket server that sends the live order book to several clients, refreshed every second.',
    result: "Works against Deribit's test exchange and suits synchronous calls best.",
    stack: ['C++', 'libwebsockets', 'cpr', 'nlohmann_json'],
  },
  'asian-paints-valuation': {
    problem: 'What is Asian Paints worth, and is the market price justified?',
    approach:
      'An Excel model combining an FCFF-based DCF (WACC 13.7%), a two-stage dividend discount model and peer multiples, benchmarked against Berger Paints and Kansai Nerolac using EMIS financials.',
    result:
      'An intrinsic value of Rs 586 per share against a market price of about Rs 2,580, concluding the stock was overvalued.',
    stack: ['Excel', 'EMIS'],
  },
  'lecture-hall-booking': {
    problem: 'Book lecture halls without ever double-booking one.',
    approach:
      'An interactive 3D building built with React Three Fiber that matches the real floor plan, with Supabase for sign-in, the database and realtime updates. A database constraint makes overlapping bookings impossible.',
    result: 'Multi-user booking for 11 rooms across three floors, live on Vercel.',
    stack: ['Next.js', 'React Three Fiber', 'Supabase', 'Tailwind CSS'],
  },
};
