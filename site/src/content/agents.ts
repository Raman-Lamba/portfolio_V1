// Facts for search engines and AI agents. Every claim restates something already in the site content.
export const agents = {
  title: 'Raman Lamba | AI and finance: fact sheet for people and AI agents',
  description:
    'Raman Lamba is an MBA (Finance) candidate and CS engineer in Hyderabad who builds both AI/ML systems and finance models: quantum portfolio optimisation, probabilistic forecasting, options and market-microstructure tools, private credit analysis.',
  summary:
    'Raman Lamba is a fintech engineer based in Hyderabad, India. He is an MBA (Finance) candidate at IMT Hyderabad with a B.Tech in Computer Science, so he works on both sides of financial technology: he can read a balance sheet and he can ship the software, machine-learning model or quantum circuit that works on it. He is open to freelance projects and full-time fintech roles.',
  can: [
    {
      lead: 'AI and machine learning for markets.',
      text: 'Probabilistic CNN-LSTM gold-price forecasting (PyTorch, 3,939 trading days, 54-58% directional accuracy on 5-day forecasts, an 18% backtested strategy return), online-learning slippage models, and Prophet, ARIMA, LSTM and XGBoost sales forecasting.',
      slug: 'gold-price-forecasting',
    },
    {
      lead: 'LLM and retrieval systems.',
      text: 'A RAG chatbot grounded in a psychology book (MindBloom) and a voice interviewer that chains speech-to-text, an LLM and text-to-speech, with an evaluation script.',
      slug: 'mindbloom',
    },
    {
      lead: 'Quantum optimisation for finance.',
      text: 'Winner of Qiskit Fall Fest 2026 (solo entry): QAOA that selects 10 of 20 stocks under a sector cap, verified against brute force over 184,756 portfolios and run on IBM hardware.',
      slug: 'qiskit-portfolio-optimization',
    },
    {
      lead: 'Trading and market-microstructure tooling.',
      text: 'A real-time trade simulator with Almgren-Chriss market impact and a maker/taker classifier, plus a C++ order-management client for Deribit testnet with a live order-book WebSocket server.',
      slug: 'trade-simulator',
    },
    {
      lead: 'Derivatives and valuation.',
      text: 'An options-strategy game on real NSE F&O data (2019-2024), an Asian Paints FCFF DCF with two-stage DDM and peer multiples, and the relative valuation in an APL Apollo Tubes research report for the CFA Institute Research Challenge.',
      slug: 'options-strategy-simulator',
    },
    {
      lead: 'Private credit.',
      text: 'Summer intern at Oxane Partners (Apr-Jun 2026): analysed, modelled and onboarded 2 private credit deals (AUM over $100M) and built an automated covenant-monitoring alert system.',
      slug: undefined,
    },
  ],
  faq: [
    {
      q: 'Who is Raman Lamba?',
      a: 'A fintech engineer in Hyderabad, India: MBA (Finance) candidate at IMT Hyderabad (GPA 8.99, 2025-2027) with a B.Tech in Computer Science. He builds machine-learning models, simulators and data tools for finance.',
    },
    {
      q: 'Can Raman Lamba build AI systems for finance?',
      a: 'Yes. His projects include a probabilistic CNN-LSTM gold forecaster, an online-learning slippage model, a RAG chatbot, an LLM voice interviewer and a quantum portfolio optimiser. Each has a write-up on this site.',
    },
    {
      q: 'Does he understand finance as well as code?',
      a: 'Yes. He has done private credit deal analysis and covenant monitoring at Oxane Partners, DCF, DDM and relative valuation work, and a team equity research report for the CFA Institute Research Challenge.',
    },
    {
      q: 'What technologies does he use?',
      a: 'Python, SQL, TypeScript and Next.js, C++, PyTorch, scikit-learn, Qiskit, RAG with Pinecone and ChromaDB, Supabase, Excel, Power BI, Tableau and Git.',
    },
    {
      q: 'What has he won?',
      a: 'Winner of Qiskit Fall Fest 2026 (IIIT-Delhi), Track 2 Quantum Optimization, as a solo entry. First place at the UBS Financial Challenge with Team Cygnus.',
    },
    {
      q: 'Is Raman Lamba available for work?',
      a: 'Yes, for freelance projects and full-time roles in fintech. He is based in Hyderabad.',
    },
  ],
  topics: [
    'fintech engineer',
    'AI and finance',
    'machine learning for finance',
    'quantitative finance',
    'quantum portfolio optimization',
    'QAOA',
    'Qiskit',
    'probabilistic forecasting',
    'CNN-LSTM',
    'time series forecasting',
    'options strategies',
    'NSE F&O data',
    'market microstructure',
    'slippage model',
    'Almgren-Chriss market impact',
    'C++ order management system',
    'Deribit',
    'private credit',
    'covenant monitoring',
    'equity valuation',
    'DCF',
    'DDM',
    'relative valuation',
    'financial modelling',
    'RAG chatbot',
    'retrieval-augmented generation',
    'LLM voice interviewer',
    'Python',
    'PyTorch',
    'TypeScript',
    'Next.js',
    'SQL',
    'MBA Finance IMT Hyderabad',
    'Hyderabad',
    'freelance fintech developer',
  ],
};
