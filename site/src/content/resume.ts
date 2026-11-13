import { awards } from './awards';

export type Classified = { id: string; heading: string; lead: string; body: string };

// Built from the awards data so the competition result is stated once, as a result only.
const honours = awards
  .filter((a) => a.id !== 'cfa')
  .map((a) => `${a.title} (${a.credit}).`)
  .join(' ');

export const classifieds: Classified[] = [
  {
    id: 'wanted',
    heading: 'Situations Wanted',
    lead: 'FINTECH ENGINEER.',
    body: 'MBA (Finance), IMT Hyderabad, GPA 9.14; B.Tech Computer Science. Builds models, simulators and data tools. Private credit, valuation, ML. Open to freelance and full-time roles.',
  },
  {
    id: 'skills',
    heading: 'Skills for Hire',
    lead: 'CODE & DATA.',
    body: 'Python, SQL, TypeScript/Next.js, C++, PyTorch, scikit-learn, Qiskit, RAG (Pinecone, ChromaDB), Supabase.',
  },
  {
    id: 'finance',
    heading: 'Skills for Hire',
    lead: 'FINANCE.',
    body: 'DCF, DDM, relative valuation, financial modelling, private credit, covenant monitoring. Excel, Power BI, Tableau.',
  },
  { id: 'honours', heading: 'Notices', lead: 'WINNERS.', body: honours },
];
