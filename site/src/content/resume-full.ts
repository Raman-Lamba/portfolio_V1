export type ResumeEntry = { org: string; role: string; dates: string; bullets: string[] };

export const resumeFull = {
  summary:
    'MBA (Finance) candidate and CS engineer who builds models, simulators and data tools for finance. First place in a finance case competition; winner of Qiskit Fall Fest 2026. Experience in private credit operations, equity valuation, and ML for markets.',
  education: [
    {
      school: 'Institute of Management Technology Hyderabad',
      detail: 'PGDM, Finance (GPA 9.14)',
      dates: 'Jul 2025 - Mar 2027',
    },
    { school: 'CRSSIET, NCR', detail: 'B.Tech, Computer Science (82.22%)', dates: 'Jul 2021 - Jun 2025' },
  ],
  experience: [
    {
      org: 'Oxane Partners',
      role: 'Summer Intern, Private Credit (Gurugram)',
      dates: 'Apr - Jun 2026',
      bullets: [
        "Analysed, modelled and onboarded 2 private credit deals (AUM > $100M) onto Oxane's native platform, validating deal data and documents so both went live with accurate data.",
        'Designed and built an automated covenant-monitoring alert system with double-step verification for early breach detection and escalation.',
        'Built a metadata-driven data architecture that cut manual configuration in deal onboarding and improved data integrity and traceability.',
      ],
    },
    {
      org: 'Jivika',
      role: 'Developer (startup)',
      dates: 'Jun 2025',
      bullets: [
        'Built backend for an AI job-candidate matching system (TypeScript, embeddings, Qdrant vector search); fixed the matching API response format.',
      ],
    },
    {
      org: 'Coding Blocks',
      role: 'Teaching Assistant (Delhi)',
      dates: 'Aug 2024 - Feb 2025',
      bullets: [
        'Solved student doubts on DSA problems in twice-weekly sessions, assisted students in interviews, reviewed 500+ practice problems and ran 24+ extra concept sessions.',
      ],
    },
  ] satisfies ResumeEntry[],
  honours: [
    'First place, UBS Financial Challenge (Team Cygnus, Sep 2026). Winning team in a finance case competition; led most of the analysis and solution design.',
    'Winner, Qiskit Fall Fest 2026 (IIIT-Delhi), Track 2 Quantum Optimization. Solo entry; reached the Advanced level.',
    'CFA Institute Research Challenge: relative valuation for APL Apollo Tubes in the IMT Hyderabad team report.',
  ],
  projects: [
    {
      org: 'Quantum Portfolio Optimization (QAOA)',
      role: 'Qiskit, Python',
      dates: '2026',
      bullets: [
        'Chose 10 of 20 stocks under a sector cap, verified against brute force on 184,756 portfolios; a constraint-preserving mixer beat penalty-based QAOA by 3.7-20x (12 stocks); ran on IBM ibm_fez hardware.',
      ],
    },
    {
      org: 'Quantitative Gold Price Forecasting',
      role: 'PyTorch, time series',
      dates: 'Mar 2026',
      bullets: [
        'Probabilistic CNN-LSTM on 3,939 trading days, 9 macro indicators and 45+ features: 54-58% directional accuracy on 5-day forecasts; a risk-based strategy backtested at an 18% return.',
      ],
    },
    {
      org: 'Asian Paints Valuation',
      role: 'Excel, IMT Hyderabad',
      dates: 'Sep 2026',
      bullets: [
        'FCFF DCF (WACC 13.7%), two-stage DDM and peer multiples vs Berger Paints and Kansai Nerolac; intrinsic value Rs 586/share vs CMP ~Rs 2,580, concluding the stock was overvalued.',
      ],
    },
    {
      org: 'Options Strategy Simulator',
      role: 'Python, Supabase, Next.js',
      dates: 'Aug 2026',
      bullets: [
        'Game on real NSE F&O data (2019-2024): computes realized P&L for 10 strategies per scenario, with a regime-stratified scenario pool.',
      ],
    },
    {
      org: 'Trade Simulator & Deribit OMS',
      role: 'Python, C++',
      dates: '2024-25',
      bullets: [
        'Real-time slippage model (online SGD), Almgren-Chriss market impact and maker/taker classifier; C++ order management client for Deribit testnet with a live order-book WebSocket server.',
      ],
    },
  ] satisfies ResumeEntry[],
  skills: [
    {
      label: 'Finance',
      items: 'DCF, DDM, relative valuation, financial modelling, private credit, covenant monitoring',
    },
    {
      label: 'Code & Data',
      items: 'Python, SQL, TypeScript/Next.js, C++, PyTorch, scikit-learn, Qiskit, RAG (Pinecone, ChromaDB), Supabase',
    },
    { label: 'Tools', items: 'Excel, Power BI, Tableau, Git' },
  ],
};
