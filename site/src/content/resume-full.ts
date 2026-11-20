export type ResumeEntry = { org: string; role: string; dates: string; bullets: string[] };

export const resumeFull = {
  summary:
    'MBA (Finance) candidate and CS engineer who builds AI agents, models and data tools for finance. First place in a finance case competition; winner of Qiskit Fall Fest 2026. Experience in private credit operations, equity valuation, and ML for markets.',
  education: [
    {
      school: 'Institute of Management Technology Hyderabad',
      detail: 'PGDM, Finance (GPA 8.99)',
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
        "Two private credit deals (AUM > $100M) had to go live on Oxane's platform: analysed and modelled both and validated their data and documents, so both launched with accurate data.",
        'To catch covenant breaches early, designed and built an automated alert system with double-step verification that flags likely breaches and escalates them.',
        'Deal onboarding needed manual configuration for every deal: built a metadata-driven data architecture that cut it and improved data integrity and traceability.',
        'Kept platform data trustworthy by querying, reconciling and validating large deal and portfolio datasets daily with advanced SQL and Excel.',
      ],
    },
    {
      org: 'Jivika',
      role: 'Developer (startup)',
      dates: 'Jun 2025',
      bullets: [
        'Replaced keyword search in a job-candidate matcher: built an AI backend (TypeScript, embeddings, Qdrant) with field weights so certifications compare in the right place; 0.7 match-relevance score on company data.',
      ],
    },
    {
      org: 'Coding Blocks',
      role: 'Teaching Assistant (Delhi)',
      dates: 'Aug 2024 - Feb 2025',
      bullets: [
        'Supported DSA students through twice-weekly doubt sessions: reviewed 500+ practice problems, ran 24+ extra concept sessions and helped students prepare for interviews.',
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
      org: 'Loan Reconciliation Agent',
      role: 'Python, Apache Fineract, MCP',
      dates: 'Nov 2026',
      bullets: [
        'Lenders match bank payments to loans by hand in Excel: built an AI agent that matches them in Apache Fineract, posts clear ones with a co-lending split and queues unclear ones for a person; 0 wrong of 1,348 auto-postings (synthetic data).',
      ],
    },
    {
      org: 'Quantum Portfolio Optimization (QAOA)',
      role: 'Qiskit, Python',
      dates: '2026',
      bullets: [
        'Picking 10 of 20 stocks under a sector cap: a constraint-preserving QAOA mixer beat penalty-based QAOA by 3.7-20x (12 stocks), checked by brute force on 184,756 portfolios and run on IBM ibm_fez hardware.',
      ],
    },
    {
      org: 'Quantitative Gold Price Forecasting',
      role: 'PyTorch, time series',
      dates: 'Mar 2026',
      bullets: [
        'To forecast gold with its uncertainty, built a probabilistic CNN-LSTM on 3,939 trading days and 9 macro indicators: 54-58% directional accuracy at 5 days; a risk-based strategy backtested at an 18% return.',
      ],
    },
    {
      org: 'Asian Paints Valuation',
      role: 'Excel, IMT Hyderabad',
      dates: 'Sep 2026',
      bullets: [
        "Tested whether Asian Paints' price was justified: FCFF DCF (WACC 13.7%), two-stage DDM and peer multiples gave Rs 586/share against a CMP of ~Rs 2,580, so the stock was overvalued.",
      ],
    },
    {
      org: 'Options Strategy Simulator',
      role: 'Python, Supabase, Next.js',
      dates: 'Aug 2026',
      bullets: [
        'Options strategies are hard to learn from textbooks: built a game on real NSE F&O data (2019-2024) that shows realized P&L for all 10 strategies per round, across market regimes.',
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
